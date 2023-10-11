import { TraxChannelSample } from './TraxChannelSample.mjs';
import { SoundObject } from './interface/SoundObject.mjs';
import { TraxData } from './TraxData.mjs';
import { TraxSample } from './TraxSample.mjs';
import { getKeyByIndex, getValueByIndex } from './utils/getByIndex.mjs';
import { HabboMusicEvents } from './HabboMusicEvents.mjs';

/**
 * Classe que representa um sequenciador de trilha sonora no jogo.
 * Responsável pela reprodução e controle de trilhas sonoras.
 * @source §_-wc§/TraxSequencer.as
 */
class TraxSequencer extends SoundObject {
	/**
	 * @source TraxSequencer.§_-57W§
	 */
	static get #SAMPLES_PER_SECOND() {
		return 44100;
	}

	/**
	 * @source TraxSequencer.§_-1WZ§
	 */
	static get #BUFFER_LENGTH() {
		return 8192;
	}

	/**
	 * @source TraxSequencer.§_-6h1§
	 */
	static get #SAMPLES_BAR_LENGTH() {
		return 88000;
	}

	/**
	 * Sample rate for soundtrack playback.
	 * @source TraxSequencer.§_-284§
	 */
	static get #BAR_LENGTH() {
		return 88000;
	}

	/**
	 * Integer vector for audio buffer.
	 * @source TraxSequencer.§_-0XL§
	 */
	static get #MIXING_BUFFER() {
		return new Array(TraxSequencer.#BUFFER_LENGTH).fill(0);
	}

	/**
	 * Integer vector for output audio buffer.
	 * @source TraxSequencer.§_-5-L§
	 */
	static get #INTERPOLATION_BUFFER() {
		return new Array(TraxSequencer.#BUFFER_LENGTH).fill(0);
	}

	/**
	 * Event dispatcher for notifying events related to the soundtrack.
	 * @source TraxSequencer.§_-X8§
	 * @type {IEventDispatcher}
	 */
	#eventDispatcher;

	/**
	 * Soundtrack volume.
	 * @source TraxSequencer.§_-4OH§
	 */
	#volume = 1;

	get volume() {
		return this.#volume;
	}

	set volume(v) {
		this.#volume = v;

		if (this.#soundChannel != null) {
			this.#soundChannel.soundTransform = new SoundTransform(this.#volume);
		}
	}

	/**
	 * Sound associated with the soundtrack.
	 * @source TraxSequencer.§_-5kR§
	 */
	#sound = new Sound();

	/**
	 * Sound channel for soundtrack playback.
	 * @source TraxSequencer.§_-4iJ§
	 * @type {SoundChannel}
	 */
	#soundChannel = null;

	/**
	 * Soundtrack data.
	 * @source TraxSequencer.§_-3OS§
	 * @type {TraxData}
	 */
	#traxData;

	get traxData() {
		return this.#traxData;
	}

	/**
	 * Sound mapping.
	 * @source TraxSequencer.§_-2r2§
	 * @type {Map<number, TraxSample>} sampleId -> sample
	 */
	#samplesMap;

	/**
	 * Indicates if the soundtrack is ready.
	 * @source TraxSequencer.§_-VV§
	 */
	ready = true;

	/**
	 * Soundtrack ID.
	 * @source TraxSequencer.§_-t3§
	 * @type {number}
	 */
	#soundId;

	/**
	 * Start time of the soundtrack in seconds.
	 * @source TraxSequencer.§_-01P§
	 */
	#startTime = 0;

	/**
	 * Current position in the soundtrack.
	 * @source TraxSequencer.§_-2GO§
	 */
	#position = 0;

	set position(p) {
		this.#position = p * TraxSequencer.#SAMPLES_PER_SECOND;
	}

	get position() {
		return this.#position / TraxSequencer.#SAMPLES_PER_SECOND;
	}

	/**
	 * Information about soundtracks and their samples.
	 *
	 * This attribute stores an array of maps, where each map represents a soundtrack
	 * and maps the sample index to the corresponding sound sample.
	 * @source TraxSequencer.§_-1Fj§
	 * @type {Array<Map<number, TraxSample>>}
	 */
	#additionalSampleInfo = [];

	/**
	 * Indicates if the soundtrack has been prepared.
	 * @source TraxSequencer.§_-5HG§
	 */
	#prepared = false;

	/**
	 * Indicates if the soundtrack is not playing/rendering.
	 * @source TraxSequencer.§_-3RR§
	 */
	#isRenderingPaused = false;

	get isRenderingPaused() {
		return this.#isRenderingPaused;
	}

	/**
	 * Soundtrack duration (in milliseconds?).
	 * @source TraxSequencer.§_-da§
	 */
	#duration = 0;

	get length() {
		return this.#duration / TraxSequencer.#SAMPLES_PER_SECOND;
	}

	/**
	 * Delay for audio buffering in milliseconds.
	 * @source TraxSequencer.§_-4Oa§
	 */
	#bufferDelay = 30;

	/**
	 * Indicates if the soundtrack is paused.
	 * @source TraxSequencer.§_-578§
	 */
	#paused = false;

	/**
	 * Indicates if the soundtrack is muted.
	 * @source TraxSequencer.§_-5E-§
	 */
	#muted = false;

	/**
	 * Rate of buffering.
	 * @source TraxSequencer.§_-2fz§
	 */
	#bufferingRate = 0;

	get bufferingRateInSeconds() {
		return this.#bufferingRate / TraxSequencer.#SAMPLES_PER_SECOND;
	}

	/** @param {number} value */
	set bufferingRateInSeconds(value) {
		this.#bufferingRate = Math.round(value * TraxSequencer.#SAMPLES_PER_SECOND);
	}

	/**
	 * Rate of muting.
	 * @source TraxSequencer.§_-4fb§
	 */
	#mutedRate = 0;

	get mutedRateInSeconds() {
		return this.#mutedRate / TraxSequencer.#SAMPLES_PER_SECOND;
	}

	/** @param {number} value */
	set mutedRateInSeconds(value) {
		this.#mutedRate = Math.round(value * TraxSequencer.#SAMPLES_PER_SECOND);
	}

	/**
	 * Offset for audio buffering in milliseconds.
	 * @type {number}
	 * @source TraxSequencer.§_-3h6§
	 */
	#bufferingOffset = 0;

	/**
	 * Offset for muting in milliseconds.
	 * @type {number}
	 * @source TraxSequencer.§_-6F3§
	 */
	#mutedOffset = 0;

	/**
	 * Timer to pause the music.
	 * @type {number}
	 * @source TraxSequencer.§_-3Br§
	 */
	#stopTimeout;

	/**
	 * Timer for audio buffering in milliseconds.
	 * @type {number}
	 * @source TraxSequencer.§_-0qh§
	 */
	#bufferingTimer;

	/**
	 * Indicates whether the soundtrack data is compressed.
	 * @source TraxSequencer.§_-3mP§
	 */
	#cutMode = false;

	/**
	 * Keeps track of the position of the last processed SampleData event during playback.
	 * @source TraxSequencer.§_-31r§
	 */
	#expectedStreamPosition = 0;

	/**
	 * Keeps track of audio buffer under run occurrences during playback.
	 * @source TraxSequencer.§_-3WC§
	 */
	#audioBufferUnderRuns = 0;

	/**
	 * Class constructor for TraxSequencer.
	 * @param {number} soundId - The soundtrack ID.
	 * @param {TraxData} traxData - The soundtrack data.
	 * @param {Map<number, TraxSample>} samplesMap - The sound mapping.
	 * @param {IEventDispatcher} eventDispatcher - The event dispatcher to notify events related to the soundtrack.
	 */
	constructor(soundId, traxData, samplesMap, eventDispatcher) {
		this.#eventDispatcher = eventDispatcher;
		this.#soundId = soundId;
		this.#samplesMap = samplesMap;
		this.#traxData = traxData;
	}

	/**
	 * Prepares the soundtrack for playback.
	 */
	prepare() {
		if (!this.ready) {
			console.log('Cannot start trax playback until samples ready!');
			return false;
		}
		if (!this.#prepared) {
			if (this.#traxData !== null) {
				this.#cutMode = false;
				if (this.#traxData.hasMetaData) {
					this.#cutMode = this.#traxData.metaCutMode;
				}
				if (this.#cutMode) {
					if (!this.#prepareSequence()) {
						console.log('Cannot start playback, prepare sequence failed!');
						return false;
					}
				} else {
					if (!this.#prepareLegacySequence()) {
						console.log(
							'Cannot start playback, prepare legacy sequence failed!'
						);
						return false;
					}
				}
			}
		}
		return true;
	}

	/**
	 * Prepares the legacy soundtrack sequence.
	 * @source TraxSequencer.§_-00R§
	 */
	#prepareLegacySequence() {
		if (this.#additionalSampleInfo === null) {
			return false;
		}

		const currentTime = Date.now();

		for (
			let channelIndex = 0;
			channelIndex < this.#traxData.channels.length;
			channelIndex++
		) {
			/** @type {Map<number, TraxSample>} */
			const sampleInfo = new Map();
			const channel = this.#traxData.channels[channelIndex];
			let bufferIndex = 0;
			let bufferIncrement = 0;

			for (let i = 0; i < channel.notes.length; ) {
				const sampleId = channel.notes[i].id;
				const sample = this.#samplesMap.get(sampleId);
				sample.associateID(this.#soundId, currentTime);

				if (sample !== undefined && sample !== null) {
					const bufferSize = this.#getSampleBars(sample.length);
					const sampleLength = channel.notes[i].length / bufferSize;

					for (let j = 0; j < sampleLength; j++) {
						if (sampleId !== 0) {
							sampleInfo.set(bufferIndex, sample);
						}

						bufferIncrement += bufferSize;
						bufferIndex = bufferIncrement * TraxSequencer.#BAR_LENGTH;
					}

					if (this.#duration < bufferIndex) {
						this.#duration = bufferIndex;
					}

					i++;
					continue;
				}

				console.log('Error in prepareLegacySequence(), sample was null!');
				return false;
			}

			this.#additionalSampleInfo.push(sampleInfo);
		}

		this.#prepared = true;
		return true;
	}

	/**
	 * Prepares the soundtrack sequence.
	 * @source TraxSequencer.§_-1Ff§
	 */
	#prepareSequence() {
		if (this.#additionalSampleInfo === null) {
			return false;
		}

		const currentTime = Date.now();

		for (
			let channelIndex = 0;
			channelIndex < this.#traxData.channels.length;
			channelIndex++
		) {
			/** @type {Map<number, TraxSample>} */
			const sampleInfo = new Map();
			const channel = this.#traxData.channels[channelIndex];
			let bufferIndex = 0;
			let bufferIncrement = 0;
			let isContinuous = false;

			for (let i = 0; i < channel.notes.length; ) {
				const sampleId = channel.notes[i].id;
				const sample = this.#samplesMap.get(sampleId);
				sample.associateID(this.#soundId, currentTime);

				if (sample !== undefined && sample !== null) {
					let bufferPosition = bufferIncrement;
					let unknownBufferIndex = bufferIndex;
					let sampleSize = this.#getSampleBars(sample.length);

					for (
						let sampleLength = channel.notes[i].length;
						bufferPosition < bufferIncrement + sampleLength;

					) {
						if (sampleId !== 0 || isContinuous) {
							sampleInfo.set(unknownBufferIndex, sample);
							isContinuous = false;
						}
						bufferPosition += sampleSize;
						unknownBufferIndex =
							bufferPosition * TraxSequencer.#BAR_LENGTH;

						if (bufferPosition > bufferIncrement + sampleLength) {
							isContinuous = true;
						}
					}

					bufferIncrement += channel.notes[i].length;
					bufferIndex = bufferIncrement * TraxSequencer.#BAR_LENGTH;

					if (this.#duration < bufferIndex) {
						this.#duration = bufferIndex;
					}

					i++;
					continue;
				}

				console.log('Error in prepareSequence(), sample was null!');
				return false;
			}

			this.#additionalSampleInfo.push(sampleInfo);
		}

		this.#prepared = true;
		return true;
	}

	/**
	 * Starts playback of the soundtrack.
	 * @param {number} [k=0] - The optional initial playback time in seconds.
	 */
	play(k = 0) {
		if (!this.prepare()) {
			return false;
		}
		this.#removeFadeoutStopTimer();
		if (this.#soundChannel !== null) {
			this.#stopImmediately();
		}
		if (this.#bufferingRate > 0) {
			this.#paused = true;
			this.#bufferingOffset = 0;
		}
		this.#isRenderingPaused = false;
		this.#mutedOffset = 0;
		this.#isRenderingPaused = false;
		this.#sound.addEventListener(
			SampleDataEvent.SAMPLE_DATA,
			this.#onSampleData
		);
		this.#startTime = k * TraxSequencer.#SAMPLES_PER_SECOND;
		this.#expectedStreamPosition = 0;
		this.#audioBufferUnderRuns = 0;
		this.#soundChannel = this.#sound.play();
		this.volume = this.#volume;
		return true;
	}

	/**
	 * Renders the soundtrack.
	 * @param {SampleDataEvent} k - The SampleDataEvent event.
	 */
	render(k) {
		if (!this.prepare()) {
			return false;
		}
		while (!this.isRenderingPaused) {
			this.#onSampleData(k);
		}
		return true;
	}

	/** Stops the playback of the soundtrack. */
	stop() {
		if (this.#mutedRate > 0 && !this.#isRenderingPaused) {
			this.#stopWithFadeout();
		} else {
			this.#playingComplete();
		}
		return true;
	}

	/**
	 * Ends playback, pauses rendering, and cleans up playback-related resources.
	 * @source TraxSequencer.§_-6UX§
	 */
	#stopImmediately() {
		this.#removeStopTimer();
		if (this.#soundChannel !== null) {
			this.#soundChannel.stop();
			this.#soundChannel = null;
		}
		if (this.#sound !== null) {
			this.#sound.removeEventListener('sampleData', this.#onSampleData);
		}
	}

	/**
	 * Schedules the interruption of the soundtrack playback.
	 *
	 * @source TraxSequencer.§_-2H6§
	 */
	#stopWithFadeout() {
		if (this.#stopTimeout === null) {
			this.#isRenderingPaused = true;
			this.#mutedOffset = 0;
			this.#stopTimeout = setTimeout(
				this.#onFadeOutComplete,
				this.#bufferDelay +
					this.#mutedRate / (TraxSequencer.#SAMPLES_PER_SECOND / 1000)
			);
		}
	}

	/**
	 * Calculates the sample size based on the provided length.
	 * @source TraxSequencer.§_-68F§
	 * @param {number} length - The length of the sample.
	 */
	#getSampleBars(length) {
		if (this.#cutMode) {
			return Math.round(length / TraxSequencer.#SAMPLES_BAR_LENGTH);
		}
		return Math.ceil(length / TraxSequencer.#SAMPLES_BAR_LENGTH);
	}

	/**
	 * Calculates the loop start indices for each channel.
	 * @source TraxSequencer.§_-4Kg§
	 */
	#getChannelSequenceOffsets() {
		const loopStartIndices = [];

		if (this.#additionalSampleInfo !== null) {
			const numChannels = this.#additionalSampleInfo.length;

			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				const sampleInfo = this.#additionalSampleInfo[channelIndex];
				let loopStartIndex = 0;

				while (
					loopStartIndex < sampleInfo.size &&
					getKeyByIndex(sampleInfo, loopStartIndex) < this.#position
				) {
					loopStartIndex++;
				}

				loopStartIndices.push(loopStartIndex - 1);
			}
		}

		return loopStartIndices;
	}

	/**
	 * Processes audio data for playback.
	 * @source TraxSequencer.§_-0Qn§
	 */
	#mixChannelsIntoBuffer() {
		if (this.#additionalSampleInfo === null) {
			return;
		}

		const loopStartIndices = this.#getChannelSequenceOffsets();
		const numChannels = this.#additionalSampleInfo.length;
		/** @type {TraxChannelSample} */
		let loopInfo = null;

		for (
			let channelIndex = numChannels - 1;
			channelIndex >= 0;
			channelIndex--
		) {
			const sampleInfo = this.#additionalSampleInfo[channelIndex];
			const loopStartIndex = loopStartIndices[channelIndex];
			const sample = getValueByIndex(sampleInfo, loopStartIndex);

			if (sample === null) {
				loopInfo = null;
			} else {
				const loopLength = sampleInfo.get(loopStartIndex + 1) - loopStartIndex;
				const currentPosition = this.#position - loopLength;

				if (sample.id === 0 || currentPosition < 0) {
					loopInfo = null;
				} else {
					loopInfo = new TraxChannelSample(sample, currentPosition);
				}
			}

			let bufferSize = TraxSequencer.#BUFFER_LENGTH;

			if (this.#duration - this.#position < bufferSize) {
				bufferSize = this.#duration - this.#position;
			}

			for (let i = 0; i < bufferSize; ) {
				let loopLength = bufferSize;

				if (loopStartIndex < sampleInfo.size - 1) {
					const nextLoopStart = sampleInfo.get(loopStartIndex + 1);

					if (bufferSize + this.#position >= nextLoopStart) {
						loopLength = nextLoopStart - this.#position;
					}
				}

				if (loopLength > bufferSize - i) {
					loopLength = bufferSize - i;
				}

				if (channelIndex === numChannels - 1) {
					if (loopInfo !== null) {
						loopInfo.processTraxSampleData(
							TraxSequencer.#MIXING_BUFFER,
							i,
							loopLength
						);
						i += loopLength;
					} else {
						for (let j = 0; j < loopLength; j++) {
							TraxSequencer.#MIXING_BUFFER[i++] = 0;
						}
					}
				} else {
					if (loopInfo !== null) {
						loopInfo.applyTraxSampleDataToOutput(
							TraxSequencer.#MIXING_BUFFER,
							i,
							loopLength
						);
					}
					i += loopLength;
				}

				if (i < bufferSize) {
					sample = getValueByIndex(sampleInfo, ++loopStartIndex);

					if (sample === null || sample.id === 0) {
						loopInfo = null;
					} else {
						loopInfo = new TraxChannelSample(sample, 0);
					}
				}
			}
		}
	}

	/**
	 * Updates the playback state of the soundtrack.
	 * This method is responsible for determining whether playback should be paused or resumed
	 * based on the current position relative to the duration of the soundtrack and other factors.
	 * @source TraxSequencer.§_-6Do§
	 */
	#checkSongFinishing() {
		const k =
			this.#duration < this.#startTime
				? Math.trunc(this.#duration)
				: this.#startTime > 0
				? Math.trunc(this.#startTime)
				: Math.trunc(this.#duration);

		if (
			this.#position >
				k + this.#bufferDelay * (TraxSequencer.#SAMPLES_PER_SECOND / 1000) &&
			!this.#isRenderingPaused
		) {
			this.#isRenderingPaused = true;

			if (this.#bufferingTimer !== null) {
				clearTimeout(this.#bufferingTimer);
				this.#bufferingTimer = null;
			}

			this.#bufferingTimer = setTimeout(this.#onPlayingComplete, 2);
		} else if (this.#position > k - this.#mutedRate && !this.#muted) {
			this.#isRenderingPaused = false;
			this.#muted = true;
			this.#mutedOffset = 0;
		}
	}

	/**
	 * Handles the sample data event (SampleDataEvent).
	 * @source TraxSequencer.§_-3EB§
	 * @param {SampleDataEvent} event - The received sample data event.
	 */
	#onSampleData(event) {
		if (event.position > this.#expectedStreamPosition) {
			++this.#audioBufferUnderRuns;
			console.log('Audio buffer under run...');
			this.#expectedStreamPosition = event.position;
		}

		if (this.volume > 0) {
			this.#mixChannelsIntoBuffer();
		}

		let bufferSize = TraxSequencer.#BUFFER_LENGTH;
		if (this.#duration - this.#position < bufferSize) {
			bufferSize = this.#duration - this.#position;
			if (bufferSize < 0) {
				bufferSize = 0;
			}
		}

		if (this.volume <= 0) {
			bufferSize = 0;
		}

		this.#writeAudioToOutputStream(event.data, bufferSize);
		this.#position += bufferSize;
		this.#expectedStreamPosition += bufferSize;

		if (this.#soundChannel !== null) {
			this.#bufferDelay =
				(event.position / TraxSequencer.#SAMPLES_PER_SECOND) * 1000 -
				this.#soundChannel.position;
		}

		this.#checkSongFinishing();
	}

	/**
	 * Updates the audio buffer based on the current playback state.
	 * @source TraxSequencer.§_-LH§
	 * @param {ArrayBuffer} audioBuffer - The audio buffer to be updated.
	 * @param {number} bufferSize - The size of the audio buffer.
	 */
	#writeAudioToOutputStream(audioBuffer, bufferSize) {
		let factor = NaN;
		let offset = NaN;

		if (bufferSize > 0) {
			if (!this.#paused && !this.#muted) {
				this.#writeMixingBufferToOutputStream(audioBuffer, bufferSize);
			} else {
				if (this.#paused) {
					factor = 1 / this.#bufferingRate;
					offset = this.#bufferingOffset / this.#bufferingRate;
					this.#bufferingOffset += TraxSequencer.#BUFFER_LENGTH;
					if (this.#bufferingOffset > this.#bufferingRate) {
						this.#paused = false;
					}
				} else if (this.#muted) {
					factor = -1 / this.#mutedRate;
					offset = 1 - this.#mutedOffset / this.#mutedRate;
					this.#mutedOffset += TraxSequencer.#BUFFER_LENGTH;
					if (this.#mutedOffset > this.#mutedRate) {
						this.#mutedOffset = this.#mutedRate;
					}
				}

				this.#writeMixingBufferToOutputStreamWithFade(audioBuffer, bufferSize, offset, factor);
			}
		}

		const silenceValue = 0;
		for (let i = bufferSize; i < TraxSequencer.#BUFFER_LENGTH; i++) {
			audioBuffer[i * 2] = silenceValue; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
			audioBuffer[i * 2 + 1] = silenceValue; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
		}
	}

	/**
	 * Fills the audio buffer with data from the sequencer.
	 * @source TraxSequencer.§_-4bs§
	 * @param {ArrayBuffer} audioBuffer - The audio buffer to be filled.
	 * @param {number} bufferSize - The size of the audio buffer.
	 */
	#writeMixingBufferToOutputStream(audioBuffer, bufferSize) {
		for (let i = 0; i < bufferSize; i++) {
			const value = TraxSequencer.#MIXING_BUFFER[i] * TraxSample.AMPLITUDE;
			audioBuffer[i * 2] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
			audioBuffer[i * 2 + 1] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
		}
	}

	/**
	 * Applies audio transformations to the audio buffer based on the provided parameters.
	 * @source TraxSequencer.§_-5Ci§
	 * @param {ArrayBuffer} audioBuffer - The audio buffer to be modified.
	 * @param {number} bufferSize - The size of the audio buffer.
	 * @param {number} offset - The offset of the audio transformation.
	 * @param {number} factor - The audio transformation factor.
	 */
	#writeMixingBufferToOutputStreamWithFade(audioBuffer, bufferSize, offset, factor) {
		let value = 0;
		let currentIndex = 0;

		for (currentIndex = 0; currentIndex < bufferSize; currentIndex++) {
			if (offset < 0 || offset > 1) {
				break;
			}

			value =
				TraxSequencer.#MIXING_BUFFER[currentIndex] *
				TraxSample.AMPLITUDE *
				offset;
			offset += factor;
			audioBuffer[currentIndex * 2] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
			audioBuffer[currentIndex * 2 + 1] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
		}

		if (offset < 0) {
			while (currentIndex < bufferSize) {
				audioBuffer[currentIndex * 2] = 0; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
				audioBuffer[currentIndex * 2 + 1] = 0; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
				currentIndex++;
			}
		} else if (offset > 1) {
			while (currentIndex < bufferSize) {
				value =
					TraxSequencer.#MIXING_BUFFER[currentIndex] * TraxSample.AMPLITUDE;
				offset += factor; // AVISO: PODE SER QUE O CÓDIGO ORIGINAL ESPERA QUE ESSE VALOR SEJA ALTERADO NO ESCOPO DE FORA DA CHAMADA DA FUNÇÃO, O QUE NÃO ACONTECERÁ NO JS
				audioBuffer[currentIndex * 2] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
				audioBuffer[currentIndex * 2 + 1] = value; // TALVEZ ESSE TIPO DE TRADUÇÃO PARA writeFloat NÃO FUNCIONE, POIS PODE SER QUE O writeFloat SE COMPORTE COMO UM PUSH, OU SEJA, O ÍNDICE DEPENDE DA POSIÇÃO ATUAL
				currentIndex++;
			}
		}
	}

	/**
	 * Handles buffering completion events.
	 * @source TraxSequencer.§_-64X§
	 */
	#onPlayingComplete() {
		if (this.#isRenderingPaused) {
			this.#playingComplete();
		}
	}

	/**
	 * Handles a timeout event to stop the soundtrack playback.
	 * @source TraxSequencer.§_-2WK§
	 */
	#onFadeOutComplete() {
		this.#removeFadeoutStopTimer();
		this.#playingComplete();
	}

	/**
	 * Effectively stops the playback of the soundtrack and concludes the playback.
	 * @source TraxSequencer.§_-6f9§
	 */
	#playingComplete() {
		this.#stopImmediately();
		this.#eventDispatcher.dispatchEvent(
			new HabboMusicEvents( // SoundCompleteEvent
				HabboMusicEvents.SCE_TRAX_SONG_COMPLETE,
				this.#soundId
			)
		);
	}

	/**
	 * Aborts the stop timeout if it is active by clearing it.
	 * @source TraxSequencer.§_-6Z6§
	 */
	#removeFadeoutStopTimer() {
		if (this.#stopTimeout !== null) {
			clearTimeout(this.#stopTimeout);
			this.#stopTimeout = null;
		}
	}

	/**
	 * Clears and removes the buffering timer if it's active.
	 * @source TraxSequencer.§_-5ra§
	 */
	#removeStopTimer() {
		if (this.#bufferingTimer !== null) {
			clearTimeout(this.#bufferingTimer);
			this.#bufferingTimer = null;
		}
	}
}

export { TraxSequencer };
