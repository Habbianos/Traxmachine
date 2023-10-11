import { HabboMusicController } from './HabboMusicController.mjs';
import { HabboMusicEvents } from './HabboMusicEvents.mjs';
import { HabboSoundManagerFlash10 } from './HabboSoundManagerFlash10.mjs';
import { SongDataEntry } from './SongDataEntry.mjs';
import { Connection } from './interface/Connection.mjs';
import { HPlayListEvent, HPlayListSongAddedEvent } from './message/events.mjs';
import { HabboMusicPrioritiesEnum } from './utils/HabboMusicPrioritiesEnum.mjs';

/**
 * Currently its missing the meaning of the EventListeners and the meaning of
 * the getter/setter `playPosition`
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
		return HabboMusicPrioritiesEnum.PRIORITY_ROOM_PLAYLIST;
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
	#roomEvents;

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
	 * @type {SongDataEntry[]}
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
	#messageEvents;

	/**
	 * @source SoundMachinePlayListController.§_-6Q8§
	 * @type {number}
	 */
	get playPosition() {
		return -1;
	}

	/**
	 * @source SoundMachinePlayListController.§_-6Q8§
	 * @param {number} k
	 */
	set playPosition(k) {}

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
		this.#roomEvents = eventDispatcher2;
		this.#connection = connection;
		this.#musicController = musicController;
		this.#messageEvents = [];
		this.#messageEvents.push(new HPlayListEvent(this.#onPlayListMessage));
		this.#messageEvents.push(
			new HPlayListSongAddedEvent(this.#onPlayListSongAddedMessage)
		);

		for (const listener of this.#messageEvents) {
			this.#connection.addMessageEvent(listener);
		}

		this.#unknown_X8.addEventListener(
			HabboMusicEvents.SCE_TRAX_SONG_COMPLETE,
			this.#onSongFinishedPlayingEvent
		);
		this.#unknown_X8.addEventListener(
			HabboMusicEvents.SIR_TRAX_SONG_INFO_RECEIVED,
			this.#onSongInfoReceivedEvent
		);
		this.#roomEvents.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_SWITCHED_ON,
			this.#onSoundMachinePlayEvent
		);
		this.#roomEvents.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_SWITCHED_OFF,
			this.#onSoundMachineStopEvent
		);
	}

	/**
	 * @source SoundMachinePlayListController.§_-2BW§
	 * @param {Event} k */
	#onSoundMachinePlayEvent(k) {
		this.startPlaying();
	}

	/**
	 * @source SoundMachinePlayListController.§_-2sc§
	 * @param {Event} k
	 */
	#onSoundMachineStopEvent(k) {
		this.stopPlaying();
	}

	/**
	 * Start the playlist if it's not already playing.
	 * @source SoundMachinePlayListController.§_-6Er§
	 */
	startPlaying() {
		if (this.#isPlaying) {
			return;
		}

		if (this.#playlist === null || this.#playlist.length === 0) {
			this.requestPlayList();
			this.#isPlaying = true;
			return;
		}

		this.stopPlaying();
		this.#currentSongId = -1;
		this.#isPlaying = true;
		this.#playNextSong();
	}

	/**
	 * @source SoundMachinePlayListController.§_-1rf§
	 * @param {number} songId
	 */
	checkSongPlayState(songId) {
		if (this.#currentSongId === songId) {
			this.#playCurrentSongAndNotify(this.#currentSongId);
			const _loc2_ = this.#getNextEntry();
			if (_loc2_ != null) {
				this.#musicController.addSongInfoRequest(_loc2_.id);
			}
		}
	}

	/**
	 * @source SoundMachinePlayListController.§_-26I§
	 * @returns {void}
	 */
	stopPlaying() {
		this.#currentSongId = -1;
		this.#isPlaying = false;
		this.#musicController.stop(HabboMusicPrioritiesEnum.PRIORITY_ROOM_PLAYLIST);
	}

	/**
	 * @source SoundMachinePlayListController.§_-5eR§
	 * @param {number} k
	 * @returns {void}
	 */
	updateVolume(k) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-23Z§
	 * @param {SongDataEntry} param1
	 * @param {number} [param2=0]
	 */
	addItem(param1, param2 = 0) {
		return -1;
	}

	/**
	 * @source SoundMachinePlayListController.§_-5IP§
	 * @param {number} param1
	 * @param {number} param2
	 */
	moveItem(param1, param2) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-6v§
	 * @param {number} k
	 */
	removeItem(k) {
		// this function does nothing
	}

	/**
	 * @source SoundMachinePlayListController.§_-1wQ§
	 * @param {SoundCompleteEvent} k
	 */
	#onSongFinishedPlayingEvent(k) {
		if (k.id === this.#currentSongId) {
			this.#playNextSong();
		}
	}

	/**
	 * Handle song info.
	 * @source SoundMachinePlayListController.§_-1qh§
	 * @param {SongInfoEvent} songInfoEvent - The song info event.
	 */
	#onSongInfoReceivedEvent(songInfoEvent) {
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
	#playNextSong() {
		const nextSong = this.#getNextEntry();
		if (nextSong !== null) {
			this.#currentSongId = nextSong.id;
			this.#playCurrentSongAndNotify(this.#currentSongId);
		}
	}

	/**
	 * Start playing the specified song.
	 * @source SoundMachinePlayListController.§_-64G§
	 * @param {number} songId - The ID of the song to play.
	 */
	#playCurrentSongAndNotify(songId) {
		const songToPlay = this.getEntryWithId(songId);
		if (songToPlay === null) {
			return;
		}

		const unknown_1 = songToPlay.startPlayHeadPos;
		songToPlay.startPlayHeadPos = 0;

		if (
			this.#musicController.playSong(
				songId,
				HabboMusicPrioritiesEnum.PRIORITY_ROOM_PLAYLIST,
				unknown_1,
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
	#getNextEntry() {
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
	getEntry(index) {
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
	getEntryWithId(id) {
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
	requestPlayList() {
		if (this.#connection === null) {
			return;
		}
		this.#connection.send(new GetSoundMachinePlayListComposer());
	}

	/**
	 * Convert an array of playlist entries to an array of SongDataEntry instances.
	 * @source SoundMachinePlayListController.§_-45K§
	 * @param {PlayListEntry[]} entries - An array of playlist entries to convert.
	 */
	#convertParserPlayList(entries) {
		const songEntries = [];
		for (const entry of entries) {
			songEntries.push(
				new SongDataEntry(entry.id, entry.length, entry.name, entry.creator, null)
			);
		}
		return songEntries;
	}

	/**
	 * Handle a playlist event, updating the playlist and current song.
	 * @source SoundMachinePlayListController.§_-4sW§
	 * @param {HPlayListEvent} event - The playlist event to handle.
	 */
	#onPlayListMessage(event) {
		const playListParser = event.getParser();
		if (!playListParser) {
			return;
		}

		const synchronizationCount = playListParser.synchronizationCount;
		const entries = playListParser.playlist;

		if (!entries || entries.length === 0) {
			return;
		}

		this.#playlist = this.#convertParserPlayList(entries);
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
			entry.startPlayHeadPos = Number(synchronizationCount) / 1000;
			break;
		}

		this.#unknown_X8.dispatchEvent(
			new HabboMusicEvents(HabboMusicEvents.PLUE_PLAY_LIST_UPDATED)
		);
		if (entry !== null && this.#isPlaying) {
			this.#playCurrentSongAndNotify(entry.id);
		}
	}

	/**
	 * Handle a playlist song added event, adding the song to the playlist and starting playback if needed.
	 * @source SoundMachinePlayListController.§_-3wL§
	 * @param {HPlayListSongAddedEvent} event - The playlist song added event to handle.
	 */
	#onPlayListSongAddedMessage(event) {
		const songAddedParser = event.getParser();
		const newSong = new SongDataEntry(
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
			this.#playCurrentSongAndNotify(newSong.id);
		} else {
			this.checkSongPlayState(newSong.id);
		}
	}
}

export { SoundMachinePlayListController };
