import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";

const STATUS_LIST = ["Em andamento", "Aguardando", "Encerrado", "Ganho", "Perdido"];

const formInicial = {
  titulo: "", numero_processo: "", descricao: "", tipo_acao: "",
  vara: "", comarca: "", valor_causa: "", data_distribuicao: "",
  status: "Em andamento", ClienteId: "", ModeloId: "",
};

const FormProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const [form, setForm]         = useState(formInicial);
  const [arquivo, setArquivo]   = useState(null);
  const [clientes, setClientes] = useState([]);
  const [modelos, setModelos]   = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [loading, setLoading]   = useState(editando);

  useEffect(() => {
    api.get("/clientes").then(r => setClientes(r.data?.data || r.data || [])).catch(() => {});
    api.get("/modelos").then(r => setModelos(r.data?.data || r.data || [])).catch(() => {});

    if (editando) {
      api.get(`/processos/${id}`)
        .then(r => {
          const p = r.data?.data || r.data;
          setForm({
            titulo: p.titulo, numero_processo: p.numero_processo || "",
            descricao: p.descricao || "", tipo_acao: p.tipo_acao || "",
            vara: p.vara || "", comarca: p.comarca || "",
            valor_causa: p.valor_causa || "", data_distribuicao: p.data_distribuicao || "",
            status: p.status, ClienteId: p.ClienteId || "", ModeloId: p.ModeloId || "",
          });
        })
        .catch(() => { toast.error("Erro ao carregar processo."); navigate("/processos"); })
        .finally(() => setLoading(false));
    }
  }, [id, editando, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editando && !arquivo) return toast.error("O PDF do processo é obrigatório.");
    setSalvando(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") data.append(k, v); });
      if (arquivo) data.append("pdf", arquivo);

      if (editando) {
        await api.put(`/processos/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Processo atualizado!");
      } else {
        await api.post("/processos", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Processo criado!");
      }
      navigate("/processos");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar processo.");
    } finally { setSalvando(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-3xl ml-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/processos")} className="text-slate-500 hover:text-slate-800 font-bold">← Voltar</button>
          <h1 className="text-2xl font-black text-slate-800">{editando ? "Editar Processo" : "Novo Processo"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificação */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b pb-2">Identificação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Título *</label>
                <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nº Processo</label>
                <input value={form.numero_processo} onChange={e => setForm({...form, numero_processo: e.target.value})}
                  placeholder="0000000-00.0000.0.00.0000"
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Tipo de Ação</label>
                <input value={form.tipo_acao} onChange={e => setForm({...form, tipo_acao: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Status *</label>
                <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Data de Distribuição</label>
                <input type="date" value={form.data_distribuicao} onChange={e => setForm({...form, data_distribuicao: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Descrição</label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700 resize-none" />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b pb-2">Localização e Valor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vara</label>
                <input value={form.vara} onChange={e => setForm({...form, vara: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Comarca</label>
                <input value={form.comarca} onChange={e => setForm({...form, comarca: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Valor da Causa (R$)</label>
                <input type="number" step="0.01" value={form.valor_causa} onChange={e => setForm({...form, valor_causa: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
              </div>
            </div>
          </div>

          {/* Vínculos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b pb-2">Vínculos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cliente</label>
                <select value={form.ClienteId} onChange={e => setForm({...form, ClienteId: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                  <option value="">Sem cliente vinculado</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome_completo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Modelo Base</label>
                <select value={form.ModeloId} onChange={e => setForm({...form, ModeloId: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                  <option value="">Sem modelo vinculado</option>
                  {modelos.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* PDF */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b pb-2 mb-4">
              Documento PDF {!editando && <span className="text-red-500">*</span>}
            </h2>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
              arquivo ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-amber-400 hover:bg-amber-50/30"
            }`}>
              <input type="file" accept=".pdf" className="hidden" onChange={e => setArquivo(e.target.files[0])} />
              <p className="text-3xl mb-2">{arquivo ? "✅" : "📄"}</p>
              <p className="font-bold text-slate-700">
                {arquivo ? arquivo.name : editando ? "Clique para substituir o PDF" : "Clique para selecionar o PDF"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Apenas arquivos PDF · Máx. 20MB</p>
            </label>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/processos")}
              className="flex-1 border border-slate-200 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={salvando}
              className="flex-1 bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
              {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Processo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormProcesso;
