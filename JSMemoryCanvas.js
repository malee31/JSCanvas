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
			this.verboseLog("error", "feed", "Incompatible feed type");
			return;
		}
		if(!Array.isArray(inputs[0])) inputs = [inputs];
		for(let input of inputs)
		{
			if(!softFeed) this.history.push(input.slice());
			else this.softDraw(input.slice());
		}
	}

	redraw()
	{
		this.verboseLog("run", "redraw", this.history);
		for(let memory of this.history)
		{
			this.verboseLog("excessive", "redraw", memory);
			super.draw(memory[0], [memory.slice(1)]);
		}
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
				super.verboseLog("noAction", "softDraw", "Invalid Shape Input Entered");
			break;
		}
		this.verboseLog("excessive", "softDraw", fed[0], fed.slice(1), fed[0].toUpperCase().trim());
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
		if(Array.isArray(args) && Array.isArray(args[0])) return args[0][0];
		this.verboseLog("success", "historyPusher", "History Pushing: ", args);
		args.unshift(this.shapeType(methodName));
		this.history.push(args.slice());
		args.shift();
		return args;
	}

	get export()
	{
		var exportation = "[";
		for(var memory = 0; memory < this.history.length; memory++)
		{
			exportation += "\n\t["
			for(var part = 0; part < this.history[memory].length; part++)
			{
				if(typeof this.history[memory][part] == "number") exportation += this.history[memory][part];
				else exportation += `"${this.history[memory][part]}"`;
				if(part + 1 != this.history[memory].length) exportation += ", ";
			}
			exportation += "],";
		}
		if(exportation.charAt(exportation.length - 1) != "[") exportation = exportation.substring(0, exportation.length - 1);
		exportation += "\n]";
		return exportation;
	}
}
