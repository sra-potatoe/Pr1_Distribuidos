const req = {
    codigo_mesa: 1010200001001,
    votos_emitidos: 788,
    ausentismo: 89,
    p1: 140, p2: 39, p3: 124, p4: 345,
    votos_blancos: 76,
    votos_nulos: 64,
    apertura_hora: 8, apertura_minutos: 1,
    cierre_hora: 16, cierre_minutos: 4,
    fuente: 'N8N',
    creado_por: 'test'
};

fetch('http://localhost:3001/api/oficial/acta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
}).then(async r => {
    console.log('STATUS:', r.status);
    const text = await r.text();
    console.log('TEXT:', text);
}).catch(e => console.error('ERROR:', e.message));
