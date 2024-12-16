<!-- home.vue -->
<template>
  <div class="home-page">
    <nav class="navbar">
      <div class="logo">VDRST</div>
      <div class="nav-links">
        <button @click="goHome" class="nav-button">Home</button>
        <!-- 已移除登录、保存结果和登出按钮 -->
      </div>
    </nav>

    <div class="search-section">
      <div class="search-box">
        <input
            v-model="sequence"
            type="text"
            placeholder="Enter DNA/RNA sequence (max 10,000 characters)"
            @input="validateLength"
        />
        <button :disabled="searching" @click="startSearch" class="search-button">
          <i class="search-icon">🔍</i>
        </button>
      </div>
      <p v-if="sequenceError" class="error-message">{{ sequenceError }}</p>

      <div v-if="searching" class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <p>{{ progress }}% Searching...</p>
      </div>
    </div>

    <div class="info-section">
      <p>VDRST is your go-to platform for analyzing and understanding viral DNA and RNA.</p>
      <p>Contact us: support@vdrst.com</p>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Home",
  data() {
    return {
      sequence: "",
      sequenceError: "",
      maxLength: 10000,
      searching: false,
      progress: 0,
    };
  },
  methods: {
    goHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/").catch((err) => err);
      }
    },
    validateLength() {
      if (this.sequence.length > this.maxLength) {
        this.sequence = this.sequence.substring(0, this.maxLength);
        this.sequenceError = `Sequence cannot exceed ${this.maxLength} characters.`;
      } else {
        this.sequenceError = "";
      }
    },
    async startSearch() {
      if (!this.sequence.trim()) {
        this.sequenceError = "Sequence cannot be empty.";
        return;
      }

      if (!/^[ACGTUacgtu]+$/.test(this.sequence.trim())) { // 包含'U'用于RNA
        this.sequenceError = "Invalid DNA/RNA sequence. Allowed: A, C, G, T, U.";
        return;
      }

      this.sequenceError = "";
      this.searching = true;
      this.progress = 0;

      const interval = setInterval(() => {
        if (this.progress < 80) { // 改为80%，留出20%给完成时
          this.progress += 5; // 每次增加5%
        }
      }, 1000); // 每1秒增加5%

      try {
        const response = await request.post("/search", { sequence: this.sequence });

        this.progress = 100;
        clearInterval(interval);

        if (response && response.code === "200") {
          this.$router.push({
            path: "/results",
            query: {
              data: JSON.stringify(response.data),
              sequence: this.sequence, // 传递搜索序列
            },
          });
        } else {
          alert(response.msg || "Search failed.");
        }
      } catch (error) {
        clearInterval(interval);
        alert("An error occurred during search. Please try again.");
      } finally {
        setTimeout(() => {
          this.searching = false;
          this.progress = 0;
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
.home-page {
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
  padding: 12px 20px; /* 增加宽度 */
  cursor: pointer;
  border-radius: 16px; /* 更圆的角 */
  transition: background-color 0.3s;
}

.nav-links button.nav-button:hover {
  background-color: #45a049;
}

.search-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.search-box {
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 600px;
  background: white;
  border-radius: 50px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
  border-radius: 50px;
}

.search-box input::placeholder {
  color: #aaa;
}

.search-box button.search-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 50px; /* 增加宽度 */
  height: 50px; /* 增加高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px; /* 圆形按钮 */
  transition: background-color 0.3s;
}

.search-box button.search-button:hover {
  background-color: #f0f0f0;
}

.search-box .search-icon {
  font-size: 20px;
  color: #888;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.progress-container {
  width: 80%;
  max-width: 600px;
  margin-top: 20px;
  text-align: center;
}

.progress-bar {
  height: 8px;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}
.progress-container p {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.info-section {
  padding: 20px;
  text-align: center;
  background-color: #2f4f4f;
  color: white;
}
</style>


