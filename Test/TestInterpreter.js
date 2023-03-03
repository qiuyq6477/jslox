import { Scanner } from "../Scanner.js"
import { Parser } from "../Parser.js"
import { Lox } from "../Lox.js"
import { Interpreter } from "../Interpreter.js"

function main()
{
    const scanner = new Scanner(`
                    "1" <= "1";
                    print "hello world";
                    print 1+2;
                `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    const interpreter = new Interpreter()
    interpreter.interpret(statements)
}

main()