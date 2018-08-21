function Block(el, plot) {
    var self = this;
    this.connectors = [];
    this.plot = plot;
    this.layout = null;
    this.$ = $(el);
    
    
    this.connect = function (block, config) {
        config = config || {};
        var source = new Connector({ type: 'source', color: config.color });
        this.addConnector(source);
        var destination = new Connector({ type: 'destination' });
        block.addConnector(destination);
        var connection = new Connection({ source: source, destination: destination });
        this.plot.addConnection(connection);
    }
    this.addConnector = function(connector) {
        this.connectors.push(connector);
        connector.block = this;
        connector.redraw();
        this.calcConnectorPositions();
    };
    this.removeConnector = function(connector) {
        var index = this.connectors.indexOf(connector);
        this.connectors.splice(index, 1);
        connector.block = null;
        this.calcConnectorPositions();
    };
    this.setPositions = function (connectors, size) {
        if (!connectors.length) {
            return;
        }

        var array = connectors.map(function(c) { return { c: c, left: c.getAvgConnectionDirection().left } });
        array.sort(function(a, b) { return a.left - b.left; });
        connectors = array.map(function(c) { return c.c; });

        var zone = size / connectors.length;
        var middle = size / 2;
        for (var i = 0; i < connectors.length; i++) {
            connectors[i].translate((i * zone + (i + 1) * zone) / 2 - middle); 
        }
    }
    this.calcConnectorPositions = function() {
        var width = this.$.width();
        var top = this.connectors.filter(function(c) { return c.position === 'top'; });
        this.setPositions(top, width);
        
        var bottom = this.connectors.filter(function(c) { return c.position === 'bottom'; });
        this.setPositions(bottom, width);
    }
    
    this.$.draggable({
        drag: function() {
            if (self.layout) {
                self.layout.calcConnectorPositions();
            }
            self.plot.redraw();
        },
        stop: function() {
            if (self.layout) {
                self.layout.calcConnectorPositions();
            }
            self.plot.redraw();
        }
    });
}