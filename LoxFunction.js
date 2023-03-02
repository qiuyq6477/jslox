const Return = require("./Return")
const Environment = require("./Environment")

class LoxCallable {
    arity () { return this._arity }
    call (interpreter, args) {}
}

class LoxFunction extends LoxCallable {
    constructor (declaration, closure) 
    {
        super()
        this.closure = closure
        this.declaration = declaration
    }
  
    arity () 
    {
        return this.declaration.params.length
    }
  
    toString () 
    {
        return `<fn ${this.declaration.name.lexeme}>`
    }
  
    call (interpreter, args) 
    {
        const environment = new Environment(this.closure)
    
        this.declaration.params.forEach((param, index) => {
            environment.define(param.lexeme, args[index])
        })
    
        try 
        {
            interpreter.executeBlock(this.declaration.body, environment)
        } 
        catch (err) 
        {
            if (err instanceof Return) 
            {
                return err.value
            } 
            else 
            {
                throw err
            }
        }
        return null
    }
}

class LocalFunction extends LoxCallable {
    constructor (name, arity, fn) 
    {
        super()
        this._name = name
        this._arity = arity
        this._fn = fn
    }
  
    toString () 
    {
        return `<fn ${this._name}>`
    }
  
    call (interpreter, args) 
    {
        return this._fn.apply(null, args)
    }
}

module.exports = {
    LoxCallable,
    LoxFunction,
    LocalFunction,
}