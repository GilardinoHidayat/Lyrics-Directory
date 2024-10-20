const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

const upload = multer({ dest: path.join(__dirname, "../public/uploads/") });

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const songsFolder = path.join(__dirname, "../songs");
app.use("/songs", express.static(songsFolder));

app.get("/songs", (req, res) => {
  fs.readdir(songsFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading songs directory" });
    }

    const songFiles = files.filter((file) => file.endsWith(".json"));
    res.json(songFiles);
  });
});

app.post("/save-song", upload.single("albumCover"), (req, res) => {
  const {
    title,
    artist,
    uploadDate = new Date().toISOString().split("T")[0],
    lyrics,
    translations,
    soundcloudUrl,
    youtubeUrl,
  } = req.body;
  const albumCover = req.file ? req.file.filename : "";

  let parsedTranslations = [];
  if (translations) {
    try {
      parsedTranslations = JSON.parse(translations);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid translations format" });
    }
  }

  const songData = {
    title,
    artist,
    uploadDate,
    lyrics,
    albumCover,
    translations: parsedTranslations,
    soundcloudUrl,
    youtubeUrl,
  };

  const fileName = title.toLowerCase().replace(/\s+/g, "-") + ".json";
  const filePath = path.join(songsFolder, fileName);

  fs.writeFile(filePath, JSON.stringify(songData, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error saving song." });
    }
    res.json({ success: true });
  });
});

app.get("/combine-songs", (req, res) => {
  fs.readdir(songsFolder, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading the songs directory");
    }

    let combinedSongs = [];

    files.forEach((file) => {
      if (path.extname(file) === ".json") {
        const filePath = path.join(songsFolder, file);
        const songData = fs.readFileSync(filePath, "utf8");
        const song = JSON.parse(songData);

        const formattedSong = {
          title: song.title,
          artist: song.artist,
          uploadDate: song.uploadDate,
          albumCover: song.albumCover,
          lyrics: [],
          translations: [],
          soundcloudLink: song.soundcloudUrl,
          youtubeLink: song.youtubeUrl,
        };

        const originalLyrics = song.lyrics
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);
        originalLyrics.forEach((line, index) => {
          formattedSong.lyrics.push({
            original: line,
            translation: song.translations[index]?.lyrics,
          });
        });

        song.translations.forEach((translation) => {
          formattedSong.translations.push({
            language: translation.language,
            lines: translation.lyrics
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line),
          });
        });

        combinedSongs.push(formattedSong);
      }
    });
    const combinedFilePath = path.join(__dirname, "../public", "song.json");
    fs.writeFileSync(combinedFilePath, JSON.stringify(combinedSongs, null, 2));

    res.send(
      "Songs combined successfully. You can check song.json in the public folder."
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
