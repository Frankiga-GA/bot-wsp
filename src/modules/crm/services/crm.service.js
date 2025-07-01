import { Lead } from "./message.model.js";

export const registrarMensajeEnCRM = async (numero, mensaje, rol = "cliente") => {
  try {
    let lead = await Lead.findOne({ numero });

    if (!lead) {
      lead = new Lead({
        numero,
        mensajeInicial: mensaje,
        conversacion: [{ mensaje, rol }],
        etiquetas: ["nuevo"]
      });
    } else {
      lead.conversacion.push({ mensaje, rol });
      lead.ultimaInteraccion = new Date();
    }

    await lead.save();
    console.log(`💾 Lead actualizado: ${numero}`);
  } catch (error) {
    console.error("❌ Error guardando lead:", error.message);
  }
};
