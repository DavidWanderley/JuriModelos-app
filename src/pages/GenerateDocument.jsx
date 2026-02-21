import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/GenerateDocument.css";
import { jsPDF } from "jspdf";

const GenerateDocument = () => {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [formData, setFormData] = useState({});
  const [documentoFinal, setDocumentoFinal] = useState("");

  useEffect(() => {
    api.get(`/modelos/${id}`).then((res) => {
      setModel(res.data);
      // Cria um estado inicial para cada variável encontrada no modelo
      const fields = {};
      res.data.variaveis.forEach((v) => (fields[v] = ""));
      setFormData(fields);
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post(`/modelos/${id}/generate`, {
      data: formData,
    });
    setDocumentoFinal(response.data.documentoGerado);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Configurações de fonte para padrão jurídico
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    // Adiciona o texto com quebra de linha automática
    const splitText = doc.splitTextToSize(documentoFinal, 180);
    doc.text(splitText, 15, 20);

    // Salva o arquivo com o título do modelo
    doc.save(`${model.titulo}.pdf`);
  };

  if (!model) return <div className="home-container">Carregando...</div>;

  return (
    <div className="home-container">
      <h1 className="home-title">Preencher: {model.titulo}</h1>

      <form onSubmit={handleSubmit} className="generate-form">
        {model.variaveis.map((varName) => (
          <div key={varName} className="form-group">
            <label>{varName.replace("_", " ").toUpperCase()}</label>
            <input
              name={varName}
              onChange={handleChange}
              placeholder={`Digite o valor para ${varName}`}
              required
            />
          </div>
        ))}
        <button type="submit" className="model-card-button">
          Gerar Petição
        </button>
      </form>

      {documentoFinal && (
        <div className="result-area">
          <h3>Petição Gerada:</h3>
          <pre>{documentoFinal}</pre>
          <button onClick={() => navigator.clipboard.writeText(documentoFinal)}>
            Copiar para o PJe
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateDocument;
