import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { UpdateTheme } from '../actions.js';
import { MOMO, RIAJUU, MATCHA, MOCHA, DUSK } from '../themes.js';

import Text from './Text.js';

const mapStateToProps = state => {
    return {
        theme: state.storageReducer.theme
    };
};

const THEMES = {
    'momo': MOMO,
    'riajuu': RIAJUU,
    'matcha': MATCHA,
    'mocha': MOCHA,
    'dusk': DUSK
};

class Themer extends PureComponent {
    constructor() {
        super();
    }

    render() {
        let themes = [];

        for (let theme in THEMES) {
            themes.push(
                <TouchableOpacity key={ theme } style={ styles.theme } onPress={() => UpdateTheme(THEMES[theme])}>
                    <Text li style={{ color: `rgb(${this.props.theme.foreground})` }}>{ theme }</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View>
                <Text h4 style={{ color: `rgb(${this.props.theme.foreground})` }}>Presets</Text>
                { themes }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    theme: {
        opacity: 0.75
    }
});

export default connect(mapStateToProps)(Themer);
