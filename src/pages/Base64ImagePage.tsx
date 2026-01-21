import { useState, useEffect, useRef } from "react";
import { Switch, TextArea, DropZone, ToolPageHeader, ToolBar, PasteButton, ClearButton, CloseButton, SaveButton, CopyButton } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";

export default function Base64ImagePage() {
  const [base64Text, setBase64Text] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (base64Text && isEncoding) {
      setPreviewImage(base64Text);
    } else {
      setPreviewImage(null);
    }
  }, [base64Text, isEncoding]);

  const handleFileDrop = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isEncoding) {
        // 编码模式：文件转Base64
        setBase64Text(result);
        setPreviewImage(result);
      } else {
        // 解码模式：Base64转图片预览
        try {
          setBase64Text(result);
          setPreviewImage(result);
        } catch (error) {
          console.error("处理图片失败:", error);
          alert("图片处理失败");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              setBase64Text(result);
              setPreviewImage(result);
            };
            reader.readAsDataURL(blob);
            return;
          } else if (type === "text/plain") {
            const text = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              setBase64Text(result);
              if (result.startsWith("data:image/")) {
                setPreviewImage(result);
              }
            };
            reader.readAsText(text);
            return;
          }
        }
      }
    } catch (error) {
      console.error("粘贴失败:", error);
      // 尝试读取文本
      try {
        const text = await navigator.clipboard.readText();
        setBase64Text(text);
        if (text.startsWith("data:image/")) {
          setPreviewImage(text);
        }
      } catch (textError) {
        console.error("文本粘贴也失败:", textError);
      }
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileDrop(Array.from(files));
    }
  };

  const handleClear = () => {
    setBase64Text("");
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleClear();
  };

  const handleSave = () => {
    if (!base64Text) return;

    try {
      // 从Base64字符串中提取MIME类型和数据
      const matches = base64Text.match(/^data:(.+?);base64,(.+)$/);
      if (!matches) {
        alert("无效的Base64图片数据");
        return;
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = isEncoding ? "encoded-image.png" : "decoded-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败");
    }
  };

  const handleCopy = async () => {
    if (!base64Text) return;

    try {
      await navigator.clipboard.writeText(base64Text);
    } catch (error) {
      console.error("复制失败:", error);
      alert("复制失败");
    }
  };

  const handleAddToFavorites = () => {
    toggleFavorite("base64-image");
  };

  const handleRefresh = () => {
    handleClear();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl overflow-y-auto h-[100vh]">
      <ToolPageHeader title="Base64图片编码/解码" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("base64-image")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧Base64文本区域 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base64文本</label>
            <ToolBar>
              <PasteButton onClick={handlePaste} />
              <ClearButton onClick={handleClear} />
              {/* <CloseButton onClick={handleClose} /> */}
              <SaveButton onClick={handleSave} disabled={!base64Text} />
              <CopyButton onClick={handleCopy} disabled={!base64Text} />
            </ToolBar>
          </div>
          <TextArea value={base64Text} onChange={setBase64Text} placeholder="图片的Base64编码将显示在这里，或者您可以粘贴Base64文本进行解码..." rows={20} className="h-full" />
        </div>

        {/* 右侧上传和预览区域 */}
        <div className="space-y-6">
          {/* 文件拖放区域 */}
          <div>
            <DropZone onFilesDrop={handleFileDrop} accept="image/*" multiple={false} className="min-h-[200px]">
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">将任意一个 BMP, GIF, ICO, JPEG, JPG, PNG, SVG, WEBP 文件拖放到此处</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={handleBrowseFiles} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    浏览文件
                  </button>
                  <span className="text-gray-400">或者</span>
                  <button onClick={handlePaste} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    粘贴
                  </button>
                </div>
              </div>
            </DropZone>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* 图片预览区域 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">图片预览</h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 p-4 min-h-[200px] flex items-center justify-center">
              {previewImage ? <img src={previewImage} alt="预览图片" className="max-w-full max-h-96 object-contain rounded" /> : <p className="text-gray-400 text-center">暂无图片预览</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
