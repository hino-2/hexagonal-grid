import React, { useState, createContext } from "react";
// import HexGrid from "../../Drawing/hex-grid";
import { log } from "../../Misc/console";

export const Context = createContext();

export const ContextProvider = (props) => {
	const changeHexGridParams = (newParams = {}) => {
		// log("changeHexGridParams", "h3");
		setContext((prev) => {
			return { ...prev, ...newParams, selected: [] };
		});
	};

	const addHexToSelected = ({ q, r, s, x, y, color }) => {
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
		// log("clearDomains", "h3");
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

	const splitSelectedToDomains = (selected) => {
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

	const floodFill = (h, color, hexMap, selected) => {
		if (h.color) return;

		h.color = color;
		selected.find(({ q, r, s }) => q === h.q && r === h.r && s === h.s).color = color;
		for (let i = 0; i <= 5; i++) {
			const neighbor = getNeighbor(h, i);
			const neighborOnMap = hexMap.find(
				({ q, r, s }) => q === neighbor.q && r === neighbor.r && s === neighbor.s
			);
			if (neighborOnMap && neighborOnMap.checked) floodFill(neighborOnMap, color, hexMap, selected);
		}
	};

	const floodFillHexMap = (hexMap, selected) => {
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

	const checkIfMultiConnected = (d, hexMap, selected, totalNumberOfDomains) => {
		let _mcHexMap, _mcSelected;
		let i = 0;

		if (d.hexs.length <= 2) return 0;

		d.hexs.forEach(({ q, r, s }) => {
			_mcSelected = JSON.parse(
				JSON.stringify(
					selected.filter(({ q: _q, r: _r, s: _s }) => [q, r, s].join(",") !== [_q, _r, _s].join(","))
				)
			);
			_mcHexMap = JSON.parse(
				JSON.stringify(
					hexMap.filter(({ q: _q, r: _r, s: _s }) => [q, r, s].join(",") !== [_q, _r, _s].join(","))
				)
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

	const calcDomains = (hexMap, selected, auto) => {
		console.log("start");
		let domains = [];
		hexMap.forEach((h) => (h.color = undefined));

		floodFillHexMap(hexMap, selected);
		domains = splitSelectedToDomains(selected);
		const totalNumberOfDomains = domains.length;

		// multi-connection search
		let numOfMultiConnectedDomains = 0;

		domains.forEach((d) => {
			numOfMultiConnectedDomains += checkIfMultiConnected(d, hexMap, selected, totalNumberOfDomains);
		});
		console.log("done");
		// multi-connection search end

		if (!auto)
			setContext((prev) => {
				return {
					...prev,
					hexMap: hexMap,
					selected: selected,
					domains: domains,
				};
			});

		return { totalNumberOfDomains, numOfMultiConnectedDomains };
	};

	const autoFill = (p, hexMap) => {
		hexMap.forEach((h) => {
			let check = Math.random();
			h.checked = check <= p ? 1 : 0;
			h.color = undefined;
		});

		const numOfDomains = calcDomains(
			hexMap,
			hexMap.filter((h) => h.checked, true)
		);

		setContext((prev) => {
			let res = [
				...prev.results,
				{
					poss: p,
					domainsCount: numOfDomains.totalNumberOfDomains,
					multiConnected: numOfDomains.numOfMultiConnectedDomains,
					hexCount: hexMap.length,
					hexChecked: hexMap.filter((h) => h.checked).length,
				},
			];

			if (res.length > 10) res = res.slice(1);

			return {
				...prev,
				hexMap: hexMap,
				selected: hexMap.filter((h) => h.checked),
				results: res,
				domainsCount: numOfDomains,
			};
		});
	};

	const addResult = (result) => {
		setContext((prev) => {
			let res = [...prev.results, result];

			if (res.length > 10) res = res.slice(1);

			return {
				...prev,
				results: res,
			};
		});
	};

	const [context, setContext] = useState({
		L: 3,
		M: 5,
		N: 7,
		hexSize: 20,
		canvasSize: { width: window.innerWidth - 2, height: 300 },
		hexMap: [],
		selected: [],
		domains: [],
		results: [],
		domainsCount: 0,
		changeHexGridParams: changeHexGridParams,
		addHexToSelected: addHexToSelected,
		removeHexFromDomains: removeHexFromDomains,
		setHexMap: setHexMap,
		clearSelected: clearSelected,
		calcDomains: calcDomains,
		autoFill: autoFill,
		addResult: addResult,
	});
	// console.log("context.domains", context.domains);
	// console.log(context.hexMap);

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};
