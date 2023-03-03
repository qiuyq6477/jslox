import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Resolver } from "../Src/Resolver.js"
import { Interpreter } from "../Src/Interpreter.js"

function main()
{
    const scanner = new Scanner(`
    // var a = "global";
    // fun scope(a) {
    //     var a = "local";
    //     print a;
    // }
    // scope(a);

    // var a = "outer";
    // {
    //     var a = "inner";
    //     print a;
    // }


    var a = "global";
    {
        fun showA() {
            print a;
        }

        showA();
        var a = "block";
        showA();
    }

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