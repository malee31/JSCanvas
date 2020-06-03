const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
const inputs = document.querySelectorAll("input");
JSCanv.toggleVerbose(1, true);


JSCanv.mouseDown = () => {
	console.log("Click");
	var x = JSCanv.mouseX;
	var y = JSCanv.mouseY;
	var size = Number(inputs[3].value) != NaN ? Number(inputs[3].value) : 0;
	JSCanv.draw(inputs[1].value, x, y, size, size, inputs[0].value);
	console.log("Draw: ", inputs[1].value, x, y, size, size, inputs[0].value);
};

JSCanv.mouseMove = () => {
	JSCanv.clear();
	JSCanv.redraw();
	var x = JSCanv.mouseX;
	var y = JSCanv.mouseY;
	var size = Number(inputs[3].value) != NaN ? Number(inputs[3].value) : 0;
	JSCanv.softDraw([inputs[1].value, x, y, size, size, inputs[0].value]);
	console.log("Shift: ", inputs[1].value, x, y, size, size, inputs[0].value);
};
