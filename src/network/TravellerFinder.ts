// @flow
import Scene from "@/lib/scene/Scene";
import SceneSystem from "@/lib/scene/SceneSystem";
import QuadTree from "@/lib/QuadTree";
import Circle from "@/lib/geom/Circle";
import AABB from "@/lib/geom/AABB";
import Traveller from "@/network/Traveller";

export default class TravellerFinder extends SceneSystem {
    static override systemName = "TravellerFinder";

    _quadTree!: QuadTree<Traveller>;

    removeTraveller(traveller: Traveller) {
        this._quadTree.remove(traveller);
    }

    override afterAddToScene(scene: Scene) {
        super.afterAddToScene(scene);
        this._quadTree = new QuadTree(
            AABB.fromLeftTopRightBottom(0, 0, scene.width, scene.height),
            (traveller) => traveller.position,
        );
    }

    override beforeUpdate() {
        const scene = this.getScene();
        this._quadTree.clear();
        scene.children.forEach((child) => {
            if (child instanceof Traveller) {
                this._quadTree.insert(child);
            }
        });
        // this._quadTree.debugDraw('red');
    }

    findTravellersInCircle(circle: Circle) {
        return this._quadTree.findItemsInCircle(circle);
    }
}
