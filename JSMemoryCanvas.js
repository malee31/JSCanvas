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

	redraw(drawGroup)
	{
		this.verboseLog("Redrawing");
		for(let memory of this.history)
		{
			var drawMethod = memory.shift();
			super.draw(drawMethod, ...memory);
			memory.unshift(drawMethod);
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
		if(args[args.length - 1] === true) return;
		args.unshift(methodName);
		args.push(true);
		this.history.push(args.slice());
		args.shift();
	}
}
