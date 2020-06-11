const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
const inputs = {
	shape: document.getElementsByName("shape")[0],
	color: document.getElementsByName("color")[0],
	size: document.getElementsByName("size")[0],
	start: document.getElementsByName("start")[0],
	x: document.getElementsByName("xCoords")[0],
	y: document.getElementsByName("yCoords")[0]
};

document.getElementById("exportJSCanv").onclick = () => {
	document.getElementById("exportJSCanv").innerHTML = JSCanv.export;
	console.log(JSCanv.export);
};

JSCanv.mouseDown = () => {
	JSCanv.draw(...formShape());
};

JSCanv.mouseMove = () => {
	JSCanv.clear();
	JSCanv.redraw();
	JSCanv.softDraw(...formShape());
};

function formShape()
{
	var shape = [JSCanv.shapeType(inputs["shape"].value.toUpperCase().trim())];
	var xPositions = [JSCanv.mouseX].concat(arrayifyFloat(inputs["x"].value));
	var yPositions = [JSCanv.mouseY].concat(arrayifyFloat(inputs["y"].value));
	for(var xPos = 1; xPos < xPositions.length; xPos++)
	{
		xPositions[xPos] += xPositions[0];
	}
	for(var yPos = 1; yPos < yPositions.length; yPos++)
	{
		yPositions[yPos] += yPositions[0];
	}
	var sizes = arrayifyFloat(inputs["size"].value);
	var color = inputs["color"].value.trim();
	if(shape[0] == "CIRC")
	{
		color = JSCanv.colorChange(color, JSCanv.stroke);
	}
	else if(shape[0] == "TRI" || shape[0] == "LINE" || shape[0] == "POLY")
	{
		sizes = [];
		color = JSCanv.colorChange(color, JSCanv.stroke);
	}
	else
	{
		color = JSCanv.colorChange(color, JSCanv.fill);
	}
	shape.push(xPositions, yPositions, sizes, color);
	return shape;
}

function arrayifyFloat(str) { return str.replace(" ", "").split(",").filter(inputt => !Number.isNaN(Number.parseFloat(inputt))).map(inputt => Number.parseFloat(inputt)); }