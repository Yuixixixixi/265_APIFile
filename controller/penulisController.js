const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Penulis = db.Penulis;

async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi."
      });
    }

    const existingPenulis = await Penulis.findOne({
      where: { email }
    });

    if (existingPenulis) {
      return res.status(400).json({
        message: "Email sudah terdaftar."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const penulis = await Penulis.create({
      nama,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: {
        id: penulis.id,
        nama: penulis.nama,
        email: penulis.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi."
      });
    }

    const penulis = await Penulis.findOne({
      where: { email }
    });

    if (!penulis) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      penulis.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Email atau password salah."
      });
    }

    const token = jwt.sign(
  {
    id: penulis.id,
    nama: penulis.nama,
    email: penulis.email
  },
  process.env.JWT_SECRET || "rahasia_default",
  {
    expiresIn: process.env.JWT_EXPIRES || "24h" // <- Tambahkan || "24h" sebagai default
  }
);

    return res.status(200).json({
      message: "Login berhasil.",
      token
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  register,
  login
};