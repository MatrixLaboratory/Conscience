export function settingLang(lang) {
  let langSetting = {
    setting: {
      name: '设置',
      show: false,
      data: {
        lang: {
          label: '语言',
          list: ['简体中文', 'English']
        },
        theme: {
          label: '界面主题',
          list: ['Dark', 'Blue']
        },
        fontSize: {
          label: '字体大小',
          map: {
            Base: '14px',
            Medium: '16px',
            Large: '18px',
            ExtraLarge: '20px'
          }
        },
        codeTheme: {
          label: '代码主题',
          list: ['vs', 'vs-dark', 'hc-black']
        }
      }
    },
    resource: {
      name: '资源',
      overview: 'IOST资源',
      show: false,
      back: '返回',
      data: [
        {
          title: 'IOST内存(iRam) GAS(iGas) 买卖',
          url: 'https://www.iostabc.com/wallet/resources',
          img: '../../static/img/iost-deal.png',
          button: '点击查看'
        },
        {
          title: 'iWallet Chrome 插件',
          url: 'https://chrome.google.com/webstore/detail/iwallet/kncchdigobghenbbaddojjnnaogfppfj',
          img: '../../static/img/iWallet.png',
          button: '点击下载'
        }
      ]
    },
    about: {
      name: '关于',
      show: false,
      back: '返回',
      data: [
        {
          name: '名称',
          content: 'Chain IDE'
        },
        {
          name: '描述',
          content: '跨平台的智能合约 IDE'
        },
        {
          name: '版本',
          content: '1.0.0'
        },
        {
          name: '作者',
          content: 'WhiteMatrix'
        },
        {
          name: '联系方式',
          content: 'http://matrixdapp.com'
        }
      ]
    }
  }

  if (lang === 'English') {
    langSetting = {
      setting: {
        name: 'Settings',
        show: false,
        data: {
          lang: {
            label: 'Language',
            list: ['简体中文', 'English']
          },
          theme: {
            label: 'theme UI',
            list: ['Dark', 'Blue']
          },
          fontSize: {
            label: 'Font Size',
            map: {
              Base: '14px',
              Medium: '16px',
              Large: '18px',
              ExtraLarge: '20px'
            }
          },
          codeTheme: {
            label: 'Code Theme',
            list: ['vs', 'vs-dark', 'hc-black']
          }
        }
      },
      resource: {
        name: 'Resource',
        overview: 'IOST Resource',
        show: false,
        back: 'back',
        data: [
          {
            title: 'IOST iRam iGas deal',
            url: 'https://www.iostabc.com/wallet/resources',
            img: '../../static/img/iost-deal.png',
            button: '点击查看'
          },
          {
            title: 'iWallet Chrome extension',
            url: 'https://chrome.google.com/webstore/detail/iwallet/kncchdigobghenbbaddojjnnaogfppfj',
            img: '../../static/img/iWallet.png',
            button: '点击下载'
          }
        ]
      },
      about: {
        name: 'About',
        show: false,
        back: 'back',
        data: [
          {
            name: 'name',
            content: 'Chain IDE'
          },
          {
            name: 'description',
            content: 'Cross-platform smart contract IDE'
          },
          {
            name: 'version',
            content: '1.0.0'
          },
          {
            name: 'author',
            content: 'WhiteMatrix'
          },
          {
            name: 'concat',
            content: 'http://matrixdapp.com'
          }
        ]
      }
    }
  }
  return langSetting
}

export function menuLang(lang) {
  let menuLang = {
    contract: '智能合约',
    template: '案例模板',
    abi: 'ABI',
    addFiles: '新增文件',
    setting: '设置',
    files: '文件',
    fileFunc: {
      download: '下载',
      edit: '重命名',
      delete: '删除'
    },
    compile: {
      topTitle: '编译',
      placeholder: '请选择文件',
      button: '编译'
    },
    deploy: {
      topTitle: '部署',
      placeholder: '合约',
      abiPlaceholder: 'ABI文件',
      button: '部署'
    },
    run: {
      topTitle: '运行',
      placeholder: '请选择要执行的方法',
      button: '运行'
    }
  }
  if (lang === 'English') {
    menuLang = {
      contract: 'Smart Contract',
      template: 'Case Template',
      abi: 'ABI',
      addFiles: 'add file',
      setting: 'settings',
      files: 'files',
      topPlaceholder: 'add file',
      fileFunc: {
        download: 'download',
        edit: 'rename',
        delete: 'delete'
      },
      compile: {
        topTitle: 'Compile',
        placeholder: 'select file to compile',
        button: 'Compile'
      },
      deploy: {
        topTitle: 'Deploy',
        placeholder: 'contract',
        abiPlaceholder: 'ABI file',
        button: 'Deploy'
      },
      run: {
        topTitle: 'Run',
        placeholder: 'select the method to execute',
        button: 'Run'
      }
    }
  }
  return menuLang
}

export function addFileMenuLang(lang) {
  let menuLang = {
    title: `请输入文件名（默认为`,
    titleSuffix: '文件）',
    remind: '提示',
    confirmButton: '确定',
    cancelButton: '取消',
    errorMessage: '请输入正确的文件名！',
    alreadyExist: '已存在！',
    cancelMessage: '取消输入'
  }
  if (lang === 'English') {
    menuLang = {
      title: 'enter filename（default file suffix is: ',
      titleSuffix: ')',
      remind: 'tips',
      confirmButton: 'confirm',
      cancelButton: 'cancel',
      errorMessage: 'enter the correct filename！',
      alreadyExist: 'file already exist！',
      cancelMessage: 'cancel input'
    }
  }
  return menuLang
}

export function deleteFileMenuLang(lang) {
  let menuLang = {
    title: '此操作将永久删除该文件, 是否继续?',
    remind: '提示',
    confirmButton: '确定',
    cancelButton: '取消',
    deleteSuccess: '删除成功！',
    deleteCancel: '已取消删除！'
  }
  if (lang === 'English') {
    menuLang = {
      title: 'This operation will permanently delete the file. continue?',
      remind: 'tips',
      confirmButton: 'confirm',
      cancelButton: 'cancel',
      deleteSuccess: 'delete success！',
      deleteCancel: 'cancel delete！'
    }
  }
  return menuLang
}

export function compileNotifyLang(lang) {
  let notifyLang = {
    title: '操作失败',
    message: '请选择正确的合约文件进行编译',
    compileSuccess: {
      title: '编译成功',
      message: '编译成功！'
    },
    compileFailed: {
      title: '编译失败',
      message: '编译失败！'
    }
  }
  if (lang === 'English') {
    notifyLang = {
      title: 'operation failed',
      message: 'select the correct contract file to compile',
      compileSuccess: {
        title: 'compile success',
        message: 'compile success！'
      },
      compileFailed: {
        title: 'compile failed',
        message: 'compile success！'
      }
    }
  }
  return notifyLang
}
