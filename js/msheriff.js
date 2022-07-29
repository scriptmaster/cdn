// ... ... ... PLEASE HELP IN CONTINOUS FUNDING, INFRASTRUCTURE REQUIREMENTS AND CONNECTED TEAMS

class MSheriff {
    npm = 'https://cdn.jsdelivr.net/npm/';
    github = 'https://cdn.jsdelivr.net/gh/';

    libThree = this.npm + 'three/';
    lib3examples = this.libThree + 'examples/js/';

    libs = {
        'three': this.npm + 'three',
        'dat.gui': this.npm + 'dat.gui',
        'orbitcontrols': this.lib3examples + 'controls/OrbitControls.min.js',
        'pointercontrols': this.lib3examples + 'controls/PointerControls.min.js',
        'stats': this.lib3examples + 'libs/stats.min.js',
    }

    libSrc(libName) {
        const libnm = libName.toLowerCase();
        if(this.libs[libnm]) return this.libs[libnm];
        if(libName.startsWith('npm:')) return this.npm + libName.substring(4);
        if(libName.startsWith('gh:')) return this.github + libName.substring(3);
        return libName;
    }

    importsMax = 0;
    importsPending = 0;
    importLib(libName, callback) {
        // We won't use import module - no we won't - it has lots of disadvantages / very slow productivity..
        const libsrc = this.libSrc(libName);
        // console.log(libName, libsrc)
        if(libsrc) {
            this.progressShow();
            ++this.importsPending;
            this.importsMax = Math.max(this.importsMax, this.importsPending);
            const script = this.cE('script', {src: libsrc, async: false});
            console.log(script);
            script.onload = () => {
                --this.importsPending;
                // console.log('script completed loading', script, this.importsPending);
                callback();
                this.progress(100 - Math.round(100 * (this.importsPending / this.importsMax)),
                    this.importsMax, 
                    this.importsPending);
                if(this.importsPending == 0 && this.readyResolve) {
                    this.readyResolve();
                    this.progressDone();
                }
            }
            this.aC(script);
        }
    }
 
    // $(id){ return document.querySelector? document.querySelector('#'+id): document.getElementById(id) }
    id = id => document.getElementById(id);
    $ = s => document.querySelector(s);
    $$ = s => document.querySelectorAll(s);
    cE = (e, a) => { e = document.createElement(e); for(var i in a){e[i]=a[i]} return e; }
    aC = (c, p) => (p || document.body).appendChild(c);
    on = (el, ev, cb) => (el || window).addEventListener(ev, cb);
    domready = cb => on(window, 'DOMContentLoaded', cb);
    //display = (el, perc) => new Anim(el, ['opacDisplay']).to(perc)

    importGroups = 0;
    percents = [0, 40, 75, 95, 100];
    //overridable
    progressShow() {
        // default is to splash in the element on the element fullscreen
        console.log('progress show');
        var loaderEl = this.$('#MSheriff');
        if(!loaderEl) {
            loaderEl = this.cE('div', {id: 'MSheriff'})
            this.aC(loaderEl);
        }
        loaderEl.style.display = '';

        if(this.importsMax == 0) {
            this.progress(100, 0, 0);
        }
        if(this.importsPending == 0) {
            this.importGroups++;
        }
    }

    //overridable
    progress(progress, pending, total) {
        // console.log('progress::', progress, this.importGroups, this.percents[this.importGroups]);
        const r = (this.percents[this.importGroups + 1] || 100) - this.percents[this.importGroups];
        console.log('progress: ', this.importGroups, this.percents[this.importGroups + 1], this.percents[this.importGroups], ' + ', r)
        progress = this.percents[this.importGroups] + Math.round(r * progress / 100);
        const ps = this.$$('.MSheriff_progress');
        const p = ps[ps.length - 1];
        const loaderEl = this.$('#MSheriff');
        if(p) {
            p.style.width = progress + '%';
            //p.innerHTML = progress + '%';
        }
        if(loaderEl) loaderEl.style.display = '';
        console.log('progress:', progress);
    }

    // overridable
    progressDone() {
        // default is to fadeOut and remove the element;
        var loaderEl = this.$('#MSheriff');
        if(loaderEl) {
            // this.display(loaderEl, 0);
            setTimeout(() => {if(!this.importsPending) loaderEl.style.display = 'none'}, 200)
            //loaderEl.style.display = 'none';
            //loaderEl.style.opacity = 0;
        }
        console.log('Achieved');
    }

    readyResolve = null;
    async ready() {
        return new Promise((resolve, reject) => {
            this.readyResolve = resolve;
        });
    }

    constructor() {
        // var scripts = document.getElementsByTagName('script');
        var scripts = this.$$('script');
        Array.prototype.forEach.call(scripts, s => {
            const i = s.src.indexOf('/loader.js');
            if(i > -1) {
                const q =  s.src.indexOf('?');
                if(q == -1) setTimeout(this._callInits.bind(this), 60);
                else this.importLoaderLibs(s.src.substring(q + 1));
            }
        })
    }

    async importLoaderLibs(libs) {
        libs = libs.split(',')
        console.log('libs', libs);
        libs.forEach(lib => this.importLib(lib, function(){}));
        await this.ready();
        this._callInits();
    }

    _callInits() {
        this.inits.forEach(i => i.call(this))
    }

    inits = [];
    init(fn) {
        this.inits.push(fn);
    }
}

const S = new MSheriff();
