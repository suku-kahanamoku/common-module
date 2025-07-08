import type { useColorMode } from "#imports";

declare module "#app" {
  interface NuxtApp {
    $colorMode: ReturnType<typeof useColorMode>;
    $config: {
      public: Record<string, any>;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $colorMode: ReturnType<typeof useColorMode>;
    $config: {
      public: Record<string, any>;
    };
  }
}

export * from "./types/config.interface";
export * from "./types/item.interface";
export * from "./types/response.interface";