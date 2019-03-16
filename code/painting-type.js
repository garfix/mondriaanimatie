
let styleElementConfigurations = [];

const paintingTypes = [
    "sparse",
    "new-york",
    "crowded",
    "sparse-colored",
];

const defaultStyleConfig = {
    "thick-lines": false,
    "double-lines": false,
    "white-lines": false,
    "tape": false,
};

function createRandomFrame() {

    if (styleElementConfigurations.length === 0) {
        styleElementConfigurations = buildStyleElementConfigurations();
    }

    let styleElementConfiguration = styleElementConfigurations.shift();

//console.log(styleElementConfiguration);

    let instructions = createInstructionsFromStyleElementConfiguration(styleElementConfiguration);

    return createFrameFromInstructions(instructions, styleElementConfiguration);
}

function buildStyleElementConfigurations() {

    let configs = [];

    for (let i = 0 ; i < paintingTypes.length; i++) {

        let paintingType = paintingTypes[i];

        // config with just style element X
        let config = Object.assign({}, defaultStyleConfig);

        if (paintingType !== "plain") {
            config.paintingType = paintingType;
        }

        configs.push(config);

        // pick 3 random other style elements
        let others1 = removeFromArray(Object.keys(defaultStyleConfig), paintingType);
        shuffleArray(others1);
        others1 = others1.slice(0, 3);

        // create a random order to remove these elements
        let others2 = others1.slice(0);
        shuffleArray(others2);

        let others1Length = others1.length;
        let others2Length = others2.length;

        for (let j = 0; j < others1Length; j++) {
            config = Object.assign({}, config);
            config[others1.pop()] = true;
            configs.push(config);
        }

        for (let j = 0; j < others2Length; j++) {
            config = Object.assign({}, config);
            config[others2.pop()] = false;
            configs.push(config);
        }

        config = Object.assign({}, defaultStyleConfig);
        if (i % 2 === 0) {
            config.paintingType = "thin-grid";
        } else {
            config.paintingType = "boogie-woogie";
        }
        configs.push(config);

    }

    return configs;
}
