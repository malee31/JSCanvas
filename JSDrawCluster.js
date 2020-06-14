class JSDrawCluster
{
	constructor(JSMemoryCanvasInstance, x, y)
	{
		this.JSCanvas = JSMemoryCanvasInstance;
		this.drawCenter = [typeof x == "number" ? x : 0, typeof y == "number" ? y : 0];
		this.shift = [0, 0];
		this.drawObjects = [];
	}

	add(obj)
	{
		drawObjects.push(obj);
	}

	clear()
	{
		drawObjects = [];
	}

	shiftCenter(x, y)
	{
		this.shift[0] += x;
		this.shift[1] += y;
	}

	shiftAll()
	{
		var shifted = [];
		for(let drawObj in this.drawObjects)
		{
			var shiftedInstance = drawObj.slice();
			//TODO: Shift X and Y by this.shift[0] and this.shift[1] respectively
			shifted.push(shiftedInstance);
		}
		return shifted;
	}

	translate(x, y)
	{
		this.drawCenter[0] += x;
		this.drawCenter[1] += y;
	}

	draw()
	{
		var shifted = this.shiftAll();
		for(let drawObj of shifted)
		{
			if(typeof this.JSCanvas.softDraw = "function") this.JSCanvas.softDraw(drawObj);
			else if(typeof this.JSCanvas.draw = "function") this.JSCanvas.draw(drawObj);
			else console.log("ERROR: No JSCanvas set. Cannot find draw function");
		}
	}

	move(x, y) { translate(x, y); }
}
