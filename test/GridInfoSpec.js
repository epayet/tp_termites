describe("A Grid Info", function() {
    it("should create a gridInfo", function() {
        var options = {
            worldSize: {
                width: 10,
                height: 10
            },
            nodeSize: {
                width: 4,
                height: 4
            }
        };
        var grid = new GridInfo(options);
        expect(grid).toBeDefined();
    });
});