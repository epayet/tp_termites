Termite.prototype = new Agent();
Termite.prototype.constructor = Termite;

function Termite() {
    Agent.call(this);
    this.typeId = "termite";
    this.boundingRadius = 3;
    this.perceptionRadius = 100;
    this.hasWood = false;
    this.speed = 200;
    this.collidedAgent = null;
    this.perceivedAgents = [];
    this.delay = 0;
    this.woodInfo = new WoodInfo();

    this.collideTypes = ["wood_heap", "wall"];
    this.contactTypes = ["wood_heap", "termite"];

    this.initExpertSystem();
}

Termite.prototype.initExpertSystem = function() {
    this.expertSystem = new ExpertSystem();
    this.expertSystem.addRule("go_to_least_wood", ["has_no_wood", "know_least_wood_position"]);
    this.expertSystem.addRule("go_to_most_wood", ["has_wood", "know_most_wood_position"]);
    this.expertSystem.addRule("random_move", ["not_enough_info"]);
    this.expertSystem.addRule("update_info_from_termite", ["perceived_termite"]);
    this.expertSystem.addRule("update_info_from_heap", ["perceived_heap"]);
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
    if(collidedAgent && collidedAgent.typeId == "wood_heap") {
        if(!this.hasWood) {
            collidedAgent.takeWood();
            if(collidedAgent.woodCount <= 0)
                this.woodInfo.heapDeleted(collidedAgent);
            this.hasWood = true;
        } else {
            collidedAgent.addWood();
            this.hasWood = false;
        }
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
};

Termite.prototype.setTarget = function(x, y) {
    this.direction = new Vect(x - this.x, y - this.y);
    this.direction.normalize(1);
};

Termite.prototype.draw = function(context) {
    if(this.hasWood)
        context.fillStyle="rgba(255, 0, 0, 1)";
    else
        context.fillStyle="rgba(0, 0, 0, 1)";
    context.strokeStyle="#000";
    context.beginPath();
    context.arc(this.x, this.y, this.boundingRadius, 0, 2*Math.PI);
    context.fill();
    context.stroke();
};


//actions
Termite.prototype.randomDirection = function() {
    var x = 2 * Math.random() - 1;
    var y = 2 * Math.random() - 1;
    this.direction = new Vect(x, y);
};

Termite.prototype.randomMove = function (dt) {
    this.delay -= dt;
    if(this.delay <= 0) {
        this.randomDirection();
        this.delay = 500;
    }
    this.move(dt);
};

Termite.prototype.goToHeap = function(heap, dt) {
    this.setTarget(heap.x, heap.y);
    this.move(dt);
};

Termite.prototype.updateInfoFromPerceivedTermites = function () {
    var perceivedTermites = this.getPerceivedAgents("termite");
    for(var i=0; i<perceivedTermites.length; i++)
        this.woodInfo.update(perceivedTermites[i].woodInfo);
};

Termite.prototype.updateInfoFromPerceivedHeaps = function() {
    var perceivedHeaps = this.getPerceivedAgents("wood_heap");
    for(var i=0; i<perceivedHeaps.length; i++)
        this.woodInfo.updateHeap(perceivedHeaps[i]);
};