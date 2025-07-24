import Renderer from 'ui/Renderer.ts';
import Player from 'core/Player';
import Dice from 'core/Dice';
import Checker from 'core/Checker';

export default class Board {
    private points: Checker[][] = Array.from({ length: 24 }, () => []);
    private checkers: Map<number, Checker> = new Map();
    private lastCheckerId: number = 0;

    constructor() {
        Renderer.createBoard('#app');
    }

    public setupInitialPosition(players: Player[]): void {
        this.points = Array.from({ length: 24 }, () => []);
        this.checkers.clear();
        this.lastCheckerId = 0;

        this.addCheckers(players[0], 13, 15);
        this.addCheckers(players[1], 1, 15);
    }

    private addCheckers(player: Player, pointIndex: number, count: number): void {
        for (let i = 0; i < count; i++) {
            const checker = new Checker(this.lastCheckerId++, pointIndex, player.id, player.color);
            this.points[pointIndex].push(checker);
            this.checkers.set(checker.id, checker);
        }
    }

    public getCheckerById(id: number): Checker | undefined {
        return this.checkers.get(id);
    }

    public tryMoveChecker(
        checkerId: number,
        toPointIndex: number,
        dice: Dice
    ): boolean {
        const checker = this.getCheckerById(checkerId);
        if (!checker) return false;

        const fromIndex = this.findCheckerPosition(checkerId);
        if (fromIndex === null) return false;

        const distance = Math.abs(toPointIndex - fromIndex);
        if (!dice.use(distance)) return false;

        const targetPoint = this.points[toPointIndex];
        if (
            targetPoint.length >= 2 &&
            targetPoint[0].ownerId !== checker.ownerId
        ) {
            return false;
        }

        const from = this.points[fromIndex];
        const idx = from.findIndex((c) => c.id === checkerId);
        if (idx !== -1) from.splice(idx, 1);

        this.points[toPointIndex].push(checker);
        return true;
    }

    public isTurnOver(dice: Dice): boolean {
        return dice.remaining.length === 0;
    }

    private findCheckerPosition(checkerId: number): number | null {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].some((c) => c.id === checkerId)) {
                return i;
            }
        }
        return null;
    }

    public render(): void {
        document.querySelectorAll('.point').forEach((el) => (el.innerHTML = ''));

        this.points.forEach((checkers, i) => {
            const point = document.querySelector(`.point[data-index="${i}"]`);
            if (!point) return;

            checkers.forEach((checker) => {
                checker.pointIndex = i;
                checker.render();
            });
        });
    }
}
