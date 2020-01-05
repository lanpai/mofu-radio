import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/CurrentSong.scss';

import { ToggleJP } from '../../actions.js';
import Marquee from '../container/Marquee.jsx';

const mapStateToProps = state => {
    return {
        playing: state.playing,
        jp: state.jp,
        currentSong: state.currentSong,
        stats: state.stats
    }
};

class CurrentSong extends Component {
    constructor() {
        super();
    }

    render() {
        let metadata = {
            artist: this.props.currentSong.artist || '',
            title: this.props.currentSong.title || '',
            tags: this.props.currentSong.tags || '',
        };

        if (!this.props.jp && this.props.currentSong.en) {
            metadata = {
                artist: this.props.currentSong.en.artist || metadata.artist,
                title: this.props.currentSong.en.title || metadata.title,
                tags: this.props.currentSong.en.tags || metadata.tags,
            };
        }

        let albumArt = '';
        if (this.props.currentSong.options)
            albumArt = `https://coverartarchive.org/release/${this.props.currentSong.options.coverArtArchive}/front`

        document.getElementById('background').children[0].style.backgroundImage = `url(${albumArt})`;

        let lang = 'en';
        if (this.props.jp)
            lang = 'jp';

        return (
            <>
                <figure className={ this.props.playing ? 'albumArt' : 'albumArt grayscale' }>
                    <img src={ albumArt } />
                </figure>
                <hr />
                <Marquee>
                    <h1 style={{ height: '5vh' }}>
                        { metadata.title }
                    </h1>
                </Marquee>
                <Marquee>
                    <h2 style={{ fontWeight: 'normal', color: 'deeppink', height: '4vh' }}>
                        { metadata.artist }
                    </h2>
                </Marquee>
                <hr />
                <Marquee enabled={ true } style={{ height: '3vh', margin: '0 0 2vh 0' }}>
                    <h3 style={{ margin: 0, fontWeight: 'normal', textAlign: 'center' }}>
                        { metadata.tags }
                    </h3>
                </Marquee>

                <div style={{ float: 'left' }}>
                    <svg style={{ width: '2vh', height: '2vh', marginBottom: '-0.35vh' }} viewBox='0 0 24 24'>
                        <path d='M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 16.97,1 12,1Z' />
                    </svg>
                    &nbsp;
                    <span style={{ fontSize: '2vh', lineHeight: '3vh' }}>{ this.props.stats.listeners }</span>
                </div>
                <span style={{ fontSize: '2vh', lineHeight: '3vh', float: 'right' }} className='button' onClick={ ToggleJP }>{ lang }</span>
            </>

        );
    }
}

export default connect(mapStateToProps)(CurrentSong);
