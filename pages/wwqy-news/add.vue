<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="标题" required>
        <uni-easyinput placeholder="标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="avatar" label="封面大图">
        <uni-file-picker return-type="object" v-model="formData.avatar"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="author" label="作者">
        <uni-easyinput placeholder="请输入作者名称" v-model="formData.author" trim="right"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="content" label="文章内容" required>
		  //富文本编辑器
        <div id="div1"></div>
      </uni-forms-item>
      <uni-forms-item name="view_count" label="阅读数量">
        <uni-easyinput placeholder="阅读数量" type="number" v-model="formData.view_count"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="is_essence" label="推荐">
        <switch @change="binddata('is_essence', $event.detail.value)" :checked="formData.is_essence"></switch>
      </uni-forms-item>
      <uni-forms-item name="publish_date" label="发表时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.publish_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="article_status" label="文章状态">
        <uni-data-checkbox v-model="formData.article_status" :localdata="formOptions.article_status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/wwqy-news.js';
  import E from 'wangeditor'
  
  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'wwqy-news';
  let editor = null;

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "title": "",
        "avatar": null,
        "author": "",
        "content": "",
        "view_count": 68,
        "is_essence": null,
        "publish_date": null,
        "article_status": 1
      }
      return {
        formData,
        formOptions: {
          "article_status_localdata": [
            {
              "value": 0,
              "text": "草稿箱"
            },
            {
              "value": 1,
              "text": "已发布"
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules);
	  this.onWangEdit()
    },
    methods: {
		//初始化wangedit
		onWangEdit(){
			const editor = new E('#div1');
			editor.config.zIndex = 0
			editor.config.onblur = (newHtml) => {
				this.formData.content = newHtml
			}
			editor.config.customUploadImg = function (resultFiles,insertImgFn) {
				resultFiles.forEach(item =>{
					let path = URK.createObjectURL(item);
					let name = item.name;
					uniCloud.uploadFile({
						filePath:path,
						cloudPath:name
					}).then(res =>{
						insertImgFn(res.fileID)
					})
				})
			}
			editor.create()
		},
		
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
