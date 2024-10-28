import React, { useEffect, useState, useContext } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext'; // Importa o contexto

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, foto, setFoto } = useContext(GlobalContext); // Pegando `formData` e `foto` do GlobalContext
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pdfGenerated, setPdfGenerated] = useState(false); 

  const sessionId = new URLSearchParams(location.search).get('session_id');
  const apiUrl = process.env.REACT_APP_API_URL; // URL para APIs
  const apiUrlSuccess = process.env.REACT_APP_API_URL_SUCCESS;

  // Log para verificar execução de efeitos
  console.log("Renderizando Success.js");
  console.log("FormData atual:", formData);  // Adicionado log para verificar o formData

  // Verificar se os dados estão presentes e não resetar `pdfGenerated` indevidamente
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      console.log("FormData disponível, mantendo pdfGenerated como false inicialmente.");
      setPdfGenerated(false); 
    } else {
      console.log("FormData vazio, resetando pdfGenerated.");
      setPdfGenerated(false); 
    }
  }, [formData]);

  // Esse useEffect garante que o PDF só seja gerado uma vez, mesmo ao recarregar a página
  useEffect(() => {
    if (sessionId) {
      console.log("Verificando pagamento...");

      fetch(`${apiUrl}/verify-payment/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Resposta do pagamento:", data); // Log da resposta
          if (data.paymentStatus === 'paid') {
            setPaymentVerified(true);
            console.log("Pagamento confirmado.");

            // Verificar se o PDF já foi gerado
            fetch(`${apiUrl}/pdf-generated/${sessionId}`)
              .then((res) => res.json())
              .then((data) => {
                if (!data.pdfGenerated) {
                  console.log("Marcando PDF como pronto para ser gerado.");
                  setPdfGenerated(true); // Marca como pronto para gerar o PDF
                } else {
                  console.log("PDF já foi gerado anteriormente.");
                }
              });

            // Armazenar a foto após a confirmação do pagamento
            if (foto) {
  const apiUrl = process.env.REACT_APP_API_URL; // URL para APIs
              fetch(`${apiUrl}/store-photo/${sessionId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(foto) // Passa a URL da foto para o back-end
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Erro ao armazenar a foto');
                }
              })
              .catch(err => console.error('Erro ao armazenar a foto:', err));
            }
          } else {
            console.error('Erro: Pagamento não confirmado.');
            navigate('/error');
          }
        })
        .catch((err) => {
          console.error('Erro na verificação de pagamento:', err);
          setErrorMessage('Erro ao verificar o pagamento.');
        });
    }
  }, [sessionId, navigate]);

  // Função para gerar o PDF
  useEffect(() => {
    if (pdfGenerated && paymentVerified && !errorMessage && formData && Object.keys(formData).length > 0) {
      console.log("Gerando PDF...");
      gerarPDF(); // Certifique-se de que `formData` está sendo passado aqui
    } else if (!formData || Object.keys(formData).length === 0) {
      console.log("Erro: Dados do formulário não disponíveis no momento da geração do PDF.");
      setErrorMessage("Erro: Dados do formulário não disponíveis.");
    }
  }, [pdfGenerated, paymentVerified, errorMessage, formData]); 

  // Função para gerar o PDF
const gerarPDF = () => {
  const doc = new jsPDF();
  doc.text('Currículo', 10, 10);

  if (foto) {
    const imgWidth = 40;
    const imgHeight = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgX = pageWidth - imgWidth - 14;
    doc.addImage(foto, 'JPEG', imgX, 20, imgWidth, imgHeight);
  }

  // Verificação dos dados do formulário antes de gerar a tabela
  if (formData && Object.keys(formData).length > 0) {
    console.log("Dados do formulário:", formData); // Adiciona log para verificar se os dados estão disponíveis
    gerarTabela(doc); // Gera a tabela com os dados
    doc.save('curriculo.pdf'); 
    console.log("PDF salvo com sucesso.");

    // Marcar PDF como gerado no backend
    fetch(`${apiUrl}/mark-pdf-generated/${sessionId}`, {
      method: 'POST',
    }).catch(err => console.error('Erro ao marcar PDF como gerado:', err));

    // Limpar apenas a foto do localStorage e resetar o estado da foto
    localStorage.removeItem('foto');  // Remove a foto do localStorage
    setFoto(null);  // Reseta o estado da foto para null
  } else {
    console.log("Erro: Dados do formulário não disponíveis no momento da geração do PDF.");
    setErrorMessage("Erro: Dados do formulário não disponíveis.");
  }
};


  // Função para gerar a tabela no PDF
  const gerarTabela = (doc) => {
    const columns = [
      { header: 'Campo', dataKey: 'campo' },
      { header: 'Informação', dataKey: 'informacao' }
    ];

    // Atribui os valores de formData corretamente para serem exibidos na tabela
    const rows = [
      { campo: 'Nome', informacao: formData?.nome || 'N/A' },
      { campo: 'Email', informacao: formData?.email || 'N/A' },
      { campo: 'Telefone', informacao: formData?.telefone || 'N/A' },
      { campo: 'LinkedIn', informacao: formData?.linkedin || 'N/A' },
      { campo: 'Endereço', informacao: formData?.endereco || 'N/A' },
      { campo: 'Habilidades', informacao: formData?.habilidades || 'N/A' },
      { campo: 'Experiência', informacao: formData?.experiencia || 'N/A' },
      { campo: 'Formação', informacao: formData?.formacao || 'N/A' },
      { campo: 'Certificados', informacao: formData?.certificados || 'N/A' },
    ];

    // Gera a tabela corretamente com base nas colunas e linhas
    doc.autoTable(columns, rows, {
      startY: 60,
      styles: { cellPadding: 5, fontSize: 10, overflow: 'linebreak', columnWidth: 'auto' },
      columnStyles: { campo: { cellWidth: 50, fontStyle: 'bold' }, informacao: { cellWidth: 'auto' } },
    });
  };

  return (
    <div className="success-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {paymentVerified ? (
        <>
          <h1 className="success-title">Pagamento realizado com sucesso!</h1>
          <p className="success-message">O seu CV foi gerado com sucesso e será baixado automaticamente.</p>
        </>
      ) : (
        <p className="verifying-message">Verificando pagamento...</p>
      )}
    </div>
  );
};

export default Success;
