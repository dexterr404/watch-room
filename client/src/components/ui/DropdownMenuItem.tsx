import type { LucideIcon } from "lucide-react"

type DropdownMenuItem = {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    icon?: LucideIcon;
}
export default function DropdownMenuItem({className,children,onClick,icon: Icon}: DropdownMenuItem) {
    return (
        <div onClick={onClick} className={`flex items-center gap-1 bg-gray-900 hover:bg-gray-700 border border-gray-800 px-4 py-0.5 ${className}`}>
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </div>
    )
}