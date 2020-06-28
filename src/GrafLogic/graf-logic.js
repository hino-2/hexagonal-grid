import HexGrid from "../Drawing/hex-grid";

const hg = new HexGrid();
const getNeighbor = hg.getNeighbor;

const floodFill = (h, color, hexMap, selected) => {
	if (h.color) return;

	h.color = color;
	selected.find(({ q, r, s }) => q === h.q && r === h.r && s === h.s).color = color;

	for (let i = 0; i <= 5; i++) {
		const neighbor = getNeighbor(h, i);
		const neighborOnMap = hexMap.find(({ q, r, s }) => q === neighbor.q && r === neighbor.r && s === neighbor.s);
		if (neighborOnMap && neighborOnMap.checked) floodFill(neighborOnMap, color, hexMap, selected);
	}
};

export const splitSelectedToDomains = (selected) => {
	let domains = [];
	selected.forEach((s) => {
		const existingDomain = domains.find((d) => d.color === s.color);
		if (existingDomain) {
			existingDomain.hexs.push({
				q: s.q,
				r: s.r,
				s: s.s,
			});
		} else {
			domains.push({
				color: s.color,
				hexs: [{ q: s.q, r: s.r, s: s.s }],
			});
		}
	});

	return domains;
};

export const floodFillHexMap = (hexMap, selected) => {
	hexMap
		.filter((h) => h.checked)
		.forEach((h) => {
			const color =
				"#" +
				Math.round(Math.random() * 2 ** 24 - 1)
					.toString(16)
					.padStart(6, "0");
			floodFill(h, color, hexMap, selected);
		});
};

export const checkIfMultiConnected = (d, hexMap, selected, totalNumberOfDomains) => {
	let _mcHexMap, _mcSelected;
	let i = 0;

	if (d.hexs.length <= 2) return 0;

	d.hexs.forEach(({ q, r, s }) => {
		_mcSelected = JSON.parse(
			JSON.stringify(selected.filter(({ q: _q, r: _r, s: _s }) => [q, r, s].join(",") !== [_q, _r, _s].join(",")))
		);
		_mcHexMap = JSON.parse(
			JSON.stringify(hexMap.filter(({ q: _q, r: _r, s: _s }) => [q, r, s].join(",") !== [_q, _r, _s].join(",")))
		);

		_mcHexMap.forEach((h) => (h.color = undefined));
		_mcSelected.forEach((h) => (h.color = undefined));
		floodFillHexMap(_mcHexMap, _mcSelected);

		const newNumberOfDomains = new Set(_mcSelected.map((s) => s.color)).size;

		if (totalNumberOfDomains === newNumberOfDomains) i++;
	});

	if (i === d.hexs.length) return 1;
	return 0;
};
