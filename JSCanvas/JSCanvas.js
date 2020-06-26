/** Class containing functions for canvas drawing or animations */
class JSCanvas
{
	/**
	 * Initializes the JSCanvas object
	 * @param {HTMLCanvasElement} canv Canvas for this specific instance of JSCanvas
	 */
	constructor(canv)
	{
		this.canvas = canv;
		this.ctx = canv.getContext("2d");
		window.addEventListener("resize", () => {
			this.updateResizers();
		})
		this.makeMouse();
		this.makeModes();
		this.attachMouseHandlers();
		this.restoreAllDefaults();
		this.updateResizers();
	}

	/**
	 * Creates or resets this.cursor and the mouse event listener actions
	 */
	makeMouse()
	{
		this.cursor = {
			x: -999,
			y: -999,
			mouseDown: false,
			mouseClicked: false,
			onMouseDown: e => {
				this.verboseLog("run", "makeMouse", "Mouse Down: ", e);
				this.cursor.mouseDown = true;
			},
			onMouseMove: e => {
				this.verboseLog("excessive", "makeMouse", "Mouse Position: ", [e.clientX, e.clientY]);
				var canvasBound = this.canvas.getBoundingClientRect();
				this.cursor["x"] = this.cursor.scale * (e.clientX - canvasBound.left);
				this.cursor["y"] = this.cursor.scale * (e.clientY - canvasBound.top);
			},
			onMouseClick: e => {
				this.verboseLog("run", "makeMouse", "Mouse Up: ", e);
				this.cursor.mouseClicked = true;
				this.cursor.mouseDown = false;
			}
		};
	}

	/**
	 * Makes the object containing the alternative drawing methods to use
	 */
	makeModes()
	{
		this.drawModes = {
			rect: "normal",
			text: "normal"
		};
	}

	/**
	 * Attaches event listeners for the mouse using the functions in this.cursor
	 */
	attachMouseHandlers()
	{
		this.canvas.addEventListener("mousemove", this.cursor.onMouseMove);
		this.canvas.addEventListener("mousedown", this.cursor.onMouseDown);
		this.canvas.addEventListener("mouseup", this.cursor.onMouseClick);
	}

	/**
	 * Resizes canvas and sets scale factor for cursor
	 */
	updateResizers()
	{
		if(typeof this.defaultDimensions != "object")
		{
			this.verboseLog("success", "updateResizers", "Reset Dimensions");
			this.defaultDimensions = {width: this.canvas.width, height: this.canvas.height};
		}
		//Fixes Aspect Ratio
		this.canvas.width = this.defaultDimensions["height"] * (this.canvas.clientWidth / this.canvas.clientHeight);
		this.resolutionScale = Math.floor(this.maxWidth / Math.max(this.defaultDimensions["height"], this.canvas.width));
		this.canvas.width *= this.resolutionScale;
		this.canvas.height = this.defaultDimensions["height"] * this.resolutionScale;
		this.cursor.scale = this.width / this.canvas.clientWidth;
	}

	/**
	 * Restores defaults for the canvas drawing styles
	 */
	restoreDefaults()
	{
		this.ctx.fillStyle = "#000000";
		this.ctx.strokeStyle = "#000000";
		this.ctx.font = "10px Arial";
		this.resolutionScale = 1;
		this.maxWidth = 4096;
	}

	/**
	 * Restores all defaults and resets JSCanvas back to near initial state
	 */
	restoreAllDefaults()
	{
		this.restoreDefaults();
		this.initVerbose();
		this.resetTimers();
	}

	/**
	 * Resets the timer back to original state
	 */
	resetTimers()
	{
		this.counter = 0;
		this.timeout = 0;
		//Results in 9000000000000000
		this.timerLoop = Number.MAX_SAFE_INTEGER - 7199254740991;
		requestAnimationFrame(this.sanityCheck.bind(this));
		this.timer = setInterval(this.tick.bind(this), 500);
	}

	/**
	 * Runs repeatedly as many times as possible using requestAnimationFrame
	 * Also handles calling the this.action function
	 * Good for animations when used with this.counter
	 */
	sanityCheck()
	{
		if(typeof this.action == "function") this.action();
		this.cursor.mouseClicked = false;
		if(this.timeout > 0)
		{
			setTimeout(requestAnimationFrame, this.timeout, this.sanityCheck.bind(this));
		}
		else
		{
			requestAnimationFrame(this.sanityCheck.bind(this));
		}
	}

	/**
	 * Increments timer and loops once it reaches the set limit
	 */
	tick()
	{
		this.counter = (this.counter + 1) % this.timerLoop;
	}

	/**
	 * Sets the action the canvas repeatedly does each time it reruns.
	 */
	setAction(cb)
	{
		if(typeof cb == "function")
		{
			this.action = cb;
			this.verboseLog("success", "setAction", "Action set");
			return;
		}
		this.verboseLog("error", "setAction", "Not a function", cb);
	}

	/*scalePixel(val)
	{
		return val * this.resolutionScale;
	}*/


	/**
	 * General function for drawing shapes onto the canvas
	 * Reroutes arguments into their respective functions
	 * @param {string} shape The shape to draw. Must be one of the valid cases for any action to be taken
	 * @param {...*} args Arguments to pass into the draw function for the shape. Generally [xPositions, yPositions, [sizing], [additionalOptions], color]
	 */
	draw(shape, ...args)
	{
		switch(this.shapeType(shape))
		{
			case "RECT":
				this.rect(...args);
			break;
			case "CIRC":
				this.circ(...args);
			break;
			case "TRI":
				this.tri(...args);
			break;
			case "LINE":
				this.line(...args);
			break;
			case "IMG":
				this.img(...args);
			break;
			case "POLY":
				this.poly(...args);
			break;
			default:
				this.verboseLog("noAction", "draw", "Invalid Shape Input Entered", this.shapeType(shape));
			break;
		}
		this.verboseLog("excessive", "draw", this.shapeType(shape), args);
	}

	/**
	 * Fixes the string that represents the shape type for the draw function into their canon values
	 * @param {string} shape The shape to be processed by trimming and capitalizing before switching
	 * @returns {(string|*)} returns the fixed string or the input if the input was invalid and unable to be fixed.
	 */
	shapeType(shape)
	{
		if(typeof shape != "string")
		{
			this.verboseLog("error", "shapeType", "shapeType failed on typeof shape == 'string'", shape);
			return shape;
		}
		switch(shape.trim().toUpperCase())
		{
			case "RECT":
			case "RECTANGLE":
				return "RECT";
			break;
			case "CIRC":
			case "CIRCLE":
				return "CIRC";
			break;
			case "TRI":
			case "TRIANGLE":
				return "TRI";
			break;
			case "LINE":
			case "LN":
				return "LINE";
			break;
			case "IMG":
			case "IMAGE":
				return "IMG";
			break;
			case "POLY":
			case "POLYGON":
				return "POLY";
			break;
		}
		this.verboseLog("noAction", "shapeType", "Invalid Shape Input Entered");
		return shape;
	}

	/**
	 * Draws a rectangle given x, y, width, method, and the color (optional).
	 * @param {(number|number[])} x The X position for the top left corner of the rectangle. First value used in arrays
	 * @param {(number|number[])} y The Y position for the top left corner of the rectangle. First value used in arrays
	 * @param {number[]} size The dimensions of the rectangle in [width, height] format. Extra inputs ignored
	 * @param {string} [color] The hexidecimal value to color the rectangle. See this.fill (setter) for specifics. Defaults to last used color or #000000
	 * @param {string} [method] Alters how the rectangle is formed (i.e. (x, y) refers to center. See function description for more details)
	 */
	rect(x, y, size, color, method)
	{
		if(Array.isArray(x)) x = x[0];
		if(Array.isArray(y)) y = y[0];
		this.fill = color;
		this.ctx.fillRect(x, y, size[0], size[1]);
	}

	/**
	 * Draws a circle given x, y, radius, and the color (optional).
	 * @param {(number|number[])} x The X position for the center of the circle. First value used in arrays
	 * @param {(number|number[])} y The Y position for the center of the circle. First value used in arrays
	 * @param {(number|number[])} r The radius of the circle. First value used in arrays.
	 * @param {string} [color] The hexidecimal value to color the circle. See this.fill (setter) for specifics. Defaults to last used color or #000000
	 */
	circ(x, y, r, color)
	{
		if(Array.isArray(x)) x = x[0];
		if(Array.isArray(y)) y = y[0];
		if(Array.isArray(r)) r = r[0];
		this.verboseLog("excessive", "circ", "Supered", x, y, r);
		this.fill = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
		this.ctx.fill();
		//Feels like closing the path is missing
	}

	/**
	 * Draws a triangle given arrays with the x and y and the color (optional).
	 * @param {number[]} xPositions Array of X positions for the triangle
	 * @param {number[]} yPositions Array of Y positions for the triangle
	 * @param {string} [color] The hexidecimal value to color the circle. See this.fill (setter) for specifics. Defaults to last used color or #000000
	 */
	tri(xPositions, yPositions, color)
	{
		this.fill = color;
		this.ctx.beginPath();
		this.ctx.moveTo(xPositions[0], yPositions[0]);
		this.ctx.lineTo(xPositions[1], yPositions[1]);
		this.ctx.lineTo(xPositions[2], yPositions[2]);
		this.ctx.closePath();
		//this.ctx.stroke();
		this.ctx.fill();
	}

	/**
	 * Draws a line given arrays with the x and y and the color (optional).
	 * @param {number[]} xPositions Array of X positions for the triangle
	 * @param {number[]} yPosition Array of Y positions for the triangle
	 * @param {string} [color] The hexidecimal value to color the circle. See this.fill (setter) for specifics. Defaults to last used color or #000000
	 */
	line(xPositions, yPositions, color)
	{
		if(xPositions.length < 2 || yPositions.length < 2)
		{
			this.verboseLog("error", "line", "Not enough points to form a line", xPositions, yPositions, color);
			return;
		}
		this.stroke = color;
		this.ctx.beginPath();
		this.ctx.moveTo(xPositions[0], yPositions[0]);
		for(var pos = 1; pos < Math.min(xPositions.length, yPositions.length); pos++)
		{
			this.ctx.lineTo(xPositions[pos], yPositions[pos]);
		}
		this.ctx.stroke();
	}

	/**
	 * Draws and Fills a polygon (Not recommended nor supported for hitbox collision detections)
	 * Closing the shape with coordinates is optional and will be done automatically if the coordinates aren't supplied.
	 * @param {number[]} xPositions Array of X positions for the polygon
	 * @param {number[]} yPosition Array of Y positions for the polygon
	 * @param {string} [color] The hexidecimal value to color the circle. See this.fill (setter) for specifics. Defaults to last used color or #000000
	 */
	poly(xPositions, yPositions, color)
	{
		if(xPositions.length < 3 || yPositions.length < 3)
		{
			this.verboseLog("error", "poly", "Not enough points to form a polygon", xPositions, yPositions, color);
			return;
		}
		this.stroke = color;
		this.fill = color;
		this.ctx.beginPath();
		this.ctx.moveTo(xPositions[0], yPositions[0]);
		for(var pos = 1; pos < Math.min(xPositions.length, yPositions.length); pos++)
		{
			this.ctx.lineTo(xPositions[pos], yPositions[pos]);
		}
		this.ctx.closePath();
		this.ctx.fill();
	}

	/**
	 * Draws an image given a valid image object and positioning values
	 * @param {(object|string)} image Valid Image object according to JavaScript Canvas documentation (may vary between browsers) or url/path of image file
	 * @param {...number} positioning The positioning details according to JavaScript documentation on the canvas drawImage method.
	 */
	img(image, ...positioning)
	{
		if(typeof image == "string")
		{
			var newImg = new Image();
			newImg.src = image;
			newImg.alt = image;
			//May be duplicate and unnecessary
			newImg.addEventListener("load", generatedImage => {
				this.ctx.drawImage(generatedImage.target, ...positioning);
			})
			this.ctx.drawImage(newImg, ...positioning);
		}
		else
		{
			this.ctx.drawImage(image, ...positioning);
		}
	}

	/**
	 * Clears canvas
	 */
	clear()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	/**
	 * Checks if a hex color code is valid and applies small fixes to color formatting. Returns a default if input is invalid.
	 * @param {string} color Color code to be processed and checked
	 * @param {string} defaultColor Color to return if unable to use color input
	 * @returns {string} Formatted hexidecimal color or default color.
	 */
	colorChange(color, defaultColor)
	{
		this.verboseLog("run", "colorChange", color, defaultColor, !color);
		if(!color) return defaultColor;
		if(typeof color != "string" || !color.toUpperCase().match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.verboseLog("noAction", "colorChange", "Invalid color format. Use hexidecimal.", color, `Default: ${defaultColor}`);
			return defaultColor;
		}
		this.verboseLog("success", "colorChange", "Stroke color set successfully", color);
		return color.toUpperCase();
	}

	/**
	 * Uses colorChange with proper default values based on the canvas' current state depending on shape type
	 * @param {string} shape Shape to find default color for.
	 * @param {string} color Color code to be processed and checked
	 * @returns {string} Formatted hexidecimal color or default color.
	 */
	colorFix(shape, color)
	{
		shape = this.shapeType(shape);
		if(shape == "LINE" || shape == "CIRC") return this.colorChange(color, this.ctx.strokeStyle);
		else return this.colorChange(color, this.ctx.fillStyle);
	}

	get height(){ return this.canvas.height; }
	get width(){ return this.canvas.width; }
	get fill(){ return this.ctx.fillStyle; }
	set fill(color){ this.ctx.fillStyle = this.colorChange(color, this.ctx.fillStyle); }
	get stroke(){ return this.ctx.strokeStyle; }
	set stroke(color){ this.ctx.strokeStyle = this.colorChange(color, this.ctx.strokeStyle); }
	get strokeSize(){ return this.ctx.lineWidth; }
	set strokeSize(num){ if(typeof num == "number") this.ctx.lineWidth = num; }
	get centerX(){ return this.width / 2; }
	get centerY(){ return this.height / 2; }
	get center(){ return [this.width / 2, this.height / 2]; }
	get mouseX(){ return this.cursor["x"]; }
	get mouseY(){ return this.cursor["y"]; }
	get mouse(){ return this.cursor; }
	get mouseDown(){ return this.cursor.mouseDown; }
	set mouseDown(func){ this.addEventListenerCursor("onMouseDown", func); }
	get mouseClick(){ return this.cursor.mouseClicked; }
	set mouseClick(func){ this.addEventListenerCursor("onMouseClick", func); }
	get mouseMove(){ return this.cursor.mouseMove; }
	set mouseMove(func){ this.addEventListenerCursor("onMouseMove", func); }
	addEventListenerCursor(prop, func)
	{
		if(this.cursor[prop] && typeof this.cursor[prop] == "function" && typeof func == "function")
		{
			this.cursor[prop] = func;
			this.verboseLog("success", "addEventListenerCursor", `Successfullly reassigned cursor[${prop}] with `, func);
			this.attachMouseHandlers();
			return;
		}
		this.verboseLog("error", "addEventListenerCursor", `Invalid input in reassigning cursor events`, prop, func);
	}

	//Aliases
	fillColor(color) { this.fill = color; }
	strokeColor(color) { this.stroke = color; }
	rectangle(...args) { this.rect(...args); }
	circle(...args) { this.circ(...args); }
	triangle(...arg) { this.tri(...args); }
	image(...args) { this.img(...args); }
	ln(...args) { this.line(...args); }
	//scale(arg) { this.scalePixel(arg); }
	//s(arg) { this.scalePixel(arg); }
	get x(){ return this.mouseX; }
	get y(){ return this.mouseY; }

	//Debug mode
	toggleVerbose(options, toggle)
	{
		if(typeof options == "string") this.verbose[options] = typeof toggle == "boolean" ? toggle : !this.verbose[options];
		else if(typeof options == "object")
		{
			for(let key in options)
			{
				this.toggleVerbose(key, options[key]);
			}
		}
		else this.verboseLog("error", "toggleVerbose", options, toggle);
	}

	/**
	 * A function used for logging messages while debugging
	 * Most options are off by default but can be enabled through this.verbose[logType][originName] = true
	 * @param {string} logType Type of log this is for (error, success, noAction, run, or excessive)
	 * @param {string} originName Name of function or place where this log was called from
	 * @param {(string|*)} message Message displayed by log or an item to log
	 * @param {*} additional Items to append to log
	 */
	verboseLog(logType, originName, message, ...additional)
	{
		if(!this.verbose[logType]) this.verboseLog("error", "verboseLog", "Invalid logType", logType, originName, message, additional);
		if(this.verbose[logType][originName])
		{
			switch(additional.length)
			{
				case 0:
					console.log(message);
				break;
				case 1:
					console.log(message, additional[0]);
				break;
				default:
					console.log(message, additional);
			}
		}
	}

	/**
	 * Initializes this.verbose with nearly all options set to false by default
	 */
	initVerbose()
	{
		if(this.verbose) return;
		this.verbose = {
			run: {
				colorChange: false,
				redraw: false,
				makeMouse: false
			},
			success: {
				addEventListenerCursor: false,
				colorChange: false,
				historyPusher: false,
				updateResizers: false,
				setAction: false
			},
			noAction: {
				colorChange: false,
				draw: false,
				shapeType: false,
				softDraw: false,
				historyPusher: false
			},
			error: {
				addEventListenerCursor: false,
				feed: false,
				setAction: false,
				shapeType: false,
				line: false,
				toggleVerbose: true,
				verboseLog: true
			},
			excessive: {
				circ: false,
				draw: false,
				redraw: false,
				softDraw: false,
				makeMouse: false
			}
		};
	}
}
