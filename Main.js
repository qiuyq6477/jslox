const Lox = require("./Lox")

console.log(process.argv)
if(process.argv.length > 3)
{
    console.log('Usage: node Lox.js [script]')
    process.exit(0);
}
else if(process.argv.length == 3)
{
    const lox = new Lox();
    lox.runFile(process.argv[0])
}
else
{
    const lox = new Lox();
    lox.runPrompt();
}
