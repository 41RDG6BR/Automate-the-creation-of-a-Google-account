const axios = require('axios');
require('dotenv').config();

async function getPhoneNumberAndSMS() {
  try {
    const phoneNumberUrl = process.env.PHONE_NUMBER;
    const phoneNumberResponse = await axios.get(phoneNumberUrl);
    const phoneNumber = phoneNumberResponse.data;

    console.log(`Número de telefone: ${phoneNumber}`);

    const smsUrl = process.env.SMS_URL;
    const smsResponse = await axios.get(smsUrl);
    const smsMessage = smsResponse.data;

    console.log(`Mensagem SMS: ${smsMessage}`);

    return { phoneNumber, smsMessage };
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getPhoneNumberAndSMS };
