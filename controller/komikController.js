const db = require("../models");

const Komik = db.Komik;
const Penulis = db.Penulis;
const Genre = db.Genre;

// genre_ids dari form-data bisa berupa "1,2" atau ["1","2"] -> jadikan array angka
function parseGenreIds(raw) {
  if (raw === undefined || raw === null || raw === "") return [];
  if (Array.isArray(raw)) return raw.map(Number).filter(Boolean);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[")) {
      try { return JSON.parse(trimmed).map(Number).filter(Boolean); } catch (e) { return []; }
    }
    return trimmed.split(",").map(s => Number(s.trim())).filter(Boolean);
  }
  return [Number(raw)].filter(Boolean);
}

const includeRelasi = [
  { model: Penulis, as: "penulis", attributes: ["id", "nama", "email"] },
  { model: Genre, as: "genre", through: { attributes: [] } }
];

async function getAll(req, res) {
  try {
    const komik = await Komik.findAll({ include: includeRelasi });
    return res.status(200).json(komik);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { judul, sinopsis, tahun_terbit, penulis_id, genre_ids } = req.body;

    if (!judul || !sinopsis || !tahun_terbit || !penulis_id) {
      return res.status(400).json({
        message: "judul, sinopsis, tahun_terbit, dan penulis_id wajib diisi."
      });
    }

    const penulis = await Penulis.findByPk(penulis_id);
    if (!penulis) {
      return res.status(404).json({ message: "Penulis tidak ditemukan." });
    }

    const gambar = req.file ? req.file.filename : null;

    const komik = await Komik.create({
      judul,
      sinopsis,
      tahun_terbit,
      penulis_id,
      gambar
    });

    const ids = parseGenreIds(genre_ids);
    if (ids.length > 0) {
      const genres = await Genre.findAll({ where: { id: ids } });
      await komik.setGenre(genres);
    }

    const result = await Komik.findByPk(komik.id, { include: includeRelasi });

    return res.status(201).json({
      message: "Komik berhasil ditambahkan.",
      data: result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { judul, sinopsis, tahun_terbit, penulis_id, genre_ids } = req.body;

    const komik = await Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ message: "Komik tidak ditemukan." });
    }

    if (penulis_id) {
      const penulis = await Penulis.findByPk(penulis_id);
      if (!penulis) {
        return res.status(404).json({ message: "Penulis tidak ditemukan." });
      }
    }

    const gambar = req.file ? req.file.filename : komik.gambar;

    await komik.update({
      judul: judul ?? komik.judul,
      sinopsis: sinopsis ?? komik.sinopsis,
      tahun_terbit: tahun_terbit ?? komik.tahun_terbit,
      penulis_id: penulis_id ?? komik.penulis_id,
      gambar
    });

    if (genre_ids !== undefined) {
      const genres = await Genre.findAll({ where: { id: parseGenreIds(genre_ids) } });
      await komik.setGenre(genres);
    }

    const result = await Komik.findByPk(komik.id, { include: includeRelasi });

    return res.status(200).json({
      message: "Komik berhasil diperbarui.",
      data: result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const komik = await Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ message: "Komik tidak ditemukan." });
    }

    await komik.setGenre([]);
    await komik.destroy();

    return res.status(200).json({ message: "Komik berhasil dihapus." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, create, update, remove };
