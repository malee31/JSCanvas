const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
const inputs = {
	shape: document.getElementById("shape"),
	color: document.getElementsByName("color")[0],
	size: document.getElementsByName("size")[0],
	start: document.getElementsByName("start")[0],
	x: document.getElementsByName("xCoords")[0],
	y: document.getElementsByName("yCoords")[0]
};

//Export function
document.getElementById("exportJSCanv").onclick = () => {
	document.getElementById("exportJSCanv").innerHTML = JSCanv.export;
	console.log(JSCanv.export);
};

//Permanently draws the shape onto the canvas
JSCanv.mouseDown = () => {
	JSCanv.draw(...formShape());
};

//Shows the shape preview
JSCanv.mouseMove = () => {
	JSCanv.clear();
	JSCanv.redraw();
	JSCanv.softDraw(...formShape());
};

//Converts all inputs into a useable format for JSCanvas
function formShape()
{
	//Extracting values from HTML inputs
	var shape = [JSCanv.shapeType(inputs["shape"].value.toUpperCase().trim())];
	var sizes = arrayifyFloat(inputs["size"].value);
	var useSize = true;
	var color = JSCanv.colorFix(shape[0], inputs["color"].value.trim());

	//Convert input values to array values and floats instead of strings and shift them by the mouse coords
	var xPositions = [JSCanv.mouseX].concat(arrayifyFloat(inputs["x"].value));
	var yPositions = [JSCanv.mouseY].concat(arrayifyFloat(inputs["y"].value));
	for(var xPos = 1; xPos < xPositions.length; xPos++) xPositions[xPos] += xPositions[0];
	for(var yPos = 1; yPos < yPositions.length; yPos++) yPositions[yPos] += yPositions[0];

	//Resizing things to fit. Unnecessary except for useSize = false.
	switch(shape[0])
	{
		case "CIRC":
		case "RECT":
			xPositions = xPositions.slice(0, 1);
			yPositions = yPositions.slice(0, 1);
		break;
		case "TRI":
			xPositions = xPositions.slice(0, 3);
			yPositions = yPositions.slice(0, 3);
		case "LINE":
		case "POLY":
			useSize = false;
		break;
		default:
			
	}

	//Assembles arrays in the format JSCanvas accepts for drawing
	shape.push(xPositions, yPositions);
	if(useSize) shape.push(sizes);
	shape.push(color);
	return shape;
}

// Converts a comma separated list of numbers into an array of floats whenever possible. Skips over invalid inputs.
function arrayifyFloat(str) { return str.replace(" ", "").split(",").filter(inputt => !Number.isNaN(Number.parseFloat(inputt))).map(inputt => Number.parseFloat(inputt)); }
