import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import React from "react";

interface QuickActionProps {
    icon: React.ElementType;
    title: string;
    onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
    icon: Icon,
    title,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors w-full"
        >
            <div className="bg-red-100 p-3 rounded-full mb-2">
                <Icon className="h-6 w-6 text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">{title}</span>
        </button>
    );
};

export default QuickAction;
