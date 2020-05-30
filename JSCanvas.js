class Canvas
{
	constructor(canvas)
	{
		this.canv = canvas;
		this.ctx = canvas.getContext("2d");
		this.updateMetadata();
		this.restoreDefaults();
		//Start up requestAnimationFrame
		//Start up ticking clock
	}

	updateMetadata()
	{
		this.height = this.canv.height;
		this.width = this.canv.width;
	}

	restoreDefaults()
	{
		this.ctx.fillColor = "#000000";
		this.ctx.font = "10px Arial";
	}

	draw(shape, ...args)
	{
		shape = shape.toUpperCase().trim();
		switch(shape)
		{
			case "RECT":
				console.log("RECT");
				rect(...args);
			break;
			case "CIRC":
				console.log("CIRC");
			break;
			case "LINE":
				console.log("LINE");
			break;
			default:
				console.log("Invalid shape input entered");
			break;
		}
	}

	rect(x, y, width, height, color, method)
	{
		this.setColor(color);
		this.ctx.fillRect(x, y, width, height);
	}

	setColor(color)
	{
		color = color.toUpperCase();
		if(color && color.match(/^#([0-9A-Z]{3}){1,2}$/))
		{
			this.ctx.fillStyle = color;
		}
		else
		{
			console.log("Invalid color format. Use Hexidecimal.");
		}
	}

	get height() { return this.height; }
	get width(){ return this.width; }
}
