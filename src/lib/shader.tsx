export type ScalarGlslTypeName = "bool" | "int" | "uint" | "float" | "double";
interface JsTypeByScalarGlslTypeName {
    bool: boolean;
    int: number;
    uint: number;
    float: number;
    double: number;
}
export interface ScalarGlslType {
    readonly type: "scalar";
    readonly name: ScalarGlslTypeName;
}

export interface BoolGlslType { readonly type: "scalar"; readonly name: "bool" }
export interface IntGlslType { readonly type: "scalar"; readonly name: "int" }
export interface UintGlslType { readonly type: "scalar"; readonly name: "uint" }
export interface FloatGlslType { readonly type: "scalar"; readonly name: "float" }
export interface DoubleGlslType {
    readonly type: "scalar";
    readonly name: "double";
}

export type GlslType = ScalarGlslType;

export type GlslTypeToJsType<T extends ScalarGlslType> =
    JsTypeByScalarGlslTypeName[T["name"]];

export abstract class GlslExpressionBase<_Type extends GlslType> {}

export class GlslScalar<
    Type extends ScalarGlslType,
> extends GlslExpressionBase<Type> {
    constructor(readonly value: GlslTypeToJsType<Type>) {
        super();
    }
}

export const Glsl = {
    bool: (value: boolean) => new GlslScalar<BoolGlslType>(value),
    int: (value: number) => new GlslScalar<IntGlslType>(value),
    uint: (value: number) => new GlslScalar<UintGlslType>(value),
    float: (value: number) => new GlslScalar<FloatGlslType>(value),
    double: (value: number) => new GlslScalar<DoubleGlslType>(value),
};
