import { PlayerListener } from '../PlayerListener';
import { Logger } from '../util/Logger'; // Certifique-se de importar a classe Logger corretamente
import { Song } from './Song';
import { Status } from './Status';

/**
 * Class representing a music player.
 */
class Player {
	/** @type {Song[]} */
	songs;

	/**
	 * Create a Player.
	 */
	constructor() {
		this.songs = [];
		this.status = new Status();
		this.currentSong = 0;
		this.tick = 0;
		this.repeat = true;
	}

	/**
	 * Set the player listener for this player.
	 * @param {PlayerListener} playerListener - The player listener object.
	 */
	setPlayerListener(playerListener) {
		this.playerListener = playerListener;
	}

	/**
	 * Add a song to the player's playlist.
	 * @param {Song} song - The song to add.
	 */
	addSong(song) {
		this.songs.push(song);
		song.setPlayer(this);
	}

	/**
	 * Start playing the current song.
	 */
	startPlaying() {
		Logger.debug('Player start playing');
		if (this.status.isStopped()) {
			Logger.debug('Player playing song');
			this.status.setPlaying();
			this.getCurrentSong().play();
		} else {
			Logger.debug('Player is not stopped ' + this.status);
		}
	}

	/**
	 * Stop playing the current song.
	 */
	stopPlaying() {
		clearInterval(this.tickId);
		this.tick = 0;
		this.onTick();
		this.getCurrentSong().stop();
		this.status.setStopped();
	}

	/**
	 * Called when a song is complete.
	 * @param {Song} song - The completed song.
	 */
	onSongComplete(song) {
		if (this.repeat) {
			this.stopPlaying();
			this.startPlaying();
		}
	}

	/**
	 * Called when a song is loaded.
	 * @param {boolean} success - Whether the song loaded successfully.
	 * @param {Song} song - The loaded song.
	 */
	onSongLoad(success, song) {
		if (success) {
			this.status.setStopped();
		} else {
			this.status.setError();
		}
		this.playerListener.onSongLoad(success, song, this);
	}

	/**
	 * Called when a song is playing.
	 * @param {boolean} success - Whether the song is playing successfully.
	 * @param {Song} song - The playing song.
	 */
	onSongPlaying(success, song) {
		this.playerListener.onSongPlaying(success, song);
		this.tickId = setInterval(() => this.onTick(), 1000);
	}

	/**
	 * Called on each tick of the song.
	 */
	onTick() {
		this.tick = this.tick + 1;
		this.playerListener.onTick(this.tick);
	}

	/**
	 * Get the current song.
	 * @returns {Song} The current song.
	 */
	getCurrentSong() {
		return this.songs[this.currentSong];
	}
}

// Export the Player class for use in other modules
export { Player };
