const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`
                    "1" <= "1";
                    print "hello world";
                    print 1+2;

                    var a = "global a";
                    var b = "global b";
                    var c = "global c";
                    {
                        var a = "outer a";
                        var b = "outer b";
                            {
                                var a = "inner a";
                                print a;
                                print b;
                                print c;
                            }
                        print a;
                        print b;
                        print c;
                    }
                    print a;
                    print b;
                    print c;
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(statements)