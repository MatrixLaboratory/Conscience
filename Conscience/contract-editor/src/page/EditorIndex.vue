<template>
  <el-container>
    <el-main>
      <el-container>
        <el-aside v-show="leftAside" width="300px" :style="{backgroundColor : backgroundColor}">
          <el-container>
            <el-aside width="50px" style="background-color: #414141">
              <el-menu
                class="el-menu-vertical-demo"
                text-color="white"
                active-text-color="#409EFF"
                style="background-color: #414141;"
              >
                <el-menu-item index="1" class="icon-hover" @click="addFile">
                  <i class="el-icon-circle-plus"></i>
                </el-menu-item>
                <el-menu-item index="2" class="icon-hover" @click="showSettings">
                  <i class="el-icon-setting"></i>
                </el-menu-item>
                <el-menu-item index="3" class="icon-hover" @click="about">
                  <i class="el-icon-info"></i>
                </el-menu-item>
              </el-menu>
            </el-aside>
            <el-main :style="{backgroundColor : backgroundColor}">
              <el-menu
                :default-active="editorTab"
                class="el-menu-vertical-demo"
                :background-color="backgroundColor"
                text-color="#fff"
                active-text-color="#409EFF"
                :default-openeds="['1','2','3']"
                v-show="!showSettingsOnWindow"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span :style="{fontSize : fontSize}">{{menuLang.contract}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                      v-for="file in files"
                      :style="{fontSize : fontSize}"
                      :index="file"
                      :key="file"
                      :name="file"
                      @click="openFile"
                    >
                      <el-row :gutter="20">
                        <el-col :span="18">
                          <div class="grid-content bg-purple file-name-style">{{ file }}</div>
                        </el-col>
                        <el-col :span="4">
                          <el-dropdown @command="handleCommand" trigger="click">
                            <span class="el-icon-more">
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item icon="el-icon-download"
                                                :command="file + '-download'">{{menuLang.fileFunc.download}}
                              </el-dropdown-item>
                              <el-dropdown-item icon="el-icon-edit"
                                                :command="file + '-edit'">{{menuLang.fileFunc.edit}}
                              </el-dropdown-item>
                              <el-dropdown-item icon="el-icon-delete"
                                                :command="file + '-delete'">{{menuLang.fileFunc.delete}}
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-orange"></i>
                    <span :style="{fontSize : fontSize}">{{menuLang.abi}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-for="file in compileABI"
                                  :style="{fontSize : fontSize}"
                                  :index="file"
                                  :key="file"
                                  :name="file"
                                  @click="openFile"
                    >
                      <el-row :gutter="20">
                        <el-col :span="16">
                          <div class="grid-content bg-purple file-name-style">{{ file }}</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="grid-content bg-purple">
                            <i class="el-icon-download" :id="file" @click="downloadFile"></i>
                          </div>
                        </el-col>
                      </el-row>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-s-flag"></i>
                    <span :style="{fontSize : fontSize}">{{menuLang.template}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item
                      v-for="name in caseTemplate"
                      :style="{fontSize : fontSize}"
                      :index="name"
                      :key="name"
                      :name="name"
                      @click="openFile"
                    >
                      <el-row :gutter="20">
                        <el-col :span="16">
                          <div class="grid-content bg-purple">{{ name }}</div>
                        </el-col>
                      </el-row>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
              <!--setting menu aside start-->
              <el-menu
                v-show="showSettingsOnWindow"
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
                    <span :style="{fontSize : fontSize}">{{settingTitle}}</span>
                  </template>
                  <el-menu-item
                    v-for="item in settingSelect"
                    :index="item.name"
                    :key="item.name"
                    :name="item.name"
                    @click="openOption"
                    :style="{fontSize : fontSize}"
                  >
                    <el-row :gutter="20">
                      <el-col :span="16">
                        <div class="grid-content bg-purple">{{ item.name }}</div>
                      </el-col>
                    </el-row>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
              <!--setting menu aside end-->
            </el-main>
          </el-container>
        </el-aside>
        <el-main v-show="!showSettingsOnWindow">
          <el-container>
            <el-header style="background-color: #414141; height: 40px">
              <el-tabs
                v-model="editorTab"
                type="border-card"
                closable
                @tab-remove="removeTab"
                @tab-click="tabClick"
                class="tab-class"
              >
                <el-tab-pane v-for="file in fileTabs" :label="file" :key="file" :name="file"></el-tab-pane>
              </el-tabs>
            </el-header>
            <el-main>
              <code-editor ref="codeEditor" :codeFontSize="fontSize" :theme="codeThemeMode"></code-editor>
            </el-main>
          </el-container>
        </el-main>

        <!--setting menu main start-->
        <el-main v-show="settingSelect[0].show">
          <el-form id="setting" ref="settingForm" :model="settingSelect[0].data" label-width="100px"
                   label-position="left">
            <el-form-item :label="settingSelect[0].data.lang.label">
              <el-select v-model="langMode">
                <el-option
                  v-for="item in settingSelect[0].data.lang.list"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="settingSelect[0].data.theme.label">
              <el-select v-model="themeMode">
                <el-option
                  v-for="item in settingSelect[0].data.theme.list"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="settingSelect[0].data.fontSize.label">
              <el-select v-model="fontSize">
                <el-option
                  v-for="(val, key) in settingSelect[0].data.fontSize.map"
                  :key="key"
                  :label="key"
                  :value="val"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="settingSelect[0].data.codeTheme.label">
              <el-select v-model="codeThemeMode">
                <el-option
                  v-for="item in settingSelect[0].data.codeTheme.list"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button style="margin-left: 140px" type="info" icon="el-icon-back" round @click="showCode">return</el-button>
          </el-form>
        </el-main>
        <!--setting menu main end-->

        <el-aside
          v-show="!showSettingsOnWindow"
          class="right"
          width="400px"
          :style="{backgroundColor : backgroundColor, overflow: 'hidden'}"
        >
          <contract-action
            v-show="rightAside"
            :menuLang="menuLang"
            :files="compileNames"
            :backgroundColor="backgroundColor"
            :fontSize="fontSize"
            :abiList="compileABI"
            v-on:compileResult="compileResult"
          ></contract-action>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer :height="footerH">
      <el-container>
        <el-header class="logger-header" height="40px">
          <div style="float: left">
            <i
              class="el-icon-download"
              v-show="showLoggers"
              @click="showLoggers = false, footerH='40px'"
            ></i>
            <i
              class="el-icon-upload2"
              v-show="!showLoggers"
              @click="showLoggers = true, footerH='40%'"
            ></i>
          </div>
          <el-button
            v-show="showLoggers"
            type="primary"
            icon="el-icon-delete"
            @click="compileLoggers = []"
            style="float: right"
          ></el-button>
        </el-header>
        <el-main class="logger-main" v-show="showLoggers" style="background-color: #1e1e1e">
          <el-card class="box-card"
                   v-for="(logger, index) in compileLoggers" :key="index"
                   style="background-color: #414141; border: #414141"
          >
            <div slot="header"
                 :class="{'clearfix':true, 'success':(logger.style == 'success'), 'error':(logger.style == 'error')}">
              {{logger.title}}
            </div>
            <div class="text item" style="color: white;">
              <h4>{{logger.subtitle}}</h4>
              <xmp><code>{{logger.description}}</code></xmp>
            </div>
          </el-card>
          <!--<el-card class="box-card"-->
                   <!---->
          <!--&gt;-->
            <!---->
          <!--</el-card>-->

        </el-main>
      </el-container>
    </el-footer>
  </el-container>
</template>

<script>
  import CodeEditor from "../components/CodeEditor";
  import ContractAction from "../components/ContractActions";
  import {caseTemplate} from "../assets/template/case.eg";
  import {defaultCode} from "../assets/template/case.eg";
  import {
    settingLang,
    menuLang
  } from "../assets/template/settings";

  const suffix = ".js";

  export default {
    name: "EditorIndex",
    data() {
      return {
        leftAside: true,
        rightAside: true,
        showLoggers: true,
        footerH: "30%",
        files: [],
        fileTabs: [],
        editorTab: "",
        compileLoggers: [],
        caseTemplate: caseTemplate(),
        compileNames: [],
        showSettingsOnWindow: false,
        langMode: "简体中文",
        themeMode: "Dark",
        codeThemeMode: "vs-dark",
        settingSelect: settingLang(),
        settingTitle: "通用",
        menuLang: menuLang(),
        backgroundColor: "#333333",
        fontSizeName: "Base",
        fontSize: "14px",
        compileABI: []
      };
    },
    components: {
      codeEditor: CodeEditor,
      contractAction: ContractAction
    },
    watch: {
      files: {
        handler: function (newValue) {
          localStorage.setItem("files", JSON.stringify(newValue));
          this.compileNames = this.files.concat(this.caseTemplate);
        },
        deep: true
      },
      langMode: {
        handler: function (newValue) {
          this.settingSelect = settingLang(newValue);
          this.openOption({
            index: newValue == "简体中文" ? "设置" : "Settings"
          });
          this.settingTitle = newValue == "简体中文" ? "通用" : "Commons";
          this.menuLang = menuLang(newValue);
        }
      },
      themeMode: {
        handler: function (color) {
          if (color == "Dark") {
            this.backgroundColor = "#333333";
            return;
          }
          if (color == "Blue") {
            this.backgroundColor = "darkcyan";
          }
        }
      },
      fontSizeName: {
        handler: function (name) {
          this.fontSize = this.settingSelect[0].data.fontSize.map[name];
        }
      }
    },
    mounted() {
      let fileStr = localStorage.getItem("files");
      this.files = JSON.parse(fileStr);
      if (this.files == null || this.files.length === 0) {
        this.files = ["contract" + suffix];
      }
      let defaultFile = this.files[0];
      localStorage.setItem(this.files[0], defaultCode());
      this.editorFileChange(defaultFile);
      const _this = this;
      window.onresize = function () {
        let width = document.body.clientWidth;
        _this.leftAside = width > 800;
        _this.rightAside = width > 600;
      };
      this.compileNames = this.files.concat(this.caseTemplate);
      localStorage.setItem('showRunArea', 'false')
    },
    methods: {
      compileResult: function (file, result) {
        if (result.errors !== undefined) {
          console.log("errors:", result.errors);
          for (let i = 0; i < result.errors.length; i++) {
            let error = result.errors[i];
            if (error.response !== undefined) {
              const errorMessage = `${JSON.stringify(error.response, null, 4)}`;
              console.error(errorMessage);
              this.compileLoggers.push({
                title: `[${file}]: Compiling failed!`,
                subtitle: 'Error Message:',
                description: errorMessage,
                style: "error"
              });
            }
          }
        } else {
          const formattedAbi = `${JSON.stringify(result.abi, null, 4)}`;
          this.compileLoggers.push({
            title: `[${file}]: Compiling succeeded!`,
            subtitle: 'ABI:',
            description: formattedAbi,
            style: "success"
          });
          let filename = file + '.abi'
          localStorage.setItem(filename, formattedAbi)
          for (let index in this.compileABI) {
            if (this.compileABI[index] == filename) {
              return
            }
          }
          this.compileABI.push(filename)
        }
      },
      addFile() {
        this.$prompt(`请输入文件名（默认为${suffix}文件)`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: "",
          inputErrorMessage: "请输入正确的文件名！"
        })
          .then(({value}) => {
            let newFile = value + suffix;
            for (let index in this.files) {
              if (this.files[index] === newFile) {
                this.$message({
                  type: "info",
                  message: newFile + "已存在！"
                });
                return;
              }
            }
            this.files.push(newFile);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      },
      editFileName(index) {
        let fileName = index.target.id;
        this.$prompt(`请输入文件名（默认为${suffix}文件)`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: fileName.split(".")[0],
          inputPattern: "",
          inputErrorMessage: "请输入正确的文件名！"
        })
          .then(({value}) => {
            let newFile = value + suffix;
            for (let index in this.files) {
              if (this.files[index] === newFile) {
                this.$message({
                  type: "info",
                  message: newFile + "已存在！"
                });
                return;
              }
            }
            this.$set(this.files, this.files.indexOf(fileName), newFile);
            this.$set(this.fileTabs, this.fileTabs.indexOf(fileName), newFile);
            this.editorTab = newFile;
            localStorage.setItem(newFile, localStorage.getItem(fileName));
            localStorage.removeItem(fileName);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消修改"
            });
          });
      },
      deleteFile(index) {
        let fileName = index.target.id;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.removeValue(this.files, fileName);
            localStorage.removeItem(fileName);
            this.removeTab(fileName);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      downloadFile(index) {
        let fileName = index.target.id
        let code = localStorage.getItem(fileName)
        let a = document.createElement('a')
        let blob = new Blob([code])
        a.download = fileName
        a.href = URL.createObjectURL(blob)
        a.click()
        URL.revokeObjectURL(blob)
      },
      openFile(index) {
        this.editorFileChange(index.index);
      },
      tabClick(tab) {
        this.editorFileChange(tab.name);
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
        this.$refs.codeEditor.changeEditor(fileName, code == null ? "" : code);
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
        this.openOption({index: "index"});
        this.showSettingsOnWindow = false;
      },
      showSettings() {
        this.showSettingsOnWindow = true;
        this.openOption({
          index: this.langMode == "简体中文" ? "设置" : "Settings"
        });
      },
      openOption(index) {
        for (let i = 0; i < this.settingSelect.length; i++) {
          this.settingSelect[i].show = false;
          if (this.settingSelect[i].name === index.index) {
            this.settingSelect[i].show = true;
          }
        }
      },
      handleCommand(command) {
        let list = command.split('-')
        let filename = list[0]
        let func = list[1]
        if (func == 'download') {
          this.downloadFile({target: {id: filename}})
          return
        }
        if (func == 'edit') {
          this.editFileName({target: {id: filename}})
          return
        }
        if (func == 'delete') {
          this.deleteFile({target: {id: filename}})
        }
      },
      about() {
        window.location.href = 'http://matrixdapp.com'
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../styles/variable.less";

  .el-container,
  .el-aside,
  .el-main {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .icon-hover {
    padding-left: 13px !important;
  }

  .icon-hover:hover {
    background-color: #333333;
  }

  .icon-hover:focus {
    background-color: #333333;
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
    padding-left: 20px;
  }

  .logger-main {
    padding: 10px;
    overflow: auto;
  }

  .el-alert {
    margin: 0 0 10px 0;
  }

  .el-tabs {
    margin-top: 1px;
  }

  .left-header {
    text-align: center;
    background-color: #333333;
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

  #btn-footer {
    width: 240px;
    position: fixed;
    bottom: 0;
  }

  .el-menu-vertical-demo {
    width: 100%;
  }

  #setting {
    margin-top: 23px;
    margin-left: 37px;
  }

  #about {
    margin-top: 29px;
    margin-left: 37px;
  }

  .file-name-style {
    max-width: 103px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-click-class {
    background-color: #333333;
  }

  .tab-class {
    background-color: #414141;
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

<style>

  .success {
    color: #67c23a;
  }

  .error {
    color: #f56c6c;
  }

  .el-card__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 5px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    margin-bottom: 10px;
  }

  xmp {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .el-header {
    padding: 0;
  }

  .el-tabs__nav-scroll {
    background: #414141;
  }

  .el-tabs--border-card {
    border: 0;
  }

  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    background-color: #333333;
    border: 0;
  }

</style>
