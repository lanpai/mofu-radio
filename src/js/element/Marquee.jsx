import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import css from '../../css/container/Marquee.scss';

class Marquee extends PureComponent {
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