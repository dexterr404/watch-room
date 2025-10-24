type ModalProps = {
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

export default function Modal({onClose, title, children}: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {/* Modal Content */}
            <div className="bg-gray-900 border border-gray-800 max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
                >
                    ✕
                </button>

                {/* Optional Title */}
                {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}

                {/* Body */}
                <div className="text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    )
}