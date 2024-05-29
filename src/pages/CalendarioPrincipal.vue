<template>
  <v-main class="light-blue darken-4" id="mainEstilo">
    <v-toolbar class="light-blue darken-4" flat id="toolbarSuperior">

      <!-- Menu com a opção "HOJE" e seleção de meses através das setas -->
      <v-btn id="botaoHoje" class="mr-4" @click="definirHoje">
        <v-icon id="iconeBotaoHoje">mdi-calendar-today</v-icon>
        Hoje
      </v-btn>

      <v-btn text small color="white darken-2" @click="mesAnterior">
        <v-icon>mdi-arrow-left-thick</v-icon>
      </v-btn>

      <v-btn text small color="white darken-2" @click="proximoMes">
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>

      <!-- Exibe o mês atual e o ano atual -->
      <v-toolbar-title v-if="tituloCalendario" id="mesAnoAtual">
        {{ tituloCalendario }}
      </v-toolbar-title>
    </v-toolbar>

    <!-- Componente Calendário -->
    <v-sheet id="calendarioEstilos">
      <v-calendar ref="calendar" v-model="foco" color="primary" :events="events" :event-color="pegarEventoCor"
        @click:event="abrirPopUpEditarEvento" @click:date="abrirPopUpAdicionarEventos" @change="atualizarMes">

        <!-- Exibe hora e nome do evento -->
        <template v-slot:event="{ event }">
          {{ String(event.start.getHours()).padStart(2, '0') }}:{{ String(event.start.getMinutes()).padStart(2, '0') }}
          | {{ event.nomeEvento }}
        </template>
      </v-calendar>

      <!-- Formulário de adição de evento -->
      <v-dialog v-model="adicionarEventoDialogo" max-width="500px" persistent>
        <v-card>
          <v-card-title>Adicionar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="novoEvento.nomeEvento" :rules="[v => !!v || 'Título do Evento é obrigatório']"
                label="Nome do evento"></v-text-field>
              <v-select v-model="novoEvento.corEvento" :items="corEmPortugues"
                :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <!-- Rótulo para o relógio -->
              <label for="timePicker" id="fraseAntesDoRelogio">Hora do Evento</label>
              <!-- Container para envolver o relógio -->
              <div id="timePicker" class="containerRelogio">
                <v-time-picker id="relogioEstilo" v-model="novoEvento.time" format="24hr"
                  :rules="[v => !!v || 'Hora é obrigatória']"></v-time-picker>
              </div>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn id="botaoCancelarCriarEvento" color="grey" @click="cancelarAdicionarEvento">
              <v-icon>mdi-cancel</v-icon>
              Cancelar
            </v-btn>

            <v-btn :disabled="carregando" :loading="carregando" color="primary" @click="adicionarEvento">
              <v-icon>mdi-plus</v-icon>
              Adicionar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Formulário de edição de evento -->
      <v-dialog v-model="editarEventoDialogo" width="500px" persistent>
        <v-card id="cardEditarEventos">
          <v-card-title>Editar Evento</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="editarEvento.nomeEvento" :rules="[v => !!v || 'Título do Evento é obrigatório']"
                label="Nome do evento"></v-text-field>

              <div class="d-flex justify-space-between">
                <v-select id="editarEventoohora" v-model="editarEventoohora" :items="hours" label="Hora"
                  @change="updateEventTitleWithTime"></v-select>

                <v-select id="editarEventohora" v-model="editarEventohora" :items="minutes" label="Minutos"
                  @change="updateEventTitleWithTime"></v-select>
              </div>

              <v-select v-model="editarEvento.corEvento" :items="corEmPortugues"
                :rules="[v => !!v || 'Cor do Evento é obrigatório']" label="Cor do Evento"></v-select>
              <v-btn id="botaoExcluirEvento" color="red" @click="abrirDeletarDialogo(editarEventoIndice)">
                <v-icon>mdi-delete</v-icon>
                Excluir Evento
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn id="botaoCancelarEditarEvento" color="grey" @click="cancelarEditarEvento">
              <v-icon>mdi-cancel</v-icon>
              Cancelar
            </v-btn>

            <v-btn id="botaoSalvarALteracoesEvento" :loading="carregando" color="primary" @click="salvarEditarEvento">
              <v-icon id="iconeSalvarALteracoesEvento">mdi-content-save</v-icon>
              <span id="palavraSalvar">Salvar</span>
            </v-btn>
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
          <v-card-actions id="cardConfirmarExclusao">
            <v-btn color="grey" id="botaoCancelarExclusao" @click="cancelarDeletarEvento">
              <v-icon>mdi-cancel</v-icon>
              Cancelar
            </v-btn>

            <v-btn color="red" id="botaoConfirmarExclusao" @click="confirmarDeletarEvento">
              <v-icon>mdi-delete</v-icon>
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
  </v-main>
</template>

<style scoped>
#mainEstilo {
  margin-bottom: 55px;
}

#toolbarSuperior {
  margin-top: 10px;
}

#botaoHoje {
  border-radius: 10px;
  background-color: #E8F1F2;
}

#iconeBotaoHoje {
  margin-right: 7px;
}

#mesAnoAtual {
  color: white;
}

#calendarioEstilos {
  margin-top: 10px;
  height: 723px;
}

.containerRelogio {
  margin-top: 20px;
}

#relogioEstilo {
  width: 450px;
}

#fraseAntesDoRelogio {
  font-size: 18px;
  display: block;
  text-align: center;
  width: 100%;
}

#cardEditarEventos {
  height: 35vh;
}

#botaoCancelarCriarEvento {
  margin-right: 10px;
}

#botaoCancelarEditarEvento {
  position: absolute;
  left: 4%;
  bottom: 8%;
}

#botaoExcluirEvento {
  position: absolute;
  bottom: 8%;
  left: 16vh;
}

#botaoSalvarALteracoesEvento {
  position: absolute;
  bottom: 8%;
  right: 9%;
}

#iconeSalvarALteracoesEvento,
#palavraSalvar {
  color: black;
}

#cardConfirmarExclusao {
  height: 5vh;
}

#botaoCancelarExclusao {
  position: absolute;
  left: 5%;
  margin-bottom: 20px;
}

#fraseExclusao {
  font-size: 20px;
}

#botaoConfirmarExclusao {
  position: relative;
  left: 30%;
  margin-bottom: 20px;
}
</style>

<script>
import { updateDoc, collection, addDoc, getDocs, where, query, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../main';

export default {

  data() {
    return {
      hours: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}`), // Horas do dia
      minutes: Array.from({ length: 60 }, (_, i) => `${i < 10 ? '0' : ''}${i}`), // Minutos do dia
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
      cores: ['pink', 'green', 'grey', 'cyan', 'blue', 'orange', 'red', 'purple', 'black'],
      nomeCores: {
        'pink': 'Rosa',
        'green': 'Verde',
        'grey': 'Cinza',
        'cyan': 'Ciano',
        'blue': 'Azul',
        'orange': 'Laranja',
        'red': 'Vermelho',
        'purple': 'Roxo',
        'black': 'Preto'
      },

    };
  },

  async mounted() {
    await this.buscarEventosFirestore();
  },

  computed: {
    corEmPortugues() {
      return this.cores.map(cor => {
        return {
          text: this.nomeCores[cor],
          value: cor
        };
      });
    }
  },

  methods: {
    definirHoje() {
      this.foco = new Date()
    },

    mesAnterior() {
      this.$refs.calendar.prev();
    },

    proximoMes() {
      this.$refs.calendar.next();
    },

    atualizarHoraMinutoDoEvento() {
      const hour = this.editarEventohora.padStart(2, '0');
      const minute = this.editarEventohora.padStart(2, '0');
      this.editarEvento.time = `${hour}:${minute}`;
    },

    pegarEventoCor(event) { // Retorna a cor do evento para exibição no calendário
      return event.corEvento;
    },

    async abrirPopUpAdicionarEventos({ date }) {
      this.novoEvento = {
        nomeEvento: '',
        date: date,
        time: '',
        corEvento: ''
      };
      this.adicionarEventoDialogo = true;
    },

    async adicionarEvento() {
      if (!this.$refs.form.validate()) return; // // Valida o formulário

      this.carregando = true;

      try {
        const user = auth.currentUser;
        const email = user ? user.email : null; // Obtém o email do usuário
        const dataHoraLocal = new Date(this.novoEvento.date + 'T' + this.novoEvento.time);

        const event = { // contem os dados do novo evento.
          nomeEvento: this.novoEvento.nomeEvento,
          start: dataHoraLocal,
          corEvento: this.novoEvento.corEvento,
          EmailUsuario: email // 
        };

        const documentoReferencia = await addDoc(collection(db, 'eventos'), event); // adiciona o novo evento à coleção eventos no Firestore
        event.id = documentoReferencia.id;
        this.events.push(event); // Adiciona o novo evento à lista de eventos
        this.ordenarEventosPorHora(); // Ordena os eventos por hora
        this.adicionarEventoDialogo = false;
      } catch (e) {
        alert("Erro ao adicionar o evento: ", e);
      } finally {
        this.carregando = false;
      }
    },


    abrirPopUpEditarEvento({ event }) {
      this.editarEvento = { ...event };  // objeto que representa o evento atualmente sendo editado
      const eventoData = new Date(event.start); // Obtém a data do evento
      this.editarEventoohora = String(eventoData.getHours()).padStart(2, '0');
      this.editarEventohora = String(eventoData.getMinutes()).padStart(2, '0');
      this.editarEventoDialogo = true;
    },

    async salvarEditarEvento() {
      this.carregando = true;
      try {
        const atualizaEvento = { ...this.editarEvento };
        const dataHoraLocal = new Date(atualizaEvento.start);
        dataHoraLocal.setHours(parseInt(this.editarEventoohora));
        dataHoraLocal.setMinutes(parseInt(this.editarEventohora));
        atualizaEvento.start = dataHoraLocal; // Atualiza a data de início do evento para a hora e os minutos atualizados.

        // Remove os campos id e time do objeto antes de enviar ao Firestore
        delete atualizaEvento.id;
        delete atualizaEvento.time;

        // Atualiza o evento na lista de eventos
        const indice = this.events.findIndex(event => event.id === this.editarEvento.id);
        if (indice !== -1) { // Verifica se o evento foi encontrado na lista 
          this.events.splice(indice, 1, { ...atualizaEvento, id: this.editarEvento.id });
          this.ordenarEventosPorHora(); // Ordena os eventos por hora
        }

        // Atualiza o evento no Firestore
        const eventoDocumento = doc(db, 'eventos', this.editarEvento.id);
        await updateDoc(eventoDocumento, atualizaEvento);

        this.editarEventoDialogo = false;
      } catch (e) {
        alert("Erro ao editar o evento: ", e);
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

    cancelarAdicionarEvento() {
      this.adicionarEventoDialogo = false;
      this.novoEvento = {
        name: '',
        date: '',
        time: '',
        corEvento: ''
      };
    },

    cancelarDeletarEvento() {
      this.deletarEventoDialogo = false;
    },

    async confirmarDeletarEvento() {
      this.carregando = true;
      try {
        const deletarEvento = this.editarEvento;

        // deleta o documento no Firestore
        await deleteDoc(doc(db, 'eventos', deletarEvento.id));
        // Atualiza a lista de eventos usando filtro para remover o evento que foi deletado
        this.events = this.events.filter(event => event.id !== deletarEvento.id);
        this.deletarEventoDialogo = false;
        this.editarEventoDialogo = false;
      } catch (e) {
        alert("Erro ao deletar o evento: ", e);
      } finally {
        this.carregando = false;
      }
    },

    async buscarEventosFirestore() {
      const user = auth.currentUser;
      const email = user ? user.email : null; // obtém o email do usuário

      if (email) {
        // Cria uma consulta para buscar eventos na coleção do firestore do usuário autenticado.
        const consulta = query(collection(db, 'eventos'), where('EmailUsuario', '==', email));
        const resultadoConsulta = await getDocs(consulta);

        // Mapeia os documentos retornados para objetos de evento e atualiza a lista de eventos
        this.events = resultadoConsulta.docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          data.start = data.start.toDate();

          return data;
        });

        // Ordena os eventos por hora antes de atualizar a lista
        this.ordenarEventosPorHora();
      }
    },

    ordenarEventosPorHora() {
      this.events.sort((a, b) => {
        return a.start - b.start;
      });
    },

    atualizarMes() {
      this.tituloCalendario = this.$refs.calendar.title;
    }
  },
};
</script>