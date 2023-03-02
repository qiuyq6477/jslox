const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`

    var sayHi = fun(first, last) {
        print "Hi, " + first + " " + last + "!";
    };
    
    sayHi("Dear", "Reader");

    fun thrice(fn) {
        for (var i = 1; i <= 3; i = i + 1) {
          fn(i);
        }
    }
      
    thrice(fun (a) {
        print a;
    });
                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(statements)