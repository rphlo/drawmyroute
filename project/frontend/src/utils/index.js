import { DateTime } from "luxon";

export const Point = (() => {
  function P(x, y) {
    this.x = x;
    this.y = y;
  }
  return P;
})();

export const LatLng = (() => {
  function L(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
  L.prototype.distance = function (latlng) {
    const C = Math.PI / 180,
      dlat = this.lat - latlng.lat,
      dlon = this.lng - latlng.lng,
      a =
        Math.pow(Math.sin((C * dlat) / 2), 2) +
        Math.cos(C * this.lat) *
          Math.cos(C * latlng.lat) *
          Math.pow(Math.sin((C * dlon) / 2), 2);
    return 12756274 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  return L;
})();

export const SpheroidProjection = (() => {
  const pi = Math.PI,
    float180 = 180.0,
    rad = 6378137,
    originShift = pi * rad,
    piOver180 = pi / float180;

  function S() {}

  S.prototype.latlngToMeters = function (latlng) {
    return new Point(
      latlng.lng * rad * piOver180,
      Math.log(Math.tan(((90 + latlng.lat) * piOver180) / 2)) * rad
    );
  };

  S.prototype.metersToLatLng = function (mxy) {
    return new LatLng(
      (2 * Math.atan(Math.exp(mxy.y / rad)) - pi / 2) / piOver180,
      mxy.x / rad / piOver180
    );
  };

  S.prototype.resolution = function (zoom) {
    return (2 * originShift) / (256 * Math.pow(2, zoom));
  };

  S.prototype.zoomForPixelSize = function (pixelSize) {
    for (let i = 0; i < 30; i++) {
      if (pixelSize > this.resolution(i)) {
        return Math.max(i - 1, 0);
      }
    }
  };

  S.prototype.pixelsToMeters = function (px, py, zoom) {
    const res = this.resolution(zoom),
      mx = px * res - originShift,
      my = py * res - originShift;
    return new Point(mx, my);
  };
  return S;
})();

export function adjugateMatrix(m) {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

function multiplyMatrices(a, b) {
  var c = Array(9);
  for (var i = 0; i !== 3; ++i) {
    for (var j = 0; j !== 3; ++j) {
      var cij = 0;
      for (var k = 0; k !== 3; ++k) {
        cij += a[3 * i + k] * b[3 * k + j];
      }
      c[3 * i + j] = cij;
    }
  }
  return c;
}

export function multiplyMatrixByVector(m, v) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

function basisToPoints(a, b, c, d) {
  var m = [a.x, b.x, c.x, a.y, b.y, c.y, 1, 1, 1];
  var v = multiplyMatrixByVector(adjugateMatrix(m), [d.x, d.y, 1]);
  return multiplyMatrices(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

export function general2DProjection(
  pt1RefA,
  pt1RefB,
  pt2RefA,
  pt2RefB,
  pt3RefA,
  pt3RefB,
  pt4RefA,
  pt4RefB
) {
  var refAMatrix = basisToPoints(pt1RefA, pt2RefA, pt3RefA, pt4RefA);
  var refBMatrix = basisToPoints(pt1RefB, pt2RefB, pt3RefB, pt4RefB);
  return multiplyMatrices(refBMatrix, adjugateMatrix(refAMatrix));
}

export function project(matrix, x, y) {
  var val = multiplyMatrixByVector(matrix, [x, y, 1]);
  return [val[0] / val[2], val[1] / val[2]];
}

export function cornerCalTransform(
  width,
  height,
  topLeftLatLng,
  topRightLatLng,
  bottomRightLatLng,
  bottomLeftLatLng,
  hOffset = 0
) {
  var proj = new SpheroidProjection();
  var topLeftMeters = proj.latlngToMeters(topLeftLatLng);
  var topRightMeters = proj.latlngToMeters(topRightLatLng);
  var bottomRightMeters = proj.latlngToMeters(bottomRightLatLng);
  var bottomLeftMeters = proj.latlngToMeters(bottomLeftLatLng);
  var matrix3d = general2DProjection(
    topLeftMeters,
    new Point(0, hOffset),
    topRightMeters,
    new Point(width, hOffset),
    bottomRightMeters,
    new Point(width, height + hOffset),
    bottomLeftMeters,
    new Point(0, height + hOffset)
  );
  return function (latlng) {
    var meters = proj.latlngToMeters(latlng);
    var xy = project(matrix3d, meters.x, meters.y);
    return new Point(xy[0], xy[1]);
  };
}

export function getResolution(
  width,
  height,
  topLeftLatLng,
  topRightLatLng,
  bottomRightLatLng,
  bottomLeftLatLng
) {
  const transform = cornerCalTransform(
    width,
    height,
    topLeftLatLng,
    topRightLatLng,
    bottomRightLatLng,
    bottomLeftLatLng
  );
  const topLeftMapXY = transform(topLeftLatLng);
  const topRightMapXY = transform(topRightLatLng);
  const bottomRightMapXY = transform(bottomRightLatLng);
  const bottomLeftMapXY = transform(bottomLeftLatLng);
  var proj = new SpheroidProjection();
  var topLeftMeters = proj.latlngToMeters(topLeftLatLng);
  var topRightMeters = proj.latlngToMeters(topRightLatLng);
  var bottomRightMeters = proj.latlngToMeters(bottomRightLatLng);
  var bottomLeftMeters = proj.latlngToMeters(bottomLeftLatLng);

  const resA =
    Math.sqrt(
      Math.pow(topLeftMeters.x - bottomRightMeters.x, 2) +
        Math.pow(topLeftMeters.y - bottomRightMeters.y, 2)
    ) /
    Math.sqrt(
      Math.pow(topLeftMapXY.x - bottomRightMapXY.x, 2) +
        Math.pow(topLeftMapXY.y - bottomRightMapXY.y, 2)
    );
  const resB =
    Math.sqrt(
      Math.pow(topRightMeters.x - bottomLeftMeters.x, 2) +
        Math.pow(topRightMeters.y - bottomLeftMeters.y, 2)
    ) /
    Math.sqrt(
      Math.pow(topRightMapXY.x - bottomLeftMapXY.x, 2) +
        Math.pow(topRightMapXY.y - bottomLeftMapXY.y, 2)
    );
  return (resA + resB) / 2;
}

export function cornerBackTransform(
  width,
  height,
  topLeftLatLng,
  topRightLatLng,
  bottomRightLatLng,
  bottomLeftLatLng,
  hOffset = 0
) {
  var proj = new SpheroidProjection();
  var topLeftMeters = proj.latlngToMeters(topLeftLatLng);
  var topRightMeters = proj.latlngToMeters(topRightLatLng);
  var bottomRightMeters = proj.latlngToMeters(bottomRightLatLng);
  var bottomLeftMeters = proj.latlngToMeters(bottomLeftLatLng);
  var matrix3d = general2DProjection(
    new Point(0, hOffset),
    topLeftMeters,
    new Point(width, hOffset),
    topRightMeters,
    new Point(width, height + hOffset),
    bottomRightMeters,
    new Point(0, height + hOffset),
    bottomLeftMeters
  );
  return function (coords) {
    var xy = project(matrix3d, coords.x, coords.y);
    return proj.metersToLatLng(new Point(xy[0], xy[1]));
  };
}

export const dataURItoBlob = (dataURI) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const displayDate = (date) => {
  if (
    date.startOf("day").diff(DateTime.local().startOf("day"), "days").days < -1
  ) {
    return (
      date.setLocale("en").toLocaleString(DateTime.DATE_MED) +
      ", " +
      date.toFormat("T")
    );
  }
  return (
    capitalizeFirstLetter(date.toRelativeCalendar({ unit: "days" })) +
    " at " +
    date.toFormat("T")
  );
};

export const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(codePoints[0], codePoints[1]);
};

export const resetOrientation = (src, callback) => {
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const MAX_WIDTH = 4096;
    const MAX_HEIGHT = 4096;
    let width = img.width,
      height = img.height;
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    if (width > height) {
      if (width > MAX_WIDTH) {
        height = height * (MAX_WIDTH / width);
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = width * (MAX_HEIGHT / height);
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL("image/png"), width, height);
  };
  img.src = src;
};

export const needFlagsEmojiPolyfill = (function () {
  function checkPixelInImageDataArray(e, t) {
    const n = 4 * e,
      a = t[n + 0] || t[n + 1] || t[n + 2],
      i = t[n + 3];
    return !(!a || !i);
  }
  function ifEmoji(e) {
    const t = document.createElement("canvas"),
      n = t.getContext("2d");
    if (null == n) return !1;
    t.width = 32;
    t.height = 16;
    n.fillStyle = "#000000";
    n.textBaseline = "middle";
    n.fillText(e, 0, 8);
    const a = n.getImageData(0, 8, 32, 1).data;
    let i = !1;
    for (let e = 0; e < 64; e += 1) {
      const t = e >= 24;
      if (e < 16 && checkPixelInImageDataArray(e, a)) i = !0;
      else if (t && checkPixelInImageDataArray(e, a)) return !1;
    }
    return i;
  }
  return ifEmoji("😀") && !ifEmoji("🇨🇭");
})();


const base64abc = [
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];

export function bytesToBase64(bytes) {
	let result = '', i, l = bytes.length;
	for (i = 2; i < l; i += 3) {
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
		result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
		result += base64abc[bytes[i] & 0x3F];
	}
	if (i === l + 1) { // 1 octet yet to write
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[(bytes[i - 2] & 0x03) << 4];
		result += "==";
	}
	if (i === l) { // 2 octets yet to write
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
		result += base64abc[(bytes[i - 1] & 0x0F) << 2];
		result += "=";
	}
	return result;
}