import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { UpdateCoverArt } from '../audio.js';

class CoverArt extends PureComponent {
    constructor() {
        super();

        this.state = {
            source: 'https://mofu.piyo.cafe/default.png'
        };
    }

    componentDidMount() {
        if (this.props.source)
            this.setState({ source: this.props.source });
    }

    componentDidUpdate(prevProps) {
        if (this.props.source)
            if (prevProps.source !== this.props.source)
                this.setState({ source: this.props.source });
    }

    render() {
        let source = this.state.source;

        UpdateCoverArt(source);

        return (
            <View style={ styles.coverArt } onError={() => this.setState({ source: 'https://mofu.piyo.cafe/default.png' })}>
                <Image resizeMode='contain' style={ styles.image } source={{ uri: source }} />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    coverArt: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        alignItems: 'center',
        elevation: 12,
        marginBottom: 15
    },
    image: {
        borderRadius: 20,
        width: '100%',
        height: '100%'
    }
});

export default CoverArt;
