/// <reference types="vite/client" />

declare module '*.css';
declare module '*.svg' {
  const content: string; // o cualquier tipo que tu bundler maneje
  export default content;
}