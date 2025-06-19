# Alpine é sempre mais leve
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Instala as dependências de produção (remove cache para reduzir tamanho da imagem)
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 3000

# Define o usuário não-root para melhor segurança
USER node

CMD ["npm", "run", "dev"]
