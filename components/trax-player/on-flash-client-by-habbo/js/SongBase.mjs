/**
 * Currently its missing the `#unknown_0hv`/`unknown_UE` property meaning
 * @source §_-3y2§.§_-1dq§
 */
class SongBase {
	/**
	 * @source SongBase.§_-t3§
	 * @type {number}
	 */
	#id;

	/** Gets the music's ID. */
	get id() {
		return this.#id;
	}

	/**
	 * @source SongBase.§_-6Nu§
	 * @type {number}
	 */
	#length;

	/** Gets the music's length in seconds. */
	get length() {
		return this.#length;
	}

	/**
	 * @source SongBase.§_-3Xo§
	 * @type {string}
	 */
	#title;

	/** Gets the music's title. */
	get title() {
		return this.#title;
	}

	/**
	 * @source SongBase.§_-59Z§
	 * @type {string}
	 */
	#creator;

	/** Gets the music's creator. */
	get creator() {
		return this.#creator;
	}

	/**
	 * ? - Maybe the volume
	 * @source SongBase.§_-0hv§
	 * @type {number}
	 */
	#unknown_0hv = 0.0;

	/**
	 * @source SongBase.§_-UE§
	 */
	get unknown_UE() {
		return this.#unknown_0hv;
	}

	/** Sets the music's volume. */
	set unknown_UE(value) {
		this.#unknown_0hv = value;
	}

	/**
	 * @param {number} id - The music's ID.
	 * @param {number} length - The music's length in seconds.
	 * @param {string} title - The music's title.
	 * @param {string} creator - The music's creator.
	 */
	constructor(id, length, title, creator) {
		this.#id = id;
		this.#length = length;
		this.#title = title;
		this.#creator = creator;
	}
}

export { SongBase };
