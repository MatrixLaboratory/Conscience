export function settingLang(lang) {
  let langSetting = [
    {
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
    }
  ]

  if (lang === 'English') {
    langSetting = [
      {
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
      }
    ]
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
    aboutUs: '关于我们',
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
      aboutUs: 'about us',
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
