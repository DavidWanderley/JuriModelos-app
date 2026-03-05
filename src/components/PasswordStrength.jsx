import { calcularForcaSenha } from "../utils/validators";

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const forca = calcularForcaSenha(password);
  
  const getColor = () => {
    if (forca < 40) return "bg-red-500";
    if (forca < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTexto = () => {
    if (forca < 40) return "Fraca";
    if (forca < 70) return "Média";
    return "Forte";
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getColor()} transition-all duration-300`}
            style={{ width: `${forca}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${
          forca < 40 ? "text-red-600" : forca < 70 ? "text-yellow-600" : "text-green-600"
        }`}>
          {getTexto()}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 ml-1">
        Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos
      </p>
    </div>
  );
}
