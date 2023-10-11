import { SongBase } from './SongBase.mjs';
import { SoundObject } from './interface/SoundObject.mjs';

/**
 * Represents a playable music object.
 * Currently its missing the `#songData`/`songData` and `#diskId`/`diskId` property meaning
 * @source §_-Lr§.§_-3HW§
 */
class SongDataEntry extends SongBase {
	/**
	 * ?
	 * @source SongDataEntry.§_-1-d§
	 * @type {SoundObject}
	 */
	#soundObject = null;

	/**
	 * Gets the associated sound object for the music.
	 * @source SongDataEntry.§_-1QV§
	 */
	get sound() {
		return this.#soundObject;
	}

	set sound(s) {
		this.#soundObject = s;
	}

	/**
	 * ?
	 * @source SongDataEntry.§_-6T1§
	 * @type {string}
	 */
	#songData;

	/** @source SongDataEntry.§_-3l5§ */
	get songData() {
		return this.#songData;
	}

	set songData(u) {
		this.#songData = u;
	}

	/**
	 * ?
	 * @source SongDataEntry.§_-52p§
	 * @type {number}
	 */
	#diskId = -1;

	/**
	 * ?
	 * @source SongDataEntry.§_-07I§
	 */
	get diskId() {
		return this.#diskId;
	}

	set diskId(u) {
		this.#diskId = u;
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
		this.#songData = '';
		super(id, length, title, creator);
	}

	/** Checks if the music is loaded (ready to be played). */
	get loaded() {
		return this.#soundObject === null ? false : this.#soundObject.ready;
	}
}

export { SongDataEntry };
