#version 300 es

precision highp float;
precision highp int;

in vec4 g_pos;
out vec2 v_pos;

void main() {
    float curX = (g_pos.x + 1.) / 2.;
    float curY = (g_pos.y + 1.) / 2.;
    v_pos = vec2(curX, curY);
    
    gl_Position = g_pos;
}
