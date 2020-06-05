class JSCanvas
{
	constructor(canv)
	{
		this.canvas = canv;
		this.ctx = canv.getContext("2d");
		window.addEventListener("resize", () => {
			this.updateResizers();
		})
		this.makeMouse();
		this.attachMouseHandlers();
		this.restoreAllDefaults();
		this.updateResizers();
	}

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
			},
			relativeDrawing: []
		};
	}

	attachMouseHandlers()
	{
		this.canvas.addEventListener("mousemove", this.cursor.onMouseMove);
		this.canvas.addEventListener("mousedown", this.cursor.onMouseDown);
		this.canvas.addEventListener("mouseup", this.cursor.onMouseClick);
	}

	updateResizers()
	{
		//TODO: Actually cap the max size to comply with browser limitations
		if(typeof this.defaultDimensions != "object")
		{
			this.verboseLog("success", "updateResizers", "Reset Dimensions");
			this.defaultDimensions = {width: this.canvas.width, height: this.canvas.height};
		}
		//Fixes Aspect Ratio
		this.canvas.width = this.defaultDimensions["height"] * (this.canvas.clientWidth / this.canvas.clientHeight);
		this.canvas.width *= this.resolutionScale;
		this.canvas.height = this.defaultDimensions["height"] * this.resolutionScale;
		this.cursor.scale = this.width / this.canvas.clientWidth;
	}

	restoreDefaults()
	{
		this.ctx.fillStyle = "#000000";
		this.ctx.strokeStyle = "#000000";
		this.ctx.font = "10px Arial";
		this.resolutionScale = 10;
	}

	restoreAllDefaults()
	{
		this.restoreDefaults();
		this.initVerbose();
		this.resetTimers();
	}

	resetTimers()
	{
		this.counter = 0;
		this.timeout = 0;
		//Results in 9000000000000000
		this.timerLoop = Number.MAX_SAFE_INTEGER - 7199254740991;
		requestAnimationFrame(this.sanityCheck.bind(this));
		this.timer = setInterval(this.tick.bind(this), 500);
	}

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

	tick()
	{
		this.counter = (this.counter + 1) % this.timerLoop;
	}

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

	scalePixel(val)
	{
		return val * this.resolutionScale;
	}

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
			default:
				this.verboseLog("noAction", "draw", "Invalid Shape Input Entered", this.shapeType(shape));
			break;
		}
		this.verboseLog("excessive", "draw", this.shapeType(shape), args);
	}

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
			default:
				this.verboseLog("noAction", "shapeType", "Invalid Shape Input Entered");
				return shape;
		}
	}

	rect(x, y, width, height, color, method)
	{
		this.fill = color;
		this.ctx.fillRect(x, y, width, height);
	}

	circ(x, y, r, color)
	{
		this.verboseLog("excessive", "circ", "Supered", x, y, r);
		this.fill = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
		this.ctx.fill();
		//Feels like closing the path is missing
	}

	tri(x1, y1, x2, y2, x3, y3, color)
	{
		this.fill = color;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.lineTo(x3, y3);
		//this.ctx.lineTo(x1, y1);
		this.ctx.closePath();
		//this.ctx.stroke();
		this.ctx.fill();
	}

	line(x1, y1, x2, y2, color)
	{
		this.stroke = color;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	img(image, ...positioning)
	{
		if(typeof image == "string")
		{
			var newImg = new Image();
			newImg.addEventListener("load", generatedImage => {
				this.ctx.drawImage(generatedImage, ...positioning);
			})
			newImg.src = image;
			newImg.alt = image;
		}
		else
		{
			this.ctx.drawImage(image, ...positioning);
		}
	}

	clear()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

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
	triangle(...arg){ this.tri(...args); }
	image(...args) { this.img(...args); }
	ln(...args) { this.line(...args); }
	scale(arg) { this.scalePixel(arg); }
	s(arg) { this.scalePixel(arg); }
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

	/*
	 * A function used for logging messages while debugging.
	 * @param {string} message Message displayed by log
	 * @param {*} additional Items to append to log
	**/
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
				softDraw: false
			},
			error: {
				addEventListenerCursor: false,
				feed: false,
				setAction: false,
				shapeType: false,
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
