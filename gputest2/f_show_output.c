#version 300 es

precision highp float;
precision highp int;

in vec2 v_pos;
out vec4 o_result;


void main() {
    float pos_x = v_pos.x;
    float pos_y = v_pos.y;

    float distance = sqrt(pos_x * pos_x + pos_y * pos_y);

    o_result = vec4(1, 0, 0, 1. - distance);
}
