describe("A Grid Info", function() {
    var gridInfo, gridInfo2;
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

    beforeEach(function () {
        gridInfo = new GridInfo(options);
        gridInfo2 = new GridInfo(options);
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
            expect(firstNode.type).toBe(1);
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

        it("should have the position of the second node", function () {
            var position = gridInfo.getNodeMiddlePosition(1, 0);
            expect(position.x).toBe(6);
            expect(position.y).toBe(2);
        });
    });

    describe("updateHeap", function () {
        it("should update its info from one heap which takes one node", function () {
            var nodeAffected = gridInfo.nodes[0][0];
            var dateBefore = nodeAffected.data.date;
            //mock date
            dateBefore = new Date(2010);
            var heap = createHeap(1, 1, 1);

            gridInfo.updateHeap(heap);
            expect(nodeAffected.type).toBe(0);
            expect(nodeAffected.data.date).toBeGreaterThan(dateBefore);
        });

        it("should update its info from a heap which take more nodes", function() {
            var heap = createHeap(6, 6, 5);
            gridInfo.updateHeap(heap);
            expect(gridInfo.nodes[0][0].type).toBe(0);
            expect(gridInfo.nodes[0][1].type).toBe(0);
            expect(gridInfo.nodes[1][1].type).toBe(0); //etc.
        });
    });

    describe("getNodesAffectedByHeap", function () {
        it("should have only the first node affected", function () {
            var heap = createHeap(1, 1, 1);
            var nodes = gridInfo.getNodesAffectedByHeap(heap);
            expect(nodes.length).toBe(1);
            expect(nodes[0].x).toBe(0);
            expect(nodes[0].y).toBe(0);
        });

        it("should have more than one node affected", function () {
            //node[1][1]
            var heap = createHeap(6, 6, 5);
            var nodes = gridInfo.getNodesAffectedByHeap(heap);
            expect(nodes.length).toBe(9);
        });
    });

    describe("getNbNodesAffectedAround", function () {
        it("should have only one node affected", function () {
            var heap = createHeap(1, 1, 1);
            var nbNodesAffected = gridInfo.getNbNodesAffectedAround(heap, gridInfo.nodeSize.width);
            expect(nbNodesAffected).toBe(0);
        });

        it("should have 1 node affected around", function () {
            var heap = createHeap(6, 6, 5);
            var nbNodesAffected = gridInfo.getNbNodesAffectedAround(heap, gridInfo.nodeSize.width);
            expect(nbNodesAffected).toBe(1);
        });
    });

    describe("getNode", function () {
        it("should get the first node", function () {
            var node = gridInfo.getNode(0, 0);
            expect(node.x).toBe(0);
            expect(node.y).toBe(0);
        });

        it("should get the node in the middle", function () {
            var node = gridInfo.getNode(5, 7);
            expect(node.x).toBe(1);
            expect(node.y).toBe(1);
        });
    });

    describe("update", function () {
        it("should update to more recent info", function () {
            gridInfo2.nodes[0][0].type = 0;
            //Mock date
            gridInfo2.nodes[0][0].data.date = new Date(2015, 10, 10);
            gridInfo.update(gridInfo2);
            expect(gridInfo.nodes[0][0].type).toBe(0);
            expect(gridInfo.nodes[0][0].data.date).toBe(gridInfo2.nodes[0][0].data.date);
        });
    });

    describe("search", function () {
        it("should find a path next to it, one node to traverse", function () {
            var nodes = gridInfo.search({x: 0, y: 0}, {x: 1, y:0});
            expect(nodes.length).toBe(1);
            expect(nodes[0].x).toBe(1);
        });

        it("should find a path within walls", function () {
            gridInfo.nodes[1][0].type = 0;
            gridInfo.nodes[1][1].type = 0;
            var nodes = gridInfo.search({x: 0, y: 0}, {x: 2, y:0});
            expect(nodes.length).toBe(4);
            expect(nodes[0].x).toBe(0);
            expect(nodes[0].y).toBe(1);
        });
    });

    describe("getCenterPositions", function () {
        it("should get the centers of two nodes", function () {
            var nodes = [
                {x: 0, y: 0},
                {x: 2, y: 2}
            ];
            var centers = gridInfo.getCenterPositions(nodes);
            expect(centers.length).toBe(2);
            expect(centers[0].x).toBe(2);
            expect(centers[0].y).toBe(2);
            expect(centers[1].x).toBe(10);
            expect(centers[1].y).toBe(10);
        });
    });

    describe("updateWoodTaken", function () {
        it("should have the same nodes affected");
    });

    describe("updateWall");
});

function createHeap(x, y, woodCount) {
    return {
        woodCount: woodCount,
        x: x,
        y: y,
        getRadius: function() {
            return this.woodCount;
        }
    };
}