var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ce(y) {
  return y && y.__esModule && Object.prototype.hasOwnProperty.call(y, "default") ? y.default : y;
}
function Pt(y) {
  throw new Error('Could not dynamically require "' + y + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Nt = { exports: {} };
var $t;
function he() {
  return $t || ($t = 1, (function(y, t) {
    (function(e) {
      y.exports = e();
    })(function() {
      return (function e(l, c, s) {
        function i(v, b) {
          if (!c[v]) {
            if (!l[v]) {
              var m = typeof Pt == "function" && Pt;
              if (!b && m) return m(v, !0);
              if (n) return n(v, !0);
              var f = new Error("Cannot find module '" + v + "'");
              throw f.code = "MODULE_NOT_FOUND", f;
            }
            var h = c[v] = { exports: {} };
            l[v][0].call(h.exports, function(p) {
              var a = l[v][1][p];
              return i(a || p);
            }, h, h.exports, e, l, c, s);
          }
          return c[v].exports;
        }
        for (var n = typeof Pt == "function" && Pt, d = 0; d < s.length; d++) i(s[d]);
        return i;
      })({ 1: [function(e, l, c) {
        var s = e("./utils"), i = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        c.encode = function(d) {
          for (var v, b, m, f, h, p, a, g = [], u = 0, k = d.length, R = k, x = s.getTypeOf(d) !== "string"; u < d.length; ) R = k - u, m = x ? (v = d[u++], b = u < k ? d[u++] : 0, u < k ? d[u++] : 0) : (v = d.charCodeAt(u++), b = u < k ? d.charCodeAt(u++) : 0, u < k ? d.charCodeAt(u++) : 0), f = v >> 2, h = (3 & v) << 4 | b >> 4, p = 1 < R ? (15 & b) << 2 | m >> 6 : 64, a = 2 < R ? 63 & m : 64, g.push(n.charAt(f) + n.charAt(h) + n.charAt(p) + n.charAt(a));
          return g.join("");
        }, c.decode = function(d) {
          var v, b, m, f, h, p, a = 0, g = 0, u = "data:";
          if (d.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var k, R = 3 * (d = d.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (d.charAt(d.length - 1) === n.charAt(64) && R--, d.charAt(d.length - 2) === n.charAt(64) && R--, R % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (k = i.uint8array ? new Uint8Array(0 | R) : new Array(0 | R); a < d.length; ) v = n.indexOf(d.charAt(a++)) << 2 | (f = n.indexOf(d.charAt(a++))) >> 4, b = (15 & f) << 4 | (h = n.indexOf(d.charAt(a++))) >> 2, m = (3 & h) << 6 | (p = n.indexOf(d.charAt(a++))), k[g++] = v, h !== 64 && (k[g++] = b), p !== 64 && (k[g++] = m);
          return k;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, l, c) {
        var s = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), d = e("./stream/DataLengthProbe");
        function v(b, m, f, h, p) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = f, this.compression = h, this.compressedContent = p;
        }
        v.prototype = { getContentWorker: function() {
          var b = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(b, m, f) {
          return b.pipe(new n()).pipe(new d("uncompressedSize")).pipe(m.compressWorker(f)).pipe(new d("compressedSize")).withStreamInfo("compression", m);
        }, l.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, l, c) {
        var s = e("./stream/GenericWorker");
        c.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, c.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, l, c) {
        var s = e("./utils"), i = (function() {
          for (var n, d = [], v = 0; v < 256; v++) {
            n = v;
            for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            d[v] = n;
          }
          return d;
        })();
        l.exports = function(n, d) {
          return n !== void 0 && n.length ? s.getTypeOf(n) !== "string" ? (function(v, b, m, f) {
            var h = i, p = f + m;
            v ^= -1;
            for (var a = f; a < p; a++) v = v >>> 8 ^ h[255 & (v ^ b[a])];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : (function(v, b, m, f) {
            var h = i, p = f + m;
            v ^= -1;
            for (var a = f; a < p; a++) v = v >>> 8 ^ h[255 & (v ^ b.charCodeAt(a))];
            return -1 ^ v;
          })(0 | d, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, l, c) {
        c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !0, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
      }, {}], 6: [function(e, l, c) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), l.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, l, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), n = e("./utils"), d = e("./stream/GenericWorker"), v = s ? "uint8array" : "array";
        function b(m, f) {
          d.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = f, this.meta = {};
        }
        c.magic = "\b\0", n.inherits(b, d), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(v, m.data), !1);
        }, b.prototype.flush = function() {
          d.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          d.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(f) {
            m.push({ data: f, meta: m.meta });
          };
        }, c.compressWorker = function(m) {
          return new b("Deflate", m);
        }, c.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, l, c) {
        function s(h, p) {
          var a, g = "";
          for (a = 0; a < p; a++) g += String.fromCharCode(255 & h), h >>>= 8;
          return g;
        }
        function i(h, p, a, g, u, k) {
          var R, x, A = h.file, B = h.compression, I = k !== v.utf8encode, L = n.transformTo("string", k(A.name)), T = n.transformTo("string", v.utf8encode(A.name)), j = A.comment, K = n.transformTo("string", k(j)), S = n.transformTo("string", v.utf8encode(j)), P = T.length !== A.name.length, o = S.length !== j.length, N = "", J = "", $ = "", rt = A.dir, Y = A.date, D = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          p && !a || (D.crc32 = h.crc32, D.compressedSize = h.compressedSize, D.uncompressedSize = h.uncompressedSize);
          var z = 0;
          p && (z |= 8), I || !P && !o || (z |= 2048);
          var E = 0, Z = 0;
          rt && (E |= 16), u === "UNIX" ? (Z = 798, E |= (function(W, tt) {
            var lt = W;
            return W || (lt = tt ? 16893 : 33204), (65535 & lt) << 16;
          })(A.unixPermissions, rt)) : (Z = 20, E |= (function(W) {
            return 63 & (W || 0);
          })(A.dosPermissions)), R = Y.getUTCHours(), R <<= 6, R |= Y.getUTCMinutes(), R <<= 5, R |= Y.getUTCSeconds() / 2, x = Y.getUTCFullYear() - 1980, x <<= 4, x |= Y.getUTCMonth() + 1, x <<= 5, x |= Y.getUTCDate(), P && (J = s(1, 1) + s(b(L), 4) + T, N += "up" + s(J.length, 2) + J), o && ($ = s(1, 1) + s(b(K), 4) + S, N += "uc" + s($.length, 2) + $);
          var G = "";
          return G += `
\0`, G += s(z, 2), G += B.magic, G += s(R, 2), G += s(x, 2), G += s(D.crc32, 4), G += s(D.compressedSize, 4), G += s(D.uncompressedSize, 4), G += s(L.length, 2), G += s(N.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + G + L + N, dirRecord: m.CENTRAL_FILE_HEADER + s(Z, 2) + G + s(K.length, 2) + "\0\0\0\0" + s(E, 4) + s(g, 4) + L + N + K };
        }
        var n = e("../utils"), d = e("../stream/GenericWorker"), v = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function f(h, p, a, g) {
          d.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = p, this.zipPlatform = a, this.encodeFileName = g, this.streamFiles = h, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(f, d), f.prototype.push = function(h) {
          var p = h.meta.percent || 0, a = this.entriesCount, g = this._sources.length;
          this.accumulate ? this.contentBuffer.push(h) : (this.bytesWritten += h.data.length, d.prototype.push.call(this, { data: h.data, meta: { currentFile: this.currentFile, percent: a ? (p + 100 * (a - g - 1)) / a : 100 } }));
        }, f.prototype.openedSource = function(h) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = h.file.name;
          var p = this.streamFiles && !h.file.dir;
          if (p) {
            var a = i(h, p, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: a.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, f.prototype.closedSource = function(h) {
          this.accumulate = !1;
          var p = this.streamFiles && !h.file.dir, a = i(h, p, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(a.dirRecord), p) this.push({ data: (function(g) {
            return m.DATA_DESCRIPTOR + s(g.crc32, 4) + s(g.compressedSize, 4) + s(g.uncompressedSize, 4);
          })(h), meta: { percent: 100 } });
          else for (this.push({ data: a.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, f.prototype.flush = function() {
          for (var h = this.bytesWritten, p = 0; p < this.dirRecords.length; p++) this.push({ data: this.dirRecords[p], meta: { percent: 100 } });
          var a = this.bytesWritten - h, g = (function(u, k, R, x, A) {
            var B = n.transformTo("string", A(x));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(u, 2) + s(u, 2) + s(k, 4) + s(R, 4) + s(B.length, 2) + B;
          })(this.dirRecords.length, a, h, this.zipComment, this.encodeFileName);
          this.push({ data: g, meta: { percent: 100 } });
        }, f.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, f.prototype.registerPrevious = function(h) {
          this._sources.push(h);
          var p = this;
          return h.on("data", function(a) {
            p.processChunk(a);
          }), h.on("end", function() {
            p.closedSource(p.previous.streamInfo), p._sources.length ? p.prepareNextSource() : p.end();
          }), h.on("error", function(a) {
            p.error(a);
          }), this;
        }, f.prototype.resume = function() {
          return !!d.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, f.prototype.error = function(h) {
          var p = this._sources;
          if (!d.prototype.error.call(this, h)) return !1;
          for (var a = 0; a < p.length; a++) try {
            p[a].error(h);
          } catch {
          }
          return !0;
        }, f.prototype.lock = function() {
          d.prototype.lock.call(this);
          for (var h = this._sources, p = 0; p < h.length; p++) h[p].lock();
        }, l.exports = f;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, l, c) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        c.generateWorker = function(n, d, v) {
          var b = new i(d.streamFiles, v, d.platform, d.encodeFileName), m = 0;
          try {
            n.forEach(function(f, h) {
              m++;
              var p = (function(k, R) {
                var x = k || R, A = s[x];
                if (!A) throw new Error(x + " is not a valid compression method !");
                return A;
              })(h.options.compression, d.compression), a = h.options.compressionOptions || d.compressionOptions || {}, g = h.dir, u = h.date;
              h._compressWorker(p, a).withStreamInfo("file", { name: f, dir: g, date: u, comment: h.comment || "", unixPermissions: h.unixPermissions, dosPermissions: h.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (f) {
            b.error(f);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, l, c) {
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
        }, s.external = e("./external"), l.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, l, c) {
        var s = e("./utils"), i = e("./external"), n = e("./utf8"), d = e("./zipEntries"), v = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(f) {
          return new i.Promise(function(h, p) {
            var a = f.decompressed.getContentWorker().pipe(new v());
            a.on("error", function(g) {
              p(g);
            }).on("end", function() {
              a.streamInfo.crc32 !== f.decompressed.crc32 ? p(new Error("Corrupted zip : CRC32 mismatch")) : h();
            }).resume();
          });
        }
        l.exports = function(f, h) {
          var p = this;
          return h = s.extend(h || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(f) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", f, !0, h.optimizedBinaryString, h.base64).then(function(a) {
            var g = new d(h);
            return g.load(a), g;
          }).then(function(a) {
            var g = [i.Promise.resolve(a)], u = a.files;
            if (h.checkCRC32) for (var k = 0; k < u.length; k++) g.push(m(u[k]));
            return i.Promise.all(g);
          }).then(function(a) {
            for (var g = a.shift(), u = g.files, k = 0; k < u.length; k++) {
              var R = u[k], x = R.fileNameStr, A = s.resolve(R.fileNameStr);
              p.file(A, R.decompressed, { binary: !0, optimizedBinaryString: !0, date: R.date, dir: R.dir, comment: R.fileCommentStr.length ? R.fileCommentStr : null, unixPermissions: R.unixPermissions, dosPermissions: R.dosPermissions, createFolders: h.createFolders }), R.dir || (p.file(A).unsafeOriginalName = x);
            }
            return g.zipComment.length && (p.comment = g.zipComment), p;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, l, c) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function n(d, v) {
          i.call(this, "Nodejs stream input adapter for " + d), this._upstreamEnded = !1, this._bindStream(v);
        }
        s.inherits(n, i), n.prototype._bindStream = function(d) {
          var v = this;
          (this._stream = d).pause(), d.on("data", function(b) {
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
        }, l.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, l, c) {
        var s = e("readable-stream").Readable;
        function i(n, d, v) {
          s.call(this, d), this._helper = n;
          var b = this;
          n.on("data", function(m, f) {
            b.push(m) || b._helper.pause(), v && v(f);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(i, s), i.prototype._read = function() {
          this._helper.resume();
        }, l.exports = i;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, l, c) {
        l.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, i) {
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
      }, {}], 15: [function(e, l, c) {
        function s(A, B, I) {
          var L, T = n.getTypeOf(B), j = n.extend(I || {}, b);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (A = u(A)), j.createFolders && (L = g(A)) && k.call(this, L, !0);
          var K = T === "string" && j.binary === !1 && j.base64 === !1;
          I && I.binary !== void 0 || (j.binary = !K), (B instanceof m && B.uncompressedSize === 0 || j.dir || !B || B.length === 0) && (j.base64 = !1, j.binary = !0, B = "", j.compression = "STORE", T = "string");
          var S = null;
          S = B instanceof m || B instanceof d ? B : p.isNode && p.isStream(B) ? new a(A, B) : n.prepareContent(A, B, j.binary, j.optimizedBinaryString, j.base64);
          var P = new f(A, S, j);
          this.files[A] = P;
        }
        var i = e("./utf8"), n = e("./utils"), d = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), f = e("./zipObject"), h = e("./generate"), p = e("./nodejsUtils"), a = e("./nodejs/NodejsStreamInputAdapter"), g = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var B = A.lastIndexOf("/");
          return 0 < B ? A.substring(0, B) : "";
        }, u = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, k = function(A, B) {
          return B = B !== void 0 ? B : b.createFolders, A = u(A), this.files[A] || s.call(this, A, null, { dir: !0, createFolders: B }), this.files[A];
        };
        function R(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var x = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var B, I, L;
          for (B in this.files) L = this.files[B], (I = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && A(I, L);
        }, filter: function(A) {
          var B = [];
          return this.forEach(function(I, L) {
            A(I, L) && B.push(L);
          }), B;
        }, file: function(A, B, I) {
          if (arguments.length !== 1) return A = this.root + A, s.call(this, A, B, I), this;
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
          var B = this.root + A, I = k.call(this, B), L = this.clone();
          return L.root = I.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var B = this.files[A];
          if (B || (A.slice(-1) !== "/" && (A += "/"), B = this.files[A]), B && !B.dir) delete this.files[A];
          else for (var I = this.filter(function(T, j) {
            return j.name.slice(0, A.length) === A;
          }), L = 0; L < I.length; L++) delete this.files[I[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var B, I = {};
          try {
            if ((I = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = I.type.toLowerCase(), I.compression = I.compression.toUpperCase(), I.type === "binarystring" && (I.type = "string"), !I.type) throw new Error("No output type specified.");
            n.checkSupport(I.type), I.platform !== "darwin" && I.platform !== "freebsd" && I.platform !== "linux" && I.platform !== "sunos" || (I.platform = "UNIX"), I.platform === "win32" && (I.platform = "DOS");
            var L = I.comment || this.comment || "";
            B = h.generateWorker(this, I, L);
          } catch (T) {
            (B = new d("error")).error(T);
          }
          return new v(B, I.type || "string", I.mimeType);
        }, generateAsync: function(A, B) {
          return this.generateInternalStream(A).accumulate(B);
        }, generateNodeStream: function(A, B) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(B);
        } };
        l.exports = x;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, l, c) {
        l.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, l, c) {
        var s = e("./DataReader");
        function i(n) {
          s.call(this, n);
          for (var d = 0; d < this.data.length; d++) n[d] = 255 & n[d];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, i.prototype.lastIndexOfSignature = function(n) {
          for (var d = n.charCodeAt(0), v = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), f = this.length - 4; 0 <= f; --f) if (this.data[f] === d && this.data[f + 1] === v && this.data[f + 2] === b && this.data[f + 3] === m) return f - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(n) {
          var d = n.charCodeAt(0), v = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), f = this.readData(4);
          return d === f[0] && v === f[1] && b === f[2] && m === f[3];
        }, i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, l.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, l, c) {
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
        } }, l.exports = i;
      }, { "../utils": 32 }], 19: [function(e, l, c) {
        var s = e("./Uint8ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          this.checkOffset(n);
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, l.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, l, c) {
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
        }, l.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, l, c) {
        var s = e("./ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var d = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, d;
        }, l.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, l, c) {
        var s = e("../utils"), i = e("../support"), n = e("./ArrayReader"), d = e("./StringReader"), v = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        l.exports = function(m) {
          var f = s.getTypeOf(m);
          return s.checkSupport(f), f !== "string" || i.uint8array ? f === "nodebuffer" ? new v(m) : i.uint8array ? new b(s.transformTo("uint8array", m)) : new n(s.transformTo("array", m)) : new d(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, l, c) {
        c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, l, c) {
        var s = e("./GenericWorker"), i = e("../utils");
        function n(d) {
          s.call(this, "ConvertWorker to " + d), this.destType = d;
        }
        i.inherits(n, s), n.prototype.processChunk = function(d) {
          this.push({ data: i.transformTo(this.destType, d.data), meta: d.meta });
        }, l.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, l, c) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function n() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, s), n.prototype.processChunk = function(d) {
          this.streamInfo.crc32 = i(d.data, this.streamInfo.crc32 || 0), this.push(d);
        }, l.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, l, c) {
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
        }, l.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, l, c) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(d) {
          i.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, d.then(function(b) {
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
        }, l.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, l, c) {
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
        } }, l.exports = s;
      }, {}], 29: [function(e, l, c) {
        var s = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), d = e("../base64"), v = e("../support"), b = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function f(p, a) {
          return new b.Promise(function(g, u) {
            var k = [], R = p._internalType, x = p._outputType, A = p._mimeType;
            p.on("data", function(B, I) {
              k.push(B), a && a(I);
            }).on("error", function(B) {
              k = [], u(B);
            }).on("end", function() {
              try {
                var B = (function(I, L, T) {
                  switch (I) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", L), T);
                    case "base64":
                      return d.encode(L);
                    default:
                      return s.transformTo(I, L);
                  }
                })(x, (function(I, L) {
                  var T, j = 0, K = null, S = 0;
                  for (T = 0; T < L.length; T++) S += L[T].length;
                  switch (I) {
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
                      throw new Error("concat : unsupported type '" + I + "'");
                  }
                })(R, k), A);
                g(B);
              } catch (I) {
                u(I);
              }
              k = [];
            }).resume();
          });
        }
        function h(p, a, g) {
          var u = a;
          switch (a) {
            case "blob":
            case "arraybuffer":
              u = "uint8array";
              break;
            case "base64":
              u = "string";
          }
          try {
            this._internalType = u, this._outputType = a, this._mimeType = g, s.checkSupport(u), this._worker = p.pipe(new i(u)), p.lock();
          } catch (k) {
            this._worker = new n("error"), this._worker.error(k);
          }
        }
        h.prototype = { accumulate: function(p) {
          return f(this, p);
        }, on: function(p, a) {
          var g = this;
          return p === "data" ? this._worker.on(p, function(u) {
            a.call(g, u.data, u.meta);
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
        } }, l.exports = h;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, l, c) {
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
      }, { "readable-stream": 16 }], 31: [function(e, l, c) {
        for (var s = e("./utils"), i = e("./support"), n = e("./nodejsUtils"), d = e("./stream/GenericWorker"), v = new Array(256), b = 0; b < 256; b++) v[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          d.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function f() {
          d.call(this, "utf-8 encode");
        }
        c.utf8encode = function(h) {
          return i.nodebuffer ? n.newBufferFrom(h, "utf-8") : (function(p) {
            var a, g, u, k, R, x = p.length, A = 0;
            for (k = 0; k < x; k++) (64512 & (g = p.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (u = p.charCodeAt(k + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (u - 56320), k++), A += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
            for (a = i.uint8array ? new Uint8Array(A) : new Array(A), k = R = 0; R < A; k++) (64512 & (g = p.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (u = p.charCodeAt(k + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (u - 56320), k++), g < 128 ? a[R++] = g : (g < 2048 ? a[R++] = 192 | g >>> 6 : (g < 65536 ? a[R++] = 224 | g >>> 12 : (a[R++] = 240 | g >>> 18, a[R++] = 128 | g >>> 12 & 63), a[R++] = 128 | g >>> 6 & 63), a[R++] = 128 | 63 & g);
            return a;
          })(h);
        }, c.utf8decode = function(h) {
          return i.nodebuffer ? s.transformTo("nodebuffer", h).toString("utf-8") : (function(p) {
            var a, g, u, k, R = p.length, x = new Array(2 * R);
            for (a = g = 0; a < R; ) if ((u = p[a++]) < 128) x[g++] = u;
            else if (4 < (k = v[u])) x[g++] = 65533, a += k - 1;
            else {
              for (u &= k === 2 ? 31 : k === 3 ? 15 : 7; 1 < k && a < R; ) u = u << 6 | 63 & p[a++], k--;
              1 < k ? x[g++] = 65533 : u < 65536 ? x[g++] = u : (u -= 65536, x[g++] = 55296 | u >> 10 & 1023, x[g++] = 56320 | 1023 & u);
            }
            return x.length !== g && (x.subarray ? x = x.subarray(0, g) : x.length = g), s.applyFromCharCode(x);
          })(h = s.transformTo(i.uint8array ? "uint8array" : "array", h));
        }, s.inherits(m, d), m.prototype.processChunk = function(h) {
          var p = s.transformTo(i.uint8array ? "uint8array" : "array", h.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var a = p;
              (p = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), p.set(a, this.leftOver.length);
            } else p = this.leftOver.concat(p);
            this.leftOver = null;
          }
          var g = (function(k, R) {
            var x;
            for ((R = R || k.length) > k.length && (R = k.length), x = R - 1; 0 <= x && (192 & k[x]) == 128; ) x--;
            return x < 0 || x === 0 ? R : x + v[k[x]] > R ? x : R;
          })(p), u = p;
          g !== p.length && (i.uint8array ? (u = p.subarray(0, g), this.leftOver = p.subarray(g, p.length)) : (u = p.slice(0, g), this.leftOver = p.slice(g, p.length))), this.push({ data: c.utf8decode(u), meta: h.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: c.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, c.Utf8DecodeWorker = m, s.inherits(f, d), f.prototype.processChunk = function(h) {
          this.push({ data: c.utf8encode(h.data), meta: h.meta });
        }, c.Utf8EncodeWorker = f;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, l, c) {
        var s = e("./support"), i = e("./base64"), n = e("./nodejsUtils"), d = e("./external");
        function v(a) {
          return a;
        }
        function b(a, g) {
          for (var u = 0; u < a.length; ++u) g[u] = 255 & a.charCodeAt(u);
          return g;
        }
        e("setimmediate"), c.newBlob = function(a, g) {
          c.checkSupport("blob");
          try {
            return new Blob([a], { type: g });
          } catch {
            try {
              var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return u.append(a), u.getBlob(g);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(a, g, u) {
          var k = [], R = 0, x = a.length;
          if (x <= u) return String.fromCharCode.apply(null, a);
          for (; R < x; ) g === "array" || g === "nodebuffer" ? k.push(String.fromCharCode.apply(null, a.slice(R, Math.min(R + u, x)))) : k.push(String.fromCharCode.apply(null, a.subarray(R, Math.min(R + u, x)))), R += u;
          return k.join("");
        }, stringifyByChar: function(a) {
          for (var g = "", u = 0; u < a.length; u++) g += String.fromCharCode(a[u]);
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
        function f(a) {
          var g = 65536, u = c.getTypeOf(a), k = !0;
          if (u === "uint8array" ? k = m.applyCanBeUsed.uint8array : u === "nodebuffer" && (k = m.applyCanBeUsed.nodebuffer), k) for (; 1 < g; ) try {
            return m.stringifyByChunk(a, u, g);
          } catch {
            g = Math.floor(g / 2);
          }
          return m.stringifyByChar(a);
        }
        function h(a, g) {
          for (var u = 0; u < a.length; u++) g[u] = a[u];
          return g;
        }
        c.applyFromCharCode = f;
        var p = {};
        p.string = { string: v, array: function(a) {
          return b(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return p.string.uint8array(a).buffer;
        }, uint8array: function(a) {
          return b(a, new Uint8Array(a.length));
        }, nodebuffer: function(a) {
          return b(a, n.allocBuffer(a.length));
        } }, p.array = { string: f, array: v, arraybuffer: function(a) {
          return new Uint8Array(a).buffer;
        }, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, p.arraybuffer = { string: function(a) {
          return f(new Uint8Array(a));
        }, array: function(a) {
          return h(new Uint8Array(a), new Array(a.byteLength));
        }, arraybuffer: v, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return n.newBufferFrom(new Uint8Array(a));
        } }, p.uint8array = { string: f, array: function(a) {
          return h(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return a.buffer;
        }, uint8array: v, nodebuffer: function(a) {
          return n.newBufferFrom(a);
        } }, p.nodebuffer = { string: f, array: function(a) {
          return h(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return p.nodebuffer.uint8array(a).buffer;
        }, uint8array: function(a) {
          return h(a, new Uint8Array(a.length));
        }, nodebuffer: v }, c.transformTo = function(a, g) {
          if (g = g || "", !a) return g;
          c.checkSupport(a);
          var u = c.getTypeOf(g);
          return p[u][a](g);
        }, c.resolve = function(a) {
          for (var g = a.split("/"), u = [], k = 0; k < g.length; k++) {
            var R = g[k];
            R === "." || R === "" && k !== 0 && k !== g.length - 1 || (R === ".." ? u.pop() : u.push(R));
          }
          return u.join("/");
        }, c.getTypeOf = function(a) {
          return typeof a == "string" ? "string" : Object.prototype.toString.call(a) === "[object Array]" ? "array" : s.nodebuffer && n.isBuffer(a) ? "nodebuffer" : s.uint8array && a instanceof Uint8Array ? "uint8array" : s.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, c.checkSupport = function(a) {
          if (!s[a.toLowerCase()]) throw new Error(a + " is not supported by this platform");
        }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function(a) {
          var g, u, k = "";
          for (u = 0; u < (a || "").length; u++) k += "\\x" + ((g = a.charCodeAt(u)) < 16 ? "0" : "") + g.toString(16).toUpperCase();
          return k;
        }, c.delay = function(a, g, u) {
          setImmediate(function() {
            a.apply(u || null, g || []);
          });
        }, c.inherits = function(a, g) {
          function u() {
          }
          u.prototype = g.prototype, a.prototype = new u();
        }, c.extend = function() {
          var a, g, u = {};
          for (a = 0; a < arguments.length; a++) for (g in arguments[a]) Object.prototype.hasOwnProperty.call(arguments[a], g) && u[g] === void 0 && (u[g] = arguments[a][g]);
          return u;
        }, c.prepareContent = function(a, g, u, k, R) {
          return d.Promise.resolve(g).then(function(x) {
            return s.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) && typeof FileReader < "u" ? new d.Promise(function(A, B) {
              var I = new FileReader();
              I.onload = function(L) {
                A(L.target.result);
              }, I.onerror = function(L) {
                B(L.target.error);
              }, I.readAsArrayBuffer(x);
            }) : x;
          }).then(function(x) {
            var A = c.getTypeOf(x);
            return A ? (A === "arraybuffer" ? x = c.transformTo("uint8array", x) : A === "string" && (R ? x = i.decode(x) : u && k !== !0 && (x = (function(B) {
              return b(B, s.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            })(x))), x) : d.Promise.reject(new Error("Can't read the data of '" + a + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, l, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), d = e("./zipEntry"), v = e("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var f = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(f) + ", expected " + i.pretty(m) + ")");
          }
        }, isSignature: function(m, f) {
          var h = this.reader.index;
          this.reader.setIndex(m);
          var p = this.reader.readString(4) === f;
          return this.reader.setIndex(h), p;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), f = v.uint8array ? "uint8array" : "array", h = i.transformTo(f, m);
          this.zipComment = this.loadOptions.decodeFileName(h);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, f, h, p = this.zip64EndOfCentralSize - 44; 0 < p; ) m = this.reader.readInt(2), f = this.reader.readInt(4), h = this.reader.readData(f), this.zip64ExtensibleData[m] = { id: m, length: f, value: h };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, f;
          for (m = 0; m < this.files.length; m++) f = this.files[m], this.reader.setIndex(f.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), f.readLocalPart(this.reader), f.handleUTF8(), f.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (m = new d({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var f = m;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var h = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (h += 20, h += 12 + this.zip64EndOfCentralSize);
          var p = f - h;
          if (0 < p) this.isSignature(f, n.CENTRAL_FILE_HEADER) || (this.reader.zero = p);
          else if (p < 0) throw new Error("Corrupted zip: missing " + Math.abs(p) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, l.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, l, c) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), d = e("./crc32"), v = e("./utf8"), b = e("./compressions"), m = e("./support");
        function f(h, p) {
          this.options = h, this.loadOptions = p;
        }
        f.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(h) {
          var p, a;
          if (h.skip(22), this.fileNameLength = h.readInt(2), a = h.readInt(2), this.fileName = h.readData(this.fileNameLength), h.skip(a), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((p = (function(g) {
            for (var u in b) if (Object.prototype.hasOwnProperty.call(b, u) && b[u].magic === g) return b[u];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, p, h.readData(this.compressedSize));
        }, readCentralPart: function(h) {
          this.versionMadeBy = h.readInt(2), h.skip(2), this.bitFlag = h.readInt(2), this.compressionMethod = h.readString(2), this.date = h.readDate(), this.crc32 = h.readInt(4), this.compressedSize = h.readInt(4), this.uncompressedSize = h.readInt(4);
          var p = h.readInt(2);
          if (this.extraFieldsLength = h.readInt(2), this.fileCommentLength = h.readInt(2), this.diskNumberStart = h.readInt(2), this.internalFileAttributes = h.readInt(2), this.externalFileAttributes = h.readInt(4), this.localHeaderOffset = h.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          h.skip(p), this.readExtraFields(h), this.parseZIP64ExtraField(h), this.fileComment = h.readData(this.fileCommentLength);
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
          var p, a, g, u = h.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); h.index + 4 < u; ) p = h.readInt(2), a = h.readInt(2), g = h.readData(a), this.extraFields[p] = { id: p, length: a, value: g };
          h.setIndex(u);
        }, handleUTF8: function() {
          var h = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var p = this.findExtraFieldUnicodePath();
            if (p !== null) this.fileNameStr = p;
            else {
              var a = i.transformTo(h, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(a);
            }
            var g = this.findExtraFieldUnicodeComment();
            if (g !== null) this.fileCommentStr = g;
            else {
              var u = i.transformTo(h, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(u);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var h = this.extraFields[28789];
          if (h) {
            var p = s(h.value);
            return p.readInt(1) !== 1 || d(this.fileName) !== p.readInt(4) ? null : v.utf8decode(p.readData(h.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var h = this.extraFields[25461];
          if (h) {
            var p = s(h.value);
            return p.readInt(1) !== 1 || d(this.fileComment) !== p.readInt(4) ? null : v.utf8decode(p.readData(h.length - 5));
          }
          return null;
        } }, l.exports = f;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, l, c) {
        function s(p, a, g) {
          this.name = p, this.dir = g.dir, this.date = g.date, this.comment = g.comment, this.unixPermissions = g.unixPermissions, this.dosPermissions = g.dosPermissions, this._data = a, this._dataBinary = g.binary, this.options = { compression: g.compression, compressionOptions: g.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), d = e("./utf8"), v = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(p) {
          var a = null, g = "string";
          try {
            if (!p) throw new Error("No output type specified.");
            var u = (g = p.toLowerCase()) === "string" || g === "text";
            g !== "binarystring" && g !== "text" || (g = "string"), a = this._decompressWorker();
            var k = !this._dataBinary;
            k && !u && (a = a.pipe(new d.Utf8EncodeWorker())), !k && u && (a = a.pipe(new d.Utf8DecodeWorker()));
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
          return this._dataBinary || (g = g.pipe(new d.Utf8EncodeWorker())), v.createWorkerFrom(g, p, a);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], f = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, h = 0; h < m.length; h++) s.prototype[m[h]] = f;
        l.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, c) {
        (function(s) {
          var i, n, d = s.MutationObserver || s.WebKitMutationObserver;
          if (d) {
            var v = 0, b = new d(p), m = s.document.createTextNode("");
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
            var f = new s.MessageChannel();
            f.port1.onmessage = p, i = function() {
              f.port2.postMessage(0);
            };
          }
          var h = [];
          function p() {
            var a, g;
            n = !0;
            for (var u = h.length; u; ) {
              for (g = h, h = [], a = -1; ++a < u; ) g[a]();
              u = h.length;
            }
            n = !1;
          }
          l.exports = function(a) {
            h.push(a) !== 1 || n || i();
          };
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, l, c) {
        var s = e("immediate");
        function i() {
        }
        var n = {}, d = ["REJECTED"], v = ["FULFILLED"], b = ["PENDING"];
        function m(u) {
          if (typeof u != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, u !== i && a(this, u);
        }
        function f(u, k, R) {
          this.promise = u, typeof k == "function" && (this.onFulfilled = k, this.callFulfilled = this.otherCallFulfilled), typeof R == "function" && (this.onRejected = R, this.callRejected = this.otherCallRejected);
        }
        function h(u, k, R) {
          s(function() {
            var x;
            try {
              x = k(R);
            } catch (A) {
              return n.reject(u, A);
            }
            x === u ? n.reject(u, new TypeError("Cannot resolve promise with itself")) : n.resolve(u, x);
          });
        }
        function p(u) {
          var k = u && u.then;
          if (u && (typeof u == "object" || typeof u == "function") && typeof k == "function") return function() {
            k.apply(u, arguments);
          };
        }
        function a(u, k) {
          var R = !1;
          function x(I) {
            R || (R = !0, n.reject(u, I));
          }
          function A(I) {
            R || (R = !0, n.resolve(u, I));
          }
          var B = g(function() {
            k(A, x);
          });
          B.status === "error" && x(B.value);
        }
        function g(u, k) {
          var R = {};
          try {
            R.value = u(k), R.status = "success";
          } catch (x) {
            R.status = "error", R.value = x;
          }
          return R;
        }
        (l.exports = m).prototype.finally = function(u) {
          if (typeof u != "function") return this;
          var k = this.constructor;
          return this.then(function(R) {
            return k.resolve(u()).then(function() {
              return R;
            });
          }, function(R) {
            return k.resolve(u()).then(function() {
              throw R;
            });
          });
        }, m.prototype.catch = function(u) {
          return this.then(null, u);
        }, m.prototype.then = function(u, k) {
          if (typeof u != "function" && this.state === v || typeof k != "function" && this.state === d) return this;
          var R = new this.constructor(i);
          return this.state !== b ? h(R, this.state === v ? u : k, this.outcome) : this.queue.push(new f(R, u, k)), R;
        }, f.prototype.callFulfilled = function(u) {
          n.resolve(this.promise, u);
        }, f.prototype.otherCallFulfilled = function(u) {
          h(this.promise, this.onFulfilled, u);
        }, f.prototype.callRejected = function(u) {
          n.reject(this.promise, u);
        }, f.prototype.otherCallRejected = function(u) {
          h(this.promise, this.onRejected, u);
        }, n.resolve = function(u, k) {
          var R = g(p, k);
          if (R.status === "error") return n.reject(u, R.value);
          var x = R.value;
          if (x) a(u, x);
          else {
            u.state = v, u.outcome = k;
            for (var A = -1, B = u.queue.length; ++A < B; ) u.queue[A].callFulfilled(k);
          }
          return u;
        }, n.reject = function(u, k) {
          u.state = d, u.outcome = k;
          for (var R = -1, x = u.queue.length; ++R < x; ) u.queue[R].callRejected(k);
          return u;
        }, m.resolve = function(u) {
          return u instanceof this ? u : n.resolve(new this(i), u);
        }, m.reject = function(u) {
          var k = new this(i);
          return n.reject(k, u);
        }, m.all = function(u) {
          var k = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = u.length, x = !1;
          if (!R) return this.resolve([]);
          for (var A = new Array(R), B = 0, I = -1, L = new this(i); ++I < R; ) T(u[I], I);
          return L;
          function T(j, K) {
            k.resolve(j).then(function(S) {
              A[K] = S, ++B !== R || x || (x = !0, n.resolve(L, A));
            }, function(S) {
              x || (x = !0, n.reject(L, S));
            });
          }
        }, m.race = function(u) {
          var k = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var R = u.length, x = !1;
          if (!R) return this.resolve([]);
          for (var A = -1, B = new this(i); ++A < R; ) I = u[A], k.resolve(I).then(function(L) {
            x || (x = !0, n.resolve(B, L));
          }, function(L) {
            x || (x = !0, n.reject(B, L));
          });
          var I;
          return B;
        };
      }, { immediate: 36 }], 38: [function(e, l, c) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), l.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, l, c) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/messages"), v = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, f = -1, h = 0, p = 8;
        function a(u) {
          if (!(this instanceof a)) return new a(u);
          this.options = i.assign({ level: f, method: p, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: h, to: "" }, u || {});
          var k = this.options;
          k.raw && 0 < k.windowBits ? k.windowBits = -k.windowBits : k.gzip && 0 < k.windowBits && k.windowBits < 16 && (k.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var R = s.deflateInit2(this.strm, k.level, k.method, k.windowBits, k.memLevel, k.strategy);
          if (R !== m) throw new Error(d[R]);
          if (k.header && s.deflateSetHeader(this.strm, k.header), k.dictionary) {
            var x;
            if (x = typeof k.dictionary == "string" ? n.string2buf(k.dictionary) : b.call(k.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(k.dictionary) : k.dictionary, (R = s.deflateSetDictionary(this.strm, x)) !== m) throw new Error(d[R]);
            this._dict_set = !0;
          }
        }
        function g(u, k) {
          var R = new a(k);
          if (R.push(u, !0), R.err) throw R.msg || d[R.err];
          return R.result;
        }
        a.prototype.push = function(u, k) {
          var R, x, A = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          x = k === ~~k ? k : k === !0 ? 4 : 0, typeof u == "string" ? A.input = n.string2buf(u) : b.call(u) === "[object ArrayBuffer]" ? A.input = new Uint8Array(u) : A.input = u, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new i.Buf8(B), A.next_out = 0, A.avail_out = B), (R = s.deflate(A, x)) !== 1 && R !== m) return this.onEnd(R), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(i.shrinkBuf(A.output, A.next_out))) : this.onData(i.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && R !== 1);
          return x === 4 ? (R = s.deflateEnd(this.strm), this.onEnd(R), this.ended = !0, R === m) : x !== 2 || (this.onEnd(m), !(A.avail_out = 0));
        }, a.prototype.onData = function(u) {
          this.chunks.push(u);
        }, a.prototype.onEnd = function(u) {
          u === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, c.Deflate = a, c.deflate = g, c.deflateRaw = function(u, k) {
          return (k = k || {}).raw = !0, g(u, k);
        }, c.gzip = function(u, k) {
          return (k = k || {}).gzip = !0, g(u, k);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, l, c) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), n = e("./utils/strings"), d = e("./zlib/constants"), v = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), f = Object.prototype.toString;
        function h(a) {
          if (!(this instanceof h)) return new h(a);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});
          var g = this.options;
          g.raw && 0 <= g.windowBits && g.windowBits < 16 && (g.windowBits = -g.windowBits, g.windowBits === 0 && (g.windowBits = -15)), !(0 <= g.windowBits && g.windowBits < 16) || a && a.windowBits || (g.windowBits += 32), 15 < g.windowBits && g.windowBits < 48 && (15 & g.windowBits) == 0 && (g.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var u = s.inflateInit2(this.strm, g.windowBits);
          if (u !== d.Z_OK) throw new Error(v[u]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function p(a, g) {
          var u = new h(g);
          if (u.push(a, !0), u.err) throw u.msg || v[u.err];
          return u.result;
        }
        h.prototype.push = function(a, g) {
          var u, k, R, x, A, B, I = this.strm, L = this.options.chunkSize, T = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          k = g === ~~g ? g : g === !0 ? d.Z_FINISH : d.Z_NO_FLUSH, typeof a == "string" ? I.input = n.binstring2buf(a) : f.call(a) === "[object ArrayBuffer]" ? I.input = new Uint8Array(a) : I.input = a, I.next_in = 0, I.avail_in = I.input.length;
          do {
            if (I.avail_out === 0 && (I.output = new i.Buf8(L), I.next_out = 0, I.avail_out = L), (u = s.inflate(I, d.Z_NO_FLUSH)) === d.Z_NEED_DICT && T && (B = typeof T == "string" ? n.string2buf(T) : f.call(T) === "[object ArrayBuffer]" ? new Uint8Array(T) : T, u = s.inflateSetDictionary(this.strm, B)), u === d.Z_BUF_ERROR && j === !0 && (u = d.Z_OK, j = !1), u !== d.Z_STREAM_END && u !== d.Z_OK) return this.onEnd(u), !(this.ended = !0);
            I.next_out && (I.avail_out !== 0 && u !== d.Z_STREAM_END && (I.avail_in !== 0 || k !== d.Z_FINISH && k !== d.Z_SYNC_FLUSH) || (this.options.to === "string" ? (R = n.utf8border(I.output, I.next_out), x = I.next_out - R, A = n.buf2string(I.output, R), I.next_out = x, I.avail_out = L - x, x && i.arraySet(I.output, I.output, R, x, 0), this.onData(A)) : this.onData(i.shrinkBuf(I.output, I.next_out)))), I.avail_in === 0 && I.avail_out === 0 && (j = !0);
          } while ((0 < I.avail_in || I.avail_out === 0) && u !== d.Z_STREAM_END);
          return u === d.Z_STREAM_END && (k = d.Z_FINISH), k === d.Z_FINISH ? (u = s.inflateEnd(this.strm), this.onEnd(u), this.ended = !0, u === d.Z_OK) : k !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), !(I.avail_out = 0));
        }, h.prototype.onData = function(a) {
          this.chunks.push(a);
        }, h.prototype.onEnd = function(a) {
          a === d.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, c.Inflate = h, c.inflate = p, c.inflateRaw = function(a, g) {
          return (g = g || {}).raw = !0, p(a, g);
        }, c.ungzip = p;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, l, c) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        c.assign = function(d) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var b = v.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (d[m] = b[m]);
            }
          }
          return d;
        }, c.shrinkBuf = function(d, v) {
          return d.length === v ? d : d.subarray ? d.subarray(0, v) : (d.length = v, d);
        };
        var i = { arraySet: function(d, v, b, m, f) {
          if (v.subarray && d.subarray) d.set(v.subarray(b, b + m), f);
          else for (var h = 0; h < m; h++) d[f + h] = v[b + h];
        }, flattenChunks: function(d) {
          var v, b, m, f, h, p;
          for (v = m = 0, b = d.length; v < b; v++) m += d[v].length;
          for (p = new Uint8Array(m), v = f = 0, b = d.length; v < b; v++) h = d[v], p.set(h, f), f += h.length;
          return p;
        } }, n = { arraySet: function(d, v, b, m, f) {
          for (var h = 0; h < m; h++) d[f + h] = v[b + h];
        }, flattenChunks: function(d) {
          return [].concat.apply([], d);
        } };
        c.setTyped = function(d) {
          d ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, i)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, n));
        }, c.setTyped(s);
      }, {}], 42: [function(e, l, c) {
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
        function b(m, f) {
          if (f < 65537 && (m.subarray && n || !m.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(m, f));
          for (var h = "", p = 0; p < f; p++) h += String.fromCharCode(m[p]);
          return h;
        }
        d[254] = d[254] = 1, c.string2buf = function(m) {
          var f, h, p, a, g, u = m.length, k = 0;
          for (a = 0; a < u; a++) (64512 & (h = m.charCodeAt(a))) == 55296 && a + 1 < u && (64512 & (p = m.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (p - 56320), a++), k += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4;
          for (f = new s.Buf8(k), a = g = 0; g < k; a++) (64512 & (h = m.charCodeAt(a))) == 55296 && a + 1 < u && (64512 & (p = m.charCodeAt(a + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (p - 56320), a++), h < 128 ? f[g++] = h : (h < 2048 ? f[g++] = 192 | h >>> 6 : (h < 65536 ? f[g++] = 224 | h >>> 12 : (f[g++] = 240 | h >>> 18, f[g++] = 128 | h >>> 12 & 63), f[g++] = 128 | h >>> 6 & 63), f[g++] = 128 | 63 & h);
          return f;
        }, c.buf2binstring = function(m) {
          return b(m, m.length);
        }, c.binstring2buf = function(m) {
          for (var f = new s.Buf8(m.length), h = 0, p = f.length; h < p; h++) f[h] = m.charCodeAt(h);
          return f;
        }, c.buf2string = function(m, f) {
          var h, p, a, g, u = f || m.length, k = new Array(2 * u);
          for (h = p = 0; h < u; ) if ((a = m[h++]) < 128) k[p++] = a;
          else if (4 < (g = d[a])) k[p++] = 65533, h += g - 1;
          else {
            for (a &= g === 2 ? 31 : g === 3 ? 15 : 7; 1 < g && h < u; ) a = a << 6 | 63 & m[h++], g--;
            1 < g ? k[p++] = 65533 : a < 65536 ? k[p++] = a : (a -= 65536, k[p++] = 55296 | a >> 10 & 1023, k[p++] = 56320 | 1023 & a);
          }
          return b(k, p);
        }, c.utf8border = function(m, f) {
          var h;
          for ((f = f || m.length) > m.length && (f = m.length), h = f - 1; 0 <= h && (192 & m[h]) == 128; ) h--;
          return h < 0 || h === 0 ? f : h + d[m[h]] > f ? h : f;
        };
      }, { "./common": 41 }], 43: [function(e, l, c) {
        l.exports = function(s, i, n, d) {
          for (var v = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; n !== 0; ) {
            for (n -= m = 2e3 < n ? 2e3 : n; b = b + (v = v + i[d++] | 0) | 0, --m; ) ;
            v %= 65521, b %= 65521;
          }
          return v | b << 16 | 0;
        };
      }, {}], 44: [function(e, l, c) {
        l.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, l, c) {
        var s = (function() {
          for (var i, n = [], d = 0; d < 256; d++) {
            i = d;
            for (var v = 0; v < 8; v++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            n[d] = i;
          }
          return n;
        })();
        l.exports = function(i, n, d, v) {
          var b = s, m = v + d;
          i ^= -1;
          for (var f = v; f < m; f++) i = i >>> 8 ^ b[255 & (i ^ n[f])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, l, c) {
        var s, i = e("../utils/common"), n = e("./trees"), d = e("./adler32"), v = e("./crc32"), b = e("./messages"), m = 0, f = 4, h = 0, p = -2, a = -1, g = 4, u = 2, k = 8, R = 9, x = 286, A = 30, B = 19, I = 2 * x + 1, L = 15, T = 3, j = 258, K = j + T + 1, S = 42, P = 113, o = 1, N = 2, J = 3, $ = 4;
        function rt(r, F) {
          return r.msg = b[F], F;
        }
        function Y(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function D(r) {
          for (var F = r.length; 0 <= --F; ) r[F] = 0;
        }
        function z(r) {
          var F = r.state, O = F.pending;
          O > r.avail_out && (O = r.avail_out), O !== 0 && (i.arraySet(r.output, F.pending_buf, F.pending_out, O, r.next_out), r.next_out += O, F.pending_out += O, r.total_out += O, r.avail_out -= O, F.pending -= O, F.pending === 0 && (F.pending_out = 0));
        }
        function E(r, F) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, F), r.block_start = r.strstart, z(r.strm);
        }
        function Z(r, F) {
          r.pending_buf[r.pending++] = F;
        }
        function G(r, F) {
          r.pending_buf[r.pending++] = F >>> 8 & 255, r.pending_buf[r.pending++] = 255 & F;
        }
        function W(r, F) {
          var O, w, _ = r.max_chain_length, M = r.strstart, U = r.prev_length, X = r.nice_match, C = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, V = r.window, H = r.w_mask, q = r.prev, Q = r.strstart + j, ct = V[M + U - 1], at = V[M + U];
          r.prev_length >= r.good_match && (_ >>= 2), X > r.lookahead && (X = r.lookahead);
          do
            if (V[(O = F) + U] === at && V[O + U - 1] === ct && V[O] === V[M] && V[++O] === V[M + 1]) {
              M += 2, O++;
              do
                ;
              while (V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && V[++M] === V[++O] && M < Q);
              if (w = j - (Q - M), M = Q - j, U < w) {
                if (r.match_start = F, X <= (U = w)) break;
                ct = V[M + U - 1], at = V[M + U];
              }
            }
          while ((F = q[F & H]) > C && --_ != 0);
          return U <= r.lookahead ? U : r.lookahead;
        }
        function tt(r) {
          var F, O, w, _, M, U, X, C, V, H, q = r.w_size;
          do {
            if (_ = r.window_size - r.lookahead - r.strstart, r.strstart >= q + (q - K)) {
              for (i.arraySet(r.window, r.window, q, q, 0), r.match_start -= q, r.strstart -= q, r.block_start -= q, F = O = r.hash_size; w = r.head[--F], r.head[F] = q <= w ? w - q : 0, --O; ) ;
              for (F = O = q; w = r.prev[--F], r.prev[F] = q <= w ? w - q : 0, --O; ) ;
              _ += q;
            }
            if (r.strm.avail_in === 0) break;
            if (U = r.strm, X = r.window, C = r.strstart + r.lookahead, V = _, H = void 0, H = U.avail_in, V < H && (H = V), O = H === 0 ? 0 : (U.avail_in -= H, i.arraySet(X, U.input, U.next_in, H, C), U.state.wrap === 1 ? U.adler = d(U.adler, X, H, C) : U.state.wrap === 2 && (U.adler = v(U.adler, X, H, C)), U.next_in += H, U.total_in += H, H), r.lookahead += O, r.lookahead + r.insert >= T) for (M = r.strstart - r.insert, r.ins_h = r.window[M], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[M + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[M + T - 1]) & r.hash_mask, r.prev[M & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = M, M++, r.insert--, !(r.lookahead + r.insert < T)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function lt(r, F) {
          for (var O, w; ; ) {
            if (r.lookahead < K) {
              if (tt(r), r.lookahead < K && F === m) return o;
              if (r.lookahead === 0) break;
            }
            if (O = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), O !== 0 && r.strstart - O <= r.w_size - K && (r.match_length = W(r, O)), r.match_length >= T) if (w = n._tr_tally(r, r.strstart - r.match_start, r.match_length - T), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= T) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else w = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (w && (E(r, !1), r.strm.avail_out === 0)) return o;
          }
          return r.insert = r.strstart < T - 1 ? r.strstart : T - 1, F === f ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? o : N;
        }
        function et(r, F) {
          for (var O, w, _; ; ) {
            if (r.lookahead < K) {
              if (tt(r), r.lookahead < K && F === m) return o;
              if (r.lookahead === 0) break;
            }
            if (O = 0, r.lookahead >= T && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = T - 1, O !== 0 && r.prev_length < r.max_lazy_match && r.strstart - O <= r.w_size - K && (r.match_length = W(r, O), r.match_length <= 5 && (r.strategy === 1 || r.match_length === T && 4096 < r.strstart - r.match_start) && (r.match_length = T - 1)), r.prev_length >= T && r.match_length <= r.prev_length) {
              for (_ = r.strstart + r.lookahead - T, w = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - T), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= _ && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + T - 1]) & r.hash_mask, O = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = T - 1, r.strstart++, w && (E(r, !1), r.strm.avail_out === 0)) return o;
            } else if (r.match_available) {
              if ((w = n._tr_tally(r, 0, r.window[r.strstart - 1])) && E(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return o;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (w = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < T - 1 ? r.strstart : T - 1, F === f ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : r.last_lit && (E(r, !1), r.strm.avail_out === 0) ? o : N;
        }
        function it(r, F, O, w, _) {
          this.good_length = r, this.max_lazy = F, this.nice_length = O, this.max_chain = w, this.func = _;
        }
        function ot() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = k, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * I), this.dyn_dtree = new i.Buf16(2 * (2 * A + 1)), this.bl_tree = new i.Buf16(2 * (2 * B + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(L + 1), this.heap = new i.Buf16(2 * x + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * x + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function st(r) {
          var F;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = u, (F = r.state).pending = 0, F.pending_out = 0, F.wrap < 0 && (F.wrap = -F.wrap), F.status = F.wrap ? S : P, r.adler = F.wrap === 2 ? 0 : 1, F.last_flush = m, n._tr_init(F), h) : rt(r, p);
        }
        function nt(r) {
          var F = st(r);
          return F === h && (function(O) {
            O.window_size = 2 * O.w_size, D(O.head), O.max_lazy_match = s[O.level].max_lazy, O.good_match = s[O.level].good_length, O.nice_match = s[O.level].nice_length, O.max_chain_length = s[O.level].max_chain, O.strstart = 0, O.block_start = 0, O.lookahead = 0, O.insert = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, O.ins_h = 0;
          })(r.state), F;
        }
        function ut(r, F, O, w, _, M) {
          if (!r) return p;
          var U = 1;
          if (F === a && (F = 6), w < 0 ? (U = 0, w = -w) : 15 < w && (U = 2, w -= 16), _ < 1 || R < _ || O !== k || w < 8 || 15 < w || F < 0 || 9 < F || M < 0 || g < M) return rt(r, p);
          w === 8 && (w = 9);
          var X = new ot();
          return (r.state = X).strm = r, X.wrap = U, X.gzhead = null, X.w_bits = w, X.w_size = 1 << X.w_bits, X.w_mask = X.w_size - 1, X.hash_bits = _ + 7, X.hash_size = 1 << X.hash_bits, X.hash_mask = X.hash_size - 1, X.hash_shift = ~~((X.hash_bits + T - 1) / T), X.window = new i.Buf8(2 * X.w_size), X.head = new i.Buf16(X.hash_size), X.prev = new i.Buf16(X.w_size), X.lit_bufsize = 1 << _ + 6, X.pending_buf_size = 4 * X.lit_bufsize, X.pending_buf = new i.Buf8(X.pending_buf_size), X.d_buf = 1 * X.lit_bufsize, X.l_buf = 3 * X.lit_bufsize, X.level = F, X.strategy = M, X.method = O, nt(r);
        }
        s = [new it(0, 0, 0, 0, function(r, F) {
          var O = 65535;
          for (O > r.pending_buf_size - 5 && (O = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (tt(r), r.lookahead === 0 && F === m) return o;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var w = r.block_start + O;
            if ((r.strstart === 0 || r.strstart >= w) && (r.lookahead = r.strstart - w, r.strstart = w, E(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (E(r, !1), r.strm.avail_out === 0)) return o;
          }
          return r.insert = 0, F === f ? (E(r, !0), r.strm.avail_out === 0 ? J : $) : (r.strstart > r.block_start && (E(r, !1), r.strm.avail_out), o);
        }), new it(4, 4, 8, 4, lt), new it(4, 5, 16, 8, lt), new it(4, 6, 32, 32, lt), new it(4, 4, 16, 16, et), new it(8, 16, 32, 32, et), new it(8, 16, 128, 128, et), new it(8, 32, 128, 256, et), new it(32, 128, 258, 1024, et), new it(32, 258, 258, 4096, et)], c.deflateInit = function(r, F) {
          return ut(r, F, k, 15, 8, 0);
        }, c.deflateInit2 = ut, c.deflateReset = nt, c.deflateResetKeep = st, c.deflateSetHeader = function(r, F) {
          return r && r.state ? r.state.wrap !== 2 ? p : (r.state.gzhead = F, h) : p;
        }, c.deflate = function(r, F) {
          var O, w, _, M;
          if (!r || !r.state || 5 < F || F < 0) return r ? rt(r, p) : p;
          if (w = r.state, !r.output || !r.input && r.avail_in !== 0 || w.status === 666 && F !== f) return rt(r, r.avail_out === 0 ? -5 : p);
          if (w.strm = r, O = w.last_flush, w.last_flush = F, w.status === S) if (w.wrap === 2) r.adler = 0, Z(w, 31), Z(w, 139), Z(w, 8), w.gzhead ? (Z(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), Z(w, 255 & w.gzhead.time), Z(w, w.gzhead.time >> 8 & 255), Z(w, w.gzhead.time >> 16 & 255), Z(w, w.gzhead.time >> 24 & 255), Z(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), Z(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (Z(w, 255 & w.gzhead.extra.length), Z(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (r.adler = v(r.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (Z(w, 0), Z(w, 0), Z(w, 0), Z(w, 0), Z(w, 0), Z(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), Z(w, 3), w.status = P);
          else {
            var U = k + (w.w_bits - 8 << 4) << 8;
            U |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (U |= 32), U += 31 - U % 31, w.status = P, G(w, U), w.strstart !== 0 && (G(w, r.adler >>> 16), G(w, 65535 & r.adler)), r.adler = 1;
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
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && z(r), w.pending + 2 <= w.pending_buf_size && (Z(w, 255 & r.adler), Z(w, r.adler >> 8 & 255), r.adler = 0, w.status = P)) : w.status = P), w.pending !== 0) {
            if (z(r), r.avail_out === 0) return w.last_flush = -1, h;
          } else if (r.avail_in === 0 && Y(F) <= Y(O) && F !== f) return rt(r, -5);
          if (w.status === 666 && r.avail_in !== 0) return rt(r, -5);
          if (r.avail_in !== 0 || w.lookahead !== 0 || F !== m && w.status !== 666) {
            var X = w.strategy === 2 ? (function(C, V) {
              for (var H; ; ) {
                if (C.lookahead === 0 && (tt(C), C.lookahead === 0)) {
                  if (V === m) return o;
                  break;
                }
                if (C.match_length = 0, H = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, H && (E(C, !1), C.strm.avail_out === 0)) return o;
              }
              return C.insert = 0, V === f ? (E(C, !0), C.strm.avail_out === 0 ? J : $) : C.last_lit && (E(C, !1), C.strm.avail_out === 0) ? o : N;
            })(w, F) : w.strategy === 3 ? (function(C, V) {
              for (var H, q, Q, ct, at = C.window; ; ) {
                if (C.lookahead <= j) {
                  if (tt(C), C.lookahead <= j && V === m) return o;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= T && 0 < C.strstart && (q = at[Q = C.strstart - 1]) === at[++Q] && q === at[++Q] && q === at[++Q]) {
                  ct = C.strstart + j;
                  do
                    ;
                  while (q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && Q < ct);
                  C.match_length = j - (ct - Q), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= T ? (H = n._tr_tally(C, 1, C.match_length - T), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (H = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), H && (E(C, !1), C.strm.avail_out === 0)) return o;
              }
              return C.insert = 0, V === f ? (E(C, !0), C.strm.avail_out === 0 ? J : $) : C.last_lit && (E(C, !1), C.strm.avail_out === 0) ? o : N;
            })(w, F) : s[w.level].func(w, F);
            if (X !== J && X !== $ || (w.status = 666), X === o || X === J) return r.avail_out === 0 && (w.last_flush = -1), h;
            if (X === N && (F === 1 ? n._tr_align(w) : F !== 5 && (n._tr_stored_block(w, 0, 0, !1), F === 3 && (D(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), z(r), r.avail_out === 0)) return w.last_flush = -1, h;
          }
          return F !== f ? h : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (Z(w, 255 & r.adler), Z(w, r.adler >> 8 & 255), Z(w, r.adler >> 16 & 255), Z(w, r.adler >> 24 & 255), Z(w, 255 & r.total_in), Z(w, r.total_in >> 8 & 255), Z(w, r.total_in >> 16 & 255), Z(w, r.total_in >> 24 & 255)) : (G(w, r.adler >>> 16), G(w, 65535 & r.adler)), z(r), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? h : 1);
        }, c.deflateEnd = function(r) {
          var F;
          return r && r.state ? (F = r.state.status) !== S && F !== 69 && F !== 73 && F !== 91 && F !== 103 && F !== P && F !== 666 ? rt(r, p) : (r.state = null, F === P ? rt(r, -3) : h) : p;
        }, c.deflateSetDictionary = function(r, F) {
          var O, w, _, M, U, X, C, V, H = F.length;
          if (!r || !r.state || (M = (O = r.state).wrap) === 2 || M === 1 && O.status !== S || O.lookahead) return p;
          for (M === 1 && (r.adler = d(r.adler, F, H, 0)), O.wrap = 0, H >= O.w_size && (M === 0 && (D(O.head), O.strstart = 0, O.block_start = 0, O.insert = 0), V = new i.Buf8(O.w_size), i.arraySet(V, F, H - O.w_size, O.w_size, 0), F = V, H = O.w_size), U = r.avail_in, X = r.next_in, C = r.input, r.avail_in = H, r.next_in = 0, r.input = F, tt(O); O.lookahead >= T; ) {
            for (w = O.strstart, _ = O.lookahead - (T - 1); O.ins_h = (O.ins_h << O.hash_shift ^ O.window[w + T - 1]) & O.hash_mask, O.prev[w & O.w_mask] = O.head[O.ins_h], O.head[O.ins_h] = w, w++, --_; ) ;
            O.strstart = w, O.lookahead = T - 1, tt(O);
          }
          return O.strstart += O.lookahead, O.block_start = O.strstart, O.insert = O.lookahead, O.lookahead = 0, O.match_length = O.prev_length = T - 1, O.match_available = 0, r.next_in = X, r.input = C, r.avail_in = U, O.wrap = M, h;
        }, c.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, l, c) {
        l.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, l, c) {
        l.exports = function(s, i) {
          var n, d, v, b, m, f, h, p, a, g, u, k, R, x, A, B, I, L, T, j, K, S, P, o, N;
          n = s.state, d = s.next_in, o = s.input, v = d + (s.avail_in - 5), b = s.next_out, N = s.output, m = b - (i - s.avail_out), f = b + (s.avail_out - 257), h = n.dmax, p = n.wsize, a = n.whave, g = n.wnext, u = n.window, k = n.hold, R = n.bits, x = n.lencode, A = n.distcode, B = (1 << n.lenbits) - 1, I = (1 << n.distbits) - 1;
          t: do {
            R < 15 && (k += o[d++] << R, R += 8, k += o[d++] << R, R += 8), L = x[k & B];
            e: for (; ; ) {
              if (k >>>= T = L >>> 24, R -= T, (T = L >>> 16 & 255) === 0) N[b++] = 65535 & L;
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
                j = 65535 & L, (T &= 15) && (R < T && (k += o[d++] << R, R += 8), j += k & (1 << T) - 1, k >>>= T, R -= T), R < 15 && (k += o[d++] << R, R += 8, k += o[d++] << R, R += 8), L = A[k & I];
                r: for (; ; ) {
                  if (k >>>= T = L >>> 24, R -= T, !(16 & (T = L >>> 16 & 255))) {
                    if ((64 & T) == 0) {
                      L = A[(65535 & L) + (k & (1 << T) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, R < (T &= 15) && (k += o[d++] << R, (R += 8) < T && (k += o[d++] << R, R += 8)), h < (K += k & (1 << T) - 1)) {
                    s.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (k >>>= T, R -= T, (T = b - m) < K) {
                    if (a < (T = K - T) && n.sane) {
                      s.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (P = u, (S = 0) === g) {
                      if (S += p - T, T < j) {
                        for (j -= T; N[b++] = u[S++], --T; ) ;
                        S = b - K, P = N;
                      }
                    } else if (g < T) {
                      if (S += p + g - T, (T -= g) < j) {
                        for (j -= T; N[b++] = u[S++], --T; ) ;
                        if (S = 0, g < j) {
                          for (j -= T = g; N[b++] = u[S++], --T; ) ;
                          S = b - K, P = N;
                        }
                      }
                    } else if (S += g - T, T < j) {
                      for (j -= T; N[b++] = u[S++], --T; ) ;
                      S = b - K, P = N;
                    }
                    for (; 2 < j; ) N[b++] = P[S++], N[b++] = P[S++], N[b++] = P[S++], j -= 3;
                    j && (N[b++] = P[S++], 1 < j && (N[b++] = P[S++]));
                  } else {
                    for (S = b - K; N[b++] = N[S++], N[b++] = N[S++], N[b++] = N[S++], 2 < (j -= 3); ) ;
                    j && (N[b++] = N[S++], 1 < j && (N[b++] = N[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (d < v && b < f);
          d -= j = R >> 3, k &= (1 << (R -= j << 3)) - 1, s.next_in = d, s.next_out = b, s.avail_in = d < v ? v - d + 5 : 5 - (d - v), s.avail_out = b < f ? f - b + 257 : 257 - (b - f), n.hold = k, n.bits = R;
        };
      }, {}], 49: [function(e, l, c) {
        var s = e("../utils/common"), i = e("./adler32"), n = e("./crc32"), d = e("./inffast"), v = e("./inftrees"), b = 1, m = 2, f = 0, h = -2, p = 1, a = 852, g = 592;
        function u(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function k() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function R(S) {
          var P;
          return S && S.state ? (P = S.state, S.total_in = S.total_out = P.total = 0, S.msg = "", P.wrap && (S.adler = 1 & P.wrap), P.mode = p, P.last = 0, P.havedict = 0, P.dmax = 32768, P.head = null, P.hold = 0, P.bits = 0, P.lencode = P.lendyn = new s.Buf32(a), P.distcode = P.distdyn = new s.Buf32(g), P.sane = 1, P.back = -1, f) : h;
        }
        function x(S) {
          var P;
          return S && S.state ? ((P = S.state).wsize = 0, P.whave = 0, P.wnext = 0, R(S)) : h;
        }
        function A(S, P) {
          var o, N;
          return S && S.state ? (N = S.state, P < 0 ? (o = 0, P = -P) : (o = 1 + (P >> 4), P < 48 && (P &= 15)), P && (P < 8 || 15 < P) ? h : (N.window !== null && N.wbits !== P && (N.window = null), N.wrap = o, N.wbits = P, x(S))) : h;
        }
        function B(S, P) {
          var o, N;
          return S ? (N = new k(), (S.state = N).window = null, (o = A(S, P)) !== f && (S.state = null), o) : h;
        }
        var I, L, T = !0;
        function j(S) {
          if (T) {
            var P;
            for (I = new s.Buf32(512), L = new s.Buf32(32), P = 0; P < 144; ) S.lens[P++] = 8;
            for (; P < 256; ) S.lens[P++] = 9;
            for (; P < 280; ) S.lens[P++] = 7;
            for (; P < 288; ) S.lens[P++] = 8;
            for (v(b, S.lens, 0, 288, I, 0, S.work, { bits: 9 }), P = 0; P < 32; ) S.lens[P++] = 5;
            v(m, S.lens, 0, 32, L, 0, S.work, { bits: 5 }), T = !1;
          }
          S.lencode = I, S.lenbits = 9, S.distcode = L, S.distbits = 5;
        }
        function K(S, P, o, N) {
          var J, $ = S.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new s.Buf8($.wsize)), N >= $.wsize ? (s.arraySet($.window, P, o - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (N < (J = $.wsize - $.wnext) && (J = N), s.arraySet($.window, P, o - N, J, $.wnext), (N -= J) ? (s.arraySet($.window, P, o - N, N, 0), $.wnext = N, $.whave = $.wsize) : ($.wnext += J, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += J))), 0;
        }
        c.inflateReset = x, c.inflateReset2 = A, c.inflateResetKeep = R, c.inflateInit = function(S) {
          return B(S, 15);
        }, c.inflateInit2 = B, c.inflate = function(S, P) {
          var o, N, J, $, rt, Y, D, z, E, Z, G, W, tt, lt, et, it, ot, st, nt, ut, r, F, O, w, _ = 0, M = new s.Buf8(4), U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return h;
          (o = S.state).mode === 12 && (o.mode = 13), rt = S.next_out, J = S.output, D = S.avail_out, $ = S.next_in, N = S.input, Y = S.avail_in, z = o.hold, E = o.bits, Z = Y, G = D, F = f;
          t: for (; ; ) switch (o.mode) {
            case p:
              if (o.wrap === 0) {
                o.mode = 13;
                break;
              }
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if (2 & o.wrap && z === 35615) {
                M[o.check = 0] = 255 & z, M[1] = z >>> 8 & 255, o.check = n(o.check, M, 2, 0), E = z = 0, o.mode = 2;
                break;
              }
              if (o.flags = 0, o.head && (o.head.done = !1), !(1 & o.wrap) || (((255 & z) << 8) + (z >> 8)) % 31) {
                S.msg = "incorrect header check", o.mode = 30;
                break;
              }
              if ((15 & z) != 8) {
                S.msg = "unknown compression method", o.mode = 30;
                break;
              }
              if (E -= 4, r = 8 + (15 & (z >>>= 4)), o.wbits === 0) o.wbits = r;
              else if (r > o.wbits) {
                S.msg = "invalid window size", o.mode = 30;
                break;
              }
              o.dmax = 1 << r, S.adler = o.check = 1, o.mode = 512 & z ? 10 : 12, E = z = 0;
              break;
            case 2:
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if (o.flags = z, (255 & o.flags) != 8) {
                S.msg = "unknown compression method", o.mode = 30;
                break;
              }
              if (57344 & o.flags) {
                S.msg = "unknown header flags set", o.mode = 30;
                break;
              }
              o.head && (o.head.text = z >> 8 & 1), 512 & o.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, o.check = n(o.check, M, 2, 0)), E = z = 0, o.mode = 3;
            case 3:
              for (; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              o.head && (o.head.time = z), 512 & o.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, M[2] = z >>> 16 & 255, M[3] = z >>> 24 & 255, o.check = n(o.check, M, 4, 0)), E = z = 0, o.mode = 4;
            case 4:
              for (; E < 16; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              o.head && (o.head.xflags = 255 & z, o.head.os = z >> 8), 512 & o.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, o.check = n(o.check, M, 2, 0)), E = z = 0, o.mode = 5;
            case 5:
              if (1024 & o.flags) {
                for (; E < 16; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                o.length = z, o.head && (o.head.extra_len = z), 512 & o.flags && (M[0] = 255 & z, M[1] = z >>> 8 & 255, o.check = n(o.check, M, 2, 0)), E = z = 0;
              } else o.head && (o.head.extra = null);
              o.mode = 6;
            case 6:
              if (1024 & o.flags && (Y < (W = o.length) && (W = Y), W && (o.head && (r = o.head.extra_len - o.length, o.head.extra || (o.head.extra = new Array(o.head.extra_len)), s.arraySet(o.head.extra, N, $, W, r)), 512 & o.flags && (o.check = n(o.check, N, W, $)), Y -= W, $ += W, o.length -= W), o.length)) break t;
              o.length = 0, o.mode = 7;
            case 7:
              if (2048 & o.flags) {
                if (Y === 0) break t;
                for (W = 0; r = N[$ + W++], o.head && r && o.length < 65536 && (o.head.name += String.fromCharCode(r)), r && W < Y; ) ;
                if (512 & o.flags && (o.check = n(o.check, N, W, $)), Y -= W, $ += W, r) break t;
              } else o.head && (o.head.name = null);
              o.length = 0, o.mode = 8;
            case 8:
              if (4096 & o.flags) {
                if (Y === 0) break t;
                for (W = 0; r = N[$ + W++], o.head && r && o.length < 65536 && (o.head.comment += String.fromCharCode(r)), r && W < Y; ) ;
                if (512 & o.flags && (o.check = n(o.check, N, W, $)), Y -= W, $ += W, r) break t;
              } else o.head && (o.head.comment = null);
              o.mode = 9;
            case 9:
              if (512 & o.flags) {
                for (; E < 16; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                if (z !== (65535 & o.check)) {
                  S.msg = "header crc mismatch", o.mode = 30;
                  break;
                }
                E = z = 0;
              }
              o.head && (o.head.hcrc = o.flags >> 9 & 1, o.head.done = !0), S.adler = o.check = 0, o.mode = 12;
              break;
            case 10:
              for (; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              S.adler = o.check = u(z), E = z = 0, o.mode = 11;
            case 11:
              if (o.havedict === 0) return S.next_out = rt, S.avail_out = D, S.next_in = $, S.avail_in = Y, o.hold = z, o.bits = E, 2;
              S.adler = o.check = 1, o.mode = 12;
            case 12:
              if (P === 5 || P === 6) break t;
            case 13:
              if (o.last) {
                z >>>= 7 & E, E -= 7 & E, o.mode = 27;
                break;
              }
              for (; E < 3; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              switch (o.last = 1 & z, E -= 1, 3 & (z >>>= 1)) {
                case 0:
                  o.mode = 14;
                  break;
                case 1:
                  if (j(o), o.mode = 20, P !== 6) break;
                  z >>>= 2, E -= 2;
                  break t;
                case 2:
                  o.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", o.mode = 30;
              }
              z >>>= 2, E -= 2;
              break;
            case 14:
              for (z >>>= 7 & E, E -= 7 & E; E < 32; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if ((65535 & z) != (z >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", o.mode = 30;
                break;
              }
              if (o.length = 65535 & z, E = z = 0, o.mode = 15, P === 6) break t;
            case 15:
              o.mode = 16;
            case 16:
              if (W = o.length) {
                if (Y < W && (W = Y), D < W && (W = D), W === 0) break t;
                s.arraySet(J, N, $, W, rt), Y -= W, $ += W, D -= W, rt += W, o.length -= W;
                break;
              }
              o.mode = 12;
              break;
            case 17:
              for (; E < 14; ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if (o.nlen = 257 + (31 & z), z >>>= 5, E -= 5, o.ndist = 1 + (31 & z), z >>>= 5, E -= 5, o.ncode = 4 + (15 & z), z >>>= 4, E -= 4, 286 < o.nlen || 30 < o.ndist) {
                S.msg = "too many length or distance symbols", o.mode = 30;
                break;
              }
              o.have = 0, o.mode = 18;
            case 18:
              for (; o.have < o.ncode; ) {
                for (; E < 3; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                o.lens[U[o.have++]] = 7 & z, z >>>= 3, E -= 3;
              }
              for (; o.have < 19; ) o.lens[U[o.have++]] = 0;
              if (o.lencode = o.lendyn, o.lenbits = 7, O = { bits: o.lenbits }, F = v(0, o.lens, 0, 19, o.lencode, 0, o.work, O), o.lenbits = O.bits, F) {
                S.msg = "invalid code lengths set", o.mode = 30;
                break;
              }
              o.have = 0, o.mode = 19;
            case 19:
              for (; o.have < o.nlen + o.ndist; ) {
                for (; it = (_ = o.lencode[z & (1 << o.lenbits) - 1]) >>> 16 & 255, ot = 65535 & _, !((et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                if (ot < 16) z >>>= et, E -= et, o.lens[o.have++] = ot;
                else {
                  if (ot === 16) {
                    for (w = et + 2; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += N[$++] << E, E += 8;
                    }
                    if (z >>>= et, E -= et, o.have === 0) {
                      S.msg = "invalid bit length repeat", o.mode = 30;
                      break;
                    }
                    r = o.lens[o.have - 1], W = 3 + (3 & z), z >>>= 2, E -= 2;
                  } else if (ot === 17) {
                    for (w = et + 3; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += N[$++] << E, E += 8;
                    }
                    E -= et, r = 0, W = 3 + (7 & (z >>>= et)), z >>>= 3, E -= 3;
                  } else {
                    for (w = et + 7; E < w; ) {
                      if (Y === 0) break t;
                      Y--, z += N[$++] << E, E += 8;
                    }
                    E -= et, r = 0, W = 11 + (127 & (z >>>= et)), z >>>= 7, E -= 7;
                  }
                  if (o.have + W > o.nlen + o.ndist) {
                    S.msg = "invalid bit length repeat", o.mode = 30;
                    break;
                  }
                  for (; W--; ) o.lens[o.have++] = r;
                }
              }
              if (o.mode === 30) break;
              if (o.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", o.mode = 30;
                break;
              }
              if (o.lenbits = 9, O = { bits: o.lenbits }, F = v(b, o.lens, 0, o.nlen, o.lencode, 0, o.work, O), o.lenbits = O.bits, F) {
                S.msg = "invalid literal/lengths set", o.mode = 30;
                break;
              }
              if (o.distbits = 6, o.distcode = o.distdyn, O = { bits: o.distbits }, F = v(m, o.lens, o.nlen, o.ndist, o.distcode, 0, o.work, O), o.distbits = O.bits, F) {
                S.msg = "invalid distances set", o.mode = 30;
                break;
              }
              if (o.mode = 20, P === 6) break t;
            case 20:
              o.mode = 21;
            case 21:
              if (6 <= Y && 258 <= D) {
                S.next_out = rt, S.avail_out = D, S.next_in = $, S.avail_in = Y, o.hold = z, o.bits = E, d(S, G), rt = S.next_out, J = S.output, D = S.avail_out, $ = S.next_in, N = S.input, Y = S.avail_in, z = o.hold, E = o.bits, o.mode === 12 && (o.back = -1);
                break;
              }
              for (o.back = 0; it = (_ = o.lencode[z & (1 << o.lenbits) - 1]) >>> 16 & 255, ot = 65535 & _, !((et = _ >>> 24) <= E); ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if (it && (240 & it) == 0) {
                for (st = et, nt = it, ut = ot; it = (_ = o.lencode[ut + ((z & (1 << st + nt) - 1) >> st)]) >>> 16 & 255, ot = 65535 & _, !(st + (et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                z >>>= st, E -= st, o.back += st;
              }
              if (z >>>= et, E -= et, o.back += et, o.length = ot, it === 0) {
                o.mode = 26;
                break;
              }
              if (32 & it) {
                o.back = -1, o.mode = 12;
                break;
              }
              if (64 & it) {
                S.msg = "invalid literal/length code", o.mode = 30;
                break;
              }
              o.extra = 15 & it, o.mode = 22;
            case 22:
              if (o.extra) {
                for (w = o.extra; E < w; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                o.length += z & (1 << o.extra) - 1, z >>>= o.extra, E -= o.extra, o.back += o.extra;
              }
              o.was = o.length, o.mode = 23;
            case 23:
              for (; it = (_ = o.distcode[z & (1 << o.distbits) - 1]) >>> 16 & 255, ot = 65535 & _, !((et = _ >>> 24) <= E); ) {
                if (Y === 0) break t;
                Y--, z += N[$++] << E, E += 8;
              }
              if ((240 & it) == 0) {
                for (st = et, nt = it, ut = ot; it = (_ = o.distcode[ut + ((z & (1 << st + nt) - 1) >> st)]) >>> 16 & 255, ot = 65535 & _, !(st + (et = _ >>> 24) <= E); ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                z >>>= st, E -= st, o.back += st;
              }
              if (z >>>= et, E -= et, o.back += et, 64 & it) {
                S.msg = "invalid distance code", o.mode = 30;
                break;
              }
              o.offset = ot, o.extra = 15 & it, o.mode = 24;
            case 24:
              if (o.extra) {
                for (w = o.extra; E < w; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                o.offset += z & (1 << o.extra) - 1, z >>>= o.extra, E -= o.extra, o.back += o.extra;
              }
              if (o.offset > o.dmax) {
                S.msg = "invalid distance too far back", o.mode = 30;
                break;
              }
              o.mode = 25;
            case 25:
              if (D === 0) break t;
              if (W = G - D, o.offset > W) {
                if ((W = o.offset - W) > o.whave && o.sane) {
                  S.msg = "invalid distance too far back", o.mode = 30;
                  break;
                }
                tt = W > o.wnext ? (W -= o.wnext, o.wsize - W) : o.wnext - W, W > o.length && (W = o.length), lt = o.window;
              } else lt = J, tt = rt - o.offset, W = o.length;
              for (D < W && (W = D), D -= W, o.length -= W; J[rt++] = lt[tt++], --W; ) ;
              o.length === 0 && (o.mode = 21);
              break;
            case 26:
              if (D === 0) break t;
              J[rt++] = o.length, D--, o.mode = 21;
              break;
            case 27:
              if (o.wrap) {
                for (; E < 32; ) {
                  if (Y === 0) break t;
                  Y--, z |= N[$++] << E, E += 8;
                }
                if (G -= D, S.total_out += G, o.total += G, G && (S.adler = o.check = o.flags ? n(o.check, J, G, rt - G) : i(o.check, J, G, rt - G)), G = D, (o.flags ? z : u(z)) !== o.check) {
                  S.msg = "incorrect data check", o.mode = 30;
                  break;
                }
                E = z = 0;
              }
              o.mode = 28;
            case 28:
              if (o.wrap && o.flags) {
                for (; E < 32; ) {
                  if (Y === 0) break t;
                  Y--, z += N[$++] << E, E += 8;
                }
                if (z !== (4294967295 & o.total)) {
                  S.msg = "incorrect length check", o.mode = 30;
                  break;
                }
                E = z = 0;
              }
              o.mode = 29;
            case 29:
              F = 1;
              break t;
            case 30:
              F = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return h;
          }
          return S.next_out = rt, S.avail_out = D, S.next_in = $, S.avail_in = Y, o.hold = z, o.bits = E, (o.wsize || G !== S.avail_out && o.mode < 30 && (o.mode < 27 || P !== 4)) && K(S, S.output, S.next_out, G - S.avail_out) ? (o.mode = 31, -4) : (Z -= S.avail_in, G -= S.avail_out, S.total_in += Z, S.total_out += G, o.total += G, o.wrap && G && (S.adler = o.check = o.flags ? n(o.check, J, G, S.next_out - G) : i(o.check, J, G, S.next_out - G)), S.data_type = o.bits + (o.last ? 64 : 0) + (o.mode === 12 ? 128 : 0) + (o.mode === 20 || o.mode === 15 ? 256 : 0), (Z == 0 && G === 0 || P === 4) && F === f && (F = -5), F);
        }, c.inflateEnd = function(S) {
          if (!S || !S.state) return h;
          var P = S.state;
          return P.window && (P.window = null), S.state = null, f;
        }, c.inflateGetHeader = function(S, P) {
          var o;
          return S && S.state ? (2 & (o = S.state).wrap) == 0 ? h : ((o.head = P).done = !1, f) : h;
        }, c.inflateSetDictionary = function(S, P) {
          var o, N = P.length;
          return S && S.state ? (o = S.state).wrap !== 0 && o.mode !== 11 ? h : o.mode === 11 && i(1, P, N, 0) !== o.check ? -3 : K(S, P, N, N) ? (o.mode = 31, -4) : (o.havedict = 1, f) : h;
        }, c.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, l, c) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], d = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        l.exports = function(b, m, f, h, p, a, g, u) {
          var k, R, x, A, B, I, L, T, j, K = u.bits, S = 0, P = 0, o = 0, N = 0, J = 0, $ = 0, rt = 0, Y = 0, D = 0, z = 0, E = null, Z = 0, G = new s.Buf16(16), W = new s.Buf16(16), tt = null, lt = 0;
          for (S = 0; S <= 15; S++) G[S] = 0;
          for (P = 0; P < h; P++) G[m[f + P]]++;
          for (J = K, N = 15; 1 <= N && G[N] === 0; N--) ;
          if (N < J && (J = N), N === 0) return p[a++] = 20971520, p[a++] = 20971520, u.bits = 1, 0;
          for (o = 1; o < N && G[o] === 0; o++) ;
          for (J < o && (J = o), S = Y = 1; S <= 15; S++) if (Y <<= 1, (Y -= G[S]) < 0) return -1;
          if (0 < Y && (b === 0 || N !== 1)) return -1;
          for (W[1] = 0, S = 1; S < 15; S++) W[S + 1] = W[S] + G[S];
          for (P = 0; P < h; P++) m[f + P] !== 0 && (g[W[m[f + P]]++] = P);
          if (I = b === 0 ? (E = tt = g, 19) : b === 1 ? (E = i, Z -= 257, tt = n, lt -= 257, 256) : (E = d, tt = v, -1), S = o, B = a, rt = P = z = 0, x = -1, A = (D = 1 << ($ = J)) - 1, b === 1 && 852 < D || b === 2 && 592 < D) return 1;
          for (; ; ) {
            for (L = S - rt, j = g[P] < I ? (T = 0, g[P]) : g[P] > I ? (T = tt[lt + g[P]], E[Z + g[P]]) : (T = 96, 0), k = 1 << S - rt, o = R = 1 << $; p[B + (z >> rt) + (R -= k)] = L << 24 | T << 16 | j | 0, R !== 0; ) ;
            for (k = 1 << S - 1; z & k; ) k >>= 1;
            if (k !== 0 ? (z &= k - 1, z += k) : z = 0, P++, --G[S] == 0) {
              if (S === N) break;
              S = m[f + g[P]];
            }
            if (J < S && (z & A) !== x) {
              for (rt === 0 && (rt = J), B += o, Y = 1 << ($ = S - rt); $ + rt < N && !((Y -= G[$ + rt]) <= 0); ) $++, Y <<= 1;
              if (D += 1 << $, b === 1 && 852 < D || b === 2 && 592 < D) return 1;
              p[x = z & A] = J << 24 | $ << 16 | B - a | 0;
            }
          }
          return z !== 0 && (p[B + z] = S - rt << 24 | 64 << 16 | 0), u.bits = J, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, l, c) {
        l.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, l, c) {
        var s = e("../utils/common"), i = 0, n = 1;
        function d(_) {
          for (var M = _.length; 0 <= --M; ) _[M] = 0;
        }
        var v = 0, b = 29, m = 256, f = m + 1 + b, h = 30, p = 19, a = 2 * f + 1, g = 15, u = 16, k = 7, R = 256, x = 16, A = 17, B = 18, I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (f + 2));
        d(K);
        var S = new Array(2 * h);
        d(S);
        var P = new Array(512);
        d(P);
        var o = new Array(256);
        d(o);
        var N = new Array(b);
        d(N);
        var J, $, rt, Y = new Array(h);
        function D(_, M, U, X, C) {
          this.static_tree = _, this.extra_bits = M, this.extra_base = U, this.elems = X, this.max_length = C, this.has_stree = _ && _.length;
        }
        function z(_, M) {
          this.dyn_tree = _, this.max_code = 0, this.stat_desc = M;
        }
        function E(_) {
          return _ < 256 ? P[_] : P[256 + (_ >>> 7)];
        }
        function Z(_, M) {
          _.pending_buf[_.pending++] = 255 & M, _.pending_buf[_.pending++] = M >>> 8 & 255;
        }
        function G(_, M, U) {
          _.bi_valid > u - U ? (_.bi_buf |= M << _.bi_valid & 65535, Z(_, _.bi_buf), _.bi_buf = M >> u - _.bi_valid, _.bi_valid += U - u) : (_.bi_buf |= M << _.bi_valid & 65535, _.bi_valid += U);
        }
        function W(_, M, U) {
          G(_, U[2 * M], U[2 * M + 1]);
        }
        function tt(_, M) {
          for (var U = 0; U |= 1 & _, _ >>>= 1, U <<= 1, 0 < --M; ) ;
          return U >>> 1;
        }
        function lt(_, M, U) {
          var X, C, V = new Array(g + 1), H = 0;
          for (X = 1; X <= g; X++) V[X] = H = H + U[X - 1] << 1;
          for (C = 0; C <= M; C++) {
            var q = _[2 * C + 1];
            q !== 0 && (_[2 * C] = tt(V[q]++, q));
          }
        }
        function et(_) {
          var M;
          for (M = 0; M < f; M++) _.dyn_ltree[2 * M] = 0;
          for (M = 0; M < h; M++) _.dyn_dtree[2 * M] = 0;
          for (M = 0; M < p; M++) _.bl_tree[2 * M] = 0;
          _.dyn_ltree[2 * R] = 1, _.opt_len = _.static_len = 0, _.last_lit = _.matches = 0;
        }
        function it(_) {
          8 < _.bi_valid ? Z(_, _.bi_buf) : 0 < _.bi_valid && (_.pending_buf[_.pending++] = _.bi_buf), _.bi_buf = 0, _.bi_valid = 0;
        }
        function ot(_, M, U, X) {
          var C = 2 * M, V = 2 * U;
          return _[C] < _[V] || _[C] === _[V] && X[M] <= X[U];
        }
        function st(_, M, U) {
          for (var X = _.heap[U], C = U << 1; C <= _.heap_len && (C < _.heap_len && ot(M, _.heap[C + 1], _.heap[C], _.depth) && C++, !ot(M, X, _.heap[C], _.depth)); ) _.heap[U] = _.heap[C], U = C, C <<= 1;
          _.heap[U] = X;
        }
        function nt(_, M, U) {
          var X, C, V, H, q = 0;
          if (_.last_lit !== 0) for (; X = _.pending_buf[_.d_buf + 2 * q] << 8 | _.pending_buf[_.d_buf + 2 * q + 1], C = _.pending_buf[_.l_buf + q], q++, X === 0 ? W(_, C, M) : (W(_, (V = o[C]) + m + 1, M), (H = I[V]) !== 0 && G(_, C -= N[V], H), W(_, V = E(--X), U), (H = L[V]) !== 0 && G(_, X -= Y[V], H)), q < _.last_lit; ) ;
          W(_, R, M);
        }
        function ut(_, M) {
          var U, X, C, V = M.dyn_tree, H = M.stat_desc.static_tree, q = M.stat_desc.has_stree, Q = M.stat_desc.elems, ct = -1;
          for (_.heap_len = 0, _.heap_max = a, U = 0; U < Q; U++) V[2 * U] !== 0 ? (_.heap[++_.heap_len] = ct = U, _.depth[U] = 0) : V[2 * U + 1] = 0;
          for (; _.heap_len < 2; ) V[2 * (C = _.heap[++_.heap_len] = ct < 2 ? ++ct : 0)] = 1, _.depth[C] = 0, _.opt_len--, q && (_.static_len -= H[2 * C + 1]);
          for (M.max_code = ct, U = _.heap_len >> 1; 1 <= U; U--) st(_, V, U);
          for (C = Q; U = _.heap[1], _.heap[1] = _.heap[_.heap_len--], st(_, V, 1), X = _.heap[1], _.heap[--_.heap_max] = U, _.heap[--_.heap_max] = X, V[2 * C] = V[2 * U] + V[2 * X], _.depth[C] = (_.depth[U] >= _.depth[X] ? _.depth[U] : _.depth[X]) + 1, V[2 * U + 1] = V[2 * X + 1] = C, _.heap[1] = C++, st(_, V, 1), 2 <= _.heap_len; ) ;
          _.heap[--_.heap_max] = _.heap[1], (function(at, mt) {
            var At, yt, Et, dt, Tt, Ft, _t = mt.dyn_tree, Wt = mt.max_code, ae = mt.stat_desc.static_tree, oe = mt.stat_desc.has_stree, le = mt.stat_desc.extra_bits, jt = mt.stat_desc.extra_base, zt = mt.stat_desc.max_length, Ot = 0;
            for (dt = 0; dt <= g; dt++) at.bl_count[dt] = 0;
            for (_t[2 * at.heap[at.heap_max] + 1] = 0, At = at.heap_max + 1; At < a; At++) zt < (dt = _t[2 * _t[2 * (yt = at.heap[At]) + 1] + 1] + 1) && (dt = zt, Ot++), _t[2 * yt + 1] = dt, Wt < yt || (at.bl_count[dt]++, Tt = 0, jt <= yt && (Tt = le[yt - jt]), Ft = _t[2 * yt], at.opt_len += Ft * (dt + Tt), oe && (at.static_len += Ft * (ae[2 * yt + 1] + Tt)));
            if (Ot !== 0) {
              do {
                for (dt = zt - 1; at.bl_count[dt] === 0; ) dt--;
                at.bl_count[dt]--, at.bl_count[dt + 1] += 2, at.bl_count[zt]--, Ot -= 2;
              } while (0 < Ot);
              for (dt = zt; dt !== 0; dt--) for (yt = at.bl_count[dt]; yt !== 0; ) Wt < (Et = at.heap[--At]) || (_t[2 * Et + 1] !== dt && (at.opt_len += (dt - _t[2 * Et + 1]) * _t[2 * Et], _t[2 * Et + 1] = dt), yt--);
            }
          })(_, M), lt(V, ct, _.bl_count);
        }
        function r(_, M, U) {
          var X, C, V = -1, H = M[1], q = 0, Q = 7, ct = 4;
          for (H === 0 && (Q = 138, ct = 3), M[2 * (U + 1) + 1] = 65535, X = 0; X <= U; X++) C = H, H = M[2 * (X + 1) + 1], ++q < Q && C === H || (q < ct ? _.bl_tree[2 * C] += q : C !== 0 ? (C !== V && _.bl_tree[2 * C]++, _.bl_tree[2 * x]++) : q <= 10 ? _.bl_tree[2 * A]++ : _.bl_tree[2 * B]++, V = C, ct = (q = 0) === H ? (Q = 138, 3) : C === H ? (Q = 6, 3) : (Q = 7, 4));
        }
        function F(_, M, U) {
          var X, C, V = -1, H = M[1], q = 0, Q = 7, ct = 4;
          for (H === 0 && (Q = 138, ct = 3), X = 0; X <= U; X++) if (C = H, H = M[2 * (X + 1) + 1], !(++q < Q && C === H)) {
            if (q < ct) for (; W(_, C, _.bl_tree), --q != 0; ) ;
            else C !== 0 ? (C !== V && (W(_, C, _.bl_tree), q--), W(_, x, _.bl_tree), G(_, q - 3, 2)) : q <= 10 ? (W(_, A, _.bl_tree), G(_, q - 3, 3)) : (W(_, B, _.bl_tree), G(_, q - 11, 7));
            V = C, ct = (q = 0) === H ? (Q = 138, 3) : C === H ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        d(Y);
        var O = !1;
        function w(_, M, U, X) {
          G(_, (v << 1) + (X ? 1 : 0), 3), (function(C, V, H, q) {
            it(C), Z(C, H), Z(C, ~H), s.arraySet(C.pending_buf, C.window, V, H, C.pending), C.pending += H;
          })(_, M, U);
        }
        c._tr_init = function(_) {
          O || ((function() {
            var M, U, X, C, V, H = new Array(g + 1);
            for (C = X = 0; C < b - 1; C++) for (N[C] = X, M = 0; M < 1 << I[C]; M++) o[X++] = C;
            for (o[X - 1] = C, C = V = 0; C < 16; C++) for (Y[C] = V, M = 0; M < 1 << L[C]; M++) P[V++] = C;
            for (V >>= 7; C < h; C++) for (Y[C] = V << 7, M = 0; M < 1 << L[C] - 7; M++) P[256 + V++] = C;
            for (U = 0; U <= g; U++) H[U] = 0;
            for (M = 0; M <= 143; ) K[2 * M + 1] = 8, M++, H[8]++;
            for (; M <= 255; ) K[2 * M + 1] = 9, M++, H[9]++;
            for (; M <= 279; ) K[2 * M + 1] = 7, M++, H[7]++;
            for (; M <= 287; ) K[2 * M + 1] = 8, M++, H[8]++;
            for (lt(K, f + 1, H), M = 0; M < h; M++) S[2 * M + 1] = 5, S[2 * M] = tt(M, 5);
            J = new D(K, I, m + 1, f, g), $ = new D(S, L, 0, h, g), rt = new D(new Array(0), T, 0, p, k);
          })(), O = !0), _.l_desc = new z(_.dyn_ltree, J), _.d_desc = new z(_.dyn_dtree, $), _.bl_desc = new z(_.bl_tree, rt), _.bi_buf = 0, _.bi_valid = 0, et(_);
        }, c._tr_stored_block = w, c._tr_flush_block = function(_, M, U, X) {
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
          })(_), C = _.opt_len + 3 + 7 >>> 3, (V = _.static_len + 3 + 7 >>> 3) <= C && (C = V)) : C = V = U + 5, U + 4 <= C && M !== -1 ? w(_, M, U, X) : _.strategy === 4 || V === C ? (G(_, 2 + (X ? 1 : 0), 3), nt(_, K, S)) : (G(_, 4 + (X ? 1 : 0), 3), (function(q, Q, ct, at) {
            var mt;
            for (G(q, Q - 257, 5), G(q, ct - 1, 5), G(q, at - 4, 4), mt = 0; mt < at; mt++) G(q, q.bl_tree[2 * j[mt] + 1], 3);
            F(q, q.dyn_ltree, Q - 1), F(q, q.dyn_dtree, ct - 1);
          })(_, _.l_desc.max_code + 1, _.d_desc.max_code + 1, H + 1), nt(_, _.dyn_ltree, _.dyn_dtree)), et(_), X && it(_);
        }, c._tr_tally = function(_, M, U) {
          return _.pending_buf[_.d_buf + 2 * _.last_lit] = M >>> 8 & 255, _.pending_buf[_.d_buf + 2 * _.last_lit + 1] = 255 & M, _.pending_buf[_.l_buf + _.last_lit] = 255 & U, _.last_lit++, M === 0 ? _.dyn_ltree[2 * U]++ : (_.matches++, M--, _.dyn_ltree[2 * (o[U] + m + 1)]++, _.dyn_dtree[2 * E(M)]++), _.last_lit === _.lit_bufsize - 1;
        }, c._tr_align = function(_) {
          G(_, 2, 3), W(_, R, K), (function(M) {
            M.bi_valid === 16 ? (Z(M, M.bi_buf), M.bi_buf = 0, M.bi_valid = 0) : 8 <= M.bi_valid && (M.pending_buf[M.pending++] = 255 & M.bi_buf, M.bi_buf >>= 8, M.bi_valid -= 8);
          })(_);
        };
      }, { "../utils/common": 41 }], 53: [function(e, l, c) {
        l.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, l, c) {
        (function(s) {
          (function(i, n) {
            if (!i.setImmediate) {
              var d, v, b, m, f = 1, h = {}, p = !1, a = i.document, g = Object.getPrototypeOf && Object.getPrototypeOf(i);
              g = g && g.setTimeout ? g : i, d = {}.toString.call(i.process) === "[object process]" ? function(x) {
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
              })() ? (m = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", R, !1) : i.attachEvent("onmessage", R), function(x) {
                i.postMessage(m + x, "*");
              }) : i.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(x) {
                k(x.data);
              }, function(x) {
                b.port2.postMessage(x);
              }) : a && "onreadystatechange" in a.createElement("script") ? (v = a.documentElement, function(x) {
                var A = a.createElement("script");
                A.onreadystatechange = function() {
                  k(x), A.onreadystatechange = null, v.removeChild(A), A = null;
                }, v.appendChild(A);
              }) : function(x) {
                setTimeout(k, 0, x);
              }, g.setImmediate = function(x) {
                typeof x != "function" && (x = new Function("" + x));
                for (var A = new Array(arguments.length - 1), B = 0; B < A.length; B++) A[B] = arguments[B + 1];
                var I = { callback: x, args: A };
                return h[f] = I, d(f), f++;
              }, g.clearImmediate = u;
            }
            function u(x) {
              delete h[x];
            }
            function k(x) {
              if (p) setTimeout(k, 0, x);
              else {
                var A = h[x];
                if (A) {
                  p = !0;
                  try {
                    (function(B) {
                      var I = B.callback, L = B.args;
                      switch (L.length) {
                        case 0:
                          I();
                          break;
                        case 1:
                          I(L[0]);
                          break;
                        case 2:
                          I(L[0], L[1]);
                          break;
                        case 3:
                          I(L[0], L[1], L[2]);
                          break;
                        default:
                          I.apply(n, L);
                      }
                    })(A);
                  } finally {
                    u(x), p = !1;
                  }
                }
              }
            }
            function R(x) {
              x.source === i && typeof x.data == "string" && x.data.indexOf(m) === 0 && k(+x.data.slice(m.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Nt)), Nt.exports;
}
var de = he();
const Jt = /* @__PURE__ */ ce(de);
async function ue(y) {
  const t = await fe(y), e = await Jt.loadAsync(t), l = [];
  return e.forEach((c, s) => {
    if (s.dir)
      return;
    const i = me(c);
    l.push({
      name: i,
      text: () => s.async("text"),
      arrayBuffer: () => s.async("arraybuffer")
    });
  }), l;
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
function ge(y) {
  return y instanceof Uint8Array ? y : new Uint8Array(y);
}
function ye(y) {
  return y.byteOffset === 0 && y.byteLength === y.buffer.byteLength ? y.buffer : y.slice().buffer;
}
function xt(y, t, e = 0) {
  if (y.length < e + t.length) return !1;
  for (let l = 0; l < t.length; l++)
    if (y[e + l] !== t[l]) return !1;
  return !0;
}
function _e(y) {
  return xt(y, [80, 75, 3, 4]) || xt(y, [80, 75, 5, 6]) || xt(y, [80, 75, 7, 8]) ? "zip" : xt(y, [82, 97, 114, 33, 26, 7, 0]) || xt(y, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : xt(y, [55, 122, 188, 175, 39, 28]) ? "7z" : y.length > 262 && xt(y, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Qt(y) {
  return y.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Xt(y) {
  const t = [], e = y.map((a) => Qt(a).toLowerCase()), l = (a) => e.some(a), c = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((a) => c.test(a)).length, n = e.filter((a) => s.test(a) || a.includes("drill")).length, d = l((a) => a.includes("top") && a.includes("copper") || a.endsWith(".gtl")), v = l((a) => a.includes("bot") || a.includes("bottom") || a.endsWith(".gbl")), b = l((a) => a.includes("mask") || a.includes("solder") || a.endsWith(".gts") || a.endsWith(".gbs")), m = l((a) => a.includes("silk") || a.includes("legend") || a.endsWith(".gto") || a.endsWith(".gbo")), f = l((a) => a.includes("outline") || a.includes("profile") || a.includes("edge") || a.endsWith(".gko") || a.endsWith(".gm1") || a.endsWith(".gml")), h = e.every(
    (a) => a.endsWith(".pdf") || a.endsWith(".png") || a.endsWith(".jpg") || a.endsWith(".jpeg") || a.endsWith(".svg") || a.endsWith(".txt") || a.endsWith(".md")
  );
  let p = 0;
  return y.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : h ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (p += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (p += 0.2, t.push(`Found ${n} drill-like file(s).`)), f && (p += 0.15, t.push("Found outline/profile/edge candidate.")), d && v ? (p += 0.2, t.push("Found both top and bottom copper candidates.")) : (d || v) && (p += 0.1, t.push("Found at least one copper candidate.")), b && (p += 0.05, t.push("Found solder mask candidate.")), m && (p += 0.05, t.push("Found silkscreen/legend candidate.")), p = Math.max(0, Math.min(1, p)), p < 0.6 && i >= 2 && (p = Math.max(p, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: p, reasons: t });
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
  const t = ge(y), e = _e(t);
  if (e === "zip")
    try {
      const s = ye(t), n = (await ue(s)).map((b) => b.name), { confidence: d, reasons: v } = Xt(n);
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
  const l = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return l.includes("%FSLAX") || l.includes("%MOIN") || l.includes("%MOMM") || l.includes("G04") || l.includes("%ADD") ? {
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
  constructor(t, e, l) {
    super(e), this.name = "GerberError", this.code = t, this.details = l;
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
  const e = {}, l = 1e3, c = 100 * 1024 * 1024, s = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (s.length > l)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${s.length} > ${l})`
    );
  let i = 0;
  for (const [n, d] of s)
    try {
      const v = te(n), b = await d.async("arraybuffer");
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
async function ke(y, t) {
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
  let l;
  try {
    const m = new Blob([ee(y)], { type: "application/octet-stream" });
    l = await e.open(m);
  } catch (m) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", m);
  }
  let c;
  try {
    c = await Promise.race([
      l.extractFiles(),
      new Promise(
        (m, f) => setTimeout(() => f(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (m) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", m);
  }
  const s = {};
  let i = 0;
  const n = 1e3, d = 100 * 1024 * 1024;
  let v = 0;
  async function b(m, f) {
    if (i >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const h of Object.keys(m)) {
      const p = m[h], a = f ? `${f}/${h}` : h;
      if (p instanceof File || p instanceof Blob) {
        i++;
        try {
          const g = await p.arrayBuffer();
          if (v += g.byteLength, v > d)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${d} bytes)`
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
    if (l && typeof l.close == "function")
      try {
        await l.close();
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
  const e = ve(y), l = 100 * 1024 * 1024;
  if (e.length > l)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${l} bytes)`
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
function ht(y, t) {
  const e = t.map((c) => c.toLowerCase());
  return y.filter((c) => {
    const s = Lt(c);
    return e.every((i) => s.includes(i));
  }).sort((c, s) => c.length - s.length)[0];
}
function xe(y) {
  const t = y.filter((b) => {
    const m = Lt(b);
    return !(m.endsWith("/") || m.includes("__macosx") || m.endsWith(".ds_store"));
  }), e = vt(t, [".gtl"]) || ht(t, ["f_cu"]) || ht(t, ["top", "cu"]) || ht(t, ["top", "copper"]), l = vt(t, [".gbl"]) || ht(t, ["b_cu"]) || ht(t, ["bottom", "cu"]) || ht(t, ["bottom", "copper"]), c = vt(t, [".gts"]) || ht(t, ["f_mask"]) || ht(t, ["top", "mask"]), s = vt(t, [".gbs"]) || ht(t, ["b_mask"]) || ht(t, ["bottom", "mask"]), i = vt(t, [".gto"]) || ht(t, ["f_silks"]) || ht(t, ["f_silk"]) || ht(t, ["top", "silk"]), n = vt(t, [".gbo"]) || ht(t, ["b_silks"]) || ht(t, ["b_silk"]) || ht(t, ["bottom", "silk"]), d = vt(t, [".gko", ".gm1"]) || ht(t, ["edge", "cuts"]) || ht(t, ["outline"]) || ht(t, ["board", "outline"]), v = (
    // Excellon often .drl or .xln or .txt
    vt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    ht(t, ["drill"]) || ht(t, ["drills"]) || ht(t, ["npth"]) || ht(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: l,
    top_mask: c,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: n,
    outline: d,
    drills: v
  };
}
const Se = 0.8;
function Mt(y, t, e) {
  const l = {
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
        Re(i, l);
        continue;
      }
      i.endsWith("*") && (i = i.slice(0, -1)), Ae(i, l);
    }
  }
  if (l.inRegion) {
    if (l.currentPath.length >= 3 && l.regionPaths.push(l.currentPath), l.regionPaths.length > 0) {
      const s = {
        loops: l.regionPaths,
        polarity: l.currentPolarity
      };
      l.regions.push(s), l.ops.push({
        kind: "region",
        polarity: l.currentPolarity,
        loops: l.regionPaths
      });
    }
    l.inRegion = !1, l.regionPaths = [], l.currentPath = [];
  }
  return {
    tracks: l.tracks,
    arcs: l.arcs,
    flashes: l.flashes,
    regions: l.regions,
    ops: l.ops
  };
}
function Re(y, t) {
  let e = y;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const l = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (l) {
      const c = parseInt(l[1], 10), s = parseInt(l[2], 10);
      parseInt(l[4], 10), t.fmtInt = c, t.fmtDec = s;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const l = t.unitScale;
    let c = l;
    if (e.includes("MOMM") ? c = 1 : e.includes("MOIN") && (c = 25.4), c !== l) {
      const s = c / l;
      for (const i of t.apertures.values())
        i.diameterMm !== void 0 && (i.diameterMm *= s), i.widthMm !== void 0 && (i.widthMm *= s), i.heightMm !== void 0 && (i.heightMm *= s);
      t.unitScale = c;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const l = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(e);
    if (!l) return;
    const c = parseInt(l[2], 10), s = l[3], i = l[4] ?? "";
    let n, d, v;
    if (i) {
      const m = i.split(/[Xx]/), f = m[0] ? parseFloat(m[0]) * t.unitScale : void 0, h = m[1] ? parseFloat(m[1]) * t.unitScale : void 0;
      s === "C" ? n = f : s === "R" || s === "O" ? (d = f, v = h, f !== void 0 && h !== void 0 ? n = Math.min(f, h) : n = f ?? h) : n = f ?? h;
    }
    const b = {
      code: c,
      shape: s,
      diameterMm: n,
      widthMm: d,
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
  const l = /D0?(\d{1,3})$/.exec(y);
  if (l && (e = parseInt(l[1], 10), y = y.slice(0, y.length - l[0].length)), e !== null && e >= 10) {
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
  const d = t.x, v = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = i, t.y = n;
      return;
    }
    const b = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: d, y: v },
      end: { x: i, y: n },
      width: b,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: d, y: v },
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
      const b = t.currentAperture, m = b.diameterMm !== void 0 ? b.diameterMm : Se, f = {
        position: { x: i, y: n },
        diameterMm: m,
        shape: b.shape,
        polarity: t.currentPolarity
      };
      b.widthMm !== void 0 && (f.widthMm = b.widthMm), b.heightMm !== void 0 && (f.heightMm = b.heightMm), t.flashes.push(f), t.ops.push({
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
  const e = y.startsWith("-") ? -1 : 1, l = y.replace(/[+\-]/g, ""), c = parseInt(l, 10);
  if (Number.isNaN(c)) return 0;
  const s = Math.pow(10, t.fmtDec), i = c / s * t.unitScale;
  return e * i;
}
function Ee(y, t) {
  const e = t.split(/\r?\n/), l = /* @__PURE__ */ new Map();
  let c = null;
  const s = [];
  for (const i of e) {
    const n = i.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const d = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (d) {
          const v = d[1], b = parseFloat(d[2]);
          Number.isNaN(b) || l.set(v, b);
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
        const v = d[1], b = d[2], m = parseFloat(v), f = parseFloat(b);
        if (Number.isNaN(m) || Number.isNaN(f))
          continue;
        const h = c && l.has(c) ? l.get(c) : 0.6;
        s.push({
          x: m,
          y: f,
          diameter: h,
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
function ze(y) {
  return { w: y.maxX - y.minX, h: y.maxY - y.minY };
}
function Ct(y) {
  const { w: t, h: e } = ze(y);
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
      loops: e.loops.map((l) => l.map((c) => ({ x: c.x * t, y: c.y * t })))
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
    const l = (e.width ?? 0) / 2;
    pt(t, e.start.x - l, e.start.y - l), pt(t, e.start.x + l, e.start.y + l), pt(t, e.end.x - l, e.end.y - l), pt(t, e.end.x + l, e.end.y + l);
  }
  for (const e of y.flashes) {
    const l = (e.widthMm ?? e.diameterMm) || 0, c = (e.heightMm ?? e.diameterMm) || 0;
    pt(t, e.position.x - l / 2, e.position.y - c / 2), pt(t, e.position.x + l / 2, e.position.y + c / 2);
  }
  for (const e of y.regions)
    for (const l of e.loops) for (const c of l) pt(t, c.x, c.y);
  return t;
}
function Ie(y) {
  const t = Ut();
  for (const e of y) {
    const l = (e.diameter || 0) / 2;
    pt(t, e.x - l, e.y - l), pt(t, e.x + l, e.y + l);
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
function gt(y) {
  return y / 25.4 * Te;
}
function Rt(y, t, e) {
  const l = y - e.minX, c = e.maxY - t;
  return { x: l, y: c };
}
function Gt(y, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${y}" height="${t}" viewBox="0 0 ${y} ${t}">
  <rect width="${y}" height="${t}" fill="white"/>
</svg>`.trim();
}
function ie(y) {
  let t = 1 / 0, e = 1 / 0, l = -1 / 0, c = -1 / 0;
  for (const s of y.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), l = Math.max(l, i.x), c = Math.max(c, i.y);
  return { minX: t, minY: e, maxX: l, maxY: c };
}
function Oe(y, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let l = 0, c = 0;
  for (const b of y.regions) {
    const m = ie(b), f = (m.maxX - m.minX) * (m.maxY - m.minY);
    b.polarity === "clear" ? c = Math.max(c, f) : l = Math.max(l, f);
  }
  const s = y.tracks.filter((b) => b.polarity !== "clear").length + y.flashes.filter((b) => b.polarity !== "clear").length + y.regions.filter((b) => b.polarity !== "clear").length, i = y.tracks.filter((b) => b.polarity === "clear").length + y.flashes.filter((b) => b.polarity === "clear").length + y.regions.filter((b) => b.polarity === "clear").length, n = l > e * 0.7, d = i > s * 3, v = c > e * 0.7;
  return n ? !1 : d || v;
}
function Vt(y, t, e, l) {
  const c = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(gt(c))), n = Math.max(1, Math.round(gt(s))), d = gt(1), v = Oe(y, t), b = v ? "white" : "black", m = (x, A) => {
    const B = x - t.minX, I = t.maxY - A;
    return { x: B * d, y: I * d };
  }, f = (x, A) => {
    if (x.kind === "track") {
      const B = m(x.start.x, x.start.y), I = m(x.end.x, x.end.y), L = Number.isFinite(x.widthMm) ? x.widthMm : 0.2, T = Math.max(1, L * d);
      return `<line x1="${B.x.toFixed(2)}" y1="${B.y.toFixed(2)}" x2="${I.x.toFixed(2)}" y2="${I.y.toFixed(2)}" stroke-width="${T.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (x.kind === "flash") {
      const B = m(x.position.x, x.position.y), I = x.widthMm ?? x.diameterMm ?? 0.8, L = x.heightMm ?? x.diameterMm ?? 0.8, T = Math.max(0.01, Number.isFinite(I) ? I : 0.8) * d, j = Math.max(0.01, Number.isFinite(L) ? L : 0.8) * d;
      if (x.shape === "R" || x.shape === "O") {
        const K = B.x - T / 2, S = B.y - j / 2, P = x.shape === "O" ? Math.min(T, j) * 0.35 : 0;
        return `<rect x="${K.toFixed(2)}" y="${S.toFixed(2)}" width="${T.toFixed(2)}" height="${j.toFixed(2)}" rx="${P.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const K = Math.max(1, Math.max(T, j) / 2);
        return `<circle cx="${B.x.toFixed(2)}" cy="${B.y.toFixed(2)}" r="${K.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (x.kind === "region") {
      const B = x.loops.map((I) => {
        if (!I.length) return "";
        const L = m(I[0].x, I[0].y), T = [`M ${L.x.toFixed(2)} ${L.y.toFixed(2)}`];
        for (let j = 1; j < I.length; j++) {
          const K = m(I[j].x, I[j].y);
          T.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return T.push("Z"), T.join(" ");
      }).join(" ");
      return B.trim() ? `<path d="${B}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, h = [];
  h.push(`<rect x="0" y="0" width="${i}" height="${n}" fill="${b}" fill-opacity="1" />`);
  for (const x of y.ops) {
    const A = x.polarity === "clear" ? "black" : "white", B = f(x, A);
    B && h.push(B);
  }
  console.log("[polarity counts]", {
    tracksClear: y.tracks.filter((x) => x.polarity === "clear").length,
    regionsClear: y.regions.filter((x) => x.polarity === "clear").length,
    negativePlane: v
  });
  const p = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, g = 0;
  for (const x of y.regions) {
    const A = ie(x), B = (A.maxX - A.minX) * (A.maxY - A.minY);
    x.polarity === "clear" ? g = Math.max(g, B) : a = Math.max(a, B);
  }
  const u = y.tracks.filter((x) => x.polarity !== "clear").length + y.flashes.filter((x) => x.polarity !== "clear").length + y.regions.filter((x) => x.polarity !== "clear").length, k = y.tracks.filter((x) => x.polarity === "clear").length + y.flashes.filter((x) => x.polarity === "clear").length + y.regions.filter((x) => x.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: u,
    clearCount: k,
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
      ${h.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${n}" fill="${e}" opacity="${l}" mask="url(#${R})" />
</svg>`.trim();
}
function qt(y, t) {
  const e = t.maxX - t.minX, l = t.maxY - t.minY, c = Math.max(1, Math.round(gt(e))), s = Math.max(1, Math.round(gt(l))), i = Math.max(1e-6, gt(1)), n = "rgba(255,255,255,0.95)", d = "rgba(255,255,255,0.95)", v = y.tracks.map((f) => {
    const h = Rt(f.start.x, f.start.y, t), p = Rt(f.end.x, f.end.y, t), a = Number.isFinite(f.width) ? f.width : 0.15, g = Math.max(1, a * i);
    return `<line x1="${(h.x * i).toFixed(2)}" y1="${(h.y * i).toFixed(2)}" x2="${(p.x * i).toFixed(2)}" y2="${(p.y * i).toFixed(2)}" stroke="${n}" stroke-width="${g.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = y.flashes.map((f) => {
    const h = Rt(f.position.x, f.position.y, t), p = h.x * i, a = h.y * i, g = f.widthMm ?? f.diameterMm ?? 0.6, u = f.heightMm ?? f.diameterMm ?? 0.6;
    if (f.shape === "R" || f.shape === "O") {
      const R = g * i, x = u * i, A = p - R / 2, B = a - x / 2, I = f.shape === "O" ? Math.min(R, x) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${B.toFixed(2)}" width="${R.toFixed(2)}" height="${x.toFixed(2)}" rx="${I.toFixed(2)}" fill="${d}" />`;
    }
    const k = (f.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${p.toFixed(2)}" cy="${a.toFixed(2)}" r="${Math.max(1, k).toFixed(2)}" fill="${d}" />`;
  }), m = y.regions.map((f) => {
    const h = f.loops.map((p) => {
      if (!p.length) return "";
      const a = Rt(p[0].x, p[0].y, t), g = [`M ${(a.x * i).toFixed(2)} ${(a.y * i).toFixed(2)}`];
      for (let u = 1; u < p.length; u++) {
        const k = Rt(p[u].x, p[u].y, t);
        g.push(`L ${(k.x * i).toFixed(2)} ${(k.y * i).toFixed(2)}`);
      }
      return g.push("Z"), g.join(" ");
    }).join(" ");
    return h.trim() ? `<path d="${h}" fill="${d}" fill-rule="evenodd" opacity="0.95" />` : "";
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
  const e = t.maxX - t.minX, l = t.maxY - t.minY, c = Math.round(gt(e)), s = Math.round(gt(l)), i = gt(1), n = y.map((d) => {
    const v = Rt(d.x, d.y, t), b = v.x * i, m = v.y * i, f = (d.diameter || 0.6) * i / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${m.toFixed(2)}" r="${Math.max(1, f).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${c}" height="${s}" viewBox="0 0 ${c} ${s}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function ne(y) {
  const t = Object.keys(y).filter((nt) => !!nt), e = xe(t), l = new TextDecoder("utf-8", { fatal: !1 }), c = async (nt) => {
    if (!nt) return null;
    const ut = y[nt];
    return ut ? l.decode(ut) : null;
  }, s = await c(e.top_copper), i = await c(e.bottom_copper), n = await c(e.outline), d = await c(e.drills), v = await c(e.top_silk), b = await c(e.bottom_silk), m = s ? Mt(e.top_copper || "top", s) : null, f = i ? Mt(e.bottom_copper || "bot", i) : null, h = n ? Mt(e.outline || "outline", n) : null, p = d ? Ee(e.drills || "drills", d) : null, a = p ? p.holes.map((nt) => ({ x: nt.x, y: nt.y, diameter: nt.diameter })) : [], g = v ? Mt(e.top_silk || "top_silk", v) : null, u = b ? Mt(e.bottom_silk || "bot_silk", b) : null, k = m ? bt(wt(m)) : null, R = f ? bt(wt(f)) : null, x = h ? bt(wt(h)) : null, A = a.length ? bt(Ie(a)) : null, B = g ? bt(wt(g)) : null, I = u ? bt(wt(u)) : null, L = (x && Ct(x) ? x : null) || (k && Ct(k) ? k : null) || (R && Ct(R) ? R : null) || (A && Ct(A) ? A : null), T = L ? L.maxX - L.minX : 1, j = k ? St(k.maxX - k.minX, T) : 1, K = R ? St(R.maxX - R.minX, T) : 1, S = x ? St(x.maxX - x.minX, T) : 1, P = A ? St(A.maxX - A.minX, T) : 1, o = B ? St(B.maxX - B.minX, T) : 1, N = I ? St(I.maxX - I.minX, T) : 1, J = m ? It(m, j) : null, $ = f ? It(f, K) : null, rt = h ? It(h, S) : null, Y = a.length ? Me(a, P) : [], D = g ? It(g, o) : null, z = u ? It(u, N) : null;
  let E = null;
  if (rt) {
    const nt = bt(wt(rt));
    Ct(nt) && (E = nt);
  }
  if (!E) {
    let nt = Ut();
    J && (nt = Zt(nt, wt(J))), $ && (nt = Zt(nt, wt($))), nt = bt(nt), E = nt;
  }
  const Z = bt(E), G = Z.maxX - Z.minX, W = Z.maxY - Z.minY, tt = {
    board: {
      width_in: G / 25.4,
      height_in: W / 25.4,
      mm_bounds: {
        min_x_mm: Z.minX,
        min_y_mm: Z.minY,
        max_x_mm: Z.maxX,
        max_y_mm: Z.maxY
      }
    }
  }, lt = Math.max(1, Math.round(gt(G))), et = Math.max(1, Math.round(gt(W))), it = [], ot = (nt) => {
    const ut = Ce(nt);
    return it.push(ut), ut;
  }, st = {
    top_board_mask: ot(Gt(lt, et)),
    bottom_board_mask: ot(Gt(lt, et))
  };
  return J && (st.top_copper = ot(Vt(J, Z, "#fbbf24", 1))), $ && (st.bottom_copper = ot(Vt($, Z, "#38bdf8", 1))), Y.length && (st.drills = ot(Be(Y, Z))), D && (st.top_silk = ot(qt(D, Z))), z && (st.bottom_silk = ot(qt(z, Z))), {
    boardGeom: tt,
    layers: st,
    revoke: () => it.forEach((nt) => URL.revokeObjectURL(nt))
  };
}
async function Qe(y) {
  const t = y instanceof Uint8Array ? y.byteOffset === 0 && y.byteLength === y.buffer.byteLength ? y.buffer : y.slice().buffer : y instanceof ArrayBuffer ? y : await y.arrayBuffer(), { files: e, archiveType: l } = await re(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (l !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${l}`);
  return await ne(e);
}
async function tr(y, t) {
  const { files: e } = await re(y, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ne(e);
}
function Dt(y, t) {
  const [
    e,
    l,
    c,
    s,
    i,
    n,
    d,
    v,
    b
  ] = y, [
    m,
    f,
    h,
    p,
    a,
    g,
    u,
    k,
    R
  ] = t;
  return [
    e * m + l * p + c * u,
    e * f + l * a + c * k,
    e * h + l * g + c * R,
    s * m + i * p + n * u,
    s * f + i * a + n * k,
    s * h + i * g + n * R,
    d * m + v * p + b * u,
    d * f + v * a + b * k,
    d * h + v * g + b * R
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
  const e = y[0] * t.x + y[1] * t.y + y[2], l = y[3] * t.x + y[4] * t.y + y[5], c = y[6] * t.x + y[7] * t.y + y[8];
  if (c === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / c, y: l / c };
}
function Ne(y) {
  const t = y[0], e = y[1], l = y[2], c = y[3], s = y[4], i = y[5], n = t * s - e * c;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const d = 1 / n, v = s * d, b = -e * d, m = -c * d, f = t * d, h = -(v * l + b * i), p = -(m * l + f * i);
  return [v, b, h, m, f, p, 0, 0, 1];
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
    const { width_px: t, height_px: e } = this.viewport, { center_mm: l, zoom: c, rotation_rad: s, mirrorX: i, mirrorY: n } = this.camera, d = { x: t / 2, y: e / 2 }, v = n ? -1 : 1, b = i ? -1 : 1, m = Ht(-l.x, -l.y), f = Fe(s), h = Pe(c * b, c * v), p = Ht(d.x, d.y), a = Dt(p, Dt(h, Dt(f, m)));
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
    const l = this.overlays.get(t);
    l && l.visible !== e && (l.visible = e);
  }
  setZIndex(t, e) {
    const l = this.overlays.get(t);
    l && l.zIndex !== e && (l.zIndex = e, this.dirty = !0);
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
    const l = Math.floor(t / this.cellSize_mm), c = Math.floor(e / this.cellSize_mm);
    return { cx: l, cy: c, key: `${l},${c}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, l) {
    const { key: c } = this.cellCoord(e, l);
    let s = this.cells.get(c);
    s || (s = /* @__PURE__ */ new Set(), this.cells.set(c, s)), s.add(t);
  }
  remove(t, e, l) {
    const { key: c } = this.cellCoord(e, l), s = this.cells.get(c);
    s && (s.delete(t), s.size === 0 && this.cells.delete(c));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, l) {
    const { cx: c, cy: s } = this.cellCoord(t, e), i = Math.ceil(l / this.cellSize_mm), n = [];
    for (let d = -i; d <= i; d++)
      for (let v = -i; v <= i; v++) {
        const b = `${c + d},${s + v}`, m = this.cells.get(b);
        if (m)
          for (const f of m) n.push(f);
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
      const l = this.byId.get(e.id);
      if (!l) continue;
      const c = { ...l, ...e };
      (c.x_mm !== l.x_mm || c.y_mm !== l.y_mm) && (this.index.remove(l.id, l.x_mm, l.y_mm), this.index.insert(l.id, c.x_mm, c.y_mm)), this.byId.set(l.id, c), this.dirtyList = !0;
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
  queryNear(t, e, l) {
    const c = this.index.queryRadius(t, e, l), s = [];
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
  pick(t, e, l, c = 10) {
    const s = t.screenToBoard({ x: e, y: l }), i = t.xform.getCamera().zoom, n = c / i, d = this.store.queryNear(s.x, s.y, n);
    let v = null;
    for (const b of d) {
      const m = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), f = m.x - e, h = m.y - l, p = Math.sqrt(f * f + h * h);
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
    let l = this.handlers.get(t);
    return l || (l = /* @__PURE__ */ new Set(), this.handlers.set(t, l)), l.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const l = this.on(t, (c) => {
      l(), e(c);
    });
    return l;
  }
  off(t, e) {
    const l = this.handlers.get(t);
    l && (l.delete(e), l.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const l = this.handlers.get(t);
    if (!l || l.size === 0) return;
    const c = Array.from(l);
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
    const l = t.getContext("2d");
    if (!l) throw new Error("Unable to get 2D context");
    this.ctx = l;
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
    this.passes.push(t), this.passes.sort((e, l) => e.order - l.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((l) => l.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, l = e.getBoundingClientRect(), c = { width_px: l.width, height_px: l.height };
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
  pickMarker(t, e, l = 10) {
    const c = this.createRenderCtx();
    return this.markerPicker.pick(c, t, e, l);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const l = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: l }), e?.center;
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
    const { x_px: e, y_px: l } = this.eventToCanvasPx(t), c = this.createRenderCtx(), s = this.markerPicker.pick(c, e, l, 10);
    this.setHoverMarker(s?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: l } = this.eventToCanvasPx(t), c = this.createRenderCtx(), s = this.markerPicker.pick(c, e, l, 10);
    if (s) {
      this.selectMarker(s.id);
      return;
    }
    const i = c.screenToBoard({ x: e, y: l });
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
function rr(y, t, e, l) {
  return {
    id: `gerber:${y}`,
    order: t,
    enabled: (c) => c.visibility.gerber[e],
    draw: (c) => {
      const s = c.ctx, i = c.xform.getWorldToScreenMatrix();
      s.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), l(s);
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
    const l = this.overlays.get(t);
    l && (l.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Ge(y, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
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
    const e = t.ctx, l = t.xform.getCamera().zoom;
    if (!(l < 2)) {
      e.setTransform(1, 0, 0, 1, 0, 0);
      for (const s of this.markers.values()) {
        const i = t.boardToScreen(s.position);
        i.x < -10 || i.x > t.viewport.width_px + 10 || i.y < -10 || i.y > t.viewport.height_px + 10 || this.drawMarker(e, i, s, l);
      }
    }
  }
  drawMarker(t, e, l, c) {
    const s = Math.max(3, Math.min(8, c / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, s, 0, Math.PI * 2), l.type) {
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
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => y.draw(t)
  };
}
class He {
  draw(t, e) {
    if (!e) return;
    const l = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(l, t, e.id);
        break;
      case "geometry":
        this.drawGeometrySelection(l, t, e.id);
        break;
      case "region":
        this.drawRegionSelection(l, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, l) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, e, l) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, e, l) {
    if (!l) return;
    const c = e.xform.getWorldToScreenMatrix();
    t.setTransform(c[0], c[3], c[1], c[4], c[2], c[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      l.min.x,
      l.min.y,
      l.max.x - l.min.x,
      l.max.y - l.min.y
    );
  }
}
function Ke(y, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const l = t();
      l && y.draw(e, l);
    }
  };
}
function nr(y, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, l = t.showDownloadButton !== !1;
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

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>${l ? `
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
  const c = y.firstElementChild, s = J(c, "#board-viewport"), i = J(c, "#render-canvas"), n = J(c, "#grid-toggle"), d = J(c, "#grid-units"), v = J(c, "#fit-btn"), b = l ? J(c, "#download-btn") : null, m = Array.from(c.querySelectorAll('input[name="side"]')), f = new Ye(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), h = new se();
  h.subscribe(() => {
    f.requestRender("visibility-change");
  });
  const p = new Ze(), a = new Ve(), g = new He();
  let u = null;
  function k() {
    const D = s.getBoundingClientRect(), z = window.devicePixelRatio || 1;
    i.width = D.width * z, i.height = D.height * z, i.style.width = `${D.width}px`, i.style.height = `${D.height}px`, f.requestRender("resize");
  }
  const R = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (D, z) => {
      const Z = z.view.zoom, G = d.value, W = G === "mm" ? 1 : 2.54, tt = G === "mm" ? 10 : 25.4, lt = W * Z, et = tt * Z;
      if (lt < 2) return;
      const it = i.width / (window.devicePixelRatio || 1), ot = i.height / (window.devicePixelRatio || 1), st = z.screenToBoard({ x: 0, y: 0 }), nt = z.screenToBoard({ x: it, y: ot });
      D.setTransform(1, 0, 0, 1, 0, 0), D.strokeStyle = "rgba(59, 130, 246, 0.4)", D.lineWidth = 1, D.beginPath();
      const ut = Math.floor(st.x / W) * W, r = Math.floor(st.y / W) * W;
      for (let F = ut; F <= nt.x; F += W) {
        const O = z.boardToScreen({ x: F, y: 0 }).x;
        D.moveTo(O, 0), D.lineTo(O, i.height);
      }
      for (let F = r; F <= nt.y; F += W) {
        const O = z.boardToScreen({ x: 0, y: F }).y;
        D.moveTo(0, O), D.lineTo(i.width, O);
      }
      if (D.stroke(), et >= 8) {
        D.strokeStyle = "rgba(59, 130, 246, 0.7)", D.lineWidth = 1.5, D.beginPath();
        const F = Math.floor(st.x / tt) * tt, O = Math.floor(st.y / tt) * tt;
        for (let w = F; w <= nt.x; w += tt) {
          const _ = z.boardToScreen({ x: w, y: 0 }).x;
          D.moveTo(_, 0), D.lineTo(_, i.height);
        }
        for (let w = O; w <= nt.y; w += tt) {
          const _ = z.boardToScreen({ x: 0, y: w }).y;
          D.moveTo(0, _), D.lineTo(i.width, _);
        }
        D.stroke();
      }
    }
  };
  p.add(R), h.setOverlayVisibility("grid", !1), h.setMarkersVisibility(!1), f.addPass(Ge(p, f.getOverlayApi())), f.addPass(qe(a)), f.addPass(Ke(g, () => u));
  let x = null, A = {}, B = "top", I = !1;
  function L(D, z, E) {
    if (!E) return null;
    const Z = new Image();
    return Z.src = E, Z.addEventListener("load", () => {
      f.requestRender(`image-loaded-${D}`);
    }), {
      id: D,
      order: z,
      enabled: () => !0,
      draw: (G) => {
        if (!Z.complete) return;
        const W = G.ctx, tt = G.xform.getWorldToScreenMatrix();
        W.setTransform(tt[0], tt[3], tt[1], tt[4], tt[2], tt[5]);
        const lt = 25.4, et = (x?.board?.width_in || 1) * lt, it = (x?.board?.height_in || 1) * lt;
        W.drawImage(Z, 0, 0, et, it);
      }
    };
  }
  function T(D, z) {
    return {
      id: D,
      order: z,
      enabled: () => !0,
      draw: (E) => {
        if (!x?.board) return;
        const Z = E.ctx, G = E.xform.getWorldToScreenMatrix();
        Z.setTransform(G[0], G[3], G[1], G[4], G[2], G[5]);
        const W = (x.board.width_in || 1) * 25.4, tt = (x.board.height_in || 1) * 25.4;
        Z.fillStyle = "#1a5f1a", Z.fillRect(0, 0, W, tt), Z.strokeStyle = "#0d3d0d", Z.lineWidth = 0.1, Z.strokeRect(0, 0, W, tt);
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
      f.removePass(E);
    }), !x) return;
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
      E.useFR4 ? Z = T(E.id, E.order) : E.url && (Z = L(E.id, E.order, E.url)), Z && f.addPass(Z);
    }), f.requestRender("side-switch"), setTimeout(() => f.requestRender("side-switch-delayed"), 50);
  }
  function K(D = 0.08) {
    if (!x?.board) return;
    const z = s.getBoundingClientRect(), E = x.board.width_in || 1, Z = x.board.height_in || 1, G = z.width * (1 - 2 * D), W = z.height * (1 - 2 * D), tt = E * 25.4, lt = Z * 25.4, et = G / tt, it = W / lt, ot = Math.min(et, it), st = tt / 2, nt = lt / 2;
    f.setCamera({
      center_mm: { x: st, y: nt },
      zoom: ot
    });
  }
  i.addEventListener("wheel", (D) => {
    D.preventDefault(), I = !0;
    const z = i.getBoundingClientRect(), E = D.clientX - z.left, Z = D.clientY - z.top, G = f.getCamera(), W = D.deltaY < 0 ? 1.1 : 0.9, tt = Math.max(0.2, Math.min(50, G.zoom * W)), lt = f.screenToBoard(E, Z);
    f.setCamera({ zoom: tt });
    const et = f.screenToBoard(E, Z), it = lt.x - et.x, ot = lt.y - et.y, st = {
      x: G.center_mm.x + it,
      y: G.center_mm.y + ot
    };
    f.setCamera({
      center_mm: st,
      zoom: tt
    });
  }, { passive: !1 });
  let S = !1, P = null;
  i.addEventListener("mousedown", (D) => {
    if (D.button !== 0) return;
    D.preventDefault(), I = !0, S = !0;
    const z = i.getBoundingClientRect();
    P = f.screenToBoard(
      D.clientX - z.left,
      D.clientY - z.top
    );
  });
  const o = (D) => {
    if (!S || !P) return;
    const z = i.getBoundingClientRect(), E = f.screenToBoard(
      D.clientX - z.left,
      D.clientY - z.top
    ), Z = P.x - E.x, G = P.y - E.y, W = f.getCamera();
    f.setCamera({
      center_mm: {
        x: W.center_mm.x + Z,
        y: W.center_mm.y + G
      }
    });
  }, N = () => {
    S = !1, P = null;
  };
  window.addEventListener("mousemove", o), window.addEventListener("mouseup", N), n.addEventListener("change", () => {
    const D = n.checked;
    h.setOverlayVisibility("grid", D), R.visible = D, f.requestRender("grid-toggle");
  }), d.addEventListener("change", () => {
    h.isOverlayVisible("grid") && f.requestRender("grid-units");
  }), v.addEventListener("click", () => K(0.08)), b?.addEventListener("click", () => t.onDownload?.()), m.forEach((D) => {
    D.addEventListener("change", () => {
      B = m.find((z) => z.checked)?.value || "top", j();
    });
  }), window.addEventListener("resize", () => {
    k(), I || K(0.08);
  });
  function J(D, z) {
    const E = D.querySelector(z);
    if (!E) throw new Error(`Missing required element: ${z}`);
    return E;
  }
  function $(D) {
    if (x = D.boardGeom, A = D.layers, x?.board) {
      const z = (x.board.width_in || 1) * 25.4, E = (x.board.height_in || 1) * 25.4;
      f.setBoardBounds({ minX_mm: 0, minY_mm: 0, maxX_mm: z, maxY_mm: E });
    }
    j(), k(), K(0.08);
  }
  function rt(D) {
    B = D;
    const z = m.find((E) => E.value === D);
    z && (z.checked = !0), j();
  }
  function Y() {
    window.removeEventListener("mousemove", o), window.removeEventListener("mouseup", N), y.innerHTML = "";
  }
  return k(), {
    setData: $,
    setSideMode: rt,
    fit: () => K(0.08),
    dispose: Y,
    // Expose new render pipeline API
    viewer: f,
    visibility: h,
    overlayRegistry: p,
    markerRenderer: a,
    setSelection: (D) => {
      u = D, f.requestRender("selection-change");
    },
    addMarker: (D) => {
      a.add(D), f.requestRender("marker-added");
    },
    removeMarker: (D) => {
      a.remove(D), f.requestRender("marker-removed");
    }
  };
}
function sr(y, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const l = e.xform.getWorldToScreenMatrix(), c = y.getSortedVisible();
      for (const s of c)
        e.ctx.save(), s.drawInWorldSpace ? e.ctx.setTransform(l[0], l[3], l[1], l[4], l[2], l[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), s.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function ar() {
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
      for (const l of e)
        y.beginPath(), y.arc(l.x_mm, l.y_mm, 0.25, 0, Math.PI * 2), y.fill();
    }
  };
}
function or(y) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const l = y();
      l && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(l.x_px + 12, l.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(l.text, l.x_px + 15, l.y_px - 5));
    }
  };
}
function lr(y = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const l = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let c = l.minX_mm; c <= l.maxX_mm; c += y)
        t.moveTo(c, l.minY_mm), t.lineTo(c, l.maxY_mm);
      for (let c = l.minY_mm; c <= l.maxY_mm; c += y)
        t.moveTo(l.minX_mm, c), t.lineTo(l.maxX_mm, c);
      t.stroke();
    }
  };
}
function cr(y) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, l) => {
      t += 16;
      const c = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + c * 0.7})`, e.beginPath(), e.arc(y.x_mm, y.y_mm, 0.5 + c * 0.5, 0, Math.PI * 2), e.fill(), l.requestRender("overlay:animate");
    }
  };
}
class Je {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const l = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: c, height_px: s } = t.viewport, i = 4;
    for (const n of l) {
      const d = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), v = d.x, b = d.y;
      v < -10 || b < -10 || v > c + 10 || b > s + 10 || (this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id), t.ctx.beginPath(), t.ctx.arc(v, b, i, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill());
    }
  }
  applyMarkerStyling(t, e, l, c) {
    if (l)
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
function hr(y, t) {
  const e = new Je(y);
  return {
    id: "markers",
    order: kt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (l) => {
      if (!l.visibility.markers) return;
      const c = t();
      e.draw(l, {
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
