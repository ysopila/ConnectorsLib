function Layout(el, config) {
    var highlight = null; 

    this.setConfig = function(config) {
        config = config || {};
        this.colspan = config.colspan || 50;
        this.rowspan = config.rowspan || 50;
        this.blockWidth = config.blockWidth || 200;
        this.blockHeight = config.blockHeight || 200;
    }

    this.addBlock = function (b) {
        this.blocks.push(b);
        b.layout = this;
    }

    this.performLayout = function() {
        if (!this.blocks || !this.blocks.length) {
            return;
        }
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            block.gridColumn = 0;
            block.gridRow = i;
        }
        this._calculateGridSize();
        this._redrawLayout();
        this._setBlockStyles();
    }

    this.calcConnectorPositions = function() {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].calcConnectorPositions();
        }
    }

    this.doesAnyIntersects = function(line) {
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].intersects(line)) {
                return true;
            }
        }
        return false;
    }

    this._createCanvas = function() {
        var canvas = $('<canvas/>', { class: 'layout' });
        this.$.prepend(canvas);
        return canvas[0].getContext("2d");
    }

    this.positionBlock = function (b) {
        var cell = this.getClosestGridCell(b.$.position());
        var flagRevert = false;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block != b && block.gridColumn === cell.col && block.gridRow === cell.row) {
                flagRevert = true;
                break;
            }
        } 
        if (!flagRevert) {
            b.gridColumn = cell.col;
            b.gridRow = cell.row;
        } 
        b.$.css({ 
            top: this.startPos.top + b.gridRow * (this.blockHeight + this.rowspan) + 'px', 
            left: this.startPos.left + b.gridColumn * (this.blockWidth + this.colspan) + 'px',
            width: this.blockWidth + 'px',
            height: this.blockHeight + 'px'
        });
    }

    this.getClosestGridCell = function (position) {
        return {
            col: Math.max(Math.floor(position.left / (this.blockWidth + this.colspan)), 0) - this.startCol,
            row: Math.max(Math.floor(position.top / (this.blockHeight + this.rowspan)), 0) - this.startRow
        };
    }

    this.highlightCell = function (cell, skipBlock) {
        if (!cell) {
            if (highlight && highlight.$) {
                highlight.$.remove();
            }
            highlight = null;
            return;
        }
        if (!highlight) {
            highlight = {};
        } 
        if (highlight.col != cell.col || highlight.row != cell.row) {
            if (!highlight.$) {
                highlight.$ = $('<div/>', { class: 'highlight' });
                this.$.append(highlight.$);
            }
            highlight.col = cell.col;
            highlight.row = cell.row;
            highlight.$.removeClass('invalid');
            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                if (block != skipBlock && block.gridColumn === highlight.col && block.gridRow === highlight.row) {
                    highlight.$.addClass('invalid');
                    break;
                }
            }
            highlight.$.css({ 
                top: this.startPos.top + highlight.row * (this.blockHeight + this.rowspan) + 'px', 
                left: this.startPos.left + highlight.col * (this.blockWidth + this.colspan) + 'px',
                width: this.blockWidth + 'px',
                height: this.blockHeight + 'px'
            });
        }
    }

    this._setBlockStyles = function() {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            block.$.css({ 
                top: this.startPos.top + block.gridRow * (this.blockHeight + this.rowspan) + 'px', 
                left: this.startPos.left + block.gridColumn * (this.blockWidth + this.colspan) + 'px',
                width: this.blockWidth + 'px',
                height: this.blockHeight + 'px'
            });
        }
    }
    this._calculateGridSize = function() {
        var width = this.$.parent().width();
        var height = this.$.parent().height();
        var cols = Math.ceil(width / (this.blockWidth + this.colspan));
        var rows = Math.ceil(height / (this.blockHeight + this.rowspan));
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            var bCols = Math.abs(block.gridColumn) * 2 + 1;
            var bRows = Math.abs(block.gridRow) + 1;
            cols = Math.max(cols, bCols);
            rows = Math.max(rows, bRows);
        }
        this.cols = cols;
        this.rows = rows;

        this.startCol = Math.floor((cols - 1) / 2);
        this.startRow = 0;
        this.startPos = { 
            left: (this.startCol + 1) * this.colspan + this.startCol * this.blockWidth,
            top: (this.startRow + 1) * this.rowspan + this.startRow * this.blockHeight
        };
    }
    
    this._redrawLayout = function() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        var width = this.context.canvas.style.width = this.context.canvas.width = this.cols * this.blockWidth + (this.cols + 1) * this.colspan;
        var height = this.context.canvas.style.height = this.context.canvas.height = this.rows * this.blockHeight + (this.rows + 1) * this.rowspan;
        this.$.width(width);
        this.$.height(height);

        for(var i = 0; i < this.cols; i++) {
            this.context.beginPath();
            this.context.strokeStyle = '#d3d3d3';

            this.context.moveTo(this.colspan + i * (this.blockWidth + this.colspan), 0);
            this.context.lineTo(this.colspan + i * (this.blockWidth + this.colspan), height);

            this.context.moveTo((i + 1) * (this.blockWidth + this.colspan), 0);
            this.context.lineTo((i + 1) * (this.blockWidth + this.colspan), height);
            this.context.stroke();
        }

        for(var i = 0; i < this.rows; i++) {
            this.context.beginPath();
            this.context.strokeStyle = '#d3d3d3';

            this.context.moveTo(0, this.rowspan + i * (this.blockHeight + this.rowspan));
            this.context.lineTo(width, this.rowspan + i * (this.blockHeight + this.rowspan));

            this.context.moveTo(0, (i + 1) * (this.blockHeight + this.rowspan));
            this.context.lineTo(width, (i + 1) * (this.blockHeight + this.rowspan));
            this.context.stroke();
        }
    }

    this.$ = $(el);
    this.context = this._createCanvas();
    this.blocks = [];
    this.setConfig(config);
}