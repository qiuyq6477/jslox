
export class LoxInstance {
    constructor(klass)
    {
        this.klass = klass
    }

    toString()
    {
        return this.klass.name + " instance"
    }
}