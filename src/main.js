import 'lib/util';
import Vue from 'vue';
import {OUT, OfflineAudioContext, audioCtx} from 'lib/audio/context';
import {Oscillator, Mixer, Modulator, StereoPanner} from 'lib/audio/components';
import {KeyboardPiano} from 'lib/audio/interfaces';
import {Genome, SelectorGene, UniformFloatGene} from 'lib/genetics';

var synthGenome = new Genome({
    //modFreqFactor: new UniformFloatGene(0.9, 1.1, 0.001),
    modFreqFactor: new UniformFloatGene(1.0, 1.0, 0),
    modDelay: new UniformFloatGene(0, 0.001, 0.0001),
    modGain: new UniformFloatGene(0, 400, 10),

    modFreqFactor2: new UniformFloatGene(1.0, 1.0, 0.01),
    modDelay2: new UniformFloatGene(0, 0.001, 0.0001),
    modGain2: new UniformFloatGene(0, 400, 10),

    sinMix: new UniformFloatGene(0, 1, 0.1),
    sawMix: new UniformFloatGene(0, 1, 0.1),
    sqrMix: new UniformFloatGene(0, 1, 0.1)
});

class Synth {
    constructor(note, params = null, ctx = audioCtx) {
        this.note = note;
        this.modulator = new Modulator('sine', null, 0, null, ctx);
        this.modulator2 = new Modulator('sine', null, 0, null, ctx);
        this.carrier = new Mixer([
            new Oscillator('sine', note, ctx),
            new Oscillator('sawtooth', note, ctx),
            new Oscillator('square', note, ctx)
        ].map(o => {
                this.modulator.connect(o.frequency);
                this.modulator2.connect(o.frequency);
                return o;
            }), ctx);
        if (params) this.set(params);
    }
    connect(dest) {
        this.carrier.connect(dest);
    }
    set(params) {
        params.forEach(f => {
            switch (f.key) {
                case 'modFreqFactor':
                    this.modulator.setFreq(f.value * this.note);
                    break;
                case 'modDelay':
                    this.modulator.setDelay(f.value);
                    break;
                case 'modGain':
                    this.modulator.setGain(f.value);
                    break;

                case 'modFreqFactor2':
                    this.modulator2.setFreq(f.value * this.note);
                    break;
                case 'modDelay2':
                    this.modulator2.setDelay(f.value);
                    break;
                case 'modGain2':
                    this.modulator2.setGain(f.value);
                    break;

                case 'sinMix':
                    this.carrier.setInGain(0, f.value);
                    break;
                case 'sawMix':
                    this.carrier.setInGain(1, f.value);
                    break;
                case 'sqrMix':
                    this.carrier.setInGain(2, f.value);
                    break;
            }
        });
    }
}

function renderSynthOffline(note, params, length = 0.02) {
    let ctx = new OfflineAudioContext(1, 44100 * length, 44100);
    let synth = new Synth(note, params, ctx);
    synth.connect(ctx.destination);
    return ctx.startRendering();
}

var keySynths = [];

var vm = new Vue({
    el: '#main',
    data: {
        params: {},
        graphLength: 0.02
    },
    ready() {
        this.randomize();

        let keys = new KeyboardPiano(note => {
            let s = new Synth(note);
            keySynths.push(s);
            return s;
        }, -2, true);
        keys.connect(OUT);

        document.onkeydown = (e) => keys.keyDown(e);
        document.onkeyup   = (e) => keys.keyUp(e);

        this.$watch('params', this.updateSynth, true, true);
        this.$watch('graphLength', this.drawWaveform);
    },
    methods: {
        updateSynth(params) {
            keySynths.forEach(s => s.set(params.map(a => a.value.value)));
            this.drawWaveform();
        },
        randomize() {
            this.params = synthGenome.generate().map(a => {
                return {
                    value: a.value,
                    gene: synthGenome.genes[a.key]
                };
            });
        },
        mutate() {
            let n = Math.randomIntInRange(1, 4);
            synthGenome.mutate(this.params.map(a => a.value.value), n).forEach(a => this.params[a.key].value = a.value);
        },
        drawWaveform() {
            let canvas = this.$$.waveformCanvas;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgb(50, 50, 50)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(80, 150, 250)';
            ctx.beginPath();
            renderSynthOffline(440, this.params.map(a => a.value.value), this.graphLength).then(buffer => {
                let data = buffer.getChannelData(0);
                let sliceWidth = canvas.width * 1.0 / data.length;
                var x = 0;
                for(var i = 0; i < data.length; i++) {
                    var v = (data[i]+1.0) / 2.0;
                    var y = (v * canvas.height/2) + canvas.height/4;
                    if(i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                ctx.lineTo(canvas.width, canvas.height/2);
                ctx.stroke();
            });
        }
    }
});
