import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import api from "../../services/api";
import { toast } from "../../components/Toast";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const STATUS_CORES = {
  "Em andamento": "bg-blue-100 text-blue-700",
  "Aguardando":   "bg-amber-100 text-amber-700",
  "Encerrado":    "bg-slate-100 text-slate-600",
  "Ganho":        "bg-emerald-100 text-emerald-700",
  "Perdido":      "bg-red-100 text-red-700",
};

const PRAZO_CORES = {
  pendente:  "bg-amber-100 text-amber-700",
  concluido: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-slate-100 text-slate-500",
};

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const DetalhamentoProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [zoom, setZoom]         = useState(1.0);
  const [abaAtiva, setAbaAtiva] = useState("detalhes");

  useEffect(() => {
    api.get(`/processos/${id}`)
      .then(r => setProcesso(r.data?.data || r.data))
      .catch(() => { toast.error("Processo não encontrado."); navigate("/processos"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
    </div>
  );

  if (!processo) return null;

  const pdfUrl = `${API_BASE}${processo.pdf_url}`;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl ml-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate("/processos")} className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2">
            ← Voltar
          </button>
          <div className="flex gap-3">
            <a
              href={pdfUrl}
              download
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
            >
              ⬇️ Download PDF
            </a>
            <button
              onClick={() => navigate(`/processos/${id}/editar`)}
              className="bg-[#0e1e3f] text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Título e status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CORES[processo.status]}`}>
                  {processo.status}
                </span>
                {processo.numero_processo && (
                  <span className="text-xs text-slate-400 font-mono">Proc. {processo.numero_processo}</span>
                )}
              </div>
              <h1 className="text-2xl font-black text-slate-800">{processo.titulo}</h1>
              {processo.descricao && <p className="text-slate-500 mt-1">{processo.descricao}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Tipo de Ação",   valor: processo.tipo_acao },
              { label: "Vara",           valor: processo.vara },
              { label: "Comarca",        valor: processo.comarca },
              { label: "Distribuição",   valor: processo.data_distribuicao },
              { label: "Valor da Causa", valor: processo.valor_causa ? `R$ ${Number(processo.valor_causa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null },
              { label: "Cliente",        valor: processo.cliente?.nome_completo },
              { label: "Modelo Base",    valor: processo.modelo?.titulo },
              { label: "Responsável",    valor: processo.User?.nome },
            ].filter(i => i.valor).map(i => (
              <div key={i.label}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i.label}</p>
                <p className="font-bold text-slate-700 truncate">{i.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6">
          {["detalhes", "pdf", "prazos"].map(aba => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all capitalize ${
                abaAtiva === aba ? "bg-[#0e1e3f] text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {aba === "pdf" ? "📄 Documento PDF" : aba === "prazos" ? `⚖️ Prazos (${processo.prazos?.length || 0})` : "📋 Detalhes"}
            </button>
          ))}
        </div>

        {/* Aba Detalhes */}
        {abaAtiva === "detalhes" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Informações Completas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Número do Processo", valor: processo.numero_processo },
                { label: "Tipo de Ação",        valor: processo.tipo_acao },
                { label: "Vara",                valor: processo.vara },
                { label: "Comarca",             valor: processo.comarca },
                { label: "Data de Distribuição",valor: processo.data_distribuicao },
                { label: "Valor da Causa",      valor: processo.valor_causa ? `R$ ${Number(processo.valor_causa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null },
                { label: "Status",              valor: processo.status },
                { label: "Responsável",         valor: processo.User?.nome },
              ].map(i => (
                <div key={i.label} className="border-b border-slate-50 pb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{i.label}</p>
                  <p className="font-bold text-slate-700 mt-0.5">{i.valor || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba PDF */}
        {abaAtiva === "pdf" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Controles */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all">
                  ‹
                </button>
                <span className="text-sm font-bold text-slate-600">
                  {paginaAtual} / {numPages || "—"}
                </span>
                <button onClick={() => setPaginaAtual(p => Math.min(numPages || 1, p + 1))} disabled={paginaAtual >= (numPages || 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all">
                  ›
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-all">
                  −
                </button>
                <span className="text-sm font-bold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-all">
                  +
                </button>
              </div>
            </div>

            {/* Documento */}
            <div className="flex justify-center p-6 bg-slate-100 overflow-auto min-h-[600px]">
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={() => toast.error("Erro ao carregar o PDF.")}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
                  </div>
                }
              >
                <Page
                  pageNumber={paginaAtual}
                  scale={zoom}
                  className="shadow-2xl"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          </div>
        )}

        {/* Aba Prazos */}
        {abaAtiva === "prazos" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-slate-500">{processo.prazos?.length || 0} prazo(s) vinculado(s)</p>
              <button
                onClick={() => navigate(`/prazos?processoId=${id}`)}
                className="text-sm bg-[#0e1e3f] text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                + Adicionar Prazo
              </button>
            </div>
            {(!processo.prazos || processo.prazos.length === 0) ? (
              <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center">
                <p className="text-3xl mb-2">⚖️</p>
                <p className="text-slate-400 font-medium">Nenhum prazo vinculado a este processo.</p>
              </div>
            ) : (
              processo.prazos.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRAZO_CORES[p.status]}`}>{p.status}</span>
                      <span className="text-[10px] text-slate-400">{p.tipo}</span>
                    </div>
                    <p className="font-bold text-slate-800">{p.titulo}</p>
                    <p className="text-xs text-slate-400 mt-0.5">📅 {p.data_prazo}{p.hora ? ` às ${p.hora}` : ""}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalhamentoProcesso;
