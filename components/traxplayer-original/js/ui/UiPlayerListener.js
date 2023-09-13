import { PlayerListener } from "../PlayerListener";
import { Player } from "../core/Player";
import { Song } from "../core/Song";

/** Represents a listener for player-related events in the user interface. */
class UiPlayerListener extends PlayerListener {
	/**
	 * Creates a new UiPlayerListener instance.
	 * @param {MovieClip} mc - The movie clip associated with the user interface.
	 */
	constructor(mc) {
		this.movieClip = mc;
	}

	/**
	 * Handles the event when a song is loaded.
	 * @param {boolean} success - Indicates whether the song loading was successful.
	 * @param {Song} song - The loaded song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongLoad(success, song, player) {
		this.movieClip.loadanimation._x = -1500;
		this.movieClip.loadanimation._y = -1500;
		if (success) {
			this.movieClip.songName.text = song.getName();
			this.movieClip.songAuthor.text = song.getAuthor();
			this.movieClip.controlbuttons.play.enabled = true;
			this.movieClip.controlbuttons.enabled = true;
		} else {
			this.movieClip.songName.text = 'Load failed!';
		}
	}

	/**
	 * Handles the event when a song is playing.
	 * @param {boolean} success - Indicates whether the song is playing successfully.
	 * @param {Song} song - The currently playing song.
	 * @param {Player} player - The player associated with the song.
	 */
	onSongPlaying(success, song, player) {
		if (success) {
			this.movieClip.songLength.text =
				'(' + this.secondsToString(song.getSongLengthInSeconds()) + ')';
			this.movieClip.songPlayed.text = this.secondsToString(0);
			this.movieClip.volumecontrol.dragger.enabled = true;
		} else {
			this.movieClip.songName.text = 'Load failed!';
			this.movieClip.songAuthor.text = '';
		}
	}

	/**
	 * Handles the tick event for updating song progress.
	 * @param {number} tick - The current tick count.
	 */
	onTick(tick) {
		this.movieClip.songPlayed.text = this.secondsToString(tick);
	}

	/**
	 * Converts seconds to a formatted time string (mm:ss).
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {string} - The formatted time string.
	 */
	secondsToString(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
		var timeString = '0' + minutes + ':';
		if (seconds < 10) {
			timeString += '0';
		}
		timeString += seconds;
		return timeString;
	}
}

export { UiPlayerListener };
