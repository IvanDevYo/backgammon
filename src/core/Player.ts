import Checker from 'core/Checker.ts';

export default class Player {

    private color: string;
    private chackers: Checker[] = [];
    private state: string = 'awaiting';

    constructor(color: string, startPosition: number) {
        this.color = color;
        this.initCheckers(startPosition);
    }

    private initCheckers(startPosition: number) {
        for (let i = 1; i <= 15; i++) {
            this.chackers.push(new Checker(i, startPosition, this.color));
        }
    };

    public getState(): string {
        return this.state;
    }
}
