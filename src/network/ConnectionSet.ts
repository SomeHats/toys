import { exhaustiveSwitchError, sample } from "@/lib/utils";
import ConnectionDirection from "@/network/ConnectionDirection";
import Road from "@/network/Road";

export default class ConnectionSet {
    incoming: Road[] = [];
    outgoing: Road[] = [];

    add(target: Road, direction: ConnectionDirection) {
        switch (direction) {
            case ConnectionDirection.IN:
                this.addIncoming(target);
                break;
            case ConnectionDirection.OUT:
                this.addOutgoing(target);
                break;
            default:
                exhaustiveSwitchError(direction);
        }
    }

    addIncoming(target: Road) {
        this.incoming.push(target);
    }

    addOutgoing(target: Road) {
        this.outgoing.push(target);
    }

    sampleIncoming(): Road {
        return sample(this.incoming);
    }

    sampleOutgoing(): Road {
        return sample(this.outgoing);
    }
}
