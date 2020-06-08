/** An extension to the JSCanvas class that includes being able to redraw past shapes and draw temporary shapes before erasing them */
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
		this.drawGroups = [];
		super.restoreAllDefaults();
	}

	forget(includeDrawGroups)
	{
		this.history = [];
		if(includeDrawGroups) this.drawGroups = [];
	}

	feed(inputs, softFeed)
	{
		if(!Array.isArray(inputs))
		{
			this.verboseLog("error", "feed", "Incompatible feed type", inputs);
			return;
		}
		if(!Array.isArray(inputs[0])) inputs = [inputs];
		for(let input of inputs)
		{
			if(!softFeed) this.history.push(this.inputArrayCopy(input.slice()));
			else this.softDraw(this.inputArrayCopy(input));
		}
	}

	redraw()
	{
		this.verboseLog("run", "redraw", this.history);
		for(let memory of this.history)
		{
			this.verboseLog("excessive", "redraw", memory);
			super.draw(memory[0], memory.slice(1));
		}
	}

	softDraw(shape, ...fed)
	{
		shape = this.shapeType(shape);
		switch(shape)
		{
			case "RECT":
				super.rect(...fed);
			break;
			case "CIRC":
				super.circ(...fed);
			break;
			case "LINE":
				super.line(...fed);
			break;
			case "IMG":
				super.img(...fed);
			break;
			case "POLY":
				super.poly(...fed);
			break;
			default:
				super.verboseLog("noAction", "softDraw", "Invalid Shape Input Entered");
			break;
		}
		this.verboseLog("excessive", "softDraw", shape, fed, shape.toUpperCase().trim());
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

	poly(...args)
	{
		args = this.historyPusher("POLY", args);
		super.poly(...args.slice());
	}

	img(...args)
	{
		args = this.historyPusher("IMG", args);
		super.img(...args.slice());
	}

	addGroup(group) {this.drawGroups.push(group);}

	historyPusher(methodName, args)
	{
		if(Array.isArray(args) && args.length == 1)
		{
			this.verboseLog("noAction", "historyPusher", "Repeat draw, no push: ", methodName, args);
			return args[0];
		}
		var copied = this.inputArrayCopy(args, [methodName]);
		this.verboseLog("success", "historyPusher", "History Pushing: ", args, "Rebuild: ", copied);
		this.history.push(copied);
		return args;
	}

	inputArrayCopy(arr, base)
	{
		var rebuild = Array.isArray(base) ? base : [];
		for(let item of arr)
		{
			if(Array.isArray(item)) rebuild.push(item.slice());
			else rebuild.push(item);
		}
		return rebuild;
	}

	get export()
	{
		var exportation = JSON.stringify(this.history);
		exportation = `[\n\t${exportation.slice(1, exportation.length - 1)}\n]`;
		var deficit = 0;
		for(var charIndex = 3; charIndex < exportation.length - 2; charIndex++)
		{
			if(exportation.charAt(charIndex) == "[") deficit++;
			if(exportation.charAt(charIndex) == "]") deficit--;
			if(deficit == 0)
			{
				exportation = `${exportation.slice(0, charIndex + 1)},\n\t${exportation.slice(charIndex + 2, exportation.length)}`; 
				charIndex += 3;
			}
		}
		return exportation.slice(0, exportation.length - 4) + "\n]";
	}
}
