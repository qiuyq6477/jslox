import { Scanner } from "../Src/Scanner.js"

const scanner = new Scanner(`
                    print 'hello world'
                    var a = 1
                `)
const tokens = scanner.scanTokens()

tokens.forEach(token => {
    console.log(token)
});
