import { HomeIcon, CogIcon, PuzzlePieceIcon, QrCodeIcon, RectangleGroupIcon, EyeSlashIcon, CalendarIcon, TableCellsIcon } from "@heroicons/react/24/outline";
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

export interface MenuItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  titleKey?: string;
  descriptionKey?: string;
}

export const menuItems: MenuItem[] = [
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
    titleKey: "tools.settings.title",
    descriptionKey: "tools.settings.description",
  },
  {
    id: "manage-extensions",
    labelKey: "common.manageExtensions",
    icon: <PuzzlePieceIcon className="w-5 h-5" />,
    path: "/extensions",
    titleKey: "tools.manageExtensions.title",
    descriptionKey: "tools.manageExtensions.description",
  },
  {
    id: "markdown-preview",
    labelKey: "common.markdownPreview",
    icon: <MarkdownIcon />,
    path: "/markdown",
    titleKey: "tools.markdownPreview.title",
    descriptionKey: "tools.markdownPreview.description",
  },
  {
    id: "encoders-decoders",
    labelKey: "common.encodersDecoders",
    icon: <EncodersIcon />,
    children: [
      { id: "base64-image", labelKey: "tools.base64Image.title", icon: <Base64Image />, path: "/tools/base64-image", titleKey: "tools.base64Image.title", descriptionKey: "tools.base64Image.description" },
      { id: "base64-text", labelKey: "tools.base64Text.title", icon: <Base64Text />, path: "/tools/base64-text", titleKey: "tools.base64Text.title", descriptionKey: "tools.base64Text.description" },
      { id: "certificate", labelKey: "tools.certificate.title", icon: <CertificateIcon />, path: "/tools/certificate", titleKey: "tools.certificate.title", descriptionKey: "tools.certificate.description" },
      { id: "gzip", labelKey: "tools.gzip.title", icon: <GzipIcon />, path: "/tools/gzip", titleKey: "tools.gzip.title", descriptionKey: "tools.gzip.description" },
      { id: "html", labelKey: "tools.html.title", icon: <HtmlIcon />, path: "/tools/html", titleKey: "tools.html.title", descriptionKey: "tools.html.description" },
      { id: "jwt", labelKey: "tools.jwt.title", icon: <JwtIcon />, path: "/tools/jwt", titleKey: "tools.jwt.title", descriptionKey: "tools.jwt.description" },
      { id: "qrcode", labelKey: "tools.qrCode.title", icon: <QrCodeIcon className="w-4 h-4" />, path: "/tools/qrcode", titleKey: "tools.qrCode.title", descriptionKey: "tools.qrCode.description" },
      { id: "url", labelKey: "tools.url.title", icon: <UrlIcon />, path: "/tools/url", titleKey: "tools.url.title", descriptionKey: "tools.url.description" },
    ],
  },
  {
    id: "test-tools",
    labelKey: "common.testTool",
    icon: <RectangleGroupIcon className="w-4 h-4" />,
    children: [
      { id: "json-path-tester", labelKey: "tools.jsonPathTester.title", icon: <JsonFormatter />, path: "/tools/json-path-tester", titleKey: "tools.jsonPathTester.title", descriptionKey: "tools.jsonPathTester.description" },
      { id: "regex", labelKey: "tools.regexTester.title", icon: <RegexTester />, path: "/tools/text-diff", titleKey: "tools.regexTester.title", descriptionKey: "tools.regexTester.description" },
      { id: "testers-xml", labelKey: "tools.xmlTester.title", icon: <XmlIcon />, path: "/tools/text-case-converter", titleKey: "tools.xmlTester.title", descriptionKey: "tools.xmlTester.description" },
    ],
  },
  {
    id: "formatter",
    labelKey: "common.formatter",
    icon: <FormatterIcon />,
    children: [
      { id: "json-formatter", labelKey: "tools.jsonFormatter.title", icon: <JsonFormatter />, path: "/tools/json-formatter", titleKey: "tools.jsonFormatter.title", descriptionKey: "tools.jsonFormatter.description" },
      { id: "sql-formatter", labelKey: "tools.sqlFormatter.title", icon: <SqlIcon />, path: "/tools/sql-formatter", titleKey: "tools.sqlFormatter.title", descriptionKey: "tools.sqlFormatter.description" },
      { id: "xml-formatter", labelKey: "tools.xmlFormatter.title", icon: <XmlIcon />, path: "/tools/xml-formatter", titleKey: "tools.xmlFormatter.title", descriptionKey: "tools.xmlFormatter.description" },
    ],
  },
  {
    id: "generators",
    labelKey: "common.generators",
    icon: <GeneratorsIcon />,
    children: [
      { id: "hash-generator", labelKey: "tools.hashGenerator.title", icon: <HashGenerator />, path: "/tools/hash-generator", titleKey: "tools.hashGenerator.title", descriptionKey: "tools.hashGenerator.description" },
      { id: "lorem-lpsum", labelKey: "tools.loremLpsum.title", icon: <LoremLpsum />, path: "/tools/lorem-lpsum", titleKey: "tools.loremLpsum.title", descriptionKey: "tools.loremLpsum.description" },
      { id: "password-generator", labelKey: "tools.passwordGenerator.title", icon: <MarkdownIcon />, path: "/tools/password-generator", titleKey: "tools.passwordGenerator.title", descriptionKey: "tools.passwordGenerator.description" },
      { id: "uuid-generator", labelKey: "tools.uuidGenerator.title", icon: <UuidGenerator />, path: "/tools/uuid-generator", titleKey: "tools.uuidGenerator.title", descriptionKey: "tools.uuidGenerator.description" },
    ],
  },
  {
    id: "graphics",
    labelKey: "common.graphics",
    icon: <GraphicToolsIcon />,
    children: [
      { id: "color-blindness-simulator", labelKey: "tools.eyeDropper.title", icon: <EyeSlashIcon className="w-4 h-4" />, path: "/tools/eye-dropper", titleKey: "tools.eyeDropper.title", descriptionKey: "tools.eyeDropper.description" },
      { id: "image-converter", labelKey: "tools.imageResizer.title", icon: <ImageConverterIcon />, path: "/tools/image-resizer", titleKey: "tools.imageResizer.title", descriptionKey: "tools.imageResizer.description" },
    ],
  },
  {
    id: "text-tools",
    labelKey: "common.textConvertersTools",
    icon: <TextIcon />,
    children: [
      { id: "text-escape", labelKey: "tools.escapeUnescape.title", icon: <StringEscapeUnescapeIcon />, path: "/tools/base64-converter", titleKey: "tools.escapeUnescape.title", descriptionKey: "tools.escapeUnescape.description" },
      { id: "text-list-compare", labelKey: "tools.listCompare.title", icon: <ListCompareIcon />, path: "/tools/url-encoder-decoder", titleKey: "tools.listCompare.title", descriptionKey: "tools.listCompare.description" },
      { id: "text-tools-markdown", labelKey: "tools.markdownPreview.title", icon: <MarkdownIcon />, path: "/tools/html-encoder-decoder", titleKey: "tools.markdownPreview.title", descriptionKey: "tools.markdownPreview.description" },
      { id: "text-tools-analyze", labelKey: "tools.textCaseConverter.title", icon: <StringUtilitiesIcon />, path: "/tools/html-encoder-decoder", titleKey: "tools.textCaseConverter.title", descriptionKey: "tools.textCaseConverter.description" },
      { id: "text-tools-diff", labelKey: "tools.textDiff.title", icon: <TextDiffIcon />, path: "/tools/html-encoder-decoder", titleKey: "tools.textDiff.title", descriptionKey: "tools.textDiff.description" },
    ],
  },
  {
    id: "converters",
    labelKey: "common.converters",
    icon: <CoverterIcon />,
    children: [
      { id: "cron-parser", labelKey: "tools.cronParser.title", icon: <CronParserIcon />, path: "/tools/csv-to-json", titleKey: "tools.cronParser.title", descriptionKey: "tools.cronParser.description" },
      { id: "date", labelKey: "tools.date.title", icon: <CalendarIcon className="w-4 h-4" />, path: "/tools/csv-to-json", titleKey: "tools.date.title", descriptionKey: "tools.date.description" },
      { id: "json-to-table", labelKey: "tools.jsonToTable.title", icon: <TableCellsIcon className="w-4 h-4" />, path: "/tools/json-to-csv", titleKey: "tools.jsonToTable.title", descriptionKey: "tools.jsonToTable.description" },
      { id: "json-to-yaml", labelKey: "tools.jsonToYaml.title", icon: <CoverterIcon />, path: "/tools/json-to-xml", titleKey: "tools.jsonToYaml.title", descriptionKey: "tools.jsonToYaml.description" },
      { id: "number-base", labelKey: "tools.numberBase.title", icon: <NumberBaseConverter />, path: "/tools/xml-to-json", titleKey: "tools.numberBase.title", descriptionKey: "tools.numberBase.description" },
    ],
  },
];

// 获取所有工具的扁平化列表
export const getAllTools = (): MenuItem[] => {
  const tools: MenuItem[] = [];

  const extractTools = (items: MenuItem[]) => {
    items.forEach((item) => {
      // 如果有路径且有标题和描述键，则将其视为工具
      if (item.path && item.titleKey && item.descriptionKey) {
        tools.push(item);
      }

      // 递归处理子项
      if (item.children) {
        extractTools(item.children);
      }
    });
  };

  extractTools(menuItems);
  return tools;
};
