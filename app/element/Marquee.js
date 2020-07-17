import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';

class Marquee extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={ styles.marquee }>
                { this.props.children }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    marquee: {
    }
});

export default Marquee;
