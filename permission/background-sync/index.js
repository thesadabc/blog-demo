window.addEventListener("load", function() {

    navigator.permissions.query({ name: "background-sync" }).then(({ state }) => {

        // always be grand
        if (state === "denied") return Promise.reject("background-sync denied");

        navigator.serviceWorker.register("./worker.js");
        document.getElementById("btnSend").addEventListener("click", function() {
            navigator.serviceWorker.ready.then((swRegister) => {
                return swRegister.sync.register("send-chats");
            });
        });

    });
});
