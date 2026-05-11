<template>
  <div class="page">
    <form @submit.prevent="envoyerEmail">
      <div class="logo">💌</div>
      <h1>Envoyer un message</h1>

      <label>Votre nom</label>
      <input v-model="form.nom" placeholder="👤 Entrez votre nom" type="text" />

      <label>Votre email</label>
      <input v-model="form.email" placeholder="📧 Entrez votre email" type="email" />

      <label>Sujet</label>
      <input v-model="form.sujet" placeholder="💬 Entrez le sujet" type="text" />

      <label>Votre message</label>
      <textarea v-model="form.message" placeholder="Écrivez votre message..." rows="5"></textarea>

      <!-- Message de retour -->
      <div v-if="feedback.text" :class="['feedback', feedback.type]">
        {{ feedback.text }}
      </div>

      <input
        type="submit"
        :value="loading ? 'Envoi en cours...' : 'Envoyer le message'"
        :disabled="loading"
      />
    </form>

    <footer>
      <p>@2024 - Mon Application d'Envoi de Mail. <span>Réynaldo AHC 👍</span></p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        nom: '',
        email: '',
        sujet: '',
        message: '',
      },
      loading: false,
      feedback: { text: '', type: '' },
    };
  },
  methods: {
    async envoyerEmail() {
      this.feedback = { text: '', type: '' };

      if (!this.form.nom || !this.form.email || !this.form.sujet || !this.form.message) {
        this.feedback = { text: '⚠️ Veuillez remplir tous les champs.', type: 'error' };
        return;
      }

      this.loading = true;
      try {
        const res = await axios.post('http://localhost:3000/send-email', this.form);
        this.feedback = { text: '✅ ' + res.data.message, type: 'success' };
        this.form = { nom: '', email: '', sujet: '', message: '' };
      } catch (err) {
        const msg = err.response?.data?.error || 'Erreur inconnue.';
        this.feedback = { text: '❌ ' + msg, type: 'error' };
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f4f7fc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.logo { font-size: 2rem; text-align: center; }
h1 { text-align: center; margin: 0 0 1rem; color: #1a1a2e; }

label { font-weight: bold; color: #444; font-size: 0.9rem; }

input[type="text"],
input[type="email"],
textarea {
  padding: 0.7rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, textarea:focus { border-color: #e07a5f; }

input[type="submit"] {
  background: #e07a5f;
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

input[type="submit"]:hover { background: #c9664d; }
input[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; }

.feedback {
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
}
.success { background: #e6f4ea; color: #2e7d32; }
.error   { background: #fdecea; color: #c62828; }

footer {
  margin-top: 1.5rem;
  color: #888;
  font-size: 0.85rem;
}
footer span { color: #e07a5f; font-weight: bold; }
</style>