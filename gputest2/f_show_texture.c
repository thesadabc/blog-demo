#version 300 es

precision highp float;
precision highp int;

in vec2 v_pos;
uniform sampler2D samplerA;

out vec4 o_result;

vec4 reverse(const vec4 v){
    return v.abgr;
}

void main() {
    vec4 color = texture(samplerA, v_pos);
    o_result = reverse(color);
}
