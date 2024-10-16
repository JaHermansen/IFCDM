var $e = Object.defineProperty;
var He = (a, t, s) => t in a ? $e(a, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[t] = s;
var P = (a, t, s) => (He(a, typeof t != "symbol" ? t + "" : t, s), s);
import * as O from "three";
import { BufferAttribute as Te, Vector3 as B, Vector2 as Yt, Plane as Be, Line3 as _t, Triangle as ns, Sphere as Xe, Matrix4 as Vt, Box3 as ct, BackSide as Ye, DoubleSide as Ze, FrontSide as ae, Mesh as De, Ray as Je, BufferGeometry as fe } from "three";
class le extends O.InstancedMesh {
  /**
   * Constructs a new FragmentMesh.
   *
   * @param geometry - The geometry for the mesh. Must be indexed.
   * @param material - The material(s) for the mesh. If a single material is provided, it will be wrapped in an array.
   * @param count - The number of instances to create.
   * @param fragment - The fragment associated with this mesh.
   */
  constructor(s, e, i, n) {
    super(s, e, i);
    /**
     * The fragment associated with this mesh.
     */
    P(this, "fragment");
    /**
     * The materials used by this mesh.
     * If a single material is provided, it will be wrapped in an array.
     */
    P(this, "material");
    /**
     * The geometry used by this mesh.
     * It must be an IndexedGeometry.
     */
    P(this, "geometry");
    if (Array.isArray(e) || (e = [e]), this.material = e, !s.index)
      throw new Error("The geometry for fragments must be indexed!");
    this.geometry = s, this.fragment = n;
    const o = s.index.count;
    s.groups.length || s.groups.push({
      start: 0,
      count: o,
      materialIndex: 0
    });
  }
  /**
   * Exports the data of the fragment mesh to a serializable format.
   *
   * @returns An object containing the position, normal, index, groups, materials, matrices, and colors of the fragment mesh.
   */
  exportData() {
    const s = this.geometry.attributes.position.array, e = this.geometry.attributes.normal.array, i = Array.from(this.geometry.index.array), n = [];
    for (const f of this.geometry.groups) {
      const l = f.materialIndex || 0, { start: b, count: h } = f;
      n.push(b, h, l);
    }
    const o = [];
    if (Array.isArray(this.material))
      for (const f of this.material) {
        const l = f.opacity, b = f.transparent ? 1 : 0, h = new O.Color(f.color).toArray();
        o.push(l, b, ...h);
      }
    const r = Array.from(this.instanceMatrix.array);
    let c;
    return this.instanceColor !== null ? c = Array.from(this.instanceColor.array) : c = [], {
      position: s,
      normal: e,
      index: i,
      groups: n,
      materials: o,
      matrices: r,
      colors: c
    };
  }
  clone(s) {
    throw new Error(
      "Fragment meshes can't be cloned directly. Use mesh.fragment.clone instead!"
    );
  }
}
const Oe = 0, We = 1, Qe = 2, he = 2, Os = 1.25, be = 1, Vs = 6 * 4 + 4 + 4, Ts = 65535, ti = Math.pow(2, -24), Ls = Symbol("SKIP_GENERATION");
function si(a) {
  return a.index ? a.index.count : a.attributes.position.count;
}
function Zt(a) {
  return si(a) / 3;
}
function ei(a, t = ArrayBuffer) {
  return a > 65535 ? new Uint32Array(new t(4 * a)) : new Uint16Array(new t(2 * a));
}
function ii(a, t) {
  if (!a.index) {
    const s = a.attributes.position.count, e = t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer, i = ei(s, e);
    a.setIndex(new Te(i, 1));
    for (let n = 0; n < s; n++)
      i[n] = n;
  }
}
function Le(a) {
  const t = Zt(a), s = a.drawRange, e = s.start / 3, i = (s.start + s.count) / 3, n = Math.max(0, e), o = Math.min(t, i) - n;
  return [{
    offset: Math.floor(n),
    count: Math.floor(o)
  }];
}
function Ue(a) {
  if (!a.groups || !a.groups.length)
    return Le(a);
  const t = [], s = /* @__PURE__ */ new Set(), e = a.drawRange, i = e.start / 3, n = (e.start + e.count) / 3;
  for (const r of a.groups) {
    const c = r.start / 3, f = (r.start + r.count) / 3;
    s.add(Math.max(i, c)), s.add(Math.min(n, f));
  }
  const o = Array.from(s.values()).sort((r, c) => r - c);
  for (let r = 0; r < o.length - 1; r++) {
    const c = o[r], f = o[r + 1];
    t.push({
      offset: Math.floor(c),
      count: Math.floor(f - c)
    });
  }
  return t;
}
function ni(a) {
  if (a.groups.length === 0)
    return !1;
  const t = Zt(a), s = Ue(a).sort((n, o) => n.offset - o.offset), e = s[s.length - 1];
  e.count = Math.min(t - e.offset, e.count);
  let i = 0;
  return s.forEach(({ count: n }) => i += n), t !== i;
}
function R(a, t, s) {
  return s.min.x = t[a], s.min.y = t[a + 1], s.min.z = t[a + 2], s.max.x = t[a + 3], s.max.y = t[a + 4], s.max.z = t[a + 5], s;
}
function oi(a) {
  a[0] = a[1] = a[2] = 1 / 0, a[3] = a[4] = a[5] = -1 / 0;
}
function de(a) {
  let t = -1, s = -1 / 0;
  for (let e = 0; e < 3; e++) {
    const i = a[e + 3] - a[e];
    i > s && (s = i, t = e);
  }
  return t;
}
function ue(a, t) {
  t.set(a);
}
function _e(a, t, s) {
  let e, i;
  for (let n = 0; n < 3; n++) {
    const o = n + 3;
    e = a[n], i = t[n], s[n] = e < i ? e : i, e = a[o], i = t[o], s[o] = e > i ? e : i;
  }
}
function fs(a, t, s) {
  for (let e = 0; e < 3; e++) {
    const i = t[a + 2 * e], n = t[a + 2 * e + 1], o = i - n, r = i + n;
    o < s[e] && (s[e] = o), r > s[e + 3] && (s[e + 3] = r);
  }
}
function Wt(a) {
  const t = a[3] - a[0], s = a[4] - a[1], e = a[5] - a[2];
  return 2 * (t * s + s * e + e * t);
}
function Us(a, t, s, e, i = null) {
  let n = 1 / 0, o = 1 / 0, r = 1 / 0, c = -1 / 0, f = -1 / 0, l = -1 / 0, b = 1 / 0, h = 1 / 0, d = 1 / 0, _ = -1 / 0, I = -1 / 0, y = -1 / 0;
  const u = i !== null;
  for (let p = t * 6, w = (t + s) * 6; p < w; p += 6) {
    const m = a[p + 0], g = a[p + 1], A = m - g, F = m + g;
    A < n && (n = A), F > c && (c = F), u && m < b && (b = m), u && m > _ && (_ = m);
    const x = a[p + 2], C = a[p + 3], v = x - C, S = x + C;
    v < o && (o = v), S > f && (f = S), u && x < h && (h = x), u && x > I && (I = x);
    const V = a[p + 4], M = a[p + 5], T = V - M, D = V + M;
    T < r && (r = T), D > l && (l = D), u && V < d && (d = V), u && V > y && (y = V);
  }
  e[0] = n, e[1] = o, e[2] = r, e[3] = c, e[4] = f, e[5] = l, u && (i[0] = b, i[1] = h, i[2] = d, i[3] = _, i[4] = I, i[5] = y);
}
function ri(a, t, s, e) {
  let i = 1 / 0, n = 1 / 0, o = 1 / 0, r = -1 / 0, c = -1 / 0, f = -1 / 0;
  for (let l = t * 6, b = (t + s) * 6; l < b; l += 6) {
    const h = a[l + 0];
    h < i && (i = h), h > r && (r = h);
    const d = a[l + 2];
    d < n && (n = d), d > c && (c = d);
    const _ = a[l + 4];
    _ < o && (o = _), _ > f && (f = _);
  }
  e[0] = i, e[1] = n, e[2] = o, e[3] = r, e[4] = c, e[5] = f;
}
function ci(a, t) {
  oi(t);
  const s = a.attributes.position, e = a.index ? a.index.array : null, i = Zt(a), n = new Float32Array(i * 6), o = s.normalized, r = s.array, c = s.offset || 0;
  let f = 3;
  s.isInterleavedBufferAttribute && (f = s.data.stride);
  const l = ["getX", "getY", "getZ"];
  for (let b = 0; b < i; b++) {
    const h = b * 3, d = b * 6;
    let _ = h + 0, I = h + 1, y = h + 2;
    e && (_ = e[_], I = e[I], y = e[y]), o || (_ = _ * f + c, I = I * f + c, y = y * f + c);
    for (let u = 0; u < 3; u++) {
      let p, w, m;
      o ? (p = s[l[u]](_), w = s[l[u]](I), m = s[l[u]](y)) : (p = r[_ + u], w = r[I + u], m = r[y + u]);
      let g = p;
      w < g && (g = w), m < g && (g = m);
      let A = p;
      w > A && (A = w), m > A && (A = m);
      const F = (A - g) / 2, x = u * 2;
      n[d + x + 0] = g + F, n[d + x + 1] = F + (Math.abs(g) + F) * ti, g < t[u] && (t[u] = g), A > t[u + 3] && (t[u + 3] = A);
    }
  }
  return n;
}
const lt = 32, ai = (a, t) => a.candidate - t.candidate, wt = new Array(lt).fill().map(() => ({
  count: 0,
  bounds: new Float32Array(6),
  rightCacheBounds: new Float32Array(6),
  leftCacheBounds: new Float32Array(6),
  candidate: 0
})), ls = new Float32Array(6);
function fi(a, t, s, e, i, n) {
  let o = -1, r = 0;
  if (n === Oe)
    o = de(t), o !== -1 && (r = (t[o] + t[o + 3]) / 2);
  else if (n === We)
    o = de(a), o !== -1 && (r = li(s, e, i, o));
  else if (n === Qe) {
    const c = Wt(a);
    let f = Os * i;
    const l = e * 6, b = (e + i) * 6;
    for (let h = 0; h < 3; h++) {
      const d = t[h], y = (t[h + 3] - d) / lt;
      if (i < lt / 4) {
        const u = [...wt];
        u.length = i;
        let p = 0;
        for (let m = l; m < b; m += 6, p++) {
          const g = u[p];
          g.candidate = s[m + 2 * h], g.count = 0;
          const {
            bounds: A,
            leftCacheBounds: F,
            rightCacheBounds: x
          } = g;
          for (let C = 0; C < 3; C++)
            x[C] = 1 / 0, x[C + 3] = -1 / 0, F[C] = 1 / 0, F[C + 3] = -1 / 0, A[C] = 1 / 0, A[C + 3] = -1 / 0;
          fs(m, s, A);
        }
        u.sort(ai);
        let w = i;
        for (let m = 0; m < w; m++) {
          const g = u[m];
          for (; m + 1 < w && u[m + 1].candidate === g.candidate; )
            u.splice(m + 1, 1), w--;
        }
        for (let m = l; m < b; m += 6) {
          const g = s[m + 2 * h];
          for (let A = 0; A < w; A++) {
            const F = u[A];
            g >= F.candidate ? fs(m, s, F.rightCacheBounds) : (fs(m, s, F.leftCacheBounds), F.count++);
          }
        }
        for (let m = 0; m < w; m++) {
          const g = u[m], A = g.count, F = i - g.count, x = g.leftCacheBounds, C = g.rightCacheBounds;
          let v = 0;
          A !== 0 && (v = Wt(x) / c);
          let S = 0;
          F !== 0 && (S = Wt(C) / c);
          const V = be + Os * (v * A + S * F);
          V < f && (o = h, f = V, r = g.candidate);
        }
      } else {
        for (let w = 0; w < lt; w++) {
          const m = wt[w];
          m.count = 0, m.candidate = d + y + w * y;
          const g = m.bounds;
          for (let A = 0; A < 3; A++)
            g[A] = 1 / 0, g[A + 3] = -1 / 0;
        }
        for (let w = l; w < b; w += 6) {
          let A = ~~((s[w + 2 * h] - d) / y);
          A >= lt && (A = lt - 1);
          const F = wt[A];
          F.count++, fs(w, s, F.bounds);
        }
        const u = wt[lt - 1];
        ue(u.bounds, u.rightCacheBounds);
        for (let w = lt - 2; w >= 0; w--) {
          const m = wt[w], g = wt[w + 1];
          _e(m.bounds, g.rightCacheBounds, m.rightCacheBounds);
        }
        let p = 0;
        for (let w = 0; w < lt - 1; w++) {
          const m = wt[w], g = m.count, A = m.bounds, x = wt[w + 1].rightCacheBounds;
          g !== 0 && (p === 0 ? ue(A, ls) : _e(A, ls, ls)), p += g;
          let C = 0, v = 0;
          p !== 0 && (C = Wt(ls) / c);
          const S = i - p;
          S !== 0 && (v = Wt(x) / c);
          const V = be + Os * (C * p + v * S);
          V < f && (o = h, f = V, r = m.candidate);
        }
      }
    }
  } else
    console.warn(`MeshBVH: Invalid build strategy value ${n} used.`);
  return { axis: o, pos: r };
}
function li(a, t, s, e) {
  let i = 0;
  for (let n = t, o = t + s; n < o; n++)
    i += a[n * 6 + e * 2];
  return i / s;
}
class hs {
  constructor() {
  }
}
function hi(a, t, s, e, i, n) {
  let o = e, r = e + i - 1;
  const c = n.pos, f = n.axis * 2;
  for (; ; ) {
    for (; o <= r && s[o * 6 + f] < c; )
      o++;
    for (; o <= r && s[r * 6 + f] >= c; )
      r--;
    if (o < r) {
      for (let l = 0; l < 3; l++) {
        let b = t[o * 3 + l];
        t[o * 3 + l] = t[r * 3 + l], t[r * 3 + l] = b;
      }
      for (let l = 0; l < 6; l++) {
        let b = s[o * 6 + l];
        s[o * 6 + l] = s[r * 6 + l], s[r * 6 + l] = b;
      }
      o++, r--;
    } else
      return o;
  }
}
function bi(a, t, s, e, i, n) {
  let o = e, r = e + i - 1;
  const c = n.pos, f = n.axis * 2;
  for (; ; ) {
    for (; o <= r && s[o * 6 + f] < c; )
      o++;
    for (; o <= r && s[r * 6 + f] >= c; )
      r--;
    if (o < r) {
      let l = a[o];
      a[o] = a[r], a[r] = l;
      for (let b = 0; b < 6; b++) {
        let h = s[o * 6 + b];
        s[o * 6 + b] = s[r * 6 + b], s[r * 6 + b] = h;
      }
      o++, r--;
    } else
      return o;
  }
}
function di(a, t) {
  const s = (a.index ? a.index.count : a.attributes.position.count) / 3, e = s > 2 ** 16, i = e ? 4 : 2, n = t ? new SharedArrayBuffer(s * i) : new ArrayBuffer(s * i), o = e ? new Uint32Array(n) : new Uint16Array(n);
  for (let r = 0, c = o.length; r < c; r++)
    o[r] = r;
  return o;
}
function ui(a, t) {
  const s = a.geometry, e = s.index ? s.index.array : null, i = t.maxDepth, n = t.verbose, o = t.maxLeafTris, r = t.strategy, c = t.onProgress, f = Zt(s), l = a._indirectBuffer;
  let b = !1;
  const h = new Float32Array(6), d = new Float32Array(6), _ = ci(s, h), I = t.indirect ? bi : hi, y = [], u = t.indirect ? Le(s) : Ue(s);
  if (u.length === 1) {
    const m = u[0], g = new hs();
    g.boundingData = h, ri(_, m.offset, m.count, d), w(g, m.offset, m.count, d), y.push(g);
  } else
    for (let m of u) {
      const g = new hs();
      g.boundingData = new Float32Array(6), Us(_, m.offset, m.count, g.boundingData, d), w(g, m.offset, m.count, d), y.push(g);
    }
  return y;
  function p(m) {
    c && c(m / f);
  }
  function w(m, g, A, F = null, x = 0) {
    if (!b && x >= i && (b = !0, n && (console.warn(`MeshBVH: Max depth of ${i} reached when generating BVH. Consider increasing maxDepth.`), console.warn(s))), A <= o || x >= i)
      return p(g + A), m.offset = g, m.count = A, m;
    const C = fi(m.boundingData, F, _, g, A, r);
    if (C.axis === -1)
      return p(g + A), m.offset = g, m.count = A, m;
    const v = I(l, e, _, g, A, C);
    if (v === g || v === g + A)
      p(g + A), m.offset = g, m.count = A;
    else {
      m.splitAxis = C.axis;
      const S = new hs(), V = g, M = v - g;
      m.left = S, S.boundingData = new Float32Array(6), Us(_, V, M, S.boundingData, d), w(S, V, M, d, x + 1);
      const T = new hs(), D = v, L = A - M;
      m.right = T, T.boundingData = new Float32Array(6), Us(_, D, L, T.boundingData, d), w(T, D, L, d, x + 1);
    }
    return m;
  }
}
function _i(a, t) {
  const s = a.geometry;
  t.indirect && (a._indirectBuffer = di(s, t.useSharedArrayBuffer), ni(s) && !t.verbose && console.warn(
    'MeshBVH: Provided geometry contains groups that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.'
  )), a._indirectBuffer || ii(s, t);
  const e = ui(a, t);
  let i, n, o;
  const r = [], c = t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
  for (let b = 0; b < e.length; b++) {
    const h = e[b];
    let d = f(h);
    const _ = new c(Vs * d);
    i = new Float32Array(_), n = new Uint32Array(_), o = new Uint16Array(_), l(0, h), r.push(_);
  }
  a._roots = r;
  return;
  function f(b) {
    return b.count ? 1 : 1 + f(b.left) + f(b.right);
  }
  function l(b, h) {
    const d = b / 4, _ = b / 2, I = !!h.count, y = h.boundingData;
    for (let u = 0; u < 6; u++)
      i[d + u] = y[u];
    if (I) {
      const u = h.offset, p = h.count;
      return n[d + 6] = u, o[_ + 14] = p, o[_ + 15] = Ts, b + Vs;
    } else {
      const u = h.left, p = h.right, w = h.splitAxis;
      let m;
      if (m = l(b + Vs, u), m / 4 > Math.pow(2, 32))
        throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");
      return n[d + 6] = m / 4, m = l(m, p), n[d + 7] = w, m;
    }
  }
}
class pt {
  constructor() {
    this.min = 1 / 0, this.max = -1 / 0;
  }
  setFromPointsField(t, s) {
    let e = 1 / 0, i = -1 / 0;
    for (let n = 0, o = t.length; n < o; n++) {
      const c = t[n][s];
      e = c < e ? c : e, i = c > i ? c : i;
    }
    this.min = e, this.max = i;
  }
  setFromPoints(t, s) {
    let e = 1 / 0, i = -1 / 0;
    for (let n = 0, o = s.length; n < o; n++) {
      const r = s[n], c = t.dot(r);
      e = c < e ? c : e, i = c > i ? c : i;
    }
    this.min = e, this.max = i;
  }
  isSeparated(t) {
    return this.min > t.max || t.min > this.max;
  }
}
pt.prototype.setFromBox = function() {
  const a = new B();
  return function(s, e) {
    const i = e.min, n = e.max;
    let o = 1 / 0, r = -1 / 0;
    for (let c = 0; c <= 1; c++)
      for (let f = 0; f <= 1; f++)
        for (let l = 0; l <= 1; l++) {
          a.x = i.x * c + n.x * (1 - c), a.y = i.y * f + n.y * (1 - f), a.z = i.z * l + n.z * (1 - l);
          const b = s.dot(a);
          o = Math.min(b, o), r = Math.max(b, r);
        }
    this.min = o, this.max = r;
  };
}();
const pi = function() {
  const a = new B(), t = new B(), s = new B();
  return function(i, n, o) {
    const r = i.start, c = a, f = n.start, l = t;
    s.subVectors(r, f), a.subVectors(i.end, i.start), t.subVectors(n.end, n.start);
    const b = s.dot(l), h = l.dot(c), d = l.dot(l), _ = s.dot(c), y = c.dot(c) * d - h * h;
    let u, p;
    y !== 0 ? u = (b * h - _ * d) / y : u = 0, p = (b + u * h) / d, o.x = u, o.y = p;
  };
}(), oe = function() {
  const a = new Yt(), t = new B(), s = new B();
  return function(i, n, o, r) {
    pi(i, n, a);
    let c = a.x, f = a.y;
    if (c >= 0 && c <= 1 && f >= 0 && f <= 1) {
      i.at(c, o), n.at(f, r);
      return;
    } else if (c >= 0 && c <= 1) {
      f < 0 ? n.at(0, r) : n.at(1, r), i.closestPointToPoint(r, !0, o);
      return;
    } else if (f >= 0 && f <= 1) {
      c < 0 ? i.at(0, o) : i.at(1, o), n.closestPointToPoint(o, !0, r);
      return;
    } else {
      let l;
      c < 0 ? l = i.start : l = i.end;
      let b;
      f < 0 ? b = n.start : b = n.end;
      const h = t, d = s;
      if (i.closestPointToPoint(b, !0, t), n.closestPointToPoint(l, !0, s), h.distanceToSquared(b) <= d.distanceToSquared(l)) {
        o.copy(h), r.copy(b);
        return;
      } else {
        o.copy(l), r.copy(d);
        return;
      }
    }
  };
}(), mi = function() {
  const a = new B(), t = new B(), s = new Be(), e = new _t();
  return function(n, o) {
    const { radius: r, center: c } = n, { a: f, b: l, c: b } = o;
    if (e.start = f, e.end = l, e.closestPointToPoint(c, !0, a).distanceTo(c) <= r || (e.start = f, e.end = b, e.closestPointToPoint(c, !0, a).distanceTo(c) <= r) || (e.start = l, e.end = b, e.closestPointToPoint(c, !0, a).distanceTo(c) <= r))
      return !0;
    const I = o.getPlane(s);
    if (Math.abs(I.distanceToPoint(c)) <= r) {
      const u = I.projectPoint(c, t);
      if (o.containsPoint(u))
        return !0;
    }
    return !1;
  };
}(), yi = 1e-15;
function zs(a) {
  return Math.abs(a) < yi;
}
class rt extends ns {
  constructor(...t) {
    super(...t), this.isExtendedTriangle = !0, this.satAxes = new Array(4).fill().map(() => new B()), this.satBounds = new Array(4).fill().map(() => new pt()), this.points = [this.a, this.b, this.c], this.sphere = new Xe(), this.plane = new Be(), this.needsUpdate = !0;
  }
  intersectsSphere(t) {
    return mi(t, this);
  }
  update() {
    const t = this.a, s = this.b, e = this.c, i = this.points, n = this.satAxes, o = this.satBounds, r = n[0], c = o[0];
    this.getNormal(r), c.setFromPoints(r, i);
    const f = n[1], l = o[1];
    f.subVectors(t, s), l.setFromPoints(f, i);
    const b = n[2], h = o[2];
    b.subVectors(s, e), h.setFromPoints(b, i);
    const d = n[3], _ = o[3];
    d.subVectors(e, t), _.setFromPoints(d, i), this.sphere.setFromPoints(this.points), this.plane.setFromNormalAndCoplanarPoint(r, t), this.needsUpdate = !1;
  }
}
rt.prototype.closestPointToSegment = function() {
  const a = new B(), t = new B(), s = new _t();
  return function(i, n = null, o = null) {
    const { start: r, end: c } = i, f = this.points;
    let l, b = 1 / 0;
    for (let h = 0; h < 3; h++) {
      const d = (h + 1) % 3;
      s.start.copy(f[h]), s.end.copy(f[d]), oe(s, i, a, t), l = a.distanceToSquared(t), l < b && (b = l, n && n.copy(a), o && o.copy(t));
    }
    return this.closestPointToPoint(r, a), l = r.distanceToSquared(a), l < b && (b = l, n && n.copy(a), o && o.copy(r)), this.closestPointToPoint(c, a), l = c.distanceToSquared(a), l < b && (b = l, n && n.copy(a), o && o.copy(c)), Math.sqrt(b);
  };
}();
rt.prototype.intersectsTriangle = function() {
  const a = new rt(), t = new Array(3), s = new Array(3), e = new pt(), i = new pt(), n = new B(), o = new B(), r = new B(), c = new B(), f = new B(), l = new _t(), b = new _t(), h = new _t(), d = new B();
  function _(I, y, u) {
    const p = I.points;
    let w = 0, m = -1;
    for (let g = 0; g < 3; g++) {
      const { start: A, end: F } = l;
      A.copy(p[g]), F.copy(p[(g + 1) % 3]), l.delta(o);
      const x = zs(y.distanceToPoint(A));
      if (zs(y.normal.dot(o)) && x) {
        u.copy(l), w = 2;
        break;
      }
      const C = y.intersectLine(l, d);
      if (!C && x && d.copy(A), (C || x) && !zs(d.distanceTo(F))) {
        if (w <= 1)
          (w === 1 ? u.start : u.end).copy(d), x && (m = w);
        else if (w >= 2) {
          (m === 1 ? u.start : u.end).copy(d), w = 2;
          break;
        }
        if (w++, w === 2 && m === -1)
          break;
      }
    }
    return w;
  }
  return function(y, u = null, p = !1) {
    this.needsUpdate && this.update(), y.isExtendedTriangle ? y.needsUpdate && y.update() : (a.copy(y), a.update(), y = a);
    const w = this.plane, m = y.plane;
    if (Math.abs(w.normal.dot(m.normal)) > 1 - 1e-10) {
      const g = this.satBounds, A = this.satAxes;
      s[0] = y.a, s[1] = y.b, s[2] = y.c;
      for (let C = 0; C < 4; C++) {
        const v = g[C], S = A[C];
        if (e.setFromPoints(S, s), v.isSeparated(e))
          return !1;
      }
      const F = y.satBounds, x = y.satAxes;
      t[0] = this.a, t[1] = this.b, t[2] = this.c;
      for (let C = 0; C < 4; C++) {
        const v = F[C], S = x[C];
        if (e.setFromPoints(S, t), v.isSeparated(e))
          return !1;
      }
      for (let C = 0; C < 4; C++) {
        const v = A[C];
        for (let S = 0; S < 4; S++) {
          const V = x[S];
          if (n.crossVectors(v, V), e.setFromPoints(n, t), i.setFromPoints(n, s), e.isSeparated(i))
            return !1;
        }
      }
      return u && (p || console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."), u.start.set(0, 0, 0), u.end.set(0, 0, 0)), !0;
    } else {
      const g = _(this, m, b);
      if (g === 1 && y.containsPoint(b.end))
        return u && (u.start.copy(b.end), u.end.copy(b.end)), !0;
      if (g !== 2)
        return !1;
      const A = _(y, w, h);
      if (A === 1 && this.containsPoint(h.end))
        return u && (u.start.copy(h.end), u.end.copy(h.end)), !0;
      if (A !== 2)
        return !1;
      if (b.delta(r), h.delta(c), r.dot(c) < 0) {
        let M = h.start;
        h.start = h.end, h.end = M;
      }
      const F = b.start.dot(r), x = b.end.dot(r), C = h.start.dot(r), v = h.end.dot(r), S = x < C, V = F < v;
      return F !== v && C !== x && S === V ? !1 : (u && (f.subVectors(b.start, h.start), f.dot(r) > 0 ? u.start.copy(b.start) : u.start.copy(h.start), f.subVectors(b.end, h.end), f.dot(r) < 0 ? u.end.copy(b.end) : u.end.copy(h.end)), !0);
    }
  };
}();
rt.prototype.distanceToPoint = function() {
  const a = new B();
  return function(s) {
    return this.closestPointToPoint(s, a), s.distanceTo(a);
  };
}();
rt.prototype.distanceToTriangle = function() {
  const a = new B(), t = new B(), s = ["a", "b", "c"], e = new _t(), i = new _t();
  return function(o, r = null, c = null) {
    const f = r || c ? e : null;
    if (this.intersectsTriangle(o, f))
      return (r || c) && (r && f.getCenter(r), c && f.getCenter(c)), 0;
    let l = 1 / 0;
    for (let b = 0; b < 3; b++) {
      let h;
      const d = s[b], _ = o[d];
      this.closestPointToPoint(_, a), h = _.distanceToSquared(a), h < l && (l = h, r && r.copy(a), c && c.copy(_));
      const I = this[d];
      o.closestPointToPoint(I, a), h = I.distanceToSquared(a), h < l && (l = h, r && r.copy(I), c && c.copy(a));
    }
    for (let b = 0; b < 3; b++) {
      const h = s[b], d = s[(b + 1) % 3];
      e.set(this[h], this[d]);
      for (let _ = 0; _ < 3; _++) {
        const I = s[_], y = s[(_ + 1) % 3];
        i.set(o[I], o[y]), oe(e, i, a, t);
        const u = a.distanceToSquared(t);
        u < l && (l = u, r && r.copy(a), c && c.copy(t));
      }
    }
    return Math.sqrt(l);
  };
}();
class X {
  constructor(t, s, e) {
    this.isOrientedBox = !0, this.min = new B(), this.max = new B(), this.matrix = new Vt(), this.invMatrix = new Vt(), this.points = new Array(8).fill().map(() => new B()), this.satAxes = new Array(3).fill().map(() => new B()), this.satBounds = new Array(3).fill().map(() => new pt()), this.alignedSatBounds = new Array(3).fill().map(() => new pt()), this.needsUpdate = !1, t && this.min.copy(t), s && this.max.copy(s), e && this.matrix.copy(e);
  }
  set(t, s, e) {
    this.min.copy(t), this.max.copy(s), this.matrix.copy(e), this.needsUpdate = !0;
  }
  copy(t) {
    this.min.copy(t.min), this.max.copy(t.max), this.matrix.copy(t.matrix), this.needsUpdate = !0;
  }
}
X.prototype.update = /* @__PURE__ */ function() {
  return function() {
    const t = this.matrix, s = this.min, e = this.max, i = this.points;
    for (let f = 0; f <= 1; f++)
      for (let l = 0; l <= 1; l++)
        for (let b = 0; b <= 1; b++) {
          const h = 1 * f | 2 * l | 4 * b, d = i[h];
          d.x = f ? e.x : s.x, d.y = l ? e.y : s.y, d.z = b ? e.z : s.z, d.applyMatrix4(t);
        }
    const n = this.satBounds, o = this.satAxes, r = i[0];
    for (let f = 0; f < 3; f++) {
      const l = o[f], b = n[f], h = 1 << f, d = i[h];
      l.subVectors(r, d), b.setFromPoints(l, i);
    }
    const c = this.alignedSatBounds;
    c[0].setFromPointsField(i, "x"), c[1].setFromPointsField(i, "y"), c[2].setFromPointsField(i, "z"), this.invMatrix.copy(this.matrix).invert(), this.needsUpdate = !1;
  };
}();
X.prototype.intersectsBox = function() {
  const a = new pt();
  return function(s) {
    this.needsUpdate && this.update();
    const e = s.min, i = s.max, n = this.satBounds, o = this.satAxes, r = this.alignedSatBounds;
    if (a.min = e.x, a.max = i.x, r[0].isSeparated(a) || (a.min = e.y, a.max = i.y, r[1].isSeparated(a)) || (a.min = e.z, a.max = i.z, r[2].isSeparated(a)))
      return !1;
    for (let c = 0; c < 3; c++) {
      const f = o[c], l = n[c];
      if (a.setFromBox(f, s), l.isSeparated(a))
        return !1;
    }
    return !0;
  };
}();
X.prototype.intersectsTriangle = function() {
  const a = new rt(), t = new Array(3), s = new pt(), e = new pt(), i = new B();
  return function(o) {
    this.needsUpdate && this.update(), o.isExtendedTriangle ? o.needsUpdate && o.update() : (a.copy(o), a.update(), o = a);
    const r = this.satBounds, c = this.satAxes;
    t[0] = o.a, t[1] = o.b, t[2] = o.c;
    for (let h = 0; h < 3; h++) {
      const d = r[h], _ = c[h];
      if (s.setFromPoints(_, t), d.isSeparated(s))
        return !1;
    }
    const f = o.satBounds, l = o.satAxes, b = this.points;
    for (let h = 0; h < 3; h++) {
      const d = f[h], _ = l[h];
      if (s.setFromPoints(_, b), d.isSeparated(s))
        return !1;
    }
    for (let h = 0; h < 3; h++) {
      const d = c[h];
      for (let _ = 0; _ < 4; _++) {
        const I = l[_];
        if (i.crossVectors(d, I), s.setFromPoints(i, t), e.setFromPoints(i, b), s.isSeparated(e))
          return !1;
      }
    }
    return !0;
  };
}();
X.prototype.closestPointToPoint = /* @__PURE__ */ function() {
  return function(t, s) {
    return this.needsUpdate && this.update(), s.copy(t).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix), s;
  };
}();
X.prototype.distanceToPoint = function() {
  const a = new B();
  return function(s) {
    return this.closestPointToPoint(s, a), s.distanceTo(a);
  };
}();
X.prototype.distanceToBox = function() {
  const a = ["x", "y", "z"], t = new Array(12).fill().map(() => new _t()), s = new Array(12).fill().map(() => new _t()), e = new B(), i = new B();
  return function(o, r = 0, c = null, f = null) {
    if (this.needsUpdate && this.update(), this.intersectsBox(o))
      return (c || f) && (o.getCenter(i), this.closestPointToPoint(i, e), o.closestPointToPoint(e, i), c && c.copy(e), f && f.copy(i)), 0;
    const l = r * r, b = o.min, h = o.max, d = this.points;
    let _ = 1 / 0;
    for (let y = 0; y < 8; y++) {
      const u = d[y];
      i.copy(u).clamp(b, h);
      const p = u.distanceToSquared(i);
      if (p < _ && (_ = p, c && c.copy(u), f && f.copy(i), p < l))
        return Math.sqrt(p);
    }
    let I = 0;
    for (let y = 0; y < 3; y++)
      for (let u = 0; u <= 1; u++)
        for (let p = 0; p <= 1; p++) {
          const w = (y + 1) % 3, m = (y + 2) % 3, g = u << w | p << m, A = 1 << y | u << w | p << m, F = d[g], x = d[A];
          t[I].set(F, x);
          const v = a[y], S = a[w], V = a[m], M = s[I], T = M.start, D = M.end;
          T[v] = b[v], T[S] = u ? b[S] : h[S], T[V] = p ? b[V] : h[S], D[v] = h[v], D[S] = u ? b[S] : h[S], D[V] = p ? b[V] : h[S], I++;
        }
    for (let y = 0; y <= 1; y++)
      for (let u = 0; u <= 1; u++)
        for (let p = 0; p <= 1; p++) {
          i.x = y ? h.x : b.x, i.y = u ? h.y : b.y, i.z = p ? h.z : b.z, this.closestPointToPoint(i, e);
          const w = i.distanceToSquared(e);
          if (w < _ && (_ = w, c && c.copy(e), f && f.copy(i), w < l))
            return Math.sqrt(w);
        }
    for (let y = 0; y < 12; y++) {
      const u = t[y];
      for (let p = 0; p < 12; p++) {
        const w = s[p];
        oe(u, w, e, i);
        const m = e.distanceToSquared(i);
        if (m < _ && (_ = m, c && c.copy(e), f && f.copy(i), m < l))
          return Math.sqrt(m);
      }
    }
    return Math.sqrt(_);
  };
}();
class re {
  constructor(t) {
    this._getNewPrimitive = t, this._primitives = [];
  }
  getPrimitive() {
    const t = this._primitives;
    return t.length === 0 ? this._getNewPrimitive() : t.pop();
  }
  releasePrimitive(t) {
    this._primitives.push(t);
  }
}
class gi extends re {
  constructor() {
    super(() => new rt());
  }
}
const tt = /* @__PURE__ */ new gi();
function J(a, t) {
  return t[a + 15] === 65535;
}
function W(a, t) {
  return t[a + 6];
}
function st(a, t) {
  return t[a + 14];
}
function et(a) {
  return a + 8;
}
function it(a, t) {
  return t[a + 6];
}
function ze(a, t) {
  return t[a + 7];
}
class wi {
  constructor() {
    this.float32Array = null, this.uint16Array = null, this.uint32Array = null;
    const t = [];
    let s = null;
    this.setBuffer = (e) => {
      s && t.push(s), s = e, this.float32Array = new Float32Array(e), this.uint16Array = new Uint16Array(e), this.uint32Array = new Uint32Array(e);
    }, this.clearBuffer = () => {
      s = null, this.float32Array = null, this.uint16Array = null, this.uint32Array = null, t.length !== 0 && this.setBuffer(t.pop());
    };
  }
}
const G = new wi();
let vt, Xt;
const Et = [], bs = /* @__PURE__ */ new re(() => new ct());
function Ii(a, t, s, e, i, n) {
  vt = bs.getPrimitive(), Xt = bs.getPrimitive(), Et.push(vt, Xt), G.setBuffer(a._roots[t]);
  const o = Xs(0, a.geometry, s, e, i, n);
  G.clearBuffer(), bs.releasePrimitive(vt), bs.releasePrimitive(Xt), Et.pop(), Et.pop();
  const r = Et.length;
  return r > 0 && (Xt = Et[r - 1], vt = Et[r - 2]), o;
}
function Xs(a, t, s, e, i = null, n = 0, o = 0) {
  const { float32Array: r, uint16Array: c, uint32Array: f } = G;
  let l = a * 2;
  if (J(l, c)) {
    const h = W(a, f), d = st(l, c);
    return R(a, r, vt), e(h, d, !1, o, n + a, vt);
  } else {
    let v = function(V) {
      const { uint16Array: M, uint32Array: T } = G;
      let D = V * 2;
      for (; !J(D, M); )
        V = et(V), D = V * 2;
      return W(V, T);
    }, S = function(V) {
      const { uint16Array: M, uint32Array: T } = G;
      let D = V * 2;
      for (; !J(D, M); )
        V = it(V, T), D = V * 2;
      return W(V, T) + st(D, M);
    };
    const h = et(a), d = it(a, f);
    let _ = h, I = d, y, u, p, w;
    if (i && (p = vt, w = Xt, R(_, r, p), R(I, r, w), y = i(p), u = i(w), u < y)) {
      _ = d, I = h;
      const V = y;
      y = u, u = V, p = w;
    }
    p || (p = vt, R(_, r, p));
    const m = J(_ * 2, c), g = s(p, m, y, o + 1, n + _);
    let A;
    if (g === he) {
      const V = v(_), T = S(_) - V;
      A = e(V, T, !0, o + 1, n + _, p);
    } else
      A = g && Xs(
        _,
        t,
        s,
        e,
        i,
        n,
        o + 1
      );
    if (A)
      return !0;
    w = Xt, R(I, r, w);
    const F = J(I * 2, c), x = s(w, F, u, o + 1, n + I);
    let C;
    if (x === he) {
      const V = v(I), T = S(I) - V;
      C = e(V, T, !0, o + 1, n + I, w);
    } else
      C = x && Xs(
        I,
        t,
        s,
        e,
        i,
        n,
        o + 1
      );
    return !!C;
  }
}
const Qt = /* @__PURE__ */ new B(), Es = /* @__PURE__ */ new B();
function xi(a, t, s = {}, e = 0, i = 1 / 0) {
  const n = e * e, o = i * i;
  let r = 1 / 0, c = null;
  if (a.shapecast(
    {
      boundsTraverseOrder: (l) => (Qt.copy(t).clamp(l.min, l.max), Qt.distanceToSquared(t)),
      intersectsBounds: (l, b, h) => h < r && h < o,
      intersectsTriangle: (l, b) => {
        l.closestPointToPoint(t, Qt);
        const h = t.distanceToSquared(Qt);
        return h < r && (Es.copy(Qt), r = h, c = b), h < n;
      }
    }
  ), r === 1 / 0)
    return null;
  const f = Math.sqrt(r);
  return s.point ? s.point.copy(Es) : s.point = Es.clone(), s.distance = f, s.faceIndex = c, s;
}
const Gt = /* @__PURE__ */ new B(), Rt = /* @__PURE__ */ new B(), Nt = /* @__PURE__ */ new B(), ds = /* @__PURE__ */ new Yt(), us = /* @__PURE__ */ new Yt(), _s = /* @__PURE__ */ new Yt(), pe = /* @__PURE__ */ new B(), me = /* @__PURE__ */ new B(), ye = /* @__PURE__ */ new B(), ps = /* @__PURE__ */ new B();
function Ai(a, t, s, e, i, n) {
  let o;
  return n === Ye ? o = a.intersectTriangle(e, s, t, !0, i) : o = a.intersectTriangle(t, s, e, n !== Ze, i), o === null ? null : {
    distance: a.origin.distanceTo(i),
    point: i.clone()
  };
}
function vi(a, t, s, e, i, n, o, r, c) {
  Gt.fromBufferAttribute(t, n), Rt.fromBufferAttribute(t, o), Nt.fromBufferAttribute(t, r);
  const f = Ai(a, Gt, Rt, Nt, ps, c);
  if (f) {
    e && (ds.fromBufferAttribute(e, n), us.fromBufferAttribute(e, o), _s.fromBufferAttribute(e, r), f.uv = ns.getInterpolation(ps, Gt, Rt, Nt, ds, us, _s, new Yt())), i && (ds.fromBufferAttribute(i, n), us.fromBufferAttribute(i, o), _s.fromBufferAttribute(i, r), f.uv1 = ns.getInterpolation(ps, Gt, Rt, Nt, ds, us, _s, new Yt())), s && (pe.fromBufferAttribute(s, n), me.fromBufferAttribute(s, o), ye.fromBufferAttribute(s, r), f.normal = ns.getInterpolation(ps, Gt, Rt, Nt, pe, me, ye, new B()), f.normal.dot(a.direction) > 0 && f.normal.multiplyScalar(-1));
    const l = {
      a: n,
      b: o,
      c: r,
      normal: new B(),
      materialIndex: 0
    };
    ns.getNormal(Gt, Rt, Nt, l.normal), f.face = l, f.faceIndex = n;
  }
  return f;
}
function Bs(a, t, s, e, i) {
  const n = e * 3;
  let o = n + 0, r = n + 1, c = n + 2;
  const f = a.index;
  a.index && (o = f.getX(o), r = f.getX(r), c = f.getX(c));
  const { position: l, normal: b, uv: h, uv1: d } = a.attributes, _ = vi(s, l, b, h, d, o, r, c, t);
  return _ ? (_.faceIndex = e, i && i.push(_), _) : null;
}
function q(a, t, s, e) {
  const i = a.a, n = a.b, o = a.c;
  let r = t, c = t + 1, f = t + 2;
  s && (r = s.getX(r), c = s.getX(c), f = s.getX(f)), i.x = e.getX(r), i.y = e.getY(r), i.z = e.getZ(r), n.x = e.getX(c), n.y = e.getY(c), n.z = e.getZ(c), o.x = e.getX(f), o.y = e.getY(f), o.z = e.getZ(f);
}
function Vi(a, t, s, e, i, n) {
  const { geometry: o, _indirectBuffer: r } = a;
  for (let c = e, f = e + i; c < f; c++)
    Bs(o, t, s, c, n);
}
function Fi(a, t, s, e, i) {
  const { geometry: n, _indirectBuffer: o } = a;
  let r = 1 / 0, c = null;
  for (let f = e, l = e + i; f < l; f++) {
    let b;
    b = Bs(n, t, s, f), b && b.distance < r && (c = b, r = b.distance);
  }
  return c;
}
function Ci(a, t, s, e, i, n, o) {
  const { geometry: r } = s, { index: c } = r, f = r.attributes.position;
  for (let l = a, b = t + a; l < b; l++) {
    let h;
    if (h = l, q(o, h * 3, c, f), o.needsUpdate = !0, e(o, h, i, n))
      return !0;
  }
  return !1;
}
function Mi(a, t = null) {
  t && Array.isArray(t) && (t = new Set(t));
  const s = a.geometry, e = s.index ? s.index.array : null, i = s.attributes.position;
  let n, o, r, c, f = 0;
  const l = a._roots;
  for (let h = 0, d = l.length; h < d; h++)
    n = l[h], o = new Uint32Array(n), r = new Uint16Array(n), c = new Float32Array(n), b(0, f), f += n.byteLength;
  function b(h, d, _ = !1) {
    const I = h * 2;
    if (r[I + 15] === Ts) {
      const u = o[h + 6], p = r[I + 14];
      let w = 1 / 0, m = 1 / 0, g = 1 / 0, A = -1 / 0, F = -1 / 0, x = -1 / 0;
      for (let C = 3 * u, v = 3 * (u + p); C < v; C++) {
        let S = e[C];
        const V = i.getX(S), M = i.getY(S), T = i.getZ(S);
        V < w && (w = V), V > A && (A = V), M < m && (m = M), M > F && (F = M), T < g && (g = T), T > x && (x = T);
      }
      return c[h + 0] !== w || c[h + 1] !== m || c[h + 2] !== g || c[h + 3] !== A || c[h + 4] !== F || c[h + 5] !== x ? (c[h + 0] = w, c[h + 1] = m, c[h + 2] = g, c[h + 3] = A, c[h + 4] = F, c[h + 5] = x, !0) : !1;
    } else {
      const u = h + 8, p = o[h + 6], w = u + d, m = p + d;
      let g = _, A = !1, F = !1;
      t ? g || (A = t.has(w), F = t.has(m), g = !A && !F) : (A = !0, F = !0);
      const x = g || A, C = g || F;
      let v = !1;
      x && (v = b(u, d, g));
      let S = !1;
      C && (S = b(p, d, g));
      const V = v || S;
      if (V)
        for (let M = 0; M < 3; M++) {
          const T = u + M, D = p + M, L = c[T], H = c[T + 3], Y = c[D], Z = c[D + 3];
          c[h + M] = L < Y ? L : Y, c[h + M + 3] = H > Z ? H : Z;
        }
      return V;
    }
  }
}
const ge = /* @__PURE__ */ new ct();
function Ft(a, t, s, e) {
  return R(a, t, ge), s.intersectBox(ge, e);
}
function Pi(a, t, s, e, i, n) {
  const { geometry: o, _indirectBuffer: r } = a;
  for (let c = e, f = e + i; c < f; c++) {
    let l = r ? r[c] : c;
    Bs(o, t, s, l, n);
  }
}
function Si(a, t, s, e, i) {
  const { geometry: n, _indirectBuffer: o } = a;
  let r = 1 / 0, c = null;
  for (let f = e, l = e + i; f < l; f++) {
    let b;
    b = Bs(n, t, s, o ? o[f] : f), b && b.distance < r && (c = b, r = b.distance);
  }
  return c;
}
function Ti(a, t, s, e, i, n, o) {
  const { geometry: r } = s, { index: c } = r, f = r.attributes.position;
  for (let l = a, b = t + a; l < b; l++) {
    let h;
    if (h = s.resolveTriangleIndex(l), q(o, h * 3, c, f), o.needsUpdate = !0, e(o, h, i, n))
      return !0;
  }
  return !1;
}
const we = /* @__PURE__ */ new B();
function Bi(a, t, s, e, i) {
  G.setBuffer(a._roots[t]), Ys(0, a, s, e, i), G.clearBuffer();
}
function Ys(a, t, s, e, i) {
  const { float32Array: n, uint16Array: o, uint32Array: r } = G, c = a * 2;
  if (J(c, o)) {
    const l = W(a, r), b = st(c, o);
    Vi(t, s, e, l, b, i);
  } else {
    const l = et(a);
    Ft(l, n, e, we) && Ys(l, t, s, e, i);
    const b = it(a, r);
    Ft(b, n, e, we) && Ys(b, t, s, e, i);
  }
}
const Ie = /* @__PURE__ */ new B(), Di = ["x", "y", "z"];
function Oi(a, t, s, e) {
  G.setBuffer(a._roots[t]);
  const i = Zs(0, a, s, e);
  return G.clearBuffer(), i;
}
function Zs(a, t, s, e) {
  const { float32Array: i, uint16Array: n, uint32Array: o } = G;
  let r = a * 2;
  if (J(r, n)) {
    const f = W(a, o), l = st(r, n);
    return Fi(t, s, e, f, l);
  } else {
    const f = ze(a, o), l = Di[f], h = e.direction[l] >= 0;
    let d, _;
    h ? (d = et(a), _ = it(a, o)) : (d = it(a, o), _ = et(a));
    const y = Ft(d, i, e, Ie) ? Zs(d, t, s, e) : null;
    if (y) {
      const w = y.point[l];
      if (h ? w <= i[_ + f] : (
        // min bounding data
        w >= i[_ + f + 3]
      ))
        return y;
    }
    const p = Ft(_, i, e, Ie) ? Zs(_, t, s, e) : null;
    return y && p ? y.distance <= p.distance ? y : p : y || p || null;
  }
}
const ms = /* @__PURE__ */ new ct(), kt = /* @__PURE__ */ new rt(), qt = /* @__PURE__ */ new rt(), ts = /* @__PURE__ */ new Vt(), xe = /* @__PURE__ */ new X(), ys = /* @__PURE__ */ new X();
function Li(a, t, s, e) {
  G.setBuffer(a._roots[t]);
  const i = Js(0, a, s, e);
  return G.clearBuffer(), i;
}
function Js(a, t, s, e, i = null) {
  const { float32Array: n, uint16Array: o, uint32Array: r } = G;
  let c = a * 2;
  if (i === null && (s.boundingBox || s.computeBoundingBox(), xe.set(s.boundingBox.min, s.boundingBox.max, e), i = xe), J(c, o)) {
    const l = t.geometry, b = l.index, h = l.attributes.position, d = s.index, _ = s.attributes.position, I = W(a, r), y = st(c, o);
    if (ts.copy(e).invert(), s.boundsTree)
      return R(a, n, ys), ys.matrix.copy(ts), ys.needsUpdate = !0, s.boundsTree.shapecast({
        intersectsBounds: (p) => ys.intersectsBox(p),
        intersectsTriangle: (p) => {
          p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
          for (let w = I * 3, m = (y + I) * 3; w < m; w += 3)
            if (q(qt, w, b, h), qt.needsUpdate = !0, p.intersectsTriangle(qt))
              return !0;
          return !1;
        }
      });
    for (let u = I * 3, p = (y + I) * 3; u < p; u += 3) {
      q(kt, u, b, h), kt.a.applyMatrix4(ts), kt.b.applyMatrix4(ts), kt.c.applyMatrix4(ts), kt.needsUpdate = !0;
      for (let w = 0, m = d.count; w < m; w += 3)
        if (q(qt, w, d, _), qt.needsUpdate = !0, kt.intersectsTriangle(qt))
          return !0;
    }
  } else {
    const l = a + 8, b = r[a + 6];
    return R(l, n, ms), !!(i.intersectsBox(ms) && Js(l, t, s, e, i) || (R(b, n, ms), i.intersectsBox(ms) && Js(b, t, s, e, i)));
  }
}
const gs = /* @__PURE__ */ new Vt(), Gs = /* @__PURE__ */ new X(), ss = /* @__PURE__ */ new X(), Ui = /* @__PURE__ */ new B(), zi = /* @__PURE__ */ new B(), Ei = /* @__PURE__ */ new B(), Gi = /* @__PURE__ */ new B();
function Ri(a, t, s, e = {}, i = {}, n = 0, o = 1 / 0) {
  t.boundingBox || t.computeBoundingBox(), Gs.set(t.boundingBox.min, t.boundingBox.max, s), Gs.needsUpdate = !0;
  const r = a.geometry, c = r.attributes.position, f = r.index, l = t.attributes.position, b = t.index, h = tt.getPrimitive(), d = tt.getPrimitive();
  let _ = Ui, I = zi, y = null, u = null;
  i && (y = Ei, u = Gi);
  let p = 1 / 0, w = null, m = null;
  return gs.copy(s).invert(), ss.matrix.copy(gs), a.shapecast(
    {
      boundsTraverseOrder: (g) => Gs.distanceToBox(g),
      intersectsBounds: (g, A, F) => F < p && F < o ? (A && (ss.min.copy(g.min), ss.max.copy(g.max), ss.needsUpdate = !0), !0) : !1,
      intersectsRange: (g, A) => {
        if (t.boundsTree)
          return t.boundsTree.shapecast({
            boundsTraverseOrder: (x) => ss.distanceToBox(x),
            intersectsBounds: (x, C, v) => v < p && v < o,
            intersectsRange: (x, C) => {
              for (let v = x, S = x + C; v < S; v++) {
                q(d, 3 * v, b, l), d.a.applyMatrix4(s), d.b.applyMatrix4(s), d.c.applyMatrix4(s), d.needsUpdate = !0;
                for (let V = g, M = g + A; V < M; V++) {
                  q(h, 3 * V, f, c), h.needsUpdate = !0;
                  const T = h.distanceToTriangle(d, _, y);
                  if (T < p && (I.copy(_), u && u.copy(y), p = T, w = V, m = v), T < n)
                    return !0;
                }
              }
            }
          });
        {
          const F = Zt(t);
          for (let x = 0, C = F; x < C; x++) {
            q(d, 3 * x, b, l), d.a.applyMatrix4(s), d.b.applyMatrix4(s), d.c.applyMatrix4(s), d.needsUpdate = !0;
            for (let v = g, S = g + A; v < S; v++) {
              q(h, 3 * v, f, c), h.needsUpdate = !0;
              const V = h.distanceToTriangle(d, _, y);
              if (V < p && (I.copy(_), u && u.copy(y), p = V, w = v, m = x), V < n)
                return !0;
            }
          }
        }
      }
    }
  ), tt.releasePrimitive(h), tt.releasePrimitive(d), p === 1 / 0 ? null : (e.point ? e.point.copy(I) : e.point = I.clone(), e.distance = p, e.faceIndex = w, i && (i.point ? i.point.copy(u) : i.point = u.clone(), i.point.applyMatrix4(gs), I.applyMatrix4(gs), i.distance = I.sub(i.point).length(), i.faceIndex = m), e);
}
function Ni(a, t = null) {
  t && Array.isArray(t) && (t = new Set(t));
  const s = a.geometry, e = s.index ? s.index.array : null, i = s.attributes.position;
  let n, o, r, c, f = 0;
  const l = a._roots;
  for (let h = 0, d = l.length; h < d; h++)
    n = l[h], o = new Uint32Array(n), r = new Uint16Array(n), c = new Float32Array(n), b(0, f), f += n.byteLength;
  function b(h, d, _ = !1) {
    const I = h * 2;
    if (r[I + 15] === Ts) {
      const u = o[h + 6], p = r[I + 14];
      let w = 1 / 0, m = 1 / 0, g = 1 / 0, A = -1 / 0, F = -1 / 0, x = -1 / 0;
      for (let C = u, v = u + p; C < v; C++) {
        const S = 3 * a.resolveTriangleIndex(C);
        for (let V = 0; V < 3; V++) {
          let M = S + V;
          M = e ? e[M] : M;
          const T = i.getX(M), D = i.getY(M), L = i.getZ(M);
          T < w && (w = T), T > A && (A = T), D < m && (m = D), D > F && (F = D), L < g && (g = L), L > x && (x = L);
        }
      }
      return c[h + 0] !== w || c[h + 1] !== m || c[h + 2] !== g || c[h + 3] !== A || c[h + 4] !== F || c[h + 5] !== x ? (c[h + 0] = w, c[h + 1] = m, c[h + 2] = g, c[h + 3] = A, c[h + 4] = F, c[h + 5] = x, !0) : !1;
    } else {
      const u = h + 8, p = o[h + 6], w = u + d, m = p + d;
      let g = _, A = !1, F = !1;
      t ? g || (A = t.has(w), F = t.has(m), g = !A && !F) : (A = !0, F = !0);
      const x = g || A, C = g || F;
      let v = !1;
      x && (v = b(u, d, g));
      let S = !1;
      C && (S = b(p, d, g));
      const V = v || S;
      if (V)
        for (let M = 0; M < 3; M++) {
          const T = u + M, D = p + M, L = c[T], H = c[T + 3], Y = c[D], Z = c[D + 3];
          c[h + M] = L < Y ? L : Y, c[h + M + 3] = H > Z ? H : Z;
        }
      return V;
    }
  }
}
const Ae = /* @__PURE__ */ new B();
function ki(a, t, s, e, i) {
  G.setBuffer(a._roots[t]), Ws(0, a, s, e, i), G.clearBuffer();
}
function Ws(a, t, s, e, i) {
  const { float32Array: n, uint16Array: o, uint32Array: r } = G, c = a * 2;
  if (J(c, o)) {
    const l = W(a, r), b = st(c, o);
    Pi(t, s, e, l, b, i);
  } else {
    const l = et(a);
    Ft(l, n, e, Ae) && Ws(l, t, s, e, i);
    const b = it(a, r);
    Ft(b, n, e, Ae) && Ws(b, t, s, e, i);
  }
}
const ve = /* @__PURE__ */ new B(), qi = ["x", "y", "z"];
function Ki(a, t, s, e) {
  G.setBuffer(a._roots[t]);
  const i = Qs(0, a, s, e);
  return G.clearBuffer(), i;
}
function Qs(a, t, s, e) {
  const { float32Array: i, uint16Array: n, uint32Array: o } = G;
  let r = a * 2;
  if (J(r, n)) {
    const f = W(a, o), l = st(r, n);
    return Si(t, s, e, f, l);
  } else {
    const f = ze(a, o), l = qi[f], h = e.direction[l] >= 0;
    let d, _;
    h ? (d = et(a), _ = it(a, o)) : (d = it(a, o), _ = et(a));
    const y = Ft(d, i, e, ve) ? Qs(d, t, s, e) : null;
    if (y) {
      const w = y.point[l];
      if (h ? w <= i[_ + f] : (
        // min bounding data
        w >= i[_ + f + 3]
      ))
        return y;
    }
    const p = Ft(_, i, e, ve) ? Qs(_, t, s, e) : null;
    return y && p ? y.distance <= p.distance ? y : p : y || p || null;
  }
}
const ws = /* @__PURE__ */ new ct(), Kt = /* @__PURE__ */ new rt(), jt = /* @__PURE__ */ new rt(), es = /* @__PURE__ */ new Vt(), Ve = /* @__PURE__ */ new X(), Is = /* @__PURE__ */ new X();
function ji(a, t, s, e) {
  G.setBuffer(a._roots[t]);
  const i = te(0, a, s, e);
  return G.clearBuffer(), i;
}
function te(a, t, s, e, i = null) {
  const { float32Array: n, uint16Array: o, uint32Array: r } = G;
  let c = a * 2;
  if (i === null && (s.boundingBox || s.computeBoundingBox(), Ve.set(s.boundingBox.min, s.boundingBox.max, e), i = Ve), J(c, o)) {
    const l = t.geometry, b = l.index, h = l.attributes.position, d = s.index, _ = s.attributes.position, I = W(a, r), y = st(c, o);
    if (es.copy(e).invert(), s.boundsTree)
      return R(a, n, Is), Is.matrix.copy(es), Is.needsUpdate = !0, s.boundsTree.shapecast({
        intersectsBounds: (p) => Is.intersectsBox(p),
        intersectsTriangle: (p) => {
          p.a.applyMatrix4(e), p.b.applyMatrix4(e), p.c.applyMatrix4(e), p.needsUpdate = !0;
          for (let w = I, m = y + I; w < m; w++)
            if (q(jt, 3 * t.resolveTriangleIndex(w), b, h), jt.needsUpdate = !0, p.intersectsTriangle(jt))
              return !0;
          return !1;
        }
      });
    for (let u = I, p = y + I; u < p; u++) {
      const w = t.resolveTriangleIndex(u);
      q(Kt, 3 * w, b, h), Kt.a.applyMatrix4(es), Kt.b.applyMatrix4(es), Kt.c.applyMatrix4(es), Kt.needsUpdate = !0;
      for (let m = 0, g = d.count; m < g; m += 3)
        if (q(jt, m, d, _), jt.needsUpdate = !0, Kt.intersectsTriangle(jt))
          return !0;
    }
  } else {
    const l = a + 8, b = r[a + 6];
    return R(l, n, ws), !!(i.intersectsBox(ws) && te(l, t, s, e, i) || (R(b, n, ws), i.intersectsBox(ws) && te(b, t, s, e, i)));
  }
}
const xs = /* @__PURE__ */ new Vt(), Rs = /* @__PURE__ */ new X(), is = /* @__PURE__ */ new X(), $i = /* @__PURE__ */ new B(), Hi = /* @__PURE__ */ new B(), Xi = /* @__PURE__ */ new B(), Yi = /* @__PURE__ */ new B();
function Zi(a, t, s, e = {}, i = {}, n = 0, o = 1 / 0) {
  t.boundingBox || t.computeBoundingBox(), Rs.set(t.boundingBox.min, t.boundingBox.max, s), Rs.needsUpdate = !0;
  const r = a.geometry, c = r.attributes.position, f = r.index, l = t.attributes.position, b = t.index, h = tt.getPrimitive(), d = tt.getPrimitive();
  let _ = $i, I = Hi, y = null, u = null;
  i && (y = Xi, u = Yi);
  let p = 1 / 0, w = null, m = null;
  return xs.copy(s).invert(), is.matrix.copy(xs), a.shapecast(
    {
      boundsTraverseOrder: (g) => Rs.distanceToBox(g),
      intersectsBounds: (g, A, F) => F < p && F < o ? (A && (is.min.copy(g.min), is.max.copy(g.max), is.needsUpdate = !0), !0) : !1,
      intersectsRange: (g, A) => {
        if (t.boundsTree) {
          const F = t.boundsTree;
          return F.shapecast({
            boundsTraverseOrder: (x) => is.distanceToBox(x),
            intersectsBounds: (x, C, v) => v < p && v < o,
            intersectsRange: (x, C) => {
              for (let v = x, S = x + C; v < S; v++) {
                const V = F.resolveTriangleIndex(v);
                q(d, 3 * V, b, l), d.a.applyMatrix4(s), d.b.applyMatrix4(s), d.c.applyMatrix4(s), d.needsUpdate = !0;
                for (let M = g, T = g + A; M < T; M++) {
                  const D = a.resolveTriangleIndex(M);
                  q(h, 3 * D, f, c), h.needsUpdate = !0;
                  const L = h.distanceToTriangle(d, _, y);
                  if (L < p && (I.copy(_), u && u.copy(y), p = L, w = M, m = v), L < n)
                    return !0;
                }
              }
            }
          });
        } else {
          const F = Zt(t);
          for (let x = 0, C = F; x < C; x++) {
            q(d, 3 * x, b, l), d.a.applyMatrix4(s), d.b.applyMatrix4(s), d.c.applyMatrix4(s), d.needsUpdate = !0;
            for (let v = g, S = g + A; v < S; v++) {
              const V = a.resolveTriangleIndex(v);
              q(h, 3 * V, f, c), h.needsUpdate = !0;
              const M = h.distanceToTriangle(d, _, y);
              if (M < p && (I.copy(_), u && u.copy(y), p = M, w = v, m = x), M < n)
                return !0;
            }
          }
        }
      }
    }
  ), tt.releasePrimitive(h), tt.releasePrimitive(d), p === 1 / 0 ? null : (e.point ? e.point.copy(I) : e.point = I.clone(), e.distance = p, e.faceIndex = w, i && (i.point ? i.point.copy(u) : i.point = u.clone(), i.point.applyMatrix4(xs), I.applyMatrix4(xs), i.distance = I.sub(i.point).length(), i.faceIndex = m), e);
}
function Ji() {
  return typeof SharedArrayBuffer < "u";
}
const os = new G.constructor(), Ms = new G.constructor(), It = new re(() => new ct()), $t = new ct(), Ht = new ct(), Ns = new ct(), ks = new ct();
let qs = !1;
function Wi(a, t, s, e) {
  if (qs)
    throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
  qs = !0;
  const i = a._roots, n = t._roots;
  let o, r = 0, c = 0;
  const f = new Vt().copy(s).invert();
  for (let l = 0, b = i.length; l < b; l++) {
    os.setBuffer(i[l]), c = 0;
    const h = It.getPrimitive();
    R(0, os.float32Array, h), h.applyMatrix4(f);
    for (let d = 0, _ = n.length; d < _ && (Ms.setBuffer(n[l]), o = nt(
      0,
      0,
      s,
      f,
      e,
      r,
      c,
      0,
      0,
      h
    ), Ms.clearBuffer(), c += n[d].length, !o); d++)
      ;
    if (It.releasePrimitive(h), os.clearBuffer(), r += i[l].length, o)
      break;
  }
  return qs = !1, o;
}
function nt(a, t, s, e, i, n = 0, o = 0, r = 0, c = 0, f = null, l = !1) {
  let b, h;
  l ? (b = Ms, h = os) : (b = os, h = Ms);
  const d = b.float32Array, _ = b.uint32Array, I = b.uint16Array, y = h.float32Array, u = h.uint32Array, p = h.uint16Array, w = a * 2, m = t * 2, g = J(w, I), A = J(m, p);
  let F = !1;
  if (A && g)
    l ? F = i(
      W(t, u),
      st(t * 2, p),
      W(a, _),
      st(a * 2, I),
      c,
      o + t,
      r,
      n + a
    ) : F = i(
      W(a, _),
      st(a * 2, I),
      W(t, u),
      st(t * 2, p),
      r,
      n + a,
      c,
      o + t
    );
  else if (A) {
    const x = It.getPrimitive();
    R(t, y, x), x.applyMatrix4(s);
    const C = et(a), v = it(a, _);
    R(C, d, $t), R(v, d, Ht);
    const S = x.intersectsBox($t), V = x.intersectsBox(Ht);
    F = S && nt(
      t,
      C,
      e,
      s,
      i,
      o,
      n,
      c,
      r + 1,
      x,
      !l
    ) || V && nt(
      t,
      v,
      e,
      s,
      i,
      o,
      n,
      c,
      r + 1,
      x,
      !l
    ), It.releasePrimitive(x);
  } else {
    const x = et(t), C = it(t, u);
    R(x, y, Ns), R(C, y, ks);
    const v = f.intersectsBox(Ns), S = f.intersectsBox(ks);
    if (v && S)
      F = nt(
        a,
        x,
        s,
        e,
        i,
        n,
        o,
        r,
        c + 1,
        f,
        l
      ) || nt(
        a,
        C,
        s,
        e,
        i,
        n,
        o,
        r,
        c + 1,
        f,
        l
      );
    else if (v)
      if (g)
        F = nt(
          a,
          x,
          s,
          e,
          i,
          n,
          o,
          r,
          c + 1,
          f,
          l
        );
      else {
        const V = It.getPrimitive();
        V.copy(Ns).applyMatrix4(s);
        const M = et(a), T = it(a, _);
        R(M, d, $t), R(T, d, Ht);
        const D = V.intersectsBox($t), L = V.intersectsBox(Ht);
        F = D && nt(
          x,
          M,
          e,
          s,
          i,
          o,
          n,
          c,
          r + 1,
          V,
          !l
        ) || L && nt(
          x,
          T,
          e,
          s,
          i,
          o,
          n,
          c,
          r + 1,
          V,
          !l
        ), It.releasePrimitive(V);
      }
    else if (S)
      if (g)
        F = nt(
          a,
          C,
          s,
          e,
          i,
          n,
          o,
          r,
          c + 1,
          f,
          l
        );
      else {
        const V = It.getPrimitive();
        V.copy(ks).applyMatrix4(s);
        const M = et(a), T = it(a, _);
        R(M, d, $t), R(T, d, Ht);
        const D = V.intersectsBox($t), L = V.intersectsBox(Ht);
        F = D && nt(
          C,
          M,
          e,
          s,
          i,
          o,
          n,
          c,
          r + 1,
          V,
          !l
        ) || L && nt(
          C,
          T,
          e,
          s,
          i,
          o,
          n,
          c,
          r + 1,
          V,
          !l
        ), It.releasePrimitive(V);
      }
  }
  return F;
}
const As = /* @__PURE__ */ new X(), Fe = /* @__PURE__ */ new ct();
class ce {
  static serialize(t, s = {}) {
    s = {
      cloneBuffers: !0,
      ...s
    };
    const e = t.geometry, i = t._roots, n = t._indirectBuffer, o = e.getIndex();
    let r;
    return s.cloneBuffers ? r = {
      roots: i.map((c) => c.slice()),
      index: o.array.slice(),
      indirectBuffer: n ? n.slice() : null
    } : r = {
      roots: i,
      index: o.array,
      indirectBuffer: n
    }, r;
  }
  static deserialize(t, s, e = {}) {
    e = {
      setIndex: !0,
      indirect: !!t.indirectBuffer,
      ...e
    };
    const { index: i, roots: n, indirectBuffer: o } = t, r = new ce(s, { ...e, [Ls]: !0 });
    if (r._roots = n, r._indirectBuffer = o || null, e.setIndex) {
      const c = s.getIndex();
      if (c === null) {
        const f = new Te(t.index, 1, !1);
        s.setIndex(f);
      } else
        c.array !== i && (c.array.set(i), c.needsUpdate = !0);
    }
    return r;
  }
  get indirect() {
    return !!this._indirectBuffer;
  }
  constructor(t, s = {}) {
    if (t.isBufferGeometry) {
      if (t.index && t.index.isInterleavedBufferAttribute)
        throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.");
    } else
      throw new Error("MeshBVH: Only BufferGeometries are supported.");
    if (s = Object.assign({
      strategy: Oe,
      maxDepth: 40,
      maxLeafTris: 10,
      verbose: !0,
      useSharedArrayBuffer: !1,
      setBoundingBox: !0,
      onProgress: null,
      indirect: !1,
      // undocumented options
      // Whether to skip generating the tree. Used for deserialization.
      [Ls]: !1
    }, s), s.useSharedArrayBuffer && !Ji())
      throw new Error("MeshBVH: SharedArrayBuffer is not available.");
    this.geometry = t, this._roots = null, this._indirectBuffer = null, s[Ls] || (_i(this, s), !t.boundingBox && s.setBoundingBox && (t.boundingBox = this.getBoundingBox(new ct())));
    const { _indirectBuffer: e } = this;
    this.resolveTriangleIndex = s.indirect ? (i) => e[i] : (i) => i;
  }
  refit(t = null) {
    return (this.indirect ? Ni : Mi)(this, t);
  }
  traverse(t, s = 0) {
    const e = this._roots[s], i = new Uint32Array(e), n = new Uint16Array(e);
    o(0);
    function o(r, c = 0) {
      const f = r * 2, l = n[f + 15] === Ts;
      if (l) {
        const b = i[r + 6], h = n[f + 14];
        t(c, l, new Float32Array(e, r * 4, 6), b, h);
      } else {
        const b = r + Vs / 4, h = i[r + 6], d = i[r + 7];
        t(c, l, new Float32Array(e, r * 4, 6), d) || (o(b, c + 1), o(h, c + 1));
      }
    }
  }
  /* Core Cast Functions */
  raycast(t, s = ae) {
    const e = this._roots, i = this.geometry, n = [], o = s.isMaterial, r = Array.isArray(s), c = i.groups, f = o ? s.side : s, l = this.indirect ? ki : Bi;
    for (let b = 0, h = e.length; b < h; b++) {
      const d = r ? s[c[b].materialIndex].side : f, _ = n.length;
      if (l(this, b, d, t, n), r) {
        const I = c[b].materialIndex;
        for (let y = _, u = n.length; y < u; y++)
          n[y].face.materialIndex = I;
      }
    }
    return n;
  }
  raycastFirst(t, s = ae) {
    const e = this._roots, i = this.geometry, n = s.isMaterial, o = Array.isArray(s);
    let r = null;
    const c = i.groups, f = n ? s.side : s, l = this.indirect ? Ki : Oi;
    for (let b = 0, h = e.length; b < h; b++) {
      const d = o ? s[c[b].materialIndex].side : f, _ = l(this, b, d, t);
      _ != null && (r == null || _.distance < r.distance) && (r = _, o && (_.face.materialIndex = c[b].materialIndex));
    }
    return r;
  }
  intersectsGeometry(t, s) {
    let e = !1;
    const i = this._roots, n = this.indirect ? ji : Li;
    for (let o = 0, r = i.length; o < r && (e = n(this, o, t, s), !e); o++)
      ;
    return e;
  }
  shapecast(t) {
    const s = tt.getPrimitive(), e = this.indirect ? Ti : Ci;
    let {
      boundsTraverseOrder: i,
      intersectsBounds: n,
      intersectsRange: o,
      intersectsTriangle: r
    } = t;
    if (o && r) {
      const b = o;
      o = (h, d, _, I, y) => b(h, d, _, I, y) ? !0 : e(h, d, this, r, _, I, s);
    } else
      o || (r ? o = (b, h, d, _) => e(b, h, this, r, d, _, s) : o = (b, h, d) => d);
    let c = !1, f = 0;
    const l = this._roots;
    for (let b = 0, h = l.length; b < h; b++) {
      const d = l[b];
      if (c = Ii(this, b, n, o, i, f), c)
        break;
      f += d.byteLength;
    }
    return tt.releasePrimitive(s), c;
  }
  bvhcast(t, s, e) {
    let {
      intersectsRanges: i,
      intersectsTriangles: n
    } = e;
    const o = tt.getPrimitive(), r = this.geometry.index, c = this.geometry.attributes.position, f = this.indirect ? (_) => {
      const I = this.resolveTriangleIndex(_);
      q(o, I * 3, r, c);
    } : (_) => {
      q(o, _ * 3, r, c);
    }, l = tt.getPrimitive(), b = t.geometry.index, h = t.geometry.attributes.position, d = t.indirect ? (_) => {
      const I = t.resolveTriangleIndex(_);
      q(l, I * 3, b, h);
    } : (_) => {
      q(l, _ * 3, b, h);
    };
    if (n) {
      const _ = (I, y, u, p, w, m, g, A) => {
        for (let F = u, x = u + p; F < x; F++) {
          d(F), l.a.applyMatrix4(s), l.b.applyMatrix4(s), l.c.applyMatrix4(s), l.needsUpdate = !0;
          for (let C = I, v = I + y; C < v; C++)
            if (f(C), o.needsUpdate = !0, n(o, l, C, F, w, m, g, A))
              return !0;
        }
        return !1;
      };
      if (i) {
        const I = i;
        i = function(y, u, p, w, m, g, A, F) {
          return I(y, u, p, w, m, g, A, F) ? !0 : _(y, u, p, w, m, g, A, F);
        };
      } else
        i = _;
    }
    return Wi(this, t, s, i);
  }
  /* Derived Cast Functions */
  intersectsBox(t, s) {
    return As.set(t.min, t.max, s), As.needsUpdate = !0, this.shapecast(
      {
        intersectsBounds: (e) => As.intersectsBox(e),
        intersectsTriangle: (e) => As.intersectsTriangle(e)
      }
    );
  }
  intersectsSphere(t) {
    return this.shapecast(
      {
        intersectsBounds: (s) => t.intersectsBox(s),
        intersectsTriangle: (s) => s.intersectsSphere(t)
      }
    );
  }
  closestPointToGeometry(t, s, e = {}, i = {}, n = 0, o = 1 / 0) {
    return (this.indirect ? Zi : Ri)(
      this,
      t,
      s,
      e,
      i,
      n,
      o
    );
  }
  closestPointToPoint(t, s = {}, e = 0, i = 1 / 0) {
    return xi(
      this,
      t,
      s,
      e,
      i
    );
  }
  getBoundingBox(t) {
    return t.makeEmpty(), this._roots.forEach((e) => {
      R(0, new Float32Array(e), Fe), t.union(Fe);
    }), t;
  }
}
function Ce(a, t, s) {
  return a === null || (a.point.applyMatrix4(t.matrixWorld), a.distance = a.point.distanceTo(s.ray.origin), a.object = t, a.distance < s.near || a.distance > s.far) ? null : a;
}
const Ks = /* @__PURE__ */ new Je(), Me = /* @__PURE__ */ new Vt(), Qi = De.prototype.raycast;
function tn(a, t) {
  if (this.geometry.boundsTree) {
    if (this.material === void 0)
      return;
    Me.copy(this.matrixWorld).invert(), Ks.copy(a.ray).applyMatrix4(Me);
    const s = this.geometry.boundsTree;
    if (a.firstHitOnly === !0) {
      const e = Ce(s.raycastFirst(Ks, this.material), this, a);
      e && t.push(e);
    } else {
      const e = s.raycast(Ks, this.material);
      for (let i = 0, n = e.length; i < n; i++) {
        const o = Ce(e[i], this, a);
        o && t.push(o);
      }
    }
  } else
    Qi.call(this, a, t);
}
function sn(a) {
  return this.boundsTree = new ce(this, a), this.boundsTree;
}
function en() {
  this.boundsTree = null;
}
const rs = class rs {
  /**
   * Applies the Bounding Volume Hierarchy (BVH) to a given BufferGeometry.
   * If the BVH is not already initialized, it adds the necessary methods to the BufferGeometry and Mesh prototypes.
   * If the geometry does not have a boundsTree, it computes one.
   *
   * @param geometry - The BufferGeometry to apply the BVH to.
   */
  static apply(t) {
    rs.initialized || (fe.prototype.computeBoundsTree = sn, fe.prototype.disposeBoundsTree = en, De.prototype.raycast = tn, rs.initialized = !0), t.boundsTree || t.computeBoundsTree();
  }
  /**
   * Disposes of the BVH associated with the given BufferGeometry.
   * If the geometry has a boundsTree, it disposes of it.
   *
   * @param geometry - The BufferGeometry to dispose of the BVH from.
   */
  static dispose(t) {
    t && t.disposeBoundsTree && t.disposeBoundsTree();
  }
};
/**
 * A flag indicating whether the BVH has been initialized.
 * Initialized means the necessary methods have been added to BufferGeometry and Mesh prototypes.
 */
P(rs, "initialized", !1);
let Ps = rs, Ee = class Ge {
  /**
   * Constructs a new Fragment.
   * @param geometry - The geometry of the fragment.
   * @param material - The material(s) of the fragment.
   * @param count - The initial number of instances in the fragment.
   */
  constructor(t, s, e) {
    /**
     * A set of unique item IDs associated with this fragment.
     */
    P(this, "ids", /* @__PURE__ */ new Set());
    /**
     * A map of item IDs to sets of instance IDs.
     */
    P(this, "itemToInstances", /* @__PURE__ */ new Map());
    /**
     * A map of instance IDs to item IDs.
     */
    P(this, "instanceToItem", /* @__PURE__ */ new Map());
    /**
     * A set of item IDs of instances that are currently hidden.
     */
    P(this, "hiddenItems", /* @__PURE__ */ new Set());
    /**
     * The unique identifier of this fragment.
     */
    P(this, "id");
    /**
     * The mesh associated with this fragment.
     */
    P(this, "mesh");
    /**
     * The amount of instances that this fragment can contain.
     */
    P(this, "capacity", 0);
    /**
     * The amount by which to increase the capacity when necessary.
     */
    P(this, "capacityOffset", 10);
    /**
     * The group of fragments to which this fragment belongs.
     */
    P(this, "group");
    P(this, "_originalColors", /* @__PURE__ */ new Map());
    P(this, "_settingVisibility", !1);
    this.mesh = new le(t, s, e, this), this.id = this.mesh.uuid, this.capacity = e, this.mesh.count = 0, this.mesh.geometry.index.count && Ps.apply(this.mesh.geometry);
  }
  /**
   * A getter property that returns the unique vertices of the fragment's geometry.
   * The unique vertices are determined by comparing the vertex positions.
   *
   * @returns An array of unique vertices.
   */
  get uniqueVertices() {
    const t = [], s = this.mesh.geometry.getAttribute(
      "position"
    );
    if (!s)
      return t;
    const e = /* @__PURE__ */ new Set();
    for (let i = 0; i < s.count; i++) {
      const n = s.getX(i), o = s.getY(i), r = s.getZ(i), c = `${n},${o},${r}`;
      e.has(c) || (e.add(c), t.push(new O.Vector3(n, o, r)));
    }
    return t;
  }
  /**
   * Disposes of the fragment and its associated resources.
   *
   * @param disposeResources - If true, disposes geometries and materials associated with the fragment. If false, only disposes of the fragment itself.
   */
  dispose(t = !0) {
    if (this.clear(), this.group = void 0, this._originalColors.clear(), this.mesh) {
      if (t) {
        for (const s of this.mesh.material)
          s.dispose();
        this.mesh.material = [], Ps.dispose(this.mesh.geometry), this.mesh.geometry && this.mesh.geometry.dispose(), this.mesh.geometry = null;
      }
      this.mesh.removeFromParent(), this.mesh.userData = {}, this.mesh.dispose(), this.mesh.fragment = null, this.mesh = null;
    }
  }
  /**
   * Retrieves the transform matrices and colors of instances associated with a given item ID.
   *
   * @param itemID - The unique identifier of the item.
   * @throws Will throw an error if the item is not found.
   * @returns An object containing the item ID, an array of transform matrices, and an optional array of colors.
   * If no colors are found, the colors array will be undefined.
   */
  get(t) {
    const s = this.getInstancesIDs(t);
    if (!s)
      throw new Error("Item not found!");
    const e = [], i = [];
    for (const o of s) {
      const r = new O.Matrix4();
      if (this.mesh.getMatrixAt(o, r), e.push(r), this.mesh.instanceColor) {
        const c = new O.Color();
        this.mesh.getColorAt(o, c), i.push(c);
      }
    }
    const n = i.length ? i : void 0;
    return { id: t, transforms: e, colors: n };
  }
  /**
   * Retrieves the item ID associated with a given instance ID.
   *
   * @param instanceID - The unique identifier of the instance.
   * @returns The item ID associated with the instance, or null if no association exists.
   */
  getItemID(t) {
    return this.instanceToItem.get(t) || null;
  }
  /**
   * Retrieves the instance IDs associated with a given item ID.
   *
   * @param itemID - The unique identifier of the item.
   * @returns The set of instance IDs associated with the item, or null if no association exists.
   */
  getInstancesIDs(t) {
    return this.itemToInstances.get(t) || null;
  }
  /**
   * Updates the instance color and matrix attributes of the fragment's mesh.
   * This method should be called whenever the instance color or matrix attributes
   * need to be updated.
   */
  update() {
    this.mesh.instanceColor && (this.mesh.instanceColor.needsUpdate = !0), this.mesh.instanceMatrix.needsUpdate = !0;
  }
  /**
   * Adds items to the fragment.
   *
   * @param items - An array of items to be added. Each item contains an ID, an array of transform matrices, and an optional array of colors.
   *
   * If the necessary capacity to accommodate the new items exceeds the current capacity,
   * a new mesh with a larger capacity is created, and the old mesh is disposed.
   *
   * The transform matrices and colors of the items are added to the respective attributes of the mesh.
   *
   * The instance IDs, item IDs, and associations between instance IDs and item IDs are updated accordingly.
   *
   * The instance color and matrix attributes of the mesh are updated.
   */
  add(t) {
    var i;
    let s = 0;
    for (const n of t)
      s += n.transforms.length;
    const e = this.mesh.count + s;
    if (e > this.capacity) {
      const n = e + this.capacityOffset, o = new le(
        this.mesh.geometry,
        this.mesh.material,
        n,
        this
      );
      o.count = this.mesh.count, this.capacity = n;
      const r = this.mesh;
      (i = r.parent) == null || i.add(o), r.removeFromParent(), this.mesh = o;
      const c = new O.Matrix4();
      for (let f = 0; f < r.instanceMatrix.count; f++)
        r.getMatrixAt(f, c), o.setMatrixAt(f, c);
      if (r.instanceColor) {
        const f = new O.Color();
        for (let l = 0; l < r.instanceColor.count; l++)
          r.getColorAt(l, f), o.setColorAt(l, f);
      }
      r.dispose();
    }
    for (let n = 0; n < t.length; n++) {
      const { transforms: o, colors: r, id: c } = t[n];
      this.itemToInstances.has(c) || this.itemToInstances.set(c, /* @__PURE__ */ new Set());
      const f = this.itemToInstances.get(c);
      this.ids.add(c);
      for (let l = 0; l < o.length; l++) {
        const b = o[l], h = this.mesh.count;
        if (this.mesh.setMatrixAt(h, b), r) {
          const d = r[l];
          this.mesh.setColorAt(h, d);
        }
        f.add(h), this.instanceToItem.set(h, c), this.mesh.count++;
      }
    }
    this.update();
  }
  /**
   * Removes items from the fragment.
   *
   * @param itemsIDs - An iterable of item IDs to be removed.
   *
   * The instance IDs, item IDs, and associations between instance IDs and item IDs are updated accordingly.
   *
   * The instance color and matrix attributes of the mesh are updated.
   *
   * @throws Will throw an error if the instances are not found.
   */
  remove(t) {
    if (this.mesh.count !== 0) {
      for (const s of t) {
        const e = this.itemToInstances.get(s);
        if (e === void 0)
          throw new Error("Instances not found!");
        for (const i of e) {
          if (this.mesh.count === 0)
            throw new Error("Error with mesh count!");
          this.putLast(i), this.instanceToItem.delete(i), this.mesh.count--;
        }
        this.itemToInstances.delete(s), this.ids.delete(s);
      }
      this.update();
    }
  }
  /**
   * Clears the fragment by resetting the hidden items, item IDs, instance-to-item associations,
   * instance-to-item map, and the count of instances in the fragment's mesh.
   *
   * @remarks
   * This method is used to reset the fragment to its initial state.
   *
   * @example
   * ```typescript
   * fragment.clear();
   * ```
   */
  clear() {
    this.hiddenItems.clear(), this.ids.clear(), this.instanceToItem.clear(), this.itemToInstances.clear(), this.mesh.count = 0;
  }
  /**
   * Sets the visibility of items in the fragment.
   *
   * @param visible - A boolean indicating whether the items should be visible or hidden.
   * @param itemIDs - An iterable of item IDs to be affected. If not provided, all items in the fragment will be affected.
   *
   * @remarks
   * This method updates the visibility of items in the fragment based on the provided visibility flag.
   *
   *
   * @example
   * ```typescript
   * fragment.setVisibility(true, [1, 2, 3]); // Makes items with IDs 1, 2, and 3 visible.
   * fragment.setVisibility(false); // Makes all items in the fragment hidden.
   * ```
   */
  setVisibility(t, s = this.ids) {
    if (!this._settingVisibility) {
      if (this._settingVisibility = !0, t)
        for (const e of s) {
          if (!this.ids.has(e) || !this.hiddenItems.has(e))
            continue;
          const i = this.itemToInstances.get(e);
          if (!i)
            throw new Error("Instances not found!");
          for (const n of new Set(i))
            this.mesh.count++, this.putLast(n);
          this.hiddenItems.delete(e);
        }
      else
        for (const e of s) {
          if (!this.ids.has(e) || this.hiddenItems.has(e))
            continue;
          const i = this.itemToInstances.get(e);
          if (!i)
            throw new Error("Instances not found!");
          for (const n of new Set(i))
            this.putLast(n), this.mesh.count--;
          this.hiddenItems.add(e);
        }
      this.update(), this._settingVisibility = !1;
    }
  }
  /**
   * Sets the color of items in the fragment.
   *
   * @param color - The color to be set for the items.
   * @param itemIDs - An iterable of item IDs to be affected. If not provided, all items in the fragment will be affected.
   * @param override - A boolean indicating whether the original color should be overridden. If true, the original color will be replaced with the new color.
   *
   *
   * @example
   * ```typescript
   * fragment.setColor(new THREE.Color(0xff0000), [1, 2, 3], true); // Sets the color of items with IDs 1, 2, and 3 to red, overriding their original colors.
   * fragment.setColor(new THREE.Color(0x00ff00)); // Sets the color of all items in the fragment to green.
   * ```
   */
  setColor(t, s = this.ids, e = !1) {
    if (!this.mesh.instanceColor)
      throw new Error("This fragment doesn't have color per instance!");
    for (const i of s) {
      if (!this.ids.has(i))
        continue;
      const n = this.itemToInstances.get(i);
      if (!n)
        throw new Error("Instances not found!");
      const o = this._originalColors.has(i);
      o || this._originalColors.set(i, /* @__PURE__ */ new Map());
      const r = this._originalColors.get(i);
      for (const c of new Set(n)) {
        if (!o) {
          const f = new O.Color();
          this.mesh.getColorAt(c, f), r.set(c, f);
        }
        this.mesh.setColorAt(c, t), e && r.set(c, t);
      }
    }
    this.mesh.instanceColor.needsUpdate = !0;
  }
  /**
   * Resets the color of items in the fragment to their original colors.
   *
   * @param itemIDs - An iterable of item IDs to be affected. If not provided, all items in the fragment will be affected.
   *
   *
   * @example
   * ```typescript
   * fragment.resetColor([1, 2, 3]); // Resets the color of items with IDs 1, 2, and 3 to their original colors.
   * fragment.resetColor(); // Resets the color of all items in the fragment to their original colors.
   * ```
   */
  resetColor(t = this.ids) {
    if (!this.mesh.instanceColor)
      throw new Error("This fragment doesn't have color per instance!");
    for (const s of t) {
      if (!this.ids.has(s))
        continue;
      const e = this.itemToInstances.get(s);
      if (!e)
        throw new Error("Instances not found!");
      const i = this._originalColors.get(s);
      if (i)
        for (const n of new Set(e)) {
          const o = i.get(n);
          if (!o)
            throw new Error("Original color not found!");
          this.mesh.setColorAt(n, o);
        }
    }
    this.mesh.instanceColor.needsUpdate = !0;
  }
  /**
   * Applies a transformation matrix to instances associated with given item IDs.
   *
   * @param itemIDs - An iterable of item IDs to be affected.
   * @param transform - The transformation matrix to be applied.
   *
   * @remarks
   * This method applies the provided transformation matrix to the instances associated with the given item IDs.
   *
   * @example
   * ```typescript
   * fragment.applyTransform([1, 2, 3], new THREE.Matrix4().makeTranslation(1, 0, 0)); // Applies a translation of (1, 0, 0) to instances with IDs 1, 2, and 3.
   * ```
   */
  applyTransform(t, s) {
    const e = new O.Matrix4();
    for (const i of t) {
      const n = this.getInstancesIDs(i);
      if (n !== null)
        for (const o of n)
          this.mesh.getMatrixAt(o, e), e.premultiply(s), this.mesh.setMatrixAt(o, e);
    }
    this.update();
  }
  /**
   * Exports the fragment's geometry and associated data.
   *
   * @returns An object containing the exported geometry, an array of IDs associated with the fragment, and the fragment's ID.
   *
   * @remarks
   * This method is used to export the fragment's geometry and associated data for further processing or storage.
   *
   * @example
   * ```typescript
   * const exportedData = fragment.exportData();
   * // Use the exportedData object for further processing or storage
   * ```
   */
  exportData() {
    const t = this.mesh.exportData(), s = Array.from(this.ids), e = this.id;
    return { ...t, ids: s, id: e };
  }
  /**
   * Creates a copy of the whole fragment or a part of it. It shares the geometry with the original fragment, but has its own InstancedMesh data, so it also needs to be disposed.
   *
   * @param itemIDs - An iterable of item IDs to be included in the clone.
   *
   */
  clone(t = this.ids) {
    const s = new Ge(
      this.mesh.geometry,
      this.mesh.material,
      this.capacity
    ), e = [];
    for (const i of t) {
      const n = this.getInstancesIDs(i);
      if (n === null)
        continue;
      const o = [], r = [];
      for (const c of n) {
        const f = new O.Matrix4(), l = new O.Color();
        this.mesh.getMatrixAt(c, f), this.mesh.getColorAt(c, l), o.push(f), r.push(l);
      }
      e.push({
        id: i,
        transforms: o,
        colors: r
      });
    }
    return s.add(e), s;
  }
  putLast(t) {
    if (this.mesh.count === 0)
      return;
    const s = this.instanceToItem.get(t), e = this.mesh.count - 1;
    if (e === t)
      return;
    const i = this.instanceToItem.get(e);
    if (s === void 0 || i === void 0)
      throw new Error("Keys not found");
    if (s !== i) {
      const r = this.itemToInstances.get(s), c = this.itemToInstances.get(i);
      if (!r || !c)
        throw new Error("Instances not found");
      if (!r.has(t) || !c.has(e))
        throw new Error("Malformed fragment structure");
      r.delete(t), c.delete(e), r.add(e), c.add(t), this.instanceToItem.set(t, i), this.instanceToItem.set(e, s);
    }
    const n = new O.Matrix4(), o = new O.Matrix4();
    if (this.mesh.getMatrixAt(t, n), this.mesh.getMatrixAt(e, o), this.mesh.setMatrixAt(t, o), this.mesh.setMatrixAt(e, n), this.mesh.instanceColor !== null) {
      const r = new O.Color(), c = new O.Color();
      this.mesh.getColorAt(t, r), this.mesh.getColorAt(e, c), this.mesh.setColorAt(t, c), this.mesh.setColorAt(e, r);
      const f = this._originalColors.get(s);
      if (f) {
        const b = f.get(t);
        b && (f.delete(t), f.set(e, b));
      }
      const l = this._originalColors.get(i);
      if (l) {
        const b = l.get(e);
        b && (l.delete(e), l.set(t, b));
      }
    }
  }
};
const js = 2, ft = 4, ut = 4, Q = 4, xt = new Int32Array(2), Pe = new Float32Array(xt.buffer), Se = new Float64Array(xt.buffer), vs = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
var se;
(function(a) {
  a[a.UTF8_BYTES = 1] = "UTF8_BYTES", a[a.UTF16_STRING = 2] = "UTF16_STRING";
})(se || (se = {}));
class Ut {
  /**
   * Create a new ByteBuffer with a given array of bytes (`Uint8Array`)
   */
  constructor(t) {
    this.bytes_ = t, this.position_ = 0, this.text_decoder_ = new TextDecoder();
  }
  /**
   * Create and allocate a new ByteBuffer with a given size.
   */
  static allocate(t) {
    return new Ut(new Uint8Array(t));
  }
  clear() {
    this.position_ = 0;
  }
  /**
   * Get the underlying `Uint8Array`.
   */
  bytes() {
    return this.bytes_;
  }
  /**
   * Get the buffer's position.
   */
  position() {
    return this.position_;
  }
  /**
   * Set the buffer's position.
   */
  setPosition(t) {
    this.position_ = t;
  }
  /**
   * Get the buffer's capacity.
   */
  capacity() {
    return this.bytes_.length;
  }
  readInt8(t) {
    return this.readUint8(t) << 24 >> 24;
  }
  readUint8(t) {
    return this.bytes_[t];
  }
  readInt16(t) {
    return this.readUint16(t) << 16 >> 16;
  }
  readUint16(t) {
    return this.bytes_[t] | this.bytes_[t + 1] << 8;
  }
  readInt32(t) {
    return this.bytes_[t] | this.bytes_[t + 1] << 8 | this.bytes_[t + 2] << 16 | this.bytes_[t + 3] << 24;
  }
  readUint32(t) {
    return this.readInt32(t) >>> 0;
  }
  readInt64(t) {
    return BigInt.asIntN(64, BigInt(this.readUint32(t)) + (BigInt(this.readUint32(t + 4)) << BigInt(32)));
  }
  readUint64(t) {
    return BigInt.asUintN(64, BigInt(this.readUint32(t)) + (BigInt(this.readUint32(t + 4)) << BigInt(32)));
  }
  readFloat32(t) {
    return xt[0] = this.readInt32(t), Pe[0];
  }
  readFloat64(t) {
    return xt[vs ? 0 : 1] = this.readInt32(t), xt[vs ? 1 : 0] = this.readInt32(t + 4), Se[0];
  }
  writeInt8(t, s) {
    this.bytes_[t] = s;
  }
  writeUint8(t, s) {
    this.bytes_[t] = s;
  }
  writeInt16(t, s) {
    this.bytes_[t] = s, this.bytes_[t + 1] = s >> 8;
  }
  writeUint16(t, s) {
    this.bytes_[t] = s, this.bytes_[t + 1] = s >> 8;
  }
  writeInt32(t, s) {
    this.bytes_[t] = s, this.bytes_[t + 1] = s >> 8, this.bytes_[t + 2] = s >> 16, this.bytes_[t + 3] = s >> 24;
  }
  writeUint32(t, s) {
    this.bytes_[t] = s, this.bytes_[t + 1] = s >> 8, this.bytes_[t + 2] = s >> 16, this.bytes_[t + 3] = s >> 24;
  }
  writeInt64(t, s) {
    this.writeInt32(t, Number(BigInt.asIntN(32, s))), this.writeInt32(t + 4, Number(BigInt.asIntN(32, s >> BigInt(32))));
  }
  writeUint64(t, s) {
    this.writeUint32(t, Number(BigInt.asUintN(32, s))), this.writeUint32(t + 4, Number(BigInt.asUintN(32, s >> BigInt(32))));
  }
  writeFloat32(t, s) {
    Pe[0] = s, this.writeInt32(t, xt[0]);
  }
  writeFloat64(t, s) {
    Se[0] = s, this.writeInt32(t, xt[vs ? 0 : 1]), this.writeInt32(t + 4, xt[vs ? 1 : 0]);
  }
  /**
   * Return the file identifier.   Behavior is undefined for FlatBuffers whose
   * schema does not include a file_identifier (likely points at padding or the
   * start of a the root vtable).
   */
  getBufferIdentifier() {
    if (this.bytes_.length < this.position_ + ft + ut)
      throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
    let t = "";
    for (let s = 0; s < ut; s++)
      t += String.fromCharCode(this.readInt8(this.position_ + ft + s));
    return t;
  }
  /**
   * Look up a field in the vtable, return an offset into the object, or 0 if the
   * field is not present.
   */
  __offset(t, s) {
    const e = t - this.readInt32(t);
    return s < this.readInt16(e) ? this.readInt16(e + s) : 0;
  }
  /**
   * Initialize any Table-derived type to point to the union at the given offset.
   */
  __union(t, s) {
    return t.bb_pos = s + this.readInt32(s), t.bb = this, t;
  }
  /**
   * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
   * This allocates a new string and converts to wide chars upon each access.
   *
   * To avoid the conversion to string, pass Encoding.UTF8_BYTES as the
   * "optionalEncoding" argument. This is useful for avoiding conversion when
   * the data will just be packaged back up in another FlatBuffer later on.
   *
   * @param offset
   * @param opt_encoding Defaults to UTF16_STRING
   */
  __string(t, s) {
    t += this.readInt32(t);
    const e = this.readInt32(t);
    t += ft;
    const i = this.bytes_.subarray(t, t + e);
    return s === se.UTF8_BYTES ? i : this.text_decoder_.decode(i);
  }
  /**
   * Handle unions that can contain string as its member, if a Table-derived type then initialize it,
   * if a string then return a new one
   *
   * WARNING: strings are immutable in JS so we can't change the string that the user gave us, this
   * makes the behaviour of __union_with_string different compared to __union
   */
  __union_with_string(t, s) {
    return typeof t == "string" ? this.__string(s) : this.__union(t, s);
  }
  /**
   * Retrieve the relative offset stored at "offset"
   */
  __indirect(t) {
    return t + this.readInt32(t);
  }
  /**
   * Get the start of data of a vector whose offset is stored at "offset" in this object.
   */
  __vector(t) {
    return t + this.readInt32(t) + ft;
  }
  /**
   * Get the length of a vector whose offset is stored at "offset" in this object.
   */
  __vector_len(t) {
    return this.readInt32(t + this.readInt32(t));
  }
  __has_identifier(t) {
    if (t.length != ut)
      throw new Error("FlatBuffers: file identifier must be length " + ut);
    for (let s = 0; s < ut; s++)
      if (t.charCodeAt(s) != this.readInt8(this.position() + ft + s))
        return !1;
    return !0;
  }
  /**
   * A helper function for generating list for obj api
   */
  createScalarList(t, s) {
    const e = [];
    for (let i = 0; i < s; ++i) {
      const n = t(i);
      n !== null && e.push(n);
    }
    return e;
  }
  /**
   * A helper function for generating list for obj api
   * @param listAccessor function that accepts an index and return data at that index
   * @param listLength listLength
   * @param res result list
   */
  createObjList(t, s) {
    const e = [];
    for (let i = 0; i < s; ++i) {
      const n = t(i);
      n !== null && e.push(n.unpack());
    }
    return e;
  }
}
class cs {
  /**
   * Create a FlatBufferBuilder.
   */
  constructor(t) {
    this.minalign = 1, this.vtable = null, this.vtable_in_use = 0, this.isNested = !1, this.object_start = 0, this.vtables = [], this.vector_num_elems = 0, this.force_defaults = !1, this.string_maps = null, this.text_encoder = new TextEncoder();
    let s;
    t ? s = t : s = 1024, this.bb = Ut.allocate(s), this.space = s;
  }
  clear() {
    this.bb.clear(), this.space = this.bb.capacity(), this.minalign = 1, this.vtable = null, this.vtable_in_use = 0, this.isNested = !1, this.object_start = 0, this.vtables = [], this.vector_num_elems = 0, this.force_defaults = !1, this.string_maps = null;
  }
  /**
   * In order to save space, fields that are set to their default value
   * don't get serialized into the buffer. Forcing defaults provides a
   * way to manually disable this optimization.
   *
   * @param forceDefaults true always serializes default values
   */
  forceDefaults(t) {
    this.force_defaults = t;
  }
  /**
   * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
   * called finish(). The actual data starts at the ByteBuffer's current position,
   * not necessarily at 0.
   */
  dataBuffer() {
    return this.bb;
  }
  /**
   * Get the bytes representing the FlatBuffer. Only call this after you've
   * called finish().
   */
  asUint8Array() {
    return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
  }
  /**
   * Prepare to write an element of `size` after `additional_bytes` have been
   * written, e.g. if you write a string, you need to align such the int length
   * field is aligned to 4 bytes, and the string data follows it directly. If all
   * you need to do is alignment, `additional_bytes` will be 0.
   *
   * @param size This is the of the new element to write
   * @param additional_bytes The padding size
   */
  prep(t, s) {
    t > this.minalign && (this.minalign = t);
    const e = ~(this.bb.capacity() - this.space + s) + 1 & t - 1;
    for (; this.space < e + t + s; ) {
      const i = this.bb.capacity();
      this.bb = cs.growByteBuffer(this.bb), this.space += this.bb.capacity() - i;
    }
    this.pad(e);
  }
  pad(t) {
    for (let s = 0; s < t; s++)
      this.bb.writeInt8(--this.space, 0);
  }
  writeInt8(t) {
    this.bb.writeInt8(this.space -= 1, t);
  }
  writeInt16(t) {
    this.bb.writeInt16(this.space -= 2, t);
  }
  writeInt32(t) {
    this.bb.writeInt32(this.space -= 4, t);
  }
  writeInt64(t) {
    this.bb.writeInt64(this.space -= 8, t);
  }
  writeFloat32(t) {
    this.bb.writeFloat32(this.space -= 4, t);
  }
  writeFloat64(t) {
    this.bb.writeFloat64(this.space -= 8, t);
  }
  /**
   * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int8` to add the buffer.
   */
  addInt8(t) {
    this.prep(1, 0), this.writeInt8(t);
  }
  /**
   * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int16` to add the buffer.
   */
  addInt16(t) {
    this.prep(2, 0), this.writeInt16(t);
  }
  /**
   * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int32` to add the buffer.
   */
  addInt32(t) {
    this.prep(4, 0), this.writeInt32(t);
  }
  /**
   * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int64` to add the buffer.
   */
  addInt64(t) {
    this.prep(8, 0), this.writeInt64(t);
  }
  /**
   * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `float32` to add the buffer.
   */
  addFloat32(t) {
    this.prep(4, 0), this.writeFloat32(t);
  }
  /**
   * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `float64` to add the buffer.
   */
  addFloat64(t) {
    this.prep(8, 0), this.writeFloat64(t);
  }
  addFieldInt8(t, s, e) {
    (this.force_defaults || s != e) && (this.addInt8(s), this.slot(t));
  }
  addFieldInt16(t, s, e) {
    (this.force_defaults || s != e) && (this.addInt16(s), this.slot(t));
  }
  addFieldInt32(t, s, e) {
    (this.force_defaults || s != e) && (this.addInt32(s), this.slot(t));
  }
  addFieldInt64(t, s, e) {
    (this.force_defaults || s !== e) && (this.addInt64(s), this.slot(t));
  }
  addFieldFloat32(t, s, e) {
    (this.force_defaults || s != e) && (this.addFloat32(s), this.slot(t));
  }
  addFieldFloat64(t, s, e) {
    (this.force_defaults || s != e) && (this.addFloat64(s), this.slot(t));
  }
  addFieldOffset(t, s, e) {
    (this.force_defaults || s != e) && (this.addOffset(s), this.slot(t));
  }
  /**
   * Structs are stored inline, so nothing additional is being added. `d` is always 0.
   */
  addFieldStruct(t, s, e) {
    s != e && (this.nested(s), this.slot(t));
  }
  /**
   * Structures are always stored inline, they need to be created right
   * where they're used.  You'll get this assertion failure if you
   * created it elsewhere.
   */
  nested(t) {
    if (t != this.offset())
      throw new Error("FlatBuffers: struct must be serialized inline.");
  }
  /**
   * Should not be creating any other object, string or vector
   * while an object is being constructed
   */
  notNested() {
    if (this.isNested)
      throw new Error("FlatBuffers: object serialization must not be nested.");
  }
  /**
   * Set the current vtable at `voffset` to the current location in the buffer.
   */
  slot(t) {
    this.vtable !== null && (this.vtable[t] = this.offset());
  }
  /**
   * @returns Offset relative to the end of the buffer.
   */
  offset() {
    return this.bb.capacity() - this.space;
  }
  /**
   * Doubles the size of the backing ByteBuffer and copies the old data towards
   * the end of the new buffer (since we build the buffer backwards).
   *
   * @param bb The current buffer with the existing data
   * @returns A new byte buffer with the old data copied
   * to it. The data is located at the end of the buffer.
   *
   * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
   * it a uint8Array we need to suppress the type check:
   * @suppress {checkTypes}
   */
  static growByteBuffer(t) {
    const s = t.capacity();
    if (s & 3221225472)
      throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");
    const e = s << 1, i = Ut.allocate(e);
    return i.setPosition(e - s), i.bytes().set(t.bytes(), e - s), i;
  }
  /**
   * Adds on offset, relative to where it will be written.
   *
   * @param offset The offset to add.
   */
  addOffset(t) {
    this.prep(ft, 0), this.writeInt32(this.offset() - t + ft);
  }
  /**
   * Start encoding a new object in the buffer.  Users will not usually need to
   * call this directly. The FlatBuffers compiler will generate helper methods
   * that call this method internally.
   */
  startObject(t) {
    this.notNested(), this.vtable == null && (this.vtable = []), this.vtable_in_use = t;
    for (let s = 0; s < t; s++)
      this.vtable[s] = 0;
    this.isNested = !0, this.object_start = this.offset();
  }
  /**
   * Finish off writing the object that is under construction.
   *
   * @returns The offset to the object inside `dataBuffer`
   */
  endObject() {
    if (this.vtable == null || !this.isNested)
      throw new Error("FlatBuffers: endObject called without startObject");
    this.addInt32(0);
    const t = this.offset();
    let s = this.vtable_in_use - 1;
    for (; s >= 0 && this.vtable[s] == 0; s--)
      ;
    const e = s + 1;
    for (; s >= 0; s--)
      this.addInt16(this.vtable[s] != 0 ? t - this.vtable[s] : 0);
    const i = 2;
    this.addInt16(t - this.object_start);
    const n = (e + i) * js;
    this.addInt16(n);
    let o = 0;
    const r = this.space;
    t:
      for (s = 0; s < this.vtables.length; s++) {
        const c = this.bb.capacity() - this.vtables[s];
        if (n == this.bb.readInt16(c)) {
          for (let f = js; f < n; f += js)
            if (this.bb.readInt16(r + f) != this.bb.readInt16(c + f))
              continue t;
          o = this.vtables[s];
          break;
        }
      }
    return o ? (this.space = this.bb.capacity() - t, this.bb.writeInt32(this.space, o - t)) : (this.vtables.push(this.offset()), this.bb.writeInt32(this.bb.capacity() - t, this.offset() - t)), this.isNested = !1, t;
  }
  /**
   * Finalize a buffer, poiting to the given `root_table`.
   */
  finish(t, s, e) {
    const i = e ? Q : 0;
    if (s) {
      const n = s;
      if (this.prep(this.minalign, ft + ut + i), n.length != ut)
        throw new Error("FlatBuffers: file identifier must be length " + ut);
      for (let o = ut - 1; o >= 0; o--)
        this.writeInt8(n.charCodeAt(o));
    }
    this.prep(this.minalign, ft + i), this.addOffset(t), i && this.addInt32(this.bb.capacity() - this.space), this.bb.setPosition(this.space);
  }
  /**
   * Finalize a size prefixed buffer, pointing to the given `root_table`.
   */
  finishSizePrefixed(t, s) {
    this.finish(t, s, !0);
  }
  /**
   * This checks a required field has been set in a given table that has
   * just been constructed.
   */
  requiredField(t, s) {
    const e = this.bb.capacity() - t, i = e - this.bb.readInt32(e);
    if (!(s < this.bb.readInt16(i) && this.bb.readInt16(i + s) != 0))
      throw new Error("FlatBuffers: field " + s + " must be set");
  }
  /**
   * Start a new array/vector of objects.  Users usually will not call
   * this directly. The FlatBuffers compiler will create a start/end
   * method for vector types in generated code.
   *
   * @param elem_size The size of each element in the array
   * @param num_elems The number of elements in the array
   * @param alignment The alignment of the array
   */
  startVector(t, s, e) {
    this.notNested(), this.vector_num_elems = s, this.prep(ft, t * s), this.prep(e, t * s);
  }
  /**
   * Finish off the creation of an array and all its elements. The array must be
   * created with `startVector`.
   *
   * @returns The offset at which the newly created array
   * starts.
   */
  endVector() {
    return this.writeInt32(this.vector_num_elems), this.offset();
  }
  /**
   * Encode the string `s` in the buffer using UTF-8. If the string passed has
   * already been seen, we return the offset of the already written string
   *
   * @param s The string to encode
   * @return The offset in the buffer where the encoded string starts
   */
  createSharedString(t) {
    if (!t)
      return 0;
    if (this.string_maps || (this.string_maps = /* @__PURE__ */ new Map()), this.string_maps.has(t))
      return this.string_maps.get(t);
    const s = this.createString(t);
    return this.string_maps.set(t, s), s;
  }
  /**
   * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
   * instead of a string, it is assumed to contain valid UTF-8 encoded data.
   *
   * @param s The string to encode
   * @return The offset in the buffer where the encoded string starts
   */
  createString(t) {
    if (t == null)
      return 0;
    let s;
    t instanceof Uint8Array ? s = t : s = this.text_encoder.encode(t), this.addInt8(0), this.startVector(1, s.length, 1), this.bb.setPosition(this.space -= s.length);
    for (let e = 0, i = this.space, n = this.bb.bytes(); e < s.length; e++)
      n[i++] = s[e];
    return this.endVector();
  }
  /**
   * A helper function to pack an object
   *
   * @returns offset of obj
   */
  createObjectOffset(t) {
    return t === null ? 0 : typeof t == "string" ? this.createString(t) : t.pack(this);
  }
  /**
   * A helper function to pack a list of object
   *
   * @returns list of offsets of each non null object
   */
  createObjectOffsetList(t) {
    const s = [];
    for (let e = 0; e < t.length; ++e) {
      const i = t[e];
      if (i !== null)
        s.push(this.createObjectOffset(i));
      else
        throw new Error("FlatBuffers: Argument for createObjectOffsetList cannot contain null.");
    }
    return s;
  }
  createStructOffsetList(t, s) {
    return s(this, t.length), this.createObjectOffsetList(t.slice().reverse()), this.endVector();
  }
}
let Fs = class Dt {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsCivilCurve(t, s) {
    return (s || new Dt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsCivilCurve(t, s) {
    return t.setPosition(t.position() + Q), (s || new Dt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  points(t) {
    const s = this.bb.__offset(this.bb_pos, 4);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  pointsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  pointsArray() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  data(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  static startCivilCurve(t) {
    t.startObject(2);
  }
  static addPoints(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createPointsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startPointsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addData(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static endCivilCurve(t) {
    return t.endObject();
  }
  static createCivilCurve(t, s, e) {
    return Dt.startCivilCurve(t), Dt.addPoints(t, s), Dt.addData(t, e), Dt.endCivilCurve(t);
  }
}, Re = class ht {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsAlignment(t, s) {
    return (s || new ht()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsAlignment(t, s) {
    return t.setPosition(t.position() + Q), (s || new ht()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  vertical(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new Fs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  verticalLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  horizontal(t, s) {
    const e = this.bb.__offset(this.bb_pos, 6);
    return e ? (s || new Fs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  horizontalLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  absolute(t, s) {
    const e = this.bb.__offset(this.bb_pos, 8);
    return e ? (s || new Fs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  absoluteLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  initialPk() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.readFloat32(this.bb_pos + t) : 0;
  }
  static startAlignment(t) {
    t.startObject(4);
  }
  static addVertical(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createVerticalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startVerticalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addHorizontal(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createHorizontalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startHorizontalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addAbsolute(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createAbsoluteVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startAbsoluteVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addInitialPk(t, s) {
    t.addFieldFloat32(3, s, 0);
  }
  static endAlignment(t) {
    return t.endObject();
  }
  static createAlignment(t, s, e, i, n) {
    return ht.startAlignment(t), ht.addVertical(t, s), ht.addHorizontal(t, e), ht.addAbsolute(t, i), ht.addInitialPk(t, n), ht.endAlignment(t);
  }
}, Ne = class Ot {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsCivilData(t, s) {
    return (s || new Ot()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsCivilData(t, s) {
    return t.setPosition(t.position() + Q), (s || new Ot()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  alignments(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new Re()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  alignmentsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrix(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  coordinationMatrixLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrixArray() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  static startCivilData(t) {
    t.startObject(2);
  }
  static addAlignments(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createAlignmentsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startAlignmentsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addCoordinationMatrix(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createCoordinationMatrixVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startCoordinationMatrixVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endCivilData(t) {
    return t.endObject();
  }
  static createCivilData(t, s, e) {
    return Ot.startCivilData(t), Ot.addAlignments(t, s), Ot.addCoordinationMatrix(t, e), Ot.endCivilData(t);
  }
}, ee = class j {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsFragment(t, s) {
    return (s || new j()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  static getSizePrefixedRootAsFragment(t, s) {
    return t.setPosition(t.position() + Q), (s || new j()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  position(t) {
    const s = this.bb.__offset(this.bb_pos, 4);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  positionLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  positionArray() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  normal(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  normalLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  normalArray() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  index(t) {
    const s = this.bb.__offset(this.bb_pos, 8);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  indexLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  indexArray() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  groups(t) {
    const s = this.bb.__offset(this.bb_pos, 10);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  groupsLength() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  groupsArray() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  materials(t) {
    const s = this.bb.__offset(this.bb_pos, 12);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  materialsLength() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  materialsArray() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  matrices(t) {
    const s = this.bb.__offset(this.bb_pos, 14);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  matricesLength() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  matricesArray() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  colors(t) {
    const s = this.bb.__offset(this.bb_pos, 16);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  colorsLength() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  colorsArray() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  itemsSize(t) {
    const s = this.bb.__offset(this.bb_pos, 18);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsSizeLength() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsSizeArray() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  ids(t) {
    const s = this.bb.__offset(this.bb_pos, 20);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  idsLength() {
    const t = this.bb.__offset(this.bb_pos, 20);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  idsArray() {
    const t = this.bb.__offset(this.bb_pos, 20);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  id(t) {
    const s = this.bb.__offset(this.bb_pos, 22);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  capacity() {
    const t = this.bb.__offset(this.bb_pos, 24);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  capacityOffset() {
    const t = this.bb.__offset(this.bb_pos, 26);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  static startFragment(t) {
    t.startObject(12);
  }
  static addPosition(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createPositionVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startPositionVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addNormal(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createNormalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startNormalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIndex(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createIndexVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIndexVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addGroups(t, s) {
    t.addFieldOffset(3, s, 0);
  }
  static createGroupsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startGroupsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addMaterials(t, s) {
    t.addFieldOffset(4, s, 0);
  }
  static createMaterialsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startMaterialsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addMatrices(t, s) {
    t.addFieldOffset(5, s, 0);
  }
  static createMatricesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startMatricesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addColors(t, s) {
    t.addFieldOffset(6, s, 0);
  }
  static createColorsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startColorsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsSize(t, s) {
    t.addFieldOffset(7, s, 0);
  }
  static createItemsSizeVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsSizeVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIds(t, s) {
    t.addFieldOffset(8, s, 0);
  }
  static createIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addId(t, s) {
    t.addFieldOffset(9, s, 0);
  }
  static addCapacity(t, s) {
    t.addFieldInt32(10, s, 0);
  }
  static addCapacityOffset(t, s) {
    t.addFieldInt32(11, s, 0);
  }
  static endFragment(t) {
    return t.endObject();
  }
  static createFragment(t, s, e, i, n, o, r, c, f, l, b, h, d) {
    return j.startFragment(t), j.addPosition(t, s), j.addNormal(t, e), j.addIndex(t, i), j.addGroups(t, n), j.addMaterials(t, o), j.addMatrices(t, r), j.addColors(t, c), j.addItemsSize(t, f), j.addIds(t, l), j.addId(t, b), j.addCapacity(t, h), j.addCapacityOffset(t, d), j.endFragment(t);
  }
}, $s = class ie {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsFragmentsGroup(t, s) {
    return (s || new ie()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsFragmentsGroup(t, s) {
    return t.setPosition(t.position() + Q), (s || new ie()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  items(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new ee()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  itemsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  civil(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? (t || new Ne()).__init(
      this.bb.__indirect(this.bb_pos + s),
      this.bb
    ) : null;
  }
  coordinationMatrix(t) {
    const s = this.bb.__offset(this.bb_pos, 8);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  coordinationMatrixLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrixArray() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  ids(t) {
    const s = this.bb.__offset(this.bb_pos, 10);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  idsLength() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  idsArray() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsKeys(t) {
    const s = this.bb.__offset(this.bb_pos, 12);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsKeysLength() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsKeysArray() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsKeysIndices(t) {
    const s = this.bb.__offset(this.bb_pos, 14);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsKeysIndicesLength() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsKeysIndicesArray() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsRels(t) {
    const s = this.bb.__offset(this.bb_pos, 16);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsRelsLength() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsRelsArray() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsRelsIndices(t) {
    const s = this.bb.__offset(this.bb_pos, 18);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsRelsIndicesLength() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsRelsIndicesArray() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  fragmentKeys(t) {
    const s = this.bb.__offset(this.bb_pos, 20);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  id(t) {
    const s = this.bb.__offset(this.bb_pos, 22);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  name(t) {
    const s = this.bb.__offset(this.bb_pos, 24);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcName(t) {
    const s = this.bb.__offset(this.bb_pos, 26);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcDescription(t) {
    const s = this.bb.__offset(this.bb_pos, 28);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcSchema(t) {
    const s = this.bb.__offset(this.bb_pos, 30);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  maxExpressId() {
    const t = this.bb.__offset(this.bb_pos, 32);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  boundingBox(t) {
    const s = this.bb.__offset(this.bb_pos, 34);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  boundingBoxLength() {
    const t = this.bb.__offset(this.bb_pos, 34);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  boundingBoxArray() {
    const t = this.bb.__offset(this.bb_pos, 34);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  opaqueGeometriesIds(t) {
    const s = this.bb.__offset(this.bb_pos, 36);
    return s ? this.bb.readInt32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  opaqueGeometriesIdsLength() {
    const t = this.bb.__offset(this.bb_pos, 36);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  opaqueGeometriesIdsArray() {
    const t = this.bb.__offset(this.bb_pos, 36);
    return t ? new Int32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  transparentGeometriesIds(t) {
    const s = this.bb.__offset(this.bb_pos, 38);
    return s ? this.bb.readInt32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  transparentGeometriesIdsLength() {
    const t = this.bb.__offset(this.bb_pos, 38);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  transparentGeometriesIdsArray() {
    const t = this.bb.__offset(this.bb_pos, 38);
    return t ? new Int32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  static startFragmentsGroup(t) {
    t.startObject(18);
  }
  static addItems(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createItemsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startItemsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addCivil(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static addCoordinationMatrix(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createCoordinationMatrixVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startCoordinationMatrixVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIds(t, s) {
    t.addFieldOffset(3, s, 0);
  }
  static createIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsKeys(t, s) {
    t.addFieldOffset(4, s, 0);
  }
  static createItemsKeysVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsKeysVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsKeysIndices(t, s) {
    t.addFieldOffset(5, s, 0);
  }
  static createItemsKeysIndicesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsKeysIndicesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsRels(t, s) {
    t.addFieldOffset(6, s, 0);
  }
  static createItemsRelsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsRelsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsRelsIndices(t, s) {
    t.addFieldOffset(7, s, 0);
  }
  static createItemsRelsIndicesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsRelsIndicesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addFragmentKeys(t, s) {
    t.addFieldOffset(8, s, 0);
  }
  static addId(t, s) {
    t.addFieldOffset(9, s, 0);
  }
  static addName(t, s) {
    t.addFieldOffset(10, s, 0);
  }
  static addIfcName(t, s) {
    t.addFieldOffset(11, s, 0);
  }
  static addIfcDescription(t, s) {
    t.addFieldOffset(12, s, 0);
  }
  static addIfcSchema(t, s) {
    t.addFieldOffset(13, s, 0);
  }
  static addMaxExpressId(t, s) {
    t.addFieldInt32(14, s, 0);
  }
  static addBoundingBox(t, s) {
    t.addFieldOffset(15, s, 0);
  }
  static createBoundingBoxVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startBoundingBoxVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addOpaqueGeometriesIds(t, s) {
    t.addFieldOffset(16, s, 0);
  }
  static createOpaqueGeometriesIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startOpaqueGeometriesIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addTransparentGeometriesIds(t, s) {
    t.addFieldOffset(17, s, 0);
  }
  static createTransparentGeometriesIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startTransparentGeometriesIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endFragmentsGroup(t) {
    return t.endObject();
  }
  static finishFragmentsGroupBuffer(t, s) {
    t.finish(s);
  }
  static finishSizePrefixedFragmentsGroupBuffer(t, s) {
    t.finish(s, void 0, !0);
  }
};
class nn {
  constructor() {
    P(this, "version", 1);
    P(this, "fragmentIDSeparator", "|");
  }
  /** {@link FragmentParser.import} */
  import(t) {
    const s = new Ut(t), e = $s.getRootAsFragmentsGroup(s), i = this.constructFragmentGroup(e), n = e.itemsLength();
    for (let o = 0; o < n; o++) {
      const r = e.items(o);
      if (!r)
        continue;
      const c = this.constructGeometry(r), f = this.constructMaterials(r), l = r.capacity(), b = new Ee(c, f, l);
      b.capacityOffset = r.capacityOffset(), this.setInstances(r, b), this.setID(r, b), i.items.push(b), i.add(b.mesh);
    }
    return i;
  }
  /**
   * Exports the FragmentsGroup to a flatbuffer binary file.
   *
   * @param group - The FragmentsGroup to be exported.
   * @returns The flatbuffer binary file as a Uint8Array.
   */
  export(t) {
    const s = new cs(1024), e = [], i = $s, n = ee;
    let o = null;
    if (t.civilData) {
      const K = [], E = Re, z = Ne;
      for (const [at, mt] of t.civilData.alignments) {
        const { absolute: zt, horizontal: yt, vertical: Ct } = mt, Mt = this.saveCivilCurves(yt, s), Pt = this.saveCivilCurves(Ct, s), St = this.saveCivilCurves(zt, s), Tt = E.createHorizontalVector(s, Mt), Bt = E.createVerticalVector(s, Pt), gt = E.createAbsoluteVector(s, St);
        E.startAlignment(s), E.addHorizontal(s, Tt), E.addVertical(s, Bt), E.addAbsolute(s, gt), E.addInitialPk(s, mt.initialKP);
        const Jt = E.endAlignment(s);
        K.push(Jt);
      }
      const U = z.createAlignmentsVector(s, K), $ = z.createCoordinationMatrixVector(
        s,
        t.coordinationMatrix.elements
      );
      z.startCivilData(s), z.addAlignments(s, U), z.addCoordinationMatrix(s, $), o = z.endCivilData(s);
    }
    for (const K of t.items) {
      const E = K.exportData(), z = [];
      for (const Bt of K.ids) {
        const gt = K.getInstancesIDs(Bt);
        if (!gt)
          throw new Error("Instances not found!");
        z.push(gt.size);
      }
      const U = n.createPositionVector(s, E.position), $ = n.createNormalVector(s, E.normal), at = n.createIndexVector(s, E.index), mt = n.createGroupsVector(s, E.groups), zt = n.createMaterialsVector(s, E.materials), yt = n.createMatricesVector(s, E.matrices), Ct = n.createColorsVector(s, E.colors), Mt = n.createIdsVector(s, E.ids), Pt = n.createItemsSizeVector(s, z), St = s.createString(E.id);
      n.startFragment(s), n.addPosition(s, U), n.addNormal(s, $), n.addIndex(s, at), n.addGroups(s, mt), n.addMaterials(s, zt), n.addMatrices(s, yt), n.addColors(s, Ct), n.addIds(s, Mt), n.addItemsSize(s, Pt), n.addId(s, St), n.addCapacity(s, K.capacity), n.addCapacityOffset(s, K.capacityOffset);
      const Tt = ee.endFragment(s);
      e.push(Tt);
    }
    const r = i.createItemsVector(s, e), c = i.createCoordinationMatrixVector(
      s,
      t.coordinationMatrix.elements
    );
    let f = "";
    for (const K of t.keyFragments.values())
      f.length && (f += this.fragmentIDSeparator), f += K;
    const l = s.createString(f), b = [], h = [], d = [], _ = [], I = [];
    let y = 0, u = 0;
    for (const [K, [E, z]] of t.data) {
      b.push(y), d.push(u), I.push(K);
      for (const U of E)
        h.push(U);
      for (const U of z)
        _.push(U);
      y += E.length, u += z.length;
    }
    const p = [], w = [];
    for (const [K, E] of t.geometryIDs.opaque)
      p.push(K, E);
    for (const [K, E] of t.geometryIDs.transparent)
      w.push(K, E);
    const m = s.createString(t.uuid), g = s.createString(t.name), A = s.createString(t.ifcMetadata.name), F = s.createString(t.ifcMetadata.description), x = s.createString(t.ifcMetadata.schema), C = i.createItemsKeysIndicesVector(s, b), v = i.createItemsKeysVector(s, h), S = i.createItemsRelsIndicesVector(s, d), V = i.createItemsRelsVector(s, _), M = i.createIdsVector(s, I), T = i.createOpaqueGeometriesIdsVector(s, p), D = i.createTransparentGeometriesIdsVector(
      s,
      w
    ), { min: L, max: H } = t.boundingBox, Y = [L.x, L.y, L.z, H.x, H.y, H.z], Z = i.createBoundingBoxVector(s, Y);
    i.startFragmentsGroup(s), i.addId(s, m), i.addName(s, g), i.addIfcName(s, A), i.addIfcDescription(s, F), i.addIfcSchema(s, x), i.addMaxExpressId(s, t.ifcMetadata.maxExpressID), i.addItems(s, r), i.addFragmentKeys(s, l), i.addIds(s, M), i.addItemsKeysIndices(s, C), i.addItemsKeys(s, v), i.addItemsRelsIndices(s, S), i.addItemsRels(s, V), i.addCoordinationMatrix(s, c), i.addBoundingBox(s, Z), i.addOpaqueGeometriesIds(s, T), i.addTransparentGeometriesIds(s, D), o !== null && i.addCivil(s, o);
    const Ds = $s.endFragmentsGroup(s);
    return s.finish(Ds), s.asUint8Array();
  }
  setID(t, s) {
    const e = t.id();
    e && (s.id = e, s.mesh.uuid = e);
  }
  setInstances(t, s) {
    const e = t.matricesArray(), i = t.colorsArray(), n = t.idsArray(), o = t.itemsSizeArray();
    if (!e || !n || !o)
      throw new Error("Error: Can't load empty fragment!");
    const r = [];
    let c = 0;
    for (let f = 0; f < o.length; f++) {
      const l = n[f], b = o[f], h = [], d = [];
      for (let I = 0; I < b; I++) {
        const y = c * 16, u = e.subarray(y, y + 17), p = new O.Matrix4().fromArray(u);
        if (h.push(p), i) {
          const w = c * 3, [m, g, A] = i.subarray(w, w + 4), F = new O.Color(m, g, A);
          d.push(F);
        }
        c++;
      }
      const _ = d.length ? d : void 0;
      r.push({ id: l, transforms: h, colors: _ });
    }
    s.add(r);
  }
  constructMaterials(t) {
    const s = t.materialsArray(), e = [];
    if (!s)
      return e;
    for (let i = 0; i < s.length; i += 5) {
      const n = s[i], o = !!s[i + 1], r = s[i + 2], c = s[i + 3], f = s[i + 4], l = new O.Color(r, c, f), b = new O.MeshLambertMaterial({
        color: l,
        opacity: n,
        transparent: o
      });
      e.push(b);
    }
    return e;
  }
  constructFragmentGroup(t) {
    const s = new Ss(), e = t.civil();
    if (e) {
      const x = e.coordinationMatrixArray(), C = new O.Matrix4();
      x && C.fromArray(x), s.civilData = { alignments: /* @__PURE__ */ new Map(), coordinationMatrix: C };
      const v = e.alignmentsLength();
      for (let S = 0; S < v; S++) {
        const V = new O.LineBasicMaterial({ color: 16777215 }), M = new qe(), T = e.alignments(S);
        if (!T)
          throw new Error("Alignment not found!");
        const D = T.horizontalLength();
        M.horizontal = this.constructCivilCurves(
          T,
          M,
          "horizontal",
          D,
          V
        );
        const L = T.verticalLength();
        M.vertical = this.constructCivilCurves(
          T,
          M,
          "vertical",
          L,
          V
        );
        const H = T.horizontalLength();
        M.absolute = this.constructCivilCurves(
          T,
          M,
          "absolute",
          H,
          V
        ), M.initialKP = T.initialPk(), s.civilData.alignments.set(S, M);
      }
    }
    s.uuid = t.id() || s.uuid, s.name = t.name() || "", s.ifcMetadata = {
      name: t.ifcName() || "",
      description: t.ifcDescription() || "",
      schema: t.ifcSchema() || "IFC2X3",
      maxExpressID: t.maxExpressId() || 0
    };
    const i = new O.Matrix4().elements, n = t.coordinationMatrixArray() || i, o = t.idsArray() || new Uint32Array(), r = t.itemsKeysIndicesArray() || new Uint32Array(), c = t.itemsKeysArray() || new Uint32Array(), f = t.itemsRelsArray() || new Uint32Array(), l = t.itemsRelsIndicesArray() || new Uint32Array(), h = (t.fragmentKeys() || "").split(this.fragmentIDSeparator);
    this.setGroupData(s, o, r, c, 0), this.setGroupData(s, o, l, f, 1);
    const d = t.opaqueGeometriesIdsArray() || new Uint32Array(), _ = t.transparentGeometriesIdsArray() || new Uint32Array(), I = /* @__PURE__ */ new Map();
    for (let x = 0; x < d.length - 1; x += 2) {
      const C = d[x], v = d[x + 1];
      I.set(C, v);
    }
    const y = /* @__PURE__ */ new Map();
    for (let x = 0; x < _.length - 1; x += 2) {
      const C = _[x], v = _[x + 1];
      y.set(C, v);
    }
    s.geometryIDs = { opaque: I, transparent: y };
    const u = t.boundingBoxArray() || [0, 0, 0, 0, 0, 0], [p, w, m, g, A, F] = u;
    s.boundingBox.min.set(p, w, m), s.boundingBox.max.set(g, A, F);
    for (let x = 0; x < h.length; x++)
      s.keyFragments.set(x, h[x]);
    return n.length === 16 && s.coordinationMatrix.fromArray(n), s;
  }
  setGroupData(t, s, e, i, n) {
    for (let o = 0; o < e.length; o++) {
      const r = s[o], c = e[o], f = e[o + 1] || i.length, l = [];
      for (let h = c; h < f; h++)
        l.push(i[h]);
      t.data.has(r) || t.data.set(r, [[], []]);
      const b = t.data.get(r);
      b && (b[n] = l);
    }
  }
  constructGeometry(t) {
    const s = t.positionArray() || new Float32Array(), e = t.normalArray() || new Float32Array(), i = t.indexArray(), n = t.groupsArray();
    if (!i)
      throw new Error("Index not found!");
    const o = new O.BufferGeometry();
    if (o.setIndex(Array.from(i)), o.setAttribute("position", new O.BufferAttribute(s, 3)), o.setAttribute("normal", new O.BufferAttribute(e, 3)), n)
      for (let r = 0; r < n.length; r += 3) {
        const c = n[r], f = n[r + 1], l = n[r + 2];
        o.addGroup(c, f, l);
      }
    return o;
  }
  constructCivilCurves(t, s, e, i, n) {
    const o = [];
    for (let r = 0; r < i; r++) {
      const c = t[e](r);
      if (!c)
        throw new Error("Curve not found!");
      const f = c.pointsArray();
      if (f === null)
        throw new Error("Curve points not found!");
      let l = {};
      const b = c.data();
      b && (l = JSON.parse(b));
      const h = new O.EdgesGeometry(), d = new O.BufferAttribute(f, 3);
      h.setAttribute("position", d);
      const _ = [];
      for (let y = 0; y < f.length / 3 - 1; y++)
        _.push(y, y + 1);
      h.setIndex(_);
      const I = new Ke(r, l, s, h, n);
      o.push(I.curve);
    }
    return o;
  }
  saveCivilCurves(t, s) {
    const e = Fs, i = [];
    for (const n of t) {
      const r = n.mesh.geometry.attributes.position.array, c = e.createPointsVector(s, r), f = s.createString(JSON.stringify(n.data));
      e.startCivilCurve(s), e.addPoints(s, c), e.addData(s, f);
      const l = e.endCivilCurve(s);
      i.push(l);
    }
    return i;
  }
}
let Cs = class Lt {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsCivilCurve(t, s) {
    return (s || new Lt()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  static getSizePrefixedRootAsCivilCurve(t, s) {
    return t.setPosition(t.position() + Q), (s || new Lt()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  points(t) {
    const s = this.bb.__offset(this.bb_pos, 4);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  pointsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  pointsArray() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  data(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  static startCivilCurve(t) {
    t.startObject(2);
  }
  static addPoints(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createPointsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startPointsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addData(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static endCivilCurve(t) {
    return t.endObject();
  }
  static createCivilCurve(t, s, e) {
    return Lt.startCivilCurve(t), Lt.addPoints(t, s), Lt.addData(t, e), Lt.endCivilCurve(t);
  }
}, ke = class bt {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsAlignment(t, s) {
    return (s || new bt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsAlignment(t, s) {
    return t.setPosition(t.position() + Q), (s || new bt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  vertical(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new Cs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  verticalLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  horizontal(t, s) {
    const e = this.bb.__offset(this.bb_pos, 6);
    return e ? (s || new Cs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  horizontalLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  absolute(t, s) {
    const e = this.bb.__offset(this.bb_pos, 8);
    return e ? (s || new Cs()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  absoluteLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  initialPk() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.readFloat32(this.bb_pos + t) : 0;
  }
  static startAlignment(t) {
    t.startObject(4);
  }
  static addVertical(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createVerticalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startVerticalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addHorizontal(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createHorizontalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startHorizontalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addAbsolute(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createAbsoluteVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startAbsoluteVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addInitialPk(t, s) {
    t.addFieldFloat32(3, s, 0);
  }
  static endAlignment(t) {
    return t.endObject();
  }
  static createAlignment(t, s, e, i, n) {
    return bt.startAlignment(t), bt.addVertical(t, s), bt.addHorizontal(t, e), bt.addAbsolute(t, i), bt.addInitialPk(t, n), bt.endAlignment(t);
  }
};
class dt {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsCivilData(t, s) {
    return (s || new dt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsCivilData(t, s) {
    return t.setPosition(t.position() + Q), (s || new dt()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  alignments(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new ke()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  alignmentsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrix(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  coordinationMatrixLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrixArray() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  static startCivilData(t) {
    t.startObject(2);
  }
  static addAlignments(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createAlignmentsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startAlignmentsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addCoordinationMatrix(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createCoordinationMatrixVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startCoordinationMatrixVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endCivilData(t) {
    return t.endObject();
  }
  static createCivilData(t, s, e) {
    return dt.startCivilData(t), dt.addAlignments(t, s), dt.addCoordinationMatrix(t, e), dt.endCivilData(t);
  }
}
class k {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsFragment(t, s) {
    return (s || new k()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  static getSizePrefixedRootAsFragment(t, s) {
    return t.setPosition(t.position() + Q), (s || new k()).__init(t.readInt32(t.position()) + t.position(), t);
  }
  position(t) {
    const s = this.bb.__offset(this.bb_pos, 4);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  positionLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  positionArray() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  normal(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  normalLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  normalArray() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  index(t) {
    const s = this.bb.__offset(this.bb_pos, 8);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  indexLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  indexArray() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  groups(t) {
    const s = this.bb.__offset(this.bb_pos, 10);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  groupsLength() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  groupsArray() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  materials(t) {
    const s = this.bb.__offset(this.bb_pos, 12);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  materialsLength() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  materialsArray() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  matrices(t) {
    const s = this.bb.__offset(this.bb_pos, 14);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  matricesLength() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  matricesArray() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  colors(t) {
    const s = this.bb.__offset(this.bb_pos, 16);
    return s ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  colorsLength() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  colorsArray() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  itemsSize(t) {
    const s = this.bb.__offset(this.bb_pos, 18);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsSizeLength() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsSizeArray() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  ids(t) {
    const s = this.bb.__offset(this.bb_pos, 20);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  idsLength() {
    const t = this.bb.__offset(this.bb_pos, 20);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  idsArray() {
    const t = this.bb.__offset(this.bb_pos, 20);
    return t ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t), this.bb.__vector_len(this.bb_pos + t)) : null;
  }
  id(t) {
    const s = this.bb.__offset(this.bb_pos, 22);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  capacity() {
    const t = this.bb.__offset(this.bb_pos, 24);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  capacityOffset() {
    const t = this.bb.__offset(this.bb_pos, 26);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  static startFragment(t) {
    t.startObject(12);
  }
  static addPosition(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createPositionVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startPositionVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addNormal(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createNormalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startNormalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIndex(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createIndexVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIndexVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addGroups(t, s) {
    t.addFieldOffset(3, s, 0);
  }
  static createGroupsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startGroupsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addMaterials(t, s) {
    t.addFieldOffset(4, s, 0);
  }
  static createMaterialsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startMaterialsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addMatrices(t, s) {
    t.addFieldOffset(5, s, 0);
  }
  static createMatricesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startMatricesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addColors(t, s) {
    t.addFieldOffset(6, s, 0);
  }
  static createColorsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startColorsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsSize(t, s) {
    t.addFieldOffset(7, s, 0);
  }
  static createItemsSizeVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsSizeVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIds(t, s) {
    t.addFieldOffset(8, s, 0);
  }
  static createIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addId(t, s) {
    t.addFieldOffset(9, s, 0);
  }
  static addCapacity(t, s) {
    t.addFieldInt32(10, s, 0);
  }
  static addCapacityOffset(t, s) {
    t.addFieldInt32(11, s, 0);
  }
  static endFragment(t) {
    return t.endObject();
  }
  static createFragment(t, s, e, i, n, o, r, c, f, l, b, h, d) {
    return k.startFragment(t), k.addPosition(t, s), k.addNormal(t, e), k.addIndex(t, i), k.addGroups(t, n), k.addMaterials(t, o), k.addMatrices(t, r), k.addColors(t, c), k.addItemsSize(t, f), k.addIds(t, l), k.addId(t, b), k.addCapacity(t, h), k.addCapacityOffset(t, d), k.endFragment(t);
  }
}
let Hs = class ne {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsFragmentsGroup(t, s) {
    return (s || new ne()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsFragmentsGroup(t, s) {
    return t.setPosition(t.position() + Q), (s || new ne()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  items(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new k()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  itemsLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  civil(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? (t || new dt()).__init(
      this.bb.__indirect(this.bb_pos + s),
      this.bb
    ) : null;
  }
  coordinationMatrix(t) {
    const s = this.bb.__offset(this.bb_pos, 8);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  coordinationMatrixLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  coordinationMatrixArray() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  ids(t) {
    const s = this.bb.__offset(this.bb_pos, 10);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  idsLength() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  idsArray() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsKeys(t) {
    const s = this.bb.__offset(this.bb_pos, 12);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsKeysLength() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsKeysArray() {
    const t = this.bb.__offset(this.bb_pos, 12);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsKeysIndices(t) {
    const s = this.bb.__offset(this.bb_pos, 14);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsKeysIndicesLength() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsKeysIndicesArray() {
    const t = this.bb.__offset(this.bb_pos, 14);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsRels(t) {
    const s = this.bb.__offset(this.bb_pos, 16);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsRelsLength() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsRelsArray() {
    const t = this.bb.__offset(this.bb_pos, 16);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  itemsRelsIndices(t) {
    const s = this.bb.__offset(this.bb_pos, 18);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  itemsRelsIndicesLength() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  itemsRelsIndicesArray() {
    const t = this.bb.__offset(this.bb_pos, 18);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  fragmentKeys(t) {
    const s = this.bb.__offset(this.bb_pos, 20);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  globalIds(t) {
    const s = this.bb.__offset(this.bb_pos, 22);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  id(t) {
    const s = this.bb.__offset(this.bb_pos, 24);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  name(t) {
    const s = this.bb.__offset(this.bb_pos, 26);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcName(t) {
    const s = this.bb.__offset(this.bb_pos, 28);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcDescription(t) {
    const s = this.bb.__offset(this.bb_pos, 30);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  ifcSchema(t) {
    const s = this.bb.__offset(this.bb_pos, 32);
    return s ? this.bb.__string(this.bb_pos + s, t) : null;
  }
  maxExpressId() {
    const t = this.bb.__offset(this.bb_pos, 34);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  boundingBox(t) {
    const s = this.bb.__offset(this.bb_pos, 36);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  boundingBoxLength() {
    const t = this.bb.__offset(this.bb_pos, 36);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  boundingBoxArray() {
    const t = this.bb.__offset(this.bb_pos, 36);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  opaqueGeometriesIds(t) {
    const s = this.bb.__offset(this.bb_pos, 38);
    return s ? this.bb.readInt32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  opaqueGeometriesIdsLength() {
    const t = this.bb.__offset(this.bb_pos, 38);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  opaqueGeometriesIdsArray() {
    const t = this.bb.__offset(this.bb_pos, 38);
    return t ? new Int32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  transparentGeometriesIds(t) {
    const s = this.bb.__offset(this.bb_pos, 40);
    return s ? this.bb.readInt32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  transparentGeometriesIdsLength() {
    const t = this.bb.__offset(this.bb_pos, 40);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  transparentGeometriesIdsArray() {
    const t = this.bb.__offset(this.bb_pos, 40);
    return t ? new Int32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  static startFragmentsGroup(t) {
    t.startObject(19);
  }
  static addItems(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createItemsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startItemsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addCivil(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static addCoordinationMatrix(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createCoordinationMatrixVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startCoordinationMatrixVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIds(t, s) {
    t.addFieldOffset(3, s, 0);
  }
  static createIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsKeys(t, s) {
    t.addFieldOffset(4, s, 0);
  }
  static createItemsKeysVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsKeysVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsKeysIndices(t, s) {
    t.addFieldOffset(5, s, 0);
  }
  static createItemsKeysIndicesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsKeysIndicesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsRels(t, s) {
    t.addFieldOffset(6, s, 0);
  }
  static createItemsRelsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsRelsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addItemsRelsIndices(t, s) {
    t.addFieldOffset(7, s, 0);
  }
  static createItemsRelsIndicesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startItemsRelsIndicesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addFragmentKeys(t, s) {
    t.addFieldOffset(8, s, 0);
  }
  static addGlobalIds(t, s) {
    t.addFieldOffset(9, s, 0);
  }
  static addId(t, s) {
    t.addFieldOffset(10, s, 0);
  }
  static addName(t, s) {
    t.addFieldOffset(11, s, 0);
  }
  static addIfcName(t, s) {
    t.addFieldOffset(12, s, 0);
  }
  static addIfcDescription(t, s) {
    t.addFieldOffset(13, s, 0);
  }
  static addIfcSchema(t, s) {
    t.addFieldOffset(14, s, 0);
  }
  static addMaxExpressId(t, s) {
    t.addFieldInt32(15, s, 0);
  }
  static addBoundingBox(t, s) {
    t.addFieldOffset(16, s, 0);
  }
  static createBoundingBoxVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startBoundingBoxVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addOpaqueGeometriesIds(t, s) {
    t.addFieldOffset(17, s, 0);
  }
  static createOpaqueGeometriesIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startOpaqueGeometriesIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addTransparentGeometriesIds(t, s) {
    t.addFieldOffset(18, s, 0);
  }
  static createTransparentGeometriesIdsVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startTransparentGeometriesIdsVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endFragmentsGroup(t) {
    return t.endObject();
  }
  static finishFragmentsGroupBuffer(t, s) {
    t.finish(s);
  }
  static finishSizePrefixedFragmentsGroupBuffer(t, s) {
    t.finish(s, void 0, !0);
  }
};
class on {
  constructor() {
    P(this, "version", 2);
    P(this, "separator", "|");
  }
  /** {@link FragmentParser.import} */
  import(t) {
    const s = new Ut(t), e = Hs.getRootAsFragmentsGroup(s), i = this.constructFragmentGroup(e), n = e.itemsLength();
    for (let o = 0; o < n; o++) {
      const r = e.items(o);
      if (!r)
        continue;
      const c = this.constructGeometry(r), f = this.constructMaterials(r), l = r.capacity(), b = new Ee(c, f, l);
      b.capacityOffset = r.capacityOffset(), this.setInstances(r, b), this.setID(r, b), i.items.push(b), i.add(b.mesh);
    }
    return i;
  }
  /**
   * Exports the FragmentsGroup to a flatbuffer binary file.
   *
   * @param group - The FragmentsGroup to be exported.
   * @returns The flatbuffer binary file as a Uint8Array.
   */
  export(t) {
    const s = new cs(1024), e = [], i = Hs, n = k;
    let o = null;
    if (t.civilData) {
      const z = [], U = ke, $ = dt;
      for (const [zt, yt] of t.civilData.alignments) {
        const { absolute: Ct, horizontal: Mt, vertical: Pt } = yt, St = this.saveCivilCurves(Mt, s), Tt = this.saveCivilCurves(Pt, s), Bt = this.saveCivilCurves(Ct, s), gt = U.createHorizontalVector(s, St), Jt = U.createVerticalVector(s, Tt), as = U.createAbsoluteVector(s, Bt);
        U.startAlignment(s), U.addHorizontal(s, gt), U.addVertical(s, Jt), U.addAbsolute(s, as), U.addInitialPk(s, yt.initialKP);
        const je = U.endAlignment(s);
        z.push(je);
      }
      const at = $.createAlignmentsVector(s, z), mt = $.createCoordinationMatrixVector(
        s,
        t.coordinationMatrix.elements
      );
      $.startCivilData(s), $.addAlignments(s, at), $.addCoordinationMatrix(s, mt), o = $.endCivilData(s);
    }
    for (const z of t.items) {
      const U = z.exportData(), $ = [];
      for (const Jt of z.ids) {
        const as = z.getInstancesIDs(Jt);
        if (!as)
          throw new Error("Instances not found!");
        $.push(as.size);
      }
      const at = n.createPositionVector(s, U.position), mt = n.createNormalVector(s, U.normal), zt = n.createIndexVector(s, U.index), yt = n.createGroupsVector(s, U.groups), Ct = n.createMaterialsVector(s, U.materials), Mt = n.createMatricesVector(s, U.matrices), Pt = n.createColorsVector(s, U.colors), St = n.createIdsVector(s, U.ids), Tt = n.createItemsSizeVector(s, $), Bt = s.createString(U.id);
      n.startFragment(s), n.addPosition(s, at), n.addNormal(s, mt), n.addIndex(s, zt), n.addGroups(s, yt), n.addMaterials(s, Ct), n.addMatrices(s, Mt), n.addColors(s, Pt), n.addIds(s, St), n.addItemsSize(s, Tt), n.addId(s, Bt), n.addCapacity(s, z.capacity), n.addCapacityOffset(s, z.capacityOffset);
      const gt = k.endFragment(s);
      e.push(gt);
    }
    const r = i.createItemsVector(s, e), c = i.createCoordinationMatrixVector(
      s,
      t.coordinationMatrix.elements
    );
    let f = "";
    for (const z of t.keyFragments.values())
      f.length && (f += this.separator), f += z;
    let l = "";
    for (const [z] of t.globalToExpressIDs)
      l.length && (l += this.separator), l += z;
    const b = s.createString(f), h = s.createString(l), d = [], _ = [], I = [], y = [], u = [];
    let p = 0, w = 0;
    for (const [z, [U, $]] of t.data) {
      d.push(p), I.push(w), u.push(z);
      for (const at of U)
        _.push(at);
      for (const at of $)
        y.push(at);
      p += U.length, w += $.length;
    }
    const m = [], g = [];
    for (const [z, U] of t.geometryIDs.opaque)
      m.push(z, U);
    for (const [z, U] of t.geometryIDs.transparent)
      g.push(z, U);
    const A = s.createString(t.uuid), F = s.createString(t.name), x = s.createString(t.ifcMetadata.name), C = s.createString(t.ifcMetadata.description), v = s.createString(t.ifcMetadata.schema), S = i.createItemsKeysIndicesVector(s, d), V = i.createItemsKeysVector(s, _), M = i.createItemsRelsIndicesVector(s, I), T = i.createItemsRelsVector(s, y), D = i.createIdsVector(s, u), L = i.createOpaqueGeometriesIdsVector(s, m), H = i.createTransparentGeometriesIdsVector(
      s,
      g
    ), { min: Y, max: Z } = t.boundingBox, Ds = [Y.x, Y.y, Y.z, Z.x, Z.y, Z.z], K = i.createBoundingBoxVector(s, Ds);
    i.startFragmentsGroup(s), i.addId(s, A), i.addName(s, F), i.addIfcName(s, x), i.addIfcDescription(s, C), i.addIfcSchema(s, v), i.addMaxExpressId(s, t.ifcMetadata.maxExpressID), i.addItems(s, r), i.addFragmentKeys(s, b), i.addGlobalIds(s, h), i.addIds(s, D), i.addItemsKeysIndices(s, S), i.addItemsKeys(s, V), i.addItemsRelsIndices(s, M), i.addItemsRels(s, T), i.addCoordinationMatrix(s, c), i.addBoundingBox(s, K), i.addOpaqueGeometriesIds(s, L), i.addTransparentGeometriesIds(s, H), o !== null && i.addCivil(s, o);
    const E = Hs.endFragmentsGroup(s);
    return s.finish(E), s.asUint8Array();
  }
  setID(t, s) {
    const e = t.id();
    e && (s.id = e, s.mesh.uuid = e);
  }
  setInstances(t, s) {
    const e = t.matricesArray(), i = t.colorsArray(), n = t.idsArray(), o = t.itemsSizeArray();
    if (!e || !n || !o)
      throw new Error("Error: Can't load empty fragment!");
    const r = [];
    let c = 0;
    for (let f = 0; f < o.length; f++) {
      const l = n[f], b = o[f], h = [], d = [];
      for (let I = 0; I < b; I++) {
        const y = c * 16, u = e.subarray(y, y + 17), p = new O.Matrix4().fromArray(u);
        if (h.push(p), i) {
          const w = c * 3, [m, g, A] = i.subarray(w, w + 4), F = new O.Color(m, g, A);
          d.push(F);
        }
        c++;
      }
      const _ = d.length ? d : void 0;
      r.push({ id: l, transforms: h, colors: _ });
    }
    s.add(r);
  }
  constructMaterials(t) {
    const s = t.materialsArray(), e = [];
    if (!s)
      return e;
    for (let i = 0; i < s.length; i += 5) {
      const n = s[i], o = !!s[i + 1], r = s[i + 2], c = s[i + 3], f = s[i + 4], l = new O.Color(r, c, f), b = new O.MeshLambertMaterial({
        color: l,
        opacity: n,
        transparent: o
      });
      e.push(b);
    }
    return e;
  }
  constructFragmentGroup(t) {
    const s = new Ss(), e = t.civil();
    if (e) {
      const v = e.coordinationMatrixArray(), S = new O.Matrix4();
      v && S.fromArray(v), s.civilData = { alignments: /* @__PURE__ */ new Map(), coordinationMatrix: S };
      const V = e.alignmentsLength();
      for (let M = 0; M < V; M++) {
        const T = new O.LineBasicMaterial({ color: 16777215 }), D = new qe(), L = e.alignments(M);
        if (!L)
          throw new Error("Alignment not found!");
        const H = L.horizontalLength();
        D.horizontal = this.constructCivilCurves(
          L,
          D,
          "horizontal",
          H,
          T
        );
        const Y = L.verticalLength();
        D.vertical = this.constructCivilCurves(
          L,
          D,
          "vertical",
          Y,
          T
        );
        const Z = L.horizontalLength();
        D.absolute = this.constructCivilCurves(
          L,
          D,
          "absolute",
          Z,
          T
        ), D.initialKP = L.initialPk(), s.civilData.alignments.set(M, D);
      }
    }
    s.uuid = t.id() || s.uuid, s.name = t.name() || "", s.ifcMetadata = {
      name: t.ifcName() || "",
      description: t.ifcDescription() || "",
      schema: t.ifcSchema() || "IFC2X3",
      maxExpressID: t.maxExpressId() || 0
    };
    const i = new O.Matrix4().elements, n = t.coordinationMatrixArray() || i, o = t.idsArray() || new Uint32Array(), r = t.itemsKeysIndicesArray() || new Uint32Array(), c = t.itemsKeysArray() || new Uint32Array(), f = t.itemsRelsArray() || new Uint32Array(), l = t.itemsRelsIndicesArray() || new Uint32Array(), h = (t.fragmentKeys() || "").split(this.separator), _ = (t.globalIds() || "").split(this.separator);
    this.setGroupData(s, o, r, c, 0), this.setGroupData(s, o, l, f, 1);
    const I = t.opaqueGeometriesIdsArray() || new Uint32Array(), y = t.transparentGeometriesIdsArray() || new Uint32Array(), u = /* @__PURE__ */ new Map();
    for (let v = 0; v < I.length - 1; v += 2) {
      const S = I[v], V = I[v + 1];
      u.set(S, V);
    }
    const p = /* @__PURE__ */ new Map();
    for (let v = 0; v < y.length - 1; v += 2) {
      const S = y[v], V = y[v + 1];
      p.set(S, V);
    }
    s.geometryIDs = { opaque: u, transparent: p };
    const w = t.boundingBoxArray() || [0, 0, 0, 0, 0, 0], [m, g, A, F, x, C] = w;
    s.boundingBox.min.set(m, g, A), s.boundingBox.max.set(F, x, C);
    for (let v = 0; v < h.length; v++)
      s.keyFragments.set(v, h[v]);
    n.length === 16 && s.coordinationMatrix.fromArray(n);
    for (let v = 0; v < o.length; v++)
      s.globalToExpressIDs.set(_[v], o[v]);
    return s;
  }
  setGroupData(t, s, e, i, n) {
    for (let o = 0; o < e.length; o++) {
      const r = s[o], c = e[o], f = e[o + 1], l = f === void 0 ? i.length : f, b = [];
      for (let d = c; d < l; d++)
        b.push(i[d]);
      t.data.has(r) || t.data.set(r, [[], []]);
      const h = t.data.get(r);
      h && (h[n] = b);
    }
  }
  constructGeometry(t) {
    const s = t.positionArray() || new Float32Array(), e = t.normalArray() || new Float32Array(), i = t.indexArray(), n = t.groupsArray();
    if (!i)
      throw new Error("Index not found!");
    const o = new O.BufferGeometry();
    if (o.setIndex(Array.from(i)), o.setAttribute("position", new O.BufferAttribute(s, 3)), o.setAttribute("normal", new O.BufferAttribute(e, 3)), n)
      for (let r = 0; r < n.length; r += 3) {
        const c = n[r], f = n[r + 1], l = n[r + 2];
        o.addGroup(c, f, l);
      }
    return o;
  }
  constructCivilCurves(t, s, e, i, n) {
    const o = [];
    for (let r = 0; r < i; r++) {
      const c = t[e](r);
      if (!c)
        throw new Error("Curve not found!");
      const f = c.pointsArray();
      if (f === null)
        throw new Error("Curve points not found!");
      let l = {};
      const b = c.data();
      b && (l = JSON.parse(b));
      const h = new O.EdgesGeometry(), d = new O.BufferAttribute(f, 3);
      h.setAttribute("position", d);
      const _ = [];
      for (let y = 0; y < f.length / 3 - 1; y++)
        _.push(y, y + 1);
      h.setIndex(_);
      const I = new Ke(r, l, s, h, n);
      o.push(I.curve);
    }
    return o;
  }
  saveCivilCurves(t, s) {
    const e = Cs, i = [];
    for (const n of t) {
      const r = n.mesh.geometry.attributes.position.array, c = e.createPointsVector(s, r), f = s.createString(JSON.stringify(n.data));
      e.startCivilCurve(s), e.addPoints(s, c), e.addData(s, f);
      const l = e.endCivilCurve(s);
      i.push(l);
    }
    return i;
  }
}
class ln {
  constructor() {
    // prettier-ignore
    P(this, "parsers", [
      new on(),
      new nn()
    ]);
    /** {@link FragmentParser.version} */
    P(this, "version", "auto");
  }
  /** {@link FragmentParser.import} */
  import(t) {
    const s = this.parsers.length;
    if (this.version === "auto") {
      for (let o = 0; o < this.parsers.length; o++) {
        const c = this.parsers[o].import(t);
        if (Object.keys(c).length !== 0) {
          if (o !== 0) {
            const f = this.parsers.length - o;
            this.warnVersion(f, s);
          }
          return c;
        }
      }
      throw new Error("No valid parser found for this file");
    }
    this.checkCurrentVersionValid(this.version);
    const e = this.parsers.length - this.version, n = this.parsers[e].import(t);
    if (Object.keys(n).length === 0)
      throw new Error(
        `The given version ${this.version} doesn't match to the given file. Try using "auto" in the version property to handle versions automatically.`
      );
    return n;
  }
  /** {@link FragmentParser.export} */
  export(t) {
    if (this.version === "auto")
      return this.parsers[0].export(t);
    this.checkCurrentVersionValid(this.version);
    const s = this.parsers.length - this.version;
    return this.parsers[s].export(t);
  }
  checkCurrentVersionValid(t) {
    if (this.version === "auto")
      return;
    if (this.version !== t && this.warnVersion(this.version, t), !Number.isInteger(this.version))
      throw new Error(
        "Invalid version. Non-automatic versions must an integer."
      );
    if (this.version < 1 || this.version > t)
      throw new Error(
        `Invalid version. Versions range from 1 to ${t}.`
      );
  }
  warnVersion(t, s) {
    console.warn(
      `This fragment file version is ${t}. The latest version is ${s}. To avoid issues, please consider updating your fragments. You can do so by regenerating your fragments from the original IFC file.`
    );
  }
}
class rn {
  constructor(t) {
    P(this, "baseDirectory");
    P(this, "maxDeadTime", 6e4);
    P(this, "mode", "buffer");
    P(this, "_memoryCleanTime", 1e4);
    P(this, "_intervalID", null);
    P(this, "_isCleaningMemory", !1);
    P(this, "cleanMemory", async () => {
      if (this._isCleaningMemory)
        return;
      this._isCleaningMemory = !0;
      const t = await this.getDir(this.baseDirectory), s = /* @__PURE__ */ new Set(), e = (/* @__PURE__ */ new Date()).getTime();
      for await (const i of t.values()) {
        const n = localStorage.getItem(i.name) || "0", o = parseInt(n, 10);
        e - o > this.maxDeadTime && (s.add(i.name), localStorage.removeItem(i.name));
      }
      for (const i of s)
        t.removeEntry(i);
      this._isCleaningMemory = !1;
    });
    this.baseDirectory = t, this.setupMemoryCleanup();
  }
  get memoryCleanTime() {
    return this._memoryCleanTime;
  }
  set memoryCleanTime(t) {
    this._memoryCleanTime = t, this.dispose(), this.setupMemoryCleanup();
  }
  async get(t) {
    const s = this.encodeName(t), e = await this.getDir(this.baseDirectory);
    try {
      const n = await (await e.getFileHandle(s)).getFile();
      return this.updateLastAccessTime(s), n;
    } catch {
      return null;
    }
  }
  async add(t, s) {
    const e = this.encodeName(t), o = await (await (await this.getDir(this.baseDirectory)).getFileHandle(e, {
      create: !0
    })).createWritable();
    await o.write(s), await o.close(), this.updateLastAccessTime(e);
  }
  async clear() {
    const t = await this.getDir(this.baseDirectory);
    for await (const [s] of t.entries())
      await t.removeEntry(s);
  }
  dispose() {
    this._intervalID !== null && window.clearInterval(this._intervalID);
  }
  setupMemoryCleanup() {
    this._intervalID = window.setInterval(
      this.cleanMemory,
      this.memoryCleanTime
    );
  }
  async getDir(t) {
    return (await navigator.storage.getDirectory()).getDirectoryHandle(t, {
      create: !0
    });
  }
  encodeName(t) {
    const s = /[\\/:*?"<>|]/g;
    return t.replace(s, "ñ");
  }
  updateLastAccessTime(t) {
    const s = (/* @__PURE__ */ new Date()).getTime().toString();
    localStorage.setItem(t, s);
  }
}
const N = class N extends O.Group {
  constructor() {
    super(...arguments);
    /**
     * An array of Fragment objects that are part of this group.
     */
    P(this, "items", []);
    /**
     * A THREE.Box3 object representing the bounding box of all fragments in this group.
     */
    P(this, "boundingBox", new O.Box3());
    /**
     * A THREE.Matrix4 object representing the coordination matrix of this group.
     */
    P(this, "coordinationMatrix", new O.Matrix4());
    /**
     * A Map object where the keys are uints and the values are strings representing fragment IDs.
     * This is used to save memory by mapping keys to fragment IDs.
     */
    P(this, "keyFragments", /* @__PURE__ */ new Map());
    /**
     * A Map object where the keys are global IDs and the values are expressIDs.
     */
    P(this, "globalToExpressIDs", /* @__PURE__ */ new Map());
    /**
     * A Map object where the keys are express IDs and the values are arrays of two arrays.
     * The first array contains fragment keys to which this asset belongs, and the second array contains floor and category IDs.
     */
    P(this, "data", /* @__PURE__ */ new Map());
    /**
     * An object with two Map properties, 'opaque' and 'transparent', representing the geometry IDs and keys of opaque and transparent fragments. They must be distinguished because THREE.js doesn't support transparency per instance in InstancedMesh.
     */
    P(this, "geometryIDs", {
      opaque: /* @__PURE__ */ new Map(),
      transparent: /* @__PURE__ */ new Map()
    });
    /**
     * An object representing metadata about the IFC model defined by the IFC schema.
     */
    P(this, "ifcMetadata", {
      name: "",
      description: "",
      schema: "IFC2X3",
      maxExpressID: 0
    });
    /**
     * An optional object containing civil engineering data.
     */
    P(this, "civilData");
    /**
     * An object containing settings for streaming data, including base URL, base file name, IDs, and types.
     */
    P(this, "streamSettings", {
      baseFileName: "",
      ids: /* @__PURE__ */ new Map(),
      types: /* @__PURE__ */ new Map()
    });
    /**
     * Whether this fragments group is being streamed or not.
     */
    P(this, "isStreamed", !1);
    /**
     * A protected property representing local properties of the fragments in this group.
     */
    P(this, "_properties");
  }
  /**
   * A getter that checks if this group has properties, either locally defined or streamed from a data source.
   */
  get hasProperties() {
    const s = this._properties !== void 0, e = this.streamSettings.ids.size !== 0;
    return s || e;
  }
  /**
   * A method to create a map of fragment IDs and express IDs contained within them. This is useful because if you want to get "a chair", it might be made of 4 different geometries, and thus the subsets of 4 different fragments. Using this method, you would get exactly the fragments of where that chair is.
   * @param expressIDs - An iterable of express IDs to create the map for.
   * @returns A map where the keys are fragment IDs and the values are sets of express IDs.
   */
  getFragmentMap(s) {
    const e = {};
    for (const i of s) {
      const n = this.data.get(i);
      if (n)
        for (const o of n[0]) {
          const r = this.keyFragments.get(o);
          r !== void 0 && (e[r] || (e[r] = /* @__PURE__ */ new Set()), e[r].add(i));
        }
    }
    return e;
  }
  /**
   * Method to retrieve the vertices of a specific item within the fragments.
   * This method finds the fragments that contain the specified item,
   * then retrieves the vertices of those fragments.
   *
   * @param itemID - The ID of the item for which to retrieve vertices. Usually, an IFC expressID.
   * @returns An array of THREE.Vector3 objects representing the vertices of the specified item.
   *
   * @example
   * ```typescript
   * const itemVertices = fragmentsGroup.getItemVertices(12345);
   * for (const vertex of itemVertices) {
   *   console.log(`Vertex: ${vertex.x}, ${vertex.y}, ${vertex.z}`);
   * }
   * ```
   */
  getItemVertices(s) {
    const e = [], i = this.getFragmentMap([s]);
    for (const n in i) {
      const o = this.items.find(
        (c) => c.id === n
      );
      if (!o)
        continue;
      const r = o.getInstancesIDs(s);
      if (r)
        for (const c of r) {
          const f = new O.Matrix4();
          o.mesh.getMatrixAt(c, f);
          for (const l of o.uniqueVertices) {
            const b = l.clone().applyMatrix4(f);
            e.push(b);
          }
        }
    }
    return e;
  }
  /**
   * Enables or disables the local property caching system.
   *
   * @param enabled - Whether to enable or disable it.
   */
  static setPropertiesDB(s) {
    s ? N.propertiesDB || (N.propertiesDB = new rn(
      "that-open-company-streaming-properties"
    )) : s || N.propertiesDB && N.propertiesDB.dispose();
  }
  /**
   * Method to dispose of the resources used by the FragmentsGroup.
   *
   * @param disposeResources - If true, also dispose of the resources used by the fragments (geometries and materials). Default is true.
   */
  dispose(s = !0) {
    for (const e of this.items)
      e.dispose(s);
    if (this.coordinationMatrix = new O.Matrix4(), this.keyFragments.clear(), this.data.clear(), this._properties = {}, this.removeFromParent(), this.items = [], this.civilData) {
      const { alignments: e } = this.civilData;
      for (const [i, n] of e)
        this.disposeAlignment(n.vertical), this.disposeAlignment(n.horizontal), this.disposeAlignment(n.absolute);
    }
    this.civilData = void 0;
  }
  /**
   * Method to set local properties of the fragments in this group.
   *
   * @param properties - An object containing properties of type IfcProperties.
   * The keys of the object are express IDs as strings, and the values are objects representing the properties of the corresponding express ID.
   *
   * @example
   * ```typescript
   * const properties: IfcProperties = {
   *   "12345": {
   *     name: "Chair",
   *     type: 1001,
   *     color: [0.5, 0.5, 0.5],
   *     //... other properties
   *   },
   *   "67890": {
   *     name: "Table",
   *     type: 1002,
   *     color: [0.8, 0.8, 0.8],
   *     //... other properties
   *   },
   *   //... more properties
   * };
   *
   * fragmentsGroup.setLocalProperties(properties);
   * ```
   */
  setLocalProperties(s) {
    this._properties = s;
  }
  /**
   * Method to retrieve the local properties of the fragments in this group.
   *
   * @returns {IfcProperties | undefined} - An object containing properties of type IfcProperties.
   * The keys of the object are express IDs as strings, and the values are objects representing the properties of the corresponding express ID.
   * If no local properties are set, it returns `undefined`.
   *
   * @example
   * ```typescript
   * const properties = fragmentsGroup.getLocalProperties();
   * if (properties) {
   *   for (const id in properties) {
   *     const property = properties[id];
   *     console.log(`ID: ${id}, Name: ${property.name}, Type: ${property.type}`);
   *   }
   * }
   * ```
   */
  getLocalProperties() {
    return this._properties;
  }
  /**
   * Method to retrieve all property IDs from either local properties or streamed properties.
   *
   * @returns {number[]} - An array of property IDs.
   *
   * @example
   * ```typescript
   * const propertyIDs = fragmentsGroup.getAllPropertiesIDs();
   * console.log(propertyIDs); // Output: [12345, 67890,...]
   * ```
   */
  getAllPropertiesIDs() {
    return this._properties ? Object.keys(this._properties).map((s) => parseInt(s, 10)) : Array.from(this.streamSettings.ids.keys());
  }
  /**
   * Method to retrieve all property types from either local properties or streamed properties.
   *
   * @returns {number[]} - An array of unique property types.
   *
   * @example
   * ```typescript
   * const propertyTypes = fragmentsGroup.getAllPropertiesTypes();
   * console.log(propertyTypes); // Output: [1001, 1002,...]
   * ```
   */
  getAllPropertiesTypes() {
    if (this._properties) {
      const s = /* @__PURE__ */ new Set();
      for (const e in this._properties) {
        const i = this._properties[e];
        i.type !== void 0 && s.add(i.type);
      }
      return Array.from(s);
    }
    return Array.from(this.streamSettings.types.keys());
  }
  async getProperties(s) {
    if (this._properties)
      return this._properties[s] || null;
    const e = this.getPropsURL(s), i = await this.getPropertiesData(e);
    return i ? i[s] : null;
  }
  /**
   * Method to set properties of a specific fragment in this group.
   *
   * @param id - The ID of the fragment for which to set properties.
   * @param value - The new properties to set for the fragment. If null, it deletes the properties for the fragment.
   * @throws Will throw an error if writing streamed properties, as it is not supported yet.
   *
   * @example
   * ```typescript
   * const properties: IfcProperties = {
   *   "12345": {
   *     name: "Chair",
   *     type: 1001,
   *     color: [0.5, 0.5, 0.5],
   *     //... other properties
   *   },
   * };
   *
   * fragmentsGroup.setProperties(12345, properties[12345]);
   * ```
   */
  async setProperties(s, e) {
    if (this._properties) {
      e !== null ? this._properties[s] = e : delete this._properties[s];
      return;
    }
    throw new Error("Writing streamed properties not supported yet!");
  }
  /**
   * Method to retrieve all properties of a specific type from either local properties or streamed properties.
   *
   * @param type - The type of properties to retrieve.
   * @returns A Promise that resolves to an object containing properties of type IfcProperties, or null if no properties of the specified type are found.
   *
   * @example
   * ```typescript
   * const type = 1001; // Example type
   * fragmentsGroup.getAllPropertiesOfType(type).then((properties) => {
   *   if (properties) {
   *     for (const id in properties) {
   *       const property = properties[id];
   *       console.log(`ID: ${id}, Name: ${property.name}, Type: ${property.type}`);
   *     }
   *   } else {
   *     console.log(`No properties of type ${type} found.`);
   *   }
   * });
   * ```
   */
  async getAllPropertiesOfType(s) {
    if (this._properties) {
      const o = {};
      let r = !1;
      for (const c in this._properties) {
        const f = this._properties[c];
        f.type === s && (o[f.expressID] = f, r = !0);
      }
      return r ? o : null;
    }
    const { types: e } = this.streamSettings, i = e.get(s);
    if (i === void 0)
      return null;
    const n = {};
    for (const o of i) {
      const r = this.constructFileName(o), c = await this.getPropertiesData(r);
      for (const f in c)
        n[parseInt(f, 10)] = c[f];
    }
    return n;
  }
  clone(s) {
    throw new Error("Use FragmentsGroup.cloneGroup instead!");
  }
  /**
   * Creates a copy of the whole group or a part of it. Each fragment clone shares the geometry of with its respective original fragment, but has its own InstancedMesh data, so it also needs to be disposed.
   *
   * @param items - Optional - The part of the group to be cloned. If not given, the whole group is cloned.
   *
   */
  cloneGroup(s) {
    const e = new N();
    e.coordinationMatrix = this.coordinationMatrix, e.position.copy(this.position), e.rotation.copy(this.rotation), e.scale.copy(this.scale), e.updateMatrix(), e.ifcMetadata = { ...this.ifcMetadata }, s || (s = this.getFragmentMap(this.data.keys()));
    const i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map();
    for (const o of this.items) {
      if (!s[o.id])
        continue;
      const r = s[o.id], c = o.clone(r);
      n.set(o.id, c.id), e.items.push(c), e.add(c.mesh);
      for (const f of r)
        i.add(f);
    }
    for (const o of i) {
      const r = this.data.get(o);
      r && e.data.set(o, r);
    }
    for (const [o, r] of this.keyFragments)
      if (n.has(r)) {
        const c = n.get(r);
        if (c === void 0)
          throw new Error("Malformed fragment ID map during clone!");
        e.keyFragments.set(o, c);
      }
    for (const [o, r] of this.globalToExpressIDs)
      i.has(r) && e.globalToExpressIDs.set(o, r);
    return this.civilData && (e.civilData = {
      coordinationMatrix: this.coordinationMatrix,
      alignments: /* @__PURE__ */ new Map()
    }), e;
  }
  getPropsURL(s) {
    const { ids: e } = this.streamSettings, i = e.get(s);
    if (i === void 0)
      throw new Error("ID not found");
    return this.constructFileName(i);
  }
  async getPropertiesData(s) {
    var i;
    (i = this.streamSettings.baseUrl) != null && i.length && (console.warn(
      "streamSettings.baseUrl is deprecated. Use FragmentsGroup.url instead."
    ), N.url = this.streamSettings.baseUrl);
    let e;
    if (N.useCache) {
      let n = null;
      if (N.propertiesDB && (n = await N.propertiesDB.get(s)), n)
        e = await n.text();
      else if (e = await (await N.fetch(s)).text(), N.propertiesDB) {
        const c = new TextEncoder().encode(e);
        await N.propertiesDB.add(s, c);
      }
    } else
      e = await (await N.fetch(s)).text();
    return JSON.parse(e);
  }
  constructFileName(s) {
    const { baseFileName: e } = this.streamSettings;
    return `${e}-${s}`;
  }
  disposeAlignment(s) {
    for (const e of s)
      if (e.mesh.geometry.dispose(), Array.isArray(e.mesh.material))
        for (const i of e.mesh.material)
          i.dispose();
      else
        e.mesh.material.dispose();
    s.length = 0;
  }
};
P(N, "fetch", async (s) => fetch(`${N.url}${s}`)), /**
 * Default URL for requesting property tiles. Feel free to change this, or override the FragmentsGroup.fetch method for more granular control.
 */
P(N, "url", ""), /**
 * Whether to use local cache when streaming properties.
 */
P(N, "useCache", !0), /**
 * The object in charge of caching property files locally to save requests over the network.
 */
P(N, "propertiesDB", null);
let Ss = N;
class qe {
  constructor() {
    /**
     * Vertical civil curves in the alignment.
     */
    P(this, "vertical", []);
    /**
     * Horizontal civil curves in the alignment.
     */
    P(this, "horizontal", []);
    /**
     * Absolute civil curves in the alignment.
     */
    P(this, "absolute", []);
    /**
     * Initial KP (Kilometer Point) of the alignment.
     */
    P(this, "initialKP", 0);
  }
  /**
   * Returns the total length of the specified alignment type.
   * @param type - The type of alignment (vertical, horizontal, or absolute).
   * @returns The total length of the specified alignment type.
   */
  getLength(t) {
    let s = 0;
    for (const e of this[t])
      s += e.getLength();
    return s;
  }
  /**
   * Returns the point at the specified percentage along the specified alignment type.
   * @param percentage - The percentage along the alignment type (between zero and one).
   * @param type - The type of alignment (vertical, horizontal, or absolute).
   * @returns The point at the specified percentage along the specified alignment type.
   * @throws Will throw an error if the percentage is out of range or if the point cannot be computed.
   */
  getPointAt(t, s) {
    const e = this.getCurveAt(t, s);
    return e.curve.getPointAt(e.percentage);
  }
  // Returns the percentage or null if the point is not contained in this alignment
  getPercentageAt(t, s, e = 0.01) {
    const i = this[s];
    let n = 0;
    for (const o of i) {
      const r = o.getPercentageAt(t, e), c = o.getLength();
      if (r !== null) {
        const f = n + r * c, l = this.getLength(s);
        return f / l;
      }
      n += c;
    }
    return null;
  }
  /**
   * Returns the curve and the percentage at the specified percentage along the specified alignment type.
   * If the percentage is out of range, it will be clamped to the nearest valid value (0 or 1).
   * If the point cannot be computed, an error will be thrown.
   *
   * @param percentage - The percentage along the alignment type (between zero and one).
   * @param type - The type of alignment (vertical, horizontal, or absolute).
   * @returns An object containing the curve and the percentage along the curve.
   * @throws Will throw an error if the percentage is out of range or if the point cannot be computed.
   */
  getCurveAt(t, s) {
    t < 0 ? t = 0 : t > 1 && (t = 1);
    const e = this[s], n = this.getLength(s) * t;
    let o = 0;
    for (const r of e) {
      const c = r.getLength();
      if (o + c >= n) {
        const l = (n - o) / c;
        return { curve: r, percentage: l };
      }
      o += c;
    }
    throw new Error("Could not compute point!");
  }
}
class cn {
  /**
   * Constructs a new instance of CivilCurve.
   * @param index - The index of the curve.
   * @param mesh - The mesh associated with the curve.
   * @param data - Additional data associated with the curve.
   * @param alignment - The alignment of the curve.
   */
  constructor(t, s, e, i) {
    /**
     * The index of the curve. An alignment is a sequence of ordered curves, and this is the index of this curve in that sequence.
     */
    P(this, "index");
    /**
     * The THREE.js mesh containing the vertices of the curve.
     */
    P(this, "mesh");
    /**
     * Additional data associated with the curve.
     */
    P(this, "data");
    /**
     * The alignment to which this curve belongs.
     */
    P(this, "alignment");
    this.index = t, this.mesh = s, this.data = e, this.alignment = i;
  }
  get _index() {
    return this.mesh.geometry.index;
  }
  get _pos() {
    return this.mesh.geometry.attributes.position.array;
  }
  /**
   * Calculates the total length of the curve by summing up the lengths of all segments.
   * @returns The total length of the curve.
   */
  getLength() {
    let t = 0;
    for (let s = 0; s < this._index.array.length - 1; s += 2) {
      const { startPoint: e, endPoint: i } = this.getSegment(s);
      t += e.distanceTo(i);
    }
    return t;
  }
  /**
   * Calculates a point on the curve based on the given percentage.
   *
   * @param percentage - The percentage along the curve (between zero and one).
   * @returns A new THREE.Vector3 representing the point on the curve.
   *
   * @remarks
   * The method works by first finding the segment that corresponds to the given percentage.
   * It then normalizes the direction of the segment, multiplies it by the distance to the start of the segment,
   * and adds it to the start point of the segment.
   *
   * @throws Will throw an error if the percentage is outside the range [0, 1].
   */
  getPointAt(t) {
    const { startPoint: s, endPoint: e, distanceToStart: i } = this.getSegmentAt(t), n = e.clone();
    return n.sub(s), n.normalize(), n.multiplyScalar(i), n.add(s), n;
  }
  /**
   * Calculates a segment of the curve based on the given percentage.
   *
   * @param percentage - The percentage along the curve (between zero and one).
   * @returns An object containing the distance to the start of the segment, the index of the segment, and the start and end points of the segment.
   *
   * @remarks
   * The method works by first finding the segment that corresponds to the given percentage.
   * It then returns an object containing the distance to the start of the segment, the index of the segment, and the start and end points of the segment.
   *
   * @throws Will throw an error if the percentage is outside the range [0, 1].
   */
  getSegmentAt(t) {
    t < 0 ? t = 0 : t > 1 && (t = 1);
    const e = this.getLength() * t;
    let i = 0;
    for (let n = 0; n < this._index.array.length - 1; n += 2) {
      const { startPoint: o, endPoint: r } = this.getSegment(n), c = o.distanceTo(r);
      if (i + c >= e)
        return { distanceToStart: e - i, index: n, startPoint: o, endPoint: r };
      i += c;
    }
    throw new Error("Could not compute point");
  }
  /**
   * Calculates the percentage of the curve that corresponds to the given point.
   *
   * @param point - The point for which to calculate the percentage.
   * @param tolerance - The tolerance for determining if a point is on the curve. Default is 0.01.
   * @returns The percentage of the curve that corresponds to the given point, or null if the point is not contained in this curve.
   *
   * @remarks
   * The method works by iterating over each segment of the curve and checking if the given point is within the tolerance of the segment.
   * If a point is found, it calculates the percentage of the curve that corresponds to the point.
   * If no point is found, it returns null.
   */
  getPercentageAt(t, s = 0.01) {
    let e = 0;
    for (let i = 0; i < this._index.array.length - 1; i += 2) {
      const { startPoint: n, endPoint: o } = this.getSegment(i), r = n.distanceTo(o), c = t.distanceTo(n), f = t.distanceTo(o);
      if (c + f - r <= s) {
        const h = e + c, d = this.getLength();
        return h / d;
      }
      e += r;
    }
    return null;
  }
  /**
   * Retrieves a segment of the curve based on the given index.
   *
   * @param index - The index of the segment.
   * @returns An object containing the start and end points of the segment.
   *
   * @remarks
   * The method calculates the start and end points of the segment based on the given index.
   * It uses the index array and position attribute of the curve's geometry to determine the start and end points.
   *
   * @throws Will throw an error if the index is out of range.
   */
  getSegment(t) {
    const s = this._index.array[t] * 3, e = this._index.array[t + 1] * 3, i = new O.Vector3(
      this._pos[s],
      this._pos[s + 1],
      this._pos[s + 2]
    ), n = new O.Vector3(
      this._pos[e],
      this._pos[e + 1],
      this._pos[e + 2]
    );
    return { startPoint: i, endPoint: n };
  }
}
class Ke extends O.LineSegments {
  /**
   * Constructs a new instance of CurveMesh.
   *
   * @param index - The index of the curve mesh.
   * @param data - The data associated with the curve mesh.
   * @param alignment - The alignment of the curve mesh.
   * @param geometry - The geometry for the curve mesh. Optional.
   * @param material - The material(s) for the curve mesh. Optional.
   */
  constructor(s, e, i, n, o) {
    super(n, o);
    /**
     * The civil curve associated with this curve mesh.
     */
    P(this, "curve");
    this.curve = new cn(s, this, e, i);
  }
}
class ot {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsStreamedGeometry(t, s) {
    return (s || new ot()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsStreamedGeometry(t, s) {
    return t.setPosition(t.position() + Q), (s || new ot()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  geometryId() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.readUint32(this.bb_pos + t) : 0;
  }
  position(t) {
    const s = this.bb.__offset(this.bb_pos, 6);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  positionLength() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  positionArray() {
    const t = this.bb.__offset(this.bb_pos, 6);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  normal(t) {
    const s = this.bb.__offset(this.bb_pos, 8);
    return s ? this.bb.readFloat32(
      this.bb.__vector(this.bb_pos + s) + t * 4
    ) : 0;
  }
  normalLength() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  normalArray() {
    const t = this.bb.__offset(this.bb_pos, 8);
    return t ? new Float32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  index(t) {
    const s = this.bb.__offset(this.bb_pos, 10);
    return s ? this.bb.readUint32(this.bb.__vector(this.bb_pos + s) + t * 4) : 0;
  }
  indexLength() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  indexArray() {
    const t = this.bb.__offset(this.bb_pos, 10);
    return t ? new Uint32Array(
      this.bb.bytes().buffer,
      this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + t),
      this.bb.__vector_len(this.bb_pos + t)
    ) : null;
  }
  static startStreamedGeometry(t) {
    t.startObject(4);
  }
  static addGeometryId(t, s) {
    t.addFieldInt32(0, s, 0);
  }
  static addPosition(t, s) {
    t.addFieldOffset(1, s, 0);
  }
  static createPositionVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startPositionVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addNormal(t, s) {
    t.addFieldOffset(2, s, 0);
  }
  static createNormalVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addFloat32(s[e]);
    return t.endVector();
  }
  static startNormalVector(t, s) {
    t.startVector(4, s, 4);
  }
  static addIndex(t, s) {
    t.addFieldOffset(3, s, 0);
  }
  static createIndexVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addInt32(s[e]);
    return t.endVector();
  }
  static startIndexVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endStreamedGeometry(t) {
    return t.endObject();
  }
  static createStreamedGeometry(t, s, e, i, n) {
    return ot.startStreamedGeometry(t), ot.addGeometryId(t, s), ot.addPosition(t, e), ot.addNormal(t, i), ot.addIndex(t, n), ot.endStreamedGeometry(t);
  }
}
class At {
  constructor() {
    P(this, "bb", null);
    P(this, "bb_pos", 0);
  }
  __init(t, s) {
    return this.bb_pos = t, this.bb = s, this;
  }
  static getRootAsStreamedGeometries(t, s) {
    return (s || new At()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  static getSizePrefixedRootAsStreamedGeometries(t, s) {
    return t.setPosition(t.position() + Q), (s || new At()).__init(
      t.readInt32(t.position()) + t.position(),
      t
    );
  }
  geometries(t, s) {
    const e = this.bb.__offset(this.bb_pos, 4);
    return e ? (s || new ot()).__init(
      this.bb.__indirect(
        this.bb.__vector(this.bb_pos + e) + t * 4
      ),
      this.bb
    ) : null;
  }
  geometriesLength() {
    const t = this.bb.__offset(this.bb_pos, 4);
    return t ? this.bb.__vector_len(this.bb_pos + t) : 0;
  }
  static startStreamedGeometries(t) {
    t.startObject(1);
  }
  static addGeometries(t, s) {
    t.addFieldOffset(0, s, 0);
  }
  static createGeometriesVector(t, s) {
    t.startVector(4, s.length, 4);
    for (let e = s.length - 1; e >= 0; e--)
      t.addOffset(s[e]);
    return t.endVector();
  }
  static startGeometriesVector(t, s) {
    t.startVector(4, s, 4);
  }
  static endStreamedGeometries(t) {
    return t.endObject();
  }
  static finishStreamedGeometriesBuffer(t, s) {
    t.finish(s);
  }
  static finishSizePrefixedStreamedGeometriesBuffer(t, s) {
    t.finish(s, void 0, !0);
  }
  static createStreamedGeometries(t, s) {
    return At.startStreamedGeometries(t), At.addGeometries(t, s), At.endStreamedGeometries(t);
  }
}
class hn {
  /**
   * Imports geometry data from a byte array in a streamed format.
   *
   * @param bytes - The byte array containing the serialized geometry data.
   * @returns A Map of geometry IDs to their respective position, normal, and index arrays.
   * @throws Will throw an error if the geometry ID is not found.
   */
  import(t) {
    const s = new Ut(t), e = At.getRootAsStreamedGeometries(s), i = /* @__PURE__ */ new Map(), n = e.geometriesLength();
    for (let o = 0; o < n; o++) {
      const r = e.geometries(o);
      if (!r)
        continue;
      const c = r.geometryId();
      if (c === null)
        throw new Error("Error finding ID!");
      const f = r.positionArray(), l = r.normalArray(), b = r.indexArray();
      !f || !l || !b || i.set(c, { position: f, normal: l, index: b });
    }
    return i;
  }
  /**
   * Exports geometry data to a byte array in a streamed format.
   *
   * @param geometries - A Map of geometry IDs to their respective position, normal, and index arrays.
   * @returns A Uint8Array containing the serialized geometry data.
   */
  export(t) {
    const s = new cs(1024), e = [], i = At, n = ot;
    for (const [c, { index: f, position: l, normal: b }] of t) {
      const h = n.createIndexVector(s, f), d = n.createPositionVector(s, l), _ = n.createNormalVector(s, b);
      n.startStreamedGeometry(s), n.addGeometryId(s, c), n.addIndex(s, h), n.addPosition(s, d), n.addNormal(s, _);
      const I = n.endStreamedGeometry(s);
      e.push(I);
    }
    const o = i.createGeometriesVector(s, e);
    i.startStreamedGeometries(s), i.addGeometries(s, o);
    const r = i.endStreamedGeometries(s);
    return s.finish(r), s.asUint8Array();
  }
}
class bn {
  static combine(t) {
    if (t.length === 0)
      return {};
    if (t.length === 1)
      return t[0];
    const s = {};
    for (const e of t)
      for (const i in e) {
        s[i] || (s[i] = /* @__PURE__ */ new Set());
        for (const n of e[i])
          s[i].add(n);
      }
    return s;
  }
  static intersect(t) {
    if (t.length === 0)
      return {};
    if (t.length === 1)
      return t[0];
    const s = /* @__PURE__ */ new Map();
    let e = 0;
    for (const n of t) {
      e++;
      for (const o in n) {
        s.has(o) || s.set(o, {
          count: 0,
          ids: /* @__PURE__ */ new Map()
        });
        const r = s.get(o);
        r.count++;
        for (const c of n[o]) {
          const f = r.ids.get(c) || 0;
          r.ids.set(c, f + 1);
        }
      }
    }
    const i = {};
    for (const [n, { count: o, ids: r }] of s)
      if (o === e)
        for (const [c, f] of r)
          f === e && (i[n] || (i[n] = /* @__PURE__ */ new Set()), i[n].add(c));
    return i;
  }
  static export(t) {
    const s = {};
    for (const e in t)
      s[e] = Array.from(t[e]);
    return JSON.stringify(s);
  }
  static import(t) {
    const s = JSON.parse(t), e = {};
    for (const i in s)
      e[i] = new Set(s[i]);
    return e;
  }
}
export {
  qe as Alignment,
  cn as CivilCurve,
  Ke as CurveMesh,
  Ee as Fragment,
  le as FragmentMesh,
  bn as FragmentUtils,
  Ss as FragmentsGroup,
  ln as Serializer,
  hn as StreamSerializer,
  rn as StreamerFileDb
};
