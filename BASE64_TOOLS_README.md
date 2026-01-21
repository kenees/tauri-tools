# Base64 编码/解码工具

这个项目包含了两个Base64编码/解码工具页面：

## 功能特性

### Base64文本编码/解码 (`/tools/base64-text`)
- 支持文本和Base64之间的相互转换
- 支持中文字符编码
- 实时转换，输入即转换
- 提供粘贴、清空、保存、复制等操作
- 可切换编码/解码模式

### Base64图片编码/解码 (`/tools/base64-image`)
- 支持图片文件拖放上传
- 支持剪贴板粘贴图片
- 实时图片预览
- 支持多种图片格式：BMP, GIF, ICO, JPEG, JPG, PNG, SVG, WEBP
- 提供Base64文本编辑和复制功能
- 支持解码Base64图片数据

## 技术实现

### 前端组件
- 使用React + TypeScript开发
- 采用Tailwind CSS进行样式设计
- 组件化设计，公共组件位于`src/components/UIControls.tsx`

### 后端支持
- 使用Rust Tauri提供后端功能
- Base64编码/解码功能位于`src-tauri/src/base64.rs`
- 支持文本和图片的Base64处理

### 公共组件
- `UIControls.tsx`: 包含各种UI组件
  - `Switch`: 开关组件
  - `Dropdown`: 下拉选择组件
  - `IconButton`: 图标按钮组件
  - `TextArea`: 带行号的文本区域组件
  - `DropZone`: 文件拖放组件
  - `ToolPageHeader`: 工具页面头部组件
  - `ToolBar`: 工具栏组件
  - 各种预设按钮组件

## 使用方法

### 启动项目
```bash
npm run start
# 或者
yarn start
```

### 访问工具页面
- Base64文本工具: http://localhost:1420/#/tools/base64-text
- Base64图片工具: http://localhost:1420/#/tools/base64-image

## 文件结构
```
src/
├── components/
│   └── UIControls.tsx          # 公共UI组件
├── pages/
│   ├── Base64TextPage.tsx      # Base64文本工具页面
│   └── Base64ImagePage.tsx     # Base64图片工具页面
├── routes/
│   └── index.tsx               # 路由配置
└── tests/
    └── base64.test.ts          # 测试文件

src-tauri/
├── src/
│   ├── base64.rs               # Base64相关Rust函数
│   └── lib.rs                  # 主库文件
└── Cargo.toml                  # Rust依赖配置
```

## 依赖项

### 前端
- React 18
- TypeScript
- Heroicons
- Tailwind CSS

### 后端
- Tauri 2
- Rust base64 crate

## 功能说明

### Base64文本编码/解码
1. 在输入框中输入文本或Base64字符串
2. 使用顶部开关切换编码/解码模式
3. 结果会实时显示在输出框中
4. 可以使用工具栏按钮进行各种操作

### Base64图片编码/解码
1. 拖放图片文件到指定区域或点击"浏览文件"选择
2. 图片会自动编码为Base64并显示在左侧文本框
3. 右侧会显示图片预览
4. 支持从剪贴板粘贴图片或Base64文本
5. 可以保存解码后的图片文件