
class AstPrinter {
    print (expr) 
    {
        return expr.accept(this)
    }

    visitBinaryExpr (expr) 
    {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
    }

    visitTernaryExpr (expr) 
    {
        return this.parenthesize("?:", expr.condition, expr.left, expr.right)
    }

    visitGroupingExpr (expr) 
    {
        return this.parenthesize('group', expr.expression)
    }

    visitLiteralExpr (expr) 
    {
        return expr.value.toString()
    }

    visitUnaryExpr (expr) 
    {
        return this.parenthesize(expr.operator.lexeme, expr.right)
    }

    parenthesize (name) 
    {
        const exprs = Array.prototype.slice.call(arguments, 1)
        var str = `(${name}`

        exprs.forEach(expr => {
            str += ` ${expr.accept(this)}`
        })

        str += ')'
        return str
    }
}

module.exports = AstPrinter