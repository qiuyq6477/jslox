import "fs"
import "readline"
import { Scanner } from "./Scanner.js"
import { Parser } from "./Parser.js"
import { TokenType } from "./Token.js"
import { Interpreter } from "./Interpreter.js"

//TODO: add list, map, io, input, math
export class Lox {
    static interpreter = new Interpreter()
    constructor(){
    }

    readFile(filename)
    {
        return fs.readFileSync(filename).toString()
    }

    runFile(filename)
    {
        const source = this.readFile(filename)
        this.run(source)
        if(this.hasError || this.hasRuntimeError){
            process.exit(0)
        }
    }


    runPrompt()
    {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        })
        
        rl.prompt()
        
        rl.on('line', (line) => {
            this.run(line)
            this.hasError = false
            this.hasRuntimeError = false
            rl.prompt()
        })
    }

    run(source)
    {
        const scanner = new Scanner(source)
        const tokens = scanner.scanTokens()

        const parser = new Parser(tokens)
        const statements = parser.parse()
        if(this.hasError || this.hasRuntimeError) return
        this.interpreter(statements)
    }


    /**
     * 
     * @param {int} line 
     * @param {string} message
     * 
     *  TODO1: expect result:
        Error: Unexpected "," in argument list.
            15 | function(first, second,);
                                    ^-- Here. 
        TODO2: 传递给扫描程序和解析器的某种ErrorReporter接口，这样就可以交换不同的报告策略
     */
    static hasError = false
    static hasRuntimeError = false
    static errorLine(line, message)
    {
        this.report(line, "", message)
    }

    static warnLine(line, message)
    {
        console.log("[line " + line + "] Warn" + where + ": " + message)
    }

    static parseError(token, message)
    {
        if (token.type == TokenType.EOF) 
        {
            this.report(token.line, " at end", message);
        } 
        else 
        {
            this.report(token.line, " at '" + token.lexeme + "'", message);
        }
    }

    static report(line, where, message)
    {
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hasError = true
    }

    static runtimeError(error)
    {
        console.log(error.getMessage() + "\n[line " + error.token.line + "]")
        this.hasRuntimeError = true
    }
}