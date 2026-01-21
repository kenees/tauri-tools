import { useState, useRef, ChangeEvent } from "react";
import { ChevronDownIcon, ClipboardDocumentIcon, TrashIcon, XMarkIcon, DocumentArrowDownIcon, DocumentDuplicateIcon, PencilIcon, LightBulbIcon, ArrowPathIcon, StarIcon, BackspaceIcon } from "@heroicons/react/24/outline";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  return (
    <label className="relative inline-block w-12 h-6">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="sr-only" />
      <div className={`block w-12 h-6 rounded-full transition-colors ${disabled ? "bg-gray-400 dark:bg-gray-600" : checked ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}></div>
      <div className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-100 w-5 h-5 rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}></div>
    </label>
  );
}

interface DropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Dropdown({ value, options, onChange, placeholder, disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || placeholder || "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
          disabled ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
        } transition-colors`}
      >
        <span className="truncate max-w-32">{displayValue}</span>
        <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 z-20 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    option.value === value ? "bg-blue-600 dark:bg-blue-500 text-white dark:text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } transition-colors`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
}

export function IconButton({ icon, label, onClick, disabled = false, variant = "default" }: IconButtonProps) {
  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors";
  const variantClasses = {
    default: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
    primary: "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
    danger: "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={label}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  showLineNumbers?: boolean;
  className?: string;
}

export function TextArea({ value, onChange, placeholder, disabled = false, rows = 10, showLineNumbers = true, className = "" }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const lineCount = Math.max(value.split("\n").length, 10);

  console.log("lineCount:", lineCount);

  // 同步滚动
  const handleScroll = () => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className={`relative ${className} h-full`}>
      <div className="relative h-full w-full overflow-scroll border border-gray-300 dark:border-gray-600 rounded-md">
        {showLineNumbers && (
          <div ref={lineNumberRef} className="absolute text-gray-400 h-max text-sm font-mono select-none pointer-events-none px-3 py-2 bg-gray-50 dark:bg-gray-700 float-left" style={{ width: "50px", minWidth: "50px" }}>
            {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
              <div key={i} className="leading-6" style={{ height: "24px" }}>
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          disabled={disabled}
          rows={lineCount}
          className={`flex-1 px-4 py-2 pl-[70px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            showLineNumbers ? "border-l-0" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{
            lineHeight: "24px",
            height: "max-content",
            width: "9999px",

            overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function DropZone({ onFilesDrop, accept, multiple = false, disabled = false, children, className = "" }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      onFilesDrop(files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesDrop(files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50"} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" accept={accept} multiple={multiple} onChange={handleFileInput} disabled={disabled} className="hidden" id="file-input" />
      {children || (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">将文件拖放到此处</p>
          <label htmlFor="file-input" className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            浏览文件
          </label>
        </div>
      )}
    </div>
  );
}

interface ToolPageHeaderProps {
  title: string;
  onAddToFavorites?: () => void;
  onRefresh?: () => void;
  isFavorited?: boolean;
  showActions?: boolean;
}

export function ToolPageHeader({ title, onAddToFavorites, onRefresh, isFavorited = false, showActions = true }: ToolPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={onAddToFavorites}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              isFavorited ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <StarIcon className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{isFavorited ? "已收藏" : "添加到收藏夹"}</span>
          </button>
          {onRefresh && (
            <button onClick={onRefresh} className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="刷新">
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ToolBarProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolBar({ children, className = "" }: ToolBarProps) {
  return <div className={`flex items-center gap-2 ${className}`}>{children}</div>;
}

// 预定义的按钮组件
export function PasteButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<ClipboardDocumentIcon className="w-4 h-4" />} label="粘贴" onClick={onClick} disabled={disabled} />;
}

export function ClearButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<TrashIcon className="w-4 h-4" />} label="清空" onClick={onClick} disabled={disabled} variant="danger" />;
}

export function BackspaceButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<BackspaceIcon className="w-4 h-4" />} label="Backspace" onClick={onClick} disabled={disabled} />;
}

export function CloseButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<XMarkIcon className="w-4 h-4" />} label="关闭" onClick={onClick} disabled={disabled} />;
}

export function SaveButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<DocumentArrowDownIcon className="w-4 h-4" />} label="保存" onClick={onClick} disabled={disabled} variant="primary" />;
}

export function CopyButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<DocumentDuplicateIcon className="w-4 h-4" />} label="复制" onClick={onClick} disabled={disabled} />;
}

export function EditButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<PencilIcon className="w-4 h-4" />} label="编辑" onClick={onClick} disabled={disabled} />;
}

export function MoreOptionsButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <IconButton icon={<LightBulbIcon className="w-4 h-4" />} label="更多选项" onClick={onClick} disabled={disabled} />;
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number" | "password" | "email" | "url";
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input({ value, onChange, placeholder, disabled = false, type = "text", className = "", maxLength, autoFocus = false, onFocus, onBlur }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    />
  );
}
