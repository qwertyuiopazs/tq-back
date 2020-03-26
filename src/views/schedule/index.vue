<template>
  <div class="schedule_wrap">
    <h1 class="main_title">比赛日程</h1>
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
          :data="scheduleList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column label="编号" width="50" prop="id" />
          <el-table-column label="时间" width="170" prop="gameTime" />

          <el-table-column label="标识图" width="80">
            <template slot-scope="scope">
              <img class="table_img" :src="scope.row.markImageUrl" alt="" />
            </template>
          </el-table-column>

          <el-table-column label="比赛名称" width="150" prop="gameName" />
          <el-table-column label="队伍1图标" width="100">
            <template slot-scope="scope">
              <img class="table_img" :src="scope.row.teamOneUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column label="队伍1" width="150" prop="teamOne" />
          <el-table-column label="队伍2图标" width="100">
            <template slot-scope="scope">
              <img class="table_img" :src="scope.row.teamTwoUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column label="队伍2" width="150" prop="teamTwo" />

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
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation">
          <el-pagination
            background
            @current-change="pagenatiOnchange"
            layout="prev, pager, next"
            :page-size="scheduleInfo.size"
            :current-page="scheduleInfo.current"
            :total="scheduleInfo.total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="添加比赛日程"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <div class="dialog_wrap">
        <div class="upload_wrap">
          <p class="label_wrap">标识图：</p>
          <el-upload
            class="avatar-uploader"
            action="/promote/tools/uploadImage"
            :show-file-list="false"
            :on-success="handleQrSuccess"
            :before-upload="beforeQrUpload"
          >
            <img
              v-if="form.markImageUrl"
              :src="form.markImageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="比赛时间：" :style="{ width: '300px' }">
            <el-date-picker
              v-model="form.gameTime"
              type="datetime"
              placeholder="选择比赛时间"
              value-format="yyyy-MM-dd hh:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="比赛名称：" :style="{ width: '300px' }">
            <el-input v-model="form.gameName"></el-input>
          </el-form-item>
          <el-form-item label="队伍1" :style="{ width: '300px' }">
            <el-input v-model="form.teamOne"></el-input>
          </el-form-item>
          <!-- 队伍1图标 -->
          <el-form-item label="队伍1图标：">
            <el-upload
              class="avatar-uploader"
              action="/promote/tools/uploadImage"
              :show-file-list="false"
              :on-success="handleT1Success"
              :before-upload="beforeQrUpload"
            >
              <img
                v-if="form.teamOneUrl"
                :src="form.teamOneUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 队伍2图标 -->
          <el-form-item label="队伍2：" :style="{ width: '300px' }">
            <el-input v-model="form.teamTwo"></el-input>
          </el-form-item>
          <el-form-item label="队伍2图标：">
            <el-upload
              class="avatar-uploader"
              action="/promote/tools/uploadImage"
              :show-file-list="false"
              :on-success="handleT2Success"
              :before-upload="beforeQrUpload"
            >
              <img
                v-if="form.teamTwoUrl"
                :src="form.teamTwoUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- 底部 -->
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
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import {
  addGameSchedule,
  delGameSchedule,
  updateGameSchedule
} from "@/api/schedule";

export default {
  name: "analyst",

  data() {
    return {
      pageNum: 1, // 初始页码
      pageSize: 10,
      dialogVisible: false,
      multipleSelection: [],

      form: {
        gameName: "",
        gameTime: "",
        markImageUrl: "",
        teamOne: "",
        teamOneUrl: "",
        teamTwo: "",
        teamTwoUrl: ""
      },

      // 是否再编辑状态
      isEdit: false
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
      scheduleInfo: state => {
        const {
          scheduleInfo = {
            current: this.pageNum,
            size: this.pageSize,
            total: 0
          }
        } = state.schedule;
        return scheduleInfo;
      },
      scheduleList: state => {
        const { records = [] } = state.schedule.scheduleInfo;
        return records;
      }
    })
  },

  methods: {
    ...mapActions({
      getGameSchedulePage: "schedule/getGameSchedulePage"
    }),
    resetAllStatus() {
      this.form = {
        gameName: "",
        gameTime: "",
        markImageUrl: "",
        teamOne: "",
        teamOneUrl: "",
        teamTwo: "",
        teamTwoUrl: ""
      };
      this.isEdit = false;
    },
    getScheduleListDtail() {
      const { pageNum, pageSize } = this;
      this.getGameSchedulePage({
        pageNum,
        pageSize
      });
    },
    handleEdit(row) {
      const data = _.cloneDeep(row);
      this.form = data;
      this.dialogVisible = true;
      this.isEdit = true;
    },

    showAdd(bool) {
      this.dialogVisible = bool;
    },

    handleClose(done) {
      done();
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
          delGameSchedule(list)
            .then(() => {
              this.getScheduleListDtail();

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
        gameName,
        gameTime,
        markImageUrl,
        teamOne,
        teamOneUrl,
        teamTwoUrl,
        teamTwo
      } = this.form;

      if (!gameName) {
        this.$message({
          message: "填写比赛名称",
          type: "error"
        });
        return;
      }
      if (!markImageUrl) {
        this.$message({
          message: "请上传标识图",
          type: "error"
        });
        return;
      }
      if (!teamOneUrl) {
        this.$message({
          message: "请上传队伍一标识图",
          type: "error"
        });
        return;
      }
      if (!teamTwoUrl) {
        this.$message({
          message: "请上传队伍二标识图",
          type: "error"
        });
        return;
      }
      if (!gameTime) {
        this.$message({
          message: "请填写比赛时间",
          type: "error"
        });
        return;
      }
      if (!teamOne) {
        this.$message({
          message: "队伍1没填",
          type: "error"
        });
        return;
      }
      if (!teamTwo) {
        this.$message({
          message: "队伍2没填",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateGameSchedule(this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getScheduleListDtail();
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
        addGameSchedule(this.form)
          .then(() => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getScheduleListDtail();
            // 重置状态
            this.dialogVisible = false;
            this.resetAllStatus();
          })
          .catch(error => {
            //
          });
      }
    },

    // 上传标识图
    handleQrSuccess(res, file) {
      this.form.markImageUrl = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "二维码上传成功" });
    },
    beforeQrUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("二维码图片大小不能超过 1MB!");
      }
      return isLt1M;
    },

    // 上传队伍一图标
    handleT1Success(res, file) {
      this.form.teamOneUrl = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "二维码上传成功" });
    },

    // 上传队伍二图标
    handleT2Success(res, file) {
      this.form.teamTwoUrl = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "二维码上传成功" });
    },

    // 分页
    pagenatiOnchange(index) {
      this.pageNum = index;
      this.getScheduleListDtail();
    }
  },
  mounted() {
    this.getScheduleListDtail();
  }
};
</script>

<style lang="scss">
.schedule_wrap {
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
    width: 50px;
    height: 50px;
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
