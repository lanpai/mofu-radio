import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/CurrentSong.scss';

import { ToggleJP } from '../../actions.js';

import Marquee from './Marquee.jsx';

const mapStateToProps = state => {
    return {
        playing: state.playing,
        jp: state.jp,
        currentSong: state.currentSong,
        stats: state.stats
    }
};

class CurrentSong extends PureComponent {
    constructor() {
        super();
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            if (this.props.currentSong) {
                let value = (Date.now() - this.props.currentSong.start) / 1000;
                let percentage = Math.max(100 * value / this.props.currentSong.estDuration, 0);
                document.getElementById('playhead').style.width = `${percentage}%`;
            }
        }, 1000);
    }

    render() {
        let artist = this.props.currentSong.artist || '';
        let title = this.props.currentSong.title || '';
        let tags = this.props.currentSong.tags || '';

        if (!this.props.jp && this.props.currentSong.en) {
            artist = this.props.currentSong.en.artist || artist;
            title = this.props.currentSong.en.title || title;
            tags = this.props.currentSong.en.tags || tags;
        }

        let albumArt = this.props.currentSong.options ?
            `https://coverartarchive.org/release/${this.props.currentSong.options.coverArtArchive}/front` :
            '/default.png'


        document.getElementById('background').children[0].style.backgroundImage = `url(${albumArt})`;
        document.title = `${title} by ${artist} (mofu-radio)`;

        return (
            <>
                <figure className={ this.props.playing ? 'albumArt' : 'albumArt grayscale' }>
                    <img
                        src={ albumArt }
                        onError={ (e) => { e.currentTarget.src = '/default.png' }}
                    />
                </figure>
                <hr />
                <Marquee>
                    <h1>
                        { title }
                    </h1>
                </Marquee>
                <Marquee>
                    <h2 style={{ fontWeight: 'normal', color: 'RGB(var(--highlight))' }}>
                        { artist }
                    </h2>
                </Marquee>
                <hr />
                <Marquee enabled={ true } style={{ margin: '0 0 1em' }}>
                    <h3 style={{ margin: 0, fontWeight: 'normal', textAlign: 'center' }}>
                        { tags }
                    </h3>
                </Marquee>

                <div className='playhead-container'>
                    <div id='playhead'>
                    </div>
                </div>

                <div style={{ float: 'left' }}>
                    <svg style={{ width: '1em', height: '1em', marginBottom: '-0.2em' }} viewBox='0 0 24 24'>
                        <path fill='RGB(var(--foreground))' d='M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 16.97,1 12,1Z' />
                    </svg>
                    &nbsp;
                    <span>{ this.props.stats.listeners }</span>
                </div>

                <span style={{ float: 'right' }} className='button' onClick={ ToggleJP }>
                    { this.props.jp ? 'jp' : 'en' }
                </span>
            </>

        );
    }
}

export default connect(mapStateToProps)(CurrentSong);
