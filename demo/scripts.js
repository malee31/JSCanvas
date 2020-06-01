const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
JSCanv.toggleVerbose(true);
var blockGrid = {start: [], play: [], end: []};
var sprites = [];
var mode = "start";
JSCanv.redrawing = true;

JSCanv.setAction(() => {
	console.log("Act");
	JSCanv.rect(JSCanv.cursor.x, JSCanv.cursor.y, 50, 50, "#FFF");
});

//JSCanv.timeout = 5000;
JSCanv.rect(JSCanv.centerX - 500, JSCanv.centerY - 250, 1000, 500, "#000");
JSCanv.rect(JSCanv.centerX - 500, JSCanv.centerY - 250, 1000, 500, "#000");
