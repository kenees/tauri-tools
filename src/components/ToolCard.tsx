import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  iconAlt?: string;
  onClick?: () => void;
}

export default function ToolCard({ title, description, icon, iconAlt, onClick }: ToolCardProps) {
  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Share Icon */}
      <button
        className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-70 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          // Handle share action
          console.log(`Share tool: ${title}`);
        }}
      >
        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      </button>

      {/* Content */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img src={icon} alt={iconAlt || title} className="w-10 h-10 rounded-md" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
