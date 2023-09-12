import { Logger } from './Logger';
import { SampleData } from './SampleData';
import { SongData } from './SongData';

/* Represents data for a track, including information about samples. */
class TrackData {
	/* Indicates whether the track data was loaded successfully. */
	success = false;

	/**
	 * An array of sample data associated with the track.
	 * @type {SampleData[]}
	 */
	sampleDatas = [];

	/**
	 * Creates an instance of TrackData by parsing raw track data.
	 * @param {string} sampleUrl - The base URL for sample files.
	 * @param {string} trackData - Raw track data to parse.
	 */
	constructor(sampleUrl, trackData) {
		Logger.log('Parsing track data: ' + trackData);
		const sampleDataArray = trackData.split(';');
		this.sampleDatas = [];

		for (const sampleData of sampleDataArray) {
			if (sampleData.length > 0) {
				const sampleInfo = sampleData.split(',');
				Logger.log('Sample id:' + sampleInfo[0] + ' length:' + sampleInfo[1]);
				const sampleUrl =
					sampleUrl + 'sound_machine_sample_' + sampleInfo[0] + '.mp3';
				const sample = new SampleData(sampleUrl, Number(sampleInfo[1]));
				sample.setTrackData(this);
				this.sampleDatas.push(sample);
			}
		}
		Logger.log('Parsed sample datas: ' + this.sampleDatas);
	}

	/**
	 * Sets the song data associated with this track data.
	 * @param {SongData} songData - The song data to set.
	 */
	setSongData(songData) {
		this.songData = songData;
	}

	/**
	 * Handles the callback when sample data is loaded.
	 * @param {boolean} success - Indicates whether the sample data was loaded successfully.
	 */
	onSampleDataLoad(success) {
		if (success) {
			this.loadSamples();
		} else {
			this.songData.onTrackDataLoad(false);
		}
	}

	/** Loads samples associated with the track data. */
	loadSamples() {
		for (const sampleData of this.sampleDatas) {
			if (!sampleData.isLoaded()) {
				sampleData.load();
				return;
			}
		}
		Logger.debug('Track data loaded!');
		this.success = true;
		this.songData.onTrackDataLoad(true);
	}

	/** Checks if the track data has been loaded successfully. */
	isLoaded() {
		return this.success;
	}

	/** Gets an array of sample URLs based on the track data. */
	getSampleUrls() {
		const sampleUrls = [];
		for (const sampleData of this.sampleDatas) {
			for (let i = 0; i < sampleData.getRepeatCount(); i++) {
				sampleUrls.push(sampleData.getUrl());
			}
		}
		return sampleUrls;
	}
}

export { TrackData };
