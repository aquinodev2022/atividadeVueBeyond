<template>
    <div class="not-found">
      <div class="content">
        <div class="image-container">
          <img src="../assets/NotFound.webp" alt="Página não encontrada">
        </div>
        <div class="text-container">
          <h1>Oops!</h1>
          <p>Essa página não existe...</p>
          <router-link to="/" class="btn-home">Voltar para a tela de login</router-link>
        </div>
      </div>
    </div>
  </template>

  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .content {
    display: flex;
    align-items: center;
  }
  
  .image-container {
    flex: 1;
  }
  
  .image-container img {
    max-width: 100%;
    margin-left: 120px;
  }
  
  .text-container {
    flex: 1;
    text-align: left;
    margin-bottom: 70px;
  }
  
  .not-found h1 {
    font-size: 3em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .not-found p {
    font-size: 1.5em;
    color: #666;
    margin-bottom: 30px;
  }
  
  .btn-home {
    display: inline-block;
    padding: 10px 20px;
    background-color: #0550a0;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .btn-home:hover {
    background-color: #04366b;
  }
  </style>
  