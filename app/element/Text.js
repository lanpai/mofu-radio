import React, { PureComponent } from 'react';
import ReactNative from 'react-native';

class Text extends PureComponent {
    constructor() {
        super()
    }

    render() {
        let fontSize = 14;
        let fontWeight = '400';
        let fontFamily = 'NotoSansJP-Regular';
        let marginLeft = 0;

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
        else if (this.props.li)
            marginLeft = 15

        return <ReactNative.Text style={{ includeFontPadding: false, fontSize, fontWeight, fontFamily, marginLeft, ...this.props.style }}>{ this.props.li ? '▹ ' + this.props.children : this.props.children }</ReactNative.Text>
    }
}

export default Text;
