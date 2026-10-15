const fs=require('node:fs');
const input=fs.readFileSync(process.argv[2]);
const from=Number(process.argv[3]||0), seconds=Number(process.argv[4]||4);
let dataStart=0,dataSize=0;
for(let pos=12;pos+8<input.length;){const id=input.toString('ascii',pos,pos+4),size=input.readUInt32LE(pos+4);if(id==='data'){dataStart=pos+8;dataSize=size;break;}pos+=8+size+(size%2);}
const inRate=input.readUInt32LE(24),channels=input.readUInt16LE(22),bytesPerSample=input.readUInt16LE(34)/8;
if(bytesPerSample!==2)throw new Error('PCM16 expected');
const outRate=8000, frames=Math.round(seconds*outRate);
const out=Buffer.alloc(44+frames*2);
out.write('RIFF',0);out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(outRate,24);out.writeUInt32LE(outRate*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(frames*2,40);
for(let i=0;i<frames;i++){const src=Math.round((from+i/outRate)*inRate),pos=dataStart+src*channels*2;let v=0;for(let ch=0;ch<channels;ch++)v+=input.readInt16LE(pos+ch*2);out.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(v/channels))),44+i*2);}
process.stdout.write(out.toString('base64'));
