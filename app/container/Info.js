import React, { Component } from 'react';
import { StyleSheet, Linking, View } from 'react-native';

import { connect } from 'react-redux';

import HR from '../element/HR.js';
import Themer from '../element/Themer.js';
import Text from '../element/Text.js';

const mapStateToProps = state => {
    return {
        theme: state.storageReducer.theme
    };
};

class Info extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <HR />
                <View style={ styles.section }>
                    <Text h3 style={{ color: `rgb(${this.props.theme.foreground})` }}>Theme</Text>
                    <HR />
                    <Themer />
                </View>
                <View style={ styles.section }>
                    <Text h3 style={{ color: `rgb(${this.props.theme.foreground})` }}>Contact</Text>
                    <HR />
                    <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }} onPress={() => Linking.openURL('mailto:radio@piyo.cafe')}>radio@piyo.cafe</Text>
                    <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://github.com/lanpai/mofu-radio/issues')}>Bug Reports</Text>
                    <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://forms.gle/mp3qZX9hEwnhm53V6')}>Song Request Form</Text>
                </View>
                <Text style={{ color: `rgb(${this.props.theme.foreground})`, textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://mofu.piyo.cafe')}>mofu.piyo.cafe</Text>
                <Text style={{ color: `rgb(${this.props.theme.foreground})`, fontStyle: 'italic' }}>made with love by lanpai</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20
    }
});

export default connect(mapStateToProps)(Info);
