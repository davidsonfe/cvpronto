import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importar a extensão AutoTable para tabelas no PDF
import { QRCodeCanvas } from 'qrcode.react';
import twitterIcon from './assets/twitter-icon.png'; 
import linkedinIcon from './assets/linkedin-icon.png'; 
import instagramIcon from './assets/instagram-icon.png'; 
import youtubeIcon from './assets/youtube-icon.png'; 
import profilePic from './assets/profile-pic.png'; // Sua foto como desenvolvedor
import cvprontoLogo from './assets/cvpronto-logo.png'; // Importando a logomarca
import brazilFlag from './assets/brazil-flag.png'; // Bandeira do Brasil
import usaFlag from './assets/usa-flag.png'; // Bandeira dos EUA
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
  
  const [foto, setFoto] = useState(null); // Adicionar estado para a foto no PDF
  const [darkMode, setDarkMode] = useState(false); // Estado para o modo escuro
  const [language, setLanguage] = useState('pt'); // Estado para o idioma

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Armazena a imagem base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const doc = new jsPDF();
    const qrCanvas = document.querySelector("canvas");
    const qrImage = qrCanvas.toDataURL("image/png");

    // Adiciona a foto se estiver presente
    if (foto) {
      const img = new Image();
      img.src = foto;
      img.onload = () => {
        const imgWidth = 40; // Largura da imagem
        const imgHeight = (img.height / img.width) * imgWidth; // Altura proporcional
        doc.addImage(img, 'JPEG', 160, 10, imgWidth, imgHeight); // Adiciona a foto no topo
        gerarTabela(doc); // Chama função para gerar tabela
        doc.save(`${formData.nome}_Curriculo.pdf`);
      };
    } else {
      gerarTabela(doc); // Chama função para gerar tabela se não houver foto
      doc.save(`${formData.nome}_Curriculo.pdf`);
    }
  };

  const gerarTabela = (doc) => {
    // Definições da tabela
    const columns = [
      { header: language === 'pt' ? 'Campo' : 'Field', dataKey: 'campo' },
      { header: language === 'pt' ? 'Informação' : 'Information', dataKey: 'informacao' }
    ];

    const rows = [
      { campo: language === 'pt' ? 'Nome' : 'Name', informacao: formData.nome },
      { campo: language === 'pt' ? 'Email' : 'Email', informacao: formData.email },
      { campo: language === 'pt' ? 'Telefone' : 'Phone', informacao: formData.telefone },
      { campo: language === 'pt' ? 'LinkedIn' : 'LinkedIn', informacao: formData.linkedin },
      { campo: language === 'pt' ? 'Endereço' : 'Address', informacao: formData.endereco },
      { campo: language === 'pt' ? 'Habilidades' : 'Skills', informacao: formData.habilidades },
      { campo: language === 'pt' ? 'Experiência' : 'Experience', informacao: formData.experiencia },
      { campo: language === 'pt' ? 'Formação' : 'Education', informacao: formData.formacao },
      { campo: language === 'pt' ? 'Certificados' : 'Certificates', informacao: formData.certificados },
    ];

    // Configuração da tabela
    doc.autoTable(columns, rows, {
      startY: 60, // Define a posição Y onde a tabela começa
      styles: {
        cellPadding: 5,
        fontSize: 10,
        overflow: 'linebreak', // Faz o texto quebrar a linha
        columnWidth: 'auto', // Ajusta a largura da coluna automaticamente
      },
      columnStyles: {
        campo: { cellWidth: 50, fontStyle: 'bold' }, // Títulos em negrito
        informacao: { cellWidth: 'auto' }, // Largura automática para "Informação"
      },
    });
  };

  // Função para alternar entre idiomas
  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className={`container clearfix ${darkMode ? 'dark' : ''}`}>
      <div className="language-selector">
        <img src={brazilFlag} alt="Português" className="flag" onClick={() => toggleLanguage('pt')} />
        <span className="language-text">Português</span>
        <img src={usaFlag} alt="English" className="flag" onClick={() => toggleLanguage('en')} />
        <span className="language-text">English</span>
      </div>
      <div className="logo-container">
        <img src={cvprontoLogo} alt="CVPRONTO" className="logo" />
        <span className="logo-text">CVPRONTO</span>
      </div>
      <h1>{language === 'pt' ? 'Gerador de Currículo' : 'Resume Generator'}</h1>
      <button className="toggle-button" onClick={() => setDarkMode(!darkMode)}>
        {language === 'pt' ? 'Modo Claro' : 'Light Mode'}
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{language === 'pt' ? 'Foto (opcional)' : 'Photo (optional)'}</label>
          <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
        </div>
        <div className="left-column">
          <div className="form-group">
            <label>{language === 'pt' ? 'Nome' : 'Name'}</label>
            <input type="text" name="nome" placeholder={language === 'pt' ? 'Nome' : 'Name'} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Email' : 'Email'}</label>
            <input type="email" name="email" placeholder={language === 'pt' ? 'Email' : 'Email'} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Telefone' : 'Phone'}</label>
            <input type="tel" name="telefone" placeholder={language === 'pt' ? 'Telefone' : 'Phone'} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'LinkedIn' : 'LinkedIn'}</label>
            <input type="url" name="linkedin" placeholder={language === 'pt' ? 'LinkedIn' : 'LinkedIn'} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Endereço' : 'Address'}</label>
            <input type="text" name="endereco" placeholder={language === 'pt' ? 'Endereço' : 'Address'} onChange={handleChange} maxLength="300"/>
          </div>
        </div>
        <div className="right-column">
          <div className="form-group">
            <label>{language === 'pt' ? 'Habilidades' : 'Skills'}</label>
            <textarea name="habilidades" placeholder={language === 'pt' ? 'Habilidades' : 'Skills'} onChange={handleChange} maxLength="500"></textarea>
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}</label>
            <textarea name="experiencia" placeholder={language === 'pt' ? 'Experiência' : 'Experience'} onChange={handleChange} maxLength="500"></textarea>
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Formação Educacional' : 'Educational Background'}</label>
            <textarea name="formacao" placeholder={language === 'pt' ? 'Formação' : 'Education'} onChange={handleChange} maxLength="300"></textarea>
          </div>
          <div className="form-group">
            <label>{language === 'pt' ? 'Certificados' : 'Certificates'}</label>
            <textarea name="certificados" placeholder={language === 'pt' ? 'Certificados' : 'Certificates'} onChange={handleChange} maxLength="300"></textarea>
          </div>
        </div>
        <button type="submit">{language === 'pt' ? 'Gerar CV' : 'Generate CV'}</button>
      </form>

      {/* Exibir QR Code */}
      <div className="qrcode">
        <h2>{language === 'pt' ? 'QR Code do Currículo' : 'Resume QR Code'}</h2>
        <QRCodeCanvas value={formData.linkedin || ''} />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>Feito por Davidson Felix</p>
          <img src={profilePic} alt="Davidson Felix" className="profile-pic" /> {/* Foto do desenvolvedor */}
          <div className="social-icons">
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter" className="icon"/>
            </a>
            <a href="https://www.linkedin.com/in/davidson-felix-0884331ab/" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" className="icon"/>
            </a>
            <a href="https://www.instagram.com/dedeibass/" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="icon"/>
            </a>
            <a href="https://www.youtube.com/@dedeifelix" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" className="icon"/>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
