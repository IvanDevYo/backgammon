import Renderer from "ui/Renderer.ts";

export default class Checker {
    constructor(
        public readonly id: number,
        public pointIndex: number,
        public readonly ownerId: number,
        public readonly color: string
    ) {}

    render() {
        Renderer.createChecker(this.id, this.pointIndex, this.color);
    }
}
