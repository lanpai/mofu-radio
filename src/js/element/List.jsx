import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import css from '../../css/element/List.scss';

import Marquee from '../container/Marquee.jsx';
import { FetchList, RequestSong } from '../../websocket.js';
import { ToggleFavorite } from '../../actions.js';

const mapStateToProps = state => {
    return {
        jp: state.jp,
        list: state.list,
        favorites: state.favorites
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
            case 'favorites':
                source = _.filter(source, song => {
                    for (let id of this.props.favorites)
                        if (song.id == id)
                            return true;
                    return false;
                });
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

            let favoriteButton = <path fill='#202020' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M9.75,7.82C8.21,7.82 7,9.03 7,10.57C7,12.46 8.7,14 11.28,16.34L12,17L12.72,16.34C15.3,14 17,12.46 17,10.57C17,9.03 15.79,7.82 14.25,7.82C13.38,7.82 12.55,8.23 12,8.87C11.45,8.23 10.62,7.82 9.75,7.82Z' />;
            if (this.props.favorites.indexOf(song.id) != -1)
                favoriteButton = <path fill='#202020' d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />;

            list.push(
                <>
                    <div key={ song.id } className='song'>
                        <div style={{ width: 'calc(100% - 3em)' }}>
                            <Marquee>
                                <h3>{ metadata.title }</h3>
                            </Marquee>
                            <Marquee>
                                <h3 style={{ fontWeight: 'normal', color: 'deeppink' }}>
                                    { metadata.artist }
                                </h3>
                            </Marquee>
                            <Marquee>
                                <span>
                                    { metadata.tags }
                                </span>
                            </Marquee>
                        </div>
                        <div className='button' onClick={ () => ToggleFavorite(song.id) }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                { favoriteButton }
                            </svg>
                        </div>
                        <div className='button' onClick={ () => RequestSong(song.id) }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
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
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='currentColor' d='M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'top' ? 'button active' : 'button' } onClick={ () => { this.setType('top') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='#202020' d='M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'favorites' ? 'button active' : 'button' } onClick={ () => { this.setType('favorites') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='#202020' d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />;
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

