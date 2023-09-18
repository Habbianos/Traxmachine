import { SongBase } from './SongBase.mjs';

/**
 * Represents Trax song data.
 * @source §_-3y2§.§_-03F§
 */
class TraxSongData extends SongBase {
	/** @source TraxSongData.§_-6T1§ */
	#data = '';

	/** Get the song data. */
	get data() {
		return this.#data;
	}

	/**
	 * @param {number} id - The ID of the song.
	 * @param {number} length - The length of the song in seconds.
	 * @param {string} title - The title of the song.
	 * @param {string} creator - The creator of the song.
	 * @param {string} data - The song data.
	 */
	constructor(id, length, title, creator, data) {
		super(id, length, title, creator);
		this.#data = data;
	}
}

export { TraxSongData };
