function analyzeMusic(musicCode) {
	// Divide a música em camadas
	const layers = musicCode.split(":").map(layerInfo => {
		const layerData = layerInfo.split(";").map(slotInfo => {
			const [soundId, slotsUsed] = slotInfo.split(",");
			return {
				soundId: parseInt(soundId),
				slotsUsed: parseFloat(slotsUsed),
			};
		});
		return layerData;
	});

	// Calcula o total de slots usados máximo entre todas as camadas
	let maxSlotsUsed = 0;

	layers.forEach(layer => {
		const totalSlotsUsed = layer.reduce((acc, slot) => acc + slot.slotsUsed, 0);
		if (totalSlotsUsed > maxSlotsUsed) {
			maxSlotsUsed = totalSlotsUsed;
		}
	});

	// Divide a música em camadas para a segunda parte
	const silentLayers = musicCode.split(":").map(layerInfo => {
		const layerData = layerInfo.split(";").flatMap(slotInfo => {
			const [soundId, slotsUsed] = slotInfo.split(",");
			return Array.from({ length: parseInt(slotsUsed) }, () => parseInt(soundId));
		});
		return layerData;
	});

	// Encontre o tamanho da maior camada
	const maxLayerSize = Math.max(...silentLayers.map(layer => layer.length));

	// Inicializa as variáveis para acompanhar o maior trecho consecutivo
	let maxConsecutiveZeroSlots = 0;
	let currentConsecutiveZeroSlots = 0;

	// Itera pelos slots em todas as camadas até o tamanho da maior camada
	for (let i = 0; i < maxLayerSize; i++) {
		const soundIdsAtPosition = silentLayers.map(layer => layer[i]);

		if (soundIdsAtPosition.every(val => val === 0 || val === undefined)) {
			currentConsecutiveZeroSlots++;
		} else {
			if (currentConsecutiveZeroSlots > maxConsecutiveZeroSlots) {
				maxConsecutiveZeroSlots = currentConsecutiveZeroSlots;
			}
			currentConsecutiveZeroSlots = 0;
		}
	}

	const musicDuration = maxSlotsUsed * 2;
	const largestSilentGap = maxConsecutiveZeroSlots * 2;

	return {
		musicDuration,
		largestSilentGap,
	};
}
