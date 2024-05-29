<template>
  <div class="containerPaginaNaoEncontrada">
    <div class="ContainerImagem">
      <img src="../assets/NotFound.webp" alt="Página não encontrada">
    </div>
    <div class="ContainerTexto">
      <h1>Oops!</h1>
      <p>Essa página não existe...</p>
      <router-link to="/" id="botaoParaTelaLogin">VOLTAR PARA TELA DE LOGIN</router-link>
    </div>
  </div>
</template>

<style scoped>
.containerPaginaNaoEncontrada {
  display: flex;
  align-items: center;
  margin-top: 50px;
}

.ContainerImagem {
  flex: 1;
}

.ContainerImagem img {
  max-width: 100%;
  margin-left: 130px;
}

.ContainerTexto {
  flex: 1;
  text-align: left;
  margin-bottom: 80px;
}

.containerPaginaNaoEncontrada h1 {
  font-size: 3em;
  color: #333;
  margin-bottom: 10px;
}

.containerPaginaNaoEncontrada p {
  font-size: 1.5em;
  color: #666;
  margin-bottom: 30px;
}

#botaoParaTelaLogin {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0550a0;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
}

#botaoParaTelaLogin:hover {
  background-color: #04366b;
}
</style>