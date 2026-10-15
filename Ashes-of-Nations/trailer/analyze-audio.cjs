const fs = require('node:fs');
const input = process.argv[2];
if (!input) throw new Error('Usage: node trailer/analyze-audio.cjs <wav>');
const buffer = fs.readFileSync(input);
if (buffer.toString('ascii',0,4)!=='RIFF' || buffer.toString('ascii',8,12)!=='WAVE') throw new Error('Expected WAV');
let fmt, data;
for (let pos=12;pos+8<=buffer.length;) {
  const id=buffer.toString('ascii',pos,pos+4);
  const size=buffer.readUInt32LE(pos+4);
  if (id==='fmt ') fmt={format:buffer.readUInt16LE(pos+8),channels:buffer.readUInt16LE(pos+10),sampleRate:buffer.readUInt32LE(pos+12),bits:buffer.readUInt16LE(pos+22)};
  if (id==='data') data={start:pos+8,size};
  pos+=8+size+(size%2);
}
if (!fmt||!data) throw new Error('WAV missing fmt/data');
const bytes=fmt.bits/8, frameBytes=bytes*fmt.channels, samples=Math.floor(data.size/frameBytes);
function sample(frame,channel) {
  const pos=data.start+frame*frameBytes+channel*bytes;
  if (fmt.format===3 && fmt.bits===32) return buffer.readFloatLE(pos);
  if (fmt.format===1 && fmt.bits===16) return buffer.readInt16LE(pos)/32768;
  if (fmt.format===1 && fmt.bits===24) return buffer.readIntLE(pos,3)/8388608;
  if (fmt.format===1 && fmt.bits===32) return buffer.readInt32LE(pos)/2147483648;
  throw new Error(`Unsupported WAV format ${fmt.format}/${fmt.bits}`);
}
const bucketFrames=Math.round(fmt.sampleRate);
const buckets=[];
let overallSum=0,overallPeak=0,clipped=0;
for (let start=0;start<samples;start+=bucketFrames) {
  const end=Math.min(samples,start+bucketFrames);
  let sum=0,peak=0;
  for (let frame=start;frame<end;frame++) for(let ch=0;ch<fmt.channels;ch++) {
    const value=Math.abs(sample(frame,ch));
    sum+=value*value; peak=Math.max(peak,value); overallPeak=Math.max(overallPeak,value);
    if(value>=.999) clipped++;
  }
  overallSum+=sum;
  const rms=Math.sqrt(sum/((end-start)*fmt.channels));
  buckets.push({second:start/fmt.sampleRate,rms:+rms.toFixed(4),db:+(20*Math.log10(Math.max(rms,1e-9))).toFixed(1),peak:+peak.toFixed(4)});
}
console.log(JSON.stringify({format:fmt,duration:+(samples/fmt.sampleRate).toFixed(2),peak:+overallPeak.toFixed(4),rms:+Math.sqrt(overallSum/(samples*fmt.channels)).toFixed(4),clippedSamples:clipped,buckets},null,2));
