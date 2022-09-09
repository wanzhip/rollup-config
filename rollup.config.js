import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import clear from 'rollup-plugin-clear';

export default {
    input: 'main.js',
    external: ['Vue'],
    output: [
        {
            file: 'dist/index.esm.js', // package.json 中 "module": "dist/index.esm.js"
            format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
            sourcemap: true
          }, {
            file: 'dist/index.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
            format: 'cjs', // commonjs 形式的包， require 导入 
            sourcemap: true
          }, {
            file: './dist/index.umd.js',
            format: 'umd',
            name: 'library',
            sourcemap: true,
            paths: {
                Vue: 'https://cdn.bootcss.com/vue/2.5.16/vue.min.js'
            }
        }
    ],
    plugins: [
        commonjs(), // 用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏 CommonJS 的检测； npm 中的大多数包都是以 CommonJS 模块的形式出现的。 在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。
        resolve(), // 依赖于从 npm 安装到你的 node_modules 文件夹中的软件包 告诉 Rollup 如何查找外部模块 
        typescript(), // 使用ts
        terser(), // 压缩
        clear({targets: ['dist']}), // 清除dist目录
        babel({
            exclude: 'node_modules/**', // 只编译我们的源代码
        }),
        cleanup({
            comments: false // 移除注释
        }),
        serve({
            port: 3000,
            contentBase:'', // 表示起的服务是在根目录下
            openPage: '/public/index.html' , // 打开的是哪个文件
            open: true // 默认打开浏览器
        }),
    ]
}
