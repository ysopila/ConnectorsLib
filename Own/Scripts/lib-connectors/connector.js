function Connector(config) {
    this.connections = [];
    this.type = config.type || 'source';
    this.position = config.position || (this.type === 'source' ? 'bottom' : 'top');
    this.color = config.color || (this.type === 'source' ? 'blue' : 'transparent');
    this.block = null;
    this.$ = null;
    this.d = 0;

    this.getAvgConnectionDirection = function() {
        if (!this.connections || !this.connections.length) {
            return { left: 0, top: 0 };
        }
        var left = 0;
        var top = 0;
        var p = this.block.$.position();
        for (var i = 0; i < this.connections.length; i++) {
            var cp = this.connections[i].block.$.position();
            left += cp.left - p.left;
            top += cp.top - p.top;
        }
        return { left: left / this.connections.length, top: top / this.connections.length };
    }

    this.redraw = function () {
        if (this.$) {
            this.$.remove();
        }
        this.$ = $('<div/>', { class: 'connector' });

        if (this.type === 'source') {
            this.$.addClass('source');
        } else {
            this.$.addClass('destination');
        }

        if (this.position === 'top') {
            this.$.addClass('top');
        } else if (this.position === 'bottom') {
            this.$.addClass('bottom');
        } else {
            throw 'Not supported';
        }
        this.$.css('border-color', this.color);
        this.block.$.append(this.$);
    }
    this.remove = function () {
        this.d = 0;
        if (this.$) {
            this.$.remove();
        }
        this.block.removeConnector(this);
    }
    this.translate = function(val) {
        this.d = val;
        if (this.position === 'top' || this.position === 'bottom') {
            this.$.css('transform', 'translate(' + val + 'px, 0px)');
        }
    }
}