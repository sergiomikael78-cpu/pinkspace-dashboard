// ==UserScript==
// @name         Kode PGsoft Picker OCR
// @namespace    http://tampermonkey.net/
// @version      2026-06-20
// @description  Drag area angka pada gambar, OCR, lalu copy hasilnya
// @author       Me
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechatinc.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      cdn.files-text.com
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @downloadURL  https://username.github.io/pgsoft-ocr-script/pgsoft-picker-ocr.user.js
// @updateURL    https://username.github.io/pgsoft-ocr-script/pgsoft-picker-ocr.user.js
// ==/UserScript==

(function () {
  'use strict';

  let startX = 0;
  let startY = 0;
  let selectionBox = null;
  let activeImg = null;
  let isDragging = false;

  document.addEventListener('mousedown', (e) => {
    const img = e.target.closest('img');
    if (!img) return;

    // Cegah drag bawaan browser pada gambar
    e.preventDefault();

    activeImg = img;
    isDragging = true;

    startX = e.clientX;
    startY = e.clientY;

    createSelectionBox(startX, startY);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

    function fetchImageAsCleanImage(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      anonymous: false,
      onload: (res) => {
        if (res.status < 200 || res.status >= 300) {
          reject(new Error('Gagal fetch gambar. Status: ' + res.status));
          return;
        }

        const blobUrl = URL.createObjectURL(res.response);
        const cleanImg = new Image();

        cleanImg.onload = () => {
          URL.revokeObjectURL(blobUrl);
          resolve(cleanImg);
        };

        cleanImg.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Gagal load gambar dari blob.'));
        };

        cleanImg.src = blobUrl;
      },
      onerror: () => reject(new Error('GM_xmlhttpRequest gagal mengambil gambar.'))
    });
  });
}

  function createSelectionBox(x, y) {
    removeSelectionBox();

    selectionBox = document.createElement('div');
    selectionBox.style.position = 'fixed';
    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.border = '2px solid #ff3333';
    selectionBox.style.background = 'rgba(255, 0, 0, 0.18)';
    selectionBox.style.zIndex = '999999999';
    selectionBox.style.pointerEvents = 'none';
    selectionBox.style.boxSizing = 'border-box';

    document.body.appendChild(selectionBox);
  }

  function onMouseMove(e) {
    if (!isDragging || !selectionBox) return;

    const x = Math.min(startX, e.clientX);
    const y = Math.min(startY, e.clientY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);

    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
    selectionBox.style.width = w + 'px';
    selectionBox.style.height = h + 'px';
  }

  async function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (!isDragging || !selectionBox || !activeImg) {
      resetState();
      return;
    }

    isDragging = false;

    try {
      const canvas = await cropSelectedImageArea(activeImg, selectionBox);

      if (!canvas) {
        console.warn('[PGsoft OCR] Area terlalu kecil atau tidak valid.');
        showBoxError();
        setTimeout(removeSelectionBox, 700);
        resetState();
        return;
      }

      showBoxLoading();

      const rawText = await runNumberOCR(canvas);
      const parsed = parseOCRNumbers(rawText);

      if (!parsed.transactionId && !parsed.pgCode) {
        console.warn('[PGsoft OCR] Tidak ada angka terbaca:', rawText);
        showBoxError();
        setTimeout(removeSelectionBox, 900);
        resetState();
        return;
      }

      const finalText = buildCopyText(parsed);

      GM_setClipboard(finalText);

      console.log('[PGsoft OCR] Raw:', rawText);
      console.log('[PGsoft OCR] Parsed:', parsed);
      console.log('[PGsoft OCR] Copied:', finalText);

      showBoxSuccess(finalText);
      setTimeout(removeSelectionBox, 1200);

    } catch (err) {
      console.error('[PGsoft OCR] Gagal:', err);
      showBoxError();
      setTimeout(removeSelectionBox, 1000);
    } finally {
      resetState();
    }
  }

async function cropSelectedImageArea(img, box) {
  const imgRect = img.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();

  const left = Math.max(boxRect.left, imgRect.left);
  const top = Math.max(boxRect.top, imgRect.top);
  const right = Math.min(boxRect.right, imgRect.right);
  const bottom = Math.min(boxRect.bottom, imgRect.bottom);

  const width = right - left;
  const height = bottom - top;

  if (width < 8 || height < 8) {
    return null;
  }

  const imgUrl = img.currentSrc || img.src;

  if (!imgUrl) {
    console.warn('[PGsoft OCR] URL gambar tidak ditemukan.');
    return null;
  }

  const cleanImg = await fetchImageAsCleanImage(imgUrl);

  const scaleX = cleanImg.naturalWidth / imgRect.width;
  const scaleY = cleanImg.naturalHeight / imgRect.height;

  const cropX = Math.round((left - imgRect.left) * scaleX);
  const cropY = Math.round((top - imgRect.top) * scaleY);
  const cropW = Math.round(width * scaleX);
  const cropH = Math.round(height * scaleY);

  if (cropW < 8 || cropH < 8) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cropW;
  canvas.height = cropH;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    cleanImg,
    cropX, cropY, cropW, cropH,
    0, 0, cropW, cropH
  );

  return canvas;
}

    function enhanceCanvas(sourceCanvas) {
  const scale = 3;

  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width * scale;
  canvas.height = sourceCanvas.height * scale;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    sourceCanvas,
    0, 0,
    canvas.width,
    canvas.height
  );

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let gray = (r + g + b) / 3;

    // threshold untuk ubah jadi hitam putih
    gray = gray > 90 ? 255 : 0;

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

  async function runNumberOCR(canvas) {
    const result = await Tesseract.recognize(canvas, 'eng', {
      tessedit_char_whitelist: '0123456789',
      preserve_interword_spaces: '1'
    });

    return result.data.text || '';
  }

  function parseOCRNumbers(rawText) {
      const numbers = rawText.match(/\d+/g) || [];

      return {
          transactionId: numbers[0] || '',
          pgCode: numbers[1] || '',
          allNumbers: numbers
      };
  }
  function buildCopyText(parsed) {
    // Format copy 2 baris:
    // 206818534
    // 8319660032

    if (parsed.transactionId && parsed.pgCode) {
      return `${parsed.transactionId}${parsed.pgCode}`;
    }

    return parsed.allNumbers.join('\n');
  }

  function showBoxLoading() {
    if (!selectionBox) return;

    selectionBox.style.border = '2px solid #ffaa00';
    selectionBox.style.background = 'rgba(255, 170, 0, 0.18)';
  }

  function showBoxSuccess(text) {
    if (!selectionBox) return;

    selectionBox.style.border = '2px solid #00ff66';
    selectionBox.style.background = 'rgba(0, 255, 102, 0.18)';

    const label = document.createElement('div');
    label.textContent = 'Copied';
    label.style.position = 'absolute';
    label.style.left = '0';
    label.style.top = '-26px';
    label.style.padding = '3px 8px';
    label.style.background = '#00aa44';
    label.style.color = '#fff';
    label.style.fontSize = '12px';
    label.style.fontFamily = 'Arial, sans-serif';
    label.style.borderRadius = '4px';
    label.style.whiteSpace = 'pre';

    selectionBox.appendChild(label);
  }

  function showBoxError() {
    if (!selectionBox) return;

    selectionBox.style.border = '2px solid #ff3333';
    selectionBox.style.background = 'rgba(255, 0, 0, 0.25)';

    const label = document.createElement('div');
    label.textContent = 'OCR gagal';
    label.style.position = 'absolute';
    label.style.left = '0';
    label.style.top = '-26px';
    label.style.padding = '3px 8px';
    label.style.background = '#cc0000';
    label.style.color = '#fff';
    label.style.fontSize = '12px';
    label.style.fontFamily = 'Arial, sans-serif';
    label.style.borderRadius = '4px';

    selectionBox.appendChild(label);
  }

  function removeSelectionBox() {
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
  }

  function resetState() {
    activeImg = null;
    isDragging = false;
  }

})();