import React, { useState, useRef, useEffect, useContext } from "react";
import { Context } from "../Context/Context";
import HexGrid from "../../Drawing/hex-grid";
import { log } from "../../Misc/console";
import "./style.scss";

let hexGridBase = new HexGrid();
let hexGridDomains = new HexGrid();

const HexGridContainer = () => {
	const context = useContext(Context);

	const canvasSize = context.canvasSize;
	const hexSize = context.hexSize;
	const hexGridSize = { L: context.L, M: context.M, N: context.N };
	const canvasKey = `${canvasSize.width}${canvasSize.height}${hexGridSize.L}${hexGridSize.M}${hexGridSize.N}`;

	const canvasHex = useRef();
	const canvasDomains = useRef();

	const [colors, setColors] = useState([
		"#e6194b",
		"#3cb44b",
		"#ffe119",
		"#4363d8",
		"#f58231",
		"#911eb4",
		"#46f0f0",
		"#f032e6",
		"#bcf60c",
		"#fabebe",
		"#008080",
		"#e6beff",
		"#9a6324",
		"#fffac8",
		"#800000",
		"#aaffc3",
		"#808000",
		"#ffd8b1",
		"#000075",
		"#808080",
		"#000000",
	]);

	// console.log(`${canvasSize.width}${canvasSize.height}${hexGridSize.L}${hexGridSize.M}${hexGridSize.N}`);

	useEffect(() => {
		canvasHex.current.width = canvasSize.width;
		canvasHex.current.height = canvasSize.height;
		canvasDomains.current.width = canvasSize.width;
		canvasDomains.current.height = canvasSize.height;
		hexGridBase.setParams({
			canvasID: canvasHex.current,
			canvasSize: canvasSize,
			L: hexGridSize.L,
			M: hexGridSize.M,
			N: hexGridSize.N,
			hexSize: hexSize,
		});
		hexGridBase.drawHexGrid();

		context.setHexMap(hexGridBase.hexMap);
		context.clearSelected();

		log("redraw canvas", "h2");
	}, [canvasKey]);

	useEffect(() => {
		hexGridDomains.setParams({
			canvasID: canvasDomains.current,
			canvasSize: canvasSize,
			L: hexGridSize.L,
			M: hexGridSize.M,
			N: hexGridSize.N,
			hexSize: hexSize,
		});
	});

	useEffect(() => {
		hexGridDomains.clearCanvas();
		hexGridDomains.drawArray(context.selected);
	});

	const handleMouseClick = (e) => {
		log("mouse clicked", "h2");
		const offsetX = e.pageX - hexGridBase.canvasRect.left - hexSize * 2;
		const offsetY = e.pageY - hexGridBase.canvasRect.top;
		const { q, r, s } = hexGridBase.cubeRound(hexGridBase.pixelToHex(hexGridBase.Point(offsetX, offsetY)));

		let insideMap = hexGridBase.hexMap.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s);
		if (!insideMap) return;
		else insideMap.checked = 1;

		if (context.selected.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s)) {
			log("removing", "h3");
			insideMap.checked = 0;
			context.removeHexFromDomains({ q, r, s });
			context.setHexMap(hexGridBase.hexMap);

			return;
		}

		const { x, y } = hexGridBase.hexToPixel(hexGridBase.Hex(q, r, s));

		//#region
		// let randomDistinctColor;
		// const coloredNeighbor = hexGridDomains.getColoredNeighbor(hexGridBase.Hex(q, r, s), context.domains);

		// if (!coloredNeighbor) {
		// 	randomDistinctColor = colors[Math.floor(Math.random() * colors.length)];
		// 	if (!randomDistinctColor) {
		// 		alert("Максимум 21 домен. Закончились цвета.");
		// 		return;
		// 	}
		// 	setColors(colors.filter((color) => color !== randomDistinctColor));
		// }

		// const color = coloredNeighbor ? coloredNeighbor.color : randomDistinctColor;
		// // : "#" + Math.round(Math.random() * 2 ** 24 - 1).toString(16);
		//#endregion
		context.addHexToSelected({ q, r, s, x, y, undefined });
		context.setHexMap(hexGridBase.hexMap);
	};

	return (
		<div>
			<canvas
				id="base"
				ref={canvasHex}
				key={`${canvasSize.width}${canvasSize.height}${hexGridSize.L}${hexGridSize.M}${hexGridSize.N}`}
			/>
			<canvas id="selected" ref={canvasDomains} onMouseUp={handleMouseClick} />
		</div>
	);
};

export default HexGridContainer;
