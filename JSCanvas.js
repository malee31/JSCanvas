class JSCanvas
{
	constructor(canv)
	{
		this.canvas = canv;
		this.canvas.addEventListener("resize", () => {
			console.log("Resized");
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

	draw(shape, ...args)
	{
		shape = shape.toUpperCase().trim();
		switch(shape)
		{
			case "RECT":
			case "RECTANGLE":
				this.verboseLog("RECT");
				this.rect(...args);
			break;
			case "CIRC":
			case "CIRCLE":
				this.verboseLog("CIRC");
				this.circ(...args);
			break;
			case "LN":
			case "LINE":
				this.verboseLog("LINE");
				this.line(...args);
			break;
			default:
				this.verboseLog("Invalid shape input entered");
			break;
		}
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

	clear()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	fill(color)
	{
		color = color ? color.toUpperCase() : null;
		this.verboseLog(color);
		if(color && color.match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.verboseLog("Color set successfully");
			this.ctx.fillStyle = color;
		}
		else
		{
			this.verboseLog("Invalid color format. Use Hexidecimal.");
		}
	}

	stroke(color)
	{
		color = color ? color.toUpperCase() : null;
		this.verboseLog(color);
		if(color && color.match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.verboseLog("Stroke set successfully");
			this.ctx.strokeStyle = color;
		}
		else
		{
			this.verboseLog("Invalid color format. Use Hexidecimal.");
		}
	}

	get height() { return this.canvas.height; }
	get width(){ return this.canvas.width; }

	//Aliases
	fillColor(...args) { this.fill(...args); }
	strokeColor(...args) { this.stroke(...args); }
	rectangle(...args) { this.rect(...args); }
	circle(...args) { this.circ(...args); }
	ln(...args) { this.line(...args); }

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
