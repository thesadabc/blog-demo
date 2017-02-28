window.addEventListener("load", function() {
    let btn = document.getElementById("btn");
    let video = document.getElementById("video");

    let streamTrack = null;
    btn.addEventListener("click", function() {
        if (!streamTrack) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                video.src = URL.createObjectURL(stream);
                video.play();

                streamTrack = stream.getVideoTracks()[0];
            	btn.innerHTML = "stop";
            });
        } else {
            streamTrack.stop();
            streamTrack = null;
            btn.innerHTML = "start";
        }
    })
});
