#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform sampler2D u_blobs;
uniform float u_smoothness;

in vec2 screenPosition;

// we need to declare an output for the fragment shader
out vec4 outColor;

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float sdfCircle(vec2 center, float radius) {
    return length(center - screenPosition) - radius;
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

void main() {
    int blobCount = textureSize(u_blobs, 0).x;

    float dist = 99999.0;
    for (int i = 0; i < blobCount; i++) {
        vec4 data = texelFetch(u_blobs, ivec2(i, 0), 0);
        vec2 center = data.xy;
        float radius = data.z;

        float sd = sdfCircle(center, radius);
        dist = opSmoothUnion(sd, dist, u_smoothness);
    }

    float result = smoothstep(0.0, 1.0, -dist);
    outColor = vec4(result, 0, 0, 1);
}
