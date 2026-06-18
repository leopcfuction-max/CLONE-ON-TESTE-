import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Helps diagnose missing configuration during development.
  console.warn(
    '[v0] Variáveis do Supabase ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Implicit flow keeps recovery handling simple in a router-less SPA:
    // the email link returns to the app with `#type=recovery` in the hash,
    // which the client auto-detects and surfaces via the PASSWORD_RECOVERY event.
    flowType: 'implicit',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * True when the current URL is a Supabase password-recovery redirect.
 * Used so the app can immediately show the "new password" screen.
 */
export function isRecoveryRedirect(): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash || '';
  return hash.includes('type=recovery');
}
