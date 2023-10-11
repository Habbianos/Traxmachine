import { TraxChannelItem } from './TraxChannelItem.mjs';

/**
 * Class representing an audio track channel.
 * @source §_-wc§.TraxChannel
 */
class TraxChannel {
	/**
	 * @source TraxChannel.§_-6VD§
	 * @type {number}
	 */
	#id;

	/**
	 * @source TraxChannel.§_-0QS§
	 * @type {TraxChannelItem[]}
	 */
	#items;

	/**
	 * @param {number} id - The ID of the audio track channel.
	 */
	constructor(id) {
		this.#id = id;
		this.#items = [];
	}

	/**
	 * Get the number of items in the channel.
	 * @source TraxChannel.§_-2eV§
	 */
	get noteCount() {
		return this.#items.length;
	}

	/**
	 * Adds a note to the channel.
	 * @source TraxChannel.§_-4Uc§
	 * @param {TraxChannelItem} note - The note to be added to the channel.
	 */
	addChannelItem(note) {
		this.#items.push(note);
	}

	/**
	 * Gets a note in the channel.
	 * @source TraxChannel.§_-6Sx§
	 * @param {number} k - The note index in the channel.
	 */
	getItem(k) {
		return this.#items[k];
	}
}

export { TraxChannel };
