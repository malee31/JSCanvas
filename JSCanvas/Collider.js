/** Class containing functions to test for collisions using SAT */
class Collider
{
	//No constructor needed

	/**
	 * @typedef {Object} PointSet
	 * @property {Point[]} points Array of all the coordinates in the set in a list
	 * @property {number[]} x Array of all the X coordinates in the set
	 * @property {number[]} y Array of all the Y coordinates in the set
	 */

	/**
	 * @typedef {Object} Point
	 * @property {number} x X position of the point
	 * @property {number} y Y position of the point
	 */

	/**
	 * Complete check for collision using the SAT Method (Separating Axis Theorem)
	 * Only works on convex shapes at the moment, excluding circles
	 * TODO: Separate concave shapes for testing
	 * @param {PointSet} obj1 Points for the first shape to check for collision using
	 * @param {PointSet} obj2 Points for the second shape to check for collision using
	 * @returns {boolean} Whether or not the two objects have collided
	 */
	static collisionTestSAT(obj1, obj2)
	{
		return false;
	}

	/**
	 * Returns whether or not the object may have collided using arrays of points
	 * created by projecting points onto a line. Touching not counted as collided (i.e. startpoint2 = endpoint1)
	 * @param {PointSet} obj1 A set of the projected points of the first object to check for collisions with. Must be on the same line as obj2
	 * @param {PointSet} obj2 A set of the projected points of the second object to check for collisions with. Must be on the same line as obj1
	 * @returns {boolean} Whether the two objects may have collided. False means they haven't but there's still a potential on True. Exact contact is a False
	 */
	static shadowTest(obj1, obj2)
	{
		var minMax1 = {xMin: Math.min(...obj1["x"]), xMax: Math.max(...obj1["x"]), yMin: Math.min(...obj1["y"]), yMax: Math.max(...obj1["y"])};
		var minMax2 = {xMin: Math.min(...obj2["x"]), xMax: Math.max(...obj2["x"]), yMin: Math.min(...obj2["y"]), yMax: Math.max(...obj2["y"])};
		minMax1.dist = Math.hypot((minMax1.xMax - minMax1.xMin), (minMax1.yMax - minMax1.yMin));
		minMax2.dist = Math.hypot((minMax2.xMax - minMax2.xMin), (minMax2.yMax - minMax2.yMin));
		//minMax2.dist = ((minMax2.xMax - minMax2.xMin) ** 2 + (minMax2.yMax - minMax2.yMin) ** 2) ** 0.5;
		var totalLength = minMax1.dist + minMax2.dist;
		return totalLength > Math.hypot(Math.max(minMax1.xMax, minMax2.xMax) - Math.min(minMax1.xMin, minMax2.xMin), Math.max(minMax1.yMax, minMax2.yMax) - Math.min(minMax1.yMin, minMax2.yMin));
	}

	/**
	 * Returns the inputs in the form of a Point object
	 * @param {number|number[]} args Input an x followed by a y as either separate arguments or in an array.
	 * @returns {Point}
	 */
	static pointify(...args)
	{
		if(args.length == 1 && Array.isArray(args[0])) return {x: args[0][0], y: args[0][1]};
		else if(args.length == 2)
		{
			if(Array.isArray(args[0]) && Array.isArray(args[1])) return {x: args[0][0][0], y: args[0][1][0]};
			else return {x: args[0], y: args[1]};
		}
		else return args[0];
	}

	/**
	 * Returns the slope and y-intercept of a line through two points
	 * @param {number[]} point1 An array with the x and y position of the first point respectively
	 * @param {number[]} point2 An array with the x and y position of the second point respectively
	 * @returns {number[]} An array containing the slope followed by the y-intercept. Returns [NaN, xIntercept] on a slope of undefined or larger/lower than +/- 10^9
	 */
	static linify(point1, point2)
	{
		point1 = this.pointify(point1);
		point2 = this.pointify(point2);
		let slope = (point2.y - point1.y) / (point2.x - point1.x);
		if(slope == Infinity || Math.abs(slope) > Math.pow(10, 9)) return [NaN, point1.x];
		return [slope, point1.y - point1.x * slope];
	}

	/**
	 * Calculates the y Intercept of a line given the slope and a point
	 * @param {number} slope Slope of the line
	 * @param {Point} point Point that the line passes through
	 * @returns {number} The y-intercept of the line (or NaN for an invalid slope or NaN slope)
	 */
	static interceptCalc(slope, point)
	{
		if(typeof slope != "number" || isNaN(slope)) return NaN;
		return (point["y"] - slope * point["x"]);
	}
	
	/**
	 * Projects points onto a line and returns their X positions relative to the line.
	 * The closest point to the left will be assigned as 0 after projection and all points will shift accordingly.
	 * Think of this as rotating the graph of points to straighten out the line horizontally and taking their new X positions.
	 * @param {number[]} xCoords The X positions of the shape or set of points to project
	 * @param {number[]} yCoords The Y positions of the shape or set of points to project
	 * @param {number[]} [intercept=0] The Y intercept value of the line to project to or the X intercept for an undefined slope
	 * @returns {PointSet} The point positions after projection
	 */
	static project(xCoords, yCoords, slope, intercept)
	{
		var perpSlope = -1 / slope;
		var projected = {points: [], x: [], y: []};
		for(var coord = 0; coord < Math.min(xCoords.length, yCoords.length); coord++)
		{
			if(isNaN(slope))
			{
				projected["x"].push(intercept);
				projected["y"].push(yCoords[coord]);
				continue;
			}
			var y2Inter = -1 * (perpSlope * xCoords[coord] - yCoords[coord]);
			projected["x"].push((y2Inter - intercept) / (slope - perpSlope));
			projected["y"].push(projected["x"][coord] * slope + intercept);
			projected["points"].push({x: projected["x"][coord], y: projected["y"][coord]});
		}
		return projected;
	}

	/**
	 * Rotates a set of points by the provided angle in degrees. Returns rotated points in object format
	 * @param {number[]} xCoords The X positions of the sets of points to rotate
	 * @param {number[]} yCoords The Y positions of the sets of points to rotate
	 * @param {number} angle The angle to rotate all the points by
	 * @param {boolean} [isRadians] Whether the angle input is in radians. Will convert from degrees otherwise.
	 * @param {number} [centerX=0] X position of the rotational origin
	 * @param {number} [centerY=0] Y position of the rotational origin
	 * @returns {PointSet} Returns the rotated points in the form of an object
	 */
	static rotatePoints(xCoords, yCoords, angle, isRadians, centerX, centerY)
	{
		angle = isRadians ? angle : this.toRadians(angle);
		centerX = centerX ? centerX : 0;
		centerY = centerY ? centerY : 0;
		var length = Math.min(xCoords.length, yCoords.length);
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);
		var rotated = {points: [], x: xCoords.slice(), y: yCoords.slice()};
		for(let coord = 0; coord < length; coord++)
		{
			rotated.x[coord] -= centerX;
			rotated.y[coord] -= centerY;
			rotated.x[coord] = rotated.x[coord] * cosAngle - rotated.y[coord] * sinAngle;
			rotated.y[coord] = rotated.x[coord] * sinAngle + rotated.y[coord] * cosAngle;
			rotated.x[coord] += centerX;
			rotated.y[coord] += centerY;
		}
		return rotated;
	}

	/**
	 * Computes the arctangent of a slope relative to 3 o'clock counterclockwise
	 * Able to return a range between 0 and 360 (excludes 360)
	 * @param {number} x The change in X to calculate the slope and atan with relative to the origin
	 * @param {number} y The change in Y to calculate the slope and atan with relative to the origin
	 * @param {boolean} [toDegrees] Whether or not to return a value in degrees or radians. Defaults to degrees
	 * @returns {number} The full arctangent between 0 and 360 degrees (excluding 360) or its equivalent in radians 
	 */
	static fullAtan(x, y, toDegrees)
	{
		var angle = Collider.toDegrees(Math.atan(y / x));
		angle *= -1;
		if(x < 0) angle += 180;
		else if(y > 0) angle += 360;
		if(toDegrees === false) angle = Collider.toRadians(angle);
		return angle;
	}

	/**
	 * Converts radians to degrees
	 * @param {number} rad Radians to convert to degrees
	 * @returns {number} Angle in degrees
	 */
	static toDegrees(rad){ return rad / Math.PI * 180; }

	/**
	 * Converts degrees to radians
	 * @param {number} deg Degrees to convert to radians
	 * @returns {number} Angle in radians
	 */
	static toRadians(deg){ return deg / 180 * Math.PI; }
}
