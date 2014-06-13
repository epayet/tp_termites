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

WoodInfo.prototype.update = function(woodInfo) {
    if(woodInfo.date > this.date) {
        this.heapsInfo = woodInfo.heapsInfo;
        this.updateLeastAndMostHeap();
        this.date = woodInfo.date;
    }
};

WoodInfo.prototype.isEnough = function() {
    return this.heapWithMostWood != null && this.heapWithLeastWood != null;
};

WoodInfo.prototype.contains = function (heap) {
    return this.getHeapInfo(heap) !== undefined;
};

WoodInfo.prototype.addHeapInfo = function(heap) {
    this.heapsInfo[heap.identifier] = {
        date: new Date(),
        woodCount: heap.woodCount,
        x: heap.x,
        y: heap.y
    }
};

WoodInfo.prototype.heapDeleted = function(heap) {
    console.log("deleted");
    delete this.heapsInfo[heap.identifier];
    this.updateLeastAndMostHeap();
    this.date = new Date();
};

WoodInfo.prototype.isHeapInfoUpToDate = function(heap) {
    var currentHeapInfo = this.getHeapInfo(heap);
    return currentHeapInfo.woodCount == heap.woodCount;
};

WoodInfo.prototype.updateHeapInfo = function(heap) {
    this.addHeapInfo(heap);
};

WoodInfo.prototype.updateLeastAndMostHeap = function() {
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

WoodInfo.prototype.getHeapInfo = function(heap) {
    return this.heapsInfo[heap.identifier];
};