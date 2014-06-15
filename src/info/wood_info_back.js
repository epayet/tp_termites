WoodInfoBack = function () {
    this.heapsInfo = {};
    this.date = new Date();
};

WoodInfoBack.prototype.most = function () {
    return this.heapWithMostWood;
};

WoodInfoBack.prototype.least = function() {
    return this.heapWithLeastWood;
};

WoodInfoBack.prototype.updateHeap = function(heap) {
//    console.log(heap);
    if (!this.contains(heap)) {
        this.addHeapInfo(heap);
        this.updateLeastAndMostHeap();
    } else {
        if (!this.isHeapInfoUpToDate(heap)) {
            this.updateHeapInfo(heap);
        }
    }
    this.date = new Date();
};

WoodInfoBack.prototype.update = function(woodInfo) {
    if(woodInfo.date > this.date) {
        this.heapsInfo = woodInfo.heapsInfo;
        this.updateLeastAndMostHeap();
        this.date = woodInfo.date;
    }
};

WoodInfoBack.prototype.isEnough = function() {
    return this.heapWithMostWood != null && this.heapWithLeastWood != null;
};

WoodInfoBack.prototype.contains = function (heap) {
    return this.getHeapInfo(heap) !== undefined;
};

WoodInfoBack.prototype.addHeapInfo = function(heap) {
    this.heapsInfo[heap.identifier] = {
        date: new Date(),
        woodCount: heap.woodCount,
        x: heap.x,
        y: heap.y
    }
};

WoodInfoBack.prototype.heapDeleted = function(heap) {
    console.log("deleted");
    delete this.heapsInfo[heap.identifier];
    this.updateLeastAndMostHeap();
    this.date = new Date();
};

WoodInfoBack.prototype.isHeapInfoUpToDate = function(heap) {
    var currentHeapInfo = this.getHeapInfo(heap);
    return currentHeapInfo.woodCount == heap.woodCount;
};

WoodInfoBack.prototype.updateHeapInfo = function(heap) {
    this.addHeapInfo(heap);
};

WoodInfoBack.prototype.updateLeastAndMostHeap = function() {
    //if has at least 2 heaps info
    if(Object.keys(this.heapsInfo).length >= 2) {
        var leastWood = null;
        var mostWood = null;
        for (var identifier in this.heapsInfo) {
            var heapInfo = this.heapsInfo[identifier];
            if(!mostWood || heapInfo.woodCount > mostWood.woodCount)
                mostWood = heapInfo;
            if(!leastWood || heapInfo.woodCount < leastWood.woodCount)
                leastWood = heapInfo;
        }
        this.heapWithLeastWood = leastWood;
        this.heapWithMostWood = mostWood;
    } else {
        this.heapWithLeastWood = null;
        this.heapWithMostWood = null;
    }
};

WoodInfoBack.prototype.getHeapInfo = function(heap) {
    return this.heapsInfo[heap.identifier];
};