import React, { useState, createContext } from "react";
import { splitSelectedToDomains, floodFillHexMap, checkIfMultiConnected } from "../../GrafLogic/graf-logic";

export const Context = createContext();

export const ContextProvider = (props) => {
	const changeHexGridParams = (newParams = {}) => {
		setContext((prev) => {
			return { ...prev, ...newParams, selected: [] };
		});
	};

	const addHexToSelected = ({ q, r, s, x, y, color }) => {
		setContext((prev) => {
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

	const makeResults = (p = "manual", prevResults, { totalNumberOfDomains, numOfMultiConnectedDomains }, hexMap) => {
		return [
			...prevResults,
			{
				poss: p,
				domainsCount: totalNumberOfDomains,
				multiConnected: numOfMultiConnectedDomains,
				hexCount: hexMap.length,
				hexChecked: hexMap.filter((h) => h.checked).length,
			},
		];
	};

	const calcDomains = (hexMap, selected, auto) => {
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
		// multi-connection search end

		if (!auto)
			setContext((prev) => {
				let res = makeResults(
					undefined,
					prev.results,
					{ totalNumberOfDomains, numOfMultiConnectedDomains },
					hexMap
				);
				if (res.length > 10) res = res.slice(1);

				return {
					...prev,
					hexMap: hexMap,
					results: res,
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
			hexMap.filter((h) => h.checked),
			true
		);

		setContext((prev) => {
			let res = makeResults(p, prev.results, numOfDomains, hexMap);
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

	const [context, setContext] = useState({
		L: 3,
		M: 5,
		N: 7,
		hexSize: 20,
		canvasSize: { width: window.innerWidth - 2, height: 290 },
		hexMap: [],
		selected: [],
		domains: [],
		results: [],
		domainsCount: { totalNumberOfDomains: "неизвестно", numOfMultiConnectedDomains: 0 },
		changeHexGridParams: changeHexGridParams,
		addHexToSelected: addHexToSelected,
		removeHexFromDomains: removeHexFromDomains,
		setHexMap: setHexMap,
		clearSelected: clearSelected,
		calcDomains: calcDomains,
		autoFill: autoFill,
	});

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};
