import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Interpreter } from "../Src/Interpreter.js"

function main()
{
    const scanner = new Scanner(`
    class DevonshireCream {
        serveOn() {
          return "Scones";
        }
      }
      
    print DevonshireCream; // Prints "DevonshireCream".

    var ins = DevonshireCream();
    print ins;
                `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    const interpreter = new Interpreter()
    interpreter.interpret(statements)
}

main()