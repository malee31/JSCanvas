
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
	 * @returns {number[]} The points on the new X-axis after rotation/projection. Left-most point will be 0 and all points will shift accordingly
	 */
	static project(xCoords, yCoords, slope)
	{
		return "No";
	}

	/**
	 * Rotates a set of points by the provided angle in degrees. Returns rotated points in object format
	 * @param {number[]} xCoords The X positions of the sets of points to rotate
	 * @param {number[]} yCoords The Y positions of the sets of points to rotate
	 * @param {number} angle The angle to rotate all the points by
	 * @param {boolean} [isRadians] Whether the angle input is in radians. Will convert from degrees otherwise.
	 * @returns {PointSet} Returns the rotated points in the form of an object
	 */
	static rotatePoints(xCoords, yCoords, angle, isRadians)
	{
		angle = isRadians ? angle : this.toRadians(angle);
		var length = Math.min(xCoords.length, yCoords.length);
		var cosAngle = Math.cos(angle);
		var sinAngle = Math.sin(angle);
		xCoords = xCoords.splice(0, length);
		yCoords = yCoords.splice(0, length);
		for(let coord = 0; coord < length; coord++)
		{
			xCoords[coord] =  xCoords[coord] * cosAngle - yCoords[coord] * sinAngle;
			yCoords[coord] =  xCoords[coord] * sinAngle + yCoords[coord] * cosAngle;
		}
		return {x: xCoords, y: yCoords};
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
