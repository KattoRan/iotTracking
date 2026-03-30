'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import type { BtsStation } from '@/types/bts';

// Mock devices data (giữ nguyên)
const mockDevices = [
    {
        id: 'dev-001',
        name: 'Tracker 01',
        lat: 21.0285,
        lng: 105.8542,
        status: 'online',
        battery: 86,
        updated_date: new Date().toISOString(),
    },
    {
        id: 'dev-002',
        name: 'Tracker 02',
        lat: 21.035,
        lng: 105.83,
        status: 'offline',
        battery: 42,
        updated_date: new Date().toISOString(),
    },
];

// Dynamic import cho các component cần DOM/window
const MapView = dynamic(
    () => import('@/components/tracking/MapView'),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-gray-900">
                <div className="text-white">Đang tải bản đồ...</div>
            </div>
        )
    }
);

const MapControls = dynamic(
    () => import('@/components/tracking/MapControls'),
    { ssr: false }
);

const DeviceDetailPanel = dynamic(
    () => import('@/components/tracking/DeviceDetailPanel'),
    { ssr: false }
);

// Component chính
export default function TrackingPage() {
    const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
    const [showBts, setShowBts] = useState(true);
    const [showCoverage, setShowCoverage] = useState(false);
    const [showBtsLines, setShowBtsLines] = useState(true);
    const [btsStations, setBtsStations] = useState<BtsStation[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch BTS data (giữ nguyên)
    React.useEffect(() => {
        const fetchBts = async () => {
            try {
                setLoading(true);
                // TODO: import btsService dynamically hoặc giữ nguyên
                const btsService = (await import('@/services/btsService')).default;
                const data = await btsService.getByBoundingBox({
                    west: 105.7,
                    south: 20.9,
                    east: 106.0,
                    north: 21.1,
                    zoom: 13,
                });
                setBtsStations(data);
            } catch (err) {
                console.error('Fetch BTS failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBts();
    }, []);

    return (
        <div className="h-screen flex flex-col bg-[#0a0e14] overflow-hidden">
            <div className="flex-1 relative">
                <MapView
                    devices={mockDevices}
                    btsStations={btsStations}
                    selectedDevice={selectedDevice}
                    onDeviceClick={setSelectedDevice}
                    showBts={showBts}
                    showCoverage={showCoverage}
                    showBtsLines={showBtsLines}
                />

                <MapControls
                    showBts={showBts}
                    setShowBts={setShowBts}
                    showCoverage={showCoverage}
                    setShowCoverage={setShowCoverage}
                    showBtsLines={showBtsLines}
                    setShowBtsLines={setShowBtsLines}
                />

                {selectedDevice && (
                    <DeviceDetailPanel
                        device={selectedDevice}
                        onClose={() => setSelectedDevice(null)}
                    />
                )}

                {loading && (
                    <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                        Loading BTS...
                    </div>
                )}
            </div>
        </div>
    );
}