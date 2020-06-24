import React, { useState, useRef, useEffect } from "react";
import HexGrid from "../../Drawing/hex-grid";
import "./style.scss";

const HexGridContainer = () => {
	const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
	const [hexSize, setHexSize] = useState(20);
	const [hexGridSize, setHexGridSize] = useState({ L: 3, M: 5, N: 7 });
	const [hexOrigin, setHexOrigin] = useState({ x: 50, y: 50 });
	const canvasHex = useRef();
	const canvasSelected = useRef();

	let hexGridBase = new HexGrid();
	let hexGridSelected = new HexGrid();

	useEffect(() => {
		canvasHex.current.width = canvasSize.width;
		canvasHex.current.height = canvasSize.height;
		canvasSelected.current.width = canvasSize.width;
		canvasSelected.current.height = canvasSize.height;
		hexGridBase.setParams({
			canvasID: canvasHex.current,
			canvasSize: canvasSize,
			L: hexGridSize.L,
			M: hexGridSize.M,
			N: hexGridSize.N,
			hexSize: hexSize,
			hexOrigin: hexOrigin,
		});
		hexGridBase.drawHexGrid();

		hexGridSelected.setParams({
			canvasID: canvasSelected.current,
			canvasSize: canvasSize,
			L: hexGridSize.L,
			M: hexGridSize.M,
			N: hexGridSize.N,
			hexSize: hexSize,
			hexOrigin: hexOrigin,
		});

		// console.log(hexGridBase);
		// console.log(hexGridSelected);
	}, []);

	const handleMouse = (e) => {
		const offsetX = e.pageX - hexGridBase.canvasRect.left - hexSize * 2;
		const offsetY = e.pageY - hexGridBase.canvasRect.top;
		const { q, r, s } = hexGridBase.cubeRound(hexGridBase.pixelToHex(hexGridBase.Point(offsetX, offsetY)));
		const { x, y } = hexGridBase.hexToPixel(hexGridBase.Hex(q, r, s));

		// hexGridSelected.clearCanvas();
		hexGridSelected.drawHex({ x, y }, "#FF0000");
		hexGridSelected.drawNeighbors(hexGridSelected.Hex(q, r, s), "#FF0000");

		// console.log(q, r, s, x, y);
	};

	return (
		<>
			<canvas id="base" ref={canvasHex}></canvas>
			<canvas id="selected" ref={canvasSelected} onMouseUp={handleMouse}></canvas>
		</>
	);
};

export default HexGridContainer;
