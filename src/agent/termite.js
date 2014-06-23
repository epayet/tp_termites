Termite.prototype = new Agent();
Termite.prototype.constructor = Termite;

function Termite(options) {
    Agent.call(this);
    this.typeId = "termite";
    this.boundingRadius = 3;
    this.perceptionRadius = 100;
    this.hasWood = false;
    this.speed = options.speed;
    this.collidedAgent = null;
    this.perceivedAgents = [];
    this.woodInfo = new WoodInfo();
    this.useGrid = options.useGrid;
    this.targets = [];
    this.nodesTarget = [{x:0, y:0}];
    this.worldSize = options.worldSize;
    this.nodeSize = options.nodeSize;
    this.timePassedInSameNode = 0;

    this.collideTypes = ["wood_heap", "wall"];
    this.contactTypes = ["wood_heap", "termite", "wall"];
    if(this.useGrid) {
        this.gridInfo = new GridInfo({
            worldSize: options.worldSize,
            nodeSize: options.nodeSize
        });
    }
    this.destinationMargin = {
        x: options.nodeSize.width/4,
        y: options.nodeSize.height/4
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
    this.expertSystem.addRule("random_move", ["blocked_too_much"]);
};

Termite.prototype.update = function(dt) {
    this.perceive();
    var conclusions = this.analyze();
    this.act(conclusions, dt);
    if(this.direction != null)
        this.move(dt);
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
    this.expertSystem.setFactValid("blocked_too_much", this.blockedTooMuch());
};

Termite.prototype.analyze = function() {
    return this.expertSystem.inferForward();
};

Termite.prototype.act = function(conclusions, dt) {
    var nbMoveInstruction = 0;
    var moveFunction = null;
    var self = this;
    if(DEBUG.play) {
        for (var i = 0; i < conclusions.length; i++) {
            switch (conclusions[i]) {
                case "go_to_least_wood":
                    moveFunction = function() {
                        self.goToHeap(self.woodInfo.least(), dt)
                    };
                    nbMoveInstruction++;
                    break;
                case "go_to_most_wood":
                    moveFunction = function() {
                        self.goToHeap(self.woodInfo.most(), dt);
                    };
                    nbMoveInstruction++;
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
                    moveFunction = function() {
                        self.randomMove(dt);
                    };
                    nbMoveInstruction++;
                    break;
            }
//            console.log(conclusions[i]);
        }
        //if have multiple move instructions: random instead
        if(nbMoveInstruction > 1) {
            this.randomMove(dt);
//            console.log("random move instead");
        } else if(nbMoveInstruction == 1) { // else do the original move
            moveFunction();
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
        this.resetGoal();
    } else if(!collidedAgent) {
        this.resetGoal();
    }
};

Termite.prototype.processPerception = function(perceivedAgent) {
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
        this.timePassedInSameNode = 0;
    } else {
        this.timePassedInSameNode += dt;
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
    //If 0 doesn't move : magic value !
    if(this.direction.x === 0)
        this.direction.x = 0.0000001;
    if(this.direction.y === 0)
        this.direction.y = 0.0000001;
    this.direction.normalize(1);
};

Termite.prototype.setTargets = function(targets) {
    var self = this;
    if(targets.length > 0) {
        this.targets = targets;
        //set the first destination
        this.setTarget(targets[0], nextTargetCallback);
    }

    function nextTargetCallback() {
        //enqueue the first destination (precedent one) and take the next one
        self.targets.shift();
        var nextTarget = self.targets[0];
        if (nextTarget)
            self.setTarget(nextTarget, nextTargetCallback);
        else {
            self.resetGoal();
        }
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
    if(this.clickTarget)
        this.setNodeDestination(this.clickTarget);
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
//        var randomNodeX = 0;
//        var randomNodeY = 0;
        var termiteNode = this.gridInfo.getNode(this.x, this.y);
        var nodes = this.gridInfo.search(termiteNode, {x: randomNodeX, y: randomNodeY});
        if(nodes.length == 0) {
//            console.log("wut");
        }
        var positions = this.gridInfo.getCenterPositions(nodes);
        this.setTargets(positions);
        this.setNodesTarget(nodes);
    }
//    this.move(dt);
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
                this.setNodesTarget(nodes);
            } else {
                this.randomMove(dt);
            }
        }
    } else {
        this.setTarget({x: heap.x, y: heap.y});
    }
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
            if(this.gridInfo.updateWall(perceivedWalls[i]))
                this.resetGoal();
        }
    }
};

Termite.prototype.setNodeDestination = function(target) {
    this.clickTarget = target;
    var nodeTarget = this.gridInfo.getNode(target.x, target.y);
    var termiteNode = this.gridInfo.getNode(this.x, this.y);
    var nodes = this.gridInfo.search(termiteNode, nodeTarget);
    var positions = this.gridInfo.getCenterPositions(nodes);
    this.setTargets(positions);
    this.setNodesTarget(nodes);
};

Termite.prototype.blockedTooMuch = function () {
    if( this.timePassedInSameNode > (this.speed / 100) * 1000) {
//        console.log("blocked");
        return true;
    } else return false;
};