import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import { MESSAGES, STYLES } from "../../utils/constants";
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton";

const DetalhamentoTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const perfil = localStorage.getItem("perfil");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/templates/${id}`);
        setTemplate(response.data.data || response.data);
      } catch (error) {
        toast.error(MESSAGES.ERROR.TEMPLATE_CARREGAR);
        navigate("/templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmou = window.confirm(MESSAGES.CONFIRM.DELETAR_TEMPLATE);

    if (confirmou) {
      setDeleting(true);
      try {
        await api.delete(`/templates/${id}`);
        toast.success(MESSAGES.SUCCESS.TEMPLATE_DELETADO);
        setTimeout(() => navigate("/templates"), 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || MESSAGES.ERROR.TEMPLATE_DELETAR);
        setDeleting(false);
      }
    }
  };

  if (loading) return <Loading message="Carregando template..." />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl ml-10">
        <div className="flex justify-between items-center mb-8">
          <BackButton to="/templates" label="Voltar para Templates" />

          <div className="flex gap-4">
            {perfil === "admin" && (
              <>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`${STYLES.BUTTON_DANGER} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {deleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600"></div>
                  )}
                  {deleting ? "Excluindo..." : "🗑️ Excluir"}
                </button>
                <button
                  onClick={() => navigate(`/editar-template/${id}`)}
                  className={STYLES.BUTTON_SECONDARY}
                >
                  Editar Template
                </button>
              </>
            )}
            <button
              onClick={() => navigate(`/gerar-documento/${id}`)}
              className="bg-[#0e1e3f] text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
            >
              📝 Gerar Documento
            </button>
          </div>
        </div>

        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-black text-slate-800 mb-6 border-b pb-6">
            {template.titulo}
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-amber-700 mb-2">💡 Chaves Dinâmicas</p>
            <p className="text-xs text-amber-600">
              Este template contém campos que serão preenchidos automaticamente com dados do cliente
            </p>
          </div>

          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-200">
            {template.conteudo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhamentoTemplate;
