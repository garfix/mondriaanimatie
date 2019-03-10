
function createInstructionsFromStyleElementConfiguration(config) {

    // create a set of instructions
    let instructions = [];
    let doubleLinesCount = 0;
    let doubleLinesSpec = random(1, 5);

    // each painting has at least a horizontal and a vertical line
    if (config["double-lines"] && doubleLinesSpec <= 3) {
        instructions.push('double-horizontal-line');
        doubleLinesCount++;
    } else {
        instructions.push('horizontal-line');
    }
    if (config["double-lines"] && doubleLinesSpec >= 3) {
        instructions.push('double-vertical-line');
        doubleLinesCount++;
    } else {
        instructions.push('vertical-line');
    }

    // create up to 11 lines total
    // grid: much more lines
    let minLineCount = config['grid'] ? 12 : 0;
    let maxLineCount = config['grid'] ? 23 : 9;
    let lineInstructions = getLineInstructions(random(minLineCount, maxLineCount - doubleLinesCount));
    instructions = instructions.concat(lineInstructions);

    // add the standard hor and vert lines
    lineCount = lineInstructions.length + 2;

    // mix required lines with optional lines
    if (doubleLinesCount === 0) {
        shuffleArray(instructions);
    }

    // add up to 5 planes between the lines, somewhere at the end
    // grid: just 1 plane
    let maxPlaneCount = config['grid'] ? 1 : 5;
    let planeInstructions = getPlaneInstructions(maxPlaneCount);
    instructions = instructions.concat(planeInstructions);

    // a minimum of lines is present in paintings with steps
    if (lineCount >= 8) {
        // add steps in up to 2 rooms
        let maxStepsCount = config['grid'] ? 0 : 5;
        let stepsCount = random(0, maxStepsCount);
        for (let i = 0; i < stepsCount; i++) {
            instructions.push('steps');
        }
    }

    return instructions;
}

function getLineInstructions(n) {
    let instructions = [];
    let lineCount = random(0, n);
    for (let i = 0; i < lineCount; i++) {
        let r = random(1, 2);
        if (r === 1) {
            instructions.push('horizontal-line');
        } else {
            instructions.push('vertical-line');
        }
    }
    return instructions;
}

function getPlaneInstructions(n) {
    let instructions = [];
    let planeCount = random(0, n);
    for (let i = 0; i < planeCount; i++) {
        let position = random(Math.max(0, instructions.length - 2), instructions.length);
        instructions.splice(position, 0, 'plane');
    }
    return instructions;
}
