// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "标题",
    "title": "标题"
  },
  "avatar": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "封面大图",
    "title": "封面大图"
  },
  "author": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "作者",
    "title": "作者"
  },
  "content": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "文章内容",
    "title": "文章内容"
  },
  "view_count": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "阅读数量",
    "defaultValue": 68,
    "label": "阅读数量"
  },
  "is_essence": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "推荐",
    "label": "推荐"
  },
  "publish_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "发表时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "发表时间"
  },
  "article_status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "value": 0,
            "text": "草稿箱"
          },
          {
            "value": 1,
            "text": "已发布"
          }
        ]
      }
    ],
    "title": "文章状态",
    "defaultValue": 1,
    "label": "文章状态"
  }
}

const enumConverter = {
  "article_status_valuetotext": {
    "0": "草稿箱",
    "1": "已发布"
  }
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
