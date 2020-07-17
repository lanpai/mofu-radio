import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { connect } from 'react-redux';

import { UpdateTheme } from '../actions.js';
import { MOMO, RIAJUU, MATCHA, MOCHA, DUSK } from '../themes.js';

import Text from './Text.js';

const THEMES = {
    MOMO,
    RIAJUU,
    MATCHA,
    MOCHA,
    DUSK
};

const mapStateToProps = state => {
    return {
        theme: state.storageReducer.theme
    };
};

class Themer extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <DropDownPicker
                items={ Object.keys(THEMES).map((theme) => { return { label: theme, value: theme } }) }
                defaultValue={ this.props.theme.name || 'MOMO' }
                style={{ ...styles.picker, backgroundColor: `rgb(${this.props.theme.background})`, borderColor: `rgb(${this.props.theme.foreground})` }}
                dropDownStyle={{ backgroundColor: `rgb(${this.props.theme.background})`, borderColor: `rgb(${this.props.theme.foreground})` }}
                labelStyle={{ ...styles.label, color: `rgb(${this.props.theme.foreground})` }}
                itemStyle={{ paddingVertical: 0 }}
                dropDownMaxHeight={ 500 }
                placeholder='Select a theme'
                showArrow={ false }
                onChangeItem={(theme) => UpdateTheme(THEMES[theme.value])}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    picker: {
        borderWidth: StyleSheet.hairlineWidth,
    },
    label: {
        fontFamily: 'NotoSansJP-Regular',
        fontSize: 14,
        includeFontPadding: false,
        textAlign: 'left',
        width: '100%'
    }
});

export default connect(mapStateToProps)(Themer);
