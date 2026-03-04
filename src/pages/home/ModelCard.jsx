import React from 'react';

const ModelCard = ({ modelo, onSelect }) => {
  const getComplexityStyle = (nivel) => {
    switch (nivel) {
      case 'Baixa': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Média': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Alta': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formatData = (data) => {
    if (!data) return null;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  };

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
      onClick={() => onSelect(modelo.id)}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {modelo.categoria}
          </span>
          
          {modelo.pdf_url && (
            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md" title="Possui PDF de referência">
              <span className="text-xs font-bold">PDF</span>
              <span className="text-sm">📄</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-3 group-hover:text-[#0e1e3f] transition-colors">
          {modelo.titulo}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getComplexityStyle(modelo.complexidade)}`}>
            {modelo.complexidade || 'Média'}
          </span>
          
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            {modelo.tipo_cliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </span>
        </div>

        {modelo.descricao && (
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 italic">
            "{modelo.descricao}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        {modelo.data_audiencia ? (
          <div className="flex items-center gap-2 text-amber-600 mb-3">
            <span className="text-sm">📅</span>
            <span className="text-xs font-bold">Audiência: {formatData(modelo.data_audiencia)}</span>
          </div>
        ) : (
          <div className="h-7"></div> 
        )}
        
        <div className="flex items-center justify-between text-[#0e1e3f] font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
          <span>Ver Detalhes</span>
          <span className="text-lg">→</span>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;