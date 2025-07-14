import Board from 'core/Board.ts';
import Player from 'core/Player.ts';
import InputHandler from "ui/InputHandlers.ts";

export default class Game {
    private board: Board;
    private players: Player[] = [];

    constructor() {
        this.board = new Board();
        this.initPlayers();
        this.initInputListener();

        this.start()
    }

    private start() {
        this.players[0]
    }

    private initPlayers() {
        this.players.push(new Player('white', 1));
        this.players.push(new Player('black', 13));
    }

    private initInputListener() : void {
        new InputHandler(this.onPointClick, this.onCheckerClick);
    }

    private onPointClick(pointIndex: number): void {

    }

    private onCheckerClick(index: number): void {

    }
};
