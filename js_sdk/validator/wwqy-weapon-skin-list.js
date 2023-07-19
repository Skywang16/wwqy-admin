// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "名称",
    "label": "名称"
  },
  "navid": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "分类",
    "label": "分类"
  },
  "picurl": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "皮肤图",
    "label": "皮肤图"
  },
  "orderid": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "排序",
    "label": "排序"
  },
  "geade": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "等级",
    "label": "等级"
  },
  "price": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "价格",
    "label": "价格"
  },
  "series": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "系列",
    "label": "系列"
  },
  "checked": {
    "rules": [
      {
        "format": "bool"
      },
      {
        "range": [
          {
            "value": true,
            "text": "显示"
          },
          {
            "value": false,
            "text": "隐藏"
          }
        ]
      }
    ],
    "title": "状态",
    "defaultValue": true,
    "label": "状态"
  }
}

const enumConverter = {
  "checked_valuetotext": [
    {
      "value": true,
      "text": "显示"
    },
    {
      "value": false,
      "text": "隐藏"
    }
  ]
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
