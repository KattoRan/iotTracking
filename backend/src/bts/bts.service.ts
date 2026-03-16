import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MapQueryDto } from './dto/map-query.dto';
import axios from 'axios';

@Injectable()
export class BtsService {
  private readonly apiUrl = 'https://us1.unwiredlabs.com/v2/process.php';
  private readonly logger = new Logger(BtsService.name);
  private readonly API_KEY = process.env.OPENCELLID_API_KEY;

  constructor(private prisma: PrismaService) {}

  /**
   * Lấy hoặc fetch 1 cell duy nhất bằng API UnwiredLabs
   */
  async getOrFetchStation(
    mcc: number,
    mnc: number,
    lac: number,
    cid: number,
    radio: string = 'lte',
  ) {
    const existing = await this.prisma.bts_stations.findUnique({
      where: {
        mcc_mnc_lac_cid: {
          mcc,
          mnc,
          lac,
          cid,
        },
      }
    });

    if (existing) return existing;

    const payload = {
      token: this.API_KEY,
      radio,
      mcc,
      mnc,
      cells: [{ lac, cid }],
      address: 1,
    };

    try {
      const response = await axios.post(this.apiUrl, payload);
      const data = response.data;

      if (data.status === 'ok' && data.lat && data.lon) {
        return await this.prisma.bts_stations.create({
          data: {
            mcc,
            mnc,
            lac,
            cid,
            lat: data.lat,
            lon: data.lon,
            radio,
            range: data.accuracy || data.range || 0,
            address: data.address || '',
          },
        });
      }
    } catch (error) {
      this.logger.error(
        `API error: ${mcc}-${mnc}-${lac}-${cid} => ${error?.message}`,
      );
    }

    return null;
  }

  /* ================= MAP API ================= */

  async getForMap(query: MapQueryDto) {
    const west = Number(query.west);
    const south = Number(query.south);
    const east = Number(query.east);
    const north = Number(query.north);
    const zoom = Number(query.zoom ?? 15);

    if (zoom < 13) {
      return this.getCluster(west, south, east, north);
    }

    return this.getRawBts(west, south, east, north);
  }

  /**
   * BTS thật – zoom cao
   * DÙNG RAW vì PostGIS
   */
  private async getRawBts(
    west: number,
    south: number,
    east: number,
    north: number,
  ) {
    return this.prisma.$queryRaw<
      {
        id: number;
        lat: number;
        lon: number;
        radio: string | null;
      }[]
    >`
      SELECT
        id,
        lat,
        lon,
        radio
      FROM bts_stations
      WHERE geom && ST_MakeEnvelope(
        ${west}, ${south}, ${east}, ${north}, 4326
      )
      LIMIT 2000;
    `;
  }

  /**
   * CLUSTER – zoom thấp
   */
  private async getCluster(
    west: number,
    south: number,
    east: number,
    north: number,
  ) {
    return this.prisma.$queryRaw<
      {
        lat: number;
        lon: number;
        count: number;
      }[]
    >`
      SELECT
        ST_Y(ST_Centroid(ST_Collect(geom))) AS lat,
        ST_X(ST_Centroid(ST_Collect(geom))) AS lon,
        COUNT(*)::int AS count
      FROM bts_stations
      WHERE geom && ST_MakeEnvelope(
        ${west}, ${south}, ${east}, ${north}, 4326
      )
      GROUP BY ST_SnapToGrid(geom, 0.01);
    `;
  }

  /* ================= DETAIL ================= */

  /**
   * BTS detail
   */
  async getDetail(id: number) {
    const bts = await this.prisma.bts_stations.findUnique({
      where: { id },
      select: {
        id: true,
        radio: true,
        range: true,
        address: true,
        lat: true,
        lon: true,
        mcc: true,
        mnc: true,
        lac: true,
        cid: true,
      },
    });

    if (!bts) {
      throw new NotFoundException('BTS not found');
    }

    return bts;
  }
}