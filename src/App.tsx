import RouteComponents from "./routes";
import { HeroUIProvider } from "@heroui/react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <LanguageProvider>
          <div className="text-foreground bg-background w-full h-full">
            <RouteComponents />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
