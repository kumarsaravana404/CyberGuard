import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Eye,
  Filter,
  Download,
  Upload,
  FileCode,
  Layers,
  Play,
  Pause,
} from "lucide-react";

const PacketAnalyzer = () => {
  const [capturing, setCapturing] = useState(false);
  const [packets, setPackets] = useState([]);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [filter, setFilter] = useState("all");
  const [packetCount, setPacketCount] = useState(0);

  // Generate payload helper
  const generatePayload = useCallback((protocol) => {
    const payloads = {
      TCP: "TCP handshake data...",
      UDP: "UDP datagram payload...",
      ICMP: "ICMP echo request",
      HTTP: "GET /api/data HTTP/1.1\\r\\nHost: example.com",
      HTTPS: "TLS encrypted payload [ENCRYPTED]",
      DNS: "DNS query: example.com A?",
    };
    return payloads[protocol] || "Binary payload...";
  }, []);

  // Generate packet - defined before useEffect
  const generatePacket = useCallback(
    (nextId) => {
      const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS"];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const srcIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const dstIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const size = Math.floor(Math.random() * 1500) + 64;

      const flags = {
        TCP: ["SYN", "ACK", "FIN", "PSH", "RST"][Math.floor(Math.random() * 5)],
        UDP: "NONE",
        ICMP: "ECHO",
        HTTP: "GET",
        HTTPS: "TLS",
        DNS: "QUERY",
      };

      return {
        id: nextId,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        protocol,
        srcIP,
        srcPort: Math.floor(Math.random() * 65535),
        dstIP,
        dstPort:
          protocol === "HTTP"
            ? 80
            : protocol === "HTTPS"
              ? 443
              : protocol === "DNS"
                ? 53
                : Math.floor(Math.random() * 65535),
        size,
        ttl: Math.floor(Math.random() * 64) + 64,
        flags: flags[protocol],
        payload: generatePayload(protocol),
        checksum: Math.random().toString(16).substr(2, 4),
        direction: Math.random() > 0.5 ? "outbound" : "inbound",
      };
    },
    [generatePayload],
  );

  // Simulate packet capture
  useEffect(() => {
    if (!capturing) return;

    const interval = setInterval(() => {
      setPacketCount((prevCount) => {
        const nextId = prevCount + 1;
        const newPacket = generatePacket(nextId);
        setPackets((prev) => [newPacket, ...prev].slice(0, 50));
        return nextId;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [capturing, generatePacket]);

  const getProtocolColor = (protocol) => {
    const colors = {
      TCP: "text-blue-400",
      UDP: "text-purple-400",
      ICMP: "text-yellow-400",
      HTTP: "text-green-400",
      HTTPS: "text-cyan-400",
      DNS: "text-pink-400",
    };
    return colors[protocol] || "text-gray-400";
  };

  const getProtocolBg = (protocol) => {
    const colors = {
      TCP: "bg-blue-950/20",
      UDP: "bg-purple-950/20",
      ICMP: "bg-yellow-950/20",
      HTTP: "bg-green-950/20",
      HTTPS: "bg-cyan-950/20",
      DNS: "bg-pink-950/20",
    };
    return colors[protocol] || "bg-gray-950/20";
  };

  const filteredPackets =
    filter === "all"
      ? packets
      : packets.filter(
          (p) => p.protocol.toLowerCase() === filter.toLowerCase(),
        );

  const stats = {
    total: packetCount,
    tcp: packets.filter((p) => p.protocol === "TCP").length,
    udp: packets.filter((p) => p.protocol === "UDP").length,
    http: packets.filter((p) => ["HTTP", "HTTPS"].includes(p.protocol)).length,
    avgSize:
      packets.length > 0
        ? Math.floor(
            packets.reduce((acc, p) => acc + p.size, 0) / packets.length,
          )
        : 0,
  };

  const handleClear = () => {
    setPackets([]);
    setPacketCount(0);
    setSelectedPacket(null);
  };

  return (
    <div className="card-terminal relative group hover:border-green-600 transition-all duration-300">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-900">
        <div className="flex items-center gap-3">
          <Package
            size={20}
            className={`${capturing ? "text-green-500 animate-pulse" : "text-green-500"}`}
          />
          <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Packet_Analyzer
            </h3>
            <span className="text-[9px] text-green-700 font-mono">
              Deep Packet Inspection
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-2 py-1 text-[10px] font-bold uppercase border border-red-900 text-red-600 hover:bg-red-950 transition-all"
            disabled={capturing}
          >
            CLEAR
          </button>
          <button
            onClick={() => setCapturing(!capturing)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase border transition-all flex items-center gap-2 ${
              capturing
                ? "bg-red-500 text-black border-red-500"
                : "bg-green-500 text-black border-green-500"
            }`}
          >
            {capturing ? (
              <>
                <Pause size={12} />
                STOP
              </>
            ) : (
              <>
                <Play size={12} />
                CAPTURE
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-2">
          <div className="text-[9px] text-green-700 uppercase mb-1">Total</div>
          <div className="text-lg font-bold text-green-400 font-mono">
            {stats.total}
          </div>
        </div>
        <div className="bg-linear-to-br from-blue-950/30 to-transparent border border-blue-900/50 p-2">
          <div className="text-[9px] text-blue-700 uppercase mb-1">TCP</div>
          <div className="text-lg font-bold text-blue-400 font-mono">
            {stats.tcp}
          </div>
        </div>
        <div className="bg-linear-to-br from-purple-950/30 to-transparent border border-purple-900/50 p-2">
          <div className="text-[9px] text-purple-700 uppercase mb-1">UDP</div>
          <div className="text-lg font-bold text-purple-400 font-mono">
            {stats.udp}
          </div>
        </div>
        <div className="bg-linear-to-br from-cyan-950/30 to-transparent border border-cyan-900/50 p-2">
          <div className="text-[9px] text-cyan-700 uppercase mb-1">
            Avg Size
          </div>
          <div className="text-lg font-bold text-cyan-400 font-mono text-[14px]">
            {stats.avgSize}B
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={12} className="text-green-700" />
        <div className="flex gap-1.5 flex-wrap">
          {["all", "tcp", "udp", "http", "https", "icmp"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-all ${
                filter === f
                  ? "bg-green-500 text-black border-green-500"
                  : "text-green-700 border-green-900 hover:border-green-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Packet List */}
      <div className="grid grid-cols-2 gap-4">
        {/* Packet Table */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-green-500" />
            <span className="text-[10px] text-green-600 uppercase font-bold">
              Captured_Packets
            </span>
          </div>
          <div className="bg-black/50 border border-green-900/50 max-h-96 overflow-y-auto">
            {filteredPackets.length === 0 ? (
              <div className="text-center py-12">
                <Package
                  size={32}
                  className="text-green-900 mx-auto mb-2"
                  strokeWidth={1}
                />
                <div className="text-[10px] text-green-900 uppercase font-mono">
                  {capturing ? "CAPTURING..." : "NO PACKETS"}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-green-900/30">
                {filteredPackets.map((packet) => (
                  <div
                    key={packet.id}
                    onClick={() => setSelectedPacket(packet)}
                    className={`p-2 cursor-pointer transition-all ${
                      selectedPacket?.id === packet.id
                        ? "bg-green-950/30 border-l-2 border-green-500"
                        : "hover:bg-green-950/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-green-700 font-mono">
                        #{packet.id}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1 ${getProtocolColor(packet.protocol)}`}
                      >
                        {packet.protocol}
                      </span>
                    </div>
                    <div className="text-[9px] text-green-600 font-mono">
                      {packet.srcIP}:{packet.srcPort} → {packet.dstIP}:
                      {packet.dstPort}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8px] text-green-800">
                        {packet.timestamp}
                      </span>
                      <span className="text-[8px] text-green-800">
                        {packet.size}B
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Packet Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} className="text-green-500" />
            <span className="text-[10px] text-green-600 uppercase font-bold">
              Packet_Details
            </span>
          </div>
          {selectedPacket ? (
            <div
              className={`border ${getProtocolColor(selectedPacket.protocol).replace("text-", "border-")} ${getProtocolBg(selectedPacket.protocol)} p-3 space-y-3`}
            >
              {/* Header Info */}
              <div>
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold">
                  Network Layer
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Protocol:</span>
                    <span
                      className={`font-mono font-bold ${getProtocolColor(selectedPacket.protocol)}`}
                    >
                      {selectedPacket.protocol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Direction:</span>
                    <span className="text-green-400 font-mono flex items-center gap-1">
                      {selectedPacket.direction === "outbound" ? (
                        <>
                          <Upload size={10} /> OUTBOUND
                        </>
                      ) : (
                        <>
                          <Download size={10} /> INBOUND
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Size:</span>
                    <span className="text-green-400 font-mono">
                      {selectedPacket.size} bytes
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">TTL:</span>
                    <span className="text-green-400 font-mono">
                      {selectedPacket.ttl}
                    </span>
                  </div>
                </div>
              </div>

              {/* IP Info */}
              <div className="pt-2 border-t border-green-900/30">
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold">
                  IP Addresses
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Source:</span>
                    <span className="text-green-400 font-mono">
                      {selectedPacket.srcIP}:{selectedPacket.srcPort}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Destination:</span>
                    <span className="text-green-400 font-mono">
                      {selectedPacket.dstIP}:{selectedPacket.dstPort}
                    </span>
                  </div>
                </div>
              </div>

              {/* Protocol Specific */}
              <div className="pt-2 border-t border-green-900/30">
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold">
                  Protocol Details
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Flags:</span>
                    <span className="text-green-400 font-mono font-bold">
                      {selectedPacket.flags}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Checksum:</span>
                    <span className="text-green-400 font-mono">
                      0x{selectedPacket.checksum}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-green-700">Timestamp:</span>
                    <span className="text-green-400 font-mono">
                      {selectedPacket.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payload */}
              <div className="pt-2 border-t border-green-900/30">
                <div className="text-[9px] text-green-700 uppercase mb-2 font-bold flex items-center gap-1">
                  <FileCode size={10} />
                  Payload
                </div>
                <div className="bg-black/50 border border-green-900/50 p-2">
                  <pre className="text-[9px] text-green-500 font-mono whitespace-pre-wrap break-all">
                    {selectedPacket.payload}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/50 border border-green-900/50 p-12 text-center">
              <Eye
                size={40}
                className="text-green-900 mx-auto mb-3"
                strokeWidth={1}
              />
              <div className="text-[10px] text-green-900 uppercase font-mono">
                SELECT A PACKET
              </div>
              <div className="text-[9px] text-green-800 mt-1">
                Click on a packet to view details
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 ${capturing ? "bg-green-600 animate-pulse" : "bg-green-900"} rounded-full`}
          ></div>
          <span>CAPTURE: {capturing ? "ACTIVE" : "STOPPED"}</span>
        </div>
        <span>WIRESHARK_ENGINE: v4.0.3</span>
      </div>
    </div>
  );
};

export default PacketAnalyzer;
