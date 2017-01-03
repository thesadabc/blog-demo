var ch = new CH(document.getElementById("canvas"));

function startTest(randTransform, testNum) {
    testNum = testNum || 1000000;
    var groupNum = 100;

    var maxNum = 0;
    var retMap = {};

    for (var i = 0; i < testNum; i++) {
        var randRet = randTransform(Math.random());
        // var randRetGroup = Math.floor(randRet / (1 / groupNum)) / ( 1 / groupNum);
        var randRetGroup = Math.floor(randRet * groupNum + 1) / groupNum;
        retMap[randRetGroup] = (retMap[randRetGroup] || 0) + 1;
        maxNum = maxNum > retMap[randRetGroup] ? maxNum : retMap[randRetGroup];
    }
    console.log(retMap);
    Object.keys(retMap).forEach(function(x) {
        ch.point(x, retMap[x] / maxNum, "red");
    });
}

startTest(function(s) {
    return s * s;
});

// startTest(function(s) {
//     if(3 * s <1) return 1.5 * s;
//     return 0.75 * s + 0.25;
// })

// startTest(function(s) {
//     return Math.sqrt(2 * s);
// });
