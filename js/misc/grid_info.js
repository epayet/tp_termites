GridInfo = function (options) {
    this.date = new Date();
    this.worldSize = options.worldSize;
    this.nodeSize = options.nodeSize;
    this.createGraph();
};

GridInfo.prototype.updateHeap = function (heap) {
    var nodesAffected = this.getNodesAffectedByHeap(heap);
    this.setNodesType(nodesAffected, 1);
    this.date = new Date();
};

GridInfo.prototype.update = function(gridInfo) {
    if(this.date < gridInfo.date) {
        this.date = gridInfo.date;
        this.graph = gridInfo.graph;
    }
};

GridInfo.prototype.search = function(startNode, endNode) {
    var start = this.graph.nodes[startNode.x][startNode.y];
    var end = this.graph.nodes[endNode.x][endNode.y];
    return astar.search(this.graph.nodes, start, end);
};

GridInfo.prototype.getNode = function(x, y) {
    var nodeX = x / this.nodeSize.width;
    var nodeY = y / this.nodeSize.height;
    return {x: Math.round(nodeX), y: Math.round(nodeY)};
};

GridInfo.prototype.getCenterPositions = function(nodes) {
    var positions = [];
    for(var i=0; i<nodes.length; i++) {
        positions.push(this.getCenterPosition(nodes[i]));
    }
    return positions;
};

GridInfo.prototype.getCenterPosition = function(node) {
    var x = node.x * this.nodeSize.width + this.nodeSize.width / 2;
    var y = node.y * this.nodeSize.height + this.nodeSize.height / 2;
    return {x: x, y: y};
};

GridInfo.prototype.getNodesAffectedByHeap = function(heap) {
    var nodeHeap = this.getNode(heap.x, heap.y);
    var nbNodesAffected = heap.woodCount / this.nodeSize;
    var nodes = [];
    for(var x=nodeHeap.x - nbNodesAffected; x<=nodeHeap.x + nbNodesAffected; x++) {
        for(var y=nodeHeap.y - nbNodesAffected; y<=nodeHeap.y + nbNodesAffected; y++) {
            nodes.push({x: x, y: y});
        }
    }
    return nodes;
};

GridInfo.prototype.setNodesType = function(nodes, type) {
    for(var i=0; i<nodes.length; i++) {
        this.setNodeType(nodes[i], type);
    }
};

GridInfo.prototype.setNodeType = function(node, type) {
    this.graph.nodes[node.x][node.y].type = type;
};

GridInfo.prototype.createGraph = function () {
    var nodes = [];
    var nbNodesX = this.worldSize.width / this.nodeSize.width;
    var nbNodesY = this.worldSize.height / this.nodeSize.height;
    for(var x=0; x<nbNodesX; x++) {
        nodes[x] = [];
        for(var y=0; y<nbNodesY; y++) {
            nodes[x][y] = 0;
        }
    }
    this.graph = new Graph(nodes);
};