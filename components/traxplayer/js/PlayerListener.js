/** Abstract base class for player listeners. */
class PlayerListener {
	/**
	 * Called when a song is loaded.
	 * @param {boolean} success - Indicates if the song loaded successfully.
	 * @param {Song} song - The loaded song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongLoad(success, song, player) {}

	/**
	 * Called on each tick of the player.
	 * @param {number} tick - The current tick count.
	 */
	onTick(tick) {}

	/**
	 * Called when a song is playing.
	 * @param {boolean} success - Indicates if the song is playing successfully.
	 * @param {Song} song - The currently playing song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongPlaying(success, song, player) {}
}

export { PlayerListener };
