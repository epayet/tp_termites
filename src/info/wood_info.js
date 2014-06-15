WoodInfo = function () {
    this.heapsInfo = {};
    this.date = new Date();
};

WoodInfo.prototype.most = function () {
    return this.heapWithMostWood;
};

WoodInfo.prototype.least = function() {
    return this.heapWithLeastWood;
};

WoodInfo.prototype.updateHeap = function(heap) {
    // quand rencontre tas de bois update de la list if premier rencontre on add sinon update woodinfo et date
    if(!this.heapsInfo[heap.identifier]){
        this.heapsInfo[heap.identifier] = {
            x: heap.x,
            y: heap.y,
            woodCount: heap.woodCount,
            date : new Date()
        };
    }
    else{
        var heapInfo = this.heapsInfo[heap.identifier];
        heapInfo.x = heap.x;
        heapInfo.y = heap.y;
        heapInfo.woodCount = heap.woodCount;
        heapInfo.date = new Date();
    }
    this.recomputeMostAndLeast();
};

WoodInfo.prototype.update = function(woodInfo) {
    for(var identifier in woodInfo.heapsInfo) {
        var heapInfo2 = woodInfo.heapsInfo[identifier];
        if(!this.heapsInfo[identifier]) {
            this.heapsInfo[identifier] = {
                x: heapInfo2.x,
                y: heapInfo2.y,
                woodCount: heapInfo2.woodCount,
                dead: heapInfo2.dead,
                date : heapInfo2.date
            };
            this.recomputeMostAndLeast();
        }
        else{
            var heapInfo = this.heapsInfo[identifier];
            if(heapInfo2.date > heapInfo.date) {
                heapInfo.x = heapInfo2.x;
                heapInfo.y = heapInfo2.y;
                heapInfo.woodCount = heapInfo2.woodCount;
                heapInfo.date = heapInfo2.date;
                heapInfo.dead = heapInfo2.dead;
                this.recomputeMostAndLeast();
            }
        }
    }
};

WoodInfo.prototype.isEnough = function() {
    return this.most()!= null && this.least() != null;
};

WoodInfo.prototype.heapDeleted = function(heap) {
    var heapInfo = this.heapsInfo[heap.identifier];
    heapInfo.dead = true;
    heapInfo.date = new Date();
    this.recomputeMostAndLeast();
};

WoodInfo.prototype.recomputeMostAndLeast = function () {
    if(this.getNbAliveHeaps() >= 2) {
        var leastWood = null;
        var mostWood = null;
        for (var identifier in this.heapsInfo) {
            var heapInfo = this.heapsInfo[identifier];
            if(!heapInfo.dead){
                if(!mostWood || heapInfo.woodCount > mostWood.woodCount)
                    mostWood = heapInfo;
                if(!leastWood || heapInfo.woodCount < leastWood.woodCount)
                    leastWood = heapInfo;
            }
        }
        this.heapWithLeastWood = leastWood;
        this.heapWithMostWood = mostWood;
    } else {
        this.heapWithLeastWood = null;
        this.heapWithMostWood = null;
    }
};

WoodInfo.prototype.getNbAliveHeaps = function() {
    var nbAlive = 0;
    for(var identifier in this.heapsInfo){
        if(!this.heapsInfo[identifier].dead){
            nbAlive++;
        }
    }
    return nbAlive;

};