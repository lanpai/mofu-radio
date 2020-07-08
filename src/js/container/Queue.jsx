import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import css from '../../css/container/Queue.scss';

import Marquee from '../element/Marquee.jsx';
import Song from '../element/Song.jsx';

const mapStateToProps = state => {
    return {
        queue: state.queue
    }
};

class Queue extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                { this.props.queue.map((song) => {
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
                        />
                    );
                })}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Queue);
