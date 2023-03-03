import { Return } from "./Return.js"
import { Environment } from "./Environment.js"
import { LoxCallable } from "./LoxCallable.js"

export class LoxFunction extends LoxCallable {
    constructor (declaration, closure, isInitializer) 
    {
        super()
        this.closure = closure
        this.declaration = declaration
        this.isInitializer = isInitializer
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
                if (this.isInitializer)
                {
                    return closure.getAt(0, "this");
                } 
                return err.value
            } 
            else 
            {
                throw err
            }
        }

        if (this.isInitializer)
        {
            return this.closure.getAt(0, "this");
        } 

        return null
    }

    bind (instance)
    {
        const env = new Environment(this.closure)
        env.define("this", instance)
        return new LoxFunction(this.declaration, env, this.isInitializer)
    }
}

export class LocalFunction extends LoxCallable {
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
