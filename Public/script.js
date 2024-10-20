const pageType = document
  .querySelector('meta[name="page"]')
  .getAttribute("content");

switch (pageType) {
  case "home":
    console.log("Ini adalah Home Page");
    HomeFunction();
    break;

  case "lyrics":
    console.log("Ini adalah Lyrics Page");
    LyricsFunction();
    break;

  case "create":
    console.log("Ini adalah Create Page");
    CreateFunction();
    break;

  default:
    console.log("This page does not contain script.");
    break;
}

function HomeFunction() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchType = document.getElementById("search-type");
  const songList = document.getElementById("song-list");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    const type = searchType.value;
    loadSongs(query, type);
  });

  function loadSongs(query = "", type = "artist") {
    fetch("/songs")
      .then((response) => response.json())
      .then((files) => {
        songList.innerHTML = "";
        files.forEach((file) => {
          fetch(`/songs/${file}`)
            .then((response) => response.json())
            .then((song) => {
              const searchField = type === "artist" ? song.artist : song.title;
              if (query === "" || searchField.toLowerCase().includes(query)) {
                const songTitle = song.title.replace(/\s+/g, "-").toLowerCase();
                const li = document.createElement("li");
                li.className = "song-item";

                const img = document.createElement("img");
                const albumCover = song.albumCover
                  ? `/uploads/${song.albumCover}`
                  : "/uploads/default";

                fetch(albumCover).then((response) => {
                  if (response.ok) {
                    img.src = albumCover;
                  } else {
                    img.src = "/uploads/default";
                  }
                  img.alt = `${song.title} album cover`;
                });

                const link = document.createElement("a");
                link.href = `lyrics.html?title=${songTitle}`;
                link.textContent = `${song.title} - ${song.artist}`;

                li.appendChild(img);
                li.appendChild(link);
                songList.appendChild(li);
              }
            })
            .catch((error) => console.error("Error loading song:", error));
        });
      })
      .catch((error) => console.error("Error loading song list:", error));
  }
  loadSongs();
}
function LyricsFunction() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get("title");
  const fileName = title.toLowerCase().replace(/\s+/g, "-") + ".json";
  const soundcloudPlayer = document.getElementById("soundcloud-player");
  const soundcloudWidgetContainer = document.getElementById(
    "soundcloud-widget-container"
  );
  const youtubeWidgetContainer = document.getElementById(
    "youtube-widget-container"
  );
  let songData = null;
  let activeTranslations = [];
  let isSingleText = true;
  let showOriginalLyrics = true;
  let translationVisibility = {};
  fetch(`../songs/${fileName}`)
    .then((response) => response.json())
    .then((song) => {
      songData = song;
      document.title = `${song.title} - ${song.artist}`;
      document.getElementById("song-title").textContent = song.title;
      document.getElementById("song-artist").textContent = `${song.artist}`;
      document.getElementById(
        "song-upload-date"
      ).textContent = `Upload Date: ${song.uploadDate}`;
      const albumCover = song.albumCover
        ? `/uploads/${song.albumCover}`
        : "/uploads/default";
      document.getElementById("favicon").href = albumCover;
      document.getElementById("album-cover").src = albumCover;
      document.getElementById("background-cover").src = albumCover;
      displaySingleText();
      setupTranslationOptions();
      const soundcloudUrl = song.soundcloudUrl;
      if (soundcloudUrl) {
        const embedUrl = soundcloudUrl;
        soundcloudWidgetContainer.querySelector("iframe").src = `${embedUrl}`;
        soundcloudWidgetContainer.style.display = "block";
      } else {
        soundcloudWidgetContainer.style.display = "none";
      }
      const youtubeUrl = song.youtubeUrl;
      if (youtubeUrl) {
        const embedYoutubeUrl = youtubeUrl.replace(
          "https://www.youtube.com/watch?v=",
          "https://www.youtube.com/embed/"
        );
        youtubeWidgetContainer.querySelector("iframe").src = embedYoutubeUrl;
      } else {
        youtubeWidgetContainer.style.display = "none";
      }
    })
    .catch((error) => {
      document.getElementById("song-title").textContent = "Song not found";
      console.error("Error loading song lyrics:", error);
      soundcloudWidgetContainer.style.display = "none";
    });

  function displaySingleText() {
    const lyricsPanel = document.getElementById("lyrics-panel");
    const translationsPanel = document.getElementById("translations-panel");
    const alignPanel = document.getElementById("text-alignment-dropdown");

    lyricsPanel.innerHTML = "";
    translationsPanel.innerHTML = "";

    translationsPanel.classList.add("hidden");
    alignPanel.classList.remove("hidden");
    lyricsPanel.classList.remove("hidden");
    lyricsPanel.classList.add("single-lyrics");

    const lyricsLines = songData.lyrics.split("\n");

    lyricsLines.forEach((line, index) => {
      const lineContainer = document.createElement("div");
      lineContainer.classList.add("line-container");

      if (line.trim() === "") {
        const emptyDiv = document.createElement("div");
        emptyDiv.textContent = "\u00A0";
        lineContainer.appendChild(emptyDiv);
      } else {
        if (showOriginalLyrics) {
          const originalLineDiv = document.createElement("div");
          originalLineDiv.textContent = line;
          originalLineDiv.classList.add("original-line");
          lineContainer.appendChild(originalLineDiv);
        }

        if (songData.translations && activeTranslations.length > 0) {
          activeTranslations.forEach((translationIndex) => {
            const translation = songData.translations[translationIndex];
            const translationLines = translation.lyrics.split("\n");

            if (translationLines[index]) {
              const translationDiv = document.createElement("div");
              translationDiv.textContent = translationLines[index];
              translationDiv.classList.add("translation-line");

              if (
                !showOriginalLyrics &&
                activeTranslations[0] === translationIndex
              ) {
                translationDiv.classList.add("original-line");
                translationDiv.classList.remove("translation-line");
              }

              if (!translationVisibility[translationIndex]) {
                translationDiv.classList.add("hidden");
              }

              lineContainer.appendChild(translationDiv);
            }
          });
        }
      }
      lyricsPanel.appendChild(lineContainer);
    });
  }

  function displaySideBySide() {
    const lyricsPanel = document.getElementById("lyrics-panel");
    const translationsPanel = document.getElementById("translations-panel");
    const alignPanel = document.getElementById("text-alignment-dropdown");
    lyricsPanel.innerHTML = "";
    translationsPanel.innerHTML = "";
    translationsPanel.classList.remove("hidden");
    alignPanel.classList.add("hidden");
    lyricsPanel.classList.add("hidden");
    translationsPanel.classList.remove("hidden");
    const lyricsLines = songData.lyrics.split("\n");

    lyricsLines.forEach((line, index) => {
      const containerDiv = document.createElement("div");

      if (showOriginalLyrics) {
        const originalDiv = document.createElement("div");
        originalDiv.classList.add("lyrics-box");
        originalDiv.textContent = line.trim() ? line : "\u00A0";
        containerDiv.appendChild(originalDiv);
      }

      songData.translations.forEach((translation, transIndex) => {
        if (activeTranslations.includes(transIndex)) {
          const translationDiv = document.createElement("div");
          translationDiv.classList.add("lyrics-box");
          const translationLines = translation.lyrics.split("\n");

          if (translationLines[index]) {
            translationDiv.textContent = translationLines[index].trim()
              ? translationLines[index]
              : "\u00A0";
          } else {
            translationDiv.textContent = "\u00A0";
          }

          if (!translationVisibility[transIndex])
            translationDiv.classList.add("hidden");
          containerDiv.appendChild(translationDiv);
        }
      });

      translationsPanel.appendChild(containerDiv);
    });

    adjustSideBySideLayout();
  }

  function adjustSideBySideLayout() {
    const translationBoxes = document.querySelectorAll(
      "#translations-panel .lyrics-box"
    );
    const columnCount = translationBoxes.length;
    translationBoxes.forEach((box) => {
      box.classList.remove("two-lyrics", "three-lyrics");
      if (columnCount === 1) {
        box.style.width = "100%";
      } else if (columnCount === 2) {
        box.style.width = "50%";
      } else if (columnCount === 3) {
        box.style.width = "33.33%";
      }
    });
  }

  function setupTranslationOptions() {
    const translationOptionsDiv = document.getElementById(
      "translation-options"
    );
    translationOptionsDiv.innerHTML = "";
    songData.translations.forEach((translation, index) => {
      const translationOptionDiv = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `translation-toggle-${index}`;
      checkbox.addEventListener("change", () => {
        toggleTranslation(index);
      });
      const label = document.createElement("label");
      label.textContent = translation.language;
      label.setAttribute("for", `translation-toggle-${index}`);
      translationOptionDiv.appendChild(checkbox);
      translationOptionDiv.appendChild(label);
      translationOptionsDiv.appendChild(translationOptionDiv);
    });
  }

  function toggleTranslation(index) {
    translationVisibility[index] = !translationVisibility[index];
    if (!activeTranslations.includes(index)) {
      activeTranslations.push(index);
    } else {
      activeTranslations = activeTranslations.filter((i) => i !== index);
    }
    if (isSingleText) {
      displaySingleText();
    } else {
      displaySideBySide();
    }
  }
  document.getElementById("show-original").addEventListener("change", (e) => {
    showOriginalLyrics = e.target.checked;
    if (isSingleText) {
      displaySingleText();
    } else {
      displaySideBySide();
    }
  });
  document
    .getElementById("single-text-button")
    .addEventListener("click", () => {
      isSingleText = true;
      document.getElementById("lyrics-panel").classList.remove("hidden");
      document.getElementById("translations-panel").classList.add("hidden");
      displaySingleText();
    });
  document
    .getElementById("side-by-side-button")
    .addEventListener("click", () => {
      isSingleText = false;
      document.getElementById("lyrics-panel").classList.add("hidden");
      document.getElementById("translations-panel").classList.remove("hidden");
      displaySideBySide();
    });
  document
    .getElementById("text-alignment-dropdown")
    .addEventListener("change", (e) => {
      const alignment = e.target.value;
      document.querySelector(".single-lyrics").style.textAlign = alignment;
    });
  const widgetContainer = document.getElementById(
    "soundcloud-widget-container"
  );
  const toggleButton = document.getElementById("toggle-sticky");
  let isSticky = true;
  toggleButton.addEventListener("click", () => {
    if (isSticky) {
      widgetContainer.style.position = "relative";
      toggleButton.textContent = "Enable floating";
    } else {
      widgetContainer.style.position = "sticky";
      widgetContainer.style.bottom = "0";
      toggleButton.textContent = "Disable";
    }
    isSticky = !isSticky;
  });
}

function CreateFunction() {
  document
    .getElementById("add-translation")
    .addEventListener("click", function () {
      const translationDiv = document.createElement("div");
      translationDiv.className = "translation-group";

      const langInput = document.createElement("input");
      langInput.type = "text";
      langInput.name = "translation-language";
      langInput.placeholder = "Language Name";
      langInput.required = true;

      const lyricsTextarea = document.createElement("textarea");
      lyricsTextarea.name = "translation-lyrics";
      lyricsTextarea.placeholder = "Translated Lyrics";
      lyricsTextarea.rows = 3;
      lyricsTextarea.required = true;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", function () {
        translationDiv.remove();
      });

      translationDiv.appendChild(langInput);
      translationDiv.appendChild(lyricsTextarea);
      translationDiv.appendChild(removeButton);

      document.getElementById("translations").appendChild(translationDiv);
    });

  document
    .getElementById("song-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const translations = [];

      const translationGroups = document.querySelectorAll(".translation-group");
      translationGroups.forEach((group) => {
        const lang = group.querySelector(
          'input[name="translation-language"]'
        ).value;
        const translatedLyrics = group.querySelector(
          'textarea[name="translation-lyrics"]'
        ).value;

        translations.push({
          language: lang,
          lyrics: translatedLyrics,
        });
      });

      formData.append("translations", JSON.stringify(translations));

      fetch("/save-song", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Song saved successfully!");
            const songTitle = document.getElementById("title").value;
            window.location.href = `lyrics.html?title=${encodeURIComponent(
              songTitle
            )}`;
          } else {
            alert("Error saving song.");
          }
        })
        .catch((error) => {
          console.error("Error saving song:", error);
        });
    });
}
