import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { AstPrinter } from "../Src/AstPrinter.js"

function main()
{
    const scanner = new Scanner(`
    1+2*3, 1+1>0 ? 1 : 2;
    `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    console.log(new AstPrinter().print(statements))
}

main()