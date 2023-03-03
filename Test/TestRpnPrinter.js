import * as Expr from "../Expr.js"
import { RpnPrinter } from "../RpnPrinter.js";
import { TokenType, Token } from "../Token.js";

const expression = new Expr.Binary(
    new Expr.Unary(
        new Token(TokenType.MINUS, "-", null, 1),
        new Expr.Literal(123)),
    new Token(TokenType.STAR, "*", null, 1),
    new Expr.Grouping(
        new Expr.Literal(45.67)));

console.log(new RpnPrinter().print(expression));