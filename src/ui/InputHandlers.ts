type PointClickCallback = (pointIndex: number) => void;
type CheckerClickCallback = (checkerIndex: number) => void;
type DiceRollCallback = () => void;

export default class InputHandler {
    private onPointClick?: PointClickCallback;
    private onCheckerClick?: CheckerClickCallback;
    private onDiceRoll?: DiceRollCallback;

    constructor(
        onPointClick?: PointClickCallback,
        onCheckerClick?: CheckerClickCallback,
        onDiceRoll?: DiceRollCallback
    ) {
        this.onPointClick = onPointClick;
        this.onCheckerClick = onCheckerClick;
        this.onDiceRoll = onDiceRoll;

        this.bindEvents();
    }

    private bindEvents(): void {
        document.addEventListener('click', this.handleClick.bind(this));
    }

    private handleClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target.classList.contains('point')) {
            const pointIndex = Number(target.dataset.index);
            if (!isNaN(pointIndex) && this.onPointClick) {
                this.onPointClick(pointIndex);
            }
        }

        if (target.classList.contains('checker')) {
            const checkerIndex = Number(target.dataset.index);
            if (!isNaN(checkerIndex) && this.onCheckerClick) {
                this.onCheckerClick(checkerIndex);
            }
        }

        if (target.id === 'roll-dice' && this.onDiceRoll) {
            this.onDiceRoll();
        }
    }

    public destroy(): void {
        document.removeEventListener('click', this.handleClick.bind(this));
    }
}
