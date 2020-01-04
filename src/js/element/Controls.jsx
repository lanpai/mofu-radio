import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/Controls.scss';

import { TogglePlay } from '../../actions.js';

const mapStateToProps = state => {
    return {
        playing: state.playing
    }
};

class Controls extends Component {
    constructor() {
        super();
    }

    onPlayToggle() {
        TogglePlay();
    }

    render() {
        let toggleButton = <path fill='deeppink' d='M8,5.14V19.14L19,12.14L8,5.14Z' />;
        if (this.props.playing)
            toggleButton = <path fill='deeppink' d='M14,19H18V5H14M6,19H10V5H6V19Z' />;

        return (
            <div className='flex-row'>
                <div className='icon button' onClick={ this.onPlayToggle }>
                    <svg style={{ width: '4vh', height: '4vh' }} viewBox='0 0 24 24'>
                        { toggleButton }
                    </svg>
                </div>
                <div className='icon button'>
                    <svg style={{ width: '4vh', height: '4vh' }} viewBox='0 0 24 24'>
                        <path fill='deeppink' d='M5,5V19H8V5M10,5V19L21,12' />
                    </svg>
                </div>
                <div className='icon button'>
                    <svg style={{ width: '4vh', height: '4vh' }} viewBox='0 0 24 24'>
                        <path fill='deeppink' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M9.75,7.82C8.21,7.82 7,9.03 7,10.57C7,12.46 8.7,14 11.28,16.34L12,17L12.72,16.34C15.3,14 17,12.46 17,10.57C17,9.03 15.79,7.82 14.25,7.82C13.38,7.82 12.55,8.23 12,8.87C11.45,8.23 10.62,7.82 9.75,7.82Z' />
                    </svg>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Controls);
