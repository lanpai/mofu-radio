import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import css from '../../css/element/Marquee.scss';

class Marquee extends Component {
    constructor() {
        super();

        this.state = {
            isOverflowing: false
        };
    }

    checkOverflow() {
        let _this = this;
        window.requestAnimationFrame(function onFrameRendered() {
            if (ReactDOM.findDOMNode(_this.refs.subdiv))
                _this.setState({
                    isOverflowing:
                        ReactDOM.findDOMNode(_this.refs.subdiv).children[0].scrollWidth >
                        ReactDOM.findDOMNode(_this).offsetWidth
                });
        });
    }

    componentDidMount() {
        this.checkOverflow();
    }

    componentDidUpdate() {
        if (this.state.children !== this.props.children) {
            this.state.children = this.props.children;
            this.checkOverflow();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isOverflowing !== this.state.isOverflowing ||
            nextProps.children !== this.props.children)
            return true;
        return false;
    }

    render() {
        return (
            <div
                className={ this.props.enabled || this.state.isOverflowing ? 'marquee active' : 'marquee' }
                style={ this.props.style }
            >
                <div ref='subdiv'>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default Marquee;
