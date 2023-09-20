import { HabboMusicController } from './HabboMusicController.mjs';
import { HabboMusicEvents } from './HabboMusicEvents.mjs';
import { HabboSoundManagerFlash10 } from './HabboSoundManagerFlash10.mjs';
import { SongObject } from './SongObject.mjs';
import { Connection } from './interface/Connection.mjs';
import { HPlayListEvent, HPlayListSongAddedEvent } from './message/events.mjs';
import { Priority } from './utils/Priority.mjs';

/**
 * Currently its missing the meaning of the EventListeners and the meaning of
 * the getter/setter `unknown_6Q8`
 * @source §_-Lr§.SoundMachinePlayListController
 */
class SoundMachinePlayListController {
	/**
	 * @source SoundMachinePlayListController.§_-27G§
	 * @type {HabboSoundManagerFlash10}
	 */
	#soundManager;

	/**
	 * The priority value.
	 * @source SoundMachinePlayListController.priority
	 */
	get priority() {
		return Priority.LOW;
	}

	/**
	 * @source SoundMachinePlayListController.§_-1my§
	 * @type {HabboMusicController}
	 */
	#musicController;

	/**
	 * @source SoundMachinePlayListController.§_-370§
	 * @type {Connection}
	 */
	#connection;

	/**
	 * @source SoundMachinePlayListController.§_-X8§
	 * @type {EventListener}
	 */
	#unknown_X8;

	/**
	 * @source SoundMachinePlayListController.§_-5K-§
	 * @type {EventListener}
	 */
	#unknown_5K;

	/**
	 * @source SoundMachinePlayListController.§_-3eQ§
	 */
	#currentSongId = -1;

	/**
	 * @source SoundMachinePlayListController.§_-4KL§
	 */
	get currentSongId() {
		return this.#currentSongId;
	}

	/**
	 * @source SoundMachinePlayListController.§_-0Gs§
	 * @type {SongObject[]}
	 */
	#playlist;

	/**
	 * The length of the playlist.
	 * @source SoundMachinePlayListController.length
	 * @type {number}
	 */
	get length() {
		if (this.#playlist === null) {
			return 0;
		}
		return this.#playlist.length;
	}

	/**
	 * @source SoundMachinePlayListController.§_-66A§
	 * @type {boolean}
	 */
	#isPlaying;

	/**
	 * @source SoundMachinePlayListController.isPlaying
	 */
	get isPlaying() {
		return this.#isPlaying;
	}

	/**
	 * @source SoundMachinePlayListController.§_-2WO§
	 * @type {any[]}
	 */
	#unknown_2WO;

	/**
	 * @source SoundMachinePlayListController.§_-6Q8§
	 * @type {number}
	 */
	get unknown_6Q8() {
		return -1;
	}

	/**
	 * @source SoundMachinePlayListController.§_-6Q8§
	 * @param {number} k
	 */
	set unknown_6Q8(k) {}

	/**
	 * @param {HabboSoundManagerFlash10} soundManager - The Habbo Sound Manager.
	 * @param {HabboMusicController} musicController - The Habbo Music Controller.
	 * @param {EventListener} eventDispatcher1 - The first event dispatcher.
	 * @param {EventListener} eventDispatcher2 - The second event dispatcher.
	 * @param {Connection} connection - The connection object.
	 */
	constructor(
		soundManager,
		musicController,
		eventDispatcher1,
		eventDispatcher2,
		connection
	) {
		this.#playlist = [];
		super();
		this.#soundManager = soundManager;
		this.#unknown_X8 = eventDispatcher1;
		this.#unknown_5K = eventDispatcher2;
		this.#connection = connection;
		this.#musicController = musicController;
		this.#unknown_2WO = [];
		this.#unknown_2WO.push(new HPlayListEvent(this.#handlePlaylistEvent));
		this.#unknown_2WO.push(
			new HPlayListSongAddedEvent(this.#handlePlaylistAddedSong)
		);

		for (const listener of this.#unknown_2WO) {
			this.#connection.addMessageEvent(listener);
		}

		this.#unknown_X8.addEventListener(
			HabboMusicEvents.SCE_TRAX_SONG_COMPLETE,
			this.#handleSongComplete
		);
		this.#unknown_X8.addEventListener(
			HabboMusicEvents.SIR_TRAX_SONG_INFO_RECEIVED,
			this.#handleSongInfo
		);
		this.#unknown_5K.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_SWITCHED_ON,
			this.#handleTurnOn
		);
		this.#unknown_5K.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_SWITCHED_OFF,
			this.#handleTurnOff
		);
	}

	/**
	 * @source SoundMachinePlayListController.§_-2BW§
	 * @param {Event} k */
	#handleTurnOn(k) {
		this.startPlaylist();
	}

	/**
	 * @source SoundMachinePlayListController.§_-2sc§
	 * @param {Event} k
	 */
	#handleTurnOff(k) {
		this.stopPlaylist();
	}

	/**
	 * Start the playlist if it's not already playing.
	 * @source SoundMachinePlayListController.§_-6Er§
	 */
	startPlaylist() {
		if (this.#isPlaying) {
			return;
		}

		if (this.#playlist === null || this.#playlist.length === 0) {
			this.getPlayList();
			this.#isPlaying = true;
			return;
		}

		this.stopPlaylist();
		this.#currentSongId = -1;
		this.#isPlaying = true;
		this.#getNextSongAndPlay();
	}

	/**
	 * @source SoundMachinePlayListController.§_-1rf§
	 * @param {number} songId
	 */
	restartAndPlayNext(songId) {
		if (this.#currentSongId === songId) {
			this.#playSong(this.#currentSongId);
			const _loc2_ = this.#getSongToPlay();
			if (_loc2_ != null) {
				this.#musicController.unknown_48g(_loc2_.id);
			}
		}
	}

	/**
	 * @source SoundMachinePlayListController.§_-26I§
	 * @returns {void}
	 */
	stopPlaylist() {
		this.#currentSongId = -1;
		this.#isPlaying = false;
		this.#musicController.stop(Priority.LOW);
	}

	/**
	 * @source SoundMachinePlayListController.§_-5eR§
	 * @param {number} k
	 * @returns {void}
	 */
	unknown_5eR(k) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-23Z§
	 * @param {SongObject} param1
	 * @param {number} [param2=0]
	 */
	unknown_23Z(param1, param2 = 0) {
		return -1;
	}

	/**
	 * @source SoundMachinePlayListController.§_-5IP§
	 * @param {number} param1
	 * @param {number} param2
	 */
	unknown_5IP(param1, param2) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-6v§
	 * @param {number} k
	 */
	unknown_6v(k) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-1wQ§
	 * @param {Unknown_3wA} k
	 */
	#handleSongComplete(k) {
		if (k.id === this.#currentSongId) {
			this.#getNextSongAndPlay();
		}
	}

	/**
	 * Handle song info.
	 * @source SoundMachinePlayListController.§_-1qh§
	 * @param {SongInfoEvent} songInfoEvent - The song info event.
	 */
	#handleSongInfo(songInfoEvent) {
		if (this.#playlist === null || this.#playlist.length === 0) {
			return;
		}
		for (var index = 0; index < this.#playlist.length; ) {
			const currentSong = this.#playlist[index];
			if (currentSong.id === songInfoEvent.id) {
				const updatedSongInfo = this.#musicController.getSongInfo(
					songInfoEvent.id
				);
				if (updatedSongInfo !== null) {
					this.#playlist[index] = updatedSongInfo;
				}
				return;
			}
			index++;
		}
	}

	/**
	 * Get the next song to play and start playing it.
	 * @source SoundMachinePlayListController.§_-1MN§
	 */
	#getNextSongAndPlay() {
		const nextSong = this.#getSongToPlay();
		if (nextSong !== null) {
			this.#currentSongId = nextSong.id;
			this.#playSong(this.#currentSongId);
		}
	}

	/**
	 * Start playing the specified song.
	 * @source SoundMachinePlayListController.§_-64G§
	 * @param {number} songId - The ID of the song to play.
	 */
	#playSong(songId) {
		const songToPlay = this.getSongById(songId);
		if (songToPlay === null) {
			return;
		}

		const originalVolume = songToPlay.volume;
		songToPlay.volume = 0;

		if (
			this.#musicController.playTraxSong(
				songId,
				Priority.LOW,
				originalVolume,
				0,
				0,
				0
			)
		) {
			console.log(
				'Trax song started by playlist: ' +
					songToPlay.name +
					' by ' +
					songToPlay.creator
			);
		}
	}

	/**
	 * Get the next song in the playlist.
	 * @source SoundMachinePlayListController.§_-1DP§
	 */
	#getSongToPlay() {
		if (this.#playlist === null || this.#playlist.length === 0) {
			return null;
		}

		let nextIndex = 0;
		for (let i = 0; i < this.#playlist.length; i++) {
			const song = this.#playlist[i];
			if (song.id === this.#currentSongId) {
				nextIndex = i + 1;
			}
		}

		if (nextIndex >= this.#playlist.length) {
			nextIndex = 0;
		}

		return this.#playlist[nextIndex];
	}

	/**
	 * Get a song at the specified index in the playlist.
	 * @source SoundMachinePlayListController.§_-024§
	 * @param {number} index - The index of the song to retrieve.
	 */
	getSongAtIndex(index) {
		if (
			this.#playlist === null ||
			index < 0 ||
			index >= this.#playlist.length
		) {
			return null;
		}
		return this.#playlist[index];
	}

	/**
	 * Get a song in the playlist by its ID.
	 * @source SoundMachinePlayListController.§_-n-§
	 * @param {number} id - The ID of the song to retrieve.
	 */
	getSongById(id) {
		if (this.#playlist === null || this.#playlist.length === 0) {
			return null;
		}

		for (let i = 0; i < this.#playlist.length; i++) {
			const song = this.#playlist[i];
			if (song.id === id) {
				return song;
			}
		}

		return null;
	}

	/**
	 * Send a command to get the sound machine's playlist.
	 * @source SoundMachinePlayListController.§_-1lm§
	 */
	getPlayList() {
		if (this.#connection === null) {
			return;
		}
		this.#connection.send(new GetSoundMachinePlayListComposer());
	}

	/**
	 * Convert an array of playlist entries to an array of SongObject instances.
	 * @source SoundMachinePlayListController.§_-45K§
	 * @param {PlayListEntry[]} entries - An array of playlist entries to convert.
	 */
	#convertEntries(entries) {
		const songObjects = [];
		for (const entry of entries) {
			songObjects.push(
				new SongObject(entry.id, entry.length, entry.name, entry.creator, null)
			);
		}
		return songObjects;
	}

	/**
	 * Handle a playlist event, updating the playlist and current song.
	 * @source SoundMachinePlayListController.§_-4sW§
	 * @param {HPlayListEvent} event - The playlist event to handle.
	 */
	#handlePlaylistEvent(event) {
		const playListParser = event.getParser();
		if (!playListParser) {
			return;
		}

		const synchronizationCount = playListParser.synchronizationCount;
		const entries = playListParser.playlist;

		if (!entries || entries.length === 0) {
			return;
		}

		this.#playlist = this.#convertEntries(entries);
		let totalLength = 0;

		for (const entry of this.#playlist) {
			totalLength += entry.length;
		}

		if (synchronizationCount < 0) {
			synchronizationCount = 0;
		}

		synchronizationCount = synchronizationCount % totalLength;

		let entry;
		for (let i = 0; i < this.#playlist.length; i++) {
			entry = this.#playlist[i];
			if (synchronizationCount > entry.length) {
				synchronizationCount -= entry.length;
				continue;
			}

			this.#currentSongId = entry.id;
			entry.syncPosition = Number(synchronizationCount) / 1000;
			break;
		}

		this.#unknown_X8.dispatchEvent(
			new HabboMusicEvents(HabboMusicEvents.PLUE_PLAY_LIST_UPDATED)
		);
		if (entry !== null && this.#isPlaying) {
			this.#playSong(entry.id);
		}
	}

	/**
	 * Handle a playlist song added event, adding the song to the playlist and starting playback if needed.
	 * @source SoundMachinePlayListController.§_-3wL§
	 * @param {HPlayListSongAddedEvent} event - The playlist song added event to handle.
	 */
	#handlePlaylistAddedSong(event) {
		const songAddedParser = event.getParser();
		const newSong = new SongObject(
			songAddedParser.entry.id,
			songAddedParser.entry.length,
			songAddedParser.entry.name,
			songAddedParser.entry.creator,
			null
		);

		if (newSong === null) {
			return;
		}

		this.#playlist.push(newSong);

		this.#unknown_X8.dispatchEvent(
			new HabboMusicEvents(HabboMusicEvents.PLUE_PLAY_LIST_UPDATED)
		);

		if (!this.#isPlaying) {
			return;
		}
		if (this.#playlist.length === 1) {
			this.#playSong(newSong.id);
		} else {
			this.restartAndPlayNext(newSong.id);
		}
	}
}

export { SoundMachinePlayListController };
