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

	const addHexToExistingDomain = ({ q, r, s, x, y }, existingDomain) => {
		if (!existingDomain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s))
			existingDomain.hexs.push({ q, r, s, x, y });
	};

	const joinDomains = (existingDomain, domainsNearby) => {
		const result = Object.create(existingDomain);
		domainsNearby.forEach((d) => {
			d.hexs.forEach((h) => addHexToExistingDomain(h, result));
		});
		return result;
	};

	const addHexToDomains = ({ q, r, s, x, y, color }) => {
		const hg = new HexGrid();
		log("addHexToDomains", "h3");

		setContext((prev) => {
			log("setContext", "h3");

			let res = [];
			let domains = [...prev.domains];
			console.log("domains are", domains);

			const existingDomain = domains.find((d) => d.color === color);
			console.log("existingDomain", existingDomain);

			if (existingDomain) {
				addHexToExistingDomain({ q, r, s, x, y }, existingDomain);

				// check if there are two different domains nearby and join them
				const colorsNearby = hg.getColorsOfNeighbors({ q, r, s }, domains).filter((_c) => _c !== color);
				const domainsNearby = domains.filter((d) => colorsNearby.includes(d.color));
				console.log("colorsNearby", colorsNearby);

				if (domainsNearby) {
					const joinedDomain = joinDomains(existingDomain, domainsNearby);

					res = [...domains.filter((d) => !colorsNearby.includes(d.color)), joinedDomain];
				} else {
					res = [...domains.filter((d) => d.color !== color), existingDomain];
				}
			} else {
				// new domain
				const newDomain = {
					color: color,
					hexs: [{ q, r, s, x, y }],
				};
				res = [...domains.filter((d) => d.color !== color), newDomain];
			}

			res = res.filter((d) => Object.keys(d).length > 0);

			console.log("domains will be", res);

			return {
				...prev,
				domains: res,
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
