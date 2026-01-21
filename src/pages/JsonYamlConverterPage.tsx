import { useState, useEffect } from "react";
import { ToolPageHeader, Dropdown, TextArea, ToolBar, PasteButton, ClearButton, CloseButton, CopyButton, MoreOptionsButton } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import * as yaml from "js-yaml";

interface ConversionOptions {
  indent: number;
  sortKeys: boolean;
  lineWidth: number;
  noRefs: boolean;
  noCompatMode: boolean;
  flowLevel: number;
  styles: {
    [key: string]: string;
  };
}

export default function JsonYamlConverterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [conversionDirection, setConversionDirection] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [options, setOptions] = useState<ConversionOptions>({
    indent: 2,
    sortKeys: false,
    lineWidth: 80,
    noRefs: false,
    noCompatMode: false,
    flowLevel: -1,
    styles: {
      "!!null": "canonical", // 输出 null 而不是 ~
      "!!bool": "lowercase", // 输出 true/false 而不是 True/False
      "!!int": "decimal", // 输出十进制整数
      "!!float": "lowercase", // 输出小数
    },
  });
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const indentOptions = [
    { value: "2", label: "2个空格" },
    { value: "4", label: "4个空格" },
    { value: "8", label: "8个空格" },
    { value: "tab", label: "Tab" },
  ];

  useEffect(() => {
    handleConvert();
  }, [jsonInput, conversionDirection, options]);

  const handleConvert = () => {
    try {
      setError("");

      if (conversionDirection === "json-to-yaml") {
        // JSON 转 YAML
        if (!jsonInput.trim()) {
          setYamlOutput("");
          return;
        }

        const parsedData = JSON.parse(jsonInput);
        const yamlOptions: yaml.DumpOptions = {
          indent: options.indent === "tab" ? 1 : options.indent,
          indentSeq: options.indent === "tab" ? 1 : options.indent,
          sortKeys: options.sortKeys,
          lineWidth: options.lineWidth,
          noRefs: options.noRefs,
          noCompatMode: options.noCompatMode,
          flowLevel: options.flowLevel,
          styles: options.styles,
          noArrayIndent: false,
          skipInvalid: false,
          noRefs: true,
          indent: options.indent === "tab" ? 1 : options.indent,
        };

        const yamlString = yaml.dump(parsedData, yamlOptions);
        setYamlOutput(yamlString);
      } else {
        // YAML 转 JSON
        if (!jsonInput.trim()) {
          setYamlOutput("");
          return;
        }

        const parsedData = yaml.load(jsonInput, {
          json: true,
          onWarning: (warning) => {
            console.warn("YAML Warning:", warning);
          },
        }) as any;

        const jsonString = JSON.stringify(parsedData, null, 2);
        setYamlOutput(jsonString);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "转换失败";
      setError(errorMessage);
      setYamlOutput(`// 转换错误: ${errorMessage}`);
    }
  };

  const handlePaste = async (isInput: boolean) => {
    try {
      const text = await navigator.clipboard.readText();
      if (isInput) {
        setJsonInput(text);
      } else {
        setJsonInput(text);
        // 如果粘贴到输出区域，自动切换转换方向
        setConversionDirection(conversionDirection === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
      }
    } catch (error) {
      console.error("粘贴失败:", error);
    }
  };

  const handleClear = (isInput: boolean) => {
    if (isInput) {
      setJsonInput("");
    } else {
      setJsonInput("");
    }
    setError("");
  };

  const handleClose = (isInput: boolean) => {
    if (isInput) {
      setJsonInput("");
    } else {
      setJsonInput("");
    }
    setError("");
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleMoreOptions = () => {
    // 可以添加更多选项，比如不同的格式化选项等
    console.log("更多选项");
  };

  const handleSwapDirection = () => {
    setConversionDirection(conversionDirection === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    // 交换输入和输出内容
    const temp = jsonInput;
    setJsonInput(yamlOutput);
    setYamlOutput(temp);
  };

  const handleAddToFavorites = () => {
    toggleFavorite("json-yaml");
  };

  const handleRefresh = () => {
    setJsonInput("");
    setYamlOutput("");
    setError("");
  };

  const getInputPlaceholder = () => {
    if (conversionDirection === "json-to-yaml") {
      return `请输入JSON数据，例如：
{
  "name": "示例",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`;
    } else {
      return `请输入YAML数据，例如：
name: 示例
version: 1.0.0
dependencies:
  react: ^18.0.0`;
    }
  };

  const getOutputPlaceholder = () => {
    if (conversionDirection === "json-to-yaml") {
      return "转换后的YAML数据将显示在这里...";
    } else {
      return "转换后的JSON数据将显示在这里...";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl overflow-y-auto h-[100vh] flex flex-col">
      <ToolPageHeader title="JSON <> YAML" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("json-yaml")} />

      {/* 配置区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">缩进</span>
              <Dropdown
                value={options.indent.toString()}
                options={indentOptions}
                onChange={(value) => {
                  const indent = value === "tab" ? "tab" : parseInt(value);
                  setOptions((prev) => ({ ...prev, indent: indent as any }));
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">排序键</span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" checked={options.sortKeys} onChange={(e) => setOptions((prev) => ({ ...prev, sortKeys: e.target.checked }))} className="sr-only" />
                <div className={`block w-12 h-6 rounded-full transition-colors ${options.sortKeys ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}></div>
                <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-100 w-5 h-5 rounded-full transition-transform ${options.sortKeys ? "translate-x-6" : "translate-x-0"}`}></div>
              </label>
            </div>
          </div>

          <button onClick={handleSwapDirection} className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span>切换方向</span>
            <LightBulbIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex flex-row gap-6 flex-1 overflow-hidden">
        {/* 输入区域 */}
        <div className="w-1/2">
          <div className="flex items-center justify-between  h-20 bg-yellow-300">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输入 ({conversionDirection === "json-to-yaml" ? "JSON" : "YAML"})</label>
            <ToolBar>
              <PasteButton onClick={() => handlePaste(true)} />
              <ClearButton onClick={() => handleClear(true)} />
              <CloseButton onClick={() => handleClose(true)} />
            </ToolBar>
          </div>
          <TextArea value={jsonInput} onChange={setJsonInput} placeholder={getInputPlaceholder()} rows={20} showLineNumbers={true} />
        </div>

        {/* 输出区域 */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输出 ({conversionDirection === "json-to-yaml" ? "YAML" : "JSON"})</label>
            <ToolBar>
              <CopyButton onClick={() => handleCopy(yamlOutput)} disabled={!yamlOutput || !!error} />
              <MoreOptionsButton onClick={handleMoreOptions} />
            </ToolBar>
          </div>
          <TextArea value={yamlOutput} onChange={setYamlOutput} placeholder={getOutputPlaceholder()} rows={20} showLineNumbers={true} />
        </div>
      </div>
    </div>
  );
}
