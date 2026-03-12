'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { STORES } from '@/lib/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  full_name: string;
  cedula: string;
  phone: string;
  store: string;
  invoice_url: string;
  invoice_signed_url?: string | null;
  prize_type: string;
  created_at: string;
}

interface PaginatedResponse {
  data: Participant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const PRIZE_LABELS: Record<string, string> = {
  cine_en_casa: 'Cine en Casa',
  camiseta_ecuador: 'Camiseta Ecuador',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPrizeBadgeColor(prize: string): string {
  if (prize === 'cine_en_casa') return 'bg-[#1B6B8A]/30 text-[#5BB8D4] border-[#1B6B8A]/50';
  if (prize === 'camiseta_ecuador') return 'bg-[#2D8C3C]/30 text-[#5DC970] border-[#2D8C3C]/50';
  return 'bg-white/10 text-white/60 border-white/20';
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20" role="status" aria-label={label}>
      <IconSpinner />
      <span className="text-white/50 text-sm">{label}</span>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  participant: Participant | null;
  onClose: () => void;
}

function DetailModal({ participant, onClose }: DetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!participant) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [participant, onClose]);

  if (!participant) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fields: Array<{ label: string; value: string }> = [
    { label: 'Nombre completo', value: participant.full_name },
    { label: 'Cédula', value: participant.cedula },
    { label: 'Celular', value: participant.phone },
    { label: 'Local', value: participant.store },
    { label: 'Premio', value: PRIZE_LABELS[participant.prize_type] ?? participant.prize_type },
    { label: 'Fecha de registro', value: formatDate(participant.created_at) },
    { label: 'ID de registro', value: participant.id },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${participant.full_name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-2xl bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div>
            <h2 className="text-lg font-semibold text-white">{participant.full_name}</h2>
            <p className="text-xs text-white/40 mt-0.5">CI: {participant.cedula}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex items-center justify-center h-8 w-8 rounded-full text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]/60"
          >
            <IconX />
          </button>
        </div>

        {/* Modal body — scrollable */}
        <div className="overflow-y-auto max-h-[75vh] p-6 space-y-6">
          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, value }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">{label}</p>
                <p className="text-white text-sm font-medium break-all">{value}</p>
              </div>
            ))}
          </div>

          {/* Prize badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPrizeBadgeColor(participant.prize_type)}`}>
              {PRIZE_LABELS[participant.prize_type] ?? participant.prize_type}
            </span>
          </div>

          {/* Invoice image */}
          {participant.invoice_signed_url && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/40">Vista previa de factura</p>
              <div className="relative w-full bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={participant.invoice_signed_url}
                  alt={`Factura de ${participant.full_name}`}
                  className="w-full max-h-80 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden items-center justify-center h-32 text-white/30 text-sm"
                  aria-hidden="true"
                >
                  No se pudo cargar la imagen
                </div>
              </div>

              <a
                href={participant.invoice_signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#BE7753]/10 border border-[#BE7753]/30 text-[#BE7753] text-sm font-medium hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black hover:border-transparent transition-all duration-300"
              >
                <IconDownload />
                Ver Factura
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSuccess: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError('Credenciales inválidas');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #BE7753 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Brand top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#BE7753] to-[#F2B38C]" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        {/* Logo / branding area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#BE7753]/10 border border-[#BE7753]/20 mb-4">
            <svg className="w-8 h-8 text-[#BE7753]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">
            Panel de Administración
          </h1>
          <p className="text-[#BE7753] text-sm font-medium mt-1 tracking-wide">
            Hinchas Recargados
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-950 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs uppercase tracking-wider text-white/50 font-medium">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#BE7753]/60 focus:ring-1 focus:ring-[#BE7753]/30 transition-colors duration-150"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-white/50 font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#BE7753]/60 focus:ring-1 focus:ring-[#BE7753]/30 transition-colors duration-150"
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(190,119,83,0.3)] hover:shadow-[0_0_28px_rgba(242,179,140,0.5)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <IconSpinner />
                  <span>Verificando...</span>
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Duracell Ecuador &mdash; Hinchas Recargados &copy; 2026
        </p>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [storeFilter, setStoreFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // ── Debounce search ──
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Fetch participants ──
  const fetchParticipants = useCallback(
    async (currentPage: number, store: string, searchQuery: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('pageSize', String(PAGE_SIZE));
        if (store) params.set('store', store);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await fetch(`/api/admin/participants?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const json: PaginatedResponse = await res.json();
        setParticipants(json.data ?? []);
        setTotal(json.total ?? 0);
        setTotalPages(json.totalPages ?? 1);
      } catch {
        setParticipants([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Re-fetch when dependencies change
  useEffect(() => {
    fetchParticipants(page, storeFilter, debouncedSearch);
  }, [page, storeFilter, debouncedSearch, fetchParticipants]);

  // Reset to page 1 when store filter changes
  const handleStoreFilterChange = (value: string) => {
    setStoreFilter(value);
    setPage(1);
  };

  // ── CSV Export ──
  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const params = new URLSearchParams();
      if (storeFilter) params.set('store', storeFilter);

      const res = await fetch(`/api/admin/export?${params.toString()}`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      a.download = `hinchas-recargados-${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Silent fail — could show a toast here
    } finally {
      setExportLoading(false);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    // Invalidate the cookie server-side so captured tokens cannot be reused
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Continue with local logout even if the request fails
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Brand top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#BE7753] to-[#F2B38C]" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-black/90 border-b border-white/8 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#BE7753]/10 border border-[#BE7753]/20 shrink-0" aria-hidden="true">
              <svg className="w-4 h-4 text-[#BE7753]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">Panel de Administración</h1>
              <p className="text-[10px] text-[#BE7753]/70 font-medium tracking-wide truncate hidden sm:block">
                Hinchas Recargados &mdash; Duracell Ecuador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all duration-150 text-sm shrink-0"
            aria-label="Cerrar sesión"
          >
            <IconLogout />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<IconUsers />}
            label="Total participantes"
            value={total.toLocaleString('es-EC')}
            color="gold"
          />
          <StatCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
            label="Pagina actual"
            value={`${page} / ${totalPages}`}
            color="blue"
          />
          <StatCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            label="Registros en vista"
            value={participants.length.toLocaleString('es-EC')}
            color="green"
          />
        </div>

        {/* ── Filters row ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Store filter */}
          <div className="relative">
            <select
              value={storeFilter}
              onChange={(e) => handleStoreFilterChange(e.target.value)}
              aria-label="Filtrar por local"
              className="appearance-none w-full sm:w-56 pl-4 pr-8 py-2.5 bg-gray-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#BE7753]/50 focus:ring-1 focus:ring-[#BE7753]/20 transition-colors duration-150 cursor-pointer"
            >
              <option value="">Todos los locales</option>
              {STORES.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-3.5 w-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Search input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/30">
              <IconSearch />
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar por nombre o cédula..."
              aria-label="Buscar participante por nombre o cédula"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-950 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#BE7753]/50 focus:ring-1 focus:ring-[#BE7753]/20 transition-colors duration-150"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                aria-label="Limpiar búsqueda"
                className="absolute inset-y-0 right-3 flex items-center text-white/30 hover:text-white/70 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exportLoading}
            aria-busy={exportLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#BE7753]/10 border border-[#BE7753]/30 text-[#BE7753] text-sm font-semibold rounded-xl hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black hover:border-transparent active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {exportLoading ? <IconSpinner /> : <IconDownload />}
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-gray-950 border border-white/8 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid" aria-label="Tabla de participantes">
              <thead>
                <tr className="bg-gray-900/50 border-b border-white/8">
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold w-12">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold hidden md:table-cell">
                    Cedula
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold hidden lg:table-cell">
                    Celular
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold hidden sm:table-cell">
                    Local
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold hidden xl:table-cell">
                    Premio
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-white/40 font-semibold hidden lg:table-cell">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-white/40 font-semibold w-16">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-0">
                      <Spinner label="Cargando participantes..." />
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/30">
                        <IconUsers />
                        <p className="text-sm">
                          {search || storeFilter
                            ? 'No se encontraron participantes con ese criterio.'
                            : 'No hay participantes registrados.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  participants.map((p, idx) => {
                    const rowNumber = (page - 1) * PAGE_SIZE + idx + 1;
                    const isEven = idx % 2 === 0;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedParticipant(p)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Ver detalle de ${p.full_name}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedParticipant(p);
                          }
                        }}
                        className={[
                          'border-b border-white/5 cursor-pointer group',
                          'hover:bg-white/5 active:bg-white/8',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#BE7753]/40',
                          'transition-colors duration-100',
                          isEven ? 'bg-transparent' : 'bg-white/[0.02]',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3 text-white/30 text-xs tabular-nums">
                          {rowNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white font-medium group-hover:text-[#BE7753] transition-colors duration-300">
                            {p.full_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/60 tabular-nums hidden md:table-cell">
                          {p.cedula}
                        </td>
                        <td className="px-4 py-3 text-white/60 tabular-nums hidden lg:table-cell">
                          {p.phone}
                        </td>
                        <td className="px-4 py-3 text-white/70 hidden sm:table-cell">
                          <span className="truncate max-w-[160px] block" title={p.store}>
                            {p.store}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPrizeBadgeColor(p.prize_type)}`}>
                            {PRIZE_LABELS[p.prize_type] ?? p.prize_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/40 text-xs tabular-nums hidden lg:table-cell whitespace-nowrap">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white/30 group-hover:text-[#BE7753] group-hover:bg-[#BE7753]/10 transition-all duration-300">
                            <IconEye />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/8 bg-black/20">
              <p className="text-xs text-white/40">
                Mostrando{' '}
                <span className="text-white/70 font-medium">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>
                {' '}–{' '}
                <span className="text-white/70 font-medium">
                  {Math.min(page * PAGE_SIZE, total)}
                </span>
                {' '}de{' '}
                <span className="text-white/70 font-medium">
                  {total.toLocaleString('es-EC')}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Pagina anterior"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                >
                  <IconChevronLeft />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <span className="px-3 py-1.5 text-xs text-white/60 tabular-nums">
                  Pagina{' '}
                  <span className="text-white font-semibold">{page}</span>
                  {' '}de{' '}
                  <span className="text-white font-semibold">{totalPages}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Pagina siguiente"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <IconChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {selectedParticipant && (
        <DetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'gold' | 'blue' | 'green';
}

const STAT_COLORS: Record<StatCardProps['color'], { border: string; icon: string; text: string }> = {
  gold:  { border: 'border-[#BE7753]/20', icon: 'text-[#BE7753] bg-[#BE7753]/10', text: 'text-[#BE7753]' },
  blue:  { border: 'border-[#1B6B8A]/30', icon: 'text-[#5BB8D4] bg-[#1B6B8A]/10', text: 'text-[#5BB8D4]' },
  green: { border: 'border-[#2D8C3C]/30', icon: 'text-[#5DC970] bg-[#2D8C3C]/10', text: 'text-[#5DC970]' },
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  const c = STAT_COLORS[color];
  return (
    <div className={`bg-gray-950 border ${c.border} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.icon} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium truncate">{label}</p>
        <p className={`text-2xl font-bold tabular-nums ${c.text}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // On mount, probe the participants endpoint to determine auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/participants?page=1&pageSize=1');
        if (res.ok) {
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          // Any other error: default to showing login
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Loading screen while probing
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3" role="status" aria-label="Verificando sesión">
          <IconSpinner />
          <p className="text-white/30 text-sm">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}
