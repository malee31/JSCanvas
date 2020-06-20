const JSCanv = new JSMemoryCanvas(document.getElementById("canv"));

JSCanv.setAction(() => {
	JSCanv.circ(JSCanv.cursor.x, JSCanv.cursor.y, 20, "#000");
	var x = JSCanv.cursor.x - JSCanv.width / 2;
	var y = JSCanv.cursor.y - JSCanv.height / 2;
	var angle = Collider.toDegrees(Math.atan(y / x));
	angle *= -1;
	if(x < 0) angle += 180;
	else if(y > 0) angle += 360;
	console.log(angle);
});
