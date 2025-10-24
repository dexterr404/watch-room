type DropdownMenuProps = {
    children?: React.ReactNode;
    className?: string;
    isOpen?: boolean;
}

export default function DropdownMenu({children, className, isOpen = false}: DropdownMenuProps) {
    if (!isOpen) return null;
    
    return(
        <div className={`absolute flex flex-col bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1 ${className}`}>
            {children}
        </div>
    )
}