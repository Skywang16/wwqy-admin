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
	},
	//获取资讯列表
	async get(){
		let {
			limit = 8,
			size = 0,
			hot = false
		} = this.params;
		let wer = `article_status == 1`;
		if(hot){
			wer = `article_status == 1 && is_essence == true`
		}
		//获取数据列表
		let res = await dbJQL.collection("wwqy-news").where(wer)
		.field("avatar.url as picurl,title,is_essence,view_count,author,publish_date")
		.orderBy("publish_date desc").skip(size).limit(limit).get();
		let count = await dbJQL.collection("wwqy-news").where(wer).count();
		
		return result(0,"success",res.data,count.total)
	},
	
	//获取详情页
	async detail(){
		let {id} = this.params;
		if(!id) return result(400,"required");
		let res = await dbJQL.collection("wwqy-news").where(`_id == "${id}"`)
		.field("title,is_essence,view_count,author,publish_date,publish_date,content,article_status")
		.get({
			getOne:true
		})
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