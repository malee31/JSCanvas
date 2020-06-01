class JSCanvas
{
	constructor(canv)
	{
		this.canvas = canv;
		this.cursor = {
			x: 0,
			y: 0,
			mouseDown: false,
			mouseClicked: false,
			relativeDrawing: []
		};
		this.canvas.addEventListener("mousemove", e => {
			this.verboseLog("Mouse position: ", [e.clientX, e.clientY]);
			var canvasBound = this.canvas.getBoundingClientRect();
			this.cursor["x"] = this.cursor.scale * e.clientX - canvasBound.left
			this.cursor["y"] = this.cursor.scale * e.clientY - canvasBound.top;
		});
		this.canvas.addEventListener("mousedown", e => {
			console.log("Mouse Down", e);
			this.cursor.mouseDown = true;
		});
		this.canvas.addEventListener("mouseup", e => {
			console.log("Mouse Up", e);
			this.cursor.mouseClicked = true;
			this.cursor.mouseDown = false;
		});
		this.ctx = canv.getContext("2d");
		this.restoreAllDefaults();
		this.updateMetadata();
	}

	updateMetadata()
	{
		//Fixes Aspect Ratio
		this.canvas.width = this.canvas.height * (this.canvas.clientWidth / this.canvas.clientHeight);
		this.canvas.width *= this.resolutionScale;
		this.canvas.height *= this.resolutionScale;
		this.cursor.scale = this.width / this.canvas.clientWidth;
	}

	restoreDefaults()
	{
		this.ctx.fillColor = "#000000";
		this.ctx.strokeStyle = "#000000";
		this.ctx.font = "10px Arial";
		this.resolutionScale = 10;
	}

	restoreAllDefaults()
	{
		this.restoreDefaults();
		this.toggle = false;
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
			this.verboseLog("Action set");
			return;
		}
		this.verboseLog("Not a function");
	}

	scalePixel(val)
	{
		return val * this.resolutionScale;
	}

	draw(shape, ...args)
	{
		shape = shape.toUpperCase().trim();
		switch(shape)
		{
			case "RECT":
			case "RECTANGLE":
				this.rect(...args);
			break;
			case "CIRC":
			case "CIRCLE":
				this.circ(...args);
			break;
			case "LN":
			case "LINE":
				this.line(...args);
			break;
			case "IMG":
			case "IMAGE":
				this.img(...args);
			break;
			default:
				this.verboseLog("Invalid shape input entered");
			break;
		}
		this.verboseLog(shape, args);
	}

	rect(x, y, width, height, color, method)
	{
		this.fillColor(color);
		this.ctx.fillRect(x, y, width, height);
	}

	circ(x, y, r, color)
	{
		this.fillColor(color);
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	line(x1, y1, x2, y2, color)
	{
		this.stroke(color);
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

	fill(color)
	{
		if(!color) return;
		color = color ? color.toUpperCase() : null;
		if(color && color.match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.verboseLog("Color set successfully", color);
			this.ctx.fillStyle = color;
		}
		else
		{
			this.verboseLog("Invalid color format. Use Hexidecimal.", color);
		}
	}

	stroke(color)
	{
		color = color ? color.toUpperCase() : null;
		if(color && color.match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.verboseLog("Stroke set successfully", color);
			this.ctx.strokeStyle = color;
		}
		else
		{
			this.verboseLog("Invalid color format. Use Hexidecimal.", color);
		}
	}

	get height() { return this.canvas.height; }
	get width(){ return this.canvas.width; }
	//Alias for width and height not made yet
	get centerX(){ return this.width / 2; }
	get centerY(){ return this.height / 2; }
	get center() { return [this.width / 2, this.height / 2]; }
	//No alias
	get mouseX(){ return this.cursor["x"]; }
	get mouseY(){ return this.cursor["y"]; }
	get mouse(){ return this.cursor; }

	//Aliases
	fillColor(...args) { this.fill(...args); }
	strokeColor(...args) { this.stroke(...args); }
	rectangle(...args) { this.rect(...args); }
	circle(...args) { this.circ(...args); }
	image(...args) { this.img(...args); }
	ln(...args) { this.line(...args); }
	scale(arg) { this.scalePixel(arg); }
	s(arg) { this.scalePixel(arg); }

	//Debug mode
	toggleVerbose(toggle)
	{
		if(typeof toggle == "boolean") this.toggle = toggle;
		else this.toggle = !this.toggle;
	}

	verboseLog(message, ...additional)
	{
		if(this.toggle)
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
}
