
function createFrameFromInstructions(instructions, config) {

    const defaultLineThickness = 2;

    let frame = {
        all: [],
        backgroundColor: "none"
    };

    // default room: entire canvas
    let rooms = [
        { left: 0, right: 100, top: 0, bottom: 100, color: 'none' }
    ];

    let minimumLineDistance = 6;
    let planeColors = [];
    let colorVariations = ['none', 'darker', 'lighter'];
    let lines = [];

    shuffleArray(planeColors);
    shuffleArray(colorVariations);

    // add grey background
    if (config["white-lines"]) {
        frame.backgroundColor = "grey";
    }

    // add frame borders
    lines.push({ type: 'line', orientation: 'horizontal', pos: 0, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'horizontal', pos: 100, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'vertical', pos: 0, start: 0, end: 100, width: 0, color: 'none'});
    lines.push({ type: 'line', orientation: 'vertical', pos: 100, start: 0, end: 100, width: 0, color: 'none'});

    // the thickness of lines
    let horizontalLineThickness = defaultLineThickness;
    let verticalLineThickness = defaultLineThickness;
    // one in five paintings uses thicker horizontal lines
    if (config["thick-lines"]) {
        horizontalLineThickness = pickFromArray([3, 3.5, 4]);
    }

    let useTape = config['tape'];

    for (let i = 0; i < instructions.length; i++) {

        let instruction = instructions[i];

        let lineColor = "black";

        if (config["colored-lines"]) {
            lineColor = pickFromArray(["yellow", "yellow", "red", "red", "blue", "blue", "black"]);
        }
        if (config["white-lines"]) {
            if (i === 0) {
                lineColor = "white";
            } else {
                lineColor = pickFromArray([lineColor, "white", "white"]);
            }
        }

        if (instruction === 'double-horizontal-line') {
            let line = createLine(lines, 'horizontal', minimumLineDistance, defaultLineThickness, lineColor, useTape);
            if (line) {
                line.start = 0; line.end = 100;
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);

                let secondLine = Object.assign({}, line);
                secondLine.pos += line.pos < 90 ? (2 * defaultLineThickness) : (-2 * defaultLineThickness);
                lines.push(secondLine);
                frame.all.push(secondLine);
                rooms = updateRooms(rooms, secondLine);
            }

        } else if (instruction === 'double-vertical-line') {
            let line = createLine(lines, 'vertical', minimumLineDistance, defaultLineThickness, lineColor, useTape);
            if (line) {
                line.start = 0;
                line.end = 100;
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);

                let secondLine = Object.assign({}, line);
                secondLine.pos += line.pos < 90 ? (2 * defaultLineThickness) : (-2 * defaultLineThickness);
                lines.push(secondLine);
                frame.all.push(secondLine);
                rooms = updateRooms(rooms, secondLine);
            }

        } else if (instruction === 'horizontal-line') {
            // exceptions to general thickness
            let thickness = (random(1, 4) === 1) ? defaultLineThickness : horizontalLineThickness;
            let line = createLine(lines, 'horizontal', minimumLineDistance, thickness, lineColor, useTape);
            if (line) {
                if (config['grid']) {
                    line.start = 0;
                    line.end = 100;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'vertical-line') {
            let line = createLine(lines, 'vertical', minimumLineDistance, verticalLineThickness, lineColor, useTape);
            if (line) {
                if (config['grid']) {
                    line.start = 0;
                    line.end = 100;
                }
                lines.push(line);
                frame.all.push(line);
                rooms = updateRooms(rooms, line);
            }
        } else if (instruction === 'plane') {
            let roomIndex = pickARoomForAPlane(rooms);
            if (roomIndex !== false) {
                let room = rooms[roomIndex];
                let plane = createPlane(room);

                let result = pickAPlaneColor(planeColors, room);
                plane.color = result.color;
                planeColors = result.planeColors;
                plane.colorVariation = colorVariations[0];

                frame.all.push(plane);

                room.color = plane.color;
                rooms = replaceRoom(rooms, roomIndex, room);
            }
        } else if (instruction === 'steps') {
            let result = pickARoomForSteps(rooms);
            if (result) {
                let roomIndex = result[0];
                let orientation = result[1];
                let room = rooms[roomIndex];
                let steps = createRandomSteps(room, orientation, colorVariations[0]);
                frame.all.push(steps);
                room['has-steps'] = true;
            }
        }
    }

    return frame;
}
