import { RuntimeError } from "./RuntimeError.js"


export class LoxInstance {
    constructor(klass)
    {
        this.klass = klass
        this.fields = {}
    }

    toString()
    {
        return this.klass.name + " instance"
    }

    get(name)
    {
        if (this.fields.hasOwnProperty(name.lexeme)) 
        {
            return this.fields[name.lexeme];
        }
        
        const method = this.klass.findMethod(name.lexeme)
        if(method != null)
        {
            return method.bind(this)
        }

        throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.")
    }

    set(name, value)
    {
        this.fields[name.lexeme] = value
    }
}