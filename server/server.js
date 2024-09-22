const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Konfigurasi multer untuk upload file
const upload = multer({ dest: path.join(__dirname, '../public/uploads/') });

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder songs
app.use('/songs', express.static(path.join(__dirname, '../songs')));

// Endpoint untuk mendapatkan daftar lagu dari folder songs
app.get('/songs', (req, res) => {
    const songsDir = path.join(__dirname, '../songs');
    
    // Baca semua file di folder songs
    fs.readdir(songsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading songs directory' });
        }

        // Filter file JSON
        const songFiles = files.filter(file => file.endsWith('.json'));
        res.json(songFiles); // Kirim daftar file JSON
    });
});

// Endpoint untuk menyimpan data lagu baru
app.post('/save-song', upload.single('albumCover'), (req, res) => {
    const { title, artist, uploadDate = new Date().toISOString().split('T')[0], lyrics, translations } = req.body;
    const albumCover = req.file ? req.file.filename : ''; // Ambil nama file dari upload

    let parsedTranslations = [];
    if (translations) {
        try {
            parsedTranslations = JSON.parse(translations);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid translations format' });
        }
    }

    const songData = {
        title,
        artist,
        uploadDate,
        lyrics,
        albumCover,
        translations: parsedTranslations // Simpan terjemahan
    };

    const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.json';
    const filePath = path.join(__dirname, '../songs', fileName);

    fs.writeFile(filePath, JSON.stringify(songData, null, 2), err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saving song.' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
