import Board from 'core/Board.ts';
import Player from 'core/Player.ts';
import InputHandler from 'ui/InputHandlers.ts';
import Dice from 'core/Dice.ts';

type GamePhase = 'waiting_roll' | 'waiting_move' | 'game_over';

export default class Game {
    private board: Board;
    private players: [Player, Player];
    private currentPlayerIndex: number = 0;
    private dice: Dice;
    private input: InputHandler;
    private phase: GamePhase = 'waiting_roll';
    private selectedCheckerId: number | null = null;

    constructor() {
        this.board = new Board();
        this.players = [new Player(1, 'white'), new Player(2, 'black')];
        this.dice = new Dice();

        this.input = new InputHandler(
            this.onPointClick.bind(this),
            this.onCheckerClick.bind(this),
            this.onDiceRoll.bind(this)
        );

        this.start();
    }

    private start() {
        console.log('Starting Game');
        this.board.setupInitialPosition(this.players);
        this.phase = 'waiting_roll';
        console.log(this.phase);
        this.render();
    }

    private onPointClick(pointIndex: number): void {
        if (this.phase !== 'waiting_move') return;
        if (this.selectedCheckerId === null) return;

        const success = this.board.tryMoveChecker(
            this.selectedCheckerId,
            pointIndex,
            this.dice
        );

        if (success) {
            console.log(`Moved checker ${this.selectedCheckerId} to ${pointIndex}`);
            this.selectedCheckerId = null;

            if (this.board.isTurnOver(this.dice)) {
                this.switchTurn();
            }

            this.render();
        } else {
            console.warn('Invalid move');
        }
    }

    private onCheckerClick(checkerId: number): void {
        console.log(this.phase);
        if (this.phase !== 'waiting_move') return;

        const checker = this.board.getCheckerById(checkerId);
        console.log(checker);
        if (!checker || checker.ownerId !== this.currentPlayer.id) return;

        this.selectedCheckerId = checkerId;
        console.log(`Checker ${checkerId} selected`);
    }

    private onDiceRoll(): void {
        if (this.phase !== 'waiting_roll') return;

        this.dice.roll();
        this.phase = 'waiting_move';
        console.log(`Dice rolled: ${this.dice.values.join(', ')}`);
        this.render();
    }

    private switchTurn(): void {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        this.phase = 'waiting_roll';
        this.dice.reset();
        console.log(`Switched to player ${this.currentPlayer.id}`);
    }

    private get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    private render(): void {
        this.board.render();
    }

    public destroy(): void {
        this.input.destroy();
    }
};
