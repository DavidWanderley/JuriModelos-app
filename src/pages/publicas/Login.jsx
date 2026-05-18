import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import { storage } from "../../services/storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      storage.setToken(response.data.token);
      storage.setPerfil(response.data.user.role?.name || "advogado");
      storage.setNome(response.data.user.nome);
      storage.setUser(response.data.user);

      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao conectar com o servidor.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <div className="hidden lg:flex w-1/2 bg-[#0e1e3f] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-amber-500">
            JuriModelos
          </h1>
          <p className="mt-4 text-slate-300 text-xl font-light max-w-md">
            Otimize sua prática jurídica com a inteligência do{" "}
            <span className="text-white font-semibold">JuriModelos</span>.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">
                Agilidade no Protocolo
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Petições completas em minutos com preenchimento dinâmico de
                variáveis.
              </p>
            </div>
          </div>

          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">
                Segurança Jurídica
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Modelos baseados nas jurisprudências mais recentes dos tribunais
                superiores.
              </p>
            </div>
          </div>

          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              📁
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">
                Gestão de Peças
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Acesse sua biblioteca pessoal de modelos em qualquer lugar,
                24/7.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500 relative z-10 border-t border-white/10 pt-6">
          © 2026{" "}
          <span className="text-slate-400 font-medium">JuriModelos</span> •
          Todos os direitos reservados.
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-24">
        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-[#0e1e3f]">JuriModelos</h1>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Login</h2>
          <p className="text-slate-500 mb-6">
            Insira suas credenciais para acessar o painel.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-slate-700">
            <p className="font-bold text-amber-700 mb-1">🧪 Modo demonstração</p>
            <p className="leading-relaxed">
              Quer explorar a plataforma? Você pode{" "}
              <button
                type="button"
                onClick={() => navigate("/criar-conta")}
                className="text-amber-600 font-bold hover:underline"
              >
                criar sua própria conta
              </button>{" "}
              e testar o fluxo completo, ou entrar direto com o usuário de teste:
            </p>
            <button
              type="button"
              onClick={() => { setEmail("teste@teste.com"); setPassword("123"); }}
              className="mt-3 w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-2 rounded-lg transition-all text-xs tracking-wide"
            >
              Entrar como teste@teste.com · senha: 123
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 text-sm flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="exemplo@seuescritorio.com.br"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <div className="mt-8 space-y-4 text-center">
              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/esqueci-a-senha")}
                  className="text-slate-500 hover:text-amber-600 font-medium transition-all"
                >
                  Esqueci minha senha
                </button>

                <span className="text-slate-300">|</span>

                <button
                  type="button"
                  onClick={() => navigate("/criar-conta")}
                  className="text-slate-500 hover:text-[#0e1e3f] font-bold transition-all"
                >
                  Criar nova conta
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Validando acesso..." : "Acessar Plataforma"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
