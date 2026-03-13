const API = "http://localhost:3000/api";

export const getNodos = async () => {
  const res = await fetch(`${API}/nodos`);
  return res.json();
};

export const getCluster = async () => {
  const res = await fetch(`${API}/cluster/totales`);
  return res.json();
};

export const getCrecimiento = async (id) => {
  const res = await fetch(`${API}/nodos/${id}/crecimiento`);
  return res.json();
};

export const enviarComando = async (id_regional, comando) => {
  const res = await fetch(`${API}/comando`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_regional, comando }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};