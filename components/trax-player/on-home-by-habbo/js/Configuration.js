import { PlayerListener } from "./PlayerListener";
import { Player } from "./core/Player";
import { Song } from "./core/Song";
import { SongLoader } from "./core/SongLoader";
import { Logger } from "./util/Logger";

/** Provides configuration and initialization for the application. */
class Configuration {
	/**
	 * Creates a TraxPlayer instance with the specified movieClip and playerListener.
	 * @param {PlayerListener} playerListener - The listener for player events.
	 * @returns The initialized TraxPlayer.
	 */
	static createTraxPlayer(playerListener) {
		const sampleUrl = Configuration.getSampleUrl();
		const songUrl = Configuration.getSongUrl();
		Logger.log(`songUrl=${songUrl} sampleUrl=${sampleUrl}`);

		const player = new Player();
		player.setPlayerListener(playerListener);

		const song = new Song(movieClip);
		player.addSong(song);

		const songLoader = new SongLoader(sampleUrl);
		songLoader.load(songUrl, song);

		return player;
	}

	/** Gets the sample URL for loading audio samples. */
	static getSampleUrl() {
		return 'http://images.habbogroup.com/dcr/hof_furni/mp3/';
	}

	/** Gets the song URL for loading a song. */
	static getSongUrl() {
		return 'http://export.habbo.fr/trax/song/31708';
	}

	/** The main entry point of the application. */
	static main() {
		const playerListener = new TestPlayerListener();
		const player = Configuration.createTraxPlayer(playerListener);

		setInterval(() => player.startPlaying(), 10000);
		setInterval(() => player.stopPlaying(), 15000);
	}
}

export { Configuration };
