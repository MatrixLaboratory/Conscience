export function settingLang(lang) {
  let langSetting = []
  if (lang === '简体中文') {
    langSetting = [{
      name: '设置',
      data: {
        show: false,
        label: '语言',
        lang: ['简体中文', 'English']
      }
    }, {
      name: '关于',
      data: {
        show: false,
        content: 'hello'
      }
    }]
  }
  if (lang === 'English') {
    langSetting = [{
      name: 'Settings',
      data: {
        show: false,
        value: '',
        label: 'Language',
        lang: ['简体中文', 'English']
      }
    }, {
      name: 'About',
      data: {
        show: false,
        content: 'hello'
      }
    }]
  }
  return langSetting
}

export function menuLang(lang) {
  let menuLang = {}
  if (lang === '简体中文') {
    menuLang = {
      contract: '智能合约',
      template: '案例模板',
      topPlaceholder: '新增文件',
      compile: {
        topTitle: '编译',
        placeholder: '请选择文件',
        button: '编译'
      },
      deploy: {
        topTitle: '部署',
        placeholder: '请选择已编译的合约',
        button: '部署'
      },
      run: {
        topTitle: '运行',
        placeholder: '请选择要执行的方法',
        button: '运行'
      }
    }
  }
  if (lang === 'English') {
    menuLang = {
      contract: 'smart contract',
      template: 'case template',
      topPlaceholder: 'add file',
      compile: {
        topTitle: 'compile',
        placeholder: 'select file to compile',
        button: 'compile'
      },
      deploy: {
        topTitle: 'deploy',
        placeholder: 'select the compiled contract to deploy',
        button: 'deploy'
      },
      run: {
        topTitle: 'run',
        placeholder: 'select the method to execute',
        button: 'run'
      }
    }
  }
  return menuLang
}
