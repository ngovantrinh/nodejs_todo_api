const MainModel = require(__path_schemas + "items");

module.exports = {
  listItems: (params, option) => {
    // return new MainModel(item)

    let sort = {};
    let objWhere = {};
    if (params.keyword !== "") objWhere.name = new RegExp(params.keyword, "i");
    if (params.sortField) sort[params.sortField] = params.sortType;

    if (option.task == "all") {
      return MainModel.find(objWhere).select("id name status").sort(sort);
    }

    if (option.task == "one") {
      return MainModel.find({ id: params.id }).select("id name status");
    }
  },
  create: (item) => {
    return new MainModel(item).save();
  },
  deleteItem: (params, option) => {
    if (option.task == "one") {
      return MainModel.delete({ id: params.id });
    }
  },
  editItem: (params, option) => {
    if (option.task == "edit") {
      console.log(params.body);
      return MainModel.updateOne({ id: params.id }, params.body);
    }
  },
};
