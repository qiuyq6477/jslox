import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Resolver } from "../Src/Resolver.js"
import { Interpreter } from "../Src/Interpreter.js"


function main()
{
        
    const scanner = new Scanner(`

    var sayHi = fun(first, last) {
        print "Hi, " + first + " " + last + "!";
    };

    sayHi("Dear", "Reader");

    fun thrice(fn) {
        for (var i = 1; i <= 3; i = i + 1) {
        fn(i);
        }
    }
    
    thrice(fun (a) {
        print a;
    });
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