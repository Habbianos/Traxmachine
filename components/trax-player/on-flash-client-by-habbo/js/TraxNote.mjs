/**
 * Class representing a note in an audio track.
 * @source §_-wc§.§_-1fj§
 */
class TraxNote {
	/**
	 * @source TraxNote.§_-6VD§
	 * @type {number}
	 */
	#id;

	/**
	 * @source TraxNote.§_-4m§
	 * @type {number}
	 */
	#length;

	/**
	 * @param {number} id - The ID of the note.
	 * @param {number} length - The length of the note.
	 */
	constructor(id, length) {
		this.#id = id;
		this.#length = length;
	}

	/** Gets the ID of the note. */
	get id() {
		return this.#id;
	}

	/** Gets the length of the note. */
	get length() {
		return this.#length;
	}
}

export { TraxNote };
