import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar a extensão AutoTable para tabelas no PDF
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    linkedin: '',
    endereco: '',
    habilidades: '',
    experiencia: '',
    formacao: '',
    certificados: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gerar PDF
    const doc = new jsPDF();

    // Estilo de título
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Currículo', 105, 10, null, null, 'center');

    // Tabelas com dados do formulário
    doc.autoTable({
      startY: 20,
      head: [['Campo', 'Informação']],
      body: [
        ['Nome', formData.nome],
        ['Email', formData.email],
        ['Telefone', formData.telefone],
        ['LinkedIn', formData.linkedin],
        ['Endereço', formData.endereco],
        ['Habilidades', formData.habilidades],
        ['Experiência', formData.experiencia],
        ['Formação', formData.formacao],
        ['Certificados', formData.certificados],
      ],
      theme: 'grid',
      styles: {
        fontSize: 12, // Tamanho da fonte
        cellPadding: 3,
        halign: 'left', // Alinhamento do texto
      },
      headStyles: {
        fillColor: [100, 100, 255], // Cor da linha de cabeçalho
        textColor: [255, 255, 255], // Cor do texto do cabeçalho
      },
    });

    doc.save(`${formData.nome}_Curriculo.pdf`);
  };

  return (
    <div className="container">
      <h1>Gerador de Currículo</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input type="text" name="nome" placeholder="Nome" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input type="tel" name="telefone" placeholder="Telefone" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input type="url" name="linkedin" placeholder="LinkedIn" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input type="text" name="endereco" placeholder="Endereço" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Habilidades</label>
          <textarea name="habilidades" placeholder="Habilidades" onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Experiência Profissional</label>
          <textarea name="experiencia" placeholder="Experiência" onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Formação Educacional</label>
          <textarea name="formacao" placeholder="Formação" onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Certificados</label>
          <textarea name="certificados" placeholder="Certificados" onChange={handleChange}></textarea>
        </div>
        <button type="submit">Gerar CV</button>
      </form>

      {/* Exibir QR Code */}
      <div className="qrcode">
        <h2>QR Code do Currículo</h2>
        <QRCodeCanvas value={JSON.stringify(formData)} />
      </div>
    </div>
  );
}

export default App;
