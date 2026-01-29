import { useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  Upload,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  FileImage,
  Key,
  Shield,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
  Binary,
} from "lucide-react";

const Cloaking = () => {
  const [mode, setMode] = useState("encode");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [secretMessage, setSecretMessage] = useState("");
  const [password, setPassword] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Simple encryption (XOR cipher with password)
  const encrypt = (text, key) => {
    if (!key) return text;
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
      );
    }
    return result;
  };

  const decrypt = (text, key) => {
    return encrypt(text, key); // XOR is symmetric
  };

  // Convert text to binary
  const textToBinary = (text) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  // Convert binary to text
  const binaryToText = (binary) => {
    const chars = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      if (byte.length === 8) {
        chars.push(String.fromCharCode(parseInt(byte, 2)));
      }
    }
    return chars.join("");
  };

  // LSB Encoding
  const encodeLSB = (imageData, message) => {
    const data = imageData.data;
    const encryptedMessage = password ? encrypt(message, password) : message;
    const binary = textToBinary(encryptedMessage);
    const lengthBinary = binary.length.toString(2).padStart(32, "0");
    const fullBinary = lengthBinary + binary;

    if (fullBinary.length > data.length / 4) {
      throw new Error("Message too large for this image!");
    }

    let bitIndex = 0;
    for (let i = 0; i < data.length && bitIndex < fullBinary.length; i += 4) {
      // Skip alpha channel, encode in RGB
      for (let j = 0; j < 3 && bitIndex < fullBinary.length; j++) {
        const bit = parseInt(fullBinary[bitIndex]);
        data[i + j] = (data[i + j] & 0xfe) | bit;
        bitIndex++;
      }
    }

    return imageData;
  };

  // LSB Decoding
  const decodeLSB = (imageData) => {
    const data = imageData.data;
    let binary = "";

    // First extract the message length (32 bits)
    for (let i = 0; i < 128; i += 4) {
      for (let j = 0; j < 3 && binary.length < 32; j++) {
        binary += (data[i + j] & 1).toString();
      }
    }

    const messageLength = parseInt(binary, 2);
    if (messageLength === 0 || messageLength > 1000000) {
      throw new Error("No valid message found or corrupted data!");
    }

    // Extract the actual message
    binary = "";
    let bitIndex = 0;
    const totalBits = 32 + messageLength;

    for (let i = 0; i < data.length && bitIndex < totalBits; i += 4) {
      for (let j = 0; j < 3 && bitIndex < totalBits; j++) {
        if (bitIndex >= 32) {
          binary += (data[i + j] & 1).toString();
        }
        bitIndex++;
      }
    }

    const encryptedMessage = binaryToText(binary);
    const decryptedMessage = password
      ? decrypt(encryptedMessage, password)
      : encryptedMessage;

    return decryptedMessage;
  };

  // Calculate embedding capacity
  const calculateCapacity = (img) => {
    const pixels = img.width * img.height;
    const bitsAvailable = pixels * 3; // 3 bits per pixel (RGB)
    const bytesAvailable = Math.floor(bitsAvailable / 8);
    const charsAvailable = bytesAvailable - 4; // Minus 4 bytes for length header

    setCapacity({
      pixels,
      bytes: bytesAvailable,
      chars: charsAvailable,
      maxMessage: `${charsAvailable} characters`,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file!");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Image too large! Maximum 10MB.");
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setDecodedMessage("");
      setError("");
      setStats(null);

      // Calculate capacity for encoding
      if (mode === "encode") {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => calculateCapacity(img);
      }
    }
  };

  const processSteganography = async () => {
    if (!image) return;

    setProcessing(true);
    setProgress(0);
    setError("");

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = previewUrl;

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        setProgress(20);

        if (mode === "encode") {
          // Encoding mode
          setProgress(40);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          setProgress(60);

          // Perform LSB encoding
          const encodedData = encodeLSB(imageData, secretMessage);
          ctx.putImageData(encodedData, 0, 0);

          setProgress(80);

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setResultImage(url);
            setDownloadFilename(`stego_${Date.now()}.png`);

            setStats({
              originalSize: (image.size / 1024).toFixed(2),
              encodedSize: (blob.size / 1024).toFixed(2),
              messageLength: secretMessage.length,
              encrypted: !!password,
              dimensions: `${img.width}x${img.height}`,
            });

            setProgress(100);
            setProcessing(false);
          }, "image/png");
        } else {
          // Decoding mode
          setProgress(40);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          setProgress(60);

          // Perform LSB decoding
          const message = decodeLSB(imageData);

          setProgress(80);

          setDecodedMessage(message);

          setStats({
            messageLength: message.length,
            encrypted: !!password,
            dimensions: `${img.width}x${img.height}`,
          });

          setProgress(100);
          setProcessing(false);
        }
      };

      img.onerror = () => {
        setError("Failed to load image!");
        setProcessing(false);
      };
    } catch (err) {
      setError(err.message || "Processing failed!");
      setProcessing(false);
      setProgress(0);
    }
  };

  const resetAll = () => {
    setImage(null);
    setPreviewUrl(null);
    setSecretMessage("");
    setPassword("");
    setDecodedMessage("");
    setResultImage(null);
    setCapacity(null);
    setStats(null);
    setError("");
    setProgress(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-green-900 border-dashed">
        <div className="p-2 bg-green-900/10 border border-green-900">
          {mode === "encode" ? (
            <EyeOff size={20} className="text-green-500" />
          ) : (
            <Eye size={20} className="text-green-500" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-green-500 tracking-widest uppercase text-glow">
            Advanced Steganography System
          </h1>
          <p className="text-xs text-green-700 font-mono mt-0.5">
            {mode === "encode"
              ? "LSB Encoder // Military-Grade Data Concealment"
              : "LSB Decoder // Forensic Data Extraction"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-green-700 uppercase font-mono">
          <Shield size={12} className="text-green-500" />
          <span>AES-COMPATIBLE</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-green-900 bg-black p-1 max-w-md">
        <button
          onClick={() => {
            setMode("encode");
            resetAll();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase transition-all ${mode === "encode" ? "bg-green-500 text-black" : "text-green-700 hover:text-green-500"}`}
        >
          <Lock size={14} /> Encode
        </button>
        <div className="w-px bg-green-900 mx-1"></div>
        <button
          onClick={() => {
            setMode("decode");
            resetAll();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase transition-all ${mode === "decode" ? "bg-green-500 text-black" : "text-green-700 hover:text-green-500"}`}
        >
          <Unlock size={14} /> Decode
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-950/20 border border-red-900 p-3 flex items-start gap-2 animate-in fade-in">
          <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-red-400 font-mono font-bold uppercase">
              ERROR
            </div>
            <div className="text-xs text-red-300 mt-1">{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Input */}
        <div className="card-terminal space-y-4">
          <div className="flex items-center justify-between text-xs text-green-700 uppercase border-b border-green-900/30 pb-2">
            <span className="flex items-center gap-2">
              <ImageIcon size={12} />
              SOURCE_INPUT
            </span>
            <span className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${image ? "bg-green-500 animate-pulse" : "bg-green-900"}`}
              ></div>
              {image ? "READY" : "WAITING"}
            </span>
          </div>

          {/* Image Uploader */}
          <div
            className={`border-2 border-dashed border-green-900 h-64 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-green-500 hover:bg-green-900/5 ${previewUrl ? "border-solid border-green-700 p-0 overflow-hidden relative" : ""}`}
            onClick={() => fileInputRef.current.click()}
          >
            {previewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={24} className="text-green-500 mb-2" />
                  <span className="text-green-500 font-mono text-xs uppercase">
                    [ CHANGE_IMAGE ]
                  </span>
                  {image && (
                    <span className="text-green-700 text-[10px] mt-1">
                      {(image.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Upload size={40} className="text-green-900 mb-3" />
                <span className="text-green-700 font-mono text-sm uppercase tracking-wider">
                  Select Carrier Image
                </span>
                <span className="text-green-900 text-[10px] mt-2">
                  PNG / JPG • Max 10MB
                </span>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
            />
          </div>

          {/* Capacity Indicator (Encode Mode) */}
          {mode === "encode" && capacity && (
            <div className="bg-green-950/20 border border-green-900/50 p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-500 uppercase font-bold">
                <Binary size={12} />
                <span>Embedding Capacity</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-green-700">Pixels:</span>
                  <span className="text-green-400 ml-2">
                    {capacity.pixels.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-green-700">Max Chars:</span>
                  <span className="text-green-400 ml-2">{capacity.chars}</span>
                </div>
              </div>
              <div className="text-[9px] text-green-700">
                Available: {capacity.maxMessage}
              </div>
            </div>
          )}

          {/* Secret Message Input (Encode Mode) */}
          {mode === "encode" && (
            <div className="space-y-2">
              <label className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <Key size={12} />
                Secret Payload
                {secretMessage && (
                  <span className="text-green-700 font-mono text-[10px]">
                    ({secretMessage.length} chars)
                  </span>
                )}
              </label>
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                className="w-full h-32 bg-black border border-green-900 p-3 text-green-400 font-mono text-sm focus:outline-none focus:border-green-500 placeholder-green-900/50 resize-none"
                placeholder="Enter secret message to embed..."
                maxLength={capacity?.chars || 10000}
              />
              {capacity && secretMessage.length > capacity.chars && (
                <div className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Message exceeds capacity!
                </div>
              )}
            </div>
          )}

          {/* Password Protection */}
          <div className="space-y-2">
            <label className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <Shield size={12} />
              Encryption Key (Optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-green-900 px-3 py-2 text-green-400 font-mono text-sm focus:outline-none focus:border-green-500 placeholder-green-900/50"
              placeholder="Enter password for encryption..."
            />
            {password && (
              <div className="text-[10px] text-green-600 flex items-center gap-1">
                <CheckCircle size={10} />
                Message will be encrypted with XOR cipher
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={processSteganography}
            disabled={
              !image ||
              processing ||
              (mode === "encode" && !secretMessage) ||
              (mode === "encode" &&
                capacity &&
                secretMessage.length > capacity.chars)
            }
            className="btn-terminal w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <RefreshCw size={16} className="animate-spin mr-2" />
            ) : mode === "encode" ? (
              <Lock size={16} className="mr-2" />
            ) : (
              <Unlock size={16} className="mr-2" />
            )}
            {processing
              ? `PROCESSING... ${progress}%`
              : mode === "encode"
                ? "[ INJECT_PAYLOAD ]"
                : "[ EXTRACT_PAYLOAD ]"}
          </button>
        </div>

        {/* Right Panel: Output */}
        <div className="card-terminal relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-900 via-green-500 to-green-900 opacity-20"></div>

          <div className="flex items-center justify-between text-xs text-green-700 uppercase mb-4 border-b border-green-900/30 pb-2">
            <span className="flex items-center gap-2">
              <Zap size={12} />
              SYSTEM_OUTPUT
            </span>
            <span className="font-mono">LSB_v2.0</span>
          </div>

          <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
            {processing ? (
              <div className="space-y-6 text-center w-full">
                <div className="font-mono text-green-500 text-xs animate-pulse space-y-1">
                  <div>&gt; ANALYZING_PIXEL_MATRIX...</div>
                  <div>&gt; CALCULATING_LSB_POSITIONS...</div>
                  <div>
                    &gt;{" "}
                    {mode === "encode" ? "EMBEDDING_BITS" : "EXTRACTING_BITS"}
                    ...
                  </div>
                  {password && <div>&gt; APPLYING_ENCRYPTION...</div>}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-sm mx-auto space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-green-600 font-mono">
                    <span>PROGRESS</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-green-950 border border-green-900 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="w-48 h-1 bg-green-900/30 mx-auto overflow-hidden">
                  <div className="h-full bg-green-500 w-1/2 animate-shimmer"></div>
                </div>
              </div>
            ) : resultImage || decodedMessage ? (
              <div className="w-full space-y-4 animate-in zoom-in-50 duration-300">
                {mode === "encode" && resultImage ? (
                  <div className="space-y-4">
                    {/* Success Message */}
                    <div className="text-center space-y-3">
                      <div className="border border-green-500/50 p-3 inline-block bg-green-950/20">
                        <CheckCircle
                          size={48}
                          className="text-green-500 mx-auto"
                        />
                      </div>
                      <div className="text-green-500 text-sm font-bold uppercase tracking-widest">
                        ✓ PAYLOAD SUCCESSFULLY EMBEDDED
                      </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                      <div className="bg-green-950/20 border border-green-900/50 p-4 space-y-2">
                        <div className="text-[10px] text-green-500 uppercase font-bold flex items-center gap-2">
                          <Info size={12} />
                          Encoding Statistics
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                          <div>
                            <span className="text-green-700">Original:</span>
                            <span className="text-green-400 ml-2">
                              {stats.originalSize} KB
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Encoded:</span>
                            <span className="text-green-400 ml-2">
                              {stats.encodedSize} KB
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Message:</span>
                            <span className="text-green-400 ml-2">
                              {stats.messageLength} chars
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Encrypted:</span>
                            <span
                              className={`ml-2 ${stats.encrypted ? "text-green-500" : "text-yellow-500"}`}
                            >
                              {stats.encrypted ? "YES" : "NO"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-green-700">Dimensions:</span>
                            <span className="text-green-400 ml-2">
                              {stats.dimensions}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <div className="border border-green-900/50 p-2 bg-black">
                      <img
                        src={resultImage}
                        alt="Encoded"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>

                    {/* Download Button */}
                    <a
                      href={resultImage}
                      download={downloadFilename}
                      className="btn-terminal mx-auto block text-center"
                    >
                      <Download size={16} className="mr-2" />{" "}
                      DOWNLOAD_STEGO_IMAGE
                    </a>

                    <div className="text-[9px] text-green-800 text-center font-mono">
                      ⚠ Keep your password safe to decode this image later!
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    {/* Success Message */}
                    <div className="text-center space-y-3">
                      <div className="border border-green-500/50 p-3 inline-block bg-green-950/20">
                        <Eye size={48} className="text-green-500 mx-auto" />
                      </div>
                      <div className="text-green-500 text-sm font-bold uppercase tracking-widest">
                        ✓ MESSAGE SUCCESSFULLY EXTRACTED
                      </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                      <div className="bg-green-950/20 border border-green-900/50 p-3 space-y-2">
                        <div className="text-[10px] text-green-500 uppercase font-bold flex items-center gap-2">
                          <Info size={12} />
                          Decoding Statistics
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div>
                            <span className="text-green-700">Length:</span>
                            <span className="text-green-400 ml-2">
                              {stats.messageLength} chars
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700">Encrypted:</span>
                            <span
                              className={`ml-2 ${stats.encrypted ? "text-green-500" : "text-yellow-500"}`}
                            >
                              {stats.encrypted ? "YES" : "NO"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Decoded Message */}
                    <div>
                      <div className="text-green-500 text-xs uppercase mb-2 font-bold">
                        Decoded Payload:
                      </div>
                      <div className="bg-green-900/10 border border-green-900/50 p-4 max-h-64 overflow-y-auto">
                        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap wrap-break-word">
                          {decodedMessage}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3 opacity-50">
                <FileImage size={48} className="text-green-900 mx-auto" />
                <div className="text-green-900 text-xs font-mono uppercase">
                  [ NO_DATA_STREAM ]
                </div>
                <div className="text-green-800 text-[10px]">
                  Upload an image and{" "}
                  {mode === "encode"
                    ? "enter a message"
                    : "extract hidden data"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Info Footer */}
      <div className="card-terminal">
        <div className="text-[10px] text-green-700 uppercase font-bold mb-3 flex items-center gap-2">
          <Info size={12} />
          How It Works
        </div>
        <div className="space-y-2 text-[10px] text-green-600 leading-relaxed">
          <p>
            <strong className="text-green-500">LSB Steganography:</strong> This
            system uses Least Significant Bit (LSB) encoding to hide your
            message in the RGB channels of the image. The changes are
            imperceptible to the human eye.
          </p>
          <p>
            <strong className="text-green-500">Encryption:</strong> Optional
            password protection uses XOR cipher to encrypt your message before
            embedding. Without the correct password, the extracted message will
            be gibberish.
          </p>
          <p>
            <strong className="text-green-500">Capacity:</strong> The maximum
            message length depends on the image size. Larger images can store
            more data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cloaking;
