var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ce(g) {
  return g && g.__esModule && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g;
}
function Pt(g) {
  throw new Error('Could not dynamically require "' + g + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var $t;
function he() {
  return $t || ($t = 1, (function(g, t) {
    (function(e) {
      g.exports = e();
    })(function() {
      return (function e(o, c, i) {
        function s(v, y) {
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
              return s(a || m);
            }, h, h.exports, e, o, c, i);
          }
          return c[v].exports;
        }
        for (var n = typeof Pt == "function" && Pt, d = 0; d < i.length; d++) s(i[d]);
        return s;
      })({ 1: [function(e, o, c) {
        var i = e("./utils"), s = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        c.encode = function(d) {
          for (var v, y, u, _, h, m, a, p = [], f = 0, w = d.length, R = w, x = i.getTypeOf(d) !== "string"; f < d.length; ) R = w - f, u = x ? (v = d[f++], y = f < w ? d[f++] : 0, f < w ? d[f++] : 0) : (v = d.charCodeAt(f++), y = f < w ? d.charCodeAt(f++) : 0, f < w ? d.charCodeAt(f++) : 0), _ = v >> 2, h = (3 & v) << 4 | y >> 4, m = 1 < R ? (15 & y) << 2 | u >> 6 : 64, a = 2 < R ? 63 & u : 64, p.push(n.charAt(_) + n.charAt(h) + n.charAt(m) + n.charAt(a));
          return p.join("");
        }, c.decode = function(d) {
          var v, y, u, _, h, m, a = 0, p = 0, f = "data:";
          if (d.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var w, R = 3 * (d = d.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (d.charAt(d.length - 1) === n.charAt(64) && R--, d.charAt(d.length - 2) === n.charAt(64) && R--, R % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (w = s.uint8array ? new Uint8Array(0 | R) : new Array(0 | R); a < d.length; ) v = n.indexOf(d.charAt(a++)) << 2 | (_ = n.indexOf(d.charAt(a++))) >> 4, y = (15 & _) << 4 | (h = n.indexOf(d.charAt(a++))) >> 2, u = (3 & h) << 6 | (m = n.indexOf(d.charAt(a++))), w[p++] = v, h !== 64 && (w[p++] = y), m !== 64 && (w[p++] = u);
          return w;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, o, c) {
        var i = e("./external"), s = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), d = e("./stream/DataLengthProbe");
        function v(y, u, _, h, m) {
          this.compressedSize = y, this.uncompressedSize = u, this.crc32 = _, this.compression = h, this.compressedContent = m;
        }
        v.prototype = { getContentWorker: function() {
          var y = new s(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")), u = this;
          return y.on("end", function() {
            if (this.streamInfo.data_length !== u.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), y;
        }, getCompressedWorker: function() {
          return new s(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(y, u, _) {
          return y.pipe(new n()).pipe(new d("uncompressedSize")).pipe(u.compressWorker(_)).pipe(new d("compressedSize")).withStreamInfo("compression", u);
        }, o.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, o, c) {
        var i = e("./stream/GenericWorker");
        c.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, c.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, o, c) {
        var i = e("./utils"), s = (function() {
          for (var n, d = [], v = 0; v < 256; v++) {
            n = v;
            for (var y = 0; y < 8; y++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            d[v] = n;
          }
          return d;
        })();
        o.exports = function(n, d) {
          return n !== void 0 && n.length ? i.getTypeOf(n) !== "string" ? (function(v, y, u, _) {
            var h = s, m = _ + u;
            v ^= -1;
            for (var a = _; a < m; a++) v = v >>> 8 ^ h[255 & (v ^ y[a])];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : (function(v, y, u, _) {
            var h = s, m = _ + u;
            v ^= -1;
            for (var a = _; a < m; a++) v = v >>> 8 ^ h[255 & (v ^ y.charCodeAt(a))];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, o, c) {
        c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !0, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
      }, {}], 6: [function(e, o, c) {
        var i = null;
        i = typeof Promise < "u" ? Promise : e("lie"), o.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(e, o, c) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), n = e("./utils"), d = e("./stream/GenericWorker"), v = i ? "uint8array" : "array";
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
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
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
        function i(h, m) {
          var a, p = "";
          for (a = 0; a < m; a++) p += String.fromCharCode(255 & h), h >>>= 8;
          return p;
        }
        function s(h, m, a, p, f, w) {
          var R, x, A = h.file, P = h.compression, O = w !== v.utf8encode, L = n.transformTo("string", w(A.name)), T = n.transformTo("string", v.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", w(j)), S = n.transformTo("string", v.utf8encode(j)), F = T.length !== A.name.length, l = S.length !== j.length, D = "", Q = "", $ = "", et = A.dir, C = A.date, Z = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !a || (Z.crc32 = h.crc32, Z.compressedSize = h.compressedSize, Z.uncompressedSize = h.uncompressedSize);
          var M = 0;
          m && (M |= 8), O || !F && !l || (M |= 2048);
          var z = 0, G = 0;
          et && (z |= 16), f === "UNIX" ? (G = 798, z |= (function(U, it) {
            var lt = U;
            return U || (lt = it ? 16893 : 33204), (65535 & lt) << 16;
          })(A.unixPermissions, et)) : (G = 20, z |= (function(U) {
            return 63 & (U || 0);
          })(A.dosPermissions)), R = C.getUTCHours(), R <<= 6, R |= C.getUTCMinutes(), R <<= 5, R |= C.getUTCSeconds() / 2, x = C.getUTCFullYear() - 1980, x <<= 4, x |= C.getUTCMonth() + 1, x <<= 5, x |= C.getUTCDate(), F && (Q = i(1, 1) + i(y(L), 4) + T, D += "up" + i(Q.length, 2) + Q), l && ($ = i(1, 1) + i(y(K), 4) + S, D += "uc" + i($.length, 2) + $);
          var V = "";
          return V += `
\0`, V += i(M, 2), V += P.magic, V += i(R, 2), V += i(x, 2), V += i(Z.crc32, 4), V += i(Z.compressedSize, 4), V += i(Z.uncompressedSize, 4), V += i(L.length, 2), V += i(D.length, 2), { fileRecord: u.LOCAL_FILE_HEADER + V + L + D, dirRecord: u.CENTRAL_FILE_HEADER + i(G, 2) + V + i(K.length, 2) + "\0\0\0\0" + i(z, 4) + i(p, 4) + L + D + K };
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
            var a = s(h, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: a.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, _.prototype.closedSource = function(h) {
          this.accumulate = !1;
          var m = this.streamFiles && !h.file.dir, a = s(h, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(a.dirRecord), m) this.push({ data: (function(p) {
            return u.DATA_DESCRIPTOR + i(p.crc32, 4) + i(p.compressedSize, 4) + i(p.uncompressedSize, 4);
          })(h), meta: { percent: 100 } });
          else for (this.push({ data: a.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, _.prototype.flush = function() {
          for (var h = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var a = this.bytesWritten - h, p = (function(f, w, R, x, A) {
            var P = n.transformTo("string", A(x));
            return u.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(f, 2) + i(f, 2) + i(w, 4) + i(R, 4) + i(P.length, 2) + P;
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
        var i = e("../compressions"), s = e("./ZipFileWorker");
        c.generateWorker = function(n, d, v) {
          var y = new s(d.streamFiles, v, d.platform, d.encodeFileName), u = 0;
          try {
            n.forEach(function(_, h) {
              u++;
              var m = (function(w, R) {
                var x = w || R, A = i[x];
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
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new i();
            for (var n in this) typeof this[n] != "function" && (s[n] = this[n]);
            return s;
          };
        }
        (i.prototype = e("./object")).loadAsync = e("./load"), i.support = e("./support"), i.defaults = e("./defaults"), i.version = "3.10.1", i.loadAsync = function(s, n) {
          return new i().loadAsync(s, n);
        }, i.external = e("./external"), o.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, o, c) {
        var i = e("./utils"), s = e("./external"), n = e("./utf8"), d = e("./zipEntries"), v = e("./stream/Crc32Probe"), y = e("./nodejsUtils");
        function u(_) {
          return new s.Promise(function(h, m) {
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
          return h = i.extend(h || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), y.isNode && y.isStream(_) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", _, !0, h.optimizedBinaryString, h.base64).then(function(a) {
            var p = new d(h);
            return p.load(a), p;
          }).then(function(a) {
            var p = [s.Promise.resolve(a)], f = a.files;
            if (h.checkCRC32) for (var w = 0; w < f.length; w++) p.push(u(f[w]));
            return s.Promise.all(p);
          }).then(function(a) {
            for (var p = a.shift(), f = p.files, w = 0; w < f.length; w++) {
              var R = f[w], x = R.fileNameStr, A = i.resolve(R.fileNameStr);
              m.file(A, R.decompressed, { binary: !0, optimizedBinaryString: !0, date: R.date, dir: R.dir, comment: R.fileCommentStr.length ? R.fileCommentStr : null, unixPermissions: R.unixPermissions, dosPermissions: R.dosPermissions, createFolders: h.createFolders }), R.dir || (m.file(A).unsafeOriginalName = x);
            }
            return p.zipComment.length && (m.comment = p.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, o, c) {
        var i = e("../utils"), s = e("../stream/GenericWorker");
        function n(d, v) {
          s.call(this, "Nodejs stream input adapter for " + d), this._upstreamEnded = !1, this._bindStream(v);
        }
        i.inherits(n, s), n.prototype._bindStream = function(d) {
          var v = this;
          (this._stream = d).pause(), d.on("data", function(y) {
            v.push({ data: y, meta: { percent: 0 } });
          }).on("error", function(y) {
            v.isPaused ? this.generatedError = y : v.error(y);
          }).on("end", function() {
            v.isPaused ? v._upstreamEnded = !0 : v.end();
          });
        }, n.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, o.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, o, c) {
        var i = e("readable-stream").Readable;
        function s(n, d, v) {
          i.call(this, d), this._helper = n;
          var y = this;
          n.on("data", function(u, _) {
            y.push(u) || y._helper.pause(), v && v(_);
          }).on("error", function(u) {
            y.emit("error", u);
          }).on("end", function() {
            y.push(null);
          });
        }
        e("../utils").inherits(s, i), s.prototype._read = function() {
          this._helper.resume();
        }, o.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, o, c) {
        o.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, s) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, s);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, s);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var s = new Buffer(i);
          return s.fill(0), s;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(e, o, c) {
        function i(A, P, O) {
          var L, T = n.getTypeOf(P), j = n.extend(O || {}, y);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = f(A)), j.createFolders && (L = p(A)) && w.call(this, L, !0);
          var K = T === "string" && j.binary === !1 && j.base64 === !1;
          O && O.binary !== void 0 || (j.binary = !K), (P instanceof u && P.uncompressedSize === 0 || j.dir || !P || P.length === 0) && (j.base64 = !1, j.binary = !0, P = "", j.compression = "STORE", T = "string");
          var S = null;
          S = P instanceof u || P instanceof d ? P : m.isNode && m.isStream(P) ? new a(A, P) : n.prepareContent(A, P, j.binary, j.optimizedBinaryString, j.base64);
          var F = new _(A, S, j);
          this.files[A] = F;
        }
        var s = e("./utf8"), n = e("./utils"), d = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), y = e("./defaults"), u = e("./compressedObject"), _ = e("./zipObject"), h = e("./generate"), m = e("./nodejsUtils"), a = e("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var P = A.lastIndexOf("/");
          return 0 < P ? A.substring(0, P) : "";
        }, f = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, w = function(A, P) {
          return P = P !== void 0 ? P : y.createFolders, A = f(A), this.files[A] || i.call(this, A, null, { dir: !0, createFolders: P }), this.files[A];
        };
        function R(A) {
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
          if (arguments.length !== 1) return A = this.root + A, i.call(this, A, P, O), this;
          if (R(A)) {
            var L = A;
            return this.filter(function(j, K) {
              return !K.dir && L.test(j);
            });
          }
          var T = this.files[this.root + A];
          return T && !T.dir ? T : null;
        }, folder: function(A) {
          if (!A) return this;
          if (R(A)) return this.filter(function(T, j) {
            return j.dir && A.test(T);
          });
          var P = this.root + A, O = w.call(this, P), L = this.clone();
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
            if ((O = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
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
        var i = e("./DataReader");
        function s(n) {
          i.call(this, n);
          for (var d = 0; d < this.data.length; d++) n[d] = 255 & n[d];
        }
        e("../utils").inherits(s, i), s.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, s.prototype.lastIndexOfSignature = function(n) {
          for (var d = n.charCodeAt(0), v = n.charCodeAt(1), y = n.charCodeAt(2), u = n.charCodeAt(3), _ = this.length - 4; 0 <= _; --_) if (this.data[_] === d && this.data[_ + 1] === v && this.data[_ + 2] === y && this.data[_ + 3] === u) return _ - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(n) {
          var d = n.charCodeAt(0), v = n.charCodeAt(1), y = n.charCodeAt(2), u = n.charCodeAt(3), _ = this.readData(4);
          return d === _[0] && v === _[1] && y === _[2] && u === _[3];
        }, s.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, o, c) {
        var i = e("../utils");
        function s(n) {
          this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(n) {
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
          return i.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, o.exports = s;
      }, { "../utils": 32 }], 19: [function(e, o, c) {
        var i = e("./Uint8ArrayReader");
        function s(n) {
          i.call(this, n);
        }
        e("../utils").inherits(s, i), s.prototype.readData = function(n) {
          this.checkOffset(n);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, o, c) {
        var i = e("./DataReader");
        function s(n) {
          i.call(this, n);
        }
        e("../utils").inherits(s, i), s.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, s.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, s.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, s.prototype.readData = function(n) {
          this.checkOffset(n);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, o, c) {
        var i = e("./ArrayReader");
        function s(n) {
          i.call(this, n);
        }
        e("../utils").inherits(s, i), s.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var d = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, o.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, o, c) {
        var i = e("../utils"), s = e("../support"), n = e("./ArrayReader"), d = e("./StringReader"), v = e("./NodeBufferReader"), y = e("./Uint8ArrayReader");
        o.exports = function(u) {
          var _ = i.getTypeOf(u);
          return i.checkSupport(_), _ !== "string" || s.uint8array ? _ === "nodebuffer" ? new v(u) : s.uint8array ? new y(i.transformTo("uint8array", u)) : new n(i.transformTo("array", u)) : new d(u);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, o, c) {
        c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, o, c) {
        var i = e("./GenericWorker"), s = e("../utils");
        function n(d) {
          i.call(this, "ConvertWorker to " + d), this.destType = d;
        }
        s.inherits(n, i), n.prototype.processChunk = function(d) {
          this.push({ data: s.transformTo(this.destType, d.data), meta: d.meta });
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, o, c) {
        var i = e("./GenericWorker"), s = e("../crc32");
        function n() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, i), n.prototype.processChunk = function(d) {
          this.streamInfo.crc32 = s(d.data, this.streamInfo.crc32 || 0), this.push(d);
        }, o.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, o, c) {
        var i = e("../utils"), s = e("./GenericWorker");
        function n(d) {
          s.call(this, "DataLengthProbe for " + d), this.propName = d, this.withStreamInfo(d, 0);
        }
        i.inherits(n, s), n.prototype.processChunk = function(d) {
          if (d) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + d.data.length;
          }
          s.prototype.processChunk.call(this, d);
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, o, c) {
        var i = e("../utils"), s = e("./GenericWorker");
        function n(d) {
          s.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, d.then(function(y) {
            v.dataIsReady = !0, v.data = y, v.max = y && y.length || 0, v.type = i.getTypeOf(y), v.isPaused || v._tickAndRepeat();
          }, function(y) {
            v.error(y);
          });
        }
        i.inherits(n, s), n.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
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
        function i(s) {
          this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(s) {
          this.emit("data", s);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (s) {
            this.emit("error", s);
          }
          return !0;
        }, error: function(s) {
          return !this.isFinished && (this.isPaused ? this.generatedError = s : (this.isFinished = !0, this.emit("error", s), this.previous && this.previous.error(s), this.cleanUp()), !0);
        }, on: function(s, n) {
          return this._listeners[s].push(n), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, n) {
          if (this._listeners[s]) for (var d = 0; d < this._listeners[s].length; d++) this._listeners[s][d].call(this, n);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var n = this;
          return s.on("data", function(d) {
            n.processChunk(d);
          }), s.on("end", function() {
            n.end();
          }), s.on("error", function(d) {
            n.error(d);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var s = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), s = !0), this.previous && this.previous.resume(), !s;
        }, flush: function() {
        }, processChunk: function(s) {
          this.push(s);
        }, withStreamInfo: function(s, n) {
          return this.extraStreamInfo[s] = n, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var s = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + s : s;
        } }, o.exports = i;
      }, {}], 29: [function(e, o, c) {
        var i = e("../utils"), s = e("./ConvertWorker"), n = e("./GenericWorker"), d = e("../base64"), v = e("../support"), y = e("../external"), u = null;
        if (v.nodestream) try {
          u = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function _(m, a) {
          return new y.Promise(function(p, f) {
            var w = [], R = m._internalType, x = m._outputType, A = m._mimeType;
            m.on("data", function(P, O) {
              w.push(P), a && a(O);
            }).on("error", function(P) {
              w = [], f(P);
            }).on("end", function() {
              try {
                var P = (function(O, L, T) {
                  switch (O) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", L), T);
                    case "base64":
                      return d.encode(L);
                    default:
                      return i.transformTo(O, L);
                  }
                })(x, (function(O, L) {
                  var T, j = 0, K = null, S = 0;
                  for (T = 0; T < L.length; T++) S += L[T].length;
                  switch (O) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (K = new Uint8Array(S), T = 0; T < L.length; T++) K.set(L[T], j), j += L[T].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(R, w), A);
                p(P);
              } catch (O) {
                f(O);
              }
              w = [];
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
            this._internalType = f, this._outputType = a, this._mimeType = p, i.checkSupport(f), this._worker = m.pipe(new s(f)), m.lock();
          } catch (w) {
            this._worker = new n("error"), this._worker.error(w);
          }
        }
        h.prototype = { accumulate: function(m) {
          return _(this, m);
        }, on: function(m, a) {
          var p = this;
          return m === "data" ? this._worker.on(m, function(f) {
            a.call(p, f.data, f.meta);
          }) : this._worker.on(m, function() {
            i.delay(a, arguments, p);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new u(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, o.exports = h;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, o, c) {
        if (c.base64 = !0, c.array = !0, c.string = !0, c.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", c.nodebuffer = typeof Buffer < "u", c.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") c.blob = !1;
        else {
          var i = new ArrayBuffer(0);
          try {
            c.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              s.append(i), c.blob = s.getBlob("application/zip").size === 0;
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
        for (var i = e("./utils"), s = e("./support"), n = e("./nodejsUtils"), d = e("./stream/GenericWorker"), v = new Array(256), y = 0; y < 256; y++) v[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        v[254] = v[254] = 1;
        function u() {
          d.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function _() {
          d.call(this, "utf-8 encode");
        }
        c.utf8encode = function(h) {
          return s.nodebuffer ? n.newBufferFrom(h, "utf-8") : (function(m) {
            var a, p, f, w, R, x = m.length, A = 0;
            for (w = 0; w < x; w++) (64512 & (p = m.charCodeAt(w))) == 55296 && w + 1 < x && (64512 & (f = m.charCodeAt(w + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), w++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (a = s.uint8array ? new Uint8Array(A) : new Array(A), w = R = 0; R < A; w++) (64512 & (p = m.charCodeAt(w))) == 55296 && w + 1 < x && (64512 & (f = m.charCodeAt(w + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), w++), p < 128 ? a[R++] = p : (p < 2048 ? a[R++] = 192 | p >>> 6 : (p < 65536 ? a[R++] = 224 | p >>> 12 : (a[R++] = 240 | p >>> 18, a[R++] = 128 | p >>> 12 & 63), a[R++] = 128 | p >>> 6 & 63), a[R++] = 128 | 63 & p);
            return a;
          })(h);
        }, c.utf8decode = function(h) {
          return s.nodebuffer ? i.transformTo("nodebuffer", h).toString("utf-8") : (function(m) {
            var a, p, f, w, R = m.length, x = new Array(2 * R);
            for (a = p = 0; a < R; ) if ((f = m[a++]) < 128) x[p++] = f;
            else if (4 < (w = v[f])) x[p++] = 65533, a += w - 1;
            else {
              for (f &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && a < R; ) f = f << 6 | 63 & m[a++], w--;
              1 < w ? x[p++] = 65533 : f < 65536 ? x[p++] = f : (f -= 65536, x[p++] = 55296 | f >> 10 & 1023, x[p++] = 56320 | 1023 & f);
            }
            return x.length !== p && (x.subarray ? x = x.subarray(0, p) : x.length = p), i.applyFromCharCode(x);
          })(h = i.transformTo(s.uint8array ? "uint8array" : "array", h));
        }, i.inherits(u, d), u.prototype.processChunk = function(h) {
          var m = i.transformTo(s.uint8array ? "uint8array" : "array", h.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var a = m;
              (m = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), m.set(a, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var p = (function(w, R) {
            var x;
            for ((R = R || w.length) > w.length && (R = w.length), x = R - 1; 0 <= x && (192 & w[x]) == 128; ) x--;
            return x < 0 || x === 0 ? R : x + v[w[x]] > R ? x : R;
          })(m), f = m;
          p !== m.length && (s.uint8array ? (f = m.subarray(0, p), this.leftOver = m.subarray(p, m.length)) : (f = m.slice(0, p), this.leftOver = m.slice(p, m.length))), this.push({ data: c.utf8decode(f), meta: h.meta });
        }, u.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: c.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, c.Utf8DecodeWorker = u, i.inherits(_, d), _.prototype.processChunk = function(h) {
          this.push({ data: c.utf8encode(h.data), meta: h.meta });
        }, c.Utf8EncodeWorker = _;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, o, c) {
        var i = e("./support"), s = e("./base64"), n = e("./nodejsUtils"), d = e("./external");
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
          var w = [], R = 0, x = a.length;
          if (x <= f) return String.fromCharCode.apply(null, a);
          for (; R < x; ) p === "array" || p === "nodebuffer" ? w.push(String.fromCharCode.apply(null, a.slice(R, Math.min(R + f, x)))) : w.push(String.fromCharCode.apply(null, a.subarray(R, Math.min(R + f, x)))), R += f;
          return w.join("");
        }, stringifyByChar: function(a) {
          for (var p = "", f = 0; f < a.length; f++) p += String.fromCharCode(a[f]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return i.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function _(a) {
          var p = 65536, f = c.getTypeOf(a), w = !0;
          if (f === "uint8array" ? w = u.applyCanBeUsed.uint8array : f === "nodebuffer" && (w = u.applyCanBeUsed.nodebuffer), w) for (; 1 < p; ) try {
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
          for (var p = a.split("/"), f = [], w = 0; w < p.length; w++) {
            var R = p[w];
            R === "." || R === "" && w !== 0 && w !== p.length - 1 || (R === ".." ? f.pop() : f.push(R));
          }
          return f.join("/");
        }, c.getTypeOf = function(a) {
          return typeof a == "string" ? "string" : Object.prototype.toString.call(a) === "[object Array]" ? "array" : i.nodebuffer && n.isBuffer(a) ? "nodebuffer" : i.uint8array && a instanceof Uint8Array ? "uint8array" : i.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, c.checkSupport = function(a) {
          if (!i[a.toLowerCase()]) throw new Error(a + " is not supported by this platform");
        }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function(a) {
          var p, f, w = "";
          for (f = 0; f < (a || "").length; f++) w += "\\x" + ((p = a.charCodeAt(f)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return w;
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
        }, c.prepareContent = function(a, p, f, w, R) {
          return d.Promise.resolve(p).then(function(x) {
            return i.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) && typeof FileReader < "u" ? new d.Promise(function(A, P) {
              var O = new FileReader();
              O.onload = function(L) {
                A(L.target.result);
              }, O.onerror = function(L) {
                P(L.target.error);
              }, O.readAsArrayBuffer(x);
            }) : x;
          }).then(function(x) {
            var A = c.getTypeOf(x);
            return A ? (A === "arraybuffer" ? x = c.transformTo("uint8array", x) : A === "string" && (R ? x = s.decode(x) : f && w !== !0 && (x = (function(P) {
              return y(P, i.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(x))), x) : d.Promise.reject(new Error("Can't read the data of '" + a + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, o, c) {
        var i = e("./reader/readerFor"), s = e("./utils"), n = e("./signature"), d = e("./zipEntry"), v = e("./support");
        function y(u) {
          this.files = [], this.loadOptions = u;
        }
        y.prototype = { checkSignature: function(u) {
          if (!this.reader.readAndCheckSignature(u)) {
            this.reader.index -= 4;
            var _ = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(_) + ", expected " + s.pretty(u) + ")");
          }
        }, isSignature: function(u, _) {
          var h = this.reader.index;
          this.reader.setIndex(u);
          var m = this.reader.readString(4) === _;
          return this.reader.setIndex(h), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var u = this.reader.readData(this.zipCommentLength), _ = v.uint8array ? "uint8array" : "array", h = s.transformTo(_, u);
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
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
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
          this.reader = i(u);
        }, load: function(u) {
          this.prepareReader(u), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, o.exports = y;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, o, c) {
        var i = e("./reader/readerFor"), s = e("./utils"), n = e("./compressedObject"), d = e("./crc32"), v = e("./utf8"), y = e("./compressions"), u = e("./support");
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
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
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
            var h = i(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = h.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = h.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = h.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = h.readInt(4));
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
              var a = s.transformTo(h, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(a);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var f = s.transformTo(h, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var h = this.extraFields[28789];
          if (h) {
            var m = i(h.value);
            return m.readInt(1) !== 1 || d(this.fileName) !== m.readInt(4) ? null : v.utf8decode(m.readData(h.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var h = this.extraFields[25461];
          if (h) {
            var m = i(h.value);
            return m.readInt(1) !== 1 || d(this.fileComment) !== m.readInt(4) ? null : v.utf8decode(m.readData(h.length - 5));
          }
          return null;
        } }, o.exports = _;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, o, c) {
        function i(m, a, p) {
          this.name = m, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = a, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), d = e("./utf8"), v = e("./compressedObject"), y = e("./stream/GenericWorker");
        i.prototype = { internalStream: function(m) {
          var a = null, p = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var f = (p = m.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), a = this._decompressWorker();
            var w = !this._dataBinary;
            w && !f && (a = a.pipe(new d.Utf8EncodeWorker())), !w && f && (a = a.pipe(new d.Utf8DecodeWorker()));
          } catch (R) {
            (a = new y("error")).error(R);
          }
          return new s(a, p, "");
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
        }, h = 0; h < u.length; h++) i.prototype[u[h]] = _;
        o.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, o, c) {
        (function(i) {
          var s, n, d = i.MutationObserver || i.WebKitMutationObserver;
          if (d) {
            var v = 0, y = new d(m), u = i.document.createTextNode("");
            y.observe(u, { characterData: !0 }), s = function() {
              u.data = v = ++v % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) s = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var a = i.document.createElement("script");
            a.onreadystatechange = function() {
              m(), a.onreadystatechange = null, a.parentNode.removeChild(a), a = null;
            }, i.document.documentElement.appendChild(a);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var _ = new i.MessageChannel();
            _.port1.onmessage = m, s = function() {
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
            h.push(a) !== 1 || n || s();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, o, c) {
        var i = e("immediate");
        function s() {
        }
        var n = {}, d = ["REJECTED"], v = ["FULFILLED"], y = ["PENDING"];
        function u(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = y, this.queue = [], this.outcome = void 0, f !== s && a(this, f);
        }
        function _(f, w, R) {
          this.promise = f, typeof w == "function" && (this.onFulfilled = w, this.callFulfilled = this.otherCallFulfilled), typeof R == "function" && (this.onRejected = R, this.callRejected = this.otherCallRejected);
        }
        function h(f, w, R) {
          i(function() {
            var x;
            try {
              x = w(R);
            } catch (A) {
              return n.reject(f, A);
            }
            x === f ? n.reject(f, new TypeError("Cannot resolve promise with itself")) : n.resolve(f, x);
          });
        }
        function m(f) {
          var w = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof w == "function") return function() {
            w.apply(f, arguments);
          };
        }
        function a(f, w) {
          var R = !1;
          function x(O) {
            R || (R = !0, n.reject(f, O));
          }
          function A(O) {
            R || (R = !0, n.resolve(f, O));
          }
          var P = p(function() {
            w(A, x);
          });
          P.status === "error" && x(P.value);
        }
        function p(f, w) {
          var R = {};
          try {
            R.value = f(w), R.status = "success";
          } catch (x) {
            R.status = "error", R.value = x;
          }
          return R;
        }
        (o.exports = u).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var w = this.constructor;
          return this.then(function(R) {
            return w.resolve(f()).then(function() {
              return R;
            });
          }, function(R) {
            return w.resolve(f()).then(function() {
              throw R;
            });
          });
        }, u.prototype.catch = function(f) {
          return this.then(null, f);
        }, u.prototype.then = function(f, w) {
          if (typeof f != "function" && this.state === v || typeof w != "function" && this.state === d) return this;
          var R = new this.constructor(s);
          return this.state !== y ? h(R, this.state === v ? f : w, this.outcome) : this.queue.push(new _(R, f, w)), R;
        }, _.prototype.callFulfilled = function(f) {
          n.resolve(this.promise, f);
        }, _.prototype.otherCallFulfilled = function(f) {
          h(this.promise, this.onFulfilled, f);
        }, _.prototype.callRejected = function(f) {
          n.reject(this.promise, f);
        }, _.prototype.otherCallRejected = function(f) {
          h(this.promise, this.onRejected, f);
        }, n.resolve = function(f, w) {
          var R = p(m, w);
          if (R.status === "error") return n.reject(f, R.value);
          var x = R.value;
          if (x) a(f, x);
          else {
            f.state = v, f.outcome = w;
            for (var A = -1, P = f.queue.length; ++A < P; ) f.queue[A].callFulfilled(w);
          }
          return f;
        }, n.reject = function(f, w) {
          f.state = d, f.outcome = w;
          for (var R = -1, x = f.queue.length; ++R < x; ) f.queue[R].callRejected(w);
          return f;
        }, u.resolve = function(f) {
          return f instanceof this ? f : n.resolve(new this(s), f);
        }, u.reject = function(f) {
          var w = new this(s);
          return n.reject(w, f);
        }, u.all = function(f) {
          var w = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = f.length, x = !1;
          if (!R) return this.resolve([]);
          for (var A = new Array(R), P = 0, O = -1, L = new this(s); ++O < R; ) T(f[O], O);
          return L;
          function T(j, K) {
            w.resolve(j).then(function(S) {
              A[K] = S, ++P !== R || x || (x = !0, n.resolve(L, A));
            }, function(S) {
              x || (x = !0, n.reject(L, S));
            });
          }
        }, u.race = function(f) {
          var w = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = f.length, x = !1;
          if (!R) return this.resolve([]);
          for (var A = -1, P = new this(s); ++A < R; ) O = f[A], w.resolve(O).then(function(L) {
            x || (x = !0, n.resolve(P, L));
          }, function(L) {
            x || (x = !0, n.reject(P, L));
          });
          var O;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, o, c) {
        var i = {};
        (0, e("./lib/utils/common").assign)(i, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), o.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, o, c) {
        var i = e("./zlib/deflate"), s = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/messages"), v = e("./zlib/zstream"), y = Object.prototype.toString, u = 0, _ = -1, h = 0, m = 8;
        function a(f) {
          if (!(this instanceof a)) return new a(f);
          this.options = s.assign({ level: _, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: h, to: "" }, f || {});
          var w = this.options;
          w.raw && 0 < w.windowBits ? w.windowBits = -w.windowBits : w.gzip && 0 < w.windowBits && w.windowBits < 16 && (w.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var R = i.deflateInit2(this.strm, w.level, w.method, w.windowBits, w.memLevel, w.strategy);
          if (R !== u) throw new Error(d[R]);
          if (w.header && i.deflateSetHeader(this.strm, w.header), w.dictionary) {
            var x;
            if (x = typeof w.dictionary == "string" ? n.string2buf(w.dictionary) : y.call(w.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(w.dictionary) : w.dictionary, (R = i.deflateSetDictionary(this.strm, x)) !== u) throw new Error(d[R]);
            this._dict_set = !0;
          }
        }
        function p(f, w) {
          var R = new a(w);
          if (R.push(f, !0), R.err) throw R.msg || d[R.err];
          return R.result;
        }
        a.prototype.push = function(f, w) {
          var R, x, A = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          x = w === ~~w ? w : w === !0 ? 4 : 0, typeof f == "string" ? A.input = n.string2buf(f) : y.call(f) === "[object ArrayBuffer]" ? A.input = new Uint8Array(f) : A.input = f, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new s.Buf8(P), A.next_out = 0, A.avail_out = P), (R = i.deflate(A, x)) !== 1 && R !== u) return this.onEnd(R), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(s.shrinkBuf(A.output, A.next_out))) : this.onData(s.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && R !== 1);
          return x === 4 ? (R = i.deflateEnd(this.strm), this.onEnd(R), this.ended = !0, R === u) : x !== 2 || (this.onEnd(u), !(A.avail_out = 0));
        }, a.prototype.onData = function(f) {
          this.chunks.push(f);
        }, a.prototype.onEnd = function(f) {
          f === u && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, c.Deflate = a, c.deflate = p, c.deflateRaw = function(f, w) {
          return (w = w || {}).raw = !0, p(f, w);
        }, c.gzip = function(f, w) {
          return (w = w || {}).gzip = !0, p(f, w);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, o, c) {
        var i = e("./zlib/inflate"), s = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/constants"), v = e("./zlib/messages"), y = e("./zlib/zstream"), u = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function h(a) {
          if (!(this instanceof h)) return new h(a);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || a && a.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var f = i.inflateInit2(this.strm, p.windowBits);
          if (f !== d.Z_OK) throw new Error(v[f]);
          this.header = new u(), i.inflateGetHeader(this.strm, this.header);
        }
        function m(a, p) {
          var f = new h(p);
          if (f.push(a, !0), f.err) throw f.msg || v[f.err];
          return f.result;
        }
        h.prototype.push = function(a, p) {
          var f, w, R, x, A, P, O = this.strm, L = this.options.chunkSize, T = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          w = p === ~~p ? p : p === !0 ? d.Z_FINISH : d.Z_NO_FLUSH, typeof a == "string" ? O.input = n.binstring2buf(a) : _.call(a) === "[object ArrayBuffer]" ? O.input = new Uint8Array(a) : O.input = a, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new s.Buf8(L), O.next_out = 0, O.avail_out = L), (f = i.inflate(O, d.Z_NO_FLUSH)) === d.Z_NEED_DICT && T && (P = typeof T == "string" ? n.string2buf(T) : _.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, f = i.inflateSetDictionary(this.strm, P)), f === d.Z_BUF_ERROR && j === !0 && (f = d.Z_OK, j = !1), f !== d.Z_STREAM_END && f !== d.Z_OK) return this.onEnd(f), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && f !== d.Z_STREAM_END && (O.avail_in !== 0 || w !== d.Z_FINISH && w !== d.Z_SYNC_FLUSH) || (this.options.to === "string" ? (R = n.utf8border(O.output, O.next_out), x = O.next_out - R, A = n.buf2string(O.output, R), O.next_out = x, O.avail_out = L - x, x && s.arraySet(O.output, O.output, R, x, 0), this.onData(A)) : this.onData(s.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (j = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && f !== d.Z_STREAM_END);
          return f === d.Z_STREAM_END && (w = d.Z_FINISH), w === d.Z_FINISH ? (f = i.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === d.Z_OK) : w !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), !(O.avail_out = 0));
        }, h.prototype.onData = function(a) {
          this.chunks.push(a);
        }, h.prototype.onEnd = function(a) {
          a === d.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, c.Inflate = h, c.inflate = m, c.inflateRaw = function(a, p) {
          return (p = p || {}).raw = !0, m(a, p);
        }, c.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, o, c) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
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
        var s = { arraySet: function(d, v, y, u, _) {
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
          d ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, s)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, n));
        }, c.setTyped(i);
      }, {}], 42: [function(e, o, c) {
        var i = e("./common"), s = !0, n = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          n = !1;
        }
        for (var d = new i.Buf8(256), v = 0; v < 256; v++) d[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function y(u, _) {
          if (_ < 65537 && (u.subarray && n || !u.subarray && s)) return String.fromCharCode.apply(null, i.shrinkBuf(u, _));
          for (var h = "", m = 0; m < _; m++) h += String.fromCharCode(u[m]);
          return h;
        }
        d[254] = d[254] = 1, c.string2buf = function(u) {
          var _, h, m, a, p, f = u.length, w = 0;
          for (a = 0; a < f; a++) (64512 & (h = u.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (m = u.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), a++), w += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4;
          for (_ = new i.Buf8(w), a = p = 0; p < w; a++) (64512 & (h = u.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (m = u.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), a++), h < 128 ? _[p++] = h : (h < 2048 ? _[p++] = 192 | h >>> 6 : (h < 65536 ? _[p++] = 224 | h >>> 12 : (_[p++] = 240 | h >>> 18, _[p++] = 128 | h >>> 12 & 63), _[p++] = 128 | h >>> 6 & 63), _[p++] = 128 | 63 & h);
          return _;
        }, c.buf2binstring = function(u) {
          return y(u, u.length);
        }, c.binstring2buf = function(u) {
          for (var _ = new i.Buf8(u.length), h = 0, m = _.length; h < m; h++) _[h] = u.charCodeAt(h);
          return _;
        }, c.buf2string = function(u, _) {
          var h, m, a, p, f = _ || u.length, w = new Array(2 * f);
          for (h = m = 0; h < f; ) if ((a = u[h++]) < 128) w[m++] = a;
          else if (4 < (p = d[a])) w[m++] = 65533, h += p - 1;
          else {
            for (a &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && h < f; ) a = a << 6 | 63 & u[h++], p--;
            1 < p ? w[m++] = 65533 : a < 65536 ? w[m++] = a : (a -= 65536, w[m++] = 55296 | a >> 10 & 1023, w[m++] = 56320 | 1023 & a);
          }
          return y(w, m);
        }, c.utf8border = function(u, _) {
          var h;
          for ((_ = _ || u.length) > u.length && (_ = u.length), h = _ - 1; 0 <= h && (192 & u[h]) == 128; ) h--;
          return h < 0 || h === 0 ? _ : h + d[u[h]] > _ ? h : _;
        };
      }, { "./common": 41 }], 43: [function(e, o, c) {
        o.exports = function(i, s, n, d) {
          for (var v = 65535 & i | 0, y = i >>> 16 & 65535 | 0, u = 0; n !== 0; ) {
            for (n -= u = 2e3 < n ? 2e3 : n; y = y + (v = v + s[d++] | 0) | 0, --u; ) ;
            v %= 65521, y %= 65521;
          }
          return v | y << 16 | 0;
        };
      }, {}], 44: [function(e, o, c) {
        o.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, o, c) {
        var i = (function() {
          for (var s, n = [], d = 0; d < 256; d++) {
            s = d;
            for (var v = 0; v < 8; v++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            n[d] = s;
          }
          return n;
        })();
        o.exports = function(s, n, d, v) {
          var y = i, u = v + d;
          s ^= -1;
          for (var _ = v; _ < u; _++) s = s >>> 8 ^ y[255 & (s ^ n[_])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, o, c) {
        var i, s = e("../utils/common"), n = e("./trees"), d = e("./adler32"), v = e("./crc32"), y = e("./messages"), u = 0, _ = 4, h = 0, m = -2, a = -1, p = 4, f = 2, w = 8, R = 9, x = 286, A = 30, P = 19, O = 2 * x + 1, L = 15, T = 3, j = 258, K = j + T + 1, S = 42, F = 113, l = 1, D = 2, Q = 3, $ = 4;
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
          B > r.avail_out && (B = r.avail_out), B !== 0 && (s.arraySet(r.output, N.pending_buf, N.pending_out, B, r.next_out), r.next_out += B, N.pending_out += B, r.total_out += B, r.avail_out -= B, N.pending -= B, N.pending === 0 && (N.pending_out = 0));
        }
        function z(r, N) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, N), r.block_start = r.strstart, M(r.strm);
        }
        function G(r, N) {
          r.pending_buf[r.pending++] = N;
        }
        function V(r, N) {
          r.pending_buf[r.pending++] = N >>> 8 & 255, r.pending_buf[r.pending++] = 255 & N;
        }
        function U(r, N) {
          var B, k, b = r.max_chain_length, E = r.strstart, W = r.prev_length, X = r.nice_match, I = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, Y = r.window, H = r.w_mask, q = r.prev, J = r.strstart + j, ht = Y[E + W - 1], at = Y[E + W];
          r.prev_length >= r.good_match && (b >>= 2), X > r.lookahead && (X = r.lookahead);
          do
            if (Y[(B = N) + W] === at && Y[B + W - 1] === ht && Y[B] === Y[E] && Y[++B] === Y[E + 1]) {
              E += 2, B++;
              do
                ;
              while (Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && Y[++E] === Y[++B] && E < J);
              if (k = j - (J - E), E = J - j, W < k) {
                if (r.match_start = N, X <= (W = k)) break;
                ht = Y[E + W - 1], at = Y[E + W];
              }
            }
          while ((N = q[N & H]) > I && --b != 0);
          return W <= r.lookahead ? W : r.lookahead;
        }
        function it(r) {
          var N, B, k, b, E, W, X, I, Y, H, q = r.w_size;
          do {
            if (b = r.window_size - r.lookahead - r.strstart, r.strstart >= q + (q - K)) {
              for (s.arraySet(r.window, r.window, q, q, 0), r.match_start -= q, r.strstart -= q, r.block_start -= q, N = B = r.hash_size; k = r.head[--N], r.head[N] = q <= k ? k - q : 0, --B; ) ;
              for (N = B = q; k = r.prev[--N], r.prev[N] = q <= k ? k - q : 0, --B; ) ;
              b += q;
            }
            if (r.strm.avail_in === 0) break;
            if (W = r.strm, X = r.window, I = r.strstart + r.lookahead, Y = b, H = void 0, H = W.avail_in, Y < H && (H = Y), B = H === 0 ? 0 : (W.avail_in -= H, s.arraySet(X, W.input, W.next_in, H, I), W.state.wrap === 1 ? W.adler = d(W.adler, X, H, I) : W.state.wrap === 2 && (W.adler = v(W.adler, X, H, I)), W.next_in += H, W.total_in += H, H), r.lookahead += B, r.lookahead + r.insert >= T) for (E = r.strstart - r.insert, r.ins_h = r.window[E], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[E + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[E + T - 1]) & r.hash_mask, r.prev[E & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = E, E++, r.insert--, !(r.lookahead + r.insert < T)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function lt(r, N) {
          for (var B, k; ; ) {
            if (r.lookahead < K) {
              if (it(r), r.lookahead < K && N === u) return l;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), B !== 0 && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B)), r.match_length >= T) if (k = n._tr_tally(r, r.strstart - r.match_start, r.match_length - T), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= T) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else k = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (k && (z(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === _ ? (z(r, !0), r.strm.avail_out === 0 ? Q : $) : r.last_lit && (z(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function tt(r, N) {
          for (var B, k, b; ; ) {
            if (r.lookahead < K) {
              if (it(r), r.lookahead < K && N === u) return l;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = T - 1, B !== 0 && r.prev_length < r.max_lazy_match && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B), r.match_length <= 5 && (r.strategy === 1 || r.match_length === T && 4096 < r.strstart - r.match_start) && (r.match_length = T - 1)), r.prev_length >= T && r.match_length <= r.prev_length) {
              for (b = r.strstart + r.lookahead - T, k = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - T), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= b && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = T - 1, r.strstart++, k && (z(r, !1), r.strm.avail_out === 0)) return l;
            } else if (r.match_available) {
              if ((k = n._tr_tally(r, 0, r.window[r.strstart - 1])) && z(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return l;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (k = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === _ ? (z(r, !0), r.strm.avail_out === 0 ? Q : $) : r.last_lit && (z(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function rt(r, N, B, k, b) {
          this.good_length = r, this.max_lazy = N, this.nice_length = B, this.max_chain = k, this.func = b;
        }
        function st() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = w, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * O), this.dyn_dtree = new s.Buf16(2 * (2 * A + 1)), this.bl_tree = new s.Buf16(2 * (2 * P + 1)), Z(this.dyn_ltree), Z(this.dyn_dtree), Z(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(L + 1), this.heap = new s.Buf16(2 * x + 1), Z(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * x + 1), Z(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(r) {
          var N;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = f, (N = r.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? S : F, r.adler = N.wrap === 2 ? 0 : 1, N.last_flush = u, n._tr_init(N), h) : et(r, m);
        }
        function nt(r) {
          var N = ot(r);
          return N === h && (function(B) {
            B.window_size = 2 * B.w_size, Z(B.head), B.max_lazy_match = i[B.level].max_lazy, B.good_match = i[B.level].good_length, B.nice_match = i[B.level].nice_length, B.max_chain_length = i[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = T - 1, B.match_available = 0, B.ins_h = 0;
          })(r.state), N;
        }
        function ct(r, N, B, k, b, E) {
          if (!r) return m;
          var W = 1;
          if (N === a && (N = 6), k < 0 ? (W = 0, k = -k) : 15 < k && (W = 2, k -= 16), b < 1 || R < b || B !== w || k < 8 || 15 < k || N < 0 || 9 < N || E < 0 || p < E) return et(r, m);
          k === 8 && (k = 9);
          var X = new st();
          return (r.state = X).strm = r, X.wrap = W, X.gzhead = null, X.w_bits = k, X.w_size = 1 << X.w_bits, X.w_mask = X.w_size - 1, X.hash_bits = b + 7, X.hash_size = 1 << X.hash_bits, X.hash_mask = X.hash_size - 1, X.hash_shift = ~~((X.hash_bits + T - 1) / T), X.window = new s.Buf8(2 * X.w_size), X.head = new s.Buf16(X.hash_size), X.prev = new s.Buf16(X.w_size), X.lit_bufsize = 1 << b + 6, X.pending_buf_size = 4 * X.lit_bufsize, X.pending_buf = new s.Buf8(X.pending_buf_size), X.d_buf = 1 * X.lit_bufsize, X.l_buf = 3 * X.lit_bufsize, X.level = N, X.strategy = E, X.method = B, nt(r);
        }
        i = [new rt(0, 0, 0, 0, function(r, N) {
          var B = 65535;
          for (B > r.pending_buf_size - 5 && (B = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (it(r), r.lookahead === 0 && N === u) return l;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var k = r.block_start + B;
            if ((r.strstart === 0 || r.strstart >= k) && (r.lookahead = r.strstart - k, r.strstart = k, z(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (z(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = 0, N === _ ? (z(r, !0), r.strm.avail_out === 0 ? Q : $) : (r.strstart > r.block_start && (z(r, !1), r.strm.avail_out), l);
        }), new rt(4, 4, 8, 4, lt), new rt(4, 5, 16, 8, lt), new rt(4, 6, 32, 32, lt), new rt(4, 4, 16, 16, tt), new rt(8, 16, 32, 32, tt), new rt(8, 16, 128, 128, tt), new rt(8, 32, 128, 256, tt), new rt(32, 128, 258, 1024, tt), new rt(32, 258, 258, 4096, tt)], c.deflateInit = function(r, N) {
          return ct(r, N, w, 15, 8, 0);
        }, c.deflateInit2 = ct, c.deflateReset = nt, c.deflateResetKeep = ot, c.deflateSetHeader = function(r, N) {
          return r && r.state ? r.state.wrap !== 2 ? m : (r.state.gzhead = N, h) : m;
        }, c.deflate = function(r, N) {
          var B, k, b, E;
          if (!r || !r.state || 5 < N || N < 0) return r ? et(r, m) : m;
          if (k = r.state, !r.output || !r.input && r.avail_in !== 0 || k.status === 666 && N !== _) return et(r, r.avail_out === 0 ? -5 : m);
          if (k.strm = r, B = k.last_flush, k.last_flush = N, k.status === S) if (k.wrap === 2) r.adler = 0, G(k, 31), G(k, 139), G(k, 8), k.gzhead ? (G(k, (k.gzhead.text ? 1 : 0) + (k.gzhead.hcrc ? 2 : 0) + (k.gzhead.extra ? 4 : 0) + (k.gzhead.name ? 8 : 0) + (k.gzhead.comment ? 16 : 0)), G(k, 255 & k.gzhead.time), G(k, k.gzhead.time >> 8 & 255), G(k, k.gzhead.time >> 16 & 255), G(k, k.gzhead.time >> 24 & 255), G(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), G(k, 255 & k.gzhead.os), k.gzhead.extra && k.gzhead.extra.length && (G(k, 255 & k.gzhead.extra.length), G(k, k.gzhead.extra.length >> 8 & 255)), k.gzhead.hcrc && (r.adler = v(r.adler, k.pending_buf, k.pending, 0)), k.gzindex = 0, k.status = 69) : (G(k, 0), G(k, 0), G(k, 0), G(k, 0), G(k, 0), G(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), G(k, 3), k.status = F);
          else {
            var W = w + (k.w_bits - 8 << 4) << 8;
            W |= (2 <= k.strategy || k.level < 2 ? 0 : k.level < 6 ? 1 : k.level === 6 ? 2 : 3) << 6, k.strstart !== 0 && (W |= 32), W += 31 - W % 31, k.status = F, V(k, W), k.strstart !== 0 && (V(k, r.adler >>> 16), V(k, 65535 & r.adler)), r.adler = 1;
          }
          if (k.status === 69) if (k.gzhead.extra) {
            for (b = k.pending; k.gzindex < (65535 & k.gzhead.extra.length) && (k.pending !== k.pending_buf_size || (k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), M(r), b = k.pending, k.pending !== k.pending_buf_size)); ) G(k, 255 & k.gzhead.extra[k.gzindex]), k.gzindex++;
            k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), k.gzindex === k.gzhead.extra.length && (k.gzindex = 0, k.status = 73);
          } else k.status = 73;
          if (k.status === 73) if (k.gzhead.name) {
            b = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), M(r), b = k.pending, k.pending === k.pending_buf_size)) {
                E = 1;
                break;
              }
              E = k.gzindex < k.gzhead.name.length ? 255 & k.gzhead.name.charCodeAt(k.gzindex++) : 0, G(k, E);
            } while (E !== 0);
            k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), E === 0 && (k.gzindex = 0, k.status = 91);
          } else k.status = 91;
          if (k.status === 91) if (k.gzhead.comment) {
            b = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), M(r), b = k.pending, k.pending === k.pending_buf_size)) {
                E = 1;
                break;
              }
              E = k.gzindex < k.gzhead.comment.length ? 255 & k.gzhead.comment.charCodeAt(k.gzindex++) : 0, G(k, E);
            } while (E !== 0);
            k.gzhead.hcrc && k.pending > b && (r.adler = v(r.adler, k.pending_buf, k.pending - b, b)), E === 0 && (k.status = 103);
          } else k.status = 103;
          if (k.status === 103 && (k.gzhead.hcrc ? (k.pending + 2 > k.pending_buf_size && M(r), k.pending + 2 <= k.pending_buf_size && (G(k, 255 & r.adler), G(k, r.adler >> 8 & 255), r.adler = 0, k.status = F)) : k.status = F), k.pending !== 0) {
            if (M(r), r.avail_out === 0) return k.last_flush = -1, h;
          } else if (r.avail_in === 0 && C(N) <= C(B) && N !== _) return et(r, -5);
          if (k.status === 666 && r.avail_in !== 0) return et(r, -5);
          if (r.avail_in !== 0 || k.lookahead !== 0 || N !== u && k.status !== 666) {
            var X = k.strategy === 2 ? (function(I, Y) {
              for (var H; ; ) {
                if (I.lookahead === 0 && (it(I), I.lookahead === 0)) {
                  if (Y === u) return l;
                  break;
                }
                if (I.match_length = 0, H = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++, H && (z(I, !1), I.strm.avail_out === 0)) return l;
              }
              return I.insert = 0, Y === _ ? (z(I, !0), I.strm.avail_out === 0 ? Q : $) : I.last_lit && (z(I, !1), I.strm.avail_out === 0) ? l : D;
            })(k, N) : k.strategy === 3 ? (function(I, Y) {
              for (var H, q, J, ht, at = I.window; ; ) {
                if (I.lookahead <= j) {
                  if (it(I), I.lookahead <= j && Y === u) return l;
                  if (I.lookahead === 0) break;
                }
                if (I.match_length = 0, I.lookahead >= T && 0 < I.strstart && (q = at[J = I.strstart - 1]) === at[++J] && q === at[++J] && q === at[++J]) {
                  ht = I.strstart + j;
                  do
                    ;
                  while (q === at[++J] && q === at[++J] && q === at[++J] && q === at[++J] && q === at[++J] && q === at[++J] && q === at[++J] && q === at[++J] && J < ht);
                  I.match_length = j - (ht - J), I.match_length > I.lookahead && (I.match_length = I.lookahead);
                }
                if (I.match_length >= T ? (H = n._tr_tally(I, 1, I.match_length - T), I.lookahead -= I.match_length, I.strstart += I.match_length, I.match_length = 0) : (H = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++), H && (z(I, !1), I.strm.avail_out === 0)) return l;
              }
              return I.insert = 0, Y === _ ? (z(I, !0), I.strm.avail_out === 0 ? Q : $) : I.last_lit && (z(I, !1), I.strm.avail_out === 0) ? l : D;
            })(k, N) : i[k.level].func(k, N);
            if (X !== Q && X !== $ || (k.status = 666), X === l || X === Q) return r.avail_out === 0 && (k.last_flush = -1), h;
            if (X === D && (N === 1 ? n._tr_align(k) : N !== 5 && (n._tr_stored_block(k, 0, 0, !1), N === 3 && (Z(k.head), k.lookahead === 0 && (k.strstart = 0, k.block_start = 0, k.insert = 0))), M(r), r.avail_out === 0)) return k.last_flush = -1, h;
          }
          return N !== _ ? h : k.wrap <= 0 ? 1 : (k.wrap === 2 ? (G(k, 255 & r.adler), G(k, r.adler >> 8 & 255), G(k, r.adler >> 16 & 255), G(k, r.adler >> 24 & 255), G(k, 255 & r.total_in), G(k, r.total_in >> 8 & 255), G(k, r.total_in >> 16 & 255), G(k, r.total_in >> 24 & 255)) : (V(k, r.adler >>> 16), V(k, 65535 & r.adler)), M(r), 0 < k.wrap && (k.wrap = -k.wrap), k.pending !== 0 ? h : 1);
        }, c.deflateEnd = function(r) {
          var N;
          return r && r.state ? (N = r.state.status) !== S && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== F && N !== 666 ? et(r, m) : (r.state = null, N === F ? et(r, -3) : h) : m;
        }, c.deflateSetDictionary = function(r, N) {
          var B, k, b, E, W, X, I, Y, H = N.length;
          if (!r || !r.state || (E = (B = r.state).wrap) === 2 || E === 1 && B.status !== S || B.lookahead) return m;
          for (E === 1 && (r.adler = d(r.adler, N, H, 0)), B.wrap = 0, H >= B.w_size && (E === 0 && (Z(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), Y = new s.Buf8(B.w_size), s.arraySet(Y, N, H - B.w_size, B.w_size, 0), N = Y, H = B.w_size), W = r.avail_in, X = r.next_in, I = r.input, r.avail_in = H, r.next_in = 0, r.input = N, it(B); B.lookahead >= T; ) {
            for (k = B.strstart, b = B.lookahead - (T - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[k + T - 1]) & B.hash_mask, B.prev[k & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = k, k++, --b; ) ;
            B.strstart = k, B.lookahead = T - 1, it(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = T - 1, B.match_available = 0, r.next_in = X, r.input = I, r.avail_in = W, B.wrap = E, h;
        }, c.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, o, c) {
        o.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, o, c) {
        o.exports = function(i, s) {
          var n, d, v, y, u, _, h, m, a, p, f, w, R, x, A, P, O, L, T, j, K, S, F, l, D;
          n = i.state, d = i.next_in, l = i.input, v = d + (i.avail_in - 5), y = i.next_out, D = i.output, u = y - (s - i.avail_out), _ = y + (i.avail_out - 257), h = n.dmax, m = n.wsize, a = n.whave, p = n.wnext, f = n.window, w = n.hold, R = n.bits, x = n.lencode, A = n.distcode, P = (1 << n.lenbits) - 1, O = (1 << n.distbits) - 1;
          t: do {
            R < 15 && (w += l[d++] << R, R += 8, w += l[d++] << R, R += 8), L = x[w & P];
            e: for (; ; ) {
              if (w >>>= T = L >>> 24, R -= T, (T = L >>> 16 & 255) === 0) D[y++] = 65535 & L;
              else {
                if (!(16 & T)) {
                  if ((64 & T) == 0) {
                    L = x[(65535 & L) + (w & (1 << T) - 1)];
                    continue e;
                  }
                  if (32 & T) {
                    n.mode = 12;
                    break t;
                  }
                  i.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                j = 65535 & L, (T &= 15) && (R < T && (w += l[d++] << R, R += 8), j += w & (1 << T) - 1, w >>>= T, R -= T), R < 15 && (w += l[d++] << R, R += 8, w += l[d++] << R, R += 8), L = A[w & O];
                r: for (; ; ) {
                  if (w >>>= T = L >>> 24, R -= T, !(16 & (T = L >>> 16 & 255))) {
                    if ((64 & T) == 0) {
                      L = A[(65535 & L) + (w & (1 << T) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, R < (T &= 15) && (w += l[d++] << R, (R += 8) < T && (w += l[d++] << R, R += 8)), h < (K += w & (1 << T) - 1)) {
                    i.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (w >>>= T, R -= T, (T = y - u) < K) {
                    if (a < (T = K - T) && n.sane) {
                      i.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (F = f, (S = 0) === p) {
                      if (S += m - T, T < j) {
                        for (j -= T; D[y++] = f[S++], --T; ) ;
                        S = y - K, F = D;
                      }
                    } else if (p < T) {
                      if (S += m + p - T, (T -= p) < j) {
                        for (j -= T; D[y++] = f[S++], --T; ) ;
                        if (S = 0, p < j) {
                          for (j -= T = p; D[y++] = f[S++], --T; ) ;
                          S = y - K, F = D;
                        }
                      }
                    } else if (S += p - T, T < j) {
                      for (j -= T; D[y++] = f[S++], --T; ) ;
                      S = y - K, F = D;
                    }
                    for (; 2 < j; ) D[y++] = F[S++], D[y++] = F[S++], D[y++] = F[S++], j -= 3;
                    j && (D[y++] = F[S++], 1 < j && (D[y++] = F[S++]));
                  } else {
                    for (S = y - K; D[y++] = D[S++], D[y++] = D[S++], D[y++] = D[S++], 2 < (j -= 3); ) ;
                    j && (D[y++] = D[S++], 1 < j && (D[y++] = D[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (d < v && y < _);
          d -= j = R >> 3, w &= (1 << (R -= j << 3)) - 1, i.next_in = d, i.next_out = y, i.avail_in = d < v ? v - d + 5 : 5 - (d - v), i.avail_out = y < _ ? _ - y + 257 : 257 - (y - _), n.hold = w, n.bits = R;
        };
      }, {}], 49: [function(e, o, c) {
        var i = e("../utils/common"), s = e("./adler32"), n = e("./crc32"), d = e("./inffast"), v = e("./inftrees"), y = 1, u = 2, _ = 0, h = -2, m = 1, a = 852, p = 592;
        function f(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function w() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function R(S) {
          var F;
          return S && S.state ? (F = S.state, S.total_in = S.total_out = F.total = 0, S.msg = "", F.wrap && (S.adler = 1 & F.wrap), F.mode = m, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new i.Buf32(a), F.distcode = F.distdyn = new i.Buf32(p), F.sane = 1, F.back = -1, _) : h;
        }
        function x(S) {
          var F;
          return S && S.state ? ((F = S.state).wsize = 0, F.whave = 0, F.wnext = 0, R(S)) : h;
        }
        function A(S, F) {
          var l, D;
          return S && S.state ? (D = S.state, F < 0 ? (l = 0, F = -F) : (l = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? h : (D.window !== null && D.wbits !== F && (D.window = null), D.wrap = l, D.wbits = F, x(S))) : h;
        }
        function P(S, F) {
          var l, D;
          return S ? (D = new w(), (S.state = D).window = null, (l = A(S, F)) !== _ && (S.state = null), l) : h;
        }
        var O, L, T = !0;
        function j(S) {
          if (T) {
            var F;
            for (O = new i.Buf32(512), L = new i.Buf32(32), F = 0; F < 144; ) S.lens[F++] = 8;
            for (; F < 256; ) S.lens[F++] = 9;
            for (; F < 280; ) S.lens[F++] = 7;
            for (; F < 288; ) S.lens[F++] = 8;
            for (v(y, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), F = 0; F < 32; ) S.lens[F++] = 5;
            v(u, S.lens, 0, 32, L, 0, S.work, { bits: 5 }), T = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = L, S.distbits = 5;
        }
        function K(S, F, l, D) {
          var Q, $ = S.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new i.Buf8($.wsize)), D >= $.wsize ? (i.arraySet($.window, F, l - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (D < (Q = $.wsize - $.wnext) && (Q = D), i.arraySet($.window, F, l - D, Q, $.wnext), (D -= Q) ? (i.arraySet($.window, F, l - D, D, 0), $.wnext = D, $.whave = $.wsize) : ($.wnext += Q, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += Q))), 0;
        }
        c.inflateReset = x, c.inflateReset2 = A, c.inflateResetKeep = R, c.inflateInit = function(S) {
          return P(S, 15);
        }, c.inflateInit2 = P, c.inflate = function(S, F) {
          var l, D, Q, $, et, C, Z, M, z, G, V, U, it, lt, tt, rt, st, ot, nt, ct, r, N, B, k, b = 0, E = new i.Buf8(4), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return h;
          (l = S.state).mode === 12 && (l.mode = 13), et = S.next_out, Q = S.output, Z = S.avail_out, $ = S.next_in, D = S.input, C = S.avail_in, M = l.hold, z = l.bits, G = C, V = Z, N = _;
          t: for (; ; ) switch (l.mode) {
            case m:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if (2 & l.wrap && M === 35615) {
                E[l.check = 0] = 255 & M, E[1] = M >>> 8 & 255, l.check = n(l.check, E, 2, 0), z = M = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & M) << 8) + (M >> 8)) % 31) {
                S.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & M) != 8) {
                S.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (z -= 4, r = 8 + (15 & (M >>>= 4)), l.wbits === 0) l.wbits = r;
              else if (r > l.wbits) {
                S.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << r, S.adler = l.check = 1, l.mode = 512 & M ? 10 : 12, z = M = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if (l.flags = M, (255 & l.flags) != 8) {
                S.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                S.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = M >> 8 & 1), 512 & l.flags && (E[0] = 255 & M, E[1] = M >>> 8 & 255, l.check = n(l.check, E, 2, 0)), z = M = 0, l.mode = 3;
            case 3:
              for (; z < 32; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              l.head && (l.head.time = M), 512 & l.flags && (E[0] = 255 & M, E[1] = M >>> 8 & 255, E[2] = M >>> 16 & 255, E[3] = M >>> 24 & 255, l.check = n(l.check, E, 4, 0)), z = M = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & M, l.head.os = M >> 8), 512 & l.flags && (E[0] = 255 & M, E[1] = M >>> 8 & 255, l.check = n(l.check, E, 2, 0)), z = M = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                l.length = M, l.head && (l.head.extra_len = M), 512 & l.flags && (E[0] = 255 & M, E[1] = M >>> 8 & 255, l.check = n(l.check, E, 2, 0)), z = M = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (C < (U = l.length) && (U = C), U && (l.head && (r = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), i.arraySet(l.head.extra, D, $, U, r)), 512 & l.flags && (l.check = n(l.check, D, U, $)), C -= U, $ += U, l.length -= U), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (C === 0) break t;
                for (U = 0; r = D[$ + U++], l.head && r && l.length < 65536 && (l.head.name += String.fromCharCode(r)), r && U < C; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, U, $)), C -= U, $ += U, r) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (C === 0) break t;
                for (U = 0; r = D[$ + U++], l.head && r && l.length < 65536 && (l.head.comment += String.fromCharCode(r)), r && U < C; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, U, $)), C -= U, $ += U, r) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                if (M !== (65535 & l.check)) {
                  S.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                z = M = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), S.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; z < 32; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              S.adler = l.check = f(M), z = M = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return S.next_out = et, S.avail_out = Z, S.next_in = $, S.avail_in = C, l.hold = M, l.bits = z, 2;
              S.adler = l.check = 1, l.mode = 12;
            case 12:
              if (F === 5 || F === 6) break t;
            case 13:
              if (l.last) {
                M >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              switch (l.last = 1 & M, z -= 1, 3 & (M >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (j(l), l.mode = 20, F !== 6) break;
                  M >>>= 2, z -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", l.mode = 30;
              }
              M >>>= 2, z -= 2;
              break;
            case 14:
              for (M >>>= 7 & z, z -= 7 & z; z < 32; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if ((65535 & M) != (M >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & M, z = M = 0, l.mode = 15, F === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (U = l.length) {
                if (C < U && (U = C), Z < U && (U = Z), U === 0) break t;
                i.arraySet(Q, D, $, U, et), C -= U, $ += U, Z -= U, et += U, l.length -= U;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if (l.nlen = 257 + (31 & M), M >>>= 5, z -= 5, l.ndist = 1 + (31 & M), M >>>= 5, z -= 5, l.ncode = 4 + (15 & M), M >>>= 4, z -= 4, 286 < l.nlen || 30 < l.ndist) {
                S.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; z < 3; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                l.lens[W[l.have++]] = 7 & M, M >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[W[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, B = { bits: l.lenbits }, N = v(0, l.lens, 0, 19, l.lencode, 0, l.work, B), l.lenbits = B.bits, N) {
                S.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; rt = (b = l.lencode[M & (1 << l.lenbits) - 1]) >>> 16 & 255, st = 65535 & b, !((tt = b >>> 24) <= z); ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                if (st < 16) M >>>= tt, z -= tt, l.lens[l.have++] = st;
                else {
                  if (st === 16) {
                    for (k = tt + 2; z < k; ) {
                      if (C === 0) break t;
                      C--, M += D[$++] << z, z += 8;
                    }
                    if (M >>>= tt, z -= tt, l.have === 0) {
                      S.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    r = l.lens[l.have - 1], U = 3 + (3 & M), M >>>= 2, z -= 2;
                  } else if (st === 17) {
                    for (k = tt + 3; z < k; ) {
                      if (C === 0) break t;
                      C--, M += D[$++] << z, z += 8;
                    }
                    z -= tt, r = 0, U = 3 + (7 & (M >>>= tt)), M >>>= 3, z -= 3;
                  } else {
                    for (k = tt + 7; z < k; ) {
                      if (C === 0) break t;
                      C--, M += D[$++] << z, z += 8;
                    }
                    z -= tt, r = 0, U = 11 + (127 & (M >>>= tt)), M >>>= 7, z -= 7;
                  }
                  if (l.have + U > l.nlen + l.ndist) {
                    S.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; U--; ) l.lens[l.have++] = r;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, B = { bits: l.lenbits }, N = v(y, l.lens, 0, l.nlen, l.lencode, 0, l.work, B), l.lenbits = B.bits, N) {
                S.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, B = { bits: l.distbits }, N = v(u, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, B), l.distbits = B.bits, N) {
                S.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, F === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= C && 258 <= Z) {
                S.next_out = et, S.avail_out = Z, S.next_in = $, S.avail_in = C, l.hold = M, l.bits = z, d(S, V), et = S.next_out, Q = S.output, Z = S.avail_out, $ = S.next_in, D = S.input, C = S.avail_in, M = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; rt = (b = l.lencode[M & (1 << l.lenbits) - 1]) >>> 16 & 255, st = 65535 & b, !((tt = b >>> 24) <= z); ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if (rt && (240 & rt) == 0) {
                for (ot = tt, nt = rt, ct = st; rt = (b = l.lencode[ct + ((M & (1 << ot + nt) - 1) >> ot)]) >>> 16 & 255, st = 65535 & b, !(ot + (tt = b >>> 24) <= z); ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                M >>>= ot, z -= ot, l.back += ot;
              }
              if (M >>>= tt, z -= tt, l.back += tt, l.length = st, rt === 0) {
                l.mode = 26;
                break;
              }
              if (32 & rt) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & rt) {
                S.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & rt, l.mode = 22;
            case 22:
              if (l.extra) {
                for (k = l.extra; z < k; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                l.length += M & (1 << l.extra) - 1, M >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; rt = (b = l.distcode[M & (1 << l.distbits) - 1]) >>> 16 & 255, st = 65535 & b, !((tt = b >>> 24) <= z); ) {
                if (C === 0) break t;
                C--, M += D[$++] << z, z += 8;
              }
              if ((240 & rt) == 0) {
                for (ot = tt, nt = rt, ct = st; rt = (b = l.distcode[ct + ((M & (1 << ot + nt) - 1) >> ot)]) >>> 16 & 255, st = 65535 & b, !(ot + (tt = b >>> 24) <= z); ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                M >>>= ot, z -= ot, l.back += ot;
              }
              if (M >>>= tt, z -= tt, l.back += tt, 64 & rt) {
                S.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = st, l.extra = 15 & rt, l.mode = 24;
            case 24:
              if (l.extra) {
                for (k = l.extra; z < k; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                l.offset += M & (1 << l.extra) - 1, M >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                S.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (Z === 0) break t;
              if (U = V - Z, l.offset > U) {
                if ((U = l.offset - U) > l.whave && l.sane) {
                  S.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                it = U > l.wnext ? (U -= l.wnext, l.wsize - U) : l.wnext - U, U > l.length && (U = l.length), lt = l.window;
              } else lt = Q, it = et - l.offset, U = l.length;
              for (Z < U && (U = Z), Z -= U, l.length -= U; Q[et++] = lt[it++], --U; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (Z === 0) break t;
              Q[et++] = l.length, Z--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; z < 32; ) {
                  if (C === 0) break t;
                  C--, M |= D[$++] << z, z += 8;
                }
                if (V -= Z, S.total_out += V, l.total += V, V && (S.adler = l.check = l.flags ? n(l.check, Q, V, et - V) : s(l.check, Q, V, et - V)), V = Z, (l.flags ? M : f(M)) !== l.check) {
                  S.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                z = M = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; z < 32; ) {
                  if (C === 0) break t;
                  C--, M += D[$++] << z, z += 8;
                }
                if (M !== (4294967295 & l.total)) {
                  S.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                z = M = 0;
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
          return S.next_out = et, S.avail_out = Z, S.next_in = $, S.avail_in = C, l.hold = M, l.bits = z, (l.wsize || V !== S.avail_out && l.mode < 30 && (l.mode < 27 || F !== 4)) && K(S, S.output, S.next_out, V - S.avail_out) ? (l.mode = 31, -4) : (G -= S.avail_in, V -= S.avail_out, S.total_in += G, S.total_out += V, l.total += V, l.wrap && V && (S.adler = l.check = l.flags ? n(l.check, Q, V, S.next_out - V) : s(l.check, Q, V, S.next_out - V)), S.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (G == 0 && V === 0 || F === 4) && N === _ && (N = -5), N);
        }, c.inflateEnd = function(S) {
          if (!S || !S.state) return h;
          var F = S.state;
          return F.window && (F.window = null), S.state = null, _;
        }, c.inflateGetHeader = function(S, F) {
          var l;
          return S && S.state ? (2 & (l = S.state).wrap) == 0 ? h : ((l.head = F).done = !1, _) : h;
        }, c.inflateSetDictionary = function(S, F) {
          var l, D = F.length;
          return S && S.state ? (l = S.state).wrap !== 0 && l.mode !== 11 ? h : l.mode === 11 && s(1, F, D, 0) !== l.check ? -3 : K(S, F, D, D) ? (l.mode = 31, -4) : (l.havedict = 1, _) : h;
        }, c.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, o, c) {
        var i = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], d = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        o.exports = function(y, u, _, h, m, a, p, f) {
          var w, R, x, A, P, O, L, T, j, K = f.bits, S = 0, F = 0, l = 0, D = 0, Q = 0, $ = 0, et = 0, C = 0, Z = 0, M = 0, z = null, G = 0, V = new i.Buf16(16), U = new i.Buf16(16), it = null, lt = 0;
          for (S = 0; S <= 15; S++) V[S] = 0;
          for (F = 0; F < h; F++) V[u[_ + F]]++;
          for (Q = K, D = 15; 1 <= D && V[D] === 0; D--) ;
          if (D < Q && (Q = D), D === 0) return m[a++] = 20971520, m[a++] = 20971520, f.bits = 1, 0;
          for (l = 1; l < D && V[l] === 0; l++) ;
          for (Q < l && (Q = l), S = C = 1; S <= 15; S++) if (C <<= 1, (C -= V[S]) < 0) return -1;
          if (0 < C && (y === 0 || D !== 1)) return -1;
          for (U[1] = 0, S = 1; S < 15; S++) U[S + 1] = U[S] + V[S];
          for (F = 0; F < h; F++) u[_ + F] !== 0 && (p[U[u[_ + F]]++] = F);
          if (O = y === 0 ? (z = it = p, 19) : y === 1 ? (z = s, G -= 257, it = n, lt -= 257, 256) : (z = d, it = v, -1), S = l, P = a, et = F = M = 0, x = -1, A = (Z = 1 << ($ = Q)) - 1, y === 1 && 852 < Z || y === 2 && 592 < Z) return 1;
          for (; ; ) {
            for (L = S - et, j = p[F] < O ? (T = 0, p[F]) : p[F] > O ? (T = it[lt + p[F]], z[G + p[F]]) : (T = 96, 0), w = 1 << S - et, l = R = 1 << $; m[P + (M >> et) + (R -= w)] = L << 24 | T << 16 | j | 0, R !== 0; ) ;
            for (w = 1 << S - 1; M & w; ) w >>= 1;
            if (w !== 0 ? (M &= w - 1, M += w) : M = 0, F++, --V[S] == 0) {
              if (S === D) break;
              S = u[_ + p[F]];
            }
            if (Q < S && (M & A) !== x) {
              for (et === 0 && (et = Q), P += l, C = 1 << ($ = S - et); $ + et < D && !((C -= V[$ + et]) <= 0); ) $++, C <<= 1;
              if (Z += 1 << $, y === 1 && 852 < Z || y === 2 && 592 < Z) return 1;
              m[x = M & A] = Q << 24 | $ << 16 | P - a | 0;
            }
          }
          return M !== 0 && (m[P + M] = S - et << 24 | 64 << 16 | 0), f.bits = Q, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, o, c) {
        o.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, o, c) {
        var i = e("../utils/common"), s = 0, n = 1;
        function d(b) {
          for (var E = b.length; 0 <= --E; ) b[E] = 0;
        }
        var v = 0, y = 29, u = 256, _ = u + 1 + y, h = 30, m = 19, a = 2 * _ + 1, p = 15, f = 16, w = 7, R = 256, x = 16, A = 17, P = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (_ + 2));
        d(K);
        var S = new Array(2 * h);
        d(S);
        var F = new Array(512);
        d(F);
        var l = new Array(256);
        d(l);
        var D = new Array(y);
        d(D);
        var Q, $, et, C = new Array(h);
        function Z(b, E, W, X, I) {
          this.static_tree = b, this.extra_bits = E, this.extra_base = W, this.elems = X, this.max_length = I, this.has_stree = b && b.length;
        }
        function M(b, E) {
          this.dyn_tree = b, this.max_code = 0, this.stat_desc = E;
        }
        function z(b) {
          return b < 256 ? F[b] : F[256 + (b >>> 7)];
        }
        function G(b, E) {
          b.pending_buf[b.pending++] = 255 & E, b.pending_buf[b.pending++] = E >>> 8 & 255;
        }
        function V(b, E, W) {
          b.bi_valid > f - W ? (b.bi_buf |= E << b.bi_valid & 65535, G(b, b.bi_buf), b.bi_buf = E >> f - b.bi_valid, b.bi_valid += W - f) : (b.bi_buf |= E << b.bi_valid & 65535, b.bi_valid += W);
        }
        function U(b, E, W) {
          V(b, W[2 * E], W[2 * E + 1]);
        }
        function it(b, E) {
          for (var W = 0; W |= 1 & b, b >>>= 1, W <<= 1, 0 < --E; ) ;
          return W >>> 1;
        }
        function lt(b, E, W) {
          var X, I, Y = new Array(p + 1), H = 0;
          for (X = 1; X <= p; X++) Y[X] = H = H + W[X - 1] << 1;
          for (I = 0; I <= E; I++) {
            var q = b[2 * I + 1];
            q !== 0 && (b[2 * I] = it(Y[q]++, q));
          }
        }
        function tt(b) {
          var E;
          for (E = 0; E < _; E++) b.dyn_ltree[2 * E] = 0;
          for (E = 0; E < h; E++) b.dyn_dtree[2 * E] = 0;
          for (E = 0; E < m; E++) b.bl_tree[2 * E] = 0;
          b.dyn_ltree[2 * R] = 1, b.opt_len = b.static_len = 0, b.last_lit = b.matches = 0;
        }
        function rt(b) {
          8 < b.bi_valid ? G(b, b.bi_buf) : 0 < b.bi_valid && (b.pending_buf[b.pending++] = b.bi_buf), b.bi_buf = 0, b.bi_valid = 0;
        }
        function st(b, E, W, X) {
          var I = 2 * E, Y = 2 * W;
          return b[I] < b[Y] || b[I] === b[Y] && X[E] <= X[W];
        }
        function ot(b, E, W) {
          for (var X = b.heap[W], I = W << 1; I <= b.heap_len && (I < b.heap_len && st(E, b.heap[I + 1], b.heap[I], b.depth) && I++, !st(E, X, b.heap[I], b.depth)); ) b.heap[W] = b.heap[I], W = I, I <<= 1;
          b.heap[W] = X;
        }
        function nt(b, E, W) {
          var X, I, Y, H, q = 0;
          if (b.last_lit !== 0) for (; X = b.pending_buf[b.d_buf + 2 * q] << 8 | b.pending_buf[b.d_buf + 2 * q + 1], I = b.pending_buf[b.l_buf + q], q++, X === 0 ? U(b, I, E) : (U(b, (Y = l[I]) + u + 1, E), (H = O[Y]) !== 0 && V(b, I -= D[Y], H), U(b, Y = z(--X), W), (H = L[Y]) !== 0 && V(b, X -= C[Y], H)), q < b.last_lit; ) ;
          U(b, R, E);
        }
        function ct(b, E) {
          var W, X, I, Y = E.dyn_tree, H = E.stat_desc.static_tree, q = E.stat_desc.has_stree, J = E.stat_desc.elems, ht = -1;
          for (b.heap_len = 0, b.heap_max = a, W = 0; W < J; W++) Y[2 * W] !== 0 ? (b.heap[++b.heap_len] = ht = W, b.depth[W] = 0) : Y[2 * W + 1] = 0;
          for (; b.heap_len < 2; ) Y[2 * (I = b.heap[++b.heap_len] = ht < 2 ? ++ht : 0)] = 1, b.depth[I] = 0, b.opt_len--, q && (b.static_len -= H[2 * I + 1]);
          for (E.max_code = ht, W = b.heap_len >> 1; 1 <= W; W--) ot(b, Y, W);
          for (I = J; W = b.heap[1], b.heap[1] = b.heap[b.heap_len--], ot(b, Y, 1), X = b.heap[1], b.heap[--b.heap_max] = W, b.heap[--b.heap_max] = X, Y[2 * I] = Y[2 * W] + Y[2 * X], b.depth[I] = (b.depth[W] >= b.depth[X] ? b.depth[W] : b.depth[X]) + 1, Y[2 * W + 1] = Y[2 * X + 1] = I, b.heap[1] = I++, ot(b, Y, 1), 2 <= b.heap_len; ) ;
          b.heap[--b.heap_max] = b.heap[1], (function(at, mt) {
            var At, yt, Et, ut, Tt, Ft, _t = mt.dyn_tree, Wt = mt.max_code, ae = mt.stat_desc.static_tree, oe = mt.stat_desc.has_stree, le = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, zt = mt.stat_desc.max_length, Ot = 0;
            for (ut = 0; ut <= p; ut++) at.bl_count[ut] = 0;
            for (_t[2 * at.heap[at.heap_max] + 1] = 0, At = at.heap_max + 1; At < a; At++) zt < (ut = _t[2 * _t[2 * (yt = at.heap[At]) + 1] + 1] + 1) && (ut = zt, Ot++), _t[2 * yt + 1] = ut, Wt < yt || (at.bl_count[ut]++, Tt = 0, jt <= yt && (Tt = le[yt - jt]), Ft = _t[2 * yt], at.opt_len += Ft * (ut + Tt), oe && (at.static_len += Ft * (ae[2 * yt + 1] + Tt)));
            if (Ot !== 0) {
              do {
                for (ut = zt - 1; at.bl_count[ut] === 0; ) ut--;
                at.bl_count[ut]--, at.bl_count[ut + 1] += 2, at.bl_count[zt]--, Ot -= 2;
              } while (0 < Ot);
              for (ut = zt; ut !== 0; ut--) for (yt = at.bl_count[ut]; yt !== 0; ) Wt < (Et = at.heap[--At]) || (_t[2 * Et + 1] !== ut && (at.opt_len += (ut - _t[2 * Et + 1]) * _t[2 * Et], _t[2 * Et + 1] = ut), yt--);
            }
          })(b, E), lt(Y, ht, b.bl_count);
        }
        function r(b, E, W) {
          var X, I, Y = -1, H = E[1], q = 0, J = 7, ht = 4;
          for (H === 0 && (J = 138, ht = 3), E[2 * (W + 1) + 1] = 65535, X = 0; X <= W; X++) I = H, H = E[2 * (X + 1) + 1], ++q < J && I === H || (q < ht ? b.bl_tree[2 * I] += q : I !== 0 ? (I !== Y && b.bl_tree[2 * I]++, b.bl_tree[2 * x]++) : q <= 10 ? b.bl_tree[2 * A]++ : b.bl_tree[2 * P]++, Y = I, ht = (q = 0) === H ? (J = 138, 3) : I === H ? (J = 6, 3) : (J = 7, 4));
        }
        function N(b, E, W) {
          var X, I, Y = -1, H = E[1], q = 0, J = 7, ht = 4;
          for (H === 0 && (J = 138, ht = 3), X = 0; X <= W; X++) if (I = H, H = E[2 * (X + 1) + 1], !(++q < J && I === H)) {
            if (q < ht) for (; U(b, I, b.bl_tree), --q != 0; ) ;
            else I !== 0 ? (I !== Y && (U(b, I, b.bl_tree), q--), U(b, x, b.bl_tree), V(b, q - 3, 2)) : q <= 10 ? (U(b, A, b.bl_tree), V(b, q - 3, 3)) : (U(b, P, b.bl_tree), V(b, q - 11, 7));
            Y = I, ht = (q = 0) === H ? (J = 138, 3) : I === H ? (J = 6, 3) : (J = 7, 4);
          }
        }
        d(C);
        var B = !1;
        function k(b, E, W, X) {
          V(b, (v << 1) + (X ? 1 : 0), 3), (function(I, Y, H, q) {
            rt(I), G(I, H), G(I, ~H), i.arraySet(I.pending_buf, I.window, Y, H, I.pending), I.pending += H;
          })(b, E, W);
        }
        c._tr_init = function(b) {
          B || ((function() {
            var E, W, X, I, Y, H = new Array(p + 1);
            for (I = X = 0; I < y - 1; I++) for (D[I] = X, E = 0; E < 1 << O[I]; E++) l[X++] = I;
            for (l[X - 1] = I, I = Y = 0; I < 16; I++) for (C[I] = Y, E = 0; E < 1 << L[I]; E++) F[Y++] = I;
            for (Y >>= 7; I < h; I++) for (C[I] = Y << 7, E = 0; E < 1 << L[I] - 7; E++) F[256 + Y++] = I;
            for (W = 0; W <= p; W++) H[W] = 0;
            for (E = 0; E <= 143; ) K[2 * E + 1] = 8, E++, H[8]++;
            for (; E <= 255; ) K[2 * E + 1] = 9, E++, H[9]++;
            for (; E <= 279; ) K[2 * E + 1] = 7, E++, H[7]++;
            for (; E <= 287; ) K[2 * E + 1] = 8, E++, H[8]++;
            for (lt(K, _ + 1, H), E = 0; E < h; E++) S[2 * E + 1] = 5, S[2 * E] = it(E, 5);
            Q = new Z(K, O, u + 1, _, p), $ = new Z(S, L, 0, h, p), et = new Z(new Array(0), T, 0, m, w);
          })(), B = !0), b.l_desc = new M(b.dyn_ltree, Q), b.d_desc = new M(b.dyn_dtree, $), b.bl_desc = new M(b.bl_tree, et), b.bi_buf = 0, b.bi_valid = 0, tt(b);
        }, c._tr_stored_block = k, c._tr_flush_block = function(b, E, W, X) {
          var I, Y, H = 0;
          0 < b.level ? (b.strm.data_type === 2 && (b.strm.data_type = (function(q) {
            var J, ht = 4093624447;
            for (J = 0; J <= 31; J++, ht >>>= 1) if (1 & ht && q.dyn_ltree[2 * J] !== 0) return s;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return n;
            for (J = 32; J < u; J++) if (q.dyn_ltree[2 * J] !== 0) return n;
            return s;
          })(b)), ct(b, b.l_desc), ct(b, b.d_desc), H = (function(q) {
            var J;
            for (r(q, q.dyn_ltree, q.l_desc.max_code), r(q, q.dyn_dtree, q.d_desc.max_code), ct(q, q.bl_desc), J = m - 1; 3 <= J && q.bl_tree[2 * j[J] + 1] === 0; J--) ;
            return q.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          })(b), I = b.opt_len + 3 + 7 >>> 3, (Y = b.static_len + 3 + 7 >>> 3) <= I && (I = Y)) : I = Y = W + 5, W + 4 <= I && E !== -1 ? k(b, E, W, X) : b.strategy === 4 || Y === I ? (V(b, 2 + (X ? 1 : 0), 3), nt(b, K, S)) : (V(b, 4 + (X ? 1 : 0), 3), (function(q, J, ht, at) {
            var mt;
            for (V(q, J - 257, 5), V(q, ht - 1, 5), V(q, at - 4, 4), mt = 0; mt < at; mt++) V(q, q.bl_tree[2 * j[mt] + 1], 3);
            N(q, q.dyn_ltree, J - 1), N(q, q.dyn_dtree, ht - 1);
          })(b, b.l_desc.max_code + 1, b.d_desc.max_code + 1, H + 1), nt(b, b.dyn_ltree, b.dyn_dtree)), tt(b), X && rt(b);
        }, c._tr_tally = function(b, E, W) {
          return b.pending_buf[b.d_buf + 2 * b.last_lit] = E >>> 8 & 255, b.pending_buf[b.d_buf + 2 * b.last_lit + 1] = 255 & E, b.pending_buf[b.l_buf + b.last_lit] = 255 & W, b.last_lit++, E === 0 ? b.dyn_ltree[2 * W]++ : (b.matches++, E--, b.dyn_ltree[2 * (l[W] + u + 1)]++, b.dyn_dtree[2 * z(E)]++), b.last_lit === b.lit_bufsize - 1;
        }, c._tr_align = function(b) {
          V(b, 2, 3), U(b, R, K), (function(E) {
            E.bi_valid === 16 ? (G(E, E.bi_buf), E.bi_buf = 0, E.bi_valid = 0) : 8 <= E.bi_valid && (E.pending_buf[E.pending++] = 255 & E.bi_buf, E.bi_buf >>= 8, E.bi_valid -= 8);
          })(b);
        };
      }, { "../utils/common": 41 }], 53: [function(e, o, c) {
        o.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, o, c) {
        (function(i) {
          (function(s, n) {
            if (!s.setImmediate) {
              var d, v, y, u, _ = 1, h = {}, m = !1, a = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, d = {}.toString.call(s.process) === "[object process]" ? function(x) {
                process.nextTick(function() {
                  w(x);
                });
              } : (function() {
                if (s.postMessage && !s.importScripts) {
                  var x = !0, A = s.onmessage;
                  return s.onmessage = function() {
                    x = !1;
                  }, s.postMessage("", "*"), s.onmessage = A, x;
                }
              })() ? (u = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", R, !1) : s.attachEvent("onmessage", R), function(x) {
                s.postMessage(u + x, "*");
              }) : s.MessageChannel ? ((y = new MessageChannel()).port1.onmessage = function(x) {
                w(x.data);
              }, function(x) {
                y.port2.postMessage(x);
              }) : a && "onreadystatechange" in a.createElement("script") ? (v = a.documentElement, function(x) {
                var A = a.createElement("script");
                A.onreadystatechange = function() {
                  w(x), A.onreadystatechange = null, v.removeChild(A), A = null;
                }, v.appendChild(A);
              }) : function(x) {
                setTimeout(w, 0, x);
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
            function w(x) {
              if (m) setTimeout(w, 0, x);
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
            function R(x) {
              x.source === s && typeof x.data == "string" && x.data.indexOf(u) === 0 && w(+x.data.slice(u.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var de = he();
const Jt = /* @__PURE__ */ ce(de);
async function ue(g) {
  const t = await fe(g), e = await Jt.loadAsync(t), o = [];
  return e.forEach((c, i) => {
    if (i.dir)
      return;
    const s = me(c);
    o.push({
      name: s,
      text: () => i.async("text"),
      arrayBuffer: () => i.async("arraybuffer")
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
function Xt(g) {
  const t = [], e = g.map((a) => Qt(a).toLowerCase()), o = (a) => e.some(a), c = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, i = /\.(drl|xln)$/i, s = e.filter((a) => c.test(a)).length, n = e.filter((a) => i.test(a) || a.includes("drill")).length, d = o((a) => a.includes("top") && a.includes("copper") || a.endsWith(".gtl")), v = o((a) => a.includes("bot") || a.includes("bottom") || a.endsWith(".gbl")), y = o((a) => a.includes("mask") || a.includes("solder") || a.endsWith(".gts") || a.endsWith(".gbs")), u = o((a) => a.includes("silk") || a.includes("legend") || a.endsWith(".gto") || a.endsWith(".gbo")), _ = o((a) => a.includes("outline") || a.includes("profile") || a.includes("edge") || a.endsWith(".gko") || a.endsWith(".gm1") || a.endsWith(".gml")), h = e.every(
    (a) => a.endsWith(".pdf") || a.endsWith(".png") || a.endsWith(".jpg") || a.endsWith(".jpeg") || a.endsWith(".svg") || a.endsWith(".txt") || a.endsWith(".md")
  );
  let m = 0;
  return g.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : h ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (s > 0 ? (m += 0.35, t.push(`Found ${s} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (m += 0.2, t.push(`Found ${n} drill-like file(s).`)), _ && (m += 0.15, t.push("Found outline/profile/edge candidate.")), d && v ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (d || v) && (m += 0.1, t.push("Found at least one copper candidate.")), y && (m += 0.05, t.push("Found solder mask candidate.")), u && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && s >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function be(g) {
  if (pe(g)) {
    const i = Object.keys(g).map(Qt), { confidence: s, reasons: n } = Xt(i);
    return {
      isGerber: s >= 0.6,
      archiveType: "directory",
      confidence: s,
      reasons: n,
      files: i
    };
  }
  const t = ge(g), e = _e(t);
  if (e === "zip")
    try {
      const i = ye(t), n = (await ue(i)).map((y) => y.name), { confidence: d, reasons: v } = Xt(n);
      return {
        isGerber: d >= 0.6,
        archiveType: "zip",
        confidence: d,
        reasons: v,
        files: n
      };
    } catch (i) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(i)]
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
  const e = {}, o = 1e3, c = 100 * 1024 * 1024, i = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (i.length > o)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${i.length} > ${o})`
    );
  let s = 0;
  for (const [n, d] of i)
    try {
      const v = te(n), y = await d.async("arraybuffer");
      if (s += y.byteLength, s > c)
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
  const i = {};
  let s = 0;
  const n = 1e3, d = 100 * 1024 * 1024;
  let v = 0;
  async function y(u, _) {
    if (s >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const h of Object.keys(u)) {
      const m = u[h], a = _ ? `${_}/${h}` : h;
      if (m instanceof File || m instanceof Blob) {
        s++;
        try {
          const p = await m.arrayBuffer();
          if (v += p.byteLength, v > d)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${d} bytes)`
            );
          i[te(a)] = new Uint8Array(p);
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
  if (Object.keys(i).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return i;
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
  } catch (i) {
    throw new ft("PARSE_ERROR", "Failed to detect archive type", i);
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
  } catch (i) {
    throw i instanceof ft ? i : new ft(
      "PARSE_ERROR",
      i instanceof Error ? i.message : "Unknown error during extraction",
      { error: i, det: c }
    );
  }
}
function Lt(g) {
  return g.toLowerCase();
}
function vt(g, t) {
  const e = new Set(t.map((c) => c.toLowerCase()));
  return g.filter((c) => {
    const i = Lt(c), s = i.lastIndexOf(".");
    return s < 0 ? !1 : e.has(i.slice(s));
  }).sort((c, i) => c.length - i.length)[0];
}
function dt(g, t) {
  const e = t.map((c) => c.toLowerCase());
  return g.filter((c) => {
    const i = Lt(c);
    return e.every((s) => i.includes(s));
  }).sort((c, i) => c.length - i.length)[0];
}
function xe(g) {
  const t = g.filter((y) => {
    const u = Lt(y);
    return !(u.endsWith("/") || u.includes("__macosx") || u.endsWith(".ds_store"));
  }), e = vt(t, [".gtl"]) || dt(t, ["f_cu"]) || dt(t, ["top", "cu"]) || dt(t, ["top", "copper"]), o = vt(t, [".gbl"]) || dt(t, ["b_cu"]) || dt(t, ["bottom", "cu"]) || dt(t, ["bottom", "copper"]), c = vt(t, [".gts"]) || dt(t, ["f_mask"]) || dt(t, ["top", "mask"]), i = vt(t, [".gbs"]) || dt(t, ["b_mask"]) || dt(t, ["bottom", "mask"]), s = vt(t, [".gto"]) || dt(t, ["f_silks"]) || dt(t, ["f_silk"]) || dt(t, ["top", "silk"]), n = vt(t, [".gbo"]) || dt(t, ["b_silks"]) || dt(t, ["b_silk"]) || dt(t, ["bottom", "silk"]), d = vt(t, [".gko", ".gm1"]) || dt(t, ["edge", "cuts"]) || dt(t, ["outline"]) || dt(t, ["board", "outline"]), v = (
    // Excellon often .drl or .xln or .txt
    vt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    dt(t, ["drill"]) || dt(t, ["drills"]) || dt(t, ["npth"]) || dt(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: o,
    top_mask: c,
    bottom_mask: i,
    top_silk: s,
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
  for (const i of c) {
    let s = i.trim();
    if (s && !s.startsWith("G04")) {
      if (s.startsWith("%") && s.endsWith("%")) {
        Re(s, o);
        continue;
      }
      s.endsWith("*") && (s = s.slice(0, -1)), Ae(s, o);
    }
  }
  if (o.inRegion) {
    if (o.currentPath.length >= 3 && o.regionPaths.push(o.currentPath), o.regionPaths.length > 0) {
      const i = {
        loops: o.regionPaths,
        polarity: o.currentPolarity
      };
      o.regions.push(i), o.ops.push({
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
      const c = parseInt(o[1], 10), i = parseInt(o[2], 10);
      parseInt(o[4], 10), t.fmtInt = c, t.fmtDec = i;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const o = t.unitScale;
    let c = o;
    if (e.includes("MOMM") ? c = 1 : e.includes("MOIN") && (c = 25.4), c !== o) {
      const i = c / o;
      for (const s of t.apertures.values())
        s.diameterMm !== void 0 && (s.diameterMm *= i), s.widthMm !== void 0 && (s.widthMm *= i), s.heightMm !== void 0 && (s.heightMm *= i);
      t.unitScale = c;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const o = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(e);
    if (!o) return;
    const c = parseInt(o[2], 10), i = o[3], s = o[4] ?? "";
    let n, d, v;
    if (s) {
      const u = s.split(/[Xx]/), _ = u[0] ? parseFloat(u[0]) * t.unitScale : void 0, h = u[1] ? parseFloat(u[1]) * t.unitScale : void 0;
      i === "C" ? n = _ : i === "R" || i === "O" ? (d = _, v = h, _ !== void 0 && h !== void 0 ? n = Math.min(_, h) : n = _ ?? h) : n = _ ?? h;
    }
    const y = {
      code: c,
      shape: i,
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
  const c = /X([+\-]?\d+)/.exec(g), i = /Y([+\-]?\d+)/.exec(g);
  let s = t.x, n = t.y;
  if (c && (s = Yt(c[1], t)), i && (n = Yt(i[1], t)), e === null) {
    t.x = s, t.y = n;
    return;
  }
  if (t.inRegion) {
    const y = t.x, u = t.y;
    e === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: y, y: u }), t.currentPath.push({ x: s, y: n })) : e === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = s, t.y = n;
    return;
  }
  const d = t.x, v = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = s, t.y = n;
      return;
    }
    const y = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: d, y: v },
      end: { x: s, y: n },
      width: y,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: d, y: v },
      end: { x: s, y: n },
      widthMm: y
    }), t.x = s, t.y = n;
    return;
  }
  if (e === 2) {
    t.x = s, t.y = n;
    return;
  }
  if (e === 3) {
    if (t.currentAperture) {
      const y = t.currentAperture, u = y.diameterMm !== void 0 ? y.diameterMm : Se, _ = {
        position: { x: s, y: n },
        diameterMm: u,
        shape: y.shape,
        polarity: t.currentPolarity
      };
      y.widthMm !== void 0 && (_.widthMm = y.widthMm), y.heightMm !== void 0 && (_.heightMm = y.heightMm), t.flashes.push(_), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: s, y: n },
        diameterMm: u,
        shape: y.shape,
        widthMm: y.widthMm,
        heightMm: y.heightMm
      });
    }
    t.x = s, t.y = n;
    return;
  }
}
function Yt(g, t) {
  const e = g.startsWith("-") ? -1 : 1, o = g.replace(/[+\-]/g, ""), c = parseInt(o, 10);
  if (Number.isNaN(c)) return 0;
  const i = Math.pow(10, t.fmtDec), s = c / i * t.unitScale;
  return e * s;
}
function Ee(g, t) {
  const e = t.split(/\r?\n/), o = /* @__PURE__ */ new Map();
  let c = null;
  const i = [];
  for (const s of e) {
    const n = s.trim();
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
        i.push({
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
    holes: i
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
  for (const i of g.loops)
    for (const s of i)
      t = Math.min(t, s.x), e = Math.min(e, s.y), o = Math.max(o, s.x), c = Math.max(c, s.y);
  return { minX: t, minY: e, maxX: o, maxY: c };
}
function Oe(g, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let o = 0, c = 0;
  for (const y of g.regions) {
    const u = ie(y), _ = (u.maxX - u.minX) * (u.maxY - u.minY);
    y.polarity === "clear" ? c = Math.max(c, _) : o = Math.max(o, _);
  }
  const i = g.tracks.filter((y) => y.polarity !== "clear").length + g.flashes.filter((y) => y.polarity !== "clear").length + g.regions.filter((y) => y.polarity !== "clear").length, s = g.tracks.filter((y) => y.polarity === "clear").length + g.flashes.filter((y) => y.polarity === "clear").length + g.regions.filter((y) => y.polarity === "clear").length, n = o > e * 0.7, d = s > i * 3, v = c > e * 0.7;
  return n ? !1 : d || v;
}
function Vt(g, t, e, o) {
  const c = t.maxX - t.minX, i = t.maxY - t.minY, s = Math.max(1, Math.round(gt(c))), n = Math.max(1, Math.round(gt(i))), d = gt(1), v = Oe(g, t), y = v ? "white" : "black", u = (x, A) => {
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
        const K = P.x - T / 2, S = P.y - j / 2, F = x.shape === "O" ? Math.min(T, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${S.toFixed(2)}" width="${T.toFixed(2)}" height="${j.toFixed(2)}" rx="${F.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
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
  h.push(`<rect x="0" y="0" width="${s}" height="${n}" fill="${y}" fill-opacity="1" />`);
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
  const f = g.tracks.filter((x) => x.polarity !== "clear").length + g.flashes.filter((x) => x.polarity !== "clear").length + g.regions.filter((x) => x.polarity !== "clear").length, w = g.tracks.filter((x) => x.polarity === "clear").length + g.flashes.filter((x) => x.polarity === "clear").length + g.regions.filter((x) => x.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: w,
    largestDarkRegionArea: a,
    largestClearRegionArea: p,
    boardArea: m,
    negative: v
  });
  const R = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${n}" viewBox="0 0 ${s} ${n}">
  <defs>
    <mask id="${R}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${s}" height="${n}" fill="${y}" fill-opacity="1" />
      ${h.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${s}" height="${n}" fill="${e}" opacity="${o}" mask="url(#${R})" />
</svg>`.trim();
}
function qt(g, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.max(1, Math.round(gt(e))), i = Math.max(1, Math.round(gt(o))), s = Math.max(1e-6, gt(1)), n = "rgba(255,255,255,0.95)", d = "rgba(255,255,255,0.95)", v = g.tracks.map((_) => {
    const h = Rt(_.start.x, _.start.y, t), m = Rt(_.end.x, _.end.y, t), a = Number.isFinite(_.width) ? _.width : 0.15, p = Math.max(1, a * s);
    return `<line x1="${(h.x * s).toFixed(2)}" y1="${(h.y * s).toFixed(2)}" x2="${(m.x * s).toFixed(2)}" y2="${(m.y * s).toFixed(2)}" stroke="${n}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), y = g.flashes.map((_) => {
    const h = Rt(_.position.x, _.position.y, t), m = h.x * s, a = h.y * s, p = _.widthMm ?? _.diameterMm ?? 0.6, f = _.heightMm ?? _.diameterMm ?? 0.6;
    if (_.shape === "R" || _.shape === "O") {
      const R = p * s, x = f * s, A = m - R / 2, P = a - x / 2, O = _.shape === "O" ? Math.min(R, x) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${P.toFixed(2)}" width="${R.toFixed(2)}" height="${x.toFixed(2)}" rx="${O.toFixed(2)}" fill="${d}" />`;
    }
    const w = (_.diameterMm ?? 0.6) * s / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${a.toFixed(2)}" r="${Math.max(1, w).toFixed(2)}" fill="${d}" />`;
  }), u = g.regions.map((_) => {
    const h = _.loops.map((m) => {
      if (!m.length) return "";
      const a = Rt(m[0].x, m[0].y, t), p = [`M ${(a.x * s).toFixed(2)} ${(a.y * s).toFixed(2)}`];
      for (let f = 1; f < m.length; f++) {
        const w = Rt(m[f].x, m[f].y, t);
        p.push(`L ${(w.x * s).toFixed(2)} ${(w.y * s).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return h.trim() ? `<path d="${h}" fill="${d}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${i}" viewBox="0 0 ${c} ${i}">
  ${v.join(`
  `)}
  ${y.join(`
  `)}
  ${u.join(`
  `)}
</svg>`.trim();
}
function Be(g, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.round(gt(e)), i = Math.round(gt(o)), s = gt(1), n = g.map((d) => {
    const v = Rt(d.x, d.y, t), y = v.x * s, u = v.y * s, _ = (d.diameter || 0.6) * s / 2;
    return `<circle cx="${y.toFixed(2)}" cy="${u.toFixed(2)}" r="${Math.max(1, _).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${i}" viewBox="0 0 ${c} ${i}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ne(g) {
  const t = Object.keys(g).filter((nt) => !!nt), e = xe(t), o = new TextDecoder("utf-8", { fatal: !1 }), c = async (nt) => {
    if (!nt) return null;
    const ct = g[nt];
    return ct ? o.decode(ct) : null;
  }, i = await c(e.top_copper), s = await c(e.bottom_copper), n = await c(e.outline), d = await c(e.drills), v = await c(e.top_silk), y = await c(e.bottom_silk), u = i ? Mt(e.top_copper || "top", i) : null, _ = s ? Mt(e.bottom_copper || "bot", s) : null, h = n ? Mt(e.outline || "outline", n) : null, m = d ? Ee(e.drills || "drills", d) : null, a = m ? m.holes.map((nt) => ({ x: nt.x, y: nt.y, diameter: nt.diameter })) : [], p = v ? Mt(e.top_silk || "top_silk", v) : null, f = y ? Mt(e.bottom_silk || "bot_silk", y) : null, w = u ? bt(wt(u)) : null, R = _ ? bt(wt(_)) : null, x = h ? bt(wt(h)) : null, A = a.length ? bt(Ie(a)) : null, P = p ? bt(wt(p)) : null, O = f ? bt(wt(f)) : null, L = (x && Ct(x) ? x : null) || (w && Ct(w) ? w : null) || (R && Ct(R) ? R : null) || (A && Ct(A) ? A : null), T = L ? L.maxX - L.minX : 1, j = w ? St(w.maxX - w.minX, T) : 1, K = R ? St(R.maxX - R.minX, T) : 1, S = x ? St(x.maxX - x.minX, T) : 1, F = A ? St(A.maxX - A.minX, T) : 1, l = P ? St(P.maxX - P.minX, T) : 1, D = O ? St(O.maxX - O.minX, T) : 1, Q = u ? It(u, j) : null, $ = _ ? It(_, K) : null, et = h ? It(h, S) : null, C = a.length ? Me(a, F) : [], Z = p ? It(p, l) : null, M = f ? It(f, D) : null;
  let z = null;
  if (et) {
    const nt = bt(wt(et));
    Ct(nt) && (z = nt);
  }
  if (!z) {
    let nt = Ut();
    Q && (nt = Zt(nt, wt(Q))), $ && (nt = Zt(nt, wt($))), nt = bt(nt), z = nt;
  }
  const G = bt(z), V = G.maxX - G.minX, U = G.maxY - G.minY, it = {
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
  }, lt = Math.max(1, Math.round(gt(V))), tt = Math.max(1, Math.round(gt(U))), rt = [], st = (nt) => {
    const ct = Ce(nt);
    return rt.push(ct), ct;
  }, ot = {
    top_board_mask: st(Gt(lt, tt)),
    bottom_board_mask: st(Gt(lt, tt))
  };
  return Q && (ot.top_copper = st(Vt(Q, G, "#fbbf24", 1))), $ && (ot.bottom_copper = st(Vt($, G, "#38bdf8", 1))), C.length && (ot.drills = st(Be(C, G))), Z && (ot.top_silk = st(qt(Z, G))), M && (ot.bottom_silk = st(qt(M, G))), {
    boardGeom: it,
    layers: ot,
    revoke: () => rt.forEach((nt) => URL.revokeObjectURL(nt))
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
    i,
    s,
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
    w,
    R
  ] = t;
  return [
    e * u + o * m + c * f,
    e * _ + o * a + c * w,
    e * h + o * p + c * R,
    i * u + s * m + n * f,
    i * _ + s * a + n * w,
    i * h + s * p + n * R,
    d * u + v * m + y * f,
    d * _ + v * a + y * w,
    d * h + v * p + y * R
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
  const t = g[0], e = g[1], o = g[2], c = g[3], i = g[4], s = g[5], n = t * i - e * c;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const d = 1 / n, v = i * d, y = -e * d, u = -c * d, _ = t * d, h = -(v * o + y * s), m = -(u * o + _ * s);
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
    return Kt(this.worldToScreenMat, t);
  }
  screenToBoard(t) {
    return Kt(this.screenToWorldMat, t);
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: o, zoom: c, rotation_rad: i, mirrorX: s, mirrorY: n } = this.camera, d = { x: t / 2, y: e / 2 }, v = n ? -1 : 1, y = s ? -1 : 1, u = Ht(-o.x, -o.y), _ = Fe(i), h = Pe(c * y, c * v), m = Ht(d.x, d.y), a = Dt(m, Dt(h, Dt(_, u)));
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
    let i = this.cells.get(c);
    i || (i = /* @__PURE__ */ new Set(), this.cells.set(c, i)), i.add(t);
  }
  remove(t, e, o) {
    const { key: c } = this.cellCoord(e, o), i = this.cells.get(c);
    i && (i.delete(t), i.size === 0 && this.cells.delete(c));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, o) {
    const { cx: c, cy: i } = this.cellCoord(t, e), s = Math.ceil(o / this.cellSize_mm), n = [];
    for (let d = -s; d <= s; d++)
      for (let v = -s; v <= s; v++) {
        const y = `${c + d},${i + v}`, u = this.cells.get(y);
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
    const c = this.index.queryRadius(t, e, o), i = [];
    for (const s of c) {
      const n = this.byId.get(s);
      n && i.push(n);
    }
    return i;
  }
}
class $e {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, o, c = 10) {
    const i = t.screenToBoard({ x: e, y: o }), s = t.xform.getCamera().zoom, n = c / s, d = this.store.queryNear(i.x, i.y, n);
    let v = null;
    for (const y of d) {
      const u = t.boardToScreen({ x: y.x_mm, y: y.y_mm }), _ = u.x - e, h = u.y - o, m = Math.sqrt(_ * _ + h * h);
      m <= c && (!v || m < v.distance_px) && (v = { id: y.id, marker: y, distance_px: m });
    }
    return v;
  }
}
class Xe {
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
    for (const i of c) i(e);
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
    this.passes = [], this.overlays = new Ue(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new je(), this.markerPicker = new $e(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Xe(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const o = t.getContext("2d");
    if (!o) throw new Error("Unable to get 2D context");
    this.ctx = o;
    const c = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new De(e, c), this.visibility = new se(), this.scheduler = new Le(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: s }) => {
        const n = this.xform.boardToScreen({ x: i, y: s });
        return { x_px: n.x, y_px: n.y };
      },
      screenToBoard: ({ x_px: i, y_px: s }) => {
        const n = this.xform.screenToBoard({ x: i, y: s });
        return { x_mm: n.x, y_mm: n.y };
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
    const t = this.ctx, e = this.canvas, o = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(o);
    const c = {
      canvas: e,
      ctx: t,
      viewport: o,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      // Use visibility manager
      boardToScreen: (i) => this.xform.boardToScreen({ x: i.x, y: i.y }),
      screenToBoard: (i) => this.xform.screenToBoard({ x: i.x, y: i.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width, e.height);
    for (const i of this.passes)
      if (i.enabled(c)) {
        t.save();
        try {
          i.draw(c);
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
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), c = this.createRenderCtx(), i = this.markerPicker.pick(c, e, o, 10);
    this.setHoverMarker(i?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), c = this.createRenderCtx(), i = this.markerPicker.pick(c, e, o, 10);
    if (i) {
      this.selectMarker(i.id);
      return;
    }
    const s = c.screenToBoard({ x: e, y: o });
    this.emit("click:board", { x_mm: s.x, y_mm: s.y });
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
      const i = c.ctx, s = c.xform.getWorldToScreenMatrix();
      i.setTransform(s[0], s[3], s[1], s[4], s[2], s[5]), o(i);
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
      const c = g.getAll().filter((s) => e.visibility.overlays[s.id] ?? s.visible);
      c.sort((s, n) => s.zIndex - n.zIndex);
      const i = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const s of c)
        e.ctx.save(), s.draw(e.ctx, i), e.ctx.restore();
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
      for (const i of this.markers.values()) {
        const s = t.boardToScreen(i.position);
        s.x < -10 || s.x > t.viewport.width_px + 10 || s.y < -10 || s.y > t.viewport.height_px + 10 || this.drawMarker(e, s, i, o);
      }
    }
  }
  drawMarker(t, e, o, c) {
    const i = Math.max(3, Math.min(8, c / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, i, 0, Math.PI * 2), o.type) {
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
  const o = g.firstElementChild, c = D(o, "#board-viewport"), i = D(o, "#render-canvas"), s = D(o, "#grid-toggle"), n = D(o, "#grid-units"), d = D(o, "#fit-btn"), v = D(o, "#download-btn"), y = Array.from(o.querySelectorAll('input[name="side"]')), u = new Ye(i, {
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
    i.width = C.width * Z, i.height = C.height * Z, i.style.width = `${C.width}px`, i.style.height = `${C.height}px`, u.requestRender("resize");
  }
  const w = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (C, Z) => {
      const { xform: M, view: z } = Z, G = z.zoom, V = n.value, U = V === "mm" ? 1 : 2.54, it = V === "mm" ? 10 : 25.4, lt = U * G, tt = it * G;
      if (lt < 2) return;
      const rt = Z.screenToBoard({ x: 0, y: 0 }), st = Z.screenToBoard({
        x: i.width / (window.devicePixelRatio || 1),
        y: i.height / (window.devicePixelRatio || 1)
      });
      C.setTransform(1, 0, 0, 1, 0, 0), C.strokeStyle = "rgba(59, 130, 246, 0.4)", C.lineWidth = 1, C.beginPath();
      const ot = Math.floor(rt.x / U) * U, nt = Math.floor(rt.y / U) * U;
      for (let ct = ot; ct <= st.x; ct += U) {
        const r = Z.boardToScreen({ x: ct, y: 0 }).x;
        C.moveTo(r, 0), C.lineTo(r, i.height);
      }
      for (let ct = nt; ct <= st.y; ct += U) {
        const r = Z.boardToScreen({ x: 0, y: ct }).y;
        C.moveTo(0, r), C.lineTo(i.width, r);
      }
      if (C.stroke(), tt >= 8) {
        C.strokeStyle = "rgba(59, 130, 246, 0.7)", C.lineWidth = 1.5, C.beginPath();
        const ct = Math.floor(rt.x / it) * it, r = Math.floor(rt.y / it) * it;
        for (let N = ct; N <= st.x; N += it) {
          const B = Z.boardToScreen({ x: N, y: 0 }).x;
          C.moveTo(B, 0), C.lineTo(B, i.height);
        }
        for (let N = r; N <= st.y; N += it) {
          const B = Z.boardToScreen({ x: 0, y: N }).y;
          C.moveTo(0, B), C.lineTo(i.width, B);
        }
        C.stroke();
      }
    }
  };
  h.add(w), _.setOverlayVisibility("grid", !1), _.setMarkersVisibility(!1), u.addPass(Ge(h, u.getOverlayApi())), u.addPass(qe(m)), u.addPass(Ke(a, () => p));
  let R = null, x = {}, A = "top", P = !1;
  function O(C, Z, M) {
    if (!M) return null;
    const z = new Image();
    return z.src = M, z.addEventListener("load", () => {
      u.requestRender(`image-loaded-${C}`);
    }), {
      id: C,
      order: Z,
      enabled: () => !0,
      draw: (G) => {
        if (!z.complete) return;
        const V = G.ctx, U = G.xform.getWorldToScreenMatrix();
        V.setTransform(U[0], U[3], U[1], U[4], U[2], U[5]);
        const it = 25.4, lt = (R?.board?.width_in || 1) * it, tt = (R?.board?.height_in || 1) * it;
        V.drawImage(z, 0, 0, lt, tt);
      }
    };
  }
  function L(C, Z) {
    return {
      id: C,
      order: Z,
      enabled: () => !0,
      draw: (M) => {
        if (!R?.board) return;
        const z = M.ctx, G = M.xform.getWorldToScreenMatrix();
        z.setTransform(G[0], G[3], G[1], G[4], G[2], G[5]);
        const V = (R.board.width_in || 1) * 25.4, U = (R.board.height_in || 1) * 25.4;
        z.fillStyle = "#1a5f1a", z.fillRect(0, 0, V, U), z.strokeStyle = "#0d3d0d", z.lineWidth = 0.1, z.strokeRect(0, 0, V, U);
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
    }), !R) return;
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
      let z;
      M.useFR4 ? z = L(M.id, M.order) : M.url && (z = O(M.id, M.order, M.url)), z && u.addPass(z);
    }), u.requestRender("side-switch"), setTimeout(() => u.requestRender("side-switch-delayed"), 50);
  }
  function j(C = 0.08) {
    if (!R?.board) return;
    const Z = c.getBoundingClientRect(), M = R.board.width_in || 1, z = R.board.height_in || 1, G = Z.width * (1 - 2 * C), V = Z.height * (1 - 2 * C), U = M * 25.4, it = z * 25.4, lt = G / U, tt = V / it, rt = Math.min(lt, tt), st = U / 2, ot = it / 2;
    u.setCamera({
      center_mm: { x: st, y: ot },
      zoom: rt
    });
  }
  i.addEventListener("wheel", (C) => {
    C.preventDefault(), P = !0;
    const Z = i.getBoundingClientRect(), M = C.clientX - Z.left, z = C.clientY - Z.top, G = u.getCamera(), V = C.deltaY < 0 ? 1.1 : 0.9, U = Math.max(0.2, Math.min(50, G.zoom * V)), it = u.screenToBoard(M, z);
    u.setCamera({ zoom: U });
    const lt = u.screenToBoard(M, z), tt = it.x - lt.x, rt = it.y - lt.y, st = {
      x: G.center_mm.x + tt,
      y: G.center_mm.y + rt
    };
    u.setCamera({
      center_mm: st,
      zoom: U
    });
  }, { passive: !1 });
  let K = !1, S = null;
  i.addEventListener("mousedown", (C) => {
    if (C.button !== 0) return;
    C.preventDefault(), P = !0, K = !0;
    const Z = i.getBoundingClientRect();
    S = u.screenToBoard(
      C.clientX - Z.left,
      C.clientY - Z.top
    );
  });
  const F = (C) => {
    if (!K || !S) return;
    const Z = i.getBoundingClientRect(), M = u.screenToBoard(
      C.clientX - Z.left,
      C.clientY - Z.top
    ), z = S.x - M.x, G = S.y - M.y, V = u.getCamera();
    u.setCamera({
      center_mm: {
        x: V.center_mm.x + z,
        y: V.center_mm.y + G
      }
    });
  }, l = () => {
    K = !1, S = null;
  };
  window.addEventListener("mousemove", F), window.addEventListener("mouseup", l), s.addEventListener("change", () => {
    _.setOverlayVisibility("grid", s.checked), u.requestRender("grid-toggle");
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
    R = C.boardGeom, x = C.layers, T(), f(), j(0.08);
  }
  function $(C) {
    A = C;
    const Z = y.find((M) => M.value === C);
    Z && (Z.checked = !0), T();
  }
  function et() {
    window.removeEventListener("mousemove", F), window.removeEventListener("mouseup", l), g.innerHTML = "";
  }
  return f(), {
    setData: Q,
    setSideMode: $,
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
      for (const i of c)
        e.ctx.save(), i.drawInWorldSpace ? e.ctx.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), i.draw(e.ctx, t), e.ctx.restore();
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
    const { width_px: c, height_px: i } = t.viewport, s = 4;
    for (const n of o) {
      const d = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), v = d.x, y = d.y;
      v < -10 || y < -10 || v > c + 10 || y > i + 10 || (this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id), t.ctx.beginPath(), t.ctx.arc(v, y, s, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill());
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
  Xe as Emitter,
  ft as GerberError,
  $e as MarkerPicker,
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
