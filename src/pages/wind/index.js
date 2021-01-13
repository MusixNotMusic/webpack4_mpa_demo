import './index.scss'
import * as d3 from "d3"
import _ from 'lodash'
export default class Wind{
    width = 900
    height = 600
    margin = {top: 20, right: 30, bottom: 30, left: 40}
    allWidth = 0
    allHeight = 0
    testDataSize = 46 * 100
    paths = [
        'M 4 2 Q 4 1.2 3.4 0.6 2.8 0 2 0 1.2 0 0.6 0.6 0 1.2 0 2 0 2.8 0.6 3.4 1.2 4 2 4 2.8 4 3.4 3.4 4 2.8 4 2 M 3.1 0.9 Q 3.6 1.3 3.6 2 3.6 2.7 3.1 3.1 2.6 3.6 2 3.6 1.3 3.6 0.8 3.1 0.4 2.7 0.4 2 0.4 1.3 0.8 0.9 1.3 0.4 2 0.4 2.6 0.4 3.1 0.9 Z',
        'M 5.3 0 L 3.7 0 3.7 30 5.3 30 5.3 0 Z',
        'M 2.1 0 L 2.1 30 3.7 30 3.7 1.6 6.9 1.6 6.9 0 2.1 0 Z',
        'M 0 30 L 1.6 30 1.6 1.6 9 1.6 9 0 0 0 0 30 Z',
        'M 9 0 L 0 0 0 30 1.6 30 1.6 5.2 4.8 5.2 4.8 3.6 1.6 3.6 1.6 1.6 9 1.6 9 0 Z',
        'M 9 -0.05 L 0 -0.05 0 30 1.6 30 1.6 5.15 9 5.15 9 3.55 1.6 3.55 1.6 1.55 9 1.55 9 -0.05 Z',
        'M 9 5.15 L 9 3.55 1.6 3.55 1.6 1.6 9 1.6 9 0 0 0 0 30 1.6 30 1.6 8.75 4.8 8.75 4.8 7.15 1.6 7.15 1.6 5.15 9 5.15 Z',
        'M 9 5.2 L 9 3.6 1.6 3.6 1.6 1.6 9 1.6 9 0 0 0 0 30 1.6 30 1.6 8.75 9 8.75 9 7.15 1.6 7.15 1.6 5.2 9 5.2 Z',
        'M 9 1.6 L 9 0 0 0 0 30 1.6 30 1.6 12.3 4.8 12.3 4.8 10.7 1.6 10.7 1.6 8.75 9 8.75 9 7.15 1.6 7.15 1.6 5.2 9 5.2 9 3.6 1.6 3.6 1.6 1.6 9 1.6 Z',
        'M 9 1.6 L 9 0 0 0 0 30 1.6 30 1.6 12.25 9 12.25 9 10.65 1.6 10.65 1.6 8.7 9 8.7 9 7.1 1.6 7.1 1.6 5.15 9 5.15 9 3.55 1.6 3.55 1.6 1.6 9 1.6 Z',
        'M 9 1.6 L 9 0 0 0 0 30 1.6 30 1.6 15.8 4.8 15.8 4.8 14.2 1.6 14.2 1.6 12.25 9 12.25 9 10.65 1.6 10.65 1.6 8.7 9 8.7 9 7.1 1.6 7.1 1.6 5.15 9 5.15 9 3.55 1.6 3.55 1.6 1.6 9 1.6 Z',
        'M 1.8 7.2 L 9 0 0 0 0 30.05 1.8 30.05 1.8 7.2 M 1.8 4.65 L 1.8 1.8 4.65 1.8 1.8 4.65 Z',
        'M 9 -0.05 L 0 -0.05 0 30 1.6 30 1.6 8.95 9 8.95 9 7.35 1.6 7.35 9 -0.05 M 1.8 1.75 L 4.65 1.75 1.8 4.6 1.8 1.75 Z',
        'M 9 -0.05 L 0 -0.05 0 30 1.6 30 1.6 12.15 9 12.15 9 10.55 1.6 10.55 1.6 8.95 9 8.95 9 7.35 1.6 7.35 9 -0.05 M 1.8 4.6 L 1.8 1.75 4.65 1.75 1.8 4.6 Z',
        'M 1.6 10.55 L 1.6 9 9 9 9 7.4 1.6 7.4 9 0 0 0 0 30 1.6 30 1.6 15.3 9 15.3 9 13.7 1.6 13.7 1.6 12.15 9 12.15 9 10.55 1.6 10.55 M 1.8 4.65 L 1.8 1.8 4.65 1.8 1.8 4.65 Z',
        'M 1.6 10.6 L 1.6 9 9 9 9 7.4 1.6 7.4 9 0 0 0 0 30 1.6 30 1.6 18.55 9 18.55 9 16.95 1.6 16.95 1.6 15.35 9 15.35 9 13.75 1.6 13.75 1.6 12.2 9 12.2 9 10.6 1.6 10.6 M 1.8 4.65 L 1.8 1.8 4.65 1.8 1.8 4.65 Z',
        'M 9 7.4 L 1.6 7.4 9 0 0 0 0 30 1.6 30 1.6 14.8 9 7.4 M 1.8 1.8 L 4.65 1.8 1.8 4.65 1.8 1.8 M 4.65 9.2 L 1.8 12.05 1.8 9.2 4.65 9.2 Z',
        'M 1.6 7.4 L 8.95 0 0 0 0 30 1.55 30 1.55 22.2 8.95 14.8 1.6 14.8 8.95 7.4 1.6 7.4 M 1.8 4.65 L 1.8 1.8 4.65 1.8 1.8 4.65 M 1.8 9.2 L 4.65 9.2 1.8 12.05 1.8 9.2 M 1.8 19.45 L 1.8 16.6 4.65 16.6 1.8 19.45 Z',
        'M 1.9 5 L 9 0 0 0 0 30.05 1.8 30.05 1.8 20.15 9 15.1 1.8 15.1 1.8 15.05 9 10 1.9 10 9 5 1.9 5 M 1.8 3.25 L 1.8 1.25 4.65 1.25 1.8 3.25 M 1.8 11.25 L 4.65 11.25 1.8 13.25 1.8 11.25 M 1.8 6.25 L 4.65 6.25 1.8 8.25 1.8 6.25 M 1.8 18.35 L 1.8 16.35 4.65 16.35 1.8 18.35 Z'
    ]
    x = null
    y = null
    ctx = null
    canvas = null
    dateFormat = d3.timeFormat("%m-%d %H:%M")
    secondFormat = d3.timeFormat("%H:%M")
    color = d3.interpolateHslLong("red", "blue")
    color1 = d3.interpolateHslLong("black", "steelblue")
    colorRainbow = d3.interpolateRainbow
    transform = null
    domain = [0, 5000]
    
    yAxisOptions = {
      tickSize: 6,
      tickCount: 10,
    }

    xAxisOptions = {
      tickCount: 13,
      tickSize: 6
    }

    size = 46
    constructor(options = {}) {
        window.temp = this
        window.d3 = d3
        this.width  = ( options.width  || this.width ) 
        this.height = ( options.height || this.height )
        this.margin = options.margin || this.margin
        this.domId =  options.domId
        this.allWidth = this.width + this.margin.right + this.margin.left
        this.allHeight = this.height + this.margin.top + this.margin.bottom
        this._render = _.throttle(this.render.bind(this), 50, {trailing: true})
        this.init()
    }

    init() {
        this.getTestData()
        // this.createPanel()
        this.createContainer()
            .createAxisLayer()
            .createOverlayLayer()
            .createProfileCanvasLayer()
            .createEventLayer()
        this.registerEvent()
        this.initX()
        this.initY()
        this.initBoxWidth()
        this.initScale()
        this.render()
    }

    createPanel() {
       this.canvas = document.createElement('canvas')
       this.canvas.width = this.allWidth 
       this.canvas.height = this.allHeight
       this.ctx = this.canvas.getContext('2d')
       document.body.append(this.canvas)
    }
    // 创建 容器层
    createContainer() {
      this.container = d3.select(`#${this.domId}`)
        .append('div')
        .attr('id', 'wind-container')
        .style('position', 'relative')
        .style('width', `${this.width + this.margin.left + this.margin.right}`)
        .style('height', `${this.height + this.margin.top + this.margin.bottom}`)
      return this
    }
    // 创建 坐标系 层 zoom=5
    createAxisLayer() {
      if (!d3.select(`#wind-container`).node()) {
        throw Error('wind contaner dom not create!')
      }
      this.canvasAxis = d3.select(`#wind-container`)
        .append('canvas')
        .attr('id', 'wind-axis')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0')
        .style('z-index', 5).node()
      this.canvasAxis.width = this.width + this.margin.left + this.margin.right
      this.canvasAxis.height = this.height + this.margin.top + this.margin.bottom
      this.contextAxis = this.canvasAxis.getContext('2d')
      return this
    }
    // 创建 覆盖 层 zoom=6
    createOverlayLayer() {
      if (!d3.select(`#wind-container`).node()) {
        throw Error('wind contaner dom not create!')
      }
      this.canvasOverlay = d3.select(`#wind-container`)
        .append('canvas')
        .attr('id', 'wind-overlay')
        .style('position', 'absolute')
        .style('top', `${this.margin.top}px`)
        .style('left', `${this.margin.left + 1}px`)
        .style('z-index', 6).node()
      this.canvasOverlay.width = this.width
      this.canvasOverlay.height = this.height - 1
      this.contextOverlay = this.canvasOverlay.getContext('2d')
      return this
    }
    // 创建 风羽图 层 zoom=7
    createProfileCanvasLayer() {
      if (!d3.select(`#wind-container`).node()) {
        throw Error('wind contaner dom not create!')
      }
      this.canvasProfile = d3.select(`#wind-container`)
        .append('canvas')
        .attr('id', 'wind-profile')
        .style('position', 'absolute')
        .style('top', `${this.margin.top}px`)
        .style('left', `${this.margin.left + 1}px`)
        .style('z-index', 7).node()
      this.canvasProfile.width = this.width
      this.canvasProfile.height = this.height - 1
      this.contextProfile = this.canvasProfile.getContext('2d')
      return this
    }
    // 创建 事件动作管理 层 zoom=8
    createEventLayer() {
      if (!d3.select(`#wind-container`).node()) {
        throw Error('wind contaner dom not create!')
      }
      this.canvasEvent = d3.select(`#wind-container`)
        .append('canvas')
        .attr('id', 'wind-event')
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
        .style('z-index', 8).node()
      this.canvasEvent.width = this.width + this.margin.left + this.margin.right
      this.canvasEvent.height = this.height + this.margin.top + this.margin.bottom
      this.contextEvent = this.canvasEvent.getContext('2d')
      return this
    }
 
    registerEvent() {
        d3.select(this.canvasEvent).call(
            d3.zoom()
              .scaleExtent([0.5, 4])
              .on("zoom", () => { 
                this.render()
             })
        )
    }

    initX() {
      console.log('initX', d3.min(this.data, d => d.t), d3.max(this.data, d => d.t))
      this.x = d3
        .scaleLinear()
        .domain([d3.min(this.data, d => d.t), d3.max(this.data, d => d.t)])
        .range([this.margin.left, this.width])
    }

    initY() {
      this.y = d3
        .scaleLinear()
        .domain(this.domain)
        .nice()
        // .range([this.height - this.margin.bottom, this.margin.top])
        .range([this.height, this.margin.top])
    }

    initScale() {
        this.scale = 1 / Math.log10(this.data.length) * 1.5
        // this.scale = 1
    }
    
    initBoxWidth () {
      this.boxWidth = this.width / Math.ceil(this.data.length / this.size) 
    }

    getTestData() {
      let now = Date.now()
        this.data = new Array(this.testDataSize).fill(0).map((item, index) => {
            let yesterday = now - 24 * 60 * 60 * 1000;
            return {
                    t:    yesterday + (index / 46 | 0) * 1000 * 60 * 15, 
                    hei:  (index) % 46  * 100, 
                    vh:   Math.random() * 10 + 20, 
                    dir:  Math.random()* 60 + 100, 
                    vv:   Math.random() * 10 + 20,     
                    cn2:  1e-15 * (Math.random() * 100 | 0),
                    chop: 0.001 * (Math.random() * 100 | 0),
                    r   : Math.random() * 3 + 7
                  }
        })
    }
    // 绘制 风羽
    drawWind(d, i) {
      // let boxWidth = this.boxWidth
      let boxHeight = 15
      let transform = d3.zoomTransform(this.canvasEvent)
      let _x = this.x(d.t)
      let _y = this.y(d.hei + boxHeight / 2)
      let randPath =  this.paths[i % this.paths.length]
      let path = new Path2D(randPath)     
      this.contextProfile.beginPath() 
      this.contextProfile.translate(transform.applyX(_x), transform.applyY(_y))
      this.contextProfile.scale(this.scale * transform.k, this.scale * transform.k)
      this.contextProfile.rotate(d.dir / 180 * Math.PI)
      this.contextProfile.fillStyle = this.color(i % 46 / 46)
      this.contextProfile.fill(path)
      this.contextProfile.resetTransform()
    }
    // 绘制叠加层
    drawOverlay(d, i) {
      let boxWidth = this.boxWidth
      let boxHeight = 15
      let transform = d3.zoomTransform(this.canvasEvent)
      let _x = this.x(d.t) - boxWidth / 2
      let _y = this.y(d.hei) - boxHeight
      this.contextOverlay.beginPath() 
      this.contextOverlay.fillStyle = this.color1(i % 46 / 46)
      // this.contextOverlay.fillStyle = this.colorRainbow(Math.log2(i) / Math.pow(i, 0.3) + i / 20 )
      // this.contextOverlay.fillStyle = this.colorRainbow(Math.random())
      this.contextOverlay.rect(transform.applyX(_x), transform.applyY(_y), boxWidth * transform.k, boxHeight * transform.k)
      this.contextOverlay.fill()
    }
    // 绘制坐标
    drawXAxis() {
      let ctx = this.contextAxis
      let transform = d3.zoomTransform(this.canvasEvent)
      let x = transform.rescaleX(this.x)
      // console.log(x.domain())
      var yOffset = this.height + this.margin.top
      var _x = (d) => { return x(d) + this.margin.left }
      var tickCount = this.xAxisOptions.tickCount,
          tickSize = this.xAxisOptions.tickSize,
          ticks = x.ticks(tickCount)
      ctx.beginPath()
      ticks.forEach((d) => {
        ctx.moveTo(_x(d), yOffset);
        ctx.lineTo(_x(d), yOffset + tickSize);
      });
      ctx.moveTo(this.margin.left , yOffset);
      ctx.lineTo(this.width + this.margin.left, yOffset);
      ctx.strokeStyle = "black";

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      // ctx.rotate(-Math.PI / 4)
      ticks.forEach((d) => {
        ctx.fillText( ticks.length <= 12 ? this.dateFormat(d) : this.secondFormat(d), _x(d) , yOffset + tickSize)
      });
      ctx.stroke();
    }


    drawYAxis() {
        let ctx = this.contextAxis
        let transform = d3.zoomTransform(this.canvasEvent)
        let y = transform.rescaleY(this.y)
        var tickCount = this.yAxisOptions.tickCount,
            tickSize = this.yAxisOptions.tickSize,
            ticks = y.ticks(tickCount),
            tickFormat = y.tickFormat(tickCount);
        var xOffset = this.margin.left
        var _y = (d) => { return y(d)+ this.margin.top }
        // ticks
        ctx.beginPath();
        ticks.forEach((d) => {
          ctx.moveTo(xOffset, _y(d));
          ctx.lineTo(xOffset - 6, _y(d));
        });
        ctx.moveTo(xOffset, this.margin.top);
        ctx.lineTo(xOffset, this.height + this.margin.top);
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        // text
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ticks.forEach((d) => {
          ctx.fillText(tickFormat(d), xOffset - tickSize, _y(d));
        })
        ctx.stroke();
    }
    // 绘制坐标 
    renderAxis() {
      this.contextAxis.clearRect(0, 0, this.allWidth, this.allHeight);
      this.drawXAxis()  
      this.drawYAxis()
    }

     // 绘制 叠加层
     renderOverlay() {
      this.contextOverlay.clearRect(0, 0, this.allWidth, this.allHeight);
      this.data.forEach(this.drawOverlay.bind(this))
     }

    // 绘制风羽图
    renderProfile() {
        // console.log('render', d3.zoomTransform(this.canvas))
        this.contextProfile.clearRect(0, 0, this.allWidth, this.allHeight);
        this.contextProfile.beginPath();
        this.data.forEach(this.drawWind.bind(this))
    }

    // 整体绘制
    render() {
      this.renderAxis()
      this.renderOverlay()
      this.renderProfile()
    }
    

    getRatio() {
      var devicePixelRatio = window.devicePixelRatio || 1;
      var context = document.createElement('canvas').getContext('2d')
      var backingStoreRatio = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;   
      return devicePixelRatio / backingStoreRatio;
    }
}

new Wind({domId: 'wind'})