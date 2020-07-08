import React, { Component } from 'react';
import ReactNative from 'react-native';

class Text extends Component {
    constructor() {
        super()
    }

    render() {
        let fontSize = 14;
        let fontWeight = '400';
        let fontFamily = 'NotoSansJP-Regular';

        if (this.props.h1) {
            fontSize = 35;
            fontWeight = '600';
            fontFamily = 'NotoSansJP-Medium';
        }
        else if (this.props.h2) {
            fontSize = 28;
            fontWeight = '600';
            fontFamily = 'NotoSansJP-Medium';
        }
        else if (this.props.h3) {
            fontSize = 17.5;
            fontWeight = '600';
            fontFamily = 'NotoSansJP-Medium';
        }
        else if (this.props.h4)
            fontSize = 14;

        return <ReactNative.Text style={{ includeFontPadding: false, fontSize, fontWeight, fontFamily, ...this.props.style }}>{ this.props.children }</ReactNative.Text>
    }
}

export default Text;
