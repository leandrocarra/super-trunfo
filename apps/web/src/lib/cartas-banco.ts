const BANCO = "trunfo";
const VERSAO = 1;
const STORE = "baralho";
const CHAVE = "cartas";

function abrirBanco(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(BANCO, VERSAO);

    pedido.onupgradeneeded = () => {
      const banco = pedido.result;

      if (!banco.objectStoreNames.contains(STORE)) {
        banco.createObjectStore(STORE);
      }
    };

    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () =>
      reject(pedido.error ?? new Error("Não foi possível abrir o armazenamento"));
  });
}

export function lerBaralho(): Promise<string | null> {
  return abrirBanco().then(
    (banco) =>
      new Promise((resolve, reject) => {
        const tx = banco.transaction(STORE, "readonly");
        const pedido = tx.objectStore(STORE).get(CHAVE);

        pedido.onsuccess = () => {
          resolve(typeof pedido.result === "string" ? pedido.result : null);
        };
        pedido.onerror = () => {
          banco.close();
          reject(pedido.error ?? new Error("Não foi possível ler as cartas"));
        };
        tx.oncomplete = () => banco.close();
      }),
  );
}

export function gravarBaralho(raw: string): Promise<void> {
  return abrirBanco().then(
    (banco) =>
      new Promise((resolve, reject) => {
        const tx = banco.transaction(STORE, "readwrite");

        tx.objectStore(STORE).put(raw, CHAVE);
        tx.oncomplete = () => {
          banco.close();
          resolve();
        };
        tx.onerror = () => {
          banco.close();
          reject(tx.error ?? new Error("Não foi possível guardar as cartas"));
        };
        tx.onabort = () => {
          banco.close();
          reject(tx.error ?? new Error("Não foi possível guardar as cartas"));
        };
      }),
  );
}
