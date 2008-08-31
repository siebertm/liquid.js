var Condition = new Class({
  initialize: function(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
    this.childRelation = null;
    this.childCondition = null;
    this.attachment = null;
  },
  
  evaluate: function(context) {
    context = context || new Context();
    var result = this.interpretCondition(this.left, this.right, this.operator, context);
    switch(this.childRelation) {
      case 'or':
        return (result || this.childCondition.evaluate(context));
      case 'and':
        return (result && this.childCondition.evaluate(context));
      default:
        return result;
    }
  },
  
  or: function(condition) {
    this.childRelation = 'or';
    this.childCondition = condition;
  },
  
  and: function(condition) {
    this.childRelation = 'and';
    this.childCondition = condition;
  },
  
  attach: function(attachment) {
    this.attachment = attachment;
    return this.attachment;
  },
  
  isElse: false,
  
  interpretCondition: function(left, right, op, context) {
    // If the operator is empty this means that the decision statement is just 
    // a single variable. We can just pull this variable from the context and 
    // return this as the result.
    if(!op)
      { return context.get(left); }
    
    left = context.get(left);
    right = context.get(right);
    op = Condition.operators[op];
    if(!op)
      { throw ("Unknown operator "+ op); }
    
    var results = op(left, right);
    return results;
  },
  
  toString: function() {
    return "<Condition "+ this.left +" "+ this.operator +" "+ this.right +">";
  }
  
});
  
Condition.operators = {
  '==': function(l,r) {  return (l == r); },
  '=':  function(l,r) { return (l == r); },
  '!=': function(l,r) { return (l != r); },
  '<>': function(l,r) { return (l != r); },
  '<':  function(l,r) { return (l < r); },
  '>':  function(l,r) { return (l > r); },
  '<=': function(l,r) { return (l <= r); },
  '>=': function(l,r) { return (l >= r); },

  'contains': function(l,r) { return l.contains(r); },
  'hasKey':   function(l,r) { return $H(l).getKeys().contains(r); },
  'hasValue': function(l,r) { return $H(l).getValue(r); }
}

var ElseCondition = new Class({
  Extends: Condition,
  
  isElse: true,
  
  evaluate: function(context) {
    return true;
  },
  
  toString: function() {
    return "<ElseCondition>";
  }
  
});