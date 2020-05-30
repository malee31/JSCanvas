class Canvas
{
	constructor(canvas)
	{
		this.canv = canvas;
		this.updateMetadata();
	}

	updateMetadata()
	{
		this.height = this.canv.height;
		this.width = this.canv.width;
	}

	get height()
	{
		return this.height;
	}

	get width()
	{
		return this.width;
	}
}
