/** @type {import('next').NextConfig} */
const nextConfig = {
  
    experimental: {
        serverActions: true,
      },
      eslint: {
        ignoreDuringBuilds: true,
    },
  

      webpack: (config, { isServer }) => {
        // Adicione regras para lidar com arquivos binários
        config.module.rules.push({
          test: /\.(node)$/,
          use: 'file-loader',
        });
    
        // Adicione externals se for para o ambiente do servidor (Node.js)
        if (isServer) {
          config.externals.push('canvas.node');
        }
    
        return config;
      },
     
     
}

module.exports = nextConfig
