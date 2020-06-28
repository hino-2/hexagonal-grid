import React, { useRef, useEffect, useContext } from "react";
import { Context } from "../Context/Context";
import HexGrid from "../../Drawing/hex-grid";
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
		requestAnimationFrame(() => hexGridBase.drawHexGrid());

		context.setHexMap(hexGridBase.hexMap);
		context.clearSelected();
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
		requestAnimationFrame(() => hexGridDomains.drawArray(context.selected));
	});

	const handleMouseClick = (e) => {
		const offsetX = e.pageX - hexGridBase.canvasRect.left - hexSize * 2;
		const offsetY = e.pageY - hexGridBase.canvasRect.top;
		const { q, r, s } = hexGridBase.cubeRound(hexGridBase.pixelToHex(hexGridBase.Point(offsetX, offsetY)));

		let insideMap = hexGridBase.hexMap.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s);
		if (!insideMap) return;
		else insideMap.checked = 1;

		if (context.selected.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s)) {
			insideMap.checked = 0;
			context.removeHexFromDomains({ q, r, s });
			context.setHexMap(hexGridBase.hexMap);

			return;
		}

		const { x, y } = hexGridBase.hexToPixel(hexGridBase.Hex(q, r, s));

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
