import React from 'react';
import { useParams } from 'react-router-dom';

const GenerateDocument = () => {
  const { id } = useParams(); // Captura o ID da URL

  return (
    <div className="home-container">
      <h1>Gerar Documento</h1>
      <p>Você está editando o modelo ID: {id}</p>
      {/* Aqui entrará o formulário dinâmico no próximo passo */}
    </div>
  );
};

export default GenerateDocument;