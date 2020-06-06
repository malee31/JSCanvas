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
	JSCanv.softDraw(formShape());
};

function formShape()
{
	var size = Number(inputs["size"].value) != NaN ? Number(inputs["size"].value) : 0;
	var shape = JSCanv.shapeType(inputs["shape"].value.toUpperCase().trim());
	var output = [shape, JSCanv.mouseX, JSCanv.mouseY, size, size];
	var color = inputs["color"].value.trim();
	if(shape == "CIRC")
	{
		output.pop();
		color = JSCanv.colorChange(color, JSCanv.stroke);
	}
	else if(shape == "TRI")
	{
		output.pop();
		output.pop();
		output.push(JSCanv.mouseX, JSCanv.mouseY + size, JSCanv.mouseX + size, JSCanv.mouseY);
		color = JSCanv.colorChange(color, JSCanv.stroke);
	}
	else
	{
		color = JSCanv.colorChange(color, JSCanv.fill);
	}
	output.push(color);
	return output;
}
