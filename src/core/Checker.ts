
export default class Checker {
    public distance: number = 0;

    constructor(
        public id: number = 0,
        public playerIndex: number = 0,
        public color: string = 'white',
    ) {}

    addDistance(distance: number) {
        this.distance += distance;
    }
}
