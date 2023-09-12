import { Logger } from '../util/Logger';
import { Player } from './Player';
import { SongData } from './SongData';
import { Status } from './Status';
import { Track } from './Track';

/** Represents a song with multiple tracks. */
class Song {
	/** @type {Track[]} */
	tracks;

	constructor() {
		this.name = 'unknown';
		this.author = 'unknown';
		this.tracksLoaded = 0;
		this.tracksComplete = 0;
		this.tracks = [];
		this.status = new Status();
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
	 * Sets the player associated with the song.
	 * @param {Player} player - The player to set.
	 */
	setPlayer(player) {
		this.player = player;
	}

	/**
	 * Called when the song data has finished loading.
	 * @param {boolean} success - Indicates whether the loading was successful.
	 * @param {SongData} songData - The song data associated with the song.
	 */
	onSongLoad(success, songData) {
		this.songData = songData;
		if (success) {
			Logger.debug('Song loaded successfully: ' + this.songData);
			this.name = songData.getName();
			this.author = songData.getAuthor();
		} else {
			Logger.debug('Song load failed!');
			this.status.setError();
		}
		this.player.onSongLoad(true, this);
	}

	/**
	 * Called when the song data has finished loading.
	 * @param {boolean} success - Indicates whether the loading was successful.
	 * @param {SongData} songData - The song data associated with the song.
	 */
	onSongDataLoad(success, songData) {
		if (success) {
			Logger.debug('Song data loaded successfully');
			this.addTrackWithSamples(songData.getTrack1());
			this.addTrackWithSamples(songData.getTrack2());
			this.addTrackWithSamples(songData.getTrack3());
			this.addTrackWithSamples(songData.getTrack4());
			this.loadSamples();
		} else {
			Logger.debug('Song data load failed!');
			this.status.setError();
			this.player.onSongPlaying(false, this);
		}
	}

	/**
	 * Called when a track has finished loading.
	 * @param {boolean} success - Indicates whether the loading was successful.
	 * @param {Track} track - The loaded track.
	 */
	onTrackLoad(success, track) {
		if (success && !this.status.isError()) {
			Logger.debug('Track loaded successfully');
			this.tracksLoaded++;
			if (this.tracksLoaded >= this.tracks.length) {
				this.status.setStopped();
				Logger.debug('The whole song has loaded! ' + this);
				this.play();
			}
		} else if (!this.status.isError()) {
			Logger.debug('Track load failed');
			this.status.setError();
			this.player.onSongPlaying(false, this);
		}
	}

	/**
	 * Called when a track has completed playback.
	 * @param {Track} track - The completed track.
	 */
	onTrackComplete(track) {
		Logger.debug('Song - Track complete');
		this.player.onSongComplete(this);
	}

	/**
	 * Called when a sample within the song has completed playback.
	 * @param {Sample} sample - The completed sample.
	 */
	onSampleComplete(sample) {
		const nextBeatNumber = sample.getNextBeatNumber();
		if (this.isReadyForBeat(nextBeatNumber)) {
			for (const track of this.tracks) {
				track.playBeat(nextBeatNumber);
			}
		}
	}

	/**
	 * Adds a track to the song.
	 * @param {Track} track - The track to add.
	 */
	addTrack(track) {
		this.tracks.push(track);
		track.setSong(this);
	}

	/** Initiates playback of the song. */
	play() {
		if (!this.songData.isLoaded()) {
			Logger.debug('Loading samples now ' + this.songData);
			this.songData.loadSamples();
		}
		Logger.debug('Song.status=' + this.status);
		if (this.status.isStopped()) {
			for (const track of this.tracks) {
				track.play();
			}
			this.status.setPlaying();
			this.player.onSongPlaying(true, this);
			Logger.debug('Now playing song');
		}
	}

	/** Stops playback of the song. */
	stop() {
		for (const track of this.tracks) {
			track.stop();
		}
		this.status.setStopped();
	}

	/**
	 * Adds a track with samples to the song.
	 * @param {Array<Sample>} samples - The samples to add to the track.
	 */
	addTrackWithSamples(samples) {
		Logger.debug('Adding track:' + samples);
		const track = new Track();
		this.addTrack(track);
		track.addSamples(samples);
	}

	/** Loads samples for all tracks in the song. */
	loadSamples() {
		for (const track of this.tracks) {
			track.loadSamples();
		}
	}

	/**
	 * Gets the length of the song in seconds.
	 * @returns {number} - The length of the song in seconds.
	 */
	getSongLengthInSeconds() {
		let maxTrackLength = 0;
		for (const track of this.tracks) {
			const trackLength = track.getTrackLengthInSeconds();
			Logger.debug(
				'track[' + this.tracks.indexOf(track) + '] length ' + trackLength
			);
			if (trackLength > maxTrackLength) {
				maxTrackLength = trackLength;
			}
		}
		return maxTrackLength;
	}

	/**
	 * Checks if the song is ready to play at a specific beat number.
	 * @param {number} beatNumber - The beat number to check.
	 * @returns {boolean} - True if the song is ready for the specified beat, false otherwise.
	 */
	isReadyForBeat(beatNumber) {
		for (const track of this.tracks) {
			if (!track.isReadyForBeat(beatNumber)) {
				Logger.debug('Track is not ready for beat!');
				return false;
			}
		}
		return true;
	}

	/**
	 * Converts the Song instance to a string representation.
	 * @returns {string} - A string representation of the Song.
	 */
	toString() {
		return (
			'Song{name=' +
			this.name +
			',length=' +
			this.getSongLengthInSeconds() +
			',status=' +
			this.status +
			'}'
		);
	}
}

export { Song };
