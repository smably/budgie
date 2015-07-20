module.exports = function(Transaction) {
  Transaction.observe('before save', function(context, next) {
    var newInstance;

    if (context.instance) {
      newInstance = context.instance;
    } else if (context.data) {
      newInstance = context.data;
    }

    if (newInstance) {
      var validation = validateTransaction(newInstance);

      if (validation.validated) {
        next();
      } else {
        var err = new Error(Transaction);
        err.status = 422;   // Unprocessable Entity
        err.message = validation.message;

        next(err);
      }
    } else {
      var err = new Error(Transaction);
      err.status = 500;
      err.message = "Instance not found.";

      next(err);
    }
  });

  var validateTransaction = function(transaction) {
    var conditions = [
      {
        test: (!(transaction.isRecurring && transaction.isReconciled)),
        failureMessage: "Can't mark a recurring transaction as reconciled"
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
