import { buildLayout } from "./layout";

export default async function main(game) {
    const container = buildLayout(game.app);
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

    game.stage.aim.visible = false;

    worker.onmessage = ({ data }) => {
        const { type, x, y } = data;

        if (type !== 'prediction') return

        container.updateHUD(data);
        game.stage.aim.visible = true;

        game.stage.aim.setPosition(x, y);
        const position = game.stage.aim.getGlobalPosition();

        game.handleClick({
            global: position,
        });
    };

    setInterval(() => {
        const canvas = game.app.renderer.extract.canvas(game.stage);

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        worker.postMessage({
            type: 'predict',
            buffer: imageData.data.buffer,
            width: imageData.width,
            height: imageData.height
        }, [imageData.data.buffer]);

    }, 200); // every 200ms

    return container;
}
