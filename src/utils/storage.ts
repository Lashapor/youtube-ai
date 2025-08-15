export type ApiKeys = {
  supadataKey: string;
  openaiKey: string;
};

const STORAGE_KEY = "youtube-ai-config";

export function saveApiKeys(keys: ApiKeys): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error("Failed to save API keys:", error);
  }
}

export function loadApiKeys(): ApiKeys {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load API keys:", error);
  }
  
  return {
    supadataKey: "",
    openaiKey: "",
  };
}

export function hasValidKeys(keys: ApiKeys): boolean {
  return keys.supadataKey.trim() !== "" && keys.openaiKey.trim() !== "";
}