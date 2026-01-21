import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ToolCard from "../components/ToolCard";
import { useLanguage } from "../contexts/LanguageContext";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { getAllTools } from "../data/menuItems";
import { useFavorites } from "../hooks/useFavorites";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: any;
  path?: string;
}

export default function DevToysHome() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    // 获取所有工具数据
    const toolsData = getAllTools();

    // 初始化所有工具
    const formattedTools = toolsData.map((tool) => ({
      id: tool.id,
      title: getLabel(tool.titleKey!),
      description: getLabel(tool.descriptionKey!),
      icon: tool.icon,
      path: tool.path,
    }));

    setAllTools(formattedTools);

    // 从localStorage获取最近使用的工具
    const savedRecentTools = localStorage.getItem("recentTools");
    if (savedRecentTools) {
      const recentIds = JSON.parse(savedRecentTools);
      const recent = recentIds.map((id: string) => formattedTools.find((tool) => tool.id === id)).filter(Boolean);
      setRecentTools(recent);
    } else {
      // 默认最近使用的工具
      setRecentTools(formattedTools.slice(0, 3));
    }

    // 从localStorage获取收藏的工具
    const updateFavoriteTools = () => {
      const savedFavoriteTools = localStorage.getItem("favoriteTools");
      if (savedFavoriteTools) {
        const favoriteIds = JSON.parse(savedFavoriteTools);
        const favorite = favoriteIds.map((id: string) => formattedTools.find((tool) => tool.id === id)).filter(Boolean);
        setFavoriteTools(favorite);
      } else {
        setFavoriteTools([]);
      }
    };

    updateFavoriteTools();

    // 监听storage变化，实现跨组件同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favoriteTools") {
        updateFavoriteTools();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 同一个页面的localStorage变化不会触发storage事件，所以需要自定义事件
    const handleCustomStorageChange = () => {
      updateFavoriteTools();
    };

    window.addEventListener("favoriteToolsChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoriteToolsChanged", handleCustomStorageChange);
    };
  }, []);

  const getLabel = (labelKey: string) => {
    const keys = labelKey.split(".");
    let value: any = t;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return labelKey;
    }
    return value;
  };

  const handleToolClick = (tool: Tool) => {
    // 导航到工具页面
    if (tool.path) {
      navigate(tool.path);
    }

    // 更新最近使用的工具
    const newRecentTools = [tool, ...recentTools.filter((t) => t.id !== tool.id)].slice(0, 6);
    setRecentTools(newRecentTools);
    localStorage.setItem("recentTools", JSON.stringify(newRecentTools.map((t) => t.id)));
  };

  const handleToggleFavorite = (e: React.MouseEvent, tool: Tool) => {
    e.stopPropagation();
    toggleFavorite(tool.id);
    
    // 更新本地状态
    const isToolFavorite = isFavorite(tool.id);
    let newFavorites;

    if (isToolFavorite) {
      newFavorites = favoriteTools.filter((t) => t.id !== tool.id);
    } else {
      newFavorites = [...favoriteTools, tool];
    }

    setFavoriteTools(newFavorites);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6" style={{ height: "calc(100vh - 0px)" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.common.welcome}</h1>
        <span className="text-gray-600 dark:text-gray-400 text-sm">v2.0-preview.8</span>
      </div>

      {/* Recents Section */}
      {recentTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.common.recents}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {recentTools.map((tool) => (
              <div key={tool.id} className="relative">
                <ToolCard title={tool.title} description={tool.description} icon={tool.icon} onClick={() => handleToolClick(tool)} />
                <button className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={(e) => handleToggleFavorite(e, tool)}>
                  {isFavorite(tool.id) ? <HeartSolidIcon className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section */}
      {favoriteTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.common.favorites}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <div key={tool.id} className="relative">
                <ToolCard title={tool.title} description={tool.description} icon={tool.icon} onClick={() => handleToolClick(tool)} />
                <button className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={(e) => handleToggleFavorite(e, tool)}>
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      {(recentTools.length > 0 || favoriteTools.length > 0) && <div className="border-t border-gray-300 dark:border-gray-700 my-8"></div>}

      {/* All Tools Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.common.allTools}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {allTools.map((tool) => (
            <div key={tool.id} className="relative">
              <ToolCard title={tool.title} description={tool.description} icon={tool.icon} onClick={() => handleToolClick(tool)} />
              <button className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={(e) => handleToggleFavorite(e, tool)}>
                {isFavorite(tool.id) ? <HeartSolidIcon className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
