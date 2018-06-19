import React, { Component } from 'react';
import { PieChart } from 'react-d3';
import _ from 'lodash';
import ChangeableTitle from './ChangeableTitle.js';
import Changer from './Changer.js';
import './../styles/DynamicPieChart.css'

const animation = {
    startRadius: 105,
    endRadius: 100,
    step: -1,
    speed: 50,
}

export default class DynamicPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieData: [
                { label: 'Paul', value: 30 },
                { label: 'John', value: 30 },
                { label: 'George', value: 30 },
                { label: 'Ringo', value: 10 },
            ],
            errorText: '',
            pieRadius: 100,
        };

        this.addToChart = this.addToChart.bind(this);
        this.removeFromChart = this.removeFromChart.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.animation);
    }

    /**
     * Normalizes the values of the pieData array.
     * Makes sure the value properties add up to (100 - value).
     * Returns the normalized object array.
     * @param {[object]} pieData array of pieData objects
     * @param {number} value
     */
    normalizeData(pieData, value = 0) {
        const sum = _.sumBy(pieData, 'value');
        const scaleFactor = (100 - value) / sum;
        pieData.forEach(data => data.value *= scaleFactor);
        return pieData;
    }

    /**
     * Adds a slice to the pie chart.
     * Returns true if added. Otherwise, if a check fails
     * returns false and displays a message.
     */
    addToChart(label, value) {
        if (_.isEmpty(label)) {
            this.displayError('Slice has to have a label');
            return false;
        }
        if (_.isEmpty(value)) {
            this.displayError('Slice has to have a percentage')
            return false;
        }
        if ([0, 100].includes(value)) {
            this.displayError('Percentage cannot be 0 or 100');
            return false;
        }
        let { pieData } = this.state;
        if (_.find(pieData, data => label === data.label)) {
            this.displayError('Cannot have duplicate lables');
            return false;
        }
        pieData = this.normalizeData(this.state.pieData, value);
        pieData.push({ label, value });
        if (pieData.length === 1) // handle case when there are no other slices
            pieData[0].value = 100;
        this.updatePieData(pieData);
        return true;
    }

    removeFromChart(label) {
        let { pieData } = this.state;
        pieData = pieData.filter(data => label !== data.label);
        pieData = this.normalizeData(pieData);
        this.updatePieData(pieData);
    }

    updatePieData(pieData) {
        pieData.forEach(data => data.value = Math.round(data.value * 100) / 100);
        this.setState({ pieData, pieRadius: animation.startRadius });
        this.animate();
    }

    animate() {
        this.animation = setInterval(() => {
            let { pieRadius } = this.state;
            if (pieRadius > animation.endRadius) {
                pieRadius += animation.step;
            } else {
                clearInterval(this.animationInterval);
                pieRadius = animation.endRadius;
            }
            this.setState({ pieRadius });
        }, animation.speed)
    }

    displayError(errorText) {
        setTimeout(() => this.setState({ errorText: '' }), 2000);
        this.setState({ errorText });
    }

    render = () => (
        <div className='ChartContainer'>
            <ChangeableTitle defaultTitle='My Cool Pie Chart'/>
            <div className='PieChart'>
                <PieChart
                    data={this.state.pieData}
                    width={500}
                    height={400}
                    radius={this.state.pieRadius}
                    innerRadius={30}
                    hoverAnimation={false}
                />
            </div>
            <Changer
                onAdd={this.addToChart}
                onRemove={this.removeFromChart}
                removableLabels={_.map(this.state.pieData, 'label')}
            />
            <div className='ChartErrorText'>
                {this.state.errorText}
            </div>
        </div>
    );
}
