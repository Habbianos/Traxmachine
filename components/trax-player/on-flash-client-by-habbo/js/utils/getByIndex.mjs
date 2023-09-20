//
// THIS FILE IS JUST A POLYFILL OF SOME `Map` METHODS THAT AREN'T AVAILABLE IN
// THE JAVASCRIPT VERSION.
//

/**
 * Get the key from the Map at the specified index.
 *
 * @template K, V
 * @param {Map<K, V>} map - The Map to be searched.
 * @param {number} index - The index of the desired key.
 * @returns {K|null} - The key associated with the specified index or null if the index is out of bounds.
 */
function getKeyByIndex(map, index) {
	let i = 0;
	/** @type {K} */
	let key = null;

	for (const [k] of map.entries()) {
		if (i === index) {
			key = k;
			break;
		}
		i++;
	}

	return key;
}

/**
 * Get the value from the Map at the specified index.
 *
 * @template K, V
 * @param {Map<K, V>} map - The Map to be searched.
 * @param {number} index - The index of the desired value.
 * @returns {V|null} - The value associated with the specified index or null if the index is out of bounds.
 */
function getValueByIndex(map, index) {
	let i = 0;
	/** @type {V} */
	let value = null;

	for (const [_, val] of map.entries()) {
		if (i === index) {
			value = val;
			break;
		}
		i++;
	}

	return value;
}

export { getKeyByIndex, getValueByIndex };
