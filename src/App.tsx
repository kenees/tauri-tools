import { useEffect } from "react";
import Store from "./store";
import RouteComponents from "./routes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes"


export default () => {
  useEffect(() => {}, []);

  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main className="text-foreground bg-background absolute w-full h-full">
          <ToastProvider />
          <Store>
            <RouteComponents />
          </Store>
        </main>
      </ThemeProvider>
    </HeroUIProvider>
  );
};
