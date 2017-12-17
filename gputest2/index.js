class GPUComputing {
    constructor(dimen, canvasSize) {
        this.dimen = dimen;
        this.canvas = document.createElement("canvas");
        this.canvas.width = canvasSize || dimen;
        this.canvas.height = canvasSize || dimen;
        this.gl = this.canvas.getContext("webgl2");
        this.program = this.gl.createProgram();
    }

    async init(vertexShader, fragmentShader) {
        const vshaderCode = await this.loadRes(vertexShader);
        let fshaderCode = await this.loadRes(fragmentShader);
        fshaderCode = fshaderCode.replace(/CANVAS_SIZE/g, this.dimen);

        this.initShader(vshaderCode, this.gl.VERTEX_SHADER);
        this.initShader(fshaderCode, this.gl.FRAGMENT_SHADER);

        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        let vecPosXArr = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vecPosXArr, this.gl.STATIC_DRAW);

        let posAtrLoc = this.getAttribLoc("g_pos");
        this.gl.enableVertexAttribArray(posAtrLoc);
        this.gl.vertexAttribPointer(posAtrLoc, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.clearColor(.0, .0, .0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    initShader(code, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
            throw new Error("compile: " + this.gl.getShaderInfoLog(shader));
        this.gl.attachShader(this.program, shader);
    }

    initTexture(index, tSampler, pixels) {
        const texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.dimen, this.dimen, 0,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels, 0);
        this.gl.uniform1i(this.getUniformLoc(tSampler), index);
    }

    initUniform(tUniform, value) {
        const uniLoc = this.getUniformLoc(tUniform);
        this.gl.uniform1fv(uniLoc, value);
    }

    getAttribLoc(name) {
        let loc = this.gl.getAttribLocation(this.program, name);
        if (loc == -1) throw `getAttribLoc  ${name} error`;
        return loc;
    }

    getUniformLoc(name) {
        let loc = this.gl.getUniformLocation(this.program, name);
        if (loc == null) throw `getUniformLoc ${name} err`;
        return loc;
    }

    async loadRes(file) {
        const resp = await fetch(file);
        return resp.text();
    }
    render(){
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    read() {
        let picBuf = new ArrayBuffer(this.dimen * this.dimen * 4);
        let picU8 = new Uint8Array(picBuf);
        let picU32 = new Uint32Array(picBuf);
        this.gl.readPixels(0, 0, this.dimen, this.dimen,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, picU8);
        return picU32
    }
}


// input by uniform
class MatrixUniform extends GPUComputing {
    /* 
        dimensions * dimensions <= 1024
        gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    */
    async init(matrixA, matrixB) {
        await super.init("v_shader.c", "f_matrix_uniform.c");
        this.initUniform("i_matrixA", new Float32Array(matrixA));
        this.initUniform("i_matrixB", new Float32Array(matrixB));
    }
}

// input by texture
class MatrixTexture extends GPUComputing {
    async init(matrixA, matrixB) {
        await super.init("v_shader.c", "f_matrix_texture.c");
        this.initTexture(0, "samplerA", matrixA)
        this.initTexture(1, "samplerB", matrixB)
    }
}

// draw whole texture to canvase
class ShowTexture extends GPUComputing {
    constructor(dimen, canvasSize) {
        super(dimen, canvasSize);
        document.body.appendChild(this.canvas);
    }
    async init(matrixA) {
        await super.init("v_shader.c", "f_show_texture.c");
        this.initTexture(0, "samplerA", matrixA)
    }
}


// set output by distance of (0, 0)
class ShowOutput extends GPUComputing {
    constructor(dimen, canvasSize) {
        super(dimen, canvasSize);
        document.body.appendChild(this.canvas);
    }
    async init() {
        await super.init("v_shader.c", "f_show_output.c");
    }
}


function createMatrix(dims, fn) {
    let matrix = new Uint32Array(dims * dims);
    for (let i = 0; i < dims; i++) {
        for (let j = 0; j < dims; j++) {
            matrix[i * dims + j] = fn(i, j);
        }
    }
    return matrix;
}


async function showOutput() {
    const demoShowOutput = window.demoShowOutput = new ShowOutput(3, 200);
    await demoShowOutput.init();
    demoShowOutput.render();
}

async function testTexture() {
    const colorMap = [
        [0xFF0000FF, 0x00FF00FF, 0x0000FFFF],
        [0xFFFF00FF, 0xFF00FFFF, 0x00FFFFFF],
        [0x000000FF, 0xFFFFFFFF, 0xF0F0F0FF],
    ];
    const randomMatrix = createMatrix(colorMap.length, (x, y) => colorMap[x][y]);
    const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);

    const demoShowTexture = window.demoShowTexture = new ShowTexture(colorMap.length, 200);
    await demoShowTexture.init(randomMatrixU8);
    demoShowTexture.render();
}


async function matrixJob(dimensions) {
    console.log("dimensions", dimensions);

    const randomMatrix = createMatrix(dimensions, () => Math.floor(Math.random() * 1000));
    const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);
    console.log("matrix input", randomMatrix);
    console.log("matrix input in Uint8Array", randomMatrixU8);
    let result = null;

    console.time("demoMatrixUniform");
    const demoMatrixUniform = window.demoMatrixUniform = new MatrixUniform(dimensions);
    await demoMatrixUniform.init(randomMatrix, randomMatrix);
    demoMatrixUniform.render();
    result = demoMatrixUniform.read();
    console.timeEnd("demoMatrixUniform");
    console.log("demoMatrixUniform output", result);


    console.time("demoMatrixTexture")
    const demoMatrixTexture = window.demoMatrixTexture = new MatrixTexture(dimensions);
    await demoMatrixTexture.init(randomMatrixU8, randomMatrixU8);
    demoMatrixTexture.render();
    result = demoMatrixTexture.read();
    console.timeEnd("demoMatrixTexture");
    console.log("demoMatrixTexture output", result);

    const matrixMultiplyCPU = function(ma, mb) {
        return createMatrix(dimensions, function(x, y) {
            let sum = 0;
            for (let i = 0; i < dimensions; i++) {
                sum += ma[x * dimensions + i] * mb[i * dimensions + y];
            }
            return sum;
        });
    }
    console.time("matrixMultiplyCPU");
    result = matrixMultiplyCPU(randomMatrix, randomMatrix);
    console.timeEnd("matrixMultiplyCPU");
    console.log("matrixMultiplyCPU output", result);
}


async function matrixCost(dimensions) {
    console.log("dimensions", dimensions);
    const randomMatrix = createMatrix(dimensions, () => Math.floor(Math.random() * 50));
    const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);

    const costdemoMatrixTexture = window.costdemoMatrixTexture = new MatrixTexture(dimensions);
    console.time("init");
    await costdemoMatrixTexture.init(randomMatrixU8, randomMatrixU8);
    console.timeEnd("init");
    console.time("render");
    costdemoMatrixTexture.render();
    console.timeEnd("render");
    console.time("read");
    costdemoMatrixTexture.read();
    console.timeEnd("read");
}

window.addEventListener("load", async function() {
    await showOutput();
    await testTexture();
    await matrixJob(3);

    // await matrixJob(128);
    // await matrixJob(256);
    // await matrixJob(512);
    // await matrixJob(1024);
    // await matrixJob(2048);

    // await matrixCost(128);
    // await matrixCost(256);
    // await matrixCost(512);
    // await matrixCost(1024);
    // await matrixCost(2048);
});