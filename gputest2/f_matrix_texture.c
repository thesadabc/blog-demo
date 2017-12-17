#version 300 es

precision highp float;
precision highp int;

const int U_LENGTH = CANVAS_SIZE;
const float U_TEXTURE_POS_FIX = .5 / float(U_LENGTH);

in vec2 v_pos;
uniform sampler2D samplerA;
uniform sampler2D samplerB;

out vec4 o_result;

vec4 int2rgba(const int i) {
    vec4 v4;
    v4.r = float(i >> 24 & 0xFF) / 255.;
    v4.g = float(i >> 16 & 0xFF) / 255.;
    v4.b = float(i >>  8 & 0xFF) / 255.;
    v4.a = float(i >>  0 & 0xFF) / 255.;
    return v4;
}


int rgba2int(const vec4 v) {
    int r = int(v.r * 255.) << 24;
    int g = int(v.g * 255.) << 16;
    int b = int(v.b * 255.) << 8;
    int a = int(v.a * 255.) << 0;
    return r + g + b + a;
}

vec4 reverse(const vec4 v){
    return v.abgr;
}

int getMaxtrixValue(const sampler2D sampler, const float x, const float y){
    vec4 pixel = texture(sampler, vec2(x, y));
    return rgba2int(reverse(pixel));
}

void main() {
    int sum = 0;
    float textPos = 0.0;
    for (int i = 0; i < U_LENGTH; i++) {
        textPos = U_TEXTURE_POS_FIX + float(i) / float(U_LENGTH);
        sum += getMaxtrixValue(samplerA, v_pos.x, textPos) * getMaxtrixValue(samplerB, textPos, v_pos.y);
    }
    o_result = reverse(int2rgba(sum));
}
