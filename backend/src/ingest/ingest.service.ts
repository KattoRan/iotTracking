// data.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BtsService } from '../bts/bts.service';
import { EventsGateway } from '../events/events.gateway';
import { SubmitDataDto } from './dto/submit-data.dto';
import { isValidCell, markServingCell } from './ingest.utils';
import PQueue from 'p-queue';
import axios from 'axios';

@Injectable()
export class IngestService {
  // Giới hạn lookup BTS song song
  private readonly btsQueue = new PQueue({ concurrency: 2 });

  constructor(
    private readonly prisma: PrismaService,
    private readonly btsService: BtsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // =========================
  // REVERSE GEOCODE (NON BLOCK)
  // =========================
  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const url = `https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`;

      const res = await axios.get(url, {
        timeout: 8000,
        headers: { 'User-Agent': 'MobileSupervisorApp/1.0' },
      });

      return res.data?.display_name || '';
    } catch (e: any) {
      console.log(`LocationIQ error ${lat},${lon}: ${e.message}`);
      return '';
    }
  }

  // =========================
  // MAIN ENTRY
  // =========================
  async saveData(deviceId: string, dto: SubmitDataDto) {
    if (!deviceId) {
      throw new BadRequestException('Missing device id');
    }
    if (!dto?.location) {
      throw new BadRequestException('Missing location');
    }

    const now = new Date();

    /* =========================
       XỬ LÝ CELL TRƯỚC
    ========================= */
    const validCells = dto.cellTowers.filter(isValidCell);
    const cellsWithServing =
      validCells.length > 0 ? markServingCell(validCells) : [];
    const servingCell = cellsWithServing.find((c) => c.isServing);

    /* =========================
       EMIT REALTIME (NGAY)
    ========================= */
    this.eventsGateway.server.emit('device_moved', {
      deviceId,
      lat: dto.location.latitude,
      lon: dto.location.longitude,
      cid: servingCell?.cid ?? null,
      lac: servingCell?.lac ?? null,
      signalDbm: servingCell?.signalDbm ?? null,
      timestamp: now.toISOString(),
    });

    /* =========================
       BACKGROUND SAVE + GEOCODE
    ========================= */
    this.processSaveInBackground(
      deviceId,
      dto.location,
      cellsWithServing,
      now,
    );

    /* =========================
       BACKGROUND BTS LOOKUP
    ========================= */
    if (servingCell) {
      this.lookupBtsInBackground(servingCell);
    }

    return {
      success: true,
      message: 'Data received',
    };
  }

  // =========================
  // SAVE DB + GEOCODE
  // =========================
  private async processSaveInBackground(
    deviceId: string,
    location: { latitude: number; longitude: number },
    cells: any[],
    now: Date,
  ) {
    try {
      // KHÔNG await ở đây → thật sự background
      const addressPromise = this.reverseGeocode(
        location.latitude,
        location.longitude,
      );

      await this.prisma.$transaction(async (tx) => {
        // GPS
        await tx.location_history.create({
          data: {
            device_id: deviceId,
            latitude: location.latitude,
            longitude: location.longitude,
            recorded_at: now,
          },
        });

        // CELL HISTORY
        if (cells.length > 0) {
          await tx.cell_tower_history.createMany({
            data: cells.map((c) => ({
              device_id: deviceId,
              type: c.type,
              mcc: c.mcc,
              mnc: c.mnc,
              lac: c.lac,
              cid: c.cid,
              rssi: c.rssi ?? null,
              signal_dbm: c.signalDbm,
              pci: c.pci ?? null,
              is_serving: c.isServing,
              recorded_at: now,
            })),
          });
        }

        // LAST SEEN
        await tx.devices.update({
          where: { id: deviceId },
          data: { last_seen: now },
        });
      });

      // UPDATE ADDRESS SAU (KHÔNG BLOCK)
      const address = await addressPromise;
      if (address) {
        await this.prisma.location_history.updateMany({
          where: { device_id: deviceId, recorded_at: now },
          data: { district: address },
        });
      }
    } catch (err) {
      console.error('Background save error:', err);
    }
  }

  // =========================
  // BTS LOOKUP (SERVING ONLY)
  // =========================
  private lookupBtsInBackground(cell: any) {
    this.btsQueue.add(() =>
      this.btsService.getOrFetchStation(
        cell.mcc,
        cell.mnc,
        cell.lac,
        cell.cid,
        cell.type,
      ),
    );
  }
}