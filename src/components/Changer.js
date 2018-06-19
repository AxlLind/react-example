import React, { PureComponent, PropTypes } from 'react';
import Modal from 'react-modal';
import './../styles/Changer.css';

Modal.setAppElement('#root');
const modalStyle = {
    overlay: {
        backgroundColor: '#A9A9A999'
    },
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

export default class Changer extends PureComponent {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        removableLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            label: '',
            percentage: '',
            adding: false,
            showRemove: false,
        }

        this.updateLabel = this.updateLabel.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.updatePercentage = this.updatePercentage.bind(this);
    }

    updateLabel(event) {
        const label = event.target.value;
        this.setState({ label });
    }

    updatePercentage(event) {
        let percentage = event.target.value;
        if (percentage !== '') // allow it to be empty
            percentage = _.clamp(percentage, 0, 100);
        this.setState({ percentage });
    }

    remove(label) {
        this.props.onRemove(label);
        this.setState({ showRemove: false });
    }

    handleAddSubmit(event) {
        if (event.key !== 'Enter')
            return;
        const { label, percentage } = this.state;
        if (this.props.onAdd(label, percentage)) // only return if successfully added
            this.setState({ adding: false, label: '', percentage: '' });
    }

    renderRemoveModal = () => (
        <Modal
            isOpen={this.state.showRemove}
            onRequestClose={() => this.setState({ showRemove: false })}
            style={modalStyle}
        >
            <h1 className='RemoveModalTitle'>Remove Slice</h1>
            <div className='RemoveModalContainer'>
                {this.props.removableLabels.map((label, index) => (
                    <button
                        className='ChangerRemoveButton'
                        key={index}
                        onClick={() => this.remove(label)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </Modal>
    );

    renderAddInputs = () => (
        <div className='ChangerInputs'>
            <input
                className='ChangerTextInput'
                type='text'
                placeholder='Label'
                value={this.state.label}
                onChange={this.updateLabel}
                onKeyPress={this.handleAddSubmit}
            />
            <input
                className='ChangerTextInput'
                type='number'
                placeholder='Percentage'
                value={this.state.percentage}
                onChange={this.updatePercentage}
                onKeyPress={this.handleAddSubmit}
            />
        </div>
    );

    renderDefault = () => (
        <div className='ChangerButtonsContainer'>
            <button
                className='ChangerButton'
                onClick={() => this.setState({ adding: true })}>Add</button>
            <button
                className='ChangerButton'
                onClick={() => this.setState({ showRemove: true })}>Remove</button>
        </div>
    );

    renderBackButton = () => (
        <div
            className='ChangerBackArrow'
            onClick={() => this.setState({ adding: false })}
        >
            <i className='fa fa-chevron-left'/>
        </div>
    );

    render = () => (
        <div className='ChangerContainer'>
            {this.renderRemoveModal()}
            {this.state.adding  && this.renderBackButton()}
            {this.state.adding  && this.renderAddInputs()}
            {!this.state.adding && this.renderDefault()}
        </div>
    );
}
