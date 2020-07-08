import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/Queue.scss';

import Marquee from '../container/Marquee.jsx';

const mapStateToProps = state => {
    return {
        jp: state.jp,
        queue: state.queue
    }
};

class Queue extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                { this.props.queue.map((song) => {
                    let artist = song.artist || '';
                    let title = song.title || '';
                    let tags = song.tags || '';

                    if (!this.props.jp) {
                        artist = song.en.artist || artist;
                        title = song.en.title || title;
                        tags = song.en.tags || tags;
                    }

                    return (
                        <div key={ song.id }>
                            <Marquee>
                                <h3>{ title }</h3>
                            </Marquee>
                            <Marquee>
                                <h3 style={{ fontWeight: 'normal', color: 'RGB(var(--highlight))' }}>
                                    { artist }
                                </h3>
                            </Marquee>
                            <Marquee>
                                <span style={{ display: 'block' }}>
                                    { tags }
                                </span>
                            </Marquee>
                            <hr />
                        </div>
                    );
                })}
            </>
        );
    }
}

export default connect(mapStateToProps)(Queue);
