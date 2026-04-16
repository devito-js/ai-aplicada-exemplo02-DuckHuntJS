importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

const MODEL_PATH = `yolov5n_web_model/model.json`;
const LABELS_PATH = `yolov5n_web_model/labels.json`;
const INPUT_MODEL_DIMENESIONS = 640;
const CLASS_THERESHOLD = 0.4;

let _model = null;
let _labels = [];

async function loadModelAndLabels() {
    await tf.ready();
    _labels = await (await fetch(LABELS_PATH)).json();
    _model = await tf.loadGraphModel(MODEL_PATH);

    const dummyInput = tf.ones(_model.inputs[0].shape);
    await _model.executeAsync(dummyInput);
    tf.dispose(dummyInput);

    postMessage({ type: 'model-loaded' });
}

async function runInference(tensor) {
    const output = await _model.executeAsync(tensor);
    tf.dispose(tensor);

    const [boxes, scores, classes] = output.slice(0, 3);
    const [boxesData, scoresData, classesData] = await Promise.all([boxes.data(), scores.data(), classes.data()]);

    output.forEach(t => tf.dispose(t));

    return { boxes: boxesData, scores: scoresData, classes: classesData };
}

function* processPrediction({ boxes, scores, classes }, width, height) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i] < CLASS_THERESHOLD) continue;
        const label = _labels[classes[i]];
        if (label !== 'kite') continue;

        let [x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4);
        x1 *= width;
        y1 *= height;
        x2 *= width;
        y2 *= height;

        const boxWidth = x2 - x1;
        const boxHeight = y2 - y1;
        const centerX = x1 + boxWidth / 2;
        const centerY = y1 + boxHeight / 2;

        yield {
            x: centerX,
            y: centerY,
            width: boxWidth,
            height: boxHeight,
            score: (scores[i] * 100).toFixed(2),
        };
    }
}

loadModelAndLabels();

function preprocessImage(input) {
    return tf.tidy(() => {
        const image = tf.browser.fromPixels(input);

        return tf.image.resizeBilinear(image, [INPUT_MODEL_DIMENESIONS, INPUT_MODEL_DIMENESIONS]).div(255).expandDims(0);
    });
}

self.onmessage = async ({ data }) => {
    if (data.type !== 'predict') return
    if (!_model) return

    const input = preprocessImage(data.image);
    const { width, height } = data.image;
    const inferenceResults = await runInference(input);

    for (const prediction of processPrediction(inferenceResults, width, height)) {
        postMessage({
            type: 'prediction',
            ...prediction
        });
    }
};

console.log('🧠 YOLOv5n Web Worker initialized');
