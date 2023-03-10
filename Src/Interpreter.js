import { TokenType, Token } from "./Token.js"
import { RuntimeError } from "./RuntimeError.js"
import { Environment } from "./Environment.js"
import { Return } from "./Return.js"
import { LoxFunction, LocalFunction } from "./LoxFunction.js"
import { LoxCallable } from "./LoxCallable.js"
import { LoxClass } from "./LoxClass.js"
import { LoxInstance } from "./LoxInstance.js"

export class Interpreter {
    
    constructor()
    {
        this.globals = new Environment()
        this.env = this.globals
        this.locals = new Map()

        this.globals.define("clock", new LocalFunction("clock", 0, () => { return Date.now() / 1000 }))

        this.loop_state = null
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

    resolve(expr, depth)
    {
        this.locals.set(expr, depth)
    }

    executeBlock(statements, env)
    {
        let previous = this.env
        try {
            this.env = env
            for (const statement of statements) {
                this.execute(statement)
                if(this.loop_state == "break" || this.loop_state == "continue")
                {
                    break
                }
            }
        }
        finally {
            this.env = previous
        }
    }

    visitClassStmt(stmt)
    {
        let superclass = null;
        if (stmt.superclass != null) 
        {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof LoxClass)) 
            {
                throw new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }

        this.env.define(stmt.name.lexeme, null)
       
        if (stmt.superclass != null) {
            this.env = new Environment(this.env)
            this.env.define("super", superclass)
        }

        let methods = {}
        for (const method of stmt.methods) {
            const func = new LoxFunction(method, this.env, method.name.lexeme === "init")
            methods[method.name.lexeme] = func
        }

        const klass = new LoxClass(stmt.name.lexeme, superclass, methods)

        if (stmt.superclass != null) {
            this.env = this.env.enclosing
        }

        this.env.assign(stmt.name, klass)
        return null
    }

    visitBreakStmt(stmt)
    {
        if(this.loop_state)
        {
            this.loop_state = "break"
            return
        }
        throw new RuntimeError(stmt, "break must be in loop.")
    }

    visitContinueStmt(stmt)
    {
        if(this.loop_state)
        {
            this.loop_state = "continue"
            return
        }
        throw new RuntimeError(stmt, "continue must be in loop")
    }

    visitExpressionStmt(stmt)
    {
        this.evaluate(stmt.expression)
        return null
    }

    visitFunctionStmt(stmt)
    {
        const func = new LoxFunction(stmt, this.env, false)
        this.env.define(stmt.name.lexeme, func)
        return null
    }

    visitIfStmt(stmt)
    {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }

    visitWhileStmt(stmt)
    {
        while (this.isTruthy(this.evaluate(stmt.condition))) 
        {
            this.loop_state = "loop"
            this.execute(stmt.body);
            if(this.loop_state == "break")
            {
                break
            }
        }
        this.loop_state = null
        return null;
    }

    visitForStmt(stmt)
    {
        if(stmt.initializer)
        {
            this.execute(stmt.initializer);
        }
        while (this.isTruthy(this.evaluate(stmt.condition))) 
        {
            this.loop_state = "loop"
            this.execute(stmt.body);
            if(this.loop_state == "break")
            {
                break
            }
            this.execute(stmt.increment);
        }
        this.loop_state = null
        return null;
    }

    visitPrintStmt(stmt)
    {
        const value = this.evaluate(stmt.expression)
        console.log(value.toString())
        return null
    }

    visitReturnStmt(stmt)
    {
        let value = null
        if(stmt.value) 
        {
            value = this.evaluate(stmt.value)
        }
        throw new Return(value)
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
        const distance = this.locals.get(expr)
        if(distance != null)
        {
            this.env.assignAt(distance, expr.name, value)
        }
        else
        {
            this.globals.assign(expr.name, value)
        }
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

    visitCallExpr (expr)
    {
        const callee = this.evaluate(expr.callee)
        const args = expr.args.map(arg => this.evaluate(arg))

        if (!(callee instanceof LoxCallable)) {
            throw new RuntimeError(expr.paren,
              'Can only call functions and classes.')
        }

        if (args.length != callee.arity()) {
            throw new RuntimeError(expr.paren, `Expected ${callee.arity()} arguments but got ${args.length}.`)
        }

        return callee.call(this, args)
    }

    visitGetExpr (expr)
    {
        const object = this.evaluate(expr.object);
        if (object instanceof LoxInstance) {
          return object.get(expr.name);
        }
    
        throw new RuntimeError(expr.name, "Only instances have properties.");
    }

    visitSetExpr (expr)
    {
        const object = this.evaluate(expr.object)
        if(!(object instanceof LoxInstance))
        {
            throw new RuntimeError(expr.name, "Only instances have fields.")
        }
        const value = this.evaluate(expr.value)
        object.set(expr.name, value)
        return value
    }

    visitThisExpr (expr)
    {
        return this.lookUpVariable(expr.keyword, expr)
    }

    visitSuperExpr (expr)
    {
        const distance = this.locals.get(expr)
        const superclass = this.env.getAt(distance, "super")
        const object = this.env.getAt(distance - 1, "this")
        const method = superclass.findMethod(expr.method.lexeme)
        if (method == null) {
            throw new RuntimeError(expr.method, "Undefined property '" + expr.method.lexeme + "'.");
        }
        return method.bind(object)
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

    visitLogicalExpr (expr)
    {
        const left = this.evaluate(expr.left)
        if(expr.operand.type == TokenType.OR)
        {
            if(this.isTruthy(left))
            {
                return left
            }
        }
        else if(expr.operand.type == TokenType.AND)
        {
            if(!this.isTruthy(left))
            {
                return left
            }
        }
        return this.evaluate(expr.right)
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
        const value = this.lookUpVariable(expr.name, expr) // this.env.get(expr.name)
        if(value == null)
        {
            throw new RuntimeError(expr, "Varialbe " + expr.name.lexeme + " must be init.")
        }
        return value
    }

    lookUpVariable(name, expr)
    {
        let distance = this.locals.get(expr)
        if(distance != null)
        {
            return this.env.getAt(distance, name.lexeme)
        }
        else
        {
            return this.globals.get(name)
        }
    }

    visitLambdaExpr(expr)
    {
        return new LoxFunction(expr, this.env, false)
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
