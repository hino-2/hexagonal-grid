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
		this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
	};

	drawLine = (end, color, width) => {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width;
		this.ctx.lineTo(end.x, end.y);
	};

	drawHex = (center, color) => {
		this.ctx.beginPath();
		const start = this.getHexCornerCoord(center, 0);
		this.ctx.moveTo(start.x, start.y);
		for (let i = 0; i <= 5; i++) {
			const end = this.getHexCornerCoord(center, i + 1);
			this.drawLine(end, color);
		}
		if (color) {
			this.ctx.fillStyle = color;
			this.ctx.fill();
		}
		this.ctx.stroke();
		this.ctx.closePath();
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

	cubeDirection = (direction) => {
		const cubeDirections = [
			this.Hex(1, 0, -1),
			this.Hex(1, -1, 0),
			this.Hex(0, -1, 1),
			this.Hex(-1, 0, 1),
			this.Hex(-1, 1, 0),
			this.Hex(0, 1, -1),
		];

		return cubeDirections[direction];
	};

	cubeAdd = (a, b) => {
		return this.Hex(a.q + b.q, a.r + b.r, a.s + b.s);
	};

	getNeighbor = (h, direction) => {
		return this.cubeAdd(h, this.cubeDirection(direction));
	};

	//#region
	// findDomainByHexCoords = ({ q, r, s }, domains) => {
	// 	return domains.find((domain) =>
	// 		domain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s)
	// 	);
	// };

	// getColoredNeighbor = (h, domains) => {
	// 	for (let i = 0; i <= 5; i++) {
	// 		const { q, r, s } = this.getNeighbor(h, i);
	// 		const neighbor = domains.find((domain) =>
	// 			domain.hexs.find(({ q: _q, r: _r, s: _s }) => _q === q && _r === r && _s === s)
	// 		);
	// 		if (neighbor) return neighbor;
	// 	}
	// 	return null;
	// };

	// getColorsOfNeighbors = (h, domains) => {
	// 	let colorsOfNeighbors = new Set();
	// 	for (let i = 0; i <= 5; i++) {
	// 		const { q, r, s } = this.getNeighbor(h, i);
	// 		let domain = this.findDomainByHexCoords({ q, r, s }, domains);
	// 		if (domain) {
	// 			colorsOfNeighbors.add(domain.color);
	// 			console.log(domain.color);
	// 		}
	// 		console.log("colorsOfNeighbors", colorsOfNeighbors);
	// 	}
	// 	return [...colorsOfNeighbors];
	// };
	//#endregion
	drawNeighbors = (h, color) => {
		for (let i = 0; i <= 5; i++) {
			const { q, r, s } = this.getNeighbor(this.Hex(h.q, h.r, h.s), i);
			const { x, y } = this.hexToPixel(this.Hex(q, r, s));
			this.drawHex({ x, y }, color);
		}
	};

	drawArray = (hexArray) => {
		// hexArray.forEach(({ color, hexs }) => {
		// 	hexs.forEach(({ x, y }) => this.drawHex({ x, y }, color));
		// });
		hexArray.forEach(({ x, y }) => this.drawHex({ x, y }, "red"));
	};

	drawHexCoordinates = (center, hex, checked) => {
		this.ctx.fillText(hex.q, center.x + 5, center.y - 5);
		this.ctx.fillText(hex.r, center.x - 9, center.y - 5);
		this.ctx.fillText(hex.s, center.x - 5, center.y + 12);
		// this.ctx.fillText(checked, center.x, center.y);
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
				let checked = 0;
				this.drawHex(center);
				this.drawHexCoordinates(center, this.Hex(q + offsetQ, r, -q - offsetQ - r), checked);
				this.hexMap.push({
					q: q + offsetQ,
					r: r,
					s: -q - offsetQ - r,
					checked: checked,
					x: center.x,
					y: center.y,
				});
			}
			if (r < this.L - 1) {
				offsetNum++;
				offsetQ--;
			}
			if (r >= this.M - 1) offsetNum--;
		}
	};

	setParams = ({ canvasID, L, M, N, hexSize, canvasSize }) => {
		this.canvasID = canvasID;
		this.ctx = canvasID.getContext("2d");
		this.canvasSize = canvasSize;
		this.L = L;
		this.M = M;
		this.N = N;
		this.hexSize = hexSize;
		this.canvasRect = canvasID.getBoundingClientRect();
		this.hexOrigin = {
			x: 50 + (L + 1) * hexSize,
			y: 50,
		};
	};

	canvasID = null;
	canvasRect = {};
	L = 0;
	M = 0;
	N = 0;
	hexOrigin = { x: 50, y: 50 };
	hexSize = 0;
	hexMap = [];
}

export default HexGrid;
