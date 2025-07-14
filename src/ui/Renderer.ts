
export default class Renderer {

    public static createBoard(id: string): void {
        document.querySelector(id)!.innerHTML = `
          <div id="board">
            <div class="half top">
              <div class="point-row">
                <!-- Points 12 to 1 -->
                <div class="point" data-index="12"></div>
                <div class="point" data-index="11"></div>
                <div class="point" data-index="10"></div>
                <div class="point" data-index="9"></div>
                <div class="point" data-index="8"></div>
                <div class="point" data-index="7"></div>
                <div class="bar" data-index="bar-top">BAR</div>
                <div class="point" data-index="6"></div>
                <div class="point" data-index="5"></div>
                <div class="point" data-index="4"></div>
                <div class="point" data-index="3"></div>
                <div class="point" data-index="2"></div>
                <div class="point" data-index="1"></div>
              </div>
            </div>
        
            <div class="half bottom">
              <div class="point-row">
                <!-- Points 13 to 24 -->
                <div class="point" data-index="13"></div>
                <div class="point" data-index="14"></div>
                <div class="point" data-index="15"></div>
                <div class="point" data-index="16"></div>
                <div class="point" data-index="17"></div>
                <div class="point" data-index="18"></div>
                <div class="bar" data-index="bar-bottom">BAR</div>
                <div class="point" data-index="19"></div>
                <div class="point" data-index="20"></div>
                <div class="point" data-index="21"></div>
                <div class="point" data-index="22"></div>
                <div class="point" data-index="23"></div>
                <div class="point" data-index="24"></div>
              </div>
            </div>
          </div>
        `;
    }

    public static createChecker(index: number, pointIndex: number, color: string): void {
        const point = document.querySelector(`.point[data-index="${pointIndex}"]`);
        point!.innerHTML = point!.innerHTML?.concat(`<div class="checker checker-${color}" data-index="${index}"></div>`);
    }
}
