import React, { PureComponent } from 'react';
import { StyleSheet, StatusBar, View, ScrollView } from 'react-native';

import { connect } from 'react-redux';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CoverArt from '../element/CoverArt.js';
import Marquee from '../element/Marquee.js';
import HR from '../element/HR.js';
import ProgressBar from '../element/ProgressBar.js';
import InfoBar from '../element/InfoBar.js';
import Controls from '../element/Controls.js';
import Text from '../element/Text.js';

import Queue from './Queue.js';
import List from './List.js';
import Info from './Info.js';

import { UpdateMetadata } from '../audio.js';
import { ConnectSocket } from '../websocket.js';

const mapStateToProps = state => {
    return {
        currentSong: state.reducer.currentSong,
        jp: state.storageReducer.jp,
        theme: state.storageReducer.theme
    };
}

const Tab = createMaterialTopTabNavigator();

class MainInterface extends PureComponent {
    constructor() {
        super();
    }

    componentDidMount() {
        ConnectSocket();
    }

    render() {
        let title = this.props.currentSong.title || '';
        let artist = this.props.currentSong.artist || '';
        let tags = this.props.currentSong.tags || '';

        if (!this.props.jp) {
            if (this.props.currentSong.en) {
                title = this.props.currentSong.en.title || title;
                artist = this.props.currentSong.en.artist || artist;
                tags = this.props.currentSong.en.tags || tags;
            }
        }

        let coverArt = '';
        if (this.props.currentSong.options)
            if (this.props.currentSong.options.coverArtArchive)
                coverArt = `https://coverartarchive.org/release/${this.props.currentSong.options.coverArtArchive}/front`

        UpdateMetadata({ title, artist, tags, coverArt });

        return (
            <>
                <StatusBar translucent backgroundColor={ `rgba(${this.props.theme.background}, 0.9)` } barStyle={ this.props.theme.barStyle } />
                <ScrollView style={{ backgroundColor: `rgb(${this.props.theme.background})` }}>
                    <View style={ styles.inner }>
                        <CoverArt source={ coverArt } />
                        <HR />
                        <Marquee><Text h1 style={{ color: `rgb(${this.props.theme.foreground})` }}>{ title }</Text></Marquee>
                        <Marquee><Text h2 style={{ color: `rgb(${this.props.theme.highlight})`, fontFamily: 'NotoSansJP-Regular' }}>{ artist }</Text></Marquee>
                        <HR />
                        <Marquee><Text h3 style={{ color: `rgb(${this.props.theme.foreground})`, fontFamily: 'NotoSansJP-Regular' }}>{ tags }</Text></Marquee>
                        <ProgressBar />
                        <InfoBar />
                        <Controls />
                        <HR />
                        <Tab.Navigator
                        tabBarOptions={{
                            indicatorStyle: {
                                backgroundColor: `rgb(${this.props.theme.foreground})`
                            },
                            labelStyle: {
                                color: `rgb(${this.props.theme.foreground})`,
                                    fontFamily: 'NotoSansJP-Regular',
                                    includeFontPadding: false
                            },
                            style: {
                                elevation: 0,
                                backgroundColor: `rgb(${this.props.theme.background})`
                            }
                        }}
                        sceneContainerStyle={{
                            backgroundColor: `rgb(${this.props.theme.background})`,
                            marginLeft: 7,
                            marginRight: 7
                        }}>
                            <Tab.Screen name="Queue" component={ Queue } />
                            <Tab.Screen name="List" component={ List } />
                            <Tab.Screen name="Info" component={ Info } />
                        </Tab.Navigator>
                    </View>
                </ScrollView>
            </>
        );
    }
};

const styles = StyleSheet.create({
    inner: {
        margin: 15,
        marginTop: 15 + StatusBar.currentHeight
    }
});

export default connect(mapStateToProps)(MainInterface);
