import React, { useState, useRef, useEffect } from "react";
import * as hexDraw from "../../Drawing/hex-grid";
import "./style.scss";

const HexGrid = () => {
	const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
	const [hexSize, setHexSize] = useState(20);
	const [hexGridSize, setHexGridSize] = useState({ rowNum: 4, colNum: 4 });
	const [hexOrigin, setHexOrigin] = useState({ x: 300, y: 300 });
	const canvasHex = useRef();

	useEffect(() => {
		canvasHex.current.width = canvasSize.width;
		canvasHex.current.height = canvasSize.height;
		hexDraw.drawHexGrid(canvasHex.current, hexGridSize, hexSize, hexOrigin, canvasSize);
	}, []);

	return <canvas ref={canvasHex}></canvas>;
};

export default HexGrid;
