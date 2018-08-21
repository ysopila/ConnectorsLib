function Plot(context) {
    this.context = context;
    this.connections = [];

    this.addConnection = function (connection) {
        this.connections.push(connection);
    }

    this.redraw = function() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        for(var i = 0; i < this.connections.length; i++) {
            this.connections[i].draw(this.context);
        }
    }
}