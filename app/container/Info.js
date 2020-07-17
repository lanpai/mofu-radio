import React, { PureComponent } from 'react';
import { StyleSheet, Linking, View, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import HR from '../element/HR.js';
import Themer from '../element/Themer.js';
import Text from '../element/Text.js';

const mapStateToProps = state => {
    return {
        theme: state.storageReducer.theme
    };
};

class Info extends PureComponent {
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
                    <Text h3 style={{ color: `rgb(${this.props.theme.foreground})` }}>Advanced Filter</Text>
                    <HR />
                <Text style={{ color: `rgb(${this.props.theme.foreground})` }}>The search system includes advanced filtering using the id, artist, title, tags keys.</Text>
                <Text h4 style={{ color: `rgb(${this.props.theme.foreground})` }}>Examples</Text>
                <Text li style={{ color: `rgb(${this.props.theme.foreground})` }}>artist:"Itou Kanako" tags:STEINS;GATE</Text>
                <Text li style={{ color: `rgb(${this.props.theme.foreground})` }}>tags:K-On dont say</Text>
                <Text li style={{ color: `rgb(${this.props.theme.foreground})` }}>id:45,87,65</Text>
                </View>
                <View style={ styles.section }>
                    <HR />
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:radio@piyo.cafe')}>
                        <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }}>radio@piyo.cafe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/lanpai/mofu-radio/issues')}>
                        <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }}>Bug Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://forms.gle/mp3qZX9hEwnhm53V6')}>
                    <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }}>Song Request Form</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://mofu.piyo.cafe/privacy-policy.html')}>
                    <Text style={{ color: `rgb(${this.props.theme.highlight})`, textDecorationLine: 'underline' }}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL('https://mofu.piyo.cafe')}>
                    <Text style={{ color: `rgb(${this.props.theme.foreground})`, textDecorationLine: 'underline' }}>mofu.piyo.cafe</Text>
                </TouchableOpacity>
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
