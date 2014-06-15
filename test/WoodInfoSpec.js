describe("A WoodInfo", function () {
    var woodInfo;

    beforeEach(function () {
        woodInfo = new WoodInfo();
    });

    describe("initialisation", function() {
        it("should create a WoodInfoBack", function () {
            expect(woodInfo).toBeDefined();
        });
    });

    describe("update woodinfos", function(){
        it("should update its info when encountering another woodInfo more recent", function(){

        });
        it("should not update its info when encountering another woodInfo less recent");
    });

    describe("update heap", function(){
        it("should add heap info when encountering a heap for the first time", function(){
           var heap = {
               identifier : 1,
               x : 2,
               y : 7,
               woodCount : 10
           };
            woodInfo.updateHeap(heap);
            var heapinfo = woodInfo.heapsInfo[heap.identifier];
            expect(heapinfo).toBeDefined();
            expect(heapinfo.x).toBe(heap.x);
            expect(heapinfo.y).toBe(heap.y);
            expect(heapinfo.woodCount).toBe(heap.woodCount);
            expect(heapinfo.date).toBeDefined();
        });
        it("should update its heap info when encountering a heap encountered before");
    });
    it("should have most and least null by default", function () {
        expect(woodInfo.least()).toBeUndefined();
        expect(woodInfo.most()).toBeUndefined();
    });

    it("should have correct most and least woodHeaps when defining at least 2 different wood heaps", function() {
    });
    it("should have most and least undefined when only one heapInfo is defined");

    it("should not be enough info by default", function() {
        expect(woodInfo.isEnough()).toBe(false);
    });

    it("should be enough info with at least 2 heaps defined (least and most)");
});