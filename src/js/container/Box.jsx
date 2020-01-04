import React, { Component } from 'react';

import css from '../../css/container/Box.scss';

class Box extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='box' style={ this.props.style }>
                { this.props.children }
            </div>
        );
    }
}

export default Box;
