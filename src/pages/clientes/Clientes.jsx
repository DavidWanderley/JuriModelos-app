import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ROUTES } from "../../utils/routes";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import api from "../../services/api";
import { toast } from "../../components/Toast";

const POR_PAGINA = 10;

const Clientes = () => {
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const { data: response, loading, setData } = useFetch("/clientes", {
    errorMessage: "Erro ao carregar clientes"
  });

  const clientes = response?.data || [];
  const totalPaginas = Math.ceil(clientes.length / POR_PAGINA);
  const clientesPagina = clientes.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Excluir o cliente "${nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente excluído com sucesso!");
      setData(prev => ({ ...prev, data: (prev?.data || []).filter(c => c.id !== id) }));
    } catch {
      toast.error("Erro ao excluir cliente.");
    }
  };

  if (loading) return <Loading message="Carregando clientes..." />;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl ml-10">
        <header className="mb-8 flex justify-between items-end">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestão de Clientes</h1>
            <p className="text-slate-500 font-medium italic">Arquivo digital de clientes</p>
          </div>
          <button 
            onClick={() => navigate(ROUTES.CLIENTES_NOVO)}
            className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-amber-700 transition-all active:scale-95"
          >
            + CADASTRAR NOVO CLIENTE
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">Nome</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">CPF/CNPJ</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">Cidade/UF</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientesPagina.length > 0 ? (
                clientesPagina.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 text-sm font-bold text-slate-700">{c.nome_completo}</td>
                    <td className="p-6 text-sm text-slate-500">{c.cpf_cnpj}</td>
                    <td className="p-6 text-sm text-slate-500">{c.cidade} - {c.estado}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => navigate(`/clientes/editar/${c.id}`)}
                          className="text-amber-600 font-bold text-xs hover:underline"
                        >
                          EDITAR
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id, c.nome_completo)}
                          className="text-red-500 font-bold text-xs hover:underline"
                        >
                          EXCLUIR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-bold">Nenhum cliente cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination paginaAtual={pagina} totalPaginas={totalPaginas} onPaginar={setPagina} />
      </div>
    </div>
  );
};

export default Clientes;
