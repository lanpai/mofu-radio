import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        currentSong: state.reducer.currentSong,
        theme: state.storageReducer.theme
    };
};

class ProgressBar extends Component {
    constructor() {
        super();

        this.state = {
            progress: 0
        };
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            if (this.props.currentSong) {
                let value = (Date.now() - this.props.currentSong.start) / 1000;
                let percentage = Math.max(value / this.props.currentSong.estDuration, 0);
                this.setState({ progress: percentage });
            }
        }, 1000);
    }

    render() {
        return (
            <View style={{ ...styles.progressBar, backgroundColor: `rgba(${this.props.theme.midground}, 0.2)` }}>
                <View style={{ ...styles.playhead, backgroundColor: `rgb(${this.props.theme.highlight})`, width: `${this.state.progress * 100}%` }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    progressBar: {
        borderRadius: 10,
        width: '100%',
        height: 9,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 10,
        opacity: 0.6
    },
    playhead: {
        height: '100%'
    }
});

export default connect(mapStateToProps)(ProgressBar);
