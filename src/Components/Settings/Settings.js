import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../Context/Context";
import "./style.scss";

const Settings = () => {
	const context = useContext(Context);

	const [L, setL] = useState(context.L);
	const [M, setM] = useState(context.M);
	const [N, setN] = useState(context.N);
	const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
	const [canvasHeight, setCanvasHeight] = useState(context.canvasSize.height);
	const [domainsCount, setDomainsCount] = useState("неизвестно");

	const settingsDiv = useRef();

	useEffect(() => {
		settingsDiv.current.style.top = `${context.canvasSize.height + 10}px`;
	}, [context.canvasSize.height]);

	const handleDimensionsChange = (e) => {
		if (e.target.id === "L") setL(e.target.value);
		if (e.target.id === "M") setM(e.target.value);
		if (e.target.id === "N") setN(e.target.value);
		if (e.target.id === "canvasWidth") setCanvasWidth(e.target.value);
		if (e.target.id === "canvasHeight") setCanvasHeight(e.target.value);
	};

	const changeGridDimensions = () => {
		if (isNaN(L) || isNaN(M) || isNaN(N) || isNaN(canvasWidth) || isNaN(canvasHeight)) {
			alert("Размеры должны быть числами");
			return;
		}

		if (L <= 0 || L > 30 || M <= 0 || M > 30 || N <= 0 || N > 30) {
			alert("Размеры сетки должны быть от 1 до 30");
			return;
		}

		if (canvasWidth <= 0 || canvasWidth > 2000 || canvasHeight <= 0 || canvasHeight > 2000) {
			alert("Размеры поля должны быть от 1 до 1000");
			return;
		}

		context.changeHexGridParams({
			L: parseInt(L),
			M: parseInt(M),
			N: parseInt(N),
			canvasSize: { width: parseInt(canvasWidth), height: parseInt(canvasHeight) },
		});
	};

	const showDomainsCount = () => {
		setDomainsCount(context.domains.length);
	};

	return (
		<div className="settings" ref={settingsDiv}>
			<div>
				<label htmlFor="L">L</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={L} onChange={handleDimensionsChange} id="L" />
			</div>
			<div>
				<label htmlFor="M">M</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={M} onChange={handleDimensionsChange} id="M" />
			</div>
			<div>
				<label htmlFor="N">N</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={N} onChange={handleDimensionsChange} id="N" />
			</div>
			<div>
				<label htmlFor="canvasWidth">Ширина поля</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={canvasWidth} onChange={handleDimensionsChange} id="canvasWidth" />
			</div>
			<div>
				<label htmlFor="canvasHeight">Высота поля</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={canvasHeight} onChange={handleDimensionsChange} id="canvasHeight" />
			</div>
			<div>&nbsp;</div>
			<div>
				<button onClick={changeGridDimensions}>Применить</button>
			</div>
			<div>&nbsp;</div>
			<div>&nbsp;</div>
			<div>
				<label htmlFor="domainsCount">Кол-во доменов</label>&nbsp;&nbsp;
			</div>
			<div>
				<label>{domainsCount}</label>
			</div>
			<div>&nbsp;</div>
			<div>
				<button onClick={showDomainsCount}>Рассчитать кол-во</button>
			</div>
		</div>
	);
};

export default Settings;
