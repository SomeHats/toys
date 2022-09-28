// @flow
import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { uniq, flatten } from "@/lib/utils";
import ConnectionSet from "@/network/ConnectionSet";
import ConnectionDirection from "@/network/ConnectionDirection";
import PathFinder from "@/network/PathFinder";
import Road from "@/network/Road";
import Traveller from "@/network/Traveller";
import { NetworkNode } from "@/network/networkNodes/NetworkNode";

export default class Intersection implements NetworkNode {
    isDestination = false;
    position: Vector2;
    _connectionSet: ConnectionSet = new ConnectionSet();

    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
    }

    get incomingConnections(): ReadonlyArray<Road> {
        return this._connectionSet.incoming;
    }

    get outgoingConnections(): ReadonlyArray<Road> {
        return this._connectionSet.outgoing;
    }

    get canConsumeTraveller(): boolean {
        return true;
    }

    consumeTraveller(traveller: Traveller) {
        const destination = traveller.destination;
        assert(destination, "traveller must have destination");

        const nextRoad = PathFinder.getNextRoad(this, destination);
        assert(
            this.outgoingConnections.includes(nextRoad),
            "nextRoad must be from this intersection",
        );

        traveller.removeFromCurrentRoad();
        nextRoad.addTravellerAtStart(traveller);
    }

    getAllReachableNodes(visited: Set<NetworkNode> = new Set()): NetworkNode[] {
        visited.add(this);
        return uniq(
            flatten(this._connectionSet.outgoing.map((road) => road.getAllReachableNodes(visited))),
        );
    }

    getVisualConnectionPointAtAngle(): Vector2 {
        return this.position;
    }

    getClosestOutgoingTraveller(): Traveller | null {
        let bestTraveller = null;
        let shortestDistance = Infinity;
        this.outgoingConnections.forEach((road) => {
            const traveller = road.getTravellerAfterPosition(-1);
            if (traveller && traveller.positionOnCurrentRoad < shortestDistance) {
                bestTraveller = traveller;
                shortestDistance = traveller.positionOnCurrentRoad;
            }
        });

        return bestTraveller;
    }

    getClosestIncomingTraveller(): Traveller | null {
        let bestTraveller = null;
        let shortestDistance = Infinity;
        this.incomingConnections.forEach((road) => {
            const traveller = road.getTravellerBeforePosition(road.length);
            if (traveller && traveller.distanceToEndOfCurrentRoad < shortestDistance) {
                bestTraveller = traveller;
                shortestDistance = traveller.distanceToEndOfCurrentRoad;
            }
        });

        return bestTraveller;
    }

    connectTo(node: Road, direction: ConnectionDirection) {
        this._connectionSet.add(node, direction);
    }
}
