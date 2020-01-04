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
    [ 'request', <Request /> ]
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
            </div>
        );
    }
}

export default connect(mapStateToProps)(MainInterface);
