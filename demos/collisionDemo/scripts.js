const JSCanv = new JSCanvas(document.getElementById("canv"));
const testShapes = [];

JSCanv.setAction(() => {
	//JSCanv.clear();
	JSCanv.circ(JSCanv.cursor.x, JSCanv.cursor.y, 20, "#000");
	var x = JSCanv.cursor.x - JSCanv.width / 2;
	var y = JSCanv.cursor.y - JSCanv.height / 2;
	var angle = Collider.fullAtan(x, y);
	console.log(angle);

	var tan = Math.tan(Collider.toRadians(angle));
	var cent = {x: JSCanv.width / 2, y: JSCanv.height / 2};
	JSCanv.strokeSize = 10;
	var plusMinus = 0;
	if((angle > 45 && angle < 135) || (angle > 225 && angle < 315))
	{
		var xInter = cent.y / tan;
		JSCanv.line([cent.x + xInter, cent.x - xInter], [0, JSCanv.height], "#000");
	}
	else
	{
		var yInter = cent.x * tan;
		JSCanv.line([0, JSCanv.width], [cent.y + yInter, cent.y - yInter], "#000");
	}
});
