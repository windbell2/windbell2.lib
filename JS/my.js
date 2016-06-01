
//浅表合并Json(Object)
var JsonExtend = function (target, obj) {
	if (!obj) { return target };
	for (var i in obj) {
		target[i] = obj[i];
	}
	return target;
};
/**********************/

//时间段
function TimeSpan(h, m, s) {
	this.set(h, m, s);
}

TimeSpan.prototype = {
	set: function (h, m, s) {
		this.h = Math.round(Number(h));
		this.m = Math.round(Number(m));
		this.s = Math.round(Number(s));

		this.m += Math.floor(this.s / 60);
		this.s = this.s % 60;
		this.h += Math.floor(this.m / 60);
		this.m = this.m % 60;

		this.h = this.h % 24;
		return this;
	},
	toString: function () {
		return (this.h < 10 ? "0" + this.h.toString() : this.h.toString())
			+ ":" + (this.m < 10 ? "0" + this.m.toString() : this.m.toString())
			+ ":" + (this.s < 10 ? "0" + this.s.toString() : this.s.toString());
	},
	timer: null,

	stop: function () {

	},

	callback: Function(),
	//计时
	start: function (callback) {
		var self = this;

		if (callback) {

			this.callback = callback;
		}

		if (isNaN(this.s)) {
			return;
		}

		self.timer = setInterval(function () {

			self.s--;

			if (self.s >= 0) {
				self.callback();
				return;

			}

			//s < 0, m > 0
			if (self.m > 0) {
				self.s = 59;
				self.m--;
				self.callback();
				return;
			}

			//s < 0 ,m = 0, h<1
			if (isNaN(self.h) || self.h < 1) {
				//self.callback();
				clearInterval(self.timer);
				return;
			}


			self.m = 59;
			self.s = 59;
			self.h--
			self.callback();
		}, 1000);

	}
};


//移出html
String.prototype.removeHTML = function () {
	return this.replace(/<\/?[^>]*>/g, '');
}
function removeHTML(str) {
	return str.replace(/<\/?[^>]*>/g, '');
}
//数组对象定义一个方法，用于查找指定的元素在数组中的位置（索引）
Array.prototype.indexOf = function (val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};

//数组对象定义一个方法,通过元素的索引删除元素
Array.prototype.remove = function (val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

//ajax处理
//successFun(data) data:成功返回的数据
//errorFun(data) data:失败的返回的数据(错误提示)
//在fun中配合$form.serializeReverseForm(data) [反序列号],可将ajax返回结果直接映射到表单对应元素中
function myAjaxPost(url, data, successFun, errorFun) {
	$.post(url, data, function (json) {
		if (typeof (json) == "string") { json = eval("(" + json + ")") };
		if ("code" in json) {
			if (json.code == 0) {
				if ($.isFunction(successFun)) {
					successFun(json.data);
				}

			} else {
				if ($.isFunction(errorFun)) {
					errorFun(json.data);
				} else {
					alert(json.data)
				}
			}
			if (json.action == "reload") {
				self.location.reload();
			} if (json.action == "relogin") {
				alert("需要登录");
			}
		} else {
			alert("结果不是myJson格式")
		}
	});
}

//反序列化 form
$.fn.serializeReverseForm = function (json) {

	for (var _field in json) {
		var _target = this.find("[name=" + _field + "]")

		if (_target.length == 0) { continue; }
		if (_target.get(0).tagName == "TEXTAREA") {
			if (_target.data("toggle") == "redactor") {
				_target.prev().html(json[_field])
				_target.val(json[_field])
				_target.html(json[_field])
			} else {
				_target.html(json[_field])
			}

			continue;
		}

		if (_target.attr("type") == "checkbox") {

			if (json[_field] === true || json[_field] === false || json[_field] === "false" || json[_field] === "true") {
				_target.prop("checked", json[_field])
			}
			else {
				alert(_field + "不是bool类型,可能是多个值的数组，暂时不支持它的反序列化，有需要再完善");
			}
			continue;
		}
		if (_target.attr("type") == "raido") {
			_target.each(function () {

				if ($(this).val() == json[_field].toString()) {
					$(this).prop("checked", true);
				}
			})
			continue;
		}
		else {
			_target.val(json[_field])
		}

	}
}
//序列化to Object 

$.fn.serializeObject = function () {

	var o = {};

	var a = this.serializeArray();

	$.each(a, function () {

		if (o[this.name]) {

			if (!o[this.name].push) {

				o[this.name] = [o[this.name]];

			}

			o[this.name].push(this.value || '');

		} else {

			o[this.name] = this.value || '';

		}

	});

	return o;

};
//解析后台转出的时间JSON "/Date(1397491200000)/"
function FormatTime(jsonDate, format) {
	var _jsonDate = jsonDate.split('(')[1].split(')')[0];
	var rDate = new Date(parseInt(_jsonDate));
	return rDate.pattern(format);
}
Date.prototype.pattern = function (fmt) {

	var o = {
		"M+": this.getMonth() + 1, //月份      
		"d+": this.getDate(), //日      
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时      
		"H+": this.getHours(), //小时      
		"m+": this.getMinutes(), //分      
		"s+": this.getSeconds(), //秒      
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度      
		"S": this.getMilliseconds() //毫秒      
	};

	var week = {
		"0": "\u65e5",
		"1": "\u4e00",
		"2": "\u4e8c",
		"3": "\u4e09",
		"4": "\u56db",
		"5": "\u4e94",
		"6": "\u516d"
	};

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
