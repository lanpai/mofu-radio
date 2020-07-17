import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { Svg, Path } from 'react-native-svg';

import Marquee from '../element/Marquee.js';
import HR from '../element/HR.js';
import Song from '../element/Song.js';
import Text from '../element/Text.js';

import { FetchList, RequestSong } from '../websocket.js';

const mapStateToProps = state => {
    return {
        jp: state.storageReducer.jp,
        list: state.reducer.list,
        favorites: state.storageReducer.favorites,
        queue: state.reducer.queue,
        theme: state.storageReducer.theme
    };
};

class List extends Component {
    constructor() {
        super();

        this.state = {
            type: 'new'
        };
        this.filter = '';

        this.fetchList = this.fetchList.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.setType = this.setType.bind(this);
        this.timeout = null;
    }

    fetchList(type) {
        let filter = this.filter;
        switch (type) {
            case 'top':
                filter = 'sort:top ' + filter;
                break;
            case 'favorites':
                let favorites = this.props.favorites.join(',');
                filter = 'id:' + favorites + ' ' + filter;
                break;
            case 'new':
                filter = 'sort:new ' + filter;
                break;
            case 'recent':
                filter = 'sort:recent stride:' + (this.props.queue.length + 1) + ' ' + filter;
        }
        FetchList(filter);
    }

    onSearch(text) {
        if (this.timeout !== null)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(this.fetchList.bind(null, this.state.type), 100);
        this.filter = text;
    }

    setType(type) {
        if (this.state.type !== type) {
            this.fetchList(type);
            this.setState({ type: type });
        }
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.favorites !== this.props.favorites && this.state.type === 'favorites') ||
            (prevProps.queue !== this.props.queue && this.state.type === 'recent'))
            this.fetchList(this.state.type);
    }

    shouldComponentUpdate(prevProps) {
        if (prevProps.list !== this.props.list ||
            (prevProps.favorites !== this.props.favorites && this.state.type === 'favorites') ||
            (prevProps.queue !== this.props.queue && this.state.type === 'recent') ||
            prevProps.theme !== this.props.theme)
            return true;
        return false;
    }

    render() {
        return (
            <ScrollView>
                <HR />
                <View style={ styles.filterView }>
                    <TextInput onChangeText={text => this.onSearch(text)} placeholderTextColor={ `rgb(${this.props.theme.foreground})` } placeholder='Filter' style={{ ...styles.textInput, color: `rgb(${this.props.theme.foreground})` }} />
                    <View style='icon' style={{ opacity: this.state.type === 'new' ? 1.0 : 0.6 }}>
                        <TouchableOpacity onPress={() => this.setType('new') }>
                            <Svg  viewBox='0 0 24 24' style={ styles.svg }>
                                <Path fill={ `rgb(${this.props.theme.foreground})` } d='M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z' />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <View style='icon' style={{ opacity: this.state.type === 'recent' ? 1.0 : 0.6 }}>
                        <TouchableOpacity onPress={() => this.setType('recent') }>
                            <Svg  viewBox='0 0 24 24' style={ styles.svg }>
                                <Path fill={ `rgb(${this.props.theme.foreground})` } d='M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3' />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <View style='icon' style={{ opacity: this.state.type === 'top' ? 1.0 : 0.6 }}>
                        <TouchableOpacity onPress={() => this.setType('top') }>
                            <Svg  viewBox='0 0 24 24' style={ styles.svg }>
                                <Path fill={ `rgb(${this.props.theme.foreground})` } d=' M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z' />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                    <View style='icon' style={{ opacity: this.state.type === 'favorites' ? 1.0 : 0.6 }}>
                        <TouchableOpacity onPress={() => this.setType('favorites') }>
                            <Svg  viewBox='0 0 24 24' style={ styles.svg }>
                                <Path fill={ `rgb(${this.props.theme.foreground})` } d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                </View>
                <HR />
                { this.props.list.map((song) => {
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

const styles = StyleSheet.create({
    filterView: {
        flexDirection: 'row',
        margin: 5
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        includeFontPadding: false,
        padding: 0,
        opacity: 0.6,
        fontFamily: 'NotoSansJP-Regular'
    },
    icon: {
        flex: 0
    },
    svg: {
        width: 21,
        height: 21,
        marginTop: 2
    }
});

export default connect(mapStateToProps)(List);
