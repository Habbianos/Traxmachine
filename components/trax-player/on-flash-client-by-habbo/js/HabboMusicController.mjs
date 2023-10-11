import { HabboMusicEvents } from './HabboMusicEvents.mjs';
import { HabboSoundManagerFlash10 } from './HabboSoundManagerFlash10.mjs';
import { SongDataEntry } from './SongDataEntry.mjs';
import { SoundObject } from './interface/SoundObject.mjs';
import { TraxSongData } from './TraxSongData.mjs';
import { TraxSongEvent } from './TraxSongEvent.mjs';

/**
 * Habbo music controller.
 * Currently its missing some properties, @sources tags and methods
 *
 * @source §_-Lr§/HabboMusicController.as
 */
class HabboMusicController {
	/** @type {Map<number, SongDataEntry>} songId/SongDataEntry */
	songMap = new Map();
	/** @type {Map<number, boolean>} songId/boolean */
	playListMap = new Map();
	playListItems = [];
	musicTracks = [];
	jukeBoxMap = new Map();
	roomSongMap = new Map();
	roomPlaylistItems = [];

	/** @type {HabboSoundManagerFlash10} */
	soundManager;

	/**
	 * @param {HabboSoundManagerFlash10} soundManager - The Habbo sound manager.
	 * @param {IEventDispatcher} events - The event dispatcher 1.
	 * @param {IEventDispatcher} roomEvents - The event dispatcher 2.
	 */
	constructor(soundManager, events, roomEvents) {
		this.soundManager = soundManager;
		this.events = events;
		this.roomEvents = roomEvents;

		this.roomEvents.addEventListener(
			HabboMusicEvents.ROSM_JUKEBOX_INIT,
			this.onJukeboxInit
		);
		this.roomEvents.addEventListener(
			HabboMusicEvents.ROSM_JUKEBOX_DISPOSE,
			this.onJukeboxDispose
		);
		this.roomEvents.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_INIT,
			this.onSoundMachineInit
		);
		this.roomEvents.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_DISPOSE,
			this.onSoundMachineDispose
		);

		setTimeout(this.sendNextSongRequestMessage, 1000);

		this.events.addEventListener(
			HabboMusicEvents.SCE_TRAX_SONG_COMPLETE,
			this.onSongFinishedPlayingEvent
		);

		for (let i = 0; i < PlaylistItem.MAX_SONGS; i++) {
			this.playListItems[i] = null;
			this.musicTracks[i] = 0;
		}
	}

	/**
	 * Manipulates the reception of music information.
	 * @source HabboMusicController.§_-3Fb§
	 * @param {TraxSongEvent} traxSongEvent - The received music information.
	 */
	onSongInfoMessage(traxSongEvent) {
		/** @type {TraxSongData[]} */
		const songDataArray = traxSongEvent.getSongDataArray();

		for (let i = 0; i < songDataArray.length; i++) {
			const songData = songDataArray[i];
			const isSongNew = this.getSongDataEntry(songData.id) == null;
			const isSongPlaying = this.areSamplesRequested(songData.id);

			if (isSongNew) {
				/** @type {SoundObject} */
				let soundObject = null;
				if (isSongPlaying) {
					soundObject = this.soundManager.loadTraxSong(
						songData.id,
						songData.data
					);
				}

				const newSong = new SongDataEntry(
					songData.id,
					songData.length,
					songData.title,
					songData.creator,
					soundObject
				);

				newSong.data = songData.data;
				this.songMap.set(songData.id, newSong);

				const priority = this.getTopRequestPriority();
				const songId = this.getSongIdRequestedAtPriority(priority);

				if (
					soundObject !== null &&
					soundObject.ready &&
					songData.id === songId
				) {
					this.playSongObject(priority, songId);
				}

				this.dispatchEvent(
					new SongInfoReceivedEvent('SIR_TRAX_SONG_INFO_RECEIVED', songData.id)
				);

				while (this.playingSongs.indexOf(songData.id) !== -1) {
					this.playingSongs.splice(this.playingSongs.indexOf(songData.id), 1);
					if (this.playingSongs.length === 0) {
						this.dispatchEvent(new SongDiskInventoryReceivedEvent('SDIR_SONG_DISK_INVENTORY_RECEIVENT_EVENT'));
					}
				}

				console.log('Received song info: ' + songData.id);
			}
		}
	}

	isSongPlaying(songId) {
		return !!this.playListMap.get(songId);
	}
}

export { HabboMusicController };
