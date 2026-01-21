import { useState, useEffect } from "react";
import { ToolPageHeader, Switch, Input, ToolBar, PasteButton, ClearButton, CloseButton, CopyButton, BackspaceButton } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface NumberBaseValues {
  hex: string;
  decimal: string;
  octal: string;
  binary: string;
}

export default function NumberBaseConverterPage() {
  const [values, setValues] = useState<NumberBaseValues>({
    hex: "",
    decimal: "",
    octal: "",
    binary: "",
  });
  const [formatNumbers, setFormatNumbers] = useState(false);
  const [lastChanged, setLastChanged] = useState<keyof NumberBaseValues>("decimal");
  const { isFavorite, toggleFavorite } = useFavorites();

  // 格式化数字（添加分隔符）
  const formatNumber = (value: string, base: number): string => {
    if (!formatNumbers || !value) return value;

    try {
      // 移除前导零和空格
      const cleanValue = value.replace(/^0+/, "").replace(/\s+/g, "");
      if (!cleanValue) return "0";

      // 将字符串转换为数字再格式化
      const num = parseInt(cleanValue, base);
      if (isNaN(num)) return value;

      // 根据进制添加不同的格式化
      if (base === 16) {
        // 十六进制：每4位一组，从后往前分割
        const hex = num.toString(16).toUpperCase();
        const reversed = hex.split("").reverse().join("");
        const grouped = reversed.match(/.{1,4}/g) || [];
        return grouped
          .map((group) => group.split("").reverse().join(""))
          .reverse()
          .join(" ");
      } else if (base === 2) {
        // 二进制：每4位一组，从后往前分割
        const binary = num.toString(2);
        const reversed = binary.split("").reverse().join("");
        const grouped = reversed.match(/.{1,4}/g) || [];
        return grouped
          .map((group) => `0000${group.split("").reverse().join("")}`.slice(-4))
          .reverse()
          .join(" ");
      } else if (base === 8) {
        // 八进制：每3位一组，从后往前分割
        const octal = num.toString(8);
        const reversed = octal.split("").reverse().join("");
        const grouped = reversed.match(/.{1,3}/g) || [];
        return grouped
          .map((group) => group.split("").reverse().join(""))
          .reverse()
          .join(" ");
      } else {
        // 十进制：每3位一组
        return num.toLocaleString();
      }
    } catch (error) {
      return value;
    }
  };
  // 清理格式化的数字（移除分隔符）
  const cleanFormattedNumber = (value: string): string => {
    // const cleanValue = value.replace(/^0+/, "").replace(/\s+/g, "");
    return value.replace(/\s+/g, ",").replace(/,/g, "");
  };

  // 转换数字到不同进制
  const convertNumber = (value: string, fromBase: number): NumberBaseValues => {
    try {
      // 清理输入值
      const cleanValue = cleanFormattedNumber(value);
      if (!cleanValue) {
        return { hex: "", decimal: "", octal: "", binary: "" };
      }

      // 转换为十进制
      const decimalValue = parseInt(cleanValue, fromBase);

      if (isNaN(decimalValue)) {
        throw new Error("Invalid number");
      }

      // 转换为各种进制
      const result: NumberBaseValues = {
        hex: decimalValue.toString(16).toUpperCase(),
        decimal: decimalValue.toString(10),
        octal: decimalValue.toString(8),
        binary: decimalValue.toString(2),
      };

      // 应用格式化
      if (formatNumbers) {
        result.hex = formatNumber(result.hex, 16);
        result.decimal = formatNumber(result.decimal, 10);
        result.octal = formatNumber(result.octal, 8);
        result.binary = formatNumber(result.binary, 2);
      }

      return result;
    } catch (error) {
      // 转换失败时清空所有值
      console.error("转换错误:", error);
      return { hex: "", decimal: "", octal: "", binary: "" };
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof NumberBaseValues, value: string) => {
    setLastChanged(field);

    // 确定源进制
    let fromBase = 10;
    switch (field) {
      case "hex":
        fromBase = 16;
        break;
      case "decimal":
        fromBase = 10;
        break;
      case "octal":
        fromBase = 8;
        break;
      case "binary":
        fromBase = 2;
        break;
    }

    // 转换并更新所有值
    const newValues = convertNumber(value, fromBase);
    setValues(newValues);
  };

  // 处理粘贴
  const handlePaste = async (field: keyof NumberBaseValues) => {
    try {
      const text = await navigator.clipboard.readText();
      handleInputChange(field, text);
    } catch (error) {
      console.error("粘贴失败:", error);
    }
  };

  // 处理删除（退格）
  const handleDelete = (field: keyof NumberBaseValues) => {
    const currentValue = values[field];
    const newValue = currentValue.slice(0, -1);
    handleInputChange(field, newValue);
  };

  // 处理清空
  const handleClear = (field: keyof NumberBaseValues) => {
    setValues((prev) => ({ ...prev, [field]: "" }));
  };

  // 处理复制
  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  // 处理复制并转换（复制其他进制的值）
  const handleCopyAndConvert = async (fromField: keyof NumberBaseValues, toField: keyof NumberBaseValues) => {
    const value = values[fromField];
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      // 然后将该值设置到目标字段
      handleInputChange(toField, value);
    } catch (error) {
      console.error("复制并转换失败:", error);
    }
  };

  // 处理收藏
  const handleAddToFavorites = () => {
    toggleFavorite("number-base");
  };

  // 处理刷新
  const handleRefresh = () => {
    setValues({ hex: "", decimal: "", octal: "", binary: "" });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl overflow-y-auto h-[100vh]">
      <ToolPageHeader title="进制转换器" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("number-base")} />

      {/* 配置区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">aA</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">格式化数字</span>
          </div>
          <Switch checked={formatNumbers} onChange={setFormatNumbers} />
        </div>
      </div>

      {/* 进制输入区域 */}
      <div className="space-y-4">
        {/* 十六进制 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">十六进制</label>
            <ToolBar>
              <PasteButton onClick={() => handlePaste("hex")} />
              <ClearButton onClick={() => handleClear("hex")} />
              <BackspaceButton onClick={() => handleDelete("hex")} />
              <CopyButton onClick={() => handleCopy(values.hex)} disabled={!values.hex} />
              <button onClick={() => handleCopyAndConvert("hex", "decimal")} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!values.hex} title="复制">
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </ToolBar>
          </div>
          <Input value={values.hex} onChange={(value) => handleInputChange("hex", value)} placeholder="输入十六进制数..." className="w-full" />
        </div>

        {/* 十进制 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">十进制</label>
            <ToolBar>
              <PasteButton onClick={() => handlePaste("decimal")} />
              <ClearButton onClick={() => handleClear("decimal")} />
              <BackspaceButton onClick={() => handleDelete("decimal")} />
              <CopyButton onClick={() => handleCopy(values.decimal)} disabled={!values.decimal} />
              <button onClick={() => handleCopyAndConvert("decimal", "hex")} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!values.decimal} title="复制">
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </ToolBar>
          </div>
          <Input value={values.decimal} onChange={(value) => handleInputChange("decimal", value)} placeholder="输入十进制数..." className="w-full" />
        </div>

        {/* 八进制 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">八进制</label>
            <ToolBar>
              <PasteButton onClick={() => handlePaste("octal")} />
              <ClearButton onClick={() => handleClear("octal")} />
              <BackspaceButton onClick={() => handleDelete("octal")} />
              <CopyButton onClick={() => handleCopy(values.octal)} disabled={!values.octal} />
              <button onClick={() => handleCopyAndConvert("octal", "decimal")} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!values.octal} title="复制">
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </ToolBar>
          </div>
          <Input value={values.octal} onChange={(value) => handleInputChange("octal", value)} placeholder="输入八进制数..." className="w-full" />
        </div>

        {/* 二进制 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">二进制</label>
            <ToolBar>
              <PasteButton onClick={() => handlePaste("binary")} />
              <ClearButton onClick={() => handleClear("binary")} />
              <BackspaceButton onClick={() => handleDelete("binary")} />
              <CopyButton onClick={() => handleCopy(values.binary)} disabled={!values.binary} />
              <button onClick={() => handleCopyAndConvert("binary", "decimal")} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!values.binary} title="复制">
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </ToolBar>
          </div>
          <Input value={values.binary} onChange={(value) => handleInputChange("binary", value)} placeholder="输入二进制数..." className="w-full" />
        </div>
      </div>
    </div>
  );
}
