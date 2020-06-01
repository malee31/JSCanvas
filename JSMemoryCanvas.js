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

	redraw(drawGroup)
	{
		this.verboseLog(1000, "Redrawing");
		for(let memory of this.history)
		{
			this.verboseLog(1000, "Memory Redrawing: ", memory);
			super.draw(memory[0], memory.slice(1));
		}
		this.verboseLog(3, "History contents", this.history);
	}

	rect(...args)
	{
		this.historyPusher("RECT", args);
		super.rect(...args.slice(0, args.length - 1));
	}

	circ(...args)
	{
		this.historyPusher("CIRC", args);
		super.circ(...args.slice(0, args.length - 1));
	}

	line(...args)
	{
		this.historyPusher("LINE", args);
		super.line(...args.slice(0, args.length - 1));
	}

	img(...args)
	{
		this.historyPusher("IMG", args);
		super.img(...args.slice(0, args.length - 1));
	}

	historyPusher(methodName, args)
	{
		if(args.length > 0 && typeof args[0] == "object") return;
		this.verboseLog(3, "History Pushing: ", args);
		args.unshift(methodName);
		this.history.push(args.slice());
		args.shift();
	}
}
