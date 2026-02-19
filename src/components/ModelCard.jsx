import React from 'react';
import '../styles/ModelCard.css';

const ModelCard = ({ modelo, onSelect }) => {
  return (
    <div className="model-card">
      <div>
        <h3>{modelo.titulo}</h3>
        <p><strong>Categoria:</strong> {modelo.categoria}</p>
      </div>
      <button 
        className="model-card-button" 
        onClick={() => onSelect(modelo.id)}
      >
        Usar Modelo
      </button>
    </div>
  );
};

export default ModelCard;