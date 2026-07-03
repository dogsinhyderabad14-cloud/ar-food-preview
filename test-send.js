require("dotenv").config();

const ID = process.env.GREEN_ID_INSTANCE;
const TOKEN = process.env.GREEN_API_TOKEN;
const BASE_URL = `https://7107.api.greenapi.com/waInstance${ID}`;

async function testSend() {
  const phone = "919966211414"; // replace with another WhatsApp number
  const chatId = phone + "@c.us";

  const response = await fetch(`${BASE_URL}/sendMessage/${TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chatId: chatId,
      message: "KRUTZ test message ✅"
    })
  });

  const text = await response.text();
  console.log(text);
}

testSend();