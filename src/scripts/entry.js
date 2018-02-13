import css from '../styles/index.css';
import less from '../styles/black.less';
// 任何需要的 js 里引入，缺点是不管你后来用还是不用这个库，都会打包到 js 里
// import $ from 'jquery';
// import Vue from 'vue';

{
  let jspangString = 'Hello Webpack1';
  $('#title').html(jspangString);
}

console.log( encodeURIComponent(process.env.type) );

var json = require('../../package.json');
$('#json').html(json.name);

var vm = new Vue({
	el: '#nav',	
	data: {
		msg: 'hello Vue.js'
	}
});