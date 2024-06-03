const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Função para carregar e substituir variáveis no template HTML
const loadTemplate = (filePath, variables) => {
  let template = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return template;
};

const emailTemplatePath = path.join(__dirname, 'emailTemplate.html');
const emailHtml = loadTemplate(emailTemplatePath, { nome: 'John Doe' });

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  host: 'postal.projeta.digital',
  port: 587,
  secure: false, // Usar STARTTLS
  auth: {
    user: 'tiqui/noreply',
    pass: 'ynWL1shNhvb5XKQERGwy80vi',
  },
  tls: {
    rejectUnauthorized: false, // Adicione isto se houver problemas com certificados SSL
  },
  connectionTimeout: 10000, // Aumentar o timeout de conexão para 10 segundos
});

console.log('Nodemailer transporter configured');

// Configurar o email
const mailOptions = {
  from: 'noreply@tiqui.com.br',
  to: 'djrodrigodf@gmail.com',
  subject: 'Thank you for your submission',
  html: emailHtml,
};

console.log('Mail options set:', mailOptions);

// Enviar o email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    return;
  }console.log('Email sent:', info.response);
});
