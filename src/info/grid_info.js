GridInfo = function(options) {
    this.worldSize = options.worldSize;
    this.computeNodes();
    this.wallInfo = {};
};

GridInfo.prototype.update = function(gridInfo) {

};

GridInfo.prototype.updateWall = function(wall) {
    if(this.wallInfo[wall.identifier] == null) {
        this.wallInfo[wall.identifier] = {
            x: wall.x,
            y: wall.y,
            boundingWidth: wall.boundingWidth,
            boundingHeight: wall.boundingHeight
        };
        this.computeNodes();
        return true;
    }else
        return false;
};

GridInfo.prototype.getNode = function(x, y) {
};

GridInfo.prototype.search = function(start, end) {
    return [];
};

GridInfo.prototype.getCenterPositions = function(nodes) {
    return [];
};

GridInfo.prototype.computeNodes = function() {
    this.nodes = [];
};

GridInfo.prototype.computeNodesBack = function() {
    var xWallBreaks = [];
    var yWallBreaks = [];

    for(var identifier in this.wallInfo) {
        var wall = this.wallInfo[identifier];
        var wallX = wall.x - wall.boundingWidth / 2;
        if(wallX > 0)
            xWallBreaks.push(wallX);
        xWallBreaks.push(wall.x + wall.boundingWidth / 2);

        yWallBreaks.push(wall.y - wall.boundingHeight / 2);
        yWallBreaks.push(wall.y + wall.boundingHeight / 2);
    }

    this.nodes = [];
    var nbDefaultNodes = 5;
    var defaultWidth = this.worldSize.width / nbDefaultNodes;
    var defaultHeight = this.worldSize.height / nbDefaultNodes;

    var xDefaultBreaks = [];
    for(var x=0; x<nbDefaultNodes; x++) {
        xDefaultBreaks.push(x * defaultWidth);
    }

    var xBreaks = [];
    for(var i=0; i<xDefaultBreaks.length; i++) {
        var nbReviewed = 0;
        for(var j=0; j<xWallBreaks.length; j++) {
            if(xWallBreaks[j] < xDefaultBreaks[i] && j >= nbReviewed) {
                xBreaks.push(xWallBreaks[j]);
                nbReviewed++;
            }
        }
        xBreaks.push(xDefaultBreaks[i]);
    }

    var widths = [];
    for(var x=0; x<xBreaks.length; x++) {
        var nextXBreak = xBreaks[x + 1];
        if(!nextXBreak)
            nextXBreak = this.worldSize.width;
        var width = nextXBreak - xBreaks[x];
        widths.push(width);
    }

    var currentXPosition = 0;
    for(var x= 0; x<widths.length; x++) {
        var currentYPosition = 0;
        this.nodes[x] = [];
        for (var y = 0; y < nbDefaultNodes; y++) {
            var height = defaultHeight;
            var node = new GraphNode(x, y, 1);

            node.data.size = {width: widths[x], height: height};
            node.data.originalPosition = {x: currentXPosition, y: currentYPosition};
            this.nodes[x][y] = node;
            currentYPosition += defaultHeight;
        }
        currentXPosition += widths[x];
    }
};