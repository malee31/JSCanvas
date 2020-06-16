class JSDrawCluster
{
	constructor(JSMemoryCanvasInstance, x, y)
	{
		this.JSCanvas = JSMemoryCanvasInstance;
		this.drawCenter = [typeof x == "number" ? x : 0, typeof y == "number" ? y : 0];
		this.shift = [0, 0];
		this.drawObjects = [];
	}

	/**
	 * Adds a new shape array into the draw group
	 */
	add(obj)
	{
		drawObjects.push(obj);
	}

	/**
	 * Removes all shapes from the draw group
	 */
	clear()
	{
		drawObjects = [];
	}

	/**
	 * Shifts the draw group's center's location by x and y
	 * @param {number} [x] The number of pixels to shift in the X direction
	 * @param {number} [y] The number of pixels to shift in the Y direction
	 */
	shiftCenter(x, y)
	{
		if(typeof x == "number") this.drawCenter[0] += x;
		if(typeof y == "number") this.drawCenter[1] += y;
	}

	shiftAll()
	{
		var shifted = [];
		for(let drawObj in this.drawObjects)
		{
			var shiftedInstance = inputArrayCopy(drawObj);
			//TODO: Shift X and Y by this.shift[0] and this.shift[1] respectively
			for(var pos = 0; pos < Math.min(shiftedInstance[1].length, shiftedInstance[2].length); pos++)
			{
				shiftedInstance[1][pos] += this.shift[0] - this.drawCenter[0];
				shiftedInstance[2][pos] += this.shift[1] - this.drawCenter[1];
			}
			shifted.push(shiftedInstance);
		}
		return shifted;
	}

	/**
	 * Translates the entire draw group
	 * @param {number} [x] The number of pixels to shift in the X direction
	 * @param {number} [y] The number of pixels to shift in the Y direction
	 */
	translate(x, y)
	{
		if(typeof x == "number") this.shift[0] += x;
		if(typeof y == "number") this.shift[1] += y;
	}

	/**
	 * Draws the draw group in its location after translating all the shapes it is made out of
	 */
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

	/**
	 * Makes a shallow copy of an array with a depth of two
	 * @param {Array} arr Array to be copied
	 * @param {Array} [base] Array to push a copy of arr into
	 */
	inputArrayCopy(arr, base)
	{
		var rebuild = Array.isArray(base) ? base : [];
		for(let item of arr)
		{
			if(Array.isArray(item)) rebuild.push(item.slice());
			else rebuild.push(item);
		}
		return rebuild;
	}

	move(x, y) { translate(x, y); }
}
