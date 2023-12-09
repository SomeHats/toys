import { PickByValue } from "utility-types";

export function glEnum<
    Name extends keyof PickByValue<typeof WebGL2RenderingContext, number>,
>(name: Name) {
    return WebGL2RenderingContext[name];
}

export enum GlShaderType {
    Fragment = "FRAGMENT_SHADER",
    Vertex = "VERTEX_SHADER",
}

export enum GlBufferUsage {
    StaticDraw = "STATIC_DRAW",
    DynamicDraw = "DYNAMIC_DRAW",
    StreamDraw = "STREAM_DRAW",
    StaticRead = "STATIC_READ",
    DynamicRead = "DYNAMIC_READ",
    StreamRead = "STREAM_READ",
    StaticCopy = "STATIC_COPY",
    DynamicCopy = "DYNAMIC_COPY",
    StreamCopy = "STREAM_COPY",
}

export enum GlVertexAttribType {
    Byte = "BYTE",
    UnsignedByte = "UNSIGNED_BYTE",
    Short = "SHORT",
    UnsignedShort = "UNSIGNED_SHORT",
    Float = "FLOAT",
    HalfFloat = "HALF_FLOAT",
}

export enum GlPixelFormat {
    Rgb = "RGB",
    Rgba = "RGBA",
    LuminanceAlpha = "LUMINANCE_ALPHA",
    Luminance = "LUMINANCE",
    Alpha = "ALPHA",
    Red = "RED",
    RedInteger = "RED_INTEGER",
    Rg = "RG",
    RgInteger = "RG_INTEGER",
    RgbInteger = "RGB_INTEGER",
    RgbaInteger = "RGBA_INTEGER",
}

export enum GlPixelType {
    UnsignedByte = "UNSIGNED_BYTE",
    UnsignedShort565 = "UNSIGNED_SHORT_5_6_5",
    UnsignedShort4444 = "UNSIGNED_SHORT_4_4_4_4",
    UnsignedShort5551 = "UNSIGNED_SHORT_5_5_5_1",
    HalfFloat = "HALF_FLOAT",
    Float = "FLOAT",
    UnsignedInt10f11f11fRev = "UNSIGNED_INT_10F_11F_11F_REV",
    UnsignedInt2101010Rev = "UNSIGNED_INT_2_10_10_10_REV",
}

export enum GlTextureInternalFormat {
    Rgb = "RGB",
    Rgba = "RGBA",
    LuminanceAlpha = "LUMINANCE_ALPHA",
    Luminance = "LUMINANCE",
    Alpha = "ALPHA",
    R8 = "R8",
    R16f = "R16F",
    R32f = "R32F",
    R8ui = "R8UI",
    Rg8 = "RG8",
    Rg16f = "RG16F",
    Rg32f = "RG32F",
    Rg8ui = "RG8UI",
    Rgb8 = "RGB8",
    Srgb8 = "SRGB8",
    Rgb565 = "RGB565",
    R11fG11fB10f = "R11F_G11F_B10F",
    Rgb9E5 = "RGB9_E5",
    Rgb16f = "RGB16F",
    Rgb32f = "RGB32F",
    Rgb8ui = "RGB8UI",
    Rgba8 = "RGBA8",
    Srgb8Alpha8 = "SRGB8_ALPHA8",
    Rgb5A1 = "RGB5_A1",
    Rgb10A2 = "RGB10_A2",
    Rgba4 = "RGBA4",
    Rgba16f = "RGBA16F",
    Rgba32f = "RGBA32F",
    Rgba8ui = "RGBA8UI",
}

export interface GlPixelFormatByInternalFormat {
    [GlTextureInternalFormat.Rgb]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgba]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.LuminanceAlpha]: GlPixelFormat.LuminanceAlpha;
    [GlTextureInternalFormat.Luminance]: GlPixelFormat.Luminance;
    [GlTextureInternalFormat.Alpha]: GlPixelFormat.Alpha;
    [GlTextureInternalFormat.R8]: GlPixelFormat.Red;
    [GlTextureInternalFormat.R16f]: GlPixelFormat.Red;
    [GlTextureInternalFormat.R32f]: GlPixelFormat.Red;
    [GlTextureInternalFormat.R8ui]: GlPixelFormat.RedInteger;
    [GlTextureInternalFormat.Rg8]: GlPixelFormat.Rg;
    [GlTextureInternalFormat.Rg16f]: GlPixelFormat.Rg;
    [GlTextureInternalFormat.Rg32f]: GlPixelFormat.Rg;
    [GlTextureInternalFormat.Rg8ui]: GlPixelFormat.RgInteger;
    [GlTextureInternalFormat.Rgb8]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Srgb8]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgb565]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.R11fG11fB10f]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgb9E5]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgb16f]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgb32f]: GlPixelFormat.Rgb;
    [GlTextureInternalFormat.Rgb8ui]: GlPixelFormat.RgbInteger;
    [GlTextureInternalFormat.Rgba8]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Srgb8Alpha8]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgb5A1]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgb10A2]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgba4]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgba16f]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgba32f]: GlPixelFormat.Rgba;
    [GlTextureInternalFormat.Rgba8ui]: GlPixelFormat.RgbaInteger;
}

export interface GlPixelTypeByInternalFormat {
    [GlTextureInternalFormat.Rgb]:
        | GlPixelType.UnsignedByte
        | GlPixelType.UnsignedShort565;
    [GlTextureInternalFormat.Rgba]:
        | GlPixelType.UnsignedByte
        | GlPixelType.UnsignedShort4444
        | GlPixelType.UnsignedShort5551;
    [GlTextureInternalFormat.LuminanceAlpha]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Luminance]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Alpha]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.R8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.R16f]: GlPixelType.HalfFloat | GlPixelType.Float;
    [GlTextureInternalFormat.R32f]: GlPixelType.Float;
    [GlTextureInternalFormat.R8ui]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rg8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rg16f]: GlPixelType.HalfFloat | GlPixelType.Float;
    [GlTextureInternalFormat.Rg32f]: GlPixelType.Float;
    [GlTextureInternalFormat.Rg8ui]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rgb8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Srgb8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rgb565]:
        | GlPixelType.UnsignedByte
        | GlPixelType.UnsignedShort565;
    [GlTextureInternalFormat.R11fG11fB10f]:
        | GlPixelType.UnsignedInt10f11f11fRev
        | GlPixelType.HalfFloat
        | GlPixelType.Float;
    [GlTextureInternalFormat.Rgb9E5]: GlPixelType.HalfFloat | GlPixelType.Float;
    [GlTextureInternalFormat.Rgb16f]: GlPixelType.HalfFloat | GlPixelType.Float;
    [GlTextureInternalFormat.Rgb32f]: GlPixelType.Float;
    [GlTextureInternalFormat.Rgb8ui]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rgba8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Srgb8Alpha8]: GlPixelType.UnsignedByte;
    [GlTextureInternalFormat.Rgb5A1]:
        | GlPixelType.UnsignedByte
        | GlPixelType.UnsignedShort5551;
    [GlTextureInternalFormat.Rgb10A2]: GlPixelType.UnsignedInt2101010Rev;
    [GlTextureInternalFormat.Rgba4]:
        | GlPixelType.UnsignedByte
        | GlPixelType.UnsignedShort4444;
    [GlTextureInternalFormat.Rgba16f]:
        | GlPixelType.HalfFloat
        | GlPixelType.Float;
    [GlTextureInternalFormat.Rgba32f]: GlPixelType.Float;
    [GlTextureInternalFormat.Rgba8ui]: GlPixelType.UnsignedByte;
}

export type GlTextureFormat = {
    [InternalFormat in GlTextureInternalFormat]: {
        internalFormat: InternalFormat;
        pixelFormat: GlPixelFormatByInternalFormat[InternalFormat];
        pixelType: GlPixelTypeByInternalFormat[InternalFormat];
    };
}[GlTextureInternalFormat];

export enum GlTextureFilter {
    Linear = "LINEAR",
    Nearest = "NEAREST",
    NearestMipmapNearest = "NEAREST_MIPMAP_NEAREST",
    LinearMipmapNearest = "LINEAR_MIPMAP_NEAREST",
    NearestMipmapLinear = "NEAREST_MIPMAP_LINEAR",
    LinearMipmapLinear = "LINEAR_MIPMAP_LINEAR",
}

export enum GlTextureWrap {
    Repeat = "REPEAT",
    ClampToEdge = "CLAMP_TO_EDGE",
    MirroredRepeat = "MIRRORED_REPEAT",
}

export enum GlCapability {
    Blend = "BLEND",
    CullFace = "CULL_FACE",
    DepthTest = "DEPTH_TEST",
    Dither = "DITHER",
    PolygonOffsetFill = "POLYGON_OFFSET_FILL",
    SampleAlphaToCoverage = "SAMPLE_ALPHA_TO_COVERAGE",
    SampleCoverage = "SAMPLE_COVERAGE",
    ScissorTest = "SCISSOR_TEST",
    StencilTest = "STENCIL_TEST",
    RasterizerDiscard = "RASTERIZER_DISCARD",
}
