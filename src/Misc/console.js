var consoleStyles = {
	h1: "font: 2.5em/1 Arial; color: crimson;",
	h2: "font: 2em/1 Arial; color: orangered;",
	h3: "font: 1.5em/1 Arial; color: olivedrab;",
	bold: "font: bold 1.3em/1 Arial; color: midnightblue;",
	warn: "padding: 0 .5rem; background: crimson; font: 1.6em/1 Arial; color: white;",
};

export const log = (msg, style) => {
	if (!style || !consoleStyles[style]) {
		style = "bold";
	}
	console.log("%c" + msg, consoleStyles[style]);
};
