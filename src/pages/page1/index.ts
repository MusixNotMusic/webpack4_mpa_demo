import './index.scss'
import * as d3 from 'd3';
import * as _ from 'lodash';
import { dataset } from './data';
export default class beiMingTopology {
    private margin = {top: 30, right: 80, bottom: 5, left: 5};
    public width: number = 805;
    public height: number = 765;
    private simulation: any;
    private svgDom: any;
    private link: any;
    private node: any;
    private legend_G1: any;
    private legend_G2: any;
    private edgePaths: any;
    private edgeLabels: any;
    private badge: any;
    public colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
        .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
        .range(['#ff9e6d', '#86cbff', '#c2e5a0','#fff686','#9e79db'])

    public mainRadius = 20;
    public mainBorderWidth = 4;
    public badgeRadius = 8;
    public badgeBorderWidth = 2;

    public warningColor = ['#00C851','#ffbb33','#ff4444'];
    constructor() {
        this.initSimulation();
        this.render();
        this.regsiterEvent();
        (window as any)._beiMing = this;
    }

    render() {
        this.drawBox();
        this.drawArrowHead();
        this.drawLinks();
        this.drawEdgePaths();
        this.drawEdgeLabels();
        this.drawNodes();
        this.drawLegend();
        this.simulationBind();
    }

    fresh() {
        this.destroy();
        this.initSimulation();
        this.render();
        this.simulationBind();
    }

    destroy() {
        d3.select('#graph').select('svg').remove();
        this.svgDom = null;
        this.simulation = null;
        this.legend_G1 = null;
        this.legend_G2 = null;
        this.link = null;
        this.node = null;
        this.edgePaths = null;
        this.edgeLabels = null;
    }

    initSimulation() {
        this.simulation = d3.forceSimulation()
            .force("link", 
                d3.forceLink() // This force provides links between nodes
                .id((d:any) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
                .distance(120)) 
            .force("charge", d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes. 
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
    }

    drawBox() {
        this.svgDom = d3.select("#graph")
                .append("svg")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                    .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }


    drawArrowHead() {
        this.svgDom.append('defs').append('marker')
            .attr("id",'arrowhead')
            .attr('viewBox','-0 -5 15 15') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
            .attr('refX', 30) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY', 0)
            .attr('orient','auto')
            .attr('markerWidth',20)
            .attr('markerHeight',20)
            .attr('xoverflow','visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 12 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');
    }

    drawLinks() {
       this.link = this.svgDom.selectAll(".links")
            .data(dataset.links)
            .enter()
            .append("line")
            .attr("class", "links")
            // .attr('marker-start','url(#arrowhead)')
            .attr('marker-end','url(#arrowhead)')

       this.link.append("title")
            .text((d: any) => d.type);
    }

    drawEdgePaths() {
        this.edgePaths = this.svgDom.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(dataset.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', function (d: any, i: number) {return 'edgepath' + i})
            .style("pointer-events", "none");
    }

    drawEdgeLabels() {
        this.edgeLabels = this.svgDom.selectAll(".edgelabel")
            .data(dataset.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d: any, i: number) {return 'edgelabel' + i})
            .attr('font-size', 10)
            .attr('fill', '#aaa');

        this.edgeLabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d: any, i: number) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text((d: any) => d.type);
    }

    drawNodes() {
        this.node = this.svgDom.selectAll(".nodes")
            .data(dataset.nodes)
            .enter()
            .append("g")
            .attr("class", "nodes")
            .on("click", this.clickNode.bind(this))
            .call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
                .on("start", this.dragstarted.bind(this)) //start - after a new pointer becomes active (on mousedown or touchstart).
                .on("drag", this.dragged.bind(this))      //drag - after an active pointer moves (on mousemove or touchmove).
                //.on("end", dragended)     //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
            );

        this.node.append("circle")
            .attr("r", (d: any) => this.mainRadius)//+ d.runtime/20 )
            // .style("stroke", "grey")
            .style("stroke-opacity", 0.3)
            .style("cursor", 'pointer')
            // .style("stroke-width", (d: any) => d.runtime/10)
            .style("stroke-width", (d: any) => 6)
            .style("stroke", (d: any) => this.colorScale(d.group))
            .style("fill", (d: any) => this.colorScale(d.group))
       
        this.drawBadge();

        this.node.append("title")
            .text((d: any) => d.id + ": " + d.label + " - " + d.group +", runtime:"+ d.runtime+ "min");


        this.node.append("text")
            .attr("y", this.mainRadius + 12)
            .attr("x", 0)
            .attr("text-anchor", 'middle')
            .text((d: any) => d.name);
        this.node.append("text")
            .attr("dy",12)
            .attr("dx", -8)
            .text((d: any) => d.runtime);
    }
    //  Badge徽标
    drawBadge() {
        console.log('drawBadge');
        let numberPos = this.mainRadius - this.mainBorderWidth - 2;
        let radius = this.badgeRadius - this.badgeBorderWidth;
        // let counter = Number(_.uniqueId());
        let colorSet = (counter: number | string) => { return counter < 5 ? this.warningColor[0] : (counter < 8 ?  this.warningColor[1] : this.warningColor[2] )};
        this.badge =  this.node.append('g');
        this.badge.append('circle')
            .attr("r", (d: any) => radius)
            .style("stroke", "grey")            
            .style("stroke-opacity", 0.5)
            .style("stroke-width", (d: any) => this.badgeBorderWidth)
            .style('cx', numberPos)
            .style('cy', -numberPos)
            .style('fill','black')
        this.badge.append("text")
            .attr("x", numberPos)
            .attr("y", -numberPos)
            .attr("dy", '.3em')
            .attr("text-anchor", 'middle')
            .style("fill", (d: any) => colorSet(Number(_.uniqueId())))
            .text((d: any) => _.uniqueId());
    }

    drawLegend() {
        this.legend_G1 = this.svgDom.selectAll(".legend")
                        .data(this.colorScale.domain())
                        .enter().append("g") 
                        .attr("transform", (d: any, i: number) => `translate(${this.width},${i * 20})`); 

        this.legend_G1.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", this.colorScale);

        this.legend_G1.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .text((d: any) => d);
            
            //drawing the second legend
        this.legend_G2 = this.svgDom.append("g") 
            //.attr("transform", (d, i) => `translate(${width},${i * 20})`); 
            .attr("transform", `translate(${this.width}, 120)`);
            
        this.legend_G2.append("circle")
                .attr("r", 5)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("stroke", "grey")
                .style("stroke-opacity",0.3)
                .style("stroke-width", 15)
                .style("fill", "black")

        this.legend_G2.append("text")
                .attr("x",15)
                .attr("y",0)
                .text("long runtime");
            
        this.legend_G2.append("circle")
                .attr("r", 5)
                .attr("cx", 0)
                .attr("cy", 20)
                .style("stroke", "grey")
                .style("stroke-opacity",0.3)
                .style("stroke-width", 2)
                .style("fill", "black")

        this.legend_G2.append("text")
                .attr("x",15)
                .attr("y",20)
                .text("short runtime");
    }

    simulationBind(){
       this.simulation
            .nodes(dataset.nodes)
            .on("tick", this.ticked.bind(this));

        this.simulation.force("link")
            .links(dataset.links);
    }

    ticked() {
        if(!this.link || !this.node || !this.edgePaths) return;
        this.link.attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);
      
        this.node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        this.edgePaths.attr('d', (d: any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
      }

    dragstarted(d: any) {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
        d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
        d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }

    dragged(d: any) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    clickNode(d: any) {
        console.log('clickNode =>', d);
    }


    regsiterEvent() {
        d3.select('#render').on('click', () => {
            console.log('regsiterEvent', this);
            this.destroy();
            this.fresh();
        })
    }
}


new beiMingTopology();
