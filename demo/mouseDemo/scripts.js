const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
JSCanv.toggleVerbose(1, true);

JSCanv.setAction(() => {
	if(JSCanv.mouse.mouseDown) JSCanv.circ(JSCanv.cursor.x, JSCanv.cursor.y, 20, "#000");
});
