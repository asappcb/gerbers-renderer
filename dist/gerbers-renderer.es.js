var le = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function $e(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
function ce(u) {
  throw new Error('Could not dynamically require "' + u + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var fe = { exports: {} };
var xe;
function De() {
  return xe || (xe = 1, (function(u, t) {
    (function(e) {
      u.exports = e();
    })(function() {
      return (function e(s, o, n) {
        function r(g, b) {
          if (!o[g]) {
            if (!s[g]) {
              var _ = typeof ce == "function" && ce;
              if (!b && _) return _(g, !0);
              if (a) return a(g, !0);
              var y = new Error("Cannot find module '" + g + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var f = o[g] = { exports: {} };
            s[g][0].call(f.exports, function(p) {
              var i = s[g][1][p];
              return r(i || p);
            }, f, f.exports, e, s, o, n);
          }
          return o[g].exports;
        }
        for (var a = typeof ce == "function" && ce, h = 0; h < n.length; h++) r(n[h]);
        return r;
      })({ 1: [function(e, s, o) {
        var n = e("./utils"), r = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        o.encode = function(h) {
          for (var g, b, _, y, f, p, i, m = [], d = 0, v = h.length, k = v, I = n.getTypeOf(h) !== "string"; d < h.length; ) k = v - d, _ = I ? (g = h[d++], b = d < v ? h[d++] : 0, d < v ? h[d++] : 0) : (g = h.charCodeAt(d++), b = d < v ? h.charCodeAt(d++) : 0, d < v ? h.charCodeAt(d++) : 0), y = g >> 2, f = (3 & g) << 4 | b >> 4, p = 1 < k ? (15 & b) << 2 | _ >> 6 : 64, i = 2 < k ? 63 & _ : 64, m.push(a.charAt(y) + a.charAt(f) + a.charAt(p) + a.charAt(i));
          return m.join("");
        }, o.decode = function(h) {
          var g, b, _, y, f, p, i = 0, m = 0, d = "data:";
          if (h.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var v, k = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === a.charAt(64) && k--, h.charAt(h.length - 2) === a.charAt(64) && k--, k % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (v = r.uint8array ? new Uint8Array(0 | k) : new Array(0 | k); i < h.length; ) g = a.indexOf(h.charAt(i++)) << 2 | (y = a.indexOf(h.charAt(i++))) >> 4, b = (15 & y) << 4 | (f = a.indexOf(h.charAt(i++))) >> 2, _ = (3 & f) << 6 | (p = a.indexOf(h.charAt(i++))), v[m++] = g, f !== 64 && (v[m++] = b), p !== 64 && (v[m++] = _);
          return v;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, s, o) {
        var n = e("./external"), r = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function g(b, _, y, f, p) {
          this.compressedSize = b, this.uncompressedSize = _, this.crc32 = y, this.compression = f, this.compressedContent = p;
        }
        g.prototype = { getContentWorker: function() {
          var b = new r(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), _ = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new r(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(b, _, y) {
          return b.pipe(new a()).pipe(new h("uncompressedSize")).pipe(_.compressWorker(y)).pipe(new h("compressedSize")).withStreamInfo("compression", _);
        }, s.exports = g;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, s, o) {
        var n = e("./stream/GenericWorker");
        o.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, o.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, s, o) {
        var n = e("./utils"), r = (function() {
          for (var a, h = [], g = 0; g < 256; g++) {
            a = g;
            for (var b = 0; b < 8; b++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            h[g] = a;
          }
          return h;
        })();
        s.exports = function(a, h) {
          return a !== void 0 && a.length ? n.getTypeOf(a) !== "string" ? (function(g, b, _, y) {
            var f = r, p = y + _;
            g ^= -1;
            for (var i = y; i < p; i++) g = g >>> 8 ^ f[255 & (g ^ b[i])];
            return -1 ^ g;
          })(0 | h, a, a.length, 0) : (function(g, b, _, y) {
            var f = r, p = y + _;
            g ^= -1;
            for (var i = y; i < p; i++) g = g >>> 8 ^ f[255 & (g ^ b.charCodeAt(i))];
            return -1 ^ g;
          })(0 | h, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, s, o) {
        o.base64 = !1, o.binary = !1, o.dir = !1, o.createFolders = !0, o.date = null, o.compression = null, o.compressionOptions = null, o.comment = null, o.unixPermissions = null, o.dosPermissions = null;
      }, {}], 6: [function(e, s, o) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), s.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, s, o) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", r = e("pako"), a = e("./utils"), h = e("./stream/GenericWorker"), g = n ? "uint8array" : "array";
        function b(_, y) {
          h.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = y, this.meta = {};
        }
        o.magic = "\b\0", a.inherits(b, h), b.prototype.processChunk = function(_) {
          this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(g, _.data), !1);
        }, b.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new r[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var _ = this;
          this._pako.onData = function(y) {
            _.push({ data: y, meta: _.meta });
          };
        }, o.compressWorker = function(_) {
          return new b("Deflate", _);
        }, o.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, s, o) {
        function n(f, p) {
          var i, m = "";
          for (i = 0; i < p; i++) m += String.fromCharCode(255 & f), f >>>= 8;
          return m;
        }
        function r(f, p, i, m, d, v) {
          var k, I, R = f.file, P = f.compression, O = v !== g.utf8encode, U = a.transformTo("string", v(R.name)), A = a.transformTo("string", g.utf8encode(R.name)), $ = R.comment, V = a.transformTo("string", v($)), S = a.transformTo("string", g.utf8encode($)), L = A.length !== R.name.length, c = S.length !== $.length, N = "", at = "", X = "", rt = R.dir, Y = R.date, it = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          p && !i || (it.crc32 = f.crc32, it.compressedSize = f.compressedSize, it.uncompressedSize = f.uncompressedSize);
          var B = 0;
          p && (B |= 8), O || !L && !c || (B |= 2048);
          var T = 0, st = 0;
          rt && (T |= 16), d === "UNIX" ? (st = 798, T |= (function(H, ft) {
            var wt = H;
            return H || (wt = ft ? 16893 : 33204), (65535 & wt) << 16;
          })(R.unixPermissions, rt)) : (st = 20, T |= (function(H) {
            return 63 & (H || 0);
          })(R.dosPermissions)), k = Y.getUTCHours(), k <<= 6, k |= Y.getUTCMinutes(), k <<= 5, k |= Y.getUTCSeconds() / 2, I = Y.getUTCFullYear() - 1980, I <<= 4, I |= Y.getUTCMonth() + 1, I <<= 5, I |= Y.getUTCDate(), L && (at = n(1, 1) + n(b(U), 4) + A, N += "up" + n(at.length, 2) + at), c && (X = n(1, 1) + n(b(V), 4) + S, N += "uc" + n(X.length, 2) + X);
          var Q = "";
          return Q += `
\0`, Q += n(B, 2), Q += P.magic, Q += n(k, 2), Q += n(I, 2), Q += n(it.crc32, 4), Q += n(it.compressedSize, 4), Q += n(it.uncompressedSize, 4), Q += n(U.length, 2), Q += n(N.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + Q + U + N, dirRecord: _.CENTRAL_FILE_HEADER + n(st, 2) + Q + n(V.length, 2) + "\0\0\0\0" + n(T, 4) + n(m, 4) + U + N + V };
        }
        var a = e("../utils"), h = e("../stream/GenericWorker"), g = e("../utf8"), b = e("../crc32"), _ = e("../signature");
        function y(f, p, i, m) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = p, this.zipPlatform = i, this.encodeFileName = m, this.streamFiles = f, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(y, h), y.prototype.push = function(f) {
          var p = f.meta.percent || 0, i = this.entriesCount, m = this._sources.length;
          this.accumulate ? this.contentBuffer.push(f) : (this.bytesWritten += f.data.length, h.prototype.push.call(this, { data: f.data, meta: { currentFile: this.currentFile, percent: i ? (p + 100 * (i - m - 1)) / i : 100 } }));
        }, y.prototype.openedSource = function(f) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = f.file.name;
          var p = this.streamFiles && !f.file.dir;
          if (p) {
            var i = r(f, p, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: i.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(f) {
          this.accumulate = !1;
          var p = this.streamFiles && !f.file.dir, i = r(f, p, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(i.dirRecord), p) this.push({ data: (function(m) {
            return _.DATA_DESCRIPTOR + n(m.crc32, 4) + n(m.compressedSize, 4) + n(m.uncompressedSize, 4);
          })(f), meta: { percent: 100 } });
          else for (this.push({ data: i.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var f = this.bytesWritten, p = 0; p < this.dirRecords.length; p++) this.push({ data: this.dirRecords[p], meta: { percent: 100 } });
          var i = this.bytesWritten - f, m = (function(d, v, k, I, R) {
            var P = a.transformTo("string", R(I));
            return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(d, 2) + n(d, 2) + n(v, 4) + n(k, 4) + n(P.length, 2) + P;
          })(this.dirRecords.length, i, f, this.zipComment, this.encodeFileName);
          this.push({ data: m, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(f) {
          this._sources.push(f);
          var p = this;
          return f.on("data", function(i) {
            p.processChunk(i);
          }), f.on("end", function() {
            p.closedSource(p.previous.streamInfo), p._sources.length ? p.prepareNextSource() : p.end();
          }), f.on("error", function(i) {
            p.error(i);
          }), this;
        }, y.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(f) {
          var p = this._sources;
          if (!h.prototype.error.call(this, f)) return !1;
          for (var i = 0; i < p.length; i++) try {
            p[i].error(f);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var f = this._sources, p = 0; p < f.length; p++) f[p].lock();
        }, s.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, s, o) {
        var n = e("../compressions"), r = e("./ZipFileWorker");
        o.generateWorker = function(a, h, g) {
          var b = new r(h.streamFiles, g, h.platform, h.encodeFileName), _ = 0;
          try {
            a.forEach(function(y, f) {
              _++;
              var p = (function(v, k) {
                var I = v || k, R = n[I];
                if (!R) throw new Error(I + " is not a valid compression method !");
                return R;
              })(f.options.compression, h.compression), i = f.options.compressionOptions || h.compressionOptions || {}, m = f.dir, d = f.date;
              f._compressWorker(p, i).withStreamInfo("file", { name: y, dir: m, date: d, comment: f.comment || "", unixPermissions: f.unixPermissions, dosPermissions: f.dosPermissions }).pipe(b);
            }), b.entriesCount = _;
          } catch (y) {
            b.error(y);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, s, o) {
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var r = new n();
            for (var a in this) typeof this[a] != "function" && (r[a] = this[a]);
            return r;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(r, a) {
          return new n().loadAsync(r, a);
        }, n.external = e("./external"), s.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, s, o) {
        var n = e("./utils"), r = e("./external"), a = e("./utf8"), h = e("./zipEntries"), g = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function _(y) {
          return new r.Promise(function(f, p) {
            var i = y.decompressed.getContentWorker().pipe(new g());
            i.on("error", function(m) {
              p(m);
            }).on("end", function() {
              i.streamInfo.crc32 !== y.decompressed.crc32 ? p(new Error("Corrupted zip : CRC32 mismatch")) : f();
            }).resume();
          });
        }
        s.exports = function(y, f) {
          var p = this;
          return f = n.extend(f || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), b.isNode && b.isStream(y) ? r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", y, !0, f.optimizedBinaryString, f.base64).then(function(i) {
            var m = new h(f);
            return m.load(i), m;
          }).then(function(i) {
            var m = [r.Promise.resolve(i)], d = i.files;
            if (f.checkCRC32) for (var v = 0; v < d.length; v++) m.push(_(d[v]));
            return r.Promise.all(m);
          }).then(function(i) {
            for (var m = i.shift(), d = m.files, v = 0; v < d.length; v++) {
              var k = d[v], I = k.fileNameStr, R = n.resolve(k.fileNameStr);
              p.file(R, k.decompressed, { binary: !0, optimizedBinaryString: !0, date: k.date, dir: k.dir, comment: k.fileCommentStr.length ? k.fileCommentStr : null, unixPermissions: k.unixPermissions, dosPermissions: k.dosPermissions, createFolders: f.createFolders }), k.dir || (p.file(R).unsafeOriginalName = I);
            }
            return m.zipComment.length && (p.comment = m.zipComment), p;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, s, o) {
        var n = e("../utils"), r = e("../stream/GenericWorker");
        function a(h, g) {
          r.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(g);
        }
        n.inherits(a, r), a.prototype._bindStream = function(h) {
          var g = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            g.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            g.isPaused ? this.generatedError = b : g.error(b);
          }).on("end", function() {
            g.isPaused ? g._upstreamEnded = !0 : g.end();
          });
        }, a.prototype.pause = function() {
          return !!r.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, a.prototype.resume = function() {
          return !!r.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, s.exports = a;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, s, o) {
        var n = e("readable-stream").Readable;
        function r(a, h, g) {
          n.call(this, h), this._helper = a;
          var b = this;
          a.on("data", function(_, y) {
            b.push(_) || b._helper.pause(), g && g(y);
          }).on("error", function(_) {
            b.emit("error", _);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(r, n), r.prototype._read = function() {
          this._helper.resume();
        }, s.exports = r;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, s, o) {
        s.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(n, r) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(n, r);
          if (typeof n == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(n, r);
        }, allocBuffer: function(n) {
          if (Buffer.alloc) return Buffer.alloc(n);
          var r = new Buffer(n);
          return r.fill(0), r;
        }, isBuffer: function(n) {
          return Buffer.isBuffer(n);
        }, isStream: function(n) {
          return n && typeof n.on == "function" && typeof n.pause == "function" && typeof n.resume == "function";
        } };
      }, {}], 15: [function(e, s, o) {
        function n(R, P, O) {
          var U, A = a.getTypeOf(P), $ = a.extend(O || {}, b);
          $.date = $.date || /* @__PURE__ */ new Date(), $.compression !== null && ($.compression = $.compression.toUpperCase()), typeof $.unixPermissions == "string" && ($.unixPermissions = parseInt($.unixPermissions, 8)), $.unixPermissions && 16384 & $.unixPermissions && ($.dir = !0), $.dosPermissions && 16 & $.dosPermissions && ($.dir = !0), $.dir && (R = d(R)), $.createFolders && (U = m(R)) && v.call(this, U, !0);
          var V = A === "string" && $.binary === !1 && $.base64 === !1;
          O && O.binary !== void 0 || ($.binary = !V), (P instanceof _ && P.uncompressedSize === 0 || $.dir || !P || P.length === 0) && ($.base64 = !1, $.binary = !0, P = "", $.compression = "STORE", A = "string");
          var S = null;
          S = P instanceof _ || P instanceof h ? P : p.isNode && p.isStream(P) ? new i(R, P) : a.prepareContent(R, P, $.binary, $.optimizedBinaryString, $.base64);
          var L = new y(R, S, $);
          this.files[R] = L;
        }
        var r = e("./utf8"), a = e("./utils"), h = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), b = e("./defaults"), _ = e("./compressedObject"), y = e("./zipObject"), f = e("./generate"), p = e("./nodejsUtils"), i = e("./nodejs/NodejsStreamInputAdapter"), m = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var P = R.lastIndexOf("/");
          return 0 < P ? R.substring(0, P) : "";
        }, d = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, v = function(R, P) {
          return P = P !== void 0 ? P : b.createFolders, R = d(R), this.files[R] || n.call(this, R, null, { dir: !0, createFolders: P }), this.files[R];
        };
        function k(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var I = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var P, O, U;
          for (P in this.files) U = this.files[P], (O = P.slice(this.root.length, P.length)) && P.slice(0, this.root.length) === this.root && R(O, U);
        }, filter: function(R) {
          var P = [];
          return this.forEach(function(O, U) {
            R(O, U) && P.push(U);
          }), P;
        }, file: function(R, P, O) {
          if (arguments.length !== 1) return R = this.root + R, n.call(this, R, P, O), this;
          if (k(R)) {
            var U = R;
            return this.filter(function($, V) {
              return !V.dir && U.test($);
            });
          }
          var A = this.files[this.root + R];
          return A && !A.dir ? A : null;
        }, folder: function(R) {
          if (!R) return this;
          if (k(R)) return this.filter(function(A, $) {
            return $.dir && R.test(A);
          });
          var P = this.root + R, O = v.call(this, P), U = this.clone();
          return U.root = O.name, U;
        }, remove: function(R) {
          R = this.root + R;
          var P = this.files[R];
          if (P || (R.slice(-1) !== "/" && (R += "/"), P = this.files[R]), P && !P.dir) delete this.files[R];
          else for (var O = this.filter(function(A, $) {
            return $.name.slice(0, R.length) === R;
          }), U = 0; U < O.length; U++) delete this.files[O[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var P, O = {};
          try {
            if ((O = a.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: r.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            a.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var U = O.comment || this.comment || "";
            P = f.generateWorker(this, O, U);
          } catch (A) {
            (P = new h("error")).error(A);
          }
          return new g(P, O.type || "string", O.mimeType);
        }, generateAsync: function(R, P) {
          return this.generateInternalStream(R).accumulate(P);
        }, generateNodeStream: function(R, P) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(P);
        } };
        s.exports = I;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, s, o) {
        s.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, s, o) {
        var n = e("./DataReader");
        function r(a) {
          n.call(this, a);
          for (var h = 0; h < this.data.length; h++) a[h] = 255 & a[h];
        }
        e("../utils").inherits(r, n), r.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, r.prototype.lastIndexOfSignature = function(a) {
          for (var h = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), _ = a.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === h && this.data[y + 1] === g && this.data[y + 2] === b && this.data[y + 3] === _) return y - this.zero;
          return -1;
        }, r.prototype.readAndCheckSignature = function(a) {
          var h = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), _ = a.charCodeAt(3), y = this.readData(4);
          return h === y[0] && g === y[1] && b === y[2] && _ === y[3];
        }, r.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, s.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, s, o) {
        var n = e("../utils");
        function r(a) {
          this.data = a, this.length = a.length, this.index = 0, this.zero = 0;
        }
        r.prototype = { checkOffset: function(a) {
          this.checkIndex(this.index + a);
        }, checkIndex: function(a) {
          if (this.length < this.zero + a || a < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?");
        }, setIndex: function(a) {
          this.checkIndex(a), this.index = a;
        }, skip: function(a) {
          this.setIndex(this.index + a);
        }, byteAt: function() {
        }, readInt: function(a) {
          var h, g = 0;
          for (this.checkOffset(a), h = this.index + a - 1; h >= this.index; h--) g = (g << 8) + this.byteAt(h);
          return this.index += a, g;
        }, readString: function(a) {
          return n.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, s.exports = r;
      }, { "../utils": 32 }], 19: [function(e, s, o) {
        var n = e("./Uint8ArrayReader");
        function r(a) {
          n.call(this, a);
        }
        e("../utils").inherits(r, n), r.prototype.readData = function(a) {
          this.checkOffset(a);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, s.exports = r;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, s, o) {
        var n = e("./DataReader");
        function r(a) {
          n.call(this, a);
        }
        e("../utils").inherits(r, n), r.prototype.byteAt = function(a) {
          return this.data.charCodeAt(this.zero + a);
        }, r.prototype.lastIndexOfSignature = function(a) {
          return this.data.lastIndexOf(a) - this.zero;
        }, r.prototype.readAndCheckSignature = function(a) {
          return a === this.readData(4);
        }, r.prototype.readData = function(a) {
          this.checkOffset(a);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, s.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, s, o) {
        var n = e("./ArrayReader");
        function r(a) {
          n.call(this, a);
        }
        e("../utils").inherits(r, n), r.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, s.exports = r;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, s, o) {
        var n = e("../utils"), r = e("../support"), a = e("./ArrayReader"), h = e("./StringReader"), g = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        s.exports = function(_) {
          var y = n.getTypeOf(_);
          return n.checkSupport(y), y !== "string" || r.uint8array ? y === "nodebuffer" ? new g(_) : r.uint8array ? new b(n.transformTo("uint8array", _)) : new a(n.transformTo("array", _)) : new h(_);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, s, o) {
        o.LOCAL_FILE_HEADER = "PK", o.CENTRAL_FILE_HEADER = "PK", o.CENTRAL_DIRECTORY_END = "PK", o.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", o.ZIP64_CENTRAL_DIRECTORY_END = "PK", o.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, s, o) {
        var n = e("./GenericWorker"), r = e("../utils");
        function a(h) {
          n.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        r.inherits(a, n), a.prototype.processChunk = function(h) {
          this.push({ data: r.transformTo(this.destType, h.data), meta: h.meta });
        }, s.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, s, o) {
        var n = e("./GenericWorker"), r = e("../crc32");
        function a() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, n), a.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = r(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, s.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, s, o) {
        var n = e("../utils"), r = e("./GenericWorker");
        function a(h) {
          r.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        n.inherits(a, r), a.prototype.processChunk = function(h) {
          if (h) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + h.data.length;
          }
          r.prototype.processChunk.call(this, h);
        }, s.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, s, o) {
        var n = e("../utils"), r = e("./GenericWorker");
        function a(h) {
          r.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            g.dataIsReady = !0, g.data = b, g.max = b && b.length || 0, g.type = n.getTypeOf(b), g.isPaused || g._tickAndRepeat();
          }, function(b) {
            g.error(b);
          });
        }
        n.inherits(a, r), a.prototype.cleanUp = function() {
          r.prototype.cleanUp.call(this), this.data = null;
        }, a.prototype.resume = function() {
          return !!r.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
        }, a.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, a.prototype._tick = function() {
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
        }, s.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, s, o) {
        function n(r) {
          this.name = r || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(r) {
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
        }, on: function(r, a) {
          return this._listeners[r].push(a), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(r, a) {
          if (this._listeners[r]) for (var h = 0; h < this._listeners[r].length; h++) this._listeners[r][h].call(this, a);
        }, pipe: function(r) {
          return r.registerPrevious(this);
        }, registerPrevious: function(r) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = r.streamInfo, this.mergeStreamInfo(), this.previous = r;
          var a = this;
          return r.on("data", function(h) {
            a.processChunk(h);
          }), r.on("end", function() {
            a.end();
          }), r.on("error", function(h) {
            a.error(h);
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
        }, withStreamInfo: function(r, a) {
          return this.extraStreamInfo[r] = a, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var r in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, r) && (this.streamInfo[r] = this.extraStreamInfo[r]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var r = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + r : r;
        } }, s.exports = n;
      }, {}], 29: [function(e, s, o) {
        var n = e("../utils"), r = e("./ConvertWorker"), a = e("./GenericWorker"), h = e("../base64"), g = e("../support"), b = e("../external"), _ = null;
        if (g.nodestream) try {
          _ = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(p, i) {
          return new b.Promise(function(m, d) {
            var v = [], k = p._internalType, I = p._outputType, R = p._mimeType;
            p.on("data", function(P, O) {
              v.push(P), i && i(O);
            }).on("error", function(P) {
              v = [], d(P);
            }).on("end", function() {
              try {
                var P = (function(O, U, A) {
                  switch (O) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", U), A);
                    case "base64":
                      return h.encode(U);
                    default:
                      return n.transformTo(O, U);
                  }
                })(I, (function(O, U) {
                  var A, $ = 0, V = null, S = 0;
                  for (A = 0; A < U.length; A++) S += U[A].length;
                  switch (O) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (V = new Uint8Array(S), A = 0; A < U.length; A++) V.set(U[A], $), $ += U[A].length;
                      return V;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(k, v), R);
                m(P);
              } catch (O) {
                d(O);
              }
              v = [];
            }).resume();
          });
        }
        function f(p, i, m) {
          var d = i;
          switch (i) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = i, this._mimeType = m, n.checkSupport(d), this._worker = p.pipe(new r(d)), p.lock();
          } catch (v) {
            this._worker = new a("error"), this._worker.error(v);
          }
        }
        f.prototype = { accumulate: function(p) {
          return y(this, p);
        }, on: function(p, i) {
          var m = this;
          return p === "data" ? this._worker.on(p, function(d) {
            i.call(m, d.data, d.meta);
          }) : this._worker.on(p, function() {
            n.delay(i, arguments, m);
          }), this;
        }, resume: function() {
          return n.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(p) {
          if (n.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new _(this, { objectMode: this._outputType !== "nodebuffer" }, p);
        } }, s.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, s, o) {
        if (o.base64 = !0, o.array = !0, o.string = !0, o.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", o.nodebuffer = typeof Buffer < "u", o.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") o.blob = !1;
        else {
          var n = new ArrayBuffer(0);
          try {
            o.blob = new Blob([n], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var r = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              r.append(n), o.blob = r.getBlob("application/zip").size === 0;
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
      }, { "readable-stream": 16 }], 31: [function(e, s, o) {
        for (var n = e("./utils"), r = e("./support"), a = e("./nodejsUtils"), h = e("./stream/GenericWorker"), g = new Array(256), b = 0; b < 256; b++) g[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        g[254] = g[254] = 1;
        function _() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          h.call(this, "utf-8 encode");
        }
        o.utf8encode = function(f) {
          return r.nodebuffer ? a.newBufferFrom(f, "utf-8") : (function(p) {
            var i, m, d, v, k, I = p.length, R = 0;
            for (v = 0; v < I; v++) (64512 & (m = p.charCodeAt(v))) == 55296 && v + 1 < I && (64512 & (d = p.charCodeAt(v + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (d - 56320), v++), R += m < 128 ? 1 : m < 2048 ? 2 : m < 65536 ? 3 : 4;
            for (i = r.uint8array ? new Uint8Array(R) : new Array(R), v = k = 0; k < R; v++) (64512 & (m = p.charCodeAt(v))) == 55296 && v + 1 < I && (64512 & (d = p.charCodeAt(v + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (d - 56320), v++), m < 128 ? i[k++] = m : (m < 2048 ? i[k++] = 192 | m >>> 6 : (m < 65536 ? i[k++] = 224 | m >>> 12 : (i[k++] = 240 | m >>> 18, i[k++] = 128 | m >>> 12 & 63), i[k++] = 128 | m >>> 6 & 63), i[k++] = 128 | 63 & m);
            return i;
          })(f);
        }, o.utf8decode = function(f) {
          return r.nodebuffer ? n.transformTo("nodebuffer", f).toString("utf-8") : (function(p) {
            var i, m, d, v, k = p.length, I = new Array(2 * k);
            for (i = m = 0; i < k; ) if ((d = p[i++]) < 128) I[m++] = d;
            else if (4 < (v = g[d])) I[m++] = 65533, i += v - 1;
            else {
              for (d &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && i < k; ) d = d << 6 | 63 & p[i++], v--;
              1 < v ? I[m++] = 65533 : d < 65536 ? I[m++] = d : (d -= 65536, I[m++] = 55296 | d >> 10 & 1023, I[m++] = 56320 | 1023 & d);
            }
            return I.length !== m && (I.subarray ? I = I.subarray(0, m) : I.length = m), n.applyFromCharCode(I);
          })(f = n.transformTo(r.uint8array ? "uint8array" : "array", f));
        }, n.inherits(_, h), _.prototype.processChunk = function(f) {
          var p = n.transformTo(r.uint8array ? "uint8array" : "array", f.data);
          if (this.leftOver && this.leftOver.length) {
            if (r.uint8array) {
              var i = p;
              (p = new Uint8Array(i.length + this.leftOver.length)).set(this.leftOver, 0), p.set(i, this.leftOver.length);
            } else p = this.leftOver.concat(p);
            this.leftOver = null;
          }
          var m = (function(v, k) {
            var I;
            for ((k = k || v.length) > v.length && (k = v.length), I = k - 1; 0 <= I && (192 & v[I]) == 128; ) I--;
            return I < 0 || I === 0 ? k : I + g[v[I]] > k ? I : k;
          })(p), d = p;
          m !== p.length && (r.uint8array ? (d = p.subarray(0, m), this.leftOver = p.subarray(m, p.length)) : (d = p.slice(0, m), this.leftOver = p.slice(m, p.length))), this.push({ data: o.utf8decode(d), meta: f.meta });
        }, _.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: o.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, o.Utf8DecodeWorker = _, n.inherits(y, h), y.prototype.processChunk = function(f) {
          this.push({ data: o.utf8encode(f.data), meta: f.meta });
        }, o.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, s, o) {
        var n = e("./support"), r = e("./base64"), a = e("./nodejsUtils"), h = e("./external");
        function g(i) {
          return i;
        }
        function b(i, m) {
          for (var d = 0; d < i.length; ++d) m[d] = 255 & i.charCodeAt(d);
          return m;
        }
        e("setimmediate"), o.newBlob = function(i, m) {
          o.checkSupport("blob");
          try {
            return new Blob([i], { type: m });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(i), d.getBlob(m);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var _ = { stringifyByChunk: function(i, m, d) {
          var v = [], k = 0, I = i.length;
          if (I <= d) return String.fromCharCode.apply(null, i);
          for (; k < I; ) m === "array" || m === "nodebuffer" ? v.push(String.fromCharCode.apply(null, i.slice(k, Math.min(k + d, I)))) : v.push(String.fromCharCode.apply(null, i.subarray(k, Math.min(k + d, I)))), k += d;
          return v.join("");
        }, stringifyByChar: function(i) {
          for (var m = "", d = 0; d < i.length; d++) m += String.fromCharCode(i[d]);
          return m;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return n.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return n.nodebuffer && String.fromCharCode.apply(null, a.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function y(i) {
          var m = 65536, d = o.getTypeOf(i), v = !0;
          if (d === "uint8array" ? v = _.applyCanBeUsed.uint8array : d === "nodebuffer" && (v = _.applyCanBeUsed.nodebuffer), v) for (; 1 < m; ) try {
            return _.stringifyByChunk(i, d, m);
          } catch {
            m = Math.floor(m / 2);
          }
          return _.stringifyByChar(i);
        }
        function f(i, m) {
          for (var d = 0; d < i.length; d++) m[d] = i[d];
          return m;
        }
        o.applyFromCharCode = y;
        var p = {};
        p.string = { string: g, array: function(i) {
          return b(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return p.string.uint8array(i).buffer;
        }, uint8array: function(i) {
          return b(i, new Uint8Array(i.length));
        }, nodebuffer: function(i) {
          return b(i, a.allocBuffer(i.length));
        } }, p.array = { string: y, array: g, arraybuffer: function(i) {
          return new Uint8Array(i).buffer;
        }, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return a.newBufferFrom(i);
        } }, p.arraybuffer = { string: function(i) {
          return y(new Uint8Array(i));
        }, array: function(i) {
          return f(new Uint8Array(i), new Array(i.byteLength));
        }, arraybuffer: g, uint8array: function(i) {
          return new Uint8Array(i);
        }, nodebuffer: function(i) {
          return a.newBufferFrom(new Uint8Array(i));
        } }, p.uint8array = { string: y, array: function(i) {
          return f(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return i.buffer;
        }, uint8array: g, nodebuffer: function(i) {
          return a.newBufferFrom(i);
        } }, p.nodebuffer = { string: y, array: function(i) {
          return f(i, new Array(i.length));
        }, arraybuffer: function(i) {
          return p.nodebuffer.uint8array(i).buffer;
        }, uint8array: function(i) {
          return f(i, new Uint8Array(i.length));
        }, nodebuffer: g }, o.transformTo = function(i, m) {
          if (m = m || "", !i) return m;
          o.checkSupport(i);
          var d = o.getTypeOf(m);
          return p[d][i](m);
        }, o.resolve = function(i) {
          for (var m = i.split("/"), d = [], v = 0; v < m.length; v++) {
            var k = m[v];
            k === "." || k === "" && v !== 0 && v !== m.length - 1 || (k === ".." ? d.pop() : d.push(k));
          }
          return d.join("/");
        }, o.getTypeOf = function(i) {
          return typeof i == "string" ? "string" : Object.prototype.toString.call(i) === "[object Array]" ? "array" : n.nodebuffer && a.isBuffer(i) ? "nodebuffer" : n.uint8array && i instanceof Uint8Array ? "uint8array" : n.arraybuffer && i instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, o.checkSupport = function(i) {
          if (!n[i.toLowerCase()]) throw new Error(i + " is not supported by this platform");
        }, o.MAX_VALUE_16BITS = 65535, o.MAX_VALUE_32BITS = -1, o.pretty = function(i) {
          var m, d, v = "";
          for (d = 0; d < (i || "").length; d++) v += "\\x" + ((m = i.charCodeAt(d)) < 16 ? "0" : "") + m.toString(16).toUpperCase();
          return v;
        }, o.delay = function(i, m, d) {
          setImmediate(function() {
            i.apply(d || null, m || []);
          });
        }, o.inherits = function(i, m) {
          function d() {
          }
          d.prototype = m.prototype, i.prototype = new d();
        }, o.extend = function() {
          var i, m, d = {};
          for (i = 0; i < arguments.length; i++) for (m in arguments[i]) Object.prototype.hasOwnProperty.call(arguments[i], m) && d[m] === void 0 && (d[m] = arguments[i][m]);
          return d;
        }, o.prepareContent = function(i, m, d, v, k) {
          return h.Promise.resolve(m).then(function(I) {
            return n.blob && (I instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(I)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(R, P) {
              var O = new FileReader();
              O.onload = function(U) {
                R(U.target.result);
              }, O.onerror = function(U) {
                P(U.target.error);
              }, O.readAsArrayBuffer(I);
            }) : I;
          }).then(function(I) {
            var R = o.getTypeOf(I);
            return R ? (R === "arraybuffer" ? I = o.transformTo("uint8array", I) : R === "string" && (k ? I = r.decode(I) : d && v !== !0 && (I = (function(P) {
              return b(P, n.uint8array ? new Uint8Array(P.length) : new Array(P.length));
            })(I))), I) : h.Promise.reject(new Error("Can't read the data of '" + i + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, s, o) {
        var n = e("./reader/readerFor"), r = e("./utils"), a = e("./signature"), h = e("./zipEntry"), g = e("./support");
        function b(_) {
          this.files = [], this.loadOptions = _;
        }
        b.prototype = { checkSignature: function(_) {
          if (!this.reader.readAndCheckSignature(_)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + r.pretty(y) + ", expected " + r.pretty(_) + ")");
          }
        }, isSignature: function(_, y) {
          var f = this.reader.index;
          this.reader.setIndex(_);
          var p = this.reader.readString(4) === y;
          return this.reader.setIndex(f), p;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var _ = this.reader.readData(this.zipCommentLength), y = g.uint8array ? "uint8array" : "array", f = r.transformTo(y, _);
          this.zipComment = this.loadOptions.decodeFileName(f);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var _, y, f, p = this.zip64EndOfCentralSize - 44; 0 < p; ) _ = this.reader.readInt(2), y = this.reader.readInt(4), f = this.reader.readData(y), this.zip64ExtensibleData[_] = { id: _, length: y, value: f };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var _, y;
          for (_ = 0; _ < this.files.length; _++) y = this.files[_], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var _;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (_ = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var _ = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
          if (_ < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(_);
          var y = _;
          if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === r.MAX_VALUE_16BITS || this.diskWithCentralDirStart === r.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === r.MAX_VALUE_16BITS || this.centralDirRecords === r.MAX_VALUE_16BITS || this.centralDirSize === r.MAX_VALUE_32BITS || this.centralDirOffset === r.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (_ = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(_), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var f = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (f += 20, f += 12 + this.zip64EndOfCentralSize);
          var p = y - f;
          if (0 < p) this.isSignature(y, a.CENTRAL_FILE_HEADER) || (this.reader.zero = p);
          else if (p < 0) throw new Error("Corrupted zip: missing " + Math.abs(p) + " bytes.");
        }, prepareReader: function(_) {
          this.reader = n(_);
        }, load: function(_) {
          this.prepareReader(_), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, s.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, s, o) {
        var n = e("./reader/readerFor"), r = e("./utils"), a = e("./compressedObject"), h = e("./crc32"), g = e("./utf8"), b = e("./compressions"), _ = e("./support");
        function y(f, p) {
          this.options = f, this.loadOptions = p;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(f) {
          var p, i;
          if (f.skip(22), this.fileNameLength = f.readInt(2), i = f.readInt(2), this.fileName = f.readData(this.fileNameLength), f.skip(i), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((p = (function(m) {
            for (var d in b) if (Object.prototype.hasOwnProperty.call(b, d) && b[d].magic === m) return b[d];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + r.pretty(this.compressionMethod) + " unknown (inner file : " + r.transformTo("string", this.fileName) + ")");
          this.decompressed = new a(this.compressedSize, this.uncompressedSize, this.crc32, p, f.readData(this.compressedSize));
        }, readCentralPart: function(f) {
          this.versionMadeBy = f.readInt(2), f.skip(2), this.bitFlag = f.readInt(2), this.compressionMethod = f.readString(2), this.date = f.readDate(), this.crc32 = f.readInt(4), this.compressedSize = f.readInt(4), this.uncompressedSize = f.readInt(4);
          var p = f.readInt(2);
          if (this.extraFieldsLength = f.readInt(2), this.fileCommentLength = f.readInt(2), this.diskNumberStart = f.readInt(2), this.internalFileAttributes = f.readInt(2), this.externalFileAttributes = f.readInt(4), this.localHeaderOffset = f.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          f.skip(p), this.readExtraFields(f), this.parseZIP64ExtraField(f), this.fileComment = f.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var f = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), f == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), f == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var f = n(this.extraFields[1].value);
            this.uncompressedSize === r.MAX_VALUE_32BITS && (this.uncompressedSize = f.readInt(8)), this.compressedSize === r.MAX_VALUE_32BITS && (this.compressedSize = f.readInt(8)), this.localHeaderOffset === r.MAX_VALUE_32BITS && (this.localHeaderOffset = f.readInt(8)), this.diskNumberStart === r.MAX_VALUE_32BITS && (this.diskNumberStart = f.readInt(4));
          }
        }, readExtraFields: function(f) {
          var p, i, m, d = f.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); f.index + 4 < d; ) p = f.readInt(2), i = f.readInt(2), m = f.readData(i), this.extraFields[p] = { id: p, length: i, value: m };
          f.setIndex(d);
        }, handleUTF8: function() {
          var f = _.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
          else {
            var p = this.findExtraFieldUnicodePath();
            if (p !== null) this.fileNameStr = p;
            else {
              var i = r.transformTo(f, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(i);
            }
            var m = this.findExtraFieldUnicodeComment();
            if (m !== null) this.fileCommentStr = m;
            else {
              var d = r.transformTo(f, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var f = this.extraFields[28789];
          if (f) {
            var p = n(f.value);
            return p.readInt(1) !== 1 || h(this.fileName) !== p.readInt(4) ? null : g.utf8decode(p.readData(f.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var f = this.extraFields[25461];
          if (f) {
            var p = n(f.value);
            return p.readInt(1) !== 1 || h(this.fileComment) !== p.readInt(4) ? null : g.utf8decode(p.readData(f.length - 5));
          }
          return null;
        } }, s.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, s, o) {
        function n(p, i, m) {
          this.name = p, this.dir = m.dir, this.date = m.date, this.comment = m.comment, this.unixPermissions = m.unixPermissions, this.dosPermissions = m.dosPermissions, this._data = i, this._dataBinary = m.binary, this.options = { compression: m.compression, compressionOptions: m.compressionOptions };
        }
        var r = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), h = e("./utf8"), g = e("./compressedObject"), b = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(p) {
          var i = null, m = "string";
          try {
            if (!p) throw new Error("No output type specified.");
            var d = (m = p.toLowerCase()) === "string" || m === "text";
            m !== "binarystring" && m !== "text" || (m = "string"), i = this._decompressWorker();
            var v = !this._dataBinary;
            v && !d && (i = i.pipe(new h.Utf8EncodeWorker())), !v && d && (i = i.pipe(new h.Utf8DecodeWorker()));
          } catch (k) {
            (i = new b("error")).error(k);
          }
          return new r(i, m, "");
        }, async: function(p, i) {
          return this.internalStream(p).accumulate(i);
        }, nodeStream: function(p, i) {
          return this.internalStream(p || "nodebuffer").toNodejsStream(i);
        }, _compressWorker: function(p, i) {
          if (this._data instanceof g && this._data.compression.magic === p.magic) return this._data.getCompressedWorker();
          var m = this._decompressWorker();
          return this._dataBinary || (m = m.pipe(new h.Utf8EncodeWorker())), g.createWorkerFrom(m, p, i);
        }, _decompressWorker: function() {
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof b ? this._data : new a(this._data);
        } };
        for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < _.length; f++) n.prototype[_[f]] = y;
        s.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, s, o) {
        (function(n) {
          var r, a, h = n.MutationObserver || n.WebKitMutationObserver;
          if (h) {
            var g = 0, b = new h(p), _ = n.document.createTextNode("");
            b.observe(_, { characterData: !0 }), r = function() {
              _.data = g = ++g % 2;
            };
          } else if (n.setImmediate || n.MessageChannel === void 0) r = "document" in n && "onreadystatechange" in n.document.createElement("script") ? function() {
            var i = n.document.createElement("script");
            i.onreadystatechange = function() {
              p(), i.onreadystatechange = null, i.parentNode.removeChild(i), i = null;
            }, n.document.documentElement.appendChild(i);
          } : function() {
            setTimeout(p, 0);
          };
          else {
            var y = new n.MessageChannel();
            y.port1.onmessage = p, r = function() {
              y.port2.postMessage(0);
            };
          }
          var f = [];
          function p() {
            var i, m;
            a = !0;
            for (var d = f.length; d; ) {
              for (m = f, f = [], i = -1; ++i < d; ) m[i]();
              d = f.length;
            }
            a = !1;
          }
          s.exports = function(i) {
            f.push(i) !== 1 || a || r();
          };
        }).call(this, typeof le < "u" ? le : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, s, o) {
        var n = e("immediate");
        function r() {
        }
        var a = {}, h = ["REJECTED"], g = ["FULFILLED"], b = ["PENDING"];
        function _(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== r && i(this, d);
        }
        function y(d, v, k) {
          this.promise = d, typeof v == "function" && (this.onFulfilled = v, this.callFulfilled = this.otherCallFulfilled), typeof k == "function" && (this.onRejected = k, this.callRejected = this.otherCallRejected);
        }
        function f(d, v, k) {
          n(function() {
            var I;
            try {
              I = v(k);
            } catch (R) {
              return a.reject(d, R);
            }
            I === d ? a.reject(d, new TypeError("Cannot resolve promise with itself")) : a.resolve(d, I);
          });
        }
        function p(d) {
          var v = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof v == "function") return function() {
            v.apply(d, arguments);
          };
        }
        function i(d, v) {
          var k = !1;
          function I(O) {
            k || (k = !0, a.reject(d, O));
          }
          function R(O) {
            k || (k = !0, a.resolve(d, O));
          }
          var P = m(function() {
            v(R, I);
          });
          P.status === "error" && I(P.value);
        }
        function m(d, v) {
          var k = {};
          try {
            k.value = d(v), k.status = "success";
          } catch (I) {
            k.status = "error", k.value = I;
          }
          return k;
        }
        (s.exports = _).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var v = this.constructor;
          return this.then(function(k) {
            return v.resolve(d()).then(function() {
              return k;
            });
          }, function(k) {
            return v.resolve(d()).then(function() {
              throw k;
            });
          });
        }, _.prototype.catch = function(d) {
          return this.then(null, d);
        }, _.prototype.then = function(d, v) {
          if (typeof d != "function" && this.state === g || typeof v != "function" && this.state === h) return this;
          var k = new this.constructor(r);
          return this.state !== b ? f(k, this.state === g ? d : v, this.outcome) : this.queue.push(new y(k, d, v)), k;
        }, y.prototype.callFulfilled = function(d) {
          a.resolve(this.promise, d);
        }, y.prototype.otherCallFulfilled = function(d) {
          f(this.promise, this.onFulfilled, d);
        }, y.prototype.callRejected = function(d) {
          a.reject(this.promise, d);
        }, y.prototype.otherCallRejected = function(d) {
          f(this.promise, this.onRejected, d);
        }, a.resolve = function(d, v) {
          var k = m(p, v);
          if (k.status === "error") return a.reject(d, k.value);
          var I = k.value;
          if (I) i(d, I);
          else {
            d.state = g, d.outcome = v;
            for (var R = -1, P = d.queue.length; ++R < P; ) d.queue[R].callFulfilled(v);
          }
          return d;
        }, a.reject = function(d, v) {
          d.state = h, d.outcome = v;
          for (var k = -1, I = d.queue.length; ++k < I; ) d.queue[k].callRejected(v);
          return d;
        }, _.resolve = function(d) {
          return d instanceof this ? d : a.resolve(new this(r), d);
        }, _.reject = function(d) {
          var v = new this(r);
          return a.reject(v, d);
        }, _.all = function(d) {
          var v = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = d.length, I = !1;
          if (!k) return this.resolve([]);
          for (var R = new Array(k), P = 0, O = -1, U = new this(r); ++O < k; ) A(d[O], O);
          return U;
          function A($, V) {
            v.resolve($).then(function(S) {
              R[V] = S, ++P !== k || I || (I = !0, a.resolve(U, R));
            }, function(S) {
              I || (I = !0, a.reject(U, S));
            });
          }
        }, _.race = function(d) {
          var v = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = d.length, I = !1;
          if (!k) return this.resolve([]);
          for (var R = -1, P = new this(r); ++R < k; ) O = d[R], v.resolve(O).then(function(U) {
            I || (I = !0, a.resolve(P, U));
          }, function(U) {
            I || (I = !0, a.reject(P, U));
          });
          var O;
          return P;
        };
      }, { immediate: 36 }], 38: [function(e, s, o) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), s.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, s, o) {
        var n = e("./zlib/deflate"), r = e("./utils/common"), a = e("./utils/strings"), h = e("./zlib/messages"), g = e("./zlib/zstream"), b = Object.prototype.toString, _ = 0, y = -1, f = 0, p = 8;
        function i(d) {
          if (!(this instanceof i)) return new i(d);
          this.options = r.assign({ level: y, method: p, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: f, to: "" }, d || {});
          var v = this.options;
          v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var k = n.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
          if (k !== _) throw new Error(h[k]);
          if (v.header && n.deflateSetHeader(this.strm, v.header), v.dictionary) {
            var I;
            if (I = typeof v.dictionary == "string" ? a.string2buf(v.dictionary) : b.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (k = n.deflateSetDictionary(this.strm, I)) !== _) throw new Error(h[k]);
            this._dict_set = !0;
          }
        }
        function m(d, v) {
          var k = new i(v);
          if (k.push(d, !0), k.err) throw k.msg || h[k.err];
          return k.result;
        }
        i.prototype.push = function(d, v) {
          var k, I, R = this.strm, P = this.options.chunkSize;
          if (this.ended) return !1;
          I = v === ~~v ? v : v === !0 ? 4 : 0, typeof d == "string" ? R.input = a.string2buf(d) : b.call(d) === "[object ArrayBuffer]" ? R.input = new Uint8Array(d) : R.input = d, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new r.Buf8(P), R.next_out = 0, R.avail_out = P), (k = n.deflate(R, I)) !== 1 && k !== _) return this.onEnd(k), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || I !== 4 && I !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(r.shrinkBuf(R.output, R.next_out))) : this.onData(r.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && k !== 1);
          return I === 4 ? (k = n.deflateEnd(this.strm), this.onEnd(k), this.ended = !0, k === _) : I !== 2 || (this.onEnd(_), !(R.avail_out = 0));
        }, i.prototype.onData = function(d) {
          this.chunks.push(d);
        }, i.prototype.onEnd = function(d) {
          d === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, o.Deflate = i, o.deflate = m, o.deflateRaw = function(d, v) {
          return (v = v || {}).raw = !0, m(d, v);
        }, o.gzip = function(d, v) {
          return (v = v || {}).gzip = !0, m(d, v);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, s, o) {
        var n = e("./zlib/inflate"), r = e("./utils/common"), a = e("./utils/strings"), h = e("./zlib/constants"), g = e("./zlib/messages"), b = e("./zlib/zstream"), _ = e("./zlib/gzheader"), y = Object.prototype.toString;
        function f(i) {
          if (!(this instanceof f)) return new f(i);
          this.options = r.assign({ chunkSize: 16384, windowBits: 0, to: "" }, i || {});
          var m = this.options;
          m.raw && 0 <= m.windowBits && m.windowBits < 16 && (m.windowBits = -m.windowBits, m.windowBits === 0 && (m.windowBits = -15)), !(0 <= m.windowBits && m.windowBits < 16) || i && i.windowBits || (m.windowBits += 32), 15 < m.windowBits && m.windowBits < 48 && (15 & m.windowBits) == 0 && (m.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var d = n.inflateInit2(this.strm, m.windowBits);
          if (d !== h.Z_OK) throw new Error(g[d]);
          this.header = new _(), n.inflateGetHeader(this.strm, this.header);
        }
        function p(i, m) {
          var d = new f(m);
          if (d.push(i, !0), d.err) throw d.msg || g[d.err];
          return d.result;
        }
        f.prototype.push = function(i, m) {
          var d, v, k, I, R, P, O = this.strm, U = this.options.chunkSize, A = this.options.dictionary, $ = !1;
          if (this.ended) return !1;
          v = m === ~~m ? m : m === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof i == "string" ? O.input = a.binstring2buf(i) : y.call(i) === "[object ArrayBuffer]" ? O.input = new Uint8Array(i) : O.input = i, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new r.Buf8(U), O.next_out = 0, O.avail_out = U), (d = n.inflate(O, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && A && (P = typeof A == "string" ? a.string2buf(A) : y.call(A) === "[object ArrayBuffer]" ? new Uint8Array(A) : A, d = n.inflateSetDictionary(this.strm, P)), d === h.Z_BUF_ERROR && $ === !0 && (d = h.Z_OK, $ = !1), d !== h.Z_STREAM_END && d !== h.Z_OK) return this.onEnd(d), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && d !== h.Z_STREAM_END && (O.avail_in !== 0 || v !== h.Z_FINISH && v !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (k = a.utf8border(O.output, O.next_out), I = O.next_out - k, R = a.buf2string(O.output, k), O.next_out = I, O.avail_out = U - I, I && r.arraySet(O.output, O.output, k, I, 0), this.onData(R)) : this.onData(r.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && ($ = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && d !== h.Z_STREAM_END);
          return d === h.Z_STREAM_END && (v = h.Z_FINISH), v === h.Z_FINISH ? (d = n.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === h.Z_OK) : v !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(O.avail_out = 0));
        }, f.prototype.onData = function(i) {
          this.chunks.push(i);
        }, f.prototype.onEnd = function(i) {
          i === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
        }, o.Inflate = f, o.inflate = p, o.inflateRaw = function(i, m) {
          return (m = m || {}).raw = !0, p(i, m);
        }, o.ungzip = p;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, s, o) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        o.assign = function(h) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var b = g.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var _ in b) b.hasOwnProperty(_) && (h[_] = b[_]);
            }
          }
          return h;
        }, o.shrinkBuf = function(h, g) {
          return h.length === g ? h : h.subarray ? h.subarray(0, g) : (h.length = g, h);
        };
        var r = { arraySet: function(h, g, b, _, y) {
          if (g.subarray && h.subarray) h.set(g.subarray(b, b + _), y);
          else for (var f = 0; f < _; f++) h[y + f] = g[b + f];
        }, flattenChunks: function(h) {
          var g, b, _, y, f, p;
          for (g = _ = 0, b = h.length; g < b; g++) _ += h[g].length;
          for (p = new Uint8Array(_), g = y = 0, b = h.length; g < b; g++) f = h[g], p.set(f, y), y += f.length;
          return p;
        } }, a = { arraySet: function(h, g, b, _, y) {
          for (var f = 0; f < _; f++) h[y + f] = g[b + f];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        o.setTyped = function(h) {
          h ? (o.Buf8 = Uint8Array, o.Buf16 = Uint16Array, o.Buf32 = Int32Array, o.assign(o, r)) : (o.Buf8 = Array, o.Buf16 = Array, o.Buf32 = Array, o.assign(o, a));
        }, o.setTyped(n);
      }, {}], 42: [function(e, s, o) {
        var n = e("./common"), r = !0, a = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          r = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          a = !1;
        }
        for (var h = new n.Buf8(256), g = 0; g < 256; g++) h[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function b(_, y) {
          if (y < 65537 && (_.subarray && a || !_.subarray && r)) return String.fromCharCode.apply(null, n.shrinkBuf(_, y));
          for (var f = "", p = 0; p < y; p++) f += String.fromCharCode(_[p]);
          return f;
        }
        h[254] = h[254] = 1, o.string2buf = function(_) {
          var y, f, p, i, m, d = _.length, v = 0;
          for (i = 0; i < d; i++) (64512 & (f = _.charCodeAt(i))) == 55296 && i + 1 < d && (64512 & (p = _.charCodeAt(i + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (p - 56320), i++), v += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
          for (y = new n.Buf8(v), i = m = 0; m < v; i++) (64512 & (f = _.charCodeAt(i))) == 55296 && i + 1 < d && (64512 & (p = _.charCodeAt(i + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (p - 56320), i++), f < 128 ? y[m++] = f : (f < 2048 ? y[m++] = 192 | f >>> 6 : (f < 65536 ? y[m++] = 224 | f >>> 12 : (y[m++] = 240 | f >>> 18, y[m++] = 128 | f >>> 12 & 63), y[m++] = 128 | f >>> 6 & 63), y[m++] = 128 | 63 & f);
          return y;
        }, o.buf2binstring = function(_) {
          return b(_, _.length);
        }, o.binstring2buf = function(_) {
          for (var y = new n.Buf8(_.length), f = 0, p = y.length; f < p; f++) y[f] = _.charCodeAt(f);
          return y;
        }, o.buf2string = function(_, y) {
          var f, p, i, m, d = y || _.length, v = new Array(2 * d);
          for (f = p = 0; f < d; ) if ((i = _[f++]) < 128) v[p++] = i;
          else if (4 < (m = h[i])) v[p++] = 65533, f += m - 1;
          else {
            for (i &= m === 2 ? 31 : m === 3 ? 15 : 7; 1 < m && f < d; ) i = i << 6 | 63 & _[f++], m--;
            1 < m ? v[p++] = 65533 : i < 65536 ? v[p++] = i : (i -= 65536, v[p++] = 55296 | i >> 10 & 1023, v[p++] = 56320 | 1023 & i);
          }
          return b(v, p);
        }, o.utf8border = function(_, y) {
          var f;
          for ((y = y || _.length) > _.length && (y = _.length), f = y - 1; 0 <= f && (192 & _[f]) == 128; ) f--;
          return f < 0 || f === 0 ? y : f + h[_[f]] > y ? f : y;
        };
      }, { "./common": 41 }], 43: [function(e, s, o) {
        s.exports = function(n, r, a, h) {
          for (var g = 65535 & n | 0, b = n >>> 16 & 65535 | 0, _ = 0; a !== 0; ) {
            for (a -= _ = 2e3 < a ? 2e3 : a; b = b + (g = g + r[h++] | 0) | 0, --_; ) ;
            g %= 65521, b %= 65521;
          }
          return g | b << 16 | 0;
        };
      }, {}], 44: [function(e, s, o) {
        s.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, s, o) {
        var n = (function() {
          for (var r, a = [], h = 0; h < 256; h++) {
            r = h;
            for (var g = 0; g < 8; g++) r = 1 & r ? 3988292384 ^ r >>> 1 : r >>> 1;
            a[h] = r;
          }
          return a;
        })();
        s.exports = function(r, a, h, g) {
          var b = n, _ = g + h;
          r ^= -1;
          for (var y = g; y < _; y++) r = r >>> 8 ^ b[255 & (r ^ a[y])];
          return -1 ^ r;
        };
      }, {}], 46: [function(e, s, o) {
        var n, r = e("../utils/common"), a = e("./trees"), h = e("./adler32"), g = e("./crc32"), b = e("./messages"), _ = 0, y = 4, f = 0, p = -2, i = -1, m = 4, d = 2, v = 8, k = 9, I = 286, R = 30, P = 19, O = 2 * I + 1, U = 15, A = 3, $ = 258, V = $ + A + 1, S = 42, L = 113, c = 1, N = 2, at = 3, X = 4;
        function rt(l, D) {
          return l.msg = b[D], D;
        }
        function Y(l) {
          return (l << 1) - (4 < l ? 9 : 0);
        }
        function it(l) {
          for (var D = l.length; 0 <= --D; ) l[D] = 0;
        }
        function B(l) {
          var D = l.state, F = D.pending;
          F > l.avail_out && (F = l.avail_out), F !== 0 && (r.arraySet(l.output, D.pending_buf, D.pending_out, F, l.next_out), l.next_out += F, D.pending_out += F, l.total_out += F, l.avail_out -= F, D.pending -= F, D.pending === 0 && (D.pending_out = 0));
        }
        function T(l, D) {
          a._tr_flush_block(l, 0 <= l.block_start ? l.block_start : -1, l.strstart - l.block_start, D), l.block_start = l.strstart, B(l.strm);
        }
        function st(l, D) {
          l.pending_buf[l.pending++] = D;
        }
        function Q(l, D) {
          l.pending_buf[l.pending++] = D >>> 8 & 255, l.pending_buf[l.pending++] = 255 & D;
        }
        function H(l, D) {
          var F, w, x = l.max_chain_length, E = l.strstart, j = l.prev_length, W = l.nice_match, C = l.strstart > l.w_size - V ? l.strstart - (l.w_size - V) : 0, G = l.window, tt = l.w_mask, q = l.prev, nt = l.strstart + $, ht = G[E + j - 1], dt = G[E + j];
          l.prev_length >= l.good_match && (x >>= 2), W > l.lookahead && (W = l.lookahead);
          do
            if (G[(F = D) + j] === dt && G[F + j - 1] === ht && G[F] === G[E] && G[++F] === G[E + 1]) {
              E += 2, F++;
              do
                ;
              while (G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && G[++E] === G[++F] && E < nt);
              if (w = $ - (nt - E), E = nt - $, j < w) {
                if (l.match_start = D, W <= (j = w)) break;
                ht = G[E + j - 1], dt = G[E + j];
              }
            }
          while ((D = q[D & tt]) > C && --x != 0);
          return j <= l.lookahead ? j : l.lookahead;
        }
        function ft(l) {
          var D, F, w, x, E, j, W, C, G, tt, q = l.w_size;
          do {
            if (x = l.window_size - l.lookahead - l.strstart, l.strstart >= q + (q - V)) {
              for (r.arraySet(l.window, l.window, q, q, 0), l.match_start -= q, l.strstart -= q, l.block_start -= q, D = F = l.hash_size; w = l.head[--D], l.head[D] = q <= w ? w - q : 0, --F; ) ;
              for (D = F = q; w = l.prev[--D], l.prev[D] = q <= w ? w - q : 0, --F; ) ;
              x += q;
            }
            if (l.strm.avail_in === 0) break;
            if (j = l.strm, W = l.window, C = l.strstart + l.lookahead, G = x, tt = void 0, tt = j.avail_in, G < tt && (tt = G), F = tt === 0 ? 0 : (j.avail_in -= tt, r.arraySet(W, j.input, j.next_in, tt, C), j.state.wrap === 1 ? j.adler = h(j.adler, W, tt, C) : j.state.wrap === 2 && (j.adler = g(j.adler, W, tt, C)), j.next_in += tt, j.total_in += tt, tt), l.lookahead += F, l.lookahead + l.insert >= A) for (E = l.strstart - l.insert, l.ins_h = l.window[E], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[E + 1]) & l.hash_mask; l.insert && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[E + A - 1]) & l.hash_mask, l.prev[E & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = E, E++, l.insert--, !(l.lookahead + l.insert < A)); ) ;
          } while (l.lookahead < V && l.strm.avail_in !== 0);
        }
        function wt(l, D) {
          for (var F, w; ; ) {
            if (l.lookahead < V) {
              if (ft(l), l.lookahead < V && D === _) return c;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= A && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + A - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), F !== 0 && l.strstart - F <= l.w_size - V && (l.match_length = H(l, F)), l.match_length >= A) if (w = a._tr_tally(l, l.strstart - l.match_start, l.match_length - A), l.lookahead -= l.match_length, l.match_length <= l.max_lazy_match && l.lookahead >= A) {
              for (l.match_length--; l.strstart++, l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + A - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart, --l.match_length != 0; ) ;
              l.strstart++;
            } else l.strstart += l.match_length, l.match_length = 0, l.ins_h = l.window[l.strstart], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + 1]) & l.hash_mask;
            else w = a._tr_tally(l, 0, l.window[l.strstart]), l.lookahead--, l.strstart++;
            if (w && (T(l, !1), l.strm.avail_out === 0)) return c;
          }
          return l.insert = l.strstart < A - 1 ? l.strstart : A - 1, D === y ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? c : N;
        }
        function ct(l, D) {
          for (var F, w, x; ; ) {
            if (l.lookahead < V) {
              if (ft(l), l.lookahead < V && D === _) return c;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= A && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + A - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), l.prev_length = l.match_length, l.prev_match = l.match_start, l.match_length = A - 1, F !== 0 && l.prev_length < l.max_lazy_match && l.strstart - F <= l.w_size - V && (l.match_length = H(l, F), l.match_length <= 5 && (l.strategy === 1 || l.match_length === A && 4096 < l.strstart - l.match_start) && (l.match_length = A - 1)), l.prev_length >= A && l.match_length <= l.prev_length) {
              for (x = l.strstart + l.lookahead - A, w = a._tr_tally(l, l.strstart - 1 - l.prev_match, l.prev_length - A), l.lookahead -= l.prev_length - 1, l.prev_length -= 2; ++l.strstart <= x && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + A - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), --l.prev_length != 0; ) ;
              if (l.match_available = 0, l.match_length = A - 1, l.strstart++, w && (T(l, !1), l.strm.avail_out === 0)) return c;
            } else if (l.match_available) {
              if ((w = a._tr_tally(l, 0, l.window[l.strstart - 1])) && T(l, !1), l.strstart++, l.lookahead--, l.strm.avail_out === 0) return c;
            } else l.match_available = 1, l.strstart++, l.lookahead--;
          }
          return l.match_available && (w = a._tr_tally(l, 0, l.window[l.strstart - 1]), l.match_available = 0), l.insert = l.strstart < A - 1 ? l.strstart : A - 1, D === y ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? c : N;
        }
        function ut(l, D, F, w, x) {
          this.good_length = l, this.max_lazy = D, this.nice_length = F, this.max_chain = w, this.func = x;
        }
        function bt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new r.Buf16(2 * O), this.dyn_dtree = new r.Buf16(2 * (2 * R + 1)), this.bl_tree = new r.Buf16(2 * (2 * P + 1)), it(this.dyn_ltree), it(this.dyn_dtree), it(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new r.Buf16(U + 1), this.heap = new r.Buf16(2 * I + 1), it(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new r.Buf16(2 * I + 1), it(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(l) {
          var D;
          return l && l.state ? (l.total_in = l.total_out = 0, l.data_type = d, (D = l.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? S : L, l.adler = D.wrap === 2 ? 0 : 1, D.last_flush = _, a._tr_init(D), f) : rt(l, p);
        }
        function Rt(l) {
          var D = pt(l);
          return D === f && (function(F) {
            F.window_size = 2 * F.w_size, it(F.head), F.max_lazy_match = n[F.level].max_lazy, F.good_match = n[F.level].good_length, F.nice_match = n[F.level].nice_length, F.max_chain_length = n[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = A - 1, F.match_available = 0, F.ins_h = 0;
          })(l.state), D;
        }
        function Et(l, D, F, w, x, E) {
          if (!l) return p;
          var j = 1;
          if (D === i && (D = 6), w < 0 ? (j = 0, w = -w) : 15 < w && (j = 2, w -= 16), x < 1 || k < x || F !== v || w < 8 || 15 < w || D < 0 || 9 < D || E < 0 || m < E) return rt(l, p);
          w === 8 && (w = 9);
          var W = new bt();
          return (l.state = W).strm = l, W.wrap = j, W.gzhead = null, W.w_bits = w, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = x + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + A - 1) / A), W.window = new r.Buf8(2 * W.w_size), W.head = new r.Buf16(W.hash_size), W.prev = new r.Buf16(W.w_size), W.lit_bufsize = 1 << x + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new r.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = D, W.strategy = E, W.method = F, Rt(l);
        }
        n = [new ut(0, 0, 0, 0, function(l, D) {
          var F = 65535;
          for (F > l.pending_buf_size - 5 && (F = l.pending_buf_size - 5); ; ) {
            if (l.lookahead <= 1) {
              if (ft(l), l.lookahead === 0 && D === _) return c;
              if (l.lookahead === 0) break;
            }
            l.strstart += l.lookahead, l.lookahead = 0;
            var w = l.block_start + F;
            if ((l.strstart === 0 || l.strstart >= w) && (l.lookahead = l.strstart - w, l.strstart = w, T(l, !1), l.strm.avail_out === 0) || l.strstart - l.block_start >= l.w_size - V && (T(l, !1), l.strm.avail_out === 0)) return c;
          }
          return l.insert = 0, D === y ? (T(l, !0), l.strm.avail_out === 0 ? at : X) : (l.strstart > l.block_start && (T(l, !1), l.strm.avail_out), c);
        }), new ut(4, 4, 8, 4, wt), new ut(4, 5, 16, 8, wt), new ut(4, 6, 32, 32, wt), new ut(4, 4, 16, 16, ct), new ut(8, 16, 32, 32, ct), new ut(8, 16, 128, 128, ct), new ut(8, 32, 128, 256, ct), new ut(32, 128, 258, 1024, ct), new ut(32, 258, 258, 4096, ct)], o.deflateInit = function(l, D) {
          return Et(l, D, v, 15, 8, 0);
        }, o.deflateInit2 = Et, o.deflateReset = Rt, o.deflateResetKeep = pt, o.deflateSetHeader = function(l, D) {
          return l && l.state ? l.state.wrap !== 2 ? p : (l.state.gzhead = D, f) : p;
        }, o.deflate = function(l, D) {
          var F, w, x, E;
          if (!l || !l.state || 5 < D || D < 0) return l ? rt(l, p) : p;
          if (w = l.state, !l.output || !l.input && l.avail_in !== 0 || w.status === 666 && D !== y) return rt(l, l.avail_out === 0 ? -5 : p);
          if (w.strm = l, F = w.last_flush, w.last_flush = D, w.status === S) if (w.wrap === 2) l.adler = 0, st(w, 31), st(w, 139), st(w, 8), w.gzhead ? (st(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), st(w, 255 & w.gzhead.time), st(w, w.gzhead.time >> 8 & 255), st(w, w.gzhead.time >> 16 & 255), st(w, w.gzhead.time >> 24 & 255), st(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), st(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (st(w, 255 & w.gzhead.extra.length), st(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (l.adler = g(l.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (st(w, 0), st(w, 0), st(w, 0), st(w, 0), st(w, 0), st(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), st(w, 3), w.status = L);
          else {
            var j = v + (w.w_bits - 8 << 4) << 8;
            j |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (j |= 32), j += 31 - j % 31, w.status = L, Q(w, j), w.strstart !== 0 && (Q(w, l.adler >>> 16), Q(w, 65535 & l.adler)), l.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (x = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), B(l), x = w.pending, w.pending !== w.pending_buf_size)); ) st(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            x = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), B(l), x = w.pending, w.pending === w.pending_buf_size)) {
                E = 1;
                break;
              }
              E = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, st(w, E);
            } while (E !== 0);
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), E === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            x = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), B(l), x = w.pending, w.pending === w.pending_buf_size)) {
                E = 1;
                break;
              }
              E = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, st(w, E);
            } while (E !== 0);
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), E === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && B(l), w.pending + 2 <= w.pending_buf_size && (st(w, 255 & l.adler), st(w, l.adler >> 8 & 255), l.adler = 0, w.status = L)) : w.status = L), w.pending !== 0) {
            if (B(l), l.avail_out === 0) return w.last_flush = -1, f;
          } else if (l.avail_in === 0 && Y(D) <= Y(F) && D !== y) return rt(l, -5);
          if (w.status === 666 && l.avail_in !== 0) return rt(l, -5);
          if (l.avail_in !== 0 || w.lookahead !== 0 || D !== _ && w.status !== 666) {
            var W = w.strategy === 2 ? (function(C, G) {
              for (var tt; ; ) {
                if (C.lookahead === 0 && (ft(C), C.lookahead === 0)) {
                  if (G === _) return c;
                  break;
                }
                if (C.match_length = 0, tt = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, tt && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === y ? (T(C, !0), C.strm.avail_out === 0 ? at : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : N;
            })(w, D) : w.strategy === 3 ? (function(C, G) {
              for (var tt, q, nt, ht, dt = C.window; ; ) {
                if (C.lookahead <= $) {
                  if (ft(C), C.lookahead <= $ && G === _) return c;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= A && 0 < C.strstart && (q = dt[nt = C.strstart - 1]) === dt[++nt] && q === dt[++nt] && q === dt[++nt]) {
                  ht = C.strstart + $;
                  do
                    ;
                  while (q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && q === dt[++nt] && nt < ht);
                  C.match_length = $ - (ht - nt), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= A ? (tt = a._tr_tally(C, 1, C.match_length - A), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (tt = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), tt && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === y ? (T(C, !0), C.strm.avail_out === 0 ? at : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : N;
            })(w, D) : n[w.level].func(w, D);
            if (W !== at && W !== X || (w.status = 666), W === c || W === at) return l.avail_out === 0 && (w.last_flush = -1), f;
            if (W === N && (D === 1 ? a._tr_align(w) : D !== 5 && (a._tr_stored_block(w, 0, 0, !1), D === 3 && (it(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), B(l), l.avail_out === 0)) return w.last_flush = -1, f;
          }
          return D !== y ? f : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (st(w, 255 & l.adler), st(w, l.adler >> 8 & 255), st(w, l.adler >> 16 & 255), st(w, l.adler >> 24 & 255), st(w, 255 & l.total_in), st(w, l.total_in >> 8 & 255), st(w, l.total_in >> 16 & 255), st(w, l.total_in >> 24 & 255)) : (Q(w, l.adler >>> 16), Q(w, 65535 & l.adler)), B(l), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? f : 1);
        }, o.deflateEnd = function(l) {
          var D;
          return l && l.state ? (D = l.state.status) !== S && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== L && D !== 666 ? rt(l, p) : (l.state = null, D === L ? rt(l, -3) : f) : p;
        }, o.deflateSetDictionary = function(l, D) {
          var F, w, x, E, j, W, C, G, tt = D.length;
          if (!l || !l.state || (E = (F = l.state).wrap) === 2 || E === 1 && F.status !== S || F.lookahead) return p;
          for (E === 1 && (l.adler = h(l.adler, D, tt, 0)), F.wrap = 0, tt >= F.w_size && (E === 0 && (it(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), G = new r.Buf8(F.w_size), r.arraySet(G, D, tt - F.w_size, F.w_size, 0), D = G, tt = F.w_size), j = l.avail_in, W = l.next_in, C = l.input, l.avail_in = tt, l.next_in = 0, l.input = D, ft(F); F.lookahead >= A; ) {
            for (w = F.strstart, x = F.lookahead - (A - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[w + A - 1]) & F.hash_mask, F.prev[w & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = w, w++, --x; ) ;
            F.strstart = w, F.lookahead = A - 1, ft(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = A - 1, F.match_available = 0, l.next_in = W, l.input = C, l.avail_in = j, F.wrap = E, f;
        }, o.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, s, o) {
        s.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, s, o) {
        s.exports = function(n, r) {
          var a, h, g, b, _, y, f, p, i, m, d, v, k, I, R, P, O, U, A, $, V, S, L, c, N;
          a = n.state, h = n.next_in, c = n.input, g = h + (n.avail_in - 5), b = n.next_out, N = n.output, _ = b - (r - n.avail_out), y = b + (n.avail_out - 257), f = a.dmax, p = a.wsize, i = a.whave, m = a.wnext, d = a.window, v = a.hold, k = a.bits, I = a.lencode, R = a.distcode, P = (1 << a.lenbits) - 1, O = (1 << a.distbits) - 1;
          t: do {
            k < 15 && (v += c[h++] << k, k += 8, v += c[h++] << k, k += 8), U = I[v & P];
            e: for (; ; ) {
              if (v >>>= A = U >>> 24, k -= A, (A = U >>> 16 & 255) === 0) N[b++] = 65535 & U;
              else {
                if (!(16 & A)) {
                  if ((64 & A) == 0) {
                    U = I[(65535 & U) + (v & (1 << A) - 1)];
                    continue e;
                  }
                  if (32 & A) {
                    a.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                $ = 65535 & U, (A &= 15) && (k < A && (v += c[h++] << k, k += 8), $ += v & (1 << A) - 1, v >>>= A, k -= A), k < 15 && (v += c[h++] << k, k += 8, v += c[h++] << k, k += 8), U = R[v & O];
                r: for (; ; ) {
                  if (v >>>= A = U >>> 24, k -= A, !(16 & (A = U >>> 16 & 255))) {
                    if ((64 & A) == 0) {
                      U = R[(65535 & U) + (v & (1 << A) - 1)];
                      continue r;
                    }
                    n.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (V = 65535 & U, k < (A &= 15) && (v += c[h++] << k, (k += 8) < A && (v += c[h++] << k, k += 8)), f < (V += v & (1 << A) - 1)) {
                    n.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (v >>>= A, k -= A, (A = b - _) < V) {
                    if (i < (A = V - A) && a.sane) {
                      n.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (L = d, (S = 0) === m) {
                      if (S += p - A, A < $) {
                        for ($ -= A; N[b++] = d[S++], --A; ) ;
                        S = b - V, L = N;
                      }
                    } else if (m < A) {
                      if (S += p + m - A, (A -= m) < $) {
                        for ($ -= A; N[b++] = d[S++], --A; ) ;
                        if (S = 0, m < $) {
                          for ($ -= A = m; N[b++] = d[S++], --A; ) ;
                          S = b - V, L = N;
                        }
                      }
                    } else if (S += m - A, A < $) {
                      for ($ -= A; N[b++] = d[S++], --A; ) ;
                      S = b - V, L = N;
                    }
                    for (; 2 < $; ) N[b++] = L[S++], N[b++] = L[S++], N[b++] = L[S++], $ -= 3;
                    $ && (N[b++] = L[S++], 1 < $ && (N[b++] = L[S++]));
                  } else {
                    for (S = b - V; N[b++] = N[S++], N[b++] = N[S++], N[b++] = N[S++], 2 < ($ -= 3); ) ;
                    $ && (N[b++] = N[S++], 1 < $ && (N[b++] = N[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < g && b < y);
          h -= $ = k >> 3, v &= (1 << (k -= $ << 3)) - 1, n.next_in = h, n.next_out = b, n.avail_in = h < g ? g - h + 5 : 5 - (h - g), n.avail_out = b < y ? y - b + 257 : 257 - (b - y), a.hold = v, a.bits = k;
        };
      }, {}], 49: [function(e, s, o) {
        var n = e("../utils/common"), r = e("./adler32"), a = e("./crc32"), h = e("./inffast"), g = e("./inftrees"), b = 1, _ = 2, y = 0, f = -2, p = 1, i = 852, m = 592;
        function d(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function v() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function k(S) {
          var L;
          return S && S.state ? (L = S.state, S.total_in = S.total_out = L.total = 0, S.msg = "", L.wrap && (S.adler = 1 & L.wrap), L.mode = p, L.last = 0, L.havedict = 0, L.dmax = 32768, L.head = null, L.hold = 0, L.bits = 0, L.lencode = L.lendyn = new n.Buf32(i), L.distcode = L.distdyn = new n.Buf32(m), L.sane = 1, L.back = -1, y) : f;
        }
        function I(S) {
          var L;
          return S && S.state ? ((L = S.state).wsize = 0, L.whave = 0, L.wnext = 0, k(S)) : f;
        }
        function R(S, L) {
          var c, N;
          return S && S.state ? (N = S.state, L < 0 ? (c = 0, L = -L) : (c = 1 + (L >> 4), L < 48 && (L &= 15)), L && (L < 8 || 15 < L) ? f : (N.window !== null && N.wbits !== L && (N.window = null), N.wrap = c, N.wbits = L, I(S))) : f;
        }
        function P(S, L) {
          var c, N;
          return S ? (N = new v(), (S.state = N).window = null, (c = R(S, L)) !== y && (S.state = null), c) : f;
        }
        var O, U, A = !0;
        function $(S) {
          if (A) {
            var L;
            for (O = new n.Buf32(512), U = new n.Buf32(32), L = 0; L < 144; ) S.lens[L++] = 8;
            for (; L < 256; ) S.lens[L++] = 9;
            for (; L < 280; ) S.lens[L++] = 7;
            for (; L < 288; ) S.lens[L++] = 8;
            for (g(b, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), L = 0; L < 32; ) S.lens[L++] = 5;
            g(_, S.lens, 0, 32, U, 0, S.work, { bits: 5 }), A = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = U, S.distbits = 5;
        }
        function V(S, L, c, N) {
          var at, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new n.Buf8(X.wsize)), N >= X.wsize ? (n.arraySet(X.window, L, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (N < (at = X.wsize - X.wnext) && (at = N), n.arraySet(X.window, L, c - N, at, X.wnext), (N -= at) ? (n.arraySet(X.window, L, c - N, N, 0), X.wnext = N, X.whave = X.wsize) : (X.wnext += at, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += at))), 0;
        }
        o.inflateReset = I, o.inflateReset2 = R, o.inflateResetKeep = k, o.inflateInit = function(S) {
          return P(S, 15);
        }, o.inflateInit2 = P, o.inflate = function(S, L) {
          var c, N, at, X, rt, Y, it, B, T, st, Q, H, ft, wt, ct, ut, bt, pt, Rt, Et, l, D, F, w, x = 0, E = new n.Buf8(4), j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return f;
          (c = S.state).mode === 12 && (c.mode = 13), rt = S.next_out, at = S.output, it = S.avail_out, X = S.next_in, N = S.input, Y = S.avail_in, B = c.hold, T = c.bits, st = Y, Q = it, D = y;
          t: for (; ; ) switch (c.mode) {
            case p:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if (2 & c.wrap && B === 35615) {
                E[c.check = 0] = 255 & B, E[1] = B >>> 8 & 255, c.check = a(c.check, E, 2, 0), T = B = 0, c.mode = 2;
                break;
              }
              if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & B) << 8) + (B >> 8)) % 31) {
                S.msg = "incorrect header check", c.mode = 30;
                break;
              }
              if ((15 & B) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (T -= 4, l = 8 + (15 & (B >>>= 4)), c.wbits === 0) c.wbits = l;
              else if (l > c.wbits) {
                S.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << l, S.adler = c.check = 1, c.mode = 512 & B ? 10 : 12, T = B = 0;
              break;
            case 2:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if (c.flags = B, (255 & c.flags) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                S.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = B >> 8 & 1), 512 & c.flags && (E[0] = 255 & B, E[1] = B >>> 8 & 255, c.check = a(c.check, E, 2, 0)), T = B = 0, c.mode = 3;
            case 3:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              c.head && (c.head.time = B), 512 & c.flags && (E[0] = 255 & B, E[1] = B >>> 8 & 255, E[2] = B >>> 16 & 255, E[3] = B >>> 24 & 255, c.check = a(c.check, E, 4, 0)), T = B = 0, c.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              c.head && (c.head.xflags = 255 & B, c.head.os = B >> 8), 512 & c.flags && (E[0] = 255 & B, E[1] = B >>> 8 & 255, c.check = a(c.check, E, 2, 0)), T = B = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                c.length = B, c.head && (c.head.extra_len = B), 512 & c.flags && (E[0] = 255 & B, E[1] = B >>> 8 & 255, c.check = a(c.check, E, 2, 0)), T = B = 0;
              } else c.head && (c.head.extra = null);
              c.mode = 6;
            case 6:
              if (1024 & c.flags && (Y < (H = c.length) && (H = Y), H && (c.head && (l = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), n.arraySet(c.head.extra, N, X, H, l)), 512 & c.flags && (c.check = a(c.check, N, H, X)), Y -= H, X += H, c.length -= H), c.length)) break t;
              c.length = 0, c.mode = 7;
            case 7:
              if (2048 & c.flags) {
                if (Y === 0) break t;
                for (H = 0; l = N[X + H++], c.head && l && c.length < 65536 && (c.head.name += String.fromCharCode(l)), l && H < Y; ) ;
                if (512 & c.flags && (c.check = a(c.check, N, H, X)), Y -= H, X += H, l) break t;
              } else c.head && (c.head.name = null);
              c.length = 0, c.mode = 8;
            case 8:
              if (4096 & c.flags) {
                if (Y === 0) break t;
                for (H = 0; l = N[X + H++], c.head && l && c.length < 65536 && (c.head.comment += String.fromCharCode(l)), l && H < Y; ) ;
                if (512 & c.flags && (c.check = a(c.check, N, H, X)), Y -= H, X += H, l) break t;
              } else c.head && (c.head.comment = null);
              c.mode = 9;
            case 9:
              if (512 & c.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                if (B !== (65535 & c.check)) {
                  S.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                T = B = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), S.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              S.adler = c.check = d(B), T = B = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return S.next_out = rt, S.avail_out = it, S.next_in = X, S.avail_in = Y, c.hold = B, c.bits = T, 2;
              S.adler = c.check = 1, c.mode = 12;
            case 12:
              if (L === 5 || L === 6) break t;
            case 13:
              if (c.last) {
                B >>>= 7 & T, T -= 7 & T, c.mode = 27;
                break;
              }
              for (; T < 3; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              switch (c.last = 1 & B, T -= 1, 3 & (B >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if ($(c), c.mode = 20, L !== 6) break;
                  B >>>= 2, T -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", c.mode = 30;
              }
              B >>>= 2, T -= 2;
              break;
            case 14:
              for (B >>>= 7 & T, T -= 7 & T; T < 32; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if ((65535 & B) != (B >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & B, T = B = 0, c.mode = 15, L === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (H = c.length) {
                if (Y < H && (H = Y), it < H && (H = it), H === 0) break t;
                n.arraySet(at, N, X, H, rt), Y -= H, X += H, it -= H, rt += H, c.length -= H;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if (c.nlen = 257 + (31 & B), B >>>= 5, T -= 5, c.ndist = 1 + (31 & B), B >>>= 5, T -= 5, c.ncode = 4 + (15 & B), B >>>= 4, T -= 4, 286 < c.nlen || 30 < c.ndist) {
                S.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; T < 3; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                c.lens[j[c.have++]] = 7 & B, B >>>= 3, T -= 3;
              }
              for (; c.have < 19; ) c.lens[j[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, F = { bits: c.lenbits }, D = g(0, c.lens, 0, 19, c.lencode, 0, c.work, F), c.lenbits = F.bits, D) {
                S.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; ut = (x = c.lencode[B & (1 << c.lenbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                if (bt < 16) B >>>= ct, T -= ct, c.lens[c.have++] = bt;
                else {
                  if (bt === 16) {
                    for (w = ct + 2; T < w; ) {
                      if (Y === 0) break t;
                      Y--, B += N[X++] << T, T += 8;
                    }
                    if (B >>>= ct, T -= ct, c.have === 0) {
                      S.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    l = c.lens[c.have - 1], H = 3 + (3 & B), B >>>= 2, T -= 2;
                  } else if (bt === 17) {
                    for (w = ct + 3; T < w; ) {
                      if (Y === 0) break t;
                      Y--, B += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 3 + (7 & (B >>>= ct)), B >>>= 3, T -= 3;
                  } else {
                    for (w = ct + 7; T < w; ) {
                      if (Y === 0) break t;
                      Y--, B += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 11 + (127 & (B >>>= ct)), B >>>= 7, T -= 7;
                  }
                  if (c.have + H > c.nlen + c.ndist) {
                    S.msg = "invalid bit length repeat", c.mode = 30;
                    break;
                  }
                  for (; H--; ) c.lens[c.have++] = l;
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
              if (c.distbits = 6, c.distcode = c.distdyn, F = { bits: c.distbits }, D = g(_, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, F), c.distbits = F.bits, D) {
                S.msg = "invalid distances set", c.mode = 30;
                break;
              }
              if (c.mode = 20, L === 6) break t;
            case 20:
              c.mode = 21;
            case 21:
              if (6 <= Y && 258 <= it) {
                S.next_out = rt, S.avail_out = it, S.next_in = X, S.avail_in = Y, c.hold = B, c.bits = T, h(S, Q), rt = S.next_out, at = S.output, it = S.avail_out, X = S.next_in, N = S.input, Y = S.avail_in, B = c.hold, T = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; ut = (x = c.lencode[B & (1 << c.lenbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if (ut && (240 & ut) == 0) {
                for (pt = ct, Rt = ut, Et = bt; ut = (x = c.lencode[Et + ((B & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & x, !(pt + (ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                B >>>= pt, T -= pt, c.back += pt;
              }
              if (B >>>= ct, T -= ct, c.back += ct, c.length = bt, ut === 0) {
                c.mode = 26;
                break;
              }
              if (32 & ut) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & ut) {
                S.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & ut, c.mode = 22;
            case 22:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                c.length += B & (1 << c.extra) - 1, B >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; ut = (x = c.distcode[B & (1 << c.distbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, B += N[X++] << T, T += 8;
              }
              if ((240 & ut) == 0) {
                for (pt = ct, Rt = ut, Et = bt; ut = (x = c.distcode[Et + ((B & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & x, !(pt + (ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                B >>>= pt, T -= pt, c.back += pt;
              }
              if (B >>>= ct, T -= ct, c.back += ct, 64 & ut) {
                S.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = bt, c.extra = 15 & ut, c.mode = 24;
            case 24:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                c.offset += B & (1 << c.extra) - 1, B >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                S.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (it === 0) break t;
              if (H = Q - it, c.offset > H) {
                if ((H = c.offset - H) > c.whave && c.sane) {
                  S.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                ft = H > c.wnext ? (H -= c.wnext, c.wsize - H) : c.wnext - H, H > c.length && (H = c.length), wt = c.window;
              } else wt = at, ft = rt - c.offset, H = c.length;
              for (it < H && (H = it), it -= H, c.length -= H; at[rt++] = wt[ft++], --H; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (it === 0) break t;
              at[rt++] = c.length, it--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, B |= N[X++] << T, T += 8;
                }
                if (Q -= it, S.total_out += Q, c.total += Q, Q && (S.adler = c.check = c.flags ? a(c.check, at, Q, rt - Q) : r(c.check, at, Q, rt - Q)), Q = it, (c.flags ? B : d(B)) !== c.check) {
                  S.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                T = B = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, B += N[X++] << T, T += 8;
                }
                if (B !== (4294967295 & c.total)) {
                  S.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                T = B = 0;
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
              return f;
          }
          return S.next_out = rt, S.avail_out = it, S.next_in = X, S.avail_in = Y, c.hold = B, c.bits = T, (c.wsize || Q !== S.avail_out && c.mode < 30 && (c.mode < 27 || L !== 4)) && V(S, S.output, S.next_out, Q - S.avail_out) ? (c.mode = 31, -4) : (st -= S.avail_in, Q -= S.avail_out, S.total_in += st, S.total_out += Q, c.total += Q, c.wrap && Q && (S.adler = c.check = c.flags ? a(c.check, at, Q, S.next_out - Q) : r(c.check, at, Q, S.next_out - Q)), S.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (st == 0 && Q === 0 || L === 4) && D === y && (D = -5), D);
        }, o.inflateEnd = function(S) {
          if (!S || !S.state) return f;
          var L = S.state;
          return L.window && (L.window = null), S.state = null, y;
        }, o.inflateGetHeader = function(S, L) {
          var c;
          return S && S.state ? (2 & (c = S.state).wrap) == 0 ? f : ((c.head = L).done = !1, y) : f;
        }, o.inflateSetDictionary = function(S, L) {
          var c, N = L.length;
          return S && S.state ? (c = S.state).wrap !== 0 && c.mode !== 11 ? f : c.mode === 11 && r(1, L, N, 0) !== c.check ? -3 : V(S, L, N, N) ? (c.mode = 31, -4) : (c.havedict = 1, y) : f;
        }, o.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, s, o) {
        var n = e("../utils/common"), r = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        s.exports = function(b, _, y, f, p, i, m, d) {
          var v, k, I, R, P, O, U, A, $, V = d.bits, S = 0, L = 0, c = 0, N = 0, at = 0, X = 0, rt = 0, Y = 0, it = 0, B = 0, T = null, st = 0, Q = new n.Buf16(16), H = new n.Buf16(16), ft = null, wt = 0;
          for (S = 0; S <= 15; S++) Q[S] = 0;
          for (L = 0; L < f; L++) Q[_[y + L]]++;
          for (at = V, N = 15; 1 <= N && Q[N] === 0; N--) ;
          if (N < at && (at = N), N === 0) return p[i++] = 20971520, p[i++] = 20971520, d.bits = 1, 0;
          for (c = 1; c < N && Q[c] === 0; c++) ;
          for (at < c && (at = c), S = Y = 1; S <= 15; S++) if (Y <<= 1, (Y -= Q[S]) < 0) return -1;
          if (0 < Y && (b === 0 || N !== 1)) return -1;
          for (H[1] = 0, S = 1; S < 15; S++) H[S + 1] = H[S] + Q[S];
          for (L = 0; L < f; L++) _[y + L] !== 0 && (m[H[_[y + L]]++] = L);
          if (O = b === 0 ? (T = ft = m, 19) : b === 1 ? (T = r, st -= 257, ft = a, wt -= 257, 256) : (T = h, ft = g, -1), S = c, P = i, rt = L = B = 0, I = -1, R = (it = 1 << (X = at)) - 1, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
          for (; ; ) {
            for (U = S - rt, $ = m[L] < O ? (A = 0, m[L]) : m[L] > O ? (A = ft[wt + m[L]], T[st + m[L]]) : (A = 96, 0), v = 1 << S - rt, c = k = 1 << X; p[P + (B >> rt) + (k -= v)] = U << 24 | A << 16 | $ | 0, k !== 0; ) ;
            for (v = 1 << S - 1; B & v; ) v >>= 1;
            if (v !== 0 ? (B &= v - 1, B += v) : B = 0, L++, --Q[S] == 0) {
              if (S === N) break;
              S = _[y + m[L]];
            }
            if (at < S && (B & R) !== I) {
              for (rt === 0 && (rt = at), P += c, Y = 1 << (X = S - rt); X + rt < N && !((Y -= Q[X + rt]) <= 0); ) X++, Y <<= 1;
              if (it += 1 << X, b === 1 && 852 < it || b === 2 && 592 < it) return 1;
              p[I = B & R] = at << 24 | X << 16 | P - i | 0;
            }
          }
          return B !== 0 && (p[P + B] = S - rt << 24 | 64 << 16 | 0), d.bits = at, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, s, o) {
        s.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, s, o) {
        var n = e("../utils/common"), r = 0, a = 1;
        function h(x) {
          for (var E = x.length; 0 <= --E; ) x[E] = 0;
        }
        var g = 0, b = 29, _ = 256, y = _ + 1 + b, f = 30, p = 19, i = 2 * y + 1, m = 15, d = 16, v = 7, k = 256, I = 16, R = 17, P = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], $ = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], V = new Array(2 * (y + 2));
        h(V);
        var S = new Array(2 * f);
        h(S);
        var L = new Array(512);
        h(L);
        var c = new Array(256);
        h(c);
        var N = new Array(b);
        h(N);
        var at, X, rt, Y = new Array(f);
        function it(x, E, j, W, C) {
          this.static_tree = x, this.extra_bits = E, this.extra_base = j, this.elems = W, this.max_length = C, this.has_stree = x && x.length;
        }
        function B(x, E) {
          this.dyn_tree = x, this.max_code = 0, this.stat_desc = E;
        }
        function T(x) {
          return x < 256 ? L[x] : L[256 + (x >>> 7)];
        }
        function st(x, E) {
          x.pending_buf[x.pending++] = 255 & E, x.pending_buf[x.pending++] = E >>> 8 & 255;
        }
        function Q(x, E, j) {
          x.bi_valid > d - j ? (x.bi_buf |= E << x.bi_valid & 65535, st(x, x.bi_buf), x.bi_buf = E >> d - x.bi_valid, x.bi_valid += j - d) : (x.bi_buf |= E << x.bi_valid & 65535, x.bi_valid += j);
        }
        function H(x, E, j) {
          Q(x, j[2 * E], j[2 * E + 1]);
        }
        function ft(x, E) {
          for (var j = 0; j |= 1 & x, x >>>= 1, j <<= 1, 0 < --E; ) ;
          return j >>> 1;
        }
        function wt(x, E, j) {
          var W, C, G = new Array(m + 1), tt = 0;
          for (W = 1; W <= m; W++) G[W] = tt = tt + j[W - 1] << 1;
          for (C = 0; C <= E; C++) {
            var q = x[2 * C + 1];
            q !== 0 && (x[2 * C] = ft(G[q]++, q));
          }
        }
        function ct(x) {
          var E;
          for (E = 0; E < y; E++) x.dyn_ltree[2 * E] = 0;
          for (E = 0; E < f; E++) x.dyn_dtree[2 * E] = 0;
          for (E = 0; E < p; E++) x.bl_tree[2 * E] = 0;
          x.dyn_ltree[2 * k] = 1, x.opt_len = x.static_len = 0, x.last_lit = x.matches = 0;
        }
        function ut(x) {
          8 < x.bi_valid ? st(x, x.bi_buf) : 0 < x.bi_valid && (x.pending_buf[x.pending++] = x.bi_buf), x.bi_buf = 0, x.bi_valid = 0;
        }
        function bt(x, E, j, W) {
          var C = 2 * E, G = 2 * j;
          return x[C] < x[G] || x[C] === x[G] && W[E] <= W[j];
        }
        function pt(x, E, j) {
          for (var W = x.heap[j], C = j << 1; C <= x.heap_len && (C < x.heap_len && bt(E, x.heap[C + 1], x.heap[C], x.depth) && C++, !bt(E, W, x.heap[C], x.depth)); ) x.heap[j] = x.heap[C], j = C, C <<= 1;
          x.heap[j] = W;
        }
        function Rt(x, E, j) {
          var W, C, G, tt, q = 0;
          if (x.last_lit !== 0) for (; W = x.pending_buf[x.d_buf + 2 * q] << 8 | x.pending_buf[x.d_buf + 2 * q + 1], C = x.pending_buf[x.l_buf + q], q++, W === 0 ? H(x, C, E) : (H(x, (G = c[C]) + _ + 1, E), (tt = O[G]) !== 0 && Q(x, C -= N[G], tt), H(x, G = T(--W), j), (tt = U[G]) !== 0 && Q(x, W -= Y[G], tt)), q < x.last_lit; ) ;
          H(x, k, E);
        }
        function Et(x, E) {
          var j, W, C, G = E.dyn_tree, tt = E.stat_desc.static_tree, q = E.stat_desc.has_stree, nt = E.stat_desc.elems, ht = -1;
          for (x.heap_len = 0, x.heap_max = i, j = 0; j < nt; j++) G[2 * j] !== 0 ? (x.heap[++x.heap_len] = ht = j, x.depth[j] = 0) : G[2 * j + 1] = 0;
          for (; x.heap_len < 2; ) G[2 * (C = x.heap[++x.heap_len] = ht < 2 ? ++ht : 0)] = 1, x.depth[C] = 0, x.opt_len--, q && (x.static_len -= tt[2 * C + 1]);
          for (E.max_code = ht, j = x.heap_len >> 1; 1 <= j; j--) pt(x, G, j);
          for (C = nt; j = x.heap[1], x.heap[1] = x.heap[x.heap_len--], pt(x, G, 1), W = x.heap[1], x.heap[--x.heap_max] = j, x.heap[--x.heap_max] = W, G[2 * C] = G[2 * j] + G[2 * W], x.depth[C] = (x.depth[j] >= x.depth[W] ? x.depth[j] : x.depth[W]) + 1, G[2 * j + 1] = G[2 * W + 1] = C, x.heap[1] = C++, pt(x, G, 1), 2 <= x.heap_len; ) ;
          x.heap[--x.heap_max] = x.heap[1], (function(dt, At) {
            var jt, Ct, zt, mt, gt, Ht, Ot = At.dyn_tree, Qt = At.max_code, M = At.stat_desc.static_tree, z = At.stat_desc.has_stree, Z = At.stat_desc.extra_bits, K = At.stat_desc.extra_base, J = At.stat_desc.max_length, lt = 0;
            for (mt = 0; mt <= m; mt++) dt.bl_count[mt] = 0;
            for (Ot[2 * dt.heap[dt.heap_max] + 1] = 0, jt = dt.heap_max + 1; jt < i; jt++) J < (mt = Ot[2 * Ot[2 * (Ct = dt.heap[jt]) + 1] + 1] + 1) && (mt = J, lt++), Ot[2 * Ct + 1] = mt, Qt < Ct || (dt.bl_count[mt]++, gt = 0, K <= Ct && (gt = Z[Ct - K]), Ht = Ot[2 * Ct], dt.opt_len += Ht * (mt + gt), z && (dt.static_len += Ht * (M[2 * Ct + 1] + gt)));
            if (lt !== 0) {
              do {
                for (mt = J - 1; dt.bl_count[mt] === 0; ) mt--;
                dt.bl_count[mt]--, dt.bl_count[mt + 1] += 2, dt.bl_count[J]--, lt -= 2;
              } while (0 < lt);
              for (mt = J; mt !== 0; mt--) for (Ct = dt.bl_count[mt]; Ct !== 0; ) Qt < (zt = dt.heap[--jt]) || (Ot[2 * zt + 1] !== mt && (dt.opt_len += (mt - Ot[2 * zt + 1]) * Ot[2 * zt], Ot[2 * zt + 1] = mt), Ct--);
            }
          })(x, E), wt(G, ht, x.bl_count);
        }
        function l(x, E, j) {
          var W, C, G = -1, tt = E[1], q = 0, nt = 7, ht = 4;
          for (tt === 0 && (nt = 138, ht = 3), E[2 * (j + 1) + 1] = 65535, W = 0; W <= j; W++) C = tt, tt = E[2 * (W + 1) + 1], ++q < nt && C === tt || (q < ht ? x.bl_tree[2 * C] += q : C !== 0 ? (C !== G && x.bl_tree[2 * C]++, x.bl_tree[2 * I]++) : q <= 10 ? x.bl_tree[2 * R]++ : x.bl_tree[2 * P]++, G = C, ht = (q = 0) === tt ? (nt = 138, 3) : C === tt ? (nt = 6, 3) : (nt = 7, 4));
        }
        function D(x, E, j) {
          var W, C, G = -1, tt = E[1], q = 0, nt = 7, ht = 4;
          for (tt === 0 && (nt = 138, ht = 3), W = 0; W <= j; W++) if (C = tt, tt = E[2 * (W + 1) + 1], !(++q < nt && C === tt)) {
            if (q < ht) for (; H(x, C, x.bl_tree), --q != 0; ) ;
            else C !== 0 ? (C !== G && (H(x, C, x.bl_tree), q--), H(x, I, x.bl_tree), Q(x, q - 3, 2)) : q <= 10 ? (H(x, R, x.bl_tree), Q(x, q - 3, 3)) : (H(x, P, x.bl_tree), Q(x, q - 11, 7));
            G = C, ht = (q = 0) === tt ? (nt = 138, 3) : C === tt ? (nt = 6, 3) : (nt = 7, 4);
          }
        }
        h(Y);
        var F = !1;
        function w(x, E, j, W) {
          Q(x, (g << 1) + (W ? 1 : 0), 3), (function(C, G, tt, q) {
            ut(C), st(C, tt), st(C, ~tt), n.arraySet(C.pending_buf, C.window, G, tt, C.pending), C.pending += tt;
          })(x, E, j);
        }
        o._tr_init = function(x) {
          F || ((function() {
            var E, j, W, C, G, tt = new Array(m + 1);
            for (C = W = 0; C < b - 1; C++) for (N[C] = W, E = 0; E < 1 << O[C]; E++) c[W++] = C;
            for (c[W - 1] = C, C = G = 0; C < 16; C++) for (Y[C] = G, E = 0; E < 1 << U[C]; E++) L[G++] = C;
            for (G >>= 7; C < f; C++) for (Y[C] = G << 7, E = 0; E < 1 << U[C] - 7; E++) L[256 + G++] = C;
            for (j = 0; j <= m; j++) tt[j] = 0;
            for (E = 0; E <= 143; ) V[2 * E + 1] = 8, E++, tt[8]++;
            for (; E <= 255; ) V[2 * E + 1] = 9, E++, tt[9]++;
            for (; E <= 279; ) V[2 * E + 1] = 7, E++, tt[7]++;
            for (; E <= 287; ) V[2 * E + 1] = 8, E++, tt[8]++;
            for (wt(V, y + 1, tt), E = 0; E < f; E++) S[2 * E + 1] = 5, S[2 * E] = ft(E, 5);
            at = new it(V, O, _ + 1, y, m), X = new it(S, U, 0, f, m), rt = new it(new Array(0), A, 0, p, v);
          })(), F = !0), x.l_desc = new B(x.dyn_ltree, at), x.d_desc = new B(x.dyn_dtree, X), x.bl_desc = new B(x.bl_tree, rt), x.bi_buf = 0, x.bi_valid = 0, ct(x);
        }, o._tr_stored_block = w, o._tr_flush_block = function(x, E, j, W) {
          var C, G, tt = 0;
          0 < x.level ? (x.strm.data_type === 2 && (x.strm.data_type = (function(q) {
            var nt, ht = 4093624447;
            for (nt = 0; nt <= 31; nt++, ht >>>= 1) if (1 & ht && q.dyn_ltree[2 * nt] !== 0) return r;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return a;
            for (nt = 32; nt < _; nt++) if (q.dyn_ltree[2 * nt] !== 0) return a;
            return r;
          })(x)), Et(x, x.l_desc), Et(x, x.d_desc), tt = (function(q) {
            var nt;
            for (l(q, q.dyn_ltree, q.l_desc.max_code), l(q, q.dyn_dtree, q.d_desc.max_code), Et(q, q.bl_desc), nt = p - 1; 3 <= nt && q.bl_tree[2 * $[nt] + 1] === 0; nt--) ;
            return q.opt_len += 3 * (nt + 1) + 5 + 5 + 4, nt;
          })(x), C = x.opt_len + 3 + 7 >>> 3, (G = x.static_len + 3 + 7 >>> 3) <= C && (C = G)) : C = G = j + 5, j + 4 <= C && E !== -1 ? w(x, E, j, W) : x.strategy === 4 || G === C ? (Q(x, 2 + (W ? 1 : 0), 3), Rt(x, V, S)) : (Q(x, 4 + (W ? 1 : 0), 3), (function(q, nt, ht, dt) {
            var At;
            for (Q(q, nt - 257, 5), Q(q, ht - 1, 5), Q(q, dt - 4, 4), At = 0; At < dt; At++) Q(q, q.bl_tree[2 * $[At] + 1], 3);
            D(q, q.dyn_ltree, nt - 1), D(q, q.dyn_dtree, ht - 1);
          })(x, x.l_desc.max_code + 1, x.d_desc.max_code + 1, tt + 1), Rt(x, x.dyn_ltree, x.dyn_dtree)), ct(x), W && ut(x);
        }, o._tr_tally = function(x, E, j) {
          return x.pending_buf[x.d_buf + 2 * x.last_lit] = E >>> 8 & 255, x.pending_buf[x.d_buf + 2 * x.last_lit + 1] = 255 & E, x.pending_buf[x.l_buf + x.last_lit] = 255 & j, x.last_lit++, E === 0 ? x.dyn_ltree[2 * j]++ : (x.matches++, E--, x.dyn_ltree[2 * (c[j] + _ + 1)]++, x.dyn_dtree[2 * T(E)]++), x.last_lit === x.lit_bufsize - 1;
        }, o._tr_align = function(x) {
          Q(x, 2, 3), H(x, k, V), (function(E) {
            E.bi_valid === 16 ? (st(E, E.bi_buf), E.bi_buf = 0, E.bi_valid = 0) : 8 <= E.bi_valid && (E.pending_buf[E.pending++] = 255 & E.bi_buf, E.bi_buf >>= 8, E.bi_valid -= 8);
          })(x);
        };
      }, { "../utils/common": 41 }], 53: [function(e, s, o) {
        s.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, s, o) {
        (function(n) {
          (function(r, a) {
            if (!r.setImmediate) {
              var h, g, b, _, y = 1, f = {}, p = !1, i = r.document, m = Object.getPrototypeOf && Object.getPrototypeOf(r);
              m = m && m.setTimeout ? m : r, h = {}.toString.call(r.process) === "[object process]" ? function(I) {
                process.nextTick(function() {
                  v(I);
                });
              } : (function() {
                if (r.postMessage && !r.importScripts) {
                  var I = !0, R = r.onmessage;
                  return r.onmessage = function() {
                    I = !1;
                  }, r.postMessage("", "*"), r.onmessage = R, I;
                }
              })() ? (_ = "setImmediate$" + Math.random() + "$", r.addEventListener ? r.addEventListener("message", k, !1) : r.attachEvent("onmessage", k), function(I) {
                r.postMessage(_ + I, "*");
              }) : r.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(I) {
                v(I.data);
              }, function(I) {
                b.port2.postMessage(I);
              }) : i && "onreadystatechange" in i.createElement("script") ? (g = i.documentElement, function(I) {
                var R = i.createElement("script");
                R.onreadystatechange = function() {
                  v(I), R.onreadystatechange = null, g.removeChild(R), R = null;
                }, g.appendChild(R);
              }) : function(I) {
                setTimeout(v, 0, I);
              }, m.setImmediate = function(I) {
                typeof I != "function" && (I = new Function("" + I));
                for (var R = new Array(arguments.length - 1), P = 0; P < R.length; P++) R[P] = arguments[P + 1];
                var O = { callback: I, args: R };
                return f[y] = O, h(y), y++;
              }, m.clearImmediate = d;
            }
            function d(I) {
              delete f[I];
            }
            function v(I) {
              if (p) setTimeout(v, 0, I);
              else {
                var R = f[I];
                if (R) {
                  p = !0;
                  try {
                    (function(P) {
                      var O = P.callback, U = P.args;
                      switch (U.length) {
                        case 0:
                          O();
                          break;
                        case 1:
                          O(U[0]);
                          break;
                        case 2:
                          O(U[0], U[1]);
                          break;
                        case 3:
                          O(U[0], U[1], U[2]);
                          break;
                        default:
                          O.apply(a, U);
                      }
                    })(R);
                  } finally {
                    d(I), p = !1;
                  }
                }
              }
            }
            function k(I) {
              I.source === r && typeof I.data == "string" && I.data.indexOf(_) === 0 && v(+I.data.slice(_.length));
            }
          })(typeof self > "u" ? n === void 0 ? this : n : self);
        }).call(this, typeof le < "u" ? le : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(fe)), fe.exports;
}
var Ue = De();
const ze = /* @__PURE__ */ $e(Ue);
async function je(u) {
  const t = await Xe(u), e = await ze.loadAsync(t), s = [];
  return e.forEach((o, n) => {
    if (n.dir)
      return;
    const r = We(o);
    s.push({
      name: r,
      text: () => n.async("text"),
      arrayBuffer: () => n.async("arraybuffer")
    });
  }), s;
}
async function Xe(u) {
  if (u instanceof ArrayBuffer)
    return u;
  if (u instanceof Blob)
    return await u.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function We(u) {
  let t = u.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Ye(u) {
  return !!u && typeof u == "object" && !(u instanceof ArrayBuffer) && !(u instanceof Uint8Array);
}
function Ge(u) {
  return u instanceof Uint8Array ? u : new Uint8Array(u);
}
function Ze(u) {
  return u.byteOffset === 0 && u.byteLength === u.buffer.byteLength ? u.buffer : u.slice().buffer;
}
function te(u, t, e = 0) {
  if (u.length < e + t.length) return !1;
  for (let s = 0; s < t.length; s++)
    if (u[e + s] !== t[s]) return !1;
  return !0;
}
function Ve(u) {
  return te(u, [80, 75, 3, 4]) || te(u, [80, 75, 5, 6]) || te(u, [80, 75, 7, 8]) ? "zip" : te(u, [82, 97, 114, 33, 26, 7, 0]) || te(u, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : te(u, [55, 122, 188, 175, 39, 28]) ? "7z" : u.length > 262 && te(u, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Te(u) {
  return u.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function we(u) {
  const t = [], e = u.map((i) => Te(i).toLowerCase()), s = (i) => e.some(i), o = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, n = /\.(drl|xln)$/i, r = e.filter((i) => o.test(i)).length, a = e.filter((i) => n.test(i) || i.includes("drill")).length, h = s((i) => i.includes("top") && i.includes("copper") || i.endsWith(".gtl")), g = s((i) => i.includes("bot") || i.includes("bottom") || i.endsWith(".gbl")), b = s((i) => i.includes("mask") || i.includes("solder") || i.endsWith(".gts") || i.endsWith(".gbs")), _ = s((i) => i.includes("silk") || i.includes("legend") || i.endsWith(".gto") || i.endsWith(".gbo")), y = s((i) => i.includes("outline") || i.includes("profile") || i.includes("edge") || i.endsWith(".gko") || i.endsWith(".gm1") || i.endsWith(".gml")), f = e.every(
    (i) => i.endsWith(".pdf") || i.endsWith(".png") || i.endsWith(".jpg") || i.endsWith(".jpeg") || i.endsWith(".svg") || i.endsWith(".txt") || i.endsWith(".md")
  );
  let p = 0;
  return u.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : f ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (r > 0 ? (p += 0.35, t.push(`Found ${r} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), a > 0 && (p += 0.2, t.push(`Found ${a} drill-like file(s).`)), y && (p += 0.15, t.push("Found outline/profile/edge candidate.")), h && g ? (p += 0.2, t.push("Found both top and bottom copper candidates.")) : (h || g) && (p += 0.1, t.push("Found at least one copper candidate.")), b && (p += 0.05, t.push("Found solder mask candidate.")), _ && (p += 0.05, t.push("Found silkscreen/legend candidate.")), p = Math.max(0, Math.min(1, p)), p < 0.6 && r >= 2 && (p = Math.max(p, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: p, reasons: t });
}
async function qe(u) {
  if (Ye(u)) {
    const n = Object.keys(u).map(Te), { confidence: r, reasons: a } = we(n);
    return {
      isGerber: r >= 0.6,
      archiveType: "directory",
      confidence: r,
      reasons: a,
      files: n
    };
  }
  const t = Ge(u), e = Ve(t);
  if (e === "zip")
    try {
      const n = Ze(t), a = (await je(n)).map((b) => b.name), { confidence: h, reasons: g } = we(a);
      return {
        isGerber: h >= 0.6,
        archiveType: "zip",
        confidence: h,
        reasons: g,
        files: a
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
  const s = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return s.includes("%FSLAX") || s.includes("%MOIN") || s.includes("%MOMM") || s.includes("G04") || s.includes("%ADD") ? {
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
class St extends Error {
  constructor(t, e, s) {
    super(e), this.name = "GerberError", this.code = t, this.details = s;
  }
}
function Pe(u) {
  let t = u.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function He(u) {
  return u instanceof Uint8Array ? u : new Uint8Array(u);
}
function Be(u) {
  try {
    return u.slice().buffer;
  } catch {
    const t = new Uint8Array(u.byteLength);
    return t.set(u), t.buffer;
  }
}
async function Ke(u) {
  let t;
  try {
    t = await ze.loadAsync(Be(u));
  } catch (a) {
    throw new St(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      a
    );
  }
  const e = {}, s = 1e3, o = 100 * 1024 * 1024, n = Object.entries(t.files).filter(([, a]) => a && !a.dir);
  if (n.length > s)
    throw new St(
      "PARSE_ERROR",
      `ZIP contains too many files (${n.length} > ${s})`
    );
  let r = 0;
  for (const [a, h] of n)
    try {
      const g = Pe(a), b = await h.async("arraybuffer");
      if (r += b.byteLength, r > o)
        throw new St(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${o} bytes)`
        );
      e[g] = new Uint8Array(b);
    } catch (g) {
      if (g instanceof St) throw g;
      console.warn(`Failed to extract file ${a}:`, g);
    }
  if (Object.keys(e).length === 0)
    throw new St("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Je(u, t) {
  let e;
  try {
    const _ = await import("./libarchive-Bt1VdZR0.js");
    e = _.Archive ?? _.default?.Archive;
  } catch (_) {
    throw new St(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      _
    );
  }
  if (!e)
    throw new St("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      e.init({ workerUrl: t.workerUrl });
    } catch (_) {
      throw new St(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        _
      );
    }
  let s;
  try {
    const _ = new Blob([Be(u)], { type: "application/octet-stream" });
    s = await e.open(_);
  } catch (_) {
    throw new St("NOT_AN_ARCHIVE", "Failed to open RAR archive", _);
  }
  let o;
  try {
    o = await Promise.race([
      s.extractFiles(),
      new Promise(
        (_, y) => setTimeout(() => y(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (_) {
    throw new St("PARSE_ERROR", "Failed to extract RAR archive", _);
  }
  const n = {};
  let r = 0;
  const a = 1e3, h = 100 * 1024 * 1024;
  let g = 0;
  async function b(_, y) {
    if (r >= a)
      throw new St(
        "PARSE_ERROR",
        `Archive contains too many files (max ${a})`
      );
    for (const f of Object.keys(_)) {
      const p = _[f], i = y ? `${y}/${f}` : f;
      if (p instanceof File || p instanceof Blob) {
        r++;
        try {
          const m = await p.arrayBuffer();
          if (g += m.byteLength, g > h)
            throw new St(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${h} bytes)`
            );
          n[Pe(i)] = new Uint8Array(m);
        } catch (m) {
          if (m instanceof St) throw m;
          console.warn(`Failed to extract file ${i}:`, m);
        }
      } else p && typeof p == "object" && await b(p, i);
    }
  }
  try {
    await b(o, "");
  } finally {
    if (s && typeof s.close == "function")
      try {
        await s.close();
      } catch (_) {
        console.warn("Failed to close archive:", _);
      }
  }
  if (Object.keys(n).length === 0)
    throw new St("PARSE_ERROR", "No files extracted from RAR archive");
  return n;
}
async function ue(u, t) {
  if (!u || u.byteLength === 0)
    throw new St("NOT_AN_ARCHIVE", "Input is empty");
  const e = He(u), s = 100 * 1024 * 1024;
  if (e.length > s)
    throw new St(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${s} bytes)`
    );
  let o;
  try {
    o = await qe(e);
  } catch (n) {
    throw new St("PARSE_ERROR", "Failed to detect archive type", n);
  }
  if (!o.isGerber && o.archiveType !== "rar")
    throw new St(
      "NOT_GERBER",
      o.reasons.join("; ") || "Not a Gerber bundle",
      o
    );
  try {
    if (o.archiveType === "zip")
      return { archiveType: "zip", files: await Ke(e) };
    if (o.archiveType === "rar")
      return { archiveType: "rar", files: await Je(e, t) };
    if (o.archiveType === "single-file")
      return { archiveType: "single-file", files: { "layer.gtl": e } };
    throw new St(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${o.archiveType}`,
      o
    );
  } catch (n) {
    throw n instanceof St ? n : new St(
      "PARSE_ERROR",
      n instanceof Error ? n.message : "Unknown error during extraction",
      { error: n, det: o }
    );
  }
}
function re(u) {
  return u.toLowerCase();
}
function qt(u, t) {
  const e = new Set(t.map((o) => o.toLowerCase()));
  return u.filter((o) => {
    const n = re(o), r = n.lastIndexOf(".");
    return r < 0 ? !1 : e.has(n.slice(r));
  }).sort((o, n) => o.length - n.length)[0];
}
function xt(u, t) {
  const e = t.map((o) => o.toLowerCase());
  return u.filter((o) => {
    const n = re(o);
    return e.every((r) => n.includes(r));
  }).sort((o, n) => o.length - n.length)[0];
}
function Qe(u, t, e) {
  const s = new Set([t, e].filter(Boolean)), o = [];
  for (const n of u) {
    if (s.has(n)) continue;
    const r = re(n), a = r.split("/").pop() || r, h = a.lastIndexOf("."), g = h >= 0 ? a.slice(h) : "";
    let b = /in(\d+)_cu/.exec(a);
    if (b) {
      o.push({ path: n, num: parseInt(b[1], 10) });
      continue;
    }
    if (b = /(?:inner|signal|layer)[ _-]?(\d+)/.exec(a), b) {
      o.push({ path: n, num: parseInt(b[1], 10) });
      continue;
    }
    if (b = /^\.gl?(\d+)$/.exec(g), b) {
      const _ = parseInt(b[1], 10);
      !Number.isNaN(_) && _ >= 2 && o.push({ path: n, num: _ });
      continue;
    }
  }
  return o.sort((n, r) => n.num - r.num), o;
}
function tr(u, t, e) {
  const s = new Set([t, e].filter(Boolean)), o = [];
  for (const n of u) {
    if (s.has(n)) continue;
    const r = re(n), a = r.split("/").pop() || r, h = a.lastIndexOf("."), g = h >= 0 ? a.slice(h) : "";
    if (/in\d+_cu/.test(a)) {
      o.push(n);
      continue;
    }
    if (/^\.gl?\d+$/.test(g)) {
      const b = parseInt(g.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(b) && b >= 2) {
        o.push(n);
        continue;
      }
    }
  }
  return o.sort(), o;
}
function er(u) {
  const t = [], e = (s) => re(s);
  for (const s of u) {
    const o = e(s), n = o.split("/").pop() || o, r = n.slice(n.lastIndexOf("."));
    if (r === ".drl" || r === ".xln" || r === ".exc" || r === ".ncd") {
      t.push(s);
      continue;
    }
    if (r === ".txt" && (n.includes("hole") || n.includes("drill") || n.includes("npth") || n.includes("-pth"))) {
      t.push(s);
      continue;
    }
    if ((n.includes("drill") || n.includes("npth") || n.includes("-pth")) && (r === ".gbr" || r === ".ger" || r === ".txt" || r === "")) {
      t.push(s);
      continue;
    }
  }
  return t;
}
function rr(u) {
  const t = u.filter((_) => {
    const y = re(_);
    return !(y.endsWith("/") || y.includes("__macosx") || y.endsWith(".ds_store"));
  }), e = qt(t, [".gtl"]) || xt(t, ["f_cu"]) || xt(t, ["top", "cu"]) || xt(t, ["top", "copper"]), s = qt(t, [".gbl"]) || xt(t, ["b_cu"]) || xt(t, ["bottom", "cu"]) || xt(t, ["bottom", "copper"]), o = qt(t, [".gts"]) || xt(t, ["f_mask"]) || xt(t, ["top", "mask"]), n = qt(t, [".gbs"]) || xt(t, ["b_mask"]) || xt(t, ["bottom", "mask"]), r = qt(t, [".gto"]) || xt(t, ["f_silks"]) || xt(t, ["f_silk"]) || xt(t, ["top", "silk"]), a = qt(t, [".gbo"]) || xt(t, ["b_silks"]) || xt(t, ["b_silk"]) || xt(t, ["bottom", "silk"]), h = qt(t, [".gko", ".gm1"]) || xt(t, ["edge", "cuts"]) || xt(t, ["outline"]) || xt(t, ["board", "outline"]), g = er(t), b = tr(t, e, s);
  return {
    top_copper: e,
    bottom_copper: s,
    top_mask: o,
    bottom_mask: n,
    top_silk: r,
    bottom_silk: a,
    outline: h,
    drills: g.length ? g : void 0,
    inner_copper: b.length ? b : void 0
  };
}
function nr(u) {
  const t = u.filter((a) => {
    const h = re(a);
    return !(h.endsWith("/") || h.includes("__macosx") || h.endsWith(".ds_store"));
  }), e = rr(t), s = qt(t, [".gtp"]) || xt(t, ["f_paste"]) || xt(t, ["top", "paste"]), o = qt(t, [".gbp"]) || xt(t, ["b_paste"]) || xt(t, ["bottom", "paste"]), n = Qe(t, e.top_copper, e.bottom_copper), r = [];
  e.top_copper && r.push({ path: e.top_copper, role: "top", index: 0 });
  for (const a of n) r.push({ path: a.path, role: "inner", index: 0, detectedNum: a.num });
  return e.bottom_copper && r.push({ path: e.bottom_copper, role: "bottom", index: 0 }), r.forEach((a, h) => {
    a.index = h;
  }), {
    copper: r,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    top_paste: s,
    bottom_paste: o,
    outline: e.outline,
    drills: e.drills
  };
}
const ir = 0.8;
function Gt(u, t, e) {
  const s = {
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
  }, o = t.split(/\r?\n/);
  for (const n of o) {
    let r = n.trim();
    if (r && !r.startsWith("G04")) {
      if (r.startsWith("%") && r.endsWith("%")) {
        sr(r, s);
        continue;
      }
      r.endsWith("*") && (r = r.slice(0, -1)), or(r, s);
    }
  }
  if (s.inRegion) {
    if (s.currentPath.length >= 3 && s.regionPaths.push(s.currentPath), s.regionPaths.length > 0) {
      const n = {
        loops: s.regionPaths,
        polarity: s.currentPolarity
      };
      s.regions.push(n), s.ops.push({
        kind: "region",
        polarity: s.currentPolarity,
        loops: s.regionPaths
      });
    }
    s.inRegion = !1, s.regionPaths = [], s.currentPath = [];
  }
  return {
    tracks: s.tracks,
    arcs: s.arcs,
    flashes: s.flashes,
    regions: s.regions,
    ops: s.ops
  };
}
function sr(u, t) {
  let e = u;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const s = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (s) {
      const o = parseInt(s[1], 10), n = parseInt(s[2], 10);
      parseInt(s[4], 10), t.fmtInt = o, t.fmtDec = n;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const s = t.unitScale;
    let o = s;
    if (e.includes("MOMM") ? o = 1 : e.includes("MOIN") && (o = 25.4), o !== s) {
      const n = o / s;
      for (const r of t.apertures.values())
        r.diameterMm !== void 0 && (r.diameterMm *= n), r.widthMm !== void 0 && (r.widthMm *= n), r.heightMm !== void 0 && (r.heightMm *= n);
      t.unitScale = o;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const s = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!s) return;
    const o = parseInt(s[2], 10), n = s[3], r = s[4] ?? "";
    let a, h, g, b, _;
    if (r) {
      const f = r.split(/[Xx]/).filter(Boolean), p = f[0] ? parseFloat(f[0]) * t.unitScale : void 0, i = f[1] ? parseFloat(f[1]) * t.unitScale : void 0, m = f[2] ? parseFloat(f[2]) * t.unitScale : void 0, d = f[3] ? parseFloat(f[3]) : void 0;
      d !== void 0 && !Number.isNaN(d) && d !== 0 && (_ = d), n === "C" ? a = p : n === "R" || n === "O" ? (h = p, g = i, a = p !== void 0 && i !== void 0 ? Math.min(p, i) : p ?? i) : (h = p, g = i, m !== void 0 && (b = m), a = p !== void 0 && i !== void 0 ? Math.min(p, i) : p ?? i);
    }
    const y = {
      code: o,
      shape: n,
      diameterMm: a,
      widthMm: h,
      heightMm: g,
      cornerMm: b,
      rotationDeg: _
    };
    t.apertures.set(o, y);
    return;
  }
  if (e.startsWith("LR")) {
    const s = /LR([+-]?[\d.]+)/.exec(e);
    s && (t.loadRotationDeg = parseFloat(s[1]) || 0);
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
function ke(u, t, e, s, o) {
  const n = u.x + e, r = u.y + s, a = Math.sqrt(e * e + s * s);
  if (a < 1e-6) return [t];
  const h = Math.atan2(u.y - r, u.x - n), g = Math.atan2(t.y - r, t.x - n), _ = (t.x - u.x) ** 2 + (t.y - u.y) ** 2 < (a * 1e-3) ** 2;
  let y;
  _ ? y = o ? -2 * Math.PI : 2 * Math.PI : (y = g - h, o ? y > 1e-6 && (y -= 2 * Math.PI) : y < -1e-6 && (y += 2 * Math.PI));
  const f = Math.min(64, Math.max(4, Math.ceil(Math.abs(y) / (Math.PI / 16)))), p = [];
  for (let i = 1; i <= f; i++) {
    const m = h + y * i / f;
    p.push({ x: n + a * Math.cos(m), y: r + a * Math.sin(m) });
  }
  return p;
}
function or(u, t) {
  if (u === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (u === "G74" || u === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(u);
  if (e && (t.arcMode = parseInt(e[1], 10), u = u.slice(e[0].length).trim(), !u))
    return;
  if (u === "G37") {
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
  let s = null;
  const o = /D0?(\d{1,3})$/.exec(u);
  if (o && (s = parseInt(o[1], 10), u = u.slice(0, u.length - o[0].length)), s !== null && s >= 10) {
    const i = t.apertures.get(s);
    i && (t.currentAperture = i);
    return;
  }
  const n = /X([+\-]?\d+)/.exec(u), r = /Y([+\-]?\d+)/.exec(u), a = /I([+\-]?\d+)/.exec(u), h = /J([+\-]?\d+)/.exec(u);
  let g = t.x, b = t.y;
  n && (g = de(n[1], t)), r && (b = de(r[1], t));
  const _ = a ? de(a[1], t) : 0, y = h ? de(h[1], t) : 0;
  if (s === null) {
    t.x = g, t.y = b;
    return;
  }
  if (t.inRegion) {
    const i = t.x, m = t.y;
    if (s === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: i, y: m }), t.arcMode !== 1 && (_ !== 0 || y !== 0)) {
        const d = ke({ x: i, y: m }, { x: g, y: b }, _, y, t.arcMode === 2);
        for (const v of d) t.currentPath.push(v);
      } else
        t.currentPath.push({ x: g, y: b });
    else s === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = g, t.y = b;
    return;
  }
  const f = t.x, p = t.y;
  if (s === 1) {
    if (!t.currentAperture) {
      t.x = g, t.y = b;
      return;
    }
    const i = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (_ !== 0 || y !== 0)) {
      const m = ke({ x: f, y: p }, { x: g, y: b }, _, y, t.arcMode === 2);
      let d = { x: f, y: p };
      for (const v of m)
        t.tracks.push({ start: d, end: v, width: i, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: d, end: v, widthMm: i }), d = v;
    } else
      t.tracks.push({
        start: { x: f, y: p },
        end: { x: g, y: b },
        width: i,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: f, y: p },
        end: { x: g, y: b },
        widthMm: i
      });
    t.x = g, t.y = b;
    return;
  }
  if (s === 2) {
    t.x = g, t.y = b;
    return;
  }
  if (s === 3) {
    if (t.currentAperture) {
      const i = t.currentAperture, m = i.diameterMm !== void 0 ? i.diameterMm : ir, d = (i.rotationDeg ?? 0) + t.loadRotationDeg, v = d !== 0 ? d : void 0, k = {
        position: { x: g, y: b },
        diameterMm: m,
        shape: i.shape,
        polarity: t.currentPolarity,
        rotationDeg: v
      };
      i.widthMm !== void 0 && (k.widthMm = i.widthMm), i.heightMm !== void 0 && (k.heightMm = i.heightMm), i.cornerMm !== void 0 && (k.cornerMm = i.cornerMm), t.flashes.push(k), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: g, y: b },
        diameterMm: m,
        shape: i.shape,
        widthMm: i.widthMm,
        heightMm: i.heightMm,
        cornerMm: i.cornerMm,
        rotationDeg: v
      });
    }
    t.x = g, t.y = b;
    return;
  }
}
function de(u, t) {
  const e = u.startsWith("-") ? -1 : 1, s = u.replace(/[+\-]/g, ""), o = parseInt(s, 10);
  if (Number.isNaN(o)) return 0;
  const n = Math.pow(10, t.fmtDec), r = o / n * t.unitScale;
  return e * r;
}
function me(u, t) {
  return /^0+$/.test(u) && /^0+$/.test(t) ? { fmtInt: u.length, fmtDec: t.length } : { fmtInt: parseInt(u, 10), fmtDec: parseInt(t, 10) };
}
function ar(u, t) {
  const e = t.split(/\r?\n/), s = /* @__PURE__ */ new Map();
  let o = null;
  const n = [], r = [];
  let a = 1, h = 2, g = 4, b = !1, _ = !1, y = null, f = !1, p = 0, i = 0, m = 5;
  const d = (v) => {
    if (v.includes(".")) return parseFloat(v) * a;
    const k = v.startsWith("-") ? -1 : 1;
    let I = v.replace(/[+\-]/, "");
    y === "LZ" && (I = I.padEnd(h + g, "0"));
    const R = parseInt(I, 10);
    return Number.isNaN(R) ? 0 : k * (R / Math.pow(10, g)) * a;
  };
  for (const v of e) {
    const k = v.trim();
    if (!k || k.startsWith(";")) continue;
    if (k === "M48") {
      b = !0;
      continue;
    }
    if (k === "%" && b) {
      b = !1;
      continue;
    }
    if (k === "M30" || k === "M00") break;
    if (k === "M15") {
      f = !0;
      continue;
    }
    if (k === "M16" || k === "M17") {
      f = !1, m = 5;
      continue;
    }
    if (b) {
      if (/[,\s]LZ\b/i.test(k) ? y = "LZ" : /[,\s]TZ\b/i.test(k) && (y = "TZ"), k.startsWith("METRIC")) {
        a = 1, _ || (h = 3, g = 3);
        const $ = /(\d+)\.(\d+)/.exec(k);
        if ($) {
          const V = me($[1], $[2]);
          h = V.fmtInt, g = V.fmtDec, _ = !0;
        }
      } else if (k.startsWith("INCH")) {
        a = 25.4, _ || (h = 2, g = 4);
        const $ = /(\d+)\.(\d+)/.exec(k);
        if ($) {
          const V = me($[1], $[2]);
          h = V.fmtInt, g = V.fmtDec, _ = !0;
        }
      }
      const A = /^FMAT,(\d+)\.(\d+)/.exec(k) || /^(\d+)\.(\d+)$/.exec(k);
      if (A) {
        const $ = me(A[1], A[2]);
        h = $.fmtInt, g = $.fmtDec, _ = !0;
      }
    }
    if (/^T\d+C[\d.]+/i.test(k)) {
      const A = /^T(\d+)C([\d.]+)/i.exec(k);
      if (A) {
        const $ = parseFloat(A[2]) * a;
        Number.isNaN($) || s.set(A[1], $);
      }
      continue;
    }
    if (/^T\d+$/i.test(k)) {
      const A = /^T(\d+)/i.exec(k);
      A && (o = A[1]);
      continue;
    }
    const I = /^G0*([015])(?!\d)/.exec(k);
    if (I && (m = parseInt(I[1], 10)), /^[GRMF]/.test(k) && !/[XY]/i.test(k)) continue;
    const R = o && s.has(o) ? s.get(o) : 0.6, P = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(k);
    if (P) {
      const A = d(P[1]), $ = d(P[2]), V = d(P[3]), S = d(P[4]);
      Number.isFinite(A) && Number.isFinite($) && (r.push({ x1: A, y1: $, x2: V, y2: S, diameter: R }), p = V, i = S);
      continue;
    }
    const O = /X([+\-]?[\d.]+)/i.exec(k), U = /Y([+\-]?[\d.]+)/i.exec(k);
    if (O || U) {
      const A = O ? d(O[1]) : p, $ = U ? d(U[1]) : i;
      Number.isFinite(A) && Number.isFinite($) && (m === 0 || (f && m === 1 ? r.push({ x1: p, y1: i, x2: A, y2: $, diameter: R }) : n.push({ x: A, y: $, diameter: R, plated: !0 })), p = A, i = $);
    }
  }
  return { name: u, holes: n, slots: r };
}
function lr(u) {
  return { w: u.maxX - u.minX, h: u.maxY - u.minY };
}
function ie(u) {
  const { w: t, h: e } = lr(u);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Xt(u, t) {
  if (!Number.isFinite(u) || !Number.isFinite(t) || u <= 0 || t <= 0) return 1;
  const e = u / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Zt(u, t) {
  return t === 1 ? u : {
    ...u,
    tracks: u.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: u.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: u.regions.map((e) => ({
      ...e,
      loops: e.loops.map((s) => s.map((o) => ({ x: o.x * t, y: o.y * t })))
    })),
    // ops drives the polarity-correct copper/mask rendering; it must be scaled
    // in lockstep with tracks/flashes/regions or layers render at the wrong size.
    ops: u.ops.map((e) => e.kind === "track" ? {
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
      loops: e.loops.map((s) => s.map((o) => ({ x: o.x * t, y: o.y * t })))
    })
  };
}
function cr(u, t) {
  return t === 1 ? u : u.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function dr(u, t) {
  return t === 1 ? u : u.map((e) => ({
    x1: e.x1 * t,
    y1: e.y1 * t,
    x2: e.x2 * t,
    y2: e.y2 * t,
    diameter: (e.diameter ?? 0) * t
  }));
}
function ur(u) {
  return URL.createObjectURL(new Blob([u], { type: "image/svg+xml" }));
}
function Bt(u, t, e) {
  u.minX = Math.min(u.minX, t), u.minY = Math.min(u.minY, e), u.maxX = Math.max(u.maxX, t), u.maxY = Math.max(u.maxY, e);
}
function ye() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function $t(u) {
  const t = ye();
  for (const e of u.tracks) {
    Bt(t, e.start.x, e.start.y), Bt(t, e.end.x, e.end.y);
    const s = (e.width ?? 0) / 2;
    Bt(t, e.start.x - s, e.start.y - s), Bt(t, e.start.x + s, e.start.y + s), Bt(t, e.end.x - s, e.end.y - s), Bt(t, e.end.x + s, e.end.y + s);
  }
  for (const e of u.flashes) {
    const s = (e.widthMm ?? e.diameterMm) || 0, o = (e.heightMm ?? e.diameterMm) || 0;
    Bt(t, e.position.x - s / 2, e.position.y - o / 2), Bt(t, e.position.x + s / 2, e.position.y + o / 2);
  }
  for (const e of u.regions)
    for (const s of e.loops) for (const o of s) Bt(t, o.x, o.y);
  return t;
}
function hr(u, t = []) {
  const e = ye();
  for (const s of u) {
    const o = (s.diameter || 0) / 2;
    Bt(e, s.x - o, s.y - o), Bt(e, s.x + o, s.y + o);
  }
  for (const s of t) {
    const o = (s.diameter || 0) / 2;
    Bt(e, s.x1 - o, s.y1 - o), Bt(e, s.x1 + o, s.y1 + o), Bt(e, s.x2 - o, s.y2 - o), Bt(e, s.x2 + o, s.y2 + o);
  }
  return e;
}
function Se(u, t) {
  return {
    minX: Math.min(u.minX, t.minX),
    minY: Math.min(u.minY, t.minY),
    maxX: Math.max(u.maxX, t.maxX),
    maxY: Math.max(u.maxY, t.maxY)
  };
}
function Ft(u) {
  return !Number.isFinite(u.minX) || !Number.isFinite(u.minY) || !Number.isFinite(u.maxX) || !Number.isFinite(u.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (u.maxX - u.minX < 1e-6 && (u.maxX = u.minX + 1), u.maxY - u.minY < 1e-6 && (u.maxY = u.minY + 1), u);
}
const fr = 1e3;
function Lt(u) {
  return u / 25.4 * fr;
}
function Kt(u, t, e) {
  const s = u - e.minX, o = e.maxY - t;
  return { x: s, y: o };
}
function Oe(u, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${u}" height="${t}" viewBox="0 0 ${u} ${t}">
  <rect width="${u}" height="${t}" fill="white"/>
</svg>`.trim();
}
function Vt(u, t = 1e-4) {
  const e = Math.round(u.x / t) * t, s = Math.round(u.y / t) * t;
  return `${e.toFixed(4)},${s.toFixed(4)}`;
}
function Me(u) {
  let t = 0;
  const e = u.length;
  for (let s = 0; s < e; s++) {
    const o = u[s], n = u[(s + 1) % e];
    t += o.x * n.y - n.x * o.y;
  }
  return 0.5 * t;
}
function pe(u, t, e) {
  if (!u.length) return "";
  const s = (r) => ({
    x: (r.x - t.minX) * e,
    y: (t.maxY - r.y) * e
  }), o = s(u[0]), n = [`M ${o.x.toFixed(2)} ${o.y.toFixed(2)}`];
  for (let r = 1; r < u.length; r++) {
    const a = s(u[r]);
    n.push(`L ${a.x.toFixed(2)} ${a.y.toFixed(2)}`);
  }
  return n.push("Z"), n.join(" ");
}
function Fe(u) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), s = (g, b) => {
    const _ = Vt(g), y = Vt(b);
    t.has(_) || t.set(_, []), t.has(y) || t.set(y, []), t.get(_).push(b), t.get(y).push(g), e.has(_) || e.set(_, g), e.has(y) || e.set(y, b);
  };
  for (const g of u) s(g.start, g.end);
  const o = /* @__PURE__ */ new Set(), n = (g, b) => {
    const _ = Vt(g), y = Vt(b);
    return _ < y ? `${_}|${y}` : `${y}|${_}`;
  }, r = [];
  for (const [g, b] of t.entries()) {
    const _ = e.get(g);
    for (const y of b) {
      const f = n(_, y);
      if (o.has(f)) continue;
      const p = [_];
      let i = _, m = y;
      o.add(f);
      for (let d = 0; d < 1e5; d++) {
        p.push(m);
        const v = Vt(m), k = t.get(v) ?? [];
        if (k.length === 0) break;
        let I = null;
        for (const R of k) {
          if (Vt(R) === Vt(i) && k.length > 1) continue;
          const P = n(m, R);
          if (!o.has(P)) {
            I = R, o.add(P);
            break;
          }
        }
        if (I || (I = k[0]), i = m, m = I, Vt(m) === Vt(_))
          break;
      }
      p.length >= 3 && r.push(p);
    }
  }
  r.sort((g, b) => Math.abs(Me(b)) - Math.abs(Me(g)));
  const a = [], h = /* @__PURE__ */ new Set();
  for (const g of r) {
    const b = g.map((_) => Vt(_)).join(";");
    h.has(b) || (h.add(b), a.push(g));
  }
  return a;
}
function mr(u, t) {
  const e = t.maxX - t.minX, s = t.maxY - t.minY, o = Math.max(1, Math.round(Lt(e))), n = Math.max(1, Math.round(Lt(s))), r = Lt(1), a = [];
  for (const h of u.regions)
    for (const g of h.loops)
      a.push(pe(g, t, r));
  if (a.length === 0 && u.tracks.length) {
    const h = Fe(u.tracks);
    if (h.length) {
      const g = h[0];
      a.push(pe(g, t, r));
      for (let b = 1; b < h.length; b++)
        a.push(pe(h[b], t, r));
    }
  }
  return a.length === 0 ? Oe(o, n) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${n}" viewBox="0 0 ${o} ${n}">
  <rect x="0" y="0" width="${o}" height="${n}" fill="black"/>
  <path d="${a.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function pr(u) {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const n of u.loops)
    for (const r of n)
      t = Math.min(t, r.x), e = Math.min(e, r.y), s = Math.max(s, r.x), o = Math.max(o, r.y);
  return { minX: t, minY: e, maxX: s, maxY: o };
}
function gr(u, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let s = 0, o = 0;
  for (const g of u.regions) {
    const b = pr(g), _ = (b.maxX - b.minX) * (b.maxY - b.minY);
    g.polarity === "clear" ? o = Math.max(o, _) : s = Math.max(s, _);
  }
  const n = u.tracks.filter((g) => g.polarity !== "clear").length + u.flashes.filter((g) => g.polarity !== "clear").length + u.regions.filter((g) => g.polarity !== "clear").length, r = u.tracks.filter((g) => g.polarity === "clear").length + u.flashes.filter((g) => g.polarity === "clear").length + u.regions.filter((g) => g.polarity === "clear").length, a = o > e * 0.85;
  return !(s > e * 0.85 || !a || !(r > n * 2));
}
function ee(u, t, e, s) {
  const o = t.maxX - t.minX, n = t.maxY - t.minY, r = Math.max(1, Math.round(Lt(o))), a = Math.max(1, Math.round(Lt(n))), h = Lt(1), b = gr(u, t) ? "white" : "black", _ = (i, m) => {
    const d = i - t.minX, v = t.maxY - m;
    return { x: d * h, y: v * h };
  }, y = (i, m) => {
    if (i.kind === "track") {
      const d = _(i.start.x, i.start.y), v = _(i.end.x, i.end.y), k = Number.isFinite(i.widthMm) ? i.widthMm : 0.2, I = Math.max(1, k * h);
      return `<line x1="${d.x.toFixed(2)}" y1="${d.y.toFixed(2)}" x2="${v.x.toFixed(2)}" y2="${v.y.toFixed(2)}" stroke-width="${I.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${m}" stroke="${m}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (i.kind === "flash") {
      const d = _(i.position.x, i.position.y), v = i.widthMm ?? i.diameterMm ?? 0.8, k = i.heightMm ?? i.diameterMm ?? 0.8, I = Math.max(0.01, Number.isFinite(v) ? v : 0.8) * h, R = Math.max(0.01, Number.isFinite(k) ? k : 0.8) * h, P = d.x - I / 2, O = d.y - R / 2, U = i.rotationDeg, A = U && Math.abs(U) > 0.01 ? ` transform="rotate(${(-U).toFixed(2)},${d.x.toFixed(2)},${d.y.toFixed(2)})"` : "";
      if (i.shape === "R" || i.shape === "O") {
        const V = i.shape === "O" ? Math.min(I, R) * 0.5 : 0;
        return `<rect x="${P.toFixed(2)}" y="${O.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${m}" fill-opacity="1"${A} />`;
      }
      if (Number.isFinite(i.cornerMm) && (i.cornerMm ?? 0) > 0) {
        const V = Math.max(0, i.cornerMm * h);
        return `<rect x="${P.toFixed(2)}" y="${O.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${m}" fill-opacity="1"${A} />`;
      }
      const $ = Math.max(1, Math.max(I, R) / 2);
      return `<circle cx="${d.x.toFixed(2)}" cy="${d.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${m}" fill-opacity="1" />`;
    }
    if (i.kind === "region") {
      const d = i.loops.map((v) => {
        if (!v.length) return "";
        const k = _(v[0].x, v[0].y), I = [`M ${k.x.toFixed(2)} ${k.y.toFixed(2)}`];
        for (let R = 1; R < v.length; R++) {
          const P = _(v[R].x, v[R].y);
          I.push(`L ${P.x.toFixed(2)} ${P.y.toFixed(2)}`);
        }
        return I.push("Z"), I.join(" ");
      }).join(" ");
      return d.trim() ? `<path d="${d}" fill-rule="evenodd" fill="${m}" fill-opacity="1" />` : "";
    }
    return "";
  }, f = [];
  for (const i of u.ops) {
    const m = i.polarity === "clear" ? "black" : "white", d = y(i, m);
    d && f.push(d);
  }
  const p = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${a}" viewBox="0 0 ${r} ${a}">
  <defs>
    <mask id="${p}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${r}" height="${a}" fill="${b}" fill-opacity="1" />
      ${f.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${r}" height="${a}" fill="${e}" opacity="${s}" mask="url(#${p})" />
</svg>`.trim();
}
function Ie(u, t) {
  const e = t.maxX - t.minX, s = t.maxY - t.minY, o = Math.max(1, Math.round(Lt(e))), n = Math.max(1, Math.round(Lt(s))), r = Math.max(1e-6, Lt(1)), a = "rgba(255,255,255,0.95)", h = "rgba(255,255,255,0.95)", g = u.tracks.map((y) => {
    const f = Kt(y.start.x, y.start.y, t), p = Kt(y.end.x, y.end.y, t), i = Number.isFinite(y.width) ? y.width : 0.15, m = Math.max(1, i * r);
    return `<line x1="${(f.x * r).toFixed(2)}" y1="${(f.y * r).toFixed(2)}" x2="${(p.x * r).toFixed(2)}" y2="${(p.y * r).toFixed(2)}" stroke="${a}" stroke-width="${m.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = u.flashes.map((y) => {
    const f = Kt(y.position.x, y.position.y, t), p = f.x * r, i = f.y * r, m = y.widthMm ?? y.diameterMm ?? 0.6, d = y.heightMm ?? y.diameterMm ?? 0.6;
    if (y.shape === "R" || y.shape === "O") {
      const k = m * r, I = d * r, R = p - k / 2, P = i - I / 2, O = y.shape === "O" ? Math.min(k, I) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${P.toFixed(2)}" width="${k.toFixed(2)}" height="${I.toFixed(2)}" rx="${O.toFixed(2)}" fill="${h}" />`;
    }
    const v = (y.diameterMm ?? 0.6) * r / 2;
    return `<circle cx="${p.toFixed(2)}" cy="${i.toFixed(2)}" r="${Math.max(1, v).toFixed(2)}" fill="${h}" />`;
  }), _ = u.regions.map((y) => {
    const f = y.loops.map((p) => {
      if (!p.length) return "";
      const i = Kt(p[0].x, p[0].y, t), m = [`M ${(i.x * r).toFixed(2)} ${(i.y * r).toFixed(2)}`];
      for (let d = 1; d < p.length; d++) {
        const v = Kt(p[d].x, p[d].y, t);
        m.push(`L ${(v.x * r).toFixed(2)} ${(v.y * r).toFixed(2)}`);
      }
      return m.push("Z"), m.join(" ");
    }).join(" ");
    return f.trim() ? `<path d="${f}" fill="${h}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${n}" viewBox="0 0 ${o} ${n}">
  ${g.join(`
  `)}
  ${b.join(`
  `)}
  ${_.join(`
  `)}
</svg>`.trim();
}
function yr(u, t, e) {
  const s = e.maxX - e.minX, o = e.maxY - e.minY, n = Math.round(Lt(s)), r = Math.round(Lt(o)), a = Lt(1), h = u.map((b) => {
    const _ = Kt(b.x, b.y, e), y = _.x * a, f = _.y * a, p = Math.max(1.5, (b.diameter || 0.6) * a / 2);
    return `<circle cx="${y.toFixed(2)}" cy="${f.toFixed(2)}" r="${(p + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${y.toFixed(2)}" cy="${f.toFixed(2)}" r="${p.toFixed(2)}" fill="#111111" />`;
  }), g = t.map((b) => {
    const _ = Kt(b.x1, b.y1, e), y = Kt(b.x2, b.y2, e), f = (_.x * a).toFixed(2), p = (_.y * a).toFixed(2), i = (y.x * a).toFixed(2), m = (y.y * a).toFixed(2), d = Math.max(3, (b.diameter || 0.6) * a);
    return `<line x1="${f}" y1="${p}" x2="${i}" y2="${m}" stroke="#c97c2a" stroke-width="${(d + 4).toFixed(2)}" stroke-linecap="round" /><line x1="${f}" y1="${p}" x2="${i}" y2="${m}" stroke="#111111" stroke-width="${d.toFixed(2)}" stroke-linecap="round" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 ${n} ${r}">
  ${h.join(`
  `)}
  ${g.join(`
  `)}
</svg>`.trim();
}
async function se(u) {
  const t = Object.keys(u).filter((et) => !!et), e = nr(t), s = e.copper.find((et) => et.role === "top"), o = e.copper.find((et) => et.role === "bottom"), n = e.copper.filter((et) => et.role === "inner"), r = {
    top_copper: s?.path,
    bottom_copper: o?.path,
    inner_copper: n.length ? n.map((et) => et.path) : void 0,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    outline: e.outline,
    drills: e.drills
  }, a = new TextDecoder("utf-8", { fatal: !1 }), h = async (et) => {
    if (!et) return null;
    const vt = u[et];
    if (!vt) return null;
    const Tt = a.decode(vt);
    return Tt.charCodeAt(0) === 65279 ? Tt.slice(1) : Tt;
  }, g = await h(r.top_copper), b = await h(r.bottom_copper), _ = await h(r.outline), y = r.drills?.length ? await Promise.all(r.drills.map((et) => h(et))) : [], f = await h(r.top_silk), p = await h(r.bottom_silk), i = r.inner_copper?.length ? await Promise.all(r.inner_copper.map((et) => h(et))) : [], m = g ? Gt(r.top_copper || "top", g) : null, d = b ? Gt(r.bottom_copper || "bot", b) : null, v = _ ? Gt(r.outline || "outline", _) : null, k = [], I = [];
  if (r.drills)
    for (let et = 0; et < r.drills.length; et++) {
      const vt = y[et];
      if (vt) {
        const Tt = ar(r.drills[et], vt);
        for (const Yt of Tt.holes) k.push({ x: Yt.x, y: Yt.y, diameter: Yt.diameter });
        for (const Yt of Tt.slots) I.push(Yt);
      }
    }
  const R = await h(r.top_mask), P = await h(r.bottom_mask), O = await h(e.top_paste), U = await h(e.bottom_paste), A = f ? Gt(r.top_silk || "top_silk", f) : null, $ = p ? Gt(r.bottom_silk || "bot_silk", p) : null, V = R ? Gt(r.top_mask || "top_mask", R) : null, S = P ? Gt(r.bottom_mask || "bot_mask", P) : null, L = O ? Gt(e.top_paste || "top_paste", O) : null, c = U ? Gt(e.bottom_paste || "bot_paste", U) : null, N = i.map(
    (et, vt) => et ? Gt(r.inner_copper[vt], et) : null
  );
  if (!!!(m || d || v || A || $ || V || S || L || c || k.length || I.length || N.some(Boolean)))
    throw new St(
      "MISSING_LAYERS",
      "No recognizable Gerber or drill layers were found in the bundle.",
      { files: t }
    );
  const X = m ? Ft($t(m)) : null, rt = d ? Ft($t(d)) : null, Y = v ? Ft($t(v)) : null, it = k.length || I.length ? Ft(hr(k, I)) : null, B = A ? Ft($t(A)) : null, T = $ ? Ft($t($)) : null, st = V ? Ft($t(V)) : null, Q = S ? Ft($t(S)) : null, H = L ? Ft($t(L)) : null, ft = c ? Ft($t(c)) : null, wt = (Y && ie(Y) ? Y : null) || (X && ie(X) ? X : null) || (rt && ie(rt) ? rt : null) || (it && ie(it) ? it : null), ct = wt ? wt.maxX - wt.minX : 1, ut = X ? Xt(X.maxX - X.minX, ct) : 1, bt = rt ? Xt(rt.maxX - rt.minX, ct) : 1, pt = Y ? Xt(Y.maxX - Y.minX, ct) : 1, Rt = it ? Xt(it.maxX - it.minX, ct) : 1, Et = B ? Xt(B.maxX - B.minX, ct) : 1, l = T ? Xt(T.maxX - T.minX, ct) : 1, D = st ? Xt(st.maxX - st.minX, ct) : 1, F = Q ? Xt(Q.maxX - Q.minX, ct) : 1, w = H ? Xt(H.maxX - H.minX, ct) : 1, x = ft ? Xt(ft.maxX - ft.minX, ct) : 1, j = N.map((et) => et ? Ft($t(et)) : null).map((et) => et ? Xt(et.maxX - et.minX, ct) : 1), W = m ? Zt(m, ut) : null, C = d ? Zt(d, bt) : null, G = v ? Zt(v, pt) : null, tt = k.length ? cr(k, Rt) : [], q = I.length ? dr(I, Rt) : [], nt = A ? Zt(A, Et) : null, ht = $ ? Zt($, l) : null, dt = V ? Zt(V, D) : null, At = S ? Zt(S, F) : null, jt = L ? Zt(L, w) : null, Ct = c ? Zt(c, x) : null, zt = N.map(
    (et, vt) => et ? Zt(et, j[vt]) : null
  );
  let mt = null;
  if (G) {
    const et = Ft($t(G));
    ie(et) && (mt = et);
  }
  if (!mt) {
    let et = ye();
    W && (et = Se(et, $t(W))), C && (et = Se(et, $t(C))), et = Ft(et), mt = et;
  }
  const gt = Ft(mt), Ht = gt.maxX - gt.minX, Ot = gt.maxY - gt.minY;
  let Qt;
  if (G) {
    const et = [];
    for (const vt of G.regions)
      for (const Tt of vt.loops)
        Tt.length >= 3 && et.push(Tt);
    if (et.length === 0 && G.tracks.length)
      for (const vt of Fe(G.tracks))
        vt.length >= 3 && et.push(vt);
    et.length > 0 && (Qt = et);
  }
  const M = {
    board: {
      width_in: Ht / 25.4,
      height_in: Ot / 25.4,
      mm_bounds: {
        min_x_mm: gt.minX,
        min_y_mm: gt.minY,
        max_x_mm: gt.maxX,
        max_y_mm: gt.maxY
      }
    },
    outline_loops_mm: Qt,
    layer_count: e.copper.length
  }, z = Math.max(1, Math.round(Lt(Ht))), Z = Math.max(1, Math.round(Lt(Ot))), K = {}, J = (et, vt) => (K[et] = vt, et), lt = G ? mr(G, gt) : Oe(z, Z), ot = J("board_mask", lt), yt = W ? J("cu.top", ee(W, gt, "#fbbf24", 1)) : void 0, _t = C ? J("cu.bottom", ee(C, gt, "#38bdf8", 1)) : void 0, Mt = dt ? J("top:mask", ee(dt, gt, "#fbbf24", 0.9)) : void 0, kt = At ? J("bottom:mask", ee(At, gt, "#38bdf8", 0.9)) : void 0, Dt = tt.length || q.length ? J("drills", yr(tt, q, gt)) : void 0, Wt = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"], Pt = [];
  for (let et = 0; et < zt.length; et++) {
    const vt = zt[et];
    if (vt) {
      const Tt = n[et]?.detectedNum ?? et + 1;
      Pt.push(J(`cu.in${Tt}`, ee(vt, gt, Wt[et % Wt.length], 1)));
    } else
      Pt.push("");
  }
  const It = nt ? J("top:silk", Ie(nt, gt)) : void 0, Nt = ht ? J("bottom:silk", Ie(ht, gt)) : void 0, Ut = jt ? J("top:paste", ee(jt, gt, "#cbd5e1", 0.85)) : void 0, _e = Ct ? J("bottom:paste", ee(Ct, gt, "#cbd5e1", 0.85)) : void 0, be = [];
  for (const et of e.copper) {
    let vt, Tt, Yt, ae;
    if (et.role === "top")
      vt = yt, Tt = "#fbbf24", Yt = "Top", ae = "cu.top";
    else if (et.role === "bottom")
      vt = _t, Tt = "#38bdf8", Yt = "Bottom", ae = "cu.bottom";
    else {
      const he = n.indexOf(et);
      vt = Pt[he] || void 0, Tt = Wt[he % Wt.length];
      const ve = et.detectedNum ?? he + 1;
      Yt = `Inner ${ve}`, ae = `cu.in${ve}`;
    }
    vt && be.push({ id: ae, index: et.index, role: et.role, name: Yt, color: Tt, svgId: vt });
  }
  return {
    boardGeom: M,
    bounds: gt,
    wPx: z,
    hPx: Z,
    svgById: K,
    boardMaskId: ot,
    copper: be,
    top: Mt || It || Ut ? { maskId: Mt, silkId: It, pasteId: Ut } : void 0,
    bottom: kt || Nt || _e ? { maskId: kt, silkId: Nt, pasteId: _e } : void 0,
    drillsId: Dt,
    viasId: void 0
  };
}
async function Le(u) {
  const t = await se(u), e = [], s = /* @__PURE__ */ new Map();
  for (const [y, f] of Object.entries(t.svgById)) {
    const p = ur(f);
    s.set(y, p), e.push(p);
  }
  const o = (y) => y ? s.get(y) : void 0, n = o(t.boardMaskId), r = {
    top_board_mask: n,
    bottom_board_mask: n
  }, a = t.copper.find((y) => y.role === "top"), h = t.copper.find((y) => y.role === "bottom"), g = t.copper.filter((y) => y.role === "inner");
  a && (r.top_copper = o(a.svgId)), h && (r.bottom_copper = o(h.svgId)), g.length && (r.inner_copper = g.map((y) => o(y.svgId)).filter(Boolean)), t.top?.maskId && (r.top_mask = o(t.top.maskId)), t.bottom?.maskId && (r.bottom_mask = o(t.bottom.maskId)), t.top?.silkId && (r.top_silk = o(t.top.silkId)), t.bottom?.silkId && (r.bottom_silk = o(t.bottom.silkId)), t.top?.pasteId && (r.top_paste = o(t.top.pasteId)), t.bottom?.pasteId && (r.bottom_paste = o(t.bottom.pasteId)), t.drillsId && (r.drills = o(t.drillsId));
  const _ = {
    copper: t.copper.map((y) => ({
      id: y.id,
      index: y.index,
      role: y.role,
      name: y.name,
      color: y.color,
      url: o(y.svgId)
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
    revoke: () => e.forEach((y) => URL.revokeObjectURL(y))
  };
}
async function Zr(u) {
  const t = u instanceof Uint8Array ? u.byteOffset === 0 && u.byteLength === u.buffer.byteLength ? u.buffer : u.slice().buffer : u instanceof ArrayBuffer ? u : await u.arrayBuffer(), { files: e, archiveType: s } = await ue(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (s !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${s}`);
  return await Le(e);
}
async function Vr(u, t) {
  const { files: e } = await ue(u, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await Le(e);
}
const Re = (u) => `data:image/svg+xml;utf8,${encodeURIComponent(u)}`;
function oe(u, t = {}) {
  const {
    side: e = "top",
    revealed: s = [],
    includeFR4: o = !0,
    background: n = "#1a5f1a",
    clipToBoard: r = !0,
    outerCopper: a = !0,
    sideMask: h = !0,
    sideSilk: g = !0,
    sidePaste: b = !0,
    drills: _ = !0
  } = t, { wPx: y, hPx: f, svgById: p } = u, i = (R) => {
    if (!R) return "";
    const P = p[R];
    return P ? `<image xlink:href="${Re(P)}" x="0" y="0" width="${y}" height="${f}" preserveAspectRatio="none"/>` : "";
  }, m = [];
  o && m.push(`<rect x="0" y="0" width="${y}" height="${f}" fill="${n}"/>`);
  const d = u.copper.find((R) => R.role === (e === "top" ? "top" : "bottom"));
  d && a && m.push(i(d.svgId));
  const v = e === "top" ? u.top : u.bottom;
  v?.maskId && h && m.push(i(v.maskId));
  for (const R of u.copper)
    R.id !== d?.id && s.includes(R.id) && m.push(i(R.svgId));
  v?.silkId && g && m.push(i(v.silkId)), v?.pasteId && b && m.push(i(v.pasteId)), u.drillsId && _ && m.push(i(u.drillsId));
  const k = m.filter(Boolean).join(`
    `);
  let I = k;
  return r && u.boardMaskId && p[u.boardMaskId] && (I = `<defs><mask id="__board" maskUnits="userSpaceOnUse" style="mask-type:luminance"><image xlink:href="${Re(p[u.boardMaskId])}" x="0" y="0" width="${y}" height="${f}" preserveAspectRatio="none"/></mask></defs>
    <g mask="url(#__board)">
    ${k}
    </g>`), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${y}" height="${f}" viewBox="0 0 ${y} ${f}">
    ${I}
</svg>`;
}
async function Ne(u) {
  if (u instanceof ArrayBuffer || u instanceof Uint8Array) {
    const { files: t } = await ue(u);
    return t;
  }
  return u;
}
async function qr(u, t = {}) {
  const e = await Ne(u), s = await se(e);
  return oe(s, t);
}
function _r(u) {
  return new Promise((t, e) => {
    const s = new Image();
    s.onload = () => t(s), s.onerror = () => e(new Error("Failed to load composed SVG for rasterization")), s.src = u;
  });
}
const br = async (u, { width: t, height: e, scale: s }) => {
  if (typeof document > "u" || typeof URL > "u" || !URL.createObjectURL)
    throw new Error(
      "renderGerbersToImage requires a rasterizer backend outside the browser (e.g. resvg-js). Pass opts.rasterizer."
    );
  const o = URL.createObjectURL(new Blob([u], { type: "image/svg+xml" }));
  try {
    const n = await _r(o), r = document.createElement("canvas");
    r.width = Math.max(1, Math.round(t * s)), r.height = Math.max(1, Math.round(e * s));
    const a = r.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context for rasterization");
    a.drawImage(n, 0, 0, r.width, r.height);
    const h = await new Promise((g) => r.toBlob(g, "image/png"));
    if (!h) throw new Error("canvas.toBlob returned null");
    return new Uint8Array(await h.arrayBuffer());
  } finally {
    URL.revokeObjectURL(o);
  }
};
async function Hr(u, t = {}) {
  const e = await Ne(u), s = await se(e), o = oe(s, t);
  return (t.rasterizer ?? br)(o, { width: s.wPx, height: s.hPx, scale: t.scale ?? 1 });
}
function vr(u, t, e = 0.01) {
  const s = {
    min_x_mm: Math.min(u.min_x_mm, t.min_x_mm),
    min_y_mm: Math.min(u.min_y_mm, t.min_y_mm),
    max_x_mm: Math.max(u.max_x_mm, t.max_x_mm),
    max_y_mm: Math.max(u.max_y_mm, t.max_y_mm)
  }, o = u.max_x_mm - u.min_x_mm, n = u.max_y_mm - u.min_y_mm, r = t.max_x_mm - t.min_x_mm, a = t.max_y_mm - t.min_y_mm, h = Math.abs(o - r) > e || Math.abs(n - a) > e;
  return { union: s, boardSizeChanged: h };
}
const ne = 1e3 / 25.4;
async function Ae(u) {
  return u instanceof ArrayBuffer || u instanceof Uint8Array ? (await ue(u)).files : u;
}
function xr(u) {
  return new Promise((t, e) => {
    const s = new Image();
    s.onload = () => t(s), s.onerror = () => e(new Error("Failed to load composed SVG for diff")), s.src = u;
  });
}
async function Kr(u, t, e = {}) {
  if (typeof document > "u")
    throw new Error("diffGerbers requires a browser environment (canvas).");
  const s = e.alphaThreshold ?? 24, [o, n] = await Promise.all([Ae(u), Ae(t)]), [r, a] = await Promise.all([se(o), se(n)]), { union: h, boardSizeChanged: g } = vr(
    { min_x_mm: r.bounds.minX, min_y_mm: r.bounds.minY, max_x_mm: r.bounds.maxX, max_y_mm: r.bounds.maxY },
    { min_x_mm: a.bounds.minX, min_y_mm: a.bounds.minY, max_x_mm: a.bounds.maxX, max_y_mm: a.bounds.maxY }
  ), b = h.max_x_mm - h.min_x_mm, _ = h.max_y_mm - h.min_y_mm, y = Math.max(1, Math.round(b * ne)), f = Math.max(1, Math.round(_ * ne)), p = [], i = async (P, O) => {
    if (!P.copper.some(($) => $.role === (O === "top" ? "top" : "bottom"))) return null;
    const U = oe(P, { side: O, includeFR4: !1, clipToBoard: !0 }), A = URL.createObjectURL(new Blob([U], { type: "image/svg+xml" }));
    try {
      const $ = await xr(A), V = document.createElement("canvas");
      V.width = y, V.height = f;
      const S = V.getContext("2d");
      if (!S) return null;
      const L = Math.round((P.bounds.minX - h.min_x_mm) * ne), c = Math.round((h.max_y_mm - P.bounds.maxY) * ne);
      return S.drawImage($, L, c, P.wPx, P.hPx), S.getImageData(0, 0, y, f);
    } finally {
      URL.revokeObjectURL(A);
    }
  }, m = async (P) => {
    const [O, U] = await Promise.all([i(r, P), i(a, P)]);
    if (!O && !U) return;
    const A = document.createElement("canvas");
    A.width = y, A.height = f;
    const $ = A.getContext("2d");
    if (!$) return;
    const V = $.createImageData(y, f);
    let S = 0, L = 0;
    const c = O?.data, N = U?.data;
    for (let rt = 0; rt < V.data.length; rt += 4) {
      const Y = c ? c[rt + 3] > s : !1, it = N ? N[rt + 3] > s : !1;
      Y && it ? (V.data[rt] = 148, V.data[rt + 1] = 163, V.data[rt + 2] = 184, V.data[rt + 3] = 70) : it ? (V.data[rt] = 34, V.data[rt + 1] = 197, V.data[rt + 2] = 94, V.data[rt + 3] = 235, S++) : Y && (V.data[rt] = 239, V.data[rt + 1] = 68, V.data[rt + 2] = 68, V.data[rt + 3] = 235, L++);
    }
    $.putImageData(V, 0, 0);
    const at = await new Promise(
      (rt) => A.toBlob((Y) => rt(Y ? URL.createObjectURL(Y) : ""), "image/png")
    );
    at && p.push(at);
    const X = 1 / (ne * ne);
    return {
      url: at,
      addedPx: S,
      removedPx: L,
      addedArea_mm2: S * X,
      removedArea_mm2: L * X
    };
  }, d = await m("top"), v = await m("bottom"), k = {
    board: {
      width_in: b / 25.4,
      height_in: _ / 25.4,
      mm_bounds: h
    },
    layer_count: Math.max(r.copper.length, a.copper.length)
  }, I = (d?.addedArea_mm2 ?? 0) + (v?.addedArea_mm2 ?? 0), R = (d?.removedArea_mm2 ?? 0) + (v?.removedArea_mm2 ?? 0);
  return {
    top: d,
    bottom: v,
    boardGeom: k,
    summary: { boardSizeChanged: g, addedArea_mm2: I, removedArea_mm2: R },
    revoke: () => p.forEach((P) => URL.revokeObjectURL(P))
  };
}
function wr(u) {
  const t = new TextEncoder().encode(u);
  let e = "";
  for (const o of t) e += String.fromCharCode(o);
  return (typeof btoa < "u" ? btoa(e) : Buffer.from(e, "binary").toString("base64")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function kr(u) {
  const t = u.replace(/-/g, "+").replace(/_/g, "/"), e = typeof atob < "u" ? atob(t) : Buffer.from(t, "base64").toString("binary"), s = Uint8Array.from(e, (o) => o.charCodeAt(0));
  return new TextDecoder().decode(s);
}
function Sr(u) {
  return wr(JSON.stringify(u));
}
function Mr(u) {
  try {
    const t = JSON.parse(kr(u)), e = (s) => typeof s == "number" && Number.isFinite(s);
    return t && t.v === 1 && (t.side === "top" || t.side === "bottom") && t.cam && e(t.cam.x) && e(t.cam.y) && e(t.cam.zoom) && (t.cam.rot === void 0 || e(t.cam.rot)) ? t : null;
  } catch {
    return null;
  }
}
function ge(u, t) {
  const [
    e,
    s,
    o,
    n,
    r,
    a,
    h,
    g,
    b
  ] = u, [
    _,
    y,
    f,
    p,
    i,
    m,
    d,
    v,
    k
  ] = t;
  return [
    e * _ + s * p + o * d,
    e * y + s * i + o * v,
    e * f + s * m + o * k,
    n * _ + r * p + a * d,
    n * y + r * i + a * v,
    n * f + r * m + a * k,
    h * _ + g * p + b * d,
    h * y + g * i + b * v,
    h * f + g * m + b * k
  ];
}
function Ee(u, t) {
  return [1, 0, u, 0, 1, t, 0, 0, 1];
}
function Ir(u, t) {
  return [u, 0, 0, 0, t, 0, 0, 0, 1];
}
function Rr(u) {
  const t = Math.cos(u), e = Math.sin(u);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function Ce(u, t) {
  const e = u[0] * t.x + u[1] * t.y + u[2], s = u[3] * t.x + u[4] * t.y + u[5], o = u[6] * t.x + u[7] * t.y + u[8];
  if (o === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / o, y: s / o };
}
function Ar(u) {
  const t = u[0], e = u[1], s = u[2], o = u[3], n = u[4], r = u[5], a = t * n - e * o;
  if (Math.abs(a) < 1e-12) throw new Error("Non-invertible transform");
  const h = 1 / a, g = n * h, b = -e * h, _ = -o * h, y = t * h, f = -(g * s + b * r), p = -(_ * s + y * r);
  return [g, b, f, _, y, p, 0, 0, 1];
}
class Er {
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
      return Ce(this.worldToScreenMat, e);
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
      return Ce(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: s, zoom: o, rotation_rad: n, mirrorX: r, mirrorY: a } = this.camera, h = { x: t / 2, y: e / 2 }, g = a ? -1 : 1, b = r ? -1 : 1, _ = Ee(-s.x, -s.y), y = Rr(n), f = Ir(o * b, o * g), p = Ee(h.x, h.y), i = ge(p, ge(f, ge(y, _)));
    this.worldToScreenMat = i, this.screenToWorldMat = Ar(i);
  }
}
class Cr {
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
let zr = class {
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
    const s = this.overlays.get(t);
    s && s.visible !== e && (s.visible = e);
  }
  setZIndex(t, e) {
    const s = this.overlays.get(t);
    s && s.zIndex !== e && (s.zIndex = e, this.dirty = !0);
  }
  list() {
    return Array.from(this.overlays.values());
  }
  getSortedVisible() {
    return this.dirty && (this.sortedCache = Array.from(this.overlays.values()).sort((t, e) => t.zIndex - e.zIndex), this.dirty = !1), this.sortedCache.filter((t) => t.visible);
  }
};
class Tr {
  constructor(t) {
    this.cells = /* @__PURE__ */ new Map(), this.cellSize_mm = t;
  }
  cellCoord(t, e) {
    const s = Math.floor(t / this.cellSize_mm), o = Math.floor(e / this.cellSize_mm);
    return { cx: s, cy: o, key: `${s},${o}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, s) {
    const { key: o } = this.cellCoord(e, s);
    let n = this.cells.get(o);
    n || (n = /* @__PURE__ */ new Set(), this.cells.set(o, n)), n.add(t);
  }
  remove(t, e, s) {
    const { key: o } = this.cellCoord(e, s), n = this.cells.get(o);
    n && (n.delete(t), n.size === 0 && this.cells.delete(o));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, s) {
    const { cx: o, cy: n } = this.cellCoord(t, e), r = Math.ceil(s / this.cellSize_mm), a = [];
    for (let h = -r; h <= r; h++)
      for (let g = -r; g <= r; g++) {
        const b = `${o + h},${n + g}`, _ = this.cells.get(b);
        if (_)
          for (const y of _) a.push(y);
      }
    return a;
  }
}
class Pr {
  constructor() {
    this.byId = /* @__PURE__ */ new Map(), this.index = new Tr(5), this.dirtyList = !0, this.listCache = [];
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
      const s = this.byId.get(e.id);
      if (!s) continue;
      const o = { ...s, ...e };
      (o.x_mm !== s.x_mm || o.y_mm !== s.y_mm) && (this.index.remove(s.id, s.x_mm, s.y_mm), this.index.insert(s.id, o.x_mm, o.y_mm)), this.byId.set(s.id, o), this.dirtyList = !0;
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
  queryNear(t, e, s) {
    const o = this.index.queryRadius(t, e, s), n = [];
    for (const r of o) {
      const a = this.byId.get(r);
      a && n.push(a);
    }
    return n;
  }
}
class Br {
  constructor(t) {
    this.store = t;
  }
  pick(t, e, s, o = 10) {
    const n = t.screenToBoard({ x: e, y: s }), r = t.xform.getCamera().zoom, a = o / r, h = this.store.queryNear(n.x, n.y, a);
    let g = null;
    for (const b of h) {
      const _ = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), y = _.x - e, f = _.y - s, p = Math.sqrt(y * y + f * f);
      p <= o && (!g || p < g.distance_px) && (g = { id: b.id, marker: b, distance_px: p });
    }
    return g;
  }
}
class Or {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    let s = this.handlers.get(t);
    return s || (s = /* @__PURE__ */ new Set(), this.handlers.set(t, s)), s.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const s = this.on(t, (o) => {
      s(), e(o);
    });
    return s;
  }
  off(t, e) {
    const s = this.handlers.get(t);
    s && (s.delete(e), s.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const s = this.handlers.get(t);
    if (!s || s.size === 0) return;
    const o = Array.from(s);
    for (const n of o) n(e);
  }
  clear() {
    this.handlers.clear();
  }
}
class Fr {
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
class Lr {
  constructor(t, e) {
    this.passes = [], this.overlays = new zr(), this.resizeObserver = null, this.boardBounds = { minX_mm: 0, minY_mm: 0, maxX_mm: 100, maxY_mm: 100 }, this.markers = new Pr(), this.markerPicker = new Br(this.markers), this.selectedMarkerId = null, this.hoverMarkerId = null, this.events = new Or(), this.on = this.events.on.bind(this.events), this.once = this.events.once.bind(this.events), this.off = this.events.off.bind(this.events), this.canvas = t;
    const s = t.getContext("2d");
    if (!s) throw new Error("Unable to get 2D context");
    this.ctx = s;
    const o = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new Er(e, o), this.visibility = new Fr(), this.scheduler = new Cr(() => this.render()), this.overlayApi = {
      boardToScreen: ({ x_mm: n, y_mm: r }) => {
        const a = this.xform.boardToScreen({ x: n, y: r });
        return { x_px: a.x, y_px: a.y };
      },
      screenToBoard: ({ x_px: n, y_px: r }) => {
        const a = this.xform.screenToBoard({ x: n, y: r });
        return { x_mm: a.x, y_mm: a.y };
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
    this.passes.push(t), this.passes.sort((e, s) => e.order - s.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((s) => s.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, s = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(s);
    const o = {
      canvas: e,
      ctx: t,
      viewport: s,
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
      if (n.enabled(o)) {
        t.save();
        try {
          n.draw(o);
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
  pickMarker(t, e, s = 10) {
    const o = this.createRenderCtx();
    return this.markerPicker.pick(o, t, e, s);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const s = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: s }), e?.center;
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
    const { x_px: e, y_px: s } = this.eventToCanvasPx(t), o = this.createRenderCtx(), n = this.markerPicker.pick(o, e, s, 10);
    this.setHoverMarker(n?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: s } = this.eventToCanvasPx(t), o = this.createRenderCtx(), n = this.markerPicker.pick(o, e, s, 10);
    if (n) {
      this.selectMarker(n.id);
      return;
    }
    const r = o.screenToBoard({ x: e, y: s });
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
function Nr(u, t) {
  return {
    x_mm: u.x_mm,
    y_mm: t.minY_mm + t.maxY_mm - u.y_mm
  };
}
function $r(u, t) {
  return u.x_mm < t.minX_mm || u.x_mm > t.maxX_mm || u.y_mm < t.minY_mm || u.y_mm > t.maxY_mm;
}
const Jt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function Qr(u, t, e, s) {
  return {
    id: `gerber:${u}`,
    order: t,
    enabled: (o) => o.visibility.gerber[e],
    draw: (o) => {
      const n = o.ctx, r = o.xform.getWorldToScreenMatrix();
      n.setTransform(r[0], r[3], r[1], r[4], r[2], r[5]), s(n);
    }
  };
}
class Dr {
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
    const s = this.overlays.get(t);
    s && (s.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Ur(u, t) {
  return {
    id: "overlay:all",
    order: (Jt.OVERLAYS_MIN + Jt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const o = u.getAll().filter((r) => e.visibility.overlays[r.id] ?? r.visible);
      o.sort((r, a) => r.zIndex - a.zIndex);
      const n = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const r of o)
        e.ctx.save(), r.draw(e.ctx, n), e.ctx.restore();
    }
  };
}
let jr = class {
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
    const e = t.ctx, s = t.xform.getCamera().zoom;
    if (!(s < 2)) {
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
        const r = t.boardToScreen(n.position);
        r.x < -10 || r.x > t.viewport.width_px + 10 || r.y < -10 || r.y > t.viewport.height_px + 10 || this.drawMarker(e, r, n, s);
      }
    }
  }
  drawMarker(t, e, s, o) {
    const n = Math.max(3, Math.min(8, o / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, n, 0, Math.PI * 2), s.type) {
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
function Xr(u) {
  return {
    id: "markers",
    order: (Jt.MARKERS_MIN + Jt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => u.draw(t)
  };
}
class Wr {
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
    const s = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(s, t, e.id);
        break;
      case "geometry":
        break;
      case "region":
        this.drawRegionSelection(s, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, s) {
    if (!s || !this.getMarkerPosition) return;
    const o = this.getMarkerPosition(s);
    if (!o) return;
    const n = e.boardToScreen(o);
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.beginPath(), t.arc(n.x, n.y, 12, 0, Math.PI * 2), t.stroke();
  }
  drawRegionSelection(t, e, s) {
    if (!s) return;
    const o = e.xform.getWorldToScreenMatrix();
    t.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      s.min.x,
      s.min.y,
      s.max.x - s.min.x,
      s.max.y - s.min.y
    );
  }
}
function Yr(u, t) {
  return {
    id: "selection",
    order: (Jt.SELECTION_MIN + Jt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const s = t();
      s && u.draw(e, s);
    }
  };
}
function en(u, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, s = t.showDownloadButton !== !1;
  u.innerHTML = `
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
            <button class="btn" id="share-btn" type="button" title="Copy shareable link">Share</button>${s ? `
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
  const o = u.firstElementChild, n = w(o, "#board-viewport"), r = w(o, "#render-canvas"), a = w(o, "#grid-toggle"), h = w(o, "#grid-units"), g = w(o, "#fit-btn"), b = w(o, "#share-btn"), _ = s ? w(o, "#download-btn") : null, y = Array.from(o.querySelectorAll('input[name="side"]')), f = w(o, "#layer-menu-btn"), p = w(o, "#layer-panel"), i = w(o, "#export-menu-btn"), m = w(o, "#export-panel"), d = new Lr(r, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), v = d.getVisibilityManager();
  v.subscribe(() => {
    d.requestRender("visibility-change");
  });
  const k = new Dr(), I = new jr(), R = new Wr((M) => I.get(M)?.position);
  let P = null;
  function O() {
    const M = n.getBoundingClientRect();
    r.width = Math.max(1, Math.round(M.width)), r.height = Math.max(1, Math.round(M.height)), r.style.width = `${M.width}px`, r.style.height = `${M.height}px`, d.requestRender("resize");
  }
  const U = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (M, z) => {
      const K = z.view.zoom, J = h.value, lt = J === "mm" ? 1 : 2.54, ot = J === "mm" ? 10 : 25.4, yt = lt * K, _t = ot * K;
      if (yt < 2) return;
      const Mt = z.screenToBoard({ x: 0, y: 0 }), kt = z.screenToBoard({ x: r.width, y: r.height });
      M.setTransform(1, 0, 0, 1, 0, 0), M.strokeStyle = "rgba(59, 130, 246, 0.4)", M.lineWidth = 1, M.beginPath();
      const Dt = Math.floor(Mt.x / lt) * lt, Wt = Math.floor(Mt.y / lt) * lt;
      for (let Pt = Dt; Pt <= kt.x; Pt += lt) {
        const It = z.boardToScreen({ x: Pt, y: 0 }).x;
        M.moveTo(It, 0), M.lineTo(It, r.height);
      }
      for (let Pt = Wt; Pt <= kt.y; Pt += lt) {
        const It = z.boardToScreen({ x: 0, y: Pt }).y;
        M.moveTo(0, It), M.lineTo(r.width, It);
      }
      if (M.stroke(), _t >= 8) {
        M.strokeStyle = "rgba(59, 130, 246, 0.7)", M.lineWidth = 1.5, M.beginPath();
        const Pt = Math.floor(Mt.x / ot) * ot, It = Math.floor(Mt.y / ot) * ot;
        for (let Nt = Pt; Nt <= kt.x; Nt += ot) {
          const Ut = z.boardToScreen({ x: Nt, y: 0 }).x;
          M.moveTo(Ut, 0), M.lineTo(Ut, r.height);
        }
        for (let Nt = It; Nt <= kt.y; Nt += ot) {
          const Ut = z.boardToScreen({ x: 0, y: Nt }).y;
          M.moveTo(0, Ut), M.lineTo(r.width, Ut);
        }
        M.stroke();
      }
    }
  };
  k.add(U), v.setOverlayVisibility("grid", !1), v.setMarkersVisibility(!1), d.addPass(Ur(k, d.getOverlayApi())), d.addPass(Xr(I)), d.addPass(Yr(R, () => P));
  const A = {}, $ = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:drills": { label: "Drill holes", color: "#111111" },
    "layer:vias": { label: "Vias", color: "#111111" }
  }, V = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  let S = null, L = {}, c = null, N = "top", at = !1, X = [], rt = !1;
  function Y(M, z, Z) {
    if (!Z) return null;
    M in A || (A[M] = !0);
    const K = new Image();
    return K.src = Z, K.addEventListener("load", () => {
      d.requestRender(`image-loaded-${M}`);
    }), {
      id: M,
      order: z,
      enabled: (J) => !!(A[M] ?? !0) && !!S?.board?.mm_bounds,
      draw: (J) => {
        if (!K.complete || !S?.board?.mm_bounds) return;
        const lt = J.ctx, ot = J.xform.getWorldToScreenMatrix();
        lt.setTransform(ot[0], ot[3], ot[1], ot[4], ot[2], ot[5]);
        let yt;
        (L.top_board_mask || L.bottom_board_mask) && (yt = 0.5);
        const _t = B(lt, S, yt);
        Q(lt, _t, (Mt) => {
          if (!S?.board?.mm_bounds) return;
          const kt = S.board.mm_bounds, Dt = kt.max_x_mm - kt.min_x_mm, Wt = kt.max_y_mm - kt.min_y_mm;
          Mt.drawImage(K, kt.min_x_mm, kt.min_y_mm, Dt, Wt);
        });
      }
    };
  }
  function it(M, z) {
    return M in A || (A[M] = !0), {
      id: M,
      order: z,
      enabled: (Z) => !!(A[M] ?? !0) && !!S?.board?.mm_bounds,
      draw: (Z) => {
        if (!S?.board?.mm_bounds) return;
        const K = Z.ctx, J = Z.xform.getWorldToScreenMatrix();
        K.setTransform(J[0], J[3], J[1], J[4], J[2], J[5]);
        const lt = B(K, S, 0.5);
        st(K, lt);
      }
    };
  }
  function B(M, z, Z) {
    if (!z?.board?.mm_bounds) return new Path2D();
    const K = z.board.mm_bounds;
    if (z.outline_loops_mm?.length) {
      const J = new Path2D(), lt = (ot) => K.max_y_mm + K.min_y_mm - ot;
      for (const ot of z.outline_loops_mm)
        if (ot.length) {
          J.moveTo(ot[0].x, lt(ot[0].y));
          for (let yt = 1; yt < ot.length; yt++)
            J.lineTo(ot[yt].x, lt(ot[yt].y));
          J.closePath();
        }
      return J;
    }
    return T(
      K.min_x_mm,
      K.min_y_mm,
      K.max_x_mm - K.min_x_mm,
      K.max_y_mm - K.min_y_mm,
      Z || 0
    );
  }
  function T(M, z, Z, K, J) {
    const lt = new Path2D(), ot = Math.max(0, Math.min(J, Math.min(Z, K) / 2));
    return lt.moveTo(M + ot, z), lt.lineTo(M + Z - ot, z), lt.quadraticCurveTo(M + Z, z, M + Z, z + ot), lt.lineTo(M + Z, z + K - ot), lt.quadraticCurveTo(M + Z, z + K, M + Z - ot, z + K), lt.lineTo(M + ot, z + K), lt.quadraticCurveTo(M, z + K, M, z + K - ot), lt.lineTo(M, z + ot), lt.quadraticCurveTo(M, z, M + ot, z), lt.closePath(), lt;
  }
  function st(M, z) {
    M.save(), M.clip(z), M.fillStyle = "#1a5f1a", M.fill(z), M.strokeStyle = "#0d3d0d", M.lineWidth = 0.1, M.stroke(z), M.restore();
  }
  function Q(M, z, Z) {
    M.save(), M.clip(z), Z(M), M.restore();
  }
  const H = (M) => M.startsWith("cu.in"), ft = (M) => M.charAt(0).toUpperCase() + M.slice(1);
  function wt(M) {
    const z = [];
    return M.top_copper && z.push({ id: "cu.top", index: 0, role: "top", name: "Top", url: M.top_copper, color: "#fbbf24" }), (M.inner_copper ?? []).forEach((Z, K) => {
      z.push({ id: `cu.in${K + 1}`, index: 0, role: "inner", name: `Inner ${K + 1}`, url: Z, color: V[K % V.length] });
    }), M.bottom_copper && z.push({ id: "cu.bottom", index: 0, role: "bottom", name: "Bottom", url: M.bottom_copper, color: "#38bdf8" }), z.forEach((Z, K) => {
      Z.index = K;
    }), {
      copper: z,
      top: { mask: M.top_mask, silk: M.top_silk, paste: M.top_paste },
      bottom: { mask: M.bottom_mask, silk: M.bottom_silk, paste: M.bottom_paste },
      drills: M.drills,
      vias: M.vias
    };
  }
  function ct() {
    if (X.forEach((J) => d.removePass(J)), X = [], !S || !c) return;
    const M = (J, lt, ot, yt) => {
      const _t = !!yt?.fr4;
      if (!_t && !ot) return;
      yt?.meta && ($[J] = yt.meta), J in A || (A[J] = !H(J));
      const Mt = _t ? it(J, lt) : Y(J, lt, ot);
      Mt && (d.addPass(Mt), X.push(J));
    };
    M("layer:fr4", 5, void 0, { fr4: !0 });
    const z = N, Z = c.copper.find((J) => J.role === (z === "top" ? "top" : "bottom"));
    Z && M(Z.id, 10, Z.url, { meta: { label: `${Z.name} copper`, color: Z.color } });
    const K = z === "top" ? c.top : c.bottom;
    K?.mask && M(`${z}:mask`, 15, K.mask, { meta: { label: `${ft(z)} soldermask`, color: z === "top" ? "#fde68a" : "#bae6fd" } }), c.copper.filter((J) => J.role === "inner").forEach((J, lt) => M(J.id, 20 + lt, J.url, { meta: { label: J.name, color: J.color } })), K?.silk && M(`${z}:silk`, 60, K.silk, { meta: { label: `${ft(z)} silkscreen`, color: "#f1f5f9" } }), K?.paste && M(`${z}:paste`, 62, K.paste, { meta: { label: `${ft(z)} paste`, color: "#cbd5e1" } }), M("layer:drills", 70, c.drills), M("layer:vias", 75, c.vias), d.requestRender("side-switch"), setTimeout(() => d.requestRender("side-switch-delayed"), 50), ut();
  }
  function ut() {
    const M = [...X].reverse();
    p.innerHTML = M.map((z) => {
      const Z = $[z] ?? { label: z, color: "#888" }, K = A[z] ?? !0, J = Z.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${z}"><span class="layer-swatch" style="background:${Z.color};${J}"></span><span>${Z.label}</span><input type="checkbox"${K ? " checked" : ""} /></label>`;
    }).join(""), p.querySelectorAll(".layer-item input").forEach((z) => {
      z.addEventListener("change", () => {
        const Z = z.closest("[data-layer-id]")?.dataset.layerId;
        Z && (A[Z] = z.checked, d.requestRender("layer-toggle"));
      });
    });
  }
  function bt(M = 0.08) {
    if (!S?.board?.mm_bounds) return;
    const z = n.getBoundingClientRect(), Z = S.board.mm_bounds, K = Z.max_x_mm - Z.min_x_mm, J = Z.max_y_mm - Z.min_y_mm, lt = z.width * (1 - 2 * M), ot = z.height * (1 - 2 * M), yt = lt / K, _t = ot / J, Mt = Math.min(yt, _t), kt = (Z.min_x_mm + Z.max_x_mm) / 2, Dt = (Z.min_y_mm + Z.max_y_mm) / 2;
    d.setCamera({
      center_mm: { x: kt, y: Dt },
      zoom: Mt
    });
  }
  r.addEventListener("wheel", (M) => {
    M.preventDefault(), at = !0;
    const z = r.getBoundingClientRect(), Z = M.clientX - z.left, K = M.clientY - z.top, J = d.getCamera(), lt = M.deltaY < 0 ? 1.1 : 0.9, ot = Math.max(0.2, Math.min(50, J.zoom * lt)), yt = d.screenToBoard(Z, K);
    d.setCamera({ zoom: ot });
    const _t = d.screenToBoard(Z, K), Mt = yt.x - _t.x, kt = yt.y - _t.y;
    d.setCamera({
      center_mm: {
        x: J.center_mm.x + Mt,
        y: J.center_mm.y + kt
      }
    });
  }, { passive: !1 });
  let pt = !1, Rt = null;
  r.addEventListener("mousedown", (M) => {
    if (M.button !== 0) return;
    M.preventDefault(), at = !0, pt = !0;
    const z = r.getBoundingClientRect();
    Rt = d.screenToBoard(
      M.clientX - z.left,
      M.clientY - z.top
    );
  });
  const Et = (M) => {
    if (!pt || !Rt) return;
    const z = r.getBoundingClientRect(), Z = d.screenToBoard(
      M.clientX - z.left,
      M.clientY - z.top
    ), K = Rt.x - Z.x, J = Rt.y - Z.y, lt = d.getCamera();
    d.setCamera({
      center_mm: {
        x: lt.center_mm.x + K,
        y: lt.center_mm.y + J
      }
    });
  }, l = () => {
    pt = !1, Rt = null;
  };
  window.addEventListener("mousemove", Et), window.addEventListener("mouseup", l), a.addEventListener("change", () => {
    const M = a.checked;
    v.setOverlayVisibility("grid", M), U.visible = M, d.requestRender("grid-toggle");
  }), h.addEventListener("change", () => {
    v.isOverlayVisible("grid") && d.requestRender("grid-units");
  }), g.addEventListener("click", () => bt(0.08)), b.addEventListener("click", async () => {
    await jt();
    const M = b.textContent;
    b.textContent = "Copied!", setTimeout(() => {
      b.textContent = M;
    }, 1200);
  }), _?.addEventListener("click", () => t.onDownload?.()), f.addEventListener("click", (M) => {
    M.stopPropagation();
    const z = !p.hidden;
    p.hidden = z, f.classList.toggle("active", !z);
  }), i.addEventListener("click", (M) => {
    M.stopPropagation();
    const z = !m.hidden;
    m.hidden = z, i.classList.toggle("active", !z);
  }), m.querySelectorAll(".export-item").forEach((M) => {
    M.addEventListener("click", async () => {
      m.hidden = !0, i.classList.remove("active");
      const z = M.dataset.export;
      try {
        z === "png-view" ? await nt("view") : z === "png-board" ? await nt("board") : z === "svg-board" && await q();
      } catch (Z) {
        console.error("Export failed:", Z);
      }
    });
  });
  const D = (M) => {
    const z = M.target;
    !p.hidden && !p.contains(z) && M.target !== f && (p.hidden = !0, f.classList.remove("active")), !m.hidden && !m.contains(z) && M.target !== i && (m.hidden = !0, i.classList.remove("active"));
  };
  document.addEventListener("click", D), y.forEach((M) => {
    M.addEventListener("change", () => {
      N = y.find((z) => z.checked)?.value || "top", ct();
    });
  });
  const F = () => {
    O(), at || bt(0.08);
  };
  window.addEventListener("resize", F);
  function w(M, z) {
    const Z = M.querySelector(z);
    if (!Z) throw new Error(`Missing required element: ${z}`);
    return Z;
  }
  function x(M) {
    S = M.boardGeom, L = M.layers, c = M.stackup ?? wt(M.layers), S?.board?.mm_bounds && d.setBoardBounds({
      minX_mm: S.board.mm_bounds.min_x_mm,
      minY_mm: S.board.mm_bounds.min_y_mm,
      maxX_mm: S.board.mm_bounds.max_x_mm,
      maxY_mm: S.board.mm_bounds.max_y_mm
    }), ct(), O(), bt(0.08), rt || (rt = !0, Ct());
  }
  function E(M) {
    N = M;
    const z = y.find((Z) => Z.value === M);
    z && (z.checked = !0), ct();
  }
  function j(M, z) {
    const Z = URL.createObjectURL(M), K = document.createElement("a");
    K.href = Z, K.download = z, document.body.appendChild(K), K.click(), K.remove(), setTimeout(() => URL.revokeObjectURL(Z), 1e3);
  }
  function W(M) {
    return new Promise((z, Z) => {
      const K = new Image();
      K.onload = () => z(K), K.onerror = () => Z(new Error("Failed to load composed SVG for export")), K.src = M;
    });
  }
  function C() {
    if (!c) return [];
    const M = c.copper.find((z) => z.role === (N === "top" ? "top" : "bottom"));
    return c.copper.filter((z) => z.id !== M?.id && (A[z.id] ?? !1)).map((z) => z.id);
  }
  function G() {
    const M = c?.copper.find((z) => z.role === (N === "top" ? "top" : "bottom"));
    return {
      side: N,
      revealed: C(),
      includeFR4: A["layer:fr4"] ?? !0,
      outerCopper: M ? A[M.id] ?? !0 : !0,
      sideMask: A[`${N}:mask`] ?? !0,
      sideSilk: A[`${N}:silk`] ?? !0,
      sidePaste: A[`${N}:paste`] ?? !0,
      drills: A["layer:drills"] ?? !0
    };
  }
  async function tt() {
    if (!S || !c) return null;
    const M = S.board.mm_bounds, z = M.max_x_mm - M.min_x_mm, Z = M.max_y_mm - M.min_y_mm, K = 1e3 / 25.4, J = Math.max(1, Math.round(z * K)), lt = Math.max(1, Math.round(Z * K)), ot = {}, yt = [], _t = (It, Nt) => {
      if (Nt)
        return yt.push(fetch(Nt).then((Ut) => Ut.text()).then((Ut) => {
          ot[It] = Ut;
        })), It;
    }, Mt = _t("board_mask", L.top_board_mask), kt = c.copper.map((It) => ({
      id: It.id,
      index: It.index,
      role: It.role,
      name: It.name,
      color: It.color,
      svgId: _t(It.id, It.url)
    })), Dt = c.top ? { maskId: _t("top:mask", c.top.mask), silkId: _t("top:silk", c.top.silk), pasteId: _t("top:paste", c.top.paste) } : void 0, Wt = c.bottom ? { maskId: _t("bottom:mask", c.bottom.mask), silkId: _t("bottom:silk", c.bottom.silk), pasteId: _t("bottom:paste", c.bottom.paste) } : void 0, Pt = _t("drills", c.drills);
    return await Promise.all(yt), {
      boardGeom: S,
      bounds: { minX: M.min_x_mm, minY: M.min_y_mm, maxX: M.max_x_mm, maxY: M.max_y_mm },
      wPx: J,
      hPx: lt,
      svgById: ot,
      boardMaskId: Mt,
      copper: kt,
      top: Dt,
      bottom: Wt,
      drillsId: Pt,
      viasId: void 0
    };
  }
  async function q() {
    const M = await tt();
    if (!M) return;
    const z = oe(M, G());
    j(new Blob([z], { type: "image/svg+xml" }), `board-${N}.svg`);
  }
  async function nt(M = "view", z = 2) {
    if (M === "view") {
      await new Promise((lt) => {
        r.toBlob((ot) => {
          ot && j(ot, `board-${N}-view.png`), lt();
        }, "image/png");
      });
      return;
    }
    const Z = await tt();
    if (!Z) return;
    const K = oe(Z, G()), J = URL.createObjectURL(new Blob([K], { type: "image/svg+xml" }));
    try {
      const lt = await W(J), ot = document.createElement("canvas"), yt = 8e3, _t = Math.min(z, yt / Math.max(1, Z.wPx), yt / Math.max(1, Z.hPx));
      ot.width = Math.max(1, Math.round(Z.wPx * _t)), ot.height = Math.max(1, Math.round(Z.hPx * _t));
      const Mt = ot.getContext("2d");
      if (!Mt) return;
      Mt.drawImage(lt, 0, 0, ot.width, ot.height), await new Promise((kt) => {
        ot.toBlob((Dt) => {
          Dt && j(Dt, `board-${N}.png`), kt();
        }, "image/png");
      });
    } finally {
      URL.revokeObjectURL(J);
    }
  }
  function ht() {
    const M = d.getCamera();
    return {
      v: 1,
      side: N,
      cam: { x: M.center_mm.x, y: M.center_mm.y, zoom: M.zoom, rot: M.rotation_rad || 0 },
      visible: { ...A },
      grid: a.checked,
      units: h.value
    };
  }
  function dt(M) {
    if (M.units && (h.value = M.units), typeof M.grid == "boolean" && (a.checked = M.grid, U.visible = M.grid, v.setOverlayVisibility("grid", M.grid)), M.side) {
      N = M.side;
      const z = y.find((Z) => Z.value === M.side);
      z && (z.checked = !0);
    }
    M.visible && Object.assign(A, M.visible), ct(), M.cam && d.setCamera({ center_mm: { x: M.cam.x, y: M.cam.y }, zoom: M.cam.zoom, rotation_rad: M.cam.rot ?? 0 }), at = !0, d.requestRender("view-state");
  }
  function At() {
    const M = new URL(location.href);
    return M.hash = `gv=${Sr(ht())}`, M.toString();
  }
  async function jt() {
    const M = At();
    try {
      location.hash = new URL(M).hash;
    } catch {
    }
    try {
      await navigator.clipboard?.writeText(M);
    } catch {
    }
    return M;
  }
  function Ct() {
    const M = /(?:^|[#&])gv=([^&]+)/.exec(location.hash || "");
    if (!M) return !1;
    const z = Mr(M[1]);
    return z ? (dt(z), !0) : !1;
  }
  let zt = null;
  const mt = {
    id: "diff:overlay",
    order: 190,
    // above board layers, below markers
    enabled: (M) => !!zt,
    draw: (M) => {
      if (!zt) return;
      const z = N === "top" ? zt.topImg : zt.bottomImg;
      if (!z || !z.complete) return;
      const Z = zt.result.boardGeom.board.mm_bounds, K = M.ctx, J = M.xform.getWorldToScreenMatrix();
      K.setTransform(J[0], J[3], J[1], J[4], J[2], J[5]), K.drawImage(z, Z.min_x_mm, Z.min_y_mm, Z.max_x_mm - Z.min_x_mm, Z.max_y_mm - Z.min_y_mm);
    }
  };
  function gt(M) {
    const z = (Z) => {
      if (!Z) return;
      const K = new Image();
      return K.onload = () => d.requestRender("diff-loaded"), K.onerror = () => console.error("Diff overlay image failed to load:", Z), K.src = Z, K;
    };
    zt = { result: M, topImg: z(M.top?.url), bottomImg: z(M.bottom?.url) }, d.getPass("diff:overlay") || d.addPass(mt), d.requestRender("diff-show");
  }
  function Ht() {
    zt = null, d.removePass("diff:overlay"), d.requestRender("diff-hide");
  }
  function Ot(M, z) {
    const Z = S?.board?.mm_bounds;
    if (!Z) return { x: M, y: z };
    const K = Nr(
      { x_mm: M, y_mm: z },
      { minX_mm: Z.min_x_mm, minY_mm: Z.min_y_mm, maxX_mm: Z.max_x_mm, maxY_mm: Z.max_y_mm }
    );
    return { x: K.x_mm, y: K.y_mm };
  }
  function Qt() {
    window.removeEventListener("mousemove", Et), window.removeEventListener("mouseup", l), window.removeEventListener("resize", F), document.removeEventListener("click", D), d.dispose(), u.innerHTML = "";
  }
  return O(), {
    setData: x,
    setSideMode: E,
    fit: () => bt(0.08),
    dispose: Qt,
    // Image / SVG export
    exportPng: nt,
    exportSvg: q,
    // Revision diff overlay
    showDiff: gt,
    hideDiff: Ht,
    // Shareable view state
    getViewState: ht,
    setViewState: dt,
    getShareUrl: At,
    copyShareLink: jt,
    applyStateFromHash: Ct,
    // Expose new render pipeline API
    viewer: d,
    visibility: v,
    overlayRegistry: k,
    markerRenderer: I,
    setSelection: (M) => {
      P = M, d.requestRender("selection-change");
    },
    addMarker: (M) => {
      if (typeof M.x_mm != "number" || typeof M.y_mm != "number" || !isFinite(M.x_mm) || !isFinite(M.y_mm)) {
        console.warn(`Invalid marker coordinates for ${M.id}:`, {
          x_mm: M.x_mm,
          y_mm: M.y_mm,
          marker: M,
          keys: Object.keys(M)
        });
        return;
      }
      const z = {
        id: M.id,
        position: Ot(M.x_mm, M.y_mm),
        type: "custom",
        // Default type for DFM markers
        data: {
          ...M.data,
          severity: M.severity,
          layer: M.layer,
          radius_mm: M.radius_mm
        }
      };
      I.add(z), d.requestRender("marker-added");
    },
    addMarkers: (M) => {
      for (const z of M) {
        if (typeof z.x_mm != "number" || typeof z.y_mm != "number" || !isFinite(z.x_mm) || !isFinite(z.y_mm)) {
          console.warn(`Invalid marker coordinates for ${z.id}:`, {
            x_mm: z.x_mm,
            y_mm: z.y_mm,
            marker: z,
            keys: Object.keys(z)
          });
          continue;
        }
        const Z = {
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
        I.add(Z);
      }
      d.requestRender("markers-added");
    },
    removeMarker: (M) => {
      I.remove(M), d.requestRender("marker-removed");
    }
  };
}
function rn(u, t) {
  return {
    id: "overlay:all",
    order: Jt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const s = e.xform.getWorldToScreenMatrix(), o = u.getSortedVisible();
      for (const n of o)
        e.ctx.save(), n.drawInWorldSpace ? e.ctx.setTransform(s[0], s[3], s[1], s[4], s[2], s[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), n.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function nn() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (u, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      u.fillStyle = "red";
      for (const s of e)
        u.beginPath(), u.arc(s.x_mm, s.y_mm, 0.25, 0, Math.PI * 2), u.fill();
    }
  };
}
function sn(u) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const s = u();
      s && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(s.x_px + 12, s.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(s.text, s.x_px + 15, s.y_px - 5));
    }
  };
}
function on(u = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const s = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let o = s.minX_mm; o <= s.maxX_mm; o += u)
        t.moveTo(o, s.minY_mm), t.lineTo(o, s.maxY_mm);
      for (let o = s.minY_mm; o <= s.maxY_mm; o += u)
        t.moveTo(s.minX_mm, o), t.lineTo(s.maxX_mm, o);
      t.stroke();
    }
  };
}
function an(u) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, s) => {
      t += 16;
      const o = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + o * 0.7})`, e.beginPath(), e.arc(u.x_mm, u.y_mm, 0.5 + o * 0.5, 0, Math.PI * 2), e.fill(), s.requestRender("overlay:animate");
    }
  };
}
class Gr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const s = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: o, height_px: n } = t.viewport, r = 4;
    for (const a of s) {
      if (typeof a.x_mm != "number" || typeof a.y_mm != "number" || !isFinite(a.x_mm) || !isFinite(a.y_mm)) {
        console.warn(`Invalid marker coordinates for ${a.id}:`, {
          x_mm: a.x_mm,
          y_mm: a.y_mm,
          marker: a,
          keys: Object.keys(a)
        });
        continue;
      }
      const h = t.boardToScreen({ x: a.x_mm, y: a.y_mm }), g = h.x, b = h.y;
      if (g < -10 || b < -10 || g > o + 10 || b > n + 10) continue;
      const _ = e?.boardBounds ? $r({ x_mm: a.x_mm, y_mm: a.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, a, e?.selectedId === a.id, e?.hoverId === a.id, _), t.ctx.beginPath(), t.ctx.arc(g, b, r, 0, Math.PI * 2), e?.selectedId === a.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, s, o, n) {
    if (s)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (o)
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
function ln(u, t) {
  const e = new Gr(u);
  return {
    id: "markers",
    order: Jt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (s) => {
      if (!s.visibility.markers) return;
      const o = t();
      e.draw(s, {
        selectedId: o.selectedId,
        hoverId: o.hoverId,
        boardBounds: s.boardBounds
      });
    }
  };
}
export {
  Or as Emitter,
  St as GerberError,
  Br as MarkerPicker,
  Gr as MarkerRenderer,
  Pr as MarkerStore,
  zr as OverlayRegistry,
  Cr as RenderScheduler,
  Wr as SelectionRenderer,
  Tr as UniformGridIndex,
  Lr as Viewer,
  Er as ViewportTransform,
  Fr as VisibilityManager,
  oe as composeStackToSvg,
  vr as computeDiffAlignment,
  en as createBoardViewer,
  Qr as createGerberPass,
  on as createGridOverlay,
  en as createIntegratedViewer,
  ln as createMarkerPass,
  rn as createOverlayPass,
  an as createPulsingMarkerOverlay,
  Yr as createSelectionPass,
  sn as createTooltipOverlay,
  nn as createViolationDotsOverlay,
  Mr as decodeViewState,
  qe as detectGerberBundle,
  Kr as diffGerbers,
  Sr as encodeViewState,
  se as renderGerberSvgDocs,
  Vr as renderGerbers,
  Le as renderGerbersFiles,
  Hr as renderGerbersToImage,
  qr as renderGerbersToSvg,
  Zr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
