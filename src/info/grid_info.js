GridInfo = function(options) {
    this.nodeSize = options.nodeSize;
    this.worldSize = options.worldSize;
    this.wallsEncountered = {};
    this.createNodes();
};

GridInfo.prototype.update = function(gridInfo) {
    for(var x=0; x<this.nodes.length; x++) {
        for(var y=0; y<this.nodes[x].length; y++) {
            var otherNode = gridInfo.nodes[x][y];
            var currentNode = this.nodes[x][y];
            if(otherNode.data.date > currentNode.data.date) {
                currentNode.data.date = otherNode.data.date;
                currentNode.type = otherNode.type;
            }
        }
    }
};

GridInfo.prototype.updateWall = function(wall) {
    if(this.wallsEncountered[wall.identifier] == null) {
        var nbNodesX = this.worldSize.width / this.nodeSize.width;
        var nbNodesY = this.worldSize.height / this.nodeSize.height;
        var nodeCenterWall = this.getNode(wall.x, wall.y);
        var nodeWallCenterPosition = this.nodes[nodeCenterWall.x][nodeCenterWall.y].data.middlePosition;
        var wallWidthRadius = wall.boundingWidth / 2;
        var wallHeightRadius = wall.boundingHeight / 2;
        var nodeWidth = this.nodeSize.width;
        var nodeHeight = this.nodeSize.height;
        var nbNodesAffectedXLeft = this.getNbNodesAffected(wallWidthRadius, wall.x, nodeWallCenterPosition.x, nodeWidth, true);
        var nbNodesAffectedXRight = this.getNbNodesAffected(wallWidthRadius, wall.x, nodeWallCenterPosition.x, nodeWidth, false);
        var nbNodesAffectedYTop = this.getNbNodesAffected(wallHeightRadius, wall.y, nodeWallCenterPosition.y, nodeHeight, true);
        var nbNodesAffectedYBottom = this.getNbNodesAffected(wallHeightRadius, wall.y, nodeWallCenterPosition.y, nodeHeight, false);
        for (var x = nodeCenterWall.x - nbNodesAffectedXLeft; x <= nodeCenterWall.x + nbNodesAffectedXRight; x++) {
            for (var y = nodeCenterWall.y - nbNodesAffectedYTop; y <= nodeCenterWall.y + nbNodesAffectedYBottom; y++) {
                if (x >= 0 && y >= 0 && x < nbNodesX && y < nbNodesY) {
                    this.nodes[x][y].type = 0;
                }
            }
        }
        this.wallsEncountered[wall.identifier] = true;
        return true;
    } else
        return false;
};

GridInfo.prototype.getNbNodesAffected = function (radius, x, nodeX, nodeWidth, isLeft) {
    var distanceBeetweenPoints = isLeft ? (nodeX - x) : (x - nodeX);
    var distanceBetweenNodeSideAndWallCenter = (nodeWidth / 2) - distanceBeetweenPoints;
    var nbNodesAffected = (radius - distanceBetweenNodeSideAndWallCenter) / nodeWidth;
    return Math.ceil(nbNodesAffected);
};

GridInfo.prototype.getNode = function(x, y) {
    var nodeX = x / this.nodeSize.width;
    var nodeY = y / this.nodeSize.height;
    return {x: Math.floor(nodeX), y: Math.floor(nodeY)};
};

GridInfo.prototype.search = function(start, end) {
    var startNode = this.nodes[start.x][start.y];
    var endNode = this.nodes[end.x][end.y];
    var result = astar.search(this.nodes, startNode, endNode, {diagonal: true});
    return result;
};

GridInfo.prototype.getCenterPositions = function(nodes) {
    var centers = [];
    for(var i=0; i<nodes.length; i++) {
        var currentNode = this.nodes[nodes[i].x][nodes[i].y];
        centers.push(currentNode.data.middlePosition);
    }
    return centers;
};

GridInfo.prototype.createNodes = function() {
    this.nodes = [];
    for(var x=0; x<this.worldSize.width / this.nodeSize.width; x++) {
        this.nodes[x] = [];
        for(var y=0; y<this.worldSize.height / this.nodeSize.height; y++) {
            var node = new GraphNode(x, y, 1);
            node.data.date = new Date();
            node.data.middlePosition = this.getNodeMiddlePosition(x, y);
            this.nodes[x][y] = node;
        }
    }
};

GridInfo.prototype.getNodeMiddlePosition = function(x, y) {
    var middleX = x * this.nodeSize.width + this.nodeSize.width / 2;
    var middleY = y * this.nodeSize.height + this.nodeSize.height / 2;
    return {
        x: middleX,
        y: middleY
    }
};