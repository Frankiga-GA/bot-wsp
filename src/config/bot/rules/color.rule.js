export const handleColorRule = async (sock, from, option) => {
  let response = "";

  switch (option) {
    case "1":
      response = "Perfecto, te hablaré del color rojo.";
      break;
    case "2":
      response = "Perfecto, te hablaré del color azul.";
      break;
    case "3":
      response = "Perfecto, te hablaré del color verde.";
      break;
    default:
      response = "Opción no válida.";
  }

  await sock.sendMessage(from, { text: response });
};
