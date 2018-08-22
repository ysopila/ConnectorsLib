function Connection(config) {
    this.source = config.source;
    this.destination = config.destination;
    this.source.connections.push(this.destination);
    this.destination.connections.push(this.source);
    this.experimental = false;

    this.remove = function () {
        var index = this.source.connections.indexOf(this.destination);
        this.source.connections.splice(index, 1);

        index = this.destination.connections.indexOf(this.source);
        this.destination.connections.splice(index, 1);
    }

    this.drawArrow = function(context, x, y, radians) {
        context.save();
        context.beginPath();
        context.translate(x, y);
        if (radians) {
            context.rotate(radians);
        } else {
            context.rotate(Math.PI);
        }
        context.moveTo(0, 0);
        context.lineTo(4, 6);
        context.moveTo(0, 0);
        context.lineTo(-4, 6);
        context.closePath();
        context.restore();
        context.stroke();
    }

    this.draw = function(context, config) {
        config = config || {};

        if (this.source.position !== 'bottom' || this.destination.position !== 'top') {
            throw 'Currently only bottom position is supported for sources and top for destinations';
        }
        context.lineWidth = 2;

        var rowspan = config.rowspan || 50;
        var colspan = config.colspan || 50;
        var sourceRadius = this.source.$.width() / 2;
        var destRadius = this.destination.$.width() / 2;

        var blockWidth = this.source.block.$.width();
        var blockHeight = this.source.block.$.height();

        var sourcePosition = this.source.block.$.position();
        var destPosition = this.destination.block.$.position();
        
        var sourcePos = { left: sourcePosition.left + blockWidth / 2, top: sourcePosition.top + blockHeight };
        var destPos = { left: destPosition.left + blockWidth / 2, top: destPosition.top };
        
        var sourceD = this.source.d;
        var destD = this.destination.d;

        var start = { x: sourcePos.left + sourceD, y: sourcePos.top + 2 };
        var end = { x: destPos.left + destD, y: destPos.top - 2 };
        if (this.experimental && destPos.top > sourcePos.top && !this.source.block.layout.doesAnyIntersects([start, end])) {
            context.beginPath();
            context.strokeStyle = this.source.color;
            context.fillStyle = this.source.color;

            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            
            context.stroke();

            var radians = Math.atan((end.y - start.y) / (end.x - start.x));
            radians += ((end.x > start.x) ? 90 : -90) * Math.PI / 180;
            this.drawArrow(context, end.x, end.y, radians);
        } else {
            context.strokeStyle = this.source.color;
            var p = new RoundedPath();
            if (destPos.top > sourcePos.top + colspan) {
                p.addPoint(sourcePos.left + sourceD, sourcePos.top);
                p.addPoint(sourcePos.left + sourceD, sourcePos.top + rowspan / 2);

                if (destPos.top > sourcePos.top + colspan + blockHeight && this.source.block.layout.doesAnyIntersects([start, end])) {
                    if (destPos.left + destD > sourcePos.left + sourceD) {
                        p.addPoint(sourcePos.left + blockWidth / 2 + colspan / 2, sourcePos.top + rowspan / 2);
                        p.addPoint(sourcePos.left + blockWidth / 2 + colspan / 2, destPos.top - rowspan / 2);
                        p.addPoint(destPos.left + destD, destPos.top - rowspan / 2);
                    } else {
                        p.addPoint(sourcePos.left - blockWidth / 2 - colspan / 2, sourcePos.top + rowspan / 2);
                        p.addPoint(sourcePos.left - blockWidth / 2 - colspan / 2, destPos.top - rowspan / 2);
                        p.addPoint(destPos.left + destD, destPos.top - rowspan / 2);
                    }
                } else {
                    var left = Math.min(Math.abs(destPos.left + destD - sourcePos.left - sourceD) / 2, colspan / 2);
                    if (destPos.left + destD > sourcePos.left + sourceD) {
                        p.addPoint(destPos.left + destD - left, sourcePos.top + rowspan / 2);
                    } else {
                        p.addPoint(destPos.left + destD + left, sourcePos.top + rowspan / 2);
                    }
                    p.addPoint(destPos.left + destD, sourcePos.top + rowspan / 2);
                }
            } else {
                p.addPoint(sourcePos.left + sourceD, sourcePos.top + sourceRadius);
                var left = colspan / 2;
                if (destPos.left > sourcePos.left) {
                    p.addPoint(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2);
                    p.addPoint(sourcePos.left + blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);

                    if (destPos.left - blockWidth - colspan > sourcePos.left) {
                        p.addPoint(sourcePos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(sourcePos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                        p.addPoint(sourcePos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    } else {
                        p.addPoint(destPos.left + blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(destPos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(destPos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                        p.addPoint(destPos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    }
                } else {
                    p.addPoint(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2);
                    p.addPoint(sourcePos.left - blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);

                    if (sourcePos.left - blockWidth - colspan > destPos.left) {
                        p.addPoint(sourcePos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(sourcePos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                        p.addPoint(sourcePos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    } else {
                        p.addPoint(destPos.left - blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(destPos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius + rowspan / 2);
                        p.addPoint(destPos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                        p.addPoint(destPos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                        p.addPoint(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    }
                }
            }
            p.addPoint(destPos.left + destD, destPos.top - 2);
            p.draw(context);
            
            context.beginPath();
            // arrow
            context.moveTo(destPos.left + destD, destPos.top - 2);
            context.lineTo(destPos.left + destD - 5, destPos.top - 6 - 2);
            context.moveTo(destPos.left + destD, destPos.top - 2);
            context.lineTo(destPos.left + destD + 5, destPos.top - 6 - 2);

            context.closePath();
            context.stroke();
        }
    }
}