<template>
  <div class="schedule_wrap">
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
        <el-button
          v-if="multipleSelection.length"
          @click="handleFreeze(0, multipleSelection)"
          :style="{ marginBottom: '15px' }"
          type="primary"
        >
          批量冻结
        </el-button>
        <el-button
          v-if="multipleSelection.length"
          @click="handleFreeze(1, multipleSelection)"
          :style="{ marginBottom: '15px' }"
          type="primary"
        >
          批量解冻
        </el-button>
        <el-table
          :data="userList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="编号" width="50" prop="id" />
          <el-table-column label="账号" width="100" prop="accountNumber" />
          <!-- <el-table-column label="密码" width="100" prop="password" /> -->
          <el-table-column label="用户名称" width="100" prop="username" />
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <img class="table_img" :src="scope.row.avatarPath" alt="" />
            </template>
          </el-table-column>
          <el-table-column label="角色类型" width="100">
            <template slot-scope="scope">
              <span>{{
                scope.row.roleType === 2 ? "管理员" : "一般用户"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色状态" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.status === 0 ? "冻结" : "正常" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="个人说明" width="150" prop="description" />
          <el-table-column label="创建时间" width="100" prop="createDateTime" />
          <el-table-column label="更新时间" width="100" prop="updateDateTime" />

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                @click="handleSwitchFreeze(scope.row.id, scope.row.status)"
                :type="buttonStatusType(scope.row.status)"
                >{{ buttonStatus(scope.row.status) }}</el-button
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
            :page-size="userListInfo.size"
            :current-page="userListInfo.current"
            :total="userListInfo.total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <div class="dialog_wrap">
        <div class="upload_wrap">
          <p class="label_wrap">头像：</p>
          <el-upload
            class="avatar-uploader"
            action="/promote/tools/uploadImage"
            :show-file-list="false"
            :on-success="handleQrSuccess"
            :before-upload="beforeQrUpload"
          >
            <img v-if="form.avatarPath" :src="form.avatarPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="账号" :style="{ width: '300px' }">
            <el-input v-model="form.accountNumber"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            type="password"
            :style="{ width: '300px' }"
          >
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item
            label="用户名称"
            type="password"
            :style="{ width: '300px' }"
          >
            <el-input v-model="form.username"></el-input>
          </el-form-item>

          <el-form-item label="角色类型" :style="{ width: '300px' }">
            <el-select v-model="form.roleType" placeholder="请选择角色类型">
              <el-option label="一般用户" :value="1"></el-option>
              <el-option label="管理员" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="角色状态" :style="{ width: '300px' }">
            <el-select v-model="form.status" placeholder="请选择角色状态">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="冻结" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="个人说明">
            <el-input type="textarea" v-model="form.description"></el-input>
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
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import {
  backstageCreateUser,
  deleteUser,
  updateUserInfo,
  updateStatus
} from "@/api/user";

export default {
  name: "analyst",

  data() {
    return {
      pageNum: 1, // 初始页码
      pageSize: 10,
      dialogVisible: false,
      multipleSelection: [],

      form: {
        accountNumber: "",
        avatarPath: "",
        password: "",
        username: "",
        // createDateTime: '', // 创建时间
        // updateDateTime: '', // 更新时间
        description: "",
        status: ""
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
      userListInfo: state => {
        const {
          userList = {
            current: this.pageNum,
            size: this.pageSize,
            total: 0
          }
        } = state.user;
        return userList;
      },
      userList: state => {
        const { records = [] } = state.user.userList;
        return records;
      }
    })
  },
  filters: {},

  methods: {
    ...mapActions({
      getUserInfoList: "user/getUserInfoList"
    }),
    resetAllStatus() {
      this.form = {
        accountNumber: "",
        avatarPath: "",
        password: "",
        username: "",
        description: "",
        status: ""
      };
      this.isEdit = false;
    },
    getScheduleListDtail() {
      const { pageNum, pageSize } = this;
      this.getUserInfoList({
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
          deleteUser(list)
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

    buttonStatus(val) {
      let res = "";
      if (val === 0) {
        res = "冻结";
      } else {
        res = "正常";
      }
      return res;
    },
    buttonStatusType(val) {
      let res = "";
      if (val === 0) {
        res = "danger";
      } else {
        res = "primary";
      }
      return res;
    },

    // 操作冻结
    handleSwitchFreeze(id, status) {
      const param = status === 0 ? 1 : 0;
      const title = "确认" + (param === 0 ? "冻结" : "恢复正常") + "？";
      this.$confirm(title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.handleFreeze(param, [id]);
        })
        .catch(() => {});
    },

    // 处理冻结
    handleFreeze(status = 0, idList) {
      const param = {
        idList,
        status
      };
      updateStatus(param)
        .then(data => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getScheduleListDtail();
          this.multipleSelection = [];
        })
        .catch(err => {
          this.$message({
            message: err.msg ? err.msg : err.message ? err.message : "操作失败",
            type: "error"
          });
        });
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
        accountNumber,
        avatarPath,
        password,
        username,
        description,
        status
      } = this.form;

      if (!avatarPath) {
        this.$message({
          message: "请上传头像",
          type: "error"
        });
        return;
      }
      if (!accountNumber) {
        this.$message({
          message: "请填写账号",
          type: "error"
        });
        return;
      }
      if (!password) {
        this.$message({
          message: "请填写密码",
          type: "error"
        });
        return;
      }
      if (!username) {
        this.$message({
          message: "请填写用户名",
          type: "error"
        });
        return;
      }
      if (!description) {
        this.$message({
          message: "请填写个人说明",
          type: "error"
        });
        return;
      }
      if (!status && status !== 0) {
        this.$message({
          message: "请选择账号状态",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateUserInfo(this.form)
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
        backstageCreateUser(this.form)
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
      this.form.avatarPath = res.msg ? res.msg : "";
      this.$message({ type: "success", message: "二维码上传成功" });
    },
    beforeQrUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("二维码图片大小不能超过 1MB!");
      }
      return isLt1M;
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
