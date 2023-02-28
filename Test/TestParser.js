const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")

const scanner = new Scanner(`
                    1+2*3
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const expression = parser.parse()
if(Lox.hasError) return
console.log(new AstPrinter().print(expression))