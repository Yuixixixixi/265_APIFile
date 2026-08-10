const db = require("../models");

const Genre = db.Genre;

async function getAll(req, res) {
  try {
    const genres = await Genre.findAll();

    return res.status(200).json(genres);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function create(req, res) {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json({
        message: "Nama genre wajib diisi."
      });
    }

    const existingGenre = await Genre.findOne({
      where: { nama }
    });

    if (existingGenre) {
      return res.status(400).json({
        message: "Genre sudah ada."
      });
    }

    const genre = await Genre.create({
      nama,
      deskripsi
    });

    return res.status(201).json({
      message: "Genre berhasil ditambahkan.",
      data: genre
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;

    const genre = await Genre.findByPk(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre tidak ditemukan."
      });
    }

    await genre.update({
      nama,
      deskripsi
    });

    return res.status(200).json({
      message: "Genre berhasil diperbarui.",
      data: genre
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const genre = await Genre.findByPk(id);

    if (!genre) {
      return res.status(404).json({
        message: "Genre tidak ditemukan."
      });
    }

    const komik = await genre.getKomik();

    if (komik.length > 0) {
      return res.status(400).json({
        message: "Genre masih digunakan oleh komik dan tidak dapat dihapus."
      });
    }

    await genre.destroy();

    return res.status(200).json({
      message: "Genre berhasil dihapus."
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  getAll,
  create,
  update,
  remove
};