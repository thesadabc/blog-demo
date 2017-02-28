window.addEventListener("load", function() {

    navigator.permissions.query({ name: "background-sync" }).then(({ state }) => {

        // always be grand
        if (state === "denied") return Promise.reject("background-sync denied");

        let proRegister = null;
        document.getElementById("btnSend").addEventListener("click", function() {
            proRegister = proRegister || navigator.serviceWorker.register("./worker.js");

            proRegister.then((swRegister) => {
                return swRegister.sync.register("send-chats");
            });
        });

    });
});
