const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")

const scanner = new Scanner(`
                    1+2*3, 1+1>0 ? 1 : 2
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
console.log(new AstPrinter().print(statements))