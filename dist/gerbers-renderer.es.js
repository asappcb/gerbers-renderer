var Dt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function me(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
function $t(m) {
  throw new Error('Could not dynamically require "' + m + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Wt = { exports: {} };
var qt;
function pe() {
  return qt || (qt = 1, (function(m, t) {
    (function(e) {
      m.exports = e();
    })(function() {
      return (function e(a, l, n) {
        function s(y, w) {
          if (!l[y]) {
            if (!a[y]) {
              var _ = typeof $t == "function" && $t;
              if (!w && _) return _(y, !0);
              if (o) return o(y, !0);
              var b = new Error("Cannot find module '" + y + "'");
              throw b.code = "MODULE_NOT_FOUND", b;
            }
            var d = l[y] = { exports: {} };
            a[y][0].call(d.exports, function(h) {
              var i = a[y][1][h];
              return s(i || h);
            }, d, d.exports, e, a, l, n);
          }
          return l[y].exports;
        }
        for (var o = typeof $t == "function" && $t, f = 0; f < n.length; f++) s(n[f]);
        return s;
      })({ 1: [function(e, a, l) {
        var n = e("./utils"), s = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        l.encode = function(f) {
          for (var y, w, _, b, d, h, i, p = [], u = 0, x = f.length, k = x, A = n.getTypeOf(f) !== "string"; u < f.length; ) k = x - u, _ = A ? (y = f[u++], w = u < x ? f[u++] : 0, u < x ? f[u++] : 0) : (y = f.charCodeAt(u++), w = u < x ? f.charCodeAt(u++) : 0, u < x ? f.charCodeAt(u++) : 0), b = y >> 2, d = (3 & y) << 4 | w >> 4, h = 1 < k ? (15 & w) << 2 | _ >> 6 : 64, i = 2 < k ? 63 & _ : 64, p.push(o.charAt(b) + o.charAt(d) + o.charAt(h) + o.charAt(i));
          return p.join("");
        }, l.decode = function(f) {
          var y, w, _, b, d, h, i = 0, p = 0, u = "data:";
          if (f.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, k = 3 * (f = f.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (f.charAt(f.length - 1) === o.charAt(64) && k--, f.charAt(f.length - 2) === o.charAt(64) && k--, k % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = s.uint8array ? new Uint8Array(0 | k) : new Array(0 | k); i < f.length; ) y = o.indexOf(f.charAt(i++)) << 2 | (b = o.indexOf(f.charAt(i++))) >> 4, w = (15 & b) << 4 | (d = o.indexOf(f.charAt(i++))) >> 2, _ = (3 & d) << 6 | (h = o.indexOf(f.charAt(i++))), x[p++] = y, d !== 64 && (x[p++] = w), h !== 64 && (x[p++] = _);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, a, l) {
        var n = e("./external"), s = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), f = e("./stream/DataLengthProbe");
        function y(w, _, b, d, h) {
          this.compressedSize = w, this.uncompressedSize = _, this.crc32 = b, this.compression = d, this.compressedContent = h;
        }
        y.prototype = { getContentWorker: function() {
          var w = new s(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new f("data_length")), _ = this;
          return w.on("end", function() {
            if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), w;
        }, getCompressedWorker: function() {
          return new s(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, y.createWorkerFrom = function(w, _, b) {
          return w.pipe(new o()).pipe(new f("uncompressedSize")).pipe(_.compressWorker(b)).pipe(new f("compressedSize")).withStreamInfo("compression", _);
        }, a.exports = y;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, a, l) {
        var n = e("./stream/GenericWorker");
        l.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, l.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, a, l) {
        var n = e("./utils"), s = (function() {
          for (var o, f = [], y = 0; y < 256; y++) {
            o = y;
            for (var w = 0; w < 8; w++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            f[y] = o;
          }
          return f;
        })();
        a.exports = function(o, f) {
          return o !== void 0 && o.length ? n.getTypeOf(o) !== "string" ? (function(y, w, _, b) {
            var d = s, h = b + _;
            y ^= -1;
            for (var i = b; i < h; i++) y = y >>> 8 ^ d[255 & (y ^ w[i])];
            return -1 ^ y;
          })(0 | f, o, o.length, 0) : (function(y, w, _, b) {
            var d = s, h = b + _;
            y ^= -1;
            for (var i = b; i < h; i++) y = y >>> 8 ^ d[255 & (y ^ w.charCodeAt(i))];
            return -1 ^ y;
          })(0 | f, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, a, l) {
        l.base64 = !1, l.binary = !1, l.dir = !1, l.createFolders = !0, l.date = null, l.compression = null, l.compressionOptions = null, l.comment = null, l.unixPermissions = null, l.dosPermissions = null;
      }, {}], 6: [function(e, a, l) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), a.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, a, l) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), o = e("./utils"), f = e("./stream/GenericWorker"), y = n ? "uint8array" : "array";
        function w(_, b) {
          f.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = b, this.meta = {};
        }
        l.magic = "\b\0", o.inherits(w, f), w.prototype.processChunk = function(_) {
          this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(y, _.data), !1);
        }, w.prototype.flush = function() {
          f.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, w.prototype.cleanUp = function() {
          f.prototype.cleanUp.call(this), this._pako = null;
        }, w.prototype._createPako = function() {
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var _ = this;
          this._pako.onData = function(b) {
            _.push({ data: b, meta: _.meta });
          };
        }, l.compressWorker = function(_) {
          return new w("Deflate", _);
        }, l.uncompressWorker = function() {
          return new w("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, a, l) {
        function n(d, h) {
          var i, p = "";
          for (i = 0; i < h; i++) p += String.fromCharCode(255 & d), d >>>= 8;
          return p;
        }
        function s(d, h, i, p, u, x) {
          var k, A, E = d.file, P = d.compression, N = x !== y.utf8encode, j = o.transformTo("string", x(E.name)), z = o.transformTo("string", y.utf8encode(E.name)), L = E.comment, V = o.transformTo("string", x(L)), M = o.transformTo("string", y.utf8encode(L)), D = z.length !== E.name.length, c = M.length !== L.length, $ = "", it = "", X = "", et = E.dir, Y = E.date, rt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          h && !i || (rt.crc32 = d.crc32, rt.compressedSize = d.compressedSize, rt.uncompressedSize = d.uncompressedSize);
          var O = 0;
          h && (O |= 8), N || !D && !c || (O |= 2048);
          var T = 0, J = 0;
          et && (T |= 16), u === "UNIX" ? (J = 798, T |= (function(G, lt) {
            var ft = G;
            return G || (ft = lt ? 16893 : 33204), (65535 & ft) << 16;
          })(E.unixPermissions, et)) : (J = 20, T |= (function(G) {
            return 63 & (G || 0);
          })(E.dosPermissions)), k = Y.getUTCHours(), k <<= 6, k |= Y.getUTCMinutes(), k <<= 5, k |= Y.getUTCSeconds() / 2, A = Y.getUTCFullYear() - 1980, A <<= 4, A |= Y.getUTCMonth() + 1, A <<= 5, A |= Y.getUTCDate(), D && (it = n(1, 1) + n(w(j), 4) + z, $ += "up" + n(it.length, 2) + it), c && (X = n(1, 1) + n(w(V), 4) + M, $ += "uc" + n(X.length, 2) + X);
          var H = "";
          return H += `
\0`, H += n(O, 2), H += P.magic, H += n(k, 2), H += n(A, 2), H += n(rt.crc32, 4), H += n(rt.compressedSize, 4), H += n(rt.uncompressedSize, 4), H += n(j.length, 2), H += n($.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + H + j + $, dirRecord: _.CENTRAL_FILE_HEADER + n(J, 2) + H + n(V.length, 2) + "\0\0\0\0" + n(T, 4) + n(p, 4) + j + $ + V };
        }
        var o = e("../utils"), f = e("../stream/GenericWorker"), y = e("../utf8"), w = e("../crc32"), _ = e("../signature");
        function b(d, h, i, p) {
          f.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = h, this.zipPlatform = i, this.encodeFileName = p, this.streamFiles = d, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(b, f), b.prototype.push = function(d) {
          var h = d.meta.percent || 0, i = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(d) : (this.bytesWritten += d.data.length, f.prototype.push.call(this, { data: d.data, meta: { currentFile: this.currentFile, percent: i ? (h + 100 * (i - p - 1)) / i : 100 } }));
        }, b.prototype.openedSource = function(d) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = d.file.name;
          var h = this.streamFiles && !d.file.dir;
          if (h) {
            var i = s(d, h, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: i.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, b.prototype.closedSource = function(d) {
          this.accumulate = !1;
          var h = this.streamFiles && !d.file.dir, i = s(d, h, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(i.dirRecord), h) this.push({ data: (function(p) {
            return _.DATA_DESCRIPTOR + n(p.crc32, 4) + n(p.compressedSize, 4) + n(p.uncompressedSize, 4);
          })(d), meta: { percent: 100 } });
          else for (this.push({ data: i.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, b.prototype.flush = function() {
          for (var d = this.bytesWritten, h = 0; h < this.dirRecords.length; h++) this.push({ data: this.dirRecords[h], meta: { percent: 100 } });
          var i = this.bytesWritten - d, p = (function(u, x, k, A, E) {
            var P = o.transformTo("string", E(A));
            return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(u, 2) + n(u, 2) + n(x, 4) + n(k, 4) + n(P.length, 2) + P;
          })(this.dirRecords.length, i, d, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, b.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, b.prototype.registerPrevious = function(d) {
          this._sources.push(d);
          var h = this;
          return d.on("data", function(i) {
            h.processChunk(i);
          }), d.on("end", function() {
            h.closedSource(h.previous.streamInfo), h._sources.length ? h.prepareNextSource() : h.end();
          }), d.on("error", function(i) {
            h.error(i);
          }), this;
        }, b.prototype.resume = function() {
          return !!f.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, b.prototype.error = function(d) {
          var h = this._sources;
          if (!f.prototype.error.call(this, d)) return !1;
          for (var i = 0; i < h.length; i++) try {
            h[i].error(d);
          } catch {
          }
          return !0;
        }, b.prototype.lock = function() {
          f.prototype.lock.call(this);
          for (var d = this._sources, h = 0; h < d.length; h++) d[h].lock();
        }, a.exports = b;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, a, l) {
        var n = e("../compressions"), s = e("./ZipFileWorker");
        l.generateWorker = function(o, f, y) {
          var w = new s(f.streamFiles, y, f.platform, f.encodeFileName), _ = 0;
          try {
            o.forEach(function(b, d) {
              _++;
              var h = (function(x, k) {
                var A = x || k, E = n[A];
                if (!E) throw new Error(A + " is not a valid compression method !");
                return E;
              })(d.options.compression, f.compression), i = d.options.compressionOptions || f.compressionOptions || {}, p = d.dir, u = d.date;
              d._compressWorker(h, i).withStreamInfo("file", { name: b, dir: p, date: u, comment: d.comment || "", unixPermissions: d.unixPermissions, dosPermissions: d.dosPermissions }).pipe(w);
            }), w.entriesCount = _;
          } catch (b) {
            w.error(b);
          }
          return w;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, a, l) {
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new n();
            for (var o in this) typeof this[o] != "function" && (s[o] = this[o]);
            return s;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(s, o) {
          return new n().loadAsync(s, o);
        }, n.external = e("./external"), a.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, a, l) {
        var n = e("./utils"), s = e("./external"), o = e("./utf8"), f = e("./zipEntries"), y = e("./stream/Crc32Probe"), w = e("./nodejsUtils");
        function _(b) {
          return new s.Promise(function(d, h) {
            var i = b.decompressed.getContentWorker().pipe(new y());
            i.on("error", function(p) {
              h(p);
            }).on("end", function() {
              i.streamInfo.crc32 !== b.decompressed.crc32 ? h(new Error("Corrupted zip : CRC32 mismatch")) : d();
            }).resume();
          });
        }
        a.exports = function(b, d) {
          var h = this;
          return d = n.extend(d || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), w.isNode && w.isStream(b) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", b, !0, d.optimizedBinaryString, d.base64).then(function(i) {
            var p = new f(d);
            return p.load(i), p;
          }).then(function(i) {
            var p = [s.Promise.resolve(i)], u = i.files;
            if (d.checkCRC32) for (var x = 0; x < u.length; x++) p.push(_(u[x]));
            return s.Promise.all(p);
          }).then(function(i) {
            for (var p = i.shift(), u = p.files, x = 0; x < u.length; x++) {
              var k = u[x], A = k.fileNameStr, E = n.resolve(k.fileNameStr);
              h.file(E, k.decompressed, { binary: !0, optimizedBinaryString: !0, date: k.date, dir: k.dir, comment: k.fileCommentStr.length ? k.fileCommentStr : null, unixPermissions: k.unixPermissions, dosPermissions: k.dosPermissions, createFolders: d.createFolders }), k.dir || (h.file(E).unsafeOriginalName = A);
            }
            return p.zipComment.length && (h.comment = p.zipComment), h;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, a, l) {
        var n = e("../utils"), s = e("../stream/GenericWorker");
        function o(f, y) {
          s.call(this, "Nodejs stream input adapter for " + f), this._upstreamEnded = !1, this._bindStream(y);
        }
        n.inherits(o, s), o.prototype._bindStream = function(f) {
          var y = this;
          (this._stream = f).pause(), f.on("data", function(w) {
            y.push({ data: w, meta: { percent: 0 } });
          }).on("error", function(w) {
            y.isPaused ? this.generatedError = w : y.error(w);
          }).on("end", function() {
            y.isPaused ? y._upstreamEnded = !0 : y.end();
          });
        }, o.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, a.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, a, l) {
        var n = e("readable-stream").Readable;
        function s(o, f, y) {
          n.call(this, f), this._helper = o;
          var w = this;
          o.on("data", function(_, b) {
            w.push(_) || w._helper.pause(), y && y(b);
          }).on("error", function(_) {
            w.emit("error", _);
          }).on("end", function() {
            w.push(null);
          });
        }
        e("../utils").inherits(s, n), s.prototype._read = function() {
          this._helper.resume();
        }, a.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, a, l) {
        a.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(n, s) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(n, s);
          if (typeof n == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(n, s);
        }, allocBuffer: function(n) {
          if (Buffer.alloc) return Buffer.alloc(n);
          var s = new Buffer(n);
          return s.fill(0), s;
        }, isBuffer: function(n) {
          return Buffer.isBuffer(n);
        }, isStream: function(n) {
          return n && typeof n.on == "function" && typeof n.pause == "function" && typeof n.resume == "function";
        } };
      }, {}], 15: [function(e, a, l) {
        function n(E, P, N) {
          var j, z = o.getTypeOf(P), L = o.extend(N || {}, w);
          L.date = L.date || /* @__PURE__ */ new Date(), L.compression !== null && (L.compression = L.compression.toUpperCase()), typeof L.unixPermissions == "string" && (L.unixPermissions = parseInt(L.unixPermissions, 8)), L.unixPermissions && 16384 & L.unixPermissions && (L.dir = !0), L.dosPermissions && 16 & L.dosPermissions && (L.dir = !0), L.dir && (E = u(E)), L.createFolders && (j = p(E)) && x.call(this, j, !0);
          var V = z === "string" && L.binary === !1 && L.base64 === !1;
          N && N.binary !== void 0 || (L.binary = !V), (P instanceof _ && P.uncompressedSize === 0 || L.dir || !P || P.length === 0) && (L.base64 = !1, L.binary = !0, P = "", L.compression = "STORE", z = "string");
          var M = null;
          M = P instanceof _ || P instanceof f ? P : h.isNode && h.isStream(P) ? new i(E, P) : o.prepareContent(E, P, L.binary, L.optimizedBinaryString, L.base64);
          var D = new b(E, M, L);
          this.files[E] = D;
        }
        var s = e("./utf8"), o = e("./utils"), f = e("./stream/GenericWorker"), y = e("./stream/StreamHelper"), w = e("./defaults"), _ = e("./compressedObject"), b = e("./zipObject"), d = e("./generate"), h = e("./nodejsUtils"), i = e("./nodejs/NodejsStreamInputAdapter"), p = function(E) {
          E.slice(-1) === "/" && (E = E.substring(0, E.length - 1));
          var P = E.lastIndexOf("/");
          return 0 < P ? E.substring(0, P) : "";
        }, u = function(E) {
          return E.slice(-1) !== "/" && (E += "/"), E;
        }, x = function(E, P) {
          return P = P !== void 0 ? P : w.createFolders, E = u(E), this.files[E] || n.call(this, E, null, { dir: !0, createFolders: P }), this.files[E];
        };
        function k(E) {
          return Object.prototype.toString.call(E) === "[object RegExp]";
        }
        var A = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(E) {
          var P, N, j;
          for (P in this.files) j = this.files[P], (N = P.slice(this.root.length, P.length)) && P.slice(0, this.root.length) === this.root && E(N, j);
        }, filter: function(E) {
          var P = [];
          return this.forEach(function(N, j) {
            E(N, j) && P.push(j);
          }), P;
        }, file: function(E, P, N) {
          if (arguments.length !== 1) return E = this.root + E, n.call(this, E, P, N), this;
          if (k(E)) {
            var j = E;
            return this.filter(function(L, V) {
              return !V.dir && j.test(L);
            });
          }
          var z = this.files[this.root + E];
          return z && !z.dir ? z : null;
        }, folder: function(E) {
          if (!E) return this;
          if (k(E)) return this.filter(function(z, L) {
            return L.dir && E.test(z);
          });
          var P = this.root + E, N = x.call(this, P), j = this.clone();
          return j.root = N.name, j;
        }, remove: function(E) {
          E = this.root + E;
          var P = this.files[E];
          if (P || (E.slice(-1) !== "/" && (E += "/"), P = this.files[E]), P && !P.dir) delete this.files[E];
          else for (var N = this.filter(function(z, L) {
            return L.name.slice(0, E.length) === E;
          }), j = 0; j < N.length; j++) delete this.files[N[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(E) {
          var P, N = {};
          try {
            if ((N = o.extend(E || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = N.type.toLowerCase(), N.compression = N.compression.toUpperCase(), N.type === "binarystring" && (N.type = "string"), !N.type) throw new Error("No output type specified.");
            o.checkSupport(N.type), N.platform !== "darwin" && N.platform !== "freebsd" && N.platform !== "linux" && N.platform !== "sunos" || (N.platform = "UNIX"), N.platform === "win32" && (N.platform = "DOS");
            var j = N.comment || this.comment || "";
            P = d.generateWorker(this, N, j);
          } catch (z) {
            (P = new f("error")).error(z);
          }
          return new y(P, N.type || "string", N.mimeType);
        }, generateAsync: function(E, P) {
          return this.generateInternalStream(E).accumulate(P);
        }, generateNodeStream: function(E, P) {
          return (E = E || {}).type || (E.type = "nodebuffer"), this.generateInternalStream(E).toNodejsStream(P);
        } };
        a.exports = A;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, a, l) {
        a.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, a, l) {
        var n = e("./DataReader");
        function s(o) {
          n.call(this, o);
          for (var f = 0; f < this.data.length; f++) o[f] = 255 & o[f];
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, s.prototype.lastIndexOfSignature = function(o) {
          for (var f = o.charCodeAt(0), y = o.charCodeAt(1), w = o.charCodeAt(2), _ = o.charCodeAt(3), b = this.length - 4; 0 <= b; --b) if (this.data[b] === f && this.data[b + 1] === y && this.data[b + 2] === w && this.data[b + 3] === _) return b - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(o) {
          var f = o.charCodeAt(0), y = o.charCodeAt(1), w = o.charCodeAt(2), _ = o.charCodeAt(3), b = this.readData(4);
          return f === b[0] && y === b[1] && w === b[2] && _ === b[3];
        }, s.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, f;
        }, a.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, a, l) {
        var n = e("../utils");
        function s(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var f, y = 0;
          for (this.checkOffset(o), f = this.index + o - 1; f >= this.index; f--) y = (y << 8) + this.byteAt(f);
          return this.index += o, y;
        }, readString: function(o) {
          return n.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, a.exports = s;
      }, { "../utils": 32 }], 19: [function(e, a, l) {
        var n = e("./Uint8ArrayReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(o) {
          this.checkOffset(o);
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, f;
        }, a.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, a, l) {
        var n = e("./DataReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, s.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, s.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, s.prototype.readData = function(o) {
          this.checkOffset(o);
          var f = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, f;
        }, a.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, a, l) {
        var n = e("./ArrayReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var f = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, f;
        }, a.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, a, l) {
        var n = e("../utils"), s = e("../support"), o = e("./ArrayReader"), f = e("./StringReader"), y = e("./NodeBufferReader"), w = e("./Uint8ArrayReader");
        a.exports = function(_) {
          var b = n.getTypeOf(_);
          return n.checkSupport(b), b !== "string" || s.uint8array ? b === "nodebuffer" ? new y(_) : s.uint8array ? new w(n.transformTo("uint8array", _)) : new o(n.transformTo("array", _)) : new f(_);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, a, l) {
        l.LOCAL_FILE_HEADER = "PK", l.CENTRAL_FILE_HEADER = "PK", l.CENTRAL_DIRECTORY_END = "PK", l.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", l.ZIP64_CENTRAL_DIRECTORY_END = "PK", l.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, a, l) {
        var n = e("./GenericWorker"), s = e("../utils");
        function o(f) {
          n.call(this, "ConvertWorker to " + f), this.destType = f;
        }
        s.inherits(o, n), o.prototype.processChunk = function(f) {
          this.push({ data: s.transformTo(this.destType, f.data), meta: f.meta });
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, a, l) {
        var n = e("./GenericWorker"), s = e("../crc32");
        function o() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, n), o.prototype.processChunk = function(f) {
          this.streamInfo.crc32 = s(f.data, this.streamInfo.crc32 || 0), this.push(f);
        }, a.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, a, l) {
        var n = e("../utils"), s = e("./GenericWorker");
        function o(f) {
          s.call(this, "DataLengthProbe for " + f), this.propName = f, this.withStreamInfo(f, 0);
        }
        n.inherits(o, s), o.prototype.processChunk = function(f) {
          if (f) {
            var y = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = y + f.data.length;
          }
          s.prototype.processChunk.call(this, f);
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, a, l) {
        var n = e("../utils"), s = e("./GenericWorker");
        function o(f) {
          s.call(this, "DataWorker");
          var y = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, f.then(function(w) {
            y.dataIsReady = !0, y.data = w, y.max = w && w.length || 0, y.type = n.getTypeOf(w), y.isPaused || y._tickAndRepeat();
          }, function(w) {
            y.error(w);
          });
        }
        n.inherits(o, s), o.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var f = null, y = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              f = this.data.substring(this.index, y);
              break;
            case "uint8array":
              f = this.data.subarray(this.index, y);
              break;
            case "array":
            case "nodebuffer":
              f = this.data.slice(this.index, y);
          }
          return this.index = y, this.push({ data: f, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, a.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, a, l) {
        function n(s) {
          this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(s) {
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
        }, on: function(s, o) {
          return this._listeners[s].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, o) {
          if (this._listeners[s]) for (var f = 0; f < this._listeners[s].length; f++) this._listeners[s][f].call(this, o);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var o = this;
          return s.on("data", function(f) {
            o.processChunk(f);
          }), s.on("end", function() {
            o.end();
          }), s.on("error", function(f) {
            o.error(f);
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
        }, withStreamInfo: function(s, o) {
          return this.extraStreamInfo[s] = o, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var s = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + s : s;
        } }, a.exports = n;
      }, {}], 29: [function(e, a, l) {
        var n = e("../utils"), s = e("./ConvertWorker"), o = e("./GenericWorker"), f = e("../base64"), y = e("../support"), w = e("../external"), _ = null;
        if (y.nodestream) try {
          _ = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function b(h, i) {
          return new w.Promise(function(p, u) {
            var x = [], k = h._internalType, A = h._outputType, E = h._mimeType;
            h.on("data", function(P, N) {
              x.push(P), i && i(N);
            }).on("error", function(P) {
              x = [], u(P);
            }).on("end", function() {
              try {
                var P = (function(N, j, z) {
                  switch (N) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", j), z);
                    case "base64":
                      return f.encode(j);
                    default:
                      return n.transformTo(N, j);
                  }
                })(A, (function(N, j) {
                  var z, L = 0, V = null, M = 0;
                  for (z = 0; z < j.length; z++) M += j[z].length;
                  switch (N) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (V = new Uint8Array(M), z = 0; z < j.length; z++) V.set(j[z], L), L += j[z].length;
                      return V;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + N + "'");
                  }
                })(k, x), E);
                p(P);
              } catch (N) {
                u(N);
              }
              x = [];
            }).resume();
          });
        }
        function d(h, i, p) {
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
            this._internalType = u, this._outputType = i, this._mimeType = p, n.checkSupport(u), this._worker = h.pipe(new s(u)), h.lock();
          } catch (x) {
            this._worker = new o("error"), this._worker.error(x);
          }
        }
        d.prototype = { accumulate: function(h) {
          return b(this, h);
        }, on: function(h, i) {
          var p = this;
          return h === "data" ? this._worker.on(h, function(u) {
            i.call(p, u.data, u.meta);
          }) : this._worker.on(h, function() {
            n.delay(i, arguments, p);
          }), this;
        }, resume: function() {
          return n.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(h) {
          if (n.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new _(this, { objectMode: this._outputType !== "nodebuffer" }, h);
        } }, a.exports = d;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, a, l) {
        if (l.base64 = !0, l.array = !0, l.string = !0, l.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", l.nodebuffer = typeof Buffer < "u", l.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") l.blob = !1;
        else {
          var n = new ArrayBuffer(0);
          try {
            l.blob = new Blob([n], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              s.append(n), l.blob = s.getBlob("application/zip").size === 0;
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
        for (var n = e("./utils"), s = e("./support"), o = e("./nodejsUtils"), f = e("./stream/GenericWorker"), y = new Array(256), w = 0; w < 256; w++) y[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
        y[254] = y[254] = 1;
        function _() {
          f.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function b() {
          f.call(this, "utf-8 encode");
        }
        l.utf8encode = function(d) {
          return s.nodebuffer ? o.newBufferFrom(d, "utf-8") : (function(h) {
            var i, p, u, x, k, A = h.length, E = 0;
            for (x = 0; x < A; x++) (64512 & (p = h.charCodeAt(x))) == 55296 && x + 1 < A && (64512 & (u = h.charCodeAt(x + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (u - 56320), x++), E += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (i = s.uint8array ? new Uint8Array(E) : new Array(E), x = k = 0; k < E; x++) (64512 & (p = h.charCodeAt(x))) == 55296 && x + 1 < A && (64512 & (u = h.charCodeAt(x + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (u - 56320), x++), p < 128 ? i[k++] = p : (p < 2048 ? i[k++] = 192 | p >>> 6 : (p < 65536 ? i[k++] = 224 | p >>> 12 : (i[k++] = 240 | p >>> 18, i[k++] = 128 | p >>> 12 & 63), i[k++] = 128 | p >>> 6 & 63), i[k++] = 128 | 63 & p);
            return i;
          })(d);
        }, l.utf8decode = function(d) {
          return s.nodebuffer ? n.transformTo("nodebuffer", d).toString("utf-8") : (function(h) {
            var i, p, u, x, k = h.length, A = new Array(2 * k);
            for (i = p = 0; i < k; ) if ((u = h[i++]) < 128) A[p++] = u;
            else if (4 < (x = y[u])) A[p++] = 65533, i += x - 1;
            else {
              for (u &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && i < k; ) u = u << 6 | 63 & h[i++], x--;
              1 < x ? A[p++] = 65533 : u < 65536 ? A[p++] = u : (u -= 65536, A[p++] = 55296 | u >> 10 & 1023, A[p++] = 56320 | 1023 & u);
            }
            return A.length !== p && (A.subarray ? A = A.subarray(0, p) : A.length = p), n.applyFromCharCode(A);
          })(d = n.transformTo(s.uint8array ? "uint8array" : "array", d));
        }, n.inherits(_, f), _.prototype.processChunk = function(d) {
          var h = n.transformTo(s.uint8array ? "uint8array" : "array", d.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var i = h;
              (h = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), h.set(i, this.leftOver.length);
            } else h = this.leftOver.concat(h);
            this.leftOver = null;
          }
          var p = (function(x, k) {
            var A;
            for ((k = k || x.length) > x.length && (k = x.length), A = k - 1; 0 <= A && (192 & x[A]) == 128; ) A--;
            return A < 0 || A === 0 ? k : A + y[x[A]] > k ? A : k;
          })(h), u = h;
          p !== h.length && (s.uint8array ? (u = h.subarray(0, p), this.leftOver = h.subarray(p, h.length)) : (u = h.slice(0, p), this.leftOver = h.slice(p, h.length))), this.push({ data: l.utf8decode(u), meta: d.meta });
        }, _.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: l.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, l.Utf8DecodeWorker = _, n.inherits(b, f), b.prototype.processChunk = function(d) {
          this.push({ data: l.utf8encode(d.data), meta: d.meta });
        }, l.Utf8EncodeWorker = b;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, a, l) {
        var n = e("./support"), s = e("./base64"), o = e("./nodejsUtils"), f = e("./external");
        function y(i) {
          return i;
        }
        function w(i, p) {
          for (var u = 0; u < i.length; ++u) p[u] = 255 & i.charCodeAt(u);
          return p;
        }
        e("setimmediate"), l.newBlob = function(i, p) {
          l.checkSupport("blob");
          try {
            return new Blob([i], { type: p });
          } catch {
            try {
              var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return u.append(i), u.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var _ = { stringifyByChunk: function(i, p, u) {
          var x = [], k = 0, A = i.length;
          if (A <= u) return String.fromCharCode.apply(null, i);
          for (; k < A; ) p === "array" || p === "nodebuffer" ? x.push(String.fromCharCode.apply(null, i.slice(k, Math.min(k + u, A)))) : x.push(String.fromCharCode.apply(null, i.subarray(k, Math.min(k + u, A)))), k += u;
          return x.join("");
        }, stringifyByChar: function(i) {
          for (var p = "", u = 0; u < i.length; u++) p += String.fromCharCode(i[u]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return n.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return n.nodebuffer && String.fromCharCode.apply(null, o.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function b(i) {
          var p = 65536, u = l.getTypeOf(i), x = !0;
          if (u === "uint8array" ? x = _.applyCanBeUsed.uint8array : u === "nodebuffer" && (x = _.applyCanBeUsed.nodebuffer), x) for (; 1 < p; ) try {
            return _.stringifyByChunk(i, u, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return _.stringifyByChar(i);
        }
        function d(i, p) {
          for (var u = 0; u < i.length; u++) p[u] = i[u];
          return p;
        }
        l.applyFromCharCode = b;
        var h = {};
        h.string = { string: y, array: function(i) {
          return w(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return h.string.uint8array(i).buffer;
        }, uint8array: function(i) {
          return w(i, new Uint8Array(i.length));
        }, nodebuffer: function(i) {
          return w(i, o.allocBuffer(i.length));
        } }, h.array = { string: b, array: y, arraybuffer: function(i) {
          return new Uint8Array(i).buffer;
        }, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return o.newBufferFrom(i);
        } }, h.arraybuffer = { string: function(i) {
          return b(new Uint8Array(i));
        }, array: function(i) {
          return d(new Uint8Array(i), new Array(i.byteLength));
        }, arraybuffer: y, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return o.newBufferFrom(new Uint8Array(i));
        } }, h.uint8array = { string: b, array: function(i) {
          return d(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return i.buffer;
        }, uint8array: y, nodebuffer: function(i) {
          return o.newBufferFrom(i);
        } }, h.nodebuffer = { string: b, array: function(i) {
          return d(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return h.nodebuffer.uint8array(i).buffer;
        }, uint8array: function(i) {
          return d(i, new Uint8Array(i.length));
        }, nodebuffer: y }, l.transformTo = function(i, p) {
          if (p = p || "", !i) return p;
          l.checkSupport(i);
          var u = l.getTypeOf(p);
          return h[u][i](p);
        }, l.resolve = function(i) {
          for (var p = i.split("/"), u = [], x = 0; x < p.length; x++) {
            var k = p[x];
            k === "." || k === "" && x !== 0 && x !== p.length - 1 || (k === ".." ? u.pop() : u.push(k));
          }
          return u.join("/");
        }, l.getTypeOf = function(i) {
          return typeof i == "string" ? "string" : Object.prototype.toString.call(i) === "[object Array]" ? "array" : n.nodebuffer && o.isBuffer(i) ? "nodebuffer" : n.uint8array && i instanceof Uint8Array ? "uint8array" : n.arraybuffer && i instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, l.checkSupport = function(i) {
          if (!n[i.toLowerCase()]) throw new Error(i + " is not supported by this platform");
        }, l.MAX_VALUE_16BITS = 65535, l.MAX_VALUE_32BITS = -1, l.pretty = function(i) {
          var p, u, x = "";
          for (u = 0; u < (i || "").length; u++) x += "\\x" + ((p = i.charCodeAt(u)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return x;
        }, l.delay = function(i, p, u) {
          setImmediate(function() {
            i.apply(u || null, p || []);
          });
        }, l.inherits = function(i, p) {
          function u() {
          }
          u.prototype = p.prototype, i.prototype = new u();
        }, l.extend = function() {
          var i, p, u = {};
          for (i = 0; i < arguments.length; i++) for (p in arguments[i]) Object.prototype.hasOwnProperty.call(arguments[i], p) && u[p] === void 0 && (u[p] = arguments[i][p]);
          return u;
        }, l.prepareContent = function(i, p, u, x, k) {
          return f.Promise.resolve(p).then(function(A) {
            return n.blob && (A instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(A)) !== -1) && typeof FileReader < "u" ? new f.Promise(function(E, P) {
              var N = new FileReader();
              N.onload = function(j) {
                E(j.target.result);
              }, N.onerror = function(j) {
                P(j.target.error);
              }, N.readAsArrayBuffer(A);
            }) : A;
          }).then(function(A) {
            var E = l.getTypeOf(A);
            return E ? (E === "arraybuffer" ? A = l.transformTo("uint8array", A) : E === "string" && (k ? A = s.decode(A) : u && x !== !0 && (A = (function(P) {
              return w(P, n.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(A))), A) : f.Promise.reject(new Error("Can't read the data of '" + i + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, a, l) {
        var n = e("./reader/readerFor"), s = e("./utils"), o = e("./signature"), f = e("./zipEntry"), y = e("./support");
        function w(_) {
          this.files = [], this.loadOptions = _;
        }
        w.prototype = { checkSignature: function(_) {
          if (!this.reader.readAndCheckSignature(_)) {
            this.reader.index -= 4;
            var b = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(b) + ", expected " + s.pretty(_) + ")");
          }
        }, isSignature: function(_, b) {
          var d = this.reader.index;
          this.reader.setIndex(_);
          var h = this.reader.readString(4) === b;
          return this.reader.setIndex(d), h;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var _ = this.reader.readData(this.zipCommentLength), b = y.uint8array ? "uint8array" : "array", d = s.transformTo(b, _);
          this.zipComment = this.loadOptions.decodeFileName(d);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var _, b, d, h = this.zip64EndOfCentralSize - 44; 0 < h; ) _ = this.reader.readInt(2), b = this.reader.readInt(4), d = this.reader.readData(b), this.zip64ExtensibleData[_] = { id: _, length: b, value: d };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var _, b;
          for (_ = 0; _ < this.files.length; _++) b = this.files[_], this.reader.setIndex(b.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), b.readLocalPart(this.reader), b.handleUTF8(), b.processAttributes();
        }, readCentralDir: function() {
          var _;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (_ = new f({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var _ = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (_ < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(_);
          var b = _;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (_ = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(_), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var d = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);
          var h = b - d;
          if (0 < h) this.isSignature(b, o.CENTRAL_FILE_HEADER) || (this.reader.zero = h);
          else if (h < 0) throw new Error("Corrupted zip: missing " + Math.abs(h) + " bytes.");
        }, prepareReader: function(_) {
          this.reader = n(_);
        }, load: function(_) {
          this.prepareReader(_), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, a.exports = w;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, a, l) {
        var n = e("./reader/readerFor"), s = e("./utils"), o = e("./compressedObject"), f = e("./crc32"), y = e("./utf8"), w = e("./compressions"), _ = e("./support");
        function b(d, h) {
          this.options = d, this.loadOptions = h;
        }
        b.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(d) {
          var h, i;
          if (d.skip(22), this.fileNameLength = d.readInt(2), i = d.readInt(2), this.fileName = d.readData(this.fileNameLength), d.skip(i), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((h = (function(p) {
            for (var u in w) if (Object.prototype.hasOwnProperty.call(w, u) && w[u].magic === p) return w[u];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
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
            var d = n(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = d.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = d.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = d.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = d.readInt(4));
          }
        }, readExtraFields: function(d) {
          var h, i, p, u = d.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); d.index + 4 < u; ) h = d.readInt(2), i = d.readInt(2), p = d.readData(i), this.extraFields[h] = { id: h, length: i, value: p };
          d.setIndex(u);
        }, handleUTF8: function() {
          var d = _.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = y.utf8decode(this.fileName), this.fileCommentStr = y.utf8decode(this.fileComment);
          else {
            var h = this.findExtraFieldUnicodePath();
            if (h !== null) this.fileNameStr = h;
            else {
              var i = s.transformTo(d, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(i);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var u = s.transformTo(d, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(u);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var d = this.extraFields[28789];
          if (d) {
            var h = n(d.value);
            return h.readInt(1) !== 1 || f(this.fileName) !== h.readInt(4) ? null : y.utf8decode(h.readData(d.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var d = this.extraFields[25461];
          if (d) {
            var h = n(d.value);
            return h.readInt(1) !== 1 || f(this.fileComment) !== h.readInt(4) ? null : y.utf8decode(h.readData(d.length - 5));
          }
          return null;
        } }, a.exports = b;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, a, l) {
        function n(h, i, p) {
          this.name = h, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = i, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), f = e("./utf8"), y = e("./compressedObject"), w = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(h) {
          var i = null, p = "string";
          try {
            if (!h) throw new Error("No output type specified.");
            var u = (p = h.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), i = this._decompressWorker();
            var x = !this._dataBinary;
            x && !u && (i = i.pipe(new f.Utf8EncodeWorker())), !x && u && (i = i.pipe(new f.Utf8DecodeWorker()));
          } catch (k) {
            (i = new w("error")).error(k);
          }
          return new s(i, p, "");
        }, async: function(h, i) {
          return this.internalStream(h).accumulate(i);
        }, nodeStream: function(h, i) {
          return this.internalStream(h || "nodebuffer").toNodejsStream(i);
        }, _compressWorker: function(h, i) {
          if (this._data instanceof y && this._data.compression.magic === h.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new f.Utf8EncodeWorker())), y.createWorkerFrom(p, h, i);
        }, _decompressWorker: function() {
          return this._data instanceof y ? this._data.getContentWorker() : this._data instanceof w ? this._data : new o(this._data);
        } };
        for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], b = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, d = 0; d < _.length; d++) n.prototype[_[d]] = b;
        a.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, a, l) {
        (function(n) {
          var s, o, f = n.MutationObserver || n.WebKitMutationObserver;
          if (f) {
            var y = 0, w = new f(h), _ = n.document.createTextNode("");
            w.observe(_, { characterData: !0 }), s = function() {
              _.data = y = ++y % 2;
            };
          } else if (n.setImmediate || n.MessageChannel === void 0) s = "document" in n && "onreadystatechange" in n.document.createElement("script") ? function() {
            var i = n.document.createElement("script");
            i.onreadystatechange = function() {
              h(), i.onreadystatechange = null, i.parentNode.removeChild(i), i = null;
            }, n.document.documentElement.appendChild(i);
          } : function() {
            setTimeout(h, 0);
          };
          else {
            var b = new n.MessageChannel();
            b.port1.onmessage = h, s = function() {
              b.port2.postMessage(0);
            };
          }
          var d = [];
          function h() {
            var i, p;
            o = !0;
            for (var u = d.length; u; ) {
              for (p = d, d = [], i = -1; ++i < u; ) p[i]();
              u = d.length;
            }
            o = !1;
          }
          a.exports = function(i) {
            d.push(i) !== 1 || o || s();
          };
        }).call(this, typeof Dt < "u" ? Dt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, a, l) {
        var n = e("immediate");
        function s() {
        }
        var o = {}, f = ["REJECTED"], y = ["FULFILLED"], w = ["PENDING"];
        function _(u) {
          if (typeof u != "function") throw new TypeError("resolver must be a function");
          this.state = w, this.queue = [], this.outcome = void 0, u !== s && i(this, u);
        }
        function b(u, x, k) {
          this.promise = u, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof k == "function" && (this.onRejected = k, this.callRejected = this.otherCallRejected);
        }
        function d(u, x, k) {
          n(function() {
            var A;
            try {
              A = x(k);
            } catch (E) {
              return o.reject(u, E);
            }
            A === u ? o.reject(u, new TypeError("Cannot resolve promise with itself")) : o.resolve(u, A);
          });
        }
        function h(u) {
          var x = u && u.then;
          if (u && (typeof u == "object" || typeof u == "function") && typeof x == "function") return function() {
            x.apply(u, arguments);
          };
        }
        function i(u, x) {
          var k = !1;
          function A(N) {
            k || (k = !0, o.reject(u, N));
          }
          function E(N) {
            k || (k = !0, o.resolve(u, N));
          }
          var P = p(function() {
            x(E, A);
          });
          P.status === "error" && A(P.value);
        }
        function p(u, x) {
          var k = {};
          try {
            k.value = u(x), k.status = "success";
          } catch (A) {
            k.status = "error", k.value = A;
          }
          return k;
        }
        (a.exports = _).prototype.finally = function(u) {
          if (typeof u != "function") return this;
          var x = this.constructor;
          return this.then(function(k) {
            return x.resolve(u()).then(function() {
              return k;
            });
          }, function(k) {
            return x.resolve(u()).then(function() {
              throw k;
            });
          });
        }, _.prototype.catch = function(u) {
          return this.then(null, u);
        }, _.prototype.then = function(u, x) {
          if (typeof u != "function" && this.state === y || typeof x != "function" && this.state === f) return this;
          var k = new this.constructor(s);
          return this.state !== w ? d(k, this.state === y ? u : x, this.outcome) : this.queue.push(new b(k, u, x)), k;
        }, b.prototype.callFulfilled = function(u) {
          o.resolve(this.promise, u);
        }, b.prototype.otherCallFulfilled = function(u) {
          d(this.promise, this.onFulfilled, u);
        }, b.prototype.callRejected = function(u) {
          o.reject(this.promise, u);
        }, b.prototype.otherCallRejected = function(u) {
          d(this.promise, this.onRejected, u);
        }, o.resolve = function(u, x) {
          var k = p(h, x);
          if (k.status === "error") return o.reject(u, k.value);
          var A = k.value;
          if (A) i(u, A);
          else {
            u.state = y, u.outcome = x;
            for (var E = -1, P = u.queue.length; ++E < P; ) u.queue[E].callFulfilled(x);
          }
          return u;
        }, o.reject = function(u, x) {
          u.state = f, u.outcome = x;
          for (var k = -1, A = u.queue.length; ++k < A; ) u.queue[k].callRejected(x);
          return u;
        }, _.resolve = function(u) {
          return u instanceof this ? u : o.resolve(new this(s), u);
        }, _.reject = function(u) {
          var x = new this(s);
          return o.reject(x, u);
        }, _.all = function(u) {
          var x = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = u.length, A = !1;
          if (!k) return this.resolve([]);
          for (var E = new Array(k), P = 0, N = -1, j = new this(s); ++N < k; ) z(u[N], N);
          return j;
          function z(L, V) {
            x.resolve(L).then(function(M) {
              E[V] = M, ++P !== k || A || (A = !0, o.resolve(j, E));
            }, function(M) {
              A || (A = !0, o.reject(j, M));
            });
          }
        }, _.race = function(u) {
          var x = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = u.length, A = !1;
          if (!k) return this.resolve([]);
          for (var E = -1, P = new this(s); ++E < k; ) N = u[E], x.resolve(N).then(function(j) {
            A || (A = !0, o.resolve(P, j));
          }, function(j) {
            A || (A = !0, o.reject(P, j));
          });
          var N;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, a, l) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), a.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, a, l) {
        var n = e("./zlib/deflate"), s = e("./utils/common"), o = e("./utils/strings"), f = e("./zlib/messages"), y = e("./zlib/zstream"), w = Object.prototype.toString, _ = 0, b = -1, d = 0, h = 8;
        function i(u) {
          if (!(this instanceof i)) return new i(u);
          this.options = s.assign({ level: b, method: h, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: d, to: "" }, u || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var k = n.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (k !== _) throw new Error(f[k]);
          if (x.header && n.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var A;
            if (A = typeof x.dictionary == "string" ? o.string2buf(x.dictionary) : w.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (k = n.deflateSetDictionary(this.strm, A)) !== _) throw new Error(f[k]);
            this._dict_set = !0;
          }
        }
        function p(u, x) {
          var k = new i(x);
          if (k.push(u, !0), k.err) throw k.msg || f[k.err];
          return k.result;
        }
        i.prototype.push = function(u, x) {
          var k, A, E = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          A = x === ~~x ? x : x === !0 ? 4 : 0, typeof u == "string" ? E.input = o.string2buf(u) : w.call(u) === "[object ArrayBuffer]" ? E.input = new Uint8Array(u) : E.input = u, E.next_in = 0, E.avail_in = E.input.length;
          do {
            if (E.avail_out === 0 && (E.output = new s.Buf8(P), E.next_out = 0, E.avail_out = P), (k = n.deflate(E, A)) !== 1 && k !== _) return this.onEnd(k), !(this.ended = !0);
            E.avail_out !== 0 && (E.avail_in !== 0 || A !== 4 && A !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(s.shrinkBuf(E.output, E.next_out))) : this.onData(s.shrinkBuf(E.output, E.next_out)));
          } while ((0 < E.avail_in || E.avail_out === 0) && k !== 1);
          return A === 4 ? (k = n.deflateEnd(this.strm), this.onEnd(k), this.ended = !0, k === _) : A !== 2 || (this.onEnd(_), !(E.avail_out = 0));
        }, i.prototype.onData = function(u) {
          this.chunks.push(u);
        }, i.prototype.onEnd = function(u) {
          u === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, l.Deflate = i, l.deflate = p, l.deflateRaw = function(u, x) {
          return (x = x || {}).raw = !0, p(u, x);
        }, l.gzip = function(u, x) {
          return (x = x || {}).gzip = !0, p(u, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, a, l) {
        var n = e("./zlib/inflate"), s = e("./utils/common"), o = e("./utils/strings"), f = e("./zlib/constants"), y = e("./zlib/messages"), w = e("./zlib/zstream"), _ = e("./zlib/gzheader"), b = Object.prototype.toString;
        function d(i) {
          if (!(this instanceof d)) return new d(i);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, i || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || i && i.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
          var u = n.inflateInit2(this.strm, p.windowBits);
          if (u !== f.Z_OK) throw new Error(y[u]);
          this.header = new _(), n.inflateGetHeader(this.strm, this.header);
        }
        function h(i, p) {
          var u = new d(p);
          if (u.push(i, !0), u.err) throw u.msg || y[u.err];
          return u.result;
        }
        d.prototype.push = function(i, p) {
          var u, x, k, A, E, P, N = this.strm, j = this.options.chunkSize, z = this.options.dictionary, L = !1;
          if (this.ended) return !1;
          x = p === ~~p ? p : p === !0 ? f.Z_FINISH : f.Z_NO_FLUSH, typeof i == "string" ? N.input = o.binstring2buf(i) : b.call(i) === "[object ArrayBuffer]" ? N.input = new Uint8Array(i) : N.input = i, N.next_in = 0, N.avail_in = N.input.length;
          do {
            if (N.avail_out === 0 && (N.output = new s.Buf8(j), N.next_out = 0, N.avail_out = j), (u = n.inflate(N, f.Z_NO_FLUSH)) === f.Z_NEED_DICT && z && (P = typeof z == "string" ? o.string2buf(z) : b.call(z) === "[object ArrayBuffer]" ? new Uint8Array(z) : z, u = n.inflateSetDictionary(this.strm, P)), u === f.Z_BUF_ERROR && L === !0 && (u = f.Z_OK, L = !1), u !== f.Z_STREAM_END && u !== f.Z_OK) return this.onEnd(u), !(this.ended = !0);
            N.next_out && (N.avail_out !== 0 && u !== f.Z_STREAM_END && (N.avail_in !== 0 || x !== f.Z_FINISH && x !== f.Z_SYNC_FLUSH) || (this.options.to === "string" ? (k = o.utf8border(N.output, N.next_out), A = N.next_out - k, E = o.buf2string(N.output, k), N.next_out = A, N.avail_out = j - A, A && s.arraySet(N.output, N.output, k, A, 0), this.onData(E)) : this.onData(s.shrinkBuf(N.output, N.next_out)))), N.avail_in === 0 && N.avail_out === 0 && (L = !0);
          } while ((0 < N.avail_in || N.avail_out === 0) && u !== f.Z_STREAM_END);
          return u === f.Z_STREAM_END && (x = f.Z_FINISH), x === f.Z_FINISH ? (u = n.inflateEnd(this.strm), this.onEnd(u), this.ended = !0, u === f.Z_OK) : x !== f.Z_SYNC_FLUSH || (this.onEnd(f.Z_OK), !(N.avail_out = 0));
        }, d.prototype.onData = function(i) {
          this.chunks.push(i);
        }, d.prototype.onEnd = function(i) {
          i === f.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
        }, l.Inflate = d, l.inflate = h, l.inflateRaw = function(i, p) {
          return (p = p || {}).raw = !0, h(i, p);
        }, l.ungzip = h;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, a, l) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        l.assign = function(f) {
          for (var y = Array.prototype.slice.call(arguments, 1); y.length; ) {
            var w = y.shift();
            if (w) {
              if (typeof w != "object") throw new TypeError(w + "must be non-object");
              for (var _ in w) w.hasOwnProperty(_) && (f[_] = w[_]);
            }
          }
          return f;
        }, l.shrinkBuf = function(f, y) {
          return f.length === y ? f : f.subarray ? f.subarray(0, y) : (f.length = y, f);
        };
        var s = { arraySet: function(f, y, w, _, b) {
          if (y.subarray && f.subarray) f.set(y.subarray(w, w + _), b);
          else for (var d = 0; d < _; d++) f[b + d] = y[w + d];
        }, flattenChunks: function(f) {
          var y, w, _, b, d, h;
          for (y = _ = 0, w = f.length; y < w; y++) _ += f[y].length;
          for (h = new Uint8Array(_), y = b = 0, w = f.length; y < w; y++) d = f[y], h.set(d, b), b += d.length;
          return h;
        } }, o = { arraySet: function(f, y, w, _, b) {
          for (var d = 0; d < _; d++) f[b + d] = y[w + d];
        }, flattenChunks: function(f) {
          return [].concat.apply([], f);
        } };
        l.setTyped = function(f) {
          f ? (l.Buf8 = Uint8Array, l.Buf16 = Uint16Array, l.Buf32 = Int32Array, l.assign(l, s)) : (l.Buf8 = Array, l.Buf16 = Array, l.Buf32 = Array, l.assign(l, o));
        }, l.setTyped(n);
      }, {}], 42: [function(e, a, l) {
        var n = e("./common"), s = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var f = new n.Buf8(256), y = 0; y < 256; y++) f[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        function w(_, b) {
          if (b < 65537 && (_.subarray && o || !_.subarray && s)) return String.fromCharCode.apply(null, n.shrinkBuf(_, b));
          for (var d = "", h = 0; h < b; h++) d += String.fromCharCode(_[h]);
          return d;
        }
        f[254] = f[254] = 1, l.string2buf = function(_) {
          var b, d, h, i, p, u = _.length, x = 0;
          for (i = 0; i < u; i++) (64512 & (d = _.charCodeAt(i))) == 55296 && i + 1 < u && (64512 & (h = _.charCodeAt(i + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), i++), x += d < 128 ? 1 : d < 2048 ? 2 : d < 65536 ? 3 : 4;
          for (b = new n.Buf8(x), i = p = 0; p < x; i++) (64512 & (d = _.charCodeAt(i))) == 55296 && i + 1 < u && (64512 & (h = _.charCodeAt(i + 1))) == 56320 && (d = 65536 + (d - 55296 << 10) + (h - 56320), i++), d < 128 ? b[p++] = d : (d < 2048 ? b[p++] = 192 | d >>> 6 : (d < 65536 ? b[p++] = 224 | d >>> 12 : (b[p++] = 240 | d >>> 18, b[p++] = 128 | d >>> 12 & 63), b[p++] = 128 | d >>> 6 & 63), b[p++] = 128 | 63 & d);
          return b;
        }, l.buf2binstring = function(_) {
          return w(_, _.length);
        }, l.binstring2buf = function(_) {
          for (var b = new n.Buf8(_.length), d = 0, h = b.length; d < h; d++) b[d] = _.charCodeAt(d);
          return b;
        }, l.buf2string = function(_, b) {
          var d, h, i, p, u = b || _.length, x = new Array(2 * u);
          for (d = h = 0; d < u; ) if ((i = _[d++]) < 128) x[h++] = i;
          else if (4 < (p = f[i])) x[h++] = 65533, d += p - 1;
          else {
            for (i &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && d < u; ) i = i << 6 | 63 & _[d++], p--;
            1 < p ? x[h++] = 65533 : i < 65536 ? x[h++] = i : (i -= 65536, x[h++] = 55296 | i >> 10 & 1023, x[h++] = 56320 | 1023 & i);
          }
          return w(x, h);
        }, l.utf8border = function(_, b) {
          var d;
          for ((b = b || _.length) > _.length && (b = _.length), d = b - 1; 0 <= d && (192 & _[d]) == 128; ) d--;
          return d < 0 || d === 0 ? b : d + f[_[d]] > b ? d : b;
        };
      }, { "./common": 41 }], 43: [function(e, a, l) {
        a.exports = function(n, s, o, f) {
          for (var y = 65535 & n | 0, w = n >>> 16 & 65535 | 0, _ = 0; o !== 0; ) {
            for (o -= _ = 2e3 < o ? 2e3 : o; w = w + (y = y + s[f++] | 0) | 0, --_; ) ;
            y %= 65521, w %= 65521;
          }
          return y | w << 16 | 0;
        };
      }, {}], 44: [function(e, a, l) {
        a.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, a, l) {
        var n = (function() {
          for (var s, o = [], f = 0; f < 256; f++) {
            s = f;
            for (var y = 0; y < 8; y++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            o[f] = s;
          }
          return o;
        })();
        a.exports = function(s, o, f, y) {
          var w = n, _ = y + f;
          s ^= -1;
          for (var b = y; b < _; b++) s = s >>> 8 ^ w[255 & (s ^ o[b])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, a, l) {
        var n, s = e("../utils/common"), o = e("./trees"), f = e("./adler32"), y = e("./crc32"), w = e("./messages"), _ = 0, b = 4, d = 0, h = -2, i = -1, p = 4, u = 2, x = 8, k = 9, A = 286, E = 30, P = 19, N = 2 * A + 1, j = 15, z = 3, L = 258, V = L + z + 1, M = 42, D = 113, c = 1, $ = 2, it = 3, X = 4;
        function et(r, I) {
          return r.msg = w[I], I;
        }
        function Y(r) {
          return (r << 1) - (4 < r ? 9 : 0);
        }
        function rt(r) {
          for (var I = r.length; 0 <= --I; ) r[I] = 0;
        }
        function O(r) {
          var I = r.state, R = I.pending;
          R > r.avail_out && (R = r.avail_out), R !== 0 && (s.arraySet(r.output, I.pending_buf, I.pending_out, R, r.next_out), r.next_out += R, I.pending_out += R, r.total_out += R, r.avail_out -= R, I.pending -= R, I.pending === 0 && (I.pending_out = 0));
        }
        function T(r, I) {
          o._tr_flush_block(r, 0 <= r.block_start ? r.block_start : -1, r.strstart - r.block_start, I), r.block_start = r.strstart, O(r.strm);
        }
        function J(r, I) {
          r.pending_buf[r.pending++] = I;
        }
        function H(r, I) {
          r.pending_buf[r.pending++] = I >>> 8 & 255, r.pending_buf[r.pending++] = 255 & I;
        }
        function G(r, I) {
          var R, v, g = r.max_chain_length, S = r.strstart, F = r.prev_length, U = r.nice_match, C = r.strstart > r.w_size - V ? r.strstart - (r.w_size - V) : 0, W = r.window, q = r.w_mask, Z = r.prev, K = r.strstart + L, ot = W[S + F - 1], tt = W[S + F];
          r.prev_length >= r.good_match && (g >>= 2), U > r.lookahead && (U = r.lookahead);
          do
            if (W[(R = I) + F] === tt && W[R + F - 1] === ot && W[R] === W[S] && W[++R] === W[S + 1]) {
              S += 2, R++;
              do
                ;
              while (W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && W[++S] === W[++R] && S < K);
              if (v = L - (K - S), S = K - L, F < v) {
                if (r.match_start = I, U <= (F = v)) break;
                ot = W[S + F - 1], tt = W[S + F];
              }
            }
          while ((I = Z[I & q]) > C && --g != 0);
          return F <= r.lookahead ? F : r.lookahead;
        }
        function lt(r) {
          var I, R, v, g, S, F, U, C, W, q, Z = r.w_size;
          do {
            if (g = r.window_size - r.lookahead - r.strstart, r.strstart >= Z + (Z - V)) {
              for (s.arraySet(r.window, r.window, Z, Z, 0), r.match_start -= Z, r.strstart -= Z, r.block_start -= Z, I = R = r.hash_size; v = r.head[--I], r.head[I] = Z <= v ? v - Z : 0, --R; ) ;
              for (I = R = Z; v = r.prev[--I], r.prev[I] = Z <= v ? v - Z : 0, --R; ) ;
              g += Z;
            }
            if (r.strm.avail_in === 0) break;
            if (F = r.strm, U = r.window, C = r.strstart + r.lookahead, W = g, q = void 0, q = F.avail_in, W < q && (q = W), R = q === 0 ? 0 : (F.avail_in -= q, s.arraySet(U, F.input, F.next_in, q, C), F.state.wrap === 1 ? F.adler = f(F.adler, U, q, C) : F.state.wrap === 2 && (F.adler = y(F.adler, U, q, C)), F.next_in += q, F.total_in += q, q), r.lookahead += R, r.lookahead + r.insert >= z) for (S = r.strstart - r.insert, r.ins_h = r.window[S], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[S + 1]) & r.hash_mask; r.insert && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[S + z - 1]) & r.hash_mask, r.prev[S & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = S, S++, r.insert--, !(r.lookahead + r.insert < z)); ) ;
          } while (r.lookahead < V && r.strm.avail_in !== 0);
        }
        function ft(r, I) {
          for (var R, v; ; ) {
            if (r.lookahead < V) {
              if (lt(r), r.lookahead < V && I === _) return c;
              if (r.lookahead === 0) break;
            }
            if (R = 0, r.lookahead >= z && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, R = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), R !== 0 && r.strstart - R <= r.w_size - V && (r.match_length = G(r, R)), r.match_length >= z) if (v = o._tr_tally(r, r.strstart - r.match_start, r.match_length - z), r.lookahead -= r.match_length, r.match_length <= r.max_lazy_match && r.lookahead >= z) {
              for (r.match_length--; r.strstart++, r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, R = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart, --r.match_length != 0; ) ;
              r.strstart++;
            } else r.strstart += r.match_length, r.match_length = 0, r.ins_h = r.window[r.strstart], r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + 1]) & r.hash_mask;
            else v = o._tr_tally(r, 0, r.window[r.strstart]), r.lookahead--, r.strstart++;
            if (v && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = r.strstart < z - 1 ? r.strstart : z - 1, I === b ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function nt(r, I) {
          for (var R, v, g; ; ) {
            if (r.lookahead < V) {
              if (lt(r), r.lookahead < V && I === _) return c;
              if (r.lookahead === 0) break;
            }
            if (R = 0, r.lookahead >= z && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, R = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), r.prev_length = r.match_length, r.prev_match = r.match_start, r.match_length = z - 1, R !== 0 && r.prev_length < r.max_lazy_match && r.strstart - R <= r.w_size - V && (r.match_length = G(r, R), r.match_length <= 5 && (r.strategy === 1 || r.match_length === z && 4096 < r.strstart - r.match_start) && (r.match_length = z - 1)), r.prev_length >= z && r.match_length <= r.prev_length) {
              for (g = r.strstart + r.lookahead - z, v = o._tr_tally(r, r.strstart - 1 - r.prev_match, r.prev_length - z), r.lookahead -= r.prev_length - 1, r.prev_length -= 2; ++r.strstart <= g && (r.ins_h = (r.ins_h << r.hash_shift ^ r.window[r.strstart + z - 1]) & r.hash_mask, R = r.prev[r.strstart & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = r.strstart), --r.prev_length != 0; ) ;
              if (r.match_available = 0, r.match_length = z - 1, r.strstart++, v && (T(r, !1), r.strm.avail_out === 0)) return c;
            } else if (r.match_available) {
              if ((v = o._tr_tally(r, 0, r.window[r.strstart - 1])) && T(r, !1), r.strstart++, r.lookahead--, r.strm.avail_out === 0) return c;
            } else r.match_available = 1, r.strstart++, r.lookahead--;
          }
          return r.match_available && (v = o._tr_tally(r, 0, r.window[r.strstart - 1]), r.match_available = 0), r.insert = r.strstart < z - 1 ? r.strstart : z - 1, I === b ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : r.last_lit && (T(r, !1), r.strm.avail_out === 0) ? c : $;
        }
        function st(r, I, R, v, g) {
          this.good_length = r, this.max_lazy = I, this.nice_length = R, this.max_chain = v, this.func = g;
        }
        function ct() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * N), this.dyn_dtree = new s.Buf16(2 * (2 * E + 1)), this.bl_tree = new s.Buf16(2 * (2 * P + 1)), rt(this.dyn_ltree), rt(this.dyn_dtree), rt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(j + 1), this.heap = new s.Buf16(2 * A + 1), rt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * A + 1), rt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function at(r) {
          var I;
          return r && r.state ? (r.total_in = r.total_out = 0, r.data_type = u, (I = r.state).pending = 0, I.pending_out = 0, I.wrap < 0 && (I.wrap = -I.wrap), I.status = I.wrap ? M : D, r.adler = I.wrap === 2 ? 0 : 1, I.last_flush = _, o._tr_init(I), d) : et(r, h);
        }
        function _t(r) {
          var I = at(r);
          return I === d && (function(R) {
            R.window_size = 2 * R.w_size, rt(R.head), R.max_lazy_match = n[R.level].max_lazy, R.good_match = n[R.level].good_length, R.nice_match = n[R.level].nice_length, R.max_chain_length = n[R.level].max_chain, R.strstart = 0, R.block_start = 0, R.lookahead = 0, R.insert = 0, R.match_length = R.prev_length = z - 1, R.match_available = 0, R.ins_h = 0;
          })(r.state), I;
        }
        function B(r, I, R, v, g, S) {
          if (!r) return h;
          var F = 1;
          if (I === i && (I = 6), v < 0 ? (F = 0, v = -v) : 15 < v && (F = 2, v -= 16), g < 1 || k < g || R !== x || v < 8 || 15 < v || I < 0 || 9 < I || S < 0 || p < S) return et(r, h);
          v === 8 && (v = 9);
          var U = new ct();
          return (r.state = U).strm = r, U.wrap = F, U.gzhead = null, U.w_bits = v, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = g + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + z - 1) / z), U.window = new s.Buf8(2 * U.w_size), U.head = new s.Buf16(U.hash_size), U.prev = new s.Buf16(U.w_size), U.lit_bufsize = 1 << g + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new s.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = I, U.strategy = S, U.method = R, _t(r);
        }
        n = [new st(0, 0, 0, 0, function(r, I) {
          var R = 65535;
          for (R > r.pending_buf_size - 5 && (R = r.pending_buf_size - 5); ; ) {
            if (r.lookahead <= 1) {
              if (lt(r), r.lookahead === 0 && I === _) return c;
              if (r.lookahead === 0) break;
            }
            r.strstart += r.lookahead, r.lookahead = 0;
            var v = r.block_start + R;
            if ((r.strstart === 0 || r.strstart >= v) && (r.lookahead = r.strstart - v, r.strstart = v, T(r, !1), r.strm.avail_out === 0) || r.strstart - r.block_start >= r.w_size - V && (T(r, !1), r.strm.avail_out === 0)) return c;
          }
          return r.insert = 0, I === b ? (T(r, !0), r.strm.avail_out === 0 ? it : X) : (r.strstart > r.block_start && (T(r, !1), r.strm.avail_out), c);
        }), new st(4, 4, 8, 4, ft), new st(4, 5, 16, 8, ft), new st(4, 6, 32, 32, ft), new st(4, 4, 16, 16, nt), new st(8, 16, 32, 32, nt), new st(8, 16, 128, 128, nt), new st(8, 32, 128, 256, nt), new st(32, 128, 258, 1024, nt), new st(32, 258, 258, 4096, nt)], l.deflateInit = function(r, I) {
          return B(r, I, x, 15, 8, 0);
        }, l.deflateInit2 = B, l.deflateReset = _t, l.deflateResetKeep = at, l.deflateSetHeader = function(r, I) {
          return r && r.state ? r.state.wrap !== 2 ? h : (r.state.gzhead = I, d) : h;
        }, l.deflate = function(r, I) {
          var R, v, g, S;
          if (!r || !r.state || 5 < I || I < 0) return r ? et(r, h) : h;
          if (v = r.state, !r.output || !r.input && r.avail_in !== 0 || v.status === 666 && I !== b) return et(r, r.avail_out === 0 ? -5 : h);
          if (v.strm = r, R = v.last_flush, v.last_flush = I, v.status === M) if (v.wrap === 2) r.adler = 0, J(v, 31), J(v, 139), J(v, 8), v.gzhead ? (J(v, (v.gzhead.text ? 1 : 0) + (v.gzhead.hcrc ? 2 : 0) + (v.gzhead.extra ? 4 : 0) + (v.gzhead.name ? 8 : 0) + (v.gzhead.comment ? 16 : 0)), J(v, 255 & v.gzhead.time), J(v, v.gzhead.time >> 8 & 255), J(v, v.gzhead.time >> 16 & 255), J(v, v.gzhead.time >> 24 & 255), J(v, v.level === 9 ? 2 : 2 <= v.strategy || v.level < 2 ? 4 : 0), J(v, 255 & v.gzhead.os), v.gzhead.extra && v.gzhead.extra.length && (J(v, 255 & v.gzhead.extra.length), J(v, v.gzhead.extra.length >> 8 & 255)), v.gzhead.hcrc && (r.adler = y(r.adler, v.pending_buf, v.pending, 0)), v.gzindex = 0, v.status = 69) : (J(v, 0), J(v, 0), J(v, 0), J(v, 0), J(v, 0), J(v, v.level === 9 ? 2 : 2 <= v.strategy || v.level < 2 ? 4 : 0), J(v, 3), v.status = D);
          else {
            var F = x + (v.w_bits - 8 << 4) << 8;
            F |= (2 <= v.strategy || v.level < 2 ? 0 : v.level < 6 ? 1 : v.level === 6 ? 2 : 3) << 6, v.strstart !== 0 && (F |= 32), F += 31 - F % 31, v.status = D, H(v, F), v.strstart !== 0 && (H(v, r.adler >>> 16), H(v, 65535 & r.adler)), r.adler = 1;
          }
          if (v.status === 69) if (v.gzhead.extra) {
            for (g = v.pending; v.gzindex < (65535 & v.gzhead.extra.length) && (v.pending !== v.pending_buf_size || (v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), O(r), g = v.pending, v.pending !== v.pending_buf_size)); ) J(v, 255 & v.gzhead.extra[v.gzindex]), v.gzindex++;
            v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), v.gzindex === v.gzhead.extra.length && (v.gzindex = 0, v.status = 73);
          } else v.status = 73;
          if (v.status === 73) if (v.gzhead.name) {
            g = v.pending;
            do {
              if (v.pending === v.pending_buf_size && (v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), O(r), g = v.pending, v.pending === v.pending_buf_size)) {
                S = 1;
                break;
              }
              S = v.gzindex < v.gzhead.name.length ? 255 & v.gzhead.name.charCodeAt(v.gzindex++) : 0, J(v, S);
            } while (S !== 0);
            v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), S === 0 && (v.gzindex = 0, v.status = 91);
          } else v.status = 91;
          if (v.status === 91) if (v.gzhead.comment) {
            g = v.pending;
            do {
              if (v.pending === v.pending_buf_size && (v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), O(r), g = v.pending, v.pending === v.pending_buf_size)) {
                S = 1;
                break;
              }
              S = v.gzindex < v.gzhead.comment.length ? 255 & v.gzhead.comment.charCodeAt(v.gzindex++) : 0, J(v, S);
            } while (S !== 0);
            v.gzhead.hcrc && v.pending > g && (r.adler = y(r.adler, v.pending_buf, v.pending - g, g)), S === 0 && (v.status = 103);
          } else v.status = 103;
          if (v.status === 103 && (v.gzhead.hcrc ? (v.pending + 2 > v.pending_buf_size && O(r), v.pending + 2 <= v.pending_buf_size && (J(v, 255 & r.adler), J(v, r.adler >> 8 & 255), r.adler = 0, v.status = D)) : v.status = D), v.pending !== 0) {
            if (O(r), r.avail_out === 0) return v.last_flush = -1, d;
          } else if (r.avail_in === 0 && Y(I) <= Y(R) && I !== b) return et(r, -5);
          if (v.status === 666 && r.avail_in !== 0) return et(r, -5);
          if (r.avail_in !== 0 || v.lookahead !== 0 || I !== _ && v.status !== 666) {
            var U = v.strategy === 2 ? (function(C, W) {
              for (var q; ; ) {
                if (C.lookahead === 0 && (lt(C), C.lookahead === 0)) {
                  if (W === _) return c;
                  break;
                }
                if (C.match_length = 0, q = o._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, q && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, W === b ? (T(C, !0), C.strm.avail_out === 0 ? it : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : $;
            })(v, I) : v.strategy === 3 ? (function(C, W) {
              for (var q, Z, K, ot, tt = C.window; ; ) {
                if (C.lookahead <= L) {
                  if (lt(C), C.lookahead <= L && W === _) return c;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= z && 0 < C.strstart && (Z = tt[K = C.strstart - 1]) === tt[++K] && Z === tt[++K] && Z === tt[++K]) {
                  ot = C.strstart + L;
                  do
                    ;
                  while (Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && Z === tt[++K] && K < ot);
                  C.match_length = L - (ot - K), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= z ? (q = o._tr_tally(C, 1, C.match_length - z), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (q = o._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), q && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, W === b ? (T(C, !0), C.strm.avail_out === 0 ? it : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : $;
            })(v, I) : n[v.level].func(v, I);
            if (U !== it && U !== X || (v.status = 666), U === c || U === it) return r.avail_out === 0 && (v.last_flush = -1), d;
            if (U === $ && (I === 1 ? o._tr_align(v) : I !== 5 && (o._tr_stored_block(v, 0, 0, !1), I === 3 && (rt(v.head), v.lookahead === 0 && (v.strstart = 0, v.block_start = 0, v.insert = 0))), O(r), r.avail_out === 0)) return v.last_flush = -1, d;
          }
          return I !== b ? d : v.wrap <= 0 ? 1 : (v.wrap === 2 ? (J(v, 255 & r.adler), J(v, r.adler >> 8 & 255), J(v, r.adler >> 16 & 255), J(v, r.adler >> 24 & 255), J(v, 255 & r.total_in), J(v, r.total_in >> 8 & 255), J(v, r.total_in >> 16 & 255), J(v, r.total_in >> 24 & 255)) : (H(v, r.adler >>> 16), H(v, 65535 & r.adler)), O(r), 0 < v.wrap && (v.wrap = -v.wrap), v.pending !== 0 ? d : 1);
        }, l.deflateEnd = function(r) {
          var I;
          return r && r.state ? (I = r.state.status) !== M && I !== 69 && I !== 73 && I !== 91 && I !== 103 && I !== D && I !== 666 ? et(r, h) : (r.state = null, I === D ? et(r, -3) : d) : h;
        }, l.deflateSetDictionary = function(r, I) {
          var R, v, g, S, F, U, C, W, q = I.length;
          if (!r || !r.state || (S = (R = r.state).wrap) === 2 || S === 1 && R.status !== M || R.lookahead) return h;
          for (S === 1 && (r.adler = f(r.adler, I, q, 0)), R.wrap = 0, q >= R.w_size && (S === 0 && (rt(R.head), R.strstart = 0, R.block_start = 0, R.insert = 0), W = new s.Buf8(R.w_size), s.arraySet(W, I, q - R.w_size, R.w_size, 0), I = W, q = R.w_size), F = r.avail_in, U = r.next_in, C = r.input, r.avail_in = q, r.next_in = 0, r.input = I, lt(R); R.lookahead >= z; ) {
            for (v = R.strstart, g = R.lookahead - (z - 1); R.ins_h = (R.ins_h << R.hash_shift ^ R.window[v + z - 1]) & R.hash_mask, R.prev[v & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = v, v++, --g; ) ;
            R.strstart = v, R.lookahead = z - 1, lt(R);
          }
          return R.strstart += R.lookahead, R.block_start = R.strstart, R.insert = R.lookahead, R.lookahead = 0, R.match_length = R.prev_length = z - 1, R.match_available = 0, r.next_in = U, r.input = C, r.avail_in = F, R.wrap = S, d;
        }, l.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, a, l) {
        a.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, a, l) {
        a.exports = function(n, s) {
          var o, f, y, w, _, b, d, h, i, p, u, x, k, A, E, P, N, j, z, L, V, M, D, c, $;
          o = n.state, f = n.next_in, c = n.input, y = f + (n.avail_in - 5), w = n.next_out, $ = n.output, _ = w - (s - n.avail_out), b = w + (n.avail_out - 257), d = o.dmax, h = o.wsize, i = o.whave, p = o.wnext, u = o.window, x = o.hold, k = o.bits, A = o.lencode, E = o.distcode, P = (1 << o.lenbits) - 1, N = (1 << o.distbits) - 1;
          t: do {
            k < 15 && (x += c[f++] << k, k += 8, x += c[f++] << k, k += 8), j = A[x & P];
            e: for (; ; ) {
              if (x >>>= z = j >>> 24, k -= z, (z = j >>> 16 & 255) === 0) $[w++] = 65535 & j;
              else {
                if (!(16 & z)) {
                  if ((64 & z) == 0) {
                    j = A[(65535 & j) + (x & (1 << z) - 1)];
                    continue e;
                  }
                  if (32 & z) {
                    o.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                L = 65535 & j, (z &= 15) && (k < z && (x += c[f++] << k, k += 8), L += x & (1 << z) - 1, x >>>= z, k -= z), k < 15 && (x += c[f++] << k, k += 8, x += c[f++] << k, k += 8), j = E[x & N];
                r: for (; ; ) {
                  if (x >>>= z = j >>> 24, k -= z, !(16 & (z = j >>> 16 & 255))) {
                    if ((64 & z) == 0) {
                      j = E[(65535 & j) + (x & (1 << z) - 1)];
                      continue r;
                    }
                    n.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (V = 65535 & j, k < (z &= 15) && (x += c[f++] << k, (k += 8) < z && (x += c[f++] << k, k += 8)), d < (V += x & (1 << z) - 1)) {
                    n.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (x >>>= z, k -= z, (z = w - _) < V) {
                    if (i < (z = V - z) && o.sane) {
                      n.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (D = u, (M = 0) === p) {
                      if (M += h - z, z < L) {
                        for (L -= z; $[w++] = u[M++], --z; ) ;
                        M = w - V, D = $;
                      }
                    } else if (p < z) {
                      if (M += h + p - z, (z -= p) < L) {
                        for (L -= z; $[w++] = u[M++], --z; ) ;
                        if (M = 0, p < L) {
                          for (L -= z = p; $[w++] = u[M++], --z; ) ;
                          M = w - V, D = $;
                        }
                      }
                    } else if (M += p - z, z < L) {
                      for (L -= z; $[w++] = u[M++], --z; ) ;
                      M = w - V, D = $;
                    }
                    for (; 2 < L; ) $[w++] = D[M++], $[w++] = D[M++], $[w++] = D[M++], L -= 3;
                    L && ($[w++] = D[M++], 1 < L && ($[w++] = D[M++]));
                  } else {
                    for (M = w - V; $[w++] = $[M++], $[w++] = $[M++], $[w++] = $[M++], 2 < (L -= 3); ) ;
                    L && ($[w++] = $[M++], 1 < L && ($[w++] = $[M++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (f < y && w < b);
          f -= L = k >> 3, x &= (1 << (k -= L << 3)) - 1, n.next_in = f, n.next_out = w, n.avail_in = f < y ? y - f + 5 : 5 - (f - y), n.avail_out = w < b ? b - w + 257 : 257 - (w - b), o.hold = x, o.bits = k;
        };
      }, {}], 49: [function(e, a, l) {
        var n = e("../utils/common"), s = e("./adler32"), o = e("./crc32"), f = e("./inffast"), y = e("./inftrees"), w = 1, _ = 2, b = 0, d = -2, h = 1, i = 852, p = 592;
        function u(M) {
          return (M >>> 24 & 255) + (M >>> 8 & 65280) + ((65280 & M) << 8) + ((255 & M) << 24);
        }
        function x() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function k(M) {
          var D;
          return M && M.state ? (D = M.state, M.total_in = M.total_out = D.total = 0, M.msg = "", D.wrap && (M.adler = 1 & D.wrap), D.mode = h, D.last = 0, D.havedict = 0, D.dmax = 32768, D.head = null, D.hold = 0, D.bits = 0, D.lencode = D.lendyn = new n.Buf32(i), D.distcode = D.distdyn = new n.Buf32(p), D.sane = 1, D.back = -1, b) : d;
        }
        function A(M) {
          var D;
          return M && M.state ? ((D = M.state).wsize = 0, D.whave = 0, D.wnext = 0, k(M)) : d;
        }
        function E(M, D) {
          var c, $;
          return M && M.state ? ($ = M.state, D < 0 ? (c = 0, D = -D) : (c = 1 + (D >> 4), D < 48 && (D &= 15)), D && (D < 8 || 15 < D) ? d : ($.window !== null && $.wbits !== D && ($.window = null), $.wrap = c, $.wbits = D, A(M))) : d;
        }
        function P(M, D) {
          var c, $;
          return M ? ($ = new x(), (M.state = $).window = null, (c = E(M, D)) !== b && (M.state = null), c) : d;
        }
        var N, j, z = !0;
        function L(M) {
          if (z) {
            var D;
            for (N = new n.Buf32(512), j = new n.Buf32(32), D = 0; D < 144; ) M.lens[D++] = 8;
            for (; D < 256; ) M.lens[D++] = 9;
            for (; D < 280; ) M.lens[D++] = 7;
            for (; D < 288; ) M.lens[D++] = 8;
            for (y(w, M.lens, 0, 288, N, 0, M.work, { bits: 9 }), D = 0; D < 32; ) M.lens[D++] = 5;
            y(_, M.lens, 0, 32, j, 0, M.work, { bits: 5 }), z = !1;
          }
          M.lencode = N, M.lenbits = 9, M.distcode = j, M.distbits = 5;
        }
        function V(M, D, c, $) {
          var it, X = M.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new n.Buf8(X.wsize)), $ >= X.wsize ? (n.arraySet(X.window, D, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : ($ < (it = X.wsize - X.wnext) && (it = $), n.arraySet(X.window, D, c - $, it, X.wnext), ($ -= it) ? (n.arraySet(X.window, D, c - $, $, 0), X.wnext = $, X.whave = X.wsize) : (X.wnext += it, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += it))), 0;
        }
        l.inflateReset = A, l.inflateReset2 = E, l.inflateResetKeep = k, l.inflateInit = function(M) {
          return P(M, 15);
        }, l.inflateInit2 = P, l.inflate = function(M, D) {
          var c, $, it, X, et, Y, rt, O, T, J, H, G, lt, ft, nt, st, ct, at, _t, B, r, I, R, v, g = 0, S = new n.Buf8(4), F = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!M || !M.state || !M.output || !M.input && M.avail_in !== 0) return d;
          (c = M.state).mode === 12 && (c.mode = 13), et = M.next_out, it = M.output, rt = M.avail_out, X = M.next_in, $ = M.input, Y = M.avail_in, O = c.hold, T = c.bits, J = Y, H = rt, I = b;
          t: for (; ; ) switch (c.mode) {
            case h:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if (2 & c.wrap && O === 35615) {
                S[c.check = 0] = 255 & O, S[1] = O >>> 8 & 255, c.check = o(c.check, S, 2, 0), T = O = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & O) << 8) + (O >> 8)) % 31) {
                M.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & O) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (T -= 4, r = 8 + (15 & (O >>>= 4)), c.wbits === 0) c.wbits = r;
              else if (r > c.wbits) {
                M.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << r, M.adler = c.check = 1, c.mode = 512 & O ? 10 : 12, T = O = 0;
              break;
            case 2:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if (c.flags = O, (255 & c.flags) != 8) {
                M.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                M.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = O >> 8 & 1), 512 & c.flags && (S[0] = 255 & O, S[1] = O >>> 8 & 255, c.check = o(c.check, S, 2, 0)), T = O = 0, c.mode = 3;
            case 3:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              c.head && (c.head.time = O), 512 & c.flags && (S[0] = 255 & O, S[1] = O >>> 8 & 255, S[2] = O >>> 16 & 255, S[3] = O >>> 24 & 255, c.check = o(c.check, S, 4, 0)), T = O = 0, c.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              c.head && (c.head.xflags = 255 & O, c.head.os = O >> 8), 512 & c.flags && (S[0] = 255 & O, S[1] = O >>> 8 & 255, c.check = o(c.check, S, 2, 0)), T = O = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                c.length = O, c.head && (c.head.extra_len = O), 512 & c.flags && (S[0] = 255 & O, S[1] = O >>> 8 & 255, c.check = o(c.check, S, 2, 0)), T = O = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (Y < (G = c.length) && (G = Y), G && (c.head && (r = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), n.arraySet(c.head.extra, $, X, G, r)), 512 & c.flags && (c.check = o(c.check, $, G, X)), Y -= G, X += G, c.length -= G), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (Y === 0) break t;
                for (G = 0; r = $[X + G++], c.head && r && c.length < 65536 && (c.head.name += String.fromCharCode(r)), r && G < Y; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, G, X)), Y -= G, X += G, r) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (Y === 0) break t;
                for (G = 0; r = $[X + G++], c.head && r && c.length < 65536 && (c.head.comment += String.fromCharCode(r)), r && G < Y; ) ;
                if (512 & c.flags && (c.check = o(c.check, $, G, X)), Y -= G, X += G, r) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                if (O !== (65535 & c.check)) {
                  M.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                T = O = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), M.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              M.adler = c.check = u(O), T = O = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return M.next_out = et, M.avail_out = rt, M.next_in = X, M.avail_in = Y, c.hold = O, c.bits = T, 2;
              M.adler = c.check = 1, c.mode = 12;
            case 12:
              if (D === 5 || D === 6) break t;
            case 13:
              if (c.last) {
                O >>>= 7 & T, T -= 7 & T, c.mode = 27;
                break;
              }
              for (; T < 3; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              switch (c.last = 1 & O, T -= 1, 3 & (O >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if (L(c), c.mode = 20, D !== 6) break;
                  O >>>= 2, T -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  M.msg = "invalid block type", c.mode = 30;
              }
              O >>>= 2, T -= 2;
              break;
            case 14:
              for (O >>>= 7 & T, T -= 7 & T; T < 32; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if ((65535 & O) != (O >>> 16 ^ 65535)) {
                M.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & O, T = O = 0, c.mode = 15, D === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (G = c.length) {
                if (Y < G && (G = Y), rt < G && (G = rt), G === 0) break t;
                n.arraySet(it, $, X, G, et), Y -= G, X += G, rt -= G, et += G, c.length -= G;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if (c.nlen = 257 + (31 & O), O >>>= 5, T -= 5, c.ndist = 1 + (31 & O), O >>>= 5, T -= 5, c.ncode = 4 + (15 & O), O >>>= 4, T -= 4, 286 < c.nlen || 30 < c.ndist) {
                M.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; T < 3; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                c.lens[F[c.have++]] = 7 & O, O >>>= 3, T -= 3;
              }
              for (; c.have < 19; ) c.lens[F[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, R = { bits: c.lenbits }, I = y(0, c.lens, 0, 19, c.lencode, 0, c.work, R), c.lenbits = R.bits, I) {
                M.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; st = (g = c.lencode[O & (1 << c.lenbits) - 1]) >>> 16 & 255, ct = 65535 & g, !((nt = g >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                if (ct < 16) O >>>= nt, T -= nt, c.lens[c.have++] = ct;
                else {
                  if (ct === 16) {
                    for (v = nt + 2; T < v; ) {
                      if (Y === 0) break t;
                      Y--, O += $[X++] << T, T += 8;
                    }
                    if (O >>>= nt, T -= nt, c.have === 0) {
                      M.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    r = c.lens[c.have - 1], G = 3 + (3 & O), O >>>= 2, T -= 2;
                  } else if (ct === 17) {
                    for (v = nt + 3; T < v; ) {
                      if (Y === 0) break t;
                      Y--, O += $[X++] << T, T += 8;
                    }
                    T -= nt, r = 0, G = 3 + (7 & (O >>>= nt)), O >>>= 3, T -= 3;
                  } else {
                    for (v = nt + 7; T < v; ) {
                      if (Y === 0) break t;
                      Y--, O += $[X++] << T, T += 8;
                    }
                    T -= nt, r = 0, G = 11 + (127 & (O >>>= nt)), O >>>= 7, T -= 7;
                  }
                  if (c.have + G > c.nlen + c.ndist) {
                    M.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; G--; ) c.lens[c.have++] = r;
                }
              }
              if (c.mode === 30) break;
              if (c.lens[256] === 0) {
                M.msg = "invalid code -- missing end-of-block", c.mode = 30;
                break;
              }
              if (c.lenbits = 9, R = { bits: c.lenbits }, I = y(w, c.lens, 0, c.nlen, c.lencode, 0, c.work, R), c.lenbits = R.bits, I) {
                M.msg = "invalid literal/lengths set", c.mode = 30;
                break;
              }
              if (c.distbits = 6, c.distcode = c.distdyn, R = { bits: c.distbits }, I = y(_, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, R), c.distbits = R.bits, I) {
                M.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, D === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= Y && 258 <= rt) {
                M.next_out = et, M.avail_out = rt, M.next_in = X, M.avail_in = Y, c.hold = O, c.bits = T, f(M, H), et = M.next_out, it = M.output, rt = M.avail_out, X = M.next_in, $ = M.input, Y = M.avail_in, O = c.hold, T = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; st = (g = c.lencode[O & (1 << c.lenbits) - 1]) >>> 16 & 255, ct = 65535 & g, !((nt = g >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if (st && (240 & st) == 0) {
                for (at = nt, _t = st, B = ct; st = (g = c.lencode[B + ((O & (1 << at + _t) - 1) >> at)]) >>> 16 & 255, ct = 65535 & g, !(at + (nt = g >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                O >>>= at, T -= at, c.back += at;
              }
              if (O >>>= nt, T -= nt, c.back += nt, c.length = ct, st === 0) {
                c.mode = 26;
                break;
              }
              if (32 & st) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & st) {
                M.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & st, c.mode = 22;
            case 22:
              if (c.extra) {
                for (v = c.extra; T < v; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                c.length += O & (1 << c.extra) - 1, O >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; st = (g = c.distcode[O & (1 << c.distbits) - 1]) >>> 16 & 255, ct = 65535 & g, !((nt = g >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, O += $[X++] << T, T += 8;
              }
              if ((240 & st) == 0) {
                for (at = nt, _t = st, B = ct; st = (g = c.distcode[B + ((O & (1 << at + _t) - 1) >> at)]) >>> 16 & 255, ct = 65535 & g, !(at + (nt = g >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                O >>>= at, T -= at, c.back += at;
              }
              if (O >>>= nt, T -= nt, c.back += nt, 64 & st) {
                M.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = ct, c.extra = 15 & st, c.mode = 24;
            case 24:
              if (c.extra) {
                for (v = c.extra; T < v; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                c.offset += O & (1 << c.extra) - 1, O >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                M.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (rt === 0) break t;
              if (G = H - rt, c.offset > G) {
                if ((G = c.offset - G) > c.whave && c.sane) {
                  M.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                lt = G > c.wnext ? (G -= c.wnext, c.wsize - G) : c.wnext - G, G > c.length && (G = c.length), ft = c.window;
              } else ft = it, lt = et - c.offset, G = c.length;
              for (rt < G && (G = rt), rt -= G, c.length -= G; it[et++] = ft[lt++], --G; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (rt === 0) break t;
              it[et++] = c.length, rt--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, O |= $[X++] << T, T += 8;
                }
                if (H -= rt, M.total_out += H, c.total += H, H && (M.adler = c.check = c.flags ? o(c.check, it, H, et - H) : s(c.check, it, H, et - H)), H = rt, (c.flags ? O : u(O)) !== c.check) {
                  M.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                T = O = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, O += $[X++] << T, T += 8;
                }
                if (O !== (4294967295 & c.total)) {
                  M.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                T = O = 0;
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
          return M.next_out = et, M.avail_out = rt, M.next_in = X, M.avail_in = Y, c.hold = O, c.bits = T, (c.wsize || H !== M.avail_out && c.mode < 30 && (c.mode < 27 || D !== 4)) && V(M, M.output, M.next_out, H - M.avail_out) ? (c.mode = 31, -4) : (J -= M.avail_in, H -= M.avail_out, M.total_in += J, M.total_out += H, c.total += H, c.wrap && H && (M.adler = c.check = c.flags ? o(c.check, it, H, M.next_out - H) : s(c.check, it, H, M.next_out - H)), M.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (J == 0 && H === 0 || D === 4) && I === b && (I = -5), I);
        }, l.inflateEnd = function(M) {
          if (!M || !M.state) return d;
          var D = M.state;
          return D.window && (D.window = null), M.state = null, b;
        }, l.inflateGetHeader = function(M, D) {
          var c;
          return M && M.state ? (2 & (c = M.state).wrap) == 0 ? d : ((c.head = D).done = !1, b) : d;
        }, l.inflateSetDictionary = function(M, D) {
          var c, $ = D.length;
          return M && M.state ? (c = M.state).wrap !== 0 && c.mode !== 11 ? d : c.mode === 11 && s(1, D, $, 0) !== c.check ? -3 : V(M, D, $, $) ? (c.mode = 31, -4) : (c.havedict = 1, b) : d;
        }, l.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, a, l) {
        var n = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], f = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], y = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        a.exports = function(w, _, b, d, h, i, p, u) {
          var x, k, A, E, P, N, j, z, L, V = u.bits, M = 0, D = 0, c = 0, $ = 0, it = 0, X = 0, et = 0, Y = 0, rt = 0, O = 0, T = null, J = 0, H = new n.Buf16(16), G = new n.Buf16(16), lt = null, ft = 0;
          for (M = 0; M <= 15; M++) H[M] = 0;
          for (D = 0; D < d; D++) H[_[b + D]]++;
          for (it = V, $ = 15; 1 <= $ && H[$] === 0; $--) ;
          if ($ < it && (it = $), $ === 0) return h[i++] = 20971520, h[i++] = 20971520, u.bits = 1, 0;
          for (c = 1; c < $ && H[c] === 0; c++) ;
          for (it < c && (it = c), M = Y = 1; M <= 15; M++) if (Y <<= 1, (Y -= H[M]) < 0) return -1;
          if (0 < Y && (w === 0 || $ !== 1)) return -1;
          for (G[1] = 0, M = 1; M < 15; M++) G[M + 1] = G[M] + H[M];
          for (D = 0; D < d; D++) _[b + D] !== 0 && (p[G[_[b + D]]++] = D);
          if (N = w === 0 ? (T = lt = p, 19) : w === 1 ? (T = s, J -= 257, lt = o, ft -= 257, 256) : (T = f, lt = y, -1), M = c, P = i, et = D = O = 0, A = -1, E = (rt = 1 << (X = it)) - 1, w === 1 && 852 < rt || w === 2 && 592 < rt) return 1;
          for (; ; ) {
            for (j = M - et, L = p[D] < N ? (z = 0, p[D]) : p[D] > N ? (z = lt[ft + p[D]], T[J + p[D]]) : (z = 96, 0), x = 1 << M - et, c = k = 1 << X; h[P + (O >> et) + (k -= x)] = j << 24 | z << 16 | L | 0, k !== 0; ) ;
            for (x = 1 << M - 1; O & x; ) x >>= 1;
            if (x !== 0 ? (O &= x - 1, O += x) : O = 0, D++, --H[M] == 0) {
              if (M === $) break;
              M = _[b + p[D]];
            }
            if (it < M && (O & E) !== A) {
              for (et === 0 && (et = it), P += c, Y = 1 << (X = M - et); X + et < $ && !((Y -= H[X + et]) <= 0); ) X++, Y <<= 1;
              if (rt += 1 << X, w === 1 && 852 < rt || w === 2 && 592 < rt) return 1;
              h[A = O & E] = it << 24 | X << 16 | P - i | 0;
            }
          }
          return O !== 0 && (h[P + O] = M - et << 24 | 64 << 16 | 0), u.bits = it, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, a, l) {
        a.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, a, l) {
        var n = e("../utils/common"), s = 0, o = 1;
        function f(g) {
          for (var S = g.length; 0 <= --S; ) g[S] = 0;
        }
        var y = 0, w = 29, _ = 256, b = _ + 1 + w, d = 30, h = 19, i = 2 * b + 1, p = 15, u = 16, x = 7, k = 256, A = 16, E = 17, P = 18, N = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], V = new Array(2 * (b + 2));
        f(V);
        var M = new Array(2 * d);
        f(M);
        var D = new Array(512);
        f(D);
        var c = new Array(256);
        f(c);
        var $ = new Array(w);
        f($);
        var it, X, et, Y = new Array(d);
        function rt(g, S, F, U, C) {
          this.static_tree = g, this.extra_bits = S, this.extra_base = F, this.elems = U, this.max_length = C, this.has_stree = g && g.length;
        }
        function O(g, S) {
          this.dyn_tree = g, this.max_code = 0, this.stat_desc = S;
        }
        function T(g) {
          return g < 256 ? D[g] : D[256 + (g >>> 7)];
        }
        function J(g, S) {
          g.pending_buf[g.pending++] = 255 & S, g.pending_buf[g.pending++] = S >>> 8 & 255;
        }
        function H(g, S, F) {
          g.bi_valid > u - F ? (g.bi_buf |= S << g.bi_valid & 65535, J(g, g.bi_buf), g.bi_buf = S >> u - g.bi_valid, g.bi_valid += F - u) : (g.bi_buf |= S << g.bi_valid & 65535, g.bi_valid += F);
        }
        function G(g, S, F) {
          H(g, F[2 * S], F[2 * S + 1]);
        }
        function lt(g, S) {
          for (var F = 0; F |= 1 & g, g >>>= 1, F <<= 1, 0 < --S; ) ;
          return F >>> 1;
        }
        function ft(g, S, F) {
          var U, C, W = new Array(p + 1), q = 0;
          for (U = 1; U <= p; U++) W[U] = q = q + F[U - 1] << 1;
          for (C = 0; C <= S; C++) {
            var Z = g[2 * C + 1];
            Z !== 0 && (g[2 * C] = lt(W[Z]++, Z));
          }
        }
        function nt(g) {
          var S;
          for (S = 0; S < b; S++) g.dyn_ltree[2 * S] = 0;
          for (S = 0; S < d; S++) g.dyn_dtree[2 * S] = 0;
          for (S = 0; S < h; S++) g.bl_tree[2 * S] = 0;
          g.dyn_ltree[2 * k] = 1, g.opt_len = g.static_len = 0, g.last_lit = g.matches = 0;
        }
        function st(g) {
          8 < g.bi_valid ? J(g, g.bi_buf) : 0 < g.bi_valid && (g.pending_buf[g.pending++] = g.bi_buf), g.bi_buf = 0, g.bi_valid = 0;
        }
        function ct(g, S, F, U) {
          var C = 2 * S, W = 2 * F;
          return g[C] < g[W] || g[C] === g[W] && U[S] <= U[F];
        }
        function at(g, S, F) {
          for (var U = g.heap[F], C = F << 1; C <= g.heap_len && (C < g.heap_len && ct(S, g.heap[C + 1], g.heap[C], g.depth) && C++, !ct(S, U, g.heap[C], g.depth)); ) g.heap[F] = g.heap[C], F = C, C <<= 1;
          g.heap[F] = U;
        }
        function _t(g, S, F) {
          var U, C, W, q, Z = 0;
          if (g.last_lit !== 0) for (; U = g.pending_buf[g.d_buf + 2 * Z] << 8 | g.pending_buf[g.d_buf + 2 * Z + 1], C = g.pending_buf[g.l_buf + Z], Z++, U === 0 ? G(g, C, S) : (G(g, (W = c[C]) + _ + 1, S), (q = N[W]) !== 0 && H(g, C -= $[W], q), G(g, W = T(--U), F), (q = j[W]) !== 0 && H(g, U -= Y[W], q)), Z < g.last_lit; ) ;
          G(g, k, S);
        }
        function B(g, S) {
          var F, U, C, W = S.dyn_tree, q = S.stat_desc.static_tree, Z = S.stat_desc.has_stree, K = S.stat_desc.elems, ot = -1;
          for (g.heap_len = 0, g.heap_max = i, F = 0; F < K; F++) W[2 * F] !== 0 ? (g.heap[++g.heap_len] = ot = F, g.depth[F] = 0) : W[2 * F + 1] = 0;
          for (; g.heap_len < 2; ) W[2 * (C = g.heap[++g.heap_len] = ot < 2 ? ++ot : 0)] = 1, g.depth[C] = 0, g.opt_len--, Z && (g.static_len -= q[2 * C + 1]);
          for (S.max_code = ot, F = g.heap_len >> 1; 1 <= F; F--) at(g, W, F);
          for (C = K; F = g.heap[1], g.heap[1] = g.heap[g.heap_len--], at(g, W, 1), U = g.heap[1], g.heap[--g.heap_max] = F, g.heap[--g.heap_max] = U, W[2 * C] = W[2 * F] + W[2 * U], g.depth[C] = (g.depth[F] >= g.depth[U] ? g.depth[F] : g.depth[U]) + 1, W[2 * F + 1] = W[2 * U + 1] = C, g.heap[1] = C++, at(g, W, 1), 2 <= g.heap_len; ) ;
          g.heap[--g.heap_max] = g.heap[1], (function(tt, mt) {
            var Ct, pt, Mt, dt, Q, ht, yt = mt.dyn_tree, Rt = mt.max_code, he = mt.stat_desc.static_tree, ue = mt.stat_desc.has_stree, fe = mt.stat_desc.extra_bits, Vt = mt.stat_desc.extra_base, Bt = mt.stat_desc.max_length, Lt = 0;
            for (dt = 0; dt <= p; dt++) tt.bl_count[dt] = 0;
            for (yt[2 * tt.heap[tt.heap_max] + 1] = 0, Ct = tt.heap_max + 1; Ct < i; Ct++) Bt < (dt = yt[2 * yt[2 * (pt = tt.heap[Ct]) + 1] + 1] + 1) && (dt = Bt, Lt++), yt[2 * pt + 1] = dt, Rt < pt || (tt.bl_count[dt]++, Q = 0, Vt <= pt && (Q = fe[pt - Vt]), ht = yt[2 * pt], tt.opt_len += ht * (dt + Q), ue && (tt.static_len += ht * (he[2 * pt + 1] + Q)));
            if (Lt !== 0) {
              do {
                for (dt = Bt - 1; tt.bl_count[dt] === 0; ) dt--;
                tt.bl_count[dt]--, tt.bl_count[dt + 1] += 2, tt.bl_count[Bt]--, Lt -= 2;
              } while (0 < Lt);
              for (dt = Bt; dt !== 0; dt--) for (pt = tt.bl_count[dt]; pt !== 0; ) Rt < (Mt = tt.heap[--Ct]) || (yt[2 * Mt + 1] !== dt && (tt.opt_len += (dt - yt[2 * Mt + 1]) * yt[2 * Mt], yt[2 * Mt + 1] = dt), pt--);
            }
          })(g, S), ft(W, ot, g.bl_count);
        }
        function r(g, S, F) {
          var U, C, W = -1, q = S[1], Z = 0, K = 7, ot = 4;
          for (q === 0 && (K = 138, ot = 3), S[2 * (F + 1) + 1] = 65535, U = 0; U <= F; U++) C = q, q = S[2 * (U + 1) + 1], ++Z < K && C === q || (Z < ot ? g.bl_tree[2 * C] += Z : C !== 0 ? (C !== W && g.bl_tree[2 * C]++, g.bl_tree[2 * A]++) : Z <= 10 ? g.bl_tree[2 * E]++ : g.bl_tree[2 * P]++, W = C, ot = (Z = 0) === q ? (K = 138, 3) : C === q ? (K = 6, 3) : (K = 7, 4));
        }
        function I(g, S, F) {
          var U, C, W = -1, q = S[1], Z = 0, K = 7, ot = 4;
          for (q === 0 && (K = 138, ot = 3), U = 0; U <= F; U++) if (C = q, q = S[2 * (U + 1) + 1], !(++Z < K && C === q)) {
            if (Z < ot) for (; G(g, C, g.bl_tree), --Z != 0; ) ;
            else C !== 0 ? (C !== W && (G(g, C, g.bl_tree), Z--), G(g, A, g.bl_tree), H(g, Z - 3, 2)) : Z <= 10 ? (G(g, E, g.bl_tree), H(g, Z - 3, 3)) : (G(g, P, g.bl_tree), H(g, Z - 11, 7));
            W = C, ot = (Z = 0) === q ? (K = 138, 3) : C === q ? (K = 6, 3) : (K = 7, 4);
          }
        }
        f(Y);
        var R = !1;
        function v(g, S, F, U) {
          H(g, (y << 1) + (U ? 1 : 0), 3), (function(C, W, q, Z) {
            st(C), J(C, q), J(C, ~q), n.arraySet(C.pending_buf, C.window, W, q, C.pending), C.pending += q;
          })(g, S, F);
        }
        l._tr_init = function(g) {
          R || ((function() {
            var S, F, U, C, W, q = new Array(p + 1);
            for (C = U = 0; C < w - 1; C++) for ($[C] = U, S = 0; S < 1 << N[C]; S++) c[U++] = C;
            for (c[U - 1] = C, C = W = 0; C < 16; C++) for (Y[C] = W, S = 0; S < 1 << j[C]; S++) D[W++] = C;
            for (W >>= 7; C < d; C++) for (Y[C] = W << 7, S = 0; S < 1 << j[C] - 7; S++) D[256 + W++] = C;
            for (F = 0; F <= p; F++) q[F] = 0;
            for (S = 0; S <= 143; ) V[2 * S + 1] = 8, S++, q[8]++;
            for (; S <= 255; ) V[2 * S + 1] = 9, S++, q[9]++;
            for (; S <= 279; ) V[2 * S + 1] = 7, S++, q[7]++;
            for (; S <= 287; ) V[2 * S + 1] = 8, S++, q[8]++;
            for (ft(V, b + 1, q), S = 0; S < d; S++) M[2 * S + 1] = 5, M[2 * S] = lt(S, 5);
            it = new rt(V, N, _ + 1, b, p), X = new rt(M, j, 0, d, p), et = new rt(new Array(0), z, 0, h, x);
          })(), R = !0), g.l_desc = new O(g.dyn_ltree, it), g.d_desc = new O(g.dyn_dtree, X), g.bl_desc = new O(g.bl_tree, et), g.bi_buf = 0, g.bi_valid = 0, nt(g);
        }, l._tr_stored_block = v, l._tr_flush_block = function(g, S, F, U) {
          var C, W, q = 0;
          0 < g.level ? (g.strm.data_type === 2 && (g.strm.data_type = (function(Z) {
            var K, ot = 4093624447;
            for (K = 0; K <= 31; K++, ot >>>= 1) if (1 & ot && Z.dyn_ltree[2 * K] !== 0) return s;
            if (Z.dyn_ltree[18] !== 0 || Z.dyn_ltree[20] !== 0 || Z.dyn_ltree[26] !== 0) return o;
            for (K = 32; K < _; K++) if (Z.dyn_ltree[2 * K] !== 0) return o;
            return s;
          })(g)), B(g, g.l_desc), B(g, g.d_desc), q = (function(Z) {
            var K;
            for (r(Z, Z.dyn_ltree, Z.l_desc.max_code), r(Z, Z.dyn_dtree, Z.d_desc.max_code), B(Z, Z.bl_desc), K = h - 1; 3 <= K && Z.bl_tree[2 * L[K] + 1] === 0; K--) ;
            return Z.opt_len += 3 * (K + 1) + 5 + 5 + 4, K;
          })(g), C = g.opt_len + 3 + 7 >>> 3, (W = g.static_len + 3 + 7 >>> 3) <= C && (C = W)) : C = W = F + 5, F + 4 <= C && S !== -1 ? v(g, S, F, U) : g.strategy === 4 || W === C ? (H(g, 2 + (U ? 1 : 0), 3), _t(g, V, M)) : (H(g, 4 + (U ? 1 : 0), 3), (function(Z, K, ot, tt) {
            var mt;
            for (H(Z, K - 257, 5), H(Z, ot - 1, 5), H(Z, tt - 4, 4), mt = 0; mt < tt; mt++) H(Z, Z.bl_tree[2 * L[mt] + 1], 3);
            I(Z, Z.dyn_ltree, K - 1), I(Z, Z.dyn_dtree, ot - 1);
          })(g, g.l_desc.max_code + 1, g.d_desc.max_code + 1, q + 1), _t(g, g.dyn_ltree, g.dyn_dtree)), nt(g), U && st(g);
        }, l._tr_tally = function(g, S, F) {
          return g.pending_buf[g.d_buf + 2 * g.last_lit] = S >>> 8 & 255, g.pending_buf[g.d_buf + 2 * g.last_lit + 1] = 255 & S, g.pending_buf[g.l_buf + g.last_lit] = 255 & F, g.last_lit++, S === 0 ? g.dyn_ltree[2 * F]++ : (g.matches++, S--, g.dyn_ltree[2 * (c[F] + _ + 1)]++, g.dyn_dtree[2 * T(S)]++), g.last_lit === g.lit_bufsize - 1;
        }, l._tr_align = function(g) {
          H(g, 2, 3), G(g, k, V), (function(S) {
            S.bi_valid === 16 ? (J(S, S.bi_buf), S.bi_buf = 0, S.bi_valid = 0) : 8 <= S.bi_valid && (S.pending_buf[S.pending++] = 255 & S.bi_buf, S.bi_buf >>= 8, S.bi_valid -= 8);
          })(g);
        };
      }, { "../utils/common": 41 }], 53: [function(e, a, l) {
        a.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, a, l) {
        (function(n) {
          (function(s, o) {
            if (!s.setImmediate) {
              var f, y, w, _, b = 1, d = {}, h = !1, i = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, f = {}.toString.call(s.process) === "[object process]" ? function(A) {
                process.nextTick(function() {
                  x(A);
                });
              } : (function() {
                if (s.postMessage && !s.importScripts) {
                  var A = !0, E = s.onmessage;
                  return s.onmessage = function() {
                    A = !1;
                  }, s.postMessage("", "*"), s.onmessage = E, A;
                }
              })() ? (_ = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", k, !1) : s.attachEvent("onmessage", k), function(A) {
                s.postMessage(_ + A, "*");
              }) : s.MessageChannel ? ((w = new MessageChannel()).port1.onmessage = function(A) {
                x(A.data);
              }, function(A) {
                w.port2.postMessage(A);
              }) : i && "onreadystatechange" in i.createElement("script") ? (y = i.documentElement, function(A) {
                var E = i.createElement("script");
                E.onreadystatechange = function() {
                  x(A), E.onreadystatechange = null, y.removeChild(E), E = null;
                }, y.appendChild(E);
              }) : function(A) {
                setTimeout(x, 0, A);
              }, p.setImmediate = function(A) {
                typeof A != "function" && (A = new Function("" + A));
                for (var E = new Array(arguments.length - 1), P = 0; P < E.length; P++) E[P] = arguments[P + 1];
                var N = { callback: A, args: E };
                return d[b] = N, f(b), b++;
              }, p.clearImmediate = u;
            }
            function u(A) {
              delete d[A];
            }
            function x(A) {
              if (h) setTimeout(x, 0, A);
              else {
                var E = d[A];
                if (E) {
                  h = !0;
                  try {
                    (function(P) {
                      var N = P.callback, j = P.args;
                      switch (j.length) {
                        case 0:
                          N();
                          break;
                        case 1:
                          N(j[0]);
                          break;
                        case 2:
                          N(j[0], j[1]);
                          break;
                        case 3:
                          N(j[0], j[1], j[2]);
                          break;
                        default:
                          N.apply(o, j);
                      }
                    })(E);
                  } finally {
                    u(A), h = !1;
                  }
                }
              }
            }
            function k(A) {
              A.source === s && typeof A.data == "string" && A.data.indexOf(_) === 0 && x(+A.data.slice(_.length));
            }
          })(typeof self > "u" ? n === void 0 ? this : n : self);
        }).call(this, typeof Dt < "u" ? Dt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Wt)), Wt.exports;
}
var ye = pe();
const ne = /* @__PURE__ */ me(ye);
async function ge(m) {
  const t = await _e(m), e = await ne.loadAsync(t), a = [];
  return e.forEach((l, n) => {
    if (n.dir)
      return;
    const s = be(l);
    a.push({
      name: s,
      text: () => n.async("text"),
      arrayBuffer: () => n.async("arraybuffer")
    });
  }), a;
}
async function _e(m) {
  if (m instanceof ArrayBuffer)
    return m;
  if (m instanceof Blob)
    return await m.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function be(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ve(m) {
  return !!m && typeof m == "object" && !(m instanceof ArrayBuffer) && !(m instanceof Uint8Array);
}
function we(m) {
  return m instanceof Uint8Array ? m : new Uint8Array(m);
}
function xe(m) {
  return m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer;
}
function Tt(m, t, e = 0) {
  if (m.length < e + t.length) return !1;
  for (let a = 0; a < t.length; a++)
    if (m[e + a] !== t[a]) return !1;
  return !0;
}
function ke(m) {
  return Tt(m, [80, 75, 3, 4]) || Tt(m, [80, 75, 5, 6]) || Tt(m, [80, 75, 7, 8]) ? "zip" : Tt(m, [82, 97, 114, 33, 26, 7, 0]) || Tt(m, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : Tt(m, [55, 122, 188, 175, 39, 28]) ? "7z" : m.length > 262 && Tt(m, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function se(m) {
  return m.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Ht(m) {
  const t = [], e = m.map((i) => se(i).toLowerCase()), a = (i) => e.some(i), l = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, n = /\.(drl|xln)$/i, s = e.filter((i) => l.test(i)).length, o = e.filter((i) => n.test(i) || i.includes("drill")).length, f = a((i) => i.includes("top") && i.includes("copper") || i.endsWith(".gtl")), y = a((i) => i.includes("bot") || i.includes("bottom") || i.endsWith(".gbl")), w = a((i) => i.includes("mask") || i.includes("solder") || i.endsWith(".gts") || i.endsWith(".gbs")), _ = a((i) => i.includes("silk") || i.includes("legend") || i.endsWith(".gto") || i.endsWith(".gbo")), b = a((i) => i.includes("outline") || i.includes("profile") || i.includes("edge") || i.endsWith(".gko") || i.endsWith(".gm1") || i.endsWith(".gml")), d = e.every(
    (i) => i.endsWith(".pdf") || i.endsWith(".png") || i.endsWith(".jpg") || i.endsWith(".jpeg") || i.endsWith(".svg") || i.endsWith(".txt") || i.endsWith(".md")
  );
  let h = 0;
  return m.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : d ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (s > 0 ? (h += 0.35, t.push(`Found ${s} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), o > 0 && (h += 0.2, t.push(`Found ${o} drill-like file(s).`)), b && (h += 0.15, t.push("Found outline/profile/edge candidate.")), f && y ? (h += 0.2, t.push("Found both top and bottom copper candidates.")) : (f || y) && (h += 0.1, t.push("Found at least one copper candidate.")), w && (h += 0.05, t.push("Found solder mask candidate.")), _ && (h += 0.05, t.push("Found silkscreen/legend candidate.")), h = Math.max(0, Math.min(1, h)), h < 0.6 && s >= 2 && (h = Math.max(h, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: h, reasons: t });
}
async function Se(m) {
  if (ve(m)) {
    const n = Object.keys(m).map(se), { confidence: s, reasons: o } = Ht(n);
    return {
      isGerber: s >= 0.6,
      archiveType: "directory",
      confidence: s,
      reasons: o,
      files: n
    };
  }
  const t = we(m), e = ke(t);
  if (e === "zip")
    try {
      const n = xe(t), o = (await ge(n)).map((w) => w.name), { confidence: f, reasons: y } = Ht(o);
      return {
        isGerber: f >= 0.6,
        archiveType: "zip",
        confidence: f,
        reasons: y,
        files: o
      };
    } catch (n) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(n)]
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
class ut extends Error {
  constructor(t, e, a) {
    super(e), this.name = "GerberError", this.code = t, this.details = a;
  }
}
function oe(m) {
  let t = m.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Me(m) {
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
async function Re(m) {
  let t;
  try {
    t = await ne.loadAsync(ae(m));
  } catch (o) {
    throw new ut(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      o
    );
  }
  const e = {}, a = 1e3, l = 100 * 1024 * 1024, n = Object.entries(t.files).filter(([, o]) => o && !o.dir);
  if (n.length > a)
    throw new ut(
      "PARSE_ERROR",
      `ZIP contains too many files (${n.length} > ${a})`
    );
  let s = 0;
  for (const [o, f] of n)
    try {
      const y = oe(o), w = await f.async("arraybuffer");
      if (s += w.byteLength, s > l)
        throw new ut(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${l} bytes)`
        );
      e[y] = new Uint8Array(w);
    } catch (y) {
      if (y instanceof ut) throw y;
      console.warn(`Failed to extract file ${o}:`, y);
    }
  if (Object.keys(e).length === 0)
    throw new ut("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Ae(m, t) {
  let e;
  try {
    const _ = await import("./libarchive-Bt1VdZR0.js");
    e = _.Archive ?? _.default?.Archive;
  } catch (_) {
    throw new ut(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      _
    );
  }
  if (!e)
    throw new ut("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (_) {
      throw new ut(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        _
      );
    }
  let a;
  try {
    const _ = new Blob([ae(m)], { type: "application/octet-stream" });
    a = await e.open(_);
  } catch (_) {
    throw new ut("NOT_AN_ARCHIVE", "Failed to open RAR archive", _);
  }
  let l;
  try {
    l = await Promise.race([
      a.extractFiles(),
      new Promise(
        (_, b) => setTimeout(() => b(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (_) {
    throw new ut("PARSE_ERROR", "Failed to extract RAR archive", _);
  }
  const n = {};
  let s = 0;
  const o = 1e3, f = 100 * 1024 * 1024;
  let y = 0;
  async function w(_, b) {
    if (s >= o)
      throw new ut(
        "PARSE_ERROR",
        `Archive contains too many files (max ${o})`
      );
    for (const d of Object.keys(_)) {
      const h = _[d], i = b ? `${b}/${d}` : d;
      if (h instanceof File || h instanceof Blob) {
        s++;
        try {
          const p = await h.arrayBuffer();
          if (y += p.byteLength, y > f)
            throw new ut(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${f} bytes)`
            );
          n[oe(i)] = new Uint8Array(p);
        } catch (p) {
          if (p instanceof ut) throw p;
          console.warn(`Failed to extract file ${i}:`, p);
        }
      } else h && typeof h == "object" && await w(h, i);
    }
  }
  try {
    await w(l, "");
  } finally {
    if (a && typeof a.close == "function")
      try {
        await a.close();
      } catch (_) {
        console.warn("Failed to close archive:", _);
      }
  }
  if (Object.keys(n).length === 0)
    throw new ut("PARSE_ERROR", "No files extracted from RAR archive");
  return n;
}
async function le(m, t) {
  if (!m || m.byteLength === 0)
    throw new ut("NOT_AN_ARCHIVE", "Input is empty");
  const e = Me(m), a = 100 * 1024 * 1024;
  if (e.length > a)
    throw new ut(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${a} bytes)`
    );
  let l;
  try {
    l = await Se(e);
  } catch (n) {
    throw new ut("PARSE_ERROR", "Failed to detect archive type", n);
  }
  if (!l.isGerber && l.archiveType !== "rar")
    throw new ut(
      "NOT_GERBER",
      l.reasons.join("; ") || "Not a Gerber bundle",
      l
    );
  try {
    if (l.archiveType === "zip")
      return { archiveType: "zip", files: await Re(e) };
    if (l.archiveType === "rar")
      return { archiveType: "rar", files: await Ae(e, t) };
    if (l.archiveType === "single-file")
      return { archiveType: "single-file", files: { "layer.gtl": e } };
    throw new ut(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${l.archiveType}`,
      l
    );
  } catch (n) {
    throw n instanceof ut ? n : new ut(
      "PARSE_ERROR",
      n instanceof Error ? n.message : "Unknown error during extraction",
      { error: n, det: l }
    );
  }
}
function Nt(m) {
  return m.toLowerCase();
}
function Ot(m, t) {
  const e = new Set(t.map((l) => l.toLowerCase()));
  return m.filter((l) => {
    const n = Nt(l), s = n.lastIndexOf(".");
    return s < 0 ? !1 : e.has(n.slice(s));
  }).sort((l, n) => l.length - n.length)[0];
}
function gt(m, t) {
  const e = t.map((l) => l.toLowerCase());
  return m.filter((l) => {
    const n = Nt(l);
    return e.every((s) => n.includes(s));
  }).sort((l, n) => l.length - n.length)[0];
}
function Ee(m, t, e) {
  const a = new Set([t, e].filter(Boolean)), l = [];
  for (const n of m) {
    if (a.has(n)) continue;
    const s = Nt(n), o = s.split("/").pop() || s, f = o.lastIndexOf("."), y = f >= 0 ? o.slice(f) : "";
    if (/in\d+_cu/.test(o)) {
      l.push(n);
      continue;
    }
    if (/^\.gl?\d+$/.test(y)) {
      const w = parseInt(y.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(w) && w >= 2) {
        l.push(n);
        continue;
      }
    }
  }
  return l.sort(), l;
}
function Ie(m) {
  const t = [], e = (a) => Nt(a);
  for (const a of m) {
    const l = e(a), n = l.split("/").pop() || l, s = n.slice(n.lastIndexOf("."));
    if (s === ".drl" || s === ".xln" || s === ".exc" || s === ".ncd") {
      t.push(a);
      continue;
    }
    if (s === ".txt" && (n.includes("hole") || n.includes("drill") || n.includes("npth") || n.includes("-pth"))) {
      t.push(a);
      continue;
    }
    if ((n.includes("drill") || n.includes("npth") || n.includes("-pth")) && (s === ".gbr" || s === ".ger" || s === ".txt" || s === "")) {
      t.push(a);
      continue;
    }
  }
  return t;
}
function ze(m) {
  const t = m.filter((_) => {
    const b = Nt(_);
    return !(b.endsWith("/") || b.includes("__macosx") || b.endsWith(".ds_store"));
  }), e = Ot(t, [".gtl"]) || gt(t, ["f_cu"]) || gt(t, ["top", "cu"]) || gt(t, ["top", "copper"]), a = Ot(t, [".gbl"]) || gt(t, ["b_cu"]) || gt(t, ["bottom", "cu"]) || gt(t, ["bottom", "copper"]), l = Ot(t, [".gts"]) || gt(t, ["f_mask"]) || gt(t, ["top", "mask"]), n = Ot(t, [".gbs"]) || gt(t, ["b_mask"]) || gt(t, ["bottom", "mask"]), s = Ot(t, [".gto"]) || gt(t, ["f_silks"]) || gt(t, ["f_silk"]) || gt(t, ["top", "silk"]), o = Ot(t, [".gbo"]) || gt(t, ["b_silks"]) || gt(t, ["b_silk"]) || gt(t, ["bottom", "silk"]), f = Ot(t, [".gko", ".gm1"]) || gt(t, ["edge", "cuts"]) || gt(t, ["outline"]) || gt(t, ["board", "outline"]), y = Ie(t), w = Ee(t, e, a);
  return {
    top_copper: e,
    bottom_copper: a,
    top_mask: l,
    bottom_mask: n,
    top_silk: s,
    bottom_silk: o,
    outline: f,
    drills: y.length ? y : void 0,
    inner_copper: w.length ? w : void 0
  };
}
const Ce = 0.8;
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
  for (const n of l) {
    let s = n.trim();
    if (s && !s.startsWith("G04")) {
      if (s.startsWith("%") && s.endsWith("%")) {
        Te(s, a);
        continue;
      }
      s.endsWith("*") && (s = s.slice(0, -1)), Oe(s, a);
    }
  }
  if (a.inRegion) {
    if (a.currentPath.length >= 3 && a.regionPaths.push(a.currentPath), a.regionPaths.length > 0) {
      const n = {
        loops: a.regionPaths,
        polarity: a.currentPolarity
      };
      a.regions.push(n), a.ops.push({
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
      const l = parseInt(a[1], 10), n = parseInt(a[2], 10);
      parseInt(a[4], 10), t.fmtInt = l, t.fmtDec = n;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const a = t.unitScale;
    let l = a;
    if (e.includes("MOMM") ? l = 1 : e.includes("MOIN") && (l = 25.4), l !== a) {
      const n = l / a;
      for (const s of t.apertures.values())
        s.diameterMm !== void 0 && (s.diameterMm *= n), s.widthMm !== void 0 && (s.widthMm *= n), s.heightMm !== void 0 && (s.heightMm *= n);
      t.unitScale = l;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const a = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!a) return;
    const l = parseInt(a[2], 10), n = a[3], s = a[4] ?? "";
    let o, f, y, w, _;
    if (s) {
      const d = s.split(/[Xx]/).filter(Boolean), h = d[0] ? parseFloat(d[0]) * t.unitScale : void 0, i = d[1] ? parseFloat(d[1]) * t.unitScale : void 0, p = d[2] ? parseFloat(d[2]) * t.unitScale : void 0, u = d[3] ? parseFloat(d[3]) : void 0;
      u !== void 0 && !Number.isNaN(u) && u !== 0 && (_ = u), n === "C" ? o = h : n === "R" || n === "O" ? (f = h, y = i, o = h !== void 0 && i !== void 0 ? Math.min(h, i) : h ?? i) : (f = h, y = i, p !== void 0 && (w = p), o = h !== void 0 && i !== void 0 ? Math.min(h, i) : h ?? i);
    }
    const b = {
      code: l,
      shape: n,
      diameterMm: o,
      widthMm: f,
      heightMm: y,
      cornerMm: w,
      rotationDeg: _
    };
    t.apertures.set(l, b);
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
  const n = m.x + e, s = m.y + a, o = Math.sqrt(e * e + a * a);
  if (o < 1e-6) return [t];
  const f = Math.atan2(m.y - s, m.x - n), y = Math.atan2(t.y - s, t.x - n), _ = (t.x - m.x) ** 2 + (t.y - m.y) ** 2 < (o * 1e-3) ** 2;
  let b;
  _ ? b = l ? -2 * Math.PI : 2 * Math.PI : (b = y - f, l ? b > 1e-6 && (b -= 2 * Math.PI) : b < -1e-6 && (b += 2 * Math.PI));
  const d = Math.min(64, Math.max(4, Math.ceil(Math.abs(b) / (Math.PI / 16)))), h = [];
  for (let i = 1; i <= d; i++) {
    const p = f + b * i / d;
    h.push({ x: n + o * Math.cos(p), y: s + o * Math.sin(p) });
  }
  return h;
}
function Oe(m, t) {
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
  const n = /X([+\-]?\d+)/.exec(m), s = /Y([+\-]?\d+)/.exec(m), o = /I([+\-]?\d+)/.exec(m), f = /J([+\-]?\d+)/.exec(m);
  let y = t.x, w = t.y;
  n && (y = Ut(n[1], t)), s && (w = Ut(s[1], t));
  const _ = o ? Ut(o[1], t) : 0, b = f ? Ut(f[1], t) : 0;
  if (a === null) {
    t.x = y, t.y = w;
    return;
  }
  if (t.inRegion) {
    const i = t.x, p = t.y;
    if (a === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: i, y: p }), t.arcMode !== 1 && (_ !== 0 || b !== 0)) {
        const u = Kt({ x: i, y: p }, { x: y, y: w }, _, b, t.arcMode === 2);
        for (const x of u) t.currentPath.push(x);
      } else
        t.currentPath.push({ x: y, y: w });
    else a === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = y, t.y = w;
    return;
  }
  const d = t.x, h = t.y;
  if (a === 1) {
    if (!t.currentAperture) {
      t.x = y, t.y = w;
      return;
    }
    const i = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (_ !== 0 || b !== 0)) {
      const p = Kt({ x: d, y: h }, { x: y, y: w }, _, b, t.arcMode === 2);
      let u = { x: d, y: h };
      for (const x of p)
        t.tracks.push({ start: u, end: x, width: i, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: u, end: x, widthMm: i }), u = x;
    } else
      t.tracks.push({
        start: { x: d, y: h },
        end: { x: y, y: w },
        width: i,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: d, y: h },
        end: { x: y, y: w },
        widthMm: i
      });
    t.x = y, t.y = w;
    return;
  }
  if (a === 2) {
    t.x = y, t.y = w;
    return;
  }
  if (a === 3) {
    if (t.currentAperture) {
      const i = t.currentAperture, p = i.diameterMm !== void 0 ? i.diameterMm : Ce, u = (i.rotationDeg ?? 0) + t.loadRotationDeg, x = u !== 0 ? u : void 0, k = {
        position: { x: y, y: w },
        diameterMm: p,
        shape: i.shape,
        polarity: t.currentPolarity,
        rotationDeg: x
      };
      i.widthMm !== void 0 && (k.widthMm = i.widthMm), i.heightMm !== void 0 && (k.heightMm = i.heightMm), i.cornerMm !== void 0 && (k.cornerMm = i.cornerMm), t.flashes.push(k), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: y, y: w },
        diameterMm: p,
        shape: i.shape,
        widthMm: i.widthMm,
        heightMm: i.heightMm,
        cornerMm: i.cornerMm,
        rotationDeg: x
      });
    }
    t.x = y, t.y = w;
    return;
  }
}
function Ut(m, t) {
  const e = m.startsWith("-") ? -1 : 1, a = m.replace(/[+\-]/g, ""), l = parseInt(a, 10);
  if (Number.isNaN(l)) return 0;
  const n = Math.pow(10, t.fmtDec), s = l / n * t.unitScale;
  return e * s;
}
function jt(m, t) {
  return /^0+$/.test(m) && /^0+$/.test(t) ? { fmtInt: m.length, fmtDec: t.length } : { fmtInt: parseInt(m, 10), fmtDec: parseInt(t, 10) };
}
function Be(m, t) {
  const e = t.split(/\r?\n/), a = /* @__PURE__ */ new Map();
  let l = null;
  const n = [], s = [];
  let o = 1, f = 2, y = 4, w = !1, _ = !1, b = null, d = !1, h = 0, i = 0, p = 5;
  const u = (x) => {
    if (x.includes(".")) return parseFloat(x) * o;
    const k = x.startsWith("-") ? -1 : 1;
    let A = x.replace(/[+\-]/, "");
    b === "LZ" && (A = A.padEnd(f + y, "0"));
    const E = parseInt(A, 10);
    return Number.isNaN(E) ? 0 : k * (E / Math.pow(10, y)) * o;
  };
  for (const x of e) {
    const k = x.trim();
    if (!k || k.startsWith(";")) continue;
    if (k === "M48") {
      w = !0;
      continue;
    }
    if (k === "%" && w) {
      w = !1;
      continue;
    }
    if (k === "M30" || k === "M00") break;
    if (k === "M15") {
      d = !0;
      continue;
    }
    if (k === "M16" || k === "M17") {
      d = !1, p = 5;
      continue;
    }
    if (w) {
      if (/[,\s]LZ\b/i.test(k) ? b = "LZ" : /[,\s]TZ\b/i.test(k) && (b = "TZ"), k.startsWith("METRIC")) {
        o = 1, _ || (f = 3, y = 3);
        const L = /(\d+)\.(\d+)/.exec(k);
        if (L) {
          const V = jt(L[1], L[2]);
          f = V.fmtInt, y = V.fmtDec, _ = !0;
        }
      } else if (k.startsWith("INCH")) {
        o = 25.4, _ || (f = 2, y = 4);
        const L = /(\d+)\.(\d+)/.exec(k);
        if (L) {
          const V = jt(L[1], L[2]);
          f = V.fmtInt, y = V.fmtDec, _ = !0;
        }
      }
      const z = /^FMAT,(\d+)\.(\d+)/.exec(k) || /^(\d+)\.(\d+)$/.exec(k);
      if (z) {
        const L = jt(z[1], z[2]);
        f = L.fmtInt, y = L.fmtDec, _ = !0;
      }
    }
    if (/^T\d+C[\d.]+/i.test(k)) {
      const z = /^T(\d+)C([\d.]+)/i.exec(k);
      if (z) {
        const L = parseFloat(z[2]) * o;
        Number.isNaN(L) || a.set(z[1], L);
      }
      continue;
    }
    if (/^T\d+$/i.test(k)) {
      const z = /^T(\d+)/i.exec(k);
      z && (l = z[1]);
      continue;
    }
    const A = /^G0*([015])(?!\d)/.exec(k);
    if (A && (p = parseInt(A[1], 10)), /^[GRMF]/.test(k) && !/[XY]/i.test(k)) continue;
    const E = l && a.has(l) ? a.get(l) : 0.6, P = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(k);
    if (P) {
      const z = u(P[1]), L = u(P[2]), V = u(P[3]), M = u(P[4]);
      Number.isFinite(z) && Number.isFinite(L) && (s.push({ x1: z, y1: L, x2: V, y2: M, diameter: E }), h = V, i = M);
      continue;
    }
    const N = /X([+\-]?[\d.]+)/i.exec(k), j = /Y([+\-]?[\d.]+)/i.exec(k);
    if (N || j) {
      const z = N ? u(N[1]) : h, L = j ? u(j[1]) : i;
      Number.isFinite(z) && Number.isFinite(L) && (p === 0 || (d && p === 1 ? s.push({ x1: h, y1: i, x2: z, y2: L, diameter: E }) : n.push({ x: z, y: L, diameter: E, plated: !0 })), h = z, i = L);
    }
  }
  return { name: m, holes: n, slots: s };
}
function Pe(m) {
  return { w: m.maxX - m.minX, h: m.maxY - m.minY };
}
function Pt(m) {
  const { w: t, h: e } = Pe(m);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function St(m, t) {
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
    })),
    // ops drives the polarity-correct copper/mask rendering; it must be scaled
    // in lockstep with tracks/flashes/regions or layers render at the wrong size.
    ops: m.ops.map((e) => e.kind === "track" ? {
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
      cornerMm: e.cornerMm !== void 0 ? e.cornerMm * t : void 0
    } : {
      ...e,
      loops: e.loops.map((a) => a.map((l) => ({ x: l.x * t, y: l.y * t })))
    })
  };
}
function Fe(m, t) {
  return t === 1 ? m : m.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function Ne(m, t) {
  return t === 1 ? m : m.map((e) => ({
    x1: e.x1 * t,
    y1: e.y1 * t,
    x2: e.x2 * t,
    y2: e.y2 * t,
    diameter: (e.diameter ?? 0) * t
  }));
}
function Le(m) {
  return URL.createObjectURL(new Blob([m], { type: "image/svg+xml" }));
}
function bt(m, t, e) {
  m.minX = Math.min(m.minX, t), m.minY = Math.min(m.minY, e), m.maxX = Math.max(m.maxX, t), m.maxY = Math.max(m.maxY, e);
}
function Gt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function xt(m) {
  const t = Gt();
  for (const e of m.tracks) {
    bt(t, e.start.x, e.start.y), bt(t, e.end.x, e.end.y);
    const a = (e.width ?? 0) / 2;
    bt(t, e.start.x - a, e.start.y - a), bt(t, e.start.x + a, e.start.y + a), bt(t, e.end.x - a, e.end.y - a), bt(t, e.end.x + a, e.end.y + a);
  }
  for (const e of m.flashes) {
    const a = (e.widthMm ?? e.diameterMm) || 0, l = (e.heightMm ?? e.diameterMm) || 0;
    bt(t, e.position.x - a / 2, e.position.y - l / 2), bt(t, e.position.x + a / 2, e.position.y + l / 2);
  }
  for (const e of m.regions)
    for (const a of e.loops) for (const l of a) bt(t, l.x, l.y);
  return t;
}
function De(m, t = []) {
  const e = Gt();
  for (const a of m) {
    const l = (a.diameter || 0) / 2;
    bt(e, a.x - l, a.y - l), bt(e, a.x + l, a.y + l);
  }
  for (const a of t) {
    const l = (a.diameter || 0) / 2;
    bt(e, a.x1 - l, a.y1 - l), bt(e, a.x1 + l, a.y1 + l), bt(e, a.x2 - l, a.y2 - l), bt(e, a.x2 + l, a.y2 + l);
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
const $e = 1e3;
function vt(m) {
  return m / 25.4 * $e;
}
function It(m, t, e) {
  const a = m - e.minX, l = e.maxY - t;
  return { x: a, y: l };
}
function Zt(m, t) {
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
    const l = m[a], n = m[(a + 1) % e];
    t += l.x * n.y - n.x * l.y;
  }
  return 0.5 * t;
}
function Xt(m, t, e) {
  if (!m.length) return "";
  const a = (s) => ({
    x: (s.x - t.minX) * e,
    y: (t.maxY - s.y) * e
  }), l = a(m[0]), n = [`M ${l.x.toFixed(2)} ${l.y.toFixed(2)}`];
  for (let s = 1; s < m.length; s++) {
    const o = a(m[s]);
    n.push(`L ${o.x.toFixed(2)} ${o.y.toFixed(2)}`);
  }
  return n.push("Z"), n.join(" ");
}
function ce(m) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = (y, w) => {
    const _ = kt(y), b = kt(w);
    t.has(_) || t.set(_, []), t.has(b) || t.set(b, []), t.get(_).push(w), t.get(b).push(y), e.has(_) || e.set(_, y), e.has(b) || e.set(b, w);
  };
  for (const y of m) a(y.start, y.end);
  const l = /* @__PURE__ */ new Set(), n = (y, w) => {
    const _ = kt(y), b = kt(w);
    return _ < b ? `${_}|${b}` : `${b}|${_}`;
  }, s = [];
  for (const [y, w] of t.entries()) {
    const _ = e.get(y);
    for (const b of w) {
      const d = n(_, b);
      if (l.has(d)) continue;
      const h = [_];
      let i = _, p = b;
      l.add(d);
      for (let u = 0; u < 1e5; u++) {
        h.push(p);
        const x = kt(p), k = t.get(x) ?? [];
        if (k.length === 0) break;
        let A = null;
        for (const E of k) {
          if (kt(E) === kt(i) && k.length > 1) continue;
          const P = n(p, E);
          if (!l.has(P)) {
            A = E, l.add(P);
            break;
          }
        }
        if (A || (A = k[0]), i = p, p = A, kt(p) === kt(_))
          break;
      }
      h.length >= 3 && s.push(h);
    }
  }
  s.sort((y, w) => Math.abs(Qt(w)) - Math.abs(Qt(y)));
  const o = [], f = /* @__PURE__ */ new Set();
  for (const y of s) {
    const w = y.map((_) => kt(_)).join(";");
    f.has(w) || (f.add(w), o.push(y));
  }
  return o;
}
function te(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(vt(e))), n = Math.max(1, Math.round(vt(a))), s = vt(1), o = [];
  for (const f of m.regions)
    for (const y of f.loops)
      o.push(Xt(y, t, s));
  if (o.length === 0 && m.tracks.length) {
    const f = ce(m.tracks);
    if (f.length) {
      const y = f[0];
      o.push(Xt(y, t, s));
      for (let w = 1; w < f.length; w++)
        o.push(Xt(f[w], t, s));
    }
  }
  return o.length === 0 ? Zt(l, n) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${n}" viewBox="0 0 ${l} ${n}">
  <rect x="0" y="0" width="${l}" height="${n}" fill="black"/>
  <path d="${o.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function Ue(m) {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, l = -1 / 0;
  for (const n of m.loops)
    for (const s of n)
      t = Math.min(t, s.x), e = Math.min(e, s.y), a = Math.max(a, s.x), l = Math.max(l, s.y);
  return { minX: t, minY: e, maxX: a, maxY: l };
}
function We(m, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let a = 0, l = 0;
  for (const y of m.regions) {
    const w = Ue(y), _ = (w.maxX - w.minX) * (w.maxY - w.minY);
    y.polarity === "clear" ? l = Math.max(l, _) : a = Math.max(a, _);
  }
  const n = m.tracks.filter((y) => y.polarity !== "clear").length + m.flashes.filter((y) => y.polarity !== "clear").length + m.regions.filter((y) => y.polarity !== "clear").length, s = m.tracks.filter((y) => y.polarity === "clear").length + m.flashes.filter((y) => y.polarity === "clear").length + m.regions.filter((y) => y.polarity === "clear").length, o = l > e * 0.85;
  return !(a > e * 0.85 || !o || !(s > n * 2));
}
function Ft(m, t, e, a) {
  const l = t.maxX - t.minX, n = t.maxY - t.minY, s = Math.max(1, Math.round(vt(l))), o = Math.max(1, Math.round(vt(n))), f = vt(1), w = We(m, t) ? "white" : "black", _ = (i, p) => {
    const u = i - t.minX, x = t.maxY - p;
    return { x: u * f, y: x * f };
  }, b = (i, p) => {
    if (i.kind === "track") {
      const u = _(i.start.x, i.start.y), x = _(i.end.x, i.end.y), k = Number.isFinite(i.widthMm) ? i.widthMm : 0.2, A = Math.max(1, k * f);
      return `<line x1="${u.x.toFixed(2)}" y1="${u.y.toFixed(2)}" x2="${x.x.toFixed(2)}" y2="${x.y.toFixed(2)}" stroke-width="${A.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${p}" stroke="${p}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (i.kind === "flash") {
      const u = _(i.position.x, i.position.y), x = i.widthMm ?? i.diameterMm ?? 0.8, k = i.heightMm ?? i.diameterMm ?? 0.8, A = Math.max(0.01, Number.isFinite(x) ? x : 0.8) * f, E = Math.max(0.01, Number.isFinite(k) ? k : 0.8) * f, P = u.x - A / 2, N = u.y - E / 2, j = i.rotationDeg, z = j && Math.abs(j) > 0.01 ? ` transform="rotate(${(-j).toFixed(2)},${u.x.toFixed(2)},${u.y.toFixed(2)})"` : "";
      if (i.shape === "R" || i.shape === "O") {
        const V = i.shape === "O" ? Math.min(A, E) * 0.5 : 0;
        return `<rect x="${P.toFixed(2)}" y="${N.toFixed(2)}" width="${A.toFixed(2)}" height="${E.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${p}" fill-opacity="1"${z} />`;
      }
      if (Number.isFinite(i.cornerMm) && (i.cornerMm ?? 0) > 0) {
        const V = Math.max(0, i.cornerMm * f);
        return `<rect x="${P.toFixed(2)}" y="${N.toFixed(2)}" width="${A.toFixed(2)}" height="${E.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${p}" fill-opacity="1"${z} />`;
      }
      const L = Math.max(1, Math.max(A, E) / 2);
      return `<circle cx="${u.x.toFixed(2)}" cy="${u.y.toFixed(2)}" r="${L.toFixed(2)}" fill="${p}" fill-opacity="1" />`;
    }
    if (i.kind === "region") {
      const u = i.loops.map((x) => {
        if (!x.length) return "";
        const k = _(x[0].x, x[0].y), A = [`M ${k.x.toFixed(2)} ${k.y.toFixed(2)}`];
        for (let E = 1; E < x.length; E++) {
          const P = _(x[E].x, x[E].y);
          A.push(`L ${P.x.toFixed(2)} ${P.y.toFixed(2)}`);
        }
        return A.push("Z"), A.join(" ");
      }).join(" ");
      return u.trim() ? `<path d="${u}" fill-rule="evenodd" fill="${p}" fill-opacity="1" />` : "";
    }
    return "";
  }, d = [];
  for (const i of m.ops) {
    const p = i.polarity === "clear" ? "black" : "white", u = b(i, p);
    u && d.push(u);
  }
  const h = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${o}" viewBox="0 0 ${s} ${o}">
  <defs>
    <mask id="${h}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${s}" height="${o}" fill="${w}" fill-opacity="1" />
      ${d.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${s}" height="${o}" fill="${e}" opacity="${a}" mask="url(#${h})" />
</svg>`.trim();
}
function ee(m, t) {
  const e = t.maxX - t.minX, a = t.maxY - t.minY, l = Math.max(1, Math.round(vt(e))), n = Math.max(1, Math.round(vt(a))), s = Math.max(1e-6, vt(1)), o = "rgba(255,255,255,0.95)", f = "rgba(255,255,255,0.95)", y = m.tracks.map((b) => {
    const d = It(b.start.x, b.start.y, t), h = It(b.end.x, b.end.y, t), i = Number.isFinite(b.width) ? b.width : 0.15, p = Math.max(1, i * s);
    return `<line x1="${(d.x * s).toFixed(2)}" y1="${(d.y * s).toFixed(2)}" x2="${(h.x * s).toFixed(2)}" y2="${(h.y * s).toFixed(2)}" stroke="${o}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), w = m.flashes.map((b) => {
    const d = It(b.position.x, b.position.y, t), h = d.x * s, i = d.y * s, p = b.widthMm ?? b.diameterMm ?? 0.6, u = b.heightMm ?? b.diameterMm ?? 0.6;
    if (b.shape === "R" || b.shape === "O") {
      const k = p * s, A = u * s, E = h - k / 2, P = i - A / 2, N = b.shape === "O" ? Math.min(k, A) * 0.35 : 0;
      return `<rect x="${E.toFixed(2)}" y="${P.toFixed(2)}" width="${k.toFixed(2)}" height="${A.toFixed(2)}" rx="${N.toFixed(2)}" fill="${f}" />`;
    }
    const x = (b.diameterMm ?? 0.6) * s / 2;
    return `<circle cx="${h.toFixed(2)}" cy="${i.toFixed(2)}" r="${Math.max(1, x).toFixed(2)}" fill="${f}" />`;
  }), _ = m.regions.map((b) => {
    const d = b.loops.map((h) => {
      if (!h.length) return "";
      const i = It(h[0].x, h[0].y, t), p = [`M ${(i.x * s).toFixed(2)} ${(i.y * s).toFixed(2)}`];
      for (let u = 1; u < h.length; u++) {
        const x = It(h[u].x, h[u].y, t);
        p.push(`L ${(x.x * s).toFixed(2)} ${(x.y * s).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return d.trim() ? `<path d="${d}" fill="${f}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${n}" viewBox="0 0 ${l} ${n}">
  ${y.join(`
  `)}
  ${w.join(`
  `)}
  ${_.join(`
  `)}
</svg>`.trim();
}
function je(m, t, e) {
  const a = e.maxX - e.minX, l = e.maxY - e.minY, n = Math.round(vt(a)), s = Math.round(vt(l)), o = vt(1), f = m.map((w) => {
    const _ = It(w.x, w.y, e), b = _.x * o, d = _.y * o, h = Math.max(1.5, (w.diameter || 0.6) * o / 2);
    return `<circle cx="${b.toFixed(2)}" cy="${d.toFixed(2)}" r="${(h + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${b.toFixed(2)}" cy="${d.toFixed(2)}" r="${h.toFixed(2)}" fill="#111111" />`;
  }), y = t.map((w) => {
    const _ = It(w.x1, w.y1, e), b = It(w.x2, w.y2, e), d = (_.x * o).toFixed(2), h = (_.y * o).toFixed(2), i = (b.x * o).toFixed(2), p = (b.y * o).toFixed(2), u = Math.max(3, (w.diameter || 0.6) * o);
    return `<line x1="${d}" y1="${h}" x2="${i}" y2="${p}" stroke="#c97c2a" stroke-width="${(u + 4).toFixed(2)}" stroke-linecap="round" /><line x1="${d}" y1="${h}" x2="${i}" y2="${p}" stroke="#111111" stroke-width="${u.toFixed(2)}" stroke-linecap="round" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${s}" viewBox="0 0 ${n} ${s}">
  ${f.join(`
  `)}
  ${y.join(`
  `)}
</svg>`.trim();
}
async function de(m) {
  const t = Object.keys(m).filter((Q) => !!Q), e = ze(t), a = new TextDecoder("utf-8", { fatal: !1 }), l = async (Q) => {
    if (!Q) return null;
    const ht = m[Q];
    if (!ht) return null;
    const yt = a.decode(ht);
    return yt.charCodeAt(0) === 65279 ? yt.slice(1) : yt;
  }, n = await l(e.top_copper), s = await l(e.bottom_copper), o = await l(e.outline), f = e.drills?.length ? await Promise.all(e.drills.map((Q) => l(Q))) : [], y = await l(e.top_silk), w = await l(e.bottom_silk), _ = e.inner_copper?.length ? await Promise.all(e.inner_copper.map((Q) => l(Q))) : [], b = n ? At(e.top_copper || "top", n) : null, d = s ? At(e.bottom_copper || "bot", s) : null, h = o ? At(e.outline || "outline", o) : null, i = [], p = [];
  if (e.drills)
    for (let Q = 0; Q < e.drills.length; Q++) {
      const ht = f[Q];
      if (ht) {
        const yt = Be(e.drills[Q], ht);
        for (const Rt of yt.holes) i.push({ x: Rt.x, y: Rt.y, diameter: Rt.diameter });
        for (const Rt of yt.slots) p.push(Rt);
      }
    }
  const u = await l(e.top_mask), x = await l(e.bottom_mask), k = y ? At(e.top_silk || "top_silk", y) : null, A = w ? At(e.bottom_silk || "bot_silk", w) : null, E = u ? At(e.top_mask || "top_mask", u) : null, P = x ? At(e.bottom_mask || "bot_mask", x) : null, N = _.map(
    (Q, ht) => Q ? At(e.inner_copper[ht], Q) : null
  );
  if (!!!(b || d || h || k || A || E || P || i.length || p.length || N.some(Boolean)))
    throw new ut(
      "MISSING_LAYERS",
      "No recognizable Gerber or drill layers were found in the bundle.",
      { files: t }
    );
  const z = b ? wt(xt(b)) : null, L = d ? wt(xt(d)) : null, V = h ? wt(xt(h)) : null, M = i.length || p.length ? wt(De(i, p)) : null, D = k ? wt(xt(k)) : null, c = A ? wt(xt(A)) : null, $ = E ? wt(xt(E)) : null, it = P ? wt(xt(P)) : null, X = (V && Pt(V) ? V : null) || (z && Pt(z) ? z : null) || (L && Pt(L) ? L : null) || (M && Pt(M) ? M : null), et = X ? X.maxX - X.minX : 1, Y = z ? St(z.maxX - z.minX, et) : 1, rt = L ? St(L.maxX - L.minX, et) : 1, O = V ? St(V.maxX - V.minX, et) : 1, T = M ? St(M.maxX - M.minX, et) : 1, J = D ? St(D.maxX - D.minX, et) : 1, H = c ? St(c.maxX - c.minX, et) : 1, G = $ ? St($.maxX - $.minX, et) : 1, lt = it ? St(it.maxX - it.minX, et) : 1, nt = N.map((Q) => Q ? wt(xt(Q)) : null).map((Q) => Q ? St(Q.maxX - Q.minX, et) : 1), st = b ? Et(b, Y) : null, ct = d ? Et(d, rt) : null, at = h ? Et(h, O) : null, _t = i.length ? Fe(i, T) : [], B = p.length ? Ne(p, T) : [], r = k ? Et(k, J) : null, I = A ? Et(A, H) : null, R = E ? Et(E, G) : null, v = P ? Et(P, lt) : null, g = N.map(
    (Q, ht) => Q ? Et(Q, nt[ht]) : null
  );
  let S = null;
  if (at) {
    const Q = wt(xt(at));
    Pt(Q) && (S = Q);
  }
  if (!S) {
    let Q = Gt();
    st && (Q = Jt(Q, xt(st))), ct && (Q = Jt(Q, xt(ct))), Q = wt(Q), S = Q;
  }
  const F = wt(S), U = F.maxX - F.minX, C = F.maxY - F.minY;
  let W;
  if (at) {
    const Q = [];
    for (const ht of at.regions)
      for (const yt of ht.loops)
        yt.length >= 3 && Q.push(yt);
    if (Q.length === 0 && at.tracks.length)
      for (const ht of ce(at.tracks))
        ht.length >= 3 && Q.push(ht);
    Q.length > 0 && (W = Q);
  }
  const q = {
    board: {
      width_in: U / 25.4,
      height_in: C / 25.4,
      mm_bounds: {
        min_x_mm: F.minX,
        min_y_mm: F.minY,
        max_x_mm: F.maxX,
        max_y_mm: F.maxY
      }
    },
    outline_loops_mm: W
  }, Z = Math.max(1, Math.round(vt(U))), K = Math.max(1, Math.round(vt(C))), ot = [], tt = (Q) => {
    const ht = Le(Q);
    return ot.push(ht), ht;
  }, mt = at ? te(at, F) : Zt(Z, K), Ct = at ? te(at, F) : Zt(Z, K), pt = {
    top_board_mask: tt(mt),
    bottom_board_mask: tt(Ct)
  };
  st && (pt.top_copper = tt(Ft(st, F, "#fbbf24", 1))), ct && (pt.bottom_copper = tt(Ft(ct, F, "#38bdf8", 1))), R && (pt.top_mask = tt(Ft(R, F, "#fbbf24", 0.9))), v && (pt.bottom_mask = tt(Ft(v, F, "#38bdf8", 0.9))), (_t.length || B.length) && (pt.drills = tt(je(_t, B, F)));
  const Mt = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"], dt = [];
  for (let Q = 0; Q < g.length; Q++) {
    const ht = g[Q];
    ht && dt.push(tt(Ft(ht, F, Mt[Q % Mt.length], 1)));
  }
  return dt.length && (pt.inner_copper = dt), r && (pt.top_silk = tt(ee(r, F))), I && (pt.bottom_silk = tt(ee(I, F))), {
    boardGeom: q,
    layers: pt,
    revoke: () => ot.forEach((Q) => URL.revokeObjectURL(Q))
  };
}
async function hr(m) {
  const t = m instanceof Uint8Array ? m.byteOffset === 0 && m.byteLength === m.buffer.byteLength ? m.buffer : m.slice().buffer : m instanceof ArrayBuffer ? m : await m.arrayBuffer(), { files: e, archiveType: a } = await le(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (a !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${a}`);
  return await de(e);
}
async function ur(m, t) {
  const { files: e } = await le(m, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await de(e);
}
function Yt(m, t) {
  const [
    e,
    a,
    l,
    n,
    s,
    o,
    f,
    y,
    w
  ] = m, [
    _,
    b,
    d,
    h,
    i,
    p,
    u,
    x,
    k
  ] = t;
  return [
    e * _ + a * h + l * u,
    e * b + a * i + l * x,
    e * d + a * p + l * k,
    n * _ + s * h + o * u,
    n * b + s * i + o * x,
    n * d + s * p + o * k,
    f * _ + y * h + w * u,
    f * b + y * i + w * x,
    f * d + y * p + w * k
  ];
}
function re(m, t) {
  return [1, 0, m, 0, 1, t, 0, 0, 1];
}
function Xe(m, t) {
  return [m, 0, 0, 0, t, 0, 0, 0, 1];
}
function Ye(m) {
  const t = Math.cos(m), e = Math.sin(m);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function ie(m, t) {
  const e = m[0] * t.x + m[1] * t.y + m[2], a = m[3] * t.x + m[4] * t.y + m[5], l = m[6] * t.x + m[7] * t.y + m[8];
  if (l === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / l, y: a / l };
}
function Ze(m) {
  const t = m[0], e = m[1], a = m[2], l = m[3], n = m[4], s = m[5], o = t * n - e * l;
  if (Math.abs(o) < 1e-12) throw new Error("Non-invertible transform");
  const f = 1 / o, y = n * f, w = -e * f, _ = -l * f, b = t * f, d = -(y * a + w * s), h = -(_ * a + b * s);
  return [y, w, d, _, b, h, 0, 0, 1];
}
class Ge {
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
      return ie(this.worldToScreenMat, e);
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
      return ie(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: a, zoom: l, rotation_rad: n, mirrorX: s, mirrorY: o } = this.camera, f = { x: t / 2, y: e / 2 }, y = o ? -1 : 1, w = s ? -1 : 1, _ = re(-a.x, -a.y), b = Ye(n), d = Xe(l * w, l * y), h = re(f.x, f.y), i = Yt(h, Yt(d, Yt(b, _)));
    this.worldToScreenMat = i, this.screenToWorldMat = Ze(i);
  }
}
class Ve {
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
let qe = class {
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
class He {
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
    let n = this.cells.get(l);
    n || (n = /* @__PURE__ */ new Set(), this.cells.set(l, n)), n.add(t);
  }
  remove(t, e, a) {
    const { key: l } = this.cellCoord(e, a), n = this.cells.get(l);
    n && (n.delete(t), n.size === 0 && this.cells.delete(l));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, a) {
    const { cx: l, cy: n } = this.cellCoord(t, e), s = Math.ceil(a / this.cellSize_mm), o = [];
    for (let f = -s; f <= s; f++)
      for (let y = -s; y <= s; y++) {
        const w = `${l + f},${n + y}`, _ = this.cells.get(w);
        if (_)
          for (const b of _) o.push(b);
      }
    return o;
  }
}
class Ke {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new He(5), this.dirtyList = !0, this.listCache = [];
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
    const l = this.index.queryRadius(t, e, a), n = [];
    for (const s of l) {
      const o = this.byId.get(s);
      o && n.push(o);
    }
    return n;
  }
}
class Je {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, a, l = 10) {
    const n = t.screenToBoard({ x: e, y: a }), s = t.xform.getCamera().zoom, o = l / s, f = this.store.queryNear(n.x, n.y, o);
    let y = null;
    for (const w of f) {
      const _ = t.boardToScreen({ x: w.x_mm, y: w.y_mm }), b = _.x - e, d = _.y - a, h = Math.sqrt(b * b + d * d);
      h <= l && (!y || h < y.distance_px) && (y = { id: w.id, marker: w, distance_px: h });
    }
    return y;
  }
}
class Qe {
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
    for (const n of l) n(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class tr {
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
class er {
  constructor(t, e) {
    this.passes = [], this.overlays = new qe(), this.resizeObserver = null, this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Ke(), this.markerPicker = new Je(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Qe(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const a = t.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context");
    this.ctx = a;
    const l = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new Ge(e, l), this.visibility = new tr(), this.scheduler = new Ve(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: n, y_mm: s }) => {
        const o = this.xform.boardToScreen({ x: n, y: s });
        return { x_px: o.x, y_px: o.y };
      },
      screenToBoard: ({ x_px: n, y_px: s }) => {
        const o = this.xform.screenToBoard({ x: n, y: s });
        return { x_mm: o.x, y_mm: o.y };
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
    const t = this.ctx, e = this.canvas, a = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(a);
    const l = {
      canvas: e,
      ctx: t,
      viewport: a,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibility.getState(),
      // Use visibility manager
      boardBounds: this.boardBounds,
      boardToScreen: (n) => this.xform.boardToScreen({ x: n.x, y: n.y }),
      screenToBoard: (n) => this.xform.screenToBoard({ x: n.x, y: n.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, e.width, e.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, e.width, e.height);
    for (const n of this.passes)
      if (n.enabled(l)) {
        t.save();
        try {
          n.draw(l);
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
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), n = this.markerPicker.pick(l, e, a, 10);
    this.setHoverMarker(n?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: a } = this.eventToCanvasPx(t), l = this.createRenderCtx(), n = this.markerPicker.pick(l, e, a, 10);
    if (n) {
      this.selectMarker(n.id);
      return;
    }
    const s = l.screenToBoard({ x: e, y: a });
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
function rr(m, t) {
  return {
    x_mm: m.x_mm,
    y_mm: t.minY_mm + t.maxY_mm - m.y_mm
  };
}
function ir(m, t) {
  return m.x_mm < t.minX_mm || m.x_mm > t.maxX_mm || m.y_mm < t.minY_mm || m.y_mm > t.maxY_mm;
}
const zt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function mr(m, t, e, a) {
  return {
    id: `gerber:${m}`,
    order: t,
    enabled: (l) => l.visibility.gerber[e],
    draw: (l) => {
      const n = l.ctx, s = l.xform.getWorldToScreenMatrix();
      n.setTransform(s[0], s[3], s[1], s[4], s[2], s[5]), a(n);
    }
  };
}
class nr {
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
function sr(m, t) {
  return {
    id: "overlay:all",
    order: (zt.OVERLAYS_MIN + zt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const l = m.getAll().filter((s) => e.visibility.overlays[s.id] ?? s.visible);
      l.sort((s, o) => s.zIndex - o.zIndex);
      const n = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const s of l)
        e.ctx.save(), s.draw(e.ctx, n), e.ctx.restore();
    }
  };
}
let or = class {
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
      for (const n of this.markers.values()) {
        if (!n.position || typeof n.position.x != "number" || typeof n.position.y != "number" || !isFinite(n.position.x) || !isFinite(n.position.y)) {
          console.warn(`Invalid marker position for ${n.id}:`, {
            position: n.position,
            marker: n,
            keys: Object.keys(n)
          });
          continue;
        }
        const s = t.boardToScreen(n.position);
        s.x < -10 || s.x > t.viewport.width_px + 10 || s.y < -10 || s.y > t.viewport.height_px + 10 || this.drawMarker(e, s, n, a);
      }
    }
  }
  drawMarker(t, e, a, l) {
    const n = Math.max(3, Math.min(8, l / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, n, 0, Math.PI * 2), a.type) {
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
function ar(m) {
  return {
    id: "markers",
    order: (zt.MARKERS_MIN + zt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => m.draw(t)
  };
}
class lr {
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
    const a = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(a, t, e.id);
        break;
      case "geometry":
        break;
      case "region":
        this.drawRegionSelection(a, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, a) {
    if (!a || !this.getMarkerPosition) return;
    const l = this.getMarkerPosition(a);
    if (!l) return;
    const n = e.boardToScreen(l);
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.beginPath(), t.arc(n.x, n.y, 12, 0, Math.PI * 2), t.stroke();
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
function cr(m, t) {
  return {
    id: "selection",
    order: (zt.SELECTION_MIN + zt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const a = t();
      a && m.draw(e, a);
    }
  };
}
function yr(m, t = {}) {
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
  const l = m.firstElementChild, n = nt(l, "#board-viewport"), s = nt(l, "#render-canvas"), o = nt(l, "#grid-toggle"), f = nt(l, "#grid-units"), y = nt(l, "#fit-btn"), w = a ? nt(l, "#download-btn") : null, _ = Array.from(l.querySelectorAll('input[name="side"]')), b = nt(l, "#layer-menu-btn"), d = nt(l, "#layer-panel"), h = new er(s, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), i = h.getVisibilityManager();
  i.subscribe(() => {
    h.requestRender("visibility-change");
  });
  const p = new nr(), u = new or(), x = new lr((B) => u.get(B)?.position);
  let k = null;
  function A() {
    const B = n.getBoundingClientRect();
    s.width = Math.max(1, Math.round(B.width)), s.height = Math.max(1, Math.round(B.height)), s.style.width = `${B.width}px`, s.style.height = `${B.height}px`, h.requestRender("resize");
  }
  const E = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (B, r) => {
      const R = r.view.zoom, v = f.value, g = v === "mm" ? 1 : 2.54, S = v === "mm" ? 10 : 25.4, F = g * R, U = S * R;
      if (F < 2) return;
      const C = r.screenToBoard({ x: 0, y: 0 }), W = r.screenToBoard({ x: s.width, y: s.height });
      B.setTransform(1, 0, 0, 1, 0, 0), B.strokeStyle = "rgba(59, 130, 246, 0.4)", B.lineWidth = 1, B.beginPath();
      const q = Math.floor(C.x / g) * g, Z = Math.floor(C.y / g) * g;
      for (let K = q; K <= W.x; K += g) {
        const ot = r.boardToScreen({ x: K, y: 0 }).x;
        B.moveTo(ot, 0), B.lineTo(ot, s.height);
      }
      for (let K = Z; K <= W.y; K += g) {
        const ot = r.boardToScreen({ x: 0, y: K }).y;
        B.moveTo(0, ot), B.lineTo(s.width, ot);
      }
      if (B.stroke(), U >= 8) {
        B.strokeStyle = "rgba(59, 130, 246, 0.7)", B.lineWidth = 1.5, B.beginPath();
        const K = Math.floor(C.x / S) * S, ot = Math.floor(C.y / S) * S;
        for (let tt = K; tt <= W.x; tt += S) {
          const mt = r.boardToScreen({ x: tt, y: 0 }).x;
          B.moveTo(mt, 0), B.lineTo(mt, s.height);
        }
        for (let tt = ot; tt <= W.y; tt += S) {
          const mt = r.boardToScreen({ x: 0, y: tt }).y;
          B.moveTo(0, mt), B.lineTo(s.width, mt);
        }
        B.stroke();
      }
    }
  };
  p.add(E), i.setOverlayVisibility("grid", !1), i.setMarkersVisibility(!1), h.addPass(sr(p, h.getOverlayApi())), h.addPass(ar(u)), h.addPass(cr(x, () => k));
  const P = {}, N = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:top-copper": { label: "Top copper", color: "#fbbf24" },
    "layer:top-mask": { label: "Top soldermask", color: "#fde68a" },
    "layer:top-silk": { label: "Top silkscreen", color: "#f1f5f9" },
    "layer:bottom-copper": { label: "Bottom copper", color: "#38bdf8" },
    "layer:bottom-mask": { label: "Bottom soldermask", color: "#bae6fd" },
    "layer:bottom-silk": { label: "Bottom silkscreen", color: "#f1f5f9" },
    "layer:drills": { label: "Drill holes", color: "#111111" }
  }, j = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  let z = null, L = {}, V = "top", M = !1;
  function D(B, r, I) {
    if (!I) return null;
    B in P || (P[B] = !0);
    const R = new Image();
    return R.src = I, R.addEventListener("load", () => {
      h.requestRender(`image-loaded-${B}`);
    }), {
      id: B,
      order: r,
      enabled: (v) => !!(P[B] ?? !0) && !!z?.board?.mm_bounds,
      draw: (v) => {
        if (!R.complete || !z?.board?.mm_bounds) return;
        const g = v.ctx, S = v.xform.getWorldToScreenMatrix();
        g.setTransform(S[0], S[3], S[1], S[4], S[2], S[5]);
        let F;
        (L.top_board_mask || L.bottom_board_mask) && (F = 0.5);
        const U = $(g, z, F);
        et(g, U, (C) => {
          if (!z?.board?.mm_bounds) return;
          const W = z.board.mm_bounds, q = W.max_x_mm - W.min_x_mm, Z = W.max_y_mm - W.min_y_mm;
          C.drawImage(R, W.min_x_mm, W.min_y_mm, q, Z);
        });
      }
    };
  }
  function c(B, r) {
    return B in P || (P[B] = !0), {
      id: B,
      order: r,
      enabled: (I) => !!(P[B] ?? !0) && !!z?.board?.mm_bounds,
      draw: (I) => {
        if (!z?.board?.mm_bounds) return;
        const R = I.ctx, v = I.xform.getWorldToScreenMatrix();
        R.setTransform(v[0], v[3], v[1], v[4], v[2], v[5]);
        const g = $(R, z, 0.5);
        X(R, g);
      }
    };
  }
  function $(B, r, I) {
    if (!r?.board?.mm_bounds) return new Path2D();
    const R = r.board.mm_bounds;
    if (r.outline_loops_mm?.length) {
      const v = new Path2D(), g = (S) => R.max_y_mm + R.min_y_mm - S;
      for (const S of r.outline_loops_mm)
        if (S.length) {
          v.moveTo(S[0].x, g(S[0].y));
          for (let F = 1; F < S.length; F++)
            v.lineTo(S[F].x, g(S[F].y));
          v.closePath();
        }
      return v;
    }
    return it(
      R.min_x_mm,
      R.min_y_mm,
      R.max_x_mm - R.min_x_mm,
      R.max_y_mm - R.min_y_mm,
      I || 0
    );
  }
  function it(B, r, I, R, v) {
    const g = new Path2D(), S = Math.max(0, Math.min(v, Math.min(I, R) / 2));
    return g.moveTo(B + S, r), g.lineTo(B + I - S, r), g.quadraticCurveTo(B + I, r, B + I, r + S), g.lineTo(B + I, r + R - S), g.quadraticCurveTo(B + I, r + R, B + I - S, r + R), g.lineTo(B + S, r + R), g.quadraticCurveTo(B, r + R, B, r + R - S), g.lineTo(B, r + S), g.quadraticCurveTo(B, r, B + S, r), g.closePath(), g;
  }
  function X(B, r) {
    B.save(), B.clip(r), B.fillStyle = "#1a5f1a", B.fill(r), B.strokeStyle = "#0d3d0d", B.lineWidth = 0.1, B.stroke(r), B.restore();
  }
  function et(B, r, I) {
    B.save(), B.clip(r), I(B), B.restore();
  }
  function Y() {
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
      ...Object.keys(P).filter((I) => I.startsWith("layer:inner-"))
    ].forEach((I) => h.removePass(I)), !z) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: V === "bottom" ? L.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: V === "bottom" ? L.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: V === "bottom" ? L.bottom_silk : void 0 },
      // Inner layers occupy orders 21..24 (registered dynamically below)
      { id: "layer:top-copper", order: 25, url: V === "top" ? L.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: V === "top" ? L.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: V === "top" ? L.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: L.drills },
      { id: "layer:vias", order: 45, url: L.vias }
    ].forEach((I) => {
      let R;
      I.useFR4 ? R = c(I.id, I.order) : I.url && (R = D(I.id, I.order, I.url)), R && h.addPass(R);
    }), L.inner_copper && L.inner_copper.forEach((I, R) => {
      const v = `layer:inner-${R + 1}`;
      N[v] = {
        label: `Inner ${R + 1}`,
        color: j[R % j.length]
      };
      const g = D(v, 21 + R, I);
      g && h.addPass(g);
    }), h.requestRender("side-switch"), setTimeout(() => h.requestRender("side-switch-delayed"), 50), rt();
  }
  function rt() {
    const I = [
      "layer:drills",
      "layer:top-silk",
      "layer:top-mask",
      "layer:top-copper",
      ...Object.keys(N).filter((R) => R.startsWith("layer:inner-")).sort((R, v) => {
        const g = parseInt(R.split("-").pop() || "0", 10), S = parseInt(v.split("-").pop() || "0", 10);
        return g - S;
      }),
      "layer:bottom-silk",
      "layer:bottom-mask",
      "layer:bottom-copper",
      "layer:fr4"
    ].filter((R) => !!h.getPass(R));
    d.innerHTML = I.map((R) => {
      const v = N[R] ?? { label: R, color: "#888" }, g = P[R] ?? !0, S = v.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${R}"><span class="layer-swatch" style="background:${v.color};${S}"></span><span>${v.label}</span><input type="checkbox"${g ? " checked" : ""} /></label>`;
    }).join(""), d.querySelectorAll(".layer-item input").forEach((R) => {
      R.addEventListener("change", () => {
        const v = R.closest("[data-layer-id]")?.dataset.layerId;
        v && (P[v] = R.checked, h.requestRender("layer-toggle"));
      });
    });
  }
  function O(B = 0.08) {
    if (!z?.board?.mm_bounds) return;
    const r = n.getBoundingClientRect(), I = z.board.mm_bounds, R = I.max_x_mm - I.min_x_mm, v = I.max_y_mm - I.min_y_mm, g = r.width * (1 - 2 * B), S = r.height * (1 - 2 * B), F = g / R, U = S / v, C = Math.min(F, U), W = (I.min_x_mm + I.max_x_mm) / 2, q = (I.min_y_mm + I.max_y_mm) / 2;
    h.setCamera({
      center_mm: { x: W, y: q },
      zoom: C
    });
  }
  s.addEventListener("wheel", (B) => {
    B.preventDefault(), M = !0;
    const r = s.getBoundingClientRect(), I = B.clientX - r.left, R = B.clientY - r.top, v = h.getCamera(), g = B.deltaY < 0 ? 1.1 : 0.9, S = Math.max(0.2, Math.min(50, v.zoom * g)), F = h.screenToBoard(I, R);
    h.setCamera({ zoom: S });
    const U = h.screenToBoard(I, R), C = F.x - U.x, W = F.y - U.y;
    h.setCamera({
      center_mm: {
        x: v.center_mm.x + C,
        y: v.center_mm.y + W
      }
    });
  }, { passive: !1 });
  let T = !1, J = null;
  s.addEventListener("mousedown", (B) => {
    if (B.button !== 0) return;
    B.preventDefault(), M = !0, T = !0;
    const r = s.getBoundingClientRect();
    J = h.screenToBoard(
      B.clientX - r.left,
      B.clientY - r.top
    );
  });
  const H = (B) => {
    if (!T || !J) return;
    const r = s.getBoundingClientRect(), I = h.screenToBoard(
      B.clientX - r.left,
      B.clientY - r.top
    ), R = J.x - I.x, v = J.y - I.y, g = h.getCamera();
    h.setCamera({
      center_mm: {
        x: g.center_mm.x + R,
        y: g.center_mm.y + v
      }
    });
  }, G = () => {
    T = !1, J = null;
  };
  window.addEventListener("mousemove", H), window.addEventListener("mouseup", G), o.addEventListener("change", () => {
    const B = o.checked;
    i.setOverlayVisibility("grid", B), E.visible = B, h.requestRender("grid-toggle");
  }), f.addEventListener("change", () => {
    i.isOverlayVisible("grid") && h.requestRender("grid-units");
  }), y.addEventListener("click", () => O(0.08)), w?.addEventListener("click", () => t.onDownload?.()), b.addEventListener("click", (B) => {
    B.stopPropagation();
    const r = !d.hidden;
    d.hidden = r, b.classList.toggle("active", !r);
  });
  const lt = (B) => {
    !d.hidden && !d.contains(B.target) && B.target !== b && (d.hidden = !0, b.classList.remove("active"));
  };
  document.addEventListener("click", lt), _.forEach((B) => {
    B.addEventListener("change", () => {
      V = _.find((r) => r.checked)?.value || "top", Y();
    });
  });
  const ft = () => {
    A(), M || O(0.08);
  };
  window.addEventListener("resize", ft);
  function nt(B, r) {
    const I = B.querySelector(r);
    if (!I) throw new Error(`Missing required element: ${r}`);
    return I;
  }
  function st(B) {
    z = B.boardGeom, L = B.layers, z?.board?.mm_bounds && h.setBoardBounds({
      minX_mm: z.board.mm_bounds.min_x_mm,
      minY_mm: z.board.mm_bounds.min_y_mm,
      maxX_mm: z.board.mm_bounds.max_x_mm,
      maxY_mm: z.board.mm_bounds.max_y_mm
    }), Y(), A(), O(0.08);
  }
  function ct(B) {
    V = B;
    const r = _.find((I) => I.value === B);
    r && (r.checked = !0), Y();
  }
  function at(B, r) {
    const I = z?.board?.mm_bounds;
    if (!I) return { x: B, y: r };
    const R = rr(
      { x_mm: B, y_mm: r },
      { minX_mm: I.min_x_mm, minY_mm: I.min_y_mm, maxX_mm: I.max_x_mm, maxY_mm: I.max_y_mm }
    );
    return { x: R.x_mm, y: R.y_mm };
  }
  function _t() {
    window.removeEventListener("mousemove", H), window.removeEventListener("mouseup", G), window.removeEventListener("resize", ft), document.removeEventListener("click", lt), h.dispose(), m.innerHTML = "";
  }
  return A(), {
    setData: st,
    setSideMode: ct,
    fit: () => O(0.08),
    dispose: _t,
    // Expose new render pipeline API
    viewer: h,
    visibility: i,
    overlayRegistry: p,
    markerRenderer: u,
    setSelection: (B) => {
      k = B, h.requestRender("selection-change");
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
      const r = {
        id: B.id,
        position: at(B.x_mm, B.y_mm),
        type: "custom",
        // Default type for DFM markers
        data: {
          ...B.data,
          severity: B.severity,
          layer: B.layer,
          radius_mm: B.radius_mm
        }
      };
      u.add(r), h.requestRender("marker-added");
    },
    addMarkers: (B) => {
      for (const r of B) {
        if (typeof r.x_mm != "number" || typeof r.y_mm != "number" || !isFinite(r.x_mm) || !isFinite(r.y_mm)) {
          console.warn(`Invalid marker coordinates for ${r.id}:`, {
            x_mm: r.x_mm,
            y_mm: r.y_mm,
            marker: r,
            keys: Object.keys(r)
          });
          continue;
        }
        const I = {
          id: r.id,
          position: { x: r.x_mm, y: r.y_mm },
          type: "custom",
          // Default type for DFM markers
          data: {
            ...r.data,
            severity: r.severity,
            layer: r.layer,
            radius_mm: r.radius_mm
          }
        };
        u.add(I);
      }
      h.requestRender("markers-added");
    },
    removeMarker: (B) => {
      u.remove(B), h.requestRender("marker-removed");
    }
  };
}
function gr(m, t) {
  return {
    id: "overlay:all",
    order: zt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const a = e.xform.getWorldToScreenMatrix(), l = m.getSortedVisible();
      for (const n of l)
        e.ctx.save(), n.drawInWorldSpace ? e.ctx.setTransform(a[0], a[3], a[1], a[4], a[2], a[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), n.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function _r() {
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
function br(m) {
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
function vr(m = 1) {
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
function wr(m) {
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
class dr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const a = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: l, height_px: n } = t.viewport, s = 4;
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
      const f = t.boardToScreen({ x: o.x_mm, y: o.y_mm }), y = f.x, w = f.y;
      if (y < -10 || w < -10 || y > l + 10 || w > n + 10) continue;
      const _ = e?.boardBounds ? ir({ x_mm: o.x_mm, y_mm: o.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, o, e?.selectedId === o.id, e?.hoverId === o.id, _), t.ctx.beginPath(), t.ctx.arc(y, w, s, 0, Math.PI * 2), e?.selectedId === o.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, a, l, n) {
    if (a)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (l)
      t.fillStyle = "rgba(245, 158, 11, 0.8)", t.strokeStyle = "rgba(245, 158, 11, 1)";
    else if (n)
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
function xr(m, t) {
  const e = new dr(m);
  return {
    id: "markers",
    order: zt.MARKERS_MIN,
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
  Qe as Emitter,
  ut as GerberError,
  Je as MarkerPicker,
  dr as MarkerRenderer,
  Ke as MarkerStore,
  qe as OverlayRegistry,
  Ve as RenderScheduler,
  lr as SelectionRenderer,
  He as UniformGridIndex,
  er as Viewer,
  Ge as ViewportTransform,
  tr as VisibilityManager,
  yr as createBoardViewer,
  mr as createGerberPass,
  vr as createGridOverlay,
  yr as createIntegratedViewer,
  xr as createMarkerPass,
  gr as createOverlayPass,
  wr as createPulsingMarkerOverlay,
  cr as createSelectionPass,
  br as createTooltipOverlay,
  _r as createViolationDotsOverlay,
  Se as detectGerberBundle,
  ur as renderGerbers,
  de as renderGerbersFiles,
  hr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
