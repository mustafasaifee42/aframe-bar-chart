import * as THREE from 'three';
import AFRAME from 'aframe';
import * as d3 from 'd3';

AFRAME.registerPrimitive('a-frame-scatter-plot', {
  defaultComponents: {
    aframescatterplot: {}
  },
  mappings: {
    point_type: 'aframescatterplot.point_type',
    graph_position: 'aframescatterplot.graph_position',
    dimensions: 'aframescatterplot.dimensions',
    data:'aframescatterplot.data',
    x_position_field_name:'aframescatterplot.x_position_field_name',
    x_position_scale_type:'aframescatterplot.x_position_scale_type',
    x_position_start_from_zero:'aframescatterplot.x_position_start_from_zero',
    x_position_domain:'aframescatterplot.x_position_domain',
    x_padding:'aframescatterplot.x_padding',
    z_position_field_name:'aframescatterplot.z_position_field_name',
    z_position_scale_type:'aframescatterplot.z_position_scale_type',
    z_position_start_from_zero:'aframescatterplot.z_position_start_from_zero',
    z_position_domain:'aframescatterplot.z_position_domain',
    z_padding:'aframescatterplot.z_padding',
    y_position_field_name:'aframescatterplot.y_position_field_name',
    y_position_scale_type:'aframescatterplot.y_position_scale_type',
    y_position_start_from_zero:'aframescatterplot.y_position_start_from_zero',
    y_position_domain:'aframescatterplot.y_position_domain',
    color_field_name:'aframescatterplot.color_field_name',
    color_scale_type:'aframescatterplot.color_scale_type',
    color_start_from_zero:'aframescatterplot.color_start_from_zero',
    color_domain:'aframescatterplot.color_domain',
    color:'aframescatterplot.color',
    radius_field_name:'aframescatterplot.radius_field_name',
    radius_scale_type:'aframescatterplot.radius_scale_type',
    radius_start_from_zero:'aframescatterplot.radius_start_from_zero',
    radius_domain:'aframescatterplot.radius_domain',
    radius:'aframescatterplot.radius',
    point_opacity:'aframescatterplot.point_opacity',
    point_class:'aframescatterplot.point_class',
    point_id:'aframescatterplot.point_id',
  }
});

AFRAME.registerComponent("aframescatterplot", {
  dependencies: ['raycaster'],
  schema: {
    point_type:{type:'string',default:'sphere'},
    graph_position:{type:'vec3',default:{x:0, y:0, z:0}},
    dimensions:{type:'vec3',default:{x:10, y:10, z:10}},
    data:{type:'string',default:''},
    x_position_field_name:{type:'string',default:''},
    x_position_scale_type:{type:'string',default:'linear'},
    x_position_start_from_zero:{type:'boolean',default:true},
    x_padding:{type:'number',default:0.1},
    x_position_domain:{type:'string',default:''},
    z_position_field_name:{type:'string',default:''},
    z_position_scale_type:{type:'string',default:'linear'},
    z_position_start_from_zero:{type:'boolean',default:true},
    z_position_domain:{type:'string',default:''},
    z_padding:{type:'number',default:0.1},
    y_position_field_name:{type:'string',default:''},
    y_position_scale_type:{type:'string',default:'linear'},
    y_position_start_from_zero:{type:'boolean',default:true},
    y_position_domain:{type:'string',default:''},
    color_field_name:{type:'string',default:''},
    color_scale_type:{type:'string',default:'ordinal'},
    color_start_from_zero:{type:'boolean',default:false},
    color_domain:{type:'string',default:''},
    color:{type:'string',default:'#ff0000'},
    radius_field_name:{type:'string',default:''},
    radius_scale_type:{type:'string',default:'linear'},
    radius_start_from_zero:{type:'boolean',default:true},
    radius_domain:{type:'string',default:''},
    radius_range:{type:'string',default:'0,1'},
    radius:{type:'number',default:0.2},
    point_opacity:{type:'number',default:1},
    point_class:{type:'string',default:''},
    point_id:{type:'string',default:''},
    axis_color:{type:'string', default:'green'}
  },
  GetDomain: function (data, field, type, startFromZero) {
    let domain = [];
    console.log(field, type)
    if (type === 'ordinal') {
      for (let i = 0; i < data.length; i++) {
        if (domain.indexOf(data[i][field]) < 0) {
          domain.push(data[i][field])
          console.log(data[i][field])
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
    let xDomain, yDomain, zDomain, colorDomain,radiusDomain;
    if (this.data.x_position_domain === '')
      xDomain = this.GetDomain(data, this.data.x_position_field_name, this.data.x_position_scale_type, this.data.x_position_start_from_zero)
    else
      xDomain = this.data.x_position_domain.split(',')

    if (this.data.z_position_domain === '')
      zDomain = this.GetDomain(data, this.data.z_position_field_name, this.data.z_position_scale_type, this.data.z_position_start_from_zero)
    else
      zDomain = this.data.z_position_domain.split(',')

    
    if (this.data.y_position_domain === '')
      yDomain = this.GetDomain(data, this.data.y_position_field_name, this.data.y_position_scale_type, this.data.y_position_start_from_zero)
    else {
      yDomain = this.data.y_position_domain.split(',').map(Number)
    }
    
    if (this.data.color_field_name !== '') 
      if (this.data.color_domain === '') {
        colorDomain = this.GetDomain(data, this.data.color_field_name, this.data.color_scale_type, this.data.color_start_from_zero)
      } else 
        colorDomain = this.data.color_domain.split(',')
    
    if (this.data.radius_field_name !== '') 
      if (this.data.radius_domain === '') {
        radiusDomain = this.GetDomain(data, this.data.radius_field_name, this.data.radius_scale_type, this.data.radius_start_from_zero)
      } else 
        radiusDomain = this.data.radius_domain.split(',')

    //Adding Scale

    let xScale, yScale, zScale, colorScale, width, depth, radiusScale;

    xScale = d3.scaleLinear()
      .range([0, this.data.dimensions.x])
      .domain(xDomain)

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, this.data.dimensions.y])

    zScale = d3.scaleLinear()
      .domain(zDomain)
      .range([0, this.data.dimensions.z])

    let radius = this.data.radius

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
      console.log(colorRange,colorDomain)
    } 
    if (this.data.radius_field_name !== '') {
      let radiusRange = this.data.radius_range.split(',');
      radiusScale = d3.scaleLinear()
        .domain(radiusDomain)
        .range(radiusRange)  
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
      
      let classValue = generateTemplateString(this.data.point_class);
      let idValue = generateTemplateString(this.data.point_id)
      let position = `${xScale(d[this.data.x_position_field_name])} ${yScale(d[this.data.y_position_field_name])} ${zScale(d[this.data.z_position_field_name])}`
      if(this.data.point_type === 'box')
        position = `${xScale(d[this.data.x_position_field_name]) + radius} ${yScale(d[this.data.y_position_field_name]) + radius} ${zScale(d[this.data.z_position_field_name]) + radius}`      
      let points = document.createElement(`a-${this.data.point_type}`);
      points.setAttribute('material', `color:red;`);
      points.setAttribute('position', position);
      points.setAttribute('opacity',this.data.point_opacity);
      points.setAttribute('class',classValue(obj));
      points.setAttribute('id',idValue(obj));
      points.setAttribute('data',d)
      console.log(colorScale(d[this.data.color_field_name]))
      if(this.data.color_field_name !== ''){
        points.setAttribute('material', `color:${colorScale(d[this.data.color_field_name])};`);
      }
      else{
        points.setAttribute('material', `color:${this.data.color};`);
      }
      if(this.data.radius_field_name !== ''){
        radius = radiusScale(d[this.data.radius_field_name])
      }
      if(this.data.point_type === 'box'){
        points.setAttribute('width', radius * 2);
        points.setAttribute('depth', radius * 2);
        points.setAttribute('height', radius * 2);
      }
      if(this.data.point_type === 'sphere'){
        points.setAttribute('radius', radius);
      }
      entity.appendChild(points)
    })
    this.generateAxisBox(this.data,entity)
    el.appendChild(entity);
  }
});
