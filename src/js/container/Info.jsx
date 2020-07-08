import React, { PureComponent } from 'react';

import Themer from '../element/Themer.jsx';

class Info extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Themer />
                <hr />
                <details>
                    <summary className='button'><h3>Advanced Filter</h3></summary>
                    <hr />
                    <p>The search system includes advanced filtering using the id, artist, title, tags keys.</p>
                    <h4>Examples</h4>
                    <ul>
                        <li>artist:&quot;Itou Kanako&quot; tags:STEINS;GATE</li>
                        <li>tags:K-On dont say</li>
                        <li>id:45,87,65</li>
                    </ul>
                </details>
                <hr />
                <details open>
                    <summary className='button'><h3>Stream Info</h3></summary>
                    <hr />
                    <h4>Links</h4>
                    <ul>
                        <li><a href='stream.mp3' target='_blank'>Direct Link</a></li>
                        <li><a href='stream.m3u' target='_blank'>.m3u Playlist</a></li>
                        <li><a href='stream.pls' target='_blank'>.pls Playlist</a></li>
                    </ul>
                </details>
                <hr />
                <details open>
                    <summary className='button'><h3>Song Request Form</h3></summary>
                    <hr />
                    <p>Google Forms: <a href='https://forms.gle/mp3qZX9hEwnhm53V6' target='_blank'>https:&#x2F;&#x2F;forms.gle&#x2F;mp3qZX9hEwnhm53V6</a></p>
                </details>
                <hr />
                <br />
                <a href='mailto:radio@piyo.cafe'>radio@piyo.cafe</a>
                <br />
                <a href='/privacy-policy.html'>Privacy Policy</a>
                <br />
                <br />
                <i>made with ♥ by lanpai</i>
            </div>
        );
    }
}

export default Info;
