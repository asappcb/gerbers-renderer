export type Vec2 = { x: number; y: number };

export type CameraState = {
  center_mm: Vec2;        // board/world units (mm)
  zoom: number;           // pixels per mm
  rotation_rad?: number;  // default 0
  mirrorX?: boolean;      // optional for top/bottom flip
  mirrorY?: boolean;      // optional
};

export type Viewport = { width_px: number; height_px: number };

// 3x3 matrix in row-major order
export type Mat3 = [number, number, number, number, number, number, number, number, number];

function matMul(a: Mat3, b: Mat3): Mat3 {
  const [
    a00,a01,a02,
    a10,a11,a12,
    a20,a21,a22
  ] = a;
  const [
    b00,b01,b02,
    b10,b11,b12,
    b20,b21,b22
  ] = b;

  return [
    a00*b00 + a01*b10 + a02*b20,
    a00*b01 + a01*b11 + a02*b21,
    a00*b02 + a01*b12 + a02*b22,

    a10*b00 + a11*b10 + a12*b20,
    a10*b01 + a11*b11 + a12*b21,
    a10*b02 + a11*b12 + a12*b22,

    a20*b00 + a21*b10 + a22*b20,
    a20*b01 + a21*b11 + a22*b21,
    a20*b02 + a21*b12 + a22*b22,
  ];
}

function matTranslate(tx: number, ty: number): Mat3 {
  return [1,0,tx, 0,1,ty, 0,0,1];
}

function matScale(sx: number, sy: number): Mat3 {
  return [sx,0,0, 0,sy,0, 0,0,1];
}

function matRotate(theta: number): Mat3 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [c,-s,0, s,c,0, 0,0,1];
}

function matApply(m: Mat3, v: Vec2): Vec2 {
  const x = m[0]*v.x + m[1]*v.y + m[2];
  const y = m[3]*v.x + m[4]*v.y + m[5];
  const w = m[6]*v.x + m[7]*v.y + m[8];
  if (w === 0) throw new Error("Invalid transform (w=0)");
  return { x: x / w, y: y / w };
}

// Inverse for affine 2D matrix with last row [0,0,1]
function matInverseAffine(m: Mat3): Mat3 {
  // m = [a,b,tx, c,d,ty, 0,0,1]
  const a = m[0], b = m[1], tx = m[2];
  const c = m[3], d = m[4], ty = m[5];

  const det = a*d - b*c;
  if (Math.abs(det) < 1e-12) throw new Error("Non-invertible transform");

  const invDet = 1 / det;

  const ia =  d * invDet;
  const ib = -b * invDet;
  const ic = -c * invDet;
  const id =  a * invDet;

  const itx = -(ia*tx + ib*ty);
  const ity = -(ic*tx + id*ty);

  return [ia, ib, itx, ic, id, ity, 0,0,1];
}

export class ViewportTransform {
  private camera: Required<CameraState>;
  private viewport: Viewport;
  private worldToScreenMat: Mat3;
  private screenToWorldMat: Mat3;

  constructor(camera: CameraState, viewport: Viewport) {
    this.camera = {
      center_mm: camera.center_mm,
      zoom: camera.zoom,
      rotation_rad: camera.rotation_rad ?? 0,
      mirrorX: camera.mirrorX ?? false,
      mirrorY: camera.mirrorY ?? false,
    };
    this.viewport = viewport;
    this.worldToScreenMat = [1,0,0, 0,1,0, 0,0,1];
    this.screenToWorldMat = [1,0,0, 0,1,0, 0,0,1];
    this.recompute();
  }

  setCamera(camera: Partial<CameraState>) {
    this.camera = {
      ...this.camera,
      ...camera,
      center_mm: camera.center_mm ?? this.camera.center_mm,
      rotation_rad: camera.rotation_rad ?? this.camera.rotation_rad,
      zoom: camera.zoom ?? this.camera.zoom,
      mirrorX: camera.mirrorX ?? this.camera.mirrorX,
      mirrorY: camera.mirrorY ?? this.camera.mirrorY,
    };
    this.recompute();
  }

  setViewport(viewport: Viewport) {
    this.viewport = viewport;
    this.recompute();
  }

  getCamera(): Required<CameraState> {
    return this.camera;
  }

  getViewport(): Viewport {
    return this.viewport;
  }

  getWorldToScreenMatrix(): Mat3 {
    return this.worldToScreenMat;
  }

  getScreenToWorldMatrix(): Mat3 {
    return this.screenToWorldMat;
  }

  boardToScreen(p_mm: Vec2 | { x_mm?: number; y_mm?: number } | [number, number]): Vec2 {
    try {
      let point: Vec2;
      
      // Handle different input formats
      if (Array.isArray(p_mm)) {
        point = { x: p_mm[0], y: p_mm[1] };
      } else if ('x' in p_mm) {
        point = { x: p_mm.x, y: p_mm.y };
      } else if ('x_mm' in p_mm) {
        point = { x: p_mm.x_mm ?? 0, y: p_mm.y_mm ?? 0 };
      } else {
        return { x: NaN, y: NaN };
      }
      
      return matApply(this.worldToScreenMat, point);
    } catch (error) {
      return { x: NaN, y: NaN };
    }
  }

  screenToBoard(p_px: Vec2 | { x_px?: number; y_px?: number } | [number, number]): Vec2 {
    try {
      let point: Vec2;
      
      // Handle different input formats
      if (Array.isArray(p_px)) {
        point = { x: p_px[0], y: p_px[1] };
      } else if ('x' in p_px) {
        point = { x: p_px.x, y: p_px.y };
      } else if ('x_px' in p_px) {
        point = { x: p_px.x_px ?? 0, y: p_px.y_px ?? 0 };
      } else {
        return { x: NaN, y: NaN };
      }
      
      return matApply(this.screenToWorldMat, point);
    } catch (error) {
      return { x: NaN, y: NaN };
    }
  }

  private recompute() {
    const { width_px, height_px } = this.viewport;
    const { center_mm, zoom, rotation_rad, mirrorX, mirrorY } = this.camera;

    const screenCenter = { x: width_px / 2, y: height_px / 2 };

    // Screen y axis goes down, board y also goes down (top-left origin)
    // mirrorY can flip board y if needed (useful for coordinate system changes)
    const flipY = (mirrorY ? -1 : 1);
    const flipX = (mirrorX ? -1 : 1);

    // Compose: T(screenCenter) * S(zoom*flipX, zoom*flipY) * R(rotation) * T(-center)
    const T1 = matTranslate(-center_mm.x, -center_mm.y);
    const R  = matRotate(rotation_rad);
    const S  = matScale(zoom * flipX, zoom * flipY);
    const T2 = matTranslate(screenCenter.x, screenCenter.y);

    const M = matMul(T2, matMul(S, matMul(R, T1)));

    this.worldToScreenMat = M;
    this.screenToWorldMat = matInverseAffine(M);
  }
}
