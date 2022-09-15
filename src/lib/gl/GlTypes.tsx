export enum GlShaderType {
    Fragment = WebGL2RenderingContext.FRAGMENT_SHADER,
    Vertex = WebGL2RenderingContext.VERTEX_SHADER,
}

export enum GlBufferUsage {
    StaticDraw = WebGL2RenderingContext.STATIC_DRAW,
    DynamicDraw = WebGL2RenderingContext.DYNAMIC_DRAW,
    StreamDraw = WebGL2RenderingContext.STREAM_DRAW,
    StaticRead = WebGL2RenderingContext.STATIC_READ,
    DynamicRead = WebGL2RenderingContext.DYNAMIC_READ,
    StreamRead = WebGL2RenderingContext.STREAM_READ,
    StaticCopy = WebGL2RenderingContext.STATIC_COPY,
    DynamicCopy = WebGL2RenderingContext.DYNAMIC_COPY,
    StreamCopy = WebGL2RenderingContext.STREAM_COPY,
}

export enum GlVertexAttribType {
    Byte = WebGL2RenderingContext.BYTE,
    Short = WebGL2RenderingContext.SHORT,
    UnsignedByte = WebGL2RenderingContext.UNSIGNED_BYTE,
    UnsignedShort = WebGL2RenderingContext.UNSIGNED_SHORT,
    Float = WebGL2RenderingContext.FLOAT,
    HalfFloat = WebGL2RenderingContext.HALF_FLOAT,
}
