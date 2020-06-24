class HexGrid {
	getHexCornerCoord = (center, i) => {
		let angle_deg = 60 * i - 30;
		let angle_rad = (Math.PI / 180) * angle_deg;
		let x = center.x + this.hexSize * Math.cos(angle_rad);
		let y = center.y + this.hexSize * Math.sin(angle_rad);

		return this.Point(x, y);
	};

	Point = (x, y) => {
		return { x, y };
	};

	Hex = (q, r, s) => {
		return { q, r, s };
	};

	//  Cube = (x, y, z) => {
	// 	return { x, y, z };
	// };

	clearCanvas = () => {
		const ctx = this.canvasID.getContext("2d");
		ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
	};

	drawLine = (start, end, color, width) => {
		const ctx = this.canvasID.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.closePath();
	};

	drawHex = (center, color) => {
		// console.log(this.canvasID);
		for (let i = 0; i <= 5; i++) {
			const start = this.getHexCornerCoord(center, i);
			const end = this.getHexCornerCoord(center, i + 1);
			this.drawLine(start, end, color);
		}
	};

	cubeRound = (cube) => {
		let rx = Math.round(cube.q);
		let ry = Math.round(cube.r);
		let rz = Math.round(cube.s);

		let x_diff = Math.abs(rx - cube.q);
		let y_diff = Math.abs(ry - cube.r);
		let z_diff = Math.abs(rz - cube.s);

		if (x_diff > y_diff && x_diff > z_diff) {
			rx = -ry - rz;
		} else if (y_diff > z_diff) {
			ry = -rx - rz;
		} else rz = -rx - ry;

		return this.Hex(rx, ry, rz);
	};

	/**
	 * Center of hexagon
	 */
	hexToPixel = (hex) => {
		var x =
			this.hexSize * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r) +
			this.hexOrigin.x +
			((this.L % 2) + 1) * this.hexSize;
		var y = this.hexSize * ((3 / 2) * hex.r) + this.hexOrigin.y;
		return this.Point(x, y);
	};

	/**
	 * Axial coords of hexagon by pixel coords
	 */
	pixelToHex = ({ x, y }) => {
		let q = ((Math.sqrt(3) / 3) * (x - this.hexOrigin.x) - (1 / 3) * (y - this.hexOrigin.y)) / this.hexSize;
		let r = ((2 / 3) * (y - this.hexOrigin.y)) / this.hexSize;
		return this.Hex(q, r, -q - r);
	};

	drawHexCoordinates = (center, hex) => {
		const ctx = this.canvasID.getContext("2d");
		ctx.fillText(hex.q, center.x + 5, center.y - 5);
		ctx.fillText(hex.r, center.x - 9, center.y - 5);
		ctx.fillText(hex.s, center.x - 5, center.y + 10);
	};

	// const getHexParams = () => {
	// 	const hexHeight = this.hexSize * 2;
	// 	const hexWidth = (Math.sqrt(3) / 2) * hexHeight;
	// 	const vertDist = (hexHeight * 3) / 4;
	// 	const horizDist = hexWidth;

	// 	return { hexHeight, hexWidth, vertDist, horizDist };
	// };

	drawHexGrid = () => {
		let offsetNum = 0;
		let offsetQ = 0;
		for (let r = 0; r < this.L + this.M - 1; r++) {
			for (let q = 0; q < this.N + offsetNum; q++) {
				let center = this.hexToPixel(this.Hex(q + offsetQ, r));
				this.drawHex(center);
				this.drawHexCoordinates(center, this.Hex(q + offsetQ, r, -q - r));
			}
			if (r < this.L - 1) {
				offsetNum++;
				offsetQ--;
			}
			if (r >= this.M - 1) offsetNum--;
		}
	};

	setParams = ({ canvasID, L, M, N, hexSize, hexOrigin, canvasSize }) => {
		this.canvasID = canvasID;
		this.canvasSize = canvasSize;
		this.L = L;
		this.M = M;
		this.N = N;
		this.hexSize = hexSize;
		this.hexOrigin = hexOrigin;
		this.canvasRect = canvasID.getBoundingClientRect();
	};

	canvasID = null;
	canvasRect = {};
	L = 0;
	M = 0;
	N = 0;
	hexOrigin = { x: 0, y: 0 };
	hexSize = 0;
}

export default HexGrid;
