import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { Svg, Path } from 'react-native-svg';

import Text from './Text.js';
import Marquee from './Marquee.js';

import { ToggleFavorite } from '../actions.js';
import { RequestSong } from '../websocket.js';

const mapStateToProps = state => {
    return {
        favorites: state.storageReducer.favorites,
        theme: state.storageReducer.theme
    };
};

class Song extends Component {
    constructor() {
        super();
    }

    render() {
        const UNFAVORITED_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.foreground})` } d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M9.75,7.82C8.21,7.82 7,9.03 7,10.57C7,12.46 8.7,14 11.28,16.34L12,17L12.72,16.34C15.3,14 17,12.46 17,10.57C17,9.03 15.79,7.82 14.25,7.82C13.38,7.82 12.55,8.23 12,8.87C11.45,8.23 10.62,7.82 9.75,7.82Z' />
            </Svg>
        );
        const FAVORITED_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.foreground})` } d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />
            </Svg>
        );

        let favoriteButton = this.props.favorites.includes(this.props.id) ? FAVORITED_SVG : UNFAVORITED_SVG;

        return (
            <View style={ styles.song }>
                <View style={ styles.info }>
                    <Marquee><Text h3 style={{ color: `rgb(${this.props.theme.foreground})` }}>{ this.props.title }</Text></Marquee>
                    <Marquee><Text h3 style={{ color: `rgb(${this.props.theme.highlight})` }}>{ this.props.artist }</Text></Marquee>
                    <Marquee><Text style={{ color: `rgb(${this.props.theme.foreground})` }}>{ this.props.tags }</Text></Marquee>
                </View>
                <View style={ styles.icon }>
                    <TouchableOpacity onPress={() => ToggleFavorite(this.props.id)}>
                        { favoriteButton }
                    </TouchableOpacity>
                </View>
                <View style={ styles.icon }>
                    <TouchableOpacity onPress={() => RequestSong(this.props.id)}>
                        <Svg style={ styles.svg } viewBox='0 0 24 24'>
                            <Path fill={ `rgb(${this.props.theme.foreground})` } d='M19,11H15V15H13V11H9V9H13V5H15V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z' />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    song: {
        flexDirection: 'row',
        marginRight: 5
    },
    info: {
        flex: 1
    },
    icon: {
        flex: 0
    },
    svg: {
        width: 21,
        height: 21,
        opacity: 0.75,
        marginTop: 5
    }
});

export default connect(mapStateToProps)(Song);
