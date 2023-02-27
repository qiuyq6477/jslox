const fs = require("fs")
const readline = require("readline")

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

    }


    error(line, message)
    {
        report(line, "", message)
    }

    report(line, where, message)
    {
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hasError = true
    }
}

module.exports = Lox