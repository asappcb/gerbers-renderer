var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ce(y) {
  return y && y.__esModule && Object.prototype.hasOwnProperty.call(y, "default") ? y.default : y;
}
function Pt(y) {
  throw new Error('Could not dynamically require "' + y + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var $t;
function de() {
  return $t || ($t = 1, (function(y, t) {
    (function(e) {
      y.exports = e();
    })(function() {
      return (function e(o, c, s) {
        function i(v, b) {
          if (!c[v]) {
            if (!o[v]) {
              var m = typeof Pt == "function" && Pt;
              if (!b && m) return m(v, !0);
              if (n) return n(v, !0);
              var u = new Error("Cannot find module '" + v + "'");
              throw u.code = "MODULE_NOT_FOUND", u;
            }
            var d = c[v] = { exports: {} };
            o[v][0].call(d.exports, function(p) {
              var a = o[v][1][p];
              return i(a || p);
            }, d, d.exports, e, o, c, s);
          }
          return c[v].exports;
        }
        for (var n = typeof Pt == "function" && Pt, h = 0; h < s.length; h++) i(s[h]);
        return i;
      })({ 1: [function(e, o, c) {
        var s = e("./utils"), i = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        c.encode = function(h) {
          for (var v, b, m, u, d, p, a, g = [], f = 0, x = h.length, R = x, k = s.getTypeOf(h) !== "string"; f < h.length; ) R = x - f, m = k ? (v = h[f++], b = f < x ? h[f++] : 0, f < x ? h[f++] : 0) : (v = h.charCodeAt(f++), b = f < x ? h.charCodeAt(f++) : 0, f < x ? h.charCodeAt(f++) : 0), u = v >> 2, d = (3 & v) << 4 | b >> 4, p = 1 < R ? (15 & b) << 2 | m >> 6 : 64, a = 2 < R ? 63 & m : 64, g.push(n.charAt(u) + n.charAt(d) + n.charAt(p) + n.charAt(a));
          return g.join("");
        }, c.decode = function(h) {
          var v, b, m, u, d, p, a = 0, g = 0, f = "data:";
          if (h.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, R = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === n.charAt(64) && R--, h.charAt(h.length - 2) === n.charAt(64) && R--, R % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = i.uint8array ? new Uint8Array(0 | R) : new Array(0 | R); a < h.length; ) v = n.indexOf(h.charAt(a++)) << 2 | (u = n.indexOf(h.charAt(a++))) >> 4, b = (15 & u) << 4 | (d = n.indexOf(h.charAt(a++))) >> 2, m = (3 & d) << 6 | (p = n.indexOf(h.charAt(a++))), x[g++] = v, d !== 64 && (x[g++] = b), p !== 64 && (x[g++] = m);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, o, c) {
        var s = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function v(b, m, u, d, p) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = u, this.compression = d, this.compressedContent = p;
        }
        v.prototype = { getContentWorker: function() {
          var b = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(b, m, u) {
          return b.pipe(new n()).pipe(new h("uncompressedSize")).pipe(m.compressWorker(u)).pipe(new h("compressedSize")).withStreamInfo("compression", m);
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
          for (var n, h = [], v = 0; v < 256; v++) {
            n = v;
            for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            h[v] = n;
          }
          return h;
        })();
        o.exports = function(n, h) {
          return n !== void 0 && n.length ? s.getTypeOf(n) !== "string" ? (function(v, b, m, u) {
            var d = i, p = u + m;
            v ^= -1;
            for (var a = u; a < p; a++) v = v >>> 8 ^ d[255 & (v ^ b[a])];
            return -1 ^ v;
          })(0 | h, n, n.length, 0) : (function(v, b, m, u) {
            var d = i, p = u + m;
            v ^= -1;
            for (var a = u; a < p; a++) v = v >>> 8 ^ d[255 & (v ^ b.charCodeAt(a))];
            return -1 ^ v;
          })(0 | h, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, o, c) {
        c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !0, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
      }, {}], 6: [function(e, o, c) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), o.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, o, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), n = e("./utils"), h = e("./stream/GenericWorker"), v = s ? "uint8array" : "array";
        function b(m, u) {
          h.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = u, this.meta = {};
        }
        c.magic = "\b\0", n.inherits(b, h), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(v, m.data), !1);
        }, b.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(u) {
            m.push({ data: u, meta: m.meta });
          };
        }, c.compressWorker = function(m) {
          return new b("Deflate", m);
        }, c.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, o, c) {
        function s(d, p) {
          var a, g = "";
          for (a = 0; a < p; a++) g += String.fromCharCode(255 & d), d >>>= 8;
          return g;
        }
        function i(d, p, a, g, f, x) {
          var R, k, A = d.file, B = d.compression, I = x !== v.utf8encode, U = n.transformTo("string", x(A.name)), T = n.transformTo("string", v.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", x(j)), S = n.transformTo("string", v.utf8encode(j)), F = T.length !== A.name.length, l = S.length !== j.length, D = "", J = "", $ = "", rt = A.dir, Y = A.date, P = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          p && !a || (P.crc32 = d.crc32, P.compressedSize = d.compressedSize, P.uncompressedSize = d.uncompressedSize);
          var z = 0;
          p && (z |= 8), I || !F && !l || (z |= 2048);
          var E = 0, Z = 0;
          rt && (E |= 16), f === "UNIX" ? (Z = 798, E |= (function(L, tt) {
            var at = L;
            return L || (at = tt ? 16893 : 33204), (65535 & at) << 16;
          })(A.unixPermissions, rt)) : (Z = 20, E |= (function(L) {
            return 63 & (L || 0);
          })(A.dosPermissions)), R = Y.getUTCHours(), R <<= 6, R |= Y.getUTCMinutes(), R <<= 5, R |= Y.getUTCSeconds() / 2, k = Y.getUTCFullYear() - 1980, k <<= 4, k |= Y.getUTCMonth() + 1, k <<= 5, k |= Y.getUTCDate(), F && (J = s(1, 1) + s(b(U), 4) + T, D += "up" + s(J.length, 2) + J), l && ($ = s(1, 1) + s(b(K), 4) + S, D += "uc" + s($.length, 2) + $);
          var G = "";
          return G += `
\0`, G += s(z, 2), G += B.magic, G += s(R, 2), G += s(k, 2), G += s(P.crc32, 4), G += s(P.compressedSize, 4), G += s(P.uncompressedSize, 4), G += s(U.length, 2), G += s(D.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + G + U + D, dirRecord: m.CENTRAL_FILE_HEADER + s(Z, 2) + G + s(K.length, 2) + "\0\0\0\0" + s(E, 4) + s(g, 4) + U + D + K };
        }
        var n = e("../utils"), h = e("../stream/GenericWorker"), v = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function u(d, p, a, g) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = p, this.zipPlatform = a, this.encodeFileName = g, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(u, h), u.prototype.push = function(d) {
          var p = d.meta.percent || 0, a = this.entriesCount, g = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, h.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: a ? (p + 100 * (a - g - 1)) / a : 100 } }));
        }, u.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var p = this.streamFiles && !d.file.dir;
          if (p) {
            var a = i(d, p, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: a.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, u.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var p = this.streamFiles && !d.file.dir, a = i(d, p, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(a.dirRecord), p) this.push({ data: (function(g) {
            return m.DATA_DESCRIPTOR + s(g.crc32, 4) + s(g.compressedSize, 4) + s(g.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: a.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, u.prototype.flush = function() {
          for (var d = this.bytesWritten, p = 0; p < this.dirRecords.length; p++) this.push({ data: this.dirRecords[p], meta: { percent: 100 } });
          var a = this.bytesWritten - d, g = (function(f, x, R, k, A) {
            var B = n.transformTo("string", A(k));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(f, 2) + s(f, 2) + s(x, 4) + s(R, 4) + s(B.length, 2) + B;
          })(this.dirRecords.length, a, d, this.zipComment, this.encodeFileName);
          this.push({ data: g, meta: { percent: 100 } });
        }, u.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, u.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var p = this;
          return d.on("data", function(a) {
            p.processChunk(a);
          }), d.on("end", function() {
            p.closedSource(p.previous.streamInfo), p._sources.length ? p.prepareNextSource() : p.end();
          }), d.on("error", function(a) {
            p.error(a);
          }), this;
        }, u.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, u.prototype.error = function(d) {
          var p = this._sources;
          if (!h.prototype.error.call(this, d)) return !1;
          for (var a = 0; a < p.length; a++) try {
            p[a].error(d);
          } catch {
          }
          return !0;
        }, u.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var d = this._sources, p = 0; p < d.length; p++) d[p].lock();
        }, o.exports = u;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, o, c) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        c.generateWorker = function(n, h, v) {
          var b = new i(h.streamFiles, v, h.platform, h.encodeFileName), m = 0;
          try {
            n.forEach(function(u, d) {
              m++;
              var p = (function(x, R) {
                var k = x || R, A = s[k];
                if (!A) throw new Error(k + " is not a valid compression method !");
                return A;
              })(d.options.compression, h.compression), a = d.options.compressionOptions || h.compressionOptions || {}, g = d.dir, f = d.date;
              d._compressWorker(p, a).withStreamInfo("file", { name: u, dir: g, date: f, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (u) {
            b.error(u);
          }
          return b;
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
        var s = e("./utils"), i = e("./external"), n = e("./utf8"), h = e("./zipEntries"), v = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(u) {
          return new i.Promise(function(d, p) {
            var a = u.decompressed.getContentWorker().pipe(new v());
            a.on("error", function(g) {
              p(g);
            }).on("end", function() {
              a.streamInfo.crc32 !== u.decompressed.crc32 ? p(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        o.exports = function(u, d) {
          var p = this;
          return d = s.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(u) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", u, !0, d.optimizedBinaryString, d.base64).then(function(a) {
            var g = new h(d);
            return g.load(a), g;
          }).then(function(a) {
            var g = [i.Promise.resolve(a)], f = a.files;
            if (d.checkCRC32) for (var x = 0; x < f.length; x++) g.push(m(f[x]));
            return i.Promise.all(g);
          }).then(function(a) {
            for (var g = a.shift(), f = g.files, x = 0; x < f.length; x++) {
              var R = f[x], k = R.fileNameStr, A = s.resolve(R.fileNameStr);
              p.file(A, R.decompressed, { binary: !0, optimizedBinaryString: !0, date: R.date, dir: R.dir, comment: R.fileCommentStr.length ? R.fileCommentStr : null, unixPermissions: R.unixPermissions, dosPermissions: R.dosPermissions, createFolders: d.createFolders }), R.dir || (p.file(A).unsafeOriginalName = k);
            }
            return g.zipComment.length && (p.comment = g.zipComment), p;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, o, c) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function n(h, v) {
          i.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(v);
        }
        s.inherits(n, i), n.prototype._bindStream = function(h) {
          var v = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            v.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            v.isPaused ? this.generatedError = b : v.error(b);
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
        function i(n, h, v) {
          s.call(this, h), this._helper = n;
          var b = this;
          n.on("data", function(m, u) {
            b.push(m) || b._helper.pause(), v && v(u);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
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
        function s(A, B, I) {
          var U, T = n.getTypeOf(B), j = n.extend(I || {}, b);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = f(A)), j.createFolders && (U = g(A)) && x.call(this, U, !0);
          var K = T === "string" && j.binary === !1 && j.base64 === !1;
          I && I.binary !== void 0 || (j.binary = !K), (B instanceof m && B.uncompressedSize === 0 || j.dir || !B || B.length === 0) && (j.base64 = !1, j.binary = !0, B = "", j.compression = "STORE", T = "string");
          var S = null;
          S = B instanceof m || B instanceof h ? B : p.isNode && p.isStream(B) ? new a(A, B) : n.prepareContent(A, B, j.binary, j.optimizedBinaryString, j.base64);
          var F = new u(A, S, j);
          this.files[A] = F;
        }
        var i = e("./utf8"), n = e("./utils"), h = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), u = e("./zipObject"), d = e("./generate"), p = e("./nodejsUtils"), a = e("./nodejs/NodejsStreamInputAdapter"), g = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var B = A.lastIndexOf("/");
          return 0 < B ? A.substring(0, B) : "";
        }, f = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, x = function(A, B) {
          return B = B !== void 0 ? B : b.createFolders, A = f(A), this.files[A] || s.call(this, A, null, { dir: !0, createFolders: B }), this.files[A];
        };
        function R(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var B, I, U;
          for (B in this.files) U = this.files[B], (I = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && A(I, U);
        }, filter: function(A) {
          var B = [];
          return this.forEach(function(I, U) {
            A(I, U) && B.push(U);
          }), B;
        }, file: function(A, B, I) {
          if (arguments.length !== 1) return A = this.root + A, s.call(this, A, B, I), this;
          if (R(A)) {
            var U = A;
            return this.filter(function(j, K) {
              return !K.dir && U.test(j);
            });
          }
          var T = this.files[this.root + A];
          return T && !T.dir ? T : null;
        }, folder: function(A) {
          if (!A) return this;
          if (R(A)) return this.filter(function(T, j) {
            return j.dir && A.test(T);
          });
          var B = this.root + A, I = x.call(this, B), U = this.clone();
          return U.root = I.name, U;
        }, remove: function(A) {
          A = this.root + A;
          var B = this.files[A];
          if (B || (A.slice(-1) !== "/" && (A += "/"), B = this.files[A]), B && !B.dir) delete this.files[A];
          else for (var I = this.filter(function(T, j) {
            return j.name.slice(0, A.length) === A;
          }), U = 0; U < I.length; U++) delete this.files[I[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var B, I = {};
          try {
            if ((I = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = I.type.toLowerCase(), I.compression = I.compression.toUpperCase(), I.type === "binarystring" && (I.type = "string"), !I.type) throw new Error("No output type specified.");
            n.checkSupport(I.type), I.platform !== "darwin" && I.platform !== "freebsd" && I.platform !== "linux" && I.platform !== "sunos" || (I.platform = "UNIX"), I.platform === "win32" && (I.platform = "DOS");
            var U = I.comment || this.comment || "";
            B = d.generateWorker(this, I, U);
          } catch (T) {
            (B = new h("error")).error(T);
          }
          return new v(B, I.type || "string", I.mimeType);
        }, generateAsync: function(A, B) {
          return this.generateInternalStream(A).accumulate(B);
        }, generateNodeStream: function(A, B) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(B);
        } };
        o.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, o, c) {
        o.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, o, c) {
        var s = e("./DataReader");
        function i(n) {
          s.call(this, n);
          for (var h = 0; h < this.data.length; h++) n[h] = 255 & n[h];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, i.prototype.lastIndexOfSignature = function(n) {
          for (var h = n.charCodeAt(0), v = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), u = this.length - 4; 0 <= u; --u) if (this.data[u] === h && this.data[u + 1] === v && this.data[u + 2] === b && this.data[u + 3] === m) return u - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(n) {
          var h = n.charCodeAt(0), v = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), u = this.readData(4);
          return h === u[0] && v === u[1] && b === u[2] && m === u[3];
        }, i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
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
          var h, v = 0;
          for (this.checkOffset(n), h = this.index + n - 1; h >= this.index; h--) v = (v << 8) + this.byteAt(h);
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
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
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
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, o.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, o, c) {
        var s = e("./ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, o.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, o, c) {
        var s = e("../utils"), i = e("../support"), n = e("./ArrayReader"), h = e("./StringReader"), v = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        o.exports = function(m) {
          var u = s.getTypeOf(m);
          return s.checkSupport(u), u !== "string" || i.uint8array ? u === "nodebuffer" ? new v(m) : i.uint8array ? new b(s.transformTo("uint8array", m)) : new n(s.transformTo("array", m)) : new h(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, o, c) {
        c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, o, c) {
        var s = e("./GenericWorker"), i = e("../utils");
        function n(h) {
          s.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        i.inherits(n, s), n.prototype.processChunk = function(h) {
          this.push({ data: i.transformTo(this.destType, h.data), meta: h.meta });
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, o, c) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function n() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, s), n.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = i(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, o.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, o, c) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        s.inherits(n, i), n.prototype.processChunk = function(h) {
          if (h) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + h.data.length;
          }
          i.prototype.processChunk.call(this, h);
        }, o.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, o, c) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            v.dataIsReady = !0, v.data = b, v.max = b && b.length || 0, v.type = s.getTypeOf(b), v.isPaused || v._tickAndRepeat();
          }, function(b) {
            v.error(b);
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
          var h = null, v = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              h = this.data.substring(this.index, v);
              break;
            case "uint8array":
              h = this.data.subarray(this.index, v);
              break;
            case "array":
            case "nodebuffer":
              h = this.data.slice(this.index, v);
          }
          return this.index = v, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
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
        } }, o.exports = s;
      }, {}], 29: [function(e, o, c) {
        var s = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), h = e("../base64"), v = e("../support"), b = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function u(p, a) {
          return new b.Promise(function(g, f) {
            var x = [], R = p._internalType, k = p._outputType, A = p._mimeType;
            p.on("data", function(B, I) {
              x.push(B), a && a(I);
            }).on("error", function(B) {
              x = [], f(B);
            }).on("end", function() {
              try {
                var B = (function(I, U, T) {
                  switch (I) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", U), T);
                    case "base64":
                      return h.encode(U);
                    default:
                      return s.transformTo(I, U);
                  }
                })(k, (function(I, U) {
                  var T, j = 0, K = null, S = 0;
                  for (T = 0; T < U.length; T++) S += U[T].length;
                  switch (I) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (K = new Uint8Array(S), T = 0; T < U.length; T++) K.set(U[T], j), j += U[T].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + I + "'");
                  }
                })(R, x), A);
                g(B);
              } catch (I) {
                f(I);
              }
              x = [];
            }).resume();
          });
        }
        function d(p, a, g) {
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
            this._internalType = f, this._outputType = a, this._mimeType = g, s.checkSupport(f), this._worker = p.pipe(new i(f)), p.lock();
          } catch (x) {
            this._worker = new n("error"), this._worker.error(x);
          }
        }
        d.prototype = { accumulate: function(p) {
          return u(this, p);
        }, on: function(p, a) {
          var g = this;
          return p === "data" ? this._worker.on(p, function(f) {
            a.call(g, f.data, f.meta);
          }) : this._worker.on(p, function() {
            s.delay(a, arguments, g);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(p) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, p);
        } }, o.exports = d;
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
        for (var s = e("./utils"), i = e("./support"), n = e("./nodejsUtils"), h = e("./stream/GenericWorker"), v = new Array(256), b = 0; b < 256; b++) v[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function u() {
          h.call(this, "utf-8 encode");
        }
        c.utf8encode = function(d) {
          return i.nodebuffer ? n.newBufferFrom(d, "utf-8") : (function(p) {
            var a, g, f, x, R, k = p.length, A = 0;
            for (x = 0; x < k; x++) (64512 & (g = p.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (f = p.charCodeAt(x + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (f - 56320), x++), A += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
            for (a = i.uint8array ? new Uint8Array(A) : new Array(A), x = R = 0; R < A; x++) (64512 & (g = p.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (f = p.charCodeAt(x + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (f - 56320), x++), g < 128 ? a[R++] = g : (g < 2048 ? a[R++] = 192 | g >>> 6 : (g < 65536 ? a[R++] = 224 | g >>> 12 : (a[R++] = 240 | g >>> 18, a[R++] = 128 | g >>> 12 & 63), a[R++] = 128 | g >>> 6 & 63), a[R++] = 128 | 63 & g);
            return a;
          })(d);
        }, c.utf8decode = function(d) {
          return i.nodebuffer ? s.transformTo("nodebuffer", d).toString("utf-8") : (function(p) {
            var a, g, f, x, R = p.length, k = new Array(2 * R);
            for (a = g = 0; a < R; ) if ((f = p[a++]) < 128) k[g++] = f;
            else if (4 < (x = v[f])) k[g++] = 65533, a += x - 1;
            else {
              for (f &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && a < R; ) f = f << 6 | 63 & p[a++], x--;
              1 < x ? k[g++] = 65533 : f < 65536 ? k[g++] = f : (f -= 65536, k[g++] = 55296 | f >> 10 & 1023, k[g++] = 56320 | 1023 & f);
            }
            return k.length !== g && (k.subarray ? k = k.subarray(0, g) : k.length = g), s.applyFromCharCode(k);
          })(d = s.transformTo(i.uint8array ? "uint8array" : "array", d));
        }, s.inherits(m, h), m.prototype.processChunk = function(d) {
          var p = s.transformTo(i.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var a = p;
              (p = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), p.set(a, this.leftOver.length);
            } else p = this.leftOver.concat(p);
            this.leftOver = null;
          }
          var g = (function(x, R) {
            var k;
            for ((R = R || x.length) > x.length && (R = x.length), k = R - 1; 0 <= k && (192 & x[k]) == 128; ) k--;
            return k < 0 || k === 0 ? R : k + v[x[k]] > R ? k : R;
          })(p), f = p;
          g !== p.length && (i.uint8array ? (f = p.subarray(0, g), this.leftOver = p.subarray(g, p.length)) : (f = p.slice(0, g), this.leftOver = p.slice(g, p.length))), this.push({ data: c.utf8decode(f), meta: d.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: c.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, c.Utf8DecodeWorker = m, s.inherits(u, h), u.prototype.processChunk = function(d) {
          this.push({ data: c.utf8encode(d.data), meta: d.meta });
        }, c.Utf8EncodeWorker = u;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, o, c) {
        var s = e("./support"), i = e("./base64"), n = e("./nodejsUtils"), h = e("./external");
        function v(a) {
          return a;
        }
        function b(a, g) {
          for (var f = 0; f < a.length; ++f) g[f] = 255 & a.charCodeAt(f);
          return g;
        }
        e("setimmediate"), c.newBlob = function(a, g) {
          c.checkSupport("blob");
          try {
            return new Blob([a], { type: g });
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return f.append(a), f.getBlob(g);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(a, g, f) {
          var x = [], R = 0, k = a.length;
          if (k <= f) return String.fromCharCode.apply(null, a);
          for (; R < k; ) g === "array" || g === "nodebuffer" ? x.push(String.fromCharCode.apply(null, a.slice(R, Math.min(R + f, k)))) : x.push(String.fromCharCode.apply(null, a.subarray(R, Math.min(R + f, k)))), R += f;
          return x.join("");
        }, stringifyByChar: function(a) {
          for (var g = "", f = 0; f < a.length; f++) g += String.fromCharCode(a[f]);
          return g;
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
        function u(a) {
          var g = 65536, f = c.getTypeOf(a), x = !0;
          if (f === "uint8array" ? x = m.applyCanBeUsed.uint8array : f === "nodebuffer" && (x = m.applyCanBeUsed.nodebuffer), x) for (; 1 < g; ) try {
            return m.stringifyByChunk(a, f, g);
          } catch {
            g = Math.floor(g / 2);
          }
          return m.stringifyByChar(a);
        }
        function d(a, g) {
          for (var f = 0; f < a.length; f++) g[f] = a[f];
          return g;
        }
        c.applyFromCharCode = u;
        var p = {};
        p.string = { string: v, array: function(a) {
          return b(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return p.string.uint8array(a).buffer;
        }, uint8array: function(a) {
          return b(a, new Uint8Array(a.length));
        }, nodebuffer: function(a) {
          return b(a, n.allocBuffer(a.length));
        } }, p.array = { string: u, array: v, arraybuffer: function(a) {
          return new Uint8Array(a).buffer;
        }, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, p.arraybuffer = { string: function(a) {
          return u(new Uint8Array(a));
        }, array: function(a) {
          return d(new Uint8Array(a), new Array(a.byteLength));
        }, arraybuffer: v, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(new Uint8Array(a));
        } }, p.uint8array = { string: u, array: function(a) {
          return d(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return a.buffer;
        }, uint8array: v, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, p.nodebuffer = { string: u, array: function(a) {
          return d(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return p.nodebuffer.uint8array(a).buffer;
        }, uint8array: function(a) {
          return d(a, new Uint8Array(a.length));
        }, nodebuffer: v }, c.transformTo = function(a, g) {
          if (g = g || "", !a) return g;
          c.checkSupport(a);
          var f = c.getTypeOf(g);
          return p[f][a](g);
        }, c.resolve = function(a) {
          for (var g = a.split("/"), f = [], x = 0; x < g.length; x++) {
            var R = g[x];
            R === "." || R === "" && x !== 0 && x !== g.length - 1 || (R === ".." ? f.pop() : f.push(R));
          }
          return f.join("/");
        }, c.getTypeOf = function(a) {
          return typeof a == "string" ? "string" : Object.prototype.toString.call(a) === "[object Array]" ? "array" : s.nodebuffer && n.isBuffer(a) ? "nodebuffer" : s.uint8array && a instanceof Uint8Array ? "uint8array" : s.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, c.checkSupport = function(a) {
          if (!s[a.toLowerCase()]) throw new Error(a + " is not supported by this platform");
        }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function(a) {
          var g, f, x = "";
          for (f = 0; f < (a || "").length; f++) x += "\\x" + ((g = a.charCodeAt(f)) < 16 ? "0" : "") + g.toString(16).toUpperCase();
          return x;
        }, c.delay = function(a, g, f) {
          setImmediate(function() {
            a.apply(f || null, g || []);
          });
        }, c.inherits = function(a, g) {
          function f() {
          }
          f.prototype = g.prototype, a.prototype = new f();
        }, c.extend = function() {
          var a, g, f = {};
          for (a = 0; a < arguments.length; a++) for (g in arguments[a]) Object.prototype.hasOwnProperty.call(arguments[a], g) && f[g] === void 0 && (f[g] = arguments[a][g]);
          return f;
        }, c.prepareContent = function(a, g, f, x, R) {
          return h.Promise.resolve(g).then(function(k) {
            return s.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(A, B) {
              var I = new FileReader();
              I.onload = function(U) {
                A(U.target.result);
              }, I.onerror = function(U) {
                B(U.target.error);
              }, I.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var A = c.getTypeOf(k);
            return A ? (A === "arraybuffer" ? k = c.transformTo("uint8array", k) : A === "string" && (R ? k = i.decode(k) : f && x !== !0 && (k = (function(B) {
              return b(B, s.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            })(k))), k) : h.Promise.reject(new Error("Can't read the data of '" + a + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, o, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), h = e("./zipEntry"), v = e("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var u = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(u) + ", expected " + i.pretty(m) + ")");
          }
        }, isSignature: function(m, u) {
          var d = this.reader.index;
          this.reader.setIndex(m);
          var p = this.reader.readString(4) === u;
          return this.reader.setIndex(d), p;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), u = v.uint8array ? "uint8array" : "array", d = i.transformTo(u, m);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, u, d, p = this.zip64EndOfCentralSize - 44; 0 < p; ) m = this.reader.readInt(2), u = this.reader.readInt(4), d = this.reader.readData(u), this.zip64ExtensibleData[m] = { id: m, length: u, value: d };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, u;
          for (m = 0; m < this.files.length; m++) u = this.files[m], this.reader.setIndex(u.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), u.readLocalPart(this.reader), u.handleUTF8(), u.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (m = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var u = m;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var d = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);
          var p = u - d;
          if (0 < p) this.isSignature(u, n.CENTRAL_FILE_HEADER) || (this.reader.zero = p);
          else if (p < 0) throw new Error("Corrupted zip: missing " + Math.abs(p) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, o.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, o, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), h = e("./crc32"), v = e("./utf8"), b = e("./compressions"), m = e("./support");
        function u(d, p) {
          this.options = d, this.loadOptions = p;
        }
        u.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var p, a;
          if (d.skip(22), this.fileNameLength = d.readInt(2), a = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(a), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((p = (function(g) {
            for (var f in b) if (Object.prototype.hasOwnProperty.call(b, f) && b[f].magic === g) return b[f];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, p, d.readData(this.compressedSize));
        }, readCentralPart: function(d) {
          this.versionMadeBy = d.readInt(2), d.skip(2), this.bitFlag = d.readInt(2), this.compressionMethod = d.readString(2), this.date = d.readDate(), this.crc32 = d.readInt(4), this.compressedSize = d.readInt(4), this.uncompressedSize = d.readInt(4);
          var p = d.readInt(2);
          if (this.extraFieldsLength = d.readInt(2), this.fileCommentLength = d.readInt(2), this.diskNumberStart = d.readInt(2), this.internalFileAttributes = d.readInt(2), this.externalFileAttributes = d.readInt(4), this.localHeaderOffset = d.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          d.skip(p), this.readExtraFields(d), this.parseZIP64ExtraField(d), this.fileComment = d.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var d = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), d == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), d == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var d = s(this.extraFields[1].value);
            this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var p, a, g, f = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < f; ) p = d.readInt(2), a = d.readInt(2), g = d.readData(a), this.extraFields[p] = { id: p, length: a, value: g };
          d.setIndex(f);
        }, handleUTF8: function() {
          var d = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var p = this.findExtraFieldUnicodePath();
            if (p !== null) this.fileNameStr = p;
            else {
              var a = i.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(a);
            }
            var g = this.findExtraFieldUnicodeComment();
            if (g !== null) this.fileCommentStr = g;
            else {
              var f = i.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var p = s(d.value);
            return p.readInt(1) !== 1 || h(this.fileName) !== p.readInt(4) ? null : v.utf8decode(p.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var p = s(d.value);
            return p.readInt(1) !== 1 || h(this.fileComment) !== p.readInt(4) ? null : v.utf8decode(p.readData(d.length - 5));
          }
          return null;
        } }, o.exports = u;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, o, c) {
        function s(p, a, g) {
          this.name = p, this.dir = g.dir, this.date = g.date, this.comment = g.comment, this.unixPermissions = g.unixPermissions, this.dosPermissions = g.dosPermissions, this._data = a, this._dataBinary = g.binary, this.options = { compression: g.compression, compressionOptions: g.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), h = e("./utf8"), v = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(p) {
          var a = null, g = "string";
          try {
            if (!p) throw new Error("No output type specified.");
            var f = (g = p.toLowerCase()) === "string" || g === "text";
            g !== "binarystring" && g !== "text" || (g = "string"), a = this._decompressWorker();
            var x = !this._dataBinary;
            x && !f && (a = a.pipe(new h.Utf8EncodeWorker())), !x && f && (a = a.pipe(new h.Utf8DecodeWorker()));
          } catch (R) {
            (a = new b("error")).error(R);
          }
          return new i(a, g, "");
        }, async: function(p, a) {
          return this.internalStream(p).accumulate(a);
        }, nodeStream: function(p, a) {
          return this.internalStream(p || "nodebuffer").toNodejsStream(a);
        }, _compressWorker: function(p, a) {
          if (this._data instanceof v && this._data.compression.magic === p.magic) return this._data.getCompressedWorker();
          var g = this._decompressWorker();
          return this._dataBinary || (g = g.pipe(new h.Utf8EncodeWorker())), v.createWorkerFrom(g, p, a);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], u = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < m.length; d++) s.prototype[m[d]] = u;
        o.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, o, c) {
        (function(s) {
          var i, n, h = s.MutationObserver || s.WebKitMutationObserver;
          if (h) {
            var v = 0, b = new h(p), m = s.document.createTextNode("");
            b.observe(m, { characterData: !0 }), i = function() {
              m.data = v = ++v % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) i = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var a = s.document.createElement("script");
            a.onreadystatechange = function() {
              p(), a.onreadystatechange = null, a.parentNode.removeChild(a), a = null;
            }, s.document.documentElement.appendChild(a);
          } : function() {
            setTimeout(p, 0);
          };
          else {
            var u = new s.MessageChannel();
            u.port1.onmessage = p, i = function() {
              u.port2.postMessage(0);
            };
          }
          var d = [];
          function p() {
            var a, g;
            n = !0;
            for (var f = d.length; f; ) {
              for (g = d, d = [], a = -1; ++a < f; ) g[a]();
              f = d.length;
            }
            n = !1;
          }
          o.exports = function(a) {
            d.push(a) !== 1 || n || i();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, o, c) {
        var s = e("immediate");
        function i() {
        }
        var n = {}, h = ["REJECTED"], v = ["FULFILLED"], b = ["PENDING"];
        function m(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, f !== i && a(this, f);
        }
        function u(f, x, R) {
          this.promise = f, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof R == "function" && (this.onRejected = R, this.callRejected = this.otherCallRejected);
        }
        function d(f, x, R) {
          s(function() {
            var k;
            try {
              k = x(R);
            } catch (A) {
              return n.reject(f, A);
            }
            k === f ? n.reject(f, new TypeError("Cannot resolve promise with itself")) : n.resolve(f, k);
          });
        }
        function p(f) {
          var x = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof x == "function") return function() {
            x.apply(f, arguments);
          };
        }
        function a(f, x) {
          var R = !1;
          function k(I) {
            R || (R = !0, n.reject(f, I));
          }
          function A(I) {
            R || (R = !0, n.resolve(f, I));
          }
          var B = g(function() {
            x(A, k);
          });
          B.status === "error" && k(B.value);
        }
        function g(f, x) {
          var R = {};
          try {
            R.value = f(x), R.status = "success";
          } catch (k) {
            R.status = "error", R.value = k;
          }
          return R;
        }
        (o.exports = m).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var x = this.constructor;
          return this.then(function(R) {
            return x.resolve(f()).then(function() {
              return R;
            });
          }, function(R) {
            return x.resolve(f()).then(function() {
              throw R;
            });
          });
        }, m.prototype.catch = function(f) {
          return this.then(null, f);
        }, m.prototype.then = function(f, x) {
          if (typeof f != "function" && this.state === v || typeof x != "function" && this.state === h) return this;
          var R = new this.constructor(i);
          return this.state !== b ? d(R, this.state === v ? f : x, this.outcome) : this.queue.push(new u(R, f, x)), R;
        }, u.prototype.callFulfilled = function(f) {
          n.resolve(this.promise, f);
        }, u.prototype.otherCallFulfilled = function(f) {
          d(this.promise, this.onFulfilled, f);
        }, u.prototype.callRejected = function(f) {
          n.reject(this.promise, f);
        }, u.prototype.otherCallRejected = function(f) {
          d(this.promise, this.onRejected, f);
        }, n.resolve = function(f, x) {
          var R = g(p, x);
          if (R.status === "error") return n.reject(f, R.value);
          var k = R.value;
          if (k) a(f, k);
          else {
            f.state = v, f.outcome = x;
            for (var A = -1, B = f.queue.length; ++A < B; ) f.queue[A].callFulfilled(x);
          }
          return f;
        }, n.reject = function(f, x) {
          f.state = h, f.outcome = x;
          for (var R = -1, k = f.queue.length; ++R < k; ) f.queue[R].callRejected(x);
          return f;
        }, m.resolve = function(f) {
          return f instanceof this ? f : n.resolve(new this(i), f);
        }, m.reject = function(f) {
          var x = new this(i);
          return n.reject(x, f);
        }, m.all = function(f) {
          var x = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = f.length, k = !1;
          if (!R) return this.resolve([]);
          for (var A = new Array(R), B = 0, I = -1, U = new this(i); ++I < R; ) T(f[I], I);
          return U;
          function T(j, K) {
            x.resolve(j).then(function(S) {
              A[K] = S, ++B !== R || k || (k = !0, n.resolve(U, A));
            }, function(S) {
              k || (k = !0, n.reject(U, S));
            });
          }
        }, m.race = function(f) {
          var x = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = f.length, k = !1;
          if (!R) return this.resolve([]);
          for (var A = -1, B = new this(i); ++A < R; ) I = f[A], x.resolve(I).then(function(U) {
            k || (k = !0, n.resolve(B, U));
          }, function(U) {
            k || (k = !0, n.reject(B, U));
          });
          var I;
          return B;
        };
      }, { immediate: 36 }], 38: [function(e, o, c) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), o.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, o, c) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/messages"), v = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, u = -1, d = 0, p = 8;
        function a(f) {
          if (!(this instanceof a)) return new a(f);
          this.options = i.assign({ level: u, method: p, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, f || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var R = s.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (R !== m) throw new Error(h[R]);
          if (x.header && s.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var k;
            if (k = typeof x.dictionary == "string" ? n.string2buf(x.dictionary) : b.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (R = s.deflateSetDictionary(this.strm, k)) !== m) throw new Error(h[R]);
            this._dict_set = !0;
          }
        }
        function g(f, x) {
          var R = new a(x);
          if (R.push(f, !0), R.err) throw R.msg || h[R.err];
          return R.result;
        }
        a.prototype.push = function(f, x) {
          var R, k, A = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          k = x === ~~x ? x : x === !0 ? 4 : 0, typeof f == "string" ? A.input = n.string2buf(f) : b.call(f) === "[object ArrayBuffer]" ? A.input = new Uint8Array(f) : A.input = f, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new i.Buf8(B), A.next_out = 0, A.avail_out = B), (R = s.deflate(A, k)) !== 1 && R !== m) return this.onEnd(R), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(i.shrinkBuf(A.output, A.next_out))) : this.onData(i.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && R !== 1);
          return k === 4 ? (R = s.deflateEnd(this.strm), this.onEnd(R), this.ended = !0, R === m) : k !== 2 || (this.onEnd(m), !(A.avail_out = 0));
        }, a.prototype.onData = function(f) {
          this.chunks.push(f);
        }, a.prototype.onEnd = function(f) {
          f === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, c.Deflate = a, c.deflate = g, c.deflateRaw = function(f, x) {
          return (x = x || {}).raw = !0, g(f, x);
        }, c.gzip = function(f, x) {
          return (x = x || {}).gzip = !0, g(f, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, o, c) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/constants"), v = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), u = Object.prototype.toString;
        function d(a) {
          if (!(this instanceof d)) return new d(a);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});
          var g = this.options;
          g.raw && 0 <= g.windowBits && g.windowBits < 16 && (g.windowBits = -g.windowBits, g.windowBits === 0 && (g.windowBits = -15)), !(0 <= g.windowBits && g.windowBits < 16) || a && a.windowBits || (g.windowBits += 32), 15 < g.windowBits && g.windowBits < 48 && (15 & g.windowBits) == 0 && (g.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var f = s.inflateInit2(this.strm, g.windowBits);
          if (f !== h.Z_OK) throw new Error(v[f]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function p(a, g) {
          var f = new d(g);
          if (f.push(a, !0), f.err) throw f.msg || v[f.err];
          return f.result;
        }
        d.prototype.push = function(a, g) {
          var f, x, R, k, A, B, I = this.strm, U = this.options.chunkSize, T = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          x = g === ~~g ? g : g === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof a == "string" ? I.input = n.binstring2buf(a) : u.call(a) === "[object ArrayBuffer]" ? I.input = new Uint8Array(a) : I.input = a, I.next_in = 0, I.avail_in = I.input.length;
          do {
            if (I.avail_out === 0 && (I.output = new i.Buf8(U), I.next_out = 0, I.avail_out = U), (f = s.inflate(I, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && T && (B = typeof T == "string" ? n.string2buf(T) : u.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, f = s.inflateSetDictionary(this.strm, B)), f === h.Z_BUF_ERROR && j === !0 && (f = h.Z_OK, j = !1), f !== h.Z_STREAM_END && f !== h.Z_OK) return this.onEnd(f), !(this.ended = !0);
            I.next_out && (I.avail_out !== 0 && f !== h.Z_STREAM_END && (I.avail_in !== 0 || x !== h.Z_FINISH && x !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (R = n.utf8border(I.output, I.next_out), k = I.next_out - R, A = n.buf2string(I.output, R), I.next_out = k, I.avail_out = U - k, k && i.arraySet(I.output, I.output, R, k, 0), this.onData(A)) : this.onData(i.shrinkBuf(I.output, I.next_out)))), I.avail_in === 0 && I.avail_out === 0 && (j = !0);
          } while ((0 < I.avail_in || I.avail_out === 0) && f !== h.Z_STREAM_END);
          return f === h.Z_STREAM_END && (x = h.Z_FINISH), x === h.Z_FINISH ? (f = s.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === h.Z_OK) : x !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(I.avail_out = 0));
        }, d.prototype.onData = function(a) {
          this.chunks.push(a);
        }, d.prototype.onEnd = function(a) {
          a === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, c.Inflate = d, c.inflate = p, c.inflateRaw = function(a, g) {
          return (g = g || {}).raw = !0, p(a, g);
        }, c.ungzip = p;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, o, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        c.assign = function(h) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var b = v.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (h[m] = b[m]);
            }
          }
          return h;
        }, c.shrinkBuf = function(h, v) {
          return h.length === v ? h : h.subarray ? h.subarray(0, v) : (h.length = v, h);
        };
        var i = { arraySet: function(h, v, b, m, u) {
          if (v.subarray && h.subarray) h.set(v.subarray(b, b + m), u);
          else for (var d = 0; d < m; d++) h[u + d] = v[b + d];
        }, flattenChunks: function(h) {
          var v, b, m, u, d, p;
          for (v = m = 0, b = h.length; v < b; v++) m += h[v].length;
          for (p = new Uint8Array(m), v = u = 0, b = h.length; v < b; v++) d = h[v], p.set(d, u), u += d.length;
          return p;
        } }, n = { arraySet: function(h, v, b, m, u) {
          for (var d = 0; d < m; d++) h[u + d] = v[b + d];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        c.setTyped = function(h) {
          h ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, i)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, n));
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
        for (var h = new s.Buf8(256), v = 0; v < 256; v++) h[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function b(m, u) {
          if (u < 65537 && (m.subarray && n || !m.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(m, u));
          for (var d = "", p = 0; p < u; p++) d += String.fromCharCode(m[p]);
          return d;
        }
        h[254] = h[254] = 1, c.string2buf = function(m) {
          var u, d, p, a, g, f = m.length, x = 0;
          for (a = 0; a < f; a++) (64512 & (d = m.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (p = m.charCodeAt(a + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (p - 56320), a++), x += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (u = new s.Buf8(x), a = g = 0; g < x; a++) (64512 & (d = m.charCodeAt(a))) == 55296 && a + 1 < f && (64512 & (p = m.charCodeAt(a + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (p - 56320), a++), d < 128 ? u[g++] = d : (d < 2048 ? u[g++] = 192 | d >>> 6 : (d < 65536 ? u[g++] = 224 | d >>> 12 : (u[g++] = 240 | d >>> 18, u[g++] = 128 | d >>> 12 & 63), u[g++] = 128 | d >>> 6 & 63), u[g++] = 128 | 63 & d);
          return u;
        }, c.buf2binstring = function(m) {
          return b(m, m.length);
        }, c.binstring2buf = function(m) {
          for (var u = new s.Buf8(m.length), d = 0, p = u.length; d < p; d++) u[d] = m.charCodeAt(d);
          return u;
        }, c.buf2string = function(m, u) {
          var d, p, a, g, f = u || m.length, x = new Array(2 * f);
          for (d = p = 0; d < f; ) if ((a = m[d++]) < 128) x[p++] = a;
          else if (4 < (g = h[a])) x[p++] = 65533, d += g - 1;
          else {
            for (a &= g === 2 ? 31 : g === 3 ? 15 : 7; 1 < g && d < f; ) a = a << 6 | 63 & m[d++], g--;
            1 < g ? x[p++] = 65533 : a < 65536 ? x[p++] = a : (a -= 65536, x[p++] = 55296 | a >> 10 & 1023, x[p++] = 56320 | 1023 & a);
          }
          return b(x, p);
        }, c.utf8border = function(m, u) {
          var d;
          for ((u = u || m.length) > m.length && (u = m.length), d = u - 1; 0 <= d && (192 & m[d]) == 128; ) d--;
          return d < 0 || d === 0 ? u : d + h[m[d]] > u ? d : u;
        };
      }, { "./common": 41 }], 43: [function(e, o, c) {
        o.exports = function(s, i, n, h) {
          for (var v = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; n !== 0; ) {
            for (n -= m = 2e3 < n ? 2e3 : n; b = b + (v = v + i[h++] | 0) | 0, --m; ) ;
            v %= 65521, b %= 65521;
          }
          return v | b << 16 | 0;
        };
      }, {}], 44: [function(e, o, c) {
        o.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, o, c) {
        var s = (function() {
          for (var i, n = [], h = 0; h < 256; h++) {
            i = h;
            for (var v = 0; v < 8; v++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            n[h] = i;
          }
          return n;
        })();
        o.exports = function(i, n, h, v) {
          var b = s, m = v + h;
          i ^= -1;
          for (var u = v; u < m; u++) i = i >>> 8 ^ b[255 & (i ^ n[u])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, o, c) {
        var s, i = e("../utils/common"), n = e("./trees"), h = e("./adler32"), v = e("./crc32"), b = e("./messages"), m = 0, u = 4, d = 0, p = -2, a = -1, g = 4, f = 2, x = 8, R = 9, k = 286, A = 30, B = 19, I = 2 * k + 1, U = 15, T = 3, j = 258, K = j + T + 1, S = 42, F = 113, l = 1, D = 2, J = 3, $ = 4;
        function rt(r, N) {
          return r.msg = b[N], N;
        }
        function Y(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function P(r) {
          for (var N = r.length; 0 <= --N; ) r[N] = 0;
        }
        function z(r) {
          var N = r.state, O = N.pending;
          O > r.avail_out && (O = r.avail_out), O !== 0 && (i.arraySet(r.output, N.pending_buf, N.pending_out, O, r.next_out), r.next_out += O, N.pending_out += O, r.total_out += O, r.avail_out -= O, N.pending -= O, N.pending === 0 && (N.pending_out = 0));
        }
        function E(r, N) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, N), r.block_start = r.strstart, z(r.strm);
        }
        function Z(r, N) {
          r.pending_buf[r.pending++] = N;
        }
        function G(r, N) {
          r.pending_buf[r.pending++] = N >>> 8 & 255, r.pending_buf[r.pending++] = 255 & N;
        }
        function L(r, N) {
          var O, w, _ = r.max_chain_length, M = r.strstart, W = r.prev_length, X = r.nice_match, C = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, V = r.window, H = r.w_mask, q = r.prev, Q = r.strstart + j, ct = V[M + W - 1], ot = V[M + W];
          r.prev_length >= r.good_match && (_ >>= 2), X > r.lookahead && (X = r.lookahead);
          do
            if (V[(O = N) + W] === ot && V[O + W - 1] === ct && V[O] === V[M] && V[++O] === V[M + 1]) {
              M += 2, O++;
              do
                ;
              while (V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && M < Q);
              if (w = j - (Q - M), M = Q - j, W < w) {
                if (r.match_start = N, X <= (W = w)) break;
                ct = V[M + W - 1], ot = V[M + W];
              }
            }
          while ((N = q[N & H]) > C && --_ != 0);
          return W <= r.lookahead ? W : r.lookahead;
        }
        function tt(r) {
          var N, O, w, _, M, W, X, C, V, H, q = r.w_size;
          do {
            if (_ = r.window_size - r.lookahead - r.strstart, r.strstart >= q + (q - K)) {
              for (i.arraySet(r.window, r.window, q, q, 0), r.match_start -= q, r.strstart -= q, r.block_start -= q, N = O = r.hash_size; w = r.head[--N], r.head[N] = q <= w ? w - q : 0, --O; ) ;
              for (N = O = q; w = r.prev[--N], r.prev[N] = q <= w ? w - q : 0, --O; ) ;
              _ += q;
            }
            if (r.strm.avail_in === 0) break;
            if (W = r.strm, X = r.window, C = r.strstart + r.lookahead, V = _, H = void 0, H = W.avail_in, V < H && (H = V), O = H === 0 ? 0 : (W.avail_in -= H, i.arraySet(X, W.input, W.next_in, H, C), W.state.wrap === 1 ? W.adler = h(W.adler, X, H, C) : W.state.wrap === 2 && (W.adler = v(W.adler, X, H, C)), W.next_in += H, W.total_in += H, H), r.lookahead += O, r.lookahead + r.insert >= T) for (M = r.strstart - r.insert, r.ins_h = r.window[M], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[M + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[M + T - 1]) & r.hash_mask, r.prev[M & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = M, M++, r.insert--, !(r.lookahead + r.insert < T)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function at(r, N) {
          for (var O, w; ; ) {
            if (r.lookahead < K) {
              if (tt(r), r.lookahead < K && N === m) return l;
              if (r.lookahead === 0) break;
            }
            if (O = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), O !== 0 && r.strstart - O <= r.w_size - K && (r.match_length = L(r, O)), r.match_length >= T) if (w = n._tr_tally(r, r.strstart - r.match_start, r.match_length - T), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= T) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else w = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (w && (E(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === u ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function et(r, N) {
          for (var O, w, _; ; ) {
            if (r.lookahead < K) {
              if (tt(r), r.lookahead < K && N === m) return l;
              if (r.lookahead === 0) break;
            }
            if (O = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = T - 1, O !== 0 && r.prev_length < r.max_lazy_match && r.strstart - O <= r.w_size - K && (r.match_length = L(r, O), r.match_length <= 5 && (r.strategy === 1 || r.match_length === T && 4096 < r.strstart - r.match_start) && (r.match_length = T - 1)), r.prev_length >= T && r.match_length <= r.prev_length) {
              for (_ = r.strstart + r.lookahead - T, w = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - T), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= _ && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = T - 1, r.strstart++, w && (E(r, !1), r.strm.avail_out === 0)) return l;
            } else if (r.match_available) {
              if ((w = n._tr_tally(r, 0, r.window[r.strstart - 1])) && E(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return l;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (w = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < T - 1 ? r.strstart : T - 1, N === u ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? l : D;
        }
        function it(r, N, O, w, _) {
          this.good_length = r, this.max_lazy = N, this.nice_length = O, this.max_chain = w, this.func = _;
        }
        function lt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * I), this.dyn_dtree = new i.Buf16(2 * (2 * A + 1)), this.bl_tree = new i.Buf16(2 * (2 * B + 1)), P(this.dyn_ltree), P(this.dyn_dtree), P(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(U + 1), this.heap = new i.Buf16(2 * k + 1), P(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * k + 1), P(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function st(r) {
          var N;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = f, (N = r.state).pending = 0, N.pending_out = 0, N.wrap < 0 && (N.wrap = -N.wrap), N.status = N.wrap ? S : F, r.adler = N.wrap === 2 ? 0 : 1, N.last_flush = m, n._tr_init(N), d) : rt(r, p);
        }
        function nt(r) {
          var N = st(r);
          return N === d && (function(O) {
            O.window_size = 2 * O.w_size, P(O.head), O.max_lazy_match = s[O.level].max_lazy, O.good_match = s[O.level].good_length, O.nice_match = s[O.level].nice_length, O.max_chain_length = s[O.level].max_chain, O.strstart = 0, O.block_start = 0, O.lookahead = 0, O.insert = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, O.ins_h = 0;
          })(r.state), N;
        }
        function ut(r, N, O, w, _, M) {
          if (!r) return p;
          var W = 1;
          if (N === a && (N = 6), w < 0 ? (W = 0, w = -w) : 15 < w && (W = 2, w -= 16), _ < 1 || R < _ || O !== x || w < 8 || 15 < w || N < 0 || 9 < N || M < 0 || g < M) return rt(r, p);
          w === 8 && (w = 9);
          var X = new lt();
          return (r.state = X).strm = r, X.wrap = W, X.gzhead = null, X.w_bits = w, X.w_size = 1 << X.w_bits, X.w_mask = X.w_size - 1, X.hash_bits = _ + 7, X.hash_size = 1 << X.hash_bits, X.hash_mask = X.hash_size - 1, X.hash_shift = ~~((X.hash_bits + T - 1) / T), X.window = new i.Buf8(2 * X.w_size), X.head = new i.Buf16(X.hash_size), X.prev = new i.Buf16(X.w_size), X.lit_bufsize = 1 << _ + 6, X.pending_buf_size = 4 * X.lit_bufsize, X.pending_buf = new i.Buf8(X.pending_buf_size), X.d_buf = 1 * X.lit_bufsize, X.l_buf = 3 * X.lit_bufsize, X.level = N, X.strategy = M, X.method = O, nt(r);
        }
        s = [new it(0, 0, 0, 0, function(r, N) {
          var O = 65535;
          for (O > r.pending_buf_size - 5 && (O = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (tt(r), r.lookahead === 0 && N === m) return l;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var w = r.block_start + O;
            if ((r.strstart === 0 || r.strstart >= w) && (r.lookahead = r.strstart - w, r.strstart = w, E(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (E(r, !1), r.strm.avail_out === 0)) return l;
          }
          return r.insert = 0, N === u ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : (r.strstart > r.block_start && (E(r, !1), r.strm.avail_out), l);
        }), new it(4, 4, 8, 4, at), new it(4, 5, 16, 8, at), new it(4, 6, 32, 32, at), new it(4, 4, 16, 16, et), new it(8, 16, 32, 32, et), new it(8, 16, 128, 128, et), new it(8, 32, 128, 256, et), new it(32, 128, 258, 1024, et), new it(32, 258, 258, 4096, et)], c.deflateInit = function(r, N) {
          return ut(r, N, x, 15, 8, 0);
        }, c.deflateInit2 = ut, c.deflateReset = nt, c.deflateResetKeep = st, c.deflateSetHeader = function(r, N) {
          return r && r.state ? r.state.wrap !== 2 ? p : (r.state.gzhead = N, d) : p;
        }, c.deflate = function(r, N) {
          var O, w, _, M;
          if (!r || !r.state || 5 < N || N < 0) return r ? rt(r, p) : p;
          if (w = r.state, !r.output || !r.input && r.avail_in !== 0 || w.status === 666 && N !== u) return rt(r, r.avail_out === 0 ? -5 : p);
          if (w.strm = r, O = w.last_flush, w.last_flush = N, w.status === S) if (w.wrap === 2) r.adler = 0, Z(w, 31), Z(w, 139), Z(w, 8), w.gzhead ? (Z(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), Z(w, 255 & w.gzhead.time), Z(w, w.gzhead.time >> 8 & 255), Z(w, w.gzhead.time >> 16 & 255), Z(w, w.gzhead.time >> 24 & 255), Z(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), Z(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (Z(w, 255 & w.gzhead.extra.length), Z(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (r.adler = v(r.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (Z(w, 0), Z(w, 0), Z(w, 0), Z(w, 0), Z(w, 0), Z(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), Z(w, 3), w.status = F);
          else {
            var W = x + (w.w_bits - 8 << 4) << 8;
            W |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (W |= 32), W += 31 - W % 31, w.status = F, G(w, W), w.strstart !== 0 && (G(w, r.adler >>> 16), G(w, 65535 & r.adler)), r.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (_ = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), z(r), _ = w.pending, w.pending !== w.pending_buf_size)); ) Z(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            _ = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), z(r), _ = w.pending, w.pending === w.pending_buf_size)) {
                M = 1;
                break;
              }
              M = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, Z(w, M);
            } while (M !== 0);
            w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), M === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            _ = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), z(r), _ = w.pending, w.pending === w.pending_buf_size)) {
                M = 1;
                break;
              }
              M = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, Z(w, M);
            } while (M !== 0);
            w.gzhead.hcrc && w.pending > _ && (r.adler = v(r.adler, w.pending_buf, w.pending - _, _)), M === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && z(r), w.pending + 2 <= w.pending_buf_size && (Z(w, 255 & r.adler), Z(w, r.adler >> 8 & 255), r.adler = 0, w.status = F)) : w.status = F), w.pending !== 0) {
            if (z(r), r.avail_out === 0) return w.last_flush = -1, d;
          } else if (r.avail_in === 0 && Y(N) <= Y(O) && N !== u) return rt(r, -5);
          if (w.status === 666 && r.avail_in !== 0) return rt(r, -5);
          if (r.avail_in !== 0 || w.lookahead !== 0 || N !== m && w.status !== 666) {
            var X = w.strategy === 2 ? (function(C, V) {
              for (var H; ; ) {
                if (C.lookahead === 0 && (tt(C), C.lookahead === 0)) {
                  if (V === m) return l;
                  break;
                }
                if (C.match_length = 0, H = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, H && (E(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, V === u ? (E(C, !0), C.strm.avail_out === 0 ? J : $) : C.last_lit && (E(C, !1), C.strm.avail_out === 0) ? l : D;
            })(w, N) : w.strategy === 3 ? (function(C, V) {
              for (var H, q, Q, ct, ot = C.window; ; ) {
                if (C.lookahead <= j) {
                  if (tt(C), C.lookahead <= j && V === m) return l;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= T && 0 < C.strstart && (q = ot[Q = C.strstart - 1]) === ot[++Q] && q === ot[++Q] && q === ot[++Q]) {
                  ct = C.strstart + j;
                  do
                    ;
                  while (q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && q === ot[++Q] && Q < ct);
                  C.match_length = j - (ct - Q), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= T ? (H = n._tr_tally(C, 1, C.match_length - T), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (H = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), H && (E(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, V === u ? (E(C, !0), C.strm.avail_out === 0 ? J : $) : C.last_lit && (E(C, !1), C.strm.avail_out === 0) ? l : D;
            })(w, N) : s[w.level].func(w, N);
            if (X !== J && X !== $ || (w.status = 666), X === l || X === J) return r.avail_out === 0 && (w.last_flush = -1), d;
            if (X === D && (N === 1 ? n._tr_align(w) : N !== 5 && (n._tr_stored_block(w, 0, 0, !1), N === 3 && (P(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), z(r), r.avail_out === 0)) return w.last_flush = -1, d;
          }
          return N !== u ? d : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (Z(w, 255 & r.adler), Z(w, r.adler >> 8 & 255), Z(w, r.adler >> 16 & 255), Z(w, r.adler >> 24 & 255), Z(w, 255 & r.total_in), Z(w, r.total_in >> 8 & 255), Z(w, r.total_in >> 16 & 255), Z(w, r.total_in >> 24 & 255)) : (G(w, r.adler >>> 16), G(w, 65535 & r.adler)), z(r), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? d : 1);
        }, c.deflateEnd = function(r) {
          var N;
          return r && r.state ? (N = r.state.status) !== S && N !== 69 && N !== 73 && N !== 91 && N !== 103 && N !== F && N !== 666 ? rt(r, p) : (r.state = null, N === F ? rt(r, -3) : d) : p;
        }, c.deflateSetDictionary = function(r, N) {
          var O, w, _, M, W, X, C, V, H = N.length;
          if (!r || !r.state || (M = (O = r.state).wrap) === 2 || M === 1 && O.status !== S || O.lookahead) return p;
          for (M === 1 && (r.adler = h(r.adler, N, H, 0)), O.wrap = 0, H >= O.w_size && (M === 0 && (P(O.head), O.strstart = 0, O.block_start = 0, O.insert = 0), V = new i.Buf8(O.w_size), i.arraySet(V, N, H - O.w_size, O.w_size, 0), N = V, H = O.w_size), W = r.avail_in, X = r.next_in, C = r.input, r.avail_in = H, r.next_in = 0, r.input = N, tt(O); O.lookahead >= T; ) {
            for (w = O.strstart, _ = O.lookahead - (T - 1); O.ins_h = (O.ins_h << O.hash_shift ^ O.window[w + T - 1]) & O.hash_mask, O.prev[w & O.w_mask] = O.head[O.ins_h], O.head[O.ins_h] = w, w++, --_; ) ;
            O.strstart = w, O.lookahead = T - 1, tt(O);
          }
          return O.strstart += O.lookahead, O.block_start = O.strstart, O.insert = O.lookahead, O.lookahead = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, r.next_in = X, r.input = C, r.avail_in = W, O.wrap = M, d;
        }, c.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, o, c) {
        o.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, o, c) {
        o.exports = function(s, i) {
          var n, h, v, b, m, u, d, p, a, g, f, x, R, k, A, B, I, U, T, j, K, S, F, l, D;
          n = s.state, h = s.next_in, l = s.input, v = h + (s.avail_in - 5), b = s.next_out, D = s.output, m = b - (i - s.avail_out), u = b + (s.avail_out - 257), d = n.dmax, p = n.wsize, a = n.whave, g = n.wnext, f = n.window, x = n.hold, R = n.bits, k = n.lencode, A = n.distcode, B = (1 << n.lenbits) - 1, I = (1 << n.distbits) - 1;
          t: do {
            R < 15 && (x += l[h++] << R, R += 8, x += l[h++] << R, R += 8), U = k[x & B];
            e: for (; ; ) {
              if (x >>>= T = U >>> 24, R -= T, (T = U >>> 16 & 255) === 0) D[b++] = 65535 & U;
              else {
                if (!(16 & T)) {
                  if ((64 & T) == 0) {
                    U = k[(65535 & U) + (x & (1 << T) - 1)];
                    continue e;
                  }
                  if (32 & T) {
                    n.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                j = 65535 & U, (T &= 15) && (R < T && (x += l[h++] << R, R += 8), j += x & (1 << T) - 1, x >>>= T, R -= T), R < 15 && (x += l[h++] << R, R += 8, x += l[h++] << R, R += 8), U = A[x & I];
                r: for (; ; ) {
                  if (x >>>= T = U >>> 24, R -= T, !(16 & (T = U >>> 16 & 255))) {
                    if ((64 & T) == 0) {
                      U = A[(65535 & U) + (x & (1 << T) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & U, R < (T &= 15) && (x += l[h++] << R, (R += 8) < T && (x += l[h++] << R, R += 8)), d < (K += x & (1 << T) - 1)) {
                    s.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (x >>>= T, R -= T, (T = b - m) < K) {
                    if (a < (T = K - T) && n.sane) {
                      s.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (F = f, (S = 0) === g) {
                      if (S += p - T, T < j) {
                        for (j -= T; D[b++] = f[S++], --T; ) ;
                        S = b - K, F = D;
                      }
                    } else if (g < T) {
                      if (S += p + g - T, (T -= g) < j) {
                        for (j -= T; D[b++] = f[S++], --T; ) ;
                        if (S = 0, g < j) {
                          for (j -= T = g; D[b++] = f[S++], --T; ) ;
                          S = b - K, F = D;
                        }
                      }
                    } else if (S += g - T, T < j) {
                      for (j -= T; D[b++] = f[S++], --T; ) ;
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
          } while (h < v && b < u);
          h -= j = R >> 3, x &= (1 << (R -= j << 3)) - 1, s.next_in = h, s.next_out = b, s.avail_in = h < v ? v - h + 5 : 5 - (h - v), s.avail_out = b < u ? u - b + 257 : 257 - (b - u), n.hold = x, n.bits = R;
        };
      }, {}], 49: [function(e, o, c) {
        var s = e("../utils/common"), i = e("./adler32"), n = e("./crc32"), h = e("./inffast"), v = e("./inftrees"), b = 1, m = 2, u = 0, d = -2, p = 1, a = 852, g = 592;
        function f(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function x() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function R(S) {
          var F;
          return S && S.state ? (F = S.state, S.total_in = S.total_out = F.total = 0, S.msg = "", F.wrap && (S.adler = 1 & F.wrap), F.mode = p, F.last = 0, F.havedict = 0, F.dmax = 32768, F.head = null, F.hold = 0, F.bits = 0, F.lencode = F.lendyn = new s.Buf32(a), F.distcode = F.distdyn = new s.Buf32(g), F.sane = 1, F.back = -1, u) : d;
        }
        function k(S) {
          var F;
          return S && S.state ? ((F = S.state).wsize = 0, F.whave = 0, F.wnext = 0, R(S)) : d;
        }
        function A(S, F) {
          var l, D;
          return S && S.state ? (D = S.state, F < 0 ? (l = 0, F = -F) : (l = 1 + (F >> 4), F < 48 && (F &= 15)), F && (F < 8 || 15 < F) ? d : (D.window !== null && D.wbits !== F && (D.window = null), D.wrap = l, D.wbits = F, k(S))) : d;
        }
        function B(S, F) {
          var l, D;
          return S ? (D = new x(), (S.state = D).window = null, (l = A(S, F)) !== u && (S.state = null), l) : d;
        }
        var I, U, T = !0;
        function j(S) {
          if (T) {
            var F;
            for (I = new s.Buf32(512), U = new s.Buf32(32), F = 0; F < 144; ) S.lens[F++] = 8;
            for (; F < 256; ) S.lens[F++] = 9;
            for (; F < 280; ) S.lens[F++] = 7;
            for (; F < 288; ) S.lens[F++] = 8;
            for (v(b, S.lens, 0, 288, I, 0, S.work, { bits: 9 }), F = 0; F < 32; ) S.lens[F++] = 5;
            v(m, S.lens, 0, 32, U, 0, S.work, { bits: 5 }), T = !1;
          }
          S.lencode = I, S.lenbits = 9, S.distcode = U, S.distbits = 5;
        }
        function K(S, F, l, D) {
          var J, $ = S.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new s.Buf8($.wsize)), D >= $.wsize ? (s.arraySet($.window, F, l - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (D < (J = $.wsize - $.wnext) && (J = D), s.arraySet($.window, F, l - D, J, $.wnext), (D -= J) ? (s.arraySet($.window, F, l - D, D, 0), $.wnext = D, $.whave = $.wsize) : ($.wnext += J, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += J))), 0;
        }
        c.inflateReset = k, c.inflateReset2 = A, c.inflateResetKeep = R, c.inflateInit = function(S) {
          return B(S, 15);
        }, c.inflateInit2 = B, c.inflate = function(S, F) {
          var l, D, J, $, rt, Y, P, z, E, Z, G, L, tt, at, et, it, lt, st, nt, ut, r, N, O, w, _ = 0, M = new s.Buf8(4), W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return d;
          (l = S.state).mode === 12 && (l.mode = 13), rt = S.next_out, J = S.output, P = S.avail_out, $ = S.next_in, D = S.input, Y = S.avail_in, z = l.hold, E = l.bits, Z = Y, G = P, N = u;
          t: for (; ; ) switch (l.mode) {
            case p:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if (2 & l.wrap && z === 35615) {
                M[l.check = 0] = 255 & z, M[1] = z >>> 8 & 255, l.check = n(l.check, M, 2, 0), E = z = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & z) << 8) + (z >> 8)) % 31) {
                S.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & z) != 8) {
                S.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (E -= 4, r = 8 + (15 & (z >>>= 4)), l.wbits === 0) l.wbits = r;
              else if (r > l.wbits) {
                S.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << r, S.adler = l.check = 1, l.mode = 512 & z ? 10 : 12, E = z = 0;
              break;
            case 2:
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if (l.flags = z, (255 & l.flags) != 8) {
                S.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                S.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = z >> 8 & 1), 512 & l.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, l.check = n(l.check, M, 2, 0)), E = z = 0, l.mode = 3;
            case 3:
              for (; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              l.head && (l.head.time = z), 512 & l.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, M[2] = z >>> 16 & 255, M[3] = z >>> 24 & 255, l.check = n(l.check, M, 4, 0)), E = z = 0, l.mode = 4;
            case 4:
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              l.head && (l.head.xflags = 255 & z, l.head.os = z >> 8), 512 & l.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, l.check = n(l.check, M, 2, 0)), E = z = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; E < 16; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                l.length = z, l.head && (l.head.extra_len = z), 512 & l.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, l.check = n(l.check, M, 2, 0)), E = z = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (Y < (L = l.length) && (L = Y), L && (l.head && (r = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, D, $, L, r)), 512 & l.flags && (l.check = n(l.check, D, L, $)), Y -= L, $ += L, l.length -= L), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (Y === 0) break t;
                for (L = 0; r = D[$ + L++], l.head && r && l.length < 65536 && (l.head.name += String.fromCharCode(r)), r && L < Y; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, L, $)), Y -= L, $ += L, r) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (Y === 0) break t;
                for (L = 0; r = D[$ + L++], l.head && r && l.length < 65536 && (l.head.comment += String.fromCharCode(r)), r && L < Y; ) ;
                if (512 & l.flags && (l.check = n(l.check, D, L, $)), Y -= L, $ += L, r) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; E < 16; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                if (z !== (65535 & l.check)) {
                  S.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                E = z = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), S.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              S.adler = l.check = f(z), E = z = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return S.next_out = rt, S.avail_out = P, S.next_in = $, S.avail_in = Y, l.hold = z, l.bits = E, 2;
              S.adler = l.check = 1, l.mode = 12;
            case 12:
              if (F === 5 || F === 6) break t;
            case 13:
              if (l.last) {
                z >>>= 7 & E, E -= 7 & E, l.mode = 27;
                break;
              }
              for (; E < 3; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              switch (l.last = 1 & z, E -= 1, 3 & (z >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (j(l), l.mode = 20, F !== 6) break;
                  z >>>= 2, E -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", l.mode = 30;
              }
              z >>>= 2, E -= 2;
              break;
            case 14:
              for (z >>>= 7 & E, E -= 7 & E; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if ((65535 & z) != (z >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & z, E = z = 0, l.mode = 15, F === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (L = l.length) {
                if (Y < L && (L = Y), P < L && (L = P), L === 0) break t;
                s.arraySet(J, D, $, L, rt), Y -= L, $ += L, P -= L, rt += L, l.length -= L;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; E < 14; ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if (l.nlen = 257 + (31 & z), z >>>= 5, E -= 5, l.ndist = 1 + (31 & z), z >>>= 5, E -= 5, l.ncode = 4 + (15 & z), z >>>= 4, E -= 4, 286 < l.nlen || 30 < l.ndist) {
                S.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; E < 3; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                l.lens[W[l.have++]] = 7 & z, z >>>= 3, E -= 3;
              }
              for (; l.have < 19; ) l.lens[W[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, O = { bits: l.lenbits }, N = v(0, l.lens, 0, 19, l.lencode, 0, l.work, O), l.lenbits = O.bits, N) {
                S.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; it = (_ = l.lencode[z & (1 << l.lenbits) - 1]) >>> 16 & 255, lt = 65535 & _, !((et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                if (lt < 16) z >>>= et, E -= et, l.lens[l.have++] = lt;
                else {
                  if (lt === 16) {
                    for (w = et + 2; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += D[$++] << E, E += 8;
                    }
                    if (z >>>= et, E -= et, l.have === 0) {
                      S.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    r = l.lens[l.have - 1], L = 3 + (3 & z), z >>>= 2, E -= 2;
                  } else if (lt === 17) {
                    for (w = et + 3; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += D[$++] << E, E += 8;
                    }
                    E -= et, r = 0, L = 3 + (7 & (z >>>= et)), z >>>= 3, E -= 3;
                  } else {
                    for (w = et + 7; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += D[$++] << E, E += 8;
                    }
                    E -= et, r = 0, L = 11 + (127 & (z >>>= et)), z >>>= 7, E -= 7;
                  }
                  if (l.have + L > l.nlen + l.ndist) {
                    S.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; L--; ) l.lens[l.have++] = r;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, O = { bits: l.lenbits }, N = v(b, l.lens, 0, l.nlen, l.lencode, 0, l.work, O), l.lenbits = O.bits, N) {
                S.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, O = { bits: l.distbits }, N = v(m, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, O), l.distbits = O.bits, N) {
                S.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, F === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= Y && 258 <= P) {
                S.next_out = rt, S.avail_out = P, S.next_in = $, S.avail_in = Y, l.hold = z, l.bits = E, h(S, G), rt = S.next_out, J = S.output, P = S.avail_out, $ = S.next_in, D = S.input, Y = S.avail_in, z = l.hold, E = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; it = (_ = l.lencode[z & (1 << l.lenbits) - 1]) >>> 16 & 255, lt = 65535 & _, !((et = _ >>> 24) <= E); ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if (it && (240 & it) == 0) {
                for (st = et, nt = it, ut = lt; it = (_ = l.lencode[ut + ((z & (1 << st + nt) - 1) >> st)]) >>> 16 & 255, lt = 65535 & _, !(st + (et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                z >>>= st, E -= st, l.back += st;
              }
              if (z >>>= et, E -= et, l.back += et, l.length = lt, it === 0) {
                l.mode = 26;
                break;
              }
              if (32 & it) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & it) {
                S.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & it, l.mode = 22;
            case 22:
              if (l.extra) {
                for (w = l.extra; E < w; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                l.length += z & (1 << l.extra) - 1, z >>>= l.extra, E -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; it = (_ = l.distcode[z & (1 << l.distbits) - 1]) >>> 16 & 255, lt = 65535 & _, !((et = _ >>> 24) <= E); ) {
                if (Y === 0) break t;
                Y--, z += D[$++] << E, E += 8;
              }
              if ((240 & it) == 0) {
                for (st = et, nt = it, ut = lt; it = (_ = l.distcode[ut + ((z & (1 << st + nt) - 1) >> st)]) >>> 16 & 255, lt = 65535 & _, !(st + (et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                z >>>= st, E -= st, l.back += st;
              }
              if (z >>>= et, E -= et, l.back += et, 64 & it) {
                S.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = lt, l.extra = 15 & it, l.mode = 24;
            case 24:
              if (l.extra) {
                for (w = l.extra; E < w; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                l.offset += z & (1 << l.extra) - 1, z >>>= l.extra, E -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                S.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (P === 0) break t;
              if (L = G - P, l.offset > L) {
                if ((L = l.offset - L) > l.whave && l.sane) {
                  S.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                tt = L > l.wnext ? (L -= l.wnext, l.wsize - L) : l.wnext - L, L > l.length && (L = l.length), at = l.window;
              } else at = J, tt = rt - l.offset, L = l.length;
              for (P < L && (L = P), P -= L, l.length -= L; J[rt++] = at[tt++], --L; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (P === 0) break t;
              J[rt++] = l.length, P--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; E < 32; ) {
                  if (Y === 0) break t;
                  Y--, z |= D[$++] << E, E += 8;
                }
                if (G -= P, S.total_out += G, l.total += G, G && (S.adler = l.check = l.flags ? n(l.check, J, G, rt - G) : i(l.check, J, G, rt - G)), G = P, (l.flags ? z : f(z)) !== l.check) {
                  S.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                E = z = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; E < 32; ) {
                  if (Y === 0) break t;
                  Y--, z += D[$++] << E, E += 8;
                }
                if (z !== (4294967295 & l.total)) {
                  S.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                E = z = 0;
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
              return d;
          }
          return S.next_out = rt, S.avail_out = P, S.next_in = $, S.avail_in = Y, l.hold = z, l.bits = E, (l.wsize || G !== S.avail_out && l.mode < 30 && (l.mode < 27 || F !== 4)) && K(S, S.output, S.next_out, G - S.avail_out) ? (l.mode = 31, -4) : (Z -= S.avail_in, G -= S.avail_out, S.total_in += Z, S.total_out += G, l.total += G, l.wrap && G && (S.adler = l.check = l.flags ? n(l.check, J, G, S.next_out - G) : i(l.check, J, G, S.next_out - G)), S.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (Z == 0 && G === 0 || F === 4) && N === u && (N = -5), N);
        }, c.inflateEnd = function(S) {
          if (!S || !S.state) return d;
          var F = S.state;
          return F.window && (F.window = null), S.state = null, u;
        }, c.inflateGetHeader = function(S, F) {
          var l;
          return S && S.state ? (2 & (l = S.state).wrap) == 0 ? d : ((l.head = F).done = !1, u) : d;
        }, c.inflateSetDictionary = function(S, F) {
          var l, D = F.length;
          return S && S.state ? (l = S.state).wrap !== 0 && l.mode !== 11 ? d : l.mode === 11 && i(1, F, D, 0) !== l.check ? -3 : K(S, F, D, D) ? (l.mode = 31, -4) : (l.havedict = 1, u) : d;
        }, c.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, o, c) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        o.exports = function(b, m, u, d, p, a, g, f) {
          var x, R, k, A, B, I, U, T, j, K = f.bits, S = 0, F = 0, l = 0, D = 0, J = 0, $ = 0, rt = 0, Y = 0, P = 0, z = 0, E = null, Z = 0, G = new s.Buf16(16), L = new s.Buf16(16), tt = null, at = 0;
          for (S = 0; S <= 15; S++) G[S] = 0;
          for (F = 0; F < d; F++) G[m[u + F]]++;
          for (J = K, D = 15; 1 <= D && G[D] === 0; D--) ;
          if (D < J && (J = D), D === 0) return p[a++] = 20971520, p[a++] = 20971520, f.bits = 1, 0;
          for (l = 1; l < D && G[l] === 0; l++) ;
          for (J < l && (J = l), S = Y = 1; S <= 15; S++) if (Y <<= 1, (Y -= G[S]) < 0) return -1;
          if (0 < Y && (b === 0 || D !== 1)) return -1;
          for (L[1] = 0, S = 1; S < 15; S++) L[S + 1] = L[S] + G[S];
          for (F = 0; F < d; F++) m[u + F] !== 0 && (g[L[m[u + F]]++] = F);
          if (I = b === 0 ? (E = tt = g, 19) : b === 1 ? (E = i, Z -= 257, tt = n, at -= 257, 256) : (E = h, tt = v, -1), S = l, B = a, rt = F = z = 0, k = -1, A = (P = 1 << ($ = J)) - 1, b === 1 && 852 < P || b === 2 && 592 < P) return 1;
          for (; ; ) {
            for (U = S - rt, j = g[F] < I ? (T = 0, g[F]) : g[F] > I ? (T = tt[at + g[F]], E[Z + g[F]]) : (T = 96, 0), x = 1 << S - rt, l = R = 1 << $; p[B + (z >> rt) + (R -= x)] = U << 24 | T << 16 | j | 0, R !== 0; ) ;
            for (x = 1 << S - 1; z & x; ) x >>= 1;
            if (x !== 0 ? (z &= x - 1, z += x) : z = 0, F++, --G[S] == 0) {
              if (S === D) break;
              S = m[u + g[F]];
            }
            if (J < S && (z & A) !== k) {
              for (rt === 0 && (rt = J), B += l, Y = 1 << ($ = S - rt); $ + rt < D && !((Y -= G[$ + rt]) <= 0); ) $++, Y <<= 1;
              if (P += 1 << $, b === 1 && 852 < P || b === 2 && 592 < P) return 1;
              p[k = z & A] = J << 24 | $ << 16 | B - a | 0;
            }
          }
          return z !== 0 && (p[B + z] = S - rt << 24 | 64 << 16 | 0), f.bits = J, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, o, c) {
        o.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, o, c) {
        var s = e("../utils/common"), i = 0, n = 1;
        function h(_) {
          for (var M = _.length; 0 <= --M; ) _[M] = 0;
        }
        var v = 0, b = 29, m = 256, u = m + 1 + b, d = 30, p = 19, a = 2 * u + 1, g = 15, f = 16, x = 7, R = 256, k = 16, A = 17, B = 18, I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (u + 2));
        h(K);
        var S = new Array(2 * d);
        h(S);
        var F = new Array(512);
        h(F);
        var l = new Array(256);
        h(l);
        var D = new Array(b);
        h(D);
        var J, $, rt, Y = new Array(d);
        function P(_, M, W, X, C) {
          this.static_tree = _, this.extra_bits = M, this.extra_base = W, this.elems = X, this.max_length = C, this.has_stree = _ && _.length;
        }
        function z(_, M) {
          this.dyn_tree = _, this.max_code = 0, this.stat_desc = M;
        }
        function E(_) {
          return _ < 256 ? F[_] : F[256 + (_ >>> 7)];
        }
        function Z(_, M) {
          _.pending_buf[_.pending++] = 255 & M, _.pending_buf[_.pending++] = M >>> 8 & 255;
        }
        function G(_, M, W) {
          _.bi_valid > f - W ? (_.bi_buf |= M << _.bi_valid & 65535, Z(_, _.bi_buf), _.bi_buf = M >> f - _.bi_valid, _.bi_valid += W - f) : (_.bi_buf |= M << _.bi_valid & 65535, _.bi_valid += W);
        }
        function L(_, M, W) {
          G(_, W[2 * M], W[2 * M + 1]);
        }
        function tt(_, M) {
          for (var W = 0; W |= 1 & _, _ >>>= 1, W <<= 1, 0 < --M; ) ;
          return W >>> 1;
        }
        function at(_, M, W) {
          var X, C, V = new Array(g + 1), H = 0;
          for (X = 1; X <= g; X++) V[X] = H = H + W[X - 1] << 1;
          for (C = 0; C <= M; C++) {
            var q = _[2 * C + 1];
            q !== 0 && (_[2 * C] = tt(V[q]++, q));
          }
        }
        function et(_) {
          var M;
          for (M = 0; M < u; M++) _.dyn_ltree[2 * M] = 0;
          for (M = 0; M < d; M++) _.dyn_dtree[2 * M] = 0;
          for (M = 0; M < p; M++) _.bl_tree[2 * M] = 0;
          _.dyn_ltree[2 * R] = 1, _.opt_len = _.static_len = 0, _.last_lit = _.matches = 0;
        }
        function it(_) {
          8 < _.bi_valid ? Z(_, _.bi_buf) : 0 < _.bi_valid && (_.pending_buf[_.pending++] = _.bi_buf), _.bi_buf = 0, _.bi_valid = 0;
        }
        function lt(_, M, W, X) {
          var C = 2 * M, V = 2 * W;
          return _[C] < _[V] || _[C] === _[V] && X[M] <= X[W];
        }
        function st(_, M, W) {
          for (var X = _.heap[W], C = W << 1; C <= _.heap_len && (C < _.heap_len && lt(M, _.heap[C + 1], _.heap[C], _.depth) && C++, !lt(M, X, _.heap[C], _.depth)); ) _.heap[W] = _.heap[C], W = C, C <<= 1;
          _.heap[W] = X;
        }
        function nt(_, M, W) {
          var X, C, V, H, q = 0;
          if (_.last_lit !== 0) for (; X = _.pending_buf[_.d_buf + 2 * q] << 8 | _.pending_buf[_.d_buf + 2 * q + 1], C = _.pending_buf[_.l_buf + q], q++, X === 0 ? L(_, C, M) : (L(_, (V = l[C]) + m + 1, M), (H = I[V]) !== 0 && G(_, C -= D[V], H), L(_, V = E(--X), W), (H = U[V]) !== 0 && G(_, X -= Y[V], H)), q < _.last_lit; ) ;
          L(_, R, M);
        }
        function ut(_, M) {
          var W, X, C, V = M.dyn_tree, H = M.stat_desc.static_tree, q = M.stat_desc.has_stree, Q = M.stat_desc.elems, ct = -1;
          for (_.heap_len = 0, _.heap_max = a, W = 0; W < Q; W++) V[2 * W] !== 0 ? (_.heap[++_.heap_len] = ct = W, _.depth[W] = 0) : V[2 * W + 1] = 0;
          for (; _.heap_len < 2; ) V[2 * (C = _.heap[++_.heap_len] = ct < 2 ? ++ct : 0)] = 1, _.depth[C] = 0, _.opt_len--, q && (_.static_len -= H[2 * C + 1]);
          for (M.max_code = ct, W = _.heap_len >> 1; 1 <= W; W--) st(_, V, W);
          for (C = Q; W = _.heap[1], _.heap[1] = _.heap[_.heap_len--], st(_, V, 1), X = _.heap[1], _.heap[--_.heap_max] = W, _.heap[--_.heap_max] = X, V[2 * C] = V[2 * W] + V[2 * X], _.depth[C] = (_.depth[W] >= _.depth[X] ? _.depth[W] : _.depth[X]) + 1, V[2 * W + 1] = V[2 * X + 1] = C, _.heap[1] = C++, st(_, V, 1), 2 <= _.heap_len; ) ;
          _.heap[--_.heap_max] = _.heap[1], (function(ot, mt) {
            var At, gt, zt, ht, Tt, Ft, _t = mt.dyn_tree, Wt = mt.max_code, ae = mt.stat_desc.static_tree, oe = mt.stat_desc.has_stree, le = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, Et = mt.stat_desc.max_length, Ot = 0;
            for (ht = 0; ht <= g; ht++) ot.bl_count[ht] = 0;
            for (_t[2 * ot.heap[ot.heap_max] + 1] = 0, At = ot.heap_max + 1; At < a; At++) Et < (ht = _t[2 * _t[2 * (gt = ot.heap[At]) + 1] + 1] + 1) && (ht = Et, Ot++), _t[2 * gt + 1] = ht, Wt < gt || (ot.bl_count[ht]++, Tt = 0, jt <= gt && (Tt = le[gt - jt]), Ft = _t[2 * gt], ot.opt_len += Ft * (ht + Tt), oe && (ot.static_len += Ft * (ae[2 * gt + 1] + Tt)));
            if (Ot !== 0) {
              do {
                for (ht = Et - 1; ot.bl_count[ht] === 0; ) ht--;
                ot.bl_count[ht]--, ot.bl_count[ht + 1] += 2, ot.bl_count[Et]--, Ot -= 2;
              } while (0 < Ot);
              for (ht = Et; ht !== 0; ht--) for (gt = ot.bl_count[ht]; gt !== 0; ) Wt < (zt = ot.heap[--At]) || (_t[2 * zt + 1] !== ht && (ot.opt_len += (ht - _t[2 * zt + 1]) * _t[2 * zt], _t[2 * zt + 1] = ht), gt--);
            }
          })(_, M), at(V, ct, _.bl_count);
        }
        function r(_, M, W) {
          var X, C, V = -1, H = M[1], q = 0, Q = 7, ct = 4;
          for (H === 0 && (Q = 138, ct = 3), M[2 * (W + 1) + 1] = 65535, X = 0; X <= W; X++) C = H, H = M[2 * (X + 1) + 1], ++q < Q && C === H || (q < ct ? _.bl_tree[2 * C] += q : C !== 0 ? (C !== V && _.bl_tree[2 * C]++, _.bl_tree[2 * k]++) : q <= 10 ? _.bl_tree[2 * A]++ : _.bl_tree[2 * B]++, V = C, ct = (q = 0) === H ? (Q = 138, 3) : C === H ? (Q = 6, 3) : (Q = 7, 4));
        }
        function N(_, M, W) {
          var X, C, V = -1, H = M[1], q = 0, Q = 7, ct = 4;
          for (H === 0 && (Q = 138, ct = 3), X = 0; X <= W; X++) if (C = H, H = M[2 * (X + 1) + 1], !(++q < Q && C === H)) {
            if (q < ct) for (; L(_, C, _.bl_tree), --q != 0; ) ;
            else C !== 0 ? (C !== V && (L(_, C, _.bl_tree), q--), L(_, k, _.bl_tree), G(_, q - 3, 2)) : q <= 10 ? (L(_, A, _.bl_tree), G(_, q - 3, 3)) : (L(_, B, _.bl_tree), G(_, q - 11, 7));
            V = C, ct = (q = 0) === H ? (Q = 138, 3) : C === H ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        h(Y);
        var O = !1;
        function w(_, M, W, X) {
          G(_, (v << 1) + (X ? 1 : 0), 3), (function(C, V, H, q) {
            it(C), Z(C, H), Z(C, ~H), s.arraySet(C.pending_buf, C.window, V, H, C.pending), C.pending += H;
          })(_, M, W);
        }
        c._tr_init = function(_) {
          O || ((function() {
            var M, W, X, C, V, H = new Array(g + 1);
            for (C = X = 0; C < b - 1; C++) for (D[C] = X, M = 0; M < 1 << I[C]; M++) l[X++] = C;
            for (l[X - 1] = C, C = V = 0; C < 16; C++) for (Y[C] = V, M = 0; M < 1 << U[C]; M++) F[V++] = C;
            for (V >>= 7; C < d; C++) for (Y[C] = V << 7, M = 0; M < 1 << U[C] - 7; M++) F[256 + V++] = C;
            for (W = 0; W <= g; W++) H[W] = 0;
            for (M = 0; M <= 143; ) K[2 * M + 1] = 8, M++, H[8]++;
            for (; M <= 255; ) K[2 * M + 1] = 9, M++, H[9]++;
            for (; M <= 279; ) K[2 * M + 1] = 7, M++, H[7]++;
            for (; M <= 287; ) K[2 * M + 1] = 8, M++, H[8]++;
            for (at(K, u + 1, H), M = 0; M < d; M++) S[2 * M + 1] = 5, S[2 * M] = tt(M, 5);
            J = new P(K, I, m + 1, u, g), $ = new P(S, U, 0, d, g), rt = new P(new Array(0), T, 0, p, x);
          })(), O = !0), _.l_desc = new z(_.dyn_ltree, J), _.d_desc = new z(_.dyn_dtree, $), _.bl_desc = new z(_.bl_tree, rt), _.bi_buf = 0, _.bi_valid = 0, et(_);
        }, c._tr_stored_block = w, c._tr_flush_block = function(_, M, W, X) {
          var C, V, H = 0;
          0 < _.level ? (_.strm.data_type === 2 && (_.strm.data_type = (function(q) {
            var Q, ct = 4093624447;
            for (Q = 0; Q <= 31; Q++, ct >>>= 1) if (1 & ct && q.dyn_ltree[2 * Q] !== 0) return i;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return n;
            for (Q = 32; Q < m; Q++) if (q.dyn_ltree[2 * Q] !== 0) return n;
            return i;
          })(_)), ut(_, _.l_desc), ut(_, _.d_desc), H = (function(q) {
            var Q;
            for (r(q, q.dyn_ltree, q.l_desc.max_code), r(q, q.dyn_dtree, q.d_desc.max_code), ut(q, q.bl_desc), Q = p - 1; 3 <= Q && q.bl_tree[2 * j[Q] + 1] === 0; Q--) ;
            return q.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          })(_), C = _.opt_len + 3 + 7 >>> 3, (V = _.static_len + 3 + 7 >>> 3) <= C && (C = V)) : C = V = W + 5, W + 4 <= C && M !== -1 ? w(_, M, W, X) : _.strategy === 4 || V === C ? (G(_, 2 + (X ? 1 : 0), 3), nt(_, K, S)) : (G(_, 4 + (X ? 1 : 0), 3), (function(q, Q, ct, ot) {
            var mt;
            for (G(q, Q - 257, 5), G(q, ct - 1, 5), G(q, ot - 4, 4), mt = 0; mt < ot; mt++) G(q, q.bl_tree[2 * j[mt] + 1], 3);
            N(q, q.dyn_ltree, Q - 1), N(q, q.dyn_dtree, ct - 1);
          })(_, _.l_desc.max_code + 1, _.d_desc.max_code + 1, H + 1), nt(_, _.dyn_ltree, _.dyn_dtree)), et(_), X && it(_);
        }, c._tr_tally = function(_, M, W) {
          return _.pending_buf[_.d_buf + 2 * _.last_lit] = M >>> 8 & 255, _.pending_buf[_.d_buf + 2 * _.last_lit + 1] = 255 & M, _.pending_buf[_.l_buf + _.last_lit] = 255 & W, _.last_lit++, M === 0 ? _.dyn_ltree[2 * W]++ : (_.matches++, M--, _.dyn_ltree[2 * (l[W] + m + 1)]++, _.dyn_dtree[2 * E(M)]++), _.last_lit === _.lit_bufsize - 1;
        }, c._tr_align = function(_) {
          G(_, 2, 3), L(_, R, K), (function(M) {
            M.bi_valid === 16 ? (Z(M, M.bi_buf), M.bi_buf = 0, M.bi_valid = 0) : 8 <= M.bi_valid && (M.pending_buf[M.pending++] = 255 & M.bi_buf, M.bi_buf >>= 8, M.bi_valid -= 8);
          })(_);
        };
      }, { "../utils/common": 41 }], 53: [function(e, o, c) {
        o.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, o, c) {
        (function(s) {
          (function(i, n) {
            if (!i.setImmediate) {
              var h, v, b, m, u = 1, d = {}, p = !1, a = i.document, g = Object.getPrototypeOf && Object.getPrototypeOf(i);
              g = g && g.setTimeout ? g : i, h = {}.toString.call(i.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  x(k);
                });
              } : (function() {
                if (i.postMessage && !i.importScripts) {
                  var k = !0, A = i.onmessage;
                  return i.onmessage = function() {
                    k = !1;
                  }, i.postMessage("", "*"), i.onmessage = A, k;
                }
              })() ? (m = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", R, !1) : i.attachEvent("onmessage", R), function(k) {
                i.postMessage(m + k, "*");
              }) : i.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                x(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : a && "onreadystatechange" in a.createElement("script") ? (v = a.documentElement, function(k) {
                var A = a.createElement("script");
                A.onreadystatechange = function() {
                  x(k), A.onreadystatechange = null, v.removeChild(A), A = null;
                }, v.appendChild(A);
              }) : function(k) {
                setTimeout(x, 0, k);
              }, g.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var A = new Array(arguments.length - 1), B = 0; B < A.length; B++) A[B] = arguments[B + 1];
                var I = { callback: k, args: A };
                return d[u] = I, h(u), u++;
              }, g.clearImmediate = f;
            }
            function f(k) {
              delete d[k];
            }
            function x(k) {
              if (p) setTimeout(x, 0, k);
              else {
                var A = d[k];
                if (A) {
                  p = !0;
                  try {
                    (function(B) {
                      var I = B.callback, U = B.args;
                      switch (U.length) {
                        case 0:
                          I();
                          break;
                        case 1:
                          I(U[0]);
                          break;
                        case 2:
                          I(U[0], U[1]);
                          break;
                        case 3:
                          I(U[0], U[1], U[2]);
                          break;
                        default:
                          I.apply(n, U);
                      }
                    })(A);
                  } finally {
                    f(k), p = !1;
                  }
                }
              }
            }
            function R(k) {
              k.source === i && typeof k.data == "string" && k.data.indexOf(m) === 0 && x(+k.data.slice(m.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var he = de();
const Jt = /* @__PURE__ */ ce(he);
async function ue(y) {
  const t = await fe(y), e = await Jt.loadAsync(t), o = [];
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
async function fe(y) {
  if (y instanceof ArrayBuffer)
    return y;
  if (y instanceof Blob)
    return await y.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function me(y) {
  let t = y.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function pe(y) {
  return !!y && typeof y == "object" && !(y instanceof ArrayBuffer) && !(y instanceof Uint8Array);
}
function ye(y) {
  return y instanceof Uint8Array ? y : new Uint8Array(y);
}
function ge(y) {
  return y.byteOffset === 0 && y.byteLength === y.buffer.byteLength ? y.buffer : y.slice().buffer;
}
function kt(y, t, e = 0) {
  if (y.length < e + t.length) return !1;
  for (let o = 0; o < t.length; o++)
    if (y[e + o] !== t[o]) return !1;
  return !0;
}
function _e(y) {
  return kt(y, [80, 75, 3, 4]) || kt(y, [80, 75, 5, 6]) || kt(y, [80, 75, 7, 8]) ? "zip" : kt(y, [82, 97, 114, 33, 26, 7, 0]) || kt(y, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : kt(y, [55, 122, 188, 175, 39, 28]) ? "7z" : y.length > 262 && kt(y, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Qt(y) {
  return y.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Xt(y) {
  const t = [], e = y.map((a) => Qt(a).toLowerCase()), o = (a) => e.some(a), c = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((a) => c.test(a)).length, n = e.filter((a) => s.test(a) || a.includes("drill")).length, h = o((a) => a.includes("top") && a.includes("copper") || a.endsWith(".gtl")), v = o((a) => a.includes("bot") || a.includes("bottom") || a.endsWith(".gbl")), b = o((a) => a.includes("mask") || a.includes("solder") || a.endsWith(".gts") || a.endsWith(".gbs")), m = o((a) => a.includes("silk") || a.includes("legend") || a.endsWith(".gto") || a.endsWith(".gbo")), u = o((a) => a.includes("outline") || a.includes("profile") || a.includes("edge") || a.endsWith(".gko") || a.endsWith(".gm1") || a.endsWith(".gml")), d = e.every(
    (a) => a.endsWith(".pdf") || a.endsWith(".png") || a.endsWith(".jpg") || a.endsWith(".jpeg") || a.endsWith(".svg") || a.endsWith(".txt") || a.endsWith(".md")
  );
  let p = 0;
  return y.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (p += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (p += 0.2, t.push(`Found ${n} drill-like file(s).`)), u && (p += 0.15, t.push("Found outline/profile/edge candidate.")), h && v ? (p += 0.2, t.push("Found both top and bottom copper candidates.")) : (h || v) && (p += 0.1, t.push("Found at least one copper candidate.")), b && (p += 0.05, t.push("Found solder mask candidate.")), m && (p += 0.05, t.push("Found silkscreen/legend candidate.")), p = Math.max(0, Math.min(1, p)), p < 0.6 && i >= 2 && (p = Math.max(p, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: p, reasons: t });
}
async function be(y) {
  if (pe(y)) {
    const s = Object.keys(y).map(Qt), { confidence: i, reasons: n } = Xt(s);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: n,
      files: s
    };
  }
  const t = ye(y), e = _e(t);
  if (e === "zip")
    try {
      const s = ge(t), n = (await ue(s)).map((b) => b.name), { confidence: h, reasons: v } = Xt(n);
      return {
        isGerber: h >= 0.6,
        archiveType: "zip",
        confidence: h,
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
function te(y) {
  let t = y.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ve(y) {
  return y instanceof Uint8Array ? y : new Uint8Array(y);
}
function ee(y) {
  try {
    return y.slice().buffer;
  } catch {
    const t = new Uint8Array(y.byteLength);
    return t.set(y), t.buffer;
  }
}
async function we(y) {
  let t;
  try {
    t = await Jt.loadAsync(ee(y));
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
  for (const [n, h] of s)
    try {
      const v = te(n), b = await h.async("arraybuffer");
      if (i += b.byteLength, i > c)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${c} bytes)`
        );
      e[v] = new Uint8Array(b);
    } catch (v) {
      console.warn(`Failed to extract file ${n}:`, v);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function xe(y, t) {
  let e;
  try {
    const m = await import("./libarchive-Bt1VdZR0.js");
    e = m.Archive ?? m.default?.Archive;
  } catch (m) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      m
    );
  }
  if (!e)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (m) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        m
      );
    }
  let o;
  try {
    const m = new Blob([ee(y)], { type: "application/octet-stream" });
    o = await e.open(m);
  } catch (m) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", m);
  }
  let c;
  try {
    c = await Promise.race([
      o.extractFiles(),
      new Promise(
        (m, u) => setTimeout(() => u(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (m) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", m);
  }
  const s = {};
  let i = 0;
  const n = 1e3, h = 100 * 1024 * 1024;
  let v = 0;
  async function b(m, u) {
    if (i >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const d of Object.keys(m)) {
      const p = m[d], a = u ? `${u}/${d}` : d;
      if (p instanceof File || p instanceof Blob) {
        i++;
        try {
          const g = await p.arrayBuffer();
          if (v += g.byteLength, v > h)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${h} bytes)`
            );
          s[te(a)] = new Uint8Array(g);
        } catch (g) {
          console.warn(`Failed to extract file ${a}:`, g);
        }
      } else p && typeof p == "object" && await b(p, a);
    }
  }
  try {
    await b(c, "");
  } finally {
    if (o && typeof o.close == "function")
      try {
        await o.close();
      } catch (m) {
        console.warn("Failed to close archive:", m);
      }
  }
  if (Object.keys(s).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return s;
}
async function re(y, t) {
  if (!y || y.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = ve(y), o = 100 * 1024 * 1024;
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
      return { archiveType: "rar", files: await xe(e, t) };
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
function Lt(y) {
  return y.toLowerCase();
}
function vt(y, t) {
  const e = new Set(t.map((c) => c.toLowerCase()));
  return y.filter((c) => {
    const s = Lt(c), i = s.lastIndexOf(".");
    return i < 0 ? !1 : e.has(s.slice(i));
  }).sort((c, s) => c.length - s.length)[0];
}
function dt(y, t) {
  const e = t.map((c) => c.toLowerCase());
  return y.filter((c) => {
    const s = Lt(c);
    return e.every((i) => s.includes(i));
  }).sort((c, s) => c.length - s.length)[0];
}
function ke(y) {
  const t = y.filter((b) => {
    const m = Lt(b);
    return !(m.endsWith("/") || m.includes("__macosx") || m.endsWith(".ds_store"));
  }), e = vt(t, [".gtl"]) || dt(t, ["f_cu"]) || dt(t, ["top", "cu"]) || dt(t, ["top", "copper"]), o = vt(t, [".gbl"]) || dt(t, ["b_cu"]) || dt(t, ["bottom", "cu"]) || dt(t, ["bottom", "copper"]), c = vt(t, [".gts"]) || dt(t, ["f_mask"]) || dt(t, ["top", "mask"]), s = vt(t, [".gbs"]) || dt(t, ["b_mask"]) || dt(t, ["bottom", "mask"]), i = vt(t, [".gto"]) || dt(t, ["f_silks"]) || dt(t, ["f_silk"]) || dt(t, ["top", "silk"]), n = vt(t, [".gbo"]) || dt(t, ["b_silks"]) || dt(t, ["b_silk"]) || dt(t, ["bottom", "silk"]), h = vt(t, [".gko", ".gm1"]) || dt(t, ["edge", "cuts"]) || dt(t, ["outline"]) || dt(t, ["board", "outline"]), v = (
    // Excellon often .drl or .xln or .txt
    vt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    dt(t, ["drill"]) || dt(t, ["drills"]) || dt(t, ["npth"]) || dt(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: o,
    top_mask: c,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: n,
    outline: h,
    drills: v
  };
}
const Se = 0.8;
function Mt(y, t, e) {
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
function Re(y, t) {
  let e = y;
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
    let n, h, v;
    if (i) {
      const m = i.split(/[Xx]/), u = m[0] ? parseFloat(m[0]) * t.unitScale : void 0, d = m[1] ? parseFloat(m[1]) * t.unitScale : void 0;
      s === "C" ? n = u : s === "R" || s === "O" ? (h = u, v = d, u !== void 0 && d !== void 0 ? n = Math.min(u, d) : n = u ?? d) : n = u ?? d;
    }
    const b = {
      code: c,
      shape: s,
      diameterMm: n,
      widthMm: h,
      heightMm: v
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
function Ae(y, t) {
  if (y === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (y === "G37") {
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
  const o = /D0?(\d{1,3})$/.exec(y);
  if (o && (e = parseInt(o[1], 10), y = y.slice(0, y.length - o[0].length)), e !== null && e >= 10) {
    const b = t.apertures.get(e);
    b && (t.currentAperture = b);
    return;
  }
  const c = /X([+\-]?\d+)/.exec(y), s = /Y([+\-]?\d+)/.exec(y);
  let i = t.x, n = t.y;
  if (c && (i = Yt(c[1], t)), s && (n = Yt(s[1], t)), e === null) {
    t.x = i, t.y = n;
    return;
  }
  if (t.inRegion) {
    const b = t.x, m = t.y;
    e === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: b, y: m }), t.currentPath.push({ x: i, y: n })) : e === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = i, t.y = n;
    return;
  }
  const h = t.x, v = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = i, t.y = n;
      return;
    }
    const b = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: h, y: v },
      end: { x: i, y: n },
      width: b,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: h, y: v },
      end: { x: i, y: n },
      widthMm: b
    }), t.x = i, t.y = n;
    return;
  }
  if (e === 2) {
    t.x = i, t.y = n;
    return;
  }
  if (e === 3) {
    if (t.currentAperture) {
      const b = t.currentAperture, m = b.diameterMm !== void 0 ? b.diameterMm : Se, u = {
        position: { x: i, y: n },
        diameterMm: m,
        shape: b.shape,
        polarity: t.currentPolarity
      };
      b.widthMm !== void 0 && (u.widthMm = b.widthMm), b.heightMm !== void 0 && (u.heightMm = b.heightMm), t.flashes.push(u), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: i, y: n },
        diameterMm: m,
        shape: b.shape,
        widthMm: b.widthMm,
        heightMm: b.heightMm
      });
    }
    t.x = i, t.y = n;
    return;
  }
}
function Yt(y, t) {
  const e = y.startsWith("-") ? -1 : 1, o = y.replace(/[+\-]/g, ""), c = parseInt(o, 10);
  if (Number.isNaN(c)) return 0;
  const s = Math.pow(10, t.fmtDec), i = c / s * t.unitScale;
  return e * i;
}
function ze(y, t) {
  const e = t.split(/\r?\n/), o = /* @__PURE__ */ new Map();
  let c = null;
  const s = [];
  for (const i of e) {
    const n = i.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const h = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (h) {
          const v = h[1], b = parseFloat(h[2]);
          Number.isNaN(b) || o.set(v, b);
        }
        continue;
      }
      if (n.startsWith("T") && !n.includes("C")) {
        const h = /^T(\d+)/i.exec(n);
        h && (c = h[1]);
        continue;
      }
      if (n[0] === "X" || n.includes("X")) {
        const h = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(n);
        if (!h)
          continue;
        const v = h[1], b = h[2], m = parseFloat(v), u = parseFloat(b);
        if (Number.isNaN(m) || Number.isNaN(u))
          continue;
        const d = c && o.has(c) ? o.get(c) : 0.6;
        s.push({
          x: m,
          y: u,
          diameter: d,
          plated: !0
          // default, later you can infer from file or layer
        });
        continue;
      }
    }
  }
  return {
    name: y,
    holes: s
  };
}
function Ee(y) {
  return { w: y.maxX - y.minX, h: y.maxY - y.minY };
}
function Ct(y) {
  const { w: t, h: e } = Ee(y);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function St(y, t) {
  if (!Number.isFinite(y) || !Number.isFinite(t) || y <= 0 || t <= 0) return 1;
  const e = y / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function It(y, t) {
  return t === 1 ? y : {
    ...y,
    tracks: y.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: y.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: y.regions.map((e) => ({
      ...e,
      loops: e.loops.map((o) => o.map((c) => ({ x: c.x * t, y: c.y * t })))
    }))
  };
}
function Me(y, t) {
  return t === 1 ? y : y.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Ce(y) {
  return URL.createObjectURL(new Blob([y], { type: "image/svg+xml" }));
}
function pt(y, t, e) {
  y.minX = Math.min(y.minX, t), y.minY = Math.min(y.minY, e), y.maxX = Math.max(y.maxX, t), y.maxY = Math.max(y.maxY, e);
}
function Ut() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function wt(y) {
  const t = Ut();
  for (const e of y.tracks) {
    pt(t, e.start.x, e.start.y), pt(t, e.end.x, e.end.y);
    const o = (e.width ?? 0) / 2;
    pt(t, e.start.x - o, e.start.y - o), pt(t, e.start.x + o, e.start.y + o), pt(t, e.end.x - o, e.end.y - o), pt(t, e.end.x + o, e.end.y + o);
  }
  for (const e of y.flashes) {
    const o = (e.widthMm ?? e.diameterMm) || 0, c = (e.heightMm ?? e.diameterMm) || 0;
    pt(t, e.position.x - o / 2, e.position.y - c / 2), pt(t, e.position.x + o / 2, e.position.y + c / 2);
  }
  for (const e of y.regions)
    for (const o of e.loops) for (const c of o) pt(t, c.x, c.y);
  return t;
}
function Ie(y) {
  const t = Ut();
  for (const e of y) {
    const o = (e.diameter || 0) / 2;
    pt(t, e.x - o, e.y - o), pt(t, e.x + o, e.y + o);
  }
  return t;
}
function Zt(y, t) {
  return {
    minX: Math.min(y.minX, t.minX),
    minY: Math.min(y.minY, t.minY),
    maxX: Math.max(y.maxX, t.maxX),
    maxY: Math.max(y.maxY, t.maxY)
  };
}
function bt(y) {
  return !Number.isFinite(y.minX) || !Number.isFinite(y.minY) || !Number.isFinite(y.maxX) || !Number.isFinite(y.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (y.maxX - y.minX < 1e-6 && (y.maxX = y.minX + 1), y.maxY - y.minY < 1e-6 && (y.maxY = y.minY + 1), y);
}
const Te = 1e3;
function yt(y) {
  return y / 25.4 * Te;
}
function Rt(y, t, e) {
  const o = y - e.minX, c = e.maxY - t;
  return { x: o, y: c };
}
function Gt(y, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${y}" height="${t}" viewBox="0 0 ${y} ${t}">
  <rect width="${y}" height="${t}" fill="white"/>
</svg>`.trim();
}
function ie(y) {
  let t = 1 / 0, e = 1 / 0, o = -1 / 0, c = -1 / 0;
  for (const s of y.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), o = Math.max(o, i.x), c = Math.max(c, i.y);
  return { minX: t, minY: e, maxX: o, maxY: c };
}
function Oe(y, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let o = 0, c = 0;
  for (const b of y.regions) {
    const m = ie(b), u = (m.maxX - m.minX) * (m.maxY - m.minY);
    b.polarity === "clear" ? c = Math.max(c, u) : o = Math.max(o, u);
  }
  const s = y.tracks.filter((b) => b.polarity !== "clear").length + y.flashes.filter((b) => b.polarity !== "clear").length + y.regions.filter((b) => b.polarity !== "clear").length, i = y.tracks.filter((b) => b.polarity === "clear").length + y.flashes.filter((b) => b.polarity === "clear").length + y.regions.filter((b) => b.polarity === "clear").length, n = o > e * 0.7, h = i > s * 3, v = c > e * 0.7;
  return n ? !1 : h || v;
}
function Vt(y, t, e, o) {
  const c = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(yt(c))), n = Math.max(1, Math.round(yt(s))), h = yt(1), v = Oe(y, t), b = v ? "white" : "black", m = (k, A) => {
    const B = k - t.minX, I = t.maxY - A;
    return { x: B * h, y: I * h };
  }, u = (k, A) => {
    if (k.kind === "track") {
      const B = m(k.start.x, k.start.y), I = m(k.end.x, k.end.y), U = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, T = Math.max(1, U * h);
      return `<line x1="${B.x.toFixed(2)}" y1="${B.y.toFixed(2)}" x2="${I.x.toFixed(2)}" y2="${I.y.toFixed(2)}" stroke-width="${T.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const B = m(k.position.x, k.position.y), I = k.widthMm ?? k.diameterMm ?? 0.8, U = k.heightMm ?? k.diameterMm ?? 0.8, T = Math.max(0.01, Number.isFinite(I) ? I : 0.8) * h, j = Math.max(0.01, Number.isFinite(U) ? U : 0.8) * h;
      if (k.shape === "R" || k.shape === "O") {
        const K = B.x - T / 2, S = B.y - j / 2, F = k.shape === "O" ? Math.min(T, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${S.toFixed(2)}" width="${T.toFixed(2)}" height="${j.toFixed(2)}" rx="${F.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const K = Math.max(1, Math.max(T, j) / 2);
        return `<circle cx="${B.x.toFixed(2)}" cy="${B.y.toFixed(2)}" r="${K.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (k.kind === "region") {
      const B = k.loops.map((I) => {
        if (!I.length) return "";
        const U = m(I[0].x, I[0].y), T = [`M ${U.x.toFixed(2)} ${U.y.toFixed(2)}`];
        for (let j = 1; j < I.length; j++) {
          const K = m(I[j].x, I[j].y);
          T.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return T.push("Z"), T.join(" ");
      }).join(" ");
      return B.trim() ? `<path d="${B}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  d.push(`<rect x="0" y="0" width="${i}" height="${n}" fill="${b}" fill-opacity="1" />`);
  for (const k of y.ops) {
    const A = k.polarity === "clear" ? "black" : "white", B = u(k, A);
    B && d.push(B);
  }
  console.log("[polarity counts]", {
    tracksClear: y.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: y.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: v
  });
  const p = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, g = 0;
  for (const k of y.regions) {
    const A = ie(k), B = (A.maxX - A.minX) * (A.maxY - A.minY);
    k.polarity === "clear" ? g = Math.max(g, B) : a = Math.max(a, B);
  }
  const f = y.tracks.filter((k) => k.polarity !== "clear").length + y.flashes.filter((k) => k.polarity !== "clear").length + y.regions.filter((k) => k.polarity !== "clear").length, x = y.tracks.filter((k) => k.polarity === "clear").length + y.flashes.filter((k) => k.polarity === "clear").length + y.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: x,
    largestDarkRegionArea: a,
    largestClearRegionArea: g,
    boardArea: p,
    negative: v
  });
  const R = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  <defs>
    <mask id="${R}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${n}" fill="${b}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${n}" fill="${e}" opacity="${o}" mask="url(#${R})" />
</svg>`.trim();
}
function qt(y, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.max(1, Math.round(yt(e))), s = Math.max(1, Math.round(yt(o))), i = Math.max(1e-6, yt(1)), n = "rgba(255,255,255,0.95)", h = "rgba(255,255,255,0.95)", v = y.tracks.map((u) => {
    const d = Rt(u.start.x, u.start.y, t), p = Rt(u.end.x, u.end.y, t), a = Number.isFinite(u.width) ? u.width : 0.15, g = Math.max(1, a * i);
    return `<line x1="${(d.x * i).toFixed(2)}" y1="${(d.y * i).toFixed(2)}" x2="${(p.x * i).toFixed(2)}" y2="${(p.y * i).toFixed(2)}" stroke="${n}" stroke-width="${g.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = y.flashes.map((u) => {
    const d = Rt(u.position.x, u.position.y, t), p = d.x * i, a = d.y * i, g = u.widthMm ?? u.diameterMm ?? 0.6, f = u.heightMm ?? u.diameterMm ?? 0.6;
    if (u.shape === "R" || u.shape === "O") {
      const R = g * i, k = f * i, A = p - R / 2, B = a - k / 2, I = u.shape === "O" ? Math.min(R, k) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${B.toFixed(2)}" width="${R.toFixed(2)}" height="${k.toFixed(2)}" rx="${I.toFixed(2)}" fill="${h}" />`;
    }
    const x = (u.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${p.toFixed(2)}" cy="${a.toFixed(2)}" r="${Math.max(1, x).toFixed(2)}" fill="${h}" />`;
  }), m = y.regions.map((u) => {
    const d = u.loops.map((p) => {
      if (!p.length) return "";
      const a = Rt(p[0].x, p[0].y, t), g = [`M ${(a.x * i).toFixed(2)} ${(a.y * i).toFixed(2)}`];
      for (let f = 1; f < p.length; f++) {
        const x = Rt(p[f].x, p[f].y, t);
        g.push(`L ${(x.x * i).toFixed(2)} ${(x.y * i).toFixed(2)}`);
      }
      return g.push("Z"), g.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${h}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${s}" viewBox="0 0 ${c} ${s}">
  ${v.join(`
  `)}
  ${b.join(`
  `)}
  ${m.join(`
  `)}
</svg>`.trim();
}
function Be(y, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, c = Math.round(yt(e)), s = Math.round(yt(o)), i = yt(1), n = y.map((h) => {
    const v = Rt(h.x, h.y, t), b = v.x * i, m = v.y * i, u = (h.diameter || 0.6) * i / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${m.toFixed(2)}" r="${Math.max(1, u).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${s}" viewBox="0 0 ${c} ${s}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ne(y) {
  const t = Object.keys(y).filter((nt) => !!nt), e = ke(t), o = new TextDecoder("utf-8", { fatal: !1 }), c = async (nt) => {
    if (!nt) return null;
    const ut = y[nt];
    return ut ? o.decode(ut) : null;
  }, s = await c(e.top_copper), i = await c(e.bottom_copper), n = await c(e.outline), h = await c(e.drills), v = await c(e.top_silk), b = await c(e.bottom_silk), m = s ? Mt(e.top_copper || "top", s) : null, u = i ? Mt(e.bottom_copper || "bot", i) : null, d = n ? Mt(e.outline || "outline", n) : null, p = h ? ze(e.drills || "drills", h) : null, a = p ? p.holes.map((nt) => ({ x: nt.x, y: nt.y, diameter: nt.diameter })) : [], g = v ? Mt(e.top_silk || "top_silk", v) : null, f = b ? Mt(e.bottom_silk || "bot_silk", b) : null, x = m ? bt(wt(m)) : null, R = u ? bt(wt(u)) : null, k = d ? bt(wt(d)) : null, A = a.length ? bt(Ie(a)) : null, B = g ? bt(wt(g)) : null, I = f ? bt(wt(f)) : null, U = (k && Ct(k) ? k : null) || (x && Ct(x) ? x : null) || (R && Ct(R) ? R : null) || (A && Ct(A) ? A : null), T = U ? U.maxX - U.minX : 1, j = x ? St(x.maxX - x.minX, T) : 1, K = R ? St(R.maxX - R.minX, T) : 1, S = k ? St(k.maxX - k.minX, T) : 1, F = A ? St(A.maxX - A.minX, T) : 1, l = B ? St(B.maxX - B.minX, T) : 1, D = I ? St(I.maxX - I.minX, T) : 1, J = m ? It(m, j) : null, $ = u ? It(u, K) : null, rt = d ? It(d, S) : null, Y = a.length ? Me(a, F) : [], P = g ? It(g, l) : null, z = f ? It(f, D) : null;
  let E = null;
  if (rt) {
    const nt = bt(wt(rt));
    Ct(nt) && (E = nt);
  }
  if (!E) {
    let nt = Ut();
    J && (nt = Zt(nt, wt(J))), $ && (nt = Zt(nt, wt($))), nt = bt(nt), E = nt;
  }
  const Z = bt(E), G = Z.maxX - Z.minX, L = Z.maxY - Z.minY, tt = {
    board: {
      width_in: G / 25.4,
      height_in: L / 25.4,
      mm_bounds: {
        min_x_mm: Z.minX,
        min_y_mm: Z.minY,
        max_x_mm: Z.maxX,
        max_y_mm: Z.maxY
      }
    }
  }, at = Math.max(1, Math.round(yt(G))), et = Math.max(1, Math.round(yt(L))), it = [], lt = (nt) => {
    const ut = Ce(nt);
    return it.push(ut), ut;
  }, st = {
    top_board_mask: lt(Gt(at, et)),
    bottom_board_mask: lt(Gt(at, et))
  };
  return J && (st.top_copper = lt(Vt(J, Z, "#fbbf24", 1))), $ && (st.bottom_copper = lt(Vt($, Z, "#38bdf8", 1))), Y.length && (st.drills = lt(Be(Y, Z))), P && (st.top_silk = lt(qt(P, Z))), z && (st.bottom_silk = lt(qt(z, Z))), {
    boardGeom: tt,
    layers: st,
    revoke: () => it.forEach((nt) => URL.revokeObjectURL(nt))
  };
}
async function tr(y) {
  const t = y instanceof Uint8Array ? y.byteOffset === 0 && y.byteLength === y.buffer.byteLength ? y.buffer : y.slice().buffer : y instanceof ArrayBuffer ? y : await y.arrayBuffer(), { files: e, archiveType: o } = await re(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (o !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${o}`);
  return await ne(e);
}
async function er(y, t) {
  const { files: e } = await re(y, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ne(e);
}
function Dt(y, t) {
  const [
    e,
    o,
    c,
    s,
    i,
    n,
    h,
    v,
    b
  ] = y, [
    m,
    u,
    d,
    p,
    a,
    g,
    f,
    x,
    R
  ] = t;
  return [
    e * m + o * p + c * f,
    e * u + o * a + c * x,
    e * d + o * g + c * R,
    s * m + i * p + n * f,
    s * u + i * a + n * x,
    s * d + i * g + n * R,
    h * m + v * p + b * f,
    h * u + v * a + b * x,
    h * d + v * g + b * R
  ];
}
function Ht(y, t) {
  return [1, 0, y, 0, 1, t, 0, 0, 1];
}
function Pe(y, t) {
  return [y, 0, 0, 0, t, 0, 0, 0, 1];
}
function Fe(y) {
  const t = Math.cos(y), e = Math.sin(y);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function Kt(y, t) {
  const e = y[0] * t.x + y[1] * t.y + y[2], o = y[3] * t.x + y[4] * t.y + y[5], c = y[6] * t.x + y[7] * t.y + y[8];
  if (c === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / c, y: o / c };
}
function Ne(y) {
  const t = y[0], e = y[1], o = y[2], c = y[3], s = y[4], i = y[5], n = t * s - e * c;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const h = 1 / n, v = s * h, b = -e * h, m = -c * h, u = t * h, d = -(v * o + b * i), p = -(m * o + u * i);
  return [v, b, d, m, u, p, 0, 0, 1];
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
    const { width_px: t, height_px: e } = this.viewport, { center_mm: o, zoom: c, rotation_rad: s, mirrorX: i, mirrorY: n } = this.camera, h = { x: t / 2, y: e / 2 }, v = n ? -1 : 1, b = i ? -1 : 1, m = Ht(-o.x, -o.y), u = Fe(s), d = Pe(c * b, c * v), p = Ht(h.x, h.y), a = Dt(p, Dt(d, Dt(u, m)));
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
    for (let h = -i; h <= i; h++)
      for (let v = -i; v <= i; v++) {
        const b = `${c + h},${s + v}`, m = this.cells.get(b);
        if (m)
          for (const u of m) n.push(u);
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
class $e {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, o, c = 10) {
    const s = t.screenToBoard({ x: e, y: o }), i = t.xform.getCamera().zoom, n = c / i, h = this.store.queryNear(s.x, s.y, n);
    let v = null;
    for (const b of h) {
      const m = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), u = m.x - e, d = m.y - o, p = Math.sqrt(u * u + d * d);
      p <= c && (!v || p < v.distance_px) && (v = { id: b.id, marker: b, distance_px: p });
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
    this.passes = [], this.overlays = new Ue(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new je(), this.markerPicker = new $e(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Xe(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const o = t.getContext("2d");
    if (!o) throw new Error("Unable to get 2D context");
    this.ctx = o;
    const c = t.getBoundingClientRect(), s = {
      width_px: c.width,
      height_px: c.height
    };
    this.xform = new De(e, s), this.visibility = new se(), this.scheduler = new Le(() => this.render()), this.overlayApi = {
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
      boardBounds: this.boardBounds,
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
const xt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function ir(y, t, e, o) {
  return {
    id: `gerber:${y}`,
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
function Ge(y, t) {
  return {
    id: "overlay:all",
    order: (xt.OVERLAYS_MIN + xt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const c = y.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
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
        if (!s.position || typeof s.position.x != "number" || typeof s.position.y != "number" || !isFinite(s.position.x) || !isFinite(s.position.y)) {
          console.warn(`Invalid marker position for ${s.id}:`, {
            position: s.position,
            marker: s,
            keys: Object.keys(s)
          });
          continue;
        }
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
function qe(y) {
  return {
    id: "markers",
    order: (xt.MARKERS_MIN + xt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => y.draw(t)
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
function Ke(y, t) {
  return {
    id: "selection",
    order: (xt.SELECTION_MIN + xt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const o = t();
      o && y.draw(e, o);
    }
  };
}
function sr(y, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, o = t.showDownloadButton !== !1;
  y.innerHTML = `
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

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>${o ? `
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
  const c = y.firstElementChild, s = J(c, "#board-viewport"), i = J(c, "#render-canvas"), n = J(c, "#grid-toggle"), h = J(c, "#grid-units"), v = J(c, "#fit-btn"), b = o ? J(c, "#download-btn") : null, m = Array.from(c.querySelectorAll('input[name="side"]')), u = new Ye(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), d = new se();
  d.subscribe(() => {
    u.requestRender("visibility-change");
  });
  const p = new Ze(), a = new Ve(), g = new He();
  let f = null;
  function x() {
    const P = s.getBoundingClientRect(), z = window.devicePixelRatio || 1;
    i.width = P.width * z, i.height = P.height * z, i.style.width = `${P.width}px`, i.style.height = `${P.height}px`, u.requestRender("resize");
  }
  const R = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (P, z) => {
      const Z = z.view.zoom, G = h.value, L = G === "mm" ? 1 : 2.54, tt = G === "mm" ? 10 : 25.4, at = L * Z, et = tt * Z;
      if (at < 2) return;
      const it = i.width / (window.devicePixelRatio || 1), lt = i.height / (window.devicePixelRatio || 1), st = z.screenToBoard({ x: 0, y: 0 }), nt = z.screenToBoard({ x: it, y: lt });
      P.setTransform(1, 0, 0, 1, 0, 0), P.strokeStyle = "rgba(59, 130, 246, 0.4)", P.lineWidth = 1, P.beginPath();
      const ut = Math.floor(st.x / L) * L, r = Math.floor(st.y / L) * L;
      for (let N = ut; N <= nt.x; N += L) {
        const O = z.boardToScreen({ x: N, y: 0 }).x;
        P.moveTo(O, 0), P.lineTo(O, i.height);
      }
      for (let N = r; N <= nt.y; N += L) {
        const O = z.boardToScreen({ x: 0, y: N }).y;
        P.moveTo(0, O), P.lineTo(i.width, O);
      }
      if (P.stroke(), et >= 8) {
        P.strokeStyle = "rgba(59, 130, 246, 0.7)", P.lineWidth = 1.5, P.beginPath();
        const N = Math.floor(st.x / tt) * tt, O = Math.floor(st.y / tt) * tt;
        for (let w = N; w <= nt.x; w += tt) {
          const _ = z.boardToScreen({ x: w, y: 0 }).x;
          P.moveTo(_, 0), P.lineTo(_, i.height);
        }
        for (let w = O; w <= nt.y; w += tt) {
          const _ = z.boardToScreen({ x: 0, y: w }).y;
          P.moveTo(0, _), P.lineTo(i.width, _);
        }
        P.stroke();
      }
    }
  };
  p.add(R), d.setOverlayVisibility("grid", !1), d.setMarkersVisibility(!1), u.addPass(Ge(p, u.getOverlayApi())), u.addPass(qe(a)), u.addPass(Ke(g, () => f));
  let k = null, A = {}, B = "top", I = !1;
  function U(P, z, E) {
    if (!E) return null;
    const Z = new Image();
    return Z.src = E, Z.addEventListener("load", () => {
      u.requestRender(`image-loaded-${P}`);
    }), {
      id: P,
      order: z,
      enabled: (G) => !!k?.board?.mm_bounds,
      draw: (G) => {
        if (!Z.complete || !k?.board?.mm_bounds) return;
        const L = G.ctx, tt = G.xform.getWorldToScreenMatrix();
        L.setTransform(tt[0], tt[3], tt[1], tt[4], tt[2], tt[5]);
        const at = k.board.mm_bounds, et = at.max_x_mm - at.min_x_mm, it = at.max_y_mm - at.min_y_mm;
        L.drawImage(Z, at.min_x_mm, at.min_y_mm, et, it);
      }
    };
  }
  function T(P, z) {
    return {
      id: P,
      order: z,
      enabled: (E) => !!k?.board?.mm_bounds,
      draw: (E) => {
        if (!k?.board?.mm_bounds) return;
        const Z = E.ctx, G = E.xform.getWorldToScreenMatrix();
        Z.setTransform(G[0], G[3], G[1], G[4], G[2], G[5]);
        const L = k.board.mm_bounds, tt = L.max_x_mm - L.min_x_mm, at = L.max_y_mm - L.min_y_mm;
        Z.fillStyle = "#1a5f1a", Z.fillRect(L.min_x_mm, L.min_y_mm, tt, at), Z.strokeStyle = "#0d3d0d", Z.lineWidth = 0.1, Z.strokeRect(L.min_x_mm, L.min_y_mm, tt, at);
      }
    };
  }
  function j() {
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
    ].forEach((E) => {
      u.removePass(E);
    }), !k) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: B === "bottom" ? A.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: B === "bottom" ? A.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: B === "bottom" ? A.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: B === "top" ? A.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: B === "top" ? A.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: B === "top" ? A.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: A.drills },
      { id: "layer:vias", order: 45, url: A.vias }
    ].forEach((E) => {
      let Z;
      E.useFR4 ? Z = T(E.id, E.order) : E.url && (Z = U(E.id, E.order, E.url)), Z && u.addPass(Z);
    }), u.requestRender("side-switch"), setTimeout(() => u.requestRender("side-switch-delayed"), 50);
  }
  function K(P = 0.08) {
    if (!k?.board?.mm_bounds) return;
    const z = s.getBoundingClientRect(), E = k.board.mm_bounds, Z = E.max_x_mm - E.min_x_mm, G = E.max_y_mm - E.min_y_mm, L = z.width * (1 - 2 * P), tt = z.height * (1 - 2 * P), at = L / Z, et = tt / G, it = Math.min(at, et), lt = (E.min_x_mm + E.max_x_mm) / 2, st = (E.min_y_mm + E.max_y_mm) / 2;
    u.setCamera({
      center_mm: { x: lt, y: st },
      zoom: it
    });
  }
  i.addEventListener("wheel", (P) => {
    P.preventDefault(), I = !0;
    const z = i.getBoundingClientRect(), E = P.clientX - z.left, Z = P.clientY - z.top, G = u.getCamera(), L = P.deltaY < 0 ? 1.1 : 0.9, tt = Math.max(0.2, Math.min(50, G.zoom * L)), at = u.screenToBoard(E, Z);
    u.setCamera({ zoom: tt });
    const et = u.screenToBoard(E, Z), it = at.x - et.x, lt = at.y - et.y, st = {
      x: G.center_mm.x + it,
      y: G.center_mm.y + lt
    };
    u.setCamera({
      center_mm: st,
      zoom: tt
    });
  }, { passive: !1 });
  let S = !1, F = null;
  i.addEventListener("mousedown", (P) => {
    if (P.button !== 0) return;
    P.preventDefault(), I = !0, S = !0;
    const z = i.getBoundingClientRect();
    F = u.screenToBoard(
      P.clientX - z.left,
      P.clientY - z.top
    );
  });
  const l = (P) => {
    if (!S || !F) return;
    const z = i.getBoundingClientRect(), E = u.screenToBoard(
      P.clientX - z.left,
      P.clientY - z.top
    ), Z = F.x - E.x, G = F.y - E.y, L = u.getCamera();
    u.setCamera({
      center_mm: {
        x: L.center_mm.x + Z,
        y: L.center_mm.y + G
      }
    });
  }, D = () => {
    S = !1, F = null;
  };
  window.addEventListener("mousemove", l), window.addEventListener("mouseup", D), n.addEventListener("change", () => {
    const P = n.checked;
    d.setOverlayVisibility("grid", P), R.visible = P, u.requestRender("grid-toggle");
  }), h.addEventListener("change", () => {
    d.isOverlayVisible("grid") && u.requestRender("grid-units");
  }), v.addEventListener("click", () => K(0.08)), b?.addEventListener("click", () => t.onDownload?.()), m.forEach((P) => {
    P.addEventListener("change", () => {
      B = m.find((z) => z.checked)?.value || "top", j();
    });
  }), window.addEventListener("resize", () => {
    x(), I || K(0.08);
  });
  function J(P, z) {
    const E = P.querySelector(z);
    if (!E) throw new Error(`Missing required element: ${z}`);
    return E;
  }
  function $(P) {
    k = P.boardGeom, A = P.layers, k?.board?.mm_bounds && u.setBoardBounds({
      minX_mm: k.board.mm_bounds.min_x_mm,
      minY_mm: k.board.mm_bounds.min_y_mm,
      maxX_mm: k.board.mm_bounds.max_x_mm,
      maxY_mm: k.board.mm_bounds.max_y_mm
    }), j(), x(), K(0.08);
  }
  function rt(P) {
    B = P;
    const z = m.find((E) => E.value === P);
    z && (z.checked = !0), j();
  }
  function Y() {
    window.removeEventListener("mousemove", l), window.removeEventListener("mouseup", D), y.innerHTML = "";
  }
  return x(), {
    setData: $,
    setSideMode: rt,
    fit: () => K(0.08),
    dispose: Y,
    // Expose new render pipeline API
    viewer: u,
    visibility: d,
    overlayRegistry: p,
    markerRenderer: a,
    setSelection: (P) => {
      f = P, u.requestRender("selection-change");
    },
    addMarker: (P) => {
      if (typeof P.x_mm != "number" || typeof P.y_mm != "number" || !isFinite(P.x_mm) || !isFinite(P.y_mm)) {
        console.warn(`Invalid marker coordinates for ${P.id}:`, {
          x_mm: P.x_mm,
          y_mm: P.y_mm,
          marker: P,
          keys: Object.keys(P)
        });
        return;
      }
      const z = {
        id: P.id,
        position: { x: P.x_mm, y: P.y_mm },
        type: "custom",
        // Default type for DFM markers
        data: {
          ...P.data,
          severity: P.severity,
          layer: P.layer,
          radius_mm: P.radius_mm
        }
      };
      a.add(z), u.requestRender("marker-added");
    },
    addMarkers: (P) => {
      for (const z of P) {
        if (typeof z.x_mm != "number" || typeof z.y_mm != "number" || !isFinite(z.x_mm) || !isFinite(z.y_mm)) {
          console.warn(`Invalid marker coordinates for ${z.id}:`, {
            x_mm: z.x_mm,
            y_mm: z.y_mm,
            marker: z,
            keys: Object.keys(z)
          });
          continue;
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
        a.add(E);
      }
      u.requestRender("markers-added");
    },
    removeMarker: (P) => {
      a.remove(P), u.requestRender("marker-removed");
    }
  };
}
function ar(y, t) {
  return {
    id: "overlay:all",
    order: xt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const o = e.xform.getWorldToScreenMatrix(), c = y.getSortedVisible();
      for (const s of c)
        e.ctx.save(), s.drawInWorldSpace ? e.ctx.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), s.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function or() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (y, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      y.fillStyle = "red";
      for (const o of e)
        y.beginPath(), y.arc(o.x_mm, o.y_mm, 0.25, 0, Math.PI * 2), y.fill();
    }
  };
}
function lr(y) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const o = y();
      o && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(o.x_px + 12, o.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(o.text, o.x_px + 15, o.y_px - 5));
    }
  };
}
function cr(y = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const o = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let c = o.minX_mm; c <= o.maxX_mm; c += y)
        t.moveTo(c, o.minY_mm), t.lineTo(c, o.maxY_mm);
      for (let c = o.minY_mm; c <= o.maxY_mm; c += y)
        t.moveTo(o.minX_mm, c), t.lineTo(o.maxX_mm, c);
      t.stroke();
    }
  };
}
function dr(y) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, o) => {
      t += 16;
      const c = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + c * 0.7})`, e.beginPath(), e.arc(y.x_mm, y.y_mm, 0.5 + c * 0.5, 0, Math.PI * 2), e.fill(), o.requestRender("overlay:animate");
    }
  };
}
function Je(y, t) {
  const e = t.maxX_mm - t.minX_mm, o = t.maxY_mm - t.minY_mm;
  return y.x_mm < 0 || y.x_mm > e || y.y_mm < 0 || y.y_mm > o;
}
class Qe {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const o = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: c, height_px: s } = t.viewport, i = 4;
    for (const n of o) {
      if (typeof n.x_mm != "number" || typeof n.y_mm != "number" || !isFinite(n.x_mm) || !isFinite(n.y_mm)) {
        console.warn(`Invalid marker coordinates for ${n.id}:`, {
          x_mm: n.x_mm,
          y_mm: n.y_mm,
          marker: n,
          keys: Object.keys(n)
        });
        continue;
      }
      const h = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), v = h.x, b = h.y;
      if (v < -10 || b < -10 || v > c + 10 || b > s + 10) continue;
      const m = e?.boardBounds ? Je({ x_mm: n.x_mm, y_mm: n.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id, m), t.ctx.beginPath(), t.ctx.arc(v, b, i, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, o, c, s) {
    if (o)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (c)
      t.fillStyle = "rgba(245, 158, 11, 0.8)", t.strokeStyle = "rgba(245, 158, 11, 1)";
    else if (s)
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
function hr(y, t) {
  const e = new Qe(y);
  return {
    id: "markers",
    order: xt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (o) => {
      if (!o.visibility.markers) return;
      const c = t();
      e.draw(o, {
        selectedId: c.selectedId,
        hoverId: c.hoverId,
        boardBounds: o.boardBounds
      });
    }
  };
}
export {
  Xe as Emitter,
  ft as GerberError,
  $e as MarkerPicker,
  Qe as MarkerRenderer,
  je as MarkerStore,
  Ue as OverlayRegistry,
  Le as RenderScheduler,
  He as SelectionRenderer,
  We as UniformGridIndex,
  Ye as Viewer,
  De as ViewportTransform,
  se as VisibilityManager,
  ir as createGerberPass,
  cr as createGridOverlay,
  sr as createIntegratedViewer,
  hr as createMarkerPass,
  ar as createOverlayPass,
  dr as createPulsingMarkerOverlay,
  Ke as createSelectionPass,
  lr as createTooltipOverlay,
  or as createViolationDotsOverlay,
  be as detectGerberBundle,
  er as renderGerbers,
  ne as renderGerbersFiles,
  tr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
