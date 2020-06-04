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
	var x = JSCanv.mouseX;
	var y = JSCanv.mouseY;
	var size = Number(inputs[3].value) != NaN ? Number(inputs[3].value) : 0;
	var shape = inputs[1].value.toUpperCase().trim();
	var color = inputs[0].value.trim();
	if(shape == "CIRC" || shape == "CIRCLE") return [shape, x, y, size, color];
	return [shape, x, y, size, size, color];
}
