import ToolCard from "../components/ToolCard";
import { useLanguage } from "../contexts/LanguageContext";

export default function DevToysHome() {
  const { t } = useLanguage();

  const recentTools = [
    {
      title: t.tools.settings.title,
      description: t.tools.settings.description,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827427.png",
      iconAlt: "Settings",
    },
    {
      title: t.tools.manageExtensions.title,
      description: t.tools.manageExtensions.description,
      icon: "https://cdn-icons-png.flaticon.com/512/3598/3598191.png",
      iconAlt: "Extensions",
    },
    {
      title: t.tools.markdownPreview.title,
      description: t.tools.markdownPreview.description,
      icon: "https://cdn-icons-png.flaticon.com/512/3991/3991696.png",
      iconAlt: "Markdown",
    },
  ];

  const allTools = [
    {
      title: t.tools.base64Image.title,
      description: t.tools.base64Image.description,
      icon: "https://cdn-icons-png.flaticon.com/512/2965/2965291.png",
      iconAlt: "Base64 Image",
    },
    {
      title: t.tools.base64Text.title,
      description: t.tools.base64Text.description,
      icon: "https://cdn-icons-png.flaticon.com/512/3595/3595268.png",
      iconAlt: "Base64 Text",
    },
    {
      title: t.tools.certificate.title,
      description: t.tools.certificate.description,
      icon: "https://cdn-icons-png.flaticon.com/512/3426/3426653.png",
      iconAlt: "Certificate",
    },
    {
      title: t.tools.colorBlindness.title,
      description: t.tools.colorBlindness.description,
      icon: "https://cdn-icons-png.flaticon.com/512/3426/3426653.png",
      iconAlt: "Color Blindness",
    },
  ];

  const handleToolClick = (toolTitle: string) => {
    console.log(`Clicked on tool: ${toolTitle}`);
    // Handle navigation to tool page
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.common.welcome}</h1>

        <span className="text-gray-600 dark:text-gray-400 text-sm">v2.0-preview.8</span>
      </div>

      {/* Recents Section */}

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.common.recents}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTools.map((tool, index) => (
            <ToolCard key={`recent-${index}`} title={tool.title} description={tool.description} icon={tool.icon} iconAlt={tool.iconAlt} onClick={() => handleToolClick(tool.title)} />
          ))}
        </div>
      </section>

      {/* Divider */}

      <div className="border-t border-gray-300 dark:border-gray-700 my-8"></div>

      {/* All Tools Section */}

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t.common.allTools}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool, index) => (
            <ToolCard key={`tool-${index}`} title={tool.title} description={tool.description} icon={tool.icon} iconAlt={tool.iconAlt} onClick={() => handleToolClick(tool.title)} />
          ))}
        </div>
      </section>
    </div>
  );
}
