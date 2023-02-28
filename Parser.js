const {TokenType, Token} = require("./Token")
const Expr = require("./Expr")
const Lox = require("./Lox")

class Parser {

    constructor(tokens) {
        this.tokens = tokens
        this.current = 0
    }

    parse()
    {
        // try {
            return this.expression()
        // } catch (error) {
        //     return null
        // }
    }

    // expression     → equality ;
    expression()
    {
        return this.equality()
    }

    // equality       → comparison ( ( "!=" | "==" ) comparison )* ;
    equality()
    {
        let expr = this.comparion()

        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL))
        {
            const operator = this.previous()
            const right = this.comparion()
            expr = new Expr.Binary(expr, operator, right)
        }

        return expr
    }

    // comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
    comparion()
    {
        let expr = this.term()

        while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL))
        {
            const operator = this.previous()
            const right = this.term()
            expr = new Expr.Binary(expr, operator, right)
        }

        return expr
    }

    // term           → factor ( ( "-" | "+" ) factor )* ;
    term()
    {
        let expr = this.factor()

        while(this.match(TokenType.MINUS, TokenType.PLUS))
        {
            const operator = this.previous()
            const right = this.factor()
            expr = new Expr.Binary(expr, operator, right)
        }

        return expr
    }

    // factor         → unary ( ( "/" | "*" ) unary )* ;
    factor()
    {
        let expr = this.unary()

        while(this.match(TokenType.SLASH, TokenType.STAR))
        {
            const operator = this.previous()
            const right = this.unary()
            expr = new Expr.Binary(expr, operator, right)
        }

        return expr
    }

    // unary          → ( "!" | "-" ) unary
    //                  | primary ;
    unary()
    {
        if(this.match(TokenType.BANG, TokenType.MINUS))
        {
            const operator = this.previous()
            const right = this.unary()
            return new Expr.Unary(operator, right)
        }

        return this.primary()
    }

    // primary        → NUMBER | STRING | "true" | "false" | "nil"
    //                  | "(" expression ")" ;
    primary()
    {
        if (this.match(TokenType.FALSE)) return new Expr.Literal(false)
        if (this.match(TokenType.TRUE)) return new Expr.Literal(true)
        if (this.match(TokenType.NIL)) return new Expr.Literal(null)
    
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
          return new Expr.Literal(this.previous().literal)
        }
    
        if (this.match(TokenType.IDENTIFIER)) {
          return new Expr.Literal(this.previous())
        }
    
        if (this.match(TokenType.LEFT_PAREN)) {
          const expr = this.expression()
          this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
          return new Expr.Grouping(expr)
        }
    
        throw this.error(this.peek(), 'Expect expression.')
    }

    match()
    {
        const types = Array.prototype.slice.call(arguments)
        for (var index in types) {
            const type = types[index]
            if (this.check(type)) {
              this.advance()
              return true
            }
          }
        return false
    }

    consume(type, message)
    {
        if(this.check(type)) return this.advance()
        throw this.error(this.peek(), message)
    }

    check (type) 
    {
        if (this.isAtEnd()) {
            return false
        }
        return this.peek().type === type
    }

    advance () 
    {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }

    isAtEnd() 
    {
        return this.peek().type == TokenType.EOF;
    }
    
    peek() 
    {
        return this.tokens[this.current];
    }
    
    previous() 
    {
        return this.tokens[this.current - 1];
    }

    error(token, message)
    {
        Lox.error(token, message)
        return new ParseError()
    }

    synchronize()
    {
        this.advance()

        while(!this.isAtEnd()) 
        {
            if(this.previous().type == TokenType.SEMICOLON) return

            switch(this.peek().type)
            {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance()
        }
    }
}

class ParseError extends Error {
    constructor (message) 
    {
        super()
        Error.captureStackTrace(this, this.constructor)
        this.name = 'ParseError'
        this.message = message
    }
}

module.exports = Parser
  