import React, { PureComponent } from 'react';

import css from '../../css/container/Tabs.scss';

class Tabs extends PureComponent {
    constructor() {
        super();

        this.state = {
            selected: 0
        };
    }

    render() {
        let buttonList = [];
        let tabList = [];
        for (let i = 0; i < this.props.config.length; i++) {
            buttonList.push(
                <div key={ i } className={ this.state.selected === i ? 'active button' : 'button' } onClick={ () => this.setState({ selected: i }) }>
                    <h3>
                        { this.props.config[i][0] }
                    </h3>
                </div>
            );
            tabList.push(
                <div key={ i } className={ this.state.selected === i ? 'active tab' : 'tab' }>
                    { this.props.config[i][1] }
                </div>
            );
        }

        return (
            <>
                <div className='flex-row' style={{ textAlign: 'center' }}>
                    { buttonList }
                </div>
                <hr />
                <div className='tabParent'>
                    { tabList }
                </div>
            </>
        );
    }
}

export default Tabs;
