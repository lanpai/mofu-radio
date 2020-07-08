import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { Svg, Path } from 'react-native-svg';

import { TogglePlay, ToggleFavorite } from '../actions.js';

const mapStateToProps = state => {
    return {
        currentSong: state.reducer.currentSong,
        playing: state.reducer.playing,
        favorites: state.storageReducer.favorites,
        theme: state.storageReducer.theme
    };
};

class Controls extends Component {
    constructor() {
        super();
    }

    render() {
        const PLAY_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.highlight})` } d='M8,5.14V19.14L19,12.14L8,5.14Z'/>
            </Svg>
        );
        const PAUSE_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.highlight})` } d='M14,19H18V5H14M6,19H10V5H6V19Z'/>
            </Svg>
        );

        let playPause = this.props.playing ? PAUSE_SVG : PLAY_SVG;

        const UNFAVORITED_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.highlight})` } d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M9.75,7.82C8.21,7.82 7,9.03 7,10.57C7,12.46 8.7,14 11.28,16.34L12,17L12.72,16.34C15.3,14 17,12.46 17,10.57C17,9.03 15.79,7.82 14.25,7.82C13.38,7.82 12.55,8.23 12,8.87C11.45,8.23 10.62,7.82 9.75,7.82Z' />
            </Svg>
        );
        const FAVORITED_SVG = (
            <Svg style={ styles.svg } viewBox='0 0 24 24'>
                <Path fill={ `rgb(${this.props.theme.highlight})` } d='M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9.75,7.82C10.62,7.82 11.45,8.23 12,8.87C12.55,8.23 13.38,7.82 14.25,7.82C15.79,7.82 17,9.03 17,10.57C17,12.46 15.3,14 12.72,16.34L12,17L11.28,16.34C8.7,14 7,12.46 7,10.57C7,9.03 8.21,7.82 9.75,7.82Z' />
            </Svg>
        );

        let favoriteButton = this.props.favorites.includes(this.props.currentSong.id) ? FAVORITED_SVG : UNFAVORITED_SVG;

        return (
            <View style={ styles.controls }>
                <View style={ styles.icon }>
                    <TouchableOpacity onPress={() => TogglePlay() }>
                        { playPause }
                    </TouchableOpacity>
                </View>
                <View style={{ ...styles.icon, opacity: 0.2 }}>
                    <Svg style={ styles.svg } viewBox='0 0 24 24'>
                        <Path fill={ `rgb(${this.props.theme.midground})` } d='M5,5V19H8V5M10,5V19L21,12'/>
                    </Svg>
                </View>
                <View style={ styles.icon }>
                    <TouchableOpacity onPress={() => ToggleFavorite(this.props.currentSong.id) }>
                        { favoriteButton }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    controls: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 7,
        marginBottom: 7
    },
    icon: {
        flex: 1,
        alignItems: 'center'
    },
    svg: {
        width: 35,
        height: 35,
        opacity: 0.75
    }
});

export default connect(mapStateToProps)(Controls);
