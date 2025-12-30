var Tt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function oe(k) {
  return k && k.__esModule && Object.prototype.hasOwnProperty.call(k, "default") ? k.default : k;
}
function Pt(k) {
  throw new Error('Could not dynamically require "' + k + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Lt = { exports: {} };
var Xt;
function le() {
  return Xt || (Xt = 1, (function(k, c) {
    (function(e) {
      k.exports = e();
    })(function() {
      return (function e(b, d, a) {
        function s(v, _) {
          if (!d[v]) {
            if (!b[v]) {
              var m = typeof Pt == "function" && Pt;
              if (!_ && m) return m(v, !0);
              if (i) return i(v, !0);
              var y = new Error("Cannot find module '" + v + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var o = d[v] = { exports: {} };
            b[v][0].call(o.exports, function(p) {
              var n = b[v][1][p];
              return s(n || p);
            }, o, o.exports, e, b, d, a);
          }
          return d[v].exports;
        }
        for (var i = typeof Pt == "function" && Pt, l = 0; l < a.length; l++) s(a[l]);
        return s;
      })({ 1: [function(e, b, d) {
        var a = e("./utils"), s = e("./support"), i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        d.encode = function(l) {
          for (var v, _, m, y, o, p, n, f = [], u = 0, w = l.length, E = w, S = a.getTypeOf(l) !== "string"; u < l.length; ) E = w - u, m = S ? (v = l[u++], _ = u < w ? l[u++] : 0, u < w ? l[u++] : 0) : (v = l.charCodeAt(u++), _ = u < w ? l.charCodeAt(u++) : 0, u < w ? l.charCodeAt(u++) : 0), y = v >> 2, o = (3 & v) << 4 | _ >> 4, p = 1 < E ? (15 & _) << 2 | m >> 6 : 64, n = 2 < E ? 63 & m : 64, f.push(i.charAt(y) + i.charAt(o) + i.charAt(p) + i.charAt(n));
          return f.join("");
        }, d.decode = function(l) {
          var v, _, m, y, o, p, n = 0, f = 0, u = "data:";
          if (l.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var w, E = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === i.charAt(64) && E--, l.charAt(l.length - 2) === i.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (w = s.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); n < l.length; ) v = i.indexOf(l.charAt(n++)) << 2 | (y = i.indexOf(l.charAt(n++))) >> 4, _ = (15 & y) << 4 | (o = i.indexOf(l.charAt(n++))) >> 2, m = (3 & o) << 6 | (p = i.indexOf(l.charAt(n++))), w[f++] = v, o !== 64 && (w[f++] = _), p !== 64 && (w[f++] = m);
          return w;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, b, d) {
        var a = e("./external"), s = e("./stream/DataWorker"), i = e("./stream/Crc32Probe"), l = e("./stream/DataLengthProbe");
        function v(_, m, y, o, p) {
          this.compressedSize = _, this.uncompressedSize = m, this.crc32 = y, this.compression = o, this.compressedContent = p;
        }
        v.prototype = { getContentWorker: function() {
          var _ = new s(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), m = this;
          return _.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), _;
        }, getCompressedWorker: function() {
          return new s(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(_, m, y) {
          return _.pipe(new i()).pipe(new l("uncompressedSize")).pipe(m.compressWorker(y)).pipe(new l("compressedSize")).withStreamInfo("compression", m);
        }, b.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, b, d) {
        var a = e("./stream/GenericWorker");
        d.STORE = { magic: "\0\0", compressWorker: function() {
          return new a("STORE compression");
        }, uncompressWorker: function() {
          return new a("STORE decompression");
        } }, d.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, b, d) {
        var a = e("./utils"), s = (function() {
          for (var i, l = [], v = 0; v < 256; v++) {
            i = v;
            for (var _ = 0; _ < 8; _++) i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
            l[v] = i;
          }
          return l;
        })();
        b.exports = function(i, l) {
          return i !== void 0 && i.length ? a.getTypeOf(i) !== "string" ? (function(v, _, m, y) {
            var o = s, p = y + m;
            v ^= -1;
            for (var n = y; n < p; n++) v = v >>> 8 ^ o[255 & (v ^ _[n])];
            return -1 ^ v;
          })(0 | l, i, i.length, 0) : (function(v, _, m, y) {
            var o = s, p = y + m;
            v ^= -1;
            for (var n = y; n < p; n++) v = v >>> 8 ^ o[255 & (v ^ _.charCodeAt(n))];
            return -1 ^ v;
          })(0 | l, i, i.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, b, d) {
        d.base64 = !1, d.binary = !1, d.dir = !1, d.createFolders = !0, d.date = null, d.compression = null, d.compressionOptions = null, d.comment = null, d.unixPermissions = null, d.dosPermissions = null;
      }, {}], 6: [function(e, b, d) {
        var a = null;
        a = typeof Promise < "u" ? Promise : e("lie"), b.exports = { Promise: a };
      }, { lie: 37 }], 7: [function(e, b, d) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), i = e("./utils"), l = e("./stream/GenericWorker"), v = a ? "uint8array" : "array";
        function _(m, y) {
          l.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = y, this.meta = {};
        }
        d.magic = "\b\0", i.inherits(_, l), _.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(i.transformTo(v, m.data), !1);
        }, _.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, _.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, _.prototype._createPako = function() {
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(y) {
            m.push({ data: y, meta: m.meta });
          };
        }, d.compressWorker = function(m) {
          return new _("Deflate", m);
        }, d.uncompressWorker = function() {
          return new _("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, b, d) {
        function a(o, p) {
          var n, f = "";
          for (n = 0; n < p; n++) f += String.fromCharCode(255 & o), o >>>= 8;
          return f;
        }
        function s(o, p, n, f, u, w) {
          var E, S, A = o.file, T = o.compression, F = w !== v.utf8encode, P = i.transformTo("string", w(A.name)), C = i.transformTo("string", v.utf8encode(A.name)), U = A.comment, q = i.transformTo("string", w(U)), x = i.transformTo("string", v.utf8encode(U)), D = C.length !== A.name.length, r = x.length !== U.length, N = "", tt = "", j = "", et = A.dir, $ = A.date, J = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          p && !n || (J.crc32 = o.crc32, J.compressedSize = o.compressedSize, J.uncompressedSize = o.uncompressedSize);
          var O = 0;
          p && (O |= 8), F || !D && !r || (O |= 2048);
          var I = 0, K = 0;
          et && (I |= 16), u === "UNIX" ? (K = 798, I |= (function(Z, ut) {
            var ht = Z;
            return Z || (ht = ut ? 16893 : 33204), (65535 & ht) << 16;
          })(A.unixPermissions, et)) : (K = 20, I |= (function(Z) {
            return 63 & (Z || 0);
          })(A.dosPermissions)), E = $.getUTCHours(), E <<= 6, E |= $.getUTCMinutes(), E <<= 5, E |= $.getUTCSeconds() / 2, S = $.getUTCFullYear() - 1980, S <<= 4, S |= $.getUTCMonth() + 1, S <<= 5, S |= $.getUTCDate(), D && (tt = a(1, 1) + a(_(P), 4) + C, N += "up" + a(tt.length, 2) + tt), r && (j = a(1, 1) + a(_(q), 4) + x, N += "uc" + a(j.length, 2) + j);
          var H = "";
          return H += `
\0`, H += a(O, 2), H += T.magic, H += a(E, 2), H += a(S, 2), H += a(J.crc32, 4), H += a(J.compressedSize, 4), H += a(J.uncompressedSize, 4), H += a(P.length, 2), H += a(N.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + H + P + N, dirRecord: m.CENTRAL_FILE_HEADER + a(K, 2) + H + a(q.length, 2) + "\0\0\0\0" + a(I, 4) + a(f, 4) + P + N + q };
        }
        var i = e("../utils"), l = e("../stream/GenericWorker"), v = e("../utf8"), _ = e("../crc32"), m = e("../signature");
        function y(o, p, n, f) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = p, this.zipPlatform = n, this.encodeFileName = f, this.streamFiles = o, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        i.inherits(y, l), y.prototype.push = function(o) {
          var p = o.meta.percent || 0, n = this.entriesCount, f = this._sources.length;
          this.accumulate ? this.contentBuffer.push(o) : (this.bytesWritten += o.data.length, l.prototype.push.call(this, { data: o.data, meta: { currentFile: this.currentFile, percent: n ? (p + 100 * (n - f - 1)) / n : 100 } }));
        }, y.prototype.openedSource = function(o) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = o.file.name;
          var p = this.streamFiles && !o.file.dir;
          if (p) {
            var n = s(o, p, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: n.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(o) {
          this.accumulate = !1;
          var p = this.streamFiles && !o.file.dir, n = s(o, p, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(n.dirRecord), p) this.push({ data: (function(f) {
            return m.DATA_DESCRIPTOR + a(f.crc32, 4) + a(f.compressedSize, 4) + a(f.uncompressedSize, 4);
          })(o), meta: { percent: 100 } });
          else for (this.push({ data: n.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var o = this.bytesWritten, p = 0; p < this.dirRecords.length; p++) this.push({ data: this.dirRecords[p], meta: { percent: 100 } });
          var n = this.bytesWritten - o, f = (function(u, w, E, S, A) {
            var T = i.transformTo("string", A(S));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + a(u, 2) + a(u, 2) + a(w, 4) + a(E, 4) + a(T.length, 2) + T;
          })(this.dirRecords.length, n, o, this.zipComment, this.encodeFileName);
          this.push({ data: f, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(o) {
          this._sources.push(o);
          var p = this;
          return o.on("data", function(n) {
            p.processChunk(n);
          }), o.on("end", function() {
            p.closedSource(p.previous.streamInfo), p._sources.length ? p.prepareNextSource() : p.end();
          }), o.on("error", function(n) {
            p.error(n);
          }), this;
        }, y.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(o) {
          var p = this._sources;
          if (!l.prototype.error.call(this, o)) return !1;
          for (var n = 0; n < p.length; n++) try {
            p[n].error(o);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var o = this._sources, p = 0; p < o.length; p++) o[p].lock();
        }, b.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, b, d) {
        var a = e("../compressions"), s = e("./ZipFileWorker");
        d.generateWorker = function(i, l, v) {
          var _ = new s(l.streamFiles, v, l.platform, l.encodeFileName), m = 0;
          try {
            i.forEach(function(y, o) {
              m++;
              var p = (function(w, E) {
                var S = w || E, A = a[S];
                if (!A) throw new Error(S + " is not a valid compression method !");
                return A;
              })(o.options.compression, l.compression), n = o.options.compressionOptions || l.compressionOptions || {}, f = o.dir, u = o.date;
              o._compressWorker(p, n).withStreamInfo("file", { name: y, dir: f, date: u, comment: o.comment || "", unixPermissions: o.unixPermissions, dosPermissions: o.dosPermissions }).pipe(_);
            }), _.entriesCount = m;
          } catch (y) {
            _.error(y);
          }
          return _;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, b, d) {
        function a() {
          if (!(this instanceof a)) return new a();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new a();
            for (var i in this) typeof this[i] != "function" && (s[i] = this[i]);
            return s;
          };
        }
        (a.prototype = e("./object")).loadAsync = e("./load"), a.support = e("./support"), a.defaults = e("./defaults"), a.version = "3.10.1", a.loadAsync = function(s, i) {
          return new a().loadAsync(s, i);
        }, a.external = e("./external"), b.exports = a;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, b, d) {
        var a = e("./utils"), s = e("./external"), i = e("./utf8"), l = e("./zipEntries"), v = e("./stream/Crc32Probe"), _ = e("./nodejsUtils");
        function m(y) {
          return new s.Promise(function(o, p) {
            var n = y.decompressed.getContentWorker().pipe(new v());
            n.on("error", function(f) {
              p(f);
            }).on("end", function() {
              n.streamInfo.crc32 !== y.decompressed.crc32 ? p(new Error("Corrupted zip : CRC32 mismatch")) : o();
            }).resume();
          });
        }
        b.exports = function(y, o) {
          var p = this;
          return o = a.extend(o || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: i.utf8decode }), _.isNode && _.isStream(y) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : a.prepareContent("the loaded zip file", y, !0, o.optimizedBinaryString, o.base64).then(function(n) {
            var f = new l(o);
            return f.load(n), f;
          }).then(function(n) {
            var f = [s.Promise.resolve(n)], u = n.files;
            if (o.checkCRC32) for (var w = 0; w < u.length; w++) f.push(m(u[w]));
            return s.Promise.all(f);
          }).then(function(n) {
            for (var f = n.shift(), u = f.files, w = 0; w < u.length; w++) {
              var E = u[w], S = E.fileNameStr, A = a.resolve(E.fileNameStr);
              p.file(A, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: o.createFolders }), E.dir || (p.file(A).unsafeOriginalName = S);
            }
            return f.zipComment.length && (p.comment = f.zipComment), p;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, b, d) {
        var a = e("../utils"), s = e("../stream/GenericWorker");
        function i(l, v) {
          s.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(v);
        }
        a.inherits(i, s), i.prototype._bindStream = function(l) {
          var v = this;
          (this._stream = l).pause(), l.on("data", function(_) {
            v.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            v.isPaused ? this.generatedError = _ : v.error(_);
          }).on("end", function() {
            v.isPaused ? v._upstreamEnded = !0 : v.end();
          });
        }, i.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, i.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, b.exports = i;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, b, d) {
        var a = e("readable-stream").Readable;
        function s(i, l, v) {
          a.call(this, l), this._helper = i;
          var _ = this;
          i.on("data", function(m, y) {
            _.push(m) || _._helper.pause(), v && v(y);
          }).on("error", function(m) {
            _.emit("error", m);
          }).on("end", function() {
            _.push(null);
          });
        }
        e("../utils").inherits(s, a), s.prototype._read = function() {
          this._helper.resume();
        }, b.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, b, d) {
        b.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(a, s) {
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
      }, {}], 15: [function(e, b, d) {
        function a(A, T, F) {
          var P, C = i.getTypeOf(T), U = i.extend(F || {}, _);
          U.date = U.date || /* @__PURE__ */ new Date(), U.compression !== null && (U.compression = U.compression.toUpperCase()), typeof U.unixPermissions == "string" && (U.unixPermissions = parseInt(U.unixPermissions, 8)), U.unixPermissions && 16384 & U.unixPermissions && (U.dir = !0), U.dosPermissions && 16 & U.dosPermissions && (U.dir = !0), U.dir && (A = u(A)), U.createFolders && (P = f(A)) && w.call(this, P, !0);
          var q = C === "string" && U.binary === !1 && U.base64 === !1;
          F && F.binary !== void 0 || (U.binary = !q), (T instanceof m && T.uncompressedSize === 0 || U.dir || !T || T.length === 0) && (U.base64 = !1, U.binary = !0, T = "", U.compression = "STORE", C = "string");
          var x = null;
          x = T instanceof m || T instanceof l ? T : p.isNode && p.isStream(T) ? new n(A, T) : i.prepareContent(A, T, U.binary, U.optimizedBinaryString, U.base64);
          var D = new y(A, x, U);
          this.files[A] = D;
        }
        var s = e("./utf8"), i = e("./utils"), l = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), _ = e("./defaults"), m = e("./compressedObject"), y = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), n = e("./nodejs/NodejsStreamInputAdapter"), f = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var T = A.lastIndexOf("/");
          return 0 < T ? A.substring(0, T) : "";
        }, u = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, w = function(A, T) {
          return T = T !== void 0 ? T : _.createFolders, A = u(A), this.files[A] || a.call(this, A, null, { dir: !0, createFolders: T }), this.files[A];
        };
        function E(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var S = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var T, F, P;
          for (T in this.files) P = this.files[T], (F = T.slice(this.root.length, T.length)) && T.slice(0, this.root.length) === this.root && A(F, P);
        }, filter: function(A) {
          var T = [];
          return this.forEach(function(F, P) {
            A(F, P) && T.push(P);
          }), T;
        }, file: function(A, T, F) {
          if (arguments.length !== 1) return A = this.root + A, a.call(this, A, T, F), this;
          if (E(A)) {
            var P = A;
            return this.filter(function(U, q) {
              return !q.dir && P.test(U);
            });
          }
          var C = this.files[this.root + A];
          return C && !C.dir ? C : null;
        }, folder: function(A) {
          if (!A) return this;
          if (E(A)) return this.filter(function(C, U) {
            return U.dir && A.test(C);
          });
          var T = this.root + A, F = w.call(this, T), P = this.clone();
          return P.root = F.name, P;
        }, remove: function(A) {
          A = this.root + A;
          var T = this.files[A];
          if (T || (A.slice(-1) !== "/" && (A += "/"), T = this.files[A]), T && !T.dir) delete this.files[A];
          else for (var F = this.filter(function(C, U) {
            return U.name.slice(0, A.length) === A;
          }), P = 0; P < F.length; P++) delete this.files[F[P].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var T, F = {};
          try {
            if ((F = i.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = F.type.toLowerCase(), F.compression = F.compression.toUpperCase(), F.type === "binarystring" && (F.type = "string"), !F.type) throw new Error("No output type specified.");
            i.checkSupport(F.type), F.platform !== "darwin" && F.platform !== "freebsd" && F.platform !== "linux" && F.platform !== "sunos" || (F.platform = "UNIX"), F.platform === "win32" && (F.platform = "DOS");
            var P = F.comment || this.comment || "";
            T = o.generateWorker(this, F, P);
          } catch (C) {
            (T = new l("error")).error(C);
          }
          return new v(T, F.type || "string", F.mimeType);
        }, generateAsync: function(A, T) {
          return this.generateInternalStream(A).accumulate(T);
        }, generateNodeStream: function(A, T) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(T);
        } };
        b.exports = S;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, b, d) {
        b.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, b, d) {
        var a = e("./DataReader");
        function s(i) {
          a.call(this, i);
          for (var l = 0; l < this.data.length; l++) i[l] = 255 & i[l];
        }
        e("../utils").inherits(s, a), s.prototype.byteAt = function(i) {
          return this.data[this.zero + i];
        }, s.prototype.lastIndexOfSignature = function(i) {
          for (var l = i.charCodeAt(0), v = i.charCodeAt(1), _ = i.charCodeAt(2), m = i.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === l && this.data[y + 1] === v && this.data[y + 2] === _ && this.data[y + 3] === m) return y - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(i) {
          var l = i.charCodeAt(0), v = i.charCodeAt(1), _ = i.charCodeAt(2), m = i.charCodeAt(3), y = this.readData(4);
          return l === y[0] && v === y[1] && _ === y[2] && m === y[3];
        }, s.prototype.readData = function(i) {
          if (this.checkOffset(i), i === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, l;
        }, b.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, b, d) {
        var a = e("../utils");
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
          var l, v = 0;
          for (this.checkOffset(i), l = this.index + i - 1; l >= this.index; l--) v = (v << 8) + this.byteAt(l);
          return this.index += i, v;
        }, readString: function(i) {
          return a.transformTo("string", this.readData(i));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var i = this.readInt(4);
          return new Date(Date.UTC(1980 + (i >> 25 & 127), (i >> 21 & 15) - 1, i >> 16 & 31, i >> 11 & 31, i >> 5 & 63, (31 & i) << 1));
        } }, b.exports = s;
      }, { "../utils": 32 }], 19: [function(e, b, d) {
        var a = e("./Uint8ArrayReader");
        function s(i) {
          a.call(this, i);
        }
        e("../utils").inherits(s, a), s.prototype.readData = function(i) {
          this.checkOffset(i);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, l;
        }, b.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, b, d) {
        var a = e("./DataReader");
        function s(i) {
          a.call(this, i);
        }
        e("../utils").inherits(s, a), s.prototype.byteAt = function(i) {
          return this.data.charCodeAt(this.zero + i);
        }, s.prototype.lastIndexOfSignature = function(i) {
          return this.data.lastIndexOf(i) - this.zero;
        }, s.prototype.readAndCheckSignature = function(i) {
          return i === this.readData(4);
        }, s.prototype.readData = function(i) {
          this.checkOffset(i);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, l;
        }, b.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, b, d) {
        var a = e("./ArrayReader");
        function s(i) {
          a.call(this, i);
        }
        e("../utils").inherits(s, a), s.prototype.readData = function(i) {
          if (this.checkOffset(i), i === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + i);
          return this.index += i, l;
        }, b.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, b, d) {
        var a = e("../utils"), s = e("../support"), i = e("./ArrayReader"), l = e("./StringReader"), v = e("./NodeBufferReader"), _ = e("./Uint8ArrayReader");
        b.exports = function(m) {
          var y = a.getTypeOf(m);
          return a.checkSupport(y), y !== "string" || s.uint8array ? y === "nodebuffer" ? new v(m) : s.uint8array ? new _(a.transformTo("uint8array", m)) : new i(a.transformTo("array", m)) : new l(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, b, d) {
        d.LOCAL_FILE_HEADER = "PK", d.CENTRAL_FILE_HEADER = "PK", d.CENTRAL_DIRECTORY_END = "PK", d.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", d.ZIP64_CENTRAL_DIRECTORY_END = "PK", d.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, b, d) {
        var a = e("./GenericWorker"), s = e("../utils");
        function i(l) {
          a.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        s.inherits(i, a), i.prototype.processChunk = function(l) {
          this.push({ data: s.transformTo(this.destType, l.data), meta: l.meta });
        }, b.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, b, d) {
        var a = e("./GenericWorker"), s = e("../crc32");
        function i() {
          a.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(i, a), i.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = s(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, b.exports = i;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, b, d) {
        var a = e("../utils"), s = e("./GenericWorker");
        function i(l) {
          s.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        a.inherits(i, s), i.prototype.processChunk = function(l) {
          if (l) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + l.data.length;
          }
          s.prototype.processChunk.call(this, l);
        }, b.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, b, d) {
        var a = e("../utils"), s = e("./GenericWorker");
        function i(l) {
          s.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(_) {
            v.dataIsReady = !0, v.data = _, v.max = _ && _.length || 0, v.type = a.getTypeOf(_), v.isPaused || v._tickAndRepeat();
          }, function(_) {
            v.error(_);
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
          var l = null, v = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, v);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, v);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, v);
          }
          return this.index = v, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, b.exports = i;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, b, d) {
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
          if (this._listeners[s]) for (var l = 0; l < this._listeners[s].length; l++) this._listeners[s][l].call(this, i);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var i = this;
          return s.on("data", function(l) {
            i.processChunk(l);
          }), s.on("end", function() {
            i.end();
          }), s.on("error", function(l) {
            i.error(l);
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
        } }, b.exports = a;
      }, {}], 29: [function(e, b, d) {
        var a = e("../utils"), s = e("./ConvertWorker"), i = e("./GenericWorker"), l = e("../base64"), v = e("../support"), _ = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(p, n) {
          return new _.Promise(function(f, u) {
            var w = [], E = p._internalType, S = p._outputType, A = p._mimeType;
            p.on("data", function(T, F) {
              w.push(T), n && n(F);
            }).on("error", function(T) {
              w = [], u(T);
            }).on("end", function() {
              try {
                var T = (function(F, P, C) {
                  switch (F) {
                    case "blob":
                      return a.newBlob(a.transformTo("arraybuffer", P), C);
                    case "base64":
                      return l.encode(P);
                    default:
                      return a.transformTo(F, P);
                  }
                })(S, (function(F, P) {
                  var C, U = 0, q = null, x = 0;
                  for (C = 0; C < P.length; C++) x += P[C].length;
                  switch (F) {
                    case "string":
                      return P.join("");
                    case "array":
                      return Array.prototype.concat.apply([], P);
                    case "uint8array":
                      for (q = new Uint8Array(x), C = 0; C < P.length; C++) q.set(P[C], U), U += P[C].length;
                      return q;
                    case "nodebuffer":
                      return Buffer.concat(P);
                    default:
                      throw new Error("concat : unsupported type '" + F + "'");
                  }
                })(E, w), A);
                f(T);
              } catch (F) {
                u(F);
              }
              w = [];
            }).resume();
          });
        }
        function o(p, n, f) {
          var u = n;
          switch (n) {
            case "blob":
            case "arraybuffer":
              u = "uint8array";
              break;
            case "base64":
              u = "string";
          }
          try {
            this._internalType = u, this._outputType = n, this._mimeType = f, a.checkSupport(u), this._worker = p.pipe(new s(u)), p.lock();
          } catch (w) {
            this._worker = new i("error"), this._worker.error(w);
          }
        }
        o.prototype = { accumulate: function(p) {
          return y(this, p);
        }, on: function(p, n) {
          var f = this;
          return p === "data" ? this._worker.on(p, function(u) {
            n.call(f, u.data, u.meta);
          }) : this._worker.on(p, function() {
            a.delay(n, arguments, f);
          }), this;
        }, resume: function() {
          return a.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(p) {
          if (a.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, p);
        } }, b.exports = o;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, b, d) {
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
          d.nodestream = !!e("readable-stream").Readable;
        } catch {
          d.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, b, d) {
        for (var a = e("./utils"), s = e("./support"), i = e("./nodejsUtils"), l = e("./stream/GenericWorker"), v = new Array(256), _ = 0; _ < 256; _++) v[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          l.call(this, "utf-8 encode");
        }
        d.utf8encode = function(o) {
          return s.nodebuffer ? i.newBufferFrom(o, "utf-8") : (function(p) {
            var n, f, u, w, E, S = p.length, A = 0;
            for (w = 0; w < S; w++) (64512 & (f = p.charCodeAt(w))) == 55296 && w + 1 < S && (64512 & (u = p.charCodeAt(w + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (u - 56320), w++), A += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
            for (n = s.uint8array ? new Uint8Array(A) : new Array(A), w = E = 0; E < A; w++) (64512 & (f = p.charCodeAt(w))) == 55296 && w + 1 < S && (64512 & (u = p.charCodeAt(w + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (u - 56320), w++), f < 128 ? n[E++] = f : (f < 2048 ? n[E++] = 192 | f >>> 6 : (f < 65536 ? n[E++] = 224 | f >>> 12 : (n[E++] = 240 | f >>> 18, n[E++] = 128 | f >>> 12 & 63), n[E++] = 128 | f >>> 6 & 63), n[E++] = 128 | 63 & f);
            return n;
          })(o);
        }, d.utf8decode = function(o) {
          return s.nodebuffer ? a.transformTo("nodebuffer", o).toString("utf-8") : (function(p) {
            var n, f, u, w, E = p.length, S = new Array(2 * E);
            for (n = f = 0; n < E; ) if ((u = p[n++]) < 128) S[f++] = u;
            else if (4 < (w = v[u])) S[f++] = 65533, n += w - 1;
            else {
              for (u &= w === 2 ? 31 : w === 3 ? 15 : 7; 1 < w && n < E; ) u = u << 6 | 63 & p[n++], w--;
              1 < w ? S[f++] = 65533 : u < 65536 ? S[f++] = u : (u -= 65536, S[f++] = 55296 | u >> 10 & 1023, S[f++] = 56320 | 1023 & u);
            }
            return S.length !== f && (S.subarray ? S = S.subarray(0, f) : S.length = f), a.applyFromCharCode(S);
          })(o = a.transformTo(s.uint8array ? "uint8array" : "array", o));
        }, a.inherits(m, l), m.prototype.processChunk = function(o) {
          var p = a.transformTo(s.uint8array ? "uint8array" : "array", o.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var n = p;
              (p = new Uint8Array(n.length + this.leftOver.length)).set(this.leftOver, 0), p.set(n, this.leftOver.length);
            } else p = this.leftOver.concat(p);
            this.leftOver = null;
          }
          var f = (function(w, E) {
            var S;
            for ((E = E || w.length) > w.length && (E = w.length), S = E - 1; 0 <= S && (192 & w[S]) == 128; ) S--;
            return S < 0 || S === 0 ? E : S + v[w[S]] > E ? S : E;
          })(p), u = p;
          f !== p.length && (s.uint8array ? (u = p.subarray(0, f), this.leftOver = p.subarray(f, p.length)) : (u = p.slice(0, f), this.leftOver = p.slice(f, p.length))), this.push({ data: d.utf8decode(u), meta: o.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: d.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, d.Utf8DecodeWorker = m, a.inherits(y, l), y.prototype.processChunk = function(o) {
          this.push({ data: d.utf8encode(o.data), meta: o.meta });
        }, d.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, b, d) {
        var a = e("./support"), s = e("./base64"), i = e("./nodejsUtils"), l = e("./external");
        function v(n) {
          return n;
        }
        function _(n, f) {
          for (var u = 0; u < n.length; ++u) f[u] = 255 & n.charCodeAt(u);
          return f;
        }
        e("setimmediate"), d.newBlob = function(n, f) {
          d.checkSupport("blob");
          try {
            return new Blob([n], { type: f });
          } catch {
            try {
              var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return u.append(n), u.getBlob(f);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(n, f, u) {
          var w = [], E = 0, S = n.length;
          if (S <= u) return String.fromCharCode.apply(null, n);
          for (; E < S; ) f === "array" || f === "nodebuffer" ? w.push(String.fromCharCode.apply(null, n.slice(E, Math.min(E + u, S)))) : w.push(String.fromCharCode.apply(null, n.subarray(E, Math.min(E + u, S)))), E += u;
          return w.join("");
        }, stringifyByChar: function(n) {
          for (var f = "", u = 0; u < n.length; u++) f += String.fromCharCode(n[u]);
          return f;
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
          var f = 65536, u = d.getTypeOf(n), w = !0;
          if (u === "uint8array" ? w = m.applyCanBeUsed.uint8array : u === "nodebuffer" && (w = m.applyCanBeUsed.nodebuffer), w) for (; 1 < f; ) try {
            return m.stringifyByChunk(n, u, f);
          } catch {
            f = Math.floor(f / 2);
          }
          return m.stringifyByChar(n);
        }
        function o(n, f) {
          for (var u = 0; u < n.length; u++) f[u] = n[u];
          return f;
        }
        d.applyFromCharCode = y;
        var p = {};
        p.string = { string: v, array: function(n) {
          return _(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return p.string.uint8array(n).buffer;
        }, uint8array: function(n) {
          return _(n, new Uint8Array(n.length));
        }, nodebuffer: function(n) {
          return _(n, i.allocBuffer(n.length));
        } }, p.array = { string: y, array: v, arraybuffer: function(n) {
          return new Uint8Array(n).buffer;
        }, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return i.newBufferFrom(n);
        } }, p.arraybuffer = { string: function(n) {
          return y(new Uint8Array(n));
        }, array: function(n) {
          return o(new Uint8Array(n), new Array(n.byteLength));
        }, arraybuffer: v, uint8array: function(n) {
          return new Uint8Array(n);
        }, nodebuffer: function(n) {
          return i.newBufferFrom(new Uint8Array(n));
        } }, p.uint8array = { string: y, array: function(n) {
          return o(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return n.buffer;
        }, uint8array: v, nodebuffer: function(n) {
          return i.newBufferFrom(n);
        } }, p.nodebuffer = { string: y, array: function(n) {
          return o(n, new Array(n.length));
        }, arraybuffer: function(n) {
          return p.nodebuffer.uint8array(n).buffer;
        }, uint8array: function(n) {
          return o(n, new Uint8Array(n.length));
        }, nodebuffer: v }, d.transformTo = function(n, f) {
          if (f = f || "", !n) return f;
          d.checkSupport(n);
          var u = d.getTypeOf(f);
          return p[u][n](f);
        }, d.resolve = function(n) {
          for (var f = n.split("/"), u = [], w = 0; w < f.length; w++) {
            var E = f[w];
            E === "." || E === "" && w !== 0 && w !== f.length - 1 || (E === ".." ? u.pop() : u.push(E));
          }
          return u.join("/");
        }, d.getTypeOf = function(n) {
          return typeof n == "string" ? "string" : Object.prototype.toString.call(n) === "[object Array]" ? "array" : a.nodebuffer && i.isBuffer(n) ? "nodebuffer" : a.uint8array && n instanceof Uint8Array ? "uint8array" : a.arraybuffer && n instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, d.checkSupport = function(n) {
          if (!a[n.toLowerCase()]) throw new Error(n + " is not supported by this platform");
        }, d.MAX_VALUE_16BITS = 65535, d.MAX_VALUE_32BITS = -1, d.pretty = function(n) {
          var f, u, w = "";
          for (u = 0; u < (n || "").length; u++) w += "\\x" + ((f = n.charCodeAt(u)) < 16 ? "0" : "") + f.toString(16).toUpperCase();
          return w;
        }, d.delay = function(n, f, u) {
          setImmediate(function() {
            n.apply(u || null, f || []);
          });
        }, d.inherits = function(n, f) {
          function u() {
          }
          u.prototype = f.prototype, n.prototype = new u();
        }, d.extend = function() {
          var n, f, u = {};
          for (n = 0; n < arguments.length; n++) for (f in arguments[n]) Object.prototype.hasOwnProperty.call(arguments[n], f) && u[f] === void 0 && (u[f] = arguments[n][f]);
          return u;
        }, d.prepareContent = function(n, f, u, w, E) {
          return l.Promise.resolve(f).then(function(S) {
            return a.blob && (S instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(S)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(A, T) {
              var F = new FileReader();
              F.onload = function(P) {
                A(P.target.result);
              }, F.onerror = function(P) {
                T(P.target.error);
              }, F.readAsArrayBuffer(S);
            }) : S;
          }).then(function(S) {
            var A = d.getTypeOf(S);
            return A ? (A === "arraybuffer" ? S = d.transformTo("uint8array", S) : A === "string" && (E ? S = s.decode(S) : u && w !== !0 && (S = (function(T) {
              return _(T, a.uint8array ? new Uint8Array(T.length) : new Array(T.length));
            })(S))), S) : l.Promise.reject(new Error("Can't read the data of '" + n + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, b, d) {
        var a = e("./reader/readerFor"), s = e("./utils"), i = e("./signature"), l = e("./zipEntry"), v = e("./support");
        function _(m) {
          this.files = [], this.loadOptions = m;
        }
        _.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(y) + ", expected " + s.pretty(m) + ")");
          }
        }, isSignature: function(m, y) {
          var o = this.reader.index;
          this.reader.setIndex(m);
          var p = this.reader.readString(4) === y;
          return this.reader.setIndex(o), p;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), y = v.uint8array ? "uint8array" : "array", o = s.transformTo(y, m);
          this.zipComment = this.loadOptions.decodeFileName(o);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, y, o, p = this.zip64EndOfCentralSize - 44; 0 < p; ) m = this.reader.readInt(2), y = this.reader.readInt(4), o = this.reader.readData(y), this.zip64ExtensibleData[m] = { id: m, length: y, value: o };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, y;
          for (m = 0; m < this.files.length; m++) y = this.files[m], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(i.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(i.CENTRAL_FILE_HEADER); ) (m = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(i.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, i.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var y = m;
          if (this.checkSignature(i.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, i.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var o = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (o += 20, o += 12 + this.zip64EndOfCentralSize);
          var p = y - o;
          if (0 < p) this.isSignature(y, i.CENTRAL_FILE_HEADER) || (this.reader.zero = p);
          else if (p < 0) throw new Error("Corrupted zip: missing " + Math.abs(p) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = a(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, b.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, b, d) {
        var a = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), l = e("./crc32"), v = e("./utf8"), _ = e("./compressions"), m = e("./support");
        function y(o, p) {
          this.options = o, this.loadOptions = p;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(o) {
          var p, n;
          if (o.skip(22), this.fileNameLength = o.readInt(2), n = o.readInt(2), this.fileName = o.readData(this.fileNameLength), o.skip(n), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((p = (function(f) {
            for (var u in _) if (Object.prototype.hasOwnProperty.call(_, u) && _[u].magic === f) return _[u];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, p, o.readData(this.compressedSize));
        }, readCentralPart: function(o) {
          this.versionMadeBy = o.readInt(2), o.skip(2), this.bitFlag = o.readInt(2), this.compressionMethod = o.readString(2), this.date = o.readDate(), this.crc32 = o.readInt(4), this.compressedSize = o.readInt(4), this.uncompressedSize = o.readInt(4);
          var p = o.readInt(2);
          if (this.extraFieldsLength = o.readInt(2), this.fileCommentLength = o.readInt(2), this.diskNumberStart = o.readInt(2), this.internalFileAttributes = o.readInt(2), this.externalFileAttributes = o.readInt(4), this.localHeaderOffset = o.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          o.skip(p), this.readExtraFields(o), this.parseZIP64ExtraField(o), this.fileComment = o.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var o = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), o == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), o == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var o = a(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = o.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = o.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = o.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = o.readInt(4));
          }
        }, readExtraFields: function(o) {
          var p, n, f, u = o.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); o.index + 4 < u; ) p = o.readInt(2), n = o.readInt(2), f = o.readData(n), this.extraFields[p] = { id: p, length: n, value: f };
          o.setIndex(u);
        }, handleUTF8: function() {
          var o = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var p = this.findExtraFieldUnicodePath();
            if (p !== null) this.fileNameStr = p;
            else {
              var n = s.transformTo(o, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(n);
            }
            var f = this.findExtraFieldUnicodeComment();
            if (f !== null) this.fileCommentStr = f;
            else {
              var u = s.transformTo(o, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(u);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var o = this.extraFields[28789];
          if (o) {
            var p = a(o.value);
            return p.readInt(1) !== 1 || l(this.fileName) !== p.readInt(4) ? null : v.utf8decode(p.readData(o.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var o = this.extraFields[25461];
          if (o) {
            var p = a(o.value);
            return p.readInt(1) !== 1 || l(this.fileComment) !== p.readInt(4) ? null : v.utf8decode(p.readData(o.length - 5));
          }
          return null;
        } }, b.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, b, d) {
        function a(p, n, f) {
          this.name = p, this.dir = f.dir, this.date = f.date, this.comment = f.comment, this.unixPermissions = f.unixPermissions, this.dosPermissions = f.dosPermissions, this._data = n, this._dataBinary = f.binary, this.options = { compression: f.compression, compressionOptions: f.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), l = e("./utf8"), v = e("./compressedObject"), _ = e("./stream/GenericWorker");
        a.prototype = { internalStream: function(p) {
          var n = null, f = "string";
          try {
            if (!p) throw new Error("No output type specified.");
            var u = (f = p.toLowerCase()) === "string" || f === "text";
            f !== "binarystring" && f !== "text" || (f = "string"), n = this._decompressWorker();
            var w = !this._dataBinary;
            w && !u && (n = n.pipe(new l.Utf8EncodeWorker())), !w && u && (n = n.pipe(new l.Utf8DecodeWorker()));
          } catch (E) {
            (n = new _("error")).error(E);
          }
          return new s(n, f, "");
        }, async: function(p, n) {
          return this.internalStream(p).accumulate(n);
        }, nodeStream: function(p, n) {
          return this.internalStream(p || "nodebuffer").toNodejsStream(n);
        }, _compressWorker: function(p, n) {
          if (this._data instanceof v && this._data.compression.magic === p.magic) return this._data.getCompressedWorker();
          var f = this._decompressWorker();
          return this._dataBinary || (f = f.pipe(new l.Utf8EncodeWorker())), v.createWorkerFrom(f, p, n);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new i(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, o = 0; o < m.length; o++) a.prototype[m[o]] = y;
        b.exports = a;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, b, d) {
        (function(a) {
          var s, i, l = a.MutationObserver || a.WebKitMutationObserver;
          if (l) {
            var v = 0, _ = new l(p), m = a.document.createTextNode("");
            _.observe(m, { characterData: !0 }), s = function() {
              m.data = v = ++v % 2;
            };
          } else if (a.setImmediate || a.MessageChannel === void 0) s = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function() {
            var n = a.document.createElement("script");
            n.onreadystatechange = function() {
              p(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null;
            }, a.document.documentElement.appendChild(n);
          } : function() {
            setTimeout(p, 0);
          };
          else {
            var y = new a.MessageChannel();
            y.port1.onmessage = p, s = function() {
              y.port2.postMessage(0);
            };
          }
          var o = [];
          function p() {
            var n, f;
            i = !0;
            for (var u = o.length; u; ) {
              for (f = o, o = [], n = -1; ++n < u; ) f[n]();
              u = o.length;
            }
            i = !1;
          }
          b.exports = function(n) {
            o.push(n) !== 1 || i || s();
          };
        }).call(this, typeof Tt < "u" ? Tt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, b, d) {
        var a = e("immediate");
        function s() {
        }
        var i = {}, l = ["REJECTED"], v = ["FULFILLED"], _ = ["PENDING"];
        function m(u) {
          if (typeof u != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, u !== s && n(this, u);
        }
        function y(u, w, E) {
          this.promise = u, typeof w == "function" && (this.onFulfilled = w, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
        }
        function o(u, w, E) {
          a(function() {
            var S;
            try {
              S = w(E);
            } catch (A) {
              return i.reject(u, A);
            }
            S === u ? i.reject(u, new TypeError("Cannot resolve promise with itself")) : i.resolve(u, S);
          });
        }
        function p(u) {
          var w = u && u.then;
          if (u && (typeof u == "object" || typeof u == "function") && typeof w == "function") return function() {
            w.apply(u, arguments);
          };
        }
        function n(u, w) {
          var E = !1;
          function S(F) {
            E || (E = !0, i.reject(u, F));
          }
          function A(F) {
            E || (E = !0, i.resolve(u, F));
          }
          var T = f(function() {
            w(A, S);
          });
          T.status === "error" && S(T.value);
        }
        function f(u, w) {
          var E = {};
          try {
            E.value = u(w), E.status = "success";
          } catch (S) {
            E.status = "error", E.value = S;
          }
          return E;
        }
        (b.exports = m).prototype.finally = function(u) {
          if (typeof u != "function") return this;
          var w = this.constructor;
          return this.then(function(E) {
            return w.resolve(u()).then(function() {
              return E;
            });
          }, function(E) {
            return w.resolve(u()).then(function() {
              throw E;
            });
          });
        }, m.prototype.catch = function(u) {
          return this.then(null, u);
        }, m.prototype.then = function(u, w) {
          if (typeof u != "function" && this.state === v || typeof w != "function" && this.state === l) return this;
          var E = new this.constructor(s);
          return this.state !== _ ? o(E, this.state === v ? u : w, this.outcome) : this.queue.push(new y(E, u, w)), E;
        }, y.prototype.callFulfilled = function(u) {
          i.resolve(this.promise, u);
        }, y.prototype.otherCallFulfilled = function(u) {
          o(this.promise, this.onFulfilled, u);
        }, y.prototype.callRejected = function(u) {
          i.reject(this.promise, u);
        }, y.prototype.otherCallRejected = function(u) {
          o(this.promise, this.onRejected, u);
        }, i.resolve = function(u, w) {
          var E = f(p, w);
          if (E.status === "error") return i.reject(u, E.value);
          var S = E.value;
          if (S) n(u, S);
          else {
            u.state = v, u.outcome = w;
            for (var A = -1, T = u.queue.length; ++A < T; ) u.queue[A].callFulfilled(w);
          }
          return u;
        }, i.reject = function(u, w) {
          u.state = l, u.outcome = w;
          for (var E = -1, S = u.queue.length; ++E < S; ) u.queue[E].callRejected(w);
          return u;
        }, m.resolve = function(u) {
          return u instanceof this ? u : i.resolve(new this(s), u);
        }, m.reject = function(u) {
          var w = new this(s);
          return i.reject(w, u);
        }, m.all = function(u) {
          var w = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = u.length, S = !1;
          if (!E) return this.resolve([]);
          for (var A = new Array(E), T = 0, F = -1, P = new this(s); ++F < E; ) C(u[F], F);
          return P;
          function C(U, q) {
            w.resolve(U).then(function(x) {
              A[q] = x, ++T !== E || S || (S = !0, i.resolve(P, A));
            }, function(x) {
              S || (S = !0, i.reject(P, x));
            });
          }
        }, m.race = function(u) {
          var w = this;
          if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = u.length, S = !1;
          if (!E) return this.resolve([]);
          for (var A = -1, T = new this(s); ++A < E; ) F = u[A], w.resolve(F).then(function(P) {
            S || (S = !0, i.resolve(T, P));
          }, function(P) {
            S || (S = !0, i.reject(T, P));
          });
          var F;
          return T;
        };
      }, { immediate: 36 }], 38: [function(e, b, d) {
        var a = {};
        (0, e("./lib/utils/common").assign)(a, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), b.exports = a;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, b, d) {
        var a = e("./zlib/deflate"), s = e("./utils/common"), i = e("./utils/strings"), l = e("./zlib/messages"), v = e("./zlib/zstream"), _ = Object.prototype.toString, m = 0, y = -1, o = 0, p = 8;
        function n(u) {
          if (!(this instanceof n)) return new n(u);
          this.options = s.assign({ level: y, method: p, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: o, to: "" }, u || {});
          var w = this.options;
          w.raw && 0 < w.windowBits ? w.windowBits = -w.windowBits : w.gzip && 0 < w.windowBits && w.windowBits < 16 && (w.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var E = a.deflateInit2(this.strm, w.level, w.method, w.windowBits, w.memLevel, w.strategy);
          if (E !== m) throw new Error(l[E]);
          if (w.header && a.deflateSetHeader(this.strm, w.header), w.dictionary) {
            var S;
            if (S = typeof w.dictionary == "string" ? i.string2buf(w.dictionary) : _.call(w.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(w.dictionary) : w.dictionary, (E = a.deflateSetDictionary(this.strm, S)) !== m) throw new Error(l[E]);
            this._dict_set = !0;
          }
        }
        function f(u, w) {
          var E = new n(w);
          if (E.push(u, !0), E.err) throw E.msg || l[E.err];
          return E.result;
        }
        n.prototype.push = function(u, w) {
          var E, S, A = this.strm, T = this.options.chunkSize;
          if (this.ended) return !1;
          S = w === ~~w ? w : w === !0 ? 4 : 0, typeof u == "string" ? A.input = i.string2buf(u) : _.call(u) === "[object ArrayBuffer]" ? A.input = new Uint8Array(u) : A.input = u, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new s.Buf8(T), A.next_out = 0, A.avail_out = T), (E = a.deflate(A, S)) !== 1 && E !== m) return this.onEnd(E), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || S !== 4 && S !== 2) || (this.options.to === "string" ? this.onData(i.buf2binstring(s.shrinkBuf(A.output, A.next_out))) : this.onData(s.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && E !== 1);
          return S === 4 ? (E = a.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === m) : S !== 2 || (this.onEnd(m), !(A.avail_out = 0));
        }, n.prototype.onData = function(u) {
          this.chunks.push(u);
        }, n.prototype.onEnd = function(u) {
          u === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, d.Deflate = n, d.deflate = f, d.deflateRaw = function(u, w) {
          return (w = w || {}).raw = !0, f(u, w);
        }, d.gzip = function(u, w) {
          return (w = w || {}).gzip = !0, f(u, w);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, b, d) {
        var a = e("./zlib/inflate"), s = e("./utils/common"), i = e("./utils/strings"), l = e("./zlib/constants"), v = e("./zlib/messages"), _ = e("./zlib/zstream"), m = e("./zlib/gzheader"), y = Object.prototype.toString;
        function o(n) {
          if (!(this instanceof o)) return new o(n);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, n || {});
          var f = this.options;
          f.raw && 0 <= f.windowBits && f.windowBits < 16 && (f.windowBits = -f.windowBits, f.windowBits === 0 && (f.windowBits = -15)), !(0 <= f.windowBits && f.windowBits < 16) || n && n.windowBits || (f.windowBits += 32), 15 < f.windowBits && f.windowBits < 48 && (15 & f.windowBits) == 0 && (f.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(), this.strm.avail_out = 0;
          var u = a.inflateInit2(this.strm, f.windowBits);
          if (u !== l.Z_OK) throw new Error(v[u]);
          this.header = new m(), a.inflateGetHeader(this.strm, this.header);
        }
        function p(n, f) {
          var u = new o(f);
          if (u.push(n, !0), u.err) throw u.msg || v[u.err];
          return u.result;
        }
        o.prototype.push = function(n, f) {
          var u, w, E, S, A, T, F = this.strm, P = this.options.chunkSize, C = this.options.dictionary, U = !1;
          if (this.ended) return !1;
          w = f === ~~f ? f : f === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof n == "string" ? F.input = i.binstring2buf(n) : y.call(n) === "[object ArrayBuffer]" ? F.input = new Uint8Array(n) : F.input = n, F.next_in = 0, F.avail_in = F.input.length;
          do {
            if (F.avail_out === 0 && (F.output = new s.Buf8(P), F.next_out = 0, F.avail_out = P), (u = a.inflate(F, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && C && (T = typeof C == "string" ? i.string2buf(C) : y.call(C) === "[object ArrayBuffer]" ? new Uint8Array(C) : C, u = a.inflateSetDictionary(this.strm, T)), u === l.Z_BUF_ERROR && U === !0 && (u = l.Z_OK, U = !1), u !== l.Z_STREAM_END && u !== l.Z_OK) return this.onEnd(u), !(this.ended = !0);
            F.next_out && (F.avail_out !== 0 && u !== l.Z_STREAM_END && (F.avail_in !== 0 || w !== l.Z_FINISH && w !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = i.utf8border(F.output, F.next_out), S = F.next_out - E, A = i.buf2string(F.output, E), F.next_out = S, F.avail_out = P - S, S && s.arraySet(F.output, F.output, E, S, 0), this.onData(A)) : this.onData(s.shrinkBuf(F.output, F.next_out)))), F.avail_in === 0 && F.avail_out === 0 && (U = !0);
          } while ((0 < F.avail_in || F.avail_out === 0) && u !== l.Z_STREAM_END);
          return u === l.Z_STREAM_END && (w = l.Z_FINISH), w === l.Z_FINISH ? (u = a.inflateEnd(this.strm), this.onEnd(u), this.ended = !0, u === l.Z_OK) : w !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(F.avail_out = 0));
        }, o.prototype.onData = function(n) {
          this.chunks.push(n);
        }, o.prototype.onEnd = function(n) {
          n === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = n, this.msg = this.strm.msg;
        }, d.Inflate = o, d.inflate = p, d.inflateRaw = function(n, f) {
          return (f = f || {}).raw = !0, p(n, f);
        }, d.ungzip = p;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, b, d) {
        var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        d.assign = function(l) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var _ = v.shift();
            if (_) {
              if (typeof _ != "object") throw new TypeError(_ + "must be non-object");
              for (var m in _) _.hasOwnProperty(m) && (l[m] = _[m]);
            }
          }
          return l;
        }, d.shrinkBuf = function(l, v) {
          return l.length === v ? l : l.subarray ? l.subarray(0, v) : (l.length = v, l);
        };
        var s = { arraySet: function(l, v, _, m, y) {
          if (v.subarray && l.subarray) l.set(v.subarray(_, _ + m), y);
          else for (var o = 0; o < m; o++) l[y + o] = v[_ + o];
        }, flattenChunks: function(l) {
          var v, _, m, y, o, p;
          for (v = m = 0, _ = l.length; v < _; v++) m += l[v].length;
          for (p = new Uint8Array(m), v = y = 0, _ = l.length; v < _; v++) o = l[v], p.set(o, y), y += o.length;
          return p;
        } }, i = { arraySet: function(l, v, _, m, y) {
          for (var o = 0; o < m; o++) l[y + o] = v[_ + o];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        d.setTyped = function(l) {
          l ? (d.Buf8 = Uint8Array, d.Buf16 = Uint16Array, d.Buf32 = Int32Array, d.assign(d, s)) : (d.Buf8 = Array, d.Buf16 = Array, d.Buf32 = Array, d.assign(d, i));
        }, d.setTyped(a);
      }, {}], 42: [function(e, b, d) {
        var a = e("./common"), s = !0, i = !0;
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
        for (var l = new a.Buf8(256), v = 0; v < 256; v++) l[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function _(m, y) {
          if (y < 65537 && (m.subarray && i || !m.subarray && s)) return String.fromCharCode.apply(null, a.shrinkBuf(m, y));
          for (var o = "", p = 0; p < y; p++) o += String.fromCharCode(m[p]);
          return o;
        }
        l[254] = l[254] = 1, d.string2buf = function(m) {
          var y, o, p, n, f, u = m.length, w = 0;
          for (n = 0; n < u; n++) (64512 & (o = m.charCodeAt(n))) == 55296 && n + 1 < u && (64512 & (p = m.charCodeAt(n + 1))) == 56320 && (o = 65536 + (o - 55296 << 10) + (p - 56320), n++), w += o < 128 ? 1 : o < 2048 ? 2 : o < 65536 ? 3 : 4;
          for (y = new a.Buf8(w), n = f = 0; f < w; n++) (64512 & (o = m.charCodeAt(n))) == 55296 && n + 1 < u && (64512 & (p = m.charCodeAt(n + 1))) == 56320 && (o = 65536 + (o - 55296 << 10) + (p - 56320), n++), o < 128 ? y[f++] = o : (o < 2048 ? y[f++] = 192 | o >>> 6 : (o < 65536 ? y[f++] = 224 | o >>> 12 : (y[f++] = 240 | o >>> 18, y[f++] = 128 | o >>> 12 & 63), y[f++] = 128 | o >>> 6 & 63), y[f++] = 128 | 63 & o);
          return y;
        }, d.buf2binstring = function(m) {
          return _(m, m.length);
        }, d.binstring2buf = function(m) {
          for (var y = new a.Buf8(m.length), o = 0, p = y.length; o < p; o++) y[o] = m.charCodeAt(o);
          return y;
        }, d.buf2string = function(m, y) {
          var o, p, n, f, u = y || m.length, w = new Array(2 * u);
          for (o = p = 0; o < u; ) if ((n = m[o++]) < 128) w[p++] = n;
          else if (4 < (f = l[n])) w[p++] = 65533, o += f - 1;
          else {
            for (n &= f === 2 ? 31 : f === 3 ? 15 : 7; 1 < f && o < u; ) n = n << 6 | 63 & m[o++], f--;
            1 < f ? w[p++] = 65533 : n < 65536 ? w[p++] = n : (n -= 65536, w[p++] = 55296 | n >> 10 & 1023, w[p++] = 56320 | 1023 & n);
          }
          return _(w, p);
        }, d.utf8border = function(m, y) {
          var o;
          for ((y = y || m.length) > m.length && (y = m.length), o = y - 1; 0 <= o && (192 & m[o]) == 128; ) o--;
          return o < 0 || o === 0 ? y : o + l[m[o]] > y ? o : y;
        };
      }, { "./common": 41 }], 43: [function(e, b, d) {
        b.exports = function(a, s, i, l) {
          for (var v = 65535 & a | 0, _ = a >>> 16 & 65535 | 0, m = 0; i !== 0; ) {
            for (i -= m = 2e3 < i ? 2e3 : i; _ = _ + (v = v + s[l++] | 0) | 0, --m; ) ;
            v %= 65521, _ %= 65521;
          }
          return v | _ << 16 | 0;
        };
      }, {}], 44: [function(e, b, d) {
        b.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, b, d) {
        var a = (function() {
          for (var s, i = [], l = 0; l < 256; l++) {
            s = l;
            for (var v = 0; v < 8; v++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            i[l] = s;
          }
          return i;
        })();
        b.exports = function(s, i, l, v) {
          var _ = a, m = v + l;
          s ^= -1;
          for (var y = v; y < m; y++) s = s >>> 8 ^ _[255 & (s ^ i[y])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, b, d) {
        var a, s = e("../utils/common"), i = e("./trees"), l = e("./adler32"), v = e("./crc32"), _ = e("./messages"), m = 0, y = 4, o = 0, p = -2, n = -1, f = 4, u = 2, w = 8, E = 9, S = 286, A = 30, T = 19, F = 2 * S + 1, P = 15, C = 3, U = 258, q = U + C + 1, x = 42, D = 113, r = 1, N = 2, tt = 3, j = 4;
        function et(t, M) {
          return t.msg = _[M], M;
        }
        function $(t) {
          return (t << 1) - (4 < t ? 9 : 0);
        }
        function J(t) {
          for (var M = t.length; 0 <= --M; ) t[M] = 0;
        }
        function O(t) {
          var M = t.state, B = M.pending;
          B > t.avail_out && (B = t.avail_out), B !== 0 && (s.arraySet(t.output, M.pending_buf, M.pending_out, B, t.next_out), t.next_out += B, M.pending_out += B, t.total_out += B, t.avail_out -= B, M.pending -= B, M.pending === 0 && (M.pending_out = 0));
        }
        function I(t, M) {
          i._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, M), t.block_start = t.strstart, O(t.strm);
        }
        function K(t, M) {
          t.pending_buf[t.pending++] = M;
        }
        function H(t, M) {
          t.pending_buf[t.pending++] = M >>> 8 & 255, t.pending_buf[t.pending++] = 255 & M;
        }
        function Z(t, M) {
          var B, g, h = t.max_chain_length, z = t.strstart, L = t.prev_length, W = t.nice_match, R = t.strstart > t.w_size - q ? t.strstart - (t.w_size - q) : 0, X = t.window, V = t.w_mask, Y = t.prev, Q = t.strstart + U, lt = X[z + L - 1], st = X[z + L];
          t.prev_length >= t.good_match && (h >>= 2), W > t.lookahead && (W = t.lookahead);
          do
            if (X[(B = M) + L] === st && X[B + L - 1] === lt && X[B] === X[z] && X[++B] === X[z + 1]) {
              z += 2, B++;
              do
                ;
              while (X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && X[++z] === X[++B] && z < Q);
              if (g = U - (Q - z), z = Q - U, L < g) {
                if (t.match_start = M, W <= (L = g)) break;
                lt = X[z + L - 1], st = X[z + L];
              }
            }
          while ((M = Y[M & V]) > R && --h != 0);
          return L <= t.lookahead ? L : t.lookahead;
        }
        function ut(t) {
          var M, B, g, h, z, L, W, R, X, V, Y = t.w_size;
          do {
            if (h = t.window_size - t.lookahead - t.strstart, t.strstart >= Y + (Y - q)) {
              for (s.arraySet(t.window, t.window, Y, Y, 0), t.match_start -= Y, t.strstart -= Y, t.block_start -= Y, M = B = t.hash_size; g = t.head[--M], t.head[M] = Y <= g ? g - Y : 0, --B; ) ;
              for (M = B = Y; g = t.prev[--M], t.prev[M] = Y <= g ? g - Y : 0, --B; ) ;
              h += Y;
            }
            if (t.strm.avail_in === 0) break;
            if (L = t.strm, W = t.window, R = t.strstart + t.lookahead, X = h, V = void 0, V = L.avail_in, X < V && (V = X), B = V === 0 ? 0 : (L.avail_in -= V, s.arraySet(W, L.input, L.next_in, V, R), L.state.wrap === 1 ? L.adler = l(L.adler, W, V, R) : L.state.wrap === 2 && (L.adler = v(L.adler, W, V, R)), L.next_in += V, L.total_in += V, V), t.lookahead += B, t.lookahead + t.insert >= C) for (z = t.strstart - t.insert, t.ins_h = t.window[z], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[z + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[z + C - 1]) & t.hash_mask, t.prev[z & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = z, z++, t.insert--, !(t.lookahead + t.insert < C)); ) ;
          } while (t.lookahead < q && t.strm.avail_in !== 0);
        }
        function ht(t, M) {
          for (var B, g; ; ) {
            if (t.lookahead < q) {
              if (ut(t), t.lookahead < q && M === m) return r;
              if (t.lookahead === 0) break;
            }
            if (B = 0, t.lookahead >= C && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + C - 1]) & t.hash_mask, B = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), B !== 0 && t.strstart - B <= t.w_size - q && (t.match_length = Z(t, B)), t.match_length >= C) if (g = i._tr_tally(t, t.strstart - t.match_start, t.match_length - C), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= C) {
              for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + C - 1]) & t.hash_mask, B = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, --t.match_length != 0; ) ;
              t.strstart++;
            } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
            else g = i._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
            if (g && (I(t, !1), t.strm.avail_out === 0)) return r;
          }
          return t.insert = t.strstart < C - 1 ? t.strstart : C - 1, M === y ? (I(t, !0), t.strm.avail_out === 0 ? tt : j) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? r : N;
        }
        function rt(t, M) {
          for (var B, g, h; ; ) {
            if (t.lookahead < q) {
              if (ut(t), t.lookahead < q && M === m) return r;
              if (t.lookahead === 0) break;
            }
            if (B = 0, t.lookahead >= C && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + C - 1]) & t.hash_mask, B = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = C - 1, B !== 0 && t.prev_length < t.max_lazy_match && t.strstart - B <= t.w_size - q && (t.match_length = Z(t, B), t.match_length <= 5 && (t.strategy === 1 || t.match_length === C && 4096 < t.strstart - t.match_start) && (t.match_length = C - 1)), t.prev_length >= C && t.match_length <= t.prev_length) {
              for (h = t.strstart + t.lookahead - C, g = i._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - C), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= h && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + C - 1]) & t.hash_mask, B = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), --t.prev_length != 0; ) ;
              if (t.match_available = 0, t.match_length = C - 1, t.strstart++, g && (I(t, !1), t.strm.avail_out === 0)) return r;
            } else if (t.match_available) {
              if ((g = i._tr_tally(t, 0, t.window[t.strstart - 1])) && I(t, !1), t.strstart++, t.lookahead--, t.strm.avail_out === 0) return r;
            } else t.match_available = 1, t.strstart++, t.lookahead--;
          }
          return t.match_available && (g = i._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < C - 1 ? t.strstart : C - 1, M === y ? (I(t, !0), t.strm.avail_out === 0 ? tt : j) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? r : N;
        }
        function nt(t, M, B, g, h) {
          this.good_length = t, this.max_lazy = M, this.nice_length = B, this.max_chain = g, this.func = h;
        }
        function ot() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = w, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * F), this.dyn_dtree = new s.Buf16(2 * (2 * A + 1)), this.bl_tree = new s.Buf16(2 * (2 * T + 1)), J(this.dyn_ltree), J(this.dyn_dtree), J(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(P + 1), this.heap = new s.Buf16(2 * S + 1), J(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * S + 1), J(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function at(t) {
          var M;
          return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = u, (M = t.state).pending = 0, M.pending_out = 0, M.wrap < 0 && (M.wrap = -M.wrap), M.status = M.wrap ? x : D, t.adler = M.wrap === 2 ? 0 : 1, M.last_flush = m, i._tr_init(M), o) : et(t, p);
        }
        function it(t) {
          var M = at(t);
          return M === o && (function(B) {
            B.window_size = 2 * B.w_size, J(B.head), B.max_lazy_match = a[B.level].max_lazy, B.good_match = a[B.level].good_length, B.nice_match = a[B.level].nice_length, B.max_chain_length = a[B.level].max_chain, B.strstart = 0, B.block_start = 0, B.lookahead = 0, B.insert = 0, B.match_length = B.prev_length = C - 1, B.match_available = 0, B.ins_h = 0;
          })(t.state), M;
        }
        function G(t, M, B, g, h, z) {
          if (!t) return p;
          var L = 1;
          if (M === n && (M = 6), g < 0 ? (L = 0, g = -g) : 15 < g && (L = 2, g -= 16), h < 1 || E < h || B !== w || g < 8 || 15 < g || M < 0 || 9 < M || z < 0 || f < z) return et(t, p);
          g === 8 && (g = 9);
          var W = new ot();
          return (t.state = W).strm = t, W.wrap = L, W.gzhead = null, W.w_bits = g, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = h + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + C - 1) / C), W.window = new s.Buf8(2 * W.w_size), W.head = new s.Buf16(W.hash_size), W.prev = new s.Buf16(W.w_size), W.lit_bufsize = 1 << h + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new s.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = M, W.strategy = z, W.method = B, it(t);
        }
        a = [new nt(0, 0, 0, 0, function(t, M) {
          var B = 65535;
          for (B > t.pending_buf_size - 5 && (B = t.pending_buf_size - 5); ; ) {
            if (t.lookahead <= 1) {
              if (ut(t), t.lookahead === 0 && M === m) return r;
              if (t.lookahead === 0) break;
            }
            t.strstart += t.lookahead, t.lookahead = 0;
            var g = t.block_start + B;
            if ((t.strstart === 0 || t.strstart >= g) && (t.lookahead = t.strstart - g, t.strstart = g, I(t, !1), t.strm.avail_out === 0) || t.strstart - t.block_start >= t.w_size - q && (I(t, !1), t.strm.avail_out === 0)) return r;
          }
          return t.insert = 0, M === y ? (I(t, !0), t.strm.avail_out === 0 ? tt : j) : (t.strstart > t.block_start && (I(t, !1), t.strm.avail_out), r);
        }), new nt(4, 4, 8, 4, ht), new nt(4, 5, 16, 8, ht), new nt(4, 6, 32, 32, ht), new nt(4, 4, 16, 16, rt), new nt(8, 16, 32, 32, rt), new nt(8, 16, 128, 128, rt), new nt(8, 32, 128, 256, rt), new nt(32, 128, 258, 1024, rt), new nt(32, 258, 258, 4096, rt)], d.deflateInit = function(t, M) {
          return G(t, M, w, 15, 8, 0);
        }, d.deflateInit2 = G, d.deflateReset = it, d.deflateResetKeep = at, d.deflateSetHeader = function(t, M) {
          return t && t.state ? t.state.wrap !== 2 ? p : (t.state.gzhead = M, o) : p;
        }, d.deflate = function(t, M) {
          var B, g, h, z;
          if (!t || !t.state || 5 < M || M < 0) return t ? et(t, p) : p;
          if (g = t.state, !t.output || !t.input && t.avail_in !== 0 || g.status === 666 && M !== y) return et(t, t.avail_out === 0 ? -5 : p);
          if (g.strm = t, B = g.last_flush, g.last_flush = M, g.status === x) if (g.wrap === 2) t.adler = 0, K(g, 31), K(g, 139), K(g, 8), g.gzhead ? (K(g, (g.gzhead.text ? 1 : 0) + (g.gzhead.hcrc ? 2 : 0) + (g.gzhead.extra ? 4 : 0) + (g.gzhead.name ? 8 : 0) + (g.gzhead.comment ? 16 : 0)), K(g, 255 & g.gzhead.time), K(g, g.gzhead.time >> 8 & 255), K(g, g.gzhead.time >> 16 & 255), K(g, g.gzhead.time >> 24 & 255), K(g, g.level === 9 ? 2 : 2 <= g.strategy || g.level < 2 ? 4 : 0), K(g, 255 & g.gzhead.os), g.gzhead.extra && g.gzhead.extra.length && (K(g, 255 & g.gzhead.extra.length), K(g, g.gzhead.extra.length >> 8 & 255)), g.gzhead.hcrc && (t.adler = v(t.adler, g.pending_buf, g.pending, 0)), g.gzindex = 0, g.status = 69) : (K(g, 0), K(g, 0), K(g, 0), K(g, 0), K(g, 0), K(g, g.level === 9 ? 2 : 2 <= g.strategy || g.level < 2 ? 4 : 0), K(g, 3), g.status = D);
          else {
            var L = w + (g.w_bits - 8 << 4) << 8;
            L |= (2 <= g.strategy || g.level < 2 ? 0 : g.level < 6 ? 1 : g.level === 6 ? 2 : 3) << 6, g.strstart !== 0 && (L |= 32), L += 31 - L % 31, g.status = D, H(g, L), g.strstart !== 0 && (H(g, t.adler >>> 16), H(g, 65535 & t.adler)), t.adler = 1;
          }
          if (g.status === 69) if (g.gzhead.extra) {
            for (h = g.pending; g.gzindex < (65535 & g.gzhead.extra.length) && (g.pending !== g.pending_buf_size || (g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), O(t), h = g.pending, g.pending !== g.pending_buf_size)); ) K(g, 255 & g.gzhead.extra[g.gzindex]), g.gzindex++;
            g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), g.gzindex === g.gzhead.extra.length && (g.gzindex = 0, g.status = 73);
          } else g.status = 73;
          if (g.status === 73) if (g.gzhead.name) {
            h = g.pending;
            do {
              if (g.pending === g.pending_buf_size && (g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), O(t), h = g.pending, g.pending === g.pending_buf_size)) {
                z = 1;
                break;
              }
              z = g.gzindex < g.gzhead.name.length ? 255 & g.gzhead.name.charCodeAt(g.gzindex++) : 0, K(g, z);
            } while (z !== 0);
            g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), z === 0 && (g.gzindex = 0, g.status = 91);
          } else g.status = 91;
          if (g.status === 91) if (g.gzhead.comment) {
            h = g.pending;
            do {
              if (g.pending === g.pending_buf_size && (g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), O(t), h = g.pending, g.pending === g.pending_buf_size)) {
                z = 1;
                break;
              }
              z = g.gzindex < g.gzhead.comment.length ? 255 & g.gzhead.comment.charCodeAt(g.gzindex++) : 0, K(g, z);
            } while (z !== 0);
            g.gzhead.hcrc && g.pending > h && (t.adler = v(t.adler, g.pending_buf, g.pending - h, h)), z === 0 && (g.status = 103);
          } else g.status = 103;
          if (g.status === 103 && (g.gzhead.hcrc ? (g.pending + 2 > g.pending_buf_size && O(t), g.pending + 2 <= g.pending_buf_size && (K(g, 255 & t.adler), K(g, t.adler >> 8 & 255), t.adler = 0, g.status = D)) : g.status = D), g.pending !== 0) {
            if (O(t), t.avail_out === 0) return g.last_flush = -1, o;
          } else if (t.avail_in === 0 && $(M) <= $(B) && M !== y) return et(t, -5);
          if (g.status === 666 && t.avail_in !== 0) return et(t, -5);
          if (t.avail_in !== 0 || g.lookahead !== 0 || M !== m && g.status !== 666) {
            var W = g.strategy === 2 ? (function(R, X) {
              for (var V; ; ) {
                if (R.lookahead === 0 && (ut(R), R.lookahead === 0)) {
                  if (X === m) return r;
                  break;
                }
                if (R.match_length = 0, V = i._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++, V && (I(R, !1), R.strm.avail_out === 0)) return r;
              }
              return R.insert = 0, X === y ? (I(R, !0), R.strm.avail_out === 0 ? tt : j) : R.last_lit && (I(R, !1), R.strm.avail_out === 0) ? r : N;
            })(g, M) : g.strategy === 3 ? (function(R, X) {
              for (var V, Y, Q, lt, st = R.window; ; ) {
                if (R.lookahead <= U) {
                  if (ut(R), R.lookahead <= U && X === m) return r;
                  if (R.lookahead === 0) break;
                }
                if (R.match_length = 0, R.lookahead >= C && 0 < R.strstart && (Y = st[Q = R.strstart - 1]) === st[++Q] && Y === st[++Q] && Y === st[++Q]) {
                  lt = R.strstart + U;
                  do
                    ;
                  while (Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Y === st[++Q] && Q < lt);
                  R.match_length = U - (lt - Q), R.match_length > R.lookahead && (R.match_length = R.lookahead);
                }
                if (R.match_length >= C ? (V = i._tr_tally(R, 1, R.match_length - C), R.lookahead -= R.match_length, R.strstart += R.match_length, R.match_length = 0) : (V = i._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++), V && (I(R, !1), R.strm.avail_out === 0)) return r;
              }
              return R.insert = 0, X === y ? (I(R, !0), R.strm.avail_out === 0 ? tt : j) : R.last_lit && (I(R, !1), R.strm.avail_out === 0) ? r : N;
            })(g, M) : a[g.level].func(g, M);
            if (W !== tt && W !== j || (g.status = 666), W === r || W === tt) return t.avail_out === 0 && (g.last_flush = -1), o;
            if (W === N && (M === 1 ? i._tr_align(g) : M !== 5 && (i._tr_stored_block(g, 0, 0, !1), M === 3 && (J(g.head), g.lookahead === 0 && (g.strstart = 0, g.block_start = 0, g.insert = 0))), O(t), t.avail_out === 0)) return g.last_flush = -1, o;
          }
          return M !== y ? o : g.wrap <= 0 ? 1 : (g.wrap === 2 ? (K(g, 255 & t.adler), K(g, t.adler >> 8 & 255), K(g, t.adler >> 16 & 255), K(g, t.adler >> 24 & 255), K(g, 255 & t.total_in), K(g, t.total_in >> 8 & 255), K(g, t.total_in >> 16 & 255), K(g, t.total_in >> 24 & 255)) : (H(g, t.adler >>> 16), H(g, 65535 & t.adler)), O(t), 0 < g.wrap && (g.wrap = -g.wrap), g.pending !== 0 ? o : 1);
        }, d.deflateEnd = function(t) {
          var M;
          return t && t.state ? (M = t.state.status) !== x && M !== 69 && M !== 73 && M !== 91 && M !== 103 && M !== D && M !== 666 ? et(t, p) : (t.state = null, M === D ? et(t, -3) : o) : p;
        }, d.deflateSetDictionary = function(t, M) {
          var B, g, h, z, L, W, R, X, V = M.length;
          if (!t || !t.state || (z = (B = t.state).wrap) === 2 || z === 1 && B.status !== x || B.lookahead) return p;
          for (z === 1 && (t.adler = l(t.adler, M, V, 0)), B.wrap = 0, V >= B.w_size && (z === 0 && (J(B.head), B.strstart = 0, B.block_start = 0, B.insert = 0), X = new s.Buf8(B.w_size), s.arraySet(X, M, V - B.w_size, B.w_size, 0), M = X, V = B.w_size), L = t.avail_in, W = t.next_in, R = t.input, t.avail_in = V, t.next_in = 0, t.input = M, ut(B); B.lookahead >= C; ) {
            for (g = B.strstart, h = B.lookahead - (C - 1); B.ins_h = (B.ins_h << B.hash_shift ^ B.window[g + C - 1]) & B.hash_mask, B.prev[g & B.w_mask] = B.head[B.ins_h], B.head[B.ins_h] = g, g++, --h; ) ;
            B.strstart = g, B.lookahead = C - 1, ut(B);
          }
          return B.strstart += B.lookahead, B.block_start = B.strstart, B.insert = B.lookahead, B.lookahead = 0, B.match_length = B.prev_length = C - 1, B.match_available = 0, t.next_in = W, t.input = R, t.avail_in = L, B.wrap = z, o;
        }, d.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, b, d) {
        b.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, b, d) {
        b.exports = function(a, s) {
          var i, l, v, _, m, y, o, p, n, f, u, w, E, S, A, T, F, P, C, U, q, x, D, r, N;
          i = a.state, l = a.next_in, r = a.input, v = l + (a.avail_in - 5), _ = a.next_out, N = a.output, m = _ - (s - a.avail_out), y = _ + (a.avail_out - 257), o = i.dmax, p = i.wsize, n = i.whave, f = i.wnext, u = i.window, w = i.hold, E = i.bits, S = i.lencode, A = i.distcode, T = (1 << i.lenbits) - 1, F = (1 << i.distbits) - 1;
          t: do {
            E < 15 && (w += r[l++] << E, E += 8, w += r[l++] << E, E += 8), P = S[w & T];
            e: for (; ; ) {
              if (w >>>= C = P >>> 24, E -= C, (C = P >>> 16 & 255) === 0) N[_++] = 65535 & P;
              else {
                if (!(16 & C)) {
                  if ((64 & C) == 0) {
                    P = S[(65535 & P) + (w & (1 << C) - 1)];
                    continue e;
                  }
                  if (32 & C) {
                    i.mode = 12;
                    break t;
                  }
                  a.msg = "invalid literal/length code", i.mode = 30;
                  break t;
                }
                U = 65535 & P, (C &= 15) && (E < C && (w += r[l++] << E, E += 8), U += w & (1 << C) - 1, w >>>= C, E -= C), E < 15 && (w += r[l++] << E, E += 8, w += r[l++] << E, E += 8), P = A[w & F];
                r: for (; ; ) {
                  if (w >>>= C = P >>> 24, E -= C, !(16 & (C = P >>> 16 & 255))) {
                    if ((64 & C) == 0) {
                      P = A[(65535 & P) + (w & (1 << C) - 1)];
                      continue r;
                    }
                    a.msg = "invalid distance code", i.mode = 30;
                    break t;
                  }
                  if (q = 65535 & P, E < (C &= 15) && (w += r[l++] << E, (E += 8) < C && (w += r[l++] << E, E += 8)), o < (q += w & (1 << C) - 1)) {
                    a.msg = "invalid distance too far back", i.mode = 30;
                    break t;
                  }
                  if (w >>>= C, E -= C, (C = _ - m) < q) {
                    if (n < (C = q - C) && i.sane) {
                      a.msg = "invalid distance too far back", i.mode = 30;
                      break t;
                    }
                    if (D = u, (x = 0) === f) {
                      if (x += p - C, C < U) {
                        for (U -= C; N[_++] = u[x++], --C; ) ;
                        x = _ - q, D = N;
                      }
                    } else if (f < C) {
                      if (x += p + f - C, (C -= f) < U) {
                        for (U -= C; N[_++] = u[x++], --C; ) ;
                        if (x = 0, f < U) {
                          for (U -= C = f; N[_++] = u[x++], --C; ) ;
                          x = _ - q, D = N;
                        }
                      }
                    } else if (x += f - C, C < U) {
                      for (U -= C; N[_++] = u[x++], --C; ) ;
                      x = _ - q, D = N;
                    }
                    for (; 2 < U; ) N[_++] = D[x++], N[_++] = D[x++], N[_++] = D[x++], U -= 3;
                    U && (N[_++] = D[x++], 1 < U && (N[_++] = D[x++]));
                  } else {
                    for (x = _ - q; N[_++] = N[x++], N[_++] = N[x++], N[_++] = N[x++], 2 < (U -= 3); ) ;
                    U && (N[_++] = N[x++], 1 < U && (N[_++] = N[x++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < v && _ < y);
          l -= U = E >> 3, w &= (1 << (E -= U << 3)) - 1, a.next_in = l, a.next_out = _, a.avail_in = l < v ? v - l + 5 : 5 - (l - v), a.avail_out = _ < y ? y - _ + 257 : 257 - (_ - y), i.hold = w, i.bits = E;
        };
      }, {}], 49: [function(e, b, d) {
        var a = e("../utils/common"), s = e("./adler32"), i = e("./crc32"), l = e("./inffast"), v = e("./inftrees"), _ = 1, m = 2, y = 0, o = -2, p = 1, n = 852, f = 592;
        function u(x) {
          return (x >>> 24 & 255) + (x >>> 8 & 65280) + ((65280 & x) << 8) + ((255 & x) << 24);
        }
        function w() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new a.Buf16(320), this.work = new a.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function E(x) {
          var D;
          return x && x.state ? (D = x.state, x.total_in = x.total_out = D.total = 0, x.msg = "", D.wrap && (x.adler = 1 & D.wrap), D.mode = p, D.last = 0, D.havedict = 0, D.dmax = 32768, D.head = null, D.hold = 0, D.bits = 0, D.lencode = D.lendyn = new a.Buf32(n), D.distcode = D.distdyn = new a.Buf32(f), D.sane = 1, D.back = -1, y) : o;
        }
        function S(x) {
          var D;
          return x && x.state ? ((D = x.state).wsize = 0, D.whave = 0, D.wnext = 0, E(x)) : o;
        }
        function A(x, D) {
          var r, N;
          return x && x.state ? (N = x.state, D < 0 ? (r = 0, D = -D) : (r = 1 + (D >> 4), D < 48 && (D &= 15)), D && (D < 8 || 15 < D) ? o : (N.window !== null && N.wbits !== D && (N.window = null), N.wrap = r, N.wbits = D, S(x))) : o;
        }
        function T(x, D) {
          var r, N;
          return x ? (N = new w(), (x.state = N).window = null, (r = A(x, D)) !== y && (x.state = null), r) : o;
        }
        var F, P, C = !0;
        function U(x) {
          if (C) {
            var D;
            for (F = new a.Buf32(512), P = new a.Buf32(32), D = 0; D < 144; ) x.lens[D++] = 8;
            for (; D < 256; ) x.lens[D++] = 9;
            for (; D < 280; ) x.lens[D++] = 7;
            for (; D < 288; ) x.lens[D++] = 8;
            for (v(_, x.lens, 0, 288, F, 0, x.work, { bits: 9 }), D = 0; D < 32; ) x.lens[D++] = 5;
            v(m, x.lens, 0, 32, P, 0, x.work, { bits: 5 }), C = !1;
          }
          x.lencode = F, x.lenbits = 9, x.distcode = P, x.distbits = 5;
        }
        function q(x, D, r, N) {
          var tt, j = x.state;
          return j.window === null && (j.wsize = 1 << j.wbits, j.wnext = 0, j.whave = 0, j.window = new a.Buf8(j.wsize)), N >= j.wsize ? (a.arraySet(j.window, D, r - j.wsize, j.wsize, 0), j.wnext = 0, j.whave = j.wsize) : (N < (tt = j.wsize - j.wnext) && (tt = N), a.arraySet(j.window, D, r - N, tt, j.wnext), (N -= tt) ? (a.arraySet(j.window, D, r - N, N, 0), j.wnext = N, j.whave = j.wsize) : (j.wnext += tt, j.wnext === j.wsize && (j.wnext = 0), j.whave < j.wsize && (j.whave += tt))), 0;
        }
        d.inflateReset = S, d.inflateReset2 = A, d.inflateResetKeep = E, d.inflateInit = function(x) {
          return T(x, 15);
        }, d.inflateInit2 = T, d.inflate = function(x, D) {
          var r, N, tt, j, et, $, J, O, I, K, H, Z, ut, ht, rt, nt, ot, at, it, G, t, M, B, g, h = 0, z = new a.Buf8(4), L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!x || !x.state || !x.output || !x.input && x.avail_in !== 0) return o;
          (r = x.state).mode === 12 && (r.mode = 13), et = x.next_out, tt = x.output, J = x.avail_out, j = x.next_in, N = x.input, $ = x.avail_in, O = r.hold, I = r.bits, K = $, H = J, M = y;
          t: for (; ; ) switch (r.mode) {
            case p:
              if (r.wrap === 0) {
                r.mode = 13;
                break;
              }
              for (; I < 16; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if (2 & r.wrap && O === 35615) {
                z[r.check = 0] = 255 & O, z[1] = O >>> 8 & 255, r.check = i(r.check, z, 2, 0), I = O = 0, r.mode = 2;
                break;
              }
              if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & O) << 8) + (O >> 8)) % 31) {
                x.msg = "incorrect header check", r.mode = 30;
                break;
              }
              if ((15 & O) != 8) {
                x.msg = "unknown compression method", r.mode = 30;
                break;
              }
              if (I -= 4, t = 8 + (15 & (O >>>= 4)), r.wbits === 0) r.wbits = t;
              else if (t > r.wbits) {
                x.msg = "invalid window size", r.mode = 30;
                break;
              }
              r.dmax = 1 << t, x.adler = r.check = 1, r.mode = 512 & O ? 10 : 12, I = O = 0;
              break;
            case 2:
              for (; I < 16; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if (r.flags = O, (255 & r.flags) != 8) {
                x.msg = "unknown compression method", r.mode = 30;
                break;
              }
              if (57344 & r.flags) {
                x.msg = "unknown header flags set", r.mode = 30;
                break;
              }
              r.head && (r.head.text = O >> 8 & 1), 512 & r.flags && (z[0] = 255 & O, z[1] = O >>> 8 & 255, r.check = i(r.check, z, 2, 0)), I = O = 0, r.mode = 3;
            case 3:
              for (; I < 32; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              r.head && (r.head.time = O), 512 & r.flags && (z[0] = 255 & O, z[1] = O >>> 8 & 255, z[2] = O >>> 16 & 255, z[3] = O >>> 24 & 255, r.check = i(r.check, z, 4, 0)), I = O = 0, r.mode = 4;
            case 4:
              for (; I < 16; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              r.head && (r.head.xflags = 255 & O, r.head.os = O >> 8), 512 & r.flags && (z[0] = 255 & O, z[1] = O >>> 8 & 255, r.check = i(r.check, z, 2, 0)), I = O = 0, r.mode = 5;
            case 5:
              if (1024 & r.flags) {
                for (; I < 16; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                r.length = O, r.head && (r.head.extra_len = O), 512 & r.flags && (z[0] = 255 & O, z[1] = O >>> 8 & 255, r.check = i(r.check, z, 2, 0)), I = O = 0;
              } else r.head && (r.head.extra = null);
              r.mode = 6;
            case 6:
              if (1024 & r.flags && ($ < (Z = r.length) && (Z = $), Z && (r.head && (t = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), a.arraySet(r.head.extra, N, j, Z, t)), 512 & r.flags && (r.check = i(r.check, N, Z, j)), $ -= Z, j += Z, r.length -= Z), r.length)) break t;
              r.length = 0, r.mode = 7;
            case 7:
              if (2048 & r.flags) {
                if ($ === 0) break t;
                for (Z = 0; t = N[j + Z++], r.head && t && r.length < 65536 && (r.head.name += String.fromCharCode(t)), t && Z < $; ) ;
                if (512 & r.flags && (r.check = i(r.check, N, Z, j)), $ -= Z, j += Z, t) break t;
              } else r.head && (r.head.name = null);
              r.length = 0, r.mode = 8;
            case 8:
              if (4096 & r.flags) {
                if ($ === 0) break t;
                for (Z = 0; t = N[j + Z++], r.head && t && r.length < 65536 && (r.head.comment += String.fromCharCode(t)), t && Z < $; ) ;
                if (512 & r.flags && (r.check = i(r.check, N, Z, j)), $ -= Z, j += Z, t) break t;
              } else r.head && (r.head.comment = null);
              r.mode = 9;
            case 9:
              if (512 & r.flags) {
                for (; I < 16; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                if (O !== (65535 & r.check)) {
                  x.msg = "header crc mismatch", r.mode = 30;
                  break;
                }
                I = O = 0;
              }
              r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), x.adler = r.check = 0, r.mode = 12;
              break;
            case 10:
              for (; I < 32; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              x.adler = r.check = u(O), I = O = 0, r.mode = 11;
            case 11:
              if (r.havedict === 0) return x.next_out = et, x.avail_out = J, x.next_in = j, x.avail_in = $, r.hold = O, r.bits = I, 2;
              x.adler = r.check = 1, r.mode = 12;
            case 12:
              if (D === 5 || D === 6) break t;
            case 13:
              if (r.last) {
                O >>>= 7 & I, I -= 7 & I, r.mode = 27;
                break;
              }
              for (; I < 3; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              switch (r.last = 1 & O, I -= 1, 3 & (O >>>= 1)) {
                case 0:
                  r.mode = 14;
                  break;
                case 1:
                  if (U(r), r.mode = 20, D !== 6) break;
                  O >>>= 2, I -= 2;
                  break t;
                case 2:
                  r.mode = 17;
                  break;
                case 3:
                  x.msg = "invalid block type", r.mode = 30;
              }
              O >>>= 2, I -= 2;
              break;
            case 14:
              for (O >>>= 7 & I, I -= 7 & I; I < 32; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if ((65535 & O) != (O >>> 16 ^ 65535)) {
                x.msg = "invalid stored block lengths", r.mode = 30;
                break;
              }
              if (r.length = 65535 & O, I = O = 0, r.mode = 15, D === 6) break t;
            case 15:
              r.mode = 16;
            case 16:
              if (Z = r.length) {
                if ($ < Z && (Z = $), J < Z && (Z = J), Z === 0) break t;
                a.arraySet(tt, N, j, Z, et), $ -= Z, j += Z, J -= Z, et += Z, r.length -= Z;
                break;
              }
              r.mode = 12;
              break;
            case 17:
              for (; I < 14; ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if (r.nlen = 257 + (31 & O), O >>>= 5, I -= 5, r.ndist = 1 + (31 & O), O >>>= 5, I -= 5, r.ncode = 4 + (15 & O), O >>>= 4, I -= 4, 286 < r.nlen || 30 < r.ndist) {
                x.msg = "too many length or distance symbols", r.mode = 30;
                break;
              }
              r.have = 0, r.mode = 18;
            case 18:
              for (; r.have < r.ncode; ) {
                for (; I < 3; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                r.lens[L[r.have++]] = 7 & O, O >>>= 3, I -= 3;
              }
              for (; r.have < 19; ) r.lens[L[r.have++]] = 0;
              if (r.lencode = r.lendyn, r.lenbits = 7, B = { bits: r.lenbits }, M = v(0, r.lens, 0, 19, r.lencode, 0, r.work, B), r.lenbits = B.bits, M) {
                x.msg = "invalid code lengths set", r.mode = 30;
                break;
              }
              r.have = 0, r.mode = 19;
            case 19:
              for (; r.have < r.nlen + r.ndist; ) {
                for (; nt = (h = r.lencode[O & (1 << r.lenbits) - 1]) >>> 16 & 255, ot = 65535 & h, !((rt = h >>> 24) <= I); ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                if (ot < 16) O >>>= rt, I -= rt, r.lens[r.have++] = ot;
                else {
                  if (ot === 16) {
                    for (g = rt + 2; I < g; ) {
                      if ($ === 0) break t;
                      $--, O += N[j++] << I, I += 8;
                    }
                    if (O >>>= rt, I -= rt, r.have === 0) {
                      x.msg = "invalid bit length repeat", r.mode = 30;
                      break;
                    }
                    t = r.lens[r.have - 1], Z = 3 + (3 & O), O >>>= 2, I -= 2;
                  } else if (ot === 17) {
                    for (g = rt + 3; I < g; ) {
                      if ($ === 0) break t;
                      $--, O += N[j++] << I, I += 8;
                    }
                    I -= rt, t = 0, Z = 3 + (7 & (O >>>= rt)), O >>>= 3, I -= 3;
                  } else {
                    for (g = rt + 7; I < g; ) {
                      if ($ === 0) break t;
                      $--, O += N[j++] << I, I += 8;
                    }
                    I -= rt, t = 0, Z = 11 + (127 & (O >>>= rt)), O >>>= 7, I -= 7;
                  }
                  if (r.have + Z > r.nlen + r.ndist) {
                    x.msg = "invalid bit length repeat", r.mode = 30;
                    break;
                  }
                  for (; Z--; ) r.lens[r.have++] = t;
                }
              }
              if (r.mode === 30) break;
              if (r.lens[256] === 0) {
                x.msg = "invalid code -- missing end-of-block", r.mode = 30;
                break;
              }
              if (r.lenbits = 9, B = { bits: r.lenbits }, M = v(_, r.lens, 0, r.nlen, r.lencode, 0, r.work, B), r.lenbits = B.bits, M) {
                x.msg = "invalid literal/lengths set", r.mode = 30;
                break;
              }
              if (r.distbits = 6, r.distcode = r.distdyn, B = { bits: r.distbits }, M = v(m, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, B), r.distbits = B.bits, M) {
                x.msg = "invalid distances set", r.mode = 30;
                break;
              }
              if (r.mode = 20, D === 6) break t;
            case 20:
              r.mode = 21;
            case 21:
              if (6 <= $ && 258 <= J) {
                x.next_out = et, x.avail_out = J, x.next_in = j, x.avail_in = $, r.hold = O, r.bits = I, l(x, H), et = x.next_out, tt = x.output, J = x.avail_out, j = x.next_in, N = x.input, $ = x.avail_in, O = r.hold, I = r.bits, r.mode === 12 && (r.back = -1);
                break;
              }
              for (r.back = 0; nt = (h = r.lencode[O & (1 << r.lenbits) - 1]) >>> 16 & 255, ot = 65535 & h, !((rt = h >>> 24) <= I); ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if (nt && (240 & nt) == 0) {
                for (at = rt, it = nt, G = ot; nt = (h = r.lencode[G + ((O & (1 << at + it) - 1) >> at)]) >>> 16 & 255, ot = 65535 & h, !(at + (rt = h >>> 24) <= I); ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                O >>>= at, I -= at, r.back += at;
              }
              if (O >>>= rt, I -= rt, r.back += rt, r.length = ot, nt === 0) {
                r.mode = 26;
                break;
              }
              if (32 & nt) {
                r.back = -1, r.mode = 12;
                break;
              }
              if (64 & nt) {
                x.msg = "invalid literal/length code", r.mode = 30;
                break;
              }
              r.extra = 15 & nt, r.mode = 22;
            case 22:
              if (r.extra) {
                for (g = r.extra; I < g; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                r.length += O & (1 << r.extra) - 1, O >>>= r.extra, I -= r.extra, r.back += r.extra;
              }
              r.was = r.length, r.mode = 23;
            case 23:
              for (; nt = (h = r.distcode[O & (1 << r.distbits) - 1]) >>> 16 & 255, ot = 65535 & h, !((rt = h >>> 24) <= I); ) {
                if ($ === 0) break t;
                $--, O += N[j++] << I, I += 8;
              }
              if ((240 & nt) == 0) {
                for (at = rt, it = nt, G = ot; nt = (h = r.distcode[G + ((O & (1 << at + it) - 1) >> at)]) >>> 16 & 255, ot = 65535 & h, !(at + (rt = h >>> 24) <= I); ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                O >>>= at, I -= at, r.back += at;
              }
              if (O >>>= rt, I -= rt, r.back += rt, 64 & nt) {
                x.msg = "invalid distance code", r.mode = 30;
                break;
              }
              r.offset = ot, r.extra = 15 & nt, r.mode = 24;
            case 24:
              if (r.extra) {
                for (g = r.extra; I < g; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                r.offset += O & (1 << r.extra) - 1, O >>>= r.extra, I -= r.extra, r.back += r.extra;
              }
              if (r.offset > r.dmax) {
                x.msg = "invalid distance too far back", r.mode = 30;
                break;
              }
              r.mode = 25;
            case 25:
              if (J === 0) break t;
              if (Z = H - J, r.offset > Z) {
                if ((Z = r.offset - Z) > r.whave && r.sane) {
                  x.msg = "invalid distance too far back", r.mode = 30;
                  break;
                }
                ut = Z > r.wnext ? (Z -= r.wnext, r.wsize - Z) : r.wnext - Z, Z > r.length && (Z = r.length), ht = r.window;
              } else ht = tt, ut = et - r.offset, Z = r.length;
              for (J < Z && (Z = J), J -= Z, r.length -= Z; tt[et++] = ht[ut++], --Z; ) ;
              r.length === 0 && (r.mode = 21);
              break;
            case 26:
              if (J === 0) break t;
              tt[et++] = r.length, J--, r.mode = 21;
              break;
            case 27:
              if (r.wrap) {
                for (; I < 32; ) {
                  if ($ === 0) break t;
                  $--, O |= N[j++] << I, I += 8;
                }
                if (H -= J, x.total_out += H, r.total += H, H && (x.adler = r.check = r.flags ? i(r.check, tt, H, et - H) : s(r.check, tt, H, et - H)), H = J, (r.flags ? O : u(O)) !== r.check) {
                  x.msg = "incorrect data check", r.mode = 30;
                  break;
                }
                I = O = 0;
              }
              r.mode = 28;
            case 28:
              if (r.wrap && r.flags) {
                for (; I < 32; ) {
                  if ($ === 0) break t;
                  $--, O += N[j++] << I, I += 8;
                }
                if (O !== (4294967295 & r.total)) {
                  x.msg = "incorrect length check", r.mode = 30;
                  break;
                }
                I = O = 0;
              }
              r.mode = 29;
            case 29:
              M = 1;
              break t;
            case 30:
              M = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return o;
          }
          return x.next_out = et, x.avail_out = J, x.next_in = j, x.avail_in = $, r.hold = O, r.bits = I, (r.wsize || H !== x.avail_out && r.mode < 30 && (r.mode < 27 || D !== 4)) && q(x, x.output, x.next_out, H - x.avail_out) ? (r.mode = 31, -4) : (K -= x.avail_in, H -= x.avail_out, x.total_in += K, x.total_out += H, r.total += H, r.wrap && H && (x.adler = r.check = r.flags ? i(r.check, tt, H, x.next_out - H) : s(r.check, tt, H, x.next_out - H)), x.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === 12 ? 128 : 0) + (r.mode === 20 || r.mode === 15 ? 256 : 0), (K == 0 && H === 0 || D === 4) && M === y && (M = -5), M);
        }, d.inflateEnd = function(x) {
          if (!x || !x.state) return o;
          var D = x.state;
          return D.window && (D.window = null), x.state = null, y;
        }, d.inflateGetHeader = function(x, D) {
          var r;
          return x && x.state ? (2 & (r = x.state).wrap) == 0 ? o : ((r.head = D).done = !1, y) : o;
        }, d.inflateSetDictionary = function(x, D) {
          var r, N = D.length;
          return x && x.state ? (r = x.state).wrap !== 0 && r.mode !== 11 ? o : r.mode === 11 && s(1, D, N, 0) !== r.check ? -3 : q(x, D, N, N) ? (r.mode = 31, -4) : (r.havedict = 1, y) : o;
        }, d.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, b, d) {
        var a = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], i = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        b.exports = function(_, m, y, o, p, n, f, u) {
          var w, E, S, A, T, F, P, C, U, q = u.bits, x = 0, D = 0, r = 0, N = 0, tt = 0, j = 0, et = 0, $ = 0, J = 0, O = 0, I = null, K = 0, H = new a.Buf16(16), Z = new a.Buf16(16), ut = null, ht = 0;
          for (x = 0; x <= 15; x++) H[x] = 0;
          for (D = 0; D < o; D++) H[m[y + D]]++;
          for (tt = q, N = 15; 1 <= N && H[N] === 0; N--) ;
          if (N < tt && (tt = N), N === 0) return p[n++] = 20971520, p[n++] = 20971520, u.bits = 1, 0;
          for (r = 1; r < N && H[r] === 0; r++) ;
          for (tt < r && (tt = r), x = $ = 1; x <= 15; x++) if ($ <<= 1, ($ -= H[x]) < 0) return -1;
          if (0 < $ && (_ === 0 || N !== 1)) return -1;
          for (Z[1] = 0, x = 1; x < 15; x++) Z[x + 1] = Z[x] + H[x];
          for (D = 0; D < o; D++) m[y + D] !== 0 && (f[Z[m[y + D]]++] = D);
          if (F = _ === 0 ? (I = ut = f, 19) : _ === 1 ? (I = s, K -= 257, ut = i, ht -= 257, 256) : (I = l, ut = v, -1), x = r, T = n, et = D = O = 0, S = -1, A = (J = 1 << (j = tt)) - 1, _ === 1 && 852 < J || _ === 2 && 592 < J) return 1;
          for (; ; ) {
            for (P = x - et, U = f[D] < F ? (C = 0, f[D]) : f[D] > F ? (C = ut[ht + f[D]], I[K + f[D]]) : (C = 96, 0), w = 1 << x - et, r = E = 1 << j; p[T + (O >> et) + (E -= w)] = P << 24 | C << 16 | U | 0, E !== 0; ) ;
            for (w = 1 << x - 1; O & w; ) w >>= 1;
            if (w !== 0 ? (O &= w - 1, O += w) : O = 0, D++, --H[x] == 0) {
              if (x === N) break;
              x = m[y + f[D]];
            }
            if (tt < x && (O & A) !== S) {
              for (et === 0 && (et = tt), T += r, $ = 1 << (j = x - et); j + et < N && !(($ -= H[j + et]) <= 0); ) j++, $ <<= 1;
              if (J += 1 << j, _ === 1 && 852 < J || _ === 2 && 592 < J) return 1;
              p[S = O & A] = tt << 24 | j << 16 | T - n | 0;
            }
          }
          return O !== 0 && (p[T + O] = x - et << 24 | 64 << 16 | 0), u.bits = tt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, b, d) {
        b.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, b, d) {
        var a = e("../utils/common"), s = 0, i = 1;
        function l(h) {
          for (var z = h.length; 0 <= --z; ) h[z] = 0;
        }
        var v = 0, _ = 29, m = 256, y = m + 1 + _, o = 30, p = 19, n = 2 * y + 1, f = 15, u = 16, w = 7, E = 256, S = 16, A = 17, T = 18, F = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], P = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = new Array(2 * (y + 2));
        l(q);
        var x = new Array(2 * o);
        l(x);
        var D = new Array(512);
        l(D);
        var r = new Array(256);
        l(r);
        var N = new Array(_);
        l(N);
        var tt, j, et, $ = new Array(o);
        function J(h, z, L, W, R) {
          this.static_tree = h, this.extra_bits = z, this.extra_base = L, this.elems = W, this.max_length = R, this.has_stree = h && h.length;
        }
        function O(h, z) {
          this.dyn_tree = h, this.max_code = 0, this.stat_desc = z;
        }
        function I(h) {
          return h < 256 ? D[h] : D[256 + (h >>> 7)];
        }
        function K(h, z) {
          h.pending_buf[h.pending++] = 255 & z, h.pending_buf[h.pending++] = z >>> 8 & 255;
        }
        function H(h, z, L) {
          h.bi_valid > u - L ? (h.bi_buf |= z << h.bi_valid & 65535, K(h, h.bi_buf), h.bi_buf = z >> u - h.bi_valid, h.bi_valid += L - u) : (h.bi_buf |= z << h.bi_valid & 65535, h.bi_valid += L);
        }
        function Z(h, z, L) {
          H(h, L[2 * z], L[2 * z + 1]);
        }
        function ut(h, z) {
          for (var L = 0; L |= 1 & h, h >>>= 1, L <<= 1, 0 < --z; ) ;
          return L >>> 1;
        }
        function ht(h, z, L) {
          var W, R, X = new Array(f + 1), V = 0;
          for (W = 1; W <= f; W++) X[W] = V = V + L[W - 1] << 1;
          for (R = 0; R <= z; R++) {
            var Y = h[2 * R + 1];
            Y !== 0 && (h[2 * R] = ut(X[Y]++, Y));
          }
        }
        function rt(h) {
          var z;
          for (z = 0; z < y; z++) h.dyn_ltree[2 * z] = 0;
          for (z = 0; z < o; z++) h.dyn_dtree[2 * z] = 0;
          for (z = 0; z < p; z++) h.bl_tree[2 * z] = 0;
          h.dyn_ltree[2 * E] = 1, h.opt_len = h.static_len = 0, h.last_lit = h.matches = 0;
        }
        function nt(h) {
          8 < h.bi_valid ? K(h, h.bi_buf) : 0 < h.bi_valid && (h.pending_buf[h.pending++] = h.bi_buf), h.bi_buf = 0, h.bi_valid = 0;
        }
        function ot(h, z, L, W) {
          var R = 2 * z, X = 2 * L;
          return h[R] < h[X] || h[R] === h[X] && W[z] <= W[L];
        }
        function at(h, z, L) {
          for (var W = h.heap[L], R = L << 1; R <= h.heap_len && (R < h.heap_len && ot(z, h.heap[R + 1], h.heap[R], h.depth) && R++, !ot(z, W, h.heap[R], h.depth)); ) h.heap[L] = h.heap[R], L = R, R <<= 1;
          h.heap[L] = W;
        }
        function it(h, z, L) {
          var W, R, X, V, Y = 0;
          if (h.last_lit !== 0) for (; W = h.pending_buf[h.d_buf + 2 * Y] << 8 | h.pending_buf[h.d_buf + 2 * Y + 1], R = h.pending_buf[h.l_buf + Y], Y++, W === 0 ? Z(h, R, z) : (Z(h, (X = r[R]) + m + 1, z), (V = F[X]) !== 0 && H(h, R -= N[X], V), Z(h, X = I(--W), L), (V = P[X]) !== 0 && H(h, W -= $[X], V)), Y < h.last_lit; ) ;
          Z(h, E, z);
        }
        function G(h, z) {
          var L, W, R, X = z.dyn_tree, V = z.stat_desc.static_tree, Y = z.stat_desc.has_stree, Q = z.stat_desc.elems, lt = -1;
          for (h.heap_len = 0, h.heap_max = n, L = 0; L < Q; L++) X[2 * L] !== 0 ? (h.heap[++h.heap_len] = lt = L, h.depth[L] = 0) : X[2 * L + 1] = 0;
          for (; h.heap_len < 2; ) X[2 * (R = h.heap[++h.heap_len] = lt < 2 ? ++lt : 0)] = 1, h.depth[R] = 0, h.opt_len--, Y && (h.static_len -= V[2 * R + 1]);
          for (z.max_code = lt, L = h.heap_len >> 1; 1 <= L; L--) at(h, X, L);
          for (R = Q; L = h.heap[1], h.heap[1] = h.heap[h.heap_len--], at(h, X, 1), W = h.heap[1], h.heap[--h.heap_max] = L, h.heap[--h.heap_max] = W, X[2 * R] = X[2 * L] + X[2 * W], h.depth[R] = (h.depth[L] >= h.depth[W] ? h.depth[L] : h.depth[W]) + 1, X[2 * L + 1] = X[2 * W + 1] = R, h.heap[1] = R++, at(h, X, 1), 2 <= h.heap_len; ) ;
          h.heap[--h.heap_max] = h.heap[1], (function(st, ct) {
            var gt, bt, Ct, ft, Ot, Nt, wt = ct.dyn_tree, Wt = ct.max_code, ie = ct.stat_desc.static_tree, se = ct.stat_desc.has_stree, ae = ct.stat_desc.extra_bits, $t = ct.stat_desc.extra_base, Rt = ct.stat_desc.max_length, Mt = 0;
            for (ft = 0; ft <= f; ft++) st.bl_count[ft] = 0;
            for (wt[2 * st.heap[st.heap_max] + 1] = 0, gt = st.heap_max + 1; gt < n; gt++) Rt < (ft = wt[2 * wt[2 * (bt = st.heap[gt]) + 1] + 1] + 1) && (ft = Rt, Mt++), wt[2 * bt + 1] = ft, Wt < bt || (st.bl_count[ft]++, Ot = 0, $t <= bt && (Ot = ae[bt - $t]), Nt = wt[2 * bt], st.opt_len += Nt * (ft + Ot), se && (st.static_len += Nt * (ie[2 * bt + 1] + Ot)));
            if (Mt !== 0) {
              do {
                for (ft = Rt - 1; st.bl_count[ft] === 0; ) ft--;
                st.bl_count[ft]--, st.bl_count[ft + 1] += 2, st.bl_count[Rt]--, Mt -= 2;
              } while (0 < Mt);
              for (ft = Rt; ft !== 0; ft--) for (bt = st.bl_count[ft]; bt !== 0; ) Wt < (Ct = st.heap[--gt]) || (wt[2 * Ct + 1] !== ft && (st.opt_len += (ft - wt[2 * Ct + 1]) * wt[2 * Ct], wt[2 * Ct + 1] = ft), bt--);
            }
          })(h, z), ht(X, lt, h.bl_count);
        }
        function t(h, z, L) {
          var W, R, X = -1, V = z[1], Y = 0, Q = 7, lt = 4;
          for (V === 0 && (Q = 138, lt = 3), z[2 * (L + 1) + 1] = 65535, W = 0; W <= L; W++) R = V, V = z[2 * (W + 1) + 1], ++Y < Q && R === V || (Y < lt ? h.bl_tree[2 * R] += Y : R !== 0 ? (R !== X && h.bl_tree[2 * R]++, h.bl_tree[2 * S]++) : Y <= 10 ? h.bl_tree[2 * A]++ : h.bl_tree[2 * T]++, X = R, lt = (Y = 0) === V ? (Q = 138, 3) : R === V ? (Q = 6, 3) : (Q = 7, 4));
        }
        function M(h, z, L) {
          var W, R, X = -1, V = z[1], Y = 0, Q = 7, lt = 4;
          for (V === 0 && (Q = 138, lt = 3), W = 0; W <= L; W++) if (R = V, V = z[2 * (W + 1) + 1], !(++Y < Q && R === V)) {
            if (Y < lt) for (; Z(h, R, h.bl_tree), --Y != 0; ) ;
            else R !== 0 ? (R !== X && (Z(h, R, h.bl_tree), Y--), Z(h, S, h.bl_tree), H(h, Y - 3, 2)) : Y <= 10 ? (Z(h, A, h.bl_tree), H(h, Y - 3, 3)) : (Z(h, T, h.bl_tree), H(h, Y - 11, 7));
            X = R, lt = (Y = 0) === V ? (Q = 138, 3) : R === V ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        l($);
        var B = !1;
        function g(h, z, L, W) {
          H(h, (v << 1) + (W ? 1 : 0), 3), (function(R, X, V, Y) {
            nt(R), K(R, V), K(R, ~V), a.arraySet(R.pending_buf, R.window, X, V, R.pending), R.pending += V;
          })(h, z, L);
        }
        d._tr_init = function(h) {
          B || ((function() {
            var z, L, W, R, X, V = new Array(f + 1);
            for (R = W = 0; R < _ - 1; R++) for (N[R] = W, z = 0; z < 1 << F[R]; z++) r[W++] = R;
            for (r[W - 1] = R, R = X = 0; R < 16; R++) for ($[R] = X, z = 0; z < 1 << P[R]; z++) D[X++] = R;
            for (X >>= 7; R < o; R++) for ($[R] = X << 7, z = 0; z < 1 << P[R] - 7; z++) D[256 + X++] = R;
            for (L = 0; L <= f; L++) V[L] = 0;
            for (z = 0; z <= 143; ) q[2 * z + 1] = 8, z++, V[8]++;
            for (; z <= 255; ) q[2 * z + 1] = 9, z++, V[9]++;
            for (; z <= 279; ) q[2 * z + 1] = 7, z++, V[7]++;
            for (; z <= 287; ) q[2 * z + 1] = 8, z++, V[8]++;
            for (ht(q, y + 1, V), z = 0; z < o; z++) x[2 * z + 1] = 5, x[2 * z] = ut(z, 5);
            tt = new J(q, F, m + 1, y, f), j = new J(x, P, 0, o, f), et = new J(new Array(0), C, 0, p, w);
          })(), B = !0), h.l_desc = new O(h.dyn_ltree, tt), h.d_desc = new O(h.dyn_dtree, j), h.bl_desc = new O(h.bl_tree, et), h.bi_buf = 0, h.bi_valid = 0, rt(h);
        }, d._tr_stored_block = g, d._tr_flush_block = function(h, z, L, W) {
          var R, X, V = 0;
          0 < h.level ? (h.strm.data_type === 2 && (h.strm.data_type = (function(Y) {
            var Q, lt = 4093624447;
            for (Q = 0; Q <= 31; Q++, lt >>>= 1) if (1 & lt && Y.dyn_ltree[2 * Q] !== 0) return s;
            if (Y.dyn_ltree[18] !== 0 || Y.dyn_ltree[20] !== 0 || Y.dyn_ltree[26] !== 0) return i;
            for (Q = 32; Q < m; Q++) if (Y.dyn_ltree[2 * Q] !== 0) return i;
            return s;
          })(h)), G(h, h.l_desc), G(h, h.d_desc), V = (function(Y) {
            var Q;
            for (t(Y, Y.dyn_ltree, Y.l_desc.max_code), t(Y, Y.dyn_dtree, Y.d_desc.max_code), G(Y, Y.bl_desc), Q = p - 1; 3 <= Q && Y.bl_tree[2 * U[Q] + 1] === 0; Q--) ;
            return Y.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          })(h), R = h.opt_len + 3 + 7 >>> 3, (X = h.static_len + 3 + 7 >>> 3) <= R && (R = X)) : R = X = L + 5, L + 4 <= R && z !== -1 ? g(h, z, L, W) : h.strategy === 4 || X === R ? (H(h, 2 + (W ? 1 : 0), 3), it(h, q, x)) : (H(h, 4 + (W ? 1 : 0), 3), (function(Y, Q, lt, st) {
            var ct;
            for (H(Y, Q - 257, 5), H(Y, lt - 1, 5), H(Y, st - 4, 4), ct = 0; ct < st; ct++) H(Y, Y.bl_tree[2 * U[ct] + 1], 3);
            M(Y, Y.dyn_ltree, Q - 1), M(Y, Y.dyn_dtree, lt - 1);
          })(h, h.l_desc.max_code + 1, h.d_desc.max_code + 1, V + 1), it(h, h.dyn_ltree, h.dyn_dtree)), rt(h), W && nt(h);
        }, d._tr_tally = function(h, z, L) {
          return h.pending_buf[h.d_buf + 2 * h.last_lit] = z >>> 8 & 255, h.pending_buf[h.d_buf + 2 * h.last_lit + 1] = 255 & z, h.pending_buf[h.l_buf + h.last_lit] = 255 & L, h.last_lit++, z === 0 ? h.dyn_ltree[2 * L]++ : (h.matches++, z--, h.dyn_ltree[2 * (r[L] + m + 1)]++, h.dyn_dtree[2 * I(z)]++), h.last_lit === h.lit_bufsize - 1;
        }, d._tr_align = function(h) {
          H(h, 2, 3), Z(h, E, q), (function(z) {
            z.bi_valid === 16 ? (K(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(h);
        };
      }, { "../utils/common": 41 }], 53: [function(e, b, d) {
        b.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, b, d) {
        (function(a) {
          (function(s, i) {
            if (!s.setImmediate) {
              var l, v, _, m, y = 1, o = {}, p = !1, n = s.document, f = Object.getPrototypeOf && Object.getPrototypeOf(s);
              f = f && f.setTimeout ? f : s, l = {}.toString.call(s.process) === "[object process]" ? function(S) {
                process.nextTick(function() {
                  w(S);
                });
              } : (function() {
                if (s.postMessage && !s.importScripts) {
                  var S = !0, A = s.onmessage;
                  return s.onmessage = function() {
                    S = !1;
                  }, s.postMessage("", "*"), s.onmessage = A, S;
                }
              })() ? (m = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", E, !1) : s.attachEvent("onmessage", E), function(S) {
                s.postMessage(m + S, "*");
              }) : s.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(S) {
                w(S.data);
              }, function(S) {
                _.port2.postMessage(S);
              }) : n && "onreadystatechange" in n.createElement("script") ? (v = n.documentElement, function(S) {
                var A = n.createElement("script");
                A.onreadystatechange = function() {
                  w(S), A.onreadystatechange = null, v.removeChild(A), A = null;
                }, v.appendChild(A);
              }) : function(S) {
                setTimeout(w, 0, S);
              }, f.setImmediate = function(S) {
                typeof S != "function" && (S = new Function("" + S));
                for (var A = new Array(arguments.length - 1), T = 0; T < A.length; T++) A[T] = arguments[T + 1];
                var F = { callback: S, args: A };
                return o[y] = F, l(y), y++;
              }, f.clearImmediate = u;
            }
            function u(S) {
              delete o[S];
            }
            function w(S) {
              if (p) setTimeout(w, 0, S);
              else {
                var A = o[S];
                if (A) {
                  p = !0;
                  try {
                    (function(T) {
                      var F = T.callback, P = T.args;
                      switch (P.length) {
                        case 0:
                          F();
                          break;
                        case 1:
                          F(P[0]);
                          break;
                        case 2:
                          F(P[0], P[1]);
                          break;
                        case 3:
                          F(P[0], P[1], P[2]);
                          break;
                        default:
                          F.apply(i, P);
                      }
                    })(A);
                  } finally {
                    u(S), p = !1;
                  }
                }
              }
            }
            function E(S) {
              S.source === s && typeof S.data == "string" && S.data.indexOf(m) === 0 && w(+S.data.slice(m.length));
            }
          })(typeof self > "u" ? a === void 0 ? this : a : self);
        }).call(this, typeof Tt < "u" ? Tt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Lt)), Lt.exports;
}
var ce = le();
const qt = /* @__PURE__ */ oe(ce);
async function ue(k) {
  const c = await he(k), e = await qt.loadAsync(c), b = [];
  return e.forEach((d, a) => {
    if (a.dir)
      return;
    const s = de(d);
    b.push({
      name: s,
      text: () => a.async("text"),
      arrayBuffer: () => a.async("arraybuffer")
    });
  }), b;
}
async function he(k) {
  if (k instanceof ArrayBuffer)
    return k;
  if (k instanceof Blob)
    return await k.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function de(k) {
  let c = k.replace(/\\/g, "/");
  return c.startsWith("./") && (c = c.slice(2)), c.startsWith("/") && (c = c.slice(1)), c;
}
function fe(k) {
  return !!k && typeof k == "object" && !(k instanceof ArrayBuffer) && !(k instanceof Uint8Array);
}
function pe(k) {
  return k instanceof Uint8Array ? k : new Uint8Array(k);
}
function me(k) {
  return k.byteOffset === 0 && k.byteLength === k.buffer.byteLength ? k.buffer : k.slice().buffer;
}
function Et(k, c, e = 0) {
  if (k.length < e + c.length) return !1;
  for (let b = 0; b < c.length; b++)
    if (k[e + b] !== c[b]) return !1;
  return !0;
}
function ge(k) {
  return Et(k, [80, 75, 3, 4]) || Et(k, [80, 75, 5, 6]) || Et(k, [80, 75, 7, 8]) ? "zip" : Et(k, [82, 97, 114, 33, 26, 7, 0]) || Et(k, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : Et(k, [55, 122, 188, 175, 39, 28]) ? "7z" : k.length > 262 && Et(k, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Jt(k) {
  return k.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function Zt(k) {
  const c = [], e = k.map((n) => Jt(n).toLowerCase()), b = (n) => e.some(n), d = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, a = /\.(drl|xln)$/i, s = e.filter((n) => d.test(n)).length, i = e.filter((n) => a.test(n) || n.includes("drill")).length, l = b((n) => n.includes("top") && n.includes("copper") || n.endsWith(".gtl")), v = b((n) => n.includes("bot") || n.includes("bottom") || n.endsWith(".gbl")), _ = b((n) => n.includes("mask") || n.includes("solder") || n.endsWith(".gts") || n.endsWith(".gbs")), m = b((n) => n.includes("silk") || n.includes("legend") || n.endsWith(".gto") || n.endsWith(".gbo")), y = b((n) => n.includes("outline") || n.includes("profile") || n.includes("edge") || n.endsWith(".gko") || n.endsWith(".gm1") || n.endsWith(".gml")), o = e.every(
    (n) => n.endsWith(".pdf") || n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".svg") || n.endsWith(".txt") || n.endsWith(".md")
  );
  let p = 0;
  return k.length === 0 ? (c.push("No files found."), { confidence: 0, reasons: c }) : o ? (c.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: c }) : (s > 0 ? (p += 0.35, c.push(`Found ${s} Gerber-like file(s) by extension.`)) : c.push("No common Gerber extensions detected."), i > 0 && (p += 0.2, c.push(`Found ${i} drill-like file(s).`)), y && (p += 0.15, c.push("Found outline/profile/edge candidate.")), l && v ? (p += 0.2, c.push("Found both top and bottom copper candidates.")) : (l || v) && (p += 0.1, c.push("Found at least one copper candidate.")), _ && (p += 0.05, c.push("Found solder mask candidate.")), m && (p += 0.05, c.push("Found silkscreen/legend candidate.")), p = Math.max(0, Math.min(1, p)), p < 0.6 && s >= 2 && (p = Math.max(p, 0.55), c.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: p, reasons: c });
}
async function _e(k) {
  if (fe(k)) {
    const a = Object.keys(k).map(Jt), { confidence: s, reasons: i } = Zt(a);
    return {
      isGerber: s >= 0.6,
      archiveType: "directory",
      confidence: s,
      reasons: i,
      files: a
    };
  }
  const c = pe(k), e = ge(c);
  if (e === "zip")
    try {
      const a = me(c), i = (await ue(a)).map((_) => _.name), { confidence: l, reasons: v } = Zt(i);
      return {
        isGerber: l >= 0.6,
        archiveType: "zip",
        confidence: l,
        reasons: v,
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
  const b = new TextDecoder("utf-8", { fatal: !1 }).decode(c.slice(0, 4096));
  return b.includes("%FSLAX") || b.includes("%MOIN") || b.includes("%MOMM") || b.includes("G04") || b.includes("%ADD") ? {
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
class pt extends Error {
  constructor(c, e, b) {
    super(e), this.name = "GerberError", this.code = c, this.details = b;
  }
}
function Qt(k) {
  let c = k.replace(/\\/g, "/");
  return c.startsWith("./") && (c = c.slice(2)), c.startsWith("/") && (c = c.slice(1)), c;
}
function ye(k) {
  return k instanceof Uint8Array ? k : new Uint8Array(k);
}
function te(k) {
  try {
    return k.slice().buffer;
  } catch {
    const c = new Uint8Array(k.byteLength);
    return c.set(k), c.buffer;
  }
}
async function be(k) {
  let c;
  try {
    c = await qt.loadAsync(te(k));
  } catch (i) {
    throw new pt(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      i
    );
  }
  const e = {}, b = 1e3, d = 100 * 1024 * 1024, a = Object.entries(c.files).filter(([, i]) => i && !i.dir);
  if (a.length > b)
    throw new pt(
      "PARSE_ERROR",
      `ZIP contains too many files (${a.length} > ${b})`
    );
  let s = 0;
  for (const [i, l] of a)
    try {
      const v = Qt(i), _ = await l.async("arraybuffer");
      if (s += _.byteLength, s > d)
        throw new pt(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${d} bytes)`
        );
      e[v] = new Uint8Array(_);
    } catch (v) {
      console.warn(`Failed to extract file ${i}:`, v);
    }
  if (Object.keys(e).length === 0)
    throw new pt("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function we(k, c) {
  let e;
  try {
    const m = await import("./libarchive-Bt1VdZR0.js");
    e = m.Archive ?? m.default?.Archive;
  } catch (m) {
    throw new pt(
      "PARSE_ERROR",
      "Failed to load libarchive.js",
      m
    );
  }
  if (!e)
    throw new pt("PARSE_ERROR", "libarchive.js did not export Archive");
  if (c?.workerUrl)
    try {
      e.init({ workerUrl: c.workerUrl });
    } catch (m) {
      throw new pt(
        "PARSE_ERROR",
        "Failed to initialize libarchive.js worker",
        m
      );
    }
  let b;
  try {
    const m = new Blob([te(k)], { type: "application/octet-stream" });
    b = await e.open(m);
  } catch (m) {
    throw new pt("NOT_AN_ARCHIVE", "Failed to open RAR archive", m);
  }
  let d;
  try {
    d = await Promise.race([
      b.extractFiles(),
      new Promise(
        (m, y) => setTimeout(() => y(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (m) {
    throw new pt("PARSE_ERROR", "Failed to extract RAR archive", m);
  }
  const a = {};
  let s = 0;
  const i = 1e3, l = 100 * 1024 * 1024;
  let v = 0;
  async function _(m, y) {
    if (s >= i)
      throw new pt(
        "PARSE_ERROR",
        `Archive contains too many files (max ${i})`
      );
    for (const o of Object.keys(m)) {
      const p = m[o], n = y ? `${y}/${o}` : o;
      if (p instanceof File || p instanceof Blob) {
        s++;
        try {
          const f = await p.arrayBuffer();
          if (v += f.byteLength, v > l)
            throw new pt(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${l} bytes)`
            );
          a[Qt(n)] = new Uint8Array(f);
        } catch (f) {
          console.warn(`Failed to extract file ${n}:`, f);
        }
      } else p && typeof p == "object" && await _(p, n);
    }
  }
  try {
    await _(d, "");
  } finally {
    if (b && typeof b.close == "function")
      try {
        await b.close();
      } catch (m) {
        console.warn("Failed to close archive:", m);
      }
  }
  if (Object.keys(a).length === 0)
    throw new pt("PARSE_ERROR", "No files extracted from RAR archive");
  return a;
}
async function ee(k, c) {
  if (!k || k.byteLength === 0)
    throw new pt("NOT_AN_ARCHIVE", "Input is empty");
  const e = ye(k), b = 100 * 1024 * 1024;
  if (e.length > b)
    throw new pt(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${b} bytes)`
    );
  let d;
  try {
    d = await _e(e);
  } catch (a) {
    throw new pt("PARSE_ERROR", "Failed to detect archive type", a);
  }
  if (!d.isGerber)
    throw new pt(
      "NOT_GERBER",
      d.reasons.join("; ") || "Not a Gerber bundle",
      d
    );
  try {
    if (d.archiveType === "zip")
      return { archiveType: "zip", files: await be(e) };
    if (d.archiveType === "rar")
      return { archiveType: "rar", files: await we(e, c) };
    throw new pt(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${d.archiveType}`,
      d
    );
  } catch (a) {
    throw a instanceof pt ? a : new pt(
      "PARSE_ERROR",
      a instanceof Error ? a.message : "Unknown error during extraction",
      { error: a, det: d }
    );
  }
}
function Ut(k) {
  return k.toLowerCase();
}
function xt(k, c) {
  const e = new Set(c.map((d) => d.toLowerCase()));
  return k.filter((d) => {
    const a = Ut(d), s = a.lastIndexOf(".");
    return s < 0 ? !1 : e.has(a.slice(s));
  }).sort((d, a) => d.length - a.length)[0];
}
function dt(k, c) {
  const e = c.map((d) => d.toLowerCase());
  return k.filter((d) => {
    const a = Ut(d);
    return e.every((s) => a.includes(s));
  }).sort((d, a) => d.length - a.length)[0];
}
function ve(k) {
  const c = k.filter((_) => {
    const m = Ut(_);
    return !(m.endsWith("/") || m.includes("__macosx") || m.endsWith(".ds_store"));
  }), e = xt(c, [".gtl"]) || dt(c, ["f_cu"]) || dt(c, ["top", "cu"]) || dt(c, ["top", "copper"]), b = xt(c, [".gbl"]) || dt(c, ["b_cu"]) || dt(c, ["bottom", "cu"]) || dt(c, ["bottom", "copper"]), d = xt(c, [".gts"]) || dt(c, ["f_mask"]) || dt(c, ["top", "mask"]), a = xt(c, [".gbs"]) || dt(c, ["b_mask"]) || dt(c, ["bottom", "mask"]), s = xt(c, [".gto"]) || dt(c, ["f_silks"]) || dt(c, ["f_silk"]) || dt(c, ["top", "silk"]), i = xt(c, [".gbo"]) || dt(c, ["b_silks"]) || dt(c, ["b_silk"]) || dt(c, ["bottom", "silk"]), l = xt(c, [".gko", ".gm1"]) || dt(c, ["edge", "cuts"]) || dt(c, ["outline"]) || dt(c, ["board", "outline"]), v = (
    // Excellon often .drl or .xln or .txt
    xt(c, [".drl", ".xln"]) || // Some CAD exports use .txt for drills but be careful: only if name hints drill
    dt(c, ["drill"]) || dt(c, ["drills"]) || dt(c, ["npth"]) || dt(c, ["pth"])
  );
  return {
    top_copper: e,
    bottom_copper: b,
    top_mask: d,
    bottom_mask: a,
    top_silk: s,
    bottom_silk: i,
    outline: l,
    drills: v
  };
}
const ke = 0.8;
function It(k, c, e) {
  const b = {
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
  }, d = c.split(/\r?\n/);
  for (const a of d) {
    let s = a.trim();
    if (s && !s.startsWith("G04")) {
      if (s.startsWith("%") && s.endsWith("%")) {
        xe(s, b);
        continue;
      }
      s.endsWith("*") && (s = s.slice(0, -1)), Se(s, b);
    }
  }
  if (b.inRegion) {
    if (b.currentPath.length >= 3 && b.regionPaths.push(b.currentPath), b.regionPaths.length > 0) {
      const a = {
        loops: b.regionPaths,
        polarity: b.currentPolarity
      };
      b.regions.push(a), b.ops.push({
        kind: "region",
        polarity: b.currentPolarity,
        loops: b.regionPaths
      });
    }
    b.inRegion = !1, b.regionPaths = [], b.currentPath = [];
  }
  return {
    tracks: b.tracks,
    arcs: b.arcs,
    flashes: b.flashes,
    regions: b.regions,
    ops: b.ops
  };
}
function xe(k, c) {
  let e = k;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const b = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (b) {
      const d = parseInt(b[1], 10), a = parseInt(b[2], 10);
      parseInt(b[4], 10), c.fmtInt = d, c.fmtDec = a;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const b = c.unitScale;
    let d = b;
    if (e.includes("MOMM") ? d = 1 : e.includes("MOIN") && (d = 25.4), d !== b) {
      const a = d / b;
      for (const s of c.apertures.values())
        s.diameterMm !== void 0 && (s.diameterMm *= a), s.widthMm !== void 0 && (s.widthMm *= a), s.heightMm !== void 0 && (s.heightMm *= a);
      c.unitScale = d;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const b = /AD(D?)(\d+)([A-Z]),?([0-9.Xx]*)/.exec(e);
    if (!b) return;
    const d = parseInt(b[2], 10), a = b[3], s = b[4] ?? "";
    let i, l, v;
    if (s) {
      const m = s.split(/[Xx]/), y = m[0] ? parseFloat(m[0]) * c.unitScale : void 0, o = m[1] ? parseFloat(m[1]) * c.unitScale : void 0;
      a === "C" ? i = y : a === "R" || a === "O" ? (l = y, v = o, y !== void 0 && o !== void 0 ? i = Math.min(y, o) : i = y ?? o) : i = y ?? o;
    }
    const _ = {
      code: d,
      shape: a,
      diameterMm: i,
      widthMm: l,
      heightMm: v
    };
    c.apertures.set(d, _);
    return;
  }
  if (e.startsWith("LPD")) {
    c.currentPolarity = "dark";
    return;
  }
  if (e.startsWith("LPC")) {
    c.currentPolarity = "clear";
    return;
  }
}
function Se(k, c) {
  if (k === "G36") {
    c.inRegion = !0, c.regionPaths = [], c.currentPath = [];
    return;
  }
  if (k === "G37") {
    if (c.currentPath.length >= 3 && c.regionPaths.push(c.currentPath), c.inRegion = !1, c.regionPaths.length > 0) {
      const _ = {
        loops: c.regionPaths,
        polarity: c.currentPolarity
      };
      c.regions.push(_), c.ops.push({
        kind: "region",
        polarity: c.currentPolarity,
        loops: c.regionPaths
      });
    }
    c.regionPaths = [], c.currentPath = [];
    return;
  }
  let e = null;
  const b = /D0?(\d{1,3})$/.exec(k);
  if (b && (e = parseInt(b[1], 10), k = k.slice(0, k.length - b[0].length)), e !== null && e >= 10) {
    const _ = c.apertures.get(e);
    _ && (c.currentAperture = _);
    return;
  }
  const d = /X([+\-]?\d+)/.exec(k), a = /Y([+\-]?\d+)/.exec(k);
  let s = c.x, i = c.y;
  if (d && (s = Yt(d[1], c)), a && (i = Yt(a[1], c)), e === null) {
    c.x = s, c.y = i;
    return;
  }
  if (c.inRegion) {
    const _ = c.x, m = c.y;
    e === 1 ? (c.currentPath.length === 0 && c.currentPath.push({ x: _, y: m }), c.currentPath.push({ x: s, y: i })) : e === 2 && (c.currentPath.length >= 3 && c.regionPaths.push(c.currentPath), c.currentPath = []), c.x = s, c.y = i;
    return;
  }
  const l = c.x, v = c.y;
  if (e === 1) {
    if (!c.currentAperture) {
      c.x = s, c.y = i;
      return;
    }
    const _ = c.currentAperture.diameterMm !== void 0 ? c.currentAperture.diameterMm : 0.2;
    c.tracks.push({
      start: { x: l, y: v },
      end: { x: s, y: i },
      width: _,
      polarity: c.currentPolarity
    }), c.ops.push({
      kind: "track",
      polarity: c.currentPolarity,
      start: { x: l, y: v },
      end: { x: s, y: i },
      widthMm: _
    }), c.x = s, c.y = i;
    return;
  }
  if (e === 2) {
    c.x = s, c.y = i;
    return;
  }
  if (e === 3) {
    if (c.currentAperture) {
      const _ = c.currentAperture, m = _.diameterMm !== void 0 ? _.diameterMm : ke, y = {
        position: { x: s, y: i },
        diameterMm: m,
        shape: _.shape,
        polarity: c.currentPolarity
      };
      _.widthMm !== void 0 && (y.widthMm = _.widthMm), _.heightMm !== void 0 && (y.heightMm = _.heightMm), c.flashes.push(y), c.ops.push({
        kind: "flash",
        polarity: c.currentPolarity,
        position: { x: s, y: i },
        diameterMm: m,
        shape: _.shape,
        widthMm: _.widthMm,
        heightMm: _.heightMm
      });
    }
    c.x = s, c.y = i;
    return;
  }
}
function Yt(k, c) {
  const e = k.startsWith("-") ? -1 : 1, b = k.replace(/[+\-]/g, ""), d = parseInt(b, 10);
  if (Number.isNaN(d)) return 0;
  const a = Math.pow(10, c.fmtDec), s = d / a * c.unitScale;
  return e * s;
}
function Ee(k, c) {
  const e = c.split(/\r?\n/), b = /* @__PURE__ */ new Map();
  let d = null;
  const a = [];
  for (const s of e) {
    const i = s.trim();
    if (i && !i.startsWith(";")) {
      if (i.startsWith("T") && i.includes("C")) {
        const l = /^T(\d+)[C]([\d.]+)/i.exec(i);
        if (l) {
          const v = l[1], _ = parseFloat(l[2]);
          Number.isNaN(_) || b.set(v, _);
        }
        continue;
      }
      if (i.startsWith("T") && !i.includes("C")) {
        const l = /^T(\d+)/i.exec(i);
        l && (d = l[1]);
        continue;
      }
      if (i[0] === "X" || i.includes("X")) {
        const l = /X([\-0-9.]+)Y([\-0-9.]+)/i.exec(i);
        if (!l)
          continue;
        const v = l[1], _ = l[2], m = parseFloat(v), y = parseFloat(_);
        if (Number.isNaN(m) || Number.isNaN(y))
          continue;
        const o = d && b.has(d) ? b.get(d) : 0.6;
        a.push({
          x: m,
          y,
          diameter: o,
          plated: !0
          // default, later you can infer from file or layer
        });
        continue;
      }
    }
  }
  return {
    name: k,
    holes: a
  };
}
function Ae(k) {
  return { w: k.maxX - k.minX, h: k.maxY - k.minY };
}
function Bt(k) {
  const { w: c, h: e } = Ae(k);
  return Number.isFinite(c) && Number.isFinite(e) && c > 1 && e > 1 && c < 2e3 && e < 2e3;
}
function At(k, c) {
  if (!Number.isFinite(k) || !Number.isFinite(c) || k <= 0 || c <= 0) return 1;
  const e = k / c;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Ft(k, c) {
  return c === 1 ? k : {
    ...k,
    tracks: k.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * c, y: e.start.y * c },
      end: { x: e.end.x * c, y: e.end.y * c },
      width: (e.width ?? 0) * c
    })),
    flashes: k.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * c, y: e.position.y * c },
      diameterMm: (e.diameterMm ?? 0) * c,
      widthMm: (e.widthMm ?? 0) * c,
      heightMm: (e.heightMm ?? 0) * c
    })),
    regions: k.regions.map((e) => ({
      ...e,
      loops: e.loops.map((b) => b.map((d) => ({ x: d.x * c, y: d.y * c })))
    }))
  };
}
function ze(k, c) {
  return c === 1 ? k : k.map((e) => ({ x: e.x * c, y: e.y * c, diameter: (e.diameter ?? 0) * c }));
}
function Ce(k) {
  return URL.createObjectURL(new Blob([k], { type: "image/svg+xml" }));
}
function _t(k, c, e) {
  k.minX = Math.min(k.minX, c), k.minY = Math.min(k.minY, e), k.maxX = Math.max(k.maxX, c), k.maxY = Math.max(k.maxY, e);
}
function jt() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function St(k) {
  const c = jt();
  for (const e of k.tracks) {
    _t(c, e.start.x, e.start.y), _t(c, e.end.x, e.end.y);
    const b = (e.width ?? 0) / 2;
    _t(c, e.start.x - b, e.start.y - b), _t(c, e.start.x + b, e.start.y + b), _t(c, e.end.x - b, e.end.y - b), _t(c, e.end.x + b, e.end.y + b);
  }
  for (const e of k.flashes) {
    const b = (e.widthMm ?? e.diameterMm) || 0, d = (e.heightMm ?? e.diameterMm) || 0;
    _t(c, e.position.x - b / 2, e.position.y - d / 2), _t(c, e.position.x + b / 2, e.position.y + d / 2);
  }
  for (const e of k.regions)
    for (const b of e.loops) for (const d of b) _t(c, d.x, d.y);
  return c;
}
function Re(k) {
  const c = jt();
  for (const e of k) {
    const b = (e.diameter || 0) / 2;
    _t(c, e.x - b, e.y - b), _t(c, e.x + b, e.y + b);
  }
  return c;
}
function Gt(k, c) {
  return {
    minX: Math.min(k.minX, c.minX),
    minY: Math.min(k.minY, c.minY),
    maxX: Math.max(k.maxX, c.maxX),
    maxY: Math.max(k.maxY, c.maxY)
  };
}
function vt(k) {
  return !Number.isFinite(k.minX) || !Number.isFinite(k.minY) || !Number.isFinite(k.maxX) || !Number.isFinite(k.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (k.maxX - k.minX < 1e-6 && (k.maxX = k.minX + 1), k.maxY - k.minY < 1e-6 && (k.maxY = k.minY + 1), k);
}
const Ie = 1e3;
function yt(k) {
  return k / 25.4 * Ie;
}
function zt(k, c, e) {
  const b = k - e.minX, d = e.maxY - c;
  return { x: b, y: d };
}
function Ht(k, c) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${k}" height="${c}" viewBox="0 0 ${k} ${c}">
  <rect width="${k}" height="${c}" fill="white"/>
</svg>`.trim();
}
function re(k) {
  let c = 1 / 0, e = 1 / 0, b = -1 / 0, d = -1 / 0;
  for (const a of k.loops)
    for (const s of a)
      c = Math.min(c, s.x), e = Math.min(e, s.y), b = Math.max(b, s.x), d = Math.max(d, s.y);
  return { minX: c, minY: e, maxX: b, maxY: d };
}
function Be(k, c) {
  const e = (c.maxX - c.minX) * (c.maxY - c.minY);
  let b = 0, d = 0;
  for (const _ of k.regions) {
    const m = re(_), y = (m.maxX - m.minX) * (m.maxY - m.minY);
    _.polarity === "clear" ? d = Math.max(d, y) : b = Math.max(b, y);
  }
  const a = k.tracks.filter((_) => _.polarity !== "clear").length + k.flashes.filter((_) => _.polarity !== "clear").length + k.regions.filter((_) => _.polarity !== "clear").length, s = k.tracks.filter((_) => _.polarity === "clear").length + k.flashes.filter((_) => _.polarity === "clear").length + k.regions.filter((_) => _.polarity === "clear").length, i = b > e * 0.7, l = s > a * 3, v = d > e * 0.7;
  return i ? !1 : l || v;
}
function Vt(k, c, e, b) {
  const d = c.maxX - c.minX, a = c.maxY - c.minY, s = Math.max(1, Math.round(yt(d))), i = Math.max(1, Math.round(yt(a))), l = yt(1), v = Be(k, c), _ = v ? "white" : "black", m = (S, A) => {
    const T = S - c.minX, F = c.maxY - A;
    return { x: T * l, y: F * l };
  }, y = (S, A) => {
    if (S.kind === "track") {
      const T = m(S.start.x, S.start.y), F = m(S.end.x, S.end.y), P = Number.isFinite(S.widthMm) ? S.widthMm : 0.2, C = Math.max(1, P * l);
      return `<line x1="${T.x.toFixed(2)}" y1="${T.y.toFixed(2)}" x2="${F.x.toFixed(2)}" y2="${F.y.toFixed(2)}" stroke-width="${C.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${A}" stroke="${A}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (S.kind === "flash") {
      const T = m(S.position.x, S.position.y), F = S.widthMm ?? S.diameterMm ?? 0.8, P = S.heightMm ?? S.diameterMm ?? 0.8, C = Math.max(0.01, Number.isFinite(F) ? F : 0.8) * l, U = Math.max(0.01, Number.isFinite(P) ? P : 0.8) * l;
      if (S.shape === "R" || S.shape === "O") {
        const q = T.x - C / 2, x = T.y - U / 2, D = S.shape === "O" ? Math.min(C, U) * 0.35 : 0;
        return `<rect x="${q.toFixed(2)}" y="${x.toFixed(2)}" width="${C.toFixed(2)}" height="${U.toFixed(2)}" rx="${D.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      } else {
        const q = Math.max(1, Math.max(C, U) / 2);
        return `<circle cx="${T.x.toFixed(2)}" cy="${T.y.toFixed(2)}" r="${q.toFixed(2)}" fill="${A}" fill-opacity="1" />`;
      }
    }
    if (S.kind === "region") {
      const T = S.loops.map((F) => {
        if (!F.length) return "";
        const P = m(F[0].x, F[0].y), C = [`M ${P.x.toFixed(2)} ${P.y.toFixed(2)}`];
        for (let U = 1; U < F.length; U++) {
          const q = m(F[U].x, F[U].y);
          C.push(`L ${q.x.toFixed(2)} ${q.y.toFixed(2)}`);
        }
        return C.push("Z"), C.join(" ");
      }).join(" ");
      return T.trim() ? `<path d="${T}" fill-rule="evenodd" fill="${A}" fill-opacity="1" />` : "";
    }
    return "";
  }, o = [];
  o.push(`<rect x="0" y="0" width="${s}" height="${i}" fill="${_}" fill-opacity="1" />`);
  for (const S of k.ops) {
    const A = S.polarity === "clear" ? "black" : "white", T = y(S, A);
    T && o.push(T);
  }
  console.log("[polarity counts]", {
    tracksClear: k.tracks.filter((S) => S.polarity === "clear").length,
    regionsClear: k.regions.filter((S) => S.polarity === "clear").length,
    negativePlane: v
  });
  const p = (c.maxX - c.minX) * (c.maxY - c.minY);
  let n = 0, f = 0;
  for (const S of k.regions) {
    const A = re(S), T = (A.maxX - A.minX) * (A.maxY - A.minY);
    S.polarity === "clear" ? f = Math.max(f, T) : n = Math.max(n, T);
  }
  const u = k.tracks.filter((S) => S.polarity !== "clear").length + k.flashes.filter((S) => S.polarity !== "clear").length + k.regions.filter((S) => S.polarity !== "clear").length, w = k.tracks.filter((S) => S.polarity === "clear").length + k.flashes.filter((S) => S.polarity === "clear").length + k.regions.filter((S) => S.polarity === "clear").length;
  console.log("[plane detect]", {
    darkCount: u,
    clearCount: w,
    largestDarkRegionArea: n,
    largestClearRegionArea: f,
    boardArea: p,
    negative: v
  });
  const E = `ink_${Math.random().toString(16).slice(2)}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${i}" viewBox="0 0 ${s} ${i}">
  <defs>
    <mask id="${E}" maskUnits="userSpaceOnUse" style="mask-type: luminance">
      <rect x="0" y="0" width="${s}" height="${i}" fill="${_}" fill-opacity="1" />
      ${o.join(`
      `)}
    </mask>
  </defs>

  <rect x="0" y="0" width="${s}" height="${i}" fill="${e}" opacity="${b}" mask="url(#${E})" />
</svg>`.trim();
}
function Kt(k, c) {
  const e = c.maxX - c.minX, b = c.maxY - c.minY, d = Math.max(1, Math.round(yt(e))), a = Math.max(1, Math.round(yt(b))), s = Math.max(1e-6, yt(1)), i = "rgba(255,255,255,0.95)", l = "rgba(255,255,255,0.95)", v = k.tracks.map((y) => {
    const o = zt(y.start.x, y.start.y, c), p = zt(y.end.x, y.end.y, c), n = Number.isFinite(y.width) ? y.width : 0.15, f = Math.max(1, n * s);
    return `<line x1="${(o.x * s).toFixed(2)}" y1="${(o.y * s).toFixed(2)}" x2="${(p.x * s).toFixed(2)}" y2="${(p.y * s).toFixed(2)}" stroke="${i}" stroke-width="${f.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), _ = k.flashes.map((y) => {
    const o = zt(y.position.x, y.position.y, c), p = o.x * s, n = o.y * s, f = y.widthMm ?? y.diameterMm ?? 0.6, u = y.heightMm ?? y.diameterMm ?? 0.6;
    if (y.shape === "R" || y.shape === "O") {
      const E = f * s, S = u * s, A = p - E / 2, T = n - S / 2, F = y.shape === "O" ? Math.min(E, S) * 0.35 : 0;
      return `<rect x="${A.toFixed(2)}" y="${T.toFixed(2)}" width="${E.toFixed(2)}" height="${S.toFixed(2)}" rx="${F.toFixed(2)}" fill="${l}" />`;
    }
    const w = (y.diameterMm ?? 0.6) * s / 2;
    return `<circle cx="${p.toFixed(2)}" cy="${n.toFixed(2)}" r="${Math.max(1, w).toFixed(2)}" fill="${l}" />`;
  }), m = k.regions.map((y) => {
    const o = y.loops.map((p) => {
      if (!p.length) return "";
      const n = zt(p[0].x, p[0].y, c), f = [`M ${(n.x * s).toFixed(2)} ${(n.y * s).toFixed(2)}`];
      for (let u = 1; u < p.length; u++) {
        const w = zt(p[u].x, p[u].y, c);
        f.push(`L ${(w.x * s).toFixed(2)} ${(w.y * s).toFixed(2)}`);
      }
      return f.push("Z"), f.join(" ");
    }).join(" ");
    return o.trim() ? `<path d="${o}" fill="${l}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${a}" viewBox="0 0 ${d} ${a}">
  ${v.join(`
  `)}
  ${_.join(`
  `)}
  ${m.join(`
  `)}
</svg>`.trim();
}
function Fe(k, c) {
  const e = c.maxX - c.minX, b = c.maxY - c.minY, d = Math.round(yt(e)), a = Math.round(yt(b)), s = yt(1), i = k.map((l) => {
    const v = zt(l.x, l.y, c), _ = v.x * s, m = v.y * s, y = (l.diameter || 0.6) * s / 2;
    return `<circle cx="${_.toFixed(2)}" cy="${m.toFixed(2)}" r="${Math.max(1, y).toFixed(2)}" fill="none" stroke="#e5e7eb" stroke-width="3" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${a}" viewBox="0 0 ${d} ${a}">
  ${i.join(`
  `)}
</svg>`.trim();
}
async function ne(k) {
  const c = Object.keys(k).filter((it) => !!it), e = ve(c), b = new TextDecoder("utf-8", { fatal: !1 }), d = async (it) => {
    if (!it) return null;
    const G = k[it];
    return G ? b.decode(G) : null;
  }, a = await d(e.top_copper), s = await d(e.bottom_copper), i = await d(e.outline), l = await d(e.drills), v = await d(e.top_silk), _ = await d(e.bottom_silk), m = a ? It(e.top_copper || "top", a) : null, y = s ? It(e.bottom_copper || "bot", s) : null, o = i ? It(e.outline || "outline", i) : null, p = l ? Ee(e.drills || "drills", l) : null, n = p ? p.holes.map((it) => ({ x: it.x, y: it.y, diameter: it.diameter })) : [], f = v ? It(e.top_silk || "top_silk", v) : null, u = _ ? It(e.bottom_silk || "bot_silk", _) : null, w = m ? vt(St(m)) : null, E = y ? vt(St(y)) : null, S = o ? vt(St(o)) : null, A = n.length ? vt(Re(n)) : null, T = f ? vt(St(f)) : null, F = u ? vt(St(u)) : null, P = (S && Bt(S) ? S : null) || (w && Bt(w) ? w : null) || (E && Bt(E) ? E : null) || (A && Bt(A) ? A : null), C = P ? P.maxX - P.minX : 1, U = w ? At(w.maxX - w.minX, C) : 1, q = E ? At(E.maxX - E.minX, C) : 1, x = S ? At(S.maxX - S.minX, C) : 1, D = A ? At(A.maxX - A.minX, C) : 1, r = T ? At(T.maxX - T.minX, C) : 1, N = F ? At(F.maxX - F.minX, C) : 1, tt = m ? Ft(m, U) : null, j = y ? Ft(y, q) : null, et = o ? Ft(o, x) : null, $ = n.length ? ze(n, D) : [], J = f ? Ft(f, r) : null, O = u ? Ft(u, N) : null;
  let I = null;
  if (et) {
    const it = vt(St(et));
    Bt(it) && (I = it);
  }
  if (!I) {
    let it = jt();
    tt && (it = Gt(it, St(tt))), j && (it = Gt(it, St(j))), it = vt(it), I = it;
  }
  const K = vt(I), H = K.maxX - K.minX, Z = K.maxY - K.minY, ut = {
    board: {
      width_in: H / 25.4,
      height_in: Z / 25.4,
      mm_bounds: {
        min_x_mm: K.minX,
        min_y_mm: K.minY,
        max_x_mm: K.maxX,
        max_y_mm: K.maxY
      }
    }
  }, ht = Math.max(1, Math.round(yt(H))), rt = Math.max(1, Math.round(yt(Z))), nt = [], ot = (it) => {
    const G = Ce(it);
    return nt.push(G), G;
  }, at = {
    top_board_mask: ot(Ht(ht, rt)),
    bottom_board_mask: ot(Ht(ht, rt))
  };
  return tt && (at.top_copper = ot(Vt(tt, K, "#fbbf24", 1))), j && (at.bottom_copper = ot(Vt(j, K, "#38bdf8", 1))), $.length && (at.drills = ot(Fe($, K))), J && (at.top_silk = ot(Kt(J, K))), O && (at.bottom_silk = ot(Kt(O, K))), {
    boardGeom: ut,
    layers: at,
    revoke: () => nt.forEach((it) => URL.revokeObjectURL(it))
  };
}
async function Me(k) {
  const c = k instanceof Uint8Array ? k.byteOffset === 0 && k.byteLength === k.buffer.byteLength ? k.buffer : k.slice().buffer : k instanceof ArrayBuffer ? k : await k.arrayBuffer(), { files: e, archiveType: b } = await ee(c, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (b !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${b}`);
  return await ne(e);
}
async function Te(k, c) {
  const { files: e } = await ee(k, {
    workerUrl: c?.archiveWorkerUrl
  });
  return await ne(e);
}
function Oe(k, c, e) {
  return Math.max(c, Math.min(e, k));
}
function Dt(k, c) {
  return !Number.isFinite(k) || !Number.isFinite(c) || c <= 0 ? 0 : (k % c + c) % c;
}
function kt(k, c) {
  c && c.startsWith("blob:") || c && c.length > 0 ? k.setAttribute("src", c) : k.removeAttribute("src");
}
function mt(k, c) {
  const e = k.querySelector(c);
  if (!e) throw new Error(`Missing required element: ${c}`);
  return e;
}
function Pe(k, c = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
  k.innerHTML = `
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
              ${e}
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
  const b = k.firstElementChild, d = mt(b, "#board-viewport"), a = mt(b, "#board-content"), s = mt(b, "#board-stage"), i = mt(b, "#boardClip"), l = mt(b, "#grid-canvas"), v = mt(b, "#grid-toggle"), _ = mt(b, "#grid-units"), m = mt(b, "#fit-btn"), y = mt(b, "#download-btn"), o = Array.from(b.querySelectorAll('input[name="side"]')), p = mt(b, "#img-fr4"), n = mt(b, "#img-top-copper"), f = mt(b, "#img-bottom-copper"), u = mt(b, "#img-top-mask"), w = mt(b, "#img-bottom-mask"), E = mt(b, "#img-top-silk"), S = mt(b, "#img-bottom-silk"), A = mt(b, "#img-drills"), T = mt(b, "#img-vias");
  let F = null, P = {}, C = 1, U = 0, q = 0, x = !1, D = 0, r = 0, N = 0, tt = 0, j = !1, et = !1;
  function $(G) {
    return Oe(G, 0.2, 8);
  }
  function J() {
    j || (j = !0, requestAnimationFrame(() => {
      j = !1, a.style.transform = `translate3d(${U}px, ${q}px, 0) scale(${C})`, v.checked && H();
    }));
  }
  function O(G = 0.08) {
    const t = d.getBoundingClientRect(), M = s.offsetWidth || 1, B = s.offsetHeight || 1, g = Math.max(1, t.width * (1 - 2 * G)), h = Math.max(1, t.height * (1 - 2 * G));
    C = $(Math.min(g / M, h / B)), U = (t.width - C * M) / 2, q = (t.height - C * B) / 2, J();
  }
  function I() {
    let G = 1e3;
    if (F?.board?.width_in) {
      const M = s.getBoundingClientRect().width / C;
      Number.isFinite(M) && M > 0 && (G = M / F.board.width_in);
    }
    return G;
  }
  function K() {
    const G = window.devicePixelRatio || 1, t = d.getBoundingClientRect();
    l.width = Math.max(1, Math.floor(t.width * G)), l.height = Math.max(1, Math.floor(t.height * G)), l.style.width = `${t.width}px`, l.style.height = `${t.height}px`;
  }
  function H() {
    if (!v.checked) {
      l.style.display = "none";
      return;
    }
    l.style.display = "block";
    const G = l.getContext("2d");
    if (!G) return;
    const t = window.devicePixelRatio || 1, M = d.getBoundingClientRect(), B = M.width, g = M.height;
    G.setTransform(t, 0, 0, t, 0, 0), G.clearRect(0, 0, B, g);
    const h = I(), z = h / 25.4, L = _.value, W = L === "mm" ? z * 1 : h * 0.1, R = L === "mm" ? z * 10 : h * 1, X = W * C, V = R * C;
    if (!Number.isFinite(X) || X < 6) return;
    const Y = Dt(U, X), Q = Dt(q, X), lt = Dt(U, V), st = Dt(q, V);
    G.lineWidth = 1, G.strokeStyle = "rgba(17, 24, 39, 0.12)", G.beginPath();
    for (let ct = Y; ct < B; ct += X) {
      const gt = Math.round(ct) + 0.5;
      G.moveTo(gt, 0), G.lineTo(gt, g);
    }
    for (let ct = Q; ct < g; ct += X) {
      const gt = Math.round(ct) + 0.5;
      G.moveTo(0, gt), G.lineTo(B, gt);
    }
    if (G.stroke(), Number.isFinite(V) && V >= 12) {
      G.strokeStyle = "rgba(17, 24, 39, 0.22)", G.beginPath();
      for (let ct = lt; ct < B; ct += V) {
        const gt = Math.round(ct) + 0.5;
        G.moveTo(gt, 0), G.lineTo(gt, g);
      }
      for (let ct = st; ct < g; ct += V) {
        const gt = Math.round(ct) + 0.5;
        G.moveTo(0, gt), G.lineTo(B, gt);
      }
      G.stroke();
    }
  }
  function Z(G, t) {
    const M = b.querySelector(`#${G}`);
    M && (M.style.display = t ? "block" : "none");
  }
  function ut(G) {
    G && i.style.setProperty("--board-mask-url", `url('${G}')`);
  }
  function ht(G) {
    const t = G === "top", M = G === "bottom";
    Z("layer-top-copper", t && !!P.top_copper), Z("layer-top-mask", t && !!P.top_mask), Z("layer-top-silk", t && !!P.top_silk), Z("layer-bottom-copper", M && !!P.bottom_copper), Z("layer-bottom-mask", M && !!P.bottom_mask), Z("layer-bottom-silk", M && !!P.bottom_silk), Z("layer-drills", !!P.drills), Z("layer-vias", !!P.vias);
    const B = G === "bottom" ? P.bottom_board_mask ?? P.top_board_mask : P.top_board_mask ?? P.bottom_board_mask;
    B && ut(B);
  }
  function rt() {
    if (!F?.board) return;
    const G = 1e3, t = Math.round((F.board.width_in || 1) * G), M = Math.round((F.board.height_in || 1) * G);
    s.style.width = `${t}px`, s.style.height = `${M}px`;
  }
  d.addEventListener("wheel", (G) => {
    G.preventDefault(), et = !0;
    const t = d.getBoundingClientRect(), M = G.clientX - t.left, B = G.clientY - t.top, g = C, h = 1.1;
    C = G.deltaY < 0 ? $(C * h) : $(C / h);
    const z = C / g;
    U = M - (M - U) * z, q = B - (B - q) * z, J();
  }, { passive: !1 }), d.addEventListener("mousedown", (G) => {
    G.button === 0 && (G.preventDefault(), et = !0, x = !0, d.classList.add("grabbing"), D = G.clientX, r = G.clientY, N = U, tt = q);
  });
  const nt = (G) => {
    if (!x) return;
    const t = G.clientX - D, M = G.clientY - r;
    U = N + t, q = tt + M, J();
  }, ot = () => {
    x && (x = !1, d.classList.remove("grabbing"));
  };
  window.addEventListener("mousemove", nt), window.addEventListener("mouseup", ot), v.addEventListener("change", () => {
    K(), H();
  }), _.addEventListener("change", H), m.addEventListener("click", () => O(0.08)), y.addEventListener("click", () => {
    c.onDownload?.();
  }), o.forEach((G) => {
    G.addEventListener("change", () => {
      const t = o.find((M) => M.checked)?.value || "top";
      ht(t);
    });
  }), window.addEventListener("resize", () => {
    K(), et ? J() : O(0.08);
  });
  function at(G) {
    F = G.boardGeom, P = G.layers, kt(n, P.top_copper), kt(f, P.bottom_copper), kt(u, P.top_mask), kt(w, P.bottom_mask), kt(E, P.top_silk), kt(S, P.bottom_silk), kt(A, P.drills), kt(T, P.vias), kt(p, P.top_copper ?? P.bottom_copper), rt(), K(), O(0.08);
    const t = o.find((M) => M.checked)?.value || "top";
    ht(t), J();
  }
  function it() {
    window.removeEventListener("mousemove", nt), window.removeEventListener("mouseup", ot), k.innerHTML = "";
  }
  return {
    setData: at,
    setSideMode: (G) => {
      const t = o.find((M) => M.value === G);
      t && (t.checked = !0), ht(G);
    },
    fit: () => O(0.08),
    dispose: it
  };
}
export {
  pt as GerberError,
  Pe as createBoardViewer,
  _e as detectGerberBundle,
  Te as renderGerbers,
  ne as renderGerbersFiles,
  Me as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
