<template>
  <div id="editor"></div>
</template>

<script>

  const defaultLang = 'javascript'
  import * as monaco from 'monaco-editor';

  export default {
    name: "CodeEditor",
    data () {
      return {
        editor: null,
        editorFile: '',
        code: ''
      }
    },
    props: {
      codeFontSize: {
        type: String
      },
      theme: {
        type: String
      }
    },
    mounted () {
      this.editor = monaco.editor.create(document.getElementById('editor'), {
	      value: '',
        language: defaultLang,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14
      });
      this.editor.onDidChangeModelContent((event) => {
        let code = this.editor.getValue();
        if (code !== undefined) {
          localStorage.setItem(this.editorFile, code);
          this.changeLang(defaultLang);
        }
      });
    },
    watch: {
      theme: function(newTheme) {
        monaco.editor.setTheme(newTheme);
      },
      codeFontSize: function (size) {
        this.editor.updateOptions({'fontSize' : parseInt(size)})
      }
    },
    methods: {
      changeEditor(fileName, code) {
        this.editorFile = fileName;
        this.code = code
        this.editor.setValue(this.code);
        this.changeLang(defaultLang);
      },
      changeLang(lang) {
        monaco.editor.setModelLanguage(this.editor.getModel(), lang);
      }
    }
  }
</script>

<style scoped>

  #editor {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
