const getHexCornerCoord = (center, hexSize, i) => {
	let angle_deg = 60 * i - 30;
	let angle_rad = (Math.PI / 180) * angle_deg;
	let x = center.x + hexSize * Math.cos(angle_rad);
	let y = center.y + hexSize * Math.sin(angle_rad);

	return Point(x, y);
};

const Point = (x, y) => {
	return { x, y };
};

const Hex = (q, r) => {
	return { q, r };
};

const drawLine = (canvasID, start, end) => {
	const ctx = canvasID.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
	ctx.closePath();
};

const drawHex = (canvasID, center, hexSize) => {
	for (let i = 0; i <= 5; i++) {
		const start = getHexCornerCoord(center, hexSize, i);
		const end = getHexCornerCoord(center, hexSize, i + 1);
		drawLine(canvasID, start, end);
	}
};

/**
 * Center of hexagon
 */
const hexToPixel = (hex, hexSize, hexOrigin) => {
	var x = hexSize * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r) + hexOrigin.x;
	var y = hexSize * ((3 / 2) * hex.r) + hexOrigin.y;
	return Point(x, y);
};

const drawHexCoordinates = (canvasID, center, hex) => {
	const ctx = canvasID.getContext("2d");
	ctx.fillText(hex.q, center.x - 15, center.y);
	ctx.fillText(hex.r, center.x + 5, center.y);
};

const getHexParams = (hexSize) => {
	const hexHeight = hexSize * 2;
	const hexWidth = (Math.sqrt(3) / 2) * hexHeight;
	const vertDist = (hexHeight * 3) / 4;
	const horizDist = hexWidth;

	return { hexHeight, hexWidth, vertDist, horizDist };
};

export const drawHexGrid = (canvasID, { rowNum, colNum }, hexSize, hexOrigin, canvasSize) => {
	const { hexHeight, hexWidth, vertDist, horizDist } = getHexParams(hexSize);
	const qLeftSide = Math.round(hexOrigin.x / hexWidth) * 2;
	const qRigthSide = Math.round((canvasSize.width - hexOrigin.x) / hexWidth);
	const rTopSide = Math.round(hexOrigin.y / (hexHeight / 2));
	const rBottomSide = Math.round((canvasSize.height - hexOrigin.y) / (hexHeight / 2));

	let offset = Math.floor((qLeftSide + qRigthSide) / 2); // left & right hex's offset compensation
	for (let r = -rTopSide; r <= rBottomSide; r++) {
		for (let q = -qLeftSide; q <= qRigthSide; q++) {
			let center = hexToPixel(Hex(q + offset, r), hexSize, hexOrigin);
			if (
				center.x > hexWidth / 2 &&
				center.x < canvasSize.width - hexWidth / 2 &&
				center.y > hexHeight / 2 &&
				center.y < canvasSize.height - hexHeight / 2
			) {
				drawHex(canvasID, center, hexSize);
				drawHexCoordinates(canvasID, center, Hex(q, r));
			}
		}
		offset -= Math.abs(r) % 2 === 0 ? 1 : 0;
	}
};
