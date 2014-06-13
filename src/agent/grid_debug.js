GridDebug = function(options) {
    Agent.call(this);
    this.gridInfo = options.gridInfo;
    this.nodeSize = options.nodeSize;
    this.termiteTargets = options.termiteTargets;
};

GridDebug.prototype = Object.create(Agent.prototype);

GridDebug.prototype.draw = function(context) {
    if(DEBUG.toggle_grid) {
        var nodes = this.gridInfo.nodes;
        var width = this.nodeSize.width;
        var height = this.nodeSize.height;
        context.strokeStyle = "#000";
        for (var x = 0; x < nodes.length; x++) {
            for (var y = 0; y < nodes[x].length; y++) {
                if (nodes[x][y].type == 0)
                    context.fillStyle = "rgba(255,0,0,0.5)";
                else if (nodes[x][y].type == 1)
                    context.fillStyle = "rgba(255,255,255,0.5)";
                context.beginPath();
                context.rect(x * width, y * height, width, height);
                context.fill();
                context.stroke();
            }
        }
    }
};