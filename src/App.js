import React, { useState, useContext, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { loadStripe } from '@stripe/stripe-js'; 
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import Success from './Success'; 
import twitterIcon from './assets/twitter-icon.png';
import linkedinIcon from './assets/linkedin-icon.png';
import instagramIcon from './assets/instagram-icon.png';
import youtubeIcon from './assets/youtube-icon.png';
import profilePic from './assets/profile-pic.png'; 
import cvprontoLogo from './assets/cvpronto-logo.png'; 
import brazilFlag from './assets/brazil-flag.png'; 
import usaFlag from './assets/usa-flag.png';
import './App.css';
import { GlobalContext } from './GlobalContext'; 

// Carrega o Stripe com a chave pública
const stripePromise = loadStripe('pk_test_51Q77Sf08o8UgTVqSNeSzjNNts9l7sbXmnSDZZgQ2kybWJJFVbKmBP1FQZ58gjm3cv1eNeDEtl4jQwR4eMnsYj0yD007wLvnler');

function App() {
  const { formData, setFormData, foto, setFoto } = useContext(GlobalContext); // Acesse o contexto global
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('pt');
  const navigate = useNavigate(); 
  const apiUrl = process.env.REACT_APP_API_URL;

  // Inicializa `formData` caso esteja null ou undefined
  useEffect(() => {
    if (!formData) {
      setFormData({
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
    }
  }, [formData, setFormData]);

  // Função para lidar com as mudanças no formulário e salvar no GlobalContext
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  // Função para lidar com o upload de fotos e salvar no GlobalContext
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Define a foto no contexto global
      };
      reader.readAsDataURL(file);
    }
  };

  const isEmailValid = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isPhoneValid = (phone) => {
    return phone.length >= 10;
  };

  // Validação do formulário e processamento de pagamento
  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData?.nome) {
      validationErrors.nome = language === 'pt' ? 'Por favor, insira seu nome.' : 'Please enter your name.';
    }

    if (!formData?.email || !isEmailValid(formData.email)) {
      validationErrors.email = language === 'pt' ? 'Por favor, insira um email válido.' : 'Please enter a valid email.';
    }

    if (!formData?.telefone || !isPhoneValid(formData.telefone)) {
      validationErrors.telefone = language === 'pt' ? 'Por favor, insira um telefone válido.' : 'Please enter a valid phone number.';
    }

    if (!formData?.linkedin) {
      validationErrors.linkedin = language === 'pt' ? 'Por favor, insira seu perfil do LinkedIn.' : 'Please enter your LinkedIn profile.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    handlePayment();
  };

  // Função para iniciar o processo de pagamento
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch(`${apiUrl}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: 'Gerar CV',
          amount: 990, 
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (!error) {
        navigate('/success', { state: { formData, foto } });
      } else {
        console.error('Erro ao redirecionar para o Stripe:', error);
      }
    } catch (error) {
      console.error('Erro ao iniciar o pagamento:', error);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
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
                  {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>
                <div className="form-group">
                  <label>{language === 'pt' ? 'Email' : 'Email'}</label>
                  <input type="email" name="email" placeholder={language === 'pt' ? 'Email' : 'Email'} onChange={handleChange} />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>{language === 'pt' ? 'Telefone' : 'Phone'}</label>
                  <input type="tel" name="telefone" placeholder={language === 'pt' ? 'Telefone' : 'Phone'} onChange={handleChange} />
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                </div>
                <div className="form-group">
                  <label>{language === 'pt' ? 'LinkedIn' : 'LinkedIn'}</label>
                  <input type="url" name="linkedin" placeholder={language === 'pt' ? 'LinkedIn' : 'LinkedIn'} onChange={handleChange} />
                  {errors.linkedin && <span className="error-message">{errors.linkedin}</span>}
                </div>
                <div className="form-group">
                  <label>{language === 'pt' ? 'Endereço' : 'Address'}</label>
                  <input type="text" name="endereco" placeholder={language === 'pt' ? 'Endereço' : 'Address'} onChange={handleChange} maxLength="300" />
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
              <button type="submit">{language === 'pt' ? 'Gerar CV - R$ 9,90' : 'Generate CV - $1.98'}</button>
            </form>

            <div className="qrcode">
              <h2>{language === 'pt' ? 'QR Code do Currículo' : 'Resume QR Code'}</h2>
              <QRCodeCanvas value={formData?.linkedin || ''} />
            </div>

            <footer className="footer">
              <div className="footer-content">
                <p>Feito por Davidson Felix</p>
                <img src={profilePic} alt="Davidson Felix" className="profile-pic" />
                <div className="social-icons">
                  <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                    <img src={twitterIcon} alt="Twitter" className="icon" />
                  </a>
                  <a href="https://www.linkedin.com/in/davidson-felix-0884331ab/" target="_blank" rel="noopener noreferrer">
                    <img src={linkedinIcon} alt="LinkedIn" className="icon" />
                  </a>
                  <a href="https://www.instagram.com/dedeibass/" target="_blank" rel="noopener noreferrer">
                    <img src={instagramIcon} alt="Instagram" className="icon" />
                  </a>
                  <a href="https://www.youtube.com/@dedeifelix" target="_blank" rel="noopener noreferrer">
                    <img src={youtubeIcon} alt="YouTube" className="icon" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        }
      />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;
