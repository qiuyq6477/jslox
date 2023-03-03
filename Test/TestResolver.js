import { Scanner } from "../Scanner.js"
import { Parser } from "../Parser.js"
import { Lox } from "../Lox.js"
import { Resolver } from "../Resolver.js"
import { Interpreter } from "../Interpreter.js"

function main()
{
    const scanner = new Scanner(`
    var a = "global";
    fun scope(a) {
        a = "local";
        print a;
    }
    scope(a);
                `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    const interpreter = new Interpreter()
    const resolver = new Resolver(interpreter)
    resolver.resolve(statements)
    if(Lox.hasError) return
    interpreter.interpret(statements)
}

main()