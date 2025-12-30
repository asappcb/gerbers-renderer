var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function le(g) {
  return g && g.__esModule && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g;
}
function Pt(g) {
  throw new Error('Could not dynamically require "' + g + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var Xt;
function ce() {
  return Xt || (Xt = 1, (function(g, t) {
    (function(e) {
      g.exports = e();
    })(function() {
      return (function e(h, c, i) {
        function a(w, b) {
          if (!c[w]) {
            if (!h[w]) {
              var d = typeof Pt == "function" && Pt;
              if (!b && d) return d(w, !0);
              if (n) return n(w, !0);
              var y = new Error("Cannot find module '" + w + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var l = c[w] = { exports: {} };
            h[w][0].call(l.exports, function(m) {
              var s = h[w][1][m];
              return a(s || m);
            }, l, l.exports, e, h, c, i);
          }
          return c[w].exports;
        }
        for (var n = typeof Pt == "function" && Pt, u = 0; u < i.length; u++) a(i[u]);
        return a;
      })({ 1: [function(e, h, c) {
        var i = e("./utils"), a = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        c.encode = function(u) {
          for (var w, b, d, y, l, m, s, p = [], f = 0, v = u.length, E = v, k = i.getTypeOf(u) !== "string"; f < u.length; ) E = v - f, d = k ? (w = u[f++], b = f < v ? u[f++] : 0, f < v ? u[f++] : 0) : (w = u.charCodeAt(f++), b = f < v ? u.charCodeAt(f++) : 0, f < v ? u.charCodeAt(f++) : 0), y = w >> 2, l = (3 & w) << 4 | b >> 4, m = 1 < E ? (15 & b) << 2 | d >> 6 : 64, s = 2 < E ? 63 & d : 64, p.push(n.charAt(y) + n.charAt(l) + n.charAt(m) + n.charAt(s));
          return p.join("");
        }, c.decode = function(u) {
          var w, b, d, y, l, m, s = 0, p = 0, f = "data:";
          if (u.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var v, E = 3 * (u = u.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (u.charAt(u.length - 1) === n.charAt(64) && E--, u.charAt(u.length - 2) === n.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (v = a.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); s < u.length; ) w = n.indexOf(u.charAt(s++)) << 2 | (y = n.indexOf(u.charAt(s++))) >> 4, b = (15 & y) << 4 | (l = n.indexOf(u.charAt(s++))) >> 2, d = (3 & l) << 6 | (m = n.indexOf(u.charAt(s++))), v[p++] = w, l !== 64 && (v[p++] = b), m !== 64 && (v[p++] = d);
          return v;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, h, c) {
        var i = e("./external"), a = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), u = e("./stream/DataLengthProbe");
        function w(b, d, y, l, m) {
          this.compressedSize = b, this.uncompressedSize = d, this.crc32 = y, this.compression = l, this.compressedContent = m;
        }
        w.prototype = { getContentWorker: function() {
          var b = new a(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new u("data_length")), d = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== d.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new a(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, w.createWorkerFrom = function(b, d, y) {
          return b.pipe(new n()).pipe(new u("uncompressedSize")).pipe(d.compressWorker(y)).pipe(new u("compressedSize")).withStreamInfo("compression", d);
        }, h.exports = w;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, h, c) {
        var i = e("./stream/GenericWorker");
        c.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, c.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, h, c) {
        var i = e("./utils"), a = (function() {
          for (var n, u = [], w = 0; w < 256; w++) {
            n = w;
            for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            u[w] = n;
          }
          return u;
        })();
        h.exports = function(n, u) {
          return n !== void 0 && n.length ? i.getTypeOf(n) !== "string" ? (function(w, b, d, y) {
            var l = a, m = y + d;
            w ^= -1;
            for (var s = y; s < m; s++) w = w >>> 8 ^ l[255 & (w ^ b[s])];
            return -1 ^ w;
          })(0 | u, n, n.length, 0) : (function(w, b, d, y) {
            var l = a, m = y + d;
            w ^= -1;
            for (var s = y; s < m; s++) w = w >>> 8 ^ l[255 & (w ^ b.charCodeAt(s))];
            return -1 ^ w;
          })(0 | u, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, h, c) {
        c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !0, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
      }, {}], 6: [function(e, h, c) {
        var i = null;
        i = typeof Promise < "u" ? Promise : e("lie"), h.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(e, h, c) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = e("pako"), n = e("./utils"), u = e("./stream/GenericWorker"), w = i ? "uint8array" : "array";
        function b(d, y) {
          u.call(this, "FlateWorker/" + d), this._pako = null, this._pakoAction = d, this._pakoOptions = y, this.meta = {};
        }
        c.magic = "\b\0", n.inherits(b, u), b.prototype.processChunk = function(d) {
          this.meta = d.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(w, d.data), !1);
        }, b.prototype.flush = function() {
          u.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          u.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var d = this;
          this._pako.onData = function(y) {
            d.push({ data: y, meta: d.meta });
          };
        }, c.compressWorker = function(d) {
          return new b("Deflate", d);
        }, c.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, h, c) {
        function i(l, m) {
          var s, p = "";
          for (s = 0; s < m; s++) p += String.fromCharCode(255 & l), l >>>= 8;
          return p;
        }
        function a(l, m, s, p, f, v) {
          var E, k, A = l.file, P = l.compression, O = v !== w.utf8encode, L = n.transformTo("string", v(A.name)), M = n.transformTo("string", w.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", v(j)), S = n.transformTo("string", w.utf8encode(j)), F = M.length !== A.name.length, o = S.length !== j.length, D = "", Q = "", X = "", et = A.dir, T = A.date, Z = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !s || (Z.crc32 = l.crc32, Z.compressedSize = l.compressedSize, Z.uncompressedSize = l.uncompressedSize);
          var C = 0;
          m && (C |= 8), O || !F && !o || (C |= 2048);
          var R = 0, G = 0;
          et && (R |= 16), f === "UNIX" ? (G = 798, R |= (function(U, nt) {
            var lt = U;
            return U || (lt = nt ? 16893 : 33204), (65535 & lt) << 16;
          })(A.unixPermissions, et)) : (G = 20, R |= (function(U) {
            return 63 & (U || 0);
          })(A.dosPermissions)), E = T.getUTCHours(), E <<= 6, E |= T.getUTCMinutes(), E <<= 5, E |= T.getUTCSeconds() / 2, k = T.getUTCFullYear() - 1980, k <<= 4, k |= T.getUTCMonth() + 1, k <<= 5, k |= T.getUTCDate(), F && (Q = i(1, 1) + i(b(L), 4) + M, D += "up" + i(Q.length, 2) + Q), o && (X = i(1, 1) + i(b(K), 4) + S, D += "uc" + i(X.length, 2) + X);
          var V = "";
          return V += `
\0`, V += i(C, 2), V += P.magic, V += i(E, 2), V += i(k, 2), V += i(Z.crc32, 4), V += i(Z.compressedSize, 4), V += i(Z.uncompressedSize, 4), V += i(L.length, 2), V += i(D.length, 2), { fileRecord: d.LOCAL_FILE_HEADER + V + L + D, dirRecord: d.CENTRAL_FILE_HEADER + i(G, 2) + V + i(K.length, 2) + "\0\0\0\0" + i(R, 4) + i(p, 4) + L + D + K };
        }
        var n = e("../utils"), u = e("../stream/GenericWorker"), w = e("../utf8"), b = e("../crc32"), d = e("../signature");
        function y(l, m, s, p) {
          u.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = m, this.zipPlatform = s, this.encodeFileName = p, this.streamFiles = l, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(y, u), y.prototype.push = function(l) {
          var m = l.meta.percent || 0, s = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(l) : (this.bytesWritten += l.data.length, u.prototype.push.call(this, { data: l.data, meta: { currentFile: this.currentFile, percent: s ? (m + 100 * (s - p - 1)) / s : 100 } }));
        }, y.prototype.openedSource = function(l) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = l.file.name;
          var m = this.streamFiles && !l.file.dir;
          if (m) {
            var s = a(l, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: s.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(l) {
          this.accumulate = !1;
          var m = this.streamFiles && !l.file.dir, s = a(l, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(s.dirRecord), m) this.push({ data: (function(p) {
            return d.DATA_DESCRIPTOR + i(p.crc32, 4) + i(p.compressedSize, 4) + i(p.uncompressedSize, 4);
          })(l), meta: { percent: 100 } });
          else for (this.push({ data: s.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var l = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var s = this.bytesWritten - l, p = (function(f, v, E, k, A) {
            var P = n.transformTo("string", A(k));
            return d.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(f, 2) + i(f, 2) + i(v, 4) + i(E, 4) + i(P.length, 2) + P;
          })(this.dirRecords.length, s, l, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(l) {
          this._sources.push(l);
          var m = this;
          return l.on("data", function(s) {
            m.processChunk(s);
          }), l.on("end", function() {
            m.closedSource(m.previous.streamInfo), m._sources.length ? m.prepareNextSource() : m.end();
          }), l.on("error", function(s) {
            m.error(s);
          }), this;
        }, y.prototype.resume = function() {
          return !!u.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(l) {
          var m = this._sources;
          if (!u.prototype.error.call(this, l)) return !1;
          for (var s = 0; s < m.length; s++) try {
            m[s].error(l);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          u.prototype.lock.call(this);
          for (var l = this._sources, m = 0; m < l.length; m++) l[m].lock();
        }, h.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, h, c) {
        var i = e("../compressions"), a = e("./ZipFileWorker");
        c.generateWorker = function(n, u, w) {
          var b = new a(u.streamFiles, w, u.platform, u.encodeFileName), d = 0;
          try {
            n.forEach(function(y, l) {
              d++;
              var m = (function(v, E) {
                var k = v || E, A = i[k];
                if (!A) throw new Error(k + " is not a valid compression method !");
                return A;
              })(l.options.compression, u.compression), s = l.options.compressionOptions || u.compressionOptions || {}, p = l.dir, f = l.date;
              l._compressWorker(m, s).withStreamInfo("file", { name: y, dir: p, date: f, comment: l.comment || "", unixPermissions: l.unixPermissions, dosPermissions: l.dosPermissions }).pipe(b);
            }), b.entriesCount = d;
          } catch (y) {
            b.error(y);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, h, c) {
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new i();
            for (var n in this) typeof this[n] != "function" && (a[n] = this[n]);
            return a;
          };
        }
        (i.prototype = e("./object")).loadAsync = e("./load"), i.support = e("./support"), i.defaults = e("./defaults"), i.version = "3.10.1", i.loadAsync = function(a, n) {
          return new i().loadAsync(a, n);
        }, i.external = e("./external"), h.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, h, c) {
        var i = e("./utils"), a = e("./external"), n = e("./utf8"), u = e("./zipEntries"), w = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function d(y) {
          return new a.Promise(function(l, m) {
            var s = y.decompressed.getContentWorker().pipe(new w());
            s.on("error", function(p) {
              m(p);
            }).on("end", function() {
              s.streamInfo.crc32 !== y.decompressed.crc32 ? m(new Error("Corrupted zip : CRC32 mismatch")) : l();
            }).resume();
          });
        }
        h.exports = function(y, l) {
          var m = this;
          return l = i.extend(l || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(y) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", y, !0, l.optimizedBinaryString, l.base64).then(function(s) {
            var p = new u(l);
            return p.load(s), p;
          }).then(function(s) {
            var p = [a.Promise.resolve(s)], f = s.files;
            if (l.checkCRC32) for (var v = 0; v < f.length; v++) p.push(d(f[v]));
            return a.Promise.all(p);
          }).then(function(s) {
            for (var p = s.shift(), f = p.files, v = 0; v < f.length; v++) {
              var E = f[v], k = E.fileNameStr, A = i.resolve(E.fileNameStr);
              m.file(A, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: l.createFolders }), E.dir || (m.file(A).unsafeOriginalName = k);
            }
            return p.zipComment.length && (m.comment = p.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, h, c) {
        var i = e("../utils"), a = e("../stream/GenericWorker");
        function n(u, w) {
          a.call(this, "Nodejs stream input adapter for " + u), this._upstreamEnded = !1, this._bindStream(w);
        }
        i.inherits(n, a), n.prototype._bindStream = function(u) {
          var w = this;
          (this._stream = u).pause(), u.on("data", function(b) {
            w.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            w.isPaused ? this.generatedError = b : w.error(b);
          }).on("end", function() {
            w.isPaused ? w._upstreamEnded = !0 : w.end();
          });
        }, n.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, h.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, h, c) {
        var i = e("readable-stream").Readable;
        function a(n, u, w) {
          i.call(this, u), this._helper = n;
          var b = this;
          n.on("data", function(d, y) {
            b.push(d) || b._helper.pause(), w && w(y);
          }).on("error", function(d) {
            b.emit("error", d);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(a, i), a.prototype._read = function() {
          this._helper.resume();
        }, h.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, h, c) {
        h.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, a);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, a);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var a = new Buffer(i);
          return a.fill(0), a;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(e, h, c) {
        function i(A, P, O) {
          var L, M = n.getTypeOf(P), j = n.extend(O || {}, b);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = f(A)), j.createFolders && (L = p(A)) && v.call(this, L, !0);
          var K = M === "string" && j.binary === !1 && j.base64 === !1;
          O && O.binary !== void 0 || (j.binary = !K), (P instanceof d && P.uncompressedSize === 0 || j.dir || !P || P.length === 0) && (j.base64 = !1, j.binary = !0, P = "", j.compression = "STORE", M = "string");
          var S = null;
          S = P instanceof d || P instanceof u ? P : m.isNode && m.isStream(P) ? new s(A, P) : n.prepareContent(A, P, j.binary, j.optimizedBinaryString, j.base64);
          var F = new y(A, S, j);
          this.files[A] = F;
        }
        var a = e("./utf8"), n = e("./utils"), u = e("./stream/GenericWorker"), w = e("./stream/StreamHelper"), b = e("./defaults"), d = e("./compressedObject"), y = e("./zipObject"), l = e("./generate"), m = e("./nodejsUtils"), s = e("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var P = A.lastIndexOf("/");
          return 0 < P ? A.substring(0, P) : "";
        }, f = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, v = function(A, P) {
          return P = P !== void 0 ? P : b.createFolders, A = f(A), this.files[A] || i.call(this, A, null, { dir: !0, createFolders: P }), this.files[A];
        };
        function E(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var k = { load: function() {
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
          if (E(A)) {
            var L = A;
            return this.filter(function(j, K) {
              return !K.dir && L.test(j);
            });
          }
          var M = this.files[this.root + A];
          return M && !M.dir ? M : null;
        }, folder: function(A) {
          if (!A) return this;
          if (E(A)) return this.filter(function(M, j) {
            return j.dir && A.test(M);
          });
          var P = this.root + A, O = v.call(this, P), L = this.clone();
          return L.root = O.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var P = this.files[A];
          if (P || (A.slice(-1) !== "/" && (A += "/"), P = this.files[A]), P && !P.dir) delete this.files[A];
          else for (var O = this.filter(function(M, j) {
            return j.name.slice(0, A.length) === A;
          }), L = 0; L < O.length; L++) delete this.files[O[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var P, O = {};
          try {
            if ((O = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            n.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var L = O.comment || this.comment || "";
            P = l.generateWorker(this, O, L);
          } catch (M) {
            (P = new u("error")).error(M);
          }
          return new w(P, O.type || "string", O.mimeType);
        }, generateAsync: function(A, P) {
          return this.generateInternalStream(A).accumulate(P);
        }, generateNodeStream: function(A, P) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(P);
        } };
        h.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, h, c) {
        h.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, h, c) {
        var i = e("./DataReader");
        function a(n) {
          i.call(this, n);
          for (var u = 0; u < this.data.length; u++) n[u] = 255 & n[u];
        }
        e("../utils").inherits(a, i), a.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, a.prototype.lastIndexOfSignature = function(n) {
          for (var u = n.charCodeAt(0), w = n.charCodeAt(1), b = n.charCodeAt(2), d = n.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === u && this.data[y + 1] === w && this.data[y + 2] === b && this.data[y + 3] === d) return y - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(n) {
          var u = n.charCodeAt(0), w = n.charCodeAt(1), b = n.charCodeAt(2), d = n.charCodeAt(3), y = this.readData(4);
          return u === y[0] && w === y[1] && b === y[2] && d === y[3];
        }, a.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, h.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, h, c) {
        var i = e("../utils");
        function a(n) {
          this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(n) {
          this.checkIndex(this.index + n);
        }, checkIndex: function(n) {
          if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
        }, setIndex: function(n) {
          this.checkIndex(n), this.index = n;
        }, skip: function(n) {
          this.setIndex(this.index + n);
        }, byteAt: function() {
        }, readInt: function(n) {
          var u, w = 0;
          for (this.checkOffset(n), u = this.index + n - 1; u >= this.index; u--) w = (w << 8) + this.byteAt(u);
          return this.index += n, w;
        }, readString: function(n) {
          return i.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, h.exports = a;
      }, { "../utils": 32 }], 19: [function(e, h, c) {
        var i = e("./Uint8ArrayReader");
        function a(n) {
          i.call(this, n);
        }
        e("../utils").inherits(a, i), a.prototype.readData = function(n) {
          this.checkOffset(n);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, h.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, h, c) {
        var i = e("./DataReader");
        function a(n) {
          i.call(this, n);
        }
        e("../utils").inherits(a, i), a.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, a.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, a.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, a.prototype.readData = function(n) {
          this.checkOffset(n);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, h.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, h, c) {
        var i = e("./ArrayReader");
        function a(n) {
          i.call(this, n);
        }
        e("../utils").inherits(a, i), a.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var u = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, h.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, h, c) {
        var i = e("../utils"), a = e("../support"), n = e("./ArrayReader"), u = e("./StringReader"), w = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        h.exports = function(d) {
          var y = i.getTypeOf(d);
          return i.checkSupport(y), y !== "string" || a.uint8array ? y === "nodebuffer" ? new w(d) : a.uint8array ? new b(i.transformTo("uint8array", d)) : new n(i.transformTo("array", d)) : new u(d);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, h, c) {
        c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, h, c) {
        var i = e("./GenericWorker"), a = e("../utils");
        function n(u) {
          i.call(this, "ConvertWorker to " + u), this.destType = u;
        }
        a.inherits(n, i), n.prototype.processChunk = function(u) {
          this.push({ data: a.transformTo(this.destType, u.data), meta: u.meta });
        }, h.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, h, c) {
        var i = e("./GenericWorker"), a = e("../crc32");
        function n() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, i), n.prototype.processChunk = function(u) {
          this.streamInfo.crc32 = a(u.data, this.streamInfo.crc32 || 0), this.push(u);
        }, h.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, h, c) {
        var i = e("../utils"), a = e("./GenericWorker");
        function n(u) {
          a.call(this, "DataLengthProbe for " + u), this.propName = u, this.withStreamInfo(u, 0);
        }
        i.inherits(n, a), n.prototype.processChunk = function(u) {
          if (u) {
            var w = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = w + u.data.length;
          }
          a.prototype.processChunk.call(this, u);
        }, h.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, h, c) {
        var i = e("../utils"), a = e("./GenericWorker");
        function n(u) {
          a.call(this, "DataWorker");
          var w = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, u.then(function(b) {
            w.dataIsReady = !0, w.data = b, w.max = b && b.length || 0, w.type = i.getTypeOf(b), w.isPaused || w._tickAndRepeat();
          }, function(b) {
            w.error(b);
          });
        }
        i.inherits(n, a), n.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, n.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var u = null, w = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              u = this.data.substring(this.index, w);
              break;
            case "uint8array":
              u = this.data.subarray(this.index, w);
              break;
            case "array":
            case "nodebuffer":
              u = this.data.slice(this.index, w);
          }
          return this.index = w, this.push({ data: u, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, h.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, h, c) {
        function i(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(a) {
          this.emit("data", a);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (a) {
            this.emit("error", a);
          }
          return !0;
        }, error: function(a) {
          return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = !0, this.emit("error", a), this.previous && this.previous.error(a), this.cleanUp()), !0);
        }, on: function(a, n) {
          return this._listeners[a].push(n), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, n) {
          if (this._listeners[a]) for (var u = 0; u < this._listeners[a].length; u++) this._listeners[a][u].call(this, n);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var n = this;
          return a.on("data", function(u) {
            n.processChunk(u);
          }), a.on("end", function() {
            n.end();
          }), a.on("error", function(u) {
            n.error(u);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var a = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), a = !0), this.previous && this.previous.resume(), !a;
        }, flush: function() {
        }, processChunk: function(a) {
          this.push(a);
        }, withStreamInfo: function(a, n) {
          return this.extraStreamInfo[a] = n, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, h.exports = i;
      }, {}], 29: [function(e, h, c) {
        var i = e("../utils"), a = e("./ConvertWorker"), n = e("./GenericWorker"), u = e("../base64"), w = e("../support"), b = e("../external"), d = null;
        if (w.nodestream) try {
          d = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(m, s) {
          return new b.Promise(function(p, f) {
            var v = [], E = m._internalType, k = m._outputType, A = m._mimeType;
            m.on("data", function(P, O) {
              v.push(P), s && s(O);
            }).on("error", function(P) {
              v = [], f(P);
            }).on("end", function() {
              try {
                var P = (function(O, L, M) {
                  switch (O) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", L), M);
                    case "base64":
                      return u.encode(L);
                    default:
                      return i.transformTo(O, L);
                  }
                })(k, (function(O, L) {
                  var M, j = 0, K = null, S = 0;
                  for (M = 0; M < L.length; M++) S += L[M].length;
                  switch (O) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (K = new Uint8Array(S), M = 0; M < L.length; M++) K.set(L[M], j), j += L[M].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(E, v), A);
                p(P);
              } catch (O) {
                f(O);
              }
              v = [];
            }).resume();
          });
        }
        function l(m, s, p) {
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
            this._internalType = f, this._outputType = s, this._mimeType = p, i.checkSupport(f), this._worker = m.pipe(new a(f)), m.lock();
          } catch (v) {
            this._worker = new n("error"), this._worker.error(v);
          }
        }
        l.prototype = { accumulate: function(m) {
          return y(this, m);
        }, on: function(m, s) {
          var p = this;
          return m === "data" ? this._worker.on(m, function(f) {
            s.call(p, f.data, f.meta);
          }) : this._worker.on(m, function() {
            i.delay(s, arguments, p);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new d(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, h.exports = l;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, h, c) {
        if (c.base64 = !0, c.array = !0, c.string = !0, c.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", c.nodebuffer = typeof Buffer < "u", c.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") c.blob = !1;
        else {
          var i = new ArrayBuffer(0);
          try {
            c.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(i), c.blob = a.getBlob("application/zip").size === 0;
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
      }, { "readable-stream": 16 }], 31: [function(e, h, c) {
        for (var i = e("./utils"), a = e("./support"), n = e("./nodejsUtils"), u = e("./stream/GenericWorker"), w = new Array(256), b = 0; b < 256; b++) w[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        w[254] = w[254] = 1;
        function d() {
          u.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          u.call(this, "utf-8 encode");
        }
        c.utf8encode = function(l) {
          return a.nodebuffer ? n.newBufferFrom(l, "utf-8") : (function(m) {
            var s, p, f, v, E, k = m.length, A = 0;
            for (v = 0; v < k; v++) (64512 & (p = m.charCodeAt(v))) == 55296 && v + 1 < k && (64512 & (f = m.charCodeAt(v + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), v++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (s = a.uint8array ? new Uint8Array(A) : new Array(A), v = E = 0; E < A; v++) (64512 & (p = m.charCodeAt(v))) == 55296 && v + 1 < k && (64512 & (f = m.charCodeAt(v + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), v++), p < 128 ? s[E++] = p : (p < 2048 ? s[E++] = 192 | p >>> 6 : (p < 65536 ? s[E++] = 224 | p >>> 12 : (s[E++] = 240 | p >>> 18, s[E++] = 128 | p >>> 12 & 63), s[E++] = 128 | p >>> 6 & 63), s[E++] = 128 | 63 & p);
            return s;
          })(l);
        }, c.utf8decode = function(l) {
          return a.nodebuffer ? i.transformTo("nodebuffer", l).toString("utf-8") : (function(m) {
            var s, p, f, v, E = m.length, k = new Array(2 * E);
            for (s = p = 0; s < E; ) if ((f = m[s++]) < 128) k[p++] = f;
            else if (4 < (v = w[f])) k[p++] = 65533, s += v - 1;
            else {
              for (f &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && s < E; ) f = f << 6 | 63 & m[s++], v--;
              1 < v ? k[p++] = 65533 : f < 65536 ? k[p++] = f : (f -= 65536, k[p++] = 55296 | f >> 10 & 1023, k[p++] = 56320 | 1023 & f);
            }
            return k.length !== p && (k.subarray ? k = k.subarray(0, p) : k.length = p), i.applyFromCharCode(k);
          })(l = i.transformTo(a.uint8array ? "uint8array" : "array", l));
        }, i.inherits(d, u), d.prototype.processChunk = function(l) {
          var m = i.transformTo(a.uint8array ? "uint8array" : "array", l.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var s = m;
              (m = new Uint8Array(s.length + this.leftOver.length)).set(this.leftOver, 0), m.set(s, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var p = (function(v, E) {
            var k;
            for ((E = E || v.length) > v.length && (E = v.length), k = E - 1; 0 <= k && (192 & v[k]) == 128; ) k--;
            return k < 0 || k === 0 ? E : k + w[v[k]] > E ? k : E;
          })(m), f = m;
          p !== m.length && (a.uint8array ? (f = m.subarray(0, p), this.leftOver = m.subarray(p, m.length)) : (f = m.slice(0, p), this.leftOver = m.slice(p, m.length))), this.push({ data: c.utf8decode(f), meta: l.meta });
        }, d.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: c.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, c.Utf8DecodeWorker = d, i.inherits(y, u), y.prototype.processChunk = function(l) {
          this.push({ data: c.utf8encode(l.data), meta: l.meta });
        }, c.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, h, c) {
        var i = e("./support"), a = e("./base64"), n = e("./nodejsUtils"), u = e("./external");
        function w(s) {
          return s;
        }
        function b(s, p) {
          for (var f = 0; f < s.length; ++f) p[f] = 255 & s.charCodeAt(f);
          return p;
        }
        e("setimmediate"), c.newBlob = function(s, p) {
          c.checkSupport("blob");
          try {
            return new Blob([s], { type: p });
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return f.append(s), f.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var d = { stringifyByChunk: function(s, p, f) {
          var v = [], E = 0, k = s.length;
          if (k <= f) return String.fromCharCode.apply(null, s);
          for (; E < k; ) p === "array" || p === "nodebuffer" ? v.push(String.fromCharCode.apply(null, s.slice(E, Math.min(E + f, k)))) : v.push(String.fromCharCode.apply(null, s.subarray(E, Math.min(E + f, k)))), E += f;
          return v.join("");
        }, stringifyByChar: function(s) {
          for (var p = "", f = 0; f < s.length; f++) p += String.fromCharCode(s[f]);
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
        function y(s) {
          var p = 65536, f = c.getTypeOf(s), v = !0;
          if (f === "uint8array" ? v = d.applyCanBeUsed.uint8array : f === "nodebuffer" && (v = d.applyCanBeUsed.nodebuffer), v) for (; 1 < p; ) try {
            return d.stringifyByChunk(s, f, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return d.stringifyByChar(s);
        }
        function l(s, p) {
          for (var f = 0; f < s.length; f++) p[f] = s[f];
          return p;
        }
        c.applyFromCharCode = y;
        var m = {};
        m.string = { string: w, array: function(s) {
          return b(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return m.string.uint8array(s).buffer;
        }, uint8array: function(s) {
          return b(s, new Uint8Array(s.length));
        }, nodebuffer: function(s) {
          return b(s, n.allocBuffer(s.length));
        } }, m.array = { string: y, array: w, arraybuffer: function(s) {
          return new Uint8Array(s).buffer;
        }, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return n.newBufferFrom(s);
        } }, m.arraybuffer = { string: function(s) {
          return y(new Uint8Array(s));
        }, array: function(s) {
          return l(new Uint8Array(s), new Array(s.byteLength));
        }, arraybuffer: w, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return n.newBufferFrom(new Uint8Array(s));
        } }, m.uint8array = { string: y, array: function(s) {
          return l(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return s.buffer;
        }, uint8array: w, nodebuffer: function(s) {
          return n.newBufferFrom(s);
        } }, m.nodebuffer = { string: y, array: function(s) {
          return l(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return m.nodebuffer.uint8array(s).buffer;
        }, uint8array: function(s) {
          return l(s, new Uint8Array(s.length));
        }, nodebuffer: w }, c.transformTo = function(s, p) {
          if (p = p || "", !s) return p;
          c.checkSupport(s);
          var f = c.getTypeOf(p);
          return m[f][s](p);
        }, c.resolve = function(s) {
          for (var p = s.split("/"), f = [], v = 0; v < p.length; v++) {
            var E = p[v];
            E === "." || E === "" && v !== 0 && v !== p.length - 1 || (E === ".." ? f.pop() : f.push(E));
          }
          return f.join("/");
        }, c.getTypeOf = function(s) {
          return typeof s == "string" ? "string" : Object.prototype.toString.call(s) === "[object Array]" ? "array" : i.nodebuffer && n.isBuffer(s) ? "nodebuffer" : i.uint8array && s instanceof Uint8Array ? "uint8array" : i.arraybuffer && s instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, c.checkSupport = function(s) {
          if (!i[s.toLowerCase()]) throw new Error(s + " is not supported by this platform");
        }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function(s) {
          var p, f, v = "";
          for (f = 0; f < (s || "").length; f++) v += "\\x" + ((p = s.charCodeAt(f)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return v;
        }, c.delay = function(s, p, f) {
          setImmediate(function() {
            s.apply(f || null, p || []);
          });
        }, c.inherits = function(s, p) {
          function f() {
          }
          f.prototype = p.prototype, s.prototype = new f();
        }, c.extend = function() {
          var s, p, f = {};
          for (s = 0; s < arguments.length; s++) for (p in arguments[s]) Object.prototype.hasOwnProperty.call(arguments[s], p) && f[p] === void 0 && (f[p] = arguments[s][p]);
          return f;
        }, c.prepareContent = function(s, p, f, v, E) {
          return u.Promise.resolve(p).then(function(k) {
            return i.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new u.Promise(function(A, P) {
              var O = new FileReader();
              O.onload = function(L) {
                A(L.target.result);
              }, O.onerror = function(L) {
                P(L.target.error);
              }, O.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var A = c.getTypeOf(k);
            return A ? (A === "arraybuffer" ? k = c.transformTo("uint8array", k) : A === "string" && (E ? k = a.decode(k) : f && v !== !0 && (k = (function(P) {
              return b(P, i.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(k))), k) : u.Promise.reject(new Error("Can't read the data of '" + s + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, h, c) {
        var i = e("./reader/readerFor"), a = e("./utils"), n = e("./signature"), u = e("./zipEntry"), w = e("./support");
        function b(d) {
          this.files = [], this.loadOptions = d;
        }
        b.prototype = { checkSignature: function(d) {
          if (!this.reader.readAndCheckSignature(d)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(y) + ", expected " + a.pretty(d) + ")");
          }
        }, isSignature: function(d, y) {
          var l = this.reader.index;
          this.reader.setIndex(d);
          var m = this.reader.readString(4) === y;
          return this.reader.setIndex(l), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var d = this.reader.readData(this.zipCommentLength), y = w.uint8array ? "uint8array" : "array", l = a.transformTo(y, d);
          this.zipComment = this.loadOptions.decodeFileName(l);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var d, y, l, m = this.zip64EndOfCentralSize - 44; 0 < m; ) d = this.reader.readInt(2), y = this.reader.readInt(4), l = this.reader.readData(y), this.zip64ExtensibleData[d] = { id: d, length: y, value: l };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var d, y;
          for (d = 0; d < this.files.length; d++) y = this.files[d], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var d;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (d = new u({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(d);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var d = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (d < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(d);
          var y = d;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (d = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(d), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var l = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (l += 20, l += 12 + this.zip64EndOfCentralSize);
          var m = y - l;
          if (0 < m) this.isSignature(y, n.CENTRAL_FILE_HEADER) || (this.reader.zero = m);
          else if (m < 0) throw new Error("Corrupted zip: missing " + Math.abs(m) + " bytes.");
        }, prepareReader: function(d) {
          this.reader = i(d);
        }, load: function(d) {
          this.prepareReader(d), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, h.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, h, c) {
        var i = e("./reader/readerFor"), a = e("./utils"), n = e("./compressedObject"), u = e("./crc32"), w = e("./utf8"), b = e("./compressions"), d = e("./support");
        function y(l, m) {
          this.options = l, this.loadOptions = m;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(l) {
          var m, s;
          if (l.skip(22), this.fileNameLength = l.readInt(2), s = l.readInt(2), this.fileName = l.readData(this.fileNameLength), l.skip(s), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((m = (function(p) {
            for (var f in b) if (Object.prototype.hasOwnProperty.call(b, f) && b[f].magic === p) return b[f];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
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
            var l = i(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = l.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = l.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = l.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = l.readInt(4));
          }
        }, readExtraFields: function(l) {
          var m, s, p, f = l.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); l.index + 4 < f; ) m = l.readInt(2), s = l.readInt(2), p = l.readData(s), this.extraFields[m] = { id: m, length: s, value: p };
          l.setIndex(f);
        }, handleUTF8: function() {
          var l = d.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = w.utf8decode(this.fileName), this.fileCommentStr = w.utf8decode(this.fileComment);
          else {
            var m = this.findExtraFieldUnicodePath();
            if (m !== null) this.fileNameStr = m;
            else {
              var s = a.transformTo(l, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(s);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var f = a.transformTo(l, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var l = this.extraFields[28789];
          if (l) {
            var m = i(l.value);
            return m.readInt(1) !== 1 || u(this.fileName) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var l = this.extraFields[25461];
          if (l) {
            var m = i(l.value);
            return m.readInt(1) !== 1 || u(this.fileComment) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        } }, h.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, h, c) {
        function i(m, s, p) {
          this.name = m, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = s, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var a = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), u = e("./utf8"), w = e("./compressedObject"), b = e("./stream/GenericWorker");
        i.prototype = { internalStream: function(m) {
          var s = null, p = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var f = (p = m.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), s = this._decompressWorker();
            var v = !this._dataBinary;
            v && !f && (s = s.pipe(new u.Utf8EncodeWorker())), !v && f && (s = s.pipe(new u.Utf8DecodeWorker()));
          } catch (E) {
            (s = new b("error")).error(E);
          }
          return new a(s, p, "");
        }, async: function(m, s) {
          return this.internalStream(m).accumulate(s);
        }, nodeStream: function(m, s) {
          return this.internalStream(m || "nodebuffer").toNodejsStream(s);
        }, _compressWorker: function(m, s) {
          if (this._data instanceof w && this._data.compression.magic === m.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new u.Utf8EncodeWorker())), w.createWorkerFrom(p, m, s);
        }, _decompressWorker: function() {
          return this._data instanceof w ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
        } };
        for (var d = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, l = 0; l < d.length; l++) i.prototype[d[l]] = y;
        h.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, h, c) {
        (function(i) {
          var a, n, u = i.MutationObserver || i.WebKitMutationObserver;
          if (u) {
            var w = 0, b = new u(m), d = i.document.createTextNode("");
            b.observe(d, { characterData: !0 }), a = function() {
              d.data = w = ++w % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) a = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var s = i.document.createElement("script");
            s.onreadystatechange = function() {
              m(), s.onreadystatechange = null, s.parentNode.removeChild(s), s = null;
            }, i.document.documentElement.appendChild(s);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var y = new i.MessageChannel();
            y.port1.onmessage = m, a = function() {
              y.port2.postMessage(0);
            };
          }
          var l = [];
          function m() {
            var s, p;
            n = !0;
            for (var f = l.length; f; ) {
              for (p = l, l = [], s = -1; ++s < f; ) p[s]();
              f = l.length;
            }
            n = !1;
          }
          h.exports = function(s) {
            l.push(s) !== 1 || n || a();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, h, c) {
        var i = e("immediate");
        function a() {
        }
        var n = {}, u = ["REJECTED"], w = ["FULFILLED"], b = ["PENDING"];
        function d(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, f !== a && s(this, f);
        }
        function y(f, v, E) {
          this.promise = f, typeof v == "function" && (this.onFulfilled = v, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
        }
        function l(f, v, E) {
          i(function() {
            var k;
            try {
              k = v(E);
            } catch (A) {
              return n.reject(f, A);
            }
            k === f ? n.reject(f, new TypeError("Cannot resolve promise with itself")) : n.resolve(f, k);
          });
        }
        function m(f) {
          var v = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof v == "function") return function() {
            v.apply(f, arguments);
          };
        }
        function s(f, v) {
          var E = !1;
          function k(O) {
            E || (E = !0, n.reject(f, O));
          }
          function A(O) {
            E || (E = !0, n.resolve(f, O));
          }
          var P = p(function() {
            v(A, k);
          });
          P.status === "error" && k(P.value);
        }
        function p(f, v) {
          var E = {};
          try {
            E.value = f(v), E.status = "success";
          } catch (k) {
            E.status = "error", E.value = k;
          }
          return E;
        }
        (h.exports = d).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var v = this.constructor;
          return this.then(function(E) {
            return v.resolve(f()).then(function() {
              return E;
            });
          }, function(E) {
            return v.resolve(f()).then(function() {
              throw E;
            });
          });
        }, d.prototype.catch = function(f) {
          return this.then(null, f);
        }, d.prototype.then = function(f, v) {
          if (typeof f != "function" && this.state === w || typeof v != "function" && this.state === u) return this;
          var E = new this.constructor(a);
          return this.state !== b ? l(E, this.state === w ? f : v, this.outcome) : this.queue.push(new y(E, f, v)), E;
        }, y.prototype.callFulfilled = function(f) {
          n.resolve(this.promise, f);
        }, y.prototype.otherCallFulfilled = function(f) {
          l(this.promise, this.onFulfilled, f);
        }, y.prototype.callRejected = function(f) {
          n.reject(this.promise, f);
        }, y.prototype.otherCallRejected = function(f) {
          l(this.promise, this.onRejected, f);
        }, n.resolve = function(f, v) {
          var E = p(m, v);
          if (E.status === "error") return n.reject(f, E.value);
          var k = E.value;
          if (k) s(f, k);
          else {
            f.state = w, f.outcome = v;
            for (var A = -1, P = f.queue.length; ++A < P; ) f.queue[A].callFulfilled(v);
          }
          return f;
        }, n.reject = function(f, v) {
          f.state = u, f.outcome = v;
          for (var E = -1, k = f.queue.length; ++E < k; ) f.queue[E].callRejected(v);
          return f;
        }, d.resolve = function(f) {
          return f instanceof this ? f : n.resolve(new this(a), f);
        }, d.reject = function(f) {
          var v = new this(a);
          return n.reject(v, f);
        }, d.all = function(f) {
          var v = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = f.length, k = !1;
          if (!E) return this.resolve([]);
          for (var A = new Array(E), P = 0, O = -1, L = new this(a); ++O < E; ) M(f[O], O);
          return L;
          function M(j, K) {
            v.resolve(j).then(function(S) {
              A[K] = S, ++P !== E || k || (k = !0, n.resolve(L, A));
            }, function(S) {
              k || (k = !0, n.reject(L, S));
            });
          }
        }, d.race = function(f) {
          var v = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = f.length, k = !1;
          if (!E) return this.resolve([]);
          for (var A = -1, P = new this(a); ++A < E; ) O = f[A], v.resolve(O).then(function(L) {
            k || (k = !0, n.resolve(P, L));
          }, function(L) {
            k || (k = !0, n.reject(P, L));
          });
          var O;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, h, c) {
        var i = {};
        (0, e("./lib/utils/common").assign)(i, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), h.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, h, c) {
        var i = e("./zlib/deflate"), a = e("./utils/common"), n = e("./utils/strings"), u = e("./zlib/messages"), w = e("./zlib/zstream"), b = Object.prototype.toString, d = 0, y = -1, l = 0, m = 8;
        function s(f) {
          if (!(this instanceof s)) return new s(f);
          this.options = a.assign({ level: y, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: l, to: "" }, f || {});
          var v = this.options;
          v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
          var E = i.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
          if (E !== d) throw new Error(u[E]);
          if (v.header && i.deflateSetHeader(this.strm, v.header), v.dictionary) {
            var k;
            if (k = typeof v.dictionary == "string" ? n.string2buf(v.dictionary) : b.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (E = i.deflateSetDictionary(this.strm, k)) !== d) throw new Error(u[E]);
            this._dict_set = !0;
          }
        }
        function p(f, v) {
          var E = new s(v);
          if (E.push(f, !0), E.err) throw E.msg || u[E.err];
          return E.result;
        }
        s.prototype.push = function(f, v) {
          var E, k, A = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          k = v === ~~v ? v : v === !0 ? 4 : 0, typeof f == "string" ? A.input = n.string2buf(f) : b.call(f) === "[object ArrayBuffer]" ? A.input = new Uint8Array(f) : A.input = f, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new a.Buf8(P), A.next_out = 0, A.avail_out = P), (E = i.deflate(A, k)) !== 1 && E !== d) return this.onEnd(E), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(a.shrinkBuf(A.output, A.next_out))) : this.onData(a.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && E !== 1);
          return k === 4 ? (E = i.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === d) : k !== 2 || (this.onEnd(d), !(A.avail_out = 0));
        }, s.prototype.onData = function(f) {
          this.chunks.push(f);
        }, s.prototype.onEnd = function(f) {
          f === d && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, c.Deflate = s, c.deflate = p, c.deflateRaw = function(f, v) {
          return (v = v || {}).raw = !0, p(f, v);
        }, c.gzip = function(f, v) {
          return (v = v || {}).gzip = !0, p(f, v);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, h, c) {
        var i = e("./zlib/inflate"), a = e("./utils/common"), n = e("./utils/strings"), u = e("./zlib/constants"), w = e("./zlib/messages"), b = e("./zlib/zstream"), d = e("./zlib/gzheader"), y = Object.prototype.toString;
        function l(s) {
          if (!(this instanceof l)) return new l(s);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, s || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || s && s.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var f = i.inflateInit2(this.strm, p.windowBits);
          if (f !== u.Z_OK) throw new Error(w[f]);
          this.header = new d(), i.inflateGetHeader(this.strm, this.header);
        }
        function m(s, p) {
          var f = new l(p);
          if (f.push(s, !0), f.err) throw f.msg || w[f.err];
          return f.result;
        }
        l.prototype.push = function(s, p) {
          var f, v, E, k, A, P, O = this.strm, L = this.options.chunkSize, M = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          v = p === ~~p ? p : p === !0 ? u.Z_FINISH : u.Z_NO_FLUSH, typeof s == "string" ? O.input = n.binstring2buf(s) : y.call(s) === "[object ArrayBuffer]" ? O.input = new Uint8Array(s) : O.input = s, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new a.Buf8(L), O.next_out = 0, O.avail_out = L), (f = i.inflate(O, u.Z_NO_FLUSH)) === u.Z_NEED_DICT && M && (P = typeof M == "string" ? n.string2buf(M) : y.call(M) === "[object ArrayBuffer]" ? new Uint8Array(M) : M, f = i.inflateSetDictionary(this.strm, P)), f === u.Z_BUF_ERROR && j === !0 && (f = u.Z_OK, j = !1), f !== u.Z_STREAM_END && f !== u.Z_OK) return this.onEnd(f), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && f !== u.Z_STREAM_END && (O.avail_in !== 0 || v !== u.Z_FINISH && v !== u.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = n.utf8border(O.output, O.next_out), k = O.next_out - E, A = n.buf2string(O.output, E), O.next_out = k, O.avail_out = L - k, k && a.arraySet(O.output, O.output, E, k, 0), this.onData(A)) : this.onData(a.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (j = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && f !== u.Z_STREAM_END);
          return f === u.Z_STREAM_END && (v = u.Z_FINISH), v === u.Z_FINISH ? (f = i.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === u.Z_OK) : v !== u.Z_SYNC_FLUSH || (this.onEnd(u.Z_OK), !(O.avail_out = 0));
        }, l.prototype.onData = function(s) {
          this.chunks.push(s);
        }, l.prototype.onEnd = function(s) {
          s === u.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = s, this.msg = this.strm.msg;
        }, c.Inflate = l, c.inflate = m, c.inflateRaw = function(s, p) {
          return (p = p || {}).raw = !0, m(s, p);
        }, c.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, h, c) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        c.assign = function(u) {
          for (var w = Array.prototype.slice.call(arguments, 1); w.length; ) {
            var b = w.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var d in b) b.hasOwnProperty(d) && (u[d] = b[d]);
            }
          }
          return u;
        }, c.shrinkBuf = function(u, w) {
          return u.length === w ? u : u.subarray ? u.subarray(0, w) : (u.length = w, u);
        };
        var a = { arraySet: function(u, w, b, d, y) {
          if (w.subarray && u.subarray) u.set(w.subarray(b, b + d), y);
          else for (var l = 0; l < d; l++) u[y + l] = w[b + l];
        }, flattenChunks: function(u) {
          var w, b, d, y, l, m;
          for (w = d = 0, b = u.length; w < b; w++) d += u[w].length;
          for (m = new Uint8Array(d), w = y = 0, b = u.length; w < b; w++) l = u[w], m.set(l, y), y += l.length;
          return m;
        } }, n = { arraySet: function(u, w, b, d, y) {
          for (var l = 0; l < d; l++) u[y + l] = w[b + l];
        }, flattenChunks: function(u) {
          return [].concat.apply([], u);
        } };
        c.setTyped = function(u) {
          u ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, a)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, n));
        }, c.setTyped(i);
      }, {}], 42: [function(e, h, c) {
        var i = e("./common"), a = !0, n = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          n = !1;
        }
        for (var u = new i.Buf8(256), w = 0; w < 256; w++) u[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
        function b(d, y) {
          if (y < 65537 && (d.subarray && n || !d.subarray && a)) return String.fromCharCode.apply(null, i.shrinkBuf(d, y));
          for (var l = "", m = 0; m < y; m++) l += String.fromCharCode(d[m]);
          return l;
        }
        u[254] = u[254] = 1, c.string2buf = function(d) {
          var y, l, m, s, p, f = d.length, v = 0;
          for (s = 0; s < f; s++) (64512 & (l = d.charCodeAt(s))) == 55296 && s + 1 < f && (64512 & (m = d.charCodeAt(s + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), s++), v += l < 128 ? 1 : l < 2048 ? 2 : l < 65536 ? 3 : 4;
          for (y = new i.Buf8(v), s = p = 0; p < v; s++) (64512 & (l = d.charCodeAt(s))) == 55296 && s + 1 < f && (64512 & (m = d.charCodeAt(s + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), s++), l < 128 ? y[p++] = l : (l < 2048 ? y[p++] = 192 | l >>> 6 : (l < 65536 ? y[p++] = 224 | l >>> 12 : (y[p++] = 240 | l >>> 18, y[p++] = 128 | l >>> 12 & 63), y[p++] = 128 | l >>> 6 & 63), y[p++] = 128 | 63 & l);
          return y;
        }, c.buf2binstring = function(d) {
          return b(d, d.length);
        }, c.binstring2buf = function(d) {
          for (var y = new i.Buf8(d.length), l = 0, m = y.length; l < m; l++) y[l] = d.charCodeAt(l);
          return y;
        }, c.buf2string = function(d, y) {
          var l, m, s, p, f = y || d.length, v = new Array(2 * f);
          for (l = m = 0; l < f; ) if ((s = d[l++]) < 128) v[m++] = s;
          else if (4 < (p = u[s])) v[m++] = 65533, l += p - 1;
          else {
            for (s &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && l < f; ) s = s << 6 | 63 & d[l++], p--;
            1 < p ? v[m++] = 65533 : s < 65536 ? v[m++] = s : (s -= 65536, v[m++] = 55296 | s >> 10 & 1023, v[m++] = 56320 | 1023 & s);
          }
          return b(v, m);
        }, c.utf8border = function(d, y) {
          var l;
          for ((y = y || d.length) > d.length && (y = d.length), l = y - 1; 0 <= l && (192 & d[l]) == 128; ) l--;
          return l < 0 || l === 0 ? y : l + u[d[l]] > y ? l : y;
        };
      }, { "./common": 41 }], 43: [function(e, h, c) {
        h.exports = function(i, a, n, u) {
          for (var w = 65535 & i | 0, b = i >>> 16 & 65535 | 0, d = 0; n !== 0; ) {
            for (n -= d = 2e3 < n ? 2e3 : n; b = b + (w = w + a[u++] | 0) | 0, --d; ) ;
            w %= 65521, b %= 65521;
          }
          return w | b << 16 | 0;
        };
      }, {}], 44: [function(e, h, c) {
        h.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, h, c) {
        var i = (function() {
          for (var a, n = [], u = 0; u < 256; u++) {
            a = u;
            for (var w = 0; w < 8; w++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            n[u] = a;
          }
          return n;
        })();
        h.exports = function(a, n, u, w) {
          var b = i, d = w + u;
          a ^= -1;
          for (var y = w; y < d; y++) a = a >>> 8 ^ b[255 & (a ^ n[y])];
          return -1 ^ a;
        };
      }, {}], 46: [function(e, h, c) {
        var i, a = e("../utils/common"), n = e("./trees"), u = e("./adler32"), w = e("./crc32"), b = e("./messages"), d = 0, y = 4, l = 0, m = -2, s = -1, p = 4, f = 2, v = 8, E = 9, k = 286, A = 30, P = 19, O = 2 * k + 1, L = 15, M = 3, j = 258, K = j + M + 1, S = 42, F = 113, o = 1, D = 2, Q = 3, X = 4;
        function et(r, N) {
          return r.msg = b[N], N;
        }
        function T(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function Z(r) {
          for (var N = r.length; 0 <= --N; ) r[N] = 0;
        }
        function C(r) {
          var N = r.state, B = N.pending;
          B > r.avail_out && (B = r.avail_out), B !== 0 && (a.arraySet(r.output, N.pending_buf, N.pending_out, B, r.next_out), r.next_out += B, N.pending_out += B, r.total_out += B, r.avail_out -= B, N.pending -= B, N.pending === 0 && (N.pending_out = 0));
        }
        function R(r, N) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, N), r.block_start = r.strstart, C(r.strm);
        }
        function G(r, N) {
          r.pending_buf[r.pending++] = N;
        }
        function V(r, N) {
          r.pending_buf[r.pending++] = N >>> 8 & 255, r.pending_buf[r.pending++] = 255 & N;
        }
        function U(r, N) {
          var B, x, _ = r.max_chain_length, z = r.strstart, W = r.prev_length, $ = r.nice_match, I = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, Y = r.window, q = r.w_mask, H = r.prev, J = r.strstart + j, ht = Y[z + W - 1], at = Y[z + W];
          r.prev_length >= r.good_match && (_ >>= 2), $ > r.lookahead && ($ = r.lookahead);
          do
            if (Y[(B = N) + W] === at && Y[B + W - 1] === ht && Y[B] === Y[z] && Y[++B] === Y[z + 1]) {
              z += 2, B++;
              do
                ;
              while (Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && Y[++z] === Y[++B] && z < J);
              if (x = j - (J - z), z = J - j, W < x) {
                if (r.match_start = N, $ <= (W = x)) break;
                ht = Y[z + W - 1], at = Y[z + W];
              }
            }
          while ((N = H[N & q]) > I && --_ != 0);
          return W <= r.lookahead ? W : r.lookahead;
        }
        function nt(r) {
          var N, B, x, _, z, W, $, I, Y, q, H = r.w_size;
          do {
            if (_ = r.window_size - r.lookahead - r.strstart, r.strstart >= H + (H - K)) {
              for (a.arraySet(r.window, r.window, H, H, 0), r.match_start -= H, r.strstart -= H, r.block_start -= H, N = B = r.hash_size; x = r.head[--N], r.head[N] = H <= x ? x - H : 0, --B; ) ;
              for (N = B = H; x = r.prev[--N], r.prev[N] = H <= x ? x - H : 0, --B; ) ;
              _ += H;
            }
            if (r.strm.avail_in === 0) break;
            if (W = r.strm, $ = r.window, I = r.strstart + r.lookahead, Y = _, q = void 0, q = W.avail_in, Y < q && (q = Y), B = q === 0 ? 0 : (W.avail_in -= q, a.arraySet($, W.input, W.next_in, q, I), W.state.wrap === 1 ? W.adler = u(W.adler, $, q, I) : W.state.wrap === 2 && (W.adler = w(W.adler, $, q, I)), W.next_in += q, W.total_in += q, q), r.lookahead += B, r.lookahead + r.insert >= M) for (z = r.strstart - r.insert, r.ins_h = r.window[z], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[z + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[z + M - 1]) & r.hash_mask, r.prev[z & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = z, z++, r.insert--, !(r.lookahead + r.insert < M)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function lt(r, N) {
          for (var B, x; ; ) {
            if (r.lookahead < K) {
              if (nt(r), r.lookahead < K && N === d) return o;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= M && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + M - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), B !== 0 && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B)), r.match_length >= M) if (x = n._tr_tally(r, r.strstart - r.match_start, r.match_length - M), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= M) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + M - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else x = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (x && (R(r, !1), r.strm.avail_out === 0)) return o;
          }
          return r.insert = r.strstart < M - 1 ? r.strstart : M - 1, N === y ? (R(r, !0), r.strm.avail_out === 0 ? Q : X) : r.last_lit && (R(r, !1), r.strm.avail_out === 0) ? o : D;
        }
        function tt(r, N) {
          for (var B, x, _; ; ) {
            if (r.lookahead < K) {
              if (nt(r), r.lookahead < K && N === d) return o;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= M && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + M - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = M - 1, B !== 0 && r.prev_length < r.max_lazy_match && r.strstart - B <= r.w_size - K && (r.match_length = U(r, B), r.match_length <= 5 && (r.strategy === 1 || r.match_length === M && 4096 < r.strstart - r.match_start) && (r.match_length = M - 1)), r.prev_length >= M && r.match_length <= r.prev_length) {
              for (_ = r.strstart + r.lookahead - M, x = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - M), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= _ && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + M - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = M - 1, r.strstart++, x && (R(r, !1), r.strm.avail_out === 0)) return o;
            } else if (r.match_available) {
              if ((x = n._tr_tally(r, 0, r.window[r.strstart - 1])) && R(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return o;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (x = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < M - 1 ? r.strstart : M - 1, N === y ? (R(r, !0), r.strm.avail_out === 0 ? Q : X) : r.last_lit && (R(r, !1), r.strm.avail_out === 0) ? o : D;
        }
        function rt(r, N, B, x, _) {
          this.good_length = r, this.max_lazy = N, this.nice_length = B, this.max_chain = x, this.func = _;
        }
        function st() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * O), this.dyn_dtree = new a.Buf16(2 * (2 * A + 1)), this.bl_tree = new a.Buf16(2 * (2 * P + 1)), Z(this.dyn_ltree), Z(this.dyn_dtree), Z(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(L + 1), this.heap = new a.Buf16(2 * k + 1), Z(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * k + 1), Z(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(r) {
          var N;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = f, (N = r.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? S : F, r.adler = N.wrap === 2 ? 0 : 1, N.last_flush = d, n._tr_init(N), l) : et(r, m);
        }
        function it(r) {
          var N = ot(r);
          return N === l && (function(B) {
            B.window_size = 2 * B.w_size, Z(B.head), B.max_lazy_match = i[B.level].max_lazy, B.good_match = i[B.level].good_length, B.nice_match = i[B.level].nice_length, B.max_chain_length = i[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = M - 1, B.match_available = 0, B.ins_h = 0;
          })(r.state), N;
        }
        function ct(r, N, B, x, _, z) {
          if (!r) return m;
          var W = 1;
          if (N === s && (N = 6), x < 0 ? (W = 0, x = -x) : 15 < x && (W = 2, x -= 16), _ < 1 || E < _ || B !== v || x < 8 || 15 < x || N < 0 || 9 < N || z < 0 || p < z) return et(r, m);
          x === 8 && (x = 9);
          var $ = new st();
          return (r.state = $).strm = r, $.wrap = W, $.gzhead = null, $.w_bits = x, $.w_size = 1 << $.w_bits, $.w_mask = $.w_size - 1, $.hash_bits = _ + 7, $.hash_size = 1 << $.hash_bits, $.hash_mask = $.hash_size - 1, $.hash_shift = ~~(($.hash_bits + M - 1) / M), $.window = new a.Buf8(2 * $.w_size), $.head = new a.Buf16($.hash_size), $.prev = new a.Buf16($.w_size), $.lit_bufsize = 1 << _ + 6, $.pending_buf_size = 4 * $.lit_bufsize, $.pending_buf = new a.Buf8($.pending_buf_size), $.d_buf = 1 * $.lit_bufsize, $.l_buf = 3 * $.lit_bufsize, $.level = N, $.strategy = z, $.method = B, it(r);
        }
        i = [new rt(0, 0, 0, 0, function(r, N) {
          var B = 65535;
          for (B > r.pending_buf_size - 5 && (B = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (nt(r), r.lookahead === 0 && N === d) return o;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var x = r.block_start + B;
            if ((r.strstart === 0 || r.strstart >= x) && (r.lookahead = r.strstart - x, r.strstart = x, R(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (R(r, !1), r.strm.avail_out === 0)) return o;
          }
          return r.insert = 0, N === y ? (R(r, !0), r.strm.avail_out === 0 ? Q : X) : (r.strstart > r.block_start && (R(r, !1), r.strm.avail_out), o);
        }), new rt(4, 4, 8, 4, lt), new rt(4, 5, 16, 8, lt), new rt(4, 6, 32, 32, lt), new rt(4, 4, 16, 16, tt), new rt(8, 16, 32, 32, tt), new rt(8, 16, 128, 128, tt), new rt(8, 32, 128, 256, tt), new rt(32, 128, 258, 1024, tt), new rt(32, 258, 258, 4096, tt)], c.deflateInit = function(r, N) {
          return ct(r, N, v, 15, 8, 0);
        }, c.deflateInit2 = ct, c.deflateReset = it, c.deflateResetKeep = ot, c.deflateSetHeader = function(r, N) {
          return r && r.state ? r.state.wrap !== 2 ? m : (r.state.gzhead = N, l) : m;
        }, c.deflate = function(r, N) {
          var B, x, _, z;
          if (!r || !r.state || 5 < N || N < 0) return r ? et(r, m) : m;
          if (x = r.state, !r.output || !r.input && r.avail_in !== 0 || x.status === 666 && N !== y) return et(r, r.avail_out === 0 ? -5 : m);
          if (x.strm = r, B = x.last_flush, x.last_flush = N, x.status === S) if (x.wrap === 2) r.adler = 0, G(x, 31), G(x, 139), G(x, 8), x.gzhead ? (G(x, (x.gzhead.text ? 1 : 0) + (x.gzhead.hcrc ? 2 : 0) + (x.gzhead.extra ? 4 : 0) + (x.gzhead.name ? 8 : 0) + (x.gzhead.comment ? 16 : 0)), G(x, 255 & x.gzhead.time), G(x, x.gzhead.time >> 8 & 255), G(x, x.gzhead.time >> 16 & 255), G(x, x.gzhead.time >> 24 & 255), G(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), G(x, 255 & x.gzhead.os), x.gzhead.extra && x.gzhead.extra.length && (G(x, 255 & x.gzhead.extra.length), G(x, x.gzhead.extra.length >> 8 & 255)), x.gzhead.hcrc && (r.adler = w(r.adler, x.pending_buf, x.pending, 0)), x.gzindex = 0, x.status = 69) : (G(x, 0), G(x, 0), G(x, 0), G(x, 0), G(x, 0), G(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), G(x, 3), x.status = F);
          else {
            var W = v + (x.w_bits - 8 << 4) << 8;
            W |= (2 <= x.strategy || x.level < 2 ? 0 : x.level < 6 ? 1 : x.level === 6 ? 2 : 3) << 6, x.strstart !== 0 && (W |= 32), W += 31 - W % 31, x.status = F, V(x, W), x.strstart !== 0 && (V(x, r.adler >>> 16), V(x, 65535 & r.adler)), r.adler = 1;
          }
          if (x.status === 69) if (x.gzhead.extra) {
            for (_ = x.pending; x.gzindex < (65535 & x.gzhead.extra.length) && (x.pending !== x.pending_buf_size || (x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), C(r), _ = x.pending, x.pending !== x.pending_buf_size)); ) G(x, 255 & x.gzhead.extra[x.gzindex]), x.gzindex++;
            x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), x.gzindex === x.gzhead.extra.length && (x.gzindex = 0, x.status = 73);
          } else x.status = 73;
          if (x.status === 73) if (x.gzhead.name) {
            _ = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), C(r), _ = x.pending, x.pending === x.pending_buf_size)) {
                z = 1;
                break;
              }
              z = x.gzindex < x.gzhead.name.length ? 255 & x.gzhead.name.charCodeAt(x.gzindex++) : 0, G(x, z);
            } while (z !== 0);
            x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), z === 0 && (x.gzindex = 0, x.status = 91);
          } else x.status = 91;
          if (x.status === 91) if (x.gzhead.comment) {
            _ = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), C(r), _ = x.pending, x.pending === x.pending_buf_size)) {
                z = 1;
                break;
              }
              z = x.gzindex < x.gzhead.comment.length ? 255 & x.gzhead.comment.charCodeAt(x.gzindex++) : 0, G(x, z);
            } while (z !== 0);
            x.gzhead.hcrc && x.pending > _ && (r.adler = w(r.adler, x.pending_buf, x.pending - _, _)), z === 0 && (x.status = 103);
          } else x.status = 103;
          if (x.status === 103 && (x.gzhead.hcrc ? (x.pending + 2 > x.pending_buf_size && C(r), x.pending + 2 <= x.pending_buf_size && (G(x, 255 & r.adler), G(x, r.adler >> 8 & 255), r.adler = 0, x.status = F)) : x.status = F), x.pending !== 0) {
            if (C(r), r.avail_out === 0) return x.last_flush = -1, l;
          } else if (r.avail_in === 0 && T(N) <= T(B) && N !== y) return et(r, -5);
          if (x.status === 666 && r.avail_in !== 0) return et(r, -5);
          if (r.avail_in !== 0 || x.lookahead !== 0 || N !== d && x.status !== 666) {
            var $ = x.strategy === 2 ? (function(I, Y) {
              for (var q; ; ) {
                if (I.lookahead === 0 && (nt(I), I.lookahead === 0)) {
                  if (Y === d) return o;
                  break;
                }
                if (I.match_length = 0, q = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++, q && (R(I, !1), I.strm.avail_out === 0)) return o;
              }
              return I.insert = 0, Y === y ? (R(I, !0), I.strm.avail_out === 0 ? Q : X) : I.last_lit && (R(I, !1), I.strm.avail_out === 0) ? o : D;
            })(x, N) : x.strategy === 3 ? (function(I, Y) {
              for (var q, H, J, ht, at = I.window; ; ) {
                if (I.lookahead <= j) {
                  if (nt(I), I.lookahead <= j && Y === d) return o;
                  if (I.lookahead === 0) break;
                }
                if (I.match_length = 0, I.lookahead >= M && 0 < I.strstart && (H = at[J = I.strstart - 1]) === at[++J] && H === at[++J] && H === at[++J]) {
                  ht = I.strstart + j;
                  do
                    ;
                  while (H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && J < ht);
                  I.match_length = j - (ht - J), I.match_length > I.lookahead && (I.match_length = I.lookahead);
                }
                if (I.match_length >= M ? (q = n._tr_tally(I, 1, I.match_length - M), I.lookahead -= I.match_length, I.strstart += I.match_length, I.match_length = 0) : (q = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++), q && (R(I, !1), I.strm.avail_out === 0)) return o;
              }
              return I.insert = 0, Y === y ? (R(I, !0), I.strm.avail_out === 0 ? Q : X) : I.last_lit && (R(I, !1), I.strm.avail_out === 0) ? o : D;
            })(x, N) : i[x.level].func(x, N);
            if ($ !== Q && $ !== X || (x.status = 666), $ === o || $ === Q) return r.avail_out === 0 && (x.last_flush = -1), l;
            if ($ === D && (N === 1 ? n._tr_align(x) : N !== 5 && (n._tr_stored_block(x, 0, 0, !1), N === 3 && (Z(x.head), x.lookahead === 0 && (x.strstart = 0, x.block_start = 0, x.insert = 0))), C(r), r.avail_out === 0)) return x.last_flush = -1, l;
          }
          return N !== y ? l : x.wrap <= 0 ? 1 : (x.wrap === 2 ? (G(x, 255 & r.adler), G(x, r.adler >> 8 & 255), G(x, r.adler >> 16 & 255), G(x, r.adler >> 24 & 255), G(x, 255 & r.total_in), G(x, r.total_in >> 8 & 255), G(x, r.total_in >> 16 & 255), G(x, r.total_in >> 24 & 255)) : (V(x, r.adler >>> 16), V(x, 65535 & r.adler)), C(r), 0 < x.wrap && (x.wrap = -x.wrap), x.pending !== 0 ? l : 1);
        }, c.deflateEnd = function(r) {
          var N;
          return r && r.state ? (N = r.state.status) !== S && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== F && N !== 666 ? et(r, m) : (r.state = null, N === F ? et(r, -3) : l) : m;
        }, c.deflateSetDictionary = function(r, N) {
          var B, x, _, z, W, $, I, Y, q = N.length;
          if (!r || !r.state || (z = (B = r.state).wrap) === 2 || z === 1 && B.status !== S || B.lookahead) return m;
          for (z === 1 && (r.adler = u(r.adler, N, q, 0)), B.wrap = 0, q >= B.w_size && (z === 0 && (Z(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), Y = new a.Buf8(B.w_size), a.arraySet(Y, N, q - B.w_size, B.w_size, 0), N = Y, q = B.w_size), W = r.avail_in, $ = r.next_in, I = r.input, r.avail_in = q, r.next_in = 0, r.input = N, nt(B); B.lookahead >= M; ) {
            for (x = B.strstart, _ = B.lookahead - (M - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[x + M - 1]) & B.hash_mask, B.prev[x & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = x, x++, --_; ) ;
            B.strstart = x, B.lookahead = M - 1, nt(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = M - 1, B.match_available = 0, r.next_in = $, r.input = I, r.avail_in = W, B.wrap = z, l;
        }, c.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, h, c) {
        h.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, h, c) {
        h.exports = function(i, a) {
          var n, u, w, b, d, y, l, m, s, p, f, v, E, k, A, P, O, L, M, j, K, S, F, o, D;
          n = i.state, u = i.next_in, o = i.input, w = u + (i.avail_in - 5), b = i.next_out, D = i.output, d = b - (a - i.avail_out), y = b + (i.avail_out - 257), l = n.dmax, m = n.wsize, s = n.whave, p = n.wnext, f = n.window, v = n.hold, E = n.bits, k = n.lencode, A = n.distcode, P = (1 << n.lenbits) - 1, O = (1 << n.distbits) - 1;
          t: do {
            E < 15 && (v += o[u++] << E, E += 8, v += o[u++] << E, E += 8), L = k[v & P];
            e: for (; ; ) {
              if (v >>>= M = L >>> 24, E -= M, (M = L >>> 16 & 255) === 0) D[b++] = 65535 & L;
              else {
                if (!(16 & M)) {
                  if ((64 & M) == 0) {
                    L = k[(65535 & L) + (v & (1 << M) - 1)];
                    continue e;
                  }
                  if (32 & M) {
                    n.mode = 12;
                    break t;
                  }
                  i.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                j = 65535 & L, (M &= 15) && (E < M && (v += o[u++] << E, E += 8), j += v & (1 << M) - 1, v >>>= M, E -= M), E < 15 && (v += o[u++] << E, E += 8, v += o[u++] << E, E += 8), L = A[v & O];
                r: for (; ; ) {
                  if (v >>>= M = L >>> 24, E -= M, !(16 & (M = L >>> 16 & 255))) {
                    if ((64 & M) == 0) {
                      L = A[(65535 & L) + (v & (1 << M) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, E < (M &= 15) && (v += o[u++] << E, (E += 8) < M && (v += o[u++] << E, E += 8)), l < (K += v & (1 << M) - 1)) {
                    i.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (v >>>= M, E -= M, (M = b - d) < K) {
                    if (s < (M = K - M) && n.sane) {
                      i.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (F = f, (S = 0) === p) {
                      if (S += m - M, M < j) {
                        for (j -= M; D[b++] = f[S++], --M; ) ;
                        S = b - K, F = D;
                      }
                    } else if (p < M) {
                      if (S += m + p - M, (M -= p) < j) {
                        for (j -= M; D[b++] = f[S++], --M; ) ;
                        if (S = 0, p < j) {
                          for (j -= M = p; D[b++] = f[S++], --M; ) ;
                          S = b - K, F = D;
                        }
                      }
                    } else if (S += p - M, M < j) {
                      for (j -= M; D[b++] = f[S++], --M; ) ;
                      S = b - K, F = D;
                    }
                    for (; 2 < j; ) D[b++] = F[S++], D[b++] = F[S++], D[b++] = F[S++], j -= 3;
                    j && (D[b++] = F[S++], 1 < j && (D[b++] = F[S++]));
                  } else {
                    for (S = b - K; D[b++] = D[S++], D[b++] = D[S++], D[b++] = D[S++], 2 < (j -= 3); ) ;
                    j && (D[b++] = D[S++], 1 < j && (D[b++] = D[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (u < w && b < y);
          u -= j = E >> 3, v &= (1 << (E -= j << 3)) - 1, i.next_in = u, i.next_out = b, i.avail_in = u < w ? w - u + 5 : 5 - (u - w), i.avail_out = b < y ? y - b + 257 : 257 - (b - y), n.hold = v, n.bits = E;
        };
      }, {}], 49: [function(e, h, c) {
        var i = e("../utils/common"), a = e("./adler32"), n = e("./crc32"), u = e("./inffast"), w = e("./inftrees"), b = 1, d = 2, y = 0, l = -2, m = 1, s = 852, p = 592;
        function f(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function v() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function E(S) {
          var F;
          return S && S.state ? (F = S.state, S.total_in = S.total_out = F.total = 0, S.msg = "", F.wrap && (S.adler = 1 & F.wrap), F.mode = m, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new i.Buf32(s), F.distcode = F.distdyn = new i.Buf32(p), F.sane = 1, F.back = -1, y) : l;
        }
        function k(S) {
          var F;
          return S && S.state ? ((F = S.state).wsize = 0, F.whave = 0, F.wnext = 0, E(S)) : l;
        }
        function A(S, F) {
          var o, D;
          return S && S.state ? (D = S.state, F < 0 ? (o = 0, F = -F) : (o = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? l : (D.window !== null && D.wbits !== F && (D.window = null), D.wrap = o, D.wbits = F, k(S))) : l;
        }
        function P(S, F) {
          var o, D;
          return S ? (D = new v(), (S.state = D).window = null, (o = A(S, F)) !== y && (S.state = null), o) : l;
        }
        var O, L, M = !0;
        function j(S) {
          if (M) {
            var F;
            for (O = new i.Buf32(512), L = new i.Buf32(32), F = 0; F < 144; ) S.lens[F++] = 8;
            for (; F < 256; ) S.lens[F++] = 9;
            for (; F < 280; ) S.lens[F++] = 7;
            for (; F < 288; ) S.lens[F++] = 8;
            for (w(b, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), F = 0; F < 32; ) S.lens[F++] = 5;
            w(d, S.lens, 0, 32, L, 0, S.work, { bits: 5 }), M = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = L, S.distbits = 5;
        }
        function K(S, F, o, D) {
          var Q, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new i.Buf8(X.wsize)), D >= X.wsize ? (i.arraySet(X.window, F, o - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (D < (Q = X.wsize - X.wnext) && (Q = D), i.arraySet(X.window, F, o - D, Q, X.wnext), (D -= Q) ? (i.arraySet(X.window, F, o - D, D, 0), X.wnext = D, X.whave = X.wsize) : (X.wnext += Q, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += Q))), 0;
        }
        c.inflateReset = k, c.inflateReset2 = A, c.inflateResetKeep = E, c.inflateInit = function(S) {
          return P(S, 15);
        }, c.inflateInit2 = P, c.inflate = function(S, F) {
          var o, D, Q, X, et, T, Z, C, R, G, V, U, nt, lt, tt, rt, st, ot, it, ct, r, N, B, x, _ = 0, z = new i.Buf8(4), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return l;
          (o = S.state).mode === 12 && (o.mode = 13), et = S.next_out, Q = S.output, Z = S.avail_out, X = S.next_in, D = S.input, T = S.avail_in, C = o.hold, R = o.bits, G = T, V = Z, N = y;
          t: for (; ; ) switch (o.mode) {
            case m:
              if (o.wrap === 0) {
                o.mode = 13;
                break;
              }
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if (2 & o.wrap && C === 35615) {
                z[o.check = 0] = 255 & C, z[1] = C >>> 8 & 255, o.check = n(o.check, z, 2, 0), R = C = 0, o.mode = 2;
                break;
              }
              if (o.flags = 0, o.head && (o.head.done = !1), !(1 & o.wrap) || (((255 & C) << 8) + (C >> 8)) % 31) {
                S.msg = "incorrect header check", o.mode = 30;
                break;
              }
              if ((15 & C) != 8) {
                S.msg = "unknown compression method", o.mode = 30;
                break;
              }
              if (R -= 4, r = 8 + (15 & (C >>>= 4)), o.wbits === 0) o.wbits = r;
              else if (r > o.wbits) {
                S.msg = "invalid window size", o.mode = 30;
                break;
              }
              o.dmax = 1 << r, S.adler = o.check = 1, o.mode = 512 & C ? 10 : 12, R = C = 0;
              break;
            case 2:
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if (o.flags = C, (255 & o.flags) != 8) {
                S.msg = "unknown compression method", o.mode = 30;
                break;
              }
              if (57344 & o.flags) {
                S.msg = "unknown header flags set", o.mode = 30;
                break;
              }
              o.head && (o.head.text = C >> 8 & 1), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = n(o.check, z, 2, 0)), R = C = 0, o.mode = 3;
            case 3:
              for (; R < 32; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              o.head && (o.head.time = C), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, z[2] = C >>> 16 & 255, z[3] = C >>> 24 & 255, o.check = n(o.check, z, 4, 0)), R = C = 0, o.mode = 4;
            case 4:
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              o.head && (o.head.xflags = 255 & C, o.head.os = C >> 8), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = n(o.check, z, 2, 0)), R = C = 0, o.mode = 5;
            case 5:
              if (1024 & o.flags) {
                for (; R < 16; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                o.length = C, o.head && (o.head.extra_len = C), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = n(o.check, z, 2, 0)), R = C = 0;
              } else o.head && (o.head.extra = null);
              o.mode = 6;
            case 6:
              if (1024 & o.flags && (T < (U = o.length) && (U = T), U && (o.head && (r = o.head.extra_len - o.length, o.head.extra || (o.head.extra = new Array(o.head.extra_len)), i.arraySet(o.head.extra, D, X, U, r)), 512 & o.flags && (o.check = n(o.check, D, U, X)), T -= U, X += U, o.length -= U), o.length)) break t;
              o.length = 0, o.mode = 7;
            case 7:
              if (2048 & o.flags) {
                if (T === 0) break t;
                for (U = 0; r = D[X + U++], o.head && r && o.length < 65536 && (o.head.name += String.fromCharCode(r)), r && U < T; ) ;
                if (512 & o.flags && (o.check = n(o.check, D, U, X)), T -= U, X += U, r) break t;
              } else o.head && (o.head.name = null);
              o.length = 0, o.mode = 8;
            case 8:
              if (4096 & o.flags) {
                if (T === 0) break t;
                for (U = 0; r = D[X + U++], o.head && r && o.length < 65536 && (o.head.comment += String.fromCharCode(r)), r && U < T; ) ;
                if (512 & o.flags && (o.check = n(o.check, D, U, X)), T -= U, X += U, r) break t;
              } else o.head && (o.head.comment = null);
              o.mode = 9;
            case 9:
              if (512 & o.flags) {
                for (; R < 16; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                if (C !== (65535 & o.check)) {
                  S.msg = "header crc mismatch", o.mode = 30;
                  break;
                }
                R = C = 0;
              }
              o.head && (o.head.hcrc = o.flags >> 9 & 1, o.head.done = !0), S.adler = o.check = 0, o.mode = 12;
              break;
            case 10:
              for (; R < 32; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              S.adler = o.check = f(C), R = C = 0, o.mode = 11;
            case 11:
              if (o.havedict === 0) return S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, 2;
              S.adler = o.check = 1, o.mode = 12;
            case 12:
              if (F === 5 || F === 6) break t;
            case 13:
              if (o.last) {
                C >>>= 7 & R, R -= 7 & R, o.mode = 27;
                break;
              }
              for (; R < 3; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              switch (o.last = 1 & C, R -= 1, 3 & (C >>>= 1)) {
                case 0:
                  o.mode = 14;
                  break;
                case 1:
                  if (j(o), o.mode = 20, F !== 6) break;
                  C >>>= 2, R -= 2;
                  break t;
                case 2:
                  o.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", o.mode = 30;
              }
              C >>>= 2, R -= 2;
              break;
            case 14:
              for (C >>>= 7 & R, R -= 7 & R; R < 32; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if ((65535 & C) != (C >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", o.mode = 30;
                break;
              }
              if (o.length = 65535 & C, R = C = 0, o.mode = 15, F === 6) break t;
            case 15:
              o.mode = 16;
            case 16:
              if (U = o.length) {
                if (T < U && (U = T), Z < U && (U = Z), U === 0) break t;
                i.arraySet(Q, D, X, U, et), T -= U, X += U, Z -= U, et += U, o.length -= U;
                break;
              }
              o.mode = 12;
              break;
            case 17:
              for (; R < 14; ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if (o.nlen = 257 + (31 & C), C >>>= 5, R -= 5, o.ndist = 1 + (31 & C), C >>>= 5, R -= 5, o.ncode = 4 + (15 & C), C >>>= 4, R -= 4, 286 < o.nlen || 30 < o.ndist) {
                S.msg = "too many length or distance symbols", o.mode = 30;
                break;
              }
              o.have = 0, o.mode = 18;
            case 18:
              for (; o.have < o.ncode; ) {
                for (; R < 3; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                o.lens[W[o.have++]] = 7 & C, C >>>= 3, R -= 3;
              }
              for (; o.have < 19; ) o.lens[W[o.have++]] = 0;
              if (o.lencode = o.lendyn, o.lenbits = 7, B = { bits: o.lenbits }, N = w(0, o.lens, 0, 19, o.lencode, 0, o.work, B), o.lenbits = B.bits, N) {
                S.msg = "invalid code lengths set", o.mode = 30;
                break;
              }
              o.have = 0, o.mode = 19;
            case 19:
              for (; o.have < o.nlen + o.ndist; ) {
                for (; rt = (_ = o.lencode[C & (1 << o.lenbits) - 1]) >>> 16 & 255, st = 65535 & _, !((tt = _ >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                if (st < 16) C >>>= tt, R -= tt, o.lens[o.have++] = st;
                else {
                  if (st === 16) {
                    for (x = tt + 2; R < x; ) {
                      if (T === 0) break t;
                      T--, C += D[X++] << R, R += 8;
                    }
                    if (C >>>= tt, R -= tt, o.have === 0) {
                      S.msg = "invalid bit length repeat", o.mode = 30;
                      break;
                    }
                    r = o.lens[o.have - 1], U = 3 + (3 & C), C >>>= 2, R -= 2;
                  } else if (st === 17) {
                    for (x = tt + 3; R < x; ) {
                      if (T === 0) break t;
                      T--, C += D[X++] << R, R += 8;
                    }
                    R -= tt, r = 0, U = 3 + (7 & (C >>>= tt)), C >>>= 3, R -= 3;
                  } else {
                    for (x = tt + 7; R < x; ) {
                      if (T === 0) break t;
                      T--, C += D[X++] << R, R += 8;
                    }
                    R -= tt, r = 0, U = 11 + (127 & (C >>>= tt)), C >>>= 7, R -= 7;
                  }
                  if (o.have + U > o.nlen + o.ndist) {
                    S.msg = "invalid bit length repeat", o.mode = 30;
                    break;
                  }
                  for (; U--; ) o.lens[o.have++] = r;
                }
              }
              if (o.mode === 30) break;
              if (o.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", o.mode = 30;
                break;
              }
              if (o.lenbits = 9, B = { bits: o.lenbits }, N = w(b, o.lens, 0, o.nlen, o.lencode, 0, o.work, B), o.lenbits = B.bits, N) {
                S.msg = "invalid literal/lengths set", o.mode = 30;
                break;
              }
              if (o.distbits = 6, o.distcode = o.distdyn, B = { bits: o.distbits }, N = w(d, o.lens, o.nlen, o.ndist, o.distcode, 0, o.work, B), o.distbits = B.bits, N) {
                S.msg = "invalid distances set", o.mode = 30;
                break;
              }
              if (o.mode = 20, F === 6) break t;
            case 20:
              o.mode = 21;
            case 21:
              if (6 <= T && 258 <= Z) {
                S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, u(S, V), et = S.next_out, Q = S.output, Z = S.avail_out, X = S.next_in, D = S.input, T = S.avail_in, C = o.hold, R = o.bits, o.mode === 12 && (o.back = -1);
                break;
              }
              for (o.back = 0; rt = (_ = o.lencode[C & (1 << o.lenbits) - 1]) >>> 16 & 255, st = 65535 & _, !((tt = _ >>> 24) <= R); ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if (rt && (240 & rt) == 0) {
                for (ot = tt, it = rt, ct = st; rt = (_ = o.lencode[ct + ((C & (1 << ot + it) - 1) >> ot)]) >>> 16 & 255, st = 65535 & _, !(ot + (tt = _ >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                C >>>= ot, R -= ot, o.back += ot;
              }
              if (C >>>= tt, R -= tt, o.back += tt, o.length = st, rt === 0) {
                o.mode = 26;
                break;
              }
              if (32 & rt) {
                o.back = -1, o.mode = 12;
                break;
              }
              if (64 & rt) {
                S.msg = "invalid literal/length code", o.mode = 30;
                break;
              }
              o.extra = 15 & rt, o.mode = 22;
            case 22:
              if (o.extra) {
                for (x = o.extra; R < x; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                o.length += C & (1 << o.extra) - 1, C >>>= o.extra, R -= o.extra, o.back += o.extra;
              }
              o.was = o.length, o.mode = 23;
            case 23:
              for (; rt = (_ = o.distcode[C & (1 << o.distbits) - 1]) >>> 16 & 255, st = 65535 & _, !((tt = _ >>> 24) <= R); ) {
                if (T === 0) break t;
                T--, C += D[X++] << R, R += 8;
              }
              if ((240 & rt) == 0) {
                for (ot = tt, it = rt, ct = st; rt = (_ = o.distcode[ct + ((C & (1 << ot + it) - 1) >> ot)]) >>> 16 & 255, st = 65535 & _, !(ot + (tt = _ >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                C >>>= ot, R -= ot, o.back += ot;
              }
              if (C >>>= tt, R -= tt, o.back += tt, 64 & rt) {
                S.msg = "invalid distance code", o.mode = 30;
                break;
              }
              o.offset = st, o.extra = 15 & rt, o.mode = 24;
            case 24:
              if (o.extra) {
                for (x = o.extra; R < x; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                o.offset += C & (1 << o.extra) - 1, C >>>= o.extra, R -= o.extra, o.back += o.extra;
              }
              if (o.offset > o.dmax) {
                S.msg = "invalid distance too far back", o.mode = 30;
                break;
              }
              o.mode = 25;
            case 25:
              if (Z === 0) break t;
              if (U = V - Z, o.offset > U) {
                if ((U = o.offset - U) > o.whave && o.sane) {
                  S.msg = "invalid distance too far back", o.mode = 30;
                  break;
                }
                nt = U > o.wnext ? (U -= o.wnext, o.wsize - U) : o.wnext - U, U > o.length && (U = o.length), lt = o.window;
              } else lt = Q, nt = et - o.offset, U = o.length;
              for (Z < U && (U = Z), Z -= U, o.length -= U; Q[et++] = lt[nt++], --U; ) ;
              o.length === 0 && (o.mode = 21);
              break;
            case 26:
              if (Z === 0) break t;
              Q[et++] = o.length, Z--, o.mode = 21;
              break;
            case 27:
              if (o.wrap) {
                for (; R < 32; ) {
                  if (T === 0) break t;
                  T--, C |= D[X++] << R, R += 8;
                }
                if (V -= Z, S.total_out += V, o.total += V, V && (S.adler = o.check = o.flags ? n(o.check, Q, V, et - V) : a(o.check, Q, V, et - V)), V = Z, (o.flags ? C : f(C)) !== o.check) {
                  S.msg = "incorrect data check", o.mode = 30;
                  break;
                }
                R = C = 0;
              }
              o.mode = 28;
            case 28:
              if (o.wrap && o.flags) {
                for (; R < 32; ) {
                  if (T === 0) break t;
                  T--, C += D[X++] << R, R += 8;
                }
                if (C !== (4294967295 & o.total)) {
                  S.msg = "incorrect length check", o.mode = 30;
                  break;
                }
                R = C = 0;
              }
              o.mode = 29;
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
          return S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, (o.wsize || V !== S.avail_out && o.mode < 30 && (o.mode < 27 || F !== 4)) && K(S, S.output, S.next_out, V - S.avail_out) ? (o.mode = 31, -4) : (G -= S.avail_in, V -= S.avail_out, S.total_in += G, S.total_out += V, o.total += V, o.wrap && V && (S.adler = o.check = o.flags ? n(o.check, Q, V, S.next_out - V) : a(o.check, Q, V, S.next_out - V)), S.data_type = o.bits + (o.last ? 64 : 0) + (o.mode === 12 ? 128 : 0) + (o.mode === 20 || o.mode === 15 ? 256 : 0), (G == 0 && V === 0 || F === 4) && N === y && (N = -5), N);
        }, c.inflateEnd = function(S) {
          if (!S || !S.state) return l;
          var F = S.state;
          return F.window && (F.window = null), S.state = null, y;
        }, c.inflateGetHeader = function(S, F) {
          var o;
          return S && S.state ? (2 & (o = S.state).wrap) == 0 ? l : ((o.head = F).done = !1, y) : l;
        }, c.inflateSetDictionary = function(S, F) {
          var o, D = F.length;
          return S && S.state ? (o = S.state).wrap !== 0 && o.mode !== 11 ? l : o.mode === 11 && a(1, F, D, 0) !== o.check ? -3 : K(S, F, D, D) ? (o.mode = 31, -4) : (o.havedict = 1, y) : l;
        }, c.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, h, c) {
        var i = e("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], u = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], w = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        h.exports = function(b, d, y, l, m, s, p, f) {
          var v, E, k, A, P, O, L, M, j, K = f.bits, S = 0, F = 0, o = 0, D = 0, Q = 0, X = 0, et = 0, T = 0, Z = 0, C = 0, R = null, G = 0, V = new i.Buf16(16), U = new i.Buf16(16), nt = null, lt = 0;
          for (S = 0; S <= 15; S++) V[S] = 0;
          for (F = 0; F < l; F++) V[d[y + F]]++;
          for (Q = K, D = 15; 1 <= D && V[D] === 0; D--) ;
          if (D < Q && (Q = D), D === 0) return m[s++] = 20971520, m[s++] = 20971520, f.bits = 1, 0;
          for (o = 1; o < D && V[o] === 0; o++) ;
          for (Q < o && (Q = o), S = T = 1; S <= 15; S++) if (T <<= 1, (T -= V[S]) < 0) return -1;
          if (0 < T && (b === 0 || D !== 1)) return -1;
          for (U[1] = 0, S = 1; S < 15; S++) U[S + 1] = U[S] + V[S];
          for (F = 0; F < l; F++) d[y + F] !== 0 && (p[U[d[y + F]]++] = F);
          if (O = b === 0 ? (R = nt = p, 19) : b === 1 ? (R = a, G -= 257, nt = n, lt -= 257, 256) : (R = u, nt = w, -1), S = o, P = s, et = F = C = 0, k = -1, A = (Z = 1 << (X = Q)) - 1, b === 1 && 852 < Z || b === 2 && 592 < Z) return 1;
          for (; ; ) {
            for (L = S - et, j = p[F] < O ? (M = 0, p[F]) : p[F] > O ? (M = nt[lt + p[F]], R[G + p[F]]) : (M = 96, 0), v = 1 << S - et, o = E = 1 << X; m[P + (C >> et) + (E -= v)] = L << 24 | M << 16 | j | 0, E !== 0; ) ;
            for (v = 1 << S - 1; C & v; ) v >>= 1;
            if (v !== 0 ? (C &= v - 1, C += v) : C = 0, F++, --V[S] == 0) {
              if (S === D) break;
              S = d[y + p[F]];
            }
            if (Q < S && (C & A) !== k) {
              for (et === 0 && (et = Q), P += o, T = 1 << (X = S - et); X + et < D && !((T -= V[X + et]) <= 0); ) X++, T <<= 1;
              if (Z += 1 << X, b === 1 && 852 < Z || b === 2 && 592 < Z) return 1;
              m[k = C & A] = Q << 24 | X << 16 | P - s | 0;
            }
          }
          return C !== 0 && (m[P + C] = S - et << 24 | 64 << 16 | 0), f.bits = Q, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, h, c) {
        h.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, h, c) {
        var i = e("../utils/common"), a = 0, n = 1;
        function u(_) {
          for (var z = _.length; 0 <= --z; ) _[z] = 0;
        }
        var w = 0, b = 29, d = 256, y = d + 1 + b, l = 30, m = 19, s = 2 * y + 1, p = 15, f = 16, v = 7, E = 256, k = 16, A = 17, P = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], M = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (y + 2));
        u(K);
        var S = new Array(2 * l);
        u(S);
        var F = new Array(512);
        u(F);
        var o = new Array(256);
        u(o);
        var D = new Array(b);
        u(D);
        var Q, X, et, T = new Array(l);
        function Z(_, z, W, $, I) {
          this.static_tree = _, this.extra_bits = z, this.extra_base = W, this.elems = $, this.max_length = I, this.has_stree = _ && _.length;
        }
        function C(_, z) {
          this.dyn_tree = _, this.max_code = 0, this.stat_desc = z;
        }
        function R(_) {
          return _ < 256 ? F[_] : F[256 + (_ >>> 7)];
        }
        function G(_, z) {
          _.pending_buf[_.pending++] = 255 & z, _.pending_buf[_.pending++] = z >>> 8 & 255;
        }
        function V(_, z, W) {
          _.bi_valid > f - W ? (_.bi_buf |= z << _.bi_valid & 65535, G(_, _.bi_buf), _.bi_buf = z >> f - _.bi_valid, _.bi_valid += W - f) : (_.bi_buf |= z << _.bi_valid & 65535, _.bi_valid += W);
        }
        function U(_, z, W) {
          V(_, W[2 * z], W[2 * z + 1]);
        }
        function nt(_, z) {
          for (var W = 0; W |= 1 & _, _ >>>= 1, W <<= 1, 0 < --z; ) ;
          return W >>> 1;
        }
        function lt(_, z, W) {
          var $, I, Y = new Array(p + 1), q = 0;
          for ($ = 1; $ <= p; $++) Y[$] = q = q + W[$ - 1] << 1;
          for (I = 0; I <= z; I++) {
            var H = _[2 * I + 1];
            H !== 0 && (_[2 * I] = nt(Y[H]++, H));
          }
        }
        function tt(_) {
          var z;
          for (z = 0; z < y; z++) _.dyn_ltree[2 * z] = 0;
          for (z = 0; z < l; z++) _.dyn_dtree[2 * z] = 0;
          for (z = 0; z < m; z++) _.bl_tree[2 * z] = 0;
          _.dyn_ltree[2 * E] = 1, _.opt_len = _.static_len = 0, _.last_lit = _.matches = 0;
        }
        function rt(_) {
          8 < _.bi_valid ? G(_, _.bi_buf) : 0 < _.bi_valid && (_.pending_buf[_.pending++] = _.bi_buf), _.bi_buf = 0, _.bi_valid = 0;
        }
        function st(_, z, W, $) {
          var I = 2 * z, Y = 2 * W;
          return _[I] < _[Y] || _[I] === _[Y] && $[z] <= $[W];
        }
        function ot(_, z, W) {
          for (var $ = _.heap[W], I = W << 1; I <= _.heap_len && (I < _.heap_len && st(z, _.heap[I + 1], _.heap[I], _.depth) && I++, !st(z, $, _.heap[I], _.depth)); ) _.heap[W] = _.heap[I], W = I, I <<= 1;
          _.heap[W] = $;
        }
        function it(_, z, W) {
          var $, I, Y, q, H = 0;
          if (_.last_lit !== 0) for (; $ = _.pending_buf[_.d_buf + 2 * H] << 8 | _.pending_buf[_.d_buf + 2 * H + 1], I = _.pending_buf[_.l_buf + H], H++, $ === 0 ? U(_, I, z) : (U(_, (Y = o[I]) + d + 1, z), (q = O[Y]) !== 0 && V(_, I -= D[Y], q), U(_, Y = R(--$), W), (q = L[Y]) !== 0 && V(_, $ -= T[Y], q)), H < _.last_lit; ) ;
          U(_, E, z);
        }
        function ct(_, z) {
          var W, $, I, Y = z.dyn_tree, q = z.stat_desc.static_tree, H = z.stat_desc.has_stree, J = z.stat_desc.elems, ht = -1;
          for (_.heap_len = 0, _.heap_max = s, W = 0; W < J; W++) Y[2 * W] !== 0 ? (_.heap[++_.heap_len] = ht = W, _.depth[W] = 0) : Y[2 * W + 1] = 0;
          for (; _.heap_len < 2; ) Y[2 * (I = _.heap[++_.heap_len] = ht < 2 ? ++ht : 0)] = 1, _.depth[I] = 0, _.opt_len--, H && (_.static_len -= q[2 * I + 1]);
          for (z.max_code = ht, W = _.heap_len >> 1; 1 <= W; W--) ot(_, Y, W);
          for (I = J; W = _.heap[1], _.heap[1] = _.heap[_.heap_len--], ot(_, Y, 1), $ = _.heap[1], _.heap[--_.heap_max] = W, _.heap[--_.heap_max] = $, Y[2 * I] = Y[2 * W] + Y[2 * $], _.depth[I] = (_.depth[W] >= _.depth[$] ? _.depth[W] : _.depth[$]) + 1, Y[2 * W + 1] = Y[2 * $ + 1] = I, _.heap[1] = I++, ot(_, Y, 1), 2 <= _.heap_len; ) ;
          _.heap[--_.heap_max] = _.heap[1], (function(at, mt) {
            var At, yt, zt, dt, Mt, Ft, _t = mt.dyn_tree, Wt = mt.max_code, se = mt.stat_desc.static_tree, ae = mt.stat_desc.has_stree, oe = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, Rt = mt.stat_desc.max_length, Ot = 0;
            for (dt = 0; dt <= p; dt++) at.bl_count[dt] = 0;
            for (_t[2 * at.heap[at.heap_max] + 1] = 0, At = at.heap_max + 1; At < s; At++) Rt < (dt = _t[2 * _t[2 * (yt = at.heap[At]) + 1] + 1] + 1) && (dt = Rt, Ot++), _t[2 * yt + 1] = dt, Wt < yt || (at.bl_count[dt]++, Mt = 0, jt <= yt && (Mt = oe[yt - jt]), Ft = _t[2 * yt], at.opt_len += Ft * (dt + Mt), ae && (at.static_len += Ft * (se[2 * yt + 1] + Mt)));
            if (Ot !== 0) {
              do {
                for (dt = Rt - 1; at.bl_count[dt] === 0; ) dt--;
                at.bl_count[dt]--, at.bl_count[dt + 1] += 2, at.bl_count[Rt]--, Ot -= 2;
              } while (0 < Ot);
              for (dt = Rt; dt !== 0; dt--) for (yt = at.bl_count[dt]; yt !== 0; ) Wt < (zt = at.heap[--At]) || (_t[2 * zt + 1] !== dt && (at.opt_len += (dt - _t[2 * zt + 1]) * _t[2 * zt], _t[2 * zt + 1] = dt), yt--);
            }
          })(_, z), lt(Y, ht, _.bl_count);
        }
        function r(_, z, W) {
          var $, I, Y = -1, q = z[1], H = 0, J = 7, ht = 4;
          for (q === 0 && (J = 138, ht = 3), z[2 * (W + 1) + 1] = 65535, $ = 0; $ <= W; $++) I = q, q = z[2 * ($ + 1) + 1], ++H < J && I === q || (H < ht ? _.bl_tree[2 * I] += H : I !== 0 ? (I !== Y && _.bl_tree[2 * I]++, _.bl_tree[2 * k]++) : H <= 10 ? _.bl_tree[2 * A]++ : _.bl_tree[2 * P]++, Y = I, ht = (H = 0) === q ? (J = 138, 3) : I === q ? (J = 6, 3) : (J = 7, 4));
        }
        function N(_, z, W) {
          var $, I, Y = -1, q = z[1], H = 0, J = 7, ht = 4;
          for (q === 0 && (J = 138, ht = 3), $ = 0; $ <= W; $++) if (I = q, q = z[2 * ($ + 1) + 1], !(++H < J && I === q)) {
            if (H < ht) for (; U(_, I, _.bl_tree), --H != 0; ) ;
            else I !== 0 ? (I !== Y && (U(_, I, _.bl_tree), H--), U(_, k, _.bl_tree), V(_, H - 3, 2)) : H <= 10 ? (U(_, A, _.bl_tree), V(_, H - 3, 3)) : (U(_, P, _.bl_tree), V(_, H - 11, 7));
            Y = I, ht = (H = 0) === q ? (J = 138, 3) : I === q ? (J = 6, 3) : (J = 7, 4);
          }
        }
        u(T);
        var B = !1;
        function x(_, z, W, $) {
          V(_, (w << 1) + ($ ? 1 : 0), 3), (function(I, Y, q, H) {
            rt(I), G(I, q), G(I, ~q), i.arraySet(I.pending_buf, I.window, Y, q, I.pending), I.pending += q;
          })(_, z, W);
        }
        c._tr_init = function(_) {
          B || ((function() {
            var z, W, $, I, Y, q = new Array(p + 1);
            for (I = $ = 0; I < b - 1; I++) for (D[I] = $, z = 0; z < 1 << O[I]; z++) o[$++] = I;
            for (o[$ - 1] = I, I = Y = 0; I < 16; I++) for (T[I] = Y, z = 0; z < 1 << L[I]; z++) F[Y++] = I;
            for (Y >>= 7; I < l; I++) for (T[I] = Y << 7, z = 0; z < 1 << L[I] - 7; z++) F[256 + Y++] = I;
            for (W = 0; W <= p; W++) q[W] = 0;
            for (z = 0; z <= 143; ) K[2 * z + 1] = 8, z++, q[8]++;
            for (; z <= 255; ) K[2 * z + 1] = 9, z++, q[9]++;
            for (; z <= 279; ) K[2 * z + 1] = 7, z++, q[7]++;
            for (; z <= 287; ) K[2 * z + 1] = 8, z++, q[8]++;
            for (lt(K, y + 1, q), z = 0; z < l; z++) S[2 * z + 1] = 5, S[2 * z] = nt(z, 5);
            Q = new Z(K, O, d + 1, y, p), X = new Z(S, L, 0, l, p), et = new Z(new Array(0), M, 0, m, v);
          })(), B = !0), _.l_desc = new C(_.dyn_ltree, Q), _.d_desc = new C(_.dyn_dtree, X), _.bl_desc = new C(_.bl_tree, et), _.bi_buf = 0, _.bi_valid = 0, tt(_);
        }, c._tr_stored_block = x, c._tr_flush_block = function(_, z, W, $) {
          var I, Y, q = 0;
          0 < _.level ? (_.strm.data_type === 2 && (_.strm.data_type = (function(H) {
            var J, ht = 4093624447;
            for (J = 0; J <= 31; J++, ht >>>= 1) if (1 & ht && H.dyn_ltree[2 * J] !== 0) return a;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return n;
            for (J = 32; J < d; J++) if (H.dyn_ltree[2 * J] !== 0) return n;
            return a;
          })(_)), ct(_, _.l_desc), ct(_, _.d_desc), q = (function(H) {
            var J;
            for (r(H, H.dyn_ltree, H.l_desc.max_code), r(H, H.dyn_dtree, H.d_desc.max_code), ct(H, H.bl_desc), J = m - 1; 3 <= J && H.bl_tree[2 * j[J] + 1] === 0; J--) ;
            return H.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          })(_), I = _.opt_len + 3 + 7 >>> 3, (Y = _.static_len + 3 + 7 >>> 3) <= I && (I = Y)) : I = Y = W + 5, W + 4 <= I && z !== -1 ? x(_, z, W, $) : _.strategy === 4 || Y === I ? (V(_, 2 + ($ ? 1 : 0), 3), it(_, K, S)) : (V(_, 4 + ($ ? 1 : 0), 3), (function(H, J, ht, at) {
            var mt;
            for (V(H, J - 257, 5), V(H, ht - 1, 5), V(H, at - 4, 4), mt = 0; mt < at; mt++) V(H, H.bl_tree[2 * j[mt] + 1], 3);
            N(H, H.dyn_ltree, J - 1), N(H, H.dyn_dtree, ht - 1);
          })(_, _.l_desc.max_code + 1, _.d_desc.max_code + 1, q + 1), it(_, _.dyn_ltree, _.dyn_dtree)), tt(_), $ && rt(_);
        }, c._tr_tally = function(_, z, W) {
          return _.pending_buf[_.d_buf + 2 * _.last_lit] = z >>> 8 & 255, _.pending_buf[_.d_buf + 2 * _.last_lit + 1] = 255 & z, _.pending_buf[_.l_buf + _.last_lit] = 255 & W, _.last_lit++, z === 0 ? _.dyn_ltree[2 * W]++ : (_.matches++, z--, _.dyn_ltree[2 * (o[W] + d + 1)]++, _.dyn_dtree[2 * R(z)]++), _.last_lit === _.lit_bufsize - 1;
        }, c._tr_align = function(_) {
          V(_, 2, 3), U(_, E, K), (function(z) {
            z.bi_valid === 16 ? (G(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(_);
        };
      }, { "../utils/common": 41 }], 53: [function(e, h, c) {
        h.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, h, c) {
        (function(i) {
          (function(a, n) {
            if (!a.setImmediate) {
              var u, w, b, d, y = 1, l = {}, m = !1, s = a.document, p = Object.getPrototypeOf && Object.getPrototypeOf(a);
              p = p && p.setTimeout ? p : a, u = {}.toString.call(a.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  v(k);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var k = !0, A = a.onmessage;
                  return a.onmessage = function() {
                    k = !1;
                  }, a.postMessage("", "*"), a.onmessage = A, k;
                }
              })() ? (d = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", E, !1) : a.attachEvent("onmessage", E), function(k) {
                a.postMessage(d + k, "*");
              }) : a.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                v(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : s && "onreadystatechange" in s.createElement("script") ? (w = s.documentElement, function(k) {
                var A = s.createElement("script");
                A.onreadystatechange = function() {
                  v(k), A.onreadystatechange = null, w.removeChild(A), A = null;
                }, w.appendChild(A);
              }) : function(k) {
                setTimeout(v, 0, k);
              }, p.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var A = new Array(arguments.length - 1), P = 0; P < A.length; P++) A[P] = arguments[P + 1];
                var O = { callback: k, args: A };
                return l[y] = O, u(y), y++;
              }, p.clearImmediate = f;
            }
            function f(k) {
              delete l[k];
            }
            function v(k) {
              if (m) setTimeout(v, 0, k);
              else {
                var A = l[k];
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
                    f(k), m = !1;
                  }
                }
              }
            }
            function E(k) {
              k.source === a && typeof k.data == "string" && k.data.indexOf(d) === 0 && v(+k.data.slice(d.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var he = ce();
const Jt = /* @__PURE__ */ le(he);
async function ue(g) {
  const t = await de(g), e = await Jt.loadAsync(t), h = [];
  return e.forEach((c, i) => {
    if (i.dir)
      return;
    const a = fe(c);
    h.push({
      name: a,
      text: () => i.async("text"),
      arrayBuffer: () => i.async("arraybuffer")
    });
  }), h;
}
async function de(g) {
  if (g instanceof ArrayBuffer)
    return g;
  if (g instanceof Blob)
    return await g.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function fe(g) {
  let t = g.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function me(g) {
  return !!g && typeof g == "object" && !(g instanceof ArrayBuffer) && !(g instanceof Uint8Array);
}
function pe(g) {
  return g instanceof Uint8Array ? g : new Uint8Array(g);
}
function ge(g) {
  return g.byteOffset === 0 && g.byteLength === g.buffer.byteLength ? g.buffer : g.slice().buffer;
}
function xt(g, t, e = 0) {
  if (g.length < e + t.length) return !1;
  for (let h = 0; h < t.length; h++)
    if (g[e + h] !== t[h]) return !1;
  return !0;
}
function ye(g) {
  return xt(g, [80, 75, 3, 4]) || xt(g, [80, 75, 5, 6]) || xt(g, [80, 75, 7, 8]) ? "zip" : xt(g, [82, 97, 114, 33, 26, 7, 0]) || xt(g, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : xt(g, [55, 122, 188, 175, 39, 28]) ? "7z" : g.length > 262 && xt(g, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Qt(g) {
  return g.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function $t(g) {
  const t = [], e = g.map((s) => Qt(s).toLowerCase()), h = (s) => e.some(s), c = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, i = /\.(drl|xln)$/i, a = e.filter((s) => c.test(s)).length, n = e.filter((s) => i.test(s) || s.includes("drill")).length, u = h((s) => s.includes("top") && s.includes("copper") || s.endsWith(".gtl")), w = h((s) => s.includes("bot") || s.includes("bottom") || s.endsWith(".gbl")), b = h((s) => s.includes("mask") || s.includes("solder") || s.endsWith(".gts") || s.endsWith(".gbs")), d = h((s) => s.includes("silk") || s.includes("legend") || s.endsWith(".gto") || s.endsWith(".gbo")), y = h((s) => s.includes("outline") || s.includes("profile") || s.includes("edge") || s.endsWith(".gko") || s.endsWith(".gm1") || s.endsWith(".gml")), l = e.every(
    (s) => s.endsWith(".pdf") || s.endsWith(".png") || s.endsWith(".jpg") || s.endsWith(".jpeg") || s.endsWith(".svg") || s.endsWith(".txt") || s.endsWith(".md")
  );
  let m = 0;
  return g.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : l ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (a > 0 ? (m += 0.35, t.push(`Found ${a} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (m += 0.2, t.push(`Found ${n} drill-like file(s).`)), y && (m += 0.15, t.push("Found outline/profile/edge candidate.")), u && w ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (u || w) && (m += 0.1, t.push("Found at least one copper candidate.")), b && (m += 0.05, t.push("Found solder mask candidate.")), d && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && a >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function _e(g) {
  if (me(g)) {
    const i = Object.keys(g).map(Qt), { confidence: a, reasons: n } = $t(i);
    return {
      isGerber: a >= 0.6,
      archiveType: "directory",
      confidence: a,
      reasons: n,
      files: i
    };
  }
  const t = pe(g), e = ye(t);
  if (e === "zip")
    try {
      const i = ge(t), n = (await ue(i)).map((b) => b.name), { confidence: u, reasons: w } = $t(n);
      return {
        isGerber: u >= 0.6,
        archiveType: "zip",
        confidence: u,
        reasons: w,
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
  const h = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return h.includes("%FSLAX") || h.includes("%MOIN") || h.includes("%MOMM") || h.includes("G04") || h.includes("%ADD") ? {
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
  constructor(t, e, h) {
    super(e), this.name = "GerberError", this.code = t, this.details = h;
  }
}
function te(g) {
  let t = g.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function be(g) {
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
  const e = {}, h = 1e3, c = 100 * 1024 * 1024, i = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (i.length > h)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${i.length} > ${h})`
    );
  let a = 0;
  for (const [n, u] of i)
    try {
      const w = te(n), b = await u.async("arraybuffer");
      if (a += b.byteLength, a > c)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${c} bytes)`
        );
      e[w] = new Uint8Array(b);
    } catch (w) {
      console.warn(`Failed to extract file ${n}:`, w);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function ve(g, t) {
  let e;
  try {
    const d = await import("./libarchive-Bt1VdZR0.js");
    e = d.Archive ?? d.default?.Archive;
  } catch (d) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      d
    );
  }
  if (!e)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (d) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        d
      );
    }
  let h;
  try {
    const d = new Blob([ee(g)], { type: "application/octet-stream" });
    h = await e.open(d);
  } catch (d) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", d);
  }
  let c;
  try {
    c = await Promise.race([
      h.extractFiles(),
      new Promise(
        (d, y) => setTimeout(() => y(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (d) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", d);
  }
  const i = {};
  let a = 0;
  const n = 1e3, u = 100 * 1024 * 1024;
  let w = 0;
  async function b(d, y) {
    if (a >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const l of Object.keys(d)) {
      const m = d[l], s = y ? `${y}/${l}` : l;
      if (m instanceof File || m instanceof Blob) {
        a++;
        try {
          const p = await m.arrayBuffer();
          if (w += p.byteLength, w > u)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${u} bytes)`
            );
          i[te(s)] = new Uint8Array(p);
        } catch (p) {
          console.warn(`Failed to extract file ${s}:`, p);
        }
      } else m && typeof m == "object" && await b(m, s);
    }
  }
  try {
    await b(c, "");
  } finally {
    if (h && typeof h.close == "function")
      try {
        await h.close();
      } catch (d) {
        console.warn("Failed to close archive:", d);
      }
  }
  if (Object.keys(i).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return i;
}
async function re(g, t) {
  if (!g || g.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = be(g), h = 100 * 1024 * 1024;
  if (e.length > h)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${h} bytes)`
    );
  let c;
  try {
    c = await _e(e);
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
      return { archiveType: "rar", files: await ve(e, t) };
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
function wt(g, t) {
  const e = new Set(t.map((c) => c.toLowerCase()));
  return g.filter((c) => {
    const i = Lt(c), a = i.lastIndexOf(".");
    return a < 0 ? !1 : e.has(i.slice(a));
  }).sort((c, i) => c.length - i.length)[0];
}
function ut(g, t) {
  const e = t.map((c) => c.toLowerCase());
  return g.filter((c) => {
    const i = Lt(c);
    return e.every((a) => i.includes(a));
  }).sort((c, i) => c.length - i.length)[0];
}
function xe(g) {
  const t = g.filter((b) => {
    const d = Lt(b);
    return !(d.endsWith("/") || d.includes("__macosx") || d.endsWith(".ds_store"));
  }), e = wt(t, [".gtl"]) || ut(t, ["f_cu"]) || ut(t, ["top", "cu"]) || ut(t, ["top", "copper"]), h = wt(t, [".gbl"]) || ut(t, ["b_cu"]) || ut(t, ["bottom", "cu"]) || ut(t, ["bottom", "copper"]), c = wt(t, [".gts"]) || ut(t, ["f_mask"]) || ut(t, ["top", "mask"]), i = wt(t, [".gbs"]) || ut(t, ["b_mask"]) || ut(t, ["bottom", "mask"]), a = wt(t, [".gto"]) || ut(t, ["f_silks"]) || ut(t, ["f_silk"]) || ut(t, ["top", "silk"]), n = wt(t, [".gbo"]) || ut(t, ["b_silks"]) || ut(t, ["b_silk"]) || ut(t, ["bottom", "silk"]), u = wt(t, [".gko", ".gm1"]) || ut(t, ["edge", "cuts"]) || ut(t, ["outline"]) || ut(t, ["board", "outline"]), w = (
    // Excellon often .drl or .xln or .txt
    wt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    ut(t, ["drill"]) || ut(t, ["drills"]) || ut(t, ["npth"]) || ut(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: h,
    top_mask: c,
    bottom_mask: i,
    top_silk: a,
    bottom_silk: n,
    outline: u,
    drills: w
  };
}
const ke = 0.8;
function Ct(g, t, e) {
  const h = {
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
    let a = i.trim();
    if (a && !a.startsWith("G04")) {
      if (a.startsWith("%") && a.endsWith("%")) {
        Se(a, h);
        continue;
      }
      a.endsWith("*") && (a = a.slice(0, -1)), Ee(a, h);
    }
  }
  if (h.inRegion) {
    if (h.currentPath.length >= 3 && h.regionPaths.push(h.currentPath), h.regionPaths.length > 0) {
      const i = {
        loops: h.regionPaths,
        polarity: h.currentPolarity
      };
      h.regions.push(i), h.ops.push({
        kind: "region",
        polarity: h.currentPolarity,
        loops: h.regionPaths
      });
    }
    h.inRegion = !1, h.regionPaths = [], h.currentPath = [];
  }
  return {
    tracks: h.tracks,
    arcs: h.arcs,
    flashes: h.flashes,
    regions: h.regions,
    ops: h.ops
  };
}
function Se(g, t) {
  let e = g;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const h = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (h) {
      const c = parseInt(h[1], 10), i = parseInt(h[2], 10);
      parseInt(h[4], 10), t.fmtInt = c, t.fmtDec = i;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const h = t.unitScale;
    let c = h;
    if (e.includes("MOMM") ? c = 1 : e.includes("MOIN") && (c = 25.4), c !== h) {
      const i = c / h;
      for (const a of t.apertures.values())
        a.diameterMm !== void 0 && (a.diameterMm *= i), a.widthMm !== void 0 && (a.widthMm *= i), a.heightMm !== void 0 && (a.heightMm *= i);
      t.unitScale = c;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const h = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(e);
    if (!h) return;
    const c = parseInt(h[2], 10), i = h[3], a = h[4] ?? "";
    let n, u, w;
    if (a) {
      const d = a.split(/[Xx]/), y = d[0] ? parseFloat(d[0]) * t.unitScale : void 0, l = d[1] ? parseFloat(d[1]) * t.unitScale : void 0;
      i === "C" ? n = y : i === "R" || i === "O" ? (u = y, w = l, y !== void 0 && l !== void 0 ? n = Math.min(y, l) : n = y ?? l) : n = y ?? l;
    }
    const b = {
      code: c,
      shape: i,
      diameterMm: n,
      widthMm: u,
      heightMm: w
    };
    t.apertures.set(c, b);
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
function Ee(g, t) {
  if (g === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (g === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const b = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(b), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let e = null;
  const h = /D0?(\d{1,3})$/.exec(g);
  if (h && (e = parseInt(h[1], 10), g = g.slice(0, g.length - h[0].length)), e !== null && e >= 10) {
    const b = t.apertures.get(e);
    b && (t.currentAperture = b);
    return;
  }
  const c = /X([+\-]?\d+)/.exec(g), i = /Y([+\-]?\d+)/.exec(g);
  let a = t.x, n = t.y;
  if (c && (a = Yt(c[1], t)), i && (n = Yt(i[1], t)), e === null) {
    t.x = a, t.y = n;
    return;
  }
  if (t.inRegion) {
    const b = t.x, d = t.y;
    e === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: b, y: d }), t.currentPath.push({ x: a, y: n })) : e === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = a, t.y = n;
    return;
  }
  const u = t.x, w = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = a, t.y = n;
      return;
    }
    const b = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: u, y: w },
      end: { x: a, y: n },
      width: b,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: u, y: w },
      end: { x: a, y: n },
      widthMm: b
    }), t.x = a, t.y = n;
    return;
  }
  if (e === 2) {
    t.x = a, t.y = n;
    return;
  }
  if (e === 3) {
    if (t.currentAperture) {
      const b = t.currentAperture, d = b.diameterMm !== void 0 ? b.diameterMm : ke, y = {
        position: { x: a, y: n },
        diameterMm: d,
        shape: b.shape,
        polarity: t.currentPolarity
      };
      b.widthMm !== void 0 && (y.widthMm = b.widthMm), b.heightMm !== void 0 && (y.heightMm = b.heightMm), t.flashes.push(y), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: a, y: n },
        diameterMm: d,
        shape: b.shape,
        widthMm: b.widthMm,
        heightMm: b.heightMm
      });
    }
    t.x = a, t.y = n;
    return;
  }
}
function Yt(g, t) {
  const e = g.startsWith("-") ? -1 : 1, h = g.replace(/[+\-]/g, ""), c = parseInt(h, 10);
  if (Number.isNaN(c)) return 0;
  const i = Math.pow(10, t.fmtDec), a = c / i * t.unitScale;
  return e * a;
}
function Ae(g, t) {
  const e = t.split(/\r?\n/), h = /* @__PURE__ */ new Map();
  let c = null;
  const i = [];
  for (const a of e) {
    const n = a.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const u = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (u) {
          const w = u[1], b = parseFloat(u[2]);
          Number.isNaN(b) || h.set(w, b);
        }
        continue;
      }
      if (n.startsWith("T") && !n.includes("C")) {
        const u = /^T(\d+)/i.exec(n);
        u && (c = u[1]);
        continue;
      }
      if (n[0] === "X" || n.includes("X")) {
        const u = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(n);
        if (!u)
          continue;
        const w = u[1], b = u[2], d = parseFloat(w), y = parseFloat(b);
        if (Number.isNaN(d) || Number.isNaN(y))
          continue;
        const l = c && h.has(c) ? h.get(c) : 0.6;
        i.push({
          x: d,
          y,
          diameter: l,
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
function Tt(g) {
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
      loops: e.loops.map((h) => h.map((c) => ({ x: c.x * t, y: c.y * t })))
    }))
  };
}
function Re(g, t) {
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
function vt(g) {
  const t = Ut();
  for (const e of g.tracks) {
    pt(t, e.start.x, e.start.y), pt(t, e.end.x, e.end.y);
    const h = (e.width ?? 0) / 2;
    pt(t, e.start.x - h, e.start.y - h), pt(t, e.start.x + h, e.start.y + h), pt(t, e.end.x - h, e.end.y - h), pt(t, e.end.x + h, e.end.y + h);
  }
  for (const e of g.flashes) {
    const h = (e.widthMm ?? e.diameterMm) || 0, c = (e.heightMm ?? e.diameterMm) || 0;
    pt(t, e.position.x - h / 2, e.position.y - c / 2), pt(t, e.position.x + h / 2, e.position.y + c / 2);
  }
  for (const e of g.regions)
    for (const h of e.loops) for (const c of h) pt(t, c.x, c.y);
  return t;
}
function Te(g) {
  const t = Ut();
  for (const e of g) {
    const h = (e.diameter || 0) / 2;
    pt(t, e.x - h, e.y - h), pt(t, e.x + h, e.y + h);
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
const Ie = 1e3;
function gt(g) {
  return g / 25.4 * Ie;
}
function Et(g, t, e) {
  const h = g - e.minX, c = e.maxY - t;
  return { x: h, y: c };
}
function Gt(g, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${t}" viewBox="0 0 ${g} ${t}">
  <rect width="${g}" height="${t}" fill="white"/>
</svg>`.trim();
}
function ne(g) {
  let t = 1 / 0, e = 1 / 0, h = -1 / 0, c = -1 / 0;
  for (const i of g.loops)
    for (const a of i)
      t = Math.min(t, a.x), e = Math.min(e, a.y), h = Math.max(h, a.x), c = Math.max(c, a.y);
  return { minX: t, minY: e, maxX: h, maxY: c };
}
function Me(g, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let h = 0, c = 0;
  for (const b of g.regions) {
    const d = ne(b), y = (d.maxX - d.minX) * (d.maxY - d.minY);
    b.polarity === "clear" ? c = Math.max(c, y) : h = Math.max(h, y);
  }
  const i = g.tracks.filter((b) => b.polarity !== "clear").length + g.flashes.filter((b) => b.polarity !== "clear").length + g.regions.filter((b) => b.polarity !== "clear").length, a = g.tracks.filter((b) => b.polarity === "clear").length + g.flashes.filter((b) => b.polarity === "clear").length + g.regions.filter((b) => b.polarity === "clear").length, n = h > e * 0.7, u = a > i * 3, w = c > e * 0.7;
  return n ? !1 : u || w;
}
function Vt(g, t, e, h) {
  const c = t.maxX - t.minX, i = t.maxY - t.minY, a = Math.max(1, Math.round(gt(c))), n = Math.max(1, Math.round(gt(i))), u = gt(1), w = Me(g, t), b = w ? "white" : "black", d = (k, A) => {
    const P = k - t.minX, O = t.maxY - A;
    return { x: P * u, y: O * u };
  }, y = (k, A) => {
    if (k.kind === "track") {
      const P = d(k.start.x, k.start.y), O = d(k.end.x, k.end.y), L = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, M = Math.max(1, L * u);
      return `<line x1="${P.x.toFixed(2)}" y1="${P.y.toFixed(2)}" x2="${O.x.toFixed(2)}" y2="${O.y.toFixed(2)}" stroke-width="${M.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const P = d(k.position.x, k.position.y), O = k.widthMm ?? k.diameterMm ?? 0.8, L = k.heightMm ?? k.diameterMm ?? 0.8, M = Math.max(0.01, Number.isFinite(O) ? O : 0.8) * u, j = Math.max(0.01, Number.isFinite(L) ? L : 0.8) * u;
      if (k.shape === "R" || k.shape === "O") {
        const K = P.x - M / 2, S = P.y - j / 2, F = k.shape === "O" ? Math.min(M, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${S.toFixed(2)}" width="${M.toFixed(2)}" height="${j.toFixed(2)}" rx="${F.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const K = Math.max(1, Math.max(M, j) / 2);
        return `<circle cx="${P.x.toFixed(2)}" cy="${P.y.toFixed(2)}" r="${K.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (k.kind === "region") {
      const P = k.loops.map((O) => {
        if (!O.length) return "";
        const L = d(O[0].x, O[0].y), M = [`M ${L.x.toFixed(2)} ${L.y.toFixed(2)}`];
        for (let j = 1; j < O.length; j++) {
          const K = d(O[j].x, O[j].y);
          M.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return M.push("Z"), M.join(" ");
      }).join(" ");
      return P.trim() ? `<path d="${P}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, l = [];
  l.push(`<rect x="0" y="0" width="${a}" height="${n}" fill="${b}" fill-opacity="1" />`);
  for (const k of g.ops) {
    const A = k.polarity === "clear" ? "black" : "white", P = y(k, A);
    P && l.push(P);
  }
  console.log("[polarity counts]", {
    tracksClear: g.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: g.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: w
  });
  const m = (t.maxX - t.minX) * (t.maxY - t.minY);
  let s = 0, p = 0;
  for (const k of g.regions) {
    const A = ne(k), P = (A.maxX - A.minX) * (A.maxY - A.minY);
    k.polarity === "clear" ? p = Math.max(p, P) : s = Math.max(s, P);
  }
  const f = g.tracks.filter((k) => k.polarity !== "clear").length + g.flashes.filter((k) => k.polarity !== "clear").length + g.regions.filter((k) => k.polarity !== "clear").length, v = g.tracks.filter((k) => k.polarity === "clear").length + g.flashes.filter((k) => k.polarity === "clear").length + g.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: v,
    largestDarkRegionArea: s,
    largestClearRegionArea: p,
    boardArea: m,
    negative: w
  });
  const E = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${n}" viewBox="0 0 ${a} ${n}">
  <defs>
    <mask id="${E}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${a}" height="${n}" fill="${b}" fill-opacity="1" />
      ${l.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${a}" height="${n}" fill="${e}" opacity="${h}" mask="url(#${E})" />
</svg>`.trim();
}
function Ht(g, t) {
  const e = t.maxX - t.minX, h = t.maxY - t.minY, c = Math.max(1, Math.round(gt(e))), i = Math.max(1, Math.round(gt(h))), a = Math.max(1e-6, gt(1)), n = "rgba(255,255,255,0.95)", u = "rgba(255,255,255,0.95)", w = g.tracks.map((y) => {
    const l = Et(y.start.x, y.start.y, t), m = Et(y.end.x, y.end.y, t), s = Number.isFinite(y.width) ? y.width : 0.15, p = Math.max(1, s * a);
    return `<line x1="${(l.x * a).toFixed(2)}" y1="${(l.y * a).toFixed(2)}" x2="${(m.x * a).toFixed(2)}" y2="${(m.y * a).toFixed(2)}" stroke="${n}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = g.flashes.map((y) => {
    const l = Et(y.position.x, y.position.y, t), m = l.x * a, s = l.y * a, p = y.widthMm ?? y.diameterMm ?? 0.6, f = y.heightMm ?? y.diameterMm ?? 0.6;
    if (y.shape === "R" || y.shape === "O") {
      const E = p * a, k = f * a, A = m - E / 2, P = s - k / 2, O = y.shape === "O" ? Math.min(E, k) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${P.toFixed(2)}" width="${E.toFixed(2)}" height="${k.toFixed(2)}" rx="${O.toFixed(2)}" fill="${u}" />`;
    }
    const v = (y.diameterMm ?? 0.6) * a / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${s.toFixed(2)}" r="${Math.max(1, v).toFixed(2)}" fill="${u}" />`;
  }), d = g.regions.map((y) => {
    const l = y.loops.map((m) => {
      if (!m.length) return "";
      const s = Et(m[0].x, m[0].y, t), p = [`M ${(s.x * a).toFixed(2)} ${(s.y * a).toFixed(2)}`];
      for (let f = 1; f < m.length; f++) {
        const v = Et(m[f].x, m[f].y, t);
        p.push(`L ${(v.x * a).toFixed(2)} ${(v.y * a).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return l.trim() ? `<path d="${l}" fill="${u}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${i}" viewBox="0 0 ${c} ${i}">
  ${w.join(`
  `)}
  ${b.join(`
  `)}
  ${d.join(`
  `)}
</svg>`.trim();
}
function Oe(g, t) {
  const e = t.maxX - t.minX, h = t.maxY - t.minY, c = Math.round(gt(e)), i = Math.round(gt(h)), a = gt(1), n = g.map((u) => {
    const w = Et(u.x, u.y, t), b = w.x * a, d = w.y * a, y = (u.diameter || 0.6) * a / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${d.toFixed(2)}" r="${Math.max(1, y).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${i}" viewBox="0 0 ${c} ${i}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ie(g) {
  const t = Object.keys(g).filter((it) => !!it), e = xe(t), h = new TextDecoder("utf-8", { fatal: !1 }), c = async (it) => {
    if (!it) return null;
    const ct = g[it];
    return ct ? h.decode(ct) : null;
  }, i = await c(e.top_copper), a = await c(e.bottom_copper), n = await c(e.outline), u = await c(e.drills), w = await c(e.top_silk), b = await c(e.bottom_silk), d = i ? Ct(e.top_copper || "top", i) : null, y = a ? Ct(e.bottom_copper || "bot", a) : null, l = n ? Ct(e.outline || "outline", n) : null, m = u ? Ae(e.drills || "drills", u) : null, s = m ? m.holes.map((it) => ({ x: it.x, y: it.y, diameter: it.diameter })) : [], p = w ? Ct(e.top_silk || "top_silk", w) : null, f = b ? Ct(e.bottom_silk || "bot_silk", b) : null, v = d ? bt(vt(d)) : null, E = y ? bt(vt(y)) : null, k = l ? bt(vt(l)) : null, A = s.length ? bt(Te(s)) : null, P = p ? bt(vt(p)) : null, O = f ? bt(vt(f)) : null, L = (k && Tt(k) ? k : null) || (v && Tt(v) ? v : null) || (E && Tt(E) ? E : null) || (A && Tt(A) ? A : null), M = L ? L.maxX - L.minX : 1, j = v ? St(v.maxX - v.minX, M) : 1, K = E ? St(E.maxX - E.minX, M) : 1, S = k ? St(k.maxX - k.minX, M) : 1, F = A ? St(A.maxX - A.minX, M) : 1, o = P ? St(P.maxX - P.minX, M) : 1, D = O ? St(O.maxX - O.minX, M) : 1, Q = d ? It(d, j) : null, X = y ? It(y, K) : null, et = l ? It(l, S) : null, T = s.length ? Re(s, F) : [], Z = p ? It(p, o) : null, C = f ? It(f, D) : null;
  let R = null;
  if (et) {
    const it = bt(vt(et));
    Tt(it) && (R = it);
  }
  if (!R) {
    let it = Ut();
    Q && (it = Zt(it, vt(Q))), X && (it = Zt(it, vt(X))), it = bt(it), R = it;
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
  return Q && (ot.top_copper = st(Vt(Q, G, "#fbbf24", 1))), X && (ot.bottom_copper = st(Vt(X, G, "#38bdf8", 1))), T.length && (ot.drills = st(Oe(T, G))), Z && (ot.top_silk = st(Ht(Z, G))), C && (ot.bottom_silk = st(Ht(C, G))), {
    boardGeom: nt,
    layers: ot,
    revoke: () => rt.forEach((it) => URL.revokeObjectURL(it))
  };
}
async function Ve(g) {
  const t = g instanceof Uint8Array ? g.byteOffset === 0 && g.byteLength === g.buffer.byteLength ? g.buffer : g.slice().buffer : g instanceof ArrayBuffer ? g : await g.arrayBuffer(), { files: e, archiveType: h } = await re(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (h !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${h}`);
  return await ie(e);
}
async function He(g, t) {
  const { files: e } = await re(g, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ie(e);
}
function Dt(g, t) {
  const [
    e,
    h,
    c,
    i,
    a,
    n,
    u,
    w,
    b
  ] = g, [
    d,
    y,
    l,
    m,
    s,
    p,
    f,
    v,
    E
  ] = t;
  return [
    e * d + h * m + c * f,
    e * y + h * s + c * v,
    e * l + h * p + c * E,
    i * d + a * m + n * f,
    i * y + a * s + n * v,
    i * l + a * p + n * E,
    u * d + w * m + b * f,
    u * y + w * s + b * v,
    u * l + w * p + b * E
  ];
}
function qt(g, t) {
  return [1, 0, g, 0, 1, t, 0, 0, 1];
}
function Be(g, t) {
  return [g, 0, 0, 0, t, 0, 0, 0, 1];
}
function Pe(g) {
  const t = Math.cos(g), e = Math.sin(g);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function Kt(g, t) {
  const e = g[0] * t.x + g[1] * t.y + g[2], h = g[3] * t.x + g[4] * t.y + g[5], c = g[6] * t.x + g[7] * t.y + g[8];
  if (c === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / c, y: h / c };
}
function Fe(g) {
  const t = g[0], e = g[1], h = g[2], c = g[3], i = g[4], a = g[5], n = t * i - e * c;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const u = 1 / n, w = i * u, b = -e * u, d = -c * u, y = t * u, l = -(w * h + b * a), m = -(d * h + y * a);
  return [w, b, l, d, y, m, 0, 0, 1];
}
class Ne {
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
    const { width_px: t, height_px: e } = this.viewport, { center_mm: h, zoom: c, rotation_rad: i, mirrorX: a, mirrorY: n } = this.camera, u = { x: t / 2, y: e / 2 }, w = n ? -1 : 1, b = a ? -1 : 1, d = qt(-h.x, -h.y), y = Pe(i), l = Be(c * b, c * w), m = qt(u.x, u.y), s = Dt(m, Dt(l, Dt(y, d)));
    this.worldToScreenMat = s, this.screenToWorldMat = Fe(s);
  }
}
class De {
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
let Le = class {
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
    const h = this.overlays.get(t);
    h && h.visible !== e && (h.visible = e);
  }
  setZIndex(t, e) {
    const h = this.overlays.get(t);
    h && h.zIndex !== e && (h.zIndex = e, this.dirty = !0);
  }
  list() {
    return Array.from(this.overlays.values());
  }
  getSortedVisible() {
    return this.dirty && (this.sortedCache = Array.from(this.overlays.values()).sort((t, e) => t.zIndex - e.zIndex), this.dirty = !1), this.sortedCache.filter((t) => t.visible);
  }
};
class Ue {
  // Default bounds
  constructor(t, e) {
    this.passes = [], this.visibilityGetter = () => this.visibility, this.overlays = new Le(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.canvas = t;
    const h = t.getContext("2d");
    if (!h) throw new Error("Unable to get 2D context");
    this.ctx = h;
    const c = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new Ne(e, c), this.visibility = {
      gerber: {
        copper: !0,
        solderMask: !0,
        silk: !0,
        outline: !0
      },
      overlays: {},
      markers: !0
    }, this.scheduler = new De(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: a }) => {
        const n = this.xform.boardToScreen({ x: i, y: a });
        return { x_px: n.x, y_px: n.y };
      },
      screenToBoard: ({ x_px: i, y_px: a }) => {
        const n = this.xform.screenToBoard({ x: i, y: a });
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
    this.passes.push(t), this.passes.sort((e, h) => e.order - h.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((h) => h.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, h = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(h);
    const c = {
      canvas: e,
      ctx: t,
      viewport: h,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibilityGetter(),
      // Use the getter function
      boardToScreen: (i) => this.xform.boardToScreen({ x: i.x, y: i.y }),
      screenToBoard: (i) => this.xform.screenToBoard({ x: i.x, y: i.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width, e.height);
    for (const i of this.passes)
      if (i.enabled()) {
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
  screenToBoard(t, e) {
    return this.xform.screenToBoard({ x: t, y: e });
  }
  boardToScreen(t, e) {
    return this.xform.boardToScreen({ x: t, y: e });
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
  setOverlayVisibility(t, e) {
    this.overlays.setVisible(t, e), this.requestRender(`overlay:vis:${t}:${e}`);
  }
  getOverlayRegistry() {
    return this.overlays;
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
class We {
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
const kt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function Ke(g, t, e, h, c) {
  return {
    id: `gerber:${g}`,
    order: t,
    enabled: () => c().gerber[e],
    draw: (i) => {
      const a = i.ctx, n = i.xform.getWorldToScreenMatrix();
      a.setTransform(n[0], n[3], n[1], n[4], n[2], n[5]), h(a);
    }
  };
}
class je {
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
    const h = this.overlays.get(t);
    h && (h.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Xe(g) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: () => !0,
    draw: (t) => {
      const h = g.getAll().filter((c) => t.visibility.overlays[c.id] ?? c.visible);
      h.sort((c, i) => c.zIndex - i.zIndex);
      for (const c of h)
        t.ctx.save(), c.draw(t.ctx, {
          boardToScreen: t.boardToScreen,
          screenToBoard: t.screenToBoard,
          xform: t.xform,
          view: t.xform.getCamera()
        }), t.ctx.restore();
    }
  };
}
class $e {
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
    const e = t.ctx, h = t.xform.getCamera().zoom;
    if (!(h < 2)) {
      e.setTransform(1, 0, 0, 1, 0, 0);
      for (const i of this.markers.values()) {
        const a = t.boardToScreen(i.position);
        a.x < -10 || a.x > t.viewport.width_px + 10 || a.y < -10 || a.y > t.viewport.height_px + 10 || this.drawMarker(e, a, i, h);
      }
    }
  }
  drawMarker(t, e, h, c) {
    const i = Math.max(3, Math.min(8, c / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, i, 0, Math.PI * 2), h.type) {
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
function Ye(g, t) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: () => t().markers,
    draw: (e) => g.draw(e)
  };
}
class Ze {
  draw(t, e) {
    if (!e) return;
    const h = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(h, t, e.id);
        break;
      case "geometry":
        this.drawGeometrySelection(h, t, e.id);
        break;
      case "region":
        this.drawRegionSelection(h, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, h) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, e, h) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, e, h) {
    if (!h) return;
    const c = e.xform.getWorldToScreenMatrix();
    t.setTransform(c[0], c[3], c[1], c[4], c[2], c[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      h.min.x,
      h.min.y,
      h.max.x - h.min.x,
      h.max.y - h.min.y
    );
  }
}
function Ge(g, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: () => t() !== null,
    draw: (e) => g.draw(e, t())
  };
}
function Je(g, t = {}) {
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
  const h = g.firstElementChild, c = D(h, "#board-viewport"), i = D(h, "#render-canvas"), a = D(h, "#grid-toggle"), n = D(h, "#grid-units"), u = D(h, "#fit-btn"), w = D(h, "#download-btn"), b = Array.from(h.querySelectorAll('input[name="side"]')), d = new Ue(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), y = new We();
  d.setVisibilityGetter(() => y.getState());
  const l = new je(), m = new $e(), s = new Ze();
  let p = null;
  function f() {
    const T = c.getBoundingClientRect(), Z = window.devicePixelRatio || 1;
    i.width = T.width * Z, i.height = T.height * Z, i.style.width = `${T.width}px`, i.style.height = `${T.height}px`, d.requestRender("resize");
  }
  const v = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (T, Z) => {
      const { xform: C, view: R } = Z, G = R.zoom, V = n.value, U = V === "mm" ? 1 : 2.54, nt = V === "mm" ? 10 : 25.4, lt = U * G, tt = nt * G;
      if (lt < 2) return;
      const rt = Z.screenToBoard({ x: 0, y: 0 }), st = Z.screenToBoard({
        x: i.width / (window.devicePixelRatio || 1),
        y: i.height / (window.devicePixelRatio || 1)
      });
      T.setTransform(1, 0, 0, 1, 0, 0), T.strokeStyle = "rgba(59, 130, 246, 0.4)", T.lineWidth = 1, T.beginPath();
      const ot = Math.floor(rt.x / U) * U, it = Math.floor(rt.y / U) * U;
      for (let ct = ot; ct <= st.x; ct += U) {
        const r = Z.boardToScreen({ x: ct, y: 0 }).x;
        T.moveTo(r, 0), T.lineTo(r, i.height);
      }
      for (let ct = it; ct <= st.y; ct += U) {
        const r = Z.boardToScreen({ x: 0, y: ct }).y;
        T.moveTo(0, r), T.lineTo(i.width, r);
      }
      if (T.stroke(), tt >= 8) {
        T.strokeStyle = "rgba(59, 130, 246, 0.7)", T.lineWidth = 1.5, T.beginPath();
        const ct = Math.floor(rt.x / nt) * nt, r = Math.floor(rt.y / nt) * nt;
        for (let N = ct; N <= st.x; N += nt) {
          const B = Z.boardToScreen({ x: N, y: 0 }).x;
          T.moveTo(B, 0), T.lineTo(B, i.height);
        }
        for (let N = r; N <= st.y; N += nt) {
          const B = Z.boardToScreen({ x: 0, y: N }).y;
          T.moveTo(0, B), T.lineTo(i.width, B);
        }
        T.stroke();
      }
    }
  };
  l.add(v), y.setOverlayVisibility("grid", !1), y.setMarkersVisibility(!1), d.addPass(Xe(l)), d.addPass(Ye(m, () => y.getState())), d.addPass(Ge(s, () => p));
  let E = null, k = {}, A = "top", P = !1;
  function O(T, Z, C) {
    if (!C) return null;
    const R = new Image();
    return R.src = C, R.addEventListener("load", () => {
      d.requestRender(`image-loaded-${T}`);
    }), {
      id: T,
      order: Z,
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
  function L(T, Z) {
    return {
      id: T,
      order: Z,
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
  function M() {
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
      d.removePass(C);
    }), !E) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: A === "bottom" ? k.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: A === "bottom" ? k.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: A === "bottom" ? k.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: A === "top" ? k.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: A === "top" ? k.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: A === "top" ? k.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: k.drills },
      { id: "layer:vias", order: 45, url: k.vias }
    ].forEach((C) => {
      let R;
      C.useFR4 ? R = L(C.id, C.order) : C.url && (R = O(C.id, C.order, C.url)), R && d.addPass(R);
    }), d.requestRender("side-switch"), setTimeout(() => d.requestRender("side-switch-delayed"), 50);
  }
  function j(T = 0.08) {
    if (!E?.board) return;
    const Z = c.getBoundingClientRect(), C = E.board.width_in || 1, R = E.board.height_in || 1, G = Z.width * (1 - 2 * T), V = Z.height * (1 - 2 * T), U = C * 25.4, nt = R * 25.4, lt = G / U, tt = V / nt, rt = Math.min(lt, tt), st = U / 2, ot = nt / 2;
    d.setCamera({
      center_mm: { x: st, y: ot },
      zoom: rt
    });
  }
  i.addEventListener("wheel", (T) => {
    T.preventDefault(), P = !0;
    const Z = i.getBoundingClientRect(), C = T.clientX - Z.left, R = T.clientY - Z.top, G = d.getCamera(), V = T.deltaY < 0 ? 1.1 : 0.9, U = Math.max(0.2, Math.min(50, G.zoom * V)), nt = d.screenToBoard(C, R);
    d.setCamera({ zoom: U });
    const lt = d.screenToBoard(C, R), tt = nt.x - lt.x, rt = nt.y - lt.y, st = {
      x: G.center_mm.x + tt,
      y: G.center_mm.y + rt
    };
    d.setCamera({
      center_mm: st,
      zoom: U
    });
  }, { passive: !1 });
  let K = !1, S = null;
  i.addEventListener("mousedown", (T) => {
    if (T.button !== 0) return;
    T.preventDefault(), P = !0, K = !0;
    const Z = i.getBoundingClientRect();
    S = d.screenToBoard(
      T.clientX - Z.left,
      T.clientY - Z.top
    );
  });
  const F = (T) => {
    if (!K || !S) return;
    const Z = i.getBoundingClientRect(), C = d.screenToBoard(
      T.clientX - Z.left,
      T.clientY - Z.top
    ), R = S.x - C.x, G = S.y - C.y, V = d.getCamera();
    d.setCamera({
      center_mm: {
        x: V.center_mm.x + R,
        y: V.center_mm.y + G
      }
    });
  }, o = () => {
    K = !1, S = null;
  };
  window.addEventListener("mousemove", F), window.addEventListener("mouseup", o), a.addEventListener("change", () => {
    y.setOverlayVisibility("grid", a.checked), d.requestRender("grid-toggle");
  }), n.addEventListener("change", () => {
    y.isOverlayVisible("grid") && d.requestRender("grid-units");
  }), u.addEventListener("click", () => j(0.08)), w.addEventListener("click", () => t.onDownload?.()), b.forEach((T) => {
    T.addEventListener("change", () => {
      A = b.find((Z) => Z.checked)?.value || "top", M();
    });
  }), window.addEventListener("resize", () => {
    f(), P || j(0.08);
  }), y.subscribe(() => {
    d.requestRender("visibility-change");
  });
  function D(T, Z) {
    const C = T.querySelector(Z);
    if (!C) throw new Error(`Missing required element: ${Z}`);
    return C;
  }
  function Q(T) {
    E = T.boardGeom, k = T.layers, M(), f(), j(0.08);
  }
  function X(T) {
    A = T;
    const Z = b.find((C) => C.value === T);
    Z && (Z.checked = !0), M();
  }
  function et() {
    window.removeEventListener("mousemove", F), window.removeEventListener("mouseup", o), g.innerHTML = "";
  }
  return f(), {
    setData: Q,
    setSideMode: X,
    fit: () => j(0.08),
    dispose: et,
    // Expose new render pipeline API
    viewer: d,
    visibility: y,
    overlayRegistry: l,
    markerRenderer: m,
    setSelection: (T) => {
      p = T, d.requestRender("selection-change");
    },
    addMarker: (T) => {
      m.add(T), d.requestRender("marker-added");
    },
    removeMarker: (T) => {
      m.remove(T), d.requestRender("marker-removed");
    }
  };
}
function Qe(g, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const h = e.xform.getWorldToScreenMatrix(), c = g.getSortedVisible();
      for (const i of c)
        e.ctx.save(), i.drawInWorldSpace ? e.ctx.setTransform(h[0], h[3], h[1], h[4], h[2], h[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), i.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function tr() {
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
      for (const h of e)
        g.beginPath(), g.arc(h.x_mm, h.y_mm, 0.25, 0, Math.PI * 2), g.fill();
    }
  };
}
function er(g) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const h = g();
      h && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(h.x_px + 12, h.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(h.text, h.x_px + 15, h.y_px - 5));
    }
  };
}
function rr(g = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const h = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let c = h.minX_mm; c <= h.maxX_mm; c += g)
        t.moveTo(c, h.minY_mm), t.lineTo(c, h.maxY_mm);
      for (let c = h.minY_mm; c <= h.maxY_mm; c += g)
        t.moveTo(h.minX_mm, c), t.lineTo(h.maxX_mm, c);
      t.stroke();
    }
  };
}
function nr(g) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, h) => {
      t += 16;
      const c = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + c * 0.7})`, e.beginPath(), e.arc(g.x_mm, g.y_mm, 0.5 + c * 0.5, 0, Math.PI * 2), e.fill(), h.requestRender("overlay:animate");
    }
  };
}
export {
  ft as GerberError,
  $e as MarkerRenderer,
  Le as OverlayRegistry,
  De as RenderScheduler,
  Ze as SelectionRenderer,
  Ue as Viewer,
  Ne as ViewportTransform,
  We as VisibilityManager,
  Ke as createGerberPass,
  rr as createGridOverlay,
  Je as createIntegratedViewer,
  Ye as createMarkerPass,
  Qe as createOverlayPass,
  nr as createPulsingMarkerOverlay,
  Ge as createSelectionPass,
  er as createTooltipOverlay,
  tr as createViolationDotsOverlay,
  _e as detectGerberBundle,
  He as renderGerbers,
  ie as renderGerbersFiles,
  Ve as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
