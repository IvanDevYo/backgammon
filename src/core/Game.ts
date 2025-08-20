import Player from 'core/Player.ts';
import Checker from 'core/Checker.ts';
import Dice from 'core/Dice.ts';
import InputHandler from 'ui/InputHandlers.ts';
import Renderer from 'ui/Renderer.ts';

type GamePhase = 'waiting_roll' | 'waiting_move' | 'game_over';

export default class Game {
    private players: [Player, Player];
    private currentPlayerIndex: number = 0;
    private points: Checker[][] = Array.from({ length: 24 }, () => []);
    private lastCheckerId = 0;
    private phase: GamePhase = 'waiting_roll';
    private selectedCheckerId: number | null = null;
    private possibleMoves : number[] = [];
    private dice: Dice;
    private inputHandler: InputHandler;

    constructor() {
        Renderer.createBoard('#app');
        this.dice = new Dice();
        this.players = [new Player('white'), new Player('black')];
        this.inputHandler = new InputHandler(
            this.handlePointClick.bind(this),
            this.handleCheckerClick.bind(this),
            this.handleDiceRoll.bind(this)
        );

        this.start();
    }

    public start() {
        this.setupInitialPosition();
        this.dice.startRoll();
        this.currentPlayerIndex = this.dice.startPlayerRoll.indexOf(Math.max(...this.dice.startPlayerRoll));
        this.phase = 'waiting_roll';
    }

    public setupInitialPosition() {
        if (!this.loadFromLocalStorage()) {
            this.points = Array.from({ length: 24 }, () => []);

            this.addCheckers(0, 'white', 12, 15);
            this.addCheckers(1, 'black', 0, 15);
        }
        this.render();
    }

    private addCheckers(playerIndex: number, color: string, pointIndex: number, count: number) {
        for (let i = 0; i < count; i++) {
            const checker = new Checker(this.lastCheckerId++, playerIndex, color);
            this.points[pointIndex].push(checker);
        }
    }

    private normalizePointIndex(pointIndex: number): number {
        return pointIndex > 23 ? pointIndex - 24 : pointIndex;
    }

    private isPointWithOtherPlayerChecker(pointIndex: number): boolean {
        const newPoint = this.points[pointIndex]
        return !!newPoint.length && newPoint[0].playerIndex !== this.currentPlayerIndex;
    }

    private calculatePossibleMoves(checkerId: number | null = null): void {
        const moves = new Set<number>();

        for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
            for (const checker of this.points[pointIndex]) {
                if (checker.playerIndex !== this.currentPlayerIndex) continue;
                if (checkerId && checker.id !== checkerId) continue;

                let sum = 0;
                for (const value of this.dice.remaining) {
                    sum += value;

                    const currentNewPointIndex = this.normalizePointIndex(pointIndex + value);
                    if (!this.isPointWithOtherPlayerChecker(currentNewPointIndex)) {
                        moves.add(currentNewPointIndex);
                    }

                    const sumNewPointIndex = this.normalizePointIndex(pointIndex + sum);
                    if (!this.isPointWithOtherPlayerChecker(sumNewPointIndex)) {
                        moves.add(sumNewPointIndex);
                    }
                }
            }
        }

        this.possibleMoves = [...moves];

        console.log('this.currentPlayerIndex', this.currentPlayerIndex);
        console.log('this.dice.remaining', this.dice.remaining);
        console.log('this.possibleMoves', this.possibleMoves);
    }

    private tryMoveCheckerToPoint(checkerId: number, pointIndex: number): boolean {
        const possibleMove = this.possibleMoves.find(i => i === pointIndex);
        if (possibleMove) {
            const checkerPointIndex = this.points.findIndex(point => {
                return point.some((c) => c.id === checkerId);
            });
            const distance = possibleMove - checkerPointIndex;
            this.dice.use(distance);
            const checker = this.points[checkerPointIndex].splice(this.points[checkerPointIndex].length - 1, 1)[0];
            checker.addDistance(distance);
            this.points[pointIndex].push(checker);
            this.render();
            return true;
        }
        return false;
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('_saved_points', JSON.stringify(this.points));
        localStorage.setItem('_current_player_index', String(this.currentPlayerIndex));
    }

    private loadFromLocalStorage(): boolean {
        const pointsJson = localStorage.getItem('_saved_points');
        const currentPlayerIndex = localStorage.getItem('_current_player_index');

        if (pointsJson) {
            this.currentPlayerIndex = currentPlayerIndex ? Number(currentPlayerIndex) : this.currentPlayerIndex;

            const parsed = JSON.parse(pointsJson);
            parsed.forEach((checkers: Checker[], pointIndex: number) => {
                if (checkers.length > 0) {
                    this.addCheckers(checkers[0].playerIndex, checkers[0].color, pointIndex, checkers.length);
                }
            });
            return true;
        }
        return false;
    }

    private handleCheckerClick(checkerId: number): void {
        if (this.phase === 'waiting_move') {
            this.selectedCheckerId = checkerId;
            this.calculatePossibleMoves(checkerId);
        }
    }

    private handlePointClick(pointIndex: number): void {
        if (this.selectedCheckerId === null) return;
        if (this.tryMoveCheckerToPoint(this.selectedCheckerId, pointIndex)) {
            if (this.dice.remaining.length) {
                this.calculatePossibleMoves();
            } else {
                this.currentPlayerIndex = this.currentPlayerIndex === 1 ? 0 : 1;
                this.phase = 'waiting_roll';
                this.saveToLocalStorage();
            }
        }
        this.selectedCheckerId = null;
    }

    private handleDiceRoll(): void {
        if (this.phase === 'waiting_roll') {
            this.dice.roll();
            this.phase = 'waiting_move';
            this.calculatePossibleMoves();
        }
    }

    public render(): void {
        document.querySelectorAll('.point').forEach((el) => (el.innerHTML = ''));

        this.points.forEach((checkers, pointIndex) => {
            checkers.forEach((checker) => {
                Renderer.createChecker(checker.id, pointIndex, checker.color);
            });
        });
    }

    public destroy(): void {
        this.inputHandler.destroy();
    }
};
