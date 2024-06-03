const express = require('express');
const bodyParser = require('body-parser');
const Present = require('./models/Present');
const sequelize = require('./config/database');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Função para carregar e substituir variáveis no template HTML
const loadTemplate = (filePath, variables) => {
  let template = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return template;
};

// Endpoint para criar um novo presente e enviar email
app.post('/api/present', async (req, res) => {
  const { nome, email, date } = req.body;

  console.log('Received data:', { nome, email, date });

  try {
    // Salvar no banco de dados
    const newPresent = await Present.create({ nome, email, date });
    console.log('Data saved to database:', newPresent);

    // Carregar e preparar o template de email
    const emailTemplatePath = path.join(__dirname, 'emailTemplate.html');
    const emailHtml = loadTemplate(emailTemplatePath, { nome });

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'postal.projeta.digital',
      port: 587,
      secure: false,
      auth: {
        user: 'tiqui/noreply',
        pass: 'ynWL1shNhvb5XKQERGwy80vi',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log('Nodemailer transporter configured');

    // Configurar o email
    const mailOptions = {
      from: 'noreply@tiqui.com.br',
      to: email,
      subject: 'Thank you for your submission',
      html: emailHtml,
    };

    console.log('Mail options set:', mailOptions);

    // Enviar o email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send(error.toString());
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Data saved and email sent successfully');
    });

  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send(error.toString());
  }
});

// Endpoint para obter todos os presentes
app.get('/api/presents', async (req, res) => {
  try {
    const presents = await Present.findAll();
    res.status(200).json(presents);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  // Sincronizar o modelo com o banco de dados
  await sequelize.sync();
  console.log('Database synced');
});
