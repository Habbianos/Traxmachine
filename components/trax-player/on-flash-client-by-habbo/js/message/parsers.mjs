import { HPlayListEntry } from './types.mjs';

/**
 * Class representing a playlist parser.
 * @source §_-3XR§.§_-1Z5§
 */
class HPlayListParser {
	/**
	 * @source HPlayListParser.§_-0SQ§
	 * @type {number}
	 */
	#synchronizationCount;

	/** @source HPlayListParser.§_-Yo§ */
	get synchronizationCount() {
		return this.#synchronizationCount;
	}

	/**
	 * @source HPlayListParser.§_-5Kw§
	 * @type {HPlayListEntry[]}
	 */
	#playList;

	/** @source HPlayListParser.§_-R-§ */
	get playlist() {
		return this.#playList;
	}

	constructor() {
		this.#synchronizationCount = -1;
		this.#playList = [];
	}

	/**
	 * Clear the parser data.
	 */
	flush() {
		this.#synchronizationCount = -1;
		this.#playList = [];
		return true;
	}

	/**
	 * Parse data from a given packet.
	 * @param {HPacket} packet - The packet data to parse.
	 */
	parse(packet) {
		this.#synchronizationCount = packet.readInteger();
		const count = packet.readInteger();
		for (let i = 0; i < count; i++) {
			const id = packet.readInteger();
			const length = packet.readInteger();
			const name = packet.readString();
			const creator = packet.readString();
			this.#playList.push(new HPlayListEntry(id, length, name, creator));
		}
		return true;
	}
}

/**
 * Class representing a playlist song added parser.
 * @source §_-3XR§.§_-6Fj§
 */
class HPlayListSongAddedParser {
	/**
	 * @source HPlayListSongAddedParser.§_-4cp§
	 * @type {PlayListEntry}
	 */
	#entry;

	get entry() {
		return this.#entry;
	}

	/**
	 * Clear the parser data.
	 */
	flush() {
		this.#entry = null;
		return true;
	}

	/**
	 * Parse data from a given packet.
	 * @param {HPacket} packet - The packet data to parse.
	 */
	parse(packet) {
		const id = packet.readInteger();
		const length = packet.readInteger();
		const name = packet.readString();
		const creator = packet.readString();
		this.#entry = new PlayListEntry(id, length, name, creator);
		return true;
	}
}

export { HPlayListParser, HPlayListSongAddedParser };
