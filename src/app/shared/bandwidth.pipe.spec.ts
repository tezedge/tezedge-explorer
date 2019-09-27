import { BandwidthPipe } from './bandwidth.pipe';

describe('BandwidthPipe', () => {
  it('create an instance', () => {
    const pipe = new BandwidthPipe();
    expect(pipe).toBeTruthy();
  });
});
