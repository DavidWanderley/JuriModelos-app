const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <input 
          type="text" 
          placeholder="Pesquisar modelos jurídicos..." 
          className="w-full bg-slate-100 border-none rounded-full px-5 py-2 text-sm focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800 leading-none">David Wanderley</p>
          <p className="text-xs text-slate-500">Advogado</p>
        </div>
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
          DW
        </div>
      </div>
    </header>
  );
};

export default Header;