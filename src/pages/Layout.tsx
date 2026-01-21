import { Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useLanguage } from "../contexts/LanguageContext";
import { useFavorites } from "../hooks/useFavorites";
import { menuItems, MenuItem, getAllTools } from "../data/menuItems";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["converters", "encoders-decoders", "favorites"]));
  const [searchQuery, setSearchQuery] = useState("");
  const { favoriteTools, isFavorite, toggleFavorite } = useFavorites();
  const [favoriteMenuItems, setFavoriteMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // 当收藏工具列表更新时，更新菜单项
    const allTools = getAllTools();
    const favorites = allTools.filter(tool => favoriteTools.includes(tool.id));
    setFavoriteMenuItems(favorites);
  }, [favoriteTools]);

  const getLabel = (labelKey: string) => {
    const keys = labelKey.split(".");
    let value: any = t;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return labelKey;
    }
    return value;
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isFavoriteChild: boolean = false) => {
    const isExpanded = expandedItems.has(item.id);
    const isSelected = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const showFavoriteButton = !isFavoriteChild && item.path && item.titleKey && item.descriptionKey; // 收藏夹中的子项不显示收藏按钮

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : "hover:bg-gray-300 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"}`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => handleItemClick(item)}
        >
          {item.icon}
          <span className="flex-1 text-sm">{getLabel(item.labelKey)}</span>
          <div className="flex items-center gap-1">
            {showFavoriteButton && (
              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
              >
                {isFavorite(item.id) ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />
                )}
              </button>
            )}
            {hasChildren && <span className="text-xs">{isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}</span>}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1, item.id === "favorites"))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">D</div>
            <span className="font-semibold">DevToys</span>
            <span className="ml-auto text-xs text-gray-400">v2.0-preview.8</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* 收藏夹目录 */}
          {favoriteMenuItems.length > 0 && (
            <div className="mb-2">
              {renderMenuItem({
                id: "favorites",
                labelKey: "common.favorites",
                icon: <HeartIcon className="w-5 h-5" />,
                children: favoriteMenuItems
              }, 0)}
            </div>
          )}
          
          {/* 其他菜单项 */}
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

        {/* Bottom Menu Items */}
        <div className="p-2 border-t border-gray-300 dark:border-gray-700">{menuItems.slice(1, 3).map((item) => renderMenuItem(item))}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
