//index.js
/**
 * qqMapWx 腾讯地图
 * HEFENG_KEY 和风天气key
 * TXMAP_KEY 腾讯地图key
 * DEFAULT_URL 和风天气请求地址
 * echarts echarts图表
 */
const qqMapWx = require('../../libs/qqmap-wx/qqmap-wx-jssdk.min.js')
const util = require('../../utils/util')
const HEFENG_KEY = 'XXXXXXXXXXXXXXXXXXXXX'  //修改为和风天气key
const TXMAP_KEY = 'XXXXXXXXXXXXXXXXXX'   //修改为腾讯地图key
const DEFAULT_URL = 'https://free-api.heweather.com/s6'
const echarts = require('../../ec-canvas/echarts.common.min.js')

/**
 * location 定位地址
 * airQlty 空气质量
 * airBackgroundColor 空气质量背景颜色
 * threeForecast 3天天气预报
 * nowWeather 实时天气
 * rotateNum 风向图标旋转度数
 * ecHourly 24小时预报图表
 * ecSeven 7天天气预报图表
 */

Page({
  data: {
    showAuth: false,
    location: '',
    life: [],
    airQlty: '',
    airBackgroundColor: '#008000',
    threeForecast: [],
    nowWeather: {},
    rotateNum: 0,
    ecHourly: {
      lazyLoad: true
    },
    ecSeven: {
      lazyLoad: true
    }
  },
  //事件处理函数
  onLoad: function () {
  },
  onReady: function () {
    // 声明24小时预报和7天预报图表
    this.sevenComponent = this.selectComponent('#seven-forecast-echarts')
    this.hourlyComponent = this.selectComponent('#hourly-forecast-echarts')
  },
  onShow: function () {
    // this.getAuthorizeLocation()
    this.getLocation()
    this.setData({
      isDayNight: util.isDayNight()
    })
  },
  // 初始化7天预报图表
  initSeven (maxTmpVal, minTmpVal, maxTmpX, minTmpX) {
    this.sevenComponent.init((canvas,width,height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      util.sevenSetOption(chart, maxTmpVal, minTmpVal, maxTmpX, minTmpX)
      return chart
    })
  },
  // 初始化24小时预报图表
  initHourly (tmpVal, tmpX) {
    this.hourlyComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      util.hourlySetOption(chart, tmpVal, tmpX)
      return chart
    })
  },
  // 再次请求授权访问地理位置
  getAuthorizeLocation (e) {
    if (!e.detail.authSetting['scope.userLocation']) {
      this.setData({
        showAuth: true
      })
    } else {
      this.setData({
        showAuth: false
      })
    }
  },
  // 请求定位获取经(longitude)纬(latitude)度
  getLocation () {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        let latitude = res.latitude
        let longitude = res.longitude
        this.getLocationInfo(latitude, longitude)
        this.getWeatherInfo(latitude, longitude)
      },
      fail: res => {
        this.setData({
          showAuth: true
        })
        console.log(res)
      }
    })
  },
  // 根据经纬度请求腾讯地图api获取地址
  getLocationInfo (latitude, longitude) {
    let qqMapSdk = new qqMapWx({
      key: TXMAP_KEY
    })
    qqMapSdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: res => {
        let {ad_info, formatted_addresses} = res.result
        let city = ad_info.city
        this.getWeatherAir(city)
        this.setData({
          location: formatted_addresses.recommend
        })
      },
      fail: res => {
        console.log(res)
      },
    })
  },
  // 根据经纬度请求和风天气api获取天气信息：实时天气 24小时预报 7天预报 生活指数
  getWeatherInfo (latitude, longitude) {
    let key = HEFENG_KEY
    let url = `${DEFAULT_URL}/weather`
    let location = `${longitude},${latitude}`
    let data = {
      'key': key,
      'location': location
    }
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: res => {
        /**
         * daily_forecast 7天预报
         * now 实时天气
         * hourly 24小时预报
         * lifestyle 生活指数
         * threeForecast 3天预报
         * wind_dir 风向
         * sevenData 格式化后的7天预报表格数据
         * hourlyData 格式化后的24小时预报表格数据
         */
        let {daily_forecast, now, hourly, lifestyle} = res.data.HeWeather6[0]
        let threeForecast = daily_forecast.slice(0, 3)
        let wind_dir = now.wind_dir
        let sevenData = util.formatData(daily_forecast,'seven')
        let hourlyData = util.formatData(hourly,'hourly')
        this.initSeven(sevenData.maxTmpVal, sevenData.minTmpVal, sevenData.maxTmpX, sevenData.minTmpX)
        this.initHourly(hourlyData.tmpVal,hourlyData.tmpX)
        this.setData({
          life: lifestyle,
          nowWeather: now,
          threeForecast: threeForecast,
          rotateNum: util.getRotateNum(wind_dir)
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 根据城市请求和风天气api获取实时空气质量
  getWeatherAir (city) {
    let url = `${DEFAULT_URL}/air/now`
    let data = {
      'key': HEFENG_KEY,
      'location': city
    }
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: res => {
        /**
         * qlty 空气质量
         * aqi 空气质量数字
         */
        let {qlty, aqi} = res.data.HeWeather6[0].air_now_city
        this.setData({
          airQlty: qlty,
          airBackgroundColor: util.getAirBackgroundColor(aqi)
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  }
})
