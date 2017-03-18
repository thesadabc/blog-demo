root.iptImg = root.querySelector(".iptImg");
root.imgPreview = root.querySelector(".imgPreview");

root.iptImg.addEventListener("change", () => {
    const imgFile = root.iptImg.files[0];
    if (!imgFile) return;
    root.imgPreview.src = URL.createObjectURL(imgFile);
    root._selectFile = imgFile;
});
root.addEventListener("click", () => root.iptImg.click());

root.clear = function() {
    root.imgPreview.src = "";
    root.iptImg.value = "";
    root._selectFile = null;
}

root.getFile = function() {
    return root._selectFile;
}