/* eslint-disable no-restricted-globals */
/* eslint-env worker */
import { splitSelectedToDomains, floodFillHexMap, checkIfMultiConnected } from "../../GrafLogic/graf-logic";

const go = (message) => {
	let hexMap = message.data.hexMap;
	let selected = message.data.selected;
	let domains = [];

	hexMap.forEach((h) => (h.color = undefined));
	let selectedNew = floodFillHexMap(hexMap, selected);

	domains = splitSelectedToDomains(selectedNew);
	const totalNumberOfDomains = domains.length;

	// multi-connection search
	let numOfMultiConnectedDomains = 0;

	domains.forEach((d) => {
		numOfMultiConnectedDomains += checkIfMultiConnected(d, hexMap, selectedNew, totalNumberOfDomains);
	});
	// multi-connection search end

	self.postMessage({
		command: "done",
		auto: message.data.auto,
		hexMap: hexMap,
		selected: selectedNew,
		totalNumberOfDomains: totalNumberOfDomains,
		numOfMultiConnectedDomains: numOfMultiConnectedDomains,
	});
};

self.addEventListener("message", go);
