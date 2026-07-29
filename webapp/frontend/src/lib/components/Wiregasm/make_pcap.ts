import { Buffer } from 'buffer';

function parseIpPort(v: string) {
	const idx = v.lastIndexOf(':');

	return {
		ip: v.slice(0, idx),
		port: Number(v.slice(idx + 1))
	};
}

function checksum(buf: Buffer) {
	let sum = 0;

	for (let i = 0; i < buf.length; i += 2) {
		let word = buf[i] << 8;

		if (i + 1 < buf.length) {
			word |= buf[i + 1];
		}

		sum += word;
	}

	while (sum >> 16) {
		sum = (sum & 0xffff) + (sum >> 16);
	}

	return ~sum & 0xffff;
}

function ipToBuffer(ip: string) {
	return Buffer.from(ip.split('.').map(Number));
}

function ethernetHeader() {
	const eth = Buffer.alloc(14);

	// fake MACs
	Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55]).copy(eth, 0);
	Buffer.from([0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb]).copy(eth, 6);

	eth.writeUInt16BE(0x0800, 12); // IPv4

	return eth;
}

function buildIPv4Header(srcIP: string, dstIP: string, protocol: string, payloadLength: number) {
	const header = Buffer.alloc(20);

	header[0] = 0x45; // version + ihl
	header[1] = 0x00;

	const totalLength = 20 + payloadLength;

	header.writeUInt16BE(totalLength, 2);

	header.writeUInt16BE(0, 4);
	header.writeUInt16BE(0, 6);

	header[8] = 64; // ttl

	header[9] = protocol === 'TCP' ? 6 : 17;

	header.writeUInt16BE(0, 10);

	ipToBuffer(srcIP).copy(header, 12);
	ipToBuffer(dstIP).copy(header, 16);

	const csum = checksum(header);

	header.writeUInt16BE(csum, 10);

	return header;
}

function buildUDPHeader(srcPort: number, dstPort: number, payload: Buffer) {
	const udp = Buffer.alloc(8);

	udp.writeUInt16BE(srcPort, 0);
	udp.writeUInt16BE(dstPort, 2);

	udp.writeUInt16BE(8 + payload.length, 4);

	udp.writeUInt16BE(0, 6);

	return udp;
}

function buildTCPHeader(
	srcIP: string,
	dstIP: string,
	srcPort: number,
	dstPort: number,
	seq: number,
	ack: number,
	flags: number,
	payload: Buffer
) {
	const tcp = Buffer.alloc(20);

	tcp.writeUInt16BE(srcPort, 0);
	tcp.writeUInt16BE(dstPort, 2);

	tcp.writeUInt32BE(seq >>> 0, 4);
	tcp.writeUInt32BE(ack >>> 0, 8);

	tcp[12] = 0x50; // data offset = 5
	tcp[13] = flags;

	tcp.writeUInt16BE(65535, 14);

	tcp.writeUInt16BE(0, 16);
	tcp.writeUInt16BE(0, 18);

	// pseudo header for checksum
	const pseudo = Buffer.alloc(12);

	ipToBuffer(srcIP).copy(pseudo, 0);
	ipToBuffer(dstIP).copy(pseudo, 4);

	pseudo[8] = 0;
	pseudo[9] = 6;

	pseudo.writeUInt16BE(tcp.length + payload.length, 10);

	const checksumData = Buffer.concat([
		pseudo,
		tcp,
		payload,
		payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0)
	]);

	const csum = checksum(checksumData);

	tcp.writeUInt16BE(csum, 16);

	return tcp;
}

export function generatePcap(packets: any[], flow: any): Uint8Array {
	const src = parseIpPort(flow.src_ipport);
	const dst = parseIpPort(flow.dest_ipport);

	const PROTO = flow.proto.toUpperCase();

	let clientSeq = 1000;
	let serverSeq = 5000;

	function buildPacket(entry: any) {
		const payload = Buffer.from(entry.blob);

		const serverToClient = !!entry.server_to_client;

		const srcIP = serverToClient ? dst.ip : src.ip;
		const dstIP = serverToClient ? src.ip : dst.ip;

		const srcPort = serverToClient ? dst.port : src.port;
		const dstPort = serverToClient ? src.port : dst.port;

		const eth = ethernetHeader();

		let transport;

		if (PROTO === 'UDP') {
			transport = buildUDPHeader(srcPort, dstPort, payload);
		} else {
			const seq = serverToClient ? serverSeq : clientSeq;
			const ack = serverToClient ? clientSeq : serverSeq;

			// PSH + ACK
			const flags = 0x18;

			transport = buildTCPHeader(srcIP, dstIP, srcPort, dstPort, seq, ack, flags, payload);

			if (serverToClient) {
				serverSeq += payload.length;
			} else {
				clientSeq += payload.length;
			}
		}

		const ip = buildIPv4Header(srcIP, dstIP, PROTO, transport.length + payload.length);

		return Buffer.concat([eth, ip, transport, payload]);
	}

	const out: Buffer[] = [];

	// global header
	const globalHeader = Buffer.alloc(24);

	globalHeader.writeUInt32LE(0xa1b2c3d4, 0);
	globalHeader.writeUInt16LE(2, 4);
	globalHeader.writeUInt16LE(4, 6);
	globalHeader.writeInt32LE(0, 8);
	globalHeader.writeUInt32LE(0, 12);
	globalHeader.writeUInt32LE(65535, 16);

	// LINKTYPE_ETHERNET
	globalHeader.writeUInt32LE(1, 20);

	out.push(globalHeader);

	// timestamps
	const tsStartSec = Math.floor(flow.ts_start / 1_000_000);
	const tsStartUsec = flow.ts_start % 1_000_000;

	const durationUsec = flow.ts_end - flow.ts_start;
	const spacingUsec = packets.length > 1 ? Math.floor(durationUsec / packets.length) : 1000;

	for (let i = 0; i < packets.length; i++) {
		const packetData = buildPacket(packets[i]);

		const packetTs = flow.ts_start + i * spacingUsec;

		const sec = Math.floor(packetTs / 1_000_000);
		const usec = packetTs % 1_000_000;

		const recHeader = Buffer.alloc(16);

		recHeader.writeUInt32LE(sec, 0);
		recHeader.writeUInt32LE(usec, 4);

		recHeader.writeUInt32LE(packetData.length, 8);
		recHeader.writeUInt32LE(packetData.length, 12);

		out.push(recHeader);
		out.push(packetData);
	}

	return new Uint8Array(Buffer.concat(out));
}
