
function hideElement(element, start) {

    setTimeout(function(){

        element.style.display = 'none';
    }, start)
}

function expandLeftToRight(element, from, to, start, duration) {

    setTimeout(function () {

        window.requestAnimationFrame(function () {
            element.style.left = from + "%";
            element.style.width = (to - from) + "%";
            element.style['transform-origin'] = 'left';
            element.style.transform = "scaleX(0)";
            element.style.display = "";

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
            element.style.top = from + "%";
            element.style.height = (to - from) + "%";
            element.style['transform-origin'] = 'top';
            element.style.transform = "scaleY(0)";
            element.style.display = "";

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
            element.style.top = from + "%";
            element.style.height = (to - from) + "%";
            element.style['transform-origin'] = 'bottom';
            element.style.transform = "scaleY(0)";
            element.style.display = "";

            window.requestAnimationFrame(function () {
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "scaleY(1)";
            })

        })
    }, start);
}

function moveHorizontal(element, from, to, start, duration) {

    setTimeout(function(){

        window.requestAnimationFrame(function(){

            element.style.left = to + "%";
            element.style.transform = "translateX(" + (from - to) + "%)";
            element.style.display = "";

            window.requestAnimationFrame(function(){
                element.style.transition = "transform " + (duration / 1000) + "s";
                element.style.transform = "translateX(0)";
            })

        })
    }, start);
}
