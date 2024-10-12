import React, { createContext, useState, useEffect } from 'react';

// Cria o contexto
export const GlobalContext = createContext();

// Função para carregar do localStorage com fallback
const loadFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Provedor do contexto para envolver o App
export const GlobalProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => loadFromLocalStorage('formData', {
    nome: '',
    email: '',
    telefone: '',
    linkedin: '',
    endereco: '',
    habilidades: '',
    experiencia: '',
    formacao: '',
    certificados: ''
  }));

  // Mudança aqui: define null como padrão para indicar que não há foto carregada
  const [foto, setFoto] = useState(() => loadFromLocalStorage('foto', null));

  // Salva no localStorage quando formData ou foto mudarem
  useEffect(() => {
    if (formData) localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (foto) {
      localStorage.setItem('foto', JSON.stringify(foto));
    } else {
      localStorage.removeItem('foto'); // Remova a foto se for nula ou vazia
    }
  }, [foto]);

  return (
    <GlobalContext.Provider value={{ formData, setFormData, foto, setFoto }}>
      {children}
    </GlobalContext.Provider>
  );
};
