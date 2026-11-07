import { createClient } from '@supabase/supabase-js';

import { localSupabase } from './local-db';

// Creamos una función interna para obtener el cliente, validando las variables
function createSupabaseClient() {
  const useLocal = process.env.USE_LOCAL_DB === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useLocal) {
    console.log("[DB_ROUTER] Operando en MODO LOCAL (Base de datos persistente en disco data/local-db.json)");
    return localSupabase;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || url.includes('placeholder')) {
    console.log("[DB_ROUTER] URL no configurada, usando MODO LOCAL automáticamente");
    return localSupabase;
  }

  if (!key || key.includes('placeholder')) {
    console.log("[DB_ROUTER] Key no configurada, usando MODO LOCAL automáticamente");
    return localSupabase;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Exportamos un Proxy que inicializa el cliente solo cuando se accede a él.
// Esto evita que falle el cargado del módulo (import) en Next.js Server Components.
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    // Ignorar símbolos y propiedades internas para evitar inicialización prematura
    if (typeof prop === 'symbol' || prop === '$$typeof' || prop === 'toJSON') {
      return (target as any)[prop];
    }
    
    if (!target._instance) {
      target._instance = createSupabaseClient();
    }
    return target._instance[prop];
  }
});
