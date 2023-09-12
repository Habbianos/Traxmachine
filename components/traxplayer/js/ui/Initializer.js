import { Configuration } from '../Configuration';
import { UiPlayerListener } from './UiPlayerListener';

/** Represents an initializer for setting up the application. */
class Initializer {

	/**
	 * Initializes the application by setting up various components.
	 * This method should be called to initialize the application.
	 */
	static initialize() {
		_root.globalSound = new Sound();
		_root.volume = 50;
		_root.controlbuttons.play.enabled = false;
		_root.volumecontrol.dragger.enabled = false;
		_root.playerListener = new UiPlayerListener(_root);
		_root.player = Configuration.createTraxPlayer(_root, _root.playerListener);
	}
}

export { Initializer };
