import React, { useState, createContext } from "react";
// import HexGrid from "../../Drawing/hex-grid";
import { log } from "../../Misc/console";

export const Context = createContext();

export const ContextProvider = (props) => {
	const changeHexGridParams = (newParams = {}) => {
		log("changeHexGridParams", "h3");
		setContext((prev) => {
			return { ...prev, ...newParams };
		});
	};

	// const setDomainsCount = (n) => {
	// 	setContext((prev) => {
	// 		return { ...prev, domainsCount: n };
	// 	});
	// };

	// const addHexToExistingDomain = ({ q, r, s, x, y }, existingDomain) => {
	// 	if (!existingDomain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s))
	// 		existingDomain.hexs.push({ q, r, s, x, y });
	// };

	// const joinDomains = (existingDomain, domainsNearby) => {
	// 	const result = Object.create(existingDomain);
	// 	domainsNearby.forEach((d) => {
	// 		d.hexs.forEach((h) => addHexToExistingDomain(h, result));
	// 	});
	// 	return result;
	// };

	const addHexToSelected = ({ q, r, s, x, y, color }) => {
		// const hg = new HexGrid();
		log("addHexToDomains", "h3");

		setContext((prev) => {
			//#region
			// let res = [];
			// let domains = [...prev.domains];
			// console.log("domains are", domains);

			// const existingDomain = domains.find((d) => d.color === color);
			// console.log("existingDomain", existingDomain);

			// if (existingDomain) {
			// 	addHexToExistingDomain({ q, r, s, x, y }, existingDomain);

			// 	// check if there are two different domains nearby and join them
			// 	const colorsNearby = hg.getColorsOfNeighbors({ q, r, s }, domains).filter((_c) => _c !== color);
			// 	const domainsNearby = domains.filter((d) => colorsNearby.includes(d.color));
			// 	console.log("colorsNearby", colorsNearby);

			// 	if (domainsNearby) {
			// 		const joinedDomain = joinDomains(existingDomain, domainsNearby);

			// 		res = [...domains.filter((d) => !colorsNearby.includes(d.color)), joinedDomain];
			// 	} else {
			// 		res = [...domains.filter((d) => d.color !== color), existingDomain];
			// 	}
			// } else {
			// 	// new domain
			// 	const newDomain = {
			// 		color: color,
			// 		hexs: [{ q, r, s, x, y }],
			// 	};
			// 	res = [...domains.filter((d) => d.color !== color), newDomain];
			// }

			// res = res.filter((d) => Object.keys(d).length > 0);

			// console.log("domains will be", res);
			//#endregion
			return {
				...prev,
				selected: [...prev.selected, { q, r, s, x, y, color }],
			};
		});
	};

	const removeHexFromDomains = ({ q, r, s }) => {
		setContext((prev) => {
			return {
				...prev,
				selected: prev.selected.filter(
					({ q: _q, r: _r, s: _s }) => [q, r, s].join(",") !== [_q, _r, _s].join(",")
				),
			};
		});
	};

	const clearSelected = () => {
		log("clearDomains", "h3");
		setContext((prev) => {
			return {
				...prev,
				selected: [],
			};
		});
	};

	const setHexMap = (hexMap) => {
		setContext((prev) => {
			return {
				...prev,
				hexMap: hexMap,
			};
		});
	};

	const Hex = (q, r, s) => {
		return { q, r, s };
	};

	const cubeDirection = (direction) => {
		const cubeDirections = [
			Hex(1, 0, -1),
			Hex(1, -1, 0),
			Hex(0, -1, 1),
			Hex(-1, 0, 1),
			Hex(-1, 1, 0),
			Hex(0, 1, -1),
		];

		return cubeDirections[direction];
	};

	const cubeAdd = (a, b) => {
		return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
	};

	const getNeighbor = (h, direction) => {
		return cubeAdd(h, cubeDirection(direction));
	};

	const floodFill = (h, replacementColor, selected) => {
		const targetColor = h.color;
		if (targetColor === replacementColor) return;
		if (!selected.find(({ q: _q, r: _r, s: _s }) => _q === h.q && _r === h.r && _s === h.s)) return;

		h.color = replacementColor;
		for (let i = 0; i <= 5; i++) {
			floodFill(getNeighbor(h, i), replacementColor, selected);
		}

		//#region
		// let Q = [];
		// Q.push({ q, r, s });
		// Q.forEach((N, i, Q) => {
		// 	let w = { q: N.q, r: N.r, s: N.s };
		// 	let e = { q: N.q, r: N.r, s: N.s };

		// 	let i = 0
		// 	while(selected.find(({ q, r, s }) => w.q === q - i && w.r === r && w.s === s)) {

		// 		i--
		// 	}
		// });
		//#endregion
	};

	const calcDomains = (hexMap, selected) => {
		let count = 0;

		hexMap
			.filter((h) => h.checked)
			.forEach((h) => {
				const replacementColor = "#" + Math.round(Math.random() * 2 ** 24 - 1).toString(16);
				floodFill(h, replacementColor, selected);
			});

		return count;
	};

	const autoFill = (p, hexMap) => {
		hexMap.forEach((h) => {
			let check = Math.random();
			h.checked = check <= p ? 1 : 0;
		});

		setContext((prev) => {
			return {
				...prev,
				hexMap: hexMap,
				selected: hexMap.filter((h) => h.checked),
			};
		});
	};

	const [context, setContext] = useState({
		L: 3,
		M: 5,
		N: 7,
		hexSize: 20,
		canvasSize: { width: window.innerWidth, height: 600 },
		hexMap: [],
		selected: [],
		domains: [],
		changeHexGridParams: changeHexGridParams,
		addHexToSelected: addHexToSelected,
		removeHexFromDomains: removeHexFromDomains,
		setHexMap: setHexMap,
		clearSelected: clearSelected,
		calcDomains: calcDomains,
		autoFill: autoFill,
	});
	// console.log("context.domains", context.domains);
	// console.log(context.hexMap);

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};
