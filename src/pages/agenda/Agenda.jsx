import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Agenda = () => {
  const [audiencias, setAudiencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudiencias = async () => {
      try {
        const response = await api.get("/modelos");
        const modelosComAudiencia = response.data.filter(m => m.data_audiencia);
        setAudiencias(modelosComAudiencia);
      } catch (error) {
        console.error("Erro ao carregar agenda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudiencias();
  }, []);

  const formatData = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
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
      <div className="max-w-6xl ml-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800">📅 Agenda Jurídica</h1>
          <p className="text-slate-500 font-medium">Audiências e compromissos agendados</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {audiencias.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {audiencias.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{item.titulo}</h3>
                      <p className="text-sm text-slate-500 mb-3">{item.categoria}</p>
                      <div className="flex items-center gap-2 text-amber-600">
                        <span className="text-xl">🕐</span>
                        <span className="font-bold">{formatData(item.data_audiencia)}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Agendado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center text-slate-400">
              <div className="text-5xl mb-4">📅</div>
              <p className="font-medium">Nenhuma audiência agendada no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
