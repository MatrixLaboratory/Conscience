<template>
  <div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#333333"
      text-color="#fff"
      active-text-color="#409EFF"
    >
      <el-menu-item index="1">编译</el-menu-item>
      <el-menu-item index="2">部署</el-menu-item>
      <el-menu-item index="3">运行</el-menu-item>
    </el-menu>

    <div v-show="activeMenu === '1'">
      <el-form :inline="true" class="compile-form">
        <el-form-item>
          <el-select v-model="compileFile" value="compiler" placeholder="请选择文件" clearable>
            <el-option v-for="file in files" :key="file" :label="file" :value="file"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="compile" :loading="compiling">编译</el-button>
        </el-form-item>
      </el-form>

      <!--渲染ABI列表-->

      <el-tree node-key="id" default-expand-all :data="treeData"></el-tree>
    </div>

    <div v-show="activeMenu === '2'">
      <el-form :inline="true" class="compile-form">
        <el-form-item>
          <el-select v-model="deployIndex" value="deploy" placeholder="请选择已编译的合约" clearable>
            <el-option
              v-for="(contract, index) in compiledContracts"
              :key="index"
              :label="contract.name"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deploy">部署</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="activeMenu === '3'" style="text-align: center; margin-top: 40px">
      <el-form class="compile-form" :label-position="labelPosition" label-width="50px">
        <el-form-item>
          <el-select class="el-select-run" v-model="runIndex" placeholder="请选择要执行的方法" clearable>
            <el-option v-for="(item, index) in runMethodList" :key="index" :value="index"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="runIndex !== null">
          <el-form-item v-for="arg in runMethodList[runIndex].args" label="arg" class="el-form-item-run">
            <el-input v-model="argList[runIndex]" prefix-icon="el-icon-edit">
              <template slot="prepend">({{arg}})</template>
            </el-input>
            <div style="margin: 20px;"></div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary">运行</el-button>
        </el-form-item>
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

</style>

<script>
import {
  compileIostContract,
  compileSolContract,
  deployContract,
  deployIostContract,
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
      result: null,
      runMethodList: [],
      runIndex: null,
      argList: [],
      labelPosition: 'left'
    };
  },
  props: {
    files: {
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
          console.log(result)
          //TODO: rewrite the response validation
          if (result.abi !== undefined) {
            this.treeData = [];
            this.compiledContracts = [];
            let index = 0;
            this.treeData.push({
              id: index,
              label: "Contract:" + this.compileFile,
              children: []
            });
            this.result=result;
            const hierachy = generateIostContractHierachy(index, this.compileFile, result.abi);
            this.treeData[index] = hierachy;
            this.runMethodList = this.treeData[0].children
            // TODO: 解析contracts，渲染到页面
            this.$notify.success({
              title: "编译成功",
              message: '"' + this.compileFile + '"编译成功!'
            });
            this.compiledContracts.push({
              name: this.compileFile,
              contractCode: code,
              contractAbi: JSON.stringify(result)
            });
          } else {
            this.$notify.error({
              title: "编译失败",
              message: '"' + this.compileFile + '"编译失败!'
            });
          }
          this.$emit("compileResult", this.compileFile, result);
        });
      }
      this.compiling = false;
    },
    deploy: function() {
      deployIostContract(this.compiledContracts[this.deployIndex]);
    }
  }
};
</script>

