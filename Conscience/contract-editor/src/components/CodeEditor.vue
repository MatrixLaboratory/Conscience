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
        editorFile: ''
      }
    },
    mounted () {
      this.editor = monaco.editor.create(document.getElementById('editor'), {
	      value: '',
        language: defaultLang,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 16
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
      theme: function() {
        monaco.editor.setTheme(this.theme);
      },
      // editorFile: function() {
      //   console.log('file ' + this.editorFile);
      // }
    },
    methods: {
      changeEditor(fileName, code) {
        this.editorFile = fileName;
        this.editor.setValue(code);
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
