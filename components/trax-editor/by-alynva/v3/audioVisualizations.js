
	/* Hoist some variables. */
	let audio, context;

	/* Try instantiating a new AudioContext, throw an error if it fails. */
	try {
		/* Setup an AudioContext. */
		context = new AudioContext();
	} catch(e) {
		throw new Error('The Web Audio API is unavailable');
	}

	/* Create a script processor node with a `bufferSize` of 1024. */
	const processor = context.createScriptProcessor(1024),
	    /* Create an analyser node */
	    analyser = context.createAnalyser();

	/* Wire the processor into our audio context. */
	processor.connect(context.destination);
	/* Wire the analyser into the processor */
	analyser.connect(processor);

	/* Define a Uint8Array to receive the analysers data. */
	let data = new Uint8Array(analyser.frequencyBinCount);

	/* Start of the visual component, let's define some constants. */
	const NUM_OF_SLICES = Math.ceil(window.innerWidth / 21);

	/* Define a `Sound` Class */
	const Sound = {
	    /* Give the sound an element property initially undefined. */
	    element: undefined,
	    /* Define a class method of play which instantiates a new Media Element
	     * Source each time the file plays, once the file has completed disconnect 
	     * and destroy the media element source. */
	    play: function() {
			context.resume()
	    	clearInterval(fadeFake);
			/* Call `play` on the MediaElement. */
	        	this.element.play();
	    },
	    pause: function() {
	    	// if (document.getElementById("stop").disabled == true) {
	    		window.musicPlaying = true;
	    		render();
	    		fadeFake = setTimeout(function() {
	    			window.musicPlaying = false;
	    		}, 1000);
				this.element.pause();
	    	// }
	    },
	    setAudioStream: function() {
			let sound
			/* Try instantiating a new AudioContext, throw an error if it fails. */
			try {
				/* Setup an AudioContext. */
		    	sound = context.createMediaElementSource(this.element);
			} catch(e) {
				// const src = this.element.src;
				// const currentTime = this.element.currentTime;
				// this.element.pause();
	   //  		this.element = new Audio();
	   //  		this.element.src = src;
	   //  		this.element.currentTime = currentTime;
				// // context = new AudioContext();
		    	sound = context.createMediaElementSource(this.element);
				// throw new Error('Bla bla bla bla bla');
			}
	        // this.element.onended = function() {
	        //     sound.disconnect();
	        //     sound = null;
	        //     /* Noop the audioprocess handler when the file finishes. */
	        //     processor.onaudioprocess = function() {};
	        // }
	        /* Add the following line to wire into the analyser. */
	        sound.connect(analyser);
	       	sound.connect(context.destination);

	       	processor.onaudioprocess = function() {
	       		analyser.fftSize = Math.pow(2, Math.ceil(Math.log2(NUM_OF_SLICES * 64)));
			    data = new Uint8Array(analyser.frequencyBinCount);
			    /* Populate the data array with the frequency data. */
			    // analyser.getByteTimeDomainData(data);
			    /* Populate the data array with the waveform data. */
				analyser.getByteFrequencyData(data);
			};
	    }
	};
	let fadeFake;
	/* Create an async function which returns a promise of a playable audio element. */
	function loadAudioElement(url, i) {
		return new Promise(function(resolve, reject) {
			const audio = new Audio();
			audio.addEventListener('canplay', function() {
								// console.log(i);
				/* Resolve the promise, passing through the element. */
				resolve([audio, i]);
			});
			/* Reject the promise on an error. */
			audio.addEventListener('error', reject);
			audio.src = url;
			// audio.setAttribute("loop", true);
			audio.crossOrigin = 'anonymous';
		});
	}

	/* Let's load our file. */
	// loadAudioElement('../sounds/sound_machine_sample_4.mp3').then(function(elem) {
	// 	/* Instantiate the Sound class into our hoisted variable. */
	// 	audio = Object.create(Sound);
	// 		 Set the element of `audio` to our MediaElement. 
	// 	audio.element = elem;
	// 	/* Immediately play the file. */
	// 	audio.play();
	// }, function(elem) {
	//     /* Let's throw an the error from the MediaElement if it fails. */
	//     throw elem.error;
	// });


	/* The `STEP` constant allows us to step through all the data we receive,
	 * instead of just the first `NUM_OF_SLICES` elements in the array. */
	const STEP = Math.floor(data.length / NUM_OF_SLICES),
		/* When the analyser receives no data, all values in the array will be 128. */
		NO_SIGNAL = 128;

	/* Get the element we want to 'slice'. */
	const logo = document.querySelector('.logo-container');

	/* We need to store our 'slices' to interact with them later. */
	const slices = []
		rect = logo.getBoundingClientRect(),
		// rect = document.querySelector('#demo'),
		/* Thankfully Chrome supplies us a width and
		 * height property in our `TextRectangle` object. */
		width = rect.width,
	    height = rect.height,
	    // widthPerSlice = width / NUM_OF_SLICES;
	    widthPerSlice = 21;

	/* Create a container `<div>` to hold our 'slices'. */
	const container = document.createElement('div');
	// const container = document.getElementById('demo');
	container.className = 'container';
	// container.style.width = width + 'px';
	// container.style.height = height + 'px';

	const offsetXModuleClasses = [];
	/* Let's create our 'slices'. */
	function createSlices(i) {
		/* Calculate the `offset` for each individual 'slice'. */
		const offset = i * widthPerSlice;

		/* Create a mask `<div>` for this 'slice'. */
	    const mask = document.createElement('div');
	    mask.className = 'mask';
	    mask.style.width = widthPerSlice + 'px';
	    /* For the best performance, and to prevent artefacting when we
	     * use `scale` we instead use a 2d `matrix` that is in the form:
	     * matrix(scaleX, 0, 0, scaleY, translateX, translateY). We initially
	     * translate by the `offset` on the x-axis. */
	    mask.style.transform = 'translate(' + offset + 'px, ' + 0 + 'px)';

	    /* Clone the original element. */
	    const clone = logo.cloneNode(true);
	    clone.className = 'clone';
	    clone.style.width = width + 'px';
	    /* We won't be changing this transform so we don't need to use a matrix. */
	    // clone.style.transform = 'translate3d(' + -offset + 'px,0,0)';
	    clone.style.height = mask.style.height = (Math.ceil(Math.ceil(height * 2) / widthPerSlice) * widthPerSlice) + 'px';

	    mask.appendChild(clone);
	    container.appendChild(mask);

	    /* We need to maintain the `offset` for when we
	     * alter the transform in `requestAnimationFrame`. */
	    slices.push({ offset: offset, elem: mask });

		offsetXModuleClasses[i] = (((Math.floor(Math.random() * 8)) * (widthPerSlice - 2) * -1) + 1);
	}
	for (let i = 0; i < NUM_OF_SLICES; i++)
		createSlices(i);

	/* Replace the original element with our new container of 'slices'. */
	document.body.replaceChild(container, logo);

	/* Create our `render` function to be called every available frame. */
	function render() {
		if (window.musicPlaying) {
			// height = window.innerHeight;
			const NUM_OF_SLICES = Math.ceil(window.innerWidth / 21);
			/* Request a `render` on the next available frame.
			 * No need to polyfill because we are in Chrome. */
	    	requestAnimationFrame(render);

	    	/* Loop through our 'slices' and use the STEP(n) data from the
	    	 * analysers data. */
	    	for (let i = 0, n = 0; i < NUM_OF_SLICES; i++, n+=STEP) {
	    		if (!slices[i]) createSlices(i);
	    		const val = Math.abs(data[n]) / NO_SIGNAL;
	    		const slice = slices[i],
	    			elem = slice.elem,
	    			offsetX = slice.offset;
	    			offsetY = (Math.ceil(((Math.abs(val) * -0.6 * height) + (0 * 1)) / widthPerSlice) * widthPerSlice);

	    		/* Make sure the val is positive and divide it by `NO_SIGNAL`
	    		 * to get a value suitable for use on the Y scale. */
	    		/* Change the scaleY value of our 'slice', while keeping it's
	    		 * original offset on the x-axis. */
	    		elem.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
	    		elem.querySelector('.logo').style.backgroundPosition = offsetXModuleClasses[i] + 'px ' + ((offsetY * -1) - 0) + 'px, 0 0, 1px ' + (Math.ceil(((offsetY * -1) - height) / widthPerSlice) * widthPerSlice) + 'px';
	    		// elem.style.transform = 'matrix(1,0,0,' + val + ',' + offset + ',1)';
	    		// elem.style.height = (val * height)+"px";
	    		// elem.querySelector('.logo').style.opacity = 0;
	    	}
	    } else {
	    	console.log(window.musicPlaying);
	    }
    }

    /* Call the `render` function initially. */
    render();

