var ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ye(d) {
  return d && d.__esModule && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d;
}
function de(d) {
  throw new Error('Could not dynamically require "' + d + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var me = { exports: {} };
var we;
function Ze() {
  return we || (we = 1, (function(d, t) {
    (function(e) {
      d.exports = e();
    })(function() {
      return (function e(n, o, i) {
        function r(m, y) {
          if (!o[m]) {
            if (!n[m]) {
              var _ = typeof de == "function" && de;
              if (!y && _) return _(m, !0);
              if (s) return s(m, !0);
              var g = new Error("Cannot find module '" + m + "'");
              throw g.code = "MODULE_NOT_FOUND", g;
            }
            var f = o[m] = { exports: {} };
            n[m][0].call(f.exports, function(b) {
              var a = n[m][1][b];
              return r(a || b);
            }, f, f.exports, e, n, o, i);
          }
          return o[m].exports;
        }
        for (var s = typeof de == "function" && de, c = 0; c < i.length; c++) r(i[c]);
        return r;
      })({ 1: [function(e, n, o) {
        var i = e("./utils"), r = e("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        o.encode = function(c) {
          for (var m, y, _, g, f, b, a, p = [], h = 0, x = c.length, w = x, I = i.getTypeOf(c) !== "string"; h < c.length; ) w = x - h, _ = I ? (m = c[h++], y = h < x ? c[h++] : 0, h < x ? c[h++] : 0) : (m = c.charCodeAt(h++), y = h < x ? c.charCodeAt(h++) : 0, h < x ? c.charCodeAt(h++) : 0), g = m >> 2, f = (3 & m) << 4 | y >> 4, b = 1 < w ? (15 & y) << 2 | _ >> 6 : 64, a = 2 < w ? 63 & _ : 64, p.push(s.charAt(g) + s.charAt(f) + s.charAt(b) + s.charAt(a));
          return p.join("");
        }, o.decode = function(c) {
          var m, y, _, g, f, b, a = 0, p = 0, h = "data:";
          if (c.substr(0, h.length) === h) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, w = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === s.charAt(64) && w--, c.charAt(c.length - 2) === s.charAt(64) && w--, w % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = r.uint8array ? new Uint8Array(0 | w) : new Array(0 | w); a < c.length; ) m = s.indexOf(c.charAt(a++)) << 2 | (g = s.indexOf(c.charAt(a++))) >> 4, y = (15 & g) << 4 | (f = s.indexOf(c.charAt(a++))) >> 2, _ = (3 & f) << 6 | (b = s.indexOf(c.charAt(a++))), x[p++] = m, f !== 64 && (x[p++] = y), b !== 64 && (x[p++] = _);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, n, o) {
        var i = e("./external"), r = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), c = e("./stream/DataLengthProbe");
        function m(y, _, g, f, b) {
          this.compressedSize = y, this.uncompressedSize = _, this.crc32 = g, this.compression = f, this.compressedContent = b;
        }
        m.prototype = { getContentWorker: function() {
          var y = new r(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), _ = this;
          return y.on("end", function() {
            if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), y;
        }, getCompressedWorker: function() {
          return new r(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, m.createWorkerFrom = function(y, _, g) {
          return y.pipe(new s()).pipe(new c("uncompressedSize")).pipe(_.compressWorker(g)).pipe(new c("compressedSize")).withStreamInfo("compression", _);
        }, n.exports = m;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, n, o) {
        var i = e("./stream/GenericWorker");
        o.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, o.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, n, o) {
        var i = e("./utils"), r = (function() {
          for (var s, c = [], m = 0; m < 256; m++) {
            s = m;
            for (var y = 0; y < 8; y++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            c[m] = s;
          }
          return c;
        })();
        n.exports = function(s, c) {
          return s !== void 0 && s.length ? i.getTypeOf(s) !== "string" ? (function(m, y, _, g) {
            var f = r, b = g + _;
            m ^= -1;
            for (var a = g; a < b; a++) m = m >>> 8 ^ f[255 & (m ^ y[a])];
            return -1 ^ m;
          })(0 | c, s, s.length, 0) : (function(m, y, _, g) {
            var f = r, b = g + _;
            m ^= -1;
            for (var a = g; a < b; a++) m = m >>> 8 ^ f[255 & (m ^ y.charCodeAt(a))];
            return -1 ^ m;
          })(0 | c, s, s.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, n, o) {
        o.base64 = !1, o.binary = !1, o.dir = !1, o.createFolders = !0, o.date = null, o.compression = null, o.compressionOptions = null, o.comment = null, o.unixPermissions = null, o.dosPermissions = null;
      }, {}], 6: [function(e, n, o) {
        var i = null;
        i = typeof Promise < "u" ? Promise : e("lie"), n.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(e, n, o) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", r = e("pako"), s = e("./utils"), c = e("./stream/GenericWorker"), m = i ? "uint8array" : "array";
        function y(_, g) {
          c.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = g, this.meta = {};
        }
        o.magic = "\b\0", s.inherits(y, c), y.prototype.processChunk = function(_) {
          this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(m, _.data), !1);
        }, y.prototype.flush = function() {
          c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, y.prototype.cleanUp = function() {
          c.prototype.cleanUp.call(this), this._pako = null;
        }, y.prototype._createPako = function() {
          this._pako = new r[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var _ = this;
          this._pako.onData = function(g) {
            _.push({ data: g, meta: _.meta });
          };
        }, o.compressWorker = function(_) {
          return new y("Deflate", _);
        }, o.uncompressWorker = function() {
          return new y("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, n, o) {
        function i(f, b) {
          var a, p = "";
          for (a = 0; a < b; a++) p += String.fromCharCode(255 & f), f >>>= 8;
          return p;
        }
        function r(f, b, a, p, h, x) {
          var w, I, R = f.file, P = f.compression, B = x !== m.utf8encode, U = s.transformTo("string", x(R.name)), E = s.transformTo("string", m.utf8encode(R.name)), $ = R.comment, q = s.transformTo("string", x($)), M = s.transformTo("string", m.utf8encode($)), L = E.length !== R.name.length, u = M.length !== $.length, N = "", at = "", X = "", rt = R.dir, Y = R.date, it = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          b && !a || (it.crc32 = f.crc32, it.compressedSize = f.compressedSize, it.uncompressedSize = f.uncompressedSize);
          var O = 0;
          b && (O |= 8), B || !L && !u || (O |= 2048);
          var T = 0, st = 0;
          rt && (T |= 16), h === "UNIX" ? (st = 798, T |= (function(H, ft) {
            var wt = H;
            return H || (wt = ft ? 16893 : 33204), (65535 & wt) << 16;
          })(R.unixPermissions, rt)) : (st = 20, T |= (function(H) {
            return 63 & (H || 0);
          })(R.dosPermissions)), w = Y.getUTCHours(), w <<= 6, w |= Y.getUTCMinutes(), w <<= 5, w |= Y.getUTCSeconds() / 2, I = Y.getUTCFullYear() - 1980, I <<= 4, I |= Y.getUTCMonth() + 1, I <<= 5, I |= Y.getUTCDate(), L && (at = i(1, 1) + i(y(U), 4) + E, N += "up" + i(at.length, 2) + at), u && (X = i(1, 1) + i(y(q), 4) + M, N += "uc" + i(X.length, 2) + X);
          var Q = "";
          return Q += `
\0`, Q += i(O, 2), Q += P.magic, Q += i(w, 2), Q += i(I, 2), Q += i(it.crc32, 4), Q += i(it.compressedSize, 4), Q += i(it.uncompressedSize, 4), Q += i(U.length, 2), Q += i(N.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + Q + U + N, dirRecord: _.CENTRAL_FILE_HEADER + i(st, 2) + Q + i(q.length, 2) + "\0\0\0\0" + i(T, 4) + i(p, 4) + U + N + q };
        }
        var s = e("../utils"), c = e("../stream/GenericWorker"), m = e("../utf8"), y = e("../crc32"), _ = e("../signature");
        function g(f, b, a, p) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = b, this.zipPlatform = a, this.encodeFileName = p, this.streamFiles = f, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        s.inherits(g, c), g.prototype.push = function(f) {
          var b = f.meta.percent || 0, a = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(f) : (this.bytesWritten += f.data.length, c.prototype.push.call(this, { data: f.data, meta: { currentFile: this.currentFile, percent: a ? (b + 100 * (a - p - 1)) / a : 100 } }));
        }, g.prototype.openedSource = function(f) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = f.file.name;
          var b = this.streamFiles && !f.file.dir;
          if (b) {
            var a = r(f, b, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: a.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, g.prototype.closedSource = function(f) {
          this.accumulate = !1;
          var b = this.streamFiles && !f.file.dir, a = r(f, b, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(a.dirRecord), b) this.push({ data: (function(p) {
            return _.DATA_DESCRIPTOR + i(p.crc32, 4) + i(p.compressedSize, 4) + i(p.uncompressedSize, 4);
          })(f), meta: { percent: 100 } });
          else for (this.push({ data: a.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, g.prototype.flush = function() {
          for (var f = this.bytesWritten, b = 0; b < this.dirRecords.length; b++) this.push({ data: this.dirRecords[b], meta: { percent: 100 } });
          var a = this.bytesWritten - f, p = (function(h, x, w, I, R) {
            var P = s.transformTo("string", R(I));
            return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(h, 2) + i(h, 2) + i(x, 4) + i(w, 4) + i(P.length, 2) + P;
          })(this.dirRecords.length, a, f, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, g.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, g.prototype.registerPrevious = function(f) {
          this._sources.push(f);
          var b = this;
          return f.on("data", function(a) {
            b.processChunk(a);
          }), f.on("end", function() {
            b.closedSource(b.previous.streamInfo), b._sources.length ? b.prepareNextSource() : b.end();
          }), f.on("error", function(a) {
            b.error(a);
          }), this;
        }, g.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, g.prototype.error = function(f) {
          var b = this._sources;
          if (!c.prototype.error.call(this, f)) return !1;
          for (var a = 0; a < b.length; a++) try {
            b[a].error(f);
          } catch {
          }
          return !0;
        }, g.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var f = this._sources, b = 0; b < f.length; b++) f[b].lock();
        }, n.exports = g;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, n, o) {
        var i = e("../compressions"), r = e("./ZipFileWorker");
        o.generateWorker = function(s, c, m) {
          var y = new r(c.streamFiles, m, c.platform, c.encodeFileName), _ = 0;
          try {
            s.forEach(function(g, f) {
              _++;
              var b = (function(x, w) {
                var I = x || w, R = i[I];
                if (!R) throw new Error(I + " is not a valid compression method !");
                return R;
              })(f.options.compression, c.compression), a = f.options.compressionOptions || c.compressionOptions || {}, p = f.dir, h = f.date;
              f._compressWorker(b, a).withStreamInfo("file", { name: g, dir: p, date: h, comment: f.comment || "", unixPermissions: f.unixPermissions, dosPermissions: f.dosPermissions }).pipe(y);
            }), y.entriesCount = _;
          } catch (g) {
            y.error(g);
          }
          return y;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, n, o) {
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var r = new i();
            for (var s in this) typeof this[s] != "function" && (r[s] = this[s]);
            return r;
          };
        }
        (i.prototype = e("./object")).loadAsync = e("./load"), i.support = e("./support"), i.defaults = e("./defaults"), i.version = "3.10.1", i.loadAsync = function(r, s) {
          return new i().loadAsync(r, s);
        }, i.external = e("./external"), n.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, n, o) {
        var i = e("./utils"), r = e("./external"), s = e("./utf8"), c = e("./zipEntries"), m = e("./stream/Crc32Probe"), y = e("./nodejsUtils");
        function _(g) {
          return new r.Promise(function(f, b) {
            var a = g.decompressed.getContentWorker().pipe(new m());
            a.on("error", function(p) {
              b(p);
            }).on("end", function() {
              a.streamInfo.crc32 !== g.decompressed.crc32 ? b(new Error("Corrupted zip : CRC32 mismatch")) : f();
            }).resume();
          });
        }
        n.exports = function(g, f) {
          var b = this;
          return f = i.extend(f || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: s.utf8decode }), y.isNode && y.isStream(g) ? r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", g, !0, f.optimizedBinaryString, f.base64).then(function(a) {
            var p = new c(f);
            return p.load(a), p;
          }).then(function(a) {
            var p = [r.Promise.resolve(a)], h = a.files;
            if (f.checkCRC32) for (var x = 0; x < h.length; x++) p.push(_(h[x]));
            return r.Promise.all(p);
          }).then(function(a) {
            for (var p = a.shift(), h = p.files, x = 0; x < h.length; x++) {
              var w = h[x], I = w.fileNameStr, R = i.resolve(w.fileNameStr);
              b.file(R, w.decompressed, { binary: !0, optimizedBinaryString: !0, date: w.date, dir: w.dir, comment: w.fileCommentStr.length ? w.fileCommentStr : null, unixPermissions: w.unixPermissions, dosPermissions: w.dosPermissions, createFolders: f.createFolders }), w.dir || (b.file(R).unsafeOriginalName = I);
            }
            return p.zipComment.length && (b.comment = p.zipComment), b;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, n, o) {
        var i = e("../utils"), r = e("../stream/GenericWorker");
        function s(c, m) {
          r.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(m);
        }
        i.inherits(s, r), s.prototype._bindStream = function(c) {
          var m = this;
          (this._stream = c).pause(), c.on("data", function(y) {
            m.push({ data: y, meta: { percent: 0 } });
          }).on("error", function(y) {
            m.isPaused ? this.generatedError = y : m.error(y);
          }).on("end", function() {
            m.isPaused ? m._upstreamEnded = !0 : m.end();
          });
        }, s.prototype.pause = function() {
          return !!r.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, s.prototype.resume = function() {
          return !!r.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, n.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, n, o) {
        var i = e("readable-stream").Readable;
        function r(s, c, m) {
          i.call(this, c), this._helper = s;
          var y = this;
          s.on("data", function(_, g) {
            y.push(_) || y._helper.pause(), m && m(g);
          }).on("error", function(_) {
            y.emit("error", _);
          }).on("end", function() {
            y.push(null);
          });
        }
        e("../utils").inherits(r, i), r.prototype._read = function() {
          this._helper.resume();
        }, n.exports = r;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, n, o) {
        n.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, r) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, r);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, r);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var r = new Buffer(i);
          return r.fill(0), r;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(e, n, o) {
        function i(R, P, B) {
          var U, E = s.getTypeOf(P), $ = s.extend(B || {}, y);
          $.date = $.date || /* @__PURE__ */ new Date(), $.compression !== null && ($.compression = $.compression.toUpperCase()), typeof $.unixPermissions == "string" && ($.unixPermissions = parseInt($.unixPermissions, 8)), $.unixPermissions && 16384 & $.unixPermissions && ($.dir = !0), $.dosPermissions && 16 & $.dosPermissions && ($.dir = !0), $.dir && (R = h(R)), $.createFolders && (U = p(R)) && x.call(this, U, !0);
          var q = E === "string" && $.binary === !1 && $.base64 === !1;
          B && B.binary !== void 0 || ($.binary = !q), (P instanceof _ && P.uncompressedSize === 0 || $.dir || !P || P.length === 0) && ($.base64 = !1, $.binary = !0, P = "", $.compression = "STORE", E = "string");
          var M = null;
          M = P instanceof _ || P instanceof c ? P : b.isNode && b.isStream(P) ? new a(R, P) : s.prepareContent(R, P, $.binary, $.optimizedBinaryString, $.base64);
          var L = new g(R, M, $);
          this.files[R] = L;
        }
        var r = e("./utf8"), s = e("./utils"), c = e("./stream/GenericWorker"), m = e("./stream/StreamHelper"), y = e("./defaults"), _ = e("./compressedObject"), g = e("./zipObject"), f = e("./generate"), b = e("./nodejsUtils"), a = e("./nodejs/NodejsStreamInputAdapter"), p = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var P = R.lastIndexOf("/");
          return 0 < P ? R.substring(0, P) : "";
        }, h = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, x = function(R, P) {
          return P = P !== void 0 ? P : y.createFolders, R = h(R), this.files[R] || i.call(this, R, null, { dir: !0, createFolders: P }), this.files[R];
        };
        function w(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var I = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var P, B, U;
          for (P in this.files) U = this.files[P], (B = P.slice(this.root.length, P.length)) && P.slice(0, this.root.length) === this.root && R(B, U);
        }, filter: function(R) {
          var P = [];
          return this.forEach(function(B, U) {
            R(B, U) && P.push(U);
          }), P;
        }, file: function(R, P, B) {
          if (arguments.length !== 1) return R = this.root + R, i.call(this, R, P, B), this;
          if (w(R)) {
            var U = R;
            return this.filter(function($, q) {
              return !q.dir && U.test($);
            });
          }
          var E = this.files[this.root + R];
          return E && !E.dir ? E : null;
        }, folder: function(R) {
          if (!R) return this;
          if (w(R)) return this.filter(function(E, $) {
            return $.dir && R.test(E);
          });
          var P = this.root + R, B = x.call(this, P), U = this.clone();
          return U.root = B.name, U;
        }, remove: function(R) {
          R = this.root + R;
          var P = this.files[R];
          if (P || (R.slice(-1) !== "/" && (R += "/"), P = this.files[R]), P && !P.dir) delete this.files[R];
          else for (var B = this.filter(function(E, $) {
            return $.name.slice(0, R.length) === R;
          }), U = 0; U < B.length; U++) delete this.files[B[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var P, B = {};
          try {
            if ((B = s.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: r.utf8encode })).type = B.type.toLowerCase(), B.compression = B.compression.toUpperCase(), B.type === "binarystring" && (B.type = "string"), !B.type) throw new Error("No output type specified.");
            s.checkSupport(B.type), B.platform !== "darwin" && B.platform !== "freebsd" && B.platform !== "linux" && B.platform !== "sunos" || (B.platform = "UNIX"), B.platform === "win32" && (B.platform = "DOS");
            var U = B.comment || this.comment || "";
            P = f.generateWorker(this, B, U);
          } catch (E) {
            (P = new c("error")).error(E);
          }
          return new m(P, B.type || "string", B.mimeType);
        }, generateAsync: function(R, P) {
          return this.generateInternalStream(R).accumulate(P);
        }, generateNodeStream: function(R, P) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(P);
        } };
        n.exports = I;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, n, o) {
        n.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, n, o) {
        var i = e("./DataReader");
        function r(s) {
          i.call(this, s);
          for (var c = 0; c < this.data.length; c++) s[c] = 255 & s[c];
        }
        e("../utils").inherits(r, i), r.prototype.byteAt = function(s) {
          return this.data[this.zero + s];
        }, r.prototype.lastIndexOfSignature = function(s) {
          for (var c = s.charCodeAt(0), m = s.charCodeAt(1), y = s.charCodeAt(2), _ = s.charCodeAt(3), g = this.length - 4; 0 <= g; --g) if (this.data[g] === c && this.data[g + 1] === m && this.data[g + 2] === y && this.data[g + 3] === _) return g - this.zero;
          return -1;
        }, r.prototype.readAndCheckSignature = function(s) {
          var c = s.charCodeAt(0), m = s.charCodeAt(1), y = s.charCodeAt(2), _ = s.charCodeAt(3), g = this.readData(4);
          return c === g[0] && m === g[1] && y === g[2] && _ === g[3];
        }, r.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, n, o) {
        var i = e("../utils");
        function r(s) {
          this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
        }
        r.prototype = { checkOffset: function(s) {
          this.checkIndex(this.index + s);
        }, checkIndex: function(s) {
          if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
        }, setIndex: function(s) {
          this.checkIndex(s), this.index = s;
        }, skip: function(s) {
          this.setIndex(this.index + s);
        }, byteAt: function() {
        }, readInt: function(s) {
          var c, m = 0;
          for (this.checkOffset(s), c = this.index + s - 1; c >= this.index; c--) m = (m << 8) + this.byteAt(c);
          return this.index += s, m;
        }, readString: function(s) {
          return i.transformTo("string", this.readData(s));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var s = this.readInt(4);
          return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
        } }, n.exports = r;
      }, { "../utils": 32 }], 19: [function(e, n, o) {
        var i = e("./Uint8ArrayReader");
        function r(s) {
          i.call(this, s);
        }
        e("../utils").inherits(r, i), r.prototype.readData = function(s) {
          this.checkOffset(s);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = r;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, n, o) {
        var i = e("./DataReader");
        function r(s) {
          i.call(this, s);
        }
        e("../utils").inherits(r, i), r.prototype.byteAt = function(s) {
          return this.data.charCodeAt(this.zero + s);
        }, r.prototype.lastIndexOfSignature = function(s) {
          return this.data.lastIndexOf(s) - this.zero;
        }, r.prototype.readAndCheckSignature = function(s) {
          return s === this.readData(4);
        }, r.prototype.readData = function(s) {
          this.checkOffset(s);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, n, o) {
        var i = e("./ArrayReader");
        function r(s) {
          i.call(this, s);
        }
        e("../utils").inherits(r, i), r.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, c;
        }, n.exports = r;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, n, o) {
        var i = e("../utils"), r = e("../support"), s = e("./ArrayReader"), c = e("./StringReader"), m = e("./NodeBufferReader"), y = e("./Uint8ArrayReader");
        n.exports = function(_) {
          var g = i.getTypeOf(_);
          return i.checkSupport(g), g !== "string" || r.uint8array ? g === "nodebuffer" ? new m(_) : r.uint8array ? new y(i.transformTo("uint8array", _)) : new s(i.transformTo("array", _)) : new c(_);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, n, o) {
        o.LOCAL_FILE_HEADER = "PK", o.CENTRAL_FILE_HEADER = "PK", o.CENTRAL_DIRECTORY_END = "PK", o.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", o.ZIP64_CENTRAL_DIRECTORY_END = "PK", o.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, n, o) {
        var i = e("./GenericWorker"), r = e("../utils");
        function s(c) {
          i.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        r.inherits(s, i), s.prototype.processChunk = function(c) {
          this.push({ data: r.transformTo(this.destType, c.data), meta: c.meta });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, n, o) {
        var i = e("./GenericWorker"), r = e("../crc32");
        function s() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(s, i), s.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = r(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, n.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, n, o) {
        var i = e("../utils"), r = e("./GenericWorker");
        function s(c) {
          r.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        i.inherits(s, r), s.prototype.processChunk = function(c) {
          if (c) {
            var m = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = m + c.data.length;
          }
          r.prototype.processChunk.call(this, c);
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, n, o) {
        var i = e("../utils"), r = e("./GenericWorker");
        function s(c) {
          r.call(this, "DataWorker");
          var m = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(y) {
            m.dataIsReady = !0, m.data = y, m.max = y && y.length || 0, m.type = i.getTypeOf(y), m.isPaused || m._tickAndRepeat();
          }, function(y) {
            m.error(y);
          });
        }
        i.inherits(s, r), s.prototype.cleanUp = function() {
          r.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!r.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var c = null, m = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              c = this.data.substring(this.index, m);
              break;
            case "uint8array":
              c = this.data.subarray(this.index, m);
              break;
            case "array":
            case "nodebuffer":
              c = this.data.slice(this.index, m);
          }
          return this.index = m, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, n, o) {
        function i(r) {
          this.name = r || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(r) {
          this.emit("data", r);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (r) {
            this.emit("error", r);
          }
          return !0;
        }, error: function(r) {
          return !this.isFinished && (this.isPaused ? this.generatedError = r : (this.isFinished = !0, this.emit("error", r), this.previous && this.previous.error(r), this.cleanUp()), !0);
        }, on: function(r, s) {
          return this._listeners[r].push(s), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(r, s) {
          if (this._listeners[r]) for (var c = 0; c < this._listeners[r].length; c++) this._listeners[r][c].call(this, s);
        }, pipe: function(r) {
          return r.registerPrevious(this);
        }, registerPrevious: function(r) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = r.streamInfo, this.mergeStreamInfo(), this.previous = r;
          var s = this;
          return r.on("data", function(c) {
            s.processChunk(c);
          }), r.on("end", function() {
            s.end();
          }), r.on("error", function(c) {
            s.error(c);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var r = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), r = !0), this.previous && this.previous.resume(), !r;
        }, flush: function() {
        }, processChunk: function(r) {
          this.push(r);
        }, withStreamInfo: function(r, s) {
          return this.extraStreamInfo[r] = s, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var r in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, r) && (this.streamInfo[r] = this.extraStreamInfo[r]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var r = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + r : r;
        } }, n.exports = i;
      }, {}], 29: [function(e, n, o) {
        var i = e("../utils"), r = e("./ConvertWorker"), s = e("./GenericWorker"), c = e("../base64"), m = e("../support"), y = e("../external"), _ = null;
        if (m.nodestream) try {
          _ = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function g(b, a) {
          return new y.Promise(function(p, h) {
            var x = [], w = b._internalType, I = b._outputType, R = b._mimeType;
            b.on("data", function(P, B) {
              x.push(P), a && a(B);
            }).on("error", function(P) {
              x = [], h(P);
            }).on("end", function() {
              try {
                var P = (function(B, U, E) {
                  switch (B) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", U), E);
                    case "base64":
                      return c.encode(U);
                    default:
                      return i.transformTo(B, U);
                  }
                })(I, (function(B, U) {
                  var E, $ = 0, q = null, M = 0;
                  for (E = 0; E < U.length; E++) M += U[E].length;
                  switch (B) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (q = new Uint8Array(M), E = 0; E < U.length; E++) q.set(U[E], $), $ += U[E].length;
                      return q;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + B + "'");
                  }
                })(w, x), R);
                p(P);
              } catch (B) {
                h(B);
              }
              x = [];
            }).resume();
          });
        }
        function f(b, a, p) {
          var h = a;
          switch (a) {
            case "blob":
            case "arraybuffer":
              h = "uint8array";
              break;
            case "base64":
              h = "string";
          }
          try {
            this._internalType = h, this._outputType = a, this._mimeType = p, i.checkSupport(h), this._worker = b.pipe(new r(h)), b.lock();
          } catch (x) {
            this._worker = new s("error"), this._worker.error(x);
          }
        }
        f.prototype = { accumulate: function(b) {
          return g(this, b);
        }, on: function(b, a) {
          var p = this;
          return b === "data" ? this._worker.on(b, function(h) {
            a.call(p, h.data, h.meta);
          }) : this._worker.on(b, function() {
            i.delay(a, arguments, p);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(b) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new _(this, { objectMode: this._outputType !== "nodebuffer" }, b);
        } }, n.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, n, o) {
        if (o.base64 = !0, o.array = !0, o.string = !0, o.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", o.nodebuffer = typeof Buffer < "u", o.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") o.blob = !1;
        else {
          var i = new ArrayBuffer(0);
          try {
            o.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var r = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              r.append(i), o.blob = r.getBlob("application/zip").size === 0;
            } catch {
              o.blob = !1;
            }
          }
        }
        try {
          o.nodestream = !!e("readable-stream").Readable;
        } catch {
          o.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, n, o) {
        for (var i = e("./utils"), r = e("./support"), s = e("./nodejsUtils"), c = e("./stream/GenericWorker"), m = new Array(256), y = 0; y < 256; y++) m[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        m[254] = m[254] = 1;
        function _() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function g() {
          c.call(this, "utf-8 encode");
        }
        o.utf8encode = function(f) {
          return r.nodebuffer ? s.newBufferFrom(f, "utf-8") : (function(b) {
            var a, p, h, x, w, I = b.length, R = 0;
            for (x = 0; x < I; x++) (64512 & (p = b.charCodeAt(x))) == 55296 && x + 1 < I && (64512 & (h = b.charCodeAt(x + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (h - 56320), x++), R += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (a = r.uint8array ? new Uint8Array(R) : new Array(R), x = w = 0; w < R; x++) (64512 & (p = b.charCodeAt(x))) == 55296 && x + 1 < I && (64512 & (h = b.charCodeAt(x + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (h - 56320), x++), p < 128 ? a[w++] = p : (p < 2048 ? a[w++] = 192 | p >>> 6 : (p < 65536 ? a[w++] = 224 | p >>> 12 : (a[w++] = 240 | p >>> 18, a[w++] = 128 | p >>> 12 & 63), a[w++] = 128 | p >>> 6 & 63), a[w++] = 128 | 63 & p);
            return a;
          })(f);
        }, o.utf8decode = function(f) {
          return r.nodebuffer ? i.transformTo("nodebuffer", f).toString("utf-8") : (function(b) {
            var a, p, h, x, w = b.length, I = new Array(2 * w);
            for (a = p = 0; a < w; ) if ((h = b[a++]) < 128) I[p++] = h;
            else if (4 < (x = m[h])) I[p++] = 65533, a += x - 1;
            else {
              for (h &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && a < w; ) h = h << 6 | 63 & b[a++], x--;
              1 < x ? I[p++] = 65533 : h < 65536 ? I[p++] = h : (h -= 65536, I[p++] = 55296 | h >> 10 & 1023, I[p++] = 56320 | 1023 & h);
            }
            return I.length !== p && (I.subarray ? I = I.subarray(0, p) : I.length = p), i.applyFromCharCode(I);
          })(f = i.transformTo(r.uint8array ? "uint8array" : "array", f));
        }, i.inherits(_, c), _.prototype.processChunk = function(f) {
          var b = i.transformTo(r.uint8array ? "uint8array" : "array", f.data);
          if (this.leftOver && this.leftOver.length) {
            if (r.uint8array) {
              var a = b;
              (b = new Uint8Array(a.length + this.leftOver.length)).set(this.leftOver, 0), b.set(a, this.leftOver.length);
            } else b = this.leftOver.concat(b);
            this.leftOver = null;
          }
          var p = (function(x, w) {
            var I;
            for ((w = w || x.length) > x.length && (w = x.length), I = w - 1; 0 <= I && (192 & x[I]) == 128; ) I--;
            return I < 0 || I === 0 ? w : I + m[x[I]] > w ? I : w;
          })(b), h = b;
          p !== b.length && (r.uint8array ? (h = b.subarray(0, p), this.leftOver = b.subarray(p, b.length)) : (h = b.slice(0, p), this.leftOver = b.slice(p, b.length))), this.push({ data: o.utf8decode(h), meta: f.meta });
        }, _.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: o.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, o.Utf8DecodeWorker = _, i.inherits(g, c), g.prototype.processChunk = function(f) {
          this.push({ data: o.utf8encode(f.data), meta: f.meta });
        }, o.Utf8EncodeWorker = g;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, n, o) {
        var i = e("./support"), r = e("./base64"), s = e("./nodejsUtils"), c = e("./external");
        function m(a) {
          return a;
        }
        function y(a, p) {
          for (var h = 0; h < a.length; ++h) p[h] = 255 & a.charCodeAt(h);
          return p;
        }
        e("setimmediate"), o.newBlob = function(a, p) {
          o.checkSupport("blob");
          try {
            return new Blob([a], { type: p });
          } catch {
            try {
              var h = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return h.append(a), h.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var _ = { stringifyByChunk: function(a, p, h) {
          var x = [], w = 0, I = a.length;
          if (I <= h) return String.fromCharCode.apply(null, a);
          for (; w < I; ) p === "array" || p === "nodebuffer" ? x.push(String.fromCharCode.apply(null, a.slice(w, Math.min(w + h, I)))) : x.push(String.fromCharCode.apply(null, a.subarray(w, Math.min(w + h, I)))), w += h;
          return x.join("");
        }, stringifyByChar: function(a) {
          for (var p = "", h = 0; h < a.length; h++) p += String.fromCharCode(a[h]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return i.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function g(a) {
          var p = 65536, h = o.getTypeOf(a), x = !0;
          if (h === "uint8array" ? x = _.applyCanBeUsed.uint8array : h === "nodebuffer" && (x = _.applyCanBeUsed.nodebuffer), x) for (; 1 < p; ) try {
            return _.stringifyByChunk(a, h, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return _.stringifyByChar(a);
        }
        function f(a, p) {
          for (var h = 0; h < a.length; h++) p[h] = a[h];
          return p;
        }
        o.applyFromCharCode = g;
        var b = {};
        b.string = { string: m, array: function(a) {
          return y(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return b.string.uint8array(a).buffer;
        }, uint8array: function(a) {
          return y(a, new Uint8Array(a.length));
        }, nodebuffer: function(a) {
          return y(a, s.allocBuffer(a.length));
        } }, b.array = { string: g, array: m, arraybuffer: function(a) {
          return new Uint8Array(a).buffer;
        }, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return s.newBufferFrom(a);
        } }, b.arraybuffer = { string: function(a) {
          return g(new Uint8Array(a));
        }, array: function(a) {
          return f(new Uint8Array(a), new Array(a.byteLength));
        }, arraybuffer: m, uint8array: function(a) {
          return new Uint8Array(a);
        }, nodebuffer: function(a) {
          return s.newBufferFrom(new Uint8Array(a));
        } }, b.uint8array = { string: g, array: function(a) {
          return f(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return a.buffer;
        }, uint8array: m, nodebuffer: function(a) {
          return s.newBufferFrom(a);
        } }, b.nodebuffer = { string: g, array: function(a) {
          return f(a, new Array(a.length));
        }, arraybuffer: function(a) {
          return b.nodebuffer.uint8array(a).buffer;
        }, uint8array: function(a) {
          return f(a, new Uint8Array(a.length));
        }, nodebuffer: m }, o.transformTo = function(a, p) {
          if (p = p || "", !a) return p;
          o.checkSupport(a);
          var h = o.getTypeOf(p);
          return b[h][a](p);
        }, o.resolve = function(a) {
          for (var p = a.split("/"), h = [], x = 0; x < p.length; x++) {
            var w = p[x];
            w === "." || w === "" && x !== 0 && x !== p.length - 1 || (w === ".." ? h.pop() : h.push(w));
          }
          return h.join("/");
        }, o.getTypeOf = function(a) {
          return typeof a == "string" ? "string" : Object.prototype.toString.call(a) === "[object Array]" ? "array" : i.nodebuffer && s.isBuffer(a) ? "nodebuffer" : i.uint8array && a instanceof Uint8Array ? "uint8array" : i.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, o.checkSupport = function(a) {
          if (!i[a.toLowerCase()]) throw new Error(a + " is not supported by this platform");
        }, o.MAX_VALUE_16BITS = 65535, o.MAX_VALUE_32BITS = -1, o.pretty = function(a) {
          var p, h, x = "";
          for (h = 0; h < (a || "").length; h++) x += "\\x" + ((p = a.charCodeAt(h)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return x;
        }, o.delay = function(a, p, h) {
          setImmediate(function() {
            a.apply(h || null, p || []);
          });
        }, o.inherits = function(a, p) {
          function h() {
          }
          h.prototype = p.prototype, a.prototype = new h();
        }, o.extend = function() {
          var a, p, h = {};
          for (a = 0; a < arguments.length; a++) for (p in arguments[a]) Object.prototype.hasOwnProperty.call(arguments[a], p) && h[p] === void 0 && (h[p] = arguments[a][p]);
          return h;
        }, o.prepareContent = function(a, p, h, x, w) {
          return c.Promise.resolve(p).then(function(I) {
            return i.blob && (I instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(I)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(R, P) {
              var B = new FileReader();
              B.onload = function(U) {
                R(U.target.result);
              }, B.onerror = function(U) {
                P(U.target.error);
              }, B.readAsArrayBuffer(I);
            }) : I;
          }).then(function(I) {
            var R = o.getTypeOf(I);
            return R ? (R === "arraybuffer" ? I = o.transformTo("uint8array", I) : R === "string" && (w ? I = r.decode(I) : h && x !== !0 && (I = (function(P) {
              return y(P, i.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(I))), I) : c.Promise.reject(new Error("Can't read the data of '" + a + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, n, o) {
        var i = e("./reader/readerFor"), r = e("./utils"), s = e("./signature"), c = e("./zipEntry"), m = e("./support");
        function y(_) {
          this.files = [], this.loadOptions = _;
        }
        y.prototype = { checkSignature: function(_) {
          if (!this.reader.readAndCheckSignature(_)) {
            this.reader.index -= 4;
            var g = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + r.pretty(g) + ", expected " + r.pretty(_) + ")");
          }
        }, isSignature: function(_, g) {
          var f = this.reader.index;
          this.reader.setIndex(_);
          var b = this.reader.readString(4) === g;
          return this.reader.setIndex(f), b;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var _ = this.reader.readData(this.zipCommentLength), g = m.uint8array ? "uint8array" : "array", f = r.transformTo(g, _);
          this.zipComment = this.loadOptions.decodeFileName(f);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var _, g, f, b = this.zip64EndOfCentralSize - 44; 0 < b; ) _ = this.reader.readInt(2), g = this.reader.readInt(4), f = this.reader.readData(g), this.zip64ExtensibleData[_] = { id: _, length: g, value: f };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var _, g;
          for (_ = 0; _ < this.files.length; _++) g = this.files[_], this.reader.setIndex(g.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), g.readLocalPart(this.reader), g.handleUTF8(), g.processAttributes();
        }, readCentralDir: function() {
          var _;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (_ = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var _ = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (_ < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(_);
          var g = _;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === r.MAX_VALUE_16BITS || this.diskWithCentralDirStart === r.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === r.MAX_VALUE_16BITS || this.centralDirRecords === r.MAX_VALUE_16BITS || this.centralDirSize === r.MAX_VALUE_32BITS || this.centralDirOffset === r.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (_ = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(_), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var f = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (f += 20, f += 12 + this.zip64EndOfCentralSize);
          var b = g - f;
          if (0 < b) this.isSignature(g, s.CENTRAL_FILE_HEADER) || (this.reader.zero = b);
          else if (b < 0) throw new Error("Corrupted zip: missing " + Math.abs(b) + " bytes.");
        }, prepareReader: function(_) {
          this.reader = i(_);
        }, load: function(_) {
          this.prepareReader(_), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, n.exports = y;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, n, o) {
        var i = e("./reader/readerFor"), r = e("./utils"), s = e("./compressedObject"), c = e("./crc32"), m = e("./utf8"), y = e("./compressions"), _ = e("./support");
        function g(f, b) {
          this.options = f, this.loadOptions = b;
        }
        g.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(f) {
          var b, a;
          if (f.skip(22), this.fileNameLength = f.readInt(2), a = f.readInt(2), this.fileName = f.readData(this.fileNameLength), f.skip(a), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((b = (function(p) {
            for (var h in y) if (Object.prototype.hasOwnProperty.call(y, h) && y[h].magic === p) return y[h];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + r.pretty(this.compressionMethod) + " unknown (inner file : " + r.transformTo("string", this.fileName) + ")");
          this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, b, f.readData(this.compressedSize));
        }, readCentralPart: function(f) {
          this.versionMadeBy = f.readInt(2), f.skip(2), this.bitFlag = f.readInt(2), this.compressionMethod = f.readString(2), this.date = f.readDate(), this.crc32 = f.readInt(4), this.compressedSize = f.readInt(4), this.uncompressedSize = f.readInt(4);
          var b = f.readInt(2);
          if (this.extraFieldsLength = f.readInt(2), this.fileCommentLength = f.readInt(2), this.diskNumberStart = f.readInt(2), this.internalFileAttributes = f.readInt(2), this.externalFileAttributes = f.readInt(4), this.localHeaderOffset = f.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          f.skip(b), this.readExtraFields(f), this.parseZIP64ExtraField(f), this.fileComment = f.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var f = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), f == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), f == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var f = i(this.extraFields[1].value);
            this.uncompressedSize === r.MAX_VALUE_32BITS && (this.uncompressedSize = f.readInt(8)), this.compressedSize === r.MAX_VALUE_32BITS && (this.compressedSize = f.readInt(8)), this.localHeaderOffset === r.MAX_VALUE_32BITS && (this.localHeaderOffset = f.readInt(8)), this.diskNumberStart === r.MAX_VALUE_32BITS && (this.diskNumberStart = f.readInt(4));
          }
        }, readExtraFields: function(f) {
          var b, a, p, h = f.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); f.index + 4 < h; ) b = f.readInt(2), a = f.readInt(2), p = f.readData(a), this.extraFields[b] = { id: b, length: a, value: p };
          f.setIndex(h);
        }, handleUTF8: function() {
          var f = _.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = m.utf8decode(this.fileName), this.fileCommentStr = m.utf8decode(this.fileComment);
          else {
            var b = this.findExtraFieldUnicodePath();
            if (b !== null) this.fileNameStr = b;
            else {
              var a = r.transformTo(f, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(a);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var h = r.transformTo(f, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(h);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var f = this.extraFields[28789];
          if (f) {
            var b = i(f.value);
            return b.readInt(1) !== 1 || c(this.fileName) !== b.readInt(4) ? null : m.utf8decode(b.readData(f.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var f = this.extraFields[25461];
          if (f) {
            var b = i(f.value);
            return b.readInt(1) !== 1 || c(this.fileComment) !== b.readInt(4) ? null : m.utf8decode(b.readData(f.length - 5));
          }
          return null;
        } }, n.exports = g;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, n, o) {
        function i(b, a, p) {
          this.name = b, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = a, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var r = e("./stream/StreamHelper"), s = e("./stream/DataWorker"), c = e("./utf8"), m = e("./compressedObject"), y = e("./stream/GenericWorker");
        i.prototype = { internalStream: function(b) {
          var a = null, p = "string";
          try {
            if (!b) throw new Error("No output type specified.");
            var h = (p = b.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), a = this._decompressWorker();
            var x = !this._dataBinary;
            x && !h && (a = a.pipe(new c.Utf8EncodeWorker())), !x && h && (a = a.pipe(new c.Utf8DecodeWorker()));
          } catch (w) {
            (a = new y("error")).error(w);
          }
          return new r(a, p, "");
        }, async: function(b, a) {
          return this.internalStream(b).accumulate(a);
        }, nodeStream: function(b, a) {
          return this.internalStream(b || "nodebuffer").toNodejsStream(a);
        }, _compressWorker: function(b, a) {
          if (this._data instanceof m && this._data.compression.magic === b.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new c.Utf8EncodeWorker())), m.createWorkerFrom(p, b, a);
        }, _decompressWorker: function() {
          return this._data instanceof m ? this._data.getContentWorker() : this._data instanceof y ? this._data : new s(this._data);
        } };
        for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], g = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < _.length; f++) i.prototype[_[f]] = g;
        n.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, n, o) {
        (function(i) {
          var r, s, c = i.MutationObserver || i.WebKitMutationObserver;
          if (c) {
            var m = 0, y = new c(b), _ = i.document.createTextNode("");
            y.observe(_, { characterData: !0 }), r = function() {
              _.data = m = ++m % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) r = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var a = i.document.createElement("script");
            a.onreadystatechange = function() {
              b(), a.onreadystatechange = null, a.parentNode.removeChild(a), a = null;
            }, i.document.documentElement.appendChild(a);
          } : function() {
            setTimeout(b, 0);
          };
          else {
            var g = new i.MessageChannel();
            g.port1.onmessage = b, r = function() {
              g.port2.postMessage(0);
            };
          }
          var f = [];
          function b() {
            var a, p;
            s = !0;
            for (var h = f.length; h; ) {
              for (p = f, f = [], a = -1; ++a < h; ) p[a]();
              h = f.length;
            }
            s = !1;
          }
          n.exports = function(a) {
            f.push(a) !== 1 || s || r();
          };
        }).call(this, typeof ce < "u" ? ce : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, n, o) {
        var i = e("immediate");
        function r() {
        }
        var s = {}, c = ["REJECTED"], m = ["FULFILLED"], y = ["PENDING"];
        function _(h) {
          if (typeof h != "function") throw new TypeError("resolver must be a function");
          this.state = y, this.queue = [], this.outcome = void 0, h !== r && a(this, h);
        }
        function g(h, x, w) {
          this.promise = h, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof w == "function" && (this.onRejected = w, this.callRejected = this.otherCallRejected);
        }
        function f(h, x, w) {
          i(function() {
            var I;
            try {
              I = x(w);
            } catch (R) {
              return s.reject(h, R);
            }
            I === h ? s.reject(h, new TypeError("Cannot resolve promise with itself")) : s.resolve(h, I);
          });
        }
        function b(h) {
          var x = h && h.then;
          if (h && (typeof h == "object" || typeof h == "function") && typeof x == "function") return function() {
            x.apply(h, arguments);
          };
        }
        function a(h, x) {
          var w = !1;
          function I(B) {
            w || (w = !0, s.reject(h, B));
          }
          function R(B) {
            w || (w = !0, s.resolve(h, B));
          }
          var P = p(function() {
            x(R, I);
          });
          P.status === "error" && I(P.value);
        }
        function p(h, x) {
          var w = {};
          try {
            w.value = h(x), w.status = "success";
          } catch (I) {
            w.status = "error", w.value = I;
          }
          return w;
        }
        (n.exports = _).prototype.finally = function(h) {
          if (typeof h != "function") return this;
          var x = this.constructor;
          return this.then(function(w) {
            return x.resolve(h()).then(function() {
              return w;
            });
          }, function(w) {
            return x.resolve(h()).then(function() {
              throw w;
            });
          });
        }, _.prototype.catch = function(h) {
          return this.then(null, h);
        }, _.prototype.then = function(h, x) {
          if (typeof h != "function" && this.state === m || typeof x != "function" && this.state === c) return this;
          var w = new this.constructor(r);
          return this.state !== y ? f(w, this.state === m ? h : x, this.outcome) : this.queue.push(new g(w, h, x)), w;
        }, g.prototype.callFulfilled = function(h) {
          s.resolve(this.promise, h);
        }, g.prototype.otherCallFulfilled = function(h) {
          f(this.promise, this.onFulfilled, h);
        }, g.prototype.callRejected = function(h) {
          s.reject(this.promise, h);
        }, g.prototype.otherCallRejected = function(h) {
          f(this.promise, this.onRejected, h);
        }, s.resolve = function(h, x) {
          var w = p(b, x);
          if (w.status === "error") return s.reject(h, w.value);
          var I = w.value;
          if (I) a(h, I);
          else {
            h.state = m, h.outcome = x;
            for (var R = -1, P = h.queue.length; ++R < P; ) h.queue[R].callFulfilled(x);
          }
          return h;
        }, s.reject = function(h, x) {
          h.state = c, h.outcome = x;
          for (var w = -1, I = h.queue.length; ++w < I; ) h.queue[w].callRejected(x);
          return h;
        }, _.resolve = function(h) {
          return h instanceof this ? h : s.resolve(new this(r), h);
        }, _.reject = function(h) {
          var x = new this(r);
          return s.reject(x, h);
        }, _.all = function(h) {
          var x = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var w = h.length, I = !1;
          if (!w) return this.resolve([]);
          for (var R = new Array(w), P = 0, B = -1, U = new this(r); ++B < w; ) E(h[B], B);
          return U;
          function E($, q) {
            x.resolve($).then(function(M) {
              R[q] = M, ++P !== w || I || (I = !0, s.resolve(U, R));
            }, function(M) {
              I || (I = !0, s.reject(U, M));
            });
          }
        }, _.race = function(h) {
          var x = this;
          if (Object.prototype.toString.call(h) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var w = h.length, I = !1;
          if (!w) return this.resolve([]);
          for (var R = -1, P = new this(r); ++R < w; ) B = h[R], x.resolve(B).then(function(U) {
            I || (I = !0, s.resolve(P, U));
          }, function(U) {
            I || (I = !0, s.reject(P, U));
          });
          var B;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, n, o) {
        var i = {};
        (0, e("./lib/utils/common").assign)(i, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), n.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, n, o) {
        var i = e("./zlib/deflate"), r = e("./utils/common"), s = e("./utils/strings"), c = e("./zlib/messages"), m = e("./zlib/zstream"), y = Object.prototype.toString, _ = 0, g = -1, f = 0, b = 8;
        function a(h) {
          if (!(this instanceof a)) return new a(h);
          this.options = r.assign({ level: g, method: b, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: f, to: "" }, h || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new m(), this.strm.avail_out = 0;
          var w = i.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (w !== _) throw new Error(c[w]);
          if (x.header && i.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var I;
            if (I = typeof x.dictionary == "string" ? s.string2buf(x.dictionary) : y.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (w = i.deflateSetDictionary(this.strm, I)) !== _) throw new Error(c[w]);
            this._dict_set = !0;
          }
        }
        function p(h, x) {
          var w = new a(x);
          if (w.push(h, !0), w.err) throw w.msg || c[w.err];
          return w.result;
        }
        a.prototype.push = function(h, x) {
          var w, I, R = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          I = x === ~~x ? x : x === !0 ? 4 : 0, typeof h == "string" ? R.input = s.string2buf(h) : y.call(h) === "[object ArrayBuffer]" ? R.input = new Uint8Array(h) : R.input = h, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new r.Buf8(P), R.next_out = 0, R.avail_out = P), (w = i.deflate(R, I)) !== 1 && w !== _) return this.onEnd(w), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || I !== 4 && I !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(r.shrinkBuf(R.output, R.next_out))) : this.onData(r.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && w !== 1);
          return I === 4 ? (w = i.deflateEnd(this.strm), this.onEnd(w), this.ended = !0, w === _) : I !== 2 || (this.onEnd(_), !(R.avail_out = 0));
        }, a.prototype.onData = function(h) {
          this.chunks.push(h);
        }, a.prototype.onEnd = function(h) {
          h === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, o.Deflate = a, o.deflate = p, o.deflateRaw = function(h, x) {
          return (x = x || {}).raw = !0, p(h, x);
        }, o.gzip = function(h, x) {
          return (x = x || {}).gzip = !0, p(h, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, n, o) {
        var i = e("./zlib/inflate"), r = e("./utils/common"), s = e("./utils/strings"), c = e("./zlib/constants"), m = e("./zlib/messages"), y = e("./zlib/zstream"), _ = e("./zlib/gzheader"), g = Object.prototype.toString;
        function f(a) {
          if (!(this instanceof f)) return new f(a);
          this.options = r.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || a && a.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var h = i.inflateInit2(this.strm, p.windowBits);
          if (h !== c.Z_OK) throw new Error(m[h]);
          this.header = new _(), i.inflateGetHeader(this.strm, this.header);
        }
        function b(a, p) {
          var h = new f(p);
          if (h.push(a, !0), h.err) throw h.msg || m[h.err];
          return h.result;
        }
        f.prototype.push = function(a, p) {
          var h, x, w, I, R, P, B = this.strm, U = this.options.chunkSize, E = this.options.dictionary, $ = !1;
          if (this.ended) return !1;
          x = p === ~~p ? p : p === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof a == "string" ? B.input = s.binstring2buf(a) : g.call(a) === "[object ArrayBuffer]" ? B.input = new Uint8Array(a) : B.input = a, B.next_in = 0, B.avail_in = B.input.length;
          do {
            if (B.avail_out === 0 && (B.output = new r.Buf8(U), B.next_out = 0, B.avail_out = U), (h = i.inflate(B, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && E && (P = typeof E == "string" ? s.string2buf(E) : g.call(E) === "[object ArrayBuffer]" ? new Uint8Array(E) : E, h = i.inflateSetDictionary(this.strm, P)), h === c.Z_BUF_ERROR && $ === !0 && (h = c.Z_OK, $ = !1), h !== c.Z_STREAM_END && h !== c.Z_OK) return this.onEnd(h), !(this.ended = !0);
            B.next_out && (B.avail_out !== 0 && h !== c.Z_STREAM_END && (B.avail_in !== 0 || x !== c.Z_FINISH && x !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (w = s.utf8border(B.output, B.next_out), I = B.next_out - w, R = s.buf2string(B.output, w), B.next_out = I, B.avail_out = U - I, I && r.arraySet(B.output, B.output, w, I, 0), this.onData(R)) : this.onData(r.shrinkBuf(B.output, B.next_out)))), B.avail_in === 0 && B.avail_out === 0 && ($ = !0);
          } while ((0 < B.avail_in || B.avail_out === 0) && h !== c.Z_STREAM_END);
          return h === c.Z_STREAM_END && (x = c.Z_FINISH), x === c.Z_FINISH ? (h = i.inflateEnd(this.strm), this.onEnd(h), this.ended = !0, h === c.Z_OK) : x !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(B.avail_out = 0));
        }, f.prototype.onData = function(a) {
          this.chunks.push(a);
        }, f.prototype.onEnd = function(a) {
          a === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
        }, o.Inflate = f, o.inflate = b, o.inflateRaw = function(a, p) {
          return (p = p || {}).raw = !0, b(a, p);
        }, o.ungzip = b;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, n, o) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        o.assign = function(c) {
          for (var m = Array.prototype.slice.call(arguments, 1); m.length; ) {
            var y = m.shift();
            if (y) {
              if (typeof y != "object") throw new TypeError(y + "must be non-object");
              for (var _ in y) y.hasOwnProperty(_) && (c[_] = y[_]);
            }
          }
          return c;
        }, o.shrinkBuf = function(c, m) {
          return c.length === m ? c : c.subarray ? c.subarray(0, m) : (c.length = m, c);
        };
        var r = { arraySet: function(c, m, y, _, g) {
          if (m.subarray && c.subarray) c.set(m.subarray(y, y + _), g);
          else for (var f = 0; f < _; f++) c[g + f] = m[y + f];
        }, flattenChunks: function(c) {
          var m, y, _, g, f, b;
          for (m = _ = 0, y = c.length; m < y; m++) _ += c[m].length;
          for (b = new Uint8Array(_), m = g = 0, y = c.length; m < y; m++) f = c[m], b.set(f, g), g += f.length;
          return b;
        } }, s = { arraySet: function(c, m, y, _, g) {
          for (var f = 0; f < _; f++) c[g + f] = m[y + f];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        o.setTyped = function(c) {
          c ? (o.Buf8 = Uint8Array, o.Buf16 = Uint16Array, o.Buf32 = Int32Array, o.assign(o, r)) : (o.Buf8 = Array, o.Buf16 = Array, o.Buf32 = Array, o.assign(o, s));
        }, o.setTyped(i);
      }, {}], 42: [function(e, n, o) {
        var i = e("./common"), r = !0, s = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          r = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          s = !1;
        }
        for (var c = new i.Buf8(256), m = 0; m < 256; m++) c[m] = 252 <= m ? 6 : 248 <= m ? 5 : 240 <= m ? 4 : 224 <= m ? 3 : 192 <= m ? 2 : 1;
        function y(_, g) {
          if (g < 65537 && (_.subarray && s || !_.subarray && r)) return String.fromCharCode.apply(null, i.shrinkBuf(_, g));
          for (var f = "", b = 0; b < g; b++) f += String.fromCharCode(_[b]);
          return f;
        }
        c[254] = c[254] = 1, o.string2buf = function(_) {
          var g, f, b, a, p, h = _.length, x = 0;
          for (a = 0; a < h; a++) (64512 & (f = _.charCodeAt(a))) == 55296 && a + 1 < h && (64512 & (b = _.charCodeAt(a + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (b - 56320), a++), x += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
          for (g = new i.Buf8(x), a = p = 0; p < x; a++) (64512 & (f = _.charCodeAt(a))) == 55296 && a + 1 < h && (64512 & (b = _.charCodeAt(a + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (b - 56320), a++), f < 128 ? g[p++] = f : (f < 2048 ? g[p++] = 192 | f >>> 6 : (f < 65536 ? g[p++] = 224 | f >>> 12 : (g[p++] = 240 | f >>> 18, g[p++] = 128 | f >>> 12 & 63), g[p++] = 128 | f >>> 6 & 63), g[p++] = 128 | 63 & f);
          return g;
        }, o.buf2binstring = function(_) {
          return y(_, _.length);
        }, o.binstring2buf = function(_) {
          for (var g = new i.Buf8(_.length), f = 0, b = g.length; f < b; f++) g[f] = _.charCodeAt(f);
          return g;
        }, o.buf2string = function(_, g) {
          var f, b, a, p, h = g || _.length, x = new Array(2 * h);
          for (f = b = 0; f < h; ) if ((a = _[f++]) < 128) x[b++] = a;
          else if (4 < (p = c[a])) x[b++] = 65533, f += p - 1;
          else {
            for (a &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && f < h; ) a = a << 6 | 63 & _[f++], p--;
            1 < p ? x[b++] = 65533 : a < 65536 ? x[b++] = a : (a -= 65536, x[b++] = 55296 | a >> 10 & 1023, x[b++] = 56320 | 1023 & a);
          }
          return y(x, b);
        }, o.utf8border = function(_, g) {
          var f;
          for ((g = g || _.length) > _.length && (g = _.length), f = g - 1; 0 <= f && (192 & _[f]) == 128; ) f--;
          return f < 0 || f === 0 ? g : f + c[_[f]] > g ? f : g;
        };
      }, { "./common": 41 }], 43: [function(e, n, o) {
        n.exports = function(i, r, s, c) {
          for (var m = 65535 & i | 0, y = i >>> 16 & 65535 | 0, _ = 0; s !== 0; ) {
            for (s -= _ = 2e3 < s ? 2e3 : s; y = y + (m = m + r[c++] | 0) | 0, --_; ) ;
            m %= 65521, y %= 65521;
          }
          return m | y << 16 | 0;
        };
      }, {}], 44: [function(e, n, o) {
        n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, n, o) {
        var i = (function() {
          for (var r, s = [], c = 0; c < 256; c++) {
            r = c;
            for (var m = 0; m < 8; m++) r = 1 & r ? 3988292384 ^ r >>> 1 : r >>> 1;
            s[c] = r;
          }
          return s;
        })();
        n.exports = function(r, s, c, m) {
          var y = i, _ = m + c;
          r ^= -1;
          for (var g = m; g < _; g++) r = r >>> 8 ^ y[255 & (r ^ s[g])];
          return -1 ^ r;
        };
      }, {}], 46: [function(e, n, o) {
        var i, r = e("../utils/common"), s = e("./trees"), c = e("./adler32"), m = e("./crc32"), y = e("./messages"), _ = 0, g = 4, f = 0, b = -2, a = -1, p = 4, h = 2, x = 8, w = 9, I = 286, R = 30, P = 19, B = 2 * I + 1, U = 15, E = 3, $ = 258, q = $ + E + 1, M = 42, L = 113, u = 1, N = 2, at = 3, X = 4;
        function rt(l, D) {
          return l.msg = y[D], D;
        }
        function Y(l) {
          return (l << 1) - (4 < l ? 9 : 0);
        }
        function it(l) {
          for (var D = l.length; 0 <= --D; ) l[D] = 0;
        }
        function O(l) {
          var D = l.state, F = D.pending;
          F > l.avail_out && (F = l.avail_out), F !== 0 && (r.arraySet(l.output, D.pending_buf, D.pending_out, F, l.next_out), l.next_out += F, D.pending_out += F, l.total_out += F, l.avail_out -= F, D.pending -= F, D.pending === 0 && (D.pending_out = 0));
        }
        function T(l, D) {
          s._tr_flush_block(l, 0 <= l.block_start ? l.block_start : -1, l.strstart - l.block_start, D), l.block_start = l.strstart, O(l.strm);
        }
        function st(l, D) {
          l.pending_buf[l.pending++] = D;
        }
        function Q(l, D) {
          l.pending_buf[l.pending++] = D >>> 8 & 255, l.pending_buf[l.pending++] = 255 & D;
        }
        function H(l, D) {
          var F, k, v = l.max_chain_length, A = l.strstart, j = l.prev_length, W = l.nice_match, C = l.strstart > l.w_size - q ? l.strstart - (l.w_size - q) : 0, Z = l.window, tt = l.w_mask, V = l.prev, nt = l.strstart + $, ht = Z[A + j - 1], dt = Z[A + j];
          l.prev_length >= l.good_match && (v >>= 2), W > l.lookahead && (W = l.lookahead);
          do
            if (Z[(F = D) + j] === dt && Z[F + j - 1] === ht && Z[F] === Z[A] && Z[++F] === Z[A + 1]) {
              A += 2, F++;
              do
                ;
              while (Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && Z[++A] === Z[++F] && A < nt);
              if (k = $ - (nt - A), A = nt - $, j < k) {
                if (l.match_start = D, W <= (j = k)) break;
                ht = Z[A + j - 1], dt = Z[A + j];
              }
            }
          while ((D = V[D & tt]) > C && --v != 0);
          return j <= l.lookahead ? j : l.lookahead;
        }
        function ft(l) {
          var D, F, k, v, A, j, W, C, Z, tt, V = l.w_size;
          do {
            if (v = l.window_size - l.lookahead - l.strstart, l.strstart >= V + (V - q)) {
              for (r.arraySet(l.window, l.window, V, V, 0), l.match_start -= V, l.strstart -= V, l.block_start -= V, D = F = l.hash_size; k = l.head[--D], l.head[D] = V <= k ? k - V : 0, --F; ) ;
              for (D = F = V; k = l.prev[--D], l.prev[D] = V <= k ? k - V : 0, --F; ) ;
              v += V;
            }
            if (l.strm.avail_in === 0) break;
            if (j = l.strm, W = l.window, C = l.strstart + l.lookahead, Z = v, tt = void 0, tt = j.avail_in, Z < tt && (tt = Z), F = tt === 0 ? 0 : (j.avail_in -= tt, r.arraySet(W, j.input, j.next_in, tt, C), j.state.wrap === 1 ? j.adler = c(j.adler, W, tt, C) : j.state.wrap === 2 && (j.adler = m(j.adler, W, tt, C)), j.next_in += tt, j.total_in += tt, tt), l.lookahead += F, l.lookahead + l.insert >= E) for (A = l.strstart - l.insert, l.ins_h = l.window[A], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[A + 1]) & l.hash_mask; l.insert && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[A + E - 1]) & l.hash_mask, l.prev[A & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = A, A++, l.insert--, !(l.lookahead + l.insert < E)); ) ;
          } while (l.lookahead < q && l.strm.avail_in !== 0);
        }
        function wt(l, D) {
          for (var F, k; ; ) {
            if (l.lookahead < q) {
              if (ft(l), l.lookahead < q && D === _) return u;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= E && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), F !== 0 && l.strstart - F <= l.w_size - q && (l.match_length = H(l, F)), l.match_length >= E) if (k = s._tr_tally(l, l.strstart - l.match_start, l.match_length - E), l.lookahead -= l.match_length, l.match_length <= l.max_lazy_match && l.lookahead >= E) {
              for (l.match_length--; l.strstart++, l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart, --l.match_length != 0; ) ;
              l.strstart++;
            } else l.strstart += l.match_length, l.match_length = 0, l.ins_h = l.window[l.strstart], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + 1]) & l.hash_mask;
            else k = s._tr_tally(l, 0, l.window[l.strstart]), l.lookahead--, l.strstart++;
            if (k && (T(l, !1), l.strm.avail_out === 0)) return u;
          }
          return l.insert = l.strstart < E - 1 ? l.strstart : E - 1, D === g ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? u : N;
        }
        function ct(l, D) {
          for (var F, k, v; ; ) {
            if (l.lookahead < q) {
              if (ft(l), l.lookahead < q && D === _) return u;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= E && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), l.prev_length = l.match_length, l.prev_match = l.match_start, l.match_length = E - 1, F !== 0 && l.prev_length < l.max_lazy_match && l.strstart - F <= l.w_size - q && (l.match_length = H(l, F), l.match_length <= 5 && (l.strategy === 1 || l.match_length === E && 4096 < l.strstart - l.match_start) && (l.match_length = E - 1)), l.prev_length >= E && l.match_length <= l.prev_length) {
              for (v = l.strstart + l.lookahead - E, k = s._tr_tally(l, l.strstart - 1 - l.prev_match, l.prev_length - E), l.lookahead -= l.prev_length - 1, l.prev_length -= 2; ++l.strstart <= v && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), --l.prev_length != 0; ) ;
              if (l.match_available = 0, l.match_length = E - 1, l.strstart++, k && (T(l, !1), l.strm.avail_out === 0)) return u;
            } else if (l.match_available) {
              if ((k = s._tr_tally(l, 0, l.window[l.strstart - 1])) && T(l, !1), l.strstart++, l.lookahead--, l.strm.avail_out === 0) return u;
            } else l.match_available = 1, l.strstart++, l.lookahead--;
          }
          return l.match_available && (k = s._tr_tally(l, 0, l.window[l.strstart - 1]), l.match_available = 0), l.insert = l.strstart < E - 1 ? l.strstart : E - 1, D === g ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? u : N;
        }
        function ut(l, D, F, k, v) {
          this.good_length = l, this.max_lazy = D, this.nice_length = F, this.max_chain = k, this.func = v;
        }
        function bt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new r.Buf16(2 * B), this.dyn_dtree = new r.Buf16(2 * (2 * R + 1)), this.bl_tree = new r.Buf16(2 * (2 * P + 1)), it(this.dyn_ltree), it(this.dyn_dtree), it(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new r.Buf16(U + 1), this.heap = new r.Buf16(2 * I + 1), it(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new r.Buf16(2 * I + 1), it(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(l) {
          var D;
          return l && l.state ? (l.total_in = l.total_out = 0, l.data_type = h, (D = l.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? M : L, l.adler = D.wrap === 2 ? 0 : 1, D.last_flush = _, s._tr_init(D), f) : rt(l, b);
        }
        function Rt(l) {
          var D = pt(l);
          return D === f && (function(F) {
            F.window_size = 2 * F.w_size, it(F.head), F.max_lazy_match = i[F.level].max_lazy, F.good_match = i[F.level].good_length, F.nice_match = i[F.level].nice_length, F.max_chain_length = i[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = E - 1, F.match_available = 0, F.ins_h = 0;
          })(l.state), D;
        }
        function At(l, D, F, k, v, A) {
          if (!l) return b;
          var j = 1;
          if (D === a && (D = 6), k < 0 ? (j = 0, k = -k) : 15 < k && (j = 2, k -= 16), v < 1 || w < v || F !== x || k < 8 || 15 < k || D < 0 || 9 < D || A < 0 || p < A) return rt(l, b);
          k === 8 && (k = 9);
          var W = new bt();
          return (l.state = W).strm = l, W.wrap = j, W.gzhead = null, W.w_bits = k, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = v + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + E - 1) / E), W.window = new r.Buf8(2 * W.w_size), W.head = new r.Buf16(W.hash_size), W.prev = new r.Buf16(W.w_size), W.lit_bufsize = 1 << v + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new r.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = D, W.strategy = A, W.method = F, Rt(l);
        }
        i = [new ut(0, 0, 0, 0, function(l, D) {
          var F = 65535;
          for (F > l.pending_buf_size - 5 && (F = l.pending_buf_size - 5); ; ) {
            if (l.lookahead <= 1) {
              if (ft(l), l.lookahead === 0 && D === _) return u;
              if (l.lookahead === 0) break;
            }
            l.strstart += l.lookahead, l.lookahead = 0;
            var k = l.block_start + F;
            if ((l.strstart === 0 || l.strstart >= k) && (l.lookahead = l.strstart - k, l.strstart = k, T(l, !1), l.strm.avail_out === 0) || l.strstart - l.block_start >= l.w_size - q && (T(l, !1), l.strm.avail_out === 0)) return u;
          }
          return l.insert = 0, D === g ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : (l.strstart > l.block_start && (T(l, !1), l.strm.avail_out), u);
        }), new ut(4, 4, 8, 4, wt), new ut(4, 5, 16, 8, wt), new ut(4, 6, 32, 32, wt), new ut(4, 4, 16, 16, ct), new ut(8, 16, 32, 32, ct), new ut(8, 16, 128, 128, ct), new ut(8, 32, 128, 256, ct), new ut(32, 128, 258, 1024, ct), new ut(32, 258, 258, 4096, ct)], o.deflateInit = function(l, D) {
          return At(l, D, x, 15, 8, 0);
        }, o.deflateInit2 = At, o.deflateReset = Rt, o.deflateResetKeep = pt, o.deflateSetHeader = function(l, D) {
          return l && l.state ? l.state.wrap !== 2 ? b : (l.state.gzhead = D, f) : b;
        }, o.deflate = function(l, D) {
          var F, k, v, A;
          if (!l || !l.state || 5 < D || D < 0) return l ? rt(l, b) : b;
          if (k = l.state, !l.output || !l.input && l.avail_in !== 0 || k.status === 666 && D !== g) return rt(l, l.avail_out === 0 ? -5 : b);
          if (k.strm = l, F = k.last_flush, k.last_flush = D, k.status === M) if (k.wrap === 2) l.adler = 0, st(k, 31), st(k, 139), st(k, 8), k.gzhead ? (st(k, (k.gzhead.text ? 1 : 0) + (k.gzhead.hcrc ? 2 : 0) + (k.gzhead.extra ? 4 : 0) + (k.gzhead.name ? 8 : 0) + (k.gzhead.comment ? 16 : 0)), st(k, 255 & k.gzhead.time), st(k, k.gzhead.time >> 8 & 255), st(k, k.gzhead.time >> 16 & 255), st(k, k.gzhead.time >> 24 & 255), st(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), st(k, 255 & k.gzhead.os), k.gzhead.extra && k.gzhead.extra.length && (st(k, 255 & k.gzhead.extra.length), st(k, k.gzhead.extra.length >> 8 & 255)), k.gzhead.hcrc && (l.adler = m(l.adler, k.pending_buf, k.pending, 0)), k.gzindex = 0, k.status = 69) : (st(k, 0), st(k, 0), st(k, 0), st(k, 0), st(k, 0), st(k, k.level === 9 ? 2 : 2 <= k.strategy || k.level < 2 ? 4 : 0), st(k, 3), k.status = L);
          else {
            var j = x + (k.w_bits - 8 << 4) << 8;
            j |= (2 <= k.strategy || k.level < 2 ? 0 : k.level < 6 ? 1 : k.level === 6 ? 2 : 3) << 6, k.strstart !== 0 && (j |= 32), j += 31 - j % 31, k.status = L, Q(k, j), k.strstart !== 0 && (Q(k, l.adler >>> 16), Q(k, 65535 & l.adler)), l.adler = 1;
          }
          if (k.status === 69) if (k.gzhead.extra) {
            for (v = k.pending; k.gzindex < (65535 & k.gzhead.extra.length) && (k.pending !== k.pending_buf_size || (k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), O(l), v = k.pending, k.pending !== k.pending_buf_size)); ) st(k, 255 & k.gzhead.extra[k.gzindex]), k.gzindex++;
            k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), k.gzindex === k.gzhead.extra.length && (k.gzindex = 0, k.status = 73);
          } else k.status = 73;
          if (k.status === 73) if (k.gzhead.name) {
            v = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), O(l), v = k.pending, k.pending === k.pending_buf_size)) {
                A = 1;
                break;
              }
              A = k.gzindex < k.gzhead.name.length ? 255 & k.gzhead.name.charCodeAt(k.gzindex++) : 0, st(k, A);
            } while (A !== 0);
            k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), A === 0 && (k.gzindex = 0, k.status = 91);
          } else k.status = 91;
          if (k.status === 91) if (k.gzhead.comment) {
            v = k.pending;
            do {
              if (k.pending === k.pending_buf_size && (k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), O(l), v = k.pending, k.pending === k.pending_buf_size)) {
                A = 1;
                break;
              }
              A = k.gzindex < k.gzhead.comment.length ? 255 & k.gzhead.comment.charCodeAt(k.gzindex++) : 0, st(k, A);
            } while (A !== 0);
            k.gzhead.hcrc && k.pending > v && (l.adler = m(l.adler, k.pending_buf, k.pending - v, v)), A === 0 && (k.status = 103);
          } else k.status = 103;
          if (k.status === 103 && (k.gzhead.hcrc ? (k.pending + 2 > k.pending_buf_size && O(l), k.pending + 2 <= k.pending_buf_size && (st(k, 255 & l.adler), st(k, l.adler >> 8 & 255), l.adler = 0, k.status = L)) : k.status = L), k.pending !== 0) {
            if (O(l), l.avail_out === 0) return k.last_flush = -1, f;
          } else if (l.avail_in === 0 && Y(D) <= Y(F) && D !== g) return rt(l, -5);
          if (k.status === 666 && l.avail_in !== 0) return rt(l, -5);
          if (l.avail_in !== 0 || k.lookahead !== 0 || D !== _ && k.status !== 666) {
            var W = k.strategy === 2 ? (function(C, Z) {
              for (var tt; ; ) {
                if (C.lookahead === 0 && (ft(C), C.lookahead === 0)) {
                  if (Z === _) return u;
                  break;
                }
                if (C.match_length = 0, tt = s._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, tt && (T(C, !1), C.strm.avail_out === 0)) return u;
              }
              return C.insert = 0, Z === g ? (T(C, !0), C.strm.avail_out === 0 ? at : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? u : N;
            })(k, D) : k.strategy === 3 ? (function(C, Z) {
              for (var tt, V, nt, ht, dt = C.window; ; ) {
                if (C.lookahead <= $) {
                  if (ft(C), C.lookahead <= $ && Z === _) return u;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= E && 0 < C.strstart && (V = dt[nt = C.strstart - 1]) === dt[++nt] && V === dt[++nt] && V === dt[++nt]) {
                  ht = C.strstart + $;
                  do
                    ;
                  while (V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && V === dt[++nt] && nt < ht);
                  C.match_length = $ - (ht - nt), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= E ? (tt = s._tr_tally(C, 1, C.match_length - E), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (tt = s._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), tt && (T(C, !1), C.strm.avail_out === 0)) return u;
              }
              return C.insert = 0, Z === g ? (T(C, !0), C.strm.avail_out === 0 ? at : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? u : N;
            })(k, D) : i[k.level].func(k, D);
            if (W !== at && W !== X || (k.status = 666), W === u || W === at) return l.avail_out === 0 && (k.last_flush = -1), f;
            if (W === N && (D === 1 ? s._tr_align(k) : D !== 5 && (s._tr_stored_block(k, 0, 0, !1), D === 3 && (it(k.head), k.lookahead === 0 && (k.strstart = 0, k.block_start = 0, k.insert = 0))), O(l), l.avail_out === 0)) return k.last_flush = -1, f;
          }
          return D !== g ? f : k.wrap <= 0 ? 1 : (k.wrap === 2 ? (st(k, 255 & l.adler), st(k, l.adler >> 8 & 255), st(k, l.adler >> 16 & 255), st(k, l.adler >> 24 & 255), st(k, 255 & l.total_in), st(k, l.total_in >> 8 & 255), st(k, l.total_in >> 16 & 255), st(k, l.total_in >> 24 & 255)) : (Q(k, l.adler >>> 16), Q(k, 65535 & l.adler)), O(l), 0 < k.wrap && (k.wrap = -k.wrap), k.pending !== 0 ? f : 1);
        }, o.deflateEnd = function(l) {
          var D;
          return l && l.state ? (D = l.state.status) !== M && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== L && D !== 666 ? rt(l, b) : (l.state = null, D === L ? rt(l, -3) : f) : b;
        }, o.deflateSetDictionary = function(l, D) {
          var F, k, v, A, j, W, C, Z, tt = D.length;
          if (!l || !l.state || (A = (F = l.state).wrap) === 2 || A === 1 && F.status !== M || F.lookahead) return b;
          for (A === 1 && (l.adler = c(l.adler, D, tt, 0)), F.wrap = 0, tt >= F.w_size && (A === 0 && (it(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), Z = new r.Buf8(F.w_size), r.arraySet(Z, D, tt - F.w_size, F.w_size, 0), D = Z, tt = F.w_size), j = l.avail_in, W = l.next_in, C = l.input, l.avail_in = tt, l.next_in = 0, l.input = D, ft(F); F.lookahead >= E; ) {
            for (k = F.strstart, v = F.lookahead - (E - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[k + E - 1]) & F.hash_mask, F.prev[k & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = k, k++, --v; ) ;
            F.strstart = k, F.lookahead = E - 1, ft(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = E - 1, F.match_available = 0, l.next_in = W, l.input = C, l.avail_in = j, F.wrap = A, f;
        }, o.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, n, o) {
        n.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, n, o) {
        n.exports = function(i, r) {
          var s, c, m, y, _, g, f, b, a, p, h, x, w, I, R, P, B, U, E, $, q, M, L, u, N;
          s = i.state, c = i.next_in, u = i.input, m = c + (i.avail_in - 5), y = i.next_out, N = i.output, _ = y - (r - i.avail_out), g = y + (i.avail_out - 257), f = s.dmax, b = s.wsize, a = s.whave, p = s.wnext, h = s.window, x = s.hold, w = s.bits, I = s.lencode, R = s.distcode, P = (1 << s.lenbits) - 1, B = (1 << s.distbits) - 1;
          t: do {
            w < 15 && (x += u[c++] << w, w += 8, x += u[c++] << w, w += 8), U = I[x & P];
            e: for (; ; ) {
              if (x >>>= E = U >>> 24, w -= E, (E = U >>> 16 & 255) === 0) N[y++] = 65535 & U;
              else {
                if (!(16 & E)) {
                  if ((64 & E) == 0) {
                    U = I[(65535 & U) + (x & (1 << E) - 1)];
                    continue e;
                  }
                  if (32 & E) {
                    s.mode = 12;
                    break t;
                  }
                  i.msg = "invalid literal/length code", s.mode = 30;
                  break t;
                }
                $ = 65535 & U, (E &= 15) && (w < E && (x += u[c++] << w, w += 8), $ += x & (1 << E) - 1, x >>>= E, w -= E), w < 15 && (x += u[c++] << w, w += 8, x += u[c++] << w, w += 8), U = R[x & B];
                r: for (; ; ) {
                  if (x >>>= E = U >>> 24, w -= E, !(16 & (E = U >>> 16 & 255))) {
                    if ((64 & E) == 0) {
                      U = R[(65535 & U) + (x & (1 << E) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", s.mode = 30;
                    break t;
                  }
                  if (q = 65535 & U, w < (E &= 15) && (x += u[c++] << w, (w += 8) < E && (x += u[c++] << w, w += 8)), f < (q += x & (1 << E) - 1)) {
                    i.msg = "invalid distance too far back", s.mode = 30;
                    break t;
                  }
                  if (x >>>= E, w -= E, (E = y - _) < q) {
                    if (a < (E = q - E) && s.sane) {
                      i.msg = "invalid distance too far back", s.mode = 30;
                      break t;
                    }
                    if (L = h, (M = 0) === p) {
                      if (M += b - E, E < $) {
                        for ($ -= E; N[y++] = h[M++], --E; ) ;
                        M = y - q, L = N;
                      }
                    } else if (p < E) {
                      if (M += b + p - E, (E -= p) < $) {
                        for ($ -= E; N[y++] = h[M++], --E; ) ;
                        if (M = 0, p < $) {
                          for ($ -= E = p; N[y++] = h[M++], --E; ) ;
                          M = y - q, L = N;
                        }
                      }
                    } else if (M += p - E, E < $) {
                      for ($ -= E; N[y++] = h[M++], --E; ) ;
                      M = y - q, L = N;
                    }
                    for (; 2 < $; ) N[y++] = L[M++], N[y++] = L[M++], N[y++] = L[M++], $ -= 3;
                    $ && (N[y++] = L[M++], 1 < $ && (N[y++] = L[M++]));
                  } else {
                    for (M = y - q; N[y++] = N[M++], N[y++] = N[M++], N[y++] = N[M++], 2 < ($ -= 3); ) ;
                    $ && (N[y++] = N[M++], 1 < $ && (N[y++] = N[M++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < m && y < g);
          c -= $ = w >> 3, x &= (1 << (w -= $ << 3)) - 1, i.next_in = c, i.next_out = y, i.avail_in = c < m ? m - c + 5 : 5 - (c - m), i.avail_out = y < g ? g - y + 257 : 257 - (y - g), s.hold = x, s.bits = w;
        };
      }, {}], 49: [function(e, n, o) {
        var i = e("../utils/common"), r = e("./adler32"), s = e("./crc32"), c = e("./inffast"), m = e("./inftrees"), y = 1, _ = 2, g = 0, f = -2, b = 1, a = 852, p = 592;
        function h(M) {
          return (M >>> 24 & 255) + (M >>> 8 & 65280) + ((65280 & M) << 8) + ((255 & M) << 24);
        }
        function x() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function w(M) {
          var L;
          return M && M.state ? (L = M.state, M.total_in = M.total_out = L.total = 0, M.msg = "", L.wrap && (M.adler = 1 & L.wrap), L.mode = b, L.last = 0, L.havedict = 0, L.dmax = 32768, L.head = null, L.hold = 0, L.bits = 0, L.lencode = L.lendyn = new i.Buf32(a), L.distcode = L.distdyn = new i.Buf32(p), L.sane = 1, L.back = -1, g) : f;
        }
        function I(M) {
          var L;
          return M && M.state ? ((L = M.state).wsize = 0, L.whave = 0, L.wnext = 0, w(M)) : f;
        }
        function R(M, L) {
          var u, N;
          return M && M.state ? (N = M.state, L < 0 ? (u = 0, L = -L) : (u = 1 + (L >> 4), L < 48 && (L &= 15)), L && (L < 8 || 15 < L) ? f : (N.window !== null && N.wbits !== L && (N.window = null), N.wrap = u, N.wbits = L, I(M))) : f;
        }
        function P(M, L) {
          var u, N;
          return M ? (N = new x(), (M.state = N).window = null, (u = R(M, L)) !== g && (M.state = null), u) : f;
        }
        var B, U, E = !0;
        function $(M) {
          if (E) {
            var L;
            for (B = new i.Buf32(512), U = new i.Buf32(32), L = 0; L < 144; ) M.lens[L++] = 8;
            for (; L < 256; ) M.lens[L++] = 9;
            for (; L < 280; ) M.lens[L++] = 7;
            for (; L < 288; ) M.lens[L++] = 8;
            for (m(y, M.lens, 0, 288, B, 0, M.work, { bits: 9 }), L = 0; L < 32; ) M.lens[L++] = 5;
            m(_, M.lens, 0, 32, U, 0, M.work, { bits: 5 }), E = !1;
          }
          M.lencode = B, M.lenbits = 9, M.distcode = U, M.distbits = 5;
        }
        function q(M, L, u, N) {
          var at, X = M.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new i.Buf8(X.wsize)), N >= X.wsize ? (i.arraySet(X.window, L, u - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (N < (at = X.wsize - X.wnext) && (at = N), i.arraySet(X.window, L, u - N, at, X.wnext), (N -= at) ? (i.arraySet(X.window, L, u - N, N, 0), X.wnext = N, X.whave = X.wsize) : (X.wnext += at, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += at))), 0;
        }
        o.inflateReset = I, o.inflateReset2 = R, o.inflateResetKeep = w, o.inflateInit = function(M) {
          return P(M, 15);
        }, o.inflateInit2 = P, o.inflate = function(M, L) {
          var u, N, at, X, rt, Y, it, O, T, st, Q, H, ft, wt, ct, ut, bt, pt, Rt, At, l, D, F, k, v = 0, A = new i.Buf8(4), j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!M || !M.state || !M.output || !M.input && M.avail_in !== 0) return f;
          (u = M.state).mode === 12 && (u.mode = 13), rt = M.next_out, at = M.output, it = M.avail_out, X = M.next_in, N = M.input, Y = M.avail_in, O = u.hold, T = u.bits, st = Y, Q = it, D = g;
          t: for (; ; ) switch (u.mode) {
            case b:
              if (u.wrap === 0) {
                u.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if (2 & u.wrap && O === 35615) {
                A[u.check = 0] = 255 & O, A[1] = O >>> 8 & 255, u.check = s(u.check, A, 2, 0), T = O = 0, u.mode = 2;
                break;
              }
              if (u.flags = 0, u.head && (u.head.done = !1), !(1 & u.wrap) || (((255 & O) << 8) + (O >> 8)) % 31) {
                M.msg = "incorrect header check", u.mode = 30;
                break;
              }
              if ((15 & O) != 8) {
                M.msg = "unknown compression method", u.mode = 30;
                break;
              }
              if (T -= 4, l = 8 + (15 & (O >>>= 4)), u.wbits === 0) u.wbits = l;
              else if (l > u.wbits) {
                M.msg = "invalid window size", u.mode = 30;
                break;
              }
              u.dmax = 1 << l, M.adler = u.check = 1, u.mode = 512 & O ? 10 : 12, T = O = 0;
              break;
            case 2:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if (u.flags = O, (255 & u.flags) != 8) {
                M.msg = "unknown compression method", u.mode = 30;
                break;
              }
              if (57344 & u.flags) {
                M.msg = "unknown header flags set", u.mode = 30;
                break;
              }
              u.head && (u.head.text = O >> 8 & 1), 512 & u.flags && (A[0] = 255 & O, A[1] = O >>> 8 & 255, u.check = s(u.check, A, 2, 0)), T = O = 0, u.mode = 3;
            case 3:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              u.head && (u.head.time = O), 512 & u.flags && (A[0] = 255 & O, A[1] = O >>> 8 & 255, A[2] = O >>> 16 & 255, A[3] = O >>> 24 & 255, u.check = s(u.check, A, 4, 0)), T = O = 0, u.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              u.head && (u.head.xflags = 255 & O, u.head.os = O >> 8), 512 & u.flags && (A[0] = 255 & O, A[1] = O >>> 8 & 255, u.check = s(u.check, A, 2, 0)), T = O = 0, u.mode = 5;
            case 5:
              if (1024 & u.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                u.length = O, u.head && (u.head.extra_len = O), 512 & u.flags && (A[0] = 255 & O, A[1] = O >>> 8 & 255, u.check = s(u.check, A, 2, 0)), T = O = 0;
              } else u.head && (u.head.extra = null);
              u.mode = 6;
            case 6:
              if (1024 & u.flags && (Y < (H = u.length) && (H = Y), H && (u.head && (l = u.head.extra_len - u.length, u.head.extra || (u.head.extra = new Array(u.head.extra_len)), i.arraySet(u.head.extra, N, X, H, l)), 512 & u.flags && (u.check = s(u.check, N, H, X)), Y -= H, X += H, u.length -= H), u.length)) break t;
              u.length = 0, u.mode = 7;
            case 7:
              if (2048 & u.flags) {
                if (Y === 0) break t;
                for (H = 0; l = N[X + H++], u.head && l && u.length < 65536 && (u.head.name += String.fromCharCode(l)), l && H < Y; ) ;
                if (512 & u.flags && (u.check = s(u.check, N, H, X)), Y -= H, X += H, l) break t;
              } else u.head && (u.head.name = null);
              u.length = 0, u.mode = 8;
            case 8:
              if (4096 & u.flags) {
                if (Y === 0) break t;
                for (H = 0; l = N[X + H++], u.head && l && u.length < 65536 && (u.head.comment += String.fromCharCode(l)), l && H < Y; ) ;
                if (512 & u.flags && (u.check = s(u.check, N, H, X)), Y -= H, X += H, l) break t;
              } else u.head && (u.head.comment = null);
              u.mode = 9;
            case 9:
              if (512 & u.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                if (O !== (65535 & u.check)) {
                  M.msg = "header crc mismatch", u.mode = 30;
                  break;
                }
                T = O = 0;
              }
              u.head && (u.head.hcrc = u.flags >> 9 & 1, u.head.done = !0), M.adler = u.check = 0, u.mode = 12;
              break;
            case 10:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              M.adler = u.check = h(O), T = O = 0, u.mode = 11;
            case 11:
              if (u.havedict === 0) return M.next_out = rt, M.avail_out = it, M.next_in = X, M.avail_in = Y, u.hold = O, u.bits = T, 2;
              M.adler = u.check = 1, u.mode = 12;
            case 12:
              if (L === 5 || L === 6) break t;
            case 13:
              if (u.last) {
                O >>>= 7 & T, T -= 7 & T, u.mode = 27;
                break;
              }
              for (; T < 3; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              switch (u.last = 1 & O, T -= 1, 3 & (O >>>= 1)) {
                case 0:
                  u.mode = 14;
                  break;
                case 1:
                  if ($(u), u.mode = 20, L !== 6) break;
                  O >>>= 2, T -= 2;
                  break t;
                case 2:
                  u.mode = 17;
                  break;
                case 3:
                  M.msg = "invalid block type", u.mode = 30;
              }
              O >>>= 2, T -= 2;
              break;
            case 14:
              for (O >>>= 7 & T, T -= 7 & T; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if ((65535 & O) != (O >>> 16 ^ 65535)) {
                M.msg = "invalid stored block lengths", u.mode = 30;
                break;
              }
              if (u.length = 65535 & O, T = O = 0, u.mode = 15, L === 6) break t;
            case 15:
              u.mode = 16;
            case 16:
              if (H = u.length) {
                if (Y < H && (H = Y), it < H && (H = it), H === 0) break t;
                i.arraySet(at, N, X, H, rt), Y -= H, X += H, it -= H, rt += H, u.length -= H;
                break;
              }
              u.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if (u.nlen = 257 + (31 & O), O >>>= 5, T -= 5, u.ndist = 1 + (31 & O), O >>>= 5, T -= 5, u.ncode = 4 + (15 & O), O >>>= 4, T -= 4, 286 < u.nlen || 30 < u.ndist) {
                M.msg = "too many length or distance symbols", u.mode = 30;
                break;
              }
              u.have = 0, u.mode = 18;
            case 18:
              for (; u.have < u.ncode; ) {
                for (; T < 3; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                u.lens[j[u.have++]] = 7 & O, O >>>= 3, T -= 3;
              }
              for (; u.have < 19; ) u.lens[j[u.have++]] = 0;
              if (u.lencode = u.lendyn, u.lenbits = 7, F = { bits: u.lenbits }, D = m(0, u.lens, 0, 19, u.lencode, 0, u.work, F), u.lenbits = F.bits, D) {
                M.msg = "invalid code lengths set", u.mode = 30;
                break;
              }
              u.have = 0, u.mode = 19;
            case 19:
              for (; u.have < u.nlen + u.ndist; ) {
                for (; ut = (v = u.lencode[O & (1 << u.lenbits) - 1]) >>> 16 & 255, bt = 65535 & v, !((ct = v >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                if (bt < 16) O >>>= ct, T -= ct, u.lens[u.have++] = bt;
                else {
                  if (bt === 16) {
                    for (k = ct + 2; T < k; ) {
                      if (Y === 0) break t;
                      Y--, O += N[X++] << T, T += 8;
                    }
                    if (O >>>= ct, T -= ct, u.have === 0) {
                      M.msg = "invalid bit length repeat", u.mode = 30;
                      break;
                    }
                    l = u.lens[u.have - 1], H = 3 + (3 & O), O >>>= 2, T -= 2;
                  } else if (bt === 17) {
                    for (k = ct + 3; T < k; ) {
                      if (Y === 0) break t;
                      Y--, O += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 3 + (7 & (O >>>= ct)), O >>>= 3, T -= 3;
                  } else {
                    for (k = ct + 7; T < k; ) {
                      if (Y === 0) break t;
                      Y--, O += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 11 + (127 & (O >>>= ct)), O >>>= 7, T -= 7;
                  }
                  if (u.have + H > u.nlen + u.ndist) {
                    M.msg = "invalid bit length repeat", u.mode = 30;
                    break;
                  }
                  for (; H--; ) u.lens[u.have++] = l;
                }
              }
              if (u.mode === 30) break;
              if (u.lens[256] === 0) {
                M.msg = "invalid code -- missing end-of-block", u.mode = 30;
                break;
              }
              if (u.lenbits = 9, F = { bits: u.lenbits }, D = m(y, u.lens, 0, u.nlen, u.lencode, 0, u.work, F), u.lenbits = F.bits, D) {
                M.msg = "invalid literal/lengths set", u.mode = 30;
                break;
              }
              if (u.distbits = 6, u.distcode = u.distdyn, F = { bits: u.distbits }, D = m(_, u.lens, u.nlen, u.ndist, u.distcode, 0, u.work, F), u.distbits = F.bits, D) {
                M.msg = "invalid distances set", u.mode = 30;
                break;
              }
              if (u.mode = 20, L === 6) break t;
            case 20:
              u.mode = 21;
            case 21:
              if (6 <= Y && 258 <= it) {
                M.next_out = rt, M.avail_out = it, M.next_in = X, M.avail_in = Y, u.hold = O, u.bits = T, c(M, Q), rt = M.next_out, at = M.output, it = M.avail_out, X = M.next_in, N = M.input, Y = M.avail_in, O = u.hold, T = u.bits, u.mode === 12 && (u.back = -1);
                break;
              }
              for (u.back = 0; ut = (v = u.lencode[O & (1 << u.lenbits) - 1]) >>> 16 & 255, bt = 65535 & v, !((ct = v >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if (ut && (240 & ut) == 0) {
                for (pt = ct, Rt = ut, At = bt; ut = (v = u.lencode[At + ((O & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & v, !(pt + (ct = v >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                O >>>= pt, T -= pt, u.back += pt;
              }
              if (O >>>= ct, T -= ct, u.back += ct, u.length = bt, ut === 0) {
                u.mode = 26;
                break;
              }
              if (32 & ut) {
                u.back = -1, u.mode = 12;
                break;
              }
              if (64 & ut) {
                M.msg = "invalid literal/length code", u.mode = 30;
                break;
              }
              u.extra = 15 & ut, u.mode = 22;
            case 22:
              if (u.extra) {
                for (k = u.extra; T < k; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                u.length += O & (1 << u.extra) - 1, O >>>= u.extra, T -= u.extra, u.back += u.extra;
              }
              u.was = u.length, u.mode = 23;
            case 23:
              for (; ut = (v = u.distcode[O & (1 << u.distbits) - 1]) >>> 16 & 255, bt = 65535 & v, !((ct = v >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, O += N[X++] << T, T += 8;
              }
              if ((240 & ut) == 0) {
                for (pt = ct, Rt = ut, At = bt; ut = (v = u.distcode[At + ((O & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & v, !(pt + (ct = v >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                O >>>= pt, T -= pt, u.back += pt;
              }
              if (O >>>= ct, T -= ct, u.back += ct, 64 & ut) {
                M.msg = "invalid distance code", u.mode = 30;
                break;
              }
              u.offset = bt, u.extra = 15 & ut, u.mode = 24;
            case 24:
              if (u.extra) {
                for (k = u.extra; T < k; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                u.offset += O & (1 << u.extra) - 1, O >>>= u.extra, T -= u.extra, u.back += u.extra;
              }
              if (u.offset > u.dmax) {
                M.msg = "invalid distance too far back", u.mode = 30;
                break;
              }
              u.mode = 25;
            case 25:
              if (it === 0) break t;
              if (H = Q - it, u.offset > H) {
                if ((H = u.offset - H) > u.whave && u.sane) {
                  M.msg = "invalid distance too far back", u.mode = 30;
                  break;
                }
                ft = H > u.wnext ? (H -= u.wnext, u.wsize - H) : u.wnext - H, H > u.length && (H = u.length), wt = u.window;
              } else wt = at, ft = rt - u.offset, H = u.length;
              for (it < H && (H = it), it -= H, u.length -= H; at[rt++] = wt[ft++], --H; ) ;
              u.length === 0 && (u.mode = 21);
              break;
            case 26:
              if (it === 0) break t;
              at[rt++] = u.length, it--, u.mode = 21;
              break;
            case 27:
              if (u.wrap) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, O |= N[X++] << T, T += 8;
                }
                if (Q -= it, M.total_out += Q, u.total += Q, Q && (M.adler = u.check = u.flags ? s(u.check, at, Q, rt - Q) : r(u.check, at, Q, rt - Q)), Q = it, (u.flags ? O : h(O)) !== u.check) {
                  M.msg = "incorrect data check", u.mode = 30;
                  break;
                }
                T = O = 0;
              }
              u.mode = 28;
            case 28:
              if (u.wrap && u.flags) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, O += N[X++] << T, T += 8;
                }
                if (O !== (4294967295 & u.total)) {
                  M.msg = "incorrect length check", u.mode = 30;
                  break;
                }
                T = O = 0;
              }
              u.mode = 29;
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
              return f;
          }
          return M.next_out = rt, M.avail_out = it, M.next_in = X, M.avail_in = Y, u.hold = O, u.bits = T, (u.wsize || Q !== M.avail_out && u.mode < 30 && (u.mode < 27 || L !== 4)) && q(M, M.output, M.next_out, Q - M.avail_out) ? (u.mode = 31, -4) : (st -= M.avail_in, Q -= M.avail_out, M.total_in += st, M.total_out += Q, u.total += Q, u.wrap && Q && (M.adler = u.check = u.flags ? s(u.check, at, Q, M.next_out - Q) : r(u.check, at, Q, M.next_out - Q)), M.data_type = u.bits + (u.last ? 64 : 0) + (u.mode === 12 ? 128 : 0) + (u.mode === 20 || u.mode === 15 ? 256 : 0), (st == 0 && Q === 0 || L === 4) && D === g && (D = -5), D);
        }, o.inflateEnd = function(M) {
          if (!M || !M.state) return f;
          var L = M.state;
          return L.window && (L.window = null), M.state = null, g;
        }, o.inflateGetHeader = function(M, L) {
          var u;
          return M && M.state ? (2 & (u = M.state).wrap) == 0 ? f : ((u.head = L).done = !1, g) : f;
        }, o.inflateSetDictionary = function(M, L) {
          var u, N = L.length;
          return M && M.state ? (u = M.state).wrap !== 0 && u.mode !== 11 ? f : u.mode === 11 && r(1, L, N, 0) !== u.check ? -3 : q(M, L, N, N) ? (u.mode = 31, -4) : (u.havedict = 1, g) : f;
        }, o.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, n, o) {
        var i = e("../utils/common"), r = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], m = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        n.exports = function(y, _, g, f, b, a, p, h) {
          var x, w, I, R, P, B, U, E, $, q = h.bits, M = 0, L = 0, u = 0, N = 0, at = 0, X = 0, rt = 0, Y = 0, it = 0, O = 0, T = null, st = 0, Q = new i.Buf16(16), H = new i.Buf16(16), ft = null, wt = 0;
          for (M = 0; M <= 15; M++) Q[M] = 0;
          for (L = 0; L < f; L++) Q[_[g + L]]++;
          for (at = q, N = 15; 1 <= N && Q[N] === 0; N--) ;
          if (N < at && (at = N), N === 0) return b[a++] = 20971520, b[a++] = 20971520, h.bits = 1, 0;
          for (u = 1; u < N && Q[u] === 0; u++) ;
          for (at < u && (at = u), M = Y = 1; M <= 15; M++) if (Y <<= 1, (Y -= Q[M]) < 0) return -1;
          if (0 < Y && (y === 0 || N !== 1)) return -1;
          for (H[1] = 0, M = 1; M < 15; M++) H[M + 1] = H[M] + Q[M];
          for (L = 0; L < f; L++) _[g + L] !== 0 && (p[H[_[g + L]]++] = L);
          if (B = y === 0 ? (T = ft = p, 19) : y === 1 ? (T = r, st -= 257, ft = s, wt -= 257, 256) : (T = c, ft = m, -1), M = u, P = a, rt = L = O = 0, I = -1, R = (it = 1 << (X = at)) - 1, y === 1 && 852 < it || y === 2 && 592 < it) return 1;
          for (; ; ) {
            for (U = M - rt, $ = p[L] < B ? (E = 0, p[L]) : p[L] > B ? (E = ft[wt + p[L]], T[st + p[L]]) : (E = 96, 0), x = 1 << M - rt, u = w = 1 << X; b[P + (O >> rt) + (w -= x)] = U << 24 | E << 16 | $ | 0, w !== 0; ) ;
            for (x = 1 << M - 1; O & x; ) x >>= 1;
            if (x !== 0 ? (O &= x - 1, O += x) : O = 0, L++, --Q[M] == 0) {
              if (M === N) break;
              M = _[g + p[L]];
            }
            if (at < M && (O & R) !== I) {
              for (rt === 0 && (rt = at), P += u, Y = 1 << (X = M - rt); X + rt < N && !((Y -= Q[X + rt]) <= 0); ) X++, Y <<= 1;
              if (it += 1 << X, y === 1 && 852 < it || y === 2 && 592 < it) return 1;
              b[I = O & R] = at << 24 | X << 16 | P - a | 0;
            }
          }
          return O !== 0 && (b[P + O] = M - rt << 24 | 64 << 16 | 0), h.bits = at, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, n, o) {
        n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, n, o) {
        var i = e("../utils/common"), r = 0, s = 1;
        function c(v) {
          for (var A = v.length; 0 <= --A; ) v[A] = 0;
        }
        var m = 0, y = 29, _ = 256, g = _ + 1 + y, f = 30, b = 19, a = 2 * g + 1, p = 15, h = 16, x = 7, w = 256, I = 16, R = 17, P = 18, B = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], E = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], $ = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = new Array(2 * (g + 2));
        c(q);
        var M = new Array(2 * f);
        c(M);
        var L = new Array(512);
        c(L);
        var u = new Array(256);
        c(u);
        var N = new Array(y);
        c(N);
        var at, X, rt, Y = new Array(f);
        function it(v, A, j, W, C) {
          this.static_tree = v, this.extra_bits = A, this.extra_base = j, this.elems = W, this.max_length = C, this.has_stree = v && v.length;
        }
        function O(v, A) {
          this.dyn_tree = v, this.max_code = 0, this.stat_desc = A;
        }
        function T(v) {
          return v < 256 ? L[v] : L[256 + (v >>> 7)];
        }
        function st(v, A) {
          v.pending_buf[v.pending++] = 255 & A, v.pending_buf[v.pending++] = A >>> 8 & 255;
        }
        function Q(v, A, j) {
          v.bi_valid > h - j ? (v.bi_buf |= A << v.bi_valid & 65535, st(v, v.bi_buf), v.bi_buf = A >> h - v.bi_valid, v.bi_valid += j - h) : (v.bi_buf |= A << v.bi_valid & 65535, v.bi_valid += j);
        }
        function H(v, A, j) {
          Q(v, j[2 * A], j[2 * A + 1]);
        }
        function ft(v, A) {
          for (var j = 0; j |= 1 & v, v >>>= 1, j <<= 1, 0 < --A; ) ;
          return j >>> 1;
        }
        function wt(v, A, j) {
          var W, C, Z = new Array(p + 1), tt = 0;
          for (W = 1; W <= p; W++) Z[W] = tt = tt + j[W - 1] << 1;
          for (C = 0; C <= A; C++) {
            var V = v[2 * C + 1];
            V !== 0 && (v[2 * C] = ft(Z[V]++, V));
          }
        }
        function ct(v) {
          var A;
          for (A = 0; A < g; A++) v.dyn_ltree[2 * A] = 0;
          for (A = 0; A < f; A++) v.dyn_dtree[2 * A] = 0;
          for (A = 0; A < b; A++) v.bl_tree[2 * A] = 0;
          v.dyn_ltree[2 * w] = 1, v.opt_len = v.static_len = 0, v.last_lit = v.matches = 0;
        }
        function ut(v) {
          8 < v.bi_valid ? st(v, v.bi_buf) : 0 < v.bi_valid && (v.pending_buf[v.pending++] = v.bi_buf), v.bi_buf = 0, v.bi_valid = 0;
        }
        function bt(v, A, j, W) {
          var C = 2 * A, Z = 2 * j;
          return v[C] < v[Z] || v[C] === v[Z] && W[A] <= W[j];
        }
        function pt(v, A, j) {
          for (var W = v.heap[j], C = j << 1; C <= v.heap_len && (C < v.heap_len && bt(A, v.heap[C + 1], v.heap[C], v.depth) && C++, !bt(A, W, v.heap[C], v.depth)); ) v.heap[j] = v.heap[C], j = C, C <<= 1;
          v.heap[j] = W;
        }
        function Rt(v, A, j) {
          var W, C, Z, tt, V = 0;
          if (v.last_lit !== 0) for (; W = v.pending_buf[v.d_buf + 2 * V] << 8 | v.pending_buf[v.d_buf + 2 * V + 1], C = v.pending_buf[v.l_buf + V], V++, W === 0 ? H(v, C, A) : (H(v, (Z = u[C]) + _ + 1, A), (tt = B[Z]) !== 0 && Q(v, C -= N[Z], tt), H(v, Z = T(--W), j), (tt = U[Z]) !== 0 && Q(v, W -= Y[Z], tt)), V < v.last_lit; ) ;
          H(v, w, A);
        }
        function At(v, A) {
          var j, W, C, Z = A.dyn_tree, tt = A.stat_desc.static_tree, V = A.stat_desc.has_stree, nt = A.stat_desc.elems, ht = -1;
          for (v.heap_len = 0, v.heap_max = a, j = 0; j < nt; j++) Z[2 * j] !== 0 ? (v.heap[++v.heap_len] = ht = j, v.depth[j] = 0) : Z[2 * j + 1] = 0;
          for (; v.heap_len < 2; ) Z[2 * (C = v.heap[++v.heap_len] = ht < 2 ? ++ht : 0)] = 1, v.depth[C] = 0, v.opt_len--, V && (v.static_len -= tt[2 * C + 1]);
          for (A.max_code = ht, j = v.heap_len >> 1; 1 <= j; j--) pt(v, Z, j);
          for (C = nt; j = v.heap[1], v.heap[1] = v.heap[v.heap_len--], pt(v, Z, 1), W = v.heap[1], v.heap[--v.heap_max] = j, v.heap[--v.heap_max] = W, Z[2 * C] = Z[2 * j] + Z[2 * W], v.depth[C] = (v.depth[j] >= v.depth[W] ? v.depth[j] : v.depth[W]) + 1, Z[2 * j + 1] = Z[2 * W + 1] = C, v.heap[1] = C++, pt(v, Z, 1), 2 <= v.heap_len; ) ;
          v.heap[--v.heap_max] = v.heap[1], (function(dt, Et) {
            var jt, Ct, zt, mt, yt, Kt, Ot = Et.dyn_tree, Qt = Et.max_code, S = Et.stat_desc.static_tree, z = Et.stat_desc.has_stree, G = Et.stat_desc.extra_bits, K = Et.stat_desc.extra_base, J = Et.stat_desc.max_length, lt = 0;
            for (mt = 0; mt <= p; mt++) dt.bl_count[mt] = 0;
            for (Ot[2 * dt.heap[dt.heap_max] + 1] = 0, jt = dt.heap_max + 1; jt < a; jt++) J < (mt = Ot[2 * Ot[2 * (Ct = dt.heap[jt]) + 1] + 1] + 1) && (mt = J, lt++), Ot[2 * Ct + 1] = mt, Qt < Ct || (dt.bl_count[mt]++, yt = 0, K <= Ct && (yt = G[Ct - K]), Kt = Ot[2 * Ct], dt.opt_len += Kt * (mt + yt), z && (dt.static_len += Kt * (S[2 * Ct + 1] + yt)));
            if (lt !== 0) {
              do {
                for (mt = J - 1; dt.bl_count[mt] === 0; ) mt--;
                dt.bl_count[mt]--, dt.bl_count[mt + 1] += 2, dt.bl_count[J]--, lt -= 2;
              } while (0 < lt);
              for (mt = J; mt !== 0; mt--) for (Ct = dt.bl_count[mt]; Ct !== 0; ) Qt < (zt = dt.heap[--jt]) || (Ot[2 * zt + 1] !== mt && (dt.opt_len += (mt - Ot[2 * zt + 1]) * Ot[2 * zt], Ot[2 * zt + 1] = mt), Ct--);
            }
          })(v, A), wt(Z, ht, v.bl_count);
        }
        function l(v, A, j) {
          var W, C, Z = -1, tt = A[1], V = 0, nt = 7, ht = 4;
          for (tt === 0 && (nt = 138, ht = 3), A[2 * (j + 1) + 1] = 65535, W = 0; W <= j; W++) C = tt, tt = A[2 * (W + 1) + 1], ++V < nt && C === tt || (V < ht ? v.bl_tree[2 * C] += V : C !== 0 ? (C !== Z && v.bl_tree[2 * C]++, v.bl_tree[2 * I]++) : V <= 10 ? v.bl_tree[2 * R]++ : v.bl_tree[2 * P]++, Z = C, ht = (V = 0) === tt ? (nt = 138, 3) : C === tt ? (nt = 6, 3) : (nt = 7, 4));
        }
        function D(v, A, j) {
          var W, C, Z = -1, tt = A[1], V = 0, nt = 7, ht = 4;
          for (tt === 0 && (nt = 138, ht = 3), W = 0; W <= j; W++) if (C = tt, tt = A[2 * (W + 1) + 1], !(++V < nt && C === tt)) {
            if (V < ht) for (; H(v, C, v.bl_tree), --V != 0; ) ;
            else C !== 0 ? (C !== Z && (H(v, C, v.bl_tree), V--), H(v, I, v.bl_tree), Q(v, V - 3, 2)) : V <= 10 ? (H(v, R, v.bl_tree), Q(v, V - 3, 3)) : (H(v, P, v.bl_tree), Q(v, V - 11, 7));
            Z = C, ht = (V = 0) === tt ? (nt = 138, 3) : C === tt ? (nt = 6, 3) : (nt = 7, 4);
          }
        }
        c(Y);
        var F = !1;
        function k(v, A, j, W) {
          Q(v, (m << 1) + (W ? 1 : 0), 3), (function(C, Z, tt, V) {
            ut(C), st(C, tt), st(C, ~tt), i.arraySet(C.pending_buf, C.window, Z, tt, C.pending), C.pending += tt;
          })(v, A, j);
        }
        o._tr_init = function(v) {
          F || ((function() {
            var A, j, W, C, Z, tt = new Array(p + 1);
            for (C = W = 0; C < y - 1; C++) for (N[C] = W, A = 0; A < 1 << B[C]; A++) u[W++] = C;
            for (u[W - 1] = C, C = Z = 0; C < 16; C++) for (Y[C] = Z, A = 0; A < 1 << U[C]; A++) L[Z++] = C;
            for (Z >>= 7; C < f; C++) for (Y[C] = Z << 7, A = 0; A < 1 << U[C] - 7; A++) L[256 + Z++] = C;
            for (j = 0; j <= p; j++) tt[j] = 0;
            for (A = 0; A <= 143; ) q[2 * A + 1] = 8, A++, tt[8]++;
            for (; A <= 255; ) q[2 * A + 1] = 9, A++, tt[9]++;
            for (; A <= 279; ) q[2 * A + 1] = 7, A++, tt[7]++;
            for (; A <= 287; ) q[2 * A + 1] = 8, A++, tt[8]++;
            for (wt(q, g + 1, tt), A = 0; A < f; A++) M[2 * A + 1] = 5, M[2 * A] = ft(A, 5);
            at = new it(q, B, _ + 1, g, p), X = new it(M, U, 0, f, p), rt = new it(new Array(0), E, 0, b, x);
          })(), F = !0), v.l_desc = new O(v.dyn_ltree, at), v.d_desc = new O(v.dyn_dtree, X), v.bl_desc = new O(v.bl_tree, rt), v.bi_buf = 0, v.bi_valid = 0, ct(v);
        }, o._tr_stored_block = k, o._tr_flush_block = function(v, A, j, W) {
          var C, Z, tt = 0;
          0 < v.level ? (v.strm.data_type === 2 && (v.strm.data_type = (function(V) {
            var nt, ht = 4093624447;
            for (nt = 0; nt <= 31; nt++, ht >>>= 1) if (1 & ht && V.dyn_ltree[2 * nt] !== 0) return r;
            if (V.dyn_ltree[18] !== 0 || V.dyn_ltree[20] !== 0 || V.dyn_ltree[26] !== 0) return s;
            for (nt = 32; nt < _; nt++) if (V.dyn_ltree[2 * nt] !== 0) return s;
            return r;
          })(v)), At(v, v.l_desc), At(v, v.d_desc), tt = (function(V) {
            var nt;
            for (l(V, V.dyn_ltree, V.l_desc.max_code), l(V, V.dyn_dtree, V.d_desc.max_code), At(V, V.bl_desc), nt = b - 1; 3 <= nt && V.bl_tree[2 * $[nt] + 1] === 0; nt--) ;
            return V.opt_len += 3 * (nt + 1) + 5 + 5 + 4, nt;
          })(v), C = v.opt_len + 3 + 7 >>> 3, (Z = v.static_len + 3 + 7 >>> 3) <= C && (C = Z)) : C = Z = j + 5, j + 4 <= C && A !== -1 ? k(v, A, j, W) : v.strategy === 4 || Z === C ? (Q(v, 2 + (W ? 1 : 0), 3), Rt(v, q, M)) : (Q(v, 4 + (W ? 1 : 0), 3), (function(V, nt, ht, dt) {
            var Et;
            for (Q(V, nt - 257, 5), Q(V, ht - 1, 5), Q(V, dt - 4, 4), Et = 0; Et < dt; Et++) Q(V, V.bl_tree[2 * $[Et] + 1], 3);
            D(V, V.dyn_ltree, nt - 1), D(V, V.dyn_dtree, ht - 1);
          })(v, v.l_desc.max_code + 1, v.d_desc.max_code + 1, tt + 1), Rt(v, v.dyn_ltree, v.dyn_dtree)), ct(v), W && ut(v);
        }, o._tr_tally = function(v, A, j) {
          return v.pending_buf[v.d_buf + 2 * v.last_lit] = A >>> 8 & 255, v.pending_buf[v.d_buf + 2 * v.last_lit + 1] = 255 & A, v.pending_buf[v.l_buf + v.last_lit] = 255 & j, v.last_lit++, A === 0 ? v.dyn_ltree[2 * j]++ : (v.matches++, A--, v.dyn_ltree[2 * (u[j] + _ + 1)]++, v.dyn_dtree[2 * T(A)]++), v.last_lit === v.lit_bufsize - 1;
        }, o._tr_align = function(v) {
          Q(v, 2, 3), H(v, w, q), (function(A) {
            A.bi_valid === 16 ? (st(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(v);
        };
      }, { "../utils/common": 41 }], 53: [function(e, n, o) {
        n.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, n, o) {
        (function(i) {
          (function(r, s) {
            if (!r.setImmediate) {
              var c, m, y, _, g = 1, f = {}, b = !1, a = r.document, p = Object.getPrototypeOf && Object.getPrototypeOf(r);
              p = p && p.setTimeout ? p : r, c = {}.toString.call(r.process) === "[object process]" ? function(I) {
                process.nextTick(function() {
                  x(I);
                });
              } : (function() {
                if (r.postMessage && !r.importScripts) {
                  var I = !0, R = r.onmessage;
                  return r.onmessage = function() {
                    I = !1;
                  }, r.postMessage("", "*"), r.onmessage = R, I;
                }
              })() ? (_ = "setImmediate$" + Math.random() + "$", r.addEventListener ? r.addEventListener("message", w, !1) : r.attachEvent("onmessage", w), function(I) {
                r.postMessage(_ + I, "*");
              }) : r.MessageChannel ? ((y = new MessageChannel()).port1.onmessage = function(I) {
                x(I.data);
              }, function(I) {
                y.port2.postMessage(I);
              }) : a && "onreadystatechange" in a.createElement("script") ? (m = a.documentElement, function(I) {
                var R = a.createElement("script");
                R.onreadystatechange = function() {
                  x(I), R.onreadystatechange = null, m.removeChild(R), R = null;
                }, m.appendChild(R);
              }) : function(I) {
                setTimeout(x, 0, I);
              }, p.setImmediate = function(I) {
                typeof I != "function" && (I = new Function("" + I));
                for (var R = new Array(arguments.length - 1), P = 0; P < R.length; P++) R[P] = arguments[P + 1];
                var B = { callback: I, args: R };
                return f[g] = B, c(g), g++;
              }, p.clearImmediate = h;
            }
            function h(I) {
              delete f[I];
            }
            function x(I) {
              if (b) setTimeout(x, 0, I);
              else {
                var R = f[I];
                if (R) {
                  b = !0;
                  try {
                    (function(P) {
                      var B = P.callback, U = P.args;
                      switch (U.length) {
                        case 0:
                          B();
                          break;
                        case 1:
                          B(U[0]);
                          break;
                        case 2:
                          B(U[0], U[1]);
                          break;
                        case 3:
                          B(U[0], U[1], U[2]);
                          break;
                        default:
                          B.apply(s, U);
                      }
                    })(R);
                  } finally {
                    h(I), b = !1;
                  }
                }
              }
            }
            function w(I) {
              I.source === r && typeof I.data == "string" && I.data.indexOf(_) === 0 && x(+I.data.slice(_.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof ce < "u" ? ce : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(me)), me.exports;
}
var Ge = Ze();
const Fe = /* @__PURE__ */ Ye(Ge);
async function qe(d) {
  const t = await Ve(d), e = await Fe.loadAsync(t), n = [];
  return e.forEach((o, i) => {
    if (i.dir)
      return;
    const r = He(o);
    n.push({
      name: r,
      text: () => i.async("text"),
      arrayBuffer: () => i.async("arraybuffer")
    });
  }), n;
}
async function Ve(d) {
  if (d instanceof ArrayBuffer)
    return d;
  if (d instanceof Blob)
    return await d.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function He(d) {
  let t = d.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Ke(d) {
  return !!d && typeof d == "object" && !(d instanceof ArrayBuffer) && !(d instanceof Uint8Array);
}
function Je(d) {
  return d instanceof Uint8Array ? d : new Uint8Array(d);
}
function Qe(d) {
  return d.byteOffset === 0 && d.byteLength === d.buffer.byteLength ? d.buffer : d.slice().buffer;
}
function te(d, t, e = 0) {
  if (d.length < e + t.length) return !1;
  for (let n = 0; n < t.length; n++)
    if (d[e + n] !== t[n]) return !1;
  return !0;
}
function tr(d) {
  return te(d, [80, 75, 3, 4]) || te(d, [80, 75, 5, 6]) || te(d, [80, 75, 7, 8]) ? "zip" : te(d, [82, 97, 114, 33, 26, 7, 0]) || te(d, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : te(d, [55, 122, 188, 175, 39, 28]) ? "7z" : d.length > 262 && te(d, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Le(d) {
  return d.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function ke(d) {
  const t = [], e = d.map((a) => Le(a).toLowerCase()), n = (a) => e.some(a), o = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, i = /\.(drl|xln)$/i, r = e.filter((a) => o.test(a)).length, s = e.filter((a) => i.test(a) || a.includes("drill")).length, c = n((a) => a.includes("top") && a.includes("copper") || a.endsWith(".gtl")), m = n((a) => a.includes("bot") || a.includes("bottom") || a.endsWith(".gbl")), y = n((a) => a.includes("mask") || a.includes("solder") || a.endsWith(".gts") || a.endsWith(".gbs")), _ = n((a) => a.includes("silk") || a.includes("legend") || a.endsWith(".gto") || a.endsWith(".gbo")), g = n((a) => a.includes("outline") || a.includes("profile") || a.includes("edge") || a.endsWith(".gko") || a.endsWith(".gm1") || a.endsWith(".gml")), f = e.every(
    (a) => a.endsWith(".pdf") || a.endsWith(".png") || a.endsWith(".jpg") || a.endsWith(".jpeg") || a.endsWith(".svg") || a.endsWith(".txt") || a.endsWith(".md")
  );
  let b = 0;
  return d.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : f ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (r > 0 ? (b += 0.35, t.push(`Found ${r} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), s > 0 && (b += 0.2, t.push(`Found ${s} drill-like file(s).`)), g && (b += 0.15, t.push("Found outline/profile/edge candidate.")), c && m ? (b += 0.2, t.push("Found both top and bottom copper candidates.")) : (c || m) && (b += 0.1, t.push("Found at least one copper candidate.")), y && (b += 0.05, t.push("Found solder mask candidate.")), _ && (b += 0.05, t.push("Found silkscreen/legend candidate.")), b = Math.max(0, Math.min(1, b)), b < 0.6 && r >= 2 && (b = Math.max(b, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: b, reasons: t });
}
async function er(d) {
  if (Ke(d)) {
    const i = Object.keys(d).map(Le), { confidence: r, reasons: s } = ke(i);
    return {
      isGerber: r >= 0.6,
      archiveType: "directory",
      confidence: r,
      reasons: s,
      files: i
    };
  }
  const t = Je(d), e = tr(t);
  if (e === "zip")
    try {
      const i = Qe(t), s = (await qe(i)).map((y) => y.name), { confidence: c, reasons: m } = ke(s);
      return {
        isGerber: c >= 0.6,
        archiveType: "zip",
        confidence: c,
        reasons: m,
        files: s
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
  const n = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return n.includes("%FSLAX") || n.includes("%MOIN") || n.includes("%MOMM") || n.includes("G04") || n.includes("%ADD") ? {
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
class Mt extends Error {
  constructor(t, e, n) {
    super(e), this.name = "GerberError", this.code = t, this.details = n;
  }
}
function Ne(d) {
  let t = d.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function rr(d) {
  return d instanceof Uint8Array ? d : new Uint8Array(d);
}
function $e(d) {
  try {
    return d.slice().buffer;
  } catch {
    const t = new Uint8Array(d.byteLength);
    return t.set(d), t.buffer;
  }
}
async function nr(d) {
  let t;
  try {
    t = await Fe.loadAsync($e(d));
  } catch (s) {
    throw new Mt(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      s
    );
  }
  const e = {}, n = 1e3, o = 100 * 1024 * 1024, i = Object.entries(t.files).filter(([, s]) => s && !s.dir);
  if (i.length > n)
    throw new Mt(
      "PARSE_ERROR",
      `ZIP contains too many files (${i.length} > ${n})`
    );
  let r = 0;
  for (const [s, c] of i)
    try {
      const m = Ne(s), y = await c.async("arraybuffer");
      if (r += y.byteLength, r > o)
        throw new Mt(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${o} bytes)`
        );
      e[m] = new Uint8Array(y);
    } catch (m) {
      if (m instanceof Mt) throw m;
      console.warn(`Failed to extract file ${s}:`, m);
    }
  if (Object.keys(e).length === 0)
    throw new Mt("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function ir(d, t) {
  let e;
  try {
    const _ = await import("./libarchive-Bt1VdZR0.js");
    e = _.Archive ?? _.default?.Archive;
  } catch (_) {
    throw new Mt(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      _
    );
  }
  if (!e)
    throw new Mt("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (_) {
      throw new Mt(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        _
      );
    }
  let n;
  try {
    const _ = new Blob([$e(d)], { type: "application/octet-stream" });
    n = await e.open(_);
  } catch (_) {
    throw new Mt("NOT_AN_ARCHIVE", "Failed to open RAR archive", _);
  }
  let o;
  try {
    o = await Promise.race([
      n.extractFiles(),
      new Promise(
        (_, g) => setTimeout(() => g(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (_) {
    throw new Mt("PARSE_ERROR", "Failed to extract RAR archive", _);
  }
  const i = {};
  let r = 0;
  const s = 1e3, c = 100 * 1024 * 1024;
  let m = 0;
  async function y(_, g) {
    if (r >= s)
      throw new Mt(
        "PARSE_ERROR",
        `Archive contains too many files (max ${s})`
      );
    for (const f of Object.keys(_)) {
      const b = _[f], a = g ? `${g}/${f}` : f;
      if (b instanceof File || b instanceof Blob) {
        r++;
        try {
          const p = await b.arrayBuffer();
          if (m += p.byteLength, m > c)
            throw new Mt(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${c} bytes)`
            );
          i[Ne(a)] = new Uint8Array(p);
        } catch (p) {
          if (p instanceof Mt) throw p;
          console.warn(`Failed to extract file ${a}:`, p);
        }
      } else b && typeof b == "object" && await y(b, a);
    }
  }
  try {
    await y(o, "");
  } finally {
    if (n && typeof n.close == "function")
      try {
        await n.close();
      } catch (_) {
        console.warn("Failed to close archive:", _);
      }
  }
  if (Object.keys(i).length === 0)
    throw new Mt("PARSE_ERROR", "No files extracted from RAR archive");
  return i;
}
async function he(d, t) {
  if (!d || d.byteLength === 0)
    throw new Mt("NOT_AN_ARCHIVE", "Input is empty");
  const e = rr(d), n = 100 * 1024 * 1024;
  if (e.length > n)
    throw new Mt(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${n} bytes)`
    );
  let o;
  try {
    o = await er(e);
  } catch (i) {
    throw new Mt("PARSE_ERROR", "Failed to detect archive type", i);
  }
  if (!o.isGerber && o.archiveType !== "rar")
    throw new Mt(
      "NOT_GERBER",
      o.reasons.join("; ") || "Not a Gerber bundle",
      o
    );
  try {
    if (o.archiveType === "zip")
      return { archiveType: "zip", files: await nr(e) };
    if (o.archiveType === "rar")
      return { archiveType: "rar", files: await ir(e, t) };
    if (o.archiveType === "single-file")
      return { archiveType: "single-file", files: { "layer.gtl": e } };
    throw new Mt(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${o.archiveType}`,
      o
    );
  } catch (i) {
    throw i instanceof Mt ? i : new Mt(
      "PARSE_ERROR",
      i instanceof Error ? i.message : "Unknown error during extraction",
      { error: i, det: o }
    );
  }
}
function ne(d) {
  return d.toLowerCase();
}
function Vt(d, t) {
  const e = new Set(t.map((o) => o.toLowerCase()));
  return d.filter((o) => {
    const i = ne(o), r = i.lastIndexOf(".");
    return r < 0 ? !1 : e.has(i.slice(r));
  }).sort((o, i) => o.length - i.length)[0];
}
function vt(d, t) {
  const e = t.map((o) => o.toLowerCase());
  return d.filter((o) => {
    const i = ne(o);
    return e.every((r) => i.includes(r));
  }).sort((o, i) => o.length - i.length)[0];
}
function sr(d, t, e) {
  const n = new Set([t, e].filter(Boolean)), o = [];
  for (const i of d) {
    if (n.has(i)) continue;
    const r = ne(i), s = r.split("/").pop() || r, c = s.lastIndexOf("."), m = c >= 0 ? s.slice(c) : "";
    let y = /in(\d+)_cu/.exec(s);
    if (y) {
      o.push({ path: i, num: parseInt(y[1], 10) });
      continue;
    }
    if (y = /(?:inner|signal|layer)[ _-]?(\d+)/.exec(s), y) {
      o.push({ path: i, num: parseInt(y[1], 10) });
      continue;
    }
    if (y = /^\.gl?(\d+)$/.exec(m), y) {
      const _ = parseInt(y[1], 10);
      !Number.isNaN(_) && _ >= 2 && o.push({ path: i, num: _ });
      continue;
    }
  }
  return o.sort((i, r) => i.num - r.num), o;
}
function or(d, t, e) {
  const n = new Set([t, e].filter(Boolean)), o = [];
  for (const i of d) {
    if (n.has(i)) continue;
    const r = ne(i), s = r.split("/").pop() || r, c = s.lastIndexOf("."), m = c >= 0 ? s.slice(c) : "";
    if (/in\d+_cu/.test(s)) {
      o.push(i);
      continue;
    }
    if (/^\.gl?\d+$/.test(m)) {
      const y = parseInt(m.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(y) && y >= 2) {
        o.push(i);
        continue;
      }
    }
  }
  return o.sort(), o;
}
function ar(d) {
  const t = [], e = (n) => ne(n);
  for (const n of d) {
    const o = e(n), i = o.split("/").pop() || o, r = i.slice(i.lastIndexOf("."));
    if (r === ".drl" || r === ".xln" || r === ".exc" || r === ".ncd") {
      t.push(n);
      continue;
    }
    if (r === ".txt" && (i.includes("hole") || i.includes("drill") || i.includes("npth") || i.includes("-pth"))) {
      t.push(n);
      continue;
    }
    if ((i.includes("drill") || i.includes("npth") || i.includes("-pth")) && (r === ".gbr" || r === ".ger" || r === ".txt" || r === "")) {
      t.push(n);
      continue;
    }
  }
  return t;
}
function lr(d) {
  const t = d.filter((_) => {
    const g = ne(_);
    return !(g.endsWith("/") || g.includes("__macosx") || g.endsWith(".ds_store"));
  }), e = Vt(t, [".gtl"]) || vt(t, ["f_cu"]) || vt(t, ["top", "cu"]) || vt(t, ["top", "copper"]), n = Vt(t, [".gbl"]) || vt(t, ["b_cu"]) || vt(t, ["bottom", "cu"]) || vt(t, ["bottom", "copper"]), o = Vt(t, [".gts"]) || vt(t, ["f_mask"]) || vt(t, ["top", "mask"]), i = Vt(t, [".gbs"]) || vt(t, ["b_mask"]) || vt(t, ["bottom", "mask"]), r = Vt(t, [".gto"]) || vt(t, ["f_silks"]) || vt(t, ["f_silk"]) || vt(t, ["top", "silk"]), s = Vt(t, [".gbo"]) || vt(t, ["b_silks"]) || vt(t, ["b_silk"]) || vt(t, ["bottom", "silk"]), c = Vt(t, [".gko", ".gm1"]) || vt(t, ["edge", "cuts"]) || vt(t, ["outline"]) || vt(t, ["board", "outline"]), m = ar(t), y = or(t, e, n);
  return {
    top_copper: e,
    bottom_copper: n,
    top_mask: o,
    bottom_mask: i,
    top_silk: r,
    bottom_silk: s,
    outline: c,
    drills: m.length ? m : void 0,
    inner_copper: y.length ? y : void 0
  };
}
function cr(d) {
  const t = d.filter((s) => {
    const c = ne(s);
    return !(c.endsWith("/") || c.includes("__macosx") || c.endsWith(".ds_store"));
  }), e = lr(t), n = Vt(t, [".gtp"]) || vt(t, ["f_paste"]) || vt(t, ["top", "paste"]), o = Vt(t, [".gbp"]) || vt(t, ["b_paste"]) || vt(t, ["bottom", "paste"]), i = sr(t, e.top_copper, e.bottom_copper), r = [];
  e.top_copper && r.push({ path: e.top_copper, role: "top", index: 0 });
  for (const s of i) r.push({ path: s.path, role: "inner", index: 0, detectedNum: s.num });
  return e.bottom_copper && r.push({ path: e.bottom_copper, role: "bottom", index: 0 }), r.forEach((s, c) => {
    s.index = c;
  }), {
    copper: r,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    top_paste: n,
    bottom_paste: o,
    outline: e.outline,
    drills: e.drills
  };
}
const Me = 32;
function dr(d) {
  const t = d.split("*").map((o) => o.trim()).filter(Boolean);
  if (!t.length || !t[0].startsWith("AM")) return null;
  const e = t[0].slice(2).trim();
  if (!e) return null;
  const n = [];
  for (const o of t.slice(1)) {
    const i = /^\$(\d+)\s*=\s*(.+)$/.exec(o);
    if (i) {
      n.push({ kind: "assign", varIndex: parseInt(i[1], 10), expr: i[2] });
      continue;
    }
    const r = o.split(",").map((c) => c.trim()), s = parseInt(r[0], 10);
    !Number.isFinite(s) || s === 0 || n.push({ kind: "primitive", code: s, args: r.slice(1) });
  }
  return { name: e, statements: n };
}
function ur(d, t, e) {
  const n = /* @__PURE__ */ new Map();
  t.forEach((i, r) => n.set(r + 1, i));
  const o = [];
  for (const i of d) {
    if (i.kind === "assign") {
      n.set(i.varIndex, Se(i.expr, n));
      continue;
    }
    const r = i.args.map((c) => Se(c, n)), s = e;
    switch (i.code) {
      case 1: {
        if (!r[0]) break;
        const c = r[1] * s / 2, m = { x: r[2] * s, y: r[3] * s };
        o.push(re(hr(m, c), r[4] ?? 0));
        break;
      }
      case 2:
      case 20: {
        if (!r[0]) break;
        const c = r[1] * s, m = { x: r[2] * s, y: r[3] * s }, y = { x: r[4] * s, y: r[5] * s };
        o.push(re(fr(m, y, c), r[6] ?? 0));
        break;
      }
      case 21: {
        if (!r[0]) break;
        const c = r[1] * s / 2, m = r[2] * s / 2, y = r[3] * s, _ = r[4] * s, g = [
          { x: y - c, y: _ - m },
          { x: y + c, y: _ - m },
          { x: y + c, y: _ + m },
          { x: y - c, y: _ + m }
        ];
        o.push(re(g, r[5] ?? 0));
        break;
      }
      case 4: {
        if (!r[0]) break;
        const c = Math.round(r[1]), m = [];
        for (let _ = 0; _ <= c; _++) {
          const g = r[2 + _ * 2], f = r[3 + _ * 2];
          if (g === void 0 || f === void 0) break;
          m.push({ x: g * s, y: f * s });
        }
        const y = r[2 + (c + 1) * 2] ?? 0;
        m.length >= 3 && o.push(re(m, y));
        break;
      }
      case 5: {
        if (!r[0]) break;
        const c = Math.max(3, Math.round(r[1])), m = { x: r[2] * s, y: r[3] * s }, y = r[4] * s / 2, _ = [];
        for (let g = 0; g < c; g++) {
          const f = 2 * Math.PI * g / c;
          _.push({ x: m.x + y * Math.cos(f), y: m.y + y * Math.sin(f) });
        }
        o.push(re(_, r[5] ?? 0));
        break;
      }
      case 7: {
        const c = { x: r[0] * s, y: r[1] * s }, m = r[2] * s / 2, y = r[3] * s / 2, _ = r[4] * s / 2;
        for (const g of mr(c, m, y, _)) o.push(re(g, r[5] ?? 0));
        break;
      }
    }
  }
  return o;
}
function re(d, t) {
  if (!t) return d;
  const e = t * Math.PI / 180, n = Math.cos(e), o = Math.sin(e);
  return d.map((i) => ({ x: i.x * n - i.y * o, y: i.x * o + i.y * n }));
}
function hr(d, t) {
  const e = [];
  for (let n = 0; n < Me; n++) {
    const o = 2 * Math.PI * n / Me;
    e.push({ x: d.x + t * Math.cos(o), y: d.y + t * Math.sin(o) });
  }
  return e;
}
function fr(d, t, e) {
  const n = t.x - d.x, o = t.y - d.y, i = Math.hypot(n, o), r = i > 0 ? -o / i * (e / 2) : e / 2, s = i > 0 ? n / i * (e / 2) : 0;
  return [
    { x: d.x + r, y: d.y + s },
    { x: t.x + r, y: t.y + s },
    { x: t.x - r, y: t.y - s },
    { x: d.x - r, y: d.y - s }
  ];
}
function mr(d, t, e, n) {
  if (t <= 0 || n >= t) return [];
  const o = [], i = 8;
  for (let r = 0; r < 4; r++) {
    const s = r * Math.PI / 2, c = Math.asin(Math.min(1, n / t)), m = [];
    for (let y = 0; y <= i; y++) {
      const _ = s + c + (Math.PI / 2 - 2 * c) * y / i;
      m.push({ x: d.x + t * Math.cos(_), y: d.y + t * Math.sin(_) });
    }
    if (e > n) {
      const y = Math.asin(n / e);
      for (let _ = i; _ >= 0; _--) {
        const g = s + y + (Math.PI / 2 - 2 * y) * _ / i;
        m.push({ x: d.x + e * Math.cos(g), y: d.y + e * Math.sin(g) });
      }
    } else {
      const y = s + Math.PI / 4, _ = n * Math.SQRT2;
      m.push({ x: d.x + _ * Math.cos(y), y: d.y + _ * Math.sin(y) });
    }
    o.push(m);
  }
  return o;
}
function Se(d, t) {
  const e = d.replace(/\s+/g, "");
  let n = 0;
  const o = () => {
    let c = i();
    for (; n < e.length && (e[n] === "+" || e[n] === "-"); ) {
      const m = e[n++], y = i();
      c = m === "+" ? c + y : c - y;
    }
    return c;
  }, i = () => {
    let c = r();
    for (; n < e.length && (e[n] === "x" || e[n] === "X" || e[n] === "/"); ) {
      const m = e[n++], y = r();
      c = m === "/" ? c / y : c * y;
    }
    return c;
  }, r = () => {
    const c = e[n];
    if (c === "+")
      return n++, r();
    if (c === "-")
      return n++, -r();
    if (c === "(") {
      n++;
      const y = o();
      return e[n] === ")" && n++, y;
    }
    if (c === "$") {
      n++;
      const y = /^\d+/.exec(e.slice(n));
      return y ? (n += y[0].length, t.get(parseInt(y[0], 10)) ?? 0) : 0;
    }
    const m = /^\d*\.?\d+(?:[eE][+-]?\d+)?|^\d+\./.exec(e.slice(n));
    return m ? (n += m[0].length, parseFloat(m[0])) : (n = e.length, 0);
  }, s = o();
  return Number.isFinite(s) ? s : 0;
}
const pr = 0.8;
function Zt(d, t, e) {
  const n = {
    unitScale: 1,
    fmtInt: 2,
    fmtDec: 4,
    x: 0,
    y: 0,
    apertures: /* @__PURE__ */ new Map(),
    currentAperture: null,
    macros: /* @__PURE__ */ new Map(),
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
  }, o = t.split(/\r?\n/);
  let i = null;
  for (const r of o) {
    let s = r.trim();
    if (s) {
      if (i !== null) {
        i += s, s.endsWith("%") && (Ie(i, n), i = null);
        continue;
      }
      if (!s.startsWith("G04")) {
        if (s.startsWith("%")) {
          s.length > 1 && s.endsWith("%") ? Ie(s, n) : i = s;
          continue;
        }
        s.endsWith("*") && (s = s.slice(0, -1)), yr(s, n);
      }
    }
  }
  if (n.inRegion) {
    if (n.currentPath.length >= 3 && n.regionPaths.push(n.currentPath), n.regionPaths.length > 0) {
      const r = {
        loops: n.regionPaths,
        polarity: n.currentPolarity
      };
      n.regions.push(r), n.ops.push({
        kind: "region",
        polarity: n.currentPolarity,
        loops: n.regionPaths
      });
    }
    n.inRegion = !1, n.regionPaths = [], n.currentPath = [];
  }
  return {
    tracks: n.tracks,
    arcs: n.arcs,
    flashes: n.flashes,
    regions: n.regions,
    ops: n.ops
  };
}
function Ie(d, t) {
  let e = d;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const n = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (n) {
      const o = parseInt(n[1], 10), i = parseInt(n[2], 10);
      parseInt(n[4], 10), t.fmtInt = o, t.fmtDec = i;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const n = t.unitScale;
    let o = n;
    if (e.includes("MOMM") ? o = 1 : e.includes("MOIN") && (o = 25.4), o !== n) {
      const i = o / n;
      for (const r of t.apertures.values())
        r.diameterMm !== void 0 && (r.diameterMm *= i), r.widthMm !== void 0 && (r.widthMm *= i), r.heightMm !== void 0 && (r.heightMm *= i), r.outlineLoops && (r.outlineLoops = r.outlineLoops.map((s) => s.map((c) => ({ x: c.x * i, y: c.y * i }))));
      t.unitScale = o;
    }
    return;
  }
  if (e.startsWith("AM")) {
    const n = dr(e);
    n && t.macros.set(n.name, n.statements);
    return;
  }
  if (e.startsWith("AD")) {
    const n = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?(.*)$/.exec(e);
    if (!n) return;
    const o = parseInt(n[2], 10), i = n[3], r = n[4] ?? "", s = t.macros.get(i);
    if (s) {
      const a = r.split(/[Xx]/).filter(Boolean).map((h) => parseFloat(h)), p = { code: o, shape: i, macroName: i };
      Ee(p, ur(s, a, t.unitScale)), t.apertures.set(o, p);
      return;
    }
    if (i === "P") {
      const [a, p, h] = r.split(/[Xx]/).filter(Boolean).map((I) => parseFloat(I)), x = { code: o, shape: i }, w = Math.round(p);
      if (a > 0 && w >= 3) {
        const I = a * t.unitScale / 2, R = (Number.isFinite(h) ? h : 0) * Math.PI / 180, P = [];
        for (let B = 0; B < w; B++) {
          const U = R + 2 * Math.PI * B / w;
          P.push({ x: I * Math.cos(U), y: I * Math.sin(U) });
        }
        Ee(x, [P]);
      }
      t.apertures.set(o, x);
      return;
    }
    const c = i === "C" || i === "R" || i === "O" ? r : /^[0-9.Xx]*/.exec(r)?.[0] ?? "";
    let m, y, _, g, f;
    if (c) {
      const a = c.split(/[Xx]/).filter(Boolean), p = a[0] ? parseFloat(a[0]) * t.unitScale : void 0, h = a[1] ? parseFloat(a[1]) * t.unitScale : void 0, x = a[2] ? parseFloat(a[2]) * t.unitScale : void 0, w = a[3] ? parseFloat(a[3]) : void 0;
      w !== void 0 && !Number.isNaN(w) && w !== 0 && (f = w), i === "C" ? m = p : i === "R" || i === "O" ? (y = p, _ = h, m = p !== void 0 && h !== void 0 ? Math.min(p, h) : p ?? h) : (y = p, _ = h, x !== void 0 && (g = x), m = p !== void 0 && h !== void 0 ? Math.min(p, h) : p ?? h);
    }
    const b = {
      code: o,
      shape: i,
      diameterMm: m,
      widthMm: y,
      heightMm: _,
      cornerMm: g,
      rotationDeg: f
    };
    t.apertures.set(o, b);
    return;
  }
  if (e.startsWith("LR")) {
    const n = /LR([+-]?[\d.]+)/.exec(e);
    n && (t.loadRotationDeg = parseFloat(n[1]) || 0);
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
function Re(d, t, e, n, o) {
  const i = d.x + e, r = d.y + n, s = Math.sqrt(e * e + n * n);
  if (s < 1e-6) return [t];
  const c = Math.atan2(d.y - r, d.x - i), m = Math.atan2(t.y - r, t.x - i), _ = (t.x - d.x) ** 2 + (t.y - d.y) ** 2 < (s * 1e-3) ** 2;
  let g;
  _ ? g = o ? -2 * Math.PI : 2 * Math.PI : (g = m - c, o ? g > 1e-6 && (g -= 2 * Math.PI) : g < -1e-6 && (g += 2 * Math.PI));
  const f = Math.min(64, Math.max(4, Math.ceil(Math.abs(g) / (Math.PI / 16)))), b = [];
  for (let a = 1; a <= f; a++) {
    const p = c + g * a / f;
    b.push({ x: i + s * Math.cos(p), y: r + s * Math.sin(p) });
  }
  return b;
}
function yr(d, t) {
  if (d === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (d === "G74" || d === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(d);
  if (e && (t.arcMode = parseInt(e[1], 10), d = d.slice(e[0].length).trim(), !d))
    return;
  if (d === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const a = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(a), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let n = null;
  const o = /D0?(\d{1,3})$/.exec(d);
  if (o && (n = parseInt(o[1], 10), d = d.slice(0, d.length - o[0].length)), n !== null && n >= 10) {
    const a = t.apertures.get(n);
    a && (t.currentAperture = a);
    return;
  }
  const i = /X([+\-]?\d+)/.exec(d), r = /Y([+\-]?\d+)/.exec(d), s = /I([+\-]?\d+)/.exec(d), c = /J([+\-]?\d+)/.exec(d);
  let m = t.x, y = t.y;
  i && (m = ue(i[1], t)), r && (y = ue(r[1], t));
  const _ = s ? ue(s[1], t) : 0, g = c ? ue(c[1], t) : 0;
  if (n === null) {
    t.x = m, t.y = y;
    return;
  }
  if (t.inRegion) {
    const a = t.x, p = t.y;
    if (n === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: a, y: p }), t.arcMode !== 1 && (_ !== 0 || g !== 0)) {
        const h = Re({ x: a, y: p }, { x: m, y }, _, g, t.arcMode === 2);
        for (const x of h) t.currentPath.push(x);
      } else
        t.currentPath.push({ x: m, y });
    else n === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = m, t.y = y;
    return;
  }
  const f = t.x, b = t.y;
  if (n === 1) {
    if (!t.currentAperture) {
      t.x = m, t.y = y;
      return;
    }
    const a = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (_ !== 0 || g !== 0)) {
      const p = Re({ x: f, y: b }, { x: m, y }, _, g, t.arcMode === 2);
      let h = { x: f, y: b };
      for (const x of p)
        t.tracks.push({ start: h, end: x, width: a, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: h, end: x, widthMm: a }), h = x;
    } else
      t.tracks.push({
        start: { x: f, y: b },
        end: { x: m, y },
        width: a,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: f, y: b },
        end: { x: m, y },
        widthMm: a
      });
    t.x = m, t.y = y;
    return;
  }
  if (n === 2) {
    t.x = m, t.y = y;
    return;
  }
  if (n === 3) {
    if (t.currentAperture) {
      const a = t.currentAperture, p = a.diameterMm !== void 0 ? a.diameterMm : pr, h = (a.rotationDeg ?? 0) + t.loadRotationDeg, x = h !== 0 ? h : void 0, w = {
        position: { x: m, y },
        diameterMm: p,
        shape: a.shape,
        polarity: t.currentPolarity,
        rotationDeg: x
      };
      a.widthMm !== void 0 && (w.widthMm = a.widthMm), a.heightMm !== void 0 && (w.heightMm = a.heightMm), a.cornerMm !== void 0 && (w.cornerMm = a.cornerMm);
      const I = a.outlineLoops?.map(
        (R) => re(R, t.loadRotationDeg).map((P) => ({ x: P.x + m, y: P.y + y }))
      );
      I && (w.loops = I), t.flashes.push(w), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: m, y },
        diameterMm: p,
        shape: a.shape,
        widthMm: a.widthMm,
        heightMm: a.heightMm,
        cornerMm: a.cornerMm,
        rotationDeg: x,
        loops: I
      });
    }
    t.x = m, t.y = y;
    return;
  }
}
function Ee(d, t) {
  if (d.outlineLoops = t, !t.length) return;
  let e = 1 / 0, n = 1 / 0, o = -1 / 0, i = -1 / 0;
  for (const r of t) for (const s of r)
    e = Math.min(e, s.x), o = Math.max(o, s.x), n = Math.min(n, s.y), i = Math.max(i, s.y);
  d.widthMm = 2 * Math.max(Math.abs(e), Math.abs(o)), d.heightMm = 2 * Math.max(Math.abs(n), Math.abs(i)), d.diameterMm = Math.min(d.widthMm, d.heightMm);
}
function ue(d, t) {
  const e = d.startsWith("-") ? -1 : 1, n = d.replace(/[+\-]/g, ""), o = parseInt(n, 10);
  if (Number.isNaN(o)) return 0;
  const i = Math.pow(10, t.fmtDec), r = o / i * t.unitScale;
  return e * r;
}
function pe(d, t) {
  return /^0+$/.test(d) && /^0+$/.test(t) ? { fmtInt: d.length, fmtDec: t.length } : { fmtInt: parseInt(d, 10), fmtDec: parseInt(t, 10) };
}
function gr(d, t) {
  const e = t.split(/\r?\n/), n = /* @__PURE__ */ new Map();
  let o = null;
  const i = [], r = [];
  let s = 1, c = 2, m = 4, y = !1, _ = !1, g = null, f = !1, b = 0, a = 0, p = 5;
  const h = (x) => {
    if (x.includes(".")) return parseFloat(x) * s;
    const w = x.startsWith("-") ? -1 : 1;
    let I = x.replace(/[+\-]/, "");
    g === "LZ" && (I = I.padEnd(c + m, "0"));
    const R = parseInt(I, 10);
    return Number.isNaN(R) ? 0 : w * (R / Math.pow(10, m)) * s;
  };
  for (const x of e) {
    const w = x.trim();
    if (!w || w.startsWith(";")) continue;
    if (w === "M48") {
      y = !0;
      continue;
    }
    if (w === "%" && y) {
      y = !1;
      continue;
    }
    if (w === "M30" || w === "M00") break;
    if (w === "M15") {
      f = !0;
      continue;
    }
    if (w === "M16" || w === "M17") {
      f = !1, p = 5;
      continue;
    }
    if (y) {
      if (/[,\s]LZ\b/i.test(w) ? g = "LZ" : /[,\s]TZ\b/i.test(w) && (g = "TZ"), w.startsWith("METRIC")) {
        s = 1, _ || (c = 3, m = 3);
        const $ = /(\d+)\.(\d+)/.exec(w);
        if ($) {
          const q = pe($[1], $[2]);
          c = q.fmtInt, m = q.fmtDec, _ = !0;
        }
      } else if (w.startsWith("INCH")) {
        s = 25.4, _ || (c = 2, m = 4);
        const $ = /(\d+)\.(\d+)/.exec(w);
        if ($) {
          const q = pe($[1], $[2]);
          c = q.fmtInt, m = q.fmtDec, _ = !0;
        }
      }
      const E = /^FMAT,(\d+)\.(\d+)/.exec(w) || /^(\d+)\.(\d+)$/.exec(w);
      if (E) {
        const $ = pe(E[1], E[2]);
        c = $.fmtInt, m = $.fmtDec, _ = !0;
      }
    }
    if (/^T\d+C[\d.]+/i.test(w)) {
      const E = /^T(\d+)C([\d.]+)/i.exec(w);
      if (E) {
        const $ = parseFloat(E[2]) * s;
        Number.isNaN($) || n.set(E[1], $);
      }
      continue;
    }
    if (/^T\d+$/i.test(w)) {
      const E = /^T(\d+)/i.exec(w);
      E && (o = E[1]);
      continue;
    }
    const I = /^G0*([015])(?!\d)/.exec(w);
    if (I && (p = parseInt(I[1], 10)), /^[GRMF]/.test(w) && !/[XY]/i.test(w)) continue;
    const R = o && n.has(o) ? n.get(o) : 0.6, P = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(w);
    if (P) {
      const E = h(P[1]), $ = h(P[2]), q = h(P[3]), M = h(P[4]);
      Number.isFinite(E) && Number.isFinite($) && (r.push({ x1: E, y1: $, x2: q, y2: M, diameter: R }), b = q, a = M);
      continue;
    }
    const B = /X([+\-]?[\d.]+)/i.exec(w), U = /Y([+\-]?[\d.]+)/i.exec(w);
    if (B || U) {
      const E = B ? h(B[1]) : b, $ = U ? h(U[1]) : a;
      Number.isFinite(E) && Number.isFinite($) && (p === 0 || (f && p === 1 ? r.push({ x1: b, y1: a, x2: E, y2: $, diameter: R }) : i.push({ x: E, y: $, diameter: R, plated: !0 })), b = E, a = $);
    }
  }
  return { name: d, holes: i, slots: r };
}
function _r(d) {
  return { w: d.maxX - d.minX, h: d.maxY - d.minY };
}
function se(d) {
  const { w: t, h: e } = _r(d);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Xt(d, t) {
  if (!Number.isFinite(d) || !Number.isFinite(t) || d <= 0 || t <= 0) return 1;
  const e = d / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Gt(d, t) {
  return t === 1 ? d : {
    ...d,
    tracks: d.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: d.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t,
      loops: e.loops?.map((n) => n.map((o) => ({ x: o.x * t, y: o.y * t })))
    })),
    regions: d.regions.map((e) => ({
      ...e,
      loops: e.loops.map((n) => n.map((o) => ({ x: o.x * t, y: o.y * t })))
    })),
    // ops drives the polarity-correct copper/mask rendering; it must be scaled
    // in lockstep with tracks/flashes/regions or layers render at the wrong size.
    ops: d.ops.map((e) => e.kind === "track" ? {
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      widthMm: e.widthMm * t
    } : e.kind === "flash" ? {
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: e.diameterMm * t,
      widthMm: e.widthMm !== void 0 ? e.widthMm * t : void 0,
      heightMm: e.heightMm !== void 0 ? e.heightMm * t : void 0,
      cornerMm: e.cornerMm !== void 0 ? e.cornerMm * t : void 0,
      loops: e.loops?.map((n) => n.map((o) => ({ x: o.x * t, y: o.y * t })))
    } : {
      ...e,
      loops: e.loops.map((n) => n.map((o) => ({ x: o.x * t, y: o.y * t })))
    })
  };
}
function br(d, t) {
  return t === 1 ? d : d.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function xr(d, t) {
  return t === 1 ? d : d.map((e) => ({
    x1: e.x1 * t,
    y1: e.y1 * t,
    x2: e.x2 * t,
    y2: e.y2 * t,
    diameter: (e.diameter ?? 0) * t
  }));
}
function De(d, t) {
  return d.map((e, n) => {
    const o = t(e.x, e.y);
    return `${n === 0 ? "M" : "L"} ${o.x.toFixed(2)} ${o.y.toFixed(2)}`;
  }).join(" ") + " Z";
}
function vr(d) {
  return URL.createObjectURL(new Blob([d], { type: "image/svg+xml" }));
}
function Tt(d, t, e) {
  d.minX = Math.min(d.minX, t), d.minY = Math.min(d.minY, e), d.maxX = Math.max(d.maxX, t), d.maxY = Math.max(d.maxY, e);
}
function _e() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function $t(d) {
  const t = _e();
  for (const e of d.tracks) {
    Tt(t, e.start.x, e.start.y), Tt(t, e.end.x, e.end.y);
    const n = (e.width ?? 0) / 2;
    Tt(t, e.start.x - n, e.start.y - n), Tt(t, e.start.x + n, e.start.y + n), Tt(t, e.end.x - n, e.end.y - n), Tt(t, e.end.x + n, e.end.y + n);
  }
  for (const e of d.flashes) {
    if (e.loops) {
      for (const i of e.loops) for (const r of i) Tt(t, r.x, r.y);
      continue;
    }
    const n = (e.widthMm ?? e.diameterMm) || 0, o = (e.heightMm ?? e.diameterMm) || 0;
    Tt(t, e.position.x - n / 2, e.position.y - o / 2), Tt(t, e.position.x + n / 2, e.position.y + o / 2);
  }
  for (const e of d.regions)
    for (const n of e.loops) for (const o of n) Tt(t, o.x, o.y);
  return t;
}
function wr(d, t = []) {
  const e = _e();
  for (const n of d) {
    const o = (n.diameter || 0) / 2;
    Tt(e, n.x - o, n.y - o), Tt(e, n.x + o, n.y + o);
  }
  for (const n of t) {
    const o = (n.diameter || 0) / 2;
    Tt(e, n.x1 - o, n.y1 - o), Tt(e, n.x1 + o, n.y1 + o), Tt(e, n.x2 - o, n.y2 - o), Tt(e, n.x2 + o, n.y2 + o);
  }
  return e;
}
function Ae(d, t) {
  return {
    minX: Math.min(d.minX, t.minX),
    minY: Math.min(d.minY, t.minY),
    maxX: Math.max(d.maxX, t.maxX),
    maxY: Math.max(d.maxY, t.maxY)
  };
}
function Ft(d) {
  return !Number.isFinite(d.minX) || !Number.isFinite(d.minY) || !Number.isFinite(d.maxX) || !Number.isFinite(d.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (d.maxX - d.minX < 1e-6 && (d.maxX = d.minX + 1), d.maxY - d.minY < 1e-6 && (d.maxY = d.minY + 1), d);
}
const kr = 1e3;
function Lt(d) {
  return d / 25.4 * kr;
}
function Ht(d, t, e) {
  const n = d - e.minX, o = e.maxY - t;
  return { x: n, y: o };
}
function Ue(d, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${t}" viewBox="0 0 ${d} ${t}">
  <rect width="${d}" height="${t}" fill="white"/>
</svg>`.trim();
}
function qt(d, t = 1e-4) {
  const e = Math.round(d.x / t) * t, n = Math.round(d.y / t) * t;
  return `${e.toFixed(4)},${n.toFixed(4)}`;
}
function Ce(d) {
  let t = 0;
  const e = d.length;
  for (let n = 0; n < e; n++) {
    const o = d[n], i = d[(n + 1) % e];
    t += o.x * i.y - i.x * o.y;
  }
  return 0.5 * t;
}
function ye(d, t, e) {
  if (!d.length) return "";
  const n = (r) => ({
    x: (r.x - t.minX) * e,
    y: (t.maxY - r.y) * e
  }), o = n(d[0]), i = [`M ${o.x.toFixed(2)} ${o.y.toFixed(2)}`];
  for (let r = 1; r < d.length; r++) {
    const s = n(d[r]);
    i.push(`L ${s.x.toFixed(2)} ${s.y.toFixed(2)}`);
  }
  return i.push("Z"), i.join(" ");
}
function je(d) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = (m, y) => {
    const _ = qt(m), g = qt(y);
    t.has(_) || t.set(_, []), t.has(g) || t.set(g, []), t.get(_).push(y), t.get(g).push(m), e.has(_) || e.set(_, m), e.has(g) || e.set(g, y);
  };
  for (const m of d) n(m.start, m.end);
  const o = /* @__PURE__ */ new Set(), i = (m, y) => {
    const _ = qt(m), g = qt(y);
    return _ < g ? `${_}|${g}` : `${g}|${_}`;
  }, r = [];
  for (const [m, y] of t.entries()) {
    const _ = e.get(m);
    for (const g of y) {
      const f = i(_, g);
      if (o.has(f)) continue;
      const b = [_];
      let a = _, p = g;
      o.add(f);
      for (let h = 0; h < 1e5; h++) {
        b.push(p);
        const x = qt(p), w = t.get(x) ?? [];
        if (w.length === 0) break;
        let I = null;
        for (const R of w) {
          if (qt(R) === qt(a) && w.length > 1) continue;
          const P = i(p, R);
          if (!o.has(P)) {
            I = R, o.add(P);
            break;
          }
        }
        if (I || (I = w[0]), a = p, p = I, qt(p) === qt(_))
          break;
      }
      b.length >= 3 && r.push(b);
    }
  }
  r.sort((m, y) => Math.abs(Ce(y)) - Math.abs(Ce(m)));
  const s = [], c = /* @__PURE__ */ new Set();
  for (const m of r) {
    const y = m.map((_) => qt(_)).join(";");
    c.has(y) || (c.add(y), s.push(m));
  }
  return s;
}
function Mr(d, t) {
  const e = t.maxX - t.minX, n = t.maxY - t.minY, o = Math.max(1, Math.round(Lt(e))), i = Math.max(1, Math.round(Lt(n))), r = Lt(1), s = [];
  for (const c of d.regions)
    for (const m of c.loops)
      s.push(ye(m, t, r));
  if (s.length === 0 && d.tracks.length) {
    const c = je(d.tracks);
    if (c.length) {
      const m = c[0];
      s.push(ye(m, t, r));
      for (let y = 1; y < c.length; y++)
        s.push(ye(c[y], t, r));
    }
  }
  return s.length === 0 ? Ue(o, i) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${i}" viewBox="0 0 ${o} ${i}">
  <rect x="0" y="0" width="${o}" height="${i}" fill="black"/>
  <path d="${s.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function Sr(d) {
  let t = 1 / 0, e = 1 / 0, n = -1 / 0, o = -1 / 0;
  for (const i of d.loops)
    for (const r of i)
      t = Math.min(t, r.x), e = Math.min(e, r.y), n = Math.max(n, r.x), o = Math.max(o, r.y);
  return { minX: t, minY: e, maxX: n, maxY: o };
}
function Ir(d, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let n = 0, o = 0;
  for (const m of d.regions) {
    const y = Sr(m), _ = (y.maxX - y.minX) * (y.maxY - y.minY);
    m.polarity === "clear" ? o = Math.max(o, _) : n = Math.max(n, _);
  }
  const i = d.tracks.filter((m) => m.polarity !== "clear").length + d.flashes.filter((m) => m.polarity !== "clear").length + d.regions.filter((m) => m.polarity !== "clear").length, r = d.tracks.filter((m) => m.polarity === "clear").length + d.flashes.filter((m) => m.polarity === "clear").length + d.regions.filter((m) => m.polarity === "clear").length, s = o > e * 0.85;
  return !(n > e * 0.85 || !s || !(r > i * 2));
}
function ee(d, t, e, n) {
  const o = t.maxX - t.minX, i = t.maxY - t.minY, r = Math.max(1, Math.round(Lt(o))), s = Math.max(1, Math.round(Lt(i))), c = Lt(1), y = Ir(d, t) ? "white" : "black", _ = (a, p) => {
    const h = a - t.minX, x = t.maxY - p;
    return { x: h * c, y: x * c };
  }, g = (a, p) => {
    if (a.kind === "track") {
      const h = _(a.start.x, a.start.y), x = _(a.end.x, a.end.y), w = Number.isFinite(a.widthMm) ? a.widthMm : 0.2, I = Math.max(1, w * c);
      return `<line x1="${h.x.toFixed(2)}" y1="${h.y.toFixed(2)}" x2="${x.x.toFixed(2)}" y2="${x.y.toFixed(2)}" stroke-width="${I.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${p}" stroke="${p}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (a.kind === "flash") {
      if (a.loops)
        return a.loops.map((q) => `<path d="${De(q, _)}" fill="${p}" fill-opacity="1" />`).join("");
      const h = _(a.position.x, a.position.y), x = a.widthMm ?? a.diameterMm ?? 0.8, w = a.heightMm ?? a.diameterMm ?? 0.8, I = Math.max(0.01, Number.isFinite(x) ? x : 0.8) * c, R = Math.max(0.01, Number.isFinite(w) ? w : 0.8) * c, P = h.x - I / 2, B = h.y - R / 2, U = a.rotationDeg, E = U && Math.abs(U) > 0.01 ? ` transform="rotate(${(-U).toFixed(2)},${h.x.toFixed(2)},${h.y.toFixed(2)})"` : "";
      if (a.shape === "R" || a.shape === "O") {
        const q = a.shape === "O" ? Math.min(I, R) * 0.5 : 0;
        return `<rect x="${P.toFixed(2)}" y="${B.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${q.toFixed(2)}" ry="${q.toFixed(2)}" fill="${p}" fill-opacity="1"${E} />`;
      }
      if (Number.isFinite(a.cornerMm) && (a.cornerMm ?? 0) > 0) {
        const q = Math.max(0, a.cornerMm * c);
        return `<rect x="${P.toFixed(2)}" y="${B.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${q.toFixed(2)}" ry="${q.toFixed(2)}" fill="${p}" fill-opacity="1"${E} />`;
      }
      const $ = Math.max(1, Math.max(I, R) / 2);
      return `<circle cx="${h.x.toFixed(2)}" cy="${h.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${p}" fill-opacity="1" />`;
    }
    if (a.kind === "region") {
      const h = a.loops.map((x) => {
        if (!x.length) return "";
        const w = _(x[0].x, x[0].y), I = [`M ${w.x.toFixed(2)} ${w.y.toFixed(2)}`];
        for (let R = 1; R < x.length; R++) {
          const P = _(x[R].x, x[R].y);
          I.push(`L ${P.x.toFixed(2)} ${P.y.toFixed(2)}`);
        }
        return I.push("Z"), I.join(" ");
      }).join(" ");
      return h.trim() ? `<path d="${h}" fill-rule="evenodd" fill="${p}" fill-opacity="1" />` : "";
    }
    return "";
  }, f = [];
  for (const a of d.ops) {
    const p = a.polarity === "clear" ? "black" : "white", h = g(a, p);
    h && f.push(h);
  }
  const b = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${s}" viewBox="0 0 ${r} ${s}">
  <defs>
    <mask id="${b}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${r}" height="${s}" fill="${y}" fill-opacity="1" />
      ${f.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${r}" height="${s}" fill="${e}" opacity="${n}" mask="url(#${b})" />
</svg>`.trim();
}
function ze(d, t) {
  const e = t.maxX - t.minX, n = t.maxY - t.minY, o = Math.max(1, Math.round(Lt(e))), i = Math.max(1, Math.round(Lt(n))), r = Math.max(1e-6, Lt(1)), s = "rgba(255,255,255,0.95)", c = "rgba(255,255,255,0.95)", m = d.tracks.map((g) => {
    const f = Ht(g.start.x, g.start.y, t), b = Ht(g.end.x, g.end.y, t), a = Number.isFinite(g.width) ? g.width : 0.15, p = Math.max(1, a * r);
    return `<line x1="${(f.x * r).toFixed(2)}" y1="${(f.y * r).toFixed(2)}" x2="${(b.x * r).toFixed(2)}" y2="${(b.y * r).toFixed(2)}" stroke="${s}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), y = d.flashes.map((g) => {
    if (g.loops) {
      const w = (I, R) => {
        const P = Ht(I, R, t);
        return { x: P.x * r, y: P.y * r };
      };
      return g.loops.map((I) => `<path d="${De(I, w)}" fill="${c}" />`).join("");
    }
    const f = Ht(g.position.x, g.position.y, t), b = f.x * r, a = f.y * r, p = g.widthMm ?? g.diameterMm ?? 0.6, h = g.heightMm ?? g.diameterMm ?? 0.6;
    if (g.shape === "R" || g.shape === "O") {
      const w = p * r, I = h * r, R = b - w / 2, P = a - I / 2, B = g.shape === "O" ? Math.min(w, I) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${P.toFixed(2)}" width="${w.toFixed(2)}" height="${I.toFixed(2)}" rx="${B.toFixed(2)}" fill="${c}" />`;
    }
    const x = (g.diameterMm ?? 0.6) * r / 2;
    return `<circle cx="${b.toFixed(2)}" cy="${a.toFixed(2)}" r="${Math.max(1, x).toFixed(2)}" fill="${c}" />`;
  }), _ = d.regions.map((g) => {
    const f = g.loops.map((b) => {
      if (!b.length) return "";
      const a = Ht(b[0].x, b[0].y, t), p = [`M ${(a.x * r).toFixed(2)} ${(a.y * r).toFixed(2)}`];
      for (let h = 1; h < b.length; h++) {
        const x = Ht(b[h].x, b[h].y, t);
        p.push(`L ${(x.x * r).toFixed(2)} ${(x.y * r).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return f.trim() ? `<path d="${f}" fill="${c}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${i}" viewBox="0 0 ${o} ${i}">
  ${m.join(`
  `)}
  ${y.join(`
  `)}
  ${_.join(`
  `)}
</svg>`.trim();
}
function Rr(d, t, e) {
  const n = e.maxX - e.minX, o = e.maxY - e.minY, i = Math.round(Lt(n)), r = Math.round(Lt(o)), s = Lt(1), c = d.map((y) => {
    const _ = Ht(y.x, y.y, e), g = _.x * s, f = _.y * s, b = Math.max(1.5, (y.diameter || 0.6) * s / 2);
    return `<circle cx="${g.toFixed(2)}" cy="${f.toFixed(2)}" r="${(b + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${g.toFixed(2)}" cy="${f.toFixed(2)}" r="${b.toFixed(2)}" fill="#111111" />`;
  }), m = t.map((y) => {
    const _ = Ht(y.x1, y.y1, e), g = Ht(y.x2, y.y2, e), f = (_.x * s).toFixed(2), b = (_.y * s).toFixed(2), a = (g.x * s).toFixed(2), p = (g.y * s).toFixed(2), h = Math.max(3, (y.diameter || 0.6) * s);
    return `<line x1="${f}" y1="${b}" x2="${a}" y2="${p}" stroke="#c97c2a" stroke-width="${(h + 4).toFixed(2)}" stroke-linecap="round" /><line x1="${f}" y1="${b}" x2="${a}" y2="${p}" stroke="#111111" stroke-width="${h.toFixed(2)}" stroke-linecap="round" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${r}" viewBox="0 0 ${i} ${r}">
  ${c.join(`
  `)}
  ${m.join(`
  `)}
</svg>`.trim();
}
async function oe(d) {
  const t = Object.keys(d).filter((et) => !!et), e = cr(t), n = e.copper.find((et) => et.role === "top"), o = e.copper.find((et) => et.role === "bottom"), i = e.copper.filter((et) => et.role === "inner"), r = {
    top_copper: n?.path,
    bottom_copper: o?.path,
    inner_copper: i.length ? i.map((et) => et.path) : void 0,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    outline: e.outline,
    drills: e.drills
  }, s = new TextDecoder("utf-8", { fatal: !1 }), c = async (et) => {
    if (!et) return null;
    const xt = d[et];
    if (!xt) return null;
    const Pt = s.decode(xt);
    return Pt.charCodeAt(0) === 65279 ? Pt.slice(1) : Pt;
  }, m = await c(r.top_copper), y = await c(r.bottom_copper), _ = await c(r.outline), g = r.drills?.length ? await Promise.all(r.drills.map((et) => c(et))) : [], f = await c(r.top_silk), b = await c(r.bottom_silk), a = r.inner_copper?.length ? await Promise.all(r.inner_copper.map((et) => c(et))) : [], p = m ? Zt(r.top_copper || "top", m) : null, h = y ? Zt(r.bottom_copper || "bot", y) : null, x = _ ? Zt(r.outline || "outline", _) : null, w = [], I = [];
  if (r.drills)
    for (let et = 0; et < r.drills.length; et++) {
      const xt = g[et];
      if (xt) {
        const Pt = gr(r.drills[et], xt);
        for (const Yt of Pt.holes) w.push({ x: Yt.x, y: Yt.y, diameter: Yt.diameter });
        for (const Yt of Pt.slots) I.push(Yt);
      }
    }
  const R = await c(r.top_mask), P = await c(r.bottom_mask), B = await c(e.top_paste), U = await c(e.bottom_paste), E = f ? Zt(r.top_silk || "top_silk", f) : null, $ = b ? Zt(r.bottom_silk || "bot_silk", b) : null, q = R ? Zt(r.top_mask || "top_mask", R) : null, M = P ? Zt(r.bottom_mask || "bot_mask", P) : null, L = B ? Zt(e.top_paste || "top_paste", B) : null, u = U ? Zt(e.bottom_paste || "bot_paste", U) : null, N = a.map(
    (et, xt) => et ? Zt(r.inner_copper[xt], et) : null
  );
  if (!!!(p || h || x || E || $ || q || M || L || u || w.length || I.length || N.some(Boolean)))
    throw new Mt(
      "MISSING_LAYERS",
      "No recognizable Gerber or drill layers were found in the bundle.",
      { files: t }
    );
  const X = p ? Ft($t(p)) : null, rt = h ? Ft($t(h)) : null, Y = x ? Ft($t(x)) : null, it = w.length || I.length ? Ft(wr(w, I)) : null, O = E ? Ft($t(E)) : null, T = $ ? Ft($t($)) : null, st = q ? Ft($t(q)) : null, Q = M ? Ft($t(M)) : null, H = L ? Ft($t(L)) : null, ft = u ? Ft($t(u)) : null, wt = (Y && se(Y) ? Y : null) || (X && se(X) ? X : null) || (rt && se(rt) ? rt : null) || (it && se(it) ? it : null), ct = wt ? wt.maxX - wt.minX : 1, ut = X ? Xt(X.maxX - X.minX, ct) : 1, bt = rt ? Xt(rt.maxX - rt.minX, ct) : 1, pt = Y ? Xt(Y.maxX - Y.minX, ct) : 1, Rt = it ? Xt(it.maxX - it.minX, ct) : 1, At = O ? Xt(O.maxX - O.minX, ct) : 1, l = T ? Xt(T.maxX - T.minX, ct) : 1, D = st ? Xt(st.maxX - st.minX, ct) : 1, F = Q ? Xt(Q.maxX - Q.minX, ct) : 1, k = H ? Xt(H.maxX - H.minX, ct) : 1, v = ft ? Xt(ft.maxX - ft.minX, ct) : 1, j = N.map((et) => et ? Ft($t(et)) : null).map((et) => et ? Xt(et.maxX - et.minX, ct) : 1), W = p ? Gt(p, ut) : null, C = h ? Gt(h, bt) : null, Z = x ? Gt(x, pt) : null, tt = w.length ? br(w, Rt) : [], V = I.length ? xr(I, Rt) : [], nt = E ? Gt(E, At) : null, ht = $ ? Gt($, l) : null, dt = q ? Gt(q, D) : null, Et = M ? Gt(M, F) : null, jt = L ? Gt(L, k) : null, Ct = u ? Gt(u, v) : null, zt = N.map(
    (et, xt) => et ? Gt(et, j[xt]) : null
  );
  let mt = null;
  if (Z) {
    const et = Ft($t(Z));
    se(et) && (mt = et);
  }
  if (!mt) {
    let et = _e();
    W && (et = Ae(et, $t(W))), C && (et = Ae(et, $t(C))), et = Ft(et), mt = et;
  }
  const yt = Ft(mt), Kt = yt.maxX - yt.minX, Ot = yt.maxY - yt.minY;
  let Qt;
  if (Z) {
    const et = [];
    for (const xt of Z.regions)
      for (const Pt of xt.loops)
        Pt.length >= 3 && et.push(Pt);
    if (et.length === 0 && Z.tracks.length)
      for (const xt of je(Z.tracks))
        xt.length >= 3 && et.push(xt);
    et.length > 0 && (Qt = et);
  }
  const S = {
    board: {
      width_in: Kt / 25.4,
      height_in: Ot / 25.4,
      mm_bounds: {
        min_x_mm: yt.minX,
        min_y_mm: yt.minY,
        max_x_mm: yt.maxX,
        max_y_mm: yt.maxY
      }
    },
    outline_loops_mm: Qt,
    layer_count: e.copper.length
  }, z = Math.max(1, Math.round(Lt(Kt))), G = Math.max(1, Math.round(Lt(Ot))), K = {}, J = (et, xt) => (K[et] = xt, et), lt = Z ? Mr(Z, yt) : Ue(z, G), ot = J("board_mask", lt), gt = W ? J("cu.top", ee(W, yt, "#fbbf24", 1)) : void 0, _t = C ? J("cu.bottom", ee(C, yt, "#38bdf8", 1)) : void 0, St = dt ? J("top:mask", ee(dt, yt, "#fbbf24", 0.9)) : void 0, kt = Et ? J("bottom:mask", ee(Et, yt, "#38bdf8", 0.9)) : void 0, Dt = tt.length || V.length ? J("drills", Rr(tt, V, yt)) : void 0, Wt = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"], Bt = [];
  for (let et = 0; et < zt.length; et++) {
    const xt = zt[et];
    if (xt) {
      const Pt = i[et]?.detectedNum ?? et + 1;
      Bt.push(J(`cu.in${Pt}`, ee(xt, yt, Wt[et % Wt.length], 1)));
    } else
      Bt.push("");
  }
  const It = nt ? J("top:silk", ze(nt, yt)) : void 0, Nt = ht ? J("bottom:silk", ze(ht, yt)) : void 0, Ut = jt ? J("top:paste", ee(jt, yt, "#cbd5e1", 0.85)) : void 0, be = Ct ? J("bottom:paste", ee(Ct, yt, "#cbd5e1", 0.85)) : void 0, xe = [];
  for (const et of e.copper) {
    let xt, Pt, Yt, le;
    if (et.role === "top")
      xt = gt, Pt = "#fbbf24", Yt = "Top", le = "cu.top";
    else if (et.role === "bottom")
      xt = _t, Pt = "#38bdf8", Yt = "Bottom", le = "cu.bottom";
    else {
      const fe = i.indexOf(et);
      xt = Bt[fe] || void 0, Pt = Wt[fe % Wt.length];
      const ve = et.detectedNum ?? fe + 1;
      Yt = `Inner ${ve}`, le = `cu.in${ve}`;
    }
    xt && xe.push({ id: le, index: et.index, role: et.role, name: Yt, color: Pt, svgId: xt });
  }
  return {
    boardGeom: S,
    bounds: yt,
    wPx: z,
    hPx: G,
    svgById: K,
    boardMaskId: ot,
    copper: xe,
    top: St || It || Ut ? { maskId: St, silkId: It, pasteId: Ut } : void 0,
    bottom: kt || Nt || be ? { maskId: kt, silkId: Nt, pasteId: be } : void 0,
    drillsId: Dt,
    viasId: void 0
  };
}
async function Xe(d) {
  const t = await oe(d), e = [], n = /* @__PURE__ */ new Map();
  for (const [g, f] of Object.entries(t.svgById)) {
    const b = vr(f);
    n.set(g, b), e.push(b);
  }
  const o = (g) => g ? n.get(g) : void 0, i = o(t.boardMaskId), r = {
    top_board_mask: i,
    bottom_board_mask: i
  }, s = t.copper.find((g) => g.role === "top"), c = t.copper.find((g) => g.role === "bottom"), m = t.copper.filter((g) => g.role === "inner");
  s && (r.top_copper = o(s.svgId)), c && (r.bottom_copper = o(c.svgId)), m.length && (r.inner_copper = m.map((g) => o(g.svgId)).filter(Boolean)), t.top?.maskId && (r.top_mask = o(t.top.maskId)), t.bottom?.maskId && (r.bottom_mask = o(t.bottom.maskId)), t.top?.silkId && (r.top_silk = o(t.top.silkId)), t.bottom?.silkId && (r.bottom_silk = o(t.bottom.silkId)), t.top?.pasteId && (r.top_paste = o(t.top.pasteId)), t.bottom?.pasteId && (r.bottom_paste = o(t.bottom.pasteId)), t.drillsId && (r.drills = o(t.drillsId));
  const _ = {
    copper: t.copper.map((g) => ({
      id: g.id,
      index: g.index,
      role: g.role,
      name: g.name,
      color: g.color,
      url: o(g.svgId)
    })),
    top: t.top ? { mask: o(t.top.maskId), silk: o(t.top.silkId), paste: o(t.top.pasteId) } : void 0,
    bottom: t.bottom ? { mask: o(t.bottom.maskId), silk: o(t.bottom.silkId), paste: o(t.bottom.pasteId) } : void 0,
    drills: o(t.drillsId),
    vias: o(t.viasId)
  };
  return {
    boardGeom: t.boardGeom,
    layers: r,
    stackup: _,
    revoke: () => e.forEach((g) => URL.revokeObjectURL(g))
  };
}
async function nn(d) {
  const t = d instanceof Uint8Array ? d.byteOffset === 0 && d.byteLength === d.buffer.byteLength ? d.buffer : d.slice().buffer : d instanceof ArrayBuffer ? d : await d.arrayBuffer(), { files: e, archiveType: n } = await he(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (n !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${n}`);
  return await Xe(e);
}
async function sn(d, t) {
  const { files: e } = await he(d, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await Xe(e);
}
const Pe = (d) => `data:image/svg+xml;utf8,${encodeURIComponent(d)}`;
function ae(d, t = {}) {
  const {
    side: e = "top",
    revealed: n = [],
    includeFR4: o = !0,
    background: i = "#1a5f1a",
    clipToBoard: r = !0,
    outerCopper: s = !0,
    sideMask: c = !0,
    sideSilk: m = !0,
    sidePaste: y = !0,
    drills: _ = !0
  } = t, { wPx: g, hPx: f, svgById: b } = d, a = (R) => {
    if (!R) return "";
    const P = b[R];
    return P ? `<image xlink:href="${Pe(P)}" x="0" y="0" width="${g}" height="${f}" preserveAspectRatio="none"/>` : "";
  }, p = [];
  o && p.push(`<rect x="0" y="0" width="${g}" height="${f}" fill="${i}"/>`);
  const h = d.copper.find((R) => R.role === (e === "top" ? "top" : "bottom"));
  h && s && p.push(a(h.svgId));
  const x = e === "top" ? d.top : d.bottom;
  x?.maskId && c && p.push(a(x.maskId));
  for (const R of d.copper)
    R.id !== h?.id && n.includes(R.id) && p.push(a(R.svgId));
  x?.silkId && m && p.push(a(x.silkId)), x?.pasteId && y && p.push(a(x.pasteId)), d.drillsId && _ && p.push(a(d.drillsId));
  const w = p.filter(Boolean).join(`
    `);
  let I = w;
  return r && d.boardMaskId && b[d.boardMaskId] && (I = `<defs><mask id="__board" maskUnits="userSpaceOnUse" style="mask-type:luminance"><image xlink:href="${Pe(b[d.boardMaskId])}" x="0" y="0" width="${g}" height="${f}" preserveAspectRatio="none"/></mask></defs>
    <g mask="url(#__board)">
    ${w}
    </g>`), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${g}" height="${f}" viewBox="0 0 ${g} ${f}">
    ${I}
</svg>`;
}
async function We(d) {
  if (d instanceof ArrayBuffer || d instanceof Uint8Array) {
    const { files: t } = await he(d);
    return t;
  }
  return d;
}
async function on(d, t = {}) {
  const e = await We(d), n = await oe(e);
  return ae(n, t);
}
function Er(d) {
  return new Promise((t, e) => {
    const n = new Image();
    n.onload = () => t(n), n.onerror = () => e(new Error("Failed to load composed SVG for rasterization")), n.src = d;
  });
}
const Ar = async (d, { width: t, height: e, scale: n }) => {
  if (typeof document > "u" || typeof URL > "u" || !URL.createObjectURL)
    throw new Error(
      "renderGerbersToImage requires a rasterizer backend outside the browser (e.g. resvg-js). Pass opts.rasterizer."
    );
  const o = URL.createObjectURL(new Blob([d], { type: "image/svg+xml" }));
  try {
    const i = await Er(o), r = document.createElement("canvas");
    r.width = Math.max(1, Math.round(t * n)), r.height = Math.max(1, Math.round(e * n));
    const s = r.getContext("2d");
    if (!s) throw new Error("Unable to get 2D context for rasterization");
    s.drawImage(i, 0, 0, r.width, r.height);
    const c = await new Promise((m) => r.toBlob(m, "image/png"));
    if (!c) throw new Error("canvas.toBlob returned null");
    return new Uint8Array(await c.arrayBuffer());
  } finally {
    URL.revokeObjectURL(o);
  }
};
async function an(d, t = {}) {
  const e = await We(d), n = await oe(e), o = ae(n, t);
  return (t.rasterizer ?? Ar)(o, { width: n.wPx, height: n.hPx, scale: t.scale ?? 1 });
}
function Cr(d, t, e = 0.01) {
  const n = {
    min_x_mm: Math.min(d.min_x_mm, t.min_x_mm),
    min_y_mm: Math.min(d.min_y_mm, t.min_y_mm),
    max_x_mm: Math.max(d.max_x_mm, t.max_x_mm),
    max_y_mm: Math.max(d.max_y_mm, t.max_y_mm)
  }, o = d.max_x_mm - d.min_x_mm, i = d.max_y_mm - d.min_y_mm, r = t.max_x_mm - t.min_x_mm, s = t.max_y_mm - t.min_y_mm, c = Math.abs(o - r) > e || Math.abs(i - s) > e;
  return { union: n, boardSizeChanged: c };
}
const ie = 1e3 / 25.4;
async function Te(d) {
  return d instanceof ArrayBuffer || d instanceof Uint8Array ? (await he(d)).files : d;
}
function zr(d) {
  return new Promise((t, e) => {
    const n = new Image();
    n.onload = () => t(n), n.onerror = () => e(new Error("Failed to load composed SVG for diff")), n.src = d;
  });
}
async function ln(d, t, e = {}) {
  if (typeof document > "u")
    throw new Error("diffGerbers requires a browser environment (canvas).");
  const n = e.alphaThreshold ?? 24, [o, i] = await Promise.all([Te(d), Te(t)]), [r, s] = await Promise.all([oe(o), oe(i)]), { union: c, boardSizeChanged: m } = Cr(
    { min_x_mm: r.bounds.minX, min_y_mm: r.bounds.minY, max_x_mm: r.bounds.maxX, max_y_mm: r.bounds.maxY },
    { min_x_mm: s.bounds.minX, min_y_mm: s.bounds.minY, max_x_mm: s.bounds.maxX, max_y_mm: s.bounds.maxY }
  ), y = c.max_x_mm - c.min_x_mm, _ = c.max_y_mm - c.min_y_mm, g = Math.max(1, Math.round(y * ie)), f = Math.max(1, Math.round(_ * ie)), b = [], a = async (P, B) => {
    if (!P.copper.some(($) => $.role === (B === "top" ? "top" : "bottom"))) return null;
    const U = ae(P, { side: B, includeFR4: !1, clipToBoard: !0 }), E = URL.createObjectURL(new Blob([U], { type: "image/svg+xml" }));
    try {
      const $ = await zr(E), q = document.createElement("canvas");
      q.width = g, q.height = f;
      const M = q.getContext("2d");
      if (!M) return null;
      const L = Math.round((P.bounds.minX - c.min_x_mm) * ie), u = Math.round((c.max_y_mm - P.bounds.maxY) * ie);
      return M.drawImage($, L, u, P.wPx, P.hPx), M.getImageData(0, 0, g, f);
    } finally {
      URL.revokeObjectURL(E);
    }
  }, p = async (P) => {
    const [B, U] = await Promise.all([a(r, P), a(s, P)]);
    if (!B && !U) return;
    const E = document.createElement("canvas");
    E.width = g, E.height = f;
    const $ = E.getContext("2d");
    if (!$) return;
    const q = $.createImageData(g, f);
    let M = 0, L = 0;
    const u = B?.data, N = U?.data;
    for (let rt = 0; rt < q.data.length; rt += 4) {
      const Y = u ? u[rt + 3] > n : !1, it = N ? N[rt + 3] > n : !1;
      Y && it ? (q.data[rt] = 148, q.data[rt + 1] = 163, q.data[rt + 2] = 184, q.data[rt + 3] = 70) : it ? (q.data[rt] = 34, q.data[rt + 1] = 197, q.data[rt + 2] = 94, q.data[rt + 3] = 235, M++) : Y && (q.data[rt] = 239, q.data[rt + 1] = 68, q.data[rt + 2] = 68, q.data[rt + 3] = 235, L++);
    }
    $.putImageData(q, 0, 0);
    const at = await new Promise(
      (rt) => E.toBlob((Y) => rt(Y ? URL.createObjectURL(Y) : ""), "image/png")
    );
    at && b.push(at);
    const X = 1 / (ie * ie);
    return {
      url: at,
      addedPx: M,
      removedPx: L,
      addedArea_mm2: M * X,
      removedArea_mm2: L * X
    };
  }, h = await p("top"), x = await p("bottom"), w = {
    board: {
      width_in: y / 25.4,
      height_in: _ / 25.4,
      mm_bounds: c
    },
    layer_count: Math.max(r.copper.length, s.copper.length)
  }, I = (h?.addedArea_mm2 ?? 0) + (x?.addedArea_mm2 ?? 0), R = (h?.removedArea_mm2 ?? 0) + (x?.removedArea_mm2 ?? 0);
  return {
    top: h,
    bottom: x,
    boardGeom: w,
    summary: { boardSizeChanged: m, addedArea_mm2: I, removedArea_mm2: R },
    revoke: () => b.forEach((P) => URL.revokeObjectURL(P))
  };
}
function Pr(d) {
  const t = new TextEncoder().encode(d);
  let e = "";
  for (const o of t) e += String.fromCharCode(o);
  return (typeof btoa < "u" ? btoa(e) : Buffer.from(e, "binary").toString("base64")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Tr(d) {
  const t = d.replace(/-/g, "+").replace(/_/g, "/"), e = typeof atob < "u" ? atob(t) : Buffer.from(t, "base64").toString("binary"), n = Uint8Array.from(e, (o) => o.charCodeAt(0));
  return new TextDecoder().decode(n);
}
function Br(d) {
  return Pr(JSON.stringify(d));
}
function Or(d) {
  try {
    const t = JSON.parse(Tr(d)), e = (n) => typeof n == "number" && Number.isFinite(n);
    return t && t.v === 1 && (t.side === "top" || t.side === "bottom") && t.cam && e(t.cam.x) && e(t.cam.y) && e(t.cam.zoom) && (t.cam.rot === void 0 || e(t.cam.rot)) ? t : null;
  } catch {
    return null;
  }
}
function ge(d, t) {
  const [
    e,
    n,
    o,
    i,
    r,
    s,
    c,
    m,
    y
  ] = d, [
    _,
    g,
    f,
    b,
    a,
    p,
    h,
    x,
    w
  ] = t;
  return [
    e * _ + n * b + o * h,
    e * g + n * a + o * x,
    e * f + n * p + o * w,
    i * _ + r * b + s * h,
    i * g + r * a + s * x,
    i * f + r * p + s * w,
    c * _ + m * b + y * h,
    c * g + m * a + y * x,
    c * f + m * p + y * w
  ];
}
function Be(d, t) {
  return [1, 0, d, 0, 1, t, 0, 0, 1];
}
function Fr(d, t) {
  return [d, 0, 0, 0, t, 0, 0, 0, 1];
}
function Lr(d) {
  const t = Math.cos(d), e = Math.sin(d);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function Oe(d, t) {
  const e = d[0] * t.x + d[1] * t.y + d[2], n = d[3] * t.x + d[4] * t.y + d[5], o = d[6] * t.x + d[7] * t.y + d[8];
  if (o === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / o, y: n / o };
}
function Nr(d) {
  const t = d[0], e = d[1], n = d[2], o = d[3], i = d[4], r = d[5], s = t * i - e * o;
  if (Math.abs(s) < 1e-12) throw new Error("Non-invertible transform");
  const c = 1 / s, m = i * c, y = -e * c, _ = -o * c, g = t * c, f = -(m * n + y * r), b = -(_ * n + g * r);
  return [m, y, f, _, g, b, 0, 0, 1];
}
class $r {
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
    return { ...this.camera, center_mm: { ...this.camera.center_mm } };
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
      return Oe(this.worldToScreenMat, e);
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
      return Oe(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: n, zoom: o, rotation_rad: i, mirrorX: r, mirrorY: s } = this.camera, c = { x: t / 2, y: e / 2 }, m = s ? -1 : 1, y = r ? -1 : 1, _ = Be(-n.x, -n.y), g = Lr(i), f = Fr(o * y, o * m), b = Be(c.x, c.y), a = ge(b, ge(f, ge(g, _)));
    this.worldToScreenMat = a, this.screenToWorldMat = Nr(a);
  }
}
class Dr {
  constructor(t) {
    this.onFrame = t, this.pending = !1, this.reasons = /* @__PURE__ */ new Set(), this.rafId = null;
  }
  requestRender(t = "unknown") {
    this.reasons.add(t), !this.pending && (this.pending = !0, this.rafId = requestAnimationFrame(() => {
      this.rafId = null, this.pending = !1;
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
  /** Cancel any pending frame. Call on teardown to avoid rendering a disposed viewer. */
  cancel() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.pending = !1, this.reasons.clear();
  }
}
let Ur = class {
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
    const n = this.overlays.get(t);
    n && n.visible !== e && (n.visible = e);
  }
  setZIndex(t, e) {
    const n = this.overlays.get(t);
    n && n.zIndex !== e && (n.zIndex = e, this.dirty = !0);
  }
  list() {
    return Array.from(this.overlays.values());
  }
  getSortedVisible() {
    return this.dirty && (this.sortedCache = Array.from(this.overlays.values()).sort((t, e) => t.zIndex - e.zIndex), this.dirty = !1), this.sortedCache.filter((t) => t.visible);
  }
};
class jr {
  constructor(t) {
    this.cells = /* @__PURE__ */ new Map(), this.cellSize_mm = t;
  }
  cellCoord(t, e) {
    const n = Math.floor(t / this.cellSize_mm), o = Math.floor(e / this.cellSize_mm);
    return { cx: n, cy: o, key: `${n},${o}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, n) {
    const { key: o } = this.cellCoord(e, n);
    let i = this.cells.get(o);
    i || (i = /* @__PURE__ */ new Set(), this.cells.set(o, i)), i.add(t);
  }
  remove(t, e, n) {
    const { key: o } = this.cellCoord(e, n), i = this.cells.get(o);
    i && (i.delete(t), i.size === 0 && this.cells.delete(o));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, n) {
    const { cx: o, cy: i } = this.cellCoord(t, e), r = Math.ceil(n / this.cellSize_mm), s = [];
    for (let c = -r; c <= r; c++)
      for (let m = -r; m <= r; m++) {
        const y = `${o + c},${i + m}`, _ = this.cells.get(y);
        if (_)
          for (const g of _) s.push(g);
      }
    return s;
  }
}
class Xr {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new jr(5), this.dirtyList = !0, this.listCache = [];
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
      const n = this.byId.get(e.id);
      if (!n) continue;
      const o = { ...n, ...e };
      (o.x_mm !== n.x_mm || o.y_mm !== n.y_mm) && (this.index.remove(n.id, n.x_mm, n.y_mm), this.index.insert(n.id, o.x_mm, o.y_mm)), this.byId.set(n.id, o), this.dirtyList = !0;
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
  queryNear(t, e, n) {
    const o = this.index.queryRadius(t, e, n), i = [];
    for (const r of o) {
      const s = this.byId.get(r);
      s && i.push(s);
    }
    return i;
  }
}
class Wr {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, n, o = 10) {
    const i = t.screenToBoard({ x: e, y: n }), r = t.xform.getCamera().zoom, s = o / r, c = this.store.queryNear(i.x, i.y, s);
    let m = null;
    for (const y of c) {
      const _ = t.boardToScreen({ x: y.x_mm, y: y.y_mm }), g = _.x - e, f = _.y - n, b = Math.sqrt(g * g + f * f);
      b <= o && (!m || b < m.distance_px) && (m = { id: y.id, marker: y, distance_px: b });
    }
    return m;
  }
}
class Yr {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    let n = this.handlers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this.handlers.set(t, n)), n.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const n = this.on(t, (o) => {
      n(), e(o);
    });
    return n;
  }
  off(t, e) {
    const n = this.handlers.get(t);
    n && (n.delete(e), n.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const n = this.handlers.get(t);
    if (!n || n.size === 0) return;
    const o = Array.from(n);
    for (const i of o) i(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class Zr {
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
    return {
      gerber: { ...this.state.gerber },
      overlays: { ...this.state.overlays },
      markers: this.state.markers
    };
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
class Gr {
  constructor(t, e) {
    this.passes = [], this.overlays = new Ur(), this.resizeObserver = null, this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Xr(), this.markerPicker = new Wr(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Yr(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const n = t.getContext("2d");
    if (!n) throw new Error("Unable to get 2D context");
    this.ctx = n;
    const o = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new $r(e, o), this.visibility = new Zr(), this.scheduler = new Dr(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: i, y_mm: r }) => {
        const s = this.xform.boardToScreen({ x: i, y: r });
        return { x_px: s.x, y_px: s.y };
      },
      screenToBoard: ({ x_px: i, y_px: r }) => {
        const s = this.xform.screenToBoard({ x: i, y: r });
        return { x_mm: s.x, y_mm: s.y };
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
    this.resizeObserver = new ResizeObserver(() => {
      this.requestRender("canvas-resize");
    }), this.resizeObserver.observe(this.canvas);
  }
  /** Tear down observers and cancel any pending frame. Call when removing the viewer. */
  dispose() {
    this.resizeObserver?.disconnect(), this.resizeObserver = null, this.scheduler.cancel(), this.passes = [];
  }
  /** The single visibility manager the render passes read from. */
  getVisibilityManager() {
    return this.visibility;
  }
  registerDefaultPasses() {
  }
  addPass(t) {
    this.passes.push(t), this.passes.sort((e, n) => e.order - n.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((n) => n.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, n = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(n);
    const o = {
      canvas: e,
      ctx: t,
      viewport: n,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      // Use visibility manager
      boardBounds: this.boardBounds,
      boardToScreen: (i) => this.xform.boardToScreen({ x: i.x, y: i.y }),
      screenToBoard: (i) => this.xform.screenToBoard({ x: i.x, y: i.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width, e.height);
    for (const i of this.passes)
      if (i.enabled(o)) {
        t.save();
        try {
          i.draw(o);
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
  pickMarker(t, e, n = 10) {
    const o = this.createRenderCtx();
    return this.markerPicker.pick(o, t, e, n);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const n = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: n }), e?.center;
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
    const { x_px: e, y_px: n } = this.eventToCanvasPx(t), o = this.createRenderCtx(), i = this.markerPicker.pick(o, e, n, 10);
    this.setHoverMarker(i?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: n } = this.eventToCanvasPx(t), o = this.createRenderCtx(), i = this.markerPicker.pick(o, e, n, 10);
    if (i) {
      this.selectMarker(i.id);
      return;
    }
    const r = o.screenToBoard({ x: e, y: n });
    this.emit("click:board", { x_mm: r.x, y_mm: r.y });
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
function qr(d, t) {
  return {
    x_mm: d.x_mm,
    y_mm: t.minY_mm + t.maxY_mm - d.y_mm
  };
}
function Vr(d, t) {
  return d.x_mm < t.minX_mm || d.x_mm > t.maxX_mm || d.y_mm < t.minY_mm || d.y_mm > t.maxY_mm;
}
const Jt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function dn(d, t, e, n) {
  return {
    id: `gerber:${d}`,
    order: t,
    enabled: (o) => o.visibility.gerber[e],
    draw: (o) => {
      const i = o.ctx, r = o.xform.getWorldToScreenMatrix();
      i.setTransform(r[0], r[3], r[1], r[4], r[2], r[5]), n(i);
    }
  };
}
class Hr {
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
    const n = this.overlays.get(t);
    n && (n.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Kr(d, t) {
  return {
    id: "overlay:all",
    order: (Jt.OVERLAYS_MIN + Jt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const o = d.getAll().filter((r) => e.visibility.overlays[r.id] ?? r.visible);
      o.sort((r, s) => r.zIndex - s.zIndex);
      const i = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const r of o)
        e.ctx.save(), r.draw(e.ctx, i), e.ctx.restore();
    }
  };
}
let Jr = class {
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
    const e = t.ctx, n = t.xform.getCamera().zoom;
    if (!(n < 2)) {
      e.setTransform(1, 0, 0, 1, 0, 0);
      for (const i of this.markers.values()) {
        if (!i.position || typeof i.position.x != "number" || typeof i.position.y != "number" || !isFinite(i.position.x) || !isFinite(i.position.y)) {
          console.warn(`Invalid marker position for ${i.id}:`, {
            position: i.position,
            marker: i,
            keys: Object.keys(i)
          });
          continue;
        }
        const r = t.boardToScreen(i.position);
        r.x < -10 || r.x > t.viewport.width_px + 10 || r.y < -10 || r.y > t.viewport.height_px + 10 || this.drawMarker(e, r, i, n);
      }
    }
  }
  drawMarker(t, e, n, o) {
    const i = Math.max(3, Math.min(8, o / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, i, 0, Math.PI * 2), n.type) {
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
function Qr(d) {
  return {
    id: "markers",
    order: (Jt.MARKERS_MIN + Jt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => d.draw(t)
  };
}
class tn {
  /**
   * @param getMarkerPosition optional lookup returning a marker's board-space
   *   position (mm) by id, so a marker selection can be highlighted where the
   *   marker actually is.
   */
  constructor(t) {
    this.getMarkerPosition = t;
  }
  draw(t, e) {
    if (!e) return;
    const n = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(n, t, e.id);
        break;
      case "geometry":
        break;
      case "region":
        this.drawRegionSelection(n, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, n) {
    if (!n || !this.getMarkerPosition) return;
    const o = this.getMarkerPosition(n);
    if (!o) return;
    const i = e.boardToScreen(o);
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.beginPath(), t.arc(i.x, i.y, 12, 0, Math.PI * 2), t.stroke();
  }
  drawRegionSelection(t, e, n) {
    if (!n) return;
    const o = e.xform.getWorldToScreenMatrix();
    t.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      n.min.x,
      n.min.y,
      n.max.x - n.min.x,
      n.max.y - n.min.y
    );
  }
}
function en(d, t) {
  return {
    id: "selection",
    order: (Jt.SELECTION_MIN + Jt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const n = t();
      n && d.draw(e, n);
    }
  };
}
function hn(d, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, n = t.showDownloadButton !== !1;
  d.innerHTML = `
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

            <div class="layer-dropdown" id="export-dropdown">
              <button class="btn" id="export-menu-btn" type="button" title="Export image">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style="width:14px;height:14px"><path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Export
              </button>
              <div class="layer-panel" id="export-panel" hidden>
                <button class="export-item" type="button" data-export="png-view">PNG — current view</button>
                <button class="export-item" type="button" data-export="png-board">PNG — full board</button>
                <button class="export-item" type="button" data-export="svg-board">SVG — full board</button>
              </div>
            </div>

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>
            <button class="btn" id="share-btn" type="button" title="Copy shareable link">Share</button>${n ? `
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
  const o = d.firstElementChild, i = k(o, "#board-viewport"), r = k(o, "#render-canvas"), s = k(o, "#grid-toggle"), c = k(o, "#grid-units"), m = k(o, "#fit-btn"), y = k(o, "#share-btn"), _ = n ? k(o, "#download-btn") : null, g = Array.from(o.querySelectorAll('input[name="side"]')), f = k(o, "#layer-menu-btn"), b = k(o, "#layer-panel"), a = k(o, "#export-menu-btn"), p = k(o, "#export-panel"), h = new Gr(r, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), x = h.getVisibilityManager();
  x.subscribe(() => {
    h.requestRender("visibility-change");
  });
  const w = new Hr(), I = new Jr(), R = new tn((S) => I.get(S)?.position);
  let P = null;
  function B() {
    const S = i.getBoundingClientRect();
    r.width = Math.max(1, Math.round(S.width)), r.height = Math.max(1, Math.round(S.height)), r.style.width = `${S.width}px`, r.style.height = `${S.height}px`, h.requestRender("resize");
  }
  const U = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (S, z) => {
      const K = z.view.zoom, J = c.value, lt = J === "mm" ? 1 : 2.54, ot = J === "mm" ? 10 : 25.4, gt = lt * K, _t = ot * K;
      if (gt < 2) return;
      const St = z.screenToBoard({ x: 0, y: 0 }), kt = z.screenToBoard({ x: r.width, y: r.height });
      S.setTransform(1, 0, 0, 1, 0, 0), S.strokeStyle = "rgba(59, 130, 246, 0.4)", S.lineWidth = 1, S.beginPath();
      const Dt = Math.floor(St.x / lt) * lt, Wt = Math.floor(St.y / lt) * lt;
      for (let Bt = Dt; Bt <= kt.x; Bt += lt) {
        const It = z.boardToScreen({ x: Bt, y: 0 }).x;
        S.moveTo(It, 0), S.lineTo(It, r.height);
      }
      for (let Bt = Wt; Bt <= kt.y; Bt += lt) {
        const It = z.boardToScreen({ x: 0, y: Bt }).y;
        S.moveTo(0, It), S.lineTo(r.width, It);
      }
      if (S.stroke(), _t >= 8) {
        S.strokeStyle = "rgba(59, 130, 246, 0.7)", S.lineWidth = 1.5, S.beginPath();
        const Bt = Math.floor(St.x / ot) * ot, It = Math.floor(St.y / ot) * ot;
        for (let Nt = Bt; Nt <= kt.x; Nt += ot) {
          const Ut = z.boardToScreen({ x: Nt, y: 0 }).x;
          S.moveTo(Ut, 0), S.lineTo(Ut, r.height);
        }
        for (let Nt = It; Nt <= kt.y; Nt += ot) {
          const Ut = z.boardToScreen({ x: 0, y: Nt }).y;
          S.moveTo(0, Ut), S.lineTo(r.width, Ut);
        }
        S.stroke();
      }
    }
  };
  w.add(U), x.setOverlayVisibility("grid", !1), x.setMarkersVisibility(!1), h.addPass(Kr(w, h.getOverlayApi())), h.addPass(Qr(I)), h.addPass(en(R, () => P));
  const E = {}, $ = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:drills": { label: "Drill holes", color: "#111111" },
    "layer:vias": { label: "Vias", color: "#111111" }
  }, q = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  let M = null, L = {}, u = null, N = "top", at = !1, X = [], rt = !1;
  function Y(S, z, G) {
    if (!G) return null;
    S in E || (E[S] = !0);
    const K = new Image();
    return K.src = G, K.addEventListener("load", () => {
      h.requestRender(`image-loaded-${S}`);
    }), {
      id: S,
      order: z,
      enabled: (J) => !!(E[S] ?? !0) && !!M?.board?.mm_bounds,
      draw: (J) => {
        if (!K.complete || !M?.board?.mm_bounds) return;
        const lt = J.ctx, ot = J.xform.getWorldToScreenMatrix();
        lt.setTransform(ot[0], ot[3], ot[1], ot[4], ot[2], ot[5]);
        let gt;
        (L.top_board_mask || L.bottom_board_mask) && (gt = 0.5);
        const _t = O(lt, M, gt);
        Q(lt, _t, (St) => {
          if (!M?.board?.mm_bounds) return;
          const kt = M.board.mm_bounds, Dt = kt.max_x_mm - kt.min_x_mm, Wt = kt.max_y_mm - kt.min_y_mm;
          St.drawImage(K, kt.min_x_mm, kt.min_y_mm, Dt, Wt);
        });
      }
    };
  }
  function it(S, z) {
    return S in E || (E[S] = !0), {
      id: S,
      order: z,
      enabled: (G) => !!(E[S] ?? !0) && !!M?.board?.mm_bounds,
      draw: (G) => {
        if (!M?.board?.mm_bounds) return;
        const K = G.ctx, J = G.xform.getWorldToScreenMatrix();
        K.setTransform(J[0], J[3], J[1], J[4], J[2], J[5]);
        const lt = O(K, M, 0.5);
        st(K, lt);
      }
    };
  }
  function O(S, z, G) {
    if (!z?.board?.mm_bounds) return new Path2D();
    const K = z.board.mm_bounds;
    if (z.outline_loops_mm?.length) {
      const J = new Path2D(), lt = (ot) => K.max_y_mm + K.min_y_mm - ot;
      for (const ot of z.outline_loops_mm)
        if (ot.length) {
          J.moveTo(ot[0].x, lt(ot[0].y));
          for (let gt = 1; gt < ot.length; gt++)
            J.lineTo(ot[gt].x, lt(ot[gt].y));
          J.closePath();
        }
      return J;
    }
    return T(
      K.min_x_mm,
      K.min_y_mm,
      K.max_x_mm - K.min_x_mm,
      K.max_y_mm - K.min_y_mm,
      G || 0
    );
  }
  function T(S, z, G, K, J) {
    const lt = new Path2D(), ot = Math.max(0, Math.min(J, Math.min(G, K) / 2));
    return lt.moveTo(S + ot, z), lt.lineTo(S + G - ot, z), lt.quadraticCurveTo(S + G, z, S + G, z + ot), lt.lineTo(S + G, z + K - ot), lt.quadraticCurveTo(S + G, z + K, S + G - ot, z + K), lt.lineTo(S + ot, z + K), lt.quadraticCurveTo(S, z + K, S, z + K - ot), lt.lineTo(S, z + ot), lt.quadraticCurveTo(S, z, S + ot, z), lt.closePath(), lt;
  }
  function st(S, z) {
    S.save(), S.clip(z), S.fillStyle = "#1a5f1a", S.fill(z), S.strokeStyle = "#0d3d0d", S.lineWidth = 0.1, S.stroke(z), S.restore();
  }
  function Q(S, z, G) {
    S.save(), S.clip(z), G(S), S.restore();
  }
  const H = (S) => S.startsWith("cu.in"), ft = (S) => S.charAt(0).toUpperCase() + S.slice(1);
  function wt(S) {
    const z = [];
    return S.top_copper && z.push({ id: "cu.top", index: 0, role: "top", name: "Top", url: S.top_copper, color: "#fbbf24" }), (S.inner_copper ?? []).forEach((G, K) => {
      z.push({ id: `cu.in${K + 1}`, index: 0, role: "inner", name: `Inner ${K + 1}`, url: G, color: q[K % q.length] });
    }), S.bottom_copper && z.push({ id: "cu.bottom", index: 0, role: "bottom", name: "Bottom", url: S.bottom_copper, color: "#38bdf8" }), z.forEach((G, K) => {
      G.index = K;
    }), {
      copper: z,
      top: { mask: S.top_mask, silk: S.top_silk, paste: S.top_paste },
      bottom: { mask: S.bottom_mask, silk: S.bottom_silk, paste: S.bottom_paste },
      drills: S.drills,
      vias: S.vias
    };
  }
  function ct() {
    if (X.forEach((J) => h.removePass(J)), X = [], !M || !u) return;
    const S = (J, lt, ot, gt) => {
      const _t = !!gt?.fr4;
      if (!_t && !ot) return;
      gt?.meta && ($[J] = gt.meta), J in E || (E[J] = !H(J));
      const St = _t ? it(J, lt) : Y(J, lt, ot);
      St && (h.addPass(St), X.push(J));
    };
    S("layer:fr4", 5, void 0, { fr4: !0 });
    const z = N, G = u.copper.find((J) => J.role === (z === "top" ? "top" : "bottom"));
    G && S(G.id, 10, G.url, { meta: { label: `${G.name} copper`, color: G.color } });
    const K = z === "top" ? u.top : u.bottom;
    K?.mask && S(`${z}:mask`, 15, K.mask, { meta: { label: `${ft(z)} soldermask`, color: z === "top" ? "#fde68a" : "#bae6fd" } }), u.copper.filter((J) => J.role === "inner").forEach((J, lt) => S(J.id, 20 + lt, J.url, { meta: { label: J.name, color: J.color } })), K?.silk && S(`${z}:silk`, 60, K.silk, { meta: { label: `${ft(z)} silkscreen`, color: "#f1f5f9" } }), K?.paste && S(`${z}:paste`, 62, K.paste, { meta: { label: `${ft(z)} paste`, color: "#cbd5e1" } }), S("layer:drills", 70, u.drills), S("layer:vias", 75, u.vias), h.requestRender("side-switch"), setTimeout(() => h.requestRender("side-switch-delayed"), 50), ut();
  }
  function ut() {
    const S = [...X].reverse();
    b.innerHTML = S.map((z) => {
      const G = $[z] ?? { label: z, color: "#888" }, K = E[z] ?? !0, J = G.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${z}"><span class="layer-swatch" style="background:${G.color};${J}"></span><span>${G.label}</span><input type="checkbox"${K ? " checked" : ""} /></label>`;
    }).join(""), b.querySelectorAll(".layer-item input").forEach((z) => {
      z.addEventListener("change", () => {
        const G = z.closest("[data-layer-id]")?.dataset.layerId;
        G && (E[G] = z.checked, h.requestRender("layer-toggle"));
      });
    });
  }
  function bt(S = 0.08) {
    if (!M?.board?.mm_bounds) return;
    const z = i.getBoundingClientRect(), G = M.board.mm_bounds, K = G.max_x_mm - G.min_x_mm, J = G.max_y_mm - G.min_y_mm, lt = z.width * (1 - 2 * S), ot = z.height * (1 - 2 * S), gt = lt / K, _t = ot / J, St = Math.min(gt, _t), kt = (G.min_x_mm + G.max_x_mm) / 2, Dt = (G.min_y_mm + G.max_y_mm) / 2;
    h.setCamera({
      center_mm: { x: kt, y: Dt },
      zoom: St
    });
  }
  r.addEventListener("wheel", (S) => {
    S.preventDefault(), at = !0;
    const z = r.getBoundingClientRect(), G = S.clientX - z.left, K = S.clientY - z.top, J = h.getCamera(), lt = S.deltaY < 0 ? 1.1 : 0.9, ot = Math.max(0.2, Math.min(50, J.zoom * lt)), gt = h.screenToBoard(G, K);
    h.setCamera({ zoom: ot });
    const _t = h.screenToBoard(G, K), St = gt.x - _t.x, kt = gt.y - _t.y;
    h.setCamera({
      center_mm: {
        x: J.center_mm.x + St,
        y: J.center_mm.y + kt
      }
    });
  }, { passive: !1 });
  let pt = !1, Rt = null;
  r.addEventListener("mousedown", (S) => {
    if (S.button !== 0) return;
    S.preventDefault(), at = !0, pt = !0;
    const z = r.getBoundingClientRect();
    Rt = h.screenToBoard(
      S.clientX - z.left,
      S.clientY - z.top
    );
  });
  const At = (S) => {
    if (!pt || !Rt) return;
    const z = r.getBoundingClientRect(), G = h.screenToBoard(
      S.clientX - z.left,
      S.clientY - z.top
    ), K = Rt.x - G.x, J = Rt.y - G.y, lt = h.getCamera();
    h.setCamera({
      center_mm: {
        x: lt.center_mm.x + K,
        y: lt.center_mm.y + J
      }
    });
  }, l = () => {
    pt = !1, Rt = null;
  };
  window.addEventListener("mousemove", At), window.addEventListener("mouseup", l), s.addEventListener("change", () => {
    const S = s.checked;
    x.setOverlayVisibility("grid", S), U.visible = S, h.requestRender("grid-toggle");
  }), c.addEventListener("change", () => {
    x.isOverlayVisible("grid") && h.requestRender("grid-units");
  }), m.addEventListener("click", () => bt(0.08)), y.addEventListener("click", async () => {
    await jt();
    const S = y.textContent;
    y.textContent = "Copied!", setTimeout(() => {
      y.textContent = S;
    }, 1200);
  }), _?.addEventListener("click", () => t.onDownload?.()), f.addEventListener("click", (S) => {
    S.stopPropagation();
    const z = !b.hidden;
    b.hidden = z, f.classList.toggle("active", !z);
  }), a.addEventListener("click", (S) => {
    S.stopPropagation();
    const z = !p.hidden;
    p.hidden = z, a.classList.toggle("active", !z);
  }), p.querySelectorAll(".export-item").forEach((S) => {
    S.addEventListener("click", async () => {
      p.hidden = !0, a.classList.remove("active");
      const z = S.dataset.export;
      try {
        z === "png-view" ? await nt("view") : z === "png-board" ? await nt("board") : z === "svg-board" && await V();
      } catch (G) {
        console.error("Export failed:", G);
      }
    });
  });
  const D = (S) => {
    const z = S.target;
    !b.hidden && !b.contains(z) && S.target !== f && (b.hidden = !0, f.classList.remove("active")), !p.hidden && !p.contains(z) && S.target !== a && (p.hidden = !0, a.classList.remove("active"));
  };
  document.addEventListener("click", D), g.forEach((S) => {
    S.addEventListener("change", () => {
      N = g.find((z) => z.checked)?.value || "top", ct();
    });
  });
  const F = () => {
    B(), at || bt(0.08);
  };
  window.addEventListener("resize", F);
  function k(S, z) {
    const G = S.querySelector(z);
    if (!G) throw new Error(`Missing required element: ${z}`);
    return G;
  }
  function v(S) {
    M = S.boardGeom, L = S.layers, u = S.stackup ?? wt(S.layers), M?.board?.mm_bounds && h.setBoardBounds({
      minX_mm: M.board.mm_bounds.min_x_mm,
      minY_mm: M.board.mm_bounds.min_y_mm,
      maxX_mm: M.board.mm_bounds.max_x_mm,
      maxY_mm: M.board.mm_bounds.max_y_mm
    }), ct(), B(), bt(0.08), rt || (rt = !0, Ct());
  }
  function A(S) {
    N = S;
    const z = g.find((G) => G.value === S);
    z && (z.checked = !0), ct();
  }
  function j(S, z) {
    const G = URL.createObjectURL(S), K = document.createElement("a");
    K.href = G, K.download = z, document.body.appendChild(K), K.click(), K.remove(), setTimeout(() => URL.revokeObjectURL(G), 1e3);
  }
  function W(S) {
    return new Promise((z, G) => {
      const K = new Image();
      K.onload = () => z(K), K.onerror = () => G(new Error("Failed to load composed SVG for export")), K.src = S;
    });
  }
  function C() {
    if (!u) return [];
    const S = u.copper.find((z) => z.role === (N === "top" ? "top" : "bottom"));
    return u.copper.filter((z) => z.id !== S?.id && (E[z.id] ?? !1)).map((z) => z.id);
  }
  function Z() {
    const S = u?.copper.find((z) => z.role === (N === "top" ? "top" : "bottom"));
    return {
      side: N,
      revealed: C(),
      includeFR4: E["layer:fr4"] ?? !0,
      outerCopper: S ? E[S.id] ?? !0 : !0,
      sideMask: E[`${N}:mask`] ?? !0,
      sideSilk: E[`${N}:silk`] ?? !0,
      sidePaste: E[`${N}:paste`] ?? !0,
      drills: E["layer:drills"] ?? !0
    };
  }
  async function tt() {
    if (!M || !u) return null;
    const S = M.board.mm_bounds, z = S.max_x_mm - S.min_x_mm, G = S.max_y_mm - S.min_y_mm, K = 1e3 / 25.4, J = Math.max(1, Math.round(z * K)), lt = Math.max(1, Math.round(G * K)), ot = {}, gt = [], _t = (It, Nt) => {
      if (Nt)
        return gt.push(fetch(Nt).then((Ut) => Ut.text()).then((Ut) => {
          ot[It] = Ut;
        })), It;
    }, St = _t("board_mask", L.top_board_mask), kt = u.copper.map((It) => ({
      id: It.id,
      index: It.index,
      role: It.role,
      name: It.name,
      color: It.color,
      svgId: _t(It.id, It.url)
    })), Dt = u.top ? { maskId: _t("top:mask", u.top.mask), silkId: _t("top:silk", u.top.silk), pasteId: _t("top:paste", u.top.paste) } : void 0, Wt = u.bottom ? { maskId: _t("bottom:mask", u.bottom.mask), silkId: _t("bottom:silk", u.bottom.silk), pasteId: _t("bottom:paste", u.bottom.paste) } : void 0, Bt = _t("drills", u.drills);
    return await Promise.all(gt), {
      boardGeom: M,
      bounds: { minX: S.min_x_mm, minY: S.min_y_mm, maxX: S.max_x_mm, maxY: S.max_y_mm },
      wPx: J,
      hPx: lt,
      svgById: ot,
      boardMaskId: St,
      copper: kt,
      top: Dt,
      bottom: Wt,
      drillsId: Bt,
      viasId: void 0
    };
  }
  async function V() {
    const S = await tt();
    if (!S) return;
    const z = ae(S, Z());
    j(new Blob([z], { type: "image/svg+xml" }), `board-${N}.svg`);
  }
  async function nt(S = "view", z = 2) {
    if (S === "view") {
      await new Promise((lt) => {
        r.toBlob((ot) => {
          ot && j(ot, `board-${N}-view.png`), lt();
        }, "image/png");
      });
      return;
    }
    const G = await tt();
    if (!G) return;
    const K = ae(G, Z()), J = URL.createObjectURL(new Blob([K], { type: "image/svg+xml" }));
    try {
      const lt = await W(J), ot = document.createElement("canvas"), gt = 8e3, _t = Math.min(z, gt / Math.max(1, G.wPx), gt / Math.max(1, G.hPx));
      ot.width = Math.max(1, Math.round(G.wPx * _t)), ot.height = Math.max(1, Math.round(G.hPx * _t));
      const St = ot.getContext("2d");
      if (!St) return;
      St.drawImage(lt, 0, 0, ot.width, ot.height), await new Promise((kt) => {
        ot.toBlob((Dt) => {
          Dt && j(Dt, `board-${N}.png`), kt();
        }, "image/png");
      });
    } finally {
      URL.revokeObjectURL(J);
    }
  }
  function ht() {
    const S = h.getCamera();
    return {
      v: 1,
      side: N,
      cam: { x: S.center_mm.x, y: S.center_mm.y, zoom: S.zoom, rot: S.rotation_rad || 0 },
      visible: { ...E },
      grid: s.checked,
      units: c.value
    };
  }
  function dt(S) {
    if (S.units && (c.value = S.units), typeof S.grid == "boolean" && (s.checked = S.grid, U.visible = S.grid, x.setOverlayVisibility("grid", S.grid)), S.side) {
      N = S.side;
      const z = g.find((G) => G.value === S.side);
      z && (z.checked = !0);
    }
    S.visible && Object.assign(E, S.visible), ct(), S.cam && h.setCamera({ center_mm: { x: S.cam.x, y: S.cam.y }, zoom: S.cam.zoom, rotation_rad: S.cam.rot ?? 0 }), at = !0, h.requestRender("view-state");
  }
  function Et() {
    const S = new URL(location.href);
    return S.hash = `gv=${Br(ht())}`, S.toString();
  }
  async function jt() {
    const S = Et();
    try {
      location.hash = new URL(S).hash;
    } catch {
    }
    try {
      await navigator.clipboard?.writeText(S);
    } catch {
    }
    return S;
  }
  function Ct() {
    const S = /(?:^|[#&])gv=([^&]+)/.exec(location.hash || "");
    if (!S) return !1;
    const z = Or(S[1]);
    return z ? (dt(z), !0) : !1;
  }
  let zt = null;
  const mt = {
    id: "diff:overlay",
    order: 190,
    // above board layers, below markers
    enabled: (S) => !!zt,
    draw: (S) => {
      if (!zt) return;
      const z = N === "top" ? zt.topImg : zt.bottomImg;
      if (!z || !z.complete) return;
      const G = zt.result.boardGeom.board.mm_bounds, K = S.ctx, J = S.xform.getWorldToScreenMatrix();
      K.setTransform(J[0], J[3], J[1], J[4], J[2], J[5]), K.drawImage(z, G.min_x_mm, G.min_y_mm, G.max_x_mm - G.min_x_mm, G.max_y_mm - G.min_y_mm);
    }
  };
  function yt(S) {
    const z = (G) => {
      if (!G) return;
      const K = new Image();
      return K.onload = () => h.requestRender("diff-loaded"), K.onerror = () => console.error("Diff overlay image failed to load:", G), K.src = G, K;
    };
    zt = { result: S, topImg: z(S.top?.url), bottomImg: z(S.bottom?.url) }, h.getPass("diff:overlay") || h.addPass(mt), h.requestRender("diff-show");
  }
  function Kt() {
    zt = null, h.removePass("diff:overlay"), h.requestRender("diff-hide");
  }
  function Ot(S, z) {
    const G = M?.board?.mm_bounds;
    if (!G) return { x: S, y: z };
    const K = qr(
      { x_mm: S, y_mm: z },
      { minX_mm: G.min_x_mm, minY_mm: G.min_y_mm, maxX_mm: G.max_x_mm, maxY_mm: G.max_y_mm }
    );
    return { x: K.x_mm, y: K.y_mm };
  }
  function Qt() {
    window.removeEventListener("mousemove", At), window.removeEventListener("mouseup", l), window.removeEventListener("resize", F), document.removeEventListener("click", D), h.dispose(), d.innerHTML = "";
  }
  return B(), {
    setData: v,
    setSideMode: A,
    fit: () => bt(0.08),
    dispose: Qt,
    // Image / SVG export
    exportPng: nt,
    exportSvg: V,
    // Revision diff overlay
    showDiff: yt,
    hideDiff: Kt,
    // Shareable view state
    getViewState: ht,
    setViewState: dt,
    getShareUrl: Et,
    copyShareLink: jt,
    applyStateFromHash: Ct,
    // Expose new render pipeline API
    viewer: h,
    visibility: x,
    overlayRegistry: w,
    markerRenderer: I,
    setSelection: (S) => {
      P = S, h.requestRender("selection-change");
    },
    addMarker: (S) => {
      if (typeof S.x_mm != "number" || typeof S.y_mm != "number" || !isFinite(S.x_mm) || !isFinite(S.y_mm)) {
        console.warn(`Invalid marker coordinates for ${S.id}:`, {
          x_mm: S.x_mm,
          y_mm: S.y_mm,
          marker: S,
          keys: Object.keys(S)
        });
        return;
      }
      const z = {
        id: S.id,
        position: Ot(S.x_mm, S.y_mm),
        type: "custom",
        // Default type for DFM markers
        data: {
          ...S.data,
          severity: S.severity,
          layer: S.layer,
          radius_mm: S.radius_mm
        }
      };
      I.add(z), h.requestRender("marker-added");
    },
    addMarkers: (S) => {
      for (const z of S) {
        if (typeof z.x_mm != "number" || typeof z.y_mm != "number" || !isFinite(z.x_mm) || !isFinite(z.y_mm)) {
          console.warn(`Invalid marker coordinates for ${z.id}:`, {
            x_mm: z.x_mm,
            y_mm: z.y_mm,
            marker: z,
            keys: Object.keys(z)
          });
          continue;
        }
        const G = {
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
        I.add(G);
      }
      h.requestRender("markers-added");
    },
    removeMarker: (S) => {
      I.remove(S), h.requestRender("marker-removed");
    }
  };
}
function fn(d, t) {
  return {
    id: "overlay:all",
    order: Jt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const n = e.xform.getWorldToScreenMatrix(), o = d.getSortedVisible();
      for (const i of o)
        e.ctx.save(), i.drawInWorldSpace ? e.ctx.setTransform(n[0], n[3], n[1], n[4], n[2], n[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), i.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function mn() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (d, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      d.fillStyle = "red";
      for (const n of e)
        d.beginPath(), d.arc(n.x_mm, n.y_mm, 0.25, 0, Math.PI * 2), d.fill();
    }
  };
}
function pn(d) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const n = d();
      n && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(n.x_px + 12, n.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(n.text, n.x_px + 15, n.y_px - 5));
    }
  };
}
function yn(d = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const n = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let o = n.minX_mm; o <= n.maxX_mm; o += d)
        t.moveTo(o, n.minY_mm), t.lineTo(o, n.maxY_mm);
      for (let o = n.minY_mm; o <= n.maxY_mm; o += d)
        t.moveTo(n.minX_mm, o), t.lineTo(n.maxX_mm, o);
      t.stroke();
    }
  };
}
function gn(d) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, n) => {
      t += 16;
      const o = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + o * 0.7})`, e.beginPath(), e.arc(d.x_mm, d.y_mm, 0.5 + o * 0.5, 0, Math.PI * 2), e.fill(), n.requestRender("overlay:animate");
    }
  };
}
class rn {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const n = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: o, height_px: i } = t.viewport, r = 4;
    for (const s of n) {
      if (typeof s.x_mm != "number" || typeof s.y_mm != "number" || !isFinite(s.x_mm) || !isFinite(s.y_mm)) {
        console.warn(`Invalid marker coordinates for ${s.id}:`, {
          x_mm: s.x_mm,
          y_mm: s.y_mm,
          marker: s,
          keys: Object.keys(s)
        });
        continue;
      }
      const c = t.boardToScreen({ x: s.x_mm, y: s.y_mm }), m = c.x, y = c.y;
      if (m < -10 || y < -10 || m > o + 10 || y > i + 10) continue;
      const _ = e?.boardBounds ? Vr({ x_mm: s.x_mm, y_mm: s.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, s, e?.selectedId === s.id, e?.hoverId === s.id, _), t.ctx.beginPath(), t.ctx.arc(m, y, r, 0, Math.PI * 2), e?.selectedId === s.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, n, o, i) {
    if (n)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (o)
      t.fillStyle = "rgba(245, 158, 11, 0.8)", t.strokeStyle = "rgba(245, 158, 11, 1)";
    else if (i)
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
function _n(d, t) {
  const e = new rn(d);
  return {
    id: "markers",
    order: Jt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (n) => {
      if (!n.visibility.markers) return;
      const o = t();
      e.draw(n, {
        selectedId: o.selectedId,
        hoverId: o.hoverId,
        boardBounds: n.boardBounds
      });
    }
  };
}
export {
  Yr as Emitter,
  Mt as GerberError,
  Wr as MarkerPicker,
  rn as MarkerRenderer,
  Xr as MarkerStore,
  Ur as OverlayRegistry,
  Dr as RenderScheduler,
  tn as SelectionRenderer,
  jr as UniformGridIndex,
  Gr as Viewer,
  $r as ViewportTransform,
  Zr as VisibilityManager,
  ae as composeStackToSvg,
  Cr as computeDiffAlignment,
  hn as createBoardViewer,
  dn as createGerberPass,
  yn as createGridOverlay,
  hn as createIntegratedViewer,
  _n as createMarkerPass,
  fn as createOverlayPass,
  gn as createPulsingMarkerOverlay,
  en as createSelectionPass,
  pn as createTooltipOverlay,
  mn as createViolationDotsOverlay,
  Or as decodeViewState,
  er as detectGerberBundle,
  ln as diffGerbers,
  Br as encodeViewState,
  oe as renderGerberSvgDocs,
  sn as renderGerbers,
  Xe as renderGerbersFiles,
  an as renderGerbersToImage,
  on as renderGerbersToSvg,
  nn as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
