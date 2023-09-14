import { Logger } from './Logger'; // Make sure to import the Logger class correctly
import { TrackData } from './TrackData';

/**
 * Represents data about an audio sample.
 */
class SampleData {
	/**
	 * Creates a new instance of SampleData.
	 * @param {string} url - The URL of the sample.
	 * @param {number} length - The length of the sample.
	 */
	constructor(url, length) {
		this.url = url;
		this.length = length;
		this.success = false;
	}

	/**
	 * Sets the track data associated with this sample.
	 * @param {TrackData} trackData - The track data to set.
	 */
	setTrackData(trackData) {
		this.trackData = trackData;
	}

	/**
	 * Loads the sample from its URL.
	 */
	load() {
		Logger.debug('Loading sample from URL: ' + this.url);
		this.sound = new Audio();
		const sampleData = this;
		this.sound.onload = function () {
			sampleData.success = true;
			sampleData.onSampleDataLoad(true);
		};
		this.sound.onerror = function () {
			sampleData.success = false;
			sampleData.onSampleDataLoad(false);
		};
		this.sound.src = this.url;
	}

	/**
	 * Checks if the sample is loaded.
	 * @returns {boolean} - True if the sample is loaded, false otherwise.
	 */
	isLoaded() {
		return this.success;
	}

	/**
	 * Converts the SampleData instance to a string representation.
	 * @returns {string} - A string representation of the SampleData.
	 */
	toString() {
		return `Sample{url: ${this.url}, length: ${this.length}}`;
	}

	/**
	 * Calculates the repeat count based on the sample duration and length.
	 * @returns {number} - The calculated repeat count.
	 * @throws {Error} - If the sample is not loaded.
	 */
	getRepeatCount() {
		if (!this.success) {
			throw new Error(
				'Sample has to be loaded before we can determine the repeat count!'
			);
		} else {
			const duration = this.sound.duration * 1000; // Convert to milliseconds
			let repeatLength = 0;

			if (duration < 2100) {
				repeatLength = 2000;
			} else if (duration < 4100) {
				repeatLength = 4000;
			} else if (duration < 6100) {
				repeatLength = 6000;
			} else {
				repeatLength = 8000;
			}

			const repeatCount = (this.length * 2000) / repeatLength;
			Logger.debug(
				`Sample length: ${duration}ms repeat length: ${repeatLength}ms => repeat: ${repeatCount}`
			);
			return repeatCount;
		}
	}

	/**
	 * Gets the URL of the sample.
	 * @returns {string} - The URL of the sample.
	 */
	getUrl() {
		return this.url;
	}

	/**
	 * Called when the sample data has finished loading.
	 * @param {boolean} success - Indicates whether the loading was successful.
	 */
	onSampleDataLoad(success) {
		Logger.debug(`Sample loaded ok? ${this.success} ${this}`);
		this.trackData.onSampleDataLoad(this.success);
	}
}

// Export the SampleData class for use in other modules
export { SampleData };
