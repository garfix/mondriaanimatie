
function urlEncodeFrame(frame) {
    return urlEncodeItem(frame)
}

function urlEncodeItem(item) {
    var url = "";

    const keys = {
        type: 'x',
        left: 'l',
        right: 'r',
        bottom: 'b',
        top: 't',
        color: 'c',
        colorVariation: 'v',
        orientation: 'o',
        pos: 'p',
        width: 'w',
        start: 'h',
        end: 'i',
        all: 'a',
        steps: 's',
        elements: 'e'
    };

    const values = {
        horizontal: 'h',
        vertical: 'v',
        line: 'l',
        plane: 'p',
        steps: 's',
        step: 't',
        red: 'r',
        yellow: 'y',
        blue: 'b',
        grey: 'g',
        black: 'k',
        lighter: 'x',
        darker: 'd',
        none: 'n'
    };

    for (var k in item) {

        if (typeof keys[k] === "undefined") {
            console.log("url encode error: unknown key: " + k)
            console.log(item)
        }

        url += keys[k];

        if (k === "all" || k === "elements") {

            for (var i = 0; i < item[k].length; i++) {
                element = item[k][i];
                url += urlEncodeItem(element);
            }

            url += "-";

        } else {

            var value = item[k];

            if (isNaN(parseInt(value))) {

                if (typeof values[value] !== "undefined") {
                    url += values[value];
                } else {
                    console.log("Unknown value: " + value);
                }

            } else {
                url += value;
            }

        }
    }

    url += "-";

    return url;
}

function urlDecodeFrame(url) {
    var result = urlDecodeObject(url, 0);
    return result[0];
}

function urlDecodeObject(url, pointer) {
    const keys = {
        x: 'type',
        l: 'left',
        r: 'right',
        b: 'bottom',
        t: 'top',
        c: 'color',
        v: 'colorVariation',
        o: 'orientation',
        p: 'pos',
        w: 'width',
        h: 'start',
        i: 'end',
        a: 'all',
        s: 'steps',
        e: 'elements'
    };

    var obj = {};

    do {
        var head = url.substring(pointer, pointer + 1);
        pointer++;

        if (head === "-") {
            break;
        }

        if (typeof keys[head] === "undefined") {
            console.log("url decode error: unknown key: " + head);
            return [null, pointer];
        }

        var key = keys[head];
        switch (key) {
            case 'elements':
            case 'all':
                var elements = [];
                do {
                    var result = urlDecodeObject(url, pointer);
                    pointer = result[1];
                    var element = result[0];
                    if (element === null) {
                        return [null, pointer];
                    }
                    // element == {}
                    if (Object.keys(element).length === 0) {
                        break;
                    }

                    elements.push(element);

                } while (true);
                obj[key] = elements;
                break;
            default:
                var result = urlDecodeValue(url, pointer);
                pointer = result[1];
                var value = result[0];
                if (value === null) {
                    return [null, pointer];
                }
                obj[key] = value;
                break;
        }

    } while (pointer <= url.length);

    return [obj, pointer];
}

function urlDecodeValue(url, pointer) {

    const values = {
        h: 'horizontal',
        v: 'vertical',
        l: 'line',
        p: 'plane',
        s: 'steps',
        t: 'step',
        r: 'red',
        y: 'yellow',
        b: 'blue',
        g: 'grey',
        k: 'black',
        x: 'lighter',
        d: 'darker',
        n: 'none'
    };

    var value = null;

    var matches = url.substring(pointer).match(/^([0-9]+)/);
    if (matches) {
        value = matches[1];
        pointer += value.length;
    } else {
        matches = url.substring(pointer).match(/^(\w)/);
        if (matches) {
            token = matches[1];
            pointer += 1;

            if (typeof values[token] === "undefined") {
                console.log("url decode error: unknown value: " + value);
                return [null, pointer];
            }

            value = values[token];

        }
    }

    return [value, pointer];
}