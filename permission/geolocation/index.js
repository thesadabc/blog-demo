function log(...strs) {
    if (strs.length > 1) return strs.map((s) => log(s));
    str = strs[0];
    if (typeof(str) === "object")
        str = JSON.stringify(str, null, 4);
    document.getElementById("log").innerHTML += (str + "\n");
}

window.addEventListener('load', function() {


    document.getElementById("btnGeo").addEventListener("click", function() {
        log("requesting");

        navigator.permissions.query({ name: "geolocation" }).then(({ state }) => {

            if (state === "denied") return Promise.reject("geolocation denied");

            navigator.geolocation.getCurrentPosition(
                ({
                    coords: {
                        accuracy,
                        latitude,
                        longitude,
                        altitude,
                        altitudeAccuracy,
                        heading,
                        speed
                    },
                    timestamp
                }) => {
                    log("succceed", {
                        coords: {
                            accuracy,
                            latitude,
                            longitude,
                            altitude,
                            altitudeAccuracy,
                            heading,
                            speed
                        },
                        timestamp
                    });
                }, ({ code, message }) => {
                    log("failed", { code, message });
                });
        }).catch(err => log(err.toString()));;




    });
});
