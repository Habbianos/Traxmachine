import { SongBase } from './SongBase.mjs';
import { SoundObject } from './SoundObject.mjs';

/**
 * Represents a playable music object.
 * Currently its missing the `#unknown_6T1`/`unknown_3l5` and `#unknown_52p`/`unknown_07I` property meaning
 * @source §_-Lr§.§_-3HW§
 */
class SongObject extends SongBase {
	/**
	 * ?
	 * @source SongObject.§_-1-d§
	 * @type {SoundObject}
	 */
	#soundObject = null;

	/**
	 * Gets the associated sound object for the music.
	 * @source SongObject.§_-1QV§
	 */
	get sound() {
		return this.#soundObject;
	}

	set sound(s) {
		this.#soundObject = s;
	}

	/**
	 * ?
	 * @source SongObject.§_-6T1§
	 * @type {string}
	 */
	#unknown_6T1;

	/** @source SongObject.§_-3l5§ */
	get unknown_3l5() {
		return this.#unknown_6T1;
	}

	set unknown_3l5(u) {
		this.#unknown_6T1 = u;
	}

	/**
	 * ?
	 * @source SongObject.§_-52p§
	 * @type {number}
	 */
	#unknown_52p = -1;

	/**
	 * ?
	 * @source SongObject.§_-07I§
	 */
	get unknown_07I() {
		return this.#unknown_52p;
	}

	set unknown_07I(u) {
		this.#unknown_52p = u;
	}

	/**
	 * @param {number} id - The music's ID.
	 * @param {number} length - The music's length in seconds.
	 * @param {string} title - The music's title.
	 * @param {string} creator - The music's creator.
	 * @param {SoundObject} soundObject - The sound object associated with the music.
	 */
	constructor(id, length, title, creator, soundObject) {
		this.#soundObject = soundObject;
		this.#unknown_6T1 = '';
		super(id, length, title, creator);
	}

	/** Checks if the music is loaded (ready to be played). */
	get loaded() {
		return this.#soundObject === null ? false : this.#soundObject.ready;
	}
}

export { SongObject };
