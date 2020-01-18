import { sample } from '../lib/utils';
import Road from './Road';
import ConnectionDirection from './ConnectionDirection';

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
        throw new Error(`unknow connection direction ${direction}`);
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
