const db = uniCloud.database();
const { result } = require("wwqy-utils");

module.exports = {
	_before: function () { // 通用预处理器

	},
	get:async function(){
		let res=await db.collection("wwqy-weapon-nav").field({
			createTime:false,
			orderid:false,
			state:false
		})
		.where({
			state:true
		})
		.orderBy("orderid","asc").get();
		let arr = res.data.map(item =>{
			return{
				_id:item._id,
				classname:item.classname,
				icon:item.icon.url
			}
		})
		return result(0,"success",arr)
	},
	_after:function(error,result){
		if(error){
			throw error //错误直接抛出
		}
		result.timeCost = Date.now() - this.startTime
		return result
	}

}
