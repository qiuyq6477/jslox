/* generated by GenerateAST.js */

class Stmt {
  accept (visitor) {}
}

class Block extends Stmt {
  constructor (statements) {
    super()
    this.statements = statements
  }

  accept (visitor) {
    return visitor.visitBlockStmt(this)
  }
}

class Class extends Stmt {
  constructor (name, superclass, methods) {
    super()
    this.name = name
    this.superclass = superclass
    this.methods = methods
  }

  accept (visitor) {
    return visitor.visitClassStmt(this)
  }
}

class Expression extends Stmt {
  constructor (expression) {
    super()
    this.expression = expression
  }

  accept (visitor) {
    return visitor.visitExpressionStmt(this)
  }
}

class Function extends Stmt {
  constructor (name, params, body) {
    super()
    this.name = name
    this.params = params
    this.body = body
  }

  accept (visitor) {
    return visitor.visitFunctionStmt(this)
  }
}

class If extends Stmt {
  constructor (condition, thenBranch, elseBrance) {
    super()
    this.condition = condition
    this.thenBranch = thenBranch
    this.elseBrance = elseBrance
  }

  accept (visitor) {
    return visitor.visitIfStmt(this)
  }
}

class Print extends Stmt {
  constructor (expression) {
    super()
    this.expression = expression
  }

  accept (visitor) {
    return visitor.visitPrintStmt(this)
  }
}

class Return extends Stmt {
  constructor (keyword, value) {
    super()
    this.keyword = keyword
    this.value = value
  }

  accept (visitor) {
    return visitor.visitReturnStmt(this)
  }
}

class Var extends Stmt {
  constructor (name, initialize) {
    super()
    this.name = name
    this.initialize = initialize
  }

  accept (visitor) {
    return visitor.visitVarStmt(this)
  }
}

class While extends Stmt {
  constructor (condition, body) {
    super()
    this.condition = condition
    this.body = body
  }

  accept (visitor) {
    return visitor.visitWhileStmt(this)
  }
}

class For extends Stmt {
  constructor (initializer, condition, increment, body) {
    super()
    this.initializer = initializer
    this.condition = condition
    this.increment = increment
    this.body = body
  }

  accept (visitor) {
    return visitor.visitForStmt(this)
  }
}

class Break extends Stmt {
  constructor (name) {
    super()
    this.name = name
  }

  accept (visitor) {
    return visitor.visitBreakStmt(this)
  }
}

class Continue extends Stmt {
  constructor (name) {
    super()
    this.name = name
  }

  accept (visitor) {
    return visitor.visitContinueStmt(this)
  }
}

export {
  Block,
  Class,
  Expression,
  Function,
  If,
  Print,
  Return,
  Var,
  While,
  For,
  Break,
  Continue
}
