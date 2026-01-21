import { useState, useEffect } from "react";
import { Switch, TextArea, ToolPageHeader, ToolBar, PasteButton, ClearButton, CloseButton, SaveButton, CopyButton, EditButton, MoreOptionsButton, Dropdown } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";

export default function HtmlEncoderPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isEncoding, setIsEncoding] = useState(true);
  const [sessionType, setSessionType] = useState("html");
  const { isFavorite, toggleFavorite } = useFavorites();

  const sessionOptions = [
    { value: "html", label: "HTML" },
    { value: "xml", label: "XML" },
    { value: "url", label: "URL" },
    { value: "js", label: "JavaScript" },
  ];

  useEffect(() => {
    handleConvert();
  }, [inputText, isEncoding, sessionType]);

  const handleConvert = () => {
    try {
      if (isEncoding) {
        const encoded = encodeText(inputText, sessionType);
        setOutputText(encoded);
      } else {
        const decoded = decodeText(inputText, sessionType);
        setOutputText(decoded);
      }
    } catch (error) {
      setOutputText("转换失败：输入格式不正确");
    }
  };

  const encodeText = (text: string, type: string): string => {
    switch (type) {
      case "html":
      case "xml":
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\//g, "&#x2F;");
      case "url":
        return encodeURIComponent(text);
      case "js":
        return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
      default:
        return text;
    }
  };

  const decodeText = (text: string, type: string): string => {
    switch (type) {
      case "html":
      case "xml":
        return text
          .replace(/&#x2F;/g, "/")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, ">")
          .replace(/&lt;/g, "<")
          .replace(/&amp;/g, "&");
      case "url":
        return decodeURIComponent(text);
      case "js":
        return text.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      default:
        return text;
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
    toggleFavorite("html");
  };

  const handleRefresh = () => {
    handleClear();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl overflow-y-auto h-[100vh]">
      <ToolPageHeader title="HTML文本编码器/解码器" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("html")} />

      {/* 配置区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">会话</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">选择你需要的会话类型</span>
            <Dropdown value={sessionType} options={sessionOptions} onChange={setSessionType} />
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
        <TextArea value={inputText} onChange={setInputText} placeholder={isEncoding ? "请输入要编码的文本..." : "请输入要解码的文本..."} rows={12} />
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
