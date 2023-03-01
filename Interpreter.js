const { TokenType, Token } = require("./Token")
const RuntimeError = require('./RuntimeError')
const Environment = require('./Environment')


class Interpreter {
    
    constructor()
    {
        this.env = new Environment()
    }

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

    executeBlock(statements, env)
    {
        let previous = this.env
        try {
            this.env = env
            for (const statement of statements) {
                this.execute(statement)
            }
        }
        finally {
            this.env = previous
        }
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

    visitVarStmt(stmt)
    {
        let value = null
        if(stmt.initialize != null)
        {
            value = this.evaluate(stmt.initialize)
        }    
        this.env.define(stmt.name.lexeme, value)
        return null 
    }

    visitBlockStmt(stmt)
    {
        this.executeBlock(stmt.statements, new Environment(this.env))
        return null
    }

    visitAssignExpr(expr)
    {
        const value = this.evaluate(expr.value)
        this.env.assign(expr.name, value)
        return value
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

    visitVariableExpr(expr)
    {
        return this.env.get(expr.name)
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

module.exports = Interpreter