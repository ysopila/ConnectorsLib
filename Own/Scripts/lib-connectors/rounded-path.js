function RoundedPath() {
    this.points = [];
    this.addPoint = function(x, y) {
        this.points.push({ x: x, y: y });
    }
    this.draw = function(context, config) {
        config = config || {};
        var r = config.radius || 10;
        
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 1; i < this.points.length; i++) {
            var second = this.points[i];
            var third = null;
            var j = i + 1;
            while (this.points.length > j) {
                var third = this.points[j];
                if (Math.floor(Math.sqrt(Math.pow(second.x - third.x, 2) + Math.pow(second.y - third.y, 2))) > 2 * r)
                    break;
                third = null;
                j++;
            }
            if (third) {
                i = j - 1;
                context.arcTo(second.x, second.y, third.x, third.y, r);    
            } else {
                context.lineTo(second.x, second.y);
            }
        }
        context.stroke();
    }
}