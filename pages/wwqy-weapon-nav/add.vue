<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="classname" label="类型" required>
        <uni-easyinput placeholder="请输入武器名称" v-model="formData.classname"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="orderid" label="排序">
        <uni-easyinput placeholder="请输入产品排序" type="number" v-model="formData.orderid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="icon" label="图标">
        <uni-file-picker return-type="object" v-model="formData.icon"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="state" label="状态">
        <switch @change="binddata('state', $event.detail.value)" :checked="formData.state"></switch>
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
  import { validator } from '../../js_sdk/validator/wwqy-weapon-nav.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'wwqy-weapon-nav';

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
        "classname": "",
        "orderid": null,
        "icon": null,
        "state": true
      }
      return {
        formData,
        formOptions: {},
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
