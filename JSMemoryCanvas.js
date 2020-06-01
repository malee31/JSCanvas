class JSMemoryCanvas extends JSCanvas
{
	constructor(canv)
	{
		super(canv);
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
		if(typeof inputs != "object")
		{
			this.verboseLog("Incompatible feed type");
			return;
		}
		if(typeof inputs[0] == "object")
		{
			for(let input of inputs)
			{
				this.history.push(input.slice());
			}
		}
	}

	redraw(drawGroup)
	{
		this.verboseLog("Redrawing");
		for(let memory of this.history)
		{
			this.verboseLog("Memory Redrawing: ", memory);
			super.draw(memory[0], memory.slice(1));
		}
		this.verboseLog("History contents", this.history);
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
		this.verboseLog("History Pushing: ", args);
		args.unshift(methodName);
		this.history.push(args.slice());
		args.shift();
	}
}
