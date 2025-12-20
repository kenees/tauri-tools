export interface Translation {
  common: {
    welcome: string;
    settings: string;
    allTools: string;
    recents: string;
    manageExtensions: string;
    markdownPreview: string;
    converters: string;
    encodersDecoders: string;
    searchPlaceholder: string;
    formatter: string;
    generators: string;
    graphics: string;
    testTool: string;
    textConvertersTools: string;
  };
  settings: {
    title: string;
    appearance: string;
    behavior: string;
    interfaceLanguage: {
      title: string;
      description: string;
      helpTranslate: string;
    };
    appTheme: {
      title: string;
      description: string;
    };
    compactSpacing: {
      title: string;
      description: string;
    };
    checkUpdates: {
      title: string;
      description: string;
    };
    showRecentTools: {
      title: string;
      description: string;
    };
    smartDetection: {
      title: string;
      description: string;
    };
    autoPasteClipboard: {
      title: string;
      description: string;
    };
  };
  tools: {
    base64Image: {
      title: string;
      description: string;
    };
    base64Text: {
      title: string;
      description: string;
    };
    certificate: {
      title: string;
      description: string;
    };
    colorBlindness: {
      title: string;
      description: string;
    };
    gzip: {
      title: string;
      description: string;
    };
    html: {
      title: string;
      description: string;
    };
    jwt: {
      title: string;
      description: string;
    };
    qrCode: {
      title: string;
      description: string;
    };
    url: {
      title: string;
      description: string;
    };
    settings: {
      title: string;
      description: string;
    };
    manageExtensions: {
      title: string;
      description: string;
    };
    jsonPathTester: {
      title: string;
      description: string;
    };
    regexTester: {
      title: string;
      description: string;
    };
    xmlTester: {
      title: string;
      description: string;
    };
    jsonFormatter: {
      title: string;
      description: string;
    };
    sqlFormatter: {
      title: string;
      description: string;
    };
    xmlFormatter: {
      title: string;
      description: string;
    };
    hashGenerator: {
      title: string;
      description: string;
    };
    loremLpsum: {
      title: string;
      description: string;
    };
    passwordGenerator: {
      title: string;
      description: string;
    };
    uuidGenerator: {
      title: string;
      description: string;
    };
    eyeDropper: {
      title: string;
      description: string;
    };
    imageResizer: {
      title: string;
      description: string;
    };
    escapeUnescape: {
      title: string;
      description: string;
    };
    listCompare: {
      title: string;
      description: string;
    };
    markdownPreview: {
      title: string;
      description: string;
    };
    textCaseConverter: {
      title: string;
      description: string;
    };
    textDiff: {
      title: string;
      description: string;
    };
    // converters
    cronParser: {
      title: string;
      description: string;
    };
    date: {
      title: string;
      description: string;
    };
    jsonToTable: {
      title: string;
      description: string;
    };
    jsonToYaml: {
      title: string;
      description: string;
    };
    numberBase: {
      title: string;
      description: string;
    };
  };
}

export const zhCN: Translation = {
  common: {
    welcome: "欢迎使用 DevToys",
    settings: "设置",
    allTools: "所有工具",
    recents: "最近使用",
    manageExtensions: "管理扩展",
    markdownPreview: "Markdown 预览",
    converters: "转换器",
    encodersDecoders: "编码器 / 解码器",
    searchPlaceholder: "输入以搜索工具...",
    formatter: "格式化工具",
    generators: "生成器",
    graphics: "图像处理",
    testTool: "测试工具",
    textConvertersTools: "文本处理",
  },
  settings: {
    title: "设置",
    appearance: "外观",
    behavior: "行为",
    interfaceLanguage: {
      title: "界面语言",
      description: "更改语言后必须重新启动应用程序",
      helpTranslate: "帮助我们翻译 DevToys!",
    },
    appTheme: {
      title: "应用主题",
      description: "选择要使用的应用主题",
    },
    compactSpacing: {
      title: "紧凑间距",
      description: "减少界面元素间的空间",
    },
    checkUpdates: {
      title: "检查更新",
      description: "DevToys 启动时自动检查更新",
    },
    showRecentTools: {
      title: "显示最近使用的工具",
      description: "在菜单中显示最近使用的 3 个工具。更改将在重启应用程序后生效。",
    },
    smartDetection: {
      title: "智能检测",
      description: "根据剪贴板内容自动检测最佳工具",
    },
    autoPasteClipboard: {
      title: "选择推荐工具时自动粘贴剪贴板内容",
      description: "",
    },
  },
  tools: {
    // encoders-decoders
    base64Image: {
      title: "Base64图片",
      description: "编码和解码 Base64 图像数据",
    },
    base64Text: {
      title: "Base64文本",
      description: "编码和解码 Base64 文本数据",
    },
    certificate: {
      title: "证书",
      description: "解码证书",
    },
    colorBlindness: {
      title: "色盲模拟器",
      description: "在图片或截图上模拟色盲",
    },
    gzip: {
      title: "GZip",
      description: "编码和解码 GZip 数据",
    },
    html: {
      title: "HTML",
      description: "编码和解码 HTML 数据",
    },
    jwt: {
      title: "JWT",
      description: "解码 JSON Web Token",
    },
    qrCode: {
      title: "二维码",
      description: "生成 QR 码",
    },
    url: {
      title: "URL",
      description: "编码和解码 URL 数据",
    },
    settings: {
      title: "设置",
      description: "自定义 DevToys 的外观和感觉",
    },
    manageExtensions: {
      title: "管理扩展",
      description: "在 DevToys 中添加和管理第三方扩展",
    },
    // testTool
    jsonPathTester: {
      title: "JSONPath",
      description: "测试和调试 JSONPath 表达式",
    },
    regexTester: {
      title: "正则表达式",
      description: "测试和调试正则表达式",
    },
    xmlTester: {
      title: "XML",
      description: "测试和调试 XML 路径表达式",
    },
    // formatters
    jsonFormatter: {
      title: "JSON",
      description: "格式化和美化 JSON 数据",
    },
    sqlFormatter: {
      title: "SQL",
      description: "格式化和美化 SQL 查询",
    },
    xmlFormatter: {
      title: "XML",
      description: "格式化和美化 XML 数据",
    },
    // generators
    hashGenerator: {
      title: "哈希生成器",
      description: "生成各种哈希值",
    },
    loremLpsum: {
      title: "乱数假文",
      description: "生成占位文本",
    },
    passwordGenerator: {
      title: "密码",
      description: "生成安全的随机密码",
    },
    uuidGenerator: {
      title: "UUID",
      description: "生成通用唯一标识符 (UUID)",
    },
    // graphics
    eyeDropper: {
      title: "色盲模拟器",
      description: "模拟色盲的颜色选择器工具",
    },
    imageResizer: {
      title: "图像格式转换器",
      description: "在不同图像格式之间转换",
    },
    // text-tools
    escapeUnescape: {
      title: "转义 / 反转义",
      description: "转义和反转义文本数据",
    },
    listCompare: {
      title: "列表比较",
      description: "比较两个列表",
    },
    markdownPreview: {
      title: "Markdown 预览",
      description: "使用类似 GitHub 的渲染预览 Markdown 文档",
    },
    textCaseConverter: {
      title: "文本分析和实用工具",
      description: "分析和处理文本数据的各种工具",
    },
    textDiff: {
      title: "比较",
      description: "分析两个文本之间的差异",
    },
    // converters
    cronParser: {
      title: "Cron解析器",
      description: "解析和生成 Cron 表达式",
    },
    date: {
      title: "日期",
      description: "在不同日期格式之间转换",
    },
    jsonToTable: {
      title: "JSON > 表格",
      description: "将 JSON 数据转换为表格格式",
    },
    jsonToYaml: {
      title: "JSON <> YAML",
      description: "将 JSON 数据转换为 YAML 格式",
    },
    numberBase: {
      title: "数字进制",
      description: "在不同数字进制之间转换",
    },
  },
};

export const enUS: Translation = {
  common: {
    welcome: "Welcome to DevToys",
    settings: "Settings",
    allTools: "All tools",
    recents: "Recents",
    manageExtensions: "Manage extensions",
    markdownPreview: "Markdown Preview",
    converters: "Converters",
    encodersDecoders: "Encoders / Decoders",
    searchPlaceholder: "Type to search for tools...",
    formatter: "Formatters",
    generators: "Generators",
    graphics: "Graphic",
    testTool: "Testers",
    textConvertersTools: "Text",
  },
  settings: {
    title: "Settings",
    appearance: "Appearance",
    behavior: "Behavior",
    interfaceLanguage: {
      title: "Interface Language",
      description: "The application must be restarted after changing the language",
      helpTranslate: "Help us translate DevToys!",
    },
    appTheme: {
      title: "App Theme",
      description: "Select the app theme to use",
    },
    compactSpacing: {
      title: "Compact Spacing",
      description: "Reduce the space between interface elements",
    },
    checkUpdates: {
      title: "Check for Updates",
      description: "Automatically check for updates when DevToys starts",
    },
    showRecentTools: {
      title: "Show Recent Tools",
      description: "Show the 3 most recently used tools in the menu. Changes will take effect after restarting the application.",
    },
    smartDetection: {
      title: "Smart Detection",
      description: "Automatically detect the best tool based on clipboard content",
    },
    autoPasteClipboard: {
      title: "Automatically paste clipboard content when selecting recommended tool",
      description: "",
    },
  },
  tools: {
    base64Image: {
      title: "Base64 Image",
      description: "Encode and decode Base64 image data",
    },
    base64Text: {
      title: "Base64 Text",
      description: "Encode and decode Base64 text data",
    },
    certificate: {
      title: "Certificate",
      description: "Decode a certificate",
    },
    colorBlindness: {
      title: "Color Blindness Simulator",
      description: "Simulate color blindness on a picture or screenshot",
    },
    gzip: {
      title: "GZip",
      description: "Encode and decode GZip data",
    },
    html: {
      title: "HTML",
      description: "Encode and decode HTML data",
    },
    jwt: {
      title: "JWT",
      description: "Decode JSON Web Token",
    },
    qrCode: {
      title: "QR Code",
      description: "Generate QR codes",
    },
    url: {
      title: "URL",
      description: "Encode and decode URL data",
    },
    settings: {
      title: "Settings",
      description: "Customize DevToys look & feel",
    },
    manageExtensions: {
      title: "Manage extensions",
      description: "Add and manage third-party extensions in DevToys",
    },
    jsonPathTester: {
      title: "JSONPath",
      description: "Test and debug JSONPath expressions",
    },
    regexTester: {
      title: "Regex",
      description: "Test and debug regular expressions",
    },
    xmlTester: {
      title: "XML",
      description: "Test and debug XML path expressions",
    },
    jsonFormatter: {
      title: "JSON",
      description: "Format and beautify JSON data",
    },
    sqlFormatter: {
      title: "SQL",
      description: "Format and beautify SQL queries",
    },
    xmlFormatter: {
      title: "XML",
      description: "Format and beautify XML data",
    },
    hashGenerator: {
      title: "Hash / Checksum",
      description: "Generate various hash values",
    },
    loremLpsum: {
      title: "Lorem Ipsum",
      description: "Generate placeholder text",
    },
    passwordGenerator: {
      title: "Password",
      description: "Generate secure random passwords",
    },
    uuidGenerator: {
      title: "UUID",
      description: "Generate Universally Unique Identifiers (UUIDs)",
    },
    eyeDropper: {
      title: "Color Blindness Simulator",
      description: "A color picker tool with color blindness simulation",
    },
    imageResizer: {
      title: "Image Converter",
      description: "Convert between different image formats",
    },
    escapeUnescape: {
      title: "Escape / Unescape",
      description: "Escape and unescape text data",
    },
    listCompare: {
      title: "List Compare",
      description: "Compare two lists",
    },
    markdownPreview: {
      title: "Markdown Preview",
      description: "Preview a Markdown document with a GitHub-like render",
    },
    textCaseConverter: {
      title: "Analysis & Utilities",
      description: "Various tools to analyze and manipulate text data",
    },
    textDiff: {
      title: "Compare",
      description: "Analyze the differences between two texts",
    },
    cronParser: {
      title: "Cron Parser",
      description: "Parse and generate Cron expressions",
    },
    date: {
      title: "Date",
      description: "Convert between different date formats",
    },
    jsonToTable: {
      title: "JSON > Table",
      description: "Convert JSON data to table format",
    },
    jsonToYaml: {
      title: "JSON <> YAML",
      description: "Convert JSON data to YAML format",
    },
    numberBase: {
      title: "Number Base",
      description: "Convert between different number bases",
    },
  },
};

export const languages = {
  "zh-CN": { name: "简体中文", translation: zhCN },
  "en-US": { name: "English", translation: enUS },
};

export type LanguageKey = keyof typeof languages;
