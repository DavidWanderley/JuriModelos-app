import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Armazena o token no localStorage para as próximas requisições
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redireciona para o Dashboard
            navigate('/');
        } catch (err) {
            setError('E-mail ou senha incorretos. Tente novamente.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>JuriModelos Login</h2>
                
                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>E-mail Corporativo</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="seuemail@cwadvocacia.com"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="********"
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Acessar Sistema
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;