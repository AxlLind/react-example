import React from 'react';
import DynamicPieChart from './DynamicPieChart.js';
import './../styles/App.css';

export default () => (
    <div className='AppContainer'>
        <div className='AppTitle'>
            Dynamic Pie Chart!
        </div>
        <DynamicPieChart/>
    </div>
);
