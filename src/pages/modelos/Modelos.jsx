import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Modelos = () => {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModelos();
  }, []);

  if (loading) {
    return (
      <div className="ml-64 pt-24 p-10 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Biblioteca de Modelos</h1>
            <p className="text-slate-500 font-medium">Acervo jurídico da CW Advocacia</p>
          </div>
          {perfil === "admin" && (
            <button
              onClick={() => navigate("/novo-modelo")}
              className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              + Novo Modelo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelos.map((modelo) => (
            <div
              key={modelo.id}
              onClick={() => navigate(`/modelo/${modelo.id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                  {modelo.categoria}
                </span>
                {modelo.pdf_url && <span className="text-red-600">📄</span>}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{modelo.titulo}</h3>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-700">
                  {modelo.tipo_cliente === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                  {modelo.complexidade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modelos;
