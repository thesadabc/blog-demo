window.addEventListener('load', function() {
    let video = document.getElementById('video');

    document.getElementById('btnStart').addEventListener("click", function() {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.src = URL.createObjectURL(stream);
            video.play();
        });
    })
});
