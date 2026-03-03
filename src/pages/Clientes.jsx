import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestão de Clientes</h1>
            <p className="text-slate-500 font-medium italic">Arquivo digital da CW Advocacia</p>
          </div>
          <button 
            onClick={() => navigate("/clientes/novo")}
            className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-amber-700 transition-all active:scale-95"
          >
            + CADASTRAR NOVO CLIENTE
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-10 font-bold text-slate-400">Consultando banco Neon...</p>
          ) : (
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
                {clientes.length > 0 ? (
                  clientes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 text-sm font-bold text-slate-700">{c.nome_completo}</td>
                      <td className="p-6 text-sm text-slate-500">{c.cpf_cnpj}</td>
                      <td className="p-6 text-sm text-slate-500">{c.cidade} - {c.estado}</td>
                      <td className="p-6 text-right">
                        <button className="text-amber-600 font-bold text-xs hover:underline">EDITAR</button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Clientes;