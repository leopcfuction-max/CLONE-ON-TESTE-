import React, { useState, useEffect } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  KeyRound, Check, MailCheck, Loader2, AlertCircle, ShieldCheck,
} from 'lucide-react';
import { supabase, isRecoveryRedirect } from '../lib/supabase';

type Step = 'login' | 'register' | 'forgot-password' | 'check-email' | 'reset-password';

interface AuthScreenProps {
  onAuthenticated: (user: { name: string; email: string }) => void;
  onGuest: () => void;
}

const PRIMARY = '#2563EB';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Small reusable brand logo block used on the recovery screens
function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-black text-base shadow-sm"
        style={{ backgroundColor: PRIMARY }}
      >
        A
      </div>
      <span className="font-display font-bold text-lg text-[#1f2937]">Angel Voyage</span>
    </div>
  );
}

export default function AuthScreen({ onAuthenticated, onGuest }: AuthScreenProps) {
  // If the user arrived here from a password-recovery email, jump straight
  // to the "new password" screen.
  const [step, setStep] = useState<Step>(() =>
    isRecoveryRedirect() ? 'reset-password' : 'login',
  );

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Recover-password state
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverError, setRecoverError] = useState('');

  // Reset (new) password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Listen for the Supabase recovery event. When the user clicks the link in
  // the email, the client detects the session in the URL and emits
  // PASSWORD_RECOVERY — at which point we show the new-password screen.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStep('reset-password');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- Helpers: input masks ---
  const maskCpf = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskPhone = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    onAuthenticated({ name: loginEmail.split('@')[0], email: loginEmail });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regCpf || !regPhone || !regPassword || !regConfirm) return;
    if (regPassword !== regConfirm) return;
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setLoginEmail(regEmail);
      setStep('login');
      setRegName(''); setRegEmail(''); setRegCpf(''); setRegPhone('');
      setRegPassword(''); setRegConfirm('');
    }, 1600);
  };

  // Real Supabase password recovery via email.
  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');

    const email = recoverEmail.trim();
    if (!email) {
      setRecoverError('Informe o seu email.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setRecoverError('Informe um email válido.');
      return;
    }

    setRecoverLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setRecoverLoading(false);

    if (error) {
      setRecoverError(error.message);
      return;
    }
    // For security, Supabase always succeeds regardless of whether the email
    // exists — we show the confirmation screen either way.
    setStep('check-email');
  };

  // Real Supabase password update for the recovered session.
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8) {
      setResetError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('As senhas não coincidem.');
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setResetLoading(false);

    if (error) {
      setResetError(error.message);
      return;
    }

    setResetSuccess(true);
    // Clean the recovery hash from the URL and return to login.
    setTimeout(async () => {
      await supabase.auth.signOut();
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setResetSuccess(false);
      setNewPassword('');
      setConfirmPassword('');
      setStep('login');
    }, 1800);
  };

  const inputBase =
    'w-full bg-white border border-gray-200 rounded-lg py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all';

  // ---------- LOGIN ----------
  const renderLogin = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <h1 className="font-display font-extrabold text-2xl text-[#1f2937]">Entrar</h1>
      <p className="text-gray-400 text-sm mt-1 mb-6">Faça login para continuar sua jornada</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="seu@email.com"
              className={`${inputBase} pl-10 pr-4`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showLoginPassword ? 'text' : 'password'}
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputBase} pl-10 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
            />
            Lembrar-me
          </label>
          <button
            type="button"
            onClick={() => { setRecoverError(''); setStep('forgot-password'); }}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>

        <button
          type="submit"
          className="w-full text-white font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
          style={{ backgroundColor: PRIMARY }}
        >
          Entrar
        </button>
      </form>

      {/* Test credentials */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-1.5 text-gray-700 mb-3">
          <KeyRound className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Credenciais de teste</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-bold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Usuário</p>
            <p className="text-gray-700">teste@example.com</p>
            <p className="text-gray-700">senha123</p>
          </div>
          <div>
            <p className="font-bold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Admin</p>
            <p className="text-gray-700">admin@gmail.com</p>
            <p className="text-gray-700">admin123</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setStep('register')}
          className="text-[#2563EB] font-semibold hover:underline"
        >
          Criar conta
        </button>
        <button
          type="button"
          onClick={onGuest}
          className="flex items-center gap-1 text-gray-500 font-medium hover:text-gray-700"
        >
          Continuar como visitante
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  // ---------- REGISTER ----------
  const renderRegister = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <h1 className="font-display font-extrabold text-2xl text-[#1f2937] mb-6">Criar conta</h1>

      {registerSuccess ? (
        <div className="py-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <p className="font-semibold text-gray-800">Conta criada com sucesso!</p>
          <p className="text-sm text-gray-400">Redirecionando para o login...</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
              <input type="text" required value={regName}
                onChange={(e) => setRegName(e.target.value)} className={`${inputBase} px-4`} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)} className={`${inputBase} px-4`} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">CPF</label>
              <input type="text" required inputMode="numeric" value={regCpf}
                onChange={(e) => setRegCpf(maskCpf(e.target.value))}
                placeholder="000.000.000-00" className={`${inputBase} px-4`} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone</label>
              <input type="text" required inputMode="numeric" value={regPhone}
                onChange={(e) => setRegPhone(maskPhone(e.target.value))}
                placeholder="(11) 99999-9999" className={`${inputBase} px-4`} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
              <input type="password" required value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)} className={`${inputBase} px-4`} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar senha</label>
              <input type="password" required value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)} className={`${inputBase} px-4`} />
              {regConfirm && regPassword !== regConfirm && (
                <p className="text-xs text-red-500 mt-1">As senhas não coincidem.</p>
              )}
            </div>

            <button type="submit"
              className="w-full text-white font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
              style={{ backgroundColor: PRIMARY }}>
              Criar conta
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <button type="button" onClick={() => setStep('login')}
              className="text-[#2563EB] font-semibold hover:underline">
              Já tem conta?
            </button>
            <button type="button" onClick={onGuest}
              className="flex items-center gap-1 text-gray-500 font-medium hover:text-gray-700">
              Continuar como visitante
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ---------- FORGOT PASSWORD (Recuperar senha) ----------
  const renderForgot = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <button type="button" onClick={() => setStep('login')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <BrandLogo />

      <h1 className="font-display font-extrabold text-2xl text-[#1f2937] mt-6">Recuperar senha</h1>
      <p className="text-gray-400 text-sm mt-1 mb-6">
        Enviaremos um link de redefinição para o seu email de login cadastrado.
      </p>

      <form onSubmit={handleSendRecovery} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={recoverEmail}
              onChange={(e) => { setRecoverEmail(e.target.value); setRecoverError(''); }}
              placeholder="seu@email.com"
              className={`${inputBase} pl-10 pr-4`}
            />
          </div>
        </div>

        {recoverError && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{recoverError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={recoverLoading}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: PRIMARY }}
        >
          {recoverLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {recoverLoading ? 'Enviando...' : 'Recuperar senha'}
        </button>
      </form>
    </div>
  );

  // ---------- CHECK EMAIL (Confirmação de envio) ----------
  const renderCheckEmail = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <BrandLogo />

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <MailCheck className="w-8 h-8" style={{ color: PRIMARY }} />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-[#1f2937]">Verifique seu e-mail</h1>
        <p className="text-gray-500 text-sm mt-2">
          Enviamos um link para redefinição de senha para o endereço informado
          {recoverEmail ? <> (<span className="font-medium text-gray-700">{recoverEmail}</span>)</> : null}.
        </p>
        <p className="text-gray-400 text-xs mt-3">
          Caso não encontre o e-mail, verifique sua caixa de spam.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStep('login')}
        className="mt-7 w-full text-white font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
        style={{ backgroundColor: PRIMARY }}
      >
        Voltar para Login
      </button>
    </div>
  );

  // ---------- RESET PASSWORD (Nova senha) ----------
  const renderReset = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <BrandLogo />

      {resetSuccess ? (
        <div className="py-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <p className="font-semibold text-gray-800">Senha alterada com sucesso.</p>
          <p className="text-sm text-gray-400">Redirecionando para o login...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mt-6">
            <ShieldCheck className="w-5 h-5" style={{ color: PRIMARY }} />
            <h1 className="font-display font-extrabold text-2xl text-[#1f2937]">Nova senha</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Defina a sua nova senha de acesso.
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setResetError(''); }}
                  placeholder="Mínimo de 8 caracteres"
                  className={`${inputBase} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setResetError(''); }}
                  placeholder="Repita a nova senha"
                  className={`${inputBase} pl-10 pr-4`}
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">As senhas não coincidem.</p>
              )}
            </div>

            {resetError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}
            >
              {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {resetLoading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-[#F5F5F5] py-10 px-4 font-sans">
      {step === 'login' && renderLogin()}
      {step === 'register' && renderRegister()}
      {step === 'forgot-password' && renderForgot()}
      {step === 'check-email' && renderCheckEmail()}
      {step === 'reset-password' && renderReset()}
    </div>
  );
}
