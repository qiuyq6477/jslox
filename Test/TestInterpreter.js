const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`
                    "1" <= "1";
                    print "hello world";
                    print 1+2;

                    var a = 1;
                    {
                        var a = a + 1;
                        print a;
                    }
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(statements)