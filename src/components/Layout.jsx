import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="pl-[10px] pr-6 pt-6 pb-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;