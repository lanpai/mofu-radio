import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UpdateTheme } from '../../actions.js';
import { DEFAULT_THEME, RIAJUU, MATCHA, MOCHA, DUSK } from '../../themes.js';

const mapStateToProps = state => {
    return {
        theme: state.theme
    }
};

class Themer extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <h3>Theme</h3>
                <hr />
                <h4>Presets</h4>
                <ul>
                    <li><span className='button' onClick={ () => UpdateTheme(DEFAULT_THEME) }>momo</span></li>
                    <li><span className='button' onClick={ () => UpdateTheme(RIAJUU) }>riajuu</span></li>
                    <li><span className='button' onClick={ () => UpdateTheme(MATCHA) }>matcha</span></li>
                    <li><span className='button' onClick={ () => UpdateTheme(MOCHA) }>mocha</span></li>
                    <li><span className='button' onClick={ () => UpdateTheme(DUSK) }>dusk</span></li>
                </ul>
            </>
        )
    }
}

export default connect(mapStateToProps)(Themer);
