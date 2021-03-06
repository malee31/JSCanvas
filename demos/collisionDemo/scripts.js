const JSCanv = new JSCanvas(document.getElementById("canv"));
const testShapes = [
	["POLY",
		[JSCanv.width / 2 - 1000, JSCanv.width / 2 - 500, JSCanv.width / 2 - 500, JSCanv.width / 2 - 1000],
		[JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250, JSCanv.height / 2 + 250],
	"#0F0"],
	["POLY",
		[JSCanv.width / 2 + 1000, JSCanv.width / 2 + 1000, JSCanv.width / 2 + 500, JSCanv.width / 2 + 500],
		[JSCanv.height / 2 + 250, JSCanv.height / 2 - 250, JSCanv.height / 2 - 250, JSCanv.height / 2 + 250],
	"#00F"],
	["POLY",
		[1941.5857011915673,2541.5857011915673,2341.5857011915673,2141.5857011915673],
		[781.6773602199817,981.6773602199817,1381.6773602199817,1281.6773602199817],
	"#00F"],
	["POLY",
		[1729.0559120073326,2129.0559120073326,1929.0559120073326,2029.0559120073326],
		[821.3015582034831,921.3015582034831,1071.3015582034832,1521.3015582034832],
	"#000000"],
	["POLY",
		[1793.8955087076076,1993.8955087076076,1993.8955087076076,2193.8955087076074],
		[857.3235563703024,1257.3235563703024,1057.3235563703024,1157.3235563703024],
	"#000000"]
];
//Square, Square, Convex Quadrilateral, Concave Quadrilateral, Concave Quadrilateral (Cursor shaped)
const shiftIncrement = 50;
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

	for(var testNum = 0; testNum < 2; testNum++)
	{
		var shape=testShapes[testNum];
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
	if(Collider.shadowTest(projectShapes[0], projectShapes[1])) JSCanv.rect(10, 15, [90, 90], "#0F0");
	else JSCanv.rect(10, 15, [90, 90], "#F00");

	//Complete Collision Testing TODO: Convert from JSCanvas Notation to Object / PointSet Notation
	if(Collider.collisionTestSAT(Collider.pointSetify(testShapes[0][1], testShapes[0][2]), Collider.pointSetify(testShapes[1][1], testShapes[1][2]))) JSCanv.circ(160, 60, 50, "#0F0");
	else JSCanv.circ(160, 60, 50, "#F00");

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
				for(var pointPos = 0; pointPos < testShapes[shapeNum][0].length; pointPos++)
				{
					if(shapeNum == 0) testShapes[shapeNum][1][pointPos] += shiftIncrement * Math.cos(Collider.toRadians(angle));
					else if(shapeNum == 1) testShapes[shapeNum][1][pointPos] -= shiftIncrement * Math.cos(Collider.toRadians(angle));
				}
			}
		}
	}
});

function concaveTestAll()
{
	for(let shape of testShapes)
	{
		console.log(Collider.isConcave(Collider.pointSetify(shape[1], shape[2])) ? "Concave" : "Convex");
	}
}
