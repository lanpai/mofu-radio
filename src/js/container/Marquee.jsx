import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import css from '../../css/container/Marquee.scss';

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

    render() {
        let enabled = false;
        if (this.props.enabled || this.state.isOverflowing)
            enabled = true;

        return (
            <div className={ enabled ? 'marquee active' : 'marquee' } style={ this.props.style }>
                <div ref='subdiv'>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default Marquee;
