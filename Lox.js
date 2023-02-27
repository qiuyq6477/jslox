const fs = require("fs")
const readline = require("readline")
const Scanner = require("./Scanner")


class Lox {
    constructor(){
        this.hasError = false
    }

    runFile(filename)
    {
        const source = fs.readFileSync(filename).toString()
        this.run(source)
        if(this.hasError){
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
            rl.prompt()
        })
    }

    run(source)
    {
        let self = this
        const scanner = new Scanner(source, function(line, message){
            self.error(line, message)
        })
        const tokens = scanner.scanTokens()

        tokens.forEach(token => {
            console.log(token)
        });
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
    error(line, message)
    {
        this.report(line, "", message)
    }

    report(line, where, message)
    {
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hasError = true
    }
}

module.exports = Lox