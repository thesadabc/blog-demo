(function() {
    const doc = document.currentScript.ownerDocument;
    customElements.define("list-box", class extends HTMLElement {
        constructor() {
            super();
            const container = doc.querySelector("template").content.cloneNode(true);
            this.attachShadow({ mode: "open" }).appendChild(container);
        }
    });
})()
