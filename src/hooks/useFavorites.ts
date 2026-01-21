import { useState, useEffect } from "react";

export interface FavoriteTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
}

export function useFavorites() {
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);

  useEffect(() => {
    // 从localStorage获取收藏的工具
    const updateFavoriteTools = () => {
      const savedFavoriteTools = localStorage.getItem("favoriteTools");
      if (savedFavoriteTools) {
        const favoriteIds = JSON.parse(savedFavoriteTools);
        setFavoriteTools(favoriteIds);
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

    // 同一个页面的localStorage变化不会触发storage事件，所以需要自定义事件
    const handleCustomStorageChange = () => {
      updateFavoriteTools();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoriteToolsChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoriteToolsChanged", handleCustomStorageChange);
    };
  }, []);

  const toggleFavorite = (toolId: string) => {
    let newFavorites;
    console.log(favoriteTools, toolId);
    if (favoriteTools.includes(toolId)) {
      newFavorites = favoriteTools.filter((id) => id !== toolId);
    } else {
      newFavorites = [...favoriteTools, toolId];
    }
    setFavoriteTools(newFavorites);
    localStorage.setItem("favoriteTools", JSON.stringify(newFavorites));

    // 触发自定义事件以通知其他组件
    window.dispatchEvent(new CustomEvent("favoriteToolsChanged", { detail: newFavorites }));
  };

  const isFavorite = (toolId: string) => {
    return favoriteTools.includes(toolId);
  };

  return {
    favoriteTools,
    toggleFavorite,
    isFavorite,
  };
}
