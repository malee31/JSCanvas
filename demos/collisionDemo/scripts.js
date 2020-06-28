const JSCanv = new JSCanvas(document.getElementById("canv"));
const testShapes = [["POLY", [JSCanv.width / 2 - 1000, JSCanv.width / 2 - 500, JSCanv.width / 2 - 500, JSCanv.width / 2 - 1000], [JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250, JSCanv.height / 2 + 250], "#0F0"], ["POLY", [JSCanv.width / 2 + 1000, JSCanv.width / 2 + 1000, JSCanv.width / 2 + 500, JSCanv.width / 2 + 500], [JSCanv.height / 2 + 250, JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250], "#00F"]];
const shiftIncrement = 100;
var currentTime = -1;

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
	var projectShapes = [];
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
			JSCanv.circ(shape[1][point], shape[2][point], 15, shape[3]);
			JSCanv.line([projected["x"][point], shape[1][point]], [projected["y"][point], shape[2][point]], shape[3]);
		}
		JSCanv.line(projected["x"], projected["y"], shape[shape.length - 1]);
		projectShapes.push(projected);
	}

	//ShadowTesting Successful!!!
	if(Collider.shadowTest(projectShapes[0], projectShapes[1])) JSCanv.circ(60, 60, 50, "#F00");
	else JSCanv.circ(60, 60, 50, "#0F0");

	//Code for making the shapes shift around go here
	if(JSCanv.mouseDown && JSCanv.counter != currentTime)
	{
		currentTime = JSCanv.counter;
		var move = true;
		for(var shapeNum = 0; shapeNum < testShapes.length; shapeNum++)
		{
			for(var pointPos = 0; pointPos < testShapes[shapeNum].length; pointPos++)
			{
				if(shapeNum == 0)
				{
					if((testShapes[shapeNum][1][pointPos] <= 0 && x < 0) || (testShapes[shapeNum][1][pointPos] >= JSCanv.width && x >= 0)) move = false;
				}
				else if(shapeNum == 1)
				{
					if((testShapes[shapeNum][1][pointPos] <= 0 && x >= 0) || (testShapes[shapeNum][1][pointPos] >= JSCanv.width && x < 0)) move = false;
				}
			}
		}

		if(move)
		{
			for(var shapeNum = 0; shapeNum < testShapes.length; shapeNum++)
			{
				for(var pointPos = 0; pointPos < testShapes[shapeNum].length; pointPos++)
				{
					if(shapeNum == 0) testShapes[shapeNum][1][pointPos] += shiftIncrement * (x < 0 ? -1 : 1);
					else if(shapeNum == 1) testShapes[shapeNum][1][pointPos] -= shiftIncrement * (x < 0 ? -1 : 1);
				}
			}
		}
	}
});
