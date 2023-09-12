import { Logger } from './Logger';
import { Song } from './Song';
import { TrackData } from './TrackData';

/** Represents the data of a song, including its tracks and metadata. */
class SongData {
	/**
	 * @param {string} sampleUrl - The base URL for loading samples.
	 * @param {Song} song - The associated song.
	 */
	constructor(sampleUrl, song) {
		this.sampleUrl = sampleUrl;
		this.song = song;
	}

	/**
	 * Sets the data for the SongData instance.
	 * @param {LoadVars} loadVars - The data loaded from external sources.
	 */
	setData(loadVars) {
		this.track1 = new TrackData(this.sampleUrl, loadVars.track1);
		this.track1.setSongData(this);
		this.track2 = new TrackData(this.sampleUrl, loadVars.track2);
		this.track2.setSongData(this);
		this.track3 = new TrackData(this.sampleUrl, loadVars.track3);
		this.track3.setSongData(this);
		this.track4 = new TrackData(this.sampleUrl, loadVars.track4);
		this.track4.setSongData(this);
		this.name = loadVars.name;
		this.author = loadVars.author;
	}

	/** Loads samples for all tracks in the song data. */
	loadSamples() {
		Logger.debug('Loading tracks');
		if (!this.track1.isLoaded()) {
			Logger.debug('Loading track 1');
			this.track1.loadSamples();
			return undefined;
		}
		if (!this.track2.isLoaded()) {
			Logger.debug('Loading track 2');
			this.track2.loadSamples();
			return undefined;
		}
		if (!this.track3.isLoaded()) {
			Logger.debug('Loading track 3');
			this.track3.loadSamples();
			return undefined;
		}
		if (!this.track4.isLoaded()) {
			Logger.debug('Loading track 4');
			this.track4.loadSamples();
			return undefined;
		}
		Logger.debug('All tracks are loaded');
		this.loaded = true;
		this.song.onSongDataLoad(true, this);
	}

	/**
	 * Called when track data has finished loading.
	 * @param {boolean} success - Indicates whether the loading was successful.
	 */
	onTrackDataLoad(success) {
		if (success) {
			this.loadSamples();
		} else {
			this.song.onSongDataLoad(false, this);
		}
	}

	/**
	 * Gets the sample URLs for Track 1.
	 * @returns {Array<string>} - An array of sample URLs for Track 1.
	 */
	getTrack1() {
		return this.track1.getSampleUrls();
	}

	/**
	 * Gets the sample URLs for Track 2.
	 * @returns {Array<string>} - An array of sample URLs for Track 2.
	 */
	getTrack2() {
		return this.track2.getSampleUrls();
	}

	/**
	 * Gets the sample URLs for Track 3.
	 * @returns {Array<string>} - An array of sample URLs for Track 3.
	 */
	getTrack3() {
		return this.track3.getSampleUrls();
	}

	/**
	 * Gets the sample URLs for Track 4.
	 * @returns {Array<string>} - An array of sample URLs for Track 4.
	 */
	getTrack4() {
		return this.track4.getSampleUrls();
	}

	/**
	 * Gets the name of the song.
	 * @returns {string} - The name of the song.
	 */
	getName() {
		return this.name;
	}

	/**
	 * Gets the author of the song.
	 * @returns {string} - The author of the song.
	 */
	getAuthor() {
		return this.author;
	}

	/**
	 * Checks if the song data is loaded.
	 * @returns {boolean} - True if the song data is loaded, false otherwise.
	 */
	isLoaded() {
		return this.loaded;
	}
}

export { SongData };
