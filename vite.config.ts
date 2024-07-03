import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'
function pathResolve(dir: string): string {
  return resolve(process.cwd(), '.', dir)
};
export default defineConfig({
  base:'./',
  plugins: [
		vue(),
		AutoImport({
			//安装两行后你会发现在组件中不用再导入ref，reactive等
			imports: ['vue', 'vue-router'],
            //存放的位置
			dts: "src/auto-import.d.ts",
		}),
		Components({
			// 引入组件的,包括自定义组件
            // 存放的位置
            dts: "src/components.d.ts",
            resolvers: [ElementPlusResolver()],
		}),
	],
  resolve: {
    alias: {
      '@': pathResolve('src'),
      '@wangeditor':path.resolve(__dirname, 'node_modules/@wangeditor')
    }
  },
  server: {
    host:'0.0.0.0',//IP地址
    port: 6000, //端口号
    open: false //启动后是否自动打开浏览器
  },
  build:{
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'wangeditor':['@wangeditor/editor-for-vue']
        }
      }}
  }
})
