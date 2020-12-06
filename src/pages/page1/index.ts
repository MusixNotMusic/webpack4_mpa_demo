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
    public badgeRadius = 9;
    public badgeBorderWidth = 2;

    public warningColor = ['#00C851','#ffbb33','#ff4444'];

    private _id = 'graph';
    private dataset: any;
    private root: any = null;
    private rootId: number = -1;
    public  _curveLink = d3.linkHorizontal().x((d: any) => { return d.x; }).y((d: any) => { return d.y; });
    public tree: any = null;
    // 树
    public svgTree: any = null;
    public nodeTree: any = null;
    constructor() {
        this.dataset = _.cloneDeep(dataset);
        this.initSimulation();
        this.render();
        this.regsiterEvent();
        (window as any)._beiMing = this;
    }

    render() {
        this.dataset = _.cloneDeep(dataset);
        this.drawBox();
        this.drawArrowHead();
        this.drawLinks();
        this.drawEdgePaths();
        this.drawEdgeLabels();
        this.defineImage();
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
        this.svgDom = d3.select("#"+this._id)
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
            .attr('refX', 22) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY', 0)
            .attr('orient','auto')
            .attr('markerWidth',20)
            .attr('markerHeight',20)
            .attr('xoverflow','visible')
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M 0,-3 L 8 ,0 L 0,3')
            .attr('fill', '#999')
            .style('stroke','none');
    }

    drawLinks() {
       this.link = this.svgDom.selectAll(".links")
            .data(this.dataset.links)
            .enter()
            .append("line")
            .attr("class", "links")
            .attr('marker-end','url(#arrowhead)')
        // this.link = this.svgDom.selectAll(".links")
        //     .data(this.dataset.links)
        //     .enter()
        //     .append("path")
        //     .attr("class", "links")
        //     // .attr("d", this._curveLink)
        //     .attr('marker-end','url(#arrowhead)')

       this.link.append("title")
            .text((d: any) => d.type);
    }

    drawEdgePaths() {
        this.edgePaths = this.svgDom.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(this.dataset.links)
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
            .data(this.dataset.links)
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

    defineImage() {
        let pattern = this.svgDom
            .append('defs')
            .append('pattern')
            .attr('id', 'image')
            // .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', '0%')
            .attr('y', '0%')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('viewBox', `0 0 ${this.mainRadius} ${this.mainRadius}`)
        pattern.append('rect')
                .attr('height', this.mainRadius)
                .attr('width', this.mainRadius)
                .attr('opacity', '0.5')
                .attr('fill', 'orangered')
        pattern.append('image')
                .attr('x', '0%')
                .attr('y', '0%')
                .attr('height', this.mainRadius)
                .attr('width', this.mainRadius)
                .attr('xlink:href', 'https://cdn3.iconfinder.com/data/icons/people-professions/512/Baby-512.png')
    }

    drawNodes() {
        this.node = this.svgDom.selectAll(".nodes")
            .data(this.dataset.nodes)
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
            // .style("fill", (d: any) => this.colorScale(d.group))
            .style("fill", "url(#image)")
       
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
        this.drawLegendG1();
        // this.drawLegendG2();
    }
    // 绘制 图例 group 1
    drawLegendG1() {
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
    }
    // 绘制 图例 group 2
    drawLegendG2() {
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
            .nodes(this.dataset.nodes)
            .on("tick", this.ticked.bind(this));

        this.simulation.force("link")
            .links(this.dataset.links);
    }

    ticked() {
        if(!this.link || !this.node || !this.edgePaths) return;
        
        // this.link.attr('d', this._curveLink)
        this.link.attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);
      
        this.node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        this.edgePaths.attr('d', (d: any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        // this.edgePaths.attr('d', this._curveLink);
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
    /**
     * generator tree 
     */
    generatorTree() {
        let id = this.root.id;
        // let tree = [[this.root.id]];
        let tree: any = {data: this.root, children: [], parent: null};
        // 路径重复 出现相同id 
        let checkedParent = (node: any) => {
            let id = node.data.id;
            let prevNode = null;
            while(node.parent) {
                if(node.parent.data.id === id){
                    return true;
                }
                node = node.parent;
                prevNode = node;
            }
            return false;
        }


        let generate = (tree: any) => {
            _.each(this.dataset.links, (link) => {
                if(link.source.id === tree.data.id) {
                    let node: any = {data: link.target, children: [], parent: tree};
                    tree.children.push(node);
                    if(!checkedParent(node)) {
                        generate(node);
                    }
                }
            });
        }
        let removeParent = (tree: any) => {
            _.each(tree.children, (node) => {
                delete node.parent;
                removeParent(node);
            });
        }
        generate(tree);
        removeParent(tree);
        this.tree = tree;
        this.printTree(tree);
        return tree;
    }

    printTree(tree: any) {
        let _tree: any = [];
        let cur: any = [tree];
        let next:any = [];

        let print = (nodes: any) => {
            if(_.isEmpty(nodes)) return;
            _.each(nodes, (node) => {
                if(node.children.length > 0) {
                    next = next.concat(node.children);
                    // _tree.push()
                }
            })
            _tree.push(nodes);
            console.log(_.map(nodes, (node) => { return node.data.id}));
            cur = next;
            next = [];
            print(cur);
        }
        print(cur);
        console.log('_tree ==>', _tree);
    }

    generatorD3TreeData() {
        let tree = this.generatorTree();
        let d3treeData = (data: any) => {
            const root: any = d3.hierarchy(data);
            // root.dx = this.width / (root.height + 1);
            // root.dy = 10;
            root.dx = this.width / 18;
            root.dy = this.height / 8;
            return d3.tree().nodeSize([root.dx, root.dy])(root);
        }
        this.root = d3treeData(tree);
    }

    drawTreeSvg() {
        const root = this.root;
        // 获取左x, 右x 最大值
        let x0 = Infinity;
        let x1 = -x0;
        root.each((d: any) => {
          if (d.x > x1) x1 = d.x;
          if (d.x < x0) x0 = d.x;
        });
        console.log('drawTreeSvg ==>', x0, x1);
        // 真实宽度
        let realWidth = Math.abs(x0) + x1;
        let width = this.width + this.margin.left + this.margin.right;
        let height = this.height + this.margin.top + this.margin.bottom;
        let scale = 1;
        if(realWidth > this.width) {
            scale = this.width / realWidth;
        }
        let offsetWidth = (x1 + x0) / 2 * scale;
        // 树整体居中
        let left = this.width  / 2  - offsetWidth;
        let top = this.margin.top;
        d3.select('#tree svg').remove();
        const svg = d3.select('#tree').append('svg')
            .attr('height', height)
            .attr('width',  width)
            .attr("viewBox", ([0, 0, this.width, this.height] as any))
            .call(d3.zoom().translateBy, left, top)
            .call(d3.zoom().scaleBy, scale)
        // call svg
        svg.call(d3.zoom()
            .extent([[0, 0], [this.width, this.height]])
            .scaleExtent([1/4, 8])
            .on("zoom", zoomed));
            
        function zoomed() {
            // console.log('zoomed ==>', d3.event.transform);
            // g.transition().duration(200).ease(d3.easeLinear).attr("transform", d3.event.transform);
        }
        
        const g = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            // .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
            .attr("transform", `translate(${this.width/2}, ${this.height/2})scale(${0.1}, ${0.1})`)
            // .transition().duration(1000).ease(d3.easeLinear)
            // .attr("transform", `translate(${(this.width) / 2 - offsetWidth},${this.margin.top})scale(${scale}, ${scale})`)
        // g.transition().duration(800).ease(d3.easeCubicInOut).attr("transform", `translate(${left},${top})scale(${scale}, ${scale})`)

        const link = g.append("g")
          .attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)
        .selectAll("path")
          .data(root.links())
          .join("path")
            // .attr("d", d3.linkVertical()
            //     .x((d: any) => d.x)
            //     .y((d: any) => d.y));
            .attr("d", this.elbow);
        
        this.nodeTree = g.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
          .selectAll("g")
          .data(root.descendants())
          .join("g")
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

        this.drawTreeNodes();
        // this.nodeTree.append("circle")
        //     .attr("fill", (d: any) => d.children ? "#555" : "#999")
        //     .attr("r", 2.5);
      
        // this.nodeTree.append("text")
        //     .attr("dy", "0.31em")
        //     .attr("x", (d: any) => d.children ? -6 : 6)
        //     .attr("text-anchor", (d: any) => d.children ? "end" : "start")
        //     .text((d: any) => d.data.data.data.name)
        //   .clone(true).lower()
        //     .attr("stroke", "white");
        
    }


    drawTreeNodes() {
        this.nodeTree.append("circle")
            .attr("r", (d: any) => this.mainRadius)//+ d.runtime/20 )
            .style("stroke-opacity", 0.3)
            .style("cursor", 'pointer')
            .style("stroke-width", (d: any) => 6)
            .style("stroke", (d: any) => this.colorScale(d.group))
            .style("fill", "url(#image)")
       
        this.drawTreeBadge();

        this.nodeTree.append("title")
            .text((d: any) => d.data.data.id + ": " + d.data.data.label + " - " + d.data.data.group +", runtime:"+ d.data.data.runtime+ "min");


        this.nodeTree.append("text")
            .attr("y", this.mainRadius + 12)
            .attr("x", 0)
            .attr("text-anchor", 'middle')
            .text((d: any) => { return d.data.data.name});
        // this.nodeTree.append("text")
        //     .attr("dy",12)
        //     .attr("dx", -8)
        //     .text((d: any) => d.data.data.runtime);
    }

    //  Badge徽标
    drawTreeBadge() {
        console.log('drawBadge');
        let numberPos = this.mainRadius - this.mainBorderWidth - 2;
        let radius = this.badgeRadius - this.badgeBorderWidth;
        // let counter = Number(_.uniqueId());
        let colorSet = (counter: number | string) => { return counter < 100 ? this.warningColor[0] : (counter < 200 ?  this.warningColor[1] : this.warningColor[2] )};
        let treeBadge = this.nodeTree.append('g');
        treeBadge.append('circle')
            .attr("r", (d: any) => radius)
            .style("stroke", "grey")            
            .style("stroke-opacity", 0.5)
            .style("stroke-width", (d: any) => this.badgeBorderWidth)
            .style('cx', numberPos)
            .style('cy', -numberPos)
            .style('fill','black')
        treeBadge.append("text")
            .attr("x", numberPos)
            .attr("y", -numberPos)
            .attr("dy", '.3em')
            .attr("text-anchor", 'middle')
            .style("fill", (d: any) => colorSet(d.data.data.runtime))
            .text((d: any) => d.data.data.runtime);
    }

    elbow(d: any, i ?: number) {
        let source = d.source;
        let target = d.target;
        let half_y = (target.y + source.y)/2;
        if(!source.hasOwnProperty('x') && !target.hasOwnProperty('x')) return;
        if(source.x === target.x) return "M" + source.x + "," + source.y + "V" + target.y;
        return "M" + source.x + "," +  source.y
             + "V" + half_y + "H" + target.x
             + "V" + target.y;
        // return "M" + d.source.x + "," + d.source.y
        //      + "V" + d.target.y + "H" + d.target.x
        //      + "v"+  (d.target.y - d.source.y) / 2;
      }


    clickNode(d: any) {
        console.log('clickNode =>', d);
        this.root = d;
        if(d.id !== this.rootId) {
            this.generatorD3TreeData();
            this.drawTreeSvg();
            console.log('clickNode =>', this.root);
        }
        this.rootId = d.id


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
