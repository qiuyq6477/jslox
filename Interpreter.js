const { TokenType, Token } = require("./Token")


class Interpreter {
    
    interpret(expression)
    {
        const value = this.evaluate(expression)
        console.log(value)
    }

    visitBinaryExpr (expr) 
    {
        const left = this.evaluate(expr.left)
        const right = this.evaluate(expr.right)

        switch(expr.operator.type)
        {
            case TokenType.MINUS: 
                this.checkNumberOperands(expr.operator, left, right)
                return left - right
            case TokenType.SLASH: 
                this.checkNumberOperands(expr.operator, left, right)
                if (Number(right) === 0) {
                    throw new RuntimeError(expr.operator, 'Unable to divide by zero.')
                }
                return left / right
            case TokenType.STAR: 
                this.checkNumberOperands(expr.operator, left, right)
                return left * right
            case TokenType.PLUS: 
                if (typeof left === 'number' || typeof right === 'number') 
                {
                    return Number(left) + Number(right)
                }
                if (typeof left === 'string' && typeof right === 'string') 
                {
                    return left + right
                }
                throw new RuntimeError(expr.operator, 'Operands must be two numbers or two strings.')
            case TokenType.GREATER: 
                this.checkNumberOperands(expr.operator, left, right)
                return left > right
            case TokenType.GREATER_EQUAL: 
                this.checkNumberOperands(expr.operator, left, right)
                return left >= right
            case TokenType.LESS: 
                this.checkNumberOperands(expr.operator, left, right)
                return left < right
            case TokenType.LESS_EQUAL: 
                this.checkNumberOperands(expr.operator, left, right)
                return left <= right
            case TokenType.BANG_EQUAL: return !this.isEqual(left, right)
            case TokenType.EQUAL_EQUAL: return this.isEqual(left, right)

        }
        
        return null
    }

    visitTernaryExpr (expr) 
    {
    }

    visitGroupingExpr (expr) 
    {
        return this.evaluate(expr.expression)
    }

    visitLiteralExpr (expr) 
    {
        return expr.value
    }

    visitUnaryExpr (expr) 
    {
        const right = this.evaluate(expr.right)

        switch(expr.operator.type)
        {
            case TokenType.MINUS: 
                this.checkNumberOperand(expr.operator, right)
                return -right
            case TokenType.BANG: return !this.isTruthy(right)
        }

        return null
    }

    checkNumberOperand(operator, operand)
    {
        if(typeof operand == "number") return
        throw new RuntimeError(operator, "Operand must be a numberf")
    }

    checkNumberOperands (operator, left, right) {
        if (typeof left === 'number' && typeof right === 'number') return
        throw new RuntimeError(operator, 'Operands must be a numbers.')
    }

    evaluate(expr)
    {
        return expr.accept(this)
    }

    isTruthy(expr)
    {
        if(expr == null) return false
        if(typeof expr == "boolean") return expr
        return true
    }

    isEqual(left, right)
    {
        return left === right
    }
}


class RuntimeError extends Error {
    constructor (token, message) 
    {
        super(message)
        this.token = token
    }
}

module.exports = Interpreter