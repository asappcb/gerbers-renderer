var Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function me(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
function Ft(u) {
  throw new Error('Could not dynamically require "' + u + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Lt = { exports: {} };
var Gt;
function pe() {
  return Gt || (Gt = 1, (function(u, t) {
    (function(e) {
      u.exports = e();
    })(function() {
      return (function e(a, l, o) {
        function i(p, b) {
          if (!l[p]) {
            if (!a[p]) {
              var g = typeof Ft == "function" && Ft;
              if (!b && g) return g(p, !0);
              if (n) return n(p, !0);
              var m = new Error("Cannot find module '" + p + "'");
              throw m.code = "MODULE_NOT_FOUND", m;
            }
            var d = l[p] = { exports: {} };
            a[p][0].call(d.exports, function(y) {
              var s = a[p][1][y];
              return i(s || y);
            }, d, d.exports, e, a, l, o);
          }
          return l[p].exports;
        }
        for (var n = typeof Ft == "function" && Ft, h = 0; h < o.length; h++) i(o[h]);
        return i;
      })({ 1: [function(e, a, l) {
        var o = e("./utils"), i = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(h) {
          for (var p, b, g, m, d, y, s, _ = [], f = 0, w = h.length, S = w, k = o.getTypeOf(h) !== "string"; f < h.length; ) S = w - f, g = k ? (p = h[f++], b = f < w ? h[f++] : 0, f < w ? h[f++] : 0) : (p = h.charCodeAt(f++), b = f < w ? h.charCodeAt(f++) : 0, f < w ? h.charCodeAt(f++) : 0), m = p >> 2, d = (3 & p) << 4 | b >> 4, y = 1 < S ? (15 & b) << 2 | g >> 6 : 64, s = 2 < S ? 63 & g : 64, _.push(n.charAt(m) + n.charAt(d) + n.charAt(y) + n.charAt(s));
          return _.join("");
        }, l.decode = function(h) {
          var p, b, g, m, d, y, s = 0, _ = 0, f = "data:";
          if (h.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var w, S = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === n.charAt(64) && S--, h.charAt(h.length - 2) === n.charAt(64) && S--, S % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (w = i.uint8array ? new Uint8Array(0 | S) : new Array(0 | S); s < h.length; ) p = n.indexOf(h.charAt(s++)) << 2 | (m = n.indexOf(h.charAt(s++))) >> 4, b = (15 & m) << 4 | (d = n.indexOf(h.charAt(s++))) >> 2, g = (3 & d) << 6 | (y = n.indexOf(h.charAt(s++))), w[_++] = p, d !== 64 && (w[_++] = b), y !== 64 && (w[_++] = g);
          return w;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var o = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function p(b, g, m, d, y) {
          this.compressedSize = b, this.uncompressedSize = g, this.crc32 = m, this.compression = d, this.compressedContent = y;
        }
        p.prototype = { getContentWorker: function() {
          var b = new i(o.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), g = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== g.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new i(o.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, p.createWorkerFrom = function(b, g, m) {
          return b.pipe(new n()).pipe(new h("uncompressedSize")).pipe(g.compressWorker(m)).pipe(new h("compressedSize")).withStreamInfo("compression", g);
        }, a.exports = p;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, a, l) {
        var o = e("./stream/GenericWorker");
        l.STORE = { magic: "\0\0", compressWorker: function() {
          return new o("STORE compression");
        }, uncompressWorker: function() {
          return new o("STORE decompression");
        } }, l.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, a, l) {
        var o = e("./utils"), i = (function() {
          for (var n, h = [], p = 0; p < 256; p++) {
            n = p;
            for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            h[p] = n;
          }
          return h;
        })();
        a.exports = function(n, h) {
          return n !== void 0 && n.length ? o.getTypeOf(n) !== "string" ? (function(p, b, g, m) {
            var d = i, y = m + g;
            p ^= -1;
            for (var s = m; s < y; s++) p = p >>> 8 ^ d[255 & (p ^ b[s])];
            return -1 ^ p;
          })(0 | h, n, n.length, 0) : (function(p, b, g, m) {
            var d = i, y = m + g;
            p ^= -1;
            for (var s = m; s < y; s++) p = p >>> 8 ^ d[255 & (p ^ b.charCodeAt(s))];
            return -1 ^ p;
          })(0 | h, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var o = null;
        o = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: o };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var o = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), n = e("./utils"), h = e("./stream/GenericWorker"), p = o ? "uint8array" : "array";
        function b(g, m) {
          h.call(this, "FlateWorker/" + g), this._pako = null, this._pakoAction = g, this._pakoOptions = m, this.meta = {};
        }
        l.magic = "\b\0", n.inherits(b, h), b.prototype.processChunk = function(g) {
          this.meta = g.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(p, g.data), !1);
        }, b.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var g = this;
          this._pako.onData = function(m) {
            g.push({ data: m, meta: g.meta });
          };
        }, l.compressWorker = function(g) {
          return new b("Deflate", g);
        }, l.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function o(d, y) {
          var s, _ = "";
          for (s = 0; s < y; s++) _ += String.fromCharCode(255 & d), d >>>= 8;
          return _;
        }
        function i(d, y, s, _, f, w) {
          var S, k, R = d.file, T = d.compression, B = w !== p.utf8encode, W = n.transformTo("string", w(R.name)), O = n.transformTo("string", p.utf8encode(R.name)), X = R.comment, Q = n.transformTo("string", w(X)), M = n.transformTo("string", p.utf8encode(X)), D = O.length !== R.name.length, c = M.length !== X.length, L = "", tt = "", j = "", st = R.dir, Y = R.date, it = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          y && !s || (it.crc32 = d.crc32, it.compressedSize = d.compressedSize, it.uncompressedSize = d.uncompressedSize);
          var P = 0;
          y && (P |= 8), B || !D && !c || (P |= 2048);
          var I = 0, V = 0;
          st && (I |= 16), f === "UNIX" ? (V = 798, I |= (function(E, q) {
            var et = E;
            return E || (et = q ? 16893 : 33204), (65535 & et) << 16;
          })(R.unixPermissions, st)) : (V = 20, I |= (function(E) {
            return 63 & (E || 0);
          })(R.dosPermissions)), S = Y.getUTCHours(), S <<= 6, S |= Y.getUTCMinutes(), S <<= 5, S |= Y.getUTCSeconds() / 2, k = Y.getUTCFullYear() - 1980, k <<= 4, k |= Y.getUTCMonth() + 1, k <<= 5, k |= Y.getUTCDate(), D && (tt = o(1, 1) + o(b(W), 4) + O, L += "up" + o(tt.length, 2) + tt), c && (j = o(1, 1) + o(b(Q), 4) + M, L += "uc" + o(j.length, 2) + j);
          var z = "";
          return z += `
\0`, z += o(P, 2), z += T.magic, z += o(S, 2), z += o(k, 2), z += o(it.crc32, 4), z += o(it.compressedSize, 4), z += o(it.uncompressedSize, 4), z += o(W.length, 2), z += o(L.length, 2), { fileRecord: g.LOCAL_FILE_HEADER + z + W + L, dirRecord: g.CENTRAL_FILE_HEADER + o(V, 2) + z + o(Q.length, 2) + "\0\0\0\0" + o(I, 4) + o(_, 4) + W + L + Q };
        }
        var n = e("../utils"), h = e("../stream/GenericWorker"), p = e("../utf8"), b = e("../crc32"), g = e("../signature");
        function m(d, y, s, _) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = y, this.zipPlatform = s, this.encodeFileName = _, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(m, h), m.prototype.push = function(d) {
          var y = d.meta.percent || 0, s = this.entriesCount, _ = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, h.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: s ? (y + 100 * (s - _ - 1)) / s : 100 } }));
        }, m.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var y = this.streamFiles && !d.file.dir;
          if (y) {
            var s = i(d, y, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: s.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, m.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var y = this.streamFiles && !d.file.dir, s = i(d, y, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(s.dirRecord), y) this.push({ data: (function(_) {
            return g.DATA_DESCRIPTOR + o(_.crc32, 4) + o(_.compressedSize, 4) + o(_.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: s.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, m.prototype.flush = function() {
          for (var d = this.bytesWritten, y = 0; y < this.dirRecords.length; y++) this.push({ data: this.dirRecords[y], meta: { percent: 100 } });
          var s = this.bytesWritten - d, _ = (function(f, w, S, k, R) {
            var T = n.transformTo("string", R(k));
            return g.CENTRAL_DIRECTORY_END + "\0\0\0\0" + o(f, 2) + o(f, 2) + o(w, 4) + o(S, 4) + o(T.length, 2) + T;
          })(this.dirRecords.length, s, d, this.zipComment, this.encodeFileName);
          this.push({ data: _, meta: { percent: 100 } });
        }, m.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, m.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var y = this;
          return d.on("data", function(s) {
            y.processChunk(s);
          }), d.on("end", function() {
            y.closedSource(y.previous.streamInfo), y._sources.length ? y.prepareNextSource() : y.end();
          }), d.on("error", function(s) {
            y.error(s);
          }), this;
        }, m.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, m.prototype.error = function(d) {
          var y = this._sources;
          if (!h.prototype.error.call(this, d)) return !1;
          for (var s = 0; s < y.length; s++) try {
            y[s].error(d);
          } catch {
          }
          return !0;
        }, m.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var d = this._sources, y = 0; y < d.length; y++) d[y].lock();
        }, a.exports = m;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var o = e("../compressions"), i = e("./ZipFileWorker");
        l.generateWorker = function(n, h, p) {
          var b = new i(h.streamFiles, p, h.platform, h.encodeFileName), g = 0;
          try {
            n.forEach(function(m, d) {
              g++;
              var y = (function(w, S) {
                var k = w || S, R = o[k];
                if (!R) throw new Error(k + " is not a valid compression method !");
                return R;
              })(d.options.compression, h.compression), s = d.options.compressionOptions || h.compressionOptions || {}, _ = d.dir, f = d.date;
              d._compressWorker(y, s).withStreamInfo("file", { name: m, dir: _, date: f, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(b);
            }), b.entriesCount = g;
          } catch (m) {
            b.error(m);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, a, l) {
        function o() {
          if (!(this instanceof o)) return new o();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var i = new o();
            for (var n in this) typeof this[n] != "function" && (i[n] = this[n]);
            return i;
          };
        }
        (o.prototype = e("./object")).loadAsync = e("./load"), o.support = e("./support"), o.defaults = e("./defaults"), o.version = "3.10.1", o.loadAsync = function(i, n) {
          return new o().loadAsync(i, n);
        }, o.external = e("./external"), a.exports = o;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, a, l) {
        var o = e("./utils"), i = e("./external"), n = e("./utf8"), h = e("./zipEntries"), p = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function g(m) {
          return new i.Promise(function(d, y) {
            var s = m.decompressed.getContentWorker().pipe(new p());
            s.on("error", function(_) {
              y(_);
            }).on("end", function() {
              s.streamInfo.crc32 !== m.decompressed.crc32 ? y(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        a.exports = function(m, d) {
          var y = this;
          return d = o.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(m) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : o.prepareContent("the loaded zip file", m, !0, d.optimizedBinaryString, d.base64).then(function(s) {
            var _ = new h(d);
            return _.load(s), _;
          }).then(function(s) {
            var _ = [i.Promise.resolve(s)], f = s.files;
            if (d.checkCRC32) for (var w = 0; w < f.length; w++) _.push(g(f[w]));
            return i.Promise.all(_);
          }).then(function(s) {
            for (var _ = s.shift(), f = _.files, w = 0; w < f.length; w++) {
              var S = f[w], k = S.fileNameStr, R = o.resolve(S.fileNameStr);
              y.file(R, S.decompressed, { binary: !0, optimizedBinaryString: !0, date: S.date, dir: S.dir, comment: S.fileCommentStr.length ? S.fileCommentStr : null, unixPermissions: S.unixPermissions, dosPermissions: S.dosPermissions, createFolders: d.createFolders }), S.dir || (y.file(R).unsafeOriginalName = k);
            }
            return _.zipComment.length && (y.comment = _.zipComment), y;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var o = e("../utils"), i = e("../stream/GenericWorker");
        function n(h, p) {
          i.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(p);
        }
        o.inherits(n, i), n.prototype._bindStream = function(h) {
          var p = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            p.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            p.isPaused ? this.generatedError = b : p.error(b);
          }).on("end", function() {
            p.isPaused ? p._upstreamEnded = !0 : p.end();
          });
        }, n.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var o = e("readable-stream").Readable;
        function i(n, h, p) {
          o.call(this, h), this._helper = n;
          var b = this;
          n.on("data", function(g, m) {
            b.push(g) || b._helper.pause(), p && p(m);
          }).on("error", function(g) {
            b.emit("error", g);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(i, o), i.prototype._read = function() {
          this._helper.resume();
        }, a.exports = i;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, a, l) {
        a.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(o, i) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(o, i);
          if (typeof o == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(o, i);
        }, allocBuffer: function(o) {
          if (Buffer.alloc) return Buffer.alloc(o);
          var i = new Buffer(o);
          return i.fill(0), i;
        }, isBuffer: function(o) {
          return Buffer.isBuffer(o);
        }, isStream: function(o) {
          return o && typeof o.on == "function" && typeof o.pause == "function" && typeof o.resume == "function";
        } };
      }, {}], 15: [function(e, a, l) {
        function o(R, T, B) {
          var W, O = n.getTypeOf(T), X = n.extend(B || {}, b);
          X.date = X.date || /* @__PURE__ */ new Date(), X.compression !== null && (X.compression = X.compression.toUpperCase()), typeof X.unixPermissions == "string" && (X.unixPermissions = parseInt(X.unixPermissions, 8)), X.unixPermissions && 16384 & X.unixPermissions && (X.dir = !0), X.dosPermissions && 16 & X.dosPermissions && (X.dir = !0), X.dir && (R = f(R)), X.createFolders && (W = _(R)) && w.call(this, W, !0);
          var Q = O === "string" && X.binary === !1 && X.base64 === !1;
          B && B.binary !== void 0 || (X.binary = !Q), (T instanceof g && T.uncompressedSize === 0 || X.dir || !T || T.length === 0) && (X.base64 = !1, X.binary = !0, T = "", X.compression = "STORE", O = "string");
          var M = null;
          M = T instanceof g || T instanceof h ? T : y.isNode && y.isStream(T) ? new s(R, T) : n.prepareContent(R, T, X.binary, X.optimizedBinaryString, X.base64);
          var D = new m(R, M, X);
          this.files[R] = D;
        }
        var i = e("./utf8"), n = e("./utils"), h = e("./stream/GenericWorker"), p = e("./stream/StreamHelper"), b = e("./defaults"), g = e("./compressedObject"), m = e("./zipObject"), d = e("./generate"), y = e("./nodejsUtils"), s = e("./nodejs/NodejsStreamInputAdapter"), _ = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var T = R.lastIndexOf("/");
          return 0 < T ? R.substring(0, T) : "";
        }, f = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, w = function(R, T) {
          return T = T !== void 0 ? T : b.createFolders, R = f(R), this.files[R] || o.call(this, R, null, { dir: !0, createFolders: T }), this.files[R];
        };
        function S(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var T, B, W;
          for (T in this.files) W = this.files[T], (B = T.slice(this.root.length, T.length)) && T.slice(0, this.root.length) === this.root && R(B, W);
        }, filter: function(R) {
          var T = [];
          return this.forEach(function(B, W) {
            R(B, W) && T.push(W);
          }), T;
        }, file: function(R, T, B) {
          if (arguments.length !== 1) return R = this.root + R, o.call(this, R, T, B), this;
          if (S(R)) {
            var W = R;
            return this.filter(function(X, Q) {
              return !Q.dir && W.test(X);
            });
          }
          var O = this.files[this.root + R];
          return O && !O.dir ? O : null;
        }, folder: function(R) {
          if (!R) return this;
          if (S(R)) return this.filter(function(O, X) {
            return X.dir && R.test(O);
          });
          var T = this.root + R, B = w.call(this, T), W = this.clone();
          return W.root = B.name, W;
        }, remove: function(R) {
          R = this.root + R;
          var T = this.files[R];
          if (T || (R.slice(-1) !== "/" && (R += "/"), T = this.files[R]), T && !T.dir) delete this.files[R];
          else for (var B = this.filter(function(O, X) {
            return X.name.slice(0, R.length) === R;
          }), W = 0; W < B.length; W++) delete this.files[B[W].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var T, B = {};
          try {
            if ((B = n.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = B.type.toLowerCase(), B.compression = B.compression.toUpperCase(), B.type === "binarystring" && (B.type = "string"), !B.type) throw new Error("No output type specified.");
            n.checkSupport(B.type), B.platform !== "darwin" && B.platform !== "freebsd" && B.platform !== "linux" && B.platform !== "sunos" || (B.platform = "UNIX"), B.platform === "win32" && (B.platform = "DOS");
            var W = B.comment || this.comment || "";
            T = d.generateWorker(this, B, W);
          } catch (O) {
            (T = new h("error")).error(O);
          }
          return new p(T, B.type || "string", B.mimeType);
        }, generateAsync: function(R, T) {
          return this.generateInternalStream(R).accumulate(T);
        }, generateNodeStream: function(R, T) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(T);
        } };
        a.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var o = e("./DataReader");
        function i(n) {
          o.call(this, n);
          for (var h = 0; h < this.data.length; h++) n[h] = 255 & n[h];
        }
        e("../utils").inherits(i, o), i.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, i.prototype.lastIndexOfSignature = function(n) {
          for (var h = n.charCodeAt(0), p = n.charCodeAt(1), b = n.charCodeAt(2), g = n.charCodeAt(3), m = this.length - 4; 0 <= m; --m) if (this.data[m] === h && this.data[m + 1] === p && this.data[m + 2] === b && this.data[m + 3] === g) return m - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(n) {
          var h = n.charCodeAt(0), p = n.charCodeAt(1), b = n.charCodeAt(2), g = n.charCodeAt(3), m = this.readData(4);
          return h === m[0] && p === m[1] && b === m[2] && g === m[3];
        }, i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, a, l) {
        var o = e("../utils");
        function i(n) {
          this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
        }
        i.prototype = { checkOffset: function(n) {
          this.checkIndex(this.index + n);
        }, checkIndex: function(n) {
          if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
        }, setIndex: function(n) {
          this.checkIndex(n), this.index = n;
        }, skip: function(n) {
          this.setIndex(this.index + n);
        }, byteAt: function() {
        }, readInt: function(n) {
          var h, p = 0;
          for (this.checkOffset(n), h = this.index + n - 1; h >= this.index; h--) p = (p << 8) + this.byteAt(h);
          return this.index += n, p;
        }, readString: function(n) {
          return o.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, a.exports = i;
      }, { "../utils": 32 }], 19: [function(e, a, l) {
        var o = e("./Uint8ArrayReader");
        function i(n) {
          o.call(this, n);
        }
        e("../utils").inherits(i, o), i.prototype.readData = function(n) {
          this.checkOffset(n);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, a, l) {
        var o = e("./DataReader");
        function i(n) {
          o.call(this, n);
        }
        e("../utils").inherits(i, o), i.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, i.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, i.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, i.prototype.readData = function(n) {
          this.checkOffset(n);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var o = e("./ArrayReader");
        function i(n) {
          o.call(this, n);
        }
        e("../utils").inherits(i, o), i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var o = e("../utils"), i = e("../support"), n = e("./ArrayReader"), h = e("./StringReader"), p = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        a.exports = function(g) {
          var m = o.getTypeOf(g);
          return o.checkSupport(m), m !== "string" || i.uint8array ? m === "nodebuffer" ? new p(g) : i.uint8array ? new b(o.transformTo("uint8array", g)) : new n(o.transformTo("array", g)) : new h(g);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var o = e("./GenericWorker"), i = e("../utils");
        function n(h) {
          o.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        i.inherits(n, o), n.prototype.processChunk = function(h) {
          this.push({ data: i.transformTo(this.destType, h.data), meta: h.meta });
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var o = e("./GenericWorker"), i = e("../crc32");
        function n() {
          o.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, o), n.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = i(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, a.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var o = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        o.inherits(n, i), n.prototype.processChunk = function(h) {
          if (h) {
            var p = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = p + h.data.length;
          }
          i.prototype.processChunk.call(this, h);
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var o = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataWorker");
          var p = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            p.dataIsReady = !0, p.data = b, p.max = b && b.length || 0, p.type = o.getTypeOf(b), p.isPaused || p._tickAndRepeat();
          }, function(b) {
            p.error(b);
          });
        }
        o.inherits(n, i), n.prototype.cleanUp = function() {
          i.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, o.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (o.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, n.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var h = null, p = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              h = this.data.substring(this.index, p);
              break;
            case "uint8array":
              h = this.data.subarray(this.index, p);
              break;
            case "array":
            case "nodebuffer":
              h = this.data.slice(this.index, p);
          }
          return this.index = p, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, a, l) {
        function o(i) {
          this.name = i || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        o.prototype = { push: function(i) {
          this.emit("data", i);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (i) {
            this.emit("error", i);
          }
          return !0;
        }, error: function(i) {
          return !this.isFinished && (this.isPaused ? this.generatedError = i : (this.isFinished = !0, this.emit("error", i), this.previous && this.previous.error(i), this.cleanUp()), !0);
        }, on: function(i, n) {
          return this._listeners[i].push(n), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(i, n) {
          if (this._listeners[i]) for (var h = 0; h < this._listeners[i].length; h++) this._listeners[i][h].call(this, n);
        }, pipe: function(i) {
          return i.registerPrevious(this);
        }, registerPrevious: function(i) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = i.streamInfo, this.mergeStreamInfo(), this.previous = i;
          var n = this;
          return i.on("data", function(h) {
            n.processChunk(h);
          }), i.on("end", function() {
            n.end();
          }), i.on("error", function(h) {
            n.error(h);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var i = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), i = !0), this.previous && this.previous.resume(), !i;
        }, flush: function() {
        }, processChunk: function(i) {
          this.push(i);
        }, withStreamInfo: function(i, n) {
          return this.extraStreamInfo[i] = n, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var i in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, i) && (this.streamInfo[i] = this.extraStreamInfo[i]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var i = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + i : i;
        } }, a.exports = o;
      }, {}], 29: [function(e, a, l) {
        var o = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), h = e("../base64"), p = e("../support"), b = e("../external"), g = null;
        if (p.nodestream) try {
          g = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function m(y, s) {
          return new b.Promise(function(_, f) {
            var w = [], S = y._internalType, k = y._outputType, R = y._mimeType;
            y.on("data", function(T, B) {
              w.push(T), s && s(B);
            }).on("error", function(T) {
              w = [], f(T);
            }).on("end", function() {
              try {
                var T = (function(B, W, O) {
                  switch (B) {
                    case "blob":
                      return o.newBlob(o.transformTo("arraybuffer", W), O);
                    case "base64":
                      return h.encode(W);
                    default:
                      return o.transformTo(B, W);
                  }
                })(k, (function(B, W) {
                  var O, X = 0, Q = null, M = 0;
                  for (O = 0; O < W.length; O++) M += W[O].length;
                  switch (B) {
                    case "string":
                      return W.join("");
                    case "array":
                      return Array.prototype.concat.apply([], W);
                    case "uint8array":
                      for (Q = new Uint8Array(M), O = 0; O < W.length; O++) Q.set(W[O], X), X += W[O].length;
                      return Q;
                    case "nodebuffer":
                      return Buffer.concat(W);
                    default:
                      throw new Error("concat : unsupported type '" + B + "'");
                  }
                })(S, w), R);
                _(T);
              } catch (B) {
                f(B);
              }
              w = [];
            }).resume();
          });
        }
        function d(y, s, _) {
          var f = s;
          switch (s) {
            case "blob":
            case "arraybuffer":
              f = "uint8array";
              break;
            case "base64":
              f = "string";
          }
          try {
            this._internalType = f, this._outputType = s, this._mimeType = _, o.checkSupport(f), this._worker = y.pipe(new i(f)), y.lock();
          } catch (w) {
            this._worker = new n("error"), this._worker.error(w);
          }
        }
        d.prototype = { accumulate: function(y) {
          return m(this, y);
        }, on: function(y, s) {
          var _ = this;
          return y === "data" ? this._worker.on(y, function(f) {
            s.call(_, f.data, f.meta);
          }) : this._worker.on(y, function() {
            o.delay(s, arguments, _);
          }), this;
        }, resume: function() {
          return o.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(y) {
          if (o.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new g(this, { objectMode: this._outputType !== "nodebuffer" }, y);
        } }, a.exports = d;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, a, l) {
        if (l.base64 = !0, l.array = !0, l.string = !0, l.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", l.nodebuffer = typeof Buffer < "u", l.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") l.blob = !1;
        else {
          var o = new ArrayBuffer(0);
          try {
            l.blob = new Blob([o], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              i.append(o), l.blob = i.getBlob("application/zip").size === 0;
            } catch {
              l.blob = !1;
            }
          }
        }
        try {
          l.nodestream = !!e("readable-stream").Readable;
        } catch {
          l.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, a, l) {
        for (var o = e("./utils"), i = e("./support"), n = e("./nodejsUtils"), h = e("./stream/GenericWorker"), p = new Array(256), b = 0; b < 256; b++) p[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        p[254] = p[254] = 1;
        function g() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function m() {
          h.call(this, "utf-8 encode");
        }
        l.utf8encode = function(d) {
          return i.nodebuffer ? n.newBufferFrom(d, "utf-8") : (function(y) {
            var s, _, f, w, S, k = y.length, R = 0;
            for (w = 0; w < k; w++) (64512 & (_ = y.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (f = y.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (f - 56320), w++), R += _ < 128 ? 1 : _ < 2048 ? 2 : _ < 65536 ? 3 : 4;
            for (s = i.uint8array ? new Uint8Array(R) : new Array(R), w = S = 0; S < R; w++) (64512 & (_ = y.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (f = y.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (f - 56320), w++), _ < 128 ? s[S++] = _ : (_ < 2048 ? s[S++] = 192 | _ >>> 6 : (_ < 65536 ? s[S++] = 224 | _ >>> 12 : (s[S++] = 240 | _ >>> 18, s[S++] = 128 | _ >>> 12 & 63), s[S++] = 128 | _ >>> 6 & 63), s[S++] = 128 | 63 & _);
            return s;
          })(d);
        }, l.utf8decode = function(d) {
          return i.nodebuffer ? o.transformTo("nodebuffer", d).toString("utf-8") : (function(y) {
            var s, _, f, w, S = y.length, k = new Array(2 * S);
            for (s = _ = 0; s < S; ) if ((f = y[s++]) < 128) k[_++] = f;
            else if (4 < (w = p[f])) k[_++] = 65533, s += w - 1;
            else {
              for (f &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && s < S; ) f = f << 6 | 63 & y[s++], w--;
              1 < w ? k[_++] = 65533 : f < 65536 ? k[_++] = f : (f -= 65536, k[_++] = 55296 | f >> 10 & 1023, k[_++] = 56320 | 1023 & f);
            }
            return k.length !== _ && (k.subarray ? k = k.subarray(0, _) : k.length = _), o.applyFromCharCode(k);
          })(d = o.transformTo(i.uint8array ? "uint8array" : "array", d));
        }, o.inherits(g, h), g.prototype.processChunk = function(d) {
          var y = o.transformTo(i.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var s = y;
              (y = new Uint8Array(s.length + this.leftOver.length)).set(this.leftOver, 0), y.set(s, this.leftOver.length);
            } else y = this.leftOver.concat(y);
            this.leftOver = null;
          }
          var _ = (function(w, S) {
            var k;
            for ((S = S || w.length) > w.length && (S = w.length), k = S - 1; 0 <= k && (192 & w[k]) == 128; ) k--;
            return k < 0 || k === 0 ? S : k + p[w[k]] > S ? k : S;
          })(y), f = y;
          _ !== y.length && (i.uint8array ? (f = y.subarray(0, _), this.leftOver = y.subarray(_, y.length)) : (f = y.slice(0, _), this.leftOver = y.slice(_, y.length))), this.push({ data: l.utf8decode(f), meta: d.meta });
        }, g.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = g, o.inherits(m, h), m.prototype.processChunk = function(d) {
          this.push({ data: l.utf8encode(d.data), meta: d.meta });
        }, l.Utf8EncodeWorker = m;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var o = e("./support"), i = e("./base64"), n = e("./nodejsUtils"), h = e("./external");
        function p(s) {
          return s;
        }
        function b(s, _) {
          for (var f = 0; f < s.length; ++f) _[f] = 255 & s.charCodeAt(f);
          return _;
        }
        e("setimmediate"), l.newBlob = function(s, _) {
          l.checkSupport("blob");
          try {
            return new Blob([s], { type: _ });
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return f.append(s), f.getBlob(_);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var g = { stringifyByChunk: function(s, _, f) {
          var w = [], S = 0, k = s.length;
          if (k <= f) return String.fromCharCode.apply(null, s);
          for (; S < k; ) _ === "array" || _ === "nodebuffer" ? w.push(String.fromCharCode.apply(null, s.slice(S, Math.min(S + f, k)))) : w.push(String.fromCharCode.apply(null, s.subarray(S, Math.min(S + f, k)))), S += f;
          return w.join("");
        }, stringifyByChar: function(s) {
          for (var _ = "", f = 0; f < s.length; f++) _ += String.fromCharCode(s[f]);
          return _;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return o.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return o.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function m(s) {
          var _ = 65536, f = l.getTypeOf(s), w = !0;
          if (f === "uint8array" ? w = g.applyCanBeUsed.uint8array : f === "nodebuffer" && (w = g.applyCanBeUsed.nodebuffer), w) for (; 1 < _; ) try {
            return g.stringifyByChunk(s, f, _);
          } catch {
            _ = Math.floor(_ / 2);
          }
          return g.stringifyByChar(s);
        }
        function d(s, _) {
          for (var f = 0; f < s.length; f++) _[f] = s[f];
          return _;
        }
        l.applyFromCharCode = m;
        var y = {};
        y.string = { string: p, array: function(s) {
          return b(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return y.string.uint8array(s).buffer;
        }, uint8array: function(s) {
          return b(s, new Uint8Array(s.length));
        }, nodebuffer: function(s) {
          return b(s, n.allocBuffer(s.length));
        } }, y.array = { string: m, array: p, arraybuffer: function(s) {
          return new Uint8Array(s).buffer;
        }, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return n.newBufferFrom(s);
        } }, y.arraybuffer = { string: function(s) {
          return m(new Uint8Array(s));
        }, array: function(s) {
          return d(new Uint8Array(s), new Array(s.byteLength));
        }, arraybuffer: p, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return n.newBufferFrom(new Uint8Array(s));
        } }, y.uint8array = { string: m, array: function(s) {
          return d(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return s.buffer;
        }, uint8array: p, nodebuffer: function(s) {
          return n.newBufferFrom(s);
        } }, y.nodebuffer = { string: m, array: function(s) {
          return d(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return y.nodebuffer.uint8array(s).buffer;
        }, uint8array: function(s) {
          return d(s, new Uint8Array(s.length));
        }, nodebuffer: p }, l.transformTo = function(s, _) {
          if (_ = _ || "", !s) return _;
          l.checkSupport(s);
          var f = l.getTypeOf(_);
          return y[f][s](_);
        }, l.resolve = function(s) {
          for (var _ = s.split("/"), f = [], w = 0; w < _.length; w++) {
            var S = _[w];
            S === "." || S === "" && w !== 0 && w !== _.length - 1 || (S === ".." ? f.pop() : f.push(S));
          }
          return f.join("/");
        }, l.getTypeOf = function(s) {
          return typeof s == "string" ? "string" : Object.prototype.toString.call(s) === "[object Array]" ? "array" : o.nodebuffer && n.isBuffer(s) ? "nodebuffer" : o.uint8array && s instanceof Uint8Array ? "uint8array" : o.arraybuffer && s instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(s) {
          if (!o[s.toLowerCase()]) throw new Error(s + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(s) {
          var _, f, w = "";
          for (f = 0; f < (s || "").length; f++) w += "\\x" + ((_ = s.charCodeAt(f)) < 16 ? "0" : "") + _.toString(16).toUpperCase();
          return w;
        }, l.delay = function(s, _, f) {
          setImmediate(function() {
            s.apply(f || null, _ || []);
          });
        }, l.inherits = function(s, _) {
          function f() {
          }
          f.prototype = _.prototype, s.prototype = new f();
        }, l.extend = function() {
          var s, _, f = {};
          for (s = 0; s < arguments.length; s++) for (_ in arguments[s]) Object.prototype.hasOwnProperty.call(arguments[s], _) && f[_] === void 0 && (f[_] = arguments[s][_]);
          return f;
        }, l.prepareContent = function(s, _, f, w, S) {
          return h.Promise.resolve(_).then(function(k) {
            return o.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(R, T) {
              var B = new FileReader();
              B.onload = function(W) {
                R(W.target.result);
              }, B.onerror = function(W) {
                T(W.target.error);
              }, B.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var R = l.getTypeOf(k);
            return R ? (R === "arraybuffer" ? k = l.transformTo("uint8array", k) : R === "string" && (S ? k = i.decode(k) : f && w !== !0 && (k = (function(T) {
              return b(T, o.uint8array ? new Uint8Array(T.length) : new Array(T.length));
            })(k))), k) : h.Promise.reject(new Error("Can't read the data of '" + s + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var o = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), h = e("./zipEntry"), p = e("./support");
        function b(g) {
          this.files = [], this.loadOptions = g;
        }
        b.prototype = { checkSignature: function(g) {
          if (!this.reader.readAndCheckSignature(g)) {
            this.reader.index -= 4;
            var m = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(m) + ", expected " + i.pretty(g) + ")");
          }
        }, isSignature: function(g, m) {
          var d = this.reader.index;
          this.reader.setIndex(g);
          var y = this.reader.readString(4) === m;
          return this.reader.setIndex(d), y;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var g = this.reader.readData(this.zipCommentLength), m = p.uint8array ? "uint8array" : "array", d = i.transformTo(m, g);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var g, m, d, y = this.zip64EndOfCentralSize - 44; 0 < y; ) g = this.reader.readInt(2), m = this.reader.readInt(4), d = this.reader.readData(m), this.zip64ExtensibleData[g] = { id: g, length: m, value: d };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var g, m;
          for (g = 0; g < this.files.length; g++) m = this.files[g], this.reader.setIndex(m.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), m.readLocalPart(this.reader), m.handleUTF8(), m.processAttributes();
        }, readCentralDir: function() {
          var g;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (g = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(g);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var g = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (g < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(g);
          var m = g;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (g = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(g), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var d = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);
          var y = m - d;
          if (0 < y) this.isSignature(m, n.CENTRAL_FILE_HEADER) || (this.reader.zero = y);
          else if (y < 0) throw new Error("Corrupted zip: missing " + Math.abs(y) + " bytes.");
        }, prepareReader: function(g) {
          this.reader = o(g);
        }, load: function(g) {
          this.prepareReader(g), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var o = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), h = e("./crc32"), p = e("./utf8"), b = e("./compressions"), g = e("./support");
        function m(d, y) {
          this.options = d, this.loadOptions = y;
        }
        m.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var y, s;
          if (d.skip(22), this.fileNameLength = d.readInt(2), s = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(s), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((y = (function(_) {
            for (var f in b) if (Object.prototype.hasOwnProperty.call(b, f) && b[f].magic === _) return b[f];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, y, d.readData(this.compressedSize));
        }, readCentralPart: function(d) {
          this.versionMadeBy = d.readInt(2), d.skip(2), this.bitFlag = d.readInt(2), this.compressionMethod = d.readString(2), this.date = d.readDate(), this.crc32 = d.readInt(4), this.compressedSize = d.readInt(4), this.uncompressedSize = d.readInt(4);
          var y = d.readInt(2);
          if (this.extraFieldsLength = d.readInt(2), this.fileCommentLength = d.readInt(2), this.diskNumberStart = d.readInt(2), this.internalFileAttributes = d.readInt(2), this.externalFileAttributes = d.readInt(4), this.localHeaderOffset = d.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          d.skip(y), this.readExtraFields(d), this.parseZIP64ExtraField(d), this.fileComment = d.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var d = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), d == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), d == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var d = o(this.extraFields[1].value);
            this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var y, s, _, f = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < f; ) y = d.readInt(2), s = d.readInt(2), _ = d.readData(s), this.extraFields[y] = { id: y, length: s, value: _ };
          d.setIndex(f);
        }, handleUTF8: function() {
          var d = g.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = p.utf8decode(this.fileName), this.fileCommentStr = p.utf8decode(this.fileComment);
          else {
            var y = this.findExtraFieldUnicodePath();
            if (y !== null) this.fileNameStr = y;
            else {
              var s = i.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(s);
            }
            var _ = this.findExtraFieldUnicodeComment();
            if (_ !== null) this.fileCommentStr = _;
            else {
              var f = i.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var y = o(d.value);
            return y.readInt(1) !== 1 || h(this.fileName) !== y.readInt(4) ? null : p.utf8decode(y.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var y = o(d.value);
            return y.readInt(1) !== 1 || h(this.fileComment) !== y.readInt(4) ? null : p.utf8decode(y.readData(d.length - 5));
          }
          return null;
        } }, a.exports = m;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function o(y, s, _) {
          this.name = y, this.dir = _.dir, this.date = _.date, this.comment = _.comment, this.unixPermissions = _.unixPermissions, this.dosPermissions = _.dosPermissions, this._data = s, this._dataBinary = _.binary, this.options = { compression: _.compression, compressionOptions: _.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), h = e("./utf8"), p = e("./compressedObject"), b = e("./stream/GenericWorker");
        o.prototype = { internalStream: function(y) {
          var s = null, _ = "string";
          try {
            if (!y) throw new Error("No output type specified.");
            var f = (_ = y.toLowerCase()) === "string" || _ === "text";
            _ !== "binarystring" && _ !== "text" || (_ = "string"), s = this._decompressWorker();
            var w = !this._dataBinary;
            w && !f && (s = s.pipe(new h.Utf8EncodeWorker())), !w && f && (s = s.pipe(new h.Utf8DecodeWorker()));
          } catch (S) {
            (s = new b("error")).error(S);
          }
          return new i(s, _, "");
        }, async: function(y, s) {
          return this.internalStream(y).accumulate(s);
        }, nodeStream: function(y, s) {
          return this.internalStream(y || "nodebuffer").toNodejsStream(s);
        }, _compressWorker: function(y, s) {
          if (this._data instanceof p && this._data.compression.magic === y.magic) return this._data.getCompressedWorker();
          var _ = this._decompressWorker();
          return this._dataBinary || (_ = _.pipe(new h.Utf8EncodeWorker())), p.createWorkerFrom(_, y, s);
        }, _decompressWorker: function() {
          return this._data instanceof p ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
        } };
        for (var g = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], m = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < g.length; d++) o.prototype[g[d]] = m;
        a.exports = o;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(o) {
          var i, n, h = o.MutationObserver || o.WebKitMutationObserver;
          if (h) {
            var p = 0, b = new h(y), g = o.document.createTextNode("");
            b.observe(g, { characterData: !0 }), i = function() {
              g.data = p = ++p % 2;
            };
          } else if (o.setImmediate || o.MessageChannel === void 0) i = "document" in o && "onreadystatechange" in o.document.createElement("script") ? function() {
            var s = o.document.createElement("script");
            s.onreadystatechange = function() {
              y(), s.onreadystatechange = null, s.parentNode.removeChild(s), s = null;
            }, o.document.documentElement.appendChild(s);
          } : function() {
            setTimeout(y, 0);
          };
          else {
            var m = new o.MessageChannel();
            m.port1.onmessage = y, i = function() {
              m.port2.postMessage(0);
            };
          }
          var d = [];
          function y() {
            var s, _;
            n = !0;
            for (var f = d.length; f; ) {
              for (_ = d, d = [], s = -1; ++s < f; ) _[s]();
              f = d.length;
            }
            n = !1;
          }
          a.exports = function(s) {
            d.push(s) !== 1 || n || i();
          };
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var o = e("immediate");
        function i() {
        }
        var n = {}, h = ["REJECTED"], p = ["FULFILLED"], b = ["PENDING"];
        function g(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, f !== i && s(this, f);
        }
        function m(f, w, S) {
          this.promise = f, typeof w == "function" && (this.onFulfilled = w, this.callFulfilled = this.otherCallFulfilled), typeof S == "function" && (this.onRejected = S, this.callRejected = this.otherCallRejected);
        }
        function d(f, w, S) {
          o(function() {
            var k;
            try {
              k = w(S);
            } catch (R) {
              return n.reject(f, R);
            }
            k === f ? n.reject(f, new TypeError("Cannot resolve promise with itself")) : n.resolve(f, k);
          });
        }
        function y(f) {
          var w = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof w == "function") return function() {
            w.apply(f, arguments);
          };
        }
        function s(f, w) {
          var S = !1;
          function k(B) {
            S || (S = !0, n.reject(f, B));
          }
          function R(B) {
            S || (S = !0, n.resolve(f, B));
          }
          var T = _(function() {
            w(R, k);
          });
          T.status === "error" && k(T.value);
        }
        function _(f, w) {
          var S = {};
          try {
            S.value = f(w), S.status = "success";
          } catch (k) {
            S.status = "error", S.value = k;
          }
          return S;
        }
        (a.exports = g).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var w = this.constructor;
          return this.then(function(S) {
            return w.resolve(f()).then(function() {
              return S;
            });
          }, function(S) {
            return w.resolve(f()).then(function() {
              throw S;
            });
          });
        }, g.prototype.catch = function(f) {
          return this.then(null, f);
        }, g.prototype.then = function(f, w) {
          if (typeof f != "function" && this.state === p || typeof w != "function" && this.state === h) return this;
          var S = new this.constructor(i);
          return this.state !== b ? d(S, this.state === p ? f : w, this.outcome) : this.queue.push(new m(S, f, w)), S;
        }, m.prototype.callFulfilled = function(f) {
          n.resolve(this.promise, f);
        }, m.prototype.otherCallFulfilled = function(f) {
          d(this.promise, this.onFulfilled, f);
        }, m.prototype.callRejected = function(f) {
          n.reject(this.promise, f);
        }, m.prototype.otherCallRejected = function(f) {
          d(this.promise, this.onRejected, f);
        }, n.resolve = function(f, w) {
          var S = _(y, w);
          if (S.status === "error") return n.reject(f, S.value);
          var k = S.value;
          if (k) s(f, k);
          else {
            f.state = p, f.outcome = w;
            for (var R = -1, T = f.queue.length; ++R < T; ) f.queue[R].callFulfilled(w);
          }
          return f;
        }, n.reject = function(f, w) {
          f.state = h, f.outcome = w;
          for (var S = -1, k = f.queue.length; ++S < k; ) f.queue[S].callRejected(w);
          return f;
        }, g.resolve = function(f) {
          return f instanceof this ? f : n.resolve(new this(i), f);
        }, g.reject = function(f) {
          var w = new this(i);
          return n.reject(w, f);
        }, g.all = function(f) {
          var w = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = f.length, k = !1;
          if (!S) return this.resolve([]);
          for (var R = new Array(S), T = 0, B = -1, W = new this(i); ++B < S; ) O(f[B], B);
          return W;
          function O(X, Q) {
            w.resolve(X).then(function(M) {
              R[Q] = M, ++T !== S || k || (k = !0, n.resolve(W, R));
            }, function(M) {
              k || (k = !0, n.reject(W, M));
            });
          }
        }, g.race = function(f) {
          var w = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = f.length, k = !1;
          if (!S) return this.resolve([]);
          for (var R = -1, T = new this(i); ++R < S; ) B = f[R], w.resolve(B).then(function(W) {
            k || (k = !0, n.resolve(T, W));
          }, function(W) {
            k || (k = !0, n.reject(T, W));
          });
          var B;
          return T;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var o = {};
        (0, e("./lib/utils/common").assign)(o, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = o;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var o = e("./zlib/deflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/messages"), p = e("./zlib/zstream"), b = Object.prototype.toString, g = 0, m = -1, d = 0, y = 8;
        function s(f) {
          if (!(this instanceof s)) return new s(f);
          this.options = i.assign({ level: m, method: y, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, f || {});
          var w = this.options;
          w.raw && 0 < w.windowBits ? w.windowBits = -w.windowBits : w.gzip && 0 < w.windowBits && w.windowBits < 16 && (w.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p(), this.strm.avail_out = 0;
          var S = o.deflateInit2(this.strm, w.level, w.method, w.windowBits, w.memLevel, w.strategy);
          if (S !== g) throw new Error(h[S]);
          if (w.header && o.deflateSetHeader(this.strm, w.header), w.dictionary) {
            var k;
            if (k = typeof w.dictionary == "string" ? n.string2buf(w.dictionary) : b.call(w.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(w.dictionary) : w.dictionary, (S = o.deflateSetDictionary(this.strm, k)) !== g) throw new Error(h[S]);
            this._dict_set = !0;
          }
        }
        function _(f, w) {
          var S = new s(w);
          if (S.push(f, !0), S.err) throw S.msg || h[S.err];
          return S.result;
        }
        s.prototype.push = function(f, w) {
          var S, k, R = this.strm, T = this.options.chunkSize;
          if (this.ended) return !1;
          k = w === ~~w ? w : w === !0 ? 4 : 0, typeof f == "string" ? R.input = n.string2buf(f) : b.call(f) === "[object ArrayBuffer]" ? R.input = new Uint8Array(f) : R.input = f, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new i.Buf8(T), R.next_out = 0, R.avail_out = T), (S = o.deflate(R, k)) !== 1 && S !== g) return this.onEnd(S), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(i.shrinkBuf(R.output, R.next_out))) : this.onData(i.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && S !== 1);
          return k === 4 ? (S = o.deflateEnd(this.strm), this.onEnd(S), this.ended = !0, S === g) : k !== 2 || (this.onEnd(g), !(R.avail_out = 0));
        }, s.prototype.onData = function(f) {
          this.chunks.push(f);
        }, s.prototype.onEnd = function(f) {
          f === g && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, l.Deflate = s, l.deflate = _, l.deflateRaw = function(f, w) {
          return (w = w || {}).raw = !0, _(f, w);
        }, l.gzip = function(f, w) {
          return (w = w || {}).gzip = !0, _(f, w);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var o = e("./zlib/inflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/constants"), p = e("./zlib/messages"), b = e("./zlib/zstream"), g = e("./zlib/gzheader"), m = Object.prototype.toString;
        function d(s) {
          if (!(this instanceof d)) return new d(s);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, s || {});
          var _ = this.options;
          _.raw && 0 <= _.windowBits && _.windowBits < 16 && (_.windowBits = -_.windowBits, _.windowBits === 0 && (_.windowBits = -15)), !(0 <= _.windowBits && _.windowBits < 16) || s && s.windowBits || (_.windowBits += 32), 15 < _.windowBits && _.windowBits < 48 && (15 & _.windowBits) == 0 && (_.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var f = o.inflateInit2(this.strm, _.windowBits);
          if (f !== h.Z_OK) throw new Error(p[f]);
          this.header = new g(), o.inflateGetHeader(this.strm, this.header);
        }
        function y(s, _) {
          var f = new d(_);
          if (f.push(s, !0), f.err) throw f.msg || p[f.err];
          return f.result;
        }
        d.prototype.push = function(s, _) {
          var f, w, S, k, R, T, B = this.strm, W = this.options.chunkSize, O = this.options.dictionary, X = !1;
          if (this.ended) return !1;
          w = _ === ~~_ ? _ : _ === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof s == "string" ? B.input = n.binstring2buf(s) : m.call(s) === "[object ArrayBuffer]" ? B.input = new Uint8Array(s) : B.input = s, B.next_in = 0, B.avail_in = B.input.length;
          do {
            if (B.avail_out === 0 && (B.output = new i.Buf8(W), B.next_out = 0, B.avail_out = W), (f = o.inflate(B, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && O && (T = typeof O == "string" ? n.string2buf(O) : m.call(O) === "[object ArrayBuffer]" ? new Uint8Array(O) : O, f = o.inflateSetDictionary(this.strm, T)), f === h.Z_BUF_ERROR && X === !0 && (f = h.Z_OK, X = !1), f !== h.Z_STREAM_END && f !== h.Z_OK) return this.onEnd(f), !(this.ended = !0);
            B.next_out && (B.avail_out !== 0 && f !== h.Z_STREAM_END && (B.avail_in !== 0 || w !== h.Z_FINISH && w !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (S = n.utf8border(B.output, B.next_out), k = B.next_out - S, R = n.buf2string(B.output, S), B.next_out = k, B.avail_out = W - k, k && i.arraySet(B.output, B.output, S, k, 0), this.onData(R)) : this.onData(i.shrinkBuf(B.output, B.next_out)))), B.avail_in === 0 && B.avail_out === 0 && (X = !0);
          } while ((0 < B.avail_in || B.avail_out === 0) && f !== h.Z_STREAM_END);
          return f === h.Z_STREAM_END && (w = h.Z_FINISH), w === h.Z_FINISH ? (f = o.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === h.Z_OK) : w !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(B.avail_out = 0));
        }, d.prototype.onData = function(s) {
          this.chunks.push(s);
        }, d.prototype.onEnd = function(s) {
          s === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = s, this.msg = this.strm.msg;
        }, l.Inflate = d, l.inflate = y, l.inflateRaw = function(s, _) {
          return (_ = _ || {}).raw = !0, y(s, _);
        }, l.ungzip = y;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var o = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(h) {
          for (var p = Array.prototype.slice.call(arguments, 1); p.length; ) {
            var b = p.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var g in b) b.hasOwnProperty(g) && (h[g] = b[g]);
            }
          }
          return h;
        }, l.shrinkBuf = function(h, p) {
          return h.length === p ? h : h.subarray ? h.subarray(0, p) : (h.length = p, h);
        };
        var i = { arraySet: function(h, p, b, g, m) {
          if (p.subarray && h.subarray) h.set(p.subarray(b, b + g), m);
          else for (var d = 0; d < g; d++) h[m + d] = p[b + d];
        }, flattenChunks: function(h) {
          var p, b, g, m, d, y;
          for (p = g = 0, b = h.length; p < b; p++) g += h[p].length;
          for (y = new Uint8Array(g), p = m = 0, b = h.length; p < b; p++) d = h[p], y.set(d, m), m += d.length;
          return y;
        } }, n = { arraySet: function(h, p, b, g, m) {
          for (var d = 0; d < g; d++) h[m + d] = p[b + d];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        l.setTyped = function(h) {
          h ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, i)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, n));
        }, l.setTyped(o);
      }, {}], 42: [function(e, a, l) {
        var o = e("./common"), i = !0, n = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          i = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          n = !1;
        }
        for (var h = new o.Buf8(256), p = 0; p < 256; p++) h[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1;
        function b(g, m) {
          if (m < 65537 && (g.subarray && n || !g.subarray && i)) return String.fromCharCode.apply(null, o.shrinkBuf(g, m));
          for (var d = "", y = 0; y < m; y++) d += String.fromCharCode(g[y]);
          return d;
        }
        h[254] = h[254] = 1, l.string2buf = function(g) {
          var m, d, y, s, _, f = g.length, w = 0;
          for (s = 0; s < f; s++) (64512 & (d = g.charCodeAt(s))) == 55296 && s + 1 < f && (64512 & (y = g.charCodeAt(s + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (y - 56320), s++), w += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (m = new o.Buf8(w), s = _ = 0; _ < w; s++) (64512 & (d = g.charCodeAt(s))) == 55296 && s + 1 < f && (64512 & (y = g.charCodeAt(s + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (y - 56320), s++), d < 128 ? m[_++] = d : (d < 2048 ? m[_++] = 192 | d >>> 6 : (d < 65536 ? m[_++] = 224 | d >>> 12 : (m[_++] = 240 | d >>> 18, m[_++] = 128 | d >>> 12 & 63), m[_++] = 128 | d >>> 6 & 63), m[_++] = 128 | 63 & d);
          return m;
        }, l.buf2binstring = function(g) {
          return b(g, g.length);
        }, l.binstring2buf = function(g) {
          for (var m = new o.Buf8(g.length), d = 0, y = m.length; d < y; d++) m[d] = g.charCodeAt(d);
          return m;
        }, l.buf2string = function(g, m) {
          var d, y, s, _, f = m || g.length, w = new Array(2 * f);
          for (d = y = 0; d < f; ) if ((s = g[d++]) < 128) w[y++] = s;
          else if (4 < (_ = h[s])) w[y++] = 65533, d += _ - 1;
          else {
            for (s &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && d < f; ) s = s << 6 | 63 & g[d++], _--;
            1 < _ ? w[y++] = 65533 : s < 65536 ? w[y++] = s : (s -= 65536, w[y++] = 55296 | s >> 10 & 1023, w[y++] = 56320 | 1023 & s);
          }
          return b(w, y);
        }, l.utf8border = function(g, m) {
          var d;
          for ((m = m || g.length) > g.length && (m = g.length), d = m - 1; 0 <= d && (192 & g[d]) == 128; ) d--;
          return d < 0 || d === 0 ? m : d + h[g[d]] > m ? d : m;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(o, i, n, h) {
          for (var p = 65535 & o | 0, b = o >>> 16 & 65535 | 0, g = 0; n !== 0; ) {
            for (n -= g = 2e3 < n ? 2e3 : n; b = b + (p = p + i[h++] | 0) | 0, --g; ) ;
            p %= 65521, b %= 65521;
          }
          return p | b << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var o = (function() {
          for (var i, n = [], h = 0; h < 256; h++) {
            i = h;
            for (var p = 0; p < 8; p++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            n[h] = i;
          }
          return n;
        })();
        a.exports = function(i, n, h, p) {
          var b = o, g = p + h;
          i ^= -1;
          for (var m = p; m < g; m++) i = i >>> 8 ^ b[255 & (i ^ n[m])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, a, l) {
        var o, i = e("../utils/common"), n = e("./trees"), h = e("./adler32"), p = e("./crc32"), b = e("./messages"), g = 0, m = 4, d = 0, y = -2, s = -1, _ = 4, f = 2, w = 8, S = 9, k = 286, R = 30, T = 19, B = 2 * k + 1, W = 15, O = 3, X = 258, Q = X + O + 1, M = 42, D = 113, c = 1, L = 2, tt = 3, j = 4;
        function st(r, N) {
          return r.msg = b[N], N;
        }
        function Y(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function it(r) {
          for (var N = r.length; 0 <= --N; ) r[N] = 0;
        }
        function P(r) {
          var N = r.state, F = N.pending;
          F > r.avail_out && (F = r.avail_out), F !== 0 && (i.arraySet(r.output, N.pending_buf, N.pending_out, F, r.next_out), r.next_out += F, N.pending_out += F, r.total_out += F, r.avail_out -= F, N.pending -= F, N.pending === 0 && (N.pending_out = 0));
        }
        function I(r, N) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, N), r.block_start = r.strstart, P(r.strm);
        }
        function V(r, N) {
          r.pending_buf[r.pending++] = N;
        }
        function z(r, N) {
          r.pending_buf[r.pending++] = N >>> 8 & 255, r.pending_buf[r.pending++] = 255 & N;
        }
        function E(r, N) {
          var F, x, v = r.max_chain_length, A = r.strstart, $ = r.prev_length, U = r.nice_match, C = r.strstart > r.w_size - Q ? r.strstart - (r.w_size - Q) : 0, Z = r.window, K = r.w_mask, G = r.prev, nt = r.strstart + X, ct = Z[A + $ - 1], at = Z[A + $];
          r.prev_length >= r.good_match && (v >>= 2), U > r.lookahead && (U = r.lookahead);
          do
            if (Z[(F = N) + $] === at && Z[F + $ - 1] === ct && Z[F] === Z[A] && Z[++F] === Z[A + 1]) {
              A += 2, F++;
              do
                ;
              while (Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && A < nt);
              if (x = X - (nt - A), A = nt - X, $ < x) {
                if (r.match_start = N, U <= ($ = x)) break;
                ct = Z[A + $ - 1], at = Z[A + $];
              }
            }
          while ((N = G[N & K]) > C && --v != 0);
          return $ <= r.lookahead ? $ : r.lookahead;
        }
        function q(r) {
          var N, F, x, v, A, $, U, C, Z, K, G = r.w_size;
          do {
            if (v = r.window_size - r.lookahead - r.strstart, r.strstart >= G + (G - Q)) {
              for (i.arraySet(r.window, r.window, G, G, 0), r.match_start -= G, r.strstart -= G, r.block_start -= G, N = F = r.hash_size; x = r.head[--N], r.head[N] = G <= x ? x - G : 0, --F; ) ;
              for (N = F = G; x = r.prev[--N], r.prev[N] = G <= x ? x - G : 0, --F; ) ;
              v += G;
            }
            if (r.strm.avail_in === 0) break;
            if ($ = r.strm, U = r.window, C = r.strstart + r.lookahead, Z = v, K = void 0, K = $.avail_in, Z < K && (K = Z), F = K === 0 ? 0 : ($.avail_in -= K, i.arraySet(U, $.input, $.next_in, K, C), $.state.wrap === 1 ? $.adler = h($.adler, U, K, C) : $.state.wrap === 2 && ($.adler = p($.adler, U, K, C)), $.next_in += K, $.total_in += K, K), r.lookahead += F, r.lookahead + r.insert >= O) for (A = r.strstart - r.insert, r.ins_h = r.window[A], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + O - 1]) & r.hash_mask, r.prev[A & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = A, A++, r.insert--, !(r.lookahead + r.insert < O)); ) ;
          } while (r.lookahead < Q && r.strm.avail_in !== 0);
        }
        function et(r, N) {
          for (var F, x; ; ) {
            if (r.lookahead < Q) {
              if (q(r), r.lookahead < Q && N === g) return c;
              if (r.lookahead === 0) break;
            }
            if (F = 0, r.lookahead >= O && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + O - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), F !== 0 && r.strstart - F <= r.w_size - Q && (r.match_length = E(r, F)), r.match_length >= O) if (x = n._tr_tally(r, r.strstart - r.match_start, r.match_length - O), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= O) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + O - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else x = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (x && (I(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < O - 1 ? r.strstart : O - 1, N === m ? (I(r, !0), r.strm.avail_out === 0 ? tt : j) : r.last_lit && (I(r, !1), r.strm.avail_out === 0) ? c : L;
        }
        function J(r, N) {
          for (var F, x, v; ; ) {
            if (r.lookahead < Q) {
              if (q(r), r.lookahead < Q && N === g) return c;
              if (r.lookahead === 0) break;
            }
            if (F = 0, r.lookahead >= O && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + O - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = O - 1, F !== 0 && r.prev_length < r.max_lazy_match && r.strstart - F <= r.w_size - Q && (r.match_length = E(r, F), r.match_length <= 5 && (r.strategy === 1 || r.match_length === O && 4096 < r.strstart - r.match_start) && (r.match_length = O - 1)), r.prev_length >= O && r.match_length <= r.prev_length) {
              for (v = r.strstart + r.lookahead - O, x = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - O), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= v && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + O - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = O - 1, r.strstart++, x && (I(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((x = n._tr_tally(r, 0, r.window[r.strstart - 1])) && I(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (x = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < O - 1 ? r.strstart : O - 1, N === m ? (I(r, !0), r.strm.avail_out === 0 ? tt : j) : r.last_lit && (I(r, !1), r.strm.avail_out === 0) ? c : L;
        }
        function H(r, N, F, x, v) {
          this.good_length = r, this.max_lazy = N, this.nice_length = F, this.max_chain = x, this.func = v;
        }
        function rt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = w, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * B), this.dyn_dtree = new i.Buf16(2 * (2 * R + 1)), this.bl_tree = new i.Buf16(2 * (2 * T + 1)), it(this.dyn_ltree), it(this.dyn_dtree), it(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(W + 1), this.heap = new i.Buf16(2 * k + 1), it(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * k + 1), it(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(r) {
          var N;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = f, (N = r.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? M : D, r.adler = N.wrap === 2 ? 0 : 1, N.last_flush = g, n._tr_init(N), d) : st(r, y);
        }
        function ht(r) {
          var N = ot(r);
          return N === d && (function(F) {
            F.window_size = 2 * F.w_size, it(F.head), F.max_lazy_match = o[F.level].max_lazy, F.good_match = o[F.level].good_length, F.nice_match = o[F.level].nice_length, F.max_chain_length = o[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = O - 1, F.match_available = 0, F.ins_h = 0;
          })(r.state), N;
        }
        function lt(r, N, F, x, v, A) {
          if (!r) return y;
          var $ = 1;
          if (N === s && (N = 6), x < 0 ? ($ = 0, x = -x) : 15 < x && ($ = 2, x -= 16), v < 1 || S < v || F !== w || x < 8 || 15 < x || N < 0 || 9 < N || A < 0 || _ < A) return st(r, y);
          x === 8 && (x = 9);
          var U = new rt();
          return (r.state = U).strm = r, U.wrap = $, U.gzhead = null, U.w_bits = x, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = v + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + O - 1) / O), U.window = new i.Buf8(2 * U.w_size), U.head = new i.Buf16(U.hash_size), U.prev = new i.Buf16(U.w_size), U.lit_bufsize = 1 << v + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new i.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = N, U.strategy = A, U.method = F, ht(r);
        }
        o = [new H(0, 0, 0, 0, function(r, N) {
          var F = 65535;
          for (F > r.pending_buf_size - 5 && (F = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (q(r), r.lookahead === 0 && N === g) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var x = r.block_start + F;
            if ((r.strstart === 0 || r.strstart >= x) && (r.lookahead = r.strstart - x, r.strstart = x, I(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - Q && (I(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, N === m ? (I(r, !0), r.strm.avail_out === 0 ? tt : j) : (r.strstart > r.block_start && (I(r, !1), r.strm.avail_out), c);
        }), new H(4, 4, 8, 4, et), new H(4, 5, 16, 8, et), new H(4, 6, 32, 32, et), new H(4, 4, 16, 16, J), new H(8, 16, 32, 32, J), new H(8, 16, 128, 128, J), new H(8, 32, 128, 256, J), new H(32, 128, 258, 1024, J), new H(32, 258, 258, 4096, J)], l.deflateInit = function(r, N) {
          return lt(r, N, w, 15, 8, 0);
        }, l.deflateInit2 = lt, l.deflateReset = ht, l.deflateResetKeep = ot, l.deflateSetHeader = function(r, N) {
          return r && r.state ? r.state.wrap !== 2 ? y : (r.state.gzhead = N, d) : y;
        }, l.deflate = function(r, N) {
          var F, x, v, A;
          if (!r || !r.state || 5 < N || N < 0) return r ? st(r, y) : y;
          if (x = r.state, !r.output || !r.input && r.avail_in !== 0 || x.status === 666 && N !== m) return st(r, r.avail_out === 0 ? -5 : y);
          if (x.strm = r, F = x.last_flush, x.last_flush = N, x.status === M) if (x.wrap === 2) r.adler = 0, V(x, 31), V(x, 139), V(x, 8), x.gzhead ? (V(x, (x.gzhead.text ? 1 : 0) + (x.gzhead.hcrc ? 2 : 0) + (x.gzhead.extra ? 4 : 0) + (x.gzhead.name ? 8 : 0) + (x.gzhead.comment ? 16 : 0)), V(x, 255 & x.gzhead.time), V(x, x.gzhead.time >> 8 & 255), V(x, x.gzhead.time >> 16 & 255), V(x, x.gzhead.time >> 24 & 255), V(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), V(x, 255 & x.gzhead.os), x.gzhead.extra && x.gzhead.extra.length && (V(x, 255 & x.gzhead.extra.length), V(x, x.gzhead.extra.length >> 8 & 255)), x.gzhead.hcrc && (r.adler = p(r.adler, x.pending_buf, x.pending, 0)), x.gzindex = 0, x.status = 69) : (V(x, 0), V(x, 0), V(x, 0), V(x, 0), V(x, 0), V(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), V(x, 3), x.status = D);
          else {
            var $ = w + (x.w_bits - 8 << 4) << 8;
            $ |= (2 <= x.strategy || x.level < 2 ? 0 : x.level < 6 ? 1 : x.level === 6 ? 2 : 3) << 6, x.strstart !== 0 && ($ |= 32), $ += 31 - $ % 31, x.status = D, z(x, $), x.strstart !== 0 && (z(x, r.adler >>> 16), z(x, 65535 & r.adler)), r.adler = 1;
          }
          if (x.status === 69) if (x.gzhead.extra) {
            for (v = x.pending; x.gzindex < (65535 & x.gzhead.extra.length) && (x.pending !== x.pending_buf_size || (x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending !== x.pending_buf_size)); ) V(x, 255 & x.gzhead.extra[x.gzindex]), x.gzindex++;
            x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), x.gzindex === x.gzhead.extra.length && (x.gzindex = 0, x.status = 73);
          } else x.status = 73;
          if (x.status === 73) if (x.gzhead.name) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.name.length ? 255 & x.gzhead.name.charCodeAt(x.gzindex++) : 0, V(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.gzindex = 0, x.status = 91);
          } else x.status = 91;
          if (x.status === 91) if (x.gzhead.comment) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.comment.length ? 255 & x.gzhead.comment.charCodeAt(x.gzindex++) : 0, V(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = p(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.status = 103);
          } else x.status = 103;
          if (x.status === 103 && (x.gzhead.hcrc ? (x.pending + 2 > x.pending_buf_size && P(r), x.pending + 2 <= x.pending_buf_size && (V(x, 255 & r.adler), V(x, r.adler >> 8 & 255), r.adler = 0, x.status = D)) : x.status = D), x.pending !== 0) {
            if (P(r), r.avail_out === 0) return x.last_flush = -1, d;
          } else if (r.avail_in === 0 && Y(N) <= Y(F) && N !== m) return st(r, -5);
          if (x.status === 666 && r.avail_in !== 0) return st(r, -5);
          if (r.avail_in !== 0 || x.lookahead !== 0 || N !== g && x.status !== 666) {
            var U = x.strategy === 2 ? (function(C, Z) {
              for (var K; ; ) {
                if (C.lookahead === 0 && (q(C), C.lookahead === 0)) {
                  if (Z === g) return c;
                  break;
                }
                if (C.match_length = 0, K = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, K && (I(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, Z === m ? (I(C, !0), C.strm.avail_out === 0 ? tt : j) : C.last_lit && (I(C, !1), C.strm.avail_out === 0) ? c : L;
            })(x, N) : x.strategy === 3 ? (function(C, Z) {
              for (var K, G, nt, ct, at = C.window; ; ) {
                if (C.lookahead <= X) {
                  if (q(C), C.lookahead <= X && Z === g) return c;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= O && 0 < C.strstart && (G = at[nt = C.strstart - 1]) === at[++nt] && G === at[++nt] && G === at[++nt]) {
                  ct = C.strstart + X;
                  do
                    ;
                  while (G === at[++nt] && G === at[++nt] && G === at[++nt] && G === at[++nt] && G === at[++nt] && G === at[++nt] && G === at[++nt] && G === at[++nt] && nt < ct);
                  C.match_length = X - (ct - nt), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= O ? (K = n._tr_tally(C, 1, C.match_length - O), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (K = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), K && (I(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, Z === m ? (I(C, !0), C.strm.avail_out === 0 ? tt : j) : C.last_lit && (I(C, !1), C.strm.avail_out === 0) ? c : L;
            })(x, N) : o[x.level].func(x, N);
            if (U !== tt && U !== j || (x.status = 666), U === c || U === tt) return r.avail_out === 0 && (x.last_flush = -1), d;
            if (U === L && (N === 1 ? n._tr_align(x) : N !== 5 && (n._tr_stored_block(x, 0, 0, !1), N === 3 && (it(x.head), x.lookahead === 0 && (x.strstart = 0, x.block_start = 0, x.insert = 0))), P(r), r.avail_out === 0)) return x.last_flush = -1, d;
          }
          return N !== m ? d : x.wrap <= 0 ? 1 : (x.wrap === 2 ? (V(x, 255 & r.adler), V(x, r.adler >> 8 & 255), V(x, r.adler >> 16 & 255), V(x, r.adler >> 24 & 255), V(x, 255 & r.total_in), V(x, r.total_in >> 8 & 255), V(x, r.total_in >> 16 & 255), V(x, r.total_in >> 24 & 255)) : (z(x, r.adler >>> 16), z(x, 65535 & r.adler)), P(r), 0 < x.wrap && (x.wrap = -x.wrap), x.pending !== 0 ? d : 1);
        }, l.deflateEnd = function(r) {
          var N;
          return r && r.state ? (N = r.state.status) !== M && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== D && N !== 666 ? st(r, y) : (r.state = null, N === D ? st(r, -3) : d) : y;
        }, l.deflateSetDictionary = function(r, N) {
          var F, x, v, A, $, U, C, Z, K = N.length;
          if (!r || !r.state || (A = (F = r.state).wrap) === 2 || A === 1 && F.status !== M || F.lookahead) return y;
          for (A === 1 && (r.adler = h(r.adler, N, K, 0)), F.wrap = 0, K >= F.w_size && (A === 0 && (it(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), Z = new i.Buf8(F.w_size), i.arraySet(Z, N, K - F.w_size, F.w_size, 0), N = Z, K = F.w_size), $ = r.avail_in, U = r.next_in, C = r.input, r.avail_in = K, r.next_in = 0, r.input = N, q(F); F.lookahead >= O; ) {
            for (x = F.strstart, v = F.lookahead - (O - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[x + O - 1]) & F.hash_mask, F.prev[x & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = x, x++, --v; ) ;
            F.strstart = x, F.lookahead = O - 1, q(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = O - 1, F.match_available = 0, r.next_in = U, r.input = C, r.avail_in = $, F.wrap = A, d;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(o, i) {
          var n, h, p, b, g, m, d, y, s, _, f, w, S, k, R, T, B, W, O, X, Q, M, D, c, L;
          n = o.state, h = o.next_in, c = o.input, p = h + (o.avail_in - 5), b = o.next_out, L = o.output, g = b - (i - o.avail_out), m = b + (o.avail_out - 257), d = n.dmax, y = n.wsize, s = n.whave, _ = n.wnext, f = n.window, w = n.hold, S = n.bits, k = n.lencode, R = n.distcode, T = (1 << n.lenbits) - 1, B = (1 << n.distbits) - 1;
          t: do {
            S < 15 && (w += c[h++] << S, S += 8, w += c[h++] << S, S += 8), W = k[w & T];
            e: for (; ; ) {
              if (w >>>= O = W >>> 24, S -= O, (O = W >>> 16 & 255) === 0) L[b++] = 65535 & W;
              else {
                if (!(16 & O)) {
                  if ((64 & O) == 0) {
                    W = k[(65535 & W) + (w & (1 << O) - 1)];
                    continue e;
                  }
                  if (32 & O) {
                    n.mode = 12;
                    break t;
                  }
                  o.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                X = 65535 & W, (O &= 15) && (S < O && (w += c[h++] << S, S += 8), X += w & (1 << O) - 1, w >>>= O, S -= O), S < 15 && (w += c[h++] << S, S += 8, w += c[h++] << S, S += 8), W = R[w & B];
                r: for (; ; ) {
                  if (w >>>= O = W >>> 24, S -= O, !(16 & (O = W >>> 16 & 255))) {
                    if ((64 & O) == 0) {
                      W = R[(65535 & W) + (w & (1 << O) - 1)];
                      continue r;
                    }
                    o.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (Q = 65535 & W, S < (O &= 15) && (w += c[h++] << S, (S += 8) < O && (w += c[h++] << S, S += 8)), d < (Q += w & (1 << O) - 1)) {
                    o.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (w >>>= O, S -= O, (O = b - g) < Q) {
                    if (s < (O = Q - O) && n.sane) {
                      o.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (D = f, (M = 0) === _) {
                      if (M += y - O, O < X) {
                        for (X -= O; L[b++] = f[M++], --O; ) ;
                        M = b - Q, D = L;
                      }
                    } else if (_ < O) {
                      if (M += y + _ - O, (O -= _) < X) {
                        for (X -= O; L[b++] = f[M++], --O; ) ;
                        if (M = 0, _ < X) {
                          for (X -= O = _; L[b++] = f[M++], --O; ) ;
                          M = b - Q, D = L;
                        }
                      }
                    } else if (M += _ - O, O < X) {
                      for (X -= O; L[b++] = f[M++], --O; ) ;
                      M = b - Q, D = L;
                    }
                    for (; 2 < X; ) L[b++] = D[M++], L[b++] = D[M++], L[b++] = D[M++], X -= 3;
                    X && (L[b++] = D[M++], 1 < X && (L[b++] = D[M++]));
                  } else {
                    for (M = b - Q; L[b++] = L[M++], L[b++] = L[M++], L[b++] = L[M++], 2 < (X -= 3); ) ;
                    X && (L[b++] = L[M++], 1 < X && (L[b++] = L[M++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < p && b < m);
          h -= X = S >> 3, w &= (1 << (S -= X << 3)) - 1, o.next_in = h, o.next_out = b, o.avail_in = h < p ? p - h + 5 : 5 - (h - p), o.avail_out = b < m ? m - b + 257 : 257 - (b - m), n.hold = w, n.bits = S;
        };
      }, {}], 49: [function(e, a, l) {
        var o = e("../utils/common"), i = e("./adler32"), n = e("./crc32"), h = e("./inffast"), p = e("./inftrees"), b = 1, g = 2, m = 0, d = -2, y = 1, s = 852, _ = 592;
        function f(M) {
          return (M >>> 24 & 255) + (M >>> 8 & 65280) + ((65280 & M) << 8) + ((255 & M) << 24);
        }
        function w() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new o.Buf16(320), this.work = new o.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function S(M) {
          var D;
          return M && M.state ? (D = M.state, M.total_in = M.total_out = D.total = 0, M.msg = "", D.wrap && (M.adler = 1 & D.wrap), D.mode = y, D.last = 0, D.havedict = 0, D.dmax = 32768, D.head = null, D.hold = 0, D.bits = 0, D.lencode = D.lendyn = new o.Buf32(s), D.distcode = D.distdyn = new o.Buf32(_), D.sane = 1, D.back = -1, m) : d;
        }
        function k(M) {
          var D;
          return M && M.state ? ((D = M.state).wsize = 0, D.whave = 0, D.wnext = 0, S(M)) : d;
        }
        function R(M, D) {
          var c, L;
          return M && M.state ? (L = M.state, D < 0 ? (c = 0, D = -D) : (c = 1 + (D >> 4), D < 48 && (D &= 15)), D && (D < 8 || 15 < D) ? d : (L.window !== null && L.wbits !== D && (L.window = null), L.wrap = c, L.wbits = D, k(M))) : d;
        }
        function T(M, D) {
          var c, L;
          return M ? (L = new w(), (M.state = L).window = null, (c = R(M, D)) !== m && (M.state = null), c) : d;
        }
        var B, W, O = !0;
        function X(M) {
          if (O) {
            var D;
            for (B = new o.Buf32(512), W = new o.Buf32(32), D = 0; D < 144; ) M.lens[D++] = 8;
            for (; D < 256; ) M.lens[D++] = 9;
            for (; D < 280; ) M.lens[D++] = 7;
            for (; D < 288; ) M.lens[D++] = 8;
            for (p(b, M.lens, 0, 288, B, 0, M.work, { bits: 9 }), D = 0; D < 32; ) M.lens[D++] = 5;
            p(g, M.lens, 0, 32, W, 0, M.work, { bits: 5 }), O = !1;
          }
          M.lencode = B, M.lenbits = 9, M.distcode = W, M.distbits = 5;
        }
        function Q(M, D, c, L) {
          var tt, j = M.state;
          return j.window === null && (j.wsize = 1 << j.wbits, j.wnext = 0, j.whave = 0, j.window = new o.Buf8(j.wsize)), L >= j.wsize ? (o.arraySet(j.window, D, c - j.wsize, j.wsize, 0), j.wnext = 0, j.whave = j.wsize) : (L < (tt = j.wsize - j.wnext) && (tt = L), o.arraySet(j.window, D, c - L, tt, j.wnext), (L -= tt) ? (o.arraySet(j.window, D, c - L, L, 0), j.wnext = L, j.whave = j.wsize) : (j.wnext += tt, j.wnext === j.wsize && (j.wnext = 0), j.whave < j.wsize && (j.whave += tt))), 0;
        }
        l.inflateReset = k, l.inflateReset2 = R, l.inflateResetKeep = S, l.inflateInit = function(M) {
          return T(M, 15);
        }, l.inflateInit2 = T, l.inflate = function(M, D) {
          var c, L, tt, j, st, Y, it, P, I, V, z, E, q, et, J, H, rt, ot, ht, lt, r, N, F, x, v = 0, A = new o.Buf8(4), $ = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!M || !M.state || !M.output || !M.input && M.avail_in !== 0) return d;
          (c = M.state).mode === 12 && (c.mode = 13), st = M.next_out, tt = M.output, it = M.avail_out, j = M.next_in, L = M.input, Y = M.avail_in, P = c.hold, I = c.bits, V = Y, z = it, N = m;
          t: for (; ; ) switch (c.mode) {
            case y:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; I < 16; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if (2 & c.wrap && P === 35615) {
                A[c.check = 0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0), I = P = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & P) << 8) + (P >> 8)) % 31) {
                M.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & P) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (I -= 4, r = 8 + (15 & (P >>>= 4)), c.wbits === 0) c.wbits = r;
              else if (r > c.wbits) {
                M.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << r, M.adler = c.check = 1, c.mode = 512 & P ? 10 : 12, I = P = 0;
              break;
            case 2:
              for (; I < 16; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if (c.flags = P, (255 & c.flags) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                M.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = P >> 8 & 1), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), I = P = 0, c.mode = 3;
            case 3:
              for (; I < 32; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              c.head && (c.head.time = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, A[2] = P >>> 16 & 255, A[3] = P >>> 24 & 255, c.check = n(c.check, A, 4, 0)), I = P = 0, c.mode = 4;
            case 4:
              for (; I < 16; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              c.head && (c.head.xflags = 255 & P, c.head.os = P >> 8), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), I = P = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; I < 16; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                c.length = P, c.head && (c.head.extra_len = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), I = P = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (Y < (E = c.length) && (E = Y), E && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), o.arraySet(c.head.extra, L, j, E, r)), 512 & c.flags && (c.check = n(c.check, L, E, j)), Y -= E, j += E, c.length -= E), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (Y === 0) break t;
                for (E = 0; r = L[j + E++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && E < Y; ) ;
                if (512 & c.flags && (c.check = n(c.check, L, E, j)), Y -= E, j += E, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (Y === 0) break t;
                for (E = 0; r = L[j + E++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && E < Y; ) ;
                if (512 & c.flags && (c.check = n(c.check, L, E, j)), Y -= E, j += E, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; I < 16; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                if (P !== (65535 & c.check)) {
                  M.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                I = P = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), M.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; I < 32; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              M.adler = c.check = f(P), I = P = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return M.next_out = st, M.avail_out = it, M.next_in = j, M.avail_in = Y, c.hold = P, c.bits = I, 2;
              M.adler = c.check = 1, c.mode = 12;
            case 12:
              if (D === 5 || D === 6) break t;
            case 13:
              if (c.last) {
                P >>>= 7 & I, I -= 7 & I, c.mode = 27;
                break;
              }
              for (; I < 3; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              switch (c.last = 1 & P, I -= 1, 3 & (P >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (X(c), c.mode = 20, D !== 6) break;
                  P >>>= 2, I -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  M.msg = "invalid block type", c.mode = 30;
              }
              P >>>= 2, I -= 2;
              break;
            case 14:
              for (P >>>= 7 & I, I -= 7 & I; I < 32; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if ((65535 & P) != (P >>> 16 ^ 65535)) {
                M.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & P, I = P = 0, c.mode = 15, D === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (E = c.length) {
                if (Y < E && (E = Y), it < E && (E = it), E === 0) break t;
                o.arraySet(tt, L, j, E, st), Y -= E, j += E, it -= E, st += E, c.length -= E;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; I < 14; ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if (c.nlen = 257 + (31 & P), P >>>= 5, I -= 5, c.ndist = 1 + (31 & P), P >>>= 5, I -= 5, c.ncode = 4 + (15 & P), P >>>= 4, I -= 4, 286 < c.nlen || 30 < c.ndist) {
                M.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; I < 3; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                c.lens[$[c.have++]] = 7 & P, P >>>= 3, I -= 3;
              }
              for (; c.have < 19; ) c.lens[$[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, F = { bits: c.lenbits }, N = p(0, c.lens, 0, 19, c.lencode, 0, c.work, F), c.lenbits = F.bits, N) {
                M.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; H = (v = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, rt = 65535 & v, !((J = v >>> 24) <= I); ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                if (rt < 16) P >>>= J, I -= J, c.lens[c.have++] = rt;
                else {
                  if (rt === 16) {
                    for (x = J + 2; I < x; ) {
                      if (Y === 0) break t;
                      Y--, P += L[j++] << I, I += 8;
                    }
                    if (P >>>= J, I -= J, c.have === 0) {
                      M.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], E = 3 + (3 & P), P >>>= 2, I -= 2;
                  } else if (rt === 17) {
                    for (x = J + 3; I < x; ) {
                      if (Y === 0) break t;
                      Y--, P += L[j++] << I, I += 8;
                    }
                    I -= J, r = 0, E = 3 + (7 & (P >>>= J)), P >>>= 3, I -= 3;
                  } else {
                    for (x = J + 7; I < x; ) {
                      if (Y === 0) break t;
                      Y--, P += L[j++] << I, I += 8;
                    }
                    I -= J, r = 0, E = 11 + (127 & (P >>>= J)), P >>>= 7, I -= 7;
                  }
                  if (c.have + E > c.nlen + c.ndist) {
                    M.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; E--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                M.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, F = { bits: c.lenbits }, N = p(b, c.lens, 0, c.nlen, c.lencode, 0, c.work, F), c.lenbits = F.bits, N) {
                M.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, F = { bits: c.distbits }, N = p(g, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, F), c.distbits = F.bits, N) {
                M.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, D === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= Y && 258 <= it) {
                M.next_out = st, M.avail_out = it, M.next_in = j, M.avail_in = Y, c.hold = P, c.bits = I, h(M, z), st = M.next_out, tt = M.output, it = M.avail_out, j = M.next_in, L = M.input, Y = M.avail_in, P = c.hold, I = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; H = (v = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, rt = 65535 & v, !((J = v >>> 24) <= I); ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if (H && (240 & H) == 0) {
                for (ot = J, ht = H, lt = rt; H = (v = c.lencode[lt + ((P & (1 << ot + ht) - 1) >> ot)]) >>> 16 & 255, rt = 65535 & v, !(ot + (J = v >>> 24) <= I); ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                P >>>= ot, I -= ot, c.back += ot;
              }
              if (P >>>= J, I -= J, c.back += J, c.length = rt, H === 0) {
                c.mode = 26;
                break;
              }
              if (32 & H) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & H) {
                M.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & H, c.mode = 22;
            case 22:
              if (c.extra) {
                for (x = c.extra; I < x; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                c.length += P & (1 << c.extra) - 1, P >>>= c.extra, I -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; H = (v = c.distcode[P & (1 << c.distbits) - 1]) >>> 16 & 255, rt = 65535 & v, !((J = v >>> 24) <= I); ) {
                if (Y === 0) break t;
                Y--, P += L[j++] << I, I += 8;
              }
              if ((240 & H) == 0) {
                for (ot = J, ht = H, lt = rt; H = (v = c.distcode[lt + ((P & (1 << ot + ht) - 1) >> ot)]) >>> 16 & 255, rt = 65535 & v, !(ot + (J = v >>> 24) <= I); ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                P >>>= ot, I -= ot, c.back += ot;
              }
              if (P >>>= J, I -= J, c.back += J, 64 & H) {
                M.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = rt, c.extra = 15 & H, c.mode = 24;
            case 24:
              if (c.extra) {
                for (x = c.extra; I < x; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                c.offset += P & (1 << c.extra) - 1, P >>>= c.extra, I -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                M.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (it === 0) break t;
              if (E = z - it, c.offset > E) {
                if ((E = c.offset - E) > c.whave && c.sane) {
                  M.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                q = E > c.wnext ? (E -= c.wnext, c.wsize - E) : c.wnext - E, E > c.length && (E = c.length), et = c.window;
              } else et = tt, q = st - c.offset, E = c.length;
              for (it < E && (E = it), it -= E, c.length -= E; tt[st++] = et[q++], --E; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (it === 0) break t;
              tt[st++] = c.length, it--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; I < 32; ) {
                  if (Y === 0) break t;
                  Y--, P |= L[j++] << I, I += 8;
                }
                if (z -= it, M.total_out += z, c.total += z, z && (M.adler = c.check = c.flags ? n(c.check, tt, z, st - z) : i(c.check, tt, z, st - z)), z = it, (c.flags ? P : f(P)) !== c.check) {
                  M.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                I = P = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; I < 32; ) {
                  if (Y === 0) break t;
                  Y--, P += L[j++] << I, I += 8;
                }
                if (P !== (4294967295 & c.total)) {
                  M.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                I = P = 0;
              }
              c.mode = 29;
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
              return d;
          }
          return M.next_out = st, M.avail_out = it, M.next_in = j, M.avail_in = Y, c.hold = P, c.bits = I, (c.wsize || z !== M.avail_out && c.mode < 30 && (c.mode < 27 || D !== 4)) && Q(M, M.output, M.next_out, z - M.avail_out) ? (c.mode = 31, -4) : (V -= M.avail_in, z -= M.avail_out, M.total_in += V, M.total_out += z, c.total += z, c.wrap && z && (M.adler = c.check = c.flags ? n(c.check, tt, z, M.next_out - z) : i(c.check, tt, z, M.next_out - z)), M.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (V == 0 && z === 0 || D === 4) && N === m && (N = -5), N);
        }, l.inflateEnd = function(M) {
          if (!M || !M.state) return d;
          var D = M.state;
          return D.window && (D.window = null), M.state = null, m;
        }, l.inflateGetHeader = function(M, D) {
          var c;
          return M && M.state ? (2 & (c = M.state).wrap) == 0 ? d : ((c.head = D).done = !1, m) : d;
        }, l.inflateSetDictionary = function(M, D) {
          var c, L = D.length;
          return M && M.state ? (c = M.state).wrap !== 0 && c.mode !== 11 ? d : c.mode === 11 && i(1, D, L, 0) !== c.check ? -3 : Q(M, D, L, L) ? (c.mode = 31, -4) : (c.havedict = 1, m) : d;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var o = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], p = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(b, g, m, d, y, s, _, f) {
          var w, S, k, R, T, B, W, O, X, Q = f.bits, M = 0, D = 0, c = 0, L = 0, tt = 0, j = 0, st = 0, Y = 0, it = 0, P = 0, I = null, V = 0, z = new o.Buf16(16), E = new o.Buf16(16), q = null, et = 0;
          for (M = 0; M <= 15; M++) z[M] = 0;
          for (D = 0; D < d; D++) z[g[m + D]]++;
          for (tt = Q, L = 15; 1 <= L && z[L] === 0; L--) ;
          if (L < tt && (tt = L), L === 0) return y[s++] = 20971520, y[s++] = 20971520, f.bits = 1, 0;
          for (c = 1; c < L && z[c] === 0; c++) ;
          for (tt < c && (tt = c), M = Y = 1; M <= 15; M++) if (Y <<= 1, (Y -= z[M]) < 0) return -1;
          if (0 < Y && (b === 0 || L !== 1)) return -1;
          for (E[1] = 0, M = 1; M < 15; M++) E[M + 1] = E[M] + z[M];
          for (D = 0; D < d; D++) g[m + D] !== 0 && (_[E[g[m + D]]++] = D);
          if (B = b === 0 ? (I = q = _, 19) : b === 1 ? (I = i, V -= 257, q = n, et -= 257, 256) : (I = h, q = p, -1), M = c, T = s, st = D = P = 0, k = -1, R = (it = 1 << (j = tt)) - 1, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
          for (; ; ) {
            for (W = M - st, X = _[D] < B ? (O = 0, _[D]) : _[D] > B ? (O = q[et + _[D]], I[V + _[D]]) : (O = 96, 0), w = 1 << M - st, c = S = 1 << j; y[T + (P >> st) + (S -= w)] = W << 24 | O << 16 | X | 0, S !== 0; ) ;
            for (w = 1 << M - 1; P & w; ) w >>= 1;
            if (w !== 0 ? (P &= w - 1, P += w) : P = 0, D++, --z[M] == 0) {
              if (M === L) break;
              M = g[m + _[D]];
            }
            if (tt < M && (P & R) !== k) {
              for (st === 0 && (st = tt), T += c, Y = 1 << (j = M - st); j + st < L && !((Y -= z[j + st]) <= 0); ) j++, Y <<= 1;
              if (it += 1 << j, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
              y[k = P & R] = tt << 24 | j << 16 | T - s | 0;
            }
          }
          return P !== 0 && (y[T + P] = M - st << 24 | 64 << 16 | 0), f.bits = tt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var o = e("../utils/common"), i = 0, n = 1;
        function h(v) {
          for (var A = v.length; 0 <= --A; ) v[A] = 0;
        }
        var p = 0, b = 29, g = 256, m = g + 1 + b, d = 30, y = 19, s = 2 * m + 1, _ = 15, f = 16, w = 7, S = 256, k = 16, R = 17, T = 18, B = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], W = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], O = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], X = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Q = new Array(2 * (m + 2));
        h(Q);
        var M = new Array(2 * d);
        h(M);
        var D = new Array(512);
        h(D);
        var c = new Array(256);
        h(c);
        var L = new Array(b);
        h(L);
        var tt, j, st, Y = new Array(d);
        function it(v, A, $, U, C) {
          this.static_tree = v, this.extra_bits = A, this.extra_base = $, this.elems = U, this.max_length = C, this.has_stree = v && v.length;
        }
        function P(v, A) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = A;
        }
        function I(v) {
          return v < 256 ? D[v] : D[256 + (v >>> 7)];
        }
        function V(v, A) {
          v.pending_buf[v.pending++] = 255 & A, v.pending_buf[v.pending++] = A >>> 8 & 255;
        }
        function z(v, A, $) {
          v.bi_valid > f - $ ? (v.bi_buf |= A << v.bi_valid & 65535, V(v, v.bi_buf), v.bi_buf = A >> f - v.bi_valid, v.bi_valid += $ - f) : (v.bi_buf |= A << v.bi_valid & 65535, v.bi_valid += $);
        }
        function E(v, A, $) {
          z(v, $[2 * A], $[2 * A + 1]);
        }
        function q(v, A) {
          for (var $ = 0; $ |= 1 & v, v >>>= 1, $ <<= 1, 0 < --A; ) ;
          return $ >>> 1;
        }
        function et(v, A, $) {
          var U, C, Z = new Array(_ + 1), K = 0;
          for (U = 1; U <= _; U++) Z[U] = K = K + $[U - 1] << 1;
          for (C = 0; C <= A; C++) {
            var G = v[2 * C + 1];
            G !== 0 && (v[2 * C] = q(Z[G]++, G));
          }
        }
        function J(v) {
          var A;
          for (A = 0; A < m; A++) v.dyn_ltree[2 * A] = 0;
          for (A = 0; A < d; A++) v.dyn_dtree[2 * A] = 0;
          for (A = 0; A < y; A++) v.bl_tree[2 * A] = 0;
          v.dyn_ltree[2 * S] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function H(v) {
          8 < v.bi_valid ? V(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function rt(v, A, $, U) {
          var C = 2 * A, Z = 2 * $;
          return v[C] < v[Z] || v[C] === v[Z] && U[A] <= U[$];
        }
        function ot(v, A, $) {
          for (var U = v.heap[$], C = $ << 1; C <= v.heap_len && (C < v.heap_len && rt(A, v.heap[C + 1], v.heap[C], v.depth) && C++, !rt(A, U, v.heap[C], v.depth)); ) v.heap[$] = v.heap[C], $ = C, C <<= 1;
          v.heap[$] = U;
        }
        function ht(v, A, $) {
          var U, C, Z, K, G = 0;
          if (v.last_lit !== 0) for (; U = v.pending_buf[v.d_buf + 2 * G] << 8 | v.pending_buf[v.d_buf + 2 * G + 1], C = v.pending_buf[v.l_buf + G], G++, U === 0 ? E(v, C, A) : (E(v, (Z = c[C]) + g + 1, A), (K = B[Z]) !== 0 && z(v, C -= L[Z], K), E(v, Z = I(--U), $), (K = W[Z]) !== 0 && z(v, U -= Y[Z], K)), G < v.last_lit; ) ;
          E(v, S, A);
        }
        function lt(v, A) {
          var $, U, C, Z = A.dyn_tree, K = A.stat_desc.static_tree, G = A.stat_desc.has_stree, nt = A.stat_desc.elems, ct = -1;
          for (v.heap_len = 0, v.heap_max = s, $ = 0; $ < nt; $++) Z[2 * $] !== 0 ? (v.heap[++v.heap_len] = ct = $, v.depth[$] = 0) : Z[2 * $ + 1] = 0;
          for (; v.heap_len < 2; ) Z[2 * (C = v.heap[++v.heap_len] = ct < 2 ? ++ct : 0)] = 1, v.depth[C] = 0, v.opt_len--, G && (v.static_len -= K[2 * C + 1]);
          for (A.max_code = ct, $ = v.heap_len >> 1; 1 <= $; $--) ot(v, Z, $);
          for (C = nt; $ = v.heap[1], v.heap[1] = v.heap[v.heap_len--], ot(v, Z, 1), U = v.heap[1], v.heap[--v.heap_max] = $, v.heap[--v.heap_max] = U, Z[2 * C] = Z[2 * $] + Z[2 * U], v.depth[C] = (v.depth[$] >= v.depth[U] ? v.depth[$] : v.depth[U]) + 1, Z[2 * $ + 1] = Z[2 * U + 1] = C, v.heap[1] = C++, ot(v, Z, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(at, pt) {
            var At, gt, zt, ut, Ot, Dt, bt = pt.dyn_tree, Yt = pt.max_code, he = pt.stat_desc.static_tree, ue = pt.stat_desc.has_stree, fe = pt.stat_desc.extra_bits, Zt = pt.stat_desc.extra_base, Et = pt.stat_desc.max_length, Bt = 0;
            for (ut = 0; ut <= _; ut++) at.bl_count[ut] = 0;
            for (bt[2 * at.heap[at.heap_max] + 1] = 0, At = at.heap_max + 1; At < s; At++) Et < (ut = bt[2 * bt[2 * (gt = at.heap[At]) + 1] + 1] + 1) && (ut = Et, Bt++), bt[2 * gt + 1] = ut, Yt < gt || (at.bl_count[ut]++, Ot = 0, Zt <= gt && (Ot = fe[gt - Zt]), Dt = bt[2 * gt], at.opt_len += Dt * (ut + Ot), ue && (at.static_len += Dt * (he[2 * gt + 1] + Ot)));
            if (Bt !== 0) {
              do {
                for (ut = Et - 1; at.bl_count[ut] === 0; ) ut--;
                at.bl_count[ut]--, at.bl_count[ut + 1] += 2, at.bl_count[Et]--, Bt -= 2;
              } while (0 < Bt);
              for (ut = Et; ut !== 0; ut--) for (gt = at.bl_count[ut]; gt !== 0; ) Yt < (zt = at.heap[--At]) || (bt[2 * zt + 1] !== ut && (at.opt_len += (ut - bt[2 * zt + 1]) * bt[2 * zt], bt[2 * zt + 1] = ut), gt--);
            }
          })(v, A), et(Z, ct, v.bl_count);
        }
        function r(v, A, $) {
          var U, C, Z = -1, K = A[1], G = 0, nt = 7, ct = 4;
          for (K === 0 && (nt = 138, ct = 3), A[2 * ($ + 1) + 1] = 65535, U = 0; U <= $; U++) C = K, K = A[2 * (U + 1) + 1], ++G < nt && C === K || (G < ct ? v.bl_tree[2 * C] += G : C !== 0 ? (C !== Z && v.bl_tree[2 * C]++, v.bl_tree[2 * k]++) : G <= 10 ? v.bl_tree[2 * R]++ : v.bl_tree[2 * T]++, Z = C, ct = (G = 0) === K ? (nt = 138, 3) : C === K ? (nt = 6, 3) : (nt = 7, 4));
        }
        function N(v, A, $) {
          var U, C, Z = -1, K = A[1], G = 0, nt = 7, ct = 4;
          for (K === 0 && (nt = 138, ct = 3), U = 0; U <= $; U++) if (C = K, K = A[2 * (U + 1) + 1], !(++G < nt && C === K)) {
            if (G < ct) for (; E(v, C, v.bl_tree), --G != 0; ) ;
            else C !== 0 ? (C !== Z && (E(v, C, v.bl_tree), G--), E(v, k, v.bl_tree), z(v, G - 3, 2)) : G <= 10 ? (E(v, R, v.bl_tree), z(v, G - 3, 3)) : (E(v, T, v.bl_tree), z(v, G - 11, 7));
            Z = C, ct = (G = 0) === K ? (nt = 138, 3) : C === K ? (nt = 6, 3) : (nt = 7, 4);
          }
        }
        h(Y);
        var F = !1;
        function x(v, A, $, U) {
          z(v, (p << 1) + (U ? 1 : 0), 3), (function(C, Z, K, G) {
            H(C), V(C, K), V(C, ~K), o.arraySet(C.pending_buf, C.window, Z, K, C.pending), C.pending += K;
          })(v, A, $);
        }
        l._tr_init = function(v) {
          F || ((function() {
            var A, $, U, C, Z, K = new Array(_ + 1);
            for (C = U = 0; C < b - 1; C++) for (L[C] = U, A = 0; A < 1 << B[C]; A++) c[U++] = C;
            for (c[U - 1] = C, C = Z = 0; C < 16; C++) for (Y[C] = Z, A = 0; A < 1 << W[C]; A++) D[Z++] = C;
            for (Z >>= 7; C < d; C++) for (Y[C] = Z << 7, A = 0; A < 1 << W[C] - 7; A++) D[256 + Z++] = C;
            for ($ = 0; $ <= _; $++) K[$] = 0;
            for (A = 0; A <= 143; ) Q[2 * A + 1] = 8, A++, K[8]++;
            for (; A <= 255; ) Q[2 * A + 1] = 9, A++, K[9]++;
            for (; A <= 279; ) Q[2 * A + 1] = 7, A++, K[7]++;
            for (; A <= 287; ) Q[2 * A + 1] = 8, A++, K[8]++;
            for (et(Q, m + 1, K), A = 0; A < d; A++) M[2 * A + 1] = 5, M[2 * A] = q(A, 5);
            tt = new it(Q, B, g + 1, m, _), j = new it(M, W, 0, d, _), st = new it(new Array(0), O, 0, y, w);
          })(), F = !0), v.l_desc = new P(v.dyn_ltree, tt), v.d_desc = new P(v.dyn_dtree, j), v.bl_desc = new P(v.bl_tree, st), v.bi_buf = 0, v.bi_valid = 0, J(v);
        }, l._tr_stored_block = x, l._tr_flush_block = function(v, A, $, U) {
          var C, Z, K = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(G) {
            var nt, ct = 4093624447;
            for (nt = 0; nt <= 31; nt++, ct >>>= 1) if (1 & ct && G.dyn_ltree[2 * nt] !== 0) return i;
            if (G.dyn_ltree[18] !== 0 || G.dyn_ltree[20] !== 0 || G.dyn_ltree[26] !== 0) return n;
            for (nt = 32; nt < g; nt++) if (G.dyn_ltree[2 * nt] !== 0) return n;
            return i;
          })(v)), lt(v, v.l_desc), lt(v, v.d_desc), K = (function(G) {
            var nt;
            for (r(G, G.dyn_ltree, G.l_desc.max_code), r(G, G.dyn_dtree, G.d_desc.max_code), lt(G, G.bl_desc), nt = y - 1; 3 <= nt && G.bl_tree[2 * X[nt] + 1] === 0; nt--) ;
            return G.opt_len += 3 * (nt + 1) + 5 + 5 + 4, nt;
          })(v), C = v.opt_len + 3 + 7 >>> 3, (Z = v.static_len + 3 + 7 >>> 3) <= C && (C = Z)) : C = Z = $ + 5, $ + 4 <= C && A !== -1 ? x(v, A, $, U) : v.strategy === 4 || Z === C ? (z(v, 2 + (U ? 1 : 0), 3), ht(v, Q, M)) : (z(v, 4 + (U ? 1 : 0), 3), (function(G, nt, ct, at) {
            var pt;
            for (z(G, nt - 257, 5), z(G, ct - 1, 5), z(G, at - 4, 4), pt = 0; pt < at; pt++) z(G, G.bl_tree[2 * X[pt] + 1], 3);
            N(G, G.dyn_ltree, nt - 1), N(G, G.dyn_dtree, ct - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, K + 1), ht(v, v.dyn_ltree, v.dyn_dtree)), J(v), U && H(v);
        }, l._tr_tally = function(v, A, $) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = A >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & A, v.pending_buf[v.l_buf + v.last_lit] = 255 & $, v.last_lit++, A === 0 ? v.dyn_ltree[2 * $]++ : (v.matches++, A--, v.dyn_ltree[2 * (c[$] + g + 1)]++, v.dyn_dtree[2 * I(A)]++), v.last_lit === v.lit_bufsize - 1;
        }, l._tr_align = function(v) {
          z(v, 2, 3), E(v, S, Q), (function(A) {
            A.bi_valid === 16 ? (V(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(o) {
          (function(i, n) {
            if (!i.setImmediate) {
              var h, p, b, g, m = 1, d = {}, y = !1, s = i.document, _ = Object.getPrototypeOf && Object.getPrototypeOf(i);
              _ = _ && _.setTimeout ? _ : i, h = {}.toString.call(i.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  w(k);
                });
              } : (function() {
                if (i.postMessage && !i.importScripts) {
                  var k = !0, R = i.onmessage;
                  return i.onmessage = function() {
                    k = !1;
                  }, i.postMessage("", "*"), i.onmessage = R, k;
                }
              })() ? (g = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", S, !1) : i.attachEvent("onmessage", S), function(k) {
                i.postMessage(g + k, "*");
              }) : i.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                w(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : s && "onreadystatechange" in s.createElement("script") ? (p = s.documentElement, function(k) {
                var R = s.createElement("script");
                R.onreadystatechange = function() {
                  w(k), R.onreadystatechange = null, p.removeChild(R), R = null;
                }, p.appendChild(R);
              }) : function(k) {
                setTimeout(w, 0, k);
              }, _.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var R = new Array(arguments.length - 1), T = 0; T < R.length; T++) R[T] = arguments[T + 1];
                var B = { callback: k, args: R };
                return d[m] = B, h(m), m++;
              }, _.clearImmediate = f;
            }
            function f(k) {
              delete d[k];
            }
            function w(k) {
              if (y) setTimeout(w, 0, k);
              else {
                var R = d[k];
                if (R) {
                  y = !0;
                  try {
                    (function(T) {
                      var B = T.callback, W = T.args;
                      switch (W.length) {
                        case 0:
                          B();
                          break;
                        case 1:
                          B(W[0]);
                          break;
                        case 2:
                          B(W[0], W[1]);
                          break;
                        case 3:
                          B(W[0], W[1], W[2]);
                          break;
                        default:
                          B.apply(n, W);
                      }
                    })(R);
                  } finally {
                    f(k), y = !1;
                  }
                }
              }
            }
            function S(k) {
              k.source === i && typeof k.data == "string" && k.data.indexOf(g) === 0 && w(+k.data.slice(g.length));
            }
          })(typeof self > "u" ? o === void 0 ? this : o : self);
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Lt)), Lt.exports;
}
var ye = pe();
const ie = /* @__PURE__ */ me(ye);
async function ge(u) {
  const t = await _e(u), e = await ie.loadAsync(t), a = [];
  return e.forEach((l, o) => {
    if (o.dir)
      return;
    const i = be(l);
    a.push({
      name: i,
      text: () => o.async("text"),
      arrayBuffer: () => o.async("arraybuffer")
    });
  }), a;
}
async function _e(u) {
  if (u instanceof ArrayBuffer)
    return u;
  if (u instanceof Blob)
    return await u.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function be(u) {
  let t = u.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ve(u) {
  return !!u && typeof u == "object" && !(u instanceof ArrayBuffer) && !(u instanceof Uint8Array);
}
function we(u) {
  return u instanceof Uint8Array ? u : new Uint8Array(u);
}
function xe(u) {
  return u.byteOffset === 0 && u.byteLength === u.buffer.byteLength ? u.buffer : u.slice().buffer;
}
function St(u, t, e = 0) {
  if (u.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (u[e + a] !== t[a]) return !1;
  return !0;
}
function ke(u) {
  return St(u, [80, 75, 3, 4]) || St(u, [80, 75, 5, 6]) || St(u, [80, 75, 7, 8]) ? "zip" : St(u, [82, 97, 114, 33, 26, 7, 0]) || St(u, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : St(u, [55, 122, 188, 175, 39, 28]) ? "7z" : u.length > 262 && St(u, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function ne(u) {
  return u.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function qt(u) {
  const t = [], e = u.map((s) => ne(s).toLowerCase()), a = (s) => e.some(s), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, o = /\.(drl|xln)$/i, i = e.filter((s) => l.test(s)).length, n = e.filter((s) => o.test(s) || s.includes("drill")).length, h = a((s) => s.includes("top") && s.includes("copper") || s.endsWith(".gtl")), p = a((s) => s.includes("bot") || s.includes("bottom") || s.endsWith(".gbl")), b = a((s) => s.includes("mask") || s.includes("solder") || s.endsWith(".gts") || s.endsWith(".gbs")), g = a((s) => s.includes("silk") || s.includes("legend") || s.endsWith(".gto") || s.endsWith(".gbo")), m = a((s) => s.includes("outline") || s.includes("profile") || s.includes("edge") || s.endsWith(".gko") || s.endsWith(".gm1") || s.endsWith(".gml")), d = e.every(
    (s) => s.endsWith(".pdf") || s.endsWith(".png") || s.endsWith(".jpg") || s.endsWith(".jpeg") || s.endsWith(".svg") || s.endsWith(".txt") || s.endsWith(".md")
  );
  let y = 0;
  return u.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (y += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (y += 0.2, t.push(`Found ${n} drill-like file(s).`)), m && (y += 0.15, t.push("Found outline/profile/edge candidate.")), h && p ? (y += 0.2, t.push("Found both top and bottom copper candidates.")) : (h || p) && (y += 0.1, t.push("Found at least one copper candidate.")), b && (y += 0.05, t.push("Found solder mask candidate.")), g && (y += 0.05, t.push("Found silkscreen/legend candidate.")), y = Math.max(0, Math.min(1, y)), y < 0.6 && i >= 2 && (y = Math.max(y, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: y, reasons: t });
}
async function Se(u) {
  if (ve(u)) {
    const o = Object.keys(u).map(ne), { confidence: i, reasons: n } = qt(o);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: n,
      files: o
    };
  }
  const t = we(u), e = ke(t);
  if (e === "zip")
    try {
      const o = xe(t), n = (await ge(o)).map((b) => b.name), { confidence: h, reasons: p } = qt(n);
      return {
        isGerber: h >= 0.6,
        archiveType: "zip",
        confidence: h,
        reasons: p,
        files: n
      };
    } catch (o) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(o)]
      };
    }
  if (e === "rar" || e === "7z" || e === "tar")
    return {
      isGerber: !1,
      archiveType: e,
      confidence: 0.2,
      reasons: [
        `Detected ${e} archive by signature.`,
        "Archive type is not unpacked by default. Use list/detect for UX, or add a decoder to render."
      ]
    };
  const a = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return a.includes("%FSLAX") || a.includes("%MOIN") || a.includes("%MOMM") || a.includes("G04") || a.includes("%ADD") ? {
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
  constructor(t, e, a) {
    super(e), this.name = "GerberError", this.code = t, this.details = a;
  }
}
function se(u) {
  let t = u.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Me(u) {
  return u instanceof Uint8Array ? u : new Uint8Array(u);
}
function oe(u) {
  try {
    return u.slice().buffer;
  } catch {
    const t = new Uint8Array(u.byteLength);
    return t.set(u), t.buffer;
  }
}
async function Re(u) {
  let t;
  try {
    t = await ie.loadAsync(oe(u));
  } catch (n) {
    throw new ft(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      n
    );
  }
  const e = {}, a = 1e3, l = 100 * 1024 * 1024, o = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (o.length > a)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${o.length} > ${a})`
    );
  let i = 0;
  for (const [n, h] of o)
    try {
      const p = se(n), b = await h.async("arraybuffer");
      if (i += b.byteLength, i > l)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[p] = new Uint8Array(b);
    } catch (p) {
      console.warn(`Failed to extract file ${n}:`, p);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Ae(u, t) {
  let e;
  try {
    const g = await import("./libarchive-Bt1VdZR0.js");
    e = g.Archive ?? g.default?.Archive;
  } catch (g) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      g
    );
  }
  if (!e)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (g) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        g
      );
    }
  let a;
  try {
    const g = new Blob([oe(u)], { type: "application/octet-stream" });
    a = await e.open(g);
  } catch (g) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", g);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
      new Promise(
        (g, m) => setTimeout(() => m(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (g) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", g);
  }
  const o = {};
  let i = 0;
  const n = 1e3, h = 100 * 1024 * 1024;
  let p = 0;
  async function b(g, m) {
    if (i >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const d of Object.keys(g)) {
      const y = g[d], s = m ? `${m}/${d}` : d;
      if (y instanceof File || y instanceof Blob) {
        i++;
        try {
          const _ = await y.arrayBuffer();
          if (p += _.byteLength, p > h)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${h} bytes)`
            );
          o[se(s)] = new Uint8Array(_);
        } catch (_) {
          console.warn(`Failed to extract file ${s}:`, _);
        }
      } else y && typeof y == "object" && await b(y, s);
    }
  }
  try {
    await b(l, "");
  } finally {
    if (a && typeof a.close == "function")
      try {
        await a.close();
      } catch (g) {
        console.warn("Failed to close archive:", g);
      }
  }
  if (Object.keys(o).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return o;
}
async function ae(u, t) {
  if (!u || u.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = Me(u), a = 100 * 1024 * 1024;
  if (e.length > a)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${a} bytes)`
    );
  let l;
  try {
    l = await Se(e);
  } catch (o) {
    throw new ft("PARSE_ERROR", "Failed to detect archive type", o);
  }
  if (!l.isGerber)
    throw new ft(
      "NOT_GERBER",
      l.reasons.join("; ") || "Not a Gerber bundle",
      l
    );
  try {
    if (l.archiveType === "zip")
      return { archiveType: "zip", files: await Re(e) };
    if (l.archiveType === "rar")
      return { archiveType: "rar", files: await Ae(e, t) };
    throw new ft(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${l.archiveType}`,
      l
    );
  } catch (o) {
    throw o instanceof ft ? o : new ft(
      "PARSE_ERROR",
      o instanceof Error ? o.message : "Unknown error during extraction",
      { error: o, det: l }
    );
  }
}
function jt(u) {
  return u.toLowerCase();
}
function wt(u, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return u.filter((l) => {
    const o = jt(l), i = o.lastIndexOf(".");
    return i < 0 ? !1 : e.has(o.slice(i));
  }).sort((l, o) => l.length - o.length)[0];
}
function dt(u, t) {
  const e = t.map((l) => l.toLowerCase());
  return u.filter((l) => {
    const o = jt(l);
    return e.every((i) => o.includes(i));
  }).sort((l, o) => l.length - o.length)[0];
}
function ze(u) {
  const t = u.filter((b) => {
    const g = jt(b);
    return !(g.endsWith("/") || g.includes("__macosx") || g.endsWith(".ds_store"));
  }), e = wt(t, [".gtl"]) || dt(t, ["f_cu"]) || dt(t, ["top", "cu"]) || dt(t, ["top", "copper"]), a = wt(t, [".gbl"]) || dt(t, ["b_cu"]) || dt(t, ["bottom", "cu"]) || dt(t, ["bottom", "copper"]), l = wt(t, [".gts"]) || dt(t, ["f_mask"]) || dt(t, ["top", "mask"]), o = wt(t, [".gbs"]) || dt(t, ["b_mask"]) || dt(t, ["bottom", "mask"]), i = wt(t, [".gto"]) || dt(t, ["f_silks"]) || dt(t, ["f_silk"]) || dt(t, ["top", "silk"]), n = wt(t, [".gbo"]) || dt(t, ["b_silks"]) || dt(t, ["b_silk"]) || dt(t, ["bottom", "silk"]), h = wt(t, [".gko", ".gm1"]) || dt(t, ["edge", "cuts"]) || dt(t, ["outline"]) || dt(t, ["board", "outline"]), p = (
    // Excellon often .drl or .xln or .txt
    wt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    dt(t, ["drill"]) || dt(t, ["drills"]) || dt(t, ["npth"]) || dt(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: o,
    top_silk: i,
    bottom_silk: n,
    outline: h,
    drills: p
  };
}
const Ee = 0.8;
function Ct(u, t, e) {
  const a = {
    unitScale: 1,
    fmtInt: 2,
    fmtDec: 4,
    x: 0,
    y: 0,
    apertures: /* @__PURE__ */ new Map(),
    currentAperture: null,
    arcMode: 1,
    loadRotationDeg: 0,
    inRegion: !1,
    regionPaths: [],
    currentPath: [],
    currentPolarity: "dark",
    ops: [],
    tracks: [],
    arcs: [],
    flashes: [],
    regions: []
  }, l = t.split(/\r?\n/);
  for (const o of l) {
    let i = o.trim();
    if (i && !i.startsWith("G04")) {
      if (i.startsWith("%") && i.endsWith("%")) {
        Ce(i, a);
        continue;
      }
      i.endsWith("*") && (i = i.slice(0, -1)), Ie(i, a);
    }
  }
  if (a.inRegion) {
    if (a.currentPath.length >= 3 && a.regionPaths.push(a.currentPath), a.regionPaths.length > 0) {
      const o = {
        loops: a.regionPaths,
        polarity: a.currentPolarity
      };
      a.regions.push(o), a.ops.push({
        kind: "region",
        polarity: a.currentPolarity,
        loops: a.regionPaths
      });
    }
    a.inRegion = !1, a.regionPaths = [], a.currentPath = [];
  }
  return {
    tracks: a.tracks,
    arcs: a.arcs,
    flashes: a.flashes,
    regions: a.regions,
    ops: a.ops
  };
}
function Ce(u, t) {
  let e = u;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const a = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (a) {
      const l = parseInt(a[1], 10), o = parseInt(a[2], 10);
      parseInt(a[4], 10), t.fmtInt = l, t.fmtDec = o;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const a = t.unitScale;
    let l = a;
    if (e.includes("MOMM") ? l = 1 : e.includes("MOIN") && (l = 25.4), l !== a) {
      const o = l / a;
      for (const i of t.apertures.values())
        i.diameterMm !== void 0 && (i.diameterMm *= o), i.widthMm !== void 0 && (i.widthMm *= o), i.heightMm !== void 0 && (i.heightMm *= o);
      t.unitScale = l;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const a = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!a) return;
    const l = parseInt(a[2], 10), o = a[3], i = a[4] ?? "";
    let n, h, p, b, g;
    if (i) {
      const d = i.split(/[Xx]/).filter(Boolean), y = d[0] ? parseFloat(d[0]) * t.unitScale : void 0, s = d[1] ? parseFloat(d[1]) * t.unitScale : void 0, _ = d[2] ? parseFloat(d[2]) * t.unitScale : void 0, f = d[3] ? parseFloat(d[3]) : void 0;
      f !== void 0 && !Number.isNaN(f) && f !== 0 && (g = f), o === "C" ? n = y : o === "R" || o === "O" ? (h = y, p = s, n = y !== void 0 && s !== void 0 ? Math.min(y, s) : y ?? s) : (h = y, p = s, _ !== void 0 && (b = _), n = y !== void 0 && s !== void 0 ? Math.min(y, s) : y ?? s);
    }
    const m = {
      code: l,
      shape: o,
      diameterMm: n,
      widthMm: h,
      heightMm: p,
      cornerMm: b,
      rotationDeg: g
    };
    t.apertures.set(l, m);
    return;
  }
  if (e.startsWith("LR")) {
    const a = /LR([+-]?[\d.]+)/.exec(e);
    a && (t.loadRotationDeg = parseFloat(a[1]) || 0);
    return;
  }
  if (e.startsWith("LPD")) {
    t.currentPolarity = "dark";
    return;
  }
  if (e.startsWith("LPC")) {
    t.currentPolarity = "clear";
    return;
  }
}
function Vt(u, t, e, a, l) {
  const o = u.x + e, i = u.y + a, n = Math.sqrt(e * e + a * a);
  if (n < 1e-6) return [t];
  const h = Math.atan2(u.y - i, u.x - o), p = Math.atan2(t.y - i, t.x - o), g = (t.x - u.x) ** 2 + (t.y - u.y) ** 2 < (n * 1e-3) ** 2;
  let m;
  g ? m = l ? -2 * Math.PI : 2 * Math.PI : (m = p - h, l ? m > 1e-6 && (m -= 2 * Math.PI) : m < -1e-6 && (m += 2 * Math.PI));
  const d = Math.min(64, Math.max(4, Math.ceil(Math.abs(m) / (Math.PI / 16)))), y = [];
  for (let s = 1; s <= d; s++) {
    const _ = h + m * s / d;
    y.push({ x: o + n * Math.cos(_), y: i + n * Math.sin(_) });
  }
  return y;
}
function Ie(u, t) {
  if (u === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (u === "G74" || u === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(u);
  if (e && (t.arcMode = parseInt(e[1], 10), u = u.slice(e[0].length).trim(), !u))
    return;
  if (u === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const s = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(s), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let a = null;
  const l = /D0?(\d{1,3})$/.exec(u);
  if (l && (a = parseInt(l[1], 10), u = u.slice(0, u.length - l[0].length)), a !== null && a >= 10) {
    const s = t.apertures.get(a);
    s && (t.currentAperture = s);
    return;
  }
  const o = /X([+\-]?\d+)/.exec(u), i = /Y([+\-]?\d+)/.exec(u), n = /I([+\-]?\d+)/.exec(u), h = /J([+\-]?\d+)/.exec(u);
  let p = t.x, b = t.y;
  o && (p = Nt(o[1], t)), i && (b = Nt(i[1], t));
  const g = n ? Nt(n[1], t) : 0, m = h ? Nt(h[1], t) : 0;
  if (a === null) {
    t.x = p, t.y = b;
    return;
  }
  if (t.inRegion) {
    const s = t.x, _ = t.y;
    if (a === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: s, y: _ }), t.arcMode !== 1 && (g !== 0 || m !== 0)) {
        const f = Vt({ x: s, y: _ }, { x: p, y: b }, g, m, t.arcMode === 2);
        for (const w of f) t.currentPath.push(w);
      } else
        t.currentPath.push({ x: p, y: b });
    else a === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = p, t.y = b;
    return;
  }
  const d = t.x, y = t.y;
  if (a === 1) {
    if (!t.currentAperture) {
      t.x = p, t.y = b;
      return;
    }
    const s = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (g !== 0 || m !== 0)) {
      const _ = Vt({ x: d, y }, { x: p, y: b }, g, m, t.arcMode === 2);
      let f = { x: d, y };
      for (const w of _)
        t.tracks.push({ start: f, end: w, width: s, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: f, end: w, widthMm: s }), f = w;
    } else
      t.tracks.push({
        start: { x: d, y },
        end: { x: p, y: b },
        width: s,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: d, y },
        end: { x: p, y: b },
        widthMm: s
      });
    t.x = p, t.y = b;
    return;
  }
  if (a === 2) {
    t.x = p, t.y = b;
    return;
  }
  if (a === 3) {
    if (t.currentAperture) {
      const s = t.currentAperture, _ = s.diameterMm !== void 0 ? s.diameterMm : Ee, f = (s.rotationDeg ?? 0) + t.loadRotationDeg, w = f !== 0 ? f : void 0, S = {
        position: { x: p, y: b },
        diameterMm: _,
        shape: s.shape,
        polarity: t.currentPolarity,
        rotationDeg: w
      };
      s.widthMm !== void 0 && (S.widthMm = s.widthMm), s.heightMm !== void 0 && (S.heightMm = s.heightMm), s.cornerMm !== void 0 && (S.cornerMm = s.cornerMm), t.flashes.push(S), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: p, y: b },
        diameterMm: _,
        shape: s.shape,
        widthMm: s.widthMm,
        heightMm: s.heightMm,
        cornerMm: s.cornerMm,
        rotationDeg: w
      });
    }
    t.x = p, t.y = b;
    return;
  }
}
function Nt(u, t) {
  const e = u.startsWith("-") ? -1 : 1, a = u.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const o = Math.pow(10, t.fmtDec), i = l / o * t.unitScale;
  return e * i;
}
function Te(u, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const o = [];
  for (const i of e) {
    const n = i.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const h = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (h) {
          const p = h[1], b = parseFloat(h[2]);
          Number.isNaN(b) || a.set(p, b);
        }
        continue;
      }
      if (n.startsWith("T") && !n.includes("C")) {
        const h = /^T(\d+)/i.exec(n);
        h && (l = h[1]);
        continue;
      }
      if (n[0] === "X" || n.includes("X")) {
        const h = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(n);
        if (!h)
          continue;
        const p = h[1], b = h[2], g = parseFloat(p), m = parseFloat(b);
        if (Number.isNaN(g) || Number.isNaN(m))
          continue;
        const d = l && a.has(l) ? a.get(l) : 0.6;
        o.push({
          x: g,
          y: m,
          diameter: d,
          plated: !0
          // default, later you can infer from file or layer
        });
        continue;
      }
    }
  }
  return {
    name: u,
    holes: o
  };
}
function Oe(u) {
  return { w: u.maxX - u.minX, h: u.maxY - u.minY };
}
function It(u) {
  const { w: t, h: e } = Oe(u);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Mt(u, t) {
  if (!Number.isFinite(u) || !Number.isFinite(t) || u <= 0 || t <= 0) return 1;
  const e = u / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Tt(u, t) {
  return t === 1 ? u : {
    ...u,
    tracks: u.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: u.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: u.regions.map((e) => ({
      ...e,
      loops: e.loops.map((a) => a.map((l) => ({ x: l.x * t, y: l.y * t })))
    }))
  };
}
function Be(u, t) {
  return t === 1 ? u : u.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Pe(u) {
  return URL.createObjectURL(new Blob([u], { type: "image/svg+xml" }));
}
function yt(u, t, e) {
  u.minX = Math.min(u.minX, t), u.minY = Math.min(u.minY, e), u.maxX = Math.max(u.maxX, t), u.maxY = Math.max(u.maxY, e);
}
function Xt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function xt(u) {
  const t = Xt();
  for (const e of u.tracks) {
    yt(t, e.start.x, e.start.y), yt(t, e.end.x, e.end.y);
    const a = (e.width ?? 0) / 2;
    yt(t, e.start.x - a, e.start.y - a), yt(t, e.start.x + a, e.start.y + a), yt(t, e.end.x - a, e.end.y - a), yt(t, e.end.x + a, e.end.y + a);
  }
  for (const e of u.flashes) {
    const a = (e.widthMm ?? e.diameterMm) || 0, l = (e.heightMm ?? e.diameterMm) || 0;
    yt(t, e.position.x - a / 2, e.position.y - l / 2), yt(t, e.position.x + a / 2, e.position.y + l / 2);
  }
  for (const e of u.regions)
    for (const a of e.loops) for (const l of a) yt(t, l.x, l.y);
  return t;
}
function Fe(u) {
  const t = Xt();
  for (const e of u) {
    const a = (e.diameter || 0) / 2;
    yt(t, e.x - a, e.y - a), yt(t, e.x + a, e.y + a);
  }
  return t;
}
function Ht(u, t) {
  return {
    minX: Math.min(u.minX, t.minX),
    minY: Math.min(u.minY, t.minY),
    maxX: Math.max(u.maxX, t.maxX),
    maxY: Math.max(u.maxY, t.maxY)
  };
}
function vt(u) {
  return !Number.isFinite(u.minX) || !Number.isFinite(u.minY) || !Number.isFinite(u.maxX) || !Number.isFinite(u.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (u.maxX - u.minX < 1e-6 && (u.maxX = u.minX + 1), u.maxY - u.minY < 1e-6 && (u.maxY = u.minY + 1), u);
}
const Ne = 1e3;
function mt(u) {
  return u / 25.4 * Ne;
}
function Rt(u, t, e) {
  const a = u - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Wt(u, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${u}" height="${t}" viewBox="0 0 ${u} ${t}">
  <rect width="${u}" height="${t}" fill="white"/>
</svg>`.trim();
}
function _t(u, t = 1e-4) {
  const e = Math.round(u.x / t) * t, a = Math.round(u.y / t) * t;
  return `${e.toFixed(4)},${a.toFixed(4)}`;
}
function Kt(u) {
  let t = 0;
  const e = u.length;
  for (let a = 0; a < e; a++) {
    const l = u[a], o = u[(a + 1) % e];
    t += l.x * o.y - o.x * l.y;
  }
  return 0.5 * t;
}
function $t(u, t, e) {
  if (!u.length) return "";
  const a = (i) => ({
    x: (i.x - t.minX) * e,
    y: (t.maxY - i.y) * e
  }), l = a(u[0]), o = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let i = 1; i < u.length; i++) {
    const n = a(u[i]);
    o.push(`L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`);
  }
  return o.push("Z"), o.join(" ");
}
function De(u) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (p, b) => {
    const g = _t(p), m = _t(b);
    t.has(g) || t.set(g, []), t.has(m) || t.set(m, []), t.get(g).push(b), t.get(m).push(p), e.has(g) || e.set(g, p), e.has(m) || e.set(m, b);
  };
  for (const p of u) a(p.start, p.end);
  const l = /* @__PURE__ */ new Set(), o = (p, b) => {
    const g = _t(p), m = _t(b);
    return g < m ? `${g}|${m}` : `${m}|${g}`;
  }, i = [];
  for (const [p, b] of t.entries()) {
    const g = e.get(p);
    for (const m of b) {
      const d = o(g, m);
      if (l.has(d)) continue;
      const y = [g];
      let s = g, _ = m;
      l.add(d);
      for (let f = 0; f < 1e5; f++) {
        y.push(_);
        const w = _t(_), S = t.get(w) ?? [];
        if (S.length === 0) break;
        let k = null;
        for (const R of S) {
          if (_t(R) === _t(s) && S.length > 1) continue;
          const T = o(_, R);
          if (!l.has(T)) {
            k = R, l.add(T);
            break;
          }
        }
        if (k || (k = S[0]), s = _, _ = k, _t(_) === _t(g))
          break;
      }
      y.length >= 3 && i.push(y);
    }
  }
  i.sort((p, b) => Math.abs(Kt(b)) - Math.abs(Kt(p)));
  const n = [], h = /* @__PURE__ */ new Set();
  for (const p of i) {
    const b = p.map((g) => _t(g)).join(";");
    h.has(b) || (h.add(b), n.push(p));
  }
  return n;
}
function Jt(u, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), o = Math.max(1, Math.round(mt(a))), i = mt(1), n = [];
  for (const h of u.regions)
    for (const p of h.loops)
      n.push($t(p, t, i));
  if (n.length === 0 && u.tracks.length) {
    const h = De(u.tracks);
    if (h.length) {
      const p = h[0];
      n.push($t(p, t, i));
      for (let b = 1; b < h.length; b++)
        n.push($t(h[b], t, i));
    }
  }
  return n.length === 0 ? Wt(l, o) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${o}" viewBox="0 0 ${l} ${o}">
  <rect x="0" y="0" width="${l}" height="${o}" fill="black"/>
  <path d="${n.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function le(u) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const o of u.loops)
    for (const i of o)
      t = Math.min(t, i.x), e = Math.min(e, i.y), a = Math.max(a, i.x), l = Math.max(l, i.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function Le(u, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const p of u.regions) {
    const b = le(p), g = (b.maxX - b.minX) * (b.maxY - b.minY);
    p.polarity === "clear" ? l = Math.max(l, g) : a = Math.max(a, g);
  }
  const o = u.tracks.filter((p) => p.polarity !== "clear").length + u.flashes.filter((p) => p.polarity !== "clear").length + u.regions.filter((p) => p.polarity !== "clear").length, i = u.tracks.filter((p) => p.polarity === "clear").length + u.flashes.filter((p) => p.polarity === "clear").length + u.regions.filter((p) => p.polarity === "clear").length, n = l > e * 0.85;
  return !(a > e * 0.85 || !n || !(i > o * 2));
}
function Qt(u, t, e, a) {
  const l = t.maxX - t.minX, o = t.maxY - t.minY, i = Math.max(1, Math.round(mt(l))), n = Math.max(1, Math.round(mt(o))), h = mt(1), p = Le(u, t), b = p ? "white" : "black", g = (k, R) => {
    const T = k - t.minX, B = t.maxY - R;
    return { x: T * h, y: B * h };
  }, m = (k, R) => {
    if (k.kind === "track") {
      const T = g(k.start.x, k.start.y), B = g(k.end.x, k.end.y), W = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, O = Math.max(1, W * h);
      return `<line x1="${T.x.toFixed(2)}" y1="${T.y.toFixed(2)}" x2="${B.x.toFixed(2)}" y2="${B.y.toFixed(2)}" stroke-width="${O.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${R}" stroke="${R}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const T = g(k.position.x, k.position.y), B = k.widthMm ?? k.diameterMm ?? 0.8, W = k.heightMm ?? k.diameterMm ?? 0.8, O = Math.max(0.01, Number.isFinite(B) ? B : 0.8) * h, X = Math.max(0.01, Number.isFinite(W) ? W : 0.8) * h, Q = T.x - O / 2, M = T.y - X / 2, D = k.rotationDeg, c = D && Math.abs(D) > 0.01 ? ` transform="rotate(${(-D).toFixed(2)},${T.x.toFixed(2)},${T.y.toFixed(2)})"` : "";
      if (k.shape === "R" || k.shape === "O") {
        const tt = k.shape === "O" ? Math.min(O, X) * 0.5 : 0;
        return `<rect x="${Q.toFixed(2)}" y="${M.toFixed(2)}" width="${O.toFixed(2)}" height="${X.toFixed(2)}" rx="${tt.toFixed(2)}" ry="${tt.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      if (Number.isFinite(k.cornerMm) && (k.cornerMm ?? 0) > 0) {
        const tt = Math.max(0, k.cornerMm * h);
        return `<rect x="${Q.toFixed(2)}" y="${M.toFixed(2)}" width="${O.toFixed(2)}" height="${X.toFixed(2)}" rx="${tt.toFixed(2)}" ry="${tt.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      const L = Math.max(1, Math.max(O, X) / 2);
      return `<circle cx="${T.x.toFixed(2)}" cy="${T.y.toFixed(2)}" r="${L.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
    }
    if (k.kind === "region") {
      const T = k.loops.map((B) => {
        if (!B.length) return "";
        const W = g(B[0].x, B[0].y), O = [`M ${W.x.toFixed(2)} ${W.y.toFixed(2)}`];
        for (let X = 1; X < B.length; X++) {
          const Q = g(B[X].x, B[X].y);
          O.push(`L ${Q.x.toFixed(2)} ${Q.y.toFixed(2)}`);
        }
        return O.push("Z"), O.join(" ");
      }).join(" ");
      return T.trim() ? `<path d="${T}" fill-rule="evenodd" fill="${R}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  for (const k of u.ops) {
    const R = k.polarity === "clear" ? "black" : "white", T = m(k, R);
    T && d.push(T);
  }
  console.log("[polarity counts]", {
    tracksClear: u.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: u.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: p
  });
  const y = (t.maxX - t.minX) * (t.maxY - t.minY);
  let s = 0, _ = 0;
  for (const k of u.regions) {
    const R = le(k), T = (R.maxX - R.minX) * (R.maxY - R.minY);
    k.polarity === "clear" ? _ = Math.max(_, T) : s = Math.max(s, T);
  }
  const f = u.tracks.filter((k) => k.polarity !== "clear").length + u.flashes.filter((k) => k.polarity !== "clear").length + u.regions.filter((k) => k.polarity !== "clear").length, w = u.tracks.filter((k) => k.polarity === "clear").length + u.flashes.filter((k) => k.polarity === "clear").length + u.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: w,
    largestDarkRegionArea: s,
    largestClearRegionArea: _,
    boardArea: y,
    negative: p
  });
  const S = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  <defs>
    <mask id="${S}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${n}" fill="${b}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${n}" fill="${e}" opacity="${a}" mask="url(#${S})" />
</svg>`.trim();
}
function te(u, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), o = Math.max(1, Math.round(mt(a))), i = Math.max(1e-6, mt(1)), n = "rgba(255,255,255,0.95)", h = "rgba(255,255,255,0.95)", p = u.tracks.map((m) => {
    const d = Rt(m.start.x, m.start.y, t), y = Rt(m.end.x, m.end.y, t), s = Number.isFinite(m.width) ? m.width : 0.15, _ = Math.max(1, s * i);
    return `<line x1="${(d.x * i).toFixed(2)}" y1="${(d.y * i).toFixed(2)}" x2="${(y.x * i).toFixed(2)}" y2="${(y.y * i).toFixed(2)}" stroke="${n}" stroke-width="${_.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = u.flashes.map((m) => {
    const d = Rt(m.position.x, m.position.y, t), y = d.x * i, s = d.y * i, _ = m.widthMm ?? m.diameterMm ?? 0.6, f = m.heightMm ?? m.diameterMm ?? 0.6;
    if (m.shape === "R" || m.shape === "O") {
      const S = _ * i, k = f * i, R = y - S / 2, T = s - k / 2, B = m.shape === "O" ? Math.min(S, k) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${T.toFixed(2)}" width="${S.toFixed(2)}" height="${k.toFixed(2)}" rx="${B.toFixed(2)}" fill="${h}" />`;
    }
    const w = (m.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${y.toFixed(2)}" cy="${s.toFixed(2)}" r="${Math.max(1, w).toFixed(2)}" fill="${h}" />`;
  }), g = u.regions.map((m) => {
    const d = m.loops.map((y) => {
      if (!y.length) return "";
      const s = Rt(y[0].x, y[0].y, t), _ = [`M ${(s.x * i).toFixed(2)} ${(s.y * i).toFixed(2)}`];
      for (let f = 1; f < y.length; f++) {
        const w = Rt(y[f].x, y[f].y, t);
        _.push(`L ${(w.x * i).toFixed(2)} ${(w.y * i).toFixed(2)}`);
      }
      return _.push("Z"), _.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${h}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${o}" viewBox="0 0 ${l} ${o}">
  ${p.join(`
  `)}
  ${b.join(`
  `)}
  ${g.join(`
  `)}
</svg>`.trim();
}
function $e(u, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.round(mt(e)), o = Math.round(mt(a)), i = mt(1), n = u.map((h) => {
    const p = Rt(h.x, h.y, t), b = p.x * i, g = p.y * i, m = (h.diameter || 0.6) * i / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${g.toFixed(2)}" r="${Math.max(1, m).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${o}" viewBox="0 0 ${l} ${o}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ce(u) {
  const t = Object.keys(u).filter((r) => !!r), e = ze(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (r) => {
    if (!r) return null;
    const N = u[r];
    return N ? a.decode(N) : null;
  }, o = await l(e.top_copper), i = await l(e.bottom_copper), n = await l(e.outline), h = await l(e.drills), p = await l(e.top_silk), b = await l(e.bottom_silk), g = o ? Ct(e.top_copper || "top", o) : null, m = i ? Ct(e.bottom_copper || "bot", i) : null, d = n ? Ct(e.outline || "outline", n) : null, y = h ? Te(e.drills || "drills", h) : null, s = y ? y.holes.map((r) => ({ x: r.x, y: r.y, diameter: r.diameter })) : [], _ = p ? Ct(e.top_silk || "top_silk", p) : null, f = b ? Ct(e.bottom_silk || "bot_silk", b) : null, w = g ? vt(xt(g)) : null, S = m ? vt(xt(m)) : null, k = d ? vt(xt(d)) : null, R = s.length ? vt(Fe(s)) : null, T = _ ? vt(xt(_)) : null, B = f ? vt(xt(f)) : null, W = (k && It(k) ? k : null) || (w && It(w) ? w : null) || (S && It(S) ? S : null) || (R && It(R) ? R : null), O = W ? W.maxX - W.minX : 1, X = w ? Mt(w.maxX - w.minX, O) : 1, Q = S ? Mt(S.maxX - S.minX, O) : 1, M = k ? Mt(k.maxX - k.minX, O) : 1, D = R ? Mt(R.maxX - R.minX, O) : 1, c = T ? Mt(T.maxX - T.minX, O) : 1, L = B ? Mt(B.maxX - B.minX, O) : 1, tt = g ? Tt(g, X) : null, j = m ? Tt(m, Q) : null, st = d ? Tt(d, M) : null, Y = s.length ? Be(s, D) : [], it = _ ? Tt(_, c) : null, P = f ? Tt(f, L) : null;
  let I = null;
  if (st) {
    const r = vt(xt(st));
    It(r) && (I = r);
  }
  if (!I) {
    let r = Xt();
    tt && (r = Ht(r, xt(tt))), j && (r = Ht(r, xt(j))), r = vt(r), I = r;
  }
  const V = vt(I), z = V.maxX - V.minX, E = V.maxY - V.minY, q = {
    board: {
      width_in: z / 25.4,
      height_in: E / 25.4,
      mm_bounds: {
        min_x_mm: V.minX,
        min_y_mm: V.minY,
        max_x_mm: V.maxX,
        max_y_mm: V.maxY
      }
    }
  }, et = Math.max(1, Math.round(mt(z))), J = Math.max(1, Math.round(mt(E))), H = [], rt = (r) => {
    const N = Pe(r);
    return H.push(N), N;
  }, ot = st ? Jt(st, V) : Wt(et, J), ht = st ? Jt(st, V) : Wt(et, J), lt = {
    top_board_mask: rt(ot),
    bottom_board_mask: rt(ht)
  };
  return tt && (lt.top_copper = rt(Qt(tt, V, "#fbbf24", 1))), j && (lt.bottom_copper = rt(Qt(j, V, "#38bdf8", 1))), Y.length && (lt.drills = rt($e(Y, V))), it && (lt.top_silk = rt(te(it, V))), P && (lt.bottom_silk = rt(te(P, V))), {
    boardGeom: q,
    layers: lt,
    revoke: () => H.forEach((r) => URL.revokeObjectURL(r))
  };
}
async function or(u) {
  const t = u instanceof Uint8Array ? u.byteOffset === 0 && u.byteLength === u.buffer.byteLength ? u.buffer : u.slice().buffer : u instanceof ArrayBuffer ? u : await u.arrayBuffer(), { files: e, archiveType: a } = await ae(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await ce(e);
}
async function ar(u, t) {
  const { files: e } = await ae(u, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ce(e);
}
function Ut(u, t) {
  const [
    e,
    a,
    l,
    o,
    i,
    n,
    h,
    p,
    b
  ] = u, [
    g,
    m,
    d,
    y,
    s,
    _,
    f,
    w,
    S
  ] = t;
  return [
    e * g + a * y + l * f,
    e * m + a * s + l * w,
    e * d + a * _ + l * S,
    o * g + i * y + n * f,
    o * m + i * s + n * w,
    o * d + i * _ + n * S,
    h * g + p * y + b * f,
    h * m + p * s + b * w,
    h * d + p * _ + b * S
  ];
}
function ee(u, t) {
  return [1, 0, u, 0, 1, t, 0, 0, 1];
}
function Ue(u, t) {
  return [u, 0, 0, 0, t, 0, 0, 0, 1];
}
function We(u) {
  const t = Math.cos(u), e = Math.sin(u);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function re(u, t) {
  const e = u[0] * t.x + u[1] * t.y + u[2], a = u[3] * t.x + u[4] * t.y + u[5], l = u[6] * t.x + u[7] * t.y + u[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function je(u) {
  const t = u[0], e = u[1], a = u[2], l = u[3], o = u[4], i = u[5], n = t * o - e * l;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const h = 1 / n, p = o * h, b = -e * h, g = -l * h, m = t * h, d = -(p * a + b * i), y = -(g * a + m * i);
  return [p, b, d, g, m, y, 0, 0, 1];
}
class Xe {
  constructor(t, e) {
    this.camera = {
      center_mm: t.center_mm,
      zoom: t.zoom,
      rotation_rad: t.rotation_rad ?? 0,
      mirrorX: t.mirrorX ?? !1,
      mirrorY: t.mirrorY ?? !1
    }, this.viewport = e, this.worldToScreenMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.screenToWorldMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.recompute();
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
    try {
      let e;
      if (Array.isArray(t))
        e = { x: t[0], y: t[1] };
      else if ("x" in t)
        e = { x: t.x, y: t.y };
      else if ("x_mm" in t)
        e = { x: t.x_mm ?? 0, y: t.y_mm ?? 0 };
      else
        return { x: NaN, y: NaN };
      return re(this.worldToScreenMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  screenToBoard(t) {
    try {
      let e;
      if (Array.isArray(t))
        e = { x: t[0], y: t[1] };
      else if ("x" in t)
        e = { x: t.x, y: t.y };
      else if ("x_px" in t)
        e = { x: t.x_px ?? 0, y: t.y_px ?? 0 };
      else
        return { x: NaN, y: NaN };
      return re(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: o, mirrorX: i, mirrorY: n } = this.camera, h = { x: t / 2, y: e / 2 }, p = n ? -1 : 1, b = i ? -1 : 1, g = ee(-a.x, -a.y), m = We(o), d = Ue(l * b, l * p), y = ee(h.x, h.y), s = Ut(y, Ut(d, Ut(m, g)));
    this.worldToScreenMat = s, this.screenToWorldMat = je(s);
  }
}
class Ye {
  constructor(t) {
    this.onFrame = t, this.pending = !1, this.reasons = /* @__PURE__ */ new Set();
  }
  requestRender(t = "unknown") {
    this.reasons.add(t), !this.pending && (this.pending = !0, requestAnimationFrame(() => {
      this.pending = !1;
      const e = Array.from(this.reasons);
      this.reasons.clear(), this.onFrame(e);
    }));
  }
  isPending() {
    return this.pending;
  }
  getPendingReasons() {
    return Array.from(this.reasons);
  }
}
let Ze = class {
  constructor() {
    this.overlays = /* @__PURE__ */ new Map(), this.sortedCache = [], this.dirty = !0;
  }
  add(t) {
    if (this.overlays.has(t.id))
      throw new Error(`Overlay already exists: ${t.id}`);
    this.overlays.set(t.id, t), this.dirty = !0;
  }
  remove(t) {
    const e = this.overlays.get(t);
    if (e)
      return this.overlays.delete(t), this.dirty = !0, e;
  }
  get(t) {
    return this.overlays.get(t);
  }
  setVisible(t, e) {
    const a = this.overlays.get(t);
    a && a.visible !== e && (a.visible = e);
  }
  setZIndex(t, e) {
    const a = this.overlays.get(t);
    a && a.zIndex !== e && (a.zIndex = e, this.dirty = !0);
  }
  list() {
    return Array.from(this.overlays.values());
  }
  getSortedVisible() {
    return this.dirty && (this.sortedCache = Array.from(this.overlays.values()).sort((t, e) => t.zIndex - e.zIndex), this.dirty = !1), this.sortedCache.filter((t) => t.visible);
  }
};
class Ge {
  constructor(t) {
    this.cells = /* @__PURE__ */ new Map(), this.cellSize_mm = t;
  }
  cellCoord(t, e) {
    const a = Math.floor(t / this.cellSize_mm), l = Math.floor(e / this.cellSize_mm);
    return { cx: a, cy: l, key: `${a},${l}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, a) {
    const { key: l } = this.cellCoord(e, a);
    let o = this.cells.get(l);
    o || (o = /* @__PURE__ */ new Set(), this.cells.set(l, o)), o.add(t);
  }
  remove(t, e, a) {
    const { key: l } = this.cellCoord(e, a), o = this.cells.get(l);
    o && (o.delete(t), o.size === 0 && this.cells.delete(l));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, a) {
    const { cx: l, cy: o } = this.cellCoord(t, e), i = Math.ceil(a / this.cellSize_mm), n = [];
    for (let h = -i; h <= i; h++)
      for (let p = -i; p <= i; p++) {
        const b = `${l + h},${o + p}`, g = this.cells.get(b);
        if (g)
          for (const m of g) n.push(m);
      }
    return n;
  }
}
class qe {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new Ge(5), this.dirtyList = !0, this.listCache = [];
  }
  clear() {
    this.byId.clear(), this.index.clear(), this.dirtyList = !0;
  }
  addMany(t) {
    for (const e of t) this.add(e);
  }
  add(t) {
    if (this.byId.has(t.id)) {
      const e = this.byId.get(t.id);
      this.index.remove(e.id, e.x_mm, e.y_mm);
    }
    this.byId.set(t.id, t), this.index.insert(t.id, t.x_mm, t.y_mm), this.dirtyList = !0;
  }
  updateMany(t) {
    for (const e of t) {
      const a = this.byId.get(e.id);
      if (!a) continue;
      const l = { ...a, ...e };
      (l.x_mm !== a.x_mm || l.y_mm !== a.y_mm) && (this.index.remove(a.id, a.x_mm, a.y_mm), this.index.insert(a.id, l.x_mm, l.y_mm)), this.byId.set(a.id, l), this.dirtyList = !0;
    }
  }
  remove(t) {
    const e = this.byId.get(t);
    e && (this.index.remove(e.id, e.x_mm, e.y_mm), this.byId.delete(t), this.dirtyList = !0);
  }
  get(t) {
    return this.byId.get(t);
  }
  list() {
    return this.dirtyList && (this.listCache = Array.from(this.byId.values()), this.dirtyList = !1), this.listCache;
  }
  // Used for picking
  queryNear(t, e, a) {
    const l = this.index.queryRadius(t, e, a), o = [];
    for (const i of l) {
      const n = this.byId.get(i);
      n && o.push(n);
    }
    return o;
  }
}
class Ve {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, a, l = 10) {
    const o = t.screenToBoard({ x: e, y: a }), i = t.xform.getCamera().zoom, n = l / i, h = this.store.queryNear(o.x, o.y, n);
    let p = null;
    for (const b of h) {
      const g = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), m = g.x - e, d = g.y - a, y = Math.sqrt(m * m + d * d);
      y <= l && (!p || y < p.distance_px) && (p = { id: b.id, marker: b, distance_px: y });
    }
    return p;
  }
}
class He {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    let a = this.handlers.get(t);
    return a || (a = /* @__PURE__ */ new Set(), this.handlers.set(t, a)), a.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const a = this.on(t, (l) => {
      a(), e(l);
    });
    return a;
  }
  off(t, e) {
    const a = this.handlers.get(t);
    a && (a.delete(e), a.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const a = this.handlers.get(t);
    if (!a || a.size === 0) return;
    const l = Array.from(a);
    for (const o of l) o(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class de {
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
    const e = this.getState();
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
    }, JSON.stringify(e) !== JSON.stringify(this.state) && this.notifyListeners();
  }
  setGerberVisibility(t, e) {
    this.state.gerber[t] !== e && (this.state.gerber[t] = e, this.notifyListeners());
  }
  setOverlayVisibility(t, e) {
    t in this.state.overlays || (this.state.overlays[t] = !1), this.state.overlays[t] !== e && (this.state.overlays[t] = e, this.notifyListeners());
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
class Ke {
  constructor(t, e) {
    this.passes = [], this.overlays = new Ze(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new qe(), this.markerPicker = new Ve(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new He(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const a = t.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context");
    this.ctx = a;
    const l = t.getBoundingClientRect(), o = {
      width_px: l.width,
      height_px: l.height
    };
    this.xform = new Xe(e, o), this.visibility = new de(), this.scheduler = new Ye(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: n }) => {
        const h = this.xform.boardToScreen({ x: i, y: n });
        return { x_px: h.x, y_px: h.y };
      },
      screenToBoard: ({ x_px: i, y_px: n }) => {
        const h = this.xform.screenToBoard({ x: i, y: n });
        return { x_mm: h.x, y_mm: h.y };
      },
      getViewState: () => {
        const i = this.xform.getCamera();
        return { center_mm: i.center_mm, zoom: i.zoom, rotation_rad: i.rotation_rad };
      },
      getViewport: () => ({ width_px: this.canvas.width, height_px: this.canvas.height }),
      getBoardBounds: () => this.boardBounds,
      requestRender: (i) => this.requestRender(i)
    }, this.registerDefaultPasses(), this.setupResizeHandling();
  }
  emit(t, e) {
    this.events.emit(t, e);
  }
  setHoverMarker(t) {
    if (t !== this.hoverMarkerId) {
      if (this.hoverMarkerId = t, t) {
        const e = this.markers.get(t);
        this.emit("hover:marker", { markerId: t, marker: e });
      } else
        this.emit("hover:marker", { markerId: null });
      this.requestRender("hover-change");
    }
  }
  setupResizeHandling() {
    new ResizeObserver(() => {
      this.requestRender("canvas-resize");
    }).observe(this.canvas);
  }
  registerDefaultPasses() {
  }
  addPass(t) {
    this.passes.push(t), this.passes.sort((e, a) => e.order - a.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((a) => a.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, a = e.getBoundingClientRect(), l = { width_px: a.width, height_px: a.height };
    this.xform.setViewport(l);
    const o = {
      canvas: e,
      ctx: t,
      viewport: l,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      // Use visibility manager
      boardBounds: this.boardBounds,
      boardToScreen: (n) => this.xform.boardToScreen({ x: n.x, y: n.y }),
      screenToBoard: (n) => this.xform.screenToBoard({ x: n.x, y: n.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height);
    const i = window.devicePixelRatio || 1;
    t.scale(i, i), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width / i, e.height / i);
    for (const n of this.passes)
      if (n.enabled(o)) {
        t.save();
        try {
          n.draw(o);
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
  // Visibility controls - delegate to VisibilityManager
  setVisibility(t) {
    this.visibility.setState(t), this.requestRender("visibility-change");
  }
  getVisibility() {
    return this.visibility.getState();
  }
  // Convenience methods for specific visibility controls
  setGerberVisibility(t, e) {
    this.visibility.setGerberVisibility(t, e), this.requestRender("gerber-visibility");
  }
  setOverlayVisibility(t, e) {
    this.visibility.setOverlayVisibility(t, e), this.requestRender("overlay-visibility");
  }
  setMarkersVisibility(t) {
    this.visibility.setMarkersVisibility(t), this.requestRender("markers-visibility");
  }
  // Toggle methods
  toggleGerberLayer(t) {
    this.visibility.toggleGerberLayer(t), this.requestRender("gerber-toggle");
  }
  toggleOverlay(t) {
    this.visibility.toggleOverlay(t), this.requestRender("overlay-toggle");
  }
  toggleMarkers() {
    this.visibility.toggleMarkers(), this.requestRender("markers-toggle");
  }
  // Presets
  applyVisibilityPreset(t) {
    this.visibility.applyPreset(t), this.requestRender("visibility-preset");
  }
  // Subscription for reactive updates
  onVisibilityChange(t) {
    return this.visibility.subscribe(t);
  }
  // Public access to overlay API for render passes
  getOverlayApi() {
    return this.overlayApi;
  }
  // Utility methods
  screenToBoard(t, e) {
    return this.xform.screenToBoard({ x: t, y: e });
  }
  boardToScreen(t, e) {
    return this.xform.boardToScreen({ x: t, y: e });
  }
  // Helper to convert canvas events to pixel coordinates
  eventToCanvasPx(t) {
    const e = this.canvas.getBoundingClientRect();
    return {
      x_px: t.clientX - e.left,
      y_px: t.clientY - e.top
    };
  }
  // Emit view change events when camera moves
  emitViewChange() {
    const t = this.xform.getCamera();
    this.emit("view:change", {
      center_mm: t.center_mm,
      zoom: t.zoom,
      rotation_rad: t.rotation_rad || 0
    });
  }
  createRenderCtx() {
    const t = { width_px: this.canvas.width, height_px: this.canvas.height };
    return this.xform.setViewport(t), {
      canvas: this.canvas,
      ctx: this.ctx,
      viewport: t,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      boardBounds: this.boardBounds,
      boardToScreen: (e) => this.xform.boardToScreen({ x: e.x, y: e.y }),
      screenToBoard: (e) => this.xform.screenToBoard({ x: e.x, y: e.y })
    };
  }
  // Board bounds management
  setBoardBounds(t) {
    this.boardBounds = t;
  }
  // Overlay management
  addOverlayLayer(t) {
    this.overlays.add(t), t.onAdd?.(this.overlayApi), this.requestRender(`overlay:add:${t.id}`);
  }
  removeOverlay(t) {
    const e = this.overlays.remove(t);
    e && (e.onRemove?.(), this.requestRender(`overlay:remove:${t}`));
  }
  getOverlayRegistry() {
    return this.overlays;
  }
  // Marker management
  addMarker(t) {
    this.markers.add(t), this.requestRender(`marker:add:${t.id}`);
  }
  addMarkers(t) {
    this.markers.addMany(t), this.requestRender(`markers:add:${t.length}`);
  }
  removeMarker(t) {
    this.markers.remove(t), this.selectedMarkerId === t && (this.selectedMarkerId = null), this.hoverMarkerId === t && (this.hoverMarkerId = null), this.requestRender(`marker:remove:${t}`);
  }
  updateMarker(t, e) {
    this.markers.updateMany([{ id: t, ...e }]), this.requestRender(`marker:update:${t}`);
  }
  getMarker(t) {
    return this.markers.get(t);
  }
  listMarkers() {
    return this.markers.list();
  }
  clearMarkers() {
    this.markers.clear(), this.selectedMarkerId = null, this.hoverMarkerId = null, this.requestRender("markers:clear");
  }
  // Marker picking
  pickMarker(t, e, a = 10) {
    const l = this.createRenderCtx();
    return this.markerPicker.pick(l, t, e, a);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const a = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: a }), e?.center;
      } else
        this.emit("select:marker", { markerId: null });
      this.requestRender("selection-change");
    }
  }
  getSelectedMarker() {
    return this.selectedMarkerId && this.markers.get(this.selectedMarkerId) || null;
  }
  // Get marker state for render pass
  getMarkerState() {
    return {
      selectedId: this.selectedMarkerId,
      hoverId: this.hoverMarkerId
    };
  }
  // Mouse event handling for picking and events
  handleMouseMove(t) {
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), o = this.markerPicker.pick(l, e, a, 10);
    this.setHoverMarker(o?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), o = this.markerPicker.pick(l, e, a, 10);
    if (o) {
      this.selectMarker(o.id);
      return;
    }
    const i = l.screenToBoard({ x: e, y: a });
    this.emit("click:board", { x_mm: i.x, y_mm: i.y });
  }
  // Method to set up event listeners (call after viewer creation)
  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (t) => this.handleMouseMove(t)), this.canvas.addEventListener("click", (t) => this.handleMouseClick(t));
  }
  // Debug method to get render pipeline info
  getDebugInfo() {
    const t = this.createRenderCtx();
    return {
      passes: this.passes.map((e) => ({
        id: e.id,
        order: e.order,
        enabled: e.enabled(t)
      })),
      pendingRender: this.scheduler.isPending(),
      pendingReasons: this.scheduler.getPendingReasons(),
      camera: this.getCamera(),
      visibility: this.getVisibility()
    };
  }
}
const kt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function cr(u, t, e, a) {
  return {
    id: `gerber:${u}`,
    order: t,
    enabled: (l) => l.visibility.gerber[e],
    draw: (l) => {
      const o = l.ctx, i = l.xform.getWorldToScreenMatrix();
      o.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), a(o);
    }
  };
}
class Je {
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
    return Array.from(this.overlays.values()).filter((t) => t.visible).sort((t, e) => t.zIndex - e.zIndex);
  }
  setVisible(t, e) {
    const a = this.overlays.get(t);
    a && (a.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Qe(u, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = u.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
      l.sort((i, n) => i.zIndex - n.zIndex);
      const o = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const i of l)
        e.ctx.save(), i.draw(e.ctx, o), e.ctx.restore();
    }
  };
}
let tr = class {
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
    const e = t.ctx, a = t.xform.getCamera().zoom;
    if (!(a < 2)) {
      e.setTransform(1, 0, 0, 1, 0, 0);
      for (const o of this.markers.values()) {
        if (!o.position || typeof o.position.x != "number" || typeof o.position.y != "number" || !isFinite(o.position.x) || !isFinite(o.position.y)) {
          console.warn(`Invalid marker position for ${o.id}:`, {
            position: o.position,
            marker: o,
            keys: Object.keys(o)
          });
          continue;
        }
        const i = t.boardToScreen(o.position);
        i.x < -10 || i.x > t.viewport.width_px + 10 || i.y < -10 || i.y > t.viewport.height_px + 10 || this.drawMarker(e, i, o, a);
      }
    }
  }
  drawMarker(t, e, a, l) {
    const o = Math.max(3, Math.min(8, l / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, o, 0, Math.PI * 2), a.type) {
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
};
function er(u) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => u.draw(t)
  };
}
class rr {
  draw(t, e) {
    if (!e) return;
    const a = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(a, t, e.id);
        break;
      case "geometry":
        this.drawGeometrySelection(a, t, e.id);
        break;
      case "region":
        this.drawRegionSelection(a, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, a) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, e, a) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, e, a) {
    if (!a) return;
    const l = e.xform.getWorldToScreenMatrix();
    t.setTransform(l[0], l[3], l[1], l[4], l[2], l[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      a.min.x,
      a.min.y,
      a.max.x - a.min.x,
      a.max.y - a.min.y
    );
  }
}
function ir(u, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const a = t();
      a && u.draw(e, a);
    }
  };
}
function hr(u, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, a = t.showDownloadButton !== !1;
  u.innerHTML = `
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

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>${a ? `
            <button class="btn btn-primary" id="download-btn" type="button" title="Download">
              ${e}
              Download
            </button>` : ""}
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
  const l = u.firstElementChild, o = it(l, "#board-viewport"), i = it(l, "#render-canvas"), n = it(l, "#grid-toggle"), h = it(l, "#grid-units"), p = it(l, "#fit-btn"), b = a ? it(l, "#download-btn") : null, g = Array.from(l.querySelectorAll('input[name="side"]')), m = new Ke(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), d = new de();
  d.subscribe(() => {
    m.requestRender("visibility-change");
  });
  const y = new Je(), s = new tr(), _ = new rr();
  let f = null;
  function w() {
    const z = o.getBoundingClientRect(), E = window.devicePixelRatio || 1;
    i.width = z.width * E, i.height = z.height * E, i.style.width = `${z.width}px`, i.style.height = `${z.height}px`, m.requestRender("resize");
  }
  const S = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (z, E) => {
      const et = E.view.zoom, J = h.value, H = J === "mm" ? 1 : 2.54, rt = J === "mm" ? 10 : 25.4, ot = H * et, ht = rt * et;
      if (ot < 2) return;
      const lt = i.width / (window.devicePixelRatio || 1), r = i.height / (window.devicePixelRatio || 1), N = E.screenToBoard({ x: 0, y: 0 }), F = E.screenToBoard({ x: lt, y: r });
      z.setTransform(1, 0, 0, 1, 0, 0), z.strokeStyle = "rgba(59, 130, 246, 0.4)", z.lineWidth = 1, z.beginPath();
      const x = Math.floor(N.x / H) * H, v = Math.floor(N.y / H) * H;
      for (let A = x; A <= F.x; A += H) {
        const $ = E.boardToScreen({ x: A, y: 0 }).x;
        z.moveTo($, 0), z.lineTo($, i.height);
      }
      for (let A = v; A <= F.y; A += H) {
        const $ = E.boardToScreen({ x: 0, y: A }).y;
        z.moveTo(0, $), z.lineTo(i.width, $);
      }
      if (z.stroke(), ht >= 8) {
        z.strokeStyle = "rgba(59, 130, 246, 0.7)", z.lineWidth = 1.5, z.beginPath();
        const A = Math.floor(N.x / rt) * rt, $ = Math.floor(N.y / rt) * rt;
        for (let U = A; U <= F.x; U += rt) {
          const C = E.boardToScreen({ x: U, y: 0 }).x;
          z.moveTo(C, 0), z.lineTo(C, i.height);
        }
        for (let U = $; U <= F.y; U += rt) {
          const C = E.boardToScreen({ x: 0, y: U }).y;
          z.moveTo(0, C), z.lineTo(i.width, C);
        }
        z.stroke();
      }
    }
  };
  y.add(S), d.setOverlayVisibility("grid", !1), d.setMarkersVisibility(!1), m.addPass(Qe(y, m.getOverlayApi())), m.addPass(er(s)), m.addPass(ir(_, () => f));
  let k = null, R = {}, T = "top", B = !1;
  function W(z, E, q) {
    if (!q) return null;
    const et = new Image();
    return et.src = q, et.addEventListener("load", () => {
      m.requestRender(`image-loaded-${z}`);
    }), {
      id: z,
      order: E,
      enabled: (J) => !!k?.board?.mm_bounds,
      draw: (J) => {
        if (!et.complete || !k?.board?.mm_bounds) return;
        const H = J.ctx, rt = J.xform.getWorldToScreenMatrix();
        H.setTransform(rt[0], rt[3], rt[1], rt[4], rt[2], rt[5]);
        let ot;
        (R.top_board_mask || R.bottom_board_mask) && (ot = 0.5);
        const ht = X(H, k, ot);
        D(H, ht, (lt) => {
          if (!k?.board?.mm_bounds) return;
          const r = k.board.mm_bounds, N = r.max_x_mm - r.min_x_mm, F = r.max_y_mm - r.min_y_mm;
          lt.drawImage(et, r.min_x_mm, r.min_y_mm, N, F);
        });
      }
    };
  }
  function O(z, E) {
    return {
      id: z,
      order: E,
      enabled: (q) => !!k?.board?.mm_bounds,
      draw: (q) => {
        if (!k?.board?.mm_bounds) return;
        const et = q.ctx, J = q.xform.getWorldToScreenMatrix();
        et.setTransform(J[0], J[3], J[1], J[4], J[2], J[5]);
        const H = X(et, k, 0.5);
        M(et, H);
      }
    };
  }
  function X(z, E, q) {
    if (!E?.board?.mm_bounds) return new Path2D();
    const et = E.board.mm_bounds, J = et.min_x_mm, H = et.min_y_mm, rt = et.max_x_mm - et.min_x_mm, ot = et.max_y_mm - et.min_y_mm;
    return Q(J, H, rt, ot, q || 0);
  }
  function Q(z, E, q, et, J) {
    const H = new Path2D(), rt = Math.max(0, Math.min(J, Math.min(q, et) / 2));
    return H.moveTo(z + rt, E), H.lineTo(z + q - rt, E), H.quadraticCurveTo(z + q, E, z + q, E + rt), H.lineTo(z + q, E + et - rt), H.quadraticCurveTo(z + q, E + et, z + q - rt, E + et), H.lineTo(z + rt, E + et), H.quadraticCurveTo(z, E + et, z, E + et - rt), H.lineTo(z, E + rt), H.quadraticCurveTo(z, E, z + rt, E), H.closePath(), H;
  }
  function M(z, E) {
    z.save(), z.clip(E), z.fillStyle = "#1a5f1a", z.fill(E), z.strokeStyle = "#0d3d0d", z.lineWidth = 0.1, z.stroke(E), z.restore();
  }
  function D(z, E, q) {
    z.save(), z.clip(E), q(z), z.restore();
  }
  function c() {
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
    ].forEach((q) => {
      m.removePass(q);
    }), !k) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: T === "bottom" ? R.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: T === "bottom" ? R.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: T === "bottom" ? R.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: T === "top" ? R.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: T === "top" ? R.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: T === "top" ? R.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: R.drills },
      { id: "layer:vias", order: 45, url: R.vias }
    ].forEach((q) => {
      let et;
      q.useFR4 ? et = O(q.id, q.order) : q.url && (et = W(q.id, q.order, q.url)), et && m.addPass(et);
    }), m.requestRender("side-switch"), setTimeout(() => m.requestRender("side-switch-delayed"), 50);
  }
  function L(z = 0.08) {
    if (!k?.board?.mm_bounds) return;
    const E = o.getBoundingClientRect(), q = k.board.mm_bounds, et = q.max_x_mm - q.min_x_mm, J = q.max_y_mm - q.min_y_mm, H = E.width * (1 - 2 * z), rt = E.height * (1 - 2 * z), ot = H / et, ht = rt / J, lt = Math.min(ot, ht), r = (q.min_x_mm + q.max_x_mm) / 2, N = (q.min_y_mm + q.max_y_mm) / 2;
    m.setCamera({
      center_mm: { x: r, y: N },
      zoom: lt
    });
  }
  i.addEventListener("wheel", (z) => {
    z.preventDefault(), B = !0;
    const E = i.getBoundingClientRect(), q = z.clientX - E.left, et = z.clientY - E.top, J = m.getCamera(), H = z.deltaY < 0 ? 1.1 : 0.9, rt = Math.max(0.2, Math.min(50, J.zoom * H)), ot = m.screenToBoard(q, et);
    m.setCamera({ zoom: rt });
    const ht = m.screenToBoard(q, et), lt = ot.x - ht.x, r = ot.y - ht.y, N = {
      x: J.center_mm.x + lt,
      y: J.center_mm.y + r
    };
    m.setCamera({
      center_mm: N,
      zoom: rt
    });
  }, { passive: !1 });
  let tt = !1, j = null;
  i.addEventListener("mousedown", (z) => {
    if (z.button !== 0) return;
    z.preventDefault(), B = !0, tt = !0;
    const E = i.getBoundingClientRect();
    j = m.screenToBoard(
      z.clientX - E.left,
      z.clientY - E.top
    );
  });
  const st = (z) => {
    if (!tt || !j) return;
    const E = i.getBoundingClientRect(), q = m.screenToBoard(
      z.clientX - E.left,
      z.clientY - E.top
    ), et = j.x - q.x, J = j.y - q.y, H = m.getCamera();
    m.setCamera({
      center_mm: {
        x: H.center_mm.x + et,
        y: H.center_mm.y + J
      }
    });
  }, Y = () => {
    tt = !1, j = null;
  };
  window.addEventListener("mousemove", st), window.addEventListener("mouseup", Y), n.addEventListener("change", () => {
    const z = n.checked;
    d.setOverlayVisibility("grid", z), S.visible = z, m.requestRender("grid-toggle");
  }), h.addEventListener("change", () => {
    d.isOverlayVisible("grid") && m.requestRender("grid-units");
  }), p.addEventListener("click", () => L(0.08)), b?.addEventListener("click", () => t.onDownload?.()), g.forEach((z) => {
    z.addEventListener("change", () => {
      T = g.find((E) => E.checked)?.value || "top", c();
    });
  }), window.addEventListener("resize", () => {
    w(), B || L(0.08);
  });
  function it(z, E) {
    const q = z.querySelector(E);
    if (!q) throw new Error(`Missing required element: ${E}`);
    return q;
  }
  function P(z) {
    k = z.boardGeom, R = z.layers, k?.board?.mm_bounds && m.setBoardBounds({
      minX_mm: k.board.mm_bounds.min_x_mm,
      minY_mm: k.board.mm_bounds.min_y_mm,
      maxX_mm: k.board.mm_bounds.max_x_mm,
      maxY_mm: k.board.mm_bounds.max_y_mm
    }), c(), w(), L(0.08);
  }
  function I(z) {
    T = z;
    const E = g.find((q) => q.value === z);
    E && (E.checked = !0), c();
  }
  function V() {
    window.removeEventListener("mousemove", st), window.removeEventListener("mouseup", Y), u.innerHTML = "";
  }
  return w(), {
    setData: P,
    setSideMode: I,
    fit: () => L(0.08),
    dispose: V,
    // Expose new render pipeline API
    viewer: m,
    visibility: d,
    overlayRegistry: y,
    markerRenderer: s,
    setSelection: (z) => {
      f = z, m.requestRender("selection-change");
    },
    addMarker: (z) => {
      if (typeof z.x_mm != "number" || typeof z.y_mm != "number" || !isFinite(z.x_mm) || !isFinite(z.y_mm)) {
        console.warn(`Invalid marker coordinates for ${z.id}:`, {
          x_mm: z.x_mm,
          y_mm: z.y_mm,
          marker: z,
          keys: Object.keys(z)
        });
        return;
      }
      const E = {
        id: z.id,
        position: { x: z.x_mm, y: z.y_mm },
        type: "custom",
        // Default type for DFM markers
        data: {
          ...z.data,
          severity: z.severity,
          layer: z.layer,
          radius_mm: z.radius_mm
        }
      };
      s.add(E), m.requestRender("marker-added");
    },
    addMarkers: (z) => {
      for (const E of z) {
        if (typeof E.x_mm != "number" || typeof E.y_mm != "number" || !isFinite(E.x_mm) || !isFinite(E.y_mm)) {
          console.warn(`Invalid marker coordinates for ${E.id}:`, {
            x_mm: E.x_mm,
            y_mm: E.y_mm,
            marker: E,
            keys: Object.keys(E)
          });
          continue;
        }
        const q = {
          id: E.id,
          position: { x: E.x_mm, y: E.y_mm },
          type: "custom",
          // Default type for DFM markers
          data: {
            ...E.data,
            severity: E.severity,
            layer: E.layer,
            radius_mm: E.radius_mm
          }
        };
        s.add(q);
      }
      m.requestRender("markers-added");
    },
    removeMarker: (z) => {
      s.remove(z), m.requestRender("marker-removed");
    }
  };
}
function ur(u, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const a = e.xform.getWorldToScreenMatrix(), l = u.getSortedVisible();
      for (const o of l)
        e.ctx.save(), o.drawInWorldSpace ? e.ctx.setTransform(a[0], a[3], a[1], a[4], a[2], a[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), o.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function fr() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (u, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      u.fillStyle = "red";
      for (const a of e)
        u.beginPath(), u.arc(a.x_mm, a.y_mm, 0.25, 0, Math.PI * 2), u.fill();
    }
  };
}
function mr(u) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const a = u();
      a && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(a.x_px + 12, a.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(a.text, a.x_px + 15, a.y_px - 5));
    }
  };
}
function pr(u = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const a = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let l = a.minX_mm; l <= a.maxX_mm; l += u)
        t.moveTo(l, a.minY_mm), t.lineTo(l, a.maxY_mm);
      for (let l = a.minY_mm; l <= a.maxY_mm; l += u)
        t.moveTo(a.minX_mm, l), t.lineTo(a.maxX_mm, l);
      t.stroke();
    }
  };
}
function yr(u) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, a) => {
      t += 16;
      const l = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + l * 0.7})`, e.beginPath(), e.arc(u.x_mm, u.y_mm, 0.5 + l * 0.5, 0, Math.PI * 2), e.fill(), a.requestRender("overlay:animate");
    }
  };
}
function nr(u, t) {
  const e = t.maxX_mm - t.minX_mm, a = t.maxY_mm - t.minY_mm;
  return u.x_mm < 0 || u.x_mm > e || u.y_mm < 0 || u.y_mm > a;
}
class sr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const a = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: l, height_px: o } = t.viewport, i = 4;
    for (const n of a) {
      if (typeof n.x_mm != "number" || typeof n.y_mm != "number" || !isFinite(n.x_mm) || !isFinite(n.y_mm)) {
        console.warn(`Invalid marker coordinates for ${n.id}:`, {
          x_mm: n.x_mm,
          y_mm: n.y_mm,
          marker: n,
          keys: Object.keys(n)
        });
        continue;
      }
      const h = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), p = h.x, b = h.y;
      if (p < -10 || b < -10 || p > l + 10 || b > o + 10) continue;
      const g = e?.boardBounds ? nr({ x_mm: n.x_mm, y_mm: n.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id, g), t.ctx.beginPath(), t.ctx.arc(p, b, i, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, a, l, o) {
    if (a)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (l)
      t.fillStyle = "rgba(245, 158, 11, 0.8)", t.strokeStyle = "rgba(245, 158, 11, 1)";
    else if (o)
      t.fillStyle = "rgba(107, 114, 128, 0.4)", t.strokeStyle = "rgba(107, 114, 128, 0.6)", t.setLineDash([2, 2]);
    else {
      switch (e.severity) {
        case "error":
          t.fillStyle = "rgba(239, 68, 68, 0.8)";
          break;
        case "warning":
          t.fillStyle = "rgba(245, 158, 11, 0.8)";
          break;
        case "info":
          t.fillStyle = "rgba(59, 130, 246, 0.8)";
          break;
        default:
          t.fillStyle = "rgba(107, 114, 128, 0.8)";
          break;
      }
      t.setLineDash([]);
    }
  }
}
function gr(u, t) {
  const e = new sr(u);
  return {
    id: "markers",
    order: kt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (a) => {
      if (!a.visibility.markers) return;
      const l = t();
      e.draw(a, {
        selectedId: l.selectedId,
        hoverId: l.hoverId,
        boardBounds: a.boardBounds
      });
    }
  };
}
export {
  He as Emitter,
  ft as GerberError,
  Ve as MarkerPicker,
  sr as MarkerRenderer,
  qe as MarkerStore,
  Ze as OverlayRegistry,
  Ye as RenderScheduler,
  rr as SelectionRenderer,
  Ge as UniformGridIndex,
  Ke as Viewer,
  Xe as ViewportTransform,
  de as VisibilityManager,
  cr as createGerberPass,
  pr as createGridOverlay,
  hr as createIntegratedViewer,
  gr as createMarkerPass,
  ur as createOverlayPass,
  yr as createPulsingMarkerOverlay,
  ir as createSelectionPass,
  mr as createTooltipOverlay,
  fr as createViolationDotsOverlay,
  Se as detectGerberBundle,
  ar as renderGerbers,
  ce as renderGerbersFiles,
  or as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
