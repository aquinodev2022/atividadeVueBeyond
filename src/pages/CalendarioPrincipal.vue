<template>
  <v-main class="light-blue darken-4">
    <v-toolbar class="light-blue darken-4" flat style="margin-top: 10px;">
      <!-- Menu com a opção "HOJE" e seleção de dias/semanas/meses/ e tipo de visualização do calendário -->
      <!-- Botão Hoje -->
      <v-btn id="botaoHoje" class="mr-4" @click="definirHoje">
        Hoje
      </v-btn>
      
      <!-- Seta para esquerda para voltar ao dia/semana/mês anterior -->
      <v-btn text small color="white darken-2" @click="mesAnterior">
        <v-icon>mdi-arrow-left-thick</v-icon>
      </v-btn>

      <!-- Seta para direita para voltar ao dia/semana/mês anterior -->
      <v-btn text small color="white darken-2" @click="proximoMes">
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>

      <!-- Exibe o mês atual e o ano atual -->
      <v-toolbar-title v-if="tituloCalendario" style="overflow: visible; color: white;">
        {{ tituloCalendario }}
      </v-toolbar-title>

      <router-link to="/" class="alinharVoltarLogin botaoVoltarLogin">
      <v-btn text color="white">
        <v-icon left style="color: white;">mdi-login</v-icon>
        Voltar para tela de login
      </v-btn>
    </router-link>
    </v-toolbar>

    
    <!-- Calendário -->
    <v-sheet id="calendarioEstilos">
      <v-calendar
        ref="calendar"
        v-model="foco"
        color="primary"
        :events="events"
        :event-color="pegarEventoCor"
        @click:event="mostrarEvento"
        @click:date="addEvent"
        @change="atualizarIntervalo"
      ></v-calendar>

      <!-- Formulário de adição de evento -->
      <v-dialog v-model="adicionarEventoDialogo" max-width="500px">
        <v-card>
          <v-card-title>Adicionar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
                                                    <!-- validação para garantir que o campo seja preenchido -->
              <v-text-field v-model="novoEvento.name" :rules="[v => !!v || 'Título do Evento é obrigatório']" label="Nome do evento"></v-text-field>
                                                                 <!-- validação para garantir que o campo seja preenchido -->
              <v-select v-model="novoEvento.color" :items="colors" :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <!-- Rótulo para o relógio -->
              <label for="timePicker" id="fraseAntesDoRelogio">Hora do Evento</label>
              <!-- Container para envolver o relógio -->
              <div id="timePicker" class="containerRelogio">                            <!-- validação para garantir que o campo seja preenchido -->
                <v-time-picker id="relogioEstilo" v-model="novoEvento.time" format="24hr" :rules="[v => !!v || 'Hora é obrigatória']"></v-time-picker>
              </div>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-2" text @click="cancelAddEvent">Cancelar</v-btn>
            <v-btn :disabled="carregando" :carregando="carregando" color="primary" @click="saveEvent">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Formulário de edição de evento -->
      <v-dialog v-model="editarEventoDialogo" max-width="500px">
        <v-card>
          <v-card-title>Editar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <!-- Campo de título do evento -->     <!-- validação para garantir que o campo seja preenchido -->
              <v-text-field v-model="editarEvento.name" :rules="[v => !!v || 'Título do Evento é obrigatório']" label="Evento"></v-text-field>

              <!-- Campo de seleção de hora e minutos do evento -->
              <div class="d-flex justify-space-between">
                <div>
                  <!-- Label para o select de hora -->
                  <label for="editarEventoohora">Alteração da hora:</label>
                  <v-select id="editarEventoohora" v-model="editarEventoohora" :items="hours" label="Hora" @change="updateEventTitleWithTime"></v-select>
                </div>
                <div>
                  <!-- Label para o select de minutos -->
                  <label for="editarEventohora">Alteração dos minutos:</label>
                  <v-select id="editarEventohora" v-model="editarEventohora" :items="minutes" label="Minutos" @change="updateEventTitleWithTime"></v-select>
                </div>
              </div>

              <!-- Campo de seleção de cor do evento -->          <!-- validação para garantir que o campo seja preenchido -->
              <v-select v-model="editarEvento.color" :items="colors" :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <v-btn color="red" @click="abrirDeletarDialogo(editarEventoIndice)">Excluir Evento</v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-2" text @click="cancelarEditarEvento">Cancelar</v-btn>
            <v-btn :carregando="carregando" color="primary" @click="savarEditarEvento">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Pop-up de confirmação de exclusão do evento -->
      <v-dialog v-model="deletarEventoDialogo" max-width="500px">
        <v-card>
          <v-card-title>Confirmar exclusão</v-card-title>
          <v-card-text id="fraseExclusao">
            Tem certeza de que deseja excluir este evento?
          </v-card-text>
          <v-card-actions>
            <v-btn color="red lighten-2" text @click="cancelarDeletarEvento">Cancelar</v-btn>
            <v-btn color="red" @click="confirmarDeletarEvento">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
  </v-main>
</template>

<style scoped>

  #botaoHoje {
    border-radius: 10px;
    background-color: #E8F1F2;
  }

  .botaoVoltarLogin {
    margin-left: 69%;
    border-radius: 9px;
    background-color: #054478;
  }

  .alinharVoltarLogin {
    text-decoration: none;
  }

  #calendarioEstilos {
    margin-top: 10px; /* Afasta a barra superior do calendário */ 
    height: 900px;
  }

  #fraseAntesDoRelogio {
    font-size: 18px;
    display: block;
    text-align: center;
    width: 100%;
  }

  .containerRelogio {
    margin-top: 20px; /* Afasta o relógio da frase logo a cima dele  */
  }

  #relogioEstilo{
    width: 450px; /* Tamanho do relógio de adicionar eventos */
  }

  #fraseExclusao {
    font-size: 20px;
  }

</style>

<script>
import { collection, addDoc, getDocs, where, query   } from 'firebase/firestore';
import { db, auth } from '../main';

export default {
  name: 'CalendarioPrincipal',

  data() {
    return {
      editarEventoohora: '',
      editarEventohora: '',
      hours: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`), // Horas do dia
      minutes: Array.from({ length: 60 }, (_, i) => `${i < 10 ? '0' : ''}${i}`), // Minutos do dia
      eventoDetalheDialogo: false, // Controle de exibição do diálogo de detalhes do evento
      foco: '', // Data de foco do calendário, ou seja, nenhuma
      tituloCalendario: '',
      novoEvento: {
        name: '',
        date: '',
        time: '',
        color: '',
      },
      editarEventoDialogo: false, // Controle de exibição do diálogo de edição do evento
      editarEventoIndice: -1,
      editarEvento: {
        name: '',
        date: '',
        time: '',
        color: '',
      },
      deletarEventoDialogo: false, // Controle de exibição do diálogo de exclusão do evento
      deletarEventoIndice: -1,
      events: [], // Lista de eventos do calendário
      colors: ['pink', 'green', 'grey', 'cyan', 'blue', 'orange', 'red', 'purple','black'],
      valid: true, // Validação dos formulários
      carregando: false, // Estado de carregamento
      isLoading: false // Estado de carregamento para Firestore
    };
  },

  async mounted() {
    await this.getEventsFromFirestore();
  },

  methods: {
    async addEventToFirestore(eventData) {
      try {
        // Adiciona o evento ao Firestore com o nome, data, cor e e-mail do usuário autenticado
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, 'events'), {
            name: eventData.name,
            date: eventData.start,
            color: eventData.color,
            EmailUsuario: user.email // armazena o e-mail do usuário autenticado
          });
        } else {
          throw new Error("Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao adicionar evento ao Firestore: ", error);
      }
    },

    async fetchEventsFromFirestore() {
      try {
        // Recupera os eventos do Firestore pertencentes ao usuário autenticado
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'events'), where('EmailUsuario', '==', user.email));
          const querySnapshot = await getDocs(q);
          const events = [];
          querySnapshot.forEach(doc => {
            const eventData = {
              name: doc.data().name,
              date: doc.data().date,
              color: doc.data().color,
            };
            events.push(eventData);
          });
          this.events = events;
        } else {
          throw new Error("Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao recuperar eventos do Firestore: ", error);
      }
    },

  

    addEvent({ date }) {
      this.foco = date;
      this.novoEvento.date = date;
      this.novoEvento.name = '';
      this.novoEvento.color = '';
      this.novoEvento.time = '00:00'; 
      this.adicionarEventoDialogo = true;
    },

    cancelAddEvent() {
      this.adicionarEventoDialogo = false;
      // Limpa os dados do novo evento
      this.novoEvento.name = '';
      this.novoEvento.date = '';
      this.novoEvento.time = '';
      this.novoEvento.color = '';
    },

    async saveEvent() {
    if (this.$refs.form.validate()) {
      this.carregando = true; // Desativa o botão "Salvar"
      try {
        // Combine a data e a hora selecionadas 
        const start = new Date(this.novoEvento.date + 'T' + this.novoEvento.time);

        // Formata a hora do evento para exibir no título
        const eventoHora = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Cria o título do evento com a hora e o nome do evento
        const eventoNomeComHora = `${eventoHora} = ${this.novoEvento.name}`;

        const eventData = {
          name: eventoNomeComHora,
          start: start, // Usa a data e a hora definidas no formulário de adição de evento
          color: this.novoEvento.color,
        };

        // Adiciona o evento ao Firestore
        await this.addEventToFirestore(eventData);

        // Adiciona o evento à lista local
        this.events.push(eventData);

        // Ordenar os eventos pelo horário de início
        this.events.sort((a, b) => a.start - b.start);

        // Feche o diálogo de adição de evento
        this.adicionarEventoDialogo = false;
      } catch (error) {
        console.error("Erro ao adicionar evento: ", error);
      } finally {
        this.carregando = false; // Reativa o botão "Salvar"
      }
    }
  },

    pegarEventoCor(event) {
      return event.color;
    },
    
    // Define a data de foco do calendário como hoje
    definirHoje() {
      this.foco = '';
    },
    
    // Passa para o período anterior no calendário
    mesAnterior() {
      this.$refs.calendar.prev();
    },
    
    // Passa para o próximo período no calendário
    proximoMes() {
      this.$refs.calendar.next();
    },

    // Exibe detalhes de um evento ao clicar nele
    mostrarEvento({ nativeEvent, event }) {
      // Limpar os campos de seleção de hora e minuto
      this.editarEventoohora = '';
      this.editarEventohora = '';
      
      // Defina o índice do evento em edição
      this.editarEventoIndice = this.events.indexOf(event);
      // Copia o evento para editar
      this.editarEvento = Object.assign({}, event);
      // Atualize o título do evento com a hora
      this.updateEventTitleWithTime();
      // Abra o pop-up de edição de evento
      this.editarEventoDialogo = true;
      // usado para interromper a propagação do evento atual, impedindo que ele se propague para outros elementos na árvore DOM.
      nativeEvent.stopPropagation();
    },

    atualizarEventoHora() {
      this.updateEventTitleWithTime();
    },

    // atualiza o título de um evento quando o usuário está editando um evento existente
    updateEventTitleWithTime() {
      // Atualiza o título do evento apenas se o usuário estiver editando um evento existente
      if (this.editarEventoIndice !== -1) {
        // Obtém a hora e os minutos do evento a ser editado
        const hour = this.editarEventoohora !== '' ? this.editarEventoohora.padStart(2, '0') : this.editarEvento.start.getHours().toString().padStart(2, '0');
        const minute = this.editarEventohora !== '' ? this.editarEventohora.padStart(2, '0') : this.editarEvento.start.getMinutes().toString().padStart(2, '0');
        // Formata a hora e os minutos em um formato 'HH:mm'
        const eventoHora = `${hour}:${minute}`;
        // Atualiza o título do evento
        this.editarEvento.name = `${eventoHora} = ${this.editarEvento.name.split(' = ')[1] || ''}`;
      }
    },

    atualizarTítuloEventoComHora(event) {
      const comecarEvento = new Date(event.start); // objeto de data que representa o início do evento
      return event.name.split(' = ')[1] || comecarEvento.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); // garante que sempre haja algum texto para retornar, mesmo que o título do evento esteja vazio
    },

    // função é chamada quando alguém quer excluir um evento
    abrirDeletarDialogo(index) {
      // índice do evento a ser excluído
      this.deletarEventoIndice = index;
      // Abre o pop-up de exclusão
      this.deletarEventoDialogo = true;
    },

    cancelarEditarEvento() {
      this.editarEventoDialogo = false;
      this.editarEventoIndice = -1;
    },

    savarEditarEvento() {
      if (this.$refs.form.validate()) { // verifica se todos os campos do formulário de edição do evento estão preenchidos corretamente. 
        this.carregando = true;
        // Remove o evento editado do array de eventos
        this.events.splice(this.editarEventoIndice, 1);

        // Atualizar a hora do evento editado
        const editedStart = new Date(this.editarEvento.start);
        editedStart.setHours(this.editarEventoohora);
        editedStart.setMinutes(this.editarEventohora);

        this.editarEvento.start = editedStart; 
        // Adicionar o evento atualizado ao array de eventos
        this.events.push(this.editarEvento);
        // Ordenar os eventos pelo horário de início
        this.events.sort((a, b) => a.start - b.start);
        // Limpar os eventos exibidos no calendário temporariamente
        this.$refs.calendar.events = [];
        // Atribuir os eventos atualizados ao calendário
        this.$nextTick(() => {
          // Atualiza os eventos exibidos no calendário com a lista atualizada de eventos.
          this.$refs.calendar.events = this.events;
          // Redefinir o v-model do calendário para a data de foco
          this.$refs.calendar.foco = this.foco;
        });
        // fecha o diálogo de edição do evento
        this.editarEventoDialogo = false;
        this.editarEventoIndice = -1;
        this.carregando = false;
      }
    },

    cancelarDeletarEvento() {
      this.deletarEventoDialogo = false;
      this.deletarEventoIndice = -1;
    },

    confirmarDeletarEvento() {
      if (this.deletarEventoIndice !== -1) {
        // Remove o evento apenas se o índice for válido
        this.$delete(this.events, this.deletarEventoIndice);
      }
      // Redefine o índice de exclusão para evitar exclusões erradas
      this.deletarEventoIndice = -1;
      this.deletarEventoDialogo = false;
      this.editarEventoDialogo = false;
    },

    // Atualiza o intervalo de datas do calendário
    atualizarIntervalo({start, end}) {
      this.tituloCalendario = this.$refs.calendar.title;
      const events = [];
      // efine o início do dia como a data mínima e o final do dia como a data máxima
      const min = new Date(start.date + 'T00:00:00');
      const max = new Date(end.date + 'T23:59:59');
      const dias = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(dias, dias + 20);
      for (let i = 0; i < eventCount; i++) {
        const todosDias = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, todosDias ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);
        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(
0, this.colors.length - 1)],
timed: !todosDias,
});
}
this.events = events;
}
},
};
</script>


