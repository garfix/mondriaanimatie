
let devMode = false;

let tearDownAnimationIndex = 0;
let state = "running";
let stateChangeListeners = [];
let nextFrameTimer = null;
let tearDownAnimationTimer = null;

function start(borderEementId, stateElementId, nameElementId) {

    let border = document.getElementById(borderEementId);
    let stateButton = document.getElementById(stateElementId);
    let nameElement = document.getElementById(nameElementId);

    stateButton.focus();

    // button: toggle state
    stateButton.onclick = function() { processStateButtonClick() };

    // resize: resize border size in pixels
    window.onresize = function(){ resize(border) };

    // back, forward browser buttons
    window.onpopstate = function() { setTimeout(function () {

        let frame = loadFrameFromLocation(document.location.href);
        if (frame) {
            setState("paused");
            animateFrame(border, frame, true, nameElement);
        }
    })};

    // state change actions
    stateChangeListeners.push(function(newState){
        if (newState === "running") {
            animateRandomFrame(border, nameElement);
            stateButton.classList.remove("play");
        } else {
            stopExistingAnimation();
            stateButton.classList.add("play")
        }
    });

    // left, right, space buttons
    document.addEventListener("keydown", function (event) {
        let key = event.key;

        if (key === "ArrowLeft") {
            history.go(-1);
        } else if (key === "ArrowRight") {
            history.go(1);
        } else if (key === " ") {
            processStateButtonClick();
            event.preventDefault();
        }
    });

    resize(border);

    // get frame from url
    let frame = loadFrameFromLocation(window.location.href);

    if (frame) {
        setState("paused");
        animateFrame(border, frame, true, nameElement);
    } else {
        animateRandomFrame(border, nameElement);
    }
}

function processStateButtonClick() {
    if (state === "running") {
        setState("paused");
    } else {
        setState("running");
    }
}

function setState(newState) {

    if (state === newState) {
        return;
    }

    state = newState;

    for (let i = 0; i < stateChangeListeners.length; i++) {
        stateChangeListeners[i](state);
    }
}

function loadFrameFromLocation(location) {

    let frame = null;

    let matches = location.match(/\?frame=(.*)/);
    if (matches && typeof matches[1] !== "undefined") {
        let encodedFrame = matches[1];
        frame = urlDecodeFrame(encodedFrame);
    }

    return frame;
}

function resize(border) {
    let minSize = Math.min(window.outerWidth, window.innerHeight) - 40;

    border.style.width = minSize + 'px';
    border.style.height = minSize + 'px';
}

function animateRandomFrame(border, nameElement) {

    // create a new frame
    let frame = createRandomFrame();

    // update url
    let urlEncodedFrame = urlEncodeFrame(frame);
    history.pushState(null, window.location.pathname, "?frame=" + urlEncodedFrame);

    animateFrame(border, frame, false, nameElement);
}

function stopExistingAnimation() {
    if (nextFrameTimer) {
        clearTimeout(nextFrameTimer);
    }
    if (tearDownAnimationTimer) {
        clearTimeout(tearDownAnimationTimer);
    }
}

function getTitle(frame) {

    let title = "Composition";

    switch (frame.paintingType) {
        case 'thin-grid':
            title = "Grid";
            break;
        case 'sparse-colored':
            title = "Colored lines composition";
            break;
        case 'crowded':
            title = "Crowded composition";
            break;
        case 'new-york':
            title = "New York composition";
            break;
        case 'boogie-woogie':
            title = "Boogie woogie composition";
            break;
    }

    title += " in M";

    return title;
}

function animateFrame(border, frame, singleFrame, nameElement) {

    let title = getTitle(frame);

    document.title = title;
    nameElement.innerHTML = title;

    // remove old canvas
    border.innerHTML = "";

    // stop any scheduled frames
    stopExistingAnimation();

    // create new canvas
    let canvas = createRectangle('canvas');

    border.appendChild(canvas);

    // select the animation
    let tearDownAnimation = tearDownAnimations[tearDownAnimationIndex](canvas, frame);

    tearDownAnimationIndex = (tearDownAnimationIndex === tearDownAnimations.length - 1) ? 0 : tearDownAnimationIndex + 1;

    let elementDuration = singleFrame ? 50 : 500;
    let holdDuration = 3000;
    let buildDuration = (frame.all.length * elementDuration);
    let interFrameDuration = 1000;
    let tearDownAnimationDuration = tearDownAnimation.duration;
    let fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;

    // dev mode
    if (devMode) {
         elementDuration = 100;
         holdDuration = 500;
         buildDuration = (frame.all.length * elementDuration);
         interFrameDuration = 100;
         tearDownAnimationDuration = 500;
         fullDuration = buildDuration + holdDuration + tearDownAnimationDuration + interFrameDuration;
    }

    // painting frame size
    if (frame.paintingType === "thin-grid") {
        border.style.transform = "scaleY(0.75)";
    } else {
        border.style.transform = "none";
    }

    // draw the picture on the canvas
    let lookup = draw(canvas, frame, elementDuration);

    if (singleFrame) {
        return;
    }

    tearDownAnimationTimer = setTimeout(function () {
        tearDownAnimation(lookup);
    }, buildDuration + holdDuration);

    nextFrameTimer = setTimeout(function () {
        animateRandomFrame(border, nameElement);
    }, fullDuration);
}
