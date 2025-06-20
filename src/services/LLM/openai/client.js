import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

console.log("🔐 Assistant ID:", ASSISTANT_ID);
console.log("🔐 API Key corta:", OPENAI_API_KEY?.slice(0, 10));

export async function ask(prompt) {
    try {
        const threadResponse = await axios.post(
            "https://api.openai.com/v1/threads",
            {},
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                    "Content-Type": "application/json",
                },
            }
        );

        const threadId = threadResponse.data.id;

        await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
                role: "user",
                content: prompt,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                    "Content-Type": "application/json",
                },
            }
        );

        const runResponse = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            {
                assistant_id: ASSISTANT_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                    "Content-Type": "application/json",
                },
            }
        );

        const runId = runResponse.data.id;

        let status = "in_progress";
        let messages = [];

        while (status === "in_progress" || status === "queued") {
            await new Promise((r) => setTimeout(r, 1500));
            const runStatus = await axios.get(
                `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v2",
                    },
                }
            );
            status = runStatus.data.status;
        }

        const messagesResponse = await axios.get(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",
                },
            }
        );

        messages = messagesResponse.data.data;

        return messages[0]?.content?.[0]?.text?.value ?? "Sin respuesta del asistente.";
    } catch (error) {
        if (error.response) {
            console.error("❌ Error al usar el Assistant de OpenAI:");
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("❌ Error desconocido:", error.message);
        }
        return "Lo siento, hubo un error al consultar el asistente.";
    }
}
