
const graphLimit = 10000;
var lineGap = 25;
var lineWidth = 3;
var graphs = [];

var canvas;
var mainContentEle = document.getElementById('main-content');


function setup() {
    canvas = createCanvas(mainContentEle.offsetWidth, window.innerHeight);
    canvas.parent('main-content');

    


}


function draw() {
    background(255);
    drawGrid();
    
}





function drawGrid(){
    stroke(0);
    stroke(230, 230, 230, 255);

    for (let x = width/2; x < graphLimit; x+=lineGap){
        line(x, -graphLimit, x, graphLimit);
    }

    for (let x = width/2; x > -graphLimit; x -= lineGap){
        line(x, graphLimit, x, -graphLimit);
    }
    for (let y = height/2; y < graphLimit; y += lineGap){
        line(-graphLimit, y, graphLimit, y);
    } 
    for (let y = height/2; y > -graphLimit; y -= lineGap){
        line(-graphLimit, y, graphLimit, y);
    }

    stroke(0);
    line(width/2, -graphLimit, width/2, graphLimit);
    line(-graphLimit, height/2, graphLimit, height/2);


};

function windowResized() {
    let prev = createVector(width, height);

    resizeCanvas(mainContentEle.offsetWidth, window.innerHeight);
    for (const [key, values, color] of graphs){
        for (let pt of values){
            pt.x += width/2 - prev.x/2;
            pt.y += height/2 - prev.y/2;
        }

    }

    
}



