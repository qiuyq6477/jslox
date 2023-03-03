
export class Return extends Error {
    constructor (value) 
    {
        super(value)
        this.value = value
    }
}