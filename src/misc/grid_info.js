GridInfo = function(options) {
    this.nodeSize = options.nodeSize;
    this.worldSize = options.worldSize;
    this.createNodes();
};

GridInfo.prototype.updateHeap = function(heap) {
    var nodesAffected = this.getNodesAffectedByHeap(heap);
    for(var i=0; i<nodesAffected.length; i++) {
        var nodeAffected = this.nodes[nodesAffected[i].x][nodesAffected[i].y];
        nodeAffected.type = 1;
        nodeAffected.data.date = new Date();
    }
};

GridInfo.prototype.update = function(gridInfo) {

};

GridInfo.prototype.getNode = function(x, y) {

};

GridInfo.prototype.search = function(startNode, endNode) {

};

GridInfo.prototype.getCenterPositions = function(nodes) {

};

GridInfo.prototype.createNodes = function() {
    this.nodes = [];
    for(var x=0; x<this.worldSize.width / this.nodeSize.width; x++) {
        this.nodes[x] = [];
        for(var y=0; y<this.worldSize.height / this.nodeSize.height; y++) {
            var node = new GraphNode(x, y, 0);
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

GridInfo.prototype.getNodesAffectedByHeap = function(heap) {
    var nodeHeap = this.getNode(heap.x, heap.y);
    var heapRadius = this.getHeapRadius(heap);
    var nbNodesAffectedX = heapRadius / (this.nodeSize.width - (this.nodeSize.width/2));
    return [{
        x: 0,
        y: 0
    }];
};

GridInfo.prototype.getHeapRadius = function(heap) {
    return heap.woodCount;
};