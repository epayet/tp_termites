Termite.prototype = new Agent();
Termite.prototype.constructor = Termite;

function Termite(options) {
    Agent.call(this);
    this.typeId = "termite";
    this.boundingRadius = 3;
    this.perceptionRadius = 100;
    this.hasWood = false;
    this.speed = 200;
    this.collidedAgent = null;
    this.perceivedAgents = [];
    this.woodInfo = new WoodInfo();
    this.useGrid = options.useGrid;
    this.targets = [];
    this.nodesTarget = [{x:0, y:0}];
    this.worldSize = options.worldSize;
    this.nodeSize = options.nodeSize;

    this.collideTypes = ["wood_heap", "wall"];
    this.contactTypes = ["wood_heap", "termite", "wall"];
    if(this.useGrid) {
        this.gridInfo = new GridInfo({
            worldSize: options.worldSize,
            nodeSize: options.nodeSize
        });
    }
    this.destinationMargin = {
        x: options.nodeSize.width,
        y: options.nodeSize.height
    };
    this.isDebugTermite = options.isDebugTermite;

    this.initExpertSystem();
}

Termite.prototype.initExpertSystem = function() {
    this.expertSystem = new ExpertSystem();
    this.expertSystem.addRule("go_to_least_wood", ["has_no_wood", "know_least_wood_position"]);
    this.expertSystem.addRule("go_to_most_wood", ["has_wood", "know_most_wood_position"]);
    this.expertSystem.addRule("random_move", ["not_enough_info"]);
    this.expertSystem.addRule("update_info_from_termite", ["perceived_termite"]);
    this.expertSystem.addRule("update_info_from_heap", ["perceived_heap"]);
    this.expertSystem.addRule("update_info_from_wall", ["perceived_wall"]);
};

Termite.prototype.update = function(dt) {
    this.perceive();
    var conclusions = this.analyze();
    this.act(conclusions, dt);
    this.reset();
};

Termite.prototype.perceive = function() {
    this.expertSystem.resetFactValues();

    this.expertSystem.setFactValid("has_no_wood", this.hasWood == false);
    this.expertSystem.setFactValid("has_wood", this.hasWood);
    this.expertSystem.setFactValid("know_least_wood_position", this.woodInfo.least() != null);
    this.expertSystem.setFactValid("know_most_wood_position", this.woodInfo.most() != null);
    this.expertSystem.setFactValid("perceived_termite", this.isPerceivedWith("termite"));
    this.expertSystem.setFactValid("perceived_heap", this.isPerceivedWith("wood_heap"));
    this.expertSystem.setFactValid("perceived_wall", this.isPerceivedWith("wall"));
    this.expertSystem.setFactValid("not_enough_info", this.woodInfo.isEnough() == false);
};

Termite.prototype.analyze = function() {
    return this.expertSystem.inferForward();
};

Termite.prototype.act = function(conclusions, dt) {
    if(DEBUG.play) {
        for (var i = 0; i < conclusions.length; i++) {
            switch (conclusions[i]) {
                case "go_to_least_wood":
                    this.goToHeap(this.woodInfo.least(), dt);
                    break;
                case "go_to_most_wood":
                    this.goToHeap(this.woodInfo.most(), dt);
                    break;
                case "update_info_from_termite":
                    this.updateInfoFromPerceivedTermites();
                    break;
                case "update_info_from_heap":
                    this.updateInfoFromPerceivedHeaps();
                    break;
                case "update_info_from_wall":
                    this.updateInfoFromPerceivedWalls();
                    break;
                case "random_move":
                    this.randomMove(dt);
                    break;
            }
//            console.log(conclusions[i]);
        }
    }
};

Termite.prototype.isCollidedWith = function(agentType) {
    return this.collidedAgent && this.collidedAgent.typeId == agentType;
};

Termite.prototype.isPerceivedWith = function(agentType) {
    for(var i=0; i<this.perceivedAgents.length; i++) {
        if(this.perceivedAgents[i].typeId == agentType)
            return true;
    }
    return false;
};

Termite.prototype.getPerceivedAgents = function(agentType) {
    var perceived = [];
    for(var i=0; i<this.perceivedAgents.length; i++) {
        if(this.perceivedAgents[i].typeId == agentType)
            perceived.push(this.perceivedAgents[i]);
    }
    return perceived;
};

Termite.prototype.processCollision = function(collidedAgent) {
    this.collidedAgent = collidedAgent;
    this.resetGoal();
    if(collidedAgent && collidedAgent.typeId == "wood_heap") {
        if(!this.hasWood) {
            collidedAgent.takeWood();
            if(collidedAgent.dead)
                this.woodInfo.heapDeleted(collidedAgent);
            this.hasWood = true;
        } else {
            collidedAgent.addWood();
            this.hasWood = false;
        }
    }
};

Termite.prototype.processPerception = function(perceivedAgent) {
    //if(!perceivedAgent.dead)
        this.perceivedAgents.push(perceivedAgent);
};

Termite.prototype.reset = function(){
    this.collidedAgent = null;
    this.perceivedAgents = [];
};

Termite.prototype.move = function(dt) {
    this.moveBy(this.direction, this.speed*(dt/1000));
    if(this.destinationCallback && this.hasArrivedToDestination()) {
        this.destinationCallback();
    }
};

Termite.prototype.setTarget = function(target, callback) {
    this.setDirectionForTarget(target.x, target.y);
    this.destinationCallback = callback;
    this.destination = target;
//    console.log(target);
};

Termite.prototype.hasArrivedToDestination = function () {
    return this.x > this.destination.x - this.destinationMargin.x && this.x < this.destination.x + this.destinationMargin.x
        && this.y > this.destination.y - this.destinationMargin.y && this.y < this.destination.y + this.destinationMargin.y;
};

Termite.prototype.setDirectionForTarget = function(x, y) {
    this.direction = new Vect(x - this.x, y - this.y);
    this.direction.normalize(1);
};

Termite.prototype.setTargets = function(targets) {
    if(targets.length > 0) {
        this.targets = targets;
        var self = this;
        //set the first destination
        this.setTarget(targets[0], nextTargetCallback);
    }

    function nextTargetCallback() {
        //enqueue the first destination (precedent one) and take the next one
        self.targets.shift();
        var nextTarget = self.targets[0];
        if (nextTarget)
            self.setTarget(nextTarget, nextTargetCallback);
    }
};

Termite.prototype.setNodesTarget = function (nodes) {
    //reinitialize targets and set new targets without losing references
    this.nodesTarget.length = 0;
    this.nodesTarget.push.apply(this.nodesTarget, nodes);
};

Termite.prototype.hasGoal = function () {
    return this.targets && this.targets.length > 0 && this.destination != null;
};

Termite.prototype.resetGoal = function() {
    this.targets = [];
    this.nodesTarget.length = 0;
};

Termite.prototype.isDestination = function(x, y) {
    var lastTarget = this.targets[this.targets.length - 1];
    return lastTarget && lastTarget.x == x && lastTarget.y == y;
};

Termite.prototype.draw = function(context) {
    if(this.hasWood)
        context.fillStyle="rgba(255, 0, 0, 1)";
    else if(this.isDebugTermite && DEBUG.toggle_grid)
        context.fillStyle="rgba(0, 255, 0, 1)";
    else
        context.fillStyle="rgba(0, 0, 0, 1)";
    context.strokeStyle="#000";
    context.beginPath();
    context.arc(this.x, this.y, this.boundingRadius, 0, 2*Math.PI);
//    context.fillStyle="rgba(255, 0, 0, 0)";
//    context.arc(this.x, this.y, this.perceptionRadius, 0, 2*Math.PI);
    context.fill();
    context.stroke();
};

Termite.prototype.randomMove = function (dt) {
    if(!this.hasGoal()) {
        var randomNodeX = Math.floor(Math.random() * (this.worldSize.width / this.nodeSize.width));
        var randomNodeY = Math.floor(Math.random() * (this.worldSize.height / this.nodeSize.height));
        var termiteNode = this.gridInfo.getNode(this.x, this.y);
        var nodes = this.gridInfo.search(termiteNode, {x: randomNodeX, y: randomNodeY});
        var positions = this.gridInfo.getCenterPositions(nodes);
        this.setTargets(positions);
        this.setNodesTarget(nodes);
    }
    this.move(dt);
};

Termite.prototype.goToHeap = function(heap, dt) {
    if(this.useGrid) {
        if (!this.isDestination(heap.x, heap.y)) {
            var termiteNode = this.gridInfo.getNode(this.x, this.y);
            var heapNode = this.gridInfo.getNode(heap.x, heap.y);
            var nodes = this.gridInfo.search(termiteNode, heapNode);
            var positions = this.gridInfo.getCenterPositions(nodes);
            if(positions.length > 0) {
                //last position : heap position
                positions[positions.length - 1].x = heap.x;
                positions[positions.length - 1].y = heap.y;
                this.setTargets(positions);
            } else {
//                this.setTargets([heap]);
//                console.log("looooog");
            }
            this.setNodesTarget(nodes);
        }
    } else
        this.setTarget({x: heap.x, y: heap.y});

    this.move(dt);
};

Termite.prototype.updateInfoFromPerceivedTermites = function () {
    var perceivedTermites = this.getPerceivedAgents("termite");
    for(var i=0; i<perceivedTermites.length; i++) {
        this.woodInfo.update(perceivedTermites[i].woodInfo);
        if(this.useGrid)
            this.gridInfo.update(perceivedTermites[i].gridInfo);
    }
};

Termite.prototype.updateInfoFromPerceivedHeaps = function() {
    var perceivedHeaps = this.getPerceivedAgents("wood_heap");
    for(var i=0; i<perceivedHeaps.length; i++) {
        this.woodInfo.updateHeap(perceivedHeaps[i]);
    }
};

Termite.prototype.updateInfoFromPerceivedWalls = function() {
    var perceivedWalls = this.getPerceivedAgents("wall");
    for(var i=0; i<perceivedWalls.length; i++) {
        if(this.useGrid) {
            this.gridInfo.updateWall(perceivedWalls[i]);
        }
    }
};