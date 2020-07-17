import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { Svg, Path } from 'react-native-svg';

import { ToggleJP } from '../actions.js';

const mapStateToProps = state => {
    return {
        jp: state.storageReducer.jp,
        listeners: state.reducer.stats.listeners,
        theme: state.storageReducer.theme
    };
};

class InfoBar extends PureComponent {
    constructor() {
        super();
    }

    render() {
        let lang = 'EN';
        if (this.props.jp)
            lang = 'JP';

        return (
            <View style={ styles.infoBar }>
                <View style={ styles.info }>
                    <Svg style={ styles.svg } viewBox='0 0 24 24'>
                        <Path fill={ `rgb(${this.props.theme.foreground})` } d='M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 16.97,1 12,1Z' />
                    </Svg>
                    <Text style={{ color: `rgb(${this.props.theme.foreground})` }}>{ this.props.listeners }</Text>
                </View>
                <View style={ styles.info }>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => ToggleJP()}>
                        <Svg style={ styles.svg } viewBox='0 0 24 24'>
                            <Path fill={ `rgb(${this.props.theme.foreground})` } d='M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z' />
                        </Svg>
                        <Text style={{ color: `rgb(${this.props.theme.foreground})` }}>{ lang }</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    infoBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    info: {
        flex: 0,
        flexDirection: 'row'
    },
    svg: {
        width: 16,
        height: 16,
        marginTop: 3,
        marginRight: 2
    }
});

export default connect(mapStateToProps)(InfoBar);
