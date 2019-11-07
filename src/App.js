import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'aframe';
import './aframe-bar-chart.js';
import AFRAME from 'aframe';
import data from './data.json'

function App() {
  return (
    <div className="App">
      <a-scene background="color: #FAFAFA">
        <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow></a-box>
        <a-frame-bar-chart bar_type="box" bar_class={'bars boxes_${Month}_${Year}'} data={`${JSON.stringify(data)}`} x_position_field_name='Year' z_position_field_name='Month' height_field_name='Tornadoes' color_scale_type='linear' color_field_name='Deaths' color='red,green' />
      </a-scene>
    </div>
  );
}

export default App;
