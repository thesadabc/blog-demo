// mulity matrix
const dimensions = 512;
function createMatrix(dims, fn) {
    let matrix = [];
    for (let i = 0; i < dims; i++) {
        matrix[i] = [];
        for (let j = 0; j < dims; j++) {
            matrix[i][j] = fn(i, j);
        }
    }
    return matrix;
}

function getValue(ma, mb, x, y) {
    let sum = 0;
    for (let i = 0; i < dimensions; i++) {
        sum += ma[x][i] * mb[i][y];
    }
    return sum;
}

const matrixMultipyGPU = new GPU().createKernel(function(a, b) {
        return getValue(a, b, this.thread.y, this.thread.x);
    }).setOutput({ x: dimensions, y: dimensions })
    .setHardcodeConstants(true)
    .setConstants({ dimensions })
    .setLoopMaxIterations(1000)
    .setFunctions([getValue]);
const matrixMultipyCPU = function(a, b) {
    return createMatrix(dimensions, getValue.bind(null, a, b));
}

const randomMatrix = createMatrix(dimensions, () => Math.floor(Math.random() * 50));

console.log("dimensions", dimensions)
console.time("matrixMultipyGPU");
matrixMultipyGPU(randomMatrix, randomMatrix);
console.timeEnd("matrixMultipyGPU");

console.time("matrixMultipyCPU");
matrixMultipyCPU(randomMatrix, randomMatrix);
console.timeEnd("matrixMultipyCPU");



// // for native cl script
// const demo = new GPU().createKernel(function() {
//         fna(1.0)
//         fnb(1.0)
//     }).setOutput({ x: 16 })
//     .setFunctions([function fna(x) {
//         return 1.0 + fnb(123.0);
//     }, function fnb(a) {
//         return 1;
//     },])
//     // .addNativeFunction("fna", `float fna(float x) {
//     //     return 1.0;
//     // }`)
//     // .addNativeFunction("fnb", `float fnb(float x) {
//     //     return 1.0 + fna(1.0); // call the other function
//     // }`);

// console.log(demo());


// // // for native cl script
// // const demo = new GPU().createKernel(function() {
// //         return this.thread.x * 100 +  this.thread.y;
// //     }).setOutput({ x: 16, y: 16 });
// // console.log(demo())