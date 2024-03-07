import { Gestureland } from "@/gestureland/Gestureland";
import { Stroke } from "@/gestureland/GesturelandStore";
import { GLTarget } from "@/gestureland/types";

export function drawOnCanvas(editor: Gestureland): GLTarget {
    return {
        id: "draw on canvas",
        index: -Infinity,
        distanceTo() {
            return 0;
        },
        onDrag(start) {
            const shape = Stroke.create({});
            editor.store.put1(shape);

            return {
                onUpdate(event) {
                    editor.store.update(shape.id, (s) => ({
                        ...s,
                        points: [...s.points, event.pagePosition.toJson()],
                    }));
                },
                onCancel() {
                    editor.store.delete(shape.id);
                },
            };
        },
    };
}

export function interactWithShapes(editor: Gestureland): GLTarget[] {
    return editor.shapes.map((initialShape) => ({
        id: `drag shape ${initialShape.id}`,
        index: 1,
        distanceTo(testPoint) {
            return Math.min(
                ...initialShape.points.map((p) => testPoint.distanceTo(p)),
            );
        },
        onDrag(start) {
            return {
                onUpdate(event) {
                    const delta = event.pagePosition.sub(start.pagePosition);
                    editor.store.update(initialShape.id, (s) => ({
                        ...s,
                        points: initialShape.points.map((p) =>
                            delta.add(p).toJson(),
                        ),
                    }));
                },
                onCancel(event) {
                    editor.store.update(initialShape.id, (s) => ({
                        ...s,
                        points: initialShape.points,
                    }));
                },
            };
        },
    }));
}
