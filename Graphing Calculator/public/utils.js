
function addText(param, x, y){
    stroke(0);
    textSize(12);
    textFont('sans-serif');
    textAlign(CENTER, CENTER);
    noStroke();
    
    text(param, x, y);
}

function draw_Grid(){
    stroke(0);


    stroke(230, 230, 230, 255);
    

    let i = 0;
    for (let x = width/2; x < graphLimit; x+=lineGap){
        if (i % 4 == 0){
            let num = (i/4)*LineScale;
            stroke(150, 150, 150, 255);
            line(x, -graphLimit, x, graphLimit);

            if (num != 0){
                addText(`${num}`, x, height/2 + 10);
            }

            
        }else {
            stroke(230, 230, 230, 255);

            line(x, -graphLimit, x, graphLimit);
        }
       
        i++;

    
    }
    i = 0;

    for (let x = width/2; x > -graphLimit; x -= lineGap){
        if (i % 4 == 0){
            let num = (i/4)*LineScale * -1;
            stroke(150, 150, 150, 255);
            line(x, graphLimit, x, -graphLimit);
            
            if (num != 0){
                addText(`${num}`, x, height/2 + 10);
            }
            
        }else {
            stroke(230, 230, 230, 255);
            line(x, graphLimit, x, -graphLimit);
        }

        i++;
    }
    i = 0;
    for (let y = height/2; y < graphLimit; y += lineGap){
        if (i % 4 == 0){
            stroke(150, 150, 150, 255);
            line(-graphLimit, y, graphLimit, y);

            let num = (i/4*LineScale*-1);
            if (num != 0){
                addText(`${num}`, width/2-10, y);
            }


        }else {
            stroke(230, 230, 230, 255);
            line(-graphLimit, y, graphLimit, y);
        }
        
        i++;
    } 
    i = 0;
    for (let y = height/2; y > -graphLimit; y -= lineGap){
        if (i % 4 == 0){
            stroke(150, 150, 150, 255);
            line(-graphLimit, y, graphLimit, y);

            let num = (i/4*LineScale);
            if (num != 0){
                addText(`${num}`, width/2-10, y);
            }
        }else {
            stroke(230, 230, 230, 255);
            line(-graphLimit, y, graphLimit, y);
        }
        i++;
        
    }

    stroke(0);
    line(width/2, -graphLimit, width/2, graphLimit);
    line(-graphLimit, height/2, graphLimit, height/2);


};

function drawNewGraph(expression){
    if (isValidExpr(expression)){
        const expr = new Expression(expression, expression.includes("f(x)"));
        
        let points = [];
        

        for (var i = 0; i < lineGap+50; i += 0.0005){
            let x = width/2 + (i * lineGap * (4/LineScale));
            let y = height/2 + (-expr.eval_at(i) * lineGap * (4/LineScale));
            
            points.push(createVector(x, y));
        
        }
        for (let i = 0; i < lineGap+50; i += 0.0005){
            let x = width/2 + (-i * lineGap * (4/LineScale));
            let y = height/2 + (-expr.eval_at(-i) * lineGap * (4/LineScale));
            
            points.push(createVector(x, y));
            
        }
        return points;
    } 
};

function updateGraphs(){
    for (let i = 0; i < expressionInputs.length; i++){
        if (expressionInputs[i].length == 0) continue;

        if(isValidExpr(expressionInputs[i].value)){
            let c = graphs[i][2];
            graphs[i] = [expressionInputs[i].value, drawNewGraph(expressionInputs[i].value), c];
        }
    }
    if (mode == "derivative"){
        graphs[1] = [graphs[1][0], drawNewGraph(graphs[1][0]), graphs[1][2]];
        graphs[2] = [graphs[2][0], drawNewGraph(graphs[2][0]), graphs[2][2]];
    }
};

function updateSettings(){
    N = Number(integrationSlider.value);
    n_val_Ele.innerHTML = N;
    interval_val_Ele.innerHTML = ((integrationInterval[1] - integrationInterval[0])/N).toFixed(2);
    //do area calculation

   
    
};

function drawRectangles(){
    push();
    fill(190, 190, 190, 150);
    stroke(50, 150);
    for (const r  of rectangles){
        if (integrationType == "left"){
            rect(r.x, r.y, r.width*lineGap*(4/LineScale), r.height);
        }else {
            rect(rect(r.x-r.width*lineGap*(4/LineScale), r.y, r.width*lineGap*(4/LineScale), r.height))
        }
        
    }

    pop();
};

function drawPoints(){
    let i = 0;
    
    for (let [key, values, color] of graphs){

        let displayCircles = document.querySelectorAll('.color-circle');
        if (graphs.length <= displayCircles.length){
            displayCircles[i].style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
        
        push();
        fill(color[0], color[1], color[2]);
        noStroke();
        let inteval_point = undefined;
        values.forEach(pt => {
            let pos = p5.Vector.add(gridTranslation, pt);
            if (pos.x <= width && pos.x >= 0 && pos.y >= 0 && pos.y <= height){
                let x = getGridCoordinates(pt).x; // revert coordinates
                if (mode == 'area' && Math.floor(x) == integrationInterval[1] && inteval_point == undefined){
                    inteval_point = pt;
                }
                // let isHoveredOver = getPointMouseInterception(pos, createVector(mouseX, mouseY));
                // if (isHoveredOver != null){
                //     point_hovered = pt;
                //     displayPoint(getGridCoordinates(pt));
                // }else if (point_hovered != null){
                //     if (point_hovered === pt){
                //         point_display.classList.add('hidden');
                //     }
                // }
                
                ellipse(pt.x, pt.y, lineWidth);
            }
        });

        if (inteval_point){
            stroke(0);
            strokeWeight(lineWidth*1.05);
            line(inteval_point.x, inteval_point.y, inteval_point.x, (height/2-inteval_point.y) + inteval_point.y);
        };
        pop();
        i ++;

    };
}

function processInterval(str){
    let interval = [];

    let i = 0;
    let curNum = "";
   
    while (i < str.length) {
        if ((str[i] == ' ' || str[i] == "[" || str[i] == "]" || str[i] == ",") && curNum.length != 0){
            interval.push(Number(curNum));
            curNum = "";
        }else if (!(str[i] == ' ' || str[i] == "[" || str[i] == "]" || str[i] == ",")) {
            curNum += str[i];
        }
        i++;
    }

    return interval;
}

function getRiemannRectangles(a, b, n){
    var delta_x = (b-a)/n;
    var cur_rectangles = [];
    var length = 0;

    if (a < 0 ){
        for (let i = graphs[0][1].length - 1; i >= 0; i--){
            if (cur_rectangles.length < n){
                
                var pt = graphs[0][1][i];
                let x = getGridCoordinates(pt).x;
                
                if (isClose(x, a + (length*delta_x), 0.0005)){
                    
                   
                    
                    cur_rectangles.push({
                        x: pt.x,
                        y: pt.y,
                        type: "left",
                        width:delta_x,
                        height: (height/2-pt.y)
                    });
                    length ++;
                    
                }
    
    
            }
                
        }
    }else {
        for (let i = 0; i < graphs[0][1].length; i++){
            if (cur_rectangles.length < n){
                
                var pt = graphs[0][1][i];
                let x = getGridCoordinates(pt).x;
                
                if (isClose(x, a + (length*delta_x), 0.0005)){
                    
                   
                    
                    cur_rectangles.push({
                        x: pt.x,
                        y: pt.y,
                        type: "left",
                        width:delta_x,
                        height: (height/2-pt.y)
                    });
                    length ++;
                    
                }
    
    
            }
                
        }

    }
    

    
    
    return cur_rectangles;


}

function isClose(x, n, threshhold){


    if (n < 0) {
        if (n >= x - threshhold && n <= x + threshhold){
            // console.log(x, n);
            return true;
            
        }else {
            return false;
        }

    }else {
        if (x + threshhold >= n || x - threshhold >= n || x == n){
            return true;
        }else {
            return false;
        }
    }
   
    
    


    
}

function calculateArea(arr){
    let area = 0;

    for (let i = 0; i < arr.length; i++){
        
        let pos = getGridCoordinates(arr[i]);
        

        let rect_width = ((integrationInterval[1] - integrationInterval[0])/N);
        
        let rect_height = (-1*pos.y);
        
        area += rect_width * rect_height;
        
    };

    return area;
}

function drawTangentLineAt(x_pos, deriv){
    let pt;
    

    for (let i = 0; i < graphs[0][1].length; i++){
        let coords = getGridCoordinates(graphs[0][1][i]);

        if (isClose(coords.x, x_pos, 0.0000005)){
            
            pt = graphs[0][1][i].copy();
            break;
        }
    };
    let m = deriv.evaluate({x:x_pos});
    let c = getGridCoordinates(pt);
    var equation = `y = ${m}*x ${(-1*m*c.x.toFixed(2)) + -c.y.toFixed(2)}`;
        
    
    graphs[2] = [equation, drawNewGraph(equation), random(colors)];
    
    


}

function getGridCoordinates(pt){
    
    let res = {
        x: ((pt.x - width/2)* (1/(lineGap*(4/LineScale)))),
        y: ((pt.y - height/2)* (1/(lineGap*(4/LineScale))))
    };
    

    return res
}

function getPointMouseInterception(pt, m_pos){
    let distance = dist(pt.x, pt.y, m_pos.x, m_pos.y);
    if (distance < lineWidth){
        return createVector(pt.x, pt.y);
    }else {
        return null;
    }
}


// function displayPoint(pt){

//     point_display.classList.remove('hidden');
//     let top = (100*(winMouseY/window.innerHeight)).toFixed(2);
//     let left = (100*(winMouseX/window.innerWidth)).toFixed(2);
//     point_display.style.top = `${top}%`;
//     point_display.style.left = `${left}%`;
    
//     point_x_display.innerHTML = String((pt.x).toFixed(2));
//     point_y_display.innerHTML = String((pt.y *-1).toFixed(2));

// }



