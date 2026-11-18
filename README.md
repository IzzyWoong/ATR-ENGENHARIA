# ATR Engenharia

Projeto pronto para desenvolvimento local e publicação na Vercel. O domínio e as URLs públicas de SEO estão configurados para `https://atr.eng.br`.

## Executar no VS Code

1. Extraia o ZIP e abra a pasta do projeto extraída no VS Code.
2. Instale as dependências com `npm install`.
3. Inicie o site localmente com `npm run dev`.
4. Para gerar a versão de produção, execute `npm run build`.

## Publicar na Vercel

Importe a pasta do projeto a partir de um repositório Git na Vercel. A configuração incluída executa `npm run build` e publica `dist/public`. Depois, associe o domínio `atr.eng.br` ao projeto na Vercel.

O build gera a página otimizada e as versões finais do sitemap e do robots.txt. As dependências ficam declaradas em `package.json` e são instaladas com `npm install`.
