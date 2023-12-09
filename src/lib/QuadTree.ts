import AABB from "@/lib/geom/AABB";
import Circle from "@/lib/geom/Circle";
import { Vector2 } from "@/lib/geom/Vector2";

type Subdivisions<T> = [QuadTree<T>, QuadTree<T>, QuadTree<T>, QuadTree<T>];

export default class QuadTree<T> {
    static NODE_CAPACITY = 4;

    boundary: AABB;
    _items: (T | void)[] = [];
    _nextItemIndex = 0;
    _subdivisions: null | Subdivisions<T> = null;
    _getPosition: (item: T) => Vector2;

    constructor(boundary: AABB, getPosition: (item: T) => Vector2) {
        this.boundary = boundary;
        this._getPosition = getPosition;
    }

    // debugDraw(color: string) {
    //   this.boundary.debugDraw(color);
    //   if (this._subdivisions) {
    //     this._subdivisions.forEach(subdivision => subdivision.debugDraw(color));
    //   }
    // }

    insert(item: T): boolean {
        const point = this._getPosition(item);
        if (!this.boundary.contains(point)) return false;

        if (this._nextItemIndex < QuadTree.NODE_CAPACITY) {
            this._items[this._nextItemIndex] = item;
            this._nextItemIndex++;
            return true;
        }

        const subdivisions = this._getSubdivisions();

        if (subdivisions[0].insert(item)) return true;
        if (subdivisions[1].insert(item)) return true;
        if (subdivisions[2].insert(item)) return true;
        if (subdivisions[3].insert(item)) return true;

        throw new Error("Couldnt insert item");
    }

    remove(item: T): boolean {
        const point = this._getPosition(item);
        if (!this.boundary.contains(point)) return false;

        const index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._nextItemIndex--;
            return true;
        }

        const subdivisions = this._subdivisions;
        if (subdivisions) {
            if (subdivisions[0].remove(item)) return true;
            if (subdivisions[1].remove(item)) return true;
            if (subdivisions[2].remove(item)) return true;
            if (subdivisions[3].remove(item)) return true;
        }

        return false;
    }

    clear() {
        for (let i = 0; i < this._nextItemIndex; i++) {
            this._items[i] = undefined;
            this._nextItemIndex = 0;
        }

        if (this._subdivisions) {
            this._subdivisions.forEach((subdivision) => subdivision.clear());
        }
    }

    findItemsInRect(rect: AABB): T[] {
        const foundItems = [] as T[];

        if (!this.boundary.intersects(rect)) return foundItems;

        for (let i = 0; i < this._nextItemIndex; i++) {
            const item = this._items[i];
            if (item == null) continue;
            const point = this._getPosition(item);
            if (rect.contains(point)) foundItems.push(item);
        }

        const subdivisions = this._subdivisions;
        if (!subdivisions) return foundItems;

        if (subdivisions[0].boundary.intersects(rect)) {
            foundItems.push(...subdivisions[0].findItemsInRect(rect));
        }
        if (subdivisions[1].boundary.intersects(rect)) {
            foundItems.push(...subdivisions[1].findItemsInRect(rect));
        }
        if (subdivisions[2].boundary.intersects(rect)) {
            foundItems.push(...subdivisions[2].findItemsInRect(rect));
        }
        if (subdivisions[3].boundary.intersects(rect)) {
            foundItems.push(...subdivisions[3].findItemsInRect(rect));
        }

        return foundItems;
    }

    findItemsInCircle(circle: Circle): T[] {
        return this.findItemsInRect(circle.getBoundingBox()).filter((item) =>
            circle.containsPoint(this._getPosition(item)),
        );
    }

    _getSubdivisions(): Subdivisions<T> {
        if (this._subdivisions) return this._subdivisions;

        const center = this.boundary.getCenter();
        const subdivisions: Subdivisions<T> = [
            new QuadTree(
                AABB.fromLeftTopRightBottom(
                    this.boundary.left,
                    this.boundary.top,
                    center.x,
                    center.y,
                ),
                this._getPosition,
            ),
            new QuadTree(
                AABB.fromLeftTopRightBottom(
                    center.x,
                    this.boundary.top,
                    this.boundary.right,
                    center.y,
                ),
                this._getPosition,
            ),
            new QuadTree(
                AABB.fromLeftTopRightBottom(
                    this.boundary.left,
                    center.y,
                    center.x,
                    this.boundary.bottom,
                ),
                this._getPosition,
            ),
            new QuadTree(
                AABB.fromLeftTopRightBottom(
                    center.x,
                    center.y,
                    this.boundary.right,
                    this.boundary.bottom,
                ),
                this._getPosition,
            ),
        ];

        this._subdivisions = subdivisions;
        return subdivisions;
    }
}
