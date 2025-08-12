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
    private selectedChecker: number | null = null;
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
        this.points = Array.from({ length: 24 }, () => []);

        this.addCheckers(0, 'white', 12, 15, false);
        this.addCheckers(1, 'black', 0, 15, true);
    }

    private addCheckers(playerIndex: number, color: string, pointIndex: number, count: number, reverseMove: boolean = false) {
        for (let i = 0; i < count; i++) {
            const checker = new Checker(this.lastCheckerId++, playerIndex, color, reverseMove);
            this.points[pointIndex].push(checker);
            Renderer.createChecker(checker.id, pointIndex, color);
        }
    }

    private isPointWithOtherPlayerChecker(pointIndex: number): boolean {
        const newPoint = this.points[pointIndex]
        return !!newPoint.length && newPoint[0].playerIndex !== this.currentPlayerIndex;
    }

    private calculatePossibleMoves() {
        const moves = new Set<number>();

        for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
            for (const checker of this.points[pointIndex]) {
                if (checker.playerIndex !== this.currentPlayerIndex) continue;

                let sum = 0;
                for (const value of this.dice.remaining) {
                    sum += value;

                    const currentNewPointIndex = pointIndex + value;
                    if (!this.isPointWithOtherPlayerChecker(currentNewPointIndex)) {
                        moves.add(currentNewPointIndex);
                    }

                    const sumNewPointIndex = pointIndex + sum;
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

    private handleCheckerClick(checkerId: number): void {
        this.selectedChecker = checkerId;
    }

    private handlePointClick(pointIndex: number): void {
        if (this.selectedChecker === null) return;
        this.selectedChecker = null;
    }

    private handleDiceRoll(): void {
        this.dice.roll();
        this.calculatePossibleMoves();
    }

    public destroy(): void {
        this.inputHandler.destroy();
    }
};
