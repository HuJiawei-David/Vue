<template>
  <div>
    <el-card style="width: 50%">
      <el-form :model="user" label-width="80px" style="padding-right: 20px">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:9090/file/upload"
              :headers="{ token: user.token }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <!-- 仅保留一个用户名输入项，并设为禁用 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="textarea" v-model="user.address" placeholder="地址"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: "Person",
  data(){
    return {
      user: {
        id: null,
        username: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        avatar: '',
        role: '',
        token: ''
      }
    }
  },
  created(){
    // 从 localStorage 初始化用户数据
    const storedUser = JSON.parse(localStorage.getItem("user") || '{}'); // Changed from "honey-user" to "user"
    console.log('Stored user:', storedUser);
    // 确保所有字段都被正确设置
    this.user = {
      id: storedUser.id || null,
      username: storedUser.username || '',
      password: storedUser.password || '',
      name: storedUser.name || '',
      phone: storedUser.phone || '',
      email: storedUser.email || '',
      address: storedUser.address || '',
      avatar: storedUser.avatar || '',
      role: storedUser.role || '',
      token: storedUser.token || ''
    };
    console.log('Initialized user:', this.user);
  },
  methods: {

    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG/GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isImage && isLt2M;
    },

    handleAvatarSuccess(response, file, fileList){
      // console.log('Upload response:', response);
      // if(response.code === '200' && response.data){
      this.user.avatar = response.data; // 设置用户头像 URL
      //   console.log('Updated user before update:', this.user);
      //   this.update(); // 更新用户信息
      // } else {
      //   this.$message.error(response.msg || '上传失败');
      // }
    },

    update(){
      console.log('Sending update request with user:', this.user);
      request.put('/user/update', this.user).then(res => {
        if(res.code === '200'){
          this.$message.success(res.msg || '更新成功');
          // 更新 localStorage 中的用户信息
          localStorage.setItem('user', JSON.stringify(this.user)); // Changed from "honey-user" to "user"
          console.log('Updated localStorage user:', this.user);
        } else {
          this.$message.error(res.msg || '更新失败');
        }
      }).catch(error => {
        console.error('更新失败:', error);
        this.$message.error('更新失败，请稍后重试');
      });
    },
  }
}
</script>


<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 50%; /* 使头像呈圆形 */
  object-fit: cover; /* 确保图片按比例缩放并填满容器 */
}
</style>
