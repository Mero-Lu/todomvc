(function (window) {
	'use strict';

	const vm = new Vue({
		el:'#app',
		data:{
			list:[
				{id: 1,title:'吃饭',done:false},
				{id: 2,title:'睡觉',done:true},
				{id: 3,title:'打豆豆',done:false},
			],
			msg:'',
			editId:"-1",
			
		},
		methods:{
			// 删除
			del (id) {
				this.list = this.list.filter( v => v.id != id)
			},
			// 添加
			add () {
				if(this.msg.trim().length == 0) {
					this.msg = ''
					return 
				}
				// 创建一个对象
				let id = this.list.length == 0 ? 1 :this.list[this.list.length - 1].id + 1
				let obj = {
					id,
					title:this.msg,
					done:false,
				 }
				 this.list.push(obj)
				 this.msg = ''
			},
			// 点击显示编辑
			cls (id) {
				// console.log(2223)
				this.editId = id
			},
			// 隐藏编辑
			edd () {
				this.editId = -1
			},
			// 底部的显示与隐藏
			// footHide() {
			// 	console.log('触发了')
			// 	return this.list.length > 0
			// }
			// 右下角  全删
			alldel () {
				// console.log(2223)
				this.list = this.list.filter(item => !item.done)
			}
			
		},
		created() {
			this.list = JSON.parse(localStorage.getItem('list') || '[]')
		},
		// 计算属性
		computed : {
			footHi () {
				// console.log('计算属性触发了')
				return this.list.length > 0
			},
			all :{ //当all被直接赋值 会触发set  set里面的形参就是被赋的值
				get(){
					return this.list.every(item => item.done)
				},
				set(value) {  //value ==true
					this.list.forEach(v => v.done = value);
				}
			},
			// 左下角的
			num() {
				let numbe = this.list.filter(item => !item.done)
				return numbe.length
			},
			// 右下角
			iscompleted () {
				return this.list.some(item => item.done)
			}
		},
		// 监听器
		watch : {
			list:{
				// 深监听
				deep: true,
				handler (newVal,oldVal) {  //回调
					console.log(newVal)
					localStorage.setItem('list',JSON.stringify(newVal))
				}
			}
		}

	})

})(window);
