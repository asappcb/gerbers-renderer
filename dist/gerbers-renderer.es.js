var Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function pe(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
function Ft(m) {
  throw new Error('Could not dynamically require "' + m + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ut = { exports: {} };
var qt;
function ye() {
  return qt || (qt = 1, (function(m, t) {
    (function(e) {
      m.exports = e();
    })(function() {
      return (function e(a, l, s) {
        function i(y, v) {
          if (!l[y]) {
            if (!a[y]) {
              var f = typeof Ft == "function" && Ft;
              if (!v && f) return f(y, !0);
              if (o) return o(y, !0);
              var _ = new Error("Cannot find module '" + y + "'");
              throw _.code = "MODULE_NOT_FOUND", _;
            }
            var d = l[y] = { exports: {} };
            a[y][0].call(d.exports, function(h) {
              var n = a[y][1][h];
              return i(n || h);
            }, d, d.exports, e, a, l, s);
          }
          return l[y].exports;
        }
        for (var o = typeof Ft == "function" && Ft, u = 0; u < s.length; u++) i(s[u]);
        return i;
      })({ 1: [function(e, a, l) {
        var s = e("./utils"), i = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(u) {
          for (var y, v, f, _, d, h, n, g = [], p = 0, x = u.length, M = x, k = s.getTypeOf(u) !== "string"; p < u.length; ) M = x - p, f = k ? (y = u[p++], v = p < x ? u[p++] : 0, p < x ? u[p++] : 0) : (y = u.charCodeAt(p++), v = p < x ? u.charCodeAt(p++) : 0, p < x ? u.charCodeAt(p++) : 0), _ = y >> 2, d = (3 & y) << 4 | v >> 4, h = 1 < M ? (15 & v) << 2 | f >> 6 : 64, n = 2 < M ? 63 & f : 64, g.push(o.charAt(_) + o.charAt(d) + o.charAt(h) + o.charAt(n));
          return g.join("");
        }, l.decode = function(u) {
          var y, v, f, _, d, h, n = 0, g = 0, p = "data:";
          if (u.substr(0, p.length) === p) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, M = 3 * (u = u.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (u.charAt(u.length - 1) === o.charAt(64) && M--, u.charAt(u.length - 2) === o.charAt(64) && M--, M % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = i.uint8array ? new Uint8Array(0 | M) : new Array(0 | M); n < u.length; ) y = o.indexOf(u.charAt(n++)) << 2 | (_ = o.indexOf(u.charAt(n++))) >> 4, v = (15 & _) << 4 | (d = o.indexOf(u.charAt(n++))) >> 2, f = (3 & d) << 6 | (h = o.indexOf(u.charAt(n++))), x[g++] = y, d !== 64 && (x[g++] = v), h !== 64 && (x[g++] = f);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var s = e("./external"), i = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), u = e("./stream/DataLengthProbe");
        function y(v, f, _, d, h) {
          this.compressedSize = v, this.uncompressedSize = f, this.crc32 = _, this.compression = d, this.compressedContent = h;
        }
        y.prototype = { getContentWorker: function() {
          var v = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new u("data_length")), f = this;
          return v.on("end", function() {
            if (this.streamInfo.data_length !== f.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), v;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, y.createWorkerFrom = function(v, f, _) {
          return v.pipe(new o()).pipe(new u("uncompressedSize")).pipe(f.compressWorker(_)).pipe(new u("compressedSize")).withStreamInfo("compression", f);
        }, a.exports = y;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, a, l) {
        var s = e("./stream/GenericWorker");
        l.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, l.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, a, l) {
        var s = e("./utils"), i = (function() {
          for (var o, u = [], y = 0; y < 256; y++) {
            o = y;
            for (var v = 0; v < 8; v++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            u[y] = o;
          }
          return u;
        })();
        a.exports = function(o, u) {
          return o !== void 0 && o.length ? s.getTypeOf(o) !== "string" ? (function(y, v, f, _) {
            var d = i, h = _ + f;
            y ^= -1;
            for (var n = _; n < h; n++) y = y >>> 8 ^ d[255 & (y ^ v[n])];
            return -1 ^ y;
          })(0 | u, o, o.length, 0) : (function(y, v, f, _) {
            var d = i, h = _ + f;
            y ^= -1;
            for (var n = _; n < h; n++) y = y >>> 8 ^ d[255 & (y ^ v.charCodeAt(n))];
            return -1 ^ y;
          })(0 | u, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), o = e("./utils"), u = e("./stream/GenericWorker"), y = s ? "uint8array" : "array";
        function v(f, _) {
          u.call(this, "FlateWorker/" + f), this._pako = null, this._pakoAction = f, this._pakoOptions = _, this.meta = {};
        }
        l.magic = "\b\0", o.inherits(v, u), v.prototype.processChunk = function(f) {
          this.meta = f.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(y, f.data), !1);
        }, v.prototype.flush = function() {
          u.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, v.prototype.cleanUp = function() {
          u.prototype.cleanUp.call(this), this._pako = null;
        }, v.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var f = this;
          this._pako.onData = function(_) {
            f.push({ data: _, meta: f.meta });
          };
        }, l.compressWorker = function(f) {
          return new v("Deflate", f);
        }, l.uncompressWorker = function() {
          return new v("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function s(d, h) {
          var n, g = "";
          for (n = 0; n < h; n++) g += String.fromCharCode(255 & d), d >>>= 8;
          return g;
        }
        function i(d, h, n, g, p, x) {
          var M, k, R = d.file, B = d.compression, P = x !== y.utf8encode, j = o.transformTo("string", x(R.name)), C = o.transformTo("string", y.utf8encode(R.name)), W = R.comment, J = o.transformTo("string", x(W)), S = o.transformTo("string", y.utf8encode(W)), N = C.length !== R.name.length, c = S.length !== W.length, $ = "", rt = "", G = "", nt = R.dir, q = R.date, it = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          h && !n || (it.crc32 = d.crc32, it.compressedSize = d.compressedSize, it.uncompressedSize = d.uncompressedSize);
          var F = 0;
          h && (F |= 8), P || !N && !c || (F |= 2048);
          var T = 0, tt = 0;
          nt && (T |= 16), p === "UNIX" ? (tt = 798, T |= (function(V, ct) {
            var dt = V;
            return V || (dt = ct ? 16893 : 33204), (65535 & dt) << 16;
          })(R.unixPermissions, nt)) : (tt = 20, T |= (function(V) {
            return 63 & (V || 0);
          })(R.dosPermissions)), M = q.getUTCHours(), M <<= 6, M |= q.getUTCMinutes(), M <<= 5, M |= q.getUTCSeconds() / 2, k = q.getUTCFullYear() - 1980, k <<= 4, k |= q.getUTCMonth() + 1, k <<= 5, k |= q.getUTCDate(), N && (rt = s(1, 1) + s(v(j), 4) + C, $ += "up" + s(rt.length, 2) + rt), c && (G = s(1, 1) + s(v(J), 4) + S, $ += "uc" + s(G.length, 2) + G);
          var K = "";
          return K += `
\0`, K += s(F, 2), K += B.magic, K += s(M, 2), K += s(k, 2), K += s(it.crc32, 4), K += s(it.compressedSize, 4), K += s(it.uncompressedSize, 4), K += s(j.length, 2), K += s($.length, 2), { fileRecord: f.LOCAL_FILE_HEADER + K + j + $, dirRecord: f.CENTRAL_FILE_HEADER + s(tt, 2) + K + s(J.length, 2) + "\0\0\0\0" + s(T, 4) + s(g, 4) + j + $ + J };
        }
        var o = e("../utils"), u = e("../stream/GenericWorker"), y = e("../utf8"), v = e("../crc32"), f = e("../signature");
        function _(d, h, n, g) {
          u.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = h, this.zipPlatform = n, this.encodeFileName = g, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(_, u), _.prototype.push = function(d) {
          var h = d.meta.percent || 0, n = this.entriesCount, g = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, u.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: n ? (h + 100 * (n - g - 1)) / n : 100 } }));
        }, _.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var h = this.streamFiles && !d.file.dir;
          if (h) {
            var n = i(d, h, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: n.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, _.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var h = this.streamFiles && !d.file.dir, n = i(d, h, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(n.dirRecord), h) this.push({ data: (function(g) {
            return f.DATA_DESCRIPTOR + s(g.crc32, 4) + s(g.compressedSize, 4) + s(g.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: n.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, _.prototype.flush = function() {
          for (var d = this.bytesWritten, h = 0; h < this.dirRecords.length; h++) this.push({ data: this.dirRecords[h], meta: { percent: 100 } });
          var n = this.bytesWritten - d, g = (function(p, x, M, k, R) {
            var B = o.transformTo("string", R(k));
            return f.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(p, 2) + s(p, 2) + s(x, 4) + s(M, 4) + s(B.length, 2) + B;
          })(this.dirRecords.length, n, d, this.zipComment, this.encodeFileName);
          this.push({ data: g, meta: { percent: 100 } });
        }, _.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, _.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var h = this;
          return d.on("data", function(n) {
            h.processChunk(n);
          }), d.on("end", function() {
            h.closedSource(h.previous.streamInfo), h._sources.length ? h.prepareNextSource() : h.end();
          }), d.on("error", function(n) {
            h.error(n);
          }), this;
        }, _.prototype.resume = function() {
          return !!u.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, _.prototype.error = function(d) {
          var h = this._sources;
          if (!u.prototype.error.call(this, d)) return !1;
          for (var n = 0; n < h.length; n++) try {
            h[n].error(d);
          } catch {
          }
          return !0;
        }, _.prototype.lock = function() {
          u.prototype.lock.call(this);
          for (var d = this._sources, h = 0; h < d.length; h++) d[h].lock();
        }, a.exports = _;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        l.generateWorker = function(o, u, y) {
          var v = new i(u.streamFiles, y, u.platform, u.encodeFileName), f = 0;
          try {
            o.forEach(function(_, d) {
              f++;
              var h = (function(x, M) {
                var k = x || M, R = s[k];
                if (!R) throw new Error(k + " is not a valid compression method !");
                return R;
              })(d.options.compression, u.compression), n = d.options.compressionOptions || u.compressionOptions || {}, g = d.dir, p = d.date;
              d._compressWorker(h, n).withStreamInfo("file", { name: _, dir: g, date: p, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(v);
            }), v.entriesCount = f;
          } catch (_) {
            v.error(_);
          }
          return v;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, a, l) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var i = new s();
            for (var o in this) typeof this[o] != "function" && (i[o] = this[o]);
            return i;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(i, o) {
          return new s().loadAsync(i, o);
        }, s.external = e("./external"), a.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, a, l) {
        var s = e("./utils"), i = e("./external"), o = e("./utf8"), u = e("./zipEntries"), y = e("./stream/Crc32Probe"), v = e("./nodejsUtils");
        function f(_) {
          return new i.Promise(function(d, h) {
            var n = _.decompressed.getContentWorker().pipe(new y());
            n.on("error", function(g) {
              h(g);
            }).on("end", function() {
              n.streamInfo.crc32 !== _.decompressed.crc32 ? h(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        a.exports = function(_, d) {
          var h = this;
          return d = s.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), v.isNode && v.isStream(_) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", _, !0, d.optimizedBinaryString, d.base64).then(function(n) {
            var g = new u(d);
            return g.load(n), g;
          }).then(function(n) {
            var g = [i.Promise.resolve(n)], p = n.files;
            if (d.checkCRC32) for (var x = 0; x < p.length; x++) g.push(f(p[x]));
            return i.Promise.all(g);
          }).then(function(n) {
            for (var g = n.shift(), p = g.files, x = 0; x < p.length; x++) {
              var M = p[x], k = M.fileNameStr, R = s.resolve(M.fileNameStr);
              h.file(R, M.decompressed, { binary: !0, optimizedBinaryString: !0, date: M.date, dir: M.dir, comment: M.fileCommentStr.length ? M.fileCommentStr : null, unixPermissions: M.unixPermissions, dosPermissions: M.dosPermissions, createFolders: d.createFolders }), M.dir || (h.file(R).unsafeOriginalName = k);
            }
            return g.zipComment.length && (h.comment = g.zipComment), h;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function o(u, y) {
          i.call(this, "Nodejs stream input adapter for " + u), this._upstreamEnded = !1, this._bindStream(y);
        }
        s.inherits(o, i), o.prototype._bindStream = function(u) {
          var y = this;
          (this._stream = u).pause(), u.on("data", function(v) {
            y.push({ data: v, meta: { percent: 0 } });
          }).on("error", function(v) {
            y.isPaused ? this.generatedError = v : y.error(v);
          }).on("end", function() {
            y.isPaused ? y._upstreamEnded = !0 : y.end();
          });
        }, o.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var s = e("readable-stream").Readable;
        function i(o, u, y) {
          s.call(this, u), this._helper = o;
          var v = this;
          o.on("data", function(f, _) {
            v.push(f) || v._helper.pause(), y && y(_);
          }).on("error", function(f) {
            v.emit("error", f);
          }).on("end", function() {
            v.push(null);
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
        function s(R, B, P) {
          var j, C = o.getTypeOf(B), W = o.extend(P || {}, v);
          W.date = W.date || /* @__PURE__ */ new Date(), W.compression !== null && (W.compression = W.compression.toUpperCase()), typeof W.unixPermissions == "string" && (W.unixPermissions = parseInt(W.unixPermissions, 8)), W.unixPermissions && 16384 & W.unixPermissions && (W.dir = !0), W.dosPermissions && 16 & W.dosPermissions && (W.dir = !0), W.dir && (R = p(R)), W.createFolders && (j = g(R)) && x.call(this, j, !0);
          var J = C === "string" && W.binary === !1 && W.base64 === !1;
          P && P.binary !== void 0 || (W.binary = !J), (B instanceof f && B.uncompressedSize === 0 || W.dir || !B || B.length === 0) && (W.base64 = !1, W.binary = !0, B = "", W.compression = "STORE", C = "string");
          var S = null;
          S = B instanceof f || B instanceof u ? B : h.isNode && h.isStream(B) ? new n(R, B) : o.prepareContent(R, B, W.binary, W.optimizedBinaryString, W.base64);
          var N = new _(R, S, W);
          this.files[R] = N;
        }
        var i = e("./utf8"), o = e("./utils"), u = e("./stream/GenericWorker"), y = e("./stream/StreamHelper"), v = e("./defaults"), f = e("./compressedObject"), _ = e("./zipObject"), d = e("./generate"), h = e("./nodejsUtils"), n = e("./nodejs/NodejsStreamInputAdapter"), g = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var B = R.lastIndexOf("/");
          return 0 < B ? R.substring(0, B) : "";
        }, p = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, x = function(R, B) {
          return B = B !== void 0 ? B : v.createFolders, R = p(R), this.files[R] || s.call(this, R, null, { dir: !0, createFolders: B }), this.files[R];
        };
        function M(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var B, P, j;
          for (B in this.files) j = this.files[B], (P = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && R(P, j);
        }, filter: function(R) {
          var B = [];
          return this.forEach(function(P, j) {
            R(P, j) && B.push(j);
          }), B;
        }, file: function(R, B, P) {
          if (arguments.length !== 1) return R = this.root + R, s.call(this, R, B, P), this;
          if (M(R)) {
            var j = R;
            return this.filter(function(W, J) {
              return !J.dir && j.test(W);
            });
          }
          var C = this.files[this.root + R];
          return C && !C.dir ? C : null;
        }, folder: function(R) {
          if (!R) return this;
          if (M(R)) return this.filter(function(C, W) {
            return W.dir && R.test(C);
          });
          var B = this.root + R, P = x.call(this, B), j = this.clone();
          return j.root = P.name, j;
        }, remove: function(R) {
          R = this.root + R;
          var B = this.files[R];
          if (B || (R.slice(-1) !== "/" && (R += "/"), B = this.files[R]), B && !B.dir) delete this.files[R];
          else for (var P = this.filter(function(C, W) {
            return W.name.slice(0, R.length) === R;
          }), j = 0; j < P.length; j++) delete this.files[P[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var B, P = {};
          try {
            if ((P = o.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = P.type.toLowerCase(), P.compression = P.compression.toUpperCase(), P.type === "binarystring" && (P.type = "string"), !P.type) throw new Error("No output type specified.");
            o.checkSupport(P.type), P.platform !== "darwin" && P.platform !== "freebsd" && P.platform !== "linux" && P.platform !== "sunos" || (P.platform = "UNIX"), P.platform === "win32" && (P.platform = "DOS");
            var j = P.comment || this.comment || "";
            B = d.generateWorker(this, P, j);
          } catch (C) {
            (B = new u("error")).error(C);
          }
          return new y(B, P.type || "string", P.mimeType);
        }, generateAsync: function(R, B) {
          return this.generateInternalStream(R).accumulate(B);
        }, generateNodeStream: function(R, B) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(B);
        } };
        a.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var s = e("./DataReader");
        function i(o) {
          s.call(this, o);
          for (var u = 0; u < this.data.length; u++) o[u] = 255 & o[u];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, i.prototype.lastIndexOfSignature = function(o) {
          for (var u = o.charCodeAt(0), y = o.charCodeAt(1), v = o.charCodeAt(2), f = o.charCodeAt(3), _ = this.length - 4; 0 <= _; --_) if (this.data[_] === u && this.data[_ + 1] === y && this.data[_ + 2] === v && this.data[_ + 3] === f) return _ - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(o) {
          var u = o.charCodeAt(0), y = o.charCodeAt(1), v = o.charCodeAt(2), f = o.charCodeAt(3), _ = this.readData(4);
          return u === _[0] && y === _[1] && v === _[2] && f === _[3];
        }, i.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, u;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, a, l) {
        var s = e("../utils");
        function i(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        i.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var u, y = 0;
          for (this.checkOffset(o), u = this.index + o - 1; u >= this.index; u--) y = (y << 8) + this.byteAt(u);
          return this.index += o, y;
        }, readString: function(o) {
          return s.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, a.exports = i;
      }, { "../utils": 32 }], 19: [function(e, a, l) {
        var s = e("./Uint8ArrayReader");
        function i(o) {
          s.call(this, o);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(o) {
          this.checkOffset(o);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, u;
        }, a.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, a, l) {
        var s = e("./DataReader");
        function i(o) {
          s.call(this, o);
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, i.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, i.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, i.prototype.readData = function(o) {
          this.checkOffset(o);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, u;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var s = e("./ArrayReader");
        function i(o) {
          s.call(this, o);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var u = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, u;
        }, a.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var s = e("../utils"), i = e("../support"), o = e("./ArrayReader"), u = e("./StringReader"), y = e("./NodeBufferReader"), v = e("./Uint8ArrayReader");
        a.exports = function(f) {
          var _ = s.getTypeOf(f);
          return s.checkSupport(_), _ !== "string" || i.uint8array ? _ === "nodebuffer" ? new y(f) : i.uint8array ? new v(s.transformTo("uint8array", f)) : new o(s.transformTo("array", f)) : new u(f);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../utils");
        function o(u) {
          s.call(this, "ConvertWorker to " + u), this.destType = u;
        }
        i.inherits(o, s), o.prototype.processChunk = function(u) {
          this.push({ data: i.transformTo(this.destType, u.data), meta: u.meta });
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function o() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, s), o.prototype.processChunk = function(u) {
          this.streamInfo.crc32 = i(u.data, this.streamInfo.crc32 || 0), this.push(u);
        }, a.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function o(u) {
          i.call(this, "DataLengthProbe for " + u), this.propName = u, this.withStreamInfo(u, 0);
        }
        s.inherits(o, i), o.prototype.processChunk = function(u) {
          if (u) {
            var y = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = y + u.data.length;
          }
          i.prototype.processChunk.call(this, u);
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function o(u) {
          i.call(this, "DataWorker");
          var y = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, u.then(function(v) {
            y.dataIsReady = !0, y.data = v, y.max = v && v.length || 0, y.type = s.getTypeOf(v), y.isPaused || y._tickAndRepeat();
          }, function(v) {
            y.error(v);
          });
        }
        s.inherits(o, i), o.prototype.cleanUp = function() {
          i.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var u = null, y = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              u = this.data.substring(this.index, y);
              break;
            case "uint8array":
              u = this.data.subarray(this.index, y);
              break;
            case "array":
            case "nodebuffer":
              u = this.data.slice(this.index, y);
          }
          return this.index = y, this.push({ data: u, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, a.exports = o;
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
        }, on: function(i, o) {
          return this._listeners[i].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(i, o) {
          if (this._listeners[i]) for (var u = 0; u < this._listeners[i].length; u++) this._listeners[i][u].call(this, o);
        }, pipe: function(i) {
          return i.registerPrevious(this);
        }, registerPrevious: function(i) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = i.streamInfo, this.mergeStreamInfo(), this.previous = i;
          var o = this;
          return i.on("data", function(u) {
            o.processChunk(u);
          }), i.on("end", function() {
            o.end();
          }), i.on("error", function(u) {
            o.error(u);
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
        }, withStreamInfo: function(i, o) {
          return this.extraStreamInfo[i] = o, this.mergeStreamInfo(), this;
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
        var s = e("../utils"), i = e("./ConvertWorker"), o = e("./GenericWorker"), u = e("../base64"), y = e("../support"), v = e("../external"), f = null;
        if (y.nodestream) try {
          f = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function _(h, n) {
          return new v.Promise(function(g, p) {
            var x = [], M = h._internalType, k = h._outputType, R = h._mimeType;
            h.on("data", function(B, P) {
              x.push(B), n && n(P);
            }).on("error", function(B) {
              x = [], p(B);
            }).on("end", function() {
              try {
                var B = (function(P, j, C) {
                  switch (P) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", j), C);
                    case "base64":
                      return u.encode(j);
                    default:
                      return s.transformTo(P, j);
                  }
                })(k, (function(P, j) {
                  var C, W = 0, J = null, S = 0;
                  for (C = 0; C < j.length; C++) S += j[C].length;
                  switch (P) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (J = new Uint8Array(S), C = 0; C < j.length; C++) J.set(j[C], W), W += j[C].length;
                      return J;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + P + "'");
                  }
                })(M, x), R);
                g(B);
              } catch (P) {
                p(P);
              }
              x = [];
            }).resume();
          });
        }
        function d(h, n, g) {
          var p = n;
          switch (n) {
            case "blob":
            case "arraybuffer":
              p = "uint8array";
              break;
            case "base64":
              p = "string";
          }
          try {
            this._internalType = p, this._outputType = n, this._mimeType = g, s.checkSupport(p), this._worker = h.pipe(new i(p)), h.lock();
          } catch (x) {
            this._worker = new o("error"), this._worker.error(x);
          }
        }
        d.prototype = { accumulate: function(h) {
          return _(this, h);
        }, on: function(h, n) {
          var g = this;
          return h === "data" ? this._worker.on(h, function(p) {
            n.call(g, p.data, p.meta);
          }) : this._worker.on(h, function() {
            s.delay(n, arguments, g);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(h) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new f(this, { objectMode: this._outputType !== "nodebuffer" }, h);
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
        for (var s = e("./utils"), i = e("./support"), o = e("./nodejsUtils"), u = e("./stream/GenericWorker"), y = new Array(256), v = 0; v < 256; v++) y[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        y[254] = y[254] = 1;
        function f() {
          u.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function _() {
          u.call(this, "utf-8 encode");
        }
        l.utf8encode = function(d) {
          return i.nodebuffer ? o.newBufferFrom(d, "utf-8") : (function(h) {
            var n, g, p, x, M, k = h.length, R = 0;
            for (x = 0; x < k; x++) (64512 & (g = h.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (p = h.charCodeAt(x + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (p - 56320), x++), R += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
            for (n = i.uint8array ? new Uint8Array(R) : new Array(R), x = M = 0; M < R; x++) (64512 & (g = h.charCodeAt(x))) == 55296 && x + 1 < k && (64512 & (p = h.charCodeAt(x + 1))) == 56320 && (g = 65536 + (g - 55296 << 10) + (p - 56320), x++), g < 128 ? n[M++] = g : (g < 2048 ? n[M++] = 192 | g >>> 6 : (g < 65536 ? n[M++] = 224 | g >>> 12 : (n[M++] = 240 | g >>> 18, n[M++] = 128 | g >>> 12 & 63), n[M++] = 128 | g >>> 6 & 63), n[M++] = 128 | 63 & g);
            return n;
          })(d);
        }, l.utf8decode = function(d) {
          return i.nodebuffer ? s.transformTo("nodebuffer", d).toString("utf-8") : (function(h) {
            var n, g, p, x, M = h.length, k = new Array(2 * M);
            for (n = g = 0; n < M; ) if ((p = h[n++]) < 128) k[g++] = p;
            else if (4 < (x = y[p])) k[g++] = 65533, n += x - 1;
            else {
              for (p &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && n < M; ) p = p << 6 | 63 & h[n++], x--;
              1 < x ? k[g++] = 65533 : p < 65536 ? k[g++] = p : (p -= 65536, k[g++] = 55296 | p >> 10 & 1023, k[g++] = 56320 | 1023 & p);
            }
            return k.length !== g && (k.subarray ? k = k.subarray(0, g) : k.length = g), s.applyFromCharCode(k);
          })(d = s.transformTo(i.uint8array ? "uint8array" : "array", d));
        }, s.inherits(f, u), f.prototype.processChunk = function(d) {
          var h = s.transformTo(i.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var n = h;
              (h = new Uint8Array(n.length + this.leftOver.length)).set(this.leftOver, 0), h.set(n, this.leftOver.length);
            } else h = this.leftOver.concat(h);
            this.leftOver = null;
          }
          var g = (function(x, M) {
            var k;
            for ((M = M || x.length) > x.length && (M = x.length), k = M - 1; 0 <= k && (192 & x[k]) == 128; ) k--;
            return k < 0 || k === 0 ? M : k + y[x[k]] > M ? k : M;
          })(h), p = h;
          g !== h.length && (i.uint8array ? (p = h.subarray(0, g), this.leftOver = h.subarray(g, h.length)) : (p = h.slice(0, g), this.leftOver = h.slice(g, h.length))), this.push({ data: l.utf8decode(p), meta: d.meta });
        }, f.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = f, s.inherits(_, u), _.prototype.processChunk = function(d) {
          this.push({ data: l.utf8encode(d.data), meta: d.meta });
        }, l.Utf8EncodeWorker = _;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var s = e("./support"), i = e("./base64"), o = e("./nodejsUtils"), u = e("./external");
        function y(n) {
          return n;
        }
        function v(n, g) {
          for (var p = 0; p < n.length; ++p) g[p] = 255 & n.charCodeAt(p);
          return g;
        }
        e("setimmediate"), l.newBlob = function(n, g) {
          l.checkSupport("blob");
          try {
            return new Blob([n], { type: g });
          } catch {
            try {
              var p = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return p.append(n), p.getBlob(g);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var f = { stringifyByChunk: function(n, g, p) {
          var x = [], M = 0, k = n.length;
          if (k <= p) return String.fromCharCode.apply(null, n);
          for (; M < k; ) g === "array" || g === "nodebuffer" ? x.push(String.fromCharCode.apply(null, n.slice(M, Math.min(M + p, k)))) : x.push(String.fromCharCode.apply(null, n.subarray(M, Math.min(M + p, k)))), M += p;
          return x.join("");
        }, stringifyByChar: function(n) {
          for (var g = "", p = 0; p < n.length; p++) g += String.fromCharCode(n[p]);
          return g;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return s.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return s.nodebuffer && String.fromCharCode.apply(null, o.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function _(n) {
          var g = 65536, p = l.getTypeOf(n), x = !0;
          if (p === "uint8array" ? x = f.applyCanBeUsed.uint8array : p === "nodebuffer" && (x = f.applyCanBeUsed.nodebuffer), x) for (; 1 < g; ) try {
            return f.stringifyByChunk(n, p, g);
          } catch {
            g = Math.floor(g / 2);
          }
          return f.stringifyByChar(n);
        }
        function d(n, g) {
          for (var p = 0; p < n.length; p++) g[p] = n[p];
          return g;
        }
        l.applyFromCharCode = _;
        var h = {};
        h.string = { string: y, array: function(n) {
          return v(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return h.string.uint8array(n).buffer;
        }, uint8array: function(n) {
          return v(n, new Uint8Array(n.length));
        }, nodebuffer: function(n) {
          return v(n, o.allocBuffer(n.length));
        } }, h.array = { string: _, array: y, arraybuffer: function(n) {
          return new Uint8Array(n).buffer;
        }, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return o.newBufferFrom(n);
        } }, h.arraybuffer = { string: function(n) {
          return _(new Uint8Array(n));
        }, array: function(n) {
          return d(new Uint8Array(n), new Array(n.byteLength));
        }, arraybuffer: y, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return o.newBufferFrom(new Uint8Array(n));
        } }, h.uint8array = { string: _, array: function(n) {
          return d(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return n.buffer;
        }, uint8array: y, nodebuffer: function(n) {
          return o.newBufferFrom(n);
        } }, h.nodebuffer = { string: _, array: function(n) {
          return d(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return h.nodebuffer.uint8array(n).buffer;
        }, uint8array: function(n) {
          return d(n, new Uint8Array(n.length));
        }, nodebuffer: y }, l.transformTo = function(n, g) {
          if (g = g || "", !n) return g;
          l.checkSupport(n);
          var p = l.getTypeOf(g);
          return h[p][n](g);
        }, l.resolve = function(n) {
          for (var g = n.split("/"), p = [], x = 0; x < g.length; x++) {
            var M = g[x];
            M === "." || M === "" && x !== 0 && x !== g.length - 1 || (M === ".." ? p.pop() : p.push(M));
          }
          return p.join("/");
        }, l.getTypeOf = function(n) {
          return typeof n == "string" ? "string" : Object.prototype.toString.call(n) === "[object Array]" ? "array" : s.nodebuffer && o.isBuffer(n) ? "nodebuffer" : s.uint8array && n instanceof Uint8Array ? "uint8array" : s.arraybuffer && n instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(n) {
          if (!s[n.toLowerCase()]) throw new Error(n + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(n) {
          var g, p, x = "";
          for (p = 0; p < (n || "").length; p++) x += "\\x" + ((g = n.charCodeAt(p)) < 16 ? "0" : "") + g.toString(16).toUpperCase();
          return x;
        }, l.delay = function(n, g, p) {
          setImmediate(function() {
            n.apply(p || null, g || []);
          });
        }, l.inherits = function(n, g) {
          function p() {
          }
          p.prototype = g.prototype, n.prototype = new p();
        }, l.extend = function() {
          var n, g, p = {};
          for (n = 0; n < arguments.length; n++) for (g in arguments[n]) Object.prototype.hasOwnProperty.call(arguments[n], g) && p[g] === void 0 && (p[g] = arguments[n][g]);
          return p;
        }, l.prepareContent = function(n, g, p, x, M) {
          return u.Promise.resolve(g).then(function(k) {
            return s.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new u.Promise(function(R, B) {
              var P = new FileReader();
              P.onload = function(j) {
                R(j.target.result);
              }, P.onerror = function(j) {
                B(j.target.error);
              }, P.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var R = l.getTypeOf(k);
            return R ? (R === "arraybuffer" ? k = l.transformTo("uint8array", k) : R === "string" && (M ? k = i.decode(k) : p && x !== !0 && (k = (function(B) {
              return v(B, s.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            })(k))), k) : u.Promise.reject(new Error("Can't read the data of '" + n + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), o = e("./signature"), u = e("./zipEntry"), y = e("./support");
        function v(f) {
          this.files = [], this.loadOptions = f;
        }
        v.prototype = { checkSignature: function(f) {
          if (!this.reader.readAndCheckSignature(f)) {
            this.reader.index -= 4;
            var _ = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(_) + ", expected " + i.pretty(f) + ")");
          }
        }, isSignature: function(f, _) {
          var d = this.reader.index;
          this.reader.setIndex(f);
          var h = this.reader.readString(4) === _;
          return this.reader.setIndex(d), h;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var f = this.reader.readData(this.zipCommentLength), _ = y.uint8array ? "uint8array" : "array", d = i.transformTo(_, f);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var f, _, d, h = this.zip64EndOfCentralSize - 44; 0 < h; ) f = this.reader.readInt(2), _ = this.reader.readInt(4), d = this.reader.readData(_), this.zip64ExtensibleData[f] = { id: f, length: _, value: d };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var f, _;
          for (f = 0; f < this.files.length; f++) _ = this.files[f], this.reader.setIndex(_.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), _.readLocalPart(this.reader), _.handleUTF8(), _.processAttributes();
        }, readCentralDir: function() {
          var f;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (f = new u({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(f);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var f = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (f < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(f);
          var _ = f;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (f = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(f), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var d = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);
          var h = _ - d;
          if (0 < h) this.isSignature(_, o.CENTRAL_FILE_HEADER) || (this.reader.zero = h);
          else if (h < 0) throw new Error("Corrupted zip: missing " + Math.abs(h) + " bytes.");
        }, prepareReader: function(f) {
          this.reader = s(f);
        }, load: function(f) {
          this.prepareReader(f), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = v;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), o = e("./compressedObject"), u = e("./crc32"), y = e("./utf8"), v = e("./compressions"), f = e("./support");
        function _(d, h) {
          this.options = d, this.loadOptions = h;
        }
        _.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var h, n;
          if (d.skip(22), this.fileNameLength = d.readInt(2), n = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(n), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((h = (function(g) {
            for (var p in v) if (Object.prototype.hasOwnProperty.call(v, p) && v[p].magic === g) return v[p];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, h, d.readData(this.compressedSize));
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
            var d = s(this.extraFields[1].value);
            this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var h, n, g, p = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < p; ) h = d.readInt(2), n = d.readInt(2), g = d.readData(n), this.extraFields[h] = { id: h, length: n, value: g };
          d.setIndex(p);
        }, handleUTF8: function() {
          var d = f.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = y.utf8decode(this.fileName), this.fileCommentStr = y.utf8decode(this.fileComment);
          else {
            var h = this.findExtraFieldUnicodePath();
            if (h !== null) this.fileNameStr = h;
            else {
              var n = i.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(n);
            }
            var g = this.findExtraFieldUnicodeComment();
            if (g !== null) this.fileCommentStr = g;
            else {
              var p = i.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(p);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var h = s(d.value);
            return h.readInt(1) !== 1 || u(this.fileName) !== h.readInt(4) ? null : y.utf8decode(h.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var h = s(d.value);
            return h.readInt(1) !== 1 || u(this.fileComment) !== h.readInt(4) ? null : y.utf8decode(h.readData(d.length - 5));
          }
          return null;
        } }, a.exports = _;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function s(h, n, g) {
          this.name = h, this.dir = g.dir, this.date = g.date, this.comment = g.comment, this.unixPermissions = g.unixPermissions, this.dosPermissions = g.dosPermissions, this._data = n, this._dataBinary = g.binary, this.options = { compression: g.compression, compressionOptions: g.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), u = e("./utf8"), y = e("./compressedObject"), v = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(h) {
          var n = null, g = "string";
          try {
            if (!h) throw new Error("No output type specified.");
            var p = (g = h.toLowerCase()) === "string" || g === "text";
            g !== "binarystring" && g !== "text" || (g = "string"), n = this._decompressWorker();
            var x = !this._dataBinary;
            x && !p && (n = n.pipe(new u.Utf8EncodeWorker())), !x && p && (n = n.pipe(new u.Utf8DecodeWorker()));
          } catch (M) {
            (n = new v("error")).error(M);
          }
          return new i(n, g, "");
        }, async: function(h, n) {
          return this.internalStream(h).accumulate(n);
        }, nodeStream: function(h, n) {
          return this.internalStream(h || "nodebuffer").toNodejsStream(n);
        }, _compressWorker: function(h, n) {
          if (this._data instanceof y && this._data.compression.magic === h.magic) return this._data.getCompressedWorker();
          var g = this._decompressWorker();
          return this._dataBinary || (g = g.pipe(new u.Utf8EncodeWorker())), y.createWorkerFrom(g, h, n);
        }, _decompressWorker: function() {
          return this._data instanceof y ? this._data.getContentWorker() : this._data instanceof v ? this._data : new o(this._data);
        } };
        for (var f = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], _ = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < f.length; d++) s.prototype[f[d]] = _;
        a.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(s) {
          var i, o, u = s.MutationObserver || s.WebKitMutationObserver;
          if (u) {
            var y = 0, v = new u(h), f = s.document.createTextNode("");
            v.observe(f, { characterData: !0 }), i = function() {
              f.data = y = ++y % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) i = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var n = s.document.createElement("script");
            n.onreadystatechange = function() {
              h(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null;
            }, s.document.documentElement.appendChild(n);
          } : function() {
            setTimeout(h, 0);
          };
          else {
            var _ = new s.MessageChannel();
            _.port1.onmessage = h, i = function() {
              _.port2.postMessage(0);
            };
          }
          var d = [];
          function h() {
            var n, g;
            o = !0;
            for (var p = d.length; p; ) {
              for (g = d, d = [], n = -1; ++n < p; ) g[n]();
              p = d.length;
            }
            o = !1;
          }
          a.exports = function(n) {
            d.push(n) !== 1 || o || i();
          };
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var s = e("immediate");
        function i() {
        }
        var o = {}, u = ["REJECTED"], y = ["FULFILLED"], v = ["PENDING"];
        function f(p) {
          if (typeof p != "function") throw new TypeError("resolver must be a function");
          this.state = v, this.queue = [], this.outcome = void 0, p !== i && n(this, p);
        }
        function _(p, x, M) {
          this.promise = p, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof M == "function" && (this.onRejected = M, this.callRejected = this.otherCallRejected);
        }
        function d(p, x, M) {
          s(function() {
            var k;
            try {
              k = x(M);
            } catch (R) {
              return o.reject(p, R);
            }
            k === p ? o.reject(p, new TypeError("Cannot resolve promise with itself")) : o.resolve(p, k);
          });
        }
        function h(p) {
          var x = p && p.then;
          if (p && (typeof p == "object" || typeof p == "function") && typeof x == "function") return function() {
            x.apply(p, arguments);
          };
        }
        function n(p, x) {
          var M = !1;
          function k(P) {
            M || (M = !0, o.reject(p, P));
          }
          function R(P) {
            M || (M = !0, o.resolve(p, P));
          }
          var B = g(function() {
            x(R, k);
          });
          B.status === "error" && k(B.value);
        }
        function g(p, x) {
          var M = {};
          try {
            M.value = p(x), M.status = "success";
          } catch (k) {
            M.status = "error", M.value = k;
          }
          return M;
        }
        (a.exports = f).prototype.finally = function(p) {
          if (typeof p != "function") return this;
          var x = this.constructor;
          return this.then(function(M) {
            return x.resolve(p()).then(function() {
              return M;
            });
          }, function(M) {
            return x.resolve(p()).then(function() {
              throw M;
            });
          });
        }, f.prototype.catch = function(p) {
          return this.then(null, p);
        }, f.prototype.then = function(p, x) {
          if (typeof p != "function" && this.state === y || typeof x != "function" && this.state === u) return this;
          var M = new this.constructor(i);
          return this.state !== v ? d(M, this.state === y ? p : x, this.outcome) : this.queue.push(new _(M, p, x)), M;
        }, _.prototype.callFulfilled = function(p) {
          o.resolve(this.promise, p);
        }, _.prototype.otherCallFulfilled = function(p) {
          d(this.promise, this.onFulfilled, p);
        }, _.prototype.callRejected = function(p) {
          o.reject(this.promise, p);
        }, _.prototype.otherCallRejected = function(p) {
          d(this.promise, this.onRejected, p);
        }, o.resolve = function(p, x) {
          var M = g(h, x);
          if (M.status === "error") return o.reject(p, M.value);
          var k = M.value;
          if (k) n(p, k);
          else {
            p.state = y, p.outcome = x;
            for (var R = -1, B = p.queue.length; ++R < B; ) p.queue[R].callFulfilled(x);
          }
          return p;
        }, o.reject = function(p, x) {
          p.state = u, p.outcome = x;
          for (var M = -1, k = p.queue.length; ++M < k; ) p.queue[M].callRejected(x);
          return p;
        }, f.resolve = function(p) {
          return p instanceof this ? p : o.resolve(new this(i), p);
        }, f.reject = function(p) {
          var x = new this(i);
          return o.reject(x, p);
        }, f.all = function(p) {
          var x = this;
          if (Object.prototype.toString.call(p) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = p.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = new Array(M), B = 0, P = -1, j = new this(i); ++P < M; ) C(p[P], P);
          return j;
          function C(W, J) {
            x.resolve(W).then(function(S) {
              R[J] = S, ++B !== M || k || (k = !0, o.resolve(j, R));
            }, function(S) {
              k || (k = !0, o.reject(j, S));
            });
          }
        }, f.race = function(p) {
          var x = this;
          if (Object.prototype.toString.call(p) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = p.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = -1, B = new this(i); ++R < M; ) P = p[R], x.resolve(P).then(function(j) {
            k || (k = !0, o.resolve(B, j));
          }, function(j) {
            k || (k = !0, o.reject(B, j));
          });
          var P;
          return B;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), o = e("./utils/strings"), u = e("./zlib/messages"), y = e("./zlib/zstream"), v = Object.prototype.toString, f = 0, _ = -1, d = 0, h = 8;
        function n(p) {
          if (!(this instanceof n)) return new n(p);
          this.options = i.assign({ level: _, method: h, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, p || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var M = s.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (M !== f) throw new Error(u[M]);
          if (x.header && s.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var k;
            if (k = typeof x.dictionary == "string" ? o.string2buf(x.dictionary) : v.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (M = s.deflateSetDictionary(this.strm, k)) !== f) throw new Error(u[M]);
            this._dict_set = !0;
          }
        }
        function g(p, x) {
          var M = new n(x);
          if (M.push(p, !0), M.err) throw M.msg || u[M.err];
          return M.result;
        }
        n.prototype.push = function(p, x) {
          var M, k, R = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          k = x === ~~x ? x : x === !0 ? 4 : 0, typeof p == "string" ? R.input = o.string2buf(p) : v.call(p) === "[object ArrayBuffer]" ? R.input = new Uint8Array(p) : R.input = p, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new i.Buf8(B), R.next_out = 0, R.avail_out = B), (M = s.deflate(R, k)) !== 1 && M !== f) return this.onEnd(M), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(i.shrinkBuf(R.output, R.next_out))) : this.onData(i.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && M !== 1);
          return k === 4 ? (M = s.deflateEnd(this.strm), this.onEnd(M), this.ended = !0, M === f) : k !== 2 || (this.onEnd(f), !(R.avail_out = 0));
        }, n.prototype.onData = function(p) {
          this.chunks.push(p);
        }, n.prototype.onEnd = function(p) {
          p === f && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = p, this.msg = this.strm.msg;
        }, l.Deflate = n, l.deflate = g, l.deflateRaw = function(p, x) {
          return (x = x || {}).raw = !0, g(p, x);
        }, l.gzip = function(p, x) {
          return (x = x || {}).gzip = !0, g(p, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), o = e("./utils/strings"), u = e("./zlib/constants"), y = e("./zlib/messages"), v = e("./zlib/zstream"), f = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function d(n) {
          if (!(this instanceof d)) return new d(n);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, n || {});
          var g = this.options;
          g.raw && 0 <= g.windowBits && g.windowBits < 16 && (g.windowBits = -g.windowBits, g.windowBits === 0 && (g.windowBits = -15)), !(0 <= g.windowBits && g.windowBits < 16) || n && n.windowBits || (g.windowBits += 32), 15 < g.windowBits && g.windowBits < 48 && (15 & g.windowBits) == 0 && (g.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var p = s.inflateInit2(this.strm, g.windowBits);
          if (p !== u.Z_OK) throw new Error(y[p]);
          this.header = new f(), s.inflateGetHeader(this.strm, this.header);
        }
        function h(n, g) {
          var p = new d(g);
          if (p.push(n, !0), p.err) throw p.msg || y[p.err];
          return p.result;
        }
        d.prototype.push = function(n, g) {
          var p, x, M, k, R, B, P = this.strm, j = this.options.chunkSize, C = this.options.dictionary, W = !1;
          if (this.ended) return !1;
          x = g === ~~g ? g : g === !0 ? u.Z_FINISH : u.Z_NO_FLUSH, typeof n == "string" ? P.input = o.binstring2buf(n) : _.call(n) === "[object ArrayBuffer]" ? P.input = new Uint8Array(n) : P.input = n, P.next_in = 0, P.avail_in = P.input.length;
          do {
            if (P.avail_out === 0 && (P.output = new i.Buf8(j), P.next_out = 0, P.avail_out = j), (p = s.inflate(P, u.Z_NO_FLUSH)) === u.Z_NEED_DICT && C && (B = typeof C == "string" ? o.string2buf(C) : _.call(C) === "[object ArrayBuffer]" ? new Uint8Array(C) : C, p = s.inflateSetDictionary(this.strm, B)), p === u.Z_BUF_ERROR && W === !0 && (p = u.Z_OK, W = !1), p !== u.Z_STREAM_END && p !== u.Z_OK) return this.onEnd(p), !(this.ended = !0);
            P.next_out && (P.avail_out !== 0 && p !== u.Z_STREAM_END && (P.avail_in !== 0 || x !== u.Z_FINISH && x !== u.Z_SYNC_FLUSH) || (this.options.to === "string" ? (M = o.utf8border(P.output, P.next_out), k = P.next_out - M, R = o.buf2string(P.output, M), P.next_out = k, P.avail_out = j - k, k && i.arraySet(P.output, P.output, M, k, 0), this.onData(R)) : this.onData(i.shrinkBuf(P.output, P.next_out)))), P.avail_in === 0 && P.avail_out === 0 && (W = !0);
          } while ((0 < P.avail_in || P.avail_out === 0) && p !== u.Z_STREAM_END);
          return p === u.Z_STREAM_END && (x = u.Z_FINISH), x === u.Z_FINISH ? (p = s.inflateEnd(this.strm), this.onEnd(p), this.ended = !0, p === u.Z_OK) : x !== u.Z_SYNC_FLUSH || (this.onEnd(u.Z_OK), !(P.avail_out = 0));
        }, d.prototype.onData = function(n) {
          this.chunks.push(n);
        }, d.prototype.onEnd = function(n) {
          n === u.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = n, this.msg = this.strm.msg;
        }, l.Inflate = d, l.inflate = h, l.inflateRaw = function(n, g) {
          return (g = g || {}).raw = !0, h(n, g);
        }, l.ungzip = h;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(u) {
          for (var y = Array.prototype.slice.call(arguments, 1); y.length; ) {
            var v = y.shift();
            if (v) {
              if (typeof v != "object") throw new TypeError(v + "must be non-object");
              for (var f in v) v.hasOwnProperty(f) && (u[f] = v[f]);
            }
          }
          return u;
        }, l.shrinkBuf = function(u, y) {
          return u.length === y ? u : u.subarray ? u.subarray(0, y) : (u.length = y, u);
        };
        var i = { arraySet: function(u, y, v, f, _) {
          if (y.subarray && u.subarray) u.set(y.subarray(v, v + f), _);
          else for (var d = 0; d < f; d++) u[_ + d] = y[v + d];
        }, flattenChunks: function(u) {
          var y, v, f, _, d, h;
          for (y = f = 0, v = u.length; y < v; y++) f += u[y].length;
          for (h = new Uint8Array(f), y = _ = 0, v = u.length; y < v; y++) d = u[y], h.set(d, _), _ += d.length;
          return h;
        } }, o = { arraySet: function(u, y, v, f, _) {
          for (var d = 0; d < f; d++) u[_ + d] = y[v + d];
        }, flattenChunks: function(u) {
          return [].concat.apply([], u);
        } };
        l.setTyped = function(u) {
          u ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, i)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, o));
        }, l.setTyped(s);
      }, {}], 42: [function(e, a, l) {
        var s = e("./common"), i = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          i = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var u = new s.Buf8(256), y = 0; y < 256; y++) u[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        function v(f, _) {
          if (_ < 65537 && (f.subarray && o || !f.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(f, _));
          for (var d = "", h = 0; h < _; h++) d += String.fromCharCode(f[h]);
          return d;
        }
        u[254] = u[254] = 1, l.string2buf = function(f) {
          var _, d, h, n, g, p = f.length, x = 0;
          for (n = 0; n < p; n++) (64512 & (d = f.charCodeAt(n))) == 55296 && n + 1 < p && (64512 & (h = f.charCodeAt(n + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), n++), x += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (_ = new s.Buf8(x), n = g = 0; g < x; n++) (64512 & (d = f.charCodeAt(n))) == 55296 && n + 1 < p && (64512 & (h = f.charCodeAt(n + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), n++), d < 128 ? _[g++] = d : (d < 2048 ? _[g++] = 192 | d >>> 6 : (d < 65536 ? _[g++] = 224 | d >>> 12 : (_[g++] = 240 | d >>> 18, _[g++] = 128 | d >>> 12 & 63), _[g++] = 128 | d >>> 6 & 63), _[g++] = 128 | 63 & d);
          return _;
        }, l.buf2binstring = function(f) {
          return v(f, f.length);
        }, l.binstring2buf = function(f) {
          for (var _ = new s.Buf8(f.length), d = 0, h = _.length; d < h; d++) _[d] = f.charCodeAt(d);
          return _;
        }, l.buf2string = function(f, _) {
          var d, h, n, g, p = _ || f.length, x = new Array(2 * p);
          for (d = h = 0; d < p; ) if ((n = f[d++]) < 128) x[h++] = n;
          else if (4 < (g = u[n])) x[h++] = 65533, d += g - 1;
          else {
            for (n &= g === 2 ? 31 : g === 3 ? 15 : 7; 1 < g && d < p; ) n = n << 6 | 63 & f[d++], g--;
            1 < g ? x[h++] = 65533 : n < 65536 ? x[h++] = n : (n -= 65536, x[h++] = 55296 | n >> 10 & 1023, x[h++] = 56320 | 1023 & n);
          }
          return v(x, h);
        }, l.utf8border = function(f, _) {
          var d;
          for ((_ = _ || f.length) > f.length && (_ = f.length), d = _ - 1; 0 <= d && (192 & f[d]) == 128; ) d--;
          return d < 0 || d === 0 ? _ : d + u[f[d]] > _ ? d : _;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(s, i, o, u) {
          for (var y = 65535 & s | 0, v = s >>> 16 & 65535 | 0, f = 0; o !== 0; ) {
            for (o -= f = 2e3 < o ? 2e3 : o; v = v + (y = y + i[u++] | 0) | 0, --f; ) ;
            y %= 65521, v %= 65521;
          }
          return y | v << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var s = (function() {
          for (var i, o = [], u = 0; u < 256; u++) {
            i = u;
            for (var y = 0; y < 8; y++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            o[u] = i;
          }
          return o;
        })();
        a.exports = function(i, o, u, y) {
          var v = s, f = y + u;
          i ^= -1;
          for (var _ = y; _ < f; _++) i = i >>> 8 ^ v[255 & (i ^ o[_])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, a, l) {
        var s, i = e("../utils/common"), o = e("./trees"), u = e("./adler32"), y = e("./crc32"), v = e("./messages"), f = 0, _ = 4, d = 0, h = -2, n = -1, g = 4, p = 2, x = 8, M = 9, k = 286, R = 30, B = 19, P = 2 * k + 1, j = 15, C = 3, W = 258, J = W + C + 1, S = 42, N = 113, c = 1, $ = 2, rt = 3, G = 4;
        function nt(r, I) {
          return r.msg = v[I], I;
        }
        function q(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function it(r) {
          for (var I = r.length; 0 <= --I; ) r[I] = 0;
        }
        function F(r) {
          var I = r.state, E = I.pending;
          E > r.avail_out && (E = r.avail_out), E !== 0 && (i.arraySet(r.output, I.pending_buf, I.pending_out, E, r.next_out), r.next_out += E, I.pending_out += E, r.total_out += E, r.avail_out -= E, I.pending -= E, I.pending === 0 && (I.pending_out = 0));
        }
        function T(r, I) {
          o._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, I), r.block_start = r.strstart, F(r.strm);
        }
        function tt(r, I) {
          r.pending_buf[r.pending++] = I;
        }
        function K(r, I) {
          r.pending_buf[r.pending++] = I >>> 8 & 255, r.pending_buf[r.pending++] = 255 & I;
        }
        function V(r, I) {
          var E, w, b = r.max_chain_length, A = r.strstart, D = r.prev_length, U = r.nice_match, z = r.strstart > r.w_size - J ? r.strstart - (r.w_size - J) : 0, Z = r.window, Y = r.w_mask, X = r.prev, Q = r.strstart + W, at = Z[A + D - 1], st = Z[A + D];
          r.prev_length >= r.good_match && (b >>= 2), U > r.lookahead && (U = r.lookahead);
          do
            if (Z[(E = I) + D] === st && Z[E + D - 1] === at && Z[E] === Z[A] && Z[++E] === Z[A + 1]) {
              A += 2, E++;
              do
                ;
              while (Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && Z[++A] === Z[++E] && A < Q);
              if (w = W - (Q - A), A = Q - W, D < w) {
                if (r.match_start = I, U <= (D = w)) break;
                at = Z[A + D - 1], st = Z[A + D];
              }
            }
          while ((I = X[I & Y]) > z && --b != 0);
          return D <= r.lookahead ? D : r.lookahead;
        }
        function ct(r) {
          var I, E, w, b, A, D, U, z, Z, Y, X = r.w_size;
          do {
            if (b = r.window_size - r.lookahead - r.strstart, r.strstart >= X + (X - J)) {
              for (i.arraySet(r.window, r.window, X, X, 0), r.match_start -= X, r.strstart -= X, r.block_start -= X, I = E = r.hash_size; w = r.head[--I], r.head[I] = X <= w ? w - X : 0, --E; ) ;
              for (I = E = X; w = r.prev[--I], r.prev[I] = X <= w ? w - X : 0, --E; ) ;
              b += X;
            }
            if (r.strm.avail_in === 0) break;
            if (D = r.strm, U = r.window, z = r.strstart + r.lookahead, Z = b, Y = void 0, Y = D.avail_in, Z < Y && (Y = Z), E = Y === 0 ? 0 : (D.avail_in -= Y, i.arraySet(U, D.input, D.next_in, Y, z), D.state.wrap === 1 ? D.adler = u(D.adler, U, Y, z) : D.state.wrap === 2 && (D.adler = y(D.adler, U, Y, z)), D.next_in += Y, D.total_in += Y, Y), r.lookahead += E, r.lookahead + r.insert >= C) for (A = r.strstart - r.insert, r.ins_h = r.window[A], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + C - 1]) & r.hash_mask, r.prev[A & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = A, A++, r.insert--, !(r.lookahead + r.insert < C)); ) ;
          } while (r.lookahead < J && r.strm.avail_in !== 0);
        }
        function dt(r, I) {
          for (var E, w; ; ) {
            if (r.lookahead < J) {
              if (ct(r), r.lookahead < J && I === f) return c;
              if (r.lookahead === 0) break;
            }
            if (E = 0, r.lookahead >= C && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + C - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), E !== 0 && r.strstart - E <= r.w_size - J && (r.match_length = V(r, E)), r.match_length >= C) if (w = o._tr_tally(r, r.strstart - r.match_start, r.match_length - C), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= C) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + C - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else w = o._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (w && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < C - 1 ? r.strstart : C - 1, I === _ ? (T(r, !0), r.strm.avail_out === 0 ? rt : G) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function ot(r, I) {
          for (var E, w, b; ; ) {
            if (r.lookahead < J) {
              if (ct(r), r.lookahead < J && I === f) return c;
              if (r.lookahead === 0) break;
            }
            if (E = 0, r.lookahead >= C && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + C - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = C - 1, E !== 0 && r.prev_length < r.max_lazy_match && r.strstart - E <= r.w_size - J && (r.match_length = V(r, E), r.match_length <= 5 && (r.strategy === 1 || r.match_length === C && 4096 < r.strstart - r.match_start) && (r.match_length = C - 1)), r.prev_length >= C && r.match_length <= r.prev_length) {
              for (b = r.strstart + r.lookahead - C, w = o._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - C), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= b && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + C - 1]) & r.hash_mask, E = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = C - 1, r.strstart++, w && (T(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((w = o._tr_tally(r, 0, r.window[r.strstart - 1])) && T(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (w = o._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < C - 1 ? r.strstart : C - 1, I === _ ? (T(r, !0), r.strm.avail_out === 0 ? rt : G) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function lt(r, I, E, w, b) {
          this.good_length = r, this.max_lazy = I, this.nice_length = E, this.max_chain = w, this.func = b;
        }
        function O() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * P), this.dyn_dtree = new i.Buf16(2 * (2 * R + 1)), this.bl_tree = new i.Buf16(2 * (2 * B + 1)), it(this.dyn_ltree), it(this.dyn_dtree), it(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(j + 1), this.heap = new i.Buf16(2 * k + 1), it(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * k + 1), it(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function L(r) {
          var I;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = p, (I = r.state).pending = 0, I.pending_out = 0, I.wrap < 0 && (I.wrap = -I.wrap), I.status = I.wrap ? S : N, r.adler = I.wrap === 2 ? 0 : 1, I.last_flush = f, o._tr_init(I), d) : nt(r, h);
        }
        function H(r) {
          var I = L(r);
          return I === d && (function(E) {
            E.window_size = 2 * E.w_size, it(E.head), E.max_lazy_match = s[E.level].max_lazy, E.good_match = s[E.level].good_length, E.nice_match = s[E.level].nice_length, E.max_chain_length = s[E.level].max_chain, E.strstart = 0, E.block_start = 0, E.lookahead = 0, E.insert = 0, E.match_length = E.prev_length = C - 1, E.match_available = 0, E.ins_h = 0;
          })(r.state), I;
        }
        function et(r, I, E, w, b, A) {
          if (!r) return h;
          var D = 1;
          if (I === n && (I = 6), w < 0 ? (D = 0, w = -w) : 15 < w && (D = 2, w -= 16), b < 1 || M < b || E !== x || w < 8 || 15 < w || I < 0 || 9 < I || A < 0 || g < A) return nt(r, h);
          w === 8 && (w = 9);
          var U = new O();
          return (r.state = U).strm = r, U.wrap = D, U.gzhead = null, U.w_bits = w, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = b + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + C - 1) / C), U.window = new i.Buf8(2 * U.w_size), U.head = new i.Buf16(U.hash_size), U.prev = new i.Buf16(U.w_size), U.lit_bufsize = 1 << b + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new i.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = I, U.strategy = A, U.method = E, H(r);
        }
        s = [new lt(0, 0, 0, 0, function(r, I) {
          var E = 65535;
          for (E > r.pending_buf_size - 5 && (E = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (ct(r), r.lookahead === 0 && I === f) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var w = r.block_start + E;
            if ((r.strstart === 0 || r.strstart >= w) && (r.lookahead = r.strstart - w, r.strstart = w, T(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - J && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, I === _ ? (T(r, !0), r.strm.avail_out === 0 ? rt : G) : (r.strstart > r.block_start && (T(r, !1), r.strm.avail_out), c);
        }), new lt(4, 4, 8, 4, dt), new lt(4, 5, 16, 8, dt), new lt(4, 6, 32, 32, dt), new lt(4, 4, 16, 16, ot), new lt(8, 16, 32, 32, ot), new lt(8, 16, 128, 128, ot), new lt(8, 32, 128, 256, ot), new lt(32, 128, 258, 1024, ot), new lt(32, 258, 258, 4096, ot)], l.deflateInit = function(r, I) {
          return et(r, I, x, 15, 8, 0);
        }, l.deflateInit2 = et, l.deflateReset = H, l.deflateResetKeep = L, l.deflateSetHeader = function(r, I) {
          return r && r.state ? r.state.wrap !== 2 ? h : (r.state.gzhead = I, d) : h;
        }, l.deflate = function(r, I) {
          var E, w, b, A;
          if (!r || !r.state || 5 < I || I < 0) return r ? nt(r, h) : h;
          if (w = r.state, !r.output || !r.input && r.avail_in !== 0 || w.status === 666 && I !== _) return nt(r, r.avail_out === 0 ? -5 : h);
          if (w.strm = r, E = w.last_flush, w.last_flush = I, w.status === S) if (w.wrap === 2) r.adler = 0, tt(w, 31), tt(w, 139), tt(w, 8), w.gzhead ? (tt(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), tt(w, 255 & w.gzhead.time), tt(w, w.gzhead.time >> 8 & 255), tt(w, w.gzhead.time >> 16 & 255), tt(w, w.gzhead.time >> 24 & 255), tt(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), tt(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (tt(w, 255 & w.gzhead.extra.length), tt(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (r.adler = y(r.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (tt(w, 0), tt(w, 0), tt(w, 0), tt(w, 0), tt(w, 0), tt(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), tt(w, 3), w.status = N);
          else {
            var D = x + (w.w_bits - 8 << 4) << 8;
            D |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (D |= 32), D += 31 - D % 31, w.status = N, K(w, D), w.strstart !== 0 && (K(w, r.adler >>> 16), K(w, 65535 & r.adler)), r.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (b = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), F(r), b = w.pending, w.pending !== w.pending_buf_size)); ) tt(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            b = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), F(r), b = w.pending, w.pending === w.pending_buf_size)) {
                A = 1;
                break;
              }
              A = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, tt(w, A);
            } while (A !== 0);
            w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), A === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            b = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), F(r), b = w.pending, w.pending === w.pending_buf_size)) {
                A = 1;
                break;
              }
              A = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, tt(w, A);
            } while (A !== 0);
            w.gzhead.hcrc && w.pending > b && (r.adler = y(r.adler, w.pending_buf, w.pending - b, b)), A === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && F(r), w.pending + 2 <= w.pending_buf_size && (tt(w, 255 & r.adler), tt(w, r.adler >> 8 & 255), r.adler = 0, w.status = N)) : w.status = N), w.pending !== 0) {
            if (F(r), r.avail_out === 0) return w.last_flush = -1, d;
          } else if (r.avail_in === 0 && q(I) <= q(E) && I !== _) return nt(r, -5);
          if (w.status === 666 && r.avail_in !== 0) return nt(r, -5);
          if (r.avail_in !== 0 || w.lookahead !== 0 || I !== f && w.status !== 666) {
            var U = w.strategy === 2 ? (function(z, Z) {
              for (var Y; ; ) {
                if (z.lookahead === 0 && (ct(z), z.lookahead === 0)) {
                  if (Z === f) return c;
                  break;
                }
                if (z.match_length = 0, Y = o._tr_tally(z, 0, z.window[z.strstart]), z.lookahead--, z.strstart++, Y && (T(z, !1), z.strm.avail_out === 0)) return c;
              }
              return z.insert = 0, Z === _ ? (T(z, !0), z.strm.avail_out === 0 ? rt : G) : z.last_lit && (T(z, !1), z.strm.avail_out === 0) ? c : $;
            })(w, I) : w.strategy === 3 ? (function(z, Z) {
              for (var Y, X, Q, at, st = z.window; ; ) {
                if (z.lookahead <= W) {
                  if (ct(z), z.lookahead <= W && Z === f) return c;
                  if (z.lookahead === 0) break;
                }
                if (z.match_length = 0, z.lookahead >= C && 0 < z.strstart && (X = st[Q = z.strstart - 1]) === st[++Q] && X === st[++Q] && X === st[++Q]) {
                  at = z.strstart + W;
                  do
                    ;
                  while (X === st[++Q] && X === st[++Q] && X === st[++Q] && X === st[++Q] && X === st[++Q] && X === st[++Q] && X === st[++Q] && X === st[++Q] && Q < at);
                  z.match_length = W - (at - Q), z.match_length > z.lookahead && (z.match_length = z.lookahead);
                }
                if (z.match_length >= C ? (Y = o._tr_tally(z, 1, z.match_length - C), z.lookahead -= z.match_length, z.strstart += z.match_length, z.match_length = 0) : (Y = o._tr_tally(z, 0, z.window[z.strstart]), z.lookahead--, z.strstart++), Y && (T(z, !1), z.strm.avail_out === 0)) return c;
              }
              return z.insert = 0, Z === _ ? (T(z, !0), z.strm.avail_out === 0 ? rt : G) : z.last_lit && (T(z, !1), z.strm.avail_out === 0) ? c : $;
            })(w, I) : s[w.level].func(w, I);
            if (U !== rt && U !== G || (w.status = 666), U === c || U === rt) return r.avail_out === 0 && (w.last_flush = -1), d;
            if (U === $ && (I === 1 ? o._tr_align(w) : I !== 5 && (o._tr_stored_block(w, 0, 0, !1), I === 3 && (it(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), F(r), r.avail_out === 0)) return w.last_flush = -1, d;
          }
          return I !== _ ? d : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (tt(w, 255 & r.adler), tt(w, r.adler >> 8 & 255), tt(w, r.adler >> 16 & 255), tt(w, r.adler >> 24 & 255), tt(w, 255 & r.total_in), tt(w, r.total_in >> 8 & 255), tt(w, r.total_in >> 16 & 255), tt(w, r.total_in >> 24 & 255)) : (K(w, r.adler >>> 16), K(w, 65535 & r.adler)), F(r), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? d : 1);
        }, l.deflateEnd = function(r) {
          var I;
          return r && r.state ? (I = r.state.status) !== S && I !== 69 && I !== 73 && I !== 91 && I !== 103 && I !== N && I !== 666 ? nt(r, h) : (r.state = null, I === N ? nt(r, -3) : d) : h;
        }, l.deflateSetDictionary = function(r, I) {
          var E, w, b, A, D, U, z, Z, Y = I.length;
          if (!r || !r.state || (A = (E = r.state).wrap) === 2 || A === 1 && E.status !== S || E.lookahead) return h;
          for (A === 1 && (r.adler = u(r.adler, I, Y, 0)), E.wrap = 0, Y >= E.w_size && (A === 0 && (it(E.head), E.strstart = 0, E.block_start = 0, E.insert = 0), Z = new i.Buf8(E.w_size), i.arraySet(Z, I, Y - E.w_size, E.w_size, 0), I = Z, Y = E.w_size), D = r.avail_in, U = r.next_in, z = r.input, r.avail_in = Y, r.next_in = 0, r.input = I, ct(E); E.lookahead >= C; ) {
            for (w = E.strstart, b = E.lookahead - (C - 1); E.ins_h = (E.ins_h << E.hash_shift ^ E.window[w + C - 1]) & E.hash_mask, E.prev[w & E.w_mask] = E.head[E.ins_h], E.head[E.ins_h] = w, w++, --b; ) ;
            E.strstart = w, E.lookahead = C - 1, ct(E);
          }
          return E.strstart += E.lookahead, E.block_start = E.strstart, E.insert = E.lookahead, E.lookahead = 0, E.match_length = E.prev_length = C - 1, E.match_available = 0, r.next_in = U, r.input = z, r.avail_in = D, E.wrap = A, d;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(s, i) {
          var o, u, y, v, f, _, d, h, n, g, p, x, M, k, R, B, P, j, C, W, J, S, N, c, $;
          o = s.state, u = s.next_in, c = s.input, y = u + (s.avail_in - 5), v = s.next_out, $ = s.output, f = v - (i - s.avail_out), _ = v + (s.avail_out - 257), d = o.dmax, h = o.wsize, n = o.whave, g = o.wnext, p = o.window, x = o.hold, M = o.bits, k = o.lencode, R = o.distcode, B = (1 << o.lenbits) - 1, P = (1 << o.distbits) - 1;
          t: do {
            M < 15 && (x += c[u++] << M, M += 8, x += c[u++] << M, M += 8), j = k[x & B];
            e: for (; ; ) {
              if (x >>>= C = j >>> 24, M -= C, (C = j >>> 16 & 255) === 0) $[v++] = 65535 & j;
              else {
                if (!(16 & C)) {
                  if ((64 & C) == 0) {
                    j = k[(65535 & j) + (x & (1 << C) - 1)];
                    continue e;
                  }
                  if (32 & C) {
                    o.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                W = 65535 & j, (C &= 15) && (M < C && (x += c[u++] << M, M += 8), W += x & (1 << C) - 1, x >>>= C, M -= C), M < 15 && (x += c[u++] << M, M += 8, x += c[u++] << M, M += 8), j = R[x & P];
                r: for (; ; ) {
                  if (x >>>= C = j >>> 24, M -= C, !(16 & (C = j >>> 16 & 255))) {
                    if ((64 & C) == 0) {
                      j = R[(65535 & j) + (x & (1 << C) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (J = 65535 & j, M < (C &= 15) && (x += c[u++] << M, (M += 8) < C && (x += c[u++] << M, M += 8)), d < (J += x & (1 << C) - 1)) {
                    s.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (x >>>= C, M -= C, (C = v - f) < J) {
                    if (n < (C = J - C) && o.sane) {
                      s.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (N = p, (S = 0) === g) {
                      if (S += h - C, C < W) {
                        for (W -= C; $[v++] = p[S++], --C; ) ;
                        S = v - J, N = $;
                      }
                    } else if (g < C) {
                      if (S += h + g - C, (C -= g) < W) {
                        for (W -= C; $[v++] = p[S++], --C; ) ;
                        if (S = 0, g < W) {
                          for (W -= C = g; $[v++] = p[S++], --C; ) ;
                          S = v - J, N = $;
                        }
                      }
                    } else if (S += g - C, C < W) {
                      for (W -= C; $[v++] = p[S++], --C; ) ;
                      S = v - J, N = $;
                    }
                    for (; 2 < W; ) $[v++] = N[S++], $[v++] = N[S++], $[v++] = N[S++], W -= 3;
                    W && ($[v++] = N[S++], 1 < W && ($[v++] = N[S++]));
                  } else {
                    for (S = v - J; $[v++] = $[S++], $[v++] = $[S++], $[v++] = $[S++], 2 < (W -= 3); ) ;
                    W && ($[v++] = $[S++], 1 < W && ($[v++] = $[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (u < y && v < _);
          u -= W = M >> 3, x &= (1 << (M -= W << 3)) - 1, s.next_in = u, s.next_out = v, s.avail_in = u < y ? y - u + 5 : 5 - (u - y), s.avail_out = v < _ ? _ - v + 257 : 257 - (v - _), o.hold = x, o.bits = M;
        };
      }, {}], 49: [function(e, a, l) {
        var s = e("../utils/common"), i = e("./adler32"), o = e("./crc32"), u = e("./inffast"), y = e("./inftrees"), v = 1, f = 2, _ = 0, d = -2, h = 1, n = 852, g = 592;
        function p(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function x() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function M(S) {
          var N;
          return S && S.state ? (N = S.state, S.total_in = S.total_out = N.total = 0, S.msg = "", N.wrap && (S.adler = 1 & N.wrap), N.mode = h, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new s.Buf32(n), N.distcode = N.distdyn = new s.Buf32(g), N.sane = 1, N.back = -1, _) : d;
        }
        function k(S) {
          var N;
          return S && S.state ? ((N = S.state).wsize = 0, N.whave = 0, N.wnext = 0, M(S)) : d;
        }
        function R(S, N) {
          var c, $;
          return S && S.state ? ($ = S.state, N < 0 ? (c = 0, N = -N) : (c = 1 + (N >> 4), N < 48 && (N &= 15)), N && (N < 8 || 15 < N) ? d : ($.window !== null && $.wbits !== N && ($.window = null), $.wrap = c, $.wbits = N, k(S))) : d;
        }
        function B(S, N) {
          var c, $;
          return S ? ($ = new x(), (S.state = $).window = null, (c = R(S, N)) !== _ && (S.state = null), c) : d;
        }
        var P, j, C = !0;
        function W(S) {
          if (C) {
            var N;
            for (P = new s.Buf32(512), j = new s.Buf32(32), N = 0; N < 144; ) S.lens[N++] = 8;
            for (; N < 256; ) S.lens[N++] = 9;
            for (; N < 280; ) S.lens[N++] = 7;
            for (; N < 288; ) S.lens[N++] = 8;
            for (y(v, S.lens, 0, 288, P, 0, S.work, { bits: 9 }), N = 0; N < 32; ) S.lens[N++] = 5;
            y(f, S.lens, 0, 32, j, 0, S.work, { bits: 5 }), C = !1;
          }
          S.lencode = P, S.lenbits = 9, S.distcode = j, S.distbits = 5;
        }
        function J(S, N, c, $) {
          var rt, G = S.state;
          return G.window === null && (G.wsize = 1 << G.wbits, G.wnext = 0, G.whave = 0, G.window = new s.Buf8(G.wsize)), $ >= G.wsize ? (s.arraySet(G.window, N, c - G.wsize, G.wsize, 0), G.wnext = 0, G.whave = G.wsize) : ($ < (rt = G.wsize - G.wnext) && (rt = $), s.arraySet(G.window, N, c - $, rt, G.wnext), ($ -= rt) ? (s.arraySet(G.window, N, c - $, $, 0), G.wnext = $, G.whave = G.wsize) : (G.wnext += rt, G.wnext === G.wsize && (G.wnext = 0), G.whave < G.wsize && (G.whave += rt))), 0;
        }
        l.inflateReset = k, l.inflateReset2 = R, l.inflateResetKeep = M, l.inflateInit = function(S) {
          return B(S, 15);
        }, l.inflateInit2 = B, l.inflate = function(S, N) {
          var c, $, rt, G, nt, q, it, F, T, tt, K, V, ct, dt, ot, lt, O, L, H, et, r, I, E, w, b = 0, A = new s.Buf8(4), D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return d;
          (c = S.state).mode === 12 && (c.mode = 13), nt = S.next_out, rt = S.output, it = S.avail_out, G = S.next_in, $ = S.input, q = S.avail_in, F = c.hold, T = c.bits, tt = q, K = it, I = _;
          t: for (; ; ) switch (c.mode) {
            case h:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if (2 & c.wrap && F === 35615) {
                A[c.check = 0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0), T = F = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & F) << 8) + (F >> 8)) % 31) {
                S.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & F) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (T -= 4, r = 8 + (15 & (F >>>= 4)), c.wbits === 0) c.wbits = r;
              else if (r > c.wbits) {
                S.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << r, S.adler = c.check = 1, c.mode = 512 & F ? 10 : 12, T = F = 0;
              break;
            case 2:
              for (; T < 16; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if (c.flags = F, (255 & c.flags) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                S.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = F >> 8 & 1), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0)), T = F = 0, c.mode = 3;
            case 3:
              for (; T < 32; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              c.head && (c.head.time = F), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, A[2] = F >>> 16 & 255, A[3] = F >>> 24 & 255, c.check = o(c.check, A, 4, 0)), T = F = 0, c.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              c.head && (c.head.xflags = 255 & F, c.head.os = F >> 8), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0)), T = F = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; T < 16; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                c.length = F, c.head && (c.head.extra_len = F), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0)), T = F = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (q < (V = c.length) && (V = q), V && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), s.arraySet(c.head.extra, $, G, V, r)), 512 & c.flags && (c.check = o(c.check, $, V, G)), q -= V, G += V, c.length -= V), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (q === 0) break t;
                for (V = 0; r = $[G + V++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && V < q; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, V, G)), q -= V, G += V, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (q === 0) break t;
                for (V = 0; r = $[G + V++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && V < q; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, V, G)), q -= V, G += V, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; T < 16; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                if (F !== (65535 & c.check)) {
                  S.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                T = F = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), S.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; T < 32; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              S.adler = c.check = p(F), T = F = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return S.next_out = nt, S.avail_out = it, S.next_in = G, S.avail_in = q, c.hold = F, c.bits = T, 2;
              S.adler = c.check = 1, c.mode = 12;
            case 12:
              if (N === 5 || N === 6) break t;
            case 13:
              if (c.last) {
                F >>>= 7 & T, T -= 7 & T, c.mode = 27;
                break;
              }
              for (; T < 3; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              switch (c.last = 1 & F, T -= 1, 3 & (F >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (W(c), c.mode = 20, N !== 6) break;
                  F >>>= 2, T -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", c.mode = 30;
              }
              F >>>= 2, T -= 2;
              break;
            case 14:
              for (F >>>= 7 & T, T -= 7 & T; T < 32; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if ((65535 & F) != (F >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & F, T = F = 0, c.mode = 15, N === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (V = c.length) {
                if (q < V && (V = q), it < V && (V = it), V === 0) break t;
                s.arraySet(rt, $, G, V, nt), q -= V, G += V, it -= V, nt += V, c.length -= V;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if (c.nlen = 257 + (31 & F), F >>>= 5, T -= 5, c.ndist = 1 + (31 & F), F >>>= 5, T -= 5, c.ncode = 4 + (15 & F), F >>>= 4, T -= 4, 286 < c.nlen || 30 < c.ndist) {
                S.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; T < 3; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                c.lens[D[c.have++]] = 7 & F, F >>>= 3, T -= 3;
              }
              for (; c.have < 19; ) c.lens[D[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, E = { bits: c.lenbits }, I = y(0, c.lens, 0, 19, c.lencode, 0, c.work, E), c.lenbits = E.bits, I) {
                S.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; lt = (b = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, O = 65535 & b, !((ot = b >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                if (O < 16) F >>>= ot, T -= ot, c.lens[c.have++] = O;
                else {
                  if (O === 16) {
                    for (w = ot + 2; T < w; ) {
                      if (q === 0) break t;
                      q--, F += $[G++] << T, T += 8;
                    }
                    if (F >>>= ot, T -= ot, c.have === 0) {
                      S.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], V = 3 + (3 & F), F >>>= 2, T -= 2;
                  } else if (O === 17) {
                    for (w = ot + 3; T < w; ) {
                      if (q === 0) break t;
                      q--, F += $[G++] << T, T += 8;
                    }
                    T -= ot, r = 0, V = 3 + (7 & (F >>>= ot)), F >>>= 3, T -= 3;
                  } else {
                    for (w = ot + 7; T < w; ) {
                      if (q === 0) break t;
                      q--, F += $[G++] << T, T += 8;
                    }
                    T -= ot, r = 0, V = 11 + (127 & (F >>>= ot)), F >>>= 7, T -= 7;
                  }
                  if (c.have + V > c.nlen + c.ndist) {
                    S.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; V--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, E = { bits: c.lenbits }, I = y(v, c.lens, 0, c.nlen, c.lencode, 0, c.work, E), c.lenbits = E.bits, I) {
                S.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, E = { bits: c.distbits }, I = y(f, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, E), c.distbits = E.bits, I) {
                S.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, N === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= q && 258 <= it) {
                S.next_out = nt, S.avail_out = it, S.next_in = G, S.avail_in = q, c.hold = F, c.bits = T, u(S, K), nt = S.next_out, rt = S.output, it = S.avail_out, G = S.next_in, $ = S.input, q = S.avail_in, F = c.hold, T = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; lt = (b = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, O = 65535 & b, !((ot = b >>> 24) <= T); ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if (lt && (240 & lt) == 0) {
                for (L = ot, H = lt, et = O; lt = (b = c.lencode[et + ((F & (1 << L + H) - 1) >> L)]) >>> 16 & 255, O = 65535 & b, !(L + (ot = b >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                F >>>= L, T -= L, c.back += L;
              }
              if (F >>>= ot, T -= ot, c.back += ot, c.length = O, lt === 0) {
                c.mode = 26;
                break;
              }
              if (32 & lt) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & lt) {
                S.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & lt, c.mode = 22;
            case 22:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                c.length += F & (1 << c.extra) - 1, F >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; lt = (b = c.distcode[F & (1 << c.distbits) - 1]) >>> 16 & 255, O = 65535 & b, !((ot = b >>> 24) <= T); ) {
                if (q === 0) break t;
                q--, F += $[G++] << T, T += 8;
              }
              if ((240 & lt) == 0) {
                for (L = ot, H = lt, et = O; lt = (b = c.distcode[et + ((F & (1 << L + H) - 1) >> L)]) >>> 16 & 255, O = 65535 & b, !(L + (ot = b >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                F >>>= L, T -= L, c.back += L;
              }
              if (F >>>= ot, T -= ot, c.back += ot, 64 & lt) {
                S.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = O, c.extra = 15 & lt, c.mode = 24;
            case 24:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                c.offset += F & (1 << c.extra) - 1, F >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                S.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (it === 0) break t;
              if (V = K - it, c.offset > V) {
                if ((V = c.offset - V) > c.whave && c.sane) {
                  S.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                ct = V > c.wnext ? (V -= c.wnext, c.wsize - V) : c.wnext - V, V > c.length && (V = c.length), dt = c.window;
              } else dt = rt, ct = nt - c.offset, V = c.length;
              for (it < V && (V = it), it -= V, c.length -= V; rt[nt++] = dt[ct++], --V; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (it === 0) break t;
              rt[nt++] = c.length, it--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; T < 32; ) {
                  if (q === 0) break t;
                  q--, F |= $[G++] << T, T += 8;
                }
                if (K -= it, S.total_out += K, c.total += K, K && (S.adler = c.check = c.flags ? o(c.check, rt, K, nt - K) : i(c.check, rt, K, nt - K)), K = it, (c.flags ? F : p(F)) !== c.check) {
                  S.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                T = F = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; T < 32; ) {
                  if (q === 0) break t;
                  q--, F += $[G++] << T, T += 8;
                }
                if (F !== (4294967295 & c.total)) {
                  S.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                T = F = 0;
              }
              c.mode = 29;
            case 29:
              I = 1;
              break t;
            case 30:
              I = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return d;
          }
          return S.next_out = nt, S.avail_out = it, S.next_in = G, S.avail_in = q, c.hold = F, c.bits = T, (c.wsize || K !== S.avail_out && c.mode < 30 && (c.mode < 27 || N !== 4)) && J(S, S.output, S.next_out, K - S.avail_out) ? (c.mode = 31, -4) : (tt -= S.avail_in, K -= S.avail_out, S.total_in += tt, S.total_out += K, c.total += K, c.wrap && K && (S.adler = c.check = c.flags ? o(c.check, rt, K, S.next_out - K) : i(c.check, rt, K, S.next_out - K)), S.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (tt == 0 && K === 0 || N === 4) && I === _ && (I = -5), I);
        }, l.inflateEnd = function(S) {
          if (!S || !S.state) return d;
          var N = S.state;
          return N.window && (N.window = null), S.state = null, _;
        }, l.inflateGetHeader = function(S, N) {
          var c;
          return S && S.state ? (2 & (c = S.state).wrap) == 0 ? d : ((c.head = N).done = !1, _) : d;
        }, l.inflateSetDictionary = function(S, N) {
          var c, $ = N.length;
          return S && S.state ? (c = S.state).wrap !== 0 && c.mode !== 11 ? d : c.mode === 11 && i(1, N, $, 0) !== c.check ? -3 : J(S, N, $, $) ? (c.mode = 31, -4) : (c.havedict = 1, _) : d;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], u = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], y = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(v, f, _, d, h, n, g, p) {
          var x, M, k, R, B, P, j, C, W, J = p.bits, S = 0, N = 0, c = 0, $ = 0, rt = 0, G = 0, nt = 0, q = 0, it = 0, F = 0, T = null, tt = 0, K = new s.Buf16(16), V = new s.Buf16(16), ct = null, dt = 0;
          for (S = 0; S <= 15; S++) K[S] = 0;
          for (N = 0; N < d; N++) K[f[_ + N]]++;
          for (rt = J, $ = 15; 1 <= $ && K[$] === 0; $--) ;
          if ($ < rt && (rt = $), $ === 0) return h[n++] = 20971520, h[n++] = 20971520, p.bits = 1, 0;
          for (c = 1; c < $ && K[c] === 0; c++) ;
          for (rt < c && (rt = c), S = q = 1; S <= 15; S++) if (q <<= 1, (q -= K[S]) < 0) return -1;
          if (0 < q && (v === 0 || $ !== 1)) return -1;
          for (V[1] = 0, S = 1; S < 15; S++) V[S + 1] = V[S] + K[S];
          for (N = 0; N < d; N++) f[_ + N] !== 0 && (g[V[f[_ + N]]++] = N);
          if (P = v === 0 ? (T = ct = g, 19) : v === 1 ? (T = i, tt -= 257, ct = o, dt -= 257, 256) : (T = u, ct = y, -1), S = c, B = n, nt = N = F = 0, k = -1, R = (it = 1 << (G = rt)) - 1, v === 1 && 852 < it || v === 2 && 592 < it) return 1;
          for (; ; ) {
            for (j = S - nt, W = g[N] < P ? (C = 0, g[N]) : g[N] > P ? (C = ct[dt + g[N]], T[tt + g[N]]) : (C = 96, 0), x = 1 << S - nt, c = M = 1 << G; h[B + (F >> nt) + (M -= x)] = j << 24 | C << 16 | W | 0, M !== 0; ) ;
            for (x = 1 << S - 1; F & x; ) x >>= 1;
            if (x !== 0 ? (F &= x - 1, F += x) : F = 0, N++, --K[S] == 0) {
              if (S === $) break;
              S = f[_ + g[N]];
            }
            if (rt < S && (F & R) !== k) {
              for (nt === 0 && (nt = rt), B += c, q = 1 << (G = S - nt); G + nt < $ && !((q -= K[G + nt]) <= 0); ) G++, q <<= 1;
              if (it += 1 << G, v === 1 && 852 < it || v === 2 && 592 < it) return 1;
              h[k = F & R] = rt << 24 | G << 16 | B - n | 0;
            }
          }
          return F !== 0 && (h[B + F] = S - nt << 24 | 64 << 16 | 0), p.bits = rt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var s = e("../utils/common"), i = 0, o = 1;
        function u(b) {
          for (var A = b.length; 0 <= --A; ) b[A] = 0;
        }
        var y = 0, v = 29, f = 256, _ = f + 1 + v, d = 30, h = 19, n = 2 * _ + 1, g = 15, p = 16, x = 7, M = 256, k = 16, R = 17, B = 18, P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], J = new Array(2 * (_ + 2));
        u(J);
        var S = new Array(2 * d);
        u(S);
        var N = new Array(512);
        u(N);
        var c = new Array(256);
        u(c);
        var $ = new Array(v);
        u($);
        var rt, G, nt, q = new Array(d);
        function it(b, A, D, U, z) {
          this.static_tree = b, this.extra_bits = A, this.extra_base = D, this.elems = U, this.max_length = z, this.has_stree = b && b.length;
        }
        function F(b, A) {
          this.dyn_tree = b, this.max_code = 0, this.stat_desc = A;
        }
        function T(b) {
          return b < 256 ? N[b] : N[256 + (b >>> 7)];
        }
        function tt(b, A) {
          b.pending_buf[b.pending++] = 255 & A, b.pending_buf[b.pending++] = A >>> 8 & 255;
        }
        function K(b, A, D) {
          b.bi_valid > p - D ? (b.bi_buf |= A << b.bi_valid & 65535, tt(b, b.bi_buf), b.bi_buf = A >> p - b.bi_valid, b.bi_valid += D - p) : (b.bi_buf |= A << b.bi_valid & 65535, b.bi_valid += D);
        }
        function V(b, A, D) {
          K(b, D[2 * A], D[2 * A + 1]);
        }
        function ct(b, A) {
          for (var D = 0; D |= 1 & b, b >>>= 1, D <<= 1, 0 < --A; ) ;
          return D >>> 1;
        }
        function dt(b, A, D) {
          var U, z, Z = new Array(g + 1), Y = 0;
          for (U = 1; U <= g; U++) Z[U] = Y = Y + D[U - 1] << 1;
          for (z = 0; z <= A; z++) {
            var X = b[2 * z + 1];
            X !== 0 && (b[2 * z] = ct(Z[X]++, X));
          }
        }
        function ot(b) {
          var A;
          for (A = 0; A < _; A++) b.dyn_ltree[2 * A] = 0;
          for (A = 0; A < d; A++) b.dyn_dtree[2 * A] = 0;
          for (A = 0; A < h; A++) b.bl_tree[2 * A] = 0;
          b.dyn_ltree[2 * M] = 1, b.opt_len = b.static_len = 0, b.last_lit = b.matches = 0;
        }
        function lt(b) {
          8 < b.bi_valid ? tt(b, b.bi_buf) : 0 < b.bi_valid && (b.pending_buf[b.pending++] = b.bi_buf), b.bi_buf = 0, b.bi_valid = 0;
        }
        function O(b, A, D, U) {
          var z = 2 * A, Z = 2 * D;
          return b[z] < b[Z] || b[z] === b[Z] && U[A] <= U[D];
        }
        function L(b, A, D) {
          for (var U = b.heap[D], z = D << 1; z <= b.heap_len && (z < b.heap_len && O(A, b.heap[z + 1], b.heap[z], b.depth) && z++, !O(A, U, b.heap[z], b.depth)); ) b.heap[D] = b.heap[z], D = z, z <<= 1;
          b.heap[D] = U;
        }
        function H(b, A, D) {
          var U, z, Z, Y, X = 0;
          if (b.last_lit !== 0) for (; U = b.pending_buf[b.d_buf + 2 * X] << 8 | b.pending_buf[b.d_buf + 2 * X + 1], z = b.pending_buf[b.l_buf + X], X++, U === 0 ? V(b, z, A) : (V(b, (Z = c[z]) + f + 1, A), (Y = P[Z]) !== 0 && K(b, z -= $[Z], Y), V(b, Z = T(--U), D), (Y = j[Z]) !== 0 && K(b, U -= q[Z], Y)), X < b.last_lit; ) ;
          V(b, M, A);
        }
        function et(b, A) {
          var D, U, z, Z = A.dyn_tree, Y = A.stat_desc.static_tree, X = A.stat_desc.has_stree, Q = A.stat_desc.elems, at = -1;
          for (b.heap_len = 0, b.heap_max = n, D = 0; D < Q; D++) Z[2 * D] !== 0 ? (b.heap[++b.heap_len] = at = D, b.depth[D] = 0) : Z[2 * D + 1] = 0;
          for (; b.heap_len < 2; ) Z[2 * (z = b.heap[++b.heap_len] = at < 2 ? ++at : 0)] = 1, b.depth[z] = 0, b.opt_len--, X && (b.static_len -= Y[2 * z + 1]);
          for (A.max_code = at, D = b.heap_len >> 1; 1 <= D; D--) L(b, Z, D);
          for (z = Q; D = b.heap[1], b.heap[1] = b.heap[b.heap_len--], L(b, Z, 1), U = b.heap[1], b.heap[--b.heap_max] = D, b.heap[--b.heap_max] = U, Z[2 * z] = Z[2 * D] + Z[2 * U], b.depth[z] = (b.depth[D] >= b.depth[U] ? b.depth[D] : b.depth[U]) + 1, Z[2 * D + 1] = Z[2 * U + 1] = z, b.heap[1] = z++, L(b, Z, 1), 2 <= b.heap_len; ) ;
          b.heap[--b.heap_max] = b.heap[1], (function(st, pt) {
            var zt, _t, Ct, ht, Bt, $t, wt = pt.dyn_tree, Zt = pt.max_code, ue = pt.stat_desc.static_tree, fe = pt.stat_desc.has_stree, me = pt.stat_desc.extra_bits, Gt = pt.stat_desc.extra_base, It = pt.stat_desc.max_length, Ot = 0;
            for (ht = 0; ht <= g; ht++) st.bl_count[ht] = 0;
            for (wt[2 * st.heap[st.heap_max] + 1] = 0, zt = st.heap_max + 1; zt < n; zt++) It < (ht = wt[2 * wt[2 * (_t = st.heap[zt]) + 1] + 1] + 1) && (ht = It, Ot++), wt[2 * _t + 1] = ht, Zt < _t || (st.bl_count[ht]++, Bt = 0, Gt <= _t && (Bt = me[_t - Gt]), $t = wt[2 * _t], st.opt_len += $t * (ht + Bt), fe && (st.static_len += $t * (ue[2 * _t + 1] + Bt)));
            if (Ot !== 0) {
              do {
                for (ht = It - 1; st.bl_count[ht] === 0; ) ht--;
                st.bl_count[ht]--, st.bl_count[ht + 1] += 2, st.bl_count[It]--, Ot -= 2;
              } while (0 < Ot);
              for (ht = It; ht !== 0; ht--) for (_t = st.bl_count[ht]; _t !== 0; ) Zt < (Ct = st.heap[--zt]) || (wt[2 * Ct + 1] !== ht && (st.opt_len += (ht - wt[2 * Ct + 1]) * wt[2 * Ct], wt[2 * Ct + 1] = ht), _t--);
            }
          })(b, A), dt(Z, at, b.bl_count);
        }
        function r(b, A, D) {
          var U, z, Z = -1, Y = A[1], X = 0, Q = 7, at = 4;
          for (Y === 0 && (Q = 138, at = 3), A[2 * (D + 1) + 1] = 65535, U = 0; U <= D; U++) z = Y, Y = A[2 * (U + 1) + 1], ++X < Q && z === Y || (X < at ? b.bl_tree[2 * z] += X : z !== 0 ? (z !== Z && b.bl_tree[2 * z]++, b.bl_tree[2 * k]++) : X <= 10 ? b.bl_tree[2 * R]++ : b.bl_tree[2 * B]++, Z = z, at = (X = 0) === Y ? (Q = 138, 3) : z === Y ? (Q = 6, 3) : (Q = 7, 4));
        }
        function I(b, A, D) {
          var U, z, Z = -1, Y = A[1], X = 0, Q = 7, at = 4;
          for (Y === 0 && (Q = 138, at = 3), U = 0; U <= D; U++) if (z = Y, Y = A[2 * (U + 1) + 1], !(++X < Q && z === Y)) {
            if (X < at) for (; V(b, z, b.bl_tree), --X != 0; ) ;
            else z !== 0 ? (z !== Z && (V(b, z, b.bl_tree), X--), V(b, k, b.bl_tree), K(b, X - 3, 2)) : X <= 10 ? (V(b, R, b.bl_tree), K(b, X - 3, 3)) : (V(b, B, b.bl_tree), K(b, X - 11, 7));
            Z = z, at = (X = 0) === Y ? (Q = 138, 3) : z === Y ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        u(q);
        var E = !1;
        function w(b, A, D, U) {
          K(b, (y << 1) + (U ? 1 : 0), 3), (function(z, Z, Y, X) {
            lt(z), tt(z, Y), tt(z, ~Y), s.arraySet(z.pending_buf, z.window, Z, Y, z.pending), z.pending += Y;
          })(b, A, D);
        }
        l._tr_init = function(b) {
          E || ((function() {
            var A, D, U, z, Z, Y = new Array(g + 1);
            for (z = U = 0; z < v - 1; z++) for ($[z] = U, A = 0; A < 1 << P[z]; A++) c[U++] = z;
            for (c[U - 1] = z, z = Z = 0; z < 16; z++) for (q[z] = Z, A = 0; A < 1 << j[z]; A++) N[Z++] = z;
            for (Z >>= 7; z < d; z++) for (q[z] = Z << 7, A = 0; A < 1 << j[z] - 7; A++) N[256 + Z++] = z;
            for (D = 0; D <= g; D++) Y[D] = 0;
            for (A = 0; A <= 143; ) J[2 * A + 1] = 8, A++, Y[8]++;
            for (; A <= 255; ) J[2 * A + 1] = 9, A++, Y[9]++;
            for (; A <= 279; ) J[2 * A + 1] = 7, A++, Y[7]++;
            for (; A <= 287; ) J[2 * A + 1] = 8, A++, Y[8]++;
            for (dt(J, _ + 1, Y), A = 0; A < d; A++) S[2 * A + 1] = 5, S[2 * A] = ct(A, 5);
            rt = new it(J, P, f + 1, _, g), G = new it(S, j, 0, d, g), nt = new it(new Array(0), C, 0, h, x);
          })(), E = !0), b.l_desc = new F(b.dyn_ltree, rt), b.d_desc = new F(b.dyn_dtree, G), b.bl_desc = new F(b.bl_tree, nt), b.bi_buf = 0, b.bi_valid = 0, ot(b);
        }, l._tr_stored_block = w, l._tr_flush_block = function(b, A, D, U) {
          var z, Z, Y = 0;
          0 < b.level ? (b.strm.data_type === 2 && (b.strm.data_type = (function(X) {
            var Q, at = 4093624447;
            for (Q = 0; Q <= 31; Q++, at >>>= 1) if (1 & at && X.dyn_ltree[2 * Q] !== 0) return i;
            if (X.dyn_ltree[18] !== 0 || X.dyn_ltree[20] !== 0 || X.dyn_ltree[26] !== 0) return o;
            for (Q = 32; Q < f; Q++) if (X.dyn_ltree[2 * Q] !== 0) return o;
            return i;
          })(b)), et(b, b.l_desc), et(b, b.d_desc), Y = (function(X) {
            var Q;
            for (r(X, X.dyn_ltree, X.l_desc.max_code), r(X, X.dyn_dtree, X.d_desc.max_code), et(X, X.bl_desc), Q = h - 1; 3 <= Q && X.bl_tree[2 * W[Q] + 1] === 0; Q--) ;
            return X.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          })(b), z = b.opt_len + 3 + 7 >>> 3, (Z = b.static_len + 3 + 7 >>> 3) <= z && (z = Z)) : z = Z = D + 5, D + 4 <= z && A !== -1 ? w(b, A, D, U) : b.strategy === 4 || Z === z ? (K(b, 2 + (U ? 1 : 0), 3), H(b, J, S)) : (K(b, 4 + (U ? 1 : 0), 3), (function(X, Q, at, st) {
            var pt;
            for (K(X, Q - 257, 5), K(X, at - 1, 5), K(X, st - 4, 4), pt = 0; pt < st; pt++) K(X, X.bl_tree[2 * W[pt] + 1], 3);
            I(X, X.dyn_ltree, Q - 1), I(X, X.dyn_dtree, at - 1);
          })(b, b.l_desc.max_code + 1, b.d_desc.max_code + 1, Y + 1), H(b, b.dyn_ltree, b.dyn_dtree)), ot(b), U && lt(b);
        }, l._tr_tally = function(b, A, D) {
          return b.pending_buf[b.d_buf + 2 * b.last_lit] = A >>> 8 & 255, b.pending_buf[b.d_buf + 2 * b.last_lit + 1] = 255 & A, b.pending_buf[b.l_buf + b.last_lit] = 255 & D, b.last_lit++, A === 0 ? b.dyn_ltree[2 * D]++ : (b.matches++, A--, b.dyn_ltree[2 * (c[D] + f + 1)]++, b.dyn_dtree[2 * T(A)]++), b.last_lit === b.lit_bufsize - 1;
        }, l._tr_align = function(b) {
          K(b, 2, 3), V(b, M, J), (function(A) {
            A.bi_valid === 16 ? (tt(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(b);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(s) {
          (function(i, o) {
            if (!i.setImmediate) {
              var u, y, v, f, _ = 1, d = {}, h = !1, n = i.document, g = Object.getPrototypeOf && Object.getPrototypeOf(i);
              g = g && g.setTimeout ? g : i, u = {}.toString.call(i.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  x(k);
                });
              } : (function() {
                if (i.postMessage && !i.importScripts) {
                  var k = !0, R = i.onmessage;
                  return i.onmessage = function() {
                    k = !1;
                  }, i.postMessage("", "*"), i.onmessage = R, k;
                }
              })() ? (f = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", M, !1) : i.attachEvent("onmessage", M), function(k) {
                i.postMessage(f + k, "*");
              }) : i.MessageChannel ? ((v = new MessageChannel()).port1.onmessage = function(k) {
                x(k.data);
              }, function(k) {
                v.port2.postMessage(k);
              }) : n && "onreadystatechange" in n.createElement("script") ? (y = n.documentElement, function(k) {
                var R = n.createElement("script");
                R.onreadystatechange = function() {
                  x(k), R.onreadystatechange = null, y.removeChild(R), R = null;
                }, y.appendChild(R);
              }) : function(k) {
                setTimeout(x, 0, k);
              }, g.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var R = new Array(arguments.length - 1), B = 0; B < R.length; B++) R[B] = arguments[B + 1];
                var P = { callback: k, args: R };
                return d[_] = P, u(_), _++;
              }, g.clearImmediate = p;
            }
            function p(k) {
              delete d[k];
            }
            function x(k) {
              if (h) setTimeout(x, 0, k);
              else {
                var R = d[k];
                if (R) {
                  h = !0;
                  try {
                    (function(B) {
                      var P = B.callback, j = B.args;
                      switch (j.length) {
                        case 0:
                          P();
                          break;
                        case 1:
                          P(j[0]);
                          break;
                        case 2:
                          P(j[0], j[1]);
                          break;
                        case 3:
                          P(j[0], j[1], j[2]);
                          break;
                        default:
                          P.apply(o, j);
                      }
                    })(R);
                  } finally {
                    p(k), h = !1;
                  }
                }
              }
            }
            function M(k) {
              k.source === i && typeof k.data == "string" && k.data.indexOf(f) === 0 && x(+k.data.slice(f.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Ut)), Ut.exports;
}
var ge = ye();
const ie = /* @__PURE__ */ pe(ge);
async function _e(m) {
  const t = await be(m), e = await ie.loadAsync(t), a = [];
  return e.forEach((l, s) => {
    if (s.dir)
      return;
    const i = ve(l);
    a.push({
      name: i,
      text: () => s.async("text"),
      arrayBuffer: () => s.async("arraybuffer")
    });
  }), a;
}
async function be(m) {
  if (m instanceof ArrayBuffer)
    return m;
  if (m instanceof Blob)
    return await m.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function ve(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function we(m) {
  return !!m && typeof m == "object" && !(m instanceof ArrayBuffer) && !(m instanceof Uint8Array);
}
function xe(m) {
  return m instanceof Uint8Array ? m : new Uint8Array(m);
}
function ke(m) {
  return m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer;
}
function St(m, t, e = 0) {
  if (m.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (m[e + a] !== t[a]) return !1;
  return !0;
}
function Se(m) {
  return St(m, [80, 75, 3, 4]) || St(m, [80, 75, 5, 6]) || St(m, [80, 75, 7, 8]) ? "zip" : St(m, [82, 97, 114, 33, 26, 7, 0]) || St(m, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : St(m, [55, 122, 188, 175, 39, 28]) ? "7z" : m.length > 262 && St(m, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function ne(m) {
  return m.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Vt(m) {
  const t = [], e = m.map((n) => ne(n).toLowerCase()), a = (n) => e.some(n), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((n) => l.test(n)).length, o = e.filter((n) => s.test(n) || n.includes("drill")).length, u = a((n) => n.includes("top") && n.includes("copper") || n.endsWith(".gtl")), y = a((n) => n.includes("bot") || n.includes("bottom") || n.endsWith(".gbl")), v = a((n) => n.includes("mask") || n.includes("solder") || n.endsWith(".gts") || n.endsWith(".gbs")), f = a((n) => n.includes("silk") || n.includes("legend") || n.endsWith(".gto") || n.endsWith(".gbo")), _ = a((n) => n.includes("outline") || n.includes("profile") || n.includes("edge") || n.endsWith(".gko") || n.endsWith(".gm1") || n.endsWith(".gml")), d = e.every(
    (n) => n.endsWith(".pdf") || n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".svg") || n.endsWith(".txt") || n.endsWith(".md")
  );
  let h = 0;
  return m.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (h += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), o > 0 && (h += 0.2, t.push(`Found ${o} drill-like file(s).`)), _ && (h += 0.15, t.push("Found outline/profile/edge candidate.")), u && y ? (h += 0.2, t.push("Found both top and bottom copper candidates.")) : (u || y) && (h += 0.1, t.push("Found at least one copper candidate.")), v && (h += 0.05, t.push("Found solder mask candidate.")), f && (h += 0.05, t.push("Found silkscreen/legend candidate.")), h = Math.max(0, Math.min(1, h)), h < 0.6 && i >= 2 && (h = Math.max(h, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: h, reasons: t });
}
async function Me(m) {
  if (we(m)) {
    const s = Object.keys(m).map(ne), { confidence: i, reasons: o } = Vt(s);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: o,
      files: s
    };
  }
  const t = xe(m), e = Se(t);
  if (e === "zip")
    try {
      const s = ke(t), o = (await _e(s)).map((v) => v.name), { confidence: u, reasons: y } = Vt(o);
      return {
        isGerber: u >= 0.6,
        archiveType: "zip",
        confidence: u,
        reasons: y,
        files: o
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
function se(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Re(m) {
  return m instanceof Uint8Array ? m : new Uint8Array(m);
}
function oe(m) {
  try {
    return m.slice().buffer;
  } catch {
    const t = new Uint8Array(m.byteLength);
    return t.set(m), t.buffer;
  }
}
async function Ae(m) {
  let t;
  try {
    t = await ie.loadAsync(oe(m));
  } catch (o) {
    throw new ft(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      o
    );
  }
  const e = {}, a = 1e3, l = 100 * 1024 * 1024, s = Object.entries(t.files).filter(([, o]) => o && !o.dir);
  if (s.length > a)
    throw new ft(
      "PARSE_ERROR",
      `ZIP contains too many files (${s.length} > ${a})`
    );
  let i = 0;
  for (const [o, u] of s)
    try {
      const y = se(o), v = await u.async("arraybuffer");
      if (i += v.byteLength, i > l)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[y] = new Uint8Array(v);
    } catch (y) {
      console.warn(`Failed to extract file ${o}:`, y);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Ee(m, t) {
  let e;
  try {
    const f = await import("./libarchive-Bt1VdZR0.js");
    e = f.Archive ?? f.default?.Archive;
  } catch (f) {
    throw new ft(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      f
    );
  }
  if (!e)
    throw new ft("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (f) {
      throw new ft(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        f
      );
    }
  let a;
  try {
    const f = new Blob([oe(m)], { type: "application/octet-stream" });
    a = await e.open(f);
  } catch (f) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", f);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
      new Promise(
        (f, _) => setTimeout(() => _(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (f) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", f);
  }
  const s = {};
  let i = 0;
  const o = 1e3, u = 100 * 1024 * 1024;
  let y = 0;
  async function v(f, _) {
    if (i >= o)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${o})`
      );
    for (const d of Object.keys(f)) {
      const h = f[d], n = _ ? `${_}/${d}` : d;
      if (h instanceof File || h instanceof Blob) {
        i++;
        try {
          const g = await h.arrayBuffer();
          if (y += g.byteLength, y > u)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${u} bytes)`
            );
          s[se(n)] = new Uint8Array(g);
        } catch (g) {
          console.warn(`Failed to extract file ${n}:`, g);
        }
      } else h && typeof h == "object" && await v(h, n);
    }
  }
  try {
    await v(l, "");
  } finally {
    if (a && typeof a.close == "function")
      try {
        await a.close();
      } catch (f) {
        console.warn("Failed to close archive:", f);
      }
  }
  if (Object.keys(s).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return s;
}
async function ae(m, t) {
  if (!m || m.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = Re(m), a = 100 * 1024 * 1024;
  if (e.length > a)
    throw new ft(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${a} bytes)`
    );
  let l;
  try {
    l = await Me(e);
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
      return { archiveType: "zip", files: await Ae(e) };
    if (l.archiveType === "rar")
      return { archiveType: "rar", files: await Ee(e, t) };
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
function Lt(m) {
  return m.toLowerCase();
}
function Mt(m, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return m.filter((l) => {
    const s = Lt(l), i = s.lastIndexOf(".");
    return i < 0 ? !1 : e.has(s.slice(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function ut(m, t) {
  const e = t.map((l) => l.toLowerCase());
  return m.filter((l) => {
    const s = Lt(l);
    return e.every((i) => s.includes(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function ze(m) {
  const t = [], e = (a) => Lt(a);
  for (const a of m) {
    const l = e(a), s = l.split("/").pop() || l, i = s.slice(s.lastIndexOf("."));
    if (i === ".drl" || i === ".xln" || i === ".exc" || i === ".ncd") {
      t.push(a);
      continue;
    }
    if (i === ".txt" && (s.includes("hole") || s.includes("drill") || s.includes("npth") || s.includes("-pth"))) {
      t.push(a);
      continue;
    }
    if ((s.includes("drill") || s.includes("npth") || s.includes("-pth")) && (i === ".gbr" || i === ".ger" || i === ".txt" || i === "")) {
      t.push(a);
      continue;
    }
  }
  return t;
}
function Ce(m) {
  const t = m.filter((v) => {
    const f = Lt(v);
    return !(f.endsWith("/") || f.includes("__macosx") || f.endsWith(".ds_store"));
  }), e = Mt(t, [".gtl"]) || ut(t, ["f_cu"]) || ut(t, ["top", "cu"]) || ut(t, ["top", "copper"]), a = Mt(t, [".gbl"]) || ut(t, ["b_cu"]) || ut(t, ["bottom", "cu"]) || ut(t, ["bottom", "copper"]), l = Mt(t, [".gts"]) || ut(t, ["f_mask"]) || ut(t, ["top", "mask"]), s = Mt(t, [".gbs"]) || ut(t, ["b_mask"]) || ut(t, ["bottom", "mask"]), i = Mt(t, [".gto"]) || ut(t, ["f_silks"]) || ut(t, ["f_silk"]) || ut(t, ["top", "silk"]), o = Mt(t, [".gbo"]) || ut(t, ["b_silks"]) || ut(t, ["b_silk"]) || ut(t, ["bottom", "silk"]), u = Mt(t, [".gko", ".gm1"]) || ut(t, ["edge", "cuts"]) || ut(t, ["outline"]) || ut(t, ["board", "outline"]), y = ze(t);
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: o,
    outline: u,
    drills: y.length ? y : void 0
  };
}
const Ie = 0.8;
function Rt(m, t, e) {
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
  for (const s of l) {
    let i = s.trim();
    if (i && !i.startsWith("G04")) {
      if (i.startsWith("%") && i.endsWith("%")) {
        Te(i, a);
        continue;
      }
      i.endsWith("*") && (i = i.slice(0, -1)), Be(i, a);
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
function Te(m, t) {
  let e = m;
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
    let o, u, y, v, f;
    if (i) {
      const d = i.split(/[Xx]/).filter(Boolean), h = d[0] ? parseFloat(d[0]) * t.unitScale : void 0, n = d[1] ? parseFloat(d[1]) * t.unitScale : void 0, g = d[2] ? parseFloat(d[2]) * t.unitScale : void 0, p = d[3] ? parseFloat(d[3]) : void 0;
      p !== void 0 && !Number.isNaN(p) && p !== 0 && (f = p), s === "C" ? o = h : s === "R" || s === "O" ? (u = h, y = n, o = h !== void 0 && n !== void 0 ? Math.min(h, n) : h ?? n) : (u = h, y = n, g !== void 0 && (v = g), o = h !== void 0 && n !== void 0 ? Math.min(h, n) : h ?? n);
    }
    const _ = {
      code: l,
      shape: s,
      diameterMm: o,
      widthMm: u,
      heightMm: y,
      cornerMm: v,
      rotationDeg: f
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
function Ht(m, t, e, a, l) {
  const s = m.x + e, i = m.y + a, o = Math.sqrt(e * e + a * a);
  if (o < 1e-6) return [t];
  const u = Math.atan2(m.y - i, m.x - s), y = Math.atan2(t.y - i, t.x - s), f = (t.x - m.x) ** 2 + (t.y - m.y) ** 2 < (o * 1e-3) ** 2;
  let _;
  f ? _ = l ? -2 * Math.PI : 2 * Math.PI : (_ = y - u, l ? _ > 1e-6 && (_ -= 2 * Math.PI) : _ < -1e-6 && (_ += 2 * Math.PI));
  const d = Math.min(64, Math.max(4, Math.ceil(Math.abs(_) / (Math.PI / 16)))), h = [];
  for (let n = 1; n <= d; n++) {
    const g = u + _ * n / d;
    h.push({ x: s + o * Math.cos(g), y: i + o * Math.sin(g) });
  }
  return h;
}
function Be(m, t) {
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
      const n = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(n), t.ops.push({
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
    const n = t.apertures.get(a);
    n && (t.currentAperture = n);
    return;
  }
  const s = /X([+\-]?\d+)/.exec(m), i = /Y([+\-]?\d+)/.exec(m), o = /I([+\-]?\d+)/.exec(m), u = /J([+\-]?\d+)/.exec(m);
  let y = t.x, v = t.y;
  s && (y = Nt(s[1], t)), i && (v = Nt(i[1], t));
  const f = o ? Nt(o[1], t) : 0, _ = u ? Nt(u[1], t) : 0;
  if (a === null) {
    t.x = y, t.y = v;
    return;
  }
  if (t.inRegion) {
    const n = t.x, g = t.y;
    if (a === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: n, y: g }), t.arcMode !== 1 && (f !== 0 || _ !== 0)) {
        const p = Ht({ x: n, y: g }, { x: y, y: v }, f, _, t.arcMode === 2);
        for (const x of p) t.currentPath.push(x);
      } else
        t.currentPath.push({ x: y, y: v });
    else a === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = y, t.y = v;
    return;
  }
  const d = t.x, h = t.y;
  if (a === 1) {
    if (!t.currentAperture) {
      t.x = y, t.y = v;
      return;
    }
    const n = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (f !== 0 || _ !== 0)) {
      const g = Ht({ x: d, y: h }, { x: y, y: v }, f, _, t.arcMode === 2);
      let p = { x: d, y: h };
      for (const x of g)
        t.tracks.push({ start: p, end: x, width: n, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: p, end: x, widthMm: n }), p = x;
    } else
      t.tracks.push({
        start: { x: d, y: h },
        end: { x: y, y: v },
        width: n,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: d, y: h },
        end: { x: y, y: v },
        widthMm: n
      });
    t.x = y, t.y = v;
    return;
  }
  if (a === 2) {
    t.x = y, t.y = v;
    return;
  }
  if (a === 3) {
    if (t.currentAperture) {
      const n = t.currentAperture, g = n.diameterMm !== void 0 ? n.diameterMm : Ie, p = (n.rotationDeg ?? 0) + t.loadRotationDeg, x = p !== 0 ? p : void 0, M = {
        position: { x: y, y: v },
        diameterMm: g,
        shape: n.shape,
        polarity: t.currentPolarity,
        rotationDeg: x
      };
      n.widthMm !== void 0 && (M.widthMm = n.widthMm), n.heightMm !== void 0 && (M.heightMm = n.heightMm), n.cornerMm !== void 0 && (M.cornerMm = n.cornerMm), t.flashes.push(M), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: y, y: v },
        diameterMm: g,
        shape: n.shape,
        widthMm: n.widthMm,
        heightMm: n.heightMm,
        cornerMm: n.cornerMm,
        rotationDeg: x
      });
    }
    t.x = y, t.y = v;
    return;
  }
}
function Nt(m, t) {
  const e = m.startsWith("-") ? -1 : 1, a = m.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const s = Math.pow(10, t.fmtDec), i = l / s * t.unitScale;
  return e * i;
}
function Oe(m, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const s = [];
  let i = 1, o = 4, u = !1;
  const y = (v) => {
    if (v.includes(".")) return parseFloat(v) * i;
    const f = v.startsWith("-") ? -1 : 1, _ = v.replace(/[+\-]/, ""), d = parseInt(_, 10);
    return Number.isNaN(d) ? 0 : f * (d / Math.pow(10, o)) * i;
  };
  for (const v of e) {
    const f = v.trim();
    if (!f || f.startsWith(";")) continue;
    if (f === "M48") {
      u = !0;
      continue;
    }
    if (f === "%" && u) {
      u = !1;
      continue;
    }
    if (f === "M30" || f === "M00") break;
    if (u) {
      f.startsWith("METRIC") ? i = 1 : f.startsWith("INCH") && (i = 25.4);
      const d = /^FMAT,(\d+)\.(\d+)/.exec(f) || /^(\d+)\.(\d+)$/.exec(f);
      d && (parseInt(d[1], 10), o = parseInt(d[2], 10));
    }
    if (/^T\d+C[\d.]+/i.test(f)) {
      const d = /^T(\d+)C([\d.]+)/i.exec(f);
      if (d) {
        const h = parseFloat(d[2]) * i;
        Number.isNaN(h) || a.set(d[1], h);
      }
      continue;
    }
    if (/^T\d+$/i.test(f)) {
      const d = /^T(\d+)/i.exec(f);
      d && (l = d[1]);
      continue;
    }
    if (/^[GRMF]/.test(f) && !/^X/.test(f)) continue;
    const _ = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(f);
    if (_) {
      const d = y(_[1]), h = y(_[2]);
      if (!Number.isNaN(d) && !Number.isNaN(h)) {
        const n = l && a.has(l) ? a.get(l) : 0.6;
        s.push({ x: d, y: h, diameter: n, plated: !0 });
      }
    }
  }
  return { name: m, holes: s };
}
function Pe(m) {
  return { w: m.maxX - m.minX, h: m.maxY - m.minY };
}
function Tt(m) {
  const { w: t, h: e } = Pe(m);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function xt(m, t) {
  if (!Number.isFinite(m) || !Number.isFinite(t) || m <= 0 || t <= 0) return 1;
  const e = m / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function At(m, t) {
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
function Fe(m, t) {
  return t === 1 ? m : m.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Ne(m) {
  return URL.createObjectURL(new Blob([m], { type: "image/svg+xml" }));
}
function gt(m, t, e) {
  m.minX = Math.min(m.minX, t), m.minY = Math.min(m.minY, e), m.maxX = Math.max(m.maxX, t), m.maxY = Math.max(m.maxY, e);
}
function Yt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function bt(m) {
  const t = Yt();
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
function De(m) {
  const t = Yt();
  for (const e of m) {
    const a = (e.diameter || 0) / 2;
    gt(t, e.x - a, e.y - a), gt(t, e.x + a, e.y + a);
  }
  return t;
}
function Kt(m, t) {
  return {
    minX: Math.min(m.minX, t.minX),
    minY: Math.min(m.minY, t.minY),
    maxX: Math.max(m.maxX, t.maxX),
    maxY: Math.max(m.maxY, t.maxY)
  };
}
function yt(m) {
  return !Number.isFinite(m.minX) || !Number.isFinite(m.minY) || !Number.isFinite(m.maxX) || !Number.isFinite(m.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (m.maxX - m.minX < 1e-6 && (m.maxX = m.minX + 1), m.maxY - m.minY < 1e-6 && (m.maxY = m.minY + 1), m);
}
const Le = 1e3;
function mt(m) {
  return m / 25.4 * Le;
}
function Et(m, t, e) {
  const a = m - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Xt(m, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${m}" height="${t}" viewBox="0 0 ${m} ${t}">
  <rect width="${m}" height="${t}" fill="white"/>
</svg>`.trim();
}
function vt(m, t = 1e-4) {
  const e = Math.round(m.x / t) * t, a = Math.round(m.y / t) * t;
  return `${e.toFixed(4)},${a.toFixed(4)}`;
}
function Jt(m) {
  let t = 0;
  const e = m.length;
  for (let a = 0; a < e; a++) {
    const l = m[a], s = m[(a + 1) % e];
    t += l.x * s.y - s.x * l.y;
  }
  return 0.5 * t;
}
function Wt(m, t, e) {
  if (!m.length) return "";
  const a = (i) => ({
    x: (i.x - t.minX) * e,
    y: (t.maxY - i.y) * e
  }), l = a(m[0]), s = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let i = 1; i < m.length; i++) {
    const o = a(m[i]);
    s.push(`L ${o.x.toFixed(2)} ${o.y.toFixed(2)}`);
  }
  return s.push("Z"), s.join(" ");
}
function le(m) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (y, v) => {
    const f = vt(y), _ = vt(v);
    t.has(f) || t.set(f, []), t.has(_) || t.set(_, []), t.get(f).push(v), t.get(_).push(y), e.has(f) || e.set(f, y), e.has(_) || e.set(_, v);
  };
  for (const y of m) a(y.start, y.end);
  const l = /* @__PURE__ */ new Set(), s = (y, v) => {
    const f = vt(y), _ = vt(v);
    return f < _ ? `${f}|${_}` : `${_}|${f}`;
  }, i = [];
  for (const [y, v] of t.entries()) {
    const f = e.get(y);
    for (const _ of v) {
      const d = s(f, _);
      if (l.has(d)) continue;
      const h = [f];
      let n = f, g = _;
      l.add(d);
      for (let p = 0; p < 1e5; p++) {
        h.push(g);
        const x = vt(g), M = t.get(x) ?? [];
        if (M.length === 0) break;
        let k = null;
        for (const R of M) {
          if (vt(R) === vt(n) && M.length > 1) continue;
          const B = s(g, R);
          if (!l.has(B)) {
            k = R, l.add(B);
            break;
          }
        }
        if (k || (k = M[0]), n = g, g = k, vt(g) === vt(f))
          break;
      }
      h.length >= 3 && i.push(h);
    }
  }
  i.sort((y, v) => Math.abs(Jt(v)) - Math.abs(Jt(y)));
  const o = [], u = /* @__PURE__ */ new Set();
  for (const y of i) {
    const v = y.map((f) => vt(f)).join(";");
    u.has(v) || (u.add(v), o.push(y));
  }
  return o;
}
function Qt(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = mt(1), o = [];
  for (const u of m.regions)
    for (const y of u.loops)
      o.push(Wt(y, t, i));
  if (o.length === 0 && m.tracks.length) {
    const u = le(m.tracks);
    if (u.length) {
      const y = u[0];
      o.push(Wt(y, t, i));
      for (let v = 1; v < u.length; v++)
        o.push(Wt(u[v], t, i));
    }
  }
  return o.length === 0 ? Xt(l, s) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  <rect x="0" y="0" width="${l}" height="${s}" fill="black"/>
  <path d="${o.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function ce(m) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const s of m.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), a = Math.max(a, i.x), l = Math.max(l, i.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function $e(m, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const y of m.regions) {
    const v = ce(y), f = (v.maxX - v.minX) * (v.maxY - v.minY);
    y.polarity === "clear" ? l = Math.max(l, f) : a = Math.max(a, f);
  }
  const s = m.tracks.filter((y) => y.polarity !== "clear").length + m.flashes.filter((y) => y.polarity !== "clear").length + m.regions.filter((y) => y.polarity !== "clear").length, i = m.tracks.filter((y) => y.polarity === "clear").length + m.flashes.filter((y) => y.polarity === "clear").length + m.regions.filter((y) => y.polarity === "clear").length, o = l > e * 0.85;
  return !(a > e * 0.85 || !o || !(i > s * 2));
}
function Dt(m, t, e, a) {
  const l = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(mt(l))), o = Math.max(1, Math.round(mt(s))), u = mt(1), y = $e(m, t), v = y ? "white" : "black", f = (k, R) => {
    const B = k - t.minX, P = t.maxY - R;
    return { x: B * u, y: P * u };
  }, _ = (k, R) => {
    if (k.kind === "track") {
      const B = f(k.start.x, k.start.y), P = f(k.end.x, k.end.y), j = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, C = Math.max(1, j * u);
      return `<line x1="${B.x.toFixed(2)}" y1="${B.y.toFixed(2)}" x2="${P.x.toFixed(2)}" y2="${P.y.toFixed(2)}" stroke-width="${C.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${R}" stroke="${R}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const B = f(k.position.x, k.position.y), P = k.widthMm ?? k.diameterMm ?? 0.8, j = k.heightMm ?? k.diameterMm ?? 0.8, C = Math.max(0.01, Number.isFinite(P) ? P : 0.8) * u, W = Math.max(0.01, Number.isFinite(j) ? j : 0.8) * u, J = B.x - C / 2, S = B.y - W / 2, N = k.rotationDeg, c = N && Math.abs(N) > 0.01 ? ` transform="rotate(${(-N).toFixed(2)},${B.x.toFixed(2)},${B.y.toFixed(2)})"` : "";
      if (k.shape === "R" || k.shape === "O") {
        const rt = k.shape === "O" ? Math.min(C, W) * 0.5 : 0;
        return `<rect x="${J.toFixed(2)}" y="${S.toFixed(2)}" width="${C.toFixed(2)}" height="${W.toFixed(2)}" rx="${rt.toFixed(2)}" ry="${rt.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      if (Number.isFinite(k.cornerMm) && (k.cornerMm ?? 0) > 0) {
        const rt = Math.max(0, k.cornerMm * u);
        return `<rect x="${J.toFixed(2)}" y="${S.toFixed(2)}" width="${C.toFixed(2)}" height="${W.toFixed(2)}" rx="${rt.toFixed(2)}" ry="${rt.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      const $ = Math.max(1, Math.max(C, W) / 2);
      return `<circle cx="${B.x.toFixed(2)}" cy="${B.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
    }
    if (k.kind === "region") {
      const B = k.loops.map((P) => {
        if (!P.length) return "";
        const j = f(P[0].x, P[0].y), C = [`M ${j.x.toFixed(2)} ${j.y.toFixed(2)}`];
        for (let W = 1; W < P.length; W++) {
          const J = f(P[W].x, P[W].y);
          C.push(`L ${J.x.toFixed(2)} ${J.y.toFixed(2)}`);
        }
        return C.push("Z"), C.join(" ");
      }).join(" ");
      return B.trim() ? `<path d="${B}" fill-rule="evenodd" fill="${R}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  for (const k of m.ops) {
    const R = k.polarity === "clear" ? "black" : "white", B = _(k, R);
    B && d.push(B);
  }
  console.log("[polarity counts]", {
    tracksClear: m.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: m.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: y
  });
  const h = (t.maxX - t.minX) * (t.maxY - t.minY);
  let n = 0, g = 0;
  for (const k of m.regions) {
    const R = ce(k), B = (R.maxX - R.minX) * (R.maxY - R.minY);
    k.polarity === "clear" ? g = Math.max(g, B) : n = Math.max(n, B);
  }
  const p = m.tracks.filter((k) => k.polarity !== "clear").length + m.flashes.filter((k) => k.polarity !== "clear").length + m.regions.filter((k) => k.polarity !== "clear").length, x = m.tracks.filter((k) => k.polarity === "clear").length + m.flashes.filter((k) => k.polarity === "clear").length + m.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: p,
    clearCount: x,
    largestDarkRegionArea: n,
    largestClearRegionArea: g,
    boardArea: h,
    negative: y
  });
  const M = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${o}" viewBox="0 0 ${i} ${o}">
  <defs>
    <mask id="${M}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${o}" fill="${v}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${o}" fill="${e}" opacity="${a}" mask="url(#${M})" />
</svg>`.trim();
}
function te(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = Math.max(1e-6, mt(1)), o = "rgba(255,255,255,0.95)", u = "rgba(255,255,255,0.95)", y = m.tracks.map((_) => {
    const d = Et(_.start.x, _.start.y, t), h = Et(_.end.x, _.end.y, t), n = Number.isFinite(_.width) ? _.width : 0.15, g = Math.max(1, n * i);
    return `<line x1="${(d.x * i).toFixed(2)}" y1="${(d.y * i).toFixed(2)}" x2="${(h.x * i).toFixed(2)}" y2="${(h.y * i).toFixed(2)}" stroke="${o}" stroke-width="${g.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), v = m.flashes.map((_) => {
    const d = Et(_.position.x, _.position.y, t), h = d.x * i, n = d.y * i, g = _.widthMm ?? _.diameterMm ?? 0.6, p = _.heightMm ?? _.diameterMm ?? 0.6;
    if (_.shape === "R" || _.shape === "O") {
      const M = g * i, k = p * i, R = h - M / 2, B = n - k / 2, P = _.shape === "O" ? Math.min(M, k) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${B.toFixed(2)}" width="${M.toFixed(2)}" height="${k.toFixed(2)}" rx="${P.toFixed(2)}" fill="${u}" />`;
    }
    const x = (_.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${h.toFixed(2)}" cy="${n.toFixed(2)}" r="${Math.max(1, x).toFixed(2)}" fill="${u}" />`;
  }), f = m.regions.map((_) => {
    const d = _.loops.map((h) => {
      if (!h.length) return "";
      const n = Et(h[0].x, h[0].y, t), g = [`M ${(n.x * i).toFixed(2)} ${(n.y * i).toFixed(2)}`];
      for (let p = 1; p < h.length; p++) {
        const x = Et(h[p].x, h[p].y, t);
        g.push(`L ${(x.x * i).toFixed(2)} ${(x.y * i).toFixed(2)}`);
      }
      return g.push("Z"), g.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${u}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${y.join(`
  `)}
  ${v.join(`
  `)}
  ${f.join(`
  `)}
</svg>`.trim();
}
function Ue(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.round(mt(e)), s = Math.round(mt(a)), i = mt(1), o = m.map((u) => {
    const y = Et(u.x, u.y, t), v = y.x * i, f = y.y * i, _ = Math.max(1.5, (u.diameter || 0.6) * i / 2);
    return `<circle cx="${v.toFixed(2)}" cy="${f.toFixed(2)}" r="${(_ + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${v.toFixed(2)}" cy="${f.toFixed(2)}" r="${_.toFixed(2)}" fill="#111111" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${o.join(`
  `)}
</svg>`.trim();
}
async function de(m) {
  const t = Object.keys(m).filter((Y) => !!Y), e = Ce(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (Y) => {
    if (!Y) return null;
    const X = m[Y];
    return X ? a.decode(X) : null;
  }, s = await l(e.top_copper), i = await l(e.bottom_copper), o = await l(e.outline), u = e.drills?.length ? await Promise.all(e.drills.map((Y) => l(Y))) : [], y = await l(e.top_silk), v = await l(e.bottom_silk), f = s ? Rt(e.top_copper || "top", s) : null, _ = i ? Rt(e.bottom_copper || "bot", i) : null, d = o ? Rt(e.outline || "outline", o) : null, h = [];
  if (e.drills)
    for (let Y = 0; Y < e.drills.length; Y++) {
      const X = u[Y];
      if (X) {
        const Q = Oe(e.drills[Y], X);
        for (const at of Q.holes) h.push({ x: at.x, y: at.y, diameter: at.diameter });
      }
    }
  const n = await l(e.top_mask), g = await l(e.bottom_mask), p = y ? Rt(e.top_silk || "top_silk", y) : null, x = v ? Rt(e.bottom_silk || "bot_silk", v) : null, M = n ? Rt(e.top_mask || "top_mask", n) : null, k = g ? Rt(e.bottom_mask || "bot_mask", g) : null, R = f ? yt(bt(f)) : null, B = _ ? yt(bt(_)) : null, P = d ? yt(bt(d)) : null, j = h.length ? yt(De(h)) : null, C = p ? yt(bt(p)) : null, W = x ? yt(bt(x)) : null, J = M ? yt(bt(M)) : null, S = k ? yt(bt(k)) : null, N = (P && Tt(P) ? P : null) || (R && Tt(R) ? R : null) || (B && Tt(B) ? B : null) || (j && Tt(j) ? j : null), c = N ? N.maxX - N.minX : 1, $ = R ? xt(R.maxX - R.minX, c) : 1, rt = B ? xt(B.maxX - B.minX, c) : 1, G = P ? xt(P.maxX - P.minX, c) : 1, nt = j ? xt(j.maxX - j.minX, c) : 1, q = C ? xt(C.maxX - C.minX, c) : 1, it = W ? xt(W.maxX - W.minX, c) : 1, F = J ? xt(J.maxX - J.minX, c) : 1, T = S ? xt(S.maxX - S.minX, c) : 1, tt = f ? At(f, $) : null, K = _ ? At(_, rt) : null, V = d ? At(d, G) : null, ct = h.length ? Fe(h, nt) : [], dt = p ? At(p, q) : null, ot = x ? At(x, it) : null, lt = M ? At(M, F) : null, O = k ? At(k, T) : null;
  let L = null;
  if (V) {
    const Y = yt(bt(V));
    Tt(Y) && (L = Y);
  }
  if (!L) {
    let Y = Yt();
    tt && (Y = Kt(Y, bt(tt))), K && (Y = Kt(Y, bt(K))), Y = yt(Y), L = Y;
  }
  const H = yt(L), et = H.maxX - H.minX, r = H.maxY - H.minY;
  let I;
  if (V) {
    const Y = [];
    for (const X of V.regions)
      for (const Q of X.loops)
        Q.length >= 3 && Y.push(Q);
    if (Y.length === 0 && V.tracks.length)
      for (const X of le(V.tracks))
        X.length >= 3 && Y.push(X);
    Y.length > 0 && (I = Y);
  }
  const E = {
    board: {
      width_in: et / 25.4,
      height_in: r / 25.4,
      mm_bounds: {
        min_x_mm: H.minX,
        min_y_mm: H.minY,
        max_x_mm: H.maxX,
        max_y_mm: H.maxY
      }
    },
    outline_loops_mm: I
  }, w = Math.max(1, Math.round(mt(et))), b = Math.max(1, Math.round(mt(r))), A = [], D = (Y) => {
    const X = Ne(Y);
    return A.push(X), X;
  }, U = V ? Qt(V, H) : Xt(w, b), z = V ? Qt(V, H) : Xt(w, b), Z = {
    top_board_mask: D(U),
    bottom_board_mask: D(z)
  };
  return tt && (Z.top_copper = D(Dt(tt, H, "#fbbf24", 1))), K && (Z.bottom_copper = D(Dt(K, H, "#38bdf8", 1))), lt && (Z.top_mask = D(Dt(lt, H, "#fbbf24", 0.9))), O && (Z.bottom_mask = D(Dt(O, H, "#38bdf8", 0.9))), ct.length && (Z.drills = D(Ue(ct, H))), dt && (Z.top_silk = D(te(dt, H))), ot && (Z.bottom_silk = D(te(ot, H))), {
    boardGeom: E,
    layers: Z,
    revoke: () => A.forEach((Y) => URL.revokeObjectURL(Y))
  };
}
async function ar(m) {
  const t = m instanceof Uint8Array ? m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer : m instanceof ArrayBuffer ? m : await m.arrayBuffer(), { files: e, archiveType: a } = await ae(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await de(e);
}
async function lr(m, t) {
  const { files: e } = await ae(m, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await de(e);
}
function jt(m, t) {
  const [
    e,
    a,
    l,
    s,
    i,
    o,
    u,
    y,
    v
  ] = m, [
    f,
    _,
    d,
    h,
    n,
    g,
    p,
    x,
    M
  ] = t;
  return [
    e * f + a * h + l * p,
    e * _ + a * n + l * x,
    e * d + a * g + l * M,
    s * f + i * h + o * p,
    s * _ + i * n + o * x,
    s * d + i * g + o * M,
    u * f + y * h + v * p,
    u * _ + y * n + v * x,
    u * d + y * g + v * M
  ];
}
function ee(m, t) {
  return [1, 0, m, 0, 1, t, 0, 0, 1];
}
function We(m, t) {
  return [m, 0, 0, 0, t, 0, 0, 0, 1];
}
function je(m) {
  const t = Math.cos(m), e = Math.sin(m);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function re(m, t) {
  const e = m[0] * t.x + m[1] * t.y + m[2], a = m[3] * t.x + m[4] * t.y + m[5], l = m[6] * t.x + m[7] * t.y + m[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function Xe(m) {
  const t = m[0], e = m[1], a = m[2], l = m[3], s = m[4], i = m[5], o = t * s - e * l;
  if (Math.abs(o) < 1e-12) throw new Error("Non-invertible transform");
  const u = 1 / o, y = s * u, v = -e * u, f = -l * u, _ = t * u, d = -(y * a + v * i), h = -(f * a + _ * i);
  return [y, v, d, f, _, h, 0, 0, 1];
}
class Ye {
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
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: s, mirrorX: i, mirrorY: o } = this.camera, u = { x: t / 2, y: e / 2 }, y = o ? -1 : 1, v = i ? -1 : 1, f = ee(-a.x, -a.y), _ = je(s), d = We(l * v, l * y), h = ee(u.x, u.y), n = jt(h, jt(d, jt(_, f)));
    this.worldToScreenMat = n, this.screenToWorldMat = Xe(n);
  }
}
class Ze {
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
let Ge = class {
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
class qe {
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
    const { cx: l, cy: s } = this.cellCoord(t, e), i = Math.ceil(a / this.cellSize_mm), o = [];
    for (let u = -i; u <= i; u++)
      for (let y = -i; y <= i; y++) {
        const v = `${l + u},${s + y}`, f = this.cells.get(v);
        if (f)
          for (const _ of f) o.push(_);
      }
    return o;
  }
}
class Ve {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new qe(5), this.dirtyList = !0, this.listCache = [];
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
      const o = this.byId.get(i);
      o && s.push(o);
    }
    return s;
  }
}
class He {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, a, l = 10) {
    const s = t.screenToBoard({ x: e, y: a }), i = t.xform.getCamera().zoom, o = l / i, u = this.store.queryNear(s.x, s.y, o);
    let y = null;
    for (const v of u) {
      const f = t.boardToScreen({ x: v.x_mm, y: v.y_mm }), _ = f.x - e, d = f.y - a, h = Math.sqrt(_ * _ + d * d);
      h <= l && (!y || h < y.distance_px) && (y = { id: v.id, marker: v, distance_px: h });
    }
    return y;
  }
}
class Ke {
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
class he {
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
class Je {
  constructor(t, e) {
    this.passes = [], this.overlays = new Ge(), this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Ve(), this.markerPicker = new He(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Ke(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const a = t.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context");
    this.ctx = a;
    const l = t.getBoundingClientRect(), s = {
      width_px: l.width,
      height_px: l.height
    };
    this.xform = new Ye(e, s), this.visibility = new he(), this.scheduler = new Ze(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: o }) => {
        const u = this.xform.boardToScreen({ x: i, y: o });
        return { x_px: u.x, y_px: u.y };
      },
      screenToBoard: ({ x_px: i, y_px: o }) => {
        const u = this.xform.screenToBoard({ x: i, y: o });
        return { x_mm: u.x, y_mm: u.y };
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
      boardToScreen: (o) => this.xform.boardToScreen({ x: o.x, y: o.y }),
      screenToBoard: (o) => this.xform.screenToBoard({ x: o.x, y: o.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height);
    const i = window.devicePixelRatio || 1;
    t.scale(i, i), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width / i, e.height / i);
    for (const o of this.passes)
      if (o.enabled(s)) {
        t.save();
        try {
          o.draw(s);
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
function dr(m, t, e, a) {
  return {
    id: `gerber:${m}`,
    order: t,
    enabled: (l) => l.visibility.gerber[e],
    draw: (l) => {
      const s = l.ctx, i = l.xform.getWorldToScreenMatrix();
      s.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), a(s);
    }
  };
}
class Qe {
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
function tr(m, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = m.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
      l.sort((i, o) => i.zIndex - o.zIndex);
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
let er = class {
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
function rr(m) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => m.draw(t)
  };
}
class ir {
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
function nr(m, t) {
  return {
    id: "selection",
    order: (kt.SELECTION_MIN + kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const a = t();
      a && m.draw(e, a);
    }
  };
}
function ur(m, t = {}) {
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
  const l = m.firstElementChild, s = ct(l, "#board-viewport"), i = ct(l, "#render-canvas"), o = ct(l, "#grid-toggle"), u = ct(l, "#grid-units"), y = ct(l, "#fit-btn"), v = a ? ct(l, "#download-btn") : null, f = Array.from(l.querySelectorAll('input[name="side"]')), _ = ct(l, "#layer-menu-btn"), d = ct(l, "#layer-panel"), h = new Je(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), n = new he();
  n.subscribe(() => {
    h.requestRender("visibility-change");
  });
  const g = new Qe(), p = new er(), x = new ir();
  let M = null;
  function k() {
    const O = s.getBoundingClientRect(), L = window.devicePixelRatio || 1;
    i.width = O.width * L, i.height = O.height * L, i.style.width = `${O.width}px`, i.style.height = `${O.height}px`, h.requestRender("resize");
  }
  const R = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (O, L) => {
      const et = L.view.zoom, r = u.value, I = r === "mm" ? 1 : 2.54, E = r === "mm" ? 10 : 25.4, w = I * et, b = E * et;
      if (w < 2) return;
      const A = i.width / (window.devicePixelRatio || 1), D = i.height / (window.devicePixelRatio || 1), U = L.screenToBoard({ x: 0, y: 0 }), z = L.screenToBoard({ x: A, y: D });
      O.setTransform(1, 0, 0, 1, 0, 0), O.strokeStyle = "rgba(59, 130, 246, 0.4)", O.lineWidth = 1, O.beginPath();
      const Z = Math.floor(U.x / I) * I, Y = Math.floor(U.y / I) * I;
      for (let X = Z; X <= z.x; X += I) {
        const Q = L.boardToScreen({ x: X, y: 0 }).x;
        O.moveTo(Q, 0), O.lineTo(Q, i.height);
      }
      for (let X = Y; X <= z.y; X += I) {
        const Q = L.boardToScreen({ x: 0, y: X }).y;
        O.moveTo(0, Q), O.lineTo(i.width, Q);
      }
      if (O.stroke(), b >= 8) {
        O.strokeStyle = "rgba(59, 130, 246, 0.7)", O.lineWidth = 1.5, O.beginPath();
        const X = Math.floor(U.x / E) * E, Q = Math.floor(U.y / E) * E;
        for (let at = X; at <= z.x; at += E) {
          const st = L.boardToScreen({ x: at, y: 0 }).x;
          O.moveTo(st, 0), O.lineTo(st, i.height);
        }
        for (let at = Q; at <= z.y; at += E) {
          const st = L.boardToScreen({ x: 0, y: at }).y;
          O.moveTo(0, st), O.lineTo(i.width, st);
        }
        O.stroke();
      }
    }
  };
  g.add(R), n.setOverlayVisibility("grid", !1), n.setMarkersVisibility(!1), h.addPass(tr(g, h.getOverlayApi())), h.addPass(rr(p)), h.addPass(nr(x, () => M));
  const B = {}, P = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:top-copper": { label: "Top copper", color: "#fbbf24" },
    "layer:top-mask": { label: "Top soldermask", color: "#fde68a" },
    "layer:top-silk": { label: "Top silkscreen", color: "#f1f5f9" },
    "layer:bottom-copper": { label: "Bottom copper", color: "#38bdf8" },
    "layer:bottom-mask": { label: "Bottom soldermask", color: "#bae6fd" },
    "layer:bottom-silk": { label: "Bottom silkscreen", color: "#f1f5f9" },
    "layer:drills": { label: "Drill holes", color: "#111111" }
  }, j = [
    "layer:drills",
    "layer:top-silk",
    "layer:top-mask",
    "layer:top-copper",
    "layer:bottom-silk",
    "layer:bottom-mask",
    "layer:bottom-copper",
    "layer:fr4"
  ];
  let C = null, W = {}, J = "top", S = !1;
  function N(O, L, H) {
    if (!H) return null;
    O in B || (B[O] = !0);
    const et = new Image();
    return et.src = H, et.addEventListener("load", () => {
      h.requestRender(`image-loaded-${O}`);
    }), {
      id: O,
      order: L,
      enabled: (r) => !!(B[O] ?? !0) && !!C?.board?.mm_bounds,
      draw: (r) => {
        if (!et.complete || !C?.board?.mm_bounds) return;
        const I = r.ctx, E = r.xform.getWorldToScreenMatrix();
        I.setTransform(E[0], E[3], E[1], E[4], E[2], E[5]);
        let w;
        (W.top_board_mask || W.bottom_board_mask) && (w = 0.5);
        const b = $(I, C, w);
        nt(I, b, (A) => {
          if (!C?.board?.mm_bounds) return;
          const D = C.board.mm_bounds, U = D.max_x_mm - D.min_x_mm, z = D.max_y_mm - D.min_y_mm;
          A.drawImage(et, D.min_x_mm, D.min_y_mm, U, z);
        });
      }
    };
  }
  function c(O, L) {
    return O in B || (B[O] = !0), {
      id: O,
      order: L,
      enabled: (H) => !!(B[O] ?? !0) && !!C?.board?.mm_bounds,
      draw: (H) => {
        if (!C?.board?.mm_bounds) return;
        const et = H.ctx, r = H.xform.getWorldToScreenMatrix();
        et.setTransform(r[0], r[3], r[1], r[4], r[2], r[5]);
        const I = $(et, C, 0.5);
        G(et, I);
      }
    };
  }
  function $(O, L, H) {
    if (!L?.board?.mm_bounds) return new Path2D();
    const et = L.board.mm_bounds;
    if (L.outline_loops_mm?.length) {
      const r = new Path2D(), I = (E) => et.max_y_mm + et.min_y_mm - E;
      for (const E of L.outline_loops_mm)
        if (E.length) {
          r.moveTo(E[0].x, I(E[0].y));
          for (let w = 1; w < E.length; w++)
            r.lineTo(E[w].x, I(E[w].y));
          r.closePath();
        }
      return r;
    }
    return rt(
      et.min_x_mm,
      et.min_y_mm,
      et.max_x_mm - et.min_x_mm,
      et.max_y_mm - et.min_y_mm,
      H || 0
    );
  }
  function rt(O, L, H, et, r) {
    const I = new Path2D(), E = Math.max(0, Math.min(r, Math.min(H, et) / 2));
    return I.moveTo(O + E, L), I.lineTo(O + H - E, L), I.quadraticCurveTo(O + H, L, O + H, L + E), I.lineTo(O + H, L + et - E), I.quadraticCurveTo(O + H, L + et, O + H - E, L + et), I.lineTo(O + E, L + et), I.quadraticCurveTo(O, L + et, O, L + et - E), I.lineTo(O, L + E), I.quadraticCurveTo(O, L, O + E, L), I.closePath(), I;
  }
  function G(O, L) {
    O.save(), O.clip(L), O.fillStyle = "#1a5f1a", O.fill(L), O.strokeStyle = "#0d3d0d", O.lineWidth = 0.1, O.stroke(L), O.restore();
  }
  function nt(O, L, H) {
    O.save(), O.clip(L), H(O), O.restore();
  }
  function q() {
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
    ].forEach((H) => {
      h.removePass(H);
    }), !C) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: J === "bottom" ? W.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: J === "bottom" ? W.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: J === "bottom" ? W.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: J === "top" ? W.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: J === "top" ? W.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: J === "top" ? W.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: W.drills },
      { id: "layer:vias", order: 45, url: W.vias }
    ].forEach((H) => {
      let et;
      H.useFR4 ? et = c(H.id, H.order) : H.url && (et = N(H.id, H.order, H.url)), et && h.addPass(et);
    }), h.requestRender("side-switch"), setTimeout(() => h.requestRender("side-switch-delayed"), 50), it();
  }
  function it() {
    const O = j.filter((L) => !!h.getPass(L));
    d.innerHTML = O.map((L) => {
      const H = P[L] ?? { label: L, color: "#888" }, et = B[L] ?? !0, r = H.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${L}"><span class="layer-swatch" style="background:${H.color};${r}"></span><span>${H.label}</span><input type="checkbox"${et ? " checked" : ""} /></label>`;
    }).join(""), d.querySelectorAll(".layer-item input").forEach((L) => {
      L.addEventListener("change", () => {
        const H = L.closest("[data-layer-id]")?.dataset.layerId;
        H && (B[H] = L.checked, h.requestRender("layer-toggle"));
      });
    });
  }
  function F(O = 0.08) {
    if (!C?.board?.mm_bounds) return;
    const L = s.getBoundingClientRect(), H = C.board.mm_bounds, et = H.max_x_mm - H.min_x_mm, r = H.max_y_mm - H.min_y_mm, I = L.width * (1 - 2 * O), E = L.height * (1 - 2 * O), w = I / et, b = E / r, A = Math.min(w, b), D = (H.min_x_mm + H.max_x_mm) / 2, U = (H.min_y_mm + H.max_y_mm) / 2;
    h.setCamera({
      center_mm: { x: D, y: U },
      zoom: A
    });
  }
  i.addEventListener("wheel", (O) => {
    O.preventDefault(), S = !0;
    const L = i.getBoundingClientRect(), H = O.clientX - L.left, et = O.clientY - L.top, r = h.getCamera(), I = O.deltaY < 0 ? 1.1 : 0.9, E = Math.max(0.2, Math.min(50, r.zoom * I)), w = h.screenToBoard(H, et);
    h.setCamera({ zoom: E });
    const b = h.screenToBoard(H, et), A = w.x - b.x, D = w.y - b.y, U = {
      x: r.center_mm.x + A,
      y: r.center_mm.y + D
    };
    h.setCamera({
      center_mm: U,
      zoom: E
    });
  }, { passive: !1 });
  let T = !1, tt = null;
  i.addEventListener("mousedown", (O) => {
    if (O.button !== 0) return;
    O.preventDefault(), S = !0, T = !0;
    const L = i.getBoundingClientRect();
    tt = h.screenToBoard(
      O.clientX - L.left,
      O.clientY - L.top
    );
  });
  const K = (O) => {
    if (!T || !tt) return;
    const L = i.getBoundingClientRect(), H = h.screenToBoard(
      O.clientX - L.left,
      O.clientY - L.top
    ), et = tt.x - H.x, r = tt.y - H.y, I = h.getCamera();
    h.setCamera({
      center_mm: {
        x: I.center_mm.x + et,
        y: I.center_mm.y + r
      }
    });
  }, V = () => {
    T = !1, tt = null;
  };
  window.addEventListener("mousemove", K), window.addEventListener("mouseup", V), o.addEventListener("change", () => {
    const O = o.checked;
    n.setOverlayVisibility("grid", O), R.visible = O, h.requestRender("grid-toggle");
  }), u.addEventListener("change", () => {
    n.isOverlayVisible("grid") && h.requestRender("grid-units");
  }), y.addEventListener("click", () => F(0.08)), v?.addEventListener("click", () => t.onDownload?.()), _.addEventListener("click", (O) => {
    O.stopPropagation();
    const L = !d.hidden;
    d.hidden = L, _.classList.toggle("active", !L);
  }), document.addEventListener("click", (O) => {
    !d.hidden && !d.contains(O.target) && O.target !== _ && (d.hidden = !0, _.classList.remove("active"));
  }), f.forEach((O) => {
    O.addEventListener("change", () => {
      J = f.find((L) => L.checked)?.value || "top", q();
    });
  }), window.addEventListener("resize", () => {
    k(), S || F(0.08);
  });
  function ct(O, L) {
    const H = O.querySelector(L);
    if (!H) throw new Error(`Missing required element: ${L}`);
    return H;
  }
  function dt(O) {
    C = O.boardGeom, W = O.layers, C?.board?.mm_bounds && h.setBoardBounds({
      minX_mm: C.board.mm_bounds.min_x_mm,
      minY_mm: C.board.mm_bounds.min_y_mm,
      maxX_mm: C.board.mm_bounds.max_x_mm,
      maxY_mm: C.board.mm_bounds.max_y_mm
    }), q(), k(), F(0.08);
  }
  function ot(O) {
    J = O;
    const L = f.find((H) => H.value === O);
    L && (L.checked = !0), q();
  }
  function lt() {
    window.removeEventListener("mousemove", K), window.removeEventListener("mouseup", V), m.innerHTML = "";
  }
  return k(), {
    setData: dt,
    setSideMode: ot,
    fit: () => F(0.08),
    dispose: lt,
    // Expose new render pipeline API
    viewer: h,
    visibility: n,
    overlayRegistry: g,
    markerRenderer: p,
    setSelection: (O) => {
      M = O, h.requestRender("selection-change");
    },
    addMarker: (O) => {
      if (typeof O.x_mm != "number" || typeof O.y_mm != "number" || !isFinite(O.x_mm) || !isFinite(O.y_mm)) {
        console.warn(`Invalid marker coordinates for ${O.id}:`, {
          x_mm: O.x_mm,
          y_mm: O.y_mm,
          marker: O,
          keys: Object.keys(O)
        });
        return;
      }
      const L = {
        id: O.id,
        position: { x: O.x_mm, y: O.y_mm },
        type: "custom",
        // Default type for DFM markers
        data: {
          ...O.data,
          severity: O.severity,
          layer: O.layer,
          radius_mm: O.radius_mm
        }
      };
      p.add(L), h.requestRender("marker-added");
    },
    addMarkers: (O) => {
      for (const L of O) {
        if (typeof L.x_mm != "number" || typeof L.y_mm != "number" || !isFinite(L.x_mm) || !isFinite(L.y_mm)) {
          console.warn(`Invalid marker coordinates for ${L.id}:`, {
            x_mm: L.x_mm,
            y_mm: L.y_mm,
            marker: L,
            keys: Object.keys(L)
          });
          continue;
        }
        const H = {
          id: L.id,
          position: { x: L.x_mm, y: L.y_mm },
          type: "custom",
          // Default type for DFM markers
          data: {
            ...L.data,
            severity: L.severity,
            layer: L.layer,
            radius_mm: L.radius_mm
          }
        };
        p.add(H);
      }
      h.requestRender("markers-added");
    },
    removeMarker: (O) => {
      p.remove(O), h.requestRender("marker-removed");
    }
  };
}
function fr(m, t) {
  return {
    id: "overlay:all",
    order: kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const a = e.xform.getWorldToScreenMatrix(), l = m.getSortedVisible();
      for (const s of l)
        e.ctx.save(), s.drawInWorldSpace ? e.ctx.setTransform(a[0], a[3], a[1], a[4], a[2], a[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), s.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function mr() {
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
function pr(m) {
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
function yr(m = 1) {
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
function gr(m) {
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
function sr(m, t) {
  const e = t.maxX_mm - t.minX_mm, a = t.maxY_mm - t.minY_mm;
  return m.x_mm < 0 || m.x_mm > e || m.y_mm < 0 || m.y_mm > a;
}
class or {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const a = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: l, height_px: s } = t.viewport, i = 4;
    for (const o of a) {
      if (typeof o.x_mm != "number" || typeof o.y_mm != "number" || !isFinite(o.x_mm) || !isFinite(o.y_mm)) {
        console.warn(`Invalid marker coordinates for ${o.id}:`, {
          x_mm: o.x_mm,
          y_mm: o.y_mm,
          marker: o,
          keys: Object.keys(o)
        });
        continue;
      }
      const u = t.boardToScreen({ x: o.x_mm, y: o.y_mm }), y = u.x, v = u.y;
      if (y < -10 || v < -10 || y > l + 10 || v > s + 10) continue;
      const f = e?.boardBounds ? sr({ x_mm: o.x_mm, y_mm: o.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, o, e?.selectedId === o.id, e?.hoverId === o.id, f), t.ctx.beginPath(), t.ctx.arc(y, v, i, 0, Math.PI * 2), e?.selectedId === o.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
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
function _r(m, t) {
  const e = new or(m);
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
  Ke as Emitter,
  ft as GerberError,
  He as MarkerPicker,
  or as MarkerRenderer,
  Ve as MarkerStore,
  Ge as OverlayRegistry,
  Ze as RenderScheduler,
  ir as SelectionRenderer,
  qe as UniformGridIndex,
  Je as Viewer,
  Ye as ViewportTransform,
  he as VisibilityManager,
  dr as createGerberPass,
  yr as createGridOverlay,
  ur as createIntegratedViewer,
  _r as createMarkerPass,
  fr as createOverlayPass,
  gr as createPulsingMarkerOverlay,
  nr as createSelectionPass,
  pr as createTooltipOverlay,
  mr as createViolationDotsOverlay,
  Me as detectGerberBundle,
  lr as renderGerbers,
  de as renderGerbersFiles,
  ar as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
