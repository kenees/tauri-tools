import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode | string;
  iconAlt?: string;
  onClick?: () => void;
}

export default function ToolCard({ title, description, icon, iconAlt, onClick }: ToolCardProps) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return <img src={icon} alt={iconAlt || title} className="w-10 h-10 rounded-md" />;
    } else {
      return <div className="w-10 h-10 rounded-md flex items-center justify-center">{icon}</div>;
    }
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-lg p-4 pr-12 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{renderIcon()}</div>
        <div className="flex-1 min-w-0 h-16">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
