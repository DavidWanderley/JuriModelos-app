import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CreateModel.css';

const CreateModel = () => {
  const [dados, setDados] = useState({ titulo: '', categoria: 'Petições', conteudo: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/modelos', dados);
      alert('Modelo jurídico salvo com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="create-container">
      <h1>Cadastrar Novo Modelo Jurídico</h1>
      <form onSubmit={handleSubmit} className="create-form">
        <input 
          type="text" 
          placeholder="Título da Peça (ex: Recurso Ordinário)" 
          required
          onChange={(e) => setDados({...dados, titulo: e.target.value})}
        />
        
        <select onChange={(e) => setDados({...dados, categoria: e.target.value})}>
          <option value="Petições">Petições</option>
          <option value="Contratos">Contratos</option>
          <option value="Recursos">Recursos</option>
          <option value="Pareceres">Pareceres</option>
        </select>

        <textarea 
          placeholder="Cole aqui o texto base com as variáveis (ex: {{nome_cliente}})" 
          required
          onChange={(e) => setDados({...dados, conteudo: e.target.value})}
        />

        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/')}>Cancelar</button>
          <button type="submit" className="btn-save">Salvar Modelo</button>
        </div>
      </form>
    </div>
  );
};

export default CreateModel;