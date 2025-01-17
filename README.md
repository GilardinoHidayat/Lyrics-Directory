# Lyrics Display Web Application

This project is a web application that allows users to view song lyrics and their translations. The application has two main pages: a home page where users can select a song, and a lyrics page that displays the selected song's lyrics along with any available translations.
Here to see a public only website preview [Preview Page (without node.js)](https://lyricsdirectory.netlify.app/)

## Features

- **Song Selection Page**: Display a list of available songs to choose from.
- **Lyrics Display**: Shows the lyrics of the selected song.
- **Multiple Translations**: If available, translations can be shown side by side with the original lyrics or displayed beneath each line.
- **Interactive Layout Modes**:
  - **Single Text Mode**: Displays the original lyrics with an optional translation underneath each line.
  - **Side by Side Mode**: Displays up to three versions of the lyrics (original and two translations) side by side in separate columns.
- **Responsive Design**: Adjusts the layout dynamically based on the number of translations displayed.
- **Album Art**: Displays album art with the song title, artist, and upload date.
- **Customizable Alignment**: Allows text alignment for single text mode (left or center).
- **Hover Effects**: In side by side mode, hovering over a line highlights the corresponding lines of lyrics and translations.

## Project Structure
```php
.
├── server/                  # Node.js server files
│   ├── server.js            # Main server script
├── songs/                   # Folder containing song data (JSON format)
├── public/                  # Publicly accessible files (HTML, CSS, JS)
│   ├── uploads/             # Folder for album images and default image
│   ├── index.html           # Home page
│   ├── lyrics.html          # Lyrics display page
│   ├── style.css            # CSS styles
│   ├── script.js            # Main JavaScript functionality
├── LICENSE                  # MIT License file
└── README.md                # This file

```
## Getting Started

### Prerequisites

To run this project locally, you'll need to have:

- Node.js installed on your system.
- A package manager like npm (comes with Node.js) or yarn.

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/GilardinoHidayat/Lyrics-Directory.git
    cd Lyrics-Directory
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the server**:

    ```bash
    node server/server.js
    ```

4. **Open the app in your browser**:

    Visit `http://localhost:3000` to open the application.

### File Upload

To upload a new song with its lyrics and translations:

- Go to `http://localhost:3000/create.html` to access the form.
- Enter song details (song title, artist, upload date, lyrics, and optional translations).
- After submitting, the song will be saved in the `songs/` folder.

### Viewing Songs

1. Access the homepage (`http://localhost:3000/`) to see the list of available songs.
2. Click on any song title to view its lyrics and translations.

## JSON File Format for Songs

Each song is stored as a JSON file in the `songs/` directory. Below is the structure of the JSON file for a single song:

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "uploadDate": "2023-01-01",
  "lyrics": {
    "original": "Original lyrics line 1\nOriginal lyrics line 2\n...",
    "translations": {
      "translation1": {
        "language": "English",
        "text": "Translation line 1\nTranslation line 2\n..."
      },
      "translation2": {
        "language": "Spanish",
        "text": "Traducción línea 1\nTraducción línea 2\n..."
      }
    }
  },
  "albumCover": "images/album-art.jpg"
}
```

## JSON Attributes
- title: The title of the song.
- artist: The name of the artist.
- uploadDate: The date the song was uploaded.
- lyrics.original: The original lyrics, separated by \n for each new line.
- lyrics.translations.translation1.language: The name of the language of the translation.
- lyrics.translations.translation1.text: The translated lyrics, with each line separated by \n.
- albumCover: The path to the album cover image.

## Available Routes
- Home Page (/): Displays a list of songs.
- Create Page (/create.html): Form to add new songs.
- Lyrics Page (/lyrics.html?title=song-title): Displays the lyrics of the selected song.
- Song JSON API (/songs/song-title.json): Retrieves the JSON data for a specific song.
  
## Additional Features
- Fallback Album Cover: If no album cover is provided for a song, a default cover image is displayed.
- Dynamic Searching: Search for songs by artist name.

## License
This project is open-source and available under the MIT License.

## Disclaimer
Please note that this website is only intended for displaying song lyrics and related metadata (such as title, artist, release date, etc.). The project does not provide any service for storing or processing sensitive information.

- **Do not enter personal or sensitive data when** using the song creation feature or when submitting lyrics. All data submitted and processed in JSON format is accessible to the public, and the security of the data entered into JSON cannot be guaranteed.
- The JSON format used to store song and lyric data is strictly for the purpose of displaying content on the website and is not protected by encryption or other security mechanisms.

This website does not store or handle user data outside the context of displaying lyrics and is not responsible for any consequences resulting from the input of inappropriate data.
Please use this website responsibly and only for its intended purpose: publishing song lyrics.
