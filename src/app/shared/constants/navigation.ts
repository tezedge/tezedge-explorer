export function openInTzStats(network: string, id: string | number): void {
  if (network === 'mainnet') {
    network = '';
  } else {
    network += '.';
  }
  window.open('https://' + network + 'tzstats.com/' + id, '_blank');
}
