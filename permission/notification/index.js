let log = console.log.bind(console);

window.addEventListener("load", function() {

    // check permission
    navigator.permissions.query({ name: "notifications" }).then(({ state }) => {
        return ({
                "granted": Promise.resolve("granted"),
                "denied": Promise.resolve("denied"),
                // request the permission
                "default": Notification.requestPermission()
        })[state]
    }).then((state) => {
        if (state !== "granted") return Promise.reject("notice denied!");

        /***********************************
         * notice from browser
         ***********************************/
        document.getElementById("btnNotice").addEventListener("click", function() {
            // Notification constructor is only for in browser
            const notice = new Notification("you has a new notice", {
                body: "this is notice " + Date.now(),
                tag: "tag" + Date.now(),
                image: "./W3C.svg",
                icon: "./w3c_home.png",
            });
            notice.addEventListener("click", function(e) {
                log("onclick: " + e.target.tag)
            });
            notice.addEventListener("error", function(e) {
                log(e);
            });
            notice.addEventListener("show", function(e) {
                log("onshow: " + e.target.tag)
            });
            notice.addEventListener("close", function(e) {
                log("onclose: " + e.target.tag)
            });
        });


        /***********************************
         * notice from service worker
         ***********************************/
        navigator.serviceWorker.register("./worker.js");
        document.getElementById("btnNoticeWoker").addEventListener("click", function() {
            navigator.serviceWorker.ready.then((swRegister) => {
                const now = Date();
                swRegister.showNotification("you has a new notice", {
                    body: "this is notice from worker" + now,
                    tag: "worktag" + now,
                    image: "./W3C.svg",
                    icon: "./w3c_home.png",

                    // actions is only for service worker
                    actions: [{
                        action: "action1",
                        title: "actionTitle1",
                        icon: "./act1.jpg"
                    }, {
                        action: "action2",
                        title: "actionTitle2",
                        icon: "./act1.jpg"
                    }]
                }).then(() => {
                    return swRegister.getNotifications({ tag: "worktag" + now })
                }).then((noticeList) => {
                    log(noticeList);
                });
            });
        });


    }).catch(err => log(err.toString()));
});
