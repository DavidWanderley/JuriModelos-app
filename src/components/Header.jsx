import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { storage } from "../services/storage";

const Header = () => {
  const navigate = useNavigate();
  const nome = storage.getNome() || "Usuário";
  const perfil = storage.getPerfil() || "user";
  const [sinoAberto, setSinoAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const sinoRef = useRef(null);

  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "AD";
    const names = fullName.trim().split(/\s+/);
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return names[0][0] ? names[0][0].toUpperCase() : "AD";
  };

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  const marcarTodasLidas = async () => {
    try {
      await api.patch("/notificacoes/ler-todas");
      setNaoLidas(0);
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const marcarLida = async (id) => {
    try {
      await api.patch(`/notificacoes/${id}/ler`);
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
      setNaoLidas(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const labelData = (data) => {
    const hoje  = new Date().toISOString().split('T')[0];
    const d1    = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    if (data === hoje) return 'Hoje';
    if (data === d1)   return 'Amanhã';
    const [, mes, dia] = data.split('-');
    return `${dia}/${mes}`;
  };

  useEffect(() => {
    const fetchNotificacoes = async () => {
      setLoadingNotif(true);
      try {
        const res = await api.get("/notificacoes");
        const data = res.data?.data || res.data || {};
        setNotificacoes(data.notificacoes || []);
        setNaoLidas(data.naoLidas || 0);
      } catch (e) {
        console.error("Erro ao buscar notificações:", e);
      } finally {
        setLoadingNotif(false);
      }
    };
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    const handleClickFora = (e) => {
      if (sinoRef.current && !sinoRef.current.contains(e.target)) {
        setSinoAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between shadow-sm">
      <div />

      <div className="flex items-center gap-6">
        <div className="relative" ref={sinoRef}>
          <button
            onClick={() => { setSinoAberto((v) => !v); }}
            className="text-slate-400 hover:text-amber-600 transition-colors text-xl relative"
          >
            🔔
            {naoLidas > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] font-black flex items-center justify-center px-0.5">
                {naoLidas > 9 ? "9+" : naoLidas}
              </span>
            )}
          </button>

          {sinoAberto && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-sm">Notificações {naoLidas > 0 && <span className="text-red-500">({naoLidas})</span>}</h3>
                <div className="flex gap-3">
                  {naoLidas > 0 && (
                    <button onClick={marcarTodasLidas} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">Marcar todas</button>
                  )}
                  <button
                    onClick={() => { setSinoAberto(false); navigate("/prazos"); }}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Ver prazos →
                  </button>
                </div>
              </div>

              {loadingNotif ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
                </div>
              ) : notificacoes.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <p className="text-2xl mb-1">✅</p>
                  <p className="text-sm font-medium">Nada para hoje ou amanhã</p>
                </div>
              ) : (
                <ul className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notificacoes.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => marcarLida(n.id)}
                      className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.lida ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 leading-tight flex-1">{n.mensagem}</p>
                        {!n.lida && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />}
                      </div>
                      {n.prazo && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {labelData(n.prazo.data_prazo)}{n.prazo.numero_processo ? ` · Proc. ${n.prazo.numero_processo}` : ''}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{nome}</p>
            <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mt-1">
              {perfil === "admin" ? "🛡️ Administrador" : "⚖️ OAB/CE Ativa"}
            </p>
          </div>

          <div className="w-10 h-10 bg-[#0e1e3f] border-2 border-amber-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform text-xs">
            {getInitials(nome)}
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 group"
            title="Sair do sistema"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
            <span className="text-xs font-bold hidden md:block">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;