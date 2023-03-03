import { LoxCallable } from "./LoxCallable.js"
import { LoxInstance } from "./LoxInstance.js"

//TODO: 支持静态方法，静态变量
export class LoxClass extends LoxCallable {
    constructor(name)
    {
        super()
        this.name = name
    }

    toString()
    {
        return this.name
    }


    arity () 
    { 
        return 0
    }

    call (interpreter, args) 
    {
        const instance = new LoxInstance(this)
        return instance
    }
}