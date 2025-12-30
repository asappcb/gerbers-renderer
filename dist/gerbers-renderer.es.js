var Ft = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function he(b) {
  return b && b.__esModule && Object.prototype.hasOwnProperty.call(b, "default") ? b.default : b;
}
function Dt(b) {
  throw new Error('Could not dynamically require "' + b + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ut = { exports: {} };
var Zt;
function ue() {
  return Zt || (Zt = 1, (function(b, t) {
    (function(r) {
      b.exports = r();
    })(function() {
      return (function r(u, d, a) {
        function s(w, _) {
          if (!d[w]) {
            if (!u[w]) {
              var h = typeof Dt == "function" && Dt;
              if (!_ && h) return h(w, !0);
              if (i) return i(w, !0);
              var y = new Error("Cannot find module '" + w + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var l = d[w] = { exports: {} };
            u[w][0].call(l.exports, function(m) {
              var n = u[w][1][m];
              return s(n || m);
            }, l, l.exports, r, u, d, a);
          }
          return d[w].exports;
        }
        for (var i = typeof Dt == "function" && Dt, c = 0; c < a.length; c++) s(a[c]);
        return s;
      })({ 1: [function(r, u, d) {
        var a = r("./utils"), s = r("./support"), i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        d.encode = function(c) {
          for (var w, _, h, y, l, m, n, p = [], f = 0, k = c.length, E = k, x = a.getTypeOf(c) !== "string"; f < c.length; ) E = k - f, h = x ? (w = c[f++], _ = f < k ? c[f++] : 0, f < k ? c[f++] : 0) : (w = c.charCodeAt(f++), _ = f < k ? c.charCodeAt(f++) : 0, f < k ? c.charCodeAt(f++) : 0), y = w >> 2, l = (3 & w) << 4 | _ >> 4, m = 1 < E ? (15 & _) << 2 | h >> 6 : 64, n = 2 < E ? 63 & h : 64, p.push(i.charAt(y) + i.charAt(l) + i.charAt(m) + i.charAt(n));
          return p.join("");
        }, d.decode = function(c) {
          var w, _, h, y, l, m, n = 0, p = 0, f = "data:";
          if (c.substr(0, f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
          var k, E = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === i.charAt(64) && E--, c.charAt(c.length - 2) === i.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (k = s.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); n < c.length; ) w = i.indexOf(c.charAt(n++)) << 2 | (y = i.indexOf(c.charAt(n++))) >> 4, _ = (15 & y) << 4 | (l = i.indexOf(c.charAt(n++))) >> 2, h = (3 & l) << 6 | (m = i.indexOf(c.charAt(n++))), k[p++] = w, l !== 64 && (k[p++] = _), m !== 64 && (k[p++] = h);
          return k;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(r, u, d) {
        var a = r("./external"), s = r("./stream/DataWorker"), i = r("./stream/Crc32Probe"), c = r("./stream/DataLengthProbe");
        function w(_, h, y, l, m) {
          this.compressedSize = _, this.uncompressedSize = h, this.crc32 = y, this.compression = l, this.compressedContent = m;
        }
        w.prototype = { getContentWorker: function() {
          var _ = new s(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), h = this;
          return _.on("end", function() {
            if (this.streamInfo.data_length !== h.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), _;
        }, getCompressedWorker: function() {
          return new s(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, w.createWorkerFrom = function(_, h, y) {
          return _.pipe(new i()).pipe(new c("uncompressedSize")).pipe(h.compressWorker(y)).pipe(new c("compressedSize")).withStreamInfo("compression", h);
        }, u.exports = w;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(r, u, d) {
        var a = r("./stream/GenericWorker");
        d.STORE = { magic: "\0\0", compressWorker: function() {
          return new a("STORE compression");
        }, uncompressWorker: function() {
          return new a("STORE decompression");
        } }, d.DEFLATE = r("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(r, u, d) {
        var a = r("./utils"), s = (function() {
          for (var i, c = [], w = 0; w < 256; w++) {
            i = w;
            for (var _ = 0; _ < 8; _++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            c[w] = i;
          }
          return c;
        })();
        u.exports = function(i, c) {
          return i !== void 0 && i.length ? a.getTypeOf(i) !== "string" ? (function(w, _, h, y) {
            var l = s, m = y + h;
            w ^= -1;
            for (var n = y; n < m; n++) w = w >>> 8 ^ l[255 & (w ^ _[n])];
            return -1 ^ w;
          })(0 | c, i, i.length, 0) : (function(w, _, h, y) {
            var l = s, m = y + h;
            w ^= -1;
            for (var n = y; n < m; n++) w = w >>> 8 ^ l[255 & (w ^ _.charCodeAt(n))];
            return -1 ^ w;
          })(0 | c, i, i.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(r, u, d) {
        d.base64 = !1, d.binary = !1, d.dir = !1, d.createFolders = !0, d.date = null, d.compression = null, d.compressionOptions = null, d.comment = null, d.unixPermissions = null, d.dosPermissions = null;
      }, {}], 6: [function(r, u, d) {
        var a = null;
        a = typeof Promise < "u" ? Promise : r("lie"), u.exports = { Promise: a };
      }, { lie: 37 }], 7: [function(r, u, d) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = r("pako"), i = r("./utils"), c = r("./stream/GenericWorker"), w = a ? "uint8array" : "array";
        function _(h, y) {
          c.call(this, "FlateWorker/" + h), this._pako = null, this._pakoAction = h, this._pakoOptions = y, this.meta = {};
        }
        d.magic = "\b\0", i.inherits(_, c), _.prototype.processChunk = function(h) {
          this.meta = h.meta, this._pako === null && this._createPako(), this._pako.push(i.transformTo(w, h.data), !1);
        }, _.prototype.flush = function() {
          c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, _.prototype.cleanUp = function() {
          c.prototype.cleanUp.call(this), this._pako = null;
        }, _.prototype._createPako = function() {
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var h = this;
          this._pako.onData = function(y) {
            h.push({ data: y, meta: h.meta });
          };
        }, d.compressWorker = function(h) {
          return new _("Deflate", h);
        }, d.uncompressWorker = function() {
          return new _("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(r, u, d) {
        function a(l, m) {
          var n, p = "";
          for (n = 0; n < m; n++) p += String.fromCharCode(255 & l), l >>>= 8;
          return p;
        }
        function s(l, m, n, p, f, k) {
          var E, x, A = l.file, F = l.compression, P = k !== w.utf8encode, D = i.transformTo("string", k(A.name)), M = i.transformTo("string", w.utf8encode(A.name)), W = A.comment, J = i.transformTo("string", k(W)), S = i.transformTo("string", w.utf8encode(W)), N = M.length !== A.name.length, o = S.length !== W.length, L = "", tt = "", X = "", et = A.dir, T = A.date, Z = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          m && !n || (Z.crc32 = l.crc32, Z.compressedSize = l.compressedSize, Z.uncompressedSize = l.uncompressedSize);
          var C = 0;
          m && (C |= 8), P || !N && !o || (C |= 2048);
          var R = 0, V = 0;
          et && (R |= 16), f === "UNIX" ? (V = 798, R |= (function(U, nt) {
            var ct = U;
            return U || (ct = nt ? 16893 : 33204), (65535 & ct) << 16;
          })(A.unixPermissions, et)) : (V = 20, R |= (function(U) {
            return 63 & (U || 0);
          })(A.dosPermissions)), E = T.getUTCHours(), E <<= 6, E |= T.getUTCMinutes(), E <<= 5, E |= T.getUTCSeconds() / 2, x = T.getUTCFullYear() - 1980, x <<= 4, x |= T.getUTCMonth() + 1, x <<= 5, x |= T.getUTCDate(), N && (tt = a(1, 1) + a(_(D), 4) + M, L += "up" + a(tt.length, 2) + tt), o && (X = a(1, 1) + a(_(J), 4) + S, L += "uc" + a(X.length, 2) + X);
          var H = "";
          return H += `
\0`, H += a(C, 2), H += F.magic, H += a(E, 2), H += a(x, 2), H += a(Z.crc32, 4), H += a(Z.compressedSize, 4), H += a(Z.uncompressedSize, 4), H += a(D.length, 2), H += a(L.length, 2), { fileRecord: h.LOCAL_FILE_HEADER + H + D + L, dirRecord: h.CENTRAL_FILE_HEADER + a(V, 2) + H + a(J.length, 2) + "\0\0\0\0" + a(R, 4) + a(p, 4) + D + L + J };
        }
        var i = r("../utils"), c = r("../stream/GenericWorker"), w = r("../utf8"), _ = r("../crc32"), h = r("../signature");
        function y(l, m, n, p) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = m, this.zipPlatform = n, this.encodeFileName = p, this.streamFiles = l, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        i.inherits(y, c), y.prototype.push = function(l) {
          var m = l.meta.percent || 0, n = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(l) : (this.bytesWritten += l.data.length, c.prototype.push.call(this, { data: l.data, meta: { currentFile: this.currentFile, percent: n ? (m + 100 * (n - p - 1)) / n : 100 } }));
        }, y.prototype.openedSource = function(l) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = l.file.name;
          var m = this.streamFiles && !l.file.dir;
          if (m) {
            var n = s(l, m, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: n.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(l) {
          this.accumulate = !1;
          var m = this.streamFiles && !l.file.dir, n = s(l, m, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(n.dirRecord), m) this.push({ data: (function(p) {
            return h.DATA_DESCRIPTOR + a(p.crc32, 4) + a(p.compressedSize, 4) + a(p.uncompressedSize, 4);
          })(l), meta: { percent: 100 } });
          else for (this.push({ data: n.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var l = this.bytesWritten, m = 0; m < this.dirRecords.length; m++) this.push({ data: this.dirRecords[m], meta: { percent: 100 } });
          var n = this.bytesWritten - l, p = (function(f, k, E, x, A) {
            var F = i.transformTo("string", A(x));
            return h.CENTRAL_DIRECTORY_END + "\0\0\0\0" + a(f, 2) + a(f, 2) + a(k, 4) + a(E, 4) + a(F.length, 2) + F;
          })(this.dirRecords.length, n, l, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(l) {
          this._sources.push(l);
          var m = this;
          return l.on("data", function(n) {
            m.processChunk(n);
          }), l.on("end", function() {
            m.closedSource(m.previous.streamInfo), m._sources.length ? m.prepareNextSource() : m.end();
          }), l.on("error", function(n) {
            m.error(n);
          }), this;
        }, y.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(l) {
          var m = this._sources;
          if (!c.prototype.error.call(this, l)) return !1;
          for (var n = 0; n < m.length; n++) try {
            m[n].error(l);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var l = this._sources, m = 0; m < l.length; m++) l[m].lock();
        }, u.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(r, u, d) {
        var a = r("../compressions"), s = r("./ZipFileWorker");
        d.generateWorker = function(i, c, w) {
          var _ = new s(c.streamFiles, w, c.platform, c.encodeFileName), h = 0;
          try {
            i.forEach(function(y, l) {
              h++;
              var m = (function(k, E) {
                var x = k || E, A = a[x];
                if (!A) throw new Error(x + " is not a valid compression method !");
                return A;
              })(l.options.compression, c.compression), n = l.options.compressionOptions || c.compressionOptions || {}, p = l.dir, f = l.date;
              l._compressWorker(m, n).withStreamInfo("file", { name: y, dir: p, date: f, comment: l.comment || "", unixPermissions: l.unixPermissions, dosPermissions: l.dosPermissions }).pipe(_);
            }), _.entriesCount = h;
          } catch (y) {
            _.error(y);
          }
          return _;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(r, u, d) {
        function a() {
          if (!(this instanceof a)) return new a();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new a();
            for (var i in this) typeof this[i] != "function" && (s[i] = this[i]);
            return s;
          };
        }
        (a.prototype = r("./object")).loadAsync = r("./load"), a.support = r("./support"), a.defaults = r("./defaults"), a.version = "3.10.1", a.loadAsync = function(s, i) {
          return new a().loadAsync(s, i);
        }, a.external = r("./external"), u.exports = a;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(r, u, d) {
        var a = r("./utils"), s = r("./external"), i = r("./utf8"), c = r("./zipEntries"), w = r("./stream/Crc32Probe"), _ = r("./nodejsUtils");
        function h(y) {
          return new s.Promise(function(l, m) {
            var n = y.decompressed.getContentWorker().pipe(new w());
            n.on("error", function(p) {
              m(p);
            }).on("end", function() {
              n.streamInfo.crc32 !== y.decompressed.crc32 ? m(new Error("Corrupted zip : CRC32 mismatch")) : l();
            }).resume();
          });
        }
        u.exports = function(y, l) {
          var m = this;
          return l = a.extend(l || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: i.utf8decode }), _.isNode && _.isStream(y) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : a.prepareContent("the loaded zip file", y, !0, l.optimizedBinaryString, l.base64).then(function(n) {
            var p = new c(l);
            return p.load(n), p;
          }).then(function(n) {
            var p = [s.Promise.resolve(n)], f = n.files;
            if (l.checkCRC32) for (var k = 0; k < f.length; k++) p.push(h(f[k]));
            return s.Promise.all(p);
          }).then(function(n) {
            for (var p = n.shift(), f = p.files, k = 0; k < f.length; k++) {
              var E = f[k], x = E.fileNameStr, A = a.resolve(E.fileNameStr);
              m.file(A, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: l.createFolders }), E.dir || (m.file(A).unsafeOriginalName = x);
            }
            return p.zipComment.length && (m.comment = p.zipComment), m;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(r, u, d) {
        var a = r("../utils"), s = r("../stream/GenericWorker");
        function i(c, w) {
          s.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(w);
        }
        a.inherits(i, s), i.prototype._bindStream = function(c) {
          var w = this;
          (this._stream = c).pause(), c.on("data", function(_) {
            w.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            w.isPaused ? this.generatedError = _ : w.error(_);
          }).on("end", function() {
            w.isPaused ? w._upstreamEnded = !0 : w.end();
          });
        }, i.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, i.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, u.exports = i;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(r, u, d) {
        var a = r("readable-stream").Readable;
        function s(i, c, w) {
          a.call(this, c), this._helper = i;
          var _ = this;
          i.on("data", function(h, y) {
            _.push(h) || _._helper.pause(), w && w(y);
          }).on("error", function(h) {
            _.emit("error", h);
          }).on("end", function() {
            _.push(null);
          });
        }
        r("../utils").inherits(s, a), s.prototype._read = function() {
          this._helper.resume();
        }, u.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(r, u, d) {
        u.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(a, s) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(a, s);
          if (typeof a == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(a, s);
        }, allocBuffer: function(a) {
          if (Buffer.alloc) return Buffer.alloc(a);
          var s = new Buffer(a);
          return s.fill(0), s;
        }, isBuffer: function(a) {
          return Buffer.isBuffer(a);
        }, isStream: function(a) {
          return a && typeof a.on == "function" && typeof a.pause == "function" && typeof a.resume == "function";
        } };
      }, {}], 15: [function(r, u, d) {
        function a(A, F, P) {
          var D, M = i.getTypeOf(F), W = i.extend(P || {}, _);
          W.date = W.date || /* @__PURE__ */ new Date(), W.compression !== null && (W.compression = W.compression.toUpperCase()), typeof W.unixPermissions == "string" && (W.unixPermissions = parseInt(W.unixPermissions, 8)), W.unixPermissions && 16384 & W.unixPermissions && (W.dir = !0), W.dosPermissions && 16 & W.dosPermissions && (W.dir = !0), W.dir && (A = f(A)), W.createFolders && (D = p(A)) && k.call(this, D, !0);
          var J = M === "string" && W.binary === !1 && W.base64 === !1;
          P && P.binary !== void 0 || (W.binary = !J), (F instanceof h && F.uncompressedSize === 0 || W.dir || !F || F.length === 0) && (W.base64 = !1, W.binary = !0, F = "", W.compression = "STORE", M = "string");
          var S = null;
          S = F instanceof h || F instanceof c ? F : m.isNode && m.isStream(F) ? new n(A, F) : i.prepareContent(A, F, W.binary, W.optimizedBinaryString, W.base64);
          var N = new y(A, S, W);
          this.files[A] = N;
        }
        var s = r("./utf8"), i = r("./utils"), c = r("./stream/GenericWorker"), w = r("./stream/StreamHelper"), _ = r("./defaults"), h = r("./compressedObject"), y = r("./zipObject"), l = r("./generate"), m = r("./nodejsUtils"), n = r("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var F = A.lastIndexOf("/");
          return 0 < F ? A.substring(0, F) : "";
        }, f = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, k = function(A, F) {
          return F = F !== void 0 ? F : _.createFolders, A = f(A), this.files[A] || a.call(this, A, null, { dir: !0, createFolders: F }), this.files[A];
        };
        function E(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var x = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var F, P, D;
          for (F in this.files) D = this.files[F], (P = F.slice(this.root.length, F.length)) && F.slice(0, this.root.length) === this.root && A(P, D);
        }, filter: function(A) {
          var F = [];
          return this.forEach(function(P, D) {
            A(P, D) && F.push(D);
          }), F;
        }, file: function(A, F, P) {
          if (arguments.length !== 1) return A = this.root + A, a.call(this, A, F, P), this;
          if (E(A)) {
            var D = A;
            return this.filter(function(W, J) {
              return !J.dir && D.test(W);
            });
          }
          var M = this.files[this.root + A];
          return M && !M.dir ? M : null;
        }, folder: function(A) {
          if (!A) return this;
          if (E(A)) return this.filter(function(M, W) {
            return W.dir && A.test(M);
          });
          var F = this.root + A, P = k.call(this, F), D = this.clone();
          return D.root = P.name, D;
        }, remove: function(A) {
          A = this.root + A;
          var F = this.files[A];
          if (F || (A.slice(-1) !== "/" && (A += "/"), F = this.files[A]), F && !F.dir) delete this.files[A];
          else for (var P = this.filter(function(M, W) {
            return W.name.slice(0, A.length) === A;
          }), D = 0; D < P.length; D++) delete this.files[P[D].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var F, P = {};
          try {
            if ((P = i.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = P.type.toLowerCase(), P.compression = P.compression.toUpperCase(), P.type === "binarystring" && (P.type = "string"), !P.type) throw new Error("No output type specified.");
            i.checkSupport(P.type), P.platform !== "darwin" && P.platform !== "freebsd" && P.platform !== "linux" && P.platform !== "sunos" || (P.platform = "UNIX"), P.platform === "win32" && (P.platform = "DOS");
            var D = P.comment || this.comment || "";
            F = l.generateWorker(this, P, D);
          } catch (M) {
            (F = new c("error")).error(M);
          }
          return new w(F, P.type || "string", P.mimeType);
        }, generateAsync: function(A, F) {
          return this.generateInternalStream(A).accumulate(F);
        }, generateNodeStream: function(A, F) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(F);
        } };
        u.exports = x;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(r, u, d) {
        u.exports = r("stream");
      }, { stream: void 0 }], 17: [function(r, u, d) {
        var a = r("./DataReader");
        function s(i) {
          a.call(this, i);
          for (var c = 0; c < this.data.length; c++) i[c] = 255 & i[c];
        }
        r("../utils").inherits(s, a), s.prototype.byteAt = function(i) {
          return this.data[this.zero + i];
        }, s.prototype.lastIndexOfSignature = function(i) {
          for (var c = i.charCodeAt(0), w = i.charCodeAt(1), _ = i.charCodeAt(2), h = i.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === c && this.data[y + 1] === w && this.data[y + 2] === _ && this.data[y + 3] === h) return y - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(i) {
          var c = i.charCodeAt(0), w = i.charCodeAt(1), _ = i.charCodeAt(2), h = i.charCodeAt(3), y = this.readData(4);
          return c === y[0] && w === y[1] && _ === y[2] && h === y[3];
        }, s.prototype.readData = function(i) {
          if (this.checkOffset(i), i === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, c;
        }, u.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(r, u, d) {
        var a = r("../utils");
        function s(i) {
          this.data = i, this.length = i.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(i) {
          this.checkIndex(this.index + i);
        }, checkIndex: function(i) {
          if (this.length < this.zero + i || i < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + i + "). Corrupted zip ?");
        }, setIndex: function(i) {
          this.checkIndex(i), this.index = i;
        }, skip: function(i) {
          this.setIndex(this.index + i);
        }, byteAt: function() {
        }, readInt: function(i) {
          var c, w = 0;
          for (this.checkOffset(i), c = this.index + i - 1; c >= this.index; c--) w = (w << 8) + this.byteAt(c);
          return this.index += i, w;
        }, readString: function(i) {
          return a.transformTo("string", this.readData(i));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var i = this.readInt(4);
          return new Date(Date.UTC(1980 + (i >> 25 & 127), (i >> 21 & 15) - 1, i >> 16 & 31, i >> 11 & 31, i >> 5 & 63, (31 & i) << 1));
        } }, u.exports = s;
      }, { "../utils": 32 }], 19: [function(r, u, d) {
        var a = r("./Uint8ArrayReader");
        function s(i) {
          a.call(this, i);
        }
        r("../utils").inherits(s, a), s.prototype.readData = function(i) {
          this.checkOffset(i);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, c;
        }, u.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(r, u, d) {
        var a = r("./DataReader");
        function s(i) {
          a.call(this, i);
        }
        r("../utils").inherits(s, a), s.prototype.byteAt = function(i) {
          return this.data.charCodeAt(this.zero + i);
        }, s.prototype.lastIndexOfSignature = function(i) {
          return this.data.lastIndexOf(i) - this.zero;
        }, s.prototype.readAndCheckSignature = function(i) {
          return i === this.readData(4);
        }, s.prototype.readData = function(i) {
          this.checkOffset(i);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, c;
        }, u.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(r, u, d) {
        var a = r("./ArrayReader");
        function s(i) {
          a.call(this, i);
        }
        r("../utils").inherits(s, a), s.prototype.readData = function(i) {
          if (this.checkOffset(i), i === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, c;
        }, u.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(r, u, d) {
        var a = r("../utils"), s = r("../support"), i = r("./ArrayReader"), c = r("./StringReader"), w = r("./NodeBufferReader"), _ = r("./Uint8ArrayReader");
        u.exports = function(h) {
          var y = a.getTypeOf(h);
          return a.checkSupport(y), y !== "string" || s.uint8array ? y === "nodebuffer" ? new w(h) : s.uint8array ? new _(a.transformTo("uint8array", h)) : new i(a.transformTo("array", h)) : new c(h);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(r, u, d) {
        d.LOCAL_FILE_HEADER = "PK", d.CENTRAL_FILE_HEADER = "PK", d.CENTRAL_DIRECTORY_END = "PK", d.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", d.ZIP64_CENTRAL_DIRECTORY_END = "PK", d.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(r, u, d) {
        var a = r("./GenericWorker"), s = r("../utils");
        function i(c) {
          a.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        s.inherits(i, a), i.prototype.processChunk = function(c) {
          this.push({ data: s.transformTo(this.destType, c.data), meta: c.meta });
        }, u.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(r, u, d) {
        var a = r("./GenericWorker"), s = r("../crc32");
        function i() {
          a.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        r("../utils").inherits(i, a), i.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = s(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, u.exports = i;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(r, u, d) {
        var a = r("../utils"), s = r("./GenericWorker");
        function i(c) {
          s.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        a.inherits(i, s), i.prototype.processChunk = function(c) {
          if (c) {
            var w = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = w + c.data.length;
          }
          s.prototype.processChunk.call(this, c);
        }, u.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(r, u, d) {
        var a = r("../utils"), s = r("./GenericWorker");
        function i(c) {
          s.call(this, "DataWorker");
          var w = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(_) {
            w.dataIsReady = !0, w.data = _, w.max = _ && _.length || 0, w.type = a.getTypeOf(_), w.isPaused || w._tickAndRepeat();
          }, function(_) {
            w.error(_);
          });
        }
        a.inherits(i, s), i.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, i.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, a.delay(this._tickAndRepeat, [], this)), !0);
        }, i.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (a.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, i.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var c = null, w = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              c = this.data.substring(this.index, w);
              break;
            case "uint8array":
              c = this.data.subarray(this.index, w);
              break;
            case "array":
            case "nodebuffer":
              c = this.data.slice(this.index, w);
          }
          return this.index = w, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, u.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(r, u, d) {
        function a(s) {
          this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        a.prototype = { push: function(s) {
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
        }, on: function(s, i) {
          return this._listeners[s].push(i), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, i) {
          if (this._listeners[s]) for (var c = 0; c < this._listeners[s].length; c++) this._listeners[s][c].call(this, i);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var i = this;
          return s.on("data", function(c) {
            i.processChunk(c);
          }), s.on("end", function() {
            i.end();
          }), s.on("error", function(c) {
            i.error(c);
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
        }, withStreamInfo: function(s, i) {
          return this.extraStreamInfo[s] = i, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var s = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + s : s;
        } }, u.exports = a;
      }, {}], 29: [function(r, u, d) {
        var a = r("../utils"), s = r("./ConvertWorker"), i = r("./GenericWorker"), c = r("../base64"), w = r("../support"), _ = r("../external"), h = null;
        if (w.nodestream) try {
          h = r("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(m, n) {
          return new _.Promise(function(p, f) {
            var k = [], E = m._internalType, x = m._outputType, A = m._mimeType;
            m.on("data", function(F, P) {
              k.push(F), n && n(P);
            }).on("error", function(F) {
              k = [], f(F);
            }).on("end", function() {
              try {
                var F = (function(P, D, M) {
                  switch (P) {
                    case "blob":
                      return a.newBlob(a.transformTo("arraybuffer", D), M);
                    case "base64":
                      return c.encode(D);
                    default:
                      return a.transformTo(P, D);
                  }
                })(x, (function(P, D) {
                  var M, W = 0, J = null, S = 0;
                  for (M = 0; M < D.length; M++) S += D[M].length;
                  switch (P) {
                    case "string":
                      return D.join("");
                    case "array":
                      return Array.prototype.concat.apply([], D);
                    case "uint8array":
                      for (J = new Uint8Array(S), M = 0; M < D.length; M++) J.set(D[M], W), W += D[M].length;
                      return J;
                    case "nodebuffer":
                      return Buffer.concat(D);
                    default:
                      throw new Error("concat : unsupported type '" + P + "'");
                  }
                })(E, k), A);
                p(F);
              } catch (P) {
                f(P);
              }
              k = [];
            }).resume();
          });
        }
        function l(m, n, p) {
          var f = n;
          switch (n) {
            case "blob":
            case "arraybuffer":
              f = "uint8array";
              break;
            case "base64":
              f = "string";
          }
          try {
            this._internalType = f, this._outputType = n, this._mimeType = p, a.checkSupport(f), this._worker = m.pipe(new s(f)), m.lock();
          } catch (k) {
            this._worker = new i("error"), this._worker.error(k);
          }
        }
        l.prototype = { accumulate: function(m) {
          return y(this, m);
        }, on: function(m, n) {
          var p = this;
          return m === "data" ? this._worker.on(m, function(f) {
            n.call(p, f.data, f.meta);
          }) : this._worker.on(m, function() {
            a.delay(n, arguments, p);
          }), this;
        }, resume: function() {
          return a.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(m) {
          if (a.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new h(this, { objectMode: this._outputType !== "nodebuffer" }, m);
        } }, u.exports = l;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(r, u, d) {
        if (d.base64 = !0, d.array = !0, d.string = !0, d.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", d.nodebuffer = typeof Buffer < "u", d.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") d.blob = !1;
        else {
          var a = new ArrayBuffer(0);
          try {
            d.blob = new Blob([a], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              s.append(a), d.blob = s.getBlob("application/zip").size === 0;
            } catch {
              d.blob = !1;
            }
          }
        }
        try {
          d.nodestream = !!r("readable-stream").Readable;
        } catch {
          d.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(r, u, d) {
        for (var a = r("./utils"), s = r("./support"), i = r("./nodejsUtils"), c = r("./stream/GenericWorker"), w = new Array(256), _ = 0; _ < 256; _++) w[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        w[254] = w[254] = 1;
        function h() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          c.call(this, "utf-8 encode");
        }
        d.utf8encode = function(l) {
          return s.nodebuffer ? i.newBufferFrom(l, "utf-8") : (function(m) {
            var n, p, f, k, E, x = m.length, A = 0;
            for (k = 0; k < x; k++) (64512 & (p = m.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (f = m.charCodeAt(k + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), k++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (n = s.uint8array ? new Uint8Array(A) : new Array(A), k = E = 0; E < A; k++) (64512 & (p = m.charCodeAt(k))) == 55296 && k + 1 < x && (64512 & (f = m.charCodeAt(k + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (f - 56320), k++), p < 128 ? n[E++] = p : (p < 2048 ? n[E++] = 192 | p >>> 6 : (p < 65536 ? n[E++] = 224 | p >>> 12 : (n[E++] = 240 | p >>> 18, n[E++] = 128 | p >>> 12 & 63), n[E++] = 128 | p >>> 6 & 63), n[E++] = 128 | 63 & p);
            return n;
          })(l);
        }, d.utf8decode = function(l) {
          return s.nodebuffer ? a.transformTo("nodebuffer", l).toString("utf-8") : (function(m) {
            var n, p, f, k, E = m.length, x = new Array(2 * E);
            for (n = p = 0; n < E; ) if ((f = m[n++]) < 128) x[p++] = f;
            else if (4 < (k = w[f])) x[p++] = 65533, n += k - 1;
            else {
              for (f &= k === 2 ? 31 : k === 3 ? 15 : 7; 1 < k && n < E; ) f = f << 6 | 63 & m[n++], k--;
              1 < k ? x[p++] = 65533 : f < 65536 ? x[p++] = f : (f -= 65536, x[p++] = 55296 | f >> 10 & 1023, x[p++] = 56320 | 1023 & f);
            }
            return x.length !== p && (x.subarray ? x = x.subarray(0, p) : x.length = p), a.applyFromCharCode(x);
          })(l = a.transformTo(s.uint8array ? "uint8array" : "array", l));
        }, a.inherits(h, c), h.prototype.processChunk = function(l) {
          var m = a.transformTo(s.uint8array ? "uint8array" : "array", l.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var n = m;
              (m = new Uint8Array(n.length + this.leftOver.length)).set(this.leftOver, 0), m.set(n, this.leftOver.length);
            } else m = this.leftOver.concat(m);
            this.leftOver = null;
          }
          var p = (function(k, E) {
            var x;
            for ((E = E || k.length) > k.length && (E = k.length), x = E - 1; 0 <= x && (192 & k[x]) == 128; ) x--;
            return x < 0 || x === 0 ? E : x + w[k[x]] > E ? x : E;
          })(m), f = m;
          p !== m.length && (s.uint8array ? (f = m.subarray(0, p), this.leftOver = m.subarray(p, m.length)) : (f = m.slice(0, p), this.leftOver = m.slice(p, m.length))), this.push({ data: d.utf8decode(f), meta: l.meta });
        }, h.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: d.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, d.Utf8DecodeWorker = h, a.inherits(y, c), y.prototype.processChunk = function(l) {
          this.push({ data: d.utf8encode(l.data), meta: l.meta });
        }, d.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(r, u, d) {
        var a = r("./support"), s = r("./base64"), i = r("./nodejsUtils"), c = r("./external");
        function w(n) {
          return n;
        }
        function _(n, p) {
          for (var f = 0; f < n.length; ++f) p[f] = 255 & n.charCodeAt(f);
          return p;
        }
        r("setimmediate"), d.newBlob = function(n, p) {
          d.checkSupport("blob");
          try {
            return new Blob([n], { type: p });
          } catch {
            try {
              var f = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return f.append(n), f.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var h = { stringifyByChunk: function(n, p, f) {
          var k = [], E = 0, x = n.length;
          if (x <= f) return String.fromCharCode.apply(null, n);
          for (; E < x; ) p === "array" || p === "nodebuffer" ? k.push(String.fromCharCode.apply(null, n.slice(E, Math.min(E + f, x)))) : k.push(String.fromCharCode.apply(null, n.subarray(E, Math.min(E + f, x)))), E += f;
          return k.join("");
        }, stringifyByChar: function(n) {
          for (var p = "", f = 0; f < n.length; f++) p += String.fromCharCode(n[f]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return a.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return a.nodebuffer && String.fromCharCode.apply(null, i.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function y(n) {
          var p = 65536, f = d.getTypeOf(n), k = !0;
          if (f === "uint8array" ? k = h.applyCanBeUsed.uint8array : f === "nodebuffer" && (k = h.applyCanBeUsed.nodebuffer), k) for (; 1 < p; ) try {
            return h.stringifyByChunk(n, f, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return h.stringifyByChar(n);
        }
        function l(n, p) {
          for (var f = 0; f < n.length; f++) p[f] = n[f];
          return p;
        }
        d.applyFromCharCode = y;
        var m = {};
        m.string = { string: w, array: function(n) {
          return _(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return m.string.uint8array(n).buffer;
        }, uint8array: function(n) {
          return _(n, new Uint8Array(n.length));
        }, nodebuffer: function(n) {
          return _(n, i.allocBuffer(n.length));
        } }, m.array = { string: y, array: w, arraybuffer: function(n) {
          return new Uint8Array(n).buffer;
        }, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return i.newBufferFrom(n);
        } }, m.arraybuffer = { string: function(n) {
          return y(new Uint8Array(n));
        }, array: function(n) {
          return l(new Uint8Array(n), new Array(n.byteLength));
        }, arraybuffer: w, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return i.newBufferFrom(new Uint8Array(n));
        } }, m.uint8array = { string: y, array: function(n) {
          return l(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return n.buffer;
        }, uint8array: w, nodebuffer: function(n) {
          return i.newBufferFrom(n);
        } }, m.nodebuffer = { string: y, array: function(n) {
          return l(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return m.nodebuffer.uint8array(n).buffer;
        }, uint8array: function(n) {
          return l(n, new Uint8Array(n.length));
        }, nodebuffer: w }, d.transformTo = function(n, p) {
          if (p = p || "", !n) return p;
          d.checkSupport(n);
          var f = d.getTypeOf(p);
          return m[f][n](p);
        }, d.resolve = function(n) {
          for (var p = n.split("/"), f = [], k = 0; k < p.length; k++) {
            var E = p[k];
            E === "." || E === "" && k !== 0 && k !== p.length - 1 || (E === ".." ? f.pop() : f.push(E));
          }
          return f.join("/");
        }, d.getTypeOf = function(n) {
          return typeof n == "string" ? "string" : Object.prototype.toString.call(n) === "[object Array]" ? "array" : a.nodebuffer && i.isBuffer(n) ? "nodebuffer" : a.uint8array && n instanceof Uint8Array ? "uint8array" : a.arraybuffer && n instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, d.checkSupport = function(n) {
          if (!a[n.toLowerCase()]) throw new Error(n + " is not supported by this platform");
        }, d.MAX_VALUE_16BITS = 65535, d.MAX_VALUE_32BITS = -1, d.pretty = function(n) {
          var p, f, k = "";
          for (f = 0; f < (n || "").length; f++) k += "\\x" + ((p = n.charCodeAt(f)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return k;
        }, d.delay = function(n, p, f) {
          setImmediate(function() {
            n.apply(f || null, p || []);
          });
        }, d.inherits = function(n, p) {
          function f() {
          }
          f.prototype = p.prototype, n.prototype = new f();
        }, d.extend = function() {
          var n, p, f = {};
          for (n = 0; n < arguments.length; n++) for (p in arguments[n]) Object.prototype.hasOwnProperty.call(arguments[n], p) && f[p] === void 0 && (f[p] = arguments[n][p]);
          return f;
        }, d.prepareContent = function(n, p, f, k, E) {
          return c.Promise.resolve(p).then(function(x) {
            return a.blob && (x instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(x)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(A, F) {
              var P = new FileReader();
              P.onload = function(D) {
                A(D.target.result);
              }, P.onerror = function(D) {
                F(D.target.error);
              }, P.readAsArrayBuffer(x);
            }) : x;
          }).then(function(x) {
            var A = d.getTypeOf(x);
            return A ? (A === "arraybuffer" ? x = d.transformTo("uint8array", x) : A === "string" && (E ? x = s.decode(x) : f && k !== !0 && (x = (function(F) {
              return _(F, a.uint8array ? new Uint8Array(F.length) : new Array(F.length));
            })(x))), x) : c.Promise.reject(new Error("Can't read the data of '" + n + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(r, u, d) {
        var a = r("./reader/readerFor"), s = r("./utils"), i = r("./signature"), c = r("./zipEntry"), w = r("./support");
        function _(h) {
          this.files = [], this.loadOptions = h;
        }
        _.prototype = { checkSignature: function(h) {
          if (!this.reader.readAndCheckSignature(h)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(y) + ", expected " + s.pretty(h) + ")");
          }
        }, isSignature: function(h, y) {
          var l = this.reader.index;
          this.reader.setIndex(h);
          var m = this.reader.readString(4) === y;
          return this.reader.setIndex(l), m;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var h = this.reader.readData(this.zipCommentLength), y = w.uint8array ? "uint8array" : "array", l = s.transformTo(y, h);
          this.zipComment = this.loadOptions.decodeFileName(l);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var h, y, l, m = this.zip64EndOfCentralSize - 44; 0 < m; ) h = this.reader.readInt(2), y = this.reader.readInt(4), l = this.reader.readData(y), this.zip64ExtensibleData[h] = { id: h, length: y, value: l };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var h, y;
          for (h = 0; h < this.files.length; h++) y = this.files[h], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(i.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var h;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(i.CENTRAL_FILE_HEADER); ) (h = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(h);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var h = this.reader.lastIndexOfSignature(i.CENTRAL_DIRECTORY_END);
          if (h < 0) throw this.isSignature(0, i.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(h);
          var y = h;
          if (this.checkSignature(i.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (h = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(h), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, i.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var l = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (l += 20, l += 12 + this.zip64EndOfCentralSize);
          var m = y - l;
          if (0 < m) this.isSignature(y, i.CENTRAL_FILE_HEADER) || (this.reader.zero = m);
          else if (m < 0) throw new Error("Corrupted zip: missing " + Math.abs(m) + " bytes.");
        }, prepareReader: function(h) {
          this.reader = a(h);
        }, load: function(h) {
          this.prepareReader(h), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, u.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(r, u, d) {
        var a = r("./reader/readerFor"), s = r("./utils"), i = r("./compressedObject"), c = r("./crc32"), w = r("./utf8"), _ = r("./compressions"), h = r("./support");
        function y(l, m) {
          this.options = l, this.loadOptions = m;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(l) {
          var m, n;
          if (l.skip(22), this.fileNameLength = l.readInt(2), n = l.readInt(2), this.fileName = l.readData(this.fileNameLength), l.skip(n), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((m = (function(p) {
            for (var f in _) if (Object.prototype.hasOwnProperty.call(_, f) && _[f].magic === p) return _[f];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, m, l.readData(this.compressedSize));
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
            var l = a(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = l.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = l.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = l.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = l.readInt(4));
          }
        }, readExtraFields: function(l) {
          var m, n, p, f = l.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); l.index + 4 < f; ) m = l.readInt(2), n = l.readInt(2), p = l.readData(n), this.extraFields[m] = { id: m, length: n, value: p };
          l.setIndex(f);
        }, handleUTF8: function() {
          var l = h.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = w.utf8decode(this.fileName), this.fileCommentStr = w.utf8decode(this.fileComment);
          else {
            var m = this.findExtraFieldUnicodePath();
            if (m !== null) this.fileNameStr = m;
            else {
              var n = s.transformTo(l, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(n);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var f = s.transformTo(l, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(f);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var l = this.extraFields[28789];
          if (l) {
            var m = a(l.value);
            return m.readInt(1) !== 1 || c(this.fileName) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var l = this.extraFields[25461];
          if (l) {
            var m = a(l.value);
            return m.readInt(1) !== 1 || c(this.fileComment) !== m.readInt(4) ? null : w.utf8decode(m.readData(l.length - 5));
          }
          return null;
        } }, u.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(r, u, d) {
        function a(m, n, p) {
          this.name = m, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = n, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var s = r("./stream/StreamHelper"), i = r("./stream/DataWorker"), c = r("./utf8"), w = r("./compressedObject"), _ = r("./stream/GenericWorker");
        a.prototype = { internalStream: function(m) {
          var n = null, p = "string";
          try {
            if (!m) throw new Error("No output type specified.");
            var f = (p = m.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), n = this._decompressWorker();
            var k = !this._dataBinary;
            k && !f && (n = n.pipe(new c.Utf8EncodeWorker())), !k && f && (n = n.pipe(new c.Utf8DecodeWorker()));
          } catch (E) {
            (n = new _("error")).error(E);
          }
          return new s(n, p, "");
        }, async: function(m, n) {
          return this.internalStream(m).accumulate(n);
        }, nodeStream: function(m, n) {
          return this.internalStream(m || "nodebuffer").toNodejsStream(n);
        }, _compressWorker: function(m, n) {
          if (this._data instanceof w && this._data.compression.magic === m.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new c.Utf8EncodeWorker())), w.createWorkerFrom(p, m, n);
        }, _decompressWorker: function() {
          return this._data instanceof w ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new i(this._data);
        } };
        for (var h = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, l = 0; l < h.length; l++) a.prototype[h[l]] = y;
        u.exports = a;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(r, u, d) {
        (function(a) {
          var s, i, c = a.MutationObserver || a.WebKitMutationObserver;
          if (c) {
            var w = 0, _ = new c(m), h = a.document.createTextNode("");
            _.observe(h, { characterData: !0 }), s = function() {
              h.data = w = ++w % 2;
            };
          } else if (a.setImmediate || a.MessageChannel === void 0) s = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function() {
            var n = a.document.createElement("script");
            n.onreadystatechange = function() {
              m(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null;
            }, a.document.documentElement.appendChild(n);
          } : function() {
            setTimeout(m, 0);
          };
          else {
            var y = new a.MessageChannel();
            y.port1.onmessage = m, s = function() {
              y.port2.postMessage(0);
            };
          }
          var l = [];
          function m() {
            var n, p;
            i = !0;
            for (var f = l.length; f; ) {
              for (p = l, l = [], n = -1; ++n < f; ) p[n]();
              f = l.length;
            }
            i = !1;
          }
          u.exports = function(n) {
            l.push(n) !== 1 || i || s();
          };
        }).call(this, typeof Ft < "u" ? Ft : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(r, u, d) {
        var a = r("immediate");
        function s() {
        }
        var i = {}, c = ["REJECTED"], w = ["FULFILLED"], _ = ["PENDING"];
        function h(f) {
          if (typeof f != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, f !== s && n(this, f);
        }
        function y(f, k, E) {
          this.promise = f, typeof k == "function" && (this.onFulfilled = k, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
        }
        function l(f, k, E) {
          a(function() {
            var x;
            try {
              x = k(E);
            } catch (A) {
              return i.reject(f, A);
            }
            x === f ? i.reject(f, new TypeError("Cannot resolve promise with itself")) : i.resolve(f, x);
          });
        }
        function m(f) {
          var k = f && f.then;
          if (f && (typeof f == "object" || typeof f == "function") && typeof k == "function") return function() {
            k.apply(f, arguments);
          };
        }
        function n(f, k) {
          var E = !1;
          function x(P) {
            E || (E = !0, i.reject(f, P));
          }
          function A(P) {
            E || (E = !0, i.resolve(f, P));
          }
          var F = p(function() {
            k(A, x);
          });
          F.status === "error" && x(F.value);
        }
        function p(f, k) {
          var E = {};
          try {
            E.value = f(k), E.status = "success";
          } catch (x) {
            E.status = "error", E.value = x;
          }
          return E;
        }
        (u.exports = h).prototype.finally = function(f) {
          if (typeof f != "function") return this;
          var k = this.constructor;
          return this.then(function(E) {
            return k.resolve(f()).then(function() {
              return E;
            });
          }, function(E) {
            return k.resolve(f()).then(function() {
              throw E;
            });
          });
        }, h.prototype.catch = function(f) {
          return this.then(null, f);
        }, h.prototype.then = function(f, k) {
          if (typeof f != "function" && this.state === w || typeof k != "function" && this.state === c) return this;
          var E = new this.constructor(s);
          return this.state !== _ ? l(E, this.state === w ? f : k, this.outcome) : this.queue.push(new y(E, f, k)), E;
        }, y.prototype.callFulfilled = function(f) {
          i.resolve(this.promise, f);
        }, y.prototype.otherCallFulfilled = function(f) {
          l(this.promise, this.onFulfilled, f);
        }, y.prototype.callRejected = function(f) {
          i.reject(this.promise, f);
        }, y.prototype.otherCallRejected = function(f) {
          l(this.promise, this.onRejected, f);
        }, i.resolve = function(f, k) {
          var E = p(m, k);
          if (E.status === "error") return i.reject(f, E.value);
          var x = E.value;
          if (x) n(f, x);
          else {
            f.state = w, f.outcome = k;
            for (var A = -1, F = f.queue.length; ++A < F; ) f.queue[A].callFulfilled(k);
          }
          return f;
        }, i.reject = function(f, k) {
          f.state = c, f.outcome = k;
          for (var E = -1, x = f.queue.length; ++E < x; ) f.queue[E].callRejected(k);
          return f;
        }, h.resolve = function(f) {
          return f instanceof this ? f : i.resolve(new this(s), f);
        }, h.reject = function(f) {
          var k = new this(s);
          return i.reject(k, f);
        }, h.all = function(f) {
          var k = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = f.length, x = !1;
          if (!E) return this.resolve([]);
          for (var A = new Array(E), F = 0, P = -1, D = new this(s); ++P < E; ) M(f[P], P);
          return D;
          function M(W, J) {
            k.resolve(W).then(function(S) {
              A[J] = S, ++F !== E || x || (x = !0, i.resolve(D, A));
            }, function(S) {
              x || (x = !0, i.reject(D, S));
            });
          }
        }, h.race = function(f) {
          var k = this;
          if (Object.prototype.toString.call(f) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = f.length, x = !1;
          if (!E) return this.resolve([]);
          for (var A = -1, F = new this(s); ++A < E; ) P = f[A], k.resolve(P).then(function(D) {
            x || (x = !0, i.resolve(F, D));
          }, function(D) {
            x || (x = !0, i.reject(F, D));
          });
          var P;
          return F;
        };
      }, { immediate: 36 }], 38: [function(r, u, d) {
        var a = {};
        (0, r("./lib/utils/common").assign)(a, r("./lib/deflate"), r("./lib/inflate"), r("./lib/zlib/constants")), u.exports = a;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(r, u, d) {
        var a = r("./zlib/deflate"), s = r("./utils/common"), i = r("./utils/strings"), c = r("./zlib/messages"), w = r("./zlib/zstream"), _ = Object.prototype.toString, h = 0, y = -1, l = 0, m = 8;
        function n(f) {
          if (!(this instanceof n)) return new n(f);
          this.options = s.assign({ level: y, method: m, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: l, to: "" }, f || {});
          var k = this.options;
          k.raw && 0 < k.windowBits ? k.windowBits = -k.windowBits : k.gzip && 0 < k.windowBits && k.windowBits < 16 && (k.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
          var E = a.deflateInit2(this.strm, k.level, k.method, k.windowBits, k.memLevel, k.strategy);
          if (E !== h) throw new Error(c[E]);
          if (k.header && a.deflateSetHeader(this.strm, k.header), k.dictionary) {
            var x;
            if (x = typeof k.dictionary == "string" ? i.string2buf(k.dictionary) : _.call(k.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(k.dictionary) : k.dictionary, (E = a.deflateSetDictionary(this.strm, x)) !== h) throw new Error(c[E]);
            this._dict_set = !0;
          }
        }
        function p(f, k) {
          var E = new n(k);
          if (E.push(f, !0), E.err) throw E.msg || c[E.err];
          return E.result;
        }
        n.prototype.push = function(f, k) {
          var E, x, A = this.strm, F = this.options.chunkSize;
          if (this.ended) return !1;
          x = k === ~~k ? k : k === !0 ? 4 : 0, typeof f == "string" ? A.input = i.string2buf(f) : _.call(f) === "[object ArrayBuffer]" ? A.input = new Uint8Array(f) : A.input = f, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new s.Buf8(F), A.next_out = 0, A.avail_out = F), (E = a.deflate(A, x)) !== 1 && E !== h) return this.onEnd(E), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || x !== 4 && x !== 2) || (this.options.to === "string" ? this.onData(i.buf2binstring(s.shrinkBuf(A.output, A.next_out))) : this.onData(s.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && E !== 1);
          return x === 4 ? (E = a.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === h) : x !== 2 || (this.onEnd(h), !(A.avail_out = 0));
        }, n.prototype.onData = function(f) {
          this.chunks.push(f);
        }, n.prototype.onEnd = function(f) {
          f === h && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = f, this.msg = this.strm.msg;
        }, d.Deflate = n, d.deflate = p, d.deflateRaw = function(f, k) {
          return (k = k || {}).raw = !0, p(f, k);
        }, d.gzip = function(f, k) {
          return (k = k || {}).gzip = !0, p(f, k);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(r, u, d) {
        var a = r("./zlib/inflate"), s = r("./utils/common"), i = r("./utils/strings"), c = r("./zlib/constants"), w = r("./zlib/messages"), _ = r("./zlib/zstream"), h = r("./zlib/gzheader"), y = Object.prototype.toString;
        function l(n) {
          if (!(this instanceof l)) return new l(n);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, n || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || n && n.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(), this.strm.avail_out = 0;
          var f = a.inflateInit2(this.strm, p.windowBits);
          if (f !== c.Z_OK) throw new Error(w[f]);
          this.header = new h(), a.inflateGetHeader(this.strm, this.header);
        }
        function m(n, p) {
          var f = new l(p);
          if (f.push(n, !0), f.err) throw f.msg || w[f.err];
          return f.result;
        }
        l.prototype.push = function(n, p) {
          var f, k, E, x, A, F, P = this.strm, D = this.options.chunkSize, M = this.options.dictionary, W = !1;
          if (this.ended) return !1;
          k = p === ~~p ? p : p === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof n == "string" ? P.input = i.binstring2buf(n) : y.call(n) === "[object ArrayBuffer]" ? P.input = new Uint8Array(n) : P.input = n, P.next_in = 0, P.avail_in = P.input.length;
          do {
            if (P.avail_out === 0 && (P.output = new s.Buf8(D), P.next_out = 0, P.avail_out = D), (f = a.inflate(P, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && M && (F = typeof M == "string" ? i.string2buf(M) : y.call(M) === "[object ArrayBuffer]" ? new Uint8Array(M) : M, f = a.inflateSetDictionary(this.strm, F)), f === c.Z_BUF_ERROR && W === !0 && (f = c.Z_OK, W = !1), f !== c.Z_STREAM_END && f !== c.Z_OK) return this.onEnd(f), !(this.ended = !0);
            P.next_out && (P.avail_out !== 0 && f !== c.Z_STREAM_END && (P.avail_in !== 0 || k !== c.Z_FINISH && k !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = i.utf8border(P.output, P.next_out), x = P.next_out - E, A = i.buf2string(P.output, E), P.next_out = x, P.avail_out = D - x, x && s.arraySet(P.output, P.output, E, x, 0), this.onData(A)) : this.onData(s.shrinkBuf(P.output, P.next_out)))), P.avail_in === 0 && P.avail_out === 0 && (W = !0);
          } while ((0 < P.avail_in || P.avail_out === 0) && f !== c.Z_STREAM_END);
          return f === c.Z_STREAM_END && (k = c.Z_FINISH), k === c.Z_FINISH ? (f = a.inflateEnd(this.strm), this.onEnd(f), this.ended = !0, f === c.Z_OK) : k !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(P.avail_out = 0));
        }, l.prototype.onData = function(n) {
          this.chunks.push(n);
        }, l.prototype.onEnd = function(n) {
          n === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = n, this.msg = this.strm.msg;
        }, d.Inflate = l, d.inflate = m, d.inflateRaw = function(n, p) {
          return (p = p || {}).raw = !0, m(n, p);
        }, d.ungzip = m;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(r, u, d) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        d.assign = function(c) {
          for (var w = Array.prototype.slice.call(arguments, 1); w.length; ) {
            var _ = w.shift();
            if (_) {
              if (typeof _ != "object") throw new TypeError(_ + "must be non-object");
              for (var h in _) _.hasOwnProperty(h) && (c[h] = _[h]);
            }
          }
          return c;
        }, d.shrinkBuf = function(c, w) {
          return c.length === w ? c : c.subarray ? c.subarray(0, w) : (c.length = w, c);
        };
        var s = { arraySet: function(c, w, _, h, y) {
          if (w.subarray && c.subarray) c.set(w.subarray(_, _ + h), y);
          else for (var l = 0; l < h; l++) c[y + l] = w[_ + l];
        }, flattenChunks: function(c) {
          var w, _, h, y, l, m;
          for (w = h = 0, _ = c.length; w < _; w++) h += c[w].length;
          for (m = new Uint8Array(h), w = y = 0, _ = c.length; w < _; w++) l = c[w], m.set(l, y), y += l.length;
          return m;
        } }, i = { arraySet: function(c, w, _, h, y) {
          for (var l = 0; l < h; l++) c[y + l] = w[_ + l];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        d.setTyped = function(c) {
          c ? (d.Buf8 = Uint8Array, d.Buf16 = Uint16Array, d.Buf32 = Int32Array, d.assign(d, s)) : (d.Buf8 = Array, d.Buf16 = Array, d.Buf32 = Array, d.assign(d, i));
        }, d.setTyped(a);
      }, {}], 42: [function(r, u, d) {
        var a = r("./common"), s = !0, i = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          i = !1;
        }
        for (var c = new a.Buf8(256), w = 0; w < 256; w++) c[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
        function _(h, y) {
          if (y < 65537 && (h.subarray && i || !h.subarray && s)) return String.fromCharCode.apply(null, a.shrinkBuf(h, y));
          for (var l = "", m = 0; m < y; m++) l += String.fromCharCode(h[m]);
          return l;
        }
        c[254] = c[254] = 1, d.string2buf = function(h) {
          var y, l, m, n, p, f = h.length, k = 0;
          for (n = 0; n < f; n++) (64512 & (l = h.charCodeAt(n))) == 55296 && n + 1 < f && (64512 & (m = h.charCodeAt(n + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), n++), k += l < 128 ? 1 : l < 2048 ? 2 : l < 65536 ? 3 : 4;
          for (y = new a.Buf8(k), n = p = 0; p < k; n++) (64512 & (l = h.charCodeAt(n))) == 55296 && n + 1 < f && (64512 & (m = h.charCodeAt(n + 1))) == 56320 && (l = 65536 + (l - 55296 << 10) + (m - 56320), n++), l < 128 ? y[p++] = l : (l < 2048 ? y[p++] = 192 | l >>> 6 : (l < 65536 ? y[p++] = 224 | l >>> 12 : (y[p++] = 240 | l >>> 18, y[p++] = 128 | l >>> 12 & 63), y[p++] = 128 | l >>> 6 & 63), y[p++] = 128 | 63 & l);
          return y;
        }, d.buf2binstring = function(h) {
          return _(h, h.length);
        }, d.binstring2buf = function(h) {
          for (var y = new a.Buf8(h.length), l = 0, m = y.length; l < m; l++) y[l] = h.charCodeAt(l);
          return y;
        }, d.buf2string = function(h, y) {
          var l, m, n, p, f = y || h.length, k = new Array(2 * f);
          for (l = m = 0; l < f; ) if ((n = h[l++]) < 128) k[m++] = n;
          else if (4 < (p = c[n])) k[m++] = 65533, l += p - 1;
          else {
            for (n &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && l < f; ) n = n << 6 | 63 & h[l++], p--;
            1 < p ? k[m++] = 65533 : n < 65536 ? k[m++] = n : (n -= 65536, k[m++] = 55296 | n >> 10 & 1023, k[m++] = 56320 | 1023 & n);
          }
          return _(k, m);
        }, d.utf8border = function(h, y) {
          var l;
          for ((y = y || h.length) > h.length && (y = h.length), l = y - 1; 0 <= l && (192 & h[l]) == 128; ) l--;
          return l < 0 || l === 0 ? y : l + c[h[l]] > y ? l : y;
        };
      }, { "./common": 41 }], 43: [function(r, u, d) {
        u.exports = function(a, s, i, c) {
          for (var w = 65535 & a | 0, _ = a >>> 16 & 65535 | 0, h = 0; i !== 0; ) {
            for (i -= h = 2e3 < i ? 2e3 : i; _ = _ + (w = w + s[c++] | 0) | 0, --h; ) ;
            w %= 65521, _ %= 65521;
          }
          return w | _ << 16 | 0;
        };
      }, {}], 44: [function(r, u, d) {
        u.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(r, u, d) {
        var a = (function() {
          for (var s, i = [], c = 0; c < 256; c++) {
            s = c;
            for (var w = 0; w < 8; w++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            i[c] = s;
          }
          return i;
        })();
        u.exports = function(s, i, c, w) {
          var _ = a, h = w + c;
          s ^= -1;
          for (var y = w; y < h; y++) s = s >>> 8 ^ _[255 & (s ^ i[y])];
          return -1 ^ s;
        };
      }, {}], 46: [function(r, u, d) {
        var a, s = r("../utils/common"), i = r("./trees"), c = r("./adler32"), w = r("./crc32"), _ = r("./messages"), h = 0, y = 4, l = 0, m = -2, n = -1, p = 4, f = 2, k = 8, E = 9, x = 286, A = 30, F = 19, P = 2 * x + 1, D = 15, M = 3, W = 258, J = W + M + 1, S = 42, N = 113, o = 1, L = 2, tt = 3, X = 4;
        function et(e, O) {
          return e.msg = _[O], O;
        }
        function T(e) {
          return (e << 1) - (4 < e ? 9 : 0);
        }
        function Z(e) {
          for (var O = e.length; 0 <= --O; ) e[O] = 0;
        }
        function C(e) {
          var O = e.state, I = O.pending;
          I > e.avail_out && (I = e.avail_out), I !== 0 && (s.arraySet(e.output, O.pending_buf, O.pending_out, I, e.next_out), e.next_out += I, O.pending_out += I, e.total_out += I, e.avail_out -= I, O.pending -= I, O.pending === 0 && (O.pending_out = 0));
        }
        function R(e, O) {
          i._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, O), e.block_start = e.strstart, C(e.strm);
        }
        function V(e, O) {
          e.pending_buf[e.pending++] = O;
        }
        function H(e, O) {
          e.pending_buf[e.pending++] = O >>> 8 & 255, e.pending_buf[e.pending++] = 255 & O;
        }
        function U(e, O) {
          var I, v, g = e.max_chain_length, z = e.strstart, j = e.prev_length, $ = e.nice_match, B = e.strstart > e.w_size - J ? e.strstart - (e.w_size - J) : 0, Y = e.window, K = e.w_mask, q = e.prev, Q = e.strstart + W, dt = Y[z + j - 1], at = Y[z + j];
          e.prev_length >= e.good_match && (g >>= 2), $ > e.lookahead && ($ = e.lookahead);
          do
            if (Y[(I = O) + j] === at && Y[I + j - 1] === dt && Y[I] === Y[z] && Y[++I] === Y[z + 1]) {
              z += 2, I++;
              do
                ;
              while (Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && Y[++z] === Y[++I] && z < Q);
              if (v = W - (Q - z), z = Q - W, j < v) {
                if (e.match_start = O, $ <= (j = v)) break;
                dt = Y[z + j - 1], at = Y[z + j];
              }
            }
          while ((O = q[O & K]) > B && --g != 0);
          return j <= e.lookahead ? j : e.lookahead;
        }
        function nt(e) {
          var O, I, v, g, z, j, $, B, Y, K, q = e.w_size;
          do {
            if (g = e.window_size - e.lookahead - e.strstart, e.strstart >= q + (q - J)) {
              for (s.arraySet(e.window, e.window, q, q, 0), e.match_start -= q, e.strstart -= q, e.block_start -= q, O = I = e.hash_size; v = e.head[--O], e.head[O] = q <= v ? v - q : 0, --I; ) ;
              for (O = I = q; v = e.prev[--O], e.prev[O] = q <= v ? v - q : 0, --I; ) ;
              g += q;
            }
            if (e.strm.avail_in === 0) break;
            if (j = e.strm, $ = e.window, B = e.strstart + e.lookahead, Y = g, K = void 0, K = j.avail_in, Y < K && (K = Y), I = K === 0 ? 0 : (j.avail_in -= K, s.arraySet($, j.input, j.next_in, K, B), j.state.wrap === 1 ? j.adler = c(j.adler, $, K, B) : j.state.wrap === 2 && (j.adler = w(j.adler, $, K, B)), j.next_in += K, j.total_in += K, K), e.lookahead += I, e.lookahead + e.insert >= M) for (z = e.strstart - e.insert, e.ins_h = e.window[z], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[z + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[z + M - 1]) & e.hash_mask, e.prev[z & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = z, z++, e.insert--, !(e.lookahead + e.insert < M)); ) ;
          } while (e.lookahead < J && e.strm.avail_in !== 0);
        }
        function ct(e, O) {
          for (var I, v; ; ) {
            if (e.lookahead < J) {
              if (nt(e), e.lookahead < J && O === h) return o;
              if (e.lookahead === 0) break;
            }
            if (I = 0, e.lookahead >= M && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + M - 1]) & e.hash_mask, I = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), I !== 0 && e.strstart - I <= e.w_size - J && (e.match_length = U(e, I)), e.match_length >= M) if (v = i._tr_tally(e, e.strstart - e.match_start, e.match_length - M), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= M) {
              for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + M - 1]) & e.hash_mask, I = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, --e.match_length != 0; ) ;
              e.strstart++;
            } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
            else v = i._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
            if (v && (R(e, !1), e.strm.avail_out === 0)) return o;
          }
          return e.insert = e.strstart < M - 1 ? e.strstart : M - 1, O === y ? (R(e, !0), e.strm.avail_out === 0 ? tt : X) : e.last_lit && (R(e, !1), e.strm.avail_out === 0) ? o : L;
        }
        function rt(e, O) {
          for (var I, v, g; ; ) {
            if (e.lookahead < J) {
              if (nt(e), e.lookahead < J && O === h) return o;
              if (e.lookahead === 0) break;
            }
            if (I = 0, e.lookahead >= M && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + M - 1]) & e.hash_mask, I = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = M - 1, I !== 0 && e.prev_length < e.max_lazy_match && e.strstart - I <= e.w_size - J && (e.match_length = U(e, I), e.match_length <= 5 && (e.strategy === 1 || e.match_length === M && 4096 < e.strstart - e.match_start) && (e.match_length = M - 1)), e.prev_length >= M && e.match_length <= e.prev_length) {
              for (g = e.strstart + e.lookahead - M, v = i._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - M), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= g && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + M - 1]) & e.hash_mask, I = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), --e.prev_length != 0; ) ;
              if (e.match_available = 0, e.match_length = M - 1, e.strstart++, v && (R(e, !1), e.strm.avail_out === 0)) return o;
            } else if (e.match_available) {
              if ((v = i._tr_tally(e, 0, e.window[e.strstart - 1])) && R(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return o;
            } else e.match_available = 1, e.strstart++, e.lookahead--;
          }
          return e.match_available && (v = i._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < M - 1 ? e.strstart : M - 1, O === y ? (R(e, !0), e.strm.avail_out === 0 ? tt : X) : e.last_lit && (R(e, !1), e.strm.avail_out === 0) ? o : L;
        }
        function it(e, O, I, v, g) {
          this.good_length = e, this.max_lazy = O, this.nice_length = I, this.max_chain = v, this.func = g;
        }
        function st() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = k, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * P), this.dyn_dtree = new s.Buf16(2 * (2 * A + 1)), this.bl_tree = new s.Buf16(2 * (2 * F + 1)), Z(this.dyn_ltree), Z(this.dyn_dtree), Z(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(D + 1), this.heap = new s.Buf16(2 * x + 1), Z(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * x + 1), Z(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function lt(e) {
          var O;
          return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = f, (O = e.state).pending = 0, O.pending_out = 0, O.wrap < 0 && (O.wrap = -O.wrap), O.status = O.wrap ? S : N, e.adler = O.wrap === 2 ? 0 : 1, O.last_flush = h, i._tr_init(O), l) : et(e, m);
        }
        function ot(e) {
          var O = lt(e);
          return O === l && (function(I) {
            I.window_size = 2 * I.w_size, Z(I.head), I.max_lazy_match = a[I.level].max_lazy, I.good_match = a[I.level].good_length, I.nice_match = a[I.level].nice_length, I.max_chain_length = a[I.level].max_chain, I.strstart = 0, I.block_start = 0, I.lookahead = 0, I.insert = 0, I.match_length = I.prev_length = M - 1, I.match_available = 0, I.ins_h = 0;
          })(e.state), O;
        }
        function G(e, O, I, v, g, z) {
          if (!e) return m;
          var j = 1;
          if (O === n && (O = 6), v < 0 ? (j = 0, v = -v) : 15 < v && (j = 2, v -= 16), g < 1 || E < g || I !== k || v < 8 || 15 < v || O < 0 || 9 < O || z < 0 || p < z) return et(e, m);
          v === 8 && (v = 9);
          var $ = new st();
          return (e.state = $).strm = e, $.wrap = j, $.gzhead = null, $.w_bits = v, $.w_size = 1 << $.w_bits, $.w_mask = $.w_size - 1, $.hash_bits = g + 7, $.hash_size = 1 << $.hash_bits, $.hash_mask = $.hash_size - 1, $.hash_shift = ~~(($.hash_bits + M - 1) / M), $.window = new s.Buf8(2 * $.w_size), $.head = new s.Buf16($.hash_size), $.prev = new s.Buf16($.w_size), $.lit_bufsize = 1 << g + 6, $.pending_buf_size = 4 * $.lit_bufsize, $.pending_buf = new s.Buf8($.pending_buf_size), $.d_buf = 1 * $.lit_bufsize, $.l_buf = 3 * $.lit_bufsize, $.level = O, $.strategy = z, $.method = I, ot(e);
        }
        a = [new it(0, 0, 0, 0, function(e, O) {
          var I = 65535;
          for (I > e.pending_buf_size - 5 && (I = e.pending_buf_size - 5); ; ) {
            if (e.lookahead <= 1) {
              if (nt(e), e.lookahead === 0 && O === h) return o;
              if (e.lookahead === 0) break;
            }
            e.strstart += e.lookahead, e.lookahead = 0;
            var v = e.block_start + I;
            if ((e.strstart === 0 || e.strstart >= v) && (e.lookahead = e.strstart - v, e.strstart = v, R(e, !1), e.strm.avail_out === 0) || e.strstart - e.block_start >= e.w_size - J && (R(e, !1), e.strm.avail_out === 0)) return o;
          }
          return e.insert = 0, O === y ? (R(e, !0), e.strm.avail_out === 0 ? tt : X) : (e.strstart > e.block_start && (R(e, !1), e.strm.avail_out), o);
        }), new it(4, 4, 8, 4, ct), new it(4, 5, 16, 8, ct), new it(4, 6, 32, 32, ct), new it(4, 4, 16, 16, rt), new it(8, 16, 32, 32, rt), new it(8, 16, 128, 128, rt), new it(8, 32, 128, 256, rt), new it(32, 128, 258, 1024, rt), new it(32, 258, 258, 4096, rt)], d.deflateInit = function(e, O) {
          return G(e, O, k, 15, 8, 0);
        }, d.deflateInit2 = G, d.deflateReset = ot, d.deflateResetKeep = lt, d.deflateSetHeader = function(e, O) {
          return e && e.state ? e.state.wrap !== 2 ? m : (e.state.gzhead = O, l) : m;
        }, d.deflate = function(e, O) {
          var I, v, g, z;
          if (!e || !e.state || 5 < O || O < 0) return e ? et(e, m) : m;
          if (v = e.state, !e.output || !e.input && e.avail_in !== 0 || v.status === 666 && O !== y) return et(e, e.avail_out === 0 ? -5 : m);
          if (v.strm = e, I = v.last_flush, v.last_flush = O, v.status === S) if (v.wrap === 2) e.adler = 0, V(v, 31), V(v, 139), V(v, 8), v.gzhead ? (V(v, (v.gzhead.text ? 1 : 0) + (v.gzhead.hcrc ? 2 : 0) + (v.gzhead.extra ? 4 : 0) + (v.gzhead.name ? 8 : 0) + (v.gzhead.comment ? 16 : 0)), V(v, 255 & v.gzhead.time), V(v, v.gzhead.time >> 8 & 255), V(v, v.gzhead.time >> 16 & 255), V(v, v.gzhead.time >> 24 & 255), V(v, v.level === 9 ? 2 : 2 <= v.strategy || v.level < 2 ? 4 : 0), V(v, 255 & v.gzhead.os), v.gzhead.extra && v.gzhead.extra.length && (V(v, 255 & v.gzhead.extra.length), V(v, v.gzhead.extra.length >> 8 & 255)), v.gzhead.hcrc && (e.adler = w(e.adler, v.pending_buf, v.pending, 0)), v.gzindex = 0, v.status = 69) : (V(v, 0), V(v, 0), V(v, 0), V(v, 0), V(v, 0), V(v, v.level === 9 ? 2 : 2 <= v.strategy || v.level < 2 ? 4 : 0), V(v, 3), v.status = N);
          else {
            var j = k + (v.w_bits - 8 << 4) << 8;
            j |= (2 <= v.strategy || v.level < 2 ? 0 : v.level < 6 ? 1 : v.level === 6 ? 2 : 3) << 6, v.strstart !== 0 && (j |= 32), j += 31 - j % 31, v.status = N, H(v, j), v.strstart !== 0 && (H(v, e.adler >>> 16), H(v, 65535 & e.adler)), e.adler = 1;
          }
          if (v.status === 69) if (v.gzhead.extra) {
            for (g = v.pending; v.gzindex < (65535 & v.gzhead.extra.length) && (v.pending !== v.pending_buf_size || (v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), C(e), g = v.pending, v.pending !== v.pending_buf_size)); ) V(v, 255 & v.gzhead.extra[v.gzindex]), v.gzindex++;
            v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), v.gzindex === v.gzhead.extra.length && (v.gzindex = 0, v.status = 73);
          } else v.status = 73;
          if (v.status === 73) if (v.gzhead.name) {
            g = v.pending;
            do {
              if (v.pending === v.pending_buf_size && (v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), C(e), g = v.pending, v.pending === v.pending_buf_size)) {
                z = 1;
                break;
              }
              z = v.gzindex < v.gzhead.name.length ? 255 & v.gzhead.name.charCodeAt(v.gzindex++) : 0, V(v, z);
            } while (z !== 0);
            v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), z === 0 && (v.gzindex = 0, v.status = 91);
          } else v.status = 91;
          if (v.status === 91) if (v.gzhead.comment) {
            g = v.pending;
            do {
              if (v.pending === v.pending_buf_size && (v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), C(e), g = v.pending, v.pending === v.pending_buf_size)) {
                z = 1;
                break;
              }
              z = v.gzindex < v.gzhead.comment.length ? 255 & v.gzhead.comment.charCodeAt(v.gzindex++) : 0, V(v, z);
            } while (z !== 0);
            v.gzhead.hcrc && v.pending > g && (e.adler = w(e.adler, v.pending_buf, v.pending - g, g)), z === 0 && (v.status = 103);
          } else v.status = 103;
          if (v.status === 103 && (v.gzhead.hcrc ? (v.pending + 2 > v.pending_buf_size && C(e), v.pending + 2 <= v.pending_buf_size && (V(v, 255 & e.adler), V(v, e.adler >> 8 & 255), e.adler = 0, v.status = N)) : v.status = N), v.pending !== 0) {
            if (C(e), e.avail_out === 0) return v.last_flush = -1, l;
          } else if (e.avail_in === 0 && T(O) <= T(I) && O !== y) return et(e, -5);
          if (v.status === 666 && e.avail_in !== 0) return et(e, -5);
          if (e.avail_in !== 0 || v.lookahead !== 0 || O !== h && v.status !== 666) {
            var $ = v.strategy === 2 ? (function(B, Y) {
              for (var K; ; ) {
                if (B.lookahead === 0 && (nt(B), B.lookahead === 0)) {
                  if (Y === h) return o;
                  break;
                }
                if (B.match_length = 0, K = i._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++, K && (R(B, !1), B.strm.avail_out === 0)) return o;
              }
              return B.insert = 0, Y === y ? (R(B, !0), B.strm.avail_out === 0 ? tt : X) : B.last_lit && (R(B, !1), B.strm.avail_out === 0) ? o : L;
            })(v, O) : v.strategy === 3 ? (function(B, Y) {
              for (var K, q, Q, dt, at = B.window; ; ) {
                if (B.lookahead <= W) {
                  if (nt(B), B.lookahead <= W && Y === h) return o;
                  if (B.lookahead === 0) break;
                }
                if (B.match_length = 0, B.lookahead >= M && 0 < B.strstart && (q = at[Q = B.strstart - 1]) === at[++Q] && q === at[++Q] && q === at[++Q]) {
                  dt = B.strstart + W;
                  do
                    ;
                  while (q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && q === at[++Q] && Q < dt);
                  B.match_length = W - (dt - Q), B.match_length > B.lookahead && (B.match_length = B.lookahead);
                }
                if (B.match_length >= M ? (K = i._tr_tally(B, 1, B.match_length - M), B.lookahead -= B.match_length, B.strstart += B.match_length, B.match_length = 0) : (K = i._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++), K && (R(B, !1), B.strm.avail_out === 0)) return o;
              }
              return B.insert = 0, Y === y ? (R(B, !0), B.strm.avail_out === 0 ? tt : X) : B.last_lit && (R(B, !1), B.strm.avail_out === 0) ? o : L;
            })(v, O) : a[v.level].func(v, O);
            if ($ !== tt && $ !== X || (v.status = 666), $ === o || $ === tt) return e.avail_out === 0 && (v.last_flush = -1), l;
            if ($ === L && (O === 1 ? i._tr_align(v) : O !== 5 && (i._tr_stored_block(v, 0, 0, !1), O === 3 && (Z(v.head), v.lookahead === 0 && (v.strstart = 0, v.block_start = 0, v.insert = 0))), C(e), e.avail_out === 0)) return v.last_flush = -1, l;
          }
          return O !== y ? l : v.wrap <= 0 ? 1 : (v.wrap === 2 ? (V(v, 255 & e.adler), V(v, e.adler >> 8 & 255), V(v, e.adler >> 16 & 255), V(v, e.adler >> 24 & 255), V(v, 255 & e.total_in), V(v, e.total_in >> 8 & 255), V(v, e.total_in >> 16 & 255), V(v, e.total_in >> 24 & 255)) : (H(v, e.adler >>> 16), H(v, 65535 & e.adler)), C(e), 0 < v.wrap && (v.wrap = -v.wrap), v.pending !== 0 ? l : 1);
        }, d.deflateEnd = function(e) {
          var O;
          return e && e.state ? (O = e.state.status) !== S && O !== 69 && O !== 73 && O !== 91 && O !== 103 && O !== N && O !== 666 ? et(e, m) : (e.state = null, O === N ? et(e, -3) : l) : m;
        }, d.deflateSetDictionary = function(e, O) {
          var I, v, g, z, j, $, B, Y, K = O.length;
          if (!e || !e.state || (z = (I = e.state).wrap) === 2 || z === 1 && I.status !== S || I.lookahead) return m;
          for (z === 1 && (e.adler = c(e.adler, O, K, 0)), I.wrap = 0, K >= I.w_size && (z === 0 && (Z(I.head), I.strstart = 0, I.block_start = 0, I.insert = 0), Y = new s.Buf8(I.w_size), s.arraySet(Y, O, K - I.w_size, I.w_size, 0), O = Y, K = I.w_size), j = e.avail_in, $ = e.next_in, B = e.input, e.avail_in = K, e.next_in = 0, e.input = O, nt(I); I.lookahead >= M; ) {
            for (v = I.strstart, g = I.lookahead - (M - 1); I.ins_h = (I.ins_h << I.hash_shift ^ I.window[v + M - 1]) & I.hash_mask, I.prev[v & I.w_mask] = I.head[I.ins_h], I.head[I.ins_h] = v, v++, --g; ) ;
            I.strstart = v, I.lookahead = M - 1, nt(I);
          }
          return I.strstart += I.lookahead, I.block_start = I.strstart, I.insert = I.lookahead, I.lookahead = 0, I.match_length = I.prev_length = M - 1, I.match_available = 0, e.next_in = $, e.input = B, e.avail_in = j, I.wrap = z, l;
        }, d.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(r, u, d) {
        u.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(r, u, d) {
        u.exports = function(a, s) {
          var i, c, w, _, h, y, l, m, n, p, f, k, E, x, A, F, P, D, M, W, J, S, N, o, L;
          i = a.state, c = a.next_in, o = a.input, w = c + (a.avail_in - 5), _ = a.next_out, L = a.output, h = _ - (s - a.avail_out), y = _ + (a.avail_out - 257), l = i.dmax, m = i.wsize, n = i.whave, p = i.wnext, f = i.window, k = i.hold, E = i.bits, x = i.lencode, A = i.distcode, F = (1 << i.lenbits) - 1, P = (1 << i.distbits) - 1;
          t: do {
            E < 15 && (k += o[c++] << E, E += 8, k += o[c++] << E, E += 8), D = x[k & F];
            e: for (; ; ) {
              if (k >>>= M = D >>> 24, E -= M, (M = D >>> 16 & 255) === 0) L[_++] = 65535 & D;
              else {
                if (!(16 & M)) {
                  if ((64 & M) == 0) {
                    D = x[(65535 & D) + (k & (1 << M) - 1)];
                    continue e;
                  }
                  if (32 & M) {
                    i.mode = 12;
                    break t;
                  }
                  a.msg = "invalid literal/length code", i.mode = 30;
                  break t;
                }
                W = 65535 & D, (M &= 15) && (E < M && (k += o[c++] << E, E += 8), W += k & (1 << M) - 1, k >>>= M, E -= M), E < 15 && (k += o[c++] << E, E += 8, k += o[c++] << E, E += 8), D = A[k & P];
                r: for (; ; ) {
                  if (k >>>= M = D >>> 24, E -= M, !(16 & (M = D >>> 16 & 255))) {
                    if ((64 & M) == 0) {
                      D = A[(65535 & D) + (k & (1 << M) - 1)];
                      continue r;
                    }
                    a.msg = "invalid distance code", i.mode = 30;
                    break t;
                  }
                  if (J = 65535 & D, E < (M &= 15) && (k += o[c++] << E, (E += 8) < M && (k += o[c++] << E, E += 8)), l < (J += k & (1 << M) - 1)) {
                    a.msg = "invalid distance too far back", i.mode = 30;
                    break t;
                  }
                  if (k >>>= M, E -= M, (M = _ - h) < J) {
                    if (n < (M = J - M) && i.sane) {
                      a.msg = "invalid distance too far back", i.mode = 30;
                      break t;
                    }
                    if (N = f, (S = 0) === p) {
                      if (S += m - M, M < W) {
                        for (W -= M; L[_++] = f[S++], --M; ) ;
                        S = _ - J, N = L;
                      }
                    } else if (p < M) {
                      if (S += m + p - M, (M -= p) < W) {
                        for (W -= M; L[_++] = f[S++], --M; ) ;
                        if (S = 0, p < W) {
                          for (W -= M = p; L[_++] = f[S++], --M; ) ;
                          S = _ - J, N = L;
                        }
                      }
                    } else if (S += p - M, M < W) {
                      for (W -= M; L[_++] = f[S++], --M; ) ;
                      S = _ - J, N = L;
                    }
                    for (; 2 < W; ) L[_++] = N[S++], L[_++] = N[S++], L[_++] = N[S++], W -= 3;
                    W && (L[_++] = N[S++], 1 < W && (L[_++] = N[S++]));
                  } else {
                    for (S = _ - J; L[_++] = L[S++], L[_++] = L[S++], L[_++] = L[S++], 2 < (W -= 3); ) ;
                    W && (L[_++] = L[S++], 1 < W && (L[_++] = L[S++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < w && _ < y);
          c -= W = E >> 3, k &= (1 << (E -= W << 3)) - 1, a.next_in = c, a.next_out = _, a.avail_in = c < w ? w - c + 5 : 5 - (c - w), a.avail_out = _ < y ? y - _ + 257 : 257 - (_ - y), i.hold = k, i.bits = E;
        };
      }, {}], 49: [function(r, u, d) {
        var a = r("../utils/common"), s = r("./adler32"), i = r("./crc32"), c = r("./inffast"), w = r("./inftrees"), _ = 1, h = 2, y = 0, l = -2, m = 1, n = 852, p = 592;
        function f(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function k() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new a.Buf16(320), this.work = new a.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function E(S) {
          var N;
          return S && S.state ? (N = S.state, S.total_in = S.total_out = N.total = 0, S.msg = "", N.wrap && (S.adler = 1 & N.wrap), N.mode = m, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new a.Buf32(n), N.distcode = N.distdyn = new a.Buf32(p), N.sane = 1, N.back = -1, y) : l;
        }
        function x(S) {
          var N;
          return S && S.state ? ((N = S.state).wsize = 0, N.whave = 0, N.wnext = 0, E(S)) : l;
        }
        function A(S, N) {
          var o, L;
          return S && S.state ? (L = S.state, N < 0 ? (o = 0, N = -N) : (o = 1 + (N >> 4), N < 48 && (N &= 15)), N && (N < 8 || 15 < N) ? l : (L.window !== null && L.wbits !== N && (L.window = null), L.wrap = o, L.wbits = N, x(S))) : l;
        }
        function F(S, N) {
          var o, L;
          return S ? (L = new k(), (S.state = L).window = null, (o = A(S, N)) !== y && (S.state = null), o) : l;
        }
        var P, D, M = !0;
        function W(S) {
          if (M) {
            var N;
            for (P = new a.Buf32(512), D = new a.Buf32(32), N = 0; N < 144; ) S.lens[N++] = 8;
            for (; N < 256; ) S.lens[N++] = 9;
            for (; N < 280; ) S.lens[N++] = 7;
            for (; N < 288; ) S.lens[N++] = 8;
            for (w(_, S.lens, 0, 288, P, 0, S.work, { bits: 9 }), N = 0; N < 32; ) S.lens[N++] = 5;
            w(h, S.lens, 0, 32, D, 0, S.work, { bits: 5 }), M = !1;
          }
          S.lencode = P, S.lenbits = 9, S.distcode = D, S.distbits = 5;
        }
        function J(S, N, o, L) {
          var tt, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new a.Buf8(X.wsize)), L >= X.wsize ? (a.arraySet(X.window, N, o - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (L < (tt = X.wsize - X.wnext) && (tt = L), a.arraySet(X.window, N, o - L, tt, X.wnext), (L -= tt) ? (a.arraySet(X.window, N, o - L, L, 0), X.wnext = L, X.whave = X.wsize) : (X.wnext += tt, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += tt))), 0;
        }
        d.inflateReset = x, d.inflateReset2 = A, d.inflateResetKeep = E, d.inflateInit = function(S) {
          return F(S, 15);
        }, d.inflateInit2 = F, d.inflate = function(S, N) {
          var o, L, tt, X, et, T, Z, C, R, V, H, U, nt, ct, rt, it, st, lt, ot, G, e, O, I, v, g = 0, z = new a.Buf8(4), j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return l;
          (o = S.state).mode === 12 && (o.mode = 13), et = S.next_out, tt = S.output, Z = S.avail_out, X = S.next_in, L = S.input, T = S.avail_in, C = o.hold, R = o.bits, V = T, H = Z, O = y;
          t: for (; ; ) switch (o.mode) {
            case m:
              if (o.wrap === 0) {
                o.mode = 13;
                break;
              }
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              if (2 & o.wrap && C === 35615) {
                z[o.check = 0] = 255 & C, z[1] = C >>> 8 & 255, o.check = i(o.check, z, 2, 0), R = C = 0, o.mode = 2;
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
              if (R -= 4, e = 8 + (15 & (C >>>= 4)), o.wbits === 0) o.wbits = e;
              else if (e > o.wbits) {
                S.msg = "invalid window size", o.mode = 30;
                break;
              }
              o.dmax = 1 << e, S.adler = o.check = 1, o.mode = 512 & C ? 10 : 12, R = C = 0;
              break;
            case 2:
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              if (o.flags = C, (255 & o.flags) != 8) {
                S.msg = "unknown compression method", o.mode = 30;
                break;
              }
              if (57344 & o.flags) {
                S.msg = "unknown header flags set", o.mode = 30;
                break;
              }
              o.head && (o.head.text = C >> 8 & 1), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = i(o.check, z, 2, 0)), R = C = 0, o.mode = 3;
            case 3:
              for (; R < 32; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              o.head && (o.head.time = C), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, z[2] = C >>> 16 & 255, z[3] = C >>> 24 & 255, o.check = i(o.check, z, 4, 0)), R = C = 0, o.mode = 4;
            case 4:
              for (; R < 16; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              o.head && (o.head.xflags = 255 & C, o.head.os = C >> 8), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = i(o.check, z, 2, 0)), R = C = 0, o.mode = 5;
            case 5:
              if (1024 & o.flags) {
                for (; R < 16; ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
                }
                o.length = C, o.head && (o.head.extra_len = C), 512 & o.flags && (z[0] = 255 & C, z[1] = C >>> 8 & 255, o.check = i(o.check, z, 2, 0)), R = C = 0;
              } else o.head && (o.head.extra = null);
              o.mode = 6;
            case 6:
              if (1024 & o.flags && (T < (U = o.length) && (U = T), U && (o.head && (e = o.head.extra_len - o.length, o.head.extra || (o.head.extra = new Array(o.head.extra_len)), a.arraySet(o.head.extra, L, X, U, e)), 512 & o.flags && (o.check = i(o.check, L, U, X)), T -= U, X += U, o.length -= U), o.length)) break t;
              o.length = 0, o.mode = 7;
            case 7:
              if (2048 & o.flags) {
                if (T === 0) break t;
                for (U = 0; e = L[X + U++], o.head && e && o.length < 65536 && (o.head.name += String.fromCharCode(e)), e && U < T; ) ;
                if (512 & o.flags && (o.check = i(o.check, L, U, X)), T -= U, X += U, e) break t;
              } else o.head && (o.head.name = null);
              o.length = 0, o.mode = 8;
            case 8:
              if (4096 & o.flags) {
                if (T === 0) break t;
                for (U = 0; e = L[X + U++], o.head && e && o.length < 65536 && (o.head.comment += String.fromCharCode(e)), e && U < T; ) ;
                if (512 & o.flags && (o.check = i(o.check, L, U, X)), T -= U, X += U, e) break t;
              } else o.head && (o.head.comment = null);
              o.mode = 9;
            case 9:
              if (512 & o.flags) {
                for (; R < 16; ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
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
                T--, C += L[X++] << R, R += 8;
              }
              S.adler = o.check = f(C), R = C = 0, o.mode = 11;
            case 11:
              if (o.havedict === 0) return S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, 2;
              S.adler = o.check = 1, o.mode = 12;
            case 12:
              if (N === 5 || N === 6) break t;
            case 13:
              if (o.last) {
                C >>>= 7 & R, R -= 7 & R, o.mode = 27;
                break;
              }
              for (; R < 3; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              switch (o.last = 1 & C, R -= 1, 3 & (C >>>= 1)) {
                case 0:
                  o.mode = 14;
                  break;
                case 1:
                  if (W(o), o.mode = 20, N !== 6) break;
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
                T--, C += L[X++] << R, R += 8;
              }
              if ((65535 & C) != (C >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", o.mode = 30;
                break;
              }
              if (o.length = 65535 & C, R = C = 0, o.mode = 15, N === 6) break t;
            case 15:
              o.mode = 16;
            case 16:
              if (U = o.length) {
                if (T < U && (U = T), Z < U && (U = Z), U === 0) break t;
                a.arraySet(tt, L, X, U, et), T -= U, X += U, Z -= U, et += U, o.length -= U;
                break;
              }
              o.mode = 12;
              break;
            case 17:
              for (; R < 14; ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
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
                  T--, C += L[X++] << R, R += 8;
                }
                o.lens[j[o.have++]] = 7 & C, C >>>= 3, R -= 3;
              }
              for (; o.have < 19; ) o.lens[j[o.have++]] = 0;
              if (o.lencode = o.lendyn, o.lenbits = 7, I = { bits: o.lenbits }, O = w(0, o.lens, 0, 19, o.lencode, 0, o.work, I), o.lenbits = I.bits, O) {
                S.msg = "invalid code lengths set", o.mode = 30;
                break;
              }
              o.have = 0, o.mode = 19;
            case 19:
              for (; o.have < o.nlen + o.ndist; ) {
                for (; it = (g = o.lencode[C & (1 << o.lenbits) - 1]) >>> 16 & 255, st = 65535 & g, !((rt = g >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
                }
                if (st < 16) C >>>= rt, R -= rt, o.lens[o.have++] = st;
                else {
                  if (st === 16) {
                    for (v = rt + 2; R < v; ) {
                      if (T === 0) break t;
                      T--, C += L[X++] << R, R += 8;
                    }
                    if (C >>>= rt, R -= rt, o.have === 0) {
                      S.msg = "invalid bit length repeat", o.mode = 30;
                      break;
                    }
                    e = o.lens[o.have - 1], U = 3 + (3 & C), C >>>= 2, R -= 2;
                  } else if (st === 17) {
                    for (v = rt + 3; R < v; ) {
                      if (T === 0) break t;
                      T--, C += L[X++] << R, R += 8;
                    }
                    R -= rt, e = 0, U = 3 + (7 & (C >>>= rt)), C >>>= 3, R -= 3;
                  } else {
                    for (v = rt + 7; R < v; ) {
                      if (T === 0) break t;
                      T--, C += L[X++] << R, R += 8;
                    }
                    R -= rt, e = 0, U = 11 + (127 & (C >>>= rt)), C >>>= 7, R -= 7;
                  }
                  if (o.have + U > o.nlen + o.ndist) {
                    S.msg = "invalid bit length repeat", o.mode = 30;
                    break;
                  }
                  for (; U--; ) o.lens[o.have++] = e;
                }
              }
              if (o.mode === 30) break;
              if (o.lens[256] === 0) {
                S.msg = "invalid code -- missing end-of-block", o.mode = 30;
                break;
              }
              if (o.lenbits = 9, I = { bits: o.lenbits }, O = w(_, o.lens, 0, o.nlen, o.lencode, 0, o.work, I), o.lenbits = I.bits, O) {
                S.msg = "invalid literal/lengths set", o.mode = 30;
                break;
              }
              if (o.distbits = 6, o.distcode = o.distdyn, I = { bits: o.distbits }, O = w(h, o.lens, o.nlen, o.ndist, o.distcode, 0, o.work, I), o.distbits = I.bits, O) {
                S.msg = "invalid distances set", o.mode = 30;
                break;
              }
              if (o.mode = 20, N === 6) break t;
            case 20:
              o.mode = 21;
            case 21:
              if (6 <= T && 258 <= Z) {
                S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, c(S, H), et = S.next_out, tt = S.output, Z = S.avail_out, X = S.next_in, L = S.input, T = S.avail_in, C = o.hold, R = o.bits, o.mode === 12 && (o.back = -1);
                break;
              }
              for (o.back = 0; it = (g = o.lencode[C & (1 << o.lenbits) - 1]) >>> 16 & 255, st = 65535 & g, !((rt = g >>> 24) <= R); ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              if (it && (240 & it) == 0) {
                for (lt = rt, ot = it, G = st; it = (g = o.lencode[G + ((C & (1 << lt + ot) - 1) >> lt)]) >>> 16 & 255, st = 65535 & g, !(lt + (rt = g >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
                }
                C >>>= lt, R -= lt, o.back += lt;
              }
              if (C >>>= rt, R -= rt, o.back += rt, o.length = st, it === 0) {
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
                for (v = o.extra; R < v; ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
                }
                o.length += C & (1 << o.extra) - 1, C >>>= o.extra, R -= o.extra, o.back += o.extra;
              }
              o.was = o.length, o.mode = 23;
            case 23:
              for (; it = (g = o.distcode[C & (1 << o.distbits) - 1]) >>> 16 & 255, st = 65535 & g, !((rt = g >>> 24) <= R); ) {
                if (T === 0) break t;
                T--, C += L[X++] << R, R += 8;
              }
              if ((240 & it) == 0) {
                for (lt = rt, ot = it, G = st; it = (g = o.distcode[G + ((C & (1 << lt + ot) - 1) >> lt)]) >>> 16 & 255, st = 65535 & g, !(lt + (rt = g >>> 24) <= R); ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
                }
                C >>>= lt, R -= lt, o.back += lt;
              }
              if (C >>>= rt, R -= rt, o.back += rt, 64 & it) {
                S.msg = "invalid distance code", o.mode = 30;
                break;
              }
              o.offset = st, o.extra = 15 & it, o.mode = 24;
            case 24:
              if (o.extra) {
                for (v = o.extra; R < v; ) {
                  if (T === 0) break t;
                  T--, C += L[X++] << R, R += 8;
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
              if (U = H - Z, o.offset > U) {
                if ((U = o.offset - U) > o.whave && o.sane) {
                  S.msg = "invalid distance too far back", o.mode = 30;
                  break;
                }
                nt = U > o.wnext ? (U -= o.wnext, o.wsize - U) : o.wnext - U, U > o.length && (U = o.length), ct = o.window;
              } else ct = tt, nt = et - o.offset, U = o.length;
              for (Z < U && (U = Z), Z -= U, o.length -= U; tt[et++] = ct[nt++], --U; ) ;
              o.length === 0 && (o.mode = 21);
              break;
            case 26:
              if (Z === 0) break t;
              tt[et++] = o.length, Z--, o.mode = 21;
              break;
            case 27:
              if (o.wrap) {
                for (; R < 32; ) {
                  if (T === 0) break t;
                  T--, C |= L[X++] << R, R += 8;
                }
                if (H -= Z, S.total_out += H, o.total += H, H && (S.adler = o.check = o.flags ? i(o.check, tt, H, et - H) : s(o.check, tt, H, et - H)), H = Z, (o.flags ? C : f(C)) !== o.check) {
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
                  T--, C += L[X++] << R, R += 8;
                }
                if (C !== (4294967295 & o.total)) {
                  S.msg = "incorrect length check", o.mode = 30;
                  break;
                }
                R = C = 0;
              }
              o.mode = 29;
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
              return l;
          }
          return S.next_out = et, S.avail_out = Z, S.next_in = X, S.avail_in = T, o.hold = C, o.bits = R, (o.wsize || H !== S.avail_out && o.mode < 30 && (o.mode < 27 || N !== 4)) && J(S, S.output, S.next_out, H - S.avail_out) ? (o.mode = 31, -4) : (V -= S.avail_in, H -= S.avail_out, S.total_in += V, S.total_out += H, o.total += H, o.wrap && H && (S.adler = o.check = o.flags ? i(o.check, tt, H, S.next_out - H) : s(o.check, tt, H, S.next_out - H)), S.data_type = o.bits + (o.last ? 64 : 0) + (o.mode === 12 ? 128 : 0) + (o.mode === 20 || o.mode === 15 ? 256 : 0), (V == 0 && H === 0 || N === 4) && O === y && (O = -5), O);
        }, d.inflateEnd = function(S) {
          if (!S || !S.state) return l;
          var N = S.state;
          return N.window && (N.window = null), S.state = null, y;
        }, d.inflateGetHeader = function(S, N) {
          var o;
          return S && S.state ? (2 & (o = S.state).wrap) == 0 ? l : ((o.head = N).done = !1, y) : l;
        }, d.inflateSetDictionary = function(S, N) {
          var o, L = N.length;
          return S && S.state ? (o = S.state).wrap !== 0 && o.mode !== 11 ? l : o.mode === 11 && s(1, N, L, 0) !== o.check ? -3 : J(S, N, L, L) ? (o.mode = 31, -4) : (o.havedict = 1, y) : l;
        }, d.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(r, u, d) {
        var a = r("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], i = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], w = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        u.exports = function(_, h, y, l, m, n, p, f) {
          var k, E, x, A, F, P, D, M, W, J = f.bits, S = 0, N = 0, o = 0, L = 0, tt = 0, X = 0, et = 0, T = 0, Z = 0, C = 0, R = null, V = 0, H = new a.Buf16(16), U = new a.Buf16(16), nt = null, ct = 0;
          for (S = 0; S <= 15; S++) H[S] = 0;
          for (N = 0; N < l; N++) H[h[y + N]]++;
          for (tt = J, L = 15; 1 <= L && H[L] === 0; L--) ;
          if (L < tt && (tt = L), L === 0) return m[n++] = 20971520, m[n++] = 20971520, f.bits = 1, 0;
          for (o = 1; o < L && H[o] === 0; o++) ;
          for (tt < o && (tt = o), S = T = 1; S <= 15; S++) if (T <<= 1, (T -= H[S]) < 0) return -1;
          if (0 < T && (_ === 0 || L !== 1)) return -1;
          for (U[1] = 0, S = 1; S < 15; S++) U[S + 1] = U[S] + H[S];
          for (N = 0; N < l; N++) h[y + N] !== 0 && (p[U[h[y + N]]++] = N);
          if (P = _ === 0 ? (R = nt = p, 19) : _ === 1 ? (R = s, V -= 257, nt = i, ct -= 257, 256) : (R = c, nt = w, -1), S = o, F = n, et = N = C = 0, x = -1, A = (Z = 1 << (X = tt)) - 1, _ === 1 && 852 < Z || _ === 2 && 592 < Z) return 1;
          for (; ; ) {
            for (D = S - et, W = p[N] < P ? (M = 0, p[N]) : p[N] > P ? (M = nt[ct + p[N]], R[V + p[N]]) : (M = 96, 0), k = 1 << S - et, o = E = 1 << X; m[F + (C >> et) + (E -= k)] = D << 24 | M << 16 | W | 0, E !== 0; ) ;
            for (k = 1 << S - 1; C & k; ) k >>= 1;
            if (k !== 0 ? (C &= k - 1, C += k) : C = 0, N++, --H[S] == 0) {
              if (S === L) break;
              S = h[y + p[N]];
            }
            if (tt < S && (C & A) !== x) {
              for (et === 0 && (et = tt), F += o, T = 1 << (X = S - et); X + et < L && !((T -= H[X + et]) <= 0); ) X++, T <<= 1;
              if (Z += 1 << X, _ === 1 && 852 < Z || _ === 2 && 592 < Z) return 1;
              m[x = C & A] = tt << 24 | X << 16 | F - n | 0;
            }
          }
          return C !== 0 && (m[F + C] = S - et << 24 | 64 << 16 | 0), f.bits = tt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(r, u, d) {
        u.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(r, u, d) {
        var a = r("../utils/common"), s = 0, i = 1;
        function c(g) {
          for (var z = g.length; 0 <= --z; ) g[z] = 0;
        }
        var w = 0, _ = 29, h = 256, y = h + 1 + _, l = 30, m = 19, n = 2 * y + 1, p = 15, f = 16, k = 7, E = 256, x = 16, A = 17, F = 18, P = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], D = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], M = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], J = new Array(2 * (y + 2));
        c(J);
        var S = new Array(2 * l);
        c(S);
        var N = new Array(512);
        c(N);
        var o = new Array(256);
        c(o);
        var L = new Array(_);
        c(L);
        var tt, X, et, T = new Array(l);
        function Z(g, z, j, $, B) {
          this.static_tree = g, this.extra_bits = z, this.extra_base = j, this.elems = $, this.max_length = B, this.has_stree = g && g.length;
        }
        function C(g, z) {
          this.dyn_tree = g, this.max_code = 0, this.stat_desc = z;
        }
        function R(g) {
          return g < 256 ? N[g] : N[256 + (g >>> 7)];
        }
        function V(g, z) {
          g.pending_buf[g.pending++] = 255 & z, g.pending_buf[g.pending++] = z >>> 8 & 255;
        }
        function H(g, z, j) {
          g.bi_valid > f - j ? (g.bi_buf |= z << g.bi_valid & 65535, V(g, g.bi_buf), g.bi_buf = z >> f - g.bi_valid, g.bi_valid += j - f) : (g.bi_buf |= z << g.bi_valid & 65535, g.bi_valid += j);
        }
        function U(g, z, j) {
          H(g, j[2 * z], j[2 * z + 1]);
        }
        function nt(g, z) {
          for (var j = 0; j |= 1 & g, g >>>= 1, j <<= 1, 0 < --z; ) ;
          return j >>> 1;
        }
        function ct(g, z, j) {
          var $, B, Y = new Array(p + 1), K = 0;
          for ($ = 1; $ <= p; $++) Y[$] = K = K + j[$ - 1] << 1;
          for (B = 0; B <= z; B++) {
            var q = g[2 * B + 1];
            q !== 0 && (g[2 * B] = nt(Y[q]++, q));
          }
        }
        function rt(g) {
          var z;
          for (z = 0; z < y; z++) g.dyn_ltree[2 * z] = 0;
          for (z = 0; z < l; z++) g.dyn_dtree[2 * z] = 0;
          for (z = 0; z < m; z++) g.bl_tree[2 * z] = 0;
          g.dyn_ltree[2 * E] = 1, g.opt_len = g.static_len = 0, g.last_lit = g.matches = 0;
        }
        function it(g) {
          8 < g.bi_valid ? V(g, g.bi_buf) : 0 < g.bi_valid && (g.pending_buf[g.pending++] = g.bi_buf), g.bi_buf = 0, g.bi_valid = 0;
        }
        function st(g, z, j, $) {
          var B = 2 * z, Y = 2 * j;
          return g[B] < g[Y] || g[B] === g[Y] && $[z] <= $[j];
        }
        function lt(g, z, j) {
          for (var $ = g.heap[j], B = j << 1; B <= g.heap_len && (B < g.heap_len && st(z, g.heap[B + 1], g.heap[B], g.depth) && B++, !st(z, $, g.heap[B], g.depth)); ) g.heap[j] = g.heap[B], j = B, B <<= 1;
          g.heap[j] = $;
        }
        function ot(g, z, j) {
          var $, B, Y, K, q = 0;
          if (g.last_lit !== 0) for (; $ = g.pending_buf[g.d_buf + 2 * q] << 8 | g.pending_buf[g.d_buf + 2 * q + 1], B = g.pending_buf[g.l_buf + q], q++, $ === 0 ? U(g, B, z) : (U(g, (Y = o[B]) + h + 1, z), (K = P[Y]) !== 0 && H(g, B -= L[Y], K), U(g, Y = R(--$), j), (K = D[Y]) !== 0 && H(g, $ -= T[Y], K)), q < g.last_lit; ) ;
          U(g, E, z);
        }
        function G(g, z) {
          var j, $, B, Y = z.dyn_tree, K = z.stat_desc.static_tree, q = z.stat_desc.has_stree, Q = z.stat_desc.elems, dt = -1;
          for (g.heap_len = 0, g.heap_max = n, j = 0; j < Q; j++) Y[2 * j] !== 0 ? (g.heap[++g.heap_len] = dt = j, g.depth[j] = 0) : Y[2 * j + 1] = 0;
          for (; g.heap_len < 2; ) Y[2 * (B = g.heap[++g.heap_len] = dt < 2 ? ++dt : 0)] = 1, g.depth[B] = 0, g.opt_len--, q && (g.static_len -= K[2 * B + 1]);
          for (z.max_code = dt, j = g.heap_len >> 1; 1 <= j; j--) lt(g, Y, j);
          for (B = Q; j = g.heap[1], g.heap[1] = g.heap[g.heap_len--], lt(g, Y, 1), $ = g.heap[1], g.heap[--g.heap_max] = j, g.heap[--g.heap_max] = $, Y[2 * B] = Y[2 * j] + Y[2 * $], g.depth[B] = (g.depth[j] >= g.depth[$] ? g.depth[j] : g.depth[$]) + 1, Y[2 * j + 1] = Y[2 * $ + 1] = B, g.heap[1] = B++, lt(g, Y, 1), 2 <= g.heap_len; ) ;
          g.heap[--g.heap_max] = g.heap[1], (function(at, ht) {
            var gt, _t, Ct, ft, Ot, Lt, vt = ht.dyn_tree, $t = ht.max_code, le = ht.stat_desc.static_tree, ce = ht.stat_desc.has_stree, de = ht.stat_desc.extra_bits, Yt = ht.stat_desc.extra_base, Mt = ht.stat_desc.max_length, Pt = 0;
            for (ft = 0; ft <= p; ft++) at.bl_count[ft] = 0;
            for (vt[2 * at.heap[at.heap_max] + 1] = 0, gt = at.heap_max + 1; gt < n; gt++) Mt < (ft = vt[2 * vt[2 * (_t = at.heap[gt]) + 1] + 1] + 1) && (ft = Mt, Pt++), vt[2 * _t + 1] = ft, $t < _t || (at.bl_count[ft]++, Ot = 0, Yt <= _t && (Ot = de[_t - Yt]), Lt = vt[2 * _t], at.opt_len += Lt * (ft + Ot), ce && (at.static_len += Lt * (le[2 * _t + 1] + Ot)));
            if (Pt !== 0) {
              do {
                for (ft = Mt - 1; at.bl_count[ft] === 0; ) ft--;
                at.bl_count[ft]--, at.bl_count[ft + 1] += 2, at.bl_count[Mt]--, Pt -= 2;
              } while (0 < Pt);
              for (ft = Mt; ft !== 0; ft--) for (_t = at.bl_count[ft]; _t !== 0; ) $t < (Ct = at.heap[--gt]) || (vt[2 * Ct + 1] !== ft && (at.opt_len += (ft - vt[2 * Ct + 1]) * vt[2 * Ct], vt[2 * Ct + 1] = ft), _t--);
            }
          })(g, z), ct(Y, dt, g.bl_count);
        }
        function e(g, z, j) {
          var $, B, Y = -1, K = z[1], q = 0, Q = 7, dt = 4;
          for (K === 0 && (Q = 138, dt = 3), z[2 * (j + 1) + 1] = 65535, $ = 0; $ <= j; $++) B = K, K = z[2 * ($ + 1) + 1], ++q < Q && B === K || (q < dt ? g.bl_tree[2 * B] += q : B !== 0 ? (B !== Y && g.bl_tree[2 * B]++, g.bl_tree[2 * x]++) : q <= 10 ? g.bl_tree[2 * A]++ : g.bl_tree[2 * F]++, Y = B, dt = (q = 0) === K ? (Q = 138, 3) : B === K ? (Q = 6, 3) : (Q = 7, 4));
        }
        function O(g, z, j) {
          var $, B, Y = -1, K = z[1], q = 0, Q = 7, dt = 4;
          for (K === 0 && (Q = 138, dt = 3), $ = 0; $ <= j; $++) if (B = K, K = z[2 * ($ + 1) + 1], !(++q < Q && B === K)) {
            if (q < dt) for (; U(g, B, g.bl_tree), --q != 0; ) ;
            else B !== 0 ? (B !== Y && (U(g, B, g.bl_tree), q--), U(g, x, g.bl_tree), H(g, q - 3, 2)) : q <= 10 ? (U(g, A, g.bl_tree), H(g, q - 3, 3)) : (U(g, F, g.bl_tree), H(g, q - 11, 7));
            Y = B, dt = (q = 0) === K ? (Q = 138, 3) : B === K ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        c(T);
        var I = !1;
        function v(g, z, j, $) {
          H(g, (w << 1) + ($ ? 1 : 0), 3), (function(B, Y, K, q) {
            it(B), V(B, K), V(B, ~K), a.arraySet(B.pending_buf, B.window, Y, K, B.pending), B.pending += K;
          })(g, z, j);
        }
        d._tr_init = function(g) {
          I || ((function() {
            var z, j, $, B, Y, K = new Array(p + 1);
            for (B = $ = 0; B < _ - 1; B++) for (L[B] = $, z = 0; z < 1 << P[B]; z++) o[$++] = B;
            for (o[$ - 1] = B, B = Y = 0; B < 16; B++) for (T[B] = Y, z = 0; z < 1 << D[B]; z++) N[Y++] = B;
            for (Y >>= 7; B < l; B++) for (T[B] = Y << 7, z = 0; z < 1 << D[B] - 7; z++) N[256 + Y++] = B;
            for (j = 0; j <= p; j++) K[j] = 0;
            for (z = 0; z <= 143; ) J[2 * z + 1] = 8, z++, K[8]++;
            for (; z <= 255; ) J[2 * z + 1] = 9, z++, K[9]++;
            for (; z <= 279; ) J[2 * z + 1] = 7, z++, K[7]++;
            for (; z <= 287; ) J[2 * z + 1] = 8, z++, K[8]++;
            for (ct(J, y + 1, K), z = 0; z < l; z++) S[2 * z + 1] = 5, S[2 * z] = nt(z, 5);
            tt = new Z(J, P, h + 1, y, p), X = new Z(S, D, 0, l, p), et = new Z(new Array(0), M, 0, m, k);
          })(), I = !0), g.l_desc = new C(g.dyn_ltree, tt), g.d_desc = new C(g.dyn_dtree, X), g.bl_desc = new C(g.bl_tree, et), g.bi_buf = 0, g.bi_valid = 0, rt(g);
        }, d._tr_stored_block = v, d._tr_flush_block = function(g, z, j, $) {
          var B, Y, K = 0;
          0 < g.level ? (g.strm.data_type === 2 && (g.strm.data_type = (function(q) {
            var Q, dt = 4093624447;
            for (Q = 0; Q <= 31; Q++, dt >>>= 1) if (1 & dt && q.dyn_ltree[2 * Q] !== 0) return s;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return i;
            for (Q = 32; Q < h; Q++) if (q.dyn_ltree[2 * Q] !== 0) return i;
            return s;
          })(g)), G(g, g.l_desc), G(g, g.d_desc), K = (function(q) {
            var Q;
            for (e(q, q.dyn_ltree, q.l_desc.max_code), e(q, q.dyn_dtree, q.d_desc.max_code), G(q, q.bl_desc), Q = m - 1; 3 <= Q && q.bl_tree[2 * W[Q] + 1] === 0; Q--) ;
            return q.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          })(g), B = g.opt_len + 3 + 7 >>> 3, (Y = g.static_len + 3 + 7 >>> 3) <= B && (B = Y)) : B = Y = j + 5, j + 4 <= B && z !== -1 ? v(g, z, j, $) : g.strategy === 4 || Y === B ? (H(g, 2 + ($ ? 1 : 0), 3), ot(g, J, S)) : (H(g, 4 + ($ ? 1 : 0), 3), (function(q, Q, dt, at) {
            var ht;
            for (H(q, Q - 257, 5), H(q, dt - 1, 5), H(q, at - 4, 4), ht = 0; ht < at; ht++) H(q, q.bl_tree[2 * W[ht] + 1], 3);
            O(q, q.dyn_ltree, Q - 1), O(q, q.dyn_dtree, dt - 1);
          })(g, g.l_desc.max_code + 1, g.d_desc.max_code + 1, K + 1), ot(g, g.dyn_ltree, g.dyn_dtree)), rt(g), $ && it(g);
        }, d._tr_tally = function(g, z, j) {
          return g.pending_buf[g.d_buf + 2 * g.last_lit] = z >>> 8 & 255, g.pending_buf[g.d_buf + 2 * g.last_lit + 1] = 255 & z, g.pending_buf[g.l_buf + g.last_lit] = 255 & j, g.last_lit++, z === 0 ? g.dyn_ltree[2 * j]++ : (g.matches++, z--, g.dyn_ltree[2 * (o[j] + h + 1)]++, g.dyn_dtree[2 * R(z)]++), g.last_lit === g.lit_bufsize - 1;
        }, d._tr_align = function(g) {
          H(g, 2, 3), U(g, E, J), (function(z) {
            z.bi_valid === 16 ? (V(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(g);
        };
      }, { "../utils/common": 41 }], 53: [function(r, u, d) {
        u.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(r, u, d) {
        (function(a) {
          (function(s, i) {
            if (!s.setImmediate) {
              var c, w, _, h, y = 1, l = {}, m = !1, n = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, c = {}.toString.call(s.process) === "[object process]" ? function(x) {
                process.nextTick(function() {
                  k(x);
                });
              } : (function() {
                if (s.postMessage && !s.importScripts) {
                  var x = !0, A = s.onmessage;
                  return s.onmessage = function() {
                    x = !1;
                  }, s.postMessage("", "*"), s.onmessage = A, x;
                }
              })() ? (h = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", E, !1) : s.attachEvent("onmessage", E), function(x) {
                s.postMessage(h + x, "*");
              }) : s.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(x) {
                k(x.data);
              }, function(x) {
                _.port2.postMessage(x);
              }) : n && "onreadystatechange" in n.createElement("script") ? (w = n.documentElement, function(x) {
                var A = n.createElement("script");
                A.onreadystatechange = function() {
                  k(x), A.onreadystatechange = null, w.removeChild(A), A = null;
                }, w.appendChild(A);
              }) : function(x) {
                setTimeout(k, 0, x);
              }, p.setImmediate = function(x) {
                typeof x != "function" && (x = new Function("" + x));
                for (var A = new Array(arguments.length - 1), F = 0; F < A.length; F++) A[F] = arguments[F + 1];
                var P = { callback: x, args: A };
                return l[y] = P, c(y), y++;
              }, p.clearImmediate = f;
            }
            function f(x) {
              delete l[x];
            }
            function k(x) {
              if (m) setTimeout(k, 0, x);
              else {
                var A = l[x];
                if (A) {
                  m = !0;
                  try {
                    (function(F) {
                      var P = F.callback, D = F.args;
                      switch (D.length) {
                        case 0:
                          P();
                          break;
                        case 1:
                          P(D[0]);
                          break;
                        case 2:
                          P(D[0], D[1]);
                          break;
                        case 3:
                          P(D[0], D[1], D[2]);
                          break;
                        default:
                          P.apply(i, D);
                      }
                    })(A);
                  } finally {
                    f(x), m = !1;
                  }
                }
              }
            }
            function E(x) {
              x.source === s && typeof x.data == "string" && x.data.indexOf(h) === 0 && k(+x.data.slice(h.length));
            }
          })(typeof self > "u" ? a === void 0 ? this : a : self);
        }).call(this, typeof Ft < "u" ? Ft : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Ut)), Ut.exports;
}
var fe = ue();
const ee = /* @__PURE__ */ he(fe);
async function me(b) {
  const t = await pe(b), r = await ee.loadAsync(t), u = [];
  return r.forEach((d, a) => {
    if (a.dir)
      return;
    const s = ge(d);
    u.push({
      name: s,
      text: () => a.async("text"),
      arrayBuffer: () => a.async("arraybuffer")
    });
  }), u;
}
async function pe(b) {
  if (b instanceof ArrayBuffer)
    return b;
  if (b instanceof Blob)
    return await b.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function ge(b) {
  let t = b.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ye(b) {
  return !!b && typeof b == "object" && !(b instanceof ArrayBuffer) && !(b instanceof Uint8Array);
}
function be(b) {
  return b instanceof Uint8Array ? b : new Uint8Array(b);
}
function _e(b) {
  return b.byteOffset === 0 && b.byteLength === b.buffer.byteLength ? b.buffer : b.slice().buffer;
}
function Et(b, t, r = 0) {
  if (b.length < r + t.length) return !1;
  for (let u = 0; u < t.length; u++)
    if (b[r + u] !== t[u]) return !1;
  return !0;
}
function ve(b) {
  return Et(b, [80, 75, 3, 4]) || Et(b, [80, 75, 5, 6]) || Et(b, [80, 75, 7, 8]) ? "zip" : Et(b, [82, 97, 114, 33, 26, 7, 0]) || Et(b, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : Et(b, [55, 122, 188, 175, 39, 28]) ? "7z" : b.length > 262 && Et(b, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function re(b) {
  return b.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Gt(b) {
  const t = [], r = b.map((n) => re(n).toLowerCase()), u = (n) => r.some(n), d = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, a = /\.(drl|xln)$/i, s = r.filter((n) => d.test(n)).length, i = r.filter((n) => a.test(n) || n.includes("drill")).length, c = u((n) => n.includes("top") && n.includes("copper") || n.endsWith(".gtl")), w = u((n) => n.includes("bot") || n.includes("bottom") || n.endsWith(".gbl")), _ = u((n) => n.includes("mask") || n.includes("solder") || n.endsWith(".gts") || n.endsWith(".gbs")), h = u((n) => n.includes("silk") || n.includes("legend") || n.endsWith(".gto") || n.endsWith(".gbo")), y = u((n) => n.includes("outline") || n.includes("profile") || n.includes("edge") || n.endsWith(".gko") || n.endsWith(".gm1") || n.endsWith(".gml")), l = r.every(
    (n) => n.endsWith(".pdf") || n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".svg") || n.endsWith(".txt") || n.endsWith(".md")
  );
  let m = 0;
  return b.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : l ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (s > 0 ? (m += 0.35, t.push(`Found ${s} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), i > 0 && (m += 0.2, t.push(`Found ${i} drill-like file(s).`)), y && (m += 0.15, t.push("Found outline/profile/edge candidate.")), c && w ? (m += 0.2, t.push("Found both top and bottom copper candidates.")) : (c || w) && (m += 0.1, t.push("Found at least one copper candidate.")), _ && (m += 0.05, t.push("Found solder mask candidate.")), h && (m += 0.05, t.push("Found silkscreen/legend candidate.")), m = Math.max(0, Math.min(1, m)), m < 0.6 && s >= 2 && (m = Math.max(m, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: m, reasons: t });
}
async function we(b) {
  if (ye(b)) {
    const a = Object.keys(b).map(re), { confidence: s, reasons: i } = Gt(a);
    return {
      isGerber: s >= 0.6,
      archiveType: "directory",
      confidence: s,
      reasons: i,
      files: a
    };
  }
  const t = be(b), r = ve(t);
  if (r === "zip")
    try {
      const a = _e(t), i = (await me(a)).map((_) => _.name), { confidence: c, reasons: w } = Gt(i);
      return {
        isGerber: c >= 0.6,
        archiveType: "zip",
        confidence: c,
        reasons: w,
        files: i
      };
    } catch (a) {
      return {
        isGerber: !1,
        archiveType: "zip",
        confidence: 0.1,
        reasons: ["Looks like a zip, but failed to read as zip.", String(a)]
      };
    }
  if (r === "rar" || r === "7z" || r === "tar")
    return {
      isGerber: !1,
      archiveType: r,
      confidence: 0.2,
      reasons: [
        `Detected ${r} archive by signature.`,
        "Archive type is not unpacked by default. Use list/detect for UX, or add a decoder to render."
      ]
    };
  const u = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return u.includes("%FSLAX") || u.includes("%MOIN") || u.includes("%MOMM") || u.includes("G04") || u.includes("%ADD") ? {
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
  constructor(t, r, u) {
    super(r), this.name = "GerberError", this.code = t, this.details = u;
  }
}
function ie(b) {
  let t = b.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function ke(b) {
  return b instanceof Uint8Array ? b : new Uint8Array(b);
}
function ne(b) {
  try {
    return b.slice().buffer;
  } catch {
    const t = new Uint8Array(b.byteLength);
    return t.set(b), t.buffer;
  }
}
async function xe(b) {
  let t;
  try {
    t = await ee.loadAsync(ne(b));
  } catch (i) {
    throw new mt(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      i
    );
  }
  const r = {}, u = 1e3, d = 100 * 1024 * 1024, a = Object.entries(t.files).filter(([, i]) => i && !i.dir);
  if (a.length > u)
    throw new mt(
      "PARSE_ERROR",
      `ZIP contains too many files (${a.length} > ${u})`
    );
  let s = 0;
  for (const [i, c] of a)
    try {
      const w = ie(i), _ = await c.async("arraybuffer");
      if (s += _.byteLength, s > d)
        throw new mt(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${d} bytes)`
        );
      r[w] = new Uint8Array(_);
    } catch (w) {
      console.warn(`Failed to extract file ${i}:`, w);
    }
  if (Object.keys(r).length === 0)
    throw new mt("PARSE_ERROR", "No files extracted from ZIP archive");
  return r;
}
async function Se(b, t) {
  let r;
  try {
    const h = await import("./libarchive-Bt1VdZR0.js");
    r = h.Archive ?? h.default?.Archive;
  } catch (h) {
    throw new mt(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      h
    );
  }
  if (!r)
    throw new mt("PARSE_ERROR", "libarchive.js did not export Archive");
  if (t?.workerUrl)
    try {
      r.init({ workerUrl: t.workerUrl });
    } catch (h) {
      throw new mt(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        h
      );
    }
  let u;
  try {
    const h = new Blob([ne(b)], { type: "application/octet-stream" });
    u = await r.open(h);
  } catch (h) {
    throw new mt("NOT_AN_ARCHIVE", "Failed to open RAR archive", h);
  }
  let d;
  try {
    d = await Promise.race([
      u.extractFiles(),
      new Promise(
        (h, y) => setTimeout(() => y(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (h) {
    throw new mt("PARSE_ERROR", "Failed to extract RAR archive", h);
  }
  const a = {};
  let s = 0;
  const i = 1e3, c = 100 * 1024 * 1024;
  let w = 0;
  async function _(h, y) {
    if (s >= i)
      throw new mt(
        "PARSE_ERROR",
        `Archive contains too many files (max ${i})`
      );
    for (const l of Object.keys(h)) {
      const m = h[l], n = y ? `${y}/${l}` : l;
      if (m instanceof File || m instanceof Blob) {
        s++;
        try {
          const p = await m.arrayBuffer();
          if (w += p.byteLength, w > c)
            throw new mt(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${c} bytes)`
            );
          a[ie(n)] = new Uint8Array(p);
        } catch (p) {
          console.warn(`Failed to extract file ${n}:`, p);
        }
      } else m && typeof m == "object" && await _(m, n);
    }
  }
  try {
    await _(d, "");
  } finally {
    if (u && typeof u.close == "function")
      try {
        await u.close();
      } catch (h) {
        console.warn("Failed to close archive:", h);
      }
  }
  if (Object.keys(a).length === 0)
    throw new mt("PARSE_ERROR", "No files extracted from RAR archive");
  return a;
}
async function se(b, t) {
  if (!b || b.byteLength === 0)
    throw new mt("NOT_AN_ARCHIVE", "Input is empty");
  const r = ke(b), u = 100 * 1024 * 1024;
  if (r.length > u)
    throw new mt(
      "PARSE_ERROR",
      `Input size (${r.length} bytes) exceeds maximum allowed size (${u} bytes)`
    );
  let d;
  try {
    d = await we(r);
  } catch (a) {
    throw new mt("PARSE_ERROR", "Failed to detect archive type", a);
  }
  if (!d.isGerber)
    throw new mt(
      "NOT_GERBER",
      d.reasons.join("; ") || "Not a Gerber bundle",
      d
    );
  try {
    if (d.archiveType === "zip")
      return { archiveType: "zip", files: await xe(r) };
    if (d.archiveType === "rar")
      return { archiveType: "rar", files: await Se(r, t) };
    throw new mt(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${d.archiveType}`,
      d
    );
  } catch (a) {
    throw a instanceof mt ? a : new mt(
      "PARSE_ERROR",
      a instanceof Error ? a.message : "Unknown error during extraction",
      { error: a, det: d }
    );
  }
}
function jt(b) {
  return b.toLowerCase();
}
function xt(b, t) {
  const r = new Set(t.map((d) => d.toLowerCase()));
  return b.filter((d) => {
    const a = jt(d), s = a.lastIndexOf(".");
    return s < 0 ? !1 : r.has(a.slice(s));
  }).sort((d, a) => d.length - a.length)[0];
}
function ut(b, t) {
  const r = t.map((d) => d.toLowerCase());
  return b.filter((d) => {
    const a = jt(d);
    return r.every((s) => a.includes(s));
  }).sort((d, a) => d.length - a.length)[0];
}
function Ee(b) {
  const t = b.filter((_) => {
    const h = jt(_);
    return !(h.endsWith("/") || h.includes("__macosx") || h.endsWith(".ds_store"));
  }), r = xt(t, [".gtl"]) || ut(t, ["f_cu"]) || ut(t, ["top", "cu"]) || ut(t, ["top", "copper"]), u = xt(t, [".gbl"]) || ut(t, ["b_cu"]) || ut(t, ["bottom", "cu"]) || ut(t, ["bottom", "copper"]), d = xt(t, [".gts"]) || ut(t, ["f_mask"]) || ut(t, ["top", "mask"]), a = xt(t, [".gbs"]) || ut(t, ["b_mask"]) || ut(t, ["bottom", "mask"]), s = xt(t, [".gto"]) || ut(t, ["f_silks"]) || ut(t, ["f_silk"]) || ut(t, ["top", "silk"]), i = xt(t, [".gbo"]) || ut(t, ["b_silks"]) || ut(t, ["b_silk"]) || ut(t, ["bottom", "silk"]), c = xt(t, [".gko", ".gm1"]) || ut(t, ["edge", "cuts"]) || ut(t, ["outline"]) || ut(t, ["board", "outline"]), w = (
    // Excellon often .drl or .xln or .txt
    xt(t, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    ut(t, ["drill"]) || ut(t, ["drills"]) || ut(t, ["npth"]) || ut(t, ["pth"])
  );
  return {
    top_copper: r,
    bottom_copper: u,
    top_mask: d,
    bottom_mask: a,
    top_silk: s,
    bottom_silk: i,
    outline: c,
    drills: w
  };
}
const Ae = 0.8;
function Tt(b, t, r) {
  const u = {
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
  }, d = t.split(/\r?\n/);
  for (const a of d) {
    let s = a.trim();
    if (s && !s.startsWith("G04")) {
      if (s.startsWith("%") && s.endsWith("%")) {
        ze(s, u);
        continue;
      }
      s.endsWith("*") && (s = s.slice(0, -1)), Re(s, u);
    }
  }
  if (u.inRegion) {
    if (u.currentPath.length >= 3 && u.regionPaths.push(u.currentPath), u.regionPaths.length > 0) {
      const a = {
        loops: u.regionPaths,
        polarity: u.currentPolarity
      };
      u.regions.push(a), u.ops.push({
        kind: "region",
        polarity: u.currentPolarity,
        loops: u.regionPaths
      });
    }
    u.inRegion = !1, u.regionPaths = [], u.currentPath = [];
  }
  return {
    tracks: u.tracks,
    arcs: u.arcs,
    flashes: u.flashes,
    regions: u.regions,
    ops: u.ops
  };
}
function ze(b, t) {
  let r = b;
  if (r.startsWith("%") && (r = r.slice(1)), r.endsWith("%") && (r = r.slice(0, -1)), r.endsWith("*") && (r = r.slice(0, -1)), r.startsWith("FS")) {
    const u = /FS..X(\d)(\d)Y(\d)(\d)/.exec(r);
    if (u) {
      const d = parseInt(u[1], 10), a = parseInt(u[2], 10);
      parseInt(u[4], 10), t.fmtInt = d, t.fmtDec = a;
    }
    return;
  }
  if (r.startsWith("MO")) {
    const u = t.unitScale;
    let d = u;
    if (r.includes("MOMM") ? d = 1 : r.includes("MOIN") && (d = 25.4), d !== u) {
      const a = d / u;
      for (const s of t.apertures.values())
        s.diameterMm !== void 0 && (s.diameterMm *= a), s.widthMm !== void 0 && (s.widthMm *= a), s.heightMm !== void 0 && (s.heightMm *= a);
      t.unitScale = d;
    }
    return;
  }
  if (r.startsWith("AD")) {
    const u = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(r);
    if (!u) return;
    const d = parseInt(u[2], 10), a = u[3], s = u[4] ?? "";
    let i, c, w;
    if (s) {
      const h = s.split(/[Xx]/), y = h[0] ? parseFloat(h[0]) * t.unitScale : void 0, l = h[1] ? parseFloat(h[1]) * t.unitScale : void 0;
      a === "C" ? i = y : a === "R" || a === "O" ? (c = y, w = l, y !== void 0 && l !== void 0 ? i = Math.min(y, l) : i = y ?? l) : i = y ?? l;
    }
    const _ = {
      code: d,
      shape: a,
      diameterMm: i,
      widthMm: c,
      heightMm: w
    };
    t.apertures.set(d, _);
    return;
  }
  if (r.startsWith("LPD")) {
    t.currentPolarity = "dark";
    return;
  }
  if (r.startsWith("LPC")) {
    t.currentPolarity = "clear";
    return;
  }
}
function Re(b, t) {
  if (b === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (b === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const _ = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(_), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let r = null;
  const u = /D0?(\d{1,3})$/.exec(b);
  if (u && (r = parseInt(u[1], 10), b = b.slice(0, b.length - u[0].length)), r !== null && r >= 10) {
    const _ = t.apertures.get(r);
    _ && (t.currentAperture = _);
    return;
  }
  const d = /X([+\-]?\d+)/.exec(b), a = /Y([+\-]?\d+)/.exec(b);
  let s = t.x, i = t.y;
  if (d && (s = Vt(d[1], t)), a && (i = Vt(a[1], t)), r === null) {
    t.x = s, t.y = i;
    return;
  }
  if (t.inRegion) {
    const _ = t.x, h = t.y;
    r === 1 ? (t.currentPath.length === 0 && t.currentPath.push({ x: _, y: h }), t.currentPath.push({ x: s, y: i })) : r === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []), t.x = s, t.y = i;
    return;
  }
  const c = t.x, w = t.y;
  if (r === 1) {
    if (!t.currentAperture) {
      t.x = s, t.y = i;
      return;
    }
    const _ = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    t.tracks.push({
      start: { x: c, y: w },
      end: { x: s, y: i },
      width: _,
      polarity: t.currentPolarity
    }), t.ops.push({
      kind: "track",
      polarity: t.currentPolarity,
      start: { x: c, y: w },
      end: { x: s, y: i },
      widthMm: _
    }), t.x = s, t.y = i;
    return;
  }
  if (r === 2) {
    t.x = s, t.y = i;
    return;
  }
  if (r === 3) {
    if (t.currentAperture) {
      const _ = t.currentAperture, h = _.diameterMm !== void 0 ? _.diameterMm : Ae, y = {
        position: { x: s, y: i },
        diameterMm: h,
        shape: _.shape,
        polarity: t.currentPolarity
      };
      _.widthMm !== void 0 && (y.widthMm = _.widthMm), _.heightMm !== void 0 && (y.heightMm = _.heightMm), t.flashes.push(y), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: s, y: i },
        diameterMm: h,
        shape: _.shape,
        widthMm: _.widthMm,
        heightMm: _.heightMm
      });
    }
    t.x = s, t.y = i;
    return;
  }
}
function Vt(b, t) {
  const r = b.startsWith("-") ? -1 : 1, u = b.replace(/[+\-]/g, ""), d = parseInt(u, 10);
  if (Number.isNaN(d)) return 0;
  const a = Math.pow(10, t.fmtDec), s = d / a * t.unitScale;
  return r * s;
}
function Ce(b, t) {
  const r = t.split(/\r?\n/), u = /* @__PURE__ */ new Map();
  let d = null;
  const a = [];
  for (const s of r) {
    const i = s.trim();
    if (i && !i.startsWith(";")) {
      if (i.startsWith("T") && i.includes("C")) {
        const c = /^T(\d+)[C]([\d.]+)/i.exec(i);
        if (c) {
          const w = c[1], _ = parseFloat(c[2]);
          Number.isNaN(_) || u.set(w, _);
        }
        continue;
      }
      if (i.startsWith("T") && !i.includes("C")) {
        const c = /^T(\d+)/i.exec(i);
        c && (d = c[1]);
        continue;
      }
      if (i[0] === "X" || i.includes("X")) {
        const c = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(i);
        if (!c)
          continue;
        const w = c[1], _ = c[2], h = parseFloat(w), y = parseFloat(_);
        if (Number.isNaN(h) || Number.isNaN(y))
          continue;
        const l = d && u.has(d) ? u.get(d) : 0.6;
        a.push({
          x: h,
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
    name: b,
    holes: a
  };
}
function Me(b) {
  return { w: b.maxX - b.minX, h: b.maxY - b.minY };
}
function It(b) {
  const { w: t, h: r } = Me(b);
  return Number.isFinite(t) && Number.isFinite(r) && t > 1 && r > 1 && t < 2e3 && r < 2e3;
}
function At(b, t) {
  if (!Number.isFinite(b) || !Number.isFinite(t) || b <= 0 || t <= 0) return 1;
  const r = b / t;
  return r > 20 && r < 35 ? 1 / 25.4 : r > 0.02 && r < 0.06 ? 25.4 : 1;
}
function Bt(b, t) {
  return t === 1 ? b : {
    ...b,
    tracks: b.tracks.map((r) => ({
      ...r,
      start: { x: r.start.x * t, y: r.start.y * t },
      end: { x: r.end.x * t, y: r.end.y * t },
      width: (r.width ?? 0) * t
    })),
    flashes: b.flashes.map((r) => ({
      ...r,
      position: { x: r.position.x * t, y: r.position.y * t },
      diameterMm: (r.diameterMm ?? 0) * t,
      widthMm: (r.widthMm ?? 0) * t,
      heightMm: (r.heightMm ?? 0) * t
    })),
    regions: b.regions.map((r) => ({
      ...r,
      loops: r.loops.map((u) => u.map((d) => ({ x: d.x * t, y: d.y * t })))
    }))
  };
}
function Te(b, t) {
  return t === 1 ? b : b.map((r) => ({ x: r.x * t, y: r.y * t, diameter: (r.diameter ?? 0) * t }));
}
function Ie(b) {
  return URL.createObjectURL(new Blob([b], { type: "image/svg+xml" }));
}
function yt(b, t, r) {
  b.minX = Math.min(b.minX, t), b.minY = Math.min(b.minY, r), b.maxX = Math.max(b.maxX, t), b.maxY = Math.max(b.maxY, r);
}
function Xt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function St(b) {
  const t = Xt();
  for (const r of b.tracks) {
    yt(t, r.start.x, r.start.y), yt(t, r.end.x, r.end.y);
    const u = (r.width ?? 0) / 2;
    yt(t, r.start.x - u, r.start.y - u), yt(t, r.start.x + u, r.start.y + u), yt(t, r.end.x - u, r.end.y - u), yt(t, r.end.x + u, r.end.y + u);
  }
  for (const r of b.flashes) {
    const u = (r.widthMm ?? r.diameterMm) || 0, d = (r.heightMm ?? r.diameterMm) || 0;
    yt(t, r.position.x - u / 2, r.position.y - d / 2), yt(t, r.position.x + u / 2, r.position.y + d / 2);
  }
  for (const r of b.regions)
    for (const u of r.loops) for (const d of u) yt(t, d.x, d.y);
  return t;
}
function Be(b) {
  const t = Xt();
  for (const r of b) {
    const u = (r.diameter || 0) / 2;
    yt(t, r.x - u, r.y - u), yt(t, r.x + u, r.y + u);
  }
  return t;
}
function Ht(b, t) {
  return {
    minX: Math.min(b.minX, t.minX),
    minY: Math.min(b.minY, t.minY),
    maxX: Math.max(b.maxX, t.maxX),
    maxY: Math.max(b.maxY, t.maxY)
  };
}
function wt(b) {
  return !Number.isFinite(b.minX) || !Number.isFinite(b.minY) || !Number.isFinite(b.maxX) || !Number.isFinite(b.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (b.maxX - b.minX < 1e-6 && (b.maxX = b.minX + 1), b.maxY - b.minY < 1e-6 && (b.maxY = b.minY + 1), b);
}
const Oe = 1e3;
function bt(b) {
  return b / 25.4 * Oe;
}
function zt(b, t, r) {
  const u = b - r.minX, d = r.maxY - t;
  return { x: u, y: d };
}
function qt(b, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${t}" viewBox="0 0 ${b} ${t}">
  <rect width="${b}" height="${t}" fill="white"/>
</svg>`.trim();
}
function oe(b) {
  let t = 1 / 0, r = 1 / 0, u = -1 / 0, d = -1 / 0;
  for (const a of b.loops)
    for (const s of a)
      t = Math.min(t, s.x), r = Math.min(r, s.y), u = Math.max(u, s.x), d = Math.max(d, s.y);
  return { minX: t, minY: r, maxX: u, maxY: d };
}
function Pe(b, t) {
  const r = (t.maxX - t.minX) * (t.maxY - t.minY);
  let u = 0, d = 0;
  for (const _ of b.regions) {
    const h = oe(_), y = (h.maxX - h.minX) * (h.maxY - h.minY);
    _.polarity === "clear" ? d = Math.max(d, y) : u = Math.max(u, y);
  }
  const a = b.tracks.filter((_) => _.polarity !== "clear").length + b.flashes.filter((_) => _.polarity !== "clear").length + b.regions.filter((_) => _.polarity !== "clear").length, s = b.tracks.filter((_) => _.polarity === "clear").length + b.flashes.filter((_) => _.polarity === "clear").length + b.regions.filter((_) => _.polarity === "clear").length, i = u > r * 0.7, c = s > a * 3, w = d > r * 0.7;
  return i ? !1 : c || w;
}
function Kt(b, t, r, u) {
  const d = t.maxX - t.minX, a = t.maxY - t.minY, s = Math.max(1, Math.round(bt(d))), i = Math.max(1, Math.round(bt(a))), c = bt(1), w = Pe(b, t), _ = w ? "white" : "black", h = (x, A) => {
    const F = x - t.minX, P = t.maxY - A;
    return { x: F * c, y: P * c };
  }, y = (x, A) => {
    if (x.kind === "track") {
      const F = h(x.start.x, x.start.y), P = h(x.end.x, x.end.y), D = Number.isFinite(x.widthMm) ? x.widthMm : 0.2, M = Math.max(1, D * c);
      return `<line x1="${F.x.toFixed(2)}" y1="${F.y.toFixed(2)}" x2="${P.x.toFixed(2)}" y2="${P.y.toFixed(2)}" stroke-width="${M.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (x.kind === "flash") {
      const F = h(x.position.x, x.position.y), P = x.widthMm ?? x.diameterMm ?? 0.8, D = x.heightMm ?? x.diameterMm ?? 0.8, M = Math.max(0.01, Number.isFinite(P) ? P : 0.8) * c, W = Math.max(0.01, Number.isFinite(D) ? D : 0.8) * c;
      if (x.shape === "R" || x.shape === "O") {
        const J = F.x - M / 2, S = F.y - W / 2, N = x.shape === "O" ? Math.min(M, W) * 0.35 : 0;
        return `<rect x="${J.toFixed(2)}" y="${S.toFixed(2)}" width="${M.toFixed(2)}" height="${W.toFixed(2)}" rx="${N.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const J = Math.max(1, Math.max(M, W) / 2);
        return `<circle cx="${F.x.toFixed(2)}" cy="${F.y.toFixed(2)}" r="${J.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (x.kind === "region") {
      const F = x.loops.map((P) => {
        if (!P.length) return "";
        const D = h(P[0].x, P[0].y), M = [`M ${D.x.toFixed(2)} ${D.y.toFixed(2)}`];
        for (let W = 1; W < P.length; W++) {
          const J = h(P[W].x, P[W].y);
          M.push(`L ${J.x.toFixed(2)} ${J.y.toFixed(2)}`);
        }
        return M.push("Z"), M.join(" ");
      }).join(" ");
      return F.trim() ? `<path d="${F}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, l = [];
  l.push(`<rect x="0" y="0" width="${s}" height="${i}" fill="${_}" fill-opacity="1" />`);
  for (const x of b.ops) {
    const A = x.polarity === "clear" ? "black" : "white", F = y(x, A);
    F && l.push(F);
  }
  console.log("[polarity counts]", {
    tracksClear: b.tracks.filter((x) => x.polarity === "clear").length,
    regionsClear: b.regions.filter((x) => x.polarity === "clear").length,
    negativePlane: w
  });
  const m = (t.maxX - t.minX) * (t.maxY - t.minY);
  let n = 0, p = 0;
  for (const x of b.regions) {
    const A = oe(x), F = (A.maxX - A.minX) * (A.maxY - A.minY);
    x.polarity === "clear" ? p = Math.max(p, F) : n = Math.max(n, F);
  }
  const f = b.tracks.filter((x) => x.polarity !== "clear").length + b.flashes.filter((x) => x.polarity !== "clear").length + b.regions.filter((x) => x.polarity !== "clear").length, k = b.tracks.filter((x) => x.polarity === "clear").length + b.flashes.filter((x) => x.polarity === "clear").length + b.regions.filter((x) => x.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: f,
    clearCount: k,
    largestDarkRegionArea: n,
    largestClearRegionArea: p,
    boardArea: m,
    negative: w
  });
  const E = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${i}" viewBox="0 0 ${s} ${i}">
  <defs>
    <mask id="${E}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${s}" height="${i}" fill="${_}" fill-opacity="1" />
      ${l.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${s}" height="${i}" fill="${r}" opacity="${u}" mask="url(#${E})" />
</svg>`.trim();
}
function Jt(b, t) {
  const r = t.maxX - t.minX, u = t.maxY - t.minY, d = Math.max(1, Math.round(bt(r))), a = Math.max(1, Math.round(bt(u))), s = Math.max(1e-6, bt(1)), i = "rgba(255,255,255,0.95)", c = "rgba(255,255,255,0.95)", w = b.tracks.map((y) => {
    const l = zt(y.start.x, y.start.y, t), m = zt(y.end.x, y.end.y, t), n = Number.isFinite(y.width) ? y.width : 0.15, p = Math.max(1, n * s);
    return `<line x1="${(l.x * s).toFixed(2)}" y1="${(l.y * s).toFixed(2)}" x2="${(m.x * s).toFixed(2)}" y2="${(m.y * s).toFixed(2)}" stroke="${i}" stroke-width="${p.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), _ = b.flashes.map((y) => {
    const l = zt(y.position.x, y.position.y, t), m = l.x * s, n = l.y * s, p = y.widthMm ?? y.diameterMm ?? 0.6, f = y.heightMm ?? y.diameterMm ?? 0.6;
    if (y.shape === "R" || y.shape === "O") {
      const E = p * s, x = f * s, A = m - E / 2, F = n - x / 2, P = y.shape === "O" ? Math.min(E, x) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${F.toFixed(2)}" width="${E.toFixed(2)}" height="${x.toFixed(2)}" rx="${P.toFixed(2)}" fill="${c}" />`;
    }
    const k = (y.diameterMm ?? 0.6) * s / 2;
    return `<circle cx="${m.toFixed(2)}" cy="${n.toFixed(2)}" r="${Math.max(1, k).toFixed(2)}" fill="${c}" />`;
  }), h = b.regions.map((y) => {
    const l = y.loops.map((m) => {
      if (!m.length) return "";
      const n = zt(m[0].x, m[0].y, t), p = [`M ${(n.x * s).toFixed(2)} ${(n.y * s).toFixed(2)}`];
      for (let f = 1; f < m.length; f++) {
        const k = zt(m[f].x, m[f].y, t);
        p.push(`L ${(k.x * s).toFixed(2)} ${(k.y * s).toFixed(2)}`);
      }
      return p.push("Z"), p.join(" ");
    }).join(" ");
    return l.trim() ? `<path d="${l}" fill="${c}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${a}" viewBox="0 0 ${d} ${a}">
  ${w.join(`
  `)}
  ${_.join(`
  `)}
  ${h.join(`
  `)}
</svg>`.trim();
}
function Fe(b, t) {
  const r = t.maxX - t.minX, u = t.maxY - t.minY, d = Math.round(bt(r)), a = Math.round(bt(u)), s = bt(1), i = b.map((c) => {
    const w = zt(c.x, c.y, t), _ = w.x * s, h = w.y * s, y = (c.diameter || 0.6) * s / 2;
    return `<circle cx="${_.toFixed(2)}" cy="${h.toFixed(2)}" r="${Math.max(1, y).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${a}" viewBox="0 0 ${d} ${a}">
  ${i.join(`
  `)}
</svg>`.trim();
}
async function ae(b) {
  const t = Object.keys(b).filter((ot) => !!ot), r = Ee(t), u = new TextDecoder("utf-8", { fatal: !1 }), d = async (ot) => {
    if (!ot) return null;
    const G = b[ot];
    return G ? u.decode(G) : null;
  }, a = await d(r.top_copper), s = await d(r.bottom_copper), i = await d(r.outline), c = await d(r.drills), w = await d(r.top_silk), _ = await d(r.bottom_silk), h = a ? Tt(r.top_copper || "top", a) : null, y = s ? Tt(r.bottom_copper || "bot", s) : null, l = i ? Tt(r.outline || "outline", i) : null, m = c ? Ce(r.drills || "drills", c) : null, n = m ? m.holes.map((ot) => ({ x: ot.x, y: ot.y, diameter: ot.diameter })) : [], p = w ? Tt(r.top_silk || "top_silk", w) : null, f = _ ? Tt(r.bottom_silk || "bot_silk", _) : null, k = h ? wt(St(h)) : null, E = y ? wt(St(y)) : null, x = l ? wt(St(l)) : null, A = n.length ? wt(Be(n)) : null, F = p ? wt(St(p)) : null, P = f ? wt(St(f)) : null, D = (x && It(x) ? x : null) || (k && It(k) ? k : null) || (E && It(E) ? E : null) || (A && It(A) ? A : null), M = D ? D.maxX - D.minX : 1, W = k ? At(k.maxX - k.minX, M) : 1, J = E ? At(E.maxX - E.minX, M) : 1, S = x ? At(x.maxX - x.minX, M) : 1, N = A ? At(A.maxX - A.minX, M) : 1, o = F ? At(F.maxX - F.minX, M) : 1, L = P ? At(P.maxX - P.minX, M) : 1, tt = h ? Bt(h, W) : null, X = y ? Bt(y, J) : null, et = l ? Bt(l, S) : null, T = n.length ? Te(n, N) : [], Z = p ? Bt(p, o) : null, C = f ? Bt(f, L) : null;
  let R = null;
  if (et) {
    const ot = wt(St(et));
    It(ot) && (R = ot);
  }
  if (!R) {
    let ot = Xt();
    tt && (ot = Ht(ot, St(tt))), X && (ot = Ht(ot, St(X))), ot = wt(ot), R = ot;
  }
  const V = wt(R), H = V.maxX - V.minX, U = V.maxY - V.minY, nt = {
    board: {
      width_in: H / 25.4,
      height_in: U / 25.4,
      mm_bounds: {
        min_x_mm: V.minX,
        min_y_mm: V.minY,
        max_x_mm: V.maxX,
        max_y_mm: V.maxY
      }
    }
  }, ct = Math.max(1, Math.round(bt(H))), rt = Math.max(1, Math.round(bt(U))), it = [], st = (ot) => {
    const G = Ie(ot);
    return it.push(G), G;
  }, lt = {
    top_board_mask: st(qt(ct, rt)),
    bottom_board_mask: st(qt(ct, rt))
  };
  return tt && (lt.top_copper = st(Kt(tt, V, "#fbbf24", 1))), X && (lt.bottom_copper = st(Kt(X, V, "#38bdf8", 1))), T.length && (lt.drills = st(Fe(T, V))), Z && (lt.top_silk = st(Jt(Z, V))), C && (lt.bottom_silk = st(Jt(C, V))), {
    boardGeom: nt,
    layers: lt,
    revoke: () => it.forEach((ot) => URL.revokeObjectURL(ot))
  };
}
async function Ke(b) {
  const t = b instanceof Uint8Array ? b.byteOffset === 0 && b.byteLength === b.buffer.byteLength ? b.buffer : b.slice().buffer : b instanceof ArrayBuffer ? b : await b.arrayBuffer(), { files: r, archiveType: u } = await se(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (u !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${u}`);
  return await ae(r);
}
async function Je(b, t) {
  const { files: r } = await se(b, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await ae(r);
}
function De(b, t, r) {
  return Math.max(t, Math.min(r, b));
}
function Nt(b, t) {
  return !Number.isFinite(b) || !Number.isFinite(t) || t <= 0 ? 0 : (b % t + t) % t;
}
function kt(b, t) {
  t && t.startsWith("blob:") || t && t.length > 0 ? b.setAttribute("src", t) : b.removeAttribute("src");
}
function pt(b, t) {
  const r = b.querySelector(t);
  if (!r) throw new Error(`Missing required element: ${t}`);
  return r;
}
function Qe(b, t = {}) {
  const r = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  b.innerHTML = `
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
              ${r}
              Download
            </button>
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <div id="board-viewport">
          <canvas id="grid-canvas"></canvas>
          <div id="board-content">
            <div id="board-stage">
              <div class="board-clip" id="boardClip">
                <div class="layer-frame" id="layer-fr4" style="z-index:0;">
                  <img class="layer fr4" id="img-fr4" alt="FR4" />
                </div>

                <div class="layer-frame" id="layer-bottom-copper"><img class="layer" id="img-bottom-copper" alt="Bottom copper" /></div>
                <div class="layer-frame" id="layer-bottom-mask"><img class="layer" id="img-bottom-mask" alt="Bottom mask" /></div>
                <div class="layer-frame" id="layer-bottom-silk"><img class="layer" id="img-bottom-silk" alt="Bottom silk" /></div>

                <div class="layer-frame" id="layer-top-copper"><img class="layer" id="img-top-copper" alt="Top copper" /></div>
                <div class="layer-frame" id="layer-top-mask"><img class="layer" id="img-top-mask" alt="Top mask" /></div>
                <div class="layer-frame" id="layer-top-silk"><img class="layer" id="img-top-silk" alt="Top silk" /></div>

                <div class="layer-frame" id="layer-drills"><img class="layer" id="img-drills" alt="Drills" /></div>
                <div class="layer-frame" id="layer-vias"><img class="layer" id="img-vias" alt="Vias" /></div>
              </div>
            </div>
          </div>

          <div class="board-viewer-hint">Scroll to zoom, drag to pan.</div>
        </div>
      </div>
    </div>
  `;
  const u = b.firstElementChild, d = pt(u, "#board-viewport"), a = pt(u, "#board-content"), s = pt(u, "#board-stage"), i = pt(u, "#boardClip"), c = pt(u, "#grid-canvas"), w = pt(u, "#grid-toggle"), _ = pt(u, "#grid-units"), h = pt(u, "#fit-btn"), y = pt(u, "#download-btn"), l = Array.from(u.querySelectorAll('input[name="side"]')), m = pt(u, "#img-fr4"), n = pt(u, "#img-top-copper"), p = pt(u, "#img-bottom-copper"), f = pt(u, "#img-top-mask"), k = pt(u, "#img-bottom-mask"), E = pt(u, "#img-top-silk"), x = pt(u, "#img-bottom-silk"), A = pt(u, "#img-drills"), F = pt(u, "#img-vias");
  let P = null, D = {}, M = 1, W = 0, J = 0, S = !1, N = 0, o = 0, L = 0, tt = 0, X = !1, et = !1;
  function T(G) {
    return De(G, 0.2, 8);
  }
  function Z() {
    X || (X = !0, requestAnimationFrame(() => {
      X = !1, a.style.transform = `translate3d(${W}px, ${J}px, 0) scale(${M})`, w.checked && H();
    }));
  }
  function C(G = 0.08) {
    const e = d.getBoundingClientRect(), O = s.offsetWidth || 1, I = s.offsetHeight || 1, v = Math.max(1, e.width * (1 - 2 * G)), g = Math.max(1, e.height * (1 - 2 * G));
    M = T(Math.min(v / O, g / I)), W = (e.width - M * O) / 2, J = (e.height - M * I) / 2, Z();
  }
  function R() {
    let G = 1e3;
    if (P?.board?.width_in) {
      const O = s.getBoundingClientRect().width / M;
      Number.isFinite(O) && O > 0 && (G = O / P.board.width_in);
    }
    return G;
  }
  function V() {
    const G = window.devicePixelRatio || 1, e = d.getBoundingClientRect();
    c.width = Math.max(1, Math.floor(e.width * G)), c.height = Math.max(1, Math.floor(e.height * G)), c.style.width = `${e.width}px`, c.style.height = `${e.height}px`;
  }
  function H() {
    if (!w.checked) {
      c.style.display = "none";
      return;
    }
    c.style.display = "block";
    const G = c.getContext("2d");
    if (!G) return;
    const e = window.devicePixelRatio || 1, O = d.getBoundingClientRect(), I = O.width, v = O.height;
    G.setTransform(e, 0, 0, e, 0, 0), G.clearRect(0, 0, I, v);
    const g = R(), z = g / 25.4, j = _.value, $ = j === "mm" ? z * 1 : g * 0.1, B = j === "mm" ? z * 10 : g * 1, Y = $ * M, K = B * M;
    if (!Number.isFinite(Y) || Y < 6) return;
    const q = Nt(W, Y), Q = Nt(J, Y), dt = Nt(W, K), at = Nt(J, K);
    G.lineWidth = 1, G.strokeStyle = "rgba(17, 24, 39, 0.12)", G.beginPath();
    for (let ht = q; ht < I; ht += Y) {
      const gt = Math.round(ht) + 0.5;
      G.moveTo(gt, 0), G.lineTo(gt, v);
    }
    for (let ht = Q; ht < v; ht += Y) {
      const gt = Math.round(ht) + 0.5;
      G.moveTo(0, gt), G.lineTo(I, gt);
    }
    if (G.stroke(), Number.isFinite(K) && K >= 12) {
      G.strokeStyle = "rgba(17, 24, 39, 0.22)", G.beginPath();
      for (let ht = dt; ht < I; ht += K) {
        const gt = Math.round(ht) + 0.5;
        G.moveTo(gt, 0), G.lineTo(gt, v);
      }
      for (let ht = at; ht < v; ht += K) {
        const gt = Math.round(ht) + 0.5;
        G.moveTo(0, gt), G.lineTo(I, gt);
      }
      G.stroke();
    }
  }
  function U(G, e) {
    const O = u.querySelector(`#${G}`);
    O && (O.style.display = e ? "block" : "none");
  }
  function nt(G) {
    G && i.style.setProperty("--board-mask-url", `url('${G}')`);
  }
  function ct(G) {
    const e = G === "top", O = G === "bottom";
    U("layer-top-copper", e && !!D.top_copper), U("layer-top-mask", e && !!D.top_mask), U("layer-top-silk", e && !!D.top_silk), U("layer-bottom-copper", O && !!D.bottom_copper), U("layer-bottom-mask", O && !!D.bottom_mask), U("layer-bottom-silk", O && !!D.bottom_silk), U("layer-drills", !!D.drills), U("layer-vias", !!D.vias);
    const I = G === "bottom" ? D.bottom_board_mask ?? D.top_board_mask : D.top_board_mask ?? D.bottom_board_mask;
    I && nt(I);
  }
  function rt() {
    if (!P?.board) return;
    const G = 1e3, e = Math.round((P.board.width_in || 1) * G), O = Math.round((P.board.height_in || 1) * G);
    s.style.width = `${e}px`, s.style.height = `${O}px`;
  }
  d.addEventListener("wheel", (G) => {
    G.preventDefault(), et = !0;
    const e = d.getBoundingClientRect(), O = G.clientX - e.left, I = G.clientY - e.top, v = M, g = 1.1;
    M = G.deltaY < 0 ? T(M * g) : T(M / g);
    const z = M / v;
    W = O - (O - W) * z, J = I - (I - J) * z, Z();
  }, { passive: !1 }), d.addEventListener("mousedown", (G) => {
    G.button === 0 && (G.preventDefault(), et = !0, S = !0, d.classList.add("grabbing"), N = G.clientX, o = G.clientY, L = W, tt = J);
  });
  const it = (G) => {
    if (!S) return;
    const e = G.clientX - N, O = G.clientY - o;
    W = L + e, J = tt + O, Z();
  }, st = () => {
    S && (S = !1, d.classList.remove("grabbing"));
  };
  window.addEventListener("mousemove", it), window.addEventListener("mouseup", st), w.addEventListener("change", () => {
    V(), H();
  }), _.addEventListener("change", H), h.addEventListener("click", () => C(0.08)), y.addEventListener("click", () => {
    t.onDownload?.();
  }), l.forEach((G) => {
    G.addEventListener("change", () => {
      const e = l.find((O) => O.checked)?.value || "top";
      ct(e);
    });
  }), window.addEventListener("resize", () => {
    V(), et ? Z() : C(0.08);
  });
  function lt(G) {
    P = G.boardGeom, D = G.layers, kt(n, D.top_copper), kt(p, D.bottom_copper), kt(f, D.top_mask), kt(k, D.bottom_mask), kt(E, D.top_silk), kt(x, D.bottom_silk), kt(A, D.drills), kt(F, D.vias), kt(m, D.top_copper ?? D.bottom_copper), rt(), V(), C(0.08);
    const e = l.find((O) => O.checked)?.value || "top";
    ct(e), Z();
  }
  function ot() {
    window.removeEventListener("mousemove", it), window.removeEventListener("mouseup", st), b.innerHTML = "";
  }
  return {
    setData: lt,
    setSideMode: (G) => {
      const e = l.find((O) => O.value === G);
      e && (e.checked = !0), ct(G);
    },
    fit: () => C(0.08),
    dispose: ot
  };
}
function Wt(b, t) {
  const [
    r,
    u,
    d,
    a,
    s,
    i,
    c,
    w,
    _
  ] = b, [
    h,
    y,
    l,
    m,
    n,
    p,
    f,
    k,
    E
  ] = t;
  return [
    r * h + u * m + d * f,
    r * y + u * n + d * k,
    r * l + u * p + d * E,
    a * h + s * m + i * f,
    a * y + s * n + i * k,
    a * l + s * p + i * E,
    c * h + w * m + _ * f,
    c * y + w * n + _ * k,
    c * l + w * p + _ * E
  ];
}
function Qt(b, t) {
  return [1, 0, b, 0, 1, t, 0, 0, 1];
}
function Ne(b, t) {
  return [b, 0, 0, 0, t, 0, 0, 0, 1];
}
function Le(b) {
  const t = Math.cos(b), r = Math.sin(b);
  return [t, -r, 0, r, t, 0, 0, 0, 1];
}
function te(b, t) {
  const r = b[0] * t.x + b[1] * t.y + b[2], u = b[3] * t.x + b[4] * t.y + b[5], d = b[6] * t.x + b[7] * t.y + b[8];
  if (d === 0) throw new Error("Invalid transform (w=0)");
  return { x: r / d, y: u / d };
}
function Ue(b) {
  const t = b[0], r = b[1], u = b[2], d = b[3], a = b[4], s = b[5], i = t * a - r * d;
  if (Math.abs(i) < 1e-12) throw new Error("Non-invertible transform");
  const c = 1 / i, w = a * c, _ = -r * c, h = -d * c, y = t * c, l = -(w * u + _ * s), m = -(h * u + y * s);
  return [w, _, l, h, y, m, 0, 0, 1];
}
class We {
  constructor(t, r) {
    this.camera = {
      center_mm: t.center_mm,
      zoom: t.zoom,
      rotation_rad: t.rotation_rad ?? 0,
      mirrorX: t.mirrorX ?? !1,
      mirrorY: t.mirrorY ?? !1
    }, this.viewport = r, this.worldToScreenMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.screenToWorldMat = [1, 0, 0, 0, 1, 0, 0, 0, 1], this.recompute();
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
    return te(this.worldToScreenMat, t);
  }
  screenToBoard(t) {
    return te(this.screenToWorldMat, t);
  }
  recompute() {
    const { width_px: t, height_px: r } = this.viewport, { center_mm: u, zoom: d, rotation_rad: a, mirrorX: s, mirrorY: i } = this.camera, c = { x: t / 2, y: r / 2 }, w = i ? -1 : 1, _ = s ? -1 : 1, h = Qt(-u.x, -u.y), y = Le(a), l = Ne(d * _, d * w), m = Qt(c.x, c.y), n = Wt(m, Wt(l, Wt(y, h)));
    this.worldToScreenMat = n, this.screenToWorldMat = Ue(n);
  }
}
class je {
  constructor(t) {
    this.onFrame = t, this.pending = !1, this.reasons = /* @__PURE__ */ new Set();
  }
  requestRender(t = "unknown") {
    this.reasons.add(t), !this.pending && (this.pending = !0, requestAnimationFrame(() => {
      this.pending = !1;
      const r = Array.from(this.reasons);
      this.reasons.clear(), this.onFrame(r);
    }));
  }
  isPending() {
    return this.pending;
  }
  getPendingReasons() {
    return Array.from(this.reasons);
  }
}
class Xe {
  // Default getter
  constructor(t, r) {
    this.passes = [], this.visibilityGetter = () => this.visibility, this.canvas = t;
    const u = t.getContext("2d");
    if (!u) throw new Error("Unable to get 2D context");
    this.ctx = u;
    const d = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new We(r, d), this.visibility = {
      gerber: {
        copper: !0,
        solderMask: !0,
        silk: !0,
        outline: !0
      },
      overlays: {},
      markers: !0
    }, this.scheduler = new je(() => this.render()), this.registerDefaultPasses(), this.setupResizeHandling();
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
    this.passes.push(t), this.passes.sort((r, u) => r.order - u.order), this.requestRender("addPass");
  }
  removePass(t) {
    const r = this.passes.findIndex((u) => u.id === t);
    return r >= 0 ? (this.passes.splice(r, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((r) => r.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, r = this.canvas, u = { width_px: r.width, height_px: r.height };
    this.xform.setViewport(u);
    const d = {
      canvas: r,
      ctx: t,
      viewport: u,
      xform: this.xform,
      now_ms: performance.now(),
      visibility: this.visibilityGetter(),
      // Use the getter function
      boardToScreen: (a) => this.xform.boardToScreen({ x: a.x, y: a.y }),
      screenToBoard: (a) => this.xform.screenToBoard({ x: a.x, y: a.y })
    };
    t.setTransform(1, 0, 0, 1, 0, 0), t.clearRect(0, 0, r.width, r.height), t.fillStyle = "#f5f5f5", t.fillRect(0, 0, r.width, r.height);
    for (const a of this.passes)
      if (a.enabled()) {
        t.save();
        try {
          a.draw(d);
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
  screenToBoard(t, r) {
    return this.xform.screenToBoard({ x: t, y: r });
  }
  boardToScreen(t, r) {
    return this.xform.boardToScreen({ x: t, y: r });
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
class $e {
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
    const r = this.getState();
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
    }, JSON.stringify(r) !== JSON.stringify(this.state) && this.notifyListeners();
  }
  setGerberVisibility(t, r) {
    this.state.gerber[t] !== r && (this.state.gerber[t] = r, this.notifyListeners());
  }
  setOverlayVisibility(t, r) {
    t in this.state.overlays || (this.state.overlays[t] = !1), this.state.overlays[t] !== r && (this.state.overlays[t] = r, this.notifyListeners());
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
const Rt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function tr(b, t, r, u, d) {
  return {
    id: `gerber:${b}`,
    order: t,
    enabled: () => d().gerber[r],
    draw: (a) => {
      const s = a.ctx, i = a.xform.getWorldToScreenMatrix();
      s.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), u(s);
    }
  };
}
class Ye {
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
    return Array.from(this.overlays.values()).filter((t) => t.visible).sort((t, r) => t.zIndex - r.zIndex);
  }
  setVisible(t, r) {
    const u = this.overlays.get(t);
    u && (u.visible = r);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Ze(b) {
  return {
    id: "overlay:all",
    order: (Rt.OVERLAYS_MIN + Rt.OVERLAYS_MAX) / 2,
    enabled: () => !0,
    draw: (t) => {
      const u = b.getAll().filter((d) => t.visibility.overlays[d.id] ?? d.visible);
      u.sort((d, a) => d.zIndex - a.zIndex);
      for (const d of u)
        t.ctx.save(), d.draw(t.ctx, {
          boardToScreen: t.boardToScreen,
          screenToBoard: t.screenToBoard,
          xform: t.xform,
          view: t.xform.getCamera()
        }), t.ctx.restore();
    }
  };
}
class Ge {
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
    const r = t.ctx, u = t.xform.getCamera().zoom;
    if (!(u < 2)) {
      r.setTransform(1, 0, 0, 1, 0, 0);
      for (const a of this.markers.values()) {
        const s = t.boardToScreen(a.position);
        s.x < -10 || s.x > t.viewport.width_px + 10 || s.y < -10 || s.y > t.viewport.height_px + 10 || this.drawMarker(r, s, a, u);
      }
    }
  }
  drawMarker(t, r, u, d) {
    const a = Math.max(3, Math.min(8, d / 5));
    switch (t.beginPath(), t.arc(r.x, r.y, a, 0, Math.PI * 2), u.type) {
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
function Ve(b, t) {
  return {
    id: "markers",
    order: (Rt.MARKERS_MIN + Rt.MARKERS_MAX) / 2,
    enabled: () => t().markers,
    draw: (r) => b.draw(r)
  };
}
class He {
  draw(t, r) {
    if (!r) return;
    const u = t.ctx;
    switch (r.type) {
      case "marker":
        this.drawMarkerSelection(u, t, r.id);
        break;
      case "geometry":
        this.drawGeometrySelection(u, t, r.id);
        break;
      case "region":
        this.drawRegionSelection(u, t, r.bounds);
        break;
    }
  }
  drawMarkerSelection(t, r, u) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.strokeRect(10, 10, 100, 100);
  }
  drawGeometrySelection(t, r, u) {
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "cyan", t.lineWidth = 2, t.strokeRect(120, 10, 100, 100);
  }
  drawRegionSelection(t, r, u) {
    if (!u) return;
    const d = r.xform.getWorldToScreenMatrix();
    t.setTransform(d[0], d[3], d[1], d[4], d[2], d[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      u.min.x,
      u.min.y,
      u.max.x - u.min.x,
      u.max.y - u.min.y
    );
  }
}
function qe(b, t) {
  return {
    id: "selection",
    order: (Rt.SELECTION_MIN + Rt.SELECTION_MAX) / 2,
    enabled: () => t() !== null,
    draw: (r) => b.draw(r, t())
  };
}
function er(b, t = {}) {
  const r = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  b.innerHTML = `
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
              ${r}
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
  const u = b.firstElementChild, d = L(u, "#board-viewport"), a = L(u, "#render-canvas"), s = L(u, "#grid-toggle"), i = L(u, "#grid-units"), c = L(u, "#fit-btn"), w = L(u, "#download-btn"), _ = Array.from(u.querySelectorAll('input[name="side"]')), h = new Xe(a, {
    center_mm: { x: 50, y: 50 },
    // Start with a reasonable center
    zoom: 5,
    // Start with a reasonable zoom (5 pixels per mm)
    rotation_rad: 0,
    mirrorY: !1
    // Don't flip Y - board origin is top-left like screen
  }), y = new $e();
  h.setVisibilityGetter(() => y.getState());
  const l = new Ye(), m = new Ge(), n = new He();
  let p = null;
  function f() {
    const T = d.getBoundingClientRect(), Z = window.devicePixelRatio || 1;
    a.width = T.width * Z, a.height = T.height * Z, a.style.width = `${T.width}px`, a.style.height = `${T.height}px`, h.requestRender("resize");
  }
  const k = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (T, Z) => {
      const { xform: C, view: R } = Z, V = R.zoom, H = i.value, U = H === "mm" ? 1 : 1 / 25.4, nt = H === "mm" ? 10 : 1 / 25.4, ct = U * V, rt = nt * V;
      if (ct < 2) return;
      const it = Z.screenToBoard({ x: 0, y: 0 }), st = Z.screenToBoard({
        x: a.width / (window.devicePixelRatio || 1),
        y: a.height / (window.devicePixelRatio || 1)
      });
      T.setTransform(1, 0, 0, 1, 0, 0), T.strokeStyle = "rgba(59, 130, 246, 0.4)", T.lineWidth = 1, T.beginPath();
      const lt = Math.floor(it.x / U) * U, ot = Math.floor(it.y / U) * U;
      for (let G = lt; G <= st.x; G += U) {
        const e = Z.boardToScreen({ x: G, y: 0 }).x;
        T.moveTo(e, 0), T.lineTo(e, a.height);
      }
      for (let G = ot; G <= st.y; G += U) {
        const e = Z.boardToScreen({ x: 0, y: G }).y;
        T.moveTo(0, e), T.lineTo(a.width, e);
      }
      if (T.stroke(), rt >= 8) {
        T.strokeStyle = "rgba(59, 130, 246, 0.7)", T.lineWidth = 1.5, T.beginPath();
        const G = Math.floor(it.x / nt) * nt, e = Math.floor(it.y / nt) * nt;
        for (let O = G; O <= st.x; O += nt) {
          const I = Z.boardToScreen({ x: O, y: 0 }).x;
          T.moveTo(I, 0), T.lineTo(I, a.height);
        }
        for (let O = e; O <= st.y; O += nt) {
          const I = Z.boardToScreen({ x: 0, y: O }).y;
          T.moveTo(0, I), T.lineTo(a.width, I);
        }
        T.stroke();
      }
    }
  };
  l.add(k), y.setOverlayVisibility("grid", !1), y.setMarkersVisibility(!1), h.addPass(Ze(l)), h.addPass(Ve(m, () => y.getState())), h.addPass(qe(n, () => p));
  let E = null, x = {}, A = "top", F = !1;
  function P(T, Z, C) {
    if (!C) return null;
    const R = new Image();
    return R.src = C, R.addEventListener("load", () => {
      h.requestRender(`image-loaded-${T}`);
    }), {
      id: T,
      order: Z,
      enabled: () => !0,
      draw: (V) => {
        if (!R.complete) return;
        const H = V.ctx, U = V.xform.getWorldToScreenMatrix();
        H.setTransform(U[0], U[3], U[1], U[4], U[2], U[5]);
        const nt = 25.4, ct = (E?.board?.width_in || 1) * nt, rt = (E?.board?.height_in || 1) * nt;
        H.drawImage(R, 0, 0, ct, rt);
      }
    };
  }
  function D(T, Z) {
    return {
      id: T,
      order: Z,
      enabled: () => !0,
      draw: (C) => {
        if (!E?.board) return;
        const R = C.ctx, V = C.xform.getWorldToScreenMatrix();
        R.setTransform(V[0], V[3], V[1], V[4], V[2], V[5]);
        const H = (E.board.width_in || 1) * 25.4, U = (E.board.height_in || 1) * 25.4;
        R.fillStyle = "#1a5f1a", R.fillRect(0, 0, H, U), R.strokeStyle = "#0d3d0d", R.lineWidth = 0.1, R.strokeRect(0, 0, H, U);
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
      h.removePass(C);
    }), !E) return;
    [
      { id: "layer:fr4", order: 5, useFR4: !0 },
      { id: "layer:bottom-copper", order: 10, url: A === "bottom" ? x.bottom_copper : void 0 },
      { id: "layer:bottom-mask", order: 15, url: A === "bottom" ? x.bottom_mask : void 0 },
      { id: "layer:bottom-silk", order: 20, url: A === "bottom" ? x.bottom_silk : void 0 },
      { id: "layer:top-copper", order: 25, url: A === "top" ? x.top_copper : void 0 },
      { id: "layer:top-mask", order: 30, url: A === "top" ? x.top_mask : void 0 },
      { id: "layer:top-silk", order: 35, url: A === "top" ? x.top_silk : void 0 },
      { id: "layer:drills", order: 40, url: x.drills },
      { id: "layer:vias", order: 45, url: x.vias }
    ].forEach((C) => {
      let R;
      C.useFR4 ? R = D(C.id, C.order) : C.url && (R = P(C.id, C.order, C.url)), R && h.addPass(R);
    }), h.requestRender("side-switch"), setTimeout(() => h.requestRender("side-switch-delayed"), 50);
  }
  function W(T = 0.08) {
    if (!E?.board) return;
    const Z = d.getBoundingClientRect(), C = E.board.width_in || 1, R = E.board.height_in || 1, V = Z.width * (1 - 2 * T), H = Z.height * (1 - 2 * T), U = C * 25.4, nt = R * 25.4, ct = V / U, rt = H / nt, it = Math.min(ct, rt), st = U / 2, lt = nt / 2;
    h.setCamera({
      center_mm: { x: st, y: lt },
      zoom: it
    });
  }
  a.addEventListener("wheel", (T) => {
    T.preventDefault(), F = !0;
    const Z = a.getBoundingClientRect(), C = T.clientX - Z.left, R = T.clientY - Z.top, V = h.getCamera(), H = T.deltaY < 0 ? 1.1 : 0.9, U = Math.max(0.2, Math.min(50, V.zoom * H)), nt = h.screenToBoard(C, R);
    h.setCamera({ zoom: U });
    const ct = h.screenToBoard(C, R), rt = nt.x - ct.x, it = nt.y - ct.y, st = {
      x: V.center_mm.x + rt,
      y: V.center_mm.y + it
    };
    h.setCamera({
      center_mm: st,
      zoom: U
    });
  }, { passive: !1 });
  let J = !1, S = null;
  a.addEventListener("mousedown", (T) => {
    if (T.button !== 0) return;
    T.preventDefault(), F = !0, J = !0;
    const Z = a.getBoundingClientRect();
    S = h.screenToBoard(
      T.clientX - Z.left,
      T.clientY - Z.top
    );
  });
  const N = (T) => {
    if (!J || !S) return;
    const Z = a.getBoundingClientRect(), C = h.screenToBoard(
      T.clientX - Z.left,
      T.clientY - Z.top
    ), R = S.x - C.x, V = S.y - C.y, H = h.getCamera();
    h.setCamera({
      center_mm: {
        x: H.center_mm.x + R,
        y: H.center_mm.y + V
      }
    });
  }, o = () => {
    J = !1, S = null;
  };
  window.addEventListener("mousemove", N), window.addEventListener("mouseup", o), s.addEventListener("change", () => {
    y.setOverlayVisibility("grid", s.checked), h.requestRender("grid-toggle");
  }), i.addEventListener("change", () => {
    y.isOverlayVisible("grid") && h.requestRender("grid-units");
  }), c.addEventListener("click", () => W(0.08)), w.addEventListener("click", () => t.onDownload?.()), _.forEach((T) => {
    T.addEventListener("change", () => {
      A = _.find((Z) => Z.checked)?.value || "top", M();
    });
  }), window.addEventListener("resize", () => {
    f(), F || W(0.08);
  }), y.subscribe(() => {
    h.requestRender("visibility-change");
  });
  function L(T, Z) {
    const C = T.querySelector(Z);
    if (!C) throw new Error(`Missing required element: ${Z}`);
    return C;
  }
  function tt(T) {
    E = T.boardGeom, x = T.layers, M(), f(), W(0.08);
  }
  function X(T) {
    A = T;
    const Z = _.find((C) => C.value === T);
    Z && (Z.checked = !0), M();
  }
  function et() {
    window.removeEventListener("mousemove", N), window.removeEventListener("mouseup", o), b.innerHTML = "";
  }
  return f(), {
    setData: tt,
    setSideMode: X,
    fit: () => W(0.08),
    dispose: et,
    // Expose new render pipeline API
    viewer: h,
    visibility: y,
    overlayRegistry: l,
    markerRenderer: m,
    setSelection: (T) => {
      p = T, h.requestRender("selection-change");
    },
    addMarker: (T) => {
      m.add(T), h.requestRender("marker-added");
    },
    removeMarker: (T) => {
      m.remove(T), h.requestRender("marker-removed");
    }
  };
}
export {
  mt as GerberError,
  Ge as MarkerRenderer,
  Ye as OverlayRegistry,
  je as RenderScheduler,
  He as SelectionRenderer,
  Xe as Viewer,
  We as ViewportTransform,
  $e as VisibilityManager,
  Qe as createBoardViewer,
  tr as createGerberPass,
  er as createIntegratedViewer,
  Ve as createMarkerPass,
  Ze as createOverlayPass,
  qe as createSelectionPass,
  we as detectGerberBundle,
  Je as renderGerbers,
  ae as renderGerbersFiles,
  Ke as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
