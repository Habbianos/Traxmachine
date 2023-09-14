import { Player } from "./core/Player";
import { Song } from "./core/Song";

/** Implementation of the PlayerListener interface for testing purposes. */
class TestPlayerListener {
	/**
	 * Called when a song is loaded.
	 * @param {boolean} success - Indicates if the song loaded successfully.
	 * @param {Song} song - The loaded song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongLoad(success, song, player) {
		if (success) {
			Logger.log('Song loaded! ' + song + ' ' + player);
		} else {
			Logger.log('Song loading failed!');
		}
	}

	/**
	 * Called on each tick of the player.
	 * @param {number} tick - The current tick count.
	 */
	onTick(tick) {
		Logger.log('time:' + tick);
	}

	/**
	 * Called when a song is playing.
	 * @param {boolean} success - Indicates if the song is playing successfully.
	 * @param {Song} song - The currently playing song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongPlaying(success, song, player) {
		if (success) {
			Logger.log('Song is playing! ' + song);
		} else {
			Logger.log('Song data loading failed!');
		}
	}
}

export { TestPlayerListener };
