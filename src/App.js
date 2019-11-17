import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'aframe';
import './aframe-bar-chart.js';
import './aframe-scatter-plot';
import AFRAME from 'aframe';
import data from './data.json'

function App() {
  return (
    <div className="App">
      <a-scene background="color: #FAFAFA">
        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow></a-box>
        <a-frame-scatter-plot point_type="sphere" point_class={'bars boxes_${species}'} data={`${JSON.stringify(data)}`} x_position_field_name='sepal_length' z_position_field_name='sepal_width' y_position_field_name='petal_length' color_scale_type='ordinal' color_field_name='species' color='red,green,blue' />
      </a-scene>
    </div>
  );
}

export default App;
