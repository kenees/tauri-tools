import { useEffect } from "react";
import Application from "./Application";

declare global {
  interface Window {
    application: any;
  }
}

export default () => {
  useEffect(() => {
    if (window.application) {
      return;
    }
    window.application = new Application({
      $canvas: document.querySelector(".js-canvas"),
      useComposer: true,
    });
  }, []);

  return <canvas className="w-full h-full js-canvas" />;
};
