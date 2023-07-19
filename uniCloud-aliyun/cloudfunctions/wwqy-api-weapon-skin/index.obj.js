const db = uniCloud.database();
const { result } = require("wwqy-utils");
let dbJQL;

module.exports = {
	_before: function () {
		this.startTime = Date.now();
		let body = this.getHttpInfo().body;
		if(!body) throw result(400,"required");
		this.params = JSON.parse(this.getHttpInfo().body)
		
		dbJQL = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		dbJQL.setUser({
			uid:'64b2eea7f08210b18138af4e',   // 建议此处使用真实uid
			role: ['admin']
		})
	},
	//获取皮肤列表
	getlist:async function(){
		let {navid,limit=5,size=0,keyword=""} = this.params;
		if(!navid) return result(400,"required");
		
		//判断是否使用的是搜索关键字
		let wer
		if(keyword){
			wer = {
				title:new RegExp(keyword,'gi')
			}
		}else{
			wer = `navid == "${navid}" && checked == true`
		}
		//查询数据库获取列表数据
		let res = await dbJQL.collection("wwqy-weapon-skin-list").where(wer)
		.field("picurl.url as picpath,title,geade,price,series")
		.skip(size).limit(limit).orderBy("orderid","asc").get();
		
		let count = await dbJQL.collection("wwqy-weapon-skin-list").where(wer).count()
		
		return result(0,"success",res.data,count.total)
		
		/* let res = await db.collection("wwqy-weapon-skin-list").where({
			navid,
			checked:true
		}).skip(size).limit(limit).orderBy("orderid","asc").get();
		return result(0,"success",res.data) */
	},
	
	//获取产品详情
	detail:async function(){
		let {id} = this.params;
		if(!id) return result(400,"required");
		let res = await dbJQL.collection("wwqy-weapon-skin-list").where(`_id == "${id}"`)
		.field("picurl.url as picpath,title,geade,price,series")
		.get({
			getOne:true
		});
		return result(0,"success",res.data)
	},
	
	_after:function(error,result){
		if(error){
			throw error //错误直接抛出
		}
		result.timeCost = Date.now() - this.startTime
		return result
	}
}