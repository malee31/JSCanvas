/** Class containing functions to test for collisions using SAT */
class Collider
{
	//No constructor needed
	
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
}
