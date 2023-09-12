import { Logger } from '../util/Logger';
import { Track } from './Track';

class Sample extends Audio {
	/** @type {Track} */
	track;
	/** @type {Number} */
	beatNumber;

	/**
	 * Create a Sample.
	 * @param {string} url - The URL of the sample.
	 */
	constructor(url) {
		super();
		this.url = url;
	}

	/**
	 * Set the track for this sample.
	 * @param {Track} track - The track to set.
	 */
	setTrack(track) {
		this.track = track;
	}

	/**
	 * Called when the sample has loaded.
	 * @param {boolean} success - Whether the sample loaded successfully.
	 */
	onLoad(success) {
		this.track.onSampleLoad(success, this);
	}

	/**
	 * Get the length of the sample in beats.
	 * @returns {number} The sample length in beats.
	 */
	getSampleLength() {
		const duration = this.getDuration();
		if (duration < 2100) {
			return 1;
		}
		if (duration < 4100) {
			return 2;
		}
		if (duration < 6100) {
			return 3;
		}
		if (duration < 8100) {
			return 4;
		}
		throw new Error('Sample is too long: ' + this);
	}

	/**
	 * Play the sample.
	 */
	play() {
		Logger.debug('Playing sample ' + this);
		const sample = this;
		this.onended = function () {
			sample.track.onSampleComplete(this);
		};
		this.src = this.url;
		this.play();
	}

	/**
	 * Get the beat number at which the next sample should be played.
	 * @returns {number} The beat number for the next sample.
	 */
	getNextBeatNumber() {
		return this.beatNumber + this.getSampleLength();
	}

	/**
	 * Get a string representation of the sample.
	 * @returns {string} A string representation of the sample.
	 */
	toString() {
		return 'Audio{' + this.url + '}';
	}

	/**
	 * Load the sample.
	 */
	load() {
		Logger.debug('Loading sample ' + this.url);
		// Load audio from the URL (you can use other audio loading techniques)
		this.src = this.url;
	}
}

export { Sample };
