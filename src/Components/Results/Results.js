import React, { useRef, useEffect, useContext } from "react";
import uniqid from "uniqid";
import { Context } from "../Context/Context";
import "./style.scss";

const Results = () => {
	const context = useContext(Context);
	const resultsDiv = useRef();

	const results = context.results;

	useEffect(() => {
		resultsDiv.current.style.top = `${context.canvasSize.height + 10}px`;
	}, [context.canvasSize.height]);

	return (
		<div className="results" ref={resultsDiv}>
			<div className="table-header">
				<div style={{ gridRow: "1/3" }}>Вероятность</div>
				<div style={{ gridColumn: "2/4" }}>Количество доменов в решетке</div>
				<div>всего</div>
				<div>Из них неодносвязных</div>
				<div style={{ gridRow: "1/3", gridColumn: "4/5" }}>
					Количество ячеек в решётке (L;N;M), из них имеющих значение 1
				</div>
			</div>
			<div className="table-data">
				{results.map((row) => (
					<React.Fragment key={uniqid()}>
						<div className="row">{row.poss}</div>
						<div className="row">{row.domainsCount}</div>
						<div className="row">{"unknown"}</div>
						<div className="row">{row.hexCount}</div>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default Results;
