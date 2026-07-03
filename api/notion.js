export default async function handler(req, res) {

  try {

    return res.status(200).json({
      ok: true,
      message: "API de LifeOS funcionando",
      version: "1.0.0"
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }

}
