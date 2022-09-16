#version 300 es

#define MAX_BLOBS 32
#define ENTRIES_PER_BLOB 2

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform sampler2D u_blobs;
uniform float u_smoothness;
uniform bool u_outlineMode;

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

float xyzF(float t) {
    return mix(pow(t, 1. / 3.), 7.787037 * t + 0.139731, step(t, 0.00885645));
}
float xyzR(float t) {
    return mix(t * t * t, 0.1284185 * (t - 0.139731), step(t, 0.20689655));
}
vec3 rgb2lch(in vec3 c) {
    //  vec3 wref =  vec3(.950456, 1.0, 1.089058);
    vec3 wref = vec3(1.0, 1.0, 1.0);

    c *= mat3(0.4124, 0.3576, 0.1805, 0.2126, 0.7152, 0.0722, 0.0193, 0.1192,
              0.9505);
    c.x = xyzF(c.x / wref.x);
    c.y = xyzF(c.y / wref.y);
    c.z = xyzF(c.z / wref.z);
    vec3 lab = vec3(max(0., 116.0 * c.y - 16.0), 500.0 * (c.x - c.y),
                    200.0 * (c.y - c.z));
    return vec3(lab.x, length(vec2(lab.y, lab.z)), atan(lab.z, lab.y));
}

vec3 lch2rgb(in vec3 c) {
    //  vec3 wref =  vec3(.950456, 1.0, 1.089058);
    vec3 wref = vec3(1.0, 1.0, 1.0);

    c = vec3(c.x, cos(c.z) * c.y, sin(c.z) * c.y);

    float lg = 1. / 116. * (c.x + 16.);
    vec3 xyz = vec3(wref.x * xyzR(lg + 0.002 * c.y), wref.y * xyzR(lg),
                    wref.z * xyzR(lg - 0.005 * c.z));

    vec3 rgb = xyz * mat3(3.2406, -1.5372, -0.4986, -0.9689, 1.8758, 0.0415,
                          0.0557, -0.2040, 1.0570);

    return rgb;
}

void main() {
    int blobCount =
        min(textureSize(u_blobs, 0).x / ENTRIES_PER_BLOB, MAX_BLOBS);

    float totalStrength = 0.;
    vec3 totalColor = vec3(0);

    float dist = 99999.0;

    for (int i = 0; i < blobCount; i++) {
        vec4 d1 = texelFetch(u_blobs, ivec2(i * ENTRIES_PER_BLOB, 0), 0);
        vec2 center = d1.xy;
        float radius = d1.z;
        vec3 color = rgb2lch(
            texelFetch(u_blobs, ivec2((i * ENTRIES_PER_BLOB) + 1, 0), 0).rgb);

        float sd = sdfCircle(center, radius);
        float strength = clamp(map(sd, 0., u_smoothness, 1., 0.), 0., 1.);
        totalStrength += strength;
        totalColor += color * strength;

        dist = opSmoothUnion(sd, dist, u_smoothness);
    }

    float result = smoothstep(0.0, 1.0, -dist);

    // super cool outline version:
    if (u_outlineMode) {
        outColor = vec4(
            mix(lch2rgb(totalColor / totalStrength), vec3(0, 0, 0), result), 1);
    } else {
        outColor = vec4(
            mix(vec3(0, 0, 0), lch2rgb(totalColor / totalStrength), result), 1);
    }
}
