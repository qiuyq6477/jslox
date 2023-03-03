import { LoxCallable } from "./LoxCallable.js"
import { LoxInstance } from "./LoxInstance.js"

//TODO: 支持静态方法，静态变量
export class LoxClass extends LoxCallable {
    constructor(name, methods)
    {
        super()
        this.name = name
        this.methods = methods
    }

    toString()
    {
        return this.name
    }


    arity () 
    { 
        const initializer = this.findMethod("init");
        if (initializer != null) 
        {
            return initializer.arity()
        }
        return 0
    }

    call (interpreter, args) 
    {
        const instance = new LoxInstance(this)
        const initializer = this.findMethod("init");
        if (initializer != null) 
        {
            initializer.bind(instance).call(interpreter, args)
        }
        return instance
    }

    findMethod(name)
    {
        if (this.methods.hasOwnProperty(name)) 
        {
            return this.methods[name];
        }

        return null
    }
}