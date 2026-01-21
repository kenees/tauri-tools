import { useState, useEffect } from "react";
import { Switch, TextArea, ToolPageHeader, ToolBar, PasteButton, ClearButton, CloseButton, SaveButton, CopyButton, EditButton, MoreOptionsButton } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";

export default function Base64TextPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isEncoding, setIsEncoding] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    handleConvert();
  }, [inputText, isEncoding]);

  const handleConvert = () => {
    try {
      if (isEncoding) {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
      }
    } catch (error) {
      setOutputText("转换失败：输入格式不正确");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error("粘贴失败:", error);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handleClose = () => {
    setInputText("");
    setOutputText("");
  };

  const handleSave = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isEncoding ? "encoded.txt" : "decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleEdit = () => {
    setInputText(outputText);
    setOutputText("");
  };

  const handleMoreOptions = () => {
    // 可以添加更多选项，比如不同的编码格式等
    console.log("更多选项");
  };

  const handleAddToFavorites = () => {
    toggleFavorite("base64-text");
  };

  const handleRefresh = () => {
    handleClear();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl overflow-y-auto h-[100vh]">
      <ToolPageHeader title="Base64文本编码/解码" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("base64-text")} />

      {/* 配置区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">转换</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">选择你要使用的转换模式</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 dark:text-white">编码</span>
            <Switch checked={isEncoding} onChange={setIsEncoding} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">解码</span>
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输入</label>
          <ToolBar>
            <PasteButton onClick={handlePaste} />
            <ClearButton onClick={handleClear} />
            <CloseButton onClick={handleClose} />
          </ToolBar>
        </div>
        <TextArea value={inputText} onChange={setInputText} placeholder={isEncoding ? "请输入要编码的文本..." : "请输入要解码的Base64文本..."} rows={12} />
      </div>

      {/* 输出区域 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输出</label>
          <ToolBar>
            <SaveButton onClick={handleSave} disabled={!outputText} />
            <CopyButton onClick={handleCopy} disabled={!outputText} />
            <EditButton onClick={handleEdit} disabled={!outputText} />
            <MoreOptionsButton onClick={handleMoreOptions} />
          </ToolBar>
        </div>
        <TextArea value={outputText} onChange={setOutputText} placeholder="转换结果将显示在这里..." rows={12} />
      </div>
    </div>
  );
}
