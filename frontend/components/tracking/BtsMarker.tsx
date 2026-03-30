"use client"

import React from "react"
import { Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import type { BtsStation } from '@/types/bts'

const BASE_COLOR = "#38bdf8" // màu trung tính

const getBtsIcon = (station: BtsStation) => {
    const isActive = station.status === "active"

    return L.divIcon({
        html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        ${isActive
                ? `<div style="
                position:absolute;
                inset:0;
                width:28px;
                height:28px;
                border-radius:8px;
                border:2px solid ${BASE_COLOR};
                animation:pulse-ring 2s ease-out infinite;
                opacity:0.35;
              "></div>`
                : ""
            }

        <div style="
          width:28px;height:28px;
          background:#0d1117;
          border:2px solid ${BASE_COLOR};
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 0 12px ${BASE_COLOR}44;
          position:relative;
        ">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
            <path d="M4.5 8.5C4.5 5.46 7.46 3 12 3s7.5 2.46 7.5 5.5" stroke="${BASE_COLOR}" stroke-width="2" stroke-linecap="round"/>
            <path d="M7 11c0-2.21 2.24-4 5-4s5 1.79 5 4" stroke="${BASE_COLOR}" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="12" y1="13" x2="12" y2="21" stroke="${BASE_COLOR}" stroke-width="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="${BASE_COLOR}" stroke-width="2"/>
            <circle cx="12" cy="13" r="1.5" fill="${BASE_COLOR}"/>
          </svg>
        </div>
      </div>
    `,
        className: "bts-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    })
}

interface Props {
    station: BtsStation
    showCoverage?: boolean
}

export default function BtsMarker({ station, showCoverage }: Props) {
    if (!station.latitude || !station.longitude) return null

    return (
        <>
            {showCoverage && station.status === "active" && (
                <Circle
                    center={[station.latitude, station.longitude]}
                    radius={800}
                    pathOptions={{
                        color: BASE_COLOR,
                        fillColor: BASE_COLOR,
                        fillOpacity: 0.04,
                        weight: 1,
                        opacity: 0.25,
                        dashArray: "4 4",
                    }}
                />
            )}

            <Marker
                position={[station.latitude, station.longitude]}
                icon={getBtsIcon(station)}
            >
            </Marker>
        </>
    )
}