import React from "react";
import { ContextProvider } from "../Context/Context";
import HexGridContainer from "../HexGridContainer/HexGridContainer";
import Settings from "../Settings/Settings";
import Results from "../Results/Results";
import "./App.scss";

function App() {
	return (
		<div className="App">
			<ContextProvider>
				<HexGridContainer />
				<Settings />
				<Results />
			</ContextProvider>
		</div>
	);
}

export default App;
