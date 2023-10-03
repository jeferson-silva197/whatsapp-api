FROM node:18
# Defina o diretório de trabalho
WORKDIR /app
# Copie os arquivos de aplicação
COPY package*.json ./
COPY . .

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Instale as dependências da aplicação
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Exponha a porta
EXPOSE 8000

# Inicie a aplicação
CMD ["npm", "run", "start"]