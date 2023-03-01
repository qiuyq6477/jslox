const {TokenType, Token} = require("./Token")
const Expr = require("./Expr")
const Stmt = require("./Stmt")
const Lox = require("./Lox")

class Parser {

    constructor(tokens) {
        this.tokens = tokens
        this.current = 0
    }

    parse()
    {
        let statements = []

        while(!this.isAtEnd())
        {
            statements.push(this.declaration())
        }

        return statements
    }

    // declaration    → varDecl
    //                 | statement ;
    declaration()
    {
        if(this.match(TokenType.VAR))
        {
            return this.varDeclaration()
        }
        return this.statement()
    }

    varDeclaration()
    {
        const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

        let initializer = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    }


    // statement      → exprStmt
    //                | ifStmt
    //                | whileStmt
    //                | forStmt
    //                | printStmt ;
    //                | block
    statement()
    {
        if(this.match(TokenType.FOR))
        {
            return this.forStatement()
        }
        if(this.match(TokenType.IF))
        {
            return this.ifStatement()
        }
        if(this.match(TokenType.PRINT))
        {
            return this.printStatement()   
        }
        if(this.match(TokenType.WHILE))
        {
            return this.whileStatement()   
        }
        if(this.match(TokenType.LEFT_BRACE))
        {
            return new Stmt.Block(this.block())
        }
        return this.expressionStatement()
    }
    
    // forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
    //                  expression? ";"
    //                  expression? ")" statement ;
    forStatement()
    {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

        let initializer;
        if (this.match(TokenType.SEMICOLON)) 
        {
            initializer = null;
        } else if (this.match(TokenType.VAR)) 
        {
            initializer = this.varDeclaration();
        } else 
        {
            initializer = this.expressionStatement();
        }

        let condition = null;
        if (!this.check(TokenType.SEMICOLON)) 
        {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

        let increment = null;
        if (!this.check(TokenType.RIGHT_PAREN)) 
        {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

        let body = this.statement();

        if (increment != null) 
        {
            body = new Stmt.Block([body, new Stmt.Expression(increment)]);
        }
        if (condition == null) 
        {
            condition = new Expr.Literal(true);
        }
        body = new Stmt.While(condition, body);
        if (initializer != null) 
        {
            body = new Stmt.Block([initializer, body]);
        }
        return body;
    }

    // whileStmt      → "while" "(" expression ")" statement ;
    whileStatement()
    {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();
    
        return new Stmt.While(condition, body);
    }

    // ifStmt         → "if" "(" expression ")" statement
    //                ( "else" statement )? ;
    ifStatement()
    {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.")
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition."); 

        const thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }

        return new Stmt.If(condition, thenBranch, elseBranch);
    }

    // block          → "{" declaration* "}" ;
    block()
    {
        let statements = []
        while(!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd())
        {
            statements.push(this.declaration())
        }
        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.")
        return statements
    }

    printStatement()
    {
        const value = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.")
        return new Stmt.Print(value)
    }

    expressionStatement()
    {
        const expression = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
        return new Stmt.Expression(expression)
    }

    // expression     → assignment ;
    expression()
    {
        return this.assignment()
    }

    // assignment     → IDENTIFIER "=" assignment
    //                | logic_or ( "," logic_or )* ;
    //                | logic_or "?" logic_or ":" logic_or ;
    //                | logic_or
    assignment()
    {
        let expr = this.logic_or()
        
        if(this.match(TokenType.EQUAL))
        {
            const equals = this.previous()
            const value = this.assignment()

            if(expr instanceof Expr.Variable)
            {
                const name = expr.name
                return new Expr.Assign(name, value)
            }

            this.error(equals, 'Invalid assignment target.')
        }

        while(this.match(TokenType.COMMA))
        {
            expr = this.logic_or()
        }

        while(this.match(TokenType.QUESTION_MARK))
        {
            const condition = expr
            const left = this.logic_or()
            this.consume(TokenType.COLON, "Expect ':' after expression.")
            const right = this.logic_or()
            expr = new Expr.Ternary(condition, left, right)
        }

        return expr
    }

    // logic_or       → logic_and ( "or" logic_and )* ;    
    logic_or()
    {
        const expr = this.logic_and()
        while(this.match(TokenType.OR))
        {
            const operator = this.previous()
            const right = this.logic_and()
            expr = new Expr.Logical(expr, operator, right)
        }
        return expr
    }

    // logic_and      → equality ( "and" equality )* ;
    logic_and()
    {
        const expr = this.equality()
        while(this.match(TokenType.AND))
        {
            const operator = this.previous()
            const right = this.equality()
            expr = new Expr.Logical(expr, operator, right)
        }
        return expr
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
          return new Expr.Variable(this.previous())
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
  