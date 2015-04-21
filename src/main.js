import Vue from 'vue';
import {Mixer, Oscillator, OUT, NOTES} from 'lib/audio';

function code(e) {
    e = e || window.event;
    return (e.keyCode || e.which);
}
var keys = new Mixer([
        NOTES.C4,
        NOTES.Db4,
        NOTES.D4,
        NOTES.Eb4,
        NOTES.E4,
        NOTES.F4,
        NOTES.Gb4,
        NOTES.G4,
        NOTES.Ab4,
        NOTES.A5,
        NOTES.Bb5,
        NOTES.B5,
        NOTES.C5,
        NOTES.Db5,
        NOTES.D5,
        NOTES.Eb5,
        NOTES.E5,
        NOTES.F5,
        NOTES.Gb5,
        NOTES.G5,
        NOTES.Ab5,
        NOTES.A6
    ].map(note => new Mixer([
			new Oscillator('sine', note*0.5),
            new Oscillator('sawtooth', note)
        ])),
    OUT);
keys.setAllInGain(0);
keys.setOutGain(0.5);

var vm = new Vue({
    el: '#main',
    data: {
    },
    ready: function() {
        document.onkeydown = function(e){
            console.log(e);
            switch(code(e)) {
                case 90:
                    keys.setInGain(0, 1);
                    break;
                case 83:
                    keys.setInGain(1, 1);
                    break;
                case 88:
                    keys.setInGain(2, 1);
                    break;
                case 68:
                    keys.setInGain(3, 1);
                    break;
                case 67:
                    keys.setInGain(4, 1);
                    break;
                case 86:
                    keys.setInGain(5, 1);
                    break;
                case 71:
                    keys.setInGain(6, 1);
                    break;
                case 66:
                    keys.setInGain(7, 1);
                    break;
                case 72:
                    keys.setInGain(8, 1);
                    break;
                case 78:
                    keys.setInGain(9, 1);
                    break;
                case 74:
                    keys.setInGain(10, 1);
                    break;
                case 77:
                    keys.setInGain(11, 1);
                    break;
                case 188:
                    keys.setInGain(12, 1);
                    break;
                case 76:
                    keys.setInGain(13, 1);
                    break;
                case 190:
                    keys.setInGain(14, 1);
                    break;
                case 190:
                    keys.setInGain(15, 1);
                    break;
                case 186:
                    keys.setInGain(16, 1);
                    break;
                case 191:
                    keys.setInGain(17, 1);
                    break;
            }
        };
        document.onkeyup = function(e){
            switch(code(e)) {
                case 90:
                    keys.setInGain(0, 0);
                    break;
                case 83:
                    keys.setInGain(1, 0);
                    break;
                case 88:
                    keys.setInGain(2, 0);
                    break;
                case 68:
                    keys.setInGain(3, 0);
                    break;
                case 67:
                    keys.setInGain(4, 0);
                    break;
                case 86:
                    keys.setInGain(5, 0);
                    break;
                case 71:
                    keys.setInGain(6, 0);
                    break;
                case 66:
                    keys.setInGain(7, 0);
                    break;
                case 72:
                    keys.setInGain(8, 0);
                    break;
                case 78:
                    keys.setInGain(9, 0);
                    break;
                case 74:
                    keys.setInGain(10, 0);
                    break;
                case 77:
                    keys.setInGain(11, 0);
                    break;
                case 188:
                    keys.setInGain(12, 0);
                    break;
                case 76:
                    keys.setInGain(13, 0);
                    break;
                case 190:
                    keys.setInGain(14, 0);
                    break;
                case 190:
                    keys.setInGain(15, 0);
                    break;
                case 186:
                    keys.setInGain(16, 0);
                    break;
                case 191:
                    keys.setInGain(17, 0);
                    break;
            }
        };
    }
});