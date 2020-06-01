const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));
JSCanv.toggleVerbose(1, true);

JSCanv.setAction(() => {
	JSCanv.circ(JSCanv.cursor.x, JSCanv.cursor.y, 20, "#FFF");
});
