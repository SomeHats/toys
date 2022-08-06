import Component from "@/lib/scene/Component";
import Entity from "@/lib/scene/Entity";

export default class SortOrderProvider extends Component {
    constructor(entity: Entity, private getSortOrderFn: (entity: Entity) => number) {
        super(entity);
    }

    getSortOrder(): number {
        return this.getSortOrderFn(this.entity);
    }
}
