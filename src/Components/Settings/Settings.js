import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../Context/Context";
import "./style.scss";

const Settings = () => {
	const context = useContext(Context);

	const [L, setL] = useState(context.L);
	const [M, setM] = useState(context.M);
	const [N, setN] = useState(context.N);
	const [autoPossibility, setAutoPossibility] = useState(0.5);
	const [domainsCount, setDomainsCount] = useState("неизвестно");
	const [message, setMessage] = useState("");
	const [buttonStyles, setButtonStyles] = useState({});
	const [timerID, setTimerID] = useState();

	const settingsDiv = useRef();

	useEffect(() => {
		settingsDiv.current.style.top = `${context.canvasSize.height + 10}px`;
	}, [context.canvasSize.height]);

	useEffect(() => {
		setButtonStyles({
			backgroundColor: context.isCalculating ? "grey" : "dodgerblue",
		});

		if (context.isCalculating) {
			setMessage("Вычисляю...");

			setTimerID(
				setTimeout(() => {
					if (context.isCalculating) {
						setMessage("Все еще вычисляю...");

						setTimerID(
							setTimeout(() => {
								if (context.isCalculating) {
									setMessage("Да, я все еще вычисляю...");

									setTimerID(
										setTimeout(() => {
											if (context.isCalculating) {
												setMessage("Да, алгоритм не самый быстрый...");

												setTimerID(
													setTimeout(() => {
														if (context.isCalculating) {
															setMessage("Да, я знаю про теорему Менгера...");

															setTimerID(
																setTimeout(() => {
																	setMessage("Еще чуть чуть...");
																}, 15000)
															);
														} else {
															clearTimeout(timerID);
															setMessage("");
														}
													}, 15000)
												);
											} else {
												clearTimeout(timerID);
												setMessage("");
											}
										}, 15000)
									);
								} else {
									clearTimeout(timerID);
									setMessage("");
								}
							}, 10000)
						);
					} else {
						clearTimeout(timerID);
						setMessage("");
					}
				}, 5000)
			);
		} else {
			clearTimeout(timerID);
			setMessage("");
		}
	}, [context.isCalculating]);

	const handleChange = (e) => {
		if (e.target.id === "L") setL(e.target.value);
		if (e.target.id === "M") setM(e.target.value);
		if (e.target.id === "N") setN(e.target.value);
		if (e.target.id === "autoPoss") setAutoPossibility(e.target.value);
	};

	const changeGridDimensions = () => {
		if (isNaN(L) || isNaN(M) || isNaN(N)) {
			alert("Размеры должны быть числами");
			return;
		}

		if (L <= 0 || L > 30 || M <= 0 || M > 30 || N <= 0 || N > 30) {
			alert("Размеры сетки должны быть от 1 до 30");
			return;
		}

		context.changeHexGridParams({
			L: parseInt(L),
			M: parseInt(M),
			N: parseInt(N),
			canvasSize: {
				width:
					(((Math.max(parseInt(M), parseInt(L)) + parseInt(N)) * 2 * 3) / 4) * context.hexSize +
					100 +
					(((parseInt(L) + 1) * 3) / 4) * context.hexSize,
				height: ((parseInt(L) + parseInt(M)) * context.hexSize * 2 * 3) / 4 + 50,
			},
		});
	};

	const showDomainsCount = () => {
		context.calcDomains(context.hexMap, context.selected, false);
	};

	const handleAutoFill = () => {
		if (Number(autoPossibility) <= 0 || Number(autoPossibility) >= 1) {
			alert("Вероятность должна быть от 0.1 до 0.99");
			return;
		}

		context.autoFill(autoPossibility, context.hexMap);
	};

	useEffect(() => {
		setDomainsCount(context.domainsCount.totalNumberOfDomains);
	}, [context.domainsCount.totalNumberOfDomains]);

	return (
		<div className="settings" ref={settingsDiv}>
			<div>
				<label htmlFor="L">L</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={L} onChange={handleChange} id="L" />
			</div>
			<div>
				<label htmlFor="M">M</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={M} onChange={handleChange} id="M" />
			</div>
			<div>
				<label htmlFor="N">N</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={N} onChange={handleChange} id="N" />
			</div>
			<div>&nbsp;</div>
			<div>
				<button onClick={changeGridDimensions} style={buttonStyles} disabled={context.isCalculating}>
					Применить
				</button>
			</div>
			<div>&nbsp;</div>
			<div>&nbsp;</div>
			<div>
				<label htmlFor="autoPoss">Вероятность</label>&nbsp;&nbsp;
			</div>
			<div>
				<input type="text" value={autoPossibility} onChange={handleChange} id="autoPoss" />
			</div>
			<div>&nbsp;</div>
			<div>
				<button onClick={handleAutoFill} style={buttonStyles} disabled={context.isCalculating}>
					АВТО
				</button>
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
				<button onClick={showDomainsCount} style={buttonStyles} disabled={context.isCalculating}>
					Рассчитать кол-во
				</button>
			</div>
			<div style={{ gridColumn: "1/3" }}>{message}</div>
		</div>
	);
};

export default Settings;
