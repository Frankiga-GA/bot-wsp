import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  mensajeInicial: String,
  intereses: [String],
  etiquetas: [String],
  conversacion: [
    {
      mensaje: String,
      rol: { type: String, enum: ["cliente", "bot"] },
      fecha: { type: Date, default: Date.now }
    }
  ],
  fechaRegistro: { type: Date, default: Date.now },
  ultimaInteraccion: { type: Date, default: Date.now }
});

export const Lead = mongoose.model("Lead", leadSchema);
