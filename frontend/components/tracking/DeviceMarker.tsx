"use client";

import React from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

/* =======================
   Types
======================= */

export interface Device {
    id: string;
    name?: string;
    latitude?: number;
    longitude?: number;
    status?: "online" | "idle" | "offline";
    bts_id?: number;
    last_address?: string;
}

export interface BtsStation {
    id: number;
    latitude: number;
    longitude: number;
}

/* =======================
   Device icon (single icon)
======================= */

const getStatusColor = (status?: Device["status"]) => {
    switch (status) {
        case "online":
            return "#22c55e"; // xanh lá
        case "idle":
            return "#f59e0b"; // cam
        default:
            return "#6b7280"; // xám (offline)
    }
};

const getDeviceIcon = (status?: Device["status"]) => {
    const color = getStatusColor(status);

    return L.divIcon({
        html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:${color};
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 12px ${color}66;
        border:2px solid #ffffffaa;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <rect x="7" y="2" width="10" height="20" rx="2" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="18" r="1" fill="white"/>
        </svg>
      </div>
    `,
        className: "device-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
};

/* =======================
   Component
======================= */

interface DeviceMarkerProps {
    device: Device;
    btsStations?: BtsStation[];
    showBtsLine?: boolean;
    onClick?: (device: Device) => void;
}

export default function DeviceMarker({
    device,
    btsStations = [],
    showBtsLine = false,
    onClick,
}: DeviceMarkerProps) {
    if (!device.latitude || !device.longitude) return null;

    const connectedBts = btsStations.find(
        (bts) => bts.id === device.bts_id
    );

    return (
        <>
            {/* ===== Device ↔ BTS line ===== */}
            {showBtsLine &&
                connectedBts &&
                connectedBts.latitude &&
                connectedBts.longitude && (
                    <Polyline
                        positions={[
                            [device.latitude, device.longitude],
                            [connectedBts.latitude, connectedBts.longitude],
                        ]}
                        pathOptions={{
                            color: "#94a3b8",
                            weight: 1.5,
                            opacity: 0.6,
                            dashArray: "6 4",
                        }}
                    />
                )}

            {/* ===== Device marker ===== */}
            <Marker
                position={[device.latitude, device.longitude]}
                icon={getDeviceIcon(device.status)}
                eventHandlers={{
                    click: () => onClick?.(device),
                }}
            >
                <Popup>
                    <div
                        style={{
                            minWidth: "160px",
                            background: "#0f172a",
                            color: "#e5e7eb",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #1e293b",
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>
                            {device.name || "Thiết bị"}
                        </div>

                        <div style={{ fontSize: "12px", marginBottom: 4 }}>
                            Trạng thái:{" "}
                            <span style={{ color: getStatusColor(device.status) }}>
                                {device.status || "offline"}
                            </span>
                        </div>

                        {device.last_address && (
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                {device.last_address}
                            </div>
                        )}
                    </div>
                </Popup>
            </Marker>
        </>
    );
}