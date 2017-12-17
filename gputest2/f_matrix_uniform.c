#version 300 es

precision highp float;
precision highp int;

const int U_LENGTH = CANVAS_SIZE;

uniform float i_matrixA[U_LENGTH * U_LENGTH];
uniform float i_matrixB[U_LENGTH * U_LENGTH];

in vec2 v_pos;
out vec4 o_result;

vec4 int2rgba(const int i) {
    vec4 v4;
    v4.r = float(i >> 24 & 0xFF) / 255.;
    v4.g = float(i >> 16 & 0xFF) / 255.;
    v4.b = float(i >>  8 & 0xFF) / 255.;
    v4.a = float(i >>  0 & 0xFF) / 255.;
    return v4;
}

vec4 reverse(const vec4 v){
    return v.abgr;
}

int getValue(float matrix[U_LENGTH * U_LENGTH], int x, int y){
    return int(matrix[int(U_LENGTH) * x + y]);
}

void main() {
    // readPixels读取数值时次序与数组不一致, 
    int curX = int(float(U_LENGTH) * v_pos.y);
    int curY = int(float(U_LENGTH) * v_pos.x);

    int sum = 0;
    for (int i = 0; i < U_LENGTH; i++) {
        sum += getValue(i_matrixA, curX, i) * getValue(i_matrixB, i, curY);
    }

    o_result = reverse(int2rgba(sum));
}
