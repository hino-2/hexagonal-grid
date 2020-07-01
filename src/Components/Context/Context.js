import React, { useState, createContext } from "react";
import Worker from "./file.worker.js";

export const Context = createContext();

export const ContextProvider = (props) => {
	const [worker, setWorker] = useState(new Worker());

	const handleWorkerCompletion = (message) => {
		if (message.data.command === "done") {
			setContext((prev) => {
				const numOfDomains = {
					totalNumberOfDomains: message.data.totalNumberOfDomains,
					numOfMultiConnectedDomains: message.data.numOfMultiConnectedDomains,
				};

				let res = makeResults(
					message.data.auto ? prev.p : undefined,
					prev.results,
					numOfDomains,
					message.data.hexMap
				);
				if (res.length > 10) res = res.slice(1);

				return {
					...prev,
					results: res,
					domainsCount: numOfDomains,
					selected: message.data.selected,
					isCalculating: false,
				};
			});
			worker.removeEventListener("message", handleWorkerCompletion);
		}
	};

	const startWorker = (hexMap, selected, auto) => {
		worker.addEventListener("message", handleWorkerCompletion, false);
		worker.postMessage({
			hexMap: hexMap,
			selected: selected,
			auto: auto,
		});
	};

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
		startWorker(hexMap, selected, auto);

		setContext((prev) => {
			return {
				...prev,
				isCalculating: true,
			};
		});
	};

	const autoFill = (p, hexMap) => {
		hexMap.forEach((h) => {
			let check = Math.random();
			h.checked = check <= p ? 1 : 0;
			h.color = undefined;
		});

		calcDomains(
			hexMap,
			hexMap.filter((h) => h.checked),
			true
		);

		setContext((prev) => {
			return {
				...prev,
				isCalculating: true,
				hexMap: hexMap,
				selected: hexMap.filter((h) => h.checked),
				p: p,
			};
		});
	};

	const [context, setContext] = useState({
		L: 3,
		M: 5,
		N: 7,
		hexSize: 20,
		canvasSize: { width: window.innerWidth - 2, height: 300 },
		p: undefined,
		isCalculating: false,
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
