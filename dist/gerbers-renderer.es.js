var ae = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function De(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
function le(h) {
  throw new Error('Could not dynamically require "' + h + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var ue = { exports: {} };
var xe;
function Ue() {
  return xe || (xe = 1, (function(h, t) {
    (function(e) {
      h.exports = e();
    })(function() {
      return (function e(o, i, n) {
        function r(g, b) {
          if (!i[g]) {
            if (!o[g]) {
              var _ = typeof le == "function" && le;
              if (!b && _) return _(g, !0);
              if (a) return a(g, !0);
              var y = new Error("Cannot find module '" + g + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var f = i[g] = { exports: {} };
            o[g][0].call(f.exports, function(p) {
              var s = o[g][1][p];
              return r(s || p);
            }, f, f.exports, e, o, i, n);
          }
          return i[g].exports;
        }
        for (var a = typeof le == "function" && le, u = 0; u < n.length; u++) r(n[u]);
        return r;
      })({ 1: [function(e, o, i) {
        var n = e("./utils"), r = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(u) {
          for (var g, b, _, y, f, p, s, m = [], d = 0, v = u.length, k = v, I = n.getTypeOf(u) !== "string"; d < u.length; ) k = v - d, _ = I ? (g = u[d++], b = d < v ? u[d++] : 0, d < v ? u[d++] : 0) : (g = u.charCodeAt(d++), b = d < v ? u.charCodeAt(d++) : 0, d < v ? u.charCodeAt(d++) : 0), y = g >> 2, f = (3 & g) << 4 | b >> 4, p = 1 < k ? (15 & b) << 2 | _ >> 6 : 64, s = 2 < k ? 63 & _ : 64, m.push(a.charAt(y) + a.charAt(f) + a.charAt(p) + a.charAt(s));
          return m.join("");
        }, i.decode = function(u) {
          var g, b, _, y, f, p, s = 0, m = 0, d = "data:";
          if (u.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var v, k = 3 * (u = u.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (u.charAt(u.length - 1) === a.charAt(64) && k--, u.charAt(u.length - 2) === a.charAt(64) && k--, k % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (v = r.uint8array ? new Uint8Array(0 | k) : new Array(0 | k); s < u.length; ) g = a.indexOf(u.charAt(s++)) << 2 | (y = a.indexOf(u.charAt(s++))) >> 4, b = (15 & y) << 4 | (f = a.indexOf(u.charAt(s++))) >> 2, _ = (3 & f) << 6 | (p = a.indexOf(u.charAt(s++))), v[m++] = g, f !== 64 && (v[m++] = b), p !== 64 && (v[m++] = _);
          return v;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, o, i) {
        var n = e("./external"), r = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), u = e("./stream/DataLengthProbe");
        function g(b, _, y, f, p) {
          this.compressedSize = b, this.uncompressedSize = _, this.crc32 = y, this.compression = f, this.compressedContent = p;
        }
        g.prototype = { getContentWorker: function() {
          var b = new r(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new u("data_length")), _ = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new r(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(b, _, y) {
          return b.pipe(new a()).pipe(new u("uncompressedSize")).pipe(_.compressWorker(y)).pipe(new u("compressedSize")).withStreamInfo("compression", _);
        }, o.exports = g;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, o, i) {
        var n = e("./stream/GenericWorker");
        i.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, i.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, o, i) {
        var n = e("./utils"), r = (function() {
          for (var a, u = [], g = 0; g < 256; g++) {
            a = g;
            for (var b = 0; b < 8; b++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            u[g] = a;
          }
          return u;
        })();
        o.exports = function(a, u) {
          return a !== void 0 && a.length ? n.getTypeOf(a) !== "string" ? (function(g, b, _, y) {
            var f = r, p = y + _;
            g ^= -1;
            for (var s = y; s < p; s++) g = g >>> 8 ^ f[255 & (g ^ b[s])];
            return -1 ^ g;
          })(0 | u, a, a.length, 0) : (function(g, b, _, y) {
            var f = r, p = y + _;
            g ^= -1;
            for (var s = y; s < p; s++) g = g >>> 8 ^ f[255 & (g ^ b.charCodeAt(s))];
            return -1 ^ g;
          })(0 | u, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, o, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(e, o, i) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), o.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, o, i) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", r = e("pako"), a = e("./utils"), u = e("./stream/GenericWorker"), g = n ? "uint8array" : "array";
        function b(_, y) {
          u.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = y, this.meta = {};
        }
        i.magic = "\b\0", a.inherits(b, u), b.prototype.processChunk = function(_) {
          this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(g, _.data), !1);
        }, b.prototype.flush = function() {
          u.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          u.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new r[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var _ = this;
          this._pako.onData = function(y) {
            _.push({ data: y, meta: _.meta });
          };
        }, i.compressWorker = function(_) {
          return new b("Deflate", _);
        }, i.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, o, i) {
        function n(f, p) {
          var s, m = "";
          for (s = 0; s < p; s++) m += String.fromCharCode(255 & f), f >>>= 8;
          return m;
        }
        function r(f, p, s, m, d, v) {
          var k, I, R = f.file, B = f.compression, O = v !== g.utf8encode, U = a.transformTo("string", v(R.name)), E = a.transformTo("string", g.utf8encode(R.name)), $ = R.comment, V = a.transformTo("string", v($)), S = a.transformTo("string", g.utf8encode($)), L = E.length !== R.name.length, c = S.length !== $.length, N = "", lt = "", X = "", et = R.dir, Y = R.date, ot = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          p && !s || (ot.crc32 = f.crc32, ot.compressedSize = f.compressedSize, ot.uncompressedSize = f.uncompressedSize);
          var P = 0;
          p && (P |= 8), O || !L && !c || (P |= 2048);
          var T = 0, at = 0;
          et && (T |= 16), d === "UNIX" ? (at = 798, T |= (function(H, ft) {
            var kt = H;
            return H || (kt = ft ? 16893 : 33204), (65535 & kt) << 16;
          })(R.unixPermissions, et)) : (at = 20, T |= (function(H) {
            return 63 & (H || 0);
          })(R.dosPermissions)), k = Y.getUTCHours(), k <<= 6, k |= Y.getUTCMinutes(), k <<= 5, k |= Y.getUTCSeconds() / 2, I = Y.getUTCFullYear() - 1980, I <<= 4, I |= Y.getUTCMonth() + 1, I <<= 5, I |= Y.getUTCDate(), L && (lt = n(1, 1) + n(b(U), 4) + E, N += "up" + n(lt.length, 2) + lt), c && (X = n(1, 1) + n(b(V), 4) + S, N += "uc" + n(X.length, 2) + X);
          var J = "";
          return J += `
\0`, J += n(P, 2), J += B.magic, J += n(k, 2), J += n(I, 2), J += n(ot.crc32, 4), J += n(ot.compressedSize, 4), J += n(ot.uncompressedSize, 4), J += n(U.length, 2), J += n(N.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + J + U + N, dirRecord: _.CENTRAL_FILE_HEADER + n(at, 2) + J + n(V.length, 2) + "\0\0\0\0" + n(T, 4) + n(m, 4) + U + N + V };
        }
        var a = e("../utils"), u = e("../stream/GenericWorker"), g = e("../utf8"), b = e("../crc32"), _ = e("../signature");
        function y(f, p, s, m) {
          u.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = p, this.zipPlatform = s, this.encodeFileName = m, this.streamFiles = f, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(y, u), y.prototype.push = function(f) {
          var p = f.meta.percent || 0, s = this.entriesCount, m = this._sources.length;
          this.accumulate ? this.contentBuffer.push(f) : (this.bytesWritten += f.data.length, u.prototype.push.call(this, { data: f.data, meta: { currentFile: this.currentFile, percent: s ? (p + 100 * (s - m - 1)) / s : 100 } }));
        }, y.prototype.openedSource = function(f) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = f.file.name;
          var p = this.streamFiles && !f.file.dir;
          if (p) {
            var s = r(f, p, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: s.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(f) {
          this.accumulate = !1;
          var p = this.streamFiles && !f.file.dir, s = r(f, p, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(s.dirRecord), p) this.push({ data: (function(m) {
            return _.DATA_DESCRIPTOR + n(m.crc32, 4) + n(m.compressedSize, 4) + n(m.uncompressedSize, 4);
          })(f), meta: { percent: 100 } });
          else for (this.push({ data: s.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var f = this.bytesWritten, p = 0; p < this.dirRecords.length; p++) this.push({ data: this.dirRecords[p], meta: { percent: 100 } });
          var s = this.bytesWritten - f, m = (function(d, v, k, I, R) {
            var B = a.transformTo("string", R(I));
            return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(d, 2) + n(d, 2) + n(v, 4) + n(k, 4) + n(B.length, 2) + B;
          })(this.dirRecords.length, s, f, this.zipComment, this.encodeFileName);
          this.push({ data: m, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(f) {
          this._sources.push(f);
          var p = this;
          return f.on("data", function(s) {
            p.processChunk(s);
          }), f.on("end", function() {
            p.closedSource(p.previous.streamInfo), p._sources.length ? p.prepareNextSource() : p.end();
          }), f.on("error", function(s) {
            p.error(s);
          }), this;
        }, y.prototype.resume = function() {
          return !!u.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(f) {
          var p = this._sources;
          if (!u.prototype.error.call(this, f)) return !1;
          for (var s = 0; s < p.length; s++) try {
            p[s].error(f);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          u.prototype.lock.call(this);
          for (var f = this._sources, p = 0; p < f.length; p++) f[p].lock();
        }, o.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, o, i) {
        var n = e("../compressions"), r = e("./ZipFileWorker");
        i.generateWorker = function(a, u, g) {
          var b = new r(u.streamFiles, g, u.platform, u.encodeFileName), _ = 0;
          try {
            a.forEach(function(y, f) {
              _++;
              var p = (function(v, k) {
                var I = v || k, R = n[I];
                if (!R) throw new Error(I + " is not a valid compression method !");
                return R;
              })(f.options.compression, u.compression), s = f.options.compressionOptions || u.compressionOptions || {}, m = f.dir, d = f.date;
              f._compressWorker(p, s).withStreamInfo("file", { name: y, dir: m, date: d, comment: f.comment || "", unixPermissions: f.unixPermissions, dosPermissions: f.dosPermissions }).pipe(b);
            }), b.entriesCount = _;
          } catch (y) {
            b.error(y);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, o, i) {
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
        }, n.external = e("./external"), o.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, o, i) {
        var n = e("./utils"), r = e("./external"), a = e("./utf8"), u = e("./zipEntries"), g = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function _(y) {
          return new r.Promise(function(f, p) {
            var s = y.decompressed.getContentWorker().pipe(new g());
            s.on("error", function(m) {
              p(m);
            }).on("end", function() {
              s.streamInfo.crc32 !== y.decompressed.crc32 ? p(new Error("Corrupted zip : CRC32 mismatch")) : f();
            }).resume();
          });
        }
        o.exports = function(y, f) {
          var p = this;
          return f = n.extend(f || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), b.isNode && b.isStream(y) ? r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", y, !0, f.optimizedBinaryString, f.base64).then(function(s) {
            var m = new u(f);
            return m.load(s), m;
          }).then(function(s) {
            var m = [r.Promise.resolve(s)], d = s.files;
            if (f.checkCRC32) for (var v = 0; v < d.length; v++) m.push(_(d[v]));
            return r.Promise.all(m);
          }).then(function(s) {
            for (var m = s.shift(), d = m.files, v = 0; v < d.length; v++) {
              var k = d[v], I = k.fileNameStr, R = n.resolve(k.fileNameStr);
              p.file(R, k.decompressed, { binary: !0, optimizedBinaryString: !0, date: k.date, dir: k.dir, comment: k.fileCommentStr.length ? k.fileCommentStr : null, unixPermissions: k.unixPermissions, dosPermissions: k.dosPermissions, createFolders: f.createFolders }), k.dir || (p.file(R).unsafeOriginalName = I);
            }
            return m.zipComment.length && (p.comment = m.zipComment), p;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, o, i) {
        var n = e("../utils"), r = e("../stream/GenericWorker");
        function a(u, g) {
          r.call(this, "Nodejs stream input adapter for " + u), this._upstreamEnded = !1, this._bindStream(g);
        }
        n.inherits(a, r), a.prototype._bindStream = function(u) {
          var g = this;
          (this._stream = u).pause(), u.on("data", function(b) {
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
        }, o.exports = a;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, o, i) {
        var n = e("readable-stream").Readable;
        function r(a, u, g) {
          n.call(this, u), this._helper = a;
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
        }, o.exports = r;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, o, i) {
        o.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(n, r) {
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
      }, {}], 15: [function(e, o, i) {
        function n(R, B, O) {
          var U, E = a.getTypeOf(B), $ = a.extend(O || {}, b);
          $.date = $.date || /* @__PURE__ */ new Date(), $.compression !== null && ($.compression = $.compression.toUpperCase()), typeof $.unixPermissions == "string" && ($.unixPermissions = parseInt($.unixPermissions, 8)), $.unixPermissions && 16384 & $.unixPermissions && ($.dir = !0), $.dosPermissions && 16 & $.dosPermissions && ($.dir = !0), $.dir && (R = d(R)), $.createFolders && (U = m(R)) && v.call(this, U, !0);
          var V = E === "string" && $.binary === !1 && $.base64 === !1;
          O && O.binary !== void 0 || ($.binary = !V), (B instanceof _ && B.uncompressedSize === 0 || $.dir || !B || B.length === 0) && ($.base64 = !1, $.binary = !0, B = "", $.compression = "STORE", E = "string");
          var S = null;
          S = B instanceof _ || B instanceof u ? B : p.isNode && p.isStream(B) ? new s(R, B) : a.prepareContent(R, B, $.binary, $.optimizedBinaryString, $.base64);
          var L = new y(R, S, $);
          this.files[R] = L;
        }
        var r = e("./utf8"), a = e("./utils"), u = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), b = e("./defaults"), _ = e("./compressedObject"), y = e("./zipObject"), f = e("./generate"), p = e("./nodejsUtils"), s = e("./nodejs/NodejsStreamInputAdapter"), m = function(R) {
          R.slice(-1) === "/" && (R = R.substring(0, R.length - 1));
          var B = R.lastIndexOf("/");
          return 0 < B ? R.substring(0, B) : "";
        }, d = function(R) {
          return R.slice(-1) !== "/" && (R += "/"), R;
        }, v = function(R, B) {
          return B = B !== void 0 ? B : b.createFolders, R = d(R), this.files[R] || n.call(this, R, null, { dir: !0, createFolders: B }), this.files[R];
        };
        function k(R) {
          return Object.prototype.toString.call(R) === "[object RegExp]";
        }
        var I = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(R) {
          var B, O, U;
          for (B in this.files) U = this.files[B], (O = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && R(O, U);
        }, filter: function(R) {
          var B = [];
          return this.forEach(function(O, U) {
            R(O, U) && B.push(U);
          }), B;
        }, file: function(R, B, O) {
          if (arguments.length !== 1) return R = this.root + R, n.call(this, R, B, O), this;
          if (k(R)) {
            var U = R;
            return this.filter(function($, V) {
              return !V.dir && U.test($);
            });
          }
          var E = this.files[this.root + R];
          return E && !E.dir ? E : null;
        }, folder: function(R) {
          if (!R) return this;
          if (k(R)) return this.filter(function(E, $) {
            return $.dir && R.test(E);
          });
          var B = this.root + R, O = v.call(this, B), U = this.clone();
          return U.root = O.name, U;
        }, remove: function(R) {
          R = this.root + R;
          var B = this.files[R];
          if (B || (R.slice(-1) !== "/" && (R += "/"), B = this.files[R]), B && !B.dir) delete this.files[R];
          else for (var O = this.filter(function(E, $) {
            return $.name.slice(0, R.length) === R;
          }), U = 0; U < O.length; U++) delete this.files[O[U].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(R) {
          var B, O = {};
          try {
            if ((O = a.extend(R || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: r.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            a.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var U = O.comment || this.comment || "";
            B = f.generateWorker(this, O, U);
          } catch (E) {
            (B = new u("error")).error(E);
          }
          return new g(B, O.type || "string", O.mimeType);
        }, generateAsync: function(R, B) {
          return this.generateInternalStream(R).accumulate(B);
        }, generateNodeStream: function(R, B) {
          return (R = R || {}).type || (R.type = "nodebuffer"), this.generateInternalStream(R).toNodejsStream(B);
        } };
        o.exports = I;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, o, i) {
        o.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, o, i) {
        var n = e("./DataReader");
        function r(a) {
          n.call(this, a);
          for (var u = 0; u < this.data.length; u++) a[u] = 255 & a[u];
        }
        e("../utils").inherits(r, n), r.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, r.prototype.lastIndexOfSignature = function(a) {
          for (var u = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), _ = a.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === u && this.data[y + 1] === g && this.data[y + 2] === b && this.data[y + 3] === _) return y - this.zero;
          return -1;
        }, r.prototype.readAndCheckSignature = function(a) {
          var u = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), _ = a.charCodeAt(3), y = this.readData(4);
          return u === y[0] && g === y[1] && b === y[2] && _ === y[3];
        }, r.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, u;
        }, o.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, o, i) {
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
          var u, g = 0;
          for (this.checkOffset(a), u = this.index + a - 1; u >= this.index; u--) g = (g << 8) + this.byteAt(u);
          return this.index += a, g;
        }, readString: function(a) {
          return n.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, o.exports = r;
      }, { "../utils": 32 }], 19: [function(e, o, i) {
        var n = e("./Uint8ArrayReader");
        function r(a) {
          n.call(this, a);
        }
        e("../utils").inherits(r, n), r.prototype.readData = function(a) {
          this.checkOffset(a);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, u;
        }, o.exports = r;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, o, i) {
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
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, u;
        }, o.exports = r;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, o, i) {
        var n = e("./ArrayReader");
        function r(a) {
          n.call(this, a);
        }
        e("../utils").inherits(r, n), r.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var u = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, u;
        }, o.exports = r;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, o, i) {
        var n = e("../utils"), r = e("../support"), a = e("./ArrayReader"), u = e("./StringReader"), g = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        o.exports = function(_) {
          var y = n.getTypeOf(_);
          return n.checkSupport(y), y !== "string" || r.uint8array ? y === "nodebuffer" ? new g(_) : r.uint8array ? new b(n.transformTo("uint8array", _)) : new a(n.transformTo("array", _)) : new u(_);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, o, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, o, i) {
        var n = e("./GenericWorker"), r = e("../utils");
        function a(u) {
          n.call(this, "ConvertWorker to " + u), this.destType = u;
        }
        r.inherits(a, n), a.prototype.processChunk = function(u) {
          this.push({ data: r.transformTo(this.destType, u.data), meta: u.meta });
        }, o.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, o, i) {
        var n = e("./GenericWorker"), r = e("../crc32");
        function a() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, n), a.prototype.processChunk = function(u) {
          this.streamInfo.crc32 = r(u.data, this.streamInfo.crc32 || 0), this.push(u);
        }, o.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, o, i) {
        var n = e("../utils"), r = e("./GenericWorker");
        function a(u) {
          r.call(this, "DataLengthProbe for " + u), this.propName = u, this.withStreamInfo(u, 0);
        }
        n.inherits(a, r), a.prototype.processChunk = function(u) {
          if (u) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + u.data.length;
          }
          r.prototype.processChunk.call(this, u);
        }, o.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, o, i) {
        var n = e("../utils"), r = e("./GenericWorker");
        function a(u) {
          r.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, u.then(function(b) {
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
          var u = null, g = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              u = this.data.substring(this.index, g);
              break;
            case "uint8array":
              u = this.data.subarray(this.index, g);
              break;
            case "array":
            case "nodebuffer":
              u = this.data.slice(this.index, g);
          }
          return this.index = g, this.push({ data: u, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, o.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, o, i) {
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
          if (this._listeners[r]) for (var u = 0; u < this._listeners[r].length; u++) this._listeners[r][u].call(this, a);
        }, pipe: function(r) {
          return r.registerPrevious(this);
        }, registerPrevious: function(r) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = r.streamInfo, this.mergeStreamInfo(), this.previous = r;
          var a = this;
          return r.on("data", function(u) {
            a.processChunk(u);
          }), r.on("end", function() {
            a.end();
          }), r.on("error", function(u) {
            a.error(u);
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
        } }, o.exports = n;
      }, {}], 29: [function(e, o, i) {
        var n = e("../utils"), r = e("./ConvertWorker"), a = e("./GenericWorker"), u = e("../base64"), g = e("../support"), b = e("../external"), _ = null;
        if (g.nodestream) try {
          _ = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(p, s) {
          return new b.Promise(function(m, d) {
            var v = [], k = p._internalType, I = p._outputType, R = p._mimeType;
            p.on("data", function(B, O) {
              v.push(B), s && s(O);
            }).on("error", function(B) {
              v = [], d(B);
            }).on("end", function() {
              try {
                var B = (function(O, U, E) {
                  switch (O) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", U), E);
                    case "base64":
                      return u.encode(U);
                    default:
                      return n.transformTo(O, U);
                  }
                })(I, (function(O, U) {
                  var E, $ = 0, V = null, S = 0;
                  for (E = 0; E < U.length; E++) S += U[E].length;
                  switch (O) {
                    case "string":
                      return U.join("");
                    case "array":
                      return Array.prototype.concat.apply([], U);
                    case "uint8array":
                      for (V = new Uint8Array(S), E = 0; E < U.length; E++) V.set(U[E], $), $ += U[E].length;
                      return V;
                    case "nodebuffer":
                      return Buffer.concat(U);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                })(k, v), R);
                m(B);
              } catch (O) {
                d(O);
              }
              v = [];
            }).resume();
          });
        }
        function f(p, s, m) {
          var d = s;
          switch (s) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = s, this._mimeType = m, n.checkSupport(d), this._worker = p.pipe(new r(d)), p.lock();
          } catch (v) {
            this._worker = new a("error"), this._worker.error(v);
          }
        }
        f.prototype = { accumulate: function(p) {
          return y(this, p);
        }, on: function(p, s) {
          var m = this;
          return p === "data" ? this._worker.on(p, function(d) {
            s.call(m, d.data, d.meta);
          }) : this._worker.on(p, function() {
            n.delay(s, arguments, m);
          }), this;
        }, resume: function() {
          return n.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(p) {
          if (n.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new _(this, { objectMode: this._outputType !== "nodebuffer" }, p);
        } }, o.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, o, i) {
        if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", i.nodebuffer = typeof Buffer < "u", i.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") i.blob = !1;
        else {
          var n = new ArrayBuffer(0);
          try {
            i.blob = new Blob([n], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var r = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              r.append(n), i.blob = r.getBlob("application/zip").size === 0;
            } catch {
              i.blob = !1;
            }
          }
        }
        try {
          i.nodestream = !!e("readable-stream").Readable;
        } catch {
          i.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, o, i) {
        for (var n = e("./utils"), r = e("./support"), a = e("./nodejsUtils"), u = e("./stream/GenericWorker"), g = new Array(256), b = 0; b < 256; b++) g[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        g[254] = g[254] = 1;
        function _() {
          u.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          u.call(this, "utf-8 encode");
        }
        i.utf8encode = function(f) {
          return r.nodebuffer ? a.newBufferFrom(f, "utf-8") : (function(p) {
            var s, m, d, v, k, I = p.length, R = 0;
            for (v = 0; v < I; v++) (64512 & (m = p.charCodeAt(v))) == 55296 && v + 1 < I && (64512 & (d = p.charCodeAt(v + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (d - 56320), v++), R += m < 128 ? 1 : m < 2048 ? 2 : m < 65536 ? 3 : 4;
            for (s = r.uint8array ? new Uint8Array(R) : new Array(R), v = k = 0; k < R; v++) (64512 & (m = p.charCodeAt(v))) == 55296 && v + 1 < I && (64512 & (d = p.charCodeAt(v + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (d - 56320), v++), m < 128 ? s[k++] = m : (m < 2048 ? s[k++] = 192 | m >>> 6 : (m < 65536 ? s[k++] = 224 | m >>> 12 : (s[k++] = 240 | m >>> 18, s[k++] = 128 | m >>> 12 & 63), s[k++] = 128 | m >>> 6 & 63), s[k++] = 128 | 63 & m);
            return s;
          })(f);
        }, i.utf8decode = function(f) {
          return r.nodebuffer ? n.transformTo("nodebuffer", f).toString("utf-8") : (function(p) {
            var s, m, d, v, k = p.length, I = new Array(2 * k);
            for (s = m = 0; s < k; ) if ((d = p[s++]) < 128) I[m++] = d;
            else if (4 < (v = g[d])) I[m++] = 65533, s += v - 1;
            else {
              for (d &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && s < k; ) d = d << 6 | 63 & p[s++], v--;
              1 < v ? I[m++] = 65533 : d < 65536 ? I[m++] = d : (d -= 65536, I[m++] = 55296 | d >> 10 & 1023, I[m++] = 56320 | 1023 & d);
            }
            return I.length !== m && (I.subarray ? I = I.subarray(0, m) : I.length = m), n.applyFromCharCode(I);
          })(f = n.transformTo(r.uint8array ? "uint8array" : "array", f));
        }, n.inherits(_, u), _.prototype.processChunk = function(f) {
          var p = n.transformTo(r.uint8array ? "uint8array" : "array", f.data);
          if (this.leftOver && this.leftOver.length) {
            if (r.uint8array) {
              var s = p;
              (p = new Uint8Array(s.length + this.leftOver.length)).set(this.leftOver, 0), p.set(s, this.leftOver.length);
            } else p = this.leftOver.concat(p);
            this.leftOver = null;
          }
          var m = (function(v, k) {
            var I;
            for ((k = k || v.length) > v.length && (k = v.length), I = k - 1; 0 <= I && (192 & v[I]) == 128; ) I--;
            return I < 0 || I === 0 ? k : I + g[v[I]] > k ? I : k;
          })(p), d = p;
          m !== p.length && (r.uint8array ? (d = p.subarray(0, m), this.leftOver = p.subarray(m, p.length)) : (d = p.slice(0, m), this.leftOver = p.slice(m, p.length))), this.push({ data: i.utf8decode(d), meta: f.meta });
        }, _.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = _, n.inherits(y, u), y.prototype.processChunk = function(f) {
          this.push({ data: i.utf8encode(f.data), meta: f.meta });
        }, i.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, o, i) {
        var n = e("./support"), r = e("./base64"), a = e("./nodejsUtils"), u = e("./external");
        function g(s) {
          return s;
        }
        function b(s, m) {
          for (var d = 0; d < s.length; ++d) m[d] = 255 & s.charCodeAt(d);
          return m;
        }
        e("setimmediate"), i.newBlob = function(s, m) {
          i.checkSupport("blob");
          try {
            return new Blob([s], { type: m });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(s), d.getBlob(m);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var _ = { stringifyByChunk: function(s, m, d) {
          var v = [], k = 0, I = s.length;
          if (I <= d) return String.fromCharCode.apply(null, s);
          for (; k < I; ) m === "array" || m === "nodebuffer" ? v.push(String.fromCharCode.apply(null, s.slice(k, Math.min(k + d, I)))) : v.push(String.fromCharCode.apply(null, s.subarray(k, Math.min(k + d, I)))), k += d;
          return v.join("");
        }, stringifyByChar: function(s) {
          for (var m = "", d = 0; d < s.length; d++) m += String.fromCharCode(s[d]);
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
        function y(s) {
          var m = 65536, d = i.getTypeOf(s), v = !0;
          if (d === "uint8array" ? v = _.applyCanBeUsed.uint8array : d === "nodebuffer" && (v = _.applyCanBeUsed.nodebuffer), v) for (; 1 < m; ) try {
            return _.stringifyByChunk(s, d, m);
          } catch {
            m = Math.floor(m / 2);
          }
          return _.stringifyByChar(s);
        }
        function f(s, m) {
          for (var d = 0; d < s.length; d++) m[d] = s[d];
          return m;
        }
        i.applyFromCharCode = y;
        var p = {};
        p.string = { string: g, array: function(s) {
          return b(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return p.string.uint8array(s).buffer;
        }, uint8array: function(s) {
          return b(s, new Uint8Array(s.length));
        }, nodebuffer: function(s) {
          return b(s, a.allocBuffer(s.length));
        } }, p.array = { string: y, array: g, arraybuffer: function(s) {
          return new Uint8Array(s).buffer;
        }, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return a.newBufferFrom(s);
        } }, p.arraybuffer = { string: function(s) {
          return y(new Uint8Array(s));
        }, array: function(s) {
          return f(new Uint8Array(s), new Array(s.byteLength));
        }, arraybuffer: g, uint8array: function(s) {
          return new Uint8Array(s);
        }, nodebuffer: function(s) {
          return a.newBufferFrom(new Uint8Array(s));
        } }, p.uint8array = { string: y, array: function(s) {
          return f(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return s.buffer;
        }, uint8array: g, nodebuffer: function(s) {
          return a.newBufferFrom(s);
        } }, p.nodebuffer = { string: y, array: function(s) {
          return f(s, new Array(s.length));
        }, arraybuffer: function(s) {
          return p.nodebuffer.uint8array(s).buffer;
        }, uint8array: function(s) {
          return f(s, new Uint8Array(s.length));
        }, nodebuffer: g }, i.transformTo = function(s, m) {
          if (m = m || "", !s) return m;
          i.checkSupport(s);
          var d = i.getTypeOf(m);
          return p[d][s](m);
        }, i.resolve = function(s) {
          for (var m = s.split("/"), d = [], v = 0; v < m.length; v++) {
            var k = m[v];
            k === "." || k === "" && v !== 0 && v !== m.length - 1 || (k === ".." ? d.pop() : d.push(k));
          }
          return d.join("/");
        }, i.getTypeOf = function(s) {
          return typeof s == "string" ? "string" : Object.prototype.toString.call(s) === "[object Array]" ? "array" : n.nodebuffer && a.isBuffer(s) ? "nodebuffer" : n.uint8array && s instanceof Uint8Array ? "uint8array" : n.arraybuffer && s instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, i.checkSupport = function(s) {
          if (!n[s.toLowerCase()]) throw new Error(s + " is not supported by this platform");
        }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function(s) {
          var m, d, v = "";
          for (d = 0; d < (s || "").length; d++) v += "\\x" + ((m = s.charCodeAt(d)) < 16 ? "0" : "") + m.toString(16).toUpperCase();
          return v;
        }, i.delay = function(s, m, d) {
          setImmediate(function() {
            s.apply(d || null, m || []);
          });
        }, i.inherits = function(s, m) {
          function d() {
          }
          d.prototype = m.prototype, s.prototype = new d();
        }, i.extend = function() {
          var s, m, d = {};
          for (s = 0; s < arguments.length; s++) for (m in arguments[s]) Object.prototype.hasOwnProperty.call(arguments[s], m) && d[m] === void 0 && (d[m] = arguments[s][m]);
          return d;
        }, i.prepareContent = function(s, m, d, v, k) {
          return u.Promise.resolve(m).then(function(I) {
            return n.blob && (I instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(I)) !== -1) && typeof FileReader < "u" ? new u.Promise(function(R, B) {
              var O = new FileReader();
              O.onload = function(U) {
                R(U.target.result);
              }, O.onerror = function(U) {
                B(U.target.error);
              }, O.readAsArrayBuffer(I);
            }) : I;
          }).then(function(I) {
            var R = i.getTypeOf(I);
            return R ? (R === "arraybuffer" ? I = i.transformTo("uint8array", I) : R === "string" && (k ? I = r.decode(I) : d && v !== !0 && (I = (function(B) {
              return b(B, n.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            })(I))), I) : u.Promise.reject(new Error("Can't read the data of '" + s + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, o, i) {
        var n = e("./reader/readerFor"), r = e("./utils"), a = e("./signature"), u = e("./zipEntry"), g = e("./support");
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
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (_ = new u({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
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
        } }, o.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, o, i) {
        var n = e("./reader/readerFor"), r = e("./utils"), a = e("./compressedObject"), u = e("./crc32"), g = e("./utf8"), b = e("./compressions"), _ = e("./support");
        function y(f, p) {
          this.options = f, this.loadOptions = p;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(f) {
          var p, s;
          if (f.skip(22), this.fileNameLength = f.readInt(2), s = f.readInt(2), this.fileName = f.readData(this.fileNameLength), f.skip(s), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
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
          var p, s, m, d = f.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); f.index + 4 < d; ) p = f.readInt(2), s = f.readInt(2), m = f.readData(s), this.extraFields[p] = { id: p, length: s, value: m };
          f.setIndex(d);
        }, handleUTF8: function() {
          var f = _.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
          else {
            var p = this.findExtraFieldUnicodePath();
            if (p !== null) this.fileNameStr = p;
            else {
              var s = r.transformTo(f, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(s);
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
            return p.readInt(1) !== 1 || u(this.fileName) !== p.readInt(4) ? null : g.utf8decode(p.readData(f.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var f = this.extraFields[25461];
          if (f) {
            var p = n(f.value);
            return p.readInt(1) !== 1 || u(this.fileComment) !== p.readInt(4) ? null : g.utf8decode(p.readData(f.length - 5));
          }
          return null;
        } }, o.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, o, i) {
        function n(p, s, m) {
          this.name = p, this.dir = m.dir, this.date = m.date, this.comment = m.comment, this.unixPermissions = m.unixPermissions, this.dosPermissions = m.dosPermissions, this._data = s, this._dataBinary = m.binary, this.options = { compression: m.compression, compressionOptions: m.compressionOptions };
        }
        var r = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), u = e("./utf8"), g = e("./compressedObject"), b = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(p) {
          var s = null, m = "string";
          try {
            if (!p) throw new Error("No output type specified.");
            var d = (m = p.toLowerCase()) === "string" || m === "text";
            m !== "binarystring" && m !== "text" || (m = "string"), s = this._decompressWorker();
            var v = !this._dataBinary;
            v && !d && (s = s.pipe(new u.Utf8EncodeWorker())), !v && d && (s = s.pipe(new u.Utf8DecodeWorker()));
          } catch (k) {
            (s = new b("error")).error(k);
          }
          return new r(s, m, "");
        }, async: function(p, s) {
          return this.internalStream(p).accumulate(s);
        }, nodeStream: function(p, s) {
          return this.internalStream(p || "nodebuffer").toNodejsStream(s);
        }, _compressWorker: function(p, s) {
          if (this._data instanceof g && this._data.compression.magic === p.magic) return this._data.getCompressedWorker();
          var m = this._decompressWorker();
          return this._dataBinary || (m = m.pipe(new u.Utf8EncodeWorker())), g.createWorkerFrom(m, p, s);
        }, _decompressWorker: function() {
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof b ? this._data : new a(this._data);
        } };
        for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < _.length; f++) n.prototype[_[f]] = y;
        o.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, o, i) {
        (function(n) {
          var r, a, u = n.MutationObserver || n.WebKitMutationObserver;
          if (u) {
            var g = 0, b = new u(p), _ = n.document.createTextNode("");
            b.observe(_, { characterData: !0 }), r = function() {
              _.data = g = ++g % 2;
            };
          } else if (n.setImmediate || n.MessageChannel === void 0) r = "document" in n && "onreadystatechange" in n.document.createElement("script") ? function() {
            var s = n.document.createElement("script");
            s.onreadystatechange = function() {
              p(), s.onreadystatechange = null, s.parentNode.removeChild(s), s = null;
            }, n.document.documentElement.appendChild(s);
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
            var s, m;
            a = !0;
            for (var d = f.length; d; ) {
              for (m = f, f = [], s = -1; ++s < d; ) m[s]();
              d = f.length;
            }
            a = !1;
          }
          o.exports = function(s) {
            f.push(s) !== 1 || a || r();
          };
        }).call(this, typeof ae < "u" ? ae : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, o, i) {
        var n = e("immediate");
        function r() {
        }
        var a = {}, u = ["REJECTED"], g = ["FULFILLED"], b = ["PENDING"];
        function _(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== r && s(this, d);
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
        function s(d, v) {
          var k = !1;
          function I(O) {
            k || (k = !0, a.reject(d, O));
          }
          function R(O) {
            k || (k = !0, a.resolve(d, O));
          }
          var B = m(function() {
            v(R, I);
          });
          B.status === "error" && I(B.value);
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
        (o.exports = _).prototype.finally = function(d) {
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
          if (typeof d != "function" && this.state === g || typeof v != "function" && this.state === u) return this;
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
          if (I) s(d, I);
          else {
            d.state = g, d.outcome = v;
            for (var R = -1, B = d.queue.length; ++R < B; ) d.queue[R].callFulfilled(v);
          }
          return d;
        }, a.reject = function(d, v) {
          d.state = u, d.outcome = v;
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
          for (var R = new Array(k), B = 0, O = -1, U = new this(r); ++O < k; ) E(d[O], O);
          return U;
          function E($, V) {
            v.resolve($).then(function(S) {
              R[V] = S, ++B !== k || I || (I = !0, a.resolve(U, R));
            }, function(S) {
              I || (I = !0, a.reject(U, S));
            });
          }
        }, _.race = function(d) {
          var v = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = d.length, I = !1;
          if (!k) return this.resolve([]);
          for (var R = -1, B = new this(r); ++R < k; ) O = d[R], v.resolve(O).then(function(U) {
            I || (I = !0, a.resolve(B, U));
          }, function(U) {
            I || (I = !0, a.reject(B, U));
          });
          var O;
          return B;
        };
      }, { immediate: 36 }], 38: [function(e, o, i) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), o.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, o, i) {
        var n = e("./zlib/deflate"), r = e("./utils/common"), a = e("./utils/strings"), u = e("./zlib/messages"), g = e("./zlib/zstream"), b = Object.prototype.toString, _ = 0, y = -1, f = 0, p = 8;
        function s(d) {
          if (!(this instanceof s)) return new s(d);
          this.options = r.assign({ level: y, method: p, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: f, to: "" }, d || {});
          var v = this.options;
          v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var k = n.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
          if (k !== _) throw new Error(u[k]);
          if (v.header && n.deflateSetHeader(this.strm, v.header), v.dictionary) {
            var I;
            if (I = typeof v.dictionary == "string" ? a.string2buf(v.dictionary) : b.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (k = n.deflateSetDictionary(this.strm, I)) !== _) throw new Error(u[k]);
            this._dict_set = !0;
          }
        }
        function m(d, v) {
          var k = new s(v);
          if (k.push(d, !0), k.err) throw k.msg || u[k.err];
          return k.result;
        }
        s.prototype.push = function(d, v) {
          var k, I, R = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          I = v === ~~v ? v : v === !0 ? 4 : 0, typeof d == "string" ? R.input = a.string2buf(d) : b.call(d) === "[object ArrayBuffer]" ? R.input = new Uint8Array(d) : R.input = d, R.next_in = 0, R.avail_in = R.input.length;
          do {
            if (R.avail_out === 0 && (R.output = new r.Buf8(B), R.next_out = 0, R.avail_out = B), (k = n.deflate(R, I)) !== 1 && k !== _) return this.onEnd(k), !(this.ended = !0);
            R.avail_out !== 0 && (R.avail_in !== 0 || I !== 4 && I !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(r.shrinkBuf(R.output, R.next_out))) : this.onData(r.shrinkBuf(R.output, R.next_out)));
          } while ((0 < R.avail_in || R.avail_out === 0) && k !== 1);
          return I === 4 ? (k = n.deflateEnd(this.strm), this.onEnd(k), this.ended = !0, k === _) : I !== 2 || (this.onEnd(_), !(R.avail_out = 0));
        }, s.prototype.onData = function(d) {
          this.chunks.push(d);
        }, s.prototype.onEnd = function(d) {
          d === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, i.Deflate = s, i.deflate = m, i.deflateRaw = function(d, v) {
          return (v = v || {}).raw = !0, m(d, v);
        }, i.gzip = function(d, v) {
          return (v = v || {}).gzip = !0, m(d, v);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, o, i) {
        var n = e("./zlib/inflate"), r = e("./utils/common"), a = e("./utils/strings"), u = e("./zlib/constants"), g = e("./zlib/messages"), b = e("./zlib/zstream"), _ = e("./zlib/gzheader"), y = Object.prototype.toString;
        function f(s) {
          if (!(this instanceof f)) return new f(s);
          this.options = r.assign({ chunkSize: 16384, windowBits: 0, to: "" }, s || {});
          var m = this.options;
          m.raw && 0 <= m.windowBits && m.windowBits < 16 && (m.windowBits = -m.windowBits, m.windowBits === 0 && (m.windowBits = -15)), !(0 <= m.windowBits && m.windowBits < 16) || s && s.windowBits || (m.windowBits += 32), 15 < m.windowBits && m.windowBits < 48 && (15 & m.windowBits) == 0 && (m.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var d = n.inflateInit2(this.strm, m.windowBits);
          if (d !== u.Z_OK) throw new Error(g[d]);
          this.header = new _(), n.inflateGetHeader(this.strm, this.header);
        }
        function p(s, m) {
          var d = new f(m);
          if (d.push(s, !0), d.err) throw d.msg || g[d.err];
          return d.result;
        }
        f.prototype.push = function(s, m) {
          var d, v, k, I, R, B, O = this.strm, U = this.options.chunkSize, E = this.options.dictionary, $ = !1;
          if (this.ended) return !1;
          v = m === ~~m ? m : m === !0 ? u.Z_FINISH : u.Z_NO_FLUSH, typeof s == "string" ? O.input = a.binstring2buf(s) : y.call(s) === "[object ArrayBuffer]" ? O.input = new Uint8Array(s) : O.input = s, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new r.Buf8(U), O.next_out = 0, O.avail_out = U), (d = n.inflate(O, u.Z_NO_FLUSH)) === u.Z_NEED_DICT && E && (B = typeof E == "string" ? a.string2buf(E) : y.call(E) === "[object ArrayBuffer]" ? new Uint8Array(E) : E, d = n.inflateSetDictionary(this.strm, B)), d === u.Z_BUF_ERROR && $ === !0 && (d = u.Z_OK, $ = !1), d !== u.Z_STREAM_END && d !== u.Z_OK) return this.onEnd(d), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && d !== u.Z_STREAM_END && (O.avail_in !== 0 || v !== u.Z_FINISH && v !== u.Z_SYNC_FLUSH) || (this.options.to === "string" ? (k = a.utf8border(O.output, O.next_out), I = O.next_out - k, R = a.buf2string(O.output, k), O.next_out = I, O.avail_out = U - I, I && r.arraySet(O.output, O.output, k, I, 0), this.onData(R)) : this.onData(r.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && ($ = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && d !== u.Z_STREAM_END);
          return d === u.Z_STREAM_END && (v = u.Z_FINISH), v === u.Z_FINISH ? (d = n.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === u.Z_OK) : v !== u.Z_SYNC_FLUSH || (this.onEnd(u.Z_OK), !(O.avail_out = 0));
        }, f.prototype.onData = function(s) {
          this.chunks.push(s);
        }, f.prototype.onEnd = function(s) {
          s === u.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = s, this.msg = this.strm.msg;
        }, i.Inflate = f, i.inflate = p, i.inflateRaw = function(s, m) {
          return (m = m || {}).raw = !0, p(s, m);
        }, i.ungzip = p;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, o, i) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        i.assign = function(u) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var b = g.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var _ in b) b.hasOwnProperty(_) && (u[_] = b[_]);
            }
          }
          return u;
        }, i.shrinkBuf = function(u, g) {
          return u.length === g ? u : u.subarray ? u.subarray(0, g) : (u.length = g, u);
        };
        var r = { arraySet: function(u, g, b, _, y) {
          if (g.subarray && u.subarray) u.set(g.subarray(b, b + _), y);
          else for (var f = 0; f < _; f++) u[y + f] = g[b + f];
        }, flattenChunks: function(u) {
          var g, b, _, y, f, p;
          for (g = _ = 0, b = u.length; g < b; g++) _ += u[g].length;
          for (p = new Uint8Array(_), g = y = 0, b = u.length; g < b; g++) f = u[g], p.set(f, y), y += f.length;
          return p;
        } }, a = { arraySet: function(u, g, b, _, y) {
          for (var f = 0; f < _; f++) u[y + f] = g[b + f];
        }, flattenChunks: function(u) {
          return [].concat.apply([], u);
        } };
        i.setTyped = function(u) {
          u ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, r)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, a));
        }, i.setTyped(n);
      }, {}], 42: [function(e, o, i) {
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
        for (var u = new n.Buf8(256), g = 0; g < 256; g++) u[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function b(_, y) {
          if (y < 65537 && (_.subarray && a || !_.subarray && r)) return String.fromCharCode.apply(null, n.shrinkBuf(_, y));
          for (var f = "", p = 0; p < y; p++) f += String.fromCharCode(_[p]);
          return f;
        }
        u[254] = u[254] = 1, i.string2buf = function(_) {
          var y, f, p, s, m, d = _.length, v = 0;
          for (s = 0; s < d; s++) (64512 & (f = _.charCodeAt(s))) == 55296 && s + 1 < d && (64512 & (p = _.charCodeAt(s + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (p - 56320), s++), v += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
          for (y = new n.Buf8(v), s = m = 0; m < v; s++) (64512 & (f = _.charCodeAt(s))) == 55296 && s + 1 < d && (64512 & (p = _.charCodeAt(s + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (p - 56320), s++), f < 128 ? y[m++] = f : (f < 2048 ? y[m++] = 192 | f >>> 6 : (f < 65536 ? y[m++] = 224 | f >>> 12 : (y[m++] = 240 | f >>> 18, y[m++] = 128 | f >>> 12 & 63), y[m++] = 128 | f >>> 6 & 63), y[m++] = 128 | 63 & f);
          return y;
        }, i.buf2binstring = function(_) {
          return b(_, _.length);
        }, i.binstring2buf = function(_) {
          for (var y = new n.Buf8(_.length), f = 0, p = y.length; f < p; f++) y[f] = _.charCodeAt(f);
          return y;
        }, i.buf2string = function(_, y) {
          var f, p, s, m, d = y || _.length, v = new Array(2 * d);
          for (f = p = 0; f < d; ) if ((s = _[f++]) < 128) v[p++] = s;
          else if (4 < (m = u[s])) v[p++] = 65533, f += m - 1;
          else {
            for (s &= m === 2 ? 31 : m === 3 ? 15 : 7; 1 < m && f < d; ) s = s << 6 | 63 & _[f++], m--;
            1 < m ? v[p++] = 65533 : s < 65536 ? v[p++] = s : (s -= 65536, v[p++] = 55296 | s >> 10 & 1023, v[p++] = 56320 | 1023 & s);
          }
          return b(v, p);
        }, i.utf8border = function(_, y) {
          var f;
          for ((y = y || _.length) > _.length && (y = _.length), f = y - 1; 0 <= f && (192 & _[f]) == 128; ) f--;
          return f < 0 || f === 0 ? y : f + u[_[f]] > y ? f : y;
        };
      }, { "./common": 41 }], 43: [function(e, o, i) {
        o.exports = function(n, r, a, u) {
          for (var g = 65535 & n | 0, b = n >>> 16 & 65535 | 0, _ = 0; a !== 0; ) {
            for (a -= _ = 2e3 < a ? 2e3 : a; b = b + (g = g + r[u++] | 0) | 0, --_; ) ;
            g %= 65521, b %= 65521;
          }
          return g | b << 16 | 0;
        };
      }, {}], 44: [function(e, o, i) {
        o.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, o, i) {
        var n = (function() {
          for (var r, a = [], u = 0; u < 256; u++) {
            r = u;
            for (var g = 0; g < 8; g++) r = 1 & r ? 3988292384 ^ r >>> 1 : r >>> 1;
            a[u] = r;
          }
          return a;
        })();
        o.exports = function(r, a, u, g) {
          var b = n, _ = g + u;
          r ^= -1;
          for (var y = g; y < _; y++) r = r >>> 8 ^ b[255 & (r ^ a[y])];
          return -1 ^ r;
        };
      }, {}], 46: [function(e, o, i) {
        var n, r = e("../utils/common"), a = e("./trees"), u = e("./adler32"), g = e("./crc32"), b = e("./messages"), _ = 0, y = 4, f = 0, p = -2, s = -1, m = 4, d = 2, v = 8, k = 9, I = 286, R = 30, B = 19, O = 2 * I + 1, U = 15, E = 3, $ = 258, V = $ + E + 1, S = 42, L = 113, c = 1, N = 2, lt = 3, X = 4;
        function et(l, D) {
          return l.msg = b[D], D;
        }
        function Y(l) {
          return (l << 1) - (4 < l ? 9 : 0);
        }
        function ot(l) {
          for (var D = l.length; 0 <= --D; ) l[D] = 0;
        }
        function P(l) {
          var D = l.state, F = D.pending;
          F > l.avail_out && (F = l.avail_out), F !== 0 && (r.arraySet(l.output, D.pending_buf, D.pending_out, F, l.next_out), l.next_out += F, D.pending_out += F, l.total_out += F, l.avail_out -= F, D.pending -= F, D.pending === 0 && (D.pending_out = 0));
        }
        function T(l, D) {
          a._tr_flush_block(l, 0 <= l.block_start ? l.block_start : -1, l.strstart - l.block_start, D), l.block_start = l.strstart, P(l.strm);
        }
        function at(l, D) {
          l.pending_buf[l.pending++] = D;
        }
        function J(l, D) {
          l.pending_buf[l.pending++] = D >>> 8 & 255, l.pending_buf[l.pending++] = 255 & D;
        }
        function H(l, D) {
          var F, w, x = l.max_chain_length, A = l.strstart, j = l.prev_length, W = l.nice_match, C = l.strstart > l.w_size - V ? l.strstart - (l.w_size - V) : 0, G = l.window, Q = l.w_mask, q = l.prev, st = l.strstart + $, ut = G[A + j - 1], dt = G[A + j];
          l.prev_length >= l.good_match && (x >>= 2), W > l.lookahead && (W = l.lookahead);
          do
            if (G[(F = D) + j] === dt && G[F + j - 1] === ut && G[F] === G[A] && G[++F] === G[A + 1]) {
              A += 2, F++;
              do
                ;
              while (G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && G[++A] === G[++F] && A < st);
              if (w = $ - (st - A), A = st - $, j < w) {
                if (l.match_start = D, W <= (j = w)) break;
                ut = G[A + j - 1], dt = G[A + j];
              }
            }
          while ((D = q[D & Q]) > C && --x != 0);
          return j <= l.lookahead ? j : l.lookahead;
        }
        function ft(l) {
          var D, F, w, x, A, j, W, C, G, Q, q = l.w_size;
          do {
            if (x = l.window_size - l.lookahead - l.strstart, l.strstart >= q + (q - V)) {
              for (r.arraySet(l.window, l.window, q, q, 0), l.match_start -= q, l.strstart -= q, l.block_start -= q, D = F = l.hash_size; w = l.head[--D], l.head[D] = q <= w ? w - q : 0, --F; ) ;
              for (D = F = q; w = l.prev[--D], l.prev[D] = q <= w ? w - q : 0, --F; ) ;
              x += q;
            }
            if (l.strm.avail_in === 0) break;
            if (j = l.strm, W = l.window, C = l.strstart + l.lookahead, G = x, Q = void 0, Q = j.avail_in, G < Q && (Q = G), F = Q === 0 ? 0 : (j.avail_in -= Q, r.arraySet(W, j.input, j.next_in, Q, C), j.state.wrap === 1 ? j.adler = u(j.adler, W, Q, C) : j.state.wrap === 2 && (j.adler = g(j.adler, W, Q, C)), j.next_in += Q, j.total_in += Q, Q), l.lookahead += F, l.lookahead + l.insert >= E) for (A = l.strstart - l.insert, l.ins_h = l.window[A], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[A + 1]) & l.hash_mask; l.insert && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[A + E - 1]) & l.hash_mask, l.prev[A & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = A, A++, l.insert--, !(l.lookahead + l.insert < E)); ) ;
          } while (l.lookahead < V && l.strm.avail_in !== 0);
        }
        function kt(l, D) {
          for (var F, w; ; ) {
            if (l.lookahead < V) {
              if (ft(l), l.lookahead < V && D === _) return c;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= E && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), F !== 0 && l.strstart - F <= l.w_size - V && (l.match_length = H(l, F)), l.match_length >= E) if (w = a._tr_tally(l, l.strstart - l.match_start, l.match_length - E), l.lookahead -= l.match_length, l.match_length <= l.max_lazy_match && l.lookahead >= E) {
              for (l.match_length--; l.strstart++, l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart, --l.match_length != 0; ) ;
              l.strstart++;
            } else l.strstart += l.match_length, l.match_length = 0, l.ins_h = l.window[l.strstart], l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + 1]) & l.hash_mask;
            else w = a._tr_tally(l, 0, l.window[l.strstart]), l.lookahead--, l.strstart++;
            if (w && (T(l, !1), l.strm.avail_out === 0)) return c;
          }
          return l.insert = l.strstart < E - 1 ? l.strstart : E - 1, D === y ? (T(l, !0), l.strm.avail_out === 0 ? lt : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? c : N;
        }
        function ct(l, D) {
          for (var F, w, x; ; ) {
            if (l.lookahead < V) {
              if (ft(l), l.lookahead < V && D === _) return c;
              if (l.lookahead === 0) break;
            }
            if (F = 0, l.lookahead >= E && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), l.prev_length = l.match_length, l.prev_match = l.match_start, l.match_length = E - 1, F !== 0 && l.prev_length < l.max_lazy_match && l.strstart - F <= l.w_size - V && (l.match_length = H(l, F), l.match_length <= 5 && (l.strategy === 1 || l.match_length === E && 4096 < l.strstart - l.match_start) && (l.match_length = E - 1)), l.prev_length >= E && l.match_length <= l.prev_length) {
              for (x = l.strstart + l.lookahead - E, w = a._tr_tally(l, l.strstart - 1 - l.prev_match, l.prev_length - E), l.lookahead -= l.prev_length - 1, l.prev_length -= 2; ++l.strstart <= x && (l.ins_h = (l.ins_h << l.hash_shift ^ l.window[l.strstart + E - 1]) & l.hash_mask, F = l.prev[l.strstart & l.w_mask] = l.head[l.ins_h], l.head[l.ins_h] = l.strstart), --l.prev_length != 0; ) ;
              if (l.match_available = 0, l.match_length = E - 1, l.strstart++, w && (T(l, !1), l.strm.avail_out === 0)) return c;
            } else if (l.match_available) {
              if ((w = a._tr_tally(l, 0, l.window[l.strstart - 1])) && T(l, !1), l.strstart++, l.lookahead--, l.strm.avail_out === 0) return c;
            } else l.match_available = 1, l.strstart++, l.lookahead--;
          }
          return l.match_available && (w = a._tr_tally(l, 0, l.window[l.strstart - 1]), l.match_available = 0), l.insert = l.strstart < E - 1 ? l.strstart : E - 1, D === y ? (T(l, !0), l.strm.avail_out === 0 ? lt : X) : l.last_lit && (T(l, !1), l.strm.avail_out === 0) ? c : N;
        }
        function ht(l, D, F, w, x) {
          this.good_length = l, this.max_lazy = D, this.nice_length = F, this.max_chain = w, this.func = x;
        }
        function bt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new r.Buf16(2 * O), this.dyn_dtree = new r.Buf16(2 * (2 * R + 1)), this.bl_tree = new r.Buf16(2 * (2 * B + 1)), ot(this.dyn_ltree), ot(this.dyn_dtree), ot(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new r.Buf16(U + 1), this.heap = new r.Buf16(2 * I + 1), ot(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new r.Buf16(2 * I + 1), ot(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(l) {
          var D;
          return l && l.state ? (l.total_in = l.total_out = 0, l.data_type = d, (D = l.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? S : L, l.adler = D.wrap === 2 ? 0 : 1, D.last_flush = _, a._tr_init(D), f) : et(l, p);
        }
        function Rt(l) {
          var D = pt(l);
          return D === f && (function(F) {
            F.window_size = 2 * F.w_size, ot(F.head), F.max_lazy_match = n[F.level].max_lazy, F.good_match = n[F.level].good_length, F.nice_match = n[F.level].nice_length, F.max_chain_length = n[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = E - 1, F.match_available = 0, F.ins_h = 0;
          })(l.state), D;
        }
        function Ct(l, D, F, w, x, A) {
          if (!l) return p;
          var j = 1;
          if (D === s && (D = 6), w < 0 ? (j = 0, w = -w) : 15 < w && (j = 2, w -= 16), x < 1 || k < x || F !== v || w < 8 || 15 < w || D < 0 || 9 < D || A < 0 || m < A) return et(l, p);
          w === 8 && (w = 9);
          var W = new bt();
          return (l.state = W).strm = l, W.wrap = j, W.gzhead = null, W.w_bits = w, W.w_size = 1 << W.w_bits, W.w_mask = W.w_size - 1, W.hash_bits = x + 7, W.hash_size = 1 << W.hash_bits, W.hash_mask = W.hash_size - 1, W.hash_shift = ~~((W.hash_bits + E - 1) / E), W.window = new r.Buf8(2 * W.w_size), W.head = new r.Buf16(W.hash_size), W.prev = new r.Buf16(W.w_size), W.lit_bufsize = 1 << x + 6, W.pending_buf_size = 4 * W.lit_bufsize, W.pending_buf = new r.Buf8(W.pending_buf_size), W.d_buf = 1 * W.lit_bufsize, W.l_buf = 3 * W.lit_bufsize, W.level = D, W.strategy = A, W.method = F, Rt(l);
        }
        n = [new ht(0, 0, 0, 0, function(l, D) {
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
          return l.insert = 0, D === y ? (T(l, !0), l.strm.avail_out === 0 ? lt : X) : (l.strstart > l.block_start && (T(l, !1), l.strm.avail_out), c);
        }), new ht(4, 4, 8, 4, kt), new ht(4, 5, 16, 8, kt), new ht(4, 6, 32, 32, kt), new ht(4, 4, 16, 16, ct), new ht(8, 16, 32, 32, ct), new ht(8, 16, 128, 128, ct), new ht(8, 32, 128, 256, ct), new ht(32, 128, 258, 1024, ct), new ht(32, 258, 258, 4096, ct)], i.deflateInit = function(l, D) {
          return Ct(l, D, v, 15, 8, 0);
        }, i.deflateInit2 = Ct, i.deflateReset = Rt, i.deflateResetKeep = pt, i.deflateSetHeader = function(l, D) {
          return l && l.state ? l.state.wrap !== 2 ? p : (l.state.gzhead = D, f) : p;
        }, i.deflate = function(l, D) {
          var F, w, x, A;
          if (!l || !l.state || 5 < D || D < 0) return l ? et(l, p) : p;
          if (w = l.state, !l.output || !l.input && l.avail_in !== 0 || w.status === 666 && D !== y) return et(l, l.avail_out === 0 ? -5 : p);
          if (w.strm = l, F = w.last_flush, w.last_flush = D, w.status === S) if (w.wrap === 2) l.adler = 0, at(w, 31), at(w, 139), at(w, 8), w.gzhead ? (at(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), at(w, 255 & w.gzhead.time), at(w, w.gzhead.time >> 8 & 255), at(w, w.gzhead.time >> 16 & 255), at(w, w.gzhead.time >> 24 & 255), at(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), at(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (at(w, 255 & w.gzhead.extra.length), at(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (l.adler = g(l.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (at(w, 0), at(w, 0), at(w, 0), at(w, 0), at(w, 0), at(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), at(w, 3), w.status = L);
          else {
            var j = v + (w.w_bits - 8 << 4) << 8;
            j |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (j |= 32), j += 31 - j % 31, w.status = L, J(w, j), w.strstart !== 0 && (J(w, l.adler >>> 16), J(w, 65535 & l.adler)), l.adler = 1;
          }
          if (w.status === 69) if (w.gzhead.extra) {
            for (x = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), P(l), x = w.pending, w.pending !== w.pending_buf_size)); ) at(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
          } else w.status = 73;
          if (w.status === 73) if (w.gzhead.name) {
            x = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), P(l), x = w.pending, w.pending === w.pending_buf_size)) {
                A = 1;
                break;
              }
              A = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, at(w, A);
            } while (A !== 0);
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), A === 0 && (w.gzindex = 0, w.status = 91);
          } else w.status = 91;
          if (w.status === 91) if (w.gzhead.comment) {
            x = w.pending;
            do {
              if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), P(l), x = w.pending, w.pending === w.pending_buf_size)) {
                A = 1;
                break;
              }
              A = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, at(w, A);
            } while (A !== 0);
            w.gzhead.hcrc && w.pending > x && (l.adler = g(l.adler, w.pending_buf, w.pending - x, x)), A === 0 && (w.status = 103);
          } else w.status = 103;
          if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && P(l), w.pending + 2 <= w.pending_buf_size && (at(w, 255 & l.adler), at(w, l.adler >> 8 & 255), l.adler = 0, w.status = L)) : w.status = L), w.pending !== 0) {
            if (P(l), l.avail_out === 0) return w.last_flush = -1, f;
          } else if (l.avail_in === 0 && Y(D) <= Y(F) && D !== y) return et(l, -5);
          if (w.status === 666 && l.avail_in !== 0) return et(l, -5);
          if (l.avail_in !== 0 || w.lookahead !== 0 || D !== _ && w.status !== 666) {
            var W = w.strategy === 2 ? (function(C, G) {
              for (var Q; ; ) {
                if (C.lookahead === 0 && (ft(C), C.lookahead === 0)) {
                  if (G === _) return c;
                  break;
                }
                if (C.match_length = 0, Q = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, Q && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === y ? (T(C, !0), C.strm.avail_out === 0 ? lt : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : N;
            })(w, D) : w.strategy === 3 ? (function(C, G) {
              for (var Q, q, st, ut, dt = C.window; ; ) {
                if (C.lookahead <= $) {
                  if (ft(C), C.lookahead <= $ && G === _) return c;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= E && 0 < C.strstart && (q = dt[st = C.strstart - 1]) === dt[++st] && q === dt[++st] && q === dt[++st]) {
                  ut = C.strstart + $;
                  do
                    ;
                  while (q === dt[++st] && q === dt[++st] && q === dt[++st] && q === dt[++st] && q === dt[++st] && q === dt[++st] && q === dt[++st] && q === dt[++st] && st < ut);
                  C.match_length = $ - (ut - st), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= E ? (Q = a._tr_tally(C, 1, C.match_length - E), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (Q = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), Q && (T(C, !1), C.strm.avail_out === 0)) return c;
              }
              return C.insert = 0, G === y ? (T(C, !0), C.strm.avail_out === 0 ? lt : X) : C.last_lit && (T(C, !1), C.strm.avail_out === 0) ? c : N;
            })(w, D) : n[w.level].func(w, D);
            if (W !== lt && W !== X || (w.status = 666), W === c || W === lt) return l.avail_out === 0 && (w.last_flush = -1), f;
            if (W === N && (D === 1 ? a._tr_align(w) : D !== 5 && (a._tr_stored_block(w, 0, 0, !1), D === 3 && (ot(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), P(l), l.avail_out === 0)) return w.last_flush = -1, f;
          }
          return D !== y ? f : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (at(w, 255 & l.adler), at(w, l.adler >> 8 & 255), at(w, l.adler >> 16 & 255), at(w, l.adler >> 24 & 255), at(w, 255 & l.total_in), at(w, l.total_in >> 8 & 255), at(w, l.total_in >> 16 & 255), at(w, l.total_in >> 24 & 255)) : (J(w, l.adler >>> 16), J(w, 65535 & l.adler)), P(l), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? f : 1);
        }, i.deflateEnd = function(l) {
          var D;
          return l && l.state ? (D = l.state.status) !== S && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== L && D !== 666 ? et(l, p) : (l.state = null, D === L ? et(l, -3) : f) : p;
        }, i.deflateSetDictionary = function(l, D) {
          var F, w, x, A, j, W, C, G, Q = D.length;
          if (!l || !l.state || (A = (F = l.state).wrap) === 2 || A === 1 && F.status !== S || F.lookahead) return p;
          for (A === 1 && (l.adler = u(l.adler, D, Q, 0)), F.wrap = 0, Q >= F.w_size && (A === 0 && (ot(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), G = new r.Buf8(F.w_size), r.arraySet(G, D, Q - F.w_size, F.w_size, 0), D = G, Q = F.w_size), j = l.avail_in, W = l.next_in, C = l.input, l.avail_in = Q, l.next_in = 0, l.input = D, ft(F); F.lookahead >= E; ) {
            for (w = F.strstart, x = F.lookahead - (E - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[w + E - 1]) & F.hash_mask, F.prev[w & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = w, w++, --x; ) ;
            F.strstart = w, F.lookahead = E - 1, ft(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = E - 1, F.match_available = 0, l.next_in = W, l.input = C, l.avail_in = j, F.wrap = A, f;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, o, i) {
        o.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, o, i) {
        o.exports = function(n, r) {
          var a, u, g, b, _, y, f, p, s, m, d, v, k, I, R, B, O, U, E, $, V, S, L, c, N;
          a = n.state, u = n.next_in, c = n.input, g = u + (n.avail_in - 5), b = n.next_out, N = n.output, _ = b - (r - n.avail_out), y = b + (n.avail_out - 257), f = a.dmax, p = a.wsize, s = a.whave, m = a.wnext, d = a.window, v = a.hold, k = a.bits, I = a.lencode, R = a.distcode, B = (1 << a.lenbits) - 1, O = (1 << a.distbits) - 1;
          t: do {
            k < 15 && (v += c[u++] << k, k += 8, v += c[u++] << k, k += 8), U = I[v & B];
            e: for (; ; ) {
              if (v >>>= E = U >>> 24, k -= E, (E = U >>> 16 & 255) === 0) N[b++] = 65535 & U;
              else {
                if (!(16 & E)) {
                  if ((64 & E) == 0) {
                    U = I[(65535 & U) + (v & (1 << E) - 1)];
                    continue e;
                  }
                  if (32 & E) {
                    a.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                $ = 65535 & U, (E &= 15) && (k < E && (v += c[u++] << k, k += 8), $ += v & (1 << E) - 1, v >>>= E, k -= E), k < 15 && (v += c[u++] << k, k += 8, v += c[u++] << k, k += 8), U = R[v & O];
                r: for (; ; ) {
                  if (v >>>= E = U >>> 24, k -= E, !(16 & (E = U >>> 16 & 255))) {
                    if ((64 & E) == 0) {
                      U = R[(65535 & U) + (v & (1 << E) - 1)];
                      continue r;
                    }
                    n.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (V = 65535 & U, k < (E &= 15) && (v += c[u++] << k, (k += 8) < E && (v += c[u++] << k, k += 8)), f < (V += v & (1 << E) - 1)) {
                    n.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (v >>>= E, k -= E, (E = b - _) < V) {
                    if (s < (E = V - E) && a.sane) {
                      n.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (L = d, (S = 0) === m) {
                      if (S += p - E, E < $) {
                        for ($ -= E; N[b++] = d[S++], --E; ) ;
                        S = b - V, L = N;
                      }
                    } else if (m < E) {
                      if (S += p + m - E, (E -= m) < $) {
                        for ($ -= E; N[b++] = d[S++], --E; ) ;
                        if (S = 0, m < $) {
                          for ($ -= E = m; N[b++] = d[S++], --E; ) ;
                          S = b - V, L = N;
                        }
                      }
                    } else if (S += m - E, E < $) {
                      for ($ -= E; N[b++] = d[S++], --E; ) ;
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
          } while (u < g && b < y);
          u -= $ = k >> 3, v &= (1 << (k -= $ << 3)) - 1, n.next_in = u, n.next_out = b, n.avail_in = u < g ? g - u + 5 : 5 - (u - g), n.avail_out = b < y ? y - b + 257 : 257 - (b - y), a.hold = v, a.bits = k;
        };
      }, {}], 49: [function(e, o, i) {
        var n = e("../utils/common"), r = e("./adler32"), a = e("./crc32"), u = e("./inffast"), g = e("./inftrees"), b = 1, _ = 2, y = 0, f = -2, p = 1, s = 852, m = 592;
        function d(S) {
          return (S >>> 24 & 255) + (S >>> 8 & 65280) + ((65280 & S) << 8) + ((255 & S) << 24);
        }
        function v() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function k(S) {
          var L;
          return S && S.state ? (L = S.state, S.total_in = S.total_out = L.total = 0, S.msg = "", L.wrap && (S.adler = 1 & L.wrap), L.mode = p, L.last = 0, L.havedict = 0, L.dmax = 32768, L.head = null, L.hold = 0, L.bits = 0, L.lencode = L.lendyn = new n.Buf32(s), L.distcode = L.distdyn = new n.Buf32(m), L.sane = 1, L.back = -1, y) : f;
        }
        function I(S) {
          var L;
          return S && S.state ? ((L = S.state).wsize = 0, L.whave = 0, L.wnext = 0, k(S)) : f;
        }
        function R(S, L) {
          var c, N;
          return S && S.state ? (N = S.state, L < 0 ? (c = 0, L = -L) : (c = 1 + (L >> 4), L < 48 && (L &= 15)), L && (L < 8 || 15 < L) ? f : (N.window !== null && N.wbits !== L && (N.window = null), N.wrap = c, N.wbits = L, I(S))) : f;
        }
        function B(S, L) {
          var c, N;
          return S ? (N = new v(), (S.state = N).window = null, (c = R(S, L)) !== y && (S.state = null), c) : f;
        }
        var O, U, E = !0;
        function $(S) {
          if (E) {
            var L;
            for (O = new n.Buf32(512), U = new n.Buf32(32), L = 0; L < 144; ) S.lens[L++] = 8;
            for (; L < 256; ) S.lens[L++] = 9;
            for (; L < 280; ) S.lens[L++] = 7;
            for (; L < 288; ) S.lens[L++] = 8;
            for (g(b, S.lens, 0, 288, O, 0, S.work, { bits: 9 }), L = 0; L < 32; ) S.lens[L++] = 5;
            g(_, S.lens, 0, 32, U, 0, S.work, { bits: 5 }), E = !1;
          }
          S.lencode = O, S.lenbits = 9, S.distcode = U, S.distbits = 5;
        }
        function V(S, L, c, N) {
          var lt, X = S.state;
          return X.window === null && (X.wsize = 1 << X.wbits, X.wnext = 0, X.whave = 0, X.window = new n.Buf8(X.wsize)), N >= X.wsize ? (n.arraySet(X.window, L, c - X.wsize, X.wsize, 0), X.wnext = 0, X.whave = X.wsize) : (N < (lt = X.wsize - X.wnext) && (lt = N), n.arraySet(X.window, L, c - N, lt, X.wnext), (N -= lt) ? (n.arraySet(X.window, L, c - N, N, 0), X.wnext = N, X.whave = X.wsize) : (X.wnext += lt, X.wnext === X.wsize && (X.wnext = 0), X.whave < X.wsize && (X.whave += lt))), 0;
        }
        i.inflateReset = I, i.inflateReset2 = R, i.inflateResetKeep = k, i.inflateInit = function(S) {
          return B(S, 15);
        }, i.inflateInit2 = B, i.inflate = function(S, L) {
          var c, N, lt, X, et, Y, ot, P, T, at, J, H, ft, kt, ct, ht, bt, pt, Rt, Ct, l, D, F, w, x = 0, A = new n.Buf8(4), j = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!S || !S.state || !S.output || !S.input && S.avail_in !== 0) return f;
          (c = S.state).mode === 12 && (c.mode = 13), et = S.next_out, lt = S.output, ot = S.avail_out, X = S.next_in, N = S.input, Y = S.avail_in, P = c.hold, T = c.bits, at = Y, J = ot, D = y;
          t: for (; ; ) switch (c.mode) {
            case p:
              if (c.wrap === 0) {
                c.mode = 13;
                break;
              }
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if (2 & c.wrap && P === 35615) {
                A[c.check = 0] = 255 & P, A[1] = P >>> 8 & 255, c.check = a(c.check, A, 2, 0), T = P = 0, c.mode = 2;
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
              if (T -= 4, l = 8 + (15 & (P >>>= 4)), c.wbits === 0) c.wbits = l;
              else if (l > c.wbits) {
                S.msg = "invalid window size", c.mode = 30;
                break;
              }
              c.dmax = 1 << l, S.adler = c.check = 1, c.mode = 512 & P ? 10 : 12, T = P = 0;
              break;
            case 2:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if (c.flags = P, (255 & c.flags) != 8) {
                S.msg = "unknown compression method", c.mode = 30;
                break;
              }
              if (57344 & c.flags) {
                S.msg = "unknown header flags set", c.mode = 30;
                break;
              }
              c.head && (c.head.text = P >> 8 & 1), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = a(c.check, A, 2, 0)), T = P = 0, c.mode = 3;
            case 3:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              c.head && (c.head.time = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, A[2] = P >>> 16 & 255, A[3] = P >>> 24 & 255, c.check = a(c.check, A, 4, 0)), T = P = 0, c.mode = 4;
            case 4:
              for (; T < 16; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              c.head && (c.head.xflags = 255 & P, c.head.os = P >> 8), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = a(c.check, A, 2, 0)), T = P = 0, c.mode = 5;
            case 5:
              if (1024 & c.flags) {
                for (; T < 16; ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                c.length = P, c.head && (c.head.extra_len = P), 512 & c.flags && (A[0] = 255 & P, A[1] = P >>> 8 & 255, c.check = a(c.check, A, 2, 0)), T = P = 0;
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
                  Y--, P += N[X++] << T, T += 8;
                }
                if (P !== (65535 & c.check)) {
                  S.msg = "header crc mismatch", c.mode = 30;
                  break;
                }
                T = P = 0;
              }
              c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), S.adler = c.check = 0, c.mode = 12;
              break;
            case 10:
              for (; T < 32; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              S.adler = c.check = d(P), T = P = 0, c.mode = 11;
            case 11:
              if (c.havedict === 0) return S.next_out = et, S.avail_out = ot, S.next_in = X, S.avail_in = Y, c.hold = P, c.bits = T, 2;
              S.adler = c.check = 1, c.mode = 12;
            case 12:
              if (L === 5 || L === 6) break t;
            case 13:
              if (c.last) {
                P >>>= 7 & T, T -= 7 & T, c.mode = 27;
                break;
              }
              for (; T < 3; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              switch (c.last = 1 & P, T -= 1, 3 & (P >>>= 1)) {
                case 0:
                  c.mode = 14;
                  break;
                case 1:
                  if ($(c), c.mode = 20, L !== 6) break;
                  P >>>= 2, T -= 2;
                  break t;
                case 2:
                  c.mode = 17;
                  break;
                case 3:
                  S.msg = "invalid block type", c.mode = 30;
              }
              P >>>= 2, T -= 2;
              break;
            case 14:
              for (P >>>= 7 & T, T -= 7 & T; T < 32; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if ((65535 & P) != (P >>> 16 ^ 65535)) {
                S.msg = "invalid stored block lengths", c.mode = 30;
                break;
              }
              if (c.length = 65535 & P, T = P = 0, c.mode = 15, L === 6) break t;
            case 15:
              c.mode = 16;
            case 16:
              if (H = c.length) {
                if (Y < H && (H = Y), ot < H && (H = ot), H === 0) break t;
                n.arraySet(lt, N, X, H, et), Y -= H, X += H, ot -= H, et += H, c.length -= H;
                break;
              }
              c.mode = 12;
              break;
            case 17:
              for (; T < 14; ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if (c.nlen = 257 + (31 & P), P >>>= 5, T -= 5, c.ndist = 1 + (31 & P), P >>>= 5, T -= 5, c.ncode = 4 + (15 & P), P >>>= 4, T -= 4, 286 < c.nlen || 30 < c.ndist) {
                S.msg = "too many length or distance symbols", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 18;
            case 18:
              for (; c.have < c.ncode; ) {
                for (; T < 3; ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                c.lens[j[c.have++]] = 7 & P, P >>>= 3, T -= 3;
              }
              for (; c.have < 19; ) c.lens[j[c.have++]] = 0;
              if (c.lencode = c.lendyn, c.lenbits = 7, F = { bits: c.lenbits }, D = g(0, c.lens, 0, 19, c.lencode, 0, c.work, F), c.lenbits = F.bits, D) {
                S.msg = "invalid code lengths set", c.mode = 30;
                break;
              }
              c.have = 0, c.mode = 19;
            case 19:
              for (; c.have < c.nlen + c.ndist; ) {
                for (; ht = (x = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                if (bt < 16) P >>>= ct, T -= ct, c.lens[c.have++] = bt;
                else {
                  if (bt === 16) {
                    for (w = ct + 2; T < w; ) {
                      if (Y === 0) break t;
                      Y--, P += N[X++] << T, T += 8;
                    }
                    if (P >>>= ct, T -= ct, c.have === 0) {
                      S.msg = "invalid bit length repeat", c.mode = 30;
                      break;
                    }
                    l = c.lens[c.have - 1], H = 3 + (3 & P), P >>>= 2, T -= 2;
                  } else if (bt === 17) {
                    for (w = ct + 3; T < w; ) {
                      if (Y === 0) break t;
                      Y--, P += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 3 + (7 & (P >>>= ct)), P >>>= 3, T -= 3;
                  } else {
                    for (w = ct + 7; T < w; ) {
                      if (Y === 0) break t;
                      Y--, P += N[X++] << T, T += 8;
                    }
                    T -= ct, l = 0, H = 11 + (127 & (P >>>= ct)), P >>>= 7, T -= 7;
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
              if (6 <= Y && 258 <= ot) {
                S.next_out = et, S.avail_out = ot, S.next_in = X, S.avail_in = Y, c.hold = P, c.bits = T, u(S, J), et = S.next_out, lt = S.output, ot = S.avail_out, X = S.next_in, N = S.input, Y = S.avail_in, P = c.hold, T = c.bits, c.mode === 12 && (c.back = -1);
                break;
              }
              for (c.back = 0; ht = (x = c.lencode[P & (1 << c.lenbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if (ht && (240 & ht) == 0) {
                for (pt = ct, Rt = ht, Ct = bt; ht = (x = c.lencode[Ct + ((P & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & x, !(pt + (ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                P >>>= pt, T -= pt, c.back += pt;
              }
              if (P >>>= ct, T -= ct, c.back += ct, c.length = bt, ht === 0) {
                c.mode = 26;
                break;
              }
              if (32 & ht) {
                c.back = -1, c.mode = 12;
                break;
              }
              if (64 & ht) {
                S.msg = "invalid literal/length code", c.mode = 30;
                break;
              }
              c.extra = 15 & ht, c.mode = 22;
            case 22:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                c.length += P & (1 << c.extra) - 1, P >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              c.was = c.length, c.mode = 23;
            case 23:
              for (; ht = (x = c.distcode[P & (1 << c.distbits) - 1]) >>> 16 & 255, bt = 65535 & x, !((ct = x >>> 24) <= T); ) {
                if (Y === 0) break t;
                Y--, P += N[X++] << T, T += 8;
              }
              if ((240 & ht) == 0) {
                for (pt = ct, Rt = ht, Ct = bt; ht = (x = c.distcode[Ct + ((P & (1 << pt + Rt) - 1) >> pt)]) >>> 16 & 255, bt = 65535 & x, !(pt + (ct = x >>> 24) <= T); ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                P >>>= pt, T -= pt, c.back += pt;
              }
              if (P >>>= ct, T -= ct, c.back += ct, 64 & ht) {
                S.msg = "invalid distance code", c.mode = 30;
                break;
              }
              c.offset = bt, c.extra = 15 & ht, c.mode = 24;
            case 24:
              if (c.extra) {
                for (w = c.extra; T < w; ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                c.offset += P & (1 << c.extra) - 1, P >>>= c.extra, T -= c.extra, c.back += c.extra;
              }
              if (c.offset > c.dmax) {
                S.msg = "invalid distance too far back", c.mode = 30;
                break;
              }
              c.mode = 25;
            case 25:
              if (ot === 0) break t;
              if (H = J - ot, c.offset > H) {
                if ((H = c.offset - H) > c.whave && c.sane) {
                  S.msg = "invalid distance too far back", c.mode = 30;
                  break;
                }
                ft = H > c.wnext ? (H -= c.wnext, c.wsize - H) : c.wnext - H, H > c.length && (H = c.length), kt = c.window;
              } else kt = lt, ft = et - c.offset, H = c.length;
              for (ot < H && (H = ot), ot -= H, c.length -= H; lt[et++] = kt[ft++], --H; ) ;
              c.length === 0 && (c.mode = 21);
              break;
            case 26:
              if (ot === 0) break t;
              lt[et++] = c.length, ot--, c.mode = 21;
              break;
            case 27:
              if (c.wrap) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, P |= N[X++] << T, T += 8;
                }
                if (J -= ot, S.total_out += J, c.total += J, J && (S.adler = c.check = c.flags ? a(c.check, lt, J, et - J) : r(c.check, lt, J, et - J)), J = ot, (c.flags ? P : d(P)) !== c.check) {
                  S.msg = "incorrect data check", c.mode = 30;
                  break;
                }
                T = P = 0;
              }
              c.mode = 28;
            case 28:
              if (c.wrap && c.flags) {
                for (; T < 32; ) {
                  if (Y === 0) break t;
                  Y--, P += N[X++] << T, T += 8;
                }
                if (P !== (4294967295 & c.total)) {
                  S.msg = "incorrect length check", c.mode = 30;
                  break;
                }
                T = P = 0;
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
          return S.next_out = et, S.avail_out = ot, S.next_in = X, S.avail_in = Y, c.hold = P, c.bits = T, (c.wsize || J !== S.avail_out && c.mode < 30 && (c.mode < 27 || L !== 4)) && V(S, S.output, S.next_out, J - S.avail_out) ? (c.mode = 31, -4) : (at -= S.avail_in, J -= S.avail_out, S.total_in += at, S.total_out += J, c.total += J, c.wrap && J && (S.adler = c.check = c.flags ? a(c.check, lt, J, S.next_out - J) : r(c.check, lt, J, S.next_out - J)), S.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === 12 ? 128 : 0) + (c.mode === 20 || c.mode === 15 ? 256 : 0), (at == 0 && J === 0 || L === 4) && D === y && (D = -5), D);
        }, i.inflateEnd = function(S) {
          if (!S || !S.state) return f;
          var L = S.state;
          return L.window && (L.window = null), S.state = null, y;
        }, i.inflateGetHeader = function(S, L) {
          var c;
          return S && S.state ? (2 & (c = S.state).wrap) == 0 ? f : ((c.head = L).done = !1, y) : f;
        }, i.inflateSetDictionary = function(S, L) {
          var c, N = L.length;
          return S && S.state ? (c = S.state).wrap !== 0 && c.mode !== 11 ? f : c.mode === 11 && r(1, L, N, 0) !== c.check ? -3 : V(S, L, N, N) ? (c.mode = 31, -4) : (c.havedict = 1, y) : f;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, o, i) {
        var n = e("../utils/common"), r = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], u = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        o.exports = function(b, _, y, f, p, s, m, d) {
          var v, k, I, R, B, O, U, E, $, V = d.bits, S = 0, L = 0, c = 0, N = 0, lt = 0, X = 0, et = 0, Y = 0, ot = 0, P = 0, T = null, at = 0, J = new n.Buf16(16), H = new n.Buf16(16), ft = null, kt = 0;
          for (S = 0; S <= 15; S++) J[S] = 0;
          for (L = 0; L < f; L++) J[_[y + L]]++;
          for (lt = V, N = 15; 1 <= N && J[N] === 0; N--) ;
          if (N < lt && (lt = N), N === 0) return p[s++] = 20971520, p[s++] = 20971520, d.bits = 1, 0;
          for (c = 1; c < N && J[c] === 0; c++) ;
          for (lt < c && (lt = c), S = Y = 1; S <= 15; S++) if (Y <<= 1, (Y -= J[S]) < 0) return -1;
          if (0 < Y && (b === 0 || N !== 1)) return -1;
          for (H[1] = 0, S = 1; S < 15; S++) H[S + 1] = H[S] + J[S];
          for (L = 0; L < f; L++) _[y + L] !== 0 && (m[H[_[y + L]]++] = L);
          if (O = b === 0 ? (T = ft = m, 19) : b === 1 ? (T = r, at -= 257, ft = a, kt -= 257, 256) : (T = u, ft = g, -1), S = c, B = s, et = L = P = 0, I = -1, R = (ot = 1 << (X = lt)) - 1, b === 1 && 852 < ot || b === 2 && 592 < ot) return 1;
          for (; ; ) {
            for (U = S - et, $ = m[L] < O ? (E = 0, m[L]) : m[L] > O ? (E = ft[kt + m[L]], T[at + m[L]]) : (E = 96, 0), v = 1 << S - et, c = k = 1 << X; p[B + (P >> et) + (k -= v)] = U << 24 | E << 16 | $ | 0, k !== 0; ) ;
            for (v = 1 << S - 1; P & v; ) v >>= 1;
            if (v !== 0 ? (P &= v - 1, P += v) : P = 0, L++, --J[S] == 0) {
              if (S === N) break;
              S = _[y + m[L]];
            }
            if (lt < S && (P & R) !== I) {
              for (et === 0 && (et = lt), B += c, Y = 1 << (X = S - et); X + et < N && !((Y -= J[X + et]) <= 0); ) X++, Y <<= 1;
              if (ot += 1 << X, b === 1 && 852 < ot || b === 2 && 592 < ot) return 1;
              p[I = P & R] = lt << 24 | X << 16 | B - s | 0;
            }
          }
          return P !== 0 && (p[B + P] = S - et << 24 | 64 << 16 | 0), d.bits = lt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, o, i) {
        o.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, o, i) {
        var n = e("../utils/common"), r = 0, a = 1;
        function u(x) {
          for (var A = x.length; 0 <= --A; ) x[A] = 0;
        }
        var g = 0, b = 29, _ = 256, y = _ + 1 + b, f = 30, p = 19, s = 2 * y + 1, m = 15, d = 16, v = 7, k = 256, I = 16, R = 17, B = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], U = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], E = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], $ = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], V = new Array(2 * (y + 2));
        u(V);
        var S = new Array(2 * f);
        u(S);
        var L = new Array(512);
        u(L);
        var c = new Array(256);
        u(c);
        var N = new Array(b);
        u(N);
        var lt, X, et, Y = new Array(f);
        function ot(x, A, j, W, C) {
          this.static_tree = x, this.extra_bits = A, this.extra_base = j, this.elems = W, this.max_length = C, this.has_stree = x && x.length;
        }
        function P(x, A) {
          this.dyn_tree = x, this.max_code = 0, this.stat_desc = A;
        }
        function T(x) {
          return x < 256 ? L[x] : L[256 + (x >>> 7)];
        }
        function at(x, A) {
          x.pending_buf[x.pending++] = 255 & A, x.pending_buf[x.pending++] = A >>> 8 & 255;
        }
        function J(x, A, j) {
          x.bi_valid > d - j ? (x.bi_buf |= A << x.bi_valid & 65535, at(x, x.bi_buf), x.bi_buf = A >> d - x.bi_valid, x.bi_valid += j - d) : (x.bi_buf |= A << x.bi_valid & 65535, x.bi_valid += j);
        }
        function H(x, A, j) {
          J(x, j[2 * A], j[2 * A + 1]);
        }
        function ft(x, A) {
          for (var j = 0; j |= 1 & x, x >>>= 1, j <<= 1, 0 < --A; ) ;
          return j >>> 1;
        }
        function kt(x, A, j) {
          var W, C, G = new Array(m + 1), Q = 0;
          for (W = 1; W <= m; W++) G[W] = Q = Q + j[W - 1] << 1;
          for (C = 0; C <= A; C++) {
            var q = x[2 * C + 1];
            q !== 0 && (x[2 * C] = ft(G[q]++, q));
          }
        }
        function ct(x) {
          var A;
          for (A = 0; A < y; A++) x.dyn_ltree[2 * A] = 0;
          for (A = 0; A < f; A++) x.dyn_dtree[2 * A] = 0;
          for (A = 0; A < p; A++) x.bl_tree[2 * A] = 0;
          x.dyn_ltree[2 * k] = 1, x.opt_len = x.static_len = 0, x.last_lit = x.matches = 0;
        }
        function ht(x) {
          8 < x.bi_valid ? at(x, x.bi_buf) : 0 < x.bi_valid && (x.pending_buf[x.pending++] = x.bi_buf), x.bi_buf = 0, x.bi_valid = 0;
        }
        function bt(x, A, j, W) {
          var C = 2 * A, G = 2 * j;
          return x[C] < x[G] || x[C] === x[G] && W[A] <= W[j];
        }
        function pt(x, A, j) {
          for (var W = x.heap[j], C = j << 1; C <= x.heap_len && (C < x.heap_len && bt(A, x.heap[C + 1], x.heap[C], x.depth) && C++, !bt(A, W, x.heap[C], x.depth)); ) x.heap[j] = x.heap[C], j = C, C <<= 1;
          x.heap[j] = W;
        }
        function Rt(x, A, j) {
          var W, C, G, Q, q = 0;
          if (x.last_lit !== 0) for (; W = x.pending_buf[x.d_buf + 2 * q] << 8 | x.pending_buf[x.d_buf + 2 * q + 1], C = x.pending_buf[x.l_buf + q], q++, W === 0 ? H(x, C, A) : (H(x, (G = c[C]) + _ + 1, A), (Q = O[G]) !== 0 && J(x, C -= N[G], Q), H(x, G = T(--W), j), (Q = U[G]) !== 0 && J(x, W -= Y[G], Q)), q < x.last_lit; ) ;
          H(x, k, A);
        }
        function Ct(x, A) {
          var j, W, C, G = A.dyn_tree, Q = A.stat_desc.static_tree, q = A.stat_desc.has_stree, st = A.stat_desc.elems, ut = -1;
          for (x.heap_len = 0, x.heap_max = s, j = 0; j < st; j++) G[2 * j] !== 0 ? (x.heap[++x.heap_len] = ut = j, x.depth[j] = 0) : G[2 * j + 1] = 0;
          for (; x.heap_len < 2; ) G[2 * (C = x.heap[++x.heap_len] = ut < 2 ? ++ut : 0)] = 1, x.depth[C] = 0, x.opt_len--, q && (x.static_len -= Q[2 * C + 1]);
          for (A.max_code = ut, j = x.heap_len >> 1; 1 <= j; j--) pt(x, G, j);
          for (C = st; j = x.heap[1], x.heap[1] = x.heap[x.heap_len--], pt(x, G, 1), W = x.heap[1], x.heap[--x.heap_max] = j, x.heap[--x.heap_max] = W, G[2 * C] = G[2 * j] + G[2 * W], x.depth[C] = (x.depth[j] >= x.depth[W] ? x.depth[j] : x.depth[W]) + 1, G[2 * j + 1] = G[2 * W + 1] = C, x.heap[1] = C++, pt(x, G, 1), 2 <= x.heap_len; ) ;
          x.heap[--x.heap_max] = x.heap[1], (function(dt, Et) {
            var Dt, It, jt, mt, gt, qt, Bt = Et.dyn_tree, M = Et.max_code, z = Et.stat_desc.static_tree, Z = Et.stat_desc.has_stree, K = Et.stat_desc.extra_bits, rt = Et.stat_desc.extra_base, nt = Et.stat_desc.max_length, it = 0;
            for (mt = 0; mt <= m; mt++) dt.bl_count[mt] = 0;
            for (Bt[2 * dt.heap[dt.heap_max] + 1] = 0, Dt = dt.heap_max + 1; Dt < s; Dt++) nt < (mt = Bt[2 * Bt[2 * (It = dt.heap[Dt]) + 1] + 1] + 1) && (mt = nt, it++), Bt[2 * It + 1] = mt, M < It || (dt.bl_count[mt]++, gt = 0, rt <= It && (gt = K[It - rt]), qt = Bt[2 * It], dt.opt_len += qt * (mt + gt), Z && (dt.static_len += qt * (z[2 * It + 1] + gt)));
            if (it !== 0) {
              do {
                for (mt = nt - 1; dt.bl_count[mt] === 0; ) mt--;
                dt.bl_count[mt]--, dt.bl_count[mt + 1] += 2, dt.bl_count[nt]--, it -= 2;
              } while (0 < it);
              for (mt = nt; mt !== 0; mt--) for (It = dt.bl_count[mt]; It !== 0; ) M < (jt = dt.heap[--Dt]) || (Bt[2 * jt + 1] !== mt && (dt.opt_len += (mt - Bt[2 * jt + 1]) * Bt[2 * jt], Bt[2 * jt + 1] = mt), It--);
            }
          })(x, A), kt(G, ut, x.bl_count);
        }
        function l(x, A, j) {
          var W, C, G = -1, Q = A[1], q = 0, st = 7, ut = 4;
          for (Q === 0 && (st = 138, ut = 3), A[2 * (j + 1) + 1] = 65535, W = 0; W <= j; W++) C = Q, Q = A[2 * (W + 1) + 1], ++q < st && C === Q || (q < ut ? x.bl_tree[2 * C] += q : C !== 0 ? (C !== G && x.bl_tree[2 * C]++, x.bl_tree[2 * I]++) : q <= 10 ? x.bl_tree[2 * R]++ : x.bl_tree[2 * B]++, G = C, ut = (q = 0) === Q ? (st = 138, 3) : C === Q ? (st = 6, 3) : (st = 7, 4));
        }
        function D(x, A, j) {
          var W, C, G = -1, Q = A[1], q = 0, st = 7, ut = 4;
          for (Q === 0 && (st = 138, ut = 3), W = 0; W <= j; W++) if (C = Q, Q = A[2 * (W + 1) + 1], !(++q < st && C === Q)) {
            if (q < ut) for (; H(x, C, x.bl_tree), --q != 0; ) ;
            else C !== 0 ? (C !== G && (H(x, C, x.bl_tree), q--), H(x, I, x.bl_tree), J(x, q - 3, 2)) : q <= 10 ? (H(x, R, x.bl_tree), J(x, q - 3, 3)) : (H(x, B, x.bl_tree), J(x, q - 11, 7));
            G = C, ut = (q = 0) === Q ? (st = 138, 3) : C === Q ? (st = 6, 3) : (st = 7, 4);
          }
        }
        u(Y);
        var F = !1;
        function w(x, A, j, W) {
          J(x, (g << 1) + (W ? 1 : 0), 3), (function(C, G, Q, q) {
            ht(C), at(C, Q), at(C, ~Q), n.arraySet(C.pending_buf, C.window, G, Q, C.pending), C.pending += Q;
          })(x, A, j);
        }
        i._tr_init = function(x) {
          F || ((function() {
            var A, j, W, C, G, Q = new Array(m + 1);
            for (C = W = 0; C < b - 1; C++) for (N[C] = W, A = 0; A < 1 << O[C]; A++) c[W++] = C;
            for (c[W - 1] = C, C = G = 0; C < 16; C++) for (Y[C] = G, A = 0; A < 1 << U[C]; A++) L[G++] = C;
            for (G >>= 7; C < f; C++) for (Y[C] = G << 7, A = 0; A < 1 << U[C] - 7; A++) L[256 + G++] = C;
            for (j = 0; j <= m; j++) Q[j] = 0;
            for (A = 0; A <= 143; ) V[2 * A + 1] = 8, A++, Q[8]++;
            for (; A <= 255; ) V[2 * A + 1] = 9, A++, Q[9]++;
            for (; A <= 279; ) V[2 * A + 1] = 7, A++, Q[7]++;
            for (; A <= 287; ) V[2 * A + 1] = 8, A++, Q[8]++;
            for (kt(V, y + 1, Q), A = 0; A < f; A++) S[2 * A + 1] = 5, S[2 * A] = ft(A, 5);
            lt = new ot(V, O, _ + 1, y, m), X = new ot(S, U, 0, f, m), et = new ot(new Array(0), E, 0, p, v);
          })(), F = !0), x.l_desc = new P(x.dyn_ltree, lt), x.d_desc = new P(x.dyn_dtree, X), x.bl_desc = new P(x.bl_tree, et), x.bi_buf = 0, x.bi_valid = 0, ct(x);
        }, i._tr_stored_block = w, i._tr_flush_block = function(x, A, j, W) {
          var C, G, Q = 0;
          0 < x.level ? (x.strm.data_type === 2 && (x.strm.data_type = (function(q) {
            var st, ut = 4093624447;
            for (st = 0; st <= 31; st++, ut >>>= 1) if (1 & ut && q.dyn_ltree[2 * st] !== 0) return r;
            if (q.dyn_ltree[18] !== 0 || q.dyn_ltree[20] !== 0 || q.dyn_ltree[26] !== 0) return a;
            for (st = 32; st < _; st++) if (q.dyn_ltree[2 * st] !== 0) return a;
            return r;
          })(x)), Ct(x, x.l_desc), Ct(x, x.d_desc), Q = (function(q) {
            var st;
            for (l(q, q.dyn_ltree, q.l_desc.max_code), l(q, q.dyn_dtree, q.d_desc.max_code), Ct(q, q.bl_desc), st = p - 1; 3 <= st && q.bl_tree[2 * $[st] + 1] === 0; st--) ;
            return q.opt_len += 3 * (st + 1) + 5 + 5 + 4, st;
          })(x), C = x.opt_len + 3 + 7 >>> 3, (G = x.static_len + 3 + 7 >>> 3) <= C && (C = G)) : C = G = j + 5, j + 4 <= C && A !== -1 ? w(x, A, j, W) : x.strategy === 4 || G === C ? (J(x, 2 + (W ? 1 : 0), 3), Rt(x, V, S)) : (J(x, 4 + (W ? 1 : 0), 3), (function(q, st, ut, dt) {
            var Et;
            for (J(q, st - 257, 5), J(q, ut - 1, 5), J(q, dt - 4, 4), Et = 0; Et < dt; Et++) J(q, q.bl_tree[2 * $[Et] + 1], 3);
            D(q, q.dyn_ltree, st - 1), D(q, q.dyn_dtree, ut - 1);
          })(x, x.l_desc.max_code + 1, x.d_desc.max_code + 1, Q + 1), Rt(x, x.dyn_ltree, x.dyn_dtree)), ct(x), W && ht(x);
        }, i._tr_tally = function(x, A, j) {
          return x.pending_buf[x.d_buf + 2 * x.last_lit] = A >>> 8 & 255, x.pending_buf[x.d_buf + 2 * x.last_lit + 1] = 255 & A, x.pending_buf[x.l_buf + x.last_lit] = 255 & j, x.last_lit++, A === 0 ? x.dyn_ltree[2 * j]++ : (x.matches++, A--, x.dyn_ltree[2 * (c[j] + _ + 1)]++, x.dyn_dtree[2 * T(A)]++), x.last_lit === x.lit_bufsize - 1;
        }, i._tr_align = function(x) {
          J(x, 2, 3), H(x, k, V), (function(A) {
            A.bi_valid === 16 ? (at(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : 8 <= A.bi_valid && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8);
          })(x);
        };
      }, { "../utils/common": 41 }], 53: [function(e, o, i) {
        o.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, o, i) {
        (function(n) {
          (function(r, a) {
            if (!r.setImmediate) {
              var u, g, b, _, y = 1, f = {}, p = !1, s = r.document, m = Object.getPrototypeOf && Object.getPrototypeOf(r);
              m = m && m.setTimeout ? m : r, u = {}.toString.call(r.process) === "[object process]" ? function(I) {
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
              }) : s && "onreadystatechange" in s.createElement("script") ? (g = s.documentElement, function(I) {
                var R = s.createElement("script");
                R.onreadystatechange = function() {
                  v(I), R.onreadystatechange = null, g.removeChild(R), R = null;
                }, g.appendChild(R);
              }) : function(I) {
                setTimeout(v, 0, I);
              }, m.setImmediate = function(I) {
                typeof I != "function" && (I = new Function("" + I));
                for (var R = new Array(arguments.length - 1), B = 0; B < R.length; B++) R[B] = arguments[B + 1];
                var O = { callback: I, args: R };
                return f[y] = O, u(y), y++;
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
                    (function(B) {
                      var O = B.callback, U = B.args;
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
        }).call(this, typeof ae < "u" ? ae : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(ue)), ue.exports;
}
var je = Ue();
const Te = /* @__PURE__ */ De(je);
async function Xe(h) {
  const t = await We(h), e = await Te.loadAsync(t), o = [];
  return e.forEach((i, n) => {
    if (n.dir)
      return;
    const r = Ye(i);
    o.push({
      name: r,
      text: () => n.async("text"),
      arrayBuffer: () => n.async("arraybuffer")
    });
  }), o;
}
async function We(h) {
  if (h instanceof ArrayBuffer)
    return h;
  if (h instanceof Blob)
    return await h.arrayBuffer();
  throw new Error("Unsupported input type for unzipGerbersZip");
}
function Ye(h) {
  let t = h.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Ge(h) {
  return !!h && typeof h == "object" && !(h instanceof ArrayBuffer) && !(h instanceof Uint8Array);
}
function Ze(h) {
  return h instanceof Uint8Array ? h : new Uint8Array(h);
}
function Ve(h) {
  return h.byteOffset === 0 && h.byteLength === h.buffer.byteLength ? h.buffer : h.slice().buffer;
}
function Qt(h, t, e = 0) {
  if (h.length < e + t.length) return !1;
  for (let o = 0; o < t.length; o++)
    if (h[e + o] !== t[o]) return !1;
  return !0;
}
function qe(h) {
  return Qt(h, [80, 75, 3, 4]) || Qt(h, [80, 75, 5, 6]) || Qt(h, [80, 75, 7, 8]) ? "zip" : Qt(h, [82, 97, 114, 33, 26, 7, 0]) || Qt(h, [82, 97, 114, 33, 26, 7, 1, 0]) ? "rar" : Qt(h, [55, 122, 188, 175, 39, 28]) ? "7z" : h.length > 262 && Qt(h, [117, 115, 116, 97, 114], 257) ? "tar" : "unknown";
}
function Pe(h) {
  return h.replace(/\\/g, "/").replace(/^\.?\//, "");
}
function we(h) {
  const t = [], e = h.map((s) => Pe(s).toLowerCase()), o = (s) => e.some(s), i = /\.(gbr|gbl|gtl|gbs|gts|gbo|gto|gko|gm1|gml|pho|art)$/i, n = /\.(drl|xln)$/i, r = e.filter((s) => i.test(s)).length, a = e.filter((s) => n.test(s) || s.includes("drill")).length, u = o((s) => s.includes("top") && s.includes("copper") || s.endsWith(".gtl")), g = o((s) => s.includes("bot") || s.includes("bottom") || s.endsWith(".gbl")), b = o((s) => s.includes("mask") || s.includes("solder") || s.endsWith(".gts") || s.endsWith(".gbs")), _ = o((s) => s.includes("silk") || s.includes("legend") || s.endsWith(".gto") || s.endsWith(".gbo")), y = o((s) => s.includes("outline") || s.includes("profile") || s.includes("edge") || s.endsWith(".gko") || s.endsWith(".gm1") || s.endsWith(".gml")), f = e.every(
    (s) => s.endsWith(".pdf") || s.endsWith(".png") || s.endsWith(".jpg") || s.endsWith(".jpeg") || s.endsWith(".svg") || s.endsWith(".txt") || s.endsWith(".md")
  );
  let p = 0;
  return h.length === 0 ? (t.push("No files found."), { confidence: 0, reasons: t }) : f ? (t.push("Bundle only contains documents/images (no Gerber-like files)."), { confidence: 0.05, reasons: t }) : (r > 0 ? (p += 0.35, t.push(`Found ${r} Gerber-like file(s) by extension.`)) : t.push("No common Gerber extensions detected."), a > 0 && (p += 0.2, t.push(`Found ${a} drill-like file(s).`)), y && (p += 0.15, t.push("Found outline/profile/edge candidate.")), u && g ? (p += 0.2, t.push("Found both top and bottom copper candidates.")) : (u || g) && (p += 0.1, t.push("Found at least one copper candidate.")), b && (p += 0.05, t.push("Found solder mask candidate.")), _ && (p += 0.05, t.push("Found silkscreen/legend candidate.")), p = Math.max(0, Math.min(1, p)), p < 0.6 && r >= 2 && (p = Math.max(p, 0.55), t.push("Multiple Gerber-like files found, but layer completeness is unclear.")), { confidence: p, reasons: t });
}
async function He(h) {
  if (Ge(h)) {
    const n = Object.keys(h).map(Pe), { confidence: r, reasons: a } = we(n);
    return {
      isGerber: r >= 0.6,
      archiveType: "directory",
      confidence: r,
      reasons: a,
      files: n
    };
  }
  const t = Ze(h), e = qe(t);
  if (e === "zip")
    try {
      const n = Ve(t), a = (await Xe(n)).map((b) => b.name), { confidence: u, reasons: g } = we(a);
      return {
        isGerber: u >= 0.6,
        archiveType: "zip",
        confidence: u,
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
  const o = new TextDecoder("utf-8", { fatal: !1 }).decode(t.slice(0, 4096));
  return o.includes("%FSLAX") || o.includes("%MOIN") || o.includes("%MOMM") || o.includes("G04") || o.includes("%ADD") ? {
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
  constructor(t, e, o) {
    super(e), this.name = "GerberError", this.code = t, this.details = o;
  }
}
function Be(h) {
  let t = h.replace(/\\/g, "/");
  return t.startsWith("./") && (t = t.slice(2)), t.startsWith("/") && (t = t.slice(1)), t;
}
function Ke(h) {
  return h instanceof Uint8Array ? h : new Uint8Array(h);
}
function Oe(h) {
  try {
    return h.slice().buffer;
  } catch {
    const t = new Uint8Array(h.byteLength);
    return t.set(h), t.buffer;
  }
}
async function Je(h) {
  let t;
  try {
    t = await Te.loadAsync(Oe(h));
  } catch (a) {
    throw new Mt(
      "NOT_AN_ARCHIVE",
      "Failed to parse ZIP archive",
      a
    );
  }
  const e = {}, o = 1e3, i = 100 * 1024 * 1024, n = Object.entries(t.files).filter(([, a]) => a && !a.dir);
  if (n.length > o)
    throw new Mt(
      "PARSE_ERROR",
      `ZIP contains too many files (${n.length} > ${o})`
    );
  let r = 0;
  for (const [a, u] of n)
    try {
      const g = Be(a), b = await u.async("arraybuffer");
      if (r += b.byteLength, r > i)
        throw new Mt(
          "PARSE_ERROR",
          `ZIP exceeds max extracted size (${i} bytes)`
        );
      e[g] = new Uint8Array(b);
    } catch (g) {
      if (g instanceof Mt) throw g;
      console.warn(`Failed to extract file ${a}:`, g);
    }
  if (Object.keys(e).length === 0)
    throw new Mt("PARSE_ERROR", "No files extracted from ZIP archive");
  return e;
}
async function Qe(h, t) {
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
  let o;
  try {
    const _ = new Blob([Oe(h)], { type: "application/octet-stream" });
    o = await e.open(_);
  } catch (_) {
    throw new Mt("NOT_AN_ARCHIVE", "Failed to open RAR archive", _);
  }
  let i;
  try {
    i = await Promise.race([
      o.extractFiles(),
      new Promise(
        (_, y) => setTimeout(() => y(new Error("Extraction timed out")), 3e4)
      )
    ]);
  } catch (_) {
    throw new Mt("PARSE_ERROR", "Failed to extract RAR archive", _);
  }
  const n = {};
  let r = 0;
  const a = 1e3, u = 100 * 1024 * 1024;
  let g = 0;
  async function b(_, y) {
    if (r >= a)
      throw new Mt(
        "PARSE_ERROR",
        `Archive contains too many files (max ${a})`
      );
    for (const f of Object.keys(_)) {
      const p = _[f], s = y ? `${y}/${f}` : f;
      if (p instanceof File || p instanceof Blob) {
        r++;
        try {
          const m = await p.arrayBuffer();
          if (g += m.byteLength, g > u)
            throw new Mt(
              "PARSE_ERROR",
              `Total extracted size exceeds limit (${u} bytes)`
            );
          n[Be(s)] = new Uint8Array(m);
        } catch (m) {
          if (m instanceof Mt) throw m;
          console.warn(`Failed to extract file ${s}:`, m);
        }
      } else p && typeof p == "object" && await b(p, s);
    }
  }
  try {
    await b(i, "");
  } finally {
    if (o && typeof o.close == "function")
      try {
        await o.close();
      } catch (_) {
        console.warn("Failed to close archive:", _);
      }
  }
  if (Object.keys(n).length === 0)
    throw new Mt("PARSE_ERROR", "No files extracted from RAR archive");
  return n;
}
async function de(h, t) {
  if (!h || h.byteLength === 0)
    throw new Mt("NOT_AN_ARCHIVE", "Input is empty");
  const e = Ke(h), o = 100 * 1024 * 1024;
  if (e.length > o)
    throw new Mt(
      "PARSE_ERROR",
      `Input size (${e.length} bytes) exceeds maximum allowed size (${o} bytes)`
    );
  let i;
  try {
    i = await He(e);
  } catch (n) {
    throw new Mt("PARSE_ERROR", "Failed to detect archive type", n);
  }
  if (!i.isGerber && i.archiveType !== "rar")
    throw new Mt(
      "NOT_GERBER",
      i.reasons.join("; ") || "Not a Gerber bundle",
      i
    );
  try {
    if (i.archiveType === "zip")
      return { archiveType: "zip", files: await Je(e) };
    if (i.archiveType === "rar")
      return { archiveType: "rar", files: await Qe(e, t) };
    if (i.archiveType === "single-file")
      return { archiveType: "single-file", files: { "layer.gtl": e } };
    throw new Mt(
      "UNSUPPORTED_ARCHIVE",
      `Unsupported archive type: ${i.archiveType}`,
      i
    );
  } catch (n) {
    throw n instanceof Mt ? n : new Mt(
      "PARSE_ERROR",
      n instanceof Error ? n.message : "Unknown error during extraction",
      { error: n, det: i }
    );
  }
}
function ee(h) {
  return h.toLowerCase();
}
function Vt(h, t) {
  const e = new Set(t.map((i) => i.toLowerCase()));
  return h.filter((i) => {
    const n = ee(i), r = n.lastIndexOf(".");
    return r < 0 ? !1 : e.has(n.slice(r));
  }).sort((i, n) => i.length - n.length)[0];
}
function wt(h, t) {
  const e = t.map((i) => i.toLowerCase());
  return h.filter((i) => {
    const n = ee(i);
    return e.every((r) => n.includes(r));
  }).sort((i, n) => i.length - n.length)[0];
}
function tr(h, t, e) {
  const o = new Set([t, e].filter(Boolean)), i = [];
  for (const n of h) {
    if (o.has(n)) continue;
    const r = ee(n), a = r.split("/").pop() || r, u = a.lastIndexOf("."), g = u >= 0 ? a.slice(u) : "";
    let b = /in(\d+)_cu/.exec(a);
    if (b) {
      i.push({ path: n, num: parseInt(b[1], 10) });
      continue;
    }
    if (b = /(?:inner|signal|layer)[ _-]?(\d+)/.exec(a), b) {
      i.push({ path: n, num: parseInt(b[1], 10) });
      continue;
    }
    if (b = /^\.gl?(\d+)$/.exec(g), b) {
      const _ = parseInt(b[1], 10);
      !Number.isNaN(_) && _ >= 2 && i.push({ path: n, num: _ });
      continue;
    }
  }
  return i.sort((n, r) => n.num - r.num), i;
}
function er(h, t, e) {
  const o = new Set([t, e].filter(Boolean)), i = [];
  for (const n of h) {
    if (o.has(n)) continue;
    const r = ee(n), a = r.split("/").pop() || r, u = a.lastIndexOf("."), g = u >= 0 ? a.slice(u) : "";
    if (/in\d+_cu/.test(a)) {
      i.push(n);
      continue;
    }
    if (/^\.gl?\d+$/.test(g)) {
      const b = parseInt(g.replace(/^\.gl?/, ""), 10);
      if (!Number.isNaN(b) && b >= 2) {
        i.push(n);
        continue;
      }
    }
  }
  return i.sort(), i;
}
function rr(h) {
  const t = [], e = (o) => ee(o);
  for (const o of h) {
    const i = e(o), n = i.split("/").pop() || i, r = n.slice(n.lastIndexOf("."));
    if (r === ".drl" || r === ".xln" || r === ".exc" || r === ".ncd") {
      t.push(o);
      continue;
    }
    if (r === ".txt" && (n.includes("hole") || n.includes("drill") || n.includes("npth") || n.includes("-pth"))) {
      t.push(o);
      continue;
    }
    if ((n.includes("drill") || n.includes("npth") || n.includes("-pth")) && (r === ".gbr" || r === ".ger" || r === ".txt" || r === "")) {
      t.push(o);
      continue;
    }
  }
  return t;
}
function nr(h) {
  const t = h.filter((_) => {
    const y = ee(_);
    return !(y.endsWith("/") || y.includes("__macosx") || y.endsWith(".ds_store"));
  }), e = Vt(t, [".gtl"]) || wt(t, ["f_cu"]) || wt(t, ["top", "cu"]) || wt(t, ["top", "copper"]), o = Vt(t, [".gbl"]) || wt(t, ["b_cu"]) || wt(t, ["bottom", "cu"]) || wt(t, ["bottom", "copper"]), i = Vt(t, [".gts"]) || wt(t, ["f_mask"]) || wt(t, ["top", "mask"]), n = Vt(t, [".gbs"]) || wt(t, ["b_mask"]) || wt(t, ["bottom", "mask"]), r = Vt(t, [".gto"]) || wt(t, ["f_silks"]) || wt(t, ["f_silk"]) || wt(t, ["top", "silk"]), a = Vt(t, [".gbo"]) || wt(t, ["b_silks"]) || wt(t, ["b_silk"]) || wt(t, ["bottom", "silk"]), u = Vt(t, [".gko", ".gm1"]) || wt(t, ["edge", "cuts"]) || wt(t, ["outline"]) || wt(t, ["board", "outline"]), g = rr(t), b = er(t, e, o);
  return {
    top_copper: e,
    bottom_copper: o,
    top_mask: i,
    bottom_mask: n,
    top_silk: r,
    bottom_silk: a,
    outline: u,
    drills: g.length ? g : void 0,
    inner_copper: b.length ? b : void 0
  };
}
function ir(h) {
  const t = h.filter((a) => {
    const u = ee(a);
    return !(u.endsWith("/") || u.includes("__macosx") || u.endsWith(".ds_store"));
  }), e = nr(t), o = Vt(t, [".gtp"]) || wt(t, ["f_paste"]) || wt(t, ["top", "paste"]), i = Vt(t, [".gbp"]) || wt(t, ["b_paste"]) || wt(t, ["bottom", "paste"]), n = tr(t, e.top_copper, e.bottom_copper), r = [];
  e.top_copper && r.push({ path: e.top_copper, role: "top", index: 0 });
  for (const a of n) r.push({ path: a.path, role: "inner", index: 0, detectedNum: a.num });
  return e.bottom_copper && r.push({ path: e.bottom_copper, role: "bottom", index: 0 }), r.forEach((a, u) => {
    a.index = u;
  }), {
    copper: r,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    top_paste: o,
    bottom_paste: i,
    outline: e.outline,
    drills: e.drills
  };
}
const sr = 0.8;
function Yt(h, t, e) {
  const o = {
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
  }, i = t.split(/\r?\n/);
  for (const n of i) {
    let r = n.trim();
    if (r && !r.startsWith("G04")) {
      if (r.startsWith("%") && r.endsWith("%")) {
        or(r, o);
        continue;
      }
      r.endsWith("*") && (r = r.slice(0, -1)), ar(r, o);
    }
  }
  if (o.inRegion) {
    if (o.currentPath.length >= 3 && o.regionPaths.push(o.currentPath), o.regionPaths.length > 0) {
      const n = {
        loops: o.regionPaths,
        polarity: o.currentPolarity
      };
      o.regions.push(n), o.ops.push({
        kind: "region",
        polarity: o.currentPolarity,
        loops: o.regionPaths
      });
    }
    o.inRegion = !1, o.regionPaths = [], o.currentPath = [];
  }
  return {
    tracks: o.tracks,
    arcs: o.arcs,
    flashes: o.flashes,
    regions: o.regions,
    ops: o.ops
  };
}
function or(h, t) {
  let e = h;
  if (e.startsWith("%") && (e = e.slice(1)), e.endsWith("%") && (e = e.slice(0, -1)), e.endsWith("*") && (e = e.slice(0, -1)), e.startsWith("FS")) {
    const o = /FS..X(\d)(\d)Y(\d)(\d)/.exec(e);
    if (o) {
      const i = parseInt(o[1], 10), n = parseInt(o[2], 10);
      parseInt(o[4], 10), t.fmtInt = i, t.fmtDec = n;
    }
    return;
  }
  if (e.startsWith("MO")) {
    const o = t.unitScale;
    let i = o;
    if (e.includes("MOMM") ? i = 1 : e.includes("MOIN") && (i = 25.4), i !== o) {
      const n = i / o;
      for (const r of t.apertures.values())
        r.diameterMm !== void 0 && (r.diameterMm *= n), r.widthMm !== void 0 && (r.widthMm *= n), r.heightMm !== void 0 && (r.heightMm *= n);
      t.unitScale = i;
    }
    return;
  }
  if (e.startsWith("AD")) {
    const o = /AD(D?)(\d+)([A-Za-z_.$][A-Za-z0-9_.$]*),?([0-9.Xx]*)/.exec(e);
    if (!o) return;
    const i = parseInt(o[2], 10), n = o[3], r = o[4] ?? "";
    let a, u, g, b, _;
    if (r) {
      const f = r.split(/[Xx]/).filter(Boolean), p = f[0] ? parseFloat(f[0]) * t.unitScale : void 0, s = f[1] ? parseFloat(f[1]) * t.unitScale : void 0, m = f[2] ? parseFloat(f[2]) * t.unitScale : void 0, d = f[3] ? parseFloat(f[3]) : void 0;
      d !== void 0 && !Number.isNaN(d) && d !== 0 && (_ = d), n === "C" ? a = p : n === "R" || n === "O" ? (u = p, g = s, a = p !== void 0 && s !== void 0 ? Math.min(p, s) : p ?? s) : (u = p, g = s, m !== void 0 && (b = m), a = p !== void 0 && s !== void 0 ? Math.min(p, s) : p ?? s);
    }
    const y = {
      code: i,
      shape: n,
      diameterMm: a,
      widthMm: u,
      heightMm: g,
      cornerMm: b,
      rotationDeg: _
    };
    t.apertures.set(i, y);
    return;
  }
  if (e.startsWith("LR")) {
    const o = /LR([+-]?[\d.]+)/.exec(e);
    o && (t.loadRotationDeg = parseFloat(o[1]) || 0);
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
function ke(h, t, e, o, i) {
  const n = h.x + e, r = h.y + o, a = Math.sqrt(e * e + o * o);
  if (a < 1e-6) return [t];
  const u = Math.atan2(h.y - r, h.x - n), g = Math.atan2(t.y - r, t.x - n), _ = (t.x - h.x) ** 2 + (t.y - h.y) ** 2 < (a * 1e-3) ** 2;
  let y;
  _ ? y = i ? -2 * Math.PI : 2 * Math.PI : (y = g - u, i ? y > 1e-6 && (y -= 2 * Math.PI) : y < -1e-6 && (y += 2 * Math.PI));
  const f = Math.min(64, Math.max(4, Math.ceil(Math.abs(y) / (Math.PI / 16)))), p = [];
  for (let s = 1; s <= f; s++) {
    const m = u + y * s / f;
    p.push({ x: n + a * Math.cos(m), y: r + a * Math.sin(m) });
  }
  return p;
}
function ar(h, t) {
  if (h === "G36") {
    t.inRegion = !0, t.regionPaths = [], t.currentPath = [];
    return;
  }
  if (h === "G74" || h === "G75") return;
  const e = /^G0?([123])(?!\d)/.exec(h);
  if (e && (t.arcMode = parseInt(e[1], 10), h = h.slice(e[0].length).trim(), !h))
    return;
  if (h === "G37") {
    if (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.inRegion = !1, t.regionPaths.length > 0) {
      const s = {
        loops: t.regionPaths,
        polarity: t.currentPolarity
      };
      t.regions.push(s), t.ops.push({
        kind: "region",
        polarity: t.currentPolarity,
        loops: t.regionPaths
      });
    }
    t.regionPaths = [], t.currentPath = [];
    return;
  }
  let o = null;
  const i = /D0?(\d{1,3})$/.exec(h);
  if (i && (o = parseInt(i[1], 10), h = h.slice(0, h.length - i[0].length)), o !== null && o >= 10) {
    const s = t.apertures.get(o);
    s && (t.currentAperture = s);
    return;
  }
  const n = /X([+\-]?\d+)/.exec(h), r = /Y([+\-]?\d+)/.exec(h), a = /I([+\-]?\d+)/.exec(h), u = /J([+\-]?\d+)/.exec(h);
  let g = t.x, b = t.y;
  n && (g = ce(n[1], t)), r && (b = ce(r[1], t));
  const _ = a ? ce(a[1], t) : 0, y = u ? ce(u[1], t) : 0;
  if (o === null) {
    t.x = g, t.y = b;
    return;
  }
  if (t.inRegion) {
    const s = t.x, m = t.y;
    if (o === 1)
      if (t.currentPath.length === 0 && t.currentPath.push({ x: s, y: m }), t.arcMode !== 1 && (_ !== 0 || y !== 0)) {
        const d = ke({ x: s, y: m }, { x: g, y: b }, _, y, t.arcMode === 2);
        for (const v of d) t.currentPath.push(v);
      } else
        t.currentPath.push({ x: g, y: b });
    else o === 2 && (t.currentPath.length >= 3 && t.regionPaths.push(t.currentPath), t.currentPath = []);
    t.x = g, t.y = b;
    return;
  }
  const f = t.x, p = t.y;
  if (o === 1) {
    if (!t.currentAperture) {
      t.x = g, t.y = b;
      return;
    }
    const s = t.currentAperture.diameterMm !== void 0 ? t.currentAperture.diameterMm : 0.2;
    if (t.arcMode !== 1 && (_ !== 0 || y !== 0)) {
      const m = ke({ x: f, y: p }, { x: g, y: b }, _, y, t.arcMode === 2);
      let d = { x: f, y: p };
      for (const v of m)
        t.tracks.push({ start: d, end: v, width: s, polarity: t.currentPolarity }), t.ops.push({ kind: "track", polarity: t.currentPolarity, start: d, end: v, widthMm: s }), d = v;
    } else
      t.tracks.push({
        start: { x: f, y: p },
        end: { x: g, y: b },
        width: s,
        polarity: t.currentPolarity
      }), t.ops.push({
        kind: "track",
        polarity: t.currentPolarity,
        start: { x: f, y: p },
        end: { x: g, y: b },
        widthMm: s
      });
    t.x = g, t.y = b;
    return;
  }
  if (o === 2) {
    t.x = g, t.y = b;
    return;
  }
  if (o === 3) {
    if (t.currentAperture) {
      const s = t.currentAperture, m = s.diameterMm !== void 0 ? s.diameterMm : sr, d = (s.rotationDeg ?? 0) + t.loadRotationDeg, v = d !== 0 ? d : void 0, k = {
        position: { x: g, y: b },
        diameterMm: m,
        shape: s.shape,
        polarity: t.currentPolarity,
        rotationDeg: v
      };
      s.widthMm !== void 0 && (k.widthMm = s.widthMm), s.heightMm !== void 0 && (k.heightMm = s.heightMm), s.cornerMm !== void 0 && (k.cornerMm = s.cornerMm), t.flashes.push(k), t.ops.push({
        kind: "flash",
        polarity: t.currentPolarity,
        position: { x: g, y: b },
        diameterMm: m,
        shape: s.shape,
        widthMm: s.widthMm,
        heightMm: s.heightMm,
        cornerMm: s.cornerMm,
        rotationDeg: v
      });
    }
    t.x = g, t.y = b;
    return;
  }
}
function ce(h, t) {
  const e = h.startsWith("-") ? -1 : 1, o = h.replace(/[+\-]/g, ""), i = parseInt(o, 10);
  if (Number.isNaN(i)) return 0;
  const n = Math.pow(10, t.fmtDec), r = i / n * t.unitScale;
  return e * r;
}
function fe(h, t) {
  return /^0+$/.test(h) && /^0+$/.test(t) ? { fmtInt: h.length, fmtDec: t.length } : { fmtInt: parseInt(h, 10), fmtDec: parseInt(t, 10) };
}
function lr(h, t) {
  const e = t.split(/\r?\n/), o = /* @__PURE__ */ new Map();
  let i = null;
  const n = [], r = [];
  let a = 1, u = 2, g = 4, b = !1, _ = !1, y = null, f = !1, p = 0, s = 0, m = 5;
  const d = (v) => {
    if (v.includes(".")) return parseFloat(v) * a;
    const k = v.startsWith("-") ? -1 : 1;
    let I = v.replace(/[+\-]/, "");
    y === "LZ" && (I = I.padEnd(u + g, "0"));
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
        a = 1, _ || (u = 3, g = 3);
        const $ = /(\d+)\.(\d+)/.exec(k);
        if ($) {
          const V = fe($[1], $[2]);
          u = V.fmtInt, g = V.fmtDec, _ = !0;
        }
      } else if (k.startsWith("INCH")) {
        a = 25.4, _ || (u = 2, g = 4);
        const $ = /(\d+)\.(\d+)/.exec(k);
        if ($) {
          const V = fe($[1], $[2]);
          u = V.fmtInt, g = V.fmtDec, _ = !0;
        }
      }
      const E = /^FMAT,(\d+)\.(\d+)/.exec(k) || /^(\d+)\.(\d+)$/.exec(k);
      if (E) {
        const $ = fe(E[1], E[2]);
        u = $.fmtInt, g = $.fmtDec, _ = !0;
      }
    }
    if (/^T\d+C[\d.]+/i.test(k)) {
      const E = /^T(\d+)C([\d.]+)/i.exec(k);
      if (E) {
        const $ = parseFloat(E[2]) * a;
        Number.isNaN($) || o.set(E[1], $);
      }
      continue;
    }
    if (/^T\d+$/i.test(k)) {
      const E = /^T(\d+)/i.exec(k);
      E && (i = E[1]);
      continue;
    }
    const I = /^G0*([015])(?!\d)/.exec(k);
    if (I && (m = parseInt(I[1], 10)), /^[GRMF]/.test(k) && !/[XY]/i.test(k)) continue;
    const R = i && o.has(i) ? o.get(i) : 0.6, B = /X([+\-]?[\d.]+)Y([+\-]?[\d.]+)G85X([+\-]?[\d.]+)Y([+\-]?[\d.]+)/i.exec(k);
    if (B) {
      const E = d(B[1]), $ = d(B[2]), V = d(B[3]), S = d(B[4]);
      Number.isFinite(E) && Number.isFinite($) && (r.push({ x1: E, y1: $, x2: V, y2: S, diameter: R }), p = V, s = S);
      continue;
    }
    const O = /X([+\-]?[\d.]+)/i.exec(k), U = /Y([+\-]?[\d.]+)/i.exec(k);
    if (O || U) {
      const E = O ? d(O[1]) : p, $ = U ? d(U[1]) : s;
      Number.isFinite(E) && Number.isFinite($) && (m === 0 || (f && m === 1 ? r.push({ x1: p, y1: s, x2: E, y2: $, diameter: R }) : n.push({ x: E, y: $, diameter: R, plated: !0 })), p = E, s = $);
    }
  }
  return { name: h, holes: n, slots: r };
}
function cr(h) {
  return { w: h.maxX - h.minX, h: h.maxY - h.minY };
}
function ne(h) {
  const { w: t, h: e } = cr(h);
  return Number.isFinite(t) && Number.isFinite(e) && t > 1 && e > 1 && t < 2e3 && e < 2e3;
}
function Ut(h, t) {
  if (!Number.isFinite(h) || !Number.isFinite(t) || h <= 0 || t <= 0) return 1;
  const e = h / t;
  return e > 20 && e < 35 ? 1 / 25.4 : e > 0.02 && e < 0.06 ? 25.4 : 1;
}
function Gt(h, t) {
  return t === 1 ? h : {
    ...h,
    tracks: h.tracks.map((e) => ({
      ...e,
      start: { x: e.start.x * t, y: e.start.y * t },
      end: { x: e.end.x * t, y: e.end.y * t },
      width: (e.width ?? 0) * t
    })),
    flashes: h.flashes.map((e) => ({
      ...e,
      position: { x: e.position.x * t, y: e.position.y * t },
      diameterMm: (e.diameterMm ?? 0) * t,
      widthMm: (e.widthMm ?? 0) * t,
      heightMm: (e.heightMm ?? 0) * t
    })),
    regions: h.regions.map((e) => ({
      ...e,
      loops: e.loops.map((o) => o.map((i) => ({ x: i.x * t, y: i.y * t })))
    })),
    // ops drives the polarity-correct copper/mask rendering; it must be scaled
    // in lockstep with tracks/flashes/regions or layers render at the wrong size.
    ops: h.ops.map((e) => e.kind === "track" ? {
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
      loops: e.loops.map((o) => o.map((i) => ({ x: i.x * t, y: i.y * t })))
    })
  };
}
function dr(h, t) {
  return t === 1 ? h : h.map((e) => ({ x: e.x * t, y: e.y * t, diameter: (e.diameter ?? 0) * t }));
}
function hr(h, t) {
  return t === 1 ? h : h.map((e) => ({
    x1: e.x1 * t,
    y1: e.y1 * t,
    x2: e.x2 * t,
    y2: e.y2 * t,
    diameter: (e.diameter ?? 0) * t
  }));
}
function ur(h) {
  return URL.createObjectURL(new Blob([h], { type: "image/svg+xml" }));
}
function Pt(h, t, e) {
  h.minX = Math.min(h.minX, t), h.minY = Math.min(h.minY, e), h.maxX = Math.max(h.maxX, t), h.maxY = Math.max(h.maxY, e);
}
function ge() {
  return { minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
}
function Nt(h) {
  const t = ge();
  for (const e of h.tracks) {
    Pt(t, e.start.x, e.start.y), Pt(t, e.end.x, e.end.y);
    const o = (e.width ?? 0) / 2;
    Pt(t, e.start.x - o, e.start.y - o), Pt(t, e.start.x + o, e.start.y + o), Pt(t, e.end.x - o, e.end.y - o), Pt(t, e.end.x + o, e.end.y + o);
  }
  for (const e of h.flashes) {
    const o = (e.widthMm ?? e.diameterMm) || 0, i = (e.heightMm ?? e.diameterMm) || 0;
    Pt(t, e.position.x - o / 2, e.position.y - i / 2), Pt(t, e.position.x + o / 2, e.position.y + i / 2);
  }
  for (const e of h.regions)
    for (const o of e.loops) for (const i of o) Pt(t, i.x, i.y);
  return t;
}
function fr(h, t = []) {
  const e = ge();
  for (const o of h) {
    const i = (o.diameter || 0) / 2;
    Pt(e, o.x - i, o.y - i), Pt(e, o.x + i, o.y + i);
  }
  for (const o of t) {
    const i = (o.diameter || 0) / 2;
    Pt(e, o.x1 - i, o.y1 - i), Pt(e, o.x1 + i, o.y1 + i), Pt(e, o.x2 - i, o.y2 - i), Pt(e, o.x2 + i, o.y2 + i);
  }
  return e;
}
function Se(h, t) {
  return {
    minX: Math.min(h.minX, t.minX),
    minY: Math.min(h.minY, t.minY),
    maxX: Math.max(h.maxX, t.maxX),
    maxY: Math.max(h.maxY, t.maxY)
  };
}
function Ot(h) {
  return !Number.isFinite(h.minX) || !Number.isFinite(h.minY) || !Number.isFinite(h.maxX) || !Number.isFinite(h.maxY) ? { minX: 0, minY: 0, maxX: 80, maxY: 60 } : (h.maxX - h.minX < 1e-6 && (h.maxX = h.minX + 1), h.maxY - h.minY < 1e-6 && (h.maxY = h.minY + 1), h);
}
const mr = 1e3;
function Ft(h) {
  return h / 25.4 * mr;
}
function Ht(h, t, e) {
  const o = h - e.minX, i = e.maxY - t;
  return { x: o, y: i };
}
function Fe(h, t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${t}" viewBox="0 0 ${h} ${t}">
  <rect width="${h}" height="${t}" fill="white"/>
</svg>`.trim();
}
function Zt(h, t = 1e-4) {
  const e = Math.round(h.x / t) * t, o = Math.round(h.y / t) * t;
  return `${e.toFixed(4)},${o.toFixed(4)}`;
}
function Me(h) {
  let t = 0;
  const e = h.length;
  for (let o = 0; o < e; o++) {
    const i = h[o], n = h[(o + 1) % e];
    t += i.x * n.y - n.x * i.y;
  }
  return 0.5 * t;
}
function me(h, t, e) {
  if (!h.length) return "";
  const o = (r) => ({
    x: (r.x - t.minX) * e,
    y: (t.maxY - r.y) * e
  }), i = o(h[0]), n = [`M ${i.x.toFixed(2)} ${i.y.toFixed(2)}`];
  for (let r = 1; r < h.length; r++) {
    const a = o(h[r]);
    n.push(`L ${a.x.toFixed(2)} ${a.y.toFixed(2)}`);
  }
  return n.push("Z"), n.join(" ");
}
function Le(h) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), o = (g, b) => {
    const _ = Zt(g), y = Zt(b);
    t.has(_) || t.set(_, []), t.has(y) || t.set(y, []), t.get(_).push(b), t.get(y).push(g), e.has(_) || e.set(_, g), e.has(y) || e.set(y, b);
  };
  for (const g of h) o(g.start, g.end);
  const i = /* @__PURE__ */ new Set(), n = (g, b) => {
    const _ = Zt(g), y = Zt(b);
    return _ < y ? `${_}|${y}` : `${y}|${_}`;
  }, r = [];
  for (const [g, b] of t.entries()) {
    const _ = e.get(g);
    for (const y of b) {
      const f = n(_, y);
      if (i.has(f)) continue;
      const p = [_];
      let s = _, m = y;
      i.add(f);
      for (let d = 0; d < 1e5; d++) {
        p.push(m);
        const v = Zt(m), k = t.get(v) ?? [];
        if (k.length === 0) break;
        let I = null;
        for (const R of k) {
          if (Zt(R) === Zt(s) && k.length > 1) continue;
          const B = n(m, R);
          if (!i.has(B)) {
            I = R, i.add(B);
            break;
          }
        }
        if (I || (I = k[0]), s = m, m = I, Zt(m) === Zt(_))
          break;
      }
      p.length >= 3 && r.push(p);
    }
  }
  r.sort((g, b) => Math.abs(Me(b)) - Math.abs(Me(g)));
  const a = [], u = /* @__PURE__ */ new Set();
  for (const g of r) {
    const b = g.map((_) => Zt(_)).join(";");
    u.has(b) || (u.add(b), a.push(g));
  }
  return a;
}
function pr(h, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, i = Math.max(1, Math.round(Ft(e))), n = Math.max(1, Math.round(Ft(o))), r = Ft(1), a = [];
  for (const u of h.regions)
    for (const g of u.loops)
      a.push(me(g, t, r));
  if (a.length === 0 && h.tracks.length) {
    const u = Le(h.tracks);
    if (u.length) {
      const g = u[0];
      a.push(me(g, t, r));
      for (let b = 1; b < u.length; b++)
        a.push(me(u[b], t, r));
    }
  }
  return a.length === 0 ? Fe(i, n) : `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  <rect x="0" y="0" width="${i}" height="${n}" fill="black"/>
  <path d="${a.join(" ")}" fill="white" fill-rule="evenodd"/>
</svg>`.trim();
}
function gr(h) {
  let t = 1 / 0, e = 1 / 0, o = -1 / 0, i = -1 / 0;
  for (const n of h.loops)
    for (const r of n)
      t = Math.min(t, r.x), e = Math.min(e, r.y), o = Math.max(o, r.x), i = Math.max(i, r.y);
  return { minX: t, minY: e, maxX: o, maxY: i };
}
function yr(h, t) {
  const e = (t.maxX - t.minX) * (t.maxY - t.minY);
  let o = 0, i = 0;
  for (const g of h.regions) {
    const b = gr(g), _ = (b.maxX - b.minX) * (b.maxY - b.minY);
    g.polarity === "clear" ? i = Math.max(i, _) : o = Math.max(o, _);
  }
  const n = h.tracks.filter((g) => g.polarity !== "clear").length + h.flashes.filter((g) => g.polarity !== "clear").length + h.regions.filter((g) => g.polarity !== "clear").length, r = h.tracks.filter((g) => g.polarity === "clear").length + h.flashes.filter((g) => g.polarity === "clear").length + h.regions.filter((g) => g.polarity === "clear").length, a = i > e * 0.85;
  return !(o > e * 0.85 || !a || !(r > n * 2));
}
function te(h, t, e, o) {
  const i = t.maxX - t.minX, n = t.maxY - t.minY, r = Math.max(1, Math.round(Ft(i))), a = Math.max(1, Math.round(Ft(n))), u = Ft(1), b = yr(h, t) ? "white" : "black", _ = (s, m) => {
    const d = s - t.minX, v = t.maxY - m;
    return { x: d * u, y: v * u };
  }, y = (s, m) => {
    if (s.kind === "track") {
      const d = _(s.start.x, s.start.y), v = _(s.end.x, s.end.y), k = Number.isFinite(s.widthMm) ? s.widthMm : 0.2, I = Math.max(1, k * u);
      return `<line x1="${d.x.toFixed(2)}" y1="${d.y.toFixed(2)}" x2="${v.x.toFixed(2)}" y2="${v.y.toFixed(2)}" stroke-width="${I.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="${m}" stroke="${m}" fill-opacity="1" stroke-opacity="1" />`;
    }
    if (s.kind === "flash") {
      const d = _(s.position.x, s.position.y), v = s.widthMm ?? s.diameterMm ?? 0.8, k = s.heightMm ?? s.diameterMm ?? 0.8, I = Math.max(0.01, Number.isFinite(v) ? v : 0.8) * u, R = Math.max(0.01, Number.isFinite(k) ? k : 0.8) * u, B = d.x - I / 2, O = d.y - R / 2, U = s.rotationDeg, E = U && Math.abs(U) > 0.01 ? ` transform="rotate(${(-U).toFixed(2)},${d.x.toFixed(2)},${d.y.toFixed(2)})"` : "";
      if (s.shape === "R" || s.shape === "O") {
        const V = s.shape === "O" ? Math.min(I, R) * 0.5 : 0;
        return `<rect x="${B.toFixed(2)}" y="${O.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${m}" fill-opacity="1"${E} />`;
      }
      if (Number.isFinite(s.cornerMm) && (s.cornerMm ?? 0) > 0) {
        const V = Math.max(0, s.cornerMm * u);
        return `<rect x="${B.toFixed(2)}" y="${O.toFixed(2)}" width="${I.toFixed(2)}" height="${R.toFixed(2)}" rx="${V.toFixed(2)}" ry="${V.toFixed(2)}" fill="${m}" fill-opacity="1"${E} />`;
      }
      const $ = Math.max(1, Math.max(I, R) / 2);
      return `<circle cx="${d.x.toFixed(2)}" cy="${d.y.toFixed(2)}" r="${$.toFixed(2)}" fill="${m}" fill-opacity="1" />`;
    }
    if (s.kind === "region") {
      const d = s.loops.map((v) => {
        if (!v.length) return "";
        const k = _(v[0].x, v[0].y), I = [`M ${k.x.toFixed(2)} ${k.y.toFixed(2)}`];
        for (let R = 1; R < v.length; R++) {
          const B = _(v[R].x, v[R].y);
          I.push(`L ${B.x.toFixed(2)} ${B.y.toFixed(2)}`);
        }
        return I.push("Z"), I.join(" ");
      }).join(" ");
      return d.trim() ? `<path d="${d}" fill-rule="evenodd" fill="${m}" fill-opacity="1" />` : "";
    }
    return "";
  }, f = [];
  for (const s of h.ops) {
    const m = s.polarity === "clear" ? "black" : "white", d = y(s, m);
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

  <rect x="0" y="0" width="${r}" height="${a}" fill="${e}" opacity="${o}" mask="url(#${p})" />
</svg>`.trim();
}
function Ie(h, t) {
  const e = t.maxX - t.minX, o = t.maxY - t.minY, i = Math.max(1, Math.round(Ft(e))), n = Math.max(1, Math.round(Ft(o))), r = Math.max(1e-6, Ft(1)), a = "rgba(255,255,255,0.95)", u = "rgba(255,255,255,0.95)", g = h.tracks.map((y) => {
    const f = Ht(y.start.x, y.start.y, t), p = Ht(y.end.x, y.end.y, t), s = Number.isFinite(y.width) ? y.width : 0.15, m = Math.max(1, s * r);
    return `<line x1="${(f.x * r).toFixed(2)}" y1="${(f.y * r).toFixed(2)}" x2="${(p.x * r).toFixed(2)}" y2="${(p.y * r).toFixed(2)}" stroke="${a}" stroke-width="${m.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" />`;
  }), b = h.flashes.map((y) => {
    const f = Ht(y.position.x, y.position.y, t), p = f.x * r, s = f.y * r, m = y.widthMm ?? y.diameterMm ?? 0.6, d = y.heightMm ?? y.diameterMm ?? 0.6;
    if (y.shape === "R" || y.shape === "O") {
      const k = m * r, I = d * r, R = p - k / 2, B = s - I / 2, O = y.shape === "O" ? Math.min(k, I) * 0.35 : 0;
      return `<rect x="${R.toFixed(2)}" y="${B.toFixed(2)}" width="${k.toFixed(2)}" height="${I.toFixed(2)}" rx="${O.toFixed(2)}" fill="${u}" />`;
    }
    const v = (y.diameterMm ?? 0.6) * r / 2;
    return `<circle cx="${p.toFixed(2)}" cy="${s.toFixed(2)}" r="${Math.max(1, v).toFixed(2)}" fill="${u}" />`;
  }), _ = h.regions.map((y) => {
    const f = y.loops.map((p) => {
      if (!p.length) return "";
      const s = Ht(p[0].x, p[0].y, t), m = [`M ${(s.x * r).toFixed(2)} ${(s.y * r).toFixed(2)}`];
      for (let d = 1; d < p.length; d++) {
        const v = Ht(p[d].x, p[d].y, t);
        m.push(`L ${(v.x * r).toFixed(2)} ${(v.y * r).toFixed(2)}`);
      }
      return m.push("Z"), m.join(" ");
    }).join(" ");
    return f.trim() ? `<path d="${f}" fill="${u}" fill-rule="evenodd" opacity="0.95" />` : "";
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}">
  ${g.join(`
  `)}
  ${b.join(`
  `)}
  ${_.join(`
  `)}
</svg>`.trim();
}
function _r(h, t, e) {
  const o = e.maxX - e.minX, i = e.maxY - e.minY, n = Math.round(Ft(o)), r = Math.round(Ft(i)), a = Ft(1), u = h.map((b) => {
    const _ = Ht(b.x, b.y, e), y = _.x * a, f = _.y * a, p = Math.max(1.5, (b.diameter || 0.6) * a / 2);
    return `<circle cx="${y.toFixed(2)}" cy="${f.toFixed(2)}" r="${(p + 2).toFixed(2)}" fill="#c97c2a" /><circle cx="${y.toFixed(2)}" cy="${f.toFixed(2)}" r="${p.toFixed(2)}" fill="#111111" />`;
  }), g = t.map((b) => {
    const _ = Ht(b.x1, b.y1, e), y = Ht(b.x2, b.y2, e), f = (_.x * a).toFixed(2), p = (_.y * a).toFixed(2), s = (y.x * a).toFixed(2), m = (y.y * a).toFixed(2), d = Math.max(3, (b.diameter || 0.6) * a);
    return `<line x1="${f}" y1="${p}" x2="${s}" y2="${m}" stroke="#c97c2a" stroke-width="${(d + 4).toFixed(2)}" stroke-linecap="round" /><line x1="${f}" y1="${p}" x2="${s}" y2="${m}" stroke="#111111" stroke-width="${d.toFixed(2)}" stroke-linecap="round" />`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}" viewBox="0 0 ${n} ${r}">
  ${u.join(`
  `)}
  ${g.join(`
  `)}
</svg>`.trim();
}
async function ie(h) {
  const t = Object.keys(h).filter((tt) => !!tt), e = ir(t), o = e.copper.find((tt) => tt.role === "top"), i = e.copper.find((tt) => tt.role === "bottom"), n = e.copper.filter((tt) => tt.role === "inner"), r = {
    top_copper: o?.path,
    bottom_copper: i?.path,
    inner_copper: n.length ? n.map((tt) => tt.path) : void 0,
    top_mask: e.top_mask,
    bottom_mask: e.bottom_mask,
    top_silk: e.top_silk,
    bottom_silk: e.bottom_silk,
    outline: e.outline,
    drills: e.drills
  }, a = new TextDecoder("utf-8", { fatal: !1 }), u = async (tt) => {
    if (!tt) return null;
    const vt = h[tt];
    if (!vt) return null;
    const Tt = a.decode(vt);
    return Tt.charCodeAt(0) === 65279 ? Tt.slice(1) : Tt;
  }, g = await u(r.top_copper), b = await u(r.bottom_copper), _ = await u(r.outline), y = r.drills?.length ? await Promise.all(r.drills.map((tt) => u(tt))) : [], f = await u(r.top_silk), p = await u(r.bottom_silk), s = r.inner_copper?.length ? await Promise.all(r.inner_copper.map((tt) => u(tt))) : [], m = g ? Yt(r.top_copper || "top", g) : null, d = b ? Yt(r.bottom_copper || "bot", b) : null, v = _ ? Yt(r.outline || "outline", _) : null, k = [], I = [];
  if (r.drills)
    for (let tt = 0; tt < r.drills.length; tt++) {
      const vt = y[tt];
      if (vt) {
        const Tt = lr(r.drills[tt], vt);
        for (const Wt of Tt.holes) k.push({ x: Wt.x, y: Wt.y, diameter: Wt.diameter });
        for (const Wt of Tt.slots) I.push(Wt);
      }
    }
  const R = await u(r.top_mask), B = await u(r.bottom_mask), O = await u(e.top_paste), U = await u(e.bottom_paste), E = f ? Yt(r.top_silk || "top_silk", f) : null, $ = p ? Yt(r.bottom_silk || "bot_silk", p) : null, V = R ? Yt(r.top_mask || "top_mask", R) : null, S = B ? Yt(r.bottom_mask || "bot_mask", B) : null, L = O ? Yt(e.top_paste || "top_paste", O) : null, c = U ? Yt(e.bottom_paste || "bot_paste", U) : null, N = s.map(
    (tt, vt) => tt ? Yt(r.inner_copper[vt], tt) : null
  );
  if (!!!(m || d || v || E || $ || V || S || L || c || k.length || I.length || N.some(Boolean)))
    throw new Mt(
      "MISSING_LAYERS",
      "No recognizable Gerber or drill layers were found in the bundle.",
      { files: t }
    );
  const X = m ? Ot(Nt(m)) : null, et = d ? Ot(Nt(d)) : null, Y = v ? Ot(Nt(v)) : null, ot = k.length || I.length ? Ot(fr(k, I)) : null, P = E ? Ot(Nt(E)) : null, T = $ ? Ot(Nt($)) : null, at = V ? Ot(Nt(V)) : null, J = S ? Ot(Nt(S)) : null, H = L ? Ot(Nt(L)) : null, ft = c ? Ot(Nt(c)) : null, kt = (Y && ne(Y) ? Y : null) || (X && ne(X) ? X : null) || (et && ne(et) ? et : null) || (ot && ne(ot) ? ot : null), ct = kt ? kt.maxX - kt.minX : 1, ht = X ? Ut(X.maxX - X.minX, ct) : 1, bt = et ? Ut(et.maxX - et.minX, ct) : 1, pt = Y ? Ut(Y.maxX - Y.minX, ct) : 1, Rt = ot ? Ut(ot.maxX - ot.minX, ct) : 1, Ct = P ? Ut(P.maxX - P.minX, ct) : 1, l = T ? Ut(T.maxX - T.minX, ct) : 1, D = at ? Ut(at.maxX - at.minX, ct) : 1, F = J ? Ut(J.maxX - J.minX, ct) : 1, w = H ? Ut(H.maxX - H.minX, ct) : 1, x = ft ? Ut(ft.maxX - ft.minX, ct) : 1, j = N.map((tt) => tt ? Ot(Nt(tt)) : null).map((tt) => tt ? Ut(tt.maxX - tt.minX, ct) : 1), W = m ? Gt(m, ht) : null, C = d ? Gt(d, bt) : null, G = v ? Gt(v, pt) : null, Q = k.length ? dr(k, Rt) : [], q = I.length ? hr(I, Rt) : [], st = E ? Gt(E, Ct) : null, ut = $ ? Gt($, l) : null, dt = V ? Gt(V, D) : null, Et = S ? Gt(S, F) : null, Dt = L ? Gt(L, w) : null, It = c ? Gt(c, x) : null, jt = N.map(
    (tt, vt) => tt ? Gt(tt, j[vt]) : null
  );
  let mt = null;
  if (G) {
    const tt = Ot(Nt(G));
    ne(tt) && (mt = tt);
  }
  if (!mt) {
    let tt = ge();
    W && (tt = Se(tt, Nt(W))), C && (tt = Se(tt, Nt(C))), tt = Ot(tt), mt = tt;
  }
  const gt = Ot(mt), qt = gt.maxX - gt.minX, Bt = gt.maxY - gt.minY;
  let M;
  if (G) {
    const tt = [];
    for (const vt of G.regions)
      for (const Tt of vt.loops)
        Tt.length >= 3 && tt.push(Tt);
    if (tt.length === 0 && G.tracks.length)
      for (const vt of Le(G.tracks))
        vt.length >= 3 && tt.push(vt);
    tt.length > 0 && (M = tt);
  }
  const z = {
    board: {
      width_in: qt / 25.4,
      height_in: Bt / 25.4,
      mm_bounds: {
        min_x_mm: gt.minX,
        min_y_mm: gt.minY,
        max_x_mm: gt.maxX,
        max_y_mm: gt.maxY
      }
    },
    outline_loops_mm: M,
    layer_count: e.copper.length
  }, Z = Math.max(1, Math.round(Ft(qt))), K = Math.max(1, Math.round(Ft(Bt))), rt = {}, nt = (tt, vt) => (rt[tt] = vt, tt), it = G ? pr(G, gt) : Fe(Z, K), yt = nt("board_mask", it), _t = W ? nt("cu.top", te(W, gt, "#fbbf24", 1)) : void 0, At = C ? nt("cu.bottom", te(C, gt, "#38bdf8", 1)) : void 0, xt = dt ? nt("top:mask", te(dt, gt, "#fbbf24", 0.9)) : void 0, Xt = Et ? nt("bottom:mask", te(Et, gt, "#38bdf8", 0.9)) : void 0, Jt = Q.length || q.length ? nt("drills", _r(Q, q, gt)) : void 0, zt = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"], St = [];
  for (let tt = 0; tt < jt.length; tt++) {
    const vt = jt[tt];
    if (vt) {
      const Tt = n[tt]?.detectedNum ?? tt + 1;
      St.push(nt(`cu.in${Tt}`, te(vt, gt, zt[tt % zt.length], 1)));
    } else
      St.push("");
  }
  const Lt = st ? nt("top:silk", Ie(st, gt)) : void 0, $t = ut ? nt("bottom:silk", Ie(ut, gt)) : void 0, ye = Dt ? nt("top:paste", te(Dt, gt, "#cbd5e1", 0.85)) : void 0, _e = It ? nt("bottom:paste", te(It, gt, "#cbd5e1", 0.85)) : void 0, be = [];
  for (const tt of e.copper) {
    let vt, Tt, Wt, oe;
    if (tt.role === "top")
      vt = _t, Tt = "#fbbf24", Wt = "Top", oe = "cu.top";
    else if (tt.role === "bottom")
      vt = At, Tt = "#38bdf8", Wt = "Bottom", oe = "cu.bottom";
    else {
      const he = n.indexOf(tt);
      vt = St[he] || void 0, Tt = zt[he % zt.length];
      const ve = tt.detectedNum ?? he + 1;
      Wt = `Inner ${ve}`, oe = `cu.in${ve}`;
    }
    vt && be.push({ id: oe, index: tt.index, role: tt.role, name: Wt, color: Tt, svgId: vt });
  }
  return {
    boardGeom: z,
    bounds: gt,
    wPx: Z,
    hPx: K,
    svgById: rt,
    boardMaskId: yt,
    copper: be,
    top: xt || Lt || ye ? { maskId: xt, silkId: Lt, pasteId: ye } : void 0,
    bottom: Xt || $t || _e ? { maskId: Xt, silkId: $t, pasteId: _e } : void 0,
    drillsId: Jt,
    viasId: void 0
  };
}
async function Ne(h) {
  const t = await ie(h), e = [], o = /* @__PURE__ */ new Map();
  for (const [y, f] of Object.entries(t.svgById)) {
    const p = ur(f);
    o.set(y, p), e.push(p);
  }
  const i = (y) => y ? o.get(y) : void 0, n = i(t.boardMaskId), r = {
    top_board_mask: n,
    bottom_board_mask: n
  }, a = t.copper.find((y) => y.role === "top"), u = t.copper.find((y) => y.role === "bottom"), g = t.copper.filter((y) => y.role === "inner");
  a && (r.top_copper = i(a.svgId)), u && (r.bottom_copper = i(u.svgId)), g.length && (r.inner_copper = g.map((y) => i(y.svgId)).filter(Boolean)), t.top?.maskId && (r.top_mask = i(t.top.maskId)), t.bottom?.maskId && (r.bottom_mask = i(t.bottom.maskId)), t.top?.silkId && (r.top_silk = i(t.top.silkId)), t.bottom?.silkId && (r.bottom_silk = i(t.bottom.silkId)), t.top?.pasteId && (r.top_paste = i(t.top.pasteId)), t.bottom?.pasteId && (r.bottom_paste = i(t.bottom.pasteId)), t.drillsId && (r.drills = i(t.drillsId));
  const _ = {
    copper: t.copper.map((y) => ({
      id: y.id,
      index: y.index,
      role: y.role,
      name: y.name,
      color: y.color,
      url: i(y.svgId)
    })),
    top: t.top ? { mask: i(t.top.maskId), silk: i(t.top.silkId), paste: i(t.top.pasteId) } : void 0,
    bottom: t.bottom ? { mask: i(t.bottom.maskId), silk: i(t.bottom.silkId), paste: i(t.bottom.pasteId) } : void 0,
    drills: i(t.drillsId),
    vias: i(t.viasId)
  };
  return {
    boardGeom: t.boardGeom,
    layers: r,
    stackup: _,
    revoke: () => e.forEach((y) => URL.revokeObjectURL(y))
  };
}
async function Zr(h) {
  const t = h instanceof Uint8Array ? h.byteOffset === 0 && h.byteLength === h.buffer.byteLength ? h.buffer : h.slice().buffer : h instanceof ArrayBuffer ? h : await h.arrayBuffer(), { files: e, archiveType: o } = await de(t, {
    // zip path ignores this
    // rar path requires it if you don't colocate worker bundle
    workerUrl: "/libarchive-worker-bundle.js"
  });
  if (o !== "zip")
    throw new Error(`renderGerbersZip expected zip but got ${o}`);
  return await Ne(e);
}
async function Vr(h, t) {
  const { files: e } = await de(h, {
    workerUrl: t?.archiveWorkerUrl
  });
  return await Ne(e);
}
const Re = (h) => `data:image/svg+xml;utf8,${encodeURIComponent(h)}`;
function se(h, t = {}) {
  const {
    side: e = "top",
    revealed: o = [],
    includeFR4: i = !0,
    background: n = "#1a5f1a",
    clipToBoard: r = !0
  } = t, { wPx: a, hPx: u, svgById: g } = h, b = (m) => {
    if (!m) return "";
    const d = g[m];
    return d ? `<image xlink:href="${Re(d)}" x="0" y="0" width="${a}" height="${u}" preserveAspectRatio="none"/>` : "";
  }, _ = [];
  i && _.push(`<rect x="0" y="0" width="${a}" height="${u}" fill="${n}"/>`);
  const y = h.copper.find((m) => m.role === (e === "top" ? "top" : "bottom"));
  y && _.push(b(y.svgId));
  const f = e === "top" ? h.top : h.bottom;
  f?.maskId && _.push(b(f.maskId));
  for (const m of h.copper)
    m.id !== y?.id && o.includes(m.id) && _.push(b(m.svgId));
  f?.silkId && _.push(b(f.silkId)), f?.pasteId && _.push(b(f.pasteId)), h.drillsId && _.push(b(h.drillsId));
  const p = _.filter(Boolean).join(`
    `);
  let s = p;
  return r && h.boardMaskId && g[h.boardMaskId] && (s = `<defs><mask id="__board" maskUnits="userSpaceOnUse" style="mask-type:luminance"><image xlink:href="${Re(g[h.boardMaskId])}" x="0" y="0" width="${a}" height="${u}" preserveAspectRatio="none"/></mask></defs>
    <g mask="url(#__board)">
    ${p}
    </g>`), `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${a}" height="${u}" viewBox="0 0 ${a} ${u}">
    ${s}
</svg>`;
}
async function $e(h) {
  if (h instanceof ArrayBuffer || h instanceof Uint8Array) {
    const { files: t } = await de(h);
    return t;
  }
  return h;
}
async function qr(h, t = {}) {
  const e = await $e(h), o = await ie(e);
  return se(o, t);
}
function br(h) {
  return new Promise((t, e) => {
    const o = new Image();
    o.onload = () => t(o), o.onerror = () => e(new Error("Failed to load composed SVG for rasterization")), o.src = h;
  });
}
const vr = async (h, { width: t, height: e, scale: o }) => {
  if (typeof document > "u" || typeof URL > "u" || !URL.createObjectURL)
    throw new Error(
      "renderGerbersToImage requires a rasterizer backend outside the browser (e.g. resvg-js). Pass opts.rasterizer."
    );
  const i = URL.createObjectURL(new Blob([h], { type: "image/svg+xml" }));
  try {
    const n = await br(i), r = document.createElement("canvas");
    r.width = Math.max(1, Math.round(t * o)), r.height = Math.max(1, Math.round(e * o));
    const a = r.getContext("2d");
    if (!a) throw new Error("Unable to get 2D context for rasterization");
    a.drawImage(n, 0, 0, r.width, r.height);
    const u = await new Promise((g) => r.toBlob(g, "image/png"));
    if (!u) throw new Error("canvas.toBlob returned null");
    return new Uint8Array(await u.arrayBuffer());
  } finally {
    URL.revokeObjectURL(i);
  }
};
async function Hr(h, t = {}) {
  const e = await $e(h), o = await ie(e), i = se(o, t);
  return (t.rasterizer ?? vr)(i, { width: o.wPx, height: o.hPx, scale: t.scale ?? 1 });
}
function xr(h, t, e = 0.01) {
  const o = {
    min_x_mm: Math.min(h.min_x_mm, t.min_x_mm),
    min_y_mm: Math.min(h.min_y_mm, t.min_y_mm),
    max_x_mm: Math.max(h.max_x_mm, t.max_x_mm),
    max_y_mm: Math.max(h.max_y_mm, t.max_y_mm)
  }, i = h.max_x_mm - h.min_x_mm, n = h.max_y_mm - h.min_y_mm, r = t.max_x_mm - t.min_x_mm, a = t.max_y_mm - t.min_y_mm, u = Math.abs(i - r) > e || Math.abs(n - a) > e;
  return { union: o, boardSizeChanged: u };
}
const re = 1e3 / 25.4;
async function Ae(h) {
  return h instanceof ArrayBuffer || h instanceof Uint8Array ? (await de(h)).files : h;
}
function wr(h) {
  return new Promise((t, e) => {
    const o = new Image();
    o.onload = () => t(o), o.onerror = () => e(new Error("Failed to load composed SVG for diff")), o.src = h;
  });
}
async function Kr(h, t, e = {}) {
  if (typeof document > "u")
    throw new Error("diffGerbers requires a browser environment (canvas).");
  const o = e.alphaThreshold ?? 24, [i, n] = await Promise.all([Ae(h), Ae(t)]), [r, a] = await Promise.all([ie(i), ie(n)]), { union: u, boardSizeChanged: g } = xr(
    { min_x_mm: r.bounds.minX, min_y_mm: r.bounds.minY, max_x_mm: r.bounds.maxX, max_y_mm: r.bounds.maxY },
    { min_x_mm: a.bounds.minX, min_y_mm: a.bounds.minY, max_x_mm: a.bounds.maxX, max_y_mm: a.bounds.maxY }
  ), b = u.max_x_mm - u.min_x_mm, _ = u.max_y_mm - u.min_y_mm, y = Math.max(1, Math.round(b * re)), f = Math.max(1, Math.round(_ * re)), p = [], s = async (B, O) => {
    if (!B.copper.some(($) => $.role === (O === "top" ? "top" : "bottom"))) return null;
    const U = se(B, { side: O, includeFR4: !1, clipToBoard: !0 }), E = URL.createObjectURL(new Blob([U], { type: "image/svg+xml" }));
    try {
      const $ = await wr(E), V = document.createElement("canvas");
      V.width = y, V.height = f;
      const S = V.getContext("2d");
      if (!S) return null;
      const L = Math.round((B.bounds.minX - u.min_x_mm) * re), c = Math.round((u.max_y_mm - B.bounds.maxY) * re);
      return S.drawImage($, L, c, B.wPx, B.hPx), S.getImageData(0, 0, y, f);
    } finally {
      URL.revokeObjectURL(E);
    }
  }, m = async (B) => {
    const [O, U] = await Promise.all([s(r, B), s(a, B)]);
    if (!O && !U) return;
    const E = document.createElement("canvas");
    E.width = y, E.height = f;
    const $ = E.getContext("2d");
    if (!$) return;
    const V = $.createImageData(y, f);
    let S = 0, L = 0;
    const c = O?.data, N = U?.data;
    for (let et = 0; et < V.data.length; et += 4) {
      const Y = c ? c[et + 3] > o : !1, ot = N ? N[et + 3] > o : !1;
      Y && ot ? (V.data[et] = 148, V.data[et + 1] = 163, V.data[et + 2] = 184, V.data[et + 3] = 70) : ot ? (V.data[et] = 34, V.data[et + 1] = 197, V.data[et + 2] = 94, V.data[et + 3] = 235, S++) : Y && (V.data[et] = 239, V.data[et + 1] = 68, V.data[et + 2] = 68, V.data[et + 3] = 235, L++);
    }
    $.putImageData(V, 0, 0);
    const lt = await new Promise(
      (et) => E.toBlob((Y) => et(Y ? URL.createObjectURL(Y) : ""), "image/png")
    );
    lt && p.push(lt);
    const X = 1 / (re * re);
    return {
      url: lt,
      addedPx: S,
      removedPx: L,
      addedArea_mm2: S * X,
      removedArea_mm2: L * X
    };
  }, d = await m("top"), v = await m("bottom"), k = {
    board: {
      width_in: b / 25.4,
      height_in: _ / 25.4,
      mm_bounds: u
    },
    layer_count: Math.max(r.copper.length, a.copper.length)
  }, I = (d?.addedArea_mm2 ?? 0) + (v?.addedArea_mm2 ?? 0), R = (d?.removedArea_mm2 ?? 0) + (v?.removedArea_mm2 ?? 0);
  return {
    top: d,
    bottom: v,
    boardGeom: k,
    summary: { boardSizeChanged: g, addedArea_mm2: I, removedArea_mm2: R },
    revoke: () => p.forEach((B) => URL.revokeObjectURL(B))
  };
}
function kr(h) {
  const t = new TextEncoder().encode(h);
  let e = "";
  for (const i of t) e += String.fromCharCode(i);
  return (typeof btoa < "u" ? btoa(e) : Buffer.from(e, "binary").toString("base64")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Sr(h) {
  const t = h.replace(/-/g, "+").replace(/_/g, "/"), e = typeof atob < "u" ? atob(t) : Buffer.from(t, "base64").toString("binary"), o = Uint8Array.from(e, (i) => i.charCodeAt(0));
  return new TextDecoder().decode(o);
}
function Ee(h) {
  return kr(JSON.stringify(h));
}
function Mr(h) {
  try {
    const t = JSON.parse(Sr(h));
    return t && t.v === 1 && (t.side === "top" || t.side === "bottom") && t.cam ? t : null;
  } catch {
    return null;
  }
}
function pe(h, t) {
  const [
    e,
    o,
    i,
    n,
    r,
    a,
    u,
    g,
    b
  ] = h, [
    _,
    y,
    f,
    p,
    s,
    m,
    d,
    v,
    k
  ] = t;
  return [
    e * _ + o * p + i * d,
    e * y + o * s + i * v,
    e * f + o * m + i * k,
    n * _ + r * p + a * d,
    n * y + r * s + a * v,
    n * f + r * m + a * k,
    u * _ + g * p + b * d,
    u * y + g * s + b * v,
    u * f + g * m + b * k
  ];
}
function Ce(h, t) {
  return [1, 0, h, 0, 1, t, 0, 0, 1];
}
function Ir(h, t) {
  return [h, 0, 0, 0, t, 0, 0, 0, 1];
}
function Rr(h) {
  const t = Math.cos(h), e = Math.sin(h);
  return [t, -e, 0, e, t, 0, 0, 0, 1];
}
function ze(h, t) {
  const e = h[0] * t.x + h[1] * t.y + h[2], o = h[3] * t.x + h[4] * t.y + h[5], i = h[6] * t.x + h[7] * t.y + h[8];
  if (i === 0) throw new Error("Invalid transform (w=0)");
  return { x: e / i, y: o / i };
}
function Ar(h) {
  const t = h[0], e = h[1], o = h[2], i = h[3], n = h[4], r = h[5], a = t * n - e * i;
  if (Math.abs(a) < 1e-12) throw new Error("Non-invertible transform");
  const u = 1 / a, g = n * u, b = -e * u, _ = -i * u, y = t * u, f = -(g * o + b * r), p = -(_ * o + y * r);
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
      return ze(this.worldToScreenMat, e);
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
      return ze(this.screenToWorldMat, e);
    } catch {
      return { x: NaN, y: NaN };
    }
  }
  recompute() {
    const { width_px: t, height_px: e } = this.viewport, { center_mm: o, zoom: i, rotation_rad: n, mirrorX: r, mirrorY: a } = this.camera, u = { x: t / 2, y: e / 2 }, g = a ? -1 : 1, b = r ? -1 : 1, _ = Ce(-o.x, -o.y), y = Rr(n), f = Ir(i * b, i * g), p = Ce(u.x, u.y), s = pe(p, pe(f, pe(y, _)));
    this.worldToScreenMat = s, this.screenToWorldMat = Ar(s);
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
    const o = this.overlays.get(t);
    o && o.visible !== e && (o.visible = e);
  }
  setZIndex(t, e) {
    const o = this.overlays.get(t);
    o && o.zIndex !== e && (o.zIndex = e, this.dirty = !0);
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
    const o = Math.floor(t / this.cellSize_mm), i = Math.floor(e / this.cellSize_mm);
    return { cx: o, cy: i, key: `${o},${i}` };
  }
  clear() {
    this.cells.clear();
  }
  insert(t, e, o) {
    const { key: i } = this.cellCoord(e, o);
    let n = this.cells.get(i);
    n || (n = /* @__PURE__ */ new Set(), this.cells.set(i, n)), n.add(t);
  }
  remove(t, e, o) {
    const { key: i } = this.cellCoord(e, o), n = this.cells.get(i);
    n && (n.delete(t), n.size === 0 && this.cells.delete(i));
  }
  // Query ids near a point within radius_mm
  queryRadius(t, e, o) {
    const { cx: i, cy: n } = this.cellCoord(t, e), r = Math.ceil(o / this.cellSize_mm), a = [];
    for (let u = -r; u <= r; u++)
      for (let g = -r; g <= r; g++) {
        const b = `${i + u},${n + g}`, _ = this.cells.get(b);
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
      const o = this.byId.get(e.id);
      if (!o) continue;
      const i = { ...o, ...e };
      (i.x_mm !== o.x_mm || i.y_mm !== o.y_mm) && (this.index.remove(o.id, o.x_mm, o.y_mm), this.index.insert(o.id, i.x_mm, i.y_mm)), this.byId.set(o.id, i), this.dirtyList = !0;
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
  queryNear(t, e, o) {
    const i = this.index.queryRadius(t, e, o), n = [];
    for (const r of i) {
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
  pick(t, e, o, i = 10) {
    const n = t.screenToBoard({ x: e, y: o }), r = t.xform.getCamera().zoom, a = i / r, u = this.store.queryNear(n.x, n.y, a);
    let g = null;
    for (const b of u) {
      const _ = t.boardToScreen({ x: b.x_mm, y: b.y_mm }), y = _.x - e, f = _.y - o, p = Math.sqrt(y * y + f * f);
      p <= i && (!g || p < g.distance_px) && (g = { id: b.id, marker: b, distance_px: p });
    }
    return g;
  }
}
class Or {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    let o = this.handlers.get(t);
    return o || (o = /* @__PURE__ */ new Set(), this.handlers.set(t, o)), o.add(e), () => this.off(t, e);
  }
  once(t, e) {
    const o = this.on(t, (i) => {
      o(), e(i);
    });
    return o;
  }
  off(t, e) {
    const o = this.handlers.get(t);
    o && (o.delete(e), o.size === 0 && this.handlers.delete(t));
  }
  emit(t, e) {
    const o = this.handlers.get(t);
    if (!o || o.size === 0) return;
    const i = Array.from(o);
    for (const n of i) n(e);
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
    const o = t.getContext("2d");
    if (!o) throw new Error("Unable to get 2D context");
    this.ctx = o;
    const i = {
      width_px: t.width,
      height_px: t.height
    };
    this.xform = new Er(e, i), this.visibility = new Fr(), this.scheduler = new Cr(() => this.render()), this.overlayApi = {
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
    this.passes.push(t), this.passes.sort((e, o) => e.order - o.order), this.requestRender("addPass");
  }
  removePass(t) {
    const e = this.passes.findIndex((o) => o.id === t);
    return e >= 0 ? (this.passes.splice(e, 1), this.requestRender("removePass"), !0) : !1;
  }
  getPass(t) {
    return this.passes.find((e) => e.id === t);
  }
  requestRender(t) {
    this.scheduler.requestRender(t);
  }
  render() {
    const t = this.ctx, e = this.canvas, o = { width_px: e.width, height_px: e.height };
    this.xform.setViewport(o);
    const i = {
      canvas: e,
      ctx: t,
      viewport: o,
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
      if (n.enabled(i)) {
        t.save();
        try {
          n.draw(i);
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
  pickMarker(t, e, o = 10) {
    const i = this.createRenderCtx();
    return this.markerPicker.pick(i, t, e, o);
  }
  // Marker selection
  selectMarker(t, e) {
    if (t !== this.selectedMarkerId) {
      if (this.selectedMarkerId = t, t) {
        const o = this.markers.get(t);
        this.emit("select:marker", { markerId: t, marker: o }), e?.center;
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
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), i = this.createRenderCtx(), n = this.markerPicker.pick(i, e, o, 10);
    this.setHoverMarker(n?.id ?? null);
  }
  handleMouseClick(t) {
    const { x_px: e, y_px: o } = this.eventToCanvasPx(t), i = this.createRenderCtx(), n = this.markerPicker.pick(i, e, o, 10);
    if (n) {
      this.selectMarker(n.id);
      return;
    }
    const r = i.screenToBoard({ x: e, y: o });
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
function Nr(h, t) {
  return {
    x_mm: h.x_mm,
    y_mm: t.minY_mm + t.maxY_mm - h.y_mm
  };
}
function $r(h, t) {
  return h.x_mm < t.minX_mm || h.x_mm > t.maxX_mm || h.y_mm < t.minY_mm || h.y_mm > t.maxY_mm;
}
const Kt = {
  OVERLAYS_MIN: 100,
  OVERLAYS_MAX: 199,
  MARKERS_MIN: 200,
  MARKERS_MAX: 299,
  SELECTION_MIN: 300,
  SELECTION_MAX: 399
};
function Qr(h, t, e, o) {
  return {
    id: `gerber:${h}`,
    order: t,
    enabled: (i) => i.visibility.gerber[e],
    draw: (i) => {
      const n = i.ctx, r = i.xform.getWorldToScreenMatrix();
      n.setTransform(r[0], r[3], r[1], r[4], r[2], r[5]), o(n);
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
    const o = this.overlays.get(t);
    o && (o.visible = e);
  }
  getAll() {
    return Array.from(this.overlays.values());
  }
}
function Ur(h, t) {
  return {
    id: "overlay:all",
    order: (Kt.OVERLAYS_MIN + Kt.OVERLAYS_MAX) / 2,
    enabled: (e) => !0,
    draw: (e) => {
      const i = h.getAll().filter((r) => e.visibility.overlays[r.id] ?? r.visible);
      i.sort((r, a) => r.zIndex - a.zIndex);
      const n = {
        boardToScreen: e.boardToScreen,
        screenToBoard: e.screenToBoard,
        xform: e.xform,
        view: e.xform.getCamera()
      };
      for (const r of i)
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
    const e = t.ctx, o = t.xform.getCamera().zoom;
    if (!(o < 2)) {
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
        r.x < -10 || r.x > t.viewport.width_px + 10 || r.y < -10 || r.y > t.viewport.height_px + 10 || this.drawMarker(e, r, n, o);
      }
    }
  }
  drawMarker(t, e, o, i) {
    const n = Math.max(3, Math.min(8, i / 5));
    switch (t.beginPath(), t.arc(e.x, e.y, n, 0, Math.PI * 2), o.type) {
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
function Xr(h) {
  return {
    id: "markers",
    order: (Kt.MARKERS_MIN + Kt.MARKERS_MAX) / 2,
    enabled: (t) => t.visibility.markers,
    draw: (t) => h.draw(t)
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
    const o = t.ctx;
    switch (e.type) {
      case "marker":
        this.drawMarkerSelection(o, t, e.id);
        break;
      case "geometry":
        break;
      case "region":
        this.drawRegionSelection(o, t, e.bounds);
        break;
    }
  }
  drawMarkerSelection(t, e, o) {
    if (!o || !this.getMarkerPosition) return;
    const i = this.getMarkerPosition(o);
    if (!i) return;
    const n = e.boardToScreen(i);
    t.setTransform(1, 0, 0, 1, 0, 0), t.strokeStyle = "yellow", t.lineWidth = 2, t.beginPath(), t.arc(n.x, n.y, 12, 0, Math.PI * 2), t.stroke();
  }
  drawRegionSelection(t, e, o) {
    if (!o) return;
    const i = e.xform.getWorldToScreenMatrix();
    t.setTransform(i[0], i[3], i[1], i[4], i[2], i[5]), t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 0.5, t.strokeRect(
      o.min.x,
      o.min.y,
      o.max.x - o.min.x,
      o.max.y - o.min.y
    );
  }
}
function Yr(h, t) {
  return {
    id: "selection",
    order: (Kt.SELECTION_MIN + Kt.SELECTION_MAX) / 2,
    enabled: (e) => !0,
    // Selection is always enabled when present
    draw: (e) => {
      const o = t();
      o && h.draw(e, o);
    }
  };
}
function en(h, t = {}) {
  const e = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`, o = t.showDownloadButton !== !1;
  h.innerHTML = `
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
            <button class="btn" id="share-btn" type="button" title="Copy shareable link">Share</button>${o ? `
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
  const i = h.firstElementChild, n = w(i, "#board-viewport"), r = w(i, "#render-canvas"), a = w(i, "#grid-toggle"), u = w(i, "#grid-units"), g = w(i, "#fit-btn"), b = w(i, "#share-btn"), _ = o ? w(i, "#download-btn") : null, y = Array.from(i.querySelectorAll('input[name="side"]')), f = w(i, "#layer-menu-btn"), p = w(i, "#layer-panel"), s = w(i, "#export-menu-btn"), m = w(i, "#export-panel"), d = new Lr(r, {
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
  let B = null;
  function O() {
    const M = n.getBoundingClientRect();
    r.width = Math.max(1, Math.round(M.width)), r.height = Math.max(1, Math.round(M.height)), r.style.width = `${M.width}px`, r.style.height = `${M.height}px`, d.requestRender("resize");
  }
  const U = {
    id: "grid",
    visible: !1,
    zIndex: 10,
    draw: (M, z) => {
      const K = z.view.zoom, rt = u.value, nt = rt === "mm" ? 1 : 2.54, it = rt === "mm" ? 10 : 25.4, yt = nt * K, _t = it * K;
      if (yt < 2) return;
      const At = z.screenToBoard({ x: 0, y: 0 }), xt = z.screenToBoard({ x: r.width, y: r.height });
      M.setTransform(1, 0, 0, 1, 0, 0), M.strokeStyle = "rgba(59, 130, 246, 0.4)", M.lineWidth = 1, M.beginPath();
      const Xt = Math.floor(At.x / nt) * nt, Jt = Math.floor(At.y / nt) * nt;
      for (let zt = Xt; zt <= xt.x; zt += nt) {
        const St = z.boardToScreen({ x: zt, y: 0 }).x;
        M.moveTo(St, 0), M.lineTo(St, r.height);
      }
      for (let zt = Jt; zt <= xt.y; zt += nt) {
        const St = z.boardToScreen({ x: 0, y: zt }).y;
        M.moveTo(0, St), M.lineTo(r.width, St);
      }
      if (M.stroke(), _t >= 8) {
        M.strokeStyle = "rgba(59, 130, 246, 0.7)", M.lineWidth = 1.5, M.beginPath();
        const zt = Math.floor(At.x / it) * it, St = Math.floor(At.y / it) * it;
        for (let Lt = zt; Lt <= xt.x; Lt += it) {
          const $t = z.boardToScreen({ x: Lt, y: 0 }).x;
          M.moveTo($t, 0), M.lineTo($t, r.height);
        }
        for (let Lt = St; Lt <= xt.y; Lt += it) {
          const $t = z.boardToScreen({ x: 0, y: Lt }).y;
          M.moveTo(0, $t), M.lineTo(r.width, $t);
        }
        M.stroke();
      }
    }
  };
  k.add(U), v.setOverlayVisibility("grid", !1), v.setMarkersVisibility(!1), d.addPass(Ur(k, d.getOverlayApi())), d.addPass(Xr(I)), d.addPass(Yr(R, () => B));
  const E = {}, $ = {
    "layer:fr4": { label: "FR4 substrate", color: "#1a5f1a" },
    "layer:drills": { label: "Drill holes", color: "#111111" },
    "layer:vias": { label: "Vias", color: "#111111" }
  }, V = ["#a78bfa", "#34d399", "#fb923c", "#60a5fa", "#f472b6"];
  let S = null, L = {}, c = null, N = "top", lt = !1, X = [], et = !1;
  function Y(M, z, Z) {
    if (!Z) return null;
    M in E || (E[M] = !0);
    const K = new Image();
    return K.src = Z, K.addEventListener("load", () => {
      d.requestRender(`image-loaded-${M}`);
    }), {
      id: M,
      order: z,
      enabled: (rt) => !!(E[M] ?? !0) && !!S?.board?.mm_bounds,
      draw: (rt) => {
        if (!K.complete || !S?.board?.mm_bounds) return;
        const nt = rt.ctx, it = rt.xform.getWorldToScreenMatrix();
        nt.setTransform(it[0], it[3], it[1], it[4], it[2], it[5]);
        let yt;
        (L.top_board_mask || L.bottom_board_mask) && (yt = 0.5);
        const _t = P(nt, S, yt);
        J(nt, _t, (At) => {
          if (!S?.board?.mm_bounds) return;
          const xt = S.board.mm_bounds, Xt = xt.max_x_mm - xt.min_x_mm, Jt = xt.max_y_mm - xt.min_y_mm;
          At.drawImage(K, xt.min_x_mm, xt.min_y_mm, Xt, Jt);
        });
      }
    };
  }
  function ot(M, z) {
    return M in E || (E[M] = !0), {
      id: M,
      order: z,
      enabled: (Z) => !!(E[M] ?? !0) && !!S?.board?.mm_bounds,
      draw: (Z) => {
        if (!S?.board?.mm_bounds) return;
        const K = Z.ctx, rt = Z.xform.getWorldToScreenMatrix();
        K.setTransform(rt[0], rt[3], rt[1], rt[4], rt[2], rt[5]);
        const nt = P(K, S, 0.5);
        at(K, nt);
      }
    };
  }
  function P(M, z, Z) {
    if (!z?.board?.mm_bounds) return new Path2D();
    const K = z.board.mm_bounds;
    if (z.outline_loops_mm?.length) {
      const rt = new Path2D(), nt = (it) => K.max_y_mm + K.min_y_mm - it;
      for (const it of z.outline_loops_mm)
        if (it.length) {
          rt.moveTo(it[0].x, nt(it[0].y));
          for (let yt = 1; yt < it.length; yt++)
            rt.lineTo(it[yt].x, nt(it[yt].y));
          rt.closePath();
        }
      return rt;
    }
    return T(
      K.min_x_mm,
      K.min_y_mm,
      K.max_x_mm - K.min_x_mm,
      K.max_y_mm - K.min_y_mm,
      Z || 0
    );
  }
  function T(M, z, Z, K, rt) {
    const nt = new Path2D(), it = Math.max(0, Math.min(rt, Math.min(Z, K) / 2));
    return nt.moveTo(M + it, z), nt.lineTo(M + Z - it, z), nt.quadraticCurveTo(M + Z, z, M + Z, z + it), nt.lineTo(M + Z, z + K - it), nt.quadraticCurveTo(M + Z, z + K, M + Z - it, z + K), nt.lineTo(M + it, z + K), nt.quadraticCurveTo(M, z + K, M, z + K - it), nt.lineTo(M, z + it), nt.quadraticCurveTo(M, z, M + it, z), nt.closePath(), nt;
  }
  function at(M, z) {
    M.save(), M.clip(z), M.fillStyle = "#1a5f1a", M.fill(z), M.strokeStyle = "#0d3d0d", M.lineWidth = 0.1, M.stroke(z), M.restore();
  }
  function J(M, z, Z) {
    M.save(), M.clip(z), Z(M), M.restore();
  }
  const H = (M) => M.startsWith("cu.in"), ft = (M) => M.charAt(0).toUpperCase() + M.slice(1);
  function kt(M) {
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
    if (X.forEach((rt) => d.removePass(rt)), X = [], !S || !c) return;
    const M = (rt, nt, it, yt) => {
      const _t = !!yt?.fr4;
      if (!_t && !it) return;
      yt?.meta && ($[rt] = yt.meta), rt in E || (E[rt] = !H(rt));
      const At = _t ? ot(rt, nt) : Y(rt, nt, it);
      At && (d.addPass(At), X.push(rt));
    };
    M("layer:fr4", 5, void 0, { fr4: !0 });
    const z = N, Z = c.copper.find((rt) => rt.role === (z === "top" ? "top" : "bottom"));
    Z && M(Z.id, 10, Z.url, { meta: { label: `${Z.name} copper`, color: Z.color } });
    const K = z === "top" ? c.top : c.bottom;
    K?.mask && M(`${z}:mask`, 15, K.mask, { meta: { label: `${ft(z)} soldermask`, color: z === "top" ? "#fde68a" : "#bae6fd" } }), c.copper.filter((rt) => rt.role === "inner").forEach((rt, nt) => M(rt.id, 20 + nt, rt.url, { meta: { label: rt.name, color: rt.color } })), K?.silk && M(`${z}:silk`, 30, K.silk, { meta: { label: `${ft(z)} silkscreen`, color: "#f1f5f9" } }), K?.paste && M(`${z}:paste`, 32, K.paste, { meta: { label: `${ft(z)} paste`, color: "#cbd5e1" } }), M("layer:drills", 40, c.drills), M("layer:vias", 45, c.vias), d.requestRender("side-switch"), setTimeout(() => d.requestRender("side-switch-delayed"), 50), ht();
  }
  function ht() {
    const M = [...X].reverse();
    p.innerHTML = M.map((z) => {
      const Z = $[z] ?? { label: z, color: "#888" }, K = E[z] ?? !0, rt = Z.color === "#f1f5f9" ? " border:1px solid #cbd5e1;" : "";
      return `<label class="layer-item" data-layer-id="${z}"><span class="layer-swatch" style="background:${Z.color};${rt}"></span><span>${Z.label}</span><input type="checkbox"${K ? " checked" : ""} /></label>`;
    }).join(""), p.querySelectorAll(".layer-item input").forEach((z) => {
      z.addEventListener("change", () => {
        const Z = z.closest("[data-layer-id]")?.dataset.layerId;
        Z && (E[Z] = z.checked, d.requestRender("layer-toggle"));
      });
    });
  }
  function bt(M = 0.08) {
    if (!S?.board?.mm_bounds) return;
    const z = n.getBoundingClientRect(), Z = S.board.mm_bounds, K = Z.max_x_mm - Z.min_x_mm, rt = Z.max_y_mm - Z.min_y_mm, nt = z.width * (1 - 2 * M), it = z.height * (1 - 2 * M), yt = nt / K, _t = it / rt, At = Math.min(yt, _t), xt = (Z.min_x_mm + Z.max_x_mm) / 2, Xt = (Z.min_y_mm + Z.max_y_mm) / 2;
    d.setCamera({
      center_mm: { x: xt, y: Xt },
      zoom: At
    });
  }
  r.addEventListener("wheel", (M) => {
    M.preventDefault(), lt = !0;
    const z = r.getBoundingClientRect(), Z = M.clientX - z.left, K = M.clientY - z.top, rt = d.getCamera(), nt = M.deltaY < 0 ? 1.1 : 0.9, it = Math.max(0.2, Math.min(50, rt.zoom * nt)), yt = d.screenToBoard(Z, K);
    d.setCamera({ zoom: it });
    const _t = d.screenToBoard(Z, K), At = yt.x - _t.x, xt = yt.y - _t.y;
    d.setCamera({
      center_mm: {
        x: rt.center_mm.x + At,
        y: rt.center_mm.y + xt
      }
    });
  }, { passive: !1 });
  let pt = !1, Rt = null;
  r.addEventListener("mousedown", (M) => {
    if (M.button !== 0) return;
    M.preventDefault(), lt = !0, pt = !0;
    const z = r.getBoundingClientRect();
    Rt = d.screenToBoard(
      M.clientX - z.left,
      M.clientY - z.top
    );
  });
  const Ct = (M) => {
    if (!pt || !Rt) return;
    const z = r.getBoundingClientRect(), Z = d.screenToBoard(
      M.clientX - z.left,
      M.clientY - z.top
    ), K = Rt.x - Z.x, rt = Rt.y - Z.y, nt = d.getCamera();
    d.setCamera({
      center_mm: {
        x: nt.center_mm.x + K,
        y: nt.center_mm.y + rt
      }
    });
  }, l = () => {
    pt = !1, Rt = null;
  };
  window.addEventListener("mousemove", Ct), window.addEventListener("mouseup", l), a.addEventListener("change", () => {
    const M = a.checked;
    v.setOverlayVisibility("grid", M), U.visible = M, d.requestRender("grid-toggle");
  }), u.addEventListener("change", () => {
    v.isOverlayVisible("grid") && d.requestRender("grid-units");
  }), g.addEventListener("click", () => bt(0.08)), b.addEventListener("click", async () => {
    await Et();
    const M = b.textContent;
    b.textContent = "Copied!", setTimeout(() => {
      b.textContent = M;
    }, 1200);
  }), _?.addEventListener("click", () => t.onDownload?.()), f.addEventListener("click", (M) => {
    M.stopPropagation();
    const z = !p.hidden;
    p.hidden = z, f.classList.toggle("active", !z);
  }), s.addEventListener("click", (M) => {
    M.stopPropagation();
    const z = !m.hidden;
    m.hidden = z, s.classList.toggle("active", !z);
  }), m.querySelectorAll(".export-item").forEach((M) => {
    M.addEventListener("click", async () => {
      m.hidden = !0, s.classList.remove("active");
      const z = M.dataset.export;
      try {
        z === "png-view" ? await q("view") : z === "png-board" ? await q("board") : z === "svg-board" && await Q();
      } catch (Z) {
        console.error("Export failed:", Z);
      }
    });
  });
  const D = (M) => {
    const z = M.target;
    !p.hidden && !p.contains(z) && M.target !== f && (p.hidden = !0, f.classList.remove("active")), !m.hidden && !m.contains(z) && M.target !== s && (m.hidden = !0, s.classList.remove("active"));
  };
  document.addEventListener("click", D), y.forEach((M) => {
    M.addEventListener("change", () => {
      N = y.find((z) => z.checked)?.value || "top", ct();
    });
  });
  const F = () => {
    O(), lt || bt(0.08);
  };
  window.addEventListener("resize", F);
  function w(M, z) {
    const Z = M.querySelector(z);
    if (!Z) throw new Error(`Missing required element: ${z}`);
    return Z;
  }
  function x(M) {
    S = M.boardGeom, L = M.layers, c = M.stackup ?? kt(M.layers), S?.board?.mm_bounds && d.setBoardBounds({
      minX_mm: S.board.mm_bounds.min_x_mm,
      minY_mm: S.board.mm_bounds.min_y_mm,
      maxX_mm: S.board.mm_bounds.max_x_mm,
      maxY_mm: S.board.mm_bounds.max_y_mm
    }), ct(), O(), bt(0.08), et || (et = !0, Dt());
  }
  function A(M) {
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
    return c.copper.filter((z) => z.id !== M?.id && (E[z.id] ?? !1)).map((z) => z.id);
  }
  async function G() {
    if (!S || !c) return null;
    const M = S.board.mm_bounds, z = M.max_x_mm - M.min_x_mm, Z = M.max_y_mm - M.min_y_mm, K = 1e3 / 25.4, rt = Math.max(1, Math.round(z * K)), nt = Math.max(1, Math.round(Z * K)), it = {}, yt = [], _t = (St, Lt) => {
      if (Lt)
        return yt.push(fetch(Lt).then(($t) => $t.text()).then(($t) => {
          it[St] = $t;
        })), St;
    }, At = _t("board_mask", L.top_board_mask), xt = c.copper.map((St) => ({
      id: St.id,
      index: St.index,
      role: St.role,
      name: St.name,
      color: St.color,
      svgId: _t(St.id, St.url)
    })), Xt = c.top ? { maskId: _t("top:mask", c.top.mask), silkId: _t("top:silk", c.top.silk), pasteId: _t("top:paste", c.top.paste) } : void 0, Jt = c.bottom ? { maskId: _t("bottom:mask", c.bottom.mask), silkId: _t("bottom:silk", c.bottom.silk), pasteId: _t("bottom:paste", c.bottom.paste) } : void 0, zt = _t("drills", c.drills);
    return await Promise.all(yt), {
      boardGeom: S,
      bounds: { minX: M.min_x_mm, minY: M.min_y_mm, maxX: M.max_x_mm, maxY: M.max_y_mm },
      wPx: rt,
      hPx: nt,
      svgById: it,
      boardMaskId: At,
      copper: xt,
      top: Xt,
      bottom: Jt,
      drillsId: zt,
      viasId: void 0
    };
  }
  async function Q() {
    const M = await G();
    if (!M) return;
    const z = se(M, { side: N, revealed: C() });
    j(new Blob([z], { type: "image/svg+xml" }), `board-${N}.svg`);
  }
  async function q(M = "view", z = 2) {
    if (M === "view") {
      await new Promise((nt) => {
        r.toBlob((it) => {
          it && j(it, `board-${N}-view.png`), nt();
        }, "image/png");
      });
      return;
    }
    const Z = await G();
    if (!Z) return;
    const K = se(Z, { side: N, revealed: C() }), rt = URL.createObjectURL(new Blob([K], { type: "image/svg+xml" }));
    try {
      const nt = await W(rt), it = document.createElement("canvas"), yt = 8e3;
      it.width = Math.min(yt, Math.max(1, Math.round(Z.wPx * z))), it.height = Math.min(yt, Math.max(1, Math.round(Z.hPx * z)));
      const _t = it.getContext("2d");
      if (!_t) return;
      _t.drawImage(nt, 0, 0, it.width, it.height), await new Promise((At) => {
        it.toBlob((xt) => {
          xt && j(xt, `board-${N}.png`), At();
        }, "image/png");
      });
    } finally {
      URL.revokeObjectURL(rt);
    }
  }
  function st() {
    const M = d.getCamera();
    return {
      v: 1,
      side: N,
      cam: { x: M.center_mm.x, y: M.center_mm.y, zoom: M.zoom, rot: M.rotation_rad || 0 },
      visible: { ...E },
      grid: a.checked,
      units: u.value
    };
  }
  function ut(M) {
    if (M.units && (u.value = M.units), typeof M.grid == "boolean" && (a.checked = M.grid, U.visible = M.grid, v.setOverlayVisibility("grid", M.grid)), M.side) {
      N = M.side;
      const z = y.find((Z) => Z.value === M.side);
      z && (z.checked = !0);
    }
    M.visible && Object.assign(E, M.visible), ct(), M.cam && d.setCamera({ center_mm: { x: M.cam.x, y: M.cam.y }, zoom: M.cam.zoom, rotation_rad: M.cam.rot ?? 0 }), lt = !0, d.requestRender("view-state");
  }
  function dt() {
    const M = new URL(location.href);
    return M.hash = `gv=${Ee(st())}`, M.toString();
  }
  async function Et() {
    const M = dt();
    location.hash = `gv=${Ee(st())}`;
    try {
      await navigator.clipboard?.writeText(M);
    } catch {
    }
    return M;
  }
  function Dt() {
    const M = /(?:^|[#&])gv=([^&]+)/.exec(location.hash || "");
    if (!M) return !1;
    const z = Mr(M[1]);
    return z ? (ut(z), !0) : !1;
  }
  let It = null;
  const jt = {
    id: "diff:overlay",
    order: 190,
    // above board layers, below markers
    enabled: (M) => !!It,
    draw: (M) => {
      if (!It) return;
      const z = N === "top" ? It.topImg : It.bottomImg;
      if (!z || !z.complete) return;
      const Z = It.result.boardGeom.board.mm_bounds, K = M.ctx, rt = M.xform.getWorldToScreenMatrix();
      K.setTransform(rt[0], rt[3], rt[1], rt[4], rt[2], rt[5]), K.drawImage(z, Z.min_x_mm, Z.min_y_mm, Z.max_x_mm - Z.min_x_mm, Z.max_y_mm - Z.min_y_mm);
    }
  };
  function mt(M) {
    const z = (Z) => {
      if (!Z) return;
      const K = new Image();
      return K.onload = () => d.requestRender("diff-loaded"), K.src = Z, K;
    };
    It = { result: M, topImg: z(M.top?.url), bottomImg: z(M.bottom?.url) }, d.getPass("diff:overlay") || d.addPass(jt), d.requestRender("diff-show");
  }
  function gt() {
    It = null, d.removePass("diff:overlay"), d.requestRender("diff-hide");
  }
  function qt(M, z) {
    const Z = S?.board?.mm_bounds;
    if (!Z) return { x: M, y: z };
    const K = Nr(
      { x_mm: M, y_mm: z },
      { minX_mm: Z.min_x_mm, minY_mm: Z.min_y_mm, maxX_mm: Z.max_x_mm, maxY_mm: Z.max_y_mm }
    );
    return { x: K.x_mm, y: K.y_mm };
  }
  function Bt() {
    window.removeEventListener("mousemove", Ct), window.removeEventListener("mouseup", l), window.removeEventListener("resize", F), document.removeEventListener("click", D), d.dispose(), h.innerHTML = "";
  }
  return O(), {
    setData: x,
    setSideMode: A,
    fit: () => bt(0.08),
    dispose: Bt,
    // Image / SVG export
    exportPng: q,
    exportSvg: Q,
    // Revision diff overlay
    showDiff: mt,
    hideDiff: gt,
    // Shareable view state
    getViewState: st,
    setViewState: ut,
    getShareUrl: dt,
    copyShareLink: Et,
    applyStateFromHash: Dt,
    // Expose new render pipeline API
    viewer: d,
    visibility: v,
    overlayRegistry: k,
    markerRenderer: I,
    setSelection: (M) => {
      B = M, d.requestRender("selection-change");
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
        position: qt(M.x_mm, M.y_mm),
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
function rn(h, t) {
  return {
    id: "overlay:all",
    order: Kt.OVERLAYS_MIN,
    enabled: () => !0,
    draw: (e) => {
      const o = e.xform.getWorldToScreenMatrix(), i = h.getSortedVisible();
      for (const n of i)
        e.ctx.save(), n.drawInWorldSpace ? e.ctx.setTransform(o[0], o[3], o[1], o[4], o[2], o[5]) : e.ctx.setTransform(1, 0, 0, 1, 0, 0), n.draw(e.ctx, t), e.ctx.restore();
    }
  };
}
function nn() {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (h, t) => {
      const e = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 }
      ];
      h.fillStyle = "red";
      for (const o of e)
        h.beginPath(), h.arc(o.x_mm, o.y_mm, 0.25, 0, Math.PI * 2), h.fill();
    }
  };
}
function sn(h) {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: !0,
    drawInWorldSpace: !1,
    draw: (t, e) => {
      const o = h();
      o && (t.fillStyle = "rgba(0, 0, 0, 0.8)", t.fillRect(o.x_px + 12, o.y_px - 20, 100, 20), t.fillStyle = "white", t.font = "12px sans-serif", t.fillText(o.text, o.x_px + 15, o.y_px - 5));
    }
  };
}
function on(h = 1) {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (t, e) => {
      const o = e.getBoardBounds();
      e.getViewState(), t.strokeStyle = "rgba(128, 128, 128, 0.3)", t.lineWidth = 0.1, t.beginPath();
      for (let i = o.minX_mm; i <= o.maxX_mm; i += h)
        t.moveTo(i, o.minY_mm), t.lineTo(i, o.maxY_mm);
      for (let i = o.minY_mm; i <= o.maxY_mm; i += h)
        t.moveTo(o.minX_mm, i), t.lineTo(o.maxX_mm, i);
      t.stroke();
    }
  };
}
function an(h) {
  let t = 0;
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: !0,
    drawInWorldSpace: !0,
    draw: (e, o) => {
      t += 16;
      const i = Math.sin(t / 200) * 0.5 + 0.5;
      e.fillStyle = `rgba(255, 0, 0, ${0.3 + i * 0.7})`, e.beginPath(), e.arc(h.x_mm, h.y_mm, 0.5 + i * 0.5, 0, Math.PI * 2), e.fill(), o.requestRender("overlay:animate");
    }
  };
}
class Gr {
  constructor(t) {
    this.store = t;
  }
  draw(t, e) {
    const o = this.store.list();
    t.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const { width_px: i, height_px: n } = t.viewport, r = 4;
    for (const a of o) {
      if (typeof a.x_mm != "number" || typeof a.y_mm != "number" || !isFinite(a.x_mm) || !isFinite(a.y_mm)) {
        console.warn(`Invalid marker coordinates for ${a.id}:`, {
          x_mm: a.x_mm,
          y_mm: a.y_mm,
          marker: a,
          keys: Object.keys(a)
        });
        continue;
      }
      const u = t.boardToScreen({ x: a.x_mm, y: a.y_mm }), g = u.x, b = u.y;
      if (g < -10 || b < -10 || g > i + 10 || b > n + 10) continue;
      const _ = e?.boardBounds ? $r({ x_mm: a.x_mm, y_mm: a.y_mm }, e.boardBounds) : !1;
      this.applyMarkerStyling(t.ctx, a, e?.selectedId === a.id, e?.hoverId === a.id, _), t.ctx.beginPath(), t.ctx.arc(g, b, r, 0, Math.PI * 2), e?.selectedId === a.id ? (t.ctx.lineWidth = 2, t.ctx.stroke()) : t.ctx.fill();
    }
  }
  applyMarkerStyling(t, e, o, i, n) {
    if (o)
      t.fillStyle = "rgba(59, 130, 246, 0.8)", t.strokeStyle = "rgba(59, 130, 246, 1)";
    else if (i)
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
function ln(h, t) {
  const e = new Gr(h);
  return {
    id: "markers",
    order: Kt.MARKERS_MIN,
    enabled: () => !0,
    // Visibility is handled in the draw function
    draw: (o) => {
      if (!o.visibility.markers) return;
      const i = t();
      e.draw(o, {
        selectedId: i.selectedId,
        hoverId: i.hoverId,
        boardBounds: o.boardBounds
      });
    }
  };
}
export {
  Or as Emitter,
  Mt as GerberError,
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
  se as composeStackToSvg,
  xr as computeDiffAlignment,
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
  He as detectGerberBundle,
  Kr as diffGerbers,
  Ee as encodeViewState,
  ie as renderGerberSvgDocs,
  Vr as renderGerbers,
  Ne as renderGerbersFiles,
  Hr as renderGerbersToImage,
  qr as renderGerbersToSvg,
  Zr as renderGerbersZip
};
//# sourceMappingURL=gerbers-renderer.es.js.map
