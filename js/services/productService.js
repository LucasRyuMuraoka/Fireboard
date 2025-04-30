class ProductService {
  constructor() {
    this.db = firebase.firestore();
    this.productRef = this.db.collection('product').withConverter(productConverter);
    
    this.productLista = document.getElementById('productLista');
    this.productTabela = document.getElementById('productTabela');
    this.loadingDiv = document.getElementById('loading');    
  }

  // Método para carregar todos os produtos
  carregarProdutos() {
    console.log("Carregando produtos...");
    this.loadingDiv.textContent = 'Carregando produtos...';
    
    this.productRef.get()
      .then(snapshot => {
        console.log("Snapshot recebido:", snapshot.size, "documentos");
        this.processarSnapshot(snapshot);
      })
      .catch(error => {
        console.error("Erro ao carregar produtos:", error);
        this.tratarErro(error);
      });
  }

  // Processa os dados recebidos do Firestore
  processarSnapshot(snapshot) {
    this.productLista.innerHTML = '';
    this.loadingDiv.style.display = 'none';
    this.productTabela.style.display = 'table';
  
    if (snapshot.empty) {
      console.log("Nenhum produto encontrado");
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5">Nenhum produto encontrado</td>';
      this.productLista.appendChild(tr);
      return;
    }
  
    snapshot.forEach((doc) => {
      console.log("Processando documento:", doc.id);
      const product = doc.data();
      console.log("Dados do produto:", product);
      this.adicionarProdutoNaTabela(product, doc.id);
    });
  }

  // Adiciona um produto na tabela HTML
  adicionarProdutoNaTabela(product, productId) {
    const tr = document.createElement('tr');
    
    // Formatar o preço para exibição em reais
    const precoFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(product.price);
    
    // Formatar a data de criação
    let dataCriacao = 'N/A';
    if (product.createdAt) {
      // Se createdAt for um timestamp do Firestore
      if (product.createdAt.toDate) {
        dataCriacao = product.createdAt.toDate().toLocaleDateString('pt-BR');
      } 
      // Se for uma data direta ou string
      else if (product.createdAt instanceof Date) {
        dataCriacao = product.createdAt.toLocaleDateString('pt-BR');
      }
    }
    
    tr.innerHTML = `
      <td>${product.name || 'N/A'}</td>
      <td>${precoFormatado}</td>
      <td>${product.description || 'N/A'}</td>
      <td>${product.stock || 0}</td>
      <td>${dataCriacao}</td>
      <td>
        <button class="editBtn" data-id="${productId}">Editar</button>
        <button class="deleteBtn" data-id="${productId}">Excluir</button>
      </td>
    `;
    
    this.productLista.appendChild(tr);
    
    // Adicionar eventos aos botões
    tr.querySelector('.editBtn').addEventListener('click', () => {
      this.editarProduto(productId);
    });
    
    tr.querySelector('.deleteBtn').addEventListener('click', () => {
      this.excluirProduto(productId);
    });
  }
  
  // Método para adicionar um novo produto
  adicionarProduto(name, price, description, stock) {
    const product = new Product(name, parseFloat(price), description, parseInt(stock));
    
    return this.productRef.add(product)
      .then(docRef => {
        console.log("Produto adicionado com ID: ", docRef.id);
        return docRef.id;
      })
      .catch(error => {
        console.error("Erro ao adicionar produto: ", error);
        throw error;
      });
  }
  
  // Método para excluir um produto
  excluirProduto(productId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      this.productRef.doc(productId).delete()
        .then(() => {
          console.log("Produto excluído com sucesso");
          this.carregarProdutos(); // Recarregar a lista
        })
        .catch(error => {
          console.error("Erro ao excluir produto: ", error);
          alert("Erro ao excluir produto: " + error.message);
        });
    }
  }
  
  // Método para editar um produto (abrir formulário)
  editarProduto(productId) {
    // Buscar os dados atuais do produto
    this.productRef.doc(productId).get()
      .then(doc => {
        if (doc.exists) {
          const product = doc.data();
          
          // Preencher o formulário de edição
          document.getElementById('editProductId').value = productId;
          document.getElementById('editName').value = product.name;
          document.getElementById('editPrice').value = product.price;
          document.getElementById('editDescription').value = product.description;
          document.getElementById('editStock').value = product.stock;
          
          // Mostrar o modal de edição
          document.getElementById('editProductModal').style.display = 'block';
        } else {
          console.log("Produto não encontrado!");
        }
      })
      .catch(error => {
        console.error("Erro ao buscar produto para edição: ", error);
      });
  }
  
  // Método para salvar as alterações de um produto
  salvarEdicaoProduto(productId, name, price, description, stock) {
    return this.productRef.doc(productId).update({
      name: name,
      price: parseFloat(price),
      description: description,
      stock: parseInt(stock)
    })
    .then(() => {
      console.log("Produto atualizado com sucesso");
      // Fechar o modal e recarregar a lista
      document.getElementById('editProductModal').style.display = 'none';
      this.carregarProdutos();
    })
    .catch(error => {
      console.error("Erro ao atualizar produto: ", error);
      alert("Erro ao atualizar produto: " + error.message);
    });
  }
  
  tratarErro(error) {
    console.error("Erro tratado:", error);
    this.loadingDiv.textContent = 'Erro ao carregar produtos: ' + error.message;
    this.loadingDiv.style.color = 'red';
  }
}