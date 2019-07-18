<template>
  <el-container style="height: 100%">
    <el-aside width="50px" style="background-color: #414141">
      <el-menu
        class="el-menu-vertical-demo"
        text-color="white"
        active-text-color="#409EFF"
        style="background-color: #414141;"
      >
        <el-tooltip class="item" effect="light" :content="menuLang.addFiles" placement="right">
          <el-menu-item index="1" class="icon-hover" @click="addFile">
            <i class="el-icon-circle-plus"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="menuLang.files" placement="right">
          <el-menu-item index="2" class="icon-hover" @click="showCode">
            <i class="el-icon-document"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="menuLang.setting" placement="right">
          <el-menu-item index="3" class="icon-hover" @click="showSettings">
            <i class="el-icon-setting"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="menuLang.resource.name" placement="right">
          <el-menu-item index="4" class="icon-hover" @click="showResource">
            <i class="el-icon-coin"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="menuLang.about.name" placement="right">
          <el-menu-item index="5" class="icon-hover" @click="showAbout">
            <i class="el-icon-house"></i>
          </el-menu-item>
        </el-tooltip>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="height: 40px; background-color: #2d303a">
        <div style="height: 40px; position: relative">
          <img class="header-logo-style" src="../../static/img/logo.png">
          <!--<md-button class="login-btn">login</md-button>-->
          <!--<md-button class="sign-up-btn">sign up</md-button>-->
        </div>
      </el-header>
      <el-main v-show="showRight">
        <el-container style="height: 100%">
          <rs-panes style="position: relative" :size="300" :min-size="240" split-to="columns" :allow-resize="true"
                    :resizerThickness=0 :style="{backgroundColor : backgroundColor}">
            <el-main slot="firstPane" :style="{backgroundColor : backgroundColor}">
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
            <rs-panes v-show="!showSettingsOnWindow" :size="380" :min-size="380" :allow-resize="true" split-to="columns" slot="secondPane"
                      primary="second"
                      :resizerThickness=0>
              <el-main slot="firstPane">
                <el-container style="height: 100%">
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
                            @click="showLoggers = true, footerH='30%'"
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
                      <el-main id="logger" class="logger-main" v-show="showLoggers" style="background-color: #1e1e1e">
                        <el-card class="box-card"
                                 v-for="(logger, index) in compileLoggers" :key="index"
                                 style="background-color: #414141; border: #414141"
                        >
                          <div slot="header"
                               :class="{'clearfix':true, 'success':(logger.style == 'success'), 'error':(logger.style == 'error'), 'normal':(logger.style == 'normal')}">
                            {{logger.title}}
                          </div>
                          <div class="text item" style="color: white;">
                            <h4>{{logger.subtitle}}</h4>
                            <xmp><code>{{logger.description}}</code></xmp>
                          </div>
                        </el-card>
                      </el-main>
                    </el-container>
                  </el-footer>
                </el-container>
              </el-main>
              <el-main slot="secondPane" :style="{backgroundColor : backgroundColor, overflowX: 'hidden'}">
                <contract-action
                  :menuLang="menuLang"
                  :files="compileNames"
                  :backgroundColor="backgroundColor"
                  :fontSize="fontSize"
                  :abiList="compileABI"
                  :langMode="langMode"
                  @compileResult="compileResult"
                  @deployResult="deployResult"
                  @runResult="runResult"
                ></contract-action>
              </el-main>
            </rs-panes>
            <!--setting menu main start-->
            <el-main slot="secondPane" class="setting-window" v-show="settingSelect.setting.show">
              <el-row :gutter="20" class="setting-about-card-row">
                <el-form id="setting" ref="settingForm" :model="settingSelect.setting.data" label-width="100px"
                         label-position="left">
                  <el-form-item :label="settingSelect.setting.data.lang.label">
                    <el-select v-model="saveSetting.langMode">
                      <el-option
                        v-for="item in settingSelect.setting.data.lang.list"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="settingSelect.setting.data.theme.label">
                    <el-select v-model="saveSetting.themeMode">
                      <el-option
                        v-for="item in settingSelect.setting.data.theme.list"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="settingSelect.setting.data.fontSize.label">
                    <el-select v-model="saveSetting.fontSize">
                      <el-option
                        v-for="(val, key) in settingSelect.setting.data.fontSize.map"
                        :key="key"
                        :label="key"
                        :value="val"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="settingSelect.setting.data.codeTheme.label">
                    <el-select v-model="saveSetting.codeThemeMode">
                      <el-option
                        v-for="item in settingSelect.setting.data.codeTheme.list"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-row style="padding: 10px 20px 0 20px;">
                    <el-button type="primary" icon="el-icon-back" @click="restoreSettings">Reset</el-button>
                    <el-button type="primary" icon="el-icon-check" @click="saveSettings" style="float: right">Apply
                    </el-button>
                  </el-row>
                </el-form>
              </el-row>
            </el-main>
            <!--setting menu main end-->
          </rs-panes>
        </el-container>
      </el-main>
      <el-main v-show="!showRight" style="background-color: #333333">
        <!--homepage resource start-->
        <el-container v-show="menuLang.resource.show">
          <el-row :gutter="20" class="homepage-resource">
            <el-carousel class="carousel-style" indicator-position="outside">
              <el-carousel-item v-for="(item, index) in menuLang.resource.data" :key="index">
                <div class="photo">
                  <img :src="item.img">
                  <div class="photo-overlay">
                    <h2>{{item.title}}</h2>
                    <el-button type="primary" @click="openTab(item.url)">
                      {{item.button}}
                    </el-button>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </el-row>
        </el-container>
        <!--homepage resource end-->
        <el-container v-show="menuLang.about.show">
          <div id="about-card">
            <el-row :gutter="20">
              <el-card class="card-style">
                <div slot="header" class="card-header">
                  <span>{{menuLang.about.name}}</span>
                </div>
                <div style="text-align: center">
                  <div style="text-align: left">
                    <el-col :span="10" style="width: 400px; height: 280px;">
                      <div style="height: 30px"></div>
                      <div key="1" class="about-item">
                        <span class="el-icon-eleme"></span>{{' ' + menuLang.about.data[0].name + ': ' +
                        menuLang.about.data[0].content}}
                      </div>
                      <div style="height: 30px"></div>
                      <div key="2" class="about-item">
                        <span class="el-icon-s-order"></span>{{' ' + menuLang.about.data[1].name + ': ' +
                        menuLang.about.data[1].content}}
                      </div>
                      <div style="height: 30px"></div>
                      <div key="3" class="about-item">
                        <span class="el-icon-s-fold"></span>{{' ' + menuLang.about.data[2].name + ': ' +
                        menuLang.about.data[2].content}}
                      </div>
                      <div style="height: 30px"></div>
                      <div key="4" class="about-item">
                        <span class="el-icon-user-solid"></span>{{' ' + menuLang.about.data[3].name + ': ' +
                        menuLang.about.data[3].content}}
                      </div>
                      <div style="height: 30px"></div>
                      <div key="5" class="about-item">
                        <span class="el-icon-s-home"></span>{{' ' + menuLang.about.data[4].name + ': '}}<a
                        :href="menuLang.about.data[4].content">{{menuLang.about.data[4].content}}</a>
                      </div>
                    </el-col>
                  </div>
                  <el-col :span="10">
                    <div>
                      <img src="../../static/img/chain-ide-icon.png" class="card-img-class">
                    </div>
                  </el-col>
                </div>
              </el-card>
            </el-row>
          </div>
        </el-container>

      </el-main>
    </el-container>
  </el-container>
</template>


<script>
  import ResSplitPane from 'vue-resize-split-pane'
  import CodeEditor from "../components/CodeEditor";
  import ContractAction from "../components/ContractActions";
  import {caseTemplate} from "../assets/template/case.eg";
  import {defaultCode} from "../assets/template/case.eg";
  import {
    settingLang,
    menuLang,
    addFileMenuLang,
    deleteFileMenuLang
  } from "../assets/template/settings";

  const suffix = ".js";

  export default {
    name: "Test",
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
        showRight: true,
        langMode: "简体中文",
        themeMode: "Dark",
        codeThemeMode: "vs-dark",
        settingSelect: settingLang(),
        settingTitle: "通用",
        menuLang: menuLang(),
        backgroundColor: "#333333",
        fontSizeName: "Base",
        fontSize: "14px",
        compileABI: [],
        saveSetting: {
          langMode: '简体中文',
          themeMode: 'Dark',
          fontSize: '14px',
          codeThemeMode: 'vs-dark'
        }
      };
    },
    components: {
      'rs-panes': ResSplitPane,
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
            this.backgroundColor = "#2d323e";
          }
        }
      },
      fontSizeName: {
        handler: function (name) {
          this.fontSize = this.settingSelect.setting.data.fontSize.map[name];
        }
      },
      compileLoggers() {
        this.$nextTick(function () {
          let div = document.getElementById('logger');
          div.scrollTop = div.scrollHeight;
        })
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
      deployResult(deployResult) {
        if (deployResult.status === 'pending') {
          this.compileLoggers.push({
            title: `[${deployResult.trx}]: Deployment in progress`,
            description: deployResult.trx + ': contract is now deploying...',
            style: "normal"
          })
        }
        if (deployResult.status === 'success') {
          this.compileLoggers.push({
            title: `[${deployResult.trx}]: Deployment succeeded`,
            description: deployResult.trx + ': deployment succeeded!',
            style: "success"
          })
        }
        if (deployResult.status === 'failed') {
          this.compileLoggers.push({
            title: `[${deployResult.trx}]: deployment failed`,
            subtitle: 'message:',
            description: deployResult.message,
            style: "error"
          })
        }
      },
      runResult(runResult) {
        if (runResult.status === 'pending') {
          this.compileLoggers.push({
            title: `[${runResult.trx}]: in Execution`,
            description: runResult.trx + ': method is being executed...',
            style: "normal"
          })
        }
        if (runResult.status === 'success') {
          this.compileLoggers.push({
            title: `[${runResult.trx}]: Method run succeeded`,
            description: runResult.trx + ': method run succeeded!',
            style: "success"
          })
        }
        if (runResult.status === 'failed') {
          this.compileLoggers.push({
            title: `[${runResult.trx}]: Method run failed`,
            description: runResult.trx + ': method run failed!',
            style: "error"
          })
        }
      },
      addFile() {
        let data = addFileMenuLang(this.langMode)
        this.$prompt(data.title + suffix + data.titleSuffix, data.remind, {
          confirmButtonText: data.confirmButton,
          cancelButtonText: data.cancelButton,
          inputPattern: "",
          inputErrorMessage: data.errorMessage
        })
          .then(({value}) => {
            let newFile = value + suffix;
            for (let index in this.files) {
              if (this.files[index] === newFile) {
                this.$message({
                  type: "info",
                  message: newFile + data.alreadyExist
                });
                return;
              }
            }
            this.files.push(newFile);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: data.cancelMessage,
              duration: 2000
            });
          });
        //TODO: finally change the active class to "files"
      },
      editFileName(index) {
        let data = addFileMenuLang(this.langMode)
        let fileName = index.target.id;
        this.$prompt(data.title + suffix + data.titleSuffix, data.remind, {
          confirmButtonText: data.confirmButton,
          cancelButtonText: data.cancelButton,
          inputValue: fileName.split(".")[0],
          inputPattern: "",
          inputErrorMessage: data.errorMessage
        })
          .then(({value}) => {
            let newFile = value + suffix;
            for (let index in this.files) {
              if (this.files[index] === newFile) {
                this.$message({
                  type: "info",
                  message: newFile + data.alreadyExist
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
              message: data.cancelMessage
            });
          });
      },
      deleteFile(index) {
        let data = deleteFileMenuLang(this.langMode)
        let fileName = index.target.id;
        this.$confirm(data.title, data.remind, {
          confirmButtonText: data.confirmButton,
          cancelButtonText: data.cancelButton,
          type: "warning"
        })
          .then(() => {
            this.removeValue(this.files, fileName);
            localStorage.removeItem(fileName);
            this.removeTab(fileName);
            this.$message({
              type: "success",
              message: data.deleteSuccess,
              duration: 2000
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: data.deleteCancel,
              duration: 2000
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
        this.showRight = true
        this.openOption({index: "index"})
        this.showSettingsOnWindow = false
      },
      showSettings() {
        this.showRight = true
        this.showSettingsOnWindow = true
        this.openOption({
          index: this.langMode == "简体中文" ? "设置" : "Settings"
        })
      },
      showResource() {
        this.showRight = false
        this.menuLang.about.show = false
        this.menuLang.resource.show = true
      },
      showAbout() {
        this.showRight = false
        this.menuLang.resource.show = false
        this.menuLang.about.show = true
      },
      openOption(index) {
        for (let key in this.settingSelect) {
          this.settingSelect[key].show = false;
          if (this.settingSelect[key].name === index.index) {
            this.settingSelect[key].show = true;
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
      restoreSettings() {
        this.saveSetting.langMode = this.langMode;
        this.saveSetting.themeMode = this.themeMode;
        this.saveSetting.fontSize = this.fontSize;
        this.saveSetting.codeThemeMode = this.codeThemeMode;
      },
      saveSettings() {
        if (this.saveSetting.langMode != '' && this.saveSetting.langMode !== null) {
          this.langMode = this.saveSetting.langMode;
        }
        if (this.saveSetting.themeMode != '' && this.saveSetting.themeMode !== null) {
          this.themeMode = this.saveSetting.themeMode;
        }
        if (this.saveSetting.fontSize != '' && this.saveSetting.fontSize !== null) {
          this.fontSize = this.saveSetting.fontSize;
        }
        if (this.saveSetting.codeThemeMode !== '' && this.saveSetting.codeThemeMode !== null) {
          this.codeThemeMode = this.saveSetting.codeThemeMode;
        }
      },
      openTab(url) {
        window.open(url)
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

  .setting-window {
    background-color: #1e1e1e;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px;
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
    width: 300px;
    margin: 0 auto;
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

  #about-card {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .setting-about-card-row {
    top: 50%;
    transform: translateY(-50%);
    min-width: 500px;
  }

  .homepage-resource {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .card-img-class {
    margin-top: 50px;
    height: 240px
  }

  .card-header {
    color: white;
    font-size: 23px;
    margin-left: 20px;
  }

  .card-style {
    background-color: #333333;
    padding-bottom: 60px;
    border: 0;
    width: 800px;
    margin: 0 auto;
  }

  .setting-window {
    overflow-x: hidden;
  }

  .header-logo-style {
    margin: auto auto auto 25px;
    height: 25px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  .sign-up-btn {
    height: 30px;
    float: right;
    border: none;
    background-color: #47cf73;
    color: white;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .login-btn {
    height: 30px;
    float: right;
    border: none;
    background-color: #444857;
    color: white;
    top: 0;
    right: 0;
    bottom: 0;
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

  .normal {
    color: #409eff;
  }

  .el-card__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  .text {
    font-size: 14px;
  }

  .about-item {
    font-size: 20px;
    margin-left: 20px;
    color: white;
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

  .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
  }

  .el-submenu__title {
    height: 50px !important;
    line-height: 50px !important;
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

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #242424;
    border: #242424;
  }

  .card-style > .el-card__header {
    background-color: #28619e;
  }

  .carousel-style {
    border: 0;
    width: 800px;
    margin: 0 auto;
    border-radius: 10px 10px 10px 10px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: white;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: white;
  }

  .el-carousel__container {
    height: 600px;
  }

  .photo {
    overflow: hidden;
  }

  .photo img {
    width: 100%;
  }

  /* ---- Photo Overlay ---- */
  .photo-overlay {
    color: #fff;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 5vw 10vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(0, 0, 0, .55);
    opacity: 0;
    transition: opacity 1s;
  }

  .photo-overlay:hover {
    opacity: 1;
  }

</style>

