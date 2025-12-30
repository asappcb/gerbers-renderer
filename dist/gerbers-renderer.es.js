var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function le(b) {
  return b && b.__esModule && Object.prototype.hasOwnProperty.call(b, "default") ? b.default : b;
}
function Pt(b) {
  throw new Error('Could not dynamically require "' + b + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var Xt;
function ce() {
  return Xt || (Xt = 1, (function(b, t) {
    (function(r) {
      b.exports = r();
    })(function() {
      return (function r(f, h, a) {
        function o(w, _) {
          if (!h[w]) {
            if (!f[w]) {
              var u = typeof Pt == "function" && Pt;
              if (!_ && u) return u(w, !0);
              if (n) return n(w, !0);
              var g = new Error("Cannot find module '" + w + "'");
              throw g.code = "MODULE_NOT_FOUND", g;
            }
            var l = h[w] = { exports: {} };
            f[w][0].call(l.exports, function(m) {
              var i = f[w][1][m];
              return o(i || m);
            }, l, l.exports, r, f, h, a);
          }
          return h[w].exports;
        }
        for (var n = typeof Pt == "function" && Pt, c = 0; c < a.length; c++) o(a[c]);
        return o;
      })({ 1: [function(r, f, h) {
        var a = r("./utils"), o = r("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        h.encode = function(c) {
          for (var w, _, u, g, l, m, i, p = [], d = 0, v = c.length, E = v, x = a.getTypeOf(c) !== "string"; d < c.length; ) E = v - d, u = x ? (w = c[d++], _ = d < v ? c[d++] : 0, d < v ? c[d++] : 0) : (w = c.charCodeAt(d++), _ = d < v ? c.charCodeAt(d++) : 0, d < v ? c.charCodeAt(d++) : 0), g = w >> 2, l = (3 & w) << 4 | _ >> 4, m = 1 < E ? (15 & _) << 2 | u >> 6 : 64, i = 2 < E ? 63 & u : 64, p.push(n.charAt(g) + n.charAt(l) + n.charAt(m) + n.charAt(i));
          return p.join("");
        }, h.decode = function(c) {
          var w, _, u, g, l, m, i = 0, p = 0, d = "data:";
          if (c.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var v, E = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === n.charAt(64) && E--, c.charAt(c.length - 2) === n.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (v = o.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); i < c.length; ) w = n.indexOf(c.charAt(i++)) << 2 | (g = n.indexOf(c.charAt(i++))) >> 4, _ = (15 & g) << 4 | (l = n.indexOf(c.charAt(i++))) >> 2, u = (3 & l) << 6 | (m = n.indexOf(c.charAt(i++))), v[p++] = w, l !== 64 && (v[p++] = _), m !== 64 && (v[p++] = u);
          return v;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(r, f, h) {
        var a = r("./external"), o = r("./stream/DataWorker"), n = r("./stream/Crc32Probe"), c = r("./stream/DataLengthProbe");
        function w(_, u, g, l, m) {
          this.compressedSize = _, this.uncompressedSize = u, this.crc32 = g, this.compression = l, this.compressedContent = m;
        }
        w.prototype = { getContentWorker: function() {
          var _ = new o(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), u = this;
          return _.on("end", function() {
            if (this.streamInfo.data_length !== u.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), _;
        }, getCompressedWorker: function() {
          return new o(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, w.createWorkerFrom = function(_, u, g) {
          return _.pipe(new n()).pipe(new c("uncompressedSize")).pipe(u.compressWorker(g)).pipe(new c("compressedSize")).withStreamInfo("compression", u);
        }, f.exports = w;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(r, f, h) {
        var a = r("./stream/GenericWorker");
        h.STORE = { magic: "\0\0", compressWorker: function() {
          return new a("STORE compression");
        }, uncompressWorker: function() {
          return new a("STORE decompression");
        } }, h.DEFLATE = r("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(r, f, h) {
        var a = r("./utils"), o = (function() {
          for (var n, c = [], w = 0; w < 256; w++) {
            n = w;
            for (var _ = 0; _ < 8; _++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            c[w] = n;
          }
          return c;
        })();
        f.exports = function(n, c) {
          return n !== void 0 && n.length ? a.getTypeOf(n) !== "string" ? (function(w, _, u, g) {
            var l = o, m = g + u;
            w ^= -1;
            for (var i = g; i < m; i++) w = w >>> 8 ^ l[255 & (w ^ _[i])];
            return -1 ^ w;
          })(0 | c, n, n.length, 0) : (function(w, _, u, g) {
            var l = o, m = g + u;
            w ^= -1;
            for (var i = g; i < m; i++) w = w >>> 8 ^ l[255 & (w ^ _.charCodeAt(i))];
            return -1 ^ w;
          })(0 | c, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(r, f, h) {
        h.base64 = !1, h.binary = !1, h.dir = !1, h.createFolders = !0, h.date = null, h.compression = null, h.compressionOptions = null, h.comment = null, h.unixPermissions = null, h.dosPermissions = null;
      }, {}], 6: [function(r, f, h) {
        var a = null;
        a = typeof Promise < "u" ? Promise : r("lie"), f.exports = { Promise: a };
      }, { lie: 37 }], 7: [function(r, f, h) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", o = r("pako"), n = r("./utils"), c = r("./stream/GenericWorker"), w = a ? "uint8array" : "array";
        function _(u, g) {
          c.call(this, "FlateWorker/" + u), this._pako = null, this._pakoAction = u, this._pakoOptions = g, this.meta = {};
        }
        h.magic = "\b\0", n.inherits(_, c), _.prototype.processChunk = function(u) {
          this.meta = u.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(w, u.data), !1);
        }, _.prototype.flush = function() {
          c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, _.prototype.cleanUp = function() {
          c.prototype.cleanUp.call(this), this._pako = null;
        }, _.prototype._createPako = function() {
          this._pako = new o[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var u = this;
          this._pako.onData = function(g) {
            u.push({ data: g, meta: u.meta });
          };
        }, h.compressWorker = function(u) {
          return new _("Deflate", u);
        }, h.uncompressWorker = function() {
          return new _("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(r, f, h) {
        function a(l, m) {
          var i, p = "";
          for (i = 0; i < m; i++) p += String.fromCharCode(255 & l), l >>>= 8;
          return p;
        }
        function o(l, m, i, p, d, v) {
          var E, x, A = l.file, P = l.compression, O = v !== w.utf8encode, L = n.transformTo("string", v(A.name)), I = n.transformTo("string", w.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", v(j)), S = n.transformTo("string", w.utf8encode(j)), F = I.length !== A.name.length, s = S.length !== j.length, D = "", Q = "", X = "", et = A.dir, M = A.date, Y = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !i || (Y.crc32 = l.crc32, Y.compressedSize = l.compressedSize, Y.uncompressedSize = l.uncompressedSize);
          var C = 0;
          m && (C |= 8), O || !F && !s || (C |= 2048);
          var R = 0, G = 0;
          et && (R |= 16), d === "UNIX" ? (G = 798, R |= (function(U, nt) {
            var lt = U;
            return U || (lt = nt ? 16893 : 33204), (65535 & lt) << 16;
          })(A.unixPermissions, et)) : (G = 20, R |= (function(U) {
            return 63 & (U || 0);
          })(A.dosPermissions)), E = M.getUTCHours(), E <<= 6, E |= M.getUTCMinutes(), E <<= 5, E |= M.getUTCSeconds() / 2, x = M.getUTCFullYear() - 1980, x <<= 4, x |= M.getUTCMonth() + 1, x <<= 5, x |= M.getUTCDate(), F && (Q = a(1, 1) + a(_(L), 4) + I, D += "up" + a(Q.length, 2) + Q), s && (X = a(1, 1) + a(_(K), 4) + S, D += "uc" + a(X.length, 2) + X);
          var V = "";
          return V += `
\0`, V += a(C, 2), V += P.magic, V += a(E, 2), V += a(x, 2), V += a(Y.crc32, 4), V += a(Y.compressedSize, 4), V += a(Y.uncompressedSize, 4), V += a(L.length, 2), V += a(D.length, 2), { fileRecord: u.LOCAL_FILE_HEADER + V + L + D, dirRecord: u.CENTRAL_FILE_HEADER + a(G, 2) + V + a(K.length, 2) + "\0\0\0\0" + a(R, 4) + a(p, 4) + L + D + K };
        }
        var n = r("../utils"), c = r("../stream/GenericWorker"), w = r("../utf8"), _ = r("../crc32"), u = r("../signature");
        function g(l, m, i, p) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = m, this.zipPlatform = i, this.encodeFileName = p, this.streamFiles = l, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(g, c), g.prototype.push = function(l) {
          var m = l.meta.percent || 0, i = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(l) : (this.bytesWritten += l.data.length, c.prototype.push.call(this, { data: l.data, meta: { currentFile: this.currentFile, percent: i ? (m + 100 * (i - p - 1)) / i : 100 } }));
        }, g.prototype.openedSource = function(l) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = l.file.name;
          var m = this.streamFiles && !l.file.dir;
          if (m) {
            var i = o(l, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: i.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, g.prototype.closedSource = function(l) {
          this.accumulate = !1;
          var m = this.streamFiles && !l.file.dir, i = o(l, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(i.dirRecord), m) this.push({ data: (function(p) {
            return u.DATA_DESCRIPTOR + a(p.crc32, 4) + a(p.compressedSize, 4) + a(p.uncompressedSize, 4);
          })(l), meta: { percent: 100 } });
          else for (this.push({ data: i.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, g.prototype.flush = function() {
          for (var l = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var i = this.bytesWritten - l, p = (function(d, v, E, x, A) {
            var P = n.transformTo("string", A(x));
            return u.CENTRAL_DIRECTORY_END + "\0\0\0\0" + a(d, 2) + a(d, 2) + a(v, 4) + a(E, 4) + a(P.length, 2) + P;
          })(this.dirRecords.length, i, l, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, g.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, g.prototype.registerPrevious = function(l) {
          this._sources.push(l);
          var m = this;
          return l.on("data", function(i) {
            m.processChunk(i);
          }), l.on("end", function() {
            m.closedSource(m.previous.streamInfo), m._sources.length ? m.prepareNextSource() : m.end();
          }), l.on("error", function(i) {
            m.error(i);
          }), this;
        }, g.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, g.prototype.error = function(l) {
          var m = this._sources;
          if (!c.prototype.error.call(this, l)) return !1;
          for (var i = 0; i < m.length; i++) try {
            m[i].error(l);
          } catch {
          }
          return !0;
        }, g.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var l = this._sources, m = 0; m < l.length; m++) l[m].lock();
        }, f.exports = g;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(r, f, h) {
        var a = r("../compressions"), o = r("./ZipFileWorker");
        h.generateWorker = function(n, c, w) {
          var _ = new o(c.streamFiles, w, c.platform, c.encodeFileName), u = 0;
          try {
            n.forEach(function(g, l) {
              u++;
              var m = (function(v, E) {
                var x = v || E, A = a[x];
                if (!A) throw new Error(x + " is not a valid compression method !");
                return A;
              })(l.options.compression, c.compression), i = l.options.compressionOptions || c.compressionOptions || {}, p = l.dir, d = l.date;
              l._compressWorker(m, i).withStreamInfo("file", { name: g, dir: p, date: d, comment: l.comment || "", unixPermissions: l.unixPermissions, dosPermissions: l.dosPermissions }).pipe(_);
            }), _.entriesCount = u;
          } catch (g) {
            _.error(g);
          }
          return _;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(r, f, h) {
        function a() {
          if (!(this instanceof a)) return new a();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var o = new a();
            for (var n in this) typeof this[n] != "function" && (o[n] = this[n]);
            return o;
          };
        }
        (a.prototype = r("./object")).loadAsync = r("./load"), a.support = r("./support"), a.defaults = r("./defaults"), a.version = "3.10.1", a.loadAsync = function(o, n) {
          return new a().loadAsync(o, n);
        }, a.external = r("./external"), f.exports = a;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(r, f, h) {
        var a = r("./utils"), o = r("./external"), n = r("./utf8"), c = r("./zipEntries"), w = r("./stream/Crc32Probe"), _ = r("./nodejsUtils");
        function u(g) {
          return new o.Promise(function(l, m) {
            var i = g.decompressed.getContentWorker().pipe(new w());
            i.on("error", function(p) {
              m(p);
            }).on("end", function() {
              i.streamInfo.crc32 !== g.decompressed.crc32 ? m(new Error("Corrupted zip : CRC32 mismatch")) : l();
            }).resume();
          });
        }
        f.exports = function(g, l) {
          var m = this;
          return l = a.extend(l || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), _.isNode && _.isStream(g) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : a.prepareContent("the loaded zip file", g, !0, l.optimizedBinaryString, l.base64).then(function(i) {
            var p = new c(l);
            return p.load(i), p;
          }).then(function(i) {
            var p = [o.Promise.resolve(i)], d = i.files;
            if (l.checkCRC32) for (var v = 0; v < d.length; v++) p.push(u(d[v]));
            return o.Promise.all(p);
          }).then(function(i) {
            for (var p = i.shift(), d = p.files, v = 0; v < d.length; v++) {
              var E = d[v], x = E.fileNameStr, A = a.resolve(E.fileNameStr);
              m.file(A, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: l.createFolders }), E.dir || (m.file(A).unsafeOriginalName = x);
            }
            return p.zipComment.length && (m.comment = p.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(r, f, h) {
        var a = r("../utils"), o = r("../stream/GenericWorker");
        function n(c, w) {
          o.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(w);
        }
        a.inherits(n, o), n.prototype._bindStream = function(c) {
          var w = this;
          (this._stream = c).pause(), c.on("data", function(_) {
            w.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            w.isPaused ? this.generatedError = _ : w.error(_);
          }).on("end", function() {
            w.isPaused ? w._upstreamEnded = !0 : w.end();
          });
        }, n.prototype.pause = function() {
          return !!o.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!o.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, f.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(r, f, h) {
        var a = r("readable-stream").Readable;
        function o(n, c, w) {
          a.call(this, c), this._helper = n;
          var _ = this;
          n.on("data", function(u, g) {
            _.push(u) || _._helper.pause(), w && w(g);
          }).on("error", function(u) {
            _.emit("error", u);
          }).on("end", function() {
            _.push(null);
          });
        }
        r("../utils").inherits(o, a), o.prototype._read = function() {
          this._helper.resume();
        }, f.exports = o;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(r, f, h) {
        f.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(a, o) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(a, o);
          if (typeof a == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(a, o);
        }, allocBuffer: function(a) {
          if (Buffer.alloc) return Buffer.alloc(a);
          var o = new Buffer(a);
          return o.fill(0), o;
        }, isBuffer: function(a) {
          return Buffer.isBuffer(a);
        }, isStream: function(a) {
          return a && typeof a.on == "function" && typeof a.pause == "function" && typeof a.resume == "function";
        } };
      }, {}], 15: [function(r, f, h) {
        function a(A, P, O) {
          var L, I = n.getTypeOf(P), j = n.extend(O || {}, _);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = d(A)), j.createFolders && (L = p(A)) && v.call(this, L, !0);
          var K = I === "string" && j.binary === !1 && j.base64 === !1;
          O && O.binary !== void 0 || (j.binary = !K), (P instanceof u && P.uncompressedSize === 0 || j.dir || !P || P.length === 0) && (j.base64 = !1, j.binary = !0, P = "", j.compression = "STORE", I = "string");
          var S = null;
          S = P instanceof u || P instanceof c ? P : m.isNode && m.isStream(P) ? new i(A, P) : n.prepareContent(A, P, j.binary, j.optimizedBinaryString, j.base64);
          var F = new g(A, S, j);
          this.files[A] = F;
        }
        var o = r("./utf8"), n = r("./utils"), c = r("./stream/GenericWorker"), w = r("./stream/StreamHelper"), _ = r("./defaults"), u = r("./compressedObject"), g = r("./zipObject"), l = r("./generate"), m = r("./nodejsUtils"), i = r("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var P = A.lastIndexOf("/");
          return 0 < P ? A.substring(0, P) : "";
        }, d = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, v = function(A, P) {
          return P = P !== void 0 ? P : _.createFolders, A = d(A), this.files[A] || a.call(this, A, null, { dir: !0, createFolders: P }), this.files[A];
        };
        function E(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var x = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var P, O, L;
          for (P in this.files) L = this.files[P], (O = P.slice(this.root.length, P.length)) && P.slice(0, this.root.length) === this.root && A(O, L);
        }, filter: function(A) {
          var P = [];
          return this.forEach(function(O, L) {
            A(O, L) && P.push(L);
          }), P;
        }, file: function(A, P, O) {
          if (arguments.length !== 1) return A = this.root + A, a.call(this, A, P, O), this;
          if (E(A)) {
            var L = A;
            return this.filter(function(j, K) {
              return !K.dir && L.test(j);
            });
          }
          var I = this.files[this.root + A];
          return I && !I.dir ? I : null;
        }, folder: function(A) {
          if (!A) return this;
          if (E(A)) return this.filter(function(I, j) {
            return j.dir && A.test(I);
          });
          var P = this.root + A, O = v.call(this, P), L = this.clone();
          return L.root = O.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var P = this.files[A];
          if (P || (A.slice(-1) !== "/" && (A += "/"), P = this.files[A]), P && !P.dir) delete this.files[A];
          else for (var O = this.filter(function(I, j) {
            return j.name.slice(0, A.length) === A;
          }), L = 0; L < O.length; L++) delete this.files[O[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var P, O = {};
          try {
            if ((O = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: o.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            n.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var L = O.comment || this.comment || "";
            P = l.generateWorker(this, O, L);
          } catch (I) {
            (P = new c("error")).error(I);
          }
          return new w(P, O.type || "string", O.mimeType);
        }, generateAsync: function(A, P) {
          return this.generateInternalStream(A).accumulate(P);
        }, generateNodeStream: function(A, P) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(P);
        } };
        f.exports = x;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(r, f, h) {
        f.exports = r("stream");
      }, { stream: void 0 }], 17: [function(r, f, h) {
        var a = r("./DataReader");
        function o(n) {
          a.call(this, n);
          for (var c = 0; c < this.data.length; c++) n[c] = 255 & n[c];
        }
        r("../utils").inherits(o, a), o.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, o.prototype.lastIndexOfSignature = function(n) {
          for (var c = n.charCodeAt(0), w = n.charCodeAt(1), _ = n.charCodeAt(2), u = n.charCodeAt(3), g = this.length - 4; 0 <= g; --g) if (this.data[g] === c && this.data[g + 1] === w && this.data[g + 2] === _ && this.data[g + 3] === u) return g - this.zero;
          return -1;
        }, o.prototype.readAndCheckSignature = function(n) {
          var c = n.charCodeAt(0), w = n.charCodeAt(1), _ = n.charCodeAt(2), u = n.charCodeAt(3), g = this.readData(4);
          return c === g[0] && w === g[1] && _ === g[2] && u === g[3];
        }, o.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, c;
        }, f.exports = o;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(r, f, h) {
        var a = r("../utils");
        function o(n) {
          this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
        }
        o.prototype = { checkOffset: function(n) {
          this.checkIndex(this.index + n);
        }, checkIndex: function(n) {
          if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
        }, setIndex: function(n) {
          this.checkIndex(n), this.index = n;
        }, skip: function(n) {
          this.setIndex(this.index + n);
        }, byteAt: function() {
        }, readInt: function(n) {
          var c, w = 0;
          for (this.checkOffset(n), c = this.index + n - 1; c >= this.index; c--) w = (w << 8) + this.byteAt(c);
          return this.index += n, w;
        }, readString: function(n) {
          return a.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, f.exports = o;
      }, { "../utils": 32 }], 19: [function(r, f, h) {
        var a = r("./Uint8ArrayReader");
        function o(n) {
          a.call(this, n);
        }
        r("../utils").inherits(o, a), o.prototype.readData = function(n) {
          this.checkOffset(n);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, c;
        }, f.exports = o;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(r, f, h) {
        var a = r("./DataReader");
        function o(n) {
          a.call(this, n);
        }
        r("../utils").inherits(o, a), o.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, o.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, o.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, o.prototype.readData = function(n) {
          this.checkOffset(n);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, c;
        }, f.exports = o;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(r, f, h) {
        var a = r("./ArrayReader");
        function o(n) {
          a.call(this, n);
        }
        r("../utils").inherits(o, a), o.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, c;
        }, f.exports = o;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(r, f, h) {
        var a = r("../utils"), o = r("../support"), n = r("./ArrayReader"), c = r("./StringReader"), w = r("./NodeBufferReader"), _ = r("./Uint8ArrayReader");
        f.exports = function(u) {
          var g = a.getTypeOf(u);
          return a.checkSupport(g), g !== "string" || o.uint8array ? g === "nodebuffer" ? new w(u) : o.uint8array ? new _(a.transformTo("uint8array", u)) : new n(a.transformTo("array", u)) : new c(u);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(r, f, h) {
        h.LOCAL_FILE_HEADER = "PK", h.CENTRAL_FILE_HEADER = "PK", h.CENTRAL_DIRECTORY_END = "PK", h.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", h.ZIP64_CENTRAL_DIRECTORY_END = "PK", h.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(r, f, h) {
        var a = r("./GenericWorker"), o = r("../utils");
        function n(c) {
          a.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        o.inherits(n, a), n.prototype.processChunk = function(c) {
          this.push({ data: o.transformTo(this.destType, c.data), meta: c.meta });
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(r, f, h) {
        var a = r("./GenericWorker"), o = r("../crc32");
        function n() {
          a.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        r("../utils").inherits(n, a), n.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = o(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, f.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(r, f, h) {
        var a = r("../utils"), o = r("./GenericWorker");
        function n(c) {
          o.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        a.inherits(n, o), n.prototype.processChunk = function(c) {
          if (c) {
            var w = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = w + c.data.length;
          }
          o.prototype.processChunk.call(this, c);
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(r, f, h) {
        var a = r("../utils"), o = r("./GenericWorker");
        function n(c) {
          o.call(this, "DataWorker");
          var w = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(_) {
            w.dataIsReady = !0, w.data = _, w.max = _ && _.length || 0, w.type = a.getTypeOf(_), w.isPaused || w._tickAndRepeat();
          }, function(_) {
            w.error(_);
          });
        }
        a.inherits(n, o), n.prototype.cleanUp = function() {
          o.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, a.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (a.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, n.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var c = null, w = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              c = this.data.substring(this.index, w);
              break;
            case "uint8array":
              c = this.data.subarray(this.index, w);
              break;
            case "array":
            case "nodebuffer":
              c = this.data.slice(this.index, w);
          }
          return this.index = w, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(r, f, h) {
        function a(o) {
          this.name = o || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        a.prototype = { push: function(o) {
          this.emit("data", o);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (o) {
            this.emit("error", o);
          }
          return !0;
        }, error: function(o) {
          return !this.isFinished && (this.isPaused ? this.generatedError = o : (this.isFinished = !0, this.emit("error", o), this.previous && this.previous.error(o), this.cleanUp()), !0);
        }, on: function(o, n) {
          return this._listeners[o].push(n), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(o, n) {
          if (this._listeners[o]) for (var c = 0; c < this._listeners[o].length; c++) this._listeners[o][c].call(this, n);
        }, pipe: function(o) {
          return o.registerPrevious(this);
        }, registerPrevious: function(o) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = o.streamInfo, this.mergeStreamInfo(), this.previous = o;
          var n = this;
          return o.on("data", function(c) {
            n.processChunk(c);
          }), o.on("end", function() {
            n.end();
          }), o.on("error", function(c) {
            n.error(c);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var o = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), o = !0), this.previous && this.previous.resume(), !o;
        }, flush: function() {
        }, processChunk: function(o) {
          this.push(o);
        }, withStreamInfo: function(o, n) {
          return this.extraStreamInfo[o] = n, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var o in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, o) && (this.streamInfo[o] = this.extraStreamInfo[o]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var o = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + o : o;
        } }, f.exports = a;
      }, {}], 29: [function(r, f, h) {
        var a = r("../utils"), o = r("./ConvertWorker"), n = r("./GenericWorker"), c = r("../base64"), w = r("../support"), _ = r("../external"), u = null;
        if (w.nodestream) try {
          u = r("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function g(m, i) {
          return new _.Promise(function(p, d) {
            var v = [], E = m._internalType, x = m._outputType, A = m._mimeType;
            m.on("data", function(P, O) {
              v.push(P), i && i(O);
            }).on("error", function(P) {
              v = [], d(P);
            }).on("end", function() {
              try {
                var P = (function(O, L, I) {
                  switch (O) {
                    case "blob":
                      return a.newBlob(a.transformTo("arraybuffer", L), I);
                    case "base64":
                      return c.encode(L);
                    default:
                      return a.transformTo(O, L);
                  }
                })(x, (function(O, L) {
                  var I, j = 0, K = null, S = 0;
                  for (I = 0; I < L.length; I++) S += L[I].length;
                  switch (O) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (K = new Uint8Array(S), I = 0; I < L.length; I++) K.set(L[I], j), j += L[I].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(E, v), A);
                p(P);
              } catch (O) {
                d(O);
              }
              v = [];
            }).resume();
          });
        }
        function l(m, i, p) {
          var d = i;
          switch (i) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = i, this._mimeType = p, a.checkSupport(d), this._worker = m.pipe(new o(d)), m.lock();
          } catch (v) {
            this._worker = new n("error"), this._worker.error(v);
          }
        }
        l.prototype = { accumulate: function(m) {
          return g(this, m);
        }, on: function(m, i) {
          var p = this;
          return m === "data" ? this._worker.on(m, function(d) {
            i.call(p, d.data, d.meta);
          }) : this._worker.on(m, function() {
            a.delay(i, arguments, p);
          }), this;
        }, resume: function() {
          return a.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (a.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new u(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, f.exports = l;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(r, f, h) {
        if (h.base64 = !0, h.array = !0, h.string = !0, h.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", h.nodebuffer = typeof Buffer < "u", h.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") h.blob = !1;
        else {
          var a = new ArrayBuffer(0);
          try {
            h.blob = new Blob([a], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              o.append(a), h.blob = o.getBlob("application/zip").size === 0;
            } catch {
              h.blob = !1;
            }
          }
        }
        try {
          h.nodestream = !!r("readable-stream").Readable;
        } catch {
          h.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(r, f, h) {
        for (var a = r("./utils"), o = r("./support"), n = r("./nodejsUtils"), c = r("./stream/GenericWorker"), w = new Array(256), _ = 0; _ < 256; _++) w[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        w[254] = w[254] = 1;
        function u() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function g() {
          c.call(this, "utf-8 encode");
        }
        h.utf8encode = function(l) {
          return o.nodebuffer ? n.newBufferFrom(l, "utf-8") : (function(m) {
            var i, p, d, v, E, x = m.length, A = 0;
            for (v = 0; v < x; v++) (64512 & (p = m.charCodeAt(v))) == 55296 && v + 1 < x && (64512 & (d = m.charCodeAt(v + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), v++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (i = o.uint8array ? new Uint8Array(A) : new Array(A), v = E = 0; E < A; v++) (64512 & (p = m.charCodeAt(v))) == 55296 && v + 1 < x && (64512 & (d = m.charCodeAt(v + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), v++), p < 128 ? i[E++] = p : (p < 2048 ? i[E++] = 192 | p >>> 6 : (p < 65536 ? i[E++] = 224 | p >>> 12 : (i[E++] = 240 | p >>> 18, i[E++] = 128 | p >>> 12 & 63), i[E++] = 128 | p >>> 6 & 63), i[E++] = 128 | 63 & p);
            return i;
          })(l);
        }, h.utf8decode = function(l) {
          return o.nodebuffer ? a.transformTo("nodebuffer", l).toString("utf-8") : (function(m) {
            var i, p, d, v, E = m.length, x = new Array(2 * E);
            for (i = p = 0; i < E; ) if ((d = m[i++]) < 128) x[p++] = d;
            else if (4 < (v = w[d])) x[p++] = 65533, i += v - 1;
            else {
              for (d &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && i < E; ) d = d << 6 | 63 & m[i++], v--;
              1 < v ? x[p++] = 65533 : d < 65536 ? x[p++] = d : (d -= 65536, x[p++] = 55296 | d >> 10 & 1023, x[p++] = 56320 | 1023 & d);
            }
            return x.length !== p && (x.subarray ? x = x.subarray(0, p) : x.length = p), a.applyFromCharCode(x);
          })(l = a.transformTo(o.uint8array ? "uint8array" : "array", l));
        }, a.inherits(u, c), u.prototype.processChunk = function(l) {
          var m = a.transformTo(o.uint8array ? "uint8array" : "array", l.data);
          if (this.leftOver && this.leftOver.length) {
            if (o.uint8array) {
              var i = m;
              (m = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), m.set(i, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var p = (function(v, E) {
            var x;
            for ((E = E || v.length) > v.length && (E = v.length), x = E - 1; 0 <= x && (192 & v[x]) == 128; ) x--;
            return x < 0 || x === 0 ? E : x + w[v[x]] > E ? x : E;
          })(m), d = m;
          p !== m.length && (o.uint8array ? (d = m.subarray(0, p), this.leftOver = m.subarray(p, m.length)) : (d = m.slice(0, p), this.leftOver = m.slice(p, m.length))), this.push({ data: h.utf8decode(d), meta: l.meta });
        }, u.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: h.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, h.Utf8DecodeWorker = u, a.inherits(g, c), g.prototype.processChunk = function(l) {
          this.push({ data: h.utf8encode(l.data), meta: l.meta });
        }, h.Utf8EncodeWorker = g;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(r, f, h) {
        var a = r("./support"), o = r("./base64"), n = r("./nodejsUtils"), c = r("./external");
        function w(i) {
          return i;
        }
        function _(i, p) {
          for (var d = 0; d < i.length; ++d) p[d] = 255 & i.charCodeAt(d);
          return p;
        }
        r("setimmediate"), h.newBlob = function(i, p) {
          h.checkSupport("blob");
          try {
            return new Blob([i], { type: p });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(i), d.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var u = { stringifyByChunk: function(i, p, d) {
          var v = [], E = 0, x = i.length;
          if (x <= d) return String.fromCharCode.apply(null, i);
          for (; E < x; ) p === "array" || p === "nodebuffer" ? v.push(String.fromCharCode.apply(null, i.slice(E, Math.min(E + d, x)))) : v.push(String.fromCharCode.apply(null, i.subarray(E, Math.min(E + d, x)))), E += d;
          return v.join("");
        }, stringifyByChar: function(i) {
          for (var p = "", d = 0; d < i.length; d++) p += String.fromCharCode(i[d]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return a.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return a.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function g(i) {
          var p = 65536, d = h.getTypeOf(i), v = !0;
          if (d === "uint8array" ? v = u.applyCanBeUsed.uint8array : d === "nodebuffer" && (v = u.applyCanBeUsed.nodebuffer), v) for (; 1 < p; ) try {
            return u.stringifyByChunk(i, d, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return u.stringifyByChar(i);
        }
        function l(i, p) {
          for (var d = 0; d < i.length; d++) p[d] = i[d];
          return p;
        }
        h.applyFromCharCode = g;
        var m = {};
        m.string = { string: w, array: function(i) {
          return _(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return m.string.uint8array(i).buffer;
        }, uint8array: function(i) {
          return _(i, new Uint8Array(i.length));
        }, nodebuffer: function(i) {
          return _(i, n.allocBuffer(i.length));
        } }, m.array = { string: g, array: w, arraybuffer: function(i) {
          return new Uint8Array(i).buffer;
        }, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return n.newBufferFrom(i);
        } }, m.arraybuffer = { string: function(i) {
          return g(new Uint8Array(i));
        }, array: function(i) {
          return l(new Uint8Array(i), new Array(i.byteLength));
        }, arraybuffer: w, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return n.newBufferFrom(new Uint8Array(i));
        } }, m.uint8array = { string: g, array: function(i) {
          return l(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return i.buffer;
        }, uint8array: w, nodebuffer: function(i) {
          return n.newBufferFrom(i);
        } }, m.nodebuffer = { string: g, array: function(i) {
          return l(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return m.nodebuffer.uint8array(i).buffer;
        }, uint8array: function(i) {
          return l(i, new Uint8Array(i.length));
        }, nodebuffer: w }, h.transformTo = function(i, p) {
          if (p = p || "", !i) return p;
          h.checkSupport(i);
          var d = h.getTypeOf(p);
          return m[d][i](p);
        }, h.resolve = function(i) {
          for (var p = i.split("/"), d = [], v = 0; v < p.length; v++) {
            var E = p[v];
            E === "." || E === "" && v !== 0 && v !== p.length - 1 || (E === ".." ? d.pop() : d.push(E));
          }
          return d.join("/");
        }, h.getTypeOf = function(i) {
          return typeof i == "string" ? "string" : Object.prototype.toString.call(i) === "[object Array]" ? "array" : a.nodebuffer && n.isBuffer(i) ? "nodebuffer" : a.uint8array && i instanceof Uint8Array ? "uint8array" : a.arraybuffer && i instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, h.checkSupport = function(i) {
          if (!a[i.toLowerCase()]) throw new Error(i + " is not supported by this platform");
        }, h.MAX_VALUE_16BITS = 65535, h.MAX_VALUE_32BITS = -1, h.pretty = function(i) {
          var p, d, v = "";
          for (d = 0; d < (i || "").length; d++) v += "\\x" + ((p = i.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return v;
        }, h.delay = function(i, p, d) {
          setImmediate(function() {
            i.apply(d || null, p || []);
          });
        }, h.inherits = function(i, p) {
          function d() {
          }
          d.prototype = p.prototype, i.prototype = new d();
        }, h.extend = function() {
          var i, p, d = {};
          for (i = 0; i < arguments.length; i++) for (p in arguments[i]) Object.prototype.hasOwnProperty.call(arguments[i], p) && d[p] === void 0 && (d[p] = arguments[i][p]);
          return d;
        }, h.prepareContent = function(i, p, d, v, E) {
          return c.Promise.resolve(p).then(function(x) {
            return a.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(A, P) {
              var O = new FileReader();
              O.onload = function(L) {
                A(L.target.result);
              }, O.onerror = function(L) {
                P(L.target.error);
              }, O.readAsArrayBuffer(x);
            }) : x;
          }).then(function(x) {
            var A = h.getTypeOf(x);
            return A ? (A === "arraybuffer" ? x = h.transformTo("uint8array", x) : A === "string" && (E ? x = o.decode(x) : d && v !== !0 && (x = (function(P) {
              return _(P, a.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(x))), x) : c.Promise.reject(new Error("Can't read the data of '" + i + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(r, f, h) {
        var a = r("./reader/readerFor"), o = r("./utils"), n = r("./signature"), c = r("./zipEntry"), w = r("./support");
        function _(u) {
          this.files = [], this.loadOptions = u;
        }
        _.prototype = { checkSignature: function(u) {
          if (!this.reader.readAndCheckSignature(u)) {
            this.reader.index -= 4;
            var g = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(g) + ", expected " + o.pretty(u) + ")");
          }
        }, isSignature: function(u, g) {
          var l = this.reader.index;
          this.reader.setIndex(u);
          var m = this.reader.readString(4) === g;
          return this.reader.setIndex(l), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var u = this.reader.readData(this.zipCommentLength), g = w.uint8array ? "uint8array" : "array", l = o.transformTo(g, u);
          this.zipComment = this.loadOptions.decodeFileName(l);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var u, g, l, m = this.zip64EndOfCentralSize - 44; 0 < m; ) u = this.reader.readInt(2), g = this.reader.readInt(4), l = this.reader.readData(g), this.zip64ExtensibleData[u] = { id: u, length: g, value: l };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var u, g;
          for (u = 0; u < this.files.length; u++) g = this.files[u], this.reader.setIndex(g.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), g.readLocalPart(this.reader), g.handleUTF8(), g.processAttributes();
        }, readCentralDir: function() {
          var u;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (u = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(u);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var u = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (u < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(u);
          var g = u;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (u = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(u), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var l = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (l += 20, l += 12 + this.zip64EndOfCentralSize);
          var m = g - l;
          if (0 < m) this.isSignature(g, n.CENTRAL_FILE_HEADER) || (this.reader.zero = m);
          else if (m < 0) throw new Error("Corrupted zip: missing " + Math.abs(m) + " bytes.");
        }, prepareReader: function(u) {
          this.reader = a(u);
        }, load: function(u) {
          this.prepareReader(u), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, f.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(r, f, h) {
        var a = r("./reader/readerFor"), o = r("./utils"), n = r("./compressedObject"), c = r("./crc32"), w = r("./utf8"), _ = r("./compressions"), u = r("./support");
        function g(l, m) {
          this.options = l, this.loadOptions = m;
        }
        g.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(l) {
          var m, i;
          if (l.skip(22), this.fileNameLength = l.readInt(2), i = l.readInt(2), this.fileName = l.readData(this.fileNameLength), l.skip(i), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((m = (function(p) {
            for (var d in _) if (Object.prototype.hasOwnProperty.call(_, d) && _[d].magic === p) return _[d];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + o.pretty(this.compressionMethod) + " unknown (inner file : " + o.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, m, l.readData(this.compressedSize));
        }, readCentralPart: function(l) {
          this.versionMadeBy = l.readInt(2), l.skip(2), this.bitFlag = l.readInt(2), this.compressionMethod = l.readString(2), this.date = l.readDate(), this.crc32 = l.readInt(4), this.compressedSize = l.readInt(4), this.uncompressedSize = l.readInt(4);
          var m = l.readInt(2);
          if (this.extraFieldsLength = l.readInt(2), this.fileCommentLength = l.readInt(2), this.diskNumberStart = l.readInt(2), this.internalFileAttributes = l.readInt(2), this.externalFileAttributes = l.readInt(4), this.localHeaderOffset = l.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          l.skip(m), this.readExtraFields(l), this.parseZIP64ExtraField(l), this.fileComment = l.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var l = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), l == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), l == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var l = a(this.extraFields[1].value);
            this.uncompressedSize === o.MAX_VALUE_32BITS && (this.uncompressedSize = l.readInt(8)), this.compressedSize === o.MAX_VALUE_32BITS && (this.compressedSize = l.readInt(8)), this.localHeaderOffset === o.MAX_VALUE_32BITS && (this.localHeaderOffset = l.readInt(8)), this.diskNumberStart === o.MAX_VALUE_32BITS && (this.diskNumberStart = l.readInt(4));
          }
        }, readExtraFields: function(l) {
          var m, i, p, d = l.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); l.index + 4 < d; ) m = l.readInt(2), i = l.readInt(2), p = l.readData(i), this.extraFields[m] = { id: m, length: i, value: p };
          l.setIndex(d);
        }, handleUTF8: function() {
          var l = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = w.utf8decode(this.fileName), this.fileCommentStr = w.utf8decode(this.fileComment);
          else {
            var m = this.findExtraFieldUnicodePath();
            if (m !== null) this.fileNameStr = m;
            else {
              var i = o.transformTo(l, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(i);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var d = o.transformTo(l, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var l = this.extraFields[28789];
          if (l) {
            var m = a(l.value);
            return m.readInt(1) !== 1 || c(this.fileName) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var l = this.extraFields[25461];
          if (l) {
            var m = a(l.value);
            return m.readInt(1) !== 1 || c(this.fileComment) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        } }, f.exports = g;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(r, f, h) {
        function a(m, i, p) {
          this.name = m, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = i, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var o = r("./stream/StreamHelper"), n = r("./stream/DataWorker"), c = r("./utf8"), w = r("./compressedObject"), _ = r("./stream/GenericWorker");
        a.prototype = { internalStream: function(m) {
          var i = null, p = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var d = (p = m.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), i = this._decompressWorker();
            var v = !this._dataBinary;
            v && !d && (i = i.pipe(new c.Utf8EncodeWorker())), !v && d && (i = i.pipe(new c.Utf8DecodeWorker()));
          } catch (E) {
            (i = new _("error")).error(E);
          }
          return new o(i, p, "");
        }, async: function(m, i) {
          return this.internalStream(m).accumulate(i);
        }, nodeStream: function(m, i) {
          return this.internalStream(m || "nodebuffer").toNodejsStream(i);
        }, _compressWorker: function(m, i) {
          if (this._data instanceof w && this._data.compression.magic === m.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new c.Utf8EncodeWorker())), w.createWorkerFrom(p, m, i);
        }, _decompressWorker: function() {
          return this._data instanceof w ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new n(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], g = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, l = 0; l < u.length; l++) a.prototype[u[l]] = g;
        f.exports = a;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(r, f, h) {
        (function(a) {
          var o, n, c = a.MutationObserver || a.WebKitMutationObserver;
          if (c) {
            var w = 0, _ = new c(m), u = a.document.createTextNode("");
            _.observe(u, { characterData: !0 }), o = function() {
              u.data = w = ++w % 2;
            };
          } else if (a.setImmediate || a.MessageChannel === void 0) o = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function() {
            var i = a.document.createElement("script");
            i.onreadystatechange = function() {
              m(), i.onreadystatechange = null, i.parentNode.removeChild(i), i = null;
            }, a.document.documentElement.appendChild(i);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var g = new a.MessageChannel();
            g.port1.onmessage = m, o = function() {
              g.port2.postMessage(0);
            };
          }
          var l = [];
          function m() {
            var i, p;
            n = !0;
            for (var d = l.length; d; ) {
              for (p = l, l = [], i = -1; ++i < d; ) p[i]();
              d = l.length;
            }
            n = !1;
          }
          f.exports = function(i) {
            l.push(i) !== 1 || n || o();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(r, f, h) {
        var a = r("immediate");
        function o() {
        }
        var n = {}, c = ["REJECTED"], w = ["FULFILLED"], _ = ["PENDING"];
        function u(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, d !== o && i(this, d);
        }
        function g(d, v, E) {
          this.promise = d, typeof v == "function" && (this.onFulfilled = v, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
        }
        function l(d, v, E) {
          a(function() {
            var x;
            try {
              x = v(E);
            } catch (A) {
              return n.reject(d, A);
            }
            x === d ? n.reject(d, new TypeError("Cannot resolve promise with itself")) : n.resolve(d, x);
          });
        }
        function m(d) {
          var v = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof v == "function") return function() {
            v.apply(d, arguments);
          };
        }
        function i(d, v) {
          var E = !1;
          function x(O) {
            E || (E = !0, n.reject(d, O));
          }
          function A(O) {
            E || (E = !0, n.resolve(d, O));
          }
          var P = p(function() {
            v(A, x);
          });
          P.status === "error" && x(P.value);
        }
        function p(d, v) {
          var E = {};
          try {
            E.value = d(v), E.status = "success";
          } catch (x) {
            E.status = "error", E.value = x;
          }
          return E;
        }
        (f.exports = u).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var v = this.constructor;
          return this.then(function(E) {
            return v.resolve(d()).then(function() {
              return E;
            });
          }, function(E) {
            return v.resolve(d()).then(function() {
              throw E;
            });
          });
        }, u.prototype.catch = function(d) {
          return this.then(null, d);
        }, u.prototype.then = function(d, v) {
          if (typeof d != "function" && this.state === w || typeof v != "function" && this.state === c) return this;
          var E = new this.constructor(o);
          return this.state !== _ ? l(E, this.state === w ? d : v, this.outcome) : this.queue.push(new g(E, d, v)), E;
        }, g.prototype.callFulfilled = function(d) {
          n.resolve(this.promise, d);
        }, g.prototype.otherCallFulfilled = function(d) {
          l(this.promise, this.onFulfilled, d);
        }, g.prototype.callRejected = function(d) {
          n.reject(this.promise, d);
        }, g.prototype.otherCallRejected = function(d) {
          l(this.promise, this.onRejected, d);
        }, n.resolve = function(d, v) {
          var E = p(m, v);
          if (E.status === "error") return n.reject(d, E.value);
          var x = E.value;
          if (x) i(d, x);
          else {
            d.state = w, d.outcome = v;
            for (var A = -1, P = d.queue.length; ++A < P; ) d.queue[A].callFulfilled(v);
          }
          return d;
        }, n.reject = function(d, v) {
          d.state = c, d.outcome = v;
          for (var E = -1, x = d.queue.length; ++E < x; ) d.queue[E].callRejected(v);
          return d;
        }, u.resolve = function(d) {
          return d instanceof this ? d : n.resolve(new this(o), d);
        }, u.reject = function(d) {
          var v = new this(o);
          return n.reject(v, d);
        }, u.all = function(d) {
          var v = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = d.length, x = !1;
          if (!E) return this.resolve([]);
          for (var A = new Array(E), P = 0, O = -1, L = new this(o); ++O < E; ) I(d[O], O);
          return L;
          function I(j, K) {
            v.resolve(j).then(function(S) {
              A[K] = S, ++P !== E || x || (x = !0, n.resolve(L, A));
            }, function(S) {
              x || (x = !0, n.reject(L, S));
            });
          }
        }, u.race = function(d) {
          var v = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = d.length, x = !1;
          if (!E) return this.resolve([]);
          for (var A = -1, P = new this(o); ++A < E; ) O = d[A], v.resolve(O).then(function(L) {
            x || (x = !0, n.resolve(P, L));
          }, function(L) {
            x || (x = !0, n.reject(P, L));
          });
          var O;
          return P;
        };
      }, { immediate: 36 }], 38: [function(r, f, h) {
        var a = {};
        (0, r("./lib/utils/common").assign)(a, r("./lib/deflate"), r("./lib/inflate"), r("./lib/zlib/constants")), f.exports = a;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(r, f, h) {
        var a = r("./zlib/deflate"), o = r("./utils/common"), n = r("./utils/strings"), c = r("./zlib/messages"), w = r("./zlib/zstream"), _ = Object.prototype.toString, u = 0, g = -1, l = 0, m = 8;
        function i(d) {
          if (!(this instanceof i)) return new i(d);
          this.options = o.assign({ level: g, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: l, to: "" }, d || {});
          var v = this.options;
          v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
          var E = a.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
          if (E !== u) throw new Error(c[E]);
          if (v.header && a.deflateSetHeader(this.strm, v.header), v.dictionary) {
            var x;
            if (x = typeof v.dictionary == "string" ? n.string2buf(v.dictionary) : _.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (E = a.deflateSetDictionary(this.strm, x)) !== u) throw new Error(c[E]);
            this._dict_set = !0;
          }
        }
        function p(d, v) {
          var E = new i(v);
          if (E.push(d, !0), E.err) throw E.msg || c[E.err];
          return E.result;
        }
        i.prototype.push = function(d, v) {
          var E, x, A = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          x = v === ~~v ? v : v === !0 ? 4 : 0, typeof d == "string" ? A.input = n.string2buf(d) : _.call(d) === "[object ArrayBuffer]" ? A.input = new Uint8Array(d) : A.input = d, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new o.Buf8(P), A.next_out = 0, A.avail_out = P), (E = a.deflate(A, x)) !== 1 && E !== u) return this.onEnd(E), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(o.shrinkBuf(A.output, A.next_out))) : this.onData(o.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && E !== 1);
          return x === 4 ? (E = a.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === u) : x !== 2 || (this.onEnd(u), !(A.avail_out = 0));
        }, i.prototype.onData = function(d) {
          this.chunks.push(d);
        }, i.prototype.onEnd = function(d) {
          d === u && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, h.Deflate = i, h.deflate = p, h.deflateRaw = function(d, v) {
          return (v = v || {}).raw = !0, p(d, v);
        }, h.gzip = function(d, v) {
          return (v = v || {}).gzip = !0, p(d, v);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(r, f, h) {
        var a = r("./zlib/inflate"), o = r("./utils/common"), n = r("./utils/strings"), c = r("./zlib/constants"), w = r("./zlib/messages"), _ = r("./zlib/zstream"), u = r("./zlib/gzheader"), g = Object.prototype.toString;
        function l(i) {
          if (!(this instanceof l)) return new l(i);
          this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, i || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || i && i.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(), this.strm.avail_out = 0;
          var d = a.inflateInit2(this.strm, p.windowBits);
          if (d !== c.Z_OK) throw new Error(w[d]);
          this.header = new u(), a.inflateGetHeader(this.strm, this.header);
        }
        function m(i, p) {
          var d = new l(p);
          if (d.push(i, !0), d.err) throw d.msg || w[d.err];
          return d.result;
        }
        l.prototype.push = function(i, p) {
          var d, v, E, x, A, P, O = this.strm, L = this.options.chunkSize, I = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          v = p === ~~p ? p : p === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof i == "string" ? O.input = n.binstring2buf(i) : g.call(i) === "[object ArrayBuffer]" ? O.input = new Uint8Array(i) : O.input = i, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new o.Buf8(L), O.next_out = 0, O.avail_out = L), (d = a.inflate(O, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && I && (P = typeof I == "string" ? n.string2buf(I) : g.call(I) === "[object ArrayBuffer]" ? new Uint8Array(I) : I, d = a.inflateSetDictionary(this.strm, P)), d === c.Z_BUF_ERROR && j === !0 && (d = c.Z_OK, j = !1), d !== c.Z_STREAM_END && d !== c.Z_OK) return this.onEnd(d), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && d !== c.Z_STREAM_END && (O.avail_in !== 0 || v !== c.Z_FINISH && v !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = n.utf8border(O.output, O.next_out), x = O.next_out - E, A = n.buf2string(O.output, E), O.next_out = x, O.avail_out = L - x, x && o.arraySet(O.output, O.output, E, x, 0), this.onData(A)) : this.onData(o.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (j = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && d !== c.Z_STREAM_END);
          return d === c.Z_STREAM_END && (v = c.Z_FINISH), v === c.Z_FINISH ? (d = a.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === c.Z_OK) : v !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(O.avail_out = 0));
        }, l.prototype.onData = function(i) {
          this.chunks.push(i);
        }, l.prototype.onEnd = function(i) {
          i === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
        }, h.Inflate = l, h.inflate = m, h.inflateRaw = function(i, p) {
          return (p = p || {}).raw = !0, m(i, p);
        }, h.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(r, f, h) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        h.assign = function(c) {
          for (var w = Array.prototype.slice.call(arguments, 1); w.length; ) {
            var _ = w.shift();
            if (_) {
              if (typeof _ != "object") throw new TypeError(_ + "must be non-object");
              for (var u in _) _.hasOwnProperty(u) && (c[u] = _[u]);
            }
          }
          return c;
        }, h.shrinkBuf = function(c, w) {
          return c.length === w ? c : c.subarray ? c.subarray(0, w) : (c.length = w, c);
        };
        var o = { arraySet: function(c, w, _, u, g) {
          if (w.subarray && c.subarray) c.set(w.subarray(_, _ + u), g);
          else for (var l = 0; l < u; l++) c[g + l] = w[_ + l];
        }, flattenChunks: function(c) {
          var w, _, u, g, l, m;
          for (w = u = 0, _ = c.length; w < _; w++) u += c[w].length;
          for (m = new Uint8Array(u), w = g = 0, _ = c.length; w < _; w++) l = c[w], m.set(l, g), g += l.length;
          return m;
        } }, n = { arraySet: function(c, w, _, u, g) {
          for (var l = 0; l < u; l++) c[g + l] = w[_ + l];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        h.setTyped = function(c) {
          c ? (h.Buf8 = Uint8Array, h.Buf16 = Uint16Array, h.Buf32 = Int32Array, h.assign(h, o)) : (h.Buf8 = Array, h.Buf16 = Array, h.Buf32 = Array, h.assign(h, n));
        }, h.setTyped(a);
      }, {}], 42: [function(r, f, h) {
        var a = r("./common"), o = !0, n = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          o = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          n = !1;
        }
        for (var c = new a.Buf8(256), w = 0; w < 256; w++) c[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
        function _(u, g) {
          if (g < 65537 && (u.subarray && n || !u.subarray && o)) return String.fromCharCode.apply(null, a.shrinkBuf(u, g));
          for (var l = "", m = 0; m < g; m++) l += String.fromCharCode(u[m]);
          return l;
        }
        c[254] = c[254] = 1, h.string2buf = function(u) {
          var g, l, m, i, p, d = u.length, v = 0;
          for (i = 0; i < d; i++) (64512 & (l = u.charCodeAt(i))) == 55296 && i + 1 < d && (64512 & (m = u.charCodeAt(i + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), i++), v += l < 128 ? 1 : l < 2048 ? 2 : l < 65536 ? 3 : 4;
          for (g = new a.Buf8(v), i = p = 0; p < v; i++) (64512 & (l = u.charCodeAt(i))) == 55296 && i + 1 < d && (64512 & (m = u.charCodeAt(i + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), i++), l < 128 ? g[p++] = l : (l < 2048 ? g[p++] = 192 | l >>> 6 : (l < 65536 ? g[p++] = 224 | l >>> 12 : (g[p++] = 240 | l >>> 18, g[p++] = 128 | l >>> 12 & 63), g[p++] = 128 | l >>> 6 & 63), g[p++] = 128 | 63 & l);
          return g;
        }, h.buf2binstring = function(u) {
          return _(u, u.length);
        }, h.binstring2buf = function(u) {
          for (var g = new a.Buf8(u.length), l = 0, m = g.length; l < m; l++) g[l] = u.charCodeAt(l);
          return g;
        }, h.buf2string = function(u, g) {
          var l, m, i, p, d = g || u.length, v = new Array(2 * d);
          for (l = m = 0; l < d; ) if ((i = u[l++]) < 128) v[m++] = i;
          else if (4 < (p = c[i])) v[m++] = 65533, l += p - 1;
          else {
            for (i &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && l < d; ) i = i << 6 | 63 & u[l++], p--;
            1 < p ? v[m++] = 65533 : i < 65536 ? v[m++] = i : (i -= 65536, v[m++] = 55296 | i >> 10 & 1023, v[m++] = 56320 | 1023 & i);
          }
          return _(v, m);
        }, h.utf8border = function(u, g) {
          var l;
          for ((g = g || u.length) > u.length && (g = u.length), l = g - 1; 0 <= l && (192 & u[l]) == 128; ) l--;
          return l < 0 || l === 0 ? g : l + c[u[l]] > g ? l : g;
        };
      }, { "./common": 41 }], 43: [function(r, f, h) {
        f.exports = function(a, o, n, c) {
          for (var w = 65535 & a | 0, _ = a >>> 16 & 65535 | 0, u = 0; n !== 0; ) {
            for (n -= u = 2e3 < n ? 2e3 : n; _ = _ + (w = w + o[c++] | 0) | 0, --u; ) ;
            w %= 65521, _ %= 65521;
          }
          return w | _ << 16 | 0;
        };
      }, {}], 44: [function(r, f, h) {
        f.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(r, f, h) {
        var a = (function() {
          for (var o, n = [], c = 0; c < 256; c++) {
            o = c;
            for (var w = 0; w < 8; w++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            n[c] = o;
          }
          return n;
        })();
        f.exports = function(o, n, c, w) {
          var _ = a, u = w + c;
          o ^= -1;
          for (var g = w; g < u; g++) o = o >>> 8 ^ _[255 & (o ^ n[g])];
          return -1 ^ o;
        };
      }, {}], 46: [function(r, f, h) {
        var a, o = r("../utils/common"), n = r("./trees"), c = r("./adler32"), w = r("./crc32"), _ = r("./messages"), u = 0, g = 4, l = 0, m = -2, i = -1, p = 4, d = 2, v = 8, E = 9, x = 286, A = 30, P = 19, O = 2 * x + 1, L = 15, I = 3, j = 258, K = j + I + 1, S = 42, F = 113, s = 1, D = 2, Q = 3, X = 4;
        function et(e, N) {
          return e.msg = _[N], N;
        }
        function M(e) {
          return (e << 1) - (4 < e ? 9 : 0);
        }
        function Y(e) {
          for (var N = e.length; 0 <= --N; ) e[N] = 0;
        }
        function C(e) {
          var N = e.state, B = N.pending;
          B > e.avail_out && (B = e.avail_out), B !== 0 && (o.arraySet(e.output, N.pending_buf, N.pending_out, B, e.next_out), e.next_out += B, N.pending_out += B, e.total_out += B, e.avail_out -= B, N.pending -= B, N.pending === 0 && (N.pending_out = 0));
        }
        function R(e, N) {
          n._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, N), e.block_start = e.strstart, C(e.strm);
        }
        function G(e, N) {
          e.pending_buf[e.pending++] = N;
        }
        function V(e, N) {
          e.pending_buf[e.pending++] = N >>> 8 & 255, e.pending_buf[e.pending++] = 255 & N;
        }
        function U(e, N) {
          var B, k, y = e.max_chain_length, z = e.strstart, W = e.prev_length, $ = e.nice_match, T = e.strstart > e.w_size - K ? e.strstart - (e.w_size - K) : 0, Z = e.window, q = e.w_mask, H = e.prev, J = e.strstart + j, ht = Z[z + W - 1], at = Z[z + W];
          e.prev_length >= e.good_match && (y >>= 2), $ > e.lookahead && ($ = e.lookahead);
          do
            if (Z[(B = N) + W] === at && Z[B + W - 1] === ht && Z[B] === Z[z] && Z[++B] === Z[z + 1]) {
              z += 2, B++;
              do
                ;
              while (Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && Z[++z] === Z[++B] && z < J);
              if (k = j - (J - z), z = J - j, W < k) {
                if (e.match_start = N, $ <= (W = k)) break;
                ht = Z[z + W - 1], at = Z[z + W];
              }
            }
          while ((N = H[N & q]) > T && --y != 0);
          return W <= e.lookahead ? W : e.lookahead;
        }
        function nt(e) {
          var N, B, k, y, z, W, $, T, Z, q, H = e.w_size;
          do {
            if (y = e.window_size - e.lookahead - e.strstart, e.strstart >= H + (H - K)) {
              for (o.arraySet(e.window, e.window, H, H, 0), e.match_start -= H, e.strstart -= H, e.block_start -= H, N = B = e.hash_size; k = e.head[--N], e.head[N] = H <= k ? k - H : 0, --B; ) ;
              for (N = B = H; k = e.prev[--N], e.prev[N] = H <= k ? k - H : 0, --B; ) ;
              y += H;
            }
            if (e.strm.avail_in === 0) break;
            if (W = e.strm, $ = e.window, T = e.strstart + e.lookahead, Z = y, q = void 0, q = W.avail_in, Z < q && (q = Z), B = q === 0 ? 0 : (W.avail_in -= q, o.arraySet($, W.input, W.next_in, q, T), W.state.wrap === 1 ? W.adler = c(W.adler, $, q, T) : W.state.wrap === 2 && (W.adler = w(W.adler, $, q, T)), W.next_in += q, W.total_in += q, q), e.lookahead += B, e.lookahead + e.insert >= I) for (z = e.strstart - e.insert, e.ins_h = e.window[z], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[z + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[z + I - 1]) & e.hash_mask, e.prev[z & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = z, z++, e.insert--, !(e.lookahead + e.insert < I)); ) ;
          } while (e.lookahead < K && e.strm.avail_in !== 0);
        }
        function lt(e, N) {
          for (var B, k; ; ) {
            if (e.lookahead < K) {
              if (nt(e), e.lookahead < K && N === u) return s;
              if (e.lookahead === 0) break;
            }
            if (B = 0, e.lookahead >= I && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + I - 1]) & e.hash_mask, B = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), B !== 0 && e.strstart - B <= e.w_size - K && (e.match_length = U(e, B)), e.match_length >= I) if (k = n._tr_tally(e, e.strstart - e.match_start, e.match_length - I), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= I) {
              for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + I - 1]) & e.hash_mask, B = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, --e.match_length != 0; ) ;
              e.strstart++;
            } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
            else k = n._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
            if (k && (R(e, !1), e.strm.avail_out === 0)) return s;
          }
          return e.insert = e.strstart < I - 1 ? e.strstart : I - 1, N === g ? (R(e, !0), e.strm.avail_out === 0 ? Q : X) : e.last_lit && (R(e, !1), e.strm.avail_out === 0) ? s : D;
        }
        function tt(e, N) {
          for (var B, k, y; ; ) {
            if (e.lookahead < K) {
              if (nt(e), e.lookahead < K && N === u) return s;
              if (e.lookahead === 0) break;
            }
            if (B = 0, e.lookahead >= I && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + I - 1]) & e.hash_mask, B = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = I - 1, B !== 0 && e.prev_length < e.max_lazy_match && e.strstart - B <= e.w_size - K && (e.match_length = U(e, B), e.match_length <= 5 && (e.strategy === 1 || e.match_length === I && 4096 < e.strstart - e.match_start) && (e.match_length = I - 1)), e.prev_length >= I && e.match_length <= e.prev_length) {
              for (y = e.strstart + e.lookahead - I, k = n._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - I), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= y && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + I - 1]) & e.hash_mask, B = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), --e.prev_length != 0; ) ;
              if (e.match_available = 0, e.match_length = I - 1, e.strstart++, k && (R(e, !1), e.strm.avail_out === 0)) return s;
            } else if (e.match_available) {
              if ((k = n._tr_tally(e, 0, e.window[e.strstart - 1])) && R(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return s;
            } else e.match_available = 1, e.strstart++, e.lookahead--;
          }
          return e.match_available && (k = n._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < I - 1 ? e.strstart : I - 1, N === g ? (R(e, !0), e.strm.avail_out === 0 ? Q : X) : e.last_lit && (R(e, !1), e.strm.avail_out === 0) ? s : D;
        }
        function rt(e, N, B, k, y) {
          this.good_length = e, this.max_lazy = N, this.nice_length = B, this.max_chain = k, this.func = y;
        }
        function st() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(2 * O), this.dyn_dtree = new o.Buf16(2 * (2 * A + 1)), this.bl_tree = new o.Buf16(2 * (2 * P + 1)), Y(this.dyn_ltree), Y(this.dyn_dtree), Y(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16(L + 1), this.heap = new o.Buf16(2 * x + 1), Y(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(2 * x + 1), Y(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(e) {
          var N;
          return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = d, (N = e.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? S : F, e.adler = N.wrap === 2 ? 0 : 1, N.last_flush = u, n._tr_init(N), l) : et(e, m);
        }
        function it(e) {
          var N = ot(e);
          return N === l && (function(B) {
            B.window_size = 2 * B.w_size, Y(B.head), B.max_lazy_match = a[B.level].max_lazy, B.good_match = a[B.level].good_length, B.nice_match = a[B.level].nice_length, B.max_chain_length = a[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = I - 1, B.match_available = 0, B.ins_h = 0;
          })(e.state), N;
        }
        function ct(e, N, B, k, y, z) {
          if (!e) return m;
          var W = 1;
          if (N === i && (N = 6), k < 0 ? (W = 0, k = -k) : 15 < k && (W = 2, k -= 16), y < 1 || E < y || B !== v || k < 8 || 15 < k || N < 0 || 9 < N || z < 0 || p < z) return et(e, m);
          k === 8 && (k = 9);
          var $ = new st();
          return (e.state = $).strm = e, $.wrap = W, $.gzhead = null, $.w_bits = k, $.w_size = 1 << $.w_bits, $.w_mask = $.w_size - 1, $.hash_bits = y + 7, $.hash_size = 1 << $.hash_bits, $.hash_mask = $.hash_size - 1, $.hash_shift = ~~(($.hash_bits + I - 1) / I), $.window = new o.Buf8(2 * $.w_size), $.head = new o.Buf16($.hash_size), $.prev = new o.Buf16($.w_size), $.lit_bufsize = 1 << y + 6, $.pending_buf_size = 4 * $.lit_bufsize, $.pending_buf = new o.Buf8($.pending_buf_size), $.d_buf = 1 * $.lit_bufsize, $.l_buf = 3 * $.lit_bufsize, $.level = N, $.strategy = z, $.method = B, it(e);
        }
        a = [new rt(0, 0, 0, 0, function(e, N) {
          var B = 65535;
          for (B > e.pending_buf_size - 5 && (B = e.pending_buf_size - 5); ; ) {
            if (e.lookahead <= 1) {
              if (nt(e), e.lookahead === 0 && N === u) return s;
              if (e.lookahead === 0) break;
            }
            e.strstart += e.lookahead, e.lookahead = 0;
            var k = e.block_start + B;
            if ((e.strstart === 0 || e.strstart >= k) && (e.lookahead = e.strstart - k, e.strstart = k, R(e, !1), e.strm.avail_out === 0) || e.strstart - e.block_start >= e.w_size - K && (R(e, !1), e.strm.avail_out === 0)) return s;
          }
          return e.insert = 0, N === g ? (R(e, !0), e.strm.avail_out === 0 ? Q : X) : (e.strstart > e.block_start && (R(e, !1), e.strm.avail_out), s);
        }), new rt(4, 4, 8, 4, lt), new rt(4, 5, 16, 8, lt), new rt(4, 6, 32, 32, lt), new rt(4, 4, 16, 16, tt), new rt(8, 16, 32, 32, tt), new rt(8, 16, 128, 128, tt), new rt(8, 32, 128, 256, tt), new rt(32, 128, 258, 1024, tt), new rt(32, 258, 258, 4096, tt)], h.deflateInit = function(e, N) {
          return ct(e, N, v, 15, 8, 0);
        }, h.deflateInit2 = ct, h.deflateReset = it, h.deflateResetKeep = ot, h.deflateSetHeader = function(e, N) {
          return e && e.state ? e.state.wrap !== 2 ? m : (e.state.gzhead = N, l) : m;
        }, h.deflate = function(e, N) {
          var B, k, y, z;
          if (!e || !e.state || 5 < N || N < 0) return e ? et(e, m) : m;
          if (k = e.state, !e.output || !e.input && e.avail_in !== 0 || k.status === 666 && N !== g) return et(e, e.avail_out === 0 ? -5 : m);
          if (k.strm = e, B = k.last_flush, k.last_flush = N, k.status === S) if (k.wrap === 2) e.adler = 0, G(k, 31), G(k, 139), G(k, 8), k.gzhead ? (G(k, (k.gzhead.text ? 1 : 0) + (k.gzhead.hcrc ? 2 : 0) + (k.gzhead.extra ? 4 : 0) + (k.gzhead.name ? 8 : 0) + (k.gzhead.comment ? 16 : 0)), G(k, 255 & k.gzhead.time), G(k, k.gzhead.time >> 8 & 255), G(k, k.gzhead.time >> 16 & 255), G(k, k.gzhead.time >> 24 & 255), G(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), G(k, 255 & k.gzhead.os), k.gzhead.extra && k.gzhead.extra.length && (G(k, 255 & k.gzhead.extra.length), G(k, k.gzhead.extra.length >> 8 & 255)), k.gzhead.hcrc && (e.adler = w(e.adler, k.pending_buf, k.pending, 0)), k.gzindex = 0, k.status = 69) : (G(k, 0), G(k, 0), G(k, 0), G(k, 0), G(k, 0), G(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), G(k, 3), k.status = F);
          else {
            var W = v + (k.w_bits - 8 << 4) << 8;
            W |= (2 <= k.strategy || k.level < 2 ? 0 : k.level < 6 ? 1 : k.level === 6 ? 2 : 3) << 6, k.strstart !== 0 && (W |= 32), W += 31 - W % 31, k.status = F, V(k, W), k.strstart !== 0 && (V(k, e.adler >>> 16), V(k, 65535 & e.adler)), e.adler = 1;
          }
          if (k.status === 69) if (k.gzhead.extra) {
            for (y = k.pending; k.gzindex < (65535 & k.gzhead.extra.length) && (k.pending !== k.pending_buf_size || (k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), C(e), y = k.pending, k.pending !== k.pending_buf_size)); ) G(k, 255 & k.gzhead.extra[k.gzindex]), k.gzindex++;
            k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), k.gzindex === k.gzhead.extra.length && (k.gzindex = 0, k.status = 73);
          } else k.status = 73;
          if (k.status === 73) if (k.gzhead.name) {
            y = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), C(e), y = k.pending, k.pending === k.pending_buf_size)) {
                z = 1;
                break;
              }
              z = k.gzindex < k.gzhead.name.length ? 255 & k.gzhead.name.charCodeAt(k.gzindex++) : 0, G(k, z);
            } while (z !== 0);
            k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), z === 0 && (k.gzindex = 0, k.status = 91);
          } else k.status = 91;
          if (k.status === 91) if (k.gzhead.comment) {
            y = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), C(e), y = k.pending, k.pending === k.pending_buf_size)) {
                z = 1;
                break;
              }
              z = k.gzindex < k.gzhead.comment.length ? 255 & k.gzhead.comment.charCodeAt(k.gzindex++) : 0, G(k, z);
            } while (z !== 0);
            k.gzhead.hcrc && k.pending > y && (e.adler = w(e.adler, k.pending_buf, k.pending - y, y)), z === 0 && (k.status = 103);
          } else k.status = 103;
          if (k.status === 103 && (k.gzhead.hcrc ? (k.pending + 2 > k.pending_buf_size && C(e), k.pending + 2 <= k.pending_buf_size && (G(k, 255 & e.adler), G(k, e.adler >> 8 & 255), e.adler = 0, k.status = F)) : k.status = F), k.pending !== 0) {
            if (C(e), e.avail_out === 0) return k.last_flush = -1, l;
          } else if (e.avail_in === 0 && M(N) <= M(B) && N !== g) return et(e, -5);
          if (k.status === 666 && e.avail_in !== 0) return et(e, -5);
          if (e.avail_in !== 0 || k.lookahead !== 0 || N !== u && k.status !== 666) {
            var $ = k.strategy === 2 ? (function(T, Z) {
              for (var q; ; ) {
                if (T.lookahead === 0 && (nt(T), T.lookahead === 0)) {
                  if (Z === u) return s;
                  break;
                }
                if (T.match_length = 0, q = n._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++, q && (R(T, !1), T.strm.avail_out === 0)) return s;
              }
              return T.insert = 0, Z === g ? (R(T, !0), T.strm.avail_out === 0 ? Q : X) : T.last_lit && (R(T, !1), T.strm.avail_out === 0) ? s : D;
            })(k, N) : k.strategy === 3 ? (function(T, Z) {
              for (var q, H, J, ht, at = T.window; ; ) {
                if (T.lookahead <= j) {
                  if (nt(T), T.lookahead <= j && Z === u) return s;
                  if (T.lookahead === 0) break;
                }
                if (T.match_length = 0, T.lookahead >= I && 0 < T.strstart && (H = at[J = T.strstart - 1]) === at[++J] && H === at[++J] && H === at[++J]) {
                  ht = T.strstart + j;
                  do
                    ;
                  while (H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && J < ht);
                  T.match_length = j - (ht - J), T.match_length > T.lookahead && (T.match_length = T.lookahead);
                }
                if (T.match_length >= I ? (q = n._tr_tally(T, 1, T.match_length - I), T.lookahead -= T.match_length, T.strstart += T.match_length, T.match_length = 0) : (q = n._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++), q && (R(T, !1), T.strm.avail_out === 0)) return s;
              }
              return T.insert = 0, Z === g ? (R(T, !0), T.strm.avail_out === 0 ? Q : X) : T.last_lit && (R(T, !1), T.strm.avail_out === 0) ? s : D;
            })(k, N) : a[k.level].func(k, N);
            if ($ !== Q && $ !== X || (k.status = 666), $ === s || $ === Q) return e.avail_out === 0 && (k.last_flush = -1), l;
            if ($ === D && (N === 1 ? n._tr_align(k) : N !== 5 && (n._tr_stored_block(k, 0, 0, !1), N === 3 && (Y(k.head), k.lookahead === 0 && (k.strstart = 0, k.block_start = 0, k.insert = 0))), C(e), e.avail_out === 0)) return k.last_flush = -1, l;
          }
          return N !== g ? l : k.wrap <= 0 ? 1 : (k.wrap === 2 ? (G(k, 255 & e.adler), G(k, e.adler >> 8 & 255), G(k, e.adler >> 16 & 255), G(k, e.adler >> 24 & 255), G(k, 255 & e.total_in), G(k, e.total_in >> 8 & 255), G(k, e.total_in >> 16 & 255), G(k, e.total_in >> 24 & 255)) : (V(k, e.adler >>> 16), V(k, 65535 & e.adler)), C(e), 0 < k.wrap && (k.wrap = -k.wrap), k.pending !== 0 ? l : 1);
        }, h.deflateEnd = function(e) {
          var N;
          return e && e.state ? (N = e.state.status) !== S && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== F && N !== 666 ? et(e, m) : (e.state = null, N === F ? et(e, -3) : l) : m;
        }, h.deflateSetDictionary = function(e, N) {
          var B, k, y, z, W, $, T, Z, q = N.length;
          if (!e || !e.state || (z = (B = e.state).wrap) === 2 || z === 1 && B.status !== S || B.lookahead) return m;
          for (z === 1 && (e.adler = c(e.adler, N, q, 0)), B.wrap = 0, q >= B.w_size && (z === 0 && (Y(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), Z = new o.Buf8(B.w_size), o.arraySet(Z, N, q - B.w_size, B.w_size, 0), N = Z, q = B.w_size), W = e.avail_in, $ = e.next_in, T = e.input, e.avail_in = q, e.next_in = 0, e.input = N, nt(B); B.lookahead >= I; ) {
            for (k = B.strstart, y = B.lookahead - (I - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[k + I - 1]) & B.hash_mask, B.prev[k & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = k, k++, --y; ) ;
            B.strstart = k, B.lookahead = I - 1, nt(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = I - 1, B.match_available = 0, e.next_in = $, e.input = T, e.avail_in = W, B.wrap = z, l;
        }, h.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(r, f, h) {
        f.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(r, f, h) {
        f.exports = function(a, o) {
          var n, c, w, _, u, g, l, m, i, p, d, v, E, x, A, P, O, L, I, j, K, S, F, s, D;
          n = a.state, c = a.next_in, s = a.input, w = c + (a.avail_in - 5), _ = a.next_out, D = a.output, u = _ - (o - a.avail_out), g = _ + (a.avail_out - 257), l = n.dmax, m = n.wsize, i = n.whave, p = n.wnext, d = n.window, v = n.hold, E = n.bits, x = n.lencode, A = n.distcode, P = (1 << n.lenbits) - 1, O = (1 << n.distbits) - 1;
          t: do {
            E < 15 && (v += s[c++] << E, E += 8, v += s[c++] << E, E += 8), L = x[v & P];
            e: for (; ; ) {
              if (v >>>= I = L >>> 24, E -= I, (I = L >>> 16 & 255) === 0) D[_++] = 65535 & L;
              else {
                if (!(16 & I)) {
                  if ((64 & I) == 0) {
                    L = x[(65535 & L) + (v & (1 << I) - 1)];
                    continue e;
                  }
                  if (32 & I) {
                    n.mode = 12;
                    break t;
                  }
                  a.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                j = 65535 & L, (I &= 15) && (E < I && (v += s[c++] << E, E += 8), j += v & (1 << I) - 1, v >>>= I, E -= I), E < 15 && (v += s[c++] << E, E += 8, v += s[c++] << E, E += 8), L = A[v & O];
                r: for (; ; ) {
                  if (v >>>= I = L >>> 24, E -= I, !(16 & (I = L >>> 16 & 255))) {
                    if ((64 & I) == 0) {
                      L = A[(65535 & L) + (v & (1 << I) - 1)];
                      continue r;
                    }
                    a.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, E < (I &= 15) && (v += s[c++] << E, (E += 8) < I && (v += s[c++] << E, E += 8)), l < (K += v & (1 << I) - 1)) {
                    a.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (v >>>= I, E -= I, (I = _ - u) < K) {
                    if (i < (I = K - I) && n.sane) {
                      a.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (F = d, (S = 0) === p) {
                      if (S += m - I, I < j) {
                        for (j -= I; D[_++] = d[S++], --I; ) ;
                        S = _ - K, F = D;
                      }
                    } else if (p < I) {
                      if (S += m + p - I, (I -= p) < j) {
                        for (j -= I; D[_++] = d[S++], --I; ) ;
                        if (S = 0, p < j) {
                          for (j -= I = p; D[_++] = d[S++], --I; ) ;
                          S = _ - K, F = D;
                        }
                      }
                    } else if (S += p - I, I < j) {
                      for (j -= I; D[_++] = d[S++], --I; ) ;
                      S = _ - K, F = D;
                    }
                    for (; 2 < j; ) D[_++] = F[S++], D[_++] = F[S++], D[_++] = F[S++], j -= 3;
                    j && (D[_++] = F[S++], 1 < j && (D[_++] = F[S++]));
                  } else {
                    for (S = _ - K; D[_++] = D[S++], D[_++] = D[S++], D[_++] = D[S++], 2 < (j -= 3); ) ;
                    j && (D[_++] = D[S++], 1 < j && (D[_++] = D[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < w && _ < g);
          c -= j = E >> 3, v &= (1 << (E -= j << 3)) - 1, a.next_in = c, a.next_out = _, a.avail_in = c < w ? w - c + 5 : 5 - (c - w), a.avail_out = _ < g ? g - _ + 257 : 257 - (_ - g), n.hold = v, n.bits = E;
        };
      }, {}], 49: [function(r, f, h) {
        var a = r("../utils/common"), o = r("./adler32"), n = r("./crc32"), c = r("./inffast"), w = r("./inftrees"), _ = 1, u = 2, g = 0, l = -2, m = 1, i = 852, p = 592;
        function d(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function v() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new a.Buf16(320), this.work = new a.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function E(S) {
          var F;
          return S && S.state ? (F = S.state, S.total_in = S.total_out = F.total = 0, S.msg = "", F.wrap && (S.adler = 1 & F.wrap), F.mode = m, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new a.Buf32(i), F.distcode = F.distdyn = new a.Buf32(p), F.sane = 1, F.back = -1, g) : l;
        }
        function x(S) {
          var F;
          return S && S.state ? ((F = S.state).wsize = 0, F.whave = 0, F.wnext = 0, E(S)) : l;
        }
        function A(S, F) {
          var s, D;
          return S && S.state ? (D = S.state, F < 0 ? (s = 0, F = -F) : (s = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? l : (D.window !== null && D.wbits !== F && (D.window = null), D.wrap = s, D.wbits = F, x(S))) : l;
        }
        function P(S, F) {
          var s, D;
          return S ? (D = new v(), (S.state = D).window = null, (s = A(S, F)) !== g && (S.state = null), s) : l;
        }
        var O, L, I = !0;
        function j(S) {
          if (I) {
            var F;
            for (O = new a.Buf32(512), L = new a.Buf32(32), F = 0; F < 144; ) S.lens[F++] = 8;
            for (; F < 256; ) S.lens[F++] = 9;
            for (; F < 280; ) S.lens[F++] = 7;
            for (; F < 288; ) S.lens[F++] = 8;
            for (w(_, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), F = 0; F < 32; ) S.lens[F++] = 5;
            w(u, S.lens, 0, 32, L, 0, S.work, { bits: 5 }), I = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = L, S.distbits = 5;
        }
        function K(S, F, s, D) {
          var Q, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new a.Buf8(X.wsize)), D >= X.wsize ? (a.arraySet(X.window, F, s - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (D < (Q = X.wsize - X.wnext) && (Q = D), a.arraySet(X.window, F, s - D, Q, X.wnext), (D -= Q) ? (a.arraySet(X.window, F, s - D, D, 0), X.wnext = D, X.whave = X.wsize) : (X.wnext += Q, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += Q))), 0;
        }
        h.inflateReset = x, h.inflateReset2 = A, h.inflateResetKeep = E, h.inflateInit = function(S) {
          return P(S, 15);
        }, h.inflateInit2 = P, h.inflate = function(S, F) {
          var s, D, Q, X, et, M, Y, C, R, G, V, U, nt, lt, tt, rt, st, ot, it, ct, e, N, B, k, y = 0, z = new a.Buf8(4), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return l;
          (s = S.state).mode === 12 && (s.mode = 13), et = S.next_out, Q = S.output, Y = S.avail_out, X = S.next_in, D = S.input, M = S.avail_in, C = s.hold, R = s.bits, G = M, V = Y, N = g;
          t: for (; ; ) switch (s.mode) {
            case m:
              if (s.wrap === 0) {
                s.mode = 13;
                break;
              }
              for (; R < 16; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if (2 & s.wrap && C === 35615) {
                z[s.check = 0] = 255 & C, z[1] = C >>> 8 & 255, s.check = n(s.check, z, 2, 0), R = C = 0, s.mode = 2;
                break;
              }
              if (s.flags = 0, s.head && (s.head.done = !1), !(1 & s.wrap) || (((255 & C) << 8) + (C >> 8)) % 31) {
                S.msg = "incorrect header check", s.mode = 30;
                break;
              }
              if ((15 & C) != 8) {
                S.msg = "unknown compression method", s.mode = 30;
                break;
              }
              if (R -= 4, e = 8 + (15 & (C >>>= 4)), s.wbits === 0) s.wbits = e;
              else if (e > s.wbits) {
                S.msg = "invalid window size", s.mode = 30;
                break;
              }
              s.dmax = 1 << e, S.adler = s.check = 1, s.mode = 512 & C ? 10 : 12, R = C = 0;
              break;
            case 2:
              for (; R < 16; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if (s.flags = C, (255 & s.flags) != 8) {
                S.msg = "unknown compression method", s.mode = 30;
                break;
              }
              if (57344 & s.flags) {
                S.msg = "unknown header flags set", s.mode = 30;
                break;
              }
              s.head && (s.head.text = C >> 8 & 1), 512 & s.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, s.check = n(s.check, z, 2, 0)), R = C = 0, s.mode = 3;
            case 3:
              for (; R < 32; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              s.head && (s.head.time = C), 512 & s.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, z[2] = C >>> 16 & 255, z[3] = C >>> 24 & 255, s.check = n(s.check, z, 4, 0)), R = C = 0, s.mode = 4;
            case 4:
              for (; R < 16; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              s.head && (s.head.xflags = 255 & C, s.head.os = C >> 8), 512 & s.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, s.check = n(s.check, z, 2, 0)), R = C = 0, s.mode = 5;
            case 5:
              if (1024 & s.flags) {
                for (; R < 16; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                s.length = C, s.head && (s.head.extra_len = C), 512 & s.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, s.check = n(s.check, z, 2, 0)), R = C = 0;
              } else s.head && (s.head.extra = null);
              s.mode = 6;
            case 6:
              if (1024 & s.flags && (M < (U = s.length) && (U = M), U && (s.head && (e = s.head.extra_len - s.length, s.head.extra || (s.head.extra = new Array(s.head.extra_len)), a.arraySet(s.head.extra, D, X, U, e)), 512 & s.flags && (s.check = n(s.check, D, U, X)), M -= U, X += U, s.length -= U), s.length)) break t;
              s.length = 0, s.mode = 7;
            case 7:
              if (2048 & s.flags) {
                if (M === 0) break t;
                for (U = 0; e = D[X + U++], s.head && e && s.length < 65536 && (s.head.name += String.fromCharCode(e)), e && U < M; ) ;
                if (512 & s.flags && (s.check = n(s.check, D, U, X)), M -= U, X += U, e) break t;
              } else s.head && (s.head.name = null);
              s.length = 0, s.mode = 8;
            case 8:
              if (4096 & s.flags) {
                if (M === 0) break t;
                for (U = 0; e = D[X + U++], s.head && e && s.length < 65536 && (s.head.comment += String.fromCharCode(e)), e && U < M; ) ;
                if (512 & s.flags && (s.check = n(s.check, D, U, X)), M -= U, X += U, e) break t;
              } else s.head && (s.head.comment = null);
              s.mode = 9;
            case 9:
              if (512 & s.flags) {
                for (; R < 16; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                if (C !== (65535 & s.check)) {
                  S.msg = "header crc mismatch", s.mode = 30;
                  break;
                }
                R = C = 0;
              }
              s.head && (s.head.hcrc = s.flags >> 9 & 1, s.head.done = !0), S.adler = s.check = 0, s.mode = 12;
              break;
            case 10:
              for (; R < 32; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              S.adler = s.check = d(C), R = C = 0, s.mode = 11;
            case 11:
              if (s.havedict === 0) return S.next_out = et, S.avail_out = Y, S.next_in = X, S.avail_in = M, s.hold = C, s.bits = R, 2;
              S.adler = s.check = 1, s.mode = 12;
            case 12:
              if (F === 5 || F === 6) break t;
            case 13:
              if (s.last) {
                C >>>= 7 & R, R -= 7 & R, s.mode = 27;
                break;
              }
              for (; R < 3; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              switch (s.last = 1 & C, R -= 1, 3 & (C >>>= 1)) {
                case 0:
                  s.mode = 14;
                  break;
                case 1:
                  if (j(s), s.mode = 20, F !== 6) break;
                  C >>>= 2, R -= 2;
                  break t;
                case 2:
                  s.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", s.mode = 30;
              }
              C >>>= 2, R -= 2;
              break;
            case 14:
              for (C >>>= 7 & R, R -= 7 & R; R < 32; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if ((65535 & C) != (C >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", s.mode = 30;
                break;
              }
              if (s.length = 65535 & C, R = C = 0, s.mode = 15, F === 6) break t;
            case 15:
              s.mode = 16;
            case 16:
              if (U = s.length) {
                if (M < U && (U = M), Y < U && (U = Y), U === 0) break t;
                a.arraySet(Q, D, X, U, et), M -= U, X += U, Y -= U, et += U, s.length -= U;
                break;
              }
              s.mode = 12;
              break;
            case 17:
              for (; R < 14; ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if (s.nlen = 257 + (31 & C), C >>>= 5, R -= 5, s.ndist = 1 + (31 & C), C >>>= 5, R -= 5, s.ncode = 4 + (15 & C), C >>>= 4, R -= 4, 286 < s.nlen || 30 < s.ndist) {
                S.msg = "too many length or distance symbols", s.mode = 30;
                break;
              }
              s.have = 0, s.mode = 18;
            case 18:
              for (; s.have < s.ncode; ) {
                for (; R < 3; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                s.lens[W[s.have++]] = 7 & C, C >>>= 3, R -= 3;
              }
              for (; s.have < 19; ) s.lens[W[s.have++]] = 0;
              if (s.lencode = s.lendyn, s.lenbits = 7, B = { bits: s.lenbits }, N = w(0, s.lens, 0, 19, s.lencode, 0, s.work, B), s.lenbits = B.bits, N) {
                S.msg = "invalid code lengths set", s.mode = 30;
                break;
              }
              s.have = 0, s.mode = 19;
            case 19:
              for (; s.have < s.nlen + s.ndist; ) {
                for (; rt = (y = s.lencode[C & (1 << s.lenbits) - 1]) >>> 16 & 255, st = 65535 & y, !((tt = y >>> 24) <= R); ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                if (st < 16) C >>>= tt, R -= tt, s.lens[s.have++] = st;
                else {
                  if (st === 16) {
                    for (k = tt + 2; R < k; ) {
                      if (M === 0) break t;
                      M--, C += D[X++] << R, R += 8;
                    }
                    if (C >>>= tt, R -= tt, s.have === 0) {
                      S.msg = "invalid bit length repeat", s.mode = 30;
                      break;
                    }
                    e = s.lens[s.have - 1], U = 3 + (3 & C), C >>>= 2, R -= 2;
                  } else if (st === 17) {
                    for (k = tt + 3; R < k; ) {
                      if (M === 0) break t;
                      M--, C += D[X++] << R, R += 8;
                    }
                    R -= tt, e = 0, U = 3 + (7 & (C >>>= tt)), C >>>= 3, R -= 3;
                  } else {
                    for (k = tt + 7; R < k; ) {
                      if (M === 0) break t;
                      M--, C += D[X++] << R, R += 8;
                    }
                    R -= tt, e = 0, U = 11 + (127 & (C >>>= tt)), C >>>= 7, R -= 7;
                  }
                  if (s.have + U > s.nlen + s.ndist) {
                    S.msg = "invalid bit length repeat", s.mode = 30;
                    break;
                  }
                  for (; U--; ) s.lens[s.have++] = e;
                }
              }
              if (s.mode === 30) break;
              if (s.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", s.mode = 30;
                break;
              }
              if (s.lenbits = 9, B = { bits: s.lenbits }, N = w(_, s.lens, 0, s.nlen, s.lencode, 0, s.work, B), s.lenbits = B.bits, N) {
                S.msg = "invalid literal/lengths set", s.mode = 30;
                break;
              }
              if (s.distbits = 6, s.distcode = s.distdyn, B = { bits: s.distbits }, N = w(u, s.lens, s.nlen, s.ndist, s.distcode, 0, s.work, B), s.distbits = B.bits, N) {
                S.msg = "invalid distances set", s.mode = 30;
                break;
              }
              if (s.mode = 20, F === 6) break t;
            case 20:
              s.mode = 21;
            case 21:
              if (6 <= M && 258 <= Y) {
                S.next_out = et, S.avail_out = Y, S.next_in = X, S.avail_in = M, s.hold = C, s.bits = R, c(S, V), et = S.next_out, Q = S.output, Y = S.avail_out, X = S.next_in, D = S.input, M = S.avail_in, C = s.hold, R = s.bits, s.mode === 12 && (s.back = -1);
                break;
              }
              for (s.back = 0; rt = (y = s.lencode[C & (1 << s.lenbits) - 1]) >>> 16 & 255, st = 65535 & y, !((tt = y >>> 24) <= R); ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if (rt && (240 & rt) == 0) {
                for (ot = tt, it = rt, ct = st; rt = (y = s.lencode[ct + ((C & (1 << ot + it) - 1) >> ot)]) >>> 16 & 255, st = 65535 & y, !(ot + (tt = y >>> 24) <= R); ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                C >>>= ot, R -= ot, s.back += ot;
              }
              if (C >>>= tt, R -= tt, s.back += tt, s.length = st, rt === 0) {
                s.mode = 26;
                break;
              }
              if (32 & rt) {
                s.back = -1, s.mode = 12;
                break;
              }
              if (64 & rt) {
                S.msg = "invalid literal/length code", s.mode = 30;
                break;
              }
              s.extra = 15 & rt, s.mode = 22;
            case 22:
              if (s.extra) {
                for (k = s.extra; R < k; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                s.length += C & (1 << s.extra) - 1, C >>>= s.extra, R -= s.extra, s.back += s.extra;
              }
              s.was = s.length, s.mode = 23;
            case 23:
              for (; rt = (y = s.distcode[C & (1 << s.distbits) - 1]) >>> 16 & 255, st = 65535 & y, !((tt = y >>> 24) <= R); ) {
                if (M === 0) break t;
                M--, C += D[X++] << R, R += 8;
              }
              if ((240 & rt) == 0) {
                for (ot = tt, it = rt, ct = st; rt = (y = s.distcode[ct + ((C & (1 << ot + it) - 1) >> ot)]) >>> 16 & 255, st = 65535 & y, !(ot + (tt = y >>> 24) <= R); ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                C >>>= ot, R -= ot, s.back += ot;
              }
              if (C >>>= tt, R -= tt, s.back += tt, 64 & rt) {
                S.msg = "invalid distance code", s.mode = 30;
                break;
              }
              s.offset = st, s.extra = 15 & rt, s.mode = 24;
            case 24:
              if (s.extra) {
                for (k = s.extra; R < k; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                s.offset += C & (1 << s.extra) - 1, C >>>= s.extra, R -= s.extra, s.back += s.extra;
              }
              if (s.offset > s.dmax) {
                S.msg = "invalid distance too far back", s.mode = 30;
                break;
              }
              s.mode = 25;
            case 25:
              if (Y === 0) break t;
              if (U = V - Y, s.offset > U) {
                if ((U = s.offset - U) > s.whave && s.sane) {
                  S.msg = "invalid distance too far back", s.mode = 30;
                  break;
                }
                nt = U > s.wnext ? (U -= s.wnext, s.wsize - U) : s.wnext - U, U > s.length && (U = s.length), lt = s.window;
              } else lt = Q, nt = et - s.offset, U = s.length;
              for (Y < U && (U = Y), Y -= U, s.length -= U; Q[et++] = lt[nt++], --U; ) ;
              s.length === 0 && (s.mode = 21);
              break;
            case 26:
              if (Y === 0) break t;
              Q[et++] = s.length, Y--, s.mode = 21;
              break;
            case 27:
              if (s.wrap) {
                for (; R < 32; ) {
                  if (M === 0) break t;
                  M--, C |= D[X++] << R, R += 8;
                }
                if (V -= Y, S.total_out += V, s.total += V, V && (S.adler = s.check = s.flags ? n(s.check, Q, V, et - V) : o(s.check, Q, V, et - V)), V = Y, (s.flags ? C : d(C)) !== s.check) {
                  S.msg = "incorrect data check", s.mode = 30;
                  break;
                }
                R = C = 0;
              }
              s.mode = 28;
            case 28:
              if (s.wrap && s.flags) {
                for (; R < 32; ) {
                  if (M === 0) break t;
                  M--, C += D[X++] << R, R += 8;
                }
                if (C !== (4294967295 & s.total)) {
                  S.msg = "incorrect length check", s.mode = 30;
                  break;
                }
                R = C = 0;
              }
              s.mode = 29;
            case 29:
              N = 1;
              break t;
            case 30:
              N = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return l;
          }
          return S.next_out = et, S.avail_out = Y, S.next_in = X, S.avail_in = M, s.hold = C, s.bits = R, (s.wsize || V !== S.avail_out && s.mode < 30 && (s.mode < 27 || F !== 4)) && K(S, S.output, S.next_out, V - S.avail_out) ? (s.mode = 31, -4) : (G -= S.avail_in, V -= S.avail_out, S.total_in += G, S.total_out += V, s.total += V, s.wrap && V && (S.adler = s.check = s.flags ? n(s.check, Q, V, S.next_out - V) : o(s.check, Q, V, S.next_out - V)), S.data_type = s.bits + (s.last ? 64 : 0) + (s.mode === 12 ? 128 : 0) + (s.mode === 20 || s.mode === 15 ? 256 : 0), (G == 0 && V === 0 || F === 4) && N === g && (N = -5), N);
        }, h.inflateEnd = function(S) {
          if (!S || !S.state) return l;
          var F = S.state;
          return F.window && (F.window = null), S.state = null, g;
        }, h.inflateGetHeader = function(S, F) {
          var s;
          return S && S.state ? (2 & (s = S.state).wrap) == 0 ? l : ((s.head = F).done = !1, g) : l;
        }, h.inflateSetDictionary = function(S, F) {
          var s, D = F.length;
          return S && S.state ? (s = S.state).wrap !== 0 && s.mode !== 11 ? l : s.mode === 11 && o(1, F, D, 0) !== s.check ? -3 : K(S, F, D, D) ? (s.mode = 31, -4) : (s.havedict = 1, g) : l;
        }, h.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(r, f, h) {
        var a = r("../utils/common"), o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], w = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        f.exports = function(_, u, g, l, m, i, p, d) {
          var v, E, x, A, P, O, L, I, j, K = d.bits, S = 0, F = 0, s = 0, D = 0, Q = 0, X = 0, et = 0, M = 0, Y = 0, C = 0, R = null, G = 0, V = new a.Buf16(16), U = new a.Buf16(16), nt = null, lt = 0;
          for (S = 0; S <= 15; S++) V[S] = 0;
          for (F = 0; F < l; F++) V[u[g + F]]++;
          for (Q = K, D = 15; 1 <= D && V[D] === 0; D--) ;
          if (D < Q && (Q = D), D === 0) return m[i++] = 20971520, m[i++] = 20971520, d.bits = 1, 0;
          for (s = 1; s < D && V[s] === 0; s++) ;
          for (Q < s && (Q = s), S = M = 1; S <= 15; S++) if (M <<= 1, (M -= V[S]) < 0) return -1;
          if (0 < M && (_ === 0 || D !== 1)) return -1;
          for (U[1] = 0, S = 1; S < 15; S++) U[S + 1] = U[S] + V[S];
          for (F = 0; F < l; F++) u[g + F] !== 0 && (p[U[u[g + F]]++] = F);
          if (O = _ === 0 ? (R = nt = p, 19) : _ === 1 ? (R = o, G -= 257, nt = n, lt -= 257, 256) : (R = c, nt = w, -1), S = s, P = i, et = F = C = 0, x = -1, A = (Y = 1 << (X = Q)) - 1, _ === 1 && 852 < Y || _ === 2 && 592 < Y) return 1;
          for (; ; ) {
            for (L = S - et, j = p[F] < O ? (I = 0, p[F]) : p[F] > O ? (I = nt[lt + p[F]], R[G + p[F]]) : (I = 96, 0), v = 1 << S - et, s = E = 1 << X; m[P + (C >> et) + (E -= v)] = L << 24 | I << 16 | j | 0, E !== 0; ) ;
            for (v = 1 << S - 1; C & v; ) v >>= 1;
            if (v !== 0 ? (C &= v - 1, C += v) : C = 0, F++, --V[S] == 0) {
              if (S === D) break;
              S = u[g + p[F]];
            }
            if (Q < S && (C & A) !== x) {
              for (et === 0 && (et = Q), P += s, M = 1 << (X = S - et); X + et < D && !((M -= V[X + et]) <= 0); ) X++, M <<= 1;
              if (Y += 1 << X, _ === 1 && 852 < Y || _ === 2 && 592 < Y) return 1;
              m[x = C & A] = Q << 24 | X << 16 | P - i | 0;
            }
          }
          return C !== 0 && (m[P + C] = S - et << 24 | 64 << 16 | 0), d.bits = Q, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(r, f, h) {
        f.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(r, f, h) {
        var a = r("../utils/common"), o = 0, n = 1;
        function c(y) {
          for (var z = y.length; 0 <= --z; ) y[z] = 0;
        }
        var w = 0, _ = 29, u = 256, g = u + 1 + _, l = 30, m = 19, i = 2 * g + 1, p = 15, d = 16, v = 7, E = 256, x = 16, A = 17, P = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], I = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (g + 2));
        c(K);
        var S = new Array(2 * l);
        c(S);
        var F = new Array(512);
        c(F);
        var s = new Array(256);
        c(s);
        var D = new Array(_);
        c(D);
        var Q, X, et, M = new Array(l);
        function Y(y, z, W, $, T) {
          this.static_tree = y, this.extra_bits = z, this.extra_base = W, this.elems = $, this.max_length = T, this.has_stree = y && y.length;
        }
        function C(y, z) {
          this.dyn_tree = y, this.max_code = 0, this.stat_desc = z;
        }
        function R(y) {
          return y < 256 ? F[y] : F[256 + (y >>> 7)];
        }
        function G(y, z) {
          y.pending_buf[y.pending++] = 255 & z, y.pending_buf[y.pending++] = z >>> 8 & 255;
        }
        function V(y, z, W) {
          y.bi_valid > d - W ? (y.bi_buf |= z << y.bi_valid & 65535, G(y, y.bi_buf), y.bi_buf = z >> d - y.bi_valid, y.bi_valid += W - d) : (y.bi_buf |= z << y.bi_valid & 65535, y.bi_valid += W);
        }
        function U(y, z, W) {
          V(y, W[2 * z], W[2 * z + 1]);
        }
        function nt(y, z) {
          for (var W = 0; W |= 1 & y, y >>>= 1, W <<= 1, 0 < --z; ) ;
          return W >>> 1;
        }
        function lt(y, z, W) {
          var $, T, Z = new Array(p + 1), q = 0;
          for ($ = 1; $ <= p; $++) Z[$] = q = q + W[$ - 1] << 1;
          for (T = 0; T <= z; T++) {
            var H = y[2 * T + 1];
            H !== 0 && (y[2 * T] = nt(Z[H]++, H));
          }
        }
        function tt(y) {
          var z;
          for (z = 0; z < g; z++) y.dyn_ltree[2 * z] = 0;
          for (z = 0; z < l; z++) y.dyn_dtree[2 * z] = 0;
          for (z = 0; z < m; z++) y.bl_tree[2 * z] = 0;
          y.dyn_ltree[2 * E] = 1, y.opt_len = y.static_len = 0, y.last_lit = y.matches = 0;
        }
        function rt(y) {
          8 < y.bi_valid ? G(y, y.bi_buf) : 0 < y.bi_valid && (y.pending_buf[y.pending++] = y.bi_buf), y.bi_buf = 0, y.bi_valid = 0;
        }
        function st(y, z, W, $) {
          var T = 2 * z, Z = 2 * W;
          return y[T] < y[Z] || y[T] === y[Z] && $[z] <= $[W];
        }
        function ot(y, z, W) {
          for (var $ = y.heap[W], T = W << 1; T <= y.heap_len && (T < y.heap_len && st(z, y.heap[T + 1], y.heap[T], y.depth) && T++, !st(z, $, y.heap[T], y.depth)); ) y.heap[W] = y.heap[T], W = T, T <<= 1;
          y.heap[W] = $;
        }
        function it(y, z, W) {
          var $, T, Z, q, H = 0;
          if (y.last_lit !== 0) for (; $ = y.pending_buf[y.d_buf + 2 * H] << 8 | y.pending_buf[y.d_buf + 2 * H + 1], T = y.pending_buf[y.l_buf + H], H++, $ === 0 ? U(y, T, z) : (U(y, (Z = s[T]) + u + 1, z), (q = O[Z]) !== 0 && V(y, T -= D[Z], q), U(y, Z = R(--$), W), (q = L[Z]) !== 0 && V(y, $ -= M[Z], q)), H < y.last_lit; ) ;
          U(y, E, z);
        }
        function ct(y, z) {
          var W, $, T, Z = z.dyn_tree, q = z.stat_desc.static_tree, H = z.stat_desc.has_stree, J = z.stat_desc.elems, ht = -1;
          for (y.heap_len = 0, y.heap_max = i, W = 0; W < J; W++) Z[2 * W] !== 0 ? (y.heap[++y.heap_len] = ht = W, y.depth[W] = 0) : Z[2 * W + 1] = 0;
          for (; y.heap_len < 2; ) Z[2 * (T = y.heap[++y.heap_len] = ht < 2 ? ++ht : 0)] = 1, y.depth[T] = 0, y.opt_len--, H && (y.static_len -= q[2 * T + 1]);
          for (z.max_code = ht, W = y.heap_len >> 1; 1 <= W; W--) ot(y, Z, W);
          for (T = J; W = y.heap[1], y.heap[1] = y.heap[y.heap_len--], ot(y, Z, 1), $ = y.heap[1], y.heap[--y.heap_max] = W, y.heap[--y.heap_max] = $, Z[2 * T] = Z[2 * W] + Z[2 * $], y.depth[T] = (y.depth[W] >= y.depth[$] ? y.depth[W] : y.depth[$]) + 1, Z[2 * W + 1] = Z[2 * $ + 1] = T, y.heap[1] = T++, ot(y, Z, 1), 2 <= y.heap_len; ) ;
          y.heap[--y.heap_max] = y.heap[1], (function(at, mt) {
            var At, yt, zt, dt, It, Ft, _t = mt.dyn_tree, Wt = mt.max_code, se = mt.stat_desc.static_tree, ae = mt.stat_desc.has_stree, oe = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, Rt = mt.stat_desc.max_length, Ot = 0;
            for (dt = 0; dt <= p; dt++) at.bl_count[dt] = 0;
            for (_t[2 * at.heap[at.heap_max] + 1] = 0, At = at.heap_max + 1; At < i; At++) Rt < (dt = _t[2 * _t[2 * (yt = at.heap[At]) + 1] + 1] + 1) && (dt = Rt, Ot++), _t[2 * yt + 1] = dt, Wt < yt || (at.bl_count[dt]++, It = 0, jt <= yt && (It = oe[yt - jt]), Ft = _t[2 * yt], at.opt_len += Ft * (dt + It), ae && (at.static_len += Ft * (se[2 * yt + 1] + It)));
            if (Ot !== 0) {
              do {
                for (dt = Rt - 1; at.bl_count[dt] === 0; ) dt--;
                at.bl_count[dt]--, at.bl_count[dt + 1] += 2, at.bl_count[Rt]--, Ot -= 2;
              } while (0 < Ot);
              for (dt = Rt; dt !== 0; dt--) for (yt = at.bl_count[dt]; yt !== 0; ) Wt < (zt = at.heap[--At]) || (_t[2 * zt + 1] !== dt && (at.opt_len += (dt - _t[2 * zt + 1]) * _t[2 * zt], _t[2 * zt + 1] = dt), yt--);
            }
          })(y, z), lt(Z, ht, y.bl_count);
        }
        function e(y, z, W) {
          var $, T, Z = -1, q = z[1], H = 0, J = 7, ht = 4;
          for (q === 0 && (J = 138, ht = 3), z[2 * (W + 1) + 1] = 65535, $ = 0; $ <= W; $++) T = q, q = z[2 * ($ + 1) + 1], ++H < J && T === q || (H < ht ? y.bl_tree[2 * T] += H : T !== 0 ? (T !== Z && y.bl_tree[2 * T]++, y.bl_tree[2 * x]++) : H <= 10 ? y.bl_tree[2 * A]++ : y.bl_tree[2 * P]++, Z = T, ht = (H = 0) === q ? (J = 138, 3) : T === q ? (J = 6, 3) : (J = 7, 4));
        }
        function N(y, z, W) {
          var $, T, Z = -1, q = z[1], H = 0, J = 7, ht = 4;
          for (q === 0 && (J = 138, ht = 3), $ = 0; $ <= W; $++) if (T = q, q = z[2 * ($ + 1) + 1], !(++H < J && T === q)) {
            if (H < ht) for (; U(y, T, y.bl_tree), --H != 0; ) ;
            else T !== 0 ? (T !== Z && (U(y, T, y.bl_tree), H--), U(y, x, y.bl_tree), V(y, H - 3, 2)) : H <= 10 ? (U(y, A, y.bl_tree), V(y, H - 3, 3)) : (U(y, P, y.bl_tree), V(y, H - 11, 7));
            Z = T, ht = (H = 0) === q ? (J = 138, 3) : T === q ? (J = 6, 3) : (J = 7, 4);
          }
        }
        c(M);
        var B = !1;
        function k(y, z, W, $) {
          V(y, (w << 1) + ($ ? 1 : 0), 3), (function(T, Z, q, H) {
            rt(T), G(T, q), G(T, ~q), a.arraySet(T.pending_buf, T.window, Z, q, T.pending), T.pending += q;
          })(y, z, W);
        }
        h._tr_init = function(y) {
          B || ((function() {
            var z, W, $, T, Z, q = new Array(p + 1);
            for (T = $ = 0; T < _ - 1; T++) for (D[T] = $, z = 0; z < 1 << O[T]; z++) s[$++] = T;
            for (s[$ - 1] = T, T = Z = 0; T < 16; T++) for (M[T] = Z, z = 0; z < 1 << L[T]; z++) F[Z++] = T;
            for (Z >>= 7; T < l; T++) for (M[T] = Z << 7, z = 0; z < 1 << L[T] - 7; z++) F[256 + Z++] = T;
            for (W = 0; W <= p; W++) q[W] = 0;
            for (z = 0; z <= 143; ) K[2 * z + 1] = 8, z++, q[8]++;
            for (; z <= 255; ) K[2 * z + 1] = 9, z++, q[9]++;
            for (; z <= 279; ) K[2 * z + 1] = 7, z++, q[7]++;
            for (; z <= 287; ) K[2 * z + 1] = 8, z++, q[8]++;
            for (lt(K, g + 1, q), z = 0; z < l; z++) S[2 * z + 1] = 5, S[2 * z] = nt(z, 5);
            Q = new Y(K, O, u + 1, g, p), X = new Y(S, L, 0, l, p), et = new Y(new Array(0), I, 0, m, v);
          })(), B = !0), y.l_desc = new C(y.dyn_ltree, Q), y.d_desc = new C(y.dyn_dtree, X), y.bl_desc = new C(y.bl_tree, et), y.bi_buf = 0, y.bi_valid = 0, tt(y);
        }, h._tr_stored_block = k, h._tr_flush_block = function(y, z, W, $) {
          var T, Z, q = 0;
          0 < y.level ? (y.strm.data_type === 2 && (y.strm.data_type = (function(H) {
            var J, ht = 4093624447;
            for (J = 0; J <= 31; J++, ht >>>= 1) if (1 & ht && H.dyn_ltree[2 * J] !== 0) return o;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return n;
            for (J = 32; J < u; J++) if (H.dyn_ltree[2 * J] !== 0) return n;
            return o;
          })(y)), ct(y, y.l_desc), ct(y, y.d_desc), q = (function(H) {
            var J;
            for (e(H, H.dyn_ltree, H.l_desc.max_code), e(H, H.dyn_dtree, H.d_desc.max_code), ct(H, H.bl_desc), J = m - 1; 3 <= J && H.bl_tree[2 * j[J] + 1] === 0; J--) ;
            return H.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          })(y), T = y.opt_len + 3 + 7 >>> 3, (Z = y.static_len + 3 + 7 >>> 3) <= T && (T = Z)) : T = Z = W + 5, W + 4 <= T && z !== -1 ? k(y, z, W, $) : y.strategy === 4 || Z === T ? (V(y, 2 + ($ ? 1 : 0), 3), it(y, K, S)) : (V(y, 4 + ($ ? 1 : 0), 3), (function(H, J, ht, at) {
            var mt;
            for (V(H, J - 257, 5), V(H, ht - 1, 5), V(H, at - 4, 4), mt = 0; mt < at; mt++) V(H, H.bl_tree[2 * j[mt] + 1], 3);
            N(H, H.dyn_ltree, J - 1), N(H, H.dyn_dtree, ht - 1);
          })(y, y.l_desc.max_code + 1, y.d_desc.max_code + 1, q + 1), it(y, y.dyn_ltree, y.dyn_dtree)), tt(y), $ && rt(y);
        }, h._tr_tally = function(y, z, W) {
          return y.pending_buf[y.d_buf + 2 * y.last_lit] = z >>> 8 & 255, y.pending_buf[y.d_buf + 2 * y.last_lit + 1] = 255 & z, y.pending_buf[y.l_buf + y.last_lit] = 255 & W, y.last_lit++, z === 0 ? y.dyn_ltree[2 * W]++ : (y.matches++, z--, y.dyn_ltree[2 * (s[W] + u + 1)]++, y.dyn_dtree[2 * R(z)]++), y.last_lit === y.lit_bufsize - 1;
        }, h._tr_align = function(y) {
          V(y, 2, 3), U(y, E, K), (function(z) {
            z.bi_valid === 16 ? (G(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(y);
        };
      }, { "../utils/common": 41 }], 53: [function(r, f, h) {
        f.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(r, f, h) {
        (function(a) {
          (function(o, n) {
            if (!o.setImmediate) {
              var c, w, _, u, g = 1, l = {}, m = !1, i = o.document, p = Object.getPrototypeOf && Object.getPrototypeOf(o);
              p = p && p.setTimeout ? p : o, c = {}.toString.call(o.process) === "[object process]" ? function(x) {
                process.nextTick(function() {
                  v(x);
                });
              } : (function() {
                if (o.postMessage && !o.importScripts) {
                  var x = !0, A = o.onmessage;
                  return o.onmessage = function() {
                    x = !1;
                  }, o.postMessage("", "*"), o.onmessage = A, x;
                }
              })() ? (u = "setImmediate$" + Math.random() + "$", o.addEventListener ? o.addEventListener("message", E, !1) : o.attachEvent("onmessage", E), function(x) {
                o.postMessage(u + x, "*");
              }) : o.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(x) {
                v(x.data);
              }, function(x) {
                _.port2.postMessage(x);
              }) : i && "onreadystatechange" in i.createElement("script") ? (w = i.documentElement, function(x) {
                var A = i.createElement("script");
                A.onreadystatechange = function() {
                  v(x), A.onreadystatechange = null, w.removeChild(A), A = null;
                }, w.appendChild(A);
              }) : function(x) {
                setTimeout(v, 0, x);
              }, p.setImmediate = function(x) {
                typeof x != "function" && (x = new Function("" + x));
                for (var A = new Array(arguments.length - 1), P = 0; P < A.length; P++) A[P] = arguments[P + 1];
                var O = { callback: x, args: A };
                return l[g] = O, c(g), g++;
              }, p.clearImmediate = d;
            }
            function d(x) {
              delete l[x];
            }
            function v(x) {
              if (m) setTimeout(v, 0, x);
              else {
                var A = l[x];
                if (A) {
                  m = !0;
                  try {
                    (function(P) {
                      var O = P.callback, L = P.args;
                      switch (L.length) {
                        case 0:
                          O();
                          break;
                        case 1:
                          O(L[0]);
                          break;
                        case 2:
                          O(L[0], L[1]);
                          break;
                        case 3:
                          O(L[0], L[1], L[2]);
                          break;
                        default:
                          O.apply(n, L);
                      }
                    })(A);
                  } finally {
                    d(x), m = !1;
                  }
                }
              }
            }
            function E(x) {
              x.source === o && typeof x.data == "string" && x.data.indexOf(u) === 0 && v(+x.data.slice(u.length));
            }
          })(typeof self > "u" ? a === void 0 ? this : a : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var he = ce();
const Jt = /* @__PURE__ */ le(he);
async function ue(b) {
  const t = await de(b), r = await Jt.loadAsync(t), f = [];
  return r.forEach((h, a) => {
    if (a.dir)
      return;
    const o = fe(h);
    f.push({
      name: o,
      text: () => a.async("text"),
      arrayBuffer: () => a.async("arraybuffer")
    });
  }), f;
}
async function de(b) {
  if (b instanceof ArrayBuffer)
    return b;
  if (b instanceof Blob)
    return await b.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function fe(b) {
  let t = b.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function me(b) {
  return !!b && typeof b == "object" && !(b instanceof ArrayBuffer) && !(b instanceof Uint8Array);
}
function pe(b) {
  return b instanceof Uint8Array ? b : new Uint8Array(b);
}
function ge(b) {
  return b.byteOffset === 0 && b.byteLength === b.buffer.byteLength ? b.buffer : b.slice().buffer;
}
function kt(b, t, r = 0) {
  if (b.length < r + t.length) return !1;
  for (let f = 0; f < t.length; f++)
    if (b[r + f] !== t[f]) return !1;
  return !0;
}
function ye(b) {
  return kt(b, [80, 75, 3, 4]) || kt(b, [80, 75, 5, 6]) || kt(b, [80, 75, 7, 8]) ? "zip" : kt(b, [82, 97, 114, 33, 26, 7, 0]) || kt(b, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : kt(b, [55, 122, 188, 175, 39, 28]) ? "7z" : b.length > 262 && kt(b, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Qt(b) {
  return b.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function $t(b) {
  const t = [], r = b.map((i) => Qt(i).toLowerCase()), f = (i) => r.some(i), h = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, a = /\.(drl|xln)$/i, o = r.filter((i) => h.test(i)).length, n = r.filter((i) => a.test(i) || i.includes("drill")).length, c = f((i) => i.includes("top") && i.includes("copper") || i.endsWith(".gtl")), w = f((i) => i.includes("bot") || i.includes("bottom") || i.endsWith(".gbl")), _ = f((i) => i.includes("mask") || i.includes("solder") || i.endsWith(".gts") || i.endsWith(".gbs")), u = f((i) => i.includes("silk") || i.includes("legend") || i.endsWith(".gto") || i.endsWith(".gbo")), g = f((i) => i.includes("outline") || i.includes("profile") || i.includes("edge") || i.endsWith(".gko") || i.endsWith(".gm1") || i.endsWith(".gml")), l = r.every(
    (i) => i.endsWith(".pdf") || i.endsWith(".png") || i.endsWith(".jpg") || i.endsWith(".jpeg") || i.endsWith(".svg") || i.endsWith(".txt") || i.endsWith(".md")
  );
  let m = 0;
  return b.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : l ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (o > 0 ? (m += 0.35, t.push(`Found ${o} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (m += 0.2, t.push(`Found ${n} drill-like file(s).`)), g && (m += 0.15, t.push("Found outline/profile/edge candidate.")), c && w ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (c || w) && (m += 0.1, t.push("Found at least one copper candidate.")), _ && (m += 0.05, t.push("Found solder mask candidate.")), u && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && o >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function _e(b) {
  if (me(b)) {
    const a = Object.keys(b).map(Qt), { confidence: o, reasons: n } = $t(a);
    return {
      isGerber: o >= 0.6,
      archiveType: "directory",
      confidence: o,
      reasons: n,
      files: a
    };
  }
  const t = pe(b), r = ye(t);
  if (r === "zip")
    try {
      const a = ge(t), n = (await ue(a)).map((_) => _.name), { confidence: c, reasons: w } = $t(n);
      return {
        isGerber: c >= 0.6,
        archiveType: "zip",
        confidence: c,
        reasons: w,
        files: n
      };
    } catch (a) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(a)]
      };
    }
  if (r === "rar" || r === "7z" || r === "tar")
    return {
      isGerber: !1,
      archiveType: r,
      confidence: 0.2,
      reasons: [
        `Detected ${r} archive by signature.`,
        "Archive type is not unpacked by default. Use list/detect for UX, or add a decoder to render."
      ]
    };
  const f = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return f.includes("%FSLAX") || f.includes("%MOIN") || f.includes("%MOMM") || f.includes("G04") || f.includes("%ADD") ? {
    isGerber: !0,
    archiveType: "single-file",
    confidence: 0.7,
    reasons: ["Input appears to be a single Gerber file (RS-274X markers detected)."]
  } : {
    isGerber: !1,
    archiveType: "unknown",
    confidence: 0,
    reasons: ["Input does not match known archive signatures and does not resemble a Gerber file."]
  };
}
class ft extends Error {
  constructor(t, r, f) {
    super(r), this.name = "GerberError", this.code = t, this.details = f;
  }
}
function te(b) {
  let t = b.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function be(b) {
  return b instanceof Uint8Array ? b : new Uint8Array(b);
}
function ee(b) {
  try {
    return b.slice().buffer;
  } catch {
    const t = new Uint8Array(b.byteLength);
    return t.set(b), t.buffer;
  }
}
async function we(b) {
  let t;
  try {
    t = await Jt.loadAsync(ee(b));
  } catch (n) {
    throw new ft(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      n
    );
  }
  const r = {}, f = 1e3, h = 100 * 1024 * 1024, a = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (a.length > f)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${a.length} > ${f})`
    );
  let o = 0;
  for (const [n, c] of a)
    try {
      const w = te(n), _ = await c.async("arraybuffer");
      if (o += _.byteLength, o > h)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${h} bytes)`
        );
      r[w] = new Uint8Array(_);
    } catch (w) {
      console.warn(`Failed to extract file ${n}:`, w);
    }
  if (Object.keys(r).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return r;
}
async function ve(b, t) {
  let r;
  try {
    const u = await import("./libarchive-Bt1VdZR0.js");
    r = u.Archive ?? u.default?.Archive;
  } catch (u) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      u
    );
  }
  if (!r)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      r.init({ workerUrl: t.workerUrl });
    } catch (u) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        u
      );
    }
  let f;
  try {
    const u = new Blob([ee(b)], { type: "application/octet-stream" });
    f = await r.open(u);
  } catch (u) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", u);
  }
  let h;
  try {
    h = await Promise.race([
      f.extractFiles(),
      new Promise(
        (u, g) => setTimeout(() => g(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (u) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", u);
  }
  const a = {};
  let o = 0;
  const n = 1e3, c = 100 * 1024 * 1024;
  let w = 0;
  async function _(u, g) {
    if (o >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const l of Object.keys(u)) {
      const m = u[l], i = g ? `${g}/${l}` : l;
      if (m instanceof File || m instanceof Blob) {
        o++;
        try {
          const p = await m.arrayBuffer();
          if (w += p.byteLength, w > c)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${c} bytes)`
            );
          a[te(i)] = new Uint8Array(p);
        } catch (p) {
          console.warn(`Failed to extract file ${i}:`, p);
        }
      } else m && typeof m == "object" && await _(m, i);
    }
  }
  try {
    await _(h, "");
  } finally {
    if (f && typeof f.close == "function")
      try {
        await f.close();
      } catch (u) {
        console.warn("Failed to close archive:", u);
      }
  }
  if (Object.keys(a).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return a;
}
async function re(b, t) {
  if (!b || b.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const r = be(b), f = 100 * 1024 * 1024;
  if (r.length > f)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${r.length} bytes) exceeds maximum allowed size (${f} bytes)`
    );
  let h;
  try {
    h = await _e(r);
  } catch (a) {
    throw new ft("PARSE_ERROR", "Failed to detect archive type", a);
  }
  if (!h.isGerber)
    throw new ft(
      "NOT_GERBER",
      h.reasons.join("; ") || "Not a Gerber bundle",
      h
    );
  try {
    if (h.archiveType === "zip")
      return { archiveType: "zip", files: await we(r) };
    if (h.archiveType === "rar")
      return { archiveType: "rar", files: await ve(r, t) };
    throw new ft(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${h.archiveType}`,
      h
    );
  } catch (a) {
    throw a instanceof ft ? a : new ft(
      "PARSE_ERROR",
      a instanceof Error ? a.message : "Unknown error during extraction",
      { error: a, det: h }
    );
  }
}
function Lt(b) {
  return b.toLowerCase();
}
function wt(b, t) {
  const r = new Set(t.map((h) => h.toLowerCase()));
  return b.filter((h) => {
    const a = Lt(h), o = a.lastIndexOf(".");
    return o < 0 ? !1 : r.has(a.slice(o));
  }).sort((h, a) => h.length - a.length)[0];
}
function ut(b, t) {
  const r = t.map((h) => h.toLowerCase());
  return b.filter((h) => {
    const a = Lt(h);
    return r.every((o) => a.includes(o));
  }).sort((h, a) => h.length - a.length)[0];
}
function ke(b) {
  const t = b.filter((_) => {
    const u = Lt(_);
    return !(u.endsWith("/") || u.includes("__macosx") || u.endsWith(".ds_store"));
  }), r = wt(t, [".gtl"]) || ut(t, ["f_cu"]) || ut(t, ["top", "cu"]) || ut(t, ["top", "copper"]), f = wt(t, [".gbl"]) || ut(t, ["b_cu"]) || ut(t, ["bottom", "cu"]) || ut(t, ["bottom", "copper"]), h = wt(t, [".gts"]) || ut(t, ["f_mask"]) || ut(t, ["top", "mask"]), a = wt(t, [".gbs"]) || ut(t, ["b_mask"]) || ut(t, ["bottom", "mask"]), o = wt(t, [".gto"]) || ut(t, ["f_silks"]) || ut(t, ["f_silk"]) || ut(t, ["top", "silk"]), n = wt(t, [".gbo"]) || ut(t, ["b_silks"]) || ut(t, ["b_silk"]) || ut(t, ["bottom", "silk"]), c = wt(t, [".gko", ".gm1"]) || ut(t, ["edge", "cuts"]) || ut(t, ["outline"]) || ut(t, ["board", "outline"]), w = (
    // Excellon often .drl or .xln or .txt
    wt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    ut(t, ["drill"]) || ut(t, ["drills"]) || ut(t, ["npth"]) || ut(t, ["pth"])
  );
  return {
    top_copper: r,
    bottom_copper: f,
    top_mask: h,
    bottom_mask: a,
    top_silk: o,
    bottom_silk: n,
    outline: c,
    drills: w
  };
}
const xe = 0.8;
function Ct(b, t, r) {
  const f = {
    unitScale: 1,
    fmtInt: 2,
    fmtDec: 4,
    x: 0,
    y: 0,
    apertures: /* @__PURE__ */ new Map(),
    currentAperture: null,
    inRegion: !1,
    regionPaths: [],
    currentPath: [],
    currentPolarity: "dark",
    ops: [],
    tracks: [],
    arcs: [],
    flashes: [],
    regions: []
  }, h = t.split(/\r?\n/);
  for (const a of h) {
    let o = a.trim();
    if (o && !o.startsWith("G04")) {
      if (o.startsWith("%") && o.endsWith("%")) {
        Se(o, f);
        continue;
      }
      o.endsWith("*") && (o = o.slice(0, -1)), Ee(o, f);
    }
  }
  if (f.inRegion) {
    if (f.currentPath.length >= 3 && f.regionPaths.push(f.currentPath), f.regionPaths.length > 0) {
      const a = {
        loops: f.regionPaths,
        polarity: f.currentPolarity
      };
      f.regions.push(a), f.ops.push({
        kind: "region",
        polarity: f.currentPolarity,
        loops: f.regionPaths
      });
    }
    f.inRegion = !1, f.regionPaths = [], f.currentPath = [];
  }
  return {
    tracks: f.tracks,
    arcs: f.arcs,
    flashes: f.flashes,
    regions: f.regions,
    ops: f.ops
  };
}
function Se(b, t) {
  let r = b;
  if (r.startsWith("%") && (r = r.slice(1)), r.endsWith("%") && (r = r.slice(0, -1)), r.endsWith("*") && (r = r.slice(0, -1)), r.startsWith("FS")) {
    const f = /FS..X(\d)(\d)Y(\d)(\d)/.exec(r);
    if (f) {
      const h = parseInt(f[1], 10), a = parseInt(f[2], 10);
      parseInt(f[4], 10), t.fmtInt = h, t.fmtDec = a;
    }
    return;
  }
  if (r.startsWith("MO")) {
    const f = t.unitScale;
    let h = f;
    if (r.includes("MOMM") ? h = 1 : r.includes("MOIN") && (h = 25.4), h !== f) {
      const a = h / f;
      for (const o of t.apertures.values())
        o.diameterMm !== void 0 && (o.diameterMm *= a), o.widthMm !== void 0 && (o.widthMm *= a), o.heightMm !== void 0 && (o.heightMm *= a);
      t.unitScale = h;
    }
    return;
  }
  if (r.startsWith("AD")) {
    const f = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(r);
    if (!f) return;
    const h = parseInt(f[2], 10), a = f[3], o = f[4] ?? "";
    let n, c, w;
    if (o) {
      const u = o.split(/[Xx]/), g = u[0] ? parseFloat(u[0]) * t.unitScale : void 0, l = u[1] ? parseFloat(u[1]) * t.unitScale : void 0;
      a === "C" ? n = g : a === "R" || a === "O" ? (c = g, w = l, g !== void 0 && l !== void 0 ? n = Math.min(g, l) : n = g ?? l) : n = g ?? l;
    }
    const _ = {
      code: h,
      shape: a,
      diameterMm: n,
      widthMm: c,
      heightMm: w
    };
    t.apertures.set(h, _);
    return;
  }
  if (r.startsWith("LPD")) {
    t.currentPolarity = "dark";
    return;
  }
  if (r.startsWith("LPC")) {
    t.currentPolarity = "clear";
    return;
  }
}
function Ee(b, t) {
  if (b === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (b === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const _ = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(_), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let r = null;
  const f = /D0?(\d{1,3})$/.exec(b);
  if (f && (r = parseInt(f[1], 10), b = b.slice(0, b.length - f[0].length)), r !== null && r >= 10) {
    const _ = t.apertures.get(r);
    _ && (t.currentAperture = _);
    return;
  }
  const h = /X([+\-]?\d+)/.exec(b), a = /Y([+\-]?\d+)/.exec(b);
  let o = t.x, n = t.y;
  if (h && (o = Zt(h[1], t)), a && (n = Zt(a[1], t)), r === null) {
    t.x = o, t.y = n;
    return;
  }
  if (t.inRegion) {
    const _ = t.x, u = t.y;
    r === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: _, y: u }), t.currentPath.push({ x: o, y: n })) : r === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = o, t.y = n;
    return;
  }
  const c = t.x, w = t.y;
  if (r === 1) {
    if (!t.currentAperture) {
      t.x = o, t.y = n;
      return;
    }
    const _ = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: c, y: w },
      end: { x: o, y: n },
      width: _,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: c, y: w },
      end: { x: o, y: n },
      widthMm: _
    }), t.x = o, t.y = n;
    return;
  }
  if (r === 2) {
    t.x = o, t.y = n;
    return;
  }
  if (r === 3) {
    if (t.currentAperture) {
      const _ = t.currentAperture, u = _.diameterMm !== void 0 ? _.diameterMm : xe, g = {
        position: { x: o, y: n },
        diameterMm: u,
        shape: _.shape,
        polarity: t.currentPolarity
      };
      _.widthMm !== void 0 && (g.widthMm = _.widthMm), _.heightMm !== void 0 && (g.heightMm = _.heightMm), t.flashes.push(g), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: o, y: n },
        diameterMm: u,
        shape: _.shape,
        widthMm: _.widthMm,
        heightMm: _.heightMm
      });
    }
    t.x = o, t.y = n;
    return;
  }
}
function Zt(b, t) {
  const r = b.startsWith("-") ? -1 : 1, f = b.replace(/[+\-]/g, ""), h = parseInt(f, 10);
  if (Number.isNaN(h)) return 0;
  const a = Math.pow(10, t.fmtDec), o = h / a * t.unitScale;
  return r * o;
}
function Ae(b, t) {
  const r = t.split(/\r?\n/), f = /* @__PURE__ */ new Map();
  let h = null;
  const a = [];
  for (const o of r) {
    const n = o.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const c = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (c) {
          const w = c[1], _ = parseFloat(c[2]);
          Number.isNaN(_) || f.set(w, _);
        }
        continue;
      }
      if (n.startsWith("T") && !n.includes("C")) {
        const c = /^T(\d+)/i.exec(n);
        c && (h = c[1]);
        continue;
      }
      if (n[0] === "X" || n.includes("X")) {
        const c = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(n);
        if (!c)
          continue;
        const w = c[1], _ = c[2], u = parseFloat(w), g = parseFloat(_);
        if (Number.isNaN(u) || Number.isNaN(g))
          continue;
        const l = h && f.has(h) ? f.get(h) : 0.6;
        a.push({
          x: u,
          y: g,
          diameter: l,
          plated: !0
          // default, later you can infer from file or layer
        });
        continue;
      }
    }
  }
  return {
    name: b,
    holes: a
  };
}
function ze(b) {
  return { w: b.maxX - b.minX, h: b.maxY - b.minY };
}
function Mt(b) {
  const { w: t, h: r } = ze(b);
  return Number.isFinite(t) && Number.isFinite(r) && t > 1 && r > 1 && t < 2e3 && r < 2e3;
}
function xt(b, t) {
  if (!Number.isFinite(b) || !Number.isFinite(t) || b <= 0 || t <= 0) return 1;
  const r = b / t;
  return r > 20 && r < 35 ? 1 / 25.4 : r > 0.02 && r < 0.06 ? 25.4 : 1;
}
function Tt(b, t) {
  return t === 1 ? b : {
    ...b,
    tracks: b.tracks.map((r) => ({
      ...r,
      start: { x: r.start.x * t, y: r.start.y * t },
      end: { x: r.end.x * t, y: r.end.y * t },
      width: (r.width ?? 0) * t
    })),
    flashes: b.flashes.map((r) => ({
      ...r,
      position: { x: r.position.x * t, y: r.position.y * t },
      diameterMm: (r.diameterMm ?? 0) * t,
      widthMm: (r.widthMm ?? 0) * t,
      heightMm: (r.heightMm ?? 0) * t
    })),
    regions: b.regions.map((r) => ({
      ...r,
      loops: r.loops.map((f) => f.map((h) => ({ x: h.x * t, y: h.y * t })))
    }))
  };
}
function Re(b, t) {
  return t === 1 ? b : b.map((r) => ({ x: r.x * t, y: r.y * t, diameter: (r.diameter ?? 0) * t }));
}
function Ce(b) {
  return URL.createObjectURL(new Blob([b], { type: "image/svg+xml" }));
}
function pt(b, t, r) {
  b.minX = Math.min(b.minX, t), b.minY = Math.min(b.minY, r), b.maxX = Math.max(b.maxX, t), b.maxY = Math.max(b.maxY, r);
}
function Ut() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function vt(b) {
  const t = Ut();
  for (const r of b.tracks) {
    pt(t, r.start.x, r.start.y), pt(t, r.end.x, r.end.y);
    const f = (r.width ?? 0) / 2;
    pt(t, r.start.x - f, r.start.y - f), pt(t, r.start.x + f, r.start.y + f), pt(t, r.end.x - f, r.end.y - f), pt(t, r.end.x + f, r.end.y + f);
  }
  for (const r of b.flashes) {
    const f = (r.widthMm ?? r.diameterMm) || 0, h = (r.heightMm ?? r.diameterMm) || 0;
    pt(t, r.position.x - f / 2, r.position.y - h / 2), pt(t, r.position.x + f / 2, r.position.y + h / 2);
  }
  for (const r of b.regions)
    for (const f of r.loops) for (const h of f) pt(t, h.x, h.y);
  return t;
}
function Me(b) {
  const t = Ut();
  for (const r of b) {
    const f = (r.diameter || 0) / 2;
    pt(t, r.x - f, r.y - f), pt(t, r.x + f, r.y + f);
  }
  return t;
}
function Yt(b, t) {
  return {
    minX: Math.min(b.minX, t.minX),
    minY: Math.min(b.minY, t.minY),
    maxX: Math.max(b.maxX, t.maxX),
    maxY: Math.max(b.maxY, t.maxY)
  };
}
function bt(b) {
  return !Number.isFinite(b.minX) || !Number.isFinite(b.minY) || !Number.isFinite(b.maxX) || !Number.isFinite(b.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (b.maxX - b.minX < 1e-6 && (b.maxX = b.minX + 1), b.maxY - b.minY < 1e-6 && (b.maxY = b.minY + 1), b);
}
const Te = 1e3;
function gt(b) {
  return b / 25.4 * Te;
}
function St(b, t, r) {
  const f = b - r.minX, h = r.maxY - t;
  return { x: f, y: h };
}
function Gt(b, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${t}" viewBox="0 0 ${b} ${t}">
  <rect width="${b}" height="${t}" fill="white"/>
</svg>`.trim();
}
function ne(b) {
  let t = 1 / 0, r = 1 / 0, f = -1 / 0, h = -1 / 0;
  for (const a of b.loops)
    for (const o of a)
      t = Math.min(t, o.x), r = Math.min(r, o.y), f = Math.max(f, o.x), h = Math.max(h, o.y);
  return { minX: t, minY: r, maxX: f, maxY: h };
}
function Ie(b, t) {
  const r = (t.maxX - t.minX) * (t.maxY - t.minY);
  let f = 0, h = 0;
  for (const _ of b.regions) {
    const u = ne(_), g = (u.maxX - u.minX) * (u.maxY - u.minY);
    _.polarity === "clear" ? h = Math.max(h, g) : f = Math.max(f, g);
  }
  const a = b.tracks.filter((_) => _.polarity !== "clear").length + b.flashes.filter((_) => _.polarity !== "clear").length + b.regions.filter((_) => _.polarity !== "clear").length, o = b.tracks.filter((_) => _.polarity === "clear").length + b.flashes.filter((_) => _.polarity === "clear").length + b.regions.filter((_) => _.polarity === "clear").length, n = f > r * 0.7, c = o > a * 3, w = h > r * 0.7;
  return n ? !1 : c || w;
}
function Vt(b, t, r, f) {
  const h = t.maxX - t.minX, a = t.maxY - t.minY, o = Math.max(1, Math.round(gt(h))), n = Math.max(1, Math.round(gt(a))), c = gt(1), w = Ie(b, t), _ = w ? "white" : "black", u = (x, A) => {
    const P = x - t.minX, O = t.maxY - A;
    return { x: P * c, y: O * c };
  }, g = (x, A) => {
    if (x.kind === "track") {
      const P = u(x.start.x, x.start.y), O = u(x.end.x, x.end.y), L = Number.isFinite(x.widthMm) ? x.widthMm : 0.2, I = Math.max(1, L * c);
      return `<line x1="${P.x.toFixed(2)}" y1="${P.y.toFixed(2)}" x2="${O.x.toFixed(2)}" y2="${O.y.toFixed(2)}" stroke-width="${I.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (x.kind === "flash") {
      const P = u(x.position.x, x.position.y), O = x.widthMm ?? x.diameterMm ?? 0.8, L = x.heightMm ?? x.diameterMm ?? 0.8, I = Math.max(0.01, Number.isFinite(O) ? O : 0.8) * c, j = Math.max(0.01, Number.isFinite(L) ? L : 0.8) * c;
      if (x.shape === "R" || x.shape === "O") {
        const K = P.x - I / 2, S = P.y - j / 2, F = x.shape === "O" ? Math.min(I, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${S.toFixed(2)}" width="${I.toFixed(2)}" height="${j.toFixed(2)}" rx="${F.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const K = Math.max(1, Math.max(I, j) / 2);
        return `<circle cx="${P.x.toFixed(2)}" cy="${P.y.toFixed(2)}" r="${K.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (x.kind === "region") {
      const P = x.loops.map((O) => {
        if (!O.length) return "";
        const L = u(O[0].x, O[0].y), I = [`M ${L.x.toFixed(2)} ${L.y.toFixed(2)}`];
        for (let j = 1; j < O.length; j++) {
          const K = u(O[j].x, O[j].y);
          I.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return I.push("Z"), I.join(" ");
      }).join(" ");
      return P.trim() ? `<path d="${P}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, l = [];
  l.push(`<rect x="0" y="0" width="${o}" height="${n}" fill="${_}" fill-opacity="1" />`);
  for (const x of b.ops) {
    const A = x.polarity === "clear" ? "black" : "white", P = g(x, A);
    P && l.push(P);
  }
  console.log("[polarity counts]", {
    tracksClear: b.tracks.filter((x) => x.polarity === "clear").length,
    regionsClear: b.regions.filter((x) => x.polarity === "clear").length,
    negativePlane: w
  });
  const m = (t.maxX - t.minX) * (t.maxY - t.minY);
  let i = 0, p = 0;
  for (const x of b.regions) {
    const A = ne(x), P = (A.maxX - A.minX) * (A.maxY - A.minY);
    x.polarity === "clear" ? p = Math.max(p, P) : i = Math.max(i, P);
  }
  const d = b.tracks.filter((x) => x.polarity !== "clear").length + b.flashes.filter((x) => x.polarity !== "clear").length + b.regions.filter((x) => x.polarity !== "clear").length, v = b.tracks.filter((x) => x.polarity === "clear").length + b.flashes.filter((x) => x.polarity === "clear").length + b.regions.filter((x) => x.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: d,
    clearCount: v,
    largestDarkRegionArea: i,
    largestClearRegionArea: p,
    boardArea: m,
    negative: w
  });
  const E = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${n}" viewBox="0 0 ${o} ${n}">
  <defs>
    <mask id="${E}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${o}" height="${n}" fill="${_}" fill-opacity="1" />
      ${l.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${o}" height="${n}" fill="${r}" opacity="${f}" mask="url(#${E})" />
</svg>`.trim();
}
function Ht(b, t) {
  const r = t.maxX - t.minX, f = t.maxY - t.minY, h = Math.max(1, Math.round(gt(r))), a = Math.max(1, Math.round(gt(f))), o = Math.max(1e-6, gt(1)), n = "rgba(255,255,255,0.95)", c = "rgba(255,255,255,0.95)", w = b.tracks.map((g) => {
    const l = St(g.start.x, g.start.y, t), m = St(g.end.x, g.end.y, t), i = Number.isFinite(g.width) ? g.width : 0.15, p = Math.max(1, i * o);
    return `<line x1="${(l.x * o).toFixed(2)}" y1="${(l.y * o).toFixed(2)}" x2="${(m.x * o).toFixed(2)}" y2="${(m.y * o).toFixed(2)}" stroke="${n}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), _ = b.flashes.map((g) => {
    const l = St(g.position.x, g.position.y, t), m = l.x * o, i = l.y * o, p = g.widthMm ?? g.diameterMm ?? 0.6, d = g.heightMm ?? g.diameterMm ?? 0.6;
    if (g.shape === "R" || g.shape === "O") {
      const E = p * o, x = d * o, A = m - E / 2, P = i - x / 2, O = g.shape === "O" ? Math.min(E, x) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${P.toFixed(2)}" width="${E.toFixed(2)}" height="${x.toFixed(2)}" rx="${O.toFixed(2)}" fill="${c}" />`;
    }
    const v = (g.diameterMm ?? 0.6) * o / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${i.toFixed(2)}" r="${Math.max(1, v).toFixed(2)}" fill="${c}" />`;
  }), u = b.regions.map((g) => {
    const l = g.loops.map((m) => {
      if (!m.length) return "";
      const i = St(m[0].x, m[0].y, t), p = [`M ${(i.x * o).toFixed(2)} ${(i.y * o).toFixed(2)}`];
      for (let d = 1; d < m.length; d++) {
        const v = St(m[d].x, m[d].y, t);
        p.push(`L ${(v.x * o).toFixed(2)} ${(v.y * o).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return l.trim() ? `<path d="${l}" fill="${c}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${a}" viewBox="0 0 ${h} ${a}">
  ${w.join(`
  `)}
  ${_.join(`
  `)}
  ${u.join(`
  `)}
</svg>`.trim();
}
function Oe(b, t) {
  const r = t.maxX - t.minX, f = t.maxY - t.minY, h = Math.round(gt(r)), a = Math.round(gt(f)), o = gt(1), n = b.map((c) => {
    const w = St(c.x, c.y, t), _ = w.x * o, u = w.y * o, g = (c.diameter || 0.6) * o / 2;
    return `<circle cx="${_.toFixed(2)}" cy="${u.toFixed(2)}" r="${Math.max(1, g).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${a}" viewBox="0 0 ${h} ${a}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ie(b) {
  const t = Object.keys(b).filter((it) => !!it), r = ke(t), f = new TextDecoder("utf-8", { fatal: !1 }), h = async (it) => {
    if (!it) return null;
    const ct = b[it];
    return ct ? f.decode(ct) : null;
  }, a = await h(r.top_copper), o = await h(r.bottom_copper), n = await h(r.outline), c = await h(r.drills), w = await h(r.top_silk), _ = await h(r.bottom_silk), u = a ? Ct(r.top_copper || "top", a) : null, g = o ? Ct(r.bottom_copper || "bot", o) : null, l = n ? Ct(r.outline || "outline", n) : null, m = c ? Ae(r.drills || "drills", c) : null, i = m ? m.holes.map((it) => ({ x: it.x, y: it.y, diameter: it.diameter })) : [], p = w ? Ct(r.top_silk || "top_silk", w) : null, d = _ ? Ct(r.bottom_silk || "bot_silk", _) : null, v = u ? bt(vt(u)) : null, E = g ? bt(vt(g)) : null, x = l ? bt(vt(l)) : null, A = i.length ? bt(Me(i)) : null, P = p ? bt(vt(p)) : null, O = d ? bt(vt(d)) : null, L = (x && Mt(x) ? x : null) || (v && Mt(v) ? v : null) || (E && Mt(E) ? E : null) || (A && Mt(A) ? A : null), I = L ? L.maxX - L.minX : 1, j = v ? xt(v.maxX - v.minX, I) : 1, K = E ? xt(E.maxX - E.minX, I) : 1, S = x ? xt(x.maxX - x.minX, I) : 1, F = A ? xt(A.maxX - A.minX, I) : 1, s = P ? xt(P.maxX - P.minX, I) : 1, D = O ? xt(O.maxX - O.minX, I) : 1, Q = u ? Tt(u, j) : null, X = g ? Tt(g, K) : null, et = l ? Tt(l, S) : null, M = i.length ? Re(i, F) : [], Y = p ? Tt(p, s) : null, C = d ? Tt(d, D) : null;
  let R = null;
  if (et) {
    const it = bt(vt(et));
    Mt(it) && (R = it);
  }
  if (!R) {
    let it = Ut();
    Q && (it = Yt(it, vt(Q))), X && (it = Yt(it, vt(X))), it = bt(it), R = it;
  }
  const G = bt(R), V = G.maxX - G.minX, U = G.maxY - G.minY, nt = {
    board: {
      width_in: V / 25.4,
      height_in: U / 25.4,
      mm_bounds: {
        min_x_mm: G.minX,
        min_y_mm: G.minY,
        max_x_mm: G.maxX,
        max_y_mm: G.maxY
      }
    }
  }, lt = Math.max(1, Math.round(gt(V))), tt = Math.max(1, Math.round(gt(U))), rt = [], st = (it) => {
    const ct = Ce(it);
    return rt.push(ct), ct;
  }, ot = {
    top_board_mask: st(Gt(lt, tt)),
    bottom_board_mask: st(Gt(lt, tt))
  };
  return Q && (ot.top_copper = st(Vt(Q, G, "#fbbf24", 1))), X && (ot.bottom_copper = st(Vt(X, G, "#38bdf8", 1))), M.length && (ot.drills = st(Oe(M, G))), Y && (ot.top_silk = st(Ht(Y, G))), C && (ot.bottom_silk = st(Ht(C, G))), {
    boardGeom: nt,
    layers: ot,
    revoke: () => rt.forEach((it) => URL.revokeObjectURL(it))
  };
}
async function Ge(b) {
  const t = b instanceof Uint8Array ? b.byteOffset === 0 && b.byteLength === b.buffer.byteLength ? b.buffer : b.slice().buffer : b instanceof ArrayBuffer ? b : await b.arrayBuffer(), { files: r, archiveType: f } = await re(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (f !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${f}`);
  return await ie(r);
}
async function Ve(b, t) {
  const { files: r } = await re(b, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ie(r);
}
function Dt(b, t) {
  const [
    r,
    f,
    h,
    a,
    o,
    n,
    c,
    w,
    _
  ] = b, [
    u,
    g,
    l,
    m,
    i,
    p,
    d,
    v,
    E
  ] = t;
  return [
    r * u + f * m + h * d,
    r * g + f * i + h * v,
    r * l + f * p + h * E,
    a * u + o * m + n * d,
    a * g + o * i + n * v,
    a * l + o * p + n * E,
    c * u + w * m + _ * d,
    c * g + w * i + _ * v,
    c * l + w * p + _ * E
  ];
}
function qt(b, t) {
  return [1, 0, b, 0, 1, t, 0, 0, 1];
}
function Be(b, t) {
  return [b, 0, 0, 0, t, 0, 0, 0, 1];
}
function Pe(b) {
  const t = Math.cos(b), r = Math.sin(b);
  return [t, -r, 0, r, t, 0, 0, 0, 1];
}
function Kt(b, t) {
  const r = b[0] * t.x + b[1] * t.y + b[2], f = b[3] * t.x + b[4] * t.y + b[5], h = b[6] * t.x + b[7] * t.y + b[8];
  if (h === 0) throw new Error("Invalid transform (w=0)");
  return { x: r / h, y: f / h };
}
function Fe(b) {
  const t = b[0], r = b[1], f = b[2], h = b[3], a = b[4], o = b[5], n = t * a - r * h;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const c = 1 / n, w = a * c, _ = -r * c, u = -h * c, g = t * c, l = -(w * f + _ * o), m = -(u * f + g * o);
  return [w, _, l, u, g, m, 0, 0, 1];
}
class Ne {
  constructor(t, r) {
    this.camera = {
      center_mm: t.center_mm,
      zoom: t.zoom,
      rotation_rad: t.rotation_rad ?? 0,
      mirrorX: t.mirrorX ?? !1,
      mirrorY: t.mirrorY ?? !1
    }, this.viewport = r, this.worldToScreenMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.screenToWorldMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.recompute();
  }
  setCamera(t) {
    this.camera = {
      ...this.camera,
      ...t,
      center_mm: t.center_mm ?? this.camera.center_mm,
      rotation_rad: t.rotation_rad ?? this.camera.rotation_rad,
      zoom: t.zoom ?? this.camera.zoom,
      mirrorX: t.mirrorX ?? this.camera.mirrorX,
      mirrorY: t.mirrorY ?? this.camera.mirrorY
    }, this.recompute();
  }
  setViewport(t) {
    this.viewport = t, this.recompute();
  }
  getCamera() {
    return this.camera;
  }
  getViewport() {
    return this.viewport;
  }
  getWorldToScreenMatrix() {
    return this.worldToScreenMat;
  }
  getScreenToWorldMatrix() {
    return this.screenToWorldMat;
  }
  boardToScreen(t) {
    return Kt(this.worldToScreenMat, t);
  }
  screenToBoard(t) {
    return Kt(this.screenToWorldMat, t);
  }
  recompute() {
    const { width_px: t, height_px: r } = this.viewport, { center_mm: f, zoom: h, rotation_rad: a, mirrorX: o, mirrorY: n } = this.camera, c = { x: t / 2, y: r / 2 }, w = n ? -1 : 1, _ = o ? -1 : 1, u = qt(-f.x, -f.y), g = Pe(a), l = Be(h * _, h * w), m = qt(c.x, c.y), i = Dt(m, Dt(l, Dt(g, u)));
    this.worldToScreenMat = i, this.screenToWorldMat = Fe(i);
  }
}
class De {
  constructor(t) {
    this.onFrame = t, this.pending = !1, this.reasons = /* @__PURE__ */ new Set();
  }
  requestRender(t = "unknown") {
    this.reasons.add(t), !this.pending && (this.pending = !0, requestAnimationFrame(() => {
      this.pending = !1;
      const r = Array.from(this.reasons);
      this.reasons.clear(), this.onFrame(r);
    }));
  }
  isPending() {
    return this.pending;
  }
  getPendingReasons() {
    return Array.from(this.reasons);
  }
}
class Le {
  // Default getter
  constructor(t, r) {
    this.passes = [], this.visibilityGetter = () => this.visibility, this.canvas = t;
    const f = t.getContext("2d");
    if (!f) throw new Error("Unable to get 2D context");
    this.ctx = f;
    const h = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new Ne(r, h), this.visibility = {
      gerber: {
        copper: !0,
        solderMask: !0,
        silk: !0,
        outline: !0
      },
      overlays: {},
      markers: !0
    }, this.scheduler = new De(() => this.render()), this.registerDefaultPasses(), this.setupResizeHandling();
  }
  // Method to set the visibility getter
  setVisibilityGetter(t) {
    this.visibilityGetter = t;
  }
  setupResizeHandling() {
    new ResizeObserver(() => {
      this.requestRender("canvas-resize");
    }).observe(this.canvas);
  }
  registerDefaultPasses() {
  }
  addPass(t) {
    this.passes.push(t), this.passes.sort((r, f) => r.order - f.order), this.requestRender("addPass");
  }
  removePass(t) {
    const r = this.passes.findIndex((f) => f.id === t);
    return r >= 0 ? (this.passes.splice(r, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((r) => r.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, r = this.canvas, f = { width_px: r.width, height_px: r.height };
    this.xform.setViewport(f);
    const h = {
      canvas: r,
      ctx: t,
      viewport: f,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibilityGetter(),
      // Use the getter function
      boardToScreen: (a) => this.xform.boardToScreen({ x: a.x, y: a.y }),
      screenToBoard: (a) => this.xform.screenToBoard({ x: a.x, y: a.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, r.width, r.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, r.width, r.height);
    for (const a of this.passes)
      if (a.enabled()) {
        t.save();
        try {
          a.draw(h);
        } finally {
          t.restore();
        }
      }
  }
  // Camera controls
  setCamera(t) {
    this.xform.setCamera(t), this.requestRender("camera-change");
  }
  getCamera() {
    return this.xform.getCamera();
  }
  // Visibility controls
  setVisibility(t) {
    this.visibility = {
      ...this.visibility,
      ...t,
      gerber: {
        ...this.visibility.gerber,
        ...t.gerber || {}
      },
      overlays: {
        ...this.visibility.overlays,
        ...t.overlays || {}
      }
    }, this.requestRender("visibility-change");
  }
  getVisibility() {
    return this.visibility;
  }
  // Utility methods
  screenToBoard(t, r) {
    return this.xform.screenToBoard({ x: t, y: r });
  }
  boardToScreen(t, r) {
    return this.xform.boardToScreen({ x: t, y: r });
  }
  // Debug method to get render pipeline info
  getDebugInfo() {
    return {
      passes: this.passes.map((t) => ({
        id: t.id,
        order: t.order,
        enabled: t.enabled()
      })),
      pendingRender: this.scheduler.isPending(),
      pendingReasons: this.scheduler.getPendingReasons(),
      camera: this.getCamera(),
      visibility: this.getVisibility()
    };
  }
}
class Ue {
  constructor(t) {
    this.listeners = /* @__PURE__ */ new Set(), this.state = {
      gerber: {
        copper: !0,
        solderMask: !0,
        silk: !0,
        outline: !0
      },
      overlays: {},
      markers: !0,
      ...t
    };
  }
  getState() {
    return { ...this.state };
  }
  setState(t) {
    const r = this.getState();
    this.state = {
      ...this.state,
      ...t,
      gerber: {
        ...this.state.gerber,
        ...t.gerber || {}
      },
      overlays: {
        ...this.state.overlays,
        ...t.overlays || {}
      }
    }, JSON.stringify(r) !== JSON.stringify(this.state) && this.notifyListeners();
  }
  setGerberVisibility(t, r) {
    this.state.gerber[t] !== r && (this.state.gerber[t] = r, this.notifyListeners());
  }
  setOverlayVisibility(t, r) {
    t in this.state.overlays || (this.state.overlays[t] = !1), this.state.overlays[t] !== r && (this.state.overlays[t] = r, this.notifyListeners());
  }
  setMarkersVisibility(t) {
    this.state.markers !== t && (this.state.markers = t, this.notifyListeners());
  }
  toggleGerberLayer(t) {
    this.setGerberVisibility(t, !this.state.gerber[t]);
  }
  toggleOverlay(t) {
    this.setOverlayVisibility(t, !this.state.overlays[t]);
  }
  toggleMarkers() {
    this.setMarkersVisibility(!this.state.markers);
  }
  // Subscription system for reactive updates
  subscribe(t) {
    return this.listeners.add(t), () => this.listeners.delete(t);
  }
  notifyListeners() {
    for (const t of this.listeners)
      t(this.getState());
  }
  // Utility methods
  isGerberLayerVisible(t) {
    return this.state.gerber[t];
  }
  isOverlayVisible(t) {
    return this.state.overlays[t] ?? !1;
  }
  areMarkersVisible() {
    return this.state.markers;
  }
  // Presets
  applyPreset(t) {
    switch (t) {
      case "all":
        this.setState({
          gerber: { copper: !0, solderMask: !0, silk: !0, outline: !0 },
          markers: !0
        });
        break;
      case "none":
        this.setState({
          gerber: { copper: !1, solderMask: !1, silk: !1, outline: !1 },
          markers: !1
        });
        break;
      case "copper-only":
        this.setState({
          gerber: { copper: !0, solderMask: !1, silk: !1, outline: !0 },
          markers: !1
        });
        break;
      case "minimal":
        this.setState({
          gerber: { copper: !0, solderMask: !1, silk: !1, outline: !0 },
          markers: !0
        });
        break;
    }
  }
}
const Et = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function He(b, t, r, f, h) {
  return {
    id: `gerber:${b}`,
    order: t,
    enabled: () => h().gerber[r],
    draw: (a) => {
      const o = a.ctx, n = a.xform.getWorldToScreenMatrix();
      o.setTransform(n[0], n[3], n[1], n[4], n[2], n[5]), f(o);
    }
  };
}
class We {
  constructor() {
    this.overlays = /* @__PURE__ */ new Map();
  }
  add(t) {
    this.overlays.set(t.id, t);
  }
  remove(t) {
    return this.overlays.delete(t);
  }
  get(t) {
    return this.overlays.get(t);
  }
  getSortedVisible() {
    return Array.from(this.overlays.values()).filter((t) => t.visible).sort((t, r) => t.zIndex - r.zIndex);
  }
  setVisible(t, r) {
    const f = this.overlays.get(t);
    f && (f.visible = r);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function je(b) {
  return {
    id: "overlay:all",
    order: (Et.OVERLAYS_MIN + Et.OVERLAYS_MAX) / 2,
    enabled: () => !0,
    draw: (t) => {
      const f = b.getAll().filter((h) => t.visibility.overlays[h.id] ?? h.visible);
      f.sort((h, a) => h.zIndex - a.zIndex);
      for (const h of f)
        t.ctx.save(), h.draw(t.ctx, {
          boardToScreen: t.boardToScreen,
          screenToBoard: t.screenToBoard,
          xform: t.xform,
          view: t.xform.getCamera()
        }), t.ctx.restore();
    }
  };
}
class Xe {
  constructor() {
    this.markers = /* @__PURE__ */ new Map();
  }
  add(t) {
    this.markers.set(t.id, t);
  }
  remove(t) {
    return this.markers.delete(t);
  }
  get(t) {
    return this.markers.get(t);
  }
  getAll() {
    return Array.from(this.markers.values());
  }
  clear() {
    this.markers.clear();
  }
  draw(t) {
    const r = t.ctx, f = t.xform.getCamera().zoom;
    if (!(f < 2)) {
      r.setTransform(1, 0, 0, 1, 0, 0);
      for (const a of this.markers.values()) {
        const o = t.boardToScreen(a.position);
        o.x < -10 || o.x > t.viewport.width_px + 10 || o.y < -10 || o.y > t.viewport.height_px + 10 || this.drawMarker(r, o, a, f);
      }
    }
  }
  drawMarker(t, r, f, h) {
    const a = Math.max(3, Math.min(8, h / 5));
    switch (t.beginPath(), t.arc(r.x, r.y, a, 0, Math.PI * 2), f.type) {
      case "via":
        t.fillStyle = "rgba(0, 100, 200, 0.8)";
        break;
      case "pad":
        t.fillStyle = "rgba(200, 100, 0, 0.8)";
        break;
      case "component":
        t.fillStyle = "rgba(0, 200, 100, 0.8)";
        break;
      case "testpoint":
        t.fillStyle = "rgba(200, 0, 100, 0.8)";
        break;
      default:
        t.fillStyle = "rgba(100, 100, 100, 0.8)";
    }
    t.fill(), t.strokeStyle = "white", t.lineWidth = 1, t.stroke();
  }
}
function $e(b, t) {
  return {
    id: "markers",
    order: (Et.MARKERS_MIN + Et.MARKERS_MAX) / 2,
    enabled: () => t().markers,
    draw: (r) => b.draw(r)
  };
}
class Ze {
  draw(t, r) {
    if (!r) return;
    const f = t.ctx;
    switch (r.type) {
      case "marker":
        this.drawMarkerSelection(f, t, r.id);
        break;
      case "geometry":
        this.drawGeometrySelection(f, t, r.id);
        break;
      case "region":
        this.drawRegionSelection(f, t, r.bounds);
        break;
    }
  }
  drawMarkerSelection(t, r, f) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, r, f) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, r, f) {
    if (!f) return;
    const h = r.xform.getWorldToScreenMatrix();
    t.setTransform(h[0], h[3], h[1], h[4], h[2], h[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      f.min.x,
      f.min.y,
      f.max.x - f.min.x,
      f.max.y - f.min.y
    );
  }
}
function Ye(b, t) {
  return {
    id: "selection",
    order: (Et.SELECTION_MIN + Et.SELECTION_MAX) / 2,
    enabled: () => t() !== null,
    draw: (r) => b.draw(r, t())
  };
}
function qe(b, t = {}) {
  const r = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  b.innerHTML = `
    <div class="board-viewer-root">
      <div class="viewer-header">
        <div class="viewer-header-left">
          <p class="viewer-header-title">Board viewer</p>
          <p class="viewer-header-sub" id="viewer-subtitle">Scroll to zoom, drag to pan</p>
        </div>

        <div class="viewer-header-right">
          <div class="controls">
            <div class="segment" title="Side">
              <input id="side-top" type="radio" name="side" value="top" checked />
              <label for="side-top">Top</label>

              <input id="side-bottom" type="radio" name="side" value="bottom" />
              <label for="side-bottom">Bottom</label>
            </div>

            <label class="toggle" title="Grid">
              <input type="checkbox" id="grid-toggle" />
              Grid
            </label>

            <div class="select" title="Grid units">
              Units
              <select id="grid-units">
                <option value="in" selected>in</option>
                <option value="mm">mm</option>
              </select>
            </div>

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>
            <button class="btn btn-primary" id="download-btn" type="button" title="Download">
              ${r}
              Download
            </button>
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <div id="board-viewport">
          <canvas id="render-canvas"></canvas>
          <div class="board-viewer-hint">Scroll to zoom, drag to pan.</div>
        </div>
      </div>
    </div>
  `;
  const f = b.firstElementChild, h = D(f, "#board-viewport"), a = D(f, "#render-canvas"), o = D(f, "#grid-toggle"), n = D(f, "#grid-units"), c = D(f, "#fit-btn"), w = D(f, "#download-btn"), _ = Array.from(f.querySelectorAll('input[name="side"]')), u = new Le(a, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), g = new Ue();
  u.setVisibilityGetter(() => g.getState());
  const l = new We(), m = new Xe(), i = new Ze();
  let p = null;
  function d() {
    const M = h.getBoundingClientRect(), Y = window.devicePixelRatio || 1;
    a.width = M.width * Y, a.height = M.height * Y, a.style.width = `${M.width}px`, a.style.height = `${M.height}px`, u.requestRender("resize");
  }
  const v = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (M, Y) => {
      const { xform: C, view: R } = Y, G = R.zoom, V = n.value, U = V === "mm" ? 1 : 2.54, nt = V === "mm" ? 10 : 25.4, lt = U * G, tt = nt * G;
      if (lt < 2) return;
      const rt = Y.screenToBoard({ x: 0, y: 0 }), st = Y.screenToBoard({
        x: a.width / (window.devicePixelRatio || 1),
        y: a.height / (window.devicePixelRatio || 1)
      });
      M.setTransform(1, 0, 0, 1, 0, 0), M.strokeStyle = "rgba(59, 130, 246, 0.4)", M.lineWidth = 1, M.beginPath();
      const ot = Math.floor(rt.x / U) * U, it = Math.floor(rt.y / U) * U;
      for (let ct = ot; ct <= st.x; ct += U) {
        const e = Y.boardToScreen({ x: ct, y: 0 }).x;
        M.moveTo(e, 0), M.lineTo(e, a.height);
      }
      for (let ct = it; ct <= st.y; ct += U) {
        const e = Y.boardToScreen({ x: 0, y: ct }).y;
        M.moveTo(0, e), M.lineTo(a.width, e);
      }
      if (M.stroke(), tt >= 8) {
        M.strokeStyle = "rgba(59, 130, 246, 0.7)", M.lineWidth = 1.5, M.beginPath();
        const ct = Math.floor(rt.x / nt) * nt, e = Math.floor(rt.y / nt) * nt;
        for (let N = ct; N <= st.x; N += nt) {
          const B = Y.boardToScreen({ x: N, y: 0 }).x;
          M.moveTo(B, 0), M.lineTo(B, a.height);
        }
        for (let N = e; N <= st.y; N += nt) {
          const B = Y.boardToScreen({ x: 0, y: N }).y;
          M.moveTo(0, B), M.lineTo(a.width, B);
        }
        M.stroke();
      }
    }
  };
  l.add(v), g.setOverlayVisibility("grid", !1), g.setMarkersVisibility(!1), u.addPass(je(l)), u.addPass($e(m, () => g.getState())), u.addPass(Ye(i, () => p));
  let E = null, x = {}, A = "top", P = !1;
  function O(M, Y, C) {
    if (!C) return null;
    const R = new Image();
    return R.src = C, R.addEventListener("load", () => {
      u.requestRender(`image-loaded-${M}`);
    }), {
      id: M,
      order: Y,
      enabled: () => !0,
      draw: (G) => {
        if (!R.complete) return;
        const V = G.ctx, U = G.xform.getWorldToScreenMatrix();
        V.setTransform(U[0], U[3], U[1], U[4], U[2], U[5]);
        const nt = 25.4, lt = (E?.board?.width_in || 1) * nt, tt = (E?.board?.height_in || 1) * nt;
        V.drawImage(R, 0, 0, lt, tt);
      }
    };
  }
  function L(M, Y) {
    return {
      id: M,
      order: Y,
      enabled: () => !0,
      draw: (C) => {
        if (!E?.board) return;
        const R = C.ctx, G = C.xform.getWorldToScreenMatrix();
        R.setTransform(G[0], G[3], G[1], G[4], G[2], G[5]);
        const V = (E.board.width_in || 1) * 25.4, U = (E.board.height_in || 1) * 25.4;
        R.fillStyle = "#1a5f1a", R.fillRect(0, 0, V, U), R.strokeStyle = "#0d3d0d", R.lineWidth = 0.1, R.strokeRect(0, 0, V, U);
      }
    };
  }
  function I() {
    if ([
      "layer:fr4",
      "layer:top-copper",
      "layer:bottom-copper",
      "layer:top-mask",
      "layer:bottom-mask",
      "layer:top-silk",
      "layer:bottom-silk",
      "layer:drills",
      "layer:vias"
    ].forEach((C) => {
      u.removePass(C);
    }), !E) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: A === "bottom" ? x.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: A === "bottom" ? x.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: A === "bottom" ? x.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: A === "top" ? x.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: A === "top" ? x.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: A === "top" ? x.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: x.drills },
      { id: "layer:vias", order: 45, url: x.vias }
    ].forEach((C) => {
      let R;
      C.useFR4 ? R = L(C.id, C.order) : C.url && (R = O(C.id, C.order, C.url)), R && u.addPass(R);
    }), u.requestRender("side-switch"), setTimeout(() => u.requestRender("side-switch-delayed"), 50);
  }
  function j(M = 0.08) {
    if (!E?.board) return;
    const Y = h.getBoundingClientRect(), C = E.board.width_in || 1, R = E.board.height_in || 1, G = Y.width * (1 - 2 * M), V = Y.height * (1 - 2 * M), U = C * 25.4, nt = R * 25.4, lt = G / U, tt = V / nt, rt = Math.min(lt, tt), st = U / 2, ot = nt / 2;
    u.setCamera({
      center_mm: { x: st, y: ot },
      zoom: rt
    });
  }
  a.addEventListener("wheel", (M) => {
    M.preventDefault(), P = !0;
    const Y = a.getBoundingClientRect(), C = M.clientX - Y.left, R = M.clientY - Y.top, G = u.getCamera(), V = M.deltaY < 0 ? 1.1 : 0.9, U = Math.max(0.2, Math.min(50, G.zoom * V)), nt = u.screenToBoard(C, R);
    u.setCamera({ zoom: U });
    const lt = u.screenToBoard(C, R), tt = nt.x - lt.x, rt = nt.y - lt.y, st = {
      x: G.center_mm.x + tt,
      y: G.center_mm.y + rt
    };
    u.setCamera({
      center_mm: st,
      zoom: U
    });
  }, { passive: !1 });
  let K = !1, S = null;
  a.addEventListener("mousedown", (M) => {
    if (M.button !== 0) return;
    M.preventDefault(), P = !0, K = !0;
    const Y = a.getBoundingClientRect();
    S = u.screenToBoard(
      M.clientX - Y.left,
      M.clientY - Y.top
    );
  });
  const F = (M) => {
    if (!K || !S) return;
    const Y = a.getBoundingClientRect(), C = u.screenToBoard(
      M.clientX - Y.left,
      M.clientY - Y.top
    ), R = S.x - C.x, G = S.y - C.y, V = u.getCamera();
    u.setCamera({
      center_mm: {
        x: V.center_mm.x + R,
        y: V.center_mm.y + G
      }
    });
  }, s = () => {
    K = !1, S = null;
  };
  window.addEventListener("mousemove", F), window.addEventListener("mouseup", s), o.addEventListener("change", () => {
    g.setOverlayVisibility("grid", o.checked), u.requestRender("grid-toggle");
  }), n.addEventListener("change", () => {
    g.isOverlayVisible("grid") && u.requestRender("grid-units");
  }), c.addEventListener("click", () => j(0.08)), w.addEventListener("click", () => t.onDownload?.()), _.forEach((M) => {
    M.addEventListener("change", () => {
      A = _.find((Y) => Y.checked)?.value || "top", I();
    });
  }), window.addEventListener("resize", () => {
    d(), P || j(0.08);
  }), g.subscribe(() => {
    u.requestRender("visibility-change");
  });
  function D(M, Y) {
    const C = M.querySelector(Y);
    if (!C) throw new Error(`Missing required element: ${Y}`);
    return C;
  }
  function Q(M) {
    E = M.boardGeom, x = M.layers, I(), d(), j(0.08);
  }
  function X(M) {
    A = M;
    const Y = _.find((C) => C.value === M);
    Y && (Y.checked = !0), I();
  }
  function et() {
    window.removeEventListener("mousemove", F), window.removeEventListener("mouseup", s), b.innerHTML = "";
  }
  return d(), {
    setData: Q,
    setSideMode: X,
    fit: () => j(0.08),
    dispose: et,
    // Expose new render pipeline API
    viewer: u,
    visibility: g,
    overlayRegistry: l,
    markerRenderer: m,
    setSelection: (M) => {
      p = M, u.requestRender("selection-change");
    },
    addMarker: (M) => {
      m.add(M), u.requestRender("marker-added");
    },
    removeMarker: (M) => {
      m.remove(M), u.requestRender("marker-removed");
    }
  };
}
export {
  ft as GerberError,
  Xe as MarkerRenderer,
  We as OverlayRegistry,
  De as RenderScheduler,
  Ze as SelectionRenderer,
  Le as Viewer,
  Ne as ViewportTransform,
  Ue as VisibilityManager,
  He as createGerberPass,
  qe as createIntegratedViewer,
  $e as createMarkerPass,
  je as createOverlayPass,
  Ye as createSelectionPass,
  _e as detectGerberBundle,
  Ve as renderGerbers,
  ie as renderGerbersFiles,
  Ge as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
