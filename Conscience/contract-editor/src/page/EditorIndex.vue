<template>
  <el-container>
    <el-aside v-show="leftAside" width="240px" :style="{backgroundColor : backgroundColor}">
      <div class="left-header" v-show="!showSettingsOnWindow">
        <el-tooltip class="item" effect="dark" :content="menuLang.topPlaceholder" placement="right">
          <el-button class="plus-file" type="primary" icon="el-icon-plus" circle @click="addFile"></el-button>
        </el-tooltip>
      </div>
      <el-menu
        :default-active="editorTab"
        class="el-menu-vertical-demo"
        :background-color="backgroundColor"
        text-color="#fff"
        active-text-color="#409EFF"
        :default-openeds="['1','2']"
        v-show="!showSettingsOnWindow"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{menuLang.contract}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="file in files" :index="file" :key="file" :name="file" @click="openFile">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="grid-content bg-purple">
                    {{ file }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <i class="el-icon-edit" :id="file" @click="editFileName"></i>
                    <i class="el-icon-delete" :id="file" @click="deleteFile"></i>
                  </div>
                </el-col>
              </el-row>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-more"></i>
            <span>{{menuLang.template}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="name in caseTemplate" :index="name" :key="name" :name="name" @click="openFile">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="grid-content bg-purple">
                    {{ name }}
                  </div>
                </el-col>
              </el-row>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <!--setting menu aside start-->
      <el-menu v-show="showSettingsOnWindow"
               default-active="1"
               class="el-menu-vertical-demo"
               :background-color="backgroundColor"
               text-color="#fff"
               active-text-color="#409EFF"
               :default-openeds="['1']"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{settingTitle}}</span>
          </template>
          <el-menu-item v-for="item in settingSelect" :index="item.name" :key="item.name" :name="item.name"
                        @click="openOption">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  {{ item.name }}
                </div>
              </el-col>
            </el-row>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!--setting menu aside end-->
      <el-footer id="btn-footer">
        <div class="btn-setting" style="height: 100%; text-align: center;">
          <el-button type="info" icon="el-icon-edit" round @click="showCode">code</el-button>
          <el-button type="info" icon="el-icon-setting" round @click="showSettings">settings</el-button>
        </div>
      </el-footer>
    </el-aside>
    <el-main v-show="!showSettingsOnWindow">
      <el-container>
        <el-header>
          <el-tabs v-model="editorTab" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
            <el-tab-pane v-for="file in fileTabs" :label="file" :key="file" :name="file">
            </el-tab-pane>
          </el-tabs>
        </el-header>
        <el-main>
          <code-editor ref="codeEditor"></code-editor>
        </el-main>
        <el-footer :height="footerH">
          <el-container>
            <el-header class="logger-header" height="40px">
              <div style="float: left">
                <i class="el-icon-download" v-show="showLoggers" @click="showLoggers = false, footerH='40px'"></i>
                <i class="el-icon-upload2" v-show="!showLoggers" @click="showLoggers = true, footerH='40%'"></i>
              </div>
              <el-button v-show="showLoggers" type="primary"
                         icon="el-icon-delete" @click="compileLoggers = []"
                         style="float: right"
              ></el-button>
            </el-header>
            <el-main class="logger-main" v-show="showLoggers">
              <el-alert v-for="(logger, index) in compileLoggers"
                        :title="logger.message"
                        :type="logger.severity"
                        :description="logger.formattedMessage"
                        :key="index"
                        show-icon
              >
              </el-alert>
            </el-main>
          </el-container>
        </el-footer>
      </el-container>
    </el-main>

    <!--setting menu main start-->
    <el-main v-show="settingSelect[0].show">
      <el-form ref="settingForm" :model="settingSelect[0].data" label-width="80px">
        <el-form-item :label="settingSelect[0].data.lang.label">
          <el-select v-model="langMode">
            <el-option v-for="item in settingSelect[0].data.lang.list" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="settingSelect[0].data.theme.label">
          <el-select v-model="themeMode">
            <el-option v-for="item in settingSelect[0].data.theme.list" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
    <el-main v-show="settingSelect[1].show">
      <el-form ref="aboutForm" :model="settingSelect[1].data" label-width="80px">
        <el-form-item>
          {{ settingSelect[1].data.content }}
        </el-form-item>
      </el-form>
    </el-main>
    <!--setting menu main end-->

    <el-aside v-show="!showSettingsOnWindow" class="right" width="500px" :style="{backgroundColor : backgroundColor}">
      <contract-action v-show="rightAside" :menuLang="menuLang" :files="compileNames" :backgroundColor="backgroundColor"
                       v-on:compileResult="compileResult"></contract-action>
    </el-aside>
  </el-container>
</template>

<script>

  import CodeEditor from '../components/CodeEditor'
  import ContractAction from '../components/ContractActions'
  import {caseTemplate} from "../assets/template/case.eg";
  import {defaultCode} from "../assets/template/case.eg";
  import {settingLang, menuLang, defaultSettingSelect} from "../assets/template/settings";

  const suffix = '.js'

  export default {
    name: 'EditorIndex',
    data() {
      return {
        leftAside: true,
        rightAside: true,
        showLoggers: true,
        footerH: '40%',
        files: [],
        fileTabs: [],
        editorTab: '',
        compileLoggers: [],
        caseTemplate: caseTemplate(),
        compileNames: [],
        showSettingsOnWindow: false,
        langMode: '简体中文',
        themeMode: 'Dark',
        settingSelect: settingLang(),
        settingTitle: '通用',
        menuLang: menuLang(),
        backgroundColor: '#333333'
      }
    },
    components: {
      codeEditor: CodeEditor,
      contractAction: ContractAction
    },
    watch: {
      files: {
        handler: function (newValue) {
          localStorage.setItem('files', JSON.stringify(newValue));
        },
        deep: true
      },
      langMode: {
        handler: function (newValue) {
          this.settingSelect = settingLang(newValue)
          this.openOption({index: newValue == '简体中文' ? '设置' : 'Settings'})
          this.settingTitle = newValue == '简体中文' ? '通用' : 'Commons'
          this.menuLang = menuLang(newValue)
        }
      },
      themeMode: {
        handler: function (color) {
          if (color == 'Dark') {
            this.backgroundColor = '#333333'
            return
          }
          if (color == 'Blue') {
            this.backgroundColor = 'darkcyan'
          }
        }
      }
    },
    mounted() {
      let fileStr = localStorage.getItem('files');
      this.files = JSON.parse(fileStr);
      if (this.files == null || this.files.length === 0) {
        this.files = ['contract' + suffix];
      }
      let defaultFile = this.files[0];
      localStorage.setItem(this.files[0], defaultCode())
      this.editorFileChange(defaultFile);
      const _this = this;
      window.onresize = function () {
        let width = document.body.clientWidth;
        _this.leftAside = width > 800;
        _this.rightAside = width > 600;
      }
      this.compileNames = this.files.concat(this.caseTemplate)
    },
    methods: {
      compileResult: function (file, result) {
        const errors = result.errors;
        if (errors !== undefined) {
          for (let i = 0; i < errors.length; i++) {
            this.compileLoggers.push(errors[i]);
          }
        } else {
          this.compileLoggers.push({
            message: file,
            severity: 'success'
          })
        }
      },
      addFile() {
        this.$prompt(`请输入文件名（默认为${suffix}文件)`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: '',
          inputErrorMessage: '请输入正确的文件名！'
        }).then(({value}) => {
          let newFile = value + suffix;
          for (let index in this.files) {
            if (this.files[index] === newFile) {
              this.$message({
                type: 'info',
                message: newFile + '已存在！'
              });
              return;
            }
          }
          this.files.push(newFile);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      editFileName(index) {
        let fileName = index.target.id;
        this.$prompt(`请输入文件名（默认为${suffix}文件)`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: fileName.split(".")[0],
          inputPattern: '',
          inputErrorMessage: '请输入正确的文件名！'
        }).then(({value}) => {
          let newFile = value + suffix;
          for (let index in this.files) {
            if (this.files[index] === newFile) {
              this.$message({
                type: 'info',
                message: newFile + '已存在！'
              });
              return;
            }
          }
          this.$set(this.files, this.files.indexOf(fileName), newFile);
          this.$set(this.fileTabs, this.fileTabs.indexOf(fileName), newFile);
          this.editorTab = newFile;
          localStorage.setItem(newFile, localStorage.getItem(fileName));
          localStorage.removeItem(fileName);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      },
      deleteFile(index) {
        let fileName = index.target.id;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeValue(this.files, fileName);
          localStorage.removeItem(fileName);
          this.removeTab(fileName);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openFile(index) {
        this.editorFileChange(index.index)
      },
      tabClick(tab) {
        this.editorFileChange(tab.name)
      },
      removeTab(targetName) {
        let tabs = this.fileTabs;
        let activeName = this.editorTab;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab;
              }
            }
          });
        }
        this.editorTab = activeName;
        this.fileTabs = tabs.filter(tab => tab !== targetName);
        this.editorFileChange(activeName);
      },
      editorFileChange(fileName) {
        if (this.fileTabs.indexOf(fileName) < 0) {
          this.fileTabs.push(fileName);
        }
        this.editorTab = fileName;
        let code = localStorage.getItem(fileName);
        this.$refs.codeEditor.changeEditor(fileName, code == null ? '' : code);
        const splits = fileName.split(".");
        this.$refs.codeEditor.changeLang(splits[splits.length - 1]);
      },
      removeValue(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === value) {
            arr.splice(i, 1);
            break;
          }
        }
      },
      showCode() {
        this.openOption({index: 'index'})
        this.showSettingsOnWindow = false
      },
      showSettings() {
        this.showSettingsOnWindow = true
        this.openOption({index: this.langMode == '简体中文' ? '设置' : 'Settings'})
      },
      openOption(index) {
        for (let i = 0; i < this.settingSelect.length; i++) {
          this.settingSelect[i].show = false
          if (this.settingSelect[i].name === index.index) {
            this.settingSelect[i].show = true
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../styles/variable.less";

  .el-container, .el-aside, .el-main {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .el-aside {
    background-color: @base-color;
  }

  .el-menu {
    border-right-width: 0;
  }

  .el-main {
    background-color: #162a3c;
  }

  .el-footer {
    padding: 0;
  }

  .logger-header {
    background-color: #3c3c3c;
    color: white;
    line-height: 40px;
  }

  .logger-main {
    padding: 10px;
    overflow: auto;
  }

  .el-alert {
    margin: 0 0 10px 0;
  }

  .el-tabs {
    margin-top: 19px;
  }

  .left-header {
    height: 40px;
    width: 40px;
    margin: 10px auto;
  }

  .compile-form {
    text-align: center;
    margin-top: 120px;
  }

  /*控制整个滚动条*/
  ::-webkit-scrollbar {
    background-color: #333333;
    width: 10px;
    height: 10px;
    background-clip: padding-box;
  }

  /*滚动条中间滑动部分*/
  ::-webkit-scrollbar-thumb {
    background-color: #1e1e1e;
    border-radius: 5px;
  }

  /*.el-button--info {*/
  /*background-color: #454545;*/
  /*border-color: #4e5052;*/
  /*margin-top: 10px;*/
  /*}*/

  #btn-footer {
    width: 240px;
    position: fixed;
    bottom: 0;
  }

  .el-menu-vertical-demo {
    width: 100%;
  }

</style>

<style>

  .el-dropdown {
    color: white;
  }

  .el-menu-item-group__title {
    display: none;
  }

  .el-tabs__item {
    color: white;
  }
</style>
