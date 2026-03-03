import React, { useState, useEffect } from "react";
import api from "../services/api";

const Historico = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await api.get("/documentos/meus-documentos");
        setDocumentos(response.data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorico();
  }, []);

  if (loading) return <div className="ml-44 pt-24 p-10 font-bold text-slate-500">Acessando arquivos da CW Advocacia...</div>;

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Histórico de Documentos</h1>
          <p className="text-slate-500 font-medium">Arquivo digital de petições e documentos gerados</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cliente</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Modelo Base</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documentos.length > 0 ? (
                documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 text-sm font-medium text-slate-500">
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-700">
                      {doc.nome_cliente || "Não informado"}
                    </td>
                    <td className="p-6 text-sm font-medium text-amber-600 italic">
                      {doc.modelo_titulo}
                    </td>
                    <td className="p-6 text-right">
                      <a
                        href={`http://localhost:5000${doc.caminho_arquivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#0e1e3f] hover:text-white transition-all"
                      >
                        📥 BAIXAR DOCX
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-medium">
                    Nenhum documento gerado até o momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Historico;