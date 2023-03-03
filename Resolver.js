import { Lox } from "./Lox.js"

function Stack() {
    this.stack = []
    this.push = function(s) 
    {
        this.stack.push(s)
    }
    this.pop = function() 
    {
        if (this.empty()) 
        {
            throw "Pop of empty scope stack"
        } 
        else 
        {
            return this.stack.pop()
        }
    }
    this.peek = function() 
    {
        if (this.empty()) 
        {
            throw "Peek of empty scope stack"
        }
        else 
        {
            return this.stack[this.stack.length-1]
        }
    }
    this.empty = function() 
    {
        return this.stack.length === 0
    }
    this.get = function(i)
    {
        return this.stack[i]
    }
    this.size = function()
    {
        return this.stack.length
    }
}

const FunctionType = {
    "NONE" : "NONE",
    "FUNCTION" : "FUNCTION",
    "LAMBDA" : "LAMBDA",
}
  
export class Resolver {

    constructor(interpreter)
    {
        this.interpreter = interpreter
        this.scopes = new Stack()
        this.currentFunction = FunctionType.NONE
    }

    visitBlockStmt(stmt)
    {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }

    beginScope()
    {
        this.scopes.push({})
    }

    endScope()
    {
        this.scopes.pop()
    }

    visitVarStmt(stmt)
    {
        this.declare(stmt.name);
        if (stmt.initialize != null) 
        {
            this.resolveExpression(stmt.initialize);
        }
        this.define(stmt.name);
        return null;
    }

    visitFunctionStmt(stmt) {
        this.declare(stmt.name)
        this.define(stmt.name)
    
        this.resolveFunction(stmt, FunctionType.FUNCTION)
        return null
    }

    visitExpressionStmt(stmt)
    {
        this.resolveExpression(stmt.expression)
        return null
    }

    visitIfStmt(stmt)
    {
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.thenBranch)
        if(stmt.elseBranch)
        {
            this.resolveExpression(stmt.elseBranch)
        }
        return null
    }

    visitForStmt(stmt)
    {
        this.resolveExpression(stmt.initializer)
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.increment)
        this.resolveExpression(stmt.body)
        return null
    }

    visitWhileStmt(stmt)
    {
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.body)
        return null
    }

    visitBreakStmt(stmt)
    {
        return null
    }

    visitContinueStmt(stmt)
    {
        return null
    }

    visitPrintStmt(stmt)
    {
        this.resolveExpression(stmt.expression)
    }

    visitReturnStmt(stmt)
    {
        if(this.currentFunction == FunctionType.NONE)
        {
            Lox.parseError(expr.name, "Can't return from top-level code.")
        }

        if(stmt.value)
        {
            this.resolveExpression(stmt.value)
        }
        return null
    }

    visitWhileStmt(stmt)
    {
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.body)
        return null
    }

    visitAssignExpr(expr)
    {
        this.resolveExpression(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitBinaryExpr(expr)
    {
        this.resolveExpression(expr.left)
        this.resolveExpression(expr.right)
        return null
    }

    visitCallExpr(expr)
    {
        this.resolveExpression(expr.callee)

        for (const arg of expr.args) {
            this.resolveExpression(arg)
        }

        return null
    }

    visitLambdaExpr(expr)
    {
        this.resolveFunction(expr, FunctionType.LAMBDA)
        return null
    }

    visitGroupingExpr(expr)
    {
        this.resolveExpression(expr.expression)
        return null
    }

    visitLiteralExpr(expr)
    {
        return null
    }

    visitLogicalExpr(expr)
    {
        this.resolveExpression(expr.left)
        this.resolveExpression(expr.right)
        return null
    }

    visitUnaryExpr(expr)
    {
        this.resolveExpression(expr.right)
        return null
    }

    visitVariableExpr(expr)
    {
        if(this.scopes.empty()) return
        if(!this.scopes.empty() && this.scopes.peek()[expr.name.lexeme] == false)
        {
            Lox.parseError(expr.name, "Can't read local variable in its own initializer.")
        }
        this.resolveLocal(expr, expr.name);
        return null;
    }

    resolveLocal(expr, name) {
        for (let i = this.scopes.size() - 1; i >= 0; i--) {
            if (this.scopes.get(i)[name.lexeme]) {
                this.interpreter.resolve(expr, this.scopes.size() - 1 - i)
                return;
            }
        }
    }

    declare(name)
    {
        if(this.scopes.empty()) return
        let scope = this.scopes.peek()
        if(scope[name.lexeme])
        {
            Lox.parseError(name, "Already variable with this name in this scope.")
        }
        scope[name.lexeme] = false
    }

    define(name)
    {
        if(this.scopes.empty()) return
        this.scopes.peek()[name.lexeme] = true
    }

    resolve(statements)
    {
        for (const statement of statements) {
            this.resolveStatement(statement)
        }
    }

    resolveStatement(stmt)
    {
        stmt.accept(this)
    }

    resolveExpression(expr)
    {
        expr.accept(this)
    }

    resolveFunction(func, type)
    {
        let enclosingFunction = this.currentFunction
        this.currentFunction = type

        this.beginScope();
        for (const param of func.params) 
        {
            this.declare(param);
            this.define(param);
        }
        this.resolve(func.body);
        this.endScope();

        this.currentFunction = enclosingFunction
    }

}
