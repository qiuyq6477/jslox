const Scanner = require("../Scanner")
const Parser = require("../Parser")
const Lox = require("../Lox")
const AstPrinter = require("../AstPrinter")
const Interpreter = require("../Interpreter")

const scanner = new Scanner(`

    // fun sayHi(first, last) {
    //     print "Hi, " + first + " " + last + "!";
    // }
    
    // sayHi("Dear", "Reader");

    // var start = clock();

    // fun fib(n) {
    //     if (n <= 1) return n;
    //     return fib(n - 2) + fib(n - 1);
    // }
      
    // for (var i = 0; i < 20; i = i + 1) {
    //     print fib(i);
    // }

    // var end = clock();

    // print end - start;


    fun makeCounter() {
        var i = 0;
        fun count() {
          i = i + 1;
          print i;
        }
      
        return count;
    }
    
    var counter = makeCounter();
    counter(); // "1".
    counter(); // "2".

                `)
const tokens = scanner.scanTokens()

const parser = new Parser(tokens,)
const statements = parser.parse()
if(Lox.hasError) return
const interpreter = new Interpreter()
interpreter.interpret(statements)