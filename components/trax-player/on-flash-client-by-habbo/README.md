# Habbo Music Player Reverse Engineering

![Habbo Tunes](./docs/img/habbotunes.gif)

This project is a conversion of the Habbo music playback mechanism from ActionScript to JavaScript (ES Module). It is based on the version "Habbo-PRODUCTION-201607262204-86871104" (flash client). Please note that this project is intended for educational purposes and is not meant to be used as a direct source code for any production systems.

## Project Overview

The goal of this project is to convert and understand the music playback system used in Habbo, a popular online virtual world game. By reverse engineering the ActionScript code and converting it to JavaScript, we aim to gain insights into how music is played within the game.

This project is primarily focused on:

- Converting ActionScript code to JavaScript (ES Module).
- Analyzing the music data format and storage.
- Understanding the playback algorithms and mechanisms.
- Documenting the system's behavior and interactions.

## Disclaimer

This reverse engineering project is purely educational and for research purposes. It is not intended to be used for any commercial or production applications. The code and information obtained through this project should be used responsibly and in compliance with relevant laws and regulations.

## Contributing

While this project is primarily focused on reverse engineering and conversion, we welcome contributions, insights, and discussions from the open-source community. If you have expertise in JavaScript, reverse engineering, or insights into how Habbo's music system works, please feel free to contribute.

## Conversion Progress

- `HabboMusicController` - **Unfinished**
- `HabboMusicEvents` - **Unfinished**
- `HabboSoundManagerFlash10` - **Unfinished**
  - ... other files only imported in it ... - **Not Started**
- `JukeboxPlayListController` - **Not Started**
- `LoopInfo` - **Done**
- `SongBase` - **Unfinished**
- `SongObject` - **Unfinished**
- `SoundMachinePlayListController` - **Not Started**
- `TraxChannel` - **Done**
- `TraxData` - **Done**
- `TraxNote` - **Done**
- `TraxSample` - **Done**
- `TraxSampleManager` - **Not Started**
- `TraxSequencer` - **Done**
- `TraxSongData` - **Done**
- `TraxSongEvent` - **Not Started**


## Inspiration

The main purpose of this project is to inspire developers and researchers to explore and experiment with music playback systems in their own projects. While we do not endorse using Habbo's code directly, we encourage using the knowledge gained here to create innovative and original implementations in your applications.

## License

This project is released under the [MIT License](./LICENSE.md). Please review the license terms before using or contributing to the project.

---

**Disclaimer:** This project is not affiliated with, endorsed, or sponsored by Sulake Corporation Oy or any of its subsidiaries or affiliates. "Habbo" is a registered trademark of Sulake Corporation Oy.
