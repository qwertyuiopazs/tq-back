<template>
  <div class="analyst_wrap">
    <h1 class="main_title">分析师管理</h1>
    <div class="list_wrap">
      <el-card>
        <el-button
          @click="showAdd(true)"
          :style="{ marginBottom: '15px' }"
          type="primary"
        >
          添加
        </el-button>
        <el-button
          v-if="multipleSelection.length"
          @click="handleDeleteMultiple"
          :style="{ marginBottom: '15px' }"
          type="primary"
        >
          批量删除
        </el-button>
        <el-table
          :data="analystList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="编号" width="50" prop="id" />
          <el-table-column label="姓名" width="120" prop="analystName" />
          <el-table-column label="头像" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <img class="table_img" :src="scope.row.avatarUrl" alt="" />
                <div slot="reference" class="name-wrapper">
                  <img class="table_img" :src="scope.row.avatarUrl" alt="" />
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="二维码" width="120" prop="qrUrl">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <img class="table_img" :src="scope.row.qrUrl" alt="" />
                <div slot="reference" class="name-wrapper">
                  <img class="table_img" :src="scope.row.qrUrl" alt="" />
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="近5场战绩"
            width="100"
            prop="recentFiveTimes"
          />
          <el-table-column label="命中率" width="120" prop="hitRate" />
          <el-table-column label="VIP推手" width="120" prop="vipGradeAnalyst">
            <template slot-scope="scope">
              <span>{{
                Number(scope.row.vipGradeAnalyst) === 1 ? "是" : "否"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteSingle(scope.row)"
                >删除</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="showExploitsDetail(scope.row)"
                >战绩管理</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation">
          <el-pagination
            background
            @current-change="pagenatiOnchange"
            layout="prev, pager, next"
            :page-size="analystListInfo.size"
            :current-page="analystListInfo.current"
            :total="analystListInfo.total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog title="添加分析师" :visible.sync="dialogVisible" width="600px">
      <div class="dialog_wrap">
        <div class="upload_wrap">
          <p class="label_wrap">头像</p>
          <el-upload
            class="avatar-uploader"
            action="/promote/tools/uploadImage"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="upload_wrap">
          <p class="label_wrap">二维码</p>
          <el-upload
            class="avatar-uploader"
            action="/promote/tools/uploadImage"
            :show-file-list="false"
            :on-success="handleQrSuccess"
            :before-upload="beforeQrUpload"
          >
            <img v-if="qrUrl" :src="qrUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="姓名" :style="{ width: '300px' }">
            <el-input v-model="form.analystName"></el-input>
          </el-form-item>
          <el-form-item label="近五场战绩" :style="{ width: '300px' }">
            <el-input v-model="form.recentFiveTimes"></el-input>
          </el-form-item>
          <el-form-item label="命中率" :style="{ width: '300px' }">
            <el-input type="number" v-model="form.hitRate">
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>

          <el-form-item label="是否VIP推手">
            <el-radio-group v-model="form.vipGradeAnalyst">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button v-if="!isEdit" type="primary" @click="onSubmit"
              >立即添加</el-button
            >
            <el-button v-else type="primary" @click="onSubmit"
              >立即修改</el-button
            >
            <el-button @click="showAdd(false)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <exploits
      :analystId="analystId"
      @closeDialog="closeDialog"
      v-if="exploitsVisible"
    />
  </div>
</template>

<script>
import _ from "lodash";
import Exploits from "./exploits";
import { mapActions, mapState } from "vuex";
import { addAnalyst, delAnalyst, updateAnalyst } from "@/api/analyst";

export default {
  name: "analyst",
  components: {
    Exploits
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      dialogVisible: false,
      multipleSelection: [],
      // 头像
      imageUrl: "",
      // 二维码
      qrUrl: "",

      form: {
        analystName: "",
        avatarUrl: "",
        hitRate: "",
        qrUrl: "",
        recentFiveTimes: "",
        vipGradeAnalyst: ""
      },
      // 是否再编辑状态
      isEdit: false,

      // 分析师对应战绩
      exploitsVisible: false,
      analystId: -1
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        // 关闭弹窗，重置数据
        this.resetAllStatus();
      }
    }
  },
  computed: {
    ...mapState({
      analystListInfo: state => {
        const {
          analystList = {
            current: this.pageNum,
            size: this.pageSize,
            total: 0
          }
        } = state.analyst;
        return analystList;
      },
      analystList: state => {
        const { records = [] } = state.analyst.analystList;
        return records;
      }
    })
  },

  methods: {
    ...mapActions({
      getAnalystList: "analyst/getAnalystPage"
    }),
    resetAllStatus() {
      this.form = {
        analystName: "",
        avatarUrl: "",
        hitRate: "",
        qrUrl: "",
        recentFiveTimes: "",
        vipGradeAnalyst: ""
      };
      this.imageUrl = "";
      this.qrUrl = "";
      this.isEdit = false;
    },
    getAnalystListDtail() {
      const { pageNum, pageSize } = this;
      this.getAnalystList({
        pageNum,
        pageSize
      });
    },
    handleEdit(row) {
      const data = _.cloneDeep(row);
      // v-model="form.vipGradeAnalyst" 识别字符串
      data.vipGradeAnalyst = data.vipGradeAnalyst.toString();
      this.form = data;
      this.imageUrl = row.avatarUrl;
      this.qrUrl = row.qrUrl;
      this.dialogVisible = true;
      this.isEdit = true;
    },
    showAdd(bool) {
      this.dialogVisible = bool;
    },
    // 删除单个
    handleDeleteSingle(row) {
      const arr = [];
      arr.push(row.id);
      this.handleDeleteBatch(arr);
    },
    // 批量删除
    handleDeleteMultiple() {
      this.handleDeleteBatch(this.multipleSelection, true);
    },
    // 删除
    handleDeleteBatch(list, isMultiple = false) {
      this.$confirm("确认删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          delAnalyst(list)
            .then(() => {
              this.getAnalystListDtail();

              // 重置状态
              if (isMultiple) {
                this.multipleSelection = [];
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      const arr = [];
      if (val && val.length) {
        val.map(item => {
          arr.push(item.id);
        });
      }
      this.multipleSelection = arr;
    },
    onSubmit() {
      const { isEdit = false } = this;
      // 提交
      const {
        analystName,
        avatarUrl,
        hitRate,
        qrUrl,
        recentFiveTimes,
        vipGradeAnalyst
      } = this.form;

      if (!avatarUrl) {
        this.$message({
          message: "请上传头像",
          type: "error"
        });
        return;
      }
      if (!qrUrl) {
        this.$message({
          message: "请上传二维码图片",
          type: "error"
        });
        return;
      }
      if (!analystName) {
        this.$message({
          message: "请填写姓名",
          type: "error"
        });
        return;
      }
      if (!recentFiveTimes) {
        this.$message({
          message: "请填写近五场战绩",
          type: "error"
        });
        return;
      }
      if (!hitRate) {
        this.$message({
          message: "命中率没填",
          type: "error"
        });
        return;
      }
      if (!vipGradeAnalyst) {
        this.$message({
          message: "是否VIP推手没有选",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateAnalyst(this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getAnalystListDtail();
            // 重置状态
            this.dialogVisible = false;
            this.resetAllStatus();
          })
          .catch(error => {
            this.$message({
              message: error.msg,
              type: "error"
            });
          });
      } else {
        addAnalyst(this.form)
          .then(() => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getAnalystListDtail();
            // 重置状态
            this.dialogVisible = false;
            this.resetAllStatus();
          })
          .catch(error => {
            //
          });
      }
    },
    // 上传头像
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.avatarUrl = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "上传成功" });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 上传二维码
    handleQrSuccess(res, file) {
      this.qrUrl = URL.createObjectURL(file.raw);
      this.form.qrUrl = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "二维码上传成功" });
    },
    beforeQrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("二维码图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 分页
    pagenatiOnchange(index) {
      this.pageNum = index;
      this.getAnalystListDtail();
    },

    // 显示战绩管理
    showExploitsDetail(item) {
      this.analystId = item.id;
      this.exploitsVisible = true;
    },
    closeDialog() {
      this.exploitsVisible = false;
    }
  },
  mounted() {
    this.getAnalystListDtail();
  }
};
</script>

<style lang="scss">
.analyst_wrap {
  .main_title {
    text-align: center;
  }

  .list_wrap {
    width: 95%;
    margin: 0 auto;
  }

  .pagenation {
    text-align: center;
    padding: 20px 0;
  }

  // 列表图片尺寸
  .table_img {
    width: 100px;
    height: 100px;
  }

  // 对话框
  .dialog_wrap {
    .upload_wrap {
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
