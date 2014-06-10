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

    beforeEach(function () {
        jasmine.Clock.useMock();
    });

    describe("initialization", function () {
        it("should create a gridInfo", function() {
            expect(gridInfo).toBeDefined();
        });

        it("should have 9 nodes initialized", function () {
            expect(gridInfo.nodes.length).toBe(3);
            expect(gridInfo.nodes[0].length).toBe(3);
        });

        it("should have the first node with good values", function () {
            var firstNode = gridInfo.nodes[0][0];
            expect(firstNode.type).toBe(0);
            expect(firstNode.x).toBe(0);
            expect(firstNode.y).toBe(0);
            var middlePosition = firstNode.data.middlePosition;
            expect(middlePosition.y).toBe(2);
            expect(middlePosition.x).toBe(2);
        });
    });

    describe("getNodeMiddlePosition", function () {
        it("should have the middle position of the first node", function () {
            var position = gridInfo.getNodeMiddlePosition(0, 0);
            expect(position.x).toBe(2);
            expect(position.y).toBe(2);
        });

        it("sould have the position of the second node", function () {
            var position = gridInfo.getNodeMiddlePosition(1, 0);
            expect(position.x).toBe(6);
            expect(position.y).toBe(2);
        });
    });

    describe("updateHeap", function () {
        it("should update its info from one heap which takes one node", function () {
            var nodeAffected = gridInfo.nodes[0][0];
            var dateBefore = nodeAffected.data.date;
            var heap = {
                woodCount: 1,
                x: 1,
                y: 1
            };

            setTimeout(function () {
                gridInfo.updateHeap(heap);
                expect(nodeAffected.type).toBe(1);
                expect(nodeAffected.data.date).toBeGreaterThan(dateBefore);
            }, 100);

            jasmine.Clock.tick(101);
        });
    });

    describe("getNodesAffectedByHeap", function () {
        it("should have only the first node affected", function () {
            var heap = {
                woodCount: 1,
                x: 1,
                y: 1
            };
            var nodes = gridInfo.getNodesAffectedByHeap(heap);
            expect(nodes.length).toBe(1);
            expect(nodes[0].x).toBe(0);
            expect(nodes[0].y).toBe(0);
        });

        it("should have more than one node affected", function () {
            //node[1][1]
            var heap = {
                woodCount: 5,
                x: 6,
                y: 6
            };
            var nodes = gridInfo.getNodesAffectedByHeap(heap);
            expect(nodes.length).toBe(9);
        });
    });
});