export function getSecretKey() {
  return process.env.SECRET_KEY || 'secret';
}
