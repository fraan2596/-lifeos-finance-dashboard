export default function handler(req, res) {
  res.status(200).json({
    prueba: "FUNCIONA",
    fecha: new Date().toISOString()
  });
}
