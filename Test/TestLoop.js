const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`
                    // var a = 0;
                    // while(a<10)
                    // {
                    //     a = a + 1;
                    //     if(a == 5)
                    //         continue;    
                    //     print a;
                    // }
                    for (var a = 1; a < 3; a = a+1) {
                        for (var b = 10; b < 20; b = b+1) {
                            if(b == 15)
                                break;
                            print b;
                        }
                        print "===============";
                    }
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(statements)