import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Interpreter } from "../Src/Interpreter.js"
import { Resolver } from "../Src/Resolver.js"


function main()
{
    const scanner = new Scanner(`
    class Doughnut {
        cook() {
            print "Fry until golden brown.";
        }
    }
    
    class BostonCream < Doughnut {
        cook() {
            super.cook();
            print "Pipe full of custard and coat with chocolate.";
        }
    }
      
    BostonCream().cook();

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