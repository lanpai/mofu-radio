import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import css from '../../css/element/Textbox.scss';

class Textbox extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='textbox' style={ this.props.style }>
                <input ref='filter' type='text' placeholder={ this.props.placeholder } onInput={ this.props.onInput } />
            </div>
        );
    }
}

export default Textbox;
