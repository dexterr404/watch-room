import type { LucideIcon } from "lucide-react"

type ToggleButtonProps = {
    isToggled?: boolean;
    onToggle?: () => void;
    icon?: LucideIcon;
}

export default function ToggleButton({isToggled,onToggle,icon:Icon}: ToggleButtonProps) {
    return (
        <button 
            onClick={onToggle}
            className={`relative w-11 h-6.5 ${ isToggled ? "bg-linear-to-bl from-purple-400 to-pink-400" : "bg-gray-800" } rounded-md   border border-gray-700`}>
            <div className={`absolute top-0 left-0 w-6 h-6 rounded-md flex items-center justify-center transition-transform cursor-pointer
                ${isToggled ? "translate-x-5 bg-linear-to-br from-purple-500 to-pink-500" : "translate-x-0 bg-gray-700"}`}>
                {Icon && <Icon className="w-4 h-4 text-white"/>}
            </div>
        </button>
    )
}