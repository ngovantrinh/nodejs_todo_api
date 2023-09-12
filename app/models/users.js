const MainModel = require(__path_schemas + "users");

module.exports = {
    create: (user) => {
      return new MainModel(user).save();
    },
    findUser: (user) => {
        return new MainModel.findOne(user).lean();
      },
  };
  