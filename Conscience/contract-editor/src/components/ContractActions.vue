<template>
  <div>
    <div>
      <div style="margin-top: 40px; margin-left: 50px;">
        <el-row :gutter="40">
          <el-col :span="14">
            <div class="grid-content bg-purple">
              <el-select style="width: 217px" v-model="compileFile" value="compiler" :placeholder="menuLang.compile.placeholder" clearable>
                <el-option v-for="file in files" :key="file" :label="file" :value="file"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="compile" :loading="compiling">{{menuLang.compile.button}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 40px; margin-left: 50px;">
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-select v-model="deployIndex" value="deploy"
                         :placeholder="menuLang.deploy.placeholder" clearable>
                <el-option
                  v-for="(contract, index) in compiledContracts"
                  :key="index"
                  :label="contract.name"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-select v-model="abiFilename" value="deployABI"
                         :placeholder="menuLang.deploy.abiPlaceholder" clearable>
                <el-option v-for="item in abiList"
                           :key="item"
                           :label="item"
                           :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="deploy">{{menuLang.deploy.button}}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-show="treeData.length != 0">
        <el-divider></el-divider>
      </div>


      <!--渲染ABI列表-->

      <el-tree v-show="treeData.length != 0" :style="{backgroundColor : backgroundColor, fontSize : fontSize, color : 'white'}"
               node-key="id" default-expand-all :data="treeData"></el-tree>
    </div>

    <div v-show="showRunArea" style="text-align: center; margin-top: 40px">
      <el-form style="margin-right: 50px" class="compile-form" :label-position="labelPosition" label-width="45px">
        <el-form-item>
          <el-select class="el-select-run" v-model="runIndex" :placeholder="menuLang.run.placeholder" clearable>
            <el-option v-for="(item, index) in runMethodList" :key="index" :value="index"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="run">{{menuLang.run.button}}</el-button>
        </el-form-item>
        <div v-if="runIndex !== null">
          <el-form-item v-for="(arg,index) in runMethodList[runIndex].args" :key="index" label="arg:" class="el-form-item-run">
            <el-input v-model="argList[index]" prefix-icon="el-icon-edit">
              <template slot="prepend">({{arg}})</template>
            </el-input>
            <div style="margin: 20px;"></div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import "../styles/variable.less";

  .el-menu-item {
    width: 33.3%;
    text-align: center;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: solid 1px #000000;
  }

  .el-tree {
    background-color: @base-color;
  }

  .compile-form {
    text-align: center;
    margin-top: 40px;
  }

  .run-form {
    text-align: center;
    margin-top: 40px;
  }

  .el-select-run {
    display: inline-block;
    position: relative;
    width: 300px;
  }

  .el-form-item-run {
    width: 300px;
    margin: 0 auto;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #409eff;
    color: white;
  }

</style>

<script>
import {
  compileIostContract,
  compileSolContract,
  deployContract,
  deployIostContract,
  runtestIostContract,
  generateIostContractHierachy
} from "../../static/js/ContractCompile";

export default {
  name: "ContractActions",
  data() {
    return {
      activeMenu: "1",
      compileFile: "",
      compiling: false,
      compileResult: "123",
      treeData: [],
      compiledContracts: [],
      deployIndex: "",
      openIndex: [],
      abiFilename: '',
      runMethodList: [],
      runIndex: null,
      argList: [],
      labelPosition: 'left',
      showRunArea: false,
      result: ''
    };
  },
  props: {
    files: {
      type: Array
    },
    menuLang: {
      type: Object
    },
    backgroundColor: {
      type: String,
      default: '#333333'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    abiList: {
      type: Array
    }
  },
  methods: {
    handleSelect: function(key) {
      this.activeMenu = key;
    },
    compile: function() {
      this.compiling = true;
      if (this.compileFile === "") {
        this.$notify.error({
          title: "操作失败",
          message: "请选择正确的合约文件进行编译！"
        });
      } else {
        let code = localStorage.getItem(this.compileFile);
        compileIostContract(code, this.compileFile).then(result => {
          console.log('result:', result);
          if (result == undefined || result.abi == undefined) {
            this.reportError(result);
            return;
          }
          this.result = result
          this.treeData = [];
          let index = 0;
          this.treeData.push({
            id: index,
            label: "Contract:" + this.compileFile,
            children: []
          });
          const hierachy = generateIostContractHierachy(index, this.compileFile, result.abi);
          this.treeData[index] = hierachy;
          this.runMethodList = this.treeData[0].children
          // TODO: 解析contracts，渲染到页面
          this.$notify.success({
            title: "编译成功",
            message: '"' + this.compileFile + '"编译成功!',
            duration: 1000
          });
          this.$emit("compileResult", this.compileFile, result);
          for (let index in this.compiledContracts) {
            if (this.compileFile == this.compiledContracts[index].name) {
              return
            }
          }
          this.compiledContracts.push({
            name: this.compileFile,
            contractCode: code,
            contractAbi: JSON.stringify(result)
          })
        }, (result) => this.reportError(result));
      }
      this.compiling = false;
    },
    deploy: function() {
      let data = {
        'lang': this.result.lang,
        version: this.result.version,
        abi: localStorage.getItem(this.abiFilename)
      }
      console.log(data)
      deployIostContract(this.compiledContracts[this.deployIndex], data);
      this.showRunArea = localStorage.getItem('showRunArea')
    },
    run: function() {
      runtestIostContract(this.runMethodList[this.runIndex].label, this.argList);
    },
    reportError: function(result) {
      // if (error !== undefined) {
      //   errorMemssage = `Error Message: <pre><code> ${JSON.stringify(error.response, null, 4)}</code></pre>`
      // }
      this.$notify({
        title: '编译失败',
        message: '"' + this.compileFile + '"编译失败!'
      })
      this.$emit("compileResult", this.compileFile, result);
    }
  }
};
</script>

