import { Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { HomeIcon, MagnifyingGlassIcon, CogIcon, PuzzlePieceIcon, QrCodeIcon, ChevronDownIcon, ChevronRightIcon, RectangleGroupIcon, EyeSlashIcon, CalendarIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../contexts/LanguageContext";
import MarkdownIcon from "../assets/MarkdownPreview.svg";
import EncodersIcon from "../assets/EncodersDecoders.svg";
import Base64Image from "../assets/Base64ImageEncoderDecoder.svg";
import Base64Text from "../assets/Base64EncoderDecoder.svg";
import CertificateIcon from "../assets/CertificateEncoderDecoder.svg";
import GzipIcon from "../assets/GZipEncoderDecoder.svg";
import HtmlIcon from "../assets/HtmlEncoderDecoder.svg";
import JwtIcon from "../assets/JwtDecoder.svg";
import UrlIcon from "../assets/UrlEncoderDecoder.svg";
import JsonFormatter from "../assets/JsonFormatter.svg";
import RegexTester from "../assets/RegexTester.svg";
import XmlIcon from "../assets/XmlFormatter.svg";
import FormatterIcon from "../assets/Formatters.svg";
import SqlIcon from "../assets/SqlFormatter.svg";
import GeneratorsIcon from "../assets/Generators.svg";
import HashGenerator from "../assets/HashGenerator.svg";
import LoremLpsum from "../assets/LoremIpsumGenerator.svg";
import UuidGenerator from "../assets/UuidGenerator.svg";
import GraphicToolsIcon from "../assets/GraphicTools.svg";
import ImageConverterIcon from "../assets/ImageConverter.svg";
import TextIcon from "../assets/TextTools.svg";
import StringEscapeUnescapeIcon from "../assets/StringEscapeUnescape.svg";
import TextDiffIcon from "../assets/TextDiff.svg";
import StringUtilitiesIcon from "../assets/StringUtilities.svg";
import ListCompareIcon from "../assets/ListCompare.svg";
import CoverterIcon from "../assets/Converters.svg";
import CronParserIcon from "../assets/CronParser.svg";
import NumberBaseConverter from "../assets/NumberBaseConverter.svg";

interface MenuItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["converters", "encoders-decoders"]));
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems: MenuItem[] = [
    {
      id: "all-tools",
      labelKey: "common.allTools",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/",
    },
    {
      id: "settings",
      labelKey: "common.settings",
      icon: <CogIcon className="w-5 h-5" />,
      path: "/settings",
    },
    {
      id: "manage-extensions",
      labelKey: "common.manageExtensions",
      icon: <PuzzlePieceIcon className="w-5 h-5" />,
      path: "/extensions",
    },
    {
      id: "markdown-preview",
      labelKey: "common.markdownPreview",
      icon: <MarkdownIcon />,
      path: "/markdown",
    },
    {
      id: "encoders-decoders",
      labelKey: "common.encodersDecoders",
      icon: <EncodersIcon />,
      children: [
        { id: "base64-image", labelKey: "tools.base64Image.title", icon: <Base64Image />, path: "/tools/base64-image" },
        { id: "base64-text", labelKey: "tools.base64Text.title", icon: <Base64Text />, path: "/tools/base64-text" },
        { id: "certificate", labelKey: "tools.certificate.title", icon: <CertificateIcon />, path: "/tools/certificate" },
        { id: "gzip", labelKey: "tools.gzip.title", icon: <GzipIcon />, path: "/tools/gzip" },
        { id: "html", labelKey: "tools.html.title", icon: <HtmlIcon />, path: "/tools/html" },
        { id: "jwt", labelKey: "tools.jwt.title", icon: <JwtIcon />, path: "/tools/jwt" },
        { id: "qrcode", labelKey: "tools.qrCode.title", icon: <QrCodeIcon className="w-4 h-4" />, path: "/tools/qrcode" },
        { id: "url", labelKey: "tools.url.title", icon: <UrlIcon />, path: "/tools/url" },
      ],
    },
    {
      id: "test-tools",
      labelKey: "common.testTool",
      icon: <RectangleGroupIcon className="w-4 h-4" />,
      children: [
        { id: "json-path-tester", labelKey: "tools.jsonPathTester.title", icon: <JsonFormatter />, path: "/tools/json-path-tester" },
        { id: "regex", labelKey: "tools.regexTester.title", icon: <RegexTester />, path: "/tools/text-diff" },
        { id: "testers-xml", labelKey: "tools.xmlTester.title", icon: <XmlIcon />, path: "/tools/text-case-converter" },
      ],
    },
    {
      id: "formatter",
      labelKey: "common.formatter",
      icon: <FormatterIcon />,
      children: [
        { id: "json-formatter", labelKey: "tools.jsonFormatter.title", icon: <JsonFormatter />, path: "/tools/json-formatter" },
        { id: "sql-formatter", labelKey: "tools.sqlFormatter.title", icon: <SqlIcon />, path: "/tools/sql-formatter" },
        { id: "xml-formatter", labelKey: "tools.xmlFormatter.title", icon: <XmlIcon />, path: "/tools/xml-formatter" },
      ],
    },
    {
      id: "generators",
      labelKey: "common.generators",
      icon: <GeneratorsIcon />,
      children: [
        { id: "hash-generator", labelKey: "tools.hashGenerator.title", icon: <HashGenerator />, path: "/tools/hash-generator" },
        { id: "lorem-lpsum", labelKey: "tools.loremLpsum.title", icon: <LoremLpsum />, path: "/tools/lorem-lpsum" },
        { id: "password-generator", labelKey: "tools.passwordGenerator.title", icon: <MarkdownIcon />, path: "/tools/password-generator" },
        { id: "uuid-generator", labelKey: "tools.uuidGenerator.title", icon: <UuidGenerator />, path: "/tools/uuid-generator" },
      ],
    },
    {
      id: "graphics",
      labelKey: "common.graphics",
      icon: <GraphicToolsIcon />,
      children: [
        { id: "color-blindness-simulator", labelKey: "tools.eyeDropper.title", icon: <EyeSlashIcon className="w-4 h-4" />, path: "/tools/eye-dropper" },
        { id: "image-converter", labelKey: "tools.imageResizer.title", icon: <ImageConverterIcon />, path: "/tools/image-resizer" },
      ],
    },
    {
      id: "text-tools",
      labelKey: "common.textConvertersTools",
      icon: <TextIcon />,
      children: [
        { id: "text-escape", labelKey: "tools.escapeUnescape.title", icon: <StringEscapeUnescapeIcon />, path: "/tools/base64-converter" },
        { id: "text-list-compare", labelKey: "tools.listCompare.title", icon: <ListCompareIcon />, path: "/tools/url-encoder-decoder" },
        { id: "text-tools-markdown", labelKey: "tools.markdownPreview.title", icon: <MarkdownIcon />, path: "/tools/html-encoder-decoder" },
        { id: "text-tools-analyze", labelKey: "tools.textCaseConverter.title", icon: <StringUtilitiesIcon />, path: "/tools/html-encoder-decoder" },
        { id: "text-tools-diff", labelKey: "tools.textDiff.title", icon: <TextDiffIcon />, path: "/tools/html-encoder-decoder" },
      ],
    },
    {
      id: "converters",
      labelKey: "common.converters",
      icon: <CoverterIcon />,
      children: [
        { id: "cron-parser", labelKey: "tools.cronParser.title", icon: <CronParserIcon />, path: "/tools/csv-to-json" },
        { id: "date", labelKey: "tools.date.title", icon: <CalendarIcon className="w-4 h-4" />, path: "/tools/csv-to-json" },
        { id: "json-to-table", labelKey: "tools.jsonToTable.title", icon: <TableCellsIcon className="w-4 h-4" />, path: "/tools/json-to-csv" },
        { id: "json-to-yaml", labelKey: "tools.jsonToYaml.title", icon: <CoverterIcon />, path: "/tools/json-to-xml" },
        { id: "number-base", labelKey: "tools.numberBase.title", icon: <NumberBaseConverter />, path: "/tools/xml-to-json" },
      ],
    },
  ];

  const getLabel = (labelKey: string) => {
    const keys = labelKey.split(".");
    let value: any = t;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return labelKey;
    }
    return value;
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isSelected = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white" : "hover:bg-gray-300 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"}`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => handleItemClick(item)}
        >
          {item.icon}
          <span className="flex-1 text-sm">{getLabel(item.labelKey)}</span>
          {hasChildren && <span className="text-xs">{isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}</span>}
        </div>
        {hasChildren && isExpanded && <div className="mt-1">{item.children!.map((child) => renderMenuItem(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-200 dark:bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">D</div>
            <span className="font-semibold">DevToys</span>
            <span className="ml-auto text-xs text-gray-400">v2.0-preview.8</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-2">{menuItems.map((item) => renderMenuItem(item))}</div>

        {/* Bottom Menu Items */}
        <div className="p-2 border-t border-gray-300 dark:border-gray-700">{menuItems.slice(1, 3).map((item) => renderMenuItem(item))}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
