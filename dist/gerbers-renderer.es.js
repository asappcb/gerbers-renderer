var Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function pe(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
function Ft(f) {
  throw new Error('Could not dynamically require "' + f + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ut = { exports: {} };
var qt;
function ye() {
  return qt || (qt = 1, (function(f, t) {
    (function(e) {
      f.exports = e();
    })(function() {
      return (function e(a, l, s) {
        function i(g, b) {
          if (!l[g]) {
            if (!a[g]) {
              var u = typeof Ft == "function" && Ft;
              if (!b && u) return u(g, !0);
              if (o) return o(g, !0);
              var p = new Error("Cannot find module '" + g + "'");
              throw p.code = "MODULE_NOT_FOUND", p;
            }
            var h = l[g] = { exports: {} };
            a[g][0].call(h.exports, function(m) {
              var n = a[g][1][m];
              return i(n || m);
            }, h, h.exports, e, a, l, s);
          }
          return l[g].exports;
        }
        for (var o = typeof Ft == "function" && Ft, d = 0; d < s.length; d++) i(s[d]);
        return i;
      })({ 1: [function(e, a, l) {
        var s = e("./utils"), i = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(d) {
          for (var g, b, u, p, h, m, n, _ = [], y = 0, w = d.length, M = w, k = s.getTypeOf(d) !== "string"; y < d.length; ) M = w - y, u = k ? (g = d[y++], b = y < w ? d[y++] : 0, y < w ? d[y++] : 0) : (g = d.charCodeAt(y++), b = y < w ? d.charCodeAt(y++) : 0, y < w ? d.charCodeAt(y++) : 0), p = g >> 2, h = (3 & g) << 4 | b >> 4, m = 1 < M ? (15 & b) << 2 | u >> 6 : 64, n = 2 < M ? 63 & u : 64, _.push(o.charAt(p) + o.charAt(h) + o.charAt(m) + o.charAt(n));
          return _.join("");
        }, l.decode = function(d) {
          var g, b, u, p, h, m, n = 0, _ = 0, y = "data:";
          if (d.substr(0, y.length) === y) throw new Error("Invalid base64 input, it looks like a data url.");
          var w, M = 3 * (d = d.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (d.charAt(d.length - 1) === o.charAt(64) && M--, d.charAt(d.length - 2) === o.charAt(64) && M--, M % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (w = i.uint8array ? new Uint8Array(0 | M) : new Array(0 | M); n < d.length; ) g = o.indexOf(d.charAt(n++)) << 2 | (p = o.indexOf(d.charAt(n++))) >> 4, b = (15 & p) << 4 | (h = o.indexOf(d.charAt(n++))) >> 2, u = (3 & h) << 6 | (m = o.indexOf(d.charAt(n++))), w[_++] = g, h !== 64 && (w[_++] = b), m !== 64 && (w[_++] = u);
          return w;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var s = e("./external"), i = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), d = e("./stream/DataLengthProbe");
        function g(b, u, p, h, m) {
          this.compressedSize = b, this.uncompressedSize = u, this.crc32 = p, this.compression = h, this.compressedContent = m;
        }
        g.prototype = { getContentWorker: function() {
          var b = new i(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")), u = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== u.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new i(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(b, u, p) {
          return b.pipe(new o()).pipe(new d("uncompressedSize")).pipe(u.compressWorker(p)).pipe(new d("compressedSize")).withStreamInfo("compression", u);
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
          for (var o, d = [], g = 0; g < 256; g++) {
            o = g;
            for (var b = 0; b < 8; b++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            d[g] = o;
          }
          return d;
        })();
        a.exports = function(o, d) {
          return o !== void 0 && o.length ? s.getTypeOf(o) !== "string" ? (function(g, b, u, p) {
            var h = i, m = p + u;
            g ^= -1;
            for (var n = p; n < m; n++) g = g >>> 8 ^ h[255 & (g ^ b[n])];
            return -1 ^ g;
          })(0 | d, o, o.length, 0) : (function(g, b, u, p) {
            var h = i, m = p + u;
            g ^= -1;
            for (var n = p; n < m; n++) g = g >>> 8 ^ h[255 & (g ^ b.charCodeAt(n))];
            return -1 ^ g;
          })(0 | d, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", i = e("pako"), o = e("./utils"), d = e("./stream/GenericWorker"), g = s ? "uint8array" : "array";
        function b(u, p) {
          d.call(this, "FlateWorker/" + u), this._pako = null, this._pakoAction = u, this._pakoOptions = p, this.meta = {};
        }
        l.magic = "\b\0", o.inherits(b, d), b.prototype.processChunk = function(u) {
          this.meta = u.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(g, u.data), !1);
        }, b.prototype.flush = function() {
          d.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          d.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var u = this;
          this._pako.onData = function(p) {
            u.push({ data: p, meta: u.meta });
          };
        }, l.compressWorker = function(u) {
          return new b("Deflate", u);
        }, l.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function s(h, m) {
          var n, _ = "";
          for (n = 0; n < m; n++) _ += String.fromCharCode(255 & h), h >>>= 8;
          return _;
        }
        function i(h, m, n, _, y, w) {
          var M, k, R = h.file, I = h.compression, O = w !== g.utf8encode, W = o.transformTo("string", w(R.name)), P = o.transformTo("string", g.utf8encode(R.name)), j = R.comment, J = o.transformTo("string", w(j)), S = o.transformTo("string", g.utf8encode(j)), N = P.length !== R.name.length, c = S.length !== j.length, $ = "", it = "", X = "", st = R.dir, q = R.date, nt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !n || (nt.crc32 = h.crc32, nt.compressedSize = h.compressedSize, nt.uncompressedSize = h.uncompressedSize);
          var F = 0;
          m && (F |= 8), O || !N && !c || (F |= 2048);
          var T = 0, et = 0;
          st && (T |= 16), y === "UNIX" ? (et = 798, T |= (function(E, V) {
            var Q = E;
            return E || (Q = V ? 16893 : 33204), (65535 & Q) << 16;
          })(R.unixPermissions, st)) : (et = 20, T |= (function(E) {
            return 63 & (E || 0);
          })(R.dosPermissions)), M = q.getUTCHours(), M <<= 6, M |= q.getUTCMinutes(), M <<= 5, M |= q.getUTCSeconds() / 2, k = q.getUTCFullYear() - 1980, k <<= 4, k |= q.getUTCMonth() + 1, k <<= 5, k |= q.getUTCDate(), N && (it = s(1, 1) + s(b(W), 4) + P, $ += "up" + s(it.length, 2) + it), c && (X = s(1, 1) + s(b(J), 4) + S, $ += "uc" + s(X.length, 2) + X);
          var z = "";
          return z += `
\0`, z += s(F, 2), z += I.magic, z += s(M, 2), z += s(k, 2), z += s(nt.crc32, 4), z += s(nt.compressedSize, 4), z += s(nt.uncompressedSize, 4), z += s(W.length, 2), z += s($.length, 2), { fileRecord: u.LOCAL_FILE_HEADER + z + W + $, dirRecord: u.CENTRAL_FILE_HEADER + s(et, 2) + z + s(J.length, 2) + "\0\0\0\0" + s(T, 4) + s(_, 4) + W + $ + J };
        }
        var o = e("../utils"), d = e("../stream/GenericWorker"), g = e("../utf8"), b = e("../crc32"), u = e("../signature");
        function p(h, m, n, _) {
          d.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = m, this.zipPlatform = n, this.encodeFileName = _, this.streamFiles = h, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(p, d), p.prototype.push = function(h) {
          var m = h.meta.percent || 0, n = this.entriesCount, _ = this._sources.length;
          this.accumulate ? this.contentBuffer.push(h) : (this.bytesWritten += h.data.length, d.prototype.push.call(this, { data: h.data, meta: { currentFile: this.currentFile, percent: n ? (m + 100 * (n - _ - 1)) / n : 100 } }));
        }, p.prototype.openedSource = function(h) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = h.file.name;
          var m = this.streamFiles && !h.file.dir;
          if (m) {
            var n = i(h, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: n.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, p.prototype.closedSource = function(h) {
          this.accumulate = !1;
          var m = this.streamFiles && !h.file.dir, n = i(h, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(n.dirRecord), m) this.push({ data: (function(_) {
            return u.DATA_DESCRIPTOR + s(_.crc32, 4) + s(_.compressedSize, 4) + s(_.uncompressedSize, 4);
          })(h), meta: { percent: 100 } });
          else for (this.push({ data: n.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, p.prototype.flush = function() {
          for (var h = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var n = this.bytesWritten - h, _ = (function(y, w, M, k, R) {
            var I = o.transformTo("string", R(k));
            return u.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(y, 2) + s(y, 2) + s(w, 4) + s(M, 4) + s(I.length, 2) + I;
          })(this.dirRecords.length, n, h, this.zipComment, this.encodeFileName);
          this.push({ data: _, meta: { percent: 100 } });
        }, p.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, p.prototype.registerPrevious = function(h) {
          this._sources.push(h);
          var m = this;
          return h.on("data", function(n) {
            m.processChunk(n);
          }), h.on("end", function() {
            m.closedSource(m.previous.streamInfo), m._sources.length ? m.prepareNextSource() : m.end();
          }), h.on("error", function(n) {
            m.error(n);
          }), this;
        }, p.prototype.resume = function() {
          return !!d.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, p.prototype.error = function(h) {
          var m = this._sources;
          if (!d.prototype.error.call(this, h)) return !1;
          for (var n = 0; n < m.length; n++) try {
            m[n].error(h);
          } catch {
          }
          return !0;
        }, p.prototype.lock = function() {
          d.prototype.lock.call(this);
          for (var h = this._sources, m = 0; m < h.length; m++) h[m].lock();
        }, a.exports = p;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var s = e("../compressions"), i = e("./ZipFileWorker");
        l.generateWorker = function(o, d, g) {
          var b = new i(d.streamFiles, g, d.platform, d.encodeFileName), u = 0;
          try {
            o.forEach(function(p, h) {
              u++;
              var m = (function(w, M) {
                var k = w || M, R = s[k];
                if (!R) throw new Error(k + " is not a valid compression method !");
                return R;
              })(h.options.compression, d.compression), n = h.options.compressionOptions || d.compressionOptions || {}, _ = h.dir, y = h.date;
              h._compressWorker(m, n).withStreamInfo("file", { name: p, dir: _, date: y, comment: h.comment || "", unixPermissions: h.unixPermissions, dosPermissions: h.dosPermissions }).pipe(b);
            }), b.entriesCount = u;
          } catch (p) {
            b.error(p);
          }
          return b;
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
        var s = e("./utils"), i = e("./external"), o = e("./utf8"), d = e("./zipEntries"), g = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function u(p) {
          return new i.Promise(function(h, m) {
            var n = p.decompressed.getContentWorker().pipe(new g());
            n.on("error", function(_) {
              m(_);
            }).on("end", function() {
              n.streamInfo.crc32 !== p.decompressed.crc32 ? m(new Error("Corrupted zip : CRC32 mismatch")) : h();
            }).resume();
          });
        }
        a.exports = function(p, h) {
          var m = this;
          return h = s.extend(h || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), b.isNode && b.isStream(p) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", p, !0, h.optimizedBinaryString, h.base64).then(function(n) {
            var _ = new d(h);
            return _.load(n), _;
          }).then(function(n) {
            var _ = [i.Promise.resolve(n)], y = n.files;
            if (h.checkCRC32) for (var w = 0; w < y.length; w++) _.push(u(y[w]));
            return i.Promise.all(_);
          }).then(function(n) {
            for (var _ = n.shift(), y = _.files, w = 0; w < y.length; w++) {
              var M = y[w], k = M.fileNameStr, R = s.resolve(M.fileNameStr);
              m.file(R, M.decompressed, { binary: !0, optimizedBinaryString: !0, date: M.date, dir: M.dir, comment: M.fileCommentStr.length ? M.fileCommentStr : null, unixPermissions: M.unixPermissions, dosPermissions: M.dosPermissions, createFolders: h.createFolders }), M.dir || (m.file(R).unsafeOriginalName = k);
            }
            return _.zipComment.length && (m.comment = _.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var s = e("../utils"), i = e("../stream/GenericWorker");
        function o(d, g) {
          i.call(this, "Nodejs stream input adapter for " + d), this._upstreamEnded = !1, this._bindStream(g);
        }
        s.inherits(o, i), o.prototype._bindStream = function(d) {
          var g = this;
          (this._stream = d).pause(), d.on("data", function(b) {
            g.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            g.isPaused ? this.generatedError = b : g.error(b);
          }).on("end", function() {
            g.isPaused ? g._upstreamEnded = !0 : g.end();
          });
        }, o.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var s = e("readable-stream").Readable;
        function i(o, d, g) {
          s.call(this, d), this._helper = o;
          var b = this;
          o.on("data", function(u, p) {
            b.push(u) || b._helper.pause(), g && g(p);
          }).on("error", function(u) {
            b.emit("error", u);
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
        function s(R, I, O) {
          var W, P = o.getTypeOf(I), j = o.extend(O || {}, b);
          j.date = j.date || /* @__PURE__ */ new Date(), j.compression !== null && (j.compression = j.compression.toUpperCase()), typeof j.unixPermissions == "string" && (j.unixPermissions = parseInt(j.unixPermissions, 8)), j.unixPermissions && 16384 & j.unixPermissions && (j.dir = !0), j.dosPermissions && 16 & j.dosPermissions && (j.dir = !0), j.dir && (R = y(R)), j.createFolders && (W = _(R)) && w.call(this, W, !0);
          var J = P === "string" && j.binary === !1 && j.base64 === !1;
          O && O.binary !== void 0 || (j.binary = !J), (I instanceof u && I.uncompressedSize === 0 || j.dir || !I || I.length === 0) && (j.base64 = !1, j.binary = !0, I = "", j.compression = "STORE", P = "string");
          var S = null;
          S = I instanceof u || I instanceof d ? I : m.isNode && m.isStream(I) ? new n(R, I) : o.prepareContent(R, I, j.binary, j.optimizedBinaryString, j.base64);
          var N = new p(R, S, j);
          this.files[R] = N;
        }
        var i = e("./utf8"), o = e("./utils"), d = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), b = e("./defaults"), u = e("./compressedObject"), p = e("./zipObject"), h = e("./generate"), m = e("./nodejsUtils"), n = e("./nodejs/NodejsStreamInputAdapter"), _ = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var I = R.lastIndexOf("/");
          return 0 < I ? R.substring(0, I) : "";
        }, y = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, w = function(R, I) {
          return I = I !== void 0 ? I : b.createFolders, R = y(R), this.files[R] || s.call(this, R, null, { dir: !0, createFolders: I }), this.files[R];
        };
        function M(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var I, O, W;
          for (I in this.files) W = this.files[I], (O = I.slice(this.root.length, I.length)) && I.slice(0, this.root.length) === this.root && R(O, W);
        }, filter: function(R) {
          var I = [];
          return this.forEach(function(O, W) {
            R(O, W) && I.push(W);
          }), I;
        }, file: function(R, I, O) {
          if (arguments.length !== 1) return R = this.root + R, s.call(this, R, I, O), this;
          if (M(R)) {
            var W = R;
            return this.filter(function(j, J) {
              return !J.dir && W.test(j);
            });
          }
          var P = this.files[this.root + R];
          return P && !P.dir ? P : null;
        }, folder: function(R) {
          if (!R) return this;
          if (M(R)) return this.filter(function(P, j) {
            return j.dir && R.test(P);
          });
          var I = this.root + R, O = w.call(this, I), W = this.clone();
          return W.root = O.name, W;
        }, remove: function(R) {
          R = this.root + R;
          var I = this.files[R];
          if (I || (R.slice(-1) !== "/" && (R += "/"), I = this.files[R]), I && !I.dir) delete this.files[R];
          else for (var O = this.filter(function(P, j) {
            return j.name.slice(0, R.length) === R;
          }), W = 0; W < O.length; W++) delete this.files[O[W].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var I, O = {};
          try {
            if ((O = o.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            o.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var W = O.comment || this.comment || "";
            I = h.generateWorker(this, O, W);
          } catch (P) {
            (I = new d("error")).error(P);
          }
          return new g(I, O.type || "string", O.mimeType);
        }, generateAsync: function(R, I) {
          return this.generateInternalStream(R).accumulate(I);
        }, generateNodeStream: function(R, I) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(I);
        } };
        a.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var s = e("./DataReader");
        function i(o) {
          s.call(this, o);
          for (var d = 0; d < this.data.length; d++) o[d] = 255 & o[d];
        }
        e("../utils").inherits(i, s), i.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, i.prototype.lastIndexOfSignature = function(o) {
          for (var d = o.charCodeAt(0), g = o.charCodeAt(1), b = o.charCodeAt(2), u = o.charCodeAt(3), p = this.length - 4; 0 <= p; --p) if (this.data[p] === d && this.data[p + 1] === g && this.data[p + 2] === b && this.data[p + 3] === u) return p - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(o) {
          var d = o.charCodeAt(0), g = o.charCodeAt(1), b = o.charCodeAt(2), u = o.charCodeAt(3), p = this.readData(4);
          return d === p[0] && g === p[1] && b === p[2] && u === p[3];
        }, i.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, d;
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
          var d, g = 0;
          for (this.checkOffset(o), d = this.index + o - 1; d >= this.index; d--) g = (g << 8) + this.byteAt(d);
          return this.index += o, g;
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
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, d;
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
          var d = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, d;
        }, a.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var s = e("./ArrayReader");
        function i(o) {
          s.call(this, o);
        }
        e("../utils").inherits(i, s), i.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var d = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, d;
        }, a.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var s = e("../utils"), i = e("../support"), o = e("./ArrayReader"), d = e("./StringReader"), g = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        a.exports = function(u) {
          var p = s.getTypeOf(u);
          return s.checkSupport(p), p !== "string" || i.uint8array ? p === "nodebuffer" ? new g(u) : i.uint8array ? new b(s.transformTo("uint8array", u)) : new o(s.transformTo("array", u)) : new d(u);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../utils");
        function o(d) {
          s.call(this, "ConvertWorker to " + d), this.destType = d;
        }
        i.inherits(o, s), o.prototype.processChunk = function(d) {
          this.push({ data: i.transformTo(this.destType, d.data), meta: d.meta });
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var s = e("./GenericWorker"), i = e("../crc32");
        function o() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, s), o.prototype.processChunk = function(d) {
          this.streamInfo.crc32 = i(d.data, this.streamInfo.crc32 || 0), this.push(d);
        }, a.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function o(d) {
          i.call(this, "DataLengthProbe for " + d), this.propName = d, this.withStreamInfo(d, 0);
        }
        s.inherits(o, i), o.prototype.processChunk = function(d) {
          if (d) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + d.data.length;
          }
          i.prototype.processChunk.call(this, d);
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var s = e("../utils"), i = e("./GenericWorker");
        function o(d) {
          i.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, d.then(function(b) {
            g.dataIsReady = !0, g.data = b, g.max = b && b.length || 0, g.type = s.getTypeOf(b), g.isPaused || g._tickAndRepeat();
          }, function(b) {
            g.error(b);
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
          var d = null, g = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              d = this.data.substring(this.index, g);
              break;
            case "uint8array":
              d = this.data.subarray(this.index, g);
              break;
            case "array":
            case "nodebuffer":
              d = this.data.slice(this.index, g);
          }
          return this.index = g, this.push({ data: d, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
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
          if (this._listeners[i]) for (var d = 0; d < this._listeners[i].length; d++) this._listeners[i][d].call(this, o);
        }, pipe: function(i) {
          return i.registerPrevious(this);
        }, registerPrevious: function(i) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = i.streamInfo, this.mergeStreamInfo(), this.previous = i;
          var o = this;
          return i.on("data", function(d) {
            o.processChunk(d);
          }), i.on("end", function() {
            o.end();
          }), i.on("error", function(d) {
            o.error(d);
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
        var s = e("../utils"), i = e("./ConvertWorker"), o = e("./GenericWorker"), d = e("../base64"), g = e("../support"), b = e("../external"), u = null;
        if (g.nodestream) try {
          u = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function p(m, n) {
          return new b.Promise(function(_, y) {
            var w = [], M = m._internalType, k = m._outputType, R = m._mimeType;
            m.on("data", function(I, O) {
              w.push(I), n && n(O);
            }).on("error", function(I) {
              w = [], y(I);
            }).on("end", function() {
              try {
                var I = (function(O, W, P) {
                  switch (O) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", W), P);
                    case "base64":
                      return d.encode(W);
                    default:
                      return s.transformTo(O, W);
                  }
                })(k, (function(O, W) {
                  var P, j = 0, J = null, S = 0;
                  for (P = 0; P < W.length; P++) S += W[P].length;
                  switch (O) {
                    case "string":
                      return W.join("");
                    case "array":
                      return Array.prototype.concat.apply([], W);
                    case "uint8array":
                      for (J = new Uint8Array(S), P = 0; P < W.length; P++) J.set(W[P], j), j += W[P].length;
                      return J;
                    case "nodebuffer":
                      return Buffer.concat(W);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(M, w), R);
                _(I);
              } catch (O) {
                y(O);
              }
              w = [];
            }).resume();
          });
        }
        function h(m, n, _) {
          var y = n;
          switch (n) {
            case "blob":
            case "arraybuffer":
              y = "uint8array";
              break;
            case "base64":
              y = "string";
          }
          try {
            this._internalType = y, this._outputType = n, this._mimeType = _, s.checkSupport(y), this._worker = m.pipe(new i(y)), m.lock();
          } catch (w) {
            this._worker = new o("error"), this._worker.error(w);
          }
        }
        h.prototype = { accumulate: function(m) {
          return p(this, m);
        }, on: function(m, n) {
          var _ = this;
          return m === "data" ? this._worker.on(m, function(y) {
            n.call(_, y.data, y.meta);
          }) : this._worker.on(m, function() {
            s.delay(n, arguments, _);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new u(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, a.exports = h;
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
        for (var s = e("./utils"), i = e("./support"), o = e("./nodejsUtils"), d = e("./stream/GenericWorker"), g = new Array(256), b = 0; b < 256; b++) g[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        g[254] = g[254] = 1;
        function u() {
          d.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function p() {
          d.call(this, "utf-8 encode");
        }
        l.utf8encode = function(h) {
          return i.nodebuffer ? o.newBufferFrom(h, "utf-8") : (function(m) {
            var n, _, y, w, M, k = m.length, R = 0;
            for (w = 0; w < k; w++) (64512 & (_ = m.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (y = m.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (y - 56320), w++), R += _ < 128 ? 1 : _ < 2048 ? 2 : _ < 65536 ? 3 : 4;
            for (n = i.uint8array ? new Uint8Array(R) : new Array(R), w = M = 0; M < R; w++) (64512 & (_ = m.charCodeAt(w))) == 55296 && w + 1 < k && (64512 & (y = m.charCodeAt(w + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (y - 56320), w++), _ < 128 ? n[M++] = _ : (_ < 2048 ? n[M++] = 192 | _ >>> 6 : (_ < 65536 ? n[M++] = 224 | _ >>> 12 : (n[M++] = 240 | _ >>> 18, n[M++] = 128 | _ >>> 12 & 63), n[M++] = 128 | _ >>> 6 & 63), n[M++] = 128 | 63 & _);
            return n;
          })(h);
        }, l.utf8decode = function(h) {
          return i.nodebuffer ? s.transformTo("nodebuffer", h).toString("utf-8") : (function(m) {
            var n, _, y, w, M = m.length, k = new Array(2 * M);
            for (n = _ = 0; n < M; ) if ((y = m[n++]) < 128) k[_++] = y;
            else if (4 < (w = g[y])) k[_++] = 65533, n += w - 1;
            else {
              for (y &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && n < M; ) y = y << 6 | 63 & m[n++], w--;
              1 < w ? k[_++] = 65533 : y < 65536 ? k[_++] = y : (y -= 65536, k[_++] = 55296 | y >> 10 & 1023, k[_++] = 56320 | 1023 & y);
            }
            return k.length !== _ && (k.subarray ? k = k.subarray(0, _) : k.length = _), s.applyFromCharCode(k);
          })(h = s.transformTo(i.uint8array ? "uint8array" : "array", h));
        }, s.inherits(u, d), u.prototype.processChunk = function(h) {
          var m = s.transformTo(i.uint8array ? "uint8array" : "array", h.data);
          if (this.leftOver && this.leftOver.length) {
            if (i.uint8array) {
              var n = m;
              (m = new Uint8Array(n.length + this.leftOver.length)).set(this.leftOver, 0), m.set(n, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var _ = (function(w, M) {
            var k;
            for ((M = M || w.length) > w.length && (M = w.length), k = M - 1; 0 <= k && (192 & w[k]) == 128; ) k--;
            return k < 0 || k === 0 ? M : k + g[w[k]] > M ? k : M;
          })(m), y = m;
          _ !== m.length && (i.uint8array ? (y = m.subarray(0, _), this.leftOver = m.subarray(_, m.length)) : (y = m.slice(0, _), this.leftOver = m.slice(_, m.length))), this.push({ data: l.utf8decode(y), meta: h.meta });
        }, u.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = u, s.inherits(p, d), p.prototype.processChunk = function(h) {
          this.push({ data: l.utf8encode(h.data), meta: h.meta });
        }, l.Utf8EncodeWorker = p;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var s = e("./support"), i = e("./base64"), o = e("./nodejsUtils"), d = e("./external");
        function g(n) {
          return n;
        }
        function b(n, _) {
          for (var y = 0; y < n.length; ++y) _[y] = 255 & n.charCodeAt(y);
          return _;
        }
        e("setimmediate"), l.newBlob = function(n, _) {
          l.checkSupport("blob");
          try {
            return new Blob([n], { type: _ });
          } catch {
            try {
              var y = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return y.append(n), y.getBlob(_);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var u = { stringifyByChunk: function(n, _, y) {
          var w = [], M = 0, k = n.length;
          if (k <= y) return String.fromCharCode.apply(null, n);
          for (; M < k; ) _ === "array" || _ === "nodebuffer" ? w.push(String.fromCharCode.apply(null, n.slice(M, Math.min(M + y, k)))) : w.push(String.fromCharCode.apply(null, n.subarray(M, Math.min(M + y, k)))), M += y;
          return w.join("");
        }, stringifyByChar: function(n) {
          for (var _ = "", y = 0; y < n.length; y++) _ += String.fromCharCode(n[y]);
          return _;
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
        function p(n) {
          var _ = 65536, y = l.getTypeOf(n), w = !0;
          if (y === "uint8array" ? w = u.applyCanBeUsed.uint8array : y === "nodebuffer" && (w = u.applyCanBeUsed.nodebuffer), w) for (; 1 < _; ) try {
            return u.stringifyByChunk(n, y, _);
          } catch {
            _ = Math.floor(_ / 2);
          }
          return u.stringifyByChar(n);
        }
        function h(n, _) {
          for (var y = 0; y < n.length; y++) _[y] = n[y];
          return _;
        }
        l.applyFromCharCode = p;
        var m = {};
        m.string = { string: g, array: function(n) {
          return b(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return m.string.uint8array(n).buffer;
        }, uint8array: function(n) {
          return b(n, new Uint8Array(n.length));
        }, nodebuffer: function(n) {
          return b(n, o.allocBuffer(n.length));
        } }, m.array = { string: p, array: g, arraybuffer: function(n) {
          return new Uint8Array(n).buffer;
        }, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return o.newBufferFrom(n);
        } }, m.arraybuffer = { string: function(n) {
          return p(new Uint8Array(n));
        }, array: function(n) {
          return h(new Uint8Array(n), new Array(n.byteLength));
        }, arraybuffer: g, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return o.newBufferFrom(new Uint8Array(n));
        } }, m.uint8array = { string: p, array: function(n) {
          return h(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return n.buffer;
        }, uint8array: g, nodebuffer: function(n) {
          return o.newBufferFrom(n);
        } }, m.nodebuffer = { string: p, array: function(n) {
          return h(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return m.nodebuffer.uint8array(n).buffer;
        }, uint8array: function(n) {
          return h(n, new Uint8Array(n.length));
        }, nodebuffer: g }, l.transformTo = function(n, _) {
          if (_ = _ || "", !n) return _;
          l.checkSupport(n);
          var y = l.getTypeOf(_);
          return m[y][n](_);
        }, l.resolve = function(n) {
          for (var _ = n.split("/"), y = [], w = 0; w < _.length; w++) {
            var M = _[w];
            M === "." || M === "" && w !== 0 && w !== _.length - 1 || (M === ".." ? y.pop() : y.push(M));
          }
          return y.join("/");
        }, l.getTypeOf = function(n) {
          return typeof n == "string" ? "string" : Object.prototype.toString.call(n) === "[object Array]" ? "array" : s.nodebuffer && o.isBuffer(n) ? "nodebuffer" : s.uint8array && n instanceof Uint8Array ? "uint8array" : s.arraybuffer && n instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(n) {
          if (!s[n.toLowerCase()]) throw new Error(n + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(n) {
          var _, y, w = "";
          for (y = 0; y < (n || "").length; y++) w += "\\x" + ((_ = n.charCodeAt(y)) < 16 ? "0" : "") + _.toString(16).toUpperCase();
          return w;
        }, l.delay = function(n, _, y) {
          setImmediate(function() {
            n.apply(y || null, _ || []);
          });
        }, l.inherits = function(n, _) {
          function y() {
          }
          y.prototype = _.prototype, n.prototype = new y();
        }, l.extend = function() {
          var n, _, y = {};
          for (n = 0; n < arguments.length; n++) for (_ in arguments[n]) Object.prototype.hasOwnProperty.call(arguments[n], _) && y[_] === void 0 && (y[_] = arguments[n][_]);
          return y;
        }, l.prepareContent = function(n, _, y, w, M) {
          return d.Promise.resolve(_).then(function(k) {
            return s.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new d.Promise(function(R, I) {
              var O = new FileReader();
              O.onload = function(W) {
                R(W.target.result);
              }, O.onerror = function(W) {
                I(W.target.error);
              }, O.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var R = l.getTypeOf(k);
            return R ? (R === "arraybuffer" ? k = l.transformTo("uint8array", k) : R === "string" && (M ? k = i.decode(k) : y && w !== !0 && (k = (function(I) {
              return b(I, s.uint8array ? new Uint8Array(I.length) : new Array(I.length));
            })(k))), k) : d.Promise.reject(new Error("Can't read the data of '" + n + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), o = e("./signature"), d = e("./zipEntry"), g = e("./support");
        function b(u) {
          this.files = [], this.loadOptions = u;
        }
        b.prototype = { checkSignature: function(u) {
          if (!this.reader.readAndCheckSignature(u)) {
            this.reader.index -= 4;
            var p = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(p) + ", expected " + i.pretty(u) + ")");
          }
        }, isSignature: function(u, p) {
          var h = this.reader.index;
          this.reader.setIndex(u);
          var m = this.reader.readString(4) === p;
          return this.reader.setIndex(h), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var u = this.reader.readData(this.zipCommentLength), p = g.uint8array ? "uint8array" : "array", h = i.transformTo(p, u);
          this.zipComment = this.loadOptions.decodeFileName(h);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var u, p, h, m = this.zip64EndOfCentralSize - 44; 0 < m; ) u = this.reader.readInt(2), p = this.reader.readInt(4), h = this.reader.readData(p), this.zip64ExtensibleData[u] = { id: u, length: p, value: h };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var u, p;
          for (u = 0; u < this.files.length; u++) p = this.files[u], this.reader.setIndex(p.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), p.readLocalPart(this.reader), p.handleUTF8(), p.processAttributes();
        }, readCentralDir: function() {
          var u;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (u = new d({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(u);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var u = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (u < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(u);
          var p = u;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (u = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(u), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var h = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (h += 20, h += 12 + this.zip64EndOfCentralSize);
          var m = p - h;
          if (0 < m) this.isSignature(p, o.CENTRAL_FILE_HEADER) || (this.reader.zero = m);
          else if (m < 0) throw new Error("Corrupted zip: missing " + Math.abs(m) + " bytes.");
        }, prepareReader: function(u) {
          this.reader = s(u);
        }, load: function(u) {
          this.prepareReader(u), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var s = e("./reader/readerFor"), i = e("./utils"), o = e("./compressedObject"), d = e("./crc32"), g = e("./utf8"), b = e("./compressions"), u = e("./support");
        function p(h, m) {
          this.options = h, this.loadOptions = m;
        }
        p.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(h) {
          var m, n;
          if (h.skip(22), this.fileNameLength = h.readInt(2), n = h.readInt(2), this.fileName = h.readData(this.fileNameLength), h.skip(n), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((m = (function(_) {
            for (var y in b) if (Object.prototype.hasOwnProperty.call(b, y) && b[y].magic === _) return b[y];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
          this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, m, h.readData(this.compressedSize));
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
          var m, n, _, y = h.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); h.index + 4 < y; ) m = h.readInt(2), n = h.readInt(2), _ = h.readData(n), this.extraFields[m] = { id: m, length: n, value: _ };
          h.setIndex(y);
        }, handleUTF8: function() {
          var h = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
          else {
            var m = this.findExtraFieldUnicodePath();
            if (m !== null) this.fileNameStr = m;
            else {
              var n = i.transformTo(h, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(n);
            }
            var _ = this.findExtraFieldUnicodeComment();
            if (_ !== null) this.fileCommentStr = _;
            else {
              var y = i.transformTo(h, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(y);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var h = this.extraFields[28789];
          if (h) {
            var m = s(h.value);
            return m.readInt(1) !== 1 || d(this.fileName) !== m.readInt(4) ? null : g.utf8decode(m.readData(h.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var h = this.extraFields[25461];
          if (h) {
            var m = s(h.value);
            return m.readInt(1) !== 1 || d(this.fileComment) !== m.readInt(4) ? null : g.utf8decode(m.readData(h.length - 5));
          }
          return null;
        } }, a.exports = p;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function s(m, n, _) {
          this.name = m, this.dir = _.dir, this.date = _.date, this.comment = _.comment, this.unixPermissions = _.unixPermissions, this.dosPermissions = _.dosPermissions, this._data = n, this._dataBinary = _.binary, this.options = { compression: _.compression, compressionOptions: _.compressionOptions };
        }
        var i = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), d = e("./utf8"), g = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(m) {
          var n = null, _ = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var y = (_ = m.toLowerCase()) === "string" || _ === "text";
            _ !== "binarystring" && _ !== "text" || (_ = "string"), n = this._decompressWorker();
            var w = !this._dataBinary;
            w && !y && (n = n.pipe(new d.Utf8EncodeWorker())), !w && y && (n = n.pipe(new d.Utf8DecodeWorker()));
          } catch (M) {
            (n = new b("error")).error(M);
          }
          return new i(n, _, "");
        }, async: function(m, n) {
          return this.internalStream(m).accumulate(n);
        }, nodeStream: function(m, n) {
          return this.internalStream(m || "nodebuffer").toNodejsStream(n);
        }, _compressWorker: function(m, n) {
          if (this._data instanceof g && this._data.compression.magic === m.magic) return this._data.getCompressedWorker();
          var _ = this._decompressWorker();
          return this._dataBinary || (_ = _.pipe(new d.Utf8EncodeWorker())), g.createWorkerFrom(_, m, n);
        }, _decompressWorker: function() {
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof b ? this._data : new o(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], p = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, h = 0; h < u.length; h++) s.prototype[u[h]] = p;
        a.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(s) {
          var i, o, d = s.MutationObserver || s.WebKitMutationObserver;
          if (d) {
            var g = 0, b = new d(m), u = s.document.createTextNode("");
            b.observe(u, { characterData: !0 }), i = function() {
              u.data = g = ++g % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) i = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var n = s.document.createElement("script");
            n.onreadystatechange = function() {
              m(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null;
            }, s.document.documentElement.appendChild(n);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var p = new s.MessageChannel();
            p.port1.onmessage = m, i = function() {
              p.port2.postMessage(0);
            };
          }
          var h = [];
          function m() {
            var n, _;
            o = !0;
            for (var y = h.length; y; ) {
              for (_ = h, h = [], n = -1; ++n < y; ) _[n]();
              y = h.length;
            }
            o = !1;
          }
          a.exports = function(n) {
            h.push(n) !== 1 || o || i();
          };
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var s = e("immediate");
        function i() {
        }
        var o = {}, d = ["REJECTED"], g = ["FULFILLED"], b = ["PENDING"];
        function u(y) {
          if (typeof y != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, y !== i && n(this, y);
        }
        function p(y, w, M) {
          this.promise = y, typeof w == "function" && (this.onFulfilled = w, this.callFulfilled = this.otherCallFulfilled), typeof M == "function" && (this.onRejected = M, this.callRejected = this.otherCallRejected);
        }
        function h(y, w, M) {
          s(function() {
            var k;
            try {
              k = w(M);
            } catch (R) {
              return o.reject(y, R);
            }
            k === y ? o.reject(y, new TypeError("Cannot resolve promise with itself")) : o.resolve(y, k);
          });
        }
        function m(y) {
          var w = y && y.then;
          if (y && (typeof y == "object" || typeof y == "function") && typeof w == "function") return function() {
            w.apply(y, arguments);
          };
        }
        function n(y, w) {
          var M = !1;
          function k(O) {
            M || (M = !0, o.reject(y, O));
          }
          function R(O) {
            M || (M = !0, o.resolve(y, O));
          }
          var I = _(function() {
            w(R, k);
          });
          I.status === "error" && k(I.value);
        }
        function _(y, w) {
          var M = {};
          try {
            M.value = y(w), M.status = "success";
          } catch (k) {
            M.status = "error", M.value = k;
          }
          return M;
        }
        (a.exports = u).prototype.finally = function(y) {
          if (typeof y != "function") return this;
          var w = this.constructor;
          return this.then(function(M) {
            return w.resolve(y()).then(function() {
              return M;
            });
          }, function(M) {
            return w.resolve(y()).then(function() {
              throw M;
            });
          });
        }, u.prototype.catch = function(y) {
          return this.then(null, y);
        }, u.prototype.then = function(y, w) {
          if (typeof y != "function" && this.state === g || typeof w != "function" && this.state === d) return this;
          var M = new this.constructor(i);
          return this.state !== b ? h(M, this.state === g ? y : w, this.outcome) : this.queue.push(new p(M, y, w)), M;
        }, p.prototype.callFulfilled = function(y) {
          o.resolve(this.promise, y);
        }, p.prototype.otherCallFulfilled = function(y) {
          h(this.promise, this.onFulfilled, y);
        }, p.prototype.callRejected = function(y) {
          o.reject(this.promise, y);
        }, p.prototype.otherCallRejected = function(y) {
          h(this.promise, this.onRejected, y);
        }, o.resolve = function(y, w) {
          var M = _(m, w);
          if (M.status === "error") return o.reject(y, M.value);
          var k = M.value;
          if (k) n(y, k);
          else {
            y.state = g, y.outcome = w;
            for (var R = -1, I = y.queue.length; ++R < I; ) y.queue[R].callFulfilled(w);
          }
          return y;
        }, o.reject = function(y, w) {
          y.state = d, y.outcome = w;
          for (var M = -1, k = y.queue.length; ++M < k; ) y.queue[M].callRejected(w);
          return y;
        }, u.resolve = function(y) {
          return y instanceof this ? y : o.resolve(new this(i), y);
        }, u.reject = function(y) {
          var w = new this(i);
          return o.reject(w, y);
        }, u.all = function(y) {
          var w = this;
          if (Object.prototype.toString.call(y) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = y.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = new Array(M), I = 0, O = -1, W = new this(i); ++O < M; ) P(y[O], O);
          return W;
          function P(j, J) {
            w.resolve(j).then(function(S) {
              R[J] = S, ++I !== M || k || (k = !0, o.resolve(W, R));
            }, function(S) {
              k || (k = !0, o.reject(W, S));
            });
          }
        }, u.race = function(y) {
          var w = this;
          if (Object.prototype.toString.call(y) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var M = y.length, k = !1;
          if (!M) return this.resolve([]);
          for (var R = -1, I = new this(i); ++R < M; ) O = y[R], w.resolve(O).then(function(W) {
            k || (k = !0, o.resolve(I, W));
          }, function(W) {
            k || (k = !0, o.reject(I, W));
          });
          var O;
          return I;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var s = e("./zlib/deflate"), i = e("./utils/common"), o = e("./utils/strings"), d = e("./zlib/messages"), g = e("./zlib/zstream"), b = Object.prototype.toString, u = 0, p = -1, h = 0, m = 8;
        function n(y) {
          if (!(this instanceof n)) return new n(y);
          this.options = i.assign({ level: p, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: h, to: "" }, y || {});
          var w = this.options;
          w.raw && 0 < w.windowBits ? w.windowBits = -w.windowBits : w.gzip && 0 < w.windowBits && w.windowBits < 16 && (w.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var M = s.deflateInit2(this.strm, w.level, w.method, w.windowBits, w.memLevel, w.strategy);
          if (M !== u) throw new Error(d[M]);
          if (w.header && s.deflateSetHeader(this.strm, w.header), w.dictionary) {
            var k;
            if (k = typeof w.dictionary == "string" ? o.string2buf(w.dictionary) : b.call(w.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(w.dictionary) : w.dictionary, (M = s.deflateSetDictionary(this.strm, k)) !== u) throw new Error(d[M]);
            this._dict_set = !0;
          }
        }
        function _(y, w) {
          var M = new n(w);
          if (M.push(y, !0), M.err) throw M.msg || d[M.err];
          return M.result;
        }
        n.prototype.push = function(y, w) {
          var M, k, R = this.strm, I = this.options.chunkSize;
          if (this.ended) return !1;
          k = w === ~~w ? w : w === !0 ? 4 : 0, typeof y == "string" ? R.input = o.string2buf(y) : b.call(y) === "[object ArrayBuffer]" ? R.input = new Uint8Array(y) : R.input = y, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new i.Buf8(I), R.next_out = 0, R.avail_out = I), (M = s.deflate(R, k)) !== 1 && M !== u) return this.onEnd(M), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(i.shrinkBuf(R.output, R.next_out))) : this.onData(i.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && M !== 1);
          return k === 4 ? (M = s.deflateEnd(this.strm), this.onEnd(M), this.ended = !0, M === u) : k !== 2 || (this.onEnd(u), !(R.avail_out = 0));
        }, n.prototype.onData = function(y) {
          this.chunks.push(y);
        }, n.prototype.onEnd = function(y) {
          y === u && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = y, this.msg = this.strm.msg;
        }, l.Deflate = n, l.deflate = _, l.deflateRaw = function(y, w) {
          return (w = w || {}).raw = !0, _(y, w);
        }, l.gzip = function(y, w) {
          return (w = w || {}).gzip = !0, _(y, w);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var s = e("./zlib/inflate"), i = e("./utils/common"), o = e("./utils/strings"), d = e("./zlib/constants"), g = e("./zlib/messages"), b = e("./zlib/zstream"), u = e("./zlib/gzheader"), p = Object.prototype.toString;
        function h(n) {
          if (!(this instanceof h)) return new h(n);
          this.options = i.assign({ chunkSize: 16384, windowBits: 0, to: "" }, n || {});
          var _ = this.options;
          _.raw && 0 <= _.windowBits && _.windowBits < 16 && (_.windowBits = -_.windowBits, _.windowBits === 0 && (_.windowBits = -15)), !(0 <= _.windowBits && _.windowBits < 16) || n && n.windowBits || (_.windowBits += 32), 15 < _.windowBits && _.windowBits < 48 && (15 & _.windowBits) == 0 && (_.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var y = s.inflateInit2(this.strm, _.windowBits);
          if (y !== d.Z_OK) throw new Error(g[y]);
          this.header = new u(), s.inflateGetHeader(this.strm, this.header);
        }
        function m(n, _) {
          var y = new h(_);
          if (y.push(n, !0), y.err) throw y.msg || g[y.err];
          return y.result;
        }
        h.prototype.push = function(n, _) {
          var y, w, M, k, R, I, O = this.strm, W = this.options.chunkSize, P = this.options.dictionary, j = !1;
          if (this.ended) return !1;
          w = _ === ~~_ ? _ : _ === !0 ? d.Z_FINISH : d.Z_NO_FLUSH, typeof n == "string" ? O.input = o.binstring2buf(n) : p.call(n) === "[object ArrayBuffer]" ? O.input = new Uint8Array(n) : O.input = n, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new i.Buf8(W), O.next_out = 0, O.avail_out = W), (y = s.inflate(O, d.Z_NO_FLUSH)) === d.Z_NEED_DICT && P && (I = typeof P == "string" ? o.string2buf(P) : p.call(P) === "[object ArrayBuffer]" ? new Uint8Array(P) : P, y = s.inflateSetDictionary(this.strm, I)), y === d.Z_BUF_ERROR && j === !0 && (y = d.Z_OK, j = !1), y !== d.Z_STREAM_END && y !== d.Z_OK) return this.onEnd(y), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && y !== d.Z_STREAM_END && (O.avail_in !== 0 || w !== d.Z_FINISH && w !== d.Z_SYNC_FLUSH) || (this.options.to === "string" ? (M = o.utf8border(O.output, O.next_out), k = O.next_out - M, R = o.buf2string(O.output, M), O.next_out = k, O.avail_out = W - k, k && i.arraySet(O.output, O.output, M, k, 0), this.onData(R)) : this.onData(i.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (j = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && y !== d.Z_STREAM_END);
          return y === d.Z_STREAM_END && (w = d.Z_FINISH), w === d.Z_FINISH ? (y = s.inflateEnd(this.strm), this.onEnd(y), this.ended = !0, y === d.Z_OK) : w !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), !(O.avail_out = 0));
        }, h.prototype.onData = function(n) {
          this.chunks.push(n);
        }, h.prototype.onEnd = function(n) {
          n === d.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = n, this.msg = this.strm.msg;
        }, l.Inflate = h, l.inflate = m, l.inflateRaw = function(n, _) {
          return (_ = _ || {}).raw = !0, m(n, _);
        }, l.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(d) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var b = g.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var u in b) b.hasOwnProperty(u) && (d[u] = b[u]);
            }
          }
          return d;
        }, l.shrinkBuf = function(d, g) {
          return d.length === g ? d : d.subarray ? d.subarray(0, g) : (d.length = g, d);
        };
        var i = { arraySet: function(d, g, b, u, p) {
          if (g.subarray && d.subarray) d.set(g.subarray(b, b + u), p);
          else for (var h = 0; h < u; h++) d[p + h] = g[b + h];
        }, flattenChunks: function(d) {
          var g, b, u, p, h, m;
          for (g = u = 0, b = d.length; g < b; g++) u += d[g].length;
          for (m = new Uint8Array(u), g = p = 0, b = d.length; g < b; g++) h = d[g], m.set(h, p), p += h.length;
          return m;
        } }, o = { arraySet: function(d, g, b, u, p) {
          for (var h = 0; h < u; h++) d[p + h] = g[b + h];
        }, flattenChunks: function(d) {
          return [].concat.apply([], d);
        } };
        l.setTyped = function(d) {
          d ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, i)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, o));
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
        for (var d = new s.Buf8(256), g = 0; g < 256; g++) d[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function b(u, p) {
          if (p < 65537 && (u.subarray && o || !u.subarray && i)) return String.fromCharCode.apply(null, s.shrinkBuf(u, p));
          for (var h = "", m = 0; m < p; m++) h += String.fromCharCode(u[m]);
          return h;
        }
        d[254] = d[254] = 1, l.string2buf = function(u) {
          var p, h, m, n, _, y = u.length, w = 0;
          for (n = 0; n < y; n++) (64512 & (h = u.charCodeAt(n))) == 55296 && n + 1 < y && (64512 & (m = u.charCodeAt(n + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), n++), w += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4;
          for (p = new s.Buf8(w), n = _ = 0; _ < w; n++) (64512 & (h = u.charCodeAt(n))) == 55296 && n + 1 < y && (64512 & (m = u.charCodeAt(n + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (m - 56320), n++), h < 128 ? p[_++] = h : (h < 2048 ? p[_++] = 192 | h >>> 6 : (h < 65536 ? p[_++] = 224 | h >>> 12 : (p[_++] = 240 | h >>> 18, p[_++] = 128 | h >>> 12 & 63), p[_++] = 128 | h >>> 6 & 63), p[_++] = 128 | 63 & h);
          return p;
        }, l.buf2binstring = function(u) {
          return b(u, u.length);
        }, l.binstring2buf = function(u) {
          for (var p = new s.Buf8(u.length), h = 0, m = p.length; h < m; h++) p[h] = u.charCodeAt(h);
          return p;
        }, l.buf2string = function(u, p) {
          var h, m, n, _, y = p || u.length, w = new Array(2 * y);
          for (h = m = 0; h < y; ) if ((n = u[h++]) < 128) w[m++] = n;
          else if (4 < (_ = d[n])) w[m++] = 65533, h += _ - 1;
          else {
            for (n &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && h < y; ) n = n << 6 | 63 & u[h++], _--;
            1 < _ ? w[m++] = 65533 : n < 65536 ? w[m++] = n : (n -= 65536, w[m++] = 55296 | n >> 10 & 1023, w[m++] = 56320 | 1023 & n);
          }
          return b(w, m);
        }, l.utf8border = function(u, p) {
          var h;
          for ((p = p || u.length) > u.length && (p = u.length), h = p - 1; 0 <= h && (192 & u[h]) == 128; ) h--;
          return h < 0 || h === 0 ? p : h + d[u[h]] > p ? h : p;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(s, i, o, d) {
          for (var g = 65535 & s | 0, b = s >>> 16 & 65535 | 0, u = 0; o !== 0; ) {
            for (o -= u = 2e3 < o ? 2e3 : o; b = b + (g = g + i[d++] | 0) | 0, --u; ) ;
            g %= 65521, b %= 65521;
          }
          return g | b << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var s = (function() {
          for (var i, o = [], d = 0; d < 256; d++) {
            i = d;
            for (var g = 0; g < 8; g++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            o[d] = i;
          }
          return o;
        })();
        a.exports = function(i, o, d, g) {
          var b = s, u = g + d;
          i ^= -1;
          for (var p = g; p < u; p++) i = i >>> 8 ^ b[255 & (i ^ o[p])];
          return -1 ^ i;
        };
      }, {}], 46: [function(e, a, l) {
        var s, i = e("../utils/common"), o = e("./trees"), d = e("./adler32"), g = e("./crc32"), b = e("./messages"), u = 0, p = 4, h = 0, m = -2, n = -1, _ = 4, y = 2, w = 8, M = 9, k = 286, R = 30, I = 19, O = 2 * k + 1, W = 15, P = 3, j = 258, J = j + P + 1, S = 42, N = 113, c = 1, $ = 2, it = 3, X = 4;
        function st(r, D) {
          return r.msg = b[D], D;
        }
        function q(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function nt(r) {
          for (var D = r.length; 0 <= --D; ) r[D] = 0;
        }
        function F(r) {
          var D = r.state, B = D.pending;
          B > r.avail_out && (B = r.avail_out), B !== 0 && (i.arraySet(r.output, D.pending_buf, D.pending_out, B, r.next_out), r.next_out += B, D.pending_out += B, r.total_out += B, r.avail_out -= B, D.pending -= B, D.pending === 0 && (D.pending_out = 0));
        }
        function T(r, D) {
          o._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, D), r.block_start = r.strstart, F(r.strm);
        }
        function et(r, D) {
          r.pending_buf[r.pending++] = D;
        }
        function z(r, D) {
          r.pending_buf[r.pending++] = D >>> 8 & 255, r.pending_buf[r.pending++] = 255 & D;
        }
        function E(r, D) {
          var B, x, v = r.max_chain_length, A = r.strstart, L = r.prev_length, U = r.nice_match, C = r.strstart > r.w_size - J ? r.strstart - (r.w_size - J) : 0, G = r.window, Y = r.w_mask, Z = r.prev, rt = r.strstart + j, ct = G[A + L - 1], lt = G[A + L];
          r.prev_length >= r.good_match && (v >>= 2), U > r.lookahead && (U = r.lookahead);
          do
            if (G[(B = D) + L] === lt && G[B + L - 1] === ct && G[B] === G[A] && G[++B] === G[A + 1]) {
              A += 2, B++;
              do
                ;
              while (G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && G[++A] === G[++B] && A < rt);
              if (x = j - (rt - A), A = rt - j, L < x) {
                if (r.match_start = D, U <= (L = x)) break;
                ct = G[A + L - 1], lt = G[A + L];
              }
            }
          while ((D = Z[D & Y]) > C && --v != 0);
          return L <= r.lookahead ? L : r.lookahead;
        }
        function V(r) {
          var D, B, x, v, A, L, U, C, G, Y, Z = r.w_size;
          do {
            if (v = r.window_size - r.lookahead - r.strstart, r.strstart >= Z + (Z - J)) {
              for (i.arraySet(r.window, r.window, Z, Z, 0), r.match_start -= Z, r.strstart -= Z, r.block_start -= Z, D = B = r.hash_size; x = r.head[--D], r.head[D] = Z <= x ? x - Z : 0, --B; ) ;
              for (D = B = Z; x = r.prev[--D], r.prev[D] = Z <= x ? x - Z : 0, --B; ) ;
              v += Z;
            }
            if (r.strm.avail_in === 0) break;
            if (L = r.strm, U = r.window, C = r.strstart + r.lookahead, G = v, Y = void 0, Y = L.avail_in, G < Y && (Y = G), B = Y === 0 ? 0 : (L.avail_in -= Y, i.arraySet(U, L.input, L.next_in, Y, C), L.state.wrap === 1 ? L.adler = d(L.adler, U, Y, C) : L.state.wrap === 2 && (L.adler = g(L.adler, U, Y, C)), L.next_in += Y, L.total_in += Y, Y), r.lookahead += B, r.lookahead + r.insert >= P) for (A = r.strstart - r.insert, r.ins_h = r.window[A], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[A + P - 1]) & r.hash_mask, r.prev[A & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = A, A++, r.insert--, !(r.lookahead + r.insert < P)); ) ;
          } while (r.lookahead < J && r.strm.avail_in !== 0);
        }
        function Q(r, D) {
          for (var B, x; ; ) {
            if (r.lookahead < J) {
              if (V(r), r.lookahead < J && D === u) return c;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= P && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + P - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), B !== 0 && r.strstart - B <= r.w_size - J && (r.match_length = E(r, B)), r.match_length >= P) if (x = o._tr_tally(r, r.strstart - r.match_start, r.match_length - P), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= P) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + P - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else x = o._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (x && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < P - 1 ? r.strstart : P - 1, D === p ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function K(r, D) {
          for (var B, x, v; ; ) {
            if (r.lookahead < J) {
              if (V(r), r.lookahead < J && D === u) return c;
              if (r.lookahead === 0) break;
            }
            if (B = 0, r.lookahead >= P && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + P - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = P - 1, B !== 0 && r.prev_length < r.max_lazy_match && r.strstart - B <= r.w_size - J && (r.match_length = E(r, B), r.match_length <= 5 && (r.strategy === 1 || r.match_length === P && 4096 < r.strstart - r.match_start) && (r.match_length = P - 1)), r.prev_length >= P && r.match_length <= r.prev_length) {
              for (v = r.strstart + r.lookahead - P, x = o._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - P), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= v && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + P - 1]) & r.hash_mask, B = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = P - 1, r.strstart++, x && (T(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((x = o._tr_tally(r, 0, r.window[r.strstart - 1])) && T(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (x = o._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < P - 1 ? r.strstart : P - 1, D === p ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function H(r, D, B, x, v) {
          this.good_length = r, this.max_lazy = D, this.nice_length = B, this.max_chain = x, this.func = v;
        }
        function tt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = w, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * O), this.dyn_dtree = new i.Buf16(2 * (2 * R + 1)), this.bl_tree = new i.Buf16(2 * (2 * I + 1)), nt(this.dyn_ltree), nt(this.dyn_dtree), nt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(W + 1), this.heap = new i.Buf16(2 * k + 1), nt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * k + 1), nt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(r) {
          var D;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = y, (D = r.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? S : N, r.adler = D.wrap === 2 ? 0 : 1, D.last_flush = u, o._tr_init(D), h) : st(r, m);
        }
        function at(r) {
          var D = ot(r);
          return D === h && (function(B) {
            B.window_size = 2 * B.w_size, nt(B.head), B.max_lazy_match = s[B.level].max_lazy, B.good_match = s[B.level].good_length, B.nice_match = s[B.level].nice_length, B.max_chain_length = s[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = P - 1, B.match_available = 0, B.ins_h = 0;
          })(r.state), D;
        }
        function ht(r, D, B, x, v, A) {
          if (!r) return m;
          var L = 1;
          if (D === n && (D = 6), x < 0 ? (L = 0, x = -x) : 15 < x && (L = 2, x -= 16), v < 1 || M < v || B !== w || x < 8 || 15 < x || D < 0 || 9 < D || A < 0 || _ < A) return st(r, m);
          x === 8 && (x = 9);
          var U = new tt();
          return (r.state = U).strm = r, U.wrap = L, U.gzhead = null, U.w_bits = x, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = v + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + P - 1) / P), U.window = new i.Buf8(2 * U.w_size), U.head = new i.Buf16(U.hash_size), U.prev = new i.Buf16(U.w_size), U.lit_bufsize = 1 << v + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new i.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = D, U.strategy = A, U.method = B, at(r);
        }
        s = [new H(0, 0, 0, 0, function(r, D) {
          var B = 65535;
          for (B > r.pending_buf_size - 5 && (B = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (V(r), r.lookahead === 0 && D === u) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var x = r.block_start + B;
            if ((r.strstart === 0 || r.strstart >= x) && (r.lookahead = r.strstart - x, r.strstart = x, T(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - J && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, D === p ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : (r.strstart > r.block_start && (T(r, !1), r.strm.avail_out), c);
        }), new H(4, 4, 8, 4, Q), new H(4, 5, 16, 8, Q), new H(4, 6, 32, 32, Q), new H(4, 4, 16, 16, K), new H(8, 16, 32, 32, K), new H(8, 16, 128, 128, K), new H(8, 32, 128, 256, K), new H(32, 128, 258, 1024, K), new H(32, 258, 258, 4096, K)], l.deflateInit = function(r, D) {
          return ht(r, D, w, 15, 8, 0);
        }, l.deflateInit2 = ht, l.deflateReset = at, l.deflateResetKeep = ot, l.deflateSetHeader = function(r, D) {
          return r && r.state ? r.state.wrap !== 2 ? m : (r.state.gzhead = D, h) : m;
        }, l.deflate = function(r, D) {
          var B, x, v, A;
          if (!r || !r.state || 5 < D || D < 0) return r ? st(r, m) : m;
          if (x = r.state, !r.output || !r.input && r.avail_in !== 0 || x.status === 666 && D !== p) return st(r, r.avail_out === 0 ? -5 : m);
          if (x.strm = r, B = x.last_flush, x.last_flush = D, x.status === S) if (x.wrap === 2) r.adler = 0, et(x, 31), et(x, 139), et(x, 8), x.gzhead ? (et(x, (x.gzhead.text ? 1 : 0) + (x.gzhead.hcrc ? 2 : 0) + (x.gzhead.extra ? 4 : 0) + (x.gzhead.name ? 8 : 0) + (x.gzhead.comment ? 16 : 0)), et(x, 255 & x.gzhead.time), et(x, x.gzhead.time >> 8 & 255), et(x, x.gzhead.time >> 16 & 255), et(x, x.gzhead.time >> 24 & 255), et(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), et(x, 255 & x.gzhead.os), x.gzhead.extra && x.gzhead.extra.length && (et(x, 255 & x.gzhead.extra.length), et(x, x.gzhead.extra.length >> 8 & 255)), x.gzhead.hcrc && (r.adler = g(r.adler, x.pending_buf, x.pending, 0)), x.gzindex = 0, x.status = 69) : (et(x, 0), et(x, 0), et(x, 0), et(x, 0), et(x, 0), et(x, x.level === 9 ? 2 : 2 <= x.strategy || x.level < 2 ? 4 : 0), et(x, 3), x.status = N);
          else {
            var L = w + (x.w_bits - 8 << 4) << 8;
            L |= (2 <= x.strategy || x.level < 2 ? 0 : x.level < 6 ? 1 : x.level === 6 ? 2 : 3) << 6, x.strstart !== 0 && (L |= 32), L += 31 - L % 31, x.status = N, z(x, L), x.strstart !== 0 && (z(x, r.adler >>> 16), z(x, 65535 & r.adler)), r.adler = 1;
          }
          if (x.status === 69) if (x.gzhead.extra) {
            for (v = x.pending; x.gzindex < (65535 & x.gzhead.extra.length) && (x.pending !== x.pending_buf_size || (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), F(r), v = x.pending, x.pending !== x.pending_buf_size)); ) et(x, 255 & x.gzhead.extra[x.gzindex]), x.gzindex++;
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), x.gzindex === x.gzhead.extra.length && (x.gzindex = 0, x.status = 73);
          } else x.status = 73;
          if (x.status === 73) if (x.gzhead.name) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), F(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.name.length ? 255 & x.gzhead.name.charCodeAt(x.gzindex++) : 0, et(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.gzindex = 0, x.status = 91);
          } else x.status = 91;
          if (x.status === 91) if (x.gzhead.comment) {
            v = x.pending;
            do {
              if (x.pending === x.pending_buf_size && (x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), F(r), v = x.pending, x.pending === x.pending_buf_size)) {
                A = 1;
                break;
              }
              A = x.gzindex < x.gzhead.comment.length ? 255 & x.gzhead.comment.charCodeAt(x.gzindex++) : 0, et(x, A);
            } while (A !== 0);
            x.gzhead.hcrc && x.pending > v && (r.adler = g(r.adler, x.pending_buf, x.pending - v, v)), A === 0 && (x.status = 103);
          } else x.status = 103;
          if (x.status === 103 && (x.gzhead.hcrc ? (x.pending + 2 > x.pending_buf_size && F(r), x.pending + 2 <= x.pending_buf_size && (et(x, 255 & r.adler), et(x, r.adler >> 8 & 255), r.adler = 0, x.status = N)) : x.status = N), x.pending !== 0) {
            if (F(r), r.avail_out === 0) return x.last_flush = -1, h;
          } else if (r.avail_in === 0 && q(D) <= q(B) && D !== p) return st(r, -5);
          if (x.status === 666 && r.avail_in !== 0) return st(r, -5);
          if (r.avail_in !== 0 || x.lookahead !== 0 || D !== u && x.status !== 666) {
            var U = x.strategy === 2 ? (function(C, G) {
              for (var Y; ; ) {
                if (C.lookahead === 0 && (V(C), C.lookahead === 0)) {
                  if (G === u) return c;
                  break;
                }
                if (C.match_length = 0, Y = o._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, Y && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === p ? (T(C, !0), C.strm.avail_out === 0 ? it : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : $;
            })(x, D) : x.strategy === 3 ? (function(C, G) {
              for (var Y, Z, rt, ct, lt = C.window; ; ) {
                if (C.lookahead <= j) {
                  if (V(C), C.lookahead <= j && G === u) return c;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= P && 0 < C.strstart && (Z = lt[rt = C.strstart - 1]) === lt[++rt] && Z === lt[++rt] && Z === lt[++rt]) {
                  ct = C.strstart + j;
                  do
                    ;
                  while (Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && Z === lt[++rt] && rt < ct);
                  C.match_length = j - (ct - rt), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= P ? (Y = o._tr_tally(C, 1, C.match_length - P), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (Y = o._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), Y && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === p ? (T(C, !0), C.strm.avail_out === 0 ? it : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : $;
            })(x, D) : s[x.level].func(x, D);
            if (U !== it && U !== X || (x.status = 666), U === c || U === it) return r.avail_out === 0 && (x.last_flush = -1), h;
            if (U === $ && (D === 1 ? o._tr_align(x) : D !== 5 && (o._tr_stored_block(x, 0, 0, !1), D === 3 && (nt(x.head), x.lookahead === 0 && (x.strstart = 0, x.block_start = 0, x.insert = 0))), F(r), r.avail_out === 0)) return x.last_flush = -1, h;
          }
          return D !== p ? h : x.wrap <= 0 ? 1 : (x.wrap === 2 ? (et(x, 255 & r.adler), et(x, r.adler >> 8 & 255), et(x, r.adler >> 16 & 255), et(x, r.adler >> 24 & 255), et(x, 255 & r.total_in), et(x, r.total_in >> 8 & 255), et(x, r.total_in >> 16 & 255), et(x, r.total_in >> 24 & 255)) : (z(x, r.adler >>> 16), z(x, 65535 & r.adler)), F(r), 0 < x.wrap && (x.wrap = -x.wrap), x.pending !== 0 ? h : 1);
        }, l.deflateEnd = function(r) {
          var D;
          return r && r.state ? (D = r.state.status) !== S && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== N && D !== 666 ? st(r, m) : (r.state = null, D === N ? st(r, -3) : h) : m;
        }, l.deflateSetDictionary = function(r, D) {
          var B, x, v, A, L, U, C, G, Y = D.length;
          if (!r || !r.state || (A = (B = r.state).wrap) === 2 || A === 1 && B.status !== S || B.lookahead) return m;
          for (A === 1 && (r.adler = d(r.adler, D, Y, 0)), B.wrap = 0, Y >= B.w_size && (A === 0 && (nt(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), G = new i.Buf8(B.w_size), i.arraySet(G, D, Y - B.w_size, B.w_size, 0), D = G, Y = B.w_size), L = r.avail_in, U = r.next_in, C = r.input, r.avail_in = Y, r.next_in = 0, r.input = D, V(B); B.lookahead >= P; ) {
            for (x = B.strstart, v = B.lookahead - (P - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[x + P - 1]) & B.hash_mask, B.prev[x & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = x, x++, --v; ) ;
            B.strstart = x, B.lookahead = P - 1, V(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = P - 1, B.match_available = 0, r.next_in = U, r.input = C, r.avail_in = L, B.wrap = A, h;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(s, i) {
          var o, d, g, b, u, p, h, m, n, _, y, w, M, k, R, I, O, W, P, j, J, S, N, c, $;
          o = s.state, d = s.next_in, c = s.input, g = d + (s.avail_in - 5), b = s.next_out, $ = s.output, u = b - (i - s.avail_out), p = b + (s.avail_out - 257), h = o.dmax, m = o.wsize, n = o.whave, _ = o.wnext, y = o.window, w = o.hold, M = o.bits, k = o.lencode, R = o.distcode, I = (1 << o.lenbits) - 1, O = (1 << o.distbits) - 1;
          t: do {
            M < 15 && (w += c[d++] << M, M += 8, w += c[d++] << M, M += 8), W = k[w & I];
            e: for (; ; ) {
              if (w >>>= P = W >>> 24, M -= P, (P = W >>> 16 & 255) === 0) $[b++] = 65535 & W;
              else {
                if (!(16 & P)) {
                  if ((64 & P) == 0) {
                    W = k[(65535 & W) + (w & (1 << P) - 1)];
                    continue e;
                  }
                  if (32 & P) {
                    o.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                j = 65535 & W, (P &= 15) && (M < P && (w += c[d++] << M, M += 8), j += w & (1 << P) - 1, w >>>= P, M -= P), M < 15 && (w += c[d++] << M, M += 8, w += c[d++] << M, M += 8), W = R[w & O];
                r: for (; ; ) {
                  if (w >>>= P = W >>> 24, M -= P, !(16 & (P = W >>> 16 & 255))) {
                    if ((64 & P) == 0) {
                      W = R[(65535 & W) + (w & (1 << P) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (J = 65535 & W, M < (P &= 15) && (w += c[d++] << M, (M += 8) < P && (w += c[d++] << M, M += 8)), h < (J += w & (1 << P) - 1)) {
                    s.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (w >>>= P, M -= P, (P = b - u) < J) {
                    if (n < (P = J - P) && o.sane) {
                      s.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (N = y, (S = 0) === _) {
                      if (S += m - P, P < j) {
                        for (j -= P; $[b++] = y[S++], --P; ) ;
                        S = b - J, N = $;
                      }
                    } else if (_ < P) {
                      if (S += m + _ - P, (P -= _) < j) {
                        for (j -= P; $[b++] = y[S++], --P; ) ;
                        if (S = 0, _ < j) {
                          for (j -= P = _; $[b++] = y[S++], --P; ) ;
                          S = b - J, N = $;
                        }
                      }
                    } else if (S += _ - P, P < j) {
                      for (j -= P; $[b++] = y[S++], --P; ) ;
                      S = b - J, N = $;
                    }
                    for (; 2 < j; ) $[b++] = N[S++], $[b++] = N[S++], $[b++] = N[S++], j -= 3;
                    j && ($[b++] = N[S++], 1 < j && ($[b++] = N[S++]));
                  } else {
                    for (S = b - J; $[b++] = $[S++], $[b++] = $[S++], $[b++] = $[S++], 2 < (j -= 3); ) ;
                    j && ($[b++] = $[S++], 1 < j && ($[b++] = $[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (d < g && b < p);
          d -= j = M >> 3, w &= (1 << (M -= j << 3)) - 1, s.next_in = d, s.next_out = b, s.avail_in = d < g ? g - d + 5 : 5 - (d - g), s.avail_out = b < p ? p - b + 257 : 257 - (b - p), o.hold = w, o.bits = M;
        };
      }, {}], 49: [function(e, a, l) {
        var s = e("../utils/common"), i = e("./adler32"), o = e("./crc32"), d = e("./inffast"), g = e("./inftrees"), b = 1, u = 2, p = 0, h = -2, m = 1, n = 852, _ = 592;
        function y(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function w() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function M(S) {
          var N;
          return S && S.state ? (N = S.state, S.total_in = S.total_out = N.total = 0, S.msg = "", N.wrap && (S.adler = 1 & N.wrap), N.mode = m, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new s.Buf32(n), N.distcode = N.distdyn = new s.Buf32(_), N.sane = 1, N.back = -1, p) : h;
        }
        function k(S) {
          var N;
          return S && S.state ? ((N = S.state).wsize = 0, N.whave = 0, N.wnext = 0, M(S)) : h;
        }
        function R(S, N) {
          var c, $;
          return S && S.state ? ($ = S.state, N < 0 ? (c = 0, N = -N) : (c = 1 + (N >> 4), N < 48 && (N &= 15)), N && (N < 8 || 15 < N) ? h : ($.window !== null && $.wbits !== N && ($.window = null), $.wrap = c, $.wbits = N, k(S))) : h;
        }
        function I(S, N) {
          var c, $;
          return S ? ($ = new w(), (S.state = $).window = null, (c = R(S, N)) !== p && (S.state = null), c) : h;
        }
        var O, W, P = !0;
        function j(S) {
          if (P) {
            var N;
            for (O = new s.Buf32(512), W = new s.Buf32(32), N = 0; N < 144; ) S.lens[N++] = 8;
            for (; N < 256; ) S.lens[N++] = 9;
            for (; N < 280; ) S.lens[N++] = 7;
            for (; N < 288; ) S.lens[N++] = 8;
            for (g(b, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), N = 0; N < 32; ) S.lens[N++] = 5;
            g(u, S.lens, 0, 32, W, 0, S.work, { bits: 5 }), P = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = W, S.distbits = 5;
        }
        function J(S, N, c, $) {
          var it, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new s.Buf8(X.wsize)), $ >= X.wsize ? (s.arraySet(X.window, N, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : ($ < (it = X.wsize - X.wnext) && (it = $), s.arraySet(X.window, N, c - $, it, X.wnext), ($ -= it) ? (s.arraySet(X.window, N, c - $, $, 0), X.wnext = $, X.whave = X.wsize) : (X.wnext += it, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += it))), 0;
        }
        l.inflateReset = k, l.inflateReset2 = R, l.inflateResetKeep = M, l.inflateInit = function(S) {
          return I(S, 15);
        }, l.inflateInit2 = I, l.inflate = function(S, N) {
          var c, $, it, X, st, q, nt, F, T, et, z, E, V, Q, K, H, tt, ot, at, ht, r, D, B, x, v = 0, A = new s.Buf8(4), L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return h;
          (c = S.state).mode === 12 && (c.mode = 13), st = S.next_out, it = S.output, nt = S.avail_out, X = S.next_in, $ = S.input, q = S.avail_in, F = c.hold, T = c.bits, et = q, z = nt, D = p;
          t: for (; ; ) switch (c.mode) {
            case m:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (q === 0) break t;
                q--, F += $[X++] << T, T += 8;
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
                q--, F += $[X++] << T, T += 8;
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
                q--, F += $[X++] << T, T += 8;
              }
              c.head && (c.head.time = F), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, A[2] = F >>> 16 & 255, A[3] = F >>> 24 & 255, c.check = o(c.check, A, 4, 0)), T = F = 0, c.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (q === 0) break t;
                q--, F += $[X++] << T, T += 8;
              }
              c.head && (c.head.xflags = 255 & F, c.head.os = F >> 8), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0)), T = F = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; T < 16; ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                c.length = F, c.head && (c.head.extra_len = F), 512 & c.flags && (A[0] = 255 & F, A[1] = F >>> 8 & 255, c.check = o(c.check, A, 2, 0)), T = F = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (q < (E = c.length) && (E = q), E && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), s.arraySet(c.head.extra, $, X, E, r)), 512 & c.flags && (c.check = o(c.check, $, E, X)), q -= E, X += E, c.length -= E), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (q === 0) break t;
                for (E = 0; r = $[X + E++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && E < q; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, E, X)), q -= E, X += E, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (q === 0) break t;
                for (E = 0; r = $[X + E++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && E < q; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, E, X)), q -= E, X += E, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; T < 16; ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
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
                q--, F += $[X++] << T, T += 8;
              }
              S.adler = c.check = y(F), T = F = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return S.next_out = st, S.avail_out = nt, S.next_in = X, S.avail_in = q, c.hold = F, c.bits = T, 2;
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
                q--, F += $[X++] << T, T += 8;
              }
              switch (c.last = 1 & F, T -= 1, 3 & (F >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (j(c), c.mode = 20, N !== 6) break;
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
                q--, F += $[X++] << T, T += 8;
              }
              if ((65535 & F) != (F >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & F, T = F = 0, c.mode = 15, N === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (E = c.length) {
                if (q < E && (E = q), nt < E && (E = nt), E === 0) break t;
                s.arraySet(it, $, X, E, st), q -= E, X += E, nt -= E, st += E, c.length -= E;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (q === 0) break t;
                q--, F += $[X++] << T, T += 8;
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
                  q--, F += $[X++] << T, T += 8;
                }
                c.lens[L[c.have++]] = 7 & F, F >>>= 3, T -= 3;
              }
              for (; c.have < 19; ) c.lens[L[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, B = { bits: c.lenbits }, D = g(0, c.lens, 0, 19, c.lencode, 0, c.work, B), c.lenbits = B.bits, D) {
                S.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; H = (v = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, tt = 65535 & v, !((K = v >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                if (tt < 16) F >>>= K, T -= K, c.lens[c.have++] = tt;
                else {
                  if (tt === 16) {
                    for (x = K + 2; T < x; ) {
                      if (q === 0) break t;
                      q--, F += $[X++] << T, T += 8;
                    }
                    if (F >>>= K, T -= K, c.have === 0) {
                      S.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], E = 3 + (3 & F), F >>>= 2, T -= 2;
                  } else if (tt === 17) {
                    for (x = K + 3; T < x; ) {
                      if (q === 0) break t;
                      q--, F += $[X++] << T, T += 8;
                    }
                    T -= K, r = 0, E = 3 + (7 & (F >>>= K)), F >>>= 3, T -= 3;
                  } else {
                    for (x = K + 7; T < x; ) {
                      if (q === 0) break t;
                      q--, F += $[X++] << T, T += 8;
                    }
                    T -= K, r = 0, E = 11 + (127 & (F >>>= K)), F >>>= 7, T -= 7;
                  }
                  if (c.have + E > c.nlen + c.ndist) {
                    S.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; E--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, B = { bits: c.lenbits }, D = g(b, c.lens, 0, c.nlen, c.lencode, 0, c.work, B), c.lenbits = B.bits, D) {
                S.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, B = { bits: c.distbits }, D = g(u, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, B), c.distbits = B.bits, D) {
                S.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, N === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= q && 258 <= nt) {
                S.next_out = st, S.avail_out = nt, S.next_in = X, S.avail_in = q, c.hold = F, c.bits = T, d(S, z), st = S.next_out, it = S.output, nt = S.avail_out, X = S.next_in, $ = S.input, q = S.avail_in, F = c.hold, T = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; H = (v = c.lencode[F & (1 << c.lenbits) - 1]) >>> 16 & 255, tt = 65535 & v, !((K = v >>> 24) <= T); ) {
                if (q === 0) break t;
                q--, F += $[X++] << T, T += 8;
              }
              if (H && (240 & H) == 0) {
                for (ot = K, at = H, ht = tt; H = (v = c.lencode[ht + ((F & (1 << ot + at) - 1) >> ot)]) >>> 16 & 255, tt = 65535 & v, !(ot + (K = v >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                F >>>= ot, T -= ot, c.back += ot;
              }
              if (F >>>= K, T -= K, c.back += K, c.length = tt, H === 0) {
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
                for (x = c.extra; T < x; ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                c.length += F & (1 << c.extra) - 1, F >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; H = (v = c.distcode[F & (1 << c.distbits) - 1]) >>> 16 & 255, tt = 65535 & v, !((K = v >>> 24) <= T); ) {
                if (q === 0) break t;
                q--, F += $[X++] << T, T += 8;
              }
              if ((240 & H) == 0) {
                for (ot = K, at = H, ht = tt; H = (v = c.distcode[ht + ((F & (1 << ot + at) - 1) >> ot)]) >>> 16 & 255, tt = 65535 & v, !(ot + (K = v >>> 24) <= T); ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                F >>>= ot, T -= ot, c.back += ot;
              }
              if (F >>>= K, T -= K, c.back += K, 64 & H) {
                S.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = tt, c.extra = 15 & H, c.mode = 24;
            case 24:
              if (c.extra) {
                for (x = c.extra; T < x; ) {
                  if (q === 0) break t;
                  q--, F += $[X++] << T, T += 8;
                }
                c.offset += F & (1 << c.extra) - 1, F >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                S.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (nt === 0) break t;
              if (E = z - nt, c.offset > E) {
                if ((E = c.offset - E) > c.whave && c.sane) {
                  S.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                V = E > c.wnext ? (E -= c.wnext, c.wsize - E) : c.wnext - E, E > c.length && (E = c.length), Q = c.window;
              } else Q = it, V = st - c.offset, E = c.length;
              for (nt < E && (E = nt), nt -= E, c.length -= E; it[st++] = Q[V++], --E; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (nt === 0) break t;
              it[st++] = c.length, nt--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; T < 32; ) {
                  if (q === 0) break t;
                  q--, F |= $[X++] << T, T += 8;
                }
                if (z -= nt, S.total_out += z, c.total += z, z && (S.adler = c.check = c.flags ? o(c.check, it, z, st - z) : i(c.check, it, z, st - z)), z = nt, (c.flags ? F : y(F)) !== c.check) {
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
                  q--, F += $[X++] << T, T += 8;
                }
                if (F !== (4294967295 & c.total)) {
                  S.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                T = F = 0;
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
              return h;
          }
          return S.next_out = st, S.avail_out = nt, S.next_in = X, S.avail_in = q, c.hold = F, c.bits = T, (c.wsize || z !== S.avail_out && c.mode < 30 && (c.mode < 27 || N !== 4)) && J(S, S.output, S.next_out, z - S.avail_out) ? (c.mode = 31, -4) : (et -= S.avail_in, z -= S.avail_out, S.total_in += et, S.total_out += z, c.total += z, c.wrap && z && (S.adler = c.check = c.flags ? o(c.check, it, z, S.next_out - z) : i(c.check, it, z, S.next_out - z)), S.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (et == 0 && z === 0 || N === 4) && D === p && (D = -5), D);
        }, l.inflateEnd = function(S) {
          if (!S || !S.state) return h;
          var N = S.state;
          return N.window && (N.window = null), S.state = null, p;
        }, l.inflateGetHeader = function(S, N) {
          var c;
          return S && S.state ? (2 & (c = S.state).wrap) == 0 ? h : ((c.head = N).done = !1, p) : h;
        }, l.inflateSetDictionary = function(S, N) {
          var c, $ = N.length;
          return S && S.state ? (c = S.state).wrap !== 0 && c.mode !== 11 ? h : c.mode === 11 && i(1, N, $, 0) !== c.check ? -3 : J(S, N, $, $) ? (c.mode = 31, -4) : (c.havedict = 1, p) : h;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var s = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], d = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(b, u, p, h, m, n, _, y) {
          var w, M, k, R, I, O, W, P, j, J = y.bits, S = 0, N = 0, c = 0, $ = 0, it = 0, X = 0, st = 0, q = 0, nt = 0, F = 0, T = null, et = 0, z = new s.Buf16(16), E = new s.Buf16(16), V = null, Q = 0;
          for (S = 0; S <= 15; S++) z[S] = 0;
          for (N = 0; N < h; N++) z[u[p + N]]++;
          for (it = J, $ = 15; 1 <= $ && z[$] === 0; $--) ;
          if ($ < it && (it = $), $ === 0) return m[n++] = 20971520, m[n++] = 20971520, y.bits = 1, 0;
          for (c = 1; c < $ && z[c] === 0; c++) ;
          for (it < c && (it = c), S = q = 1; S <= 15; S++) if (q <<= 1, (q -= z[S]) < 0) return -1;
          if (0 < q && (b === 0 || $ !== 1)) return -1;
          for (E[1] = 0, S = 1; S < 15; S++) E[S + 1] = E[S] + z[S];
          for (N = 0; N < h; N++) u[p + N] !== 0 && (_[E[u[p + N]]++] = N);
          if (O = b === 0 ? (T = V = _, 19) : b === 1 ? (T = i, et -= 257, V = o, Q -= 257, 256) : (T = d, V = g, -1), S = c, I = n, st = N = F = 0, k = -1, R = (nt = 1 << (X = it)) - 1, b === 1 && 852 < nt || b === 2 && 592 < nt) return 1;
          for (; ; ) {
            for (W = S - st, j = _[N] < O ? (P = 0, _[N]) : _[N] > O ? (P = V[Q + _[N]], T[et + _[N]]) : (P = 96, 0), w = 1 << S - st, c = M = 1 << X; m[I + (F >> st) + (M -= w)] = W << 24 | P << 16 | j | 0, M !== 0; ) ;
            for (w = 1 << S - 1; F & w; ) w >>= 1;
            if (w !== 0 ? (F &= w - 1, F += w) : F = 0, N++, --z[S] == 0) {
              if (S === $) break;
              S = u[p + _[N]];
            }
            if (it < S && (F & R) !== k) {
              for (st === 0 && (st = it), I += c, q = 1 << (X = S - st); X + st < $ && !((q -= z[X + st]) <= 0); ) X++, q <<= 1;
              if (nt += 1 << X, b === 1 && 852 < nt || b === 2 && 592 < nt) return 1;
              m[k = F & R] = it << 24 | X << 16 | I - n | 0;
            }
          }
          return F !== 0 && (m[I + F] = S - st << 24 | 64 << 16 | 0), y.bits = it, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var s = e("../utils/common"), i = 0, o = 1;
        function d(v) {
          for (var A = v.length; 0 <= --A; ) v[A] = 0;
        }
        var g = 0, b = 29, u = 256, p = u + 1 + b, h = 30, m = 19, n = 2 * p + 1, _ = 15, y = 16, w = 7, M = 256, k = 16, R = 17, I = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], W = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], P = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], J = new Array(2 * (p + 2));
        d(J);
        var S = new Array(2 * h);
        d(S);
        var N = new Array(512);
        d(N);
        var c = new Array(256);
        d(c);
        var $ = new Array(b);
        d($);
        var it, X, st, q = new Array(h);
        function nt(v, A, L, U, C) {
          this.static_tree = v, this.extra_bits = A, this.extra_base = L, this.elems = U, this.max_length = C, this.has_stree = v && v.length;
        }
        function F(v, A) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = A;
        }
        function T(v) {
          return v < 256 ? N[v] : N[256 + (v >>> 7)];
        }
        function et(v, A) {
          v.pending_buf[v.pending++] = 255 & A, v.pending_buf[v.pending++] = A >>> 8 & 255;
        }
        function z(v, A, L) {
          v.bi_valid > y - L ? (v.bi_buf |= A << v.bi_valid & 65535, et(v, v.bi_buf), v.bi_buf = A >> y - v.bi_valid, v.bi_valid += L - y) : (v.bi_buf |= A << v.bi_valid & 65535, v.bi_valid += L);
        }
        function E(v, A, L) {
          z(v, L[2 * A], L[2 * A + 1]);
        }
        function V(v, A) {
          for (var L = 0; L |= 1 & v, v >>>= 1, L <<= 1, 0 < --A; ) ;
          return L >>> 1;
        }
        function Q(v, A, L) {
          var U, C, G = new Array(_ + 1), Y = 0;
          for (U = 1; U <= _; U++) G[U] = Y = Y + L[U - 1] << 1;
          for (C = 0; C <= A; C++) {
            var Z = v[2 * C + 1];
            Z !== 0 && (v[2 * C] = V(G[Z]++, Z));
          }
        }
        function K(v) {
          var A;
          for (A = 0; A < p; A++) v.dyn_ltree[2 * A] = 0;
          for (A = 0; A < h; A++) v.dyn_dtree[2 * A] = 0;
          for (A = 0; A < m; A++) v.bl_tree[2 * A] = 0;
          v.dyn_ltree[2 * M] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function H(v) {
          8 < v.bi_valid ? et(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function tt(v, A, L, U) {
          var C = 2 * A, G = 2 * L;
          return v[C] < v[G] || v[C] === v[G] && U[A] <= U[L];
        }
        function ot(v, A, L) {
          for (var U = v.heap[L], C = L << 1; C <= v.heap_len && (C < v.heap_len && tt(A, v.heap[C + 1], v.heap[C], v.depth) && C++, !tt(A, U, v.heap[C], v.depth)); ) v.heap[L] = v.heap[C], L = C, C <<= 1;
          v.heap[L] = U;
        }
        function at(v, A, L) {
          var U, C, G, Y, Z = 0;
          if (v.last_lit !== 0) for (; U = v.pending_buf[v.d_buf + 2 * Z] << 8 | v.pending_buf[v.d_buf + 2 * Z + 1], C = v.pending_buf[v.l_buf + Z], Z++, U === 0 ? E(v, C, A) : (E(v, (G = c[C]) + u + 1, A), (Y = O[G]) !== 0 && z(v, C -= $[G], Y), E(v, G = T(--U), L), (Y = W[G]) !== 0 && z(v, U -= q[G], Y)), Z < v.last_lit; ) ;
          E(v, M, A);
        }
        function ht(v, A) {
          var L, U, C, G = A.dyn_tree, Y = A.stat_desc.static_tree, Z = A.stat_desc.has_stree, rt = A.stat_desc.elems, ct = -1;
          for (v.heap_len = 0, v.heap_max = n, L = 0; L < rt; L++) G[2 * L] !== 0 ? (v.heap[++v.heap_len] = ct = L, v.depth[L] = 0) : G[2 * L + 1] = 0;
          for (; v.heap_len < 2; ) G[2 * (C = v.heap[++v.heap_len] = ct < 2 ? ++ct : 0)] = 1, v.depth[C] = 0, v.opt_len--, Z && (v.static_len -= Y[2 * C + 1]);
          for (A.max_code = ct, L = v.heap_len >> 1; 1 <= L; L--) ot(v, G, L);
          for (C = rt; L = v.heap[1], v.heap[1] = v.heap[v.heap_len--], ot(v, G, 1), U = v.heap[1], v.heap[--v.heap_max] = L, v.heap[--v.heap_max] = U, G[2 * C] = G[2 * L] + G[2 * U], v.depth[C] = (v.depth[L] >= v.depth[U] ? v.depth[L] : v.depth[U]) + 1, G[2 * L + 1] = G[2 * U + 1] = C, v.heap[1] = C++, ot(v, G, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(lt, pt) {
            var Et, _t, Ct, dt, Ot, $t, wt = pt.dyn_tree, Zt = pt.max_code, ue = pt.stat_desc.static_tree, fe = pt.stat_desc.has_stree, me = pt.stat_desc.extra_bits, Gt = pt.stat_desc.extra_base, It = pt.stat_desc.max_length, Bt = 0;
            for (dt = 0; dt <= _; dt++) lt.bl_count[dt] = 0;
            for (wt[2 * lt.heap[lt.heap_max] + 1] = 0, Et = lt.heap_max + 1; Et < n; Et++) It < (dt = wt[2 * wt[2 * (_t = lt.heap[Et]) + 1] + 1] + 1) && (dt = It, Bt++), wt[2 * _t + 1] = dt, Zt < _t || (lt.bl_count[dt]++, Ot = 0, Gt <= _t && (Ot = me[_t - Gt]), $t = wt[2 * _t], lt.opt_len += $t * (dt + Ot), fe && (lt.static_len += $t * (ue[2 * _t + 1] + Ot)));
            if (Bt !== 0) {
              do {
                for (dt = It - 1; lt.bl_count[dt] === 0; ) dt--;
                lt.bl_count[dt]--, lt.bl_count[dt + 1] += 2, lt.bl_count[It]--, Bt -= 2;
              } while (0 < Bt);
              for (dt = It; dt !== 0; dt--) for (_t = lt.bl_count[dt]; _t !== 0; ) Zt < (Ct = lt.heap[--Et]) || (wt[2 * Ct + 1] !== dt && (lt.opt_len += (dt - wt[2 * Ct + 1]) * wt[2 * Ct], wt[2 * Ct + 1] = dt), _t--);
            }
          })(v, A), Q(G, ct, v.bl_count);
        }
        function r(v, A, L) {
          var U, C, G = -1, Y = A[1], Z = 0, rt = 7, ct = 4;
          for (Y === 0 && (rt = 138, ct = 3), A[2 * (L + 1) + 1] = 65535, U = 0; U <= L; U++) C = Y, Y = A[2 * (U + 1) + 1], ++Z < rt && C === Y || (Z < ct ? v.bl_tree[2 * C] += Z : C !== 0 ? (C !== G && v.bl_tree[2 * C]++, v.bl_tree[2 * k]++) : Z <= 10 ? v.bl_tree[2 * R]++ : v.bl_tree[2 * I]++, G = C, ct = (Z = 0) === Y ? (rt = 138, 3) : C === Y ? (rt = 6, 3) : (rt = 7, 4));
        }
        function D(v, A, L) {
          var U, C, G = -1, Y = A[1], Z = 0, rt = 7, ct = 4;
          for (Y === 0 && (rt = 138, ct = 3), U = 0; U <= L; U++) if (C = Y, Y = A[2 * (U + 1) + 1], !(++Z < rt && C === Y)) {
            if (Z < ct) for (; E(v, C, v.bl_tree), --Z != 0; ) ;
            else C !== 0 ? (C !== G && (E(v, C, v.bl_tree), Z--), E(v, k, v.bl_tree), z(v, Z - 3, 2)) : Z <= 10 ? (E(v, R, v.bl_tree), z(v, Z - 3, 3)) : (E(v, I, v.bl_tree), z(v, Z - 11, 7));
            G = C, ct = (Z = 0) === Y ? (rt = 138, 3) : C === Y ? (rt = 6, 3) : (rt = 7, 4);
          }
        }
        d(q);
        var B = !1;
        function x(v, A, L, U) {
          z(v, (g << 1) + (U ? 1 : 0), 3), (function(C, G, Y, Z) {
            H(C), et(C, Y), et(C, ~Y), s.arraySet(C.pending_buf, C.window, G, Y, C.pending), C.pending += Y;
          })(v, A, L);
        }
        l._tr_init = function(v) {
          B || ((function() {
            var A, L, U, C, G, Y = new Array(_ + 1);
            for (C = U = 0; C < b - 1; C++) for ($[C] = U, A = 0; A < 1 << O[C]; A++) c[U++] = C;
            for (c[U - 1] = C, C = G = 0; C < 16; C++) for (q[C] = G, A = 0; A < 1 << W[C]; A++) N[G++] = C;
            for (G >>= 7; C < h; C++) for (q[C] = G << 7, A = 0; A < 1 << W[C] - 7; A++) N[256 + G++] = C;
            for (L = 0; L <= _; L++) Y[L] = 0;
            for (A = 0; A <= 143; ) J[2 * A + 1] = 8, A++, Y[8]++;
            for (; A <= 255; ) J[2 * A + 1] = 9, A++, Y[9]++;
            for (; A <= 279; ) J[2 * A + 1] = 7, A++, Y[7]++;
            for (; A <= 287; ) J[2 * A + 1] = 8, A++, Y[8]++;
            for (Q(J, p + 1, Y), A = 0; A < h; A++) S[2 * A + 1] = 5, S[2 * A] = V(A, 5);
            it = new nt(J, O, u + 1, p, _), X = new nt(S, W, 0, h, _), st = new nt(new Array(0), P, 0, m, w);
          })(), B = !0), v.l_desc = new F(v.dyn_ltree, it), v.d_desc = new F(v.dyn_dtree, X), v.bl_desc = new F(v.bl_tree, st), v.bi_buf = 0, v.bi_valid = 0, K(v);
        }, l._tr_stored_block = x, l._tr_flush_block = function(v, A, L, U) {
          var C, G, Y = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(Z) {
            var rt, ct = 4093624447;
            for (rt = 0; rt <= 31; rt++, ct >>>= 1) if (1 & ct && Z.dyn_ltree[2 * rt] !== 0) return i;
            if (Z.dyn_ltree[18] !== 0 || Z.dyn_ltree[20] !== 0 || Z.dyn_ltree[26] !== 0) return o;
            for (rt = 32; rt < u; rt++) if (Z.dyn_ltree[2 * rt] !== 0) return o;
            return i;
          })(v)), ht(v, v.l_desc), ht(v, v.d_desc), Y = (function(Z) {
            var rt;
            for (r(Z, Z.dyn_ltree, Z.l_desc.max_code), r(Z, Z.dyn_dtree, Z.d_desc.max_code), ht(Z, Z.bl_desc), rt = m - 1; 3 <= rt && Z.bl_tree[2 * j[rt] + 1] === 0; rt--) ;
            return Z.opt_len += 3 * (rt + 1) + 5 + 5 + 4, rt;
          })(v), C = v.opt_len + 3 + 7 >>> 3, (G = v.static_len + 3 + 7 >>> 3) <= C && (C = G)) : C = G = L + 5, L + 4 <= C && A !== -1 ? x(v, A, L, U) : v.strategy === 4 || G === C ? (z(v, 2 + (U ? 1 : 0), 3), at(v, J, S)) : (z(v, 4 + (U ? 1 : 0), 3), (function(Z, rt, ct, lt) {
            var pt;
            for (z(Z, rt - 257, 5), z(Z, ct - 1, 5), z(Z, lt - 4, 4), pt = 0; pt < lt; pt++) z(Z, Z.bl_tree[2 * j[pt] + 1], 3);
            D(Z, Z.dyn_ltree, rt - 1), D(Z, Z.dyn_dtree, ct - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, Y + 1), at(v, v.dyn_ltree, v.dyn_dtree)), K(v), U && H(v);
        }, l._tr_tally = function(v, A, L) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = A >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & A, v.pending_buf[v.l_buf + v.last_lit] = 255 & L, v.last_lit++, A === 0 ? v.dyn_ltree[2 * L]++ : (v.matches++, A--, v.dyn_ltree[2 * (c[L] + u + 1)]++, v.dyn_dtree[2 * T(A)]++), v.last_lit === v.lit_bufsize - 1;
        }, l._tr_align = function(v) {
          z(v, 2, 3), E(v, M, J), (function(A) {
            A.bi_valid === 16 ? (et(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(s) {
          (function(i, o) {
            if (!i.setImmediate) {
              var d, g, b, u, p = 1, h = {}, m = !1, n = i.document, _ = Object.getPrototypeOf && Object.getPrototypeOf(i);
              _ = _ && _.setTimeout ? _ : i, d = {}.toString.call(i.process) === "[object process]" ? function(k) {
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
              })() ? (u = "setImmediate$" + Math.random() + "$", i.addEventListener ? i.addEventListener("message", M, !1) : i.attachEvent("onmessage", M), function(k) {
                i.postMessage(u + k, "*");
              }) : i.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(k) {
                w(k.data);
              }, function(k) {
                b.port2.postMessage(k);
              }) : n && "onreadystatechange" in n.createElement("script") ? (g = n.documentElement, function(k) {
                var R = n.createElement("script");
                R.onreadystatechange = function() {
                  w(k), R.onreadystatechange = null, g.removeChild(R), R = null;
                }, g.appendChild(R);
              }) : function(k) {
                setTimeout(w, 0, k);
              }, _.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var R = new Array(arguments.length - 1), I = 0; I < R.length; I++) R[I] = arguments[I + 1];
                var O = { callback: k, args: R };
                return h[p] = O, d(p), p++;
              }, _.clearImmediate = y;
            }
            function y(k) {
              delete h[k];
            }
            function w(k) {
              if (m) setTimeout(w, 0, k);
              else {
                var R = h[k];
                if (R) {
                  m = !0;
                  try {
                    (function(I) {
                      var O = I.callback, W = I.args;
                      switch (W.length) {
                        case 0:
                          O();
                          break;
                        case 1:
                          O(W[0]);
                          break;
                        case 2:
                          O(W[0], W[1]);
                          break;
                        case 3:
                          O(W[0], W[1], W[2]);
                          break;
                        default:
                          O.apply(o, W);
                      }
                    })(R);
                  } finally {
                    y(k), m = !1;
                  }
                }
              }
            }
            function M(k) {
              k.source === i && typeof k.data == "string" && k.data.indexOf(u) === 0 && w(+k.data.slice(u.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Ut)), Ut.exports;
}
var ge = ye();
const ie = /* @__PURE__ */ pe(ge);
async function _e(f) {
  const t = await be(f), e = await ie.loadAsync(t), a = [];
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
async function be(f) {
  if (f instanceof ArrayBuffer)
    return f;
  if (f instanceof Blob)
    return await f.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function ve(f) {
  let t = f.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function we(f) {
  return !!f && typeof f == "object" && !(f instanceof ArrayBuffer) && !(f instanceof Uint8Array);
}
function xe(f) {
  return f instanceof Uint8Array ? f : new Uint8Array(f);
}
function ke(f) {
  return f.byteOffset === 0 && f.byteLength === f.buffer.byteLength ? f.buffer : f.slice().buffer;
}
function St(f, t, e = 0) {
  if (f.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (f[e + a] !== t[a]) return !1;
  return !0;
}
function Se(f) {
  return St(f, [80, 75, 3, 4]) || St(f, [80, 75, 5, 6]) || St(f, [80, 75, 7, 8]) ? "zip" : St(f, [82, 97, 114, 33, 26, 7, 0]) || St(f, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : St(f, [55, 122, 188, 175, 39, 28]) ? "7z" : f.length > 262 && St(f, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function ne(f) {
  return f.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Vt(f) {
  const t = [], e = f.map((n) => ne(n).toLowerCase()), a = (n) => e.some(n), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, s = /\.(drl|xln)$/i, i = e.filter((n) => l.test(n)).length, o = e.filter((n) => s.test(n) || n.includes("drill")).length, d = a((n) => n.includes("top") && n.includes("copper") || n.endsWith(".gtl")), g = a((n) => n.includes("bot") || n.includes("bottom") || n.endsWith(".gbl")), b = a((n) => n.includes("mask") || n.includes("solder") || n.endsWith(".gts") || n.endsWith(".gbs")), u = a((n) => n.includes("silk") || n.includes("legend") || n.endsWith(".gto") || n.endsWith(".gbo")), p = a((n) => n.includes("outline") || n.includes("profile") || n.includes("edge") || n.endsWith(".gko") || n.endsWith(".gm1") || n.endsWith(".gml")), h = e.every(
    (n) => n.endsWith(".pdf") || n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".svg") || n.endsWith(".txt") || n.endsWith(".md")
  );
  let m = 0;
  return f.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : h ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (i > 0 ? (m += 0.35, t.push(`Found ${i} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), o > 0 && (m += 0.2, t.push(`Found ${o} drill-like file(s).`)), p && (m += 0.15, t.push("Found outline/profile/edge candidate.")), d && g ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (d || g) && (m += 0.1, t.push("Found at least one copper candidate.")), b && (m += 0.05, t.push("Found solder mask candidate.")), u && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && i >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function Me(f) {
  if (we(f)) {
    const s = Object.keys(f).map(ne), { confidence: i, reasons: o } = Vt(s);
    return {
      isGerber: i >= 0.6,
      archiveType: "directory",
      confidence: i,
      reasons: o,
      files: s
    };
  }
  const t = xe(f), e = Se(t);
  if (e === "zip")
    try {
      const s = ke(t), o = (await _e(s)).map((b) => b.name), { confidence: d, reasons: g } = Vt(o);
      return {
        isGerber: d >= 0.6,
        archiveType: "zip",
        confidence: d,
        reasons: g,
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
function se(f) {
  let t = f.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Re(f) {
  return f instanceof Uint8Array ? f : new Uint8Array(f);
}
function oe(f) {
  try {
    return f.slice().buffer;
  } catch {
    const t = new Uint8Array(f.byteLength);
    return t.set(f), t.buffer;
  }
}
async function Ae(f) {
  let t;
  try {
    t = await ie.loadAsync(oe(f));
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
  for (const [o, d] of s)
    try {
      const g = se(o), b = await d.async("arraybuffer");
      if (i += b.byteLength, i > l)
        throw new ft(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[g] = new Uint8Array(b);
    } catch (g) {
      console.warn(`Failed to extract file ${o}:`, g);
    }
  if (Object.keys(e).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function ze(f, t) {
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
  let a;
  try {
    const u = new Blob([oe(f)], { type: "application/octet-stream" });
    a = await e.open(u);
  } catch (u) {
    throw new ft("NOT_AN_ARCHIVE", "Failed to open RAR archive", u);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
      new Promise(
        (u, p) => setTimeout(() => p(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (u) {
    throw new ft("PARSE_ERROR", "Failed to extract RAR archive", u);
  }
  const s = {};
  let i = 0;
  const o = 1e3, d = 100 * 1024 * 1024;
  let g = 0;
  async function b(u, p) {
    if (i >= o)
      throw new ft(
        "PARSE_ERROR",
        `Archive contains too many files (max ${o})`
      );
    for (const h of Object.keys(u)) {
      const m = u[h], n = p ? `${p}/${h}` : h;
      if (m instanceof File || m instanceof Blob) {
        i++;
        try {
          const _ = await m.arrayBuffer();
          if (g += _.byteLength, g > d)
            throw new ft(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${d} bytes)`
            );
          s[se(n)] = new Uint8Array(_);
        } catch (_) {
          console.warn(`Failed to extract file ${n}:`, _);
        }
      } else m && typeof m == "object" && await b(m, n);
    }
  }
  try {
    await b(l, "");
  } finally {
    if (a && typeof a.close == "function")
      try {
        await a.close();
      } catch (u) {
        console.warn("Failed to close archive:", u);
      }
  }
  if (Object.keys(s).length === 0)
    throw new ft("PARSE_ERROR", "No files extracted from RAR archive");
  return s;
}
async function ae(f, t) {
  if (!f || f.byteLength === 0)
    throw new ft("NOT_AN_ARCHIVE", "Input is empty");
  const e = Re(f), a = 100 * 1024 * 1024;
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
      return { archiveType: "rar", files: await ze(e, t) };
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
function Lt(f) {
  return f.toLowerCase();
}
function Mt(f, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return f.filter((l) => {
    const s = Lt(l), i = s.lastIndexOf(".");
    return i < 0 ? !1 : e.has(s.slice(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function ut(f, t) {
  const e = t.map((l) => l.toLowerCase());
  return f.filter((l) => {
    const s = Lt(l);
    return e.every((i) => s.includes(i));
  }).sort((l, s) => l.length - s.length)[0];
}
function Ee(f) {
  const t = [], e = (a) => Lt(a);
  for (const a of f) {
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
function Ce(f) {
  const t = f.filter((b) => {
    const u = Lt(b);
    return !(u.endsWith("/") || u.includes("__macosx") || u.endsWith(".ds_store"));
  }), e = Mt(t, [".gtl"]) || ut(t, ["f_cu"]) || ut(t, ["top", "cu"]) || ut(t, ["top", "copper"]), a = Mt(t, [".gbl"]) || ut(t, ["b_cu"]) || ut(t, ["bottom", "cu"]) || ut(t, ["bottom", "copper"]), l = Mt(t, [".gts"]) || ut(t, ["f_mask"]) || ut(t, ["top", "mask"]), s = Mt(t, [".gbs"]) || ut(t, ["b_mask"]) || ut(t, ["bottom", "mask"]), i = Mt(t, [".gto"]) || ut(t, ["f_silks"]) || ut(t, ["f_silk"]) || ut(t, ["top", "silk"]), o = Mt(t, [".gbo"]) || ut(t, ["b_silks"]) || ut(t, ["b_silk"]) || ut(t, ["bottom", "silk"]), d = Mt(t, [".gko", ".gm1"]) || ut(t, ["edge", "cuts"]) || ut(t, ["outline"]) || ut(t, ["board", "outline"]), g = Ee(t);
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: s,
    top_silk: i,
    bottom_silk: o,
    outline: d,
    drills: g.length ? g : void 0
  };
}
const Ie = 0.8;
function Rt(f, t, e) {
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
      i.endsWith("*") && (i = i.slice(0, -1)), Oe(i, a);
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
function Te(f, t) {
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
    let o, d, g, b, u;
    if (i) {
      const h = i.split(/[Xx]/).filter(Boolean), m = h[0] ? parseFloat(h[0]) * t.unitScale : void 0, n = h[1] ? parseFloat(h[1]) * t.unitScale : void 0, _ = h[2] ? parseFloat(h[2]) * t.unitScale : void 0, y = h[3] ? parseFloat(h[3]) : void 0;
      y !== void 0 && !Number.isNaN(y) && y !== 0 && (u = y), s === "C" ? o = m : s === "R" || s === "O" ? (d = m, g = n, o = m !== void 0 && n !== void 0 ? Math.min(m, n) : m ?? n) : (d = m, g = n, _ !== void 0 && (b = _), o = m !== void 0 && n !== void 0 ? Math.min(m, n) : m ?? n);
    }
    const p = {
      code: l,
      shape: s,
      diameterMm: o,
      widthMm: d,
      heightMm: g,
      cornerMm: b,
      rotationDeg: u
    };
    t.apertures.set(l, p);
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
function Ht(f, t, e, a, l) {
  const s = f.x + e, i = f.y + a, o = Math.sqrt(e * e + a * a);
  if (o < 1e-6) return [t];
  const d = Math.atan2(f.y - i, f.x - s), g = Math.atan2(t.y - i, t.x - s), u = (t.x - f.x) ** 2 + (t.y - f.y) ** 2 < (o * 1e-3) ** 2;
  let p;
  u ? p = l ? -2 * Math.PI : 2 * Math.PI : (p = g - d, l ? p > 1e-6 && (p -= 2 * Math.PI) : p < -1e-6 && (p += 2 * Math.PI));
  const h = Math.min(64, Math.max(4, Math.ceil(Math.abs(p) / (Math.PI / 16)))), m = [];
  for (let n = 1; n <= h; n++) {
    const _ = d + p * n / h;
    m.push({ x: s + o * Math.cos(_), y: i + o * Math.sin(_) });
  }
  return m;
}
function Oe(f, t) {
  if (f === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (f === "G74" || f === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(f);
  if (e && (t.arcMode = parseInt(e[1], 10), f = f.slice(e[0].length).trim(), !f))
    return;
  if (f === "G37") {
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
  const l = /D0?(\d{1,3})$/.exec(f);
  if (l && (a = parseInt(l[1], 10), f = f.slice(0, f.length - l[0].length)), a !== null && a >= 10) {
    const n = t.apertures.get(a);
    n && (t.currentAperture = n);
    return;
  }
  const s = /X([+\-]?\d+)/.exec(f), i = /Y([+\-]?\d+)/.exec(f), o = /I([+\-]?\d+)/.exec(f), d = /J([+\-]?\d+)/.exec(f);
  let g = t.x, b = t.y;
  s && (g = Nt(s[1], t)), i && (b = Nt(i[1], t));
  const u = o ? Nt(o[1], t) : 0, p = d ? Nt(d[1], t) : 0;
  if (a === null) {
    t.x = g, t.y = b;
    return;
  }
  if (t.inRegion) {
    const n = t.x, _ = t.y;
    if (a === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: n, y: _ }), t.arcMode !== 1 && (u !== 0 || p !== 0)) {
        const y = Ht({ x: n, y: _ }, { x: g, y: b }, u, p, t.arcMode === 2);
        for (const w of y) t.currentPath.push(w);
      } else
        t.currentPath.push({ x: g, y: b });
    else a === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = g, t.y = b;
    return;
  }
  const h = t.x, m = t.y;
  if (a === 1) {
    if (!t.currentAperture) {
      t.x = g, t.y = b;
      return;
    }
    const n = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (u !== 0 || p !== 0)) {
      const _ = Ht({ x: h, y: m }, { x: g, y: b }, u, p, t.arcMode === 2);
      let y = { x: h, y: m };
      for (const w of _)
        t.tracks.push({ start: y, end: w, width: n, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: y, end: w, widthMm: n }), y = w;
    } else
      t.tracks.push({
        start: { x: h, y: m },
        end: { x: g, y: b },
        width: n,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: h, y: m },
        end: { x: g, y: b },
        widthMm: n
      });
    t.x = g, t.y = b;
    return;
  }
  if (a === 2) {
    t.x = g, t.y = b;
    return;
  }
  if (a === 3) {
    if (t.currentAperture) {
      const n = t.currentAperture, _ = n.diameterMm !== void 0 ? n.diameterMm : Ie, y = (n.rotationDeg ?? 0) + t.loadRotationDeg, w = y !== 0 ? y : void 0, M = {
        position: { x: g, y: b },
        diameterMm: _,
        shape: n.shape,
        polarity: t.currentPolarity,
        rotationDeg: w
      };
      n.widthMm !== void 0 && (M.widthMm = n.widthMm), n.heightMm !== void 0 && (M.heightMm = n.heightMm), n.cornerMm !== void 0 && (M.cornerMm = n.cornerMm), t.flashes.push(M), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: g, y: b },
        diameterMm: _,
        shape: n.shape,
        widthMm: n.widthMm,
        heightMm: n.heightMm,
        cornerMm: n.cornerMm,
        rotationDeg: w
      });
    }
    t.x = g, t.y = b;
    return;
  }
}
function Nt(f, t) {
  const e = f.startsWith("-") ? -1 : 1, a = f.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const s = Math.pow(10, t.fmtDec), i = l / s * t.unitScale;
  return e * i;
}
function Be(f, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const s = [];
  let i = 1, o = 4, d = !1;
  const g = (b) => {
    if (b.includes(".")) return parseFloat(b) * i;
    const u = b.startsWith("-") ? -1 : 1, p = b.replace(/[+\-]/, ""), h = parseInt(p, 10);
    return Number.isNaN(h) ? 0 : u * (h / Math.pow(10, o)) * i;
  };
  for (const b of e) {
    const u = b.trim();
    if (!u || u.startsWith(";")) continue;
    if (u === "M48") {
      d = !0;
      continue;
    }
    if (u === "%" && d) {
      d = !1;
      continue;
    }
    if (u === "M30" || u === "M00") break;
    if (d) {
      u.startsWith("METRIC") ? i = 1 : u.startsWith("INCH") && (i = 25.4);
      const h = /^FMAT,(\d+)\.(\d+)/.exec(u) || /^(\d+)\.(\d+)$/.exec(u);
      h && (parseInt(h[1], 10), o = parseInt(h[2], 10));
    }
    if (/^T\d+C[\d.]+/i.test(u)) {
      const h = /^T(\d+)C([\d.]+)/i.exec(u);
      if (h) {
        const m = parseFloat(h[2]) * i;
        Number.isNaN(m) || a.set(h[1], m);
      }
      continue;
    }
    if (/^T\d+$/i.test(u)) {
      const h = /^T(\d+)/i.exec(u);
      h && (l = h[1]);
      continue;
    }
    if (/^[GRMF]/.test(u) && !/^X/.test(u)) continue;
    const p = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(u);
    if (p) {
      const h = g(p[1]), m = g(p[2]);
      if (!Number.isNaN(h) && !Number.isNaN(m)) {
        const n = l && a.has(l) ? a.get(l) : 0.6;
        s.push({ x: h, y: m, diameter: n, plated: !0 });
      }
    }
  }
  return { name: f, holes: s };
}
function Pe(f) {
  return { w: f.maxX - f.minX, h: f.maxY - f.minY };
}
function Tt(f) {
  const { w: t, h: e } = Pe(f);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function xt(f, t) {
  if (!Number.isFinite(f) || !Number.isFinite(t) || f <= 0 || t <= 0) return 1;
  const e = f / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function At(f, t) {
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
function Fe(f, t) {
  return t === 1 ? f : f.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Ne(f) {
  return URL.createObjectURL(new Blob([f], { type: "image/svg+xml" }));
}
function gt(f, t, e) {
  f.minX = Math.min(f.minX, t), f.minY = Math.min(f.minY, e), f.maxX = Math.max(f.maxX, t), f.maxY = Math.max(f.maxY, e);
}
function Yt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function bt(f) {
  const t = Yt();
  for (const e of f.tracks) {
    gt(t, e.start.x, e.start.y), gt(t, e.end.x, e.end.y);
    const a = (e.width ?? 0) / 2;
    gt(t, e.start.x - a, e.start.y - a), gt(t, e.start.x + a, e.start.y + a), gt(t, e.end.x - a, e.end.y - a), gt(t, e.end.x + a, e.end.y + a);
  }
  for (const e of f.flashes) {
    const a = (e.widthMm ?? e.diameterMm) || 0, l = (e.heightMm ?? e.diameterMm) || 0;
    gt(t, e.position.x - a / 2, e.position.y - l / 2), gt(t, e.position.x + a / 2, e.position.y + l / 2);
  }
  for (const e of f.regions)
    for (const a of e.loops) for (const l of a) gt(t, l.x, l.y);
  return t;
}
function De(f) {
  const t = Yt();
  for (const e of f) {
    const a = (e.diameter || 0) / 2;
    gt(t, e.x - a, e.y - a), gt(t, e.x + a, e.y + a);
  }
  return t;
}
function Kt(f, t) {
  return {
    minX: Math.min(f.minX, t.minX),
    minY: Math.min(f.minY, t.minY),
    maxX: Math.max(f.maxX, t.maxX),
    maxY: Math.max(f.maxY, t.maxY)
  };
}
function yt(f) {
  return !Number.isFinite(f.minX) || !Number.isFinite(f.minY) || !Number.isFinite(f.maxX) || !Number.isFinite(f.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (f.maxX - f.minX < 1e-6 && (f.maxX = f.minX + 1), f.maxY - f.minY < 1e-6 && (f.maxY = f.minY + 1), f);
}
const Le = 1e3;
function mt(f) {
  return f / 25.4 * Le;
}
function zt(f, t, e) {
  const a = f - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Xt(f, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${f}" height="${t}" viewBox="0 0 ${f} ${t}">
  <rect width="${f}" height="${t}" fill="white"/>
</svg>`.trim();
}
function vt(f, t = 1e-4) {
  const e = Math.round(f.x / t) * t, a = Math.round(f.y / t) * t;
  return `${e.toFixed(4)},${a.toFixed(4)}`;
}
function Jt(f) {
  let t = 0;
  const e = f.length;
  for (let a = 0; a < e; a++) {
    const l = f[a], s = f[(a + 1) % e];
    t += l.x * s.y - s.x * l.y;
  }
  return 0.5 * t;
}
function Wt(f, t, e) {
  if (!f.length) return "";
  const a = (i) => ({
    x: (i.x - t.minX) * e,
    y: (t.maxY - i.y) * e
  }), l = a(f[0]), s = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let i = 1; i < f.length; i++) {
    const o = a(f[i]);
    s.push(`L ${o.x.toFixed(2)} ${o.y.toFixed(2)}`);
  }
  return s.push("Z"), s.join(" ");
}
function le(f) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (g, b) => {
    const u = vt(g), p = vt(b);
    t.has(u) || t.set(u, []), t.has(p) || t.set(p, []), t.get(u).push(b), t.get(p).push(g), e.has(u) || e.set(u, g), e.has(p) || e.set(p, b);
  };
  for (const g of f) a(g.start, g.end);
  const l = /* @__PURE__ */ new Set(), s = (g, b) => {
    const u = vt(g), p = vt(b);
    return u < p ? `${u}|${p}` : `${p}|${u}`;
  }, i = [];
  for (const [g, b] of t.entries()) {
    const u = e.get(g);
    for (const p of b) {
      const h = s(u, p);
      if (l.has(h)) continue;
      const m = [u];
      let n = u, _ = p;
      l.add(h);
      for (let y = 0; y < 1e5; y++) {
        m.push(_);
        const w = vt(_), M = t.get(w) ?? [];
        if (M.length === 0) break;
        let k = null;
        for (const R of M) {
          if (vt(R) === vt(n) && M.length > 1) continue;
          const I = s(_, R);
          if (!l.has(I)) {
            k = R, l.add(I);
            break;
          }
        }
        if (k || (k = M[0]), n = _, _ = k, vt(_) === vt(u))
          break;
      }
      m.length >= 3 && i.push(m);
    }
  }
  i.sort((g, b) => Math.abs(Jt(b)) - Math.abs(Jt(g)));
  const o = [], d = /* @__PURE__ */ new Set();
  for (const g of i) {
    const b = g.map((u) => vt(u)).join(";");
    d.has(b) || (d.add(b), o.push(g));
  }
  return o;
}
function Qt(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = mt(1), o = [];
  for (const d of f.regions)
    for (const g of d.loops)
      o.push(Wt(g, t, i));
  if (o.length === 0 && f.tracks.length) {
    const d = le(f.tracks);
    if (d.length) {
      const g = d[0];
      o.push(Wt(g, t, i));
      for (let b = 1; b < d.length; b++)
        o.push(Wt(d[b], t, i));
    }
  }
  return o.length === 0 ? Xt(l, s) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  <rect x="0" y="0" width="${l}" height="${s}" fill="black"/>
  <path d="${o.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function ce(f) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const s of f.loops)
    for (const i of s)
      t = Math.min(t, i.x), e = Math.min(e, i.y), a = Math.max(a, i.x), l = Math.max(l, i.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function $e(f, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const g of f.regions) {
    const b = ce(g), u = (b.maxX - b.minX) * (b.maxY - b.minY);
    g.polarity === "clear" ? l = Math.max(l, u) : a = Math.max(a, u);
  }
  const s = f.tracks.filter((g) => g.polarity !== "clear").length + f.flashes.filter((g) => g.polarity !== "clear").length + f.regions.filter((g) => g.polarity !== "clear").length, i = f.tracks.filter((g) => g.polarity === "clear").length + f.flashes.filter((g) => g.polarity === "clear").length + f.regions.filter((g) => g.polarity === "clear").length, o = l > e * 0.85;
  return !(a > e * 0.85 || !o || !(i > s * 2));
}
function Dt(f, t, e, a) {
  const l = t.maxX - t.minX, s = t.maxY - t.minY, i = Math.max(1, Math.round(mt(l))), o = Math.max(1, Math.round(mt(s))), d = mt(1), g = $e(f, t), b = g ? "white" : "black", u = (k, R) => {
    const I = k - t.minX, O = t.maxY - R;
    return { x: I * d, y: O * d };
  }, p = (k, R) => {
    if (k.kind === "track") {
      const I = u(k.start.x, k.start.y), O = u(k.end.x, k.end.y), W = Number.isFinite(k.widthMm) ? k.widthMm : 0.2, P = Math.max(1, W * d);
      return `<line x1="${I.x.toFixed(2)}" y1="${I.y.toFixed(2)}" x2="${O.x.toFixed(2)}" y2="${O.y.toFixed(2)}" stroke-width="${P.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${R}" stroke="${R}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (k.kind === "flash") {
      const I = u(k.position.x, k.position.y), O = k.widthMm ?? k.diameterMm ?? 0.8, W = k.heightMm ?? k.diameterMm ?? 0.8, P = Math.max(0.01, Number.isFinite(O) ? O : 0.8) * d, j = Math.max(0.01, Number.isFinite(W) ? W : 0.8) * d, J = I.x - P / 2, S = I.y - j / 2, N = k.rotationDeg, c = N && Math.abs(N) > 0.01 ? ` transform="rotate(${(-N).toFixed(2)},${I.x.toFixed(2)},${I.y.toFixed(2)})"` : "";
      if (k.shape === "R" || k.shape === "O") {
        const it = k.shape === "O" ? Math.min(P, j) * 0.5 : 0;
        return `<rect x="${J.toFixed(2)}" y="${S.toFixed(2)}" width="${P.toFixed(2)}" height="${j.toFixed(2)}" rx="${it.toFixed(2)}" ry="${it.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      if (Number.isFinite(k.cornerMm) && (k.cornerMm ?? 0) > 0) {
        const it = Math.max(0, k.cornerMm * d);
        return `<rect x="${J.toFixed(2)}" y="${S.toFixed(2)}" width="${P.toFixed(2)}" height="${j.toFixed(2)}" rx="${it.toFixed(2)}" ry="${it.toFixed(2)}" fill="${R}" fill-opacity="1"${c} />`;
      }
      const $ = Math.max(1, Math.max(P, j) / 2);
      return `<circle cx="${I.x.toFixed(2)}" cy="${I.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${R}" fill-opacity="1" />`;
    }
    if (k.kind === "region") {
      const I = k.loops.map((O) => {
        if (!O.length) return "";
        const W = u(O[0].x, O[0].y), P = [`M ${W.x.toFixed(2)} ${W.y.toFixed(2)}`];
        for (let j = 1; j < O.length; j++) {
          const J = u(O[j].x, O[j].y);
          P.push(`L ${J.x.toFixed(2)} ${J.y.toFixed(2)}`);
        }
        return P.push("Z"), P.join(" ");
      }).join(" ");
      return I.trim() ? `<path d="${I}" fill-rule="evenodd" fill="${R}" fill-opacity="1" />` : "";
    }
    return "";
  }, h = [];
  for (const k of f.ops) {
    const R = k.polarity === "clear" ? "black" : "white", I = p(k, R);
    I && h.push(I);
  }
  console.log("[polarity counts]", {
    tracksClear: f.tracks.filter((k) => k.polarity === "clear").length,
    regionsClear: f.regions.filter((k) => k.polarity === "clear").length,
    negativePlane: g
  });
  const m = (t.maxX - t.minX) * (t.maxY - t.minY);
  let n = 0, _ = 0;
  for (const k of f.regions) {
    const R = ce(k), I = (R.maxX - R.minX) * (R.maxY - R.minY);
    k.polarity === "clear" ? _ = Math.max(_, I) : n = Math.max(n, I);
  }
  const y = f.tracks.filter((k) => k.polarity !== "clear").length + f.flashes.filter((k) => k.polarity !== "clear").length + f.regions.filter((k) => k.polarity !== "clear").length, w = f.tracks.filter((k) => k.polarity === "clear").length + f.flashes.filter((k) => k.polarity === "clear").length + f.regions.filter((k) => k.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: y,
    clearCount: w,
    largestDarkRegionArea: n,
    largestClearRegionArea: _,
    boardArea: m,
    negative: g
  });
  const M = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${o}" viewBox="0 0 ${i} ${o}">
  <defs>
    <mask id="${M}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${i}" height="${o}" fill="${b}" fill-opacity="1" />
      ${h.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${i}" height="${o}" fill="${e}" opacity="${a}" mask="url(#${M})" />
</svg>`.trim();
}
function te(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(mt(e))), s = Math.max(1, Math.round(mt(a))), i = Math.max(1e-6, mt(1)), o = "rgba(255,255,255,0.95)", d = "rgba(255,255,255,0.95)", g = f.tracks.map((p) => {
    const h = zt(p.start.x, p.start.y, t), m = zt(p.end.x, p.end.y, t), n = Number.isFinite(p.width) ? p.width : 0.15, _ = Math.max(1, n * i);
    return `<line x1="${(h.x * i).toFixed(2)}" y1="${(h.y * i).toFixed(2)}" x2="${(m.x * i).toFixed(2)}" y2="${(m.y * i).toFixed(2)}" stroke="${o}" stroke-width="${_.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = f.flashes.map((p) => {
    const h = zt(p.position.x, p.position.y, t), m = h.x * i, n = h.y * i, _ = p.widthMm ?? p.diameterMm ?? 0.6, y = p.heightMm ?? p.diameterMm ?? 0.6;
    if (p.shape === "R" || p.shape === "O") {
      const M = _ * i, k = y * i, R = m - M / 2, I = n - k / 2, O = p.shape === "O" ? Math.min(M, k) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${I.toFixed(2)}" width="${M.toFixed(2)}" height="${k.toFixed(2)}" rx="${O.toFixed(2)}" fill="${d}" />`;
    }
    const w = (p.diameterMm ?? 0.6) * i / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${n.toFixed(2)}" r="${Math.max(1, w).toFixed(2)}" fill="${d}" />`;
  }), u = f.regions.map((p) => {
    const h = p.loops.map((m) => {
      if (!m.length) return "";
      const n = zt(m[0].x, m[0].y, t), _ = [`M ${(n.x * i).toFixed(2)} ${(n.y * i).toFixed(2)}`];
      for (let y = 1; y < m.length; y++) {
        const w = zt(m[y].x, m[y].y, t);
        _.push(`L ${(w.x * i).toFixed(2)} ${(w.y * i).toFixed(2)}`);
      }
      return _.push("Z"), _.join(" ");
    }).join(" ");
    return h.trim() ? `<path d="${h}" fill="${d}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${g.join(`
  `)}
  ${b.join(`
  `)}
  ${u.join(`
  `)}
</svg>`.trim();
}
function Ue(f, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.round(mt(e)), s = Math.round(mt(a)), i = mt(1), o = f.map((d) => {
    const g = zt(d.x, d.y, t), b = g.x * i, u = g.y * i, p = Math.max(1.5, (d.diameter || 0.6) * i / 2);
    return `<circle cx="${b.toFixed(2)}" cy="${u.toFixed(2)}" r="${(p + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${b.toFixed(2)}" cy="${u.toFixed(2)}" r="${p.toFixed(2)}" fill="#111111" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${s}" viewBox="0 0 ${l} ${s}">
  ${o.join(`
  `)}
</svg>`.trim();
}
async function he(f) {
  const t = Object.keys(f).filter((Y) => !!Y), e = Ce(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (Y) => {
    if (!Y) return null;
    const Z = f[Y];
    return Z ? a.decode(Z) : null;
  }, s = await l(e.top_copper), i = await l(e.bottom_copper), o = await l(e.outline), d = e.drills?.length ? await Promise.all(e.drills.map((Y) => l(Y))) : [], g = await l(e.top_silk), b = await l(e.bottom_silk), u = s ? Rt(e.top_copper || "top", s) : null, p = i ? Rt(e.bottom_copper || "bot", i) : null, h = o ? Rt(e.outline || "outline", o) : null, m = [];
  if (e.drills)
    for (let Y = 0; Y < e.drills.length; Y++) {
      const Z = d[Y];
      if (Z) {
        const rt = Be(e.drills[Y], Z);
        for (const ct of rt.holes) m.push({ x: ct.x, y: ct.y, diameter: ct.diameter });
      }
    }
  const n = await l(e.top_mask), _ = await l(e.bottom_mask), y = g ? Rt(e.top_silk || "top_silk", g) : null, w = b ? Rt(e.bottom_silk || "bot_silk", b) : null, M = n ? Rt(e.top_mask || "top_mask", n) : null, k = _ ? Rt(e.bottom_mask || "bot_mask", _) : null, R = u ? yt(bt(u)) : null, I = p ? yt(bt(p)) : null, O = h ? yt(bt(h)) : null, W = m.length ? yt(De(m)) : null, P = y ? yt(bt(y)) : null, j = w ? yt(bt(w)) : null, J = M ? yt(bt(M)) : null, S = k ? yt(bt(k)) : null, N = (O && Tt(O) ? O : null) || (R && Tt(R) ? R : null) || (I && Tt(I) ? I : null) || (W && Tt(W) ? W : null), c = N ? N.maxX - N.minX : 1, $ = R ? xt(R.maxX - R.minX, c) : 1, it = I ? xt(I.maxX - I.minX, c) : 1, X = O ? xt(O.maxX - O.minX, c) : 1, st = W ? xt(W.maxX - W.minX, c) : 1, q = P ? xt(P.maxX - P.minX, c) : 1, nt = j ? xt(j.maxX - j.minX, c) : 1, F = J ? xt(J.maxX - J.minX, c) : 1, T = S ? xt(S.maxX - S.minX, c) : 1, et = u ? At(u, $) : null, z = p ? At(p, it) : null, E = h ? At(h, X) : null, V = m.length ? Fe(m, st) : [], Q = y ? At(y, q) : null, K = w ? At(w, nt) : null, H = M ? At(M, F) : null, tt = k ? At(k, T) : null;
  let ot = null;
  if (E) {
    const Y = yt(bt(E));
    Tt(Y) && (ot = Y);
  }
  if (!ot) {
    let Y = Yt();
    et && (Y = Kt(Y, bt(et))), z && (Y = Kt(Y, bt(z))), Y = yt(Y), ot = Y;
  }
  const at = yt(ot), ht = at.maxX - at.minX, r = at.maxY - at.minY;
  let D;
  if (E) {
    const Y = [];
    for (const Z of E.regions)
      for (const rt of Z.loops)
        rt.length >= 3 && Y.push(rt);
    if (Y.length === 0 && E.tracks.length)
      for (const Z of le(E.tracks))
        Z.length >= 3 && Y.push(Z);
    Y.length > 0 && (D = Y);
  }
  const B = {
    board: {
      width_in: ht / 25.4,
      height_in: r / 25.4,
      mm_bounds: {
        min_x_mm: at.minX,
        min_y_mm: at.minY,
        max_x_mm: at.maxX,
        max_y_mm: at.maxY
      }
    },
    outline_loops_mm: D
  }, x = Math.max(1, Math.round(mt(ht))), v = Math.max(1, Math.round(mt(r))), A = [], L = (Y) => {
    const Z = Ne(Y);
    return A.push(Z), Z;
  }, U = E ? Qt(E, at) : Xt(x, v), C = E ? Qt(E, at) : Xt(x, v), G = {
    top_board_mask: L(U),
    bottom_board_mask: L(C)
  };
  return et && (G.top_copper = L(Dt(et, at, "#fbbf24", 1))), z && (G.bottom_copper = L(Dt(z, at, "#38bdf8", 1))), H && (G.top_mask = L(Dt(H, at, "#fbbf24", 0.9))), tt && (G.bottom_mask = L(Dt(tt, at, "#38bdf8", 0.9))), V.length && (G.drills = L(Ue(V, at))), Q && (G.top_silk = L(te(Q, at))), K && (G.bottom_silk = L(te(K, at))), {
    boardGeom: B,
    layers: G,
    revoke: () => A.forEach((Y) => URL.revokeObjectURL(Y))
  };
}
async function ar(f) {
  const t = f instanceof Uint8Array ? f.byteOffset === 0 && f.byteLength === f.buffer.byteLength ? f.buffer : f.slice().buffer : f instanceof ArrayBuffer ? f : await f.arrayBuffer(), { files: e, archiveType: a } = await ae(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await he(e);
}
async function lr(f, t) {
  const { files: e } = await ae(f, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await he(e);
}
function jt(f, t) {
  const [
    e,
    a,
    l,
    s,
    i,
    o,
    d,
    g,
    b
  ] = f, [
    u,
    p,
    h,
    m,
    n,
    _,
    y,
    w,
    M
  ] = t;
  return [
    e * u + a * m + l * y,
    e * p + a * n + l * w,
    e * h + a * _ + l * M,
    s * u + i * m + o * y,
    s * p + i * n + o * w,
    s * h + i * _ + o * M,
    d * u + g * m + b * y,
    d * p + g * n + b * w,
    d * h + g * _ + b * M
  ];
}
function ee(f, t) {
  return [1, 0, f, 0, 1, t, 0, 0, 1];
}
function We(f, t) {
  return [f, 0, 0, 0, t, 0, 0, 0, 1];
}
function je(f) {
  const t = Math.cos(f), e = Math.sin(f);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function re(f, t) {
  const e = f[0] * t.x + f[1] * t.y + f[2], a = f[3] * t.x + f[4] * t.y + f[5], l = f[6] * t.x + f[7] * t.y + f[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function Xe(f) {
  const t = f[0], e = f[1], a = f[2], l = f[3], s = f[4], i = f[5], o = t * s - e * l;
  if (Math.abs(o) < 1e-12) throw new Error("Non-invertible transform");
  const d = 1 / o, g = s * d, b = -e * d, u = -l * d, p = t * d, h = -(g * a + b * i), m = -(u * a + p * i);
  return [g, b, h, u, p, m, 0, 0, 1];
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
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: s, mirrorX: i, mirrorY: o } = this.camera, d = { x: t / 2, y: e / 2 }, g = o ? -1 : 1, b = i ? -1 : 1, u = ee(-a.x, -a.y), p = je(s), h = We(l * b, l * g), m = ee(d.x, d.y), n = jt(m, jt(h, jt(p, u)));
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
    for (let d = -i; d <= i; d++)
      for (let g = -i; g <= i; g++) {
        const b = `${l + d},${s + g}`, u = this.cells.get(b);
        if (u)
          for (const p of u) o.push(p);
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
    const s = t.screenToBoard({ x: e, y: a }), i = t.xform.getCamera().zoom, o = l / i, d = this.store.queryNear(s.x, s.y, o);
    let g = null;
    for (const b of d) {
      const u = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), p = u.x - e, h = u.y - a, m = Math.sqrt(p * p + h * h);
      m <= l && (!g || m < g.distance_px) && (g = { id: b.id, marker: b, distance_px: m });
    }
    return g;
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
    this.xform = new Ye(e, s), this.visibility = new de(), this.scheduler = new Ze(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: o }) => {
        const d = this.xform.boardToScreen({ x: i, y: o });
        return { x_px: d.x, y_px: d.y };
      },
      screenToBoard: ({ x_px: i, y_px: o }) => {
        const d = this.xform.screenToBoard({ x: i, y: o });
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
function hr(f, t, e, a) {
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
function tr(f, t) {
  return {
    id: "overlay:all",
    order: (kt.OVERLAYS_MIN + kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = f.getAll().filter((i) => e.visibility.overlays[i.id] ?? i.visible);
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
function rr(f) {
  return {
    id: "markers",
    order: (kt.MARKERS_MIN + kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => f.draw(t)
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
function nr(f, t) {
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
function ur(f, t = {}) {
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
  const l = f.firstElementChild, s = nt(l, "#board-viewport"), i = nt(l, "#render-canvas"), o = nt(l, "#grid-toggle"), d = nt(l, "#grid-units"), g = nt(l, "#fit-btn"), b = a ? nt(l, "#download-btn") : null, u = Array.from(l.querySelectorAll('input[name="side"]')), p = new Je(i, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), h = new de();
  h.subscribe(() => {
    p.requestRender("visibility-change");
  });
  const m = new Qe(), n = new er(), _ = new ir();
  let y = null;
  function w() {
    const z = s.getBoundingClientRect(), E = window.devicePixelRatio || 1;
    i.width = z.width * E, i.height = z.height * E, i.style.width = `${z.width}px`, i.style.height = `${z.height}px`, p.requestRender("resize");
  }
  const M = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (z, E) => {
      const Q = E.view.zoom, K = d.value, H = K === "mm" ? 1 : 2.54, tt = K === "mm" ? 10 : 25.4, ot = H * Q, at = tt * Q;
      if (ot < 2) return;
      const ht = i.width / (window.devicePixelRatio || 1), r = i.height / (window.devicePixelRatio || 1), D = E.screenToBoard({ x: 0, y: 0 }), B = E.screenToBoard({ x: ht, y: r });
      z.setTransform(1, 0, 0, 1, 0, 0), z.strokeStyle = "rgba(59, 130, 246, 0.4)", z.lineWidth = 1, z.beginPath();
      const x = Math.floor(D.x / H) * H, v = Math.floor(D.y / H) * H;
      for (let A = x; A <= B.x; A += H) {
        const L = E.boardToScreen({ x: A, y: 0 }).x;
        z.moveTo(L, 0), z.lineTo(L, i.height);
      }
      for (let A = v; A <= B.y; A += H) {
        const L = E.boardToScreen({ x: 0, y: A }).y;
        z.moveTo(0, L), z.lineTo(i.width, L);
      }
      if (z.stroke(), at >= 8) {
        z.strokeStyle = "rgba(59, 130, 246, 0.7)", z.lineWidth = 1.5, z.beginPath();
        const A = Math.floor(D.x / tt) * tt, L = Math.floor(D.y / tt) * tt;
        for (let U = A; U <= B.x; U += tt) {
          const C = E.boardToScreen({ x: U, y: 0 }).x;
          z.moveTo(C, 0), z.lineTo(C, i.height);
        }
        for (let U = L; U <= B.y; U += tt) {
          const C = E.boardToScreen({ x: 0, y: U }).y;
          z.moveTo(0, C), z.lineTo(i.width, C);
        }
        z.stroke();
      }
    }
  };
  m.add(M), h.setOverlayVisibility("grid", !1), h.setMarkersVisibility(!1), p.addPass(tr(m, p.getOverlayApi())), p.addPass(rr(n)), p.addPass(nr(_, () => y));
  let k = null, R = {}, I = "top", O = !1;
  function W(z, E, V) {
    if (!V) return null;
    const Q = new Image();
    return Q.src = V, Q.addEventListener("load", () => {
      p.requestRender(`image-loaded-${z}`);
    }), {
      id: z,
      order: E,
      enabled: (K) => !!k?.board?.mm_bounds,
      draw: (K) => {
        if (!Q.complete || !k?.board?.mm_bounds) return;
        const H = K.ctx, tt = K.xform.getWorldToScreenMatrix();
        H.setTransform(tt[0], tt[3], tt[1], tt[4], tt[2], tt[5]);
        let ot;
        (R.top_board_mask || R.bottom_board_mask) && (ot = 0.5);
        const at = j(H, k, ot);
        N(H, at, (ht) => {
          if (!k?.board?.mm_bounds) return;
          const r = k.board.mm_bounds, D = r.max_x_mm - r.min_x_mm, B = r.max_y_mm - r.min_y_mm;
          ht.drawImage(Q, r.min_x_mm, r.min_y_mm, D, B);
        });
      }
    };
  }
  function P(z, E) {
    return {
      id: z,
      order: E,
      enabled: (V) => !!k?.board?.mm_bounds,
      draw: (V) => {
        if (!k?.board?.mm_bounds) return;
        const Q = V.ctx, K = V.xform.getWorldToScreenMatrix();
        Q.setTransform(K[0], K[3], K[1], K[4], K[2], K[5]);
        const H = j(Q, k, 0.5);
        S(Q, H);
      }
    };
  }
  function j(z, E, V) {
    if (!E?.board?.mm_bounds) return new Path2D();
    const Q = E.board.mm_bounds;
    if (E.outline_loops_mm?.length) {
      const K = new Path2D(), H = (tt) => Q.max_y_mm + Q.min_y_mm - tt;
      for (const tt of E.outline_loops_mm)
        if (tt.length) {
          K.moveTo(tt[0].x, H(tt[0].y));
          for (let ot = 1; ot < tt.length; ot++)
            K.lineTo(tt[ot].x, H(tt[ot].y));
          K.closePath();
        }
      return K;
    }
    return J(
      Q.min_x_mm,
      Q.min_y_mm,
      Q.max_x_mm - Q.min_x_mm,
      Q.max_y_mm - Q.min_y_mm,
      V || 0
    );
  }
  function J(z, E, V, Q, K) {
    const H = new Path2D(), tt = Math.max(0, Math.min(K, Math.min(V, Q) / 2));
    return H.moveTo(z + tt, E), H.lineTo(z + V - tt, E), H.quadraticCurveTo(z + V, E, z + V, E + tt), H.lineTo(z + V, E + Q - tt), H.quadraticCurveTo(z + V, E + Q, z + V - tt, E + Q), H.lineTo(z + tt, E + Q), H.quadraticCurveTo(z, E + Q, z, E + Q - tt), H.lineTo(z, E + tt), H.quadraticCurveTo(z, E, z + tt, E), H.closePath(), H;
  }
  function S(z, E) {
    z.save(), z.clip(E), z.fillStyle = "#1a5f1a", z.fill(E), z.strokeStyle = "#0d3d0d", z.lineWidth = 0.1, z.stroke(E), z.restore();
  }
  function N(z, E, V) {
    z.save(), z.clip(E), V(z), z.restore();
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
    ].forEach((V) => {
      p.removePass(V);
    }), !k) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: I === "bottom" ? R.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: I === "bottom" ? R.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: I === "bottom" ? R.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: I === "top" ? R.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: I === "top" ? R.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: I === "top" ? R.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: R.drills },
      { id: "layer:vias", order: 45, url: R.vias }
    ].forEach((V) => {
      let Q;
      V.useFR4 ? Q = P(V.id, V.order) : V.url && (Q = W(V.id, V.order, V.url)), Q && p.addPass(Q);
    }), p.requestRender("side-switch"), setTimeout(() => p.requestRender("side-switch-delayed"), 50);
  }
  function $(z = 0.08) {
    if (!k?.board?.mm_bounds) return;
    const E = s.getBoundingClientRect(), V = k.board.mm_bounds, Q = V.max_x_mm - V.min_x_mm, K = V.max_y_mm - V.min_y_mm, H = E.width * (1 - 2 * z), tt = E.height * (1 - 2 * z), ot = H / Q, at = tt / K, ht = Math.min(ot, at), r = (V.min_x_mm + V.max_x_mm) / 2, D = (V.min_y_mm + V.max_y_mm) / 2;
    p.setCamera({
      center_mm: { x: r, y: D },
      zoom: ht
    });
  }
  i.addEventListener("wheel", (z) => {
    z.preventDefault(), O = !0;
    const E = i.getBoundingClientRect(), V = z.clientX - E.left, Q = z.clientY - E.top, K = p.getCamera(), H = z.deltaY < 0 ? 1.1 : 0.9, tt = Math.max(0.2, Math.min(50, K.zoom * H)), ot = p.screenToBoard(V, Q);
    p.setCamera({ zoom: tt });
    const at = p.screenToBoard(V, Q), ht = ot.x - at.x, r = ot.y - at.y, D = {
      x: K.center_mm.x + ht,
      y: K.center_mm.y + r
    };
    p.setCamera({
      center_mm: D,
      zoom: tt
    });
  }, { passive: !1 });
  let it = !1, X = null;
  i.addEventListener("mousedown", (z) => {
    if (z.button !== 0) return;
    z.preventDefault(), O = !0, it = !0;
    const E = i.getBoundingClientRect();
    X = p.screenToBoard(
      z.clientX - E.left,
      z.clientY - E.top
    );
  });
  const st = (z) => {
    if (!it || !X) return;
    const E = i.getBoundingClientRect(), V = p.screenToBoard(
      z.clientX - E.left,
      z.clientY - E.top
    ), Q = X.x - V.x, K = X.y - V.y, H = p.getCamera();
    p.setCamera({
      center_mm: {
        x: H.center_mm.x + Q,
        y: H.center_mm.y + K
      }
    });
  }, q = () => {
    it = !1, X = null;
  };
  window.addEventListener("mousemove", st), window.addEventListener("mouseup", q), o.addEventListener("change", () => {
    const z = o.checked;
    h.setOverlayVisibility("grid", z), M.visible = z, p.requestRender("grid-toggle");
  }), d.addEventListener("change", () => {
    h.isOverlayVisible("grid") && p.requestRender("grid-units");
  }), g.addEventListener("click", () => $(0.08)), b?.addEventListener("click", () => t.onDownload?.()), u.forEach((z) => {
    z.addEventListener("change", () => {
      I = u.find((E) => E.checked)?.value || "top", c();
    });
  }), window.addEventListener("resize", () => {
    w(), O || $(0.08);
  });
  function nt(z, E) {
    const V = z.querySelector(E);
    if (!V) throw new Error(`Missing required element: ${E}`);
    return V;
  }
  function F(z) {
    k = z.boardGeom, R = z.layers, k?.board?.mm_bounds && p.setBoardBounds({
      minX_mm: k.board.mm_bounds.min_x_mm,
      minY_mm: k.board.mm_bounds.min_y_mm,
      maxX_mm: k.board.mm_bounds.max_x_mm,
      maxY_mm: k.board.mm_bounds.max_y_mm
    }), c(), w(), $(0.08);
  }
  function T(z) {
    I = z;
    const E = u.find((V) => V.value === z);
    E && (E.checked = !0), c();
  }
  function et() {
    window.removeEventListener("mousemove", st), window.removeEventListener("mouseup", q), f.innerHTML = "";
  }
  return w(), {
    setData: F,
    setSideMode: T,
    fit: () => $(0.08),
    dispose: et,
    // Expose new render pipeline API
    viewer: p,
    visibility: h,
    overlayRegistry: m,
    markerRenderer: n,
    setSelection: (z) => {
      y = z, p.requestRender("selection-change");
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
      n.add(E), p.requestRender("marker-added");
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
        const V = {
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
        n.add(V);
      }
      p.requestRender("markers-added");
    },
    removeMarker: (z) => {
      n.remove(z), p.requestRender("marker-removed");
    }
  };
}
function fr(f, t) {
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
function mr() {
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
function pr(f) {
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
function yr(f = 1) {
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
function gr(f) {
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
function sr(f, t) {
  const e = t.maxX_mm - t.minX_mm, a = t.maxY_mm - t.minY_mm;
  return f.x_mm < 0 || f.x_mm > e || f.y_mm < 0 || f.y_mm > a;
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
      const d = t.boardToScreen({ x: o.x_mm, y: o.y_mm }), g = d.x, b = d.y;
      if (g < -10 || b < -10 || g > l + 10 || b > s + 10) continue;
      const u = e?.boardBounds ? sr({ x_mm: o.x_mm, y_mm: o.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, o, e?.selectedId === o.id, e?.hoverId === o.id, u), t.ctx.beginPath(), t.ctx.arc(g, b, i, 0, Math.PI * 2), e?.selectedId === o.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
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
function _r(f, t) {
  const e = new or(f);
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
  de as VisibilityManager,
  hr as createGerberPass,
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
  he as renderGerbersFiles,
  ar as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
