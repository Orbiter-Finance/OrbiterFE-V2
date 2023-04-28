import http from './index'

export async function getWebStatus() {
  try {
    const res = await http.get('/check_available');
    return res.data.status === 'success';
  } catch (error) {
    console.error('Failed to get l2data', error);
    return false;
  }
}
