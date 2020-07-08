import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/Song.scss';

import { RequestSong } from '../../websocket.js';
import { ToggleFavorite } from '../../actions.js';

import Marquee from './Marquee.jsx';

const mapStateToProps = state => {
    return {
        jp: state.jp,
        favorites: state.favorites
    }
}

class Song extends PureComponent {
    constructor () {
        super();
    }

    render() {
        return (
            <div key={ this.props.key }>
                <div className='songFlex'>
                    <div className='songMetadata'>
                        <Marquee>
                            <h3 className='songArtist'>
                                { this.props.jp ? this.props.meta.title : this.props.meta.en.title || this.props.meta.title }
                            </h3>
                        </Marquee>
                        <Marquee>
                            <h3 className='songTitle'>
                                { this.props.jp ? this.props.meta.artist : this.props.meta.en.artist || this.props.meta.artist }
                            </h3>
                        </Marquee>
                        <Marquee>
                            <span className='songTags'>
                                { this.props.jp ? this.props.meta.tags : this.props.meta.en.tags || this.props.meta.tags }
                            </span>
                        </Marquee>
                    </div>
                    { this.props.controls &&
                        <>
                            <div className='button songIcon' onClick={ () => ToggleFavorite(this.props.meta.id) }>
                                <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                    { this.props.favorites.includes(this.props.meta.id) ?
                                        <path fill='RGB(var(--foreground))' d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' /> :
                                        <path fill='RGB(var(--foreground))' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M9.75,7.82C8.21,7.82 7,9.03 7,10.57C7,12.46 8.7,14 11.28,16.34L12,17L12.72,16.34C15.3,14 17,12.46 17,10.57C17,9.03 15.79,7.82 14.25,7.82C13.38,7.82 12.55,8.23 12,8.87C11.45,8.23 10.62,7.82 9.75,7.82Z' />
                                    }
                                </svg>
                            </div>
                            <div className='button songIcon' onClick={ () => RequestSong(this.props.meta.id) }>
                                <svg style={{ width: '1.5em', height: '1.5em' }} viewBox='0 0 24 24'>
                                    <path fill='RGB(var(--foreground))' d='M19,11H15V15H13V11H9V9H13V5H15V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z' />
                                </svg>
                            </div>
                        </>
                    }
                </div>
                <hr />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Song);
