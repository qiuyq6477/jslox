const {TokenType, Token} = require("./Token")

class Parser {

    constructor(tokens) {
        this.tokens = tokens
        this.current = 0
    }

    expression()
    {
        return this.equality()
    }

    equality()
    {
        const expr = this.comparion()

        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL))
        {
            const operator = this.previous()
            const right = this.comparion()
            expr = new expr.Binary(expr, operator, right)
        }

        return expr
    }

}