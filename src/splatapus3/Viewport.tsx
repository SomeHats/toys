import { Vector2 } from "@/lib/geom/Vector2";
import { reactive } from "@/lib/signia";
import { Splat } from "@/splatapus3/model/Splat";

export class Viewport {
    constructor(readonly splat: Splat) {}

    @reactive accessor screenSize = Vector2.ZERO;

    get pan() {
        return this.splat.location.position;
    }
    set pan(newPan: Vector2) {
        this.splat.updateLocation({ position: newPan });
    }

    get zoom() {
        return this.splat.location.zoom;
    }
    set zoom(newZoom: number) {
        this.splat.updateLocation({ zoom: newZoom });
    }
}
