var Dt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ye(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
function Lt(m) {
  throw new Error('Could not dynamically require "' + m + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ut = { exports: {} };
var Vt;
function ge() {
  return Vt || (Vt = 1, (function(m, t) {
    (function(e) {
      m.exports = e();
    })(function() {
      return (function e(a, l, o) {
        function n(p, b) {
          if (!l[p]) {
            if (!a[p]) {
              var g = typeof Lt == "function" && Lt;
              if (!b && g) return g(p, !0);
              if (s) return s(p, !0);
              var _ = new Error("Cannot find module '" + p + "'");
              throw _.code = "MODULE_NOT_FOUND", _;
            }
            var d = l[p] = { exports: {} };
            a[p][0].call(d.exports, function(h) {
              var i = a[p][1][h];
              return n(i || h);
            }, d, d.exports, e, a, l, o);
          }
          return l[p].exports;
        }
        for (var s = typeof Lt == "function" && Lt, f = 0; f < o.length; f++) n(o[f]);
        return n;
      })({ 1: [function(e, a, l) {
        var o = e("./utils"), n = e("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(f) {
          for (var p, b, g, _, d, h, i, y = [], u = 0, x = f.length, S = x, k = o.getTypeOf(f) !== "string"; u < f.length; ) S = x - u, g = k ? (p = f[u++], b = u < x ? f[u++] : 0, u < x ? f[u++] : 0) : (p = f.charCodeAt(u++), b = u < x ? f.charCodeAt(u++) : 0, u < x ? f.charCodeAt(u++) : 0), _ = p >> 2, d = (3 & p) << 4 | b >> 4, h = 1 < S ? (15 & b) << 2 | g >> 6 : 64, i = 2 < S ? 63 & g : 64, y.push(s.charAt(_) + s.charAt(d) + s.charAt(h) + s.charAt(i));
          return y.join("");
        }, l.decode = function(f) {
          var p, b, g, _, d, h, i = 0, y = 0, u = "data:";
          if (f.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, S = 3 * (f = f.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (f.charAt(f.length - 1) === s.charAt(64) && S--, f.charAt(f.length - 2) === s.charAt(64) && S--, S % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = n.uint8array ? new Uint8Array(0 | S) : new Array(0 | S); i < f.length; ) p = s.indexOf(f.charAt(i++)) << 2 | (_ = s.indexOf(f.charAt(i++))) >> 4, b = (15 & _) << 4 | (d = s.indexOf(f.charAt(i++))) >> 2, g = (3 & d) << 6 | (h = s.indexOf(f.charAt(i++))), x[y++] = p, d !== 64 && (x[y++] = b), h !== 64 && (x[y++] = g);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var o = e("./external"), n = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), f = e("./stream/DataLengthProbe");
        function p(b, g, _, d, h) {
          this.compressedSize = b, this.uncompressedSize = g, this.crc32 = _, this.compression = d, this.compressedContent = h;
        }
        p.prototype = { getContentWorker: function() {
          var b = new n(o.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new f("data_length")), g = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== g.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new n(o.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, p.createWorkerFrom = function(b, g, _) {
          return b.pipe(new s()).pipe(new f("uncompressedSize")).pipe(g.compressWorker(_)).pipe(new f("compressedSize")).withStreamInfo("compression", g);
        }, a.exports = p;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, a, l) {
        var o = e("./stream/GenericWorker");
        l.STORE = { magic: "\0\0", compressWorker: function() {
          return new o("STORE compression");
        }, uncompressWorker: function() {
          return new o("STORE decompression");
        } }, l.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, a, l) {
        var o = e("./utils"), n = (function() {
          for (var s, f = [], p = 0; p < 256; p++) {
            s = p;
            for (var b = 0; b < 8; b++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            f[p] = s;
          }
          return f;
        })();
        a.exports = function(s, f) {
          return s !== void 0 && s.length ? o.getTypeOf(s) !== "string" ? (function(p, b, g, _) {
            var d = n, h = _ + g;
            p ^= -1;
            for (var i = _; i < h; i++) p = p >>> 8 ^ d[255 & (p ^ b[i])];
            return -1 ^ p;
          })(0 | f, s, s.length, 0) : (function(p, b, g, _) {
            var d = n, h = _ + g;
            p ^= -1;
            for (var i = _; i < h; i++) p = p >>> 8 ^ d[255 & (p ^ b.charCodeAt(i))];
            return -1 ^ p;
          })(0 | f, s, s.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var o = null;
        o = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: o };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var o = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", n = e("pako"), s = e("./utils"), f = e("./stream/GenericWorker"), p = o ? "uint8array" : "array";
        function b(g, _) {
          f.call(this, "FlateWorker/" + g), this._pako = null, this._pakoAction = g, this._pakoOptions = _, this.meta = {};
        }
        l.magic = "\b\0", s.inherits(b, f), b.prototype.processChunk = function(g) {
          this.meta = g.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(p, g.data), !1);
        }, b.prototype.flush = function() {
          f.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          f.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new n[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var g = this;
          this._pako.onData = function(_) {
            g.push({ data: _, meta: g.meta });
          };
        }, l.compressWorker = function(g) {
          return new b("Deflate", g);
        }, l.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function o(d, h) {
          var i, y = "";
          for (i = 0; i < h; i++) y += String.fromCharCode(255 & d), d >>>= 8;
          return y;
        }
        function n(d, h, i, y, u, x) {
          var S, k, A = d.file, C = d.compression, I = x !== p.utf8encode, L = s.transformTo("string", x(A.name)), z = s.transformTo("string", p.utf8encode(A.name)), U = A.comment, K = s.transformTo("string", x(U)), M = s.transformTo("string", p.utf8encode(U)), N = z.length !== A.name.length, c = M.length !== U.length, $ = "", nt = "", X = "", ot = A.dir, Z = A.date, it = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          h && !i || (it.crc32 = d.crc32, it.compressedSize = d.compressedSize, it.uncompressedSize = d.uncompressedSize);
          var F = 0;
          h && (F |= 8), I || !N && !c || (F |= 2048);
          var P = 0, rt = 0;
          ot && (P |= 16), u === "UNIX" ? (rt = 798, P |= (function(q, dt) {
            var ut = q;
            return q || (ut = dt ? 16893 : 33204), (65535 & ut) << 16;
          })(A.unixPermissions, ot)) : (rt = 20, P |= (function(q) {
            return 63 & (q || 0);
          })(A.dosPermissions)), S = Z.getUTCHours(), S <<= 6, S |= Z.getUTCMinutes(), S <<= 5, S |= Z.getUTCSeconds() / 2, k = Z.getUTCFullYear() - 1980, k <<= 4, k |= Z.getUTCMonth() + 1, k <<= 5, k |= Z.getUTCDate(), N && (nt = o(1, 1) + o(b(L), 4) + z, $ += "up" + o(nt.length, 2) + nt), c && (X = o(1, 1) + o(b(K), 4) + M, $ += "uc" + o(X.length, 2) + X);
          var J = "";
          return J += `
\0`, J += o(F, 2), J += C.magic, J += o(S, 2), J += o(k, 2), J += o(it.crc32, 4), J += o(it.compressedSize, 4), J += o(it.uncompressedSize, 4), J += o(L.length, 2), J += o($.length, 2), { fileRecord: g.LOCAL_FILE_HEADER + J + L + $, dirRecord: g.CENTRAL_FILE_HEADER + o(rt, 2) + J + o(K.length, 2) + "\0\0\0\0" + o(P, 4) + o(y, 4) + L + $ + K };
        }
        var s = e("../utils"), f = e("../stream/GenericWorker"), p = e("../utf8"), b = e("../crc32"), g = e("../signature");
        function _(d, h, i, y) {
          f.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = h, this.zipPlatform = i, this.encodeFileName = y, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        s.inherits(_, f), _.prototype.push = function(d) {
          var h = d.meta.percent || 0, i = this.entriesCount, y = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, f.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: i ? (h + 100 * (i - y - 1)) / i : 100 } }));
        }, _.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var h = this.streamFiles && !d.file.dir;
          if (h) {
            var i = n(d, h, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: i.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, _.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var h = this.streamFiles && !d.file.dir, i = n(d, h, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(i.dirRecord), h) this.push({ data: (function(y) {
            return g.DATA_DESCRIPTOR + o(y.crc32, 4) + o(y.compressedSize, 4) + o(y.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: i.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, _.prototype.flush = function() {
          for (var d = this.bytesWritten, h = 0; h < this.dirRecords.length; h++) this.push({ data: this.dirRecords[h], meta: { percent: 100 } });
          var i = this.bytesWritten - d, y = (function(u, x, S, k, A) {
            var C = s.transformTo("string", A(k));
            return g.CENTRAL_DIRECTORY_END + "\0\0\0\0" + o(u, 2) + o(u, 2) + o(x, 4) + o(S, 4) + o(C.length, 2) + C;
          })(this.dirRecords.length, i, d, this.zipComment, this.encodeFileName);
          this.push({ data: y, meta: { percent: 100 } });
        }, _.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, _.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var h = this;
          return d.on("data", function(i) {
            h.processChunk(i);
          }), d.on("end", function() {
            h.closedSource(h.previous.streamInfo), h._sources.length ? h.prepareNextSource() : h.end();
          }), d.on("error", function(i) {
            h.error(i);
          }), this;
        }, _.prototype.resume = function() {
          return !!f.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, _.prototype.error = function(d) {
          var h = this._sources;
          if (!f.prototype.error.call(this, d)) return !1;
          for (var i = 0; i < h.length; i++) try {
            h[i].error(d);
          } catch {
          }
          return !0;
        }, _.prototype.lock = function() {
          f.prototype.lock.call(this);
          for (var d = this._sources, h = 0; h < d.length; h++) d[h].lock();
        }, a.exports = _;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var o = e("../compressions"), n = e("./ZipFileWorker");
        l.generateWorker = function(s, f, p) {
          var b = new n(f.streamFiles, p, f.platform, f.encodeFileName), g = 0;
          try {
            s.forEach(function(_, d) {
              g++;
              var h = (function(x, S) {
                var k = x || S, A = o[k];
                if (!A) throw new Error(k + " is not a valid compression method !");
                return A;
              })(d.options.compression, f.compression), i = d.options.compressionOptions || f.compressionOptions || {}, y = d.dir, u = d.date;
              d._compressWorker(h, i).withStreamInfo("file", { name: _, dir: y, date: u, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(b);
            }), b.entriesCount = g;
          } catch (_) {
            b.error(_);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, a, l) {
        function o() {
          if (!(this instanceof o)) return new o();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var n = new o();
            for (var s in this) typeof this[s] != "function" && (n[s] = this[s]);
            return n;
          };
        }
        (o.prototype = e("./object")).loadAsync = e("./load"), o.support = e("./support"), o.defaults = e("./defaults"), o.version = "3.10.1", o.loadAsync = function(n, s) {
          return new o().loadAsync(n, s);
        }, o.external = e("./external"), a.exports = o;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, a, l) {
        var o = e("./utils"), n = e("./external"), s = e("./utf8"), f = e("./zipEntries"), p = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function g(_) {
          return new n.Promise(function(d, h) {
            var i = _.decompressed.getContentWorker().pipe(new p());
            i.on("error", function(y) {
              h(y);
            }).on("end", function() {
              i.streamInfo.crc32 !== _.decompressed.crc32 ? h(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        a.exports = function(_, d) {
          var h = this;
          return d = o.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: s.utf8decode }), b.isNode && b.isStream(_) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : o.prepareContent("the loaded zip file", _, !0, d.optimizedBinaryString, d.base64).then(function(i) {
            var y = new f(d);
            return y.load(i), y;
          }).then(function(i) {
            var y = [n.Promise.resolve(i)], u = i.files;
            if (d.checkCRC32) for (var x = 0; x < u.length; x++) y.push(g(u[x]));
            return n.Promise.all(y);
          }).then(function(i) {
            for (var y = i.shift(), u = y.files, x = 0; x < u.length; x++) {
              var S = u[x], k = S.fileNameStr, A = o.resolve(S.fileNameStr);
              h.file(A, S.decompressed, { binary: !0, optimizedBinaryString: !0, date: S.date, dir: S.dir, comment: S.fileCommentStr.length ? S.fileCommentStr : null, unixPermissions: S.unixPermissions, dosPermissions: S.dosPermissions, createFolders: d.createFolders }), S.dir || (h.file(A).unsafeOriginalName = k);
            }
            return y.zipComment.length && (h.comment = y.zipComment), h;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var o = e("../utils"), n = e("../stream/GenericWorker");
        function s(f, p) {
          n.call(this, "Nodejs stream input adapter for " + f), this._upstreamEnded = !1, this._bindStream(p);
        }
        o.inherits(s, n), s.prototype._bindStream = function(f) {
          var p = this;
          (this._stream = f).pause(), f.on("data", function(b) {
            p.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            p.isPaused ? this.generatedError = b : p.error(b);
          }).on("end", function() {
            p.isPaused ? p._upstreamEnded = !0 : p.end();
          });
        }, s.prototype.pause = function() {
          return !!n.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, s.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var o = e("readable-stream").Readable;
        function n(s, f, p) {
          o.call(this, f), this._helper = s;
          var b = this;
          s.on("data", function(g, _) {
            b.push(g) || b._helper.pause(), p && p(_);
          }).on("error", function(g) {
            b.emit("error", g);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(n, o), n.prototype._read = function() {
          this._helper.resume();
        }, a.exports = n;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, a, l) {
        a.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(o, n) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(o, n);
          if (typeof o == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(o, n);
        }, allocBuffer: function(o) {
          if (Buffer.alloc) return Buffer.alloc(o);
          var n = new Buffer(o);
          return n.fill(0), n;
        }, isBuffer: function(o) {
          return Buffer.isBuffer(o);
        }, isStream: function(o) {
          return o && typeof o.on == "function" && typeof o.pause == "function" && typeof o.resume == "function";
        } };
      }, {}], 15: [function(e, a, l) {
        function o(A, C, I) {
          var L, z = s.getTypeOf(C), U = s.extend(I || {}, b);
          U.date = U.date || /* @__PURE__ */ new Date(), U.compression !== null && (U.compression = U.compression.toUpperCase()), typeof U.unixPermissions == "string" && (U.unixPermissions = parseInt(U.unixPermissions, 8)), U.unixPermissions && 16384 & U.unixPermissions && (U.dir = !0), U.dosPermissions && 16 & U.dosPermissions && (U.dir = !0), U.dir && (A = u(A)), U.createFolders && (L = y(A)) && x.call(this, L, !0);
          var K = z === "string" && U.binary === !1 && U.base64 === !1;
          I && I.binary !== void 0 || (U.binary = !K), (C instanceof g && C.uncompressedSize === 0 || U.dir || !C || C.length === 0) && (U.base64 = !1, U.binary = !0, C = "", U.compression = "STORE", z = "string");
          var M = null;
          M = C instanceof g || C instanceof f ? C : h.isNode && h.isStream(C) ? new i(A, C) : s.prepareContent(A, C, U.binary, U.optimizedBinaryString, U.base64);
          var N = new _(A, M, U);
          this.files[A] = N;
        }
        var n = e("./utf8"), s = e("./utils"), f = e("./stream/GenericWorker"), p = e("./stream/StreamHelper"), b = e("./defaults"), g = e("./compressedObject"), _ = e("./zipObject"), d = e("./generate"), h = e("./nodejsUtils"), i = e("./nodejs/NodejsStreamInputAdapter"), y = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var C = A.lastIndexOf("/");
          return 0 < C ? A.substring(0, C) : "";
        }, u = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, x = function(A, C) {
          return C = C !== void 0 ? C : b.createFolders, A = u(A), this.files[A] || o.call(this, A, null, { dir: !0, createFolders: C }), this.files[A];
        };
        function S(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var C, I, L;
          for (C in this.files) L = this.files[C], (I = C.slice(this.root.length, C.length)) && C.slice(0, this.root.length) === this.root && A(I, L);
        }, filter: function(A) {
          var C = [];
          return this.forEach(function(I, L) {
            A(I, L) && C.push(L);
          }), C;
        }, file: function(A, C, I) {
          if (arguments.length !== 1) return A = this.root + A, o.call(this, A, C, I), this;
          if (S(A)) {
            var L = A;
            return this.filter(function(U, K) {
              return !K.dir && L.test(U);
            });
          }
          var z = this.files[this.root + A];
          return z && !z.dir ? z : null;
        }, folder: function(A) {
          if (!A) return this;
          if (S(A)) return this.filter(function(z, U) {
            return U.dir && A.test(z);
          });
          var C = this.root + A, I = x.call(this, C), L = this.clone();
          return L.root = I.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var C = this.files[A];
          if (C || (A.slice(-1) !== "/" && (A += "/"), C = this.files[A]), C && !C.dir) delete this.files[A];
          else for (var I = this.filter(function(z, U) {
            return U.name.slice(0, A.length) === A;
          }), L = 0; L < I.length; L++) delete this.files[I[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var C, I = {};
          try {
            if ((I = s.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: n.utf8encode })).type = I.type.toLowerCase(), I.compression = I.compression.toUpperCase(), I.type === "binarystring" && (I.type = "string"), !I.type) throw new Error("No output type specified.");
            s.checkSupport(I.type), I.platform !== "darwin" && I.platform !== "freebsd" && I.platform !== "linux" && I.platform !== "sunos" || (I.platform = "UNIX"), I.platform === "win32" && (I.platform = "DOS");
            var L = I.comment || this.comment || "";
            C = d.generateWorker(this, I, L);
          } catch (z) {
            (C = new f("error")).error(z);
          }
          return new p(C, I.type || "string", I.mimeType);
        }, generateAsync: function(A, C) {
          return this.generateInternalStream(A).accumulate(C);
        }, generateNodeStream: function(A, C) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(C);
        } };
        a.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var o = e("./DataReader");
        function n(s) {
          o.call(this, s);
          for (var f = 0; f < this.data.length; f++) s[f] = 255 & s[f];
        }
        e("../utils").inherits(n, o), n.prototype.byteAt = function(s) {
          return this.data[this.zero + s];
        }, n.prototype.lastIndexOfSignature = function(s) {
          for (var f = s.charCodeAt(0), p = s.charCodeAt(1), b = s.charCodeAt(2), g = s.charCodeAt(3), _ = this.length - 4; 0 <= _; --_) if (this.data[_] === f && this.data[_ + 1] === p && this.data[_ + 2] === b && this.data[_ + 3] === g) return _ - this.zero;
          return -1;
        }, n.prototype.readAndCheckSignature = function(s) {
          var f = s.charCodeAt(0), p = s.charCodeAt(1), b = s.charCodeAt(2), g = s.charCodeAt(3), _ = this.readData(4);
          return f === _[0] && p === _[1] && b === _[2] && g === _[3];
        }, n.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return [];
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, f;
        }, a.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, a, l) {
        var o = e("../utils");
        function n(s) {
          this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
        }
        n.prototype = { checkOffset: function(s) {
          this.checkIndex(this.index + s);
        }, checkIndex: function(s) {
          if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
        }, setIndex: function(s) {
          this.checkIndex(s), this.index = s;
        }, skip: function(s) {
          this.setIndex(this.index + s);
        }, byteAt: function() {
        }, readInt: function(s) {
          var f, p = 0;
          for (this.checkOffset(s), f = this.index + s - 1; f >= this.index; f--) p = (p << 8) + this.byteAt(f);
          return this.index += s, p;
        }, readString: function(s) {
          return o.transformTo("string", this.readData(s));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var s = this.readInt(4);
          return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
        } }, a.exports = n;
      }, { "../utils": 32 }], 19: [function(e, a, l) {
        var o = e("./Uint8ArrayReader");
        function n(s) {
          o.call(this, s);
        }
        e("../utils").inherits(n, o), n.prototype.readData = function(s) {
          this.checkOffset(s);
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, f;
        }, a.exports = n;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, a, l) {
        var o = e("./DataReader");
        function n(s) {
          o.call(this, s);
        }
        e("../utils").inherits(n, o), n.prototype.byteAt = function(s) {
          return this.data.charCodeAt(this.zero + s);
        }, n.prototype.lastIndexOfSignature = function(s) {
          return this.data.lastIndexOf(s) - this.zero;
        }, n.prototype.readAndCheckSignature = function(s) {
          return s === this.readData(4);
        }, n.prototype.readData = function(s) {
          this.checkOffset(s);
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, f;
        }, a.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var o = e("./ArrayReader");
        function n(s) {
          o.call(this, s);
        }
        e("../utils").inherits(n, o), n.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return new Uint8Array(0);
          var f = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, f;
        }, a.exports = n;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var o = e("../utils"), n = e("../support"), s = e("./ArrayReader"), f = e("./StringReader"), p = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        a.exports = function(g) {
          var _ = o.getTypeOf(g);
          return o.checkSupport(_), _ !== "string" || n.uint8array ? _ === "nodebuffer" ? new p(g) : n.uint8array ? new b(o.transformTo("uint8array", g)) : new s(o.transformTo("array", g)) : new f(g);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var o = e("./GenericWorker"), n = e("../utils");
        function s(f) {
          o.call(this, "ConvertWorker to " + f), this.destType = f;
        }
        n.inherits(s, o), s.prototype.processChunk = function(f) {
          this.push({ data: n.transformTo(this.destType, f.data), meta: f.meta });
        }, a.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var o = e("./GenericWorker"), n = e("../crc32");
        function s() {
          o.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(s, o), s.prototype.processChunk = function(f) {
          this.streamInfo.crc32 = n(f.data, this.streamInfo.crc32 || 0), this.push(f);
        }, a.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var o = e("../utils"), n = e("./GenericWorker");
        function s(f) {
          n.call(this, "DataLengthProbe for " + f), this.propName = f, this.withStreamInfo(f, 0);
        }
        o.inherits(s, n), s.prototype.processChunk = function(f) {
          if (f) {
            var p = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = p + f.data.length;
          }
          n.prototype.processChunk.call(this, f);
        }, a.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var o = e("../utils"), n = e("./GenericWorker");
        function s(f) {
          n.call(this, "DataWorker");
          var p = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, f.then(function(b) {
            p.dataIsReady = !0, p.data = b, p.max = b && b.length || 0, p.type = o.getTypeOf(b), p.isPaused || p._tickAndRepeat();
          }, function(b) {
            p.error(b);
          });
        }
        o.inherits(s, n), s.prototype.cleanUp = function() {
          n.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, o.delay(this._tickAndRepeat, [], this)), !0);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (o.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var f = null, p = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              f = this.data.substring(this.index, p);
              break;
            case "uint8array":
              f = this.data.subarray(this.index, p);
              break;
            case "array":
            case "nodebuffer":
              f = this.data.slice(this.index, p);
          }
          return this.index = p, this.push({ data: f, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, a.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, a, l) {
        function o(n) {
          this.name = n || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        o.prototype = { push: function(n) {
          this.emit("data", n);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (n) {
            this.emit("error", n);
          }
          return !0;
        }, error: function(n) {
          return !this.isFinished && (this.isPaused ? this.generatedError = n : (this.isFinished = !0, this.emit("error", n), this.previous && this.previous.error(n), this.cleanUp()), !0);
        }, on: function(n, s) {
          return this._listeners[n].push(s), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(n, s) {
          if (this._listeners[n]) for (var f = 0; f < this._listeners[n].length; f++) this._listeners[n][f].call(this, s);
        }, pipe: function(n) {
          return n.registerPrevious(this);
        }, registerPrevious: function(n) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = n.streamInfo, this.mergeStreamInfo(), this.previous = n;
          var s = this;
          return n.on("data", function(f) {
            s.processChunk(f);
          }), n.on("end", function() {
            s.end();
          }), n.on("error", function(f) {
            s.error(f);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var n = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), n = !0), this.previous && this.previous.resume(), !n;
        }, flush: function() {
        }, processChunk: function(n) {
          this.push(n);
        }, withStreamInfo: function(n, s) {
          return this.extraStreamInfo[n] = s, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var n in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, n) && (this.streamInfo[n] = this.extraStreamInfo[n]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var n = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + n : n;
        } }, a.exports = o;
      }, {}], 29: [function(e, a, l) {
        var o = e("../utils"), n = e("./ConvertWorker"), s = e("./GenericWorker"), f = e("../base64"), p = e("../support"), b = e("../external"), g = null;
        if (p.nodestream) try {
          g = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function _(h, i) {
          return new b.Promise(function(y, u) {
            var x = [], S = h._internalType, k = h._outputType, A = h._mimeType;
            h.on("data", function(C, I) {
              x.push(C), i && i(I);
            }).on("error", function(C) {
              x = [], u(C);
            }).on("end", function() {
              try {
                var C = (function(I, L, z) {
                  switch (I) {
                    case "blob":
                      return o.newBlob(o.transformTo("arraybuffer", L), z);
                    case "base64":
                      return f.encode(L);
                    default:
                      return o.transformTo(I, L);
                  }
                })(k, (function(I, L) {
                  var z, U = 0, K = null, M = 0;
                  for (z = 0; z < L.length; z++) M += L[z].length;
                  switch (I) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (K = new Uint8Array(M), z = 0; z < L.length; z++) K.set(L[z], U), U += L[z].length;
                      return K;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + I + "'");
                  }
                })(S, x), A);
                y(C);
              } catch (I) {
                u(I);
              }
              x = [];
            }).resume();
          });
        }
        function d(h, i, y) {
          var u = i;
          switch (i) {
            case "blob":
            case "arraybuffer":
              u = "uint8array";
              break;
            case "base64":
              u = "string";
          }
          try {
            this._internalType = u, this._outputType = i, this._mimeType = y, o.checkSupport(u), this._worker = h.pipe(new n(u)), h.lock();
          } catch (x) {
            this._worker = new s("error"), this._worker.error(x);
          }
        }
        d.prototype = { accumulate: function(h) {
          return _(this, h);
        }, on: function(h, i) {
          var y = this;
          return h === "data" ? this._worker.on(h, function(u) {
            i.call(y, u.data, u.meta);
          }) : this._worker.on(h, function() {
            o.delay(i, arguments, y);
          }), this;
        }, resume: function() {
          return o.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(h) {
          if (o.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new g(this, { objectMode: this._outputType !== "nodebuffer" }, h);
        } }, a.exports = d;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, a, l) {
        if (l.base64 = !0, l.array = !0, l.string = !0, l.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", l.nodebuffer = typeof Buffer < "u", l.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") l.blob = !1;
        else {
          var o = new ArrayBuffer(0);
          try {
            l.blob = new Blob([o], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              n.append(o), l.blob = n.getBlob("application/zip").size === 0;
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
        for (var o = e("./utils"), n = e("./support"), s = e("./nodejsUtils"), f = e("./stream/GenericWorker"), p = new Array(256), b = 0; b < 256; b++) p[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        p[254] = p[254] = 1;
        function g() {
          f.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function _() {
          f.call(this, "utf-8 encode");
        }
        l.utf8encode = function(d) {
          return n.nodebuffer ? s.newBufferFrom(d, "utf-8") : (function(h) {
            var i, y, u, x, S, k = h.length, A = 0;
            for (x = 0; x < k; x++) (64512 & (y = h.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (u = h.charCodeAt(x + 1))) == 56320 && (y = 65536 + (y - 55296 << 10) + (u - 56320), x++), A += y < 128 ? 1 : y < 2048 ? 2 : y < 65536 ? 3 : 4;
            for (i = n.uint8array ? new Uint8Array(A) : new Array(A), x = S = 0; S < A; x++) (64512 & (y = h.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (u = h.charCodeAt(x + 1))) == 56320 && (y = 65536 + (y - 55296 << 10) + (u - 56320), x++), y < 128 ? i[S++] = y : (y < 2048 ? i[S++] = 192 | y >>> 6 : (y < 65536 ? i[S++] = 224 | y >>> 12 : (i[S++] = 240 | y >>> 18, i[S++] = 128 | y >>> 12 & 63), i[S++] = 128 | y >>> 6 & 63), i[S++] = 128 | 63 & y);
            return i;
          })(d);
        }, l.utf8decode = function(d) {
          return n.nodebuffer ? o.transformTo("nodebuffer", d).toString("utf-8") : (function(h) {
            var i, y, u, x, S = h.length, k = new Array(2 * S);
            for (i = y = 0; i < S; ) if ((u = h[i++]) < 128) k[y++] = u;
            else if (4 < (x = p[u])) k[y++] = 65533, i += x - 1;
            else {
              for (u &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && i < S; ) u = u << 6 | 63 & h[i++], x--;
              1 < x ? k[y++] = 65533 : u < 65536 ? k[y++] = u : (u -= 65536, k[y++] = 55296 | u >> 10 & 1023, k[y++] = 56320 | 1023 & u);
            }
            return k.length !== y && (k.subarray ? k = k.subarray(0, y) : k.length = y), o.applyFromCharCode(k);
          })(d = o.transformTo(n.uint8array ? "uint8array" : "array", d));
        }, o.inherits(g, f), g.prototype.processChunk = function(d) {
          var h = o.transformTo(n.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (n.uint8array) {
              var i = h;
              (h = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), h.set(i, this.leftOver.length);
            } else h = this.leftOver.concat(h);
            this.leftOver = null;
          }
          var y = (function(x, S) {
            var k;
            for ((S = S || x.length) > x.length && (S = x.length), k = S - 1; 0 <= k && (192 & x[k]) == 128; ) k--;
            return k < 0 || k === 0 ? S : k + p[x[k]] > S ? k : S;
          })(h), u = h;
          y !== h.length && (n.uint8array ? (u = h.subarray(0, y), this.leftOver = h.subarray(y, h.length)) : (u = h.slice(0, y), this.leftOver = h.slice(y, h.length))), this.push({ data: l.utf8decode(u), meta: d.meta });
        }, g.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = g, o.inherits(_, f), _.prototype.processChunk = function(d) {
          this.push({ data: l.utf8encode(d.data), meta: d.meta });
        }, l.Utf8EncodeWorker = _;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var o = e("./support"), n = e("./base64"), s = e("./nodejsUtils"), f = e("./external");
        function p(i) {
          return i;
        }
        function b(i, y) {
          for (var u = 0; u < i.length; ++u) y[u] = 255 & i.charCodeAt(u);
          return y;
        }
        e("setimmediate"), l.newBlob = function(i, y) {
          l.checkSupport("blob");
          try {
            return new Blob([i], { type: y });
          } catch {
            try {
              var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return u.append(i), u.getBlob(y);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var g = { stringifyByChunk: function(i, y, u) {
          var x = [], S = 0, k = i.length;
          if (k <= u) return String.fromCharCode.apply(null, i);
          for (; S < k; ) y === "array" || y === "nodebuffer" ? x.push(String.fromCharCode.apply(null, i.slice(S, Math.min(S + u, k)))) : x.push(String.fromCharCode.apply(null, i.subarray(S, Math.min(S + u, k)))), S += u;
          return x.join("");
        }, stringifyByChar: function(i) {
          for (var y = "", u = 0; u < i.length; u++) y += String.fromCharCode(i[u]);
          return y;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return o.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return o.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function _(i) {
          var y = 65536, u = l.getTypeOf(i), x = !0;
          if (u === "uint8array" ? x = g.applyCanBeUsed.uint8array : u === "nodebuffer" && (x = g.applyCanBeUsed.nodebuffer), x) for (; 1 < y; ) try {
            return g.stringifyByChunk(i, u, y);
          } catch {
            y = Math.floor(y / 2);
          }
          return g.stringifyByChar(i);
        }
        function d(i, y) {
          for (var u = 0; u < i.length; u++) y[u] = i[u];
          return y;
        }
        l.applyFromCharCode = _;
        var h = {};
        h.string = { string: p, array: function(i) {
          return b(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return h.string.uint8array(i).buffer;
        }, uint8array: function(i) {
          return b(i, new Uint8Array(i.length));
        }, nodebuffer: function(i) {
          return b(i, s.allocBuffer(i.length));
        } }, h.array = { string: _, array: p, arraybuffer: function(i) {
          return new Uint8Array(i).buffer;
        }, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return s.newBufferFrom(i);
        } }, h.arraybuffer = { string: function(i) {
          return _(new Uint8Array(i));
        }, array: function(i) {
          return d(new Uint8Array(i), new Array(i.byteLength));
        }, arraybuffer: p, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return s.newBufferFrom(new Uint8Array(i));
        } }, h.uint8array = { string: _, array: function(i) {
          return d(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return i.buffer;
        }, uint8array: p, nodebuffer: function(i) {
          return s.newBufferFrom(i);
        } }, h.nodebuffer = { string: _, array: function(i) {
          return d(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return h.nodebuffer.uint8array(i).buffer;
        }, uint8array: function(i) {
          return d(i, new Uint8Array(i.length));
        }, nodebuffer: p }, l.transformTo = function(i, y) {
          if (y = y || "", !i) return y;
          l.checkSupport(i);
          var u = l.getTypeOf(y);
          return h[u][i](y);
        }, l.resolve = function(i) {
          for (var y = i.split("/"), u = [], x = 0; x < y.length; x++) {
            var S = y[x];
            S === "." || S === "" && x !== 0 && x !== y.length - 1 || (S === ".." ? u.pop() : u.push(S));
          }
          return u.join("/");
        }, l.getTypeOf = function(i) {
          return typeof i == "string" ? "string" : Object.prototype.toString.call(i) === "[object Array]" ? "array" : o.nodebuffer && s.isBuffer(i) ? "nodebuffer" : o.uint8array && i instanceof Uint8Array ? "uint8array" : o.arraybuffer && i instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(i) {
          if (!o[i.toLowerCase()]) throw new Error(i + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(i) {
          var y, u, x = "";
          for (u = 0; u < (i || "").length; u++) x += "\\x" + ((y = i.charCodeAt(u)) < 16 ? "0" : "") + y.toString(16).toUpperCase();
          return x;
        }, l.delay = function(i, y, u) {
          setImmediate(function() {
            i.apply(u || null, y || []);
          });
        }, l.inherits = function(i, y) {
          function u() {
          }
          u.prototype = y.prototype, i.prototype = new u();
        }, l.extend = function() {
          var i, y, u = {};
          for (i = 0; i < arguments.length; i++) for (y in arguments[i]) Object.prototype.hasOwnProperty.call(arguments[i], y) && u[y] === void 0 && (u[y] = arguments[i][y]);
          return u;
        }, l.prepareContent = function(i, y, u, x, S) {
          return f.Promise.resolve(y).then(function(k) {
            return o.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new f.Promise(function(A, C) {
              var I = new FileReader();
              I.onload = function(L) {
                A(L.target.result);
              }, I.onerror = function(L) {
                C(L.target.error);
              }, I.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var A = l.getTypeOf(k);
            return A ? (A === "arraybuffer" ? k = l.transformTo("uint8array", k) : A === "string" && (S ? k = n.decode(k) : u && x !== !0 && (k = (function(C) {
              return b(C, o.uint8array ? new Uint8Array(C.length) : new Array(C.length));
            })(k))), k) : f.Promise.reject(new Error("Can't read the data of '" + i + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var o = e("./reader/readerFor"), n = e("./utils"), s = e("./signature"), f = e("./zipEntry"), p = e("./support");
        function b(g) {
          this.files = [], this.loadOptions = g;
        }
        b.prototype = { checkSignature: function(g) {
          if (!this.reader.readAndCheckSignature(g)) {
            this.reader.index -= 4;
            var _ = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + n.pretty(_) + ", expected " + n.pretty(g) + ")");
          }
        }, isSignature: function(g, _) {
          var d = this.reader.index;
          this.reader.setIndex(g);
          var h = this.reader.readString(4) === _;
          return this.reader.setIndex(d), h;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var g = this.reader.readData(this.zipCommentLength), _ = p.uint8array ? "uint8array" : "array", d = n.transformTo(_, g);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var g, _, d, h = this.zip64EndOfCentralSize - 44; 0 < h; ) g = this.reader.readInt(2), _ = this.reader.readInt(4), d = this.reader.readData(_), this.zip64ExtensibleData[g] = { id: g, length: _, value: d };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var g, _;
          for (g = 0; g < this.files.length; g++) _ = this.files[g], this.reader.setIndex(_.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), _.readLocalPart(this.reader), _.handleUTF8(), _.processAttributes();
        }, readCentralDir: function() {
          var g;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (g = new f({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(g);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var g = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (g < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(g);
          var _ = g;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (g = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(g), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var d = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);
          var h = _ - d;
          if (0 < h) this.isSignature(_, s.CENTRAL_FILE_HEADER) || (this.reader.zero = h);
          else if (h < 0) throw new Error("Corrupted zip: missing " + Math.abs(h) + " bytes.");
        }, prepareReader: function(g) {
          this.reader = o(g);
        }, load: function(g) {
          this.prepareReader(g), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var o = e("./reader/readerFor"), n = e("./utils"), s = e("./compressedObject"), f = e("./crc32"), p = e("./utf8"), b = e("./compressions"), g = e("./support");
        function _(d, h) {
          this.options = d, this.loadOptions = h;
        }
        _.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var h, i;
          if (d.skip(22), this.fileNameLength = d.readInt(2), i = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(i), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((h = (function(y) {
            for (var u in b) if (Object.prototype.hasOwnProperty.call(b, u) && b[u].magic === y) return b[u];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + n.pretty(this.compressionMethod) + " unknown (inner file : " + n.transformTo("string", this.fileName) + ")");
          this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, h, d.readData(this.compressedSize));
        }, readCentralPart: function(d) {
          this.versionMadeBy = d.readInt(2), d.skip(2), this.bitFlag = d.readInt(2), this.compressionMethod = d.readString(2), this.date = d.readDate(), this.crc32 = d.readInt(4), this.compressedSize = d.readInt(4), this.uncompressedSize = d.readInt(4);
          var h = d.readInt(2);
          if (this.extraFieldsLength = d.readInt(2), this.fileCommentLength = d.readInt(2), this.diskNumberStart = d.readInt(2), this.internalFileAttributes = d.readInt(2), this.externalFileAttributes = d.readInt(4), this.localHeaderOffset = d.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          d.skip(h), this.readExtraFields(d), this.parseZIP64ExtraField(d), this.fileComment = d.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var d = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), d == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), d == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var d = o(this.extraFields[1].value);
            this.uncompressedSize === n.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === n.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === n.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === n.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var h, i, y, u = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < u; ) h = d.readInt(2), i = d.readInt(2), y = d.readData(i), this.extraFields[h] = { id: h, length: i, value: y };
          d.setIndex(u);
        }, handleUTF8: function() {
          var d = g.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = p.utf8decode(this.fileName), this.fileCommentStr = p.utf8decode(this.fileComment);
          else {
            var h = this.findExtraFieldUnicodePath();
            if (h !== null) this.fileNameStr = h;
            else {
              var i = n.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(i);
            }
            var y = this.findExtraFieldUnicodeComment();
            if (y !== null) this.fileCommentStr = y;
            else {
              var u = n.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(u);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var h = o(d.value);
            return h.readInt(1) !== 1 || f(this.fileName) !== h.readInt(4) ? null : p.utf8decode(h.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var h = o(d.value);
            return h.readInt(1) !== 1 || f(this.fileComment) !== h.readInt(4) ? null : p.utf8decode(h.readData(d.length - 5));
          }
          return null;
        } }, a.exports = _;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function o(h, i, y) {
          this.name = h, this.dir = y.dir, this.date = y.date, this.comment = y.comment, this.unixPermissions = y.unixPermissions, this.dosPermissions = y.dosPermissions, this._data = i, this._dataBinary = y.binary, this.options = { compression: y.compression, compressionOptions: y.compressionOptions };
        }
        var n = e("./stream/StreamHelper"), s = e("./stream/DataWorker"), f = e("./utf8"), p = e("./compressedObject"), b = e("./stream/GenericWorker");
        o.prototype = { internalStream: function(h) {
          var i = null, y = "string";
          try {
            if (!h) throw new Error("No output type specified.");
            var u = (y = h.toLowerCase()) === "string" || y === "text";
            y !== "binarystring" && y !== "text" || (y = "string"), i = this._decompressWorker();
            var x = !this._dataBinary;
            x && !u && (i = i.pipe(new f.Utf8EncodeWorker())), !x && u && (i = i.pipe(new f.Utf8DecodeWorker()));
          } catch (S) {
            (i = new b("error")).error(S);
          }
          return new n(i, y, "");
        }, async: function(h, i) {
          return this.internalStream(h).accumulate(i);
        }, nodeStream: function(h, i) {
          return this.internalStream(h || "nodebuffer").toNodejsStream(i);
        }, _compressWorker: function(h, i) {
          if (this._data instanceof p && this._data.compression.magic === h.magic) return this._data.getCompressedWorker();
          var y = this._decompressWorker();
          return this._dataBinary || (y = y.pipe(new f.Utf8EncodeWorker())), p.createWorkerFrom(y, h, i);
        }, _decompressWorker: function() {
          return this._data instanceof p ? this._data.getContentWorker() : this._data instanceof b ? this._data : new s(this._data);
        } };
        for (var g = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], _ = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < g.length; d++) o.prototype[g[d]] = _;
        a.exports = o;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(o) {
          var n, s, f = o.MutationObserver || o.WebKitMutationObserver;
          if (f) {
            var p = 0, b = new f(h), g = o.document.createTextNode("");
            b.observe(g, { characterData: !0 }), n = function() {
              g.data = p = ++p % 2;
            };
          } else if (o.setImmediate || o.MessageChannel === void 0) n = "document" in o && "onreadystatechange" in o.document.createElement("script") ? function() {
            var i = o.document.createElement("script");
            i.onreadystatechange = function() {
              h(), i.onreadystatechange = null, i.parentNode.removeChild(i), i = null;
            }, o.document.documentElement.appendChild(i);
          } : function() {
            setTimeout(h, 0);
          };
          else {
            var _ = new o.MessageChannel();
            _.port1.onmessage = h, n = function() {
              _.port2.postMessage(0);
            };
          }
          var d = [];
          function h() {
            var i, y;
            s = !0;
            for (var u = d.length; u; ) {
              for (y = d, d = [], i = -1; ++i < u; ) y[i]();
              u = d.length;
            }
            s = !1;
          }
          a.exports = function(i) {
            d.push(i) !== 1 || s || n();
          };
        }).call(this, typeof Dt < "u" ? Dt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var o = e("immediate");
        function n() {
        }
        var s = {}, f = ["REJECTED"], p = ["FULFILLED"], b = ["PENDING"];
        function g(u) {
          if (typeof u != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, u !== n && i(this, u);
        }
        function _(u, x, S) {
          this.promise = u, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof S == "function" && (this.onRejected = S, this.callRejected = this.otherCallRejected);
        }
        function d(u, x, S) {
          o(function() {
            var k;
            try {
              k = x(S);
            } catch (A) {
              return s.reject(u, A);
            }
            k === u ? s.reject(u, new TypeError("Cannot resolve promise with itself")) : s.resolve(u, k);
          });
        }
        function h(u) {
          var x = u && u.then;
          if (u && (typeof u == "object" || typeof u == "function") && typeof x == "function") return function() {
            x.apply(u, arguments);
          };
        }
        function i(u, x) {
          var S = !1;
          function k(I) {
            S || (S = !0, s.reject(u, I));
          }
          function A(I) {
            S || (S = !0, s.resolve(u, I));
          }
          var C = y(function() {
            x(A, k);
          });
          C.status === "error" && k(C.value);
        }
        function y(u, x) {
          var S = {};
          try {
            S.value = u(x), S.status = "success";
          } catch (k) {
            S.status = "error", S.value = k;
          }
          return S;
        }
        (a.exports = g).prototype.finally = function(u) {
          if (typeof u != "function") return this;
          var x = this.constructor;
          return this.then(function(S) {
            return x.resolve(u()).then(function() {
              return S;
            });
          }, function(S) {
            return x.resolve(u()).then(function() {
              throw S;
            });
          });
        }, g.prototype.catch = function(u) {
          return this.then(null, u);
        }, g.prototype.then = function(u, x) {
          if (typeof u != "function" && this.state === p || typeof x != "function" && this.state === f) return this;
          var S = new this.constructor(n);
          return this.state !== b ? d(S, this.state === p ? u : x, this.outcome) : this.queue.push(new _(S, u, x)), S;
        }, _.prototype.callFulfilled = function(u) {
          s.resolve(this.promise, u);
        }, _.prototype.otherCallFulfilled = function(u) {
          d(this.promise, this.onFulfilled, u);
        }, _.prototype.callRejected = function(u) {
          s.reject(this.promise, u);
        }, _.prototype.otherCallRejected = function(u) {
          d(this.promise, this.onRejected, u);
        }, s.resolve = function(u, x) {
          var S = y(h, x);
          if (S.status === "error") return s.reject(u, S.value);
          var k = S.value;
          if (k) i(u, k);
          else {
            u.state = p, u.outcome = x;
            for (var A = -1, C = u.queue.length; ++A < C; ) u.queue[A].callFulfilled(x);
          }
          return u;
        }, s.reject = function(u, x) {
          u.state = f, u.outcome = x;
          for (var S = -1, k = u.queue.length; ++S < k; ) u.queue[S].callRejected(x);
          return u;
        }, g.resolve = function(u) {
          return u instanceof this ? u : s.resolve(new this(n), u);
        }, g.reject = function(u) {
          var x = new this(n);
          return s.reject(x, u);
        }, g.all = function(u) {
          var x = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = u.length, k = !1;
          if (!S) return this.resolve([]);
          for (var A = new Array(S), C = 0, I = -1, L = new this(n); ++I < S; ) z(u[I], I);
          return L;
          function z(U, K) {
            x.resolve(U).then(function(M) {
              A[K] = M, ++C !== S || k || (k = !0, s.resolve(L, A));
            }, function(M) {
              k || (k = !0, s.reject(L, M));
            });
          }
        }, g.race = function(u) {
          var x = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var S = u.length, k = !1;
          if (!S) return this.resolve([]);
          for (var A = -1, C = new this(n); ++A < S; ) I = u[A], x.resolve(I).then(function(L) {
            k || (k = !0, s.resolve(C, L));
          }, function(L) {
            k || (k = !0, s.reject(C, L));
          });
          var I;
          return C;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var o = {};
        (0, e("./lib/utils/common").assign)(o, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = o;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var o = e("./zlib/deflate"), n = e("./utils/common"), s = e("./utils/strings"), f = e("./zlib/messages"), p = e("./zlib/zstream"), b = Object.prototype.toString, g = 0, _ = -1, d = 0, h = 8;
        function i(u) {
          if (!(this instanceof i)) return new i(u);
          this.options = n.assign({ level: _, method: h, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, u || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p(), this.strm.avail_out = 0;
          var S = o.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (S !== g) throw new Error(f[S]);
          if (x.header && o.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var k;
            if (k = typeof x.dictionary == "string" ? s.string2buf(x.dictionary) : b.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (S = o.deflateSetDictionary(this.strm, k)) !== g) throw new Error(f[S]);
            this._dict_set = !0;
          }
        }
        function y(u, x) {
          var S = new i(x);
          if (S.push(u, !0), S.err) throw S.msg || f[S.err];
          return S.result;
        }
        i.prototype.push = function(u, x) {
          var S, k, A = this.strm, C = this.options.chunkSize;
          if (this.ended) return !1;
          k = x === ~~x ? x : x === !0 ? 4 : 0, typeof u == "string" ? A.input = s.string2buf(u) : b.call(u) === "[object ArrayBuffer]" ? A.input = new Uint8Array(u) : A.input = u, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new n.Buf8(C), A.next_out = 0, A.avail_out = C), (S = o.deflate(A, k)) !== 1 && S !== g) return this.onEnd(S), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(n.shrinkBuf(A.output, A.next_out))) : this.onData(n.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && S !== 1);
          return k === 4 ? (S = o.deflateEnd(this.strm), this.onEnd(S), this.ended = !0, S === g) : k !== 2 || (this.onEnd(g), !(A.avail_out = 0));
        }, i.prototype.onData = function(u) {
          this.chunks.push(u);
        }, i.prototype.onEnd = function(u) {
          u === g && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, l.Deflate = i, l.deflate = y, l.deflateRaw = function(u, x) {
          return (x = x || {}).raw = !0, y(u, x);
        }, l.gzip = function(u, x) {
          return (x = x || {}).gzip = !0, y(u, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var o = e("./zlib/inflate"), n = e("./utils/common"), s = e("./utils/strings"), f = e("./zlib/constants"), p = e("./zlib/messages"), b = e("./zlib/zstream"), g = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function d(i) {
          if (!(this instanceof d)) return new d(i);
          this.options = n.assign({ chunkSize: 16384, windowBits: 0, to: "" }, i || {});
          var y = this.options;
          y.raw && 0 <= y.windowBits && y.windowBits < 16 && (y.windowBits = -y.windowBits, y.windowBits === 0 && (y.windowBits = -15)), !(0 <= y.windowBits && y.windowBits < 16) || i && i.windowBits || (y.windowBits += 32), 15 < y.windowBits && y.windowBits < 48 && (15 & y.windowBits) == 0 && (y.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var u = o.inflateInit2(this.strm, y.windowBits);
          if (u !== f.Z_OK) throw new Error(p[u]);
          this.header = new g(), o.inflateGetHeader(this.strm, this.header);
        }
        function h(i, y) {
          var u = new d(y);
          if (u.push(i, !0), u.err) throw u.msg || p[u.err];
          return u.result;
        }
        d.prototype.push = function(i, y) {
          var u, x, S, k, A, C, I = this.strm, L = this.options.chunkSize, z = this.options.dictionary, U = !1;
          if (this.ended) return !1;
          x = y === ~~y ? y : y === !0 ? f.Z_FINISH : f.Z_NO_FLUSH, typeof i == "string" ? I.input = s.binstring2buf(i) : _.call(i) === "[object ArrayBuffer]" ? I.input = new Uint8Array(i) : I.input = i, I.next_in = 0, I.avail_in = I.input.length;
          do {
            if (I.avail_out === 0 && (I.output = new n.Buf8(L), I.next_out = 0, I.avail_out = L), (u = o.inflate(I, f.Z_NO_FLUSH)) === f.Z_NEED_DICT && z && (C = typeof z == "string" ? s.string2buf(z) : _.call(z) === "[object ArrayBuffer]" ? new Uint8Array(z) : z, u = o.inflateSetDictionary(this.strm, C)), u === f.Z_BUF_ERROR && U === !0 && (u = f.Z_OK, U = !1), u !== f.Z_STREAM_END && u !== f.Z_OK) return this.onEnd(u), !(this.ended = !0);
            I.next_out && (I.avail_out !== 0 && u !== f.Z_STREAM_END && (I.avail_in !== 0 || x !== f.Z_FINISH && x !== f.Z_SYNC_FLUSH) || (this.options.to === "string" ? (S = s.utf8border(I.output, I.next_out), k = I.next_out - S, A = s.buf2string(I.output, S), I.next_out = k, I.avail_out = L - k, k && n.arraySet(I.output, I.output, S, k, 0), this.onData(A)) : this.onData(n.shrinkBuf(I.output, I.next_out)))), I.avail_in === 0 && I.avail_out === 0 && (U = !0);
          } while ((0 < I.avail_in || I.avail_out === 0) && u !== f.Z_STREAM_END);
          return u === f.Z_STREAM_END && (x = f.Z_FINISH), x === f.Z_FINISH ? (u = o.inflateEnd(this.strm), this.onEnd(u), this.ended = !0, u === f.Z_OK) : x !== f.Z_SYNC_FLUSH || (this.onEnd(f.Z_OK), !(I.avail_out = 0));
        }, d.prototype.onData = function(i) {
          this.chunks.push(i);
        }, d.prototype.onEnd = function(i) {
          i === f.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
        }, l.Inflate = d, l.inflate = h, l.inflateRaw = function(i, y) {
          return (y = y || {}).raw = !0, h(i, y);
        }, l.ungzip = h;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var o = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(f) {
          for (var p = Array.prototype.slice.call(arguments, 1); p.length; ) {
            var b = p.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var g in b) b.hasOwnProperty(g) && (f[g] = b[g]);
            }
          }
          return f;
        }, l.shrinkBuf = function(f, p) {
          return f.length === p ? f : f.subarray ? f.subarray(0, p) : (f.length = p, f);
        };
        var n = { arraySet: function(f, p, b, g, _) {
          if (p.subarray && f.subarray) f.set(p.subarray(b, b + g), _);
          else for (var d = 0; d < g; d++) f[_ + d] = p[b + d];
        }, flattenChunks: function(f) {
          var p, b, g, _, d, h;
          for (p = g = 0, b = f.length; p < b; p++) g += f[p].length;
          for (h = new Uint8Array(g), p = _ = 0, b = f.length; p < b; p++) d = f[p], h.set(d, _), _ += d.length;
          return h;
        } }, s = { arraySet: function(f, p, b, g, _) {
          for (var d = 0; d < g; d++) f[_ + d] = p[b + d];
        }, flattenChunks: function(f) {
          return [].concat.apply([], f);
        } };
        l.setTyped = function(f) {
          f ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, n)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, s));
        }, l.setTyped(o);
      }, {}], 42: [function(e, a, l) {
        var o = e("./common"), n = !0, s = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          n = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          s = !1;
        }
        for (var f = new o.Buf8(256), p = 0; p < 256; p++) f[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1;
        function b(g, _) {
          if (_ < 65537 && (g.subarray && s || !g.subarray && n)) return String.fromCharCode.apply(null, o.shrinkBuf(g, _));
          for (var d = "", h = 0; h < _; h++) d += String.fromCharCode(g[h]);
          return d;
        }
        f[254] = f[254] = 1, l.string2buf = function(g) {
          var _, d, h, i, y, u = g.length, x = 0;
          for (i = 0; i < u; i++) (64512 & (d = g.charCodeAt(i))) == 55296 && i + 1 < u && (64512 & (h = g.charCodeAt(i + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), i++), x += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (_ = new o.Buf8(x), i = y = 0; y < x; i++) (64512 & (d = g.charCodeAt(i))) == 55296 && i + 1 < u && (64512 & (h = g.charCodeAt(i + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), i++), d < 128 ? _[y++] = d : (d < 2048 ? _[y++] = 192 | d >>> 6 : (d < 65536 ? _[y++] = 224 | d >>> 12 : (_[y++] = 240 | d >>> 18, _[y++] = 128 | d >>> 12 & 63), _[y++] = 128 | d >>> 6 & 63), _[y++] = 128 | 63 & d);
          return _;
        }, l.buf2binstring = function(g) {
          return b(g, g.length);
        }, l.binstring2buf = function(g) {
          for (var _ = new o.Buf8(g.length), d = 0, h = _.length; d < h; d++) _[d] = g.charCodeAt(d);
          return _;
        }, l.buf2string = function(g, _) {
          var d, h, i, y, u = _ || g.length, x = new Array(2 * u);
          for (d = h = 0; d < u; ) if ((i = g[d++]) < 128) x[h++] = i;
          else if (4 < (y = f[i])) x[h++] = 65533, d += y - 1;
          else {
            for (i &= y === 2 ? 31 : y === 3 ? 15 : 7; 1 < y && d < u; ) i = i << 6 | 63 & g[d++], y--;
            1 < y ? x[h++] = 65533 : i < 65536 ? x[h++] = i : (i -= 65536, x[h++] = 55296 | i >> 10 & 1023, x[h++] = 56320 | 1023 & i);
          }
          return b(x, h);
        }, l.utf8border = function(g, _) {
          var d;
          for ((_ = _ || g.length) > g.length && (_ = g.length), d = _ - 1; 0 <= d && (192 & g[d]) == 128; ) d--;
          return d < 0 || d === 0 ? _ : d + f[g[d]] > _ ? d : _;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(o, n, s, f) {
          for (var p = 65535 & o | 0, b = o >>> 16 & 65535 | 0, g = 0; s !== 0; ) {
            for (s -= g = 2e3 < s ? 2e3 : s; b = b + (p = p + n[f++] | 0) | 0, --g; ) ;
            p %= 65521, b %= 65521;
          }
          return p | b << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var o = (function() {
          for (var n, s = [], f = 0; f < 256; f++) {
            n = f;
            for (var p = 0; p < 8; p++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            s[f] = n;
          }
          return s;
        })();
        a.exports = function(n, s, f, p) {
          var b = o, g = p + f;
          n ^= -1;
          for (var _ = p; _ < g; _++) n = n >>> 8 ^ b[255 & (n ^ s[_])];
          return -1 ^ n;
        };
      }, {}], 46: [function(e, a, l) {
        var o, n = e("../utils/common"), s = e("./trees"), f = e("./adler32"), p = e("./crc32"), b = e("./messages"), g = 0, _ = 4, d = 0, h = -2, i = -1, y = 4, u = 2, x = 8, S = 9, k = 286, A = 30, C = 19, I = 2 * k + 1, L = 15, z = 3, U = 258, K = U + z + 1, M = 42, N = 113, c = 1, $ = 2, nt = 3, X = 4;
        function ot(r, O) {
          return r.msg = b[O], O;
        }
        function Z(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function it(r) {
          for (var O = r.length; 0 <= --O; ) r[O] = 0;
        }
        function F(r) {
          var O = r.state, E = O.pending;
          E > r.avail_out && (E = r.avail_out), E !== 0 && (n.arraySet(r.output, O.pending_buf, O.pending_out, E, r.next_out), r.next_out += E, O.pending_out += E, r.total_out += E, r.avail_out -= E, O.pending -= E, O.pending === 0 && (O.pending_out = 0));
        }
        function P(r, O) {
          s._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, O), r.block_start = r.strstart, F(r.strm);
        }
        function rt(r, O) {
          r.pending_buf[r.pending++] = O;
        }
        function J(r, O) {
          r.pending_buf[r.pending++] = O >>> 8 & 255, r.pending_buf[r.pending++] = 255 & O;
        }
        function q(r, O) {
          var E, w, v = r.max_chain_length, R = r.strstart, D = r.prev_length, W = r.nice_match, T = r.strstart > r.w_size - K ? r.strstart - (r.w_size - K) : 0, G = r.window, tt = r.w_mask, Y = r.prev, et = r.strstart + U, st = G[R + D - 1], at = G[R + D];
          r.prev_length >= r.good_match && (v >>= 2), W > r.lookahead && (W = r.lookahead);
          do
            if (G[(E = O) + D] === at && G[E + D - 1] === st && G[E] === G[R] && G[++E] === G[R + 1]) {
              R += 2, E++;
              do
                ;
              while (G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && G[++R] === G[++E] && R < et);
              if (w = U - (et - R), R = et - U, D < w) {
                if (r.match_start = O, W <= (D = w)) break;
                st = G[R + D - 1], at = G[R + D];
              }
            }
          while ((O = Y[O & tt]) > T && --v != 0);
          return D <= r.lookahead ? D : r.lookahead;
        }
        function dt(r) {
          var O, E, w, v, R, D, W, T, G, tt, Y = r.w_size;
          do {
            if (v = r.window_size - r.lookahead - r.strstart, r.strstart >= Y + (Y - K)) {
              for (n.arraySet(r.window, r.window, Y, Y, 0), r.match_start -= Y, r.strstart -= Y, r.block_start -= Y, O = E = r.hash_size; w = r.head[--O], r.head[O] = Y <= w ? w - Y : 0, --E; ) ;
              for (O = E = Y; w = r.prev[--O], r.prev[O] = Y <= w ? w - Y : 0, --E; ) ;
              v += Y;
            }
            if (r.strm.avail_in === 0) break;
            if (D = r.strm, W = r.window, T = r.strstart + r.lookahead, G = v, tt = void 0, tt = D.avail_in, G < tt && (tt = G), E = tt === 0 ? 0 : (D.avail_in -= tt, n.arraySet(W, D.input, D.next_in, tt, T), D.state.wrap === 1 ? D.adler = f(D.adler, W, tt, T) : D.state.wrap === 2 && (D.adler = p(D.adler, W, tt, T)), D.next_in += tt, D.total_in += tt, tt), r.lookahead += E, r.lookahead + r.insert >= z) for (R = r.strstart - r.insert, r.ins_h = r.window[R], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[R + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[R + z - 1]) & r.hash_mask, r.prev[R & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = R, R++, r.insert--, !(r.lookahead + r.insert < z)); ) ;
          } while (r.lookahead < K && r.strm.avail_in !== 0);
        }
        function ut(r, O) {
          for (var E, w; ; ) {
            if (r.lookahead < K) {
              if (dt(r), r.lookahead < K && O === g) return c;
              if (r.lookahead === 0) break;
            }
            if (E = 0, r.lookahead >= z && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), E !== 0 && r.strstart - E <= r.w_size - K && (r.match_length = q(r, E)), r.match_length >= z) if (w = s._tr_tally(r, r.strstart - r.match_start, r.match_length - z), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= z) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else w = s._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (w && (P(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < z - 1 ? r.strstart : z - 1, O === _ ? (P(r, !0), r.strm.avail_out === 0 ? nt : X) : r.last_lit && (P(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function lt(r, O) {
          for (var E, w, v; ; ) {
            if (r.lookahead < K) {
              if (dt(r), r.lookahead < K && O === g) return c;
              if (r.lookahead === 0) break;
            }
            if (E = 0, r.lookahead >= z && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = z - 1, E !== 0 && r.prev_length < r.max_lazy_match && r.strstart - E <= r.w_size - K && (r.match_length = q(r, E), r.match_length <= 5 && (r.strategy === 1 || r.match_length === z && 4096 < r.strstart - r.match_start) && (r.match_length = z - 1)), r.prev_length >= z && r.match_length <= r.prev_length) {
              for (v = r.strstart + r.lookahead - z, w = s._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - z), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= v && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = z - 1, r.strstart++, w && (P(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((w = s._tr_tally(r, 0, r.window[r.strstart - 1])) && P(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (w = s._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < z - 1 ? r.strstart : z - 1, O === _ ? (P(r, !0), r.strm.avail_out === 0 ? nt : X) : r.last_lit && (P(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function ct(r, O, E, w, v) {
          this.good_length = r, this.max_lazy = O, this.nice_length = E, this.max_chain = w, this.func = v;
        }
        function B() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(2 * I), this.dyn_dtree = new n.Buf16(2 * (2 * A + 1)), this.bl_tree = new n.Buf16(2 * (2 * C + 1)), it(this.dyn_ltree), it(this.dyn_dtree), it(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(L + 1), this.heap = new n.Buf16(2 * k + 1), it(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * k + 1), it(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function j(r) {
          var O;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = u, (O = r.state).pending = 0, O.pending_out = 0, O.wrap < 0 && (O.wrap = -O.wrap), O.status = O.wrap ? M : N, r.adler = O.wrap === 2 ? 0 : 1, O.last_flush = g, s._tr_init(O), d) : ot(r, h);
        }
        function Q(r) {
          var O = j(r);
          return O === d && (function(E) {
            E.window_size = 2 * E.w_size, it(E.head), E.max_lazy_match = o[E.level].max_lazy, E.good_match = o[E.level].good_length, E.nice_match = o[E.level].nice_length, E.max_chain_length = o[E.level].max_chain, E.strstart = 0, E.block_start = 0, E.lookahead = 0, E.insert = 0, E.match_length = E.prev_length = z - 1, E.match_available = 0, E.ins_h = 0;
          })(r.state), O;
        }
        function V(r, O, E, w, v, R) {
          if (!r) return h;
          var D = 1;
          if (O === i && (O = 6), w < 0 ? (D = 0, w = -w) : 15 < w && (D = 2, w -= 16), v < 1 || S < v || E !== x || w < 8 || 15 < w || O < 0 || 9 < O || R < 0 || y < R) return ot(r, h);
          w === 8 && (w = 9);
          var W = new B();
          return (r.state = W).strm = r, W.wrap = D, W.gzhead = null, W.w_bits = w, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = v + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + z - 1) / z), W.window = new n.Buf8(2 * W.w_size), W.head = new n.Buf16(W.hash_size), W.prev = new n.Buf16(W.w_size), W.lit_bufsize = 1 << v + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new n.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = O, W.strategy = R, W.method = E, Q(r);
        }
        o = [new ct(0, 0, 0, 0, function(r, O) {
          var E = 65535;
          for (E > r.pending_buf_size - 5 && (E = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (dt(r), r.lookahead === 0 && O === g) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var w = r.block_start + E;
            if ((r.strstart === 0 || r.strstart >= w) && (r.lookahead = r.strstart - w, r.strstart = w, P(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - K && (P(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, O === _ ? (P(r, !0), r.strm.avail_out === 0 ? nt : X) : (r.strstart > r.block_start && (P(r, !1), r.strm.avail_out), c);
        }), new ct(4, 4, 8, 4, ut), new ct(4, 5, 16, 8, ut), new ct(4, 6, 32, 32, ut), new ct(4, 4, 16, 16, lt), new ct(8, 16, 32, 32, lt), new ct(8, 16, 128, 128, lt), new ct(8, 32, 128, 256, lt), new ct(32, 128, 258, 1024, lt), new ct(32, 258, 258, 4096, lt)], l.deflateInit = function(r, O) {
          return V(r, O, x, 15, 8, 0);
        }, l.deflateInit2 = V, l.deflateReset = Q, l.deflateResetKeep = j, l.deflateSetHeader = function(r, O) {
          return r && r.state ? r.state.wrap !== 2 ? h : (r.state.gzhead = O, d) : h;
        }, l.deflate = function(r, O) {
          var E, w, v, R;
          if (!r || !r.state || 5 < O || O < 0) return r ? ot(r, h) : h;
          if (w = r.state, !r.output || !r.input && r.avail_in !== 0 || w.status === 666 && O !== _) return ot(r, r.avail_out === 0 ? -5 : h);
          if (w.strm = r, E = w.last_flush, w.last_flush = O, w.status === M) if (w.wrap === 2) r.adler = 0, rt(w, 31), rt(w, 139), rt(w, 8), w.gzhead ? (rt(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), rt(w, 255 & w.gzhead.time), rt(w, w.gzhead.time >> 8 & 255), rt(w, w.gzhead.time >> 16 & 255), rt(w, w.gzhead.time >> 24 & 255), rt(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), rt(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (rt(w, 255 & w.gzhead.extra.length), rt(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (r.adler = p(r.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (rt(w, 0), rt(w, 0), rt(w, 0), rt(w, 0), rt(w, 0), rt(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), rt(w, 3), w.status = N);
          else {
            var D = x + (w.w_bits - 8 << 4) << 8;
            D |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (D |= 32), D += 31 - D % 31, w.status = N, J(w, D), w.strstart !== 0 && (J(w, r.adler >>> 16), J(w, 65535 & r.adler)), r.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (v = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), F(r), v = w.pending, w.pending !== w.pending_buf_size)); ) rt(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            v = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), F(r), v = w.pending, w.pending === w.pending_buf_size)) {
                R = 1;
                break;
              }
              R = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, rt(w, R);
            } while (R !== 0);
            w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), R === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            v = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), F(r), v = w.pending, w.pending === w.pending_buf_size)) {
                R = 1;
                break;
              }
              R = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, rt(w, R);
            } while (R !== 0);
            w.gzhead.hcrc && w.pending > v && (r.adler = p(r.adler, w.pending_buf, w.pending - v, v)), R === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && F(r), w.pending + 2 <= w.pending_buf_size && (rt(w, 255 & r.adler), rt(w, r.adler >> 8 & 255), r.adler = 0, w.status = N)) : w.status = N), w.pending !== 0) {
            if (F(r), r.avail_out === 0) return w.last_flush = -1, d;
          } else if (r.avail_in === 0 && Z(O) <= Z(E) && O !== _) return ot(r, -5);
          if (w.status === 666 && r.avail_in !== 0) return ot(r, -5);
          if (r.avail_in !== 0 || w.lookahead !== 0 || O !== g && w.status !== 666) {
            var W = w.strategy === 2 ? (function(T, G) {
              for (var tt; ; ) {
                if (T.lookahead === 0 && (dt(T), T.lookahead === 0)) {
                  if (G === g) return c;
                  break;
                }
                if (T.match_length = 0, tt = s._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++, tt && (P(T, !1), T.strm.avail_out === 0)) return c;
              }
              return T.insert = 0, G === _ ? (P(T, !0), T.strm.avail_out === 0 ? nt : X) : T.last_lit && (P(T, !1), T.strm.avail_out === 0) ? c : $;
            })(w, O) : w.strategy === 3 ? (function(T, G) {
              for (var tt, Y, et, st, at = T.window; ; ) {
                if (T.lookahead <= U) {
                  if (dt(T), T.lookahead <= U && G === g) return c;
                  if (T.lookahead === 0) break;
                }
                if (T.match_length = 0, T.lookahead >= z && 0 < T.strstart && (Y = at[et = T.strstart - 1]) === at[++et] && Y === at[++et] && Y === at[++et]) {
                  st = T.strstart + U;
                  do
                    ;
                  while (Y === at[++et] && Y === at[++et] && Y === at[++et] && Y === at[++et] && Y === at[++et] && Y === at[++et] && Y === at[++et] && Y === at[++et] && et < st);
                  T.match_length = U - (st - et), T.match_length > T.lookahead && (T.match_length = T.lookahead);
                }
                if (T.match_length >= z ? (tt = s._tr_tally(T, 1, T.match_length - z), T.lookahead -= T.match_length, T.strstart += T.match_length, T.match_length = 0) : (tt = s._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++), tt && (P(T, !1), T.strm.avail_out === 0)) return c;
              }
              return T.insert = 0, G === _ ? (P(T, !0), T.strm.avail_out === 0 ? nt : X) : T.last_lit && (P(T, !1), T.strm.avail_out === 0) ? c : $;
            })(w, O) : o[w.level].func(w, O);
            if (W !== nt && W !== X || (w.status = 666), W === c || W === nt) return r.avail_out === 0 && (w.last_flush = -1), d;
            if (W === $ && (O === 1 ? s._tr_align(w) : O !== 5 && (s._tr_stored_block(w, 0, 0, !1), O === 3 && (it(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), F(r), r.avail_out === 0)) return w.last_flush = -1, d;
          }
          return O !== _ ? d : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (rt(w, 255 & r.adler), rt(w, r.adler >> 8 & 255), rt(w, r.adler >> 16 & 255), rt(w, r.adler >> 24 & 255), rt(w, 255 & r.total_in), rt(w, r.total_in >> 8 & 255), rt(w, r.total_in >> 16 & 255), rt(w, r.total_in >> 24 & 255)) : (J(w, r.adler >>> 16), J(w, 65535 & r.adler)), F(r), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? d : 1);
        }, l.deflateEnd = function(r) {
          var O;
          return r && r.state ? (O = r.state.status) !== M && O !== 69 && O !== 73 && O !== 91 && O !== 103 && O !== N && O !== 666 ? ot(r, h) : (r.state = null, O === N ? ot(r, -3) : d) : h;
        }, l.deflateSetDictionary = function(r, O) {
          var E, w, v, R, D, W, T, G, tt = O.length;
          if (!r || !r.state || (R = (E = r.state).wrap) === 2 || R === 1 && E.status !== M || E.lookahead) return h;
          for (R === 1 && (r.adler = f(r.adler, O, tt, 0)), E.wrap = 0, tt >= E.w_size && (R === 0 && (it(E.head), E.strstart = 0, E.block_start = 0, E.insert = 0), G = new n.Buf8(E.w_size), n.arraySet(G, O, tt - E.w_size, E.w_size, 0), O = G, tt = E.w_size), D = r.avail_in, W = r.next_in, T = r.input, r.avail_in = tt, r.next_in = 0, r.input = O, dt(E); E.lookahead >= z; ) {
            for (w = E.strstart, v = E.lookahead - (z - 1); E.ins_h = (E.ins_h << E.hash_shift ^ E.window[w + z - 1]) & E.hash_mask, E.prev[w & E.w_mask] = E.head[E.ins_h], E.head[E.ins_h] = w, w++, --v; ) ;
            E.strstart = w, E.lookahead = z - 1, dt(E);
          }
          return E.strstart += E.lookahead, E.block_start = E.strstart, E.insert = E.lookahead, E.lookahead = 0, E.match_length = E.prev_length = z - 1, E.match_available = 0, r.next_in = W, r.input = T, r.avail_in = D, E.wrap = R, d;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(o, n) {
          var s, f, p, b, g, _, d, h, i, y, u, x, S, k, A, C, I, L, z, U, K, M, N, c, $;
          s = o.state, f = o.next_in, c = o.input, p = f + (o.avail_in - 5), b = o.next_out, $ = o.output, g = b - (n - o.avail_out), _ = b + (o.avail_out - 257), d = s.dmax, h = s.wsize, i = s.whave, y = s.wnext, u = s.window, x = s.hold, S = s.bits, k = s.lencode, A = s.distcode, C = (1 << s.lenbits) - 1, I = (1 << s.distbits) - 1;
          t: do {
            S < 15 && (x += c[f++] << S, S += 8, x += c[f++] << S, S += 8), L = k[x & C];
            e: for (; ; ) {
              if (x >>>= z = L >>> 24, S -= z, (z = L >>> 16 & 255) === 0) $[b++] = 65535 & L;
              else {
                if (!(16 & z)) {
                  if ((64 & z) == 0) {
                    L = k[(65535 & L) + (x & (1 << z) - 1)];
                    continue e;
                  }
                  if (32 & z) {
                    s.mode = 12;
                    break t;
                  }
                  o.msg = "invalid literal/length code", s.mode = 30;
                  break t;
                }
                U = 65535 & L, (z &= 15) && (S < z && (x += c[f++] << S, S += 8), U += x & (1 << z) - 1, x >>>= z, S -= z), S < 15 && (x += c[f++] << S, S += 8, x += c[f++] << S, S += 8), L = A[x & I];
                r: for (; ; ) {
                  if (x >>>= z = L >>> 24, S -= z, !(16 & (z = L >>> 16 & 255))) {
                    if ((64 & z) == 0) {
                      L = A[(65535 & L) + (x & (1 << z) - 1)];
                      continue r;
                    }
                    o.msg = "invalid distance code", s.mode = 30;
                    break t;
                  }
                  if (K = 65535 & L, S < (z &= 15) && (x += c[f++] << S, (S += 8) < z && (x += c[f++] << S, S += 8)), d < (K += x & (1 << z) - 1)) {
                    o.msg = "invalid distance too far back", s.mode = 30;
                    break t;
                  }
                  if (x >>>= z, S -= z, (z = b - g) < K) {
                    if (i < (z = K - z) && s.sane) {
                      o.msg = "invalid distance too far back", s.mode = 30;
                      break t;
                    }
                    if (N = u, (M = 0) === y) {
                      if (M += h - z, z < U) {
                        for (U -= z; $[b++] = u[M++], --z; ) ;
                        M = b - K, N = $;
                      }
                    } else if (y < z) {
                      if (M += h + y - z, (z -= y) < U) {
                        for (U -= z; $[b++] = u[M++], --z; ) ;
                        if (M = 0, y < U) {
                          for (U -= z = y; $[b++] = u[M++], --z; ) ;
                          M = b - K, N = $;
                        }
                      }
                    } else if (M += y - z, z < U) {
                      for (U -= z; $[b++] = u[M++], --z; ) ;
                      M = b - K, N = $;
                    }
                    for (; 2 < U; ) $[b++] = N[M++], $[b++] = N[M++], $[b++] = N[M++], U -= 3;
                    U && ($[b++] = N[M++], 1 < U && ($[b++] = N[M++]));
                  } else {
                    for (M = b - K; $[b++] = $[M++], $[b++] = $[M++], $[b++] = $[M++], 2 < (U -= 3); ) ;
                    U && ($[b++] = $[M++], 1 < U && ($[b++] = $[M++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (f < p && b < _);
          f -= U = S >> 3, x &= (1 << (S -= U << 3)) - 1, o.next_in = f, o.next_out = b, o.avail_in = f < p ? p - f + 5 : 5 - (f - p), o.avail_out = b < _ ? _ - b + 257 : 257 - (b - _), s.hold = x, s.bits = S;
        };
      }, {}], 49: [function(e, a, l) {
        var o = e("../utils/common"), n = e("./adler32"), s = e("./crc32"), f = e("./inffast"), p = e("./inftrees"), b = 1, g = 2, _ = 0, d = -2, h = 1, i = 852, y = 592;
        function u(M) {
          return (M >>> 24 & 255) + (M >>> 8 & 65280) + ((65280 & M) << 8) + ((255 & M) << 24);
        }
        function x() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new o.Buf16(320), this.work = new o.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function S(M) {
          var N;
          return M && M.state ? (N = M.state, M.total_in = M.total_out = N.total = 0, M.msg = "", N.wrap && (M.adler = 1 & N.wrap), N.mode = h, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new o.Buf32(i), N.distcode = N.distdyn = new o.Buf32(y), N.sane = 1, N.back = -1, _) : d;
        }
        function k(M) {
          var N;
          return M && M.state ? ((N = M.state).wsize = 0, N.whave = 0, N.wnext = 0, S(M)) : d;
        }
        function A(M, N) {
          var c, $;
          return M && M.state ? ($ = M.state, N < 0 ? (c = 0, N = -N) : (c = 1 + (N >> 4), N < 48 && (N &= 15)), N && (N < 8 || 15 < N) ? d : ($.window !== null && $.wbits !== N && ($.window = null), $.wrap = c, $.wbits = N, k(M))) : d;
        }
        function C(M, N) {
          var c, $;
          return M ? ($ = new x(), (M.state = $).window = null, (c = A(M, N)) !== _ && (M.state = null), c) : d;
        }
        var I, L, z = !0;
        function U(M) {
          if (z) {
            var N;
            for (I = new o.Buf32(512), L = new o.Buf32(32), N = 0; N < 144; ) M.lens[N++] = 8;
            for (; N < 256; ) M.lens[N++] = 9;
            for (; N < 280; ) M.lens[N++] = 7;
            for (; N < 288; ) M.lens[N++] = 8;
            for (p(b, M.lens, 0, 288, I, 0, M.work, { bits: 9 }), N = 0; N < 32; ) M.lens[N++] = 5;
            p(g, M.lens, 0, 32, L, 0, M.work, { bits: 5 }), z = !1;
          }
          M.lencode = I, M.lenbits = 9, M.distcode = L, M.distbits = 5;
        }
        function K(M, N, c, $) {
          var nt, X = M.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new o.Buf8(X.wsize)), $ >= X.wsize ? (o.arraySet(X.window, N, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : ($ < (nt = X.wsize - X.wnext) && (nt = $), o.arraySet(X.window, N, c - $, nt, X.wnext), ($ -= nt) ? (o.arraySet(X.window, N, c - $, $, 0), X.wnext = $, X.whave = X.wsize) : (X.wnext += nt, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += nt))), 0;
        }
        l.inflateReset = k, l.inflateReset2 = A, l.inflateResetKeep = S, l.inflateInit = function(M) {
          return C(M, 15);
        }, l.inflateInit2 = C, l.inflate = function(M, N) {
          var c, $, nt, X, ot, Z, it, F, P, rt, J, q, dt, ut, lt, ct, B, j, Q, V, r, O, E, w, v = 0, R = new o.Buf8(4), D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!M || !M.state || !M.output || !M.input && M.avail_in !== 0) return d;
          (c = M.state).mode === 12 && (c.mode = 13), ot = M.next_out, nt = M.output, it = M.avail_out, X = M.next_in, $ = M.input, Z = M.avail_in, F = c.hold, P = c.bits, rt = Z, J = it, O = _;
          t: for (; ; ) switch (c.mode) {
            case h:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; P < 16; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if (2 & c.wrap && F === 35615) {
                R[c.check = 0] = 255 & F, R[1] = F >>> 8 & 255, c.check = s(c.check, R, 2, 0), P = F = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & F) << 8) + (F >> 8)) % 31) {
                M.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & F) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (P -= 4, r = 8 + (15 & (F >>>= 4)), c.wbits === 0) c.wbits = r;
              else if (r > c.wbits) {
                M.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << r, M.adler = c.check = 1, c.mode = 512 & F ? 10 : 12, P = F = 0;
              break;
            case 2:
              for (; P < 16; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if (c.flags = F, (255 & c.flags) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                M.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = F >> 8 & 1), 512 & c.flags && (R[0] = 255 & F, R[1] = F >>> 8 & 255, c.check = s(c.check, R, 2, 0)), P = F = 0, c.mode = 3;
            case 3:
              for (; P < 32; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              c.head && (c.head.time = F), 512 & c.flags && (R[0] = 255 & F, R[1] = F >>> 8 & 255, R[2] = F >>> 16 & 255, R[3] = F >>> 24 & 255, c.check = s(c.check, R, 4, 0)), P = F = 0, c.mode = 4;
            case 4:
              for (; P < 16; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              c.head && (c.head.xflags = 255 & F, c.head.os = F >> 8), 512 & c.flags && (R[0] = 255 & F, R[1] = F >>> 8 & 255, c.check = s(c.check, R, 2, 0)), P = F = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; P < 16; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                c.length = F, c.head && (c.head.extra_len = F), 512 & c.flags && (R[0] = 255 & F, R[1] = F >>> 8 & 255, c.check = s(c.check, R, 2, 0)), P = F = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (Z < (q = c.length) && (q = Z), q && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), o.arraySet(c.head.extra, $, X, q, r)), 512 & c.flags && (c.check = s(c.check, $, q, X)), Z -= q, X += q, c.length -= q), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (Z === 0) break t;
                for (q = 0; r = $[X + q++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && q < Z; ) ;
                if (512 & c.flags && (c.check = s(c.check, $, q, X)), Z -= q, X += q, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (Z === 0) break t;
                for (q = 0; r = $[X + q++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && q < Z; ) ;
                if (512 & c.flags && (c.check = s(c.check, $, q, X)), Z -= q, X += q, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; P < 16; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                if (F !== (65535 & c.check)) {
                  M.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                P = F = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), M.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; P < 32; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              M.adler = c.check = u(F), P = F = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return M.next_out = ot, M.avail_out = it, M.next_in = X, M.avail_in = Z, c.hold = F, c.bits = P, 2;
              M.adler = c.check = 1, c.mode = 12;
            case 12:
              if (N === 5 || N === 6) break t;
            case 13:
              if (c.last) {
                F >>>= 7 & P, P -= 7 & P, c.mode = 27;
                break;
              }
              for (; P < 3; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              switch (c.last = 1 & F, P -= 1, 3 & (F >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (U(c), c.mode = 20, N !== 6) break;
                  F >>>= 2, P -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  M.msg = "invalid block type", c.mode = 30;
              }
              F >>>= 2, P -= 2;
              break;
            case 14:
              for (F >>>= 7 & P, P -= 7 & P; P < 32; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if ((65535 & F) != (F >>> 16 ^ 65535)) {
                M.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & F, P = F = 0, c.mode = 15, N === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (q = c.length) {
                if (Z < q && (q = Z), it < q && (q = it), q === 0) break t;
                o.arraySet(nt, $, X, q, ot), Z -= q, X += q, it -= q, ot += q, c.length -= q;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; P < 14; ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if (c.nlen = 257 + (31 & F), F >>>= 5, P -= 5, c.ndist = 1 + (31 & F), F >>>= 5, P -= 5, c.ncode = 4 + (15 & F), F >>>= 4, P -= 4, 286 < c.nlen || 30 < c.ndist) {
                M.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; P < 3; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                c.lens[D[c.have++]] = 7 & F, F >>>= 3, P -= 3;
              }
              for (; c.have < 19; ) c.lens[D[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, E = { bits: c.lenbits }, O = p(0, c.lens, 0, 19, c.lencode, 0, c.work, E), c.lenbits = E.bits, O) {
                M.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; ct = (v = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, B = 65535 & v, !((lt = v >>> 24) <= P); ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                if (B < 16) F >>>= lt, P -= lt, c.lens[c.have++] = B;
                else {
                  if (B === 16) {
                    for (w = lt + 2; P < w; ) {
                      if (Z === 0) break t;
                      Z--, F += $[X++] << P, P += 8;
                    }
                    if (F >>>= lt, P -= lt, c.have === 0) {
                      M.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], q = 3 + (3 & F), F >>>= 2, P -= 2;
                  } else if (B === 17) {
                    for (w = lt + 3; P < w; ) {
                      if (Z === 0) break t;
                      Z--, F += $[X++] << P, P += 8;
                    }
                    P -= lt, r = 0, q = 3 + (7 & (F >>>= lt)), F >>>= 3, P -= 3;
                  } else {
                    for (w = lt + 7; P < w; ) {
                      if (Z === 0) break t;
                      Z--, F += $[X++] << P, P += 8;
                    }
                    P -= lt, r = 0, q = 11 + (127 & (F >>>= lt)), F >>>= 7, P -= 7;
                  }
                  if (c.have + q > c.nlen + c.ndist) {
                    M.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; q--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                M.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, E = { bits: c.lenbits }, O = p(b, c.lens, 0, c.nlen, c.lencode, 0, c.work, E), c.lenbits = E.bits, O) {
                M.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, E = { bits: c.distbits }, O = p(g, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, E), c.distbits = E.bits, O) {
                M.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, N === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= Z && 258 <= it) {
                M.next_out = ot, M.avail_out = it, M.next_in = X, M.avail_in = Z, c.hold = F, c.bits = P, f(M, J), ot = M.next_out, nt = M.output, it = M.avail_out, X = M.next_in, $ = M.input, Z = M.avail_in, F = c.hold, P = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; ct = (v = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, B = 65535 & v, !((lt = v >>> 24) <= P); ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if (ct && (240 & ct) == 0) {
                for (j = lt, Q = ct, V = B; ct = (v = c.lencode[V + ((F & (1 << j + Q) - 1) >> j)]) >>> 16 & 255, B = 65535 & v, !(j + (lt = v >>> 24) <= P); ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                F >>>= j, P -= j, c.back += j;
              }
              if (F >>>= lt, P -= lt, c.back += lt, c.length = B, ct === 0) {
                c.mode = 26;
                break;
              }
              if (32 & ct) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & ct) {
                M.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & ct, c.mode = 22;
            case 22:
              if (c.extra) {
                for (w = c.extra; P < w; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                c.length += F & (1 << c.extra) - 1, F >>>= c.extra, P -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; ct = (v = c.distcode[F & (1 << c.distbits) - 1]) >>> 16 & 255, B = 65535 & v, !((lt = v >>> 24) <= P); ) {
                if (Z === 0) break t;
                Z--, F += $[X++] << P, P += 8;
              }
              if ((240 & ct) == 0) {
                for (j = lt, Q = ct, V = B; ct = (v = c.distcode[V + ((F & (1 << j + Q) - 1) >> j)]) >>> 16 & 255, B = 65535 & v, !(j + (lt = v >>> 24) <= P); ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                F >>>= j, P -= j, c.back += j;
              }
              if (F >>>= lt, P -= lt, c.back += lt, 64 & ct) {
                M.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = B, c.extra = 15 & ct, c.mode = 24;
            case 24:
              if (c.extra) {
                for (w = c.extra; P < w; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                c.offset += F & (1 << c.extra) - 1, F >>>= c.extra, P -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                M.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (it === 0) break t;
              if (q = J - it, c.offset > q) {
                if ((q = c.offset - q) > c.whave && c.sane) {
                  M.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                dt = q > c.wnext ? (q -= c.wnext, c.wsize - q) : c.wnext - q, q > c.length && (q = c.length), ut = c.window;
              } else ut = nt, dt = ot - c.offset, q = c.length;
              for (it < q && (q = it), it -= q, c.length -= q; nt[ot++] = ut[dt++], --q; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (it === 0) break t;
              nt[ot++] = c.length, it--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; P < 32; ) {
                  if (Z === 0) break t;
                  Z--, F |= $[X++] << P, P += 8;
                }
                if (J -= it, M.total_out += J, c.total += J, J && (M.adler = c.check = c.flags ? s(c.check, nt, J, ot - J) : n(c.check, nt, J, ot - J)), J = it, (c.flags ? F : u(F)) !== c.check) {
                  M.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                P = F = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; P < 32; ) {
                  if (Z === 0) break t;
                  Z--, F += $[X++] << P, P += 8;
                }
                if (F !== (4294967295 & c.total)) {
                  M.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                P = F = 0;
              }
              c.mode = 29;
            case 29:
              O = 1;
              break t;
            case 30:
              O = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return d;
          }
          return M.next_out = ot, M.avail_out = it, M.next_in = X, M.avail_in = Z, c.hold = F, c.bits = P, (c.wsize || J !== M.avail_out && c.mode < 30 && (c.mode < 27 || N !== 4)) && K(M, M.output, M.next_out, J - M.avail_out) ? (c.mode = 31, -4) : (rt -= M.avail_in, J -= M.avail_out, M.total_in += rt, M.total_out += J, c.total += J, c.wrap && J && (M.adler = c.check = c.flags ? s(c.check, nt, J, M.next_out - J) : n(c.check, nt, J, M.next_out - J)), M.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (rt == 0 && J === 0 || N === 4) && O === _ && (O = -5), O);
        }, l.inflateEnd = function(M) {
          if (!M || !M.state) return d;
          var N = M.state;
          return N.window && (N.window = null), M.state = null, _;
        }, l.inflateGetHeader = function(M, N) {
          var c;
          return M && M.state ? (2 & (c = M.state).wrap) == 0 ? d : ((c.head = N).done = !1, _) : d;
        }, l.inflateSetDictionary = function(M, N) {
          var c, $ = N.length;
          return M && M.state ? (c = M.state).wrap !== 0 && c.mode !== 11 ? d : c.mode === 11 && n(1, N, $, 0) !== c.check ? -3 : K(M, N, $, $) ? (c.mode = 31, -4) : (c.havedict = 1, _) : d;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var o = e("../utils/common"), n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], f = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], p = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(b, g, _, d, h, i, y, u) {
          var x, S, k, A, C, I, L, z, U, K = u.bits, M = 0, N = 0, c = 0, $ = 0, nt = 0, X = 0, ot = 0, Z = 0, it = 0, F = 0, P = null, rt = 0, J = new o.Buf16(16), q = new o.Buf16(16), dt = null, ut = 0;
          for (M = 0; M <= 15; M++) J[M] = 0;
          for (N = 0; N < d; N++) J[g[_ + N]]++;
          for (nt = K, $ = 15; 1 <= $ && J[$] === 0; $--) ;
          if ($ < nt && (nt = $), $ === 0) return h[i++] = 20971520, h[i++] = 20971520, u.bits = 1, 0;
          for (c = 1; c < $ && J[c] === 0; c++) ;
          for (nt < c && (nt = c), M = Z = 1; M <= 15; M++) if (Z <<= 1, (Z -= J[M]) < 0) return -1;
          if (0 < Z && (b === 0 || $ !== 1)) return -1;
          for (q[1] = 0, M = 1; M < 15; M++) q[M + 1] = q[M] + J[M];
          for (N = 0; N < d; N++) g[_ + N] !== 0 && (y[q[g[_ + N]]++] = N);
          if (I = b === 0 ? (P = dt = y, 19) : b === 1 ? (P = n, rt -= 257, dt = s, ut -= 257, 256) : (P = f, dt = p, -1), M = c, C = i, ot = N = F = 0, k = -1, A = (it = 1 << (X = nt)) - 1, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
          for (; ; ) {
            for (L = M - ot, U = y[N] < I ? (z = 0, y[N]) : y[N] > I ? (z = dt[ut + y[N]], P[rt + y[N]]) : (z = 96, 0), x = 1 << M - ot, c = S = 1 << X; h[C + (F >> ot) + (S -= x)] = L << 24 | z << 16 | U | 0, S !== 0; ) ;
            for (x = 1 << M - 1; F & x; ) x >>= 1;
            if (x !== 0 ? (F &= x - 1, F += x) : F = 0, N++, --J[M] == 0) {
              if (M === $) break;
              M = g[_ + y[N]];
            }
            if (nt < M && (F & A) !== k) {
              for (ot === 0 && (ot = nt), C += c, Z = 1 << (X = M - ot); X + ot < $ && !((Z -= J[X + ot]) <= 0); ) X++, Z <<= 1;
              if (it += 1 << X, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
              h[k = F & A] = nt << 24 | X << 16 | C - i | 0;
            }
          }
          return F !== 0 && (h[C + F] = M - ot << 24 | 64 << 16 | 0), u.bits = nt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var o = e("../utils/common"), n = 0, s = 1;
        function f(v) {
          for (var R = v.length; 0 <= --R; ) v[R] = 0;
        }
        var p = 0, b = 29, g = 256, _ = g + 1 + b, d = 30, h = 19, i = 2 * _ + 1, y = 15, u = 16, x = 7, S = 256, k = 16, A = 17, C = 18, I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], K = new Array(2 * (_ + 2));
        f(K);
        var M = new Array(2 * d);
        f(M);
        var N = new Array(512);
        f(N);
        var c = new Array(256);
        f(c);
        var $ = new Array(b);
        f($);
        var nt, X, ot, Z = new Array(d);
        function it(v, R, D, W, T) {
          this.static_tree = v, this.extra_bits = R, this.extra_base = D, this.elems = W, this.max_length = T, this.has_stree = v && v.length;
        }
        function F(v, R) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = R;
        }
        function P(v) {
          return v < 256 ? N[v] : N[256 + (v >>> 7)];
        }
        function rt(v, R) {
          v.pending_buf[v.pending++] = 255 & R, v.pending_buf[v.pending++] = R >>> 8 & 255;
        }
        function J(v, R, D) {
          v.bi_valid > u - D ? (v.bi_buf |= R << v.bi_valid & 65535, rt(v, v.bi_buf), v.bi_buf = R >> u - v.bi_valid, v.bi_valid += D - u) : (v.bi_buf |= R << v.bi_valid & 65535, v.bi_valid += D);
        }
        function q(v, R, D) {
          J(v, D[2 * R], D[2 * R + 1]);
        }
        function dt(v, R) {
          for (var D = 0; D |= 1 & v, v >>>= 1, D <<= 1, 0 < --R; ) ;
          return D >>> 1;
        }
        function ut(v, R, D) {
          var W, T, G = new Array(y + 1), tt = 0;
          for (W = 1; W <= y; W++) G[W] = tt = tt + D[W - 1] << 1;
          for (T = 0; T <= R; T++) {
            var Y = v[2 * T + 1];
            Y !== 0 && (v[2 * T] = dt(G[Y]++, Y));
          }
        }
        function lt(v) {
          var R;
          for (R = 0; R < _; R++) v.dyn_ltree[2 * R] = 0;
          for (R = 0; R < d; R++) v.dyn_dtree[2 * R] = 0;
          for (R = 0; R < h; R++) v.bl_tree[2 * R] = 0;
          v.dyn_ltree[2 * S] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function ct(v) {
          8 < v.bi_valid ? rt(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function B(v, R, D, W) {
          var T = 2 * R, G = 2 * D;
          return v[T] < v[G] || v[T] === v[G] && W[R] <= W[D];
        }
        function j(v, R, D) {
          for (var W = v.heap[D], T = D << 1; T <= v.heap_len && (T < v.heap_len && B(R, v.heap[T + 1], v.heap[T], v.depth) && T++, !B(R, W, v.heap[T], v.depth)); ) v.heap[D] = v.heap[T], D = T, T <<= 1;
          v.heap[D] = W;
        }
        function Q(v, R, D) {
          var W, T, G, tt, Y = 0;
          if (v.last_lit !== 0) for (; W = v.pending_buf[v.d_buf + 2 * Y] << 8 | v.pending_buf[v.d_buf + 2 * Y + 1], T = v.pending_buf[v.l_buf + Y], Y++, W === 0 ? q(v, T, R) : (q(v, (G = c[T]) + g + 1, R), (tt = I[G]) !== 0 && J(v, T -= $[G], tt), q(v, G = P(--W), D), (tt = L[G]) !== 0 && J(v, W -= Z[G], tt)), Y < v.last_lit; ) ;
          q(v, S, R);
        }
        function V(v, R) {
          var D, W, T, G = R.dyn_tree, tt = R.stat_desc.static_tree, Y = R.stat_desc.has_stree, et = R.stat_desc.elems, st = -1;
          for (v.heap_len = 0, v.heap_max = i, D = 0; D < et; D++) G[2 * D] !== 0 ? (v.heap[++v.heap_len] = st = D, v.depth[D] = 0) : G[2 * D + 1] = 0;
          for (; v.heap_len < 2; ) G[2 * (T = v.heap[++v.heap_len] = st < 2 ? ++st : 0)] = 1, v.depth[T] = 0, v.opt_len--, Y && (v.static_len -= tt[2 * T + 1]);
          for (R.max_code = st, D = v.heap_len >> 1; 1 <= D; D--) j(v, G, D);
          for (T = et; D = v.heap[1], v.heap[1] = v.heap[v.heap_len--], j(v, G, 1), W = v.heap[1], v.heap[--v.heap_max] = D, v.heap[--v.heap_max] = W, G[2 * T] = G[2 * D] + G[2 * W], v.depth[T] = (v.depth[D] >= v.depth[W] ? v.depth[D] : v.depth[W]) + 1, G[2 * D + 1] = G[2 * W + 1] = T, v.heap[1] = T++, j(v, G, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(at, _t) {
            var pt, vt, St, H, ht, Mt, yt = _t.dyn_tree, Gt = _t.max_code, fe = _t.stat_desc.static_tree, me = _t.stat_desc.has_stree, pe = _t.stat_desc.extra_bits, qt = _t.stat_desc.extra_base, Ot = _t.stat_desc.max_length, Nt = 0;
            for (H = 0; H <= y; H++) at.bl_count[H] = 0;
            for (yt[2 * at.heap[at.heap_max] + 1] = 0, pt = at.heap_max + 1; pt < i; pt++) Ot < (H = yt[2 * yt[2 * (vt = at.heap[pt]) + 1] + 1] + 1) && (H = Ot, Nt++), yt[2 * vt + 1] = H, Gt < vt || (at.bl_count[H]++, ht = 0, qt <= vt && (ht = pe[vt - qt]), Mt = yt[2 * vt], at.opt_len += Mt * (H + ht), me && (at.static_len += Mt * (fe[2 * vt + 1] + ht)));
            if (Nt !== 0) {
              do {
                for (H = Ot - 1; at.bl_count[H] === 0; ) H--;
                at.bl_count[H]--, at.bl_count[H + 1] += 2, at.bl_count[Ot]--, Nt -= 2;
              } while (0 < Nt);
              for (H = Ot; H !== 0; H--) for (vt = at.bl_count[H]; vt !== 0; ) Gt < (St = at.heap[--pt]) || (yt[2 * St + 1] !== H && (at.opt_len += (H - yt[2 * St + 1]) * yt[2 * St], yt[2 * St + 1] = H), vt--);
            }
          })(v, R), ut(G, st, v.bl_count);
        }
        function r(v, R, D) {
          var W, T, G = -1, tt = R[1], Y = 0, et = 7, st = 4;
          for (tt === 0 && (et = 138, st = 3), R[2 * (D + 1) + 1] = 65535, W = 0; W <= D; W++) T = tt, tt = R[2 * (W + 1) + 1], ++Y < et && T === tt || (Y < st ? v.bl_tree[2 * T] += Y : T !== 0 ? (T !== G && v.bl_tree[2 * T]++, v.bl_tree[2 * k]++) : Y <= 10 ? v.bl_tree[2 * A]++ : v.bl_tree[2 * C]++, G = T, st = (Y = 0) === tt ? (et = 138, 3) : T === tt ? (et = 6, 3) : (et = 7, 4));
        }
        function O(v, R, D) {
          var W, T, G = -1, tt = R[1], Y = 0, et = 7, st = 4;
          for (tt === 0 && (et = 138, st = 3), W = 0; W <= D; W++) if (T = tt, tt = R[2 * (W + 1) + 1], !(++Y < et && T === tt)) {
            if (Y < st) for (; q(v, T, v.bl_tree), --Y != 0; ) ;
            else T !== 0 ? (T !== G && (q(v, T, v.bl_tree), Y--), q(v, k, v.bl_tree), J(v, Y - 3, 2)) : Y <= 10 ? (q(v, A, v.bl_tree), J(v, Y - 3, 3)) : (q(v, C, v.bl_tree), J(v, Y - 11, 7));
            G = T, st = (Y = 0) === tt ? (et = 138, 3) : T === tt ? (et = 6, 3) : (et = 7, 4);
          }
        }
        f(Z);
        var E = !1;
        function w(v, R, D, W) {
          J(v, (p << 1) + (W ? 1 : 0), 3), (function(T, G, tt, Y) {
            ct(T), rt(T, tt), rt(T, ~tt), o.arraySet(T.pending_buf, T.window, G, tt, T.pending), T.pending += tt;
          })(v, R, D);
        }
        l._tr_init = function(v) {
          E || ((function() {
            var R, D, W, T, G, tt = new Array(y + 1);
            for (T = W = 0; T < b - 1; T++) for ($[T] = W, R = 0; R < 1 << I[T]; R++) c[W++] = T;
            for (c[W - 1] = T, T = G = 0; T < 16; T++) for (Z[T] = G, R = 0; R < 1 << L[T]; R++) N[G++] = T;
            for (G >>= 7; T < d; T++) for (Z[T] = G << 7, R = 0; R < 1 << L[T] - 7; R++) N[256 + G++] = T;
            for (D = 0; D <= y; D++) tt[D] = 0;
            for (R = 0; R <= 143; ) K[2 * R + 1] = 8, R++, tt[8]++;
            for (; R <= 255; ) K[2 * R + 1] = 9, R++, tt[9]++;
            for (; R <= 279; ) K[2 * R + 1] = 7, R++, tt[7]++;
            for (; R <= 287; ) K[2 * R + 1] = 8, R++, tt[8]++;
            for (ut(K, _ + 1, tt), R = 0; R < d; R++) M[2 * R + 1] = 5, M[2 * R] = dt(R, 5);
            nt = new it(K, I, g + 1, _, y), X = new it(M, L, 0, d, y), ot = new it(new Array(0), z, 0, h, x);
          })(), E = !0), v.l_desc = new F(v.dyn_ltree, nt), v.d_desc = new F(v.dyn_dtree, X), v.bl_desc = new F(v.bl_tree, ot), v.bi_buf = 0, v.bi_valid = 0, lt(v);
        }, l._tr_stored_block = w, l._tr_flush_block = function(v, R, D, W) {
          var T, G, tt = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(Y) {
            var et, st = 4093624447;
            for (et = 0; et <= 31; et++, st >>>= 1) if (1 & st && Y.dyn_ltree[2 * et] !== 0) return n;
            if (Y.dyn_ltree[18] !== 0 || Y.dyn_ltree[20] !== 0 || Y.dyn_ltree[26] !== 0) return s;
            for (et = 32; et < g; et++) if (Y.dyn_ltree[2 * et] !== 0) return s;
            return n;
          })(v)), V(v, v.l_desc), V(v, v.d_desc), tt = (function(Y) {
            var et;
            for (r(Y, Y.dyn_ltree, Y.l_desc.max_code), r(Y, Y.dyn_dtree, Y.d_desc.max_code), V(Y, Y.bl_desc), et = h - 1; 3 <= et && Y.bl_tree[2 * U[et] + 1] === 0; et--) ;
            return Y.opt_len += 3 * (et + 1) + 5 + 5 + 4, et;
          })(v), T = v.opt_len + 3 + 7 >>> 3, (G = v.static_len + 3 + 7 >>> 3) <= T && (T = G)) : T = G = D + 5, D + 4 <= T && R !== -1 ? w(v, R, D, W) : v.strategy === 4 || G === T ? (J(v, 2 + (W ? 1 : 0), 3), Q(v, K, M)) : (J(v, 4 + (W ? 1 : 0), 3), (function(Y, et, st, at) {
            var _t;
            for (J(Y, et - 257, 5), J(Y, st - 1, 5), J(Y, at - 4, 4), _t = 0; _t < at; _t++) J(Y, Y.bl_tree[2 * U[_t] + 1], 3);
            O(Y, Y.dyn_ltree, et - 1), O(Y, Y.dyn_dtree, st - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, tt + 1), Q(v, v.dyn_ltree, v.dyn_dtree)), lt(v), W && ct(v);
        }, l._tr_tally = function(v, R, D) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = R >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & R, v.pending_buf[v.l_buf + v.last_lit] = 255 & D, v.last_lit++, R === 0 ? v.dyn_ltree[2 * D]++ : (v.matches++, R--, v.dyn_ltree[2 * (c[D] + g + 1)]++, v.dyn_dtree[2 * P(R)]++), v.last_lit === v.lit_bufsize - 1;
        }, l._tr_align = function(v) {
          J(v, 2, 3), q(v, S, K), (function(R) {
            R.bi_valid === 16 ? (rt(R, R.bi_buf), R.bi_buf = 0, R.bi_valid = 0) : 8 <= R.bi_valid && (R.pending_buf[R.pending++] = 255 & R.bi_buf, R.bi_buf >>= 8, R.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(o) {
          (function(n, s) {
            if (!n.setImmediate) {
              var f, p, b, g, _ = 1, d = {}, h = !1, i = n.document, y = Object.getPrototypeOf && Object.getPrototypeOf(n);
              y = y && y.setTimeout ? y : n, f = {}.toString.call(n.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  x(k);
                });
              } : (function() {
                if (n.postMessage && !n.importScripts) {
                  var k = !0, A = n.onmessage;
                  return n.onmessage = function() {
                    k = !1;
                  }, n.postMessage("", "*"), n.onmessage = A, k;
                }
              })() ? (g = "setImmediate$" + Math.random() + "$", n.addEventListener ? n.addEventListener("message", S, !1) : n.attachEvent("onmessage", S), function(k) {
                n.postMessage(g + k, "*");
              }) : n.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                x(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : i && "onreadystatechange" in i.createElement("script") ? (p = i.documentElement, function(k) {
                var A = i.createElement("script");
                A.onreadystatechange = function() {
                  x(k), A.onreadystatechange = null, p.removeChild(A), A = null;
                }, p.appendChild(A);
              }) : function(k) {
                setTimeout(x, 0, k);
              }, y.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var A = new Array(arguments.length - 1), C = 0; C < A.length; C++) A[C] = arguments[C + 1];
                var I = { callback: k, args: A };
                return d[_] = I, f(_), _++;
              }, y.clearImmediate = u;
            }
            function u(k) {
              delete d[k];
            }
            function x(k) {
              if (h) setTimeout(x, 0, k);
              else {
                var A = d[k];
                if (A) {
                  h = !0;
                  try {
                    (function(C) {
                      var I = C.callback, L = C.args;
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
                          I.apply(s, L);
                      }
                    })(A);
                  } finally {
                    u(k), h = !1;
                  }
                }
              }
            }
            function S(k) {
              k.source === n && typeof k.data == "string" && k.data.indexOf(g) === 0 && x(+k.data.slice(g.length));
            }
          })(typeof self > "u" ? o === void 0 ? this : o : self);
        }).call(this, typeof Dt < "u" ? Dt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Ut)), Ut.exports;
}
var _e = ge();
const ie = /* @__PURE__ */ ye(_e);
async function be(m) {
  const t = await ve(m), e = await ie.loadAsync(t), a = [];
  return e.forEach((l, o) => {
    if (o.dir)
      return;
    const n = we(l);
    a.push({
      name: n,
      text: () => o.async("text"),
      arrayBuffer: () => o.async("arraybuffer")
    });
  }), a;
}
async function ve(m) {
  if (m instanceof ArrayBuffer)
    return m;
  if (m instanceof Blob)
    return await m.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function we(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function xe(m) {
  return !!m && typeof m == "object" && !(m instanceof ArrayBuffer) && !(m instanceof Uint8Array);
}
function ke(m) {
  return m instanceof Uint8Array ? m : new Uint8Array(m);
}
function Se(m) {
  return m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer;
}
function zt(m, t, e = 0) {
  if (m.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (m[e + a] !== t[a]) return !1;
  return !0;
}
function Me(m) {
  return zt(m, [80, 75, 3, 4]) || zt(m, [80, 75, 5, 6]) || zt(m, [80, 75, 7, 8]) ? "zip" : zt(m, [82, 97, 114, 33, 26, 7, 0]) || zt(m, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : zt(m, [55, 122, 188, 175, 39, 28]) ? "7z" : m.length > 262 && zt(m, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function se(m) {
  return m.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Ht(m) {
  const t = [], e = m.map((i) => se(i).toLowerCase()), a = (i) => e.some(i), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, o = /\.(drl|xln)$/i, n = e.filter((i) => l.test(i)).length, s = e.filter((i) => o.test(i) || i.includes("drill")).length, f = a((i) => i.includes("top") && i.includes("copper") || i.endsWith(".gtl")), p = a((i) => i.includes("bot") || i.includes("bottom") || i.endsWith(".gbl")), b = a((i) => i.includes("mask") || i.includes("solder") || i.endsWith(".gts") || i.endsWith(".gbs")), g = a((i) => i.includes("silk") || i.includes("legend") || i.endsWith(".gto") || i.endsWith(".gbo")), _ = a((i) => i.includes("outline") || i.includes("profile") || i.includes("edge") || i.endsWith(".gko") || i.endsWith(".gm1") || i.endsWith(".gml")), d = e.every(
    (i) => i.endsWith(".pdf") || i.endsWith(".png") || i.endsWith(".jpg") || i.endsWith(".jpeg") || i.endsWith(".svg") || i.endsWith(".txt") || i.endsWith(".md")
  );
  let h = 0;
  return m.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (n > 0 ? (h += 0.35, t.push(`Found ${n} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), s > 0 && (h += 0.2, t.push(`Found ${s} drill-like file(s).`)), _ && (h += 0.15, t.push("Found outline/profile/edge candidate.")), f && p ? (h += 0.2, t.push("Found both top and bottom copper candidates.")) : (f || p) && (h += 0.1, t.push("Found at least one copper candidate.")), b && (h += 0.05, t.push("Found solder mask candidate.")), g && (h += 0.05, t.push("Found silkscreen/legend candidate.")), h = Math.max(0, Math.min(1, h)), h < 0.6 && n >= 2 && (h = Math.max(h, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: h, reasons: t });
}
async function Re(m) {
  if (xe(m)) {
    const o = Object.keys(m).map(se), { confidence: n, reasons: s } = Ht(o);
    return {
      isGerber: n >= 0.6,
      archiveType: "directory",
      confidence: n,
      reasons: s,
      files: o
    };
  }
  const t = ke(m), e = Me(t);
  if (e === "zip")
    try {
      const o = Se(t), s = (await be(o)).map((b) => b.name), { confidence: f, reasons: p } = Ht(s);
      return {
        isGerber: f >= 0.6,
        archiveType: "zip",
        confidence: f,
        reasons: p,
        files: s
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
class mt extends Error {
  constructor(t, e, a) {
    super(e), this.name = "GerberError", this.code = t, this.details = a;
  }
}
function oe(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Ae(m) {
  return m instanceof Uint8Array ? m : new Uint8Array(m);
}
function ae(m) {
  try {
    return m.slice().buffer;
  } catch {
    const t = new Uint8Array(m.byteLength);
    return t.set(m), t.buffer;
  }
}
async function Ee(m) {
  let t;
  try {
    t = await ie.loadAsync(ae(m));
  } catch (s) {
    throw new mt(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      s
    );
  }
  const e = {}, a = 1e3, l = 100 * 1024 * 1024, o = Object.entries(t.files).filter(([, s]) => s && !s.dir);
  if (o.length > a)
    throw new mt(
      "PARSE_ERROR",
      `ZIP contains too many files (${o.length} > ${a})`
    );
  let n = 0;
  for (const [s, f] of o)
    try {
      const p = oe(s), b = await f.async("arraybuffer");
      if (n += b.byteLength, n > l)
        throw new mt(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[p] = new Uint8Array(b);
    } catch (p) {
      console.warn(`Failed to extract file ${s}:`, p);
    }
  if (Object.keys(e).length === 0)
    throw new mt("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Ce(m, t) {
  let e;
  try {
    const g = await import("./libarchive-Bt1VdZR0.js");
    e = g.Archive ?? g.default?.Archive;
  } catch (g) {
    throw new mt(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      g
    );
  }
  if (!e)
    throw new mt("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (g) {
      throw new mt(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        g
      );
    }
  let a;
  try {
    const g = new Blob([ae(m)], { type: "application/octet-stream" });
    a = await e.open(g);
  } catch (g) {
    throw new mt("NOT_AN_ARCHIVE", "Failed to open RAR archive", g);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
      new Promise(
        (g, _) => setTimeout(() => _(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (g) {
    throw new mt("PARSE_ERROR", "Failed to extract RAR archive", g);
  }
  const o = {};
  let n = 0;
  const s = 1e3, f = 100 * 1024 * 1024;
  let p = 0;
  async function b(g, _) {
    if (n >= s)
      throw new mt(
        "PARSE_ERROR",
        `Archive contains too many files (max ${s})`
      );
    for (const d of Object.keys(g)) {
      const h = g[d], i = _ ? `${_}/${d}` : d;
      if (h instanceof File || h instanceof Blob) {
        n++;
        try {
          const y = await h.arrayBuffer();
          if (p += y.byteLength, p > f)
            throw new mt(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${f} bytes)`
            );
          o[oe(i)] = new Uint8Array(y);
        } catch (y) {
          console.warn(`Failed to extract file ${i}:`, y);
        }
      } else h && typeof h == "object" && await b(h, i);
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
    throw new mt("PARSE_ERROR", "No files extracted from RAR archive");
  return o;
}
async function le(m, t) {
  if (!m || m.byteLength === 0)
    throw new mt("NOT_AN_ARCHIVE", "Input is empty");
  const e = Ae(m), a = 100 * 1024 * 1024;
  if (e.length > a)
    throw new mt(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${a} bytes)`
    );
  let l;
  try {
    l = await Re(e);
  } catch (o) {
    throw new mt("PARSE_ERROR", "Failed to detect archive type", o);
  }
  if (!l.isGerber)
    throw new mt(
      "NOT_GERBER",
      l.reasons.join("; ") || "Not a Gerber bundle",
      l
    );
  try {
    if (l.archiveType === "zip")
      return { archiveType: "zip", files: await Ee(e) };
    if (l.archiveType === "rar")
      return { archiveType: "rar", files: await Ce(e, t) };
    throw new mt(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${l.archiveType}`,
      l
    );
  } catch (o) {
    throw o instanceof mt ? o : new mt(
      "PARSE_ERROR",
      o instanceof Error ? o.message : "Unknown error during extraction",
      { error: o, det: l }
    );
  }
}
function Ft(m) {
  return m.toLowerCase();
}
function Tt(m, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return m.filter((l) => {
    const o = Ft(l), n = o.lastIndexOf(".");
    return n < 0 ? !1 : e.has(o.slice(n));
  }).sort((l, o) => l.length - o.length)[0];
}
function ft(m, t) {
  const e = t.map((l) => l.toLowerCase());
  return m.filter((l) => {
    const o = Ft(l);
    return e.every((n) => o.includes(n));
  }).sort((l, o) => l.length - o.length)[0];
}
function Ie(m, t, e) {
  const a = new Set([t, e].filter(Boolean)), l = [];
  for (const o of m) {
    if (a.has(o)) continue;
    const n = Ft(o), s = n.split("/").pop() || n, f = s.lastIndexOf("."), p = f >= 0 ? s.slice(f) : "";
    if (/in\d+_cu/.test(s)) {
      l.push(o);
      continue;
    }
    if (/^\.gl?\d+$/.test(p)) {
      const b = parseInt(p.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(b) && b >= 2) {
        l.push(o);
        continue;
      }
    }
  }
  return l.sort(), l;
}
function ze(m) {
  const t = [], e = (a) => Ft(a);
  for (const a of m) {
    const l = e(a), o = l.split("/").pop() || l, n = o.slice(o.lastIndexOf("."));
    if (n === ".drl" || n === ".xln" || n === ".exc" || n === ".ncd") {
      t.push(a);
      continue;
    }
    if (n === ".txt" && (o.includes("hole") || o.includes("drill") || o.includes("npth") || o.includes("-pth"))) {
      t.push(a);
      continue;
    }
    if ((o.includes("drill") || o.includes("npth") || o.includes("-pth")) && (n === ".gbr" || n === ".ger" || n === ".txt" || n === "")) {
      t.push(a);
      continue;
    }
  }
  return t;
}
function Te(m) {
  const t = m.filter((g) => {
    const _ = Ft(g);
    return !(_.endsWith("/") || _.includes("__macosx") || _.endsWith(".ds_store"));
  }), e = Tt(t, [".gtl"]) || ft(t, ["f_cu"]) || ft(t, ["top", "cu"]) || ft(t, ["top", "copper"]), a = Tt(t, [".gbl"]) || ft(t, ["b_cu"]) || ft(t, ["bottom", "cu"]) || ft(t, ["bottom", "copper"]), l = Tt(t, [".gts"]) || ft(t, ["f_mask"]) || ft(t, ["top", "mask"]), o = Tt(t, [".gbs"]) || ft(t, ["b_mask"]) || ft(t, ["bottom", "mask"]), n = Tt(t, [".gto"]) || ft(t, ["f_silks"]) || ft(t, ["f_silk"]) || ft(t, ["top", "silk"]), s = Tt(t, [".gbo"]) || ft(t, ["b_silks"]) || ft(t, ["b_silk"]) || ft(t, ["bottom", "silk"]), f = Tt(t, [".gko", ".gm1"]) || ft(t, ["edge", "cuts"]) || ft(t, ["outline"]) || ft(t, ["board", "outline"]), p = ze(t), b = Ie(t, e, a);
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: o,
    top_silk: n,
    bottom_silk: s,
    outline: f,
    drills: p.length ? p : void 0,
    inner_copper: b.length ? b : void 0
  };
}
const Oe = 0.8;
function At(m, t, e) {
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
    let n = o.trim();
    if (n && !n.startsWith("G04")) {
      if (n.startsWith("%") && n.endsWith("%")) {
        Be(n, a);
        continue;
      }
      n.endsWith("*") && (n = n.slice(0, -1)), Pe(n, a);
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
function Be(m, t) {
  let e = m;
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
      for (const n of t.apertures.values())
        n.diameterMm !== void 0 && (n.diameterMm *= o), n.widthMm !== void 0 && (n.widthMm *= o), n.heightMm !== void 0 && (n.heightMm *= o);
      t.unitScale = l;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const a = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!a) return;
    const l = parseInt(a[2], 10), o = a[3], n = a[4] ?? "";
    let s, f, p, b, g;
    if (n) {
      const d = n.split(/[Xx]/).filter(Boolean), h = d[0] ? parseFloat(d[0]) * t.unitScale : void 0, i = d[1] ? parseFloat(d[1]) * t.unitScale : void 0, y = d[2] ? parseFloat(d[2]) * t.unitScale : void 0, u = d[3] ? parseFloat(d[3]) : void 0;
      u !== void 0 && !Number.isNaN(u) && u !== 0 && (g = u), o === "C" ? s = h : o === "R" || o === "O" ? (f = h, p = i, s = h !== void 0 && i !== void 0 ? Math.min(h, i) : h ?? i) : (f = h, p = i, y !== void 0 && (b = y), s = h !== void 0 && i !== void 0 ? Math.min(h, i) : h ?? i);
    }
    const _ = {
      code: l,
      shape: o,
      diameterMm: s,
      widthMm: f,
      heightMm: p,
      cornerMm: b,
      rotationDeg: g
    };
    t.apertures.set(l, _);
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
function Kt(m, t, e, a, l) {
  const o = m.x + e, n = m.y + a, s = Math.sqrt(e * e + a * a);
  if (s < 1e-6) return [t];
  const f = Math.atan2(m.y - n, m.x - o), p = Math.atan2(t.y - n, t.x - o), g = (t.x - m.x) ** 2 + (t.y - m.y) ** 2 < (s * 1e-3) ** 2;
  let _;
  g ? _ = l ? -2 * Math.PI : 2 * Math.PI : (_ = p - f, l ? _ > 1e-6 && (_ -= 2 * Math.PI) : _ < -1e-6 && (_ += 2 * Math.PI));
  const d = Math.min(64, Math.max(4, Math.ceil(Math.abs(_) / (Math.PI / 16)))), h = [];
  for (let i = 1; i <= d; i++) {
    const y = f + _ * i / d;
    h.push({ x: o + s * Math.cos(y), y: n + s * Math.sin(y) });
  }
  return h;
}
function Pe(m, t) {
  if (m === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (m === "G74" || m === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(m);
  if (e && (t.arcMode = parseInt(e[1], 10), m = m.slice(e[0].length).trim(), !m))
    return;
  if (m === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const i = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(i), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let a = null;
  const l = /D0?(\d{1,3})$/.exec(m);
  if (l && (a = parseInt(l[1], 10), m = m.slice(0, m.length - l[0].length)), a !== null && a >= 10) {
    const i = t.apertures.get(a);
    i && (t.currentAperture = i);
    return;
  }
  const o = /X([+\-]?\d+)/.exec(m), n = /Y([+\-]?\d+)/.exec(m), s = /I([+\-]?\d+)/.exec(m), f = /J([+\-]?\d+)/.exec(m);
  let p = t.x, b = t.y;
  o && (p = $t(o[1], t)), n && (b = $t(n[1], t));
  const g = s ? $t(s[1], t) : 0, _ = f ? $t(f[1], t) : 0;
  if (a === null) {
    t.x = p, t.y = b;
    return;
  }
  if (t.inRegion) {
    const i = t.x, y = t.y;
    if (a === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: i, y }), t.arcMode !== 1 && (g !== 0 || _ !== 0)) {
        const u = Kt({ x: i, y }, { x: p, y: b }, g, _, t.arcMode === 2);
        for (const x of u) t.currentPath.push(x);
      } else
        t.currentPath.push({ x: p, y: b });
    else a === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = p, t.y = b;
    return;
  }
  const d = t.x, h = t.y;
  if (a === 1) {
    if (!t.currentAperture) {
      t.x = p, t.y = b;
      return;
    }
    const i = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (g !== 0 || _ !== 0)) {
      const y = Kt({ x: d, y: h }, { x: p, y: b }, g, _, t.arcMode === 2);
      let u = { x: d, y: h };
      for (const x of y)
        t.tracks.push({ start: u, end: x, width: i, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: u, end: x, widthMm: i }), u = x;
    } else
      t.tracks.push({
        start: { x: d, y: h },
        end: { x: p, y: b },
        width: i,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: d, y: h },
        end: { x: p, y: b },
        widthMm: i
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
      const i = t.currentAperture, y = i.diameterMm !== void 0 ? i.diameterMm : Oe, u = (i.rotationDeg ?? 0) + t.loadRotationDeg, x = u !== 0 ? u : void 0, S = {
        position: { x: p, y: b },
        diameterMm: y,
        shape: i.shape,
        polarity: t.currentPolarity,
        rotationDeg: x
      };
      i.widthMm !== void 0 && (S.widthMm = i.widthMm), i.heightMm !== void 0 && (S.heightMm = i.heightMm), i.cornerMm !== void 0 && (S.cornerMm = i.cornerMm), t.flashes.push(S), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: p, y: b },
        diameterMm: y,
        shape: i.shape,
        widthMm: i.widthMm,
        heightMm: i.heightMm,
        cornerMm: i.cornerMm,
        rotationDeg: x
      });
    }
    t.x = p, t.y = b;
    return;
  }
}
function $t(m, t) {
  const e = m.startsWith("-") ? -1 : 1, a = m.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const o = Math.pow(10, t.fmtDec), n = l / o * t.unitScale;
  return e * n;
}
function Wt(m, t) {
  return /^0+$/.test(m) && /^0+$/.test(t) ? { fmtInt: m.length, fmtDec: t.length } : { fmtInt: parseInt(m, 10), fmtDec: parseInt(t, 10) };
}
function Fe(m, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const o = [], n = [];
  let s = 1, f = 4, p = !1, b = !1, g = !1, _ = 0, d = 0, h = 5;
  const i = (y) => {
    if (y.includes(".")) return parseFloat(y) * s;
    const u = y.startsWith("-") ? -1 : 1, x = y.replace(/[+\-]/, ""), S = parseInt(x, 10);
    return Number.isNaN(S) ? 0 : u * (S / Math.pow(10, f)) * s;
  };
  for (const y of e) {
    const u = y.trim();
    if (!u || u.startsWith(";")) continue;
    if (u === "M48") {
      p = !0;
      continue;
    }
    if (u === "%" && p) {
      p = !1;
      continue;
    }
    if (u === "M30" || u === "M00") break;
    if (u === "M15") {
      g = !0;
      continue;
    }
    if (u === "M16" || u === "M17") {
      g = !1, h = 5;
      continue;
    }
    if (p) {
      if (u.startsWith("METRIC")) {
        s = 1, b || (f = 3);
        const I = /(\d+)\.(\d+)/.exec(u);
        if (I) {
          const L = Wt(I[1], I[2]);
          L.fmtInt, f = L.fmtDec, b = !0;
        }
      } else if (u.startsWith("INCH")) {
        s = 25.4, b || (f = 4);
        const I = /(\d+)\.(\d+)/.exec(u);
        if (I) {
          const L = Wt(I[1], I[2]);
          L.fmtInt, f = L.fmtDec, b = !0;
        }
      }
      const C = /^FMAT,(\d+)\.(\d+)/.exec(u) || /^(\d+)\.(\d+)$/.exec(u);
      if (C) {
        const I = Wt(C[1], C[2]);
        I.fmtInt, f = I.fmtDec, b = !0;
      }
    }
    if (/^T\d+C[\d.]+/i.test(u)) {
      const C = /^T(\d+)C([\d.]+)/i.exec(u);
      if (C) {
        const I = parseFloat(C[2]) * s;
        Number.isNaN(I) || a.set(C[1], I);
      }
      continue;
    }
    if (/^T\d+$/i.test(u)) {
      const C = /^T(\d+)/i.exec(u);
      C && (l = C[1]);
      continue;
    }
    const x = /^G0*([015])(?!\d)/.exec(u);
    if (x && (h = parseInt(x[1], 10)), /^[GRMF]/.test(u) && !/X/i.test(u)) continue;
    const S = l && a.has(l) ? a.get(l) : 0.6, k = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(u);
    if (k) {
      const C = i(k[1]), I = i(k[2]), L = i(k[3]), z = i(k[4]);
      Number.isFinite(C) && Number.isFinite(I) && (n.push({ x1: C, y1: I, x2: L, y2: z, diameter: S }), _ = L, d = z);
      continue;
    }
    const A = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(u);
    if (A) {
      const C = i(A[1]), I = i(A[2]);
      Number.isFinite(C) && Number.isFinite(I) && (h === 0 || (g && h === 1 ? n.push({ x1: _, y1: d, x2: C, y2: I, diameter: S }) : o.push({ x: C, y: I, diameter: S, plated: !0 })), _ = C, d = I);
    }
  }
  return { name: m, holes: o, slots: n };
}
function Ne(m) {
  return { w: m.maxX - m.minX, h: m.maxY - m.minY };
}
function Bt(m) {
  const { w: t, h: e } = Ne(m);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Rt(m, t) {
  if (!Number.isFinite(m) || !Number.isFinite(t) || m <= 0 || t <= 0) return 1;
  const e = m / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Et(m, t) {
  return t === 1 ? m : {
    ...m,
    tracks: m.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: m.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: m.regions.map((e) => ({
      ...e,
      loops: e.loops.map((a) => a.map((l) => ({ x: l.x * t, y: l.y * t })))
    }))
  };
}
function De(m, t) {
  return t === 1 ? m : m.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Le(m, t) {
  return t === 1 ? m : m.map((e) => ({
    x1: e.x1 * t,
    y1: e.y1 * t,
    x2: e.x2 * t,
    y2: e.y2 * t,
    diameter: (e.diameter ?? 0) * t
  }));
}
function $e(m) {
  return URL.createObjectURL(new Blob([m], { type: "image/svg+xml" }));
}
function gt(m, t, e) {
  m.minX = Math.min(m.minX, t), m.minY = Math.min(m.minY, e), m.maxX = Math.max(m.maxX, t), m.maxY = Math.max(m.maxY, e);
}
function Zt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function xt(m) {
  const t = Zt();
  for (const e of m.tracks) {
    gt(t, e.start.x, e.start.y), gt(t, e.end.x, e.end.y);
    const a = (e.width ?? 0) / 2;
    gt(t, e.start.x - a, e.start.y - a), gt(t, e.start.x + a, e.start.y + a), gt(t, e.end.x - a, e.end.y - a), gt(t, e.end.x + a, e.end.y + a);
  }
  for (const e of m.flashes) {
    const a = (e.widthMm ?? e.diameterMm) || 0, l = (e.heightMm ?? e.diameterMm) || 0;
    gt(t, e.position.x - a / 2, e.position.y - l / 2), gt(t, e.position.x + a / 2, e.position.y + l / 2);
  }
  for (const e of m.regions)
    for (const a of e.loops) for (const l of a) gt(t, l.x, l.y);
  return t;
}
function Ue(m, t = []) {
  const e = Zt();
  for (const a of m) {
    const l = (a.diameter || 0) / 2;
    gt(e, a.x - l, a.y - l), gt(e, a.x + l, a.y + l);
  }
  for (const a of t) {
    const l = (a.diameter || 0) / 2;
    gt(e, a.x1 - l, a.y1 - l), gt(e, a.x1 + l, a.y1 + l), gt(e, a.x2 - l, a.y2 - l), gt(e, a.x2 + l, a.y2 + l);
  }
  return e;
}
function Jt(m, t) {
  return {
    minX: Math.min(m.minX, t.minX),
    minY: Math.min(m.minY, t.minY),
    maxX: Math.max(m.maxX, t.maxX),
    maxY: Math.max(m.maxY, t.maxY)
  };
}
function wt(m) {
  return !Number.isFinite(m.minX) || !Number.isFinite(m.minY) || !Number.isFinite(m.maxX) || !Number.isFinite(m.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (m.maxX - m.minX < 1e-6 && (m.maxX = m.minX + 1), m.maxY - m.minY < 1e-6 && (m.maxY = m.minY + 1), m);
}
const We = 1e3;
function bt(m) {
  return m / 25.4 * We;
}
function Ct(m, t, e) {
  const a = m - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Yt(m, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${m}" height="${t}" viewBox="0 0 ${m} ${t}">
  <rect width="${m}" height="${t}" fill="white"/>
</svg>`.trim();
}
function kt(m, t = 1e-4) {
  const e = Math.round(m.x / t) * t, a = Math.round(m.y / t) * t;
  return `${e.toFixed(4)},${a.toFixed(4)}`;
}
function Qt(m) {
  let t = 0;
  const e = m.length;
  for (let a = 0; a < e; a++) {
    const l = m[a], o = m[(a + 1) % e];
    t += l.x * o.y - o.x * l.y;
  }
  return 0.5 * t;
}
function jt(m, t, e) {
  if (!m.length) return "";
  const a = (n) => ({
    x: (n.x - t.minX) * e,
    y: (t.maxY - n.y) * e
  }), l = a(m[0]), o = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let n = 1; n < m.length; n++) {
    const s = a(m[n]);
    o.push(`L ${s.x.toFixed(2)} ${s.y.toFixed(2)}`);
  }
  return o.push("Z"), o.join(" ");
}
function ce(m) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (p, b) => {
    const g = kt(p), _ = kt(b);
    t.has(g) || t.set(g, []), t.has(_) || t.set(_, []), t.get(g).push(b), t.get(_).push(p), e.has(g) || e.set(g, p), e.has(_) || e.set(_, b);
  };
  for (const p of m) a(p.start, p.end);
  const l = /* @__PURE__ */ new Set(), o = (p, b) => {
    const g = kt(p), _ = kt(b);
    return g < _ ? `${g}|${_}` : `${_}|${g}`;
  }, n = [];
  for (const [p, b] of t.entries()) {
    const g = e.get(p);
    for (const _ of b) {
      const d = o(g, _);
      if (l.has(d)) continue;
      const h = [g];
      let i = g, y = _;
      l.add(d);
      for (let u = 0; u < 1e5; u++) {
        h.push(y);
        const x = kt(y), S = t.get(x) ?? [];
        if (S.length === 0) break;
        let k = null;
        for (const A of S) {
          if (kt(A) === kt(i) && S.length > 1) continue;
          const C = o(y, A);
          if (!l.has(C)) {
            k = A, l.add(C);
            break;
          }
        }
        if (k || (k = S[0]), i = y, y = k, kt(y) === kt(g))
          break;
      }
      h.length >= 3 && n.push(h);
    }
  }
  n.sort((p, b) => Math.abs(Qt(b)) - Math.abs(Qt(p)));
  const s = [], f = /* @__PURE__ */ new Set();
  for (const p of n) {
    const b = p.map((g) => kt(g)).join(";");
    f.has(b) || (f.add(b), s.push(p));
  }
  return s;
}
function te(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(bt(e))), o = Math.max(1, Math.round(bt(a))), n = bt(1), s = [];
  for (const f of m.regions)
    for (const p of f.loops)
      s.push(jt(p, t, n));
  if (s.length === 0 && m.tracks.length) {
    const f = ce(m.tracks);
    if (f.length) {
      const p = f[0];
      s.push(jt(p, t, n));
      for (let b = 1; b < f.length; b++)
        s.push(jt(f[b], t, n));
    }
  }
  return s.length === 0 ? Yt(l, o) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${o}" viewBox="0 0 ${l} ${o}">
  <rect x="0" y="0" width="${l}" height="${o}" fill="black"/>
  <path d="${s.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function de(m) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const o of m.loops)
    for (const n of o)
      t = Math.min(t, n.x), e = Math.min(e, n.y), a = Math.max(a, n.x), l = Math.max(l, n.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function je(m, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const p of m.regions) {
    const b = de(p), g = (b.maxX - b.minX) * (b.maxY - b.minY);
    p.polarity === "clear" ? l = Math.max(l, g) : a = Math.max(a, g);
  }
  const o = m.tracks.filter((p) => p.polarity !== "clear").length + m.flashes.filter((p) => p.polarity !== "clear").length + m.regions.filter((p) => p.polarity !== "clear").length, n = m.tracks.filter((p) => p.polarity === "clear").length + m.flashes.filter((p) => p.polarity === "clear").length + m.regions.filter((p) => p.polarity === "clear").length, s = l > e * 0.85;
  return !(a > e * 0.85 || !s || !(n > o * 2));
}
function Pt(m, t, e, a) {
  const l = t.maxX - t.minX, o = t.maxY - t.minY, n = Math.max(1, Math.round(bt(l))), s = Math.max(1, Math.round(bt(o))), f = bt(1), p = je(m, t), b = p ? "white" : "black", g = (k, A) => {
    const C = k - t.minX, I = t.maxY - A;
    return { x: C * f, y: I * f };
  }, _ = (k, A) => {
    if (k.kind === "track") {
      const C = g(k.start.x, k.start.y), I = g(k.end.x, k.end.y), L = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, z = Math.max(1, L * f);
      return `<line x1="${C.x.toFixed(2)}" y1="${C.y.toFixed(2)}" x2="${I.x.toFixed(2)}" y2="${I.y.toFixed(2)}" stroke-width="${z.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const C = g(k.position.x, k.position.y), I = k.widthMm ?? k.diameterMm ?? 0.8, L = k.heightMm ?? k.diameterMm ?? 0.8, z = Math.max(0.01, Number.isFinite(I) ? I : 0.8) * f, U = Math.max(0.01, Number.isFinite(L) ? L : 0.8) * f, K = C.x - z / 2, M = C.y - U / 2, N = k.rotationDeg, c = N && Math.abs(N) > 0.01 ? ` transform="rotate(${(-N).toFixed(2)},${C.x.toFixed(2)},${C.y.toFixed(2)})"` : "";
      if (k.shape === "R" || k.shape === "O") {
        const nt = k.shape === "O" ? Math.min(z, U) * 0.5 : 0;
        return `<rect x="${K.toFixed(2)}" y="${M.toFixed(2)}" width="${z.toFixed(2)}" height="${U.toFixed(2)}" rx="${nt.toFixed(2)}" ry="${nt.toFixed(2)}" fill="${A}" fill-opacity="1"${c} />`;
      }
      if (Number.isFinite(k.cornerMm) && (k.cornerMm ?? 0) > 0) {
        const nt = Math.max(0, k.cornerMm * f);
        return `<rect x="${K.toFixed(2)}" y="${M.toFixed(2)}" width="${z.toFixed(2)}" height="${U.toFixed(2)}" rx="${nt.toFixed(2)}" ry="${nt.toFixed(2)}" fill="${A}" fill-opacity="1"${c} />`;
      }
      const $ = Math.max(1, Math.max(z, U) / 2);
      return `<circle cx="${C.x.toFixed(2)}" cy="${C.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
    }
    if (k.kind === "region") {
      const C = k.loops.map((I) => {
        if (!I.length) return "";
        const L = g(I[0].x, I[0].y), z = [`M ${L.x.toFixed(2)} ${L.y.toFixed(2)}`];
        for (let U = 1; U < I.length; U++) {
          const K = g(I[U].x, I[U].y);
          z.push(`L ${K.x.toFixed(2)} ${K.y.toFixed(2)}`);
        }
        return z.push("Z"), z.join(" ");
      }).join(" ");
      return C.trim() ? `<path d="${C}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  for (const k of m.ops) {
    const A = k.polarity === "clear" ? "black" : "white", C = _(k, A);
    C && d.push(C);
  }
  console.log("[polarity counts]", {
    tracksClear: m.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: m.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: p
  });
  const h = (t.maxX - t.minX) * (t.maxY - t.minY);
  let i = 0, y = 0;
  for (const k of m.regions) {
    const A = de(k), C = (A.maxX - A.minX) * (A.maxY - A.minY);
    k.polarity === "clear" ? y = Math.max(y, C) : i = Math.max(i, C);
  }
  const u = m.tracks.filter((k) => k.polarity !== "clear").length + m.flashes.filter((k) => k.polarity !== "clear").length + m.regions.filter((k) => k.polarity !== "clear").length, x = m.tracks.filter((k) => k.polarity === "clear").length + m.flashes.filter((k) => k.polarity === "clear").length + m.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: u,
    clearCount: x,
    largestDarkRegionArea: i,
    largestClearRegionArea: y,
    boardArea: h,
    negative: p
  });
  const S = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${s}" viewBox="0 0 ${n} ${s}">
  <defs>
    <mask id="${S}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${n}" height="${s}" fill="${b}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${n}" height="${s}" fill="${e}" opacity="${a}" mask="url(#${S})" />
</svg>`.trim();
}
function ee(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(bt(e))), o = Math.max(1, Math.round(bt(a))), n = Math.max(1e-6, bt(1)), s = "rgba(255,255,255,0.95)", f = "rgba(255,255,255,0.95)", p = m.tracks.map((_) => {
    const d = Ct(_.start.x, _.start.y, t), h = Ct(_.end.x, _.end.y, t), i = Number.isFinite(_.width) ? _.width : 0.15, y = Math.max(1, i * n);
    return `<line x1="${(d.x * n).toFixed(2)}" y1="${(d.y * n).toFixed(2)}" x2="${(h.x * n).toFixed(2)}" y2="${(h.y * n).toFixed(2)}" stroke="${s}" stroke-width="${y.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = m.flashes.map((_) => {
    const d = Ct(_.position.x, _.position.y, t), h = d.x * n, i = d.y * n, y = _.widthMm ?? _.diameterMm ?? 0.6, u = _.heightMm ?? _.diameterMm ?? 0.6;
    if (_.shape === "R" || _.shape === "O") {
      const S = y * n, k = u * n, A = h - S / 2, C = i - k / 2, I = _.shape === "O" ? Math.min(S, k) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${C.toFixed(2)}" width="${S.toFixed(2)}" height="${k.toFixed(2)}" rx="${I.toFixed(2)}" fill="${f}" />`;
    }
    const x = (_.diameterMm ?? 0.6) * n / 2;
    return `<circle cx="${h.toFixed(2)}" cy="${i.toFixed(2)}" r="${Math.max(1, x).toFixed(2)}" fill="${f}" />`;
  }), g = m.regions.map((_) => {
    const d = _.loops.map((h) => {
      if (!h.length) return "";
      const i = Ct(h[0].x, h[0].y, t), y = [`M ${(i.x * n).toFixed(2)} ${(i.y * n).toFixed(2)}`];
      for (let u = 1; u < h.length; u++) {
        const x = Ct(h[u].x, h[u].y, t);
        y.push(`L ${(x.x * n).toFixed(2)} ${(x.y * n).toFixed(2)}`);
      }
      return y.push("Z"), y.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${f}" fill-rule="evenodd" opacity="0.95" />` : "";
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
function Xe(m, t, e) {
  const a = e.maxX - e.minX, l = e.maxY - e.minY, o = Math.round(bt(a)), n = Math.round(bt(l)), s = bt(1), f = m.map((b) => {
    const g = Ct(b.x, b.y, e), _ = g.x * s, d = g.y * s, h = Math.max(1.5, (b.diameter || 0.6) * s / 2);
    return `<circle cx="${_.toFixed(2)}" cy="${d.toFixed(2)}" r="${(h + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${_.toFixed(2)}" cy="${d.toFixed(2)}" r="${h.toFixed(2)}" fill="#111111" />`;
  }), p = t.map((b) => {
    const g = Ct(b.x1, b.y1, e), _ = Ct(b.x2, b.y2, e), d = (g.x * s).toFixed(2), h = (g.y * s).toFixed(2), i = (_.x * s).toFixed(2), y = (_.y * s).toFixed(2), u = Math.max(3, (b.diameter || 0.6) * s);
    return `<line x1="${d}" y1="${h}" x2="${i}" y2="${y}" stroke="#c97c2a" stroke-width="${(u + 4).toFixed(2)}" stroke-linecap="round" /><line x1="${d}" y1="${h}" x2="${i}" y2="${y}" stroke="#111111" stroke-width="${u.toFixed(2)}" stroke-linecap="round" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${n}" viewBox="0 0 ${o} ${n}">
  ${f.join(`
  `)}
  ${p.join(`
  `)}
</svg>`.trim();
}
async function he(m) {
  const t = Object.keys(m).filter((H) => !!H), e = Te(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (H) => {
    if (!H) return null;
    const ht = m[H];
    return ht ? a.decode(ht) : null;
  }, o = await l(e.top_copper), n = await l(e.bottom_copper), s = await l(e.outline), f = e.drills?.length ? await Promise.all(e.drills.map((H) => l(H))) : [], p = await l(e.top_silk), b = await l(e.bottom_silk), g = e.inner_copper?.length ? await Promise.all(e.inner_copper.map((H) => l(H))) : [], _ = o ? At(e.top_copper || "top", o) : null, d = n ? At(e.bottom_copper || "bot", n) : null, h = s ? At(e.outline || "outline", s) : null, i = [], y = [];
  if (e.drills)
    for (let H = 0; H < e.drills.length; H++) {
      const ht = f[H];
      if (ht) {
        const Mt = Fe(e.drills[H], ht);
        for (const yt of Mt.holes) i.push({ x: yt.x, y: yt.y, diameter: yt.diameter });
        for (const yt of Mt.slots) y.push(yt);
      }
    }
  const u = await l(e.top_mask), x = await l(e.bottom_mask), S = p ? At(e.top_silk || "top_silk", p) : null, k = b ? At(e.bottom_silk || "bot_silk", b) : null, A = u ? At(e.top_mask || "top_mask", u) : null, C = x ? At(e.bottom_mask || "bot_mask", x) : null, I = g.map(
    (H, ht) => H ? At(e.inner_copper[ht], H) : null
  ), L = _ ? wt(xt(_)) : null, z = d ? wt(xt(d)) : null, U = h ? wt(xt(h)) : null, K = i.length || y.length ? wt(Ue(i, y)) : null, M = S ? wt(xt(S)) : null, N = k ? wt(xt(k)) : null, c = A ? wt(xt(A)) : null, $ = C ? wt(xt(C)) : null, nt = (U && Bt(U) ? U : null) || (L && Bt(L) ? L : null) || (z && Bt(z) ? z : null) || (K && Bt(K) ? K : null), X = nt ? nt.maxX - nt.minX : 1, ot = L ? Rt(L.maxX - L.minX, X) : 1, Z = z ? Rt(z.maxX - z.minX, X) : 1, it = U ? Rt(U.maxX - U.minX, X) : 1, F = K ? Rt(K.maxX - K.minX, X) : 1, P = M ? Rt(M.maxX - M.minX, X) : 1, rt = N ? Rt(N.maxX - N.minX, X) : 1, J = c ? Rt(c.maxX - c.minX, X) : 1, q = $ ? Rt($.maxX - $.minX, X) : 1, ut = I.map((H) => H ? wt(xt(H)) : null).map((H) => H ? Rt(H.maxX - H.minX, X) : 1), lt = _ ? Et(_, ot) : null, ct = d ? Et(d, Z) : null, B = h ? Et(h, it) : null, j = i.length ? De(i, F) : [], Q = y.length ? Le(y, F) : [], V = S ? Et(S, P) : null, r = k ? Et(k, rt) : null, O = A ? Et(A, J) : null, E = C ? Et(C, q) : null, w = I.map(
    (H, ht) => H ? Et(H, ut[ht]) : null
  );
  let v = null;
  if (B) {
    const H = wt(xt(B));
    Bt(H) && (v = H);
  }
  if (!v) {
    let H = Zt();
    lt && (H = Jt(H, xt(lt))), ct && (H = Jt(H, xt(ct))), H = wt(H), v = H;
  }
  const R = wt(v), D = R.maxX - R.minX, W = R.maxY - R.minY;
  let T;
  if (B) {
    const H = [];
    for (const ht of B.regions)
      for (const Mt of ht.loops)
        Mt.length >= 3 && H.push(Mt);
    if (H.length === 0 && B.tracks.length)
      for (const ht of ce(B.tracks))
        ht.length >= 3 && H.push(ht);
    H.length > 0 && (T = H);
  }
  const G = {
    board: {
      width_in: D / 25.4,
      height_in: W / 25.4,
      mm_bounds: {
        min_x_mm: R.minX,
        min_y_mm: R.minY,
        max_x_mm: R.maxX,
        max_y_mm: R.maxY
      }
    },
    outline_loops_mm: T
  }, tt = Math.max(1, Math.round(bt(D))), Y = Math.max(1, Math.round(bt(W))), et = [], st = (H) => {
    const ht = $e(H);
    return et.push(ht), ht;
  }, at = B ? te(B, R) : Yt(tt, Y), _t = B ? te(B, R) : Yt(tt, Y), pt = {
    top_board_mask: st(at),
    bottom_board_mask: st(_t)
  };
  lt && (pt.top_copper = st(Pt(lt, R, "#fbbf24", 1))), ct && (pt.bottom_copper = st(Pt(ct, R, "#38bdf8", 1))), O && (pt.top_mask = st(Pt(O, R, "#fbbf24", 0.9))), E && (pt.bottom_mask = st(Pt(E, R, "#38bdf8", 0.9))), (j.length || Q.length) && (pt.drills = st(Xe(j, Q, R)));
  const vt = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"], St = [];
  for (let H = 0; H < w.length; H++) {
    const ht = w[H];
    ht && St.push(st(Pt(ht, R, vt[H % vt.length], 1)));
  }
  return St.length && (pt.inner_copper = St), V && (pt.top_silk = st(ee(V, R))), r && (pt.bottom_silk = st(ee(r, R))), {
    boardGeom: G,
    layers: pt,
    revoke: () => et.forEach((H) => URL.revokeObjectURL(H))
  };
}
async function dr(m) {
  const t = m instanceof Uint8Array ? m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer : m instanceof ArrayBuffer ? m : await m.arrayBuffer(), { files: e, archiveType: a } = await le(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await he(e);
}
async function hr(m, t) {
  const { files: e } = await le(m, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await he(e);
}
function Xt(m, t) {
  const [
    e,
    a,
    l,
    o,
    n,
    s,
    f,
    p,
    b
  ] = m, [
    g,
    _,
    d,
    h,
    i,
    y,
    u,
    x,
    S
  ] = t;
  return [
    e * g + a * h + l * u,
    e * _ + a * i + l * x,
    e * d + a * y + l * S,
    o * g + n * h + s * u,
    o * _ + n * i + s * x,
    o * d + n * y + s * S,
    f * g + p * h + b * u,
    f * _ + p * i + b * x,
    f * d + p * y + b * S
  ];
}
function re(m, t) {
  return [1, 0, m, 0, 1, t, 0, 0, 1];
}
function Ye(m, t) {
  return [m, 0, 0, 0, t, 0, 0, 0, 1];
}
function Ze(m) {
  const t = Math.cos(m), e = Math.sin(m);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function ne(m, t) {
  const e = m[0] * t.x + m[1] * t.y + m[2], a = m[3] * t.x + m[4] * t.y + m[5], l = m[6] * t.x + m[7] * t.y + m[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function Ge(m) {
  const t = m[0], e = m[1], a = m[2], l = m[3], o = m[4], n = m[5], s = t * o - e * l;
  if (Math.abs(s) < 1e-12) throw new Error("Non-invertible transform");
  const f = 1 / s, p = o * f, b = -e * f, g = -l * f, _ = t * f, d = -(p * a + b * n), h = -(g * a + _ * n);
  return [p, b, d, g, _, h, 0, 0, 1];
}
class qe {
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
      return ne(this.worldToScreenMat, e);
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
      return ne(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: o, mirrorX: n, mirrorY: s } = this.camera, f = { x: t / 2, y: e / 2 }, p = s ? -1 : 1, b = n ? -1 : 1, g = re(-a.x, -a.y), _ = Ze(o), d = Ye(l * b, l * p), h = re(f.x, f.y), i = Xt(h, Xt(d, Xt(_, g)));
    this.worldToScreenMat = i, this.screenToWorldMat = Ge(i);
  }
}
class Ve {
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
let He = class {
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
class Ke {
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
    const { cx: l, cy: o } = this.cellCoord(t, e), n = Math.ceil(a / this.cellSize_mm), s = [];
    for (let f = -n; f <= n; f++)
      for (let p = -n; p <= n; p++) {
        const b = `${l + f},${o + p}`, g = this.cells.get(b);
        if (g)
          for (const _ of g) s.push(_);
      }
    return s;
  }
}
class Je {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new Ke(5), this.dirtyList = !0, this.listCache = [];
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
    for (const n of l) {
      const s = this.byId.get(n);
      s && o.push(s);
    }
    return o;
  }
}
class Qe {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, a, l = 10) {
    const o = t.screenToBoard({ x: e, y: a }), n = t.xform.getCamera().zoom, s = l / n, f = this.store.queryNear(o.x, o.y, s);
    let p = null;
    for (const b of f) {
      const g = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), _ = g.x - e, d = g.y - a, h = Math.sqrt(_ * _ + d * d);
      h <= l && (!p || h < p.distance_px) && (p = { id: b.id, marker: b, distance_px: h });
    }
    return p;
  }
}
class tr {
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
class ue {
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
class er {
  constructor(t, e) {
    this.passes = [], this.overlays = new He(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Je(), this.markerPicker = new Qe(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new tr(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const a = t.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context");
    this.ctx = a;
    const l = t.getBoundingClientRect(), o = {
      width_px: l.width,
      height_px: l.height
    };
    this.xform = new qe(e, o), this.visibility = new ue(), this.scheduler = new Ve(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: n, y_mm: s }) => {
        const f = this.xform.boardToScreen({ x: n, y: s });
        return { x_px: f.x, y_px: f.y };
      },
      screenToBoard: ({ x_px: n, y_px: s }) => {
        const f = this.xform.screenToBoard({ x: n, y: s });
        return { x_mm: f.x, y_mm: f.y };
      },
      getViewState: () => {
        const n = this.xform.getCamera();
        return { center_mm: n.center_mm, zoom: n.zoom, rotation_rad: n.rotation_rad };
      },
      getViewport: () => ({ width_px: this.canvas.width, height_px: this.canvas.height }),
      getBoardBounds: () => this.boardBounds,
      requestRender: (n) => this.requestRender(n)
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
      boardToScreen: (s) => this.xform.boardToScreen({ x: s.x, y: s.y }),
      screenToBoard: (s) => this.xform.screenToBoard({ x: s.x, y: s.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height);
    const n = window.devicePixelRatio || 1;
    t.scale(n, n), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width / n, e.height / n);
    for (const s of this.passes)
      if (s.enabled(o)) {
        t.save();
        try {
          s.draw(o);
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
    const n = l.screenToBoard({ x: e, y: a });
    this.emit("click:board", { x_mm: n.x, y_mm: n.y });
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
const It = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function fr(m, t, e, a) {
  return {
    id: `gerber:${m}`,
    order: t,
    enabled: (l) => l.visibility.gerber[e],
    draw: (l) => {
      const o = l.ctx, n = l.xform.getWorldToScreenMatrix();
      o.setTransform(n[0], n[3], n[1], n[4], n[2], n[5]), a(o);
    }
  };
}
class rr {
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
function nr(m, t) {
  return {
    id: "overlay:all",
    order: (It.OVERLAYS_MIN + It.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = m.getAll().filter((n) => e.visibility.overlays[n.id] ?? n.visible);
      l.sort((n, s) => n.zIndex - s.zIndex);
      const o = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const n of l)
        e.ctx.save(), n.draw(e.ctx, o), e.ctx.restore();
    }
  };
}
let ir = class {
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
        const n = t.boardToScreen(o.position);
        n.x < -10 || n.x > t.viewport.width_px + 10 || n.y < -10 || n.y > t.viewport.height_px + 10 || this.drawMarker(e, n, o, a);
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
function sr(m) {
  return {
    id: "markers",
    order: (It.MARKERS_MIN + It.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => m.draw(t)
  };
}
class or {
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
function ar(m, t) {
  return {
    id: "selection",
    order: (It.SELECTION_MIN + It.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const a = t();
      a && m.draw(e, a);
    }
  };
}
function pr(m, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, a = t.showDownloadButton !== !1;
  m.innerHTML = `
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

            <div class="layer-dropdown" id="layer-dropdown">
              <button class="btn" id="layer-menu-btn" type="button" title="Layer visibility">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:14px;height:14px"><path d="M1 4h14M3 8h10M5 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Layers
              </button>
              <div class="layer-panel" id="layer-panel" hidden></div>
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
  const l = m.firstElementChild, o = dt(l, "#board-viewport"), n = dt(l, "#render-canvas"), s = dt(l, "#grid-toggle"), f = dt(l, "#grid-units"), p = dt(l, "#fit-btn"), b = a ? dt(l, "#download-btn") : null, g = Array.from(l.querySelectorAll('input[name="side"]')), _ = dt(l, "#layer-menu-btn"), d = dt(l, "#layer-panel"), h = new er(n, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), i = new ue();
  i.subscribe(() => {
    h.requestRender("visibility-change");
  });
  const y = new rr(), u = new ir(), x = new or();
  let S = null;
  function k() {
    const B = o.getBoundingClientRect(), j = window.devicePixelRatio || 1;
    n.width = B.width * j, n.height = B.height * j, n.style.width = `${B.width}px`, n.style.height = `${B.height}px`, h.requestRender("resize");
  }
  const A = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (B, j) => {
      const V = j.view.zoom, r = f.value, O = r === "mm" ? 1 : 2.54, E = r === "mm" ? 10 : 25.4, w = O * V, v = E * V;
      if (w < 2) return;
      const R = n.width / (window.devicePixelRatio || 1), D = n.height / (window.devicePixelRatio || 1), W = j.screenToBoard({ x: 0, y: 0 }), T = j.screenToBoard({ x: R, y: D });
      B.setTransform(1, 0, 0, 1, 0, 0), B.strokeStyle = "rgba(59, 130, 246, 0.4)", B.lineWidth = 1, B.beginPath();
      const G = Math.floor(W.x / O) * O, tt = Math.floor(W.y / O) * O;
      for (let Y = G; Y <= T.x; Y += O) {
        const et = j.boardToScreen({ x: Y, y: 0 }).x;
        B.moveTo(et, 0), B.lineTo(et, n.height);
      }
      for (let Y = tt; Y <= T.y; Y += O) {
        const et = j.boardToScreen({ x: 0, y: Y }).y;
        B.moveTo(0, et), B.lineTo(n.width, et);
      }
      if (B.stroke(), v >= 8) {
        B.strokeStyle = "rgba(59, 130, 246, 0.7)", B.lineWidth = 1.5, B.beginPath();
        const Y = Math.floor(W.x / E) * E, et = Math.floor(W.y / E) * E;
        for (let st = Y; st <= T.x; st += E) {
          const at = j.boardToScreen({ x: st, y: 0 }).x;
          B.moveTo(at, 0), B.lineTo(at, n.height);
        }
        for (let st = et; st <= T.y; st += E) {
          const at = j.boardToScreen({ x: 0, y: st }).y;
          B.moveTo(0, at), B.lineTo(n.width, at);
        }
        B.stroke();
      }
    }
  };
  y.add(A), i.setOverlayVisibility("grid", !1), i.setMarkersVisibility(!1), h.addPass(nr(y, h.getOverlayApi())), h.addPass(sr(u)), h.addPass(ar(x, () => S));
  const C = {}, I = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:top-copper": { label: "Top copper", color: "#fbbf24" },
    "layer:top-mask": { label: "Top soldermask", color: "#fde68a" },
    "layer:top-silk": { label: "Top silkscreen", color: "#f1f5f9" },
    "layer:bottom-copper": { label: "Bottom copper", color: "#38bdf8" },
    "layer:bottom-mask": { label: "Bottom soldermask", color: "#bae6fd" },
    "layer:bottom-silk": { label: "Bottom silkscreen", color: "#f1f5f9" },
    "layer:drills": { label: "Drill holes", color: "#111111" }
  }, L = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  let z = null, U = {}, K = "top", M = !1;
  function N(B, j, Q) {
    if (!Q) return null;
    B in C || (C[B] = !0);
    const V = new Image();
    return V.src = Q, V.addEventListener("load", () => {
      h.requestRender(`image-loaded-${B}`);
    }), {
      id: B,
      order: j,
      enabled: (r) => !!(C[B] ?? !0) && !!z?.board?.mm_bounds,
      draw: (r) => {
        if (!V.complete || !z?.board?.mm_bounds) return;
        const O = r.ctx, E = r.xform.getWorldToScreenMatrix();
        O.setTransform(E[0], E[3], E[1], E[4], E[2], E[5]);
        let w;
        (U.top_board_mask || U.bottom_board_mask) && (w = 0.5);
        const v = $(O, z, w);
        ot(O, v, (R) => {
          if (!z?.board?.mm_bounds) return;
          const D = z.board.mm_bounds, W = D.max_x_mm - D.min_x_mm, T = D.max_y_mm - D.min_y_mm;
          R.drawImage(V, D.min_x_mm, D.min_y_mm, W, T);
        });
      }
    };
  }
  function c(B, j) {
    return B in C || (C[B] = !0), {
      id: B,
      order: j,
      enabled: (Q) => !!(C[B] ?? !0) && !!z?.board?.mm_bounds,
      draw: (Q) => {
        if (!z?.board?.mm_bounds) return;
        const V = Q.ctx, r = Q.xform.getWorldToScreenMatrix();
        V.setTransform(r[0], r[3], r[1], r[4], r[2], r[5]);
        const O = $(V, z, 0.5);
        X(V, O);
      }
    };
  }
  function $(B, j, Q) {
    if (!j?.board?.mm_bounds) return new Path2D();
    const V = j.board.mm_bounds;
    if (j.outline_loops_mm?.length) {
      const r = new Path2D(), O = (E) => V.max_y_mm + V.min_y_mm - E;
      for (const E of j.outline_loops_mm)
        if (E.length) {
          r.moveTo(E[0].x, O(E[0].y));
          for (let w = 1; w < E.length; w++)
            r.lineTo(E[w].x, O(E[w].y));
          r.closePath();
        }
      return r;
    }
    return nt(
      V.min_x_mm,
      V.min_y_mm,
      V.max_x_mm - V.min_x_mm,
      V.max_y_mm - V.min_y_mm,
      Q || 0
    );
  }
  function nt(B, j, Q, V, r) {
    const O = new Path2D(), E = Math.max(0, Math.min(r, Math.min(Q, V) / 2));
    return O.moveTo(B + E, j), O.lineTo(B + Q - E, j), O.quadraticCurveTo(B + Q, j, B + Q, j + E), O.lineTo(B + Q, j + V - E), O.quadraticCurveTo(B + Q, j + V, B + Q - E, j + V), O.lineTo(B + E, j + V), O.quadraticCurveTo(B, j + V, B, j + V - E), O.lineTo(B, j + E), O.quadraticCurveTo(B, j, B + E, j), O.closePath(), O;
  }
  function X(B, j) {
    B.save(), B.clip(j), B.fillStyle = "#1a5f1a", B.fill(j), B.strokeStyle = "#0d3d0d", B.lineWidth = 0.1, B.stroke(j), B.restore();
  }
  function ot(B, j, Q) {
    B.save(), B.clip(j), Q(B), B.restore();
  }
  function Z() {
    if ([
      "layer:fr4",
      "layer:top-copper",
      "layer:bottom-copper",
      "layer:top-mask",
      "layer:bottom-mask",
      "layer:top-silk",
      "layer:bottom-silk",
      "layer:drills",
      "layer:vias",
      ...Object.keys(C).filter((Q) => Q.startsWith("layer:inner-"))
    ].forEach((Q) => h.removePass(Q)), !z) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: K === "bottom" ? U.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: K === "bottom" ? U.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: K === "bottom" ? U.bottom_silk : void 0 },
      // Inner layers occupy orders 21..24 (registered dynamically below)
      { id: "layer:top-copper", order: 25, url: K === "top" ? U.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: K === "top" ? U.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: K === "top" ? U.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: U.drills },
      { id: "layer:vias", order: 45, url: U.vias }
    ].forEach((Q) => {
      let V;
      Q.useFR4 ? V = c(Q.id, Q.order) : Q.url && (V = N(Q.id, Q.order, Q.url)), V && h.addPass(V);
    }), U.inner_copper && U.inner_copper.forEach((Q, V) => {
      const r = `layer:inner-${V + 1}`;
      I[r] = {
        label: `Inner ${V + 1}`,
        color: L[V % L.length]
      };
      const O = N(r, 21 + V, Q);
      O && h.addPass(O);
    }), h.requestRender("side-switch"), setTimeout(() => h.requestRender("side-switch-delayed"), 50), it();
  }
  function it() {
    const Q = [
      "layer:drills",
      "layer:top-silk",
      "layer:top-mask",
      "layer:top-copper",
      ...Object.keys(I).filter((V) => V.startsWith("layer:inner-")).sort((V, r) => {
        const O = parseInt(V.split("-").pop() || "0", 10), E = parseInt(r.split("-").pop() || "0", 10);
        return O - E;
      }),
      "layer:bottom-silk",
      "layer:bottom-mask",
      "layer:bottom-copper",
      "layer:fr4"
    ].filter((V) => !!h.getPass(V));
    d.innerHTML = Q.map((V) => {
      const r = I[V] ?? { label: V, color: "#888" }, O = C[V] ?? !0, E = r.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${V}"><span class="layer-swatch" style="background:${r.color};${E}"></span><span>${r.label}</span><input type="checkbox"${O ? " checked" : ""} /></label>`;
    }).join(""), d.querySelectorAll(".layer-item input").forEach((V) => {
      V.addEventListener("change", () => {
        const r = V.closest("[data-layer-id]")?.dataset.layerId;
        r && (C[r] = V.checked, h.requestRender("layer-toggle"));
      });
    });
  }
  function F(B = 0.08) {
    if (!z?.board?.mm_bounds) return;
    const j = o.getBoundingClientRect(), Q = z.board.mm_bounds, V = Q.max_x_mm - Q.min_x_mm, r = Q.max_y_mm - Q.min_y_mm, O = j.width * (1 - 2 * B), E = j.height * (1 - 2 * B), w = O / V, v = E / r, R = Math.min(w, v), D = (Q.min_x_mm + Q.max_x_mm) / 2, W = (Q.min_y_mm + Q.max_y_mm) / 2;
    h.setCamera({
      center_mm: { x: D, y: W },
      zoom: R
    });
  }
  n.addEventListener("wheel", (B) => {
    B.preventDefault(), M = !0;
    const j = n.getBoundingClientRect(), Q = B.clientX - j.left, V = B.clientY - j.top, r = h.getCamera(), O = B.deltaY < 0 ? 1.1 : 0.9, E = Math.max(0.2, Math.min(50, r.zoom * O)), w = h.screenToBoard(Q, V);
    h.setCamera({ zoom: E });
    const v = h.screenToBoard(Q, V), R = w.x - v.x, D = w.y - v.y, W = {
      x: r.center_mm.x + R,
      y: r.center_mm.y + D
    };
    h.setCamera({
      center_mm: W,
      zoom: E
    });
  }, { passive: !1 });
  let P = !1, rt = null;
  n.addEventListener("mousedown", (B) => {
    if (B.button !== 0) return;
    B.preventDefault(), M = !0, P = !0;
    const j = n.getBoundingClientRect();
    rt = h.screenToBoard(
      B.clientX - j.left,
      B.clientY - j.top
    );
  });
  const J = (B) => {
    if (!P || !rt) return;
    const j = n.getBoundingClientRect(), Q = h.screenToBoard(
      B.clientX - j.left,
      B.clientY - j.top
    ), V = rt.x - Q.x, r = rt.y - Q.y, O = h.getCamera();
    h.setCamera({
      center_mm: {
        x: O.center_mm.x + V,
        y: O.center_mm.y + r
      }
    });
  }, q = () => {
    P = !1, rt = null;
  };
  window.addEventListener("mousemove", J), window.addEventListener("mouseup", q), s.addEventListener("change", () => {
    const B = s.checked;
    i.setOverlayVisibility("grid", B), A.visible = B, h.requestRender("grid-toggle");
  }), f.addEventListener("change", () => {
    i.isOverlayVisible("grid") && h.requestRender("grid-units");
  }), p.addEventListener("click", () => F(0.08)), b?.addEventListener("click", () => t.onDownload?.()), _.addEventListener("click", (B) => {
    B.stopPropagation();
    const j = !d.hidden;
    d.hidden = j, _.classList.toggle("active", !j);
  }), document.addEventListener("click", (B) => {
    !d.hidden && !d.contains(B.target) && B.target !== _ && (d.hidden = !0, _.classList.remove("active"));
  }), g.forEach((B) => {
    B.addEventListener("change", () => {
      K = g.find((j) => j.checked)?.value || "top", Z();
    });
  }), window.addEventListener("resize", () => {
    k(), M || F(0.08);
  });
  function dt(B, j) {
    const Q = B.querySelector(j);
    if (!Q) throw new Error(`Missing required element: ${j}`);
    return Q;
  }
  function ut(B) {
    z = B.boardGeom, U = B.layers, z?.board?.mm_bounds && h.setBoardBounds({
      minX_mm: z.board.mm_bounds.min_x_mm,
      minY_mm: z.board.mm_bounds.min_y_mm,
      maxX_mm: z.board.mm_bounds.max_x_mm,
      maxY_mm: z.board.mm_bounds.max_y_mm
    }), Z(), k(), F(0.08);
  }
  function lt(B) {
    K = B;
    const j = g.find((Q) => Q.value === B);
    j && (j.checked = !0), Z();
  }
  function ct() {
    window.removeEventListener("mousemove", J), window.removeEventListener("mouseup", q), m.innerHTML = "";
  }
  return k(), {
    setData: ut,
    setSideMode: lt,
    fit: () => F(0.08),
    dispose: ct,
    // Expose new render pipeline API
    viewer: h,
    visibility: i,
    overlayRegistry: y,
    markerRenderer: u,
    setSelection: (B) => {
      S = B, h.requestRender("selection-change");
    },
    addMarker: (B) => {
      if (typeof B.x_mm != "number" || typeof B.y_mm != "number" || !isFinite(B.x_mm) || !isFinite(B.y_mm)) {
        console.warn(`Invalid marker coordinates for ${B.id}:`, {
          x_mm: B.x_mm,
          y_mm: B.y_mm,
          marker: B,
          keys: Object.keys(B)
        });
        return;
      }
      const j = {
        id: B.id,
        position: { x: B.x_mm, y: B.y_mm },
        type: "custom",
        // Default type for DFM markers
        data: {
          ...B.data,
          severity: B.severity,
          layer: B.layer,
          radius_mm: B.radius_mm
        }
      };
      u.add(j), h.requestRender("marker-added");
    },
    addMarkers: (B) => {
      for (const j of B) {
        if (typeof j.x_mm != "number" || typeof j.y_mm != "number" || !isFinite(j.x_mm) || !isFinite(j.y_mm)) {
          console.warn(`Invalid marker coordinates for ${j.id}:`, {
            x_mm: j.x_mm,
            y_mm: j.y_mm,
            marker: j,
            keys: Object.keys(j)
          });
          continue;
        }
        const Q = {
          id: j.id,
          position: { x: j.x_mm, y: j.y_mm },
          type: "custom",
          // Default type for DFM markers
          data: {
            ...j.data,
            severity: j.severity,
            layer: j.layer,
            radius_mm: j.radius_mm
          }
        };
        u.add(Q);
      }
      h.requestRender("markers-added");
    },
    removeMarker: (B) => {
      u.remove(B), h.requestRender("marker-removed");
    }
  };
}
function yr(m, t) {
  return {
    id: "overlay:all",
    order: It.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const a = e.xform.getWorldToScreenMatrix(), l = m.getSortedVisible();
      for (const o of l)
        e.ctx.save(), o.drawInWorldSpace ? e.ctx.setTransform(a[0], a[3], a[1], a[4], a[2], a[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), o.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function gr() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (m, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      m.fillStyle = "red";
      for (const a of e)
        m.beginPath(), m.arc(a.x_mm, a.y_mm, 0.25, 0, Math.PI * 2), m.fill();
    }
  };
}
function _r(m) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const a = m();
      a && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(a.x_px + 12, a.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(a.text, a.x_px + 15, a.y_px - 5));
    }
  };
}
function br(m = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const a = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let l = a.minX_mm; l <= a.maxX_mm; l += m)
        t.moveTo(l, a.minY_mm), t.lineTo(l, a.maxY_mm);
      for (let l = a.minY_mm; l <= a.maxY_mm; l += m)
        t.moveTo(a.minX_mm, l), t.lineTo(a.maxX_mm, l);
      t.stroke();
    }
  };
}
function vr(m) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, a) => {
      t += 16;
      const l = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + l * 0.7})`, e.beginPath(), e.arc(m.x_mm, m.y_mm, 0.5 + l * 0.5, 0, Math.PI * 2), e.fill(), a.requestRender("overlay:animate");
    }
  };
}
function lr(m, t) {
  const e = t.maxX_mm - t.minX_mm, a = t.maxY_mm - t.minY_mm;
  return m.x_mm < 0 || m.x_mm > e || m.y_mm < 0 || m.y_mm > a;
}
class cr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const a = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: l, height_px: o } = t.viewport, n = 4;
    for (const s of a) {
      if (typeof s.x_mm != "number" || typeof s.y_mm != "number" || !isFinite(s.x_mm) || !isFinite(s.y_mm)) {
        console.warn(`Invalid marker coordinates for ${s.id}:`, {
          x_mm: s.x_mm,
          y_mm: s.y_mm,
          marker: s,
          keys: Object.keys(s)
        });
        continue;
      }
      const f = t.boardToScreen({ x: s.x_mm, y: s.y_mm }), p = f.x, b = f.y;
      if (p < -10 || b < -10 || p > l + 10 || b > o + 10) continue;
      const g = e?.boardBounds ? lr({ x_mm: s.x_mm, y_mm: s.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, s, e?.selectedId === s.id, e?.hoverId === s.id, g), t.ctx.beginPath(), t.ctx.arc(p, b, n, 0, Math.PI * 2), e?.selectedId === s.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
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
function wr(m, t) {
  const e = new cr(m);
  return {
    id: "markers",
    order: It.MARKERS_MIN,
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
  tr as Emitter,
  mt as GerberError,
  Qe as MarkerPicker,
  cr as MarkerRenderer,
  Je as MarkerStore,
  He as OverlayRegistry,
  Ve as RenderScheduler,
  or as SelectionRenderer,
  Ke as UniformGridIndex,
  er as Viewer,
  qe as ViewportTransform,
  ue as VisibilityManager,
  fr as createGerberPass,
  br as createGridOverlay,
  pr as createIntegratedViewer,
  wr as createMarkerPass,
  yr as createOverlayPass,
  vr as createPulsingMarkerOverlay,
  ar as createSelectionPass,
  _r as createTooltipOverlay,
  gr as createViolationDotsOverlay,
  Re as detectGerberBundle,
  hr as renderGerbers,
  he as renderGerbersFiles,
  dr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
