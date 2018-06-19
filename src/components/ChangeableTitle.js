import React, { PureComponent, PropTypes } from 'react';
import './../styles/ChangeableTitle.css';

export default class ChangeableTitle extends PureComponent {
    static propTypes = { defaultTitle: PropTypes.string }
    static defaultProps = { defaultTitle: 'Title' }

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.defaultTitle,
            changing: false,
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateTitle(event) {
        this.setState({ title: event.target.value });
    }

    handleSubmit(event) {
        if (event.key !== 'Enter')
            return;
        let { title } = this.state;
        if (_.isEmpty(title))
            title = this.props.defaultTitle;
        this.setState({ changing: false, title })
    }

    renderTitleChanger = () => (
        <input
            className='TitleChanger'
            autoFocus
            type='text'
            placeholder='Chart name'
            value={this.state.title}
            onChange={this.updateTitle}
            onKeyPress={this.handleSubmit}
        />
    );

    renderTitle = () => (
        <div
            className='Title'
            onClick={() => this.setState({ changing: true })}
        >
            {this.state.title}
        </div>
    );

    render = () =>
        this.state.changing ? this.renderTitleChanger() : this.renderTitle()
}
