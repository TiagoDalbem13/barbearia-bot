const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// CONFIG DA Z-API
const INSTANCE_ID = "3EA402CE4F8B314C62CB3A63791FAAD1";
const API_TOKEN = "D37AE45439275978CAF63FE8";
const API_URL = `https://api.z-api.io/instances/${INSTANCE_ID}/token/${API_TOKEN}`;

async function enviarMensagem(numero, texto) {
    await axios.post(`${API_URL}/send-message`, {
        phone: numero,
        message: texto
    });
}

app.post("/webhook", async (req, res) => {
    const data = req.body;

    if (!data.message) return res.sendStatus(200);

    const msg = data.message;
    const texto = msg.text?.body?.trim();
    const numero = msg.from;

    if (!texto) return res.sendStatus(200);

    // MENU
    if (["menu","Menu","MENU"].includes(texto)) {
        await enviarMensagem(numero, 
            "Olá 👋 bem-vindo à Barbearia do Tiago 💈\n\n" +
            "1️⃣ Ver preços\n" +
            "2️⃣ Agendar horário\n" +
            "3️⃣ Localização\n" +
            "4️⃣ Promoções\n" +
            "0️⃣ Falar com o barbeiro");
        return res.sendStatus(200);
    }

    if (texto === "1") {
        await enviarMensagem(numero,
            "💈 *Tabela de Preços*\n\n" +
            "✂ Corte: R$ 25\n" +
            "🧔 Corte + Barba: R$ 40\n" +
            "🔥 Sobrancelha: R$ 10\n\n" +
            "Quer agendar?\nDigite: 2");
        return res.sendStatus(200);
    }

    if (texto === "2") {
        await enviarMensagem(numero, 
            "📅 Vamos agendar seu horário!\nDigite o dia que você deseja (ex: 15/11)");
        return res.sendStatus(200);
    }

    if (texto.includes("/")) {
        await enviarMensagem(numero, "Agora me diga o horário que você quer (ex: 14:30)");
        return res.sendStatus(200);
    }

    if (texto.includes(":")) {
        await enviarMensagem(numero,
            "✔ Seu horário foi registrado!\n" +
            "O Tiago irá confirmar manualmente.\nDigite *menu* para voltar.");
        return res.sendStatus(200);
    }

    if (texto === "3") {
        await enviarMensagem(numero,
            "📍 *Localização da Barbearia*\nRua XXXXXX nº XXX\nGoogle Maps: https://maps.google.com/");
        return res.sendStatus(200);
    }

    if (texto === "4") {
        await enviarMensagem(numero,
            "🔥 Promoções da Semana\n\n" +
            "➡ Corte + Barba R$ 35\n" +
            "➡ Corte Infantil R$ 18\n" +
            "Para agendar digite 2");
        return res.sendStatus(200);
    }

    if (texto === "0") {
        await enviarMensagem(numero,
            "🔊 Vou te passar para o Tiago agora, só um momento!");
        return res.sendStatus(200);
    }

    await enviarMensagem(numero, "Não entendi 🤔\nDigite *menu* para ver as opções.");
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("BOT rodando na porta " + (process.env.PORT || 3000));
});
