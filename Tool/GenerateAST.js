const fs = require('fs')
const path = require('path')

const indent = '  '

class GenerateAST {
    constructor(outputDir)
    {
        this.defineAST(outputDir, "Expr", {
            Assign   : "Token name, Expr value",
            Binary   : "Expr left, Token operator, Expr right",
            Grouping : "Expr expression",
            Literal  : "Object value",
            Logical  : "Expr left, Token token, Expr right",
            Unary    : "Token operator, Expr right",
            Ternary  : "Expr condition, Expr left, Expr right",
            Variable : "Token name",
        })

        this.defineAST(outputDir, "Stmt", {
            Block    : "List statements",
            Expression:"Expr expression",
            If       : "Expr condition, Stmt thenBranch, Stmt elseBrance",
            Print    : "Expr expression",
            Var      : "Token name, Expr initialize",
            While    : "Expr condition, Stmt body",
            For      : "Expr initializer, Expr condition, Expr increment, Stmt body",
            Break    : "Token name",
            Continue : "Token name",
        })
    }

    defineAST(outputDir, baseName, types)
    {
        const outputPath = path.resolve(outputDir, baseName + '.js')
        console.log(outputPath)
        const writer = fs.createWriteStream(outputPath)

        writer.write(`/* generated by ${path.basename(__filename)} */\n\n`)
        writer.write(`class ${baseName} {\n`)
        writer.write(`${indent}accept (visitor) {}\n`)
        writer.write(`}\n\n`)

        const classNames = Object.keys(types)
        classNames.forEach(className => {
            this.defineType(writer, baseName, className, types[className])
            writer.write('\n')
        })

        const allExports = classNames.map(className =>
            `${indent}${className}`
        ).join(`,\n`)

        writer.write(`module.exports = {\n`)
        writer.write(allExports)
        writer.write('\n}\n')

        writer.end()
    }

    defineType(writer, baseName, className, fieldList) {
        writer.write(`class ${className} extends ${baseName} {\n`)
      
        const fields = fieldList.split(', ')
        const fieldNames = fields.map(field =>
          field.split(' ')[1]
        )
      
        writer.write(`${indent}constructor (${fieldNames.join(', ')}) {\n`)
        writer.write(`${indent}${indent}super()\n`)
        fieldNames.forEach(fieldName => {
          writer.write(`${indent}${indent}this.${fieldName} = ${fieldName}\n`)
        })
        writer.write(`${indent}}\n\n`)
      
        writer.write(`${indent}accept (visitor) {\n`)
        writer.write(`${indent}${indent}return visitor.visit${className}${baseName}(this)\n`)
        writer.write(`${indent}}\n`)
      
        writer.write(`}\n`)
    }
}



const outputDir = process.argv[2]

if (!outputDir) {
  console.error('usage: node GenerateAST.js <output directory>')
  process.exit(1)
}

new GenerateAST(outputDir)