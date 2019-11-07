import * as THREE from 'three';
import AFRAME from 'aframe';
import * as d3 from 'd3';

AFRAME.registerPrimitive('a-frame-bar-chart', {
  defaultComponents: {
    aframebarchart: {}
  },
  mappings: {
    bar_type: 'aframebarchart.bar_type',
    graph_position: 'aframebarchart.graph_position',
    dimensions: 'aframebarchart.dimensions',
    data:'aframebarchart.data',
    x_position_field_name:'aframebarchart.x_position_field_name',
    x_position_scale_type:'aframebarchart.x_position_scale_type',
    x_position_start_from_zero:'aframebarchart.x_position_start_from_zero',
    x_position_domain:'aframebarchart.x_position_domain',
    x_padding:'aframebarchart.x_padding',
    z_position_field_name:'aframebarchart.z_position_field_name',
    z_position_scale_type:'aframebarchart.z_position_scale_type',
    z_position_start_from_zero:'aframebarchart.z_position_start_from_zero',
    z_position_domain:'aframebarchart.z_position_domain',
    z_padding:'aframebarchart.z_padding',
    height_field_name:'aframebarchart.height_field_name',
    height_scale_type:'aframebarchart.height_scale_type',
    height_start_from_zero:'aframebarchart.height_start_from_zero',
    height_domain:'aframebarchart.height_domain',
    color_field_name:'aframebarchart.color_field_name',
    color_scale_type:'aframebarchart.color_scale_type',
    color_start_from_zero:'aframebarchart.color_start_from_zero',
    color_domain:'aframebarchart.color_domain',
    color:'aframebarchart.color',
    bar_segment:'aframebarchart.bar_segment',
    bar_opacity:'aframebarchart.bar_opacity',
    bar_class:'aframebarchart.bar_class',
    bar_id:'aframebarchart.bar_id',
  }
});

AFRAME.registerComponent("aframebarchart", {
  dependencies: ['raycaster'],
  schema: {
    bar_type:{type:'string',default:'box'},
    graph_position:{type:'vec3',default:{x:0, y:0, z:0}},
    dimensions:{type:'vec3',default:{x:10, y:10, z:10}},
    data:{type:'string',default:''},
    x_position_field_name:{type:'string',default:''},
    x_position_scale_type:{type:'string',default:'ordinal'},
    x_position_start_from_zero:{type:'boolean',default:false},
    x_padding:{type:'number',default:0.1},
    x_position_domain:{type:'string',default:''},
    z_position_field_name:{type:'string',default:''},
    z_position_scale_type:{type:'string',default:'ordinal'},
    z_position_start_from_zero:{type:'boolean',default:false},
    z_position_domain:{type:'string',default:''},
    z_padding:{type:'number',default:0.1},
    height_field_name:{type:'string',default:''},
    height_scale_type:{type:'string',default:'linear'},
    height_start_from_zero:{type:'boolean',default:false},
    height_domain:{type:'string',default:''},
    color_field_name:{type:'string',default:''},
    color_scale_type:{type:'string',default:'linear'},
    color_start_from_zero:{type:'boolean',default:false},
    color_domain:{type:'string',default:''},
    color:{type:'string',default:'#ff0000'},
    bar_segment:{type:'number',default:8},
    bar_opacity:{type:'number',default:1},
    bar_class:{type:'string',default:''},
    bar_id:{type:'string',default:''},
    axis_color:{type:'string', default:'green'}
  },
  GetDomain: function (data, field, type, startFromZero) {
    let domain = [];
    if (type === 'ordinal') {
      for (let i = 0; i < data.length; i++) {
        if (domain.indexOf(data[i][field]) < 0) {
          domain.push(data[i][field])
        }
      }
    } else {
      if (startFromZero) {
        domain.push(0)
        domain.push(d3.max(data, d => d[field]))
      }
      else {
        domain.push(d3.min(data, d => d[field]))
        domain.push(d3.max(data, d => d[field]))
      }
    }
    return domain;
  },
  init:function(){},
  generateAxis: function () {

  },

  generateAxisBox: function (data,entity) {
    let ent = document.createElement(`a-entity`);
    ent.setAttribute('line',`start: 0, 0, 0; end: ${data.dimensions.x} 0 0; color: ${data.axis_color}`);
    ent.setAttribute('line__2',`start: 0, 0, 0; end: 0 ${data.dimensions.y} 0; color: ${data.axis_color}`);
    ent.setAttribute('line__3',`start: 0, 0, 0; end: 0 0 ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__4',`start: ${data.dimensions.x}, ${data.dimensions.y}, ${data.dimensions.z}; end: 0 ${data.dimensions.y} ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__5',`start: ${data.dimensions.x}, ${data.dimensions.y}, ${data.dimensions.z}; end: ${data.dimensions.x} 0 ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__6',`start: ${data.dimensions.x}, ${data.dimensions.y}, ${data.dimensions.z}; end: ${data.dimensions.x} ${data.dimensions.y} 0; color: ${data.axis_color}`);
    ent.setAttribute('line__7',`start: ${data.dimensions.x}, 0, ${data.dimensions.z}; end: 0 0 ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__8',`start: ${data.dimensions.x}, 0, ${data.dimensions.z}; end: ${data.dimensions.x} 0 0; color: ${data.axis_color}`);
    ent.setAttribute('line__9',`start: 0, ${data.dimensions.y}, 0; end: 0 ${data.dimensions.y} ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__10',`start: 0, ${data.dimensions.y}, 0; end: ${data.dimensions.x} ${data.dimensions.y} 0; color: ${data.axis_color}`);
    ent.setAttribute('line__11',`start: 0, 0, ${data.dimensions.z}; end: 0 ${data.dimensions.y} ${data.dimensions.z}; color: ${data.axis_color}`);
    ent.setAttribute('line__12',`start: ${data.dimensions.x}, 0, 0; end: ${data.dimensions.x} ${data.dimensions.y} 0; color: ${data.axis_color}`);
    entity.appendChild(ent)
  },
  update: function() {
    let el = this.el;
    let data = JSON.parse(this.data.data)
    console.log(data)
    let xDomain, yDomain, zDomain, colorDomain;
    if (this.data.x_position_domain === '')
      xDomain = this.GetDomain(data, this.data.x_position_field_name, this.data.x_position_scale_type, this.data.x_position_start_from_zero)
    else
      xDomain = this.data.x_position_domain.split(',')
    
    console.log(xDomain)

    if (this.data.z_position_domain === '')
      zDomain = this.GetDomain(data, this.data.z_position_field_name, this.data.z_position_scale_type, this.data.z_position_start_from_zero)
    else
      zDomain = this.data.z_position_domain.split(',')

    
    if (this.data.height_domain === '')
      yDomain = this.GetDomain(data, this.data.height_field_name, this.data.height_scale_type, this.data.height_start_from_zero)
    else {
      yDomain = this.data.height_domain.split(',').map(Number)
    }
    
    if (this.data.color_field_name !== '') 
      if (this.data.color_domain === '') {
        colorDomain = this.GetDomain(data, this.data.color_field_name, this.data.color_scale_type, this.data.color_start_from_zero)
      } else 
        colorDomain = this.data.color_domain.split(',')
    
    //Adding Scale

    let xScale, yScale, zScale, colorScale, width, depth;

    xScale = d3.scaleBand()
      .range([0, this.data.dimensions.x])
      .domain(xDomain)
      .paddingInner(this.data.x_padding);
    width = xScale.bandwidth();

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.data.dimensions.y])

    zScale = d3.scaleBand()
      .domain(zDomain)
      .range([0, this.data.dimensions.z])
      .paddingInner(this.data.z_padding);
    depth = zScale.bandwidth();

    let radius = depth / 2;
    if (depth > width)
      radius = width / 2;


    if (this.data.color_field_name !== '') {
      let colorRange = this.data.color.split(',');
      if (this.data.color_scale_type === 'ordinal')
        colorScale = d3.scaleOrdinal()
          .domain(colorDomain)
          .range(colorRange)
      else
        colorScale = d3.scaleLinear()
          .domain(colorDomain)
          .range(colorRange)  
    } 
    let entity = document.createElement("a-entity")
    entity.setAttribute('position', `${this.data.graph_position.x} ${this.data.graph_position.y} ${this.data.graph_position.y}`);

    data.forEach((d,i) => {
      let obj = d
      obj['i'] = i
      var generateTemplateString = (function(){
        var cache = {};
    
        function generateTemplate(template){
            var fn = cache[template];
    
            if (!fn){
                // Replace ${expressions} (etc) with ${map.expressions}.
    
                var sanitized = template
                    .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                        return `\$\{map.${match.trim()}\}`;
                        })
                    // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                    .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
    
                fn = Function('map', `return \`${sanitized}\``);
            }
    
            return fn;
        }
    
        return generateTemplate;
      })();
      
      let classValue = generateTemplateString(this.data.bar_class);
      let idValue = generateTemplateString(this.data.bar_id)
      let position = `${xScale(d[this.data.x_position_field_name]) + width / 2} ${yScale(d[this.data.height_field_name]) / 2} ${zScale(d[this.data.z_position_field_name]) + depth / 2}`
      if(this.data.bar_type !== 'box')
        position = `${xScale(d[this.data.x_position_field_name]) + radius} ${yScale(d[this.data.height_field_name]) / 2} ${zScale(d[this.data.z_position_field_name]) + radius}`      
      let bars = document.createElement(`a-${this.data.bar_type}`);
      let height = yScale(d[this.data.height_field_name])
      bars.setAttribute('height', height + 0.0000000001);
      bars.setAttribute('material', `color:red;`);
      bars.setAttribute('position', position);
      bars.setAttribute('opacity',this.data.bar_opacity);
      bars.setAttribute('class',classValue(obj));
      bars.setAttribute('id',idValue(obj));
      bars.setAttribute('data',d)
      if(this.data.color_field_name !== ''){
        bars.setAttribute('material', `color:${colorScale(d[this.data.color_field_name])};`);
      }
      else{
        bars.setAttribute('material', `color:${this.data.color};`);
      }
      if(this.data.bar_type === 'cone'){
        bars.setAttribute('radius-bottom', radius);
        bars.setAttribute('segments-radial',this.data.bar_segment) 
      }
      if(this.data.bar_type === 'box'){
        bars.setAttribute('width', width);
        bars.setAttribute('depth', depth);
      }
      if(this.data.bar_type === 'cylinder'){
        bars.setAttribute('radius', radius);
        bars.setAttribute('segments-radial',this.data.bar_segment);
      }
      entity.appendChild(bars)
    })
    this.generateAxisBox(this.data,entity)
    el.appendChild(entity);
  }
});
