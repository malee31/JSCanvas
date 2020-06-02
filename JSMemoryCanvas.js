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

	feed(inputs)
	{
		if(!Array.isArray(inputs))
		{
			this.verboseLog(2, "Incompatible feed type");
			return;
		}
		if(!Array.isArray(inputs[0])) inputs = [inputs];
		for(let input of inputs)
		{
			this.history.push(input.slice());
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

	rect(...args)
	{
		args = this.historyPusher("RECT", args);
		super.rect(...args.slice(0, args.length - 1));
	}

	circ(...args)
	{
		args = this.historyPusher("CIRC", args);
		super.circ(...args.slice(0, args.length - 1));
	}

	line(...args)
	{
		args = this.historyPusher("LINE", args);
		super.line(...args.slice(0, args.length - 1));
	}

	img(...args)
	{
		args = this.historyPusher("IMG", args);
		super.img(...args.slice(0, args.length - 1));
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
}
