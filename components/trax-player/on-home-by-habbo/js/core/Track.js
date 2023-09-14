import { Logger } from './Logger';
import { Sample } from './Sample';
import { Song } from './Song';

/** Represents a track that contains samples to be played in a song. */
class Track {
	/** The number of samples that have been loaded. */
	samplesLoaded = 0;

	/** The length of the track in beats. */
	trackLength = 0;

	/** The identifier counter for the track. */
	static trackIdIndex = 1;

	/**
	 * The unique identifier for the track.
	 * @type {number}
	 */
	trackId;

	/** @type {Sample[]} */
	samples;

	/** @type {Sample} */
	currentSample;

	/* Creates a new instance of Track associated with a movie clip. */
	constructor() {
		this.samples = [];
		Track.trackIdIndex = Track.trackIdIndex + 1;
		this.trackId = Track.trackIdIndex;
	}

	/**
	 * Sets the song to which this track belongs.
	 * @param {Song} song - The song to which this track belongs.
	 */
	setSong(song) {
		this.song = song;
	}

	/**
	 * Gets the length of the track in seconds.
	 * @returns {number} The length of the track in seconds.
	 */
	getTrackLengthInSeconds() {
		return this.trackLength * 2; // Assuming each beat is 2 seconds long
	}

	/**
	 * Adds a sample with the specified URL to the track.
	 * @param {string} url - The URL of the sample to add.
	 */
	addSample(url) {
		Logger.debug('Adding sample from URL: ' + url);
		const sample = new Sample(url);
		sample.setTrack(this);
		this.samples.push(sample);
	}

	/**
	 * Loads all samples in the track.
	 */
	loadSamples() {
		for (const sample of this.samples) {
			sample.load();
		}
	}

	/**
	 * Adds multiple samples to the track from an array of URLs.
	 * @param {string[]} urls - An array of sample URLs to add.
	 */
	addSamples(urls) {
		for (const url of urls) {
			this.addSample(url);
		}
	}

	/**
	 * Plays the track.
	 */
	play() {
		this.currentSample.play();
		this.trackComplete = false;
	}

	/**
	 * Stops playback of the track.
	 */
	stop() {
		this.currentSample.stop();
		this.currentSample = this.firstSample;
	}

	/**
	 * Checks if the track is ready to play at the specified beat number.
	 * @param {number} beatNumber - The beat number to check.
	 * @returns {boolean} True if the track is ready to play at the specified beat number, otherwise false.
	 */
	isReadyForBeat(beatNumber) {
		if (this.currentSample.getNextBeatNumber() > beatNumber) {
			return true;
		}
		return this.soundComplete;
	}

	/**
	 * Plays a beat of the track at the specified beat number.
	 * @param {number} beatNumber - The beat number to play.
	 */
	playBeat(beatNumber) {
		if (beatNumber === this.currentSample.getNextBeatNumber()) {
			this.currentSample = this.currentSample.nextSample;
			Logger.debug(
				this.trackId +
					' Playing sample on beat: ' +
					beatNumber +
					' ' +
					this.currentSample
			);
			Logger.debug(
				this.trackId +
					' Next sample on beat: ' +
					this.currentSample.getNextBeatNumber()
			);
			this.currentSample.play();
		}
	}

	/**
	 * Handles the callback when a sample is loaded.
	 * @param {boolean} success - Whether the sample was loaded successfully.
	 * @param {Sample} sample - The loaded sample.
	 */
	onSampleLoad(success, sample) {
		this.samplesLoaded = this.samplesLoaded + 1;
		if (success) {
			this.trackLength = this.trackLength + sample.getSampleLength();
			if (this.samplesLoaded >= this.samples.length) {
				let beatNumber = 0;
				this.firstSample = this.samples[0];
				this.lastSample = this.samples[this.samples.length - 1];
				for (const sample of this.samples) {
					if (sample !== this.lastSample) {
						sample.nextSample = this.samples[this.samples.indexOf(sample) + 1];
					} else {
						sample.nextSample = null;
					}
					sample.beatNumber = beatNumber;
					beatNumber = beatNumber + sample.getSampleLength();
				}
				Logger.debug('Track is ready!');
				this.currentSample = this.firstSample;
				this.soundComplete = true;
				this.song.onTrackLoad(true, this);
			}
		} else {
			Logger.log('Sample load failed ' + sample);
			this.song.onTrackLoad(false, this);
		}
	}

	/**
	 * Handles the callback when a sample is completed.
	 * @param {Sample} sample - The completed sample.
	 */
	onSampleComplete(sample) {
		Logger.debug(
			this.trackId +
				' Next beat: ' +
				sample.getNextBeatNumber() +
				' Track length: ' +
				this.trackLength
		);
		sample.stop();
		if (sample.nextSample === null) {
			Logger.debug(this.trackId + ' Track is finished');
			this.currentSample = this.firstSample;
			this.trackComplete = true;
			this.soundComplete = true;
			this.song.onTrackComplete(this);
		} else {
			Logger.debug(this.trackId + ' Current Sample is complete');
			this.soundComplete = true;
			this.song.onSampleComplete(sample);
		}
	}

	/**
	 * Checks if the track has completed playback.
	 * @returns {boolean} True if the track has completed playback, otherwise false.
	 */
	isTrackComplete() {
		return this.trackComplete;
	}
}

export { Track };
