import { HabboMusicEvents } from './HabboMusicEvents.mjs';
import { HabboSoundManagerFlash10 } from './HabboSoundManagerFlash10.mjs';
import { SongObject } from './SongObject.mjs';
import { SoundObject } from './SoundObject.mjs';
import { TraxSongData } from './TraxSongData.mjs';
import { TraxSongEvent } from './TraxSongEvent.mjs';

/**
 * Habbo music controller.
 * Currently its missing some properties, @sources tags and methods
 *
 * @source §_-Lr§/HabboMusicController.as
 */
class HabboMusicController {
	/** @type {Map<number, SongObject>} songId/songObject */
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
	 * @param {IEventDispatcher} eventDispatcher1 - The event dispatcher 1.
	 * @param {IEventDispatcher} eventDispatcher2 - The event dispatcher 2.
	 */
	constructor(soundManager, eventDispatcher1, eventDispatcher2) {
		this.soundManager = soundManager;
		this.eventDispatcher1 = eventDispatcher1;
		this.eventDispatcher2 = eventDispatcher2;

		this.eventDispatcher2.addEventListener(
			HabboMusicEvents.ROSM_JUKEBOX_INIT,
			this.onJukeboxInit
		);
		this.eventDispatcher2.addEventListener(
			HabboMusicEvents.ROSM_JUKEBOX_DISPOSE,
			this.onJukeboxDispose
		);
		this.eventDispatcher2.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_INIT,
			this.onSoundMachineInit
		);
		this.eventDispatcher2.addEventListener(
			HabboMusicEvents.ROSM_SOUND_MACHINE_DISPOSE,
			this.onSoundMachineDispose
		);

		setTimeout(this.onSongChangeTimer, 1000);

		this.eventDispatcher1.addEventListener(
			HabboMusicEvents.SCE_TRAX_SONG_COMPLETE,
			this.onTraxSongComplete
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
	handleSongInfoReceived(traxSongEvent) {
		/** @type {TraxSongData[]} */
		const songDataArray = traxSongEvent.getSongDataArray();

		for (let i = 0; i < songDataArray.length; i++) {
			const songData = songDataArray[i];
			const isSongNew = !this.songMap.has(songData.id);
			const isSongPlaying = this.isSongPlaying(songData.id);

			if (isSongNew) {
				/** @type {SoundObject} */
				let soundObject = null;
				if (isSongPlaying) {
					soundObject = this.soundManager.getOrCreateSoundObject(
						songData.id,
						songData.data
					);
				}

				const newSong = new SongObject(
					songData.id,
					songData.length,
					songData.title,
					songData.creator,
					soundObject
				);

				newSong.data = songData.data;
				this.songMap.set(songData.id, newSong);

				const songCount = this.getSongCount();
				const firstUnplayedSongId = this.getFirstUnplayedSongId();

				if (
					soundObject !== null &&
					soundObject.ready &&
					songData.id === firstUnplayedSongId
				) {
					this.playSong(songCount, firstUnplayedSongId);
				}

				this.dispatchEvent(
					new CustomEvent('songReceived', { detail: songData.id })
				);

				while (this.playingSongs.indexOf(songData.id) !== -1) {
					this.playingSongs.splice(this.playingSongs.indexOf(songData.id), 1);
					if (this.playingSongs.length === 0) {
						this.dispatchEvent(new CustomEvent('allSongsReceived'));
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
