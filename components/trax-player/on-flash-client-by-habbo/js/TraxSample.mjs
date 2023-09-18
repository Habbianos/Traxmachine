/**
 * @source §_-wc§.TraxSample
 */
class TraxSample {
	/**
	 * Audio sampling frequency of 44 kHz.
	 * @source TraxSample.SAMPLE_FREQUENCY_44KHZ
	 */
	static get #SAMPLE_FREQUENCY_44KHZ() {
		return 'sample_44khz';
	}

	/**
	 * Audio sampling frequency of 22 kHz.
	 * @source TraxSample.SAMPLE_FREQUENCY_22KHZ
	 */
	static get #SAMPLE_FREQUENCY_22KHZ() {
		return 'sample_22khz';
	}

	/**
	 * Audio sampling frequency of 11 kHz.
	 * @source TraxSample.SAMPLE_FREQUENCY_11KHZ
	 */
	static get #SAMPLE_FREQUENCY_11KHZ() {
		return 'sample_11khz';
	}

	/**
	 * Sample scale with 16-bit precision.
	 * @source TraxSample.SAMPLE_SCALE_16BIT
	 */
	static get #SAMPLE_SCALE_16BIT() {
		return 'sample_16bit';
	}

	/**
	 * Sample scale with 8-bit precision.
	 * @source TraxSample.SAMPLE_SCALE_8BIT
	 */
	static get #SAMPLE_SCALE_8BIT() {
		return 'sample_8bit';
	}

	/**
	 * Conversion factor for 16-bit samples.
	 * @source TraxSample.§_-1xo§
	 */
	static get #CONVERSION_FACTOR_16BIT() {
		return 1 / 32768;
	}

	/**
	 *
	 * @source TraxSample.§_-4PC§
	 */
	static get #UNKNOWN_STATIC_CONSTANT() {
		return 32;
	}

	/**
	 * mask sample value for 8-bit samples.
	 * @source TraxSample.§_-4PC§
	 */
	static get #MASK_8BIT() {
		return 255;
	}

	/**
	 * mask sample value for 16-bit samples.
	 * @source TraxSample.§_-6FV§
	 */
	static get #MASK_16BIT() {
		return 65535;
	}

	/**
	 * Offset value for 8-bit samples.
	 * @source TraxSample.§_-6Jt§
	 */
	static get #OFFSET_8BIT() {
		return 127;
	}

	/**
	 * Offset value for 16-bit samples.
	 * @source TraxSample.§_-2SI§
	 */
	static get #OFFSET_16BIT() {
		return 32767;
	}

	/**
	 * The audio sample data stored.
	 * @source TraxSample.§_-4dS§
	 * @type {number[]}
	 */
	#sampleData = null;

	/**
	 * The sample's ID.
	 * @source TraxSample.§_-6VD§
	 * @type {number}
	 */
	#id;

	/** Get the sample's ID. */
	get id() {
		return this.#id;
	}

	/**
	 * The size of each audio sample in bytes.
	 * @source TraxSample.§_-3pt§
	 */
	#sampleSizeInBytes = 2;

	/**
	 * The number of audio channels in the sample (e.g., mono or stereo).
	 * @source TraxSample.§_-1g§
	 */
	#audioChannels = 1;

	/**
	 * An array of sound IDs associated with this TraxSample.
	 * @source TraxSample.§_-2x8§
	 * @type {any[]}
	 */
	#soundIds;

	/**
	 * The number of sounds associated with this TraxSample.
	 * @source TraxSample.§_-1aK§
	 */
	get soundsAmount() {
		return this.#soundIds.length;
	}

	/**
	 * The timestamp of the last time this TraxSample used while preparing a song.
	 * @source TraxSample.§_-1cV§
	 * @type {number}
	 */
	#lastPreparedTime;

	/**
	 * The timestamp of the last time this TraxSample used while preparing a song.
	 * @source TraxSample.§_-04e§
	 */
	get lastPreparedTime() {
		return this.#lastPreparedTime;
	}

	/**
	 * Get the sample's length.
	 * @source TraxSample.§_-4dS§
	 */
	get length() {
		return (
			this.#sampleData.length * this.#sampleSizeInBytes * this.#audioChannels
		);
	}

	/**
	 * Creates a new TraxSample instance.
	 * @param {ByteArray} data - The sample data as a ByteArray.
	 * @param {number} id - The sample's ID.
	 * @param {string} [frequency='sample_44khz'] - The audio sampling frequency.
	 * @param {string} [scale='sample_16bit'] - The sample scale precision.
	 */
	constructor(data, id, frequency = 'sample_44khz', scale = 'sample_16bit') {
		this.#soundIds = [];
		this.#id = id;
		let sampleMaxValue = 65536;

		switch (frequency) {
			case TraxSample.#SAMPLE_FREQUENCY_22KHZ:
				this.#audioChannels = 2;
				break;
			case TraxSample.#SAMPLE_FREQUENCY_11KHZ:
				this.#audioChannels = 4;
				break;
			default:
				this.#audioChannels = 1;
		}

		switch (scale) {
			case TraxSample.#SAMPLE_SCALE_8BIT:
				this.#sampleSizeInBytes = 4;
				sampleMaxValue = 256;
				break;
			default:
				this.#sampleSizeInBytes = 2;
				sampleMaxValue = 65536;
		}

		const sampleSize = this.#sampleSizeInBytes * this.#audioChannels;
		let adjustedLength = data.length / 8;
		adjustedLength = Math.trunc(adjustedLength / sampleSize) * sampleSize;
		this.#sampleData = new Array(adjustedLength / sampleSize).fill(0);
		const sampleScale = 1 / (sampleMaxValue / 2);
		// data.position = 0; // what? ByteArray.position ?
		let currentPosition = 0;
		const numSamples = adjustedLength / this.#audioChannels;

		for (let i = 0; i < numSamples; i++) {
			let sampleValue = data.readFloat();
			data.readFloat();

			for (let j = 2; j <= this.#audioChannels; j++) {
				const nextValue = data.readFloat();
				data.readFloat();
				sampleValue = (sampleValue * (j - 1)) / j + nextValue / j;
			}

			if (i >= numSamples - 1 - TraxSample.#UNKNOWN_STATIC_CONSTANT) {
				sampleValue *=
					(numSamples - i - 1) / TraxSample.#UNKNOWN_STATIC_CONSTANT;
			}

			let adjustedSample = Math.trunc((sampleValue + 1) / sampleScale);

			if (adjustedSample < 0) {
				adjustedSample = 0;
			} else if (adjustedSample >= sampleMaxValue) {
				adjustedSample = sampleMaxValue - 1;
			}

			currentPosition *= sampleMaxValue;
			currentPosition += adjustedSample;

			if (i % this.#sampleSizeInBytes === this.#sampleSizeInBytes - 1) {
				this.#sampleData[Math.trunc(i / this.#sampleSizeInBytes)] =
					currentPosition;
				currentPosition = 0;
			}
		}
	}

	/**
	 * Processes and decodes the TraxSample data and fills the output vector with audio samples.
	 * @source TraxSample.§_-2Jy§
	 * @param {number[]} output - The output vector to fill with audio samples.
	 * @param {number} startIndex - The start index in the output vector.
	 * @param {number} length - The number of samples to decode.
	 * @param {number} inputIndex - The input index for TraxSample data.
	 */
	processTraxSampleData(output, startIndex, length, inputIndex) {
		if (output == null || this.#sampleData == null) {
			return inputIndex;
		}

		const sampleSize = this.#sampleSizeInBytes * this.#audioChannels;
		inputIndex = inputIndex / sampleSize;

		if (startIndex < 0) {
			length = length + startIndex;
			startIndex = 0;
		}

		if (length > output.length - startIndex) {
			length = output.length - startIndex;
		}

		const numOutputSamples = length / sampleSize;
		let additionalOutput = 0;

		if (numOutputSamples > this.#sampleData.length - inputIndex) {
			additionalOutput =
				(numOutputSamples - (this.#sampleData.length - inputIndex)) *
				sampleSize;
			numOutputSamples = this.#sampleData.length - inputIndex;

			if (additionalOutput > output.length - startIndex) {
				additionalOutput = output.length - startIndex;
			}
		}

		if (this.#audioChannels === 1) {
			if (this.#sampleSizeInBytes === 2) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					output[startIndex++] =
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT;
					output[startIndex++] =
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT;
				}
			} else if (this.#sampleSizeInBytes === 4) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					output[startIndex++] =
						// prettier-ignore
						(sampleValue >> 24 &
						TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] =
						// prettier-ignore
						(sampleValue >> 16 &
						TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] =
						// prettier-ignore
						(sampleValue >> 8 &
						TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] =
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT <<
						8;
				}
			}
		} else if (this.#audioChannels >= 2) {
			let sampleIndex = 0;

			if (this.#sampleSizeInBytes === 2) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					let outputValue = Math.trunc(
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT
					);
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
					outputValue = Math.trunc(
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT
					);
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
				}
			} else if (this.#sampleSizeInBytes === 4) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					// prettier-ignore
					let outputValue = (sampleValue >> 24 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
					// prettier-ignore
					outputValue = (sampleValue >> 16 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
					// prettier-ignore
					outputValue = (sampleValue >> 8 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
					// prettier-ignore
					outputValue = (sampleValue & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] = outputValue;
					}
				}
			}
		}

		while (additionalOutput-- > 0) {
			output[startIndex++] = 0;
		}

		return inputIndex * sampleSize;
	}

	/**
	 * Processes and applies TraxSample data to the output vector.
	 * @source TraxSample.§_-Q0§
	 * @param {number[]} output - The output vector to apply audio samples to.
	 * @param {number} startIndex - The start index in the output vector.
	 * @param {number} length - The number of samples to apply.
	 * @param {number} inputIndex - The input index for TraxSample data.
	 */
	applyTraxSampleDataToOutput(output, startIndex, length, inputIndex) {
		if (output == null || this.#sampleData == null) {
			return inputIndex;
		}

		const sampleSize = this.#sampleSizeInBytes * this.#audioChannels;
		inputIndex = inputIndex / sampleSize;

		if (startIndex < 0) {
			length = length + startIndex;
			startIndex = 0;
		}

		if (length > output.length - startIndex) {
			length = output.length - startIndex;
		}

		let numOutputSamples = length / sampleSize;

		if (numOutputSamples > this.#sampleData.length - inputIndex) {
			numOutputSamples = this.#sampleData.length - inputIndex;
		}

		if (this.#audioChannels === 1) {
			if (this.#sampleSizeInBytes === 2) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT;
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT;
				}
			} else if (this.#sampleSizeInBytes === 4) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue >> 24 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue >> 8 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					output[startIndex++] +=
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
				}
			}
		} else if (this.#audioChannels >= 2) {
			let sampleIndex = 0;

			if (this.#sampleSizeInBytes === 2) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					let outputValue = Math.trunc(
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT
					);
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
					outputValue = Math.trunc(
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_16BIT) - TraxSample.#OFFSET_16BIT
					);
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
				}
			} else if (this.#sampleSizeInBytes === 4) {
				while (numOutputSamples-- > 0) {
					const sampleValue = this.#sampleData[inputIndex++];
					let outputValue =
						// prettier-ignore
						(sampleValue >> 24 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
					outputValue =
						// prettier-ignore
						(sampleValue >> 16 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
					outputValue =
						// prettier-ignore
						(sampleValue >> 8 & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
					outputValue =
						// prettier-ignore
						(sampleValue & TraxSample.#MASK_8BIT) - TraxSample.#OFFSET_8BIT << 8;
					for (let j = this.#audioChannels; j > 0; j--) {
						output[sampleIndex++] += outputValue;
					}
				}
			}
		}

		return inputIndex * sampleSize;
	}

	/**
	 * Associates an ID with a value and updates the last prepared time.
	 * @param {number} id - The ID to be associated.
	 * @param {number} preparationTime - The preparation time to be updated.
	 */
	associateID(id, preparationTime) {
		if (this.#soundIds == null) {
			return;
		}
		if (this.#soundIds.indexOf(id) === -1) {
			this.#soundIds.push(id);
		}
		this.#lastPreparedTime = preparationTime;
	}

	/**
	 * Checks if an ID is associated with this object.
	 * @param {number} id - The ID to be checked.
	 * @returns {boolean} - True if the ID is associated, otherwise, False.
	 */
	checkIDAssociation(id) {
		if (this.#soundIds == null) {
			return false;
		}
		return this.#soundIds.indexOf(id) !== -1;
	}
}

export { TraxSample };
