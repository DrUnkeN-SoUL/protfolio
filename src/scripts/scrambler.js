export class Scrambler {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_/[]{}=+*^?#_';
    this.update = this.update.bind(this);
  }

  run(text) {
    const old = this.el.innerText;
    const len = Math.max(old.length, text.length);
    const p = new Promise(r => this.resolve = r);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to   = text[i] || '';
      const s = Math.floor(Math.random() * 6);
      const e = s + Math.floor(Math.random() * 12) + 6;
      this.queue.push({ from, to, s, e, ch: '' });
    }
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
    return p;
  }

  update() {
    let out = '', done = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, s, e } = this.queue[i];
      if (this.frame >= e) {
        done++; out += to;
      } else if (this.frame >= s) {
        if (!this.queue[i].ch || Math.random() < 0.28) {
          this.queue[i].ch = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        out += `<span style="color:var(--ac);opacity:.55">${this.queue[i].ch}</span>`;
      } else { out += from; }
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) { this.resolve(); }
    else { this.raf = setTimeout(() => { this.frame++; this.update(); }, 24); }
  }
}
