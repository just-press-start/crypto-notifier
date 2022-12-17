const axios = require("axios");

const botToken = "5597971187:AAFuXs_cS-zJWS4j2KtplJOSZu4lSz23gts";
const chatId = "-881091284";

const sendMessage = async (message) => {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${message}`
    const response = await axios.get(url).catch(e => console.log(e.response.data));
    return response;
}

module.exports = {
    sendMessage
}