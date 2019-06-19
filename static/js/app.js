let currentParams = ''
let lastParams = ''
//地图容器
var chart = echarts.init(document.getElementById('main'))
//34个省、市、自治区的名字拼音映射数组
var provinces = {
  //23个省
  台湾: 'taiwan',
  河北: 'hebei',
  山西: 'shanxi',
  辽宁: 'liaoning',
  吉林: 'jilin',
  黑龙江: 'heilongjiang',
  江苏: 'jiangsu',
  浙江: 'zhejiang',
  安徽: 'anhui',
  福建: 'fujian',
  江西: 'jiangxi',
  山东: 'shandong',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  广东: 'guangdong',
  海南: 'hainan',
  四川: 'sichuan',
  贵州: 'guizhou',
  云南: 'yunnan',
  陕西: 'shanxi1',
  甘肃: 'gansu',
  青海: 'qinghai',
  //5个自治区
  新疆: 'xinjiang',
  广西: 'guangxi',
  内蒙古: 'neimenggu',
  宁夏: 'ningxia',
  西藏: 'xizang',
  //4个直辖市
  北京: 'beijing',
  天津: 'tianjin',
  上海: 'shanghai',
  重庆: 'chongqing',
  //2个特别行政区
  香港: 'xianggang',
  澳门: 'aomen'
}

//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ['北京', '天津', '上海', '重庆', '香港', '澳门']
var mapdata = []

// 渲染全国
renderChineseMap()

// 点击返回
function clickBtn() {
  console.log("lastParams",lastParams)
  if (currentParams.seriesName!=='china') {
    renderProvince(lastParams)
  } else {
    // 返回全国
    renderChineseMap()
  }
}

clickMap()
//地图点击事件
function clickMap() {
  chart.on('click', function(params) {
    console.log('paramsparams', params)

    if (params.name in provinces) {
      renderProvince(params)
    } else if (params.seriesName in provinces) {
      Municipality(params)
    } else {
      renderMap('china', mapdata)
    }
  })
}

// 渲染全国
function renderChineseMap() {
  //绘制全国地图
  $.getJSON('static/map/china.json', function(data) {
    d = []
    for (var i = 0; i < data.features.length; i++) {
      d.push({
        name: data.features[i].properties.name,
        value: Math.ceil(Math.random() * 500).toString()
      })
    }
    mapdata = d
    //注册地图
    echarts.registerMap('china', data)
    //绘制地图
    renderMap('china', d)
  })
}
// 渲染省
function renderProvince(params) {
  lastParams = currentParams
  currentParams = params
  //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
  $.getJSON('static/map/province/' + provinces[params.name] + '.json', function(data) {
    echarts.registerMap(params.name, data)
    var d = []
    for (var i = 0; i < data.features.length; i++) {
      d.push({
        name: data.features[i].properties.name,
        value: Math.ceil(Math.random() * 100).toString()
      })
    }
    renderMap(params.name, d)
   
  })
}

// 渲染直辖市
function Municipality(params) {
  lastParams = currentParams
  currentParams = params
  //如果是【直辖市/特别行政区】只有二级下钻
  if (special.indexOf(params.seriesName) >= 0) {
    renderMap('china', mapdata)
  } else {
    //显示县级地图
    $.getJSON('static/map/city/' + cityMap[params.name] + '.json', function(data) {
      echarts.registerMap(params.name, data)
      var d = []
      for (var i = 0; i < data.features.length; i++) {
        d.push({
          name: data.features[i].properties.name,
          value: Math.round(Math.random() * 50)
        })
      }
      renderMap(params.name, d)
    })
  }
}

//初始化绘制全国地图配置
var option = {
  backgroundColor: '',
  title: {
    // text: 'Echarts3 中国地图下钻至县级',
    // subtext: '三级下钻',
    // link: 'https://blog.csdn.net/example440982',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'Microsoft YaHei'
    },
    subtextStyle: {
      color: '#ccc',
      fontSize: 13,
      fontWeight: 'normal',
      fontFamily: 'Microsoft YaHei'
    }
  },
  visualMap: {
    min: 800,
    max: 50000,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['red', '#f2f2f2']
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function(result) {
      if (result.name) {
        //回调函数，参数params具体格式参加官方API
        return result.name + '<br />数据:' + result.value
      }
    }
  },
  //   dataRange: {
  //     min: 0,
  //     max: 500,
  //     splitNumber: 0,
  //     text: ['高', '低'],
  //     realtime: false,
  //     calculable: true,
  //     selectedMode: false,
  //     realtime: false,
  //     show: true,
  //     itemWidth: 0,
  //     itemHeight: 200,
  //     color: ['red', 'orangered', '#ff9b00', '#f2f2f2']
  //   },
  visualMap: {
    min: 0,
    max: 500,
    text: ['高', '低'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#f2f2f2', '#ff9b00', 'orangered', 'red']
    }
  },
  toolbox: {
    show: true,
    orient: 'vertical', // 工具栏 icon 的布局朝向。'horizontal' 'vertical'
    left: 'right', // 工具栏组件离容器左侧的距离。
    top: 'center', // left 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比，也可以是 'left', 'center', 'right'。
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    },
    iconStyle: {
      normal: {
        color: '#fff'
      }
    }
  },
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDurationUpdate: 1000
}
function renderMap(map, data) {
  option.title.subtext = map
  option.series = [
    {
      name: map,
      type: 'map',
      mapType: map,
      roam: false,
      nameMap: {
        china: '中国'
      },
      label: {
        normal: {
          show: true,
          textStyle: {
            color: '#97a6a3',
            fontSize: 13
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        }
      },
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#ddd',
          borderWidth: 1
          //   shadowColor: 'rgba(156, 156, 156, 0.5)',
          //   shadowBlur: 10
        },
        emphasis: {
          areaColor: '#44d2ff',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 20
        }
      },
      data: data
    }
  ]
  //渲染地图
  chart.setOption(option)
}
