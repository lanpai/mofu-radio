import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/container/MainInterface.scss';

import Box from './Box.jsx';
import Marquee from './Marquee.jsx';

import CurrentSong from '../element/CurrentSong.jsx';
import Controls from '../element/Controls.jsx';
import Tabs from './Tabs.jsx';
import Queue from '../element/Queue.jsx';
import Request from '../element/Request.jsx';

const mapStateToProps = state => {
    return {
        currentSong: state.currentSong,
        stats: state.stats
    }
};

const tabsConfig = [
    [ 'queue', <Queue /> ],
    [ 'request', <Request /> ],
    [ 'info',
        <div style={{ textAlign: 'center' }}>
            <h3>Song Request Form</h3>
            <a href='https://forms.gle/mp3qZX9hEwnhm53V6'>https://forms.gle/mp3qZX9hEwnhm53V6</a>
            <br />
            <br />
            <h3>GitHub</h3>
            <a href='https://github.com/lanpai/mofu-radio'>https://github.com/lanpai/mofu-radio</a>
            <br />
            <br />
            <i>made with ♥ by lanpai</i>
        </div> ]
];

class MainInterface extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='flex-col'>
                <div className='flex-row collapsible two-col'>
                    <div className='flex-col'>
                        <Box>
                            <CurrentSong />
                        </Box>
                        <Box>
                            <Controls />
                        </Box>
                    </div>
                    <div className='flex-col'>
                        <Box style={{ flex: '1 0 0' }}>
                            <Tabs config={ tabsConfig } />
                        </Box>
                    </div>
                </div>
                <Box style={{ width: 'calc(100% - 4vh)', textAlign: 'center' }}>
                    <div className='flex-row collapsible'>
                    </div>
                </Box>
            </div>
        );
    }
}

export default connect(mapStateToProps)(MainInterface);
