class JSMemoryCanvas extends JSCanvas
{
	constructor(canv)
	{
		super(canv);
		this.verboseLog("JSMemoryCanvas Created");
		this.restoreAllDefaults();
		this.history.push(["RECT", 0, 0, 500, 500, "#000"]);
	}

	restoreAllDefaults()
	{
		this.history = [];
		super.restoreAllDefaults();
	}

	redraw(drawGroup)
	{
		for(let memory of this.history)
		{
			this.draw(memory.shift(), ...memory);
		}
	}

	rect(...args)
	{
		args.unshift("RECT");
		args.shift();
		super.rect(...args);
	}

	circ(...args)
	{
		args.unshift("CIRC");
		args.shift();
		super.rect(...args);
	}

	line(...args)
	{
		args.unshift("LINE");
		args.shift();
		super.rect(...args);
	}
}
