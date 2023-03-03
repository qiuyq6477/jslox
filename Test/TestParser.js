import { Scanner } from "../Scanner.js"
import { Parser } from "../Parser.js"
import { Lox } from "../Lox.js"
import { AstPrinter } from "../AstPrinter.js"

function main()
{
    const scanner = new Scanner(`
    1+2*3, 1+1>0 ? 1 : 2
    `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    console.log(new AstPrinter().print(statements))
}

main()