var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ce(g) {
  return g && g.__esModule && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g;
}
function Pt(g) {
  throw new Error('Could not dynamically require "' + g + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var Xt;
function he() {
  return Xt || (Xt = 1, (function(g, t) {
    (function(e) {
      g.exports = e();
    })(function() {
      return (function e(o, c, s) {
        function i(v, y) {
          if (!c[v]) {
            if (!o[v]) {
              var u = typeof Pt == "function" && Pt;
              if (!y && u) return u(v, !0);
              if (n) return n(v, !0);
              var _ = new Error("Cannot find module '" + v + "'");
              throw _.code = "MODULE_NOT_FOUND", _;
            }
            var h = c[v] = { exports: {} };
            o[v][0].call(h.exports, function(m) {
              var a = o[v][1][m];
              return i(a || m);
            }, h, h.exports, e, o, c, s);
          }
          return c[v].exports;
        }
        for (var n = typeof Pt == "function" && Pt, d = 0; d < s.length; d++) i(s[d]);
        return i;
      })({ 1: [function(e, o, c) {
        var s = e("./utils"), i = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        c.encode = function(d) {
          for (var v, y, u, _, h, m, a, p = [], f = 0, k = d.length, S = k, x = s.getTypeOf(d) !== "string"; f < d.length; ) S = k - f, u = x ? (v = d[f++], y = f < k ? d[f++] : 0, f < k ? d[f++] : 0) : (v = d.charCodeAt(f++), y = f < k ? d.charCodeAt(f++) : 0, f < k ? d.charCodeAt(f++) : 0), _ = v >> 2, h = (3 & v) << 4 | y >> 4, m = 1 < S ? (15 & y) << 2 | u >> 6 : 64, a = 2 < S ? 63 & u : 64, p.push(n.charAt(_) + n.charAt(h) + n.charAt(m) + n.charAt(a));
          return p.join("");
        }, c.decode = function(d) {
          var v, y, u, _, h, m, a = 0, p = 0, f = "data:";
          if (d.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var k, S = 3 * (d = d.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (d.charAt(d.length - 1) === n.charAt(64) && S--, d.charAt(d.length - 2) === n.charAt(64) && S--, S % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (k = i.uint8array ? new Uint8Array(0 | S) : new Array(0 | S); a < d.length; ) v = n.indexOf(d.charAt(a++)) << 2 | (_ = n.indexOf(d.charAt(a++))) >> 4, y = (15 & _) << 4 | (h = n.indexOf(d.charAt(a++))) >> 2, u = (3 & h) << 6 | (m = n.indexOf(d.charAt(a++))), k[p++] = v, h !== 64 && (k[p++] = y), m !== 64 && (k[p++] = u);
          return k;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, o, c) {
        var s = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), d = e("./stream/DataLengthProbe");
        function v(y, u, _, h, m) {
          this.compressedSize = y, this.uncompressedSize = u, this.crc32 = _, this.compression = h, this.compressedContent = m;
        }
        v.prototype = { getContentWorker: function() {
          var y = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")), u = this;
          return y.on("end", function() {
            if (this.streamInfo.data_length !== u.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), y;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(y, u, _) {
          return y.pipe(new n()).pipe(new d("uncompressedSize")).pipe(u.compressWorker(_)).pipe(new d("compressedSize")).withStreamInfo("compression", u);
        }, o.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, o, c) {
        var s = e("./stream/GenericWorker");
        c.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, c.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, o, c) {
        var s = e("./utils"), i = (function() {
          for (var n, d = [], v = 0; v < 256; v++) {
            n = v;
            for (var y = 0; y < 8; y++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            d[v] = n;
          }
          return d;
        })();
        o.exports = function(n, d) {
          return n !== void 0 && n.length ? s.getTypeOf(n) !== "string" ? (function(v, y, u, _) {
            var h = i, m = _ + u;
            v ^= -1;
            for (var a = _; a < m; a++) v = v >>> 8 ^ h[255 & (v ^ y[a])];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : (function(v, y, u, _) {
            var h = i, m = _ + u;
            v ^= -1;
            for (var a = _; a < m; a++) v = v >>> 8 ^ h[255 & (v ^ y.charCodeAt(a))];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, o, c) {
        c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !0, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
      }, {}], 6: [function(e, o, c) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), o.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, o, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), n = e("./utils"), d = e("./stream/GenericWorker"), v = s ? "uint8array" : "array";
        function y(u, _) {
          d.call(this, "FlateWorker/" + u), this._pako = null, this._pakoAction = u, this._pakoOptions = _, this.meta = {};
        }
        c.magic = "\b\0", n.inherits(y, d), y.prototype.processChunk = function(u) {
          this.meta = u.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(v, u.data), !1);
        }, y.prototype.flush = function() {
          d.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, y.prototype.cleanUp = function() {
          d.prototype.cleanUp.call(this), this._pako = null;
        }, y.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var u = this;
          this._pako.onData = function(_) {
            u.push({ data: _, meta: u.meta });
          };
        }, c.compressWorker = function(u) {
          return new y("Deflate", u);
        }, c.uncompressWorker = function() {
          return new y("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, o, c) {
        function s(h, m) {
          var a, p = "";
          for (a = 0; a < m; a++) p += String.fromCharCode(255 & h), h >>>= 8;
          return p;
        }
        function i(h, m, a, p, f, k) {
          var S, x, A = h.file, P = h.compression, O = k !== v.utf8encode, L = n.transformTo("string", k(A.name)), T = n.transformTo("string", v.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", k(j)), R = n.transformTo("string", v.utf8encode(j)), F = T.length !== A.name.length, l = R.length !== j.length, D = "", Q = "", X = "", et = A.dir, C = A.date, Z = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !a || (Z.crc32 = h.crc32, Z.compressedSize = h.compressedSize, Z.uncompressedSize = h.uncompressedSize);
          var M = 0;
          m && (M |= 8), O || !F && !l || (M |= 2048);
          var E = 0, V = 0;
          et && (E |= 16), f === "UNIX" ? (V = 798, E |= (function(U, at) {
            var lt = U;
            return U || (lt = at ? 16893 : 33204), (65535 & lt) << 16;
          })(A.unixPermissions, et)) : (V = 20, E |= (function(U) {
            return 63 & (U || 0);
          })(A.dosPermissions)), S = C.getUTCHours(), S <<= 6, S |= C.getUTCMinutes(), S <<= 5, S |= C.getUTCSeconds() / 2, x = C.getUTCFullYear() - 1980, x <<= 4, x |= C.getUTCMonth() + 1, x <<= 5, x |= C.getUTCDate(), F && (Q = s(1, 1) + s(y(L), 4) + T, D += "up" + s(Q.length, 2) + Q), l && (X = s(1, 1) + s(y(K), 4) + R, D += "uc" + s(X.length, 2) + X);
          var Y = "";
          return Y += `
\0`, Y += s(M, 2), Y += P.magic, Y += s(S, 2), Y += s(x, 2), Y += s(Z.crc32, 4), Y += s(Z.compressedSize, 4), Y += s(Z.uncompressedSize, 4), Y += s(L.length, 2), Y += s(D.length, 2), { fileRecord: u.LOCAL_FILE_HEADER + Y + L + D, dirRecord: u.CENTRAL_FILE_HEADER + s(V, 2) + Y + s(K.length, 2) + "\0\0\0\0" + s(E, 4) + s(p, 4) + L + D + K };
        }
        var n = e("../utils"), d = e("../stream/GenericWorker"), v = e("../utf8"), y = e("../crc32"), u = e("../signature");
        function _(h, m, a, p) {
          d.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = m, this.zipPlatform = a, this.encodeFileName = p, this.streamFiles = h, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(_, d), _.prototype.push = function(h) {
          var m = h.meta.percent || 0, a = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(h) : (this.bytesWritten += h.data.length, d.prototype.push.call(this, { data: h.data, meta: { currentFile: this.currentFile, percent: a ? (m + 100 * (a - p - 1)) / a : 100 } }));
        }, _.prototype.openedSource = function(h) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = h.file.name;
          var m = this.streamFiles && !h.file.dir;
          if (m) {
            var a = i(h, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: a.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, _.prototype.closedSource = function(h) {
          this.accumulate = !1;
          var m = this.streamFiles && !h.file.dir, a = i(h, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(a.dirRecord), m) this.push({ data: (function(p) {
            return u.DATA_DESCRIPTOR + s(p.crc32, 4) + s(p.compressedSize, 4) + s(p.uncompressedSize, 4);
          })(h), meta: { percent: 100 } });
          else for (this.push({ data: a.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, _.prototype.flush = function() {
          for (var h = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var a = this.bytesWritten - h, p = (function(f, k, S, x, A) {
            var P = n.transformTo("string", A(x));
            return u.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(f, 2) + s(f, 2) + s(k, 4) + s(S, 4) + s(P.length, 2) + P;
          })(this.dirRecords.length, a, h, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, _.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, _.prototype.registerPrevious = function(h) {
          this._sources.push(h);
          var m = this;
          return h.on("data", function(a) {
            m.processChunk(a);
          }), h.on("end", function() {
            m.closedSource(m.previous.streamInfo), m._sources.length ? m.prepareNextSource() : m.end();
          }), h.on("error", function(a) {
            m.error(a);
          }), this;
        }, _.prototype.resume = function() {
          return !!d.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, _.prototype.error = function(h) {
          var m = this._sources;
          if (!d.prototype.error.call(this, h)) return !1;
          for (var a = 0; a < m.length; a++) try {
            m[a].error(h);
          } catch {
          }
          return !0;
        }, _.prototype.lock = function() {
          d.prototype.lock.call(this);
          for (var h = this._sources, m = 0; m < h.length; m++) h[m].lock();
        }, o.exports = _;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, o, c) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        c.generateWorker = function(n, d, v) {
          var y = new i(d.streamFiles, v, d.platform, d.encodeFileName), u = 0;
          try {
            n.forEach(function(_, h) {
              u++;
              var m = (function(k, S) {
                var x = k || S, A = s[x];
                if (!A) throw new Error(x + " is not a valid compression method !");
                return A;
              })(h.options.compression, d.compression), a = h.options.compressionOptions || d.compressionOptions || {}, p = h.dir, f = h.date;
              h._compressWorker(m, a).withStreamInfo("file", { name: _, dir: p, date: f, comment: h.comment || "", unixPermissions: h.unixPermissions, dosPermissions: h.dosPermissions }).pipe(y);
            }), y.entriesCount = u;
          } catch (_) {
            y.error(_);
          }
          return y;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, o, c) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var i = new s();
            for (var n in this) typeof this[n] != "function" && (i[n] = this[n]);
            return i;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(i, n) {
          return new s().loadAsync(i, n);
        }, s.external = e("./external"), o.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, o, c) {
        var s = e("./utils"), i = e("./external"), n = e("./utf8"), d = e("./zipEntries"), v = e("./stream/Crc32Probe"), y = e("./nodejsUtils");
        function u(_) {
          return new i.Promise(function(h, m) {
            var a = _.decompressed.getContentWorker().pipe(new v());
            a.on("error", function(p) {
              m(p);
            }).on("end", function() {
              a.streamInfo.crc32 !== _.decompressed.crc32 ? m(new Error("Corrupted zip : CRC32 mismatch")) : h();
            }).resume();
          });
        }
        o.exports = function(_, h) {
          var m = this;
          return h = s.extend(h || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), y.isNode && y.isStream(_) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", _, !0, h.optimizedBinaryString, h.base64).then(function(a) {
            var p = new d(h);
            return p.load(a), p;
          }).then(function(a) {
            var p = [i.Promise.resolve(a)], f = a.files;
            if (h.checkCRC32) for (var k = 0; k < f.length; k++) p.push(u(f[k]));
            return i.Promise.all(p);
          }).then(function(a) {
            for (var p = a.shift(), f = p.files, k = 0; k < f.length; k++) {
              var S = f[k], x = S.fileNameStr, A = s.resolve(S.fileNameStr);
              m.file(A, S.decompressed, { binary: !0, optimizedBinaryString: !0, date: S.date, dir: S.dir, comment: S.fileCommentStr.length ? S.fileCommentStr : null, unixPermissions: S.unixPermissions, dosPermissions: S.dosPermissions, createFolders: h.createFolders }), S.dir || (m.file(A).unsafeOriginalName = x);
            }
            return p.zipComment.length && (m.comment = p.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, o, c) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function n(d, v) {
          i.call(this, "Nodejs stream input adapter for " + d), this._upstreamEnded = !1, this._bindStream(v);
        }
        s.inherits(n, i), n.prototype._bindStream = function(d) {
          var v = this;
          (this._stream = d).pause(), d.on("data", function(y) {
            v.push({ data: y, meta: { percent: 0 } });
          }).on("error", function(y) {
            v.isPaused ? this.generatedError = y : v.error(y);
          }).on("end", function() {
            v.isPaused ? v._upstreamEnded = !0 : v.end();
          });
        }, n.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, o.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, o, c) {
        var s = e("readable-stream").Readable;
        function i(n, d, v) {
          s.call(this, d), this._helper = n;
          var y = this;
          n.on("data", function(u, _) {
            y.push(u) || y._helper.pause(), v && v(_);
          }).on("error", function(u) {
            y.emit("error", u);
          }).on("end", function() {
            y.push(null);
          });
        }
        e("../utils").inherits(i, s), i.prototype._read = function() {
          this._helper.resume();
        }, o.exports = i;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, o, c) {
        o.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, i) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, i);
          if (typeof s == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(s, i);
        }, allocBuffer: function(s) {
          if (Buffer.alloc) return Buffer.alloc(s);
          var i = new Buffer(s);
          return i.fill(0), i;
        }, isBuffer: function(s) {
          return Buffer.isBuffer(s);
        }, isStream: function(s) {
          return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
        } };
      }, {}], 15: [function(e, o, c) {
        function s(A, P, O) {
          var L, T = n.getTypeOf(P), j = n.extend(O || {}, y);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = f(A)), j.createFolders && (L = p(A)) && k.call(this, L, !0);
          var K = T === "string" && j.binary === !1 && j.base64 === !1;
          O && O.binary !== void 0 || (j.binary = !K), (P instanceof u && P.uncompressedSize === 0 || j.dir || !P || P.length === 0) && (j.base64 = !1, j.binary = !0, P = "", j.compression = "STORE", T = "string");
          var R = null;
          R = P instanceof u || P instanceof d ? P : m.isNode && m.isStream(P) ? new a(A, P) : n.prepareContent(A, P, j.binary, j.optimizedBinaryString, j.base64);
          var F = new _(A, R, j);
          this.files[A] = F;
        }
        var i = e("./utf8"), n = e("./utils"), d = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), y = e("./defaults"), u = e("./compressedObject"), _ = e("./zipObject"), h = e("./generate"), m = e("./nodejsUtils"), a = e("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var P = A.lastIndexOf("/");
          return 0 < P ? A.substring(0, P) : "";
        }, f = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, k = function(A, P) {
          return P = P !== void 0 ? P : y.createFolders, A = f(A), this.files[A] || s.call(this, A, null, { dir: !0, createFolders: P }), this.files[A];
        };
        function S(A) {
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
          if (arguments.length !== 1) return A = this.root + A, s.call(this, A, P, O), this;
          if (S(A)) {
            var L = A;
            return this.filter(function(j, K) {
              return !K.dir && L.test(j);
            });
          }
          var T = this.files[this.root + A];
          return T && !T.dir ? T : null;
        }, folder: function(A) {
          if (!A) return this;
          if (S(A)) return this.filter(function(T, j) {
            return j.dir && A.test(T);
          });
          var P = this.root + A, O = k.call(this, P), L = this.clone();
          return L.root = O.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var P = this.files[A];
          if (P || (A.slice(-1) !== "/" && (A += "/"), P = this.files[A]), P && !P.dir) delete this.files[A];
          else for (var O = this.filter(function(T, j) {
            return j.name.slice(0, A.length) === A;
          }), L = 0; L < O.length; L++) delete this.files[O[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var P, O = {};
          try {
            if ((O = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            n.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var L = O.comment || this.comment || "";
            P = h.generateWorker(this, O, L);
          } catch (T) {
            (P = new d("error")).error(T);
          }
          return new v(P, O.type || "string", O.mimeType);
        }, generateAsync: function(A, P) {
          return this.generateInternalStream(A).accumulate(P);
        }, generateNodeStream: function(A, P) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(P);
        } };
        o.exports = x;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, o, c) {
        o.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, o, c) {
        var s = e("./DataReader");
        function i(n) {
          s.call(this, n);
          for (var d = 0; d < this.data.length; d++) n[d] = 255 & n[d];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, i.prototype.lastIndexOfSignature = function(n) {
          for (var d = n.charCodeAt(0), v = n.charCodeAt(1), y = n.charCodeAt(2), u = n.charCodeAt(3), _ = this.length - 4; 0 <= _; --_) if (this.data[_] === d && this.data[_ + 1] === v && this.data[_ + 2] === y && this.data[_ + 3] === u) return _ - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(n) {
          var d = n.charCodeAt(0), v = n.charCodeAt(1), y = n.charCodeAt(2), u = n.charCodeAt(3), _ = this.readData(4);
          return d === _[0] && v === _[1] && y === _[2] && u === _[3];
        }, i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, o, c) {
        var s = e("../utils");
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
          var d, v = 0;
          for (this.checkOffset(n), d = this.index + n - 1; d >= this.index; d--) v = (v << 8) + this.byteAt(d);
          return this.index += n, v;
        }, readString: function(n) {
          return s.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, o.exports = i;
      }, { "../utils": 32 }], 19: [function(e, o, c) {
        var s = e("./Uint8ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          this.checkOffset(n);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, o, c) {
        var s = e("./DataReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, i.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, i.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, i.prototype.readData = function(n) {
          this.checkOffset(n);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, o, c) {
        var s = e("./ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var d = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, o, c) {
        var s = e("../utils"), i = e("../support"), n = e("./ArrayReader"), d = e("./StringReader"), v = e("./NodeBufferReader"), y = e("./Uint8ArrayReader");
        o.exports = function(u) {
          var _ = s.getTypeOf(u);
          return s.checkSupport(_), _ !== "string" || i.uint8array ? _ === "nodebuffer" ? new v(u) : i.uint8array ? new y(s.transformTo("uint8array", u)) : new n(s.transformTo("array", u)) : new d(u);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, o, c) {
        c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, o, c) {
        var s = e("./GenericWorker"), i = e("../utils");
        function n(d) {
          s.call(this, "ConvertWorker to " + d), this.destType = d;
        }
        i.inherits(n, s), n.prototype.processChunk = function(d) {
          this.push({ data: i.transformTo(this.destType, d.data), meta: d.meta });
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, o, c) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function n() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, s), n.prototype.processChunk = function(d) {
          this.streamInfo.crc32 = i(d.data, this.streamInfo.crc32 || 0), this.push(d);
        }, o.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, o, c) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(d) {
          i.call(this, "DataLengthProbe for " + d), this.propName = d, this.withStreamInfo(d, 0);
        }
        s.inherits(n, i), n.prototype.processChunk = function(d) {
          if (d) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + d.data.length;
          }
          i.prototype.processChunk.call(this, d);
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, o, c) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(d) {
          i.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, d.then(function(y) {
            v.dataIsReady = !0, v.data = y, v.max = y && y.length || 0, v.type = s.getTypeOf(y), v.isPaused || v._tickAndRepeat();
          }, function(y) {
            v.error(y);
          });
        }
        s.inherits(n, i), n.prototype.cleanUp = function() {
          i.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, n.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var d = null, v = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              d = this.data.substring(this.index, v);
              break;
            case "uint8array":
              d = this.data.subarray(this.index, v);
              break;
            case "array":
            case "nodebuffer":
              d = this.data.slice(this.index, v);
          }
          return this.index = v, this.push({ data: d, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, o, c) {
        function s(i) {
          this.name = i || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        s.prototype = { push: function(i) {
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
          if (this._listeners[i]) for (var d = 0; d < this._listeners[i].length; d++) this._listeners[i][d].call(this, n);
        }, pipe: function(i) {
          return i.registerPrevious(this);
        }, registerPrevious: function(i) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = i.streamInfo, this.mergeStreamInfo(), this.previous = i;
          var n = this;
          return i.on("data", function(d) {
            n.processChunk(d);
          }), i.on("end", function() {
            n.end();
          }), i.on("error", function(d) {
            n.error(d);
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
        } }, o.exports = s;
      }, {}], 29: [function(e, o, c) {
        var s = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), d = e("../base64"), v = e("../support"), y = e("../external"), u = null;
        if (v.nodestream) try {
          u = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function _(m, a) {
          return new y.Promise(function(p, f) {
            var k = [], S = m._internalType, x = m._outputType, A = m._mimeType;
            m.on("data", function(P, O) {
              k.push(P), a && a(O);
            }).on("error", function(P) {
              k = [], f(P);
            }).on("end", function() {
              try {
                var P = (function(O, L, T) {
                  switch (O) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", L), T);
                    case "base64":
                      return d.encode(L);
                    default:
                      return s.transformTo(O, L);
                  }
                })(x, (function(O, L) {
                  var T, j = 0, K = null, R = 0;
                  for (T = 0; T < L.length; T++) R += L[T].length;
                  switch (O) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (K = new Uint8Array(R), T = 0; T < L.length; T++) K.set(L[T], j), j += L[T].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(S, k), A);
                p(P);
              } catch (O) {
                f(O);
              }
              k = [];
            }).resume();
          });
        }
        function h(m, a, p) {
          var f = a;
          switch (a) {
            case "blob":
            case "arraybuffer":
              f = "uint8array";
              break;
            case "base64":
              f = "string";
          }
          try {
            this._internalType = f, this._outputType = a, this._mimeType = p, s.checkSupport(f), this._worker = m.pipe(new i(f)), m.lock();
          } catch (k) {
            this._worker = new n("error"), this._worker.error(k);
          }
        }
        h.prototype = { accumulate: function(m) {
          return _(this, m);
        }, on: function(m, a) {
          var p = this;
          return m === "data" ? this._worker.on(m, function(f) {
            a.call(p, f.data, f.meta);
          }) : this._worker.on(m, function() {
            s.delay(a, arguments, p);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new u(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, o.exports = h;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, o, c) {
        if (c.base64 = !0, c.array = !0, c.string = !0, c.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", c.nodebuffer = typeof Buffer < "u", c.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") c.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            c.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              i.append(s), c.blob = i.getBlob("application/zip").size === 0;
            } catch {
              c.blob = !1;
            }
          }
        }
        try {
          c.nodestream = !!e("readable-stream").Readable;
        } catch {
          c.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, o, c) {
        for (var s = e("./utils"), i = e("./support"), n = e("./nodejsUtils"), d = e("./stream/GenericWorker"), v = new Array(256), y = 0; y < 256; y++) v[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        v[254] = v[254] = 1;
        function u() {
          d.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function _() {
          d.call(this, "utf-8 encode");
        }
        c.utf8encode = function(h) {
          return i.nodebuffer ? n.newBufferFrom(h, "utf-8") : (function(m) {
            var a, p, f, k, S, x = m.length, A = 0;
            for (k = 0; k < x; k++) (64512 & (p = m.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (f = m.charCodeAt(k + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), k++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (a = i.uint8array ? new Uint8Array(A) : new Array(A), k = S = 0; S < A; k++) (64512 & (p = m.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (f = m.charCodeAt(k + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), k++), p < 128 ? a[S++] = p : (p < 2048 ? a[S++] = 192 | p >>> 6 : (p < 65536 ? a[S++] = 224 | p >>> 12 : (a[S++] = 240 | p >>> 18, a[S++] = 128 | p >>> 12 & 63), a[S++] = 128 | p >>> 6 & 63), a[S++] = 128 | 63 & p);
            return a;
          })(h);
        }, c.utf8decode = function(h) {
          return i.nodebuffer ? s.transformTo("nodebuffer", h).toString("utf-8") : (function(m) {
            var a, p, f, k, S = m.length, x = new Array(2 * S);
            for (a = p = 0; a < S; ) if ((f = m[a++]) < 128) x[p++] = f;
            else if (4 < (k = v[f])) x[p++] = 65533, a += k - 1;
            else {
              for (f &= k === 2 ? 31 : k === 3 ? 15 : 7; 1 < k && a < S; ) f = f << 6 | 63 & m[a++], k--;
              1 < k ? x[p++] = 65533 : f < 65536 ? x[p++] = f : (f -= 65536, x[p++] = 55296 | f >> 10 & 1023, x[p++] = 56320 | 1023 & f);
            }
            return x.length !== p && (x.subarray ? x = x.subarray(0, p) : x.length = p), s.applyFromCharCode(x);
          })(h = s.transformTo(i.uint8array ? "uint8array" : "array", h));
        }, s.inherits(u, d), u.prototype.processChunk = function(h) {
          var m = s.transformTo(i.uint8array ? "uint8array" : "array", h.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var a = m;
              (m = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), m.set(a, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var p = (function(k, S) {
            var x;
            for ((S = S || k.length) > k.length && (S = k.length), x = S - 1; 0 <= x && (192 & k[x]) == 128; ) x--;
            return x < 0 || x === 0 ? S : x + v[k[x]] > S ? x : S;
          })(m), f = m;
          p !== m.length && (i.uint8array ? (f = m.subarray(0, p), this.leftOver = m.subarray(p, m.length)) : (f = m.slice(0, p), this.leftOver = m.slice(p, m.length))), this.push({ data: c.utf8decode(f), meta: h.meta });
        }, u.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: c.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, c.Utf8DecodeWorker = u, s.inherits(_, d), _.prototype.processChunk = function(h) {
          this.push({ data: c.utf8encode(h.data), meta: h.meta });
        }, c.Utf8EncodeWorker = _;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, o, c) {
        var s = e("./support"), i = e("./base64"), n = e("./nodejsUtils"), d = e("./external");
        function v(a) {
          return a;
        }
        function y(a, p) {
          for (var f = 0; f < a.length; ++f) p[f] = 255 & a.charCodeAt(f);
          return p;
        }
        e("setimmediate"), c.newBlob = function(a, p) {
          c.checkSupport("blob");
          try {
            return new Blob([a], { type: p });
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return f.append(a), f.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var u = { stringifyByChunk: function(a, p, f) {
          var k = [], S = 0, x = a.length;
          if (x <= f) return String.fromCharCode.apply(null, a);
          for (; S < x; ) p === "array" || p === "nodebuffer" ? k.push(String.fromCharCode.apply(null, a.slice(S, Math.min(S + f, x)))) : k.push(String.fromCharCode.apply(null, a.subarray(S, Math.min(S + f, x)))), S += f;
          return k.join("");
        }, stringifyByChar: function(a) {
          for (var p = "", f = 0; f < a.length; f++) p += String.fromCharCode(a[f]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return s.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return s.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function _(a) {
          var p = 65536, f = c.getTypeOf(a), k = !0;
          if (f === "uint8array" ? k = u.applyCanBeUsed.uint8array : f === "nodebuffer" && (k = u.applyCanBeUsed.nodebuffer), k) for (; 1 < p; ) try {
            return u.stringifyByChunk(a, f, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return u.stringifyByChar(a);
        }
        function h(a, p) {
          for (var f = 0; f < a.length; f++) p[f] = a[f];
          return p;
        }
        c.applyFromCharCode = _;
        var m = {};
        m.string = { string: v, array: function(a) {
          return y(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return m.string.uint8array(a).buffer;
        }, uint8array: function(a) {
          return y(a, new Uint8Array(a.length));
        }, nodebuffer: function(a) {
          return y(a, n.allocBuffer(a.length));
        } }, m.array = { string: _, array: v, arraybuffer: function(a) {
          return new Uint8Array(a).buffer;
        }, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, m.arraybuffer = { string: function(a) {
          return _(new Uint8Array(a));
        }, array: function(a) {
          return h(new Uint8Array(a), new Array(a.byteLength));
        }, arraybuffer: v, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(new Uint8Array(a));
        } }, m.uint8array = { string: _, array: function(a) {
          return h(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return a.buffer;
        }, uint8array: v, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, m.nodebuffer = { string: _, array: function(a) {
          return h(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return m.nodebuffer.uint8array(a).buffer;
        }, uint8array: function(a) {
          return h(a, new Uint8Array(a.length));
        }, nodebuffer: v }, c.transformTo = function(a, p) {
          if (p = p || "", !a) return p;
          c.checkSupport(a);
          var f = c.getTypeOf(p);
          return m[f][a](p);
        }, c.resolve = function(a) {
          for (var p = a.split("/"), f = [], k = 0; k < p.length; k++) {
            var S = p[k];
            S === "." || S === "" && k !== 0 && k !== p.length - 1 || (S === ".." ? f.pop() : f.push(S));
          }
          return f.join("/");
        }, c.getTypeOf = function(a) {
          return typeof a == "string" ? "string" : Object.prototype.toString.call(a) === "[object Array]" ? "array" : s.nodebuffer && n.isBuffer(a) ? "nodebuffer" : s.uint8array && a instanceof Uint8Array ? "uint8array" : s.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, c.checkSupport = function(a) {
          if (!s[a.toLowerCase()]) throw new Error(a + " is not supported by this platform");
        }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function(a) {
          var p, f, k = "";
          for (f = 0; f < (a || "").length; f++) k += "\\x" + ((p = a.charCodeAt(f)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return k;
        }, c.delay = function(a, p, f) {
          setImmediate(function() {
            a.apply(f || null, p || []);
          });
        }, c.inherits = function(a, p) {
          function f() {
          }
          f.prototype = p.prototype, a.prototype = new f();
        }, c.extend = function() {
          var a, p, f = {};
          for (a = 0; a < arguments.length; a++) for (p in arguments[a]) Object.prototype.hasOwnProperty.call(arguments[a], p) && f[p] === void 0 && (f[p] = arguments[a][p]);
          return f;
        }, c.prepareContent = function(a, p, f, k, S) {
          return d.Promise.resolve(p).then(function(x) {
            return s.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) && typeof FileReader < "u" ? new d.Promise(function(A, P) {
              var O = new FileReader();
              O.onload = function(L) {
                A(L.target.result);
              }, O.onerror = function(L) {
                P(L.target.error);
              }, O.readAsArrayBuffer(x);
            }) : x;
          }).then(function(x) {
            var A = c.getTypeOf(x);
            return A ? (A === "arraybuffer" ? x = c.transformTo("uint8array", x) : A === "string" && (S ? x = i.decode(x) : f && k !== !0 && (x = (function(P) {
              return y(P, s.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(x))), x) : d.Promise.reject(new Error("Can't read the data of '" + a + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, o, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), d = e("./zipEntry"), v = e("./support");
        function y(u) {
          this.files = [], this.loadOptions = u;
        }
        y.prototype = { checkSignature: function(u) {
          if (!this.reader.readAndCheckSignature(u)) {
            this.reader.index -= 4;
            var _ = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(_) + ", expected " + i.pretty(u) + ")");
          }
        }, isSignature: function(u, _) {
          var h = this.reader.index;
          this.reader.setIndex(u);
          var m = this.reader.readString(4) === _;
          return this.reader.setIndex(h), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var u = this.reader.readData(this.zipCommentLength), _ = v.uint8array ? "uint8array" : "array", h = i.transformTo(_, u);
          this.zipComment = this.loadOptions.decodeFileName(h);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var u, _, h, m = this.zip64EndOfCentralSize - 44; 0 < m; ) u = this.reader.readInt(2), _ = this.reader.readInt(4), h = this.reader.readData(_), this.zip64ExtensibleData[u] = { id: u, length: _, value: h };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var u, _;
          for (u = 0; u < this.files.length; u++) _ = this.files[u], this.reader.setIndex(_.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), _.readLocalPart(this.reader), _.handleUTF8(), _.processAttributes();
        }, readCentralDir: function() {
          var u;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (u = new d({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(u);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var u = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (u < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(u);
          var _ = u;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (u = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(u), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var h = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (h += 20, h += 12 + this.zip64EndOfCentralSize);
          var m = _ - h;
          if (0 < m) this.isSignature(_, n.CENTRAL_FILE_HEADER) || (this.reader.zero = m);
          else if (m < 0) throw new Error("Corrupted zip: missing " + Math.abs(m) + " bytes.");
        }, prepareReader: function(u) {
          this.reader = s(u);
        }, load: function(u) {
          this.prepareReader(u), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, o.exports = y;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, o, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), d = e("./crc32"), v = e("./utf8"), y = e("./compressions"), u = e("./support");
        function _(h, m) {
          this.options = h, this.loadOptions = m;
        }
        _.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(h) {
          var m, a;
          if (h.skip(22), this.fileNameLength = h.readInt(2), a = h.readInt(2), this.fileName = h.readData(this.fileNameLength), h.skip(a), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((m = (function(p) {
            for (var f in y) if (Object.prototype.hasOwnProperty.call(y, f) && y[f].magic === p) return y[f];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, m, h.readData(this.compressedSize));
        }, readCentralPart: function(h) {
          this.versionMadeBy = h.readInt(2), h.skip(2), this.bitFlag = h.readInt(2), this.compressionMethod = h.readString(2), this.date = h.readDate(), this.crc32 = h.readInt(4), this.compressedSize = h.readInt(4), this.uncompressedSize = h.readInt(4);
          var m = h.readInt(2);
          if (this.extraFieldsLength = h.readInt(2), this.fileCommentLength = h.readInt(2), this.diskNumberStart = h.readInt(2), this.internalFileAttributes = h.readInt(2), this.externalFileAttributes = h.readInt(4), this.localHeaderOffset = h.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          h.skip(m), this.readExtraFields(h), this.parseZIP64ExtraField(h), this.fileComment = h.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var h = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), h == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), h == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var h = s(this.extraFields[1].value);
            this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = h.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = h.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = h.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = h.readInt(4));
          }
        }, readExtraFields: function(h) {
          var m, a, p, f = h.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); h.index + 4 < f; ) m = h.readInt(2), a = h.readInt(2), p = h.readData(a), this.extraFields[m] = { id: m, length: a, value: p };
          h.setIndex(f);
        }, handleUTF8: function() {
          var h = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var m = this.findExtraFieldUnicodePath();
            if (m !== null) this.fileNameStr = m;
            else {
              var a = i.transformTo(h, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(a);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var f = i.transformTo(h, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var h = this.extraFields[28789];
          if (h) {
            var m = s(h.value);
            return m.readInt(1) !== 1 || d(this.fileName) !== m.readInt(4) ? null : v.utf8decode(m.readData(h.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var h = this.extraFields[25461];
          if (h) {
            var m = s(h.value);
            return m.readInt(1) !== 1 || d(this.fileComment) !== m.readInt(4) ? null : v.utf8decode(m.readData(h.length - 5));
          }
          return null;
        } }, o.exports = _;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, o, c) {
        function s(m, a, p) {
          this.name = m, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = a, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), d = e("./utf8"), v = e("./compressedObject"), y = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(m) {
          var a = null, p = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var f = (p = m.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), a = this._decompressWorker();
            var k = !this._dataBinary;
            k && !f && (a = a.pipe(new d.Utf8EncodeWorker())), !k && f && (a = a.pipe(new d.Utf8DecodeWorker()));
          } catch (S) {
            (a = new y("error")).error(S);
          }
          return new i(a, p, "");
        }, async: function(m, a) {
          return this.internalStream(m).accumulate(a);
        }, nodeStream: function(m, a) {
          return this.internalStream(m || "nodebuffer").toNodejsStream(a);
        }, _compressWorker: function(m, a) {
          if (this._data instanceof v && this._data.compression.magic === m.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new d.Utf8EncodeWorker())), v.createWorkerFrom(p, m, a);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof y ? this._data : new n(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], _ = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, h = 0; h < u.length; h++) s.prototype[u[h]] = _;
        o.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, o, c) {
        (function(s) {
          var i, n, d = s.MutationObserver || s.WebKitMutationObserver;
          if (d) {
            var v = 0, y = new d(m), u = s.document.createTextNode("");
            y.observe(u, { characterData: !0 }), i = function() {
              u.data = v = ++v % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) i = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var a = s.document.createElement("script");
            a.onreadystatechange = function() {
              m(), a.onreadystatechange = null, a.parentNode.removeChild(a), a = null;
            }, s.document.documentElement.appendChild(a);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var _ = new s.MessageChannel();
            _.port1.onmessage = m, i = function() {
              _.port2.postMessage(0);
            };
          }
          var h = [];
          function m() {
            var a, p;
            n = !0;
            for (var f = h.length; f; ) {
              for (p = h, h = [], a = -1; ++a < f; ) p[a]();
              f = h.length;
            }
            n = !1;
          }
          o.exports = function(a) {
            h.push(a) !== 1 || n || i();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, o, c) {
        var s = e("immediate");
        function i() {
        }
        var n = {}, d = ["REJECTED"], v = ["FULFILLED"], y = ["PENDING"];
        function u(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = y, this.queue = [], this.outcome = void 0, f !== i && a(this, f);
        }
        function _(f, k, S) {
          this.promise = f, typeof k == "function" && (this.onFulfilled = k, this.callFulfilled = this.otherCallFulfilled), typeof S == "function" && (this.onRejected = S, this.callRejected = this.otherCallRejected);
        }
        function h(f, k, S) {
          s(function() {
            var x;
            try {
              x = k(S);
            } catch (A) {
              return n.reject(f, A);
            }
            x === f ? n.reject(f, new TypeError("Cannot resolve promise with itself")) : n.resolve(f, x);
          });
        }
        function m(f) {
          var k = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof k == "function") return function() {
            k.apply(f, arguments);
          };
        }
        function a(f, k) {
          var S = !1;
          function x(O) {
            S || (S = !0, n.reject(f, O));
          }
          function A(O) {
            S || (S = !0, n.resolve(f, O));
          }
          var P = p(function() {
            k(A, x);
          });
          P.status === "error" && x(P.value);
        }
        function p(f, k) {
          var S = {};
          try {
            S.value = f(k), S.status = "success";
          } catch (x) {
            S.status = "error", S.value = x;
          }
          return S;
        }
        (o.exports = u).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var k = this.constructor;
          return this.then(function(S) {
            return k.resolve(f()).then(function() {
              return S;
            });
          }, function(S) {
            return k.resolve(f()).then(function() {
              throw S;
            });
          });
        }, u.prototype.catch = function(f) {
          return this.then(null, f);
        }, u.prototype.then = function(f, k) {
          if (typeof f != "function" && this.state === v || typeof k != "function" && this.state === d) return this;
          var S = new this.constructor(i);
          return this.state !== y ? h(S, this.state === v ? f : k, this.outcome) : this.queue.push(new _(S, f, k)), S;
        }, _.prototype.callFulfilled = function(f) {
          n.resolve(this.promise, f);
        }, _.prototype.otherCallFulfilled = function(f) {
          h(this.promise, this.onFulfilled, f);
        }, _.prototype.callRejected = function(f) {
          n.reject(this.promise, f);
        }, _.prototype.otherCallRejected = function(f) {
          h(this.promise, this.onRejected, f);
        }, n.resolve = function(f, k) {
          var S = p(m, k);
          if (S.status === "error") return n.reject(f, S.value);
          var x = S.value;
          if (x) a(f, x);
          else {
            f.state = v, f.outcome = k;
            for (var A = -1, P = f.queue.length; ++A < P; ) f.queue[A].callFulfilled(k);
          }
          return f;
        }, n.reject = function(f, k) {
          f.state = d, f.outcome = k;
          for (var S = -1, x = f.queue.length; ++S < x; ) f.queue[S].callRejected(k);
          return f;
        }, u.resolve = function(f) {
          return f instanceof this ? f : n.resolve(new this(i), f);
        }, u.reject = function(f) {
          var k = new this(i);
          return n.reject(k, f);
        }, u.all = function(f) {
          var k = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = f.length, x = !1;
          if (!S) return this.resolve([]);
          for (var A = new Array(S), P = 0, O = -1, L = new this(i); ++O < S; ) T(f[O], O);
          return L;
          function T(j, K) {
            k.resolve(j).then(function(R) {
              A[K] = R, ++P !== S || x || (x = !0, n.resolve(L, A));
            }, function(R) {
              x || (x = !0, n.reject(L, R));
            });
          }
        }, u.race = function(f) {
          var k = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = f.length, x = !1;
          if (!S) return this.resolve([]);
          for (var A = -1, P = new this(i); ++A < S; ) O = f[A], k.resolve(O).then(function(L) {
            x || (x = !0, n.resolve(P, L));
          }, function(L) {
            x || (x = !0, n.reject(P, L));
          });
          var O;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, o, c) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), o.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, o, c) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/messages"), v = e("./zlib/zstream"), y = Object.prototype.toString, u = 0, _ = -1, h = 0, m = 8;
        function a(f) {
          if (!(this instanceof a)) return new a(f);
          this.options = i.assign({ level: _, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: h, to: "" }, f || {});
          var k = this.options;
          k.raw && 0 < k.windowBits ? k.windowBits = -k.windowBits : k.gzip && 0 < k.windowBits && k.windowBits < 16 && (k.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var S = s.deflateInit2(this.strm, k.level, k.method, k.windowBits, k.memLevel, k.strategy);
          if (S !== u) throw new Error(d[S]);
          if (k.header && s.deflateSetHeader(this.strm, k.header), k.dictionary) {
            var x;
            if (x = typeof k.dictionary == "string" ? n.string2buf(k.dictionary) : y.call(k.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(k.dictionary) : k.dictionary, (S = s.deflateSetDictionary(this.strm, x)) !== u) throw new Error(d[S]);
            this._dict_set = !0;
          }
        }
        function p(f, k) {
          var S = new a(k);
          if (S.push(f, !0), S.err) throw S.msg || d[S.err];
          return S.result;
        }
        a.prototype.push = function(f, k) {
          var S, x, A = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          x = k === ~~k ? k : k === !0 ? 4 : 0, typeof f == "string" ? A.input = n.string2buf(f) : y.call(f) === "[object ArrayBuffer]" ? A.input = new Uint8Array(f) : A.input = f, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new i.Buf8(P), A.next_out = 0, A.avail_out = P), (S = s.deflate(A, x)) !== 1 && S !== u) return this.onEnd(S), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(i.shrinkBuf(A.output, A.next_out))) : this.onData(i.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && S !== 1);
          return x === 4 ? (S = s.deflateEnd(this.strm), this.onEnd(S), this.ended = !0, S === u) : x !== 2 || (this.onEnd(u), !(A.avail_out = 0));
        }, a.prototype.onData = function(f) {
          this.chunks.push(f);
        }, a.prototype.onEnd = function(f) {
          f === u && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, c.Deflate = a, c.deflate = p, c.deflateRaw = function(f, k) {
          return (k = k || {}).raw = !0, p(f, k);
        }, c.gzip = function(f, k) {
          return (k = k || {}).gzip = !0, p(f, k);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, o, c) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/constants"), v = e("./zlib/messages"), y = e("./zlib/zstream"), u = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function h(a) {
          if (!(this instanceof h)) return new h(a);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || a && a.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var f = s.inflateInit2(this.strm, p.windowBits);
          if (f !== d.Z_OK) throw new Error(v[f]);
          this.header = new u(), s.inflateGetHeader(this.strm, this.header);
        }
        function m(a, p) {
          var f = new h(p);
          if (f.push(a, !0), f.err) throw f.msg || v[f.err];
          return f.result;
        }
        h.prototype.push = function(a, p) {
          var f, k, S, x, A, P, O = this.strm, L = this.options.chunkSize, T = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          k = p === ~~p ? p : p === !0 ? d.Z_FINISH : d.Z_NO_FLUSH, typeof a == "string" ? O.input = n.binstring2buf(a) : _.call(a) === "[object ArrayBuffer]" ? O.input = new Uint8Array(a) : O.input = a, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new i.Buf8(L), O.next_out = 0, O.avail_out = L), (f = s.inflate(O, d.Z_NO_FLUSH)) === d.Z_NEED_DICT && T && (P = typeof T == "string" ? n.string2buf(T) : _.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, f = s.inflateSetDictionary(this.strm, P)), f === d.Z_BUF_ERROR && j === !0 && (f = d.Z_OK, j = !1), f !== d.Z_STREAM_END && f !== d.Z_OK) return this.onEnd(f), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && f !== d.Z_STREAM_END && (O.avail_in !== 0 || k !== d.Z_FINISH && k !== d.Z_SYNC_FLUSH) || (this.options.to === "string" ? (S = n.utf8border(O.output, O.next_out), x = O.next_out - S, A = n.buf2string(O.output, S), O.next_out = x, O.avail_out = L - x, x && i.arraySet(O.output, O.output, S, x, 0), this.onData(A)) : this.onData(i.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (j = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && f !== d.Z_STREAM_END);
          return f === d.Z_STREAM_END && (k = d.Z_FINISH), k === d.Z_FINISH ? (f = s.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === d.Z_OK) : k !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), !(O.avail_out = 0));
        }, h.prototype.onData = function(a) {
          this.chunks.push(a);
        }, h.prototype.onEnd = function(a) {
          a === d.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, c.Inflate = h, c.inflate = m, c.inflateRaw = function(a, p) {
          return (p = p || {}).raw = !0, m(a, p);
        }, c.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, o, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        c.assign = function(d) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var y = v.shift();
            if (y) {
              if (typeof y != "object") throw new TypeError(y + "must be non-object");
              for (var u in y) y.hasOwnProperty(u) && (d[u] = y[u]);
            }
          }
          return d;
        }, c.shrinkBuf = function(d, v) {
          return d.length === v ? d : d.subarray ? d.subarray(0, v) : (d.length = v, d);
        };
        var i = { arraySet: function(d, v, y, u, _) {
          if (v.subarray && d.subarray) d.set(v.subarray(y, y + u), _);
          else for (var h = 0; h < u; h++) d[_ + h] = v[y + h];
        }, flattenChunks: function(d) {
          var v, y, u, _, h, m;
          for (v = u = 0, y = d.length; v < y; v++) u += d[v].length;
          for (m = new Uint8Array(u), v = _ = 0, y = d.length; v < y; v++) h = d[v], m.set(h, _), _ += h.length;
          return m;
        } }, n = { arraySet: function(d, v, y, u, _) {
          for (var h = 0; h < u; h++) d[_ + h] = v[y + h];
        }, flattenChunks: function(d) {
          return [].concat.apply([], d);
        } };
        c.setTyped = function(d) {
          d ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, i)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, n));
        }, c.setTyped(s);
      }, {}], 42: [function(e, o, c) {
        var s = e("./common"), i = !0, n = !0;
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
        for (var d = new s.Buf8(256), v = 0; v < 256; v++) d[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function y(u, _) {
          if (_ < 65537 && (u.subarray && n || !u.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(u, _));
          for (var h = "", m = 0; m < _; m++) h += String.fromCharCode(u[m]);
          return h;
        }
        d[254] = d[254] = 1, c.string2buf = function(u) {
          var _, h, m, a, p, f = u.length, k = 0;
          for (a = 0; a < f; a++) (64512 & (h = u.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (m = u.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), a++), k += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4;
          for (_ = new s.Buf8(k), a = p = 0; p < k; a++) (64512 & (h = u.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (m = u.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), a++), h < 128 ? _[p++] = h : (h < 2048 ? _[p++] = 192 | h >>> 6 : (h < 65536 ? _[p++] = 224 | h >>> 12 : (_[p++] = 240 | h >>> 18, _[p++] = 128 | h >>> 12 & 63), _[p++] = 128 | h >>> 6 & 63), _[p++] = 128 | 63 & h);
          return _;
        }, c.buf2binstring = function(u) {
          return y(u, u.length);
        }, c.binstring2buf = function(u) {
          for (var _ = new s.Buf8(u.length), h = 0, m = _.length; h < m; h++) _[h] = u.charCodeAt(h);
          return _;
        }, c.buf2string = function(u, _) {
          var h, m, a, p, f = _ || u.length, k = new Array(2 * f);
          for (h = m = 0; h < f; ) if ((a = u[h++]) < 128) k[m++] = a;
          else if (4 < (p = d[a])) k[m++] = 65533, h += p - 1;
          else {
            for (a &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && h < f; ) a = a << 6 | 63 & u[h++], p--;
            1 < p ? k[m++] = 65533 : a < 65536 ? k[m++] = a : (a -= 65536, k[m++] = 55296 | a >> 10 & 1023, k[m++] = 56320 | 1023 & a);
          }
          return y(k, m);
        }, c.utf8border = function(u, _) {
          var h;
          for ((_ = _ || u.length) > u.length && (_ = u.length), h = _ - 1; 0 <= h && (192 & u[h]) == 128; ) h--;
          return h < 0 || h === 0 ? _ : h + d[u[h]] > _ ? h : _;
        };
      }, { "./common": 41 }], 43: [function(e, o, c) {
        o.exports = function(s, i, n, d) {
          for (var v = 65535 & s | 0, y = s >>> 16 & 65535 | 0, u = 0; n !== 0; ) {
            for (n -= u = 2e3 < n ? 2e3 : n; y = y + (v = v + i[d++] | 0) | 0, --u; ) ;
            v %= 65521, y %= 65521;
          }
          return v | y << 16 | 0;
        };
      }, {}], 44: [function(e, o, c) {
        o.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, o, c) {
        var s = (function() {
          for (var i, n = [], d = 0; d < 256; d++) {
            i = d;
            for (var v = 0; v < 8; v++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            n[d] = i;
          }
          return n;
        })();
        o.exports = function(i, n, d, v) {
          var y = s, u = v + d;
          i ^= -1;
          for (var _ = v; _ < u; _++) i = i >>> 8 ^ y[255 & (i ^ n[_])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, o, c) {
        var s, i = e("../utils/common"), n = e("./trees"), d = e("./adler32"), v = e("./crc32"), y = e("./messages"), u = 0, _ = 4, h = 0, m = -2, a = -1, p = 4, f = 2, k = 8, S = 9, x = 286, A = 30, P = 19, O = 2 * x + 1, L = 15, T = 3, j = 258, K = j + T + 1, R = 42, F = 113, l = 1, D = 2, Q = 3, X = 4;
        function et(r, N) {
          return r.msg = y[N], N;
        }
        function C(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function Z(r) {
          for (var N = r.length; 0 <= --N; ) r[N] = 0;
        }
        function M(r) {
          var N = r.state, B = N.pending;
          B > r.avail_out && (B = r.avail_out), B !== 0 && (i.arraySet(r.output, N.pending_buf, N.pending_out, B, r.next_out), r.next_out += B, N.pending_out += B, r.total_out += B, r.avail_out -= B, N.pending -= B, N.pending === 0 && (N.pending_out = 0));
        }
        function E(r, N) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, N), r.block_start = r.strstart, M(r.strm);
        }
        function V(r, N) {
          r.pending_buf[r.pending++] = N;
        }
        function Y(r, N) {
          r.pending_buf[r.pending++] = N >>> 8 & 255, r.pending_buf[r.pending++] = 255 & N;
        }
        function U(r, N) {
          var B, w, b = r.max_chain_length, z = r.strstart, W = r.prev_length, $ = r.nice_match, I = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, G = r.window, H = r.w_mask, q = r.prev, J = r.strstart + j, ct = G[z + W - 1], ot = G[z + W];
          r.prev_length >= r.good_match && (b >>= 2), $ > r.lookahead && ($ = r.lookahead);
          do
            if (G[(B = N) + W] === ot && G[B + W - 1] === ct && G[B] === G[z] && G[++B] === G[z + 1]) {
              z += 2, B++;
              do
                ;
              while (G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && G[++z] === G[++B] && z < J);
              if (w = j - (J - z), z = J - j, W < w) {
                if (r.match_start = N, $ <= (W = w)) break;
                ct = G[z + W - 1], ot = G[z + W];
              }
            }
          while ((N = q[N & H]) > I && --b != 0);
          return W <= r.lookahead ? W : r.lookahead;
        }
        function at(r) {
          var N, B, w, b, z, W, $, I, G, H, q = r.w_size;
          do {
            if (b = r.window_size - r.lookahead - r.strstart, r.strstart >= q + (q - K)) {
              for (i.arraySet(r.window, r.window, q, q, 0), r.match_start -= q, r.strstart -= q, r.block_start -= q, N = B = r.hash_size; w = r.head[--N], r.head[N] = q <= w ? w - q : 0, --B; ) ;
              for (N = B = q; w = r.prev[--N], r.prev[N] = q <= w ? w - q : 0, --B; ) ;
              b += q;
            }
            if (r.strm.avail_in === 0) break;
            if (W = r.strm, $ = r.window, I = r.strstart + r.lookahead, G = b, H = void 0, H = W.avail_in, G < H && (H = G), B = H === 0 ? 0 : (W.avail_in -= H, i.arraySet($, W.input, W.next_in, H, I), W.state.wrap === 1 ? W.adler = d(W.adler, $, H, I) : W.state.wrap === 2 && (W.adler = v(W.adler, $, H, I)), W.next_in += H, W.total_in += H, H), r.lookahead += B, r.lookahead + r.insert >= T) for (z = r.strstart - r.insert, r.ins_h = r.window[z], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[z + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[z + T - 1]) & r.hash_mask, r.prev[z & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = z, z++, r.insert--, !(r.lookahead + r.insert < T)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function lt(r, N) {
          for (var B, w; ; ) {
            if (r.lookahead < K) {
              if (at(r), r.lookahead < K && N === u) return l;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), B !== 0 && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B)), r.match_length >= T) if (w = n._tr_tally(r, r.strstart - r.match_start, r.match_length - T), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= T) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else w = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (w && (E(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === _ ? (E(r, !0), r.strm.avail_out === 0 ? Q : X) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function tt(r, N) {
          for (var B, w, b; ; ) {
            if (r.lookahead < K) {
              if (at(r), r.lookahead < K && N === u) return l;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = T - 1, B !== 0 && r.prev_length < r.max_lazy_match && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B), r.match_length <= 5 && (r.strategy === 1 || r.match_length === T && 4096 < r.strstart - r.match_start) && (r.match_length = T - 1)), r.prev_length >= T && r.match_length <= r.prev_length) {
              for (b = r.strstart + r.lookahead - T, w = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - T), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= b && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = T - 1, r.strstart++, w && (E(r, !1), r.strm.avail_out === 0)) return l;
            } else if (r.match_available) {
              if ((w = n._tr_tally(r, 0, r.window[r.strstart - 1])) && E(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return l;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (w = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === _ ? (E(r, !0), r.strm.avail_out === 0 ? Q : X) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function rt(r, N, B, w, b) {
          this.good_length = r, this.max_lazy = N, this.nice_length = B, this.max_chain = w, this.func = b;
        }
        function nt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = k, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * O), this.dyn_dtree = new i.Buf16(2 * (2 * A + 1)), this.bl_tree = new i.Buf16(2 * (2 * P + 1)), Z(this.dyn_ltree), Z(this.dyn_dtree), Z(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(L + 1), this.heap = new i.Buf16(2 * x + 1), Z(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * x + 1), Z(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function st(r) {
          var N;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = f, (N = r.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? R : F, r.adler = N.wrap === 2 ? 0 : 1, N.last_flush = u, n._tr_init(N), h) : et(r, m);
        }
        function it(r) {
          var N = st(r);
          return N === h && (function(B) {
            B.window_size = 2 * B.w_size, Z(B.head), B.max_lazy_match = s[B.level].max_lazy, B.good_match = s[B.level].good_length, B.nice_match = s[B.level].nice_length, B.max_chain_length = s[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = T - 1, B.match_available = 0, B.ins_h = 0;
          })(r.state), N;
        }
        function ut(r, N, B, w, b, z) {
          if (!r) return m;
          var W = 1;
          if (N === a && (N = 6), w < 0 ? (W = 0, w = -w) : 15 < w && (W = 2, w -= 16), b < 1 || S < b || B !== k || w < 8 || 15 < w || N < 0 || 9 < N || z < 0 || p < z) return et(r, m);
          w === 8 && (w = 9);
          var $ = new nt();
          return (r.state = $).strm = r, $.wrap = W, $.gzhead = null, $.w_bits = w, $.w_size = 1 << $.w_bits, $.w_mask = $.w_size - 1, $.hash_bits = b + 7, $.hash_size = 1 << $.hash_bits, $.hash_mask = $.hash_size - 1, $.hash_shift = ~~(($.hash_bits + T - 1) / T), $.window = new i.Buf8(2 * $.w_size), $.head = new i.Buf16($.hash_size), $.prev = new i.Buf16($.w_size), $.lit_bufsize = 1 << b + 6, $.pending_buf_size = 4 * $.lit_bufsize, $.pending_buf = new i.Buf8($.pending_buf_size), $.d_buf = 1 * $.lit_bufsize, $.l_buf = 3 * $.lit_bufsize, $.level = N, $.strategy = z, $.method = B, it(r);
        }
        s = [new rt(0, 0, 0, 0, function(r, N) {
          var B = 65535;
          for (B > r.pending_buf_size - 5 && (B = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (at(r), r.lookahead === 0 && N === u) return l;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var w = r.block_start + B;
            if ((r.strstart === 0 || r.strstart >= w) && (r.lookahead = r.strstart - w, r.strstart = w, E(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (E(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = 0, N === _ ? (E(r, !0), r.strm.avail_out === 0 ? Q : X) : (r.strstart > r.block_start && (E(r, !1), r.strm.avail_out), l);
        }), new rt(4, 4, 8, 4, lt), new rt(4, 5, 16, 8, lt), new rt(4, 6, 32, 32, lt), new rt(4, 4, 16, 16, tt), new rt(8, 16, 32, 32, tt), new rt(8, 16, 128, 128, tt), new rt(8, 32, 128, 256, tt), new rt(32, 128, 258, 1024, tt), new rt(32, 258, 258, 4096, tt)], c.deflateInit = function(r, N) {
          return ut(r, N, k, 15, 8, 0);
        }, c.deflateInit2 = ut, c.deflateReset = it, c.deflateResetKeep = st, c.deflateSetHeader = function(r, N) {
          return r && r.state ? r.state.wrap !== 2 ? m : (r.state.gzhead = N, h) : m;
        }, c.deflate = function(r, N) {
          var B, w, b, z;
          if (!r || !r.state || 5 < N || N < 0) return r ? et(r, m) : m;
          if (w = r.state, !r.output || !r.input && r.avail_in !== 0 || w.status === 666 && N !== _) return et(r, r.avail_out === 0 ? -5 : m);
          if (w.strm = r, B = w.last_flush, w.last_flush = N, w.status === R) if (w.wrap === 2) r.adler = 0, V(w, 31), V(w, 139), V(w, 8), w.gzhead ? (V(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), V(w, 255 & w.gzhead.time), V(w, w.gzhead.time >> 8 & 255), V(w, w.gzhead.time >> 16 & 255), V(w, w.gzhead.time >> 24 & 255), V(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), V(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (V(w, 255 & w.gzhead.extra.length), V(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (r.adler = v(r.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (V(w, 0), V(w, 0), V(w, 0), V(w, 0), V(w, 0), V(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), V(w, 3), w.status = F);
          else {
            var W = k + (w.w_bits - 8 << 4) << 8;
            W |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (W |= 32), W += 31 - W % 31, w.status = F, Y(w, W), w.strstart !== 0 && (Y(w, r.adler >>> 16), Y(w, 65535 & r.adler)), r.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (b = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), M(r), b = w.pending, w.pending !== w.pending_buf_size)); ) V(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            b = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), M(r), b = w.pending, w.pending === w.pending_buf_size)) {
                z = 1;
                break;
              }
              z = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, V(w, z);
            } while (z !== 0);
            w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), z === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            b = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), M(r), b = w.pending, w.pending === w.pending_buf_size)) {
                z = 1;
                break;
              }
              z = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, V(w, z);
            } while (z !== 0);
            w.gzhead.hcrc && w.pending > b && (r.adler = v(r.adler, w.pending_buf, w.pending - b, b)), z === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && M(r), w.pending + 2 <= w.pending_buf_size && (V(w, 255 & r.adler), V(w, r.adler >> 8 & 255), r.adler = 0, w.status = F)) : w.status = F), w.pending !== 0) {
            if (M(r), r.avail_out === 0) return w.last_flush = -1, h;
          } else if (r.avail_in === 0 && C(N) <= C(B) && N !== _) return et(r, -5);
          if (w.status === 666 && r.avail_in !== 0) return et(r, -5);
          if (r.avail_in !== 0 || w.lookahead !== 0 || N !== u && w.status !== 666) {
            var $ = w.strategy === 2 ? (function(I, G) {
              for (var H; ; ) {
                if (I.lookahead === 0 && (at(I), I.lookahead === 0)) {
                  if (G === u) return l;
                  break;
                }
                if (I.match_length = 0, H = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++, H && (E(I, !1), I.strm.avail_out === 0)) return l;
              }
              return I.insert = 0, G === _ ? (E(I, !0), I.strm.avail_out === 0 ? Q : X) : I.last_lit && (E(I, !1), I.strm.avail_out === 0) ? l : D;
            })(w, N) : w.strategy === 3 ? (function(I, G) {
              for (var H, q, J, ct, ot = I.window; ; ) {
                if (I.lookahead <= j) {
                  if (at(I), I.lookahead <= j && G === u) return l;
                  if (I.lookahead === 0) break;
                }
                if (I.match_length = 0, I.lookahead >= T && 0 < I.strstart && (q = ot[J = I.strstart - 1]) === ot[++J] && q === ot[++J] && q === ot[++J]) {
                  ct = I.strstart + j;
                  do
                    ;
                  while (q === ot[++J] && q === ot[++J] && q === ot[++J] && q === ot[++J] && q === ot[++J] && q === ot[++J] && q === ot[++J] && q === ot[++J] && J < ct);
                  I.match_length = j - (ct - J), I.match_length > I.lookahead && (I.match_length = I.lookahead);
                }
                if (I.match_length >= T ? (H = n._tr_tally(I, 1, I.match_length - T), I.lookahead -= I.match_length, I.strstart += I.match_length, I.match_length = 0) : (H = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++), H && (E(I, !1), I.strm.avail_out === 0)) return l;
              }
              return I.insert = 0, G === _ ? (E(I, !0), I.strm.avail_out === 0 ? Q : X) : I.last_lit && (E(I, !1), I.strm.avail_out === 0) ? l : D;
            })(w, N) : s[w.level].func(w, N);
            if ($ !== Q && $ !== X || (w.status = 666), $ === l || $ === Q) return r.avail_out === 0 && (w.last_flush = -1), h;
            if ($ === D && (N === 1 ? n._tr_align(w) : N !== 5 && (n._tr_stored_block(w, 0, 0, !1), N === 3 && (Z(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), M(r), r.avail_out === 0)) return w.last_flush = -1, h;
          }
          return N !== _ ? h : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (V(w, 255 & r.adler), V(w, r.adler >> 8 & 255), V(w, r.adler >> 16 & 255), V(w, r.adler >> 24 & 255), V(w, 255 & r.total_in), V(w, r.total_in >> 8 & 255), V(w, r.total_in >> 16 & 255), V(w, r.total_in >> 24 & 255)) : (Y(w, r.adler >>> 16), Y(w, 65535 & r.adler)), M(r), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? h : 1);
        }, c.deflateEnd = function(r) {
          var N;
          return r && r.state ? (N = r.state.status) !== R && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== F && N !== 666 ? et(r, m) : (r.state = null, N === F ? et(r, -3) : h) : m;
        }, c.deflateSetDictionary = function(r, N) {
          var B, w, b, z, W, $, I, G, H = N.length;
          if (!r || !r.state || (z = (B = r.state).wrap) === 2 || z === 1 && B.status !== R || B.lookahead) return m;
          for (z === 1 && (r.adler = d(r.adler, N, H, 0)), B.wrap = 0, H >= B.w_size && (z === 0 && (Z(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), G = new i.Buf8(B.w_size), i.arraySet(G, N, H - B.w_size, B.w_size, 0), N = G, H = B.w_size), W = r.avail_in, $ = r.next_in, I = r.input, r.avail_in = H, r.next_in = 0, r.input = N, at(B); B.lookahead >= T; ) {
            for (w = B.strstart, b = B.lookahead - (T - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[w + T - 1]) & B.hash_mask, B.prev[w & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = w, w++, --b; ) ;
            B.strstart = w, B.lookahead = T - 1, at(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = T - 1, B.match_available = 0, r.next_in = $, r.input = I, r.avail_in = W, B.wrap = z, h;
        }, c.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, o, c) {
        o.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, o, c) {
        o.exports = function(s, i) {
          var n, d, v, y, u, _, h, m, a, p, f, k, S, x, A, P, O, L, T, j, K, R, F, l, D;
          n = s.state, d = s.next_in, l = s.input, v = d + (s.avail_in - 5), y = s.next_out, D = s.output, u = y - (i - s.avail_out), _ = y + (s.avail_out - 257), h = n.dmax, m = n.wsize, a = n.whave, p = n.wnext, f = n.window, k = n.hold, S = n.bits, x = n.lencode, A = n.distcode, P = (1 << n.lenbits) - 1, O = (1 << n.distbits) - 1;
          t: do {
            S < 15 && (k += l[d++] << S, S += 8, k += l[d++] << S, S += 8), L = x[k & P];
            e: for (; ; ) {
              if (k >>>= T = L >>> 24, S -= T, (T = L >>> 16 & 255) === 0) D[y++] = 65535 & L;
              else {
                if (!(16 & T)) {
                  if ((64 & T) == 0) {
                    L = x[(65535 & L) + (k & (1 << T) - 1)];
                    continue e;
                  }
                  if (32 & T) {
                    n.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                j = 65535 & L, (T &= 15) && (S < T && (k += l[d++] << S, S += 8), j += k & (1 << T) - 1, k >>>= T, S -= T), S < 15 && (k += l[d++] << S, S += 8, k += l[d++] << S, S += 8), L = A[k & O];
                r: for (; ; ) {
                  if (k >>>= T = L >>> 24, S -= T, !(16 & (T = L >>> 16 & 255))) {
                    if ((64 & T) == 0) {
                      L = A[(65535 & L) + (k & (1 << T) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, S < (T &= 15) && (k += l[d++] << S, (S += 8) < T && (k += l[d++] << S, S += 8)), h < (K += k & (1 << T) - 1)) {
                    s.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (k >>>= T, S -= T, (T = y - u) < K) {
                    if (a < (T = K - T) && n.sane) {
                      s.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (F = f, (R = 0) === p) {
                      if (R += m - T, T < j) {
                        for (j -= T; D[y++] = f[R++], --T; ) ;
                        R = y - K, F = D;
                      }
                    } else if (p < T) {
                      if (R += m + p - T, (T -= p) < j) {
                        for (j -= T; D[y++] = f[R++], --T; ) ;
                        if (R = 0, p < j) {
                          for (j -= T = p; D[y++] = f[R++], --T; ) ;
                          R = y - K, F = D;
                        }
                      }
                    } else if (R += p - T, T < j) {
                      for (j -= T; D[y++] = f[R++], --T; ) ;
                      R = y - K, F = D;
                    }
                    for (; 2 < j; ) D[y++] = F[R++], D[y++] = F[R++], D[y++] = F[R++], j -= 3;
                    j && (D[y++] = F[R++], 1 < j && (D[y++] = F[R++]));
                  } else {
                    for (R = y - K; D[y++] = D[R++], D[y++] = D[R++], D[y++] = D[R++], 2 < (j -= 3); ) ;
                    j && (D[y++] = D[R++], 1 < j && (D[y++] = D[R++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (d < v && y < _);
          d -= j = S >> 3, k &= (1 << (S -= j << 3)) - 1, s.next_in = d, s.next_out = y, s.avail_in = d < v ? v - d + 5 : 5 - (d - v), s.avail_out = y < _ ? _ - y + 257 : 257 - (y - _), n.hold = k, n.bits = S;
        };
      }, {}], 49: [function(e, o, c) {
        var s = e("../utils/common"), i = e("./adler32"), n = e("./crc32"), d = e("./inffast"), v = e("./inftrees"), y = 1, u = 2, _ = 0, h = -2, m = 1, a = 852, p = 592;
        function f(R) {
          return (R >>> 24 & 255) + (R >>> 8 & 65280) + ((65280 & R) << 8) + ((255 & R) << 24);
        }
        function k() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function S(R) {
          var F;
          return R && R.state ? (F = R.state, R.total_in = R.total_out = F.total = 0, R.msg = "", F.wrap && (R.adler = 1 & F.wrap), F.mode = m, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new s.Buf32(a), F.distcode = F.distdyn = new s.Buf32(p), F.sane = 1, F.back = -1, _) : h;
        }
        function x(R) {
          var F;
          return R && R.state ? ((F = R.state).wsize = 0, F.whave = 0, F.wnext = 0, S(R)) : h;
        }
        function A(R, F) {
          var l, D;
          return R && R.state ? (D = R.state, F < 0 ? (l = 0, F = -F) : (l = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? h : (D.window !== null && D.wbits !== F && (D.window = null), D.wrap = l, D.wbits = F, x(R))) : h;
        }
        function P(R, F) {
          var l, D;
          return R ? (D = new k(), (R.state = D).window = null, (l = A(R, F)) !== _ && (R.state = null), l) : h;
        }
        var O, L, T = !0;
        function j(R) {
          if (T) {
            var F;
            for (O = new s.Buf32(512), L = new s.Buf32(32), F = 0; F < 144; ) R.lens[F++] = 8;
            for (; F < 256; ) R.lens[F++] = 9;
            for (; F < 280; ) R.lens[F++] = 7;
            for (; F < 288; ) R.lens[F++] = 8;
            for (v(y, R.lens, 0, 288, O, 0, R.work, { bits: 9 }), F = 0; F < 32; ) R.lens[F++] = 5;
            v(u, R.lens, 0, 32, L, 0, R.work, { bits: 5 }), T = !1;
          }
          R.lencode = O, R.lenbits = 9, R.distcode = L, R.distbits = 5;
        }
        function K(R, F, l, D) {
          var Q, X = R.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new s.Buf8(X.wsize)), D >= X.wsize ? (s.arraySet(X.window, F, l - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (D < (Q = X.wsize - X.wnext) && (Q = D), s.arraySet(X.window, F, l - D, Q, X.wnext), (D -= Q) ? (s.arraySet(X.window, F, l - D, D, 0), X.wnext = D, X.whave = X.wsize) : (X.wnext += Q, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += Q))), 0;
        }
        c.inflateReset = x, c.inflateReset2 = A, c.inflateResetKeep = S, c.inflateInit = function(R) {
          return P(R, 15);
        }, c.inflateInit2 = P, c.inflate = function(R, F) {
          var l, D, Q, X, et, C, Z, M, E, V, Y, U, at, lt, tt, rt, nt, st, it, ut, r, N, B, w, b = 0, z = new s.Buf8(4), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!R || !R.state || !R.output || !R.input && R.avail_in !== 0) return h;
          (l = R.state).mode === 12 && (l.mode = 13), et = R.next_out, Q = R.output, Z = R.avail_out, X = R.next_in, D = R.input, C = R.avail_in, M = l.hold, E = l.bits, V = C, Y = Z, N = _;
          t: for (; ; ) switch (l.mode) {
            case m:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; E < 16; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if (2 & l.wrap && M === 35615) {
                z[l.check = 0] = 255 & M, z[1] = M >>> 8 & 255, l.check = n(l.check, z, 2, 0), E = M = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & M) << 8) + (M >> 8)) % 31) {
                R.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & M) != 8) {
                R.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (E -= 4, r = 8 + (15 & (M >>>= 4)), l.wbits === 0) l.wbits = r;
              else if (r > l.wbits) {
                R.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << r, R.adler = l.check = 1, l.mode = 512 & M ? 10 : 12, E = M = 0;
              break;
            case 2:
              for (; E < 16; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if (l.flags = M, (255 & l.flags) != 8) {
                R.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                R.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = M >> 8 & 1), 512 & l.flags && (z[0] = 255 & M, z[1] = M >>> 8 & 255, l.check = n(l.check, z, 2, 0)), E = M = 0, l.mode = 3;
            case 3:
              for (; E < 32; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              l.head && (l.head.time = M), 512 & l.flags && (z[0] = 255 & M, z[1] = M >>> 8 & 255, z[2] = M >>> 16 & 255, z[3] = M >>> 24 & 255, l.check = n(l.check, z, 4, 0)), E = M = 0, l.mode = 4;
            case 4:
              for (; E < 16; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              l.head && (l.head.xflags = 255 & M, l.head.os = M >> 8), 512 & l.flags && (z[0] = 255 & M, z[1] = M >>> 8 & 255, l.check = n(l.check, z, 2, 0)), E = M = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; E < 16; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                l.length = M, l.head && (l.head.extra_len = M), 512 & l.flags && (z[0] = 255 & M, z[1] = M >>> 8 & 255, l.check = n(l.check, z, 2, 0)), E = M = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (C < (U = l.length) && (U = C), U && (l.head && (r = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, D, X, U, r)), 512 & l.flags && (l.check = n(l.check, D, U, X)), C -= U, X += U, l.length -= U), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (C === 0) break t;
                for (U = 0; r = D[X + U++], l.head && r && l.length < 65536 && (l.head.name += String.fromCharCode(r)), r && U < C; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, U, X)), C -= U, X += U, r) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (C === 0) break t;
                for (U = 0; r = D[X + U++], l.head && r && l.length < 65536 && (l.head.comment += String.fromCharCode(r)), r && U < C; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, U, X)), C -= U, X += U, r) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; E < 16; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                if (M !== (65535 & l.check)) {
                  R.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                E = M = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), R.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; E < 32; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              R.adler = l.check = f(M), E = M = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return R.next_out = et, R.avail_out = Z, R.next_in = X, R.avail_in = C, l.hold = M, l.bits = E, 2;
              R.adler = l.check = 1, l.mode = 12;
            case 12:
              if (F === 5 || F === 6) break t;
            case 13:
              if (l.last) {
                M >>>= 7 & E, E -= 7 & E, l.mode = 27;
                break;
              }
              for (; E < 3; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              switch (l.last = 1 & M, E -= 1, 3 & (M >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (j(l), l.mode = 20, F !== 6) break;
                  M >>>= 2, E -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  R.msg = "invalid block type", l.mode = 30;
              }
              M >>>= 2, E -= 2;
              break;
            case 14:
              for (M >>>= 7 & E, E -= 7 & E; E < 32; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if ((65535 & M) != (M >>> 16 ^ 65535)) {
                R.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & M, E = M = 0, l.mode = 15, F === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (U = l.length) {
                if (C < U && (U = C), Z < U && (U = Z), U === 0) break t;
                s.arraySet(Q, D, X, U, et), C -= U, X += U, Z -= U, et += U, l.length -= U;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; E < 14; ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if (l.nlen = 257 + (31 & M), M >>>= 5, E -= 5, l.ndist = 1 + (31 & M), M >>>= 5, E -= 5, l.ncode = 4 + (15 & M), M >>>= 4, E -= 4, 286 < l.nlen || 30 < l.ndist) {
                R.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; E < 3; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                l.lens[W[l.have++]] = 7 & M, M >>>= 3, E -= 3;
              }
              for (; l.have < 19; ) l.lens[W[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, B = { bits: l.lenbits }, N = v(0, l.lens, 0, 19, l.lencode, 0, l.work, B), l.lenbits = B.bits, N) {
                R.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; rt = (b = l.lencode[M & (1 << l.lenbits) - 1]) >>> 16 & 255, nt = 65535 & b, !((tt = b >>> 24) <= E); ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                if (nt < 16) M >>>= tt, E -= tt, l.lens[l.have++] = nt;
                else {
                  if (nt === 16) {
                    for (w = tt + 2; E < w; ) {
                      if (C === 0) break t;
                      C--, M += D[X++] << E, E += 8;
                    }
                    if (M >>>= tt, E -= tt, l.have === 0) {
                      R.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    r = l.lens[l.have - 1], U = 3 + (3 & M), M >>>= 2, E -= 2;
                  } else if (nt === 17) {
                    for (w = tt + 3; E < w; ) {
                      if (C === 0) break t;
                      C--, M += D[X++] << E, E += 8;
                    }
                    E -= tt, r = 0, U = 3 + (7 & (M >>>= tt)), M >>>= 3, E -= 3;
                  } else {
                    for (w = tt + 7; E < w; ) {
                      if (C === 0) break t;
                      C--, M += D[X++] << E, E += 8;
                    }
                    E -= tt, r = 0, U = 11 + (127 & (M >>>= tt)), M >>>= 7, E -= 7;
                  }
                  if (l.have + U > l.nlen + l.ndist) {
                    R.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; U--; ) l.lens[l.have++] = r;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                R.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, B = { bits: l.lenbits }, N = v(y, l.lens, 0, l.nlen, l.lencode, 0, l.work, B), l.lenbits = B.bits, N) {
                R.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, B = { bits: l.distbits }, N = v(u, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, B), l.distbits = B.bits, N) {
                R.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, F === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= C && 258 <= Z) {
                R.next_out = et, R.avail_out = Z, R.next_in = X, R.avail_in = C, l.hold = M, l.bits = E, d(R, Y), et = R.next_out, Q = R.output, Z = R.avail_out, X = R.next_in, D = R.input, C = R.avail_in, M = l.hold, E = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; rt = (b = l.lencode[M & (1 << l.lenbits) - 1]) >>> 16 & 255, nt = 65535 & b, !((tt = b >>> 24) <= E); ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if (rt && (240 & rt) == 0) {
                for (st = tt, it = rt, ut = nt; rt = (b = l.lencode[ut + ((M & (1 << st + it) - 1) >> st)]) >>> 16 & 255, nt = 65535 & b, !(st + (tt = b >>> 24) <= E); ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                M >>>= st, E -= st, l.back += st;
              }
              if (M >>>= tt, E -= tt, l.back += tt, l.length = nt, rt === 0) {
                l.mode = 26;
                break;
              }
              if (32 & rt) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & rt) {
                R.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & rt, l.mode = 22;
            case 22:
              if (l.extra) {
                for (w = l.extra; E < w; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                l.length += M & (1 << l.extra) - 1, M >>>= l.extra, E -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; rt = (b = l.distcode[M & (1 << l.distbits) - 1]) >>> 16 & 255, nt = 65535 & b, !((tt = b >>> 24) <= E); ) {
                if (C === 0) break t;
                C--, M += D[X++] << E, E += 8;
              }
              if ((240 & rt) == 0) {
                for (st = tt, it = rt, ut = nt; rt = (b = l.distcode[ut + ((M & (1 << st + it) - 1) >> st)]) >>> 16 & 255, nt = 65535 & b, !(st + (tt = b >>> 24) <= E); ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                M >>>= st, E -= st, l.back += st;
              }
              if (M >>>= tt, E -= tt, l.back += tt, 64 & rt) {
                R.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = nt, l.extra = 15 & rt, l.mode = 24;
            case 24:
              if (l.extra) {
                for (w = l.extra; E < w; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                l.offset += M & (1 << l.extra) - 1, M >>>= l.extra, E -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                R.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (Z === 0) break t;
              if (U = Y - Z, l.offset > U) {
                if ((U = l.offset - U) > l.whave && l.sane) {
                  R.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                at = U > l.wnext ? (U -= l.wnext, l.wsize - U) : l.wnext - U, U > l.length && (U = l.length), lt = l.window;
              } else lt = Q, at = et - l.offset, U = l.length;
              for (Z < U && (U = Z), Z -= U, l.length -= U; Q[et++] = lt[at++], --U; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (Z === 0) break t;
              Q[et++] = l.length, Z--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; E < 32; ) {
                  if (C === 0) break t;
                  C--, M |= D[X++] << E, E += 8;
                }
                if (Y -= Z, R.total_out += Y, l.total += Y, Y && (R.adler = l.check = l.flags ? n(l.check, Q, Y, et - Y) : i(l.check, Q, Y, et - Y)), Y = Z, (l.flags ? M : f(M)) !== l.check) {
                  R.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                E = M = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; E < 32; ) {
                  if (C === 0) break t;
                  C--, M += D[X++] << E, E += 8;
                }
                if (M !== (4294967295 & l.total)) {
                  R.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                E = M = 0;
              }
              l.mode = 29;
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
              return h;
          }
          return R.next_out = et, R.avail_out = Z, R.next_in = X, R.avail_in = C, l.hold = M, l.bits = E, (l.wsize || Y !== R.avail_out && l.mode < 30 && (l.mode < 27 || F !== 4)) && K(R, R.output, R.next_out, Y - R.avail_out) ? (l.mode = 31, -4) : (V -= R.avail_in, Y -= R.avail_out, R.total_in += V, R.total_out += Y, l.total += Y, l.wrap && Y && (R.adler = l.check = l.flags ? n(l.check, Q, Y, R.next_out - Y) : i(l.check, Q, Y, R.next_out - Y)), R.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (V == 0 && Y === 0 || F === 4) && N === _ && (N = -5), N);
        }, c.inflateEnd = function(R) {
          if (!R || !R.state) return h;
          var F = R.state;
          return F.window && (F.window = null), R.state = null, _;
        }, c.inflateGetHeader = function(R, F) {
          var l;
          return R && R.state ? (2 & (l = R.state).wrap) == 0 ? h : ((l.head = F).done = !1, _) : h;
        }, c.inflateSetDictionary = function(R, F) {
          var l, D = F.length;
          return R && R.state ? (l = R.state).wrap !== 0 && l.mode !== 11 ? h : l.mode === 11 && i(1, F, D, 0) !== l.check ? -3 : K(R, F, D, D) ? (l.mode = 31, -4) : (l.havedict = 1, _) : h;
        }, c.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, o, c) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], d = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        o.exports = function(y, u, _, h, m, a, p, f) {
          var k, S, x, A, P, O, L, T, j, K = f.bits, R = 0, F = 0, l = 0, D = 0, Q = 0, X = 0, et = 0, C = 0, Z = 0, M = 0, E = null, V = 0, Y = new s.Buf16(16), U = new s.Buf16(16), at = null, lt = 0;
          for (R = 0; R <= 15; R++) Y[R] = 0;
          for (F = 0; F < h; F++) Y[u[_ + F]]++;
          for (Q = K, D = 15; 1 <= D && Y[D] === 0; D--) ;
          if (D < Q && (Q = D), D === 0) return m[a++] = 20971520, m[a++] = 20971520, f.bits = 1, 0;
          for (l = 1; l < D && Y[l] === 0; l++) ;
          for (Q < l && (Q = l), R = C = 1; R <= 15; R++) if (C <<= 1, (C -= Y[R]) < 0) return -1;
          if (0 < C && (y === 0 || D !== 1)) return -1;
          for (U[1] = 0, R = 1; R < 15; R++) U[R + 1] = U[R] + Y[R];
          for (F = 0; F < h; F++) u[_ + F] !== 0 && (p[U[u[_ + F]]++] = F);
          if (O = y === 0 ? (E = at = p, 19) : y === 1 ? (E = i, V -= 257, at = n, lt -= 257, 256) : (E = d, at = v, -1), R = l, P = a, et = F = M = 0, x = -1, A = (Z = 1 << (X = Q)) - 1, y === 1 && 852 < Z || y === 2 && 592 < Z) return 1;
          for (; ; ) {
            for (L = R - et, j = p[F] < O ? (T = 0, p[F]) : p[F] > O ? (T = at[lt + p[F]], E[V + p[F]]) : (T = 96, 0), k = 1 << R - et, l = S = 1 << X; m[P + (M >> et) + (S -= k)] = L << 24 | T << 16 | j | 0, S !== 0; ) ;
            for (k = 1 << R - 1; M & k; ) k >>= 1;
            if (k !== 0 ? (M &= k - 1, M += k) : M = 0, F++, --Y[R] == 0) {
              if (R === D) break;
              R = u[_ + p[F]];
            }
            if (Q < R && (M & A) !== x) {
              for (et === 0 && (et = Q), P += l, C = 1 << (X = R - et); X + et < D && !((C -= Y[X + et]) <= 0); ) X++, C <<= 1;
              if (Z += 1 << X, y === 1 && 852 < Z || y === 2 && 592 < Z) return 1;
              m[x = M & A] = Q << 24 | X << 16 | P - a | 0;
            }
          }
          return M !== 0 && (m[P + M] = R - et << 24 | 64 << 16 | 0), f.bits = Q, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, o, c) {
        o.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, o, c) {
        var s = e("../utils/common"), i = 0, n = 1;
        function d(b) {
          for (var z = b.length; 0 <= --z; ) b[z] = 0;
        }
        var v = 0, y = 29, u = 256, _ = u + 1 + y, h = 30, m = 19, a = 2 * _ + 1, p = 15, f = 16, k = 7, S = 256, x = 16, A = 17, P = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (_ + 2));
        d(K);
        var R = new Array(2 * h);
        d(R);
        var F = new Array(512);
        d(F);
        var l = new Array(256);
        d(l);
        var D = new Array(y);
        d(D);
        var Q, X, et, C = new Array(h);
        function Z(b, z, W, $, I) {
          this.static_tree = b, this.extra_bits = z, this.extra_base = W, this.elems = $, this.max_length = I, this.has_stree = b && b.length;
        }
        function M(b, z) {
          this.dyn_tree = b, this.max_code = 0, this.stat_desc = z;
        }
        function E(b) {
          return b < 256 ? F[b] : F[256 + (b >>> 7)];
        }
        function V(b, z) {
          b.pending_buf[b.pending++] = 255 & z, b.pending_buf[b.pending++] = z >>> 8 & 255;
        }
        function Y(b, z, W) {
          b.bi_valid > f - W ? (b.bi_buf |= z << b.bi_valid & 65535, V(b, b.bi_buf), b.bi_buf = z >> f - b.bi_valid, b.bi_valid += W - f) : (b.bi_buf |= z << b.bi_valid & 65535, b.bi_valid += W);
        }
        function U(b, z, W) {
          Y(b, W[2 * z], W[2 * z + 1]);
        }
        function at(b, z) {
          for (var W = 0; W |= 1 & b, b >>>= 1, W <<= 1, 0 < --z; ) ;
          return W >>> 1;
        }
        function lt(b, z, W) {
          var $, I, G = new Array(p + 1), H = 0;
          for ($ = 1; $ <= p; $++) G[$] = H = H + W[$ - 1] << 1;
          for (I = 0; I <= z; I++) {
            var q = b[2 * I + 1];
            q !== 0 && (b[2 * I] = at(G[q]++, q));
          }
        }
        function tt(b) {
          var z;
          for (z = 0; z < _; z++) b.dyn_ltree[2 * z] = 0;
          for (z = 0; z < h; z++) b.dyn_dtree[2 * z] = 0;
          for (z = 0; z < m; z++) b.bl_tree[2 * z] = 0;
          b.dyn_ltree[2 * S] = 1, b.opt_len = b.static_len = 0, b.last_lit = b.matches = 0;
        }
        function rt(b) {
          8 < b.bi_valid ? V(b, b.bi_buf) : 0 < b.bi_valid && (b.pending_buf[b.pending++] = b.bi_buf), b.bi_buf = 0, b.bi_valid = 0;
        }
        function nt(b, z, W, $) {
          var I = 2 * z, G = 2 * W;
          return b[I] < b[G] || b[I] === b[G] && $[z] <= $[W];
        }
        function st(b, z, W) {
          for (var $ = b.heap[W], I = W << 1; I <= b.heap_len && (I < b.heap_len && nt(z, b.heap[I + 1], b.heap[I], b.depth) && I++, !nt(z, $, b.heap[I], b.depth)); ) b.heap[W] = b.heap[I], W = I, I <<= 1;
          b.heap[W] = $;
        }
        function it(b, z, W) {
          var $, I, G, H, q = 0;
          if (b.last_lit !== 0) for (; $ = b.pending_buf[b.d_buf + 2 * q] << 8 | b.pending_buf[b.d_buf + 2 * q + 1], I = b.pending_buf[b.l_buf + q], q++, $ === 0 ? U(b, I, z) : (U(b, (G = l[I]) + u + 1, z), (H = O[G]) !== 0 && Y(b, I -= D[G], H), U(b, G = E(--$), W), (H = L[G]) !== 0 && Y(b, $ -= C[G], H)), q < b.last_lit; ) ;
          U(b, S, z);
        }
        function ut(b, z) {
          var W, $, I, G = z.dyn_tree, H = z.stat_desc.static_tree, q = z.stat_desc.has_stree, J = z.stat_desc.elems, ct = -1;
          for (b.heap_len = 0, b.heap_max = a, W = 0; W < J; W++) G[2 * W] !== 0 ? (b.heap[++b.heap_len] = ct = W, b.depth[W] = 0) : G[2 * W + 1] = 0;
          for (; b.heap_len < 2; ) G[2 * (I = b.heap[++b.heap_len] = ct < 2 ? ++ct : 0)] = 1, b.depth[I] = 0, b.opt_len--, q && (b.static_len -= H[2 * I + 1]);
          for (z.max_code = ct, W = b.heap_len >> 1; 1 <= W; W--) st(b, G, W);
          for (I = J; W = b.heap[1], b.heap[1] = b.heap[b.heap_len--], st(b, G, 1), $ = b.heap[1], b.heap[--b.heap_max] = W, b.heap[--b.heap_max] = $, G[2 * I] = G[2 * W] + G[2 * $], b.depth[I] = (b.depth[W] >= b.depth[$] ? b.depth[W] : b.depth[$]) + 1, G[2 * W + 1] = G[2 * $ + 1] = I, b.heap[1] = I++, st(b, G, 1), 2 <= b.heap_len; ) ;
          b.heap[--b.heap_max] = b.heap[1], (function(ot, mt) {
            var At, yt, Et, dt, Tt, Ft, _t = mt.dyn_tree, Wt = mt.max_code, ae = mt.stat_desc.static_tree, oe = mt.stat_desc.has_stree, le = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, zt = mt.stat_desc.max_length, Ot = 0;
            for (dt = 0; dt <= p; dt++) ot.bl_count[dt] = 0;
            for (_t[2 * ot.heap[ot.heap_max] + 1] = 0, At = ot.heap_max + 1; At < a; At++) zt < (dt = _t[2 * _t[2 * (yt = ot.heap[At]) + 1] + 1] + 1) && (dt = zt, Ot++), _t[2 * yt + 1] = dt, Wt < yt || (ot.bl_count[dt]++, Tt = 0, jt <= yt && (Tt = le[yt - jt]), Ft = _t[2 * yt], ot.opt_len += Ft * (dt + Tt), oe && (ot.static_len += Ft * (ae[2 * yt + 1] + Tt)));
            if (Ot !== 0) {
              do {
                for (dt = zt - 1; ot.bl_count[dt] === 0; ) dt--;
                ot.bl_count[dt]--, ot.bl_count[dt + 1] += 2, ot.bl_count[zt]--, Ot -= 2;
              } while (0 < Ot);
              for (dt = zt; dt !== 0; dt--) for (yt = ot.bl_count[dt]; yt !== 0; ) Wt < (Et = ot.heap[--At]) || (_t[2 * Et + 1] !== dt && (ot.opt_len += (dt - _t[2 * Et + 1]) * _t[2 * Et], _t[2 * Et + 1] = dt), yt--);
            }
          })(b, z), lt(G, ct, b.bl_count);
        }
        function r(b, z, W) {
          var $, I, G = -1, H = z[1], q = 0, J = 7, ct = 4;
          for (H === 0 && (J = 138, ct = 3), z[2 * (W + 1) + 1] = 65535, $ = 0; $ <= W; $++) I = H, H = z[2 * ($ + 1) + 1], ++q < J && I === H || (q < ct ? b.bl_tree[2 * I] += q : I !== 0 ? (I !== G && b.bl_tree[2 * I]++, b.bl_tree[2 * x]++) : q <= 10 ? b.bl_tree[2 * A]++ : b.bl_tree[2 * P]++, G = I, ct = (q = 0) === H ? (J = 138, 3) : I === H ? (J = 6, 3) : (J = 7, 4));
        }
        function N(b, z, W) {
          var $, I, G = -1, H = z[1], q = 0, J = 7, ct = 4;
          for (H === 0 && (J = 138, ct = 3), $ = 0; $ <= W; $++) if (I = H, H = z[2 * ($ + 1) + 1], !(++q < J && I === H)) {
            if (q < ct) for (; U(b, I, b.bl_tree), --q != 0; ) ;
            else I !== 0 ? (I !== G && (U(b, I, b.bl_tree), q--), U(b, x, b.bl_tree), Y(b, q - 3, 2)) : q <= 10 ? (U(b, A, b.bl_tree), Y(b, q - 3, 3)) : (U(b, P, b.bl_tree), Y(b, q - 11, 7));
            G = I, ct = (q = 0) === H ? (J = 138, 3) : I === H ? (J = 6, 3) : (J = 7, 4);
          }
        }
        d(C);
        var B = !1;
        function w(b, z, W, $) {
          Y(b, (v << 1) + ($ ? 1 : 0), 3), (function(I, G, H, q) {
            rt(I), V(I, H), V(I, ~H), s.arraySet(I.pending_buf, I.window, G, H, I.pending), I.pending += H;
          })(b, z, W);
        }
        c._tr_init = function(b) {
          B || ((function() {
            var z, W, $, I, G, H = new Array(p + 1);
            for (I = $ = 0; I < y - 1; I++) for (D[I] = $, z = 0; z < 1 << O[I]; z++) l[$++] = I;
            for (l[$ - 1] = I, I = G = 0; I < 16; I++) for (C[I] = G, z = 0; z < 1 << L[I]; z++) F[G++] = I;
            for (G >>= 7; I < h; I++) for (C[I] = G << 7, z = 0; z < 1 << L[I] - 7; z++) F[256 + G++] = I;
            for (W = 0; W <= p; W++) H[W] = 0;
            for (z = 0; z <= 143; ) K[2 * z + 1] = 8, z++, H[8]++;
            for (; z <= 255; ) K[2 * z + 1] = 9, z++, H[9]++;
            for (; z <= 279; ) K[2 * z + 1] = 7, z++, H[7]++;
            for (; z <= 287; ) K[2 * z + 1] = 8, z++, H[8]++;
            for (lt(K, _ + 1, H), z = 0; z < h; z++) R[2 * z + 1] = 5, R[2 * z] = at(z, 5);
            Q = new Z(K, O, u + 1, _, p), X = new Z(R, L, 0, h, p), et = new Z(new Array(0), T, 0, m, k);
          })(), B = !0), b.l_desc = new M(b.dyn_ltree, Q), b.d_desc = new M(b.dyn_dtree, X), b.bl_desc = new M(b.bl_tree, et), b.bi_buf = 0, b.bi_valid = 0, tt(b);
        }, c._tr_stored_block = w, c._tr_flush_block = function(b, z, W, $) {
          var I, G, H = 0;
          0 < b.level ? (b.strm.data_type === 2 && (b.strm.data_type = (function(q) {
            var J, ct = 4093624447;
            for (J = 0; J <= 31; J++, ct >>>= 1) if (1 & ct && q.dyn_ltree[2 * J] !== 0) return i;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return n;
            for (J = 32; J < u; J++) if (q.dyn_ltree[2 * J] !== 0) return n;
            return i;
          })(b)), ut(b, b.l_desc), ut(b, b.d_desc), H = (function(q) {
            var J;
            for (r(q, q.dyn_ltree, q.l_desc.max_code), r(q, q.dyn_dtree, q.d_desc.max_code), ut(q, q.bl_desc), J = m - 1; 3 <= J && q.bl_tree[2 * j[J] + 1] === 0; J--) ;
            return q.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          })(b), I = b.opt_len + 3 + 7 >>> 3, (G = b.static_len + 3 + 7 >>> 3) <= I && (I = G)) : I = G = W + 5, W + 4 <= I && z !== -1 ? w(b, z, W, $) : b.strategy === 4 || G === I ? (Y(b, 2 + ($ ? 1 : 0), 3), it(b, K, R)) : (Y(b, 4 + ($ ? 1 : 0), 3), (function(q, J, ct, ot) {
            var mt;
            for (Y(q, J - 257, 5), Y(q, ct - 1, 5), Y(q, ot - 4, 4), mt = 0; mt < ot; mt++) Y(q, q.bl_tree[2 * j[mt] + 1], 3);
            N(q, q.dyn_ltree, J - 1), N(q, q.dyn_dtree, ct - 1);
          })(b, b.l_desc.max_code + 1, b.d_desc.max_code + 1, H + 1), it(b, b.dyn_ltree, b.dyn_dtree)), tt(b), $ && rt(b);
        }, c._tr_tally = function(b, z, W) {
          return b.pending_buf[b.d_buf + 2 * b.last_lit] = z >>> 8 & 255, b.pending_buf[b.d_buf + 2 * b.last_lit + 1] = 255 & z, b.pending_buf[b.l_buf + b.last_lit] = 255 & W, b.last_lit++, z === 0 ? b.dyn_ltree[2 * W]++ : (b.matches++, z--, b.dyn_ltree[2 * (l[W] + u + 1)]++, b.dyn_dtree[2 * E(z)]++), b.last_lit === b.lit_bufsize - 1;
        }, c._tr_align = function(b) {
          Y(b, 2, 3), U(b, S, K), (function(z) {
            z.bi_valid === 16 ? (V(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(b);
        };
      }, { "../utils/common": 41 }], 53: [function(e, o, c) {
        o.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, o, c) {
        (function(s) {
          (function(i, n) {
            if (!i.setImmediate) {
              var d, v, y, u, _ = 1, h = {}, m = !1, a = i.document, p = Object.getPrototypeOf && Object.getPrototypeOf(i);
              p = p && p.setTimeout ? p : i, d = {}.toString.call(i.process) === "[object process]" ? function(x) {
                process.nextTick(function() {
                  k(x);
                });
              } : (function() {
                if (i.postMessage && !i.importScripts) {
                  var x = !0, A = i.onmessage;
                  return i.onmessage = function() {
                    x = !1;
                  }, i.postMessage("", "*"), i.onmessage = A, x;
                }
              })() ? (u = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", S, !1) : i.attachEvent("onmessage", S), function(x) {
                i.postMessage(u + x, "*");
              }) : i.MessageChannel ? ((y = new MessageChannel()).port1.onmessage = function(x) {
                k(x.data);
              }, function(x) {
                y.port2.postMessage(x);
              }) : a && "onreadystatechange" in a.createElement("script") ? (v = a.documentElement, function(x) {
                var A = a.createElement("script");
                A.onreadystatechange = function() {
                  k(x), A.onreadystatechange = null, v.removeChild(A), A = null;
                }, v.appendChild(A);
              }) : function(x) {
                setTimeout(k, 0, x);
              }, p.setImmediate = function(x) {
                typeof x != "function" && (x = new Function("" + x));
                for (var A = new Array(arguments.length - 1), P = 0; P < A.length; P++) A[P] = arguments[P + 1];
                var O = { callback: x, args: A };
                return h[_] = O, d(_), _++;
              }, p.clearImmediate = f;
            }
            function f(x) {
              delete h[x];
            }
            function k(x) {
              if (m) setTimeout(k, 0, x);
              else {
                var A = h[x];
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
                    f(x), m = !1;
                  }
                }
              }
            }
            function S(x) {
              x.source === i && typeof x.data == "string" && x.data.indexOf(u) === 0 && k(+x.data.slice(u.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var de = he();
const Jt = /* @__PURE__ */ ce(de);
async function ue(g) {
  const t = await fe(g), e = await Jt.loadAsync(t), o = [];
  return e.forEach((c, s) => {
    if (s.dir)
      return;
    const i = me(c);
    o.push({
      name: i,
      text: () => s.async("text"),
      arrayBuffer: () => s.async("arraybuffer")
    });
  }), o;
}
async function fe(g) {
  if (g instanceof ArrayBuffer)
    return g;
  if (g instanceof Blob)
    return await g.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function me(g) {
  let t = g.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function pe(g) {
  return !!g && typeof g == "object" && !(g instanceof ArrayBuffer) && !(g instanceof Uint8Array);
}
function ge(g) {
  return g instanceof Uint8Array ? g : new Uint8Array(g);
}
function ye(g) {
  return g.byteOffset === 0 && g.byteLength === g.buffer.byteLength ? g.buffer : g.slice().buffer;
}
function xt(g, t, e = 0) {
  if (g.length < e + t.length) return !1;
  for (let o = 0; o < t.length; o++)
    if (g[e + o] !== t[o]) return !1;
  return !0;
}
function _e(g) {
  return xt(g, [80, 75, 3, 4]) || xt(g, [80, 75, 5, 6]) || xt(g, [80, 75, 7, 8]) ? "zip" : xt(g, [82, 97, 114, 33, 26, 7, 0]) || xt(g, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : xt(g, [55, 122, 188, 175, 39, 28]) ? "7z" : g.length > 262 && xt(g, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Qt(g) {
  return g.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function $t(g) {
  const t = [], e = g.map((a) => Qt(a).toLowerCase()), o = (a) => e.some(a), c = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((a) => c.test(a)).length, n = e.filter((a) => s.test(a) || a.includes("drill")).length, d = o((a) => a.includes("top") && a.includes("copper") || a.endsWith(".gtl")), v = o((a) => a.includes("bot") || a.includes("bottom") || a.endsWith(".gbl")), y = o((a) => a.includes("mask") || a.includes("solder") || a.endsWith(".gts") || a.endsWith(".gbs")), u = o((a) => a.includes("silk") || a.includes("legend") || a.endsWith(".gto") || a.endsWith(".gbo")), _ = o((a) => a.includes("outline") || a.includes("profile") || a.includes("edge") || a.endsWith(".gko") || a.endsWith(".gm1") || a.endsWith(".gml")), h = e.every(
    (a) => a.endsWith(".pdf") || a.endsWith(".png") || a.endsWith(".jpg") || a.endsWith(".jpeg") || a.endsWith(".svg") || a.endsWith(".txt") || a.endsWith(".md")
  );
  let m = 0;
  return g.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : h ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (m += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (m += 0.2, t.push(`Found ${n} drill-like file(s).`)), _ && (m += 0.15, t.push("Found outline/profile/edge candidate.")), d && v ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (d || v) && (m += 0.1, t.push("Found at least one copper candidate.")), y && (m += 0.05, t.push("Found solder mask candidate.")), u && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && i >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function be(g) {
  if (pe(g)) {
    const s = Object.keys(g).map(Qt), { confidence: i, reasons: n } = $t(s);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: n,
      files: s
    };
  }
  const t = ge(g), e = _e(t);
  if (e === "zip")
    try {
      const s = ye(t), n = (await ue(s)).map((y) => y.name), { confidence: d, reasons: v } = $t(n);
      return {
        isGerber: d >= 0.6,
        archiveType: "zip",
        confidence: d,
        reasons: v,
        files: n
      };
    } catch (s) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(s)]
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
  const o = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return o.includes("%FSLAX") || o.includes("%MOIN") || o.includes("%MOMM") || o.includes("G04") || o.includes("%ADD") ? {
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
  constructor(t, e, o) {
    super(e), this.name = "GerberError", this.code = t, this.details = o;
  }
}
function te(g) {
  let t = g.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ve(g) {
  return g instanceof Uint8Array ? g : new Uint8Array(g);
}
function ee(g) {
  try {
    return g.slice().buffer;
  } catch {
    const t = new Uint8Array(g.byteLength);
    return t.set(g), t.buffer;
  }
}
async function we(g) {
  let t;
  try {
    t = await Jt.loadAsync(ee(g));
  } catch (n) {
    throw new ft(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      n
    );
  }
  const e = {}, o = 1e3, c = 100 * 1024 * 1024, s = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (s.length > o)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${s.length} > ${o})`
    );
  let i = 0;
  for (const [n, d] of s)
    try {
      const v = te(n), y = await d.async("arraybuffer");
      if (i += y.byteLength, i > c)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${c} bytes)`
        );
      e[v] = new Uint8Array(y);
    } catch (v) {
      console.warn(`Failed to extract file ${n}:`, v);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function ke(g, t) {
  let e;
  try {
    const u = await import("./libarchive-Bt1VdZR0.js");
    e = u.Archive ?? u.default?.Archive;
  } catch (u) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      u
    );
  }
  if (!e)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (u) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        u
      );
    }
  let o;
  try {
    const u = new Blob([ee(g)], { type: "application/octet-stream" });
    o = await e.open(u);
  } catch (u) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", u);
  }
  let c;
  try {
    c = await Promise.race([
      o.extractFiles(),
      new Promise(
        (u, _) => setTimeout(() => _(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (u) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", u);
  }
  const s = {};
  let i = 0;
  const n = 1e3, d = 100 * 1024 * 1024;
  let v = 0;
  async function y(u, _) {
    if (i >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const h of Object.keys(u)) {
      const m = u[h], a = _ ? `${_}/${h}` : h;
      if (m instanceof File || m instanceof Blob) {
        i++;
        try {
          const p = await m.arrayBuffer();
          if (v += p.byteLength, v > d)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${d} bytes)`
            );
          s[te(a)] = new Uint8Array(p);
        } catch (p) {
          console.warn(`Failed to extract file ${a}:`, p);
        }
      } else m && typeof m == "object" && await y(m, a);
    }
  }
  try {
    await y(c, "");
  } finally {
    if (o && typeof o.close == "function")
      try {
        await o.close();
      } catch (u) {
        console.warn("Failed to close archive:", u);
      }
  }
  if (Object.keys(s).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return s;
}
async function re(g, t) {
  if (!g || g.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = ve(g), o = 100 * 1024 * 1024;
  if (e.length > o)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${o} bytes)`
    );
  let c;
  try {
    c = await be(e);
  } catch (s) {
    throw new ft("PARSE_ERROR", "Failed to detect archive type", s);
  }
  if (!c.isGerber)
    throw new ft(
      "NOT_GERBER",
      c.reasons.join("; ") || "Not a Gerber bundle",
      c
    );
  try {
    if (c.archiveType === "zip")
      return { archiveType: "zip", files: await we(e) };
    if (c.archiveType === "rar")
      return { archiveType: "rar", files: await ke(e, t) };
    throw new ft(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${c.archiveType}`,
      c
    );
  } catch (s) {
    throw s instanceof ft ? s : new ft(
      "PARSE_ERROR",
      s instanceof Error ? s.message : "Unknown error during extraction",
      { error: s, det: c }
    );
  }
}
function Lt(g) {
  return g.toLowerCase();
}
function vt(g, t) {
  const e = new Set(t.map((c) => c.toLowerCase()));
  return g.filter((c) => {
    const s = Lt(c), i = s.lastIndexOf(".");
    return i < 0 ? !1 : e.has(s.slice(i));
  }).sort((c, s) => c.length - s.length)[0];
}
function ht(g, t) {
  const e = t.map((c) => c.toLowerCase());
  return g.filter((c) => {
    const s = Lt(c);
    return e.every((i) => s.includes(i));
  }).sort((c, s) => c.length - s.length)[0];
}
function xe(g) {
  const t = g.filter((y) => {
    const u = Lt(y);
    return !(u.endsWith("/") || u.includes("__macosx") || u.endsWith(".ds_store"));
  }), e = vt(t, [".gtl"]) || ht(t, ["f_cu"]) || ht(t, ["top", "cu"]) || ht(t, ["top", "copper"]), o = vt(t, [".gbl"]) || ht(t, ["b_cu"]) || ht(t, ["bottom", "cu"]) || ht(t, ["bottom", "copper"]), c = vt(t, [".gts"]) || ht(t, ["f_mask"]) || ht(t, ["top", "mask"]), s = vt(t, [".gbs"]) || ht(t, ["b_mask"]) || ht(t, ["bottom", "mask"]), i = vt(t, [".gto"]) || ht(t, ["f_silks"]) || ht(t, ["f_silk"]) || ht(t, ["top", "silk"]), n = vt(t, [".gbo"]) || ht(t, ["b_silks"]) || ht(t, ["b_silk"]) || ht(t, ["bottom", "silk"]), d = vt(t, [".gko", ".gm1"]) || ht(t, ["edge", "cuts"]) || ht(t, ["outline"]) || ht(t, ["board", "outline"]), v = (
    // Excellon often .drl or .xln or .txt
    vt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    ht(t, ["drill"]) || ht(t, ["drills"]) || ht(t, ["npth"]) || ht(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: o,
    top_mask: c,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: n,
    outline: d,
    drills: v
  };
}
const Se = 0.8;
function Mt(g, t, e) {
  const o = {
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
  }, c = t.split(/\r?\n/);
  for (const s of c) {
    let i = s.trim();
    if (i && !i.startsWith("G04")) {
      if (i.startsWith("%") && i.endsWith("%")) {
        Re(i, o);
        continue;
      }
      i.endsWith("*") && (i = i.slice(0, -1)), Ae(i, o);
    }
  }
  if (o.inRegion) {
    if (o.currentPath.length >= 3 && o.regionPaths.push(o.currentPath), o.regionPaths.length > 0) {
      const s = {
        loops: o.regionPaths,
        polarity: o.currentPolarity
      };
      o.regions.push(s), o.ops.push({
        kind: "region",
        polarity: o.currentPolarity,
        loops: o.regionPaths
      });
    }
    o.inRegion = !1, o.regionPaths = [], o.currentPath = [];
  }
  return {
    tracks: o.tracks,
    arcs: o.arcs,
    flashes: o.flashes,
    regions: o.regions,
    ops: o.ops
  };
}
function Re(g, t) {
  let e = g;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const o = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (o) {
      const c = parseInt(o[1], 10), s = parseInt(o[2], 10);
      parseInt(o[4], 10), t.fmtInt = c, t.fmtDec = s;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const o = t.unitScale;
    let c = o;
    if (e.includes("MOMM") ? c = 1 : e.includes("MOIN") && (c = 25.4), c !== o) {
      const s = c / o;
      for (const i of t.apertures.values())
        i.diameterMm !== void 0 && (i.diameterMm *= s), i.widthMm !== void 0 && (i.widthMm *= s), i.heightMm !== void 0 && (i.heightMm *= s);
      t.unitScale = c;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const o = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(e);
    if (!o) return;
    const c = parseInt(o[2], 10), s = o[3], i = o[4] ?? "";
    let n, d, v;
    if (i) {
      const u = i.split(/[Xx]/), _ = u[0] ? parseFloat(u[0]) * t.unitScale : void 0, h = u[1] ? parseFloat(u[1]) * t.unitScale : void 0;
      s === "C" ? n = _ : s === "R" || s === "O" ? (d = _, v = h, _ !== void 0 && h !== void 0 ? n = Math.min(_, h) : n = _ ?? h) : n = _ ?? h;
    }
    const y = {
      code: c,
      shape: s,
      diameterMm: n,
      widthMm: d,
      heightMm: v
    };
    t.apertures.set(c, y);
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
function Ae(g, t) {
  if (g === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (g === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const y = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(y), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let e = null;
  const o = /D0?(\d{1,3})$/.exec(g);
  if (o && (e = parseInt(o[1], 10), g = g.slice(0, g.length - o[0].length)), e !== null && e >= 10) {
    const y = t.apertures.get(e);
    y && (t.currentAperture = y);
    return;
  }
  const c = /X([+\-]?\d+)/.exec(g), s = /Y([+\-]?\d+)/.exec(g);
  let i = t.x, n = t.y;
  if (c && (i = Yt(c[1], t)), s && (n = Yt(s[1], t)), e === null) {
    t.x = i, t.y = n;
    return;
  }
  if (t.inRegion) {
    const y = t.x, u = t.y;
    e === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: y, y: u }), t.currentPath.push({ x: i, y: n })) : e === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = i, t.y = n;
    return;
  }
  const d = t.x, v = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = i, t.y = n;
      return;
    }
    const y = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: d, y: v },
      end: { x: i, y: n },
      width: y,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: d, y: v },
      end: { x: i, y: n },
      widthMm: y
    }), t.x = i, t.y = n;
    return;
  }
  if (e === 2) {
    t.x = i, t.y = n;
    return;
  }
  if (e === 3) {
    if (t.currentAperture) {
      const y = t.currentAperture, u = y.diameterMm !== void 0 ? y.diameterMm : Se, _ = {
        position: { x: i, y: n },
        diameterMm: u,
        shape: y.shape,
        polarity: t.currentPolarity
      };
      y.widthMm !== void 0 && (_.widthMm = y.widthMm), y.heightMm !== void 0 && (_.heightMm = y.heightMm), t.flashes.push(_), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: i, y: n },
        diameterMm: u,
        shape: y.shape,
        widthMm: y.widthMm,
        heightMm: y.heightMm
      });
    }
    t.x = i, t.y = n;
    return;
  }
}
function Yt(g, t) {
  const e = g.startsWith("-") ? -1 : 1, o = g.replace(/[+\-]/g, ""), c = parseInt(o, 10);
  if (Number.isNaN(c)) return 0;
  const s = Math.pow(10, t.fmtDec), i = c / s * t.unitScale;
  return e * i;
}
function Ee(g, t) {
  const e = t.split(/\r?\n/), o = /* @__PURE__ */ new Map();
  let c = null;
  const s = [];
  for (const i of e) {
    const n = i.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const d = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (d) {
          const v = d[1], y = parseFloat(d[2]);
          Number.isNaN(y) || o.set(v, y);
        }
        continue;
      }
      if (n.startsWith("T") && !n.includes("C")) {
        const d = /^T(\d+)/i.exec(n);
        d && (c = d[1]);
        continue;
      }
      if (n[0] === "X" || n.includes("X")) {
        const d = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(n);
        if (!d)
          continue;
        const v = d[1], y = d[2], u = parseFloat(v), _ = parseFloat(y);
        if (Number.isNaN(u) || Number.isNaN(_))
          continue;
        const h = c && o.has(c) ? o.get(c) : 0.6;
        s.push({
          x: u,
          y: _,
          diameter: h,
          plated: !0
          // default, later you can infer from file or layer
        });
        continue;
      }
    }
  }
  return {
    name: g,
    holes: s
  };
}
function ze(g) {
  return { w: g.maxX - g.minX, h: g.maxY - g.minY };
}
function Ct(g) {
  const { w: t, h: e } = ze(g);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function St(g, t) {
  if (!Number.isFinite(g) || !Number.isFinite(t) || g <= 0 || t <= 0) return 1;
  const e = g / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function It(g, t) {
  return t === 1 ? g : {
    ...g,
    tracks: g.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: g.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: g.regions.map((e) => ({
      ...e,
      loops: e.loops.map((o) => o.map((c) => ({ x: c.x * t, y: c.y * t })))
    }))
  };
}
function Me(g, t) {
  return t === 1 ? g : g.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Ce(g) {
  return URL.createObjectURL(new Blob([g], { type: "image/svg+xml" }));
}
function pt(g, t, e) {
  g.minX = Math.min(g.minX, t), g.minY = Math.min(g.minY, e), g.maxX = Math.max(g.maxX, t), g.maxY = Math.max(g.maxY, e);
}
function Ut() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function wt(g) {
  const t = Ut();
  for (const e of g.tracks) {
    pt(t, e.start.x, e.start.y), pt(t, e.end.x, e.end.y);
    const o = (e.width ?? 0) / 2;
    pt(t, e.start.x - o, e.start.y - o), pt(t, e.start.x + o, e.start.y + o), pt(t, e.end.x - o, e.end.y - o), pt(t, e.end.x + o, e.end.y + o);
  }
  for (const e of g.flashes) {
    const o = (e.widthMm ?? e.diameterMm) || 0, c = (e.heightMm ?? e.diameterMm) || 0;
    pt(t, e.position.x - o / 2, e.position.y - c / 2), pt(t, e.position.x + o / 2, e.position.y + c / 2);
  }
  for (const e of g.regions)
    for (const o of e.loops) for (const c of o) pt(t, c.x, c.y);
  return t;
}
function Ie(g) {
  const t = Ut();
  for (const e of g) {
    const o = (e.diameter || 0) / 2;
    pt(t, e.x - o, e.y - o), pt(t, e.x + o, e.y + o);
  }
  return t;
}
function Zt(g, t) {
  return {
    minX: Math.min(g.minX, t.minX),
    minY: Math.min(g.minY, t.minY),
    maxX: Math.max(g.maxX, t.maxX),
    maxY: Math.max(g.maxY, t.maxY)
  };
}
function bt(g) {
  return !Number.isFinite(g.minX) || !Number.isFinite(g.minY) || !Number.isFinite(g.maxX) || !Number.isFinite(g.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (g.maxX - g.minX < 1e-6 && (g.maxX = g.minX + 1), g.maxY - g.minY < 1e-6 && (g.maxY = g.minY + 1), g);
}
const Te = 1e3;
function gt(g) {
  return g / 25.4 * Te;
}
function Rt(g, t, e) {
  const o = g - e.minX, c = e.maxY - t;
  return { x: o, y: c };
}
function Gt(g, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${t}" viewBox="0 0 ${g} ${t}">
  <rect width="${g}" height="${t}" fill="white"/>
</svg>`.trim();
}
function ie(g) {
  let t = 1 / 0, e = 1 / 0, o = -1 / 0, c = -1 / 0;
  for (const s of g.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), o = Math.max(o, i.x), c = Math.max(c, i.y);
  return { minX: t, minY: e, maxX: o, maxY: c };
}
function Oe(g, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let o = 0, c = 0;
  for (const y of g.regions) {
    const u = ie(y), _ = (u.maxX - u.minX) * (u.maxY - u.minY);
    y.polarity === "clear" ? c = Math.max(c, _) : o = Math.max(o, _);
  }
  const s = g.tracks.filter((y) => y.polarity !== "clear").length + g.flashes.filter((y) => y.polarity !== "clear").length + g.regions.filter((y) => y.polarity !== "clear").length, i = g.tracks.filter((y) => y.polarity === "clear").length + g.flashes.filter((y) => y.polarity === "clear").length + g.regions.filter((y) => y.polarity === "clear").length, n = o > e * 0.7, d = i > s * 3, v = c > e * 0.7;
  return n ? !1 : d || v;
}
function Vt(g, t, e, o) {
  const c = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(gt(c))), n = Math.max(1, Math.round(gt(s))), d = gt(1), v = Oe(g, t), y = v ? "white" : "black", u = (x, A) => {
    const P = x - t.minX, O = t.maxY - A;
    return { x: P * d, y: O * d };
  }, _ = (x, A) => {
    if (x.kind === "track") {
      const P = u(x.start.x, x.start.y), O = u(x.end.x, x.end.y), L = Number.isFinite(x.widthMm) ? x.widthMm : 0.2, T = Math.max(1, L * d);
      return `<line x1="${P.x.toFixed(2)}" y1="${P.y.toFixed(2)}" x2="${O.x.toFixed(2)}" y2="${O.y.toFixed(2)}" stroke-width="${T.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (x.kind === "flash") {
      const P = u(x.position.x, x.position.y), O = x.widthMm ?? x.diameterMm ?? 0.8, L = x.heightMm ?? x.diameterMm ?? 0.8, T = Math.max(0.01, Number.isFinite(O) ? O : 0.8) * d, j = Math.max(0.01, Number.isFinite(L) ? L : 0.8) * d;
      if (x.shape === "R" || x.shape === "O") {
        const K = P.x - T / 2, R = P.y - j / 2, F = x.shape === "O" ? Math.min(T, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${R.toFixed(2)}" width="${T.toFixed(2)}" height="${j.toFixed(2)}" rx="${F.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const K = Math.max(1, Math.max(T, j) / 2);
        return `<circle cx="${P.x.toFixed(2)}" cy="${P.y.toFixed(2)}" r="${K.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (x.kind === "region") {
      const P = x.loops.map((O) => {
        if (!O.length) return "";
        const L = u(O[0].x, O[0].y), T = [`M ${L.x.toFixed(2)} ${L.y.toFixed(2)}`];
        for (let j = 1; j < O.length; j++) {
          const K = u(O[j].x, O[j].y);
          T.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return T.push("Z"), T.join(" ");
      }).join(" ");
      return P.trim() ? `<path d="${P}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, h = [];
  h.push(`<rect x="0" y="0" width="${i}" height="${n}" fill="${y}" fill-opacity="1" />`);
  for (const x of g.ops) {
    const A = x.polarity === "clear" ? "black" : "white", P = _(x, A);
    P && h.push(P);
  }
  console.log("[polarity counts]", {
    tracksClear: g.tracks.filter((x) => x.polarity === "clear").length,
    regionsClear: g.regions.filter((x) => x.polarity === "clear").length,
    negativePlane: v
  });
  const m = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, p = 0;
  for (const x of g.regions) {
    const A = ie(x), P = (A.maxX - A.minX) * (A.maxY - A.minY);
    x.polarity === "clear" ? p = Math.max(p, P) : a = Math.max(a, P);
  }
  const f = g.tracks.filter((x) => x.polarity !== "clear").length + g.flashes.filter((x) => x.polarity !== "clear").length + g.regions.filter((x) => x.polarity !== "clear").length, k = g.tracks.filter((x) => x.polarity === "clear").length + g.flashes.filter((x) => x.polarity === "clear").length + g.regions.filter((x) => x.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: k,
    largestDarkRegionArea: a,
    largestClearRegionArea: p,
    boardArea: m,
    negative: v
  });
  const S = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  <defs>
    <mask id="${S}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${n}" fill="${y}" fill-opacity="1" />
      ${h.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${n}" fill="${e}" opacity="${o}" mask="url(#${S})" />
</svg>`.trim();
}
function qt(g, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.max(1, Math.round(gt(e))), s = Math.max(1, Math.round(gt(o))), i = Math.max(1e-6, gt(1)), n = "rgba(255,255,255,0.95)", d = "rgba(255,255,255,0.95)", v = g.tracks.map((_) => {
    const h = Rt(_.start.x, _.start.y, t), m = Rt(_.end.x, _.end.y, t), a = Number.isFinite(_.width) ? _.width : 0.15, p = Math.max(1, a * i);
    return `<line x1="${(h.x * i).toFixed(2)}" y1="${(h.y * i).toFixed(2)}" x2="${(m.x * i).toFixed(2)}" y2="${(m.y * i).toFixed(2)}" stroke="${n}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), y = g.flashes.map((_) => {
    const h = Rt(_.position.x, _.position.y, t), m = h.x * i, a = h.y * i, p = _.widthMm ?? _.diameterMm ?? 0.6, f = _.heightMm ?? _.diameterMm ?? 0.6;
    if (_.shape === "R" || _.shape === "O") {
      const S = p * i, x = f * i, A = m - S / 2, P = a - x / 2, O = _.shape === "O" ? Math.min(S, x) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${P.toFixed(2)}" width="${S.toFixed(2)}" height="${x.toFixed(2)}" rx="${O.toFixed(2)}" fill="${d}" />`;
    }
    const k = (_.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${a.toFixed(2)}" r="${Math.max(1, k).toFixed(2)}" fill="${d}" />`;
  }), u = g.regions.map((_) => {
    const h = _.loops.map((m) => {
      if (!m.length) return "";
      const a = Rt(m[0].x, m[0].y, t), p = [`M ${(a.x * i).toFixed(2)} ${(a.y * i).toFixed(2)}`];
      for (let f = 1; f < m.length; f++) {
        const k = Rt(m[f].x, m[f].y, t);
        p.push(`L ${(k.x * i).toFixed(2)} ${(k.y * i).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return h.trim() ? `<path d="${h}" fill="${d}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${s}" viewBox="0 0 ${c} ${s}">
  ${v.join(`
  `)}
  ${y.join(`
  `)}
  ${u.join(`
  `)}
</svg>`.trim();
}
function Be(g, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.round(gt(e)), s = Math.round(gt(o)), i = gt(1), n = g.map((d) => {
    const v = Rt(d.x, d.y, t), y = v.x * i, u = v.y * i, _ = (d.diameter || 0.6) * i / 2;
    return `<circle cx="${y.toFixed(2)}" cy="${u.toFixed(2)}" r="${Math.max(1, _).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${s}" viewBox="0 0 ${c} ${s}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ne(g) {
  const t = Object.keys(g).filter((it) => !!it), e = xe(t), o = new TextDecoder("utf-8", { fatal: !1 }), c = async (it) => {
    if (!it) return null;
    const ut = g[it];
    return ut ? o.decode(ut) : null;
  }, s = await c(e.top_copper), i = await c(e.bottom_copper), n = await c(e.outline), d = await c(e.drills), v = await c(e.top_silk), y = await c(e.bottom_silk), u = s ? Mt(e.top_copper || "top", s) : null, _ = i ? Mt(e.bottom_copper || "bot", i) : null, h = n ? Mt(e.outline || "outline", n) : null, m = d ? Ee(e.drills || "drills", d) : null, a = m ? m.holes.map((it) => ({ x: it.x, y: it.y, diameter: it.diameter })) : [], p = v ? Mt(e.top_silk || "top_silk", v) : null, f = y ? Mt(e.bottom_silk || "bot_silk", y) : null, k = u ? bt(wt(u)) : null, S = _ ? bt(wt(_)) : null, x = h ? bt(wt(h)) : null, A = a.length ? bt(Ie(a)) : null, P = p ? bt(wt(p)) : null, O = f ? bt(wt(f)) : null, L = (x && Ct(x) ? x : null) || (k && Ct(k) ? k : null) || (S && Ct(S) ? S : null) || (A && Ct(A) ? A : null), T = L ? L.maxX - L.minX : 1, j = k ? St(k.maxX - k.minX, T) : 1, K = S ? St(S.maxX - S.minX, T) : 1, R = x ? St(x.maxX - x.minX, T) : 1, F = A ? St(A.maxX - A.minX, T) : 1, l = P ? St(P.maxX - P.minX, T) : 1, D = O ? St(O.maxX - O.minX, T) : 1, Q = u ? It(u, j) : null, X = _ ? It(_, K) : null, et = h ? It(h, R) : null, C = a.length ? Me(a, F) : [], Z = p ? It(p, l) : null, M = f ? It(f, D) : null;
  let E = null;
  if (et) {
    const it = bt(wt(et));
    Ct(it) && (E = it);
  }
  if (!E) {
    let it = Ut();
    Q && (it = Zt(it, wt(Q))), X && (it = Zt(it, wt(X))), it = bt(it), E = it;
  }
  const V = bt(E), Y = V.maxX - V.minX, U = V.maxY - V.minY, at = {
    board: {
      width_in: Y / 25.4,
      height_in: U / 25.4,
      mm_bounds: {
        min_x_mm: V.minX,
        min_y_mm: V.minY,
        max_x_mm: V.maxX,
        max_y_mm: V.maxY
      }
    }
  }, lt = Math.max(1, Math.round(gt(Y))), tt = Math.max(1, Math.round(gt(U))), rt = [], nt = (it) => {
    const ut = Ce(it);
    return rt.push(ut), ut;
  }, st = {
    top_board_mask: nt(Gt(lt, tt)),
    bottom_board_mask: nt(Gt(lt, tt))
  };
  return Q && (st.top_copper = nt(Vt(Q, V, "#fbbf24", 1))), X && (st.bottom_copper = nt(Vt(X, V, "#38bdf8", 1))), C.length && (st.drills = nt(Be(C, V))), Z && (st.top_silk = nt(qt(Z, V))), M && (st.bottom_silk = nt(qt(M, V))), {
    boardGeom: at,
    layers: st,
    revoke: () => rt.forEach((it) => URL.revokeObjectURL(it))
  };
}
async function Qe(g) {
  const t = g instanceof Uint8Array ? g.byteOffset === 0 && g.byteLength === g.buffer.byteLength ? g.buffer : g.slice().buffer : g instanceof ArrayBuffer ? g : await g.arrayBuffer(), { files: e, archiveType: o } = await re(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (o !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${o}`);
  return await ne(e);
}
async function tr(g, t) {
  const { files: e } = await re(g, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ne(e);
}
function Dt(g, t) {
  const [
    e,
    o,
    c,
    s,
    i,
    n,
    d,
    v,
    y
  ] = g, [
    u,
    _,
    h,
    m,
    a,
    p,
    f,
    k,
    S
  ] = t;
  return [
    e * u + o * m + c * f,
    e * _ + o * a + c * k,
    e * h + o * p + c * S,
    s * u + i * m + n * f,
    s * _ + i * a + n * k,
    s * h + i * p + n * S,
    d * u + v * m + y * f,
    d * _ + v * a + y * k,
    d * h + v * p + y * S
  ];
}
function Ht(g, t) {
  return [1, 0, g, 0, 1, t, 0, 0, 1];
}
function Pe(g, t) {
  return [g, 0, 0, 0, t, 0, 0, 0, 1];
}
function Fe(g) {
  const t = Math.cos(g), e = Math.sin(g);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function Kt(g, t) {
  const e = g[0] * t.x + g[1] * t.y + g[2], o = g[3] * t.x + g[4] * t.y + g[5], c = g[6] * t.x + g[7] * t.y + g[8];
  if (c === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / c, y: o / c };
}
function Ne(g) {
  const t = g[0], e = g[1], o = g[2], c = g[3], s = g[4], i = g[5], n = t * s - e * c;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const d = 1 / n, v = s * d, y = -e * d, u = -c * d, _ = t * d, h = -(v * o + y * i), m = -(u * o + _ * i);
  return [v, y, h, u, _, m, 0, 0, 1];
}
class De {
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
      return Kt(this.worldToScreenMat, e);
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
      return Kt(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: o, zoom: c, rotation_rad: s, mirrorX: i, mirrorY: n } = this.camera, d = { x: t / 2, y: e / 2 }, v = n ? -1 : 1, y = i ? -1 : 1, u = Ht(-o.x, -o.y), _ = Fe(s), h = Pe(c * y, c * v), m = Ht(d.x, d.y), a = Dt(m, Dt(h, Dt(_, u)));
    this.worldToScreenMat = a, this.screenToWorldMat = Ne(a);
  }
}
class Le {
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
let Ue = class {
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
    const o = this.overlays.get(t);
    o && o.visible !== e && (o.visible = e);
  }
  setZIndex(t, e) {
    const o = this.overlays.get(t);
    o && o.zIndex !== e && (o.zIndex = e, this.dirty = !0);
  }
  list() {
    return Array.from(this.overlays.values());
  }
  getSortedVisible() {
    return this.dirty && (this.sortedCache = Array.from(this.overlays.values()).sort((t, e) => t.zIndex - e.zIndex), this.dirty = !1), this.sortedCache.filter((t) => t.visible);
  }
};
class We {
  constructor(t) {
    this.cells = /* @__PURE__ */ new Map(), this.cellSize_mm = t;
  }
  cellCoord(t, e) {
    const o = Math.floor(t / this.cellSize_mm), c = Math.floor(e / this.cellSize_mm);
    return { cx: o, cy: c, key: `${o},${c}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, o) {
    const { key: c } = this.cellCoord(e, o);
    let s = this.cells.get(c);
    s || (s = /* @__PURE__ */ new Set(), this.cells.set(c, s)), s.add(t);
  }
  remove(t, e, o) {
    const { key: c } = this.cellCoord(e, o), s = this.cells.get(c);
    s && (s.delete(t), s.size === 0 && this.cells.delete(c));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, o) {
    const { cx: c, cy: s } = this.cellCoord(t, e), i = Math.ceil(o / this.cellSize_mm), n = [];
    for (let d = -i; d <= i; d++)
      for (let v = -i; v <= i; v++) {
        const y = `${c + d},${s + v}`, u = this.cells.get(y);
        if (u)
          for (const _ of u) n.push(_);
      }
    return n;
  }
}
class je {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new We(5), this.dirtyList = !0, this.listCache = [];
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
      const o = this.byId.get(e.id);
      if (!o) continue;
      const c = { ...o, ...e };
      (c.x_mm !== o.x_mm || c.y_mm !== o.y_mm) && (this.index.remove(o.id, o.x_mm, o.y_mm), this.index.insert(o.id, c.x_mm, c.y_mm)), this.byId.set(o.id, c), this.dirtyList = !0;
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
  queryNear(t, e, o) {
    const c = this.index.queryRadius(t, e, o), s = [];
    for (const i of c) {
      const n = this.byId.get(i);
      n && s.push(n);
    }
    return s;
  }
}
class Xe {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, o, c = 10) {
    const s = t.screenToBoard({ x: e, y: o }), i = t.xform.getCamera().zoom, n = c / i, d = this.store.queryNear(s.x, s.y, n);
    let v = null;
    for (const y of d) {
      const u = t.boardToScreen({ x: y.x_mm, y: y.y_mm }), _ = u.x - e, h = u.y - o, m = Math.sqrt(_ * _ + h * h);
      m <= c && (!v || m < v.distance_px) && (v = { id: y.id, marker: y, distance_px: m });
    }
    return v;
  }
}
class $e {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    let o = this.handlers.get(t);
    return o || (o = /* @__PURE__ */ new Set(), this.handlers.set(t, o)), o.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const o = this.on(t, (c) => {
      o(), e(c);
    });
    return o;
  }
  off(t, e) {
    const o = this.handlers.get(t);
    o && (o.delete(e), o.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const o = this.handlers.get(t);
    if (!o || o.size === 0) return;
    const c = Array.from(o);
    for (const s of c) s(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class se {
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
class Ye {
  constructor(t, e) {
    this.passes = [], this.overlays = new Ue(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new je(), this.markerPicker = new Xe(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new $e(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const o = t.getContext("2d");
    if (!o) throw new Error("Unable to get 2D context");
    this.ctx = o;
    const c = t.getBoundingClientRect(), s = {
      width_px: c.width,
      height_px: c.height
    };
    this.xform = new De(e, s), this.visibility = new se(), this.scheduler = new Le(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: n }) => {
        const d = this.xform.boardToScreen({ x: i, y: n });
        return { x_px: d.x, y_px: d.y };
      },
      screenToBoard: ({ x_px: i, y_px: n }) => {
        const d = this.xform.screenToBoard({ x: i, y: n });
        return { x_mm: d.x, y_mm: d.y };
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
    this.passes.push(t), this.passes.sort((e, o) => e.order - o.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((o) => o.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, o = e.getBoundingClientRect(), c = { width_px: o.width, height_px: o.height };
    this.xform.setViewport(c);
    const s = {
      canvas: e,
      ctx: t,
      viewport: c,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      // Use visibility manager
      boardToScreen: (n) => this.xform.boardToScreen({ x: n.x, y: n.y }),
      screenToBoard: (n) => this.xform.screenToBoard({ x: n.x, y: n.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height);
    const i = window.devicePixelRatio || 1;
    t.scale(i, i), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width / i, e.height / i);
    for (const n of this.passes)
      if (n.enabled(s)) {
        t.save();
        try {
          n.draw(s);
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
  pickMarker(t, e, o = 10) {
    const c = this.createRenderCtx();
    return this.markerPicker.pick(c, t, e, o);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const o = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: o }), e?.center;
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
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), c = this.createRenderCtx(), s = this.markerPicker.pick(c, e, o, 10);
    this.setHoverMarker(s?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), c = this.createRenderCtx(), s = this.markerPicker.pick(c, e, o, 10);
    if (s) {
      this.selectMarker(s.id);
      return;
    }
    const i = c.screenToBoard({ x: e, y: o });
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
function rr(g, t, e, o) {
  return {
    id: `gerber:${g}`,
    order: t,
    enabled: (c) => c.visibility.gerber[e],
    draw: (c) => {
      const s = c.ctx, i = c.xform.getWorldToScreenMatrix();
      s.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), o(s);
    }
  };
}
class Ze {
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
    const o = this.overlays.get(t);
    o && (o.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Ge(g, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const c = g.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
      c.sort((i, n) => i.zIndex - n.zIndex);
      const s = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const i of c)
        e.ctx.save(), i.draw(e.ctx, s), e.ctx.restore();
    }
  };
}
let Ve = class {
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
    const e = t.ctx, o = t.xform.getCamera().zoom;
    if (!(o < 2)) {
      e.setTransform(1, 0, 0, 1, 0, 0);
      for (const s of this.markers.values()) {
        const i = t.boardToScreen(s.position);
        i.x < -10 || i.x > t.viewport.width_px + 10 || i.y < -10 || i.y > t.viewport.height_px + 10 || this.drawMarker(e, i, s, o);
      }
    }
  }
  drawMarker(t, e, o, c) {
    const s = Math.max(3, Math.min(8, c / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, s, 0, Math.PI * 2), o.type) {
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
function qe(g) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => g.draw(t)
  };
}
class He {
  draw(t, e) {
    if (!e) return;
    const o = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(o, t, e.id);
        break;
      case "geometry":
        this.drawGeometrySelection(o, t, e.id);
        break;
      case "region":
        this.drawRegionSelection(o, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, o) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, e, o) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, e, o) {
    if (!o) return;
    const c = e.xform.getWorldToScreenMatrix();
    t.setTransform(c[0], c[3], c[1], c[4], c[2], c[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      o.min.x,
      o.min.y,
      o.max.x - o.min.x,
      o.max.y - o.min.y
    );
  }
}
function Ke(g, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const o = t();
      o && g.draw(e, o);
    }
  };
}
function nr(g, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  g.innerHTML = `
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
              ${e}
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
  const o = g.firstElementChild, c = D(o, "#board-viewport"), s = D(o, "#render-canvas"), i = D(o, "#grid-toggle"), n = D(o, "#grid-units"), d = D(o, "#fit-btn"), v = D(o, "#download-btn"), y = Array.from(o.querySelectorAll('input[name="side"]')), u = new Ye(s, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), _ = new se();
  _.subscribe(() => {
    u.requestRender("visibility-change");
  });
  const h = new Ze(), m = new Ve(), a = new He();
  let p = null;
  function f() {
    const C = c.getBoundingClientRect(), Z = window.devicePixelRatio || 1;
    s.width = C.width * Z, s.height = C.height * Z, s.style.width = `${C.width}px`, s.style.height = `${C.height}px`, u.requestRender("resize");
  }
  const k = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (C, Z) => {
      const E = Z.view.zoom, V = n.value, Y = V === "mm" ? 1 : 2.54, U = V === "mm" ? 10 : 25.4, at = Y * E, lt = U * E;
      if (at < 2) return;
      const tt = s.width / (window.devicePixelRatio || 1), rt = s.height / (window.devicePixelRatio || 1), nt = Z.screenToBoard({ x: 0, y: 0 }), st = Z.screenToBoard({ x: tt, y: rt });
      C.setTransform(1, 0, 0, 1, 0, 0), C.strokeStyle = "rgba(59, 130, 246, 0.4)", C.lineWidth = 1, C.beginPath();
      const it = Math.floor(nt.x / Y) * Y, ut = Math.floor(nt.y / Y) * Y;
      for (let r = it; r <= st.x; r += Y) {
        const N = Z.boardToScreen({ x: r, y: 0 }).x;
        C.moveTo(N, 0), C.lineTo(N, s.height);
      }
      for (let r = ut; r <= st.y; r += Y) {
        const N = Z.boardToScreen({ x: 0, y: r }).y;
        C.moveTo(0, N), C.lineTo(s.width, N);
      }
      if (C.stroke(), lt >= 8) {
        C.strokeStyle = "rgba(59, 130, 246, 0.7)", C.lineWidth = 1.5, C.beginPath();
        const r = Math.floor(nt.x / U) * U, N = Math.floor(nt.y / U) * U;
        for (let B = r; B <= st.x; B += U) {
          const w = Z.boardToScreen({ x: B, y: 0 }).x;
          C.moveTo(w, 0), C.lineTo(w, s.height);
        }
        for (let B = N; B <= st.y; B += U) {
          const w = Z.boardToScreen({ x: 0, y: B }).y;
          C.moveTo(0, w), C.lineTo(s.width, w);
        }
        C.stroke();
      }
    }
  };
  h.add(k), _.setOverlayVisibility("grid", !1), _.setMarkersVisibility(!1), u.addPass(Ge(h, u.getOverlayApi())), u.addPass(qe(m)), u.addPass(Ke(a, () => p));
  let S = null, x = {}, A = "top", P = !1;
  function O(C, Z, M) {
    if (!M) return null;
    const E = new Image();
    return E.src = M, E.addEventListener("load", () => {
      u.requestRender(`image-loaded-${C}`);
    }), {
      id: C,
      order: Z,
      enabled: () => !0,
      draw: (V) => {
        if (!E.complete) return;
        const Y = V.ctx, U = V.xform.getWorldToScreenMatrix();
        Y.setTransform(U[0], U[3], U[1], U[4], U[2], U[5]);
        const at = 25.4, lt = (S?.board?.width_in || 1) * at, tt = (S?.board?.height_in || 1) * at;
        Y.drawImage(E, 0, 0, lt, tt);
      }
    };
  }
  function L(C, Z) {
    return {
      id: C,
      order: Z,
      enabled: () => !0,
      draw: (M) => {
        if (!S?.board) return;
        const E = M.ctx, V = M.xform.getWorldToScreenMatrix();
        E.setTransform(V[0], V[3], V[1], V[4], V[2], V[5]);
        const Y = (S.board.width_in || 1) * 25.4, U = (S.board.height_in || 1) * 25.4;
        E.fillStyle = "#1a5f1a", E.fillRect(0, 0, Y, U), E.strokeStyle = "#0d3d0d", E.lineWidth = 0.1, E.strokeRect(0, 0, Y, U);
      }
    };
  }
  function T() {
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
    ].forEach((M) => {
      u.removePass(M);
    }), !S) return;
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
    ].forEach((M) => {
      let E;
      M.useFR4 ? E = L(M.id, M.order) : M.url && (E = O(M.id, M.order, M.url)), E && u.addPass(E);
    }), u.requestRender("side-switch"), setTimeout(() => u.requestRender("side-switch-delayed"), 50);
  }
  function j(C = 0.08) {
    if (!S?.board) return;
    const Z = c.getBoundingClientRect(), M = S.board.width_in || 1, E = S.board.height_in || 1, V = Z.width * (1 - 2 * C), Y = Z.height * (1 - 2 * C), U = M * 25.4, at = E * 25.4, lt = V / U, tt = Y / at, rt = Math.min(lt, tt), nt = U / 2, st = at / 2;
    u.setCamera({
      center_mm: { x: nt, y: st },
      zoom: rt
    });
  }
  s.addEventListener("wheel", (C) => {
    C.preventDefault(), P = !0;
    const Z = s.getBoundingClientRect(), M = C.clientX - Z.left, E = C.clientY - Z.top, V = u.getCamera(), Y = C.deltaY < 0 ? 1.1 : 0.9, U = Math.max(0.2, Math.min(50, V.zoom * Y)), at = u.screenToBoard(M, E);
    u.setCamera({ zoom: U });
    const lt = u.screenToBoard(M, E), tt = at.x - lt.x, rt = at.y - lt.y, nt = {
      x: V.center_mm.x + tt,
      y: V.center_mm.y + rt
    };
    u.setCamera({
      center_mm: nt,
      zoom: U
    });
  }, { passive: !1 });
  let K = !1, R = null;
  s.addEventListener("mousedown", (C) => {
    if (C.button !== 0) return;
    C.preventDefault(), P = !0, K = !0;
    const Z = s.getBoundingClientRect();
    R = u.screenToBoard(
      C.clientX - Z.left,
      C.clientY - Z.top
    );
  });
  const F = (C) => {
    if (!K || !R) return;
    const Z = s.getBoundingClientRect(), M = u.screenToBoard(
      C.clientX - Z.left,
      C.clientY - Z.top
    ), E = R.x - M.x, V = R.y - M.y, Y = u.getCamera();
    u.setCamera({
      center_mm: {
        x: Y.center_mm.x + E,
        y: Y.center_mm.y + V
      }
    });
  }, l = () => {
    K = !1, R = null;
  };
  window.addEventListener("mousemove", F), window.addEventListener("mouseup", l), i.addEventListener("change", () => {
    const C = i.checked;
    _.setOverlayVisibility("grid", C), k.visible = C, u.requestRender("grid-toggle");
  }), n.addEventListener("change", () => {
    _.isOverlayVisible("grid") && u.requestRender("grid-units");
  }), d.addEventListener("click", () => j(0.08)), v.addEventListener("click", () => t.onDownload?.()), y.forEach((C) => {
    C.addEventListener("change", () => {
      A = y.find((Z) => Z.checked)?.value || "top", T();
    });
  }), window.addEventListener("resize", () => {
    f(), P || j(0.08);
  });
  function D(C, Z) {
    const M = C.querySelector(Z);
    if (!M) throw new Error(`Missing required element: ${Z}`);
    return M;
  }
  function Q(C) {
    if (S = C.boardGeom, x = C.layers, S?.board) {
      const Z = (S.board.width_in || 1) * 25.4, M = (S.board.height_in || 1) * 25.4;
      u.setBoardBounds({ minX_mm: 0, minY_mm: 0, maxX_mm: Z, maxY_mm: M });
    }
    T(), f(), j(0.08);
  }
  function X(C) {
    A = C;
    const Z = y.find((M) => M.value === C);
    Z && (Z.checked = !0), T();
  }
  function et() {
    window.removeEventListener("mousemove", F), window.removeEventListener("mouseup", l), g.innerHTML = "";
  }
  return f(), {
    setData: Q,
    setSideMode: X,
    fit: () => j(0.08),
    dispose: et,
    // Expose new render pipeline API
    viewer: u,
    visibility: _,
    overlayRegistry: h,
    markerRenderer: m,
    setSelection: (C) => {
      p = C, u.requestRender("selection-change");
    },
    addMarker: (C) => {
      m.add(C), u.requestRender("marker-added");
    },
    removeMarker: (C) => {
      m.remove(C), u.requestRender("marker-removed");
    }
  };
}
function sr(g, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const o = e.xform.getWorldToScreenMatrix(), c = g.getSortedVisible();
      for (const s of c)
        e.ctx.save(), s.drawInWorldSpace ? e.ctx.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), s.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function ar() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (g, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      g.fillStyle = "red";
      for (const o of e)
        g.beginPath(), g.arc(o.x_mm, o.y_mm, 0.25, 0, Math.PI * 2), g.fill();
    }
  };
}
function or(g) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const o = g();
      o && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(o.x_px + 12, o.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(o.text, o.x_px + 15, o.y_px - 5));
    }
  };
}
function lr(g = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const o = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let c = o.minX_mm; c <= o.maxX_mm; c += g)
        t.moveTo(c, o.minY_mm), t.lineTo(c, o.maxY_mm);
      for (let c = o.minY_mm; c <= o.maxY_mm; c += g)
        t.moveTo(o.minX_mm, c), t.lineTo(o.maxX_mm, c);
      t.stroke();
    }
  };
}
function cr(g) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, o) => {
      t += 16;
      const c = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + c * 0.7})`, e.beginPath(), e.arc(g.x_mm, g.y_mm, 0.5 + c * 0.5, 0, Math.PI * 2), e.fill(), o.requestRender("overlay:animate");
    }
  };
}
class Je {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const o = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: c, height_px: s } = t.viewport, i = 4;
    for (const n of o) {
      const d = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), v = d.x, y = d.y;
      v < -10 || y < -10 || v > c + 10 || y > s + 10 || (this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id), t.ctx.beginPath(), t.ctx.arc(v, y, i, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill());
    }
  }
  applyMarkerStyling(t, e, o, c) {
    if (o)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (c)
      t.fillStyle = "rgba(245, 158, 11, 0.8)", t.strokeStyle = "rgba(245, 158, 11, 1)";
    else
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
  }
}
function hr(g, t) {
  const e = new Je(g);
  return {
    id: "markers",
    order: kt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (o) => {
      if (!o.visibility.markers) return;
      const c = t();
      e.draw(o, {
        selectedId: c.selectedId,
        hoverId: c.hoverId
      });
    }
  };
}
export {
  $e as Emitter,
  ft as GerberError,
  Xe as MarkerPicker,
  Je as MarkerRenderer,
  je as MarkerStore,
  Ue as OverlayRegistry,
  Le as RenderScheduler,
  He as SelectionRenderer,
  We as UniformGridIndex,
  Ye as Viewer,
  De as ViewportTransform,
  se as VisibilityManager,
  rr as createGerberPass,
  lr as createGridOverlay,
  nr as createIntegratedViewer,
  hr as createMarkerPass,
  sr as createOverlayPass,
  cr as createPulsingMarkerOverlay,
  Ke as createSelectionPass,
  or as createTooltipOverlay,
  ar as createViolationDotsOverlay,
  be as detectGerberBundle,
  tr as renderGerbers,
  ne as renderGerbersFiles,
  Qe as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
