<template>
  <div class="container">
      <div class="header">
        <img src="@/assets/celestia.png" alt="Celestia logo" class="celestia-logo" />
        <h1 class="form-title">Celestia PFB Transaction</h1>
      </div>
    <div class="pfb-form" :class="{ 'pfb-form--loading': isLoading }">
      <form @submit.prevent="handleSubmit">
        <!-- Form fields -->
        <div class="form-group">
          <label for="namespace_id">Namespace ID:</label>
          <input
              type="text"
              id="namespace_id"
              v-model="namespace_id"
              class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="data">Data:</label>
          <input
              type="text"
              id="data"
              v-model="data"
              class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="nodeUrl">Node URL (optional):</label>
          <input
              type="text"
              id="nodeUrl"
              v-model="nodeUrl"
              class="form-control"
              placeholder="http://localhost:26659/submit_pfb"
          />
        </div>
        <button type="button" @click="generateNamespaceAndData" class="generate-btn">
          Generate Namespace ID and Data
        </button>
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </button>
        <div v-if="errorMessage" class="error-msg" :class="{ 'info-box--loading': isLoading }">
          {{ errorMessage }}
        </div>
      </form>
    </div>
    <div v-if="response && typeof response === 'string'" class="error-msg">
      {{ response }}
    </div>
    <div v-if="response && typeof response === 'object'" class="response-info" :class="{ 'info-box--loading': isLoading }">
    <div class="font-bold text-xl mb-2">Status: {{ response.status }}</div>
      <div class="font-bold text-lg mb-2">TxHash: {{ response.txhash }}</div>
      <div class="font-bold text-lg mb-2">Height: {{ response.height }}</div>
      <div class="font-bold text-lg mb-2">
        Namespace ID: {{ response.original_namespace_id }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PFBForm',
  data() {
    return {
      namespace_id: '',
      data: '',
      nodeUrl: '',
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    generateNamespaceAndData() {
      // Generate random Namespace ID and Data here
      const namespaceId = this.generateRandomHex(16);
      const data = this.generateRandomHex(100);

      this.namespace_id = namespaceId;
      this.data = data;
    },
    generateRandomHex(length) {
      let result = '';
      const characters = 'abcdef0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    isValidNamespaceId(namespaceId) {
      // Check if the input is a hex-encoded string and has 16 characters (8 bytes)
      return /^([0-9a-fA-F]{2}){8}$/.test(namespaceId);
    },
    isValidData(data) {
// Check if the input is a hex-encoded string with a length up to 100 characters (50 bytes)
      return /^([0-9a-fA-F]{2}){0,50}$/.test(data);
    },
    async handleSubmit() {
      if (!this.isValidNamespaceId(this.namespace_id)) {
        this.errorMessage = 'Error: Invalid Namespace ID format. It should be a 16-character hex-encoded string.';
        return;
      }
      if (!this.isValidData(this.data)) {
        this.errorMessage = 'Error: Invalid Data format. It should be hex-encoded and length should be less than 100 bytes.';
        return;
      }

      this.isLoading = true;

      try {
        let proxyport = process.env.VUE_APP_PROXYPORT || 4454;
        console.log(process.env.VUE_APP_SERVERDOMAIN)
        let server_domain = process.env.VUE_APP_SERVERDOMAIN || 'http://localhost';
        let url = server_domain + ":"+proxyport + '/submit_pfb';
        const response = await axios.post(
            url,
            {
              namespace_id: this.namespace_id,
              data: this.data,
              gas_limit: 80000,
              fee: 2000,

            },
            {
              headers: {
                'Content-Type': 'application/json',
                'node_url': this.nodeUrl,
              },
            },
        );

        if (response.status === 200) {
          const responseData = response.data;
          console.log(responseData)
          const extractedData = {
            status: 'success',
            txhash: responseData.txhash,
            height: responseData.height,
            original_namespace_id: this.namespace_id,
          };
          this.response = extractedData;
        } else {
          console.error('Failed:', response);
          this.response = `Error: ${response.statusText}, Please try again later.`;
        }
      } catch (error) {
        console.error(error);
        this.response = `Error: ${error.message}, Please try again later.`;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.celestia-logo {
  height: 50px; /* Adjust the logo size as needed */
}

.form-title {
  font-size: 36px;
  margin: 0;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.intro {
  margin-bottom: 40px;
}

.intro h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.pfb-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #1abc9c;
  outline: none;
}

.submit-btn, .generate-btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover, .generate-btn:hover {
  background-color: #16a085;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.generate-btn {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-btn:hover {
  background-color: #2980b9;
}

.error-msg, .response-info {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  transition: background-color 0.3s, border-color 0.3s;
}

.error-msg {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.response-info {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.info-box--loading {
  background-color: #e0e0e0;
  color: #6c757d;
  border-color: #d5d5d5;
}

.font-bold {
  font-weight: bold;
}

.text-xl {
  font-size: 24px;
}

.text-lg {
  font-size: 18px;
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
