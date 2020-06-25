/** An extension to the JSCanvas class that includes being able to redraw past shapes and draw temporary shapes before erasing them */
class JSMemoryCanvas extends JSCanvas
{
	/**
	 * Initializes the JSMemoryCanvas object
	 * @param {HTMLCanvasElement} canv Canvas for this specific instance of JSMemoryCanvas
	 */
	constructor(canv)
	{
		super(canv);
		window.addEventListener("resize", () => {
			this.updateResizers();
			this.redraw();
		});
		this.restoreAllDefaults();
	}

	/**
	 * Restores defaults for the canvas drawing styles along with JSMemoryCanvas' additional arrays
	 */
	restoreAllDefaults()
	{
		this.history = [];
		this.drawGroups = [];
		super.restoreAllDefaults();
	}

	/**
	 * Clears stored shapes in this.history
	 */
	forget(includeDrawGroups)
	{
		this.history = [];
		if(includeDrawGroups) this.drawGroups = [];
	}

	/**
	 * Feeds in input arrays to draw either once or push it into memory permanantly
	 */
	feed(inputs, softFeed)
	{
		if(!Array.isArray(inputs))
		{
			this.verboseLog("error", "feed", "Incompatible feed type", inputs);
			return;
		}
		if(!Array.isArray(inputs[0])) inputs = [inputs];
		for(let input of inputs)
		{
			if(!softFeed) this.history.push(this.inputArrayCopy(input.slice()));
			else this.softDraw(this.inputArrayCopy(input));
		}
	}

	/**
	 * Redraws all shapes stored in history
	 */
	redraw()
	{
		this.verboseLog("run", "redraw", this.history);
		for(let memory of this.history)
		{
			this.verboseLog("excessive", "redraw", memory);
			this.softDraw(memory[0], ...memory.slice(1));
		}
		for(let group of this.drawGroups)
		{
			if(group.draw) group.draw();
		}
	}

	/**
	 * Temporarily draws the input shapes once rather than pushing it into the history.
	 * @param {string} shape The shape to draw. Must be one of the valid cases for any action to be taken
	 * @param {...*} fed Arguments to pass into the draw function for the shape. Generally [xPositions, yPositions, [sizing], [additionalOptions], color]
	 */
	softDraw(shape, ...fed)
	{
		shape = this.shapeType(shape);
		switch(shape)
		{
			case "RECT":
				super.rect(...fed);
			break;
			case "CIRC":
				super.circ(...fed);
			break;
			case "TRI":
				super.tri(...fed);
			break;
			case "LINE":
				super.line(...fed);
			break;
			case "IMG":
				super.img(...fed);
			break;
			case "POLY":
				super.poly(...fed);
			break;
			default:
				super.verboseLog("noAction", "softDraw", "Invalid Shape Input Entered");
			break;
		}
		this.verboseLog("excessive", "softDraw", shape, fed, shape.toUpperCase().trim());
	}

	/**
	 * Draws a rectangle given x, y, width, method, and the color (optional).
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas rect method. See parameters for that instead.
	 */
	rect(...args)
	{
		super.rect(...args.slice());
		this.historyPusher("RECT", args);
	}

	/**
	 * Draws a circle given x, y, radius, and the color (optional).
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas circ method. See parameters for that instead.
	 */
	circ(...args)
	{
		super.circ(...args.slice());
		this.historyPusher("CIRC", args);
	}

	/**
	 * Draws a triangle given arrays with the x and y and the color (optional).
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas tri method. See parameters for that instead.
	 */
	tri(...args)
	{
		super.tri(...args.slice());
		this.historyPusher("TRI", args);
	}

	/**
	 * Draws a line given arrays with the x and y and the color (optional).
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas line method. See parameters for that instead.
	 */
	line(...args)
	{
		super.line(...args.slice());
		this.historyPusher("LINE", args);
	}

	/**
	 * Draws a rectangle given x, y, width, method, and the color (optional).
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas line method. See parameters for that instead.
	 */
	poly(...args)
	{
		super.poly(...args.slice());
		this.historyPusher("POLY", args);
	}

	/**
	 * Draws an image given a valid image object and positioning values
	 * Calls the method in super after pushing the inputs into history.
	 * @param {...*} args Arguments for the JSCanvas line method. See parameters for that instead.
	 */
	img(...args)
	{
		super.img(...args.slice());
		this.historyPusher("IMG", args);
	}

	/**
	 * Adds a group of drawing inputs to be redrawn. To be implemented later
	 * @param {object} group A draw group to be added
	 */
	addGroup(group) { this.drawGroups.push(group); }

	/**
	 * Pushes a copy of the inputs into the history after prepending a drawing method name
	 * @param {string} methodName Drawing method to prepend to the inputs
	 * @param {Array} args Inputs for drawing parameters
	 */
	historyPusher(methodName, args)
	{
		if(Array.isArray(args) && args.length == 1)
		{
			this.verboseLog("noAction", "historyPusher", "Repeat draw, no push: ", methodName, args);
			return;
		}
		var copied = this.inputArrayCopy(args, [methodName]);
		this.verboseLog("success", "historyPusher", "History Pushing: ", args, "Rebuild: ", copied);
		this.history.push(copied);
		return;
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

	get export()
	{
		var exportation = JSON.stringify(this.history);
		exportation = `[\n\t${exportation.slice(1, exportation.length - 1)}\n]`;
		var deficit = 0;
		for(var charIndex = 3; charIndex < exportation.length - 2; charIndex++)
		{
			if(exportation.charAt(charIndex) == "[") deficit++;
			if(exportation.charAt(charIndex) == "]") deficit--;
			if(deficit == 0)
			{
				exportation = `${exportation.slice(0, charIndex + 1)},\n\t${exportation.slice(charIndex + 2, exportation.length)}`;
				charIndex += 3;
			}
		}
		return exportation.slice(0, exportation.length - 4) + "\n]";
	}
}
