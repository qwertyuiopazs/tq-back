<template>
  <div class="banner_wrap">
    <el-row>
      <el-col :offset="2" :span="18">
        <h1>设置banner</h1>

        <el-card>
          <div class="upload_wrap">
            <el-upload
              class="upload-demo"
              :action="'/promote/tools/uploadImage'"
              :on-change="handleChange"
              :file-list="fileList"
              :on-success="onSuccess"
              :code="onError"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件
              </div>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="banner_wrap">
      <el-row>
        <el-col :offset="2" :span="18">
          <el-card>
            <el-button type="danger" @click="switchDel(true)" class="button"
              >批量操作</el-button
            >
            <el-button
              v-if="isDel"
              type="danger"
              @click="handleDelete"
              class="button"
              >批量删除</el-button
            >
            <el-button type="primary" @click="switchDel(false)" class="button"
              >取消操作</el-button
            >
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="8"
          v-for="(item, index) in bannerList"
          :key="index"
          :offset="2"
          :style="{ marginTop: '15px' }"
        >
          <el-card
            :body-style="{
              padding: '15px'
            }"
            :style="{ backgroundColor: renderColor(item.id) }"
          >
            <img :src="item.bannerUrl" alt="" />
            <div v-if="isDel" style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button
                  type="primary"
                  @click="selectDel(item.id)"
                  class="button"
                  >删除</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Banner",
  data() {
    return {
      fileList: [],
      isDel: false,
      selectedList: []
    };
  },
  computed: {
    ...mapGetters(["bannerList"])
  },
  watch: {
    isDel(val, prevVal) {
      if (val === false) {
        this.selectedList = [];
      }
    }
  },
  methods: {
    ...mapActions({
      delBanner: "banner/delBanner",
      getBannerList: "banner/getBannerList",
      addBanner: "banner/addBanner"
    }),
    handleDelete() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: "卧槽，你先选个图片啊",
          type: "error"
        });
        return;
      }
      this.delBanner(this.selectedList)
        .then(() => {
          this.getBannerList();
          this.selectedList = [];
          this.isDel = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    onSuccess(response, file, fileList) {
      if (response && response.code === 200) {
        this.addBanner(response.msg).then(data => {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.getBannerList();
        });
      } else {
        this.$message.success(response.msg);
      }
    },
    onError(response) {
      if (response) {
        this.$message.error(response.msg);
      }
    },

    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },

    switchDel(bool) {
      this.isDel = bool;
    },
    renderColor(id) {
      return this.selectedList.includes(id) ? "#666" : "#fff";
    },
    selectDel(id) {
      if (this.selectedList.includes(id)) {
        const list = _.cloneDeep(this.selectedList);
        this.selectedList = list.filter(item => item !== id);
      } else {
        this.selectedList.push(id);
      }
    }
  },
  mounted() {
    this.getBannerList();
  }
};
</script>

<style lang="scss" scoped>
.banner_wrap {
  height: 100%;
  padding-bottom: 50px;
  h1 {
    text-align: center;
  }
}

.upload_wrap {
  width: 600px;
  margin: 0 auto;
  padding: 50px 0;
  text-align: center;
}

.banner_wrap {
  margin-top: 30px;
}
</style>
