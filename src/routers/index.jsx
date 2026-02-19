import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// Vamos deixar a página de geração preparada, mesmo que ainda não a tenhamos criado
import GenerateDocument from '../pages/GenerateDocument'; 

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate/:id" element={<GenerateDocument />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;