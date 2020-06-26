const JSCanv = new JSCanvas(document.getElementById("canv"));
const testShapes = [["POLY", [JSCanv.width / 2 - 1000, JSCanv.width / 2 - 500, JSCanv.width / 2 - 500, JSCanv.width / 2 - 1000], [JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250, JSCanv.height / 2 + 250], "#0F0"], ["POLY", [JSCanv.width / 2 + 1000, JSCanv.width / 2 + 1000, JSCanv.width / 2 + 500, JSCanv.width / 2 + 500], [JSCanv.height / 2 + 250, JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250], "#00F"]];

JSCanv.setAction(() => {
	JSCanv.clear();
	JSCanv.circ(JSCanv.cursor.x, JSCanv.cursor.y, 20, "#000");
	var x = JSCanv.cursor.x - JSCanv.width / 2;
	var y = JSCanv.cursor.y - JSCanv.height / 2;
	var angle = Collider.fullAtan(x, y);
	//console.log(angle);

	var tan = Math.tan(Collider.toRadians(angle));
	var cent = {x: JSCanv.width / 2, y: JSCanv.height / 2};
	JSCanv.strokeSize = 10;
	var plusMinus = 0;
	var lineX = [];
	var lineY = [];
	if((angle > 45 && angle < 135) || (angle > 225 && angle < 315))
	{
		var xInter = cent.y / tan;
		lineX = [cent.x + xInter, cent.x - xInter];
		lineY = [0, JSCanv.height];
	}
	else
	{
		var yInter = cent.x * tan;
		lineX = [0, JSCanv.width];
		lineY = [cent.y + yInter, cent.y - yInter];
	}
	JSCanv.line(lineX, lineY, "#000");

	for(let shape of testShapes)
	{
		JSCanv.draw(...shape);
		var projected = Collider.project(shape[1], shape[2], ...Collider.linify([lineX[0], lineY[0]], [lineX[1], lineY[1]]))
		for(var point = 0; point < projected["x"].length; point++)
		{
			JSCanv.circ(projected["x"][point], projected["y"][point], 15, shape[3]);
		}
	}
});
