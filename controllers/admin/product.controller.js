const Product = require("../../models/product.model.js");
const filterStatusHelper = require("../../helpers/filterStatus.js");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system");
const createTree = require("../../helpers/createTree");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status)

  // Phần bộ lọc trạng thái status
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status; // Thêm 1 key vào object
  }

  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword;
    find.title = new RegExp(keyword, "i"); // ⭐regex
  }

  //Pagination

  const countProduct = await Product.countDocuments(find);

  let objectPanigation = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProduct
  );
  // End Pagination
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPanigation.limitItems)
    .skip(objectPanigation.skip);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPanigation,
  });
};

// [Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  // const updatedBy = {
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công !");

  res.redirect("back");
};

// [Patch] /admin/products/change-multi/
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  // const updatedBy = {
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }

  // switch (type) {

  //   case "active":
  //     await Product.updateMany({ _id: { $in: ids } }, {
  //       status: "active",
  //       $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
  //     });
  //     req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
  //     break;

  //   case "inactive":
  //     await Product.updateMany({ _id: { $in: ids } }, {
  //       status: "inactive",
  //       $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
  //     });
  //     req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
  //     break;

  //   case "delete-all":
  //     await Product.updateMany(
  //       { _id: { $in: ids } },
  //       {
  //         deleted: true,
  //         // deletedAt: new Date()
  //         deleteBy: {
  //           account_id: res.locals.user.id,
  //           deleteAt: new Date(),
  //         }
  //       });
  //     req.flash("success", `Xóa thành công ${ids.length} sản phẩm !`)
  //     break;

  //   case "change-position":
  //     for (const item of ids) {
  //       let [id, position] = item.split("-");
  //       position = parseInt(position);

  //       await Product.updateMany({ _id: id }, {
  //         position: position,
  //         $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
  //       });
  //     }
  //     req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm !`)
  //     break;

  //   default:
  //     break;
  // }
  // res.redirect("back")
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            // $push: { updatedBy: updatedBy }   // $push: Để lưu lại 1 mãng các object người dùng đã chỉnh sửa hoặc cập nhật
          }
        );
      }
      req.flash(
        "success",
        `Thay đổi vị trí thành công ${ids.length} sản phẩm !`
      );
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [Delete] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
      // deleteBy: {
      //   account_id: res.locals.user.id,
      //   deleteAt: new Date(),
      // }
    }
  );

  req.flash("success", `Xóa thành công 1 sản phẩm !`);

  res.redirect("back");
};

// [Get] /admin/products/create/
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

// [Get] /admin/products/createPost/
module.exports.createPost = async (req, res) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề");
    req.redirect("back");
    return;
  }
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  // if (req.body.position == "") {
  //   const countProducts = await Product.count();
  //   console.log(countProducts);
  // }
  if (req.body.position === "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  if (req.file) req.body.thumbnail = `/uploads/${req.file.filename}`;
  const product = new Product(req.body);
  await product.save();
  console.log(req.body);
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });
    console.log(product);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      // records: newRecords
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  req.body.position = parseInt(req.body.position);

  if (req.file && req.file.filename) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  await Product.updateOne({ _id: id }, req.body);

  req.flash("success", "Cập nhật sản phẩm thành công!");

  res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false
    });

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};