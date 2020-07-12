import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import css from '../../css/element/Submission.scss';

const mapStateToProps = state => {
    return {
        theme: state.theme
    }
}

class Submission extends PureComponent {
    constructor () {
        super();

        this.state = {
            fileString: 'No file selected',
            disabled: false
        };
    }

    submit() {
        let formData = new FormData(document.getElementById('submission'));

        if (formData.get('file').name.trim() === '') {
            alert('Submission requires a file!');
            return;
        }
        if (formData.get('file').size / 1048576 > 50) {
            alert('Submission file may not exceed 50MB');
            return;
        }
        if (formData.get('artist').trim() === '') {
            alert('Submission requires an artist!');
            return;
        }
        if (formData.get('title').trim() === '') {
            alert('Submissiong requires a title!');
            return;
        }
        if (formData.get('type') !== 'addition' && formData.get('type') !== 'submission') {
            alert('Submission requires a type!');
            return;
        }

        let req = new XMLHttpRequest();
        req.open('POST', '/api/submit', true);

        req.onload = (e) => {
            if (req.status === 200) {
                alert(req.responseText);
            }
            else if (req.status === 429) {
                alert(req.responseText);
            }
            else {
                alert('Error ' + req.status + ' (This may be a bug! Report it @ https://github.com/lanpai/mofu-radio/issues)');
            }
            this.setState({ disabled: false });
        }

        req.send(formData);
        this.setState({ disabled: true });
    }

    clear() {
        let form = document.getElementById('submission');
        form.reset();
        this.setState({
            fileString: 'No file selected'
        });
    }

    onFileChange(e) {
        this.setState({
            fileString: e.target.files[0].name
        });
    }

    render() {
        return (
            <details>
                <summary className='button'><h3>Song Submission Form</h3></summary>
                <hr />
                <form id='submission' style={ this.state.disabled ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                    <h4>Select File (MP3/FLAC)</h4>
                    <input name='file' id='submission-file' type='file' accept='.mp3,.flac' onChange={(e) => this.onFileChange(e)} />
                    <label className='button-box' for='submission-file'>Browse</label><br />
                    <small>{ this.state.fileString }</small><br />
                    <br />
                    <h4>Metadata</h4>
                    <input name='artist' type='text' placeholder='Artist (eg. 桐生萌郁 (cv.後藤沙緒里))' /><br />
                    <input name='title' type='text' placeholder='Title (eg. To Be Loved)' /><br />
                    <input name='tags' type='text' placeholder='Tags (Optional) (eg. STEINS;GATE)' /><br />
                    <br />
                    <h4>Submission Type</h4>
                    <input name='type' id='submission-addition' type='radio' value='addition' />
                    <label for='submission-addition'>New Addition</label><br />
                    <input name='type' id='submission-replacement' type='radio' value='replacement' />
                    <label for='submission-replacement'>Replacement</label><br />
                    <br />
                    <input name='musicbrainz' type='text' placeholder='Musicbrainz Release ID (Optional)' /><br />
                    <input name='comments' type='text' placeholder='Additional Comments (Optional)' /><br />
                    <br />
                    <input name='bypass' type='text' placeholder='Cooldown Bypass (Optional)' /><br />
                    <br />
                    <small style={{ color: 'RGB(var(--highlight))' }}>Check if the song has already been added!</small><br />
                    <span className='button-box' onClick={() => this.submit()}>Submit</span>
                    <span className='button-box' onClick={() => this.clear()}>Clear</span><br />
                    <br />
                    <h4>Conventions</h4>
                    <ul>
                        <li><small>For MP3's, provide a 320kbps file unless absolutely necessary</small></li>
                        <li><small>Metadata should be JP unless officially released in EN</small></li>
                        <li><small>Artist and title taken from album release</small></li>
                        <li><small>MusicBrainz release ID is for album art, if a release doesn't have album art feel free to update their databases</small></li>
                        <li><small>Release ID's can be found at the end the url of a release (eg. .../release/822f63d6-36a5-4bec-ba49-eb5bd7e5bc7f) (Not to be mistaken with a release-group)</small></li>
                        <li><small>Tags taken from MAL, vndb, or official release title</small></li>
                        <li><small>Updated list of unique tags:</small></li>
                        <ul>
                            <li><small>東方Project/Touhou Project</small></li>
                            <li><small>ボーカロイド/Vocaloid</small></li>
                            <li><small>VOICEROID</small></li>
                            <li><small>ブイチューバー/VTuber</small></li>
                        </ul>
                    </ul>
                </form>
            </details>
        );
    }
}

export default connect(mapStateToProps)(Submission);
