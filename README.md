# Trunfo

Monte um baralho **Super Trunfo** da família: foto, atributos, carta coringa e folhas prontas para imprimir no tamanho de carta de Pokémon (63 × 88 mm).

O editor abre em [http://localhost:3001](http://localhost:3001). A API sobe em [http://localhost:3002](http://localhost:3002) e só entra em cena para transformar a foto no estilo Pixar.

## O que dá para fazer

- Escolher o visual **Super Trunfo** ou **Herói**
- Colocar nome, foto e os atributos força, altura, peso e ano
- Marcar uma carta como a **Super Trunfo**
- Arrastar e aproximar a foto direto na carta (zoom de 1 a 3)
- Colar uma imagem com `Ctrl+V` e copiar a foto da carta com `Ctrl+C`
- Transformar a foto em personagem 3D (precisa da chave da OpenAI)
- Guardar o baralho no navegador e imprimir até 9 cartas por folha A4

Na primeira visita, se ainda não houver baralho salvo, o editor carrega um baralho de exemplo (pessoas da família, sem foto) para você editar em vez de começar do zero.

## Como rodar

Precisa de Node.js 20 ou mais novo.

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | API e site juntos |
| `npm run dev:web` | Só o editor, porta 3001 |
| `npm run dev:api` | Só a API, porta 3002 |
| `npm run build` | Compila os dois apps |
| `npm run start` | Sobe o que foi compilado |
| `npm run lint` | Checa TypeScript e ESLint |

A chave da OpenAI é opcional. Sem ela o editor funciona inteiro; o botão **Pixar** responde que a chave não está configurada.

## Monte uma carta

Exemplo: a carta do Leo, código `2B`, visual clássico, marcada como Super Trunfo.

1. Em **Escolha a carta**, deixe **Super Trunfo**.
2. No nome, escreva `Super Leo` (no máximo 20 caracteres).
3. Em **Foto**, escolha um arquivo, ou copie uma imagem e cole com `Ctrl+V` fora dos campos de texto.
4. Na prévia, arraste a foto. Use `+` e `−` para aproximar.
5. Preencha os atributos. Vírgula e ponto valem como decimal (`1,78` vira `1.78`). Campo vazio aparece como `—`.

| Atributo | Exemplo | Na carta |
| --- | --- | --- |
| Força | `90` | 90 |
| Altura | `180` | 180 cm |
| Peso | `77` | 77 kg |
| Ano de nascimento | `2000` | 2000 |

6. Marque **Esta é a carta Super Trunfo!**
7. Clique em **Salvar carta**. O código (`1A` … `8D`) é sorteado entre os que ainda estão livres. São 8 grupos e 4 letras, 32 códigos no total.

A carta aparece assim na folha:

```text
┌──────────────────────┐
│ 2B          SUPER    │
│ SUPER LEO   TRUNFO   │
│ ┌──────────────────┐ │
│ │                  │ │
│ │       foto       │ │
│ │                  │ │
│ └──────────────────┘ │
│ Força            90  │
│ Altura        180 cm │
│ Peso           77 kg │
│ Ano             2000 │
└──────────────────────┘
```

Para começar outra, use **Nova carta**. Para mudar uma já salva, clique nela em **Minhas cartas**.

### Estilo Pixar

Com a foto na carta, o botão **Pixar** manda a imagem para a API. A pessoa, a pose e a roupa permanecem; o desenho vira um personagem 3D sorridente. A resposta substitui a foto da carta. Dá para desfazer escolhendo outra imagem ou em **Tirar a foto**.

### Imprimir

**Imprimir minhas cartas** abre a impressão do navegador. Use escala **100%**, papel A4. Nove cartas por folha, no tamanho 63 × 88 mm. Três cartas viram uma folha; dez cartas viram duas.

## O que fica salvo

Cada carta guardada tem esta forma. A foto é um data URL (`data:image/...;base64,...`) ou `null`.

```json
{
  "id": "7c2a9e14-1b0d-4f6a-9c33-0a1b2c3d4e5f",
  "nome": "Super Leo",
  "imagem": null,
  "imagemX": 50,
  "imagemY": 0,
  "imagemZoom": 1.4,
  "trunfo": true,
  "template": "classico",
  "forca": 90,
  "altura": 180,
  "peso": 77,
  "ano": 2000,
  "codigo": "2B"
}
```

O baralho inteiro fica no IndexedDB do navegador (banco `trunfo`, store `baralho`). Trocar de computador ou limpar os dados do site apaga as cartas. `template` aceita `"classico"` ou `"heroi"`. `imagemX` e `imagemY` vão de 0 a 100. `imagemZoom` vai de 1 a 3, em passos de 0,1.

## API

### Saúde

```bash
curl http://localhost:3002/health
```

```json
{ "status": "ok", "service": "trunfo-api" }
```

### Transformar uma foto

O corpo é JSON. `imagem` precisa ser um data URL `image/jpeg`, `image/png` ou `image/webp`, com mais de 40 caracteres e menos de 8 MB.

```bash
curl -X POST http://localhost:3002/imagens/pixar \
  -H "Content-Type: application/json" \
  -d '{"imagem":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."}'
```

Resposta quando dá certo:

```json
{ "imagem": "data:image/jpeg;base64,/9j/4AAQ..." }
```

Resposta quando falta a foto, ou o data URL não serve:

```json
{ "erro": "Envie uma foto para transformar" }
```

| Status | Quando |
| --- | --- |
| 200 | Foto transformada |
| 400 | Corpo sem uma imagem válida |
| 502 | A OpenAI falhou ou recusou a chave |
| 503 | `OPENAI_API_KEY` vazia |

O navegador do editor em `http://localhost:3001` já está liberado no CORS. Outra origem precisa entrar em `CORS_ORIGIN`.

## Variáveis

`apps/api/.env`

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `PORT` | `3002` | Porta da API |
| `CORS_ORIGIN` | `http://localhost:3001` | Origem liberada |
| `NODE_ENV` | `development` | Ambiente |
| `OPENAI_API_KEY` | vazio | Chave usada só no botão Pixar |

`apps/web/.env.local`

| Variável | Padrão | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3002` | Endereço da API no editor |

## Estrutura

```text
apps/
  web/          editor Next.js (@trunfo/web)
    src/app/            página única
    src/components/     formulário, prévia e folha de impressão
    src/lib/            carta, códigos, armazenamento e cliente da API
  api/          Express (@trunfo/api)
    src/routes/         /health e /imagens/pixar
    src/pixar.ts        chamada à OpenAI (gpt-image-1.5)
```
