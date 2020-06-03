class JSMemoryCanvas extends JSCanvas
{
	constructor(canv)
	{
		super(canv);
		window.addEventListener("resize", () => {
			this.updateResizers();
			this.redraw();
		})
		this.restoreAllDefaults();
	}

	restoreAllDefaults()
	{
		this.history = [];
		super.restoreAllDefaults();
	}

	forget()
	{
		this.history = [];
	}

	feed(inputs, softFeed)
	{
		if(!Array.isArray(inputs))
		{
			this.verboseLog(2, "Incompatible feed type");
			return;
		}
		if(!Array.isArray(inputs[0])) inputs = [inputs];
		for(let input of inputs)
		{
			if(softFeed) this.history.push(input.slice());
			else this.softDraw(input.slice());
		}
	}

	redraw()
	{
		this.verboseLog(1, "Redrawing", this.history);
		for(let memory of this.history)
		{
			this.verboseLog(4, "Memory Redrawing: ", memory);
			super.draw(memory[0], [memory.slice(1)]);
		}
		this.verboseLog(3, "History contents", this.history);
	}

	softDraw(fed)
	{
		switch(fed[0].toUpperCase().trim())
		{
			case "RECT":
			case "RECTANGLE":
				super.rect(...fed.slice(1));
			break;
			case "CIRC":
			case "CIRCLE":
				super.circ(...fed.slice(1));
			break;
			case "LN":
			case "LINE":
				super.line(...fed.slice(1));
			break;
			case "IMG":
			case "IMAGE":
				super.img(...fed.slice(1));
			break;
			default:
				super.verboseLog(2, "Invalid Shape Input Entered");
			break;
		}
		this.verboseLog(1000, shape, args);
	}

	rect(...args)
	{
		args = this.historyPusher("RECT", args);
		super.rect(...args.slice());
	}

	circ(...args)
	{
		args = this.historyPusher("CIRC", args);
		super.circ(...args.slice());
	}

	tri(...args)
	{
		args = this.historyPusher("TRI", args);
		super.tri(...args.slice());
	}

	line(...args)
	{
		args = this.historyPusher("LINE", args);
		super.line(...args.slice());
	}

	img(...args)
	{
		args = this.historyPusher("IMG", args);
		super.img(...args.slice());
	}

	historyPusher(methodName, args)
	{
		if(Array.isArray(args) && Array.isArray(args[0])) return args[0][0];
		this.verboseLog(3, "History Pushing: ", args);
		args.unshift(methodName);
		this.history.push(args.slice());
		args.shift();
		return args;
	}

	get export()
	{
		var exportation = "[";
		for(let memory of this.history)
		{
			exportation += `\n\t[${ memory.toString().split(",").join(", ") }],`;
		}
		exportation += "\n]";
		return exportation;
	}
}
