require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const ID = process.env.GREEN_ID_INSTANCE;
const TOKEN = process.env.GREEN_API_TOKEN;
const BASE_URL = `https://7107.api.greenapi.com/waInstance${ID}`;

const RESTAURANT_NAME = "KRUTZ Restaurant";
const RESTAURANT_PHONE = "+91 9966211414";
const RESTAURANT_LOCATION = "https://maps.google.com/?q=KRUTZ+Restaurant+Hyderabad";

const processedMessages = new Set();

app.get("/", (req, res) => {
  res.send("🚀 KRUTZ WhatsApp Bot v2 Running");
});

async function sendMessage(chatId, message) {
  try {
    await fetch(`${BASE_URL}/sendMessage/${TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatId: chatId,
        message: message
      })
    });
  } catch (error) {
    console.log("Send error:", error.message);
  }
}

function mainMenu() {
  return `👋 Welcome to ${RESTAURANT_NAME}

Please choose an option:

1️⃣ 📖 Menu
2️⃣ 📍 Location
3️⃣ 📞 Contact / Call
4️⃣ 🪑 Reserve Table
5️⃣ 📦 Track Order
6️⃣ 🍔 Order Food
7️⃣ ⭐ Feedback
8️⃣ 🤖 AI Assistant

Reply with a number like 1, 2, 3...`;
}

function menuMessage() {
  return `🍽️ KRUTZ MENU

🍔 Chicken Burger - ₹99
🍕 Pizza - ₹149
☕ Coffee - ₹79

To order, reply like:

ORDER 2 BURGER 1 PIZZA TABLE 5`;
}

function getReply(text) {
  const msg = text.toLowerCase().trim();

  if (["hi", "hello", "hey", "start"].includes(msg)) {
    return mainMenu();
  }

  if (msg === "1" || msg.includes("menu") || msg.includes("food")) {
    return menuMessage();
  }

  if (msg === "2" || msg.includes("location") || msg.includes("address")) {
    return `📍 ${RESTAURANT_NAME} Location:

${RESTAURANT_LOCATION}`;
  }

  if (msg === "3" || msg.includes("contact") || msg.includes("call") || msg.includes("phone")) {
    return `📞 Contact ${RESTAURANT_NAME}

Call: ${RESTAURANT_PHONE}`;
  }

  if (msg === "4" || msg.includes("reserve") || msg.includes("book table")) {
    return `🪑 Table Reservation

Reply like:

RESERVE TABLE 5 7:30PM 4 GUESTS`;
  }

  if (msg === "5" || msg.includes("status") || msg.includes("track")) {
    return `📦 Order Tracking

Reply like:

STATUS your_order_id`;
  }

  if (msg === "6" || msg.includes("order")) {
    return `🍔 Place Order

Reply like:

ORDER 2 BURGER 1 PIZZA TABLE 5`;
  }

  if (msg === "7" || msg.includes("feedback") || msg.includes("review")) {
    return `⭐ Feedback

Reply like:

FEEDBACK 5 Great food and service`;
  }

  if (msg === "8" || msg.includes("ai") || msg.includes("assistant") || msg.includes("help")) {
    return `🤖 KRUTZ AI Assistant

I can help with:
Menu
Location
Contact
Order
Reservation
Status`;
  }

  return `Sorry, I didn't understand that.

${mainMenu()}`;
}

async function deleteNotification(receiptId) {
  try {
    await fetch(`${BASE_URL}/deleteNotification/${TOKEN}/${receiptId}`, {
      method: "DELETE"
    });
  } catch (error) {
    console.log("Delete notification error:", error.message);
  }
}

async function checkMessages() {
  try {
    const response = await fetch(`${BASE_URL}/receiveNotification/${TOKEN}`);
    const rawText = await response.text();

    if (!rawText) return;

    let data;

    try {
      data = JSON.parse(rawText);
    } catch (error) {
      console.log("Invalid GREEN-API response");
      return;
    }

    if (!data || !data.body) return;

    const receiptId = data.receiptId;
    const body = data.body;

    if (body.typeWebhook !== "incomingMessageReceived") {
      await deleteNotification(receiptId);
      return;
    }

    const messageId = body.idMessage;

    if (processedMessages.has(messageId)) {
      await deleteNotification(receiptId);
      return;
    }

    processedMessages.add(messageId);

    const chatId = body.senderData?.chatId;

    const messageText =
      body.messageData?.textMessageData?.textMessage || "";

    console.log("Incoming:", chatId, messageText);

    await deleteNotification(receiptId);

    if (!chatId || !messageText) return;

    const reply = getReply(messageText);

    await sendMessage(chatId, reply);

    console.log("Reply sent once");
  } catch (error) {
    console.log("Bot error:", error.message);
  }
}

setInterval(checkMessages, 3000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 KRUTZ WhatsApp Bot v2 Running on Port", PORT);
});