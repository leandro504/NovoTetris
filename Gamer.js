class Tetris {
    constructor(imageX, imageY, template) {
        this.imageX = imageX;
        this.imageY = imageY;
        this.template = template;
        this.x = squareCountX / 2 -2;
        this.y = 0;
    }
    CheckBotton(){
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j < this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncadPosition().x;
                let realY = j + this.getTruncadPosition().y;
                if(realY + 1 >= squareCountY){
                    return false;
                }
                if(gameMap[realY + 1][realX].imageX !== -1){
                    return false;
                }
            }
        }
        return true;

    }

    getTruncadPosition(){
        return {x: Math.trunc(this.x), y: Math.trunc(this.y)};
    }
    CheckRight(){
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j < this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncadPosition().x;
                let realY = j + this.getTruncadPosition().y;
                if(realX + 1 >= squareCountX){
                    return false;
                }
                if(gameMap[realY][realX + 1].imageX !== -1){
                    return false;
                }
            }
        }
        return true;
    }
    CheckLeft(){
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j < this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncadPosition().x;
                let realY = j + this.getTruncadPosition().y;
                if(realX - 1 < 0){
                    return false;
                }
                if(gameMap[realY][realX - 1].imageX !== -1){
                    return false;
                }
            }
        }
        return true;
    }
    DirectionRight(){
        if(this.CheckRight()){
            this.x += 1;
        }
    }
    DirectionLeft(){
        if(this.CheckLeft()){
            this.x -= 1;
        }
    }
    directionDown(){
        if(this.CheckBotton()){
            this.y += 1;
        }
    }
    changeRotationShape = ()=>{
        let tempTemplate = [];
        for(let i = 0; i < this.template.length; i++)
        tempTemplate[i] = this.template[i].slice();
    let n = this.template.length;
    for(let layer = 0; layer < n / 2; layer++){
        let first = layer;
        let last = n - 1 - layer;
        for(let i = first; i < last; i++){

            let offset = i - first;
            let top = this.template[first][i];
             this.template[first][i] = this.template[i][last];
            this.template[i][last] = this.template[last][last - offset];
            this.template[last][last - offset] = this.template[last - offset][first];
            this.template[last - offset][first] = top;
        }
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j < this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncadPosition().x;
                let realY = j + this.getTruncadPosition().y;
                if(
                    realX < 0 ||
                    realX >= squareCountX ||
                    realY < 0 ||
                    realY >= squareCountY
                ){
                    this.template = tempTemplate;
                    return false;
                }
            }
        }
    }
    }
}
const canvas = document.getElementById('canvas1');
const nextShapeCanvas = document.getElementById('nextShape');
const nctx = nextShapeCanvas.getContext('2d');
const ctx = canvas.getContext('2d');
const image = document.getElementById('image');
const imageSquareSize = 20;
const gameSpeed = 24;
const gameUpdate = 2;
const size = 20;
canvas.width = 400;
canvas.height = 600;
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

const Shapes = [
    new Tetris(0, 144, [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]),
    new Tetris(0, 120, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Tetris(0, 96, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),
    new Tetris(0, 72, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]),
    new Tetris(0, 48, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
    new Tetris(0, 24, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]),
    new Tetris(0, 0, [
        [1, 1],
        [1, 1],
    ])
];


let gameOver;
let currentShape;
let initialTwoDrr;
let nextShape;


let deleteCompleteRows = ()=>{
    for(let i = 0; i < gameMap.length; i++){
        let t = gameMap[i];
        let isComplete = true;
        for(let j = 0; j < t.length; j++){
            if(t[j].imageX == -1) isComplete = false;
        }
        if(isComplete){
            for(let k = i; k > 0; k--){
                gameMap[k] = gameMap[k - 1];
            }
            let temp = [];
            for(let j = 0; j < squareCountX; j++){
                temp.push({imageX: -1, imageY: -1});
            }
            gameMap[0] = temp;
        }
    }
}

let drawCurrentShape = () => {
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x) * size + size * i,
                Math.trunc(currentShape.y) * size + size * j,
                size,
                size
            )
        }
    }
};

let drawNextShape = ()=>{
    
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height)
   for(let i = 0; i < nextShape.template.length; i++){
    for(let j = 0; j < nextShape.template.length; j++){
        if(nextShape.template[i][j] == 0) continue;
        nctx.drawImage(
            image,
            nextShape.imageX,
            nextShape.imageY,
            imageSquareSize,
            imageSquareSize,
            size * i + 50,
            size * j + size * 3,
            size,
            size
        )
       
    }
   }
}

let drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) continue;
            ctx.drawImage(
                image,
                t[j].imageX,
                t[j].imageY,
                imageSquareSize,
                imageSquareSize,
                j * size,
                i * size,
                size,
                size
            )
        }
    }
};


let update = ()=>{
    if(gameOver) return;
    if(currentShape.CheckBotton()){
        currentShape.y ++;
    }else{
        for(let i = 0; i < currentShape.template.length; i++){
            for(let j = 0; j < currentShape.template.length; j++){
                if(currentShape.template[i][j] == 0) continue;
                gameMap[currentShape.getTruncadPosition().y + j][
                    currentShape.getTruncadPosition().x + i
                ] = {imageX: currentShape.imageX, imageY: currentShape.imageY};
            }
        }
        deleteCompleteRows();
        currentShape = nextShape;
        nextShape = getRandomShapes();
        if(!currentShape.CheckBotton()){
            resetVars();
        }
    }
}

let getRandomShapes = () => {
    return Object.create(Shapes[Math.floor(Math.random() * Shapes.length)]);
}

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCurrentShape();
    drawSquares();
    drawNextShape();
}


let gameLoop = () => {

    setInterval(update,1000/ gameUpdate);
    setInterval(draw, 1000 / gameSpeed);
}

let resetVars = () => {
    initialTwoDrr = [];
    for (let i = 0; i < squareCountY; i++) {
        let temp = [];
        for (let j = 0; j < squareCountX; j++) {
            temp.push({ imageX: -1, imageY: -1 })
        }
        initialTwoDrr.push(temp);
    }
    currentShape = getRandomShapes();
    nextShape = getRandomShapes();
    gameMap = initialTwoDrr;

}
window.addEventListener("keydown",({key})=>{
    if(key == "ArrowUp") currentShape.changeRotationShape();
    if(key == "ArrowRight") currentShape.DirectionRight();
    if(key == "ArrowLeft") currentShape.DirectionLeft();
    if(key == "ArrowDown") currentShape.directionDown();
   
})
resetVars();
gameLoop();