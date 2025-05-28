declare module 'react-dom/client' {
  export function createRoot(
    container: Element | DocumentFragment,
    options?: {
      hydrate?: boolean;
      onRecoverableError?: (error: unknown) => void;
    }
  ): {
    render(children: React.ReactNode): void;
    unmount(): void;
  };
} 