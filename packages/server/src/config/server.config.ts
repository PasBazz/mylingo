const configurations: any = {
  development: { ssl: false, port: 4000, hostname: 'localhost' },
  production: { ssl: true, port: 443, hostname: 'example.com' },
};

const environment = process.env.NODE_ENV || 'development';
const config = configurations[environment];

export default config;
