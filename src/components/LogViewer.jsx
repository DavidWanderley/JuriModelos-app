import { useState, useEffect } from "react";
import logger from "../utils/logger";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (import.meta.env.MODE !== "development") return null;

  const filteredLogs = filter === "ALL" 
    ? logs 
    : logs.filter(log => log.level === filter);

  const getLevelColor = (level) => {
    const colors = {
      ERROR: "bg-red-100 text-red-800 border-red-300",
      WARN: "bg-yellow-100 text-yellow-800 border-yellow-300",
      INFO: "bg-blue-100 text-blue-800 border-blue-300",
      DEBUG: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 z-50"
        title="Ver Logs"
      >
        📋 {logs.length}
      </button>

      {/* Painel de logs */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Logs ({filteredLogs.length})</h3>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="ALL">Todos</option>
                <option value="ERROR">Erros</option>
                <option value="WARN">Avisos</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </select>
              <button
                onClick={() => logger.clearLogs()}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Limpar
              </button>
              <button
                onClick={() => logger.exportLogs()}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Exportar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-slate-400 text-sm mt-4">Nenhum log</p>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border text-xs ${getLevelColor(log.level)}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold">{log.level}</span>
                    <span className="text-[10px] opacity-70">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="font-medium">{log.message}</p>
                  {log.data && (
                    <pre className="mt-1 text-[10px] opacity-70 overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
