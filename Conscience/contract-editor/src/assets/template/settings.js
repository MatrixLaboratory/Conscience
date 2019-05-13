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
    },
    {
      name: '关于',
      show: false,
      data: {
        content: 'hello'
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
      },
      {
        name: 'About',
        show: false,
        data: {
          content: 'hello'
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
  if (lang === 'English') {
    menuLang = {
      contract: 'Smart Contract',
      template: 'Case Template',
      abi: 'ABI',
      topPlaceholder: 'add file',
      compile: {
        topTitle: 'Compile',
        placeholder: 'select file to compile',
        button: 'Compile'
      },
      deploy: {
        topTitle: 'Deploy',
        placeholder: 'select the compiled contract to deploy',
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
