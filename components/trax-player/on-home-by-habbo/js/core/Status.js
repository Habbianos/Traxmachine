/** Represents the status of a player. */
class Status {
	/** The code indicating that the player is unloaded. */
	static UNLOADED = 0;

	/** The code indicating that the player is stopped. */
	static STOPPED = 1;

	/** The code indicating that the player is playing. */
	static PLAYING = 2;

	/** The code indicating that the player is paused. */
	static PAUSED = 3;

	/** The code indicating an error in the player. */
	static ERROR = -1;

	/** Creates a new instance of Status with an initial code of UNLOADED. */
	constructor() {
		this.code = Status.UNLOADED;
	}

	/** Sets the status to STOPPED if it's not in an error state. */
	setStopped() {
		if (!this.isError()) {
			this.code = Status.STOPPED;
		}
	}

	/** Sets the status to ERROR. */
	setError() {
		this.code = Status.ERROR;
	}

	/** Sets the status to PLAYING if it's in a STOPPED or PAUSED state. */
	setPlaying() {
		if (this.isStopped() || this.isPaused()) {
			this.code = Status.PLAYING;
		}
	}

	/** Sets the status to PAUSED if it's currently playing. */
	setPaused() {
		if (this.isPlaying()) {
			this.code = Status.PAUSED;
		}
	}

	/**
	 * Checks if the status is UNLOADED.
	 * @returns {boolean} True if the status is UNLOADED, otherwise false.
	 */
	isUnloaded() {
		return this.code === Status.UNLOADED;
	}

	/**
	 * Checks if the status is STOPPED.
	 * @returns {boolean} True if the status is STOPPED, otherwise false.
	 */
	isStopped() {
		return this.code === Status.STOPPED;
	}

	/**
	 * Checks if the status is PLAYING.
	 * @returns {boolean} True if the status is PLAYING, otherwise false.
	 */
	isPlaying() {
		return this.code === Status.PLAYING;
	}

	/**
	 * Checks if the status is PAUSED.
	 * @returns {boolean} True if the status is PAUSED, otherwise false.
	 */
	isPaused() {
		return this.code === Status.PAUSED;
	}

	/**
	 * Checks if the status is ERROR.
	 * @returns {boolean} True if the status is ERROR, otherwise false.
	 */
	isError() {
		return this.code === Status.ERROR;
	}

	/**
	 * Returns a string representation of the Status instance.
	 * @returns {string} A string in the format "Status{code=}".
	 */
	toString() {
		return 'Status{code=' + this.code + '}';
	}
}

export { Status };
