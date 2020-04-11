<template>
  <div class="contact_wrap">
    <h1>联系方式配置</h1>

    <div class="list_wrap">
      <div class="btn_wrap">
        <el-button type="primary" @click="dialogVisible = true">
          添加联系方式
        </el-button>
      </div>

      <el-card>
        <el-table :data="contactList" style="width: 100%">
          <el-table-column
            label="联系方式名称"
            prop="accountType"
            width="180"
          />
          <el-table-column label="联系方式" prop="contactContent" width="180" />
          <el-table-column label="排序" prop="sort" width="180">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog
      :title="isEdit ? '编辑联系方式' : '添加联系方式'"
      :visible.sync="dialogVisible"
      @close="onClose"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="联系方式名称">
          <el-input v-model="form.accountType"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contactContent"></el-input>
        </el-form-item>
        <el-form-item label="联系方式排序">
          <el-input type="number" v-model="form.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!isEdit" type="primary" @click="onSubmit"
          >立即添加</el-button
        >
        <el-button v-else type="primary" @click="onSubmit">立即修改</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import {
  addContactInformation,
  delContactInformation,
  updateContactInformation
} from "@/api/configuration";

export default {
  name: "Contact",
  data() {
    return {
      form: {
        accountType: "",
        contactContent: "",
        sort: ""
      },
      isEdit: false,
      dialogVisible: false
    };
  },
  computed: {
    ...mapState({
      contactList: state => state.configuration.contactInformation
    })
  },
  methods: {
    ...mapActions({
      getContactInformationList: "configuration/getContactInformationList"
    }),
    resetAllStatus() {
      this.form = {
        accountType: "",
        contactContent: "",
        sort: ""
      };
      this.isEdit = false;
    },
    // 关闭
    onClose() {
      this.resetAllStatus();
    },
    // 编辑
    handleEdit(item) {
      this.form = _.cloneDeep(item);
      this.dialogVisible = true;
      this.isEdit = true;
    },
    onSubmit(row) {
      const { isEdit = false } = this;
      // 提交
      const { accountType, contactContent, sort } = this.form;

      if (!accountType) {
        this.$message({
          message: "请填写联系方式名称",
          type: "error"
        });
        return;
      }
      if (!contactContent) {
        this.$message({
          message: "请填写联系方式",
          type: "error"
        });
        return;
      }
      if (!sort) {
        this.$message({
          message: "请填写排序",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateContactInformation(this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getContactInformationList();
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
        addContactInformation(this.form)
          .then(() => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getContactInformationList();
            // 重置状态
            this.dialogVisible = false;
          })
          .catch(error => {
            //
          });
      }
    },
    handleDelete(row) {
      const id = row.id ? row.id : "";
      const arr = [id];

      this.$confirm("此操作将永久删除该联系方式, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delContactInformation(arr).then(res => {
            console.log(res);
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getContactInformationList();
            } else {
              this.$message({
                type: "info",
                message: res.msg
              });
            }
          });
        })

        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.getContactInformationList();
  }
};
</script>

<style lang="scss" scoped>
.contact_wrap {
  text-align: center;
  .btn_wrap {
    text-align: left;
    padding: 10px 0;
  }

  .list_wrap {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
