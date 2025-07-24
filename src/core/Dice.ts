import Renderer from "ui/Renderer.ts";

export default class Dice {
    public values: number[] = [];
    public remaining: number[] = [];

    public roll(): void {
        const a = this.random();
        const b = this.random();

        this.values = a === b ? [a, a, a, a] : [a, b];
        this.remaining = [...this.values];
        Renderer.setDiceValue(this.remaining);
    }

    public use(value: number): boolean {
        const idx = this.remaining.indexOf(value);
        if (idx === -1) return false;
        this.remaining.splice(idx, 1);
        Renderer.setDiceValue(this.remaining);
        return true;
    }

    public reset(): void {
        this.values = [];
        this.remaining = [];
    }

    private random(): number {
        return Math.floor(Math.random() * 6) + 1;
    }
}
