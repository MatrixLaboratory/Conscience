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
          <el-select v-model="compileFile" value="compiler" placeholder="请选择文件">
            <el-option v-for="file in files" :key="file" :label="file" :value="file"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="compile" :loading="compiling">编译</el-button>
        </el-form-item>
      </el-form>

      <!--渲染ABI列表-->

      <el-tree node-key="id" :default-expanded-keys="openIndex" :data="treeData"></el-tree>
    </div>

    <div v-show="activeMenu === '2'">
      <el-form :inline="true" class="compile-form">
        <el-form-item>
          <el-select v-model="deployIndex" value="deploy" placeholder="请选择已编译的合约">
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

    <div v-show="activeMenu === '3'">运行</div>
  </div>
</template>

<script>
import {
  compileIostContract,
  compileSolContract,
  deployContract,
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
        result:null

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
          console.log(result);
          if (result.abi !== undefined) {
            this.treeData = [];
            this.compiledContracts = [];
            const abi = result.abi;
            let index = 0;
            this.treeData.push({
              id: index,
              label: "Contract:" + this.compileFile,
              children: []
            });
            this.result=result;
            const hierachy = generateIostContractHierachy(index, this.compileFile, result.abi);
            this.treeData[index] = hierachy;
            // TODO: 解析contracts，渲染到页面
            this.$notify.success({
              title: "编译成功",
              message: '"' + this.compileFile + '"编译成功!'
            });
            // TODO: Not applicable for IOST, rewrite
            // const contractsFile = result.contracts[this.compileFile];
            // Object.keys(contractsFile).forEach(key => {
            //   console.warn('key: ', key);
            //   this.compiledContracts.push({
            //     name: key,
            //     value: contractsFile[key]
            //   });
            // });
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
      // TODO: this.compiledContracts[this.deployIndex] is not working yet
      // deployContract(this.compiledContracts[this.deployIndex]);
        console.log("compile");
        console.log(localStorage.getItem(this.compileFile));
        console.log("abi");
        console.log(JSON.stringify(this.result));
        let deploycode= localStorage.getItem(this.compileFile);
        let deployabi = JSON.stringify(this.result);
        deployContract(deploycode,deployabi);

    }
  }
};
</script>

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
</style>
