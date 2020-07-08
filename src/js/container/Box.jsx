import React, { PureComponent } from 'react';

import css from '../../css/container/Box.scss';

class Box extends PureComponent {
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
