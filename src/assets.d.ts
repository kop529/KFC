// Asset type declarations for the IDE
// Vite handles these at build time via its asset pipeline.
// This file tells the TypeScript language server to treat image/font imports as valid modules.

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}
