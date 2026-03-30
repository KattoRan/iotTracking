"use client";

import React, { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    useMap,
    ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import DeviceMarker from "./DeviceMarker";
import BtsMarker from "./BtsMarker";
import type { BtsStation } from '@/types/bts'

/* =======================
   Type definitions
======================= */

export interface Device {
    id: string;
    latitude?: number;
    longitude?: number;
}

/* =======================
   Fly to selected device
======================= */
interface FlyToDeviceProps {
    device: Device;
}

function FlyToDevice({ device }: FlyToDeviceProps) {
    const map = useMap();

    useEffect(() => {
        if (device.latitude && device.longitude) {
            map.flyTo([device.latitude, device.longitude], 15, {
                duration: 1,
            });
        }
    }, [device.id, device.latitude, device.longitude, map]);

    return null;
}

/* =======================
   Fit bounds for all devices
======================= */
interface FitBoundsProps {
    devices: Device[];
}

function FitBounds({ devices }: FitBoundsProps) {
    const map = useMap();
    const fitted = useRef(false);

    useEffect(() => {
        if (!fitted.current && devices.length > 0) {
            const validDevices = devices.filter(
                (d) => d.latitude && d.longitude
            );

            if (validDevices.length > 0) {
                map.fitBounds(
                    validDevices.map((d) => [d.latitude!, d.longitude!]),
                    {
                        padding: [60, 60],
                        maxZoom: 14,
                    }
                );
                fitted.current = true;
            }
        }
    }, [devices, map]);

    return null;
}

/* =======================
   MapView main component
======================= */
interface MapViewProps {
    devices: Device[];
    btsStations: BtsStation[];
    selectedDevice?: Device | null;
    onDeviceClick: (device: Device) => void;

    showBts: boolean;
    showCoverage: boolean;
    showBtsLines: boolean;
}

export default function MapView({
    devices,
    btsStations,
    selectedDevice,
    onDeviceClick,
    showBts,
    showCoverage,
    showBtsLines,
}: MapViewProps) {
    return (
        <MapContainer
            center={[21.0285, 105.8542]} // Hà Nội
            zoom={12}
            className="w-full h-full"
            zoomControl={false}
        >
            {/* ================= Map background ================= */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
            />

            <ZoomControl position="bottomright" />

            {/* ================= Auto fit ================= */}
            <FitBounds devices={devices} />

            {/* ================= Fly to selected device ================= */}
            {selectedDevice && <FlyToDevice device={selectedDevice} />}

            {/* ================= BTS stations ================= */}
            {showBts &&
                btsStations.map((station) => (
                    <BtsMarker
                        key={station.id}
                        station={station}
                        showCoverage={showCoverage}
                    />
                ))}

            {/* ================= Devices ================= */}
            {devices.map((device) => (
                <DeviceMarker
                    key={device.id}
                    device={device}
                    onClick={onDeviceClick}
                    showBtsLine={showBtsLines}
                    btsStations={btsStations}
                />
            ))}
        </MapContainer>
    );
}