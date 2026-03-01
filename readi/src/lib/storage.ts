// Utilitaire de stockage sécurisé - bloque LocalStorage en production
// GARANTIE : Aucun accès LocalStorage en production

// Détection robuste de l'environnement de production
function checkIsProduction(): boolean {
  // Vérification côté client uniquement
  if (typeof window === "undefined") {
    return false;
  }

  // Vérification via la variable d'environnement Next.js
  const env = process.env.NODE_ENV;
  
  // Vérification supplémentaire via l'URL (production = HTTPS et domaine spécifique)
  const isHttps = window.location.protocol === "https:";
  const isProductionDomain = window.location.hostname === "app.readi.fr";
  
  // Production = NODE_ENV === "production" OU (HTTPS + domaine de production)
  return env === "production" || (isHttps && isProductionDomain);
}

// Variable figée au chargement du module
const IS_PRODUCTION = checkIsProduction();

// Log de confirmation au chargement
if (typeof window !== "undefined") {
  console.log(`[Storage] Environment: ${IS_PRODUCTION ? "PRODUCTION - LocalStorage BLOCKED" : "Development - LocalStorage allowed"}`);
}

export const storage = {
  getItem: (key: string): string | null => {
    if (IS_PRODUCTION) {
      console.warn(`[Production] LocalStorage READ blocked for key: ${key}`);
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (IS_PRODUCTION) {
      console.warn(`[Production] LocalStorage WRITE blocked for key: ${key}`);
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail
    }
  },

  removeItem: (key: string): void => {
    if (IS_PRODUCTION) {
      console.warn(`[Production] LocalStorage DELETE blocked for key: ${key}`);
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },

  clear: (): void => {
    if (IS_PRODUCTION) {
      console.warn("[Production] LocalStorage CLEAR blocked");
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
    isProduction: IS_PRODUCTION,
    storage,
  };
}

// Export de la constante pour vérification externe
export { IS_PRODUCTION };
