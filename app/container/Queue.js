import React, { PureComponent } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { connect } from 'react-redux';

import Marquee from '../element/Marquee.js';
import HR from '../element/HR.js';
import Song from '../element/Song.js';

const mapStateToProps = state => {
    return {
        jp: state.storageReducer.jp,
        queue: state.reducer.queue
    };
};

class Queue extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <ScrollView>
                <HR />
                { this.props.queue.map((song) => {
                    let title = song.title;
                    let artist = song.artist;
                    let tags = song.tags;

                    if (!this.props.jp) {
                        if (song.en) {
                            title = song.en.title || title;
                            artist = song.en.artist || artist;
                            tags = song.en.tags || tags;
                        }
                    }

                    return (
                        <View key={ song.id }>
                            <Song id={ song.id } title={ title } artist={ artist } tags={ tags } />
                            <HR />
                        </View>
                    );
                })}
            </ScrollView>
        );
    }
};

export default connect(mapStateToProps)(Queue);
