# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### 重要

    改造成桌面宠物，可互动打开各种功能
    [1] 窗口透明，多窗口
    [2] 添加状态栏
    [3] 添加菜单栏
    [4] 添加右键， 鼠标悬浮
    [5] 准备宠物动画

### TODO

    [✅] jwt解码
    [..] Android 日志查看
    [3]  远程shell 工具， 后期支持文件传输可视化
    [4]  Gif图片生成
    [5]  表情包搜索
    [6]  音乐播放器
    [7]  文本转语音功能，生成音频文件
    [8]  开发环境一键安装
    [10] 跨平台剪切板（需要账号系统）
    [11] Api post
    [12] 颜色汲取
    [13] 3d场景

###

```
    web: yarn build
    app: yarn tauri build
```

### 问题

[-] 为什么[Sizes.ts](./src//pages/Bruno/utils/Sizes.ts)中要通过创建一个 div 来获取 viewport 的宽高
[-] gsap 动画库
