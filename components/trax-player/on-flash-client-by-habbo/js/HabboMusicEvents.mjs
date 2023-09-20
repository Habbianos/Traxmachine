
/**
 * Currently its missing the constructor.
 * @source This class merges multiple event-related classes
 */
class HabboMusicEvents {
	/** @source §_-6jh§.§_-5vR§.§_-01s§ */
	static get ROSM_SOUND_MACHINE_INIT() {
		return 1;
	}

	/** @source §_-6jh§.§_-5vR§.§_-4ED§ */
	static get ROSM_SOUND_MACHINE_SWITCHED_ON() {
		return 2;
	}

	/** @source §_-6jh§.§_-5vR§.§_-6JK§ */
	static get ROSM_SOUND_MACHINE_SWITCHED_OFF() {
		return 3;
	}

	/** @source §_-6jh§.§_-5vR§.§_-0I5§ */
	static get ROSM_SOUND_MACHINE_DISPOSE() {
		return 4;
	}

	/** @source §_-6jh§.§_-5vR§.§_-0Go§ */
	static get ROSM_JUKEBOX_INIT() {
		return 5;
	}

	/** @source §_-6jh§.§_-5vR§.§_-2z§ */
	static get ROSM_JUKEBOX_SWITCHED_ON() {
		return 6;
	}

	/** @source §_-6jh§.§_-5vR§.§_-0de§ */
	static get ROSM_JUKEBOX_SWITCHED_OFF() {
		return 7;
	}

	/** @source §_-6jh§.§_-5vR§.§_-4n1§ */
	static get ROSM_JUKEBOX_DISPOSE() {
		return 8;
	}


	/** @source §_-3bw§.§_-3wA§.§_-3oJ§ */
	static get SCE_TRAX_SONG_COMPLETE() {
		return 9;
	}


	/** @source §_-3bw§.§_-1R-§.§_-4AE§ */
	static get SIR_TRAX_SONG_INFO_RECEIVED() {
		return 10;
	}


	/** @source §_-3bw§.§_-5RD§.§_-6S0§ */
	static get PLUE_PLAY_LIST_UPDATED() {
		return 11;
	}

	/** @source §_-3bw§.§_-5RD§.§_-3lb§ */
	static get PLUE_PLAY_LIST_FULL() {
		return 12;
	}
}


export { HabboMusicEvents }