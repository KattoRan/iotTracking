'use client'

import React from 'react'
import { X, Smartphone, Signal, Radio, User, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ================= TYPES ================= */

export type PhoneDevice = {
    phone_number: string
    model?: string
    device_os?: string
    network_type?: string   // 4G / 5G
    signal_strength?: number // dBm
}

export type BTSInfo = {
    bts_id: string
    bts_name?: string
    lac?: string
    cell_id?: string
}

type Props = {
    device: PhoneDevice | null
    user?: {
        name: string
    }
    bts?: BTSInfo
    onClose: () => void
}

/* ================= COMPONENT ================= */

export default function PhoneDetailPanel({
    device,
    user,
    bts,
    onClose
}: Props) {
    if (!device) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 360 }}
                animate={{ x: 0 }}
                exit={{ x: 360 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 bottom-0 w-[360px] bg-zinc-900 text-white border-l border-white/10 z-50 overflow-y-auto"
            >

                {/* ===== Header ===== */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold">Điện thoại</p>
                            <p className="text-xs text-gray-400">{device.model || '--'}</p>
                        </div>
                    </div>

                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* ===== User ===== */}
                {user && (
                    <Section title="Người dùng">
                        <Row icon={User} label="Tên" value={user.name} />
                    </Section>
                )}

                {/* ===== Device Info ===== */}
                <Section title="Thiết bị">
                    <Row icon={Phone} label="Số điện thoại" value={device.phone_number} />
                    <Row label="Hệ điều hành" value={device.device_os || '--'} />
                </Section>

                {/* ===== Network ===== */}
                <Section title="Mạng di động">
                    <Row icon={Signal} label="Loại mạng" value={device.network_type || '4G'} />
                    <Row
                        label="Cường độ"
                        value={
                            device.signal_strength !== undefined
                                ? `${device.signal_strength} dBm`
                                : '--'
                        }
                    />
                </Section>

                {/* ===== BTS ===== */}
                {bts && (
                    <Section title="Trạm BTS">
                        <Row
                            icon={Radio}
                            label="Tên trạm"
                            value={bts.bts_name || bts.bts_id}
                        />
                        {(bts.cell_id || bts.lac) && (
                            <p className="text-xs text-gray-400 mt-1">
                                Cell: {bts.cell_id} | LAC: {bts.lac}
                            </p>
                        )}
                    </Section>
                )}

            </motion.div>
        </AnimatePresence>
    )
}

/* ================= SUB COMPONENTS ================= */

function Section({
    title,
    children
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="p-4 border-b border-white/5">
            <h4 className="text-xs uppercase text-gray-400 mb-2">{title}</h4>
            <div className="space-y-2">{children}</div>
        </div>
    )
}

function Row({
    icon: Icon,
    label,
    value
}: {
    icon?: React.ElementType
    label: string
    value: string
}) {
    return (
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm">{value}</p>
            </div>
        </div>
    )
}