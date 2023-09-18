import { SoundObject } from './SoundObject.mjs';
import { TraxData } from './TraxData.mjs';
import { TraxSequencer } from './TraxSequencer.mjs';

/**
 * Currently its missing the constructor and its properties
 * @source §_-6BZ§/HabboSoundManagerFlash10.as
 */
class HabboSoundManagerFlash10 {
	/**
	 * Get or create an instance of a sound object based on the sound ID and sound data.
	 *
	 * @source HabboSoundManagerFlash10.§_-0PU§
	 *
	 * @param {number} soundId - The sound ID.
	 * @param {string} soundData - The sound data.
	 * @returns {SoundObject} - The sound object instance.
	 */
	getOrCreateSoundObject(soundId, soundData) {
		if (currentSoundObject !== null) {
			return this.#getCurrentSoundObject(soundId, soundData);
		}
		const newSoundObject = this.#createSoundObject(soundId, soundData);
		if (!newSoundObject.ready) {
			currentSoundObject = newSoundObject;
			currentSoundId = soundId;
		}
		return newSoundObject;
	}

	/**
	 * Get or create an instance of a sound object based on the sound ID and sound data.
	 *
	 * @source HabboSoundManagerFlash10.§_-5A0§
	 *
	 * @param {number} soundId - The sound ID.
	 * @param {string} soundData - The sound data.
	 * @returns {SoundObject} - The sound object instance.
	 */
	#getCurrentSoundObject(soundId, soundData) {
		const newSoundObject = this.#createSoundObject(soundId, soundData, false);
		if (!newSoundObject.ready) {
			currentSoundObject = newSoundObject;
		}
		return newSoundObject;
	}

	/**
	 * Create a new sound object based on the sound ID and sound data.
	 *
	 * @source HabboSoundManagerFlash10.§_-3my§
	 *
	 * @param {number} soundId - The sound ID.
	 * @param {string} soundData - The sound data.
	 * @param {boolean} addToMap - Indicates whether the sound object should be added to the map.
	 * @returns {SoundObject} - The sound object instance.
	 */
	#createSoundObject(soundId, soundData, addToMap = true) {
		const traxData = new TraxData(soundData);
		const traxSequencer = new TraxSequencer(
			soundId,
			traxData,
			this.soundManager,
			events
		);
		traxSequencer.isMuted = this.isMuted;
		this.#initializeSoundObject(traxSequencer, addToMap);
		return traxSequencer;
	}

	/**
	 * Initialize a sound object and add it to the map if necessary.
	 *
	 * @source HabboSoundManagerFlash10.§_-62c§
	 *
	 * @param {SoundObject} soundObject - The sound object to initialize.
	 * @param {boolean} addToMap - Indicates whether the sound object should be added to the map.
	 */
	#initializeSoundObject(soundObject, addToMap) {
		const traxData = soundObject.traxData;
		const missingSamples = [];
		for (const note of traxData.getNotes()) {
			if (!this.soundManager.getValue(note)) {
				if (addToMap) {
					this.soundManager.addSample(note);
				}
				missingSamples.push(note);
			}
		}
		soundObject.ready = missingSamples.length === 0;
	}
}

export { HabboSoundManagerFlash10 };
