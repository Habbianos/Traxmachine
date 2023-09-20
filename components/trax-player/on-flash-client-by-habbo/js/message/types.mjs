/**
 * Class representing a playlist entry.
 * @source §_-3y2§.§_-1dq§
 */
class HPlayListEntry {
	/**
	 * @source HPlayListEntry.§_-t3§
	 * @type {number} integer
	 */
	#id;

	/**
	 * @source HPlayListEntry.§_-6Nu§
	 * @type {number} integer
	 */
	#length;

	/**
	 * @source HPlayListEntry.§_-3Xo§
	 * @type {string}
	 */
	#name;

	/**
	 * @source HPlayListEntry.§_-59Z§
	 * @type {string}
	 */
	#creator;

	/**
	 * @source HPlayListEntry.§_-0hv§
	 * @type {number} float
	 */
	#unknown_0hv = 0.0;

	/**
	 * @param {number} id - The ID of the entry.
	 * @param {number} length - The length of the entry.
	 * @param {string} name - The name of the entry.
	 * @param {string} creator - The creator of the entry.
	 */
	constructor(id, length, name, creator) {
		this.#id = id;
		this.#length = length;
		this.#name = name;
		this.#creator = creator;
	}

	/**
	 * Get the ID of the entry.
	 */
	get id() {
		return this.#id;
	}

	/**
	 * Get the length of the entry.
	 */
	get length() {
		return this.#length;
	}

	/**
	 * Get the name of the entry.
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Get the creator of the entry.
	 */
	get creator() {
		return this.#creator;
	}

	/**
	 * Get the value of §_-UE§.
	 */
	get unknown_UE() {
		return this.#unknown_0hv;
	}

	/**
	 * Set the value of §_-UE§.
	 */
	set unknown_UE(k) {
		this.#unknown_0hv = k;
	}
}

export { HPlayListEntry };
