import { times } from "@/lib/utils";
import { TextGrid } from "@/txdraw/TextGrid";
import { resizeBox } from "@/txdraw/utils/resizeBox";
import {
    getTexelSize,
    pxToTxHeight,
    pxToTxWidth,
    snapPxHeightToTexel,
    snapPxWidthToTexel,
    txToPxHeight,
    txToPxWidth,
} from "@/txdraw/utils/texel";
import {
    BoxModel,
    Geometry2d,
    RecordProps,
    Rectangle2d,
    ShapeUtil,
    T,
    TLBaseShape,
    TLResizeInfo,
} from "tldraw";

export type TxBoxShape = TLBaseShape<
    "tx-box",
    {
        wTx: number;
        hTx: number;
        text: string;
    }
>;

export class TxBoxShapeUtil extends ShapeUtil<TxBoxShape> {
    static override type = "tx-box" as const;
    static override props: RecordProps<TxBoxShape> = {
        wTx: T.positiveInteger,
        hTx: T.positiveInteger,
        text: T.string,
    };

    getDefaultProps(): TxBoxShape["props"] {
        return {
            wTx: 10,
            hTx: 10,
            text: "",
        };
    }

    override hideRotateHandle(_shape: TxBoxShape): boolean {
        return true;
    }

    override canResize() {
        return true;
    }

    getGeometry(shape: TxBoxShape): Geometry2d {
        const size = getTexelSize(this.editor);
        return new Rectangle2d({
            x: size.x / 2,
            y: size.y / 2,
            width: txToPxWidth(this.editor, shape.props.wTx) - size.x,
            height: txToPxHeight(this.editor, shape.props.hTx) - size.y,
            isFilled: false,
        });
    }

    override onResize(shape: any, info: TLResizeInfo<any>) {
        const texelSize = getTexelSize(this.editor);
        const originalPxBox: BoxModel = {
            x: shape.x,
            y: shape.y,
            w: txToPxWidth(this.editor, shape.props.wTx),
            h: txToPxHeight(this.editor, shape.props.hTx),
        };
        const newPxBox = resizeBox(originalPxBox, info, {
            minWidth: texelSize.x * 2,
            minHeight: texelSize.y * 2,
        });

        return {
            ...shape,
            x: snapPxWidthToTexel(this.editor, newPxBox.x),
            y: snapPxHeightToTexel(this.editor, newPxBox.y),
            props: {
                ...shape.props,
                wTx: pxToTxWidth(this.editor, newPxBox.w),
                hTx: pxToTxHeight(this.editor, newPxBox.h),
            },
        };
    }

    override component(shape: TxBoxShape): React.ReactNode {
        return null;
        const lastX = shape.props.wTx - 1;
        const lastY = shape.props.hTx - 1;
        return (
            <pre className="tx-mono">
                {times(shape.props.hTx, (y) =>
                    times(shape.props.wTx, (x) =>
                        x === 0 && y === 0 ? "┏"
                        : x === lastX && y === 0 ? "┓"
                        : x === 0 && y === lastY ? "┗"
                        : x === lastX && y === lastY ? "┛"
                        : x === 0 ? "┃"
                        : x === lastX ? "┃"
                        : y === 0 ? "━"
                        : y === lastY ? "━"
                        : " ",
                    ).join(""),
                ).join("\n")}
            </pre>
        );
    }

    override renderText(shape: TxBoxShape): TextGrid {
        return new TextGrid().box(0, 0, shape.props.wTx, shape.props.hTx);
    }

    override indicator(shape: TxBoxShape): React.ReactNode {
        const size = getTexelSize(this.editor);
        return (
            <rect
                x={size.x / 2}
                y={size.y / 2}
                width={txToPxWidth(this.editor, shape.props.wTx) - size.x}
                height={txToPxHeight(this.editor, shape.props.hTx) - size.y}
            />
        );
    }
}
