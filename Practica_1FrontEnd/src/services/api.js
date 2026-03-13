const API = "http://localhost:3000/api";

export const getNodos = async () => {
 const res = await fetch(`${API}/nodos`);
 return res.json();
};

export const getCluster = async () => {
 const res = await fetch(`${API}/cluster/totales`);
 return res.json();
};