// Desafio que consiste em ciar seus próprios métodos Filter, Map e Reduce.

const carrinho = [
  { nome: 'Caneta', quantidade: 10, preco: 7.99},
  { nome: 'Impressora', quantidade: 0, preco: 649.50},
  { nome: 'Caderno', quantidade: 4, preco: 27.10},
  { nome: 'Lapis', quantidade: 3, preco: 5.82},
  { nome: 'Tesoura', quantidade: 1, preco: 19.20},
]

console.log("Array completo\n", carrinho)

console.log("\nMétodo filter")

Array.prototype.myFilter = function(fn) {
  const filtered = []

  for(let el of this) {
    if(fn(el)) {
      filtered.push(el)
    }
  }

  return filtered
}

const myCarrinhoFiltered = carrinho.myFilter(material => material.quantidade != 0)
console.log(myCarrinhoFiltered)


console.log("\nMétodo map")

Array.prototype.myMap = function(fn) {
  const maped = []

  for(let el of this) {
    const result = fn(el)
    maped.push(result)
  }

  return maped
}

const myCarrinhoMaped = myCarrinhoFiltered.myMap(material => material.quantidade * material.preco)
console.log(myCarrinhoMaped)

console.log("\nMétodo reduce")

Array.prototype.myReduce = function(fn) {
  let reduced = 0

  for(let el of this) {
    reduced = fn(reduced, el)
  }

  return reduced
}

const myCarrinhoReduced = myCarrinhoMaped.myReduce((total, element) => total + element)
console.log(myCarrinhoReduced)