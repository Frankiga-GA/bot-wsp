import { handleColorRule } from "../rules/color.rule.js";

const handleIncomingMessage = async (client, message) => {
  const text = message.body.trim().toLowerCase();

  if (text === 'hola') {
    await client.sendText(
      message.from,
      'Hola amigo, soy un bot, elige una opción:\n1.- rojo\n2.- azul\n3.- verde'
    );
    return;
  }

  if (['1', '2', '3'].includes(text)) {
    await handleColorRule(client, message.from, text);
  }
};

export default handleIncomingMessage;
