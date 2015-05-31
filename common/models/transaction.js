module.exports = function(Transaction) {
  Transaction.observe('before save', function(context, next) {

    if (context.instance) {
      var validation = validateTransaction(context.instance);

      if (validation.validated) {
        next();
      } else {
        var err = new Error(Transaction);
        err.status = 422;   // Unprocessable Entity
        err.message = validation.message;

        next(err);
      }
    };
  });

  var validateTransaction = function(transaction) {
    var conditions = [
      {
        test: (!transaction.isRecurring || !transaction.isReconciled),
        failureMessage: "Can't mark a recurring transaction as reconciled"
      },
      {
        test: (transaction.rrule || transaction.rdate || !transaction.isRecurring),
        failureMessage: "Recurrence rule or recurrence dates are required for recurring transactions"
      },
      {
        test: (!transaction.parentId || !transaction.isReconciled),
        failureMessage: "Can't mark a child of a recurring transaction as reconciled"
      },
      {
        test: (!transaction.parentId || !transaction.isRecurring),
        failureMessage: "Can't mark a child of a recurring transaction as recurring"
      },
      {
        test: (transaction.parentId || typeof transaction.sortIndex !== undefined),
        failureMessage: "Sort index is required"
      },
      {
        test: (transaction.parentId || transaction.amount !== undefined),
        failureMessage: "Amount is required"
      },
      {
        test: (transaction.parentId || transaction.sourceAccountId),
        failureMessage: "Source account ID is required"
      },
      {
        test: (transaction.parentId || transaction.destinationAccountId),
        failureMessage: "Destination account ID is required"
      }
    ];
    var failureMessage;

    var i;
    for (i = 0; i < conditions.length; i++) {
      if (!conditions[i].test) {
        failureMessage = conditions[i].failureMessage;
        break;
      }
    }

    if (failureMessage) {
      return { validated: false, message: failureMessage };
    } else {
      return { validated: true };
    }
  };

};
