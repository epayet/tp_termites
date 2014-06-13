GridInfo = function(options) {
    this.nodeSize = options.nodeSize;
    this.worldSize = options.worldSize;
    this.createNodes();
};

GridInfo.prototype.updateHeap = function(heap, type) {
    if(!type)
        type = 0;
    var nodesAffected = this.getNodesAffectedByHeap(heap);
    for(var i=0; i<nodesAffected.length; i++) {
        var nodeAffected = this.nodes[nodesAffected[i].x][nodesAffected[i].y];
        nodeAffected.type = type;
        nodeAffected.data.date = new Date();
    }
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

GridInfo.prototype.updateWoodTaken = function(heap) {
    var heapBefore = new WoodHeap();
    heapBefore.woodCount = heap.woodCount + 1;
    heapBefore.moveTo(heap.x, heap.y);

    if(!heap.dead) {
        var nodesAffectedBefore = this.getNodesAffectedByHeap(heapBefore);
        var nodesAffectedNow = this.getNodesAffectedByHeap(heap);
        if (nodesAffectedNow.length < nodesAffectedBefore.length) {
            this.updateHeap(heapBefore, 1);
            this.updateHeap(heap);
        }
    }
    else
        this.updateHeap(heapBefore, 1);
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

GridInfo.prototype.getNodesAffectedByHeap = function(heap) {
    var nodeHeap = this.getNode(heap.x, heap.y);
    var nbNodesAffectedX = this.getNbNodesAffectedAround(heap, this.nodeSize.width);
    var nbNodesAffectedY = this.getNbNodesAffectedAround(heap, this.nodeSize.height);

    var nodes = [];
    for(var x=nodeHeap.x - nbNodesAffectedX; x<=nodeHeap.x + nbNodesAffectedX; x++) {
        for(var y=nodeHeap.y - nbNodesAffectedY; y<=nodeHeap.y + nbNodesAffectedY; y++) {
            nodes.push({x: x, y: y});
        }
    }
    return nodes;
};

GridInfo.prototype.getNbNodesAffectedAround = function (heap, size) {
    var heapRadius = heap.getRadius();
    if(heapRadius > size/2)
        return Math.ceil((heapRadius - size/2) / size);
    else
        return Math.floor(heapRadius / size);
};