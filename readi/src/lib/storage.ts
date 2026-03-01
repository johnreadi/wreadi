// Utilitaire de stockage sécurisé - bloque LocalStorage en production

const isProduction = process.env.NODE_ENV === "production";

export const storage = {
  getItem: (key: string): string | null => {
    if (isProduction) {
      console.warn(`[Production] LocalStorage access blocked for key: ${key}`);
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (isProduction) {
      console.warn(`[Production] LocalStorage write blocked for key: ${key}`);
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail
    }
  },

  removeItem: (key: string): void => {
    if (isProduction) {
      console.warn(`[Production] LocalStorage delete blocked for key: ${key}`);
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },

  clear: (): void => {
    if (isProduction) {
      console.warn("[Production] LocalStorage clear blocked");
      return;
    }
    try {
      localStorage.clear();
    } catch {
      // Silent fail
    }
  },
};

// Hook sécurisé pour le localStorage
export function useSecureStorage() {
  return {
    isProduction,
    storage,
    // En production, ces fonctions ne font rien
    // En développement, elles accèdent au localStorage
  };
}
