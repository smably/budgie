/*
module.exports = function(app) {
  app.dataSources.mongoDs.automigrate('Account', function(err) {
    if (err) throw err;

    app.models.Account.create([
      {
        label: 'Primary account',
        isSource: true,
        isDestination: true,
        isPrimary: true,
        accountInfo: {
          institutionName: "PC Financial",
          accountNumber: 6081,
          accountType: "Chequing",
          balance: 3137,
          date: "2015-05-30T00:00:00.000Z"
        }
      },
      {
        label: 'Kelly Services',
        isSource: true,
        isDestination: false,
        isPrimary: false
      }
    ], function(err, accounts) {
      if (err) throw err;

      console.log('Models created: \n', accounts);
    });
  });
};
*/
