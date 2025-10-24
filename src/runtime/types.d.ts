declare module "#app" {
  interface NuxtApp {
    $config: {
      public: Record<string, any>;
    };
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $config: {
      public: Record<string, any>;
    };
  }
}

export * from "./types";
