// Definição da classe Product
class Product {
  constructor(name, price, description, stock) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock;
    this.createdAt = new Date();
  }
}

// Converter para transformar documentos do Firestore em objetos Product e vice-versa
const productConverter = {
  toFirestore: function (product) {
    return {
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      createdAt: product.createdAt,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const product = new Product(
      data.name,
      data.price,
      data.description,
      data.stock
    );
    product.createdAt = data.createdAt;
    return product;
  },
};
