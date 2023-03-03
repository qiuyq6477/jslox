import { RuntimeError } from './RuntimeError.js'
export class Environment {
    constructor (enclosing) {
        this.enclosing = enclosing || null
        this.values = {}
    }

    define (name, value) {
        this.values[name] = value
    }

    get (name) {
        if (this.values.hasOwnProperty(name.lexeme)) {
            return this.values[name.lexeme]
        }

        if (this.enclosing !== null) {
            return this.enclosing.get(name)
        }

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.")
    }

    assign (name, value) {
        if (this.values.hasOwnProperty(name.lexeme)) {
            this.values[name.lexeme] = value
            return
        }

        if (this.enclosing !== null) {
            this.enclosing.assign(name, value)
            return
        }

        throw new RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.")
    }

    getAt(distance, name)
    {
        const env = this.ancestor(distance)
        return env.values[name.lexeme]
    }

    assignAt(distance, name, value)
    {
        const env = this.ancestor(distance)
        env.values[name.lexeme] = value
    }

    ancestor(distance) {
        let environment = this;
        for (let i = 0; i < distance; i++) {
            environment = environment.enclosing; 
        }
    
        return environment;
    }
}