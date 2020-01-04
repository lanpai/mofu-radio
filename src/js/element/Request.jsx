import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/Request.scss';

import Marquee from '../container/Marquee.jsx';
import Textbox from './Textbox.jsx';
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
            request: []
        };
    }

    fetchList(e) {
        FetchList(e.target.value);
    }

    render() {
        let list = [];
        for (let song of this.props.list) {
            let metadata = {
                artist: song.artist || '',
                title: song.title || '',
            };

            if (!this.props.jp) {
                metadata = {
                    artist: song.en.artist || metadata.artist,
                    title: song.en.title || metadata.title,
                };
            }

            list.push(
                <div key={ song.id }>
                    <Marquee>
                        <h3>{ metadata.title }</h3>
                    </Marquee>
                    <Marquee>
                        <h3 style={{ fontWeight: 'normal', color: 'deeppink' }}>
                            { metadata.artist }
                        </h3>
                    </Marquee>
                    <h3 className='button' onClick={ () => RequestSong(song.id) }>Request</h3>
                    <hr />
                </div>
            );
        }

        return (
            <>
                <Textbox placeholder='Filter...' onInput={ this.fetchList } />
                <hr />
                <div>
                    { list }
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(Request);

