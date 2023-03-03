import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Resolver } from "../Src/Resolver.js"
import { Interpreter } from "../Src/Interpreter.js"


function main()
{
    const scanner = new Scanner(`

    // fun sayHi(first, last) {
    //     print "Hi, " + first + " " + last + "!";
    // }

    // sayHi("Dear", "Reader");

    // =========================================
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

    // =========================================

    // fun makeCounter() {
    //     var i = 0;
    //     fun count() {
    //       i = i + 1;
    //       print i;
    //     }
    
    //     return count;
    // }

    // var counter = makeCounter();
    // counter(); // "1".
    // counter(); // "2".

    // =========================================
    var a = "global";
    fun scope(a) {
        var a = "local";
        print a;
    }
    scope(a);
                `)
    const tokens = scanner.scanTokens()

    const parser = new Parser(tokens)
    const statements = parser.parse()
    if(Lox.hasError) return
    const interpreter = new Interpreter()
    const resolver = new Resolver(interpreter)
    resolver.resolve(statements)
    if(Lox.hasError) return
    interpreter.interpret(statements)
}

main()