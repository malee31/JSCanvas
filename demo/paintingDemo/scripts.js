const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
const inputs = document.querySelectorAll("input");
document.getElementById("exportJSCanv").onclick = () => {
	document.getElementById("exportJSCanv").innerHTML = JSCanv.export;
	console.log(JSCanv.export);
}

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
	var size = Number(inputs[3].value) != NaN ? Number(inputs[3].value) : 0;
	var shape = JSCanv.shapeType(inputs[1].value.toUpperCase().trim());
	var output = [shape, JSCanv.mouseX, JSCanv.mouseY, size, size];
	var color = inputs[0].value.trim();
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
