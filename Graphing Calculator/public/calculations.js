



class Expression {
    constructor(expression, isFunction){
        this.expr = isFunction ? expression.replace("f(x)", "y") : expression;
        this.e_Parsed = math.parse(this.expr);
        this.e_Compiled = this.e_Parsed.compile();
    }

    eval_at(x_val){
        return this.e_Compiled.evaluate({x:x_val});
    }

    getDerivative(){
        let e = this.expr.split('').filter(val => val != " ")
            .filter(val => val != "y").filter(val => val != "=").join('');
        
        return math.derivative(e, 'x');
        
    }
};

function isValidExpr(expr){
    if (expr.includes("f(x) = ") || expr.includes("f(x)=")){
        if(expr.slice(4, expr.length).includes("x")){
            return true;
        }
    }else if ((expr.includes("y = ") || expr.includes("y="))){
        if (expr.slice(1, expr.length).includes("x")){
            return true;
        }
    }else {
        return false;
    }
}













