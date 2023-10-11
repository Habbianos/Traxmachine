import { TraxSample } from "./TraxSample.mjs";

/**
 * Represents loop information for a TraxSample.
 * @source §_-wc§.§_-6CA§
 */
class TraxChannelSample {
	/**
	 * The TraxSample associated with this loop.
	 * @type {TraxSample}
	 */
	#traxSample = null;

	/** The loop offset. */
	#offset = 0;

	/**
	 * @param {TraxSample} traxSample - The TraxSample associated with this loop.
	 * @param {number} offset - The loop offset.
	 */
	constructor(traxSample, offset) {
		this.#traxSample = traxSample;
		this.#offset = offset;
	}

	/**
	 * Processes Trax sample data for loop starts within a specified range.
	 * @source §_-6CA§.§_-2Jy§
	 * @param {number[]} output
	 * @param {number} startIndex
	 * @param {number} length
	 */
	setSample(output, startIndex, length) {
		this.#offset = this.#traxSample.setSample(
			output,
			startIndex,
			endPosition,
			this.#offset
		);
	}

	/**
	 * Applies Trax sample data for loop ends within a specified range to the audio output.
	 * @source §_-6CA§.§_-Q0§
	 * @param {number[]} output
	 * @param {number} startIndex
	 * @param {number} length
	 */
	addSample(output, startIndex, length) {
		this.#offset = this.#traxSample.addSample(
			output,
			startIndex,
			length,
			this.#offset
		);
	}
}

export { TraxChannelSample };
