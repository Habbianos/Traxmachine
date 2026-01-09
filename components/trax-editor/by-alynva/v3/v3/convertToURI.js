const serialize = function(obj, prefix) {

	const str = [];

	for(const p in obj) {

		if (obj.hasOwnProperty(p)) {

			const k = prefix ? prefix + "-" + p + "" : p, v = obj[p];

			str.push(typeof v == "object" ?

				serialize(v, k) :

				encodeURIComponent(k) + "=" + encodeURIComponent(v));

		}

	}

	return str.join("&");

}