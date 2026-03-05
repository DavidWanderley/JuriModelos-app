import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const GerarDocumento = () => {
  const [modelos, setModelos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelosRes, clientesRes] = await Promise.all([
          api.get("/modelos"),
          api.get("/clientes")
        ]);
        setModelos(modelosRes.data);
        setClientes(clientesRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGerar = () => {
    if (!modeloSelecionado || !clienteSelecionado) {
      alert("Selecione um modelo e um cliente para continuar.");
      return;
    }
    navigate(`/generate/${modeloSelecionado}?clienteId=${clienteSelecionado}`);
  };

  if (loading) {
    return (
      <div className="ml-64 pt-24 p-10 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl ml-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800">📝 Gerar Documento</h1>
          <p className="text-slate-500 font-medium">Selecione um modelo e um cliente para mesclar as informações</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-8">
          
          <div>
            <label className="block text-sm font-black uppercase text-slate-400 mb-3">
              1. Escolha o Modelo Jurídico
            </label>
            <select
              value={modeloSelecionado}
              onChange={(e) => setModeloSelecionado(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="">Selecione um modelo...</option>
              {modelos.map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.titulo} - {modelo.categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black uppercase text-slate-400 mb-3">
              2. Escolha o Cliente
            </label>
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.cpf || cliente.cnpj}
                </option>
              ))}
            </select>
          </div>

          {modeloSelecionado && clienteSelecionado && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-sm font-black uppercase text-amber-700 mb-3">✓ Pronto para Gerar</h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">
                  <span className="font-bold">Modelo:</span>{" "}
                  {modelos.find(m => m.id === parseInt(modeloSelecionado))?.titulo}
                </p>
                <p className="text-slate-700">
                  <span className="font-bold">Cliente:</span>{" "}
                  {clientes.find(c => c.id === parseInt(clienteSelecionado))?.nome}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleGerar}
              disabled={!modeloSelecionado || !clienteSelecionado}
              className="flex-1 bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gerar Documento →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-slate-800 mb-2">Modelos Disponíveis</h3>
            <p className="text-2xl font-black text-amber-600">{modelos.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-slate-800 mb-2">Clientes Cadastrados</h3>
            <p className="text-2xl font-black text-amber-600">{clientes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerarDocumento;
