var list = ['今天', '明天', '后天']
var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
// 根据风向返回旋转度数
function getRotateNum(winDir) {
  let num = 0
  switch (winDir) {
    case '东北风':
      num = 0
      break
    case '北风':
      num = -45
      break
    case '西北风':
      num = -90
      break
    case '西风':
      num = -135
      break
    case '西南风':
      num = -180
      break
    case '南风':
      num = 135
      break
    case '东南风':
      num = 90
      break
    case '东风':
      num = 45
      break
    case '无持续风向':
      num = -45
      break
    case '旋转风':
      num = -45
      break
  }
  return num
}
// 天气质量背景颜色
function getAirBackgroundColor(aqi) {
  if (aqi > 0 && aqi <= 50) {
    return '#008000'
  } else if (aqi <= 100) {
    return '#ffff00'
  } else if (aqi <= 150) {
    return '#ffa500'
  } else if (aqi <= 200) {
    return '#ff0000'
  } else if (aqi <= 300) {
    return '#800080'
  } else if (aqi > 300) {
    return '#8E236B'
  }
}
// 判断白天黑夜
function isDayNight() {
  let nowHour = new Date().getHours()
  if (nowHour < 19) {
    return false
  } else {
    return true
  }
}
// 判断周几
function isWeekDay(date) {
  let time = date.replace(/\-/g, '')
  let nowTime = new Date()
  let year = nowTime.getFullYear()
  let month = nowTime.getMonth() + 1
  let day = nowTime.getDate()
  let weekDay = new Date(date).getDay()
  month = month < 10 ? `0${month}` : month
  day = day < 10? `0${day}` : day
  let nowTimeString = `${year}${month}${day}`
  let num = time - nowTimeString
  if (num < 3) {
    return list[num]
  } else {
    return week[weekDay]
  }
}
// 7天预报，参数chart：图表对象 maxTmpVal: 最高温度 minTmpVal: 最低温度 maxTmpX: 最高温度对应X轴 minTmpX：最低温度对应X轴
function sevenSetOption(chart, maxTmpVal, minTmpVal, maxTmpX, minTmpX) {
  const option = {
    title: {
      text: '7天预报',
      textStyle: {
        color: '#ffffff'
      }
    },
    color: ["#ffff00", "#67E0E3"],
    backgroundColor: 'rgba(0,0,0,0.1)',
    grid: {
      containLabel: true,
      borderColor: '#ffffff',
      left: '3%',
      right: "9%",
      bottom: 30
    },
    tooltip: {
      show: false,
      trigger: 'axis'
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: minTmpX,
      // 坐标轴标签
      axisLabel: {
        color: '#ffffff',
        interval: 0,
        formatter: (a) => {
          let arr = a.split('|')
          return `{weather|${arr[0]}}\n{wind|${arr[1]}\n${arr[2]}}`
        },
        rich: {
          weather: {
            lineHeight: 30,
            fontSize: 14
          },
          wind: {
            lineHeight: 15
          }
        }
      },
      // 坐标轴线
      axisLine: {
        show: false
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      }
    }, {
      type: 'category',
      boundaryGap: false,
      data: maxTmpX,
      axisLabel: {
        color: '#ffffff',
        interval: 0,
        formatter: (a) => {
          let arr = a.split('|')
          let time = new Date(arr[1])
          let month = time.getMonth() + 1
          let day = time.getDate()
          month = month < 10 ? `0${month}` : month
          day = day < 10 ? `0${day}` : day
          return `{dayTxt|${arr[0]}}\n{dayNum|${month}/${day}}\n{weather|${arr[2]}}`
        },
        rich: {
          weather: {
            lineHeight: 20,
            fontSize: 14
          },
          dayNum: {
            lineHeight: 17
          },
          dayTxt: {
            lineHeight: 17,
            fontSize: 16
          }
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    }],
    yAxis: {
      show: false,
      type: 'value',
      max: (a) => {
        return a.max + 3
      },
      min: (a) => {
        return a.min -3
      }
    },
    series: [{
      name: '最高温度',
      type: 'line',
      smooth: true,
      xAxisIndex: 1,
      data: maxTmpVal,
      label: {
        show: true,
        color: '#ffffff',
        formatter: '{c}°'
      }
    }, {
      name: '最低温度',
      type: 'line',
      smooth: true,
      xAxisIndex: 0,
      data: minTmpVal,
      label: {
        show: true,
        color: '#ffffff',
        formatter: '{c}°'
      }
    }],
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 50,
      zoomLock: true,
      xAxisIndex: [0, 1],
      filterMode: 'none'
    }]
  };

  chart.setOption(option);
}
// 24小时预报 参数chart：图表对象 tmpVal：温度 tmpX：对应X轴
function hourlySetOption(chart, tmpVal, tmpX) {
  const option = {
    title: {
      text: '24小时预报',
      textStyle: {
        color: '#ffffff'
      }
    },
    color: ["#ffffff"],
    backgroundColor: 'rgba(0,0,0,0.1)',
    grid: {
      containLabel: true,
      borderColor: '#ffffff',
      left: '3%',
      right: '9%',
      bottom: 30
    },
    tooltip: {
      show: false,
      trigger: 'axis'
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: tmpX,
      // 坐标轴标签
      axisLabel: {
        color: '#ffffff',
        interval: 0,
        formatter: (a) => {
          let arr = a.split('|')
          let time = new Date(arr[0])
          let hour = time.getHours()
          let minute = time.getMinutes()
          hour = hour < 10 ? `0${hour}` : hour
          minute = minute < 10 ? `0${minute}` : minute
          return `${hour}:${minute}\n{weather|${arr[1]}}\n{wind|${arr[2]}\n${arr[3]}}`
        },
        rich: {
          weather: {
            lineHeight: 20
          },
          wind: {
            lineHeight: 15
          }
        }
      },
      // 坐标轴线
      axisLine: {
        show: false
      },
      // 坐标轴刻度
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    }],
    yAxis: {
      type: 'value',
      show: false,
      min: (a) => {
        return a.min -3
      }
    },
    series: [{
      name: '温度',
      type: 'line',
      smooth: true,
      data: tmpVal,
      label: {
        show: true,
        color: '#ffffff',
        formatter: `{c}°`
      },
    }],
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 50,
      zoomLock: true,
      xAxisIndex: [0],
      filterMode: 'none'
    }]
  };

  chart.setOption(option)
}
// 格式化图表数据
function formatData (data, type) {
  if (type == 'seven') {
    let sevenData = {
      maxTmpVal: [],
      minTmpVal: [],
      minTmpX: [],
      maxTmpX: []
    }
    for (let item of data) {
      sevenData.maxTmpVal.push(item.tmp_max)
      sevenData.minTmpVal.push(item.tmp_min)
      sevenData.minTmpX.push(`${item.cond_txt_n}|${item.wind_dir}|${item.wind_sc}级`)
      sevenData.maxTmpX.push(`${isWeekDay(item.date)}|${item.date}|${item.cond_txt_d}`)
    }
    return sevenData
  } else if (type == 'hourly') {
    let hourlyData = {
      tmpVal: [],
      tmpX: []
    }
    for (let item of data) {
      hourlyData.tmpVal.push(item.tmp)
      hourlyData.tmpX.push(`${item.time}|${item.cond_txt}|${item.wind_dir}|${item.wind_sc}级`)
    }
    return hourlyData
  }
}

module.exports = {
  getRotateNum: getRotateNum,
  getAirBackgroundColor: getAirBackgroundColor,
  isDayNight: isDayNight,
  formatData: formatData,
  sevenSetOption: sevenSetOption,
  hourlySetOption: hourlySetOption
}
