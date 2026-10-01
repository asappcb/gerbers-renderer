import { Vec2 } from '../types/pcb-model';
export type MacroStatement = {
    kind: "assign";
    varIndex: number;
    expr: string;
} | {
    kind: "primitive";
    code: number;
    args: string[];
};
/**
 * Parse the body of an %AM block, e.g.
 * "AMRoundRect*0 comment*4,1,4,$2,$3,...*1,1,$1+$1,$2,$3*"
 * Returns the macro name and its statements.
 */
export declare function parseMacroDefinition(body: string): {
    name: string;
    statements: MacroStatement[];
} | null;
/**
 * Evaluate a macro with the %AD parameters. Returns polygons (closed loops) in
 * aperture-local mm, one per exposed primitive.
 */
export declare function evaluateMacro(statements: MacroStatement[], params: number[], unitScale: number): Vec2[][];
/** Rotate a loop counter-clockwise by `deg` about the origin (Gerber Y-up coordinates). */
export declare function rotateLoop(loop: Vec2[], deg: number): Vec2[];
/**
 * Evaluate a macro arithmetic expression: numbers, $n variables, + - x X /,
 * parentheses and unary signs. Undefined variables evaluate to 0 (spec).
 */
export declare function evalExpr(src: string, vars: Map<number, number>): number;
