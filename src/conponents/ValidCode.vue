<template>
  <div class="ValidCode disabled-select" style="width: 100%; height: 100%" @click="refreshCode">
    <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{ item.code }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: "validCode",
  data() {
    return {
      length: 4,
      codeList: []
    };
  },
  mounted() {
    this.createCode();
  },
  methods: {
    createCode() {
      const len = this.length;
      const codeList = [];
      const chars = 'ABCDEFGHIJKLMNOPQRSTWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charsLen = chars.length;

      for (let i = 0; i < len; i++) {
        const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)];
        codeList.push({
          code: chars.charAt(Math.floor(Math.random() * charsLen)),
          color: `rgb(${rgb.join(",")})`,
          padding: `${Math.floor(Math.random() * 10)}px`,
          transform: `rotate(${Math.floor(Math.random() * 180) - 90}deg)` // 生成 -90 到 90 度的旋转角度
        });
      }

      this.codeList = codeList;
      this.$emit('update:value', codeList.map(item => item.code).join(''));
    },
    refreshCode() {
      this.createCode();
    },
    getStyle(item) {
      return `color: ${item.color}; padding: ${item.padding}; transform: ${item.transform}`;
    }
  }
};
</script>

<style>
.ValidCode {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>

.ValidCode span{
  display: inline-block;
  font-size: 18px;
}
</style>