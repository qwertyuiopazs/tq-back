<template>
  <div class="main_banner_wrap">
    <el-row>
      <el-col :offset="2" :span="18">
        <h1>设置banner</h1>
        <el-card>
          <div class="up_btn_wrap">
            <el-button type="primary" @click="showAdd(true)" class="button"
              >上传图片</el-button
            >
          </div>

          <el-dialog
            title="添加banner"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose"
          >
            <div class="dialog_wrap" v-loading="fullscreenLoading">
              <div class="upload_wrap">
                <p class="label_wrap">banner</p>
                <el-upload
                  class="avatar-uploader"
                  action="/promote/tools/uploadImage"
                  :show-file-list="false"
                  :on-success="onSuccess"
                  :before-upload="beforeUpload"
                >
                  <img
                    v-if="form.bannerUrl"
                    :src="form.bannerUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>

              <div>
                <el-select v-model="form.pageName" placeholder="请选择页面">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <br />
                <br />
                <br />
                <el-button v-if="!isEdit" type="primary" @click="onSubmit"
                  >立即添加</el-button
                >
                <el-button v-else type="primary" @click="onSubmit"
                  >立即修改</el-button
                >
                <el-button @click="showAdd(false)">取消</el-button>
              </div>
            </div>
          </el-dialog>
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
          v-for="(item, index) in everyPageBanner"
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
            <div
              :style="{ backgroundImage: `url(${item.bannerUrl})` }"
              class="banner_item_img_wrap"
            ></div>

            <div class="banner_item_wrap" style="padding: 14px;">
              <h1>{{ item.pageName | bannerFillter }}</h1>
              <div class="bottom clearfix">
                <el-button
                  v-if="isDel"
                  type="danger"
                  @click="selectDel(item.id)"
                  class="button"
                  >删除</el-button
                >
                <el-button type="primary" class="button" @click="onisEdit(item)"
                  >修改</el-button
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
import {
  addEveryDayBanner,
  updateEveryDayBanner,
  delEveryDayBanner
} from "@/api/banner";

const options = [
  {
    value: "home",
    label: "首页"
  },
  {
    value: "vip",
    label: "vip推手页面"
  },
  {
    value: "shili",
    label: "实力推手页面"
  },
  {
    value: "todayCompetition",
    label: "今日赛程"
  },
  {
    value: "analyze",
    label: "盘口分析"
  }
];

export default {
  name: "Banner",
  data() {
    return {
      fullscreenLoading: false,
      fileList: [],
      isDel: false,
      selectedList: [],
      isEdit: false, // 编辑状态
      dialogVisible: false,
      options: options,
      form: {
        pageName: "",
        bannerUrl: ""
      }
    };
  },
  filters: {
    bannerFillter: pageName => {
      let res = "";
      options.forEach((item, index) => {
        if (item.value === pageName) {
          res = item.label;
        }
      });
      return res;
    }
  },
  computed: {
    ...mapGetters(["everyPageBanner"])
  },
  watch: {
    isDel(val, prevVal) {
      if (val === false) {
        this.selectedList = [];
      }
    },
    dialogVisible(val, prevVal) {
      if (val === false) {
        // 弹窗关闭，重置状态
        this.resetAllStatus();
      }
    }
  },
  methods: {
    ...mapActions({
      delBanner: "banner/delBanner",
      getAllEveryDayBanner: "banner/getAllEveryDayBanner"
    }),

    // 还原设置
    resetAllStatus() {
      this.isEdit = false;
      this.form = {
        pageName: "",
        bannerUrl: ""
      };
    },
    handleDelete() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: "卧槽，你先选个图片啊",
          type: "error"
        });
        return;
      }
      delEveryDayBanner(this.selectedList)
        .then(() => {
          this.getAllEveryDayBanner();
          this.selectedList = [];
          this.isDel = false;
          this.$message({
            message: "上传成功",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    onisEdit(item) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.form = item;
    },

    // 上传前 loading
    beforeUpload() {
      this.fullscreenLoading = true;
      this.$message({
        message: "正在上传",
        type: "info"
      });
    },
    onSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.$message({
        message: "上传成功",
        type: "success"
      });
      if (response && response.code === 200) {
        this.form.bannerUrl = response.msg;
      } else {
        this.$message.success(response.msg);
      }
    },
    onError(response) {
      if (response) {
        this.$message.error(response.msg);
      }
    },

    // 关闭弹窗
    handleClose(done) {
      done();
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
    },

    showAdd(bool) {
      this.dialogVisible = bool;
    },

    // 添加或修改
    onSubmit() {
      const { isEdit = false } = this;
      const { pageName = "", bannerUrl = "" } = this.form;
      console.log(pageName, bannerUrl);

      if (!pageName) {
        this.$message({
          message: "请选择页面",
          type: "error"
        });
        return;
      }
      if (!bannerUrl) {
        this.$message({
          message: "请上传图片",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateEveryDayBanner(this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getAllEveryDayBanner();
            // 重置状态
            this.dialogVisible = false;
          })
          .catch(error => {
            this.$message({
              message: error.msg,
              type: "error"
            });
          });
      } else {
        addEveryDayBanner(this.form)
          .then(() => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getAllEveryDayBanner();
            // 重置状态
            this.dialogVisible = false;
          })
          .catch(error => {
            //
          });
      }
    }
  },
  mounted() {
    this.getAllEveryDayBanner();
  }
};
</script>

<style lang="scss">
.main_banner_wrap {
  margin-top: 30px;
  height: 100%;
  padding-bottom: 50px;

  .up_btn_wrap {
    padding: 40px 0;
    text-align: center;
  }
  h1 {
    text-align: center;
  }

  .banner_item_wrap {
    h1 {
      text-align: left;
      margin: 5px 0 15px;
    }
  }
  .banner_item_img_wrap {
    width: 100%;
    padding-top: 40%;
    background-size: contain;
    background-position: center top;
    background-repeat: no-repeat;
  }

  // 对话框
  .dialog_wrap {
    text-align: center;
    .upload_wrap {
      margin: 0 auto;
      display: flex;
      align-items: center;
      margin-bottom: 22px;
      .label_wrap {
        width: 100px;
        padding-right: 12px;
        font-weight: bold;
        text-align: right;
      }
    }
  }
  // 上传
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}
</style>
