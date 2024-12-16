<template>
  <div class="results-page">
    <nav class="navbar">
      <div class="logo">VDRST</div>
      <div class="nav-links">
        <button @click="goHome" class="nav-button">Home</button>
      </div>
    </nav>

    <div class="results-section">
      <h2 class="analysis-title">Analysis Results for: {{ searchedSequence }}</h2>
      <div v-if="results.length === 0">
        <p>No similar viral sequences found.</p>
      </div>
      <div v-else class="result-cards">
        <div v-for="(result, index) in results" :key="index" class="result-card">
          <div class="content">
            <div class="field">
              <strong>Matched Sequence ID:</strong>
              <span>{{ result.matchedSequence }}</span>
            </div>
            <div class="field">
              <strong>Similarity Score:</strong>
              <span>{{ result.similarityScore.toFixed(2) }}%</span>
            </div>
            <div class="field">
              <strong>Description:</strong>
              <pre>{{ result.jobTitle }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { ElMessage } from 'element-ui';

export default {
  data() {
    return {
      results: [],
      searchedSequence: "",
      downloadModalVisible: false,
    };
  },
  created() {
    const queryData = this.$route.query.data;
    const searchedSequence = this.$route.query.sequence; // 获取搜索序列

    if (queryData) {
      try {
        const parsedData = JSON.parse(queryData);
        this.results = parsedData;
        this.searchedSequence = searchedSequence || "User Sequence"; // 使用传递的序列
      } catch (error) {
        console.error("Failed to parse query data:", error);
        ElMessage.error("Error loading results. Returning to home.");
        this.$router.push("/");
      }
    } else {
      ElMessage.error("No data received. Returning to home.");
      this.$router.push("/");
    }
  },
  methods: {
    goHome() {
      this.$router.push("/").catch((err) => err);
    },
    openDownloadModal(result) {
      this.currentResult = result;
      this.selectedFormat = 'word'; // 重置选择
      this.downloadModalVisible = true;
    },
  },
};
</script>

<style scoped>
.results-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: url("@/assets/bgp01.png") no-repeat center center fixed;
  background-size: cover;
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #2f4f4f;
  color: white;
}

.nav-links button.nav-button {
  margin-left: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 16px;
  transition: background-color 0.3s;
}

.nav-links button.nav-button:hover {
  background-color: #45a049;
}

.results-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.analysis-title {
  word-wrap: break-word;
  word-break: break-all;
  max-width: 90%;
  text-align: center;
  margin-bottom: 20px;
}

.result-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 80%;
  gap: 20px;
}

.result-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  flex: 1 1 calc(33.333% - 20px);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 350px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.field {
  display: block;
}

.field strong {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.field span, .field pre {
  display: block;
}

@media (max-width: 1024px) {
  .result-card {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 768px) {
  .result-card {
    flex: 1 1 100%;
  }
}
</style>







