Termite.prototype = new Agent();
Termite.prototype.constructor = Termite;

function Termite() {
    Agent.call(this);
    this.typeId = "termite";
    this.boundingRadius = 3;
    this.perceptionRadius = 100;
    this.hasWood = false;
    this.collidedAgent = null;

    this.collideTypes = ["wood_heap"];
    this.contactTypes = ["wood_heap", "termite"];

    this.initExpertSystem();
}

Termite.prototype.initExpertSystem = function() {
    this.expertSystem = new ExpertSystem();
    //this.expertSystem.addRule("go_to_heap", ["heap_percepted"];
};

Termite.prototype.update = function(dt) {
    this.perceive();
    var conclusions = this.analyze();
    this.act(conclusions);
    this.resetCollidedAgent();
};

Termite.prototype.perceive = function() {
    this.expertSystem.resetFactValues();

    this.expertSystem.setFactValid("collided_heap", this.isCollidedWith("wood_heap"));
};

Termite.prototype.analyze = function() {
    return this.expertSystem.inferForward();
};

Termite.prototype.act = function(conclusions) {
    for(var i = 0; i<conclusions.length; i++) {
        if(conclusions[i] == "") {

        }
    }
};

Termite.prototype.isCollidedWith = function(agentType) {
    return this.collidedAgent == agentType;
};


Termite.prototype.processCollision = function(collidedAgent) {
    if(collidedAgent && collidedAgent.typeId == "wood_heap") {
        this.collidedAgent = "wood_heap";
        if(!this.hasWood) {
            collidedAgent.takeWood();
            this.hasWood = true;
        } else {
            collidedAgent.addWood();
            this.hasWood = false;
        }
    }
};

Termite.prototype.processPerception = function(perceivedAgent) {
};

Termite.prototype.resetCollidedAgent = function(){
    this.collidedAgent = null;
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