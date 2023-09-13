import { Song } from './Song';
import { SongData } from './SongData';

/** A class for loading song data from a URL. */
class SongLoader {
	/** @type {Song} */
	song;

	/** @param {string} sampleUrl - The base URL for loading samples. */
	constructor(sampleUrl) {
		this.sampleUrl = sampleUrl;
	}

	/**
	 * Load song data from a URL and initializes the associated song.
	 * @param {string} songUrl - The URL to load the song data from.
	 * @param {Song} song - The song instance to initialize with the loaded data.
	 */
	load(songUrl, song) {
		this.song = song;
		const songData = new SongData(this.sampleUrl, song);
		const loadVars = new LoadVars();
		const self = this;

		/** @param {boolean} success */
		loadVars.onLoad = function (success) {
			for (const key in self) {
				Logger.log('key ' + key + ' = ' + loadVars[key]);
			}
			if (success && loadVars.status === 0) {
				songData.setData(loadVars);
				song.onSongLoad(true, songData);
			} else {
				song.onSongLoad(false, songData);
			}
		};

		loadVars.load(songUrl);
	}
}

export { SongLoader };
