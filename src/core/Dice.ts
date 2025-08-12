
export default class Dice {
    public values: number[] = [];
    public remaining: number[] = [];
    public startPlayerRoll: number[] = [];

    public startRoll(): number[] {
        const a = this.random();
        const b = this.random();

        this.startPlayerRoll = [a, b];
        return this.startPlayerRoll;
    }

    public roll(): void {
        const a = this.random();
        const b = this.random();

        this.values = a === b ? [a, a, a, a] : [a, b];
        this.remaining = [...this.values];
    }

    public use(value: number): boolean {
        const idx = this.remaining.indexOf(value);
        if (idx === -1) return false;
        this.remaining.splice(idx, 1);
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
