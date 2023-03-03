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
    "METHOD" : "METHOD",
    "LAMBDA" : "LAMBDA",
    "INITIALIZER" : "INITIALIZER",
}

const LoopType = {
    "NONE" : "NONE",
    "FOR" : "FOR",
    "WHILE" : "WHILE",
}
  
const ClassType = {
    "NONE" : "NONE",
    "CLASS" : "CLASS",
}

/**
 * TODO:
 * 1, 对解析器进行扩展，如果局部变量没有被使用就报告一个错误。
 * 2, 将局部变量保存在一个数组中，并通过索引来查找它们。
 *    扩展解析器，为作用域中声明的每个局部变量关联一个唯一的索引。
 *    当解析一个变量的访问时，查找变量所在的作用域及对应的索引，并保存起来。
 *    在解释器中，使用这个索引快速的访问一个变量。
 */
export class Resolver {

    constructor(interpreter)
    {
        this.interpreter = interpreter
        this.scopes = new Stack()
        this.currentFunction = FunctionType.NONE
        this.currentLoop = LoopType.NONE
        this.currentClass = ClassType.NONE
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

    visitClassStmt(stmt)
    {
        let enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASS;

        this.declare(stmt.name)
        this.define(stmt.name)
        this.beginScope()
        this.scopes.peek()["this"] = true
        for (const method of stmt.methods) {
            let declaration = FunctionType.METHOD
            if (method.name.lexeme === "init") {
                declaration = FunctionType.INITIALIZER;
            }
            this.resolveFunction(method, declaration)
        }
        this.endScope()

        this.currentClass = enclosingClass
        return null
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
        this.currentLoop = LoopType.FOR
        this.resolveExpression(stmt.initializer)
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.increment)
        this.resolveExpression(stmt.body)
        this.currentLoop = LoopType.NONE
        return null
    }

    visitWhileStmt(stmt)
    {
        this.currentLoop = LoopType.WHILE
        this.resolveExpression(stmt.condition)
        this.resolveExpression(stmt.body)
        this.currentLoop = LoopType.NONE
        return null
    }

    visitBreakStmt(stmt)
    {
        if(this.currentLoop == LoopType.NONE)
        {
            Lox.parseError(stmt.name, "Only break in loop.")
        }
        return null
    }

    visitContinueStmt(stmt)
    {
        if(this.currentLoop == LoopType.NONE)
        {
            Lox.parseError(stmt.name, "Only continue in loop.")
        }
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
            if (this.currentFunction == FunctionType.INITIALIZER) 
            {
                Lox.error(stmt.keyword, "Can't return a value from an initializer.");
            }
            this.resolveExpression(stmt.value)
        }
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

    visitGetExpr(expr)
    {
        this.resolveExpression(expr.object)
        return null
    }

    visitSetExpr (expr)
    {
        this.resolveExpression(expr.object)
        this.resolveExpression(expr.value)
        return null
    }

    visitThisExpr (expr)
    {
        if(this.currentClass == ClassType.NONE)
        {
            Lox.error(expr.keyword, "Can't use 'this' outside of a class.");
            return null;
        }
        this.resolveLocal(expr, expr.keyword)
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
