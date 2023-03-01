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

class Expression extends Stmt {
  constructor (expression) {
    super()
    this.expression = expression
  }

  accept (visitor) {
    return visitor.visitExpressionStmt(this)
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

module.exports = {
  Block,
  Expression,
  If,
  Print,
  Var,
  While,
  Break,
  Continue
}
