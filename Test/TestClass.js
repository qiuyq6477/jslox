import { Scanner } from "../Src/Scanner.js"
import { Parser } from "../Src/Parser.js"
import { Lox } from "../Src/Lox.js"
import { Interpreter } from "../Src/Interpreter.js"
import { Resolver } from "../Src/Resolver.js"


function main()
{
    const scanner = new Scanner(`
    class DevonshireCream {
        serveOn() {
          return "Scones";
        }
    }
      
    // print DevonshireCream; // Prints "DevonshireCream".

    // var ins = DevonshireCream();
    // print ins;
    // ins.a = 1;
    // print ins.a;
    // ins.serveOn();

    // ========================================

    // class Thing {
    //     getCallback() {
    //         fun localFunction() {
    //             print this;
    //         }
        
    //         return localFunction;
    //     }
    // }
    
    // var callback = Thing().getCallback();
    // callback();

    // ========================================

    // class Cake {
    //     taste() {
    //         var adjective = "delicious";
    //         print "The " + this.flavor + " cake is " + adjective + "!";
    //     }
    // }
    
    // var cake = Cake();
    // cake.flavor = "German chocolate";
    // cake.taste(); // Prints "The German chocolate cake is delicious!".


    // =========================================

    // // 方式1
    // fun callback(a, b, c) {
    //     object.method(a, b, c);
    // }

    // takeCallback(callback);

    // // 方式2
    // takeCallback(object.method);
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