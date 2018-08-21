function Connection(config) {
    this.source = config.source;
    this.destination = config.destination;
    this.source.connections.push(this.destination);
    this.destination.connections.push(this.source);

    this.remove = function () {
        var index = this.source.connections.indexOf(this.destination);
        this.source.connections.splice(index, 1);

        index = this.destination.connections.indexOf(this.source);
        this.destination.connections.splice(index, 1);
    }
    this.draw = function(context, config) {
        config = config || {};

        if (this.source.position !== 'bottom' || this.destination.position !== 'top') {
            throw 'Currently only bottom position is supported for sources and top for destinations';
        }

        var rowspan = config.rowspan || 20;
        var colspan = config.colspan || 20;
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

        context.beginPath();
        context.strokeStyle = this.source.color;
        context.moveTo(sourcePos.left + sourceD, sourcePos.top + sourceRadius);
        if (destPos.top > sourcePos.top + colspan) {
            var left = Math.min(Math.abs(destPos.left + destD - sourcePos.left - sourceD) / 2, colspan / 2);

            if (destPos.left + destD > sourcePos.left + sourceD) {
                context.quadraticCurveTo(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left + sourceD + left, sourcePos.top + sourceRadius + rowspan / 2);
                context.lineTo(destPos.left + destD - left, sourcePos.top + sourceRadius + rowspan / 2);
            } else {
                context.quadraticCurveTo(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left + sourceD - left, sourcePos.top + sourceRadius + rowspan / 2);
                context.lineTo(destPos.left + destD + left, sourcePos.top + sourceRadius + rowspan / 2);
            }
            context.quadraticCurveTo(destPos.left + destD, sourcePos.top + sourceRadius + rowspan / 2, destPos.left+ destD, sourcePos.top + sourceRadius + rowspan / 2 * 2);
        } else {
            var left = colspan / 2;
            if (destPos.left > sourcePos.left) {
                context.quadraticCurveTo(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left + sourceD + left, sourcePos.top + sourceRadius + rowspan / 2);
                context.lineTo(sourcePos.left + blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);

                if (destPos.left - blockWidth - colspan > sourcePos.left) {
                    context.quadraticCurveTo(sourcePos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius);
                    context.lineTo(sourcePos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                    context.quadraticCurveTo(sourcePos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, sourcePos.left + blockWidth / 2 + colspan, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.lineTo(destPos.left + destD - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.quadraticCurveTo(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                } else {
                    context.lineTo(destPos.left + blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);
                    context.quadraticCurveTo(destPos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius + rowspan / 2, destPos.left + blockWidth / 2 + colspan / 2, sourcePos.top + sourceRadius);
                    context.lineTo(destPos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                    context.quadraticCurveTo(destPos.left + blockWidth / 2 + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left + blockWidth / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.lineTo(destPos.left + destD + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.quadraticCurveTo(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                }
            } else {
                context.quadraticCurveTo(sourcePos.left + sourceD, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left + sourceD - left, sourcePos.top + sourceRadius + rowspan / 2);
                context.lineTo(sourcePos.left - blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);

                if (sourcePos.left - blockWidth - colspan > destPos.left) {
                    context.quadraticCurveTo(sourcePos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius + rowspan / 2, sourcePos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius);
                    context.lineTo(sourcePos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                    context.quadraticCurveTo(sourcePos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, sourcePos.left - blockWidth / 2 - colspan, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.lineTo(destPos.left + destD + colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.quadraticCurveTo(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                } else {
                    context.lineTo(destPos.left - blockWidth / 2, sourcePos.top + sourceRadius + rowspan / 2);
                    context.quadraticCurveTo(destPos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius + rowspan / 2, destPos.left - blockWidth / 2 - colspan / 2, sourcePos.top + sourceRadius);
                    context.lineTo(destPos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                    context.quadraticCurveTo(destPos.left - blockWidth / 2 - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left - blockWidth / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.lineTo(destPos.left + destD - colspan / 2, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius);
                    context.quadraticCurveTo(destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - rowspan / 2 - destRadius, destPos.left + destD, Math.min(destPos.top, sourcePos.top - rowspan / 4) - destRadius);
                }
            }
        }
        context.lineTo(destPos.left + destD, destPos.top - 2);
        
        // arrow
        context.lineTo(destPos.left + destD - 5, destPos.top - 6 - 2);
        context.moveTo(destPos.left + destD, destPos.top - 2);
        context.lineTo(destPos.left + destD + 5, destPos.top - 6 - 2);

        context.stroke();
    }
}