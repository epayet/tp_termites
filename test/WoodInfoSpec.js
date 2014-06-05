describe("A WoodInfo", function () {
    var woodInfo;

    beforeEach(function () {
        woodInfo = new WoodInfo();
    });

    it("should create a WoodInfo", function () {
        expect(woodInfo).toBeDefined();
    });

    it("should update its info when encountering another woodInfo more recent");
    it("should not update its info when encountering another woodInfo less recent");

    it("should add heap info when encountering a heap for the first time");
    it("should update its heap info when encountering a heap encountered before");
    it("should not add heap info when the heap encountered has no wood");

    it("should have most and least null by default", function () {
        expect(woodInfo.least()).toBeUndefined();
        expect(woodInfo.most()).toBeUndefined();
    });

    it("should have correct most and least woodHeaps when defining at least 2 different wood heaps", function() {
        //woodInfo.updateLeastAndMost
    });
    it("should have most and least undefined when only one heapInfo is defined");

    it("should not be enough info by default", function() {
        expect(woodInfo.isEnough()).toBe(false);
    });

    it("should be enough info with at least 2 heaps defined (least and most)");

    //addHeapInfo
    //updateHeapInfo
    //heapDeleted
    //contains(heap)
    //isHeapInfoUpToDate
    //getHeapInfo
});