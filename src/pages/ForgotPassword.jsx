import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setEnviado(true);
    } catch (error) {
      console.error('Erro forgot-password:', error.response?.data);
      alert(
        error.response?.data?.message || 
        error.response?.data?.error ||
        "Erro ao processar solicitação. Verifique se o e-mail está correto."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200">
        
        {!enviado ? (
          <>
            <header className="text-center mb-10">
              <div className="text-4xl mb-4 text-[#0e1e3f]">🔑</div>
              <h1 className="text-3xl font-black text-[#0e1e3f] mb-2 tracking-tight">
                Recuperar Senha
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Insira seu e-mail para receber as instruções de redefinição.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2">
                  E-mail Cadastrado
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0e1e3f] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "ENVIANDO..." : "ENVIAR LINK DE RECUPERAÇÃO"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-6">📩</div>
            <h2 className="text-2xl font-black text-[#0e1e3f] mb-4">
              Verifique seu E-mail
            </h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Se o e-mail **{email}** estiver em nossa base de dados, você receberá um link para criar uma nova senha em instantes.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-slate-100 text-[#0e1e3f] px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              VOLTAR PARA O LOGIN
            </button>
          </div>
        )}

        <footer className="mt-10 text-center border-t border-slate-100 pt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-400 hover:text-amber-600 font-bold transition-all"
          >
            Lembrou a senha? Fazer login
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;