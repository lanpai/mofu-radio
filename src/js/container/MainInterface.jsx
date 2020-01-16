import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/container/MainInterface.scss';

import Box from './Box.jsx';
import Marquee from './Marquee.jsx';

import CurrentSong from '../element/CurrentSong.jsx';
import Controls from '../element/Controls.jsx';
import Tabs from './Tabs.jsx';
import Queue from '../element/Queue.jsx';
import List from '../element/List.jsx';

const mapStateToProps = state => {
    return {
        currentSong: state.currentSong,
        stats: state.stats
    }
};

class MainInterface extends Component {
    constructor() {
        super();
    }

    render() {
        const tabsConfig = [
            [
                <svg style={{ width: '2.5vh', height:'2.5vh' }} viewBox='0 0 24 24'>
                    <path fill='#202020' d='M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z' />
                </svg>,
                <Queue />
            ],
            [
                <svg style={{ width: '2.5vh', height: '2.5vh' }} viewBox='0 0 24 24'>
                    <path fill='#202020' d='M18,13H17.32L15.32,15H17.23L19,17H5L6.78,15H8.83L6.83,13H6L3,16V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V16L18,13M17,7.95L12.05,12.9L8.5,9.36L13.46,4.41L17,7.95M12.76,2.29L6.39,8.66C6,9.05 6,9.68 6.39,10.07L11.34,15C11.73,15.41 12.36,15.41 12.75,15L19.11,8.66C19.5,8.27 19.5,7.64 19.11,7.25L14.16,2.3C13.78,1.9 13.15,1.9 12.76,2.29Z' />
                </svg>,
                <List />
            ],
            [
                <svg style={{ width: '2.5vh', height: '2.5vh' }} viewBox='0 0 24 24'>
                    <path fill='#202020' d='M13,12H20V13.5H13M13,9.5H20V11H13M13,14.5H20V16H13M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M21,19H12V6H21' />
                </svg>,
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
                </div>
            ]
        ];
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
