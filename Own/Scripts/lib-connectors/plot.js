function Plot(el, config) {
    config = config || {};

    this._createCanvas = function() {
        var canvas = $('<canvas/>', { class: 'plot' });
        this.$.prepend(canvas);
        return canvas[0].getContext("2d");
    }

    this.addConnection = function (connection) {
        this.connections.push(connection);
    }

    this.redraw = function() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.canvas.style.width = this.context.canvas.width = this.$.width();
        this.context.canvas.style.height = this.context.canvas.height = this.$.height();
        
        for(var i = 0; i < this.connections.length; i++) {
            this.connections[i].draw(this.context);
        }
    }

    this.$ = $(el);
    this.context = this._createCanvas();
    this.connections = [];
}