import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Resolver } from "../Src/Resolver.js"
import { Interpreter } from "../Src/Interpreter.js"

function main()
{
    const scanner = new Scanner(`
    var a = 0;
    while(a<10)
    {
        a = a + 1;
        if(a == 5)
            continue;    
        print a;
    }
    // for (var a = 1; a < 3; a = a+1) {
    //     for (var b = 10; b < 20; b = b+1) {
    //         if(b == 15)
    //             break;
    //         print b;
    //     }
    //     print "===============";
    // }
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