const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`
                    1 + 1 > 1
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const expression = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(expression)