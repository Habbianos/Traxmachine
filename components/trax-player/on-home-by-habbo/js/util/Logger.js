/** Provides logging functionality for the application. */
class Logger {
	/** Indicates whether regular logging is enabled. */
	static logEnabled = false;

	/** Indicates whether debug logging is enabled. */
	static debugEnabled = false;

	/**
	 * The logger instance.
	 * @type {Logger}
	 */
	static logger = null;

	/**
	 * Logs a message if regular logging is enabled.
	 * @param {string} message - The message to log.
	 */
	static log(message) {
		if (Logger.logEnabled) {
			if (Logger.logger === null) {
				Logger.logger = new Logger();
			}
			Logger.logger._log(message);
		}
	}

	/**
	 * Logs a debug message if debug logging is enabled.
	 * @param {string} message - The debug message to log.
	 * @static
	 */
	static debug(message) {
		if (Logger.debugEnabled) {
			if (Logger.logger === null) {
				Logger.logger = new Logger();
			}
			Logger.logger.#log(message);
		}
	}

	/**
	 * Logs a message to the console.
	 * @param {string} message - The message to log.
	 */
	#log(message) {
		console.log(message);
	}
}

export { Logger };
