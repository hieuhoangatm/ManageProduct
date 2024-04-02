const Product = require("../../models/product.model");

//[GET] /product
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  console.log(products);
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
  });
};

//[GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };
    const products = await Product.findOne(find);
    console.log(products);

    res.render("client/pages/products/detail", {
      pageTitle: "Danh sách sản phẩm",
      product: products
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
