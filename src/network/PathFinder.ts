// @flow
import { assert } from "@/lib/assert";
import Road from "@/network/Road";
import { NetworkNode } from "@/network/networkNodes/NetworkNode";

const PathFinder = {
    getNextRoad(initialNode: NetworkNode, destinationNode: NetworkNode): Road {
        const remainingNodes = new Set(initialNode.getAllReachableNodes());
        remainingNodes.add(initialNode);
        assert(remainingNodes.has(destinationNode), "destination must be reachable");
        const bestCosts = new Map();
        const prevRoads = new Map();

        bestCosts.set(initialNode, 0);

        while (remainingNodes.size) {
            const { node, cost } = PathFinder._nodeWithShortestDistance(remainingNodes, bestCosts);
            remainingNodes.delete(node);

            if (node === destinationNode) {
                return PathFinder._nextRoadFromRoute(prevRoads, initialNode, destinationNode);
            }

            PathFinder._updateNeighbours(node, bestCosts, cost, prevRoads);
        }

        throw new Error("unreachable i hope");
    },

    _nodeWithShortestDistance(
        nodes: Set<NetworkNode>,
        costs: Map<NetworkNode, number>,
    ): { node: NetworkNode; cost: number } {
        let bestCost = Infinity;
        let bestNode = null;

        nodes.forEach((node) => {
            const cost = costs.get(node);
            if (cost != null && cost <= bestCost) {
                bestCost = cost;
                bestNode = node;
            }
        });

        assert(bestNode, "node must be found");
        return { node: bestNode, cost: bestCost };
    },
    _updateNeighbours(
        node: NetworkNode,
        bestCosts: Map<NetworkNode, number>,
        cost: number,
        prevRoads: Map<NetworkNode, Road>,
    ) {
        node.outgoingConnections.forEach((road) => {
            const nextNode = road.to;
            const nextNodeCost = bestCosts.get(nextNode);
            const altNextNodeCost = cost + road.expectedTimeFromStartToEnd;
            if (nextNodeCost == null || altNextNodeCost <= nextNodeCost) {
                bestCosts.set(nextNode, altNextNodeCost);
                prevRoads.set(nextNode, road);
            }
        });
    },
    _nextRoadFromRoute(
        prevRoads: Map<NetworkNode, Road>,
        start: NetworkNode,
        finish: NetworkNode,
    ): Road {
        let node = finish;
        while (prevRoads.has(node)) {
            const road = prevRoads.get(node);
            assert(road, "road must exist");
            node = road.from;
            if (node === start) return road;
        }

        throw new Error("prev road must be found");
    },
};

export default PathFinder;
