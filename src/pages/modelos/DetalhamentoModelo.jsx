import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const DetalhamentoModelo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelo, setModelo] = useState(null);
  const [loading, setLoading] = useState(true);

  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    const fetchModelo = async () => {
      try {
        const response = await api.get(`/modelos/${id}`);
        setModelo(response.data);
      } catch (error) {
        alert(
          "Não foi possível carregar o modelo. Ele pode ter sido removido.",
        );
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchModelo();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmou = window.confirm(
      "⚠️ ATENÇÃO: Deseja excluir este modelo do acervo da CW Advocacia? Esta ação é irreversível.",
    );

    if (confirmou) {
      try {
        await api.delete(`/modelos/${id}`);
        alert("Modelo removido com sucesso!");
        navigate("/");
      } catch (error) {
        alert(error.response?.data?.message || "Erro ao excluir o modelo.");
      }
    }
  };

  if (loading)
    return (
      <div className="ml-44 pt-24 p-10 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-slate-500 font-bold">
          Abrindo pasta jurídica...
        </p>
      </div>
    );

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-all"
        >
          <span>←</span> Voltar ao Acervo
        </button>

        <div className="flex gap-4">
          {perfil === "admin" ? (
            <button
              onClick={handleDelete}
              className="bg-white border border-rose-200 text-rose-600 px-6 py-2 rounded-xl font-bold hover:bg-rose-50 transition-all"
            >
              🗑️ Excluir
            </button>
          ) : (
            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase px-4 border border-slate-200 rounded-xl bg-slate-100/50 cursor-not-allowed tracking-widest">
              🔒 Exclusão restrita
            </div>
          )}

          {perfil === "admin" ? (
            <button
              onClick={() => navigate(`/editar-modelo/${id}`)}
              className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Editar Peça
            </button>
          ) : (
            <div className="flex items-center text-slate-400 text-[10px] font-black uppercase px-4 border border-slate-200 rounded-xl bg-slate-100/50 cursor-not-allowed tracking-widest">
              🔒 Edição restrita
            </div>
          )}

          <button
            onClick={() => navigate(`/generate/${id}`)}
            className="bg-[#0e1e3f] text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
          >
            Gerar Documento
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[800px]">
            <h1 className="text-3xl font-black text-slate-800 mb-6 border-b pb-6 uppercase tracking-tight">
              {modelo.titulo}
            </h1>

            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700">
              {modelo.conteudo}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-6 border-b pb-2">
              Informações Técnicas
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Jurisdição
                </p>
                <p className="text-slate-700 font-bold">
                  {modelo.jurisdicao || "Não definida"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Base Legal
                </p>
                <p className="text-slate-700 font-bold">
                  {modelo.base_legal || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Complexidade
                </p>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black ${
                    modelo.complexidade === "Alta"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {modelo.complexidade}
                </span>
              </div>
            </div>
          </div>
          {modelo?.pdf_url && modelo.pdf_url !== "null" && (
            <div className="bg-[#0e1e3f] p-8 rounded-3xl shadow-xl text-white">
              <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4">
                Referência PDF
              </h2>
              <a
                href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${modelo.pdf_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-[#0e1e3f] py-3 rounded-xl font-bold hover:bg-amber-400 transition-all"
              >
                Visualizar PDF 📄
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhamentoModelo;
