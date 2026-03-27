import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import { MESSAGES, CATEGORIAS } from "../../utils/constants";
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    conteudo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/templates/${id}`);
        const template = response.data.data || response.data;
        setForm({
          titulo: template.titulo,
    categoria: template.categoria || CATEGORIAS[0],
          conteudo: template.conteudo,
        });
      } catch (error) {
        toast.error(MESSAGES.ERROR.TEMPLATE_CARREGAR);
        navigate("/templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/templates/${id}`, form);
      toast.success(MESSAGES.SUCCESS.TEMPLATE_ATUALIZADO);
      setTimeout(() => navigate(`/template/${id}`), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TEMPLATE_ATUALIZAR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Carregando template..." />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl ml-10">
        <div className="flex justify-between items-center mb-8">
          <BackButton to={`/template/${id}`} label="Voltar para Detalhes" />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800">✏️ Editar Template</h1>
          <p className="text-slate-500 font-medium">Atualize o modelo de automação</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2">💡 DICA: Use chaves para campos dinâmicos</p>
            <p className="text-xs text-amber-600">
              Exemplo: {`{{nome}}, {{cpf}}, {{endereco}}`} - Serão substituídos pelos dados do cliente
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Título do Template *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Petição Inicial - Ação de Cobrança"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Categoria *
            </label>
            <select
              required
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Conteúdo do Template *
            </label>
            <textarea
              required
              rows={20}
              placeholder={`Digite o conteúdo com chaves dinâmicas...\n\nExemplo:\nEXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO\n\n{{nome}}, {{nacionalidade}}, {{estado_civil}}, portador do CPF {{cpf}}, residente em {{endereco}}, vem respeitosamente...`}
              value={form.conteudo}
              onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm text-slate-700"
            />
            <p className="text-xs text-slate-400 mt-2">
              Use {`{{chave}}`} para campos que serão preenchidos automaticamente
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/template/${id}`)}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTemplate;
