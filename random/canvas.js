(function(exports) {

    var padding = 10;
    var width = 400;//window.innerWidth;
    var height = 400;//window.innerHeight;

    function tx(x) {
        var rw = width - padding * 2;
        return x * rw + padding;
    }

    function ty(y) {
        var rh = height - padding * 2;
        return rh - y * rh + padding;
    }

    function CH(canvas) {
        canvas.style.height = height;
        canvas.style.width = width;
        canvas.height = height;
        canvas.width = width;

        this.ctx = canvas.getContext("2d");
        this.ctx.beginPath();

        this.line(0, 0, 1, 0)
        this.line(0, 0, 0, 1)

        for (var i = 0, p = 0; i < 11; i++) {
            p = i * 0.1;
            this.line(p, -0.01, p, 0.01);
            this.line(-0.01, p, 0.01, p);
        }
        this.ctx.closePath();
        this.ctx.beginPath();
    }

    CH.prototype.point = function point(x, y, color) {
        this.line(x, 0, x, y, color);
        // x = tx(x);
        // y = ty(y);
        // this.ctx.fillStyle = "red";
        // this.ctx.moveTo(x, y);
        // this.ctx.arc(x, y, 2, 0, Math.PI * 2, 1);
        // this.ctx.fill();
    };
    CH.prototype.line = function(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color || "green";
        this.ctx.moveTo(tx(x1), ty(y1));
        this.ctx.lineTo(tx(x2), ty(y2));
        this.ctx.stroke();
    };

    exports.CH = CH;
})(this)
