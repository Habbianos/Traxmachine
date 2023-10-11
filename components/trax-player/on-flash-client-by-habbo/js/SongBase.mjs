/**
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
	 * This probably should be changed to `name`
	 * @source SongBase.§_-3Xo§
	 * @type {string}
	 */
	#songName;

	/** Gets the music's name. */
	get name() {
		return this.#songName;
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
	 * The synchronization position in seconds for the song.
	 * @source SongBase.§_-0hv§
	 */
	#startPlayHeadPos = 0.0;

	/**
	 * @source SongBase.§_-UE§
	 */
	get startPlayHeadPos() {
		return this.#startPlayHeadPos;
	}

	set startPlayHeadPos(value) {
		this.#startPlayHeadPos = value;
	}

	/**
	 * @param {number} id - The music's ID.
	 * @param {number} length - The music's length in seconds.
	 * @param {string} name - The music's name.
	 * @param {string} creator - The music's creator.
	 */
	constructor(id, length, name, creator) {
		this.#id = id;
		this.#length = length;
		this.#songName = name;
		this.#creator = creator;
	}
}

export { SongBase };
