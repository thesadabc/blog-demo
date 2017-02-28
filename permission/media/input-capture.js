window.addEventListener('load', function() {
    const imgPreview = document.getElementById('preview');
    const iptCapture = document.getElementById('input');
    let preSrc = null;

    iptCapture.addEventListener("change", function() {
        preSrc = URL.createObjectURL(iptCapture.files[0]);
        imgPreview.setAttribute("src", preSrc);
    });

    imgPreview.addEventListener("load", function imgPreviewOnLoad(e) {
        if (preSrc) URL.revokeObjectURL(preSrc);
        preSrc = null;
    });
});
