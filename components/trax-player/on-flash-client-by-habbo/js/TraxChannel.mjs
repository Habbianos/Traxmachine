import { TraxNote } from './TraxNote.mjs';

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
	 * @type {TraxNote[]}
	 */
	#notes;

	/**
	 * @param {number} id - The ID of the audio track channel.
	 */
	constructor(id) {
		this.#id = id;
		this.#notes = [];
	}

	/**
	 * Get the number of notes in the channel.
	 * @source TraxChannel.§_-2eV§
	 */
	get noteCount() {
		return this.#notes.length;
	}

	/**
	 * Adds a note to the channel.
	 * @source TraxChannel.§_-4Uc§
	 * @param {TraxNote} note - The note to be added to the channel.
	 */
	addNote(note) {
		this.#notes.push(note);
	}

	/**
	 * Gets a note in the channel.
	 * @source TraxChannel.§_-6Sx§
	 * @param {number} k - The note index in the channel.
	 */
	getNoteAt(k) {
		return this.#notes[k];
	}
}

export { TraxChannel };
