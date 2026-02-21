import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <h2>JuriModelos</h2>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')}>Dashboard</li>
                        <li onClick={() => navigate('/modelos/novo')}>Novo Modelo</li>
                        <li onClick={handleLogout} style={{color: '#e74c3c'}}>Sair</li>
                    </ul>
                </nav>
            </aside>
            <main className="content">
                {children}
            </main>
        </div>
    );
};

export default Layout;