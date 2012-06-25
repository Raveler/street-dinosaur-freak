define(["Compose", "Vector2"], function(Compose, Vector2)) {

	var Rectangle = Compose(function(topLeft, bottomRight) {
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	},
	{
		collidesWith: function(rect) {
			if (this.bottomRight.x < rect.topLeft.x) return false;
			if (this.bottomRight.y < rect.topLeft.y) return false;
			if (rect.bottomRight.x < this.topLeft.x) return false;
			if (rect.bottomRight.y < this.topLeft.y) return false;
			return true;
		}

	});

	return Rectangle;
}