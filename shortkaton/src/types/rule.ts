export interface Rules{
    ruleId:number;
    memo:string;
    available:boolean;
}

export interface RuleByID{
    ruleId:number;
    trueCheck:number;
    falseCheck:number;
    available:boolean;
}

export interface RulePostReq {
  memo: string;
}
