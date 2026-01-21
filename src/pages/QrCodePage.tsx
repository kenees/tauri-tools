import { useState, useRef, useEffect } from "react";
import { EyeIcon, DocumentArrowDownIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ToolPageHeader, ToolBar, PasteButton, ClearButton, CloseButton, SaveButton, CopyButton, IconButton } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";

export default function QrCodePage() {
  const [inputText, setInputText] = useState("wangchengwangchengwangchengwangcheng");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [decodedText, setDecodedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isFavorite, toggleFavorite } = useFavorites();

  // 生成二维码
  const generateQRCode = () => {
    if (!inputText.trim()) {
      setQrCodeUrl("");
      return;
    }

    // 使用免费的二维码生成API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inputText)}`;
    setQrCodeUrl(qrApiUrl);
  };

  // 自动生成二维码（当输入改变时）
  useEffect(() => {
    generateQRCode();
  }, [inputText]);

  // 处理文件拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    try {
      // 读取图片为base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        
        // 使用后端API解析二维码
        try {
          const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: result.split(',')[1], // 移除data:image/...;base64,前缀
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.symbol && data.symbol[0]?.data) {
              setDecodedText(data.symbol[0].data);
              setInputText(data.symbol[0].data);
            } else {
              alert('无法解析二维码内容');
            }
          } else {
            alert('解析二维码失败');
          }
        } catch (error) {
          console.error('QR码解析错误:', error);
          alert('解析二维码失败');
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('文件读取错误:', error);
      alert('文件读取失败');
    }
  };

  // 处理文件选择
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        
        try {
          const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: result.split(',')[1],
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.symbol && data.symbol[0]?.data) {
              setDecodedText(data.symbol[0].data);
              setInputText(data.symbol[0].data);
            } else {
              alert('无法解析二维码内容');
            }
          } else {
            alert('解析二维码失败');
          }
        } catch (error) {
          console.error('QR码解析错误:', error);
          alert('解析二维码失败');
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('文件读取错误:', error);
      alert('文件读取失败');
    }
  };

  // 处理粘贴
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error("粘贴失败:", error);
    }
  };

  // 处理清空
  const handleClear = () => {
    setInputText("");
    setQrCodeUrl("");
    setDecodedText("");
  };

  // 处理关闭
  const handleClose = () => {
    setInputText("");
    setQrCodeUrl("");
    setDecodedText("");
  };

  // 处理复制文本
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  // 处理保存文本
  const handleSaveText = () => {
    const blob = new Blob([inputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理查看二维码
  const handleViewQR = () => {
    if (qrCodeUrl) {
      window.open(qrCodeUrl, '_blank');
    }
  };

  // 处理复制二维码
  const handleCopyQR = async () => {
    try {
      if (qrCodeUrl) {
        // 将二维码URL转换为图片并复制到剪贴板
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }
    } catch (error) {
      console.error("复制二维码失败:", error);
      alert("复制二维码失败，请尝试右键保存图片");
    }
  };

  // 处理下载二维码
  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const a = document.createElement("a");
      a.href = qrCodeUrl;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 处理添加到收藏夹
  const handleAddToFavorites = () => {
    toggleFavorite("qrcode");
  };

  // 处理刷新
  const handleRefresh = () => {
    setInputText("");
    setQrCodeUrl("");
    setDecodedText("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ToolPageHeader
        title="二维码编解码工具"
        onAddToFavorites={handleAddToFavorites}
        onRefresh={handleRefresh}
        isFavorited={isFavorite("qrcode")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧文本输入区 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              文本
            </label>
            <ToolBar>
              <PasteButton onClick={handlePaste} />
              <ClearButton onClick={handleClear} />
              <CloseButton onClick={handleClose} />
              <IconButton
                icon={<EyeIcon className="w-4 h-4" />}
                label="生成二维码"
                onClick={generateQRCode}
              />
              <CopyButton onClick={handleCopyText} disabled={!inputText} />
              <SaveButton onClick={handleSaveText} disabled={!inputText} />
            </ToolBar>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm resize-none"
            placeholder="输入要生成二维码的文本..."
          />
          
          {decodedText && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>解析结果:</strong> {decodedText}
              </p>
            </div>
          )}
        </div>

        {/* 右侧二维码区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* 文件上传区域 */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragging 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                将任意一个 BMP, GIF, ICO, JPEG, JPG, PBM, PNG, TGA, TIFF, WEBP 文件拖放到此处
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                或者
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  浏览文件
                </button>
                <button
                  onClick={handlePaste}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  粘贴
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 二维码显示区域 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                二维码
              </label>
              <ToolBar>
                <IconButton
                  icon={<EyeIcon className="w-4 h-4" />}
                  label="查看"
                  onClick={handleViewQR}
                  disabled={!qrCodeUrl}
                />
                <CopyButton onClick={handleCopyQR} disabled={!qrCodeUrl} />
                <IconButton
                  icon={<DocumentArrowDownIcon className="w-4 h-4" />}
                  label="下载"
                  onClick={handleDownloadQR}
                  disabled={!qrCodeUrl}
                />
              </ToolBar>
            </div>

            {qrCodeUrl ? (
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="二维码"
                  className="w-full max-w-xs h-auto border border-gray-200 dark:border-gray-700 rounded-md shadow-sm"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  二维码将显示在这里
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}