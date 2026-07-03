export default function handler(req, res) {
  res.status(200).json({
    prueba: "ESTE ES EL NUEVO ARCHIVO",
    hora: new Date().toISOString()
  });
}
