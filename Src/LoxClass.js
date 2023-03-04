import { LoxCallable } from "./LoxCallable.js"
import { LoxInstance } from "./LoxInstance.js"

//TODO: 支持静态方法。静态变量。
//      更多的跨类重用和共享功能：mixins, traits, multiple inheritance, virtual inheritance, extension methods, 等等。
export class LoxClass extends LoxCallable {
    constructor(name, superclass, methods)
    {
        super()
        this.name = name
        this.superclass = superclass
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
        
        if (this.superclass != null)
        {
            return this.superclass.findMethod(name)
        }
        
        return null
    }
}