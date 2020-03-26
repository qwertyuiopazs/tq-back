<template>
  <div class="analystContent_wrap">
    <div class="list_wrap">
      <el-card>
        <div slot="header" class="clearfix">
          <span><b>分析内容管理</b></span>
        </div>
        <el-button
          v-if="multipleSelection.length"
          @click="handleDeleteMultiple"
          :style="{ marginBottom: '15px' }"
          type="primary"
        >
          批量删除
        </el-button>
        <el-table
          :data="analysisContent"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column label="编号" width="50" prop="id" />
          <el-table-column label="标题" width="200" prop="title" />
          <el-table-column label="分析内容" prop="analysisContent" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                @click="handlePreview(scope.row)"
                size="mini"
                type="primary"
                >预览</el-button
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
            :page-size="analysisContentInfo.size"
            :current-page="analysisContentInfo.current"
            :total="analysisContentInfo.total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>

    <div class="list_wrap">
      <el-card>
        <div slot="header" class="clearfix">
          <span
            ><b>{{ isEdit ? "修改分析内容" : "新增分析内容" }}</b>
          </span>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
          <!-- title -->
          <el-form-item label="分析标题" :style="{ width: '300px' }">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <!-- content -->
          <el-form-item label="分析标题">
            <MainEditor
              v-model="form.analysisContent"
              url="/promote/tools/uploadImage"
              @input="editorInput"
              @on-upload-complete="onEditorUploadComplete"
            ></MainEditor>
          </el-form-item>

          <!-- 底部 -->
          <el-form-item>
            <div v-if="!isEdit">
              <el-button type="primary" @click="onSubmit">立即添加</el-button>
              <el-button @click="resetAllStatus">重置</el-button>
            </div>
            <div v-else>
              <el-button type="primary" @click="onSubmit">立即修改</el-button>
              <el-button @click="resetAllStatus">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div>
      <el-dialog
        :title="previewData.title"
        :visible.sync="dialogVisible"
        width="90%"
        :before-close="handleClose"
      >
        <div v-html="previewData.analysisContent"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import {
  addAnalysisContent,
  delAnalysisContent,
  updateAnalysisContent
} from "@/api/analyst";
import MainEditor from "./richText";

export default {
  name: "analyst",
  components: {
    MainEditor
  },
  data() {
    return {
      pageNum: 1, // 初始页码
      pageSize: 10,
      dialogVisible: false,
      multipleSelection: [],
      form: {
        analysisContent: "",
        title: ""
      },
      // 是否再编辑状态
      isEdit: false,
      previewData: {}
    };
  },
  computed: {
    ...mapState({
      analysisContentInfo: state => {
        const {
          analysisContentInfo = {
            current: this.pageNum,
            size: this.pageSize,
            total: 0
          }
        } = state.analyst;

        return analysisContentInfo;
      },
      analysisContent: state => {
        const { records = [] } = state.analyst.analysisContentInfo;
        return records;
      }
    })
  },

  methods: {
    ...mapActions({
      getAnalysisContentPage: "analyst/getAnalysisContentPage"
    }),
    resetAllStatus() {
      this.form = {
        analysisContent: "",
        title: ""
      };
      this.isEdit = false;
      window.tinymce.activeEditor.setContent("");
    },
    getScheduleListDtail() {
      const { pageNum, pageSize } = this;
      this.getAnalysisContentPage({
        pageNum,
        pageSize
      });
    },
    handleEdit(row) {
      const data = _.cloneDeep(row);
      this.form = data;
      this.isEdit = true;
      window.scrollTo(0, document.documentElement.clientHeight);
      window.tinymce.activeEditor.setContent(this.form.analysisContent);
    },

    // 预览
    handlePreview(row) {
      this.previewData = row;
      this.dialogVisible = true;
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
          delAnalysisContent(list)
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
      const { title, analysisContent } = this.form;

      if (!title) {
        this.$message({
          message: "标题未填写",
          type: "error"
        });
        return;
      }
      if (!analysisContent) {
        this.$message({
          message: "未填写任何内容！",
          type: "error"
        });
        return;
      }

      if (isEdit) {
        updateAnalysisContent(this.form)
          .then(() => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getScheduleListDtail();
            // 重置状态
            this.resetAllStatus();
          })
          .catch(error => {
            this.$message({
              message: error.msg,
              type: "error"
            });
          });
      } else {
        addAnalysisContent(this.form)
          .then(() => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getScheduleListDtail();
            // 重置状态
            this.resetAllStatus();
          })
          .catch(error => {
            //
          });
      }
    },

    // 分页
    pagenatiOnchange(index) {
      this.pageNum = index;
      this.getScheduleListDtail();
    },

    // 回调方法处理
    onEditorUploadComplete(res) {
      // console.log(res);
    },
    // 富文本内容
    editorInput(e) {
      this.form.analysisContent = e;
    }
  },
  mounted() {
    this.getScheduleListDtail();

    // 如果没有定时器 || 定时器时间低于500ms(视电脑硬件配置及代码量)，会出现报错
    // 因为还没init完成，写着这个里面
    setTimeout(() => {
      window.tinymce.activeEditor.setContent(this.form.analysisContent);
    }, 1000);
  }
};
</script>

<style lang="scss">
.analystContent_wrap {
  padding-bottom: 50px;

  .main_title {
    text-align: center;
  }

  .list_wrap {
    width: 95%;
    margin: 0 auto;
    margin-top: 50px;
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
}
</style>
