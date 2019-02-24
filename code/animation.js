
function hideElement(element, start) {

    setTimeout(function(){
        element.style.visibility = "hidden";
    }, start)
}

function fadeOut(element, start, duration) {

    setTimeout(function () {

        element.style.transition = 'none';
        element.style.opacity = 1;

        window.requestAnimationFrame(function () {
            element.style.transition = "opacity " + (duration / 1000) + "s";
            element.style.opacity = 0;
        })

    }, start);
}

function expandLeftToRight(element, from, to, start, duration) {

    setTimeout(function () {

        window.requestAnimationFrame(function () {

            element.style.transition = 'none';
            element.style.left = from + "%";
            element.style.width = (to - from) + "%";
            element.style['transform-origin'] = 'left';
            element.style.transform = "scaleX(0)";
            element.style.visibility = "visible";

            window.requestAnimationFrame(function () {
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "scaleX(1)";
            })

        })
    }, start);
}

function expandTopToBottom(element, from, to, start, duration) {

    setTimeout(function () {

        window.requestAnimationFrame(function () {

            element.style.transition = 'none';
            element.style.top = from + "%";
            element.style.height = (to - from) + "%";
            element.style['transform-origin'] = 'top';
            element.style.transform = "scaleY(0)";
            element.style.visibility = "visible";

            window.requestAnimationFrame(function () {
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "scaleY(1)";
            })

        })
    }, start);
}

function expandBottomToTop(element, from, to, start, duration) {

    setTimeout(function () {

        window.requestAnimationFrame(function () {

            element.style.transition = 'none';
            element.style.top = from + "%";
            element.style.height = (to - from) + "%";
            element.style['transform-origin'] = 'bottom';
            element.style.transform = "scaleY(0)";
            element.style.visibility = "visible";

            window.requestAnimationFrame(function () {
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "scaleY(1)";
            })

        })
    }, start);
}

function moveHorizontal(element, from, to, start, duration) {

    setTimeout(function(){

        var offset = from - to;
        var elementWidthAsPercentage = (element.offsetWidth / element.parentNode.offsetWidth) * 100;
        var percentage = (offset / elementWidthAsPercentage) * 100;

        window.requestAnimationFrame(function(){

            element.style.transition = 'none';
            element.style.left = to + "%";
            // note: translate percentage is relative to element's width
            element.style.transform = "translateX(" + percentage + "%)";
            element.style.visibility = "visible";

            window.requestAnimationFrame(function(){
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "translateX(0)";
            })

        })
    }, start);
}

function moveVertical(element, from, to, start, duration) {

    setTimeout(function(){

        var offset = from - to;
        var elementHeightAsPercentage = (element.offsetHeight / element.parentNode.offsetHeight) * 100;
        var percentage = (offset / elementHeightAsPercentage) * 100;

        window.requestAnimationFrame(function(){

            element.style.transition = 'none';
            element.style.top = to + "%";
            // note: translate percentage is relative to element's height
            element.style.transform = "translateY(" + percentage + "%)";
            element.style.visibility = "visible";

            window.requestAnimationFrame(function(){
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "translateY(0)";
            })

        })
    }, start);
}
