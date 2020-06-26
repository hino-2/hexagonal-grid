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

		context.clearDomains();
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
		hexGridDomains.drawArray(context.domains);
	}, [context.domains]);

	const handleMouseClick = (e) => {
		log("mouse clicked", "h2");
		const offsetX = e.pageX - hexGridBase.canvasRect.left - hexSize * 2;
		const offsetY = e.pageY - hexGridBase.canvasRect.top;
		const { q, r, s } = hexGridBase.cubeRound(hexGridBase.pixelToHex(hexGridBase.Point(offsetX, offsetY)));

		if (!hexGridBase.hexMap.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s)) return;

		const { x, y } = hexGridBase.hexToPixel(hexGridBase.Hex(q, r, s));

		let randomDistinctColor;
		const coloredNeighbor = hexGridDomains.getColoredNeighbor(hexGridBase.Hex(q, r, s), context.domains);

		if (!coloredNeighbor) {
			randomDistinctColor = colors[Math.floor(Math.random() * colors.length)];
			if (!randomDistinctColor) {
				alert("Максимум 21 домен. Закончились цвета.");
				return;
			}
			setColors(colors.filter((color) => color !== randomDistinctColor));
		}

		const color = coloredNeighbor ? coloredNeighbor.color : randomDistinctColor;
		// : "#" + Math.round(Math.random() * 2 ** 24 - 1).toString(16);

		context.addHexToDomains({ q, r, s, x, y, color });
		// context.addHexToDomains1({ q: 1, r: 2, s: 3, x: 4, y: 5, color: "red" });
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
