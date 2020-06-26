import React, { useState, createContext } from "react";
import HexGrid from "../../Drawing/hex-grid";
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

	const addHexToDomains = ({ q, r, s, x, y, color }) => {
		// const hg = new HexGrid();
		log("addHexToDomains", "h3");
		if()

		setContext((prev) => {
			log("setContext", "h3");
			//#region
			// let res = [];
			// let domains = prev.domains.slice();
			// let _domain = prev.domains.find((d) => d.color === color);
			// if (_domain) {
			// 	if (!_domain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s))
			// 		_domain.hexs.push({ q, r, s, x, y });

			// 	// check if there are two different domains nearby and join them
			// 	let colorsNearby = hg.getColorsOfNeighbors({ q, r, s }, domains);
			// 	if (colorsNearby.length >= 2) {
			// 		colorsNearby = colorsNearby.filter((d) => d.color !== color);
			// 		console.log("colorsNearby", colorsNearby);
			// 		for (let i = 1; i < colorsNearby.length; i++) {
			// 			let domainNearby = domains.find((d) => d.color === colorsNearby[i]);
			// 			console.log("i", i, domainNearby);
			// 			// eslint-disable-next-line no-loop-func
			// 			domainNearby.hexs.forEach((h) => {
			// 				if (!_domain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === h.q && _r === h.r && _s === h.s))
			// 					_domain.hexs.push(h);
			// 			});
			// 			console.log("defore filter", colorsNearby[i], domains);
			// 			domains = domains.filter((d) => d.color !== colorsNearby[0] && d.color !== colorsNearby[i]);
			// 		}
			// 	} else {
			// 		domains = domains.filter((d) => d.color !== color);
			// 	}

			// 	res = [...domains, _domain];
			// } else {
			// 	_domain = {
			// 		color: color,
			// 		hexs: [{ q, r, s, x, y }],
			// 	};
			// 	res = [...domains.filter((d) => d.color !== color), _domain];
			// }

			// console.log("_domain", _domain);
			// console.log("domains", res);
			//#endregion
			return {
				...prev,
				// domains: res,
			};
		});
	};

	// const addHexToDomains1 = ({ q, r, s, x, y, color }) => {
	// 	log("addHexToDomains 1", "h3");
	// 	setContext((prev) => {
	// 		log("setContext 1", "h3");
	// 		return prev;
	// 	});
	// };

	const clearDomains = () => {
		log("clearDomains", "h3");
		setContext((prev) => {
			return {
				...prev,
				domains: [],
			};
		});
	};

	const [context, setContext] = useState({
		L: 3,
		M: 5,
		N: 7,
		hexSize: 20,
		canvasSize: { width: window.innerWidth, height: 600 },
		domains: [],
		changeHexGridParams: changeHexGridParams,
		addHexToDomains: addHexToDomains,
		// addHexToDomains1: addHexToDomains1,
		clearDomains: clearDomains,
	});
	// console.log("context.domains", context.domains);
	// console.log(context);

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};
