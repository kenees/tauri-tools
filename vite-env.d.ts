/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react';

  // 定义支持任意属性的 SVG 组件
  export const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement> & {
      [key: string]: any; // 允许任何额外属性
    }
  >;

  const src: string;
  export default src;
}