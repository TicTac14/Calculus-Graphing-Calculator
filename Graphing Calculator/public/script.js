
var canvas;
var colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 0, 230],
    [171, 0, 255],
    [0 ,196, 255],
    [0, 255, 179],
    [15, 117, 52],
    [255, 178, 0]
];
const graphLimit = 6000;
var sideBarEle = document.querySelector('.side-bar');
var mainContentEle = document.getElementById('main-content');
var zoomInEle = document.getElementById('zoom-in');
var zoomOutEle = document.getElementById('zoom-out');
var expressionInputs = document.querySelectorAll(".exprInput");
var addInputEle = document.getElementById("add-Ele");
var inputList = document.querySelector(".input-list");
var refreshBtn = document.querySelector('#refreshBtn');
var integrationEle = document.querySelector('.integration-container');
var derivativeEle = document.querySelector('.derivative-container');
var zoom_container = document.querySelector('.zoom-container');
var rightSumEle = document.querySelector('.right-integration');
var leftSumEle = document.querySelector('.left-integration');
var integrationSettings = document.querySelector('.integration-settings');
var header = document.querySelector('.header');
var integrationSlider = document.querySelector('#integration-slider');
var interval_val_Ele = document.querySelector('#interval-val');
var area_val_Ele = document.querySelector('#area-val');
var n_val_Ele = document.querySelector('#n-value');
var equation_deriv_display = document.querySelector('.equation');
var equation_deriv = document.querySelector('.eq-deriv');
var derivativeSettings = document.querySelector('.derivative-settings');
var derivative_x_display = document.querySelector('#derivative-x');
var derivative_at_x_display = document.querySelector('#derivative-at-x');
var derivative_slider = document.querySelector('#derivative-slider');
var point_display = document.querySelector('.point-hovered-display-container');
var point_x_display = document.querySelector('#point-x');
var point_y_display = document.querySelector('#point-y');

var gridTranslation;
let mode = "normal"; // normal, area, derivative
let pointClicked = null;
let mousePos;
var MPressed = false;
var MPos_Pressed;
var lineGap = 20;
var rectangles = [] //contains rectangles based on
var N = 2;
var integrationType = "left"; // switches from left to right riemann sum
let LineScale = 4; // mult by 5 for each 5 lines;
var lineWidth = 3;
let graphCLickedOn = false;
let GRAPH_SCALE_VAL = 1;
var integrationInterval = [0, 0];
var graphs = [];
var deriv_DUMMY_val = 0;
var slider_DUMMY_val = 0;
var point_hovered = undefined;

function setup(){
    canvas = createCanvas(mainContentEle.offsetWidth, window.innerHeight-40);
    canvas.parent('main-content');
    gridTranslation = createVector(0, 0);
    MPos_Pressed = createVector(mouseX, mouseY);
    mousePos = createVector(mouseX, mouseY);
    
    addEventListeners();

    
    


}


function draw(){
    background(255);
    scale(GRAPH_SCALE_VAL);
    translate(gridTranslation.x, gridTranslation.y);
    draw_Grid();
    drawPoints();


    if (mode === "area"){
        if (graphs.length > 1 || graphs.length == 0){
            window.alert("Can only visualize one function at a time!");
            mode = "normal";
        }else {
            // activate integration features
            sideBarEle.classList.add('hidden');
            derivativeEle.classList.add('hidden');
            rightSumEle.classList.remove('hidden');
            leftSumEle.classList.remove('hidden');
            integrationSettings.classList.remove('hidden');
            header.classList.add('hidden');
            
            if (integrationInterval[0] < 0 && integrationInterval[1] > 0){
                let result = [];
                let left = getRiemannRectangles(integrationInterval[0], 0, N);
                let right = getRiemannRectangles(0, integrationInterval[1], N);
                
                left.forEach(e => {
                    result.push(e);
                })
                right.forEach(e => {
                    result.push(e);
                })
                rectangles = result;

                
                area_val_Ele.innerHTML = (Number(calculateArea(left)/2) + Number(calculateArea(right)/2));
            }else {
                rectangles = getRiemannRectangles(integrationInterval[0], integrationInterval[1], N);
                area_val_Ele.innerHTML = calculateArea(rectangles);
            }
            
            drawRectangles();
            updateSettings();
            

            

        }


    }else if (mode === "derivative"){
        
        //activate derivative features
            
            sideBarEle.classList.add('hidden');
            derivativeSettings.classList.remove('hidden');
            header.classList.add('hidden');
            integrationEle.classList.add('hidden');
            equation_deriv_display.innerHTML = graphs[0][0].split('').filter(val => val != " ")
            .filter(val => val != "y").filter(val => val != "=").join('');
            derivative_x_display.innerHTML = derivative_slider.value;
            let e = new Expression(graphs[0][0], graphs[0][0].includes('f(x)'));
            let d = e.getDerivative();
            derivative_at_x_display.innerHTML = d.evaluate({x:Number(derivative_slider.value)});
            
            if (deriv_DUMMY_val == 0){

                equation_deriv.innerHTML = d.toString().split('').filter(e => e != " ").join('');

                if (d.isConstantNode){
                    graphs.push([`y = ${d.toString()} + 0*x`, drawNewGraph(`y = ${d.toString()} + 0*x`), random(colors)]);
                }else {
                    graphs.push([`y = ${d.toString()}`, drawNewGraph(`y = ${d.toString()}`), random(colors)]);
                }
                deriv_DUMMY_val ++;
            }
        
    }else {
        sideBarEle.classList.remove('hidden');
        derivativeEle.classList.remove('hidden');
        zoom_container.classList.remove('hidden');
        rightSumEle.classList.add('hidden');
        leftSumEle.classList.add('hidden');
        integrationSettings.classList.add('hidden');
        header.classList.remove('hidden');
        rectangles = [];
        N = 2;
        integrationInterval = [0, 0];
        derivativeSettings.classList.add('hidden');
        equation_deriv_display.innerHTML = "";
        deriv_DUMMY_val = 0;
        
        integrationEle.classList.remove('hidden');

    }
    
    
    canvas.mousePressed(() => {
        MPressed = true;
        MPos_Pressed = createVector(mouseX, mouseY);
       
    });   
}

function mouseReleased(){
   MPressed = false;
   MPos_Pressed = createVector(0, 0);
}

function mouseDragged(){
    if (MPressed && !graphCLickedOn){
        let curMPos = createVector(mouseX, mouseY);
        let vect = p5.Vector.sub(MPos_Pressed, curMPos);
        vect.mult(-1);
        MPos_Pressed.add(vect);
        gridTranslation.add(vect);
        vect.mult(0);
        
        
    }
    

}
    
function windowResized() {
    let prev = createVector(width, height);

    if (mode == "normal"){
        resizeCanvas(mainContentEle.offsetWidth, window.innerHeight-40);
    }else {
        resizeCanvas(window.innerWidth, window.innerHeight);
    }
    
    for (const [key, values, color] of graphs){
        for (let pt of values){
            pt.x += width/2 - prev.x/2;
            pt.y += height/2 - prev.y/2;
        }

    }

    
}

function addEventListeners(){
    

    for (let i = 0; i < expressionInputs.length; i++){
        expressionInputs[i].addEventListener('input', () => {
            let color = random(colors);
            if (isValidExpr(expressionInputs[i].value)){
                
                graphs[i] = [expressionInputs[i].value,drawNewGraph(expressionInputs[i].value), color];
                colors.splice(color.indexOf(color), 1);
            }else { 
                graphs.splice(i, 1);
                colors.push(color);
            }
             
        });
    }
    

    addInputEle.addEventListener('click', () => {
        let div1 = document.createElement('div');
        div1.classList.add('input-container');
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("exprInput");
        div1.append(newInput);
        let div2 = document.createElement('div');
        div2.classList.add('color-container');
        let div3 = document.createElement('div');
        div3.classList.add('color-circle');
        div2.append(div3);
        div1.append(div2);

        inputList.append(div1);
        
        expressionInputs = document.querySelectorAll(".exprInput");
        
        addEventListeners();
       
    })

    zoomInEle.addEventListener('click', () => {
        if (LineScale <=5){
            lineGap += 5
        }
        LineScale *= 1/2; 
        
        updateGraphs();
    });

    zoomOutEle.addEventListener('click', () => {
        
        if (lineGap > 20){
            lineGap -= 5;
        }
        
        LineScale *= 2;
        
        updateGraphs();
        
    })

    refreshBtn.addEventListener('click', () => {
        gridTranslation.sub(gridTranslation);
    });

    integrationEle.addEventListener('click', () => {
        if (mode === "area"){
            mode = "normal";
        }else {
            let interval = prompt("Enter interval(ex. [a, b])", "[0, 1]");
            integrationInterval = processInterval(interval);
            mode = "area";
            
            

            

            
        }
    });

    derivativeEle.addEventListener('click', () => {
        if (mode === "derivative"){
            mode = "normal";
            graphs.splice(1, 1);
            graphs.splice(1, 1);
        }else {
            mode = "derivative";
        }
    });

    rightSumEle.addEventListener('click', () => {
        integrationType = "right";
        rectangles.forEach(r => {
            rectangles.type = 'right'
        });
    });

    leftSumEle.addEventListener('click', () => {
        integrationType = "left";
        rectangles.forEach(r => {
            rectangles.type = 'left'
        });
    });

    derivative_slider.addEventListener('click', () => {
        let e = new Expression(graphs[0][0], graphs[0][0].includes('f(x)'));
        
        let d = e.getDerivative();
        drawTangentLineAt(derivative_slider.value, d);
    });

   
}









