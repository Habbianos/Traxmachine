import { TraxChannel } from './TraxChannel.mjs';
import { TraxNote } from './TraxNote.mjs';

/**
 * Class representing audio track data.
 * @source §_-wc§/TraxData.as
 */
class TraxData {
	/**
	 * @source TraxData.§_-2fH§
	 * @type {TraxChannel[]}
	 */
	#tracks = [];

	/**
	 * @source TraxData.§_-4PU§
	 * @type {Map<string, string>}
	 */
	#metaData = new Map();

	/**
	 * @param {string} data - The audio track data string.
	 */
	constructor(data) {
		const parts = data.split(':');
		const lastPart = String(parts[parts.length - 1]);

		if (lastPart.includes('meta')) {
			const metaDataParts = lastPart.split(';');
			for (let i = 0; i < metaDataParts.length; i++) {
				const metaDataPair = metaDataParts[i].split(',');
				const key = String(metaDataPair[0]);
				const value = String(metaDataPair[1]);
				this.#metaData.set(key, value);
			}

			parts.pop();
		}

		const trackData = parts;
		for (let i = 0; i < trackData.length / 2; i++) {
			const trackId = parseInt(trackData[i * 2]);

			if (trackId.toString().length > 0) {
				const trackInfo = trackData[i * 2 + 1].split(';');
				const track = new TraxChannel(trackId);

				for (let j = 0; j < trackInfo.length; j++) {
					const noteData = trackInfo[j].split(',');
					if (noteData.length !== 2) {
						console.log('Trax load error: invalid song data string');
						return;
					}

					const noteType = parseInt(noteData[0]);
					const noteValue = parseInt(noteData[1]);

					track.addNote(new TraxNote(noteType, noteValue));
				}

				this.#tracks.push(track);
			}
		}
	}

	/**
	 * Gets the list of audio tracks.
	 * @source TraxData.§_-1Sl§
	 */
	get channels() {
		return this.#tracks;
	}

	/**
	 * Gets the list of note IDs in the track.
	 * @source TraxData.§_-5y4§
	 */
	getNoteIds() {
		const noteIds = [];
		for (let i = 0; i < this.#tracks.length; i++) {
			const track = this.#tracks[i];
			for (let j = 0; j < track.noteCount; j++) {
				const note = track.getNoteAt(j);
				if (!noteIds.includes(note.id)) {
					noteIds.push(note.id);
				}
			}
		}
		return noteIds;
	}

	/**
	 * Checks if the track data contains metadata information.
	 * @source TraxData.§_-3bZ§
	 */
	get hasMetaData() {
		return this.#metaData.has('meta');
	}

	/**
	 * Checks if the track is compressed.
	 * @source TraxData.§_-6dH§
	 */
	get isCompressed() {
		return this.#metaData.get('c') === '1';
	}

	/**
	 * Gets the track type.
	 * @source TraxData.§_-4Ob§
	 */
	get getTrackType() {
		return parseInt(this.#metaData.get('t'));
	}
}

export { TraxData };
