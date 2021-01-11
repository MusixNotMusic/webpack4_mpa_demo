import './index.scss'
import * as d3 from "d3"
import _ from 'lodash'
import { zoomTransform } from 'd3'
// import moment from 'moment'
export default class Wind {
    width = 900
    height = 600
    margin = {top: 20, right: 30, bottom: 30, left: 20}
    allWidth = 0
    allHeight = 0
    testDataSize = 5000
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
    timeFormat = d3.timeFormat("%m-%d %H:%M")
    color = d3.interpolateHslLong("red", "blue")
    transform = null
    domain = [0, 5000]
    constructor(options = {}) {
        window.temp = this
        window.d3 = d3
        this.width  = ( options.width  || this.width ) 
        this.height = ( options.height || this.height )
        this.margin = options.margin || this.margin
        this.allWidth = this.width + this.margin.right + this.margin.left
        this.allHeight = this.height + this.margin.top + this.margin.bottom
        this._render = _.throttle(this.render.bind(this), 50, {trailing: true})
        this.init()
    }

    init() {
        this.getTestData()
        this.createPanel()
        this.registerEvent()
        this.initX()
        this.initY()
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

    registerEvent() {
        d3.select(this.canvas).call(
            d3.zoom()
              .scaleExtent([0.5, 4])
              .on("zoom", () => { 
                this.transform = d3.event.transform
                this._render()
             })
        )
    }

    initX() {
      console.log('initX', d3.min(this.data, d => d.t), d3.max(this.data, d => d.t))
      this.x = d3
        .scaleLinear()
        .domain([d3.min(this.data, d => d.t), d3.max(this.data, d => d.t)])
        // .nice()
        .range([this.margin.left, this.width - this.margin.right])
    }

    initY() {
      this.y = d3
        .scaleLinear()
        .domain(this.domain)
        .nice()
        .range([this.height - this.margin.bottom, this.margin.top])
    }

    initScale() {
        this.sacle = 6000 / this.data.length > 0.8 ? 0.8: 6000 / this.data.length
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

    // drawWind(d, i) {
    //   let _x = this.x(d.t) + this.margin.left + 20
    //   let _y = this.y(d.hei) + this.margin.top
    //   let transform = d3.zoomTransform(this.canvas)
    //   let randPath =  this.paths[i % this.paths.length]
    //   let path = new Path2D(randPath)     
    //   this.ctx.beginPath() 
    //   this.ctx.translate(transform.applyX(_x), transform.applyY(_y))
    //   this.ctx.scale(.5 * transform.k, .5 * transform.k)
    //   this.ctx.rotate(d.dir / 180 * Math.PI)
    //   this.ctx.fillStyle = this.color(i % 46 / 46)
    //   this.ctx.fill(path)
    //   this.ctx.resetTransform()
    // }


    drawWind(d, i) {
      let boxWidth = 20
      let boxHeight = 40
      let _x = this.x(d.t) + this.margin.left + 20 - boxWidth / 2
      let _y = this.y(d.hei) + this.margin.top - boxWidth
      let transform = d3.zoomTransform(this.canvas)
      this.ctx.beginPath() 
      this.ctx.fillStyle = this.color(i % 46 / 46)
      this.ctx.rect(transform.applyX(_x), transform.applyY(_y), boxWidth, boxHeight)
      this.ctx.fill()
    }


    // drawXAxis() {
    //     let ctx = this.ctx
    //     let x = this.x
    //     let transform = d3.zoomTransform(this.canvas)
    //     var tickCount = 13,
    //         tickSize = 6,
    //         ticks = x.ticks(tickCount)
    //     var yOffset = this.height + this.margin.top - this.margin.bottom 
    //     var _x = (d) => { return  transform.applyX(x(d)) + this.margin.left } 
    //     // var _x = (d) => { return x(d) + this.margin.left } 
    //     ctx.beginPath()
    //     ticks.forEach((d) => {
    //       ctx.moveTo(_x(d), yOffset + 20);
    //       ctx.lineTo(_x(d), yOffset + 20 + tickSize);
    //     });
    //     ctx.moveTo(this.margin.left + 20 , yOffset + 20);
    //     ctx.lineTo(this.width + this.margin.left, yOffset + 20);
    //     ctx.strokeStyle = "black";
    //     ctx.stroke();
      
    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "top";
    //     ctx.strokeStyle = "black";
    //     ctx.fillStyle = "black";
    //     // ctx.rotate(-Math.IP / 4)
    //     ticks.forEach((d) => {
    //       ctx.fillText(this.timeFormat(d), _x(d) , yOffset + 25 + tickSize)
    //       ctx.rotate(-Math.IP / 4)
    //     });
    //     ctx.stroke();
    // }

    drawXAxis() {
      let ctx = this.ctx
      let x = this.x
      let transform = d3.zoomTransform(this.canvas)
      // var tickCount = 13,
      //     tickSize = 6,
      //     ticks = x.ticks(tickCount)
      var yOffset = this.height + this.margin.top - this.margin.bottom 
      // let domain1 = x.invert(transform.applyX(this.margin.left + 20))
      // let domain2 = x.invert(transform.applyX(this.width + this.margin.left)) 
      // let domain1 = x.invert(transform.x + (this.margin.left + 20))
      // let domain2 = x.invert(transform.x + (this.width + this.margin.left)) 
      // this.x.domain([domain1, domain2])
      var _x = (d) => { return  transform.applyX(x(d)) + this.margin.left }

      // var _x = (d) => { return x(d) + this.margin.left }
      var tickCount = 13,
          tickSize = 6,
          ticks = x.ticks(tickCount)
      ctx.beginPath()
      ticks.forEach((d) => {
        ctx.moveTo(_x(d), yOffset + 20);
        ctx.lineTo(_x(d), yOffset + 20 + tickSize);
      });
      ctx.moveTo(this.margin.left + 20 , yOffset + 20);
      ctx.lineTo(this.width + this.margin.left, yOffset + 20);
      ctx.strokeStyle = "black";
      ctx.stroke()
      ctx.closePath()

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      // ctx.rotate(-Math.PI / 4)
      ticks.forEach((d) => {
        ctx.fillText(this.timeFormat(d), _x(d) , yOffset + 25 + tickSize)
      });
    }


    drawYAxis() {
        let ctx = this.ctx
        this.initY()
        let y = this.y
        // let y1 = y.invert(this.height + this.margin.top)
        // let y2 = y.invert(this.margin.top)
        // console.log(y1, y2)
        // y.domain([y, y2])
        let transform = d3.zoomTransform(this.canvas)
        let y1 = transform.applyY(this.domain[0])
        let y2 = transform.applyY(this.domain[1])
        console.log(this.domain[0], this.domain[1], y1, y2)
        y.domain([y1, y2])
        var tickCount = 10,
            tickSize = 6,
            tickPadding = 3,
            ticks = y.ticks(tickCount),
            tickFormat = y.tickFormat(tickCount);
        var xOffset = this.margin.left + 20
        var _y = (d) => { return transform.applyY(y(d) + this.margin.top + this.margin.bottom) - 10 }
        // ticks
        ctx.beginPath();
        ticks.forEach((d) => {
          ctx.moveTo(xOffset, _y(d));
          ctx.lineTo(xOffset - 6, _y(d));
        });
        ctx.moveTo(xOffset, this.margin.top);
        ctx.lineTo(xOffset, this.height + this.margin.top - 10);
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        // text
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ticks.forEach((d) => {
          ctx.fillText(tickFormat(d), xOffset - tickSize - tickPadding, _y(d));
        })
        ctx.stroke();
      }

    render() {
        console.log('render', d3.zoomTransform(this.canvas))
        this.ctx.clearRect(0, 0, this.allWidth, this.allHeight);
        this.ctx.beginPath();
        this.data.forEach(this.drawWind.bind(this))
        this.drawXAxis()  
        this.drawYAxis()
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

new Wind()