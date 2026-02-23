import { PNG } from 'pngjs';
import crypto from 'crypto';

// XOR encryption utility using Buffers
function xorEncryptDecrypt(dataBuffer, key) {
  if (!key) return Buffer.from(dataBuffer); // return a copy
  const keyBuffer = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(dataBuffer.length);
  for (let i = 0; i < dataBuffer.length; i++) {
    result[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }
  return result;
}

export function encodeLSB(imageBuffer, text, key = '') {
  return new Promise((resolve, reject) => {
    new PNG().parse(imageBuffer, (error, data) => {
      if (error) return reject(new Error('Invalid PNG payload.'));

      // Convert text to buffer
      const textBuffer = Buffer.from(text, 'utf8');
      
      // Encrypt
      const encryptedBuffer = xorEncryptDecrypt(textBuffer, key);
      
      // Add a simple terminator signature "||STEG||"
      const terminatorBuffer = Buffer.from('||STEG||', 'utf8');
      const payloadBuffer = Buffer.concat([encryptedBuffer, terminatorBuffer]);

      let bitIndex = 0;
      
      if (payloadBuffer.length * 8 > data.data.length) {
        return reject(new Error('Image is too small to hold the payload.'));
      }

      for (let i = 0; i < data.data.length; i++) {
        if (bitIndex < payloadBuffer.length * 8) {
          const byteIndex = Math.floor(bitIndex / 8);
          const bitInByte = bitIndex % 8;
          // Extract bit from text buffer, MSB first
          const bit = (payloadBuffer[byteIndex] >> (7 - bitInByte)) & 1;

          // Replace LSB (0th bit) of the image data byte
          data.data[i] = (data.data[i] & 0xFE) | bit;
          bitIndex++;
        } else {
          break;
        }
      }

      const outBuffer = PNG.sync.write(data);
      resolve({ outBuffer, capacity: data.data.length / 8 });
    });
  });
}

export function decodeLSB(imageBuffer, key = '') {
  return new Promise((resolve, reject) => {
    new PNG().parse(imageBuffer, (error, data) => {
      if (error) return reject(new Error('Invalid PNG payload.'));

      let currentByte = 0;
      let bitIndex = 0;
      const resultBytes = [];
      let found = false;

      for (let i = 0; i < data.data.length; i++) {
        const bit = data.data[i] & 1;
        currentByte = (currentByte << 1) | bit;
        bitIndex++;

        if (bitIndex === 8) {
          resultBytes.push(currentByte);
          currentByte = 0;
          bitIndex = 0;
          
          // Check for termination string "||STEG||" in the last 8 bytes
          if (resultBytes.length >= 8) {
             const tail = Buffer.from(resultBytes.slice(-8)).toString('utf8');
             if (tail === '||STEG||') {
                 found = true;
                 break;
             }
          }
        }
      }

      if (!found) {
        return reject(new Error('No steganographic payload found or corrupted data.'));
      }

      const extractedBuffer = Buffer.from(resultBytes.slice(0, -8));
      const decryptedBuffer = xorEncryptDecrypt(extractedBuffer, key);
      const decryptedText = decryptedBuffer.toString('utf8');
      
      resolve(decryptedText);
    });
  });
}
