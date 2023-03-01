const { TokenType, Token } = require("./Token")


class Interpreter {
    
    interpret(statements)
    {
        for (const statement of statements) {
            this.execute(statement)
        }
    }

    execute(statement)
    {
        statement.accept(this)
    }

    visitExpressionStmt(stmt)
    {
        this.evaluate(stmt.expression)
        return null
    }

    visitPrintStmt(stmt)
    {
        const value = this.evaluate(stmt.expression)
        console.log(value)
        return null
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
                if (typeof left === 'string' || typeof right === 'string') 
                {
                    return left + right
                }
                if (typeof left === 'number' && typeof right === 'number') 
                {
                    return Number(left) + Number(right)
                }
                throw new RuntimeError(expr.operator, 'Operands must be two numbers or one strings.')
            case TokenType.GREATER: 
                this.checkOperands(expr.operator, left, right, "number", "string")
                return left > right
            case TokenType.GREATER_EQUAL: 
                this.checkOperands(expr.operator, left, right, "number", "string")
                return left >= right
            case TokenType.LESS: 
                this.checkOperands(expr.operator, left, right, "number", "string")
                return left < right
            case TokenType.LESS_EQUAL: 
                this.checkOperands(expr.operator, left, right, "number", "string")
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

    checkOperands (operator, left, right, operandTypes) {
        const types = Array.prototype.slice.call(arguments, 3)
        for (const type of types) {
            if (typeof left === type && typeof right === type) return
        }
        throw new RuntimeError(operator, 'Operands must be oneof [' + operandTypes + "].")    
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