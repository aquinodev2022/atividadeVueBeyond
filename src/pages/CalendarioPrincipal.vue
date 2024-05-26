<template>
  <v-main class="light-blue darken-4" style="margin-bottom: 55px">
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
      >
      <template v-slot:event="{ event }">
  <div class="evento">
    <div>{{ String(event.start.getHours()).padStart(2, '0') }}:{{ String(event.start.getMinutes()).padStart(2, '0') }} - {{ event.nomeEvento }}</div>
  </div>
</template>

</v-calendar>

      <!-- Formulário de adição de evento -->
      <v-dialog v-model="adicionarEventoDialogo" max-width="500px" persistent>
        <v-card>
          <v-card-title>Adicionar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <!-- validação para garantir que o campo seja preenchido -->
              <v-text-field v-model="novoEvento.nomeEvento" :rules="[v => !!v || 'Título do Evento é obrigatório']" label="Nome do evento"></v-text-field>
              <!-- validação para garantir que o campo seja preenchido -->
              <v-select v-model="novoEvento.corEvento" :items="colors" :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <!-- Rótulo para o relógio -->
              <label for="timePicker" id="fraseAntesDoRelogio">Hora do Evento</label>
              <!-- Container para envolver o relógio -->
              <div id="timePicker" class="containerRelogio">
                <!-- validação para garantir que o campo seja preenchido -->
                <v-time-picker id="relogioEstilo" v-model="novoEvento.time" format="24hr" :rules="[v => !!v || 'Hora é obrigatória']"></v-time-picker>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-2" text @click="cancelAddEvent">Cancelar</v-btn>
            <v-btn :disabled="carregando" :loading="carregando" color="primary" @click="saveEvent">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Formulário de edição de evento -->
      <v-dialog v-model="editarEventoDialogo" max-width="500px" persistent>
        <v-card>
          <v-card-title>Editar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <!-- Campo de título do evento -->     
              <!-- validação para garantir que o campo seja preenchido -->
              <v-text-field v-model="editarEvento.nomeEvento" :rules="[v => !!v || 'Título do Evento é obrigatório']" label="Evento"></v-text-field>
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
              <!-- Campo de seleção de cor do evento -->
              <!-- validação para garantir que o campo seja preenchido -->
              <v-select v-model="editarEvento.corEvento" :items="colors" :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <v-btn color="red" @click="abrirDeletarDialogo(editarEventoIndice)">Excluir Evento</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-2" text @click="cancelarEditarEvento">Cancelar</v-btn>
            <v-btn :loading="carregando" color="primary" @click="savarEditarEvento">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Pop-up de confirmação de exclusão do evento -->
<v-dialog v-model="deletarEventoDialogo" max-width="500px" persistent>
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
    margin-top: 10px;  
    height: 705px;
  }

  #fraseAntesDoRelogio {
    font-size: 18px;
    display: block;
    text-align: center;
    width: 100%;
  }

  .containerRelogio {
    margin-top: 20px; 
  }

  #relogioEstilo{
    width: 450px; 
  }

  #fraseExclusao {
    font-size: 20px;
  }
</style>

<script>
import { updateDoc, collection, addDoc, getDocs, where, query, doc, deleteDoc } from 'firebase/firestore';
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
        nomeEvento: '',
        date: '',
        time: '',
        corEvento: '',
      },
      editarEventoDialogo: false, // Controle de exibição do diálogo de edição do evento
      editarEventoIndice: -1,
      editarEvento: {
        nomeEvento: '',
        date: '',
        time: '',
        corEvento: '',
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

  methods: {
    updateEventTitleWithTime() {
      const hour = this.editarEventoohora.padStart(2, '0');
      const minute = this.editarEventohora.padStart(2, '0');
      this.editarEvento.time = `${hour}:${minute}`;
    },

    pegarEventoCor(event) {
      return event.corEvento;
    },

    async addEvent({ date }) {
      this.novoEvento = {
        nomeEvento: '',
        date: date,
        time: '',
        corEvento: ''
      };
      this.adicionarEventoDialogo = true;
    },

    async saveEvent() {
      if (!this.$refs.form.validate()) return;

      this.carregando = true;

      try {
        const user = auth.currentUser;
        const email = user ? user.email : null;

        // Combine a data e a hora para criar um objeto Date local
        const localDateTime = new Date(this.novoEvento.date + 'T' + this.novoEvento.time);

        const event = {
          nomeEvento: this.novoEvento.nomeEvento,
          start: localDateTime, // Salve como hora local
          corEvento: this.novoEvento.corEvento,
          EmailUsuario: email // Atribui o email como EmailUsuario
        };

        const docRef = await addDoc(collection(db, 'events'), event);
        event.id = docRef.id;
        this.events.push(event);
        this.adicionarEventoDialogo = false;
      } catch (e) {
        console.error("Erro ao adicionar o evento: ", e);
      } finally {
        this.carregando = false;
      }
    },

    mostrarEvento({ event }) {
      this.editarEvento = { ...event };  // Copia o evento preservando o ID
      const eventDate = new Date(event.start);
      this.editarEventoohora = String(eventDate.getHours()).padStart(2, '0');
      this.editarEventohora = String(eventDate.getMinutes()).padStart(2, '0');
      this.editarEventoDialogo = true;
    },

    async savarEditarEvento() {
      this.carregando = true;
      try {
        const updatedEvent = { ...this.editarEvento };
        const localDateTime = new Date(updatedEvent.start);
        localDateTime.setHours(parseInt(this.editarEventoohora));
        localDateTime.setMinutes(parseInt(this.editarEventohora));
        updatedEvent.start = localDateTime;

        // Remove os campos id e time do objeto antes de enviar ao Firestore
        delete updatedEvent.id;
        delete updatedEvent.time;

        const index = this.events.findIndex(event => event.id === this.editarEvento.id);
        if (index !== -1) {
          this.events.splice(index, 1, { ...updatedEvent, id: this.editarEvento.id });
        }

        const eventDoc = doc(db, 'events', this.editarEvento.id);
        await updateDoc(eventDoc, updatedEvent);

        this.editarEventoDialogo = false;
      } catch (e) {
        console.error("Erro ao editar o evento: ", e);
      } finally {
        this.carregando = false;
      }
    },

    abrirDeletarDialogo() {
      this.deletarEventoDialogo = true;
    },

    cancelarEditarEvento() {
      this.editarEventoDialogo = false;
      this.editarEvento = {
        nomeEvento: '',
        date: '',
        time: '',
        corEvento: ''
      };
      this.editarEventoohora = '';
      this.editarEventohora = '';
    },

    async confirmarDeletarEvento() {
      this.carregando = true;
      try {
        const deletedEvent = this.editarEvento;
        await deleteDoc(doc(db, 'events', deletedEvent.id));
        this.events = this.events.filter(event => event.id !== deletedEvent.id);
        this.deletarEventoDialogo = false;
        this.editarEventoDialogo = false;
      } catch (e) {
        console.error("Erro ao deletar o evento: ", e);
      } finally {
        this.carregando = false;
      }
    },

    cancelarDeletarEvento() {
      this.deletarEventoDialogo = false;
    },

    async fetchEventsFromFirestore() {
      try {
        const user = auth.currentUser;
        const email = user ? user.email : null;

        if (email) {
          const q = query(collection(db, 'events'), where('EmailUsuario', '==', email));
          const querySnapshot = await getDocs(q);

          this.events = querySnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            data.start = data.start.toDate();

            return data;
          });
        }
      } catch (e) {
        console.error("Erro ao buscar eventos do Firestore: ", e);
      }
    },

    definirHoje() {
      this.foco = new Date().toISOString().substr(0, 10);
    },

    mesAnterior() {
      this.$refs.calendar.prev();
    },

    proximoMes() {
      this.$refs.calendar.next();
    },

    cancelAddEvent() {
      this.adicionarEventoDialogo = false;
      this.novoEvento = {
        name: '',
        date: '',
        time: '',
        corEvento: ''
      };
    },

    atualizarIntervalo({ start, end }) {
      this.tituloCalendario = this.$refs.calendar.title;
      const events = [];
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
          nomeEvento: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          corEvento: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !todosDias,
        });
      }
      this.events = events;
    }
  },

  async mounted() {
    await this.fetchEventsFromFirestore();
  }
};
</script>
