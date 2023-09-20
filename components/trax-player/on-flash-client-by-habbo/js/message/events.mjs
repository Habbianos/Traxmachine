import { HPlayListParser, HPlayListSongAddedParser } from "./parsers.mjs";

/**
 * Class representing a playlist event.
 * @source §_-3y2§.§_-g6§
 */
class HPlayListEvent extends HEventBase {
	/**
	 * Create a PlayListEvent.
	 * @param {Function} callback - The callback function for the event.
	 */
	constructor(callback) {
		super(callback, HPlayListParser);
	}

	/**
	 * Get the parser associated with this event.
	 * @source HPlayListEvent.§_-4Kb§
	 * @returns {HPlayListParser} The parser for this event.
	 */
	getParser() {
		return this.parser;
	}
}

/**
 * Class representing a playlist song added event.
 * @source §_-3y2§.§_-0x6§
 */
class HPlayListSongAddedEvent extends HEventBase {
	/**
	 * Create a PlayListSongAddedEvent.
	 * @param {Function} callback - The callback function for the event.
	 */
	constructor(callback) {
		super(callback, HPlayListSongAddedParser);
	}

	/**
	 * Get the parser associated with this event.
	 * @source HPlayListSongAddedEvent.§_-4Kb§
	 * @returns {HPlayListSongAddedParser} The parser for this event.
	 */
	getParser() {
		return this.parser;
	}
}


export { HPlayListEvent, HPlayListSongAddedEvent };
