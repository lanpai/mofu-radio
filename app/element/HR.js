import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        theme: state.storageReducer.theme
    };
};

class HR extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return <View style={{ ...styles.hr, borderBottomColor: `rgb(${this.props.theme.foreground})` }} />
    }
}

const styles = StyleSheet.create({
    hr: {
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 5,
        marginBottom: 5,
        opacity: 0.3
    }
});

export default connect(mapStateToProps)(HR);
