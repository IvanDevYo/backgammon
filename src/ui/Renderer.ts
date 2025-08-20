
export default class Renderer {

    public static createBoard(id: string): void {
        document.querySelector(id)!.innerHTML = `
          <div id="board">
            <div class="half top">
              <div class="point-row">
                <!-- Points 12 to 1 -->
                <div class="point" data-index="11"></div>
                <div class="point" data-index="10"></div>
                <div class="point" data-index="9"></div>
                <div class="point" data-index="8"></div>
                <div class="point" data-index="7"></div>
                <div class="point" data-index="6"></div>
                <div class="bar" data-index="bar-top">BAR</div>
                <div class="point" data-index="5"></div>
                <div class="point" data-index="4"></div>
                <div class="point" data-index="3"></div>
                <div class="point" data-index="2"></div>
                <div class="point" data-index="1"></div>
                <div class="point" data-index="0"></div>
              </div>
            </div>
        
            <div class="half bottom">
              <div class="point-row">
                <!-- Points 13 to 24 -->
                <div class="point" data-index="12"></div>
                <div class="point" data-index="13"></div>
                <div class="point" data-index="14"></div>
                <div class="point" data-index="15"></div>
                <div class="point" data-index="16"></div>
                <div class="point" data-index="17"></div>
                <div class="bar" data-index="bar-bottom">BAR</div>
                <div class="point" data-index="18"></div>
                <div class="point" data-index="19"></div>
                <div class="point" data-index="20"></div>
                <div class="point" data-index="21"></div>
                <div class="point" data-index="22"></div>
                <div class="point" data-index="23"></div>
              </div>
            </div>
          </div>
          <div>
            <div id="buttons"></div>
            <div class="dice-results" data-index="1"></div>
            <div class="dice-results" data-index="1"></div>
          </div>
        `;
        this.createDiceRoll();
    }

    public static createChecker(index: number, pointIndex: number, color: string): void {
        const point = document.querySelector(`.point[data-index="${pointIndex}"]`);
        point!.innerHTML = point!.innerHTML?.concat(`<div class="checker checker-${color}" data-index="${index}"></div>`);
    }

    public static removeChecker(index: number, pointIndex: number): void {
        const checker = document.querySelector(`.point[data-index="${pointIndex}"] .checker[data-index="${index}"]`);
        checker?.remove();
    }

    public static createPoint(index: number, rowIndex: number): void {
        const row = document.querySelectorAll(`.point-row`)[rowIndex];
        row!.innerHTML = row!.innerHTML?.concat(`<div class="point" data-index="${index}"></div>`);
    }

    public static createPointDivider(rowIndex: number): void {
        const row = document.querySelectorAll(`.point-row`)[rowIndex];
        row!.innerHTML = row!.innerHTML?.concat(`<div class="bar" data-index="bar-bottom">BAR</div>`);
    }

    public static createDiceRoll() {
        document.querySelector('#buttons')!.innerHTML = `
            <button id="roll-dice">Roll Dice</button>
        `;
    }

    public static setDiceValue(value: number[], playerIndex: number): void {
        document.querySelector(`.dice-results[data-index="${playerIndex}"]`)!.innerHTML = value.join(',');
    }
}
