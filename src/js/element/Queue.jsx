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
        let queue = [];
        for (let song of this.props.queue) {
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

            queue.push(
                <div key={ song.id }>
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
                    <hr />
                </div>
            );
        }

        return (
            <>
                { queue }
            </>
        );
    }
}

export default connect(mapStateToProps)(Queue);
