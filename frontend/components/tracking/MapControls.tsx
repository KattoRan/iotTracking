import React from "react";
import { Radio, Waves, GitBranch, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* =======================
   Type cho MapControls
======================= */
interface MapControlsProps {
    showBts: boolean;
    setShowBts: React.Dispatch<React.SetStateAction<boolean>>;

    showCoverage: boolean;
    setShowCoverage: React.Dispatch<React.SetStateAction<boolean>>;

    showBtsLines: boolean;
    setShowBtsLines: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MapControls({
    showBts,
    setShowBts,
    showCoverage,
    setShowCoverage,
    showBtsLines,
    setShowBtsLines,
}: MapControlsProps) {
    return (
        <div className="absolute bottom-10 left-4 z-[1000] flex flex-col gap-2">
            <ControlBtn
                icon={Radio}
                label="Trạm BTS"
                active={showBts}
                onClick={() => setShowBts((prev) => !prev)}
                activeColor="text-indigo-400"
                activeBg="bg-indigo-500/20 border-indigo-500/40"
            />

            <ControlBtn
                icon={Waves}
                label="Vùng phủ sóng"
                active={showCoverage}
                onClick={() => {
                    setShowCoverage((prev) => !prev);
                    if (!showBts) setShowBts(true);
                }}
                activeColor="text-cyan-400"
                activeBg="bg-cyan-500/20 border-cyan-500/40"
                disabled={!showBts}
            />

            <ControlBtn
                icon={GitBranch}
                label="Đường kết nối BTS"
                active={showBtsLines}
                onClick={() => setShowBtsLines((prev) => !prev)}
                activeColor="text-green-400"
                activeBg="bg-green-500/20 border-green-500/40"
            />
        </div>
    );
}

/* =======================
   Type cho ControlBtn
======================= */
interface ControlBtnProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
    activeColor: string;
    activeBg: string;
    disabled?: boolean;
}

function ControlBtn({
    icon: Icon,
    label,
    active,
    onClick,
    activeColor,
    activeBg,
    disabled = false,
}: ControlBtnProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all backdrop-blur-md shadow-lg",
                active
                    ? `${activeBg} ${activeColor}`
                    : "bg-[#0d1117]/90 border-white/10 text-gray-400 hover:text-white hover:bg-white/5",
                disabled && "opacity-40 cursor-not-allowed"
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </button>
    );
}