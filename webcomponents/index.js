window.addEventListener("load", function() {
    const btnSubmit = document.querySelector(".btn-submit");
    const btnClear = document.querySelector(".btn-clear");
    const imgList = Array.from(document.querySelectorAll(".item-image"));

    btnClear.addEventListener("click", () => imgList.forEach(l => l.clear()));
    btnSubmit.addEventListener("click", () => console.log(imgList.map(l => l.getFile()).filter(f => f)));
});
