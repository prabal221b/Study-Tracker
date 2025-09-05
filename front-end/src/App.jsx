import React from "react";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/theme-provider"
import { SmoothCursor } from "./components/ui/smooth-cursor";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
      <SmoothCursor />
    </ThemeProvider>
  );
}
