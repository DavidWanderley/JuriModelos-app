import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  
  const [dados, setDados] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dados.password !== dados.confirmPassword) {
      return alert("As senhas não coincidem!");
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: dados.password,
      });

      setSucesso(true);
      setTimeout(() => navigate("/login"), 3000); 
    } catch (error) {
      console.error('Erro reset-password:', error.response?.data);
      alert(error.response?.data?.message || error.response?.data?.error || "Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200">
        
        {!sucesso ? (
          <>
            <header className="text-center mb-10">
              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-3xl font-black text-[#0e1e3f] mb-2 tracking-tight">
                Nova Senha
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Crie uma credencial forte para proteger seu acesso ao **JuriModelos**.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">Nova Senha</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700"
                  value={dados.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">Confirmar Nova Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700"
                  value={dados.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0e1e3f] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "ATUALIZANDO..." : "REDEFINIR MINHA SENHA"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-6">✅</div>
            <h2 className="text-2xl font-black text-[#0e1e3f] mb-4">Senha Atualizada!</h2>
            <p className="text-slate-500 font-medium mb-8">
              Sua nova senha foi salva com sucesso. Você será redirecionado para o login em instantes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;