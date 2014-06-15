describe("A WoodInfo", function () {
    var woodInfo, woodInfo2;

    beforeEach(function () {
        woodInfo = new WoodInfo();
        woodInfo2 = new WoodInfo();
    });

    describe("initialization", function() {
        it("should create a WoodInfo", function () {
            expect(woodInfo).toBeDefined();
        });
    });

    describe("update woodInfo", function(){
        it("should update its info when encountering another woodInfo more recent", function(){
            var heap = createHeap(2 ,7 ,10);
            woodInfo2.updateHeap(heap);
            woodInfo.update(woodInfo2);
            var heapInfo = woodInfo.heapsInfo[heap.identifier];
            expect(heapInfo).toBeDefined();
        });

        it("should update its info when encountering another woodInfo more recent (existing)", function () {
            var heap = createHeap(2 ,7 ,10);
            woodInfo.updateHeap(heap);
            var heapInfo = woodInfo.heapsInfo[heap.identifier];
            heapInfo.date = new Date(2010, 10, 10);

            heap.woodCount--;
            woodInfo2.updateHeap(heap);

            woodInfo.update(woodInfo2);
            expect(heapInfo.woodCount).toBe(heap.woodCount);
        });

        it("should not update its info when encountering another woodInfo less recent", function(){
            var heap = createHeap(2, 7, 10);
            woodInfo2.updateHeap(heap);
            var heapInfo2 = woodInfo2.heapsInfo[heap.identifier];
            heapInfo2.date = new Date(2010, 10, 10);

            heap.woodCount--;
            woodInfo.updateHeap(heap);

            var heapInfo = woodInfo.heapsInfo[heap.identifier];
            woodInfo.update(woodInfo2);
            expect(heapInfo.woodCount).toBe(heap.woodCount);
        });

    });

    describe("update heap", function(){
        it("should add heap info when encountering a heap for the first time", function(){
            var heap = createHeap(2 ,7 ,10);
            woodInfo.updateHeap(heap);
            var heapInfo = woodInfo.heapsInfo[heap.identifier];
            expect(heapInfo).toBeDefined();
            expect(heapInfo.x).toBe(heap.x);
            expect(heapInfo.y).toBe(heap.y);
            expect(heapInfo.woodCount).toBe(heap.woodCount);
            expect(heapInfo.date).toBeDefined();
        });

        it("should update its heap info when encountering a heap encountered before", function() {
            var heap = createHeap(2 ,7 ,10);
            woodInfo.updateHeap(heap);
            var heapInfo = woodInfo.heapsInfo[heap.identifier];
            expect(heapInfo.woodCount).toBe(heap.woodCount);

            heap.woodCount--;
            woodInfo.updateHeap(heap);
            expect(heapInfo.woodCount).toBe(heap.woodCount);
        });
    });

    describe("most and least", function () {
        it("should have most and least null by default", function () {
            expect(woodInfo.isEnough()).toBe(false);
            expect(woodInfo.least()).toBeUndefined();
            expect(woodInfo.most()).toBeUndefined();
        });

        it("should have correct most and least woodHeaps when defining at least 2 different wood heaps", function() {
            var heapLeast = createHeap(20, 20, 10);
            var heapMost = createHeap(50, 50, 20);
            var heapMost1 = createHeap(50, 50, 17);
            var heapMost2 = createHeap(50, 50, 12);
            woodInfo.updateHeap(heapLeast);
            woodInfo.updateHeap(heapMost);
            woodInfo.updateHeap(heapMost1);
            woodInfo.updateHeap(heapMost2);

            expect(woodInfo.isEnough()).toBe(true);
            expect(woodInfo.least().woodCount).toBe(10);
            expect(woodInfo.most().woodCount).toBe(20);
        });

        it("should have most and least undefined when only one heapInfo is defined", function(){
            var heapTheOnlyOne = createHeap(20, 20, 20);
            woodInfo.updateHeap(heapTheOnlyOne);

            expect(woodInfo.isEnough()).toBe(false);
            expect(woodInfo.least()).toBe(null);
            expect(woodInfo.most()).toBe(null);
        });
    });

    describe("heap deleted", function () {
        it("should be dead in the info", function(){
            var deadHeap = createHeap(20, 20, 1);
            woodInfo.updateHeap(deadHeap);
            deadHeap.kill();
            woodInfo.heapDeleted(deadHeap);
            var heapInfo = woodInfo.heapsInfo[deadHeap.identifier];
            expect(heapInfo.dead).toBe(true);
        });

        it("should update dead info with another termite", function () {
            var deadHeap = createHeap(20, 20, 1);
            woodInfo.updateHeap(deadHeap);
            deadHeap.kill();
            woodInfo.heapDeleted(deadHeap);
            woodInfo2.update(woodInfo);
            var heapInfo2 = woodInfo2.heapsInfo[deadHeap.identifier];
            expect(heapInfo2.dead).toBe(true);
        });

        it("should consider dead heaps in recomputing", function() {
            var heapLeast = createHeap(10, 10, 2);
            var heapMost = createHeap(10, 10, 10);
            woodInfo.updateHeap(heapLeast);
            woodInfo.updateHeap(heapMost);
            var deadHeap = createHeap(20, 20, 1);
            woodInfo.updateHeap(deadHeap);
            deadHeap.kill();
            woodInfo.heapDeleted(deadHeap);
            expect(woodInfo.most().woodCount).toBe(10);
            expect(woodInfo.least().woodCount).toBe(2);
        });

        it("should have most and least undefined when one dead", function () {
            var heapMost = createHeap(10, 10, 2);
            woodInfo.updateHeap(heapMost);
            var deadHeap = createHeap(20, 20, 1);
            woodInfo.updateHeap(deadHeap);
            deadHeap.kill();
            woodInfo.heapDeleted(deadHeap);
            expect(woodInfo.most()).toBe(null);
            expect(woodInfo.least()).toBe(null);
        });
    });

});
function createHeap(x, y, woodCount){
    return {
        identifier : Math.random()*1000,
        x : x,
        y : y,
        woodCount : woodCount,
        kill: function() {
            this.woodCount--;
            this.dead = true;
        }
    };
}