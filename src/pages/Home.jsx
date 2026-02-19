import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ModelCard from '../components/ModelCard';
import '../styles/Home.css';

const Home = () => {
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await api.get('/modelos');
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos", error);
      }
    };
    fetchModelos();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Dashboard JuriModelos</h1>
      <div className="model-grid">
        {modelos.map(m => (
          <ModelCard 
            key={m.id} 
            modelo={m} 
            onSelect={(id) => console.log("Navegar para ID:", id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;