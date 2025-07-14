import Renderer from "ui/Renderer.ts";

export default class Checker {
    constructor(index: number, pointIndex: number, color: string) {
        Renderer.createChecker(index, pointIndex, color)
    }
}
