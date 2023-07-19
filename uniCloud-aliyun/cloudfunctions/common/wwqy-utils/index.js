//返回的提示文字的格式化
function giveMsg(str){
	let msgObj={
		"success":"查询成功~",
		"noSuccess":"查询失败",
		"add":'新增成功',
		"noAdd":"新增失败",
		"required":"缺少参数"
	}
	return msgObj[str]
}

function giveCode(num){
	let codeObj={
		0:0,      //成功的代码
		400:400   //调试失败的代码 
	}
	return codeObj[num]
}


function result(errCode,errMsg,data,total){
	return{
		errCode:giveCode(errCode),
		errMsg:giveMsg(errMsg),
		data,
		total
	}
}

module.exports = {
	giveMsg,
	giveCode,
	result
}