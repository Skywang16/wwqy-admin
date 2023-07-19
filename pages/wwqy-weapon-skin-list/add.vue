<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="名称">
        <uni-easyinput placeholder="请输入皮肤名称" v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="navid" label="分类">
        <uni-data-picker v-model="formData.navid" collection="wwqy-weapon-nav" field="_id as value, classname as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="picurl" label="皮肤图">
        <uni-file-picker return-type="object" v-model="formData.picurl"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="orderid" label="排序">
        <uni-easyinput placeholder="请输入序号" type="number" v-model="formData.orderid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="geade" label="等级">
        <uni-easyinput v-model="formData.geade" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price" label="价格">
        <uni-easyinput v-model="formData.price" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="series" label="系列">
        <uni-easyinput v-model="formData.series" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="checked" label="状态">
        <uni-data-checkbox v-model="formData.checked" :localdata="formOptions.checked_localdata"></uni-data-checkbox>
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
  import { validator } from '../../js_sdk/validator/wwqy-weapon-skin-list.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'wwqy-weapon-skin-list';

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
        "navid": "",
        "picurl": null,
        "orderid": null,
        "geade": "",
        "price": "",
        "series": "",
        "checked": true
      }
      return {
        formData,
        formOptions: {
          "checked_localdata": [
            {
              "value": true,
              "text": "显示"
            },
            {
              "value": false,
              "text": "隐藏"
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
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
