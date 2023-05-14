import { assert, assertExists } from "@/lib/assert";
import { Gl } from "@/lib/gl/Gl";
import { GlTextureFilter, GlTextureFormat, GlTextureWrap, glEnum } from "@/lib/gl/GlTypes";

export type GlTexture2dData = {
    readonly data: ArrayBufferView;
    readonly width: number;
    readonly height: number;
};

export type GlTextureParams = {
    /** Texture magnification filter */
    magFilter: GlTextureFilter.Nearest | GlTextureFilter.Linear;
    /** Texture minification filter */
    minFilter: GlTextureFilter;
    /** Wrapping function for texture coordinate s */
    wrapS: GlTextureWrap;
    /** Wrapping function for texture coordinate t */
    wrapT: GlTextureWrap;
};

export class GlTexture2d {
    readonly level: number;
    readonly texture: WebGLTexture;
    data: GlTexture2dData | null = null;

    constructor(
        readonly gl: Gl,
        readonly textureUnit: number,
        readonly format: GlTextureFormat,
        level?: number,
    ) {
        this.level = level ?? 0;
        this.texture = assertExists(gl.gl.createTexture());
    }

    set(data: GlTexture2dData) {
        this.data = data;
    }

    bind() {
        const { gl } = this.gl;
        gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    configure(params: Partial<GlTextureParams>) {
        const { gl } = this.gl;
        this.bind();
        if (params.magFilter)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glEnum(params.magFilter));
        if (params.minFilter)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glEnum(params.minFilter));
        if (params.wrapS) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glEnum(params.wrapS));
        if (params.wrapT) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glEnum(params.wrapT));
    }

    configureForData() {
        this.configure({
            magFilter: GlTextureFilter.Nearest,
            minFilter: GlTextureFilter.Nearest,
            wrapS: GlTextureWrap.ClampToEdge,
            wrapT: GlTextureWrap.ClampToEdge,
        });
    }

    upload() {
        assert(this.data, "data must be set on texture to upload");
        this.bind();
        this.gl.gl.texImage2D(
            WebGL2RenderingContext.TEXTURE_2D,
            this.level,
            glEnum(this.format.internalFormat),
            this.data.width,
            this.data.height,
            0, // border
            glEnum(this.format.pixelFormat),
            glEnum(this.format.pixelType),
            this.data.data,
        );
    }

    update(data: GlTexture2dData) {
        this.set(data);
        this.upload();
    }
}
