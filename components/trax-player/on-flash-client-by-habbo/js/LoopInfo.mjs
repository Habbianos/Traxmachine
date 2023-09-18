import { TraxSample } from "./TraxSample.mjs";

/**
 * Represents loop information for a TraxSample.
 * @source §_-wc§.§_-6CA§
 */
class LoopInfo {
	/**
	 * The TraxSample associated with this loop.
	 * @type {TraxSample}
	 */
	#traxSample = null;

	/** The loop index. */
	#index = 0;

	/**
	 * @param {TraxSample} traxSample - The TraxSample associated with this loop.
	 * @param {number} index - The loop index.
	 */
	constructor(traxSample, index) {
		this.#traxSample = traxSample;
		this.#index = index;
	}

	/**
	 * Processes Trax sample data for loop starts within a specified range.
	 * @source §_-6CA§.§_-2Jy§
	 * @param {number[]} output
	 * @param {number} startIndex
	 * @param {number} length
	 */
	processTraxSampleData(output, startIndex, length) {
		this.#index = this.#traxSample.processTraxSampleData(
			output,
			startIndex,
			endPosition,
			this.#index
		);
	}

	/**
	 * Applies Trax sample data for loop ends within a specified range to the audio output.
	 * @source §_-6CA§.§_-Q0§
	 * @param {number[]} output
	 * @param {number} startIndex
	 * @param {number} length
	 */
	applyTraxSampleDataToOutput(output, startIndex, length) {
		this.#index = this.#traxSample.applyTraxSampleDataToOutput(
			output,
			startIndex,
			length,
			this.#index
		);
	}
}

export { LoopInfo };
