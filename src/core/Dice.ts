
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

    public use(value: number): void {
        let idx = this.remaining.indexOf(value);
        let deleteCount = 1;
        if (idx === -1) {
            let sum = 0;
            this.remaining.forEach((v, i) => {
                sum += v;
                if (sum === value) {
                    idx = 0;
                    deleteCount = i + 1;
                }
            })
        }
        this.remaining.splice(idx, deleteCount);
    }

    public reset(): void {
        this.values = [];
        this.remaining = [];
    }

    private random(): number {
        return Math.floor(Math.random() * 6) + 1;
    }
}
