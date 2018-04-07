$(function(){
	/**
	 * 字典列表与code转汉字
	 */
	$.extend({
		//获取字典列表
		getDictList:function(type) {
			if (!type) {
				return null;
			}
			//先从sessionStorage 取
			var typeDict = sessionStorage.getItem("model.dict." + type);
			if (typeDict){
				return $.parseJSON(typeDict);
			} else {
				//取消异步
				$.ajaxSetup({async : false});
				var dict = [];
				$.get(publicContextPath + "/dict/getDictsByType.do", {type:type}, function(respone) {
					if (respone.responeCode == "0") {
						dict = respone.data;
						//存入sessionStorage
						if (dict) {
							sessionStorage.setItem("model.dict."+type,JSON.stringify(dict));
						}
					} 
				});
				$.ajaxSetup({async : true});
				return dict;
			}
		},
		//字典code 转value
		getDictName:function(type,value){
			if (!type || !value) {
				return null;
			}
			//先从sessionStorage 取
			var typeMap = sessionStorage.getItem("model.dict.map." + type);
			if (typeMap) {
				var json = $.parseJSON(typeMap);
				return json[value];
			} else {
				var map = {};
				var dictList = $.getDictList(type);
				if (dictList) {
					$.each(dictList,function(i,v){
						map[v.code] = v.name
					});
					if (map) {
						sessionStorage.setItem("model.dict.map."+type,JSON.stringify(map));
					}
					return map[value];
				}
			}
		}
	});
	/**
	 * <div class="col-sm-5">
			<label class="radio-inline"> <input type="radio" required 
				way-data="status" name="status" value="1">有效
			</label>
			<label class="radio-inline"> <input type="radio" required
				way-data="status"  name="status" value="0">无效
			</label>
		</div>
	 */
	//字典渲染
	$(".sf-radio,.sf-checkbox").each(function(i,v){
		var inputName = $(this).data("sf-input-name");
		var dictType = $(this).data("sf-dict-type");
		var required = $(this).data("sf-required");

		var dictList = $.getDictList(dictType);
		if (dictList) {
			$.each(dictList,function(j,k){
				k.inputName = inputName;
				if (required) {
					k.required = required
				}
				//禁用
				if (k.status == '0') {
					k.disabled = "disabled";
				}
			});
		}
		if ($(this).hasClass("sf-radio")) {
			$("#sf-radio-temlate").tmpl(dictList).appendTo(this);
		} else {
			$("#sf-checkbox-temlate").tmpl(dictList).appendTo(this);
		}
	});
	$(".sf-select").each(function(i,v){
		var dictType = $(this).data("sf-dict-type");
		var dictList = $.getDictList(dictType);
		if (dictList) {
			$.each(dictList,function(j,k){
				//禁用
				if (k.status == '0') {
					k.disabled = "disabled";
				}
			});
		}
		$("#sf-select-temlate").tmpl(dictList).appendTo(this);
	});
})