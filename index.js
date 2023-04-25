const puppeteer = require('puppeteer');
const { getPhoneNumberAndSMS } = require('./getPhoneNumberAndSMS');
require('dotenv').config();

const USERNAME = '41rdg6br';
const PASSWORD = process.env.PASSWORD;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  console.log('Acessando a página de criação de conta do Google...');
  await page.goto('https://accounts.google.com/signup');

  console.log('Preenchendo o nome...');
  await page.type('input[name="firstName"]', 'RODRIGO');
  await page.type('input[name="lastName"]', 'NOGUEIRA');

  console.log('Preenchendo o nome de usuário...');
  await page.type('input[name="Username"]', USERNAME);

  console.log('Preenchendo a senha...');
  await page.type('input[name="Passwd"]', PASSWORD);
  await page.type('input[name="ConfirmPasswd"]', PASSWORD);

  console.log('Clicando em próximo...');
  // Esperar que o botão seja carregado
  await page.waitForSelector('#accountDetailsNext > div > button > span');

  // Obter o botão usando o seletor
  const button = await page.$('#accountDetailsNext > div > button > span');

  // Clicar no botão
  await button.click();

  console.log('Preenchendo o número de telefone...');
  await page.waitForSelector('#phoneNumberId');
  const getPhoneNumber = await getPhoneNumberAndSMS();
  // const phoneNumber = getPhoneNumber.phoneNumber;
  // console.log(phoneNumber, 'Carregando numero...')
  await page.type('#phoneNumberId', '11946540606');
  await page.click('button[jsname="LgbsSe"]'); // Confirma o número
  // await page.waitForFunction('document.querySelector("#phoneNumberId").value.length > 0');

  // Lê o valor do campo de entrada e retorna para o código do Puppeteer
  const phoneNumber = await page.evaluate(() => {
    return document.querySelector('#phoneNumberId').value;
  });

  // Usa o valor do campo de entrada no restante do código
  console.log(phoneNumber);
  console.log('Aguardando a verificação do número...');
  
  // await page.waitForSelector('#code'); // Aguarda o código de verificação ser digitado

  // const getSMS = await getPhoneNumberAndSMS();
  // const verificationCode = getSMS.smsMessage
  // await page.waitForSelector('#code', { timeout: 100000 });

  // await page.type('#code', '986543'); // Digita o código de verificação/
  // await page.click('button[jsname="LgbsSe"]'); // Clica em "Verificar"
  console.log('Aguardando a verificação do número...');
  await page.waitForNavigation(); // aguarda a página ser carregada após clicar em "Próximo"
  
  // Continua a execução do código aqui...

  // Preenche o mês
  await page.waitForSelector('#month');
  await page.select('#month', '6'); // Exemplo: junho (valor 6)

  // Preenche o dia
  await page.waitForSelector('#day');
  await page.type('#day', '01'); // Exemplo: 01

  // Preenche o ano
  await page.waitForSelector('#year');
  await page.type('#year', '1990'); // Exemplo: 1990

  // Seleciona o gênero (masculino ou feminino)
  await page.waitForSelector('#gender');
  await page.click('#gender');
  await page.waitForSelector('#gender-menu');
  await page.click('#gender-menu [data-value="male"]'); // Exemplo: masculino

  console.log('Finalizando a criação da conta...');
  await page.waitForNavigation(); // Aguarda a página ser carregada
  await page.waitForSelector('#termsofserviceNext'); // Aguarda o botão "Aceitar" aparecer
  await page.click('#termsofserviceNext'); // Clica em "Aceitar"
  await page.waitForSelector('#privacyPolicyNext'); // Aguarda o botão "Aceitar" aparecer
  await page.click('#privacyPolicyNext'); // Clica em "Aceitar"

  console.log('Conta criada com sucesso!');
  await browser.close(); // Fecha o navegador
})();
