import Component from './Component';
import Entity from './Entity';

export default class SortOrderProvider extends Component {
  constructor(
    entity: Entity,
    private getSortOrderFn: (entity: Entity) => number,
  ) {
    super(entity);
  }

  getSortOrder(): number {
    return this.getSortOrderFn(this.entity);
  }
}
