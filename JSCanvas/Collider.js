/** Class containing functions to test for collisions using SAT */
class Collider
{
	//No constructor needed

	/**
	 * @typedef {Object} PointSet
	 * @property {number[]} x Array of all the X coordinates in the set
	 * @property {number[]} y Array of all the Y coordinates in the set
	 */
	
	/**
	 * Returns whether or not the object may have collided using arrays of points
	 * created by projecting points onto a line. Touching not counted as collided (i.e. startpoint2 = endpoint1)
	 * @param {number[]} objX1 Array of the first shape's X positions / relevant positions on the line after projection.
	 * @param {number[]} objX2 Array of the second shape's X positions / relevant positions on the line after projection.
	 * @returns {boolean} Whether the two objects may have collided. False means they haven't but there's still a potential on True.
	 */
	static shadowTest(objX1, objX2)
	{
		var minMax1 = [Math.min(...objX1), Math.max(...objX1)];
		var minMax2 = [Math.min(...objX2), Math.max(...objX2)];
		var totalLength = minMax1[1] - minMax1[0] + minMax2[1] - minMax2[0];
		return totalLength > Math.max(minMax1[1], minMax2[1]) - Math.min(minMax1[0], minMax2[0]);
	}
	
	/**
	 * Projects points onto a line and returns their X positions relative to the line.
	 * The closest point to the left will be assigned as 0 after projection and all points will shift accordingly.
	 * Think of this as rotating the graph of points to straighten out the line horizontally and taking their new X positions.
	 * @param {number[]} xCoords The X positions of the shape or set of points to project
	 * @param {number[]} yCoords The Y positions of the shape or set of points to project
	 * @param {number[]} [yInter] The Y intercept value of the line to project to
	 * @returns {PointSet} The point positions after projection
	 */
	static project(xCoords, yCoords, slope, yInter)
	{
		//TODO: Account for slopes of undefined
		var perpSlope = -1 / slope;
		var projected = {x: [], y: []};
		for(var coord = 0; coord < Math.min(xCoords.length, yCoords.length); coord++)
		{
			var y2Inter = -1 * (perpSlope * xCoords[coord] - yCoords[coord]);
			projected["x"].push((y2Inter - yInter) / (slope - perpSlope));
			projected["y"].push(projected["x"][coord] * slope + yInter);
		}
		return projected;
	}

	/**
	 * Rotates a set of points by the provided angle in degrees. Returns rotated points in object format
	 * @param {number[]} xCoords The X positions of the sets of points to rotate
	 * @param {number[]} yCoords The Y positions of the sets of points to rotate
	 * @param {number} angle The angle to rotate all the points by
	 * @param {boolean} [isRadians] Whether the angle input is in radians. Will convert from degrees otherwise.
	 * @param {number} [centerX] X position of the rotational origin. Defaults to 0
	 * @param {number} [centerY] Y position of the rotational origin. Defaults to 0
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
		xCoords = xCoords.splice(0, length);
		yCoords = yCoords.splice(0, length);
		for(let coord = 0; coord < length; coord++)
		{
			xCoords -= centerX;
			yCoords -= centerY;
			xCoords[coord] =  xCoords[coord] * cosAngle - yCoords[coord] * sinAngle;
			yCoords[coord] =  xCoords[coord] * sinAngle + yCoords[coord] * cosAngle;
			xCoords += centerX;
			yCoords += centerY;
		}
		return {x: xCoords, y: yCoords};
	}

	/**
	 * Computes the arctangent of a slope relative to 3 o'clock counterclockwise
	 * Able to return a range between 0 and 360 (excludes 360)
	 * @param {number} x The change in X to calculate the slope and atan with relative to the origin
	 * @param {number} y The change in Y to calculate the slope and atan with relative to the origin
	 * @param {boolean} [toDegrees] Whether or not to return a value in degrees or radians. Defaults to degrees
	 * @returns {number} The full arctangent between 0 and 360 degrees (excluding 360) or its equivalent in radians 
	 *
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
