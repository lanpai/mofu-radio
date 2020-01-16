import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import css from '../../css/element/List.scss';

import Marquee from '../container/Marquee.jsx';
import { FetchList, RequestSong } from '../../websocket.js';

const mapStateToProps = state => {
    return {
        jp: state.jp,
        list: state.list
    }
};

class Request extends Component {
    constructor() {
        super();

        this.state = {
            type: 'new'
        };
        this.filter = '';

        this.fetchList = this.fetchList.bind(this);
        this.setType = this.setType.bind(this);
        this.timeout = null;
    }

    fetchList(e) {
        if (this.timeout !== null)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(FetchList.bind(null, e.target.value), 100);
        this.filter = e.target.value;
    }

    setType(type) {
        this.setState({ type: type });
    }

    render() {
        let list = [];
        let source = this.props.list;
        switch (this.state.type) {
            case 'top':
                source = _.sortBy(source, [ 'timesReq' ]).filter(song => { return song.timesReq > 0 }).reverse();
                break;
            case 'new':
                source = _.sortBy(source, [ 'id' ]).reverse();
                break;
        }
        let currentLength = source.length;
        if (this.filter !== '*')
            source = _.take(source, 20);
        for (let song of source) {
            let metadata = {
                artist: song.artist || '',
                title: song.title || '',
                tags: song.tags || ''
            };

            if (!this.props.jp) {
                metadata = {
                    artist: song.en.artist || metadata.artist,
                    title: song.en.title || metadata.title,
                    tags: song.en.tags || metadata.tags
                };
            }

            list.push(
                <>
                    <div key={ song.id } className='song'>
                        <div style={{ width: 'calc(100% - 2.5vh)' }}>
                            <Marquee>
                                <h3>{ metadata.title }</h3>
                            </Marquee>
                            <Marquee>
                                <h3 style={{ fontWeight: 'normal', color: 'deeppink' }}>
                                    { metadata.artist }
                                </h3>
                            </Marquee>
                            <Marquee>
                                <h3 style={{ fontSize: '1.6vh', lineHeight: '2.6vh', fontWeight: 'normal' }}>
                                    { metadata.tags }
                                </h3>
                            </Marquee>
                        </div>
                        <div className='button' onClick={ () => RequestSong(song.id) }>
                            <svg style={{ width: '2.5vh', height: '2.5vh' }} viewBox='0 0 24 24'>
                                <path fill='#202020' d='M19,11H15V15H13V11H9V9H13V5H15V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z' />
                            </svg>
                        </div>
                    </div>
                    <hr />
                </>
            );
        }
        if (source.length < currentLength) {
            list.push(
                <>
                    <i>and { currentLength - source.length } more... (Filter for '*' for all results)</i>
                </>
            );
        }

        return (
            <>
                <div className='filter'>
                    <div>
                        <input type='text' placeholder='Filter' onInput={ this.fetchList } />
                        <div className={ this.state.type === 'new' ? 'button active' : 'button' } onClick={ () => { this.setType('new') } }>
                            <svg style={{ width: '2.5vh', height: '2.5vh' }} viewBox='0 0 24 24'>
                                <path fill='currentColor' d='M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'top' ? 'button active' : 'button' } onClick={ () => { this.setType('top') } }>
                            <svg style={{ width: '2.5vh', height: '2.5vh' }} viewBox='0 0 24 24'>
                                <path fill='#202020' d='M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z' />
                            </svg>
                        </div>
                    </div>
                    <hr />
                </div>
                <div>
                    { list }
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(Request);

