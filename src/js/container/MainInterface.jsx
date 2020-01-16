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
import Textbox from '../element/Textbox.jsx';
import { FetchList } from '../../websocket.js';

const mapStateToProps = state => {
    return {
        currentSong: state.currentSong,
        stats: state.stats,
        list: state.list,
        top: state.top,
        new: state.new
    }
};

class MainInterface extends Component {
    constructor() {
        super();
    }

    fetchList(e) {
        FetchList(e.target.value);
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
                <>
                    <Textbox placeholder='Filter...' onInput={ this.fetchList } />
                    <hr />
                    <List list={ this.props.list } />
                </>
            ],
            [
                <svg style={{ width: '24px', height: '24px' }} viewBox='0 0 24 24'>
                    <path fill="#202020" d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                </svg>,
                <List list={ this.props.top } />
            ],
            [
                <svg style={{ width: '24px', height: '24px' }} viewBox='0 0 24 24'>
                    <path fill='currentColor' d='M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z' />
                </svg>,
                <List list={ this.props.new } />
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
                </div> ]
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
