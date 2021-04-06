const Product = require("../models/productModel");
const mongoose = require("mongoose");
const url =
  "mongodb+srv://sam:Imw8atfsIK8Lz8BA@ecommerce.wdwhq.mongodb.net/<dbname>?retryWrites=true&w=majority";

beforeAll(async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
describe("Product Schema test anything", () => {
  // the code below is for insert testing
  it("Add product testing anything", () => {
    const product = {
      name: "Nokia",
      price: "21",
      quantity: "2",
      description: "Good",
    };

    return Product.create(product).then((pro_ret) => {
      expect(pro_ret.pname).toEqual("Nokia");
    });
  });
});
