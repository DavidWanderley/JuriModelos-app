import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const nome = localStorage.getItem("nome") || "Usuário";
  const perfil = localStorage.getItem("perfil") || "user";
  const [sinoAberto, setSinoAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [visto, setVisto] = useState(false);
  const sinoRef = useRef(null);

  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== "string") return "AD";
    const names = fullName.trim().split(/\s+/);
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return names[0][0] ? names[0][0].toUpperCase() : "AD";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const labelData = (data) => {
    if (data === hoje) return "Hoje";
    if (data === amanha) return "Amanhã";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  };

  const TIPO_CORES = {
    "Audiência": "bg-purple-100 text-purple-700",
    "Prazo":     "bg-red-100 text-red-700",
    "Protocolo": "bg-orange-100 text-orange-700",
    "Reunião":   "bg-cyan-100 text-cyan-700",
    "Atendimento": "bg-blue-100 text-blue-700",
    "modelo":    "bg-amber-100 text-amber-700",
  };

  useEffect(() => {
    const fetchNotificacoes = async () => {
      setLoadingNotif(true);
      try {
        const [resEventos, resModelos] = await Promise.all([
          api.get("/eventos/proximos"),
          api.get("/modelos"),
        ]);

        const eventos = resEventos.data?.data || resEventos.data || [];
        const modelos = resModelos.data?.data || resModelos.data || [];

        const eventosHojeAmanha = eventos.filter(
          (e) => e.data === hoje || e.data === amanha
        );

        const audienciasModelo = modelos
          .filter((m) => m.data_audiencia === hoje || m.data_audiencia === amanha)
          .map((m) => ({
            id: `modelo-${m.id}`,
            titulo: m.titulo,
            tipo: "modelo",
            data: m.data_audiencia,
            hora: m.hora_audiencia || "",
          }));

        const todas = [...eventosHojeAmanha, ...audienciasModelo].sort((a, b) =>
          a.data.localeCompare(b.data)
        );

        setNotificacoes(todas);
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
            onClick={() => { setSinoAberto((v) => !v); setVisto(true); }}
            className="text-slate-400 hover:text-amber-600 transition-colors text-xl relative"
          >
            🔔
            {notificacoes.length > 0 && !visto && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] font-black flex items-center justify-center px-0.5">
                {notificacoes.length > 9 ? "9+" : notificacoes.length}
              </span>
            )}
          </button>

          {sinoAberto && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-sm">Notificações</h3>
                <button
                  onClick={() => { setSinoAberto(false); navigate("/agenda"); }}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Ver agenda →
                </button>
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
                    <li key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 leading-tight flex-1">{n.titulo}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          TIPO_CORES[n.tipo] || "bg-slate-100 text-slate-600"
                        }`}>
                          {n.tipo === "modelo" ? "Modelo" : n.tipo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {labelData(n.data)}{n.hora ? ` · ${n.hora}` : ""}
                      </p>
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