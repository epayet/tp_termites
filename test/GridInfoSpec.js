describe("A Grid Info", function() {
    var gridInfo;

    beforeEach(function () {
        var options = {
            worldSize: {
                width: 12,
                height: 12
            },
            nodeSize: {
                width: 4,
                height: 4
            }
        };
        gridInfo = new GridInfo(options);
    });

    it("should create a gridInfo", function() {
        expect(gridInfo).toBeDefined();
    });

    it("should have 9 nodes initialized", function () {
        expect(gridInfo.nodes.length).toBe(3);
        expect(gridInfo.nodes[0].length).toBe(3);
    });

    it("should update its info from one heap which takes one node", function () {
        var heap = {
            identifier: 1,
            woodCount: 1,
            x: 1,
            y: 1
        };
        gridInfo.updateHeap(heap);
    });
});