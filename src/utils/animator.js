export default class Animator {

    constructor() {

    }

    animateBackground(x1, x2, x3, shape, receipt) {

        var start = null;
    
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start;
    
            var myprog =  1 / (1 + Math.exp(-(progress - 250) / (250 / 6)));
    
            var pt1 = x1[0] + (x1[1] - x1[0]) * myprog;
            var pt2 = x2[0] + (x2[1] - x2[0]) * myprog;
            var pt3 = x3[0] + (x3[1] - x3[0]) * myprog;
    
            if (x1[0] < x1[1]) {
                if (pt1 > x1[1]) {
                    pt1 = x1[1];
                }
                if (pt2 > x2[1]) {
                    pt2 = x2[1];
                }
                if (pt3 > x3[1]) {
                    pt3 = x3[1];
                }
            }
    
            if (x1[0] < x1[1]) {
                receipt.style.opacity = 1 - myprog;
            }
            else {
                receipt.style.opacity = myprog;
            }
    
            shape.setAttribute(
                "points", pt1 + "," + 0 + " " + 1037 / 1920 * window.innerWidth + "," + 0 + " " + 1037 / 1920 * window.innerWidth + "," + window.innerHeight + " " +
                pt2 + "," + window.innerHeight + " " + pt3 + "," + 777 / 1080 * window.innerHeight
            );
            if (progress < 500) {
                window.requestAnimationFrame(step);
            }
        }
    
        window.requestAnimationFrame(step);

    }

}