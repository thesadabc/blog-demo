(function() {
    const doc = document.currentScript.ownerDocument;
    customElements.define("img-thumb", class extends HTMLElement {
        constructor() {
            super();

            this.container = doc.querySelector("template").content.cloneNode(true);
            this.iptImg = this.container.querySelector("#iptImg");
            this.imgPreview = this.container.querySelector("#imgPreview");

            this.attachShadow({ mode: "open" }).appendChild(this.container);

            this.iptImg.addEventListener("change", () => {
                const imgFile = this.iptImg.files[0];
                if (!imgFile) return;
                this.imgPreview.src = URL.createObjectURL(imgFile);
                this._selectFile = imgFile;
            });
            this.addEventListener("click", () => this.iptImg.click());
        }

        clear() {
            this.imgPreview.src = "";
            this.iptImg.value = "";
            this._selectFile = null;
        }

        getFile() {
            return this._selectFile;
        }
    });
})();
