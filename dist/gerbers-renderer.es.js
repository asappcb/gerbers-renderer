var Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function fe(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
function Ft(f) {
  throw new Error('Could not dynamically require "' + f + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Dt = { exports: {} };
var Zt;
function me() {
  return Zt || (Zt = 1, (function(f, t) {
    (function(e) {
      f.exports = e();
    })(function() {
      return (function e(a, l, s) {
        function i(g, b) {
          if (!l[g]) {
            if (!a[g]) {
              var m = typeof Ft == "function" && Ft;
              if (!b && m) return m(g, !0);
              if (n) return n(g, !0);
              var u = new Error("Cannot find module '" + g + "'");
              throw u.code = "MODULE_NOT_FOUND", u;
            }
            var d = l[g] = { exports: {} };
            a[g][0].call(d.exports, function(y) {
              var o = a[g][1][y];
              return i(o || y);
            }, d, d.exports, e, a, l, s);
          }
          return l[g].exports;
        }
        for (var n = typeof Ft == "function" && Ft, h = 0; h < s.length; h++) i(s[h]);
        return i;
      })({ 1: [function(e, a, l) {
        var s = e("./utils"), i = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(h) {
          for (var g, b, m, u, d, y, o, _ = [], p = 0, w = h.length, M = w, k = s.getTypeOf(h) !== "string"; p < h.length; ) M = w - p, m = k ? (g = h[p++], b = p < w ? h[p++] : 0, p < w ? h[p++] : 0) : (g = h.charCodeAt(p++), b = p < w ? h.charCodeAt(p++) : 0, p < w ? h.charCodeAt(p++) : 0), u = g >> 2, d = (3 & g) << 4 | b >> 4, y = 1 < M ? (15 & b) << 2 | m >> 6 : 64, o = 2 < M ? 63 & m : 64, _.push(n.charAt(u) + n.charAt(d) + n.charAt(y) + n.charAt(o));
          return _.join("");
        }, l.decode = function(h) {
          var g, b, m, u, d, y, o = 0, _ = 0, p = "data:";
          if (h.substr(0, p.length) === p) throw new Error("Invalid base64 input, it looks like a data url.");
          var w, M = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === n.charAt(64) && M--, h.charAt(h.length - 2) === n.charAt(64) && M--, M % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (w = i.uint8array ? new Uint8Array(0 | M) : new Array(0 | M); o < h.length; ) g = n.indexOf(h.charAt(o++)) << 2 | (u = n.indexOf(h.charAt(o++))) >> 4, b = (15 & u) << 4 | (d = n.indexOf(h.charAt(o++))) >> 2, m = (3 & d) << 6 | (y = n.indexOf(h.charAt(o++))), w[_++] = g, d !== 64 && (w[_++] = b), y !== 64 && (w[_++] = m);
          return w;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var s = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function g(b, m, u, d, y) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = u, this.compression = d, this.compressedContent = y;
        }
        g.prototype = { getContentWorker: function() {
          var b = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(b, m, u) {
          return b.pipe(new n()).pipe(new h("uncompressedSize")).pipe(m.compressWorker(u)).pipe(new h("compressedSize")).withStreamInfo("compression", m);
        }, a.exports = g;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, a, l) {
        var s = e("./stream/GenericWorker");
        l.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, l.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, a, l) {
        var s = e("./utils"), i = (function() {
          for (var n, h = [], g = 0; g < 256; g++) {
            n = g;
            for (var b = 0; b < 8; b++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            h[g] = n;
          }
          return h;
        })();
        a.exports = function(n, h) {
          return n !== void 0 && n.length ? s.getTypeOf(n) !== "string" ? (function(g, b, m, u) {
            var d = i, y = u + m;
            g ^= -1;
            for (var o = u; o < y; o++) g = g >>> 8 ^ d[255 & (g ^ b[o])];
            return -1 ^ g;
          })(0 | h, n, n.length, 0) : (function(g, b, m, u) {
            var d = i, y = u + m;
            g ^= -1;
            for (var o = u; o < y; o++) g = g >>> 8 ^ d[255 & (g ^ b.charCodeAt(o))];
            return -1 ^ g;
          })(0 | h, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), n = e("./utils"), h = e("./stream/GenericWorker"), g = s ? "uint8array" : "array";
        function b(m, u) {
          h.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = u, this.meta = {};
        }
        l.magic = "\b\0", n.inherits(b, h), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(g, m.data), !1);
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
        }, l.compressWorker = function(m) {
          return new b("Deflate", m);
        }, l.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function s(d, y) {
          var o, _ = "";
          for (o = 0; o < y; o++) _ += String.fromCharCode(255 & d), d >>>= 8;
          return _;
        }
        function i(d, y, o, _, p, w) {
          var M, k, R = d.file, O = d.compression, B = w !== g.utf8encode, j = n.transformTo("string", w(R.name)), I = n.transformTo("string", g.utf8encode(R.name)), Y = R.comment, Q = n.transformTo("string", w(Y)), S = n.transformTo("string", g.utf8encode(Y)), L = I.length !== R.name.length, c = S.length !== Y.length, $ = "", tt = "", X = "", it = R.dir, Z = R.date, rt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          y && !o || (rt.crc32 = d.crc32, rt.compressedSize = d.compressedSize, rt.uncompressedSize = d.uncompressedSize);
          var P = 0;
          y && (P |= 8), B || !L && !c || (P |= 2048);
          var C = 0, z = 0;
          it && (C |= 16), p === "UNIX" ? (z = 798, C |= (function(N, K) {
            var nt = N;
            return N || (nt = K ? 16893 : 33204), (65535 & nt) << 16;
          })(R.unixPermissions, it)) : (z = 20, C |= (function(N) {
            return 63 & (N || 0);
          })(R.dosPermissions)), M = Z.getUTCHours(), M <<= 6, M |= Z.getUTCMinutes(), M <<= 5, M |= Z.getUTCSeconds() / 2, k = Z.getUTCFullYear() - 1980, k <<= 4, k |= Z.getUTCMonth() + 1, k <<= 5, k |= Z.getUTCDate(), L && (tt = s(1, 1) + s(b(j), 4) + I, $ += "up" + s(tt.length, 2) + tt), c && (X = s(1, 1) + s(b(Q), 4) + S, $ += "uc" + s(X.length, 2) + X);
          var T = "";
          return T += `
\0`, T += s(P, 2), T += O.magic, T += s(M, 2), T += s(k, 2), T += s(rt.crc32, 4), T += s(rt.compressedSize, 4), T += s(rt.uncompressedSize, 4), T += s(j.length, 2), T += s($.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + T + j + $, dirRecord: m.CENTRAL_FILE_HEADER + s(z, 2) + T + s(Q.length, 2) + "\0\0\0\0" + s(C, 4) + s(_, 4) + j + $ + Q };
        }
        var n = e("../utils"), h = e("../stream/GenericWorker"), g = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function u(d, y, o, _) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = y, this.zipPlatform = o, this.encodeFileName = _, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(u, h), u.prototype.push = function(d) {
          var y = d.meta.percent || 0, o = this.entriesCount, _ = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, h.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: o ? (y + 100 * (o - _ - 1)) / o : 100 } }));
        }, u.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var y = this.streamFiles && !d.file.dir;
          if (y) {
            var o = i(d, y, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: o.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, u.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var y = this.streamFiles && !d.file.dir, o = i(d, y, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(o.dirRecord), y) this.push({ data: (function(_) {
            return m.DATA_DESCRIPTOR + s(_.crc32, 4) + s(_.compressedSize, 4) + s(_.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: o.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, u.prototype.flush = function() {
          for (var d = this.bytesWritten, y = 0; y < this.dirRecords.length; y++) this.push({ data: this.dirRecords[y], meta: { percent: 100 } });
          var o = this.bytesWritten - d, _ = (function(p, w, M, k, R) {
            var O = n.transformTo("string", R(k));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(p, 2) + s(p, 2) + s(w, 4) + s(M, 4) + s(O.length, 2) + O;
          })(this.dirRecords.length, o, d, this.zipComment, this.encodeFileName);
          this.push({ data: _, meta: { percent: 100 } });
        }, u.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, u.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var y = this;
          return d.on("data", function(o) {
            y.processChunk(o);
          }), d.on("end", function() {
            y.closedSource(y.previous.streamInfo), y._sources.length ? y.prepareNextSource() : y.end();
          }), d.on("error", function(o) {
            y.error(o);
          }), this;
        }, u.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, u.prototype.error = function(d) {
          var y = this._sources;
          if (!h.prototype.error.call(this, d)) return !1;
          for (var o = 0; o < y.length; o++) try {
            y[o].error(d);
          } catch {
          }
          return !0;
        }, u.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var d = this._sources, y = 0; y < d.length; y++) d[y].lock();
        }, a.exports = u;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        l.generateWorker = function(n, h, g) {
          var b = new i(h.streamFiles, g, h.platform, h.encodeFileName), m = 0;
          try {
            n.forEach(function(u, d) {
              m++;
              var y = (function(w, M) {
                var k = w || M, R = s[k];
                if (!R) throw new Error(k + " is not a valid compression method !");
                return R;
              })(d.options.compression, h.compression), o = d.options.compressionOptions || h.compressionOptions || {}, _ = d.dir, p = d.date;
              d._compressWorker(y, o).withStreamInfo("file", { name: u, dir: _, date: p, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (u) {
            b.error(u);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, a, l) {
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
        }, s.external = e("./external"), a.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, a, l) {
        var s = e("./utils"), i = e("./external"), n = e("./utf8"), h = e("./zipEntries"), g = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(u) {
          return new i.Promise(function(d, y) {
            var o = u.decompressed.getContentWorker().pipe(new g());
            o.on("error", function(_) {
              y(_);
            }).on("end", function() {
              o.streamInfo.crc32 !== u.decompressed.crc32 ? y(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        a.exports = function(u, d) {
          var y = this;
          return d = s.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), b.isNode && b.isStream(u) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", u, !0, d.optimizedBinaryString, d.base64).then(function(o) {
            var _ = new h(d);
            return _.load(o), _;
          }).then(function(o) {
            var _ = [i.Promise.resolve(o)], p = o.files;
            if (d.checkCRC32) for (var w = 0; w < p.length; w++) _.push(m(p[w]));
            return i.Promise.all(_);
          }).then(function(o) {
            for (var _ = o.shift(), p = _.files, w = 0; w < p.length; w++) {
              var M = p[w], k = M.fileNameStr, R = s.resolve(M.fileNameStr);
              y.file(R, M.decompressed, { binary: !0, optimizedBinaryString: !0, date: M.date, dir: M.dir, comment: M.fileCommentStr.length ? M.fileCommentStr : null, unixPermissions: M.unixPermissions, dosPermissions: M.dosPermissions, createFolders: d.createFolders }), M.dir || (y.file(R).unsafeOriginalName = k);
            }
            return _.zipComment.length && (y.comment = _.zipComment), y;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function n(h, g) {
          i.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(g);
        }
        s.inherits(n, i), n.prototype._bindStream = function(h) {
          var g = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            g.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            g.isPaused ? this.generatedError = b : g.error(b);
          }).on("end", function() {
            g.isPaused ? g._upstreamEnded = !0 : g.end();
          });
        }, n.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var s = e("readable-stream").Readable;
        function i(n, h, g) {
          s.call(this, h), this._helper = n;
          var b = this;
          n.on("data", function(m, u) {
            b.push(m) || b._helper.pause(), g && g(u);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(i, s), i.prototype._read = function() {
          this._helper.resume();
        }, a.exports = i;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, a, l) {
        a.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, i) {
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
      }, {}], 15: [function(e, a, l) {
        function s(R, O, B) {
          var j, I = n.getTypeOf(O), Y = n.extend(B || {}, b);
          Y.date = Y.date || /* @__PURE__ */ new Date(), Y.compression !== null && (Y.compression = Y.compression.toUpperCase()), typeof Y.unixPermissions == "string" && (Y.unixPermissions = parseInt(Y.unixPermissions, 8)), Y.unixPermissions && 16384 & Y.unixPermissions && (Y.dir = !0), Y.dosPermissions && 16 & Y.dosPermissions && (Y.dir = !0), Y.dir && (R = p(R)), Y.createFolders && (j = _(R)) && w.call(this, j, !0);
          var Q = I === "string" && Y.binary === !1 && Y.base64 === !1;
          B && B.binary !== void 0 || (Y.binary = !Q), (O instanceof m && O.uncompressedSize === 0 || Y.dir || !O || O.length === 0) && (Y.base64 = !1, Y.binary = !0, O = "", Y.compression = "STORE", I = "string");
          var S = null;
          S = O instanceof m || O instanceof h ? O : y.isNode && y.isStream(O) ? new o(R, O) : n.prepareContent(R, O, Y.binary, Y.optimizedBinaryString, Y.base64);
          var L = new u(R, S, Y);
          this.files[R] = L;
        }
        var i = e("./utf8"), n = e("./utils"), h = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), u = e("./zipObject"), d = e("./generate"), y = e("./nodejsUtils"), o = e("./nodejs/NodejsStreamInputAdapter"), _ = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var O = R.lastIndexOf("/");
          return 0 < O ? R.substring(0, O) : "";
        }, p = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, w = function(R, O) {
          return O = O !== void 0 ? O : b.createFolders, R = p(R), this.files[R] || s.call(this, R, null, { dir: !0, createFolders: O }), this.files[R];
        };
        function M(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var O, B, j;
          for (O in this.files) j = this.files[O], (B = O.slice(this.root.length, O.length)) && O.slice(0, this.root.length) === this.root && R(B, j);
        }, filter: function(R) {
          var O = [];
          return this.forEach(function(B, j) {
            R(B, j) && O.push(j);
          }), O;
        }, file: function(R, O, B) {
          if (arguments.length !== 1) return R = this.root + R, s.call(this, R, O, B), this;
          if (M(R)) {
            var j = R;
            return this.filter(function(Y, Q) {
              return !Q.dir && j.test(Y);
            });
          }
          var I = this.files[this.root + R];
          return I && !I.dir ? I : null;
        }, folder: function(R) {
          if (!R) return this;
          if (M(R)) return this.filter(function(I, Y) {
            return Y.dir && R.test(I);
          });
          var O = this.root + R, B = w.call(this, O), j = this.clone();
          return j.root = B.name, j;
        }, remove: function(R) {
          R = this.root + R;
          var O = this.files[R];
          if (O || (R.slice(-1) !== "/" && (R += "/"), O = this.files[R]), O && !O.dir) delete this.files[R];
          else for (var B = this.filter(function(I, Y) {
            return Y.name.slice(0, R.length) === R;
          }), j = 0; j < B.length; j++) delete this.files[B[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var O, B = {};
          try {
            if ((B = n.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = B.type.toLowerCase(), B.compression = B.compression.toUpperCase(), B.type === "binarystring" && (B.type = "string"), !B.type) throw new Error("No output type specified.");
            n.checkSupport(B.type), B.platform !== "darwin" && B.platform !== "freebsd" && B.platform !== "linux" && B.platform !== "sunos" || (B.platform = "UNIX"), B.platform === "win32" && (B.platform = "DOS");
            var j = B.comment || this.comment || "";
            O = d.generateWorker(this, B, j);
          } catch (I) {
            (O = new h("error")).error(I);
          }
          return new g(O, B.type || "string", B.mimeType);
        }, generateAsync: function(R, O) {
          return this.generateInternalStream(R).accumulate(O);
        }, generateNodeStream: function(R, O) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(O);
        } };
        a.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var s = e("./DataReader");
        function i(n) {
          s.call(this, n);
          for (var h = 0; h < this.data.length; h++) n[h] = 255 & n[h];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, i.prototype.lastIndexOfSignature = function(n) {
          for (var h = n.charCodeAt(0), g = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), u = this.length - 4; 0 <= u; --u) if (this.data[u] === h && this.data[u + 1] === g && this.data[u + 2] === b && this.data[u + 3] === m) return u - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(n) {
          var h = n.charCodeAt(0), g = n.charCodeAt(1), b = n.charCodeAt(2), m = n.charCodeAt(3), u = this.readData(4);
          return h === u[0] && g === u[1] && b === u[2] && m === u[3];
        }, i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, a, l) {
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
          var h, g = 0;
          for (this.checkOffset(n), h = this.index + n - 1; h >= this.index; h--) g = (g << 8) + this.byteAt(h);
          return this.index += n, g;
        }, readString: function(n) {
          return s.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, a.exports = i;
      }, { "../utils": 32 }], 19: [function(e, a, l) {
        var s = e("./Uint8ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          this.checkOffset(n);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, a, l) {
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
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var s = e("./ArrayReader");
        function i(n) {
          s.call(this, n);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, h;
        }, a.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var s = e("../utils"), i = e("../support"), n = e("./ArrayReader"), h = e("./StringReader"), g = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        a.exports = function(m) {
          var u = s.getTypeOf(m);
          return s.checkSupport(u), u !== "string" || i.uint8array ? u === "nodebuffer" ? new g(m) : i.uint8array ? new b(s.transformTo("uint8array", m)) : new n(s.transformTo("array", m)) : new h(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../utils");
        function n(h) {
          s.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        i.inherits(n, s), n.prototype.processChunk = function(h) {
          this.push({ data: i.transformTo(this.destType, h.data), meta: h.meta });
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function n() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, s), n.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = i(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, a.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        s.inherits(n, i), n.prototype.processChunk = function(h) {
          if (h) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + h.data.length;
          }
          i.prototype.processChunk.call(this, h);
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function n(h) {
          i.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            g.dataIsReady = !0, g.data = b, g.max = b && b.length || 0, g.type = s.getTypeOf(b), g.isPaused || g._tickAndRepeat();
          }, function(b) {
            g.error(b);
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
          var h = null, g = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              h = this.data.substring(this.index, g);
              break;
            case "uint8array":
              h = this.data.subarray(this.index, g);
              break;
            case "array":
            case "nodebuffer":
              h = this.data.slice(this.index, g);
          }
          return this.index = g, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, a.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, a, l) {
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
        } }, a.exports = s;
      }, {}], 29: [function(e, a, l) {
        var s = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), h = e("../base64"), g = e("../support"), b = e("../external"), m = null;
        if (g.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function u(y, o) {
          return new b.Promise(function(_, p) {
            var w = [], M = y._internalType, k = y._outputType, R = y._mimeType;
            y.on("data", function(O, B) {
              w.push(O), o && o(B);
            }).on("error", function(O) {
              w = [], p(O);
            }).on("end", function() {
              try {
                var O = (function(B, j, I) {
                  switch (B) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", j), I);
                    case "base64":
                      return h.encode(j);
                    default:
                      return s.transformTo(B, j);
                  }
                })(k, (function(B, j) {
                  var I, Y = 0, Q = null, S = 0;
                  for (I = 0; I < j.length; I++) S += j[I].length;
                  switch (B) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (Q = new Uint8Array(S), I = 0; I < j.length; I++) Q.set(j[I], Y), Y += j[I].length;
                      return Q;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + B + "'");
                  }
                })(M, w), R);
                _(O);
              } catch (B) {
                p(B);
              }
              w = [];
            }).resume();
          });
        }
        function d(y, o, _) {
          var p = o;
          switch (o) {
            case "blob":
            case "arraybuffer":
              p = "uint8array";
              break;
            case "base64":
              p = "string";
          }
          try {
            this._internalType = p, this._outputType = o, this._mimeType = _, s.checkSupport(p), this._worker = y.pipe(new i(p)), y.lock();
          } catch (w) {
            this._worker = new n("error"), this._worker.error(w);
          }
        }
        d.prototype = { accumulate: function(y) {
          return u(this, y);
        }, on: function(y, o) {
          var _ = this;
          return y === "data" ? this._worker.on(y, function(p) {
            o.call(_, p.data, p.meta);
          }) : this._worker.on(y, function() {
            s.delay(o, arguments, _);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(y) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, y);
        } }, a.exports = d;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, a, l) {
        if (l.base64 = !0, l.array = !0, l.string = !0, l.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", l.nodebuffer = typeof Buffer < "u", l.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") l.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            l.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              i.append(s), l.blob = i.getBlob("application/zip").size === 0;
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
        for (var s = e("./utils"), i = e("./support"), n = e("./nodejsUtils"), h = e("./stream/GenericWorker"), g = new Array(256), b = 0; b < 256; b++) g[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        g[254] = g[254] = 1;
        function m() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function u() {
          h.call(this, "utf-8 encode");
        }
        l.utf8encode = function(d) {
          return i.nodebuffer ? n.newBufferFrom(d, "utf-8") : (function(y) {
            var o, _, p, w, M, k = y.length, R = 0;
            for (w = 0; w < k; w++) (64512 & (_ = y.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (p = y.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (p - 56320), w++), R += _ < 128 ? 1 : _ < 2048 ? 2 : _ < 65536 ? 3 : 4;
            for (o = i.uint8array ? new Uint8Array(R) : new Array(R), w = M = 0; M < R; w++) (64512 & (_ = y.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (p = y.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (p - 56320), w++), _ < 128 ? o[M++] = _ : (_ < 2048 ? o[M++] = 192 | _ >>> 6 : (_ < 65536 ? o[M++] = 224 | _ >>> 12 : (o[M++] = 240 | _ >>> 18, o[M++] = 128 | _ >>> 12 & 63), o[M++] = 128 | _ >>> 6 & 63), o[M++] = 128 | 63 & _);
            return o;
          })(d);
        }, l.utf8decode = function(d) {
          return i.nodebuffer ? s.transformTo("nodebuffer", d).toString("utf-8") : (function(y) {
            var o, _, p, w, M = y.length, k = new Array(2 * M);
            for (o = _ = 0; o < M; ) if ((p = y[o++]) < 128) k[_++] = p;
            else if (4 < (w = g[p])) k[_++] = 65533, o += w - 1;
            else {
              for (p &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && o < M; ) p = p << 6 | 63 & y[o++], w--;
              1 < w ? k[_++] = 65533 : p < 65536 ? k[_++] = p : (p -= 65536, k[_++] = 55296 | p >> 10 & 1023, k[_++] = 56320 | 1023 & p);
            }
            return k.length !== _ && (k.subarray ? k = k.subarray(0, _) : k.length = _), s.applyFromCharCode(k);
          })(d = s.transformTo(i.uint8array ? "uint8array" : "array", d));
        }, s.inherits(m, h), m.prototype.processChunk = function(d) {
          var y = s.transformTo(i.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var o = y;
              (y = new Uint8Array(o.length + this.leftOver.length)).set(this.leftOver, 0), y.set(o, this.leftOver.length);
            } else y = this.leftOver.concat(y);
            this.leftOver = null;
          }
          var _ = (function(w, M) {
            var k;
            for ((M = M || w.length) > w.length && (M = w.length), k = M - 1; 0 <= k && (192 & w[k]) == 128; ) k--;
            return k < 0 || k === 0 ? M : k + g[w[k]] > M ? k : M;
          })(y), p = y;
          _ !== y.length && (i.uint8array ? (p = y.subarray(0, _), this.leftOver = y.subarray(_, y.length)) : (p = y.slice(0, _), this.leftOver = y.slice(_, y.length))), this.push({ data: l.utf8decode(p), meta: d.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = m, s.inherits(u, h), u.prototype.processChunk = function(d) {
          this.push({ data: l.utf8encode(d.data), meta: d.meta });
        }, l.Utf8EncodeWorker = u;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var s = e("./support"), i = e("./base64"), n = e("./nodejsUtils"), h = e("./external");
        function g(o) {
          return o;
        }
        function b(o, _) {
          for (var p = 0; p < o.length; ++p) _[p] = 255 & o.charCodeAt(p);
          return _;
        }
        e("setimmediate"), l.newBlob = function(o, _) {
          l.checkSupport("blob");
          try {
            return new Blob([o], { type: _ });
          } catch {
            try {
              var p = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return p.append(o), p.getBlob(_);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(o, _, p) {
          var w = [], M = 0, k = o.length;
          if (k <= p) return String.fromCharCode.apply(null, o);
          for (; M < k; ) _ === "array" || _ === "nodebuffer" ? w.push(String.fromCharCode.apply(null, o.slice(M, Math.min(M + p, k)))) : w.push(String.fromCharCode.apply(null, o.subarray(M, Math.min(M + p, k)))), M += p;
          return w.join("");
        }, stringifyByChar: function(o) {
          for (var _ = "", p = 0; p < o.length; p++) _ += String.fromCharCode(o[p]);
          return _;
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
        function u(o) {
          var _ = 65536, p = l.getTypeOf(o), w = !0;
          if (p === "uint8array" ? w = m.applyCanBeUsed.uint8array : p === "nodebuffer" && (w = m.applyCanBeUsed.nodebuffer), w) for (; 1 < _; ) try {
            return m.stringifyByChunk(o, p, _);
          } catch {
            _ = Math.floor(_ / 2);
          }
          return m.stringifyByChar(o);
        }
        function d(o, _) {
          for (var p = 0; p < o.length; p++) _[p] = o[p];
          return _;
        }
        l.applyFromCharCode = u;
        var y = {};
        y.string = { string: g, array: function(o) {
          return b(o, new Array(o.length));
        }, arraybuffer: function(o) {
          return y.string.uint8array(o).buffer;
        }, uint8array: function(o) {
          return b(o, new Uint8Array(o.length));
        }, nodebuffer: function(o) {
          return b(o, n.allocBuffer(o.length));
        } }, y.array = { string: u, array: g, arraybuffer: function(o) {
          return new Uint8Array(o).buffer;
        }, uint8array: function(o) {
          return new Uint8Array(o);
        }, nodebuffer: function(o) {
          return n.newBufferFrom(o);
        } }, y.arraybuffer = { string: function(o) {
          return u(new Uint8Array(o));
        }, array: function(o) {
          return d(new Uint8Array(o), new Array(o.byteLength));
        }, arraybuffer: g, uint8array: function(o) {
          return new Uint8Array(o);
        }, nodebuffer: function(o) {
          return n.newBufferFrom(new Uint8Array(o));
        } }, y.uint8array = { string: u, array: function(o) {
          return d(o, new Array(o.length));
        }, arraybuffer: function(o) {
          return o.buffer;
        }, uint8array: g, nodebuffer: function(o) {
          return n.newBufferFrom(o);
        } }, y.nodebuffer = { string: u, array: function(o) {
          return d(o, new Array(o.length));
        }, arraybuffer: function(o) {
          return y.nodebuffer.uint8array(o).buffer;
        }, uint8array: function(o) {
          return d(o, new Uint8Array(o.length));
        }, nodebuffer: g }, l.transformTo = function(o, _) {
          if (_ = _ || "", !o) return _;
          l.checkSupport(o);
          var p = l.getTypeOf(_);
          return y[p][o](_);
        }, l.resolve = function(o) {
          for (var _ = o.split("/"), p = [], w = 0; w < _.length; w++) {
            var M = _[w];
            M === "." || M === "" && w !== 0 && w !== _.length - 1 || (M === ".." ? p.pop() : p.push(M));
          }
          return p.join("/");
        }, l.getTypeOf = function(o) {
          return typeof o == "string" ? "string" : Object.prototype.toString.call(o) === "[object Array]" ? "array" : s.nodebuffer && n.isBuffer(o) ? "nodebuffer" : s.uint8array && o instanceof Uint8Array ? "uint8array" : s.arraybuffer && o instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(o) {
          if (!s[o.toLowerCase()]) throw new Error(o + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(o) {
          var _, p, w = "";
          for (p = 0; p < (o || "").length; p++) w += "\\x" + ((_ = o.charCodeAt(p)) < 16 ? "0" : "") + _.toString(16).toUpperCase();
          return w;
        }, l.delay = function(o, _, p) {
          setImmediate(function() {
            o.apply(p || null, _ || []);
          });
        }, l.inherits = function(o, _) {
          function p() {
          }
          p.prototype = _.prototype, o.prototype = new p();
        }, l.extend = function() {
          var o, _, p = {};
          for (o = 0; o < arguments.length; o++) for (_ in arguments[o]) Object.prototype.hasOwnProperty.call(arguments[o], _) && p[_] === void 0 && (p[_] = arguments[o][_]);
          return p;
        }, l.prepareContent = function(o, _, p, w, M) {
          return h.Promise.resolve(_).then(function(k) {
            return s.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(R, O) {
              var B = new FileReader();
              B.onload = function(j) {
                R(j.target.result);
              }, B.onerror = function(j) {
                O(j.target.error);
              }, B.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var R = l.getTypeOf(k);
            return R ? (R === "arraybuffer" ? k = l.transformTo("uint8array", k) : R === "string" && (M ? k = i.decode(k) : p && w !== !0 && (k = (function(O) {
              return b(O, s.uint8array ? new Uint8Array(O.length) : new Array(O.length));
            })(k))), k) : h.Promise.reject(new Error("Can't read the data of '" + o + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), h = e("./zipEntry"), g = e("./support");
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
          var y = this.reader.readString(4) === u;
          return this.reader.setIndex(d), y;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), u = g.uint8array ? "uint8array" : "array", d = i.transformTo(u, m);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, u, d, y = this.zip64EndOfCentralSize - 44; 0 < y; ) m = this.reader.readInt(2), u = this.reader.readInt(4), d = this.reader.readData(u), this.zip64ExtensibleData[m] = { id: m, length: u, value: d };
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
          var y = u - d;
          if (0 < y) this.isSignature(u, n.CENTRAL_FILE_HEADER) || (this.reader.zero = y);
          else if (y < 0) throw new Error("Corrupted zip: missing " + Math.abs(y) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), h = e("./crc32"), g = e("./utf8"), b = e("./compressions"), m = e("./support");
        function u(d, y) {
          this.options = d, this.loadOptions = y;
        }
        u.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var y, o;
          if (d.skip(22), this.fileNameLength = d.readInt(2), o = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(o), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((y = (function(_) {
            for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p) && b[p].magic === _) return b[p];
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
            var d = s(this.extraFields[1].value);
            this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var y, o, _, p = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < p; ) y = d.readInt(2), o = d.readInt(2), _ = d.readData(o), this.extraFields[y] = { id: y, length: o, value: _ };
          d.setIndex(p);
        }, handleUTF8: function() {
          var d = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
          else {
            var y = this.findExtraFieldUnicodePath();
            if (y !== null) this.fileNameStr = y;
            else {
              var o = i.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(o);
            }
            var _ = this.findExtraFieldUnicodeComment();
            if (_ !== null) this.fileCommentStr = _;
            else {
              var p = i.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(p);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var y = s(d.value);
            return y.readInt(1) !== 1 || h(this.fileName) !== y.readInt(4) ? null : g.utf8decode(y.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var y = s(d.value);
            return y.readInt(1) !== 1 || h(this.fileComment) !== y.readInt(4) ? null : g.utf8decode(y.readData(d.length - 5));
          }
          return null;
        } }, a.exports = u;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function s(y, o, _) {
          this.name = y, this.dir = _.dir, this.date = _.date, this.comment = _.comment, this.unixPermissions = _.unixPermissions, this.dosPermissions = _.dosPermissions, this._data = o, this._dataBinary = _.binary, this.options = { compression: _.compression, compressionOptions: _.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), h = e("./utf8"), g = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(y) {
          var o = null, _ = "string";
          try {
            if (!y) throw new Error("No output type specified.");
            var p = (_ = y.toLowerCase()) === "string" || _ === "text";
            _ !== "binarystring" && _ !== "text" || (_ = "string"), o = this._decompressWorker();
            var w = !this._dataBinary;
            w && !p && (o = o.pipe(new h.Utf8EncodeWorker())), !w && p && (o = o.pipe(new h.Utf8DecodeWorker()));
          } catch (M) {
            (o = new b("error")).error(M);
          }
          return new i(o, _, "");
        }, async: function(y, o) {
          return this.internalStream(y).accumulate(o);
        }, nodeStream: function(y, o) {
          return this.internalStream(y || "nodebuffer").toNodejsStream(o);
        }, _compressWorker: function(y, o) {
          if (this._data instanceof g && this._data.compression.magic === y.magic) return this._data.getCompressedWorker();
          var _ = this._decompressWorker();
          return this._dataBinary || (_ = _.pipe(new h.Utf8EncodeWorker())), g.createWorkerFrom(_, y, o);
        }, _decompressWorker: function() {
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof b ? this._data : new n(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], u = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < m.length; d++) s.prototype[m[d]] = u;
        a.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(s) {
          var i, n, h = s.MutationObserver || s.WebKitMutationObserver;
          if (h) {
            var g = 0, b = new h(y), m = s.document.createTextNode("");
            b.observe(m, { characterData: !0 }), i = function() {
              m.data = g = ++g % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) i = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var o = s.document.createElement("script");
            o.onreadystatechange = function() {
              y(), o.onreadystatechange = null, o.parentNode.removeChild(o), o = null;
            }, s.document.documentElement.appendChild(o);
          } : function() {
            setTimeout(y, 0);
          };
          else {
            var u = new s.MessageChannel();
            u.port1.onmessage = y, i = function() {
              u.port2.postMessage(0);
            };
          }
          var d = [];
          function y() {
            var o, _;
            n = !0;
            for (var p = d.length; p; ) {
              for (_ = d, d = [], o = -1; ++o < p; ) _[o]();
              p = d.length;
            }
            n = !1;
          }
          a.exports = function(o) {
            d.push(o) !== 1 || n || i();
          };
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var s = e("immediate");
        function i() {
        }
        var n = {}, h = ["REJECTED"], g = ["FULFILLED"], b = ["PENDING"];
        function m(p) {
          if (typeof p != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, p !== i && o(this, p);
        }
        function u(p, w, M) {
          this.promise = p, typeof w == "function" && (this.onFulfilled = w, this.callFulfilled = this.otherCallFulfilled), typeof M == "function" && (this.onRejected = M, this.callRejected = this.otherCallRejected);
        }
        function d(p, w, M) {
          s(function() {
            var k;
            try {
              k = w(M);
            } catch (R) {
              return n.reject(p, R);
            }
            k === p ? n.reject(p, new TypeError("Cannot resolve promise with itself")) : n.resolve(p, k);
          });
        }
        function y(p) {
          var w = p && p.then;
          if (p && (typeof p == "object" || typeof p == "function") && typeof w == "function") return function() {
            w.apply(p, arguments);
          };
        }
        function o(p, w) {
          var M = !1;
          function k(B) {
            M || (M = !0, n.reject(p, B));
          }
          function R(B) {
            M || (M = !0, n.resolve(p, B));
          }
          var O = _(function() {
            w(R, k);
          });
          O.status === "error" && k(O.value);
        }
        function _(p, w) {
          var M = {};
          try {
            M.value = p(w), M.status = "success";
          } catch (k) {
            M.status = "error", M.value = k;
          }
          return M;
        }
        (a.exports = m).prototype.finally = function(p) {
          if (typeof p != "function") return this;
          var w = this.constructor;
          return this.then(function(M) {
            return w.resolve(p()).then(function() {
              return M;
            });
          }, function(M) {
            return w.resolve(p()).then(function() {
              throw M;
            });
          });
        }, m.prototype.catch = function(p) {
          return this.then(null, p);
        }, m.prototype.then = function(p, w) {
          if (typeof p != "function" && this.state === g || typeof w != "function" && this.state === h) return this;
          var M = new this.constructor(i);
          return this.state !== b ? d(M, this.state === g ? p : w, this.outcome) : this.queue.push(new u(M, p, w)), M;
        }, u.prototype.callFulfilled = function(p) {
          n.resolve(this.promise, p);
        }, u.prototype.otherCallFulfilled = function(p) {
          d(this.promise, this.onFulfilled, p);
        }, u.prototype.callRejected = function(p) {
          n.reject(this.promise, p);
        }, u.prototype.otherCallRejected = function(p) {
          d(this.promise, this.onRejected, p);
        }, n.resolve = function(p, w) {
          var M = _(y, w);
          if (M.status === "error") return n.reject(p, M.value);
          var k = M.value;
          if (k) o(p, k);
          else {
            p.state = g, p.outcome = w;
            for (var R = -1, O = p.queue.length; ++R < O; ) p.queue[R].callFulfilled(w);
          }
          return p;
        }, n.reject = function(p, w) {
          p.state = h, p.outcome = w;
          for (var M = -1, k = p.queue.length; ++M < k; ) p.queue[M].callRejected(w);
          return p;
        }, m.resolve = function(p) {
          return p instanceof this ? p : n.resolve(new this(i), p);
        }, m.reject = function(p) {
          var w = new this(i);
          return n.reject(w, p);
        }, m.all = function(p) {
          var w = this;
          if (Object.prototype.toString.call(p) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = p.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = new Array(M), O = 0, B = -1, j = new this(i); ++B < M; ) I(p[B], B);
          return j;
          function I(Y, Q) {
            w.resolve(Y).then(function(S) {
              R[Q] = S, ++O !== M || k || (k = !0, n.resolve(j, R));
            }, function(S) {
              k || (k = !0, n.reject(j, S));
            });
          }
        }, m.race = function(p) {
          var w = this;
          if (Object.prototype.toString.call(p) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = p.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = -1, O = new this(i); ++R < M; ) B = p[R], w.resolve(B).then(function(j) {
            k || (k = !0, n.resolve(O, j));
          }, function(j) {
            k || (k = !0, n.reject(O, j));
          });
          var B;
          return O;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/messages"), g = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, u = -1, d = 0, y = 8;
        function o(p) {
          if (!(this instanceof o)) return new o(p);
          this.options = i.assign({ level: u, method: y, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, p || {});
          var w = this.options;
          w.raw && 0 < w.windowBits ? w.windowBits = -w.windowBits : w.gzip && 0 < w.windowBits && w.windowBits < 16 && (w.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var M = s.deflateInit2(this.strm, w.level, w.method, w.windowBits, w.memLevel, w.strategy);
          if (M !== m) throw new Error(h[M]);
          if (w.header && s.deflateSetHeader(this.strm, w.header), w.dictionary) {
            var k;
            if (k = typeof w.dictionary == "string" ? n.string2buf(w.dictionary) : b.call(w.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(w.dictionary) : w.dictionary, (M = s.deflateSetDictionary(this.strm, k)) !== m) throw new Error(h[M]);
            this._dict_set = !0;
          }
        }
        function _(p, w) {
          var M = new o(w);
          if (M.push(p, !0), M.err) throw M.msg || h[M.err];
          return M.result;
        }
        o.prototype.push = function(p, w) {
          var M, k, R = this.strm, O = this.options.chunkSize;
          if (this.ended) return !1;
          k = w === ~~w ? w : w === !0 ? 4 : 0, typeof p == "string" ? R.input = n.string2buf(p) : b.call(p) === "[object ArrayBuffer]" ? R.input = new Uint8Array(p) : R.input = p, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new i.Buf8(O), R.next_out = 0, R.avail_out = O), (M = s.deflate(R, k)) !== 1 && M !== m) return this.onEnd(M), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(i.shrinkBuf(R.output, R.next_out))) : this.onData(i.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && M !== 1);
          return k === 4 ? (M = s.deflateEnd(this.strm), this.onEnd(M), this.ended = !0, M === m) : k !== 2 || (this.onEnd(m), !(R.avail_out = 0));
        }, o.prototype.onData = function(p) {
          this.chunks.push(p);
        }, o.prototype.onEnd = function(p) {
          p === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = p, this.msg = this.strm.msg;
        }, l.Deflate = o, l.deflate = _, l.deflateRaw = function(p, w) {
          return (w = w || {}).raw = !0, _(p, w);
        }, l.gzip = function(p, w) {
          return (w = w || {}).gzip = !0, _(p, w);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), n = e("./utils/strings"), h = e("./zlib/constants"), g = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), u = Object.prototype.toString;
        function d(o) {
          if (!(this instanceof d)) return new d(o);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, o || {});
          var _ = this.options;
          _.raw && 0 <= _.windowBits && _.windowBits < 16 && (_.windowBits = -_.windowBits, _.windowBits === 0 && (_.windowBits = -15)), !(0 <= _.windowBits && _.windowBits < 16) || o && o.windowBits || (_.windowBits += 32), 15 < _.windowBits && _.windowBits < 48 && (15 & _.windowBits) == 0 && (_.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var p = s.inflateInit2(this.strm, _.windowBits);
          if (p !== h.Z_OK) throw new Error(g[p]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function y(o, _) {
          var p = new d(_);
          if (p.push(o, !0), p.err) throw p.msg || g[p.err];
          return p.result;
        }
        d.prototype.push = function(o, _) {
          var p, w, M, k, R, O, B = this.strm, j = this.options.chunkSize, I = this.options.dictionary, Y = !1;
          if (this.ended) return !1;
          w = _ === ~~_ ? _ : _ === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof o == "string" ? B.input = n.binstring2buf(o) : u.call(o) === "[object ArrayBuffer]" ? B.input = new Uint8Array(o) : B.input = o, B.next_in = 0, B.avail_in = B.input.length;
          do {
            if (B.avail_out === 0 && (B.output = new i.Buf8(j), B.next_out = 0, B.avail_out = j), (p = s.inflate(B, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && I && (O = typeof I == "string" ? n.string2buf(I) : u.call(I) === "[object ArrayBuffer]" ? new Uint8Array(I) : I, p = s.inflateSetDictionary(this.strm, O)), p === h.Z_BUF_ERROR && Y === !0 && (p = h.Z_OK, Y = !1), p !== h.Z_STREAM_END && p !== h.Z_OK) return this.onEnd(p), !(this.ended = !0);
            B.next_out && (B.avail_out !== 0 && p !== h.Z_STREAM_END && (B.avail_in !== 0 || w !== h.Z_FINISH && w !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (M = n.utf8border(B.output, B.next_out), k = B.next_out - M, R = n.buf2string(B.output, M), B.next_out = k, B.avail_out = j - k, k && i.arraySet(B.output, B.output, M, k, 0), this.onData(R)) : this.onData(i.shrinkBuf(B.output, B.next_out)))), B.avail_in === 0 && B.avail_out === 0 && (Y = !0);
          } while ((0 < B.avail_in || B.avail_out === 0) && p !== h.Z_STREAM_END);
          return p === h.Z_STREAM_END && (w = h.Z_FINISH), w === h.Z_FINISH ? (p = s.inflateEnd(this.strm), this.onEnd(p), this.ended = !0, p === h.Z_OK) : w !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(B.avail_out = 0));
        }, d.prototype.onData = function(o) {
          this.chunks.push(o);
        }, d.prototype.onEnd = function(o) {
          o === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = o, this.msg = this.strm.msg;
        }, l.Inflate = d, l.inflate = y, l.inflateRaw = function(o, _) {
          return (_ = _ || {}).raw = !0, y(o, _);
        }, l.ungzip = y;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(h) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var b = g.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (h[m] = b[m]);
            }
          }
          return h;
        }, l.shrinkBuf = function(h, g) {
          return h.length === g ? h : h.subarray ? h.subarray(0, g) : (h.length = g, h);
        };
        var i = { arraySet: function(h, g, b, m, u) {
          if (g.subarray && h.subarray) h.set(g.subarray(b, b + m), u);
          else for (var d = 0; d < m; d++) h[u + d] = g[b + d];
        }, flattenChunks: function(h) {
          var g, b, m, u, d, y;
          for (g = m = 0, b = h.length; g < b; g++) m += h[g].length;
          for (y = new Uint8Array(m), g = u = 0, b = h.length; g < b; g++) d = h[g], y.set(d, u), u += d.length;
          return y;
        } }, n = { arraySet: function(h, g, b, m, u) {
          for (var d = 0; d < m; d++) h[u + d] = g[b + d];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        l.setTyped = function(h) {
          h ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, i)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, n));
        }, l.setTyped(s);
      }, {}], 42: [function(e, a, l) {
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
        for (var h = new s.Buf8(256), g = 0; g < 256; g++) h[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function b(m, u) {
          if (u < 65537 && (m.subarray && n || !m.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(m, u));
          for (var d = "", y = 0; y < u; y++) d += String.fromCharCode(m[y]);
          return d;
        }
        h[254] = h[254] = 1, l.string2buf = function(m) {
          var u, d, y, o, _, p = m.length, w = 0;
          for (o = 0; o < p; o++) (64512 & (d = m.charCodeAt(o))) == 55296 && o + 1 < p && (64512 & (y = m.charCodeAt(o + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (y - 56320), o++), w += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (u = new s.Buf8(w), o = _ = 0; _ < w; o++) (64512 & (d = m.charCodeAt(o))) == 55296 && o + 1 < p && (64512 & (y = m.charCodeAt(o + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (y - 56320), o++), d < 128 ? u[_++] = d : (d < 2048 ? u[_++] = 192 | d >>> 6 : (d < 65536 ? u[_++] = 224 | d >>> 12 : (u[_++] = 240 | d >>> 18, u[_++] = 128 | d >>> 12 & 63), u[_++] = 128 | d >>> 6 & 63), u[_++] = 128 | 63 & d);
          return u;
        }, l.buf2binstring = function(m) {
          return b(m, m.length);
        }, l.binstring2buf = function(m) {
          for (var u = new s.Buf8(m.length), d = 0, y = u.length; d < y; d++) u[d] = m.charCodeAt(d);
          return u;
        }, l.buf2string = function(m, u) {
          var d, y, o, _, p = u || m.length, w = new Array(2 * p);
          for (d = y = 0; d < p; ) if ((o = m[d++]) < 128) w[y++] = o;
          else if (4 < (_ = h[o])) w[y++] = 65533, d += _ - 1;
          else {
            for (o &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && d < p; ) o = o << 6 | 63 & m[d++], _--;
            1 < _ ? w[y++] = 65533 : o < 65536 ? w[y++] = o : (o -= 65536, w[y++] = 55296 | o >> 10 & 1023, w[y++] = 56320 | 1023 & o);
          }
          return b(w, y);
        }, l.utf8border = function(m, u) {
          var d;
          for ((u = u || m.length) > m.length && (u = m.length), d = u - 1; 0 <= d && (192 & m[d]) == 128; ) d--;
          return d < 0 || d === 0 ? u : d + h[m[d]] > u ? d : u;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(s, i, n, h) {
          for (var g = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; n !== 0; ) {
            for (n -= m = 2e3 < n ? 2e3 : n; b = b + (g = g + i[h++] | 0) | 0, --m; ) ;
            g %= 65521, b %= 65521;
          }
          return g | b << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var s = (function() {
          for (var i, n = [], h = 0; h < 256; h++) {
            i = h;
            for (var g = 0; g < 8; g++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            n[h] = i;
          }
          return n;
        })();
        a.exports = function(i, n, h, g) {
          var b = s, m = g + h;
          i ^= -1;
          for (var u = g; u < m; u++) i = i >>> 8 ^ b[255 & (i ^ n[u])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, a, l) {
        var s, i = e("../utils/common"), n = e("./trees"), h = e("./adler32"), g = e("./crc32"), b = e("./messages"), m = 0, u = 4, d = 0, y = -2, o = -1, _ = 4, p = 2, w = 8, M = 9, k = 286, R = 30, O = 19, B = 2 * k + 1, j = 15, I = 3, Y = 258, Q = Y + I + 1, S = 42, L = 113, c = 1, $ = 2, tt = 3, X = 4;
        function it(r, D) {
          return r.msg = b[D], D;
        }
        function Z(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function rt(r) {
          for (var D = r.length; 0 <= --D; ) r[D] = 0;
        }
        function P(r) {
          var D = r.state, F = D.pending;
          F > r.avail_out && (F = r.avail_out), F !== 0 && (i.arraySet(r.output, D.pending_buf, D.pending_out, F, r.next_out), r.next_out += F, D.pending_out += F, r.total_out += F, r.avail_out -= F, D.pending -= F, D.pending === 0 && (D.pending_out = 0));
        }
        function C(r, D) {
          n._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, D), r.block_start = r.strstart, P(r.strm);
        }
        function z(r, D) {
          r.pending_buf[r.pending++] = D;
        }
        function T(r, D) {
          r.pending_buf[r.pending++] = D >>> 8 & 255, r.pending_buf[r.pending++] = 255 & D;
        }
        function N(r, D) {
          var F, x, v = r.max_chain_length, A = r.strstart, U = r.prev_length, W = r.nice_match, E = r.strstart > r.w_size - Q ? r.strstart - (r.w_size - Q) : 0, G = r.window, J = r.w_mask, q = r.prev, et = r.strstart + Y, ct = G[A + U - 1], ot = G[A + U];
          r.prev_length >= r.good_match && (v >>= 2), W > r.lookahead && (W = r.lookahead);
          do
            if (G[(F = D) + U] === ot && G[F + U - 1] === ct && G[F] === G[A] && G[++F] === G[A + 1]) {
              A += 2, F++;
              do
                ;
              while (G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && A < et);
              if (x = Y - (et - A), A = et - Y, U < x) {
                if (r.match_start = D, W <= (U = x)) break;
                ct = G[A + U - 1], ot = G[A + U];
              }
            }
          while ((D = q[D & J]) > E && --v != 0);
          return U <= r.lookahead ? U : r.lookahead;
        }
        function K(r) {
          var D, F, x, v, A, U, W, E, G, J, q = r.w_size;
          do {
            if (v = r.window_size - r.lookahead - r.strstart, r.strstart >= q + (q - Q)) {
              for (i.arraySet(r.window, r.window, q, q, 0), r.match_start -= q, r.strstart -= q, r.block_start -= q, D = F = r.hash_size; x = r.head[--D], r.head[D] = q <= x ? x - q : 0, --F; ) ;
              for (D = F = q; x = r.prev[--D], r.prev[D] = q <= x ? x - q : 0, --F; ) ;
              v += q;
            }
            if (r.strm.avail_in === 0) break;
            if (U = r.strm, W = r.window, E = r.strstart + r.lookahead, G = v, J = void 0, J = U.avail_in, G < J && (J = G), F = J === 0 ? 0 : (U.avail_in -= J, i.arraySet(W, U.input, U.next_in, J, E), U.state.wrap === 1 ? U.adler = h(U.adler, W, J, E) : U.state.wrap === 2 && (U.adler = g(U.adler, W, J, E)), U.next_in += J, U.total_in += J, J), r.lookahead += F, r.lookahead + r.insert >= I) for (A = r.strstart - r.insert, r.ins_h = r.window[A], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + I - 1]) & r.hash_mask, r.prev[A & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = A, A++, r.insert--, !(r.lookahead + r.insert < I)); ) ;
          } while (r.lookahead < Q && r.strm.avail_in !== 0);
        }
        function nt(r, D) {
          for (var F, x; ; ) {
            if (r.lookahead < Q) {
              if (K(r), r.lookahead < Q && D === m) return c;
              if (r.lookahead === 0) break;
            }
            if (F = 0, r.lookahead >= I && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + I - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), F !== 0 && r.strstart - F <= r.w_size - Q && (r.match_length = N(r, F)), r.match_length >= I) if (x = n._tr_tally(r, r.strstart - r.match_start, r.match_length - I), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= I) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + I - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else x = n._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (x && (C(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < I - 1 ? r.strstart : I - 1, D === u ? (C(r, !0), r.strm.avail_out === 0 ? tt : X) : r.last_lit && (C(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function V(r, D) {
          for (var F, x, v; ; ) {
            if (r.lookahead < Q) {
              if (K(r), r.lookahead < Q && D === m) return c;
              if (r.lookahead === 0) break;
            }
            if (F = 0, r.lookahead >= I && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + I - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = I - 1, F !== 0 && r.prev_length < r.max_lazy_match && r.strstart - F <= r.w_size - Q && (r.match_length = N(r, F), r.match_length <= 5 && (r.strategy === 1 || r.match_length === I && 4096 < r.strstart - r.match_start) && (r.match_length = I - 1)), r.prev_length >= I && r.match_length <= r.prev_length) {
              for (v = r.strstart + r.lookahead - I, x = n._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - I), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= v && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + I - 1]) & r.hash_mask, F = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = I - 1, r.strstart++, x && (C(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((x = n._tr_tally(r, 0, r.window[r.strstart - 1])) && C(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (x = n._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < I - 1 ? r.strstart : I - 1, D === u ? (C(r, !0), r.strm.avail_out === 0 ? tt : X) : r.last_lit && (C(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function H(r, D, F, x, v) {
          this.good_length = r, this.max_lazy = D, this.nice_length = F, this.max_chain = x, this.func = v;
        }
        function st() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = w, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * B), this.dyn_dtree = new i.Buf16(2 * (2 * R + 1)), this.bl_tree = new i.Buf16(2 * (2 * O + 1)), rt(this.dyn_ltree), rt(this.dyn_dtree), rt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(j + 1), this.heap = new i.Buf16(2 * k + 1), rt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * k + 1), rt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function at(r) {
          var D;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = p, (D = r.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? S : L, r.adler = D.wrap === 2 ? 0 : 1, D.last_flush = m, n._tr_init(D), d) : it(r, y);
        }
        function ut(r) {
          var D = at(r);
          return D === d && (function(F) {
            F.window_size = 2 * F.w_size, rt(F.head), F.max_lazy_match = s[F.level].max_lazy, F.good_match = s[F.level].good_length, F.nice_match = s[F.level].nice_length, F.max_chain_length = s[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = I - 1, F.match_available = 0, F.ins_h = 0;
          })(r.state), D;
        }
        function lt(r, D, F, x, v, A) {
          if (!r) return y;
          var U = 1;
          if (D === o && (D = 6), x < 0 ? (U = 0, x = -x) : 15 < x && (U = 2, x -= 16), v < 1 || M < v || F !== w || x < 8 || 15 < x || D < 0 || 9 < D || A < 0 || _ < A) return it(r, y);
          x === 8 && (x = 9);
          var W = new st();
          return (r.state = W).strm = r, W.wrap = U, W.gzhead = null, W.w_bits = x, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = v + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + I - 1) / I), W.window = new i.Buf8(2 * W.w_size), W.head = new i.Buf16(W.hash_size), W.prev = new i.Buf16(W.w_size), W.lit_bufsize = 1 << v + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new i.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = D, W.strategy = A, W.method = F, ut(r);
        }
        s = [new H(0, 0, 0, 0, function(r, D) {
          var F = 65535;
          for (F > r.pending_buf_size - 5 && (F = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (K(r), r.lookahead === 0 && D === m) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var x = r.block_start + F;
            if ((r.strstart === 0 || r.strstart >= x) && (r.lookahead = r.strstart - x, r.strstart = x, C(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - Q && (C(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, D === u ? (C(r, !0), r.strm.avail_out === 0 ? tt : X) : (r.strstart > r.block_start && (C(r, !1), r.strm.avail_out), c);
        }), new H(4, 4, 8, 4, nt), new H(4, 5, 16, 8, nt), new H(4, 6, 32, 32, nt), new H(4, 4, 16, 16, V), new H(8, 16, 32, 32, V), new H(8, 16, 128, 128, V), new H(8, 32, 128, 256, V), new H(32, 128, 258, 1024, V), new H(32, 258, 258, 4096, V)], l.deflateInit = function(r, D) {
          return lt(r, D, w, 15, 8, 0);
        }, l.deflateInit2 = lt, l.deflateReset = ut, l.deflateResetKeep = at, l.deflateSetHeader = function(r, D) {
          return r && r.state ? r.state.wrap !== 2 ? y : (r.state.gzhead = D, d) : y;
        }, l.deflate = function(r, D) {
          var F, x, v, A;
          if (!r || !r.state || 5 < D || D < 0) return r ? it(r, y) : y;
          if (x = r.state, !r.output || !r.input && r.avail_in !== 0 || x.status === 666 && D !== u) return it(r, r.avail_out === 0 ? -5 : y);
          if (x.strm = r, F = x.last_flush, x.last_flush = D, x.status === S) if (x.wrap === 2) r.adler = 0, z(x, 31), z(x, 139), z(x, 8), x.gzhead ? (z(x, (x.gzhead.text ? 1 : 0) + (x.gzhead.hcrc ? 2 : 0) + (x.gzhead.extra ? 4 : 0) + (x.gzhead.name ? 8 : 0) + (x.gzhead.comment ? 16 : 0)), z(x, 255 & x.gzhead.time), z(x, x.gzhead.time >> 8 & 255), z(x, x.gzhead.time >> 16 & 255), z(x, x.gzhead.time >> 24 & 255), z(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), z(x, 255 & x.gzhead.os), x.gzhead.extra && x.gzhead.extra.length && (z(x, 255 & x.gzhead.extra.length), z(x, x.gzhead.extra.length >> 8 & 255)), x.gzhead.hcrc && (r.adler = g(r.adler, x.pending_buf, x.pending, 0)), x.gzindex = 0, x.status = 69) : (z(x, 0), z(x, 0), z(x, 0), z(x, 0), z(x, 0), z(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), z(x, 3), x.status = L);
          else {
            var U = w + (x.w_bits - 8 << 4) << 8;
            U |= (2 <= x.strategy || x.level < 2 ? 0 : x.level < 6 ? 1 : x.level === 6 ? 2 : 3) << 6, x.strstart !== 0 && (U |= 32), U += 31 - U % 31, x.status = L, T(x, U), x.strstart !== 0 && (T(x, r.adler >>> 16), T(x, 65535 & r.adler)), r.adler = 1;
          }
          if (x.status === 69) if (x.gzhead.extra) {
            for (v = x.pending; x.gzindex < (65535 & x.gzhead.extra.length) && (x.pending !== x.pending_buf_size || (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending !== x.pending_buf_size)); ) z(x, 255 & x.gzhead.extra[x.gzindex]), x.gzindex++;
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), x.gzindex === x.gzhead.extra.length && (x.gzindex = 0, x.status = 73);
          } else x.status = 73;
          if (x.status === 73) if (x.gzhead.name) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.name.length ? 255 & x.gzhead.name.charCodeAt(x.gzindex++) : 0, z(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.gzindex = 0, x.status = 91);
          } else x.status = 91;
          if (x.status === 91) if (x.gzhead.comment) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), P(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.comment.length ? 255 & x.gzhead.comment.charCodeAt(x.gzindex++) : 0, z(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.status = 103);
          } else x.status = 103;
          if (x.status === 103 && (x.gzhead.hcrc ? (x.pending + 2 > x.pending_buf_size && P(r), x.pending + 2 <= x.pending_buf_size && (z(x, 255 & r.adler), z(x, r.adler >> 8 & 255), r.adler = 0, x.status = L)) : x.status = L), x.pending !== 0) {
            if (P(r), r.avail_out === 0) return x.last_flush = -1, d;
          } else if (r.avail_in === 0 && Z(D) <= Z(F) && D !== u) return it(r, -5);
          if (x.status === 666 && r.avail_in !== 0) return it(r, -5);
          if (r.avail_in !== 0 || x.lookahead !== 0 || D !== m && x.status !== 666) {
            var W = x.strategy === 2 ? (function(E, G) {
              for (var J; ; ) {
                if (E.lookahead === 0 && (K(E), E.lookahead === 0)) {
                  if (G === m) return c;
                  break;
                }
                if (E.match_length = 0, J = n._tr_tally(E, 0, E.window[E.strstart]), E.lookahead--, E.strstart++, J && (C(E, !1), E.strm.avail_out === 0)) return c;
              }
              return E.insert = 0, G === u ? (C(E, !0), E.strm.avail_out === 0 ? tt : X) : E.last_lit && (C(E, !1), E.strm.avail_out === 0) ? c : $;
            })(x, D) : x.strategy === 3 ? (function(E, G) {
              for (var J, q, et, ct, ot = E.window; ; ) {
                if (E.lookahead <= Y) {
                  if (K(E), E.lookahead <= Y && G === m) return c;
                  if (E.lookahead === 0) break;
                }
                if (E.match_length = 0, E.lookahead >= I && 0 < E.strstart && (q = ot[et = E.strstart - 1]) === ot[++et] && q === ot[++et] && q === ot[++et]) {
                  ct = E.strstart + Y;
                  do
                    ;
                  while (q === ot[++et] && q === ot[++et] && q === ot[++et] && q === ot[++et] && q === ot[++et] && q === ot[++et] && q === ot[++et] && q === ot[++et] && et < ct);
                  E.match_length = Y - (ct - et), E.match_length > E.lookahead && (E.match_length = E.lookahead);
                }
                if (E.match_length >= I ? (J = n._tr_tally(E, 1, E.match_length - I), E.lookahead -= E.match_length, E.strstart += E.match_length, E.match_length = 0) : (J = n._tr_tally(E, 0, E.window[E.strstart]), E.lookahead--, E.strstart++), J && (C(E, !1), E.strm.avail_out === 0)) return c;
              }
              return E.insert = 0, G === u ? (C(E, !0), E.strm.avail_out === 0 ? tt : X) : E.last_lit && (C(E, !1), E.strm.avail_out === 0) ? c : $;
            })(x, D) : s[x.level].func(x, D);
            if (W !== tt && W !== X || (x.status = 666), W === c || W === tt) return r.avail_out === 0 && (x.last_flush = -1), d;
            if (W === $ && (D === 1 ? n._tr_align(x) : D !== 5 && (n._tr_stored_block(x, 0, 0, !1), D === 3 && (rt(x.head), x.lookahead === 0 && (x.strstart = 0, x.block_start = 0, x.insert = 0))), P(r), r.avail_out === 0)) return x.last_flush = -1, d;
          }
          return D !== u ? d : x.wrap <= 0 ? 1 : (x.wrap === 2 ? (z(x, 255 & r.adler), z(x, r.adler >> 8 & 255), z(x, r.adler >> 16 & 255), z(x, r.adler >> 24 & 255), z(x, 255 & r.total_in), z(x, r.total_in >> 8 & 255), z(x, r.total_in >> 16 & 255), z(x, r.total_in >> 24 & 255)) : (T(x, r.adler >>> 16), T(x, 65535 & r.adler)), P(r), 0 < x.wrap && (x.wrap = -x.wrap), x.pending !== 0 ? d : 1);
        }, l.deflateEnd = function(r) {
          var D;
          return r && r.state ? (D = r.state.status) !== S && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== L && D !== 666 ? it(r, y) : (r.state = null, D === L ? it(r, -3) : d) : y;
        }, l.deflateSetDictionary = function(r, D) {
          var F, x, v, A, U, W, E, G, J = D.length;
          if (!r || !r.state || (A = (F = r.state).wrap) === 2 || A === 1 && F.status !== S || F.lookahead) return y;
          for (A === 1 && (r.adler = h(r.adler, D, J, 0)), F.wrap = 0, J >= F.w_size && (A === 0 && (rt(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), G = new i.Buf8(F.w_size), i.arraySet(G, D, J - F.w_size, F.w_size, 0), D = G, J = F.w_size), U = r.avail_in, W = r.next_in, E = r.input, r.avail_in = J, r.next_in = 0, r.input = D, K(F); F.lookahead >= I; ) {
            for (x = F.strstart, v = F.lookahead - (I - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[x + I - 1]) & F.hash_mask, F.prev[x & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = x, x++, --v; ) ;
            F.strstart = x, F.lookahead = I - 1, K(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = I - 1, F.match_available = 0, r.next_in = W, r.input = E, r.avail_in = U, F.wrap = A, d;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(s, i) {
          var n, h, g, b, m, u, d, y, o, _, p, w, M, k, R, O, B, j, I, Y, Q, S, L, c, $;
          n = s.state, h = s.next_in, c = s.input, g = h + (s.avail_in - 5), b = s.next_out, $ = s.output, m = b - (i - s.avail_out), u = b + (s.avail_out - 257), d = n.dmax, y = n.wsize, o = n.whave, _ = n.wnext, p = n.window, w = n.hold, M = n.bits, k = n.lencode, R = n.distcode, O = (1 << n.lenbits) - 1, B = (1 << n.distbits) - 1;
          t: do {
            M < 15 && (w += c[h++] << M, M += 8, w += c[h++] << M, M += 8), j = k[w & O];
            e: for (; ; ) {
              if (w >>>= I = j >>> 24, M -= I, (I = j >>> 16 & 255) === 0) $[b++] = 65535 & j;
              else {
                if (!(16 & I)) {
                  if ((64 & I) == 0) {
                    j = k[(65535 & j) + (w & (1 << I) - 1)];
                    continue e;
                  }
                  if (32 & I) {
                    n.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                Y = 65535 & j, (I &= 15) && (M < I && (w += c[h++] << M, M += 8), Y += w & (1 << I) - 1, w >>>= I, M -= I), M < 15 && (w += c[h++] << M, M += 8, w += c[h++] << M, M += 8), j = R[w & B];
                r: for (; ; ) {
                  if (w >>>= I = j >>> 24, M -= I, !(16 & (I = j >>> 16 & 255))) {
                    if ((64 & I) == 0) {
                      j = R[(65535 & j) + (w & (1 << I) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (Q = 65535 & j, M < (I &= 15) && (w += c[h++] << M, (M += 8) < I && (w += c[h++] << M, M += 8)), d < (Q += w & (1 << I) - 1)) {
                    s.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (w >>>= I, M -= I, (I = b - m) < Q) {
                    if (o < (I = Q - I) && n.sane) {
                      s.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (L = p, (S = 0) === _) {
                      if (S += y - I, I < Y) {
                        for (Y -= I; $[b++] = p[S++], --I; ) ;
                        S = b - Q, L = $;
                      }
                    } else if (_ < I) {
                      if (S += y + _ - I, (I -= _) < Y) {
                        for (Y -= I; $[b++] = p[S++], --I; ) ;
                        if (S = 0, _ < Y) {
                          for (Y -= I = _; $[b++] = p[S++], --I; ) ;
                          S = b - Q, L = $;
                        }
                      }
                    } else if (S += _ - I, I < Y) {
                      for (Y -= I; $[b++] = p[S++], --I; ) ;
                      S = b - Q, L = $;
                    }
                    for (; 2 < Y; ) $[b++] = L[S++], $[b++] = L[S++], $[b++] = L[S++], Y -= 3;
                    Y && ($[b++] = L[S++], 1 < Y && ($[b++] = L[S++]));
                  } else {
                    for (S = b - Q; $[b++] = $[S++], $[b++] = $[S++], $[b++] = $[S++], 2 < (Y -= 3); ) ;
                    Y && ($[b++] = $[S++], 1 < Y && ($[b++] = $[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < g && b < u);
          h -= Y = M >> 3, w &= (1 << (M -= Y << 3)) - 1, s.next_in = h, s.next_out = b, s.avail_in = h < g ? g - h + 5 : 5 - (h - g), s.avail_out = b < u ? u - b + 257 : 257 - (b - u), n.hold = w, n.bits = M;
        };
      }, {}], 49: [function(e, a, l) {
        var s = e("../utils/common"), i = e("./adler32"), n = e("./crc32"), h = e("./inffast"), g = e("./inftrees"), b = 1, m = 2, u = 0, d = -2, y = 1, o = 852, _ = 592;
        function p(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function w() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function M(S) {
          var L;
          return S && S.state ? (L = S.state, S.total_in = S.total_out = L.total = 0, S.msg = "", L.wrap && (S.adler = 1 & L.wrap), L.mode = y, L.last = 0, L.havedict = 0, L.dmax = 32768, L.head = null, L.hold = 0, L.bits = 0, L.lencode = L.lendyn = new s.Buf32(o), L.distcode = L.distdyn = new s.Buf32(_), L.sane = 1, L.back = -1, u) : d;
        }
        function k(S) {
          var L;
          return S && S.state ? ((L = S.state).wsize = 0, L.whave = 0, L.wnext = 0, M(S)) : d;
        }
        function R(S, L) {
          var c, $;
          return S && S.state ? ($ = S.state, L < 0 ? (c = 0, L = -L) : (c = 1 + (L >> 4), L < 48 && (L &= 15)), L && (L < 8 || 15 < L) ? d : ($.window !== null && $.wbits !== L && ($.window = null), $.wrap = c, $.wbits = L, k(S))) : d;
        }
        function O(S, L) {
          var c, $;
          return S ? ($ = new w(), (S.state = $).window = null, (c = R(S, L)) !== u && (S.state = null), c) : d;
        }
        var B, j, I = !0;
        function Y(S) {
          if (I) {
            var L;
            for (B = new s.Buf32(512), j = new s.Buf32(32), L = 0; L < 144; ) S.lens[L++] = 8;
            for (; L < 256; ) S.lens[L++] = 9;
            for (; L < 280; ) S.lens[L++] = 7;
            for (; L < 288; ) S.lens[L++] = 8;
            for (g(b, S.lens, 0, 288, B, 0, S.work, { bits: 9 }), L = 0; L < 32; ) S.lens[L++] = 5;
            g(m, S.lens, 0, 32, j, 0, S.work, { bits: 5 }), I = !1;
          }
          S.lencode = B, S.lenbits = 9, S.distcode = j, S.distbits = 5;
        }
        function Q(S, L, c, $) {
          var tt, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new s.Buf8(X.wsize)), $ >= X.wsize ? (s.arraySet(X.window, L, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : ($ < (tt = X.wsize - X.wnext) && (tt = $), s.arraySet(X.window, L, c - $, tt, X.wnext), ($ -= tt) ? (s.arraySet(X.window, L, c - $, $, 0), X.wnext = $, X.whave = X.wsize) : (X.wnext += tt, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += tt))), 0;
        }
        l.inflateReset = k, l.inflateReset2 = R, l.inflateResetKeep = M, l.inflateInit = function(S) {
          return O(S, 15);
        }, l.inflateInit2 = O, l.inflate = function(S, L) {
          var c, $, tt, X, it, Z, rt, P, C, z, T, N, K, nt, V, H, st, at, ut, lt, r, D, F, x, v = 0, A = new s.Buf8(4), U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return d;
          (c = S.state).mode === 12 && (c.mode = 13), it = S.next_out, tt = S.output, rt = S.avail_out, X = S.next_in, $ = S.input, Z = S.avail_in, P = c.hold, C = c.bits, z = Z, T = rt, D = u;
          t: for (; ; ) switch (c.mode) {
            case y:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; C < 16; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if (2 & c.wrap && P === 35615) {
                A[c.check = 0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0), C = P = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & P) << 8) + (P >> 8)) % 31) {
                S.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & P) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (C -= 4, r = 8 + (15 & (P >>>= 4)), c.wbits === 0) c.wbits = r;
              else if (r > c.wbits) {
                S.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << r, S.adler = c.check = 1, c.mode = 512 & P ? 10 : 12, C = P = 0;
              break;
            case 2:
              for (; C < 16; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if (c.flags = P, (255 & c.flags) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                S.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = P >> 8 & 1), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), C = P = 0, c.mode = 3;
            case 3:
              for (; C < 32; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              c.head && (c.head.time = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, A[2] = P >>> 16 & 255, A[3] = P >>> 24 & 255, c.check = n(c.check, A, 4, 0)), C = P = 0, c.mode = 4;
            case 4:
              for (; C < 16; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              c.head && (c.head.xflags = 255 & P, c.head.os = P >> 8), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), C = P = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; C < 16; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                c.length = P, c.head && (c.head.extra_len = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = n(c.check, A, 2, 0)), C = P = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (Z < (N = c.length) && (N = Z), N && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), s.arraySet(c.head.extra, $, X, N, r)), 512 & c.flags && (c.check = n(c.check, $, N, X)), Z -= N, X += N, c.length -= N), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (Z === 0) break t;
                for (N = 0; r = $[X + N++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && N < Z; ) ;
                if (512 & c.flags && (c.check = n(c.check, $, N, X)), Z -= N, X += N, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (Z === 0) break t;
                for (N = 0; r = $[X + N++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && N < Z; ) ;
                if (512 & c.flags && (c.check = n(c.check, $, N, X)), Z -= N, X += N, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; C < 16; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                if (P !== (65535 & c.check)) {
                  S.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                C = P = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), S.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; C < 32; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              S.adler = c.check = p(P), C = P = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return S.next_out = it, S.avail_out = rt, S.next_in = X, S.avail_in = Z, c.hold = P, c.bits = C, 2;
              S.adler = c.check = 1, c.mode = 12;
            case 12:
              if (L === 5 || L === 6) break t;
            case 13:
              if (c.last) {
                P >>>= 7 & C, C -= 7 & C, c.mode = 27;
                break;
              }
              for (; C < 3; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              switch (c.last = 1 & P, C -= 1, 3 & (P >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (Y(c), c.mode = 20, L !== 6) break;
                  P >>>= 2, C -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", c.mode = 30;
              }
              P >>>= 2, C -= 2;
              break;
            case 14:
              for (P >>>= 7 & C, C -= 7 & C; C < 32; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if ((65535 & P) != (P >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & P, C = P = 0, c.mode = 15, L === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (N = c.length) {
                if (Z < N && (N = Z), rt < N && (N = rt), N === 0) break t;
                s.arraySet(tt, $, X, N, it), Z -= N, X += N, rt -= N, it += N, c.length -= N;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; C < 14; ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if (c.nlen = 257 + (31 & P), P >>>= 5, C -= 5, c.ndist = 1 + (31 & P), P >>>= 5, C -= 5, c.ncode = 4 + (15 & P), P >>>= 4, C -= 4, 286 < c.nlen || 30 < c.ndist) {
                S.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; C < 3; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                c.lens[U[c.have++]] = 7 & P, P >>>= 3, C -= 3;
              }
              for (; c.have < 19; ) c.lens[U[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, F = { bits: c.lenbits }, D = g(0, c.lens, 0, 19, c.lencode, 0, c.work, F), c.lenbits = F.bits, D) {
                S.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; H = (v = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, st = 65535 & v, !((V = v >>> 24) <= C); ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                if (st < 16) P >>>= V, C -= V, c.lens[c.have++] = st;
                else {
                  if (st === 16) {
                    for (x = V + 2; C < x; ) {
                      if (Z === 0) break t;
                      Z--, P += $[X++] << C, C += 8;
                    }
                    if (P >>>= V, C -= V, c.have === 0) {
                      S.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], N = 3 + (3 & P), P >>>= 2, C -= 2;
                  } else if (st === 17) {
                    for (x = V + 3; C < x; ) {
                      if (Z === 0) break t;
                      Z--, P += $[X++] << C, C += 8;
                    }
                    C -= V, r = 0, N = 3 + (7 & (P >>>= V)), P >>>= 3, C -= 3;
                  } else {
                    for (x = V + 7; C < x; ) {
                      if (Z === 0) break t;
                      Z--, P += $[X++] << C, C += 8;
                    }
                    C -= V, r = 0, N = 11 + (127 & (P >>>= V)), P >>>= 7, C -= 7;
                  }
                  if (c.have + N > c.nlen + c.ndist) {
                    S.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; N--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, F = { bits: c.lenbits }, D = g(b, c.lens, 0, c.nlen, c.lencode, 0, c.work, F), c.lenbits = F.bits, D) {
                S.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, F = { bits: c.distbits }, D = g(m, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, F), c.distbits = F.bits, D) {
                S.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, L === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= Z && 258 <= rt) {
                S.next_out = it, S.avail_out = rt, S.next_in = X, S.avail_in = Z, c.hold = P, c.bits = C, h(S, T), it = S.next_out, tt = S.output, rt = S.avail_out, X = S.next_in, $ = S.input, Z = S.avail_in, P = c.hold, C = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; H = (v = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, st = 65535 & v, !((V = v >>> 24) <= C); ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if (H && (240 & H) == 0) {
                for (at = V, ut = H, lt = st; H = (v = c.lencode[lt + ((P & (1 << at + ut) - 1) >> at)]) >>> 16 & 255, st = 65535 & v, !(at + (V = v >>> 24) <= C); ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                P >>>= at, C -= at, c.back += at;
              }
              if (P >>>= V, C -= V, c.back += V, c.length = st, H === 0) {
                c.mode = 26;
                break;
              }
              if (32 & H) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & H) {
                S.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & H, c.mode = 22;
            case 22:
              if (c.extra) {
                for (x = c.extra; C < x; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                c.length += P & (1 << c.extra) - 1, P >>>= c.extra, C -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; H = (v = c.distcode[P & (1 << c.distbits) - 1]) >>> 16 & 255, st = 65535 & v, !((V = v >>> 24) <= C); ) {
                if (Z === 0) break t;
                Z--, P += $[X++] << C, C += 8;
              }
              if ((240 & H) == 0) {
                for (at = V, ut = H, lt = st; H = (v = c.distcode[lt + ((P & (1 << at + ut) - 1) >> at)]) >>> 16 & 255, st = 65535 & v, !(at + (V = v >>> 24) <= C); ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                P >>>= at, C -= at, c.back += at;
              }
              if (P >>>= V, C -= V, c.back += V, 64 & H) {
                S.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = st, c.extra = 15 & H, c.mode = 24;
            case 24:
              if (c.extra) {
                for (x = c.extra; C < x; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                c.offset += P & (1 << c.extra) - 1, P >>>= c.extra, C -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                S.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (rt === 0) break t;
              if (N = T - rt, c.offset > N) {
                if ((N = c.offset - N) > c.whave && c.sane) {
                  S.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                K = N > c.wnext ? (N -= c.wnext, c.wsize - N) : c.wnext - N, N > c.length && (N = c.length), nt = c.window;
              } else nt = tt, K = it - c.offset, N = c.length;
              for (rt < N && (N = rt), rt -= N, c.length -= N; tt[it++] = nt[K++], --N; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (rt === 0) break t;
              tt[it++] = c.length, rt--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; C < 32; ) {
                  if (Z === 0) break t;
                  Z--, P |= $[X++] << C, C += 8;
                }
                if (T -= rt, S.total_out += T, c.total += T, T && (S.adler = c.check = c.flags ? n(c.check, tt, T, it - T) : i(c.check, tt, T, it - T)), T = rt, (c.flags ? P : p(P)) !== c.check) {
                  S.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                C = P = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; C < 32; ) {
                  if (Z === 0) break t;
                  Z--, P += $[X++] << C, C += 8;
                }
                if (P !== (4294967295 & c.total)) {
                  S.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                C = P = 0;
              }
              c.mode = 29;
            case 29:
              D = 1;
              break t;
            case 30:
              D = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return d;
          }
          return S.next_out = it, S.avail_out = rt, S.next_in = X, S.avail_in = Z, c.hold = P, c.bits = C, (c.wsize || T !== S.avail_out && c.mode < 30 && (c.mode < 27 || L !== 4)) && Q(S, S.output, S.next_out, T - S.avail_out) ? (c.mode = 31, -4) : (z -= S.avail_in, T -= S.avail_out, S.total_in += z, S.total_out += T, c.total += T, c.wrap && T && (S.adler = c.check = c.flags ? n(c.check, tt, T, S.next_out - T) : i(c.check, tt, T, S.next_out - T)), S.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (z == 0 && T === 0 || L === 4) && D === u && (D = -5), D);
        }, l.inflateEnd = function(S) {
          if (!S || !S.state) return d;
          var L = S.state;
          return L.window && (L.window = null), S.state = null, u;
        }, l.inflateGetHeader = function(S, L) {
          var c;
          return S && S.state ? (2 & (c = S.state).wrap) == 0 ? d : ((c.head = L).done = !1, u) : d;
        }, l.inflateSetDictionary = function(S, L) {
          var c, $ = L.length;
          return S && S.state ? (c = S.state).wrap !== 0 && c.mode !== 11 ? d : c.mode === 11 && i(1, L, $, 0) !== c.check ? -3 : Q(S, L, $, $) ? (c.mode = 31, -4) : (c.havedict = 1, u) : d;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(b, m, u, d, y, o, _, p) {
          var w, M, k, R, O, B, j, I, Y, Q = p.bits, S = 0, L = 0, c = 0, $ = 0, tt = 0, X = 0, it = 0, Z = 0, rt = 0, P = 0, C = null, z = 0, T = new s.Buf16(16), N = new s.Buf16(16), K = null, nt = 0;
          for (S = 0; S <= 15; S++) T[S] = 0;
          for (L = 0; L < d; L++) T[m[u + L]]++;
          for (tt = Q, $ = 15; 1 <= $ && T[$] === 0; $--) ;
          if ($ < tt && (tt = $), $ === 0) return y[o++] = 20971520, y[o++] = 20971520, p.bits = 1, 0;
          for (c = 1; c < $ && T[c] === 0; c++) ;
          for (tt < c && (tt = c), S = Z = 1; S <= 15; S++) if (Z <<= 1, (Z -= T[S]) < 0) return -1;
          if (0 < Z && (b === 0 || $ !== 1)) return -1;
          for (N[1] = 0, S = 1; S < 15; S++) N[S + 1] = N[S] + T[S];
          for (L = 0; L < d; L++) m[u + L] !== 0 && (_[N[m[u + L]]++] = L);
          if (B = b === 0 ? (C = K = _, 19) : b === 1 ? (C = i, z -= 257, K = n, nt -= 257, 256) : (C = h, K = g, -1), S = c, O = o, it = L = P = 0, k = -1, R = (rt = 1 << (X = tt)) - 1, b === 1 && 852 < rt || b === 2 && 592 < rt) return 1;
          for (; ; ) {
            for (j = S - it, Y = _[L] < B ? (I = 0, _[L]) : _[L] > B ? (I = K[nt + _[L]], C[z + _[L]]) : (I = 96, 0), w = 1 << S - it, c = M = 1 << X; y[O + (P >> it) + (M -= w)] = j << 24 | I << 16 | Y | 0, M !== 0; ) ;
            for (w = 1 << S - 1; P & w; ) w >>= 1;
            if (w !== 0 ? (P &= w - 1, P += w) : P = 0, L++, --T[S] == 0) {
              if (S === $) break;
              S = m[u + _[L]];
            }
            if (tt < S && (P & R) !== k) {
              for (it === 0 && (it = tt), O += c, Z = 1 << (X = S - it); X + it < $ && !((Z -= T[X + it]) <= 0); ) X++, Z <<= 1;
              if (rt += 1 << X, b === 1 && 852 < rt || b === 2 && 592 < rt) return 1;
              y[k = P & R] = tt << 24 | X << 16 | O - o | 0;
            }
          }
          return P !== 0 && (y[O + P] = S - it << 24 | 64 << 16 | 0), p.bits = tt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var s = e("../utils/common"), i = 0, n = 1;
        function h(v) {
          for (var A = v.length; 0 <= --A; ) v[A] = 0;
        }
        var g = 0, b = 29, m = 256, u = m + 1 + b, d = 30, y = 19, o = 2 * u + 1, _ = 15, p = 16, w = 7, M = 256, k = 16, R = 17, O = 18, B = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], I = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], Y = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Q = new Array(2 * (u + 2));
        h(Q);
        var S = new Array(2 * d);
        h(S);
        var L = new Array(512);
        h(L);
        var c = new Array(256);
        h(c);
        var $ = new Array(b);
        h($);
        var tt, X, it, Z = new Array(d);
        function rt(v, A, U, W, E) {
          this.static_tree = v, this.extra_bits = A, this.extra_base = U, this.elems = W, this.max_length = E, this.has_stree = v && v.length;
        }
        function P(v, A) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = A;
        }
        function C(v) {
          return v < 256 ? L[v] : L[256 + (v >>> 7)];
        }
        function z(v, A) {
          v.pending_buf[v.pending++] = 255 & A, v.pending_buf[v.pending++] = A >>> 8 & 255;
        }
        function T(v, A, U) {
          v.bi_valid > p - U ? (v.bi_buf |= A << v.bi_valid & 65535, z(v, v.bi_buf), v.bi_buf = A >> p - v.bi_valid, v.bi_valid += U - p) : (v.bi_buf |= A << v.bi_valid & 65535, v.bi_valid += U);
        }
        function N(v, A, U) {
          T(v, U[2 * A], U[2 * A + 1]);
        }
        function K(v, A) {
          for (var U = 0; U |= 1 & v, v >>>= 1, U <<= 1, 0 < --A; ) ;
          return U >>> 1;
        }
        function nt(v, A, U) {
          var W, E, G = new Array(_ + 1), J = 0;
          for (W = 1; W <= _; W++) G[W] = J = J + U[W - 1] << 1;
          for (E = 0; E <= A; E++) {
            var q = v[2 * E + 1];
            q !== 0 && (v[2 * E] = K(G[q]++, q));
          }
        }
        function V(v) {
          var A;
          for (A = 0; A < u; A++) v.dyn_ltree[2 * A] = 0;
          for (A = 0; A < d; A++) v.dyn_dtree[2 * A] = 0;
          for (A = 0; A < y; A++) v.bl_tree[2 * A] = 0;
          v.dyn_ltree[2 * M] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function H(v) {
          8 < v.bi_valid ? z(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function st(v, A, U, W) {
          var E = 2 * A, G = 2 * U;
          return v[E] < v[G] || v[E] === v[G] && W[A] <= W[U];
        }
        function at(v, A, U) {
          for (var W = v.heap[U], E = U << 1; E <= v.heap_len && (E < v.heap_len && st(A, v.heap[E + 1], v.heap[E], v.depth) && E++, !st(A, W, v.heap[E], v.depth)); ) v.heap[U] = v.heap[E], U = E, E <<= 1;
          v.heap[U] = W;
        }
        function ut(v, A, U) {
          var W, E, G, J, q = 0;
          if (v.last_lit !== 0) for (; W = v.pending_buf[v.d_buf + 2 * q] << 8 | v.pending_buf[v.d_buf + 2 * q + 1], E = v.pending_buf[v.l_buf + q], q++, W === 0 ? N(v, E, A) : (N(v, (G = c[E]) + m + 1, A), (J = B[G]) !== 0 && T(v, E -= $[G], J), N(v, G = C(--W), U), (J = j[G]) !== 0 && T(v, W -= Z[G], J)), q < v.last_lit; ) ;
          N(v, M, A);
        }
        function lt(v, A) {
          var U, W, E, G = A.dyn_tree, J = A.stat_desc.static_tree, q = A.stat_desc.has_stree, et = A.stat_desc.elems, ct = -1;
          for (v.heap_len = 0, v.heap_max = o, U = 0; U < et; U++) G[2 * U] !== 0 ? (v.heap[++v.heap_len] = ct = U, v.depth[U] = 0) : G[2 * U + 1] = 0;
          for (; v.heap_len < 2; ) G[2 * (E = v.heap[++v.heap_len] = ct < 2 ? ++ct : 0)] = 1, v.depth[E] = 0, v.opt_len--, q && (v.static_len -= J[2 * E + 1]);
          for (A.max_code = ct, U = v.heap_len >> 1; 1 <= U; U--) at(v, G, U);
          for (E = et; U = v.heap[1], v.heap[1] = v.heap[v.heap_len--], at(v, G, 1), W = v.heap[1], v.heap[--v.heap_max] = U, v.heap[--v.heap_max] = W, G[2 * E] = G[2 * U] + G[2 * W], v.depth[E] = (v.depth[U] >= v.depth[W] ? v.depth[U] : v.depth[W]) + 1, G[2 * U + 1] = G[2 * W + 1] = E, v.heap[1] = E++, at(v, G, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(ot, pt) {
            var At, gt, zt, ht, Ot, Nt, bt = pt.dyn_tree, Xt = pt.max_code, de = pt.stat_desc.static_tree, he = pt.stat_desc.has_stree, ue = pt.stat_desc.extra_bits, Yt = pt.stat_desc.extra_base, Et = pt.stat_desc.max_length, Bt = 0;
            for (ht = 0; ht <= _; ht++) ot.bl_count[ht] = 0;
            for (bt[2 * ot.heap[ot.heap_max] + 1] = 0, At = ot.heap_max + 1; At < o; At++) Et < (ht = bt[2 * bt[2 * (gt = ot.heap[At]) + 1] + 1] + 1) && (ht = Et, Bt++), bt[2 * gt + 1] = ht, Xt < gt || (ot.bl_count[ht]++, Ot = 0, Yt <= gt && (Ot = ue[gt - Yt]), Nt = bt[2 * gt], ot.opt_len += Nt * (ht + Ot), he && (ot.static_len += Nt * (de[2 * gt + 1] + Ot)));
            if (Bt !== 0) {
              do {
                for (ht = Et - 1; ot.bl_count[ht] === 0; ) ht--;
                ot.bl_count[ht]--, ot.bl_count[ht + 1] += 2, ot.bl_count[Et]--, Bt -= 2;
              } while (0 < Bt);
              for (ht = Et; ht !== 0; ht--) for (gt = ot.bl_count[ht]; gt !== 0; ) Xt < (zt = ot.heap[--At]) || (bt[2 * zt + 1] !== ht && (ot.opt_len += (ht - bt[2 * zt + 1]) * bt[2 * zt], bt[2 * zt + 1] = ht), gt--);
            }
          })(v, A), nt(G, ct, v.bl_count);
        }
        function r(v, A, U) {
          var W, E, G = -1, J = A[1], q = 0, et = 7, ct = 4;
          for (J === 0 && (et = 138, ct = 3), A[2 * (U + 1) + 1] = 65535, W = 0; W <= U; W++) E = J, J = A[2 * (W + 1) + 1], ++q < et && E === J || (q < ct ? v.bl_tree[2 * E] += q : E !== 0 ? (E !== G && v.bl_tree[2 * E]++, v.bl_tree[2 * k]++) : q <= 10 ? v.bl_tree[2 * R]++ : v.bl_tree[2 * O]++, G = E, ct = (q = 0) === J ? (et = 138, 3) : E === J ? (et = 6, 3) : (et = 7, 4));
        }
        function D(v, A, U) {
          var W, E, G = -1, J = A[1], q = 0, et = 7, ct = 4;
          for (J === 0 && (et = 138, ct = 3), W = 0; W <= U; W++) if (E = J, J = A[2 * (W + 1) + 1], !(++q < et && E === J)) {
            if (q < ct) for (; N(v, E, v.bl_tree), --q != 0; ) ;
            else E !== 0 ? (E !== G && (N(v, E, v.bl_tree), q--), N(v, k, v.bl_tree), T(v, q - 3, 2)) : q <= 10 ? (N(v, R, v.bl_tree), T(v, q - 3, 3)) : (N(v, O, v.bl_tree), T(v, q - 11, 7));
            G = E, ct = (q = 0) === J ? (et = 138, 3) : E === J ? (et = 6, 3) : (et = 7, 4);
          }
        }
        h(Z);
        var F = !1;
        function x(v, A, U, W) {
          T(v, (g << 1) + (W ? 1 : 0), 3), (function(E, G, J, q) {
            H(E), z(E, J), z(E, ~J), s.arraySet(E.pending_buf, E.window, G, J, E.pending), E.pending += J;
          })(v, A, U);
        }
        l._tr_init = function(v) {
          F || ((function() {
            var A, U, W, E, G, J = new Array(_ + 1);
            for (E = W = 0; E < b - 1; E++) for ($[E] = W, A = 0; A < 1 << B[E]; A++) c[W++] = E;
            for (c[W - 1] = E, E = G = 0; E < 16; E++) for (Z[E] = G, A = 0; A < 1 << j[E]; A++) L[G++] = E;
            for (G >>= 7; E < d; E++) for (Z[E] = G << 7, A = 0; A < 1 << j[E] - 7; A++) L[256 + G++] = E;
            for (U = 0; U <= _; U++) J[U] = 0;
            for (A = 0; A <= 143; ) Q[2 * A + 1] = 8, A++, J[8]++;
            for (; A <= 255; ) Q[2 * A + 1] = 9, A++, J[9]++;
            for (; A <= 279; ) Q[2 * A + 1] = 7, A++, J[7]++;
            for (; A <= 287; ) Q[2 * A + 1] = 8, A++, J[8]++;
            for (nt(Q, u + 1, J), A = 0; A < d; A++) S[2 * A + 1] = 5, S[2 * A] = K(A, 5);
            tt = new rt(Q, B, m + 1, u, _), X = new rt(S, j, 0, d, _), it = new rt(new Array(0), I, 0, y, w);
          })(), F = !0), v.l_desc = new P(v.dyn_ltree, tt), v.d_desc = new P(v.dyn_dtree, X), v.bl_desc = new P(v.bl_tree, it), v.bi_buf = 0, v.bi_valid = 0, V(v);
        }, l._tr_stored_block = x, l._tr_flush_block = function(v, A, U, W) {
          var E, G, J = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(q) {
            var et, ct = 4093624447;
            for (et = 0; et <= 31; et++, ct >>>= 1) if (1 & ct && q.dyn_ltree[2 * et] !== 0) return i;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return n;
            for (et = 32; et < m; et++) if (q.dyn_ltree[2 * et] !== 0) return n;
            return i;
          })(v)), lt(v, v.l_desc), lt(v, v.d_desc), J = (function(q) {
            var et;
            for (r(q, q.dyn_ltree, q.l_desc.max_code), r(q, q.dyn_dtree, q.d_desc.max_code), lt(q, q.bl_desc), et = y - 1; 3 <= et && q.bl_tree[2 * Y[et] + 1] === 0; et--) ;
            return q.opt_len += 3 * (et + 1) + 5 + 5 + 4, et;
          })(v), E = v.opt_len + 3 + 7 >>> 3, (G = v.static_len + 3 + 7 >>> 3) <= E && (E = G)) : E = G = U + 5, U + 4 <= E && A !== -1 ? x(v, A, U, W) : v.strategy === 4 || G === E ? (T(v, 2 + (W ? 1 : 0), 3), ut(v, Q, S)) : (T(v, 4 + (W ? 1 : 0), 3), (function(q, et, ct, ot) {
            var pt;
            for (T(q, et - 257, 5), T(q, ct - 1, 5), T(q, ot - 4, 4), pt = 0; pt < ot; pt++) T(q, q.bl_tree[2 * Y[pt] + 1], 3);
            D(q, q.dyn_ltree, et - 1), D(q, q.dyn_dtree, ct - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, J + 1), ut(v, v.dyn_ltree, v.dyn_dtree)), V(v), W && H(v);
        }, l._tr_tally = function(v, A, U) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = A >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & A, v.pending_buf[v.l_buf + v.last_lit] = 255 & U, v.last_lit++, A === 0 ? v.dyn_ltree[2 * U]++ : (v.matches++, A--, v.dyn_ltree[2 * (c[U] + m + 1)]++, v.dyn_dtree[2 * C(A)]++), v.last_lit === v.lit_bufsize - 1;
        }, l._tr_align = function(v) {
          T(v, 2, 3), N(v, M, Q), (function(A) {
            A.bi_valid === 16 ? (z(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(s) {
          (function(i, n) {
            if (!i.setImmediate) {
              var h, g, b, m, u = 1, d = {}, y = !1, o = i.document, _ = Object.getPrototypeOf && Object.getPrototypeOf(i);
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
              })() ? (m = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", M, !1) : i.attachEvent("onmessage", M), function(k) {
                i.postMessage(m + k, "*");
              }) : i.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                w(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : o && "onreadystatechange" in o.createElement("script") ? (g = o.documentElement, function(k) {
                var R = o.createElement("script");
                R.onreadystatechange = function() {
                  w(k), R.onreadystatechange = null, g.removeChild(R), R = null;
                }, g.appendChild(R);
              }) : function(k) {
                setTimeout(w, 0, k);
              }, _.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var R = new Array(arguments.length - 1), O = 0; O < R.length; O++) R[O] = arguments[O + 1];
                var B = { callback: k, args: R };
                return d[u] = B, h(u), u++;
              }, _.clearImmediate = p;
            }
            function p(k) {
              delete d[k];
            }
            function w(k) {
              if (y) setTimeout(w, 0, k);
              else {
                var R = d[k];
                if (R) {
                  y = !0;
                  try {
                    (function(O) {
                      var B = O.callback, j = O.args;
                      switch (j.length) {
                        case 0:
                          B();
                          break;
                        case 1:
                          B(j[0]);
                          break;
                        case 2:
                          B(j[0], j[1]);
                          break;
                        case 3:
                          B(j[0], j[1], j[2]);
                          break;
                        default:
                          B.apply(n, j);
                      }
                    })(R);
                  } finally {
                    p(k), y = !1;
                  }
                }
              }
            }
            function M(k) {
              k.source === i && typeof k.data == "string" && k.data.indexOf(m) === 0 && w(+k.data.slice(m.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Dt)), Dt.exports;
}
var pe = me();
const re = /* @__PURE__ */ fe(pe);
async function ye(f) {
  const t = await ge(f), e = await re.loadAsync(t), a = [];
  return e.forEach((l, s) => {
    if (s.dir)
      return;
    const i = _e(l);
    a.push({
      name: i,
      text: () => s.async("text"),
      arrayBuffer: () => s.async("arraybuffer")
    });
  }), a;
}
async function ge(f) {
  if (f instanceof ArrayBuffer)
    return f;
  if (f instanceof Blob)
    return await f.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function _e(f) {
  let t = f.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function be(f) {
  return !!f && typeof f == "object" && !(f instanceof ArrayBuffer) && !(f instanceof Uint8Array);
}
function ve(f) {
  return f instanceof Uint8Array ? f : new Uint8Array(f);
}
function we(f) {
  return f.byteOffset === 0 && f.byteLength === f.buffer.byteLength ? f.buffer : f.slice().buffer;
}
function St(f, t, e = 0) {
  if (f.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (f[e + a] !== t[a]) return !1;
  return !0;
}
function xe(f) {
  return St(f, [80, 75, 3, 4]) || St(f, [80, 75, 5, 6]) || St(f, [80, 75, 7, 8]) ? "zip" : St(f, [82, 97, 114, 33, 26, 7, 0]) || St(f, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : St(f, [55, 122, 188, 175, 39, 28]) ? "7z" : f.length > 262 && St(f, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function ie(f) {
  return f.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Gt(f) {
  const t = [], e = f.map((o) => ie(o).toLowerCase()), a = (o) => e.some(o), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((o) => l.test(o)).length, n = e.filter((o) => s.test(o) || o.includes("drill")).length, h = a((o) => o.includes("top") && o.includes("copper") || o.endsWith(".gtl")), g = a((o) => o.includes("bot") || o.includes("bottom") || o.endsWith(".gbl")), b = a((o) => o.includes("mask") || o.includes("solder") || o.endsWith(".gts") || o.endsWith(".gbs")), m = a((o) => o.includes("silk") || o.includes("legend") || o.endsWith(".gto") || o.endsWith(".gbo")), u = a((o) => o.includes("outline") || o.includes("profile") || o.includes("edge") || o.endsWith(".gko") || o.endsWith(".gm1") || o.endsWith(".gml")), d = e.every(
    (o) => o.endsWith(".pdf") || o.endsWith(".png") || o.endsWith(".jpg") || o.endsWith(".jpeg") || o.endsWith(".svg") || o.endsWith(".txt") || o.endsWith(".md")
  );
  let y = 0;
  return f.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (y += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), n > 0 && (y += 0.2, t.push(`Found ${n} drill-like file(s).`)), u && (y += 0.15, t.push("Found outline/profile/edge candidate.")), h && g ? (y += 0.2, t.push("Found both top and bottom copper candidates.")) : (h || g) && (y += 0.1, t.push("Found at least one copper candidate.")), b && (y += 0.05, t.push("Found solder mask candidate.")), m && (y += 0.05, t.push("Found silkscreen/legend candidate.")), y = Math.max(0, Math.min(1, y)), y < 0.6 && i >= 2 && (y = Math.max(y, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: y, reasons: t });
}
async function ke(f) {
  if (be(f)) {
    const s = Object.keys(f).map(ie), { confidence: i, reasons: n } = Gt(s);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: n,
      files: s
    };
  }
  const t = ve(f), e = xe(t);
  if (e === "zip")
    try {
      const s = we(t), n = (await ye(s)).map((b) => b.name), { confidence: h, reasons: g } = Gt(n);
      return {
        isGerber: h >= 0.6,
        archiveType: "zip",
        confidence: h,
        reasons: g,
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
function ne(f) {
  let t = f.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Se(f) {
  return f instanceof Uint8Array ? f : new Uint8Array(f);
}
function se(f) {
  try {
    return f.slice().buffer;
  } catch {
    const t = new Uint8Array(f.byteLength);
    return t.set(f), t.buffer;
  }
}
async function Me(f) {
  let t;
  try {
    t = await re.loadAsync(se(f));
  } catch (n) {
    throw new ft(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      n
    );
  }
  const e = {}, a = 1e3, l = 100 * 1024 * 1024, s = Object.entries(t.files).filter(([, n]) => n && !n.dir);
  if (s.length > a)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${s.length} > ${a})`
    );
  let i = 0;
  for (const [n, h] of s)
    try {
      const g = ne(n), b = await h.async("arraybuffer");
      if (i += b.byteLength, i > l)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[g] = new Uint8Array(b);
    } catch (g) {
      console.warn(`Failed to extract file ${n}:`, g);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Re(f, t) {
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
  let a;
  try {
    const m = new Blob([se(f)], { type: "application/octet-stream" });
    a = await e.open(m);
  } catch (m) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", m);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
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
  let g = 0;
  async function b(m, u) {
    if (i >= n)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${n})`
      );
    for (const d of Object.keys(m)) {
      const y = m[d], o = u ? `${u}/${d}` : d;
      if (y instanceof File || y instanceof Blob) {
        i++;
        try {
          const _ = await y.arrayBuffer();
          if (g += _.byteLength, g > h)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${h} bytes)`
            );
          s[ne(o)] = new Uint8Array(_);
        } catch (_) {
          console.warn(`Failed to extract file ${o}:`, _);
        }
      } else y && typeof y == "object" && await b(y, o);
    }
  }
  try {
    await b(l, "");
  } finally {
    if (a && typeof a.close == "function")
      try {
        await a.close();
      } catch (m) {
        console.warn("Failed to close archive:", m);
      }
  }
  if (Object.keys(s).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return s;
}
async function ae(f, t) {
  if (!f || f.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = Se(f), a = 100 * 1024 * 1024;
  if (e.length > a)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${a} bytes)`
    );
  let l;
  try {
    l = await ke(e);
  } catch (s) {
    throw new ft("PARSE_ERROR", "Failed to detect archive type", s);
  }
  if (!l.isGerber)
    throw new ft(
      "NOT_GERBER",
      l.reasons.join("; ") || "Not a Gerber bundle",
      l
    );
  try {
    if (l.archiveType === "zip")
      return { archiveType: "zip", files: await Me(e) };
    if (l.archiveType === "rar")
      return { archiveType: "rar", files: await Re(e, t) };
    throw new ft(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${l.archiveType}`,
      l
    );
  } catch (s) {
    throw s instanceof ft ? s : new ft(
      "PARSE_ERROR",
      s instanceof Error ? s.message : "Unknown error during extraction",
      { error: s, det: l }
    );
  }
}
function Wt(f) {
  return f.toLowerCase();
}
function wt(f, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return f.filter((l) => {
    const s = Wt(l), i = s.lastIndexOf(".");
    return i < 0 ? !1 : e.has(s.slice(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function dt(f, t) {
  const e = t.map((l) => l.toLowerCase());
  return f.filter((l) => {
    const s = Wt(l);
    return e.every((i) => s.includes(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function Ae(f) {
  const t = f.filter((b) => {
    const m = Wt(b);
    return !(m.endsWith("/") || m.includes("__macosx") || m.endsWith(".ds_store"));
  }), e = wt(t, [".gtl"]) || dt(t, ["f_cu"]) || dt(t, ["top", "cu"]) || dt(t, ["top", "copper"]), a = wt(t, [".gbl"]) || dt(t, ["b_cu"]) || dt(t, ["bottom", "cu"]) || dt(t, ["bottom", "copper"]), l = wt(t, [".gts"]) || dt(t, ["f_mask"]) || dt(t, ["top", "mask"]), s = wt(t, [".gbs"]) || dt(t, ["b_mask"]) || dt(t, ["bottom", "mask"]), i = wt(t, [".gto"]) || dt(t, ["f_silks"]) || dt(t, ["f_silk"]) || dt(t, ["top", "silk"]), n = wt(t, [".gbo"]) || dt(t, ["b_silks"]) || dt(t, ["b_silk"]) || dt(t, ["bottom", "silk"]), h = wt(t, [".gko", ".gm1"]) || dt(t, ["edge", "cuts"]) || dt(t, ["outline"]) || dt(t, ["board", "outline"]), g = (
    // Excellon often .drl or .xln or .txt
    wt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    dt(t, ["drill"]) || dt(t, ["drills"]) || dt(t, ["npth"]) || dt(t, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: n,
    outline: h,
    drills: g
  };
}
const ze = 0.8;
function Ct(f, t, e) {
  const a = {
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
  }, l = t.split(/\r?\n/);
  for (const s of l) {
    let i = s.trim();
    if (i && !i.startsWith("G04")) {
      if (i.startsWith("%") && i.endsWith("%")) {
        Ee(i, a);
        continue;
      }
      i.endsWith("*") && (i = i.slice(0, -1)), Ce(i, a);
    }
  }
  if (a.inRegion) {
    if (a.currentPath.length >= 3 && a.regionPaths.push(a.currentPath), a.regionPaths.length > 0) {
      const s = {
        loops: a.regionPaths,
        polarity: a.currentPolarity
      };
      a.regions.push(s), a.ops.push({
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
function Ee(f, t) {
  let e = f;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const a = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (a) {
      const l = parseInt(a[1], 10), s = parseInt(a[2], 10);
      parseInt(a[4], 10), t.fmtInt = l, t.fmtDec = s;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const a = t.unitScale;
    let l = a;
    if (e.includes("MOMM") ? l = 1 : e.includes("MOIN") && (l = 25.4), l !== a) {
      const s = l / a;
      for (const i of t.apertures.values())
        i.diameterMm !== void 0 && (i.diameterMm *= s), i.widthMm !== void 0 && (i.widthMm *= s), i.heightMm !== void 0 && (i.heightMm *= s);
      t.unitScale = l;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const a = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!a) return;
    const l = parseInt(a[2], 10), s = a[3], i = a[4] ?? "";
    let n, h, g, b;
    if (i) {
      const u = i.split(/[Xx]/).filter(Boolean), d = u[0] ? parseFloat(u[0]) * t.unitScale : void 0, y = u[1] ? parseFloat(u[1]) * t.unitScale : void 0, o = u[2] ? parseFloat(u[2]) * t.unitScale : void 0;
      s === "C" ? n = d : s === "R" || s === "O" ? (h = d, g = y, n = d !== void 0 && y !== void 0 ? Math.min(d, y) : d ?? y) : (h = d, g = y, o !== void 0 && (b = o), n = d !== void 0 && y !== void 0 ? Math.min(d, y) : d ?? y);
    }
    const m = {
      code: l,
      shape: s,
      diameterMm: n,
      widthMm: h,
      heightMm: g,
      cornerMm: b
    };
    t.apertures.set(l, m);
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
function Ce(f, t) {
  if (f === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (f === "G37") {
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
  const a = /D0?(\d{1,3})$/.exec(f);
  if (a && (e = parseInt(a[1], 10), f = f.slice(0, f.length - a[0].length)), e !== null && e >= 10) {
    const b = t.apertures.get(e);
    b && (t.currentAperture = b);
    return;
  }
  const l = /X([+\-]?\d+)/.exec(f), s = /Y([+\-]?\d+)/.exec(f);
  let i = t.x, n = t.y;
  if (l && (i = Vt(l[1], t)), s && (n = Vt(s[1], t)), e === null) {
    t.x = i, t.y = n;
    return;
  }
  if (t.inRegion) {
    const b = t.x, m = t.y;
    e === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: b, y: m }), t.currentPath.push({ x: i, y: n })) : e === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = i, t.y = n;
    return;
  }
  const h = t.x, g = t.y;
  if (e === 1) {
    if (!t.currentAperture) {
      t.x = i, t.y = n;
      return;
    }
    const b = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: h, y: g },
      end: { x: i, y: n },
      width: b,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: h, y: g },
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
      const b = t.currentAperture, m = b.diameterMm !== void 0 ? b.diameterMm : ze, u = {
        position: { x: i, y: n },
        diameterMm: m,
        shape: b.shape,
        polarity: t.currentPolarity
      };
      b.widthMm !== void 0 && (u.widthMm = b.widthMm), b.heightMm !== void 0 && (u.heightMm = b.heightMm), b.cornerMm !== void 0 && (u.cornerMm = b.cornerMm), t.flashes.push(u), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: i, y: n },
        diameterMm: m,
        shape: b.shape,
        widthMm: b.widthMm,
        heightMm: b.heightMm,
        cornerMm: b.cornerMm
      });
    }
    t.x = i, t.y = n;
    return;
  }
}
function Vt(f, t) {
  const e = f.startsWith("-") ? -1 : 1, a = f.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const s = Math.pow(10, t.fmtDec), i = l / s * t.unitScale;
  return e * i;
}
function Ie(f, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const s = [];
  for (const i of e) {
    const n = i.trim();
    if (n && !n.startsWith(";")) {
      if (n.startsWith("T") && n.includes("C")) {
        const h = /^T(\d+)[C]([\d.]+)/i.exec(n);
        if (h) {
          const g = h[1], b = parseFloat(h[2]);
          Number.isNaN(b) || a.set(g, b);
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
        const g = h[1], b = h[2], m = parseFloat(g), u = parseFloat(b);
        if (Number.isNaN(m) || Number.isNaN(u))
          continue;
        const d = l && a.has(l) ? a.get(l) : 0.6;
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
    name: f,
    holes: s
  };
}
function Te(f) {
  return { w: f.maxX - f.minX, h: f.maxY - f.minY };
}
function It(f) {
  const { w: t, h: e } = Te(f);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Mt(f, t) {
  if (!Number.isFinite(f) || !Number.isFinite(t) || f <= 0 || t <= 0) return 1;
  const e = f / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Tt(f, t) {
  return t === 1 ? f : {
    ...f,
    tracks: f.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: f.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: f.regions.map((e) => ({
      ...e,
      loops: e.loops.map((a) => a.map((l) => ({ x: l.x * t, y: l.y * t })))
    }))
  };
}
function Oe(f, t) {
  return t === 1 ? f : f.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Be(f) {
  return URL.createObjectURL(new Blob([f], { type: "image/svg+xml" }));
}
function yt(f, t, e) {
  f.minX = Math.min(f.minX, t), f.minY = Math.min(f.minY, e), f.maxX = Math.max(f.maxX, t), f.maxY = Math.max(f.maxY, e);
}
function jt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function xt(f) {
  const t = jt();
  for (const e of f.tracks) {
    yt(t, e.start.x, e.start.y), yt(t, e.end.x, e.end.y);
    const a = (e.width ?? 0) / 2;
    yt(t, e.start.x - a, e.start.y - a), yt(t, e.start.x + a, e.start.y + a), yt(t, e.end.x - a, e.end.y - a), yt(t, e.end.x + a, e.end.y + a);
  }
  for (const e of f.flashes) {
    const a = (e.widthMm ?? e.diameterMm) || 0, l = (e.heightMm ?? e.diameterMm) || 0;
    yt(t, e.position.x - a / 2, e.position.y - l / 2), yt(t, e.position.x + a / 2, e.position.y + l / 2);
  }
  for (const e of f.regions)
    for (const a of e.loops) for (const l of a) yt(t, l.x, l.y);
  return t;
}
function Pe(f) {
  const t = jt();
  for (const e of f) {
    const a = (e.diameter || 0) / 2;
    yt(t, e.x - a, e.y - a), yt(t, e.x + a, e.y + a);
  }
  return t;
}
function qt(f, t) {
  return {
    minX: Math.min(f.minX, t.minX),
    minY: Math.min(f.minY, t.minY),
    maxX: Math.max(f.maxX, t.maxX),
    maxY: Math.max(f.maxY, t.maxY)
  };
}
function vt(f) {
  return !Number.isFinite(f.minX) || !Number.isFinite(f.minY) || !Number.isFinite(f.maxX) || !Number.isFinite(f.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (f.maxX - f.minX < 1e-6 && (f.maxX = f.minX + 1), f.maxY - f.minY < 1e-6 && (f.maxY = f.minY + 1), f);
}
const Fe = 1e3;
function mt(f) {
  return f / 25.4 * Fe;
}
function Rt(f, t, e) {
  const a = f - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Ut(f, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${f}" height="${t}" viewBox="0 0 ${f} ${t}">
  <rect width="${f}" height="${t}" fill="white"/>
</svg>`.trim();
}
function _t(f, t = 1e-4) {
  const e = Math.round(f.x / t) * t, a = Math.round(f.y / t) * t;
  return `${e.toFixed(4)},${a.toFixed(4)}`;
}
function Ht(f) {
  let t = 0;
  const e = f.length;
  for (let a = 0; a < e; a++) {
    const l = f[a], s = f[(a + 1) % e];
    t += l.x * s.y - s.x * l.y;
  }
  return 0.5 * t;
}
function Lt(f, t, e) {
  if (!f.length) return "";
  const a = (i) => ({
    x: (i.x - t.minX) * e,
    y: (t.maxY - i.y) * e
  }), l = a(f[0]), s = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let i = 1; i < f.length; i++) {
    const n = a(f[i]);
    s.push(`L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`);
  }
  return s.push("Z"), s.join(" ");
}
function Ne(f) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (g, b) => {
    const m = _t(g), u = _t(b);
    t.has(m) || t.set(m, []), t.has(u) || t.set(u, []), t.get(m).push(b), t.get(u).push(g), e.has(m) || e.set(m, g), e.has(u) || e.set(u, b);
  };
  for (const g of f) a(g.start, g.end);
  const l = /* @__PURE__ */ new Set(), s = (g, b) => {
    const m = _t(g), u = _t(b);
    return m < u ? `${m}|${u}` : `${u}|${m}`;
  }, i = [];
  for (const [g, b] of t.entries()) {
    const m = e.get(g);
    for (const u of b) {
      const d = s(m, u);
      if (l.has(d)) continue;
      const y = [m];
      let o = m, _ = u;
      l.add(d);
      for (let p = 0; p < 1e5; p++) {
        y.push(_);
        const w = _t(_), M = t.get(w) ?? [];
        if (M.length === 0) break;
        let k = null;
        for (const R of M) {
          if (_t(R) === _t(o) && M.length > 1) continue;
          const O = s(_, R);
          if (!l.has(O)) {
            k = R, l.add(O);
            break;
          }
        }
        if (k || (k = M[0]), o = _, _ = k, _t(_) === _t(m))
          break;
      }
      y.length >= 3 && i.push(y);
    }
  }
  i.sort((g, b) => Math.abs(Ht(b)) - Math.abs(Ht(g)));
  const n = [], h = /* @__PURE__ */ new Set();
  for (const g of i) {
    const b = g.map((m) => _t(m)).join(";");
    h.has(b) || (h.add(b), n.push(g));
  }
  return n;
}
function Kt(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = mt(1), n = [];
  for (const h of f.regions)
    for (const g of h.loops)
      n.push(Lt(g, t, i));
  if (n.length === 0 && f.tracks.length) {
    const h = Ne(f.tracks);
    if (h.length) {
      const g = h[0];
      n.push(Lt(g, t, i));
      for (let b = 1; b < h.length; b++)
        n.push(Lt(h[b], t, i));
    }
  }
  return n.length === 0 ? Ut(l, s) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  <rect x="0" y="0" width="${l}" height="${s}" fill="black"/>
  <path d="${n.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function oe(f) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const s of f.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), a = Math.max(a, i.x), l = Math.max(l, i.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function De(f, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const g of f.regions) {
    const b = oe(g), m = (b.maxX - b.minX) * (b.maxY - b.minY);
    g.polarity === "clear" ? l = Math.max(l, m) : a = Math.max(a, m);
  }
  const s = f.tracks.filter((g) => g.polarity !== "clear").length + f.flashes.filter((g) => g.polarity !== "clear").length + f.regions.filter((g) => g.polarity !== "clear").length, i = f.tracks.filter((g) => g.polarity === "clear").length + f.flashes.filter((g) => g.polarity === "clear").length + f.regions.filter((g) => g.polarity === "clear").length, n = l > e * 0.85;
  return !(a > e * 0.85 || !n || !(i > s * 2));
}
function Jt(f, t, e, a) {
  const l = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(mt(l))), n = Math.max(1, Math.round(mt(s))), h = mt(1), g = De(f, t), b = g ? "white" : "black", m = (k, R) => {
    const O = k - t.minX, B = t.maxY - R;
    return { x: O * h, y: B * h };
  }, u = (k, R) => {
    if (k.kind === "track") {
      const O = m(k.start.x, k.start.y), B = m(k.end.x, k.end.y), j = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, I = Math.max(1, j * h);
      return `<line x1="${O.x.toFixed(2)}" y1="${O.y.toFixed(2)}" x2="${B.x.toFixed(2)}" y2="${B.y.toFixed(2)}" stroke-width="${I.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${R}" stroke="${R}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const O = m(k.position.x, k.position.y), B = k.widthMm ?? k.diameterMm ?? 0.8, j = k.heightMm ?? k.diameterMm ?? 0.8, I = Math.max(0.01, Number.isFinite(B) ? B : 0.8) * h, Y = Math.max(0.01, Number.isFinite(j) ? j : 0.8) * h, Q = O.x - I / 2, S = O.y - Y / 2;
      if (k.shape === "R" || k.shape === "O") {
        const c = k.shape === "O" ? Math.min(I, Y) * 0.5 : 0;
        return `<rect x="${Q.toFixed(2)}" y="${S.toFixed(2)}" width="${I.toFixed(2)}" height="${Y.toFixed(2)}" rx="${c.toFixed(2)}" ry="${c.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
      }
      if (Number.isFinite(k.cornerMm) && (k.cornerMm ?? 0) > 0) {
        const c = Math.max(0, k.cornerMm * h);
        return `<rect x="${Q.toFixed(2)}" y="${S.toFixed(2)}" width="${I.toFixed(2)}" height="${Y.toFixed(2)}" rx="${c.toFixed(2)}" ry="${c.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
      }
      const L = Math.max(1, Math.max(I, Y) / 2);
      return `<circle cx="${O.x.toFixed(2)}" cy="${O.y.toFixed(2)}" r="${L.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
    }
    if (k.kind === "region") {
      const O = k.loops.map((B) => {
        if (!B.length) return "";
        const j = m(B[0].x, B[0].y), I = [`M ${j.x.toFixed(2)} ${j.y.toFixed(2)}`];
        for (let Y = 1; Y < B.length; Y++) {
          const Q = m(B[Y].x, B[Y].y);
          I.push(`L ${Q.x.toFixed(2)} ${Q.y.toFixed(2)}`);
        }
        return I.push("Z"), I.join(" ");
      }).join(" ");
      return O.trim() ? `<path d="${O}" fill-rule="evenodd" fill="${R}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  for (const k of f.ops) {
    const R = k.polarity === "clear" ? "black" : "white", O = u(k, R);
    O && d.push(O);
  }
  console.log("[polarity counts]", {
    tracksClear: f.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: f.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: g
  });
  const y = (t.maxX - t.minX) * (t.maxY - t.minY);
  let o = 0, _ = 0;
  for (const k of f.regions) {
    const R = oe(k), O = (R.maxX - R.minX) * (R.maxY - R.minY);
    k.polarity === "clear" ? _ = Math.max(_, O) : o = Math.max(o, O);
  }
  const p = f.tracks.filter((k) => k.polarity !== "clear").length + f.flashes.filter((k) => k.polarity !== "clear").length + f.regions.filter((k) => k.polarity !== "clear").length, w = f.tracks.filter((k) => k.polarity === "clear").length + f.flashes.filter((k) => k.polarity === "clear").length + f.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: p,
    clearCount: w,
    largestDarkRegionArea: o,
    largestClearRegionArea: _,
    boardArea: y,
    negative: g
  });
  const M = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  <defs>
    <mask id="${M}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${n}" fill="${b}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${n}" fill="${e}" opacity="${a}" mask="url(#${M})" />
</svg>`.trim();
}
function Qt(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = Math.max(1e-6, mt(1)), n = "rgba(255,255,255,0.95)", h = "rgba(255,255,255,0.95)", g = f.tracks.map((u) => {
    const d = Rt(u.start.x, u.start.y, t), y = Rt(u.end.x, u.end.y, t), o = Number.isFinite(u.width) ? u.width : 0.15, _ = Math.max(1, o * i);
    return `<line x1="${(d.x * i).toFixed(2)}" y1="${(d.y * i).toFixed(2)}" x2="${(y.x * i).toFixed(2)}" y2="${(y.y * i).toFixed(2)}" stroke="${n}" stroke-width="${_.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = f.flashes.map((u) => {
    const d = Rt(u.position.x, u.position.y, t), y = d.x * i, o = d.y * i, _ = u.widthMm ?? u.diameterMm ?? 0.6, p = u.heightMm ?? u.diameterMm ?? 0.6;
    if (u.shape === "R" || u.shape === "O") {
      const M = _ * i, k = p * i, R = y - M / 2, O = o - k / 2, B = u.shape === "O" ? Math.min(M, k) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${O.toFixed(2)}" width="${M.toFixed(2)}" height="${k.toFixed(2)}" rx="${B.toFixed(2)}" fill="${h}" />`;
    }
    const w = (u.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${y.toFixed(2)}" cy="${o.toFixed(2)}" r="${Math.max(1, w).toFixed(2)}" fill="${h}" />`;
  }), m = f.regions.map((u) => {
    const d = u.loops.map((y) => {
      if (!y.length) return "";
      const o = Rt(y[0].x, y[0].y, t), _ = [`M ${(o.x * i).toFixed(2)} ${(o.y * i).toFixed(2)}`];
      for (let p = 1; p < y.length; p++) {
        const w = Rt(y[p].x, y[p].y, t);
        _.push(`L ${(w.x * i).toFixed(2)} ${(w.y * i).toFixed(2)}`);
      }
      return _.push("Z"), _.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${h}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${g.join(`
  `)}
  ${b.join(`
  `)}
  ${m.join(`
  `)}
</svg>`.trim();
}
function Le(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.round(mt(e)), s = Math.round(mt(a)), i = mt(1), n = f.map((h) => {
    const g = Rt(h.x, h.y, t), b = g.x * i, m = g.y * i, u = (h.diameter || 0.6) * i / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${m.toFixed(2)}" r="${Math.max(1, u).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${n.join(`
  `)}
</svg>`.trim();
}
async function le(f) {
  const t = Object.keys(f).filter((r) => !!r), e = Ae(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (r) => {
    if (!r) return null;
    const D = f[r];
    return D ? a.decode(D) : null;
  }, s = await l(e.top_copper), i = await l(e.bottom_copper), n = await l(e.outline), h = await l(e.drills), g = await l(e.top_silk), b = await l(e.bottom_silk), m = s ? Ct(e.top_copper || "top", s) : null, u = i ? Ct(e.bottom_copper || "bot", i) : null, d = n ? Ct(e.outline || "outline", n) : null, y = h ? Ie(e.drills || "drills", h) : null, o = y ? y.holes.map((r) => ({ x: r.x, y: r.y, diameter: r.diameter })) : [], _ = g ? Ct(e.top_silk || "top_silk", g) : null, p = b ? Ct(e.bottom_silk || "bot_silk", b) : null, w = m ? vt(xt(m)) : null, M = u ? vt(xt(u)) : null, k = d ? vt(xt(d)) : null, R = o.length ? vt(Pe(o)) : null, O = _ ? vt(xt(_)) : null, B = p ? vt(xt(p)) : null, j = (k && It(k) ? k : null) || (w && It(w) ? w : null) || (M && It(M) ? M : null) || (R && It(R) ? R : null), I = j ? j.maxX - j.minX : 1, Y = w ? Mt(w.maxX - w.minX, I) : 1, Q = M ? Mt(M.maxX - M.minX, I) : 1, S = k ? Mt(k.maxX - k.minX, I) : 1, L = R ? Mt(R.maxX - R.minX, I) : 1, c = O ? Mt(O.maxX - O.minX, I) : 1, $ = B ? Mt(B.maxX - B.minX, I) : 1, tt = m ? Tt(m, Y) : null, X = u ? Tt(u, Q) : null, it = d ? Tt(d, S) : null, Z = o.length ? Oe(o, L) : [], rt = _ ? Tt(_, c) : null, P = p ? Tt(p, $) : null;
  let C = null;
  if (it) {
    const r = vt(xt(it));
    It(r) && (C = r);
  }
  if (!C) {
    let r = jt();
    tt && (r = qt(r, xt(tt))), X && (r = qt(r, xt(X))), r = vt(r), C = r;
  }
  const z = vt(C), T = z.maxX - z.minX, N = z.maxY - z.minY, K = {
    board: {
      width_in: T / 25.4,
      height_in: N / 25.4,
      mm_bounds: {
        min_x_mm: z.minX,
        min_y_mm: z.minY,
        max_x_mm: z.maxX,
        max_y_mm: z.maxY
      }
    }
  }, nt = Math.max(1, Math.round(mt(T))), V = Math.max(1, Math.round(mt(N))), H = [], st = (r) => {
    const D = Be(r);
    return H.push(D), D;
  }, at = it ? Kt(it, z) : Ut(nt, V), ut = it ? Kt(it, z) : Ut(nt, V), lt = {
    top_board_mask: st(at),
    bottom_board_mask: st(ut)
  };
  return tt && (lt.top_copper = st(Jt(tt, z, "#fbbf24", 1))), X && (lt.bottom_copper = st(Jt(X, z, "#38bdf8", 1))), Z.length && (lt.drills = st(Le(Z, z))), rt && (lt.top_silk = st(Qt(rt, z))), P && (lt.bottom_silk = st(Qt(P, z))), {
    boardGeom: K,
    layers: lt,
    revoke: () => H.forEach((r) => URL.revokeObjectURL(r))
  };
}
async function sr(f) {
  const t = f instanceof Uint8Array ? f.byteOffset === 0 && f.byteLength === f.buffer.byteLength ? f.buffer : f.slice().buffer : f instanceof ArrayBuffer ? f : await f.arrayBuffer(), { files: e, archiveType: a } = await ae(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await le(e);
}
async function ar(f, t) {
  const { files: e } = await ae(f, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await le(e);
}
function $t(f, t) {
  const [
    e,
    a,
    l,
    s,
    i,
    n,
    h,
    g,
    b
  ] = f, [
    m,
    u,
    d,
    y,
    o,
    _,
    p,
    w,
    M
  ] = t;
  return [
    e * m + a * y + l * p,
    e * u + a * o + l * w,
    e * d + a * _ + l * M,
    s * m + i * y + n * p,
    s * u + i * o + n * w,
    s * d + i * _ + n * M,
    h * m + g * y + b * p,
    h * u + g * o + b * w,
    h * d + g * _ + b * M
  ];
}
function te(f, t) {
  return [1, 0, f, 0, 1, t, 0, 0, 1];
}
function $e(f, t) {
  return [f, 0, 0, 0, t, 0, 0, 0, 1];
}
function Ue(f) {
  const t = Math.cos(f), e = Math.sin(f);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function ee(f, t) {
  const e = f[0] * t.x + f[1] * t.y + f[2], a = f[3] * t.x + f[4] * t.y + f[5], l = f[6] * t.x + f[7] * t.y + f[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function We(f) {
  const t = f[0], e = f[1], a = f[2], l = f[3], s = f[4], i = f[5], n = t * s - e * l;
  if (Math.abs(n) < 1e-12) throw new Error("Non-invertible transform");
  const h = 1 / n, g = s * h, b = -e * h, m = -l * h, u = t * h, d = -(g * a + b * i), y = -(m * a + u * i);
  return [g, b, d, m, u, y, 0, 0, 1];
}
class je {
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
      return ee(this.worldToScreenMat, e);
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
      return ee(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: s, mirrorX: i, mirrorY: n } = this.camera, h = { x: t / 2, y: e / 2 }, g = n ? -1 : 1, b = i ? -1 : 1, m = te(-a.x, -a.y), u = Ue(s), d = $e(l * b, l * g), y = te(h.x, h.y), o = $t(y, $t(d, $t(u, m)));
    this.worldToScreenMat = o, this.screenToWorldMat = We(o);
  }
}
class Xe {
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
let Ye = class {
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
class Ze {
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
    let s = this.cells.get(l);
    s || (s = /* @__PURE__ */ new Set(), this.cells.set(l, s)), s.add(t);
  }
  remove(t, e, a) {
    const { key: l } = this.cellCoord(e, a), s = this.cells.get(l);
    s && (s.delete(t), s.size === 0 && this.cells.delete(l));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, a) {
    const { cx: l, cy: s } = this.cellCoord(t, e), i = Math.ceil(a / this.cellSize_mm), n = [];
    for (let h = -i; h <= i; h++)
      for (let g = -i; g <= i; g++) {
        const b = `${l + h},${s + g}`, m = this.cells.get(b);
        if (m)
          for (const u of m) n.push(u);
      }
    return n;
  }
}
class Ge {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new Ze(5), this.dirtyList = !0, this.listCache = [];
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
    const l = this.index.queryRadius(t, e, a), s = [];
    for (const i of l) {
      const n = this.byId.get(i);
      n && s.push(n);
    }
    return s;
  }
}
class Ve {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, a, l = 10) {
    const s = t.screenToBoard({ x: e, y: a }), i = t.xform.getCamera().zoom, n = l / i, h = this.store.queryNear(s.x, s.y, n);
    let g = null;
    for (const b of h) {
      const m = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), u = m.x - e, d = m.y - a, y = Math.sqrt(u * u + d * d);
      y <= l && (!g || y < g.distance_px) && (g = { id: b.id, marker: b, distance_px: y });
    }
    return g;
  }
}
class qe {
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
    for (const s of l) s(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class ce {
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
class He {
  constructor(t, e) {
    this.passes = [], this.overlays = new Ye(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Ge(), this.markerPicker = new Ve(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new qe(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const a = t.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context");
    this.ctx = a;
    const l = t.getBoundingClientRect(), s = {
      width_px: l.width,
      height_px: l.height
    };
    this.xform = new je(e, s), this.visibility = new ce(), this.scheduler = new Xe(() => this.render()), this.overlayApi = {
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
    const s = {
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
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), s = this.markerPicker.pick(l, e, a, 10);
    this.setHoverMarker(s?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), s = this.markerPicker.pick(l, e, a, 10);
    if (s) {
      this.selectMarker(s.id);
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
function lr(f, t, e, a) {
  return {
    id: `gerber:${f}`,
    order: t,
    enabled: (l) => l.visibility.gerber[e],
    draw: (l) => {
      const s = l.ctx, i = l.xform.getWorldToScreenMatrix();
      s.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), a(s);
    }
  };
}
class Ke {
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
function Je(f, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = f.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
      l.sort((i, n) => i.zIndex - n.zIndex);
      const s = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const i of l)
        e.ctx.save(), i.draw(e.ctx, s), e.ctx.restore();
    }
  };
}
let Qe = class {
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
        i.x < -10 || i.x > t.viewport.width_px + 10 || i.y < -10 || i.y > t.viewport.height_px + 10 || this.drawMarker(e, i, s, a);
      }
    }
  }
  drawMarker(t, e, a, l) {
    const s = Math.max(3, Math.min(8, l / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, s, 0, Math.PI * 2), a.type) {
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
function tr(f) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => f.draw(t)
  };
}
class er {
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
function rr(f, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const a = t();
      a && f.draw(e, a);
    }
  };
}
function dr(f, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, a = t.showDownloadButton !== !1;
  f.innerHTML = `
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
  const l = f.firstElementChild, s = Z(l, "#board-viewport"), i = Z(l, "#render-canvas"), n = Z(l, "#grid-toggle"), h = Z(l, "#grid-units"), g = Z(l, "#fit-btn"), b = a ? Z(l, "#download-btn") : null, m = Array.from(l.querySelectorAll('input[name="side"]')), u = new He(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), d = new ce();
  d.subscribe(() => {
    u.requestRender("visibility-change");
  });
  const y = new Ke(), o = new Qe(), _ = new er();
  let p = null;
  function w() {
    const z = s.getBoundingClientRect(), T = window.devicePixelRatio || 1;
    i.width = z.width * T, i.height = z.height * T, i.style.width = `${z.width}px`, i.style.height = `${z.height}px`, u.requestRender("resize");
  }
  const M = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (z, T) => {
      const K = T.view.zoom, nt = h.value, V = nt === "mm" ? 1 : 2.54, H = nt === "mm" ? 10 : 25.4, st = V * K, at = H * K;
      if (st < 2) return;
      const ut = i.width / (window.devicePixelRatio || 1), lt = i.height / (window.devicePixelRatio || 1), r = T.screenToBoard({ x: 0, y: 0 }), D = T.screenToBoard({ x: ut, y: lt });
      z.setTransform(1, 0, 0, 1, 0, 0), z.strokeStyle = "rgba(59, 130, 246, 0.4)", z.lineWidth = 1, z.beginPath();
      const F = Math.floor(r.x / V) * V, x = Math.floor(r.y / V) * V;
      for (let v = F; v <= D.x; v += V) {
        const A = T.boardToScreen({ x: v, y: 0 }).x;
        z.moveTo(A, 0), z.lineTo(A, i.height);
      }
      for (let v = x; v <= D.y; v += V) {
        const A = T.boardToScreen({ x: 0, y: v }).y;
        z.moveTo(0, A), z.lineTo(i.width, A);
      }
      if (z.stroke(), at >= 8) {
        z.strokeStyle = "rgba(59, 130, 246, 0.7)", z.lineWidth = 1.5, z.beginPath();
        const v = Math.floor(r.x / H) * H, A = Math.floor(r.y / H) * H;
        for (let U = v; U <= D.x; U += H) {
          const W = T.boardToScreen({ x: U, y: 0 }).x;
          z.moveTo(W, 0), z.lineTo(W, i.height);
        }
        for (let U = A; U <= D.y; U += H) {
          const W = T.boardToScreen({ x: 0, y: U }).y;
          z.moveTo(0, W), z.lineTo(i.width, W);
        }
        z.stroke();
      }
    }
  };
  y.add(M), d.setOverlayVisibility("grid", !1), d.setMarkersVisibility(!1), u.addPass(Je(y, u.getOverlayApi())), u.addPass(tr(o)), u.addPass(rr(_, () => p));
  let k = null, R = {}, O = "top", B = !1;
  function j(z, T, N) {
    if (!N) return null;
    const K = new Image();
    return K.src = N, K.addEventListener("load", () => {
      u.requestRender(`image-loaded-${z}`);
    }), {
      id: z,
      order: T,
      enabled: (nt) => !!k?.board?.mm_bounds,
      draw: (nt) => {
        if (!K.complete || !k?.board?.mm_bounds) return;
        const V = nt.ctx, H = nt.xform.getWorldToScreenMatrix();
        V.setTransform(H[0], H[3], H[1], H[4], H[2], H[5]);
        let st;
        (R.top_board_mask || R.bottom_board_mask) && (st = 0.5);
        const at = Y(V, k, st);
        S(V, at, (ut) => {
          if (!k?.board?.mm_bounds) return;
          const lt = k.board.mm_bounds, r = lt.max_x_mm - lt.min_x_mm, D = lt.max_y_mm - lt.min_y_mm;
          ut.drawImage(K, lt.min_x_mm, lt.min_y_mm, r, D);
        });
      }
    };
  }
  function I(z, T) {
    return {
      id: z,
      order: T,
      enabled: (N) => !!k?.board?.mm_bounds,
      draw: (N) => {
        if (!k?.board?.mm_bounds) return;
        const K = N.ctx, nt = N.xform.getWorldToScreenMatrix();
        if (K.setTransform(nt[0], nt[3], nt[1], nt[4], nt[2], nt[5]), R.top_board_mask || R.bottom_board_mask) {
          const V = new Image();
          V.src = R.top_board_mask || R.bottom_board_mask || "", V.onload = () => {
            if (!k?.board?.mm_bounds) return;
            const H = k.board.mm_bounds, st = H.max_x_mm - H.min_x_mm, at = H.max_y_mm - H.min_y_mm;
            K.fillStyle = "#1a5f1a", K.fillRect(H.min_x_mm, H.min_y_mm, st, at), K.globalCompositeOperation = "destination-in", K.drawImage(V, H.min_x_mm, H.min_y_mm, st, at), K.globalCompositeOperation = "source-over", K.strokeStyle = "#0d3d0d", K.lineWidth = 0.1, K.strokeRect(H.min_x_mm, H.min_y_mm, st, at);
          }, V.complete && V.onload();
        } else {
          const V = k.board.mm_bounds, H = V.max_x_mm - V.min_x_mm, st = V.max_y_mm - V.min_y_mm;
          K.fillStyle = "#1a5f1a", K.fillRect(V.min_x_mm, V.min_y_mm, H, st), K.strokeStyle = "#0d3d0d", K.lineWidth = 0.1, K.strokeRect(V.min_x_mm, V.min_y_mm, H, st);
        }
      }
    };
  }
  function Y(z, T, N) {
    if (!T?.board?.mm_bounds) return new Path2D();
    const K = T.board.mm_bounds, nt = K.min_x_mm, V = K.min_y_mm, H = K.max_x_mm - K.min_x_mm, st = K.max_y_mm - K.min_y_mm;
    return Q(nt, V, H, st, N || 0);
  }
  function Q(z, T, N, K, nt) {
    const V = new Path2D(), H = Math.max(0, Math.min(nt, Math.min(N, K) / 2));
    return V.moveTo(z + H, T), V.lineTo(z + N - H, T), V.quadraticCurveTo(z + N, T, z + N, T + H), V.lineTo(z + N, T + K - H), V.quadraticCurveTo(z + N, T + K, z + N - H, T + K), V.lineTo(z + H, T + K), V.quadraticCurveTo(z, T + K, z, T + K - H), V.lineTo(z, T + H), V.quadraticCurveTo(z, T, z + H, T), V.closePath(), V;
  }
  function S(z, T, N) {
    z.save(), z.clip(T), N(z), z.restore();
  }
  function L() {
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
    ].forEach((N) => {
      u.removePass(N);
    }), !k) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: O === "bottom" ? R.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: O === "bottom" ? R.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: O === "bottom" ? R.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: O === "top" ? R.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: O === "top" ? R.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: O === "top" ? R.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: R.drills },
      { id: "layer:vias", order: 45, url: R.vias }
    ].forEach((N) => {
      let K;
      N.useFR4 ? K = I(N.id, N.order) : N.url && (K = j(N.id, N.order, N.url)), K && u.addPass(K);
    }), u.requestRender("side-switch"), setTimeout(() => u.requestRender("side-switch-delayed"), 50);
  }
  function c(z = 0.08) {
    if (!k?.board?.mm_bounds) return;
    const T = s.getBoundingClientRect(), N = k.board.mm_bounds, K = N.max_x_mm - N.min_x_mm, nt = N.max_y_mm - N.min_y_mm, V = T.width * (1 - 2 * z), H = T.height * (1 - 2 * z), st = V / K, at = H / nt, ut = Math.min(st, at), lt = (N.min_x_mm + N.max_x_mm) / 2, r = (N.min_y_mm + N.max_y_mm) / 2;
    u.setCamera({
      center_mm: { x: lt, y: r },
      zoom: ut
    });
  }
  i.addEventListener("wheel", (z) => {
    z.preventDefault(), B = !0;
    const T = i.getBoundingClientRect(), N = z.clientX - T.left, K = z.clientY - T.top, nt = u.getCamera(), V = z.deltaY < 0 ? 1.1 : 0.9, H = Math.max(0.2, Math.min(50, nt.zoom * V)), st = u.screenToBoard(N, K);
    u.setCamera({ zoom: H });
    const at = u.screenToBoard(N, K), ut = st.x - at.x, lt = st.y - at.y, r = {
      x: nt.center_mm.x + ut,
      y: nt.center_mm.y + lt
    };
    u.setCamera({
      center_mm: r,
      zoom: H
    });
  }, { passive: !1 });
  let $ = !1, tt = null;
  i.addEventListener("mousedown", (z) => {
    if (z.button !== 0) return;
    z.preventDefault(), B = !0, $ = !0;
    const T = i.getBoundingClientRect();
    tt = u.screenToBoard(
      z.clientX - T.left,
      z.clientY - T.top
    );
  });
  const X = (z) => {
    if (!$ || !tt) return;
    const T = i.getBoundingClientRect(), N = u.screenToBoard(
      z.clientX - T.left,
      z.clientY - T.top
    ), K = tt.x - N.x, nt = tt.y - N.y, V = u.getCamera();
    u.setCamera({
      center_mm: {
        x: V.center_mm.x + K,
        y: V.center_mm.y + nt
      }
    });
  }, it = () => {
    $ = !1, tt = null;
  };
  window.addEventListener("mousemove", X), window.addEventListener("mouseup", it), n.addEventListener("change", () => {
    const z = n.checked;
    d.setOverlayVisibility("grid", z), M.visible = z, u.requestRender("grid-toggle");
  }), h.addEventListener("change", () => {
    d.isOverlayVisible("grid") && u.requestRender("grid-units");
  }), g.addEventListener("click", () => c(0.08)), b?.addEventListener("click", () => t.onDownload?.()), m.forEach((z) => {
    z.addEventListener("change", () => {
      O = m.find((T) => T.checked)?.value || "top", L();
    });
  }), window.addEventListener("resize", () => {
    w(), B || c(0.08);
  });
  function Z(z, T) {
    const N = z.querySelector(T);
    if (!N) throw new Error(`Missing required element: ${T}`);
    return N;
  }
  function rt(z) {
    k = z.boardGeom, R = z.layers, k?.board?.mm_bounds && u.setBoardBounds({
      minX_mm: k.board.mm_bounds.min_x_mm,
      minY_mm: k.board.mm_bounds.min_y_mm,
      maxX_mm: k.board.mm_bounds.max_x_mm,
      maxY_mm: k.board.mm_bounds.max_y_mm
    }), L(), w(), c(0.08);
  }
  function P(z) {
    O = z;
    const T = m.find((N) => N.value === z);
    T && (T.checked = !0), L();
  }
  function C() {
    window.removeEventListener("mousemove", X), window.removeEventListener("mouseup", it), f.innerHTML = "";
  }
  return w(), {
    setData: rt,
    setSideMode: P,
    fit: () => c(0.08),
    dispose: C,
    // Expose new render pipeline API
    viewer: u,
    visibility: d,
    overlayRegistry: y,
    markerRenderer: o,
    setSelection: (z) => {
      p = z, u.requestRender("selection-change");
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
      const T = {
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
      o.add(T), u.requestRender("marker-added");
    },
    addMarkers: (z) => {
      for (const T of z) {
        if (typeof T.x_mm != "number" || typeof T.y_mm != "number" || !isFinite(T.x_mm) || !isFinite(T.y_mm)) {
          console.warn(`Invalid marker coordinates for ${T.id}:`, {
            x_mm: T.x_mm,
            y_mm: T.y_mm,
            marker: T,
            keys: Object.keys(T)
          });
          continue;
        }
        const N = {
          id: T.id,
          position: { x: T.x_mm, y: T.y_mm },
          type: "custom",
          // Default type for DFM markers
          data: {
            ...T.data,
            severity: T.severity,
            layer: T.layer,
            radius_mm: T.radius_mm
          }
        };
        o.add(N);
      }
      u.requestRender("markers-added");
    },
    removeMarker: (z) => {
      o.remove(z), u.requestRender("marker-removed");
    }
  };
}
function hr(f, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const a = e.xform.getWorldToScreenMatrix(), l = f.getSortedVisible();
      for (const s of l)
        e.ctx.save(), s.drawInWorldSpace ? e.ctx.setTransform(a[0], a[3], a[1], a[4], a[2], a[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), s.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function ur() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (f, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      f.fillStyle = "red";
      for (const a of e)
        f.beginPath(), f.arc(a.x_mm, a.y_mm, 0.25, 0, Math.PI * 2), f.fill();
    }
  };
}
function fr(f) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const a = f();
      a && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(a.x_px + 12, a.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(a.text, a.x_px + 15, a.y_px - 5));
    }
  };
}
function mr(f = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const a = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let l = a.minX_mm; l <= a.maxX_mm; l += f)
        t.moveTo(l, a.minY_mm), t.lineTo(l, a.maxY_mm);
      for (let l = a.minY_mm; l <= a.maxY_mm; l += f)
        t.moveTo(a.minX_mm, l), t.lineTo(a.maxX_mm, l);
      t.stroke();
    }
  };
}
function pr(f) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, a) => {
      t += 16;
      const l = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + l * 0.7})`, e.beginPath(), e.arc(f.x_mm, f.y_mm, 0.5 + l * 0.5, 0, Math.PI * 2), e.fill(), a.requestRender("overlay:animate");
    }
  };
}
function ir(f, t) {
  const e = t.maxX_mm - t.minX_mm, a = t.maxY_mm - t.minY_mm;
  return f.x_mm < 0 || f.x_mm > e || f.y_mm < 0 || f.y_mm > a;
}
class nr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const a = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: l, height_px: s } = t.viewport, i = 4;
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
      const h = t.boardToScreen({ x: n.x_mm, y: n.y_mm }), g = h.x, b = h.y;
      if (g < -10 || b < -10 || g > l + 10 || b > s + 10) continue;
      const m = e?.boardBounds ? ir({ x_mm: n.x_mm, y_mm: n.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, n, e?.selectedId === n.id, e?.hoverId === n.id, m), t.ctx.beginPath(), t.ctx.arc(g, b, i, 0, Math.PI * 2), e?.selectedId === n.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, a, l, s) {
    if (a)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (l)
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
function yr(f, t) {
  const e = new nr(f);
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
  qe as Emitter,
  ft as GerberError,
  Ve as MarkerPicker,
  nr as MarkerRenderer,
  Ge as MarkerStore,
  Ye as OverlayRegistry,
  Xe as RenderScheduler,
  er as SelectionRenderer,
  Ze as UniformGridIndex,
  He as Viewer,
  je as ViewportTransform,
  ce as VisibilityManager,
  lr as createGerberPass,
  mr as createGridOverlay,
  dr as createIntegratedViewer,
  yr as createMarkerPass,
  hr as createOverlayPass,
  pr as createPulsingMarkerOverlay,
  rr as createSelectionPass,
  fr as createTooltipOverlay,
  ur as createViolationDotsOverlay,
  ke as detectGerberBundle,
  ar as renderGerbers,
  le as renderGerbersFiles,
  sr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
