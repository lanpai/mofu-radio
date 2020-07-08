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
                <div className={ this.props.playing ? 'albumArt' : 'albumArt grayscale' }>
                    <img
                        src={ albumArt }
                        onError={ (e) => { e.currentTarget.src = '/default.png' }}
                    />
                </div>
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

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div>
                        <svg style={{ width: '1em', height: '1em', marginBottom: '-0.175em' }} viewBox='0 0 24 24'>
                            <path fill='RGB(var(--foreground))' d='M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 16.97,1 12,1Z' />
                        </svg>
                        &nbsp;
                        <span>{ this.props.stats.listeners }</span>
                    </div>
                    <div className='button' onClick={ ToggleJP }>
                        <svg style={{ width: '1em', height: '1em', marginBottom: '-0.175em' }} viewBox='0 0 24 24'>
                            <path fill='RGB(var(--foreground))' d='M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z' />
                        </svg>
                        &nbsp;
                        <span>
                            { this.props.jp ? 'JP' : 'EN' }
                        </span>
                    </div>
                </div>
            </>

        );
    }
}

export default connect(mapStateToProps)(CurrentSong);
