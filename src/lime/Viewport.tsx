import { Vector2 } from "@/lib/geom/Vector2";
import { memo, reactive } from "@/lib/signia";
import {
    LIME_SIDEBAR_WIDTH_PX,
    LIME_SLIDE_PADDING_PX,
    LIME_SLIDE_SIZE_PX,
} from "@/lime/LimeConfig";

export class Viewport {
    @reactive accessor screenSize = Vector2.ZERO;

    @memo get canvasOffset() {
        return new Vector2(LIME_SIDEBAR_WIDTH_PX, 0);
    }

    @memo get canvasSize() {
        return this.screenSize.sub(this.canvasOffset);
    }

    @memo get availableCanvasSize() {
        return this.canvasSize.sub(LIME_SLIDE_PADDING_PX.mul(2));
    }

    @memo get scaleFactor() {
        return Math.min(
            this.availableCanvasSize.x / LIME_SLIDE_SIZE_PX.x,
            this.availableCanvasSize.y / LIME_SLIDE_SIZE_PX.y,
        );
    }

    @memo get slideSize() {
        return LIME_SLIDE_SIZE_PX.scale(this.scaleFactor);
    }

    @memo get slideOffset() {
        return new Vector2(
            Math.max(
                LIME_SLIDE_PADDING_PX.x,
                (this.canvasSize.x - this.slideSize.x) / 2,
            ),
            Math.max(
                LIME_SLIDE_PADDING_PX.y,
                (this.canvasSize.y - this.slideSize.y) / 2,
            ),
        );
    }

    screenToSlide(screenCoords: Vector2) {
        return screenCoords
            .sub(this.canvasOffset)
            .sub(this.slideOffset)
            .div(this.scaleFactor);
    }

    slideToScreen(slideCoords: Vector2) {
        return slideCoords
            .mul(this.scaleFactor)
            .add(this.slideOffset)
            .add(this.canvasOffset);
    }
}
