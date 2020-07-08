import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/container/List.scss';

import { FetchList } from '../../websocket.js';

import Marquee from '../element/Marquee.jsx';
import Song from '../element/Song.jsx';

const mapStateToProps = state => {
    return {
        list: state.list,
        favorites: state.favorites,
        queueLength: state.queue.length
    }
};

class List extends Component {
    constructor() {
        super();

        this.state = {
            type: 'recent'
        };
        this.filter = '';

        this.onSearch = this.onSearch.bind(this);
        this.fetchList = this.fetchList.bind(this);
        this.setType = this.setType.bind(this);
        this.timeout = null;
    }

    fetchList(type) {
        let filter = this.filter;
        switch (type) {
            case 'top':
                filter = 'sort:top ' + filter;
                break;
            case 'favorites':
                let favorites = this.props.favorites.join(',');
                filter = 'id:' + favorites + ' ' + filter;
                break;
            case 'new':
                filter = 'sort:new ' + filter;
                break;
            case 'recent':
                filter = 'sort:recent stride:' + (this.props.queueLength + 1) + ' ' + filter;
                break;
        }

        FetchList(filter);
    }

    onSearch(e) {
        if (this.timeout !== null)
            clearTimeout(this.timeout);

        this.timeout = setTimeout(this.fetchList.bind(null, this.state.type), 100);
        this.filter = e.target.value;
    }

    setType(type) {
        this.setState({ type: type });
        this.fetchList(type);
    }

    componentDidUpdate(prevProps) {
        if (this.state.type === 'favorites' && prevProps.favorites !== this.props.favorites)
            this.fetchList(this.state.type);
    }

    shouldComponentUpdate(prevProps) {
        if (prevProps.list !== this.props.list ||
            (prevProps.favorites !== this.props.favorites && this.state.type === 'favorites') ||
            (prevProps.queueLength !== this.props.queueLength && this.state.type === 'recent'))
            return true;
        return false;
    }

    render() {
        return (
            <>
                <div className='filter'>
                    <div>
                        <input type='text' placeholder='Filter' onInput={ this.onSearch } />
                        <div className={ this.state.type === 'recent' ? 'button active' : 'button' } onClick={ () => { this.setType('recent') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='RGB(var(--foreground))' d='M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'new' ? 'button active' : 'button' } onClick={ () => { this.setType('new') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='RGB(var(--foreground))' d='M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'top' ? 'button active' : 'button' } onClick={ () => { this.setType('top') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='RGB(var(--foreground))' d='M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z' />
                            </svg>
                        </div>
                        <div className={ this.state.type === 'favorites' ? 'button active' : 'button' } onClick={ () => { this.setType('favorites') } }>
                            <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                <path fill='RGB(var(--foreground))' d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />;
                            </svg>
                        </div>
                    </div>
                    <hr />
                </div>
                <div>
                    { this.props.list.map((song) => {
                        return (
                            <Song
                                key={ song.id }
                                meta={{
                                    id: song.id,
                                    artist: song.artist,
                                    title: song.title,
                                    tags: song.tags,
                                    en: song.en
                                }}
                                controls
                            />
                        );
                    })}
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(List);

