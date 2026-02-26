import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); 

  const menus = [
    { name: "Início", icon: "🏠", path: "/" },
    { name: "Criar Novo Modelo", icon: "➕", path: "/novo-Modelo" },

  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-5 flex flex-col">
      <div className="text-2xl font-bold text-amber-500 mb-10 px-2">
        JuriModelos
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menus.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? "bg-amber-600 text-white" 
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-slate-700 pt-5 text-sm text-slate-400 px-2 italic">
        CW Advocacia
      </div>
    </aside>
  );
};

export default Sidebar;