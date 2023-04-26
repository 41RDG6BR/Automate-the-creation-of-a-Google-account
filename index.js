const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getPhoneNumberAndSMS } = require('./getPhoneNumberAndSMS');
require('dotenv').config();

const USERNAME = 'r0dr1g0s3cr3t';
const PASSWORD = process.env.PASSWORD;

// Add the stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

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
 
  await page.type('#passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input', 's3cr3tP@ssw0rd');

  console.log('Preenchendo a senha...');

  await page.type('input[name="ConfirmPasswd"]', 's3cr3tP@ssw0rd');

  console.log('Confirmando a senha...');  
  console.log('Clicando em próximo...');

  await page.waitForSelector('#accountDetailsNext > div > button > span');
  const button = await page.$('#accountDetailsNext > div > button > span');
  await button.click();

  console.log('Preenchendo o número de telefone...');
  try {
    await page.waitForSelector('#phoneNumberId');
    const getPhoneNumber = await getPhoneNumberAndSMS();
    const phoneNumber = getPhoneNumber.phoneNumber;
    console.log(phoneNumber, 'Phone Number');
  } catch (error) {
    console.error('Error occurred while getting phone number:', error);
  }
  
  await page.type('#phoneNumberId', '41999999666');
  await page.click('button[jsname="LgbsSe"]'); // Confirma o número

  console.log('Aguardando a verificação do número...');

  // Espera a página ser carregada após clicar em "Próximo"
  await page.waitForNavigation();

  console.log('Preenche o campo com o código de verificação...');
  /* PREENCHER O CAMPO */

  try {
    const getSMSMessage = await getPhoneNumberAndSMS();
    const smsMessage = getSMSMessage.smsMessage;
    console.log(smsMessage, 'SMS Message');
  } catch (error) {
    console.error('Error occurred while getting sms message:', error);
  }

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
  await page.waitForTimeout(6000); // espera 6 segundos
  await page.click('#gender-menu [data-value="male"]'); // Exemplo: masculino

  await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span');
  const nextButton = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span');
  await nextButton.click();
  
  console.log('Finalizando a criação da conta...');
  await page.waitForNavigation(); // Aguarda a página ser carregada
  await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.daaWTb > div > div > button > span');
  const skipButton = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.daaWTb > div > div > button > span');
  await skipButton.click();

  // await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section:nth-child(3) > div > div > div:nth-child(1) > div.ci67pc > div > div > div.enBDyd > div > input');
  // const checkbox = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section:nth-child(3) > div > div > div:nth-child(1) > div.ci67pc > div > div > div.enBDyd > div > input');
  // await checkbox.click();
   
  await page.waitForSelector('#termsofserviceNext'); // Aguarda o botão "Aceitar" aparecer
  await page.click('#termsofserviceNext'); // Clica em "Aceitar"
  await page.waitForSelector('#privacyPolicyNext'); // Aguarda o botão "Aceitar" aparecer
  await page.click('#privacyPolicyNext'); // Clica em "Aceitar"

  // await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span');
  // const createAccountButton = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button > span');
  // await createAccountButton.click();

  console.log('Conta criada com sucesso!');
  await browser.close(); // Fecha o navegador
})();