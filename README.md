# DUCK HUNT JS v3.0

[Jogar o jogo](https://duckhuntjs.com)

Esta é uma implementação do Duck Hunt em Javascript e HTML5. Utiliza o motor de renderização PixiJS, animações com Green Sock, Howler e Bluebird Promises.

## Renderização
Este jogo suporta renderização WebGL e Canvas através do motor PixiJS.

## Áudio
O jogo tentará utilizar a WebAudioAPI e, caso não seja suportada, fará fallback para o HTML5 Audio. O áudio é carregado e controlado pelo HowlerJS.

## Animações (Tweening)
As animações do jogo são uma combinação de MovieClips do PixiJS construídos a partir de sprites e tweens. Como o PixiJS não oferece uma API de tweening nativa, foi utilizado o Green Sock.

## Lógica do Jogo
O fluxo do jogo é gerenciado em Javascript. Os principais blocos de lógica de negócio são implementados como classes ES6, transpiladas para ES5 usando Babel.

## Trabalhando com o Repositório

 - É necessário ter o [Node.js](https://nodejs.org/) instalado.
 - Clone o repositório em um diretório de sua preferência.
 - Entre no diretório com `cd` e execute `npm install`.
 - Use `npm start` para iniciar um servidor local que deixará o jogo disponível em http://localhost:8080/. Erros de origem cruzada (CORS) impedem o acesso via protocolo `file://` no navegador. O comando também ativa recompilação automática e reload da página quando mudanças forem detectadas no diretório `src`.
 - Para gerar manualmente um build do código da aplicação, execute `npm run build`.
 
## Trabalhando com Áudio e Imagens
Este repositório já inclui os arquivos `dist` commitados para facilitar a configuração inicial. Se quiser alterar a aparência ou os sons do jogo, será necessário trabalhar com sprites de áudio e imagem. As seguintes tarefas tornam isso possível:

 - Para recompilar os assets de áudio use `npm run audio` (requer [ffmpeg](https://ffmpeg.org/download.html) instalado).
 - Para recompilar os assets de imagem use `npm run images` (requer [TexturePacker](https://www.codeandweb.com/texturepacker/download) instalado).

## Bugs
Reporte bugs como [issues](https://github.com/MattSurabian/DuckHunt-JS/issues).

## Contribuindo
Pull requests são bem-vindos! Por favor, garanta conformidade de estilo e qualidade de código com `npm run lint` e inclua os arquivos de build gerados.
