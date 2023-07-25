import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv("mock", process.cwd(), "");
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || "/",
  };
});